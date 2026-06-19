import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import PaperMakerToolShell from '@/components/PaperMakerToolShell';

export const metadata: Metadata = {
  title: 'Free Exam Paper Generator — Classes 1–12 Pakistani Boards | RoughTools',
  description:
    'Generate complete board-pattern exam papers for Classes 1–12 in seconds. MCQs, short questions, long questions — Pakistani boards (Lahore, Federal, Sindh & more). Print-ready PDF. No signup.',
  keywords: [
    'exam paper generator',
    'paper maker pakistan',
    'question paper generator',
    'board paper generator',
    'matric paper generator',
    'intermediate paper maker',
    'class 9 paper generator',
    'class 10 paper generator',
    'class 11 paper maker',
    'class 12 paper maker',
    'lahore board paper',
    'federal board paper',
    'free exam paper maker',
    'printable exam paper',
    'mcq paper generator',
    'urdu medium paper',
    'english medium paper',
    'pakistan board paper generator',
  ],
  alternates: { canonical: 'https://roughtools.com/tools/paper-maker/generate' },
  openGraph: {
    title: 'Free Exam Paper Generator — Classes 1–12 Pakistani Boards | RoughTools',
    description:
      'Generate complete board-pattern exam papers for Classes 1–12. MCQs, short & long questions for all Pakistani boards. Free, no signup, print-ready PDF.',
    url: 'https://roughtools.com/tools/paper-maker/generate',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Exam Paper Generator — Classes 1–12 | RoughTools',
    description:
      'Generate complete board-pattern exam papers instantly. All Pakistani boards, Classes 1–12. Free & no signup.',
  },
  robots: { index: true, follow: true },
};

const PaperGeneratorClient = dynamic(() => import('./PaperGeneratorClient'), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#f5f5f3] dark:bg-[#121212] animate-pulse" />,
});

const SITE = 'https://roughtools.com';

const schemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Paper Maker', item: `${SITE}/tools/paper-maker` },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Exam Paper Generator',
        item: `${SITE}/tools/paper-maker/generate`,
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Exam Paper Generator',
    url: `${SITE}/tools/paper-maker/generate`,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description:
      'Generate complete board-pattern exam papers for Classes 1–12 Pakistani boards. Free, no signup.',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Which Pakistani boards are supported?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'All major boards: Lahore, Faisalabad, Multan, Gujranwala, Rawalpindi, Federal, Sindh, Balochistan, and KP board.',
        },
      },
      {
        '@type': 'Question',
        name: 'Which classes can I generate papers for?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Classes 1 through 12 — Primary, Middle, Matric (9–10), and Intermediate (11–12).',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I download the paper as PDF?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, every generated paper has a one-click print/PDF download button. No watermarks, completely free.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can teachers add their own questions?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes — use the Custom Questions panel in Step 2 to add, edit, or upload MCQs with images. Custom questions are saved locally in your browser.',
        },
      },
    ],
  },
];

const faqs = [
  {
    q: 'Which Pakistani boards are supported?',
    a: 'All major boards: Lahore, Faisalabad, Multan, Gujranwala, Rawalpindi, Federal, Sindh, Balochistan, and KP board.',
  },
  {
    q: 'Which classes can I generate papers for?',
    a: 'Classes 1 through 12 — Primary, Middle, Matric (9–10), and Intermediate (11–12).',
  },
  {
    q: 'Can I download the paper as PDF?',
    a: 'Yes, every generated paper has a one-click print/PDF download button. No watermarks, completely free.',
  },
  {
    q: 'Can teachers add their own questions?',
    a: 'Yes — use the Custom Questions panel in Step 2 to add, edit, or upload MCQs with images. Custom questions are saved locally in your browser.',
  },
  {
    q: 'Is it really free?',
    a: 'Yes — no signup, no account, no payment. All features including PDF download are completely free.',
  },
];

const howToSteps = [
  {
    title: 'Select Class & Board',
    description: 'Choose your class (1–12) and Pakistani board (Lahore, Federal, Sindh, etc.).',
  },
  {
    title: 'Choose Subject & Chapters',
    description: 'Pick the subject and select specific chapters or use all chapters.',
  },
  {
    title: 'Configure Marks & Sections',
    description:
      'Set MCQ count, short questions, long questions, marks per section, and time limit.',
  },
  {
    title: 'Preview & Download PDF',
    description: 'Click Generate — preview your paper instantly and print or download as PDF.',
  },
];

const relatedTools = [
  { slug: 'mcq-bank', name: 'MCQ Question Bank', emoji: '✅', href: '/tools/paper-maker/mcq-bank' },
  {
    slug: 'class-test',
    name: 'Class Test Builder',
    emoji: '🧪',
    href: '/tools/paper-maker/class-test',
  },
  {
    slug: 'answer-key',
    name: 'Answer Key Generator',
    emoji: '🔑',
    href: '/tools/paper-maker/answer-key',
  },
  {
    slug: 'paper-shuffler',
    name: 'Paper Shuffler',
    emoji: '🔀',
    href: '/tools/paper-maker/paper-shuffler',
  },
  {
    slug: 'bilingual',
    name: 'Bilingual Paper Maker',
    emoji: '🌐',
    href: '/tools/paper-maker/bilingual',
  },
  { slug: 'notes-maker', name: 'Notes Maker', emoji: '📝', href: '/tools/notes-maker/app' },
];

const aboutText = [
  'The Exam Paper Generator is a free tool built specifically for Pakistani teachers. It generates complete board-pattern question papers for Classes 1–12 in seconds — including MCQs, short answer, and long answer sections formatted exactly as required by Lahore, Federal, Sindh, and other boards.',
  'Unlike generic paper generators, this tool uses the actual marks distribution and question patterns from Pakistani boards. Teachers can add their own custom questions, select specific chapters, and choose between English and Urdu medium output.',
  'All processing happens in your browser. No account is required, no files are uploaded to any server, and PDF output is completely free with no watermarks.',
];

export default function PaperGeneratorPage() {
  return (
    <PaperMakerToolShell
      toolName="Exam Paper Generator"
      toolSlug="paper-maker-generate"
      tagline="Generate complete board-pattern exam papers in seconds"
      aboutText={aboutText}
      faqs={faqs}
      relatedTools={relatedTools}
      schemas={schemas}
      howToSteps={howToSteps}
      features={[
        'No signup required',
        'Free PDF download',
        'All Pakistani boards',
        'Classes 1–12',
        'No watermarks',
      ]}
    >
      <PaperGeneratorClient />
    </PaperMakerToolShell>
  );
}
