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
    'free answer key generator',
    'printable answer key',
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
          text: 'Yes — select class, subject and chapters and the tool pulls correct answers from the question bank automatically.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I enter answers manually?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes — type answers manually for any custom or external paper.',
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
    a: 'Yes — select class, subject, and chapters and the tool pulls the correct answers from the question bank automatically. This works for any paper generated using the Exam Paper Generator or Class Test Builder.',
  },
  {
    q: 'Can I enter answers manually?',
    a: 'Yes — if you used a custom or external paper, simply type the correct answers (A, B, C, or D) for each MCQ question number into the manual entry fields. The tool formats them into a clean answer key table.',
  },
  {
    q: 'Is the answer key printable without watermarks?',
    a: 'Yes — click Print to get a clean, formatted answer key table with question numbers and correct answers. No watermarks, no branding — ready to distribute to students or use for marking.',
  },
  {
    q: 'Does it work with papers generated in Exam Paper Generator?',
    a: 'Yes — papers created in the Exam Paper Generator and Class Test Builder automatically have a linked answer key. You can also generate standalone answer keys for external or custom papers.',
  },
  {
    q: 'Can students use it to check their own answers?',
    a: 'Yes — students can use the Answer Key Generator to independently verify their answers after a test. They can enter the MCQ numbers and correct options to build a self-checking reference.',
  },
  {
    q: 'Is it free?',
    a: 'Completely free. No account, no signup, no limit on how many answer keys you generate. Built for Pakistani teachers who check hundreds of scripts per exam.',
  },
];

const howToSteps = [
  {
    title: 'Select Class & Subject',
    description:
      'Choose the class (1–12) and subject. The tool connects to the same question bank used in the Exam Paper Generator, so the correct answers for built-in MCQs are already stored.',
  },
  {
    title: 'Choose Chapters',
    description:
      'Select the chapters that were included in the exam paper you want an answer key for. The tool will load the correct answers for all MCQs from those chapters.',
  },
  {
    title: 'Auto-Generate or Enter Manually',
    description:
      'Click "Auto-Generate" to pull the correct answers from the question bank instantly — the answer key table populates in seconds. For custom or external papers, switch to Manual Entry mode and type A, B, C, or D for each question.',
  },
  {
    title: 'Review & Edit',
    description:
      'Check the generated answer key against your paper to verify it matches the questions selected. You can edit any individual answer if needed before printing — useful when custom questions were included.',
  },
  {
    title: 'Print the Answer Key',
    description:
      'Click Print for a clean, professionally formatted answer key table. One click gives you a page showing question numbers and correct answers — no extra formatting needed before distributing to students.',
  },
];

const quickRef = [
  {
    label: 'Generation Mode',
    value: 'Auto or Manual',
    note: 'Auto pulls from question bank; manual entry for external papers',
  },
  { label: 'Supported Classes', value: '1 – 12', note: 'All levels' },
  { label: 'Output', value: 'Formatted table', note: 'Question number + correct answer per row' },
  {
    label: 'Works With',
    value: 'All Paper Maker tools',
    note: 'Also supports custom/external papers',
  },
  { label: 'Editable', value: 'Yes', note: 'Edit any answer before printing' },
  { label: 'Cost', value: 'Free', note: 'No signup, unlimited answer keys' },
];

const whenToUse = [
  {
    icon: '📋',
    title: 'After distributing an exam paper',
    description:
      'Generate the answer key immediately after distributing the paper to have it ready when students return scripts for marking.',
  },
  {
    icon: '✅',
    title: 'Marking scripts in bulk',
    description:
      'Print one copy of the answer key for the teacher to use as a marking reference when checking all student answer scripts for a class or section.',
  },
  {
    icon: '📤',
    title: 'Releasing official answer keys',
    description:
      'Some schools publish the official MCQ answer key after an exam so students can verify their own performance before results are announced.',
  },
  {
    icon: '🔄',
    title: 'Checking paper quality',
    description:
      'Generate the answer key before the exam to spot any MCQs with ambiguous correct answers or where multiple options could be argued as correct.',
  },
  {
    icon: '📊',
    title: 'Item analysis after marking',
    description:
      'Compare how many students chose each option (A/B/C/D) against the answer key to identify which MCQs were too easy, too hard, or poorly worded for future improvement.',
  },
];

const proTips = [
  'Generate the answer key before printing the exam paper and review it yourself — catches errors like accidentally correct "wrong" options before students sit the test.',
  'Print the answer key on a different coloured paper from the question papers — prevents it from accidentally being mixed in with student papers during distribution.',
  'For shuffled papers (Set A, B, C, D from the Paper Shuffler), generate a separate answer key for each set — the tool accounts for the different question ordering automatically.',
  'Use the Manual Entry mode to build an answer key for past paper MCQs from your board — then add those questions as custom MCQs to the bank so future papers include them with correct answers built in.',
  'Distribute the answer key to students 24 hours after a test rather than immediately — giving students time to review their own responses first leads to better learning and self-reflection.',
];

const relatedTools = [
  {
    slug: 'generate',
    name: 'Exam Paper Generator',
    emoji: '📄',
    href: '/tools/paper-maker/generate',
    description: 'Generate full board-pattern papers with auto answer key',
  },
  {
    slug: 'mcq-bank',
    name: 'MCQ Question Bank',
    emoji: '✅',
    href: '/tools/paper-maker/mcq-bank',
    description: 'Browse & verify correct answers from the question bank',
  },
  {
    slug: 'class-test',
    name: 'Class Test Builder',
    emoji: '🧪',
    href: '/tools/paper-maker/class-test',
    description: 'Build class tests — answer key optional with each test',
  },
  {
    slug: 'paper-shuffler',
    name: 'Paper Shuffler',
    emoji: '🔀',
    href: '/tools/paper-maker/paper-shuffler',
    description: 'Create Set A B C D — each set needs its own answer key',
  },
  {
    slug: 'bilingual',
    name: 'Bilingual Paper Maker',
    emoji: '🌐',
    href: '/tools/paper-maker/bilingual',
    description: 'Generate English & Urdu exam papers',
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
  'The Answer Key Generator saves Pakistani teachers from the time-consuming task of manually noting down correct MCQ answers after creating or selecting a paper. It connects to the same 1000+ MCQ question bank used across all Paper Maker tools — pulling the correct answers for any class, subject, and chapter combination in seconds.',
  'Teachers can also enter answers manually for custom or externally sourced papers, making the tool useful even when questions were not drawn from the built-in bank. The output is a clean, formatted table showing question number and correct answer — print it directly and use it as a marking guide when checking student scripts.',
  'The tool integrates seamlessly with the Exam Paper Generator and Class Test Builder. Any paper generated in those tools automatically has a linked answer key available here. Papers generated via the Paper Shuffler (Set A, B, C, D) can each have their own separate answer key generated to account for the different question ordering per set. Everything is free with no account required.',
];

export default function AnswerKeyPage() {
  return (
    <PaperMakerToolShell
      toolName="Answer Key Generator"
      toolSlug="answer-key"
      tagline="Auto-generate printable MCQ answer keys for Pakistani board papers — manual entry also supported."
      heroEmoji="🔑"
      aboutText={aboutText}
      faqs={faqs}
      relatedTools={relatedTools}
      schemas={schemas}
      howToSteps={howToSteps}
      quickRef={quickRef}
      whenToUse={whenToUse}
      proTips={proTips}
      features={[
        'Auto-generate from question bank',
        'Manual entry option',
        'Print-ready table',
        'Works with shuffled papers',
        'Free for teachers',
      ]}
    >
      <AnswerKeyClient />
    </PaperMakerToolShell>
  );
}
