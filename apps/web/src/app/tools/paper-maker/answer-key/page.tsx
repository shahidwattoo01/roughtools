import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import PaperMakerToolShell from '@/components/PaperMakerToolShell';

export const metadata: Metadata = {
  title: 'Answer Key Generator — Auto MCQ Answer Keys for Pakistani Boards | RoughTools',
  description:
    'Auto-generate printable answer keys for MCQ exam papers instantly. Select class (1–12), subject and chapters. Enter answers manually or generate from question bank. Free for Pakistani teachers.',
  keywords: [
    'answer key generator pakistan',
    'mcq answer key',
    'exam answer key maker',
    'board exam answer key',
    'marking scheme generator',
    'matric answer key',
    'intermediate answer key',
    'physics answer key',
    'chemistry answer key',
    'biology answer key',
    'maths answer key',
    'free answer key generator',
    'printable answer key',
    'teacher answer key tool',
    'pakistan board answer key',
  ],
  alternates: { canonical: 'https://roughtools.com/tools/paper-maker/answer-key' },
  openGraph: {
    title: 'Answer Key Generator — Auto MCQ Answer Keys Pakistani Boards | RoughTools',
    description:
      'Auto-generate printable MCQ answer keys for Classes 1–12 Pakistani boards. Free for teachers.',
    url: 'https://roughtools.com/tools/paper-maker/answer-key',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Answer Key Generator — Pakistani Board MCQs | RoughTools',
    description:
      'Generate printable MCQ answer keys instantly. Classes 1–12, all Pakistani boards. Free.',
  },
  robots: { index: true, follow: true },
};

const AnswerKeyClient = dynamic(() => import('./AnswerKeyClient'), {
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
        name: 'Answer Key Generator',
        item: `${SITE}/tools/paper-maker/answer-key`,
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Answer Key Generator',
    url: `${SITE}/tools/paper-maker/answer-key`,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Auto-generate printable MCQ answer keys for Classes 1–12 Pakistani board exams.',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Can I generate an answer key automatically?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes — select class, subject and chapters and the tool pulls the correct answers from the question bank automatically.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I enter answers manually?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes — you can also type answers manually for any custom or external paper.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is the answer key printable?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes — click Print to get a clean formatted answer key table, ready for teachers to use in marking.',
        },
      },
    ],
  },
];

const faqs = [
  {
    q: 'Can I generate an answer key automatically?',
    a: 'Yes — select class, subject and chapters and the tool pulls the correct answers from the question bank automatically.',
  },
  {
    q: 'Can I enter answers manually?',
    a: 'Yes — you can also type answers manually for any custom or external paper.',
  },
  {
    q: 'Is the answer key printable?',
    a: 'Yes — click Print to get a clean formatted answer key table, ready for teachers to use in marking.',
  },
  {
    q: 'Does it work with papers I generate in Exam Paper Generator?',
    a: 'Yes — papers created in the Exam Paper Generator automatically have an answer key available. You can also generate standalone answer keys for external papers.',
  },
  {
    q: 'Is this free for teachers?',
    a: 'Completely free. No account, no signup, no limit on how many answer keys you generate.',
  },
];

const howToSteps = [
  {
    title: 'Select Class & Subject',
    description: 'Choose the class (1–12) and subject to load the question bank.',
  },
  {
    title: 'Choose Chapters',
    description: 'Select the chapters covered in the exam paper you want an answer key for.',
  },
  {
    title: 'Auto-Generate or Enter Manually',
    description:
      'Click Auto-Generate to pull answers from the question bank, or type answers manually.',
  },
  {
    title: 'Print the Answer Key',
    description:
      'Click Print for a clean, formatted answer key table — no watermarks, ready to use.',
  },
];

const relatedTools = [
  {
    slug: 'generate',
    name: 'Exam Paper Generator',
    emoji: '📄',
    href: '/tools/paper-maker/generate',
  },
  { slug: 'mcq-bank', name: 'MCQ Question Bank', emoji: '✅', href: '/tools/paper-maker/mcq-bank' },
  {
    slug: 'class-test',
    name: 'Class Test Builder',
    emoji: '🧪',
    href: '/tools/paper-maker/class-test',
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
  'The Answer Key Generator saves Pakistani teachers from manually noting down correct answers after creating a paper. It pulls correct answers directly from the MCQ question bank for any class, subject, and chapter combination.',
  'Teachers can also enter answers manually for custom or externally sourced papers. The output is a clean, formatted answer key table that can be printed on a single page — ideal for distributing to students after an exam.',
  'The tool integrates with the Exam Paper Generator: papers generated there automatically have a linked answer key. Everything is free with no account required.',
];

export default function AnswerKeyPage() {
  return (
    <PaperMakerToolShell
      toolName="Answer Key Generator"
      toolSlug="paper-maker-answer-key"
      tagline="Auto-generate printable MCQ answer keys instantly"
      aboutText={aboutText}
      faqs={faqs}
      relatedTools={relatedTools}
      schemas={schemas}
      howToSteps={howToSteps}
      features={[
        'Auto-generate from question bank',
        'Manual entry option',
        'Print-ready table',
        'Works with all papers',
        'Free for teachers',
      ]}
    >
      <AnswerKeyClient />
    </PaperMakerToolShell>
  );
}
