import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Trash2, Save, Play } from 'lucide-react';
import { useTeacherStore, QuestionItem } from './teacherStore';

export const EditAssessmentModal: React.FC = () => {
  const { editingAssessment, setEditingAssessment, updateAssessment, startLiveSession } = useTeacherStore();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [timePerQuestion, setTimePerQuestion] = useState(20);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);

  useEffect(() => {
    if (editingAssessment) {
      setTitle(editingAssessment.title);
      setCategory(editingAssessment.category);
      setDifficulty(editingAssessment.difficulty);
      setTimePerQuestion(editingAssessment.timePerQuestion || 20);
      setQuestions(editingAssessment.questions || []);
    }
  }, [editingAssessment]);

  if (!editingAssessment) return null;

  const handleAddQuestion = () => {
    const newQ: QuestionItem = {
      id: 'q_' + Math.random().toString(36).substring(2, 7),
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      timeLimit: timePerQuestion,
    };
    setQuestions([...questions, newQ]);
  };

  const handleRemoveQuestion = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleQuestionTextChange = (idx: number, text: string) => {
    const updated = [...questions];
    updated[idx].text = text;
    setQuestions(updated);
  };

  const handleOptionTextChange = (qIdx: number, oIdx: number, val: string) => {
    const updated = [...questions];
    updated[qIdx].options[oIdx] = val;
    setQuestions(updated);
  };

  const handleCorrectAnswerChange = (qIdx: number, oIdx: number) => {
    const updated = [...questions];
    updated[qIdx].correctAnswer = oIdx;
    setQuestions(updated);
  };

  const handleSave = () => {
    updateAssessment(editingAssessment.id, {
      title,
      category,
      difficulty,
      timePerQuestion,
      questions,
    });
  };

  const handleSaveAndHost = () => {
    handleSave();
    startLiveSession(editingAssessment.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020512]/92 backdrop-blur-2xl overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#070e28] rounded-3xl max-w-3xl w-full border border-sky-500/30 shadow-2xl p-6 sm:p-8 space-y-6 my-8 text-white relative overflow-hidden"
      >
        {/* Sky Blue Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-sky-500/20 pb-4 relative z-10">
          <div>
            <h2 className="text-xl font-black text-white">Edit Assessment</h2>
            <p className="text-xs text-sky-200/70">Modify questions, options, or timer settings.</p>
          </div>

          <button
            onClick={() => setEditingAssessment(null)}
            className="p-2 rounded-xl bg-white/5 border border-sky-500/20 text-sky-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Meta Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
          <div>
            <label className="text-xs font-bold text-sky-300 block mb-1">Assessment Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#04091a] border border-sky-500/30 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-sky-300 block mb-1">Category / Department</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#04091a] border border-sky-500/30 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-sky-300 block mb-1">Difficulty Level</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#04091a] border border-sky-500/30 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              <option value="Easy" className="bg-[#04091a]">Easy</option>
              <option value="Medium" className="bg-[#04091a]">Medium</option>
              <option value="Hard" className="bg-[#04091a]">Hard</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-sky-300 block mb-1">Question Timer (Seconds)</label>
            <select
              value={timePerQuestion}
              onChange={(e) => setTimePerQuestion(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl bg-[#04091a] border border-sky-500/30 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              <option value={15} className="bg-[#04091a]">15 Seconds</option>
              <option value={20} className="bg-[#04091a]">20 Seconds</option>
              <option value={30} className="bg-[#04091a]">30 Seconds</option>
              <option value={60} className="bg-[#04091a]">60 Seconds</option>
            </select>
          </div>
        </div>

        {/* Questions Section */}
        <div className="space-y-4 pt-2 relative z-10">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white">Questions ({questions.length})</h3>
            <button
              onClick={handleAddQuestion}
              className="px-3.5 py-1.5 rounded-xl bg-sky-500/15 border border-sky-400/30 text-sky-300 hover:bg-sky-500/25 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Question</span>
            </button>
          </div>

          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1 scrollbar-hide">
            {questions.map((q, qIdx) => (
              <div key={q.id || qIdx} className="p-4 rounded-2xl border border-sky-500/25 bg-[#04091a] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-sky-300">Question {qIdx + 1}</span>
                  <button
                    onClick={() => handleRemoveQuestion(qIdx)}
                    className="p-1.5 rounded-lg bg-rose-950/40 text-rose-400 hover:bg-rose-900/60 border border-rose-800/40 cursor-pointer"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Enter Question Text..."
                  value={q.text}
                  onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#070e28] border border-sky-500/30 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder:text-slate-500"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt, oIdx) => (
                    <div key={oIdx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct_${qIdx}`}
                        checked={q.correctAnswer === oIdx}
                        onChange={() => handleCorrectAnswerChange(qIdx, oIdx)}
                        className="cursor-pointer accent-sky-400"
                      />
                      <input
                        type="text"
                        placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                        value={opt}
                        onChange={(e) => handleOptionTextChange(qIdx, oIdx, e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#070e28] border border-sky-500/30 text-white text-xs font-semibold focus:outline-none focus:border-sky-400 placeholder:text-slate-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-sky-500/20 pt-4 relative z-10">
          <button
            onClick={() => setEditingAssessment(null)}
            className="px-4 py-2 rounded-xl text-sky-300 font-bold text-xs hover:bg-white/5 cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-sky-300 font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Save size={14} />
              <span>Save Changes</span>
            </button>

            <button
              onClick={handleSaveAndHost}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-600/30 transition-all"
            >
              <Play size={14} className="fill-white" />
              <span>Re-Host Live Quiz</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
