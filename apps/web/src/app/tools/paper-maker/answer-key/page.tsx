import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

export const metadata: Metadata = {
  title: 'Answer Key Generator — Auto MCQ Answer Keys | RoughTools',
  description:
    'Generate formatted answer keys for MCQ papers instantly. Select class, subject and chapters — get a printable answer key table for teachers.',
  alternates: { canonical: 'https://roughtools.com/tools/paper-maker/answer-key' },
};

const AnswerKeyClient = dynamic(() => import('./AnswerKeyClient'), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#f5f5f3] dark:bg-[#121212] animate-pulse" />,
});

export default function AnswerKeyPage() {
  return <AnswerKeyClient />;
}
