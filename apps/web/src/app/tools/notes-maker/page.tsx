import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Notes Maker — Free Student Notes Editor for Classes 1–12 | RoughTools',
  description:
    'Free block-based notes editor for Pakistani students and teachers (Classes 1–12). Create headings, bullets, formulas, flashcards, definitions — all saved offline. No signup.',
  alternates: { canonical: 'https://roughtools.com/tools/notes-maker' },
};

const FEATURES = [
  {
    emoji: '📝',
    title: 'Block Editor',
    desc: 'Headings, paragraphs, bullets, numbered lists, formulas, definitions, and more — all as drag-friendly blocks.',
  },
  {
    emoji: '🃏',
    title: 'Flashcards',
    desc: 'Create flip-card flashcards with front (question) and back (answer) — great for memorisation.',
  },
  {
    emoji: '⚠️',
    title: 'Important Blocks',
    desc: 'Highlight critical points with red-bordered callout boxes that stand out in print.',
  },
  {
    emoji: '📐',
    title: 'Formula Blocks',
    desc: 'Write equations and formulas in a monospace editor with yellow background — always legible.',
  },
  {
    emoji: '🖨️',
    title: 'Print Ready',
    desc: 'One-click print — editor chrome hides, notes render clean A4 format for revision sheets.',
  },
  {
    emoji: '💾',
    title: 'Offline Storage',
    desc: "Everything is saved to your browser's local storage — works without internet, zero data sent.",
  },
  {
    emoji: '🎓',
    title: 'Classes 1–12',
    desc: 'Tag each note by class (1–12), subject, chapter, and note type. Filter and search your library.',
  },
  {
    emoji: '🌈',
    title: '8 Note Colors',
    desc: 'Color-code your notes — yellow for maths, blue for science, pink for Urdu — instantly visual.',
  },
];

const NOTE_TYPES = [
  { label: 'Summary', emoji: '📖' },
  { label: 'Key Points', emoji: '🔑' },
  { label: 'Formulas', emoji: '📐' },
  { label: 'Glossary', emoji: '📚' },
  { label: 'Flashcards', emoji: '🃏' },
  { label: 'Experiment', emoji: '🧪' },
  { label: 'General', emoji: '📝' },
];

export default function NotesMakerPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f3] dark:bg-[#121212]">
      {/* Hero */}
      <section className="bg-gradient-to-br from-violet-900 via-purple-800 to-violet-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-purple-200 mb-6">
            📝 Free · Offline · No Signup
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight mb-4">
            Notes Maker
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-3">
            A lightweight, block-based note editor built for Pakistani students and teachers.
            Classes 1–12, offline-first, print-ready.
          </p>
          <p className="text-sm text-white/50 mb-8">
            Headings · Bullets · Formulas · Definitions · Flashcards · Images · Print PDF
          </p>
          <Link
            href="/tools/notes-maker/app"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-violet-900 font-black rounded-2xl hover:scale-105 transition-transform text-lg shadow-xl"
          >
            📝 Open Notes Editor — Free
          </Link>
        </div>
      </section>

      {/* Note type chips */}
      <div className="bg-white dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-white/10 py-4">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {NOTE_TYPES.map((t) => (
              <span
                key={t.label}
                className="text-xs px-3 py-1.5 rounded-full bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300 font-medium border border-violet-200 dark:border-violet-800"
              >
                {t.emoji} {t.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8 text-center">
          Create a note in seconds
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { step: '1', label: 'Create a new note', icon: '📝' },
            { step: '2', label: 'Add blocks — headings, formulas, bullets', icon: '🧱' },
            { step: '3', label: 'Tag with class, subject & type', icon: '🏷️' },
            { step: '4', label: 'Print or study from your library', icon: '🖨️' },
          ].map((s) => (
            <div
              key={s.step}
              className="bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-white/10 rounded-2xl p-5 text-center"
            >
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className="text-xs font-black text-violet-600 dark:text-violet-400 mb-1">
                Step {s.step}
              </div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="flex flex-col p-5 rounded-2xl border bg-white dark:bg-[#1e1e1e] border-gray-200 dark:border-white/10"
            >
              <div className="text-3xl mb-3">{f.emoji}</div>
              <h3 className="font-bold text-gray-900 dark:text-white text-[15px] mb-1">
                {f.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed flex-1">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-3xl p-8 text-center text-white">
          <h2 className="text-2xl font-black mb-3">Start taking notes — it&apos;s free</h2>
          <p className="text-white/70 mb-6 text-sm">
            No account, no internet required. Your notes are stored securely in your browser.
          </p>
          <Link
            href="/tools/notes-maker/app"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-violet-700 font-black rounded-xl hover:scale-105 transition-transform"
          >
            Open Notes Editor →
          </Link>
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
