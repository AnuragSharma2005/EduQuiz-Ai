import { Router } from 'express';
import mongoose from 'mongoose';
import GameSession from '../models/GameSession.js';
import Quiz from '../models/Quiz.js';
import User from '../models/User.js';

const router = Router();

// ─────────────────────────────────────────────────────────────
// POST /api/sessions  ← Save a game session & update teacher stats
// ─────────────────────────────────────────────────────────────
router.post('/', async (req, res, next) => {
  try {
    const session = await new GameSession(req.body).save();

    // Increment sessionsCreated & totalStudentsTaught stats on User model
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
    const { hostId, hostEmail, email, teacherId } = req.query;
    const limit = Math.min(Number(req.query.limit) || 50, 100);
    const skip = Number(req.query.skip) || 0;

    const filter = {};
    const targetHost = hostId || hostEmail || email || teacherId;

    if (targetHost) {
      const lower = String(targetHost).toLowerCase();
      filter.$or = [
        { hostId: targetHost },
        { hostId: lower },
        { hostEmail: targetHost },
        { hostEmail: lower },
      ];
    }

    const [sessions, total] = await Promise.all([
      GameSession.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-__v'),
      GameSession.countDocuments(filter),
    ]);

    res.json({ total, sessions });
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/sessions/students  ← Fetch aggregated student data for a teacher
// ─────────────────────────────────────────────────────────────
router.get('/students', async (req, res, next) => {
  try {
    const { hostId, hostEmail } = req.query;
    let filter = {};
    if (hostId || hostEmail) {
      const targetHost = hostId || hostEmail;
      const lower = String(targetHost).toLowerCase();
      filter.$or = [
        { hostId: targetHost },
        { hostId: lower },
        { hostEmail: targetHost },
        { hostEmail: lower },
      ];
    }

    const sessions = await GameSession.find(filter).lean();
    const studentMap = new Map();

    sessions.forEach((sess) => {
      if (Array.isArray(sess.players)) {
        sess.players.forEach((p) => {
          if (!p.username) return;
          const key = p.username.trim().toLowerCase();
          const existing = studentMap.get(key) || {
            id: 'std_' + key.replace(/[^a-z0-9]/g, ''),
            name: p.username,
            email: `${key.replace(/\s+/g, '')}@student.edu`,
            department: sess.quizCategory || 'Computer Science',
            quizzesTaken: 0,
            totalPoints: 0,
            avgAccuracy: 85,
            status: 'ACTIVE',
          };

          existing.quizzesTaken += 1;
          existing.totalPoints += (p.score || 0);
          existing.avgAccuracy = Math.min(100, Math.round((existing.totalPoints / (existing.quizzesTaken * 500)) * 100) || 85);
          studentMap.set(key, existing);
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

export default router;
