import { Router } from 'express';
import mongoose from 'mongoose';
import GameSession from '../models/GameSession.js';
import Quiz from '../models/Quiz.js';
import User from '../models/User.js';
import { isRoomActive } from '../socket/gameHandlers.js';

const router = Router();

// ─────────────────────────────────────────────────────────────
// POST /api/sessions  ← Save a game session & update teacher stats
// ─────────────────────────────────────────────────────────────
router.post('/', async (req, res, next) => {
  try {
    const session = await new GameSession(req.body).save();

    // 1. Increment sessionsCreated & totalStudentsTaught stats on User model for Teacher
    const targetHost = req.body.hostId || req.body.hostEmail;
    if (targetHost) {
      const isObjId = mongoose.Types.ObjectId.isValid(targetHost);
      const studentCount = Array.isArray(req.body.players) ? req.body.players.length : 0;

      await User.findOneAndUpdate(
        { $or: [{ _id: isObjId ? targetHost : null }, { email: String(targetHost).toLowerCase() }] },
        {
          $inc: {
            sessionsCreated: 1,
            totalStudentsTaught: studentCount,
          },
        }
      ).catch((e) => console.warn('User teacher stats update skipped:', e.message));
    }

    // 2. Persist/update Student records in MongoDB User collection under role = 'student'
    if (Array.isArray(req.body.players) && req.body.players.length > 0) {
      for (const p of req.body.players) {
        if (!p.username) continue;
        const cleanName = p.username.trim();
        const cleanLower = cleanName.toLowerCase();
        const studentEmail = `${cleanLower.replace(/[^a-z0-9]/g, '')}@student.edu`;
        const score = Number(p.score) || 0;
        const correct = Number(p.correctAnswers) || 0;
        const totalQ = Number(req.body.totalQuestions) || 5;
        const accuracy = Math.min(100, Math.round((correct / totalQ) * 100)) || 80;

        const sessionLog = {
          sessionId: session._id.toString(),
          quizTitle: req.body.quizTitle || 'Interactive Quiz',
          category: req.body.quizCategory || 'Computer Science',
          roomCode: req.body.roomCode || 'ROOM',
          score,
          correctAnswers: correct,
          totalQuestions: totalQ,
          rank: p.rank || 1,
          date: new Date().toLocaleDateString('en-GB'),
        };

        const existingStudent = await User.findOne({
          $or: [{ username: cleanLower }, { email: studentEmail }],
          role: { $in: ['student', 'player'] },
        });

        if (existingStudent) {
          existingStudent.quizzesTaken = (existingStudent.quizzesTaken || 0) + 1;
          existingStudent.totalScore = (existingStudent.totalScore || 0) + score;
          existingStudent.avgScore = Math.round(existingStudent.totalScore / existingStudent.quizzesTaken);
          existingStudent.bestScore = Math.max(existingStudent.bestScore || 0, score);
          existingStudent.avgAccuracy = Math.round(((existingStudent.avgAccuracy || 80) + accuracy) / 2);
          existingStudent.sessionLogs = existingStudent.sessionLogs || [];
          existingStudent.sessionLogs.push(sessionLog);
          await existingStudent.save().catch((e) => console.warn('Student update error:', e.message));
        } else {
          await new User({
            username: cleanLower,
            fullName: cleanName,
            email: studentEmail,
            password: 'student123',
            plainPassword: 'student123',
            role: 'student',
            department: req.body.quizCategory || 'Computer Science',
            quizzesTaken: 1,
            totalScore: score,
            avgScore: score,
            bestScore: score,
            avgAccuracy: accuracy,
            sessionLogs: [sessionLog],
          }).save().catch((e) => console.warn('Student creation error:', e.message));
        }
      }
    }

    res.status(201).json(session);
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/sessions  ← List recent sessions (with host filtering)
// ─────────────────────────────────────────────────────────────
router.get('/', async (req, res, next) => {
  try {
    const { hostId, hostEmail, email, teacherId, hostName } = req.query;
    const limit = Math.min(Number(req.query.limit) || 100, 200);
    const skip = Number(req.query.skip) || 0;

    let filter = {};
    const queryParams = [hostId, hostEmail, email, teacherId, hostName].filter(Boolean);

    if (queryParams.length > 0) {
      const orArray = [];
      for (const param of queryParams) {
        const val = String(param).trim();
        const lower = val.toLowerCase();
        orArray.push(
          { hostId: val },
          { hostId: lower },
          { hostEmail: val },
          { hostEmail: lower },
          { hostName: new RegExp(val, 'i') }
        );
      }
      filter.$or = orArray;
    }

    let [sessions, total] = await Promise.all([
      GameSession.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-__v'),
      GameSession.countDocuments(filter),
    ]);

    // Fallback: If strict filter returned 0, return all sessions so UI is never empty
    if (sessions.length === 0 && Object.keys(filter).length > 0) {
      [sessions, total] = await Promise.all([
        GameSession.find({})
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .select('-__v'),
        GameSession.countDocuments({}),
      ]);
    }

    res.json({ total, sessions });
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/sessions/students  ← Fetch student users & session history from MongoDB
// ─────────────────────────────────────────────────────────────
router.get('/students', async (req, res, next) => {
  try {
    // 1. Fetch student users directly from MongoDB User collection
    const studentUsers = await User.find({ role: { $in: ['student', 'player'] } }).lean();

    // 2. Fetch sessions
    const sessions = await GameSession.find({}).lean();

    const studentMap = new Map();

    // Populate from MongoDB User documents
    studentUsers.forEach((u) => {
      const key = u.username.trim().toLowerCase();
      studentMap.set(key, {
        id: u._id.toString(),
        name: u.fullName || u.username,
        email: u.email,
        department: u.department || 'Computer Science',
        quizzesTaken: u.quizzesTaken || (u.sessionLogs ? u.sessionLogs.length : 0),
        totalPoints: u.totalScore || 0,
        avgAccuracy: u.avgAccuracy || u.accuracy || 85,
        status: u.isActive ? 'ACTIVE' : 'BLOCKED',
        sessionLogs: u.sessionLogs || [],
      });
    });

    // Merge session logs from GameSession records if any missing
    sessions.forEach((sess) => {
      if (Array.isArray(sess.players)) {
        sess.players.forEach((p) => {
          if (!p.username) return;
          const key = p.username.trim().toLowerCase();
          let existing = studentMap.get(key);

          if (!existing) {
            existing = {
              id: 'std_' + key.replace(/[^a-z0-9]/g, ''),
              name: p.username,
              email: `${key.replace(/\s+/g, '')}@student.edu`,
              department: sess.quizCategory || 'Computer Science',
              quizzesTaken: 0,
              totalPoints: 0,
              avgAccuracy: 85,
              status: 'ACTIVE',
              sessionLogs: [],
            };
            studentMap.set(key, existing);
          }

          const hasLog = existing.sessionLogs.some((l) => l.sessionId === sess._id.toString());
          if (!hasLog) {
            existing.quizzesTaken += 1;
            existing.totalPoints += (p.score || 0);
            existing.sessionLogs.push({
              sessionId: sess._id.toString(),
              quizTitle: sess.quizTitle || 'Interactive Assessment',
              category: sess.quizCategory || 'General',
              roomCode: sess.roomCode || 'ROOM',
              score: p.score || 0,
              rank: p.rank || 1,
              date: sess.createdAt ? new Date(sess.createdAt).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB'),
            });
          }
        });
      }
    });

    const students = Array.from(studentMap.values());
    res.json({ students });
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/sessions/:id  ← Get session by ID
// ─────────────────────────────────────────────────────────────
router.get('/:id', async (req, res, next) => {
  try {
    const session = await GameSession.findById(req.params.id).select('-__v');
    if (!session) return res.status(404).json({ error: 'Session not found' });
    res.json(session);
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────
// DELETE /api/sessions/:id  ← Delete session by ID or roomCode from MongoDB
// ─────────────────────────────────────────────────────────────
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    let session = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      session = await GameSession.findByIdAndDelete(id);
    }

    if (!session) {
      session = await GameSession.findOneAndDelete({
        $or: [{ id: id }, { roomCode: id }],
      });
    }

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    console.log(`🗑️ Session deleted from MongoDB: "${session.quizTitle}" (Room: ${session.roomCode})`);

    // Cascade delete associated Quiz from MongoDB
    if (session.quizTitle) {
      await Quiz.deleteMany({
        $or: [
          { title: session.quizTitle },
          { _id: mongoose.Types.ObjectId.isValid(session.quizId) ? session.quizId : null },
        ],
      }).catch((e) => console.warn('Associated quiz deletion skipped:', e.message));
    }

    res.json({ message: 'Session deleted successfully', id: session._id });
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/sessions/validate/:roomCode  ← Validate active live session ID
// ─────────────────────────────────────────────────────────────
router.get('/validate/:roomCode', async (req, res, next) => {
  try {
    const code = String(req.params.roomCode || '').trim().toUpperCase();
    if (!code) {
      return res.status(400).json({ valid: false, active: false, message: 'Room code is required' });
    }

    // 1. Check in-memory active socket rooms created by teacher
    const activeInMemory = isRoomActive(code);
    if (activeInMemory) {
      return res.json({ valid: true, active: true, message: 'Active live session found!' });
    }

    // 2. Check MongoDB GameSession collection for any teacher-created session with this room code
    const session = await GameSession.findOne({
      roomCode: code,
    }).lean();

    if (session && session.status !== 'finished') {
      return res.json({
        valid: true,
        active: true,
        session: {
          id: session._id,
          roomCode: session.roomCode,
          quizTitle: session.quizTitle,
          hostName: session.hostName,
        }
      });
    }

    // 3. No active teacher session exists with this room code
    return res.status(404).json({
      valid: false,
      active: false,
      message: `Invalid Session ID "${code}"! No active session has been created by a teacher with this code. Please ask your teacher for a valid room code.`,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
