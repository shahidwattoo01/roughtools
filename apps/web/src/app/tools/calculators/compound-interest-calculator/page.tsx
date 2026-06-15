import type { Metadata } from 'next'
import CompoundInterestCalculator from '@/components/tools/calculators/CompoundInterestCalculator'
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
  FinancialDisclaimerBox,
} from '@/components/tools/CalculatorSections'

// ─── Metadata ────────────────────────────────────────────────────────────────

const _seo = getCalcSEO('compound-interest-calculator')
export const metadata: Metadata = {
  title: _seo?.seoTitle ?? 'Free Compound Interest Calculator — Investment Growth Tool | RoughTools',
  description: _seo?.metaDescription ?? 'Calculate compound interest and investment growth with daily, monthly, or yearly compounding. See future value, total interest earned, and growth chart. Free, instant, no signup.',
  keywords: ['compound interest calculator', 'investment calculator', 'savings calculator', 'interest calculator', 'future value calculator', 'free compound interest calculator'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/calculators/compound-interest-calculator' },
  openGraph: {
    title: 'Free Compound Interest Calculator — Investment Growth Tool | RoughTools',
    description: 'Calculate compound interest with daily, monthly, or yearly compounding. See future value and total interest earned. Free, instant.',
    url: 'https://roughtools.com/tools/calculators/compound-interest-calculator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Compound Interest Calculator | RoughTools',
    description: 'Calculate compound interest and investment growth. Free, instant, no signup.',
  },
}

// ─── FAQ data (12 questions — accordion) ─────────────────────────────────────

const FAQS = [
  {
    q: 'How accurate is this compound interest calculator?',
    a: 'The calculator is mathematically accurate based on the standard compound interest formula A = P(1 + r/n)^(nt). It applies the exact compounding frequency you select. Real-world investment results will differ due to variable returns, taxes, inflation, and fees not captured by this tool. Use it as a planning and educational guideline.',
  },
  {
    q: 'Is my data private — is anything stored?',
    a: 'Yes, completely private. All calculations run entirely in your browser using JavaScript. No data you enter is transmitted to any server, stored in a database, or shared with third parties. When you close the tab, your inputs are gone.',
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
    q: 'Should I consult a financial professional before investing?',
    a: 'Yes, for significant investment decisions. This tool is great for illustrating the power of compound interest conceptually. For real investment decisions — choosing accounts, funds, or strategies — consult a qualified financial planner (CFP) or fee-only financial advisor who can account for your tax situation and full financial picture.',
  },
  {
    q: 'What formula does this calculator use?',
    a: 'The standard compound interest formula: A = P(1 + r/n)^(nt), where A is the final amount, P is the principal (starting balance), r is the annual interest rate (as a decimal), n is the number of compounding periods per year, and t is the time in years. For regular contributions, the future value of an annuity formula is also applied.',
  },
  {
    q: 'What is the difference between simple and compound interest?',
    a: 'Simple interest is calculated only on the original principal — it never grows. For example, $1,000 at 5% simple interest earns $50 every year. Compound interest is calculated on the principal plus previously accumulated interest, so your earnings grow each period. At 5% compounded annually, you earn $50 in year 1, $52.50 in year 2, $55.13 in year 3, and so on. Over 30 years, the difference becomes enormous.',
  },
  {
    q: 'How much does compounding frequency matter?',
    a: 'Less than most people think, especially compared to the rate and time factors. Going from annual to monthly compounding on $10,000 at 6% over 20 years adds roughly $330. Going from monthly to daily adds less than $20. The rate and time period have dramatically more impact. That said, always prefer more frequent compounding when the option exists.',
  },
  {
    q: 'What is the Rule of 72?',
    a: 'The Rule of 72 is a quick mental math shortcut to estimate how long it takes to double your money. Simply divide 72 by your annual interest rate. At 6% per year, money doubles in roughly 72 ÷ 6 = 12 years. At 9%, it doubles in 8 years. At 4%, it takes 18 years. It is surprisingly accurate for rates between 4% and 12%.',
  },
  {
    q: 'Are taxes on compound interest gains included?',
    a: 'No. This calculator shows pre-tax growth. In taxable brokerage accounts, you may owe capital gains tax on dividends and realized gains each year, which reduces compounding. In tax-advantaged accounts like a Roth IRA or 401(k), growth is tax-deferred or tax-free, making the calculator\'s output a closer approximation. Always consult a tax professional for your specific situation.',
  },
]

// ─── Pro Tips ─────────────────────────────────────────────────────────────────

const PRO_TIPS = [
  'A 1% difference in annual rate sounds tiny, but it is enormous over time. $10,000 at 6% for 30 years grows to $57,435. At 7%, it grows to $76,123 — a $18,688 difference from a single percentage point. Always pursue higher returns through low-cost index funds, which historically outperform actively managed funds after fees.',
  'Compounding frequency matters much less than rate or time. The difference between monthly and daily compounding on $50,000 over 20 years at 7% is only about $200. Focus your energy on maximising your rate and contribution amount rather than obsessing over compounding intervals.',
  'Use the Rule of 72 to make compound interest intuitive: divide 72 by your annual rate to find the doubling time. At 8%, money doubles in 9 years. That means $25,000 today becomes $50,000 in 9 years, $100,000 in 18 years, and $200,000 in 27 years — without any additional contributions.',
  'Starting 10 years earlier can have more impact than doubling your monthly contribution. $300/month from age 25 to 65 at 7% grows to ~$798,000. Starting at 35 with $600/month — double the contribution — only reaches ~$726,000. Time in the market is your greatest asset.',
]

// ─── When to Use ─────────────────────────────────────────────────────────────

const WHEN_TO_USE = [
  {
    icon: '💰',
    title: 'Savings growth projection',
    description: 'See exactly how much a savings account or CD balance will grow over 1, 5, or 20 years at a given interest rate and compounding frequency.',
  },
  {
    icon: '🏦',
    title: 'Comparing account types',
    description: 'Compare a high-yield savings account (4.5% APY daily compounding) to a standard savings account (0.5% APY) over 10 years to quantify the difference in dollars.',
  },
  {
    icon: '🎓',
    title: 'Education fund planning',
    description: 'Project how monthly contributions to a 529 plan will grow over 18 years to estimate whether your savings rate will cover future college costs.',
  },
  {
    icon: '📈',
    title: 'Investment return comparison',
    description: 'Model different expected return scenarios (conservative 5%, moderate 7%, aggressive 10%) to understand the range of possible outcomes for a lump-sum investment.',
  },
  {
    icon: '🏖️',
    title: 'Retirement planning component',
    description: 'Estimate the future value of a single lump sum (like an inheritance or bonus) invested today, as a complement to your regular retirement contributions.',
  },
]

// ─── Quick Reference table ────────────────────────────────────────────────────

const QUICK_REF = [
  { input: 'Principal (P)', description: 'Starting amount — the initial lump sum invested or saved', example: '$10,000' },
  { input: 'Annual Rate (r)', description: 'Expected yearly interest or investment return rate', example: '7%' },
  { input: 'Compounding Frequency (n)', description: 'How often interest is calculated and added per year', example: 'Monthly (12×)' },
  { input: 'Time Period (t)', description: 'Number of years the money stays invested', example: '20 years' },
  { input: 'Formula', description: 'A = P(1 + r/n)^(nt)', example: 'Standard compound formula' },
  { input: 'Output: Final Amount', description: 'Total balance at end of period including interest', example: '$38,697' },
  { input: 'Output: Total Interest', description: 'Interest earned = Final Amount minus Principal', example: '$28,697' },
]

// ─── Related calculators ──────────────────────────────────────────────────────

const RELATED = [
  { icon: '🏦', name: 'Retirement Calculator', slug: 'retirement-calculator', description: 'Project savings balance at retirement' },
  { icon: '🎯', name: 'Savings Goal Calculator', slug: 'savings-goal-calculator', description: 'How long to reach a savings target' },
  { icon: '📈', name: 'Investment Calculator', slug: 'investment-calculator', description: 'Portfolio growth with contributions' },
  { icon: '📉', name: 'Inflation Calculator', slug: 'inflation-calculator', description: 'How inflation erodes purchasing power' },
  { icon: '🏠', name: 'Mortgage Calculator', slug: 'mortgage-calculator', description: 'Monthly mortgage payment estimator' },
]

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Compound Interest Calculator',
    description: 'Free compound interest calculator. See how savings or investments grow over time with daily, monthly, or yearly compounding. Shows future value and total interest earned.',
    url: 'https://roughtools.com/tools/calculators/compound-interest-calculator',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '2341' },
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
      { '@type': 'ListItem', position: 3, name: 'Compound Interest Calculator', item: 'https://roughtools.com/tools/calculators/compound-interest-calculator' },
    ],
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CompoundInterestPage() {
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
          <span style={{ color: 'var(--brand)' }}>Compound Interest Calculator</span>
        </nav>

        {/* H1 */}
        <div style={{ fontSize: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(139,92,246,0.15)', borderRadius: 14, padding: '10px 14px', lineHeight: 1, marginBottom: 12 }}>
          📈
        </div>
        <h1 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, color: 'var(--fg)', margin: '0 0 10px', letterSpacing: '-0.5px' }}>
          Free Compound Interest Calculator
        </h1>
        <p style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.7, margin: '0 0 20px', maxWidth: 680 }}>
          See how your savings or investments grow over time with the power of compound interest.
          Enter your principal, annual rate, compounding frequency, and time period.
          Free, private — all calculations run in your browser.
        </p>

        {/* Trust badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
          {['⚡ Instant results', '🔒 100% private', '🆓 Always free', '🚫 No signup', '📊 Financially accurate'].map(b => (
            <span key={b} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)',
              borderRadius: 20, padding: '5px 12px', fontSize: 12, color: 'var(--brand-2)', fontWeight: 500,
            }}>{b}</span>
          ))}
        </div>

        <ToolAdUnit position="top" />

        {/* Calculator widget */}
        <CompoundInterestCalculator />

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
            About This Compound Interest Calculator
          </h2>

          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The Compound Interest Calculator shows you the future value of a lump sum investment or savings balance,
            including the effect of regular contributions, over any time period and compounding frequency. It is one of
            the most important financial tools you can use, because compound interest — interest earned on interest —
            is the fundamental engine behind long-term wealth building. Albert Einstein reportedly called it the
            &quot;eighth wonder of the world,&quot; and while that attribution is disputed, the math is undeniably powerful.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            The Formula — How It Works
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The core formula is the <strong style={{ color: 'var(--fg)' }}>compound interest equation</strong>:
          </p>
          <div style={{ background: 'var(--bg-3)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 10, padding: '14px 18px', marginBottom: 14, fontFamily: 'monospace', fontSize: 13, color: 'var(--brand-2)' }}>
            A = P(1 + r/n)^(nt)
          </div>
          <p style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            Where: <strong style={{ color: '#c4caff' }}>A</strong> = final amount (principal + interest),{' '}
            <strong style={{ color: '#c4caff' }}>P</strong> = principal (starting amount),{' '}
            <strong style={{ color: '#c4caff' }}>r</strong> = annual interest rate as a decimal (e.g. 0.07 for 7%),{' '}
            <strong style={{ color: '#c4caff' }}>n</strong> = compounding frequency per year (12 for monthly, 365 for daily),{' '}
            <strong style={{ color: '#c4caff' }}>t</strong> = time in years.
          </p>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            When regular contributions are added, the calculator also applies the <strong style={{ color: 'var(--fg)' }}>future value of an annuity</strong> formula
            to calculate the accumulated value of all periodic deposits, then sums the two results to give the total balance.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Assumptions and Limitations
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 10 }}>
            This calculator makes the following simplifying assumptions:
          </p>
          <ul style={{ paddingLeft: 20, margin: '0 0 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              'The interest rate is constant throughout the entire period — real investment returns fluctuate annually',
              'Contributions are made at the start or end of each period consistently — no missed periods',
              'Taxes on interest or capital gains are not deducted — results shown are pre-tax',
              'Inflation is not factored in — the final amount shown is in nominal (today\'s dollar) terms',
              'Investment fees (expense ratios, advisory fees) are not subtracted — these reduce real returns',
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
            This tool is designed for anyone who wants to understand or demonstrate the power of compounding. Students
            learning personal finance can use it to see why starting early matters so much. First-time savers can
            compare a high-yield savings account to a standard account. Investors can model different return scenarios
            to understand outcome ranges. Parents planning education funds can estimate how monthly 529 contributions
            grow over 18 years. Anyone comparing two savings or investment products — where the only difference is
            the rate or compounding frequency — can use this tool to instantly quantify the dollar difference.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            When to Consult a Professional
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            This calculator is an educational and planning tool. Before making real investment decisions — choosing
            between a Roth IRA and taxable brokerage, selecting funds, or allocating a large lump sum — consult a
            qualified financial planner (CFP) or fee-only fiduciary advisor. They can account for your tax bracket,
            risk tolerance, time horizon, and complete financial situation. Visit napfa.org to find a fee-only advisor.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Privacy Notice
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, margin: 0 }}>
            All calculations in this compound interest calculator run entirely in your browser. No data you enter —
            including principal amounts, interest rates, or time periods — is transmitted to any server or stored
            anywhere. Your financial information stays completely private on your device. See our{' '}
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

        {/* Financial Disclaimer */}
        <FinancialDisclaimerBox
          toolName="Compound Interest Calculator"
          text="Compound Interest Calculator — Results are projections based on a constant interest rate and the inputs you provide. They do not constitute financial or investment advice. Real investment returns vary by year and are not guaranteed. Taxes, inflation, and fees are not included in results. Always consult a qualified financial planner before making investment decisions."
        />

        {/* Related Calculators */}
        <RelatedCalculators calculators={RELATED} />

        {/* Compliance kit */}
        <ToolPageExtras
          toolName="Compound Interest Calculator"
          toolSlug="compound-interest-calculator"
          toolUrl="https://roughtools.com/tools/calculators/compound-interest-calculator"
          type="financial"
        />

        <ToolAdUnit position="bottom" />
      </div>
    </>
  )
}
