'use client';

import { useState, useMemo } from 'react';
import { getSubjectsByClass } from '../data/boards';
import type { ClassLevel } from '../data/boards';
import { QUESTIONS, sampleQuestions } from '../data/questions';
import type { Question } from '../data/questions';

type Step = 1 | 2 | 3;

export default function ClassTestClient() {
  const [step, setStep] = useState<Step>(1);
  const [classLevel, setClassLevel] = useState<ClassLevel>(9);
  const [subjectId, setSubjectId] = useState('');
  const [chapters, setChapters] = useState<number[]>([]);
  const [mcqCount, setMcqCount] = useState(10);
  const [shortCount, setShortCount] = useState(5);
  const [marksPerMCQ, setMarksPerMCQ] = useState(1);
  const [marksPerShort, setMarksPerShort] = useState(3);
  const [timeMinutes, setTimeMinutes] = useState(40);
  const [instituteName, setInstituteName] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [includeAnswerKey, setIncludeAnswerKey] = useState(true);
  const [paper, setPaper] = useState<{ mcqs: Question[]; shorts: Question[] } | null>(null);

  const subjects = useMemo(() => getSubjectsByClass(classLevel), [classLevel]);
  const subject = subjects.find((s) => s.id === subjectId);
  const totalMarks = mcqCount * marksPerMCQ + shortCount * marksPerShort;

  const toggleChapter = (n: number) =>
    setChapters((prev) => (prev.includes(n) ? prev.filter((c) => c !== n) : [...prev, n]));

  const generate = () => {
    if (!subject) return;
    const chaps = chapters.length > 0 ? chapters : subject.chapters.map((c) => c.number);
    const mcqPool = QUESTIONS.filter(
      (q) =>
        q.classLevel === classLevel &&
        q.subjectId === subjectId &&
        chaps.includes(q.chapter) &&
        q.type === 'mcq'
    );
    const shortPool = QUESTIONS.filter(
      (q) =>
        q.classLevel === classLevel &&
        q.subjectId === subjectId &&
        chaps.includes(q.chapter) &&
        q.type === 'short'
    );
    setPaper({
      mcqs: sampleQuestions(mcqPool, mcqCount, true),
      shorts: sampleQuestions(shortPool, shortCount, true),
    });
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f3] dark:bg-[#121212]">
      <div className="bg-gradient-to-r from-sky-900 via-blue-800 to-sky-900 text-white px-4 py-6 print:hidden">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-black">🧪 Class Test Builder</h1>
          <p className="text-white/60 text-sm mt-1">
            Quick class tests — generate in under 30 seconds
          </p>
        </div>
      </div>

      {/* Step bar */}
      {step < 3 && (
        <div className="bg-white dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-white/10 print:hidden">
          <div className="max-w-3xl mx-auto px-4 py-3 flex gap-2">
            {(['Setup', 'Configure', 'Preview'] as const).map((label, i) => (
              <button
                key={label}
                onClick={() => i < step && setStep((i + 1) as Step)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  i + 1 === step
                    ? 'bg-sky-600 text-white'
                    : i + 1 < step
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 cursor-pointer'
                      : 'bg-gray-100 dark:bg-white/5 text-gray-400 cursor-not-allowed'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${i + 1 < step ? 'bg-green-500 text-white' : i + 1 === step ? 'bg-white text-sky-600' : 'bg-gray-300 dark:bg-white/10 text-gray-500'}`}
                >
                  {i + 1 < step ? '✓' : i + 1}
                </span>
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 py-8 print:p-0 space-y-5">
        {/* Step 1: Setup */}
        {step === 1 && (
          <>
            <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-200 dark:border-white/10 p-6">
              <h2 className="font-bold text-gray-900 dark:text-white mb-4">Select Class</h2>
              <div className="grid grid-cols-6 gap-2 mb-4">
                {([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as ClassLevel[]).map((cl) => (
                  <button
                    key={cl}
                    onClick={() => {
                      setClassLevel(cl);
                      setSubjectId('');
                      setChapters([]);
                    }}
                    className={`py-2.5 rounded-xl border-2 font-bold text-sm transition-all ${classLevel === cl ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-600' : 'border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-sky-300'}`}
                  >
                    {cl}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-200 dark:border-white/10 p-6">
              <h2 className="font-bold text-gray-900 dark:text-white mb-4">Select Subject</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {subjects.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSubjectId(s.id);
                      setChapters([]);
                    }}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${subjectId === s.id ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40' : 'border-gray-200 dark:border-white/10 hover:border-sky-300'}`}
                  >
                    <div
                      className={`font-bold text-sm ${subjectId === s.id ? 'text-sky-700 dark:text-sky-300' : 'text-gray-900 dark:text-white'}`}
                    >
                      {s.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {subject && (
              <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-200 dark:border-white/10 p-6">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="font-bold text-gray-900 dark:text-white">Chapters (optional)</h2>
                  <button
                    onClick={() => setChapters([])}
                    className="text-xs text-gray-400 hover:underline"
                  >
                    All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {subject.chapters.map((ch) => (
                    <button
                      key={ch.number}
                      onClick={() => toggleChapter(ch.number)}
                      className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${chapters.includes(ch.number) ? 'bg-sky-500 border-sky-500 text-white' : 'border-gray-300 dark:border-white/20 text-gray-600 dark:text-gray-400 hover:border-sky-400'}`}
                    >
                      Ch.{ch.number}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                disabled={!subjectId}
                onClick={() => setStep(2)}
                className="px-8 py-3 bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white font-bold rounded-xl transition-colors"
              >
                Next: Configure →
              </button>
            </div>
          </>
        )}

        {/* Step 2: Configure */}
        {step === 2 && (
          <>
            <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-200 dark:border-white/10 p-6">
              <h2 className="font-bold text-gray-900 dark:text-white mb-5">Test Configuration</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: 'MCQ Count', value: mcqCount, set: setMcqCount, min: 0, max: 30 },
                  {
                    label: 'Marks per MCQ',
                    value: marksPerMCQ,
                    set: setMarksPerMCQ,
                    min: 1,
                    max: 5,
                  },
                  {
                    label: 'Short Q Count',
                    value: shortCount,
                    set: setShortCount,
                    min: 0,
                    max: 20,
                  },
                  {
                    label: 'Marks per Short Q',
                    value: marksPerShort,
                    set: setMarksPerShort,
                    min: 1,
                    max: 10,
                  },
                  {
                    label: 'Time (minutes)',
                    value: timeMinutes,
                    set: setTimeMinutes,
                    min: 10,
                    max: 120,
                  },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      {f.label}
                    </label>
                    <input
                      type="number"
                      value={f.value}
                      onChange={(e) => f.set(Number(e.target.value))}
                      min={f.min}
                      max={f.max}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                ))}
                <div className="flex items-end pb-2">
                  <div className="text-center w-full">
                    <div className="text-2xl font-black text-sky-600">{totalMarks}</div>
                    <div className="text-xs text-gray-500">Total Marks</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-200 dark:border-white/10 p-6">
              <h2 className="font-bold text-gray-900 dark:text-white mb-4">Branding (optional)</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={instituteName}
                  onChange={(e) => setInstituteName(e.target.value)}
                  placeholder="Institute / School Name"
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-white/5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <input
                  type="text"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  placeholder="Teacher Name"
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-white/5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <label className="flex items-center gap-3 mt-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeAnswerKey}
                  onChange={(e) => setIncludeAnswerKey(e.target.checked)}
                  className="w-4 h-4 accent-sky-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                  Include answer key
                </span>
              </label>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 border border-gray-300 dark:border-white/20 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 font-medium transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={generate}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors"
              >
                🎉 Build Test
              </button>
            </div>
          </>
        )}

        {/* Step 3: Preview */}
        {step === 3 && paper && (
          <div>
            <div className="flex gap-2 mb-5 print:hidden">
              <button
                onClick={() => {
                  setPaper(null);
                  setStep(1);
                }}
                className="px-4 py-2 border border-gray-300 dark:border-white/20 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                ← New Test
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
                  <div className="text-center text-lg font-black text-gray-900 mb-1">
                    {instituteName}
                  </div>
                )}
                <div className="text-center text-sm text-gray-600 mb-3">
                  Class Test {new Date().getFullYear()}
                </div>
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
                      Marks / Time
                    </div>
                    <div className="font-bold">
                      {totalMarks} / {timeMinutes} min
                    </div>
                  </div>
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
                {paper.mcqs.length > 0 && (
                  <div>
                    <div className="bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/20 rounded-lg p-3 mb-3">
                      <div className="font-black text-gray-900 dark:text-white">
                        Section A — Objective (MCQs)
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Circle the correct answer. ({paper.mcqs.length} × {marksPerMCQ} ={' '}
                        {paper.mcqs.length * marksPerMCQ} Marks)
                      </div>
                    </div>
                    <div className="space-y-4">
                      {paper.mcqs.map((q, i) => (
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

                {/* Short Questions */}
                {paper.shorts.length > 0 && (
                  <div>
                    <div className="bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/20 rounded-lg p-3 mb-3">
                      <div className="font-black text-gray-900 dark:text-white">
                        Section B — Short Answer Questions
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Answer all questions. ({paper.shorts.length} × {marksPerShort} ={' '}
                        {paper.shorts.length * marksPerShort} Marks)
                      </div>
                    </div>
                    <div className="space-y-5">
                      {paper.shorts.map((q, i) => (
                        <div key={q.id} className="flex gap-3">
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
                      ))}
                    </div>
                  </div>
                )}

                {/* Answer Key */}
                {includeAnswerKey && (
                  <div className="border-t-4 border-double border-gray-400 pt-4">
                    <div className="font-black text-gray-900 dark:text-white mb-3 text-center">
                      — ANSWER KEY — (Teacher Only)
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {paper.mcqs.map((q, i) => (
                        <span key={q.id} className="text-sm">
                          <span className="text-gray-500">{i + 1}.</span>{' '}
                          <span className="font-bold text-sky-700 dark:text-sky-400">
                            {q.answer}
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 dark:border-white/10 px-5 py-2 flex justify-between text-xs text-gray-400">
                <span>Generated by RoughTools.com</span>
                {teacherName && <span>{teacherName}</span>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
