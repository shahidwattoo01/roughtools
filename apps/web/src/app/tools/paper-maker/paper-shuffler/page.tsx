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
    'different paper sets',
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
          text: 'You can generate up to 4 sets (A, B, C, D) from the same source paper, each with uniquely shuffled question order and MCQ option order.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does it shuffle MCQ options too?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes — both the question order and the MCQ option order (A/B/C/D) are independently shuffled for each set.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I print all 4 sets?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes — each set has its own print button for clean, watermark-free A4 output.',
        },
      },
    ],
  },
];

const faqs = [
  {
    q: 'How many paper sets can I generate?',
    a: 'You can generate up to 4 sets (A, B, C, D) from the same source paper, each with uniquely shuffled question order and MCQ option order.',
  },
  {
    q: 'Does it shuffle MCQ options too?',
    a: 'Yes — both the question order and the MCQ option order (A/B/C/D) are independently shuffled for each set.',
  },
  {
    q: 'Can I print all 4 sets?',
    a: 'Yes — each set has its own print button for clean, watermark-free A4 output.',
  },
  {
    q: 'Does shuffling affect the answer key?',
    a: 'No — each set automatically gets its own answer key that reflects the shuffled question and option order.',
  },
  {
    q: 'Can I use a paper I created in Exam Paper Generator?',
    a: 'Yes — papers generated in Exam Paper Generator can be passed directly to the Paper Shuffler with one click.',
  },
];

const howToSteps = [
  {
    title: 'Load or Create a Paper',
    description: 'Use a paper from Exam Paper Generator or paste your questions directly.',
  },
  {
    title: 'Choose Number of Sets',
    description: 'Select how many shuffled sets you need — up to 4 (Set A, B, C, D).',
  },
  {
    title: 'Configure Shuffle Options',
    description: 'Choose to shuffle question order, MCQ option order, or both.',
  },
  {
    title: 'Print Each Set',
    description:
      'Each set has its own print button. Print all 4 sets with their respective answer keys.',
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
    slug: 'answer-key',
    name: 'Answer Key Generator',
    emoji: '🔑',
    href: '/tools/paper-maker/answer-key',
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
  'The Paper Shuffler helps Pakistani teachers create multiple versions of the same exam to prevent cheating in examination halls. It takes a single source paper and generates up to 4 distinct sets (Set A, B, C, D) — each with independently shuffled question order and MCQ option order.',
  'Since the content is identical but the ordering differs, all sets have the same difficulty and marking scheme. Each set automatically gets its own answer key reflecting the shuffled order, so marking is still straightforward for teachers.',
  'The Paper Shuffler integrates with the Exam Paper Generator — you can generate a paper and shuffle it into sets with a single click. All output is print-ready A4 with no watermarks.',
];

export default function PaperShufflerPage() {
  return (
    <PaperMakerToolShell
      toolName="Paper Shuffler"
      toolSlug="paper-maker-paper-shuffler"
      tagline="Create Set A B C D exam papers to prevent cheating"
      aboutText={aboutText}
      faqs={faqs}
      relatedTools={relatedTools}
      schemas={schemas}
      howToSteps={howToSteps}
      features={[
        'Up to 4 paper sets',
        'Shuffles questions & options',
        'Auto answer keys per set',
        'A4 print-ready',
        'No signup required',
      ]}
    >
      <PaperShufflerClient />
    </PaperMakerToolShell>
  );
}
