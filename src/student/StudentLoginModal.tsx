import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Sparkles, ArrowRight, ArrowLeft, UserCheck, ShieldCheck } from 'lucide-react';
import { useStudentStore } from './studentStore';

export const StudentLoginModal: React.FC = () => {
  const navigate = useNavigate();
  const { isStudentAuth, loginStudent } = useStudentStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  if (isStudentAuth) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    loginStudent(email, name);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#020512]/95 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="max-w-md w-full max-h-[90vh] overflow-y-auto scrollbar-hide bg-[#070e28] border border-sky-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-sky-950/50 text-white space-y-6 relative my-auto"
      >
        {/* Sky Blue Ambient Glow Effects */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Back to Home Button */}
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-xs font-extrabold text-sky-400 hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-sky-500/15 border border-sky-400/40 text-sky-300 flex items-center justify-center mx-auto shadow-inner shadow-sky-500/20">
            <UserCheck size={24} className="sm:w-7 sm:h-7" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-2">
            Student Portal
          </h2>
          <p className="text-xs text-sky-200/70 font-medium">
            Sign in to join live classroom battles, view your rank & track assessment results.
          </p>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegisterMode && (
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-sky-300/80">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Anurag Sharma"
                className="w-full px-4 py-3 rounded-2xl bg-[#04091a] border border-sky-500/30 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent placeholder:text-slate-500"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-sky-300/80">
              Student Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 text-sky-400/70" size={16} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@edupulse.ai"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#04091a] border border-sky-500/30 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-sky-300/80">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 text-sky-400/70" size={16} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#04091a] border border-sky-500/30 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent placeholder:text-slate-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 group"
          >
            <span>{isRegisterMode ? 'Create Student Account' : 'Sign In to Portal'}</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setIsRegisterMode(!isRegisterMode)}
            className="text-xs font-bold text-sky-400 hover:text-white hover:underline cursor-pointer transition-colors"
          >
            {isRegisterMode ? 'Already have an account? Sign In' : 'New student? Register here'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
