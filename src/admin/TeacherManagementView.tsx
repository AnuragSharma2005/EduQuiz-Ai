import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, Edit2, Trash2, X, CheckCircle, Eye, Calendar, Clock, BookOpen, User, Lock, Mail, Building } from 'lucide-react';
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
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Teacher Management</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Create and manage faculty teacher accounts across departments
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-600/30 transition-all"
        >
          <Plus size={18} />
          <span>Create Teacher Account</span>
        </motion.button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-6">
        {/* Search & Counter Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search teachers by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-slate-400 font-medium"
            />
          </div>

          <span className="text-xs font-bold text-slate-400">
            {filteredTeachers.length} {filteredTeachers.length === 1 ? 'Teacher' : 'Teachers'}
          </span>
        </div>

        {/* Teachers Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                <th className="py-4 px-4">TEACHER ID</th>
                <th className="py-4 px-4">NAME</th>
                <th className="py-4 px-4">EMAIL</th>
                <th className="py-4 px-4">DEPARTMENT</th>
                <th className="py-4 px-4">STATUS</th>
                <th className="py-4 px-4">JOINED DATE</th>
                <th className="py-4 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredTeachers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">
                    No teachers found. Click "Create Teacher Account" to add one.
                  </td>
                </tr>
              ) : (
                filteredTeachers.map((teacher) => (
                  <tr
                    key={teacher.id}
                    onClick={() => setSelectedTeacherProfile(teacher)}
                    className="group hover:bg-slate-50/80 transition-colors cursor-pointer"
                  >
                    {/* ID */}
                    <td className="py-4 px-4 font-mono text-xs text-slate-400">
                      {teacher.id.substring(0, 10)}...
                    </td>

                    {/* Name with Avatar */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                          {teacher.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {teacher.name}
                        </span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-4 px-4 text-slate-500 font-medium">{teacher.email}</td>

                    {/* Department */}
                    <td className="py-4 px-4 text-slate-600 font-medium">{teacher.department}</td>

                    {/* Status Pill */}
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                        {teacher.status}
                      </span>
                    </td>

                    {/* Joined Date */}
                    <td className="py-4 px-4 text-slate-500 font-medium">{teacher.joinedDate}</td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <div
                        className="flex items-center justify-end gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => setSelectedTeacherProfile(teacher)}
                          title="View Profile & Assessments"
                          className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(teacher)}
                          title="Edit Teacher"
                          className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => deleteTeacher(teacher.id)}
                          title="Delete Teacher"
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
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

      {/* MODAL 1: Create New Teacher (Image 4) */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl space-y-6"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowCreateModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>

              {/* Modal Header */}
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">Create New Teacher</h2>
                <p className="text-xs font-medium text-slate-400 mt-1">
                  Set teacher details and initial login password
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Robert Miller"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-slate-400"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. robert@university.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-slate-400"
                  />
                </div>

                {/* Initial Password */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    INITIAL PASSWORD
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="teacher123"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {/* Department */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    DEPARTMENT
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="English Literature">English Literature</option>
                    <option value="Social Studies">Social Studies</option>
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-600/30 transition-all mt-4"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl space-y-6"
            >
              {/* Close Button */}
              <button
                onClick={() => setEditingTeacher(null)}
                className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              {/* Modal Header */}
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">Edit Teacher Account</h2>
                <p className="text-xs font-medium text-slate-400 mt-1">
                  Update details for {editingTeacher.name}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleEditSubmit} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    required
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    PASSWORD
                  </label>
                  <input
                    type="text"
                    value={editFormData.password}
                    onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {/* Department */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    DEPARTMENT
                  </label>
                  <select
                    value={editFormData.department}
                    onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="English Literature">English Literature</option>
                    <option value="Social Studies">Social Studies</option>
                  </select>
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    ACCOUNT STATUS
                  </label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value as 'ACTIVE' | 'INACTIVE' })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>

                {/* Save Changes Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-600/30 transition-all mt-4 cursor-pointer"
                >
                  Save Changes
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Teacher Account Created! Success Modal (Image 5) */}
      <AnimatePresence>
        {showSuccessModal && recentlyCreatedTeacher && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl space-y-6"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>

              {/* Header */}
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">Create New Teacher</h2>
                <p className="text-xs font-medium text-slate-400 mt-1">
                  Set teacher details and initial login password
                </p>
              </div>

              {/* Green Success Box */}
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200/80 space-y-4">
                <div className="flex items-center gap-2.5 text-emerald-800 font-bold text-base">
                  <CheckCircle size={22} className="text-emerald-600" />
                  <span>Teacher Account Created!</span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-700 font-medium">
                  <div>
                    <span className="font-bold">Name:</span> {recentlyCreatedTeacher.name}
                  </div>
                  <div>
                    <span className="font-bold">Email:</span> {recentlyCreatedTeacher.email}
                  </div>
                  <div>
                    <span className="font-bold">Teacher ID:</span> {recentlyCreatedTeacher.id}
                  </div>
                </div>

                {/* Password Display Box */}
                <div className="p-3.5 bg-white rounded-xl border border-emerald-300 font-mono text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-slate-500 font-normal">Password:</span>
                  <span>{recentlyCreatedTeacher.password || 'teacher123'}</span>
                </div>

                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm transition-all"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedTeacherProfile(null)}
                className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>

              {/* Profile Top Banner */}
              <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                  {selectedTeacherProfile.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black text-slate-900">{selectedTeacherProfile.name}</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                      {selectedTeacherProfile.status}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-500">{selectedTeacherProfile.email}</p>
                </div>
              </div>

              {/* Teacher Account Info Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                  <div className="text-[10px] font-extrabold uppercase text-slate-400">Department</div>
                  <div className="text-xs font-bold text-slate-900 mt-1">{selectedTeacherProfile.department}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                  <div className="text-[10px] font-extrabold uppercase text-slate-400">Assigned Password</div>
                  <div className="text-xs font-mono font-bold text-blue-600 mt-1">{selectedTeacherProfile.password || 'teacher123'}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                  <div className="text-[10px] font-extrabold uppercase text-slate-400">Joined Date</div>
                  <div className="text-xs font-bold text-slate-900 mt-1">{selectedTeacherProfile.joinedDate}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                  <div className="text-[10px] font-extrabold uppercase text-slate-400">Assessments Created</div>
                  <div className="text-xs font-bold text-purple-600 mt-1">
                    {getTeacherAssessments(selectedTeacherProfile.id).length} Total
                  </div>
                </div>
              </div>

              {/* Assessments List by Date & Time */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen size={18} className="text-blue-600" />
                    <span>Assessments History & Schedule</span>
                  </h3>
                  <span className="text-xs font-medium text-slate-400">Date & Time Log</span>
                </div>

                <div className="space-y-3">
                  {getTeacherAssessments(selectedTeacherProfile.id).length === 0 ? (
                    <div className="p-6 bg-slate-50 rounded-2xl text-center text-slate-400 text-sm font-medium">
                      No assessments created yet by this teacher.
                    </div>
                  ) : (
                    getTeacherAssessments(selectedTeacherProfile.id).map((assessment) => (
                      <div
                        key={assessment.id}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <h4 className="font-bold text-slate-900 text-sm">{assessment.title}</h4>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                            <span className="flex items-center gap-1">
                              <Calendar size={12} className="text-blue-500" />
                              {assessment.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={12} className="text-purple-500" />
                              {assessment.time}
                            </span>
                            <span>{assessment.questionCount} Questions</span>
                            <span>{assessment.studentsParticipated} Students</span>
                          </div>
                        </div>

                        <span
                          className={`self-start sm:self-center px-3 py-1 rounded-full text-xs font-bold ${
                            assessment.status === 'Live'
                              ? 'bg-rose-100 text-rose-700 animate-pulse'
                              : 'bg-slate-200 text-slate-700'
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
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setSelectedTeacherProfile(null)}
                  className="py-2.5 px-6 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
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
