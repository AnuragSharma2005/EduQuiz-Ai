import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Zap, User, LogOut, Sword, Trophy, Home, Sparkles } from 'lucide-react';
import { useStudentStore } from './studentStore';
import { StudentLoginModal } from './StudentLoginModal';
import { StudentJoinView } from './StudentJoinView';
import { StudentProfileView } from './StudentProfileView';
import { LobbyPage } from '../pages/LobbyPage';
import { GamePage } from '../pages/GamePage';
import { ResultsPage } from '../pages/ResultsPage';
import { ParticleBackground } from '../components/ParticleBackground';
import { useGameStore } from '../store/useGameStore';
import { LiveChatWidget } from '../components/LiveChatWidget';

export const StudentLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    isStudentAuth,
    currentStudent,
    logoutStudent,
    selectedTab,
    setSelectedTab,
  } = useStudentStore();
  const { status } = useGameStore();

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'profile') {
      setSelectedTab('profile');
    }
  }, [location.search, setSelectedTab]);

  React.useEffect(() => {
    if (status === 'starting' || status === 'question' || status === 'leaderboard') {
      if (selectedTab !== 'quiz') {
        setSelectedTab('quiz');
      }
    } else if (status === 'finished') {
      if (selectedTab !== 'results') {
        setSelectedTab('results');
      }
    }
  }, [status, selectedTab, setSelectedTab]);

  const renderContent = () => {
    switch (selectedTab) {
      case 'join':
        return <StudentJoinView />;
      case 'lobby':
        return <LobbyPage />;
      case 'quiz':
        return <GamePage />;
      case 'results':
        return <ResultsPage />;
      case 'profile':
        return <StudentProfileView />;
      default:
        return <StudentJoinView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans flex flex-col relative overflow-x-hidden selection:bg-sky-500/30">
      {/* Particle & Grid Aesthetics */}
      <ParticleBackground />
      <div className="absolute inset-0 bg-blue-grid opacity-20 pointer-events-none z-0" />

      {/* Ambient Glowing Orbs */}
      <div className="fixed top-1/4 left-10 w-96 h-96 bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-10 right-10 w-96 h-96 bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header Bar */}
      <header className="bg-[#040817]/95 backdrop-blur-2xl border-b border-sky-500/20 px-3 sm:px-8 py-2.5 sm:py-3 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4 sticky top-0 z-30 shadow-xl shadow-sky-950/30">
        {/* Top Row on Mobile: Logo + Home & Logout Buttons */}
        <div className="w-full sm:w-auto flex items-center justify-between gap-3">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer shrink-0"
            onClick={() => {
              useGameStore.getState().resetGame();
              setSelectedTab('join');
            }}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/30">
              <Zap size={20} className="text-white fill-white animate-pulse" />
            </div>
            <div className="flex flex-col justify-center">
              <div className="text-sm sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5 whitespace-nowrap">
                EduPulse AI
              </div>
              <div className="text-[8px] sm:text-[9px] font-extrabold tracking-widest uppercase text-sky-400 flex items-center gap-1 whitespace-nowrap">
                <Sparkles size={10} className="text-sky-300" />
                <span>STUDENT PORTAL</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Action Icons on Mobile Top Line */}
          <div className="flex items-center gap-2 sm:hidden">
            <button
              onClick={() => navigate('/')}
              title="Main Home"
              className="p-2 rounded-xl bg-slate-900/90 border border-sky-500/20 text-slate-300 hover:text-sky-300 cursor-pointer"
            >
              <Home size={15} />
            </button>
            {isStudentAuth && (
              <button
                onClick={() => {
                  logoutStudent();
                  localStorage.removeItem('student_token');
                  localStorage.removeItem('student_user');
                  localStorage.removeItem('authToken');
                  localStorage.removeItem('user');
                  navigate('/');
                }}
                title="Logout Student"
                className="p-2 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 hover:text-rose-200 cursor-pointer"
              >
                <LogOut size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Action Controls & Tab Pills */}
        <div className="w-full sm:w-auto flex items-center justify-center sm:justify-end gap-2 z-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="text-xs font-extrabold text-slate-300 hover:text-sky-300 transition-colors cursor-pointer hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-sky-500/20 whitespace-nowrap"
          >
            <Home size={14} />
            <span>Main Home</span>
          </motion.button>

          <div className="w-full sm:w-auto bg-[#020510]/90 p-1 rounded-2xl border border-sky-500/20 flex items-center justify-stretch sm:justify-start gap-1 shadow-inner backdrop-blur-md">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                useGameStore.getState().resetGame();
                setSelectedTab('join');
              }}
              className={`flex-1 sm:flex-none px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
                selectedTab === 'join' || selectedTab === 'lobby' || selectedTab === 'quiz'
                  ? 'bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white shadow-lg shadow-sky-500/30 border border-sky-300/40 ring-2 ring-sky-400/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sword size={14} className={selectedTab === 'join' ? 'text-white' : 'text-sky-400'} />
              <span>Join Battle</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedTab('profile')}
              className={`flex-1 sm:flex-none px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
                selectedTab === 'profile'
                  ? 'bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white shadow-lg shadow-sky-500/30 border border-sky-300/40 ring-2 ring-sky-400/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="w-5 h-5 rounded-full overflow-hidden border border-sky-300/70 shrink-0 bg-sky-950">
                <img
                  src={currentStudent.avatar}
                  alt={currentStudent.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="truncate max-w-[100px]">{currentStudent.name.split(' ')[0]}</span>
            </motion.button>
          </div>

          {isStudentAuth && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                logoutStudent();
                localStorage.removeItem('student_token');
                localStorage.removeItem('student_user');
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
                navigate('/');
              }}
              title="Logout Student"
              className="hidden sm:flex p-2.5 rounded-xl bg-slate-900/90 hover:bg-rose-950/80 border border-sky-500/20 hover:border-rose-500/50 text-slate-400 hover:text-rose-300 transition-all cursor-pointer shadow-md"
            >
              <LogOut size={16} />
            </motion.button>
          )}
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 relative z-10">
        {renderContent()}
      </main>

      {/* Live Chat Drawer Widget */}
      <LiveChatWidget currentUser={currentStudent?.name} role="student" />

      {/* Security Login Modal Gate */}
      <StudentLoginModal />
    </div>
  );
};
