import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

export const metadata: Metadata = {
  title: 'Notes Maker — Free Block-Based Notes Editor for Students Classes 1–12 | RoughTools',
  description:
    'Create beautiful study notes with headings, bullets, formulas, flashcards, and definitions. Works offline in your browser. Print-ready PDF. Free for Pakistani students Classes 1–12. No signup.',
  keywords: [
    'notes maker',
    'study notes maker',
    'notes editor online',
    'block notes editor',
    'student notes pakistan',
    'class notes maker',
    'digital notes editor',
    'free notes maker',
    'printable notes',
    'flashcard maker',
    'formula notes editor',
    'offline notes maker',
    'notes for class 9 10',
    'matric notes maker',
    'intermediate notes',
    'urdu notes maker',
    'study organizer online',
    'academic notes tool',
    'notes without signup',
    'browser notes editor',
  ],
  alternates: { canonical: 'https://roughtools.com/tools/notes-maker/app' },
  openGraph: {
    title: 'Notes Maker — Free Block-Based Notes Editor | RoughTools',
    description:
      'Block-based note editor for Classes 1–12 students. Headings, bullets, formulas, flashcards — saved offline and print-ready. Free, no signup.',
    url: 'https://roughtools.com/tools/notes-maker/app',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Notes Maker — Free Study Notes Editor for Students | RoughTools',
    description: 'Block-based notes for Pakistani students. Offline, printable, free. No signup.',
  },
  robots: { index: true, follow: true },
};

const NotesMakerClient = dynamic(() => import('./NotesMakerClient'), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#f5f5f3] dark:bg-[#121212] animate-pulse" />,
});

export default function NotesMakerPage() {
  return <NotesMakerClient />;
}
