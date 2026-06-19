'use client';

import { useState, useCallback, useMemo } from 'react';
import { BOARDS, SUBJECTS, getSubjectsByClass, getDefaultPattern } from '../data/boards';
import type { BoardId, ClassLevel, Subject, PatternSection, QuestionType } from '../data/boards';
import { QUESTIONS, sampleQuestions } from '../data/questions';
import type { Question } from '../data/questions';

// ─── Types ───────────────────────────────────────────────────────

interface PaperConfig {
  classLevel: ClassLevel;
  boardId: BoardId;
  subjectId: string;
  chapters: number[];
  sections: PatternSection[];
  instituteName: string;
  teacherName: string;
  totalMarks: number;
  timeMinutes: number;
  medium: 'english' | 'urdu';
  shuffle: boolean;
  includeAnswerKey: boolean;
}

interface GeneratedPaper {
  config: PaperConfig;
  sections: { section: PatternSection; questions: Question[] }[];
}

// ─── Step indicators ─────────────────────────────────────────────

const STEPS = [
  { id: 1, label: 'Class & Board' },
  { id: 2, label: 'Subject & Chapters' },
  { id: 3, label: 'Paper Setup' },
  { id: 4, label: 'Branding' },
  { id: 5, label: 'Preview & Export' },
];

// ─── Helpers ─────────────────────────────────────────────────────

function calcTotalMarks(sections: PatternSection[]) {
  return sections.reduce((sum, s) => sum + s.attemptQuestions * s.marksPerQuestion, 0);
}

// ─── Main component ──────────────────────────────────────────────

export default function PaperGeneratorClient() {
  const [step, setStep] = useState(1);
  const [paper, setPaper] = useState<GeneratedPaper | null>(null);
  const [generating, setGenerating] = useState(false);

  // form state
  const [classLevel, setClassLevel] = useState<ClassLevel>(9);
  const [boardId, setBoardId] = useState<BoardId>('lahore');
  const [subjectId, setSubjectId] = useState('');
  const [selectedChapters, setSelectedChapters] = useState<number[]>([]);
  const [sections, setSections] = useState<PatternSection[]>([]);
  const [medium, setMedium] = useState<'english' | 'urdu'>('english');
  const [timeMinutes, setTimeMinutes] = useState(180);
  const [instituteName, setInstituteName] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [shuffle, setShuffle] = useState(false);
  const [includeAnswerKey, setIncludeAnswerKey] = useState(true);

  const subjects = useMemo(() => getSubjectsByClass(classLevel), [classLevel]);
  const currentSubject: Subject | undefined = subjects.find((s) => s.id === subjectId);

  const handleClassChange = useCallback((cl: ClassLevel) => {
    setClassLevel(cl);
    setSubjectId('');
    setSelectedChapters([]);
    setSections([]);
  }, []);

  const handleSubjectChange = useCallback(
    (sid: string) => {
      setSubjectId(sid);
      setSelectedChapters([]);
      const defaultSections = getDefaultPattern(classLevel, sid);
      setSections(defaultSections);
      setTimeMinutes(classLevel <= 10 ? 180 : 195);
    },
    [classLevel]
  );

  const toggleChapter = useCallback((n: number) => {
    setSelectedChapters((prev) => (prev.includes(n) ? prev.filter((c) => c !== n) : [...prev, n]));
  }, []);

  const updateSection = useCallback(
    (idx: number, field: keyof PatternSection, value: string | number) => {
      setSections((prev) => prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s)));
    },
    []
  );

  const totalMarks = useMemo(() => calcTotalMarks(sections), [sections]);

  const handleGenerate = useCallback(() => {
    if (!currentSubject) return;
    setGenerating(true);

    const config: PaperConfig = {
      classLevel,
      boardId,
      subjectId,
      chapters: selectedChapters,
      sections,
      medium,
      timeMinutes,
      instituteName: instituteName || 'Model Examination',
      teacherName,
      totalMarks,
      shuffle,
      includeAnswerKey,
    };

    const chaptersToUse =
      selectedChapters.length > 0 ? selectedChapters : currentSubject.chapters.map((c) => c.number);

    const generatedSections = sections.map((sec) => {
      const typeMap: Record<string, QuestionType[]> = {
        mcq: ['mcq'],
        short: ['short', 'fill', 'truefalse'],
        long: ['long'],
        fill: ['fill'],
        truefalse: ['truefalse'],
        matching: ['matching'],
      };
      const types = typeMap[sec.questionType] || [sec.questionType];
      const pool = QUESTIONS.filter(
        (q) =>
          q.classLevel === classLevel &&
          q.subjectId === subjectId &&
          chaptersToUse.includes(q.chapter) &&
          types.includes(q.type)
      );
      const selected = sampleQuestions(pool, sec.totalQuestions, shuffle);
      return { section: sec, questions: selected };
    });

    setTimeout(() => {
      setPaper({ config, sections: generatedSections });
      setGenerating(false);
      setStep(5);
    }, 600);
  }, [
    classLevel,
    boardId,
    subjectId,
    selectedChapters,
    sections,
    medium,
    timeMinutes,
    instituteName,
    teacherName,
    totalMarks,
    shuffle,
    includeAnswerKey,
    currentSubject,
  ]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleDownloadPDF = useCallback(async () => {
    if (!paper) return;
    try {
      const res = await fetch('/api/paper-maker/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paper),
      });
      if (!res.ok) throw new Error('PDF generation failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `paper-class${paper.config.classLevel}-${paper.config.subjectId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('PDF download failed. Please use the Print option instead.');
    }
  }, [paper]);

  // ─── Render ─────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#f5f5f3] dark:bg-[#121212]">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-900 via-blue-800 to-sky-900 text-white px-4 py-6 print:hidden">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-black tracking-tight">📄 Exam Paper Generator</h1>
          <p className="text-white/60 text-sm mt-1">
            Create board-pattern papers for Pakistani Classes 1–12
          </p>
        </div>
      </div>

      {/* Step bar */}
      {step < 5 && (
        <div className="bg-white dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-white/10 print:hidden">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center gap-1 overflow-x-auto">
              {STEPS.map((s, i) => (
                <div key={s.id} className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => s.id < step && setStep(s.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      s.id === step
                        ? 'bg-sky-600 text-white'
                        : s.id < step
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 cursor-pointer hover:opacity-80'
                          : 'bg-gray-100 dark:bg-white/5 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                        s.id < step
                          ? 'bg-green-500 text-white'
                          : s.id === step
                            ? 'bg-white text-sky-600'
                            : 'bg-gray-300 dark:bg-white/10 text-gray-500'
                      }`}
                    >
                      {s.id < step ? '✓' : s.id}
                    </span>
                    {s.label}
                  </button>
                  {i < STEPS.length - 1 && (
                    <span className="text-gray-300 dark:text-white/20 text-xs">›</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-8 print:p-0">
        {/* ── STEP 1: Class & Board ── */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-200 dark:border-white/10 p-6">
              <h2 className="text-lg font-bold mb-5 text-gray-900 dark:text-white">Select Class</h2>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as ClassLevel[]).map((cl) => (
                  <button
                    key={cl}
                    onClick={() => handleClassChange(cl)}
                    className={`py-3 rounded-xl border-2 font-bold text-base transition-all ${
                      classLevel === cl
                        ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400'
                        : 'border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-sky-300'
                    }`}
                  >
                    <div>{cl}</div>
                    <div className="text-[10px] font-normal text-gray-500 mt-0.5">
                      {cl <= 5 ? 'Primary' : cl <= 8 ? 'Middle' : cl <= 10 ? 'Matric' : 'Inter'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-200 dark:border-white/10 p-6">
              <h2 className="text-lg font-bold mb-5 text-gray-900 dark:text-white">Select Board</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {BOARDS.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setBoardId(b.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      boardId === b.id
                        ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40'
                        : 'border-gray-200 dark:border-white/10 hover:border-sky-300'
                    }`}
                  >
                    <div
                      className={`font-semibold text-sm ${boardId === b.id ? 'text-sky-700 dark:text-sky-300' : 'text-gray-900 dark:text-white'}`}
                    >
                      {b.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">{b.province}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="px-8 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition-colors"
              >
                Next: Select Subject →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Subject & Chapters ── */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-200 dark:border-white/10 p-6">
              <h2 className="text-lg font-bold mb-5 text-gray-900 dark:text-white">
                Select Subject
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {subjects.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSubjectChange(s.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      subjectId === s.id
                        ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40'
                        : 'border-gray-200 dark:border-white/10 hover:border-sky-300'
                    }`}
                  >
                    <div
                      className={`font-bold text-sm ${subjectId === s.id ? 'text-sky-700 dark:text-sky-300' : 'text-gray-900 dark:text-white'}`}
                    >
                      {s.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5 font-urdu">{s.nameUrdu}</div>
                    <div className="text-[11px] text-gray-400 mt-1">
                      {s.chapters.length} chapters
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {currentSubject && (
              <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-200 dark:border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Select Chapters
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setSelectedChapters(currentSubject.chapters.map((c) => c.number))
                      }
                      className="text-xs text-sky-600 hover:underline"
                    >
                      Select All
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      onClick={() => setSelectedChapters([])}
                      className="text-xs text-gray-500 hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-4">
                  Leave all unchecked to include all chapters.
                </p>
                <div className="space-y-2">
                  {currentSubject.chapters.map((ch) => (
                    <label
                      key={ch.number}
                      className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedChapters.includes(ch.number)
                          ? 'border-sky-400 bg-sky-50/60 dark:bg-sky-950/30'
                          : 'border-gray-100 dark:border-white/5 hover:border-sky-200'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedChapters.includes(ch.number)}
                        onChange={() => toggleChapter(ch.number)}
                        className="mt-0.5 accent-sky-500"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-sm text-gray-900 dark:text-white">
                          Ch. {ch.number}: {ch.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">{ch.nameUrdu}</div>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {ch.topics.map((t) => (
                            <span
                              key={t}
                              className="text-[10px] bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 border border-gray-300 dark:border-white/20 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 font-medium transition-colors"
              >
                ← Back
              </button>
              <button
                disabled={!subjectId}
                onClick={() => setStep(3)}
                className="px-8 py-3 bg-sky-600 hover:bg-sky-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors"
              >
                Next: Paper Setup →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Paper Setup ── */}
        {step === 3 && (
          <div className="space-y-6">
            {/* Medium & Time */}
            <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-200 dark:border-white/10 p-6">
              <h2 className="text-lg font-bold mb-5 text-gray-900 dark:text-white">
                Paper Settings
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Medium
                  </label>
                  <div className="flex gap-2">
                    {(['english', 'urdu'] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => setMedium(m)}
                        className={`flex-1 py-2.5 rounded-lg border-2 text-sm font-semibold transition-all capitalize ${
                          medium === m
                            ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-600'
                            : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-sky-300'
                        }`}
                      >
                        {m === 'english' ? '🇬🇧 English' : '🇵🇰 Urdu'}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Time Allowed (minutes)
                  </label>
                  <input
                    type="number"
                    value={timeMinutes}
                    onChange={(e) => setTimeMinutes(Number(e.target.value))}
                    min={30}
                    max={360}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>
            </div>

            {/* Sections editor */}
            <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-200 dark:border-white/10 p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Sections & Marks
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Configure question types and marks distribution
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-sky-600">{totalMarks}</div>
                  <div className="text-xs text-gray-500">Total Marks</div>
                </div>
              </div>

              <div className="space-y-4">
                {sections.map((sec, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 dark:border-white/10 rounded-xl p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="font-semibold text-sm text-gray-900 dark:text-white">
                        {sec.title}
                      </div>
                      <div className="text-xs text-gray-500 font-medium bg-gray-100 dark:bg-white/5 px-2 py-1 rounded">
                        {sec.attemptQuestions} × {sec.marksPerQuestion} ={' '}
                        {sec.attemptQuestions * sec.marksPerQuestion} marks
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Total Questions</label>
                        <input
                          type="number"
                          value={sec.totalQuestions}
                          onChange={(e) =>
                            updateSection(idx, 'totalQuestions', Number(e.target.value))
                          }
                          min={1}
                          max={40}
                          className="w-full px-3 py-2 border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Attempt</label>
                        <input
                          type="number"
                          value={sec.attemptQuestions}
                          onChange={(e) =>
                            updateSection(idx, 'attemptQuestions', Number(e.target.value))
                          }
                          min={1}
                          max={sec.totalQuestions}
                          className="w-full px-3 py-2 border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Marks Each</label>
                        <input
                          type="number"
                          value={sec.marksPerQuestion}
                          onChange={(e) =>
                            updateSection(idx, 'marksPerQuestion', Number(e.target.value))
                          }
                          min={1}
                          max={20}
                          className="w-full px-3 py-2 border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                      </div>
                    </div>
                    <div className="mt-2">
                      <label className="block text-xs text-gray-500 mb-1">Instructions</label>
                      <input
                        type="text"
                        value={sec.instructions}
                        onChange={(e) => updateSection(idx, 'instructions', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-200 dark:border-white/10 p-6">
              <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Options</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shuffle}
                    onChange={(e) => setShuffle(e.target.checked)}
                    className="w-4 h-4 accent-sky-500"
                  />
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      Shuffle Questions
                    </div>
                    <div className="text-xs text-gray-500">
                      Randomize question order to prevent cheating
                    </div>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeAnswerKey}
                    onChange={(e) => setIncludeAnswerKey(e.target.checked)}
                    className="w-4 h-4 accent-sky-500"
                  />
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      Include Answer Key
                    </div>
                    <div className="text-xs text-gray-500">
                      Append an answer key at the end (for teachers)
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 border border-gray-300 dark:border-white/20 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 font-medium transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="px-8 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition-colors"
              >
                Next: Branding →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: Branding ── */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-200 dark:border-white/10 p-6">
              <h2 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                Institute Branding
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Optional — leave blank to use board name only.
              </p>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Institute / School Name
                  </label>
                  <input
                    type="text"
                    value={instituteName}
                    onChange={(e) => setInstituteName(e.target.value)}
                    placeholder="e.g. Punjab Model High School, Lahore"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Teacher / Examiner Name
                  </label>
                  <input
                    type="text"
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    placeholder="e.g. Mr. Ahmed Raza"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>
            </div>

            {/* Summary card */}
            <div className="bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 rounded-2xl p-6">
              <h3 className="font-bold text-sky-800 dark:text-sky-300 mb-4">Paper Summary</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                {[
                  {
                    label: 'Class',
                    value: `Class ${classLevel} (${classLevel <= 10 ? 'Matric' : 'Intermediate'})`,
                  },
                  { label: 'Board', value: BOARDS.find((b) => b.id === boardId)?.name || boardId },
                  { label: 'Subject', value: currentSubject?.name || subjectId },
                  { label: 'Total Marks', value: String(totalMarks) },
                  { label: 'Time', value: `${timeMinutes} min` },
                  { label: 'Medium', value: medium.charAt(0).toUpperCase() + medium.slice(1) },
                  {
                    label: 'Chapters',
                    value:
                      selectedChapters.length > 0
                        ? `${selectedChapters.length} selected`
                        : 'All chapters',
                  },
                  { label: 'Sections', value: String(sections.length) },
                  { label: 'Answer Key', value: includeAnswerKey ? 'Yes' : 'No' },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="text-xs text-sky-600 dark:text-sky-400 font-semibold uppercase tracking-wider">
                      {item.label}
                    </div>
                    <div className="text-gray-900 dark:text-white font-medium mt-0.5">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(3)}
                className="px-6 py-3 border border-gray-300 dark:border-white/20 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 font-medium transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-bold rounded-xl transition-colors flex items-center gap-2"
              >
                {generating ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Generating Paper…
                  </>
                ) : (
                  '🎉 Generate Paper'
                )}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 5: Preview & Export ── */}
        {step === 5 && paper && (
          <div>
            {/* Action bar - no print */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 print:hidden">
              <button
                onClick={() => {
                  setPaper(null);
                  setStep(1);
                }}
                className="px-4 py-2 border border-gray-300 dark:border-white/20 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                ← New Paper
              </button>
              <div className="flex gap-2">
                <button
                  onClick={handlePrint}
                  className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
                >
                  🖨️ Print
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
                >
                  ⬇️ Download PDF
                </button>
              </div>
            </div>

            {/* Paper preview */}
            <PaperPreview paper={paper} />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Paper Preview Component ─────────────────────────────────────

function PaperPreview({ paper }: { paper: GeneratedPaper }) {
  const { config, sections } = paper;
  const board = BOARDS.find((b) => b.id === config.boardId);
  const subject = SUBJECTS.find((s) => s.id === config.subjectId);

  return (
    <div className="print:block">
      <div className="bg-white dark:bg-[#1e1e1e] print:bg-white rounded-2xl border border-gray-200 dark:border-white/10 print:border-0 print:rounded-none overflow-hidden">
        {/* Paper Header */}
        <div className="border-b-4 border-gray-900 p-6 print:p-4">
          {config.instituteName && (
            <div className="text-center text-xl font-black text-gray-900 mb-1 print:text-black">
              {config.instituteName}
            </div>
          )}
          <div className="text-center text-sm text-gray-600 mb-4 print:text-black">
            {board?.name} — Annual Examination {new Date().getFullYear()}
          </div>

          <div className="grid grid-cols-3 text-sm border border-gray-300 print:border-black">
            <div className="p-2 border-r border-gray-300 print:border-black">
              <div className="text-xs text-gray-500 print:text-gray-700 uppercase font-semibold">
                Subject
              </div>
              <div className="font-bold text-gray-900 print:text-black">{subject?.name}</div>
              <div className="text-xs text-gray-500 print:text-gray-700">{subject?.nameUrdu}</div>
            </div>
            <div className="p-2 border-r border-gray-300 print:border-black text-center">
              <div className="text-xs text-gray-500 print:text-gray-700 uppercase font-semibold">
                Class
              </div>
              <div className="font-bold text-gray-900 print:text-black">
                Class {config.classLevel}
              </div>
              <div className="text-xs text-gray-500 print:text-gray-700">
                {config.classLevel <= 10 ? 'Matric' : 'Intermediate'}
              </div>
            </div>
            <div className="p-2 text-right">
              <div className="text-xs text-gray-500 print:text-gray-700 uppercase font-semibold">
                Total Marks
              </div>
              <div className="font-bold text-gray-900 print:text-black text-lg">
                {config.totalMarks}
              </div>
              <div className="text-xs text-gray-500 print:text-gray-700">
                Time: {config.timeMinutes} min
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
            <div className="border-b-2 border-dotted border-gray-400 pb-1">
              <span className="text-xs text-gray-500">Student Name: </span>
            </div>
            <div className="border-b-2 border-dotted border-gray-400 pb-1">
              <span className="text-xs text-gray-500">Roll Number: </span>
            </div>
            <div className="border-b-2 border-dotted border-gray-400 pb-1">
              <span className="text-xs text-gray-500">Date: </span>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="p-6 print:p-4 space-y-8 print:space-y-6">
          {sections.map(({ section, questions }, secIdx) => (
            <div key={secIdx} className="print:break-inside-avoid-page">
              {/* Section header */}
              <div className="bg-gray-100 dark:bg-white/5 print:bg-gray-100 border border-gray-300 dark:border-white/20 print:border-gray-400 rounded-lg p-3 mb-4">
                <div className="font-black text-gray-900 dark:text-white print:text-black">
                  {section.title}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 print:text-gray-700 mt-0.5">
                  {section.instructions}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  ({section.attemptQuestions} questions × {section.marksPerQuestion} marks ={' '}
                  {section.attemptQuestions * section.marksPerQuestion} marks)
                </div>
              </div>

              {questions.length === 0 ? (
                <div className="text-center py-8 text-gray-400 italic text-sm">
                  Not enough questions in question bank for this section. Please add more questions
                  or adjust chapters.
                </div>
              ) : (
                <div className="space-y-4">
                  {questions.map((q, qIdx) => (
                    <QuestionItem
                      key={q.id}
                      question={q}
                      number={qIdx + 1}
                      marks={section.marksPerQuestion}
                      sectionType={section.questionType}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Answer Key */}
          {config.includeAnswerKey && (
            <div className="mt-12 print:break-before-page border-t-4 border-double border-gray-400 pt-6">
              <h2 className="text-xl font-black text-gray-900 dark:text-white print:text-black mb-4 text-center">
                — ANSWER KEY —
              </h2>
              <p className="text-xs text-center text-gray-500 mb-6">
                (For Teacher Use Only — Do not distribute to students)
              </p>
              {sections.map(({ section, questions }, secIdx) => (
                <div key={secIdx} className="mb-6">
                  <h3 className="font-bold text-gray-800 dark:text-gray-200 print:text-black mb-2 text-sm uppercase tracking-wide">
                    {section.title}
                  </h3>
                  {section.questionType === 'mcq' ? (
                    <div className="flex flex-wrap gap-3">
                      {questions.map((q, i) => (
                        <div key={q.id} className="text-sm">
                          <span className="text-gray-500">{i + 1}.</span>
                          <span className="font-bold text-sky-700 dark:text-sky-400 ml-1">
                            {q.answer}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {questions.map((q, i) => (
                        <div key={q.id} className="text-sm">
                          <span className="font-semibold text-gray-700 dark:text-gray-300 print:text-black">
                            Q{i + 1}:
                          </span>
                          <span className="text-gray-600 dark:text-gray-400 print:text-gray-700 ml-2">
                            {q.answer}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-white/10 print:border-gray-300 px-6 py-3 flex justify-between text-xs text-gray-400 print:text-gray-500">
          <span>Generated by RoughTools.com — Free Exam Paper Generator</span>
          {config.teacherName && <span>Prepared by: {config.teacherName}</span>}
        </div>
      </div>
    </div>
  );
}

// ─── Individual Question ──────────────────────────────────────────

function QuestionItem({
  question,
  number,
  marks,
  sectionType,
}: {
  question: Question;
  number: number;
  marks: number;
  sectionType: QuestionType;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 font-bold text-gray-900 dark:text-white print:text-black text-sm w-6">
        {number}.
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm text-gray-900 dark:text-white print:text-black leading-relaxed">
            {question.question}
          </p>
          <span className="flex-shrink-0 text-xs font-bold text-gray-500 print:text-gray-600 border border-gray-300 rounded px-1.5 py-0.5">
            {marks}
          </span>
        </div>

        {/* MCQ options */}
        {question.type === 'mcq' && question.options && (
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-2">
            {question.options.map((opt, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 print:text-black"
              >
                <span className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </div>
            ))}
          </div>
        )}

        {/* Short/Long: blank lines */}
        {sectionType === 'short' && (
          <div className="mt-3 space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="border-b border-dotted border-gray-300 dark:border-white/20 print:border-gray-400 h-5"
              />
            ))}
          </div>
        )}
        {sectionType === 'long' && (
          <div className="mt-3 space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="border-b border-dotted border-gray-300 dark:border-white/20 print:border-gray-400 h-5"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
