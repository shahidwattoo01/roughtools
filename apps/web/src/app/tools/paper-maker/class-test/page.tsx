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
          text: 'Yes — set any total marks and time limit to match your school requirements.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is the class test printable?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes — every class test has a print button that produces a clean A4 paper with no watermarks.',
        },
      },
    ],
  },
];

const faqs = [
  {
    q: 'How quickly can I generate a class test?',
    a: 'In under 30 seconds — select class, subject, chapters, set MCQ count, short question count, marks per question, time limit, and click Generate. The test is immediately ready to print.',
  },
  {
    q: 'Can I set a custom time limit and total marks?',
    a: "Yes — the Class Test Builder lets you set any time limit (10 minutes to 90 minutes) and any marks per MCQ and short question to match your school's assessment policy and the duration of the class period.",
  },
  {
    q: 'Is the class test printable without watermarks?',
    a: 'Yes — every generated class test has a print button that produces a clean A4 paper with no editor interface, no watermarks, and no branding. Exactly what students see in an exam.',
  },
  {
    q: 'Can I include an answer key with the test?',
    a: 'Yes — toggle "Include Answer Key" before generating and the correct MCQ answers are appended on a separate page — saves time when marking scripts in bulk.',
  },
  {
    q: 'Which subjects and classes are supported?',
    a: 'All major subjects (Mathematics, Physics, Chemistry, Biology, English, Urdu, Islamiat, Pakistan Studies, Computer Science, General Science) across Classes 1–12.',
  },
  {
    q: 'How does the Class Test Builder differ from the Exam Paper Generator?',
    a: 'The Class Test Builder is optimised for quick, shorter assessments — 30–40 minutes, one or two chapters. The Exam Paper Generator is for full board-pattern exam papers with all three question sections and official marks distribution.',
  },
];

const howToSteps = [
  {
    title: 'Select Class & Subject',
    description:
      'Choose the class (1–12) and subject from the Setup screen. The available chapters will load automatically based on your selection from the MCQ question bank.',
  },
  {
    title: 'Pick Chapters',
    description:
      'Select one or more specific chapters to include in the test. For a weekly chapter test, choose the chapter just completed. For a monthly test, select the last 2–3 chapters covered in class.',
  },
  {
    title: 'Set MCQ & Short Question Counts',
    description:
      'Decide how many MCQs and Short Answer questions to include. Set marks per MCQ and marks per Short question independently. The total marks and estimated time are calculated and displayed automatically.',
  },
  {
    title: 'Add Institute & Teacher Details',
    description:
      'Optionally add your institute name and teacher name to appear in the paper header — gives the test a professional, formal appearance for students.',
  },
  {
    title: 'Generate, Preview & Print',
    description:
      'Click Generate to see the complete test instantly. Toggle "Include Answer Key" if needed, then click Print for a clean A4 class test paper ready for photocopying and distribution in under a minute.',
  },
];

const quickRef = [
  { label: 'Generation Time', value: 'Under 30 seconds', note: 'From setup to print-ready' },
  { label: 'Test Duration', value: '10 – 90 minutes', note: 'Configurable time limit' },
  { label: 'Supported Classes', value: '1 – 12', note: 'All levels' },
  { label: 'Question Types', value: 'MCQ + Short Answer', note: 'Counts configurable' },
  { label: 'Answer Key', value: 'Optional', note: 'Appended on separate page' },
  { label: 'Cost', value: 'Free', note: 'No signup, no limit on tests' },
];

const whenToUse = [
  {
    icon: '📆',
    title: 'Weekly chapter tests',
    description:
      'Generate a quick test after each chapter to check student retention while the content is fresh — takes 30 seconds to create and is immediately ready to print.',
  },
  {
    icon: '📋',
    title: 'Monthly assessments',
    description:
      'Cover 2–3 chapters in a single test for monthly or fortnightly school assessments. Select multiple chapters and the tool balances questions across all of them.',
  },
  {
    icon: '⚡',
    title: 'Surprise quizzes',
    description:
      'Need a quiz in the next 5 minutes? Select class, subject, current chapter, choose 10 MCQs, and print — no preparation time needed at all.',
  },
  {
    icon: '🔄',
    title: 'Re-tests for weak students',
    description:
      'Generate a fresh test on the same chapter for students who scored low on the first attempt — same chapter, different question selection from the bank.',
  },
  {
    icon: '🏆',
    title: 'Class participation scoring',
    description:
      'Use short 5-MCQ tests at the start of a class to check homework completion or use as class participation marks in the student gradebook.',
  },
];

const proTips = [
  'For a 40-minute period, 10 MCQs (1 mark each) and 5 short questions (2 marks each) gives a 20-mark test — a common Pakistani school assessment format that students are comfortable with.',
  'Use the Paper Shuffler after generating a class test to create Set A and Set B versions — prevents copying between students sitting in adjacent rows during the test.',
  'Save paper by generating two or three 10-mark quiz papers on a single A4 sheet — cut the sheet and distribute to students to reduce printing costs.',
  'Toggle the answer key on during generation, print one copy for yourself, then toggle it off and print the student copies — avoids accidentally distributing answer keys.',
  'For Classes 1–5 (Primary), reduce to 5 MCQs and 3 very short questions with simple marks. The tool supports any configuration from very short to longer tests.',
];

const relatedTools = [
  {
    slug: 'generate',
    name: 'Exam Paper Generator',
    emoji: '📄',
    href: '/tools/paper-maker/generate',
    description: 'Generate full board-pattern papers with all question types',
  },
  {
    slug: 'mcq-bank',
    name: 'MCQ Question Bank',
    emoji: '✅',
    href: '/tools/paper-maker/mcq-bank',
    description: 'Browse & filter 1000+ MCQs by subject and chapter',
  },
  {
    slug: 'answer-key',
    name: 'Answer Key Generator',
    emoji: '🔑',
    href: '/tools/paper-maker/answer-key',
    description: 'Auto-generate MCQ answer keys for any paper',
  },
  {
    slug: 'paper-shuffler',
    name: 'Paper Shuffler',
    emoji: '🔀',
    href: '/tools/paper-maker/paper-shuffler',
    description: 'Create Set A B C D to prevent cheating in class',
  },
  {
    slug: 'bilingual',
    name: 'Bilingual Paper Maker',
    emoji: '🌐',
    href: '/tools/paper-maker/bilingual',
    description: 'Generate English & Urdu side-by-side papers',
  },
  {
    slug: 'notes-maker',
    name: 'Notes Maker',
    emoji: '📝',
    href: '/tools/notes-maker/app',
    description: 'Block-based notes editor for Pakistani students',
  },
];

const aboutText = [
  'The Class Test Builder is designed for Pakistani school teachers who need to create short, focused assessments quickly — without the overhead of setting up a full board-pattern exam paper. Class tests are typically 30–40 minutes, cover one or two chapters, and are used for regular formative assessment throughout the term.',
  'Unlike the Exam Paper Generator (which covers all three question sections with official marks distribution), the Class Test Builder focuses on speed and simplicity. Select class, subject, and chapters; set MCQ count, short question count, marks per question, and time limit; and a print-ready test is generated in under 30 seconds. The output is clean A4 with no watermarks — ready to photocopy and hand to students.',
  'Questions are drawn from the same MCQ question bank as the Exam Paper Generator. Teachers can also add their own custom questions. An optional answer key can be appended on a separate page. The tool is completely free with no account required — built specifically for the rapid test creation needs of Pakistani school teachers.',
];

export default function ClassTestPage() {
  return (
    <PaperMakerToolShell
      toolName="Class Test Builder"
      toolSlug="class-test"
      tagline="Build printable class tests for Classes 1–12 in under 30 seconds — free for Pakistani teachers."
      heroEmoji="🧪"
      aboutText={aboutText}
      faqs={faqs}
      relatedTools={relatedTools}
      schemas={schemas}
      howToSteps={howToSteps}
      quickRef={quickRef}
      whenToUse={whenToUse}
      proTips={proTips}
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
