import type { Metadata } from 'next'
import TaxCalculator from '@/components/tools/calculators/TaxCalculator'
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

const _seo = getCalcSEO('tax-calculator')
export const metadata: Metadata = {
  title: _seo?.seoTitle ?? 'Free Tax Calculator — Estimate Income Tax & Take-Home Pay | RoughTools',
  description: _seo?.metaDescription ?? 'Estimate your income tax, effective tax rate, and take-home pay in seconds. Simplified US tax estimator — free, instant, no signup required.',
  keywords: ['income tax calculator', 'tax calculator', 'take home pay calculator', 'salary after tax', 'effective tax rate calculator', 'free tax calculator'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/calculators/tax-calculator' },
  openGraph: {
    title: 'Free Tax Calculator — Estimate Income Tax & Take-Home Pay | RoughTools',
    description: 'Estimate your income tax and take-home pay instantly. Free, private, no signup.',
    url: 'https://roughtools.com/tools/calculators/tax-calculator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Tax Calculator | RoughTools',
    description: 'Estimate income tax, take-home pay, and effective tax rate. Free, instant.',
  },
}

// ─── FAQ data (12 questions — accordion) ─────────────────────────────────────

const FAQS = [
  {
    q: 'How accurate is this tax calculator?',
    a: 'This calculator provides a simplified estimate using an effective (flat) rate approach, not actual progressive tax brackets. Real US federal taxes use multiple brackets where different portions of income are taxed at different rates. The result here is a useful ballpark — not a filing-ready calculation. For precise tax liability, use IRS-approved tax software or consult a tax professional.',
  },
  {
    q: 'Is my data private — is anything stored?',
    a: 'Yes, completely private. All calculations run entirely in your browser using JavaScript. No income figures, filing status, or other data you enter are transmitted to any server, stored in a database, or shared with third parties. When you close the tab, your inputs are gone.',
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
    q: 'Should I use this for actually filing my taxes?',
    a: 'No. This tool is an estimator for planning purposes only. For filing, use IRS-approved tax software (TurboTax, H&R Block, FreeTaxUSA, etc.) or a licensed CPA. Tax filing requires exact bracket calculations, credits, deductions, state taxes, and additional schedules this tool does not model.',
  },
  {
    q: 'What formula does this calculator use?',
    a: 'This calculator uses a simplified effective-rate model: Estimated Tax = Gross Income × Effective Rate%. Take-Home Pay = Gross Income − Estimated Tax. The effective rate is the single blended rate applied across all income. Real taxes use progressive brackets where portions of income are taxed at 10%, 12%, 22%, 24%, etc., resulting in a lower actual effective rate than the marginal rate.',
  },
  {
    q: 'What is the difference between marginal and effective tax rate?',
    a: 'Your marginal tax rate is the rate applied to your last dollar of income (e.g., 22% if your income falls in the 22% bracket). Your effective tax rate is your total tax ÷ total income — always lower than marginal because lower income tiers are taxed at lower rates. For example, someone in the 22% bracket might have an effective rate of only 14–16%.',
  },
  {
    q: 'What deductions lower my taxable income?',
    a: "Deductions reduce your taxable income before calculating tax. Common deductions include: the standard deduction (taken by most filers), mortgage interest, state and local taxes (SALT, capped at $10,000), charitable donations, student loan interest, and business expenses for self-employed individuals. You choose either the standard deduction or itemized deductions — whichever is larger.",
  },
  {
    q: 'What is the standard deduction for 2024?',
    a: 'For tax year 2024, the standard deduction is $14,600 for single filers and married filing separately, $29,200 for married filing jointly, and $21,900 for heads of household. These amounts are adjusted annually for inflation. If your itemized deductions exceed these thresholds, itemizing saves you more.',
  },
  {
    q: 'When should I consult a CPA or tax professional?',
    a: 'You should consult a CPA or enrolled agent if you: are self-employed or have freelance income, have investment gains or rental income, experienced major life changes (marriage, divorce, new child, inheritance), own a business, have foreign income, or owe back taxes. A professional can identify credits and deductions that significantly lower your bill and ensure compliance with current tax law.',
  },
]

// ─── Pro Tips ─────────────────────────────────────────────────────────────────

const PRO_TIPS = [
  'Maximise your 401(k) or IRA contributions to reduce taxable income. For 2024, the 401(k) limit is $23,000 ($30,500 if age 50+). Every dollar you contribute to a traditional 401(k) reduces your taxable income by that amount — potentially dropping you into a lower bracket and saving hundreds or thousands in taxes.',
  'Know the difference between your effective and marginal tax rate. Your marginal rate (e.g., 22%) applies only to income in that bracket — not your entire income. Your effective rate (total tax ÷ total income) is typically 5–10 percentage points lower. Use effective rate for financial planning and budgeting, not marginal rate.',
  'Track deductible expenses year-round, not just at tax season. Keep records of charitable donations, business mileage, home office use, and medical expenses as they happen. Most people miss deductions simply because they have no receipts in April. A simple spreadsheet or app like Expensify makes year-round tracking effortless.',
  'Compare your tax withholding to your estimated liability each quarter. If you are self-employed or have additional income (freelance, investments, rentals), you may owe estimated quarterly taxes. Underpaying by more than $1,000 triggers IRS penalties. Use this calculator to estimate your annual liability, then divide by 4 for quarterly payments.',
]

// ─── When to Use ─────────────────────────────────────────────────────────────

const WHEN_TO_USE = [
  {
    icon: '💼',
    title: 'Salary negotiation',
    description: 'Before accepting a job offer, estimate your take-home pay at different salary levels to understand what a $5,000 or $10,000 salary difference actually means after tax.',
  },
  {
    icon: '🧑‍💻',
    title: 'Freelance income planning',
    description: 'Self-employed? Estimate how much of each invoice you should set aside for taxes so you are never caught short at quarterly payment time.',
  },
  {
    icon: '🏖️',
    title: 'Retirement income tax planning',
    description: 'Estimate the tax impact of 401(k) withdrawals, Social Security income, or pension payments in retirement to project your real net income.',
  },
  {
    icon: '📈',
    title: 'Comparing investment tax implications',
    description: 'Model the after-tax impact of selling investments, receiving a bonus, or converting a traditional IRA to a Roth IRA to understand the immediate tax cost.',
  },
  {
    icon: '📋',
    title: 'Annual budget planning',
    description: 'Build your household budget using take-home pay rather than gross income to avoid the common budgeting mistake of planning with pre-tax dollars.',
  },
]

// ─── Quick Reference table ────────────────────────────────────────────────────

const QUICK_REF = [
  { input: 'Annual Income', description: 'Your total gross income before any deductions or taxes', example: '$75,000' },
  { input: 'Tax Rate', description: 'Effective (blended) rate used to estimate total tax', example: '22%' },
  { input: 'Estimated Tax', description: 'Income × Rate% — simplified total tax estimate', example: '$16,500' },
  { input: 'Take-Home Pay', description: 'Income minus estimated tax (annual and monthly)', example: '$58,500/yr · $4,875/mo' },
  { input: 'Effective Rate', description: 'Total tax ÷ total income — your real blended rate', example: '~14–18% typically' },
]

// ─── Related calculators ──────────────────────────────────────────────────────

const RELATED = [
  { icon: '💰', name: 'Salary Calculator', slug: 'salary-calculator', description: 'Hourly, weekly, monthly, annual conversions' },
  { icon: '🏦', name: 'Retirement Calculator', slug: 'retirement-calculator', description: 'Project savings balance and monthly income' },
  { icon: '📋', name: 'Budget Calculator', slug: 'budget-calculator', description: 'Monthly income and expense planner' },
  { icon: '📉', name: 'Inflation Calculator', slug: 'inflation-calculator', description: 'How inflation erodes purchasing power' },
  { icon: '📊', name: 'Net Worth Calculator', slug: 'net-worth-calculator', description: 'Assets minus liabilities — your true wealth' },
]

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Tax Calculator',
    description: 'Free income tax estimator. Calculates estimated tax, effective rate, and take-home pay based on gross income.',
    url: 'https://roughtools.com/tools/calculators/tax-calculator',
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
      { '@type': 'ListItem', position: 3, name: 'Tax Calculator', item: 'https://roughtools.com/tools/calculators/tax-calculator' },
    ],
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TaxCalculatorPage() {
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
          <span style={{ color: 'var(--brand)' }}>Tax Calculator</span>
        </nav>

        {/* H1 */}
        <div style={{ fontSize: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(139,92,246,0.15)', borderRadius: 14, padding: '10px 14px', lineHeight: 1, marginBottom: 12 }}>
          🧾
        </div>
        <h1 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, color: 'var(--fg)', margin: '0 0 10px', letterSpacing: '-0.5px' }}>
          Free Tax Calculator
        </h1>
        <p style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.7, margin: '0 0 20px', maxWidth: 680 }}>
          Estimate your income tax, effective tax rate, and take-home pay.
          Enter your gross income and an estimated tax rate to see your annual and monthly net pay.
          Free, private — all calculations run in your browser.
        </p>

        {/* Trust badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
          {['⚡ Instant results', '🔒 100% private', '🆓 Always free', '🚫 No signup', '📊 Estimate only — not for filing'].map(b => (
            <span key={b} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)',
              borderRadius: 20, padding: '5px 12px', fontSize: 12, color: 'var(--brand-2)', fontWeight: 500,
            }}>{b}</span>
          ))}
        </div>

        <ToolAdUnit position="top" />

        {/* Calculator widget */}
        <TaxCalculator />

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
            About This Tax Calculator
          </h2>

          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            This Tax Calculator is a simplified income tax estimator designed to give you a fast, clear picture of your
            estimated tax burden and take-home pay. It is ideal for salary planning, budgeting, and financial modelling —
            not for preparing or filing a tax return. For actual tax filing, always use IRS-approved tax software or consult
            a qualified tax professional.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            The Formula — How It Works
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            This calculator uses a simplified <strong style={{ color: 'var(--fg)' }}>effective tax rate model</strong>, which applies a single blended rate to your total income rather than the real US progressive bracket system. This is intentional for speed and simplicity:
          </p>
          <div style={{ background: 'var(--bg-3)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 10, padding: '14px 18px', marginBottom: 14, fontFamily: 'monospace', fontSize: 13, color: 'var(--brand-2)' }}>
            Estimated Tax = Gross Income × Effective Rate%<br />
            Take-Home Pay = Gross Income − Estimated Tax<br />
            Monthly Take-Home = Annual Take-Home ÷ 12
          </div>
          <p style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            In reality, US federal income taxes are <strong style={{ color: '#c4caff' }}>progressive</strong> — only the portion of income within each bracket is taxed at that bracket&apos;s rate. For 2024, the brackets for single filers are: 10% (up to $11,600), 12% ($11,601–$47,150), 22% ($47,151–$100,525), 24% ($100,526–$191,950), 32% ($191,951–$243,725), 35% ($243,726–$609,350), and 37% above $609,350. This means a $100,000 income is not all taxed at 22% — the effective rate is closer to 16–17%.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Assumptions and Limitations
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 10 }}>
            This tool makes the following simplifications. Understanding them helps you interpret results correctly:
          </p>
          <ul style={{ paddingLeft: 20, margin: '0 0 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              'Uses effective rate — not the actual US progressive bracket system',
              'Does not account for the standard deduction or itemised deductions',
              'Does not model state income taxes (which range from 0% to 13%+ depending on state)',
              'Does not include FICA taxes (Social Security 6.2%, Medicare 1.45%) or self-employment tax',
              'Does not account for tax credits (Child Tax Credit, Earned Income Credit, etc.)',
              'Does not differentiate between filing statuses (single, married filing jointly, etc.)',
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
            This tool is for anyone who wants a quick tax snapshot for planning purposes: employees comparing job offers,
            freelancers estimating quarterly tax set-asides, retirees modelling withdrawal tax impact, or anyone building
            a household budget from net pay rather than gross income. It is also useful for financial educators and students
            learning how income taxes work in a simple, approachable way.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            When to Consult a Tax Professional
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            <strong style={{ color: 'var(--fg)' }}>Always consult a qualified tax professional before making major financial decisions based on tax considerations.</strong>{' '}
            A CPA (Certified Public Accountant) or enrolled agent can prepare your taxes accurately, identify deductions and
            credits specific to your situation, and ensure full compliance with current tax law. The IRS offers a free
            tax return preparation service called <strong style={{ color: 'var(--fg)' }}>VITA</strong> (Volunteer Income Tax Assistance) for individuals earning under ~$67,000. You can find a local VITA site at irs.gov.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Privacy Notice
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, margin: 0 }}>
            All calculations in this tax calculator are performed entirely in your browser. No income figures, filing
            status, or any other data you enter are transmitted to any server, stored in any database, or shared with
            third parties. Your financial information stays completely private on your device. See our{' '}
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
          toolName="Tax Calculator"
          text="Tax Calculator — Results are simplified estimates based on an effective-rate model and do not constitute tax, financial, or legal advice. This tool does not replicate the US progressive tax bracket system, account for deductions, credits, state taxes, or FICA contributions. Do not use this calculator for tax filing. Actual tax liability will differ. Consult a licensed CPA, enrolled agent, or tax attorney before making tax-related financial decisions."
        />

        {/* Related Calculators */}
        <RelatedCalculators calculators={RELATED} />

        {/* Compliance kit */}
        <ToolPageExtras
          toolName="Tax Calculator"
          toolSlug="tax-calculator"
          toolUrl="https://roughtools.com/tools/calculators/tax-calculator"
          type="financial"
        />

        <ToolAdUnit position="bottom" />
      </div>
    </>
  )
}
