import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  Zap,
  Users,
  ArrowLeft,
  Trophy,
  Crown,
  Sparkles,
  Monitor,
  Radio,
  ChevronLeft,
  ChevronRight,
  Play,
  BarChart3,
  Maximize2,
  Minimize2,
  XCircle,
  HelpCircle,
} from 'lucide-react';
import { useTeacherStore } from './teacherStore';

const FALLBACK_QUESTION = {
  id: 'q_default',
  text: 'What is the primary objective of real-time classroom assessment in EduPulse AI?',
  options: [
    'To measure instant student comprehension',
    'To increase homework loads',
    'To replace traditional grading entirely',
    'To lock student browser sessions'
  ],
  correctAnswer: 0,
  timeLimit: 20
};

export const ProjectorScreenView: React.FC = () => {
  const {
    activeSession,
    setSelectedTab,
    tickTimer,
    nextQuestion,
    prevQuestion,
    startGame,
    showLeaderboard,
    endLiveSession
  } = useTeacherStore();

  const [isFullscreen, setIsFullscreen] = useState(false);

  // Active Live Timer Interval Engine (Projector Sync)
  useEffect(() => {
    if (!activeSession || activeSession.status !== 'live') return;

    const interval = setInterval(() => {
      tickTimer();
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSession?.status, activeSession?.timer, activeSession?.currentQuestionIndex]);

  const toggleFullscreenMode = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  // If no active session launched yet (0 State)
  if (!activeSession) {
    return (
      <div className="min-h-screen bg-[#04060f] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-xl text-center space-y-6 relative z-10">
          <div className="w-20 h-20 rounded-3xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center mx-auto shadow-2xl animate-pulse">
            <Monitor size={42} />
          </div>

          <div>
            <span className="px-3.5 py-1 rounded-full bg-blue-950 text-blue-400 font-extrabold text-[10px] uppercase tracking-widest border border-blue-800/40">
              CLASSROOM PROJECTOR ENGINE
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-3">
              No Active Presentation Session
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              Launch an assessment from the Teacher Control Panel to present questions live on screen with interactive student leaderboards.
            </p>
          </div>

          <button
            onClick={() => setSelectedTab('dashboard')}
            className="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-wider shadow-xl shadow-indigo-600/30 transition-all cursor-pointer"
          >
            ← Open Control Panel
          </button>
        </div>

        <div className="absolute bottom-6 left-8 right-8 flex justify-between text-[11px] font-mono text-slate-600">
          <span>EduPulse AI • Classroom Projector Mode</span>
          <span className="text-amber-500/80">● IDLE / WAITING FOR SESSION</span>
        </div>
      </div>
    );
  }

  const { roomCode, assessment, currentQuestionIndex, timer, students, status } = activeSession;
  
  // Safe Question Extraction with Fallbacks
  const questionsList = (assessment && assessment.questions && assessment.questions.length > 0)
    ? assessment.questions
    : [FALLBACK_QUESTION];

  const safeIndex = Math.min(Math.max(0, currentQuestionIndex), questionsList.length - 1);
  const currentQuestion = questionsList[safeIndex] || FALLBACK_QUESTION;

  const sortedStudents = [...students].sort((a, b) => b.score - a.score);
  const winner1 = sortedStudents[0] || { name: 'Anurag', score: 920 };
  const winner2 = sortedStudents[1] || { name: 'Alice Johnson', score: 880 };
  const winner3 = sortedStudents[2] || { name: 'Bob Smith', score: 840 };

  const isFinished = status === 'finished';
  const isLobby = status === 'lobby';
  const joinUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/join?code=${roomCode}`
    : `http://localhost:5173/join?code=${roomCode}`;

  return (
    <div className="min-h-screen bg-[#04060f] text-white p-4 sm:p-6 lg:p-8 font-sans flex flex-col justify-between relative overflow-hidden select-none pb-28">
      {/* Ambient Lighting Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedTab('live')}
            className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors cursor-pointer mr-1"
            title="Exit Projector Screen"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/40 shrink-0">
            <Zap size={22} className="text-white fill-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {assessment?.title || 'Interactive Live Assessment'}
            </h1>
            <div className="text-[10px] font-extrabold tracking-widest uppercase text-blue-400">
              CLASSROOM PROJECTOR SCREEN
            </div>
          </div>
        </div>

        {/* QR Code & Student Counter */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="bg-[#0b1022]/90 border border-slate-800 rounded-2xl p-2 px-3.5 flex items-center gap-3 shadow-xl">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=${encodeURIComponent(joinUrl)}`}
              alt="QR"
              className="w-9 h-9 rounded-lg bg-white p-0.5"
            />
            <div className="text-left">
              <div className="text-[9px] font-extrabold text-slate-400 tracking-wider uppercase">JOIN AT EDUPULSE.AI</div>
              <div className="text-sm font-black font-mono text-indigo-300">{roomCode}</div>
            </div>

            <div className="h-6 w-[1px] bg-slate-800 mx-1" />

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 text-xs font-black">
              <Users size={14} />
              <span>{students.length} Students</span>
            </div>
          </div>

          <button
            onClick={toggleFullscreenMode}
            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </div>

      {/* Center Dynamic Stage */}
      {isLobby ? (
        /* Lobby Stage on Projector Screen */
        <div className="max-w-2xl mx-auto w-full my-auto text-center space-y-6 relative z-10 py-6">
          <div className="p-4 bg-white rounded-3xl inline-block shadow-2xl">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(joinUrl)}`}
              alt="QR"
              className="w-48 h-48 sm:w-60 sm:h-60 rounded-2xl"
            />
          </div>

          <div>
            <div className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">ENTER ROOM CODE TO JOIN</div>
            <div className="text-4xl sm:text-6xl font-black font-mono text-indigo-400 mt-1 tracking-widest">
              {roomCode}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-emerald-400 font-extrabold text-sm bg-emerald-950/40 border border-emerald-800/40 py-2 px-4 rounded-2xl max-w-md mx-auto">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{students.length} Students Connected — Ready to Start</span>
          </div>

          <div className="pt-2">
            <button
              onClick={startGame}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm uppercase tracking-wider shadow-2xl shadow-emerald-600/40 transition-all flex items-center gap-2 mx-auto cursor-pointer"
            >
              <Play size={18} fill="currentColor" />
              <span>Start Battle Now</span>
            </button>
          </div>
        </div>
      ) : !isFinished ? (
        /* Live Question Stage on Projector Screen */
        <div className="max-w-5xl mx-auto w-full my-auto space-y-8 relative z-10 py-6">
          <div className="flex items-center justify-between">
            <div className="px-5 py-2 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 font-black text-xs sm:text-sm tracking-wider uppercase shadow-lg flex items-center gap-2">
              <HelpCircle size={16} />
              <span>QUESTION {safeIndex + 1} OF {questionsList.length}</span>
            </div>

            {/* Live Ticking Timer Box */}
            <div className="bg-[#0b1226] border border-emerald-500/40 px-5 py-2.5 rounded-2xl shadow-xl flex items-center gap-2.5">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">TIMER</span>
              <span className="text-2xl font-black text-emerald-400 font-mono animate-pulse">{timer}s</span>
            </div>
          </div>

          {/* Question Text Card */}
          <div className="text-center py-6 px-6 bg-slate-900/60 border border-slate-800 rounded-3xl backdrop-blur-md shadow-2xl">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
              {currentQuestion.text}
            </h2>
          </div>

          {/* 4 Option Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {(currentQuestion.options || []).map((opt, idx) => {
              const optionStyles = [
                { prefix: 'A —', bg: 'bg-[#18080f]/90', border: 'border-rose-900/80', text: 'text-rose-200', prefixColor: 'text-rose-400 font-black' },
                { prefix: 'B —', bg: 'bg-[#081326]/90', border: 'border-blue-900/80', text: 'text-blue-200', prefixColor: 'text-blue-400 font-black' },
                { prefix: 'C —', bg: 'bg-[#1a1208]/90', border: 'border-amber-900/80', text: 'text-amber-200', prefixColor: 'text-amber-400 font-black' },
                { prefix: 'D —', bg: 'bg-[#081a14]/90', border: 'border-emerald-900/80', text: 'text-emerald-200', prefixColor: 'text-emerald-400 font-black' },
              ];
              const style = optionStyles[idx % 4];

              return (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.01 }}
                  className={`p-6 sm:p-7 rounded-2xl border ${style.bg} ${style.border} transition-all shadow-xl flex items-center gap-4 cursor-pointer`}
                >
                  <span className={`text-xl sm:text-2xl ${style.prefixColor} shrink-0`}>
                    {style.prefix}
                  </span>
                  <span className={`text-lg sm:text-xl font-extrabold ${style.text}`}>
                    {opt}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Final Leaderboard Podium */
        <div className="max-w-4xl mx-auto w-full my-auto text-center space-y-10 relative z-10 py-6">
          <div>
            <span className="px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-extrabold text-xs tracking-widest uppercase mb-3 inline-block">
              🏆 BATTLE VICTORIOUS
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white">
              Final Champion Leaderboard
            </h2>
          </div>

          <div className="flex items-end justify-center gap-3 sm:gap-6 pt-6">
            {/* 2nd Place */}
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center w-28 sm:w-44"
            >
              <div className="w-14 h-14 rounded-full bg-slate-300 text-slate-900 font-black text-lg flex items-center justify-center mb-2 shadow-xl border-4 border-slate-400">
                🥈
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-white truncate max-w-full">{winner2.name}</div>
              <div className="text-[11px] font-mono font-bold text-slate-300 mb-2">{winner2.score} pts</div>
              <div className="w-full h-36 sm:h-44 rounded-t-3xl bg-gradient-to-t from-slate-900 to-slate-700 border border-slate-500/40 flex items-center justify-center font-black text-3xl sm:text-4xl text-slate-300 shadow-2xl">
                2
              </div>
            </motion.div>

            {/* 1st Place */}
            <motion.div
              initial={{ y: 120, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex flex-col items-center w-32 sm:w-52"
            >
              <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-amber-400 text-slate-950 font-black text-2xl flex items-center justify-center mb-2 shadow-2xl border-4 border-amber-300 animate-bounce">
                👑
              </div>
              <div className="text-sm sm:text-base font-black text-amber-300 truncate max-w-full">{winner1.name}</div>
              <div className="text-xs font-mono font-bold text-amber-400 mb-2">{winner1.score} pts</div>
              <div className="w-full h-48 sm:h-60 rounded-t-3xl bg-gradient-to-t from-amber-700 via-amber-500 to-amber-400 border border-amber-300 flex items-center justify-center font-black text-4xl sm:text-5xl text-amber-950 shadow-[0_0_50px_rgba(245,158,11,0.4)]">
                1
              </div>
            </motion.div>

            {/* 3rd Place */}
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center w-28 sm:w-44"
            >
              <div className="w-14 h-14 rounded-full bg-amber-800 text-amber-100 font-black text-lg flex items-center justify-center mb-2 shadow-xl border-4 border-amber-700">
                🥉
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-white truncate max-w-full">{winner3.name}</div>
              <div className="text-[11px] font-mono font-bold text-amber-400/80 mb-2">{winner3.score} pts</div>
              <div className="w-full h-28 sm:h-36 rounded-t-3xl bg-gradient-to-t from-amber-950 to-amber-900 border border-amber-800/40 flex items-center justify-center font-black text-3xl sm:text-4xl text-amber-600 shadow-2xl">
                3
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Floating On-Screen Presenter Toolbar Controls */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#0c1226]/95 border border-indigo-500/40 rounded-3xl p-3 px-6 shadow-2xl backdrop-blur-xl flex items-center gap-3 sm:gap-4 max-w-3xl w-[92%] sm:w-auto justify-between sm:justify-center">
        {isLobby ? (
          <button
            onClick={startGame}
            className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <Play size={16} fill="currentColor" />
            <span>Start Battle</span>
          </button>
        ) : (
          <>
            <button
              onClick={prevQuestion}
              disabled={safeIndex === 0}
              className="px-4 py-2 rounded-2xl bg-white/5 hover:bg-white/10 disabled:opacity-40 border border-white/10 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ChevronLeft size={16} />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="text-xs font-mono font-bold text-indigo-300 px-2">
              {safeIndex + 1} / {questionsList.length}
            </div>

            <button
              onClick={nextQuestion}
              disabled={safeIndex >= questionsList.length - 1}
              className="px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-black text-xs flex items-center gap-1.5 transition-all shadow-lg cursor-pointer"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight size={16} />
            </button>

            <div className="h-6 w-[1px] bg-slate-800 mx-1" />

            <button
              onClick={showLeaderboard}
              className="px-4 py-2 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <BarChart3 size={16} />
              <span className="hidden md:inline">Leaderboard</span>
            </button>

            <button
              onClick={endLiveSession}
              className="px-4 py-2 rounded-2xl bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800/50 text-rose-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Trophy size={16} />
              <span className="hidden md:inline">End</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
