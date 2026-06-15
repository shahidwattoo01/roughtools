/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'
import ToolAdUnit from '@/components/ToolAdUnit'
import GrammarCheckerClient from './GrammarCheckerClient'
import Link from 'next/link'
import { PDFExportButton } from '@/components/PDFExportButton'
import { ToolPageExtras } from '@/components/ToolPageExtras'

export const metadata: Metadata = {
  title: 'Grammar Checker | Free Online Proofreading Tool | RoughTools',
  description: 'Check your text for common grammar issues, typos, double spaces, repeated words, and capitalization errors. Free browser-based grammar checker — no AI API, no signup required.',
  keywords: ['grammar checker', 'spell checker', 'grammar check online', 'typo checker', 'text proofreader', 'writing checker'],
  alternates: { canonical: 'https://roughtools.com/tools/text/grammar-checker' },
  openGraph: {
    title: `Grammar Checker — Check Grammar Online Free | RoughTools`,
    description: `Check grammar, spelling, and punctuation errors in your text. Free online grammar checker and proofreading tool.`,
    url: 'https://roughtools.com/tools/text/grammar-checker',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Grammar Checker — Check Grammar Online Free | RoughTools`,
    description: `Check grammar, spelling, and punctuation errors in your text. Free online grammar checker and proofreading tool.`,
  },
  robots: { index: true, follow: true },
}

const FAQ = [
  {
    q: 'Is the Grammar Checker free to use?',
    a: 'Yes, the Grammar Checker on RoughTools is completely free with no subscription, usage limits, or premium features. You can check unlimited text for grammar errors, typos, and style issues at no cost. RoughTools is funded through non-intrusive advertising, which keeps every tool on the platform permanently free for students, writers, bloggers, and professionals worldwide.',
  },
  {
    q: 'Do I need to create an account to check my grammar?',
    a: 'No account or registration is required. Open the Grammar Checker, paste your text, and get instant results. There is no email address, password, or profile needed at any point. The tool processes your text the moment you paste it — no button to click, no form to fill out. RoughTools is designed for immediate access without unnecessary barriers.',
  },
  {
    q: 'Is my text safe? Does this tool send my writing to a server?',
    a: 'Your text never leaves your device. All grammar checking happens entirely in your browser using JavaScript pattern matching against a local dictionary of common errors. Nothing you write is transmitted to any server, stored in a database, or read by anyone. You can safely check confidential business writing, personal documents, and sensitive content with complete privacy.',
  },
  {
    q: 'Does the Grammar Checker work on mobile phones and tablets?',
    a: 'Yes. The Grammar Checker is fully responsive and works on smartphones, tablets, and desktop computers. The text input and highlighted error display adapt to all screen sizes. It works in Chrome for Android, Safari for iOS, and all modern mobile browsers. For long documents, a desktop browser with a physical keyboard makes editing corrections more comfortable.',
  },
  {
    q: 'Which browsers support this grammar checker?',
    a: 'The Grammar Checker works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave. It uses standard JavaScript and DOM APIs that are universally supported. Internet Explorer is not supported, as it has been end-of-life since June 2022. Any browser released within the last five years will work correctly.',
  },
  {
    q: 'How accurate is this grammar checker at finding errors?',
    a: 'The checker reliably catches the errors it is designed to find: common typos from a curated list (such as "teh", "adn", "recieve"), double spaces, repeated consecutive words, and sentences missing an opening capital letter. It does not miss these targeted patterns. However, it does not catch every possible grammar error — complex grammatical mistakes, word choice errors, and stylistic issues require a full AI-powered grammar tool to detect.',
  },
  {
    q: 'Can I use the Grammar Checker offline?',
    a: 'Once the page has loaded, the Grammar Checker works completely offline because all processing uses JavaScript running locally in your browser with no server calls. You do not need an internet connection after the initial load. This makes it useful for proofreading documents on a laptop without Wi-Fi, or in any environment where keeping your text local is a priority.',
  },
  {
    q: 'How do I check my text for grammar errors? Step-by-step guide.',
    a: 'Using the Grammar Checker is immediate. Step one: open the Grammar Checker page on RoughTools. Step two: paste or type your text into the input area — errors are detected automatically as you type. Step three: review the highlighted sections — different colors indicate different issue types such as typos, double spaces, and repeated words. Step four: click on a highlighted issue to see a description of the problem and the suggested correction. Step five: edit your text to fix each flagged issue and watch the highlights disappear as the text is corrected.',
  },
  {
    q: 'Why use RoughTools Grammar Checker instead of other tools?',
    a: 'RoughTools Grammar Checker processes your text entirely in your browser — no data is ever sent to a server, which means complete privacy. It loads instantly and begins checking the moment you paste text, with no delay and no API quota limits. Unlike AI grammar tools that require internet access and may store your writing, this tool works offline and keeps your content completely private at all times.',
  },
  {
    q: 'How do I report a bug or suggest a new grammar rule?',
    a: 'Use the Contact page on RoughTools to report a bug or suggest a new grammar or typo rule to add to the checker. When reporting a bug, include the text that caused the unexpected result, what error you expected to be flagged, and what the tool actually did. Suggestions for common typo patterns, additional style rules, or new error categories are welcome and reviewed for future updates.',
  },
  {
    q: 'What types of errors does the grammar checker detect?',
    a: 'The checker detects four main categories of errors. First, common typos — frequently mistyped words from a curated list such as "teh" for "the" and "adn" for "and". Second, double spaces — two or more consecutive space characters that slip in during editing. Third, repeated words — the same word appearing consecutively such as "the the". Fourth, capitalization errors — sentences that begin with a lowercase letter when they should start with a capital.',
  },
  {
    q: 'Why does this not use AI to check grammar?',
    a: 'Running AI grammar models requires sending your text to a remote server, which creates privacy risks and costs money to operate. This checker uses rule-based pattern matching that runs entirely in your browser, making it instant, free, private, and functional offline. For the most common and frequent writing errors, rule-based checking is fast and reliable. For sophisticated grammatical analysis involving sentence structure and context-dependent rules, a dedicated AI writing assistant is the appropriate tool.',
  },
  {
    q: 'What do the different highlight colors mean in the grammar checker?',
    a: 'The highlight colors group errors by their type so you can prioritize fixes at a glance. Red highlights indicate likely spelling typos — words that closely match common misspellings in the checker\'s dictionary. Orange highlights mark style issues such as double spaces between words. Yellow highlights flag repeated consecutive words — for example, "the the quick" where "the" appears twice in a row. Each highlighted section can be clicked to see a description of the specific issue detected.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Grammar Checker',
  url: 'https://roughtools.com/tools/text/grammar-checker',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Check text for common grammar issues, typos, double spaces, and repeated words entirely in your browser. Free, private, instant.',
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
    { '@type': 'ListItem', position: 3, name: 'Grammar Checker', item: 'https://roughtools.com/tools/text/grammar-checker' },
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
          <Link href="/tools/text" style={{ color: '#888', textDecoration: 'none' }}>Text Tools</Link> › Grammar Checker
        </nav>
        <h1 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 900, marginBottom: 8, letterSpacing: -1 }}>Grammar Checker</h1>
        <p style={{ color: '#888', marginBottom: 24, fontSize: 15 }}>
          Catch common typos, double spaces, repeated words, and capitalization errors instantly — all in your browser without any API calls or server transmission. Color-coded highlights identify error types at a glance so you can proofread faster. Free, completely private, no account required.
        </p>
        <div data-print-section="calculator">
        <GrammarCheckerClient />
        </div>
        <div style={{ marginTop: 12, marginBottom: 4 }}>
          <PDFExportButton toolName="Grammar Checker" />
        </div>
        <ToolAdUnit position="middle" />
        <section style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>About Grammar Checker</h2>
          <p style={{ color: 'var(--fg-2)', lineHeight: 1.7 }}>
            This browser-based grammar checker scans your text against a library of common writing mistakes: frequent typos like "teh" and "adn", consecutive repeated words, missing capitalization at sentence starts, and double spaces that slip in during editing. Each issue is highlighted with a color that indicates its category so you can prioritize fixes efficiently.
          </p>
          <p style={{ color: 'var(--fg-2)', lineHeight: 1.7, marginTop: 12 }}>
            Because it runs entirely in your browser, it is instant and completely private. No text is ever transmitted to a server. For advanced grammar correction powered by AI — including complex sentence structure analysis and context-aware suggestions — a dedicated writing assistant is the right tool. For fast proofreading of the most common and frequent writing errors, this checker has you covered immediately.
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
              { name: 'Readability Score', href: '/tools/text/readability-score', desc: 'Analyze text readability' },
              { name: 'Text Summarizer', href: '/tools/text/text-summarizer', desc: 'Summarize long articles' },
              { name: 'Case Converter', href: '/tools/text/case-converter', desc: 'Convert text between cases' },
              { name: 'Find & Replace', href: '/tools/text/find-replace', desc: 'Find and replace text' },
            ].map(t => (
              <a key={t.href} href={t.href} style={{ display: 'block', padding: '14px 16px', background: 'var(--bg-2)', border: '1px solid var(--line)', borderRadius: 10, color: 'var(--fg)', textDecoration: 'none' }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{t.name}</div>
                <div style={{ fontSize: 12, color: 'var(--fg-2)' }}>{t.desc}</div>
              </a>
            ))}
          </div>
        </section>
        <ToolPageExtras
          toolName="Grammar Checker"
          toolSlug="grammar-checker"
          toolUrl="https://roughtools.com/tools/text/grammar-checker"
          type="general"
          showPDF
        />
        <ToolAdUnit position="bottom" />
      </div>
    </>
  )
}
