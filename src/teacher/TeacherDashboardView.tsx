import React from 'react';
import { motion } from 'motion/react';
import {
  BookOpen,
  Users,
  Sparkles,
  Award,
  Play,
  RotateCcw,
  Plus,
  Clock,
  ChevronRight,
  Edit,
  Trash2,
  CheckCircle,
} from 'lucide-react';
import { useTeacherStore, TeacherAssessment } from './teacherStore';
import { EditAssessmentModal } from './EditAssessmentModal';

export const TeacherDashboardView: React.FC = () => {
  const { assessments, startLiveSession, setSelectedTab, deleteAssessment, setEditingAssessment, editingAssessment } =
    useTeacherStore();

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Teacher Control Center
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
            Manage quizzes, edit questions, and launch live interactive classroom sessions.
          </p>
        </div>

        <button
          onClick={() => setSelectedTab('create')}
          className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Plus size={18} />
          <span>Create Assessment</span>
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <BookOpen size={20} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">TOTAL ASSESSMENTS</div>
            <div className="text-3xl font-black text-slate-900 mt-1">{totalAssessments}</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Users size={20} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">ENROLLED STUDENTS</div>
            <div className="text-3xl font-black text-slate-900 mt-1">{totalEnrolled}</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Sparkles size={20} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">QUESTIONS CREATED</div>
            <div className="text-3xl font-black text-slate-900 mt-1">{totalQuestions}</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Award size={20} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">AVERAGE CLASS SCORE</div>
            <div className="text-3xl font-black text-slate-900 mt-1">{avgScore}%</div>
          </div>
        </div>
      </div>

      {/* My Ready Assessments Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900">My Ready Assessments</h2>
            <p className="text-xs text-slate-500 font-medium">Launch live sessions or edit questions anytime.</p>
          </div>
          <span className="text-xs font-bold text-slate-400">Launch live sessions instantly</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assessments.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -3 }}
              className="bg-slate-50 border border-slate-200/90 rounded-3xl p-6 space-y-5 flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-wider">
                    {item.category}
                  </span>
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                    <Clock size={14} />
                    <span>{item.timePerQuestion || 20}s / Q</span>
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-900 mt-3 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Quiz covering key topics with {item.questions?.length || 0} active questions ready for instant multiplayer hosting.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleStartSession(item.id)}
                    className="w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Play size={14} className="fill-white" />
                    <span>Start Session</span>
                  </button>

                  <button
                    onClick={() => setEditingAssessment(item)}
                    className="w-full py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-white font-extrabold text-xs shadow-md shadow-amber-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Edit size={14} />
                    <span>Edit Quiz</span>
                  </button>
                </div>

                <button
                  onClick={() => deleteAssessment(item.id)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-200/60 hover:bg-rose-100 text-slate-600 hover:text-rose-600 font-bold text-[11px] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Trash2 size={12} />
                  <span>Delete Quiz</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Edit Assessment Modal */}
      {editingAssessment && <EditAssessmentModal />}
    </div>
  );
};
