import type { Metadata } from 'next'
import RoiCalculator from '@/components/tools/calculators/RoiCalculator'
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

const _seo = getCalcSEO('roi-calculator')
export const metadata: Metadata = {
  title: _seo?.seoTitle ?? 'Free ROI Calculator — Return on Investment | RoughTools',
  description: _seo?.metaDescription ?? 'Calculate return on investment (ROI), net profit, and annualized ROI for any investment. Free, instant, no signup. Works for stocks, real estate, business projects, and marketing campaigns.',
  keywords: ['roi calculator', 'return on investment calculator', 'investment return calculator', 'profit calculator', 'annualized roi', 'free roi calculator'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/calculators/roi-calculator' },
  openGraph: {
    title: 'Free ROI Calculator — Return on Investment | RoughTools',
    description: 'Calculate ROI, net profit, and annualized ROI for any investment. Free, instant, no signup.',
    url: 'https://roughtools.com/tools/calculators/roi-calculator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free ROI Calculator | RoughTools',
    description: 'Calculate return on investment and annualized ROI. Free, instant.',
  },
}

// ─── FAQ data ─────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: 'How accurate is this ROI calculator?',
    a: 'The calculator is mathematically accurate based on the inputs you provide. ROI = (Net Profit / Cost of Investment) × 100, and Annualized ROI = (1 + ROI)^(1/years) − 1. Results reflect the inputs exactly. Real-world investment outcomes depend on taxes, fees, reinvestment, and market conditions not captured here.',
  },
  {
    q: 'Is my data private — is anything stored?',
    a: 'Yes, completely private. All calculations run entirely in your browser using JavaScript. No data you enter is transmitted to any server, stored in a database, or shared with third parties. When you close the tab, your inputs are gone.',
  },
  {
    q: 'Is this ROI calculator free to use?',
    a: 'Yes, completely free. No account, no subscription, no hidden fees. RoughTools is ad-supported — using it costs you nothing.',
  },
  {
    q: 'Does this work on mobile devices?',
    a: 'Yes. The calculator is fully responsive and works on any device — smartphone, tablet, or desktop — in any modern browser.',
  },
  {
    q: 'What browsers are supported?',
    a: 'All modern browsers: Chrome, Firefox, Safari, Edge, and Opera. Internet Explorer is not supported. We recommend Chrome or Firefox for the best experience.',
  },
  {
    q: 'Can I save or export my results?',
    a: 'Yes. Use your browser\'s print function (Ctrl+P or Cmd+P) to save your results as a PDF. The ToolPageExtras section below also provides export options where available.',
  },
  {
    q: 'Does this replace professional financial advice?',
    a: 'No. This calculator is for estimation and educational purposes. Before making significant investment decisions, consult a qualified financial advisor (CFP), investment professional, or fee-only fiduciary. They can account for taxes, risk tolerance, and your complete financial picture.',
  },
  {
    q: 'What formula does this calculator use?',
    a: 'Three formulas: (1) Net Profit = Final Value − Initial Cost. (2) ROI = (Net Profit / Cost of Investment) × 100. (3) Annualized ROI = (1 + ROI/100)^(1/years) − 1, expressed as a percentage. Annualized ROI lets you compare investments held for different time periods on an equal footing.',
  },
  {
    q: 'What is a good ROI?',
    a: 'It depends on the asset class and time horizon. For stocks/equity funds, 7–10% annualized is considered good (roughly the historical S&P 500 average). For real estate, 8–12% total ROI annually is typical. For business projects, 15–30%+ is often targeted. Marketing campaigns vary widely — a 200–500% ROAS (4:1 to 5:1) is a common benchmark for digital advertising.',
  },
  {
    q: 'What is the difference between ROI and IRR?',
    a: 'ROI is a simple percentage return that does not account for the timing of cash flows. IRR (Internal Rate of Return) is the discount rate that makes the Net Present Value of all cash flows equal zero — it fully accounts for when money goes in and comes out. For complex investments with multiple cash flows over time (e.g., rental properties with annual cash flows), IRR is a more precise measure than simple ROI.',
  },
  {
    q: 'Can ROI be negative, and what does that mean?',
    a: 'Yes. A negative ROI means the investment lost money — the final value is less than the initial cost. For example, if you invested $1,000 and it is now worth $700, your ROI is −30%. A negative ROI does not always mean you should sell — context matters (market conditions, holding period, recovery potential). Always consider opportunity cost alongside ROI.',
  },
  {
    q: 'How do I calculate ROI for a marketing campaign?',
    a: 'For marketing, ROI = (Revenue Generated − Campaign Cost) / Campaign Cost × 100. A related metric is ROAS (Return on Ad Spend) = Revenue / Ad Spend. For example, if you spent $5,000 on ads and generated $20,000 in revenue, ROAS = 4× (or 400%) and ROI = 300%. Always distinguish between gross revenue and net profit when calculating marketing ROI.',
  },
]

// ─── Pro Tips ─────────────────────────────────────────────────────────────────

const PRO_TIPS = [
  'Always annualize ROI before comparing investments held for different durations. A 50% ROI over 10 years is only ~4.1% annualized — significantly less impressive than 50% over 2 years (~22.5% annualized). The Annualized ROI formula eliminates this apples-to-oranges problem.',
  'ROI ignores the timing of cash flows within an investment. If an investment pays out $5,000 in year 1 and $5,000 in year 10, simple ROI treats these the same. For investments with multiple cash flows, use IRR (Internal Rate of Return) alongside ROI for a complete picture.',
  'Risk-adjusted ROI is what really matters. A 20% ROI from a government bond is very different from 20% in a speculative startup. Always compare ROI against the risk taken — high ROI with high volatility may actually underperform a lower-ROI, lower-risk investment on a risk-adjusted basis.',
  'Opportunity cost is the true benchmark for any investment. If you earned 8% ROI but a comparable index fund returned 12% in the same period, your real opportunity cost is −4%. Always compare your investment ROI against a relevant benchmark (e.g., S&P 500, Treasury bonds, or industry average) to gauge true performance.',
]

// ─── When to Use ─────────────────────────────────────────────────────────────

const WHEN_TO_USE = [
  {
    icon: '📈',
    title: 'Evaluating stock or fund returns',
    description: 'Enter your purchase price and current value to instantly see your total and annualized ROI, and compare it to benchmark index returns.',
  },
  {
    icon: '📢',
    title: 'Marketing campaign analysis',
    description: 'Calculate whether your ad spend generated a positive ROI by entering campaign cost and attributed revenue — essential for budget allocation decisions.',
  },
  {
    icon: '🏠',
    title: 'Real estate investment analysis',
    description: 'Assess property investment performance by comparing purchase price (plus costs) against sale price or current market value to see total return.',
  },
  {
    icon: '💼',
    title: 'Business project evaluation',
    description: 'Before greenlighting a project, estimate expected ROI to justify the investment. After completion, measure actual ROI against projection.',
  },
  {
    icon: '⚖️',
    title: 'Comparing investment options',
    description: 'Run the same calculation for multiple options side-by-side (stocks, bonds, real estate, business) to identify which delivers the best risk-adjusted return.',
  },
]

// ─── Quick Reference ──────────────────────────────────────────────────────────

const QUICK_REF = [
  { input: 'Initial Investment', description: 'The total cost of the investment (purchase price + fees)', example: '$10,000' },
  { input: 'Final Value', description: 'Current or sale value of the investment', example: '$13,500' },
  { input: 'Net Profit', description: 'Final Value minus Initial Investment', example: '$3,500' },
  { input: 'ROI %', description: '(Net Profit / Initial Investment) × 100', example: '35%' },
  { input: 'Time Period (years)', description: 'Duration the investment was held', example: '3 years' },
  { input: 'Annualized ROI %', description: '(1 + ROI)^(1/years) − 1 — yearly equivalent return', example: '10.5% / year' },
]

// ─── Related Calculators ──────────────────────────────────────────────────────

const RELATED = [
  { icon: '📊', name: 'Compound Interest Calculator', slug: 'compound-interest-calculator', description: 'See how interest compounds over time' },
  { icon: '💰', name: 'Investment Calculator', slug: 'investment-calculator', description: 'Project portfolio growth with contributions' },
  { icon: '📉', name: 'Inflation Calculator', slug: 'inflation-calculator', description: 'Adjust returns for inflation impact' },
  { icon: '🏦', name: 'Retirement Calculator', slug: 'retirement-calculator', description: 'Project retirement savings balance' },
]

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ROI Calculator',
    description: 'Free ROI calculator. Calculates return on investment, net profit, and annualized ROI for any investment.',
    url: 'https://roughtools.com/tools/calculators/roi-calculator',
    applicationCategory: 'FinanceApplication',
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
      { '@type': 'ListItem', position: 3, name: 'ROI Calculator', item: 'https://roughtools.com/tools/calculators/roi-calculator' },
    ],
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ROICalculatorPage() {
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
          <span style={{ color: 'var(--brand)' }}>ROI Calculator</span>
        </nav>

        {/* H1 */}
        <div style={{ fontSize: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(139,92,246,0.15)', borderRadius: 14, padding: '10px 14px', lineHeight: 1, marginBottom: 12 }}>
          📈
        </div>
        <h1 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, color: 'var(--fg)', margin: '0 0 10px', letterSpacing: '-0.5px' }}>
          Free ROI Calculator
        </h1>
        <p style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.7, margin: '0 0 20px', maxWidth: 680 }}>
          Calculate your return on investment, net profit, and annualized ROI for any investment.
          Enter the initial cost and final value — works for stocks, real estate, business projects, and marketing campaigns.
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
        <RoiCalculator />

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
            About This ROI Calculator
          </h2>

          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The ROI Calculator measures the efficiency of an investment — how much return you earned relative to the amount you put in.
            It is one of the most universal financial metrics used across investing, business, marketing, and real estate.
            Unlike absolute profit (which tells you how many dollars you made), ROI is a percentage that lets you compare
            wildly different investments on a level playing field: a $500 gain on a $1,000 investment (50% ROI) is far
            more impressive than a $500 gain on a $50,000 investment (1% ROI).
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            The Formula — How It Works
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 10 }}>
            The calculator uses three standard formulas:
          </p>
          <div style={{ background: 'var(--bg-3)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 10, padding: '14px 18px', marginBottom: 14, fontFamily: 'monospace', fontSize: 13, color: 'var(--brand-2)' }}>
            Net Profit = Final Value − Initial Investment<br />
            ROI = (Net Profit / Initial Investment) × 100<br />
            Annualized ROI = (1 + ROI/100)^(1/years) − 1
          </div>
          <p style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The <strong style={{ color: '#c4caff' }}>Annualized ROI</strong> formula converts a total return over any period
            into an equivalent yearly return, enabling fair comparison between investments held for different durations.
            For example, a 61% total ROI over 4 years equals approximately 12.9% per year — the same rate compounded annually
            for 4 years produces the same total return.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            ROI vs Absolute Return: Why Percentage Matters
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            Absolute return tells you the dollar amount you made or lost. ROI contextualises that dollar amount against
            what you invested. A marketing campaign that cost $2,000 and generated $8,000 in revenue has a 300% ROI
            (or a 4:1 ROAS). A real estate deal that cost $200,000 and sold for $240,000 has a 20% ROI — a much lower
            percentage despite being a much larger absolute gain. ROI lets decision-makers compare these scenarios fairly
            and allocate capital to the highest-performing opportunities.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            When ROI Can Be Misleading
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 10 }}>
            ROI is a powerful but imperfect metric. It has known limitations:
          </p>
          <ul style={{ paddingLeft: 20, margin: '0 0 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              'It ignores the time value of money — a 100% ROI over 20 years (3.5% annualized) is much less valuable than 100% in 3 years (26% annualized)',
              'It does not account for risk — two investments with identical ROI can have vastly different volatility and probability of achieving that return',
              'It excludes taxes and transaction fees, which can materially reduce real-world returns',
              'For investments with multiple cash flows (rental income, dividends, staged payments), use IRR instead of simple ROI',
              'ROIC (Return on Invested Capital) and ROAS (Return on Ad Spend) are specialised variants for corporate and marketing contexts respectively',
            ].map((item, i) => (
              <li key={i} style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                <span style={{ color: '#8b5cf6', marginRight: 8 }}>•</span>{item}
              </li>
            ))}
          </ul>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Privacy Notice
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, margin: 0 }}>
            All calculations in this ROI calculator are performed entirely in your browser. No data you enter —
            including investment amounts, values, or time periods — is transmitted to any server, stored in any database,
            or shared with third parties. Your financial information stays completely private on your device. See our{' '}
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
          toolName="ROI Calculator"
          text="ROI Calculator — Results are calculations based on inputs provided and do not constitute financial, investment, or professional advice. Actual investment outcomes will vary based on market conditions, taxes, fees, reinvestment, and individual circumstances not captured by this calculator. Always consult a qualified financial advisor or fee-only fiduciary before making investment decisions."
        />

        {/* Related Calculators */}
        <RelatedCalculators calculators={RELATED} />

        <ToolPageExtras
          toolName="ROI Calculator"
          toolSlug="roi-calculator"
          toolUrl="https://roughtools.com/tools/calculators/roi-calculator"
          type="financial"
        />

        <ToolAdUnit position="bottom" />
      </div>
    </>
  )
}
