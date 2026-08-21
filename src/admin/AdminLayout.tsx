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
  Menu,
  X,
} from 'lucide-react';
import { AdminDashboardView } from './AdminDashboardView';
import { TeacherManagementView } from './TeacherManagementView';
import { StudentManagementView } from './StudentManagementView';
import { AssessmentManagementView } from './AssessmentManagementView';
import { QuestionsView, ResultsView, ReportsView, SettingsView } from './OtherAdminViews';
import { AdminLoginModal } from './AdminLoginModal';
import { ParticleBackground } from '../components/ParticleBackground';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  const handleTabChange = (tabId: AdminTab) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

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
    <div className="min-h-screen bg-[#030712] text-white font-sans flex relative overflow-x-hidden selection:bg-sky-500/30">
      {/* Particle & Ambient Background */}
      <ParticleBackground />
      <div className="fixed inset-0 bg-blue-grid opacity-15 pointer-events-none z-0" />
      <div className="fixed top-1/4 left-10 w-96 h-96 bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Mobile Drawer Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* SIDEBAR DRAWER (Responsive Mobile + Desktop) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 lg:w-64 bg-[#050b1e]/95 backdrop-blur-2xl border-r border-sky-500/20 text-white flex flex-col justify-between shrink-0 shadow-2xl shadow-sky-950/50 transform ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-5 sm:p-6 border-b border-sky-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleTabChange('dashboard')}>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/30">
                <Zap size={22} className="text-white fill-white" />
              </div>
              <div>
                <div className="text-lg font-black tracking-tight text-white flex items-center gap-1">
                  EduPulse AI
                </div>
                <div className="text-[10px] font-extrabold tracking-widest uppercase text-sky-400 flex items-center gap-1">
                  <Sparkles size={10} />
                  <span>ADMIN PANEL</span>
                </div>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 scrollbar-hide max-h-[calc(100vh-180px)] overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id as AdminTab)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/30 border border-sky-400/50'
                      : 'text-sky-100/70 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-white' : 'text-sky-400/70'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Card */}
        <div className="p-4 border-t border-sky-500/20 bg-[#04091a]">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-sky-500/20">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white font-bold flex items-center justify-center text-sm shrink-0 shadow-md">
                S
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-white truncate">System Admin</div>
                <div className="text-[10px] text-sky-300/70 truncate">admin@edupulse.ai</div>
              </div>
            </div>
            <button
              onClick={handleAdminLogout}
              title="Logout Admin"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-rose-950/60 transition-colors cursor-pointer"
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
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 overflow-y-auto relative z-10">
        {/* TOP NAVBAR */}
        <header className="h-20 bg-[#050b1e]/85 backdrop-blur-xl border-b border-sky-500/20 px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-md shadow-sky-950/20">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            {/* Hamburger Button for Mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2.5 rounded-2xl bg-[#070e28] border border-sky-500/30 text-sky-300 hover:text-white transition-colors shrink-0 cursor-pointer"
              aria-label="Open Navigation Menu"
            >
              <Menu size={20} />
            </button>

            {/* Search Bar */}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-400/60" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-2xl bg-[#070e28] border border-sky-500/30 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-400/50 placeholder:text-slate-500 font-medium"
              />
            </div>
          </div>

          {/* Right Header Status & Profile */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Back to Home Button */}
            <button
              onClick={() => navigate('/')}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-sky-300 transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Main Site</span>
            </button>

            {/* System Live Indicator Badge */}
            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>System Live</span>
            </div>

            {/* Notification Bell */}
            <button className="p-2 sm:p-2.5 rounded-xl bg-[#070e28] border border-sky-500/30 text-sky-300 hover:text-white hover:bg-white/10 transition-colors relative cursor-pointer">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-sky-400" />
            </button>

            {/* Admin Avatar Pill */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 text-white font-bold flex items-center justify-center text-xs sm:text-sm shadow-md">
                S
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-bold text-white leading-tight">System Admin</div>
                <div className="text-[10px] font-extrabold uppercase text-sky-400 tracking-wider">ADMIN</div>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN BODY AREA */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{renderContent()}</main>
      </div>
    </div>
  );
};
