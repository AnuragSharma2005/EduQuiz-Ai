import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Sparkles, UserCheck, X, ArrowLeft } from 'lucide-react';
import { useTeacherStore } from './teacherStore';

export const TeacherLoginModal: React.FC = () => {
  const navigate = useNavigate();
  const { isTeacherAuth, loginTeacher } = useTeacherStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isTeacherAuth) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const success = await loginTeacher(email, password);
      if (!success) {
        setErrorMsg('Invalid Teacher Email or Password. Only credentials created by Admin can log in.');
      }
    } catch (err) {
      setErrorMsg('Login process failed. Please check your credentials and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAutoFill = () => {
    setEmail('teacher@edupulse.ai');
    setPassword('teacher123');
    setErrorMsg('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020512]/92 backdrop-blur-2xl overflow-y-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="relative w-full max-w-md max-h-[90vh] overflow-y-auto scrollbar-hide bg-[#070e28] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-sky-950/60 border border-sky-500/30 text-white my-auto space-y-5"
        >
          {/* Sky Blue Ambient Glow */}
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

          {/* Close (Cross) Button */}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/5 border border-sky-500/20 text-sky-300 hover:text-white hover:bg-white/10 transition-colors z-20 cursor-pointer"
            title="Close modal"
          >
            <X size={18} />
          </button>

          {/* Top Decorative Header */}
          <div className="text-center space-y-2 pt-2">
            <div className="w-14 h-14 rounded-2xl bg-sky-500/15 border border-sky-400/40 text-sky-300 flex items-center justify-center mx-auto shadow-inner shadow-sky-500/20">
              <UserCheck size={28} />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">Teacher Portal Login</h2>
            <p className="text-xs font-medium text-sky-200/70">
              Enter your assigned teacher credentials to access your control center
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-800/60 text-rose-300 text-xs font-bold text-center">
                {errorMsg}
              </div>
            )}

            {/* Email */}
            <div className="space-y-1">
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-sky-300/80">
                TEACHER EMAIL / ID
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 text-sky-400/70" size={16} />
                <input
                  type="email"
                  required
                  placeholder="teacher@edupulse.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#04091a] border border-sky-500/30 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-sky-300/80">
                PASSWORD
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 text-sky-400/70" size={16} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#04091a] border border-sky-500/30 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Auto Fill Button */}
            <button
              type="button"
              onClick={handleAutoFill}
              className="w-full py-2.5 px-3 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-sky-500/30"
            >
              <Sparkles size={14} className="text-sky-400" />
              <span>Auto Fill Sample Credentials</span>
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 mt-2 group ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              <span>{isSubmitting ? 'Validating Credentials...' : 'Login to Teacher Portal'}</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-4 text-center text-[10px] text-sky-300/60 font-medium border-t border-sky-500/20 pt-3 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-sky-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-bold"
            >
              <ArrowLeft size={12} />
              <span>Return to Home</span>
            </button>
            <span>•</span>
            <span>Account created by Admin</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
