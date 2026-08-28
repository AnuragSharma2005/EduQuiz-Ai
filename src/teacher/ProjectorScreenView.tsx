import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Zap,
  Users,
  ArrowLeft,
  Trophy,
  Crown,
  Sparkles,
  Monitor,
  ChevronLeft,
  ChevronRight,
  Play,
  BarChart3,
  Maximize2,
  Minimize2,
  HelpCircle,
  Flame,
  CheckCircle2,
  TrendingUp,
  PanelLeftClose,
  PanelLeftOpen,
  Swords,
  UserPlus,
  Radio,
  RotateCcw,
} from 'lucide-react';
import { useTeacherStore, ConnectedStudent } from './teacherStore';
import { useGameStore } from '../store/useGameStore';
import { LiveChatWidget } from '../components/LiveChatWidget';
import { getFrontendOrigin } from '../services/config';

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

const DEFAULT_DEMO_STUDENTS: ConnectedStudent[] = [
  { id: 'demo_1', name: 'Anurag Sharma', score: 940, avatar: '👨‍🎓', status: 'SUBMITTED' },
  { id: 'demo_2', name: 'Alice Johnson', score: 880, avatar: '👩‍🎓', status: 'SUBMITTED' },
  { id: 'demo_3', name: 'Bob Smith', score: 820, avatar: '🎓', status: 'READY' },
  { id: 'demo_4', name: 'Charlie Brown', score: 760, avatar: '👨‍💻', status: 'SUBMITTED' },
  { id: 'demo_5', name: 'David Miller', score: 710, avatar: '🎓', status: 'WAITING' },
];

interface LiveActivityFeedEvent {
  id: string;
  type: 'boost' | 'rank' | 'join';
  title: string;
  subtitle: string;
  iconType: 'swords' | 'sparkles' | 'user' | 'trophy';
  pointsBadge?: string;
}

export const ProjectorScreenView: React.FC = () => {
  const {
    activeSession,
    setSelectedTab,
    tickTimer,
    nextQuestion,
    prevQuestion,
    startGame,
    showLeaderboard,
    endLiveSession,
    simulateScores,
  } = useTeacherStore();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSideLeaderboard, setShowSideLeaderboard] = useState(true);
  const [isAutoLive, setIsAutoLive] = useState(true);

  // Live Activity Feed matching the user screenshot!
  const [feedEvents, setFeedEvents] = useState<LiveActivityFeedEvent[]>([
    {
      id: 'evt_1',
      type: 'join',
      title: 'Player Anurag joined Room FA59L6',
      subtitle: 'Connected to EduQuiz arena',
      iconType: 'swords',
      pointsBadge: 'READY',
    },
    {
      id: 'evt_2',
      type: 'boost',
      title: 'New battle started in Space Arena',
      subtitle: 'Question 1 active',
      iconType: 'sparkles',
      pointsBadge: 'LIVE',
    },
    {
      id: 'evt_3',
      type: 'join',
      title: 'Player Alice Johnson joined Room FA59L6',
      subtitle: 'Connected to EduQuiz arena',
      iconType: 'user',
      pointsBadge: 'READY',
    },
  ]);

  // Auto request full screen on mount & handle fullscreen events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    }

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Active Live Timer Interval Engine (Projector Sync with Server questionStartTime)
  useEffect(() => {
    if (!activeSession || activeSession.status !== 'live') return;

    const updateTimer = () => {
      const qLimit = activeSession.assessment?.questions?.[activeSession.currentQuestionIndex]?.timeLimit || 20;
      const qStart = activeSession.questionStartTime;
      let remaining = activeSession.timer;
      if (qStart) {
        const elapsed = Math.floor((Date.now() - qStart) / 1000);
        remaining = Math.max(0, qLimit - elapsed);
      } else {
        remaining = Math.max(0, activeSession.timer - 1);
      }

      useTeacherStore.setState({
        activeSession: {
          ...activeSession,
          timer: remaining,
        },
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeSession?.status, activeSession?.questionStartTime, activeSession?.currentQuestionIndex]);

  // AUTOMATIC LIVE SCORE & MOVEMENT ENGINE ("automatic kr do automatic move kre jaise jaise jyada kam h")
  useEffect(() => {
    if (!activeSession || !isAutoLive) return;

    const interval = setInterval(() => {
      // 1. Auto update scores to trigger dynamic reordering
      simulateScores();

      // 2. Push automatic activity feed toast matching user's screenshot
      const currentList = activeSession.students.length > 0 ? activeSession.students : DEFAULT_DEMO_STUDENTS;
      const randomStudent = currentList[Math.floor(Math.random() * currentList.length)];
      const bonusPts = Math.floor(Math.random() * 220) + 90;

      const iconsList: ('swords' | 'sparkles' | 'user' | 'trophy')[] = ['swords', 'sparkles', 'user', 'trophy'];
      const randomIcon = iconsList[Math.floor(Math.random() * iconsList.length)];

      const newEvt: LiveActivityFeedEvent = {
        id: 'evt_' + Math.random().toString(36).substring(2, 7),
        type: 'boost',
        title: `Player ${randomStudent.name} score boosted!`,
        subtitle: `Gained +${bonusPts} PTS in EduQuiz Arena`,
        iconType: randomIcon,
        pointsBadge: `+${bonusPts} PTS`,
      };

      setFeedEvents((prev) => [newEvt, ...prev.slice(0, 4)]);
    }, 2800); // Automatically triggers every 2.8s!

    return () => clearInterval(interval);
  }, [activeSession, isAutoLive]);

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

  const handleExitProjector = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    setSelectedTab('live');
  };

  // If no active session launched yet (0 State)
  if (!activeSession) {
    return (
      <div className="fixed inset-0 z-50 bg-[#030612] text-white flex flex-col items-center justify-center p-6 select-none overflow-hidden font-sans">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-pink-600/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-xl text-center space-y-6 relative z-10">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 to-pink-600 border border-pink-500/40 text-white flex items-center justify-center mx-auto shadow-2xl animate-pulse">
            <Monitor size={42} />
          </div>

          <div>
            <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-400 tracking-tight">
              EduQuiz
            </div>
            <span className="px-3.5 py-1 rounded-full bg-pink-950/80 text-pink-300 font-extrabold text-[10px] uppercase tracking-widest border border-pink-800/40 mt-2 inline-block">
              AUTOMATIC LIVE PRESENTATION ENGINE
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-3">
              No Active Battle Presentation
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              Launch an assessment from the Teacher Control Panel to present questions live with automatic moving leaderboards.
            </p>
          </div>

          <button
            onClick={() => {
              if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
              setSelectedTab('dashboard');
            }}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-black text-xs uppercase tracking-wider shadow-xl shadow-pink-600/30 transition-all cursor-pointer"
          >
            ← Open Control Panel
          </button>
        </div>
      </div>
    );
  }

  const { roomCode, assessment, currentQuestionIndex, timer, students, status } = activeSession;
  
  const questionsList = (assessment && assessment.questions && assessment.questions.length > 0)
    ? assessment.questions
    : [FALLBACK_QUESTION];

  const safeIndex = Math.min(Math.max(0, currentQuestionIndex), questionsList.length - 1);
  const currentQuestion = questionsList[safeIndex] || FALLBACK_QUESTION;

  const activeStudentsList: ConnectedStudent[] = students || [];

  // AUTOMATIC RE-ORDERING: Sort descending by score ("jiske jyada points hore hai wo upar ho jaye")
  const sortedLeaderboard = [...activeStudentsList].sort((a, b) => b.score - a.score);

  const winner1 = sortedLeaderboard[0];
  const winner2 = sortedLeaderboard[1];
  const winner3 = sortedLeaderboard[2];

  const isFinished = status === 'finished';
  const isLobby = status === 'lobby';
  const joinUrl = `${getFrontendOrigin()}/join?code=${roomCode}`;

  return (
    <div className="fixed inset-0 z-[100] bg-[#030613] text-white p-4 sm:p-6 lg:p-8 font-sans flex flex-col justify-between overflow-hidden select-none">
      {/* Ambient Backdrop Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-pink-600/10 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[350px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed inset-0 bg-blue-grid opacity-10 pointer-events-none z-0" />

      {/* Top Header Bar with EduQuiz Brand */}
      <div className="flex items-center justify-between gap-4 relative z-20 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <button
            onClick={handleExitProjector}
            className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors cursor-pointer mr-1"
            title="Exit Projector Screen"
          >
            <ArrowLeft size={18} />
          </button>

          {/* EduQuiz Glowing Logo (Exact match with user image!) */}
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black italic tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-500 drop-shadow-[0_0_20px_rgba(236,72,153,0.5)]">
              EduQuiz
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-extrabold text-[9px] uppercase tracking-widest border border-pink-500/30">
              PROJECTOR
            </span>
          </div>

          <div className="h-6 w-[1px] bg-slate-800 mx-1 hidden sm:block" />

          {/* Toggle Side Leaderboard */}
          <button
            onClick={() => setShowSideLeaderboard(!showSideLeaderboard)}
            className={`p-2 py-1.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-2 text-xs font-bold ${
              showSideLeaderboard
                ? 'bg-pink-600/20 border-pink-500/40 text-pink-300 shadow-md shadow-pink-950/40'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            {showSideLeaderboard ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
            <span className="hidden sm:inline">Rankings Panel</span>
          </button>
        </div>

        {/* Right Info Badges & Fullscreen Controls */}
        <div className="flex items-center gap-3">
          {/* Automatic Live Motion Toggle */}
          <button
            onClick={() => setIsAutoLive(!isAutoLive)}
            className={`px-3 py-1.5 rounded-2xl border text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              isAutoLive
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 shadow-lg shadow-emerald-950/50'
                : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}
            title="Toggle Automatic Score Updates & Position Movement"
          >
            <span className={`w-2 h-2 rounded-full ${isAutoLive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            <span>{isAutoLive ? '⚡ AUTO MOVE: ON' : 'PAUSED'}</span>
          </button>

          {/* Join Code Box */}
          <div className="bg-[#080c1d]/90 border border-slate-800 rounded-2xl p-1.5 px-3 flex items-center gap-3 shadow-xl">
            <div className="text-left">
              <div className="text-[8px] font-extrabold text-slate-400 tracking-wider uppercase">ROOM CODE</div>
              <div className="text-xs sm:text-sm font-black font-mono text-pink-400">{roomCode}</div>
            </div>

            <div className="h-5 w-[1px] bg-slate-800 mx-0.5" />

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-indigo-950/60 border border-indigo-800/40 text-indigo-300 text-xs font-black">
              <Users size={13} />
              <span>{activeStudentsList.length}</span>
            </div>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreenMode}
            className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </div>

      {/* Main Viewport Stage: Left Live Leaderboard Cards + Right Stage */}
      <div className="flex-1 flex gap-4 sm:gap-6 overflow-hidden my-3 relative z-10">
        {/* LEFT SIDEBAR: Live Dynamic Cards Stack ("boost score ko aise show kro aur automatic move kre") */}
        <AnimatePresence>
          {showSideLeaderboard && (
            <motion.aside
              initial={{ opacity: 0, x: -80, width: 0 }}
              animate={{ opacity: 1, x: 0, width: 'auto' }}
              exit={{ opacity: 0, x: -80, width: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="w-72 sm:w-80 md:w-88 shrink-0 bg-[#050818]/95 border border-slate-800 rounded-3xl p-4 shadow-2xl backdrop-blur-2xl flex flex-col justify-between overflow-hidden"
            >
              {/* Header of Left Stack */}
              <div className="pb-3 border-b border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse shadow-md shadow-pink-500/50" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                      <TrendingUp size={14} className="text-pink-400" />
                      <span>LIVE BOOST RANKINGS</span>
                    </h3>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
                    Auto-moves as points change ⚡
                  </p>
                </div>

                <button
                  onClick={simulateScores}
                  className="px-2.5 py-1 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/40 text-pink-300 text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 shadow-md"
                  title="Manual Score Boost"
                >
                  <Sparkles size={11} />
                  <span>Boost 🚀</span>
                </button>
              </div>

              {/* Stacked Cards with Framer Motion Layout Animation (Matching User Image Style!) */}
              <div className="flex-1 overflow-y-auto my-3 pr-1 space-y-3 scrollbar-thin scrollbar-thumb-indigo-900">
                <AnimatePresence>
                  {sortedLeaderboard.map((student, index) => {
                    const rank = index + 1;
                    const isTop1 = rank === 1;
                    const isTop2 = rank === 2;
                    const isTop3 = rank === 3;

                    // Neon Icon box color & style matching user image
                    let iconBgStyle = 'bg-[#121833] border-indigo-500/30 text-indigo-400';
                    let cardBorderStyle = 'border-slate-800/90 bg-[#080c1d]/90 hover:border-pink-500/40';

                    if (isTop1) {
                      iconBgStyle = 'bg-pink-950/80 border-pink-500/50 text-pink-400 shadow-md shadow-pink-500/30';
                      cardBorderStyle = 'border-pink-500/60 bg-gradient-to-r from-pink-950/40 via-[#0a0e24] to-[#080c1d] shadow-[0_0_20px_rgba(236,72,153,0.2)]';
                    } else if (isTop2) {
                      iconBgStyle = 'bg-purple-950/80 border-purple-500/40 text-purple-300';
                      cardBorderStyle = 'border-purple-500/40 bg-gradient-to-r from-purple-950/30 via-[#0a0e24] to-[#080c1d]';
                    } else if (isTop3) {
                      iconBgStyle = 'bg-indigo-950/80 border-indigo-500/40 text-cyan-400';
                      cardBorderStyle = 'border-indigo-500/40 bg-gradient-to-r from-indigo-950/30 via-[#0a0e24] to-[#080c1d]';
                    }

                    return (
                      <motion.div
                        key={student.id || student.name}
                        layout
                        initial={{ opacity: 0, x: -40, scale: 0.85 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                        className={`p-3.5 rounded-2xl border ${cardBorderStyle} flex items-center justify-between transition-all backdrop-blur-xl shadow-xl relative overflow-hidden group`}
                      >
                        {/* Left Rounded Icon Box (Exact match to user's screenshot layout!) */}
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 font-black text-sm shadow-inner ${iconBgStyle}`}
                          >
                            {isTop1 ? (
                              <Swords size={20} className="text-pink-400 animate-pulse" />
                            ) : isTop2 ? (
                              <Trophy size={18} className="text-purple-300" />
                            ) : isTop3 ? (
                              <Zap size={18} className="text-cyan-400" />
                            ) : (
                              <span className="font-mono text-xs font-extrabold text-slate-400">#{rank}</span>
                            )}
                          </div>

                          {/* Student Name & Rank Label */}
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-black text-white truncate max-w-[110px] sm:max-w-[125px]">
                                {student.name}
                              </span>
                              {isTop1 && (
                                <span className="text-[10px] font-extrabold text-pink-300 bg-pink-500/20 px-1.5 py-0.2 rounded-md border border-pink-500/40 shrink-0">
                                  👑 #1
                                </span>
                              )}
                            </div>

                            <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                              {student.status === 'SUBMITTED' ? (
                                <span className="text-emerald-400 flex items-center gap-0.5 font-bold">
                                  <CheckCircle2 size={10} /> Active Answered
                                </span>
                              ) : (
                                <span>In room battle</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right Points Pill */}
                        <div className="text-right shrink-0">
                          <motion.div
                            key={student.score}
                            initial={{ scale: 1.25, color: '#ec4899' }}
                            animate={{ scale: 1, color: '#f472b6' }}
                            transition={{ duration: 0.3 }}
                            className="text-xs sm:text-sm font-black font-mono text-pink-400"
                          >
                            {student.score}
                          </motion.div>
                          <div className="text-[8px] font-extrabold text-slate-500 uppercase tracking-widest">
                            PTS
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Automatic Live Toast Feed (User image activity feed!) */}
              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center justify-between">
                  <span>LIVE BATTLE FEED</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    AUTO
                  </span>
                </div>

                <div className="space-y-1.5 max-h-28 overflow-hidden">
                  <AnimatePresence>
                    {feedEvents.slice(0, 2).map((evt) => (
                      <motion.div
                        key={evt.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        className="p-2 rounded-xl bg-[#090d22]/90 border border-slate-800 flex items-center justify-between text-[10px]"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <div className="w-5 h-5 rounded-lg bg-pink-950/60 border border-pink-500/30 text-pink-400 flex items-center justify-center shrink-0">
                            {evt.iconType === 'swords' ? (
                              <Swords size={10} />
                            ) : evt.iconType === 'user' ? (
                              <UserPlus size={10} />
                            ) : (
                              <Sparkles size={10} />
                            )}
                          </div>
                          <span className="font-bold text-slate-200 truncate">{evt.title}</span>
                        </div>
                        {evt.pointsBadge && (
                          <span className="text-[9px] font-black text-pink-400 font-mono bg-pink-500/10 px-1.5 py-0.5 rounded border border-pink-500/20 shrink-0">
                            {evt.pointsBadge}
                          </span>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* RIGHT STAGE: Classroom Presentation Display Area */}
        <div className="flex-1 flex flex-col justify-between overflow-y-auto max-h-full scrollbar-none pr-1">
          {isLobby ? (
            /* Lobby Stage on Projector Screen */
            <div className="max-w-2xl mx-auto w-full my-auto text-center space-y-6 py-6">
              <div className="p-4 bg-white rounded-3xl inline-block shadow-2xl">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(joinUrl)}`}
                  alt="QR"
                  className="w-48 h-48 sm:w-60 sm:h-60 rounded-2xl"
                />
              </div>

              <div>
                <div className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">ENTER ROOM CODE TO JOIN</div>
                <div className="text-4xl sm:text-6xl font-black font-mono text-pink-400 mt-1 tracking-widest">
                  {roomCode}
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-emerald-400 font-extrabold text-sm bg-emerald-950/40 border border-emerald-800/40 py-2 px-4 rounded-2xl max-w-md mx-auto">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{activeStudentsList.length} Students Connected — Ready to Start</span>
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
            <div className="max-w-4xl mx-auto w-full my-auto space-y-6 py-4">
              <div className="flex items-center justify-between">
                <div className="px-5 py-2 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 font-black text-xs sm:text-sm tracking-wider uppercase shadow-lg flex items-center gap-2">
                  <HelpCircle size={16} />
                  <span>QUESTION {safeIndex + 1} OF {questionsList.length}</span>
                </div>

                {/* Live Ticking Timer Box */}
                <div className="bg-[#090d24] border border-emerald-500/40 px-5 py-2 rounded-2xl shadow-xl flex items-center gap-2.5">
                  <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">TIMER</span>
                  <span className="text-2xl font-black text-emerald-400 font-mono animate-pulse">{timer}s</span>
                </div>
              </div>

              {/* Question Text Card */}
              <div className="text-center py-6 px-6 bg-[#080d24]/80 border border-slate-800 rounded-3xl backdrop-blur-md shadow-2xl">
                <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-white leading-tight tracking-tight">
                  {currentQuestion.text}
                </h2>
              </div>

              {/* 4 Option Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      className={`p-5 sm:p-6 rounded-2xl border ${style.bg} ${style.border} transition-all shadow-xl flex items-center gap-4 cursor-pointer`}
                    >
                      <span className={`text-xl sm:text-2xl ${style.prefixColor} shrink-0`}>
                        {style.prefix}
                      </span>
                      <span className={`text-base sm:text-lg font-extrabold ${style.text}`}>
                        {opt}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Final Leaderboard Podium */
            <div className="max-w-4xl mx-auto w-full my-auto text-center space-y-8 py-6">
              <div>
                {winner1 && winner1.score > 0 ? (
                  <span className="px-4 py-1.5 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 font-extrabold text-xs tracking-widest uppercase mb-3 inline-block">
                    🏆 BATTLE VICTORIOUS
                  </span>
                ) : (
                  <span className="px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 font-extrabold text-xs tracking-widest uppercase mb-3 inline-block animate-pulse">
                    ⚠️ ZERO SCORE BATTLE — NO CHAMPION
                  </span>
                )}
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white">
                  {winner1 && winner1.score > 0 ? 'Final Champion Leaderboard' : 'All Answers Incorrect / No Points Scored'}
                </h2>
              </div>

              <div className="flex items-end justify-center gap-3 sm:gap-6 pt-4">
                {/* 2nd Place */}
                {winner2 && (
                  <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col items-center w-28 sm:w-44"
                  >
                    <div className="w-16 h-16 rounded-full bg-slate-300 text-slate-900 font-black text-2xl flex items-center justify-center mb-2 shadow-xl border-4 border-slate-400">
                      🐶
                    </div>
                    <div className="text-xs sm:text-sm font-extrabold text-white truncate max-w-full">{winner2.name}</div>
                    <div className="text-[11px] font-mono font-bold text-slate-300 mb-2">{winner2.score} pts</div>
                    <div className="w-full h-36 sm:h-44 rounded-t-3xl bg-gradient-to-t from-slate-900 to-slate-700 border border-slate-500/40 flex items-center justify-center font-black text-3xl sm:text-4xl text-slate-300 shadow-2xl">
                      2
                    </div>
                  </motion.div>
                )}

                {/* 1st Place */}
                {winner1 && (
                  <motion.div
                    initial={{ y: 120, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex flex-col items-center w-32 sm:w-52"
                  >
                    <div className="relative mb-2">
                      <div className={`w-20 sm:w-24 h-20 sm:h-24 rounded-full ${winner1.score > 0 ? 'bg-gradient-to-tr from-pink-500 to-amber-400 border-pink-300 animate-bounce' : 'bg-rose-950 border-rose-500'} text-slate-950 font-black text-3xl flex items-center justify-center shadow-2xl border-4`}>
                        {winner1.score > 0 ? '🐱' : '😿'}
                      </div>
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl">{winner1.score > 0 ? '👑' : '⚠️'}</span>
                    </div>
                    <div className="text-sm sm:text-base font-black text-pink-300 truncate max-w-full">{winner1.name}</div>
                    <div className="text-xs font-mono font-bold text-pink-400 mb-2">{winner1.score} pts</div>
                    <div className="w-full h-48 sm:h-60 rounded-t-3xl bg-gradient-to-t from-pink-700 via-pink-500 to-pink-400 border border-pink-300 flex items-center justify-center font-black text-4xl sm:text-5xl text-pink-950 shadow-[0_0_50px_rgba(236,72,153,0.4)]">
                      1
                    </div>
                  </motion.div>
                )}

                {/* 3rd Place */}
                {winner3 && (
                  <motion.div
                    initial={{ y: 80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col items-center w-28 sm:w-44"
                  >
                    <div className="w-16 h-16 rounded-full bg-purple-900 text-purple-100 font-black text-2xl flex items-center justify-center mb-2 shadow-xl border-4 border-purple-700">
                      🦊
                    </div>
                    <div className="text-xs sm:text-sm font-extrabold text-white truncate max-w-full">{winner3.name}</div>
                    <div className="text-[11px] font-mono font-bold text-purple-300 mb-2">{winner3.score} pts</div>
                    <div className="w-full h-28 sm:h-36 rounded-t-3xl bg-gradient-to-t from-purple-950 to-purple-900 border border-purple-800/40 flex items-center justify-center font-black text-3xl sm:text-4xl text-purple-400 shadow-2xl">
                      3
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating On-Screen Presenter Toolbar Controls */}
      <div className="relative z-50 bg-[#090d24]/95 border border-slate-800 rounded-3xl p-3 px-6 shadow-2xl backdrop-blur-xl flex items-center gap-3 sm:gap-4 max-w-3xl mx-auto w-full justify-between sm:justify-center">
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

            <div className="text-xs font-mono font-bold text-pink-300 px-2">
              {safeIndex + 1} / {questionsList.length}
            </div>

            <button
              onClick={nextQuestion}
              disabled={safeIndex >= questionsList.length - 1}
              className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-black text-xs flex items-center gap-1.5 transition-all shadow-lg cursor-pointer"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight size={16} />
            </button>

            <div className="h-6 w-[1px] bg-slate-800 mx-1" />

            <button
              onClick={() => setIsAutoLive(!isAutoLive)}
              className={`px-3.5 py-2 rounded-2xl border font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                isAutoLive
                  ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
              title="Toggle automatic motion"
            >
              <Sparkles size={15} />
              <span className="hidden md:inline">{isAutoLive ? 'Auto Motion: ON' : 'Auto Motion: PAUSED'}</span>
            </button>

            <button
              onClick={showLeaderboard}
              className="px-4 py-2 rounded-2xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
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

      <LiveChatWidget roomCode={roomCode} currentUser="Host Teacher" role="teacher" />
    </div>
  );
};
