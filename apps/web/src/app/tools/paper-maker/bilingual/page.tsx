import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import PaperMakerToolShell from '@/components/PaperMakerToolShell';

export const metadata: Metadata = {
  title: 'Bilingual Paper Maker — English & Urdu Exam Papers for Pakistani Boards | RoughTools',
  description:
    'Generate exam papers in English only, Urdu only, or bilingual format with both languages side by side. Perfect for all Pakistani boards and mediums. Free, printable, no signup.',
  keywords: [
    'bilingual paper maker',
    'urdu english exam paper',
    'urdu medium paper generator',
    'english medium paper generator',
    'bilingual exam pakistan',
    'urdu paper maker',
    'side by side urdu english paper',
    'pakistan bilingual paper',
    'matric urdu medium',
    'intermediate urdu paper',
    'board exam urdu english',
    'free bilingual paper',
    'urdu translation exam paper',
    'dual language paper pakistan',
  ],
  alternates: { canonical: 'https://roughtools.com/tools/paper-maker/bilingual' },
  openGraph: {
    title: 'Bilingual Paper Maker — English & Urdu Exam Papers | RoughTools',
    description:
      'Generate exam papers in English, Urdu, or both side-by-side. All Pakistani boards. Free, no signup.',
    url: 'https://roughtools.com/tools/paper-maker/bilingual',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bilingual Paper Maker — English & Urdu | RoughTools',
    description:
      'Generate bilingual (English + Urdu) exam papers instantly. Free for Pakistani teachers.',
  },
  robots: { index: true, follow: true },
};

const BilingualClient = dynamic(() => import('./BilingualClient'), {
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
        name: 'Bilingual Paper Maker',
        item: `${SITE}/tools/paper-maker/bilingual`,
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Bilingual Paper Maker',
    url: `${SITE}/tools/paper-maker/bilingual`,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Generate exam papers in English, Urdu, or bilingual format for Pakistani boards.',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Can I generate a paper in Urdu only?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes — select "Urdu Only" mode and the entire paper including questions and instructions will be in Urdu.',
        },
      },
      {
        '@type': 'Question',
        name: 'What does bilingual mode look like?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Bilingual mode shows English and Urdu side by side for each question, so students can read in either language.',
        },
      },
      {
        '@type': 'Question',
        name: 'Which subjects support Urdu translation?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Physics, Chemistry, Biology, Mathematics, Islamiat, Urdu, English, and Pakistan Studies all support bilingual output.',
        },
      },
    ],
  },
];

const faqs = [
  {
    q: 'Can I generate a paper in Urdu only?',
    a: 'Yes — select "Urdu Only" mode and the entire paper including questions and instructions will be in Urdu.',
  },
  {
    q: 'What does bilingual mode look like?',
    a: 'Bilingual mode shows English and Urdu side by side for each question, so students can read in either language.',
  },
  {
    q: 'Which subjects support Urdu translation?',
    a: 'Physics, Chemistry, Biology, Mathematics, Islamiat, Urdu, English, and Pakistan Studies all support bilingual output.',
  },
  {
    q: 'Can Urdu medium schools use this for English papers?',
    a: "Yes — the tool works for both English medium and Urdu medium schools. Switch the mode to match your school's requirement.",
  },
  {
    q: 'Is the Urdu text properly right-to-left formatted?',
    a: 'Yes — Urdu text is displayed and printed in proper RTL format with correct font rendering.',
  },
];

const howToSteps = [
  {
    title: 'Select Class & Subject',
    description: 'Choose the class (1–12) and subject for the bilingual paper.',
  },
  {
    title: 'Choose Language Mode',
    description: 'Select English Only, Urdu Only, or Bilingual (side-by-side).',
  },
  {
    title: 'Configure Sections',
    description: 'Set MCQ count, short and long questions, marks distribution, and time limit.',
  },
  {
    title: 'Generate & Print',
    description: 'Preview the bilingual layout and print — Urdu text renders in proper RTL format.',
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
    slug: 'paper-shuffler',
    name: 'Paper Shuffler',
    emoji: '🔀',
    href: '/tools/paper-maker/paper-shuffler',
  },
  { slug: 'notes-maker', name: 'Notes Maker', emoji: '📝', href: '/tools/notes-maker/app' },
];

const aboutText = [
  "Pakistan's education system serves students in both English and Urdu mediums, and many schools require exam papers in both languages. The Bilingual Paper Maker generates exam papers in English only, Urdu only, or with both languages displayed side by side for every question.",
  'In bilingual mode, each question appears with the English version on the left and the Urdu translation on the right. This is especially useful for schools transitioning between mediums or for teachers who want to accommodate both types of students in one examination.',
  'Urdu text is printed in proper RTL format using the correct font. All major subjects are supported. Output is print-ready A4 with no watermarks and no account required.',
];

export default function BilingualPage() {
  return (
    <PaperMakerToolShell
      toolName="Bilingual Paper Maker"
      toolSlug="paper-maker-bilingual"
      tagline="Generate English & Urdu exam papers side by side"
      aboutText={aboutText}
      faqs={faqs}
      relatedTools={relatedTools}
      schemas={schemas}
      howToSteps={howToSteps}
      features={[
        'English, Urdu, or Bilingual',
        'Proper RTL Urdu text',
        'All major subjects',
        'A4 print-ready',
        'No signup required',
      ]}
    >
      <BilingualClient />
    </PaperMakerToolShell>
  );
}
