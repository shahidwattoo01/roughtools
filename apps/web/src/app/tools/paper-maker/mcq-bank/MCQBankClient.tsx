'use client';

import { useState, useMemo, useEffect } from 'react';
import { SUBJECTS } from '../data/boards';
import { QUESTIONS } from '../data/questions';
import type { Question } from '../data/questions';
import type { Difficulty, QuestionType } from '../data/boards';
import {
  loadCustomQuestions,
  saveCustomQuestion,
  updateCustomQuestion,
  deleteCustomQuestion,
  isCustomQuestion,
} from '../data/customQuestions';

const ALL_CLASSES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

interface FormState {
  type: QuestionType;
  question: string;
  optA: string;
  optB: string;
  optC: string;
  optD: string;
  answer: string;
  chapter: number;
  topic: string;
  difficulty: Difficulty;
  imageUrl: string;
}

const emptyForm = (): FormState => ({
  type: 'mcq',
  question: '',
  optA: '',
  optB: '',
  optC: '',
  optD: '',
  answer: 'A',
  chapter: 1,
  topic: '',
  difficulty: 'medium',
  imageUrl: '',
});

export default function MCQBankClient() {
  const [classLevel, setClassLevel] = useState<number>(9);
  const [subjectId, setSubjectId] = useState('physics');
  const [chapter, setChapter] = useState<number>(0);
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all');
  const [search, setSearch] = useState('');
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [customQuestions, setCustomQuestions] = useState<Question[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());

  useEffect(() => {
    setCustomQuestions(loadCustomQuestions());
  }, []);

  const subject = SUBJECTS.find((s) => s.id === subjectId);
  const subjects = SUBJECTS.filter((s) =>
    s.classes.includes(classLevel as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12)
  );

  const allQuestions = useMemo(() => {
    const custom = customQuestions.filter(
      (q) => q.classLevel === classLevel && q.subjectId === subjectId
    );
    const builtin = QUESTIONS.filter(
      (q) => q.classLevel === classLevel && q.subjectId === subjectId
    );
    return [...custom, ...builtin];
  }, [classLevel, subjectId, customQuestions]);

  const filtered = useMemo(() => {
    return allQuestions.filter(
      (q) =>
        q.type === 'mcq' &&
        (chapter === 0 || q.chapter === chapter) &&
        (difficulty === 'all' || q.difficulty === difficulty) &&
        (search === '' || q.question.toLowerCase().includes(search.toLowerCase()))
    );
  }, [allQuestions, chapter, difficulty, search]);

  const builtinCount = filtered.filter((q) => !isCustomQuestion(q.id)).length;
  const customCount = filtered.filter((q) => isCustomQuestion(q.id)).length;

  const toggle = (id: string) =>
    setRevealed((prev) => {
      const n = new Set(prev);
      if (n.has(id)) {
        n.delete(id);
      } else {
        n.add(id);
      }
      return n;
    });

  const revealAll = () => setRevealed(new Set(filtered.map((q) => q.id)));
  const hideAll = () => setRevealed(new Set());

  const openAdd = () => {
    setEditingId(null);
    setForm({ ...emptyForm(), chapter: subject?.chapters[0]?.number ?? 1 });
    setFormOpen(true);
  };

  const openEdit = (q: Question) => {
    setEditingId(q.id);
    setForm({
      type: q.type,
      question: q.question,
      optA: q.options?.[0] ?? '',
      optB: q.options?.[1] ?? '',
      optC: q.options?.[2] ?? '',
      optD: q.options?.[3] ?? '',
      answer: q.answer,
      chapter: q.chapter,
      topic: q.topic,
      difficulty: q.difficulty,
      imageUrl: q.imageUrl ?? '',
    });
    setFormOpen(true);
  };

  const handleSave = () => {
    if (!form.question.trim()) return;
    const options =
      form.type === 'mcq'
        ? [form.optA, form.optB, form.optC, form.optD].filter(Boolean)
        : undefined;

    if (editingId && isCustomQuestion(editingId)) {
      updateCustomQuestion(editingId, {
        type: form.type,
        question: form.question,
        options,
        answer: form.answer,
        chapter: form.chapter,
        topic: form.topic,
        difficulty: form.difficulty,
        imageUrl: form.imageUrl || undefined,
      });
    } else if (!editingId) {
      saveCustomQuestion({
        classLevel: classLevel as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12,
        subjectId,
        chapter: form.chapter,
        topic: form.topic,
        type: form.type,
        difficulty: form.difficulty,
        marks: form.type === 'mcq' ? 1 : form.type === 'short' ? 3 : 8,
        medium: 'english',
        question: form.question,
        answer: form.answer,
        options,
        imageUrl: form.imageUrl || undefined,
      });
    }
    setCustomQuestions(loadCustomQuestions());
    setFormOpen(false);
    setEditingId(null);
    setForm(emptyForm());
  };

  const handleDelete = (id: string) => {
    if (!isCustomQuestion(id)) return;
    deleteCustomQuestion(id);
    setCustomQuestions(loadCustomQuestions());
  };

  const diffColor: Record<string, string> = {
    easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    hard: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <div className="min-h-screen bg-[#f5f5f3] dark:bg-[#121212]">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-900 via-blue-800 to-sky-900 text-white px-4 py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight">MCQ Question Bank</h1>
            <p className="text-white/60 text-sm mt-1">
              Browse and filter MCQs for Pakistani board exams — Classes 1–12
            </p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl text-sm transition-colors"
          >
            <span className="text-lg leading-none">+</span> Add Question
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
        {/* Add/Edit Form */}
        {formOpen && (
          <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border-2 border-green-400 dark:border-green-600 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-900 dark:text-white text-lg">
                {editingId ? 'Edit Question' : 'Add New Question'}
              </h2>
              <button
                onClick={() => {
                  setFormOpen(false);
                  setEditingId(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as QuestionType }))}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="mcq">MCQ</option>
                  <option value="short">Short</option>
                  <option value="long">Long</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Chapter</label>
                <select
                  value={form.chapter}
                  onChange={(e) => setForm((f) => ({ ...f, chapter: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {subject?.chapters.map((ch) => (
                    <option key={ch.number} value={ch.number}>
                      Ch.{ch.number}: {ch.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Difficulty</label>
                <select
                  value={form.difficulty}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, difficulty: e.target.value as Difficulty }))
                  }
                  className="w-full px-3 py-2 border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Topic</label>
                <input
                  type="text"
                  value={form.topic}
                  onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value }))}
                  placeholder="e.g. Newton's laws"
                  className="w-full px-3 py-2 border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Question Text
              </label>
              <textarea
                value={form.question}
                onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
                rows={3}
                placeholder="Enter question text..."
                className="w-full px-3 py-2 border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            {form.type === 'mcq' && (
              <div className="grid grid-cols-2 gap-3">
                {(['A', 'B', 'C', 'D'] as const).map((label, i) => (
                  <div key={label}>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      Option {label}
                    </label>
                    <input
                      type="text"
                      value={[form.optA, form.optB, form.optC, form.optD][i]}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (label === 'A') setForm((f) => ({ ...f, optA: val }));
                        else if (label === 'B') setForm((f) => ({ ...f, optB: val }));
                        else if (label === 'C') setForm((f) => ({ ...f, optC: val }));
                        else setForm((f) => ({ ...f, optD: val }));
                      }}
                      placeholder={`Option ${label}`}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">
                  Correct Answer {form.type === 'mcq' ? '(A/B/C/D)' : ''}
                </label>
                {form.type === 'mcq' ? (
                  <select
                    value={form.answer}
                    onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                ) : (
                  <textarea
                    value={form.answer}
                    onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
                    rows={2}
                    placeholder="Model answer..."
                    className="w-full px-3 py-2 border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">
                  Image URL (optional)
                </label>
                <input
                  type="url"
                  value={form.imageUrl}
                  onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-sm transition-colors"
              >
                Save Question
              </button>
              <button
                onClick={() => {
                  setFormOpen(false);
                  setEditingId(null);
                }}
                className="px-6 py-2.5 border border-gray-300 dark:border-white/20 text-gray-700 dark:text-gray-300 font-semibold rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-200 dark:border-white/10 p-5">
          {/* Class buttons */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-500 mb-2">Class</label>
            <div className="flex flex-wrap gap-1.5">
              {ALL_CLASSES.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setClassLevel(c);
                    setChapter(0);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${classLevel === c ? 'bg-sky-600 border-sky-600 text-white' : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-sky-400'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            {/* Subject */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Subject</label>
              <select
                value={subjectId}
                onChange={(e) => {
                  setSubjectId(e.target.value);
                  setChapter(0);
                }}
                className="w-full px-3 py-2 border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Chapter */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Chapter</label>
              <select
                value={chapter}
                onChange={(e) => setChapter(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value={0}>All Chapters</option>
                {subject?.chapters.map((ch) => (
                  <option key={ch.number} value={ch.number}>
                    Ch.{ch.number}: {ch.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Difficulty */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty | 'all')}
                className="w-full px-3 py-2 border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="all">All Levels</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
          {/* Search */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions..."
            className="w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-white/5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Stats + actions */}
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            <span className="text-sky-600 dark:text-sky-400 text-lg font-black">
              {builtinCount}
            </span>
            {' built-in'}
            {customCount > 0 && (
              <>
                {' + '}
                <span className="text-blue-600 dark:text-blue-400 text-lg font-black">
                  {customCount}
                </span>
                {' custom'}
              </>
            )}
            {' MCQs found'}
          </div>
          <div className="flex gap-2">
            <button
              onClick={revealAll}
              className="text-xs px-3 py-1.5 rounded-lg bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 font-semibold hover:opacity-80 transition-opacity"
            >
              Show All Answers
            </button>
            <button
              onClick={hideAll}
              className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 font-semibold hover:opacity-80 transition-opacity"
            >
              Hide All
            </button>
          </div>
        </div>

        {/* Questions */}
        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-200 dark:border-white/10 p-12 text-center text-gray-400">
            No MCQs found for these filters. Try changing class, subject, or chapter.
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((q, i) => {
              const custom = isCustomQuestion(q.id);
              return (
                <div
                  key={q.id}
                  className={`bg-white dark:bg-[#1e1e1e] rounded-xl border p-4 ${custom ? 'border-blue-300 dark:border-blue-700' : 'border-gray-200 dark:border-white/10'}`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-2 flex-1">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 text-xs font-black flex items-center justify-center">
                        {i + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 dark:text-white leading-relaxed">
                          {q.question}
                        </p>
                        {q.imageUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={q.imageUrl}
                            alt="question"
                            className="mt-2 max-h-40 object-contain rounded-lg border border-gray-200 dark:border-white/10"
                          />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {custom && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                          Custom
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${diffColor[q.difficulty]}`}
                      >
                        {q.difficulty}
                      </span>
                      <span className="text-[10px] text-gray-400">Ch.{q.chapter}</span>
                      <button
                        onClick={() => openEdit(q)}
                        title="Edit"
                        className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-sky-600 transition-colors text-xs"
                      >
                        ✏️
                      </button>
                      {custom && (
                        <button
                          onClick={() => handleDelete(q.id)}
                          title="Delete"
                          className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-600 transition-colors text-xs"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>

                  {q.options && (
                    <div className="grid grid-cols-2 gap-2 mb-3 ml-8">
                      {q.options.map((opt, oi) => {
                        const label = String.fromCharCode(65 + oi);
                        const isCorrect = revealed.has(q.id) && label === q.answer.trim();
                        return (
                          <div
                            key={oi}
                            className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border transition-colors ${
                              isCorrect
                                ? 'bg-green-50 dark:bg-green-900/20 border-green-400 text-green-800 dark:text-green-300 font-semibold'
                                : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            <span
                              className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                                isCorrect
                                  ? 'bg-green-500 border-green-500 text-white'
                                  : 'border-gray-400 text-gray-500'
                              }`}
                            >
                              {label}
                            </span>
                            {opt}
                            {isCorrect && <span className="ml-auto">✓</span>}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="ml-8 flex items-center justify-between">
                    <button
                      onClick={() => toggle(q.id)}
                      className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
                    >
                      {revealed.has(q.id) ? 'Hide Answer' : 'Show Answer'}
                    </button>
                    {revealed.has(q.id) && (
                      <span className="text-xs font-bold text-green-600 dark:text-green-400">
                        Correct: {q.answer}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
