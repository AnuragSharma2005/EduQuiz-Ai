import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Trash2, Save, Play, Clock, HelpCircle, CheckCircle2 } from 'lucide-react';
import { useTeacherStore, TeacherAssessment, QuestionItem } from './teacherStore';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 my-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl font-black text-slate-900">Edit Assessment</h2>
            <p className="text-xs text-slate-500">Modify questions, options, or timer settings.</p>
          </div>

          <button
            onClick={() => setEditingAssessment(null)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Meta Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Assessment Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Category / Department</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Difficulty Level</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Question Timer (Seconds)</label>
            <select
              value={timePerQuestion}
              onChange={(e) => setTimePerQuestion(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value={15}>15 Seconds</option>
              <option value={20}>20 Seconds</option>
              <option value={30}>30 Seconds</option>
              <option value={60}>60 Seconds</option>
            </select>
          </div>
        </div>

        {/* Questions Section */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900">Questions ({questions.length})</h3>
            <button
              onClick={handleAddQuestion}
              className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Question</span>
            </button>
          </div>

          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
            {questions.map((q, qIdx) => (
              <div key={q.id || qIdx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-700">Question {qIdx + 1}</span>
                  <button
                    onClick={() => handleRemoveQuestion(qIdx)}
                    className="p-1 rounded text-rose-500 hover:bg-rose-100 cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Enter Question Text..."
                  value={q.text}
                  onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt, oIdx) => (
                    <div key={oIdx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct_${qIdx}`}
                        checked={q.correctAnswer === oIdx}
                        onChange={() => handleCorrectAnswerChange(qIdx, oIdx)}
                        className="cursor-pointer"
                      />
                      <input
                        type="text"
                        placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                        value={opt}
                        onChange={(e) => handleOptionTextChange(qIdx, oIdx, e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-200 pt-4">
          <button
            onClick={() => setEditingAssessment(null)}
            className="px-4 py-2 rounded-xl text-slate-500 font-bold text-xs hover:bg-slate-100 cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 cursor-pointer"
            >
              <Save size={14} />
              <span>Save Changes</span>
            </button>

            <button
              onClick={handleSaveAndHost}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center gap-2 cursor-pointer shadow-md shadow-blue-600/30"
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
