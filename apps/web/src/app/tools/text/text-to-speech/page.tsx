/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'
import ToolAdUnit from '@/components/ToolAdUnit'
import TextToSpeechClient from './TextToSpeechClient'
import Link from 'next/link'
import { PDFExportButton } from '@/components/PDFExportButton'
import { ToolPageExtras } from '@/components/ToolPageExtras'

export const metadata: Metadata = {
  title: 'Text to Speech | Free Online TTS Tool | RoughTools',
  description: 'Convert any text to speech using your browser\'s built-in voices. Choose voice, speed, and pitch. Free online text-to-speech tool — no download or signup required.',
  keywords: ['text to speech', 'tts online', 'text to voice', 'browser text to speech', 'speech synthesis', 'read text aloud'],
  alternates: { canonical: 'https://roughtools.com/tools/text/text-to-speech' },
  openGraph: {
    title: `Text to Speech — Convert Text to Audio Online | RoughTools`,
    description: `Convert text to speech online with multiple voice options. Free browser-based text-to-speech converter tool.`,
    url: 'https://roughtools.com/tools/text/text-to-speech',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Text to Speech — Convert Text to Audio Online | RoughTools`,
    description: `Convert text to speech online with multiple voice options. Free browser-based text-to-speech converter tool.`,
  },
  robots: { index: true, follow: true },
}

const FAQ = [
  {
    q: 'Is the Text to Speech tool free to use?',
    a: 'Yes, the Text to Speech tool on RoughTools is completely free with no subscription, character limits, or premium voices behind a paywall. You can convert unlimited text to speech at no cost using the voices built into your browser and operating system. RoughTools is funded through non-intrusive advertising, which keeps every tool on the platform permanently free for all users.',
  },
  {
    q: 'Do I need to create an account to use Text to Speech?',
    a: 'No account or registration is required. Open the Text to Speech page, paste your text, select a voice, and click Speak. There is no email address, password, or profile needed at any point. The tool uses your browser\'s native Web Speech API, which is available immediately without any authentication or setup step on your part.',
  },
  {
    q: 'Is my text safe? Does this tool send my text to a server?',
    a: 'Your text is processed entirely by your browser\'s built-in Web Speech API (SpeechSynthesis), which runs locally using voices installed on your operating system. No text is transmitted to RoughTools servers. However, some operating system voices — particularly high-quality neural voices on Windows and macOS — may use a cloud connection to generate speech. Check your OS voice settings if sending text externally is a concern for your specific use case.',
  },
  {
    q: 'Does the Text to Speech tool work on mobile phones and tablets?',
    a: 'Yes. The Web Speech API is supported on most modern smartphones and tablets. On iOS devices, Safari has the best voice support. On Android, Chrome provides access to Google\'s text-to-speech engine. The tool\'s interface adapts to mobile screen sizes so you can select voices, adjust settings, and play speech comfortably on any device. The number of available voices varies by operating system and device.',
  },
  {
    q: 'Which browsers support this Text to Speech tool?',
    a: 'The Text to Speech tool works best in Google Chrome, Microsoft Edge, and Safari, which provide the richest selection of voices through the Web Speech API. Firefox has limited support and may offer fewer voices. Opera and Brave use the same engine as Chrome and are fully compatible. Internet Explorer does not support the Web Speech API and is not supported. Mobile browsers on iOS (Safari) and Android (Chrome) also support speech synthesis with device voices.',
  },
  {
    q: 'How accurate is the text-to-speech pronunciation?',
    a: 'Pronunciation accuracy depends entirely on the voice engine provided by your operating system and browser. Modern neural voices on Windows (Microsoft neural voices) and macOS (Siri voices) produce very natural, accurate speech for standard English text. Older system voices are less natural but still reliably accurate for most words. Technical jargon, acronyms, and proper nouns may be mispronounced by any voice — this is a limitation of the underlying OS voice engine, not the tool itself.',
  },
  {
    q: 'Can I use the Text to Speech tool offline?',
    a: 'This depends on which voices are installed on your device. Most browsers load voices from the operating system\'s local voice library, which works offline. However, high-quality neural voices on Windows and some voices on Chrome may require an internet connection to stream audio from a cloud service. To test offline capability, disconnect from the internet and check whether voices are still listed and playback works. Local system voices — typically labeled with your OS language — almost always work offline.',
  },
  {
    q: 'How do I convert text to speech? Step-by-step guide.',
    a: 'Using the Text to Speech tool is simple. Step one: open the Text to Speech page on RoughTools — the tool loads available voices from your browser automatically. Step two: paste or type the text you want to hear into the text area. Step three: select a voice from the dropdown — you will see voices from your operating system organized by language and gender. Step four: adjust the Rate slider to control speaking speed (1 is default, below 1 is slower, above 1 is faster) and the Pitch slider if desired. Step five: click the Speak button to start playback. Click Stop to stop at any time.',
  },
  {
    q: 'Why use RoughTools Text to Speech instead of other websites?',
    a: 'RoughTools uses your browser\'s native Web Speech API, which means no audio data is processed by RoughTools servers, no account is required, and there are no character limits imposed by an API quota. The tool is instantly available the moment the page loads. It is particularly useful for proofreading (hearing text helps catch errors your eyes miss), accessibility needs, and hands-free listening when you want to consume long content without reading it.',
  },
  {
    q: 'How do I report a bug or suggest a new feature for this tool?',
    a: 'Use the Contact page on RoughTools to report bugs or suggest improvements. When reporting a voice or playback issue, include your browser name and version, operating system, the voice you selected, and a description of what happened versus what you expected. Common feature requests include audio download capability and bookmarking specific voice-rate-pitch combinations. The team reviews all submissions for future consideration.',
  },
  {
    q: 'What is the Web Speech API and how does it power this tool?',
    a: 'The Web Speech API is a browser standard that gives JavaScript access to speech recognition and speech synthesis capabilities provided by the operating system. The SpeechSynthesis interface used by this tool sends text to the OS voice engine, which converts it to audio and plays it through your speakers or headphones. Because the voice engine runs at the operating system level — not in JavaScript — the quality and selection of voices varies by platform. Chrome, Edge, and Safari expose the most voices through this API.',
  },
  {
    q: 'What do the Rate and Pitch controls do?',
    a: 'The Rate control adjusts how fast the voice speaks. A rate of 1 is the natural, default speaking pace. Values below 1 slow the speech down — 0.5 is approximately half speed, useful for language learners or listening to complex technical content. Values above 1 speed the speech up — 2 is approximately double speed, useful for quickly listening to long documents. The Pitch control adjusts the tonal frequency of the voice. Higher pitch values produce a higher, lighter voice; lower values produce a deeper, heavier voice. Not all voices respond equally to pitch adjustments.',
  },
  {
    q: 'Why are there no voices available in my browser?',
    a: 'Voices may not appear for several reasons. First, the browser may not have finished loading the voice list — try clicking a Refresh Voices button if available, or wait a moment and refresh the page. Second, your browser may not fully support the Web Speech API — Chrome, Edge, and Safari have the best support. Third, on some Linux systems, no system voices are installed by default and must be added separately through package management. Fourth, corporate or organizational browser policies sometimes restrict speech synthesis. Try opening the tool in Google Chrome if no voices appear in another browser.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Text to Speech',
  url: 'https://roughtools.com/tools/text/text-to-speech',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Convert text to speech using the browser-native Web Speech API with voice selection, rate, and pitch controls. Free, private, no account required.',
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
    { '@type': 'ListItem', position: 3, name: 'Text to Speech', item: 'https://roughtools.com/tools/text/text-to-speech' },
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
          <Link href="/tools/text" style={{ color: '#888', textDecoration: 'none' }}>Text Tools</Link> › Text to Speech
        </nav>
        <h1 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 900, marginBottom: 8, letterSpacing: -1 }}>Text to Speech</h1>
        <p style={{ color: '#888', marginBottom: 24, fontSize: 15 }}>
          Convert any text to speech directly in your browser using your operating system&apos;s built-in voices. Choose from all available system voices, adjust speaking rate and pitch, and listen instantly. Useful for proofreading, accessibility, and hands-free reading. Free, no account required.
        </p>
        <TextToSpeechClient />
        <div style={{ marginTop: 12, marginBottom: 4 }}>
          <PDFExportButton toolName="Text to Speech" />
        </div>
        <ToolAdUnit position="middle" />
        <section style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>About Text to Speech</h2>
          <p style={{ color: 'var(--fg-2)', lineHeight: 1.7 }}>
            This tool uses the browser-native Web Speech API (SpeechSynthesis) to read text aloud using voices installed on your operating system. No audio data is sent to any server — everything happens locally in your browser, making it completely private and instant. The number and quality of available voices varies by operating system and browser.
          </p>
          <p style={{ color: 'var(--fg-2)', lineHeight: 1.7, marginTop: 12 }}>
            Text-to-speech is useful for proofreading — hearing your writing helps catch errors and awkward phrasing that your eyes skip over — as well as accessibility needs, language learning, and hands-free content consumption. Windows, macOS, and mobile devices each ship with different built-in voices ranging from basic synthesized voices to high-quality neural voices.
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
              { name: 'Text Summarizer', href: '/tools/text/text-summarizer', desc: 'Summarize long articles' },
              { name: 'Readability Score', href: '/tools/text/readability-score', desc: 'Analyze text readability' },
              { name: 'Grammar Checker', href: '/tools/text/grammar-checker', desc: 'Check grammar and spelling' },
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
          toolName="Text to Speech"
          toolSlug="text-to-speech"
          toolUrl="https://roughtools.com/tools/text/text-to-speech"
          type="general"
        />
        <ToolAdUnit position="bottom" />
      </div>
    </>
  )
}
