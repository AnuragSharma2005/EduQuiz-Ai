import React from 'react';
import { Sparkles, Trophy, FileText, Settings, ShieldCheck, Database, Bell } from 'lucide-react';

export const QuestionsView: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Question Bank Repository</h1>
      <p className="text-sm font-medium text-slate-500 mt-1">
        Manage system-wide question pools, AI-generated questions, and difficulty tags
      </p>
    </div>
    <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs text-center space-y-4">
      <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
        <Sparkles size={32} />
      </div>
      <h3 className="text-xl font-bold text-slate-900">120+ Questions Active</h3>
      <p className="text-slate-500 text-sm max-w-md mx-auto">
        Questions are automatically indexed by difficulty algorithm (AdaptiveIQ Neural Engine) and tagged by topic.
      </p>
    </div>
  </div>
);

export const ResultsView: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Live Leaderboards & Results</h1>
      <p className="text-sm font-medium text-slate-500 mt-1">
        Real-time score records, speed metrics, and historical performance breakdowns
      </p>
    </div>
    <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs text-center space-y-4">
      <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
        <Trophy size={32} />
      </div>
      <h3 className="text-xl font-bold text-slate-900">Real-Time Battle Engine Sync</h3>
      <p className="text-slate-500 text-sm max-w-md mx-auto">
        Leaderboards update in sub-100ms real-time via Socket.io websockets across all active classrooms.
      </p>
    </div>
  </div>
);

export const ReportsView: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Analytics & Reports Export</h1>
      <p className="text-sm font-medium text-slate-500 mt-1">
        Generate institution-level PDF & CSV reports for accreditation and faculty reviews
      </p>
    </div>
    <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs text-center space-y-4">
      <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
        <FileText size={32} />
      </div>
      <h3 className="text-xl font-bold text-slate-900">System Performance Reports</h3>
      <p className="text-slate-500 text-sm max-w-md mx-auto">
        Export weekly and monthly attendance, quiz completion rates, and learning progress trends.
      </p>
    </div>
  </div>
);

export const SettingsView: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Settings</h1>
      <p className="text-sm font-medium text-slate-500 mt-1">
        Platform security, role permissions, API endpoints, and system parameters
      </p>
    </div>
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <ShieldCheck size={20} className="text-blue-600" />
          <div>
            <div className="font-bold text-slate-900 text-sm">Role-Based Access Control</div>
            <div className="text-xs text-slate-500">Only Admins can create and manage Teacher credentials</div>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">Enabled</span>
      </div>

      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <Database size={20} className="text-purple-600" />
          <div>
            <div className="font-bold text-slate-900 text-sm">Live Backend Server Sync</div>
            <div className="text-xs text-slate-500">MongoDB + Express REST API Active</div>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">Connected</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell size={20} className="text-amber-600" />
          <div>
            <div className="font-bold text-slate-900 text-sm">System Notifications</div>
            <div className="text-xs text-slate-500">Alert admin on new teacher login or assessment creation</div>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">Active</span>
      </div>
    </div>
  </div>
);
