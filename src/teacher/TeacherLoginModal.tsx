import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Lock, Mail, ArrowRight, Sparkles, CheckCircle2, UserCheck } from 'lucide-react';
import { useTeacherStore } from './teacherStore';

export const TeacherLoginModal: React.FC = () => {
  const { isTeacherAuth, loginTeacher } = useTeacherStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (isTeacherAuth) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const success = loginTeacher(email, password);
    if (!success) {
      setErrorMsg('Invalid Teacher credentials. Please try again.');
    }
  };

  const handleAutoFill = () => {
    setEmail('teacher@edupulse.ai');
    setPassword('teacher123');
    setErrorMsg('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 overflow-hidden"
        >
          {/* Top Decorative Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-purple-600/10 text-purple-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <UserCheck size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Teacher Portal Login</h2>
            <p className="text-xs font-medium text-slate-500 mt-1">
              Enter your assigned teacher credentials to access your control center
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold text-center">
                {errorMsg}
              </div>
            )}

            {/* Email */}
            <div className="space-y-1">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600">
                TEACHER EMAIL / ID
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                <input
                  type="email"
                  required
                  placeholder="teacher@edupulse.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600">
                PASSWORD
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                />
              </div>
            </div>

            {/* Auto Fill Button */}
            <button
              type="button"
              onClick={handleAutoFill}
              className="w-full py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-purple-200/60"
            >
              <Sparkles size={14} className="text-purple-600" />
              <span>Auto Fill Sample Credentials (teacher@edupulse.ai)</span>
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>Login to Teacher Portal</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-6 text-center text-[11px] text-slate-400 font-medium border-t border-slate-100 pt-4">
            🔒 Account credentials created by System Admin.
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
