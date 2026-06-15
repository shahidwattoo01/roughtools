import type { Metadata } from 'next'
import AgeCalculator from '@/components/tools/calculators/AgeCalculator'
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

const _seo = getCalcSEO('age-calculator')
export const metadata: Metadata = {
  title: _seo?.seoTitle ?? 'Free Age Calculator — Calculate Exact Age in Years, Months & Days | RoughTools',
  description: _seo?.metaDescription ?? 'Calculate your exact age in years, months, days, and hours from your date of birth. Find days until your next birthday. Free age calculator — no signup required.',
  keywords: ['age calculator', 'how old am i', 'birthday calculator', 'age difference calculator', 'exact age calculator', 'free age calculator', 'age in days calculator'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/calculators/age-calculator' },
  openGraph: {
    title: 'Free Age Calculator — Calculate Exact Age in Years, Months & Days | RoughTools',
    description: 'Calculate your exact age in years, months, days, and hours. Free, instant, no signup.',
    url: 'https://roughtools.com/tools/calculators/age-calculator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Age Calculator | RoughTools',
    description: 'Calculate your exact age instantly. Free, no signup.',
  },
}

// ─── FAQ data (12 questions) ──────────────────────────────────────────────────

const FAQS = [
  {
    q: 'How accurate is this age calculator?',
    a: 'The calculator is mathematically exact. It calculates age by counting the precise number of years, months, and days between two dates, accounting for the varying number of days in each month, leap years, and month-boundary edge cases. The result is identical to how age is officially determined in most legal and medical contexts.',
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
    a: 'Age is calculated as the difference between the target date (usually today) and the birth date: Age = Target Date − Date of Birth. The calculation determines complete years first, then remaining complete months, then remaining days. Hours are calculated as the total hours elapsed since the exact birth date. The JavaScript Date object handles all time zone and calendar complexities automatically.',
  },
  {
    q: 'How does the calculator handle leap year birthdays?',
    a: 'For people born on February 29 (leap day), the birthday is counted as occurring on February 28 in non-leap years, following the most common legal standard used in the US, UK, and EU. Some jurisdictions treat a leap-day birthday as March 1 in non-leap years — the difference is only relevant for legal purposes such as the exact date someone officially becomes an adult.',
  },
  {
    q: 'Why would I need my age in months or days?',
    a: 'Age in months is used in paediatric medicine — growth charts, vaccination schedules, and developmental milestones are all expressed in months for children under 3. Age in days is used in contract law (counting notice periods), insurance calculations, legal proceedings, and some financial instruments. Gestational age at birth is also expressed in days beyond 40 weeks.',
  },
  {
    q: 'What is the oldest verified human age on record?',
    a: 'Jeanne Calment of France is the oldest verified human in history, living to 122 years and 164 days (1875–1997). She represents the current known upper limit of human lifespan, a record that has stood for nearly three decades. The oldest verified living person changes regularly — check Guinness World Records for the current record holder.',
  },
  {
    q: 'Do different countries calculate age differently?',
    a: 'Yes. Most Western countries count age from birth (you are 0 years old until your first birthday). Traditional Korean age reckoning adds 1 year at birth and again at each New Year — so a child born in December could be considered "2" just days after birth. Japan historically also used a similar system but shifted to the Western method in 1950. For legal documents, always confirm which system is expected.',
  },
  {
    q: 'What are common legal age milestones I should know?',
    a: 'Legal age milestones vary by country. Common ones in the US and UK include: 16 (driving licence in some states, minimum working age), 17 (joining the military in the UK), 18 (legal adulthood, voting, signing contracts, purchasing tobacco/alcohol in the UK), 21 (purchasing alcohol in the US, some rental car age minimums), 62 (early Social Security benefits in the US), 65–67 (full state pension eligibility in the UK and US). Always verify the specific rules for your jurisdiction.',
  },
]

// ─── Pro Tips ─────────────────────────────────────────────────────────────────

const PRO_TIPS = [
  'Use age calculation for contract notice periods. If a contract requires "28 days\' notice" from a specific date, enter that date as the start and count forward 28 days using the calculator — much more reliable than counting manually on a calendar, especially across month boundaries.',
  'Different countries calculate age differently. Traditional Korean age adds 1 year at birth and again each New Year, meaning a child born in late December could officially be "2" within days. Traditional Chinese age reckoning also differs from Western practice. Always clarify which age system is intended in international documents.',
  'Gestational age is different from chronological age. A premature baby born at 28 weeks starts life with a "corrected age" that adjusts for early arrival — a child born 3 months early is developmentally assessed at 9 months old as if they were a 6-month-old. This correction is typically used until age 2. Age calculators give chronological age, not corrected developmental age.',
  'For pension and retirement eligibility, the exact date matters. State Pension Age in the UK and Social Security eligibility in the US are calculated to the day. If you are born on the 15th of a month, you may not qualify until the 15th — not the 1st. Use this calculator with your specific birth date and target eligibility date to determine the precise day you qualify.',
]

// ─── When to Use ─────────────────────────────────────────────────────────────

const WHEN_TO_USE = [
  {
    icon: '🎂',
    title: 'Birthday milestone countdown',
    description: 'Find exactly how many days remain until your next birthday, or calculate the exact age in years and days for a milestone celebration.',
  },
  {
    icon: '📄',
    title: 'Legal document preparation',
    description: 'Many legal forms require exact age in years and months. Calculate precisely for visa applications, insurance forms, and legal contracts.',
  },
  {
    icon: '🏦',
    title: 'Retirement age verification',
    description: 'Check the exact date you reach retirement or pension eligibility age — the calculation needs to be to the day for financial planning purposes.',
  },
  {
    icon: '🩺',
    title: 'Insurance eligibility checks',
    description: 'Health, life, and travel insurance policies often have age-based eligibility and premium brackets — calculate your exact age before purchasing.',
  },
  {
    icon: '💊',
    title: 'Medical age requirements',
    description: 'Clinical trials, screening programmes, and medication guidelines often specify age ranges to the year. Verify your eligibility with a precise calculation.',
  },
]

// ─── Quick Reference ──────────────────────────────────────────────────────────

const QUICK_REF = [
  { input: 'Date of Birth', description: 'The birth date to calculate age from', example: '15 March 1990' },
  { input: 'Current / Target Date', description: 'The date to calculate age at (defaults to today)', example: '6 June 2026' },
  { input: 'Age in Years', description: 'Complete years elapsed since birth', example: '36 years' },
  { input: 'Age in Months', description: 'Total complete months elapsed since birth', example: '435 months' },
  { input: 'Age in Days', description: 'Total days elapsed since birth (includes leap years)', example: '13,231 days' },
  { input: 'Age in Hours', description: 'Total hours elapsed since the birth date', example: '317,544 hours' },
]

// ─── Related Calculators ──────────────────────────────────────────────────────

const RELATED = [
  { icon: '🤰', name: 'Due Date Calculator', slug: 'due-date-calculator', description: 'Calculate pregnancy due date from LMP' },
  { icon: '🔥', name: 'Calorie Calculator', slug: 'calorie-calculator', description: 'Calculate daily calorie needs by age' },
  { icon: '⚖️', name: 'BMI Calculator', slug: 'bmi-calculator', description: 'Check your body mass index' },
  { icon: '🏦', name: 'Retirement Calculator', slug: 'retirement-calculator', description: 'Project retirement savings and income' },
]

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Age Calculator',
    description: 'Free age calculator. Calculates exact age in years, months, days, and hours from a date of birth.',
    url: 'https://roughtools.com/tools/calculators/age-calculator',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
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
      { '@type': 'ListItem', position: 3, name: 'Age Calculator', item: 'https://roughtools.com/tools/calculators/age-calculator' },
    ],
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AgeCalculatorPage() {
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
          <span style={{ color: 'var(--brand)' }}>Age Calculator</span>
        </nav>

        {/* H1 */}
        <div style={{ fontSize: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(139,92,246,0.15)', borderRadius: 14, padding: '10px 14px', lineHeight: 1, marginBottom: 12 }}>
          🎂
        </div>
        <h1 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, color: 'var(--fg)', margin: '0 0 10px', letterSpacing: '-0.5px' }}>
          Free Age Calculator
        </h1>
        <p style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.7, margin: '0 0 20px', maxWidth: 680 }}>
          Calculate your exact age in years, months, days, and hours from your date of birth.
          Find the number of days until your next birthday, or calculate the age difference between any two dates.
          Free, private — all calculations run in your browser.
        </p>

        {/* Trust badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
          {['⚡ Instant results', '🔒 100% private', '🆓 Always free', '🚫 No signup', '📅 Leap year accurate'].map(b => (
            <span key={b} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)',
              borderRadius: 20, padding: '5px 12px', fontSize: 12, color: 'var(--brand-2)', fontWeight: 500,
            }}>{b}</span>
          ))}
        </div>

        <ToolAdUnit position="top" />

        {/* Calculator widget */}
        <AgeCalculator />

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
            About This Age Calculator
          </h2>

          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            This age calculator determines your exact chronological age — the time elapsed between your date of birth and the current date
            (or any target date you specify). The result is shown in years, months, days, and hours so you have the level of precision needed
            for any purpose, from a casual birthday check to a legal document that requires age to the day.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            The Formula — How Age Is Calculated
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            Chronological age calculation sounds simple but has important edge cases:
          </p>
          <div style={{ background: 'var(--bg-3)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 10, padding: '14px 18px', marginBottom: 14, fontFamily: 'monospace', fontSize: 13, color: 'var(--brand-2)' }}>
            Age = Current Date − Date of Birth<br />
            (expressed as complete years + remaining months + remaining days)
          </div>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The calculation handles several complexities automatically: varying month lengths (28, 29, 30, or 31 days), leap years (an extra day
            every 4 years, with exceptions for century years not divisible by 400), and month-boundary edge cases (e.g., if you were born on
            the 31st and the current month has only 30 days).
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Chronological Age vs Biological Age
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            Chronological age is simply the time elapsed since birth — what this calculator measures. Biological age is a more complex concept
            that reflects how fast your body is ageing relative to the average, assessed through biomarkers like telomere length, epigenetic
            methylation patterns, inflammation markers, and organ function tests. Two people with identical chronological ages can have very
            different biological ages depending on genetics, lifestyle, diet, exercise habits, and stress levels. Biological age testing
            requires clinical assessment — but research suggests healthy lifestyle factors can make your biological age significantly younger
            than your chronological age.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Why Exact Age Matters for Legal and Medical Purposes
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            In many legal and medical contexts, age is measured to the exact day, not just the year. Insurance premiums often change at exact
            age boundaries. Clinical trials specify exact age ranges for eligibility (e.g., &ldquo;18 years 0 days to 64 years 364 days&rdquo;).
            Visa applications require your age on a specific date. Notice periods in contracts are counted in days from a specific event.
            Pension and Social Security eligibility may activate on a specific calendar date tied to your exact birth date.
            Using an approximate age in these situations can lead to errors with real financial or legal consequences.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Leap Years and Special Cases
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            A leap year occurs every 4 years, with the exception of century years that are not divisible by 400 (so 1900 was not a leap year,
            but 2000 was). This means the exact number of days between two dates depends on how many leap years fall in between — which is why
            manual day counting is unreliable for periods spanning several years. The calculator handles this automatically. For people born
            on February 29, the calculator follows the most common legal standard and counts the birthday as February 28 in non-leap years.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Privacy Notice
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, margin: 0 }}>
            All calculations run entirely in your browser. No data you enter — including your date of birth — is transmitted to any server
            or stored anywhere. Your information stays completely private on your device.
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
          toolName="Age Calculator"
          toolSlug="age-calculator"
          toolUrl="https://roughtools.com/tools/calculators/age-calculator"
          type="general"
        />

        <ToolAdUnit position="bottom" />
      </div>
    </>
  )
}
