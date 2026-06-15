/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'
import ToolAdUnit from '@/components/ToolAdUnit'
import ReadabilityScoreClient from './ReadabilityScoreClient'
import Link from 'next/link'
import { PDFExportButton } from '@/components/PDFExportButton'
import { ToolPageExtras } from '@/components/ToolPageExtras'

export const metadata: Metadata = {
  title: 'Readability Score | Free Online Text Readability Analyzer | RoughTools',
  description: 'Analyze text readability with Flesch-Kincaid Grade Level, Flesch Reading Ease, average sentence length, and more. Free online readability analyzer — instant results.',
  keywords: ['readability score', 'flesch kincaid', 'reading ease', 'text readability', 'readability analyzer', 'grade level checker'],
  alternates: { canonical: 'https://roughtools.com/tools/text/readability-score' },
  openGraph: {
    title: `Readability Score — Check Text Readability | RoughTools`,
    description: `Check the readability of your text using Flesch-Kincaid and other readability formulas. Free online readability checker.`,
    url: 'https://roughtools.com/tools/text/readability-score',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Readability Score — Check Text Readability | RoughTools`,
    description: `Check the readability of your text using Flesch-Kincaid and other readability formulas. Free online readability checker.`,
  },
  robots: { index: true, follow: true },
}

const FAQ = [
  {
    q: 'Is the Readability Score tool free to use?',
    a: 'Yes, the Readability Score analyzer on RoughTools is completely free with no subscription, usage limits, or premium tier. You can analyze unlimited text for readability at no cost. RoughTools is funded through non-intrusive advertising, which keeps every tool on the platform permanently free for writers, educators, content strategists, and SEO professionals worldwide.',
  },
  {
    q: 'Do I need to create an account to check readability?',
    a: 'No account or registration is required. Open the Readability Score page, paste your text, and see readability metrics instantly — no email address, password, or profile needed. The tool begins analyzing the moment you paste text, providing real-time feedback as you write or edit. RoughTools is designed for immediate access without any sign-up barrier.',
  },
  {
    q: 'Is my text safe? Does this tool send my writing to a server?',
    a: 'Your text never leaves your device. All readability calculations happen entirely in your browser using JavaScript math on the sentence and word structure of your text. No content is transmitted to any server, stored in a database, or read by anyone. You can safely analyze confidential reports, proprietary content, and private documents with complete privacy.',
  },
  {
    q: 'Does the Readability Score tool work on mobile phones and tablets?',
    a: 'Yes. The Readability Score analyzer is fully responsive and works on smartphones, tablets, and desktop computers. The text input, score meters, and statistics adapt to all screen sizes so you can check the readability of your writing from any device. It works in Chrome for Android, Safari for iOS, and all modern mobile browsers without any app download required.',
  },
  {
    q: 'Which browsers support this readability analyzer?',
    a: 'The Readability Score tool works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave. The tool uses standard JavaScript math functions that are universally supported in all modern browser engines. Internet Explorer is not supported, as it reached end-of-life in June 2022 and is no longer suitable for modern web tools.',
  },
  {
    q: 'How accurate are the Flesch-Kincaid readability scores?',
    a: 'The Flesch-Kincaid calculations are mathematically exact — the formulas are applied precisely to the word count, sentence count, and syllable count of your text. What limits accuracy is syllable counting, which uses a heuristic approximation rather than a full dictionary lookup. For most English text the syllable estimates are accurate to within one or two syllables per word. The final scores closely match what Microsoft Word and the Hemingway Editor report for the same text.',
  },
  {
    q: 'Can I use the Readability Score tool offline?',
    a: 'Once the page has loaded, the Readability Score tool works completely offline because all calculations use JavaScript running locally in your browser with no server calls. You do not need an internet connection after the initial page load. This makes it useful for checking readability during writing sessions on a laptop without Wi-Fi, or for editors working in environments with restricted internet access.',
  },
  {
    q: 'How do I check the readability of my text? Step-by-step.',
    a: 'Checking readability takes just seconds. Step one: open the Readability Score page on RoughTools. Step two: paste or type your text into the input area — scores update automatically as you type. Step three: review the Flesch Reading Ease score (higher is easier to read), the Flesch-Kincaid Grade Level (lower means accessible to more readers), average sentence length, and the percentage of complex words. Step four: if scores indicate text is too difficult, try breaking long sentences into shorter ones and replacing complex multi-syllable words with simpler alternatives.',
  },
  {
    q: 'Why use RoughTools Readability Score instead of other websites?',
    a: 'RoughTools calculates readability entirely in your browser with no server latency, so scores update in real time as you edit — making it ideal for live writing sessions. Your text is never transmitted anywhere, which matters when analyzing confidential business or academic writing. The tool displays multiple metrics simultaneously — Flesch Reading Ease, Flesch-Kincaid Grade Level, average sentence length, and complex word percentage — giving a complete readability picture in one view.',
  },
  {
    q: 'How do I report a bug or suggest a new readability metric?',
    a: 'Use the Contact page on RoughTools to report bugs or request additional readability metrics such as the Gunning Fog Index, SMOG Grade, or Coleman-Liau Index. When reporting a bug, include a short sample of text, the score you received, and what you expected based on another tool or reference. The development team reviews all feedback for future feature additions.',
  },
  {
    q: 'What is the Flesch Reading Ease score and how do I interpret it?',
    a: 'Flesch Reading Ease is a readability formula developed by Rudolf Flesch in 1948 that scores text on a scale from 0 to 100. Higher scores indicate easier reading. A score of 90–100 is Very Easy, suitable for 11-year-old readers. Scores of 60–70 are Standard, targeting a 13–15 year old reading level — this is the target for most public-facing content. Scores of 30–50 are Difficult, typical of academic writing. Scores below 30 are Very Confusing, found in professional and legal documents. Most web content should aim for a score above 60.',
  },
  {
    q: 'What is the Flesch-Kincaid Grade Level and why does it matter?',
    a: 'The Flesch-Kincaid Grade Level translates the same readability calculation into a US school grade level number. A grade level of 6 means the text is readable by a 6th grader (approximately 12 years old). A grade level of 12 represents high school senior level. Most public-facing content — news articles, product descriptions, and blog posts — targets a grade level of 6 to 8 to maximize audience reach. Academic and technical writing typically scores at grade 12 to 16 (college level). Lower grade levels make your content accessible to more readers.',
  },
  {
    q: 'What are complex words and why should I reduce them?',
    a: 'Complex words, also called polysyllabic words, are words with three or more syllables. Examples include "approximately", "configuration", and "implementation". A high percentage of complex words is the primary driver of difficult readability scores because they require more cognitive effort to process. Replacing complex words with simpler equivalents — "about" instead of "approximately", "setup" instead of "configuration" — measurably improves both Flesch scores and reader comprehension. Aim for a complex word percentage below 15% for general audiences.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Readability Score',
  url: 'https://roughtools.com/tools/text/readability-score',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Analyze text readability with Flesch-Kincaid Grade Level, Flesch Reading Ease, average sentence length, and complex word percentage. Free, private, real-time.',
}
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}


const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
    { '@type': 'ListItem', position: 2, name: 'Text Tools', item: 'https://roughtools.com/tools/text' },
    { '@type': 'ListItem', position: 3, name: 'Readability Score', item: 'https://roughtools.com/tools/text/readability-score' },
  ],
}
export default function Page() {
  return (
    <>
      <JsonLd data={[jsonLd, faqJsonLd, breadcrumbLd]} />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px 64px' }}>
        <ToolAdUnit position="top" />
        <nav style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>
          <Link href="/" style={{ color: '#888', textDecoration: 'none' }}>Home</Link> ›{' '}
          <Link href="/tools/text" style={{ color: '#888', textDecoration: 'none' }}>Text Tools</Link> › Readability Score
        </nav>
        <h1 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 900, marginBottom: 8, letterSpacing: -1 }}>Readability Score</h1>
        <p style={{ color: '#888', marginBottom: 24, fontSize: 15 }}>
          Analyze your text with industry-standard readability formulas including Flesch Reading Ease and Flesch-Kincaid Grade Level. Scores update in real time as you write. All analysis runs locally in your browser — no server, no data sent, no account required.
        </p>
        <div data-print-section="calculator">
        <ReadabilityScoreClient />
        </div>
        <div style={{ marginTop: 12, marginBottom: 4 }}>
          <PDFExportButton toolName="Readability Score" />
        </div>
        <ToolAdUnit position="middle" />
        <section style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>About Readability Score</h2>
          <p style={{ color: 'var(--fg-2)', lineHeight: 1.7 }}>
            Readability scoring helps writers, educators, and content strategists understand how accessible their writing is to their target audience. The Flesch-Kincaid formulas are among the most widely used readability measures, originally developed for the US Navy and now used by Microsoft Word, the Hemingway Editor, and many other professional writing tools.
          </p>
          <p style={{ color: 'var(--fg-2)', lineHeight: 1.7, marginTop: 12 }}>
            Improving readability typically involves shortening sentences, using simpler words with fewer syllables, and breaking up dense paragraphs. The tool shows visual meters for each score so you can quickly gauge where your content stands and track improvements in real time as you make edits.
          </p>
        </section>
        <section style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>Frequently Asked Questions</h2>
          {FAQ.map(({ q, a }, i) => (
            <div key={i} style={{ marginBottom: 16, padding: 16, background: 'var(--bg-2)', borderRadius: 8, border: '1px solid var(--line)' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6, color: 'var(--fg)' }}>{q}</h3>
              <p style={{ fontSize: 14, color: 'var(--fg-2)', margin: 0, lineHeight: 1.7 }}>{a}</p>
            </div>
          ))}
        </section>
        <section style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--fg)', marginBottom: 16 }}>Related Text Tools</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            {[
              { name: 'Word Counter', href: '/tools/text/word-counter', desc: 'Count words and characters' },
              { name: 'Grammar Checker', href: '/tools/text/grammar-checker', desc: 'Check grammar and spelling' },
              { name: 'Text Summarizer', href: '/tools/text/text-summarizer', desc: 'Summarize long articles' },
              { name: 'Case Converter', href: '/tools/text/case-converter', desc: 'Convert text between cases' },
              { name: 'Lorem Ipsum Generator', href: '/tools/text/lorem-ipsum-generator', desc: 'Generate placeholder text' },
            ].map(t => (
              <a key={t.href} href={t.href} style={{ display: 'block', padding: '14px 16px', background: 'var(--bg-2)', border: '1px solid var(--line)', borderRadius: 10, color: 'var(--fg)', textDecoration: 'none' }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{t.name}</div>
                <div style={{ fontSize: 12, color: 'var(--fg-2)' }}>{t.desc}</div>
              </a>
            ))}
          </div>
        </section>
        <ToolPageExtras
          toolName="Readability Score"
          toolSlug="readability-score"
          toolUrl="https://roughtools.com/tools/text/readability-score"
          type="general"
          showPDF
        />
        <ToolAdUnit position="bottom" />
      </div>
    </>
  )
}
