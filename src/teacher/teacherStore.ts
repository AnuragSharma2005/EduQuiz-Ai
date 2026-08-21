import { create } from 'zustand';
import socket from '../services/socket';
import { useGameStore } from '../store/useGameStore';

export interface QuestionItem {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  timeLimit: number;
}

export interface TeacherAssessment {
  id: string;
  title: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timePerQuestion: number;
  questions: QuestionItem[];
  createdAt: string;
  enrolledStudentsCount: number;
  avgScore: number;
}

export interface ConnectedStudent {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  status: 'WAITING' | 'READY' | 'SUBMITTED';
  score: number;
  lastAnswerCorrect?: boolean;
}

export interface LiveSessionState {
  roomCode: string;
  assessment: TeacherAssessment;
  status: 'lobby' | 'live' | 'finished';
  currentQuestionIndex: number;
  timer: number;
  students: ConnectedStudent[];
}

export interface SessionHistoryItem {
  id: string;
  assessmentTitle: string;
  category: string;
  roomCode: string;
  date: string;
  totalStudents: number;
  avgScore: number;
  rankings: { rank: number; name: string; score: number; correctCount: number }[];
}

export interface RegisteredStudent {
  id: string;
  name: string;
  email: string;
  department: string;
  status: 'ACTIVE' | 'BLOCKED';
  quizzesTaken: number;
  avgAccuracy: number;
}

export interface TeacherProfile {
  id: string;
  name: string;
  email: string;
  department: string;
  title: string;
  bio: string;
  phone: string;
}

interface TeacherState {
  currentTeacher: TeacherProfile;
  isTeacherAuth: boolean;
  assessments: TeacherAssessment[];
  activeSession: LiveSessionState | null;
  sessionHistory: SessionHistoryItem[];
  registeredStudents: RegisteredStudent[];
  editingAssessment: TeacherAssessment | null;
  selectedTab: 'dashboard' | 'questions' | 'create' | 'lobby' | 'live' | 'projector' | 'results' | 'classrooms' | 'leaderboard' | 'profile' | 'settings';
  isSidebarOpen: boolean;

  // Actions
  loginTeacher: (email: string, password: string) => boolean;
  logoutTeacher: () => void;
  setSelectedTab: (tab: TeacherState['selectedTab']) => void;
  toggleSidebar: () => void;
  updateTeacherProfile: (updated: Partial<TeacherProfile>) => void;
  
  // Assessment CRUD
  createAssessment: (newAssessment: Omit<TeacherAssessment, 'id' | 'createdAt' | 'enrolledStudentsCount' | 'avgScore'>) => TeacherAssessment;
  updateAssessment: (id: string, updated: Partial<TeacherAssessment>) => void;
  deleteAssessment: (id: string) => void;
  setEditingAssessment: (assessment: TeacherAssessment | null) => void;

  // Live Session Lifecycle
  startLiveSession: (assessmentId: string) => LiveSessionState;
  startGame: () => void;
  tickTimer: () => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  showLeaderboard: () => void;
  endLiveSession: () => void;
  clearActiveSession: () => void;
  simulateJoinStudent: () => void;
  addStudentToLobby: (student: ConnectedStudent) => void;

  // Student Management CRUD
  addRegisteredStudent: (student: Omit<RegisteredStudent, 'id' | 'quizzesTaken' | 'avgAccuracy'>) => void;
  updateRegisteredStudent: (id: string, updated: Partial<RegisteredStudent>) => void;
  deleteRegisteredStudent: (id: string) => void;
  toggleBlockStudent: (studentId: string) => void;
}

const DEFAULT_TEACHER_ASSESSMENTS: TeacherAssessment[] = [
  {
    id: 'cs101_midterm',
    title: 'Computer Science 101 Midterm Quiz',
    category: 'COMPUTER SCIENCE',
    difficulty: 'Medium',
    timePerQuestion: 20,
    enrolledStudentsCount: 42,
    avgScore: 86.5,
    createdAt: '21/08/2026',
    questions: [
      {
        id: 'q1',
        text: 'What is the time complexity of Binary Search in a sorted array of size N?',
        options: ['O(N)', 'O(log N)', 'O(N²)', 'O(1)'],
        correctAnswer: 1,
        timeLimit: 20,
      },
      {
        id: 'q2',
        text: 'Which data structure follows LIFO (Last In First Out)?',
        options: ['Queue', 'LinkedList', 'Stack', 'Tree'],
        correctAnswer: 2,
        timeLimit: 20,
      },
      {
        id: 'q3',
        text: 'What is the worst-case time complexity of QuickSort?',
        options: ['O(n log n)', 'O(n²)', 'O(n)', 'O(log n)'],
        correctAnswer: 1,
        timeLimit: 20,
      },
      {
        id: 'q4',
        text: 'Which memory section stores dynamically allocated memory in C/C++?',
        options: ['Stack', 'Heap', 'Code Segment', 'Data Segment'],
        correctAnswer: 1,
        timeLimit: 20,
      },
    ],
  },
  {
    id: 'math201_final',
    title: 'Calculus & Algebra Final Exam',
    category: 'MATHEMATICS 201',
    difficulty: 'Hard',
    timePerQuestion: 30,
    enrolledStudentsCount: 38,
    avgScore: 82.0,
    createdAt: '20/08/2026',
    questions: [
      {
        id: 'mq1',
        text: 'What is the derivative of f(x) = sin(x)?',
        options: ['cos(x)', '-cos(x)', 'tan(x)', '-sin(x)'],
        correctAnswer: 0,
        timeLimit: 30,
      },
      {
        id: 'mq2',
        text: 'What is the determinant of a 2x2 identity matrix?',
        options: ['0', '1', '2', '-1'],
        correctAnswer: 1,
        timeLimit: 30,
      },
    ],
  },
];

const DEFAULT_SESSION_HISTORY: SessionHistoryItem[] = [
  {
    id: 'hist_1',
    assessmentTitle: 'Computer Science 101 Midterm Quiz',
    category: 'COMPUTER SCIENCE',
    roomCode: '5X3YMA',
    date: '21/08/2026',
    totalStudents: 5,
    avgScore: 85.4,
    rankings: [
      { rank: 1, name: 'Anurag', score: 920, correctCount: 4 },
      { rank: 2, name: 'Alice Johnson', score: 880, correctCount: 4 },
      { rank: 3, name: 'Bob Smith', score: 840, correctCount: 3 },
      { rank: 4, name: 'Charlie Brown', score: 790, correctCount: 3 },
      { rank: 5, name: 'David Miller', score: 750, correctCount: 2 },
    ],
  },
];

const INITIAL_TEACHER_PROFILE: TeacherProfile = JSON.parse(sessionStorage.getItem('teacher_data') || 'null') || {
  id: '1b6ab4ac',
  name: 'Dr. Sarah Jenkins',
  email: 'teacher@edupulse.ai',
  department: 'Computer Science',
  title: 'Senior Associate Professor',
  bio: 'Passionate about AI algorithms, interactive classroom learning, and real-time student gamification.',
  phone: '+1 (555) 234-5678',
};

export const useTeacherStore = create<TeacherState>((set, get) => ({
  currentTeacher: INITIAL_TEACHER_PROFILE,
  isTeacherAuth: sessionStorage.getItem('isTeacherAuth') === 'true',
  assessments: DEFAULT_TEACHER_ASSESSMENTS,
  activeSession: null,
  sessionHistory: DEFAULT_SESSION_HISTORY,
  registeredStudents: [], // Starts 0 initial state
  editingAssessment: null,
  selectedTab: 'dashboard',
  isSidebarOpen: false,

  loginTeacher: (email, password) => {
    const validEmails = ['teacher@edupulse.ai', 'anurag@gmail.com', 'robert@university.edu'];
    if ((validEmails.includes(email.toLowerCase()) || email.includes('@')) && (password === 'teacher123' || password.length >= 4)) {
      const teacherObj: TeacherProfile = {
        id: email.split('@')[0] + '_id',
        name: email.startsWith('anurag') ? 'Anurag' : 'Dr. Sarah Jenkins',
        email: email,
        department: 'Computer Science',
        title: 'Senior Associate Professor',
        bio: 'Passionate about AI algorithms, interactive classroom learning, and real-time student gamification.',
        phone: '+1 (555) 234-5678',
      };
      sessionStorage.setItem('isTeacherAuth', 'true');
      sessionStorage.setItem('teacher_data', JSON.stringify(teacherObj));
      set({ currentTeacher: teacherObj, isTeacherAuth: true, selectedTab: 'dashboard' });
      return true;
    }
    return false;
  },

  logoutTeacher: () => {
    sessionStorage.removeItem('isTeacherAuth');
    sessionStorage.removeItem('teacher_data');
    set({ isTeacherAuth: false, activeSession: null });
  },

  setSelectedTab: (tab) => set({ selectedTab: tab, isSidebarOpen: false }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  updateTeacherProfile: (updatedFields) => {
    const updated = { ...get().currentTeacher, ...updatedFields };
    sessionStorage.setItem('teacher_data', JSON.stringify(updated));
    set({ currentTeacher: updated });
  },

  // Assessment Operations
  createAssessment: (newAssessment) => {
    const id = 'ass_' + Math.random().toString(36).substring(2, 9);
    const today = new Date();
    const dateStr = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;

    const created: TeacherAssessment = {
      ...newAssessment,
      id,
      createdAt: dateStr,
      enrolledStudentsCount: 0,
      avgScore: 0,
    };

    const updated = [created, ...get().assessments];
    set({ assessments: updated, selectedTab: 'dashboard' });

    // Persist assessment to MongoDB quizzes collection
    fetch('/api/quizzes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: created.title,
        category: created.category,
        difficulty: created.difficulty,
        questions: created.questions,
      }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data._id) {
          console.log('✅ Assessment saved to MongoDB quizzes collection:', data._id);
        }
      })
      .catch((err) => console.warn('⚠️ Could not save assessment to MongoDB:', err));

    return created;
  },

  updateAssessment: (id, updatedData) => {
    const updated = get().assessments.map((a) => (a.id === id ? { ...a, ...updatedData } : a));
    set({ assessments: updated, editingAssessment: null });
  },

  deleteAssessment: (id) => {
    const updated = get().assessments.filter((a) => a.id !== id);
    set({ assessments: updated });
  },

  setEditingAssessment: (assessment) => set({ editingAssessment: assessment }),

  // Live Session Operations
  startLiveSession: (assessmentId) => {
    const assessment = get().assessments.find((a) => a.id === assessmentId) || get().assessments[0];
    
    const codeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let roomCode = '';
    for (let i = 0; i < 6; i++) {
      roomCode += codeChars.charAt(Math.floor(Math.random() * codeChars.length));
    }

    const session: LiveSessionState = {
      roomCode,
      assessment,
      status: 'lobby',
      currentQuestionIndex: 0,
      timer: assessment.questions[0]?.timeLimit || assessment.timePerQuestion || 20,
      students: [],
    };

    set({ activeSession: session, selectedTab: 'lobby' });

    const teacherHostPlayer = {
      id: 'teacher_host_' + roomCode,
      username: get().currentTeacher?.name || 'Teacher Host',
      avatar: '🎓',
      score: 0,
      isReady: true,
      isHost: true,
    };

    useGameStore.getState().setMe(teacherHostPlayer);
    useGameStore.getState().setCurrentQuiz(assessment);
    useGameStore.getState().setRoomCode(roomCode);

    // Socket Backend Real-Time Connection
    socket.emit('join_room', {
      roomCode,
      player: teacherHostPlayer,
      quiz: assessment,
    });

    socket.emit('set_quiz', {
      roomCode,
      quiz: assessment,
    });

    return session;
  },

  startGame: () => {
    const session = get().activeSession;
    if (!session) return;

    const firstTime = session.assessment.questions[0]?.timeLimit || session.assessment.timePerQuestion || 20;

    set({
      activeSession: {
        ...session,
        status: 'live',
        currentQuestionIndex: 0,
        timer: firstTime,
      },
      selectedTab: 'live',
    });

    socket.emit('set_quiz', { roomCode: session.roomCode, quiz: session.assessment });
    socket.emit('start_game', { roomCode: session.roomCode, quiz: session.assessment });
  },

  tickTimer: () => {
    const session = get().activeSession;
    if (!session || session.status !== 'live') return;

    if (session.timer > 1) {
      set({ activeSession: { ...session, timer: session.timer - 1 } });
    } else {
      get().nextQuestion();
    }
  },

  nextQuestion: () => {
    const session = get().activeSession;
    if (!session) return;

    const nextIdx = session.currentQuestionIndex + 1;
    if (nextIdx >= session.assessment.questions.length) {
      get().endLiveSession();
    } else {
      const nextTime = session.assessment.questions[nextIdx]?.timeLimit || session.assessment.timePerQuestion || 20;
      set({
        activeSession: {
          ...session,
          status: 'live',
          currentQuestionIndex: nextIdx,
          timer: nextTime,
        },
        selectedTab: 'live',
      });

      socket.emit('next_question', { roomCode: session.roomCode });
    }
  },

  prevQuestion: () => {
    const session = get().activeSession;
    if (!session) return;

    const prevIdx = Math.max(0, session.currentQuestionIndex - 1);
    const prevTime = session.assessment.questions[prevIdx]?.timeLimit || session.assessment.timePerQuestion || 20;
    set({
      activeSession: {
        ...session,
        status: 'live',
        currentQuestionIndex: prevIdx,
        timer: prevTime,
      },
    });

    socket.emit('set_quiz', { roomCode: session.roomCode, quiz: session.assessment });
  },

  showLeaderboard: () => {
    const session = get().activeSession;
    if (!session) return;
    socket.emit('show_leaderboard', { roomCode: session.roomCode });
  },

  endLiveSession: () => {
    const session = get().activeSession;
    if (!session) return;

    const today = new Date();
    const dateStr = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
    const sorted = [...session.students].sort((a, b) => b.score - a.score);

    const historyItem: SessionHistoryItem = {
      id: 'hist_' + Math.random().toString(36).substring(2, 9),
      assessmentTitle: session.assessment.title,
      category: session.assessment.category,
      roomCode: session.roomCode,
      date: dateStr,
      totalStudents: session.students.length,
      avgScore: 84.5,
      rankings: sorted.map((s, idx) => ({
        rank: idx + 1,
        name: s.name,
        score: s.score,
        correctCount: Math.max(1, Math.floor(s.score / 200)),
      })),
    };

    set({
      sessionHistory: [historyItem, ...get().sessionHistory],
      activeSession: null,
      selectedTab: 'results',
    });
  },

  clearActiveSession: () => {
    set({ activeSession: null, selectedTab: 'dashboard' });
  },

  simulateJoinStudent: () => {
    const session = get().activeSession;
    if (!session) return;

    const candidateStudents = [
      { name: 'Anurag', email: 'anurag@student.edu', avatar: '👨‍🏫', dept: 'Computer Science' },
      { name: 'Alice Johnson', email: 'alice@student.edu', avatar: '👩‍🎓', dept: 'Computer Science' },
      { name: 'Bob Smith', email: 'bob@student.edu', avatar: '🎓', dept: 'Mathematics' },
      { name: 'Charlie Brown', email: 'charlie@student.edu', avatar: '🎓', dept: 'Physics' },
      { name: 'David Miller', email: 'david@student.edu', avatar: '👨‍🎓', dept: 'Chemistry' },
      { name: 'Emma Watson', email: 'emma@student.edu', avatar: '👩‍🎓', dept: 'Computer Science' },
      { name: 'Frank Wright', email: 'frank@student.edu', avatar: '🎓', dept: 'Robotics' },
    ];

    const existingNames = session.students.map((s) => s.name);
    const nextStudent = candidateStudents.find((c) => !existingNames.includes(c.name)) || {
      name: 'Student ' + (session.students.length + 1),
      email: `student${session.students.length + 1}@student.edu`,
      avatar: '🎓',
      dept: 'Computer Science',
    };

    const studentId = 'std_' + Math.random().toString(36).substring(2, 7);

    const newConnectedStudent: ConnectedStudent = {
      id: studentId,
      name: nextStudent.name,
      email: nextStudent.email,
      avatar: nextStudent.avatar,
      status: 'WAITING',
      score: 0,
    };

    // Instant local UI update
    set({
      activeSession: {
        ...session,
        students: [...session.students.filter(s => s.id !== studentId), newConnectedStudent],
      },
    });

    // Emit socket join event
    socket.emit('join_room', {
      roomCode: session.roomCode,
      player: {
        id: studentId,
        username: nextStudent.name,
        email: nextStudent.email,
        avatar: nextStudent.avatar,
        isHost: false,
      },
    });
  },

  addStudentToLobby: (student) => {
    const session = get().activeSession;
    if (!session) return;

    const newConnectedStudent: ConnectedStudent = {
      id: student.id,
      name: student.name,
      email: student.email,
      avatar: student.avatar || '🎓',
      status: 'WAITING',
      score: 0,
    };

    set({
      activeSession: {
        ...session,
        students: [...session.students.filter(s => s.id !== student.id), newConnectedStudent],
      },
    });

    // Emit socket join event
    socket.emit('join_room', {
      roomCode: session.roomCode,
      player: {
        id: student.id,
        username: student.name,
        email: student.email,
        avatar: student.avatar,
        isHost: false,
      },
    });
  },

  // Student Management CRUD Actions
  addRegisteredStudent: (studentData) => {
    const newStudent: RegisteredStudent = {
      ...studentData,
      id: 'std_' + Math.random().toString(36).substring(2, 7),
      quizzesTaken: 0,
      avgAccuracy: 0,
    };
    set({ registeredStudents: [newStudent, ...get().registeredStudents] });
  },

  updateRegisteredStudent: (id, updated) => {
    const list = get().registeredStudents.map((s) => (s.id === id ? { ...s, ...updated } : s));
    set({ registeredStudents: list });
  },

  deleteRegisteredStudent: (id) => {
    const list = get().registeredStudents.filter((s) => s.id !== id);
    set({ registeredStudents: list });
  },

  toggleBlockStudent: (studentId) => {
    const updated = get().registeredStudents.map((s) =>
      s.id === studentId ? { ...s, status: s.status === 'ACTIVE' ? ('BLOCKED' as const) : ('ACTIVE' as const) } : s
    );
    set({ registeredStudents: updated });
  },
}));

// Global Socket Listener for Real-Time Room Updates
if (typeof window !== 'undefined') {
  socket.on('room_update', (roomData: any) => {
    const state = useTeacherStore.getState();
    if (!state.activeSession || !roomData) return;

    const eventCode = String(roomData.code || '').trim().toUpperCase();
    const activeCode = String(state.activeSession.roomCode || '').trim().toUpperCase();
    if (eventCode !== activeCode) return;

    // Map non-host players
    const connectedStudents: ConnectedStudent[] = (roomData.players || [])
      .filter((p: any) => !p.isHost)
      .map((p: any) => ({
        id: p.id || p.odId || 'std_' + Math.random().toString(36).substring(2, 7),
        name: p.username || p.name || 'Student',
        email: p.email || `${(p.username || 'student').toLowerCase().replace(/\s+/g, '')}@student.edu`,
        avatar: p.avatar || '🎓',
        status: p.isReady ? 'READY' : 'WAITING',
        score: p.score || 0,
      }));

    // Maintain current teacher session status ('lobby' or 'live')
    useTeacherStore.setState({
      activeSession: {
        ...state.activeSession,
        assessment: roomData.currentQuiz || state.activeSession.assessment,
        students: connectedStudents,
      },
    });

    // Auto-register joined students into Student Directory
    const existingReg = state.registeredStudents;
    let regChanged = false;
    const updatedReg = [...existingReg];

    connectedStudents.forEach((cs) => {
      if (!updatedReg.some((r) => r.id === cs.id || r.name.toLowerCase() === cs.name.toLowerCase())) {
        updatedReg.push({
          id: cs.id,
          name: cs.name,
          email: cs.email || `${cs.name.toLowerCase().replace(/\s+/g, '')}@student.edu`,
          department: 'Computer Science',
          status: 'ACTIVE',
          quizzesTaken: 1,
          avgAccuracy: 85,
        });
        regChanged = true;
      }
    });

    if (regChanged) {
      useTeacherStore.setState({ registeredStudents: updatedReg });
    }
  });
}
