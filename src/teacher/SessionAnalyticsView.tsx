import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, History, Users, Calendar, Award, ChevronRight, CheckCircle2, Star } from 'lucide-react';
import { useTeacherStore, SessionHistoryItem } from './teacherStore';

export const SessionAnalyticsView: React.FC = () => {
  const { sessionHistory } = useTeacherStore();
  const [selectedSession, setSelectedSession] = useState<SessionHistoryItem | null>(sessionHistory[0] || null);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Trophy className="text-amber-500" size={28} />
            <span>Leaderboard & Session History Analytics</span>
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Review detailed student rankings, score breakdowns, and classroom results from past live assessments.
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-2">
          <Star size={16} className="fill-amber-400 text-amber-500" />
          <span>{sessionHistory.length} Sessions Logged</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: List of Past Sessions (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 px-1">
            Completed Assessments ({sessionHistory.length})
          </h2>

          <div className="space-y-3">
            {sessionHistory.map((item) => {
              const isSelected = selectedSession?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedSession(item)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/30'
                      : 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-800 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.category}
                    </span>
                    <span className={`text-[11px] font-mono font-bold ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>
                      {item.date}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold mt-2.5 leading-snug">{item.assessmentTitle}</h3>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-current/10 text-xs font-semibold">
                    <div className="flex items-center gap-1.5">
                      <Users size={14} />
                      <span>{item.totalStudents} Students</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span>Room:</span>
                      <span className="font-mono font-bold">{item.roomCode}</span>
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
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider">SESSION SUMMARY</span>
                  <h2 className="text-xl font-black text-slate-900 mt-1">{selectedSession.assessmentTitle}</h2>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-slate-400">Class Average</div>
                  <div className="text-2xl font-black text-emerald-600">{selectedSession.avgScore}%</div>
                </div>
              </div>

              {/* Student Rankings Leaderboard Table */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Student Ranks & Performance ({selectedSession.rankings.length})
                </h3>

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
                            ? 'bg-amber-50/80 border-amber-200 shadow-xs'
                            : isTop2
                            ? 'bg-slate-50 border-slate-200'
                            : isTop3
                            ? 'bg-amber-950/5 border-amber-800/20'
                            : 'bg-white border-slate-200/70'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div
                            className={`w-9 h-9 rounded-xl font-black flex items-center justify-center text-sm shadow-xs ${
                              isTop1
                                ? 'bg-amber-400 text-slate-950 border border-amber-300'
                                : isTop2
                                ? 'bg-slate-300 text-slate-900 border border-slate-400'
                                : isTop3
                                ? 'bg-amber-800 text-white'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {isTop1 ? '👑' : isTop2 ? '🥈' : isTop3 ? '🥉' : `#${rankItem.rank}`}
                          </div>

                          <div>
                            <div className="text-xs font-black text-slate-900">{rankItem.name}</div>
                            <div className="text-[10px] font-semibold text-slate-400">
                              {rankItem.correctCount} Correct Answers
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-sm font-black text-slate-900 font-mono">{rankItem.score} pts</div>
                          <div className="text-[10px] font-bold text-emerald-600">PASSED</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-400">
              Select a completed session on the left to view detailed student results.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
