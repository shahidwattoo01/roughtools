import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

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
      name: 'Bilingual Paper Maker',
      item: 'https://roughtools.com/tools/paper-maker/bilingual',
    },
  ],
};

const webappLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Bilingual Paper Maker',
  url: 'https://roughtools.com/tools/paper-maker/bilingual',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Generate exam papers in English, Urdu, or bilingual format for Pakistani boards.',
};

const faqLd = {
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
};

export default function BilingualPage() {
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
      <BilingualClient />
    </>
  );
}
