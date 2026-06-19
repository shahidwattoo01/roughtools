'use client';

import { useState, useMemo } from 'react';
import { SUBJECTS } from '../data/boards';
import { QUESTIONS } from '../data/questions';
import type { Difficulty } from '../data/boards';

export default function MCQBankClient() {
  const [classLevel, setClassLevel] = useState<number>(9);
  const [subjectId, setSubjectId] = useState('physics');
  const [chapter, setChapter] = useState<number>(0);
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all');
  const [search, setSearch] = useState('');
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  const subject = SUBJECTS.find((s) => s.id === subjectId);
  const subjects = SUBJECTS.filter((s) => s.classes.includes(classLevel as 9 | 10 | 11 | 12));

  const filtered = useMemo(() => {
    return QUESTIONS.filter(
      (q) =>
        q.type === 'mcq' &&
        q.classLevel === classLevel &&
        q.subjectId === subjectId &&
        (chapter === 0 || q.chapter === chapter) &&
        (difficulty === 'all' || q.difficulty === difficulty) &&
        (search === '' || q.question.toLowerCase().includes(search.toLowerCase()))
    );
  }, [classLevel, subjectId, chapter, difficulty, search]);

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

  const diffColor: Record<string, string> = {
    easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    hard: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <div className="min-h-screen bg-[#f5f5f3] dark:bg-[#121212]">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-900 via-blue-800 to-sky-900 text-white px-4 py-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-black tracking-tight">✅ MCQ Question Bank</h1>
          <p className="text-white/60 text-sm mt-1">
            Browse and filter MCQs for Pakistani board exams — Classes 9–12
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
        {/* Filters */}
        <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-200 dark:border-white/10 p-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {/* Class */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Class</label>
              <select
                value={classLevel}
                onChange={(e) => {
                  setClassLevel(Number(e.target.value));
                  setChapter(0);
                }}
                className="w-full px-3 py-2 border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {[9, 10, 11, 12].map((c) => (
                  <option key={c} value={c}>
                    Class {c}
                  </option>
                ))}
              </select>
            </div>
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
              {filtered.length}
            </span>{' '}
            MCQs found
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
            {filtered.map((q, i) => (
              <div
                key={q.id}
                className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-200 dark:border-white/10 p-4"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-2 flex-1">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 text-xs font-black flex items-center justify-center">
                      {i + 1}
                    </span>
                    <p className="text-sm text-gray-900 dark:text-white leading-relaxed">
                      {q.question}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${diffColor[q.difficulty]}`}
                    >
                      {q.difficulty}
                    </span>
                    <span className="text-[10px] text-gray-400">Ch.{q.chapter}</span>
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
                    {revealed.has(q.id) ? '🙈 Hide Answer' : '👁️ Show Answer'}
                  </button>
                  {revealed.has(q.id) && (
                    <span className="text-xs font-bold text-green-600 dark:text-green-400">
                      ✓ Correct: {q.answer}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
