/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'
import ToolAdUnit from '@/components/ToolAdUnit'
import TimestampConverterClient from './TimestampConverterClient'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Unix Timestamp Converter | Free Online Developer Tool | RoughTools',
  description: 'Convert Unix timestamps to human-readable dates and vice versa. Supports seconds and milliseconds, shows current live timestamp, and works entirely in your browser.',
  keywords: ['unix timestamp converter', 'timestamp to date', 'epoch converter', 'unix time', 'epoch time', 'timestamp online', 'convert unix time'],
  alternates: { canonical: 'https://roughtools.com/tools/developer/timestamp-converter' },
  openGraph: {
    title: `Timestamp Converter — Unix Time Converter | RoughTools`,
    description: `Convert Unix timestamps to human-readable dates and back. Supports milliseconds and seconds. Free online timestamp converter.`,
    url: 'https://roughtools.com/tools/developer/timestamp-converter',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Timestamp Converter — Unix Time Converter | RoughTools`,
    description: `Convert Unix timestamps to human-readable dates and back. Supports milliseconds and seconds. Free online timestamp converter.`,
  },
  robots: { index: true, follow: true },
}

const FAQ = [
  {
    q: 'Is the Unix Timestamp Converter free to use?',
    a: 'Yes, the Unix Timestamp Converter is completely free with no subscription, premium tier, or hidden charges. You can convert unlimited timestamps between epoch format and human-readable dates at no cost. RoughTools is funded through non-intrusive advertising, which keeps every tool on the platform permanently free for developers, students, and professionals worldwide.',
  },
  {
    q: 'Do I need to sign up or create an account to use this tool?',
    a: 'No account or registration is required. Open the page, enter your timestamp or date, and convert instantly. RoughTools is designed for developers who need quick answers without friction — no email, no password, no profile required. All conversion happens locally in your browser without any authentication step.',
  },
  {
    q: 'Is my data safe? Does this tool store or send my timestamps to a server?',
    a: 'No data is ever sent to a server. All timestamp conversions happen entirely in your browser using JavaScript\'s built-in Date API. Your timestamps, dates, and any values you enter are processed locally on your device and never transmitted, logged, or stored anywhere. You can safely use this tool with sensitive internal timestamps from production logs or private systems.',
  },
  {
    q: 'Does the Timestamp Converter work on mobile phones and tablets?',
    a: 'Yes. The tool is fully responsive and works correctly on smartphones, tablets, and desktop computers. The layout adapts automatically to smaller screens so you can enter a timestamp, select the unit (seconds or milliseconds), and read the converted date without any horizontal scrolling or zoomed-out text. All modern mobile browsers — Chrome for Android and Safari for iOS — are supported.',
  },
  {
    q: 'Which browsers support this timestamp converter?',
    a: 'The Unix Timestamp Converter works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave. These browsers cover well over 97% of global web traffic. The tool relies on standard JavaScript Date APIs that have been universally supported for over a decade. Internet Explorer is not supported, as it reached end-of-life in June 2022.',
  },
  {
    q: 'How accurate is the Unix Timestamp Converter?',
    a: 'The converter uses the JavaScript Date object, which is accurate to the millisecond and handles time zones correctly by reading your system\'s UTC offset. Conversion from timestamp to UTC date is exact. Local time conversion depends on your device\'s configured time zone, so if your device clock is accurate, the displayed local time will be accurate. The tool does not introduce any rounding or approximation.',
  },
  {
    q: 'Can I use this timestamp converter offline?',
    a: 'Once the page has fully loaded in your browser, timestamp conversion works offline because no server calls are made. All processing uses the browser\'s built-in JavaScript Date API. You do not need an active internet connection after the initial load. For frequent offline use, open the page before you lose connectivity — or bookmark it and load it in advance when you know you will be working offline.',
  },
  {
    q: 'How do I use the Unix Timestamp Converter? Step-by-step guide.',
    a: 'Using this tool is straightforward. Step one: to convert a timestamp to a date, paste your numeric timestamp into the "Timestamp to Date" field and select whether it is in seconds or milliseconds — the result displays immediately in both UTC and your local time. Step two: to convert a date to a timestamp, enter or pick a date and time using the date field — the equivalent Unix timestamp in both seconds and milliseconds is shown instantly. The live counter at the top shows the current epoch time updating every second.',
  },
  {
    q: 'Why use RoughTools Timestamp Converter instead of other websites?',
    a: 'RoughTools automatically detects whether your input is in seconds (10 digits) or milliseconds (13 digits), removing guesswork. The live epoch counter updates every second so you can copy the current time instantly. All processing is local — no server round-trips mean no latency and no data exposure. The page loads fast without heavy frameworks, getting you to your answer faster than most alternatives.',
  },
  {
    q: 'How do I report a bug or suggest a new feature for this tool?',
    a: 'Use the Contact page on RoughTools to report bugs or submit feature ideas. When reporting a bug, include your browser name and version, operating system, the specific timestamp or date value that caused the unexpected result, and a description of what you expected versus what you got. Feature suggestions with a clear use case receive priority consideration from the development team.',
  },
  {
    q: 'What is a Unix timestamp and why do developers use it?',
    a: 'A Unix timestamp (also called epoch time) is the number of seconds that have elapsed since January 1, 1970 00:00:00 UTC — the Unix epoch. It is timezone-independent, sorts correctly as an integer, and is universally supported in every programming language and database. Developers use timestamps for log files, database records, cache expiry, API responses, and any scenario where a precise, sortable moment in time needs to be stored compactly.',
  },
  {
    q: 'What is the difference between seconds and milliseconds Unix timestamps?',
    a: 'Standard Unix timestamps count seconds elapsed since the epoch and produce a 10-digit number (e.g., 1700000000). JavaScript\'s Date.now() and many modern APIs return milliseconds, producing a 13-digit number (e.g., 1700000000000). If you receive a timestamp that produces a date far in the future or past, check whether it is in milliseconds when you expected seconds — divide by 1000 to convert milliseconds to seconds.',
  },
  {
    q: 'What is the Year 2038 problem for Unix timestamps?',
    a: 'On 32-bit systems that store Unix timestamps as a signed 32-bit integer, the maximum value is 2,147,483,647, which corresponds to January 19, 2038 at 03:14:07 UTC. After that moment, the counter overflows and rolls back to a large negative number representing 1901. Modern 64-bit systems and most updated software store timestamps as 64-bit integers, pushing the overflow date billions of years into the future. New systems should always use 64-bit timestamp storage.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Unix Timestamp Converter',
  url: 'https://roughtools.com/tools/developer/timestamp-converter',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Convert Unix timestamps to human-readable dates and vice versa. Supports seconds and milliseconds. Free, private, runs in your browser.',
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
    { '@type': 'ListItem', position: 2, name: 'Developer Tools', item: 'https://roughtools.com/tools/developer' },
    { '@type': 'ListItem', position: 3, name: 'Timestamp Converter', item: 'https://roughtools.com/tools/developer/timestamp-converter' },
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
          <Link href="/tools/developer" style={{ color: '#888', textDecoration: 'none' }}>Developer Tools</Link> › Timestamp Converter
        </nav>
        <h1 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 900, marginBottom: 8, letterSpacing: -1 }}>Unix Timestamp Converter</h1>
        <p style={{ color: '#888', marginBottom: 24, fontSize: 15 }}>
          Convert Unix timestamps to readable dates and dates back to timestamps. Supports both seconds and milliseconds, displays results in UTC and your local timezone, and shows the current epoch time live. Free, instant, and no account required.
        </p>
        <TimestampConverterClient />
        <ToolAdUnit position="middle" />
        <section style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>About Timestamp Converter</h2>
          <p style={{ color: '#aaa', lineHeight: 1.7 }}>
            Unix timestamps are the standard way to represent moments in time in software. They are timezone-agnostic, sort correctly as integers, and work reliably across all programming languages and databases. This converter instantly translates between numeric timestamps and human-readable dates in both UTC and your local timezone, so you can quickly understand log entries, API responses, and database records.
          </p>
          <p style={{ color: '#aaa', lineHeight: 1.7, marginTop: 12 }}>
            The tool automatically detects whether your input is in seconds (10 digits) or milliseconds (13 digits) and adjusts accordingly. The current timestamp display updates every second so you can see live epoch time — useful for debugging time-sensitive code, setting cache expiry values, or understanding what a specific timestamp represents in a log file.
          </p>
        </section>
        <section style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>Frequently Asked Questions</h2>
          {FAQ.map(({ q, a }, i) => (
            <div key={i} style={{ marginBottom: 16, padding: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.07)' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6, color: '#e0e0ff' }}>{q}</h3>
              <p style={{ fontSize: 14, color: '#999', margin: 0, lineHeight: 1.7 }}>{a}</p>
            </div>
          ))}
        </section>
        <ToolAdUnit position="bottom" />
      </div>
    </>
  )
}
