import { create } from 'zustand';
import socket from '../services/socket';
import { useGameStore } from '../store/useGameStore';

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
  loginWithGoogle: () => void;
  logoutStudent: () => void;
  setSelectedTab: (tab: StudentState['selectedTab']) => void;
  updateStudentProfile: (updated: Partial<StudentProfile>) => void;

  setUsernameInput: (name: string) => void;
  setSelectedAvatar: (avatar: string) => void;
  setRoomCodeInput: (code: string) => void;

  joinBattleRoom: (code?: string) => boolean;
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

export const useStudentStore = create<StudentState>((set, get) => ({
  currentStudent: {
    id: 'std_101',
    name: 'Anurag Sharma',
    email: 'anurag.student@edupulse.ai',
    avatar: DEFAULT_AVATARS[0],
    school: 'School of Engineering & Tech',
    department: 'Computer Science',
    createdAt: '2026-01-15',
  },
  isStudentAuth: true,
  selectedTab: 'join',
  assessmentHistory: DEFAULT_HISTORY,

  usernameInput: 'Anurag Sharma',
  selectedAvatar: DEFAULT_AVATARS[0],
  roomCodeInput: '',

  loginStudent: (email, name) => {
    const studentName = name || email.split('@')[0] || 'Student User';
    set({
      isStudentAuth: true,
      currentStudent: {
        ...get().currentStudent,
        email,
        name: studentName,
      },
      usernameInput: studentName,
    });
  },

  loginWithGoogle: () => {
    set({
      isStudentAuth: true,
      currentStudent: {
        ...get().currentStudent,
        name: 'Anurag (Google User)',
        email: 'anurag.google@gmail.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GoogleUser',
      },
      usernameInput: 'Anurag (Google User)',
      selectedAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GoogleUser',
    });
  },

  logoutStudent: () => {
    set({ isStudentAuth: false });
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
      id: 'std_' + Math.random().toString(36).substring(2, 9),
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

  addHistoryItem: (item) => {
    set({ assessmentHistory: [item, ...get().assessmentHistory] });
  },
}));
