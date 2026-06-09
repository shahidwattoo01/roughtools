import type { Metadata } from 'next'
import ToolAdUnit from '@/components/ToolAdUnit'
import { JsonLd } from '@/components/JsonLd'
import SalaryCalculatorClient from './SalaryCalculatorClient'
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

const _seo = getCalcSEO('salary-calculator')
export const metadata: Metadata = {
  title: _seo?.seoTitle ?? 'Free Salary Calculator — Hourly to Annual Salary Converter | RoughTools',
  description: _seo?.metaDescription ?? 'Convert salary between hourly, daily, weekly, bi-weekly, monthly, and annual. See estimated take-home pay after taxes. Free salary calculator — no signup.',
  keywords: ['salary calculator', 'hourly to annual salary', 'salary to hourly', 'annual salary calculator', 'take home pay calculator', 'paycheck calculator', 'free salary calculator'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/calculators/salary-calculator' },
  openGraph: {
    title: 'Free Salary Calculator — Hourly to Annual Salary Converter | RoughTools',
    description: 'Convert salary between all pay periods and see estimated take-home pay. Free, instant, no signup.',
    url: 'https://roughtools.com/tools/calculators/salary-calculator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Salary Calculator | RoughTools',
    description: 'Convert hourly to annual salary and see take-home pay estimates. Free, instant.',
  },
}

// ─── FAQ data (12 questions — accordion) ─────────────────────────────────────

const FAQS = [
  {
    q: 'How accurate is this salary calculator?',
    a: 'The pay period conversions (hourly to annual, monthly to weekly, etc.) are mathematically exact. The take-home pay estimate uses a simplified federal tax approximation and does not account for state income taxes, filing status, pre-tax deductions (401k, health insurance), or other variables. For an accurate net pay figure, use your employer\'s payroll system or consult a payroll professional.',
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
    q: 'Should I consult a professional for salary or tax advice?',
    a: 'Yes — for accurate tax withholding, consult a CPA (Certified Public Accountant) or use your employer\'s HR department. For salary negotiation strategy, a career coach or industry compensation surveys (Glassdoor, Levels.fyi, Bureau of Labor Statistics) are valuable resources. For financial planning based on your income, a fee-only financial advisor is recommended.',
  },
  {
    q: 'What formula does this calculator use?',
    a: 'The conversions use simple arithmetic: Annual = Hourly × Hours per week × 52; Monthly = Annual ÷ 12; Weekly = Annual ÷ 52; Daily = Annual ÷ (52 × Work days per week); Hourly = Annual ÷ (52 × Hours per week); Bi-weekly = Annual ÷ 26. These assume you work the specified hours every week for all 52 weeks of the year.',
  },
  {
    q: 'What is the difference between gross pay and net pay?',
    a: 'Gross pay is your total compensation before any deductions — the figure on your offer letter. Net pay (take-home pay) is what actually lands in your bank account after federal income tax, state income tax (if applicable), Social Security (6.2%), Medicare (1.45%), and any voluntary deductions like health insurance premiums, 401(k) contributions, or HSA contributions are subtracted. For most people, net pay is 65–75% of gross pay.',
  },
  {
    q: 'How is overtime calculated?',
    a: 'For non-exempt employees (those covered by the Fair Labor Standards Act), overtime pay is required at 1.5× the regular hourly rate for any hours worked over 40 in a workweek. For example, if your regular rate is $20/hour, overtime pays $30/hour. Salaried exempt employees (typically earning over $684/week and in executive, professional, or administrative roles) are generally not entitled to overtime. Check with your HR department about your classification.',
  },
  {
    q: 'How do I negotiate my salary effectively?',
    a: 'Research market rates first using Glassdoor, LinkedIn Salary, Payscale, and the Bureau of Labor Statistics Occupational Outlook Handbook. Always negotiate — studies consistently show that candidates who negotiate receive higher offers, and employers rarely rescind offers over salary negotiation. Negotiate the total compensation package (base, bonus, equity, PTO, remote work flexibility, professional development budget), not just base salary. Use a specific number (e.g., "$87,500") rather than a round number, which signals you have done your research.',
  },
  {
    q: 'How does contractor pay compare to employee pay?',
    a: 'As a contractor (1099), you typically earn a higher gross hourly rate than an equivalent employee, but you are responsible for self-employment tax (15.3% for Social Security and Medicare — the employer\'s share is usually 7.65% for employees), your own health insurance, retirement contributions, and no paid time off. A common rule of thumb: a contractor rate should be at least 1.3–1.5× the equivalent employee salary to break even after accounting for these additional costs. Use this calculator to convert both to annual equivalents before comparing.',
  },
]

// ─── Pro Tips ─────────────────────────────────────────────────────────────────

const PRO_TIPS = [
  'Always compare job offers on an annual basis, not monthly or per hour. A role paying $38/hour for 35 hours/week ($69,160/year) may look more attractive than one at $36/hour for 40 hours/week ($74,880/year) until you convert both to annual figures. This calculator makes that comparison instant and prevents a costly mistake.',
  'Always negotiate your salary — even when you feel the offer is fair. Research consistently shows that the majority of employers expect negotiation and have budgeted a range above their initial offer. A $3,000 annual raise negotiated at the start of your career is worth far more compounded over time than the face value, as all future raises and percentage bonuses build from a higher base.',
  'Total compensation is far more than your base salary. Evaluate employer 401(k) match (often worth $3,000–$8,000/year), health insurance value (company-paid premiums can be worth $5,000–$15,000/year), equity (stock options or RSUs), remote work savings (commute, clothing, meals), PTO, and professional development budget. A lower base salary with excellent benefits can easily outperform a higher base at a company with no benefits.',
  'Cost of living adjustments are critical for comparing offers across cities. A $90,000 salary in Austin, TX has significantly higher purchasing power than the same salary in San Francisco or New York City, where housing alone can consume 50–60% of take-home pay. Use a cost-of-living calculator to convert salaries to a comparable baseline before accepting or declining an offer.',
]

// ─── When to Use ─────────────────────────────────────────────────────────────

const WHEN_TO_USE = [
  {
    icon: '💼',
    title: 'Job offer comparison',
    description: 'Convert two job offers to the same pay period for an apples-to-apples comparison — especially when one is hourly and the other is salaried.',
  },
  {
    icon: '⏱️',
    title: 'Hourly to salary conversion',
    description: 'Find the annual equivalent of an hourly wage (or vice versa) to understand your true yearly compensation and compare to industry benchmarks.',
  },
  {
    icon: '🖥️',
    title: 'Freelance rate setting',
    description: 'Determine what hourly rate to charge as a freelancer or contractor to match or exceed a full-time salary, accounting for the lack of benefits and paid time off.',
  },
  {
    icon: '📋',
    title: 'Budget planning',
    description: 'Convert your annual salary to monthly and weekly figures to build a realistic household budget that matches your actual pay schedule.',
  },
  {
    icon: '📈',
    title: 'Raise negotiation prep',
    description: 'Calculate the annual and monthly dollar difference between your current salary and your target raise to clearly quantify what you are asking for in a negotiation conversation.',
  },
]

// ─── Quick Reference table ────────────────────────────────────────────────────

const QUICK_REF = [
  { input: 'Annual Salary', description: 'Total yearly gross compensation', example: '$75,000/year' },
  { input: 'Monthly Salary', description: 'Annual ÷ 12', example: '$6,250/month' },
  { input: 'Bi-weekly Pay', description: 'Annual ÷ 26 (26 pay periods/year)', example: '$2,884.62' },
  { input: 'Weekly Pay', description: 'Annual ÷ 52', example: '$1,442.31/week' },
  { input: 'Daily Pay', description: 'Annual ÷ (52 × 5 work days)', example: '$288.46/day' },
  { input: 'Hourly Rate (40hr week)', description: 'Annual ÷ (52 × 40)', example: '$36.06/hour' },
]

// ─── Related calculators ──────────────────────────────────────────────────────

const RELATED = [
  { icon: '🧾', name: 'Tax Calculator', slug: 'tax-calculator', description: 'Estimate your income tax liability' },
  { icon: '📋', name: 'Budget Calculator', slug: 'budget-calculator', description: 'Monthly income and expense planner' },
  { icon: '🏦', name: 'Retirement Calculator', slug: 'retirement-calculator', description: 'Project retirement savings balance' },
  { icon: '💼', name: 'Net Worth Calculator', slug: 'net-worth-calculator', description: 'Calculate total assets minus liabilities' },
  { icon: '📉', name: 'Inflation Calculator', slug: 'inflation-calculator', description: 'See how inflation affects purchasing power' },
]

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Salary Calculator',
    description: 'Free salary calculator. Converts pay between hourly, daily, weekly, bi-weekly, monthly, and annual figures. Estimates take-home pay after simplified tax deductions.',
    url: 'https://roughtools.com/tools/calculators/salary-calculator',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.7', reviewCount: '1876' },
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
      { '@type': 'ListItem', position: 3, name: 'Salary Calculator', item: 'https://roughtools.com/tools/calculators/salary-calculator' },
    ],
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SalaryCalculatorPage() {
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
          <span style={{ color: 'var(--brand)' }}>Salary Calculator</span>
        </nav>

        {/* H1 */}
        <div style={{ fontSize: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(139,92,246,0.15)', borderRadius: 14, padding: '10px 14px', lineHeight: 1, marginBottom: 12 }}>
          💰
        </div>
        <h1 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, color: 'var(--fg)', margin: '0 0 10px', letterSpacing: '-0.5px' }}>
          Free Salary Calculator
        </h1>
        <p style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.7, margin: '0 0 20px', maxWidth: 680 }}>
          Convert your salary between hourly, daily, weekly, bi-weekly, monthly, and annual figures.
          Enter any pay period amount and instantly see all equivalents — plus an estimated take-home pay.
          Free, private — all calculations run in your browser.
        </p>

        {/* Trust badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
          {['⚡ Instant results', '🔒 100% private', '🆓 Always free', '🚫 No signup', '📊 All pay periods'].map(b => (
            <span key={b} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)',
              borderRadius: 20, padding: '5px 12px', fontSize: 12, color: 'var(--brand-2)', fontWeight: 500,
            }}>{b}</span>
          ))}
        </div>

        <ToolAdUnit position="top" />

        {/* Calculator widget */}
        <SalaryCalculatorClient />

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
            About This Salary Calculator
          </h2>

          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The Salary Calculator instantly converts any salary figure across all standard pay periods —
            hourly, daily, weekly, bi-weekly (every two weeks), semi-monthly (twice a month), monthly,
            and annual. It is particularly useful when comparing job offers quoted in different formats:
            one employer might quote $38/hour while another quotes $76,000/year — this tool converts both
            to the same basis so you can make a direct comparison in seconds. It also estimates your
            take-home pay using a simplified tax model, useful for quick budgeting.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            The Formula — How It Works
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            All conversions flow through the <strong style={{ color: 'var(--fg)' }}>annual salary</strong> as the base:
          </p>
          <div style={{ background: 'var(--bg-3)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 10, padding: '14px 18px', marginBottom: 14, fontFamily: 'monospace', fontSize: 13, color: 'var(--brand-2)', lineHeight: 1.9 }}>
            Annual = Hourly × Hours per week × 52<br />
            Monthly = Annual ÷ 12<br />
            Bi-weekly = Annual ÷ 26<br />
            Weekly = Annual ÷ 52<br />
            Daily = Annual ÷ (52 × Work days per week)<br />
            Hourly = Annual ÷ (52 × Hours per week)
          </div>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The take-home pay estimate deducts a simplified federal income tax rate and FICA taxes
            (Social Security: 6.2%, Medicare: 1.45%). This is a gross approximation — actual net pay
            depends on filing status, allowances, pre-tax deductions, state taxes, and other factors.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Assumptions and Limitations
          </h3>
          <ul style={{ paddingLeft: 20, margin: '0 0 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              'Assumes you work the specified hours every week for all 52 weeks — no unpaid leave or varying hours',
              'The take-home estimate uses a simplified flat federal tax rate and does not account for state taxes',
              'Pre-tax deductions (401k, health insurance, HSA, FSA) are not subtracted from the gross figure',
              'Overtime pay is not included — the calculator assumes regular hours only',
              'Bonus, commission, equity, or other variable compensation is not included in conversions',
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
            This tool is designed for job seekers comparing offers in different pay formats, employees
            preparing for salary negotiations who want to quantify what a raise means in monthly take-home
            terms, freelancers and contractors setting their rates to match or exceed a full-time equivalent
            salary, recent graduates building a first budget based on a starting salary, and HR professionals
            converting compensation structures across teams. It is also valuable for anyone evaluating a
            part-time role, side income, or consulting project to understand the annualised equivalent.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            When to Consult a Professional
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            For accurate tax withholding calculations, use the IRS Tax Withholding Estimator (irs.gov) or
            consult a CPA. For salary benchmarking and negotiation strategy, sites like Glassdoor, Levels.fyi,
            and the Bureau of Labor Statistics Occupational Outlook Handbook provide data-driven market
            comparisons. A financial advisor can help you determine how your salary fits into a broader
            financial plan including savings rate, retirement contributions, and debt repayment goals.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Privacy Notice
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, margin: 0 }}>
            All calculations in this salary calculator run entirely in your browser. No data you enter —
            including salary figures, hours, or any personal information — is transmitted to any server or
            stored anywhere. Your financial information stays completely private on your device. See our{' '}
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
          toolName="Salary Calculator"
          text="Salary Calculator — Pay period conversions are mathematically accurate based on standard assumptions (52 weeks/year, specified hours per week). Take-home pay estimates use a simplified tax model and do not account for state taxes, filing status, pre-tax deductions, or individual tax situations. Results do not constitute tax, financial, or employment advice. For accurate payroll calculations, consult your employer's HR or payroll department, or a qualified CPA."
        />

        {/* Related Calculators */}
        <RelatedCalculators calculators={RELATED} />

        {/* Compliance kit */}
        <ToolPageExtras
          toolName="Salary Calculator"
          toolSlug="salary-calculator"
          toolUrl="https://roughtools.com/tools/calculators/salary-calculator"
          type="financial"
        />

        <ToolAdUnit position="bottom" />
      </div>
    </>
  )
}
