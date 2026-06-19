import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

export const metadata: Metadata = {
  title: 'MCQ Question Bank — Browse & Filter MCQs | RoughTools',
  description:
    'Browse thousands of MCQs for Pakistani board exams. Filter by class, subject, chapter, and difficulty. Perfect for exam prep and paper making.',
  alternates: { canonical: 'https://roughtools.com/tools/paper-maker/mcq-bank' },
};

const MCQBankClient = dynamic(() => import('./MCQBankClient'), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#f5f5f3] dark:bg-[#121212] animate-pulse" />,
});

export default function MCQBankPage() {
  return <MCQBankClient />;
}
