import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Radio,
  RotateCcw,
  Monitor,
  MessageSquare,
  SkipForward,
  Trophy,
  Users,
  ShieldAlert,
} from 'lucide-react';
import { useTeacherStore } from './teacherStore';

export const TeacherLiveSessionControlView: React.FC = () => {
  const { activeSession, setSelectedTab, tickTimer, nextQuestion, endLiveSession } = useTeacherStore();

  // Active Timer Engine for Live Control Panel
  useEffect(() => {
    if (!activeSession || activeSession.status !== 'live') return;

    const interval = setInterval(() => {
      if (activeSession.timer > 0) {
        useTeacherStore.setState({
          activeSession: {
            ...activeSession,
            timer: Math.max(0, activeSession.timer - 1),
          },
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSession?.status, activeSession?.timer, activeSession?.currentQuestionIndex]);

  // Clean 0 State when no live session active (Dark Indigo Theme)
  if (!activeSession) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-6 text-center space-y-6 bg-[#070e28]/90 rounded-3xl border border-sky-500/30 shadow-xl shadow-sky-950/40 backdrop-blur-2xl text-white">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 text-indigo-300 flex items-center justify-center mx-auto border border-indigo-400/30 shadow-inner font-bold">
          <Radio size={32} />
        </div>

        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">No Active Live Session</h2>
          <p className="text-xs sm:text-sm text-sky-200/70 max-w-md mx-auto mt-2 leading-relaxed font-medium">
            There is no live session running right now. Choose a ready assessment from your dashboard or create a new one to host a live quiz.
          </p>
        </div>

        <button
          onClick={() => setSelectedTab('dashboard')}
          className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30 transition-all cursor-pointer inline-flex items-center gap-2"
        >
          <span>← Go to Control Center</span>
        </button>
      </div>
    );
  }

  const { roomCode, assessment, currentQuestionIndex, timer, students, status } = activeSession;
  const currentQuestion = assessment.questions[currentQuestionIndex] || assessment.questions[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header Row */}
      <div className="bg-[#070e28]/90 rounded-3xl p-6 border border-sky-500/30 shadow-xl shadow-sky-950/40 backdrop-blur-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-white">
        <div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
              <Radio size={12} className="animate-pulse" />
              <span>LIVE SESSION CONTROL</span>
            </span>
            <span className="text-xs font-mono font-bold text-sky-300 bg-sky-500/10 px-2.5 py-0.5 rounded-lg border border-sky-500/30">
              CODE: {roomCode}
            </span>
          </div>

          <h1 className="text-2xl font-black text-white tracking-tight mt-2">
            {assessment.title}
          </h1>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setSelectedTab('lobby')}
            className="px-4 py-2.5 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/30 text-amber-300 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>Re-Start Assessment</span>
          </button>

          <button
            onClick={() => {
              setSelectedTab('projector');
              if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
              }
            }}
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all flex items-center gap-2 cursor-pointer border border-white/10"
          >
            <Monitor size={14} className="text-sky-300" />
            <span>Open Projector Screen ↗</span>
          </button>

          <button className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all flex items-center gap-2 cursor-pointer border border-white/10">
            <MessageSquare size={14} className="text-sky-300" />
            <span>Live Chat ({students.length})</span>
          </button>
        </div>
      </div>

      {/* Main Dark Control Bar */}
      <div className="bg-[#04091a] text-white rounded-3xl p-6 border border-sky-500/30 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-6 divide-x divide-sky-500/20">
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-sky-300/70">
              CURRENT STATE
            </div>
            <div className="text-xl font-black tracking-wider text-emerald-400 uppercase mt-0.5">
              {status === 'live' ? 'LIVE' : 'WAITING LOBBY'}
            </div>
          </div>

          <div className="pl-6">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-sky-300/70">
              Question
            </div>
            <div className="text-xl font-black text-white mt-0.5">
              {currentQuestionIndex + 1} <span className="text-sky-300/50 font-normal">/ {assessment.questions.length}</span>
            </div>
          </div>

          <div className="pl-6 bg-sky-500/10 p-3 rounded-2xl border border-sky-500/20">
            <div className="text-[9px] font-extrabold uppercase tracking-widest text-sky-300/70 flex items-center gap-1">
              <span className="text-amber-400">⏱</span>
              <span>QUESTION TIMER</span>
            </div>
            <div className="text-lg font-black text-emerald-400 font-mono mt-0.5">
              {timer}s <span className="text-sky-300/50 font-normal text-xs">/ {currentQuestion?.timeLimit || 20}s</span>
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={nextQuestion}
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer uppercase tracking-wider"
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
        <div className="lg:col-span-4 bg-[#070e28]/90 rounded-3xl p-6 border border-sky-500/30 shadow-xl shadow-sky-950/40 backdrop-blur-2xl space-y-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-extrabold text-base">
              <Users size={18} className="text-indigo-400" />
              <span>Active Students ({students.length})</span>
            </div>
            <span className="text-[10px] font-extrabold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/40">
              ● LIVE
            </span>
          </div>

          {students.length === 0 ? (
            <div className="text-center py-8 text-xs text-sky-300/60 font-medium bg-[#04091a] rounded-2xl border border-dashed border-sky-500/20">
              No students connected yet.
            </div>
          ) : (
            <div className="space-y-2.5">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-[#04091a] border border-sky-500/20"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-black text-white">{student.name}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/10 text-sky-200">
                    {student.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Card: Academic Integrity */}
        <div className="lg:col-span-8 bg-[#070e28]/90 rounded-3xl p-6 border border-sky-500/30 shadow-xl shadow-sky-950/40 backdrop-blur-2xl space-y-6 text-white">
          <div className="flex items-center gap-2 text-white font-extrabold text-base">
            <ShieldAlert size={18} className="text-rose-400" />
            <span>Academic Integrity & Live Reports</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-sky-300/70">
                ANTI-CHEAT ALERTS (0)
              </div>
              <div className="p-4 rounded-2xl bg-[#04091a] border border-sky-500/20 text-center text-xs font-semibold text-sky-300/60 py-8">
                No violations recorded.
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-sky-300/70">
                STUDENT REPORTED ISSUES (0)
              </div>
              <div className="p-4 rounded-2xl bg-[#04091a] border border-sky-500/20 text-center text-xs font-semibold text-sky-300/60 py-8">
                No reported issues.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
