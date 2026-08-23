import { create } from 'zustand';
import { getApiBase } from '../services/config';

export interface AssessmentItem {
  id: string;
  title: string;
  teacherId: string;
  teacherEmail?: string;
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
  fetchAssessmentsFromBackend: () => Promise<void>;
  addTeacher: (teacher: { name: string; email: string; password?: string; department: string }) => Promise<TeacherItem>;
  deleteTeacher: (id: string) => Promise<void>;
  updateTeacher: (id: string, data: Partial<TeacherItem>) => Promise<void>;
  getTeacherAssessments: (teacherId: string) => AssessmentItem[];
}

const getStoredTeachers = (): TeacherItem[] => {
  const saved = localStorage.getItem('admin_teachers');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (t: TeacherItem) =>
            t.email !== 'teacher@edupulse.ai' &&
            t.id !== '1b6ab4ac-7821-4f2a-9e11-4091a120892c' &&
            t.id !== 'efda7886-9021-4b1c-88fa-120938491029'
        );
      }
    } catch (e) {
      console.error(e);
    }
  }
  return [];
};

export const useAdminStore = create<AdminState>((set, get) => ({
  teachers: getStoredTeachers(),
  students: [],
  assessments: [],
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
        if (data.teachers && Array.isArray(data.teachers)) {
          const realTeachers: TeacherItem[] = data.teachers;
          set({ teachers: realTeachers, loading: false });
          localStorage.setItem('admin_teachers', JSON.stringify(realTeachers));
          get().fetchAssessmentsFromBackend();
          return;
        }
      }
      set({ loading: false });
      get().fetchAssessmentsFromBackend();
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
        if (data && Array.isArray(data.students)) {
          set({ students: data.students });
        }
      }
    } catch (e) {
      console.warn('Backend server student fetch skipped:', e);
    }
  },

  fetchAssessmentsFromBackend: async () => {
    try {
      const currentTeachers = get().teachers;
      const mapped: AssessmentItem[] = [];
      const seenIds = new Set<string>();

      // 1. Fetch Quizzes from MongoDB backend
      try {
        const quizRes = await fetch(`${getApiBase()}/quizzes`);
        if (quizRes.ok) {
          const quizData = await quizRes.json();
          if (quizData && Array.isArray(quizData.quizzes)) {
            quizData.quizzes.forEach((q: any) => {
              const qId = q._id || q.id;
              if (seenIds.has(qId)) return;
              seenIds.add(qId);

              const qCreatedBy = String(q.createdBy || '').toLowerCase();
              const qTeacherId = String(q.teacherId || '');
              const qTeacherName = String(q.teacherName || '').toLowerCase();

              const matchingTeacher = currentTeachers.find((t) => {
                const tEmail = String(t.email || '').toLowerCase();
                const tName = String(t.name || '').toLowerCase();
                const tId = String(t.id || '');

                return (
                  (tId && (tId === qTeacherId || tId === qCreatedBy)) ||
                  (tEmail && (tEmail === qCreatedBy || tEmail === qTeacherId.toLowerCase())) ||
                  (tName && qTeacherName && tName === qTeacherName)
                );
              });

              mapped.push({
                id: qId,
                title: q.title,
                teacherId: matchingTeacher ? matchingTeacher.id : (q.teacherId || q.createdBy || 'unknown'),
                teacherEmail: matchingTeacher ? matchingTeacher.email : qCreatedBy,
                teacherName: matchingTeacher ? matchingTeacher.name : (q.teacherName || 'Teacher'),
                department: matchingTeacher?.department || q.category || 'Computer Science',
                questionCount: q.questions?.length || q.questionCount || 0,
                studentsParticipated: q.enrolledStudentsCount || q.playCount || 0,
                date: q.createdAt ? new Date(q.createdAt).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB'),
                time: q.createdAt ? new Date(q.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:00 AM',
                status: q.isPublished ? 'Completed' : 'Scheduled',
              });
            });
          }
        }
      } catch (e) {
        console.warn('Quiz fetch skipped:', e);
      }

      // 2. Fetch Sessions from MongoDB backend
      try {
        const sessionRes = await fetch(`${getApiBase()}/sessions`);
        if (sessionRes.ok) {
          const sessionData = await sessionRes.json();
          if (sessionData && Array.isArray(sessionData.sessions)) {
            sessionData.sessions.forEach((s: any) => {
              const sId = s._id || s.id;
              if (seenIds.has(sId)) return;
              seenIds.add(sId);

              const hostEmail = String(s.hostEmail || '').toLowerCase();
              const hostId = String(s.hostId || '');
              const hostName = String(s.hostName || '').toLowerCase();

              const matchingTeacher = currentTeachers.find((t) => {
                const tEmail = String(t.email || '').toLowerCase();
                const tName = String(t.name || '').toLowerCase();
                const tId = String(t.id || '');

                return (
                  (tId && tId === hostId) ||
                  (tEmail && tEmail === hostEmail) ||
                  (tName && hostName && tName === hostName)
                );
              });

              mapped.push({
                id: sId,
                title: s.quizTitle || 'Live Battle Session',
                teacherId: matchingTeacher ? matchingTeacher.id : (hostId || hostEmail || 'unknown'),
                teacherEmail: matchingTeacher ? matchingTeacher.email : hostEmail,
                teacherName: matchingTeacher ? matchingTeacher.name : (s.hostName || 'Teacher'),
                department: matchingTeacher?.department || s.quizCategory || 'Computer Science',
                questionCount: s.totalQuestions || 5,
                studentsParticipated: Array.isArray(s.players) ? s.players.length : (s.playerCount || 0),
                date: s.createdAt ? new Date(s.createdAt).toLocaleDateString('en-GB') : (s.dateStr || new Date().toLocaleDateString('en-GB')),
                time: s.createdAt ? new Date(s.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:00 AM',
                status: s.status === 'live' ? 'Live' : 'Completed',
              });
            });
          }
        }
      } catch (e) {
        console.warn('Session fetch skipped:', e);
      }

      set({ assessments: mapped });
    } catch (e) {
      console.warn('Backend server assessment fetch skipped:', e);
      set({ assessments: [] });
    }
  },

  addTeacher: async (newTeacherData) => {
    const today = new Date();
    const dateStr = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;

    let createdTeacher: TeacherItem;

    try {
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

    get().fetchAssessmentsFromBackend();

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
    const teacher = get().teachers.find(
      (t) => t.id === teacherId || (t.email && t.email.toLowerCase() === String(teacherId).toLowerCase())
    );

    return get().assessments.filter((a) => {
      if (a.teacherId === teacherId) return true;
      if (teacher) {
        if (a.teacherId === teacher.id || a.teacherId === teacher.email) return true;
        if (a.teacherEmail && teacher.email && a.teacherEmail.toLowerCase() === teacher.email.toLowerCase()) return true;
        if (a.teacherName && teacher.name && a.teacherName.toLowerCase() === teacher.name.toLowerCase()) return true;
      }
      return false;
    });
  },
}));
