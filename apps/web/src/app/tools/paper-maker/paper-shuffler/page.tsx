import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import PaperMakerToolShell from '@/components/PaperMakerToolShell';

export const metadata: Metadata = {
  title: 'Paper Shuffler — Create Set A B C D Exam Papers | RoughTools',
  description:
    'Generate Set A, B, C, D versions of the same exam paper with shuffled questions and MCQ options. Prevent cheating in Pakistani board exams. Free, printable, no signup.',
  keywords: [
    'paper shuffler',
    'exam set generator',
    'set A B C D paper',
    'anti cheating exam',
    'shuffle exam questions',
    'multiple paper sets',
    'question shuffler pakistan',
    'matric paper shuffler',
    'board exam set generator',
    'exam paper randomizer',
    'shuffle mcq options',
    'prevent cheating exam',
    'free paper shuffler',
    'pakistan exam shuffler',
  ],
  alternates: { canonical: 'https://roughtools.com/tools/paper-maker/paper-shuffler' },
  openGraph: {
    title: 'Paper Shuffler — Create Set A B C D Exam Papers | RoughTools',
    description:
      'Generate 4 shuffled versions of any exam paper (Set A–D). Prevent cheating. Free for Pakistani teachers.',
    url: 'https://roughtools.com/tools/paper-maker/paper-shuffler',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Paper Shuffler — Set A B C D Generator | RoughTools',
    description: 'Shuffle questions and MCQ options into 4 paper sets instantly. Free, no signup.',
  },
  robots: { index: true, follow: true },
};

const PaperShufflerClient = dynamic(() => import('./PaperShufflerClient'), {
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
        name: 'Paper Shuffler',
        item: `${SITE}/tools/paper-maker/paper-shuffler`,
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Paper Shuffler',
    url: `${SITE}/tools/paper-maker/paper-shuffler`,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description:
      'Generate Set A, B, C, D exam papers with shuffled questions and MCQ options to prevent cheating.',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How many paper sets can I generate?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Up to 4 sets (A, B, C, D) from the same source paper, each with uniquely shuffled question and MCQ option order.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does it shuffle MCQ options too?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes — both the question order and MCQ option order (A/B/C/D) are independently shuffled for each set.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does each set get its own answer key?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes — each set automatically gets its own answer key reflecting the shuffled question and option order.',
        },
      },
    ],
  },
];

const faqs = [
  {
    q: 'How many paper sets can I generate?',
    a: 'You can generate up to 4 sets (A, B, C, D) from the same source paper. Each set has a uniquely shuffled question order and independently shuffled MCQ option order — so Set A Q1 and Set B Q1 are different questions in a different order.',
  },
  {
    q: 'Does it shuffle MCQ options too?',
    a: 'Yes — both the question order and the MCQ option order (what appears as option A, B, C, D) are independently shuffled for each set. This means even if two students are looking at the same question, the correct answer appears in a different position.',
  },
  {
    q: 'Does shuffling change the difficulty?',
    a: 'No — the content is identical across all sets. Only the ordering differs. All sets have the same total marks, the same marks per question, and the same difficulty level — the shuffle is purely positional.',
  },
  {
    q: 'Does each set get its own answer key?',
    a: 'Yes — each set automatically generates its own answer key reflecting the shuffled question and MCQ option order for that set. Print the answer keys separately and match them to the corresponding student papers during marking.',
  },
  {
    q: 'Can I use a paper generated in Exam Paper Generator?',
    a: 'Yes — papers generated in the Exam Paper Generator can be passed directly to the Paper Shuffler. You can also paste questions manually for papers from any source.',
  },
  {
    q: 'Can I print all 4 sets at once?',
    a: 'Yes — each set has its own print button for clean, watermark-free A4 output. Print Set A, B, C, D in sequence and distribute to adjacent seat rows to prevent copying.',
  },
];

const howToSteps = [
  {
    title: 'Load or Create a Source Paper',
    description:
      "Start by generating a paper in the Exam Paper Generator or Class Test Builder, then bring it into the Shuffler with one click — or paste your questions manually into the Shuffler's input panel for papers from any source.",
  },
  {
    title: 'Choose Number of Sets',
    description:
      'Select how many shuffled sets you need — up to 4 (Set A, B, C, D). For a single classroom, 2 sets (A and B distributed to alternate rows) is usually sufficient. For a large exam hall, use all 4 sets.',
  },
  {
    title: 'Configure Shuffle Options',
    description:
      'Choose whether to shuffle question order only, MCQ option order only, or both. For maximum anti-cheating effectiveness, enable both — this ensures that even adjacent students seeing the same question have different correct option positions.',
  },
  {
    title: 'Preview Each Set',
    description:
      'Preview Set A, B, C, D side by side to verify the shuffle worked correctly and that all questions are present across all sets. Check that the header (marks, time, institute name) is consistent across sets.',
  },
  {
    title: 'Print All Sets & Answer Keys',
    description:
      "Print each set using its dedicated print button. Then print each set's corresponding answer key. Distribute Set A to odd rows and Set B to even rows (or distribute all 4 in a pattern) to eliminate any possibility of copying between students.",
  },
];

const quickRef = [
  {
    label: 'Paper Sets',
    value: 'Up to 4 (A, B, C, D)',
    note: 'Each with unique question and option order',
  },
  {
    label: 'Shuffle Options',
    value: 'Questions + MCQ Options',
    note: 'Enable either or both independently',
  },
  { label: 'Difficulty Change', value: 'None', note: 'Content identical across all sets' },
  { label: 'Answer Keys', value: 'Per set', note: 'Each set gets its own matching answer key' },
  { label: 'Source Papers', value: 'Any Paper Maker tool', note: 'Or paste questions manually' },
  { label: 'Cost', value: 'Free', note: 'No signup, no limit on shuffles' },
];

const whenToUse = [
  {
    icon: '🏫',
    title: 'Examination hall anti-cheating',
    description:
      "The primary use case — distribute Set A to one row and Set B to the next so adjacent students have different question and option orders. Even if they look at each other's papers, the answers don't match.",
  },
  {
    icon: '📋',
    title: 'Multiple exam venues',
    description:
      'Run the same exam across two or three classrooms simultaneously without risk of paper leakage — each venue gets a different set with different question ordering.',
  },
  {
    icon: '🔄',
    title: 'Supplementary and re-sit exams',
    description:
      "Use a shuffled version of the original paper for supplementary (supply) exams — same content and difficulty, but different enough that students who memorised answers from leaked papers can't use them.",
  },
  {
    icon: '📚',
    title: 'Take-home practice papers',
    description:
      "Distribute different sets of a practice paper to students as homework — prevents them from comparing answers and copying each other's work at home.",
  },
  {
    icon: '🏆',
    title: 'Competitive class ranking',
    description:
      "Ensure fair competitive tests by randomising question order — students who tend to run out of time won't all fail on the same hard questions at the end of the paper.",
  },
];

const proTips = [
  'For a class of 30 students in 5 rows of 6, use 2 sets (A and B) — assign Set A to rows 1, 3, 5 and Set B to rows 2, 4. Adjacent students on each side always have a different set.',
  'Print Set A on white paper and Set B on light coloured paper (or lightly shade the header) — teachers can instantly see which students have which set without having to check the set label during marking.',
  'When shuffling MCQ options, remind students in the instructions that their option letter answer (A/B/C/D) is specific to their set — a student checking their answer with a neighbour will get the wrong result even for correct answers.',
  'Generate the answer key for each set before the exam and keep them sealed in separate envelopes — open only after all papers are collected to prevent any answer key from being visible in the room during the exam.',
  'For 4-set shuffles, arrange distribution in a 2x2 pattern: Set A top-left, Set B top-right, Set C bottom-left, Set D bottom-right across each cluster of 4 desks — maximum coverage with minimum sets.',
];

const relatedTools = [
  {
    slug: 'generate',
    name: 'Exam Paper Generator',
    emoji: '📄',
    href: '/tools/paper-maker/generate',
    description: 'Generate the source paper to shuffle into sets',
  },
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
    description: 'Build short class tests — then shuffle them',
  },
  {
    slug: 'answer-key',
    name: 'Answer Key Generator',
    emoji: '🔑',
    href: '/tools/paper-maker/answer-key',
    description: 'Generate per-set answer keys for each shuffled version',
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
  "The Paper Shuffler solves one of the most persistent problems in Pakistani exam halls — students copying from adjacent seats. By generating up to 4 versions of the same paper (Set A, B, C, D) with independently shuffled question order and MCQ option order, it ensures that even if two students look at each other's papers, the correct answers don't match.",
  'Unlike manually creating different papers (which changes difficulty and content), the Shuffler maintains identical content across all sets — same questions, same marks, same difficulty. Only the sequence changes. This means a single marking scheme is used for all sets, and the difficulty is perfectly fair for every student regardless of which set they receive.',
  'The Paper Shuffler integrates with the Exam Paper Generator and Class Test Builder — generate a paper in either tool and bring it into the Shuffler with one click. Each set gets its own print button and its own answer key that reflects the shuffled ordering. Everything is free with no account required, built specifically for the practical examination management needs of Pakistani teachers and schools.',
];

export default function PaperShufflerPage() {
  return (
    <PaperMakerToolShell
      toolName="Paper Shuffler"
      toolSlug="paper-shuffler"
      tagline="Create Set A B C D exam papers with shuffled questions and MCQ options — prevents cheating in exam halls."
      heroEmoji="🔀"
      aboutText={aboutText}
      faqs={faqs}
      relatedTools={relatedTools}
      schemas={schemas}
      howToSteps={howToSteps}
      quickRef={quickRef}
      whenToUse={whenToUse}
      proTips={proTips}
      features={[
        'Up to 4 paper sets',
        'Shuffles questions & MCQ options',
        'Auto answer keys per set',
        'A4 print-ready',
        'No signup required',
      ]}
    >
      <PaperShufflerClient />
    </PaperMakerToolShell>
  );
}
