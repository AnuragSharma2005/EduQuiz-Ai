import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, Search, Ban, CheckCircle, GraduationCap, Plus, Edit, Trash2, X, Save, UserPlus } from 'lucide-react';
import { useTeacherStore, RegisteredStudent } from './teacherStore';

export const StudentManagementView: React.FC = () => {
  const {
    registeredStudents,
    toggleBlockStudent,
    deleteRegisteredStudent,
    updateRegisteredStudent,
    addRegisteredStudent,
    fetchTeacherStudents,
  } = useTeacherStore();

  useEffect(() => {
    fetchTeacherStudents();
  }, [fetchTeacherStudents]);

  const [searchTerm, setSearchTerm] = useState('');
  const [editingStudent, setEditingStudent] = useState<RegisteredStudent | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State for Adding Student
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newDept, setNewDept] = useState('Computer Science');

  // Form State for Editing Student
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editDept, setEditDept] = useState('');
  const [editStatus, setEditStatus] = useState<'ACTIVE' | 'BLOCKED'>('ACTIVE');

  const filtered = registeredStudents.filter(
    (s) =>
      (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.department || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.id || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenEdit = (student: RegisteredStudent) => {
    setEditingStudent(student);
    setEditName(student.name);
    setEditEmail(student.email);
    setEditDept(student.department);
    setEditStatus(student.status);
  };

  const handleSaveEdit = () => {
    if (!editingStudent) return;
    updateRegisteredStudent(editingStudent.id, {
      name: editName,
      email: editEmail,
      department: editDept,
      status: editStatus,
    });
    setEditingStudent(null);
  };

  const handleCreateStudent = () => {
    if (!newName || !newEmail) return;
    addRegisteredStudent({
      name: newName,
      email: newEmail,
      department: newDept,
      status: 'ACTIVE',
    });
    setNewName('');
    setNewEmail('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="bg-[#070e28]/90 rounded-3xl p-6 border border-sky-500/30 shadow-xl shadow-sky-950/40 backdrop-blur-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <GraduationCap className="text-sky-400" size={28} />
            <span>Classroom & Student Directory</span>
          </h1>
          <p className="text-xs font-semibold text-sky-200/70 mt-1">
            Manage student access, edit details, or let students register automatically upon joining quiz rooms.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-3 text-sky-400/70" size={16} />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#04091a] border border-sky-500/30 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder:text-slate-500"
            />
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#070e28]/90 rounded-2xl p-5 border border-sky-500/30 shadow-lg shadow-sky-950/30 backdrop-blur-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/15 border border-sky-400/40 text-sky-300 flex items-center justify-center font-bold">
            <Users size={22} />
          </div>
          <div>
            <div className="text-[10px] font-extrabold text-sky-300/80 uppercase">Total Registered</div>
            <div className="text-2xl font-black text-white">{registeredStudents.length}</div>
          </div>
        </div>

        <div className="bg-[#070e28]/90 rounded-2xl p-5 border border-sky-500/30 shadow-lg shadow-sky-950/30 backdrop-blur-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 flex items-center justify-center font-bold">
            <CheckCircle size={22} />
          </div>
          <div>
            <div className="text-[10px] font-extrabold text-emerald-300/80 uppercase">Active Students</div>
            <div className="text-2xl font-black text-emerald-400">
              {registeredStudents.filter((s) => s.status === 'ACTIVE').length}
            </div>
          </div>
        </div>

        <div className="bg-[#070e28]/90 rounded-2xl p-5 border border-sky-500/30 shadow-lg shadow-sky-950/30 backdrop-blur-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-400/40 text-rose-300 flex items-center justify-center font-bold">
            <Ban size={22} />
          </div>
          <div>
            <div className="text-[10px] font-extrabold text-rose-300/80 uppercase">Blocked Students</div>
            <div className="text-2xl font-black text-rose-400">
              {registeredStudents.filter((s) => s.status === 'BLOCKED').length}
            </div>
          </div>
        </div>
      </div>

      {/* Registered Students Table / Empty State */}
      <div className="bg-[#070e28]/90 rounded-3xl border border-sky-500/30 shadow-xl shadow-sky-950/40 overflow-hidden backdrop-blur-2xl">
        <div className="px-6 py-4 border-b border-sky-500/20 flex items-center justify-between">
          <span className="text-sm font-extrabold text-white">Student Directory ({filtered.length})</span>
          <span className="text-[11px] text-sky-300/70 font-semibold">Automatic Auto-Registration Active</span>
        </div>

        {registeredStudents.length === 0 ? (
          /* Empty 0 State */
          <div className="p-12 text-center space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-sky-500/15 text-sky-300 flex items-center justify-center mx-auto border border-sky-400/40 shadow-inner">
              <UserPlus size={32} />
            </div>

            <div>
              <h3 className="text-lg font-black text-white">No Students Registered Yet</h3>
              <p className="text-xs text-sky-200/70 mt-1 leading-relaxed">
                Your directory starts empty. Students will be added automatically when they join your live quiz lobbies, or you can register them manually.
              </p>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 mx-auto cursor-pointer"
            >
              <Plus size={16} />
              <span>Register First Student</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#04091a] border-b border-sky-500/20 text-[11px] font-extrabold text-sky-300/80 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Student Name</th>
                  <th className="py-3.5 px-6">Department</th>
                  <th className="py-3.5 px-6">Quizzes Taken</th>
                  <th className="py-3.5 px-6">Avg Accuracy</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-500/15 text-xs font-semibold text-sky-100/90">
                {filtered.map((student) => {
                  const isBlocked = student.status === 'BLOCKED';
                  return (
                    <tr key={student.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-sky-500/15 text-sky-300 font-bold flex items-center justify-center text-sm border border-sky-400/30">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-extrabold text-white">{student.name}</div>
                            <div className="text-[11px] text-sky-200/60">{student.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-sky-200/80 font-medium">{student.department}</td>
                      <td className="py-4 px-6 font-bold text-white">{student.quizzesTaken}</td>
                      <td className="py-4 px-6 font-bold text-sky-300">{student.avgAccuracy}%</td>

                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            isBlocked
                              ? 'bg-rose-950/60 text-rose-300 border border-rose-800/50'
                              : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50'
                          }`}
                        >
                          {student.status}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(student)}
                            title="Edit Student Information"
                            className="p-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 font-bold transition-all cursor-pointer border border-sky-500/30"
                          >
                            <Edit size={14} />
                          </button>

                          <button
                            onClick={() => toggleBlockStudent(student.id)}
                            title={isBlocked ? 'Unblock Student' : 'Block Access'}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-1 border ${
                              isBlocked
                                ? 'bg-emerald-950/50 text-emerald-300 hover:bg-emerald-900/60 border-emerald-800/50'
                                : 'bg-amber-950/50 text-amber-300 hover:bg-amber-900/60 border-amber-800/50'
                            }`}
                          >
                            {isBlocked ? <CheckCircle size={14} /> : <Ban size={14} />}
                            <span>{isBlocked ? 'Unblock' : 'Block'}</span>
                          </button>

                          <button
                            onClick={() => deleteRegisteredStudent(student.id)}
                            title="Delete Student"
                            className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 font-bold transition-all cursor-pointer border border-rose-800/40"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Student Modal */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020512]/92 backdrop-blur-2xl">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#070e28] rounded-3xl max-w-md w-full border border-sky-500/30 shadow-2xl p-6 space-y-5 text-white"
          >
            <div className="flex items-center justify-between border-b border-sky-500/20 pb-3">
              <h2 className="text-lg font-black text-white">Edit Student Details</h2>
              <button
                onClick={() => setEditingStudent(null)}
                className="p-1.5 rounded-xl bg-white/5 border border-sky-500/20 text-sky-300 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-sky-300 block mb-1">Student Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#04091a] border border-sky-500/30 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-sky-300 block mb-1">Student Email Address</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#04091a] border border-sky-500/30 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-sky-300 block mb-1">Department</label>
                <input
                  type="text"
                  value={editDept}
                  onChange={(e) => setEditDept(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#04091a] border border-sky-500/30 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-sky-300 block mb-1">Access Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#04091a] border border-sky-500/30 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400"
                >
                  <option value="ACTIVE" className="bg-[#04091a]">ACTIVE (Allowed in Quizzes)</option>
                  <option value="BLOCKED" className="bg-[#04091a]">BLOCKED (Restricted from Live Rooms)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-sky-500/20 pt-4">
              <button
                onClick={() => setEditingStudent(null)}
                className="px-4 py-2 rounded-xl text-sky-300 font-bold text-xs hover:bg-white/5 cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveEdit}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-xs shadow-md shadow-sky-500/30 flex items-center gap-1.5 cursor-pointer"
              >
                <Save size={14} />
                <span>Save Changes</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020512]/92 backdrop-blur-2xl">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#070e28] rounded-3xl max-w-md w-full border border-sky-500/30 shadow-2xl p-6 space-y-5 text-white"
          >
            <div className="flex items-center justify-between border-b border-sky-500/20 pb-3">
              <h2 className="text-lg font-black text-white">Register New Student</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/5 border border-sky-500/20 text-sky-300 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-sky-300 block mb-1">Student Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#04091a] border border-sky-500/30 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-sky-300 block mb-1">Student Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. john@student.edu"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#04091a] border border-sky-500/30 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-sky-300 block mb-1">Department</label>
                <input
                  type="text"
                  placeholder="e.g. Computer Science"
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#04091a] border border-sky-500/30 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-sky-500/20 pt-4">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl text-sky-300 font-bold text-xs hover:bg-white/5 cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateStudent}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-md shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer"
              >
                <Plus size={14} />
                <span>Register Student</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
