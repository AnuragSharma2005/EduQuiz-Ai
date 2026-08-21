import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  User,
  Mail,
  Edit2,
  Check,
  X,
  Trophy,
  Award,
  Calendar,
  Zap,
  BookOpen,
  ArrowLeft,
  CheckCircle2,
  BarChart2
} from 'lucide-react';
import { useStudentStore } from './studentStore';

export const StudentProfileView: React.FC = () => {
  const { currentStudent, updateStudentProfile, assessmentHistory, setSelectedTab } = useStudentStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(currentStudent.name);
  const [editEmail, setEditEmail] = useState(currentStudent.email);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudentProfile({
      name: editName.trim() || currentStudent.name,
      email: editEmail.trim() || currentStudent.email,
    });
    setIsEditing(false);
  };

  const totalQuizzes = assessmentHistory.length;
  const avgRank = totalQuizzes > 0
    ? (assessmentHistory.reduce((sum, h) => sum + h.rank, 0) / totalQuizzes).toFixed(1)
    : 'N/A';
  const totalScore = assessmentHistory.reduce((sum, h) => sum + h.score, 0);
  const podiumWins = assessmentHistory.filter((h) => h.rank <= 3).length;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 select-none">
      {/* Top Header Card */}
      <div className="bg-[#070e28] border border-sky-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-sky-950/40 relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          {/* Avatar + Info */}
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-sky-950/60 border-2 border-sky-400/50 p-1 shadow-2xl shadow-sky-500/20 shrink-0">
              <img
                src={currentStudent.avatar}
                alt={currentStudent.name}
                className="w-full h-full object-cover rounded-2xl"
                referrerPolicy="no-referrer"
              />
            </div>

            {!isEditing ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {currentStudent.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/40 text-[10px] font-black uppercase tracking-wider">
                    STUDENT
                  </span>
                </div>
                <div className="text-xs font-semibold text-sky-200/80 flex items-center gap-2">
                  <Mail size={14} className="text-sky-400" />
                  <span>{currentStudent.email}</span>
                </div>
                <div className="text-[11px] text-slate-400 font-medium pt-1">
                  {currentStudent.department || 'Computer Science'} • {currentStudent.school || 'School of Tech'}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="space-y-3 flex-1 max-w-md">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-sky-300 tracking-wider">Edit Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#04091a] border border-sky-500/30 text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-sky-300 tracking-wider">Edit Email</label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#04091a] border border-sky-500/30 text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer shadow-md shadow-indigo-600/30"
                  >
                    <Check size={14} />
                    <span>Save Changes</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <X size={14} />
                    <span>Cancel</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Action Buttons */}
          {!isEditing && (
            <button
              onClick={() => {
                setEditName(currentStudent.name);
                setEditEmail(currentStudent.email);
                setIsEditing(true);
              }}
              className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-sky-500/30 text-white font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Edit2 size={14} className="text-sky-400" />
              <span>Edit Profile & Email</span>
            </button>
          )}
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#070e28] border border-sky-500/30 rounded-3xl p-5 text-white space-y-1 shadow-lg shadow-sky-950/20">
          <div className="flex items-center justify-between text-sky-300/80 text-xs font-extrabold uppercase tracking-wider">
            <span>ASSESSMENTS</span>
            <BookOpen size={16} className="text-sky-400" />
          </div>
          <div className="text-3xl font-black text-white">{totalQuizzes}</div>
          <div className="text-[10px] text-slate-400 font-medium">Completed Battles</div>
        </div>

        <div className="bg-[#070e28] border border-sky-500/30 rounded-3xl p-5 text-white space-y-1 shadow-lg shadow-sky-950/20">
          <div className="flex items-center justify-between text-sky-300/80 text-xs font-extrabold uppercase tracking-wider">
            <span>AVERAGE RANK</span>
            <BarChart2 size={16} className="text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400">#{avgRank}</div>
          <div className="text-[10px] text-slate-400 font-medium">Classroom Leaderboard</div>
        </div>

        <div className="bg-[#070e28] border border-sky-500/30 rounded-3xl p-5 text-white space-y-1 shadow-lg shadow-sky-950/20">
          <div className="flex items-center justify-between text-sky-300/80 text-xs font-extrabold uppercase tracking-wider">
            <span>PODIUM WINS</span>
            <Trophy size={16} className="text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400">{podiumWins}</div>
          <div className="text-[10px] text-slate-400 font-medium">Top 3 Finishes</div>
        </div>

        <div className="bg-[#070e28] border border-sky-500/30 rounded-3xl p-5 text-white space-y-1 shadow-lg shadow-sky-950/20">
          <div className="flex items-center justify-between text-sky-300/80 text-xs font-extrabold uppercase tracking-wider">
            <span>TOTAL POINTS</span>
            <Zap size={16} className="text-sky-400" fill="currentColor" />
          </div>
          <div className="text-3xl font-black text-sky-300">{totalScore.toLocaleString()}</div>
          <div className="text-[10px] text-slate-400 font-medium">Lifetime XP Score</div>
        </div>
      </div>

      {/* Assessment History Table */}
      <div className="bg-[#070e28] border border-sky-500/30 rounded-3xl p-6 shadow-2xl shadow-sky-950/30 space-y-6 text-white">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <Award size={20} className="text-sky-400" />
              <span>Assessment Participation History</span>
            </h2>
            <p className="text-xs text-sky-200/70">
              Detailed breakdown of all live classroom quizzes you have completed.
            </p>
          </div>

          <button
            onClick={() => setSelectedTab('join')}
            className="px-4 py-2 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold text-xs transition-all cursor-pointer shadow-lg shadow-sky-500/30"
          >
            + Join New Battle
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-sky-500/20 text-[10px] font-black uppercase tracking-widest text-sky-300/80">
                <th className="py-3 px-4">ASSESSMENT TITLE</th>
                <th className="py-3 px-4">ROOM CODE</th>
                <th className="py-3 px-4">DATE</th>
                <th className="py-3 px-4">SCORE</th>
                <th className="py-3 px-4">ACCURACY</th>
                <th className="py-3 px-4 text-right">FINAL RANK</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-500/10 font-semibold">
              {assessmentHistory.map((item) => {
                const isFirst = item.rank === 1;
                const isSecond = item.rank === 2;
                const isThird = item.rank === 3;

                return (
                  <tr key={item.id} className="hover:bg-sky-950/30 transition-colors">
                    <td className="py-4 px-4 font-black text-white">{item.assessmentTitle}</td>
                    <td className="py-4 px-4 font-mono font-bold text-sky-300">{item.roomCode}</td>
                    <td className="py-4 px-4 text-slate-400">{item.date}</td>
                    <td className="py-4 px-4 font-extrabold text-amber-400">{item.score} pts</td>
                    <td className="py-4 px-4 text-emerald-400">
                      {item.correctAnswers} / {item.totalQuestions} Correct
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                          isFirst
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : isSecond
                              ? 'bg-slate-300/20 text-slate-200 border border-slate-400/40'
                              : isThird
                                ? 'bg-amber-900/40 text-amber-400 border border-amber-800/40'
                                : 'bg-slate-900 text-sky-400/80 border border-sky-500/20'
                        }`}
                      >
                        {isFirst && '🥇 '}
                        {isSecond && '🥈 '}
                        {isThird && '🥉 '}
                        Rank #{item.rank} / {item.totalParticipants}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
