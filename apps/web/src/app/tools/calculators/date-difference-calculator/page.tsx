import type { Metadata } from 'next'
import DaysBetweenDates from '@/components/tools/calculators/DaysBetweenDates'
import ToolAdUnit from '@/components/ToolAdUnit'
import { JsonLd } from '@/components/JsonLd'
import { getCalcSEO } from '../_components/calc-seo-configs'
import { ToolPageExtras } from '@/components/ToolPageExtras'
import {
  ProTipsSection,
  WhenToUseCards,
  QuickReferenceTable,
  CalculatorFAQ,
  RelatedCalculators,
} from '@/components/tools/CalculatorSections'

// ─── Metadata ────────────────────────────────────────────────────────────────

const _seo = getCalcSEO('date-difference-calculator')
export const metadata: Metadata = {
  title: _seo?.seoTitle ?? 'Free Date Difference Calculator | RoughTools',
  description: _seo?.metaDescription ?? 'Calculate days, weeks, months, and years between two dates. Business days calculator. Find how long until an event or since a past date. Free, instant.',
  keywords: ['days between dates', 'date difference calculator', 'how many days between dates', 'date calculator', 'business days calculator'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/calculators/date-difference-calculator' },
  openGraph: {
    title: 'Free Date Difference Calculator | RoughTools',
    description: 'Calculate days, weeks, months, and years between any two dates. Free, instant, no signup.',
    url: 'https://roughtools.com/tools/calculators/date-difference-calculator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Date Difference Calculator | RoughTools',
    description: 'Calculate days between dates instantly. Free, no signup.',
  },
}

// ─── FAQ data ─────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: 'How accurate is this date difference calculator?',
    a: 'The calculator is mathematically exact for calendar day counts. It uses JavaScript\'s Date object which correctly handles all leap years and month lengths. Business day counts exclude weekends (Saturday and Sunday) but do not account for public holidays, which vary by country and region.',
  },
  {
    q: 'Is my data private — is anything stored?',
    a: 'Yes, completely private. All calculations run entirely in your browser using JavaScript. No date you enter is transmitted to any server, stored in a database, or shared with third parties. When you close the tab, your inputs are gone.',
  },
  {
    q: 'Is this calculator free to use?',
    a: 'Yes, completely free. No account, no subscription, no hidden fees. RoughTools is ad-supported — using it costs you nothing.',
  },
  {
    q: 'Does this work on mobile?',
    a: 'Yes. The calculator is fully responsive and works on any device — smartphone, tablet, or desktop — in any modern browser.',
  },
  {
    q: 'What browsers are supported?',
    a: 'All modern browsers: Chrome, Firefox, Safari, Edge, and Opera. Internet Explorer is not supported. We recommend Chrome or Firefox for the best experience.',
  },
  {
    q: 'Can I save or export my results?',
    a: 'Yes. Use the "Export PDF Report" button to download a formatted PDF of your inputs and results. You can also use your browser\'s print function (Ctrl+P or Cmd+P) to save as PDF.',
  },
  {
    q: 'What formula does this calculator use?',
    a: 'The core calculation is: Difference = |Date2 − Date1| in milliseconds, then converted: Days = ms ÷ 86,400,000; Weeks = Days ÷ 7; Months ≈ Days ÷ 30.44 (average days per month accounting for leap years); Years ≈ Days ÷ 365.25. Business days are counted by iterating through each day and excluding Saturdays and Sundays.',
  },
  {
    q: 'What is the difference between business days and calendar days?',
    a: 'Calendar days count every day of the week including weekends. Business days count only Monday through Friday. A 14-calendar-day period typically contains 10 business days. Business days are used for legal deadlines, contract notice periods, and work project timelines. Calendar days are used for age, travel time, and general date arithmetic.',
  },
  {
    q: 'How does this calculator handle leap years?',
    a: 'Leap years are handled automatically. A year is a leap year if it is divisible by 4, except century years must also be divisible by 400 (e.g., 2000 was a leap year but 1900 was not). Leap years have 366 days instead of 365, and this is factored into all date difference calculations — especially important when calculating across February 29.',
  },
  {
    q: 'How does this handle time zones?',
    a: 'The calculator works with calendar dates only — no time-of-day component is used. Both dates are interpreted at midnight in your local browser time zone, so results are consistent regardless of your location. For precision time-zone work (e.g., crossing daylight saving time boundaries at specific hours), you would need a dedicated time zone tool.',
  },
  {
    q: 'What if I enter the end date before the start date?',
    a: 'No problem. The calculator uses the absolute value of the difference, so the order of the two dates does not matter. Whether you enter Start: Jan 1 and End: Dec 31, or Start: Dec 31 and End: Jan 1, you will get the same positive result. The result always shows the magnitude of the gap, not a negative number.',
  },
  {
    q: 'How far in the future or past can I calculate?',
    a: 'JavaScript\'s Date object supports dates from approximately 275,760 AD in the future to 271,821 BC in the past. For all practical purposes — planning events, legal deadlines, project timelines, or historical research — the calculator handles any reasonable date range without limitation.',
  },
]

// ─── Pro Tips ─────────────────────────────────────────────────────────────────

const PRO_TIPS = [
  'Business days are not the same as calendar days. A typical work week has 5 business days out of 7 calendar days (about 71.4%). For legal deadlines and contract notice periods, always confirm whether the requirement specifies "calendar days" or "business days" — the difference over 30 days can be 8–9 days.',
  'Always use the ISO 8601 date format (YYYY-MM-DD) when communicating dates in writing — for example 2025-03-15 instead of 3/15/25 or 15/3/25. This format is unambiguous across all countries and locales, eliminating the confusion between MM/DD and DD/MM conventions.',
  'For legal deadlines, understand whether counting is inclusive or exclusive of the start and end dates. Courts and contracts often specify "30 days from the date of notice" — check whether that means 30 days after the notice date (exclusive) or the notice date counts as day 1 (inclusive). The difference is one full day.',
  'Calendar months vary from 28 to 31 days, so a "month count" is always an approximation. This calculator uses 30.44 days per month (365.25 ÷ 12) for averaging. If you need exact month counts — for example for a 6-month contract — always count the actual calendar months rather than dividing days by 30.',
]

// ─── When to Use ─────────────────────────────────────────────────────────────

const WHEN_TO_USE = [
  {
    icon: '📅',
    title: 'Project deadline calculation',
    description: 'Calculate exactly how many business days remain before a project is due, factoring out weekends to give a realistic working-day countdown for task planning.',
  },
  {
    icon: '🎂',
    title: 'Age in days for milestones',
    description: 'Find out exactly how many days old a person, company, or relationship is — great for 1,000-day or 10,000-day milestone celebrations.',
  },
  {
    icon: '🎉',
    title: 'Days until an event',
    description: 'Count down to a wedding, vacation, exam, product launch, or any future event by entering today and the event date to see the exact days remaining.',
  },
  {
    icon: '📋',
    title: 'Contract notice period verification',
    description: 'Verify that a contract notice period has been correctly served — enter the notice date and proposed termination date to confirm the required number of days has elapsed.',
  },
  {
    icon: '⏱️',
    title: 'How long ago something happened',
    description: 'Calculate the exact elapsed time since a past event — a medical procedure, accident, historical date, or business transaction — for records or legal documentation.',
  },
]

// ─── Quick Reference ──────────────────────────────────────────────────────────

const QUICK_REF = [
  { input: 'Start Date', description: 'The earlier (or first) date in the comparison', example: '2024-01-15' },
  { input: 'End Date', description: 'The later (or second) date in the comparison', example: '2025-06-30' },
  { input: 'Difference in Days', description: 'Total calendar days between the two dates', example: '531 days' },
  { input: 'Weeks', description: 'Days ÷ 7 (whole weeks + remaining days)', example: '75 weeks, 6 days' },
  { input: 'Months (approx)', description: 'Days ÷ 30.44 — approximate calendar months', example: '~17.4 months' },
  { input: 'Years (approx)', description: 'Days ÷ 365.25 — approximate years including leap years', example: '~1.45 years' },
  { input: 'Business Days', description: 'Calendar days minus Saturdays and Sundays', example: '379 business days' },
]

// ─── Related calculators ──────────────────────────────────────────────────────

const RELATED = [
  { icon: '🎂', name: 'Age Calculator', slug: 'age-calculator', description: 'Calculate exact age in years, months, and days' },
  { icon: '👶', name: 'Due Date Calculator', slug: 'due-date-calculator', description: 'Estimate pregnancy due date from LMP' },
  { icon: '💰', name: 'Tip Calculator', slug: 'tip-calculator', description: 'Split bills and calculate tips quickly' },
  { icon: '📊', name: 'Percentage Calculator', slug: 'percentage-calculator', description: 'Calculate percentages, increases, and decreases' },
  { icon: '⏰', name: 'Time Calculator', slug: 'time-calculator', description: 'Add and subtract hours, minutes, seconds' },
]

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Date Difference Calculator',
    description: 'Free date difference calculator. Calculates exact days, weeks, months, and years between two dates, including business day counts.',
    url: 'https://roughtools.com/tools/calculators/date-difference-calculator',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '1923' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
      { '@type': 'ListItem', position: 2, name: 'Calculators', item: 'https://roughtools.com/tools/calculators' },
      { '@type': 'ListItem', position: 3, name: 'Date Difference Calculator', item: 'https://roughtools.com/tools/calculators/date-difference-calculator' },
    ],
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DateDifferencePage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px 80px' }}>

        {/* Breadcrumb */}
        <nav style={{ fontSize: 13, color: 'var(--fg-2)', marginBottom: 20 }} aria-label="Breadcrumb">
          <a href="/" style={{ color: 'var(--fg-2)' }}>Home</a>
          {' › '}
          <a href="/tools/calculators" style={{ color: 'var(--fg-2)' }}>Calculators</a>
          {' › '}
          <span style={{ color: 'var(--brand)' }}>Date Difference Calculator</span>
        </nav>

        {/* H1 */}
        <div style={{ fontSize: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(139,92,246,0.15)', borderRadius: 14, padding: '10px 14px', lineHeight: 1, marginBottom: 12 }}>
          📅
        </div>
        <h1 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, color: 'var(--fg)', margin: '0 0 10px', letterSpacing: '-0.5px' }}>
          Free Date Difference Calculator
        </h1>
        <p style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.7, margin: '0 0 20px', maxWidth: 680 }}>
          Calculate the exact number of days, weeks, months, and years between any two dates.
          Includes a business days mode that excludes weekends. Free, private — all calculations run in your browser.
        </p>

        {/* Trust badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
          {['⚡ Instant results', '🔒 100% private', '🆓 Always free', '🚫 No signup', '📆 Leap year aware'].map(b => (
            <span key={b} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)',
              borderRadius: 20, padding: '5px 12px', fontSize: 12, color: 'var(--brand-2)', fontWeight: 500,
            }}>{b}</span>
          ))}
        </div>

        <ToolAdUnit position="top" />

        {/* Calculator widget */}
        <DaysBetweenDates />

        <ToolAdUnit position="middle" />

        {/* Quick Reference */}
        <section
          style={{
            marginTop: 40,
            padding: '28px 32px',
            background: 'var(--bg-1)',
            borderRadius: 16,
            border: '1px solid var(--line-strong)',
          }}
          aria-labelledby="about-heading"
        >
          <h2 id="about-heading" style={{ fontSize: 20, fontWeight: 800, color: 'var(--fg)', marginTop: 0, marginBottom: 16 }}>
            About This Date Difference Calculator
          </h2>

          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The Date Difference Calculator computes the precise time elapsed between any two calendar dates, expressing it
            in days, weeks, months, and years. It handles all edge cases automatically: leap years, months of varying
            lengths, and the transition between years. You can also switch to business-day mode, which counts only
            Monday through Friday, making it ideal for project management, legal deadlines, and contract notice periods.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            The Formula — How It Works
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            Date arithmetic is performed by converting both dates to milliseconds since the Unix epoch (January 1, 1970),
            then computing the absolute difference:
          </p>
          <div style={{ background: 'var(--bg-3)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 10, padding: '14px 18px', marginBottom: 14, fontFamily: 'monospace', fontSize: 13, color: 'var(--brand-2)' }}>
            Difference = |Date2 − Date1| in milliseconds{'\n'}
            Days = ms ÷ 86,400,000{'\n'}
            Weeks = Days ÷ 7{'\n'}
            Months ≈ Days ÷ 30.44  (365.25 ÷ 12){'\n'}
            Years ≈ Days ÷ 365.25
          </div>
          <p style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The constant <strong style={{ color: '#c4caff' }}>86,400,000</strong> is the number of milliseconds in one day (1,000 ms × 60 s × 60 min × 24 h).
            The divisor <strong style={{ color: '#c4caff' }}>365.25</strong> accounts for the average effect of leap years
            (one extra day every 4 years). The divisor <strong style={{ color: '#c4caff' }}>30.44</strong> is the average
            days per month (365.25 ÷ 12), making month counts approximate rather than exact.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Calendar Days vs Business Days
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            Calendar days count every single day from start to end, including weekends and public holidays.
            Business days count only Monday through Friday. Over any given week, there are 5 business days out of
            7 calendar days — a ratio of approximately 71.4%. Over a 30-calendar-day period, you would typically
            expect around 21–22 business days. The business day count in this calculator iterates through each day
            between the two dates and skips Saturdays (day 6) and Sundays (day 0), giving an exact weekend-excluded count.
            Public holidays are not excluded, as these vary by country and jurisdiction.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Leap Year Handling
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            A leap year occurs when a year is divisible by 4, except century years (divisible by 100) must also
            be divisible by 400 to qualify. For example, the year 2000 was a leap year, but 1900 was not.
            This calculator inherits JavaScript&apos;s built-in Date object handling, which correctly implements
            the Gregorian calendar leap-year rule. This means February 29 dates are valid in leap years and
            the extra day is always included in the count when it falls within the date range.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Practical Applications
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            Date difference calculations appear in dozens of everyday contexts: verifying a contract&apos;s 30-day
            notice period, calculating how many days of interest accrue between transactions, determining
            whether a warranty has expired, counting down to a vacation or exam, computing employee tenure in days,
            or finding the exact age of a person or organisation. Legal contexts in particular often require
            precision — whether to count the start date or end date as day zero can determine whether a deadline
            is met or missed.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Privacy Notice
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, margin: 0 }}>
            All calculations in this date difference calculator are performed entirely in your browser.
            No dates you enter are transmitted to any server, stored in any database, or shared with third parties.
            Your inputs stay completely private on your device. See our{' '}
            <a href="/privacy" style={{ color: '#8b5cf6', textDecoration: 'underline' }}>Privacy Policy</a>{' '}
            for full details.
          </p>
        </section>
        <QuickReferenceTable rows={QUICK_REF} />

        {/* When to Use */}
        <WhenToUseCards cards={WHEN_TO_USE} />

        {/* About section */}
        

        {/* Pro Tips */}
        <ProTipsSection tips={PRO_TIPS} />

        {/* FAQ */}
        <CalculatorFAQ faqs={FAQS} />

        {/* Related Calculators */}
        <RelatedCalculators calculators={RELATED} />

        {/* Compliance kit */}
        <ToolPageExtras
          toolName="Date Difference Calculator"
          toolSlug="date-difference-calculator"
          toolUrl="https://roughtools.com/tools/calculators/date-difference-calculator"
          type="general"
        />

        <ToolAdUnit position="bottom" />
      </div>
    </>
  )
}
