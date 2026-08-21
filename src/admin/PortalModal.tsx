import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Settings, Monitor, GraduationCap, ArrowRight, X } from 'lucide-react';

interface PortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PortalModal: React.FC<PortalModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleAdminSelect = () => {
    onClose();
    navigate('/admin');
  };

  const handleTeacherSelect = () => {
    onClose();
    navigate('/teacher');
  };

  const handleStudentSelect = () => {
    onClose();
    navigate('/join');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-5xl bg-[#090b14]/95 border border-indigo-500/20 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden"
        >
          {/* Subtle Ambient Background Glows */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-colors z-10"
          >
            <X size={20} />
          </button>

          {/* Modal Header */}
          <div className="text-center mb-10 sm:mb-12 relative z-10">
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-cyan-400 mb-2 block">
              CHOOSE YOUR PORTAL
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3">
              One intelligent platform.
              <br />
              <span className="bg-gradient-to-r from-indigo-200 via-white to-pink-200 bg-clip-text text-transparent">
                Three powerful experiences.
              </span>
            </h2>
          </div>

          {/* 3 Role Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {/* Admin Card */}
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="group flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-cyan-500/20 hover:border-cyan-400/50 backdrop-blur-xl transition-all shadow-xl hover:shadow-cyan-500/10"
            >
              <div>
                {/* Icon Container */}
                <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                  <Settings size={28} />
                </div>

                <h3 className="text-2xl font-bold text-white text-center mb-3">Admin</h3>
                <p className="text-xs sm:text-sm text-white/50 text-center leading-relaxed mb-6 font-medium">
                  Create teacher accounts, manage students, classes, analytics and complete school administration.
                </p>
              </div>

              <div>
                <button
                  onClick={handleAdminSelect}
                  className="w-full py-3 px-4 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-semibold text-sm hover:bg-cyan-500 hover:text-black transition-all flex items-center justify-center gap-2 group/btn shadow-md"
                >
                  <span>Enter Admin</span>
                  <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>

                {/* Card Visual Footer Accent */}
                <div className="mt-6 p-3 rounded-xl bg-black/40 border border-white/5 space-y-1.5 opacity-60">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                    <div className="h-1.5 w-16 bg-white/20 rounded" />
                    <div className="h-1.5 w-8 bg-white/10 rounded ml-auto" />
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded" />
                </div>
              </div>
            </motion.div>

            {/* Teacher Card */}
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="group flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-purple-500/20 hover:border-purple-400/50 backdrop-blur-xl transition-all shadow-xl hover:shadow-purple-500/10"
            >
              <div>
                {/* Icon Container */}
                <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                  <Monitor size={28} />
                </div>

                <h3 className="text-2xl font-bold text-white text-center mb-3">Teacher</h3>
                <p className="text-xs sm:text-sm text-white/50 text-center leading-relaxed mb-6 font-medium">
                  Chat with AI, generate quizzes, launch QR tests, monitor live assessments and analyze student performance.
                </p>
              </div>

              <div>
                <button
                  onClick={handleTeacherSelect}
                  className="w-full py-3 px-4 rounded-xl bg-purple-950/60 border border-purple-500/40 text-purple-300 font-semibold text-sm hover:bg-purple-500 hover:text-black transition-all flex items-center justify-center gap-2 group/btn shadow-md"
                >
                  <span>Enter Teacher</span>
                  <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>

                {/* Card Visual Footer Accent */}
                <div className="mt-6 p-3 rounded-xl bg-black/40 border border-white/5 space-y-1.5 opacity-60">
                  <div className="h-2 w-24 bg-purple-400/40 rounded" />
                  <div className="h-1.5 w-16 bg-white/10 rounded" />
                </div>
              </div>
            </motion.div>

            {/* Student Card */}
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="group flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-emerald-500/20 hover:border-emerald-400/50 backdrop-blur-xl transition-all shadow-xl hover:shadow-emerald-500/10"
            >
              <div>
                {/* Icon Container */}
                <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                  <GraduationCap size={28} />
                </div>

                <h3 className="text-2xl font-bold text-white text-center mb-3">Student</h3>
                <p className="text-xs sm:text-sm text-white/50 text-center leading-relaxed mb-6 font-medium">
                  Join live quizzes, earn points, improve your ranking and track your learning journey.
                </p>
              </div>

              <div>
                <button
                  onClick={handleStudentSelect}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-semibold text-sm hover:bg-emerald-500 hover:text-black transition-all flex items-center justify-center gap-2 group/btn shadow-md"
                >
                  <span>Enter Student</span>
                  <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>

                {/* Card Visual Footer Accent */}
                <div className="mt-6 p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between opacity-60">
                  <div className="h-2 w-12 bg-emerald-400/40 rounded" />
                  <div className="flex gap-1 items-end h-4">
                    <div className="w-1 bg-emerald-400 h-2 rounded-t" />
                    <div className="w-1 bg-emerald-400 h-3 rounded-t" />
                    <div className="w-1 bg-emerald-400 h-4 rounded-t" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
