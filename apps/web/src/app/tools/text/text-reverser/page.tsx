/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'
import ToolAdUnit from '@/components/ToolAdUnit'
import TextReverserClient from './TextReverserClient'
import Link from 'next/link'
import { PDFExportButton } from '@/components/PDFExportButton'
import { ToolPageExtras } from '@/components/ToolPageExtras'

export const metadata: Metadata = {
  title: 'Text Reverser | Free Online Backwards Text Generator | RoughTools',
  description: 'Reverse text, words, or lines instantly. Mirror characters, reverse word order, or flip entire lines. Free online text reverser — no download or signup required.',
  keywords: ['text reverser', 'reverse text online', 'reverse words', 'reverse lines', 'mirror text', 'backwards text generator'],
  alternates: { canonical: 'https://roughtools.com/tools/text/text-reverser' },
  openGraph: {
    title: `Text Reverser — Reverse Text Online | RoughTools`,
    description: `Reverse text, words, or sentences online instantly. Free browser-based text reverser and flipper tool.`,
    url: 'https://roughtools.com/tools/text/text-reverser',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Text Reverser — Reverse Text Online | RoughTools`,
    description: `Reverse text, words, or sentences online instantly. Free browser-based text reverser and flipper tool.`,
  },
  robots: { index: true, follow: true },
}

const FAQ = [
  {
    q: 'Is the Text Reverser free to use?',
    a: 'Yes, the Text Reverser on RoughTools is completely free with no subscription, usage limits, or premium features. You can reverse unlimited text across all four transformation modes at no cost. RoughTools is funded through non-intrusive advertising, which keeps every tool on the platform permanently free for writers, developers, puzzle creators, and social media users worldwide.',
  },
  {
    q: 'Do I need to create an account to reverse text?',
    a: 'No account or registration is required. Open the Text Reverser, type or paste your text, and click any transformation to apply it instantly. There is no email address, password, or profile needed at any point. The tool transforms text the moment you interact with it — no sign-up step, no loading screen, and no delay between clicking and seeing the result.',
  },
  {
    q: 'Is my text safe? Does this tool store or send what I type?',
    a: 'Your text never leaves your device. All text reversal processing happens entirely in your browser using JavaScript string operations. Nothing you type or paste is transmitted to any server, stored in a database, or logged anywhere. You can safely reverse confidential text, private messages, and sensitive content without any risk of data exposure.',
  },
  {
    q: 'Does the Text Reverser work on mobile phones and tablets?',
    a: 'Yes. The Text Reverser is fully responsive and works on smartphones, tablets, and desktop computers. The text input and transformation buttons adapt to all screen sizes. It works in Chrome for Android, Safari for iOS, and all modern mobile browsers. The copy button functions correctly on mobile so you can paste reversed text directly into any app or social media post.',
  },
  {
    q: 'Which browsers support the Text Reverser?',
    a: 'The Text Reverser works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave. It uses standard JavaScript string methods that are universally supported in every modern browser engine. Internet Explorer is not supported, as it has been end-of-life since June 2022. Any recently updated browser will work correctly with all four transformation modes.',
  },
  {
    q: 'How accurate are the text reversal transformations?',
    a: 'Character reversal, word reversal, and line reversal are 100% accurate for standard ASCII and most Unicode text using JavaScript\'s built-in string operations. Mirror text uses Unicode character mapping to replace letters with their mirrored equivalents, which is accurate for standard Latin letters. Emoji sequences composed of multiple Unicode code points — especially combined emoji using zero-width joiners — may not reverse or mirror perfectly due to how these sequences are encoded at the character level.',
  },
  {
    q: 'Can I use the Text Reverser offline?',
    a: 'Once the page has loaded, the Text Reverser works completely offline because all processing uses JavaScript running locally in your browser with no server calls. You do not need an active internet connection after the initial page load. The tool is fully functional offline for reversing text to use in puzzles, creative writing, social media bios, and other contexts where internet access is unavailable.',
  },
  {
    q: 'How do I reverse text? Step-by-step instructions.',
    a: 'Using the Text Reverser is immediate. Step one: open the Text Reverser page on RoughTools. Step two: type or paste your text into the input area. Step three: click one of the four transformation buttons — Reverse Text to flip all characters, Reverse Words to reverse the order of words while keeping each word intact, Reverse Lines to flip the line order in multi-line text, or Mirror Text to replace each character with its mirrored Unicode equivalent. Step four: the transformed text appears instantly in the output area. Step five: click Copy to copy the result to your clipboard.',
  },
  {
    q: 'Why use RoughTools Text Reverser instead of other websites?',
    a: 'RoughTools offers four distinct reversal modes in a single tool — character reversal, word reversal, line reversal, and mirror text — so you do not need to switch between multiple sites to find the transformation you need. All processing is instant and runs locally in your browser with no server round-trips. The interface is clean, loads fast, and the copy button works reliably on both desktop and mobile.',
  },
  {
    q: 'How do I report a bug or suggest a new text transformation?',
    a: 'Use the Contact page on RoughTools to report a bug or suggest a new transformation mode. Common requests include ROT13 encoding, upside-down text, or base64 encoding. When reporting a bug, include the input text, which transformation button you clicked, and what the incorrect output was. The development team reviews all suggestions and bug reports for inclusion in future updates.',
  },
  {
    q: 'What is the difference between Reverse Text and Reverse Words?',
    a: 'Reverse Text flips the entire input string character by character from end to beginning. For example, "hello world" becomes "dlrow olleh" — every individual character is in reverse order including the space. Reverse Words treats each word as a unit and reverses only the order of words, keeping the characters within each word intact. The same input "hello world" becomes "world hello" — the words swap positions but neither word is individually reversed.',
  },
  {
    q: 'What does Reverse Lines do and when is it useful?',
    a: 'Reverse Lines flips the order of lines in multi-line text. The last line moves to the first position, the second-to-last becomes the second line, and so on until the original first line is at the bottom. The content of each individual line is unchanged — only the vertical order is reversed. This is commonly used by developers who want to see the most recent entries in a log file at the top, by writers reversing the order of list items, or by anyone who needs to invert the sequence of a numbered list.',
  },
  {
    q: 'What is Mirror Text and how does it work?',
    a: 'Mirror Text creates a visually flipped version of your input by replacing each character with its horizontally mirrored Unicode equivalent. For example, the letter "b" becomes "d", "p" becomes "q", and characters without obvious mirrors are approximated with visually similar Unicode symbols. The resulting text looks like it has been reflected in a horizontal mirror. Mirror text is popular for creative social media bios, artistic text effects, and decorative uses where a visually distinctive style is desired.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Text Reverser',
  url: 'https://roughtools.com/tools/text/text-reverser',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Reverse text characters, word order, or line order, or create mirror text. Four transformation modes. Free, private, instant.',
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
    { '@type': 'ListItem', position: 3, name: 'Text Reverser', item: 'https://roughtools.com/tools/text/text-reverser' },
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
          <Link href="/tools/text" style={{ color: '#888', textDecoration: 'none' }}>Text Tools</Link> › Text Reverser
        </nav>
        <h1 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 900, marginBottom: 8, letterSpacing: -1 }}>Text Reverser</h1>
        <p style={{ color: '#888', marginBottom: 24, fontSize: 15 }}>
          Reverse text character by character, flip word order, reverse line order, or create mirror text — all instantly in your browser. Four transformation modes in one tool. Processing is local, private, and requires no account or installation.
        </p>
        <TextReverserClient />
        <div style={{ marginTop: 12, marginBottom: 4 }}>
          <PDFExportButton toolName="Text Reverser" />
        </div>
        <ToolAdUnit position="middle" />
        <section style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>About Text Reverser</h2>
          <p style={{ color: 'var(--fg-2)', lineHeight: 1.7 }}>
            The Text Reverser offers four distinct transformations: full character reversal, word-order reversal, line-order reversal, and mirror text. Each runs instantly in the browser without any server communication or data transmission. All four modes are available in a single interface so you can experiment with different transformations without switching pages.
          </p>
          <p style={{ color: 'var(--fg-2)', lineHeight: 1.7, marginTop: 12 }}>
            Reversed text is popular for creative writing, word puzzles, social media bios, and fun messaging. Reversed lines are useful for developers working with log files who want to see the most recent entries first. Mirror text creates a visually striking effect for decorative and artistic use cases where standard typography is not enough.
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
              { name: 'Find & Replace', href: '/tools/text/find-replace', desc: 'Find and replace text' },
              { name: 'Remove Duplicate Lines', href: '/tools/text/remove-duplicate-lines', desc: 'Remove duplicate lines' },
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
          toolName="Text Reverser"
          toolSlug="text-reverser"
          toolUrl="https://roughtools.com/tools/text/text-reverser"
          type="general"
        />
        <ToolAdUnit position="bottom" />
      </div>
    </>
  )
}
