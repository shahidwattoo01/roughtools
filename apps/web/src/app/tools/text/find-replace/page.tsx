/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'
import ToolAdUnit from '@/components/ToolAdUnit'
import FindReplaceClient from './FindReplaceClient'
import Link from 'next/link'
import { PDFExportButton } from '@/components/PDFExportButton'
import { ToolPageExtras } from '@/components/ToolPageExtras'

export const metadata: Metadata = {
  title: 'Find and Replace | Free Online Text Tool | RoughTools',
  description: 'Find and replace text with support for regex, case-sensitive, and whole-word matching. Highlights all matches instantly. Free online find & replace tool — no signup required.',
  keywords: ['find and replace', 'text find replace', 'regex find replace', 'online text editor', 'search replace tool', 'bulk text replacement'],
  alternates: { canonical: 'https://roughtools.com/tools/text/find-replace' },
  openGraph: {
    title: `Find & Replace — Find and Replace Text Online | RoughTools`,
    description: `Find and replace text online with regex support. Batch replace strings in any text. Free online find and replace tool.`,
    url: 'https://roughtools.com/tools/text/find-replace',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Find & Replace — Find and Replace Text Online | RoughTools`,
    description: `Find and replace text online with regex support. Batch replace strings in any text. Free online find and replace tool.`,
  },
  robots: { index: true, follow: true },
}

const FAQ = [
  {
    q: 'Is the Find and Replace tool free to use?',
    a: 'Yes, the Find and Replace tool on RoughTools is completely free with no subscription, usage limits, or premium tier. You can perform unlimited text searches and replacements at no cost. RoughTools is supported through non-intrusive advertising, which keeps every tool on the platform permanently free for writers, developers, editors, and data professionals worldwide.',
  },
  {
    q: 'Do I need to create an account to use Find and Replace?',
    a: 'No account or registration is required. Open the Find and Replace tool, paste your text, enter your search term and replacement, and start replacing immediately. There is no email address, password, or profile needed. RoughTools is built for fast, frictionless text editing — no sign-up barrier between you and your task.',
  },
  {
    q: 'Is my text safe? Does this tool store or send what I enter?',
    a: 'Your text never leaves your device. All find and replace processing happens entirely in your browser using JavaScript\'s native string and regex methods. Nothing you type is transmitted to any server, stored, or logged. You can safely process confidential documents, internal reports, and private writing without any risk of data exposure.',
  },
  {
    q: 'Does Find and Replace work on mobile phones and tablets?',
    a: 'Yes. The tool is fully responsive and works on smartphones, tablets, and desktop computers. All three input areas — text, search term, and replacement — are accessible on small screens. It works in Chrome for Android, Safari for iOS, and all modern mobile browsers. For large documents, a desktop browser with a physical keyboard provides the most comfortable editing experience.',
  },
  {
    q: 'Which browsers support this find and replace tool?',
    a: 'The Find and Replace tool works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave. The tool uses standard JavaScript string methods and the native RegExp object, which are universally supported. Internet Explorer is not supported, as it has been end-of-life since June 2022.',
  },
  {
    q: 'How accurate is the find and replace processing?',
    a: 'Find and replace accuracy is 100% for plain text mode because the tool uses JavaScript\'s native string replace methods. In regex mode, results are exactly what JavaScript\'s RegExp engine produces — the same engine used in Node.js, browsers, and every JavaScript runtime. If your regex produces unexpected results, the issue is in the pattern, not the tool.',
  },
  {
    q: 'Can I use this Find and Replace tool offline?',
    a: 'Once the page has loaded, Find and Replace works completely offline because all processing uses built-in JavaScript with no server calls. You do not need an active internet connection after the initial page load. This makes it useful for editing documents on a laptop without Wi-Fi, or in any environment where you want to keep text processing entirely local.',
  },
  {
    q: 'How do I find and replace text? Step-by-step instructions.',
    a: 'Using the tool takes just a few seconds. Step one: open the Find and Replace page on RoughTools. Step two: paste your text into the main text area. Step three: type the word or phrase you want to find in the Search field. Step four: type the replacement text in the Replace field — leave it empty to delete all matches. Step five: optionally enable regex mode, case-sensitive matching, or whole-word mode. Step six: click Replace First to replace only the first match, or Replace All to replace every occurrence at once.',
  },
  {
    q: 'Why use RoughTools Find and Replace instead of a text editor?',
    a: 'This tool is browser-based — no software installation required. It supports regex, case-sensitive mode, and whole-word mode in a clean interface. The real-time match highlighting shows exactly which text will be affected before you commit to any replacement, preventing unintended changes. It is also useful when you need to share a replacement task with someone who may not have access to a specific editor.',
  },
  {
    q: 'How do I report a bug or request a new feature for this tool?',
    a: 'Use the Contact page on RoughTools to report bugs or suggest features. When reporting a bug, include your input text (or a short representative sample), the search term and replacement you used, which options were enabled (regex, case-sensitive, whole-word), and what the unexpected result was. Feature requests such as multi-term replacement, capture group support, or export options are welcome.',
  },
  {
    q: 'What is regex mode and when should I use it?',
    a: 'Regex (regular expression) mode lets you use pattern-based search syntax instead of plain text. For example, the pattern \\d+ matches any sequence of one or more digits, so you can replace all numbers in a document in a single operation. The pattern [aeiou] matches any vowel. Patterns like \\bword\\b match a whole word. Use regex mode when plain text search is not flexible enough — for example, when you need to match a pattern rather than a specific string.',
  },
  {
    q: 'What does whole-word matching do in Find and Replace?',
    a: 'Whole-word matching restricts the search to instances where the search term appears as a complete word, surrounded by word boundaries. Without it, searching for "cat" would also match inside "catch", "concatenate", and "duplicate". With whole-word enabled, only standalone "cat" is matched. This prevents unintended replacements when your search term is a substring of other words, which is a common source of bulk replacement mistakes.',
  },
  {
    q: 'What is the difference between Replace First and Replace All?',
    a: 'Replace First replaces only the first occurrence of the search term found in the text from the beginning of the document, then stops. This is useful when you want to review replacements incrementally or only change a specific instance. Replace All replaces every single occurrence in the entire text simultaneously — equivalent to applying the global flag (g) in a JavaScript regex. For most bulk editing tasks, Replace All is the appropriate choice.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Find and Replace',
  url: 'https://roughtools.com/tools/text/find-replace',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Find and replace text with regex, case-sensitive, and whole-word options. Highlights all matches in real time. Free, private, instant.',
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
    { '@type': 'ListItem', position: 3, name: 'Find & Replace', item: 'https://roughtools.com/tools/text/find-replace' },
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
          <Link href="/tools/text" style={{ color: '#888', textDecoration: 'none' }}>Text Tools</Link> › Find and Replace
        </nav>
        <h1 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 900, marginBottom: 8, letterSpacing: -1 }}>Find and Replace</h1>
        <p style={{ color: '#888', marginBottom: 24, fontSize: 15 }}>
          Search and replace text with support for regular expressions, case-sensitive matching, and whole-word mode. All matches are highlighted in real time before you commit to any replacement. Runs entirely in your browser — no server, no data sent, no account required.
        </p>
        <div data-print-section="calculator">
        <FindReplaceClient />
        </div>
        <div style={{ marginTop: 12, marginBottom: 4 }}>
          <PDFExportButton toolName="Find and Replace" />
        </div>
        <ToolAdUnit position="middle" />
        <section style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>About Find and Replace</h2>
          <p style={{ color: 'var(--fg-2)', lineHeight: 1.7 }}>
            This browser-based find and replace tool is more powerful than a basic text editor&apos;s built-in search. It supports full regular expression patterns, giving you the ability to match complex text patterns and perform transformations that simple string matching cannot achieve. Real-time match highlighting lets you confirm which parts of your text will be affected before committing to a replacement.
          </p>
          <p style={{ color: 'var(--fg-2)', lineHeight: 1.7, marginTop: 12 }}>
            Whole-word mode prevents unintended partial matches, and the case-insensitive option makes searching faster when capitalization does not matter. The Replace First and Replace All options give you granular control over how broadly the replacement is applied across your entire document.
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
              { name: 'Case Converter', href: '/tools/text/case-converter', desc: 'Convert text between cases' },
              { name: 'Remove Duplicate Lines', href: '/tools/text/remove-duplicate-lines', desc: 'Remove duplicate lines' },
              { name: 'Text Reverser', href: '/tools/text/text-reverser', desc: 'Reverse any text instantly' },
              { name: 'Grammar Checker', href: '/tools/text/grammar-checker', desc: 'Check grammar and spelling' },
            ].map(t => (
              <a key={t.href} href={t.href} style={{ display: 'block', padding: '14px 16px', background: 'var(--bg-2)', border: '1px solid var(--line)', borderRadius: 10, color: 'var(--fg)', textDecoration: 'none' }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{t.name}</div>
                <div style={{ fontSize: 12, color: 'var(--fg-2)' }}>{t.desc}</div>
              </a>
            ))}
          </div>
        </section>
        <ToolPageExtras
          toolName="Find and Replace"
          toolSlug="find-replace"
          toolUrl="https://roughtools.com/tools/text/find-replace"
          type="general"
        />
        <ToolAdUnit position="bottom" />
      </div>
    </>
  )
}
