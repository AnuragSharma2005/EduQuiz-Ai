import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, Edit2, Trash2, X, CheckCircle, Eye, EyeOff, Calendar, Clock, BookOpen } from 'lucide-react';
import { useAdminStore, TeacherItem } from './adminStore';

export const TeacherManagementView: React.FC = () => {
  const {
    teachers,
    showCreateModal,
    setShowCreateModal,
    showSuccessModal,
    setShowSuccessModal,
    recentlyCreatedTeacher,
    selectedTeacherProfile,
    setSelectedTeacherProfile,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    getTeacherAssessments,
    fetchTeachersFromBackend,
  } = useAdminStore();

  useEffect(() => {
    fetchTeachersFromBackend();
  }, [fetchTeachersFromBackend]);

  const [searchTerm, setSearchTerm] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState<{ [id: string]: boolean }>({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'teacher123',
    department: 'Computer Science',
  });

  // Edit Modal State
  const [editingTeacher, setEditingTeacher] = useState<TeacherItem | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: 'Computer Science',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
  });

  const handleOpenEditModal = (teacher: TeacherItem) => {
    setEditingTeacher(teacher);
    setEditFormData({
      name: teacher.name,
      email: teacher.email,
      password: teacher.password || 'teacher123',
      department: teacher.department || 'Computer Science',
      status: teacher.status || 'ACTIVE',
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeacher) return;
    await updateTeacher(editingTeacher.id, editFormData);
    setEditingTeacher(null);
  };

  const filteredTeachers = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    addTeacher({
      name: formData.name,
      email: formData.email,
      password: formData.password || 'teacher123',
      department: formData.department,
    });

    setFormData({
      name: '',
      email: '',
      password: 'teacher123',
      department: 'Computer Science',
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Teacher Management</h1>
          <p className="text-xs sm:text-sm font-semibold text-sky-200/70 mt-1">
            Create and manage faculty teacher accounts across departments
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Plus size={18} />
          <span>Create Teacher Account</span>
        </motion.button>
      </div>

      {/* Main Table Card (Dark Blue Glassmorphic Theme) */}
      <div className="bg-[#070e28]/90 rounded-3xl border border-sky-500/30 shadow-xl shadow-sky-950/40 backdrop-blur-2xl p-6 space-y-6 text-white">
        {/* Search & Counter Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400/70" />
            <input
              type="text"
              placeholder="Search teachers by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-[#04091a] border border-sky-500/30 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder:text-slate-500"
            />
          </div>

          <span className="text-xs font-bold text-sky-300/80">
            {filteredTeachers.length} {filteredTeachers.length === 1 ? 'Teacher' : 'Teachers'}
          </span>
        </div>

        {/* Teachers Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-sky-500/20 text-[11px] font-extrabold uppercase tracking-wider text-sky-300/80">
                <th className="py-4 px-4">TEACHER ID</th>
                <th className="py-4 px-4">NAME</th>
                <th className="py-4 px-4">EMAIL</th>
                <th className="py-4 px-4">PASSWORD</th>
                <th className="py-4 px-4">DEPARTMENT</th>
                <th className="py-4 px-4">STATUS</th>
                <th className="py-4 px-4">JOINED DATE</th>
                <th className="py-4 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-500/10 text-xs font-medium">
              {filteredTeachers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 font-medium">
                    No teachers found. Click "Create Teacher Account" to add one.
                  </td>
                </tr>
              ) : (
                filteredTeachers.map((teacher) => (
                  <tr
                    key={teacher.id}
                    onClick={() => setSelectedTeacherProfile(teacher)}
                    className="group hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    {/* ID */}
                    <td className="py-4 px-4 font-mono text-[11px] text-sky-300/70">
                      {teacher.id.substring(0, 10)}...
                    </td>

                    {/* Name with Avatar */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-400/40 text-indigo-300 flex items-center justify-center font-bold text-xs">
                          {teacher.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-white group-hover:text-sky-300 transition-colors">
                          {teacher.name}
                        </span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-4 px-4 text-sky-200/80">{teacher.email}</td>

                    {/* Password */}
                    <td className="py-4 px-4 font-mono text-xs text-indigo-300">
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <span className="font-semibold">{visiblePasswords[teacher.id] ? (teacher.password || 'teacher123') : '••••••••'}</span>
                        <button
                          type="button"
                          onClick={() => setVisiblePasswords((prev) => ({ ...prev, [teacher.id]: !prev[teacher.id] }))}
                          className="text-sky-400 hover:text-white transition-colors cursor-pointer p-1"
                          title={visiblePasswords[teacher.id] ? "Hide Password" : "Show Password"}
                        >
                          {visiblePasswords[teacher.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-4 px-4 text-sky-100">{teacher.department}</td>

                    {/* Status Pill */}
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 border border-emerald-400/40 text-emerald-300">
                        {teacher.status}
                      </span>
                    </td>

                    {/* Joined Date */}
                    <td className="py-4 px-4 text-sky-300/70">{teacher.joinedDate}</td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <div
                        className="flex items-center justify-end gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => setSelectedTeacherProfile(teacher)}
                          title="View Profile & Assessments"
                          className="p-2 rounded-xl text-sky-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(teacher)}
                          title="Edit Teacher"
                          className="p-2 rounded-xl text-sky-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => deleteTeacher(teacher.id)}
                          title="Delete Teacher"
                          className="p-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 transition-colors cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Create New Teacher */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-lg bg-[#070e28] border border-sky-500/30 rounded-3xl p-8 shadow-2xl space-y-6 text-white"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowCreateModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full text-sky-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              {/* Modal Header */}
              <div>
                <h2 className="text-2xl font-black text-white">Create New Teacher</h2>
                <p className="text-xs font-semibold text-sky-200/70 mt-1">
                  Set teacher details and initial login password
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-sky-300 uppercase tracking-wider">
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Robert Miller"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-[#04091a] border border-sky-500/30 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder:text-slate-500"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-sky-300 uppercase tracking-wider">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. robert@university.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-[#04091a] border border-sky-500/30 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder:text-slate-500"
                  />
                </div>

                {/* Initial Password */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-sky-300 uppercase tracking-wider">
                    INITIAL PASSWORD
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="teacher123"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-[#04091a] border border-sky-500/30 text-white text-xs font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>

                {/* Department */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-sky-300 uppercase tracking-wider">
                    DEPARTMENT
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-[#04091a] border border-sky-500/30 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer"
                  >
                    <option value="Computer Science" className="bg-[#04091a]">Computer Science</option>
                    <option value="Mathematics" className="bg-[#04091a]">Mathematics</option>
                    <option value="Physics" className="bg-[#04091a]">Physics</option>
                    <option value="Chemistry" className="bg-[#04091a]">Chemistry</option>
                    <option value="English Literature" className="bg-[#04091a]">English Literature</option>
                    <option value="Social Studies" className="bg-[#04091a]">Social Studies</option>
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30 transition-all mt-4 cursor-pointer"
                >
                  Create Teacher
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL EDIT: Edit Existing Teacher Details */}
      <AnimatePresence>
        {editingTeacher && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-lg bg-[#070e28] border border-sky-500/30 rounded-3xl p-8 shadow-2xl space-y-6 text-white"
            >
              {/* Close Button */}
              <button
                onClick={() => setEditingTeacher(null)}
                className="absolute top-6 right-6 p-2 rounded-full text-sky-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              {/* Modal Header */}
              <div>
                <h2 className="text-2xl font-black text-white">Edit Teacher Account</h2>
                <p className="text-xs font-semibold text-sky-200/70 mt-1">
                  Update details for {editingTeacher.name}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleEditSubmit} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-sky-300 uppercase tracking-wider">
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-[#04091a] border border-sky-500/30 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-sky-300 uppercase tracking-wider">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    required
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-[#04091a] border border-sky-500/30 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-sky-300 uppercase tracking-wider">
                    PASSWORD
                  </label>
                  <input
                    type="text"
                    value={editFormData.password}
                    onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-[#04091a] border border-sky-500/30 text-white text-xs font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>

                {/* Department */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-sky-300 uppercase tracking-wider">
                    DEPARTMENT
                  </label>
                  <select
                    value={editFormData.department}
                    onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-[#04091a] border border-sky-500/30 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer"
                  >
                    <option value="Computer Science" className="bg-[#04091a]">Computer Science</option>
                    <option value="Mathematics" className="bg-[#04091a]">Mathematics</option>
                    <option value="Physics" className="bg-[#04091a]">Physics</option>
                    <option value="Chemistry" className="bg-[#04091a]">Chemistry</option>
                    <option value="English Literature" className="bg-[#04091a]">English Literature</option>
                    <option value="Social Studies" className="bg-[#04091a]">Social Studies</option>
                  </select>
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-sky-300 uppercase tracking-wider">
                    ACCOUNT STATUS
                  </label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value as 'ACTIVE' | 'INACTIVE' })}
                    className="w-full px-4 py-3 rounded-2xl bg-[#04091a] border border-sky-500/30 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer"
                  >
                    <option value="ACTIVE" className="bg-[#04091a]">ACTIVE</option>
                    <option value="INACTIVE" className="bg-[#04091a]">INACTIVE</option>
                  </select>
                </div>

                {/* Save Changes Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30 transition-all mt-4 cursor-pointer"
                >
                  Save Changes
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Teacher Account Created! Success Modal */}
      <AnimatePresence>
        {showSuccessModal && recentlyCreatedTeacher && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-lg bg-[#070e28] border border-sky-500/30 rounded-3xl p-8 shadow-2xl space-y-6 text-white"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full text-sky-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              {/* Header */}
              <div>
                <h2 className="text-2xl font-black text-white">Create New Teacher</h2>
                <p className="text-xs font-semibold text-sky-200/70 mt-1">
                  Set teacher details and initial login password
                </p>
              </div>

              {/* Green Success Box */}
              <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-4">
                <div className="flex items-center gap-2.5 text-emerald-300 font-bold text-base">
                  <CheckCircle size={22} className="text-emerald-400" />
                  <span>Teacher Account Created!</span>
                </div>

                <div className="space-y-1.5 text-xs text-sky-200 font-medium">
                  <div>
                    <span className="font-bold text-white">Name:</span> {recentlyCreatedTeacher.name}
                  </div>
                  <div>
                    <span className="font-bold text-white">Email:</span> {recentlyCreatedTeacher.email}
                  </div>
                  <div>
                    <span className="font-bold text-white">Teacher ID:</span> {recentlyCreatedTeacher.id}
                  </div>
                </div>

                {/* Password Display Box */}
                <div className="p-3.5 bg-[#04091a] rounded-xl border border-emerald-500/40 font-mono text-xs font-bold text-white flex items-center gap-2">
                  <span className="text-sky-300/70 font-normal">Password:</span>
                  <span>{recentlyCreatedTeacher.password || 'teacher123'}</span>
                </div>

                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer transition-all"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: Teacher Profile & Assessments Drawer / View */}
      <AnimatePresence>
        {selectedTeacherProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-2xl bg-[#070e28] border border-sky-500/30 rounded-3xl p-8 shadow-2xl space-y-6 text-white max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedTeacherProfile(null)}
                className="absolute top-6 right-6 p-2 rounded-full text-sky-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              {/* Profile Top Banner */}
              <div className="flex items-center gap-4 border-b border-sky-500/20 pb-6">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
                  {selectedTeacherProfile.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black text-white">{selectedTeacherProfile.name}</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 border border-emerald-400/40 text-emerald-300">
                      {selectedTeacherProfile.status}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-sky-200/70 mt-0.5">{selectedTeacherProfile.email}</p>
                </div>
              </div>

              {/* Teacher Account Info Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-[#04091a] rounded-xl border border-sky-500/20">
                  <div className="text-[10px] font-extrabold uppercase text-sky-300/70">Department</div>
                  <div className="text-xs font-bold text-white mt-1">{selectedTeacherProfile.department}</div>
                </div>
                <div className="p-3 bg-[#04091a] rounded-xl border border-sky-500/20">
                  <div className="text-[10px] font-extrabold uppercase text-sky-300/70">Assigned Password</div>
                  <div className="text-xs font-mono font-bold text-indigo-400 mt-1">{selectedTeacherProfile.password || 'teacher123'}</div>
                </div>
                <div className="p-3 bg-[#04091a] rounded-xl border border-sky-500/20">
                  <div className="text-[10px] font-extrabold uppercase text-sky-300/70">Joined Date</div>
                  <div className="text-xs font-bold text-white mt-1">{selectedTeacherProfile.joinedDate}</div>
                </div>
                <div className="p-3 bg-[#04091a] rounded-xl border border-sky-500/20">
                  <div className="text-[10px] font-extrabold uppercase text-sky-300/70">Assessments Created</div>
                  <div className="text-xs font-bold text-sky-300 mt-1">
                    {getTeacherAssessments(selectedTeacherProfile.id).length} Total
                  </div>
                </div>
              </div>

              {/* Assessments List by Date & Time */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <BookOpen size={18} className="text-sky-400" />
                    <span>Assessments History & Schedule</span>
                  </h3>
                  <span className="text-xs font-medium text-sky-300/60">Date & Time Log</span>
                </div>

                <div className="space-y-3">
                  {getTeacherAssessments(selectedTeacherProfile.id).length === 0 ? (
                    <div className="p-6 bg-[#04091a] rounded-2xl text-center text-slate-400 text-xs font-medium border border-sky-500/20">
                      No assessments created yet by this teacher.
                    </div>
                  ) : (
                    getTeacherAssessments(selectedTeacherProfile.id).map((assessment) => (
                      <div
                        key={assessment.id}
                        className="p-4 rounded-2xl bg-[#04091a] border border-sky-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <h4 className="font-bold text-white text-sm">{assessment.title}</h4>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-sky-200/70 font-medium">
                            <span className="flex items-center gap-1">
                              <Calendar size={12} className="text-sky-400" />
                              {assessment.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={12} className="text-indigo-400" />
                              {assessment.time}
                            </span>
                            <span>{assessment.questionCount} Questions</span>
                            <span>{assessment.studentsParticipated} Students</span>
                          </div>
                        </div>

                        <span
                          className={`self-start sm:self-center px-3 py-1 rounded-full text-xs font-bold ${
                            assessment.status === 'Live'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
                              : 'bg-white/10 text-sky-200'
                          }`}
                        >
                          {assessment.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Bottom Action */}
              <div className="pt-4 border-t border-sky-500/20 flex justify-end">
                <button
                  onClick={() => setSelectedTeacherProfile(null)}
                  className="py-2.5 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer transition-colors"
                >
                  Close Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
