import type { Metadata } from 'next'
import ToolAdUnit from '@/components/ToolAdUnit'
import { JsonLd } from '@/components/JsonLd'
import InflationCalculatorClient from './InflationCalculatorClient'
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

const _seo = getCalcSEO('inflation-calculator')
export const metadata: Metadata = {
  title: _seo?.seoTitle ?? 'Free Inflation Calculator — Real Value of Money Over Time | RoughTools',
  description: _seo?.metaDescription ?? 'Calculate how inflation erodes purchasing power over time. See what $1,000 today is worth in 10 or 20 years. Free inflation calculator, no signup needed.',
  keywords: ['inflation calculator', 'real value of money', 'purchasing power calculator', 'inflation rate calculator', 'CPI calculator', 'future value inflation', 'free inflation calculator'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/calculators/inflation-calculator' },
  openGraph: {
    title: 'Free Inflation Calculator — Real Value of Money Over Time | RoughTools',
    description: 'See how inflation erodes purchasing power. Calculate future value of money instantly. Free, private.',
    url: 'https://roughtools.com/tools/calculators/inflation-calculator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Inflation Calculator | RoughTools',
    description: 'Calculate the real purchasing power of money adjusted for inflation over time.',
  },
}

// ─── FAQ data (12 questions — accordion) ─────────────────────────────────────

const FAQS = [
  {
    q: 'How accurate is this inflation calculator?',
    a: 'The calculator is mathematically precise — it applies the compound inflation formula correctly. However, the accuracy of the result depends entirely on the inflation rate you enter. Future inflation is unknown; historical US inflation has averaged roughly 3% annually. Use this as a planning tool, not a guaranteed forecast.',
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
    a: "Use your browser's print function (Ctrl+P or Cmd+P) to save results as a PDF. The Export PDF button, where available, downloads a formatted summary of your inputs and results.",
  },
  {
    q: 'Should I consult a financial advisor about inflation planning?',
    a: 'For major decisions — retirement planning, long-term savings strategy, choosing inflation-protected investments — yes. A qualified financial planner (CFP) or fee-only advisor can create a plan that specifically accounts for inflation risk in your portfolio. This calculator is a useful starting point, not a substitute for professional planning.',
  },
  {
    q: 'What formula does this calculator use?',
    a: 'The calculator uses the compound inflation formula: Future Value = Present Value × (1 + inflation rate)ⁿ, where n is the number of years. Purchasing power loss = Future Value − Present Value. This is compound (not simple) inflation, meaning inflation compounds on itself each year — a $100 item at 3% inflation costs $103 in year 1, then $106.09 in year 2 (not $106.00), and so on.',
  },
  {
    q: 'What causes inflation?',
    a: 'Inflation is caused by several factors: demand-pull inflation (too much money chasing too few goods), cost-push inflation (rising production costs passed to consumers), built-in inflation (wage-price spirals where workers demand higher wages as prices rise), and monetary inflation (central banks increasing the money supply). The US Federal Reserve targets 2% annual inflation as optimal for economic stability.',
  },
  {
    q: 'What is the current inflation rate in the US?',
    a: 'Inflation rates change constantly. The US Federal Reserve targets 2% annually. Historically, US inflation has averaged about 3% over the long term. During 2022–2023 it peaked around 8–9% (the highest since the 1980s), then declined. For the most current CPI data, visit the Bureau of Labor Statistics at bls.gov.',
  },
  {
    q: 'What are examples of hyperinflation?',
    a: 'Hyperinflation is extreme, rapidly accelerating inflation exceeding 50% per month. Famous examples: Zimbabwe (2007–2009, peak estimated at 89.7 sextillion percent), Weimar Germany (1921–1923), Hungary (1945–1946), and Venezuela (2018+). These are extreme cases caused by severe monetary policy failures. US inflation has never approached these levels.',
  },
  {
    q: 'How can I hedge against inflation?',
    a: 'Common inflation hedges include: Treasury Inflation-Protected Securities (TIPS, whose principal adjusts with CPI), Series I Savings Bonds (I-Bonds, offering variable rate tied to CPI), real estate (property values and rents tend to rise with inflation), stocks (companies can raise prices, preserving real earnings), commodities like gold, and high-yield savings accounts or CDs when rates are competitive. A diversified portfolio is generally the best protection.',
  },
]

// ─── Pro Tips ─────────────────────────────────────────────────────────────────

const PRO_TIPS = [
  'Use 3% as your default inflation rate for long-term financial planning. It matches the US historical average over the past century and is slightly more conservative than the Fed\'s 2% target — which gives you a margin of safety. For short-term planning (under 5 years), check current CPI data at bls.gov and use that rate instead.',
  'Inflation does not affect all expenses equally. Healthcare costs have historically inflated at 4–5% per year — well above average. Education costs have risen 5–7% annually. Housing follows local supply-demand dynamics. When modelling retirement expenses, consider running separate inflation scenarios for healthcare vs. general living costs.',
  'Series I Savings Bonds (I-Bonds) and TIPS are the closest thing to a guaranteed inflation hedge. I-Bonds purchased from TreasuryDirect.gov offer a variable rate tied to CPI, meaning your return is guaranteed to match inflation. The downside is a $10,000 annual purchase limit per person and a 12-month lock-up period.',
  'Your salary must grow faster than inflation to preserve real purchasing power. If inflation is 3% and your raise is 2%, your real income just fell by 1%. Use this calculator to see how much of a raise you actually need to keep pace. For example, if you earned $60,000 in 2014, you need roughly $90,000 today just to maintain equivalent purchasing power at 3% annual inflation.',
]

// ─── When to Use ─────────────────────────────────────────────────────────────

const WHEN_TO_USE = [
  {
    icon: '🏖️',
    title: 'Retirement planning — real vs nominal',
    description: 'Calculate how much $500,000 in savings will actually be worth in 20 years in today\'s dollars to ensure your retirement plan targets real purchasing power, not just a nominal number.',
  },
  {
    icon: '💼',
    title: 'Salary negotiation',
    description: 'Show your employer exactly how much purchasing power you have lost since your last raise. If your salary has not kept up with inflation, you have effectively received a pay cut.',
  },
  {
    icon: '🏺',
    title: 'Comparing historical prices',
    description: 'Understand what prices from the past mean in today\'s dollars — or what today\'s prices would have cost in a past year. Great for historical financial research and education.',
  },
  {
    icon: '🎯',
    title: 'Long-term savings goals',
    description: 'If you are saving toward a goal (house down payment, college fund, business launch), calculate the inflation-adjusted target amount so your goal keeps up with rising costs.',
  },
  {
    icon: '📊',
    title: 'Investment return analysis',
    description: 'Subtract inflation from nominal investment returns to find real returns. A 7% return with 3% inflation = 4% real return. This is the number that matters for wealth building.',
  },
]

// ─── Quick Reference table ────────────────────────────────────────────────────

const QUICK_REF = [
  { input: 'Starting Amount', description: 'The present value — how much money you have today', example: '$10,000' },
  { input: 'Annual Inflation Rate', description: 'Expected average yearly inflation rate', example: '3% (US historical avg)' },
  { input: 'Time Period', description: 'Number of years to project into the future', example: '20 years' },
  { input: 'Future Value', description: 'Amount needed in the future to match today\'s purchasing power', example: '$18,061' },
  { input: 'Purchasing Power Loss', description: 'How much less your original amount buys in the future', example: '$8,061 lost (44.7%)' },
]

// ─── Related calculators ──────────────────────────────────────────────────────

const RELATED = [
  { icon: '🏦', name: 'Retirement Calculator', slug: 'retirement-calculator', description: 'Project savings balance and monthly income' },
  { icon: '💰', name: 'Salary Calculator', slug: 'salary-calculator', description: 'Hourly, weekly, monthly, annual conversions' },
  { icon: '📈', name: 'Compound Interest Calculator', slug: 'compound-interest-calculator', description: 'See how interest grows over time' },
  { icon: '📊', name: 'Investment Calculator', slug: 'investment-calculator', description: 'Project portfolio growth with contributions' },
  { icon: '📋', name: 'Budget Calculator', slug: 'budget-calculator', description: 'Monthly income and expense planner' },
]

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Inflation Calculator',
    description: 'Free inflation calculator. Shows how inflation erodes purchasing power over time using compound inflation formula.',
    url: 'https://roughtools.com/tools/calculators/inflation-calculator',
    applicationCategory: 'FinanceApplication',
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
      { '@type': 'ListItem', position: 3, name: 'Inflation Calculator', item: 'https://roughtools.com/tools/calculators/inflation-calculator' },
    ],
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InflationCalculatorPage() {
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
          <span style={{ color: 'var(--brand)' }}>Inflation Calculator</span>
        </nav>

        {/* H1 */}
        <div style={{ fontSize: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(139,92,246,0.15)', borderRadius: 14, padding: '10px 14px', lineHeight: 1, marginBottom: 12 }}>
          📉
        </div>
        <h1 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, color: 'var(--fg)', margin: '0 0 10px', letterSpacing: '-0.5px' }}>
          Free Inflation Calculator
        </h1>
        <p style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.7, margin: '0 0 20px', maxWidth: 680 }}>
          Calculate how inflation erodes purchasing power over time.
          Enter an amount, an annual inflation rate, and a time period to see the future value
          and exactly how much purchasing power is lost. Free, private — all calculations run in your browser.
        </p>

        {/* Trust badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
          {['⚡ Instant results', '🔒 100% private', '🆓 Always free', '🚫 No signup', '📊 Compound formula'].map(b => (
            <span key={b} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)',
              borderRadius: 20, padding: '5px 12px', fontSize: 12, color: 'var(--brand-2)', fontWeight: 500,
            }}>{b}</span>
          ))}
        </div>

        <ToolAdUnit position="top" />

        {/* Calculator widget */}
        <InflationCalculatorClient />

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
            About This Inflation Calculator
          </h2>

          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            Inflation is the silent erosion of money&apos;s value over time. A dollar today buys less than a dollar did
            ten years ago — and less than a dollar will buy ten years from now. This Inflation Calculator lets you
            quantify exactly how much purchasing power is lost over any time period at any inflation rate, using the
            mathematically correct compound inflation formula. It is an essential tool for retirement planning,
            salary negotiation, long-term savings goals, and understanding historical prices.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            The Formula — How It Works
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The calculator applies the <strong style={{ color: 'var(--fg)' }}>compound future value formula</strong> adjusted for inflation:
          </p>
          <div style={{ background: 'var(--bg-3)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 10, padding: '14px 18px', marginBottom: 14, fontFamily: 'monospace', fontSize: 13, color: 'var(--brand-2)' }}>
            Future Value = Present Value × (1 + inflation rate)ⁿ<br />
            Purchasing Power Loss = Future Value − Present Value<br />
            Loss % = ((FV − PV) / PV) × 100
          </div>
          <p style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            Where: <strong style={{ color: '#c4caff' }}>FV</strong> = future equivalent amount,{' '}
            <strong style={{ color: '#c4caff' }}>PV</strong> = present value (starting amount),{' '}
            <strong style={{ color: '#c4caff' }}>n</strong> = number of years.
            The result tells you: &quot;To buy what $X buys today, you will need $FV in n years at this inflation rate.&quot;
          </p>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            This uses <strong style={{ color: 'var(--fg)' }}>compound inflation</strong>, not simple inflation. At 3% compound inflation, $10,000 today requires $18,061 in 20 years — not $16,000 (which would be simple: 3% × 20 × $10,000 + $10,000). The difference is significant over long time horizons and is why compound calculation matters.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Assumptions and Historical Context
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 10 }}>
            The calculator assumes a constant annual inflation rate throughout the period. In reality, inflation fluctuates
            significantly year to year. Key historical context to know:
          </p>
          <ul style={{ paddingLeft: 20, margin: '0 0 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              'US long-term average inflation: ~3% per year (1913–present)',
              'Federal Reserve target: 2% per year (adopted as official target in 2012)',
              '2022 peak: ~9.1% (highest since 1981, driven by post-pandemic supply disruptions)',
              'Healthcare inflation: historically 4–5% per year, above average',
              'College tuition inflation: 5–8% per year over the past few decades',
              'The future inflation rate is genuinely unknown — use scenarios (2%, 3%, 5%) to see a range',
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
            This tool is valuable for anyone planning across multi-year time horizons: retirees checking whether their
            savings will hold real value, employees comparing salary offers over time, parents saving for college,
            investors separating nominal returns from real (inflation-adjusted) returns, and students or educators
            studying economic concepts. It is also genuinely useful for the curious — understanding that $100 in 1990
            is equivalent to $234 today puts historical prices in perspective.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Privacy Notice
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, margin: 0 }}>
            All calculations in this inflation calculator are performed entirely in your browser. No data you enter
            is transmitted to any server, stored in any database, or shared with third parties. See our{' '}
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
          toolName="Inflation Calculator"
          text="Inflation Calculator — Results are projections based on a constant compound inflation rate applied to the inputs provided. Actual inflation will vary year to year. This tool does not constitute financial, investment, or economic advice. Future inflation rates are unknown and unpredictable. Consult a qualified financial advisor before making long-term financial decisions based on inflation projections."
        />

        {/* Related Calculators */}
        <RelatedCalculators calculators={RELATED} />

        {/* Compliance kit */}
        <ToolPageExtras
          toolName="Inflation Calculator"
          toolSlug="inflation-calculator"
          toolUrl="https://roughtools.com/tools/calculators/inflation-calculator"
          type="financial"
        />

        <ToolAdUnit position="bottom" />
      </div>
    </>
  )
}
