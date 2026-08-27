import { create } from 'zustand';
import socket from '../services/socket';
import { useGameStore } from '../store/useGameStore';
import { getApiBase } from '../services/config';
import { useAdminStore } from '../admin/adminStore';

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

  loginTeacher: (email: string, password: string) => Promise<boolean>;
  logoutTeacher: () => void;
  setSelectedTab: (tab: TeacherState['selectedTab']) => void;
  toggleSidebar: () => void;
  updateTeacherProfile: (updated: Partial<TeacherProfile>) => void;
  fetchTeacherQuizzes: () => Promise<void>;
  fetchTeacherSessions: () => Promise<void>;
  fetchTeacherStudents: () => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
  
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
  simulateScores: () => void;
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

const getInitialTeacherProfile = (): TeacherProfile => {
  if (typeof window !== 'undefined') {
    const saved = sessionStorage.getItem('teacher_data') || localStorage.getItem('teacher_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
  }
  return {
    id: '1b6ab4ac-7821-4f2a-9e11-4091a120892c',
    name: 'Dr. Sarah Jenkins',
    email: 'teacher@edupulse.ai',
    department: 'Computer Science',
    title: 'Senior Associate Professor',
    bio: 'Passionate about AI algorithms, interactive classroom learning, and real-time student gamification.',
    phone: '+1 (555) 234-5678',
  };
};

const getStoredTeacherAssessments = (teacherId: string, email: string): TeacherAssessment[] => {
  const lowerEmail = (email || '').toLowerCase();
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(`teacher_assessments_${teacherId}`) || localStorage.getItem(`teacher_assessments_${lowerEmail}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
  }

  if (lowerEmail === 'anurag@gmail.com') {
    return [
      {
        id: 'web_arch_101',
        title: 'Web Architecture & REST APIs',
        category: 'COMPUTER SCIENCE',
        difficulty: 'Medium',
        timePerQuestion: 20,
        enrolledStudentsCount: 35,
        avgScore: 88.0,
        createdAt: '21/08/2026',
        questions: [
          {
            id: 'wq1',
            text: 'Which HTTP method is idempotent and used to retrieve resources?',
            options: ['POST', 'GET', 'PATCH', 'CONNECT'],
            correctAnswer: 1,
            timeLimit: 20,
          },
          {
            id: 'wq2',
            text: 'What HTTP status code represents "Created"?',
            options: ['200 OK', '201 Created', '404 Not Found', '500 Server Error'],
            correctAnswer: 1,
            timeLimit: 20,
          },
        ],
      },
      {
        id: 'os_concurrency',
        title: 'Operating Systems - Concurrency & Threads',
        category: 'COMPUTER SCIENCE',
        difficulty: 'Hard',
        timePerQuestion: 25,
        enrolledStudentsCount: 29,
        avgScore: 81.5,
        createdAt: '18/08/2026',
        questions: [
          {
            id: 'osq1',
            text: 'What is a Semaphore used for in OS concurrency?',
            options: ['Process Scheduling', 'Synchronization', 'Virtual Memory', 'Disk Formatting'],
            correctAnswer: 1,
            timeLimit: 25,
          },
        ],
      },
    ];
  }

  if (lowerEmail === 'teacher@edupulse.ai') {
    return DEFAULT_TEACHER_ASSESSMENTS;
  }

  // Any newly created teacher starts with 0 assessments!
  return [];
};

const getStoredTeacherSessions = (teacherId: string, email: string): SessionHistoryItem[] => {
  const lowerEmail = (email || '').toLowerCase();
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(`teacher_sessions_${teacherId}`) || localStorage.getItem(`teacher_sessions_${lowerEmail}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
  }

  return [];
};

const _initTeacher = getInitialTeacherProfile();

export const useTeacherStore = create<TeacherState>((set, get) => ({
  currentTeacher: _initTeacher,
  isTeacherAuth: typeof window !== 'undefined' && sessionStorage.getItem('isTeacherAuth') === 'true',
  assessments: getStoredTeacherAssessments(_initTeacher.id, _initTeacher.email),
  activeSession: null,
  sessionHistory: getStoredTeacherSessions(_initTeacher.id, _initTeacher.email),
  registeredStudents: [], // Starts 0 initial state
  editingAssessment: null,
  selectedTab: 'dashboard',
  isSidebarOpen: false,

  fetchTeacherQuizzes: async () => {
    const teacher = get().currentTeacher;
    if (!teacher || !teacher.id) return;

    try {
      const res = await fetch(`${getApiBase()}/quizzes?teacherId=${encodeURIComponent(teacher.id)}&email=${encodeURIComponent(teacher.email)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.quizzes)) {
          const titleMap = new Map<string, TeacherAssessment>();

          data.quizzes.forEach((q: any) => {
            const cleanTitle = String(q.title || '').trim();
            const key = cleanTitle.toLowerCase();

            if (!titleMap.has(key)) {
              titleMap.set(key, {
                id: q._id || q.id,
                title: cleanTitle,
                category: q.category || 'COMPUTER SCIENCE',
                difficulty: q.difficulty || 'Medium',
                timePerQuestion: q.timePerQuestion || 20,
                enrolledStudentsCount: q.enrolledStudentsCount || 0,
                avgScore: q.avgScore || 0,
                createdAt: q.createdAt ? new Date(q.createdAt).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB'),
                questions: q.questions || [],
              });
            }
          });

          const loadedQuizzes = Array.from(titleMap.values());

          set({ assessments: loadedQuizzes });
          localStorage.setItem(`teacher_assessments_${teacher.id}`, JSON.stringify(loadedQuizzes));
          localStorage.setItem(`teacher_assessments_${teacher.email}`, JSON.stringify(loadedQuizzes));
        }
      }
    } catch (e) {
      console.warn('⚠️ Could not fetch teacher quizzes from MongoDB:', e);
    }
  },

  fetchTeacherSessions: async () => {
    const teacher = get().currentTeacher;
    if (!teacher || !teacher.id) return;

    try {
      const res = await fetch(`${getApiBase()}/sessions?hostId=${encodeURIComponent(teacher.id)}&hostEmail=${encodeURIComponent(teacher.email)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.sessions)) {
          const sessionMap = new Map<string, SessionHistoryItem>();

          data.sessions.forEach((s: any) => {
            const sId = s._id || s.id;
            const codeKey = String(s.roomCode || sId).trim().toLowerCase();

            if (!sessionMap.has(codeKey)) {
              sessionMap.set(codeKey, {
                id: sId,
                assessmentTitle: s.quizTitle || s.assessmentTitle || 'Interactive Assessment',
                category: s.quizCategory || s.category || 'General',
                roomCode: s.roomCode || 'ROOM',
                date: s.dateStr || (s.createdAt ? new Date(s.createdAt).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB')),
                totalStudents: s.players?.length ?? s.totalStudents ?? 0,
                avgScore: (s.players?.length ?? s.totalStudents ?? 0) === 0 ? 0 : (typeof s.avgScore === 'number' ? s.avgScore : (typeof s.averageScore === 'number' ? s.averageScore : 0)),
                rankings: (s.players || s.rankings || []).map((p: any, idx: number) => ({
                  rank: p.rank || idx + 1,
                  name: p.username || p.name || 'Student',
                  score: p.score || 0,
                  correctCount: p.correctAnswers || p.correctCount || 0,
                })).sort((a: any, b: any) => b.score - a.score).map((item: any, idx: number) => ({ ...item, rank: idx + 1 })),
              });
            }
          });

          const loadedSessions = Array.from(sessionMap.values());

          set({ sessionHistory: loadedSessions });
          localStorage.setItem(`teacher_sessions_${teacher.id}`, JSON.stringify(loadedSessions));
          localStorage.setItem(`teacher_sessions_${teacher.email}`, JSON.stringify(loadedSessions));
        }
      }
    } catch (e) {
      console.warn('⚠️ Could not fetch teacher sessions from MongoDB:', e);
    }
  },

  deleteSession: async (sessionId: string) => {
    const teacher = get().currentTeacher;
    const targetSession = get().sessionHistory.find((s) => s.id === sessionId);
    const sessionTitle = targetSession?.assessmentTitle;

    // 1. Delete session from MongoDB backend (backend will also cascade delete associated quiz)
    try {
      await fetch(`${getApiBase()}/sessions/${encodeURIComponent(sessionId)}`, { method: 'DELETE' });
      if (sessionTitle) {
        await fetch(`${getApiBase()}/quizzes/${encodeURIComponent(sessionTitle)}`, { method: 'DELETE' });
      }
    } catch (e) {
      console.warn('⚠️ Could not delete session/quiz from MongoDB:', e);
    }

    // 2. Remove session from sessionHistory AND remove matching quiz from assessments
    const updatedSessions = get().sessionHistory.filter((s) => s.id !== sessionId);
    let updatedAssessments = get().assessments;
    if (sessionTitle) {
      updatedAssessments = get().assessments.filter(
        (a) => a.id !== sessionId && a.title.toLowerCase() !== sessionTitle.toLowerCase()
      );
    }

    set({ sessionHistory: updatedSessions, assessments: updatedAssessments });

    if (teacher) {
      localStorage.setItem(`teacher_sessions_${teacher.id}`, JSON.stringify(updatedSessions));
      localStorage.setItem(`teacher_sessions_${teacher.email}`, JSON.stringify(updatedSessions));
      localStorage.setItem(`teacher_assessments_${teacher.id}`, JSON.stringify(updatedAssessments));
      localStorage.setItem(`teacher_assessments_${teacher.email}`, JSON.stringify(updatedAssessments));
    }

    // 3. Update AdminStore instantly from MongoDB backend
    try {
      const adminStoreState = useAdminStore.getState();
      if (adminStoreState && adminStoreState.fetchAssessmentsFromBackend) {
        adminStoreState.fetchAssessmentsFromBackend();
      }
    } catch (e) {}
  },

  fetchTeacherStudents: async () => {
    const teacher = get().currentTeacher;
    if (!teacher || !teacher.id) return;

    try {
      const res = await fetch(`${getApiBase()}/sessions/students?hostId=${encodeURIComponent(teacher.id)}&hostEmail=${encodeURIComponent(teacher.email)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.students) && data.students.length > 0) {
          set({ registeredStudents: data.students });
        }
      }
    } catch (e) {
      console.warn('⚠️ Could not fetch teacher students from MongoDB:', e);
    }
  },

  loginTeacher: async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    let matchedTeacher: any = null;

    // 1. Gather all registered teachers created by Admin
    let allTeachers: any[] = [];
    try {
      const stored = localStorage.getItem('admin_teachers');
      if (stored) {
        allTeachers = JSON.parse(stored);
      }
    } catch (e) {}

    if (!allTeachers || allTeachers.length === 0) {
      try {
        const adminStoreState = useAdminStore.getState();
        if (adminStoreState && adminStoreState.teachers) {
          allTeachers = adminStoreState.teachers;
        }
      } catch (e) {}
    }

    if (!allTeachers || allTeachers.length === 0) {
      allTeachers = [
        {
          id: '1b6ab4ac-7821-4f2a-9e11-4091a120892c',
          name: 'Dr. Sarah Jenkins',
          email: 'teacher@edupulse.ai',
          department: 'Computer Science',
          status: 'ACTIVE',
          password: 'teacher123',
        },
        {
          id: 'efda7886-9021-4b1c-88fa-120938491029',
          name: 'anurag',
          email: 'anurag@gmail.com',
          department: 'Computer Science',
          status: 'ACTIVE',
          password: 'teacher123',
        },
      ];
    }

    // Check if email matches an admin-created teacher
    const found = allTeachers.find(
      (t) => t.email.toLowerCase() === cleanEmail && (t.status === 'ACTIVE' || t.status === 'Active' || !t.status)
    );

    if (found) {
      // Validate exact password match!
      if (found.password && found.password !== password) {
        console.warn('⚠️ Password mismatch for teacher:', cleanEmail);
        return false; // Password mismatch -> login fails
      }
      matchedTeacher = found;
    }

    // 2. Fallback check with backend MongoDB authentication endpoint
    if (!matchedTeacher) {
      try {
        const res = await fetch(`${getApiBase()}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, password }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.user && (data.user.role === 'teacher' || data.user.role === 'admin')) {
            matchedTeacher = {
              id: data.user.id || data.user._id,
              name: data.user.fullName || data.user.username,
              email: data.user.email,
              department: data.user.department || 'Computer Science',
              status: 'ACTIVE',
              password: password,
            };
          }
        }
      } catch (e) {
        console.warn('Backend login endpoint check skipped/failed:', e);
      }
    }

    // Strictly check if credentials matched!
    if (!matchedTeacher) {
      return false; // Mismatched or non-existent credentials -> login denied!
    }

    // Construct TeacherProfile for the specific logged-in teacher
    const teacherObj: TeacherProfile = {
      id: matchedTeacher.id || 'teacher_' + Math.random().toString(36).substring(2, 7),
      name: matchedTeacher.name || cleanEmail.split('@')[0],
      email: matchedTeacher.email || cleanEmail,
      department: matchedTeacher.department || 'Computer Science',
      title: matchedTeacher.title || 'Senior Faculty Educator',
      bio: matchedTeacher.bio || 'Passionate about interactive education, student engagement, and gamified quizzes.',
      phone: matchedTeacher.phone || '+1 (555) 234-5678',
    };

    // Load this teacher's separate assessment & session history dataset
    const teacherAssessments = getStoredTeacherAssessments(teacherObj.id, teacherObj.email);
    const teacherSessions = getStoredTeacherSessions(teacherObj.id, teacherObj.email);

    // Save active session
    sessionStorage.setItem('isTeacherAuth', 'true');
    sessionStorage.setItem('teacher_data', JSON.stringify(teacherObj));
    localStorage.setItem('teacher_data', JSON.stringify(teacherObj));

    set({
      currentTeacher: teacherObj,
      isTeacherAuth: true,
      assessments: teacherAssessments,
      sessionHistory: teacherSessions,
      selectedTab: 'dashboard',
    });

    // Fetch latest from MongoDB backend
    get().fetchTeacherQuizzes();
    get().fetchTeacherSessions();

    return true;
  },

  logoutTeacher: () => {
    sessionStorage.removeItem('isTeacherAuth');
    sessionStorage.removeItem('teacher_data');
    localStorage.removeItem('teacher_data');
    set({ isTeacherAuth: false, activeSession: null });
  },

  setSelectedTab: (tab) => set({ selectedTab: tab, isSidebarOpen: false }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  updateTeacherProfile: (updatedFields) => {
    const updated = { ...get().currentTeacher, ...updatedFields };
    sessionStorage.setItem('teacher_data', JSON.stringify(updated));
    localStorage.setItem('teacher_data', JSON.stringify(updated));

    // Also update in admin store list so admin panel stays synced
    try {
      const adminTeachers = useAdminStore.getState().teachers;
      const updatedAdminTeachers = adminTeachers.map((t) =>
        t.id === updated.id || t.email.toLowerCase() === updated.email.toLowerCase()
          ? { ...t, name: updated.name, email: updated.email, department: updated.department }
          : t
      );
      useAdminStore.setState({ teachers: updatedAdminTeachers });
      localStorage.setItem('admin_teachers', JSON.stringify(updatedAdminTeachers));
    } catch (e) {}

    set({ currentTeacher: updated });
  },

  // Assessment CRUD
  createAssessment: (newAssessment) => {
    const id = 'ass_' + Math.random().toString(36).substring(2, 9);
    const today = new Date();
    const dateStr = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
    const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const currentTeacher = get().currentTeacher;

    const created: TeacherAssessment = {
      ...newAssessment,
      id,
      createdAt: dateStr,
      enrolledStudentsCount: 0,
      avgScore: 0,
    };

    const updated = [created, ...get().assessments];
    set({ assessments: updated, selectedTab: 'dashboard' });

    // 1. Persist to local storage under teacher's ID
    if (currentTeacher?.id) {
      localStorage.setItem(`teacher_assessments_${currentTeacher.id}`, JSON.stringify(updated));
      localStorage.setItem(`teacher_assessments_${currentTeacher.email}`, JSON.stringify(updated));
    }

    // 2. Sync to AdminStore assessments so Admin can view this teacher's assessment
    try {
      const adminAssessments = useAdminStore.getState().assessments;
      const newAdminAssessment = {
        id,
        title: created.title,
        teacherId: currentTeacher?.id || 'unknown',
        teacherName: currentTeacher?.name || 'Teacher',
        department: currentTeacher?.department || 'Computer Science',
        questionCount: created.questions.length,
        studentsParticipated: 0,
        date: dateStr,
        time: timeStr,
        status: 'Live' as const,
      };
      useAdminStore.setState({ assessments: [newAdminAssessment, ...adminAssessments] });
    } catch (e) {}

    // 3. Persist assessment to MongoDB quizzes collection
    fetch(`${getApiBase()}/quizzes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: created.title,
        category: created.category,
        difficulty: created.difficulty,
        timePerQuestion: created.timePerQuestion || 20,
        questions: created.questions,
        createdBy: currentTeacher?.id,
        teacherId: currentTeacher?.id,
        teacherName: currentTeacher?.name,
      }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && (data._id || data.id)) {
          const mongoId = data._id || data.id;
          console.log('✅ Assessment saved to MongoDB quizzes collection:', mongoId);
          // Sync local ID to MongoDB ObjectId
          const syncedAssessments = get().assessments.map((a) => (a.id === id ? { ...a, id: mongoId } : a));
          set({ assessments: syncedAssessments });
          if (currentTeacher?.id) {
            localStorage.setItem(`teacher_assessments_${currentTeacher.id}`, JSON.stringify(syncedAssessments));
            localStorage.setItem(`teacher_assessments_${currentTeacher.email}`, JSON.stringify(syncedAssessments));
          }
        }
      })
      .catch((err) => console.warn('⚠️ Could not save assessment to MongoDB:', err));

    return created;
  },

  updateAssessment: (id, updatedData) => {
    const updated = get().assessments.map((a) => (a.id === id ? { ...a, ...updatedData } : a));
    set({ assessments: updated, editingAssessment: null });

    const currentTeacher = get().currentTeacher;
    if (currentTeacher?.id) {
      localStorage.setItem(`teacher_assessments_${currentTeacher.id}`, JSON.stringify(updated));
    }

    // Update in MongoDB
    fetch(`${getApiBase()}/quizzes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    }).catch((err) => console.warn('⚠️ Could not update quiz in MongoDB:', err));
  },

  deleteAssessment: async (id: string) => {
    const targetAssessment = get().assessments.find((a) => a.id === id);
    const assessmentTitle = targetAssessment?.title;

    // 1. Remove assessment from assessments AND remove matching session from sessionHistory
    const updatedAssessments = get().assessments.filter((a) => a.id !== id);
    let updatedSessions = get().sessionHistory;
    if (assessmentTitle) {
      updatedSessions = get().sessionHistory.filter(
        (s) => s.id !== id && s.assessmentTitle.toLowerCase() !== assessmentTitle.toLowerCase()
      );
    }

    set({ assessments: updatedAssessments, sessionHistory: updatedSessions });

    const currentTeacher = get().currentTeacher;
    if (currentTeacher?.id) {
      localStorage.setItem(`teacher_assessments_${currentTeacher.id}`, JSON.stringify(updatedAssessments));
      localStorage.setItem(`teacher_assessments_${currentTeacher.email}`, JSON.stringify(updatedAssessments));
      localStorage.setItem(`teacher_sessions_${currentTeacher.id}`, JSON.stringify(updatedSessions));
      localStorage.setItem(`teacher_sessions_${currentTeacher.email}`, JSON.stringify(updatedSessions));
    }

    // 2. Delete in MongoDB backend (backend will also cascade delete associated session)
    try {
      let res = await fetch(`${getApiBase()}/quizzes/${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (!res.ok && assessmentTitle) {
        res = await fetch(`${getApiBase()}/quizzes/${encodeURIComponent(assessmentTitle)}`, { method: 'DELETE' });
      }
      if (id) {
        await fetch(`${getApiBase()}/sessions/${encodeURIComponent(id)}`, { method: 'DELETE' });
      }
      if (assessmentTitle) {
        await fetch(`${getApiBase()}/sessions/${encodeURIComponent(assessmentTitle)}`, { method: 'DELETE' });
      }
    } catch (e) {
      console.warn('⚠️ Could not delete quiz/session from MongoDB:', e);
    }

    // 3. Update AdminStore instantly from MongoDB backend
    try {
      const adminStoreState = useAdminStore.getState();
      if (adminStoreState && adminStoreState.fetchAssessmentsFromBackend) {
        adminStoreState.fetchAssessmentsFromBackend();
      }
    } catch (e) {}
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

    // Save live session immediately to MongoDB
    fetch(`${getApiBase()}/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomCode,
        quizId: assessment.id,
        quizTitle: assessment.title,
        quizCategory: assessment.category,
        hostId: get().currentTeacher?.id,
        hostEmail: get().currentTeacher?.email,
        hostName: get().currentTeacher?.name || 'Teacher Host',
        status: 'lobby',
        totalQuestions: assessment.questions?.length || 0,
      }),
    }).catch((e) => console.warn('Live session post skipped:', e));

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

    if (session.roomCode) {
      socket.emit('end_game', { roomCode: session.roomCode });
    }

    const currentTeacher = get().currentTeacher;
    const today = new Date();
    const dateStr = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
    const sorted = [...session.students].sort((a, b) => b.score - a.score);

    const calcAvg = session.students.length > 0
      ? Math.round(session.students.reduce((acc, s) => acc + s.score, 0) / session.students.length)
      : 0;

    const historyItem: SessionHistoryItem = {
      id: 'hist_' + Math.random().toString(36).substring(2, 9),
      assessmentTitle: session.assessment?.title || 'Interactive Quiz',
      category: session.assessment?.category || 'GENERAL',
      roomCode: session.roomCode,
      date: dateStr,
      totalStudents: session.students.length,
      avgScore: calcAvg,
      rankings: sorted.map((s, idx) => ({
        rank: idx + 1,
        name: s.name,
        score: s.score,
        correctCount: Math.max(1, Math.floor(s.score / 200)),
      })),
    };

    // Update registered students in teacher directory automatically
    const existingReg = [...get().registeredStudents];
    session.students.forEach((st) => {
      const idx = existingReg.findIndex((r) => r.name.toLowerCase() === st.name.toLowerCase());
      if (idx !== -1) {
        existingReg[idx] = {
          ...existingReg[idx],
          quizzesTaken: existingReg[idx].quizzesTaken + 1,
          avgAccuracy: Math.min(100, Math.round((existingReg[idx].avgAccuracy + Math.min(100, Math.round((st.score / 500) * 100))) / 2)),
        };
      } else {
        existingReg.push({
          id: 'std_' + Math.random().toString(36).substring(2, 8),
          name: st.name,
          email: `${st.name.toLowerCase().replace(/\s+/g, '')}@student.edu`,
          department: session.assessment?.category || currentTeacher?.department || 'Computer Science',
          status: 'ACTIVE',
          quizzesTaken: 1,
          avgAccuracy: Math.min(100, Math.round((st.score / 500) * 100) || 85),
        });
      }
    });

    const updatedSessions = [historyItem, ...get().sessionHistory];

    set({
      sessionHistory: updatedSessions,
      registeredStudents: existingReg,
      activeSession: null,
      selectedTab: 'results',
    });

    if (currentTeacher?.id) {
      localStorage.setItem(`teacher_sessions_${currentTeacher.id}`, JSON.stringify(updatedSessions));
      localStorage.setItem(`teacher_sessions_${currentTeacher.email}`, JSON.stringify(updatedSessions));
      localStorage.setItem(`teacher_students_${currentTeacher.id}`, JSON.stringify(existingReg));
      localStorage.setItem(`teacher_students_${currentTeacher.email}`, JSON.stringify(existingReg));
    }

    // Save session to backend MongoDB
    fetch(`${getApiBase()}/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomCode: session.roomCode,
        quizTitle: session.assessment?.title || 'Interactive Quiz',
        quizCategory: session.assessment?.category || 'GENERAL',
        totalQuestions: session.assessment?.questions?.length || 1,
        hostId: currentTeacher?.id,
        hostEmail: currentTeacher?.email,
        hostName: currentTeacher?.name,
        avgScore: calcAvg,
        dateStr,
        status: 'finished',
        players: sorted.map((s) => ({
          username: s.name,
          score: s.score,
          correctAnswers: Math.max(1, Math.floor(s.score / 200)),
        })),
      }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && (data._id || data.id)) {
          console.log('✅ Completed session saved to MongoDB:', data._id || data.id);
        }
      })
      .catch((err) => console.warn('⚠️ Could not save session to MongoDB backend:', err));
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

  simulateScores: () => {
    const session = get().activeSession;
    if (!session) return;

    let currentStudents = [...session.students];
    if (currentStudents.length < 3) {
      currentStudents = [
        { id: 'std_demo_1', name: 'Anurag Sharma', email: 'anurag@student.edu', avatar: '👨‍🎓', status: 'SUBMITTED', score: 850 },
        { id: 'std_demo_2', name: 'Alice Johnson', email: 'alice@student.edu', avatar: '👩‍🎓', status: 'SUBMITTED', score: 780 },
        { id: 'std_demo_3', name: 'Bob Smith', email: 'bob@student.edu', avatar: '🎓', status: 'SUBMITTED', score: 720 },
        { id: 'std_demo_4', name: 'Charlie Brown', email: 'charlie@student.edu', avatar: '👨‍💻', status: 'SUBMITTED', score: 650 },
        { id: 'std_demo_5', name: 'David Miller', email: 'david@student.edu', avatar: '🎓', status: 'SUBMITTED', score: 590 },
      ];
    }

    const updatedStudents = currentStudents.map((student) => {
      if (Math.random() > 0.3) {
        const bonus = Math.floor(Math.random() * 260) + 120;
        return {
          ...student,
          score: student.score + bonus,
          status: 'SUBMITTED' as const,
          lastAnswerCorrect: true,
        };
      }
      return student;
    });

    set({
      activeSession: {
        ...session,
        students: updatedStudents,
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
