import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Building, Award, Edit, Save, CheckCircle2, Phone, BookOpen, Users, Sparkles } from 'lucide-react';
import { useTeacherStore } from './teacherStore';

export const TeacherProfileView: React.FC = () => {
  const { currentTeacher, updateTeacherProfile, assessments, sessionHistory } = useTeacherStore();

  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form State
  const [name, setName] = useState(currentTeacher?.name || '');
  const [email, setEmail] = useState(currentTeacher?.email || '');
  const [department, setDepartment] = useState(currentTeacher?.department || '');
  const [title, setTitle] = useState(currentTeacher?.title || 'Senior Associate Professor');
  const [phone, setPhone] = useState(currentTeacher?.phone || '+1 (555) 234-5678');
  const [bio, setBio] = useState(
    currentTeacher?.bio ||
      'Passionate about AI algorithms, interactive classroom learning, and real-time student gamification.'
  );

  const handleSave = () => {
    updateTeacherProfile({
      name,
      email,
      department,
      title,
      phone,
      bio,
    });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const totalAssessments = assessments.length;
  const totalSessions = sessionHistory.length;
  const totalStudents = assessments.reduce((acc, a) => acc + (a.enrolledStudentsCount || 0), 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#070e28] via-[#0a1436] to-[#04091a] rounded-3xl p-6 sm:p-8 text-white border border-sky-500/30 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden backdrop-blur-2xl">
        <div className="absolute right-0 top-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-5 relative z-10">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-sky-500/15 text-sky-300 font-black text-3xl sm:text-4xl flex items-center justify-center border-2 border-sky-400/40 shadow-2xl shrink-0">
            {currentTeacher?.name?.charAt(0) || 'D'}
          </div>

          <div>
            <div className="px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-[10px] font-black uppercase tracking-wider inline-block">
              {currentTeacher?.title || 'Senior Associate Professor'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1.5">
              {currentTeacher?.name}
            </h1>
            <p className="text-xs text-sky-200/70 font-medium mt-0.5">{currentTeacher?.email}</p>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-5 py-2.5 rounded-2xl font-extrabold text-xs transition-all flex items-center gap-2 cursor-pointer shrink-0 relative z-10 ${
            isEditing
              ? 'bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
          }`}
        >
          <Edit size={16} />
          <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
        </button>
      </div>

      {/* Success Notification Banner */}
      {savedSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-black flex items-center gap-2 shadow-xs"
        >
          <CheckCircle2 size={18} />
          <span>Profile changes saved successfully!</span>
        </motion.div>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#070e28]/90 rounded-2xl p-5 border border-sky-500/30 shadow-lg shadow-sky-950/30 backdrop-blur-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/15 border border-sky-400/40 text-sky-300 flex items-center justify-center font-bold">
            <BookOpen size={22} />
          </div>
          <div>
            <div className="text-[10px] font-extrabold text-sky-300/80 uppercase">QUIZZES CREATED</div>
            <div className="text-2xl font-black text-white">{totalAssessments}</div>
          </div>
        </div>

        <div className="bg-[#070e28]/90 rounded-2xl p-5 border border-sky-500/30 shadow-lg shadow-sky-950/30 backdrop-blur-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-400/40 text-indigo-300 flex items-center justify-center font-bold">
            <Sparkles size={22} />
          </div>
          <div>
            <div className="text-[10px] font-extrabold text-indigo-300/80 uppercase">SESSIONS HOSTED</div>
            <div className="text-2xl font-black text-indigo-300">{totalSessions}</div>
          </div>
        </div>

        <div className="bg-[#070e28]/90 rounded-2xl p-5 border border-sky-500/30 shadow-lg shadow-sky-950/30 backdrop-blur-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 flex items-center justify-center font-bold">
            <Users size={22} />
          </div>
          <div>
            <div className="text-[10px] font-extrabold text-emerald-300/80 uppercase">ENROLLED STUDENTS</div>
            <div className="text-2xl font-black text-emerald-400">{totalStudents}</div>
          </div>
        </div>
      </div>

      {/* Profile Details Card / Edit Form */}
      <div className="bg-[#070e28]/90 rounded-3xl p-6 sm:p-8 border border-sky-500/30 shadow-xl shadow-sky-950/40 backdrop-blur-2xl space-y-6 text-white">
        <div className="flex items-center justify-between border-b border-sky-500/20 pb-4">
          <h2 className="text-lg font-black text-white">Personal & Academic Details</h2>
          <span className="text-xs font-bold text-sky-300/70">Teacher ID: {currentTeacher?.id}</span>
        </div>

        {isEditing ? (
          /* Edit Profile Form */
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-sky-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#04091a] border border-sky-500/30 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-sky-300 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#04091a] border border-sky-500/30 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-sky-300 block mb-1">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#04091a] border border-sky-500/30 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-sky-300 block mb-1">Academic Title / Designation</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#04091a] border border-sky-500/30 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-sky-300 block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#04091a] border border-sky-500/30 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-sky-300 block mb-1">Professional Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#04091a] border border-sky-500/30 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl text-sky-300 font-bold text-xs hover:bg-white/5 cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-md shadow-indigo-600/30 flex items-center gap-2 cursor-pointer"
              >
                <Save size={16} />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </div>
        ) : (
          /* View Profile Details */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#04091a] border border-sky-500/25">
                <User size={18} className="text-sky-400 shrink-0" />
                <div>
                  <div className="text-[10px] font-bold text-sky-300/70 uppercase">FULL NAME</div>
                  <div className="text-xs font-black text-white">{currentTeacher?.name}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#04091a] border border-sky-500/25">
                <Mail size={18} className="text-sky-400 shrink-0" />
                <div>
                  <div className="text-[10px] font-bold text-sky-300/70 uppercase">EMAIL ADDRESS</div>
                  <div className="text-xs font-black text-white">{currentTeacher?.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#04091a] border border-sky-500/25">
                <Phone size={18} className="text-sky-400 shrink-0" />
                <div>
                  <div className="text-[10px] font-bold text-sky-300/70 uppercase">PHONE</div>
                  <div className="text-xs font-black text-white">{currentTeacher?.phone || '+1 (555) 234-5678'}</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#04091a] border border-sky-500/25">
                <Building size={18} className="text-sky-400 shrink-0" />
                <div>
                  <div className="text-[10px] font-bold text-sky-300/70 uppercase">DEPARTMENT</div>
                  <div className="text-xs font-black text-white">{currentTeacher?.department}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#04091a] border border-sky-500/25">
                <Award size={18} className="text-sky-400 shrink-0" />
                <div>
                  <div className="text-[10px] font-bold text-sky-300/70 uppercase">TITLE / ROLE</div>
                  <div className="text-xs font-black text-white">
                    {currentTeacher?.title || 'Senior Associate Professor'}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#04091a] border border-sky-500/25 space-y-1">
                <div className="text-[10px] font-bold text-sky-300/70 uppercase">BIO & MISSION</div>
                <div className="text-xs font-semibold text-sky-200/80 leading-relaxed">
                  {currentTeacher?.bio ||
                    'Passionate about AI algorithms, interactive classroom learning, and real-time student gamification.'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
