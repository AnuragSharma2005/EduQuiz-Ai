import { create } from 'zustand';
import socket from '../services/socket';
import { useGameStore } from '../store/useGameStore';
import { getApiBase } from '../services/config';

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  school?: string;
  department?: string;
  createdAt: string;
}

export interface StudentAssessmentHistoryItem {
  id: string;
  roomCode: string;
  assessmentTitle: string;
  date: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  rank: number;
  totalParticipants: number;
}

interface StudentState {
  currentStudent: StudentProfile;
  isStudentAuth: boolean;
  selectedTab: 'join' | 'lobby' | 'quiz' | 'results' | 'profile';
  assessmentHistory: StudentAssessmentHistoryItem[];

  // Active Form State
  usernameInput: string;
  selectedAvatar: string;
  roomCodeInput: string;

  // Actions
  loginStudent: (email: string, name?: string) => void;
  loginStudentApi: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signupStudentApi: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => void;
  logoutStudent: () => void;
  setSelectedTab: (tab: StudentState['selectedTab']) => void;
  updateStudentProfile: (updated: Partial<StudentProfile>) => void;

  setUsernameInput: (name: string) => void;
  setSelectedAvatar: (avatar: string) => void;
  setRoomCodeInput: (code: string) => void;

  joinBattleRoom: (code?: string) => boolean;
  validateAndJoinRoom: (code?: string) => Promise<{ success: boolean; error?: string }>;
  addHistoryItem: (item: StudentAssessmentHistoryItem) => void;
}

const DEFAULT_AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Anita',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Mia',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Chris',
];

const DEFAULT_HISTORY: StudentAssessmentHistoryItem[] = [
  {
    id: 'hist_1',
    roomCode: 'KIV354',
    assessmentTitle: 'Computer Science 101 Midterm Quiz',
    date: '21/08/2026',
    score: 3950,
    totalQuestions: 4,
    correctAnswers: 4,
    rank: 1,
    totalParticipants: 5,
  },
  {
    id: 'hist_2',
    roomCode: 'SJTDUR',
    assessmentTitle: 'Data Structures & Algorithms Sprint',
    date: '19/08/2026',
    score: 2800,
    totalQuestions: 5,
    correctAnswers: 3,
    rank: 2,
    totalParticipants: 8,
  },
  {
    id: 'hist_3',
    roomCode: 'NU64HM',
    assessmentTitle: 'Web Architecture & Protocols',
    date: '15/08/2026',
    score: 1950,
    totalQuestions: 4,
    correctAnswers: 2,
    rank: 3,
    totalParticipants: 6,
  },
];

const getInitialStudentHistory = (studentId?: string): StudentAssessmentHistoryItem[] => {
  try {
    if (studentId && typeof window !== 'undefined') {
      const saved = localStorage.getItem(`student_history_${studentId}`);
      if (saved) {
        return JSON.parse(saved);
      }
    }
  } catch (e) {}
  return []; // Empty by default for new accounts!
};

const getInitialStudentUser = (): StudentProfile | null => {
  try {
    const savedToken = localStorage.getItem('student_token');
    const savedUser = localStorage.getItem('student_user');
    if (savedToken && savedUser) {
      if (savedToken.startsWith('temp_') || savedToken.startsWith('mock_')) {
        localStorage.removeItem('student_token');
        localStorage.removeItem('student_user');
        return null;
      }
      return JSON.parse(savedUser);
    }
  } catch (e) {}
  return null;
};

const getInitialStudentAuth = (): boolean => {
  const token = localStorage.getItem('student_token');
  const user = localStorage.getItem('student_user');
  if (!token || !user) return false;
  if (token.startsWith('temp_') || token.startsWith('mock_')) {
    localStorage.removeItem('student_token');
    localStorage.removeItem('student_user');
    return false;
  }
  return true;
};

const initialUser = getInitialStudentUser();

export const useStudentStore = create<StudentState>((set, get) => ({
  currentStudent: initialUser || {
    id: '',
    name: '',
    email: '',
    avatar: DEFAULT_AVATARS[0],
    school: 'School of Engineering & Tech',
    department: 'Computer Science',
    createdAt: new Date().toISOString(),
  },
  isStudentAuth: getInitialStudentAuth(),
  selectedTab: 'join',
  assessmentHistory: initialUser?.id ? getInitialStudentHistory(initialUser.id) : [],

  usernameInput: initialUser?.name || '',
  selectedAvatar: initialUser?.avatar || DEFAULT_AVATARS[0],
  roomCodeInput: '',

  loginStudent: (email, name) => {
    // Deprecated mock login replaced with strict login call requirement
    console.warn('Direct mock login bypass is disabled. Use loginStudentApi or signupStudentApi.');
  },

  loginStudentApi: async (email, password) => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const res = await fetch(`${getApiBase()}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.user || !data.token) {
        return {
          success: false,
          error: data.error || 'Invalid email or password. If you do not have an account, please register/sign up first!',
        };
      }

      const studentUser: StudentProfile = {
        id: data.user._id || data.user.id || 'std_' + Date.now(),
        name: data.user.fullName || data.user.username || cleanEmail.split('@')[0],
        email: data.user.email,
        avatar: data.user.avatar || DEFAULT_AVATARS[0],
        department: data.user.department || 'Computer Science',
        createdAt: data.user.createdAt || new Date().toISOString(),
      };

      const userHistory = getInitialStudentHistory(studentUser.id);

      localStorage.setItem('student_token', data.token);
      localStorage.setItem('student_user', JSON.stringify(studentUser));

      set({
        isStudentAuth: true,
        currentStudent: studentUser,
        usernameInput: studentUser.name,
        assessmentHistory: userHistory,
      });

      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: 'Unable to connect to database server. Please try again.',
      };
    }
  },

  signupStudentApi: async (name, email, password) => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanName = name.trim();
      const username = cleanName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() + '_' + Math.floor(Math.random() * 1000);

      const res = await fetch(`${getApiBase()}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email: cleanEmail,
          password,
          fullName: cleanName,
          role: 'player',
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.user || !data.token) {
        return {
          success: false,
          error: data.error || 'Failed to create student account in MongoDB.',
        };
      }

      const studentUser: StudentProfile = {
        id: data.user._id || data.user.id || 'std_' + Date.now(),
        name: data.user.fullName || cleanName,
        email: data.user.email,
        avatar: data.user.avatar || DEFAULT_AVATARS[0],
        department: 'Computer Science',
        createdAt: data.user.createdAt || new Date().toISOString(),
      };

      localStorage.setItem('student_token', data.token);
      localStorage.setItem('student_user', JSON.stringify(studentUser));
      localStorage.setItem(`student_history_${studentUser.id}`, JSON.stringify([]));

      set({
        isStudentAuth: true,
        currentStudent: studentUser,
        usernameInput: studentUser.name,
        assessmentHistory: [], // Completely empty for new registered account!
      });

      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: 'Unable to connect to database server. Please try again.',
      };
    }
  },

  loginWithGoogle: () => {
    console.warn('Google login mock bypass disabled.');
  },

  logoutStudent: () => {
    localStorage.removeItem('student_token');
    localStorage.removeItem('student_user');
    set({
      isStudentAuth: false,
      currentStudent: {
        id: '',
        name: '',
        email: '',
        avatar: DEFAULT_AVATARS[0],
        school: 'School of Engineering & Tech',
        department: 'Computer Science',
        createdAt: new Date().toISOString(),
      },
      usernameInput: '',
      assessmentHistory: [],
    });
  },

  setSelectedTab: (tab) => set({ selectedTab: tab }),

  updateStudentProfile: (updated) => {
    set({
      currentStudent: {
        ...get().currentStudent,
        ...updated,
      },
    });
  },

  setUsernameInput: (usernameInput) => set({ usernameInput }),
  setSelectedAvatar: (selectedAvatar) => set({ selectedAvatar }),
  setRoomCodeInput: (roomCodeInput) => set({ roomCodeInput }),

  joinBattleRoom: (code) => {
    const targetCode = (code || get().roomCodeInput).trim().toUpperCase();
    if (!targetCode) return false;

    const student = get().currentStudent;
    const name = get().usernameInput.trim() || student.name;
    const avatar = get().selectedAvatar || student.avatar;

    const studentPlayer = {
      id: student.id || (student as any)._id || socket.id || 'std_' + (student.email || name).replace(/[^a-z0-9]/gi, '').toLowerCase(),
      username: name,
      avatar,
      score: 0,
      isReady: true,
      isHost: false,
    };

    useGameStore.getState().setMe(studentPlayer);
    useGameStore.getState().setRoomCode(targetCode);

    socket.emit('join_room', {
      roomCode: targetCode,
      player: studentPlayer,
    });

    set({ selectedTab: 'lobby' });
    return true;
  },

  validateAndJoinRoom: async (code) => {
    const targetCode = (code || get().roomCodeInput).trim().toUpperCase();
    if (!targetCode) {
      return { success: false, error: 'Please enter a 6-digit room code!' };
    }

    try {
      const res = await fetch(`${getApiBase()}/sessions/validate/${encodeURIComponent(targetCode)}`);
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.valid || !data.active) {
        return {
          success: false,
          error: data.message || `Invalid Session ID "${targetCode}"! No active session found. Please ask your teacher for a valid room code.`,
        };
      }

      get().joinBattleRoom(targetCode);
      return { success: true };
    } catch (e) {
      return {
        success: false,
        error: 'Unable to connect to server to validate session code. Please try again.',
      };
    }
  },

  addHistoryItem: (item) => {
    const student = get().currentStudent;
    const currentHistory = get().assessmentHistory;
    if (currentHistory.some((h) => h.id === item.id || (h.roomCode === item.roomCode && h.date === item.date))) {
      return;
    }
    const updatedHistory = [item, ...currentHistory];
    if (student && student.id) {
      try {
        localStorage.setItem(`student_history_${student.id}`, JSON.stringify(updatedHistory));
      } catch (e) {}
    }
    set({ assessmentHistory: updatedHistory });
  },
}));
