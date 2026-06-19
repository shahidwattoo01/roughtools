import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

export const metadata: Metadata = {
  title: 'Paper Shuffler — Create Set A B C D | RoughTools',
  description:
    'Generate multiple versions (Set A, B, C, D) of the same exam paper with shuffled questions and MCQ options. Prevent cheating in class exams.',
  alternates: { canonical: 'https://roughtools.com/tools/paper-maker/paper-shuffler' },
};

const PaperShufflerClient = dynamic(() => import('./PaperShufflerClient'), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#f5f5f3] dark:bg-[#121212] animate-pulse" />,
});

export default function PaperShufflerPage() {
  return <PaperShufflerClient />;
}
