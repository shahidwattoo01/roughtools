import type { Metadata } from 'next';
import ToolAdUnit from '@/components/ToolAdUnit';
import { JsonLd } from '@/components/JsonLd';
import LoanCalculatorClient from './LoanCalculatorClient';
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

const _seo = getCalcSEO('loan-calculator');
export const metadata: Metadata = {
  title: _seo?.seoTitle ?? 'Free Loan Calculator — Monthly Payment & Amortization | RoughTools',
  description:
    _seo?.metaDescription ??
    'Calculate monthly loan payments, total interest, and full amortization schedule for any loan. Free loan calculator — no signup required.',
  keywords: [
    'loan calculator',
    'loan payment calculator',
    'amortization calculator',
    'monthly payment calculator',
    'personal loan calculator',
    'free loan calculator',
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/calculators/loan-calculator' },
  openGraph: {
    title: 'Free Loan Calculator — Monthly Payment & Amortization | RoughTools',
    description:
      'Calculate monthly loan payments and amortization schedule for any loan. Free, instant, no signup.',
    url: 'https://roughtools.com/tools/calculators/loan-calculator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Loan Calculator | RoughTools',
    description: 'Calculate monthly loan payments and amortization schedule. Free, instant.',
  },
};

// ─── FAQ data (12 questions — accordion) ─────────────────────────────────────

const FAQS = [
  {
    q: 'How accurate is this loan calculator?',
    a: 'The calculator is mathematically accurate for fixed-rate loans using the standard amortisation formula. Results reflect principal and interest only — origination fees, application fees, insurance, and other charges are not included. For an exact payment amount, request a loan estimate from your lender, which is legally required to disclose all costs.',
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
    q: 'Should I consult a financial professional before taking out a loan?',
    a: 'Yes — especially for large loans. A financial advisor can help you determine whether taking on debt makes sense for your overall financial picture. For mortgages and auto loans, compare offers from multiple lenders. For personal loans, check your credit union as rates are often lower than banks. This calculator is for planning and comparison only.',
  },
  {
    q: 'What formula does this calculator use?',
    a: 'The standard amortising loan formula: M = P × [r(1+r)ⁿ] / [(1+r)ⁿ−1], where M is the monthly payment, P is the principal loan amount, r is the monthly interest rate (annual rate ÷ 12), and n is the total number of monthly payments (loan term in years × 12). This formula is used for all fixed-rate instalment loans.',
  },
  {
    q: 'What is an amortisation schedule and why does it matter?',
    a: 'An amortisation schedule shows exactly how each monthly payment is split between principal repayment and interest. In the early months of a loan, the majority of each payment goes toward interest. Over time, as the principal decreases, less interest accrues and more of each payment goes toward principal. Understanding this helps you see the true benefit of extra payments — every dollar of extra principal paid early saves a disproportionate amount in future interest.',
  },
  {
    q: 'How much do extra payments save?',
    a: 'Significantly more than most people expect. On a $20,000 personal loan at 10% for 5 years, making one extra payment per year reduces the term by roughly 6 months and saves ~$600 in interest. On a $30,000 car loan at 8% for 6 years, an extra $50/month saves ~$1,800 in interest and pays off the loan nearly a year early. The earlier you make extra payments, the more interest you avoid.',
  },
  {
    q: 'Are fees and other charges included in this calculator?',
    a: "No. This calculator uses the interest rate to compute principal and interest only. In practice, your loan's true cost includes origination fees (often 1–5% of the loan amount), prepayment penalties, late payment fees, and insurance products. The APR (Annual Percentage Rate) incorporates these costs into a single annual figure — always compare loans by APR, not just the stated interest rate.",
  },
  {
    q: 'What is the difference between a car loan and a personal loan?',
    a: 'A car loan (auto loan) is a secured loan — the vehicle serves as collateral, which typically means lower interest rates (6–12% for good credit). A personal loan is typically unsecured, meaning no collateral is required, but rates are higher (8–30% depending on credit). Auto loans are also usually only available for vehicle purchases, while personal loans can be used for almost any purpose. Both use the same amortisation formula.',
  },
];

// ─── Pro Tips ─────────────────────────────────────────────────────────────────

const PRO_TIPS = [
  'The monthly payment is not the true cost of a loan — the total interest paid is. A $25,000 personal loan at 12% for 5 years has a $556/month payment, but you pay $8,360 in interest on top of the $25,000. Always calculate total interest before agreeing to any loan to understand the real price.',
  'Even $50 extra per month toward principal makes a meaningful difference. On a $15,000 car loan at 9% for 60 months, an extra $50/month saves ~$800 in interest and cuts 7 months off the loan. Apply extra payments directly to principal by specifying this when paying (online banking usually has this option).',
  'Always compare loans by APR (Annual Percentage Rate), not the stated interest rate. APR includes origination fees and other charges, making it the true cost comparison metric. A loan with a 7% rate and a 2% origination fee has a higher effective APR than a loan quoted at 7.5% with no fees — especially for shorter-term loans.',
  'If you have multiple debts, the debt avalanche method saves the most money: list all debts by interest rate, pay minimums on all, then put any extra money toward the highest-rate debt first. This minimises total interest paid. The debt snowball method (lowest balance first) provides psychological motivation wins but costs more in interest.',
];

// ─── When to Use ─────────────────────────────────────────────────────────────

const WHEN_TO_USE = [
  {
    icon: '💳',
    title: 'Personal loan planning',
    description:
      'Calculate the exact monthly payment for a personal loan before applying, so you know whether it fits your budget and how much total interest you will pay.',
  },
  {
    icon: '🚗',
    title: 'Auto loan comparison',
    description:
      'Compare a 48-month vs. 60-month vs. 72-month car loan at the same rate to instantly see the monthly payment difference and how much extra each longer term costs in interest.',
  },
  {
    icon: '🎓',
    title: 'Student loan repayment',
    description:
      'Model your student loan repayment schedule to see your payoff date and total interest on the standard 10-year plan vs. accelerated payment scenarios.',
  },
  {
    icon: '⚖️',
    title: 'Comparing loan offers',
    description:
      'Enter the terms from two competing lender offers side-by-side (different rates or fees) to see which deal genuinely costs less over the full loan life.',
  },
  {
    icon: '🔗',
    title: 'Debt consolidation analysis',
    description:
      'Calculate whether consolidating multiple high-interest debts into a single lower-rate personal loan reduces your total monthly payment and total interest paid.',
  },
];

// ─── Quick Reference table ────────────────────────────────────────────────────

const QUICK_REF = [
  {
    input: 'Loan Amount',
    description: 'Total amount borrowed from the lender',
    example: '$20,000',
  },
  {
    input: 'Interest Rate',
    description: 'Annual interest rate quoted on the loan',
    example: '9.5%',
  },
  {
    input: 'Loan Term',
    description: 'Repayment period in months or years',
    example: '60 months (5 yr)',
  },
  {
    input: 'Monthly Payment',
    description: 'Fixed payment due each month: M = P × [r(1+r)ⁿ] / [(1+r)ⁿ−1]',
    example: '$419/month',
  },
  {
    input: 'Total Amount Paid',
    description: 'Monthly Payment × Total Number of Payments',
    example: '$25,140',
  },
  {
    input: 'Total Interest Paid',
    description: 'Total Paid minus original Loan Amount',
    example: '$5,140',
  },
];

// ─── Related calculators ──────────────────────────────────────────────────────

const RELATED = [
  {
    icon: '🏠',
    name: 'Mortgage Calculator',
    slug: 'mortgage-calculator',
    description: 'Monthly home loan payment estimator',
  },
  {
    icon: '💸',
    name: 'Debt Payoff Calculator',
    slug: 'debt-payoff-calculator',
    description: 'Snowball or avalanche debt payoff plan',
  },
  {
    icon: '💳',
    name: 'Credit Card Payoff Calculator',
    slug: 'credit-card-payoff-calculator',
    description: 'Pay off credit card debt faster',
  },
  {
    icon: '📈',
    name: 'Compound Interest Calculator',
    slug: 'compound-interest-calculator',
    description: 'See how savings grow over time',
  },
  {
    icon: '📋',
    name: 'Budget Calculator',
    slug: 'budget-calculator',
    description: 'Monthly income and expense planner',
  },
];

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Loan Calculator',
    description:
      'Free loan calculator. Computes monthly payments, total interest, and full amortisation schedule for personal loans, auto loans, student loans, and any fixed-rate instalment loan.',
    url: 'https://roughtools.com/tools/calculators/loan-calculator',
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
        name: 'Loan Calculator',
        item: 'https://roughtools.com/tools/calculators/loan-calculator',
      },
    ],
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LoanCalculatorPage() {
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
          <span style={{ color: 'var(--brand)' }}>Loan Calculator</span>
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
          💳
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
          Free Loan Calculator
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
          Calculate your monthly loan payment, total interest cost, and full amortisation schedule
          for any personal loan, auto loan, or student loan. Enter the loan amount, rate, and term.
          Free, private — all calculations run in your browser.
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
        <LoanCalculatorClient />

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
            About This Loan Calculator
          </h2>

          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The Loan Calculator computes the monthly payment, total amount paid, and total interest
            cost for any fixed-rate instalment loan — whether it&apos;s a personal loan, auto loan,
            student loan, boat loan, or any other fixed-term borrowing. It also generates the full
            amortisation schedule, showing exactly how each payment is divided between principal
            repayment and interest for every month of the loan term. Understanding this breakdown is
            essential for making informed borrowing decisions.
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
            Monthly loan payments are calculated using the{' '}
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
            <strong style={{ color: '#c4caff' }}>P</strong> = principal (loan amount),{' '}
            <strong style={{ color: '#c4caff' }}>r</strong> = monthly interest rate (annual rate ÷
            12), <strong style={{ color: '#c4caff' }}>n</strong> = total monthly payments (years ×
            12).
          </p>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            For each payment in the amortisation schedule, the interest portion = remaining balance
            × monthly rate, and the principal portion = monthly payment minus interest. This means
            early payments are heavily weighted toward interest, which is why extra early payments
            have such an outsized impact on total cost.
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
              'Assumes a fixed interest rate throughout the entire loan term — not applicable to variable-rate loans',
              'Does not include origination fees, application fees, prepayment penalties, or insurance products',
              "Results show APR-equivalent calculations — your lender's official APR will include all fees",
              'Assumes payments are made on time every month — late fees are not modelled',
              'Does not account for any lender-specific calculation conventions that may cause small rounding differences',
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
            This calculator is useful for anyone considering or managing a fixed-rate loan. If you
            are about to take out a personal loan, it helps you compare multiple offers in seconds
            by entering each lender&apos;s terms and seeing total interest side by side. If you are
            shopping for a car and weighing a 48-month vs. 72-month term, this tool instantly shows
            you the trade-off between monthly payment size and total interest paid. Students can
            model their loan repayment schedule before graduation. Anyone managing existing debt can
            use the amortisation schedule to understand what extra payments would save.
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
            Before taking on significant debt, consult a financial advisor or credit counsellor —
            especially for debt consolidation strategies or if you are struggling with multiple
            loans. The National Foundation for Credit Counseling (nfcc.org) offers free and low-cost
            financial counselling. For student loans, a student loan specialist can advise on
            income-driven repayment plans, loan forgiveness programs, and refinancing options that
            this calculator does not model.
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
            All calculations in this loan calculator run entirely in your browser. No data you enter
            — loan amounts, interest rates, or personal information — is transmitted to any server
            or stored anywhere. Your financial information stays completely private on your device.
            See our{' '}
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
          toolName="Loan Calculator"
          text="Loan Calculator — Results show principal and interest only and do not include origination fees, insurance, or other charges. Results are estimates for planning and comparison purposes and do not constitute financial or lending advice. Your actual loan payment, total cost, and APR will be determined by your lender. Always review the official loan estimate or truth-in-lending disclosure before signing any loan agreement."
        />

        {/* Related Calculators */}
        <RelatedCalculators calculators={RELATED} />

        {/* Compliance kit */}
        <ToolPageExtras
          toolName="Loan Calculator"
          toolSlug="loan-calculator"
          toolUrl="https://roughtools.com/tools/calculators/loan-calculator"
          type="financial"
        />

        <ToolAdUnit position="bottom" />
      </div>
    </>
  );
}
