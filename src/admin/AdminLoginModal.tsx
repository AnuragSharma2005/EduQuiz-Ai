import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Mail, Lock, Key, AlertCircle, ArrowRight, Eye, EyeOff, X } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onClose?: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onSuccess, onClose }) => {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      // Validate Admin Credentials: admin@edupulse.ai or admin / admin123
      const isIdValid = adminId.trim().toLowerCase() === 'admin@edupulse.ai' || adminId.trim().toLowerCase() === 'admin';
      const isPassValid = password === 'admin123';

      if (isIdValid && isPassValid) {
        sessionStorage.setItem('isAdminAuth', 'true');
        setLoading(false);
        onSuccess();
      } else {
        setLoading(false);
        setError('Invalid Admin Credentials. Check ID & Password below.');
      }
    }, 400);
  };

  const handleAutoFillDemo = () => {
    setAdminId('admin@edupulse.ai');
    setPassword('admin123');
    setError('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="relative w-full max-w-md bg-[#0b0e1b] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-white"
        >
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close button if provided */}
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          )}

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white mt-2">Admin Security Gate</h2>
            <p className="text-xs text-white/50 font-medium">
              Enter generated administrator credentials to access Admin Panel
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold"
            >
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Admin ID / Email */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-black uppercase tracking-wider text-cyan-400">
                ADMIN EMAIL / ID
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  required
                  placeholder="admin@edupulse.ai"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-medium focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 placeholder:text-white/20"
                />
              </div>
            </div>

            {/* Admin Password */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-black uppercase tracking-wider text-cyan-400">
                ADMIN PASSWORD
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 placeholder:text-white/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] mt-2"
            >
              <span>{loading ? 'Authenticating...' : 'Login to Admin Dashboard'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Generated Credentials Info Pill */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Key size={14} />
                Generated Admin Credentials
              </span>
              <button
                type="button"
                onClick={handleAutoFillDemo}
                className="text-[10px] bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 px-2 py-0.5 rounded transition-colors"
              >
                Auto Fill
              </button>
            </div>
            <div className="text-xs font-mono text-white/70 space-y-0.5">
              <div>
                ID: <span className="text-white font-bold">admin@edupulse.ai</span> (or <span className="text-white font-bold">admin</span>)
              </div>
              <div>
                Password: <span className="text-cyan-300 font-bold">admin123</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
