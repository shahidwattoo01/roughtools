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
    'physics mcqs pakistan',
    'chemistry mcqs pakistan',
    'biology mcqs pakistan',
    'maths mcqs pakistan',
    'islamiat mcqs',
    'pakistan studies mcqs',
    'board exam mcqs',
    'matric mcq bank',
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
          text: '1000+ built-in MCQs covering Physics, Chemistry, Biology, Mathematics, English, Urdu, Islamiat, General Science, and more for Classes 1–12.',
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
          text: 'Yes — filter by class, subject, chapter number, and difficulty (Easy / Medium / Hard).',
        },
      },
    ],
  },
];

const faqs = [
  {
    q: 'How many MCQs are in the question bank?',
    a: 'There are 1000+ built-in MCQs covering Physics, Chemistry, Biology, Mathematics, English, Urdu, Islamiat, General Science, Computer Science, and Pakistan Studies for Classes 1–12. The bank is continuously updated.',
  },
  {
    q: 'Can I add my own MCQs to the bank?',
    a: 'Yes — click "Add Custom MCQ" to write your own questions with four answer options and correct answer marking. You can also upload an image for diagram-based questions. Custom MCQs are saved locally in your browser.',
  },
  {
    q: 'Can I filter MCQs by chapter?',
    a: 'Yes — use the filter panel to narrow down by class, subject, chapter number, and difficulty level (Easy, Medium, or Hard). This is especially useful when preparing chapter-specific tests.',
  },
  {
    q: 'Can I use the MCQ bank to generate a full exam paper?',
    a: 'Yes — MCQs from the bank are automatically available in the Exam Paper Generator and Class Test Builder. Select your class, subject, and chapters and the tools pull from this same bank.',
  },
  {
    q: 'Is the MCQ bank free for students too?',
    a: 'Absolutely — students can use the MCQ bank to study and self-test by chapter. Reveal answers to check understanding. All features are free with no account required.',
  },
  {
    q: 'Which subjects are covered?',
    a: 'Physics, Chemistry, Biology, Mathematics, English, Urdu, Islamiat, Pakistan Studies, Computer Science, and General Science — all major Pakistani board subjects across Classes 1–12.',
  },
];

const howToSteps = [
  {
    title: 'Select Class & Subject',
    description:
      'Open the filter panel and choose the class (1–12) and subject. The question bank immediately filters to show only MCQs relevant to your selection — no need to scroll through irrelevant subjects.',
  },
  {
    title: 'Filter by Chapter & Difficulty',
    description:
      'Narrow down further by selecting a specific chapter number and difficulty level (Easy, Medium, or Hard). This is especially useful when preparing a focused chapter test or targeting weak areas for revision.',
  },
  {
    title: 'Browse & Reveal Answers',
    description:
      'Each MCQ shows the question and four options. Click "Show Answer" to reveal the correct answer and explanation. Students can use this for active recall study — attempt the question mentally before revealing.',
  },
  {
    title: 'Add Custom MCQs',
    description:
      'Click "Add Custom MCQ" to type your own questions with four options, mark the correct answer, and optionally upload a diagram image. Custom MCQs are saved in your browser and appear alongside the built-in questions.',
  },
  {
    title: 'Use in Exam Paper Generator',
    description:
      'MCQs selected or added here feed directly into the Exam Paper Generator and Class Test Builder. Switch to either tool and your class/subject selection will carry over, populating the paper with questions from this bank.',
  },
];

const quickRef = [
  { label: 'Total MCQs', value: '1000+', note: 'Built-in, continuously updated' },
  { label: 'Subjects', value: '10+ Subjects', note: 'Physics, Chemistry, Biology, Maths & more' },
  { label: 'Classes', value: '1 – 12', note: 'Primary through Intermediate' },
  {
    label: 'Difficulty Levels',
    value: 'Easy / Medium / Hard',
    note: 'Filter by level for targeted revision',
  },
  { label: 'Custom MCQs', value: 'Unlimited', note: 'Add your own with image upload' },
  { label: 'Cost', value: 'Free', note: 'For both teachers and students' },
];

const whenToUse = [
  {
    icon: '📖',
    title: 'Chapter revision for students',
    description:
      'Filter by chapter and subject to revise MCQs before a test. Reveal answers one by one for active recall — better than passive reading.',
  },
  {
    icon: '🧪',
    title: 'Preparing chapter tests',
    description:
      'Browse available MCQs for a chapter before building a test in the Class Test Builder or Exam Paper Generator — ensures adequate question availability.',
  },
  {
    icon: '✏️',
    title: 'Adding school-specific questions',
    description:
      'Add MCQs from your specific textbook edition or from past papers not yet in the built-in bank. Custom questions are available in all Paper Maker tools.',
  },
  {
    icon: '📊',
    title: 'Checking question difficulty balance',
    description:
      'Use difficulty filters to ensure your paper has a balanced mix of Easy, Medium, and Hard MCQs appropriate for the exam level.',
  },
  {
    icon: '🎓',
    title: 'Student self-study at home',
    description:
      'Students can independently browse the MCQ bank by chapter and reveal answers to self-test between tuition sessions and before board exams.',
  },
];

const proTips = [
  'Filter by "Hard" difficulty to quickly find the most challenging MCQs for A-grade students who need extra stimulation beyond standard board questions.',
  'Add past paper MCQs from your board as custom questions — they are then available in the Exam Paper Generator for future papers with one selection.',
  'Use the chapter filter to count how many MCQs exist per chapter before building a class test — ensures you select a count the bank can actually fulfil without repetition.',
  'Students benefit most from the MCQ bank when they attempt each question mentally before revealing the answer, rather than reading questions and answers together passively.',
  'Combine the MCQ bank with the Answer Key Generator — browse questions here to verify correct answers independently before distributing an answer key to students.',
];

const relatedTools = [
  {
    slug: 'generate',
    name: 'Exam Paper Generator',
    emoji: '📄',
    href: '/tools/paper-maker/generate',
    description: 'Generate full board-pattern papers in seconds',
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
  'The MCQ Question Bank contains 1000+ multiple choice questions mapped to the Pakistani board curriculum for Classes 1–12. Each question is tagged by class, subject, chapter, and difficulty level (Easy, Medium, Hard) — making it easy to filter to exactly the questions needed for a specific assessment or revision session.',
  'The bank was built around the question patterns and syllabus structure of major Pakistani boards including Lahore, Federal, Sindh, and KP. Questions are written in the standard four-option MCQ format used in Pakistani board papers. Teachers can trust that selecting 10 MCQs from Chapter 3 Physics Class 10 will give questions that match what their students actually need to know for the board exam.',
  'Teachers can extend the bank by adding their own custom MCQs — including questions from their specific textbook editions, past papers, or original compositions with diagram image uploads. Custom questions are stored in the browser locally and feed into all Paper Maker tools. The entire bank is free to use for both teachers preparing assessments and students studying independently.',
];

export default function MCQBankPage() {
  return (
    <PaperMakerToolShell
      toolName="MCQ Question Bank"
      toolSlug="mcq-bank"
      tagline="Browse 1000+ MCQs for Pakistani board exams — filter by class, subject, chapter and difficulty."
      heroEmoji="✅"
      aboutText={aboutText}
      faqs={faqs}
      relatedTools={relatedTools}
      schemas={schemas}
      howToSteps={howToSteps}
      quickRef={quickRef}
      whenToUse={whenToUse}
      proTips={proTips}
      features={[
        '1000+ built-in MCQs',
        'Custom MCQ upload',
        'Filter by chapter & difficulty',
        'Free for students & teachers',
        'No signup required',
      ]}
    >
      <MCQBankClient />
    </PaperMakerToolShell>
  );
}
