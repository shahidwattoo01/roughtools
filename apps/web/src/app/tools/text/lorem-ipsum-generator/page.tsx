/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'
import ToolAdUnit from '@/components/ToolAdUnit'
import LoremIpsumClient from './LoremIpsumClient'
import Link from 'next/link'
import { PDFExportButton } from '@/components/PDFExportButton'
import { ToolPageExtras } from '@/components/ToolPageExtras'

export const metadata: Metadata = {
  title: 'Lorem Ipsum Generator | Free Placeholder Text Tool | RoughTools',
  description: 'Generate Lorem Ipsum placeholder text instantly. Choose paragraphs, sentences, or words with custom counts. Free online Lorem Ipsum generator — no signup required.',
  keywords: ['lorem ipsum generator', 'placeholder text', 'dummy text generator', 'lorem ipsum text', 'placeholder content'],
  alternates: { canonical: 'https://roughtools.com/tools/text/lorem-ipsum-generator' },
  openGraph: {
    title: `Lorem Ipsum Generator — Generate Placeholder Text | RoughTools`,
    description: `Generate Lorem Ipsum placeholder text in words, sentences, or paragraphs. Free online Lorem Ipsum generator.`,
    url: 'https://roughtools.com/tools/text/lorem-ipsum-generator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Lorem Ipsum Generator — Generate Placeholder Text | RoughTools`,
    description: `Generate Lorem Ipsum placeholder text in words, sentences, or paragraphs. Free online Lorem Ipsum generator.`,
  },
  robots: { index: true, follow: true },
}

const FAQ = [
  {
    q: 'Is the Lorem Ipsum Generator free to use?',
    a: 'Yes, the Lorem Ipsum Generator on RoughTools is completely free with no subscription, usage limits, or premium tier. You can generate unlimited paragraphs, sentences, or words of placeholder text at no cost. RoughTools is funded through non-intrusive advertising, which keeps every tool on the platform permanently free for designers, developers, content creators, and students worldwide.',
  },
  {
    q: 'Do I need to create an account to generate Lorem Ipsum text?',
    a: 'No account or registration is required. Open the Lorem Ipsum Generator, select your output format and quantity, and click Generate to get placeholder text immediately. There is no email address, password, or profile needed at any point. The tool is designed for instant access without any sign-up friction — most users get usable placeholder text within five seconds of opening the page.',
  },
  {
    q: 'Does this tool store or transmit the text I generate?',
    a: 'No data is stored or transmitted. The Lorem Ipsum text is generated entirely in your browser using a static source text stored in the page\'s JavaScript. No server requests are made at any point during generation, and no output is logged or retained. The tool works completely locally on your device from the moment the page loads.',
  },
  {
    q: 'Does the Lorem Ipsum Generator work on mobile phones and tablets?',
    a: 'Yes. The Lorem Ipsum Generator is fully responsive and works on smartphones, tablets, and desktop computers. The format selector and quantity input adapt to all screen sizes, and the generated text can be copied with a single tap on mobile. It works in Chrome for Android, Safari for iOS, and all modern mobile browsers without requiring any app installation.',
  },
  {
    q: 'Which browsers support this Lorem Ipsum generator?',
    a: 'The Lorem Ipsum Generator works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave. It uses basic JavaScript and DOM APIs that are universally supported across all modern browser engines. Internet Explorer is not supported, as it reached end-of-life in June 2022. Any browser updated in the last five years will work correctly.',
  },
  {
    q: 'How accurate is the Lorem Ipsum text this tool generates?',
    a: 'The generated text is drawn from the standard Lorem Ipsum source — the classical Latin passage from Cicero\'s "de Finibus Bonorum et Malorum", intentionally scrambled so the content is meaningless. The output matches the traditional Lorem Ipsum text that has been used in typesetting and design since the 1960s. When the requested quantity exceeds the source text length, the tool cycles through the source material to fill the requested amount.',
  },
  {
    q: 'Can I use the Lorem Ipsum Generator offline?',
    a: 'Yes. Once the page has loaded, the Lorem Ipsum Generator works completely offline because all source text and generation logic are stored locally in your browser. No internet connection is required after the initial page load. This makes it especially useful for designers and developers working on wireframes or prototypes without Wi-Fi access.',
  },
  {
    q: 'How do I generate Lorem Ipsum placeholder text? Step-by-step.',
    a: 'Generating placeholder text takes just a few seconds. Step one: open the Lorem Ipsum Generator on this page. Step two: select your output format — Paragraphs for full multi-sentence paragraphs, Sentences for individual sentences, or Words for a plain sequence of words. Step three: enter the quantity you need in the number field — for example, 3 paragraphs or 50 words. Step four: click the Generate button to produce the text. Step five: click Copy to copy the entire output to your clipboard and paste it into your design tool or code editor.',
  },
  {
    q: 'Why use RoughTools Lorem Ipsum Generator instead of other websites?',
    a: 'RoughTools generates Lorem Ipsum entirely in your browser with no server round-trip, so generation is instantaneous regardless of your internet speed. The tool supports three output formats — paragraphs, sentences, and words — with a configurable quantity in a single clean interface. The page loads fast and the output copies in one click, making it faster than most competing Lorem Ipsum tools.',
  },
  {
    q: 'How do I report a bug or suggest a feature for this tool?',
    a: 'Use the Contact page on RoughTools to report bugs or suggest improvements. Common requests include alternative placeholder text styles (such as random English words or foreign language placeholders), HTML-wrapped output, or character count targets. When reporting a bug, describe what output format you selected, what quantity you entered, and what unexpected result you received. The team reviews all submissions for future updates.',
  },
  {
    q: 'What is Lorem Ipsum and where does it come from?',
    a: 'Lorem Ipsum is placeholder dummy text derived from a scrambled excerpt of "de Finibus Bonorum et Malorum" (On the Ends of Good and Evil), a philosophical work written by the Roman orator Cicero in 45 BC. The text was deliberately scrambled to make it content-free while maintaining a natural distribution of Latin letters and word lengths. It has been used in typesetting and printing as standard placeholder text since the 1500s, and became ubiquitous in digital design tools from the 1980s onwards.',
  },
  {
    q: 'Why do designers use Lorem Ipsum instead of real content?',
    a: 'Designers use Lorem Ipsum during the layout and wireframing phase because it prevents viewers from reading the placeholder text and getting distracted by the content. When real text is used, clients and stakeholders often focus on editing the words instead of evaluating the layout, typography, and visual hierarchy — which is what the design review should focus on. Lorem Ipsum has realistic word lengths and letter distributions so it fills space the same way real text would without communicating any actual meaning.',
  },
  {
    q: 'What are the different output modes in the Lorem Ipsum Generator?',
    a: 'The generator supports three output formats. Paragraphs mode produces full blocks of text with multiple sentences per paragraph, separated by line breaks — ideal for filling body content areas in designs. Sentences mode produces individual standalone sentences — useful when you need a specific number of text blocks. Words mode produces a plain sequence of Lorem Ipsum words without sentence structure — useful for filling small UI elements like button labels, navigation items, tags, or short captions where you just need a few words of content.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Lorem Ipsum Generator',
  url: 'https://roughtools.com/tools/text/lorem-ipsum-generator',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Generate Lorem Ipsum placeholder text in paragraphs, sentences, or words format with configurable quantity. Free, offline-capable, instant.',
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
    { '@type': 'ListItem', position: 3, name: 'Lorem Ipsum Generator', item: 'https://roughtools.com/tools/text/lorem-ipsum-generator' },
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
          <Link href="/tools/text" style={{ color: '#888', textDecoration: 'none' }}>Text Tools</Link> › Lorem Ipsum Generator
        </nav>
        <h1 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 900, marginBottom: 8, letterSpacing: -1 }}>Lorem Ipsum Generator</h1>
        <p style={{ color: '#888', marginBottom: 24, fontSize: 15 }}>
          Generate Lorem Ipsum placeholder text in seconds. Choose between paragraphs, sentences, or words with full control over the output length. All generation happens locally in your browser — instant, offline-capable, and no account required.
        </p>
        <div data-print-section="calculator">
        <LoremIpsumClient />
        </div>
        <div style={{ marginTop: 12, marginBottom: 4 }}>
          <PDFExportButton toolName="Lorem Ipsum Generator" />
        </div>
        <ToolAdUnit position="middle" />
        <section style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>About Lorem Ipsum Generator</h2>
          <p style={{ color: 'var(--fg-2)', lineHeight: 1.7 }}>
            Lorem Ipsum has been the industry standard dummy text for designers and developers since the 1960s. This generator lets you produce any amount of placeholder text in three flexible formats — paragraphs, sentences, and words — making it perfect for mockups, wireframes, UI prototypes, and print layouts.
          </p>
          <p style={{ color: 'var(--fg-2)', lineHeight: 1.7, marginTop: 12 }}>
            Unlike random word generators, Lorem Ipsum maintains realistic letter frequency and word length distributions so your layouts look natural and balanced. Copy the output with one click and paste it directly into your design tool, code editor, CMS, or document template.
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
              { name: 'Text Reverser', href: '/tools/text/text-reverser', desc: 'Reverse any text instantly' },
              { name: 'Remove Duplicate Lines', href: '/tools/text/remove-duplicate-lines', desc: 'Remove duplicate lines' },
              { name: 'Case Converter', href: '/tools/text/case-converter', desc: 'Convert text between cases' },
              { name: 'Readability Score', href: '/tools/text/readability-score', desc: 'Analyze text readability' },
            ].map(t => (
              <a key={t.href} href={t.href} style={{ display: 'block', padding: '14px 16px', background: 'var(--bg-2)', border: '1px solid var(--line)', borderRadius: 10, color: 'var(--fg)', textDecoration: 'none' }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{t.name}</div>
                <div style={{ fontSize: 12, color: 'var(--fg-2)' }}>{t.desc}</div>
              </a>
            ))}
          </div>
        </section>
        <ToolPageExtras
          toolName="Lorem Ipsum Generator"
          toolSlug="lorem-ipsum-generator"
          toolUrl="https://roughtools.com/tools/text/lorem-ipsum-generator"
          type="general"
          showPDF
        />
        <ToolAdUnit position="bottom" />
      </div>
    </>
  )
}
