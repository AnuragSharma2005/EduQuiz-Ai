import React, { useState } from 'react';
import { Search, GraduationCap, Trophy, Activity } from 'lucide-react';
import { useAdminStore } from './adminStore';

export const StudentManagementView: React.FC = () => {
  const { students } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Student Performance & Progress</h1>
        <p className="text-xs sm:text-sm font-semibold text-sky-200/70 mt-1">
          Monitor enrolled students, quiz scores, accuracy ratings, and overall learning trajectory
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#070e28]/90 rounded-3xl p-5 border border-sky-500/30 shadow-lg shadow-sky-950/30 backdrop-blur-xl flex items-center gap-4 text-white">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold border border-indigo-400/30">
            <GraduationCap size={22} />
          </div>
          <div>
            <div className="text-[10px] font-extrabold text-sky-300/80 uppercase tracking-wider">Total Enrolled</div>
            <div className="text-2xl font-black text-white mt-0.5">{students.length}</div>
          </div>
        </div>

        <div className="bg-[#070e28]/90 rounded-3xl p-5 border border-sky-500/30 shadow-lg shadow-sky-950/30 backdrop-blur-xl flex items-center gap-4 text-white">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold border border-amber-400/30">
            <Trophy size={22} />
          </div>
          <div>
            <div className="text-[10px] font-extrabold text-sky-300/80 uppercase tracking-wider">Avg Accuracy</div>
            <div className="text-2xl font-black text-amber-400 mt-0.5">89%</div>
          </div>
        </div>

        <div className="bg-[#070e28]/90 rounded-3xl p-5 border border-sky-500/30 shadow-lg shadow-sky-950/30 backdrop-blur-xl flex items-center gap-4 text-white">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold border border-emerald-400/30">
            <Activity size={22} />
          </div>
          <div>
            <div className="text-[10px] font-extrabold text-sky-300/80 uppercase tracking-wider">Active This Week</div>
            <div className="text-2xl font-black text-emerald-400 mt-0.5">{students.length}</div>
          </div>
        </div>
      </div>

      {/* Table Container (Dark Blue Glassmorphism) */}
      <div className="bg-[#070e28]/90 rounded-3xl border border-sky-500/30 shadow-xl shadow-sky-950/40 backdrop-blur-2xl p-6 space-y-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400/70" />
            <input
              type="text"
              placeholder="Search students by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-[#04091a] border border-sky-500/30 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder:text-slate-500"
            />
          </div>

          <span className="text-xs font-bold text-sky-300/80">{filteredStudents.length} Active Students</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-sky-500/20 text-[11px] font-extrabold uppercase tracking-wider text-sky-300/80">
                <th className="py-4 px-4">STUDENT NAME</th>
                <th className="py-4 px-4">QUIZZES TAKEN</th>
                <th className="py-4 px-4">TOTAL POINTS</th>
                <th className="py-4 px-4">ACCURACY</th>
                <th className="py-4 px-4">PROGRESS</th>
                <th className="py-4 px-4">LAST ACTIVE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-500/10 text-xs font-medium">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-400/40 text-indigo-300 flex items-center justify-center font-bold text-xs">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-white">{student.name}</div>
                        <div className="text-[11px] text-sky-300/70">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-bold text-sky-100">{student.quizzesTaken} Quizzes</td>
                  <td className="py-4 px-4 font-mono font-bold text-indigo-400">{student.totalPoints} PTS</td>
                  <td className="py-4 px-4 font-bold text-emerald-400">{student.accuracy}%</td>
                  <td className="py-4 px-4 w-40">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-sky-300/70">
                        <span>Level</span>
                        <span>{student.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-[#04091a] rounded-full overflow-hidden border border-sky-500/20">
                        <div
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${student.progress}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-xs font-medium text-sky-300/70">{student.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
