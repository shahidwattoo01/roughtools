/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'
import ToolAdUnit from '@/components/ToolAdUnit'
import CaseConverterClient from './CaseConverterClient'
import Link from 'next/link'
import { PDFExportButton } from '@/components/PDFExportButton'
import { ToolPageExtras } from '@/components/ToolPageExtras'

export const metadata: Metadata = {
  title: 'Case Converter | Free Online Text Case Changer | RoughTools',
  description: 'Convert text between UPPER CASE, lower case, Title Case, camelCase, snake_case, kebab-case, and more. Free instant text case converter — no signup needed.',
  keywords: ['case converter', 'text case converter', 'uppercase converter', 'lowercase converter', 'camelcase converter', 'snake case', 'kebab case'],
  alternates: { canonical: 'https://roughtools.com/tools/text/case-converter' },
  openGraph: {
    title: `Case Converter — Convert Text Case Online | RoughTools`,
    description: `Convert text between uppercase, lowercase, title case, and sentence case instantly. Free online text case converter tool.`,
    url: 'https://roughtools.com/tools/text/case-converter',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Case Converter — Convert Text Case Online | RoughTools`,
    description: `Convert text between uppercase, lowercase, title case, and sentence case instantly. Free online text case converter tool.`,
  },
  robots: { index: true, follow: true },
}

const FAQ = [
  {
    q: 'Is the Case Converter free to use?',
    a: 'Yes, the Case Converter on RoughTools is completely free with no subscription, usage limits, or premium features. You can convert unlimited text between any case format at no cost. RoughTools is funded through non-intrusive advertising, which keeps every tool on the platform permanently free for writers, developers, students, and content creators worldwide.',
  },
  {
    q: 'Do I need to create an account to convert text case?',
    a: 'No account or registration is required. Open the Case Converter, paste or type your text, and click any case format to convert instantly. There is no email address, password, or profile needed at any point. RoughTools is designed for fast, frictionless text processing — you can go from raw text to properly formatted output in under two seconds without any sign-up step.',
  },
  {
    q: 'Is my text safe? Does this tool store or send what I type?',
    a: 'Your text never leaves your device. All case conversion processing happens entirely in your browser using JavaScript string methods. Nothing you type is transmitted to any server, stored in a database, or logged anywhere. You can safely convert confidential documents, internal company content, and private writing without any data exposure risk.',
  },
  {
    q: 'Does the Case Converter work on mobile phones and tablets?',
    a: 'Yes. The Case Converter is fully responsive and works correctly on smartphones, tablets, and desktop computers. The text input and conversion buttons adapt to all screen sizes. It works in Chrome for Android, Safari for iOS, and all modern mobile browsers. The copy button functions correctly on mobile so you can paste converted text directly into any app.',
  },
  {
    q: 'Which browsers support this case converter tool?',
    a: 'The Case Converter works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave. It uses standard JavaScript string APIs that are universally supported. Internet Explorer is not supported, as it has been end-of-life since June 2022. Any modern browser updated within the last five years will work perfectly with this tool.',
  },
  {
    q: 'How accurate is the case conversion?',
    a: 'Case conversion for UPPER CASE, lower case, Title Case, and Sentence case is 100% accurate using JavaScript\'s built-in toUpperCase() and toLowerCase() methods. Programmer-specific formats like camelCase, PascalCase, snake_case, and kebab-case are also accurately produced by splitting on word boundaries and reformatting. Results are identical to what you would write by hand following the conventions of each format.',
  },
  {
    q: 'Can I use the Case Converter offline?',
    a: 'Once the page has loaded in your browser, case conversion works fully offline because all processing uses built-in JavaScript with no server calls. You do not need an active internet connection after the initial page load. This makes the tool especially useful when editing on a laptop without Wi-Fi, working on a plane, or using it in a location with unreliable connectivity.',
  },
  {
    q: 'How do I convert text to a different case? Step-by-step.',
    a: 'Using the Case Converter is immediate. Step one: open the Case Converter on this page. Step two: type or paste your text into the input area. Step three: click the case format button you want — for example, UPPER CASE, lower case, Title Case, camelCase, snake_case, or kebab-case. Step four: the converted text appears instantly in the output area. Step five: click Copy to copy the result to your clipboard and paste it wherever you need it.',
  },
  {
    q: 'Why use RoughTools Case Converter instead of other websites?',
    a: 'RoughTools supports the most comprehensive set of case formats in one place — UPPER CASE, lower case, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, and alternating case — without switching between multiple tools. All conversions are instant and run locally in your browser with no server delay. The interface is clean, loads fast, and works reliably on both desktop and mobile.',
  },
  {
    q: 'How do I report a bug or suggest a new case format?',
    a: 'Use the Contact page on RoughTools to report a bug or request a new case format. When reporting a bug, describe the input text, which case format you selected, and what the incorrect output was. Suggestions for additional case formats — such as SCREAMING_SNAKE_CASE, dot.case, or COBOL-CASE — are welcome and reviewed by the development team for inclusion in future updates.',
  },
  {
    q: 'What is camelCase and when should I use it?',
    a: 'camelCase joins multiple words into one string with no spaces, capitalizing the first letter of each word except the very first. For example, "hello world example" becomes "helloWorldExample". It is the standard naming convention for variables and functions in JavaScript, TypeScript, Java, and many other programming languages. It gets its name because the capital letters resemble the humps of a camel.',
  },
  {
    q: 'What is the difference between snake_case and kebab-case?',
    a: 'Both formats lowercase all letters and use a separator between words, but they use different separators. snake_case uses an underscore character — for example, "hello world" becomes "hello_world". It is the standard in Python for variable and function names, and in SQL for column names. kebab-case uses a hyphen — "hello world" becomes "hello-world". It is used in URLs, CSS class names, HTML attributes, and file names in many web projects.',
  },
  {
    q: 'What is Title Case and how is it different from Sentence case?',
    a: 'Title Case capitalizes the first letter of every word — for example, "the quick brown fox" becomes "The Quick Brown Fox". It is used for article headings, book titles, and product names. Sentence case only capitalizes the first word of each sentence — "the quick brown fox" becomes "The quick brown fox". Sentence case is used in body text, email subjects, and UI labels in many modern style guides, as it is considered more readable and less formal than Title Case.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Case Converter',
  url: 'https://roughtools.com/tools/text/case-converter',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Convert text between UPPER CASE, lower case, Title Case, camelCase, PascalCase, snake_case, kebab-case, and alternating case. Free, instant, private.',
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
    { '@type': 'ListItem', position: 3, name: 'Case Converter', item: 'https://roughtools.com/tools/text/case-converter' },
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
          <Link href="/tools/text" style={{ color: '#888', textDecoration: 'none' }}>Text Tools</Link> › Case Converter
        </nav>
        <h1 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 900, marginBottom: 8, letterSpacing: -1 }}>Case Converter</h1>
        <p style={{ color: '#888', marginBottom: 24, fontSize: 15 }}>
          Convert your text into any case format instantly — UPPER CASE, lower case, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, and alternating case. All processing happens locally in your browser with no server calls. Free, private, and no account required.
        </p>
        <div data-print-section="calculator">
        <CaseConverterClient />
        </div>
        <div style={{ marginTop: 12, marginBottom: 4 }}>
          <PDFExportButton toolName="Case Converter" />
        </div>
        <ToolAdUnit position="middle" />
        <section style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>About Case Converter</h2>
          <p style={{ color: 'var(--fg-2)', lineHeight: 1.7 }}>
            The Case Converter transforms any text into your desired capitalization format in a single click. Whether you need to fix accidental caps lock, prepare code variable names in camelCase or snake_case, format article titles in Title Case, or create URL slugs in kebab-case, this tool handles all common formats without any installation or account.
          </p>
          <p style={{ color: 'var(--fg-2)', lineHeight: 1.7, marginTop: 12 }}>
            Developers will find camelCase, PascalCase, snake_case, and kebab-case especially useful when naming variables, classes, functions, or URL paths. Writers and editors benefit from Title Case and Sentence case for quickly formatting headings and article titles to match their style guide.
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
              { name: 'Find & Replace', href: '/tools/text/find-replace', desc: 'Find and replace text' },
              { name: 'Text Reverser', href: '/tools/text/text-reverser', desc: 'Reverse any text instantly' },
              { name: 'Remove Duplicate Lines', href: '/tools/text/remove-duplicate-lines', desc: 'Remove duplicate lines' },
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
          toolName="Case Converter"
          toolSlug="case-converter"
          toolUrl="https://roughtools.com/tools/text/case-converter"
          type="general"
        />
        <ToolAdUnit position="bottom" />
      </div>
    </>
  )
}
