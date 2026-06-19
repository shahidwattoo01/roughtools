import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

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
      name: 'MCQ Question Bank',
      item: 'https://roughtools.com/tools/paper-maker/mcq-bank',
    },
  ],
};

const webappLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'MCQ Question Bank',
  url: 'https://roughtools.com/tools/paper-maker/mcq-bank',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description:
    'Browse 1000+ MCQs for Pakistani board exams Classes 1–12. Filter by subject, chapter and difficulty.',
};

const faqLd = {
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
};

export default function MCQBankPage() {
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
      <MCQBankClient />
    </>
  );
}
