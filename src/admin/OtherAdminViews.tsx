import React from 'react';
import { Sparkles, Trophy, FileText, ShieldCheck, Database, Bell } from 'lucide-react';

export const QuestionsView: React.FC = () => (
  <div className="space-y-6 max-w-7xl mx-auto">
    <div>
      <h1 className="text-3xl font-black text-white tracking-tight">Question Bank Repository</h1>
      <p className="text-xs sm:text-sm font-semibold text-sky-200/70 mt-1">
        Manage system-wide question pools, AI-generated questions, and difficulty tags
      </p>
    </div>
    <div className="bg-[#070e28]/90 rounded-3xl p-8 border border-sky-500/30 shadow-xl shadow-sky-950/40 backdrop-blur-2xl text-center space-y-4 text-white">
      <div className="w-16 h-16 bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded-2xl flex items-center justify-center mx-auto font-bold">
        <Sparkles size={32} />
      </div>
      <h3 className="text-xl font-black text-white">120+ Questions Active</h3>
      <p className="text-sky-200/70 text-xs sm:text-sm max-w-md mx-auto font-medium">
        Questions are automatically indexed by difficulty algorithm (EduQuiz Neural Engine) and tagged by topic.
      </p>
    </div>
  </div>
);

export const ResultsView: React.FC = () => (
  <div className="space-y-6 max-w-7xl mx-auto">
    <div>
      <h1 className="text-3xl font-black text-white tracking-tight">Live Leaderboards & Results</h1>
      <p className="text-xs sm:text-sm font-semibold text-sky-200/70 mt-1">
        Real-time score records, speed metrics, and historical performance breakdowns
      </p>
    </div>
    <div className="bg-[#070e28]/90 rounded-3xl p-8 border border-sky-500/30 shadow-xl shadow-sky-950/40 backdrop-blur-2xl text-center space-y-4 text-white">
      <div className="w-16 h-16 bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 rounded-2xl flex items-center justify-center mx-auto font-bold">
        <Trophy size={32} />
      </div>
      <h3 className="text-xl font-black text-white">Real-Time Battle Engine Sync</h3>
      <p className="text-sky-200/70 text-xs sm:text-sm max-w-md mx-auto font-medium">
        Leaderboards update in sub-100ms real-time via Socket.io websockets across all active classrooms.
      </p>
    </div>
  </div>
);

export const ReportsView: React.FC = () => (
  <div className="space-y-6 max-w-7xl mx-auto">
    <div>
      <h1 className="text-3xl font-black text-white tracking-tight">Analytics & Reports Export</h1>
      <p className="text-xs sm:text-sm font-semibold text-sky-200/70 mt-1">
        Generate institution-level PDF & CSV reports for accreditation and faculty reviews
      </p>
    </div>
    <div className="bg-[#070e28]/90 rounded-3xl p-8 border border-sky-500/30 shadow-xl shadow-sky-950/40 backdrop-blur-2xl text-center space-y-4 text-white">
      <div className="w-16 h-16 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-2xl flex items-center justify-center mx-auto font-bold">
        <FileText size={32} />
      </div>
      <h3 className="text-xl font-black text-white">System Performance Reports</h3>
      <p className="text-sky-200/70 text-xs sm:text-sm max-w-md mx-auto font-medium">
        Export weekly and monthly attendance, quiz completion rates, and learning progress trends.
      </p>
    </div>
  </div>
);

export const SettingsView: React.FC = () => (
  <div className="space-y-6 max-w-7xl mx-auto">
    <div>
      <h1 className="text-3xl font-black text-white tracking-tight">System Settings</h1>
      <p className="text-xs sm:text-sm font-semibold text-sky-200/70 mt-1">
        Platform security, role permissions, API endpoints, and system parameters
      </p>
    </div>
    <div className="bg-[#070e28]/90 rounded-3xl p-6 border border-sky-500/30 shadow-xl shadow-sky-950/40 backdrop-blur-2xl space-y-6 text-white">
      <div className="flex items-center justify-between pb-4 border-b border-sky-500/20">
        <div className="flex items-center gap-3">
          <ShieldCheck size={20} className="text-sky-400" />
          <div>
            <div className="font-bold text-white text-sm">Role-Based Access Control</div>
            <div className="text-xs text-sky-200/70 font-medium">Only Admins can create and manage Teacher credentials</div>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold">Enabled</span>
      </div>

      <div className="flex items-center justify-between pb-4 border-b border-sky-500/20">
        <div className="flex items-center gap-3">
          <Database size={20} className="text-indigo-400" />
          <div>
            <div className="font-bold text-white text-sm">Live Backend Server Sync</div>
            <div className="text-xs text-sky-200/70 font-medium">MongoDB + Express REST API Active</div>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-xs font-bold">Connected</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell size={20} className="text-amber-400" />
          <div>
            <div className="font-bold text-white text-sm">System Notifications</div>
            <div className="text-xs text-sky-200/70 font-medium">Alert admin on new teacher login or assessment creation</div>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold">Active</span>
      </div>
    </div>
  </div>
);
