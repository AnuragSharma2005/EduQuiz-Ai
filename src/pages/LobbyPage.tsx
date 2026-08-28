import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useParams, useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import { Share2, Play, Settings, LogOut, Info, Users, QrCode, Copy, Pencil, Sparkles } from 'lucide-react';
import { Button, Card } from '../components/UI';
import { PlayerCard } from '../components/PlayerCard';
import { useGameStore, Player } from '../store/useGameStore';
import { useStudentStore } from '../student/studentStore';
import socket from '../services/socket';
import { ParticleBackground } from '../components/ParticleBackground';

const DEFAULT_FALLBACK_QUIZ = {
  id: 'battle_quiz_default',
  title: 'Adaptive Battle Arena',
  category: 'General Knowledge',
  difficulty: 'Medium' as const,
  questions: [
    {
      id: 'q1',
      text: 'Which planet in our solar system is known as the Red Planet?',
      options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
      correctAnswer: 1,
      timeLimit: 15,
    },
    {
      id: 'q2',
      text: 'What is the primary gas found in Earth\'s atmosphere?',
      options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'],
      correctAnswer: 1,
      timeLimit: 15,
    },
    {
      id: 'q3',
      text: 'What is the chemical symbol for Gold?',
      options: ['Ag', 'Au', 'Fe', 'Cu'],
      correctAnswer: 1,
      timeLimit: 15,
    },
    {
      id: 'q4',
      text: 'Which data structure follows the Last-In, First-Out (LIFO) principle?',
      options: ['Queue', 'Stack', 'Array', 'Linked List'],
      correctAnswer: 1,
      timeLimit: 15,
    },
  ],
};

export const LobbyPage = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const {
    currentQuiz,
    players,
    me,
    status,
    setCurrentQuiz,
    setStatus,
    addPlayer,
    setPlayers,
    setRoomCode
  } = useGameStore();

  const { isStudentAuth, currentStudent } = useStudentStore();

  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    if (code) {
      setRoomCode(code);
    }
  }, [code, setRoomCode]);

  useEffect(() => {
    if ((status === 'starting' || status === 'question' || status === 'leaderboard') && code) {
      navigate(`/game/${code}`);
    } else if (status === 'finished') {
      navigate('/results');
    }
  }, [status, code, navigate]);

  useEffect(() => {
    const existingPlayer = me || players.find(p => (p.id && (p.id === socket.id || p.id === currentStudent?.id)) || (p.username && p.username === currentStudent?.name));
    const localPlayer = existingPlayer || {
      id: currentStudent?.id || socket.id || `st_${Date.now()}`,
      username: isStudentAuth && currentStudent.name ? currentStudent.name : `Student_${Math.floor(1000 + Math.random() * 9000)}`,
      score: 0,
      isReady: true,
      avatar: isStudentAuth && currentStudent.avatar ? currentStudent.avatar : `https://api.dicebear.com/7.x/avataaars/svg?seed=${socket.id || 'guest'}`,
      isHost: false,
    };

    if (!existingPlayer) {
      addPlayer(localPlayer);
    }

    if (code) {
      socket.emit('join_room', { roomCode: code, player: localPlayer });
    }
  }, [code, isStudentAuth, currentStudent]);

  useEffect(() => {
    const handleRoomPlayers = (data: { players: any[] }) => {
      if (Array.isArray(data.players)) {
        setPlayers(data.players);
      }
    };

    socket.on('room_players', handleRoomPlayers);
    socket.on('player_joined', (p) => addPlayer(p));

    return () => {
      socket.off('room_players', handleRoomPlayers);
      socket.off('player_joined');
    };
  }, [addPlayer, setPlayers]);

  const inviteLink = `${window.location.origin}/join/${code}`;

  useEffect(() => {
    if (code) {
      QRCode.toDataURL(inviteLink, { margin: 2, width: 280 })
        .then((url) => setQrDataUrl(url))
        .catch(() => setQrDataUrl(''));
    }
  }, [code, inviteLink]);

  const handleStart = () => {
    if (!currentQuiz) {
      setCurrentQuiz(DEFAULT_FALLBACK_QUIZ);
    }
    setStatus('question');
    socket.emit('start_game', { roomCode: code });
  };

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(inviteLink);
  };

  const contestants = players.filter((p) => !p.isHost);

  return (
    <div className="min-h-screen bg-[#030712] text-white p-4 sm:p-8 relative overflow-hidden select-none">
      <ParticleBackground />
      <div className="absolute inset-0 bg-blue-grid opacity-15 pointer-events-none z-0" />
      <div className="fixed top-1/4 left-1/4 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
        
        {/* Left Sidebar: Quiz Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#070e28] border border-sky-500/30 rounded-3xl p-6 shadow-2xl shadow-sky-950/40 space-y-4">
            <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles size={16} />
              <span>Assessment Details</span>
            </div>
            <h3 className="text-xl font-black text-white">{currentQuiz?.title || DEFAULT_FALLBACK_QUIZ.title}</h3>
            <div className="flex items-center gap-2">
              <span className="bg-sky-500/20 text-sky-300 border border-sky-400/30 px-3 py-1 rounded-xl text-xs font-extrabold">
                {currentQuiz?.category || DEFAULT_FALLBACK_QUIZ.category}
              </span>
              <span className="bg-blue-600/20 text-blue-300 border border-blue-400/30 px-3 py-1 rounded-xl text-xs font-extrabold">
                {currentQuiz?.questions?.length || DEFAULT_FALLBACK_QUIZ.questions.length} Questions
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <button 
              onClick={() => navigate('/')}
              className="w-full py-3 px-4 rounded-2xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/60 text-rose-300 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut size={16} />
              <span>Leave Room</span>
            </button>
          </div>
        </div>

        {/* Main Area: Players Grid */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black italic uppercase tracking-tighter bg-gradient-to-r from-sky-300 via-blue-200 to-white bg-clip-text text-transparent">
                Game Lobby
              </h2>
              <p className="text-sky-200/70 text-xs sm:text-sm font-medium mt-1">
                {me?.isHost ? 'Share the QR code & start when everyone is ready.' : 'Waiting for the host to begin the battle.'}
              </p>
            </div>
            <div className="bg-[#070e28] border border-sky-500/30 rounded-2xl px-6 py-3 flex items-center gap-4 shadow-lg shadow-sky-950/30">
              <div className="text-right">
                <div className="text-[10px] font-black text-sky-300 uppercase tracking-widest">Room Code</div>
                <div className="text-2xl font-black font-mono tracking-widest text-sky-400">{code}</div>
              </div>
              <button 
                className="p-2 hover:bg-white/10 rounded-xl text-sky-300 transition-colors cursor-pointer" 
                onClick={handleCopyInvite}
              >
                <Share2 size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {contestants.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
            {[...Array(Math.max(0, 8 - contestants.length))].map((_, i) => (
              <div key={i} className="aspect-square rounded-3xl border-2 border-dashed border-sky-500/20 bg-[#04091a]/40 flex items-center justify-center">
                <Users className="text-sky-500/20" size={32} />
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar: Actions & QR */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#070e28] border border-sky-500/30 rounded-3xl p-6 text-center shadow-2xl shadow-sky-950/40 space-y-4">
            <div className="flex items-center gap-2 text-sky-400 mb-2 justify-center">
              <QrCode size={18} />
              <span className="text-xs font-extrabold uppercase tracking-widest">Scan to Join</span>
            </div>
            <div className="mx-auto w-52 h-52 rounded-2xl bg-white border border-sky-400/40 flex items-center justify-center p-3 shadow-lg">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt={`Join room ${code}`} className="w-full h-full object-contain" />
              ) : (
                <div className="text-slate-800 text-sm font-bold">Generating QR...</div>
              )}
            </div>
            <button 
              onClick={handleCopyInvite}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-sky-500/30 text-sky-200 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Copy size={14} />
              <span>Copy Invite Link</span>
            </button>
          </div>

          <div className="bg-[#070e28] border border-sky-500/30 rounded-3xl p-6 flex flex-col items-center text-center shadow-2xl shadow-sky-950/40">
            <div className="w-16 h-16 bg-sky-500/20 border border-sky-400/30 rounded-2xl flex items-center justify-center mb-4 text-sky-300 shadow-inner">
              <Users size={28} />
            </div>
            <h4 className="text-3xl font-black text-white mb-1">{contestants.length}</h4>
            <p className="text-sky-200/70 text-xs font-bold uppercase tracking-wider mb-6">Players Joined</p>

            <button
              onClick={handleStart}
              disabled={contestants.length === 0 || !me?.isHost}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-sky-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Play size={16} fill="currentColor" />
              <span>Start Battle</span>
            </button>
            <p className="text-[10px] text-sky-300/60 font-bold uppercase tracking-widest mt-3">
              {me?.isHost ? 'Only host can start' : 'Waiting for host to start'}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
