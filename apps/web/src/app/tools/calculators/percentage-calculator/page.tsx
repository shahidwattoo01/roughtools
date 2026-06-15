import type { Metadata } from 'next'
import PercentageCalculator from '@/components/tools/calculators/PercentageCalculator'
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

const _seo = getCalcSEO('percentage-calculator')
export const metadata: Metadata = {
  title: _seo?.seoTitle ?? 'Free Percentage Calculator — Percent of a Number, Change & More | RoughTools',
  description: _seo?.metaDescription ?? 'Calculate percentages instantly. Find X% of Y, what percent X is of Y, percentage change, and reverse percentage. 4 modes in one free calculator. No signup.',
  keywords: ['percentage calculator', 'percent calculator', 'percent change calculator', 'percentage difference', 'how to calculate percentage', 'free percentage calculator'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/calculators/percentage-calculator' },
  openGraph: {
    title: 'Free Percentage Calculator — Percent of a Number, Change & More | RoughTools',
    description: 'Calculate percentages in 4 modes — % of a number, % change, % difference, reverse percentage. Free, instant.',
    url: 'https://roughtools.com/tools/calculators/percentage-calculator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Percentage Calculator | RoughTools',
    description: 'Calculate percentages in 4 modes. Free, instant, no signup.',
  },
}

// ─── FAQ data (12 questions — accordion) ─────────────────────────────────────

const FAQS = [
  {
    q: 'How accurate is this percentage calculator?',
    a: 'The calculator is mathematically exact for all four calculation modes. It uses standard arithmetic operations with floating-point precision. Results are rounded to two decimal places for readability. There are no approximations — if you enter exact inputs, you get an exact result.',
  },
  {
    q: 'Is my data private — is anything stored?',
    a: 'Yes, completely private. All calculations run entirely in your browser using JavaScript. No inputs you enter are transmitted to any server, stored in a database, or shared with third parties. When you close the tab, your inputs are gone.',
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
    a: "Use your browser's print function (Ctrl+P or Cmd+P) to save results as a PDF. The Export PDF button, where available, downloads a formatted summary of your calculation.",
  },
  {
    q: 'Do I need professional advice for percentage calculations?',
    a: 'No — percentage calculations are pure mathematics with no subjective interpretation. The results are always definitive. That said, the context in which you apply percentages (e.g., tax rates, investment returns, grade curves) may benefit from professional interpretation.',
  },
  {
    q: 'What formulas does this calculator use?',
    a: 'Four formulas: (1) What is X% of Y? → Result = (X ÷ 100) × Y. (2) X is what percent of Y? → Result = (X ÷ Y) × 100. (3) Percentage change from Old to New → ((New − Old) ÷ Old) × 100. Positive = increase, negative = decrease. (4) Reverse percentage (find original from result and %) → Original = Result ÷ (X ÷ 100).',
  },
  {
    q: 'What is the difference between percentage and percentage point?',
    a: 'A critical distinction: If an interest rate rises from 3% to 5%, it increased by 2 percentage points — but by 66.7% (because (5−3) ÷ 3 × 100 = 66.7%). Percentage points measure absolute change; percentage change measures relative change. Confusing these is common in media reporting. "Inflation fell by 2 percentage points (from 9% to 7%)" is different from "inflation fell by 2% (from 9% to 8.82%)".',
  },
  {
    q: 'What is the difference between percentage increase and percentage decrease?',
    a: 'Both use the same formula: ((New − Old) ÷ Old) × 100. A positive result is an increase; negative is a decrease. Important asymmetry: a 50% decrease followed by a 50% increase does NOT return to the original. $100 − 50% = $50, then $50 + 50% = $75. To recover from a 50% loss, you need a 100% gain. This asymmetry is fundamental to investment risk management.',
  },
  {
    q: 'How do compounding percentages work?',
    a: 'When applying successive percentages, you multiply the decimal multipliers — not add the percentages. Two successive 10% increases → 1.10 × 1.10 = 1.21, or a 21% total increase (not 20%). A 30% discount followed by an additional 10% off → 0.70 × 0.90 = 0.63, or 37% off (not 40%). Compounding always produces different results from simple addition of percentages.',
  },
  {
    q: 'Can percentages be negative?',
    a: 'Yes. A negative percentage change means a decrease: if a value drops from 100 to 80, the percentage change is ((80−100) ÷ 100) × 100 = −20%. Negative percentages appear in contexts like portfolio losses, inflation-adjusted returns, year-over-year revenue declines, and grade curves applied downward. The calculation is identical — the sign simply indicates direction of change.',
  },
]

// ─── Pro Tips ─────────────────────────────────────────────────────────────────

const PRO_TIPS = [
  'Always distinguish between percentage change and percentage point change. Politicians, journalists, and marketers often blur this intentionally. "Unemployment fell from 6% to 4%" — that is 2 percentage points, but a 33% decrease in the unemployment rate. Use this calculator to verify which meaning is being communicated and whether the framing favors the speaker\'s argument.',
  'To multiply percentages, convert to decimals first and multiply — never add percentages together. To apply a 15% discount and then an 8% sales tax, calculate: Price × 0.85 × 1.08. Adding 15% − 8% = 7% and applying that single adjustment gives a different (wrong) answer. The correct combined factor is 0.85 × 1.08 = 0.918 (an 8.2% net reduction).',
  'Beware the "percent of percent" trap. If a store offers 50% off a 20%-off item, the discount is NOT 70% off. It is 50% off the already-discounted price: if original is $100, then 20% off = $80, then 50% off $80 = $40 — which is 60% off the original, not 70%. This calculator handles each step correctly when you apply them sequentially.',
  'For mental math shortcuts: find 10% by moving the decimal one place left ($75 → $7.50). Find 5% by halving 10%. Find 15% by adding 10% and 5%. Find 25% by dividing by 4. Find 1% by moving the decimal two places left. Combining these mental shortcuts you can estimate most common percentages in seconds — then verify with this calculator for precision.',
]

// ─── When to Use ─────────────────────────────────────────────────────────────

const WHEN_TO_USE = [
  {
    icon: '🛍️',
    title: 'Retail discounts and sale prices',
    description: 'Instantly calculate what 25% off a $79.99 item costs, or find what percentage you are saving when a $120 item is marked down to $89 — without needing to do long division in the store.',
  },
  {
    icon: '🧾',
    title: 'Tax and tip calculations',
    description: 'Calculate 8.25% sales tax on a purchase, find 18% tip on a restaurant bill, or determine the pre-tax price when you know the after-tax total.',
  },
  {
    icon: '📝',
    title: 'Grade curves and test scores',
    description: 'Find what percentage you scored on a test, calculate what grade a curve adds to a raw score, or determine the minimum raw score needed to earn a target percentage grade.',
  },
  {
    icon: '📊',
    title: 'Data analysis and reporting',
    description: 'Calculate percentage change between two data points, find what portion of a total a segment represents, or compute year-over-year growth rates for business reporting.',
  },
  {
    icon: '💼',
    title: 'Profit margins and business math',
    description: 'Calculate gross margin percentage, find markup from cost to price, determine commission amounts, or evaluate what percentage of revenue represents each expense category.',
  },
]

// ─── Quick Reference table ────────────────────────────────────────────────────

const QUICK_REF = [
  { input: 'Base Value (Y)', description: 'The reference number you are taking a percentage of', example: '250' },
  { input: 'Percentage (X%)', description: 'The percentage you want to apply or find', example: '35%' },
  { input: 'Result', description: 'What is 35% of 250? → (35 ÷ 100) × 250 = 87.5', example: '87.5' },
  { input: 'Percentage Change', description: '((New − Old) ÷ Old) × 100 — positive = increase', example: '((130 − 100) ÷ 100) × 100 = +30%' },
  { input: 'Reverse Percentage', description: 'Find original from result and % — Result ÷ (X ÷ 100)', example: '75 is 30% of → 75 ÷ 0.30 = 250' },
]

// ─── Related calculators ──────────────────────────────────────────────────────

const RELATED = [
  { icon: '🏷️', name: 'Discount Calculator', slug: 'discount-calculator', description: 'Calculate sale price and savings' },
  { icon: '🧾', name: 'Tax Calculator', slug: 'tax-calculator', description: 'Estimate income tax and take-home pay' },
  { icon: '🍽️', name: 'Tip Calculator', slug: 'tip-calculator', description: 'Calculate tip and split the bill' },
  { icon: '📊', name: 'Statistics Calculator', slug: 'statistics-calculator', description: 'Mean, median, mode and more' },
  { icon: '½', name: 'Fraction Calculator', slug: 'fraction-calculator', description: 'Add, subtract, multiply fractions' },
]

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Percentage Calculator',
    description: 'Free percentage calculator with 4 modes: find X% of Y, what % X is of Y, percentage change, and reverse percentage.',
    url: 'https://roughtools.com/tools/calculators/percentage-calculator',
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
      { '@type': 'ListItem', position: 3, name: 'Percentage Calculator', item: 'https://roughtools.com/tools/calculators/percentage-calculator' },
    ],
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PercentageCalculatorPage() {
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
          <span style={{ color: 'var(--brand)' }}>Percentage Calculator</span>
        </nav>

        {/* H1 */}
        <div style={{ fontSize: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(139,92,246,0.15)', borderRadius: 14, padding: '10px 14px', lineHeight: 1, marginBottom: 12 }}>
          🔢
        </div>
        <h1 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, color: 'var(--fg)', margin: '0 0 10px', letterSpacing: '-0.5px' }}>
          Free Percentage Calculator
        </h1>
        <p style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.7, margin: '0 0 20px', maxWidth: 680 }}>
          Calculate percentages in four modes: find X% of a number, find what percent X is of Y,
          calculate percentage change between two values, and find the original value from a percentage.
          Free, private — all calculations run in your browser.
        </p>

        {/* Trust badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
          {['⚡ Instant results', '🔒 100% private', '🆓 Always free', '🚫 No signup', '4 calculation modes'].map(b => (
            <span key={b} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)',
              borderRadius: 20, padding: '5px 12px', fontSize: 12, color: 'var(--brand-2)', fontWeight: 500,
            }}>{b}</span>
          ))}
        </div>

        <ToolAdUnit position="top" />

        {/* Calculator widget */}
        <PercentageCalculator />

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
            About This Percentage Calculator
          </h2>

          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            Percentages are one of the most universally useful mathematical concepts — appearing in retail discounts,
            tax calculations, test scores, salary raises, investment returns, survey statistics, and countless other
            everyday situations. This Percentage Calculator covers all three fundamental percentage problem types,
            plus a reverse percentage mode, so you can solve any percentage question you encounter with a single tool.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            The Formulas — How It Works
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The calculator provides four distinct calculation modes, each using a specific formula:
          </p>
          <div style={{ background: 'var(--bg-3)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 10, padding: '14px 18px', marginBottom: 14, fontFamily: 'monospace', fontSize: 13, color: 'var(--brand-2)' }}>
            Mode 1: What is X% of Y?  →  Result = (X ÷ 100) × Y<br />
            Mode 2: X is what % of Y?  →  Result = (X ÷ Y) × 100<br />
            Mode 3: % change (Old to New)  →  ((New − Old) ÷ Old) × 100<br />
            Mode 4: Reverse % (find original)  →  Original = Result ÷ (X ÷ 100)
          </div>
          <p style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            Mode 1 answers: &quot;What is 15% of $240?&quot; (= $36). Mode 2 answers: &quot;15 is what percent of 60?&quot; (= 25%).
            Mode 3 answers: &quot;What is the percentage change from $80 to $100?&quot; (= +25%).
            Mode 4 answers: &quot;$45 is 30% of what number?&quot; (= $150).
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Key Concepts and Common Pitfalls
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 10 }}>
            Several percentage concepts trip people up even when the arithmetic is straightforward:
          </p>
          <ul style={{ paddingLeft: 20, margin: '0 0 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              'Percentage vs percentage point: a rate rising from 5% to 7% is a 2 percentage-point increase but a 40% increase in the rate',
              'Compounding: 20% off then 10% off is NOT 30% off — it is 0.80 × 0.90 = 28% off',
              'Asymmetry: a 50% loss requires a 100% gain to recover (not 50%)',
              'Base matters: "20% more than X" and "X is 20% more than Y" have different base values',
              'Percentage of a percentage: "10% of 20%" = 2%, not 30% (you multiply: 0.10 × 0.20 = 0.02)',
            ].map((item, i) => (
              <li key={i} style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                <span style={{ color: '#8b5cf6', marginRight: 8 }}>•</span>{item}
              </li>
            ))}
          </ul>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Who Should Use This Calculator
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            This tool is for everyone — students checking homework, shoppers comparing discounts, employees calculating
            commission or raise percentages, business analysts computing margins and growth rates, teachers grading
            assessments, and anyone who encounters a percentage problem in daily life. Unlike a standard calculator,
            this tool frames the problem in human terms (&quot;what is X% of Y?&quot;) so you can select the right mode
            without having to remember which formula applies.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Privacy Notice
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, margin: 0 }}>
            All calculations in this percentage calculator are performed entirely in your browser. No inputs you enter
            are transmitted to any server, stored in any database, or shared with third parties. See our{' '}
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
          toolName="Percentage Calculator"
          toolSlug="percentage-calculator"
          toolUrl="https://roughtools.com/tools/calculators/percentage-calculator"
          type="general"
        />

        <ToolAdUnit position="bottom" />
      </div>
    </>
  )
}
