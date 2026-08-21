import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Save, Plus, Trash2, CheckCircle2, Clock, HelpCircle, Sparkles } from 'lucide-react';
import { useTeacherStore, QuestionItem } from './teacherStore';

export const CreateAssessmentView: React.FC = () => {
  const { setSelectedTab, createAssessment, startLiveSession } = useTeacherStore();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Computer Science');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [timePerQuestion, setTimePerQuestion] = useState<number>(60);

  const [questions, setQuestions] = useState<QuestionItem[]>([
    {
      id: 'q_1',
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      timeLimit: 60,
    },
  ]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: 'q_' + (questions.length + 1),
        text: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        timeLimit: timePerQuestion,
      },
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    if (questions.length <= 1) return;
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionTextChange = (index: number, text: string) => {
    const updated = [...questions];
    updated[index].text = text;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex: number, optIndex: number, text: string) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = text;
    setQuestions(updated);
  };

  const handleSelectCorrectAnswer = (qIndex: number, optIndex: number) => {
    const updated = [...questions];
    updated[qIndex].correctAnswer = optIndex;
    setQuestions(updated);
  };

  const handleSaveAndHost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Validate that questions have text and options
    const formattedQuestions = questions.map((q, idx) => ({
      ...q,
      text: q.text || `Sample Question ${idx + 1}`,
      options: q.options.map((opt, oIdx) => opt || `Option ${oIdx + 1}`),
      timeLimit: timePerQuestion,
    }));

    const created = createAssessment({
      title,
      category: category.toUpperCase(),
      difficulty,
      timePerQuestion,
      questions: formattedQuestions,
    });

    startLiveSession(created.id);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Header & Save Button (Matching Image 2) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedTab('dashboard')}
            className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              CREATE QUIZ
            </h1>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              Build your custom battle arena & assessments
            </p>
          </div>
        </div>

        <button
          onClick={handleSaveAndHost}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 transition-all cursor-pointer"
        >
          <Save size={18} />
          <span>Save & Host</span>
        </button>
      </div>

      {/* Main Form Box (Dark theme matching Image 2 style) */}
      <form onSubmit={handleSaveAndHost} className="space-y-6">
        <div className="bg-[#121624] text-white rounded-3xl p-8 border border-indigo-500/20 shadow-2xl space-y-6">
          {/* Inputs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Title */}
            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs font-extrabold tracking-wider uppercase text-slate-400">
                QUIZ TITLE
              </label>
              <input
                type="text"
                required
                placeholder="Enter a catchy title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[#1c2237] border border-slate-700/60 text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-500"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold tracking-wider uppercase text-slate-400">
                CATEGORY
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[#1c2237] border border-slate-700/60 text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="General Knowledge">General Knowledge</option>
              </select>
            </div>

            {/* Difficulty & Timer */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <label className="block text-xs font-extrabold tracking-wider uppercase text-slate-400">
                  DIFFICULTY
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full px-3 py-3 rounded-2xl bg-[#1c2237] border border-slate-700/60 text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-extrabold tracking-wider uppercase text-slate-400">
                  TIMER / Q
                </label>
                <select
                  value={timePerQuestion}
                  onChange={(e) => setTimePerQuestion(Number(e.target.value))}
                  className="w-full px-3 py-3 rounded-2xl bg-[#1c2237] border border-slate-700/60 text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value={15}>15s</option>
                  <option value={30}>30s</option>
                  <option value={60}>60s</option>
                  <option value={90}>90s</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dynamic Question Blocks */}
          <div className="space-y-6 pt-4 border-t border-slate-800">
            {questions.map((q, qIndex) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#181e33] border border-slate-700/60 rounded-3xl p-6 space-y-5 relative"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
                      {qIndex + 1}
                    </span>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                      QUESTION
                    </span>
                  </div>

                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(qIndex)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                {/* Question Input */}
                <input
                  type="text"
                  placeholder="What's the question?"
                  value={q.text}
                  onChange={(e) => handleQuestionTextChange(qIndex, e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl bg-[#121624] border border-slate-700/60 text-white text-base font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-500"
                />

                {/* 4 Options Grid (Matching Image 2 style) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {q.options.map((optText, optIndex) => {
                    const isCorrect = q.correctAnswer === optIndex;
                    return (
                      <div key={optIndex} className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleSelectCorrectAnswer(qIndex, optIndex)}
                          title="Set as correct option"
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                            isCorrect
                              ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-lg shadow-emerald-500/30'
                              : 'bg-[#121624] border border-slate-700 text-slate-400 hover:text-white'
                          }`}
                        >
                          {isCorrect ? <CheckCircle2 size={20} /> : <HelpCircle size={18} />}
                        </button>
                        <input
                          type="text"
                          placeholder={`Option ${optIndex + 1}`}
                          value={optText}
                          onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                          className={`w-full px-4 py-3 rounded-2xl bg-[#121624] border text-white text-sm font-medium focus:outline-none transition-all placeholder-slate-500 ${
                            isCorrect
                              ? 'border-emerald-500/80 ring-1 ring-emerald-500/50'
                              : 'border-slate-700/60 focus:border-indigo-500'
                          }`}
                        />
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Add Question Trigger */}
          <button
            type="button"
            onClick={handleAddQuestion}
            className="w-full py-4 rounded-2xl bg-[#1c2237] hover:bg-[#252d47] border border-dashed border-slate-600 text-indigo-300 font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus size={18} />
            <span>Add Another Question</span>
          </button>
        </div>
      </form>
    </div>
  );
};
