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
      case 'questions':
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
      case 'results':
        return <SessionAnalyticsView />;
      case 'profile':
        return <TeacherProfileView />;
      default:
        return <TeacherDashboardView />;
    }
  };

  // Full Screen Projector Mode
  if (selectedTab === 'projector') {
    return (
      <>
        <TeacherLoginModal />
        {isTeacherAuth && <ProjectorScreenView />}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans flex flex-col lg:flex-row">
      {/* Sidebar for Desktop & Drawer for Mobile */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[#0b1021] text-white flex flex-col justify-between transition-transform duration-300 border-r border-slate-800 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/80">
          <div className="flex items-center justify-between">
            <div
              onClick={() => setSelectedTab('dashboard')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/40 group-hover:scale-105 transition-transform">
                <Zap size={22} className="text-white fill-white" />
              </div>
              <div>
                <div className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                  EduPulse AI
                </div>
                <div className="text-[10px] font-extrabold tracking-widest uppercase text-blue-400">
                  TEACHER PANEL
                </div>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Sidebar Nav List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-thin">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = selectedTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedTab(item.id as any)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="px-2 py-0.5 rounded-md bg-indigo-950 text-indigo-300 font-mono text-[9px]">
                    {item.badge}
                  </span>
                )}
                {item.live && (
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom User Card */}
        <div className="p-4 border-t border-slate-800/80 bg-[#080c1a]">
          <div
            onClick={() => setSelectedTab('profile')}
            className="flex items-center justify-between p-2 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm shrink-0 shadow-md">
                {currentTeacher?.name?.charAt(0) || 'D'}
              </div>
              <div className="text-left overflow-hidden">
                <div className="text-xs font-bold text-white truncate max-w-[120px]">
                  {currentTeacher?.name || 'Dr. Sarah Jenkins'}
                </div>
                <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
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
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Panel Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Bar */}
        <header className="bg-white border-b border-slate-200/80 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <Menu size={22} />
            </button>

            <div className="relative w-full hidden sm:block">
              <Search className="absolute left-3.5 top-3 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search assessments, questions, students..."
                className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-100 border border-slate-200/80 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigate('/')}
              className="text-xs font-extrabold text-slate-500 hover:text-blue-600 transition-colors cursor-pointer mr-1 hidden sm:block"
            >
              ← Main Site
            </button>

            <span className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>System Live</span>
            </span>

            <button className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors relative cursor-pointer hidden sm:block">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-600" />
            </button>

            {/* Mobile View Top Right Profile Avatar Button */}
            <button
              onClick={() => setSelectedTab('profile')}
              title="Open Profile"
              className="flex items-center gap-2 p-1.5 pr-3 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-extrabold text-xs transition-all cursor-pointer shrink-0"
            >
              <div className="w-7 h-7 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
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
