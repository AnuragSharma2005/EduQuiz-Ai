import { Router } from 'express';
import mongoose from 'mongoose';
import Quiz from '../models/Quiz.js';
import GameSession from '../models/GameSession.js';
import User from '../models/User.js';
import { generateQuizWithAI } from '../services/groqService.js';

const router = Router();

// ─────────────────────────────────────────────────────────────
// POST /api/quizzes/generate  ← AI-powered quiz generation
// IMPORTANT: must be declared BEFORE /:id to avoid route conflict
// ─────────────────────────────────────────────────────────────
router.post('/generate', async (req, res, next) => {
  try {
    const { topic, count, difficulty } = req.body;

    if (!topic || !topic.trim()) {
      return res.status(400).json({ error: 'topic is required' });
    }

    const safeCount = Math.min(Math.max(Number(count) || 5, 1), 50);
    const safeDifficulty = ['Easy', 'Medium', 'Hard'].includes(difficulty) ? difficulty : 'Medium';

    console.log(`🤖 Generating quiz: "${topic}" | ${safeCount}q | ${safeDifficulty}`);

    const quizData = await generateQuizWithAI({
      topic: topic.trim(),
      count: safeCount,
      difficulty: safeDifficulty,
    });

    // Persist to MongoDB (non-blocking — don't fail the response if DB write fails)
    try {
      const saved = await new Quiz(quizData).save();
      quizData._id = saved._id.toString();
      console.log(`✅ AI quiz saved to DB: "${saved.title}" (${saved.questions.length} questions)`);
    } catch (dbErr) {
      console.warn('⚠️  Could not persist AI quiz to DB:', dbErr.message);
    }

    res.json(quizData);
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/quizzes  ← Create quiz manually
// ─────────────────────────────────────────────────────────────
router.post('/', async (req, res, next) => {
  try {
    const { title, category, difficulty, timePerQuestion, questions, createdBy, teacherId, teacherName } = req.body;

    if (!title || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: 'title and at least one question are required' });
    }

    const quiz = await new Quiz({
      title,
      category: category || 'General',
      difficulty: difficulty || 'Medium',
      timePerQuestion: timePerQuestion || 20,
      questions,
      createdBy: createdBy || teacherId || 'system',
      teacherId: teacherId || createdBy,
      teacherName: teacherName || 'Teacher',
    }).save();

    console.log(`✅ Quiz created for teacher (${quiz.createdBy}): "${quiz.title}" (${quiz.questions.length} questions)`);

    // Increment quizzesCreated stat on User model
    const targetUser = createdBy || teacherId;
    if (targetUser && targetUser !== 'system') {
      const isObjId = mongoose.Types.ObjectId.isValid(targetUser);
      await User.findOneAndUpdate(
        { $or: [{ _id: isObjId ? targetUser : null }, { email: String(targetUser).toLowerCase() }] },
        { $inc: { quizzesCreated: 1 } }
      ).catch((e) => console.warn('User quizzesCreated stat update skipped:', e.message));
    }

    res.status(201).json(quiz);
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────
// PUT /api/quizzes/:id  ← Update quiz manually
// ─────────────────────────────────────────────────────────────
router.put('/:id', async (req, res, next) => {
  try {
    const { title, category, difficulty, timePerQuestion, questions } = req.body;

    if (!title || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: 'title and at least one question are required' });
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      { title, category, difficulty, timePerQuestion, questions },
      { new: true, runValidators: true }
    ).select('-__v');

    if (!updatedQuiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    console.log(`✅ Quiz updated: "${updatedQuiz.title}" (${updatedQuiz.questions.length} questions)`);
    res.json(updatedQuiz);
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/quizzes  ← List quizzes (with optional teacher filtering)
// ─────────────────────────────────────────────────────────────
router.get('/', async (req, res, next) => {
  try {
    const { createdBy, teacherId, email } = req.query;
    const limit = Math.min(Number(req.query.limit) || 50, 100);
    const skip = Number(req.query.skip) || 0;

    const filter = {};
    const searchTarget = createdBy || teacherId || email;

    if (searchTarget) {
      const lower = String(searchTarget).toLowerCase();
      filter.$or = [
        { createdBy: searchTarget },
        { createdBy: lower },
        { teacherId: searchTarget },
        { teacherId: lower }
      ];
    }

    const [quizzes, total] = await Promise.all([
      Quiz.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).select('-__v'),
      Quiz.countDocuments(filter),
    ]);

    res.json({ total, quizzes });
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/quizzes/:id  ← Get quiz by ID
// ─────────────────────────────────────────────────────────────
router.get('/:id', async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id).select('-__v');
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    res.json(quiz);
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────
// DELETE /api/quizzes/:id  ← Delete quiz from MongoDB
// ─────────────────────────────────────────────────────────────
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    let quiz = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      quiz = await Quiz.findByIdAndDelete(id);
    }

    if (!quiz) {
      quiz = await Quiz.findOneAndDelete({
        $or: [
          { id: id },
          { title: id },
        ],
      });
    }

    if (!quiz) {
      console.warn(`⚠️ Attempted to delete non-existent quiz ID/title: ${id}`);
      return res.status(404).json({ error: 'Quiz not found' });
    }

    console.log(`🗑️ Quiz successfully deleted from MongoDB: "${quiz.title}" (${quiz._id})`);

    // Cascade delete any associated GameSessions from MongoDB
    await GameSession.deleteMany({
      $or: [
        { quizTitle: quiz.title },
        { quizId: quiz._id.toString() },
      ],
    }).catch((e) => console.warn('Associated GameSessions deletion skipped:', e.message));

    // Decrement teacher's quizzesCreated stat on User model
    const creator = quiz.createdBy || quiz.teacherId;
    if (creator && creator !== 'system') {
      const isObjId = mongoose.Types.ObjectId.isValid(creator);
      await User.findOneAndUpdate(
        { $or: [{ _id: isObjId ? creator : null }, { email: String(creator).toLowerCase() }] },
        { $inc: { quizzesCreated: -1 } }
      ).catch((e) => console.warn('User quizzesCreated decrement stat update skipped:', e.message));
    }

    res.json({ message: 'Quiz deleted successfully from MongoDB', id: quiz._id, title: quiz.title });
  } catch (err) {
    next(err);
  }
});

export default router;
