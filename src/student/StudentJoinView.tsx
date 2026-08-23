import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Zap, Shield, Sparkles, Check, QrCode } from 'lucide-react';
import { useStudentStore } from './studentStore';
import { useNavigate } from 'react-router-dom';

const AVATAR_OPTIONS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Anita',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Mia',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Chris',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Nora',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
];

export const StudentJoinView: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentStudent,
    usernameInput,
    setUsernameInput,
    selectedAvatar,
    setSelectedAvatar,
    roomCodeInput,
    setRoomCodeInput,
    validateAndJoinRoom,
  } = useStudentStore();

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCodeInput.trim()) {
      setErrorMsg('Please enter a valid 6-digit room code.');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);
    const result = await validateAndJoinRoom(roomCodeInput);
    setIsSubmitting(false);
    if (!result.success) {
      setErrorMsg(result.error || 'Invalid Session ID! Please enter a valid room code created by your teacher.');
    }
  };

  return (
    <div className="min-h-[85vh] text-white p-2 sm:p-6 flex flex-col items-center justify-center relative select-none">
      {/* Ambient Lighting Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Join Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-xl bg-[#070e28] border border-sky-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-sky-950/40 space-y-8 relative overflow-hidden"
      >
        {/* Sky Ambient Inner Glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-sky-400/10 rounded-full blur-2xl pointer-events-none" />

        {/* Title Header */}
        <div>
          <h1 className="text-3xl sm:text-5xl font-black italic tracking-tighter uppercase bg-gradient-to-r from-sky-300 via-blue-200 to-white bg-clip-text text-transparent drop-shadow-sm">
            JOIN THE BATTLE
          </h1>
          <p className="text-xs sm:text-sm text-sky-200/70 mt-2 font-medium">
            Scan the QR code or enter the room code to join from any device.
          </p>
        </div>

        <form onSubmit={handleJoinSubmit} className="space-y-6">
          {/* Section 1: Choose Your Identity */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-sky-300/80 block">
                STUDENT BATTLE IDENTITY
              </label>
              <span className="text-[9px] font-black uppercase tracking-wider text-amber-400 bg-amber-950/80 border border-amber-600/50 px-2 py-0.5 rounded-full">
                🔒 Logged In Account
              </span>
            </div>
            <input
              type="text"
              readOnly
              disabled
              value={currentStudent.name || usernameInput || currentStudent.email}
              className="w-full px-5 py-4 rounded-2xl bg-[#04091a] border border-sky-500/30 text-sky-200 font-extrabold text-sm sm:text-base cursor-not-allowed opacity-80 shadow-inner"
            />
            <p className="text-[11px] text-slate-400 font-medium">
              Signed in as <span className="text-sky-300 font-bold">{currentStudent.name || currentStudent.email}</span>. To edit your identity, go to <span className="text-sky-400 font-bold">Student Profile</span>.
            </p>
          </div>

          {/* Section 2: Select Avatar */}
          <div className="space-y-3">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-sky-300/80 block">
              SELECT AVATAR
            </label>

            <div className="grid grid-cols-5 gap-3">
              {AVATAR_OPTIONS.map((avatarUrl, idx) => {
                const isSelected = selectedAvatar === avatarUrl;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedAvatar(avatarUrl)}
                    className={`relative aspect-square rounded-2xl bg-[#04091a] border-2 p-1 transition-all flex items-center justify-center overflow-hidden cursor-pointer ${
                      isSelected
                        ? 'border-sky-400 ring-4 ring-sky-400/30 scale-105 bg-sky-950/50'
                        : 'border-slate-800/80 hover:border-sky-500/40 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={avatarUrl}
                      alt={`Avatar ${idx}`}
                      className="w-full h-full object-cover rounded-xl"
                      referrerPolicy="no-referrer"
                    />
                    {isSelected && (
                      <div className="absolute top-1 right-1 bg-sky-500 p-0.5 rounded-full shadow-md">
                        <Check size={10} className="text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Room Code Input */}
          <div className="space-y-2 pt-2">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-sky-300/80 block">
              ENTER ROOM CODE
            </label>
            <input
              type="text"
              required
              maxLength={6}
              value={roomCodeInput}
              onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
              placeholder="e.g. KIV354"
              className="w-full px-5 py-4 rounded-2xl bg-[#04091a] border border-sky-500/40 text-sky-300 font-mono font-black text-center text-xl sm:text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder:text-slate-700 shadow-inner uppercase"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs font-bold text-center">
              {errorMsg}
            </div>
          )}

          {/* Action Button */}
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer group"
          >
            <Zap size={18} fill="currentColor" className="group-hover:scale-110 transition-transform" />
            <span>ENTER GAME LOBBY</span>
          </button>
        </form>
      </motion.div>
    </div>
  );
};
