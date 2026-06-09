/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'
import ToolAdUnit from '@/components/ToolAdUnit'
import WordCounterClient from './WordCounterClient'
import Link from 'next/link'
import { PDFExportButton } from '@/components/PDFExportButton'
import { ToolPageExtras } from '@/components/ToolPageExtras'

export const metadata: Metadata = {
  title: 'Word Counter | Free Online Word Count Tool | RoughTools',
  description: 'Count words, characters, sentences, paragraphs, and estimate reading time instantly. Free online word counter with live statistics — no signup required.',
  keywords: ['word counter', 'character counter', 'word count tool', 'text statistics', 'reading time calculator', 'online word counter'],
  alternates: { canonical: 'https://roughtools.com/tools/text/word-counter' },
  openGraph: {
    title: `Word Counter — Count Words, Characters & More | RoughTools`,
    description: `Count words, characters, sentences, and paragraphs in any text. Free online word and character counter tool.`,
    url: 'https://roughtools.com/tools/text/word-counter',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Word Counter — Count Words, Characters & More | RoughTools`,
    description: `Count words, characters, sentences, and paragraphs in any text. Free online word and character counter tool.`,
  },
  robots: { index: true, follow: true },
}

const FAQ = [
  {
    q: 'Is the Word Counter free to use?',
    a: 'Yes, the Word Counter on RoughTools is completely free with no subscription, word limits, or premium features. You can count words, characters, sentences, and paragraphs for unlimited text at no cost. RoughTools is funded through non-intrusive advertising, which keeps every tool on the platform permanently free for writers, students, bloggers, SEO professionals, and content creators worldwide.',
  },
  {
    q: 'Do I need to create an account to count words?',
    a: 'No account or registration is required. Open the Word Counter, paste or type your text, and all statistics update immediately — no email address, password, or profile needed. The word count, character count, sentence count, paragraph count, and reading time estimates all update live as you type. RoughTools is designed for instant, zero-friction text analysis.',
  },
  {
    q: 'Is my text safe? Does this tool store or send what I type?',
    a: 'Your text never leaves your device. All counting and calculation happens entirely in your browser using JavaScript running locally. Nothing you type is transmitted to any server, stored in a database, or logged. You can safely count words in confidential business reports, personal essays, private correspondence, and sensitive documents without any risk of data exposure.',
  },
  {
    q: 'Does the Word Counter work on mobile phones and tablets?',
    a: 'Yes. The Word Counter is fully responsive and works on smartphones, tablets, and desktop computers. The text input and statistics display adapt to all screen sizes so you can check word count directly from your mobile device. It works in Chrome for Android, Safari for iOS, and all modern mobile browsers. Statistics update in real time as you type on a mobile keyboard.',
  },
  {
    q: 'Which browsers support this word counter?',
    a: 'The Word Counter works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave. It uses standard JavaScript string methods and regular expressions that are universally supported in all modern browser engines. Internet Explorer is not supported, as it reached end-of-life in June 2022. Any browser updated within the last five years will work correctly.',
  },
  {
    q: 'How accurate is the word count?',
    a: 'The word counter splits text on whitespace boundaries — spaces, tabs, and line breaks — and counts non-empty segments as words. This matches the counting method used by Microsoft Word, Google Docs, and most professional word processors for standard prose. Accuracy is very high for typical written text. Strings of special characters, code snippets, or URLs may be counted as single words or multiple words depending on their whitespace structure, consistent with how other tools handle them.',
  },
  {
    q: 'Can I use the Word Counter offline?',
    a: 'Once the page has loaded, the Word Counter works completely offline because all processing uses JavaScript running locally in your browser with no server calls. You do not need an active internet connection after the initial load. This is useful for checking word counts while writing on a laptop without Wi-Fi, or in any environment where keeping text processing entirely local is preferred.',
  },
  {
    q: 'How do I count words in my text? Step-by-step guide.',
    a: 'Using the Word Counter is immediate. Step one: open the Word Counter page on RoughTools. Step two: paste your text into the text area or start typing directly — all statistics update in real time as you type without any button to press. Step three: review the live statistics displayed — word count, character count with and without spaces, sentence count, paragraph count, and estimated reading and speaking times. Step four: if you need to meet a specific word target, keep editing until the counter shows your required count.',
  },
  {
    q: 'Why use RoughTools Word Counter instead of other tools?',
    a: 'RoughTools updates all statistics in real time as you type — no button press required. It provides a comprehensive set of metrics simultaneously: words, characters (with and without spaces), sentences, paragraphs, reading time, and speaking time — in a single view without switching between tabs. All processing is local with no data transmission, making it safe for sensitive documents. The page loads fast and works reliably on all devices.',
  },
  {
    q: 'How do I report a bug or suggest a new statistic?',
    a: 'Use the Contact page on RoughTools to report bugs or request new statistics such as average word length, keyword density, syllable count, or unique word count. When reporting a bug, include a short sample of the text that caused an unexpected count, what count you expected, and what the tool showed. The development team reviews all feedback and uses it to guide improvements in future releases.',
  },
  {
    q: 'How is reading time calculated in the Word Counter?',
    a: 'Reading time is estimated using an average adult silent reading speed of approximately 200 words per minute, which is the commonly cited benchmark for general adult readers consuming typical prose. The result is the total word count divided by 200, then rounded to the nearest useful increment. This estimate is appropriate for general-purpose content. Academic or highly technical content may take longer to read; casual social media content may be consumed faster. The estimate is a useful planning guide rather than a precise measurement.',
  },
  {
    q: 'How is speaking time calculated and what is it used for?',
    a: 'Speaking time uses an average presentation speaking pace of approximately 130 words per minute, which reflects a clear, measured delivery suitable for speeches, lectures, and formal presentations. This is slower than conversational speech (typically 150–180 words per minute) to account for pauses, emphasis, and audience comprehension time. The speaking time estimate is most useful for calibrating presentation scripts, podcast scripts, and recorded narrations to a target duration before recording or delivering them live.',
  },
  {
    q: 'What is the difference between characters with spaces and without spaces?',
    a: 'Characters with spaces counts every character in your text including all space characters, tab characters, and line breaks — this is the total byte-approximate size of your text. Characters without spaces counts only non-whitespace characters — letters, numbers, and punctuation — excluding all spaces and line breaks. Different platforms use different metrics: Twitter and many character-limited platforms count characters without spaces; some SEO tools measure meta description length in characters with spaces. The tool shows both so you can use whichever metric your specific platform or requirement specifies.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Word Counter',
  url: 'https://roughtools.com/tools/text/word-counter',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Count words, characters, sentences, and paragraphs with live reading and speaking time estimates. Free, private, updates in real time.',
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
    { '@type': 'ListItem', position: 3, name: 'Word Counter', item: 'https://roughtools.com/tools/text/word-counter' },
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
          <Link href="/tools/text" style={{ color: '#888', textDecoration: 'none' }}>Text Tools</Link> › Word Counter
        </nav>
        <h1 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 900, marginBottom: 8, letterSpacing: -1 }}>Word Counter</h1>
        <p style={{ color: '#888', marginBottom: 24, fontSize: 15 }}>
          Paste or type your text to instantly count words, characters (with and without spaces), sentences, paragraphs, and get reading and speaking time estimates — all updating live as you type. Processing is local, private, and requires no account or app installation.
        </p>
        <WordCounterClient />
        <div style={{ marginTop: 12, marginBottom: 4 }}>
          <PDFExportButton toolName="Word Counter" />
        </div>
        <ToolAdUnit position="middle" />
        <section style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>About Word Counter</h2>
          <p style={{ color: 'var(--fg-2)', lineHeight: 1.7 }}>
            The Word Counter is a free, instant, and accurate tool for writers, students, bloggers, and SEO professionals. Type or paste your text into the editor and all statistics update live — no button clicks required. Word count, character count, sentence count, paragraph count, and time estimates are all displayed simultaneously.
          </p>
          <p style={{ color: 'var(--fg-2)', lineHeight: 1.7, marginTop: 12 }}>
            Knowing your word count is essential for meeting academic assignment requirements, adhering to social media character limits, hitting content length guidelines, and calibrating presentation scripts. Reading and speaking time estimates help you judge content length at a glance and plan how long it will take to deliver or consume.
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
              { name: 'Case Converter', href: '/tools/text/case-converter', desc: 'Convert text between cases' },
              { name: 'Grammar Checker', href: '/tools/text/grammar-checker', desc: 'Check grammar and spelling' },
              { name: 'Readability Score', href: '/tools/text/readability-score', desc: 'Analyze text readability' },
              { name: 'Text Summarizer', href: '/tools/text/text-summarizer', desc: 'Summarize long articles' },
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
          toolName="Word Counter"
          toolSlug="word-counter"
          toolUrl="https://roughtools.com/tools/text/word-counter"
          type="general"
        />
        <ToolAdUnit position="bottom" />
      </div>
    </>
  )
}
