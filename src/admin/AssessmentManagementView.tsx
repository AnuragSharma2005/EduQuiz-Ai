import React from 'react';
import { Calendar, Clock, User, Users } from 'lucide-react';
import { useAdminStore } from './adminStore';

export const AssessmentManagementView: React.FC = () => {
  const { assessments } = useAdminStore();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Assessments & Quizzes</h1>
        <p className="text-xs sm:text-sm font-semibold text-sky-200/70 mt-1">
          Complete repository of teacher-created assessments, quiz schedules, and participant counts
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assessments.map((item) => (
          <div key={item.id} className="bg-[#070e28]/90 p-6 rounded-3xl border border-sky-500/30 shadow-xl shadow-sky-950/40 backdrop-blur-2xl space-y-4 text-white">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-300 bg-indigo-600/30 border border-indigo-400/30 px-2.5 py-1 rounded-lg">
                  {item.department}
                </span>
                <h3 className="text-lg font-black text-white mt-3">{item.title}</h3>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  item.status === 'Live' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse' : 'bg-white/10 text-sky-200'
                }`}
              >
                {item.status}
              </span>
            </div>

            <div className="pt-4 border-t border-sky-500/20 grid grid-cols-2 gap-3 text-xs text-sky-200/70 font-medium">
              <div className="flex items-center gap-2">
                <User size={14} className="text-sky-400" />
                <span>{item.teacherName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={14} className="text-sky-400" />
                <span>{item.studentsParticipated} Participated</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-sky-400" />
                <span>{item.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-sky-400" />
                <span>{item.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
