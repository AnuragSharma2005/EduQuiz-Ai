import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  PlusCircle,
  BrainCircuit,
  Trophy,
  Zap,
  ArrowLeft,
  Sparkles,
  Cpu,
  Gamepad2,
  Sword,
  Target,
  Shield,
  Activity,
  ChevronRight,
  UserPlus,
  Flame,
  Star,
  LogOut,
  User,
} from 'lucide-react';
import { Button, Input, Card } from '../components/UI';
import { ParticleBackground } from '../components/ParticleBackground';
import { AVATARS, cn } from '../utils/constants';
import { useGameStore } from '../store/useGameStore';
import { useStudentStore } from '../student/studentStore';
import { useTeacherStore } from '../teacher/teacherStore';
import { useAuth } from '../context/AuthContext';
import socket from '../services/socket';
import { PortalModal } from '../admin/PortalModal';
import { getApiBase } from '../services/config';

// --- Sub-components ---

const LiveActivity = () => {
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const names = ["Zoe", "Max", "Luna", "Cipher", "Vortex", "Nova"];
      const rooms = ["1024", "8899", "4422", "7711"];
      const arenas = ["History", "Tech", "Space", "Music"];

      const newActivity = {
        id: Date.now(),
        text: Math.random() > 0.5
          ? `Player ${names[Math.floor(Math.random() * names.length)]} joined Room ${rooms[Math.floor(Math.random() * rooms.length)]}`
          : `New battle started in ${arenas[Math.floor(Math.random() * arenas.length)]} Arena`,
        icon: Math.random() > 0.5 ? UserPlus : Sword,
        color: Math.random() > 0.5 ? "text-indigo-400" : "text-pink-400"
      };

      setActivities(prev => [newActivity, ...prev.slice(0, 4)]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed left-6 bottom-6 z-30 space-y-3 hidden lg:block w-72">
      <AnimatePresence initial={false}>
        {activities.map((activity) => (
          <motion.div
            key={activity.id}
            initial={{ x: -100, opacity: 0, scale: 0.8 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: -100, opacity: 0, scale: 0.8 }}
            className="bg-black/40 backdrop-blur-md border border-white/10 p-3 rounded-xl flex items-center gap-3 shadow-2xl"
          >
            <div className={cn("p-2 rounded-lg bg-white/5", activity.color)}>
              <activity.icon size={16} />
            </div>
            <span className="text-[11px] font-bold text-white/70 tracking-tight">{activity.text}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

const FloatingAvatar = ({ delay, x, y, username, score, rank, avatar }: any) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{
      opacity: 1,
      y: [y, y - 30, y],
      x: [x, x + 20, x]
    }}
    transition={{
      duration: 6 + Math.random() * 4,
      repeat: Infinity,
      ease: "easeInOut",
      delay
    }}
    className="absolute z-10 hidden md:block"
    style={{ left: x, top: y }}
  >
    <div className="group relative flex flex-col items-center">
      <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg text-center min-w-[100px] pointer-events-none">
        <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{username}</div>
        <div className="text-[9px] text-white/40 font-bold">{score} PTS • RANK #{rank}</div>
      </div>
      <div className="p-1.5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl group-hover:border-indigo-500/50 transition-colors">
        <img src={avatar} alt="Avatar" className="w-12 h-12 rounded-xl" referrerPolicy="no-referrer" />
        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-indigo-600 rounded-full border-2 border-black flex items-center justify-center text-[8px] font-black">
          {rank}
        </div>
      </div>
    </div>
  </motion.div>
);

const FeatureCard = ({ icon: Icon, title, desc, delay }: any) => (
  <motion.div
    initial={{ y: 50, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    viewport={{ once: true }}
    transition={{ delay }}
    whileHover={{ y: -10, scale: 1.02 }}
    className="group relative p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="relative z-10">
      <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(99,102,241,0.2)]">
        <Icon className="text-indigo-400" size={28} />
      </div>
      <h3 className="text-xl font-black italic uppercase tracking-tight mb-3">{title}</h3>
      <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
    </div>
  </motion.div>
);

const GameModeCard = ({ icon: Icon, title, desc, color }: any) => (
  <motion.div
    whileHover={{ scale: 1.05, rotateY: 5 }}
    className={cn(
      "p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md cursor-pointer group transition-all",
      `hover:border-${color}-500/50`
    )}
  >
    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all group-hover:shadow-[0_0_15px_rgba(var(--color-rgb),0.5)]", `bg-${color}-500/20 text-${color}-400`)}>
      <Icon size={24} />
    </div>
    <h4 className="font-black italic uppercase tracking-widest text-sm mb-2">{title}</h4>
    <p className="text-[11px] text-white/40 font-bold leading-tight">{desc}</p>
  </motion.div>
);

// --- Main Page ---

export const LandingPage = () => {
  const navigate = useNavigate();
  const { setMe, setRoomCode } = useGameStore();
  const { isStudentAuth, currentStudent, logoutStudent } = useStudentStore();
  const { isTeacherAuth, currentTeacher, logoutTeacher } = useTeacherStore();
  const { user, isAuthenticated, logout } = useAuth();
  const [showHostOptions, setShowHostOptions] = useState(false);
  const [roomCode, setRoomCodeInput] = useState('');
  const [username, setUsername] = useState('');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isPortalModalOpen, setIsPortalModalOpen] = useState(false);

  const [roomError, setRoomError] = useState('');

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (isStudentAuth && currentStudent?.name) {
      setUsername(currentStudent.name);
    } else if (isTeacherAuth && currentTeacher?.name) {
      setUsername(currentTeacher.name);
    } else if (user?.username) {
      setUsername(user.username);
    }
  }, [isStudentAuth, currentStudent, isTeacherAuth, currentTeacher, user]);

  const handleJoin = async () => {
    // If student is not logged in, navigate to student login portal
    if (!isStudentAuth) {
      navigate('/student');
      return;
    }

    if (!username || !roomCode) {
      navigate('/student');
      return;
    }

    setRoomError('');
    const cleanCode = roomCode.trim().toUpperCase();

    try {
      const res = await fetch(`${getApiBase()}/sessions/validate/${encodeURIComponent(cleanCode)}`);
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.valid) {
        const errorText = data.message || 'Invalid Session ID! Please enter a valid active room code created by your teacher.';
        setRoomError(errorText);
        alert(`❌ Invalid Session ID: "${cleanCode}"\n\nPlease enter a valid active room code created by a registered teacher.`);
        return;
      }
    } catch (e) {
      console.warn('Backend session validation skipped:', e);
    }

    const finalUsername = isStudentAuth ? (currentStudent?.name || username || 'Student') : (username || 'Player');

    const newPlayer = {
      id: isStudentAuth && currentStudent?.id ? currentStudent.id : Math.random().toString(36).substr(2, 9),
      username: finalUsername,
      avatar: (isStudentAuth && currentStudent?.avatar) ? currentStudent.avatar : AVATARS[0],
      score: 0,
      isReady: false,
      isHost: false,
    };

    setMe(newPlayer);
    setRoomCode(cleanCode);
    socket.emit('join_room', { roomCode: cleanCode, player: newPlayer });
    navigate(`/lobby/${cleanCode}`);
  };

  const handleHostGame = () => {
    // Navigate to /teacher:
    // If teacher is logged in -> opens Teacher Dashboard directly
    // If teacher is NOT logged in -> opens Teacher Login Modal, then dashboard upon successful login
    navigate('/teacher');
  };

  const floatingAvatars = useMemo(() => [
    { username: "Neon_Ninja", score: 4500, rank: 1, avatar: AVATARS[0], x: "10%", y: "20%" },
    { username: "Cipher_X", score: 3200, rank: 4, avatar: AVATARS[5], x: "85%", y: "15%" },
    { username: "Vortex_99", score: 2800, rank: 7, avatar: AVATARS[8], x: "15%", y: "70%" },
    { username: "Luna_Star", score: 4100, rank: 2, avatar: AVATARS[12], x: "80%", y: "65%" },
    { username: "Max_Power", score: 3900, rank: 3, avatar: AVATARS[15], x: "50%", y: "10%" },
  ], []);

  const isAnyLoggedIn = isAuthenticated || isStudentAuth || isTeacherAuth;

  const handleGlobalLogout = async () => {
    try {
      await logout();
    } catch (e) {}
    logoutTeacher();
    logoutStudent();
    localStorage.removeItem('isTeacherAuth');
    localStorage.removeItem('teacher_data');
    sessionStorage.removeItem('isTeacherAuth');
    sessionStorage.removeItem('teacher_data');
    localStorage.removeItem('student_token');
    localStorage.removeItem('student_user');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#020205] text-white overflow-x-hidden relative selection:bg-indigo-500/30">
      <ParticleBackground />
      <LiveActivity />

      {/* Top Navigation Bar - Auth Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/40 border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
          {/* Logo */}
          <motion.h1
            className="text-xl sm:text-2xl font-black italic cursor-pointer shrink-0"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
              EduQuiz
            </span>
          </motion.h1>

          {/* Auth & Portal Buttons */}
          {isAnyLoggedIn ? (
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Profile Button - Takes user directly to their active profile/dashboard */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (isTeacherAuth) {
                    navigate('/teacher');
                  } else if (isStudentAuth) {
                    navigate('/student');
                  } else {
                    navigate('/student');
                  }
                }}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-indigo-600/30 via-purple-600/30 to-sky-600/30 border border-indigo-500/40 hover:border-indigo-400 text-indigo-200 hover:text-white text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 shadow-lg shadow-indigo-950/50 cursor-pointer shrink-0"
              >
                <User size={16} className="text-sky-400" />
                <span className="truncate max-w-[120px] sm:max-w-[170px]">
                  {isTeacherAuth
                    ? `👨‍🏫 ${currentTeacher?.name || 'Teacher Profile'}`
                    : isStudentAuth
                    ? `👨‍🎓 ${currentStudent?.name || 'Student Profile'}`
                    : `👤 ${user?.username || 'My Profile'}`}
                </span>
              </motion.button>

              {/* Admin Panel Quick Link */}
              {isAuthenticated && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/admin')}
                  className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-[11px] sm:text-xs font-bold hover:bg-indigo-500/30 transition-all flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  ⚙️ <span className="hidden sm:inline">Admin</span>
                </motion.button>
              )}

              {/* Logout Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGlobalLogout}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-rose-500/10 border border-rose-500/30 hover:border-rose-500/60 hover:bg-rose-500/20 transition-all shrink-0 cursor-pointer"
                title="Logout Account"
              >
                <LogOut size={14} className="text-rose-400" />
                <span className="text-xs sm:text-sm font-bold text-rose-400">Logout</span>
              </motion.button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button onClick={() => setIsPortalModalOpen(true)} size="sm" className="!px-3 sm:!px-4 !py-1.5 text-xs sm:text-sm whitespace-nowrap cursor-pointer">
                🔑 Login / Select Portal
              </Button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Role Selection Modal */}
      <PortalModal isOpen={isPortalModalOpen} onClose={() => setIsPortalModalOpen(false)} />

      {/* Add padding to push content down */}
      <div className="h-16 sm:h-20" />

      {/* Cursor Glow */}
      <div
        className="fixed pointer-events-none z-50 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] rounded-full bg-indigo-600/10 blur-[100px] -translate-x-1/2 -translate-y-1/2 transition-transform duration-100"
        style={{ left: mousePos.x, top: mousePos.y }}
      />

      {/* Floating Avatars */}
      {floatingAvatars.map((av, i) => (
        <FloatingAvatar key={i} {...av} delay={i * 0.5} />
      ))}

      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-4 sm:px-6 pt-8 sm:pt-16 pb-12">
        {/* Animated Grid */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #4f46e5 1px, transparent 1px), linear-gradient(to bottom, #4f46e5 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
            transform: `perspective(1000px) rotateX(60deg) translateY(${mousePos.y * 0.02}px)`
          }}
        />

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 text-center mb-8 sm:mb-14 w-full"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-6 py-1.5 sm:py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] sm:text-xs font-black uppercase tracking-wider sm:tracking-[0.3em] mb-4 sm:mb-8 shadow-[0_0_30px_rgba(99,102,241,0.3)] max-w-[95vw] truncate"
          >
            <Activity size={14} className="animate-pulse shrink-0" />
            <span className="truncate">Real-Time Multiplayer Quiz Battles</span>
          </motion.div>

          <h1 className="text-5xl sm:text-7xl md:text-9xl lg:text-[11rem] font-black tracking-tighter mb-3 sm:mb-4 leading-none select-none italic break-words">
            <span className="bg-gradient-to-b from-white via-white to-indigo-500/50 bg-clip-text text-transparent">Edu</span>
            <motion.span
              animate={{ opacity: [1, 0.8, 1], scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-indigo-500 drop-shadow-[0_0_40px_rgba(99,102,241,0.6)]"
            >
              Quiz
            </motion.span>
          </h1>

          <p className="text-xs sm:text-lg md:text-2xl text-white/50 max-w-2xl mx-auto font-medium tracking-tight px-2">
            Enter the arena. Outsmart the competition. <br className="hidden sm:block" />
            <span className="text-white/90">The ultimate AI-powered battleground.</span>
          </p>
        </motion.div>

        {/* Join Panel / Game Terminal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="relative z-20 w-full max-w-xl px-1 sm:px-0"
        >
          <Card className="p-1 !bg-white/5 backdrop-blur-3xl border-white/10 rounded-[28px] sm:rounded-[40px] shadow-2xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-transparent to-pink-600/10 opacity-50" />
            <div className="relative p-4 sm:p-8 md:p-12">
              <div className="flex items-center justify-between mb-6 sm:mb-10">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                    <Gamepad2 size={18} className="text-white sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-xs sm:text-sm font-black italic uppercase tracking-widest">Battle Terminal</span>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse delay-75" />
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse delay-150" />
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center">
                  <div className="relative group/avatar cursor-pointer" onClick={() => navigate('/join')}>
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-[2rem] bg-indigo-500/10 border-2 border-dashed border-indigo-500/30 flex items-center justify-center overflow-hidden group-hover/avatar:border-indigo-500 transition-colors">
                      <img src={AVATARS[0]} className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl" alt="Preview" referrerPolicy="no-referrer" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-indigo-600 p-1.5 rounded-lg shadow-lg">
                      <PlusCircle size={14} />
                    </div>
                  </div>
                  <div className="flex-1 w-full space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between ml-2">
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Username</label>
                        {isStudentAuth && (
                          <span
                            onClick={() => {
                              useStudentStore.getState().setSelectedTab('profile');
                              navigate('/student?tab=profile');
                            }}
                            className="text-[9px] font-black uppercase text-sky-400 hover:text-sky-300 cursor-pointer flex items-center gap-1 bg-sky-500/10 border border-sky-500/30 px-2 py-0.5 rounded-full transition-all"
                            title="Go to Student Profile to edit your name"
                          >
                            🔒 Synced from Profile (Edit)
                          </span>
                        )}
                      </div>
                      <Input
                        placeholder="PLAYER_NAME"
                        value={isStudentAuth ? (currentStudent?.name || username) : username}
                        onChange={(e) => {
                          if (!isStudentAuth) setUsername(e.target.value);
                        }}
                        readOnly={isStudentAuth}
                        disabled={isStudentAuth}
                        className={cn(
                          "!bg-black/40 !border-white/5 !rounded-2xl font-black italic text-indigo-400 placeholder:text-white/10",
                          isStudentAuth && "!cursor-not-allowed !opacity-90 border-sky-500/40"
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Room Code</label>
                      <Input
                        placeholder="000000"
                        value={roomCode}
                        onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                        className="!bg-black/40 !border-white/5 !rounded-2xl font-black tracking-[0.5em] text-center placeholder:text-white/10"
                        maxLength={6}
                      />
                    </div>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {!showHostOptions ? (
                    <motion.div
                      key="main-btns"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex flex-col gap-3"
                    >
                      <Button
                        size="xl"
                        onClick={handleJoin}
                        disabled={isStudentAuth && (!username || !roomCode)}
                        className="w-full !rounded-2xl bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_30px_rgba(79,70,229,0.4)] group cursor-pointer"
                      >
                        <Sword size={20} className="group-hover:rotate-12 transition-transform" />
                        Join Battle
                      </Button>
                      <Button
                        size="xl"
                        variant="ghost"
                        onClick={handleHostGame}
                        className="w-full !rounded-2xl border border-white/5 hover:bg-white/5 cursor-pointer"
                      >
                        Host Game
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="host-btns"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          variant="outline"
                          className="!rounded-2xl h-24 flex-col gap-2 border-white/10 hover:bg-white/5"
                          onClick={() => navigate('/create')}
                        >
                          <PlusCircle size={24} className="text-indigo-400" />
                          <span className="text-xs font-black uppercase italic">Manual</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="!rounded-2xl h-24 flex-col gap-2 border-indigo-500/30 bg-indigo-500/5 hover:bg-indigo-500/10"
                          onClick={() => navigate('/ai-generate')}
                        >
                          <BrainCircuit size={24} className="text-indigo-400" />
                          <span className="text-xs font-black uppercase italic">AI Generate</span>
                        </Button>
                      </div>
                      <button
                        onClick={() => setShowHostOptions(false)}
                        className="w-full flex items-center justify-center gap-2 text-white/30 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest"
                      >
                        <ArrowLeft size={12} />
                        Back to Terminal
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Game Modes Section */}
      <section className="py-16 sm:py-32 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-12 sm:mb-20 text-center">
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-3 sm:mb-4">Select Your Mode</h2>
          <div className="w-16 sm:w-24 h-1 bg-indigo-500 rounded-full mb-4 sm:mb-6" />
          <p className="text-white/50 font-medium text-xs sm:text-base max-w-xl px-2">Choose how you want to dominate. From classic trivia to AI-driven adaptive challenges.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <GameModeCard
            icon={Zap}
            title="Classic Quiz"
            desc="The traditional battle. Fast-paced questions, instant leaderboard updates."
            color="indigo"
          />
          <GameModeCard
            icon={Sword}
            title="Battle Mode"
            desc="1v1 or team-based combat. Use power-ups to disrupt your opponents."
            color="pink"
          />
          <GameModeCard
            icon={BrainCircuit}
            title="AI Adaptive"
            desc="The quiz evolves with you. Questions get harder as you perform better."
            color="emerald"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-32 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <FeatureCard
            icon={Shield}
            title="Adaptive Difficulty"
            desc="Our neural engine analyzes your performance in real-time to keep the challenge perfectly balanced."
            delay={0.1}
          />
          <FeatureCard
            icon={BrainCircuit}
            title="AI Quiz Generator"
            desc="Generate infinite quizzes on any topic instantly using the power of Groq AI."
            delay={0.2}
          />
          <FeatureCard
            icon={Users}
            title="Multiplayer Battles"
            desc="Compete with up to 100 players in a single room with zero latency and real-time ranking."
            delay={0.3}
          />
        </div>
      </section>

      {/* Live Leaderboard Preview */}
      <section className="py-16 sm:py-32 px-3 sm:px-6 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[28px] sm:rounded-[40px] p-4 sm:p-8 md:p-12 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-12">
            <Trophy className="text-yellow-500 w-6 h-6 sm:w-8 sm:h-8" />
            <h2 className="text-2xl sm:text-4xl font-black italic uppercase tracking-tighter">Hall of Fame</h2>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {[
              { name: 'Aryan_IQ', score: 9500, avatar: AVATARS[0], trend: 'up' },
              { name: 'Riya_Master', score: 9100, avatar: AVATARS[1], trend: 'up' },
              { name: 'Kabir_X', score: 8900, avatar: AVATARS[2], trend: 'down' },
            ].map((p, i) => (
              <motion.div
                key={i}
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-2.5 sm:gap-4 p-3 sm:p-5 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all overflow-hidden"
              >
                <div className={cn(
                  "w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-black text-black text-xs sm:text-base shrink-0",
                  i === 0 ? "bg-yellow-500" : i === 1 ? "bg-slate-300" : "bg-amber-600"
                )}>
                  {i + 1}
                </div>
                <img src={p.avatar} className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl shrink-0" referrerPolicy="no-referrer" />
                <div className="flex-1 text-left min-w-0">
                  <div className="font-black italic uppercase tracking-wider text-xs sm:text-sm truncate">{p.name}</div>
                  <div className="text-[9px] sm:text-[10px] text-white/40 font-bold truncate">LEGENDARY STATUS</div>
                </div>
                <div className="text-right shrink-0 pl-1">
                  <div className="text-base sm:text-2xl font-black text-indigo-400 font-mono">{p.score}</div>
                  <div className="text-[8px] sm:text-[9px] text-emerald-400 font-black uppercase flex items-center justify-end gap-0.5 sm:gap-1">
                    <Flame size={10} />
                    <span>On Fire</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <Button variant="ghost" className="mt-8 sm:mt-12 text-white/50 hover:text-white text-xs sm:text-sm">
            View Global Rankings
            <ChevronRight size={16} />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <span className="text-xl font-black italic uppercase tracking-tighter">EduQuiz</span>
        </div>
        <p className="text-white/20 text-xs font-bold uppercase tracking-[0.5em] mb-8">The Future of Competitive Learning</p>
        <div className="flex justify-center gap-8 text-white/40 text-[10px] font-black uppercase tracking-widest">
          <a href="#" className="hover:text-sky-400 transition-colors">Privacy</a>
          <a href="#" className="hover:text-sky-400 transition-colors">Terms</a>
          <a href="#" className="hover:text-sky-400 transition-colors">Support</a>
          <button onClick={() => navigate('/admin')} className="hover:text-sky-400 transition-colors cursor-pointer">Admin Portal</button>
        </div>
      </footer>
    </div>
  );
};
