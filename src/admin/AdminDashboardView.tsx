import React from 'react';
import { motion } from 'motion/react';
import { Users, GraduationCap, BookOpen, Sparkles, Radio, RefreshCw, TrendingUp, BarChart2 } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { useAdminStore } from './adminStore';

const activityData = [
  { day: 'Mon', value: 12 },
  { day: 'Tue', value: 19 },
  { day: 'Wed', value: 15 },
  { day: 'Thu', value: 23 },
  { day: 'Fri', value: 27 },
  { day: 'Sat', value: 9 },
  { day: 'Sun', value: 8 },
];

const participationData = [
  { day: 'Mon', count: 300 },
  { day: 'Tue', count: 450 },
  { day: 'Wed', count: 400 },
  { day: 'Thu', count: 580 },
  { day: 'Fri', count: 670 },
  { day: 'Sat', count: 220 },
  { day: 'Sun', count: 190 },
];

export const AdminDashboardView: React.FC = () => {
  const { teachers, students, assessments } = useAdminStore();

  const totalTeachers = teachers.length;
  const totalStudents = students.length;
  const totalAssessments = assessments.length;
  const totalQuestions = assessments.reduce((acc, curr) => acc + curr.questionCount, 0);

  return (
    <div className="space-y-8">
      {/* Top Title & Sync Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin System Dashboard</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            System performance, statistics, and platform activity
          </p>
        </div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 text-xs font-semibold shadow-xs cursor-pointer"
        >
          <RefreshCw size={14} className="animate-spin text-blue-500" />
          <span>Live Backend Synchronized</span>
        </motion.div>
      </div>

      {/* 5 Stats Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Stat 1: Teachers */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users size={22} />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Teachers</div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{totalTeachers}</div>
          </div>
        </div>

        {/* Stat 2: Students */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <GraduationCap size={22} />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Students</div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{totalStudents}</div>
          </div>
        </div>

        {/* Stat 3: Assessments */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <BookOpen size={22} />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Assessments</div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{totalAssessments}</div>
          </div>
        </div>

        {/* Stat 4: Questions */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Sparkles size={22} />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Questions</div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{totalQuestions}</div>
          </div>
        </div>

        {/* Stat 5: Active Live */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4 col-span-2 sm:col-span-1">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <Radio size={22} className="animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Live</div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">3</div>
          </div>
        </div>
      </div>

      {/* 2 Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Assessment Activity Trend */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-600" />
              <h3 className="text-lg font-bold text-slate-900">Assessment Activity Trend</h3>
            </div>
            <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-lg">Weekly</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }}
                  itemStyle={{ color: '#60a5fa' }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={3.5}
                  dot={false}
                  activeDot={{ r: 6, fill: '#2563eb' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Student Participation Count */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart2 size={20} className="text-indigo-600" />
              <h3 className="text-lg font-bold text-slate-900">Student Participation Count</h3>
            </div>
            <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-lg">Weekly</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={participationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }}
                  itemStyle={{ color: '#818cf8' }}
                />
                <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
