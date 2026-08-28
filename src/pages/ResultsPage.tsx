import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Home, BarChart3 } from 'lucide-react';
import { Button, Card } from '../components/UI';
import { useGameStore } from '../store/useGameStore';
import { cn } from '../utils/constants';

import { useStudentStore, StudentAssessmentHistoryItem } from '../student/studentStore';
import { LiveChatWidget } from '../components/LiveChatWidget';

const RenderAvatar = ({ avatar, className, fallback = '🐱' }: { avatar?: string; className?: string; fallback?: string }) => {
  const isUrl = avatar && (avatar.startsWith('http://') || avatar.startsWith('https://') || avatar.startsWith('data:') || avatar.startsWith('/'));
  if (isUrl) {
    return <img src={avatar} alt="avatar" className={className} referrerPolicy="no-referrer" />;
  }
  return (
    <div className={cn("flex items-center justify-center bg-sky-950/80 border border-sky-500/30 text-3xl font-bold rounded-2xl shadow-xl", className)}>
      {avatar && avatar !== '🎓' ? avatar : fallback}
    </div>
  );
};

export const ResultsPage = () => {
  const navigate = useNavigate();
  const { players, me, resetGame, roomCode, currentQuiz } = useGameStore();
  const { setSelectedTab, isStudentAuth, addHistoryItem } = useStudentStore();
  const hasRecordedRef = useRef(false);

  const contestants = players.filter((player) => !player.isHost);
  const finalPlayers = contestants.length > 0 ? contestants : players;

  const sortedPlayers = [...finalPlayers].sort((a, b) => b.score - a.score);
  const top3 = sortedPlayers.slice(0, 3);
  const rest = sortedPlayers.slice(3);

  const myIndex = sortedPlayers.findIndex(
    (p) => (me?.id && p.id === me.id) || (me?.username && p.username?.toLowerCase() === me.username.toLowerCase())
  );
  const myRank = myIndex !== -1 ? myIndex + 1 : (sortedPlayers.length > 0 ? sortedPlayers.length : 1);
  const myPlayerObj = myIndex !== -1 ? sortedPlayers[myIndex] : (sortedPlayers[0] || me || { id: 'std', username: 'Student', score: 0, avatar: '🎓' });

  const rawCorrect = (myPlayerObj as any)?.correctAnswers;
  const answersArr = (myPlayerObj as any)?.answers;
  const computedCorrect = typeof rawCorrect === 'number' && rawCorrect > 0
    ? rawCorrect
    : Array.isArray(answersArr) && answersArr.length > 0
      ? answersArr.filter((a: any) => a.isCorrect).length
      : Math.min(
          currentQuiz?.questions?.length || 10,
          Math.max(0, Math.round((myPlayerObj?.score || 0) / 1000))
        );

  const isZeroScore = (myPlayerObj?.score || 0) === 0 || computedCorrect === 0;
  const isWinner = myRank === 1 && !isZeroScore;
  const isLastRank = !isWinner && (isZeroScore || myRank === sortedPlayers.length);

  useEffect(() => {
    if (isWinner) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#ec4899', '#10b981', '#f59e0b']
      });
    }

    if (!hasRecordedRef.current && isStudentAuth) {
      hasRecordedRef.current = true;
      const totalQ = currentQuiz?.questions?.length || 4;
      const historyItem: StudentAssessmentHistoryItem = {
        id: `hist_${roomCode || 'QUIZ'}_${Date.now()}`,
        roomCode: roomCode || 'LIVE01',
        assessmentTitle: currentQuiz?.title || 'Classroom Live Quiz Battle',
        date: new Date().toLocaleDateString('en-GB'),
        score: myPlayerObj?.score || me?.score || 0,
        totalQuestions: totalQ,
        correctAnswers: computedCorrect,
        rank: myRank,
        totalParticipants: sortedPlayers.length || 1,
      };
      addHistoryItem(historyItem);
    }
  }, [isStudentAuth, me, roomCode, currentQuiz, myRank, myPlayerObj, sortedPlayers.length, addHistoryItem, isWinner, computedCorrect]);

  const handlePlayAgain = () => {
    resetGame();
    setSelectedTab('join');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 overflow-x-hidden">
      <div className="max-w-5xl mx-auto pt-6 pb-24">
        
        {/* Personal Rank Highlight Banner */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={cn(
            "mb-10 p-8 rounded-3xl border text-center shadow-2xl relative overflow-hidden transition-all",
            isWinner
              ? "bg-gradient-to-r from-amber-950/90 via-emerald-950/80 to-indigo-950/90 border-amber-500/50 shadow-amber-950/50"
              : isZeroScore
                ? "bg-gradient-to-r from-rose-950/95 via-red-950/90 to-slate-950/95 border-rose-500/60 shadow-rose-950/60"
                : isLastRank
                  ? "bg-gradient-to-r from-rose-950/90 via-red-950/80 to-slate-950/90 border-rose-500/50 shadow-rose-950/50"
                  : "bg-gradient-to-r from-indigo-950/80 via-blue-900/60 to-purple-950/80 border-sky-500/30 shadow-sky-950/50"
          )}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="text-xs font-black tracking-widest uppercase mb-2 flex items-center justify-center gap-2">
            {isWinner ? (
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                👑 CHAMPION VICTORY
              </span>
            ) : isZeroScore ? (
              <span className="px-3.5 py-1 rounded-full bg-rose-500/30 text-rose-300 border border-rose-500/50 font-black animate-pulse">
                ❌ YOU LOST — 0 POINTS
              </span>
            ) : isLastRank ? (
              <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                ⚠️ BATTLE RESULT
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40">
                ⚡ BATTLE RANKING
              </span>
            )}
          </div>

          <h2 className="text-3xl sm:text-5xl font-black italic uppercase tracking-tight text-white">
            {isWinner
              ? '🎉 WINNER! CHAMPION RANK #1'
              : isZeroScore
                ? `❌ YOU LOST! RANK #${myRank} (0 POINTS SCORED)`
                : isLastRank
                  ? `❌ YOU LOST! RANK #${myRank} OUT OF ${sortedPlayers.length || 1}`
                  : `YOUR RANK: #${myRank} OUT OF ${sortedPlayers.length || 1}`}
          </h2>

          <p className="mt-3 text-sm sm:text-base font-semibold text-slate-300 max-w-xl mx-auto">
            {isWinner
              ? 'Outstanding performance! You conquered the battle arena with the highest score.'
              : isZeroScore
                ? 'All options selected were incorrect or timed out. Study hard and attempt again next round!'
                : isLastRank
                  ? 'You finished in last place. Don’t give up — study hard and try again to climb the leaderboard!'
                  : `Great effort! You secured Rank #${myRank}. Keep pushing for Rank #1 next time!`}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm sm:text-lg font-bold">
            <span className="bg-white/10 px-5 py-2 rounded-2xl border border-white/10 text-amber-300 font-black">
              Score: {myPlayerObj?.score || 0} pts
            </span>
            <span className="bg-white/10 px-5 py-2 rounded-2xl border border-white/10 text-emerald-300 font-black">
              Correct: {computedCorrect}
            </span>
            <span className="bg-white/10 px-5 py-2 rounded-2xl border border-white/10 text-sky-300 font-black">
              Rank: #{myRank} / {sortedPlayers.length || 1}
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h3 className="text-4xl sm:text-5xl font-black italic uppercase tracking-tighter mb-2">Podium Champions</h3>
          <p className="text-white/40 text-sm font-bold tracking-widest uppercase">Classroom Live Leaderboard</p>
        </motion.div>

        {/* Podium */}
        <div className="flex items-end justify-center gap-4 mb-24 h-80 max-w-2xl mx-auto">
          {/* 2nd Place */}
          {top3[1] && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: '60%', opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex-1 flex flex-col items-center"
            >
              <RenderAvatar avatar={top3[1].avatar} fallback="🐶" className="w-16 h-16 rounded-2xl mb-4 border-4 border-slate-300 shadow-xl" />
              <div className="w-full bg-slate-300/20 border-t-4 border-slate-300 rounded-t-3xl p-4 flex flex-col items-center justify-center flex-1">
                <span className="text-2xl font-black text-slate-300 mb-1">2nd</span>
                <span className="font-bold truncate w-full text-center">{top3[1].username || 'Student'}</span>
                <span className="text-xs font-black text-slate-300/60 uppercase">{top3[1].score || 0} pts</span>
              </div>
            </motion.div>
          )}

          {/* 1st Place */}
          {top3[0] && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: '85%', opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="flex-1 flex flex-col items-center z-10"
            >
              <div className="relative mb-4">
                {top3[0].score > 0 ? (
                  <Trophy className="absolute -top-10 left-1/2 -translate-x-1/2 text-yellow-500 w-12 h-12 animate-bounce" />
                ) : (
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 text-3xl">😿</span>
                )}
                <RenderAvatar avatar={top3[0].avatar} fallback={top3[0].score > 0 ? "🐱" : "😿"} className="w-24 h-24 rounded-3xl border-4 border-yellow-500 shadow-2xl shadow-yellow-500/20" />
              </div>
              <div className="w-full bg-yellow-500/20 border-t-4 border-yellow-500 rounded-t-3xl p-6 flex flex-col items-center justify-center flex-1">
                <span className="text-4xl font-black text-yellow-500 mb-1">1st</span>
                <span className="text-xl font-black truncate w-full text-center">{top3[0].username || 'Student'}</span>
                <span className="text-sm font-black text-yellow-500/60 uppercase">{top3[0].score || 0} pts</span>
              </div>
            </motion.div>
          )}

          {/* 3rd Place */}
          {top3[2] && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: '45%', opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex-1 flex flex-col items-center"
            >
              <RenderAvatar avatar={top3[2].avatar} fallback="🦊" className="w-16 h-16 rounded-2xl mb-4 border-4 border-amber-600 shadow-xl" />
              <div className="w-full bg-amber-600/20 border-t-4 border-amber-600 rounded-t-3xl p-4 flex flex-col items-center justify-center flex-1">
                <span className="text-2xl font-black text-amber-600 mb-1">3rd</span>
                <span className="font-bold truncate w-full text-center">{top3[2].username || 'Student'}</span>
                <span className="text-xs font-black text-amber-600/60 uppercase">{top3[2].score || 0} pts</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Rest of Players */}
        {rest.length > 0 && (
          <Card className="mb-12">
            <div className="space-y-2">
              {rest.map((player, i) => (
                <div key={player.id || i} className="flex items-center gap-4 p-4 hover:bg-white/5 rounded-2xl transition-colors">
                  <span className="w-8 text-white/20 font-black italic">{i + 4}</span>
                  <RenderAvatar avatar={player.avatar} className="w-10 h-10 rounded-xl" />
                  <span className="flex-1 font-bold">{player.username || 'Student'}</span>
                  <span className="font-black text-indigo-400">{player.score || 0}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={handlePlayAgain}>
            <RotateCcw size={20} />
            Play Again
          </Button>
          <Button variant="secondary" size="lg" onClick={() => navigate('/analytics')}>
            <BarChart3 size={20} />
            View Analytics
          </Button>
          <Button variant="outline" size="lg" onClick={() => navigate('/')}>
            <Home size={20} />
            Home
          </Button>
        </div>

      </div>

      <LiveChatWidget
        roomCode={roomCode || ''}
        currentUser={myPlayerObj?.username || me?.username || 'Student'}
        role="student"
      />
    </div>
  );
};
