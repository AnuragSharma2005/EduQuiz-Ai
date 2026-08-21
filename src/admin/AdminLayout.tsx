import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutGrid,
  Users,
  GraduationCap,
  BookOpen,
  Sparkles,
  Trophy,
  FileText,
  Settings,
  Search,
  Bell,
  LogOut,
  Zap,
  ArrowLeft,
} from 'lucide-react';
import { AdminDashboardView } from './AdminDashboardView';
import { TeacherManagementView } from './TeacherManagementView';
import { StudentManagementView } from './StudentManagementView';
import { AssessmentManagementView } from './AssessmentManagementView';
import { QuestionsView, ResultsView, ReportsView, SettingsView } from './OtherAdminViews';
import { AdminLoginModal } from './AdminLoginModal';

export type AdminTab =
  | 'dashboard'
  | 'teachers'
  | 'students'
  | 'assessments'
  | 'questions'
  | 'results'
  | 'reports'
  | 'settings';

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdminAuth, setIsAdminAuth] = useState<boolean>(() => {
    return sessionStorage.getItem('isAdminAuth') === 'true';
  });

  const handleAdminLogout = () => {
    sessionStorage.removeItem('isAdminAuth');
    setIsAdminAuth(false);
    navigate('/');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'teachers', label: 'Teachers', icon: Users },
    { id: 'students', label: 'Students', icon: GraduationCap },
    { id: 'assessments', label: 'Assessments', icon: BookOpen },
    { id: 'questions', label: 'Questions', icon: Sparkles },
    { id: 'results', label: 'Results', icon: Trophy },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboardView />;
      case 'teachers':
        return <TeacherManagementView />;
      case 'students':
        return <StudentManagementView />;
      case 'assessments':
        return <AssessmentManagementView />;
      case 'questions':
        return <QuestionsView />;
      case 'results':
        return <ResultsView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <AdminDashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex text-slate-800 font-sans">
      {/* LEFT SIDEBAR (Matching Image 2) */}
      <aside className="w-64 bg-[#0a1128] text-white flex flex-col justify-between shrink-0 shadow-2xl">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-slate-800/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/40">
              <Zap size={22} className="text-white fill-white" />
            </div>
            <div>
              <div className="text-lg font-black tracking-tight text-white flex items-center gap-1">
                EduPulse AI
              </div>
              <div className="text-[10px] font-extrabold tracking-widest uppercase text-blue-400">
                ADMIN PANEL
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as AdminTab)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Card */}
        <div className="p-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shrink-0">
                S
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-white truncate">System Admin</div>
                <div className="text-[10px] text-slate-400 truncate">admin@edupulse.ai</div>
              </div>
            </div>
            <button
              onClick={handleAdminLogout}
              title="Logout Admin"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/5 transition-colors cursor-pointer"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Admin Login Modal protection gate */}
      <AdminLoginModal
        isOpen={!isAdminAuth}
        onSuccess={() => setIsAdminAuth(true)}
        onClose={() => navigate('/')}
      />

      {/* RIGHT MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* TOP NAVBAR (Matching Image 2) */}
        <header className="h-20 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between gap-4 sticky top-0 z-20">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search assessments, questions, students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-100/80 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-slate-400 font-medium"
            />
          </div>

          {/* Right Header Status & Profile */}
          <div className="flex items-center gap-4">
            {/* Back to Home Button */}
            <button
              onClick={() => navigate('/')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Main Site</span>
            </button>

            {/* System Live Indicator Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>System Live</span>
            </div>

            {/* Notification Bell */}
            <button className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 transition-colors relative">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-600" />
            </button>

            {/* Admin Avatar Pill */}
            <div className="flex items-center gap-3 pl-2">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
                S
              </div>
              <div className="hidden md:block">
                <div className="text-xs font-bold text-slate-900 leading-tight">System Admin</div>
                <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">ADMIN</div>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN BODY AREA */}
        <main className="flex-1 p-8">{renderContent()}</main>
      </div>
    </div>
  );
};
