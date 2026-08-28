import GameSession from '../models/GameSession.js';
import Quiz from '../models/Quiz.js';
import { updateUserStatsAfterGame } from '../utils/updateUserStats.js';

// In-memory room state — cleared on server restart (intentional: rooms are transient)
const rooms = new Map();

export function isRoomActive(roomCode) {
  if (!roomCode) return false;
  const clean = String(roomCode).trim().toUpperCase();
  return rooms.has(clean);
}

const DEFAULT_FALLBACK_QUIZ = {
  id: 'battle_quiz_default',
  title: 'Adaptive Battle Arena',
  category: 'General Knowledge',
  difficulty: 'Medium',
  questions: [
    {
      id: 'q1',
      text: 'Which planet in our solar system is known as the Red Planet?',
      options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
      correctAnswer: 1,
      timeLimit: 15,
    },
    {
      id: 'q2',
      text: "What is the primary gas found in Earth's atmosphere?",
      options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'],
      correctAnswer: 1,
      timeLimit: 15,
    },
    {
      id: 'q3',
      text: 'What is the chemical symbol for Gold?',
      options: ['Ag', 'Au', 'Fe', 'Cu'],
      correctAnswer: 1,
      timeLimit: 15,
    },
    {
      id: 'q4',
      text: 'Which data structure follows the Last-In, First-Out (LIFO) principle?',
      options: ['Queue', 'Stack', 'Array', 'Linked List'],
      correctAnswer: 1,
      timeLimit: 15,
    },
  ],
};

function createRoom(roomCode) {
  return {
    code: roomCode,
    players: [],
    status: 'lobby',
    currentQuiz: null,
    currentQuestionIndex: 0,
    gameStartTime: null,
    questionAnsweredPlayerIds: [],
  };
}

async function saveGameSession(room, gameDuration) {
  try {
    const contestants = room.players.filter((p) => !p.isHost);
    const scoringPlayers = contestants.length > 0 ? contestants : room.players;

    // Calculate winner
    const winner = scoringPlayers.reduce((top, p) => 
      (p.score > top.score ? p : top), 
      scoringPlayers[0] || {}
    );

    const playerResults = scoringPlayers.map((p) => ({
      userId: p.userId,
      odId: p.id,
      username: p.username,
      avatar: p.avatar,
      score: p.score,
      isHost: p.isHost,
      correctAnswers: p.correctAnswers || 0,
      totalAttempted: p.totalAttempted || 0,
      accuracy: p.totalAttempted > 0 ? Math.round((p.correctAnswers / p.totalAttempted) * 100) : 0,
      answers: p.answers || [],
    }));

    const session = new GameSession({
      roomCode: room.code,
      quizId: room.currentQuiz?._id,
      quizTitle: room.currentQuiz?.title,
      quizCategory: room.currentQuiz?.category,
      quizDifficulty: room.currentQuiz?.difficulty,
      totalQuestions: room.currentQuiz?.questions?.length || 0,
      questionsAttempted: room.currentQuestionIndex + 1,
      hostId: room.hostId,
      gameDuration: gameDuration || 0,
      players: playerResults,
      winner: {
        userId: winner.userId,
        username: winner.username,
        score: winner.score,
      },
      status: 'finished',
      endTime: new Date(),
    });
    
    await session.save();
    console.log(`💾 Game session saved for room ${room.code} | Winner: ${winner.username} (${winner.score} points)`);

    // Update user statistics for each player
    for (const result of playerResults) {
      await updateUserStatsAfterGame(
        {
          score: result.score,
          isWinner: result.userId === winner.userId,
          correctAnswers: result.correctAnswers,
          totalAttempted: result.totalAttempted,
        },
        result.userId
      );
    }
  } catch (err) {
    console.warn(`⚠️  Could not save game session for room ${room.code}:`, err.message);
  }
}

/**
 * Register all game-related Socket.IO event handlers for a single connection.
 * @param {import('socket.io').Server} io
 * @param {import('socket.io').Socket} socket
 */
export function registerGameHandlers(io, socket) {
  console.log(`🔌 Connected: ${socket.id} | Total: ${io.engine.clientsCount}`);

  // Acknowledge connection
  socket.emit('connection_success', {
    id: socket.id,
    message: 'Connected to AdaptiveIQ game server',
  });

  // ── Join Room ────────────────────────────────────────────────
  socket.on('join_room', ({ roomCode, player, quiz }) => {
    if (!roomCode || !player?.id) return;

    socket.join(roomCode);

    if (!rooms.has(roomCode)) {
      if (player && player.isHost) {
        rooms.set(roomCode, createRoom(roomCode));
        console.log(`🏠 Teacher Host created room: ${roomCode}`);
      } else {
        console.warn(`⚠️ Rejected student join for room ${roomCode}: No active teacher room found.`);
        socket.emit('room_error', {
          message: `Invalid Session ID "${roomCode}"! No active session has been created by a teacher with this code.`,
        });
        return;
      }
    }

    const room = rooms.get(roomCode);
    if (quiz && quiz.questions && quiz.questions.length > 0) {
      if (!room.currentQuiz || player.isHost) {
        room.currentQuiz = quiz;
      }
    }

    // Sanitize player username / name
    const rawName = (player.username || player.name || '').toString().trim();
    const cleanUsername = (rawName && rawName !== ',') 
      ? rawName 
      : (player.isHost ? 'Teacher Host' : `Student_${String(player.id).substring(0, 4)}`);

    const playerWithCleanName = { ...player, username: cleanUsername };

    // Prefer an explicit host flag, but fall back to first player if no host set.
    if (playerWithCleanName.isHost || !room.hostId) {
      room.hostId = playerWithCleanName.id;
    }

    const isHost = Boolean(playerWithCleanName.isHost) || (room.hostId === playerWithCleanName.id && room.players.length === 0);

    // Upsert player (reconnect support)
    const existing = room.players.find((p) => p.id === playerWithCleanName.id);
    if (existing) {
      existing.socketId = socket.id; // update socket on reconnect
      existing.username = cleanUsername;
      existing.isHost = isHost;
    } else {
      room.players.push({ 
        ...playerWithCleanName, 
        socketId: socket.id, 
        score: 0, 
        isReady: false,
        correctAnswers: 0,
        totalAttempted: 0,
        answers: [],
        isHost: isHost,
      });
    }

    io.to(roomCode).emit('room_update', room);
    console.log(`📥 ${cleanUsername} (isHost: ${isHost}) joined room ${roomCode} (${room.players.length} players)`);
  });

  // ── Set Quiz ─────────────────────────────────────────────────
  socket.on('set_quiz', ({ roomCode, quiz }) => {
    if (!roomCode) return;
    let room = rooms.get(roomCode);
    if (!room) {
      room = createRoom(roomCode);
      rooms.set(roomCode, room);
    }
    room.currentQuiz = quiz;
    room.currentQuestionIndex = 0;
    io.to(roomCode).emit('room_update', room);
    console.log(`📋 Quiz set in room ${roomCode}: "${quiz?.title}" (${quiz?.questions?.length || 0} questions)`);
  });

  // ── Start Game ───────────────────────────────────────────────
  socket.on('start_game', async ({ roomCode, quiz }) => {
    if (!roomCode) return;
    let room = rooms.get(roomCode);
    if (!room) {
      room = createRoom(roomCode);
      rooms.set(roomCode, room);
    }

    if (quiz && quiz.questions && quiz.questions.length > 0) {
      room.currentQuiz = quiz;
    }

    if (!room.currentQuiz || !room.currentQuiz.questions || room.currentQuiz.questions.length === 0) {
      room.currentQuiz = DEFAULT_FALLBACK_QUIZ;
    }

    room.status = 'starting';
    room.currentQuestionIndex = 0;
    room.gameStartTime = Date.now();
    room.questionAnsweredPlayerIds = [];
    // Reset all player scores for a fresh game
    room.players.forEach((p) => { 
      p.score = 0; 
      p.lastAnswerCorrect = undefined;
      p.correctAnswers = 0;
      p.totalAttempted = 0;
      p.answers = [];
    });

    // --- Persist Quiz & GameSession to MongoDB ---
    try {
      let quizId = room.currentQuiz?._id;
      if (!quizId && room.currentQuiz) {
        const newQuiz = new Quiz({
          title: room.currentQuiz.title || 'Adaptive Arena Quiz',
          category: room.currentQuiz.category || 'General Knowledge',
          difficulty: room.currentQuiz.difficulty || 'Medium',
          questions: room.currentQuiz.questions || [],
        });
        const savedQuiz = await newQuiz.save();
        quizId = savedQuiz._id;
        room.currentQuiz._id = quizId;
        console.log(`✅ Saved Quiz to MongoDB: "${savedQuiz.title}" (${savedQuiz._id})`);
      }

      await GameSession.findOneAndUpdate(
        { roomCode },
        {
          roomCode,
          quizId,
          quizTitle: room.currentQuiz?.title,
          quizCategory: room.currentQuiz?.category,
          quizDifficulty: room.currentQuiz?.difficulty,
          totalQuestions: room.currentQuiz?.questions?.length || 0,
          hostId: room.hostId,
          players: room.players.map((p) => ({
            userId: p.userId,
            odId: p.id,
            username: p.username,
            avatar: p.avatar,
            score: p.score || 0,
            isHost: Boolean(p.isHost),
          })),
          status: 'starting',
        },
        { upsert: true, new: true }
      );
      console.log(`💾 Saved GameSession to MongoDB for room ${roomCode}`);
    } catch (dbErr) {
      console.warn(`⚠️ Could not save GameSession to MongoDB for room ${roomCode}:`, dbErr.message);
    }

    io.to(roomCode).emit('room_update', room);
    console.log(`🎮 Game starting in room ${roomCode} (3s countdown) | Quiz: "${room.currentQuiz?.title}" (${room.currentQuiz?.questions?.length || 0} Qs)`);

    // 3-second countdown then show first question
    setTimeout(() => {
      const r = rooms.get(roomCode);
      if (!r) return;
      r.status = 'question';
      r.questionStartTime = Date.now();
      io.to(roomCode).emit('room_update', r);
    }, 3000);
  });

  // ── Submit Answer ────────────────────────────────────────────
  socket.on('submit_answer', ({ roomCode, playerId, selectedAnswer, correctAnswer, isCorrect, timeSpent, score }) => {
    const room = rooms.get(roomCode);
    if (!room || room.status !== 'question') return;

    const player = room.players.find((p) => p.id === playerId);
    if (player?.isHost) {
      return;
    }

    if (!player) return;

    console.log(`✉️ submit_answer: room=${roomCode} player=${playerId} selected=${selectedAnswer} isCorrect=${isCorrect}`);

    if (!room.questionAnsweredPlayerIds.includes(playerId)) {
      room.questionAnsweredPlayerIds.push(playerId);
    }

    player.score += Math.max(0, score || 0);
    player.lastAnswerCorrect = isCorrect;
    player.totalAttempted = (player.totalAttempted || 0) + 1;
    
    if (isCorrect) {
      player.correctAnswers = (player.correctAnswers || 0) + 1;
    }

    // Store answer details for analytics
    player.answers.push({
      questionIndex: room.currentQuestionIndex,
      selectedAnswer: selectedAnswer,
      correctAnswer: correctAnswer,
      isCorrect: isCorrect,
      timeSpent: timeSpent || 0,
      points: score || 0,
    });
    // Log updated player for debugging (confirm lastAnswerCorrect is set)
    try {
      console.log('🔎 Updated player after submit:', {
        id: player.id,
        username: player.username,
        lastAnswerCorrect: player.lastAnswerCorrect,
        score: player.score,
      });
    } catch (e) {
      console.warn('Could not log player after submit', e.message);
    }

    const contestants = room.players.filter((p) => !p.isHost);
    const allAnswered = contestants.length > 0 && contestants.every((contestant) => room.questionAnsweredPlayerIds.includes(contestant.id));

    console.log(`ℹ️ answeredCount=${room.questionAnsweredPlayerIds.length} contestants=${contestants.length} allAnswered=${allAnswered}`);

    if (allAnswered) {
      room.status = 'leaderboard';
      console.log(`🏁 All answered in room ${roomCode} — moving to leaderboard`);
      try {
        console.log('🔔 Emitting leaderboard — players lastAnswerCorrect:', room.players.map(p => ({ id: p.id, lastAnswerCorrect: p.lastAnswerCorrect })));
      } catch (e) {
        console.warn('Could not log players on leaderboard', e.message);
      }
    }

    io.to(roomCode).emit('room_update', room);
  });

  // ── Show Leaderboard ─────────────────────────────────────────
  socket.on('show_leaderboard', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room) return;
    room.status = 'leaderboard';
    room.questionAnsweredPlayerIds = room.questionAnsweredPlayerIds || [];
    console.log(`🟣 Host requested leaderboard in room ${roomCode}`);
    try {
      console.log('🔔 Host trigger — players lastAnswerCorrect:', room.players.map(p => ({ id: p.id, lastAnswerCorrect: p.lastAnswerCorrect })));
    } catch (e) {
      console.warn('Could not log players on host leaderboard request', e.message);
    }
    io.to(roomCode).emit('room_update', room);
  });

  // ── Next Question ────────────────────────────────────────────
  socket.on('next_question', async ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room) return;

    const totalQuestions = room.currentQuiz?.questions?.length || 0;

    if (totalQuestions > 0 && room.currentQuestionIndex < totalQuestions - 1) {
      room.currentQuestionIndex += 1;
      room.status = 'question';
      room.questionStartTime = Date.now();
      room.questionAnsweredPlayerIds = [];
    } else if (totalQuestions > 0 && room.currentQuestionIndex >= totalQuestions - 1) {
      // Last question done → finish the game
      room.status = 'finished';
      const gameDuration = room.gameStartTime ? Math.round((Date.now() - room.gameStartTime) / 1000) : 0;
      await saveGameSession(room, gameDuration);
    } else {
      console.warn(`⚠️ next_question called in room ${roomCode} but totalQuestions is ${totalQuestions}`);
    }

    io.to(roomCode).emit('room_update', room);
  });

  // ── End Game ─────────────────────────────────────────────────
  socket.on('end_game', async ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room) return;

    room.status = 'finished';
    const gameDuration = room.gameStartTime ? Math.round((Date.now() - room.gameStartTime) / 1000) : 0;
    await saveGameSession(room, gameDuration);
    io.to(roomCode).emit('room_update', room);
    console.log(`🏁 Game manually ended by host in room ${roomCode}`);
  });

  // ── Disconnect ───────────────────────────────────────────────
  socket.on('disconnect', (reason) => {
    console.log(`🔌 Disconnected: ${socket.id} (${reason}) | Total: ${io.engine.clientsCount}`);

    rooms.forEach((room, roomCode) => {
      const idx = room.players.findIndex((p) => p.socketId === socket.id);
      if (idx === -1) return;

      const [removed] = room.players.splice(idx, 1);
      console.log(`📤 ${removed.username} left room ${roomCode}`);

      if (room.players.length === 0) {
        rooms.delete(roomCode);
        console.log(`🗑️  Room ${roomCode} removed (empty)`);
      } else {
        io.to(roomCode).emit('room_update', room);
      }
    });
  });

  socket.on('error', (err) => console.error('❌ Socket error:', err));
}
