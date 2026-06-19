import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

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
      name: 'Paper Shuffler',
      item: 'https://roughtools.com/tools/paper-maker/paper-shuffler',
    },
  ],
};

const webappLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Paper Shuffler',
  url: 'https://roughtools.com/tools/paper-maker/paper-shuffler',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description:
    'Generate Set A, B, C, D exam papers with shuffled questions and MCQ options to prevent cheating.',
};

const faqLd = {
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
};

export default function PaperShufflerPage() {
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
      <PaperShufflerClient />
    </>
  );
}
