import { create } from 'zustand';

export type Player = {
  id: string;
  username: string;
  avatar: string;
  score: number;
  isReady: boolean;
  isHost: boolean;
  lastAnswerCorrect?: boolean;
  rank?: number;
  correctAnswers?: number;
  totalAttempted?: number;
  answers?: {
    questionIndex: number;
    selectedAnswer: number;
    correctAnswer: number;
    isCorrect: boolean;
    timeSpent: number;
    points: number;
  }[];
};

export type Question = {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  timeLimit: number;
};

export type Quiz = {
  _id?: string;
  id: string;
  title: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questions: Question[];
};

export type GameStatus = 'idle' | 'lobby' | 'starting' | 'question' | 'leaderboard' | 'finished';

export type ChatMessage = {
  id: string;
  sender: string;
  role: 'student' | 'teacher';
  text: string;
  timestamp: string;
  timeMs: number;
};

interface GameState {
  // User State
  me: Player | null;
  setMe: (player: Player) => void;

  // Room State
  roomCode: string | null;
  players: Player[];
  status: GameStatus;
  currentQuiz: Quiz | null;
  currentQuestionIndex: number;
  timer: number;
  questionStartTime?: number;
  questionAnsweredPlayerIds: string[];

  // Live Chat State
  chatMessages: ChatMessage[];
  isChatOpen: boolean;
  unreadChatCount: number;
  
  // Actions
  setRoomCode: (code: string | null) => void;
  setPlayers: (players: Player[]) => void;
  setStatus: (status: GameStatus) => void;
  setCurrentQuiz: (quiz: Quiz | null) => void;
  setCurrentQuestionIndex: (index: number) => void;
  setTimer: (time: number) => void;
  setQuestionAnsweredPlayerIds: (playerIds: string[]) => void;
  addPlayer: (player: Player) => void;
  removePlayer: (playerId: string) => void;
  updatePlayerReady: (playerId: string, isReady: boolean) => void;
  updatePlayerScore: (playerId: string, score: number, correct: boolean) => void;
  toggleChat: (open?: boolean) => void;
  addChatMessage: (msg: ChatMessage) => void;
  setChatMessages: (msgs: ChatMessage[]) => void;
  syncWithRoom: (roomData: any) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  me: null,
  setMe: (player) => set({ me: player }),

  roomCode: null,
  players: [],
  status: 'idle',
  currentQuiz: null,
  currentQuestionIndex: 0,
  timer: 0,
  questionAnsweredPlayerIds: [],

  chatMessages: [],
  isChatOpen: false,
  unreadChatCount: 0,

  setRoomCode: (code) => set({ roomCode: code }),
  setPlayers: (players) =>
    set(() => {
      const map = new Map<string, Player>();
      (players || []).forEach((p) => {
        const key = (p.id || p.username || '').toLowerCase();
        if (key) map.set(key, p);
      });
      return { players: Array.from(map.values()) };
    }),
  setStatus: (status) => set({ status }),
  setCurrentQuiz: (quiz) => set({ currentQuiz: quiz }),
  setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
  setTimer: (time) => set({ timer: time }),
  setQuestionAnsweredPlayerIds: (playerIds) => set({ questionAnsweredPlayerIds: playerIds }),
  
  addPlayer: (player) =>
    set((state) => {
      const pKey = (player.id || player.username || '').toLowerCase();
      const existingIdx = state.players.findIndex(
        (p) => (p.id && p.id === player.id) || (p.username && p.username.toLowerCase() === (player.username || '').toLowerCase())
      );
      if (existingIdx !== -1) {
        const updated = [...state.players];
        updated[existingIdx] = { ...updated[existingIdx], ...player };
        return { players: updated };
      }
      return { players: [...state.players, player] };
    }),
  removePlayer: (playerId) => set((state) => ({ 
    players: state.players.filter(p => p.id !== playerId) 
  })),
  updatePlayerReady: (playerId, isReady) => set((state) => ({
    players: state.players.map(p => p.id === playerId ? { ...p, isReady } : p)
  })),
  updatePlayerScore: (playerId, score, correct) => set((state) => ({
    players: state.players.map(p => p.id === playerId ? { ...p, score: p.score + score, lastAnswerCorrect: correct } : p)
  })),
  toggleChat: (open) =>
    set((state) => {
      const nextOpen = open !== undefined ? open : !state.isChatOpen;
      return {
        isChatOpen: nextOpen,
        unreadChatCount: nextOpen ? 0 : state.unreadChatCount,
      };
    }),
  addChatMessage: (msg) =>
    set((state) => {
      const exists = state.chatMessages.some((m) => m.id === msg.id);
      if (exists) return state;
      return {
        chatMessages: [...state.chatMessages, msg],
        unreadChatCount: state.isChatOpen ? 0 : state.unreadChatCount + 1,
      };
    }),
  setChatMessages: (msgs) => set({ chatMessages: msgs }),
  syncWithRoom: (roomData) =>
    set((state) => {
      const map = new Map<string, Player>();
      if (Array.isArray(roomData.players)) {
        roomData.players.forEach((p: Player) => {
          const key = (p.id || p.username || '').toLowerCase();
          if (key) map.set(key, p);
        });
      }
      const roomMsgs = Array.isArray(roomData.messages) ? roomData.messages : state.chatMessages;
      return {
        players: Array.from(map.values()),
        status: roomData.status,
        currentQuiz: roomData.currentQuiz,
        currentQuestionIndex: roomData.currentQuestionIndex,
        questionStartTime: roomData.questionStartTime,
        questionAnsweredPlayerIds: roomData.questionAnsweredPlayerIds || [],
        chatMessages: roomMsgs,
      };
    }),
  resetGame: () => set({
    roomCode: null,
    players: [],
    status: 'idle',
    currentQuiz: null,
    currentQuestionIndex: 0,
    timer: 0,
    questionAnsweredPlayerIds: [],
    chatMessages: [],
    isChatOpen: false,
    unreadChatCount: 0,
  }),
}));
