import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

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
    'class 11 paper maker',
    'class 12 paper maker',
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
      name: 'Exam Paper Generator',
      item: 'https://roughtools.com/tools/paper-maker/generate',
    },
  ],
};

const webappLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Exam Paper Generator',
  url: 'https://roughtools.com/tools/paper-maker/generate',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description:
    'Generate complete board-pattern exam papers for Classes 1–12 Pakistani boards. Free, no signup.',
};

const faqLd = {
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
    {
      '@type': 'Question',
      name: 'Can teachers add their own questions?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — use the Custom Questions panel in Step 2 to add, edit, or upload MCQs with images. Custom questions are saved locally in your browser.',
      },
    },
  ],
};

export default function PaperGeneratorPage() {
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
      <PaperGeneratorClient />
    </>
  );
}
