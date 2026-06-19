import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

export const metadata: Metadata = {
  title: 'Bilingual Paper Maker — English & Urdu Papers | RoughTools',
  description:
    'Generate exam papers in English, Urdu, or bilingual format with both languages side by side. Perfect for all Pakistani boards and mediums.',
  alternates: { canonical: 'https://roughtools.com/tools/paper-maker/bilingual' },
};

const BilingualClient = dynamic(() => import('./BilingualClient'), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#f5f5f3] dark:bg-[#121212] animate-pulse" />,
});

export default function BilingualPage() {
  return <BilingualClient />;
}
