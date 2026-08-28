import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
      <header className="bg-[#050b1e]/85 backdrop-blur-xl border-b border-sky-500/20 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-lg shadow-sky-950/20">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => {
            useGameStore.getState().resetGame();
            setSelectedTab('join');
          }}
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center shadow-lg shadow-sky-500/30 animate-pulse">
            <Zap size={22} className="text-white fill-white" />
          </div>
          <div>
            <div className="text-base font-black tracking-tight text-white flex items-center gap-1.5">
              EduPulse AI
            </div>
            <div className="text-[9px] font-extrabold tracking-widest uppercase text-sky-400 flex items-center gap-1">
              <Sparkles size={10} />
              <span>STUDENT PORTAL</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 z-10">
          <button
            onClick={() => navigate('/')}
            className="text-xs font-extrabold text-slate-300 hover:text-sky-300 transition-colors cursor-pointer hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-sky-500/20"
          >
            <Home size={14} />
            <span>Main Home</span>
          </button>

          <button
            onClick={() => {
              useGameStore.getState().resetGame();
              setSelectedTab('join');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
              selectedTab === 'join' || selectedTab === 'lobby' || selectedTab === 'quiz'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/30 border border-sky-400/50'
                : 'bg-slate-900/80 border border-sky-500/20 text-slate-300 hover:text-white hover:border-sky-400/40'
            }`}
          >
            <Sword size={14} />
            <span>Join Battle</span>
          </button>

          <button
            onClick={() => setSelectedTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
              selectedTab === 'profile'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/30 border border-sky-400/50'
                : 'bg-slate-900/80 border border-sky-500/20 text-slate-300 hover:text-white hover:border-sky-400/40'
            }`}
          >
            <div className="w-5 h-5 rounded-lg overflow-hidden border border-sky-400/50 shrink-0">
              <img
                src={currentStudent.avatar}
                alt={currentStudent.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="truncate max-w-[100px]">{currentStudent.name.split(' ')[0]}</span>
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
              className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-rose-950/60 border border-sky-500/20 hover:border-rose-700 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
            >
              <LogOut size={16} />
            </button>
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
