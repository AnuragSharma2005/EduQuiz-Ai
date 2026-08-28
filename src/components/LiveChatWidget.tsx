import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  AlertCircle,
  HelpCircle,
  Clock,
  Hand,
  CheckCircle2,
  Minimize2,
  ChevronDown
} from 'lucide-react';
import { useGameStore, ChatMessage } from '../store/useGameStore';
import socket from '../services/socket';
import { cn } from '../utils/constants';

// Preset quick message options as requested
const PRESET_CHAT_OPTIONS = [
  {
    id: 'opt_1',
    label: "❌ I can't select the answer option",
    text: "I am having trouble selecting/ticking the answer option on my device.",
    icon: AlertCircle,
    color: 'bg-rose-500/15 border-rose-500/30 text-rose-300 hover:bg-rose-500/25',
  },
  {
    id: 'opt_2',
    label: '👁️ Question / options not visible',
    text: 'The question or options are not properly visible on my screen.',
    icon: HelpCircle,
    color: 'bg-amber-500/15 border-amber-500/30 text-amber-300 hover:bg-amber-500/25',
  },
  {
    id: 'opt_3',
    label: '⏱️ Timer is moving too fast',
    text: 'The question timer is running out too fast! Please allow extra time.',
    icon: Clock,
    color: 'bg-purple-500/15 border-purple-500/30 text-purple-300 hover:bg-purple-500/25',
  },
  {
    id: 'opt_4',
    label: '✋ Please wait a moment',
    text: 'Please wait a moment before proceeding to the next question!',
    icon: Hand,
    color: 'bg-sky-500/15 border-sky-500/30 text-sky-300 hover:bg-sky-500/25',
  },
  {
    id: 'opt_5',
    label: '✅ Fixed / All working now',
    text: 'My issue is resolved, thank you!',
    icon: CheckCircle2,
    color: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25',
  },
];

interface LiveChatWidgetProps {
  roomCode?: string | null;
  currentUser?: string;
  role?: 'student' | 'teacher';
}

export const LiveChatWidget: React.FC<LiveChatWidgetProps> = ({
  roomCode: propRoomCode,
  currentUser: propCurrentUser,
  role: propRole,
}) => {
  const {
    roomCode: storeRoomCode,
    me,
    chatMessages,
    isChatOpen,
    unreadChatCount,
    toggleChat,
    addChatMessage,
  } = useGameStore();

  const activeRoomCode = propRoomCode || storeRoomCode;
  const activeSender = propCurrentUser || me?.username || (propRole === 'teacher' ? 'Teacher' : 'Student');
  const activeRole = propRole || (me?.isHost ? 'teacher' : 'student');

  const [inputMessage, setInputMessage] = useState('');
  const [showPresets, setShowPresets] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Listen to incoming socket chat messages
  useEffect(() => {
    const handleIncomingMessage = (msg: ChatMessage) => {
      addChatMessage(msg);
    };

    socket.on('chat_message_received', handleIncomingMessage);
    return () => {
      socket.off('chat_message_received', handleIncomingMessage);
    };
  }, [addChatMessage]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatOpen]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || !activeRoomCode) return;

    socket.emit('send_chat_message', {
      roomCode: activeRoomCode,
      sender: activeSender,
      role: activeRole,
      text,
    });

    if (!textToSend) {
      setInputMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // If no room is active, do not render chat button
  if (!activeRoomCode) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] font-sans select-none">
      <AnimatePresence>
        {isChatOpen ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-[92vw] sm:w-[380px] h-[520px] bg-[#070e24]/95 border border-sky-500/30 rounded-3xl shadow-2xl shadow-sky-950/80 backdrop-blur-2xl flex flex-col overflow-hidden text-white border-t border-sky-400/40"
          >
            {/* Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-sky-950/90 via-indigo-950/80 to-purple-950/90 border-b border-sky-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-sky-300">
                    <MessageSquare size={18} />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#070e24] animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-white tracking-tight">Live Session Chat</h3>
                    <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-mono text-[10px] border border-sky-500/30">
                      #{activeRoomCode}
                    </span>
                  </div>
                  <p className="text-[11px] text-sky-300/60 font-medium">Real-time classroom assistance</p>
                </div>
              </div>

              <button
                onClick={() => toggleChat(false)}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/10"
              >
                <X size={16} />
              </button>
            </div>

            {/* Quick Preset Options Toggle Banner */}
            <div className="px-4 py-2 bg-indigo-950/40 border-b border-indigo-500/20 flex items-center justify-between text-xs">
              <span className="text-[11px] text-indigo-200/80 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={13} className="text-amber-400" />
                <span>Quick Preset Options</span>
              </span>
              <button
                onClick={() => setShowPresets(!showPresets)}
                className="text-[11px] text-sky-300 hover:text-sky-200 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>{showPresets ? 'Hide' : 'Show Options'}</span>
                <ChevronDown size={12} className={cn("transition-transform", showPresets && "rotate-180")} />
              </button>
            </div>

            {/* Quick Preset Chips */}
            <AnimatePresence>
              {showPresets && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-4 py-3 bg-[#05091a]/90 border-b border-sky-500/15 overflow-x-auto space-y-1.5 scrollbar-thin scrollbar-thumb-sky-500/20"
                >
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                    Tap a common issue to notify host instantly:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_CHAT_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => handleSendMessage(opt.text)}
                        className={cn(
                          'px-2.5 py-1.5 rounded-xl border text-[11px] font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95',
                          opt.color
                        )}
                      >
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chat Messages Stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-indigo-500/20">
              {chatMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2 opacity-60">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-400/20 flex items-center justify-center text-indigo-300">
                    <MessageSquare size={24} />
                  </div>
                  <p className="text-xs font-bold text-slate-300">No messages in room #{activeRoomCode} yet</p>
                  <p className="text-[11px] text-slate-400 max-w-xs">
                    Select a quick option above or type a custom message to chat with your teacher and classmates!
                  </p>
                </div>
              ) : (
                chatMessages.map((msg) => {
                  const isMe = msg.sender?.toLowerCase() === activeSender?.toLowerCase();
                  const isTeacherMsg = msg.role === 'teacher';

                  return (
                    <div
                      key={msg.id}
                      className={cn('flex flex-col max-w-[85%]', isMe ? 'ml-auto items-end' : 'mr-auto items-start')}
                    >
                      {/* Sender Info Bar */}
                      <div className="flex items-center gap-1.5 mb-1 px-1">
                        <span
                          className={cn(
                            'text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md border',
                            isTeacherMsg
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              : 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                          )}
                        >
                          {isTeacherMsg ? '👑 TEACHER' : '🎓 STUDENT'}
                        </span>
                        <span className="text-[11px] font-bold text-slate-300 truncate max-w-[120px]">
                          {msg.sender}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">{msg.timestamp}</span>
                      </div>

                      {/* Message Bubble */}
                      <div
                        className={cn(
                          'p-3 rounded-2xl text-xs font-medium leading-relaxed border shadow-md',
                          isMe
                            ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white border-indigo-400/40 rounded-tr-none'
                            : isTeacherMsg
                            ? 'bg-gradient-to-r from-amber-950/80 via-indigo-950/80 to-purple-950/80 border-amber-500/40 text-amber-100 rounded-tl-none'
                            : 'bg-sky-950/70 border-sky-500/30 text-sky-100 rounded-tl-none'
                        )}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Custom Input Bar */}
            <div className="p-3 bg-[#040817] border-t border-sky-500/20 flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type a message or issue..."
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-400/60 focus:ring-1 focus:ring-sky-400/40 transition-all"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim()}
                className={cn(
                  'w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer border shadow-lg',
                  inputMessage.trim()
                    ? 'bg-gradient-to-r from-indigo-500 to-sky-500 text-white border-sky-400/50 hover:scale-105 active:scale-95 shadow-sky-500/20'
                    : 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed'
                )}
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleChat(true)}
            className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-indigo-600 via-sky-600 to-indigo-700 text-white font-extrabold text-xs shadow-2xl shadow-sky-600/40 border border-sky-400/40 hover:border-sky-300 transition-all cursor-pointer backdrop-blur-xl"
          >
            <div className="relative">
              <MessageSquare size={18} className="text-white group-hover:rotate-12 transition-transform" />
              {unreadChatCount > 0 && (
                <span className="absolute -top-2 -right-2.5 bg-rose-500 text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#070e24] shadow-lg animate-bounce">
                  {unreadChatCount > 9 ? '9+' : unreadChatCount}
                </span>
              )}
            </div>
            <span className="tracking-wide">Live Chat</span>
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-mono text-sky-200">
              #{activeRoomCode}
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
