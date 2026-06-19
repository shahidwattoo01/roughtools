import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import PaperMakerToolShell from '@/components/PaperMakerToolShell';

export const metadata: Metadata = {
  title: 'MCQ Question Bank — 1000+ MCQs for Pakistani Boards Classes 1–12 | RoughTools',
  description:
    'Browse 1000+ MCQs for Pakistani board exams. Filter by class (1–12), subject, chapter, and difficulty. Add custom MCQs with image upload. Free for teachers and students.',
  keywords: [
    'mcq question bank pakistan',
    'multiple choice questions matric',
    'class 9 mcqs',
    'class 10 mcqs',
    'class 11 mcqs',
    'class 12 mcqs',
    'physics mcqs pakistan',
    'chemistry mcqs pakistan',
    'biology mcqs pakistan',
    'maths mcqs pakistan',
    'urdu mcqs',
    'islamiat mcqs',
    'pakistan studies mcqs',
    'board exam mcqs',
    'matric mcq bank',
    'intermediate mcqs',
    'free mcq bank pakistan',
    'lahore board mcqs',
    'federal board mcqs',
  ],
  alternates: { canonical: 'https://roughtools.com/tools/paper-maker/mcq-bank' },
  openGraph: {
    title: 'MCQ Question Bank — 1000+ MCQs for Pakistani Boards | RoughTools',
    description:
      'Browse 1000+ MCQs for Classes 1–12. Filter by subject, chapter, difficulty. Add custom MCQs with images. Free.',
    url: 'https://roughtools.com/tools/paper-maker/mcq-bank',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MCQ Question Bank — 1000+ MCQs Pakistani Boards | RoughTools',
    description:
      '1000+ MCQs for Classes 1–12 Pakistani boards. Filter, study, add custom questions. Free.',
  },
  robots: { index: true, follow: true },
};

const MCQBankClient = dynamic(() => import('./MCQBankClient'), {
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
        name: 'MCQ Question Bank',
        item: `${SITE}/tools/paper-maker/mcq-bank`,
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'MCQ Question Bank',
    url: `${SITE}/tools/paper-maker/mcq-bank`,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description:
      'Browse 1000+ MCQs for Pakistani board exams Classes 1–12. Filter by subject, chapter and difficulty.',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How many MCQs are in the question bank?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'There are 1000+ built-in MCQs covering Physics, Chemistry, Biology, Mathematics, English, Urdu, Islamiat, General Science, and more for Classes 1–12.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I add my own MCQs?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes — click "Add Custom MCQ" to add your own questions with optional image upload. Custom questions are saved in your browser locally.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I filter MCQs by chapter?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes — use the filters to narrow down by class, subject, chapter number, and difficulty (Easy / Medium / Hard).',
        },
      },
    ],
  },
];

const faqs = [
  {
    q: 'How many MCQs are in the question bank?',
    a: 'There are 1000+ built-in MCQs covering Physics, Chemistry, Biology, Mathematics, English, Urdu, Islamiat, General Science, and more for Classes 1–12.',
  },
  {
    q: 'Can I add my own MCQs?',
    a: 'Yes — click "Add Custom MCQ" to add your own questions with optional image upload. Custom questions are saved in your browser locally.',
  },
  {
    q: 'Can I filter MCQs by chapter?',
    a: 'Yes — use the filters to narrow down by class, subject, chapter number, and difficulty (Easy / Medium / Hard).',
  },
  {
    q: 'Can I use the MCQ bank to generate a full exam paper?',
    a: 'Yes — select MCQs from the bank and they are automatically available in the Exam Paper Generator and Class Test Builder.',
  },
  {
    q: 'Is this free for students too?',
    a: 'Absolutely — students can use the MCQ bank to study and self-test. All features are free with no account required.',
  },
];

const howToSteps = [
  {
    title: 'Select Class & Subject',
    description: 'Choose your class (1–12) and subject to filter the question bank.',
  },
  {
    title: 'Filter by Chapter & Difficulty',
    description: 'Narrow down to specific chapters and difficulty levels (Easy, Medium, Hard).',
  },
  {
    title: 'Browse & Reveal Answers',
    description: 'Click any MCQ to reveal the correct answer and explanation.',
  },
  {
    title: 'Add Custom Questions',
    description: 'Click "Add Custom MCQ" to add your own questions with optional image upload.',
  },
];

const relatedTools = [
  {
    slug: 'generate',
    name: 'Exam Paper Generator',
    emoji: '📄',
    href: '/tools/paper-maker/generate',
  },
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
  'The MCQ Question Bank contains 1000+ multiple choice questions for Pakistani board exams, covering all major subjects for Classes 1–12. Questions are mapped to chapters, difficulty levels, and board patterns from Lahore, Federal, Sindh, and other boards.',
  'Teachers can use the bank to quickly pull MCQs into the Exam Paper Generator or Class Test Builder. Students can use it as a self-study and revision tool — browse by chapter, reveal answers, and track which questions they know.',
  'Custom MCQs with optional image uploads can be added and are saved locally in the browser. No account is required and the entire bank is free to use.',
];

export default function MCQBankPage() {
  return (
    <PaperMakerToolShell
      toolName="MCQ Question Bank"
      toolSlug="paper-maker-mcq-bank"
      tagline="1000+ MCQs for Pakistani boards — browse, filter, and study"
      aboutText={aboutText}
      faqs={faqs}
      relatedTools={relatedTools}
      schemas={schemas}
      howToSteps={howToSteps}
      features={[
        '1000+ built-in MCQs',
        'Custom MCQ upload',
        'Filter by chapter',
        'Difficulty levels',
        'Free for students & teachers',
      ]}
    >
      <MCQBankClient />
    </PaperMakerToolShell>
  );
}
