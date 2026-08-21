import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Radio,
  RotateCcw,
  Monitor,
  MessageSquare,
  Play,
  SkipForward,
  Trophy,
  Users,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { useTeacherStore } from './teacherStore';

export const TeacherLiveSessionControlView: React.FC = () => {
  const { activeSession, setSelectedTab, tickTimer, nextQuestion, endLiveSession, clearActiveSession } = useTeacherStore();

  // Active Timer Engine for Live Control Panel
  useEffect(() => {
    if (!activeSession || activeSession.status !== 'live') return;

    const interval = setInterval(() => {
      tickTimer();
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSession?.status, activeSession?.timer, activeSession?.currentQuestionIndex]);

  // Clean 0 State when no live session active
  if (!activeSession) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-6 text-center space-y-6 bg-white rounded-3xl border border-slate-200 shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-200/60 shadow-inner">
          <Radio size={32} />
        </div>

        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">No Active Live Session</h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
            There is no live session running right now. Choose a ready assessment from your dashboard or create a new one to host a live quiz.
          </p>
        </div>

        <button
          onClick={() => setSelectedTab('dashboard')}
          className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
        >
          ← Go to Control Center
        </button>
      </div>
    );
  }

  const { roomCode, assessment, currentQuestionIndex, timer, students, status } = activeSession;
  const currentQuestion = assessment.questions[currentQuestionIndex] || assessment.questions[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header Row */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
              <Radio size={12} className="animate-pulse" />
              <span>LIVE SESSION CONTROL</span>
            </span>
            <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200/60">
              CODE: {roomCode}
            </span>
          </div>

          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
            {assessment.title}
          </h1>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setSelectedTab('lobby')}
            className="px-4 py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>Re-Start Assessment</span>
          </button>

          <button
            onClick={() => setSelectedTab('projector')}
            className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Monitor size={14} className="text-blue-600" />
            <span>Open Projector Screen ↗</span>
          </button>

          <button className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer">
            <MessageSquare size={14} className="text-blue-600" />
            <span>Live Chat ({students.length})</span>
          </button>
        </div>
      </div>

      {/* Main Dark Control Bar */}
      <div className="bg-[#0f172a] text-white rounded-3xl p-6 border border-slate-800 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-6 divide-x divide-slate-800">
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              CURRENT STATE
            </div>
            <div className="text-xl font-black tracking-wider text-emerald-400 uppercase mt-0.5">
              {status === 'live' ? 'LIVE' : 'WAITING LOBBY'}
            </div>
          </div>

          <div className="pl-6">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              Question
            </div>
            <div className="text-xl font-black text-white mt-0.5">
              {currentQuestionIndex + 1} <span className="text-slate-500 font-normal">/ {assessment.questions.length}</span>
            </div>
          </div>

          <div className="pl-6 bg-slate-800/40 p-3 rounded-2xl border border-slate-700/60">
            <div className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1">
              <span className="text-amber-400">⏱</span>
              <span>QUESTION TIMER</span>
            </div>
            <div className="text-lg font-black text-emerald-400 font-mono mt-0.5">
              {timer}s <span className="text-slate-500 font-normal text-xs">/ {currentQuestion?.timeLimit || 20}s</span>
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={nextQuestion}
            className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer uppercase tracking-wider"
          >
            <SkipForward size={16} />
            <span>NEXT QUESTION</span>
          </button>

          <button
            onClick={endLiveSession}
            className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2 cursor-pointer uppercase tracking-wider"
          >
            <Trophy size={16} />
            <span>END ASSESSMENT</span>
          </button>
        </div>
      </div>

      {/* 2 Main Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Card: Active Students */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base">
              <Users size={18} className="text-blue-600" />
              <span>Active Students ({students.length})</span>
            </div>
            <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              ● LIVE
            </span>
          </div>

          {students.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400 font-medium bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              No students connected yet.
            </div>
          ) : (
            <div className="space-y-2.5">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-black text-slate-800">{student.name}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-200/70 text-slate-600">
                    {student.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Card: Academic Integrity */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base">
            <ShieldAlert size={18} className="text-rose-600" />
            <span>Academic Integrity & Live Reports</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                ANTI-CHEAT ALERTS (0)
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-center text-xs font-semibold text-slate-400 py-8">
                No violations recorded.
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                STUDENT REPORTED ISSUES (0)
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-center text-xs font-semibold text-slate-400 py-8">
                No reported issues.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
