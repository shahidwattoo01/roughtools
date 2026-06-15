/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'
import ToolAdUnit from '@/components/ToolAdUnit'
import RemoveDuplicateLinesClient from './RemoveDuplicateLinesClient'
import Link from 'next/link'
import { PDFExportButton } from '@/components/PDFExportButton'
import { ToolPageExtras } from '@/components/ToolPageExtras'

export const metadata: Metadata = {
  title: 'Remove Duplicate Lines | Free Online Text Deduplicator | RoughTools',
  description: 'Remove duplicate lines from any text instantly. Case-sensitive and whitespace trim options. Free online duplicate line remover — no signup required.',
  keywords: ['remove duplicate lines', 'deduplicate lines', 'remove duplicates text', 'unique lines tool', 'line deduplicator'],
  alternates: { canonical: 'https://roughtools.com/tools/text/remove-duplicate-lines' },
  openGraph: {
    title: `Remove Duplicate Lines — Delete Duplicate Text Lines | RoughTools`,
    description: `Remove duplicate lines from any text or list. Sort, deduplicate, and clean text data. Free online duplicate line remover.`,
    url: 'https://roughtools.com/tools/text/remove-duplicate-lines',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Remove Duplicate Lines — Delete Duplicate Text Lines | RoughTools`,
    description: `Remove duplicate lines from any text or list. Sort, deduplicate, and clean text data. Free online duplicate line remover.`,
  },
  robots: { index: true, follow: true },
}

const FAQ = [
  {
    q: 'Is the Remove Duplicate Lines tool free to use?',
    a: 'Yes, the Remove Duplicate Lines tool on RoughTools is completely free with no subscription, usage limits, or premium tier. You can deduplicate unlimited text at no cost. RoughTools is funded through non-intrusive advertising, which keeps every tool on the platform permanently free for developers, data analysts, content managers, and system administrators worldwide.',
  },
  {
    q: 'Do I need to create an account to remove duplicate lines?',
    a: 'No account or registration is required. Open the Remove Duplicate Lines tool, paste your text, and get the deduplicated output immediately. There is no email address, password, or profile needed at any point. RoughTools is built for fast, frictionless text processing — from paste to clean output in under two seconds with no sign-up required.',
  },
  {
    q: 'Is my text safe? Does this tool store or send what I paste?',
    a: 'Your text never leaves your device. All deduplication processing happens entirely in your browser using JavaScript string methods. Nothing you paste is transmitted to any server, stored in a database, or logged. You can safely process confidential lists, internal data, server logs, and private content without any data exposure risk.',
  },
  {
    q: 'Does the duplicate line remover work on mobile phones and tablets?',
    a: 'Yes. The tool is fully responsive and works on smartphones, tablets, and desktop computers. The text input and options adapt to all screen sizes. It works in Chrome for Android, Safari for iOS, and all modern mobile browsers. For very large text files with thousands of lines, a desktop browser with more available memory provides better performance.',
  },
  {
    q: 'Which browsers are supported by this duplicate line remover?',
    a: 'The Remove Duplicate Lines tool works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave. It uses standard JavaScript array and string methods that are universally supported. Internet Explorer is not supported, as it has been end-of-life since June 2022. Any browser released within the last five years will work correctly.',
  },
  {
    q: 'How accurate is the duplicate line detection?',
    a: 'Duplicate detection is 100% accurate for the configured comparison mode. In case-sensitive mode, two lines must be character-for-character identical to be considered duplicates. In case-insensitive mode, comparison is performed after converting both lines to lowercase. With whitespace trimming enabled, leading and trailing spaces are removed before comparison. The tool preserves the order of first occurrences and removes every subsequent duplicate correctly.',
  },
  {
    q: 'Can I remove duplicate lines offline?',
    a: 'Once the page has loaded, the tool works completely offline because all processing uses JavaScript running locally in your browser with no server calls. You do not need an active internet connection after the initial page load. This is useful for processing log files and data exports on a laptop without Wi-Fi, or in secure environments where keeping data local is required.',
  },
  {
    q: 'How do I remove duplicate lines from text? Step-by-step.',
    a: 'Removing duplicates takes just a few seconds. Step one: open the Remove Duplicate Lines page on RoughTools. Step two: paste your text — lists, log entries, email addresses, keywords, or any line-separated content — into the input area. Step three: configure your options: toggle case-sensitive mode if capitalization matters for comparison, and enable whitespace trimming if lines may have leading or trailing spaces. Step four: the tool processes instantly and displays the deduplicated output with a count of how many duplicate lines were removed. Step five: click Copy to copy the clean output to your clipboard.',
  },
  {
    q: 'Why use RoughTools Remove Duplicate Lines instead of other tools?',
    a: 'RoughTools processes text entirely in your browser — no file upload to a server, no data exposure, and no file size limit imposed by server-side processing. The tool shows you exactly how many duplicate lines were removed so you know the scale of deduplication at a glance. Case-sensitive and whitespace-trim options let you handle edge cases like mixed-case lists and log files with inconsistent spacing without pre-processing the data manually.',
  },
  {
    q: 'How do I report a bug or suggest a new feature for this tool?',
    a: 'Use the Contact page on RoughTools to report bugs or request new features. Common requests include sorting the output alphabetically, counting how many times each line appeared before deduplication, or removing lines matching a pattern rather than exact duplicates. When reporting a bug, include a short sample of the input text, which options were enabled, and what unexpected result you received. The team reviews all submissions for future updates.',
  },
  {
    q: 'What does the case-sensitive option do when removing duplicates?',
    a: 'When case-sensitive mode is enabled, "Apple", "apple", and "APPLE" are treated as three distinct lines and all three are kept in the output. When case-sensitive mode is disabled, all three are treated as duplicates of the same line, and only the first occurrence is preserved. Use case-sensitive mode when the capitalization of each line is meaningful — for example, when deduplicating code identifiers or file paths where case matters. Use case-insensitive mode when you want to treat all variations of a word as the same entry regardless of how they were capitalized.',
  },
  {
    q: 'What does the whitespace trim option do?',
    a: 'The whitespace trim option removes leading and trailing spaces from each line before comparing it against other lines. Without trimming, "  apple  " and "apple" are treated as different lines because of the extra spaces. With trimming enabled, both are recognized as identical and only one is kept. This is essential when processing data exported from spreadsheets, databases, or copy-pasted from web pages, where invisible leading or trailing spaces are common and can cause deduplication to miss obvious matches.',
  },
  {
    q: 'Can I use this tool to deduplicate email lists or keyword lists?',
    a: 'Yes. The Remove Duplicate Lines tool is ideal for cleaning email lists, keyword lists, URL lists, domain lists, and any other line-separated data. Paste the entire list into the input area, enable case-insensitive mode and whitespace trimming for best results with email and URL data, and the tool removes every duplicate entry while preserving the first occurrence of each unique line. The output can be copied and pasted directly back into your spreadsheet, CRM, or marketing tool.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Remove Duplicate Lines',
  url: 'https://roughtools.com/tools/text/remove-duplicate-lines',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Remove duplicate lines from text with case-sensitive and whitespace-trim options. Shows count of duplicates removed. Free, private, instant.',
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
    { '@type': 'ListItem', position: 3, name: 'Remove Duplicate Lines', item: 'https://roughtools.com/tools/text/remove-duplicate-lines' },
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
          <Link href="/tools/text" style={{ color: '#888', textDecoration: 'none' }}>Text Tools</Link> › Remove Duplicate Lines
        </nav>
        <h1 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 900, marginBottom: 8, letterSpacing: -1 }}>Remove Duplicate Lines</h1>
        <p style={{ color: '#888', marginBottom: 24, fontSize: 15 }}>
          Paste any list or text and instantly remove all duplicate lines. Configure case sensitivity and whitespace trimming to handle edge cases in email lists, keyword lists, log files, and exported data. Shows a count of removed duplicates. Free, private, and no account required.
        </p>
        <div data-print-section="calculator">
        <RemoveDuplicateLinesClient />
        </div>
        <div style={{ marginTop: 12, marginBottom: 4 }}>
          <PDFExportButton toolName="Remove Duplicate Lines" />
        </div>
        <ToolAdUnit position="middle" />
        <section style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>About Remove Duplicate Lines</h2>
          <p style={{ color: 'var(--fg-2)', lineHeight: 1.7 }}>
            This tool is essential for cleaning up lists, log files, keyword exports, email lists, and any other text that may contain repeated entries. It processes your text entirely in the browser, so large files are handled quickly without uploading anything to a server. No file size limits and no data exposure.
          </p>
          <p style={{ color: 'var(--fg-2)', lineHeight: 1.7, marginTop: 12 }}>
            The tool shows you exactly how many duplicate lines were removed, giving you a clear picture of how much redundancy was in your original text. The original order of first occurrences is always preserved — the deduplication never reorders your data, only removes repeated entries.
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
              { name: 'Case Converter', href: '/tools/text/case-converter', desc: 'Convert text between cases' },
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
          toolName="Remove Duplicate Lines"
          toolSlug="remove-duplicate-lines"
          toolUrl="https://roughtools.com/tools/text/remove-duplicate-lines"
          type="general"
        />
        <ToolAdUnit position="bottom" />
      </div>
    </>
  )
}
