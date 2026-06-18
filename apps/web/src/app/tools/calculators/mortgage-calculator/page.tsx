import type { Metadata } from 'next';
import MortgageCalculatorClient from './MortgageCalculatorClient';
import ToolAdUnit from '@/components/ToolAdUnit';
import { JsonLd } from '@/components/JsonLd';
import { getCalcSEO } from '../_components/calc-seo-configs';
import { ToolPageExtras } from '@/components/ToolPageExtras';
import {
  ProTipsSection,
  WhenToUseCards,
  QuickReferenceTable,
  CalculatorFAQ,
  RelatedCalculators,
  FinancialDisclaimerBox,
} from '@/components/tools/CalculatorSections';

// ─── Metadata ────────────────────────────────────────────────────────────────

const _seo = getCalcSEO('mortgage-calculator');
export const metadata: Metadata = {
  title: _seo?.seoTitle ?? 'Free Mortgage Calculator — Monthly Payment & Amortization | RoughTools',
  description:
    _seo?.metaDescription ??
    'Calculate monthly mortgage payments, total interest, and amortization schedule. Enter home price, down payment, rate, and loan term. Free, instant, no signup required.',
  keywords: [
    'mortgage calculator',
    'home loan calculator',
    'monthly mortgage payment',
    'amortization calculator',
    'house payment calculator',
    'free mortgage calculator',
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/calculators/mortgage-calculator' },
  openGraph: {
    title: 'Free Mortgage Calculator — Monthly Payment & Amortization | RoughTools',
    description:
      'Calculate monthly mortgage payments and full amortization schedule. Free, instant, no signup.',
    url: 'https://roughtools.com/tools/calculators/mortgage-calculator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Mortgage Calculator | RoughTools',
    description: 'Calculate monthly mortgage payments and amortization schedule. Free, instant.',
  },
};

// ─── FAQ data (12 questions — accordion) ─────────────────────────────────────

const FAQS = [
  {
    q: 'How accurate is this mortgage calculator?',
    a: "The calculator is mathematically precise for principal and interest payments using the standard mortgage formula. However, your actual monthly payment will likely be higher because it will include property taxes, homeowner's insurance, and possibly PMI — none of which are included here. Use this tool for payment estimates and comparisons, not as a final lending figure.",
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
    q: 'Should I consult a mortgage professional?',
    a: "Absolutely — before committing to any mortgage. A mortgage broker or loan officer can provide official loan estimates with actual rates, closing costs, and terms. A financial advisor or HUD-approved housing counsellor can help assess affordability. This calculator gives you a solid starting point, but your lender's loan estimate is the definitive number.",
  },
  {
    q: 'What formula does this calculator use?',
    a: 'The standard mortgage amortisation formula: M = P × [r(1+r)ⁿ] / [(1+r)ⁿ−1], where M is the monthly payment, P is the principal loan amount (home price minus down payment), r is the monthly interest rate (annual rate ÷ 12), and n is the total number of monthly payments (loan term in years × 12).',
  },
  {
    q: 'Does this calculator include property tax and insurance?',
    a: "No. This calculator computes principal and interest (P&I) only. Your true monthly housing cost will also include property taxes (typically 1–2% of home value per year, divided by 12), homeowner's insurance (~$100–$200/month), and PMI if your down payment is under 20% (~0.5–1% of loan value per year). Add these to the calculator's result for a more complete estimate.",
  },
  {
    q: 'What is considered a good mortgage interest rate?',
    a: 'A "good" rate depends on the current market environment, your credit score, loan type, and down payment size. As a benchmark: borrowers with credit scores above 760 typically qualify for the best rates available. Rates fluctuate with the Federal Reserve\'s monetary policy and bond markets. Check multiple lenders — even a 0.25% difference can save tens of thousands over a 30-year loan.',
  },
  {
    q: 'Should I choose a 15-year or 30-year mortgage?',
    a: 'It depends on your financial goals. A 15-year mortgage has higher monthly payments but significantly lower total interest — often saving $100,000+ over the loan life. A 30-year mortgage has lower monthly payments, giving you more cash flow flexibility. Many financial advisors recommend the 30-year if you invest the difference; however, the forced savings of a 15-year suits many people better in practice.',
  },
  {
    q: 'How much down payment do I need to avoid PMI?',
    a: 'A down payment of 20% or more of the purchase price typically eliminates the need for Private Mortgage Insurance (PMI). PMI protects the lender (not you) and typically costs 0.5–1% of the loan amount per year — adding $100–$250/month to a $300,000 loan. If you put down less than 20%, you can request PMI cancellation once your equity reaches 20% of the original appraised value.',
  },
];

// ─── Pro Tips ─────────────────────────────────────────────────────────────────

const PRO_TIPS = [
  'A 1% difference in interest rate on a $300,000 mortgage adds up to roughly $60,000 in additional interest over a 30-year loan. Shopping three or more lenders takes a few hours but could save you that amount. Always compare the APR (which includes fees), not just the stated interest rate.',
  'Adding just $100 extra to your monthly mortgage payment on a $300,000 loan at 7% for 30 years cuts 4.5 years off your loan and saves approximately $52,000 in interest. Even small extra principal payments, made consistently, have a dramatic compounding effect on your payoff timeline.',
  'A 20% down payment does more than eliminate PMI — it also means a smaller loan, lower monthly payment, and potentially a better interest rate. If you cannot reach 20% immediately, an 80-10-10 piggyback loan (80% first mortgage, 10% second mortgage, 10% down) can sometimes avoid PMI while requiring less cash upfront.',
  'Get pre-approved by at least three lenders before making an offer on a home. Each lender may offer different rates, points structures, and fee packages. A mortgage broker can shop multiple lenders for you simultaneously, often at no cost to you, since lenders pay their commission.',
];

// ─── When to Use ─────────────────────────────────────────────────────────────

const WHEN_TO_USE = [
  {
    icon: '🏠',
    title: 'First-time home buyer',
    description:
      'Enter different home prices and down payments to see what monthly payment fits your budget before you start shopping, so you know your real purchasing range.',
  },
  {
    icon: '🔄',
    title: 'Refinancing decision',
    description:
      'Compare your current payment to a new rate and term to see how much you would save monthly and over the remaining life of your loan after refinancing.',
  },
  {
    icon: '⚖️',
    title: 'Comparing loan terms',
    description:
      'Run the same loan amount at 15 years vs. 30 years to instantly see the monthly payment difference and total interest saved — a crucial trade-off calculation.',
  },
  {
    icon: '📊',
    title: 'Affordability check',
    description:
      'Work backwards from your target monthly payment to find the maximum home price you can afford at current interest rates — before talking to a lender.',
  },
  {
    icon: '🏘️',
    title: 'Rental property analysis',
    description:
      'Calculate the mortgage payment on a potential investment property to determine whether rental income will cover financing costs and produce positive cash flow.',
  },
];

// ─── Quick Reference table ────────────────────────────────────────────────────

const QUICK_REF = [
  { input: 'Home Price', description: 'Total purchase price of the property', example: '$400,000' },
  {
    input: 'Down Payment',
    description: 'Upfront payment; loan = Home Price − Down Payment',
    example: '$80,000 (20%)',
  },
  {
    input: 'Annual Interest Rate',
    description: 'Quoted annual mortgage rate from your lender',
    example: '7.0%',
  },
  { input: 'Loan Term', description: 'Length of the mortgage in years', example: '30 years' },
  {
    input: 'Monthly Payment (P&I)',
    description: 'M = P × [r(1+r)ⁿ] / [(1+r)ⁿ−1]',
    example: '$2,129/month',
  },
  {
    input: 'Total Interest Paid',
    description: 'Sum of all interest over the full loan term',
    example: '$126,440',
  },
  {
    input: 'Total Amount Paid',
    description: 'Principal + all interest over the loan life',
    example: '$446,440',
  },
];

// ─── Related calculators ──────────────────────────────────────────────────────

const RELATED = [
  {
    icon: '💳',
    name: 'Loan Calculator',
    slug: 'loan-calculator',
    description: 'Monthly payment for any loan type',
  },
  {
    icon: '💸',
    name: 'Debt Payoff Calculator',
    slug: 'debt-payoff-calculator',
    description: 'Plan debt-free date for all debts',
  },
  {
    icon: '💼',
    name: 'Net Worth Calculator',
    slug: 'net-worth-calculator',
    description: 'Assets minus liabilities tracker',
  },
  {
    icon: '📋',
    name: 'Budget Calculator',
    slug: 'budget-calculator',
    description: 'Monthly income and expense planner',
  },
  {
    icon: '📈',
    name: 'Compound Interest Calculator',
    slug: 'compound-interest-calculator',
    description: 'See how savings grow over time',
  },
];

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Mortgage Calculator',
    description:
      'Free mortgage calculator. Computes monthly principal and interest payments, total interest, and full amortisation schedule for any home loan.',
    url: 'https://roughtools.com/tools/calculators/mortgage-calculator',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
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
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Calculators',
        item: 'https://roughtools.com/tools/calculators',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Mortgage Calculator',
        item: 'https://roughtools.com/tools/calculators/mortgage-calculator',
      },
    ],
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MortgageCalculatorPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px 80px' }}>
        {/* Breadcrumb */}
        <nav
          style={{ fontSize: 13, color: 'var(--fg-2)', marginBottom: 20 }}
          aria-label="Breadcrumb"
        >
          <a href="/" style={{ color: 'var(--fg-2)' }}>
            Home
          </a>
          {' › '}
          <a href="/tools/calculators" style={{ color: 'var(--fg-2)' }}>
            Calculators
          </a>
          {' › '}
          <span style={{ color: 'var(--brand)' }}>Mortgage Calculator</span>
        </nav>

        {/* H1 */}
        <div
          style={{
            fontSize: 36,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(139,92,246,0.15)',
            borderRadius: 14,
            padding: '10px 14px',
            lineHeight: 1,
            marginBottom: 12,
          }}
        >
          🏠
        </div>
        <h1
          style={{
            fontSize: 'clamp(22px,4vw,32px)',
            fontWeight: 800,
            color: 'var(--fg)',
            margin: '0 0 10px',
            letterSpacing: '-0.5px',
          }}
        >
          Free Mortgage Calculator
        </h1>
        <p
          style={{
            color: 'var(--fg-2)',
            fontSize: 15,
            lineHeight: 1.7,
            margin: '0 0 20px',
            maxWidth: 680,
          }}
        >
          Calculate your monthly mortgage payment, total interest cost, and full amortisation
          schedule. Enter your home price, down payment, interest rate, and loan term. Free, private
          — all calculations run in your browser.
        </p>

        {/* Trust badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
          {[
            '⚡ Instant results',
            '🔒 100% private',
            '🆓 Always free',
            '🚫 No signup',
            '📊 Financially accurate',
          ].map((b) => (
            <span
              key={b}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                background: 'rgba(139,92,246,0.12)',
                border: '1px solid rgba(139,92,246,0.25)',
                borderRadius: 20,
                padding: '5px 12px',
                fontSize: 12,
                color: 'var(--brand-2)',
                fontWeight: 500,
              }}
            >
              {b}
            </span>
          ))}
        </div>

        <ToolAdUnit position="top" />

        {/* Calculator widget */}
        <MortgageCalculatorClient />

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
          <h2
            id="about-heading"
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: 'var(--fg)',
              marginTop: 0,
              marginBottom: 16,
            }}
          >
            About This Mortgage Calculator
          </h2>

          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The Mortgage Calculator computes your estimated monthly principal and interest payment
            for any home loan, and shows you the full amortisation schedule — how every dollar of
            every payment is split between repaying the loan balance and paying the lender&apos;s
            interest charge. For most people, a mortgage is the largest financial commitment of
            their lives, which makes understanding the true cost of different loan scenarios
            essential before signing anything.
          </p>

          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--brand-2)',
              margin: '20px 0 10px',
            }}
          >
            The Formula — How It Works
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            Monthly mortgage payments are calculated using the{' '}
            <strong style={{ color: 'var(--fg)' }}>standard amortising loan formula</strong>:
          </p>
          <div
            style={{
              background: 'var(--bg-3)',
              border: '1px solid rgba(139,92,246,0.25)',
              borderRadius: 10,
              padding: '14px 18px',
              marginBottom: 14,
              fontFamily: 'monospace',
              fontSize: 13,
              color: 'var(--brand-2)',
            }}
          >
            M = P × [r(1+r)ⁿ] / [(1+r)ⁿ−1]
          </div>
          <p style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            Where: <strong style={{ color: '#c4caff' }}>M</strong> = monthly payment,{' '}
            <strong style={{ color: '#c4caff' }}>P</strong> = principal loan amount (home price
            minus down payment), <strong style={{ color: '#c4caff' }}>r</strong> = monthly interest
            rate (annual rate ÷ 12), <strong style={{ color: '#c4caff' }}>n</strong> = total number
            of payments (years × 12).
          </p>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            For example, a $320,000 loan at 7% for 30 years: r = 0.07/12 = 0.005833, n = 360, giving
            M = $320,000 × [0.005833 × (1.005833)³⁶⁰] / [(1.005833)³⁶⁰ − 1] ={' '}
            <strong style={{ color: 'var(--fg)' }}>$2,129/month</strong>. Total paid over 30 years:
            $766,440 — of which $446,440 is interest.
          </p>

          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--brand-2)',
              margin: '20px 0 10px',
            }}
          >
            Assumptions and Limitations
          </h3>
          <ul
            style={{
              paddingLeft: 20,
              margin: '0 0 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            {[
              'Only principal and interest are calculated — property taxes, insurance, HOA fees, and PMI are not included',
              'This assumes a fixed interest rate for the entire loan term (not applicable to adjustable-rate mortgages)',
              'Closing costs (typically 2–5% of the loan amount) are not factored in',
              'Extra payments or lump-sum payments that could accelerate payoff are not modelled',
              'Results are illustrative estimates — your actual loan offer from a lender may differ',
            ].map((item, i) => (
              <li key={i} style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                <span style={{ color: '#8b5cf6', marginRight: 8 }}>•</span>
                {item}
              </li>
            ))}
          </ul>

          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--brand-2)',
              margin: '20px 0 10px',
            }}
          >
            Who Should Use This Calculator
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            This tool is ideal for first-time home buyers who want to understand how much house they
            can afford before speaking to a lender. Existing homeowners considering refinancing can
            quickly compare their current payment to a new rate scenario. Real estate investors can
            assess whether a property&apos;s rental income will cover its financing costs. Anyone
            comparing different loan structures — 15-year vs. 30-year, different down payment
            amounts, or different interest rates — can use this tool to instantly quantify the
            financial trade-offs.
          </p>

          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--brand-2)',
              margin: '20px 0 10px',
            }}
          >
            When to Consult a Professional
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            Before purchasing or refinancing a home, consult a licensed mortgage broker or loan
            officer for official loan estimates. A HUD-approved housing counsellor (find one at
            hud.gov) can help first-time buyers understand the full cost of homeownership including
            taxes, maintenance, and insurance. A financial advisor can help you decide whether
            buying vs. renting makes sense for your long-term financial picture.
          </p>

          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--brand-2)',
              margin: '20px 0 10px',
            }}
          >
            Privacy Notice
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, margin: 0 }}>
            All calculations in this mortgage calculator run entirely in your browser. No data you
            enter — home price, down payment, income, or interest rate — is transmitted to any
            server or stored anywhere. Your financial information stays completely private on your
            device. See our{' '}
            <a href="/privacy" style={{ color: '#8b5cf6', textDecoration: 'underline' }}>
              Privacy Policy
            </a>{' '}
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
          toolName="Mortgage Calculator"
          text="Mortgage Calculator — Results show principal and interest only and do not include property taxes, homeowner's insurance, PMI, HOA fees, or closing costs. Results are estimates for planning purposes and do not constitute mortgage, financial, or legal advice. Actual loan terms, rates, and payments will be determined by your lender. Always consult a licensed mortgage professional and review your official loan estimate before making any home purchase or refinancing decision."
        />

        {/* Related Calculators */}
        <RelatedCalculators calculators={RELATED} />

        {/* Compliance kit */}
        <ToolPageExtras
          toolName="Mortgage Calculator"
          toolSlug="mortgage-calculator"
          toolUrl="https://roughtools.com/tools/calculators/mortgage-calculator"
          type="financial"
        />

        <ToolAdUnit position="bottom" />
      </div>
    </>
  );
}
