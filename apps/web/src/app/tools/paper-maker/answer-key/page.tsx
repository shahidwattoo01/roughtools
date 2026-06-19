import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

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

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Paper Maker',
      item: 'https://roughtools.com/tools/paper-maker',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Answer Key Generator',
      item: 'https://roughtools.com/tools/paper-maker/answer-key',
    },
  ],
};

const webappLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Answer Key Generator',
  url: 'https://roughtools.com/tools/paper-maker/answer-key',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Auto-generate printable MCQ answer keys for Classes 1–12 Pakistani board exams.',
};

const faqLd = {
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
};

export default function AnswerKeyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webappLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <AnswerKeyClient />
    </>
  );
}
