import React from 'react';
import { BookOpen, Calendar, Clock, User, Users } from 'lucide-react';
import { useAdminStore } from './adminStore';

export const AssessmentManagementView: React.FC = () => {
  const { assessments } = useAdminStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Assessments & Quizzes</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">
          Complete repository of teacher-created assessments, quiz schedules, and participant counts
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assessments.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                  {item.department}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-2">{item.title}</h3>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  item.status === 'Live' ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {item.status}
              </span>
            </div>

            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-2">
                <User size={14} className="text-slate-400" />
                <span>{item.teacherName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={14} className="text-slate-400" />
                <span>{item.studentsParticipated} Participated</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-slate-400" />
                <span>{item.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-slate-400" />
                <span>{item.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
