import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

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
      name: 'Class Test Builder',
      item: 'https://roughtools.com/tools/paper-maker/class-test',
    },
  ],
};

const webappLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Class Test Builder',
  url: 'https://roughtools.com/tools/paper-maker/class-test',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Build printable class tests for Classes 1–12 Pakistani schools in 30 seconds.',
};

const faqLd = {
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
};

export default function ClassTestPage() {
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
      <ClassTestClient />
    </>
  );
}
