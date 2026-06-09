import type { Metadata } from 'next'
import Link from 'next/link'
import CronParserClient from './CronParserClient'
import { ToolPageExtras } from '@/components/ToolPageExtras'

export const metadata: Metadata = {
  title: 'Cron Expression Parser — Understand Cron Jobs | RoughTools',
  description: 'Parse cron expressions and see the next 5 run times instantly. Understand minute, hour, day, month, and weekday fields with human-readable descriptions — no signup required.',
  keywords: ['cron parser', 'cron expression', 'cron job scheduler', 'cron syntax', 'cron next run time', 'crontab parser'],
  alternates: { canonical: 'https://roughtools.com/tools/developer/cron-parser' },
  openGraph: {
    title: `Cron Parser — Cron Expression Tester & Explainer | RoughTools`,
    description: `Parse and explain cron expressions in plain English. Validate cron syntax and see next run times. Free online cron expression parser.`,
    url: 'https://roughtools.com/tools/developer/cron-parser',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Cron Parser — Cron Expression Tester & Explainer | RoughTools`,
    description: `Parse and explain cron expressions in plain English. Validate cron syntax and see next run times. Free online cron expression parser.`,
  },
  robots: { index: true, follow: true },
}

const FAQS = [
  { q: 'Is this cron expression parser free to use?', a: 'Yes, the RoughTools Cron Parser is completely free with no account, subscription, or payment required. You can parse and analyse unlimited cron expressions at no cost. RoughTools is funded through non-intrusive advertising, keeping every developer tool permanently free. There are no usage limits, no premium cron features behind a paywall, and no registration required.' },
  { q: 'Do I need to create an account to parse cron expressions?', a: 'No account, email, or registration is required. Enter a cron expression and the human-readable description and next run times appear instantly. There is no login wall and no data stored about the expressions you test. The parser is entirely anonymous — your cron expressions and schedules are never transmitted or stored anywhere.' },
  { q: 'Does this tool store the cron expressions I enter?', a: 'No. All cron parsing runs entirely within your browser using JavaScript. The expressions you enter are never transmitted to RoughTools servers, never logged, and never shared with third parties. Once you close the browser tab, all data is gone. Your scheduling configurations remain completely private.' },
  { q: 'Does the cron parser work on mobile and tablet?', a: 'Yes, the parser is fully responsive and works on all modern smartphones and tablets. The expression input and next-run-time display are optimised for mobile screens. This is useful when reviewing scheduled task configurations, checking a cron schedule from a runbook on your phone, or quickly verifying a cron expression during an on-call incident response.' },
  { q: 'Which browsers support this cron parser?', a: 'The Cron Parser works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave. No plugins or extensions are required. The parser uses standard JavaScript that runs natively in every current browser. The Date API used for calculating next run times is available in all current browser versions.' },
  { q: 'How accurate are the parsed cron schedules?', a: 'The parser accurately interprets the standard Unix cron format: five fields for minute, hour, day-of-month, month, and day-of-week, supporting wildcards (*), ranges (1-5), step values (*/15), and lists (1,3,5). Next run times are calculated using the browser\'s system clock, so they reflect your local timezone. For timezone-sensitive scheduling in production, always verify the timezone configuration of your cron daemon separately (Linux crontab uses the system timezone by default).' },
  { q: 'Can I use the cron parser offline?', a: 'Once the page has fully loaded, all parsing runs in JavaScript without requiring an active internet connection. You can enter expressions and see next run times offline. This is useful when reviewing cron configurations in network-restricted environments, on flights while reviewing deployment schedules, or during incidents when internet access may be limited.' },
  { q: 'How do I parse and understand a cron expression step by step?', a: 'To parse a cron expression: (1) Enter the 5-field cron expression — minute hour day month weekday. For example: 30 2 * * 1-5 means "at 2:30am, Monday through Friday." (2) The human-readable description appears below the input. (3) The next 5 scheduled run times are listed with exact date and time. (4) Each field is explained: * means every value, */5 means every 5 units, 1-5 means the range 1 through 5, and 1,3,5 means exactly those values.' },
  { q: 'Why should I use RoughTools instead of crontab.guru?', a: 'crontab.guru is excellent for cron expression explanation. RoughTools Cron Parser provides the human-readable description alongside the concrete next scheduled run times — seeing the actual dates rather than just the pattern description helps verify that a schedule behaves as expected, especially for complex month/day-of-week combinations. Having both tools bookmarked covers different verification needs.' },
  { q: 'How do I report a bug or request a new cron feature?', a: 'To report a bug or request a feature — such as 6-field cron with seconds, cron expression builder UI, Quartz scheduler syntax, @reboot/@hourly shorthand support, or timezone input — use the feedback link in the site footer or visit the RoughTools contact page. When reporting a bug, include the cron expression you entered, the browser and OS, and what you expected versus what was shown.' },
  { q: 'What are the five fields in a cron expression?', a: 'A standard Unix cron expression has five fields separated by spaces: (1) Minute — 0 to 59, when in the hour the job runs. (2) Hour — 0 to 23, what hour of the day. (3) Day of month — 1 to 31, what day of the month. (4) Month — 1 to 12 (or JAN-DEC). (5) Day of week — 0 to 7 where both 0 and 7 represent Sunday (or SUN-SAT). Each field can use: * (any value), a specific number, a range (1-5), a step (*/15 for every 15 units), or a comma-separated list (1,3,5). Example: 0 9 * * 1-5 = every weekday at 9:00am.' },
  { q: 'What are common cron expression examples?', a: 'Common cron patterns: 0 * * * * — every hour on the hour. */5 * * * * — every 5 minutes. 0 9 * * 1-5 — weekdays at 9:00am. 0 0 * * * — midnight every day. 0 0 1 * * — first day of each month at midnight. 0 0 * * 0 — every Sunday at midnight. 30 23 * * 5 — Friday at 11:30pm. 0 9,17 * * * — every day at 9am and 5pm. */15 9-17 * * 1-5 — every 15 minutes during business hours on weekdays.' },
]

export default function Page() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
      { '@type': 'ListItem', position: 2, name: 'Developer Tools', item: 'https://roughtools.com/tools/developer' },
      { '@type': 'ListItem', position: 3, name: 'Cron Parser', item: 'https://roughtools.com/tools/developer/cron-parser' },
    ],
  }

  const webappLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Cron Parser',
    url: 'https://roughtools.com/tools/developer/cron-parser',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Free online cron parser tool by RoughTools.',
  }

  const jsonLd = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webappLd) }} />
      <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/tools/developer" className="text-sm text-gray-400 hover:text-white flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>Developer Tools
          </Link>
          <span className="text-gray-700">|</span>
          <h1 className="font-bold text-white text-sm">Cron Expression Parser</h1>
          <span className="ml-auto text-xs bg-teal-900/50 text-teal-400 border border-teal-800 px-2 py-0.5 rounded-full">⏰ Next 5 Runs · Human-Readable</span>
        </div>
      </div>
      <div className="bg-gradient-to-r from-teal-900/60 to-cyan-900/60 border-b border-teal-800/30">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="flex flex-wrap gap-2 mb-3">
            {['5-Field Cron', 'Human Description', 'Next 5 Run Times', 'Wildcards', 'Ranges', 'Free'].map(b => (
              <span key={b} className="text-xs bg-teal-900/50 text-teal-300 border border-teal-700/40 rounded-full px-3 py-1">{b}</span>
            ))}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">Cron Expression Parser</h2>
          <p className="text-teal-200/80 text-sm sm:text-base leading-relaxed max-w-3xl">Parse cron expressions and understand exactly when they run. Enter any standard 5-field Unix cron expression to see a plain-English description and the next 5 scheduled execution times. Supports all cron syntax: wildcards (*), ranges (1-5), step values (*/15), and lists (1,3,5). Useful for verifying scheduled tasks, reviewing crontab configurations, and debugging unexpected scheduling behaviour before deploying to production.</p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-[#0d0d1a] border border-teal-900/20 rounded-2xl p-1"><CronParserClient /></div>
        <div className="grid grid-cols-3 gap-3">
          {[{ icon: '📖', title: 'Plain English', desc: 'Converts cryptic cron syntax to a human-readable description' }, { icon: '📅', title: 'Next 5 Runs', desc: 'Shows the next 5 scheduled dates and times' }, { icon: '🔒', title: 'Private', desc: 'Cron expressions never leave your browser' }].map(c => (
            <div key={c.title} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{c.icon}</div><div className="font-bold text-white text-xs mb-1">{c.title}</div><div className="text-gray-500 text-xs leading-relaxed">{c.desc}</div>
            </div>
          ))}
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-base font-bold text-white mb-4">Cron Expression Quick Reference</h2>
          <div className="grid sm:grid-cols-2 gap-2 text-sm font-mono">
            {[['0 * * * *', 'Every hour on the hour'], ['*/5 * * * *', 'Every 5 minutes'], ['0 9 * * 1-5', 'Weekdays at 9:00am'], ['0 0 * * *', 'Daily at midnight'], ['0 0 1 * *', '1st of each month at midnight'], ['30 23 * * 5', 'Friday at 11:30pm'], ['0 9,17 * * *', 'Daily at 9am and 5pm'], ['0 0 * * 0', 'Every Sunday at midnight']].map(([expr, desc]) => (
              <div key={expr} className="flex items-center gap-3 p-2.5 bg-gray-800/50 rounded-lg">
                <code className="text-teal-400 text-xs flex-shrink-0 w-36">{expr}</code>
                <span className="text-gray-400 text-xs">{desc}</span>
              </div>
            ))}
          </div>
        </div>
        <section><h2 className="text-xl font-bold text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">{FAQS.map((faq, i) => (
            <details key={i} className="border border-gray-800 rounded-xl overflow-hidden bg-gray-900">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none bg-gray-800/50 hover:bg-gray-800 transition-colors">
                <h3 className="text-sm font-semibold text-white text-left pr-4">{faq.q}</h3>
                <span className="text-teal-400 font-bold text-lg flex-shrink-0">+</span>
              </summary>
              <div className="px-5 pb-5 pt-3 text-sm text-gray-400 leading-relaxed border-t border-gray-800">{faq.a}</div>
            </details>
          ))}</div>
        </section>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-white mb-3">Related Developer Tools</h2>
          <div className="flex flex-wrap gap-2">
            {[{ href: '/tools/developer/timestamp-converter', label: '🕐 Timestamp Converter' }, { href: '/tools/developer/chmod-calculator', label: '🔐 Chmod Calculator' }, { href: '/tools/developer/json-formatter', label: '{ } JSON Formatter' }, { href: '/tools/developer/yaml-validator', label: '📄 YAML Validator' }, { href: '/tools/developer/uuid-generator', label: '🆔 UUID Generator' }].map(l => (
              <Link key={l.href} href={l.href} className="text-sm bg-gray-800 border border-gray-700 rounded-full px-4 py-1.5 text-gray-300 hover:border-teal-500 hover:text-teal-400 transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>

        <ToolPageExtras
          toolName="Cron Parser"
          toolSlug="cron-parser"
          toolUrl="https://roughtools.com/tools/developer/cron-parser"
          type="general"
          showPDF
        />
      </div>
    </div>
  )
}
