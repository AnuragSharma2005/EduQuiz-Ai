import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import {
  BookOpen,
  Users,
  Sparkles,
  Award,
  Play,
  Plus,
  Clock,
  Edit,
  Trash2,
} from 'lucide-react';
import { useTeacherStore } from './teacherStore';
import { EditAssessmentModal } from './EditAssessmentModal';

export const TeacherDashboardView: React.FC = () => {
  const {
    assessments,
    startLiveSession,
    setSelectedTab,
    deleteAssessment,
    setEditingAssessment,
    editingAssessment,
    fetchTeacherQuizzes,
    fetchTeacherSessions,
  } = useTeacherStore();

  useEffect(() => {
    fetchTeacherQuizzes();
    fetchTeacherSessions();
  }, [fetchTeacherQuizzes, fetchTeacherSessions]);

  const totalAssessments = assessments.length;
  const totalEnrolled = assessments.reduce((acc, a) => acc + (a.enrolledStudentsCount || 0), 0);
  const totalQuestions = assessments.reduce((acc, a) => acc + (a.questions?.length || 0), 0);
  const avgScore = totalAssessments > 0 ? (assessments.reduce((acc, a) => acc + (a.avgScore || 0), 0) / totalAssessments).toFixed(1) : '0.0';

  const handleStartSession = (assessmentId: string) => {
    startLiveSession(assessmentId);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#070e28]/90 rounded-3xl p-6 sm:p-8 border border-sky-500/30 shadow-xl shadow-sky-950/40 backdrop-blur-2xl">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Teacher Control Center
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-sky-200/70 mt-1">
            Manage quizzes, edit questions, and launch live interactive classroom sessions.
          </p>
        </div>

        <button
          onClick={() => setSelectedTab('create')}
          className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Plus size={18} />
          <span>Create Assessment</span>
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-[#070e28]/90 rounded-3xl p-6 border border-sky-500/30 shadow-lg shadow-sky-950/30 backdrop-blur-xl space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-500/15 border border-sky-400/40 text-sky-300 flex items-center justify-center font-bold">
            <BookOpen size={20} />
          </div>
          <div>
            <div className="text-[10px] font-extrabold text-sky-300/80 uppercase tracking-wider">TOTAL ASSESSMENTS</div>
            <div className="text-3xl font-black text-white mt-1">{totalAssessments}</div>
          </div>
        </div>

        <div className="bg-[#070e28]/90 rounded-3xl p-6 border border-sky-500/30 shadow-lg shadow-sky-950/30 backdrop-blur-xl space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 border border-indigo-400/40 text-indigo-300 flex items-center justify-center font-bold">
            <Users size={20} />
          </div>
          <div>
            <div className="text-[10px] font-extrabold text-sky-300/80 uppercase tracking-wider">ENROLLED STUDENTS</div>
            <div className="text-3xl font-black text-white mt-1">{totalEnrolled}</div>
          </div>
        </div>

        <div className="bg-[#070e28]/90 rounded-3xl p-6 border border-sky-500/30 shadow-lg shadow-sky-950/30 backdrop-blur-xl space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 flex items-center justify-center font-bold">
            <Sparkles size={20} />
          </div>
          <div>
            <div className="text-[10px] font-extrabold text-sky-300/80 uppercase tracking-wider">QUESTIONS CREATED</div>
            <div className="text-3xl font-black text-white mt-1">{totalQuestions}</div>
          </div>
        </div>

        <div className="bg-[#070e28]/90 rounded-3xl p-6 border border-sky-500/30 shadow-lg shadow-sky-950/30 backdrop-blur-xl space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-400/40 text-amber-300 flex items-center justify-center font-bold">
            <Award size={20} />
          </div>
          <div>
            <div className="text-[10px] font-extrabold text-sky-300/80 uppercase tracking-wider">AVERAGE CLASS SCORE</div>
            <div className="text-3xl font-black text-white mt-1">{avgScore}%</div>
          </div>
        </div>
      </div>

      {/* My Ready Assessments Section */}
      <div className="bg-[#070e28]/90 rounded-3xl p-6 sm:p-8 border border-sky-500/30 shadow-xl shadow-sky-950/40 backdrop-blur-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-black text-white">My Ready Assessments</h2>
            <p className="text-xs text-sky-200/70 font-medium">Launch live sessions or edit questions anytime.</p>
          </div>
          <span className="text-xs font-bold text-sky-400">Launch live sessions instantly</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assessments.length === 0 ? (
            <div className="col-span-full py-12 px-6 rounded-3xl bg-[#04091a] border border-dashed border-sky-500/30 text-center space-y-4 shadow-inner">
              <div className="w-16 h-16 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center mx-auto border border-sky-500/20 shadow-md">
                <BookOpen size={28} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-white">No Assessments Created Yet</h3>
                <p className="text-xs text-sky-200/70 max-w-md mx-auto font-medium">
                  Your teacher profile is fresh and ready. Create your first interactive quiz assessment to host live multiplayer classroom sessions.
                </p>
              </div>
              <button
                onClick={() => setSelectedTab('create')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <Plus size={16} />
                <span>Create Your First Assessment</span>
              </button>
            </div>
          ) : (
            assessments.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -3 }}
                className="bg-[#04091a] border border-sky-500/25 rounded-3xl p-6 space-y-5 flex flex-col justify-between hover:border-sky-400/60 transition-all shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-[10px] font-black uppercase tracking-wider">
                      {item.category}
                    </span>
                    <span className="text-xs font-bold text-sky-300/70 flex items-center gap-1">
                      <Clock size={14} />
                      <span>{item.timePerQuestion || 20}s / Q</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-white mt-3 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-sky-200/70 font-medium mt-1">
                    Quiz covering key topics with {item.questions?.length || 0} active questions ready for instant multiplayer hosting.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-2 border-t border-sky-500/20">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleStartSession(item.id)}
                      className="w-full py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Play size={14} className="fill-white" />
                      <span>Start Session</span>
                    </button>

                    <button
                      onClick={() => setEditingAssessment(item)}
                      className="w-full py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Edit size={14} />
                      <span>Edit Quiz</span>
                    </button>
                  </div>

                  <button
                    onClick={() => deleteAssessment(item.id)}
                    className="w-full py-2 px-3 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 font-bold text-[11px] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 size={12} />
                    <span>Delete Quiz</span>
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Edit Assessment Modal */}
      {editingAssessment && <EditAssessmentModal />}
    </div>
  );
};
