import { create } from 'zustand';
import { getApiBase } from '../services/config';

export interface AssessmentItem {
  id: string;
  title: string;
  teacherId: string;
  teacherName: string;
  department: string;
  questionCount: number;
  studentsParticipated: number;
  date: string;
  time: string;
  status: 'Live' | 'Completed' | 'Scheduled';
}

export interface TeacherItem {
  id: string;
  name: string;
  email: string;
  department: string;
  status: 'ACTIVE' | 'INACTIVE';
  joinedDate: string;
  password?: string;
  assessmentsCount?: number;
}

export interface StudentItem {
  id: string;
  name: string;
  email: string;
  quizzesTaken: number;
  totalPoints: number;
  accuracy: number;
  progress: number;
  lastActive: string;
}

interface AdminState {
  teachers: TeacherItem[];
  students: StudentItem[];
  assessments: AssessmentItem[];
  recentlyCreatedTeacher: TeacherItem | null;
  showCreateModal: boolean;
  showSuccessModal: boolean;
  selectedTeacherProfile: TeacherItem | null;
  loading: boolean;

  // Actions
  setShowCreateModal: (show: boolean) => void;
  setShowSuccessModal: (show: boolean) => void;
  setSelectedTeacherProfile: (teacher: TeacherItem | null) => void;
  fetchTeachersFromBackend: () => Promise<void>;
  fetchStudentsFromBackend: () => Promise<void>;
  addTeacher: (teacher: { name: string; email: string; password?: string; department: string }) => Promise<TeacherItem>;
  deleteTeacher: (id: string) => Promise<void>;
  updateTeacher: (id: string, data: Partial<TeacherItem>) => Promise<void>;
  getTeacherAssessments: (teacherId: string) => AssessmentItem[];
}

const DEFAULT_TEACHERS: TeacherItem[] = [
  {
    id: '1b6ab4ac-7821-4f2a-9e11-4091a120892c',
    name: 'Dr. Sarah Jenkins',
    email: 'teacher@edupulse.ai',
    department: 'Computer Science',
    status: 'ACTIVE',
    joinedDate: '21/08/2026',
    password: 'teacher123',
    assessmentsCount: 8,
  },
  {
    id: 'efda7886-9021-4b1c-88fa-120938491029',
    name: 'anurag',
    email: 'anurag@gmail.com',
    department: 'Computer Science',
    status: 'ACTIVE',
    joinedDate: '21/08/2026',
    password: 'teacher123',
    assessmentsCount: 4,
  },
];

const DEFAULT_STUDENTS: StudentItem[] = [
  {
    id: 'std_01',
    name: 'Alex Johnson',
    email: 'alex@student.edu',
    quizzesTaken: 14,
    totalPoints: 4250,
    accuracy: 92,
    progress: 88,
    lastActive: '21/08/2026 10:45 AM',
  },
  {
    id: 'std_02',
    name: 'Priya Sharma',
    email: 'priya@student.edu',
    quizzesTaken: 19,
    totalPoints: 5890,
    accuracy: 96,
    progress: 94,
    lastActive: '21/08/2026 11:20 AM',
  },
  {
    id: 'std_03',
    name: 'Michael Chen',
    email: 'michael@student.edu',
    quizzesTaken: 11,
    totalPoints: 3100,
    accuracy: 84,
    progress: 75,
    lastActive: '20/08/2026 04:15 PM',
  },
  {
    id: 'std_04',
    name: 'Sophia Patel',
    email: 'sophia@student.edu',
    quizzesTaken: 16,
    totalPoints: 4900,
    accuracy: 89,
    progress: 82,
    lastActive: '21/08/2026 09:30 AM',
  },
];

const DEFAULT_ASSESSMENTS: AssessmentItem[] = [
  {
    id: 'ass_01',
    title: 'Data Structures & Algorithms Midterm',
    teacherId: '1b6ab4ac-7821-4f2a-9e11-4091a120892c',
    teacherName: 'Dr. Sarah Jenkins',
    department: 'Computer Science',
    questionCount: 25,
    studentsParticipated: 42,
    date: '21/08/2026',
    time: '10:00 AM',
    status: 'Completed',
  },
  {
    id: 'ass_02',
    title: 'Python for Data Science Quiz 3',
    teacherId: '1b6ab4ac-7821-4f2a-9e11-4091a120892c',
    teacherName: 'Dr. Sarah Jenkins',
    department: 'Computer Science',
    questionCount: 15,
    studentsParticipated: 38,
    date: '19/08/2026',
    time: '02:30 PM',
    status: 'Completed',
  },
  {
    id: 'ass_03',
    title: 'Web Architecture & REST APIs',
    teacherId: 'efda7886-9021-4b1c-88fa-120938491029',
    teacherName: 'anurag',
    department: 'Computer Science',
    questionCount: 20,
    studentsParticipated: 35,
    date: '21/08/2026',
    time: '11:15 AM',
    status: 'Live',
  },
  {
    id: 'ass_04',
    title: 'Operating Systems - Concurrency & Threads',
    teacherId: 'efda7886-9021-4b1c-88fa-120938491029',
    teacherName: 'anurag',
    department: 'Computer Science',
    questionCount: 18,
    studentsParticipated: 29,
    date: '18/08/2026',
    time: '01:00 PM',
    status: 'Completed',
  },
];

const getStoredTeachers = (): TeacherItem[] => {
  const saved = localStorage.getItem('admin_teachers');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }
  return DEFAULT_TEACHERS;
};

export const useAdminStore = create<AdminState>((set, get) => ({
  teachers: getStoredTeachers(),
  students: DEFAULT_STUDENTS,
  assessments: DEFAULT_ASSESSMENTS,
  recentlyCreatedTeacher: null,
  showCreateModal: false,
  showSuccessModal: false,
  selectedTeacherProfile: null,
  loading: false,

  setShowCreateModal: (show) => set({ showCreateModal: show }),
  setShowSuccessModal: (show) => set({ showSuccessModal: show }),
  setSelectedTeacherProfile: (teacher) => set({ selectedTeacherProfile: teacher }),

  fetchTeachersFromBackend: async () => {
    try {
      set({ loading: true });
      const res = await fetch(`${getApiBase()}/admin/teachers`);
      if (res.ok) {
        const data = await res.json();
        if (data.teachers && data.teachers.length > 0) {
          // Merge backend teachers with default teachers to preserve view richness
          const existingIds = new Set(data.teachers.map((t: TeacherItem) => t.id));
          const merged = [
            ...data.teachers,
            ...get().teachers.filter((t) => !existingIds.has(t.id)),
          ];
          set({ teachers: merged, loading: false });
          localStorage.setItem('admin_teachers', JSON.stringify(merged));
          return;
        }
      }
      set({ loading: false });
    } catch (e) {
      console.warn('Backend server connection failed, using local store:', e);
      set({ loading: false });
    }
  },

  fetchStudentsFromBackend: async () => {
    try {
      const res = await fetch(`${getApiBase()}/admin/students`);
      if (res.ok) {
        const data = await res.json();
        if (data.students && data.students.length > 0) {
          set({ students: data.students });
        }
      }
    } catch (e) {
      console.warn('Backend server student fetch skipped:', e);
    }
  },

  addTeacher: async (newTeacherData) => {
    const today = new Date();
    const dateStr = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;

    let createdTeacher: TeacherItem;

    try {
      // POST to backend Express API -> saves directly into MongoDB users collection!
      const res = await fetch(`${getApiBase()}/admin/create-teacher`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newTeacherData.name,
          email: newTeacherData.email,
          password: newTeacherData.password || 'teacher123',
          department: newTeacherData.department || 'Computer Science',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        createdTeacher = data.teacher;
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to create teacher in MongoDB');
      }
    } catch (e: any) {
      console.warn('MongoDB direct save error, generating client fallback teacher:', e.message);
      const fallbackId = `${Math.random().toString(36).substr(2, 8)}-${Math.random().toString(36).substr(2, 4)}-4872-bafa-${Math.random().toString(36).substr(2, 12)}`;
      createdTeacher = {
        id: fallbackId,
        name: newTeacherData.name,
        email: newTeacherData.email,
        department: newTeacherData.department || 'Computer Science',
        status: 'ACTIVE',
        joinedDate: dateStr,
        password: newTeacherData.password || 'teacher123',
        assessmentsCount: 0,
      };
    }

    const updatedTeachers = [createdTeacher, ...get().teachers];
    localStorage.setItem('admin_teachers', JSON.stringify(updatedTeachers));

    set({
      teachers: updatedTeachers,
      recentlyCreatedTeacher: createdTeacher,
      showCreateModal: false,
      showSuccessModal: true,
    });

    return createdTeacher;
  },

  deleteTeacher: async (id) => {
    try {
      await fetch(`${getApiBase()}/admin/teachers/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Backend delete skipped:', e);
    }
    const updatedTeachers = get().teachers.filter((t) => t.id !== id);
    localStorage.setItem('admin_teachers', JSON.stringify(updatedTeachers));
    set({ teachers: updatedTeachers });
  },

  updateTeacher: async (id, data) => {
    try {
      await fetch(`${getApiBase()}/admin/teachers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (e) {
      console.warn('Backend update error:', e);
    }
    const updatedTeachers = get().teachers.map((t) => (t.id === id ? { ...t, ...data } : t));
    localStorage.setItem('admin_teachers', JSON.stringify(updatedTeachers));
    set({ teachers: updatedTeachers });
  },

  getTeacherAssessments: (teacherId) => {
    return get().assessments.filter((a) => a.teacherId === teacherId);
  },
}));
