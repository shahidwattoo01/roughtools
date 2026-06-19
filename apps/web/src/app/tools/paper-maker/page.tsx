import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Paper Maker — Free Exam Paper Generator for Pakistani Boards | RoughTools',
  description:
    'Free exam paper generator for Pakistani teachers. Generate board-pattern question papers for Matric and Intermediate (Classes 9–12). Lahore, Faisalabad, Federal and more boards. No signup required.',
  alternates: { canonical: 'https://roughtools.com/tools/paper-maker' },
};

const TOOLS = [
  {
    name: 'Exam Paper Generator',
    desc: 'Generate complete board-pattern exam papers for Classes 9–12. Select class, board, subject and chapters — download a ready-to-print PDF.',
    emoji: '📄',
    href: '/tools/paper-maker/generate',
    badge: 'Live',
    badgeColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  {
    name: 'MCQ Question Bank',
    desc: 'Browse and filter MCQs by subject, chapter, and difficulty. Reveal answers to study or verify.',
    emoji: '✅',
    href: '/tools/paper-maker/mcq-bank',
    badge: 'Live',
    badgeColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  {
    name: 'Class Test Builder',
    desc: 'Build short class tests in 30 seconds. Set custom MCQ and short question counts, time, and marks.',
    emoji: '🧪',
    href: '/tools/paper-maker/class-test',
    badge: 'Live',
    badgeColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  {
    name: 'Answer Key Generator',
    desc: 'Auto-generate formatted answer keys from the question bank, or enter answers manually.',
    emoji: '🔑',
    href: '/tools/paper-maker/answer-key',
    badge: 'Live',
    badgeColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  {
    name: 'Paper Shuffler',
    desc: 'Create Set A, B, C, D with shuffled questions and MCQ options — prevents cheating in exams.',
    emoji: '🔀',
    href: '/tools/paper-maker/paper-shuffler',
    badge: 'Live',
    badgeColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  {
    name: 'Bilingual Paper Maker',
    desc: 'Generate papers in English only, Urdu only, or bilingual format with both languages side by side.',
    emoji: '🌐',
    href: '/tools/paper-maker/bilingual',
    badge: 'Live',
    badgeColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
];

const BOARDS = [
  'Lahore',
  'Faisalabad',
  'Multan',
  'Gujranwala',
  'Rawalpindi',
  'Federal',
  'Sindh',
  'Balochistan',
  'KP',
];
const SUBJECTS = [
  'Physics',
  'Chemistry',
  'Biology',
  'Mathematics',
  'Computer Science',
  'English',
  'Urdu',
  'Islamiat',
  'Pak. Studies',
];

export default function PaperMakerPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f3] dark:bg-[#121212]">
      {/* Hero */}
      <section className="bg-gradient-to-br from-sky-900 via-blue-800 to-sky-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-green-400/20 border border-green-400/30 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-green-300 mb-6">
            🟢 Now Live — Phase 1
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight mb-4">
            Paper Maker
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-3">
            Free exam paper generation for Pakistani teachers. Generate complete board-pattern
            papers for Matric & Intermediate — no composing, no formatting, no signup.
          </p>
          <p className="text-sm text-white/50 mb-8">
            Classes 9–12 · 9 boards · English & Urdu medium · MCQ, Short & Long questions · PDF
            download
          </p>
          <Link
            href="/tools/paper-maker/generate"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-sky-900 font-black rounded-2xl hover:scale-105 transition-transform text-lg shadow-xl"
          >
            📄 Generate Exam Paper — Free
          </Link>
        </div>
      </section>

      {/* Board & Subject chips */}
      <div className="bg-white dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-white/10 py-4">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {BOARDS.map((b) => (
              <span
                key={b}
                className="text-xs px-3 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-300 font-medium border border-sky-200 dark:border-sky-800"
              >
                {b} Board
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {SUBJECTS.map((s) => (
              <span
                key={s}
                className="text-xs px-3 py-1.5 rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 font-medium"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8 text-center">
          Generate a paper in under 60 seconds
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { step: '1', label: 'Select Class & Board', icon: '🎓' },
            { step: '2', label: 'Choose Subject & Chapters', icon: '📚' },
            { step: '3', label: 'Configure Marks & Sections', icon: '⚙️' },
            { step: '4', label: 'Preview & Download PDF', icon: '📄' },
          ].map((s) => (
            <div
              key={s.step}
              className="bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-white/10 rounded-2xl p-5 text-center"
            >
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className="text-xs font-black text-sky-600 dark:text-sky-400 mb-1">
                Step {s.step}
              </div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tools grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">All Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOOLS.map((tool) => {
            const inner = (
              <div
                className={`flex flex-col p-5 rounded-2xl border bg-white dark:bg-[#1e1e1e] border-gray-200 dark:border-white/10 h-full ${tool.href ? 'hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer' : 'opacity-70'}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl">{tool.emoji}</div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${tool.badgeColor}`}
                  >
                    {tool.badge}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-[15px] mb-1">
                  {tool.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed flex-1">
                  {tool.desc}
                </p>
                {tool.href && (
                  <div className="mt-4 text-sm font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1">
                    Open Tool <span>→</span>
                  </div>
                )}
              </div>
            );

            return tool.href ? (
              <Link key={tool.name} href={tool.href} className="flex flex-col">
                {inner}
              </Link>
            ) : (
              <div key={tool.name}>{inner}</div>
            );
          })}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl border border-gray-100 dark:border-white/10 p-8 sm:p-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Everything is free. Always.
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              '✓ Board-pattern papers (official marks distribution)',
              '✓ Classes 9, 10, 11, 12 — Matric & Intermediate',
              '✓ 9 Pakistani boards including Lahore, Federal, Sindh',
              '✓ Physics, Chemistry, Biology, Maths, Computer, English & more',
              '✓ MCQ, Short Answer, Long Answer question types',
              '✓ Auto-generated Answer Key for teachers',
              '✓ Download as PDF — print-ready A4 format',
              '✓ English & Urdu medium',
              '✓ Shuffle questions for multiple paper sets',
              '✓ Add institute name & teacher branding',
              '✓ Guest mode — no signup, no account needed',
              '✓ No watermarks, no limits, no payment',
            ].map((f) => (
              <div
                key={f}
                className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
              >
                <span className="text-green-500 font-bold flex-shrink-0 mt-0.5">✓</span>
                <span>{f.slice(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Back */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          ← Back to all categories
        </Link>
      </div>
    </div>
  );
}
