import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Monitor, GraduationCap, ArrowRight, X, Sparkles } from 'lucide-react';

interface PortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PortalModal: React.FC<PortalModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleTeacherSelect = () => {
    onClose();
    navigate('/teacher');
  };

  const handleStudentSelect = () => {
    onClose();
    navigate('/student');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#020512]/90 backdrop-blur-2xl overflow-y-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto scrollbar-hide bg-[#060c24]/95 border border-sky-500/30 rounded-3xl p-4 sm:p-8 md:p-10 shadow-2xl shadow-sky-950/60 my-auto"
        >
          {/* Ambient Background Glows */}
          <div className="absolute top-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-white/5 border border-sky-500/20 text-sky-300 hover:text-white hover:bg-white/10 transition-colors z-20 cursor-pointer"
          >
            <X size={18} className="sm:w-5 sm:h-5" />
          </button>

          {/* Modal Header */}
          <div className="text-center mb-6 sm:mb-10 md:mb-12 relative z-10 pt-2 sm:pt-0">
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.25em] text-sky-400 mb-1.5 sm:mb-2 flex items-center justify-center gap-1.5">
              <Sparkles size={12} className="sm:w-3.5 sm:h-3.5" />
              CHOOSE YOUR PORTAL
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              One intelligent platform.
              <br />
              <span className="bg-gradient-to-r from-sky-300 via-blue-200 to-white bg-clip-text text-transparent">
                Two powerful experiences.
              </span>
            </h2>
          </div>

          {/* 2 Role Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 relative z-10">
            {/* Teacher Card */}
            <motion.div
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className="group flex flex-col justify-between p-5 sm:p-8 rounded-2xl bg-gradient-to-b from-[#0a1436] to-[#04091a] border border-sky-500/25 hover:border-sky-400/60 backdrop-blur-xl transition-all shadow-xl hover:shadow-sky-500/20"
            >
              <div>
                <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-4 sm:mb-6 rounded-2xl bg-blue-500/15 border border-blue-400/40 flex items-center justify-center text-blue-300 group-hover:scale-105 transition-all shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                  <Monitor size={24} className="sm:w-7 sm:h-7" />
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white text-center mb-2 sm:mb-3">Teacher</h3>
                <p className="text-xs sm:text-sm text-sky-100/70 text-center leading-relaxed mb-4 sm:mb-6 font-medium">
                  Chat with AI, generate quizzes, launch QR tests, monitor live assessments and analyze student performance.
                </p>
              </div>

              <div>
                <button
                  onClick={handleTeacherSelect}
                  className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 group/btn shadow-md shadow-indigo-600/30 cursor-pointer"
                >
                  <span>Enter Teacher</span>
                  <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>

            {/* Student Card */}
            <motion.div
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className="group flex flex-col justify-between p-5 sm:p-8 rounded-2xl bg-gradient-to-b from-[#0a1436] to-[#04091a] border border-sky-500/25 hover:border-sky-400/60 backdrop-blur-xl transition-all shadow-xl hover:shadow-sky-500/20"
            >
              <div>
                <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-4 sm:mb-6 rounded-2xl bg-sky-400/15 border border-sky-300/40 flex items-center justify-center text-sky-200 group-hover:scale-105 transition-all shadow-[0_0_20px_rgba(56,189,248,0.25)]">
                  <GraduationCap size={24} className="sm:w-7 sm:h-7" />
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white text-center mb-2 sm:mb-3">Student</h3>
                <p className="text-xs sm:text-sm text-sky-100/70 text-center leading-relaxed mb-4 sm:mb-6 font-medium">
                  Join live quizzes, earn points, improve your ranking and track your learning journey.
                </p>
              </div>

              <div>
                <button
                  onClick={handleStudentSelect}
                  className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 group/btn shadow-md shadow-indigo-600/30 cursor-pointer"
                >
                  <span>Enter Student</span>
                  <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
