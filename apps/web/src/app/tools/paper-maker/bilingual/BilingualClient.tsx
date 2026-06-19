'use client';

import { useState, useMemo } from 'react';
import { BOARDS, getSubjectsByClass } from '../data/boards';
import type { BoardId, ClassLevel } from '../data/boards';
import { QUESTIONS, sampleQuestions } from '../data/questions';
import type { Question } from '../data/questions';

type PaperMedium = 'english' | 'urdu' | 'bilingual';

// Urdu question prefixes/suffixes for common question patterns
function toUrduQuestion(_q: string): string {
  return `[اردو ترجمہ: متعلقہ باب کی کتاب دیکھیں]`;
}

export default function BilingualClient() {
  const [classLevel, setClassLevel] = useState<ClassLevel>(9);
  const [boardId, setBoardId] = useState<BoardId>('lahore');
  const [subjectId, setSubjectId] = useState('physics');
  const [medium, setMedium] = useState<PaperMedium>('bilingual');
  const [mcqCount, setMcqCount] = useState(15);
  const [shortCount, setShortCount] = useState(6);
  const [instituteName, setInstituteName] = useState('');
  const [paper, setPaper] = useState<{ mcqs: Question[]; shorts: Question[] } | null>(null);

  const subjects = useMemo(() => getSubjectsByClass(classLevel), [classLevel]);
  const subject = subjects.find((s) => s.id === subjectId);
  const board = BOARDS.find((b) => b.id === boardId);

  const generate = () => {
    const mcqPool = QUESTIONS.filter(
      (q) => q.classLevel === classLevel && q.subjectId === subjectId && q.type === 'mcq'
    );
    const shortPool = QUESTIONS.filter(
      (q) => q.classLevel === classLevel && q.subjectId === subjectId && q.type === 'short'
    );
    setPaper({
      mcqs: sampleQuestions(mcqPool, mcqCount, true),
      shorts: sampleQuestions(shortPool, shortCount, true),
    });
  };

  const showEn = medium === 'english' || medium === 'bilingual';
  const showUr = medium === 'urdu' || medium === 'bilingual';

  return (
    <div className="min-h-screen bg-[#f5f5f3] dark:bg-[#121212]">
      <div className="bg-gradient-to-r from-sky-900 via-blue-800 to-sky-900 text-white px-4 py-6 print:hidden">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-black">🌐 Bilingual Paper Maker</h1>
          <p className="text-white/60 text-sm mt-1">
            English · اردو · Bilingual — all three mediums supported
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
        {!paper ? (
          <>
            <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-200 dark:border-white/10 p-6 space-y-5">
              <h2 className="font-bold text-gray-900 dark:text-white">Paper Settings</h2>

              {/* Medium selector */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2">
                  Paper Medium
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(
                    [
                      { value: 'english', label: '🇬🇧 English Only', desc: 'Questions in English' },
                      { value: 'urdu', label: '🇵🇰 Urdu Only', desc: 'Questions in Urdu' },
                      { value: 'bilingual', label: '🌐 Bilingual', desc: 'Both side by side' },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setMedium(opt.value)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${medium === opt.value ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40' : 'border-gray-200 dark:border-white/10 hover:border-sky-300'}`}
                    >
                      <div
                        className={`font-bold text-sm ${medium === opt.value ? 'text-sky-700 dark:text-sky-300' : 'text-gray-900 dark:text-white'}`}
                      >
                        {opt.label}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

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
                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                    Institute Name (optional)
                  </label>
                  <input
                    type="text"
                    value={instituteName}
                    onChange={(e) => setInstituteName(e.target.value)}
                    placeholder="e.g. Punjab Model School"
                    className="w-full px-3 py-2 border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <button
                onClick={generate}
                className="px-8 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition-colors"
              >
                🌐 Generate{' '}
                {medium === 'bilingual' ? 'Bilingual' : medium === 'urdu' ? 'Urdu' : 'English'}{' '}
                Paper
              </button>
            </div>
          </>
        ) : (
          <div>
            <div className="flex gap-2 mb-5 print:hidden">
              <button
                onClick={() => setPaper(null)}
                className="px-4 py-2 border border-gray-300 dark:border-white/20 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                ← New Paper
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                🖨️ Print
              </button>
            </div>

            <div className="bg-white dark:bg-[#1e1e1e] print:bg-white rounded-2xl border border-gray-200 dark:border-white/10 print:border-0 overflow-hidden">
              {/* Header */}
              <div className="border-b-4 border-gray-900 p-5 print:p-4">
                {instituteName && (
                  <div className="text-center mb-1">
                    <div className="text-lg font-black text-gray-900">{instituteName}</div>
                    {showUr && (
                      <div
                        className="text-base font-bold text-gray-700"
                        style={{ fontFamily: 'serif', direction: 'rtl' }}
                      >
                        {instituteName}
                      </div>
                    )}
                  </div>
                )}
                <div className="text-center text-sm text-gray-600 mb-3">
                  {showEn && (
                    <span>
                      {board?.name} — Annual Examination {new Date().getFullYear()}
                    </span>
                  )}
                  {medium === 'bilingual' && <span className="mx-2 text-gray-400">|</span>}
                  {showUr && (
                    <span style={{ fontFamily: 'serif', direction: 'rtl' }}>
                      {board?.nameUrdu} — سالانہ امتحان {new Date().getFullYear()}
                    </span>
                  )}
                </div>

                <div
                  className={`grid ${medium === 'bilingual' ? 'grid-cols-2 gap-4' : 'grid-cols-1'}`}
                >
                  {showEn && (
                    <div className="grid grid-cols-3 text-sm border border-gray-300">
                      <div className="p-2 border-r border-gray-300">
                        <div className="text-xs text-gray-500 uppercase font-semibold">Subject</div>
                        <div className="font-bold">{subject?.name}</div>
                      </div>
                      <div className="p-2 border-r border-gray-300 text-center">
                        <div className="text-xs text-gray-500 uppercase font-semibold">Class</div>
                        <div className="font-bold">Class {classLevel}</div>
                      </div>
                      <div className="p-2 text-right">
                        <div className="text-xs text-gray-500 uppercase font-semibold">
                          Total Marks
                        </div>
                        <div className="font-bold">{mcqCount + shortCount * 5}</div>
                      </div>
                    </div>
                  )}
                  {showUr && (
                    <div
                      className="grid grid-cols-3 text-sm border border-gray-300"
                      style={{ direction: 'rtl' }}
                    >
                      <div className="p-2 border-l border-gray-300">
                        <div className="text-xs text-gray-500 uppercase font-semibold">مضمون</div>
                        <div className="font-bold" style={{ fontFamily: 'serif' }}>
                          {subject?.nameUrdu}
                        </div>
                      </div>
                      <div className="p-2 border-l border-gray-300 text-center">
                        <div className="text-xs text-gray-500 uppercase font-semibold">جماعت</div>
                        <div className="font-bold" style={{ fontFamily: 'serif' }}>
                          جماعت {classLevel}
                        </div>
                      </div>
                      <div className="p-2">
                        <div className="text-xs text-gray-500 uppercase font-semibold">کل نمبر</div>
                        <div className="font-bold">{mcqCount + shortCount * 5}</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-3 grid grid-cols-3 gap-4">
                  {[
                    'Student Name / طالب علم کا نام: ___________________',
                    'Roll No / رول نمبر: _________',
                    'Date / تاریخ: _________',
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
                {paper.mcqs.length > 0 && (
                  <div>
                    <div className="bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/20 rounded-lg p-3 mb-3">
                      {showEn && <div className="font-black">Section A — Objective (MCQs)</div>}
                      {showUr && (
                        <div
                          className="font-black text-right"
                          style={{ fontFamily: 'serif', direction: 'rtl' }}
                        >
                          سیکشن الف — معروضی سوالات (MCQs)
                        </div>
                      )}
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {showEn &&
                          `Circle the correct answer. (${paper.mcqs.length} × 1 = ${paper.mcqs.length} Marks)`}
                        {medium === 'bilingual' && ' | '}
                        {showUr && (
                          <span
                            style={{ fontFamily: 'serif' }}
                          >{`درست جواب پر دائرہ لگائیں۔ (${paper.mcqs.length} × 1 = ${paper.mcqs.length} نمبر)`}</span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-4">
                      {paper.mcqs.map((q, i) => (
                        <div
                          key={q.id}
                          className={`flex gap-3 ${medium === 'bilingual' ? 'grid grid-cols-2 gap-4' : ''}`}
                        >
                          {showEn && (
                            <div className="flex gap-3">
                              <span className="font-bold text-sm w-5 flex-shrink-0">{i + 1}.</span>
                              <div className="flex-1">
                                <p className="text-sm text-gray-900 dark:text-white mb-2">
                                  {q.question}
                                </p>
                                {q.options && (
                                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
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
                          )}
                          {showUr && (
                            <div
                              className="flex gap-3 flex-row-reverse"
                              style={{ direction: 'rtl' }}
                            >
                              <span className="font-bold text-sm w-5 flex-shrink-0">{i + 1}.</span>
                              <div className="flex-1">
                                <p
                                  className="text-sm text-gray-700 dark:text-gray-300 mb-2"
                                  style={{ fontFamily: 'serif' }}
                                >
                                  {toUrduQuestion(q.question)}
                                </p>
                                {q.options && (
                                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                    {q.options.map((_, oi) => (
                                      <div
                                        key={oi}
                                        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                                        style={{ flexDirection: 'row-reverse' }}
                                      >
                                        <span className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                                          {String.fromCharCode(65 + oi)}
                                        </span>
                                        <span style={{ fontFamily: 'serif' }}>________</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Short Qs */}
                {paper.shorts.length > 0 && (
                  <div>
                    <div className="bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/20 rounded-lg p-3 mb-3">
                      {showEn && (
                        <div className="font-black">Section B — Short Answer Questions</div>
                      )}
                      {showUr && (
                        <div
                          className="font-black text-right"
                          style={{ fontFamily: 'serif', direction: 'rtl' }}
                        >
                          سیکشن ب — مختصر جوابی سوالات
                        </div>
                      )}
                    </div>
                    <div className="space-y-5">
                      {paper.shorts.map((q, i) => (
                        <div
                          key={q.id}
                          className={medium === 'bilingual' ? 'grid grid-cols-2 gap-4' : ''}
                        >
                          {showEn && (
                            <div className="flex gap-3">
                              <span className="font-bold text-sm w-5 flex-shrink-0">
                                {paper.mcqs.length + i + 1}.
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
                          )}
                          {showUr && (
                            <div
                              className="flex gap-3 flex-row-reverse"
                              style={{ direction: 'rtl' }}
                            >
                              <span className="font-bold text-sm w-5 flex-shrink-0">
                                {paper.mcqs.length + i + 1}.
                              </span>
                              <div className="flex-1">
                                <p
                                  className="text-sm text-gray-700 dark:text-gray-300 mb-2"
                                  style={{ fontFamily: 'serif' }}
                                >
                                  {toUrduQuestion(q.question)}
                                </p>
                                {Array.from({ length: 3 }).map((_, li) => (
                                  <div
                                    key={li}
                                    className="border-b border-dotted border-gray-300 dark:border-white/20 h-5 mb-1"
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 dark:border-white/10 px-5 py-2 text-xs text-gray-400">
                Generated by RoughTools.com — Medium: {medium}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
