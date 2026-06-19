'use client';

import { useState, useMemo } from 'react';
import { BOARDS, getSubjectsByClass } from '../data/boards';
import type { BoardId, ClassLevel } from '../data/boards';
import { QUESTIONS, sampleQuestions } from '../data/questions';
import type { Question } from '../data/questions';

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function shuffleOptions(q: Question): Question {
  if (!q.options || q.options.length === 0) return q;
  const pairs = q.options.map((opt, i) => ({ opt, label: String.fromCharCode(65 + i) }));
  const correctLabel = q.answer.trim();
  const correctOpt = pairs.find((p) => p.label === correctLabel)?.opt || q.options[0];
  const shuffled = shuffleArray(q.options);
  const newAnswerIdx = shuffled.indexOf(correctOpt);
  return { ...q, options: shuffled, answer: String.fromCharCode(65 + newAnswerIdx) };
}

interface SetPaper {
  label: string;
  mcqs: Question[];
  shorts: Question[];
}

export default function PaperShufflerClient() {
  const [classLevel, setClassLevel] = useState<ClassLevel>(9);
  const [boardId, setBoardId] = useState<BoardId>('lahore');
  const [subjectId, setSubjectId] = useState('physics');
  const [mcqCount, setMcqCount] = useState(15);
  const [shortCount, setShortCount] = useState(6);
  const [sets, setSets] = useState(4);
  const [shuffleOptions_, setShuffleOptions] = useState(true);
  const [instituteName, setInstituteName] = useState('');
  const [papers, setPapers] = useState<SetPaper[] | null>(null);
  const [activeSet, setActiveSet] = useState(0);

  const subjects = useMemo(() => getSubjectsByClass(classLevel), [classLevel]);
  const subject = subjects.find((s) => s.id === subjectId);

  const generate = () => {
    const mcqPool = QUESTIONS.filter(
      (q) => q.classLevel === classLevel && q.subjectId === subjectId && q.type === 'mcq'
    );
    const shortPool = QUESTIONS.filter(
      (q) => q.classLevel === classLevel && q.subjectId === subjectId && q.type === 'short'
    );

    const setLabels = ['A', 'B', 'C', 'D'].slice(0, sets);
    const generated: SetPaper[] = setLabels.map((label) => {
      const mcqs = shuffleArray(sampleQuestions(mcqPool, mcqCount, true)).map((q) =>
        shuffleOptions_ ? shuffleOptions(q) : q
      );
      const shorts = shuffleArray(sampleQuestions(shortPool, shortCount, true));
      return { label, mcqs, shorts };
    });
    setPapers(generated);
    setActiveSet(0);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f3] dark:bg-[#121212]">
      <div className="bg-gradient-to-r from-sky-900 via-blue-800 to-sky-900 text-white px-4 py-6 print:hidden">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-black">🔀 Paper Shuffler</h1>
          <p className="text-white/60 text-sm mt-1">
            Generate Set A, B, C, D with shuffled questions and options
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
        {!papers ? (
          <>
            <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-200 dark:border-white/10 p-6 space-y-4">
              <h2 className="font-bold text-gray-900 dark:text-white">Paper Settings</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Class</label>
                  <select
                    value={classLevel}
                    onChange={(e) => setClassLevel(Number(e.target.value) as ClassLevel)}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    {[9, 10, 11, 12].map((c) => (
                      <option key={c} value={c}>
                        Class {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Board</label>
                  <select
                    value={boardId}
                    onChange={(e) => setBoardId(e.target.value as BoardId)}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    {BOARDS.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                    Subject
                  </label>
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                    Number of Sets
                  </label>
                  <select
                    value={sets}
                    onChange={(e) => setSets(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    {[2, 3, 4].map((n) => (
                      <option key={n} value={n}>
                        {n} sets (A–{String.fromCharCode(64 + n)})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                    MCQ Count
                  </label>
                  <input
                    type="number"
                    value={mcqCount}
                    onChange={(e) => setMcqCount(Number(e.target.value))}
                    min={5}
                    max={30}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                    Short Q Count
                  </label>
                  <input
                    type="number"
                    value={shortCount}
                    onChange={(e) => setShortCount(Number(e.target.value))}
                    min={0}
                    max={20}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                    Institute Name
                  </label>
                  <input
                    type="text"
                    value={instituteName}
                    onChange={(e) => setInstituteName(e.target.value)}
                    placeholder="Optional"
                    className="w-full px-3 py-2 border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shuffleOptions_}
                      onChange={(e) => setShuffleOptions(e.target.checked)}
                      className="w-4 h-4 accent-sky-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                      Shuffle MCQ options too
                    </span>
                  </label>
                </div>
              </div>

              <button
                onClick={generate}
                className="px-8 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition-colors"
              >
                🔀 Generate {sets} Sets
              </button>
            </div>

            {/* How it works */}
            <div className="bg-sky-50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-800 rounded-2xl p-5">
              <h3 className="font-bold text-sky-800 dark:text-sky-300 mb-3">How it works</h3>
              <div className="grid sm:grid-cols-3 gap-4 text-sm text-sky-700 dark:text-sky-400">
                {[
                  { icon: '🔀', text: 'Questions are shuffled in different order for each set' },
                  {
                    icon: '🔡',
                    text: 'MCQ options (A/B/C/D) are also shuffled so the correct answer changes position',
                  },
                  {
                    icon: '🔑',
                    text: 'Each set gets its own answer key at the bottom — so teachers can mark easily',
                  },
                ].map((item) => (
                  <div key={item.icon} className="flex items-start gap-2">
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div>
            {/* Set tabs */}
            <div className="flex items-center justify-between mb-4 print:hidden">
              <div className="flex gap-2">
                {papers.map((p, i) => (
                  <button
                    key={p.label}
                    onClick={() => setActiveSet(i)}
                    className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all border-2 ${activeSet === i ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-600' : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-sky-300'}`}
                  >
                    Set {p.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPapers(null)}
                  className="px-4 py-2 border border-gray-300 dark:border-white/20 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  ← Redo
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  🖨️ Print Set {papers[activeSet].label}
                </button>
              </div>
            </div>

            {/* Paper */}
            {papers[activeSet] && (
              <div className="bg-white dark:bg-[#1e1e1e] print:bg-white rounded-2xl border border-gray-200 dark:border-white/10 print:border-0 overflow-hidden">
                <div className="border-b-4 border-gray-900 p-5 print:p-4">
                  {instituteName && (
                    <div className="text-center text-lg font-black text-gray-900 mb-1">
                      {instituteName}
                    </div>
                  )}
                  <div className="text-center text-sm text-gray-600 mb-2">
                    {BOARDS.find((b) => b.id === boardId)?.name} — {subject?.name} — Class{' '}
                    {classLevel}
                  </div>
                  <div className="text-center">
                    <span className="inline-block bg-gray-900 text-white font-black text-2xl px-6 py-1 rounded-lg">
                      SET {papers[activeSet].label}
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                    {[
                      'Student Name: ___________________________',
                      'Roll No: ______________',
                      'Date: ___________',
                    ].map((f, i) => (
                      <div
                        key={i}
                        className="border-b-2 border-dotted border-gray-400 pb-1 text-xs text-gray-500"
                      >
                        {f}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-5 print:p-4 space-y-6">
                  {/* MCQs */}
                  {papers[activeSet].mcqs.length > 0 && (
                    <div>
                      <div className="bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/20 rounded-lg p-3 mb-3">
                        <div className="font-black">Section A — Objective (MCQs)</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Circle the correct answer. ({papers[activeSet].mcqs.length} × 1 ={' '}
                          {papers[activeSet].mcqs.length} Marks)
                        </div>
                      </div>
                      <div className="space-y-3">
                        {papers[activeSet].mcqs.map((q, i) => (
                          <div key={q.id} className="flex gap-3">
                            <span className="font-bold text-sm w-5 flex-shrink-0">{i + 1}.</span>
                            <div className="flex-1">
                              <p className="text-sm text-gray-900 dark:text-white mb-2">
                                {q.question}
                              </p>
                              {q.options && (
                                <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                                  {q.options.map((opt, oi) => (
                                    <div
                                      key={oi}
                                      className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                                    >
                                      <span className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                                        {String.fromCharCode(65 + oi)}
                                      </span>
                                      {opt}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Short Qs */}
                  {papers[activeSet].shorts.length > 0 && (
                    <div>
                      <div className="bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/20 rounded-lg p-3 mb-3">
                        <div className="font-black">Section B — Short Answer Questions</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Answer all questions. ({papers[activeSet].shorts.length} × 5 ={' '}
                          {papers[activeSet].shorts.length * 5} Marks)
                        </div>
                      </div>
                      <div className="space-y-4">
                        {papers[activeSet].shorts.map((q, i) => (
                          <div key={q.id} className="flex gap-3">
                            <span className="font-bold text-sm w-5 flex-shrink-0">
                              {papers[activeSet].mcqs.length + i + 1}.
                            </span>
                            <div className="flex-1">
                              <p className="text-sm text-gray-900 dark:text-white mb-2">
                                {q.question}
                              </p>
                              {Array.from({ length: 3 }).map((_, li) => (
                                <div
                                  key={li}
                                  className="border-b border-dotted border-gray-300 dark:border-white/20 h-5 mb-1"
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Answer Key */}
                  <div className="border-t-4 border-double border-gray-400 pt-4">
                    <div className="font-black text-center mb-3">
                      — ANSWER KEY: SET {papers[activeSet].label} — (Teacher Only)
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {papers[activeSet].mcqs.map((q, i) => (
                        <span key={q.id} className="text-sm">
                          <span className="text-gray-500">{i + 1}.</span>{' '}
                          <span className="font-bold text-sky-700 dark:text-sky-400">
                            {q.answer}
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-200 dark:border-white/10 px-5 py-2 text-xs text-gray-400">
                  Generated by RoughTools.com — Set {papers[activeSet].label}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
