import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import PaperMakerToolShell from '@/components/PaperMakerToolShell';

export const metadata: Metadata = {
  title: 'Class Test Builder — Generate Class Tests in 30 Seconds | RoughTools',
  description:
    'Build printable class tests for Classes 1–12 in 30 seconds. Set MCQ count, short questions, total marks, time limit, and subject. Free for Pakistani teachers. No signup needed.',
  keywords: [
    'class test builder pakistan',
    'quick class test generator',
    'weekly test maker',
    'school test generator',
    'short test builder',
    'class quiz generator',
    'free test maker pakistan',
    'teacher test builder',
    'printable class test',
    'matric class test',
    'primary class test generator',
    'urdu medium test',
    'english medium test',
    'class test marks',
    'mcq class test',
  ],
  alternates: { canonical: 'https://roughtools.com/tools/paper-maker/class-test' },
  openGraph: {
    title: 'Class Test Builder — Generate Class Tests in 30 Seconds | RoughTools',
    description:
      'Build printable class tests for Classes 1–12 instantly. Set marks, time, questions. Free for Pakistani teachers.',
    url: 'https://roughtools.com/tools/paper-maker/class-test',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Class Test Builder — 30-Second Test Generator | RoughTools',
    description: 'Generate class tests for Classes 1–12 in 30 seconds. Free, printable, no signup.',
  },
  robots: { index: true, follow: true },
};

const ClassTestClient = dynamic(() => import('./ClassTestClient'), {
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
        name: 'Class Test Builder',
        item: `${SITE}/tools/paper-maker/class-test`,
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Class Test Builder',
    url: `${SITE}/tools/paper-maker/class-test`,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Build printable class tests for Classes 1–12 Pakistani schools in 30 seconds.',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How quickly can I generate a class test?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'In under 30 seconds — select class, subject, chapters, set MCQ and short question count, marks, and time limit, then click Generate.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I set a custom time limit and total marks?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes — the Class Test Builder lets you set any total marks and time limit to match your school requirements.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is the class test printable?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes — every generated class test has a print button that produces a clean A4 paper with no editor chrome or watermarks.',
        },
      },
    ],
  },
];

const faqs = [
  {
    q: 'How quickly can I generate a class test?',
    a: 'In under 30 seconds — select class, subject, chapters, set MCQ and short question count, marks, and time limit, then click Generate.',
  },
  {
    q: 'Can I set a custom time limit and total marks?',
    a: 'Yes — the Class Test Builder lets you set any total marks and time limit to match your school requirements.',
  },
  {
    q: 'Is the class test printable?',
    a: 'Yes — every generated class test has a print button that produces a clean A4 paper with no editor chrome or watermarks.',
  },
  {
    q: 'Can I include an answer key with the test?',
    a: 'Yes — toggle the "Include Answer Key" option before generating and the answer key is appended on a separate page.',
  },
  {
    q: 'Which subjects and classes are supported?',
    a: 'All major subjects (Mathematics, Physics, Chemistry, Biology, English, Urdu, Islamiat, Pakistan Studies, Computer Science) for Classes 1–12.',
  },
];

const howToSteps = [
  {
    title: 'Select Class & Subject',
    description: 'Choose the class (1–12) and subject for the test.',
  },
  {
    title: 'Pick Chapters',
    description: 'Select specific chapters or use all chapters for the selected subject.',
  },
  {
    title: 'Set MCQ & Short Question Count',
    description:
      'Set how many MCQs and short questions to include, plus marks per question and total time.',
  },
  {
    title: 'Generate & Print',
    description:
      'Click Generate — preview your class test and print it directly or download as PDF.',
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
  'The Class Test Builder is designed for Pakistani school teachers who need to create short, focused tests quickly. Unlike full exam papers, class tests are typically 30–40 minutes and cover one or two chapters — perfect for weekly assessments.',
  'Select your class, subject, and chapters, then configure MCQ count, short question count, marks per question, and time limit. The tool pulls questions from the MCQ bank and generates a ready-to-print test in under 30 seconds.',
  'Class tests are formatted for A4 printing with the institute name and teacher branding. An answer key can optionally be appended on a separate page. No watermarks, no signup, completely free.',
];

export default function ClassTestPage() {
  return (
    <PaperMakerToolShell
      toolName="Class Test Builder"
      toolSlug="paper-maker-class-test"
      tagline="Generate printable class tests in under 30 seconds"
      aboutText={aboutText}
      faqs={faqs}
      relatedTools={relatedTools}
      schemas={schemas}
      howToSteps={howToSteps}
      features={[
        'Ready in 30 seconds',
        'Custom marks & time',
        'Optional answer key',
        'A4 print-ready',
        'No signup required',
      ]}
    >
      <ClassTestClient />
    </PaperMakerToolShell>
  );
}
