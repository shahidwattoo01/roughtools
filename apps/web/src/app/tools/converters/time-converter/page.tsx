import type { Metadata } from 'next'
import Link from 'next/link'
import TimeConverterClient from './TimeConverterClient'
import { PDFExportButton } from '@/components/PDFExportButton'
import { ToolPageExtras } from '@/components/ToolPageExtras'

export const metadata: Metadata = {
  title: 'Time Converter — Seconds, Minutes, Hours, Days, Years | RoughTools',
  description: 'Convert time units instantly. Supports seconds, minutes, hours, days, weeks, months, and years. Free online time duration converter with real-time results.',
  keywords: ['time converter', 'seconds to minutes', 'hours to days', 'minutes to hours', 'days to weeks', 'time unit converter', 'duration converter'],
  alternates: { canonical: 'https://roughtools.com/tools/converters/time-converter' },
  openGraph: {
    title: `Time Converter — Seconds, Minutes, Hours, Days | RoughTools`,
    description: `Convert time units: seconds, minutes, hours, days, weeks, and more. Free online time unit converter tool.`,
    url: 'https://roughtools.com/tools/converters/time-converter',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Time Converter — Seconds, Minutes, Hours, Days | RoughTools`,
    description: `Convert time units: seconds, minutes, hours, days, weeks, and more. Free online time unit converter tool.`,
  },
  robots: { index: true, follow: true },
}

const FAQS = [
  {
    q: 'Is this time converter free to use?',
    a: 'Yes, the RoughTools Time Converter is completely free with no account, subscription, or payment required. You can convert between seconds, minutes, hours, days, weeks, months, and years as many times as needed at no cost. RoughTools is funded through non-intrusive advertising, keeping every converter permanently free. There are no usage limits, no premium time units behind a paywall, and no registration required.'
  },
  {
    q: 'Do I need to sign up to convert time units?',
    a: 'No account, email address, or registration is required. Enter a value and select your source unit — the converter instantly shows the equivalent in all supported time units simultaneously. There is no login wall, no upgrade required, and no data stored about your conversions. The converter is entirely anonymous and can be used unlimited times without any sign-up process.'
  },
  {
    q: 'Does this time converter store the values I enter?',
    a: 'No. All conversions run entirely within your browser using JavaScript. The values you enter are never transmitted to RoughTools servers, never logged, and never shared with any third party. Once you close the browser tab, all data is gone. Your duration calculations remain completely private — whether you are converting project timelines, subscription periods, data retention windows, or scientific time measurements.'
  },
  {
    q: 'Does this time converter work on mobile and tablet?',
    a: 'Yes, the converter is fully responsive and works on all modern smartphones and tablets. All input fields and the results panel are optimised for touch screens. This is useful when calculating project durations, subscription periods, service level agreement timeframes, or converting time values from technical documentation while on your mobile device or tablet.'
  },
  {
    q: 'Which browsers support this time converter?',
    a: 'The Time Converter works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave on both desktop and mobile. No plugins or extensions are required. The converter uses standard JavaScript arithmetic that runs natively in every current browser. Any current version of Chrome, Firefox, or Safari on desktop or mobile is fully supported.'
  },
  {
    q: 'How accurate are the time duration conversions?',
    a: 'The sub-day conversions (seconds, minutes, hours) are exact: 1 minute = exactly 60 seconds, 1 hour = exactly 3,600 seconds, 1 day = exactly 86,400 seconds. Weeks are exact: 1 week = exactly 7 days. Months and years use averages because calendar months vary: this converter uses 30.4375 days per month (365.25 ÷ 12) and 365.25 days per year — the standard average accounting for leap years. For calendar-specific calculations involving exact dates, use a date difference calculator.'
  },
  {
    q: 'Can I use this time converter without an internet connection?',
    a: 'Once the page has fully loaded in your browser, all conversions run in JavaScript without requiring an active internet connection. You can enter time values and see all unit conversions offline after the initial page load. The initial page load requires internet access, but after that the converter functions entirely client-side. This is useful when reviewing technical documentation, project plans, or data retention policies away from reliable internet access.'
  },
  {
    q: 'How do I convert time units step by step?',
    a: 'To convert a time duration: (1) Enter the numeric value in the input field. (2) Select the source unit — for example, Hours. (3) The results panel instantly shows the equivalent in all other units simultaneously: seconds, minutes, days, weeks, months, and years. Results update in real time as you type. This is useful for billing calculations, SLA monitoring, data retention planning, or any scenario requiring duration conversion across multiple time scales simultaneously.'
  },
  {
    q: 'Why should I use RoughTools instead of a search engine for time conversion?',
    a: 'Search engines convert between one pair of time units at a time. RoughTools Time Converter shows all supported units simultaneously in one view — enter a value in any unit and all others update instantly. This is far more efficient when you need to cross-reference seconds, hours, and days simultaneously, such as when configuring server cache TTLs, retention policies, subscription durations, or project timelines that mix different time unit conventions across teams and systems.'
  },
  {
    q: 'How do I report a bug or request a new time unit?',
    a: 'To report a bug or request an additional unit — such as milliseconds, microseconds, nanoseconds, fortnights, decades, centuries, or Unix timestamps — use the feedback link in the site footer or visit the RoughTools contact page. When reporting a bug, include the value and unit you entered, the browser and OS, and the incorrect result versus what you expected. Feature requests for microsecond precision or Unix epoch conversion are reviewed and prioritised regularly.'
  },
  {
    q: 'How many seconds are in a day, week, and year?',
    a: 'One day has exactly 86,400 seconds (24 × 60 × 60). One week has exactly 604,800 seconds (7 × 86,400). One common year has 31,536,000 seconds (365 × 86,400) and one leap year has 31,622,400 seconds (366 × 86,400). Using the average year of 365.25 days gives 31,557,600 seconds per year. These numbers appear frequently in computing, networking, and system administration — for example, TLS certificate validity, HTTP cache headers (max-age), token expiry, and data retention policy durations.'
  },
  {
    q: 'Why do months and years give approximate conversion results?',
    a: 'Unlike seconds, minutes, hours, and days which are fixed exact durations, months and years vary in length. Calendar months range from 28 to 31 days — February alone changes between years. A year is 365 days normally but 366 in a leap year. For duration conversions, this tool uses average values: 30.4375 days per month (365.25 ÷ 12) and 365.25 days per year. This gives a statistically correct average but will differ from the actual calendar duration for any specific date range. For exact date-to-date calculations, use a calendar-based date difference tool.'
  },
]

export default function Page() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
      { '@type': 'ListItem', position: 2, name: 'Unit Converters', item: 'https://roughtools.com/tools/converters' },
      { '@type': 'ListItem', position: 3, name: 'Time Converter', item: 'https://roughtools.com/tools/converters/time-converter' },
    ],
  }

  const webappLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Time Converter',
    url: 'https://roughtools.com/tools/converters/time-converter',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Free online time converter tool by RoughTools.',
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webappLd) }} />

      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/tools/converters" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
            Unit Converters
          </Link>
          <span className="text-gray-300 dark:text-gray-700">|</span>
          <h1 className="font-bold text-gray-900 dark:text-white text-sm">Time Converter</h1>
          <span className="ml-auto text-xs bg-amber-50 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-full">⏱️ seconds → years</span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/60 dark:to-yellow-900/60 border-b border-amber-200/30 dark:border-amber-800/30">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="flex flex-wrap gap-2 mb-3">
            {['Seconds', 'Minutes', 'Hours', 'Days', 'Weeks', 'Months', 'Years', 'Free'].map(b => (
              <span key={b} className="text-xs bg-amber-50 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700/40 rounded-full px-3 py-1">{b}</span>
            ))}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-3">Time Duration Converter</h2>
          <p className="text-amber-700 dark:text-amber-200/80 text-sm sm:text-base leading-relaxed max-w-3xl">
            Convert between all major time duration units instantly — seconds, minutes, hours, days, weeks, months, and years. Results update in real time showing all units simultaneously. Used in software engineering, project management, billing systems, data retention policies, and everyday scheduling. Sub-day conversions are exact; month and year conversions use the standard average (365.25 days/year) to account for leap years.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-white dark:bg-[#12121f] border border-gray-200 dark:border-purple-900/20 rounded-2xl p-1" data-print-section="calculator">
          <TimeConverterClient />
        <div style={{ marginTop: 16, marginBottom: 8 }}>
          <PDFExportButton toolName="Time Converter" />
        </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '⚡', title: 'Real-Time', desc: 'All units update instantly as you type' },
            { icon: '📅', title: 'Avg Months', desc: 'Uses 30.4375 days/month standard average' },
            { icon: '🔒', title: 'Private', desc: 'All calculations run locally in your browser' },
          ].map(c => (
            <div key={c.title} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{c.icon}</div>
              <div className="font-bold text-gray-900 dark:text-white text-xs mb-1">{c.title}</div>
              <div className="text-gray-500 text-xs leading-relaxed">{c.desc}</div>
            </div>
          ))}
        </div>

        <div data-print-section="reference" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Quick Reference: Common Time Conversions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
            {[
              ['1 minute', '= 60 seconds'],
              ['1 hour', '= 3,600 seconds'],
              ['1 day', '= 86,400 seconds'],
              ['1 week', '= 604,800 seconds'],
              ['1 day', '= 1,440 minutes'],
              ['1 week', '= 168 hours'],
              ['1 year', '≈ 8,766 hours'],
              ['1 year', '≈ 525,960 minutes'],
              ['1 year', '≈ 31.56M seconds'],
            ].map(([from, to]) => (
              <div key={from} className="flex justify-between items-center p-2.5 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300 font-mono text-xs">{from}</span>
                <span className="text-amber-600 dark:text-amber-400 font-mono text-xs">{to}</span>
              </div>
            ))}
          </div>
        </div>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <details key={i} className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-900">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white text-left pr-4">{faq.q}</h3>
                  <span className="text-amber-500 dark:text-amber-400 font-bold text-lg flex-shrink-0">+</span>
                </summary>
                <div className="px-5 pb-5 pt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-200 dark:border-gray-800">{faq.a}</div>
              </details>
            ))}
          </div>
        </section>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Other Unit Converters</h2>
          <div className="flex flex-wrap gap-2">
            {[
              { href: '/tools/converters/length-converter', label: '📏 Length' },
              { href: '/tools/converters/weight-converter', label: '⚖️ Weight' },
              { href: '/tools/converters/temperature-converter', label: '🌡️ Temperature' },
              { href: '/tools/converters/area-converter', label: '📐 Area' },
              { href: '/tools/converters/volume-converter', label: '🧪 Volume' },
              { href: '/tools/converters/speed-converter', label: '🚀 Speed' },
              { href: '/tools/converters/digital-storage-converter', label: '💾 Digital Storage' },
            ].map(l => (
              <Link key={l.href} href={l.href} className="text-sm bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-1.5 text-gray-700 dark:text-gray-300 hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>

        <ToolPageExtras
          toolName="Time Converter"
          toolSlug="time-converter"
          toolUrl="https://roughtools.com/tools/converters/time-converter"
          type="general"
          showPDF
        />
      </div>
    </div>
  )
}

