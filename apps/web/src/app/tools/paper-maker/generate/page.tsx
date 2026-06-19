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
    ],
  },
];

const faqs = [
  {
    q: 'Which Pakistani boards are supported?',
    a: "All major boards: Lahore, Faisalabad, Multan, Gujranwala, Rawalpindi, Federal, Sindh, Balochistan, and KP board. Question patterns and marks distributions match each board's official scheme.",
  },
  {
    q: 'Which classes can I generate papers for?',
    a: 'Classes 1 through 12 — Primary (1–5), Middle (6–8), Matric (9–10), and Intermediate (11–12). Each class has its own subject list and chapter structure.',
  },
  {
    q: 'Can I download the paper as PDF?',
    a: 'Yes — every generated paper has a one-click Print/PDF button. Output is clean A4 format with no watermarks, no editor chrome, and no branding — ready to hand to students.',
  },
  {
    q: 'Can teachers add their own questions?',
    a: 'Yes — use the Custom Questions panel in Step 2 to write, edit, or upload MCQs with images. Custom questions are saved locally in your browser and persist between sessions.',
  },
  {
    q: 'What question types are included?',
    a: 'The generator supports MCQs (with four options), Short Answer questions, and Long Answer/Essay questions. You can set the count and marks for each section independently.',
  },
  {
    q: 'Is the tool completely free?',
    a: 'Yes — no signup, no account, no payment, no daily limit. Every feature including PDF download is 100% free.',
  },
];

const howToSteps = [
  {
    title: 'Select Class & Board',
    description:
      'Choose the class (1–12) from the class selector, then pick the Pakistani board — Lahore, Federal, Sindh, Faisalabad, Multan, Gujranwala, Rawalpindi, Balochistan, or KP. The board selection determines the question pattern and marks distribution used in the paper, so it must match your institution.',
  },
  {
    title: 'Choose Subject & Chapters',
    description:
      'Select the subject for the paper. The chapter list automatically populates based on the class and subject combination. Choose all chapters for a full-syllabus annual paper, or pick specific chapters for a mid-term, unit test, or revision paper.',
  },
  {
    title: 'Configure Sections & Marks',
    description:
      'Set the number of MCQs, Short Answer questions, and Long Answer questions. Assign marks per question for each section independently. The tool calculates total marks automatically and displays the marks distribution in the paper header exactly as Pakistani boards format it.',
  },
  {
    title: 'Add Custom Questions (Optional)',
    description:
      'Open the Custom Questions panel to add your own MCQs — type the question, four options, and the correct answer. You can also upload an image for diagram-based questions. Custom questions are mixed into the paper alongside the built-in question bank and saved locally for future use.',
  },
  {
    title: 'Preview & Print',
    description:
      'Click Generate to see an instant preview. Check the layout, question selection, and header details including institute name and total marks. Click Print or Download PDF for a clean, watermark-free A4 paper ready for photocopying and distribution to students.',
  },
];

const quickRef = [
  { label: 'Supported Classes', value: '1 – 12', note: 'Primary, Middle, Matric & Intermediate' },
  {
    label: 'Boards Supported',
    value: '9 Pakistani Boards',
    note: 'Lahore, Federal, Sindh, KP, Balochistan & more',
  },
  {
    label: 'Question Types',
    value: 'MCQ, Short, Long',
    note: 'Count and marks configurable per section',
  },
  { label: 'Languages', value: 'English & Urdu', note: 'Switch medium before generating' },
  { label: 'Output Format', value: 'Print / PDF', note: 'Clean A4, no watermarks, no logo' },
  { label: 'Cost', value: 'Free', note: 'No signup, no daily limit, no account required' },
];

const whenToUse = [
  {
    icon: '📅',
    title: 'Annual & half-yearly exams',
    description:
      'Generate full board-pattern papers for Matric and Intermediate annual and supplementary exams with the official marks distribution matching your specific board.',
  },
  {
    icon: '📚',
    title: 'Chapter-wise unit tests',
    description:
      'Select a single chapter to create a focused unit test after completing a topic — ideal for checking student understanding before moving to the next chapter.',
  },
  {
    icon: '🏫',
    title: 'School-wide assessments',
    description:
      'Create identical papers for multiple sections of the same class, then use the Paper Shuffler to create Set A, B, C, D versions to prevent copying in the exam hall.',
  },
  {
    icon: '📝',
    title: 'Practice & revision papers',
    description:
      'Generate practice papers for students to use at home for self-study. Same board pattern, fresh question selection — great for exam preparation in the weeks before board exams.',
  },
  {
    icon: '🎓',
    title: 'Tuition centres & academies',
    description:
      'Tutors can generate papers across multiple classes, subjects, and chapters in seconds — no need to compose papers from scratch for each student batch or subject level.',
  },
];

const proTips = [
  'Generate the paper first, then use the Paper Shuffler to create Set A, B, C, D versions for the examination hall — prevents students from copying answers from adjacent seats.',
  'Use the Custom Questions panel to add questions from your specific textbook edition that may differ from the standard question bank. Custom questions persist across sessions in your browser.',
  'For bilingual schools, generate the paper here first, then open the Bilingual Paper Maker to convert it instantly to English + Urdu side-by-side format.',
  'Toggle "Include Answer Key" before generating to append the MCQ answer key on a separate page — saves time when marking student scripts in bulk.',
  'For Classes 1–8, reduce question counts and marks per question to match the simpler assessment format appropriate for Primary and Middle school students.',
];

const relatedTools = [
  {
    slug: 'mcq-bank',
    name: 'MCQ Question Bank',
    emoji: '✅',
    href: '/tools/paper-maker/mcq-bank',
    description: 'Browse & filter 1000+ MCQs by subject and chapter',
  },
  {
    slug: 'class-test',
    name: 'Class Test Builder',
    emoji: '🧪',
    href: '/tools/paper-maker/class-test',
    description: 'Build short class tests in 30 seconds',
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
    description: 'Create Set A B C D to prevent cheating in exams',
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
  'The Exam Paper Generator is a free tool built specifically for Pakistani school teachers at all levels — from Primary Class 1 through Intermediate Class 12. It generates complete, print-ready question papers in the exact format used by Pakistani boards: MCQs in Section A, short answer questions in Section B, and long answer questions in Section C, with the official marks distribution printed in the header.',
  'Most Pakistani teachers spend 30–60 minutes composing a single exam paper — selecting questions, formatting sections, calculating total marks, and typing header information. This tool reduces that to under 2 minutes. Select class, board, subject, and chapters; configure the marks distribution; and the paper is generated instantly from a bank of 1000+ carefully curated questions.',
  'Coverage spans 9 Pakistani boards (Lahore, Faisalabad, Multan, Gujranwala, Rawalpindi, Federal Board, Sindh Board, Balochistan, and KP Board) and all major subjects for Classes 1–12. Teachers can add their own custom questions with image uploads, choose between English and Urdu medium output, and download a watermark-free A4 PDF at no cost. No account or signup is ever required.',
];

export default function PaperGeneratorPage() {
  return (
    <PaperMakerToolShell
      toolName="Exam Paper Generator"
      toolSlug="generate"
      tagline="Generate complete board-pattern exam papers for Classes 1–12 in seconds — all Pakistani boards, free."
      heroEmoji="📄"
      aboutText={aboutText}
      faqs={faqs}
      relatedTools={relatedTools}
      schemas={schemas}
      howToSteps={howToSteps}
      quickRef={quickRef}
      whenToUse={whenToUse}
      proTips={proTips}
      features={[
        'No signup required',
        'Free PDF download',
        'All 9 Pakistani boards',
        'Classes 1–12',
        'No watermarks',
      ]}
    >
      <PaperGeneratorClient />
    </PaperMakerToolShell>
  );
}
