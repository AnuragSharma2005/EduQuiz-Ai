import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Hash } from 'lucide-react';
import { Button, Input, Card } from '../components/UI';
import { AvatarPicker } from '../components/AvatarPicker';
import { useGameStore } from '../store/useGameStore';
import { useStudentStore } from '../student/studentStore';
import { StudentLoginModal } from '../student/StudentLoginModal';
import { AVATARS } from '../utils/constants';
import socket from '../services/socket';
import { getApiBase } from '../services/config';

export const JoinPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setMe, setRoomCode } = useGameStore();
  const { isStudentAuth, currentStudent, setRoomCodeInput } = useStudentStore();
  
  const [username, setUsername] = useState(currentStudent?.name || '');
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [code, setCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const inviteCode = params.get('code');

    if (inviteCode) {
      const cleanCode = inviteCode.toUpperCase();
      setCode(cleanCode);
      setRoomCodeInput(cleanCode);
    }
  }, [location.search, setRoomCodeInput]);

  useEffect(() => {
    if (currentStudent?.name) {
      setUsername(currentStudent.name);
    }
  }, [currentStudent]);

  const handleJoin = async () => {
    const activeName = currentStudent?.name || username || currentStudent?.email || 'Student Player';
    if (!activeName.trim() || !code.trim()) return;
    
    const cleanCode = code.trim().toUpperCase();
    setErrorMsg('');

    try {
      const res = await fetch(`${getApiBase()}/sessions/validate/${encodeURIComponent(cleanCode)}`);
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.valid || !data.active) {
        const msg = data.message || `Invalid Session ID "${cleanCode}"! Please enter a valid room code provided by your teacher.`;
        setErrorMsg(msg);
        alert(`❌ Invalid Session ID: "${cleanCode}"\n\nNo active teacher session found for this room code. Please ask your teacher for a valid room code.`);
        return;
      }
    } catch (e) {
      setErrorMsg('Unable to connect to server for session validation.');
      alert('⚠️ Server connection error. Please check your network connection.');
      return;
    }

    const newPlayer = {
      id: currentStudent?.id || Math.random().toString(36).substr(2, 9),
      username: activeName.trim(),
      email: currentStudent?.email || '',
      avatar,
      score: 0,
      isReady: false,
      isHost: false,
    };
    
    setMe(newPlayer);
    setRoomCode(cleanCode);
    
    socket.emit('join_room', { roomCode: cleanCode, player: newPlayer });
    
    navigate(`/lobby/${cleanCode}`);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 flex items-center justify-center relative">
      {!isStudentAuth && <StudentLoginModal />}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-2xl"
      >
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/40 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </button>

        <Card className="p-10">
          <h2 className="text-4xl font-black italic mb-8 uppercase tracking-tighter">Join the Battle</h2>
          <p className="text-white/40 mb-8">Scan the QR code or enter the room code to join from any device.</p>
          
          <div className="space-y-8">
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-xs font-bold text-sky-300 uppercase tracking-widest">Student Battle Identity</label>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-950/80 border border-amber-600/50 px-2.5 py-0.5 rounded-full">
                  🔒 Logged In Account
                </span>
              </div>
              <Input
                disabled
                value={currentStudent.name || username || currentStudent.email || 'Student'}
                className="text-xl font-bold py-4 bg-slate-900/80 text-sky-200 cursor-not-allowed opacity-80"
              />
              <p className="text-[11px] text-slate-400 mt-2 font-medium">
                Signed in as <span className="text-sky-300 font-bold">{currentStudent.name || currentStudent.email}</span>. To edit your identity, update your <span className="text-sky-400 font-bold">Student Profile</span>.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Select Avatar</label>
              <AvatarPicker selected={avatar} onSelect={setAvatar} />
            </div>

            <div>
              <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Room Code</label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                <Input
                  placeholder="000 000"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="pl-12 text-2xl font-black tracking-[0.5em]"
                  maxLength={6}
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs font-bold text-center">
                {errorMsg}
              </div>
            )}

            <Button
              size="xl"
              className="w-full"
              disabled={!username || !code}
              onClick={handleJoin}
            >
              <Play fill="currentColor" />
              Enter Arena
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
