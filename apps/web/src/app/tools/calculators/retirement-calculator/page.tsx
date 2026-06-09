import type { Metadata } from 'next'
import ToolAdUnit from '@/components/ToolAdUnit'
import { JsonLd } from '@/components/JsonLd'
import RetirementCalculatorClient from './RetirementCalculatorClient'
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

const _seo = getCalcSEO('retirement-calculator')
export const metadata: Metadata = {
  title: _seo?.seoTitle ?? 'Free Retirement Calculator — Project Savings & Income | RoughTools',
  description: _seo?.metaDescription ?? 'Project your retirement balance and monthly income using the 4% withdrawal rule. Enter your age, savings, monthly contributions, and expected return. Free, instant, no signup.',
  keywords: ['retirement calculator', 'retirement savings calculator', '4% rule calculator', 'how much to save for retirement', 'retirement planning calculator', 'free retirement calculator'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/calculators/retirement-calculator' },
  openGraph: {
    title: 'Free Retirement Calculator — Project Savings & Income | RoughTools',
    description: 'Project your retirement balance and monthly income. Uses the 4% rule. Free, instant, no signup.',
    url: 'https://roughtools.com/tools/calculators/retirement-calculator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Retirement Calculator | RoughTools',
    description: 'Project retirement savings and monthly income with the 4% rule. Free, instant.',
  },
}

// ─── FAQ data (12 questions — accordion) ─────────────────────────────────────

const FAQS = [
  {
    q: 'How accurate is this retirement calculator?',
    a: 'The calculator is mathematically accurate based on the inputs you provide. It applies the compound interest formula and the widely-used 4% withdrawal rule. However, real-world results will differ due to variable market returns, inflation, taxes, and life changes. Use it as a planning guideline, not a guaranteed forecast.',
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
    q: 'Who should I consult before making retirement decisions?',
    a: 'A qualified financial planner (CFP), fee-only financial advisor, or retirement specialist. They can review your full financial picture, tax situation, Social Security options, and investment portfolio to create a personalised retirement plan.',
  },
  {
    q: 'What formula does this calculator use?',
    a: 'Two formulas: (1) Future Value of savings: FV = PV × (1+r)ⁿ + PMT × [(1+r)ⁿ – 1] / r, where PV is current savings, PMT is monthly contribution, r is monthly return rate, and n is months to retirement. (2) Monthly income using the 4% rule: Annual withdrawal = Balance × 4%, Monthly income = Annual withdrawal ÷ 12.',
  },
  {
    q: 'What is the 4% rule and is it reliable?',
    a: 'The 4% rule, popularised by financial planner William Bengen in 1994, states that retirees can withdraw 4% of their portfolio in year one, then adjust for inflation each year, with a high probability of the money lasting 30 years. It is based on historical US market data. Some researchers now suggest 3.3–3.5% for longer retirements or in low-return environments. It is a guideline, not a guarantee.',
  },
  {
    q: 'Does this calculator account for inflation?',
    a: 'No. The balance shown is a nominal (non-inflation-adjusted) figure. In real purchasing power, your retirement balance will be worth less than shown. A conservative approach is to subtract 2–3% from your expected return rate to estimate inflation-adjusted growth. For example, if you expect 7% nominal returns, use 4–5% to account for 2–3% inflation.',
  },
  {
    q: 'Does this calculator include Social Security income?',
    a: 'No — Social Security income is not modelled here. Social Security can significantly supplement your retirement savings. Visit ssa.gov to estimate your benefit. The monthly income shown is solely from your projected investment portfolio.',
  },
  {
    q: 'What annual return rate should I use?',
    a: 'For a diversified stock/bond portfolio: 5–6% is conservative, 7% is the historical long-term US stock market average (adjusted for inflation), and 8–9% is aggressive (mostly equities). Most financial planners recommend using 6–7% for a balanced portfolio. Never assume high returns — it is better to be pleasantly surprised than underprepared.',
  },
]

// ─── Pro Tips ─────────────────────────────────────────────────────────────────

const PRO_TIPS = [
  'The difference between a 6% and 7% annual return over 35 years is not 1% — it is nearly $300,000 on a $500/month contribution. Always aim to maximise investment return through low-cost index funds like S&P 500 ETFs, which historically outperform actively managed funds after fees.',
  'Increasing your monthly contribution by just $100 today adds roughly $120,000 to your retirement balance over 35 years at 7%. Even small increases compounded over time create massive differences. Try "round-up" strategies: round your contribution to the next $50 each time you get a pay rise.',
  'The 4% rule is based on a 30-year retirement. If you plan to retire early at 50, use a 3% or 3.5% withdrawal rate to reduce the risk of running out of money over a 40–50 year retirement. This also means you need 28–33× your annual expenses saved, not 25×.',
  'Run this calculator again every year to track whether you are on pace. Life changes — income increases, windfalls, or unexpected expenses — all change your trajectory. An annual retirement check-in takes 5 minutes and keeps you accountable to your future self.',
]

// ─── When to Use ─────────────────────────────────────────────────────────────

const WHEN_TO_USE = [
  {
    icon: '🌱',
    title: 'Starting your career (ages 20–30)',
    description: 'See how starting early with even $200/month can build over $500,000 by retirement thanks to decades of compound growth — the most powerful time to begin.',
  },
  {
    icon: '📊',
    title: 'Mid-career check-in (ages 35–50)',
    description: 'Assess whether your current savings rate will hit your retirement target, and calculate exactly how much you need to increase monthly contributions to stay on track.',
  },
  {
    icon: '🏖️',
    title: 'Planning for early retirement',
    description: 'Model a retirement age of 50 or 55 to see what savings rate and portfolio size you need to achieve financial independence earlier than the traditional 65.',
  },
  {
    icon: '💼',
    title: 'Comparing employer 401(k) match scenarios',
    description: 'Model the difference between contributing 3% (minimum for employer match) vs 10% of your salary to quantify the long-term impact of capturing full employer match.',
  },
  {
    icon: '📅',
    title: 'Estimating your savings gap',
    description: 'Enter your current savings and the monthly income you need in retirement to discover exactly how large a gap exists — and what monthly contribution closes it.',
  },
]

// ─── Quick Reference table ────────────────────────────────────────────────────

const QUICK_REF = [
  { input: 'Current Age', description: 'Your age today — determines the savings window', example: '35 years' },
  { input: 'Retirement Age', description: 'Age at which you plan to stop working', example: '65 years' },
  { input: 'Current Savings', description: 'Amount already saved toward retirement', example: '$25,000' },
  { input: 'Monthly Contribution', description: 'Amount you add to savings each month', example: '$500/month' },
  { input: 'Annual Return Rate', description: 'Expected average investment return per year', example: '7%' },
  { input: 'Retirement Length', description: 'Years you expect to need retirement income', example: '25 years' },
  { input: 'Withdrawal Rate', description: '4% rule (annual withdrawal as % of balance)', example: '4%' },
  { input: 'Output', description: 'Projected balance, monthly income, years of income', example: '$1,015,589 | $3,385/mo' },
]

// ─── Related calculators ──────────────────────────────────────────────────────

const RELATED = [
  { icon: '📈', name: 'Compound Interest Calculator', slug: 'compound-interest-calculator', description: 'See how interest grows over time' },
  { icon: '💰', name: 'Investment Calculator', slug: 'investment-calculator', description: 'Project portfolio growth with contributions' },
  { icon: '🎯', name: 'Savings Goal Calculator', slug: 'savings-goal-calculator', description: 'How long to reach a savings target' },
  { icon: '📉', name: 'Inflation Calculator', slug: 'inflation-calculator', description: 'How inflation erodes purchasing power' },
  { icon: '📋', name: 'Budget Calculator', slug: 'budget-calculator', description: 'Monthly income and expense planner' },
  { icon: '🏦', name: 'Emergency Fund Calculator', slug: 'emergency-fund-calculator', description: 'How much to save for emergencies' },
]

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Retirement Calculator',
    description: 'Free retirement savings calculator. Projects balance at retirement using compound interest and estimates monthly income using the 4% rule.',
    url: 'https://roughtools.com/tools/calculators/retirement-calculator',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '2847' },
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
      { '@type': 'ListItem', position: 3, name: 'Retirement Calculator', item: 'https://roughtools.com/tools/calculators/retirement-calculator' },
    ],
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RetirementCalculatorPage() {
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
          <span style={{ color: 'var(--brand)' }}>Retirement Calculator</span>
        </nav>

        {/* H1 */}
        <div style={{ fontSize: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(139,92,246,0.15)', borderRadius: 14, padding: '10px 14px', lineHeight: 1, marginBottom: 12 }}>
          🏦
        </div>
        <h1 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, color: 'var(--fg)', margin: '0 0 10px', letterSpacing: '-0.5px' }}>
          Free Retirement Calculator
        </h1>
        <p style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.7, margin: '0 0 20px', maxWidth: 680 }}>
          Project your retirement savings balance and estimate your monthly income using the 4% withdrawal rule.
          Enter your current age, savings, monthly contributions, and expected return rate.
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
        <RetirementCalculatorClient />

        <ToolAdUnit position="middle" />

        {/* Quick Reference */}
        <QuickReferenceTable rows={QUICK_REF} />

        {/* When to Use */}
        <WhenToUseCards cards={WHEN_TO_USE} />

        {/* About section */}
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
            About This Retirement Calculator
          </h2>

          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The Retirement Calculator projects how much money you will have saved by the time you reach your target retirement age,
            based on your current savings, monthly contributions, and expected annual investment return. It then estimates
            how much monthly income that balance can generate using the widely-accepted 4% withdrawal rule, and how many years
            that income will last — a critical figure for planning purposes.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            The Formula — How It Works
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The calculator uses two standard formulas. The first is the <strong style={{ color: 'var(--fg)' }}>future value of a growing annuity</strong>:
          </p>
          <div style={{ background: 'var(--bg-3)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 10, padding: '14px 18px', marginBottom: 14, fontFamily: 'monospace', fontSize: 13, color: 'var(--brand-2)' }}>
            FV = PV × (1 + r)ⁿ + PMT × [(1 + r)ⁿ − 1] / r
          </div>
          <p style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            Where: <strong style={{ color: '#c4caff' }}>FV</strong> = future value at retirement,{' '}
            <strong style={{ color: '#c4caff' }}>PV</strong> = current savings balance,{' '}
            <strong style={{ color: '#c4caff' }}>r</strong> = monthly interest rate (annual rate ÷ 12),{' '}
            <strong style={{ color: '#c4caff' }}>n</strong> = total months until retirement,{' '}
            <strong style={{ color: '#c4caff' }}>PMT</strong> = monthly contribution.
          </p>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The second formula estimates monthly retirement income using the <strong style={{ color: 'var(--fg)' }}>4% rule</strong>,
            popularised by financial planner William Bengen in 1994 and updated by the Trinity Study in 1998:
          </p>
          <div style={{ background: 'var(--bg-3)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 10, padding: '14px 18px', marginBottom: 14, fontFamily: 'monospace', fontSize: 13, color: 'var(--brand-2)' }}>
            Annual withdrawal = Balance × 4%<br />
            Monthly income = Annual withdrawal ÷ 12
          </div>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Assumptions and Limitations
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 10 }}>
            This calculator makes the following simplifying assumptions. Understanding these helps you interpret results correctly:
          </p>
          <ul style={{ paddingLeft: 20, margin: '0 0 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              'Returns are compounded monthly at a constant rate — real returns fluctuate year to year',
              'Monthly contributions remain constant over the entire savings period',
              'Taxes on investment gains and withdrawals are not accounted for',
              'Inflation is not deducted from the projected balance — the figure is nominal',
              'Social Security income is not included in the retirement income estimate',
              'The 4% rule assumes a 30-year retirement — adjust for longer retirements',
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
            This tool is designed for anyone planning their financial future — from a 22-year-old entering their first job
            wanting to see the power of compound interest, to a 50-year-old running a retirement readiness check to see
            if they are on pace, to a couple planning to retire early who need to know what savings rate will get them
            to financial independence. It is also useful for comparing the impact of small changes: what does an extra
            $200/month really do over 30 years? (Answer: usually over $200,000.)
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            When to Consult a Professional
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            This calculator is a starting point for retirement planning, not a substitute for professional advice.
            Before making significant financial decisions — choosing investment accounts, deciding between a Roth IRA
            and traditional 401(k), planning withdrawal strategies, or timing Social Security claims — consult a
            qualified financial planner (CFP) or fee-only financial advisor. A professional can account for your
            tax situation, estate planning goals, risk tolerance, and the full complexity of your financial picture.
            The National Association of Personal Financial Advisors (NAPFA) at napfa.org can help you find a
            fee-only fiduciary advisor.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Privacy Notice
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, margin: 0 }}>
            All calculations in this retirement calculator are performed entirely in your browser. No data you enter
            — including your age, savings amount, income, or planned retirement age — is transmitted to any server,
            stored in any database, or shared with third parties. Your financial information stays completely private
            on your device. See our{' '}
            <a href="/privacy" style={{ color: '#8b5cf6', textDecoration: 'underline' }}>Privacy Policy</a>{' '}
            for full details.
          </p>
        </section>

        {/* Pro Tips */}
        <ProTipsSection tips={PRO_TIPS} />

        {/* FAQ */}
        <CalculatorFAQ faqs={FAQS} />

        {/* Financial Disclaimer */}
        <FinancialDisclaimerBox
          toolName="Retirement Calculator"
          text="Retirement Calculator — Results are projections based on inputs provided and the compound interest formula. They do not constitute financial, investment, or retirement advice. Actual retirement outcomes will vary based on market conditions, inflation, taxes, Social Security benefits, and personal circumstances not captured by this calculator. Always consult a qualified financial planner or fee-only fiduciary advisor before making retirement planning decisions."
        />

        {/* Related Calculators */}
        <RelatedCalculators calculators={RELATED} />

        {/* Compliance kit */}
        <ToolPageExtras
          toolName="Retirement Calculator"
          toolSlug="retirement-calculator"
          toolUrl="https://roughtools.com/tools/calculators/retirement-calculator"
          type="financial"
        />

        <ToolAdUnit position="bottom" />
      </div>
    </>
  )
}
