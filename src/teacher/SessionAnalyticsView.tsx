import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, Users, Star, Radio, ArrowRight, Trash2 } from 'lucide-react';
import { useTeacherStore, SessionHistoryItem } from './teacherStore';

export const SessionAnalyticsView: React.FC = () => {
  const { sessionHistory, currentTeacher, setSelectedTab, fetchTeacherSessions, deleteSession } = useTeacherStore();
  const [selectedSession, setSelectedSession] = useState<SessionHistoryItem | null>(sessionHistory[0] || null);

  useEffect(() => {
    fetchTeacherSessions();
  }, [fetchTeacherSessions]);

  useEffect(() => {
    if (sessionHistory.length > 0 && (!selectedSession || !sessionHistory.some(s => s.id === selectedSession.id))) {
      setSelectedSession(sessionHistory[0]);
    } else if (sessionHistory.length === 0) {
      setSelectedSession(null);
    }
  }, [sessionHistory, selectedSession]);

  if (sessionHistory.length === 0) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="bg-[#070e28]/90 rounded-3xl p-6 border border-sky-500/30 shadow-xl shadow-sky-950/40 backdrop-blur-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <Trophy className="text-amber-400" size={28} />
              <span>Leaderboard & Session History Analytics</span>
            </h1>
            <p className="text-xs font-semibold text-sky-200/70 mt-1">
              Review detailed student rankings, score breakdowns, and classroom results from past live assessments.
            </p>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-slate-300 text-xs font-bold flex items-center gap-2">
            <Star size={16} className="text-slate-400" />
            <span>0 Sessions Logged</span>
          </div>
        </div>

        {/* Zero State Container */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#070e28]/90 rounded-3xl p-12 text-center border border-dashed border-sky-500/30 shadow-xl backdrop-blur-2xl space-y-5"
        >
          <div className="w-20 h-20 mx-auto rounded-3xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shadow-inner">
            <Trophy size={40} className="text-amber-400" />
          </div>

          <div className="max-w-lg mx-auto space-y-2">
            <h2 className="text-xl font-black text-white">No Completed Sessions Found</h2>
            <p className="text-xs text-sky-200/70 leading-relaxed">
              Logged in as <span className="text-sky-300 font-bold">{currentTeacher?.name || 'Teacher'}</span>. You have not hosted any completed live quiz sessions yet. Once you launch a classroom quiz room and finish it, detailed student rankings and performance stats will appear here.
            </p>
          </div>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setSelectedTab('dashboard')}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-sky-500/25 transition-all flex items-center gap-2"
            >
              <Radio size={16} />
              <span>Launch Live Session</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="bg-[#070e28]/90 rounded-3xl p-6 border border-sky-500/30 shadow-xl shadow-sky-950/40 backdrop-blur-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Trophy className="text-amber-400" size={28} />
            <span>Leaderboard & Session History Analytics</span>
          </h1>
          <p className="text-xs font-semibold text-sky-200/70 mt-1">
            Review detailed student rankings, score breakdowns, and classroom results from past live assessments.
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-bold flex items-center gap-2">
          <Star size={16} className="fill-amber-400 text-amber-400" />
          <span>{sessionHistory.length} Sessions Logged</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: List of Past Sessions (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <h2 className="text-[10px] font-extrabold uppercase tracking-wider text-sky-300/80 px-1">
            Completed Assessments ({sessionHistory.length})
          </h2>

          <div className="space-y-3">
            {sessionHistory.map((item) => {
              const isSelected = selectedSession?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedSession(item)}
                  className={`p-5 rounded-3xl border transition-all cursor-pointer relative group ${
                    isSelected
                      ? 'bg-[#070e28]/90 backdrop-blur-2xl text-white border-sky-400 ring-1 ring-sky-400/40 shadow-xl shadow-sky-950/40'
                      : 'bg-[#070e28]/60 hover:bg-[#070e28]/90 border-sky-500/20 text-slate-300 hover:text-white shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                        isSelected ? 'bg-sky-500/20 text-sky-300 border border-sky-400/40' : 'bg-sky-500/10 text-sky-400/70 border border-sky-500/20'
                      }`}
                    >
                      {item.category}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-mono font-bold ${isSelected ? 'text-sky-300' : 'text-sky-300/50'}`}>
                        {item.date}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Are you sure you want to delete session "${item.assessmentTitle}"?`)) {
                            deleteSession(item.id);
                          }
                        }}
                        className="p-1 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 transition-colors opacity-80 group-hover:opacity-100"
                        title="Delete Session Record"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-extrabold mt-2.5 leading-snug">{item.assessmentTitle}</h3>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-sky-500/20 text-xs font-semibold text-sky-200/70">
                    <div className="flex items-center gap-1.5">
                      <Users size={14} className="text-sky-400" />
                      <span>{item.totalStudents} Students</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-sky-300/60">Room:</span>
                      <span className="font-mono font-bold text-sky-300">{item.roomCode}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Session Deep Details (7 Cols) */}
        <div className="lg:col-span-7">
          {selectedSession ? (
            <div className="bg-[#070e28]/90 rounded-3xl p-6 sm:p-8 border border-sky-500/30 shadow-xl shadow-sky-950/40 backdrop-blur-2xl space-y-6 text-white">
              <div className="border-b border-sky-500/20 pb-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-sky-400 tracking-wider">SESSION SUMMARY</span>
                  <h2 className="text-xl font-black text-white mt-1">{selectedSession.assessmentTitle}</h2>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-sky-200/70">Class Average</div>
                  <div className="text-2xl font-black text-emerald-400">
                    {selectedSession.totalStudents > 0 ? `${selectedSession.avgScore}%` : '0%'}
                  </div>
                </div>
              </div>

              {/* Student Rankings Leaderboard Table */}
              <div className="space-y-3">
                <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-sky-300/80">
                  Student Ranks & Performance ({selectedSession.rankings.length})
                </h3>

                {selectedSession.rankings.length > 0 ? (
                  <div className="space-y-2">
                    {selectedSession.rankings.map((rankItem) => {
                      const isTop1 = rankItem.rank === 1;
                      const isTop2 = rankItem.rank === 2;
                      const isTop3 = rankItem.rank === 3;

                      return (
                        <div
                          key={rankItem.rank}
                          className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                            isTop1
                              ? 'bg-amber-950/40 border-amber-500/50 text-white'
                              : isTop2
                              ? 'bg-slate-900/60 border-slate-700/60 text-white'
                              : isTop3
                              ? 'bg-amber-950/20 border-amber-700/30 text-white'
                              : 'bg-[#04091a] border-sky-500/20 text-white'
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            <div
                              className={`w-9 h-9 rounded-xl font-black flex items-center justify-center text-sm ${
                                isTop1
                                  ? 'bg-amber-400 text-slate-950 border border-amber-300'
                                  : isTop2
                                  ? 'bg-slate-300 text-slate-900 border border-slate-400'
                                  : isTop3
                                  ? 'bg-amber-700 text-white border border-amber-600'
                                  : 'bg-sky-500/15 text-sky-300 border border-sky-400/30'
                              }`}
                            >
                              {isTop1 ? '👑' : isTop2 ? '🥈' : isTop3 ? '🥉' : `#${rankItem.rank}`}
                            </div>

                            <div>
                              <div className="text-xs font-black text-white">{rankItem.name}</div>
                              <div className="text-[10px] font-semibold text-sky-300/70">
                                {rankItem.correctCount} Correct Answers
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-sm font-black text-white font-mono">{rankItem.score} pts</div>
                            <div className="text-[10px] font-bold text-emerald-400">PASSED</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 rounded-2xl bg-sky-950/30 border border-sky-500/20 text-center space-y-1">
                    <p className="text-xs font-bold text-sky-200">No student submissions recorded</p>
                    <p className="text-[11px] text-sky-300/60">0 students participated in this live session, so the class average is 0%.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-[#070e28]/90 rounded-3xl p-12 text-center border border-sky-500/30 text-sky-300/70">
              Select a completed session on the left to view detailed student results.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
