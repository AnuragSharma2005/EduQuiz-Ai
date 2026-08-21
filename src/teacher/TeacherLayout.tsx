import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  LayoutGrid,
  BookOpen,
  PlusCircle,
  School,
  Trophy,
  User,
  Settings,
  Radio,
  Monitor,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  Users,
  Sparkles,
} from 'lucide-react';
import { useTeacherStore } from './teacherStore';
import { TeacherLoginModal } from './TeacherLoginModal';
import { TeacherDashboardView } from './TeacherDashboardView';
import { CreateAssessmentView } from './CreateAssessmentView';
import { TeacherGameLobbyView } from './TeacherGameLobbyView';
import { TeacherLiveSessionControlView } from './TeacherLiveSessionControlView';
import { ProjectorScreenView } from './ProjectorScreenView';
import { StudentManagementView } from './StudentManagementView';
import { SessionAnalyticsView } from './SessionAnalyticsView';
import { TeacherProfileView } from './TeacherProfileView';
import { ParticleBackground } from '../components/ParticleBackground';

export const TeacherLayout: React.FC = () => {
  const navigate = useNavigate();
  const {
    isTeacherAuth,
    currentTeacher,
    logoutTeacher,
    selectedTab,
    setSelectedTab,
    activeSession,
    isSidebarOpen,
    toggleSidebar,
  } = useTeacherStore();

  const handleLogout = () => {
    logoutTeacher();
  };

  interface NavItem {
    id: string;
    label: string;
    icon: any;
    badge?: string;
    live?: boolean;
  }

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'create', label: 'Create Assessment', icon: PlusCircle },
    { id: 'live', label: 'Live Session', icon: Radio, live: !!activeSession },
    { id: 'lobby', label: 'Game Lobby', icon: School, badge: activeSession ? activeSession.roomCode : undefined },
    { id: 'projector', label: 'Projector Screen', icon: Monitor },
    { id: 'classrooms', label: 'Student Directory', icon: Users },
    { id: 'leaderboard', label: 'Session Analytics', icon: Trophy },
    { id: 'profile', label: 'Teacher Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (selectedTab) {
      case 'dashboard':
        return <TeacherDashboardView />;
      case 'create':
        return <CreateAssessmentView />;
      case 'lobby':
        return <TeacherGameLobbyView />;
      case 'live':
        return <TeacherLiveSessionControlView />;
      case 'projector':
        return <ProjectorScreenView />;
      case 'classrooms':
        return <StudentManagementView />;
      case 'leaderboard':
        return <SessionAnalyticsView />;
      case 'profile':
        return <TeacherProfileView />;
      case 'settings':
        return (
          <div className="p-8 text-center text-sky-200/70 font-semibold bg-[#070e28] border border-sky-500/30 rounded-3xl">
            Settings & Preference panel is fully synchronized with your account.
          </div>
        );
      default:
        return <TeacherDashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans flex relative overflow-x-hidden selection:bg-sky-500/30">
      {/* Particle & Ambient Backdrop */}
      <ParticleBackground />
      <div className="fixed inset-0 bg-blue-grid opacity-15 pointer-events-none z-0" />
      <div className="fixed top-1/3 right-10 w-96 h-96 bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Sidebar Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-[#050b1e]/90 backdrop-blur-2xl border-r border-sky-500/20 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col shadow-2xl shadow-sky-950/50`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-sky-500/20">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => setSelectedTab('dashboard')}
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/30 group-hover:scale-105 transition-transform">
                <Zap size={22} className="text-white fill-white" />
              </div>
              <div>
                <div className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                  EduPulse AI
                </div>
                <div className="text-[10px] font-extrabold tracking-widest uppercase text-sky-400 flex items-center gap-1">
                  <Sparkles size={10} />
                  <span>TEACHER PANEL</span>
                </div>
              </div>
            </div>

            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Sidebar Nav List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-hide">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = selectedTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedTab(item.id as any)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/30 border border-sky-400/50'
                    : 'text-sky-100/70 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isActive ? 'text-white' : 'text-sky-400/70'} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="px-2 py-0.5 rounded-md bg-sky-950 text-sky-300 font-mono text-[9px] border border-sky-500/30">
                    {item.badge}
                  </span>
                )}
                {item.live && (
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shadow-md shadow-rose-500/50" />
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom User Card */}
        <div className="p-4 border-t border-sky-500/20 bg-[#04091a]">
          <div
            onClick={() => setSelectedTab('profile')}
            className="flex items-center justify-between p-2 rounded-2xl bg-white/5 border border-sky-500/20 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white font-bold flex items-center justify-center text-sm shrink-0 shadow-md">
                {currentTeacher?.name?.charAt(0) || 'D'}
              </div>
              <div className="text-left overflow-hidden">
                <div className="text-xs font-bold text-white truncate max-w-[120px]">
                  {currentTeacher?.name || 'Dr. Sarah Jenkins'}
                </div>
                <div className="text-[10px] text-sky-300/70 truncate max-w-[120px]">
                  {currentTeacher?.email || 'teacher@edupulse.ai'}
                </div>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLogout();
              }}
              title="Logout Teacher"
              className="p-2 rounded-xl text-slate-400 hover:text-rose-300 hover:bg-rose-950/60 transition-colors cursor-pointer"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Panel Content */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 relative z-10">
        {/* Header Bar */}
        <header className="bg-[#050b1e]/85 backdrop-blur-xl border-b border-sky-500/20 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-30 shadow-md shadow-sky-950/20">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:bg-white/10 cursor-pointer"
            >
              <Menu size={22} />
            </button>

            <div className="relative w-full hidden sm:block">
              <Search className="absolute left-3.5 top-3 text-sky-400/60" size={16} />
              <input
                type="text"
                placeholder="Search assessments, questions, students..."
                className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#070e28] border border-sky-500/30 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-sky-400/50 placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigate('/')}
              className="text-xs font-extrabold text-slate-300 hover:text-sky-300 transition-colors cursor-pointer mr-1 hidden sm:block"
            >
              ← Main Site
            </button>

            <span className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-300 text-xs font-bold border border-emerald-500/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>System Live</span>
            </span>

            <button className="p-2.5 rounded-2xl bg-[#070e28] hover:bg-white/10 text-sky-300 border border-sky-500/30 transition-colors relative cursor-pointer hidden sm:block">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-sky-400" />
            </button>

            <button
              onClick={() => setSelectedTab('profile')}
              title="Open Profile"
              className="flex items-center gap-2 p-1.5 pr-3 rounded-2xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-400/30 text-sky-200 font-extrabold text-xs transition-all cursor-pointer shrink-0"
            >
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-md">
                {currentTeacher?.name?.charAt(0) || 'D'}
              </div>
              <span className="truncate max-w-[80px] sm:max-w-[120px]">{currentTeacher?.name?.split(' ')[0]}</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderContent()}
        </main>
      </div>

      {/* Teacher Security Gate */}
      <TeacherLoginModal />
    </div>
  );
};
