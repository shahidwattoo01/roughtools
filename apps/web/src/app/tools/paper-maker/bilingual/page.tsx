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
    a: 'Yes — select "Urdu Only" mode and the entire paper, including all questions, MCQ options, section headings, and header instructions, will be in Urdu. This is the standard format for Urdu medium schools across Pakistan.',
  },
  {
    q: 'What does bilingual mode look like?',
    a: 'In bilingual mode, each question appears with the English version on one side and the Urdu translation on the other — side by side in a two-column layout. Students can read in whichever language they are more comfortable with for each question.',
  },
  {
    q: 'Which subjects support Urdu translation?',
    a: 'Physics, Chemistry, Biology, Mathematics, Islamiat, Urdu, English, and Pakistan Studies all support bilingual and Urdu-only output. Urdu text is rendered in proper RTL (right-to-left) format with correct font display.',
  },
  {
    q: 'Can Urdu medium schools use this for English papers?',
    a: 'Yes — teachers at Urdu medium schools can use the tool to generate papers in Urdu only, or in bilingual format to help students who struggle with English terminology understand the question in both languages simultaneously.',
  },
  {
    q: 'Is the Urdu text correctly formatted for print?',
    a: 'Yes — Urdu text is displayed and printed in proper RTL (right-to-left) format using a suitable Urdu-compatible font. The layout adjusts automatically for Urdu text flow in both bilingual and Urdu-only modes.',
  },
  {
    q: 'Is it free?',
    a: 'Yes — completely free for all three modes (English only, Urdu only, Bilingual). No account, no signup, no daily limit. Print as many papers as needed.',
  },
];

const howToSteps = [
  {
    title: 'Select Class & Subject',
    description:
      'Choose the class (1–12) and subject. The chapter list and question bank will load automatically. Both English and Urdu versions of questions are available for all supported subjects.',
  },
  {
    title: 'Choose Language Mode',
    description:
      'Select your output mode — English Only (standard), Urdu Only (for Urdu medium schools), or Bilingual (side-by-side English and Urdu for every question). The mode can be changed before generating without losing your other settings.',
  },
  {
    title: 'Configure Sections & Marks',
    description:
      'Set MCQ count, short and long question counts, marks per section, and time limit — exactly as in the Exam Paper Generator. The bilingual layout is automatically applied to all sections.',
  },
  {
    title: 'Add Institute Details',
    description:
      'Enter your institute name, teacher name, and class details for the paper header. The header itself is also generated in the selected language — Urdu headers appear in proper Urdu script for Urdu-medium papers.',
  },
  {
    title: 'Preview & Print',
    description:
      'Click Generate to preview the bilingual layout. In bilingual mode, verify that the Urdu text renders correctly and is readable. Click Print for a clean A4 output with proper RTL Urdu text rendering and no watermarks.',
  },
];

const quickRef = [
  {
    label: 'Language Modes',
    value: 'English / Urdu / Bilingual',
    note: 'Switch before generating',
  },
  { label: 'Urdu Format', value: 'RTL, proper script', note: 'Correct right-to-left layout' },
  {
    label: 'Supported Subjects',
    value: '8+ Subjects',
    note: 'Physics, Chemistry, Biology, Maths & more',
  },
  { label: 'Bilingual Layout', value: 'Side-by-side columns', note: 'English left, Urdu right' },
  { label: 'Supported Classes', value: '1 – 12', note: 'All levels and boards' },
  { label: 'Cost', value: 'Free', note: 'No account, no signup' },
];

const whenToUse = [
  {
    icon: '🌐',
    title: 'Urdu medium school exams',
    description:
      'Generate fully Urdu-language exam papers for Urdu medium schools — all questions, options, section headings, and instructions in Urdu with proper RTL formatting.',
  },
  {
    icon: '🔄',
    title: 'Transitioning between mediums',
    description:
      'Schools transitioning from Urdu to English medium can use bilingual papers to ease students into English terminology while still providing Urdu support for each question.',
  },
  {
    icon: '📚',
    title: 'Mixed-medium classes',
    description:
      'Classes where some students are English medium and others Urdu medium benefit from bilingual papers — every student can read the question in their stronger language.',
  },
  {
    icon: '🏆',
    title: 'Competitive exam preparation',
    description:
      'Many Pakistani competitive exams (entry tests, scholarship exams) appear in bilingual format. Practise papers in the same format to help students acclimatise to the bilingual layout.',
  },
  {
    icon: '🎓',
    title: 'ESL student support',
    description:
      'For students learning English as a second language, bilingual papers allow them to check the Urdu meaning of any unfamiliar English word in the question without needing to ask the teacher.',
  },
];

const proTips = [
  'In bilingual mode, keep MCQ option text short — very long options in two languages can make the side-by-side layout crowded on A4 paper. Use concise, direct options for best print layout.',
  'For Urdu-only papers, enter the institute name and teacher name in Urdu script in the header fields — the full paper including header appears in consistent Urdu for a professional presentation.',
  'After generating the bilingual paper in the Bilingual Paper Maker, use the Paper Shuffler to create Set A, B, C, D shuffled versions — the bilingual formatting is preserved in all shuffled sets.',
  'For Classes 1–5, the simpler English is already accessible to most students — consider English Only mode with bilingual mode reserved for Class 6 and above where subject terminology becomes more complex.',
  'Print a sample of the bilingual layout before mass-printing to check that the Urdu font renders correctly on your specific printer — some older printers need a driver update for proper Urdu font support.',
];

const relatedTools = [
  {
    slug: 'generate',
    name: 'Exam Paper Generator',
    emoji: '📄',
    href: '/tools/paper-maker/generate',
    description: 'Generate full board-pattern papers, then convert to bilingual',
  },
  {
    slug: 'mcq-bank',
    name: 'MCQ Question Bank',
    emoji: '✅',
    href: '/tools/paper-maker/mcq-bank',
    description: 'Browse 1000+ MCQs with Urdu translations available',
  },
  {
    slug: 'class-test',
    name: 'Class Test Builder',
    emoji: '🧪',
    href: '/tools/paper-maker/class-test',
    description: 'Build quick class tests in any language mode',
  },
  {
    slug: 'answer-key',
    name: 'Answer Key Generator',
    emoji: '🔑',
    href: '/tools/paper-maker/answer-key',
    description: 'Generate answer keys for bilingual papers',
  },
  {
    slug: 'paper-shuffler',
    name: 'Paper Shuffler',
    emoji: '🔀',
    href: '/tools/paper-maker/paper-shuffler',
    description: 'Shuffle bilingual papers into Set A B C D',
  },
  {
    slug: 'notes-maker',
    name: 'Notes Maker',
    emoji: '📝',
    href: '/tools/notes-maker/app',
    description: 'Block-based notes editor — supports Urdu text',
  },
];

const aboutText = [
  "Pakistan's education system serves students across English medium, Urdu medium, and mixed-medium schools — and many students struggle with subject terminology in a language they are not fully comfortable with. The Bilingual Paper Maker addresses this by generating exam papers in three modes: English Only, Urdu Only, or fully bilingual with English and Urdu displayed side by side for every question.",
  'In bilingual mode, each MCQ and short answer question appears in a two-column layout — English on the left, Urdu on the right. Students can read in whichever language they understand better for each question without needing to ask the teacher for a translation during the exam. This is particularly valuable for subjects with technical terminology (Physics, Chemistry, Biology) where a single unfamiliar English word can prevent a student from answering a question they otherwise know.',
  'Urdu text in both Urdu-only and bilingual modes is rendered in proper RTL (right-to-left) format using Urdu-compatible font rendering. All major subjects for Classes 1–12 are supported. The tool integrates with the rest of the Paper Maker suite — papers generated here can be shuffled into Set A/B/C/D using the Paper Shuffler, and their answer keys generated in the Answer Key Generator. Everything is free with no account required.',
];

export default function BilingualPage() {
  return (
    <PaperMakerToolShell
      toolName="Bilingual Paper Maker"
      toolSlug="bilingual"
      tagline="Generate exam papers in English only, Urdu only, or side-by-side bilingual format — free for Pakistani teachers."
      heroEmoji="🌐"
      aboutText={aboutText}
      faqs={faqs}
      relatedTools={relatedTools}
      schemas={schemas}
      howToSteps={howToSteps}
      quickRef={quickRef}
      whenToUse={whenToUse}
      proTips={proTips}
      features={[
        'English, Urdu, or Bilingual mode',
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
