import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Share2, Edit, Settings, LogOut, Copy, Check, Users, Play, Monitor, Info, GraduationCap, UserPlus } from 'lucide-react';
import { useTeacherStore } from './teacherStore';
import socket from '../services/socket';

export const TeacherGameLobbyView: React.FC = () => {
  const { activeSession, setSelectedTab, startGame, simulateJoinStudent } = useTeacherStore();
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    if (!activeSession) return;
    const { roomCode, assessment } = activeSession;
    const teacherPlayer = {
      id: 'teacher_host_' + roomCode,
      username: useTeacherStore.getState().currentTeacher?.name || 'Teacher Host',
      isHost: true,
    };

    socket.emit('join_room', { roomCode, player: teacherPlayer, quiz: assessment });
    socket.emit('set_quiz', { roomCode, quiz: assessment });

    const handleRoomUpdate = (roomData: any) => {
      if (!roomData) return;
      const eventCode = String(roomData.code || '').trim().toUpperCase();
      const activeCode = String(roomCode).trim().toUpperCase();
      if (eventCode !== activeCode) return;

      const connectedStudents = (roomData.players || [])
        .filter((p: any) => !p.isHost)
        .map((p: any) => ({
          id: p.id || p.odId || 'std_' + Math.random().toString(36).substring(2, 7),
          name: p.username || p.name || 'Student',
          email: p.email || `${(p.username || 'student').toLowerCase().replace(/\s+/g, '')}@student.edu`,
          avatar: p.avatar || '🎓',
          status: p.isReady ? 'READY' : 'WAITING',
          score: p.score || 0,
        }));

      useTeacherStore.setState((state) => ({
        activeSession: state.activeSession ? {
          ...state.activeSession,
          students: connectedStudents,
        } : null,
      }));
    };

    socket.on('room_update', handleRoomUpdate);

    const handleConnect = () => {
      socket.emit('join_room', { roomCode, player: teacherPlayer, quiz: assessment });
      socket.emit('set_quiz', { roomCode, quiz: assessment });
    };

    socket.on('connect', handleConnect);
    return () => {
      socket.off('room_update', handleRoomUpdate);
      socket.off('connect', handleConnect);
    };
  }, [activeSession?.roomCode]);

  if (!activeSession) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-6 text-center space-y-6 bg-[#070e28]/90 rounded-3xl border border-sky-500/30 shadow-xl shadow-sky-950/40 backdrop-blur-2xl text-white">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 text-indigo-300 flex items-center justify-center mx-auto border border-indigo-400/30 shadow-inner font-bold">
          <Users size={32} />
        </div>

        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">No Game Lobby Active</h2>
          <p className="text-xs sm:text-sm text-sky-200/70 max-w-md mx-auto mt-2 leading-relaxed font-medium">
            There is no active lobby right now. Start an assessment from your Control Center to generate a room code and QR code.
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

  const { roomCode, assessment, students } = activeSession;
  const joinUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/join?code=${roomCode}`
    : `http://localhost:5173/join?code=${roomCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(joinUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartGame = () => {
    startGame();
  };

  return (
    <div className="bg-[#090c15] text-white rounded-3xl p-4 sm:p-8 border border-indigo-500/20 shadow-2xl space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3">
            GAME LOBBY
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-400 mt-1">
            Share the QR code and start when everyone is ready.
          </p>
        </div>

        {/* Room Code Badge */}
        <div className="inline-flex items-center gap-4 bg-[#141a2e] border border-indigo-500/30 px-5 sm:px-6 py-3 rounded-2xl shadow-lg shrink-0">
          <div>
            <div className="text-[10px] font-extrabold tracking-widest text-slate-400 uppercase">ROOM CODE</div>
            <div className="text-xl sm:text-2xl font-black tracking-widest text-indigo-400 font-mono">{roomCode}</div>
          </div>
          <button
            onClick={handleCopyLink}
            title="Share Room Code"
            className="p-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white transition-all cursor-pointer"
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>

      {/* Main 3 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Column: Quiz Details */}
        <div className="lg:col-span-3 space-y-4 sm:space-y-6">
          <div className="bg-[#121727] border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
            <div className="text-[10px] font-extrabold tracking-widest uppercase text-slate-400 flex items-center gap-1.5">
              <Info size={14} className="text-indigo-400" />
              <span>QUIZ DETAILS</span>
            </div>

            <h2 className="text-xl font-extrabold text-white leading-snug">{assessment.title}</h2>

            <div className="space-y-2.5 pt-2 border-t border-slate-800 text-xs font-medium text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Category</span>
                <span className="font-bold text-indigo-300 uppercase">{assessment.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Difficulty</span>
                <span className="px-2 py-0.5 rounded bg-indigo-900/60 text-indigo-300 text-[10px] font-bold">
                  {assessment.difficulty}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Questions</span>
                <span className="font-bold text-white">{assessment.questions.length}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5">
            <button
              onClick={() => setSelectedTab('create')}
              className="w-full py-3 px-4 rounded-2xl bg-[#121727] hover:bg-[#1c233b] border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <Edit size={16} />
              <span>Edit Quiz</span>
            </button>

            <button
              onClick={() => setSelectedTab('live')}
              className="w-full py-3 px-4 rounded-2xl bg-[#121727] hover:bg-[#1c233b] border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <Settings size={16} />
              <span>Game Settings</span>
            </button>

            <button
              onClick={() => setSelectedTab('dashboard')}
              className="w-full py-3 px-4 rounded-2xl bg-rose-950/30 hover:bg-rose-900/40 border border-rose-800/40 text-rose-400 hover:text-rose-300 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <LogOut size={16} />
              <span>Leave Room</span>
            </button>
          </div>
        </div>

        {/* Center Column: Connected Players Grid */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between text-xs font-extrabold text-slate-400 uppercase tracking-wider px-1">
            <span>WAITING ROOM ({students.length})</span>

            <button
              onClick={simulateJoinStudent}
              className="px-3 py-1 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 text-[11px] font-bold transition-all flex items-center gap-1.5 border border-indigo-500/40 cursor-pointer"
            >
              <UserPlus size={14} />
              <span>+ Add Test Student</span>
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {students.map((student) => (
              <motion.div
                key={student.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-[#121727] border border-indigo-500/30 rounded-2xl p-4 text-center flex flex-col items-center justify-center space-y-2.5 shadow-lg"
              >
                <div className="w-14 h-14 rounded-2xl bg-indigo-900/50 text-white flex items-center justify-center border border-indigo-500/40 shadow-inner text-2xl overflow-hidden">
                  {student.avatar && (student.avatar.startsWith('http') || student.avatar.startsWith('data:') || student.avatar.startsWith('/')) ? (
                    <img src={student.avatar} alt={student.name} className="w-full h-full object-cover rounded-2xl" referrerPolicy="no-referrer" />
                  ) : (
                    <span>{student.avatar || '🎓'}</span>
                  )}
                </div>

                <div className="font-extrabold text-white text-xs sm:text-sm truncate max-w-full">
                  {student.name}
                </div>

                <div className="text-[9px] font-black uppercase tracking-wider text-amber-300 bg-amber-950/70 border border-amber-800/50 px-2.5 py-0.5 rounded-full">
                  {student.status}
                </div>
              </motion.div>
            ))}

            {/* Dotted Placeholder Slots */}
            {Array.from({ length: Math.max(0, 8 - students.length) }).map((_, idx) => (
              <div
                key={idx}
                className="bg-[#0e121f]/50 border-2 border-dashed border-slate-800/80 rounded-2xl p-4 h-36 flex items-center justify-center text-slate-700"
              >
                <Users size={24} className="opacity-30" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: QR Code & Start Button */}
        <div className="lg:col-span-3 space-y-4 sm:space-y-6">
          <div className="bg-[#121727] border border-slate-800 rounded-3xl p-5 sm:p-6 text-center space-y-4">
            <div className="text-[10px] font-extrabold tracking-widest uppercase text-indigo-400 flex items-center justify-center gap-1.5">
              <Monitor size={14} />
              <span>SCAN TO JOIN</span>
            </div>

            <div className="p-3 bg-white rounded-2xl inline-block shadow-xl">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(joinUrl)}`}
                alt="Scan to Join QR Code"
                className="w-36 h-36 sm:w-40 sm:h-40 rounded-xl"
              />
            </div>

            <p className="text-[10px] font-mono text-slate-400 truncate max-w-full px-2">
              {joinUrl}
            </p>

            <button
              onClick={handleCopyLink}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-700"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? 'Link Copied!' : 'Copy Invite Link'}</span>
            </button>
          </div>

          <div className="bg-[#121727] border border-slate-800 rounded-3xl p-5 sm:p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center mx-auto">
              <Users size={22} />
            </div>

            <div>
              <div className="text-3xl font-black text-white">{students.length}</div>
              <div className="text-xs font-bold text-slate-400">Players Joined</div>
            </div>

            <button
              onClick={handleStartGame}
              disabled={students.length === 0}
              className={`w-full py-3.5 px-6 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 uppercase tracking-wider ${students.length > 0
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/30 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
            >
              <Play size={18} className="fill-current" />
              <span>Start Live Quiz</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
