/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'
import ToolAdUnit from '@/components/ToolAdUnit'
import TextSummarizerClient from './TextSummarizerClient'
import Link from 'next/link'
import { PDFExportButton } from '@/components/PDFExportButton'
import { ToolPageExtras } from '@/components/ToolPageExtras'

export const metadata: Metadata = {
  title: 'Text Summarizer | Free Online Article Summarizer | RoughTools',
  description: 'Summarize long text automatically using extractive summarization. Extracts the most important sentences from any article or document. Free — no AI API required, no signup.',
  keywords: ['text summarizer', 'auto summarizer', 'extractive summarization', 'article summarizer', 'text summary generator', 'summarize text online'],
  alternates: { canonical: 'https://roughtools.com/tools/text/text-summarizer' },
  openGraph: {
    title: `Text Summarizer — Summarize Text Online Free | RoughTools`,
    description: `Summarize long articles, documents, and text automatically. Free online text summarizer and abstract generator.`,
    url: 'https://roughtools.com/tools/text/text-summarizer',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Text Summarizer — Summarize Text Online Free | RoughTools`,
    description: `Summarize long articles, documents, and text automatically. Free online text summarizer and abstract generator.`,
  },
  robots: { index: true, follow: true },
}

const FAQ = [
  {
    q: 'Is the Text Summarizer free to use?',
    a: 'Yes, the Text Summarizer on RoughTools is completely free with no subscription, usage limits, or premium tier. You can summarize unlimited articles and documents at no cost. RoughTools is funded through non-intrusive advertising, which keeps every tool on the platform permanently free for students, researchers, journalists, and professionals who need to process large amounts of text quickly.',
  },
  {
    q: 'Do I need to create an account to summarize text?',
    a: 'No account or registration is required. Open the Text Summarizer, paste your article or document, and click Summarize to get key sentences instantly. There is no email address, password, or profile needed at any point. The tool is designed for fast, frictionless text processing — you can go from a full article to a condensed summary in under five seconds without any sign-up step.',
  },
  {
    q: 'Is my text safe? Does this tool send my content to a server?',
    a: 'Your text never leaves your device. All summarization processing happens entirely in your browser using JavaScript sentence scoring algorithms. Nothing you paste is transmitted to any server, stored in a database, or read by anyone. This means you can safely summarize confidential reports, internal documents, proprietary research, and private writing without any risk of content exposure.',
  },
  {
    q: 'Does the Text Summarizer work on mobile phones and tablets?',
    a: 'Yes. The tool is fully responsive and works on smartphones, tablets, and desktop computers. The text input, length slider, and output area adapt to all screen sizes. It works in Chrome for Android, Safari for iOS, and all modern mobile browsers. For long articles and research papers, a desktop browser with a physical keyboard is more comfortable for pasting and reviewing large amounts of text.',
  },
  {
    q: 'Which browsers support this text summarizer?',
    a: 'The Text Summarizer works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave. The tool uses standard JavaScript array methods and string operations that are universally supported in all modern browser engines. Internet Explorer is not supported, as it reached end-of-life in June 2022. Any browser updated within the last five years will work correctly.',
  },
  {
    q: 'How accurate is the automatic text summarization?',
    a: 'The tool uses extractive summarization, which selects actual sentences from your text — so the summary is always factually accurate relative to the source. The quality of sentence selection depends on text structure: well-organized articles with clear topic sentences produce excellent summaries. Very short texts, bullet-point lists, conversational content, and highly technical writing with specialized terminology produce less useful summaries because sentence scoring based on word frequency works best on structured prose.',
  },
  {
    q: 'Can I use the Text Summarizer offline?',
    a: 'Once the page has loaded, the Text Summarizer works completely offline because all processing uses JavaScript running locally in your browser with no server calls. You do not need an active internet connection after the initial page load. This makes it useful for summarizing documents while traveling, on a plane, or in environments where internet access is restricted.',
  },
  {
    q: 'How do I summarize text with this tool? Step-by-step.',
    a: 'Summarizing text is straightforward. Step one: open the Text Summarizer on this page. Step two: paste the article, essay, or document you want to summarize into the input area. Step three: use the summary length slider to set how many sentences you want in the output — the default is 3 sentences, and you can choose between 1 and 10. Step four: click the Summarize button to generate the summary. Step five: review the extracted sentences in the output area and click Copy to copy the summary to your clipboard.',
  },
  {
    q: 'Why use RoughTools Text Summarizer instead of AI-powered tools?',
    a: 'RoughTools processes text entirely in your browser — no data is ever sent to a server, which means complete privacy. It is also completely free with no API quota to exhaust and no rate limits. For summarizing confidential documents, proprietary research, or private writing, a local browser-based tool is safer than sending content to an external AI API. For high-quality paraphrased summaries that rephrase content, AI-powered tools are more capable — but for fast private extraction of key sentences, this tool excels.',
  },
  {
    q: 'How do I report a bug or suggest a new feature?',
    a: 'Use the Contact page on RoughTools to report a bug or suggest improvements. Common feature requests include adjusting the summary length as a percentage of the original, support for non-English text, or export options. When reporting a bug, include a short excerpt of the text you were summarizing, the summary length you selected, and what unexpected result the tool produced. The team reviews all submissions for future updates.',
  },
  {
    q: 'What is extractive summarization and how does it work?',
    a: 'Extractive summarization is a technique that selects and extracts the most important sentences directly from the original text without rewriting or paraphrasing them. The algorithm scores each sentence by counting how frequently the significant words in that sentence appear across the entire document — sentences containing words that appear most often throughout the text are considered the most representative. The highest-scoring sentences are selected as the summary. Because the original sentences are used verbatim, the summary is always factually accurate.',
  },
  {
    q: 'What is the difference between extractive and abstractive summarization?',
    a: 'Extractive summarization picks actual sentences from the original text and presents them as the summary. The words are the author\'s own — nothing is rewritten or paraphrased. Abstractive summarization, used by AI language models, reads the entire document, understands the meaning, and generates new sentences that paraphrase and condense the content — similar to how a human would write a summary in their own words. Extractive summarization is faster, fully private (no server needed), and always factually accurate. Abstractive summarization produces more natural, concise summaries but requires an AI model and server infrastructure.',
  },
  {
    q: 'What types of text work best with the Text Summarizer?',
    a: 'The summarizer works best on structured prose with clear topic sentences — news articles, academic abstracts, essay-style blog posts, research summaries, and formal reports. These text types have strong word frequency patterns that the scoring algorithm can identify reliably. Content that does not summarize well includes very short texts under 100 words (not enough content for meaningful selection), bullet-point lists (which lack sentence structure), highly conversational text or transcripts (where repetition does not indicate importance), and poetry or fiction (where meaning is not carried by word frequency).',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Text Summarizer',
  url: 'https://roughtools.com/tools/text/text-summarizer',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Automatically summarize long text using extractive sentence scoring. No AI API, no server, completely private. Free and instant.',
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
    { '@type': 'ListItem', position: 3, name: 'Text Summarizer', item: 'https://roughtools.com/tools/text/text-summarizer' },
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
          <Link href="/tools/text" style={{ color: '#888', textDecoration: 'none' }}>Text Tools</Link> › Text Summarizer
        </nav>
        <h1 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 900, marginBottom: 8, letterSpacing: -1 }}>Text Summarizer</h1>
        <p style={{ color: '#888', marginBottom: 24, fontSize: 15 }}>
          Automatically extract the most important sentences from any article or document using browser-based extractive summarization — no AI API, no server, and no data transmission. Choose 1 to 10 summary sentences. Completely private and free with no account required.
        </p>
        <TextSummarizerClient />
        <div style={{ marginTop: 12, marginBottom: 4 }}>
          <PDFExportButton toolName="Text Summarizer" />
        </div>
        <ToolAdUnit position="middle" />
        <section style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>About Text Summarizer</h2>
          <p style={{ color: 'var(--fg-2)', lineHeight: 1.7 }}>
            This text summarizer uses extractive summarization — a technique that scores each sentence based on word frequency across the document and selects the highest-scoring sentences as the summary. This approach requires no external API and runs entirely in your browser, making it instant, free, and completely private regardless of what content you paste.
          </p>
          <p style={{ color: 'var(--fg-2)', lineHeight: 1.7, marginTop: 12 }}>
            Extractive summarization is ideal for quickly distilling key points from long news articles, research abstracts, meeting transcripts, and formal reports. Because it preserves the original author&apos;s exact words, the summary is always factually accurate relative to the source text — no paraphrasing errors, no hallucinations.
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
              { name: 'Grammar Checker', href: '/tools/text/grammar-checker', desc: 'Check grammar and spelling' },
              { name: 'Case Converter', href: '/tools/text/case-converter', desc: 'Convert text between cases' },
              { name: 'Text to Speech', href: '/tools/text/text-to-speech', desc: 'Convert text to audio' },
            ].map(t => (
              <a key={t.href} href={t.href} style={{ display: 'block', padding: '14px 16px', background: 'var(--bg-2)', border: '1px solid var(--line)', borderRadius: 10, color: 'var(--fg)', textDecoration: 'none' }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{t.name}</div>
                <div style={{ fontSize: 12, color: 'var(--fg-2)' }}>{t.desc}</div>
              </a>
            ))}
          </div>
        </section>
        <ToolPageExtras
          toolName="Text Summarizer"
          toolSlug="text-summarizer"
          toolUrl="https://roughtools.com/tools/text/text-summarizer"
          type="general"
          showPDF
        />
        <ToolAdUnit position="bottom" />
      </div>
    </>
  )
}
