import dynamic from 'next/dynamic';

const NotesMakerClient = dynamic(() => import('./NotesMakerClient'), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#f5f5f3] dark:bg-[#121212] animate-pulse" />,
});

export default function NotesMakerPage() {
  return <NotesMakerClient />;
}
