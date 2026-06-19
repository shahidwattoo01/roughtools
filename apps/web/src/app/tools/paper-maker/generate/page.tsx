import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

export const metadata: Metadata = {
  title: 'Exam Paper Generator — Class 9-12 | RoughTools',
  description:
    'Free exam paper generator for Pakistani boards. Select class, board, subject and chapters — generate a complete board-pattern exam paper with MCQs, short and long questions. Download PDF instantly.',
  alternates: { canonical: 'https://roughtools.com/tools/paper-maker/generate' },
};

const PaperGeneratorClient = dynamic(() => import('./PaperGeneratorClient'), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#f5f5f3] dark:bg-[#121212] animate-pulse" />,
});

export default function PaperGeneratorPage() {
  return <PaperGeneratorClient />;
}
