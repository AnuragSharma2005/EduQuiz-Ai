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
    <div className="space-y-8 select-none">
      {/* Top Title & Sync Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Admin System Dashboard</h1>
          <p className="text-sm font-medium text-sky-200/70 mt-1">
            System performance, statistics, and platform activity
          </p>
        </div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500/10 border border-sky-400/30 text-sky-300 text-xs font-semibold shadow-md shadow-sky-950/20 cursor-pointer"
        >
          <RefreshCw size={14} className="animate-spin text-sky-400" />
          <span>Live Backend Synchronized</span>
        </motion.div>
      </div>

      {/* 5 Stats Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Stat 1: Teachers */}
        <div className="bg-[#070e28] rounded-2xl p-5 border border-sky-500/30 shadow-lg shadow-sky-950/30 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center shrink-0 border border-sky-400/30">
            <Users size={22} />
          </div>
          <div>
            <div className="text-xs font-semibold text-sky-300/70 uppercase tracking-wider">Teachers</div>
            <div className="text-2xl font-black text-white mt-0.5">{totalTeachers}</div>
          </div>
        </div>

        {/* Stat 2: Students */}
        <div className="bg-[#070e28] rounded-2xl p-5 border border-sky-500/30 shadow-lg shadow-sky-950/30 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0 border border-blue-400/30">
            <GraduationCap size={22} />
          </div>
          <div>
            <div className="text-xs font-semibold text-sky-300/70 uppercase tracking-wider">Students</div>
            <div className="text-2xl font-black text-white mt-0.5">{totalStudents}</div>
          </div>
        </div>

        {/* Stat 3: Assessments */}
        <div className="bg-[#070e28] rounded-2xl p-5 border border-sky-500/30 shadow-lg shadow-sky-950/30 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-400/30">
            <BookOpen size={22} />
          </div>
          <div>
            <div className="text-xs font-semibold text-sky-300/70 uppercase tracking-wider">Assessments</div>
            <div className="text-2xl font-black text-white mt-0.5">{totalAssessments}</div>
          </div>
        </div>

        {/* Stat 4: Questions */}
        <div className="bg-[#070e28] rounded-2xl p-5 border border-sky-500/30 shadow-lg shadow-sky-950/30 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-400/30">
            <Sparkles size={22} />
          </div>
          <div>
            <div className="text-xs font-semibold text-sky-300/70 uppercase tracking-wider">Questions</div>
            <div className="text-2xl font-black text-white mt-0.5">{totalQuestions}</div>
          </div>
        </div>

        {/* Stat 5: Active Live */}
        <div className="bg-[#070e28] rounded-2xl p-5 border border-sky-500/30 shadow-lg shadow-sky-950/30 flex items-center gap-4 col-span-2 sm:col-span-1">
          <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center shrink-0 border border-rose-400/30">
            <Radio size={22} className="animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-semibold text-sky-300/70 uppercase tracking-wider">Active Live</div>
            <div className="text-2xl font-black text-white mt-0.5">3</div>
          </div>
        </div>
      </div>

      {/* 2 Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Assessment Activity Trend */}
        <div className="bg-[#070e28] rounded-3xl p-6 border border-sky-500/30 shadow-2xl shadow-sky-950/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp size={20} className="text-sky-400" />
              <h3 className="text-lg font-bold text-white">Assessment Activity Trend</h3>
            </div>
            <span className="text-xs font-semibold text-sky-300 bg-sky-500/10 px-3 py-1 rounded-lg border border-sky-500/20">Weekly</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(56, 189, 248, 0.1)" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#7dd3fc', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#7dd3fc', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#04091a', borderRadius: '12px', borderColor: 'rgba(56,189,248,0.4)', color: '#fff' }}
                  itemStyle={{ color: '#38bdf8' }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#38bdf8"
                  strokeWidth={3.5}
                  dot={false}
                  activeDot={{ r: 6, fill: '#0284c7' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Student Participation Count */}
        <div className="bg-[#070e28] rounded-3xl p-6 border border-sky-500/30 shadow-2xl shadow-sky-950/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart2 size={20} className="text-blue-400" />
              <h3 className="text-lg font-bold text-white">Student Participation Count</h3>
            </div>
            <span className="text-xs font-semibold text-sky-300 bg-sky-500/10 px-3 py-1 rounded-lg border border-sky-500/20">Weekly</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={participationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(56, 189, 248, 0.1)" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#7dd3fc', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#7dd3fc', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#04091a', borderRadius: '12px', borderColor: 'rgba(56,189,248,0.4)', color: '#fff' }}
                  itemStyle={{ color: '#60a5fa' }}
                />
                <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
