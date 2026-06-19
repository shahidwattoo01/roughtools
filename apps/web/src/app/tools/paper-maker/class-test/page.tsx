import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

export const metadata: Metadata = {
  title: 'Class Test Builder — Quick Class Tests | RoughTools',
  description:
    'Build short class tests in minutes. Select subject and chapters, set marks and time, generate a printable test. Perfect for weekly class assessments.',
  alternates: { canonical: 'https://roughtools.com/tools/paper-maker/class-test' },
};

const ClassTestClient = dynamic(() => import('./ClassTestClient'), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#f5f5f3] dark:bg-[#121212] animate-pulse" />,
});

export default function ClassTestPage() {
  return <ClassTestClient />;
}
