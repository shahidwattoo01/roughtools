'use client';

import { useState, useMemo } from 'react';
import { getSubjectsByClass } from '../data/boards';
import type { ClassLevel } from '../data/boards';
import { QUESTIONS, sampleQuestions } from '../data/questions';

type Mode = 'auto' | 'manual';

export default function AnswerKeyClient() {
  const [mode, setMode] = useState<Mode>('auto');

  // Auto mode
  const [classLevel, setClassLevel] = useState<ClassLevel>(9);
  const [subjectId, setSubjectId] = useState('physics');
  const [count, setCount] = useState(15);
  const [generated, setGenerated] = useState<{ q: string; answer: string }[] | null>(null);

  // Manual mode
  const [manualRows, setManualRows] = useState<string[]>(Array(15).fill(''));
  const [manualCount, setManualCount] = useState(15);

  const subjects = useMemo(() => getSubjectsByClass(classLevel), [classLevel]);

  const handleGenerate = () => {
    const pool = QUESTIONS.filter(
      (q) => q.classLevel === classLevel && q.subjectId === subjectId && q.type === 'mcq'
    );
    const selected = sampleQuestions(pool, count, true);
    setGenerated(
      selected.map((q) => ({
        q: q.question.slice(0, 80) + (q.question.length > 80 ? '…' : ''),
        answer: q.answer.trim(),
      }))
    );
  };

  const updateManual = (i: number, val: string) => {
    setManualRows((prev) => {
      const n = [...prev];
      n[i] = val.toUpperCase().slice(0, 1);
      return n;
    });
  };

  const letters = ['A', 'B', 'C', 'D'];

  return (
    <div className="min-h-screen bg-[#f5f5f3] dark:bg-[#121212]">
      <div className="bg-gradient-to-r from-sky-900 via-blue-800 to-sky-900 text-white px-4 py-6 print:hidden">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-black">🔑 Answer Key Generator</h1>
          <p className="text-white/60 text-sm mt-1">
            Generate printable MCQ answer keys — auto from question bank or manual entry
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
        {/* Mode toggle */}
        <div className="flex gap-3 print:hidden">
          {(['auto', 'manual'] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setGenerated(null);
              }}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all capitalize border-2 ${mode === m ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300' : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-sky-300'}`}
            >
              {m === 'auto' ? '🤖 Auto (from question bank)' : '✏️ Manual entry'}
            </button>
          ))}
        </div>

        {/* Auto mode */}
        {mode === 'auto' && (
          <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-200 dark:border-white/10 p-6 space-y-4">
            <h2 className="font-bold text-gray-900 dark:text-white">Select Paper Details</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Class</label>
                <select
                  value={classLevel}
                  onChange={(e) => setClassLevel(Number(e.target.value) as ClassLevel)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((c) => (
                    <option key={c} value={c}>
                      Class {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Subject</label>
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
                  Number of MCQs
                </label>
                <input
                  type="number"
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  min={5}
                  max={40}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
            <button
              onClick={handleGenerate}
              className="px-8 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition-colors"
            >
              🔑 Generate Answer Key
            </button>
          </div>
        )}

        {/* Manual mode */}
        {mode === 'manual' && (
          <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-200 dark:border-white/10 p-6 space-y-4 print:hidden">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-900 dark:text-white">Enter Correct Answers</h2>
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-500 font-semibold">Questions:</label>
                <input
                  type="number"
                  value={manualCount}
                  onChange={(e) => {
                    const n = Number(e.target.value);
                    setManualCount(n);
                    setManualRows(Array(n).fill(''));
                  }}
                  min={1}
                  max={60}
                  className="w-16 px-2 py-1 border border-gray-200 dark:border-white/10 rounded-lg text-sm text-gray-900 dark:text-white bg-white dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {manualRows.slice(0, manualCount).map((val, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-500 w-5 text-right">{i + 1}.</span>
                  <div className="flex gap-0.5">
                    {letters.map((l) => (
                      <button
                        key={l}
                        onClick={() => updateManual(i, l === val ? '' : l)}
                        className={`w-7 h-7 rounded-md text-[11px] font-bold border transition-all ${val === l ? 'bg-sky-500 border-sky-500 text-white' : 'border-gray-300 dark:border-white/20 text-gray-500 hover:border-sky-400'}`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Answer Key Output */}
        {mode === 'auto' && generated && (
          <AnswerKeyOutput
            rows={generated.map((r, i) => ({ num: i + 1, question: r.q, answer: r.answer }))}
            title={`Class ${classLevel} ${subjects.find((s) => s.id === subjectId)?.name || ''} — MCQ Answer Key`}
          />
        )}

        {mode === 'manual' && manualRows.slice(0, manualCount).some((v) => v) && (
          <AnswerKeyOutput
            rows={manualRows
              .slice(0, manualCount)
              .map((answer, i) => ({ num: i + 1, answer: answer || '—', question: '' }))}
            title="MCQ Answer Key"
          />
        )}
      </div>
    </div>
  );
}

function AnswerKeyOutput({
  rows,
  title,
}: {
  rows: { num: number; question: string; answer: string }[];
  title: string;
}) {
  const colorsMap: Record<string, string> = {
    A: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    B: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    C: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    D: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  };

  return (
    <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-white/10 print:hidden">
        <h2 className="font-bold text-gray-900 dark:text-white">{title}</h2>
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          🖨️ Print
        </button>
      </div>
      <div className="p-5 print:p-4">
        <div className="text-center font-black text-lg text-gray-900 dark:text-white mb-4 hidden print:block">
          {title}
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {rows.map((row) => (
            <div
              key={row.num}
              className="flex items-center gap-2 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2"
            >
              <span className="text-xs text-gray-500 font-semibold w-5">{row.num}.</span>
              <span
                className={`text-sm font-black px-2 py-0.5 rounded ${colorsMap[row.answer] || 'bg-gray-100 text-gray-600'}`}
              >
                {row.answer}
              </span>
            </div>
          ))}
        </div>
        {rows.some((r) => r.question) && (
          <div className="mt-6 border-t border-gray-200 dark:border-white/10 pt-4">
            <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3">
              Questions Reference
            </h3>
            <div className="space-y-2">
              {rows.map(
                (row) =>
                  row.question && (
                    <div key={row.num} className="flex gap-3 text-sm">
                      <span className="text-gray-500 flex-shrink-0">{row.num}.</span>
                      <span className="text-gray-700 dark:text-gray-300 flex-1">
                        {row.question}
                      </span>
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-xs flex-shrink-0 ${colorsMap[row.answer] || 'bg-gray-100 text-gray-600'}`}
                      >
                        {row.answer}
                      </span>
                    </div>
                  )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
