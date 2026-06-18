import type { Metadata } from 'next';
import ToolAdUnit from '@/components/ToolAdUnit';
import { JsonLd } from '@/components/JsonLd';
import CurrencyConverterClient from './CurrencyConverterClient';
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

const _seo = getCalcSEO('currency-converter');
export const metadata: Metadata = {
  title: _seo?.seoTitle ?? 'Free Currency Converter — Live Exchange Rates | RoughTools',
  description:
    _seo?.metaDescription ??
    'Convert between 170+ currencies with indicative exchange rates. Free online currency converter. USD, EUR, GBP, JPY, CAD, AUD and more. Instant, no signup.',
  keywords: [
    'currency converter',
    'exchange rate',
    'currency calculator',
    'usd to eur',
    'foreign exchange calculator',
    'free currency converter',
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/calculators/currency-converter' },
  openGraph: {
    title: 'Free Currency Converter — Live Exchange Rates | RoughTools',
    description:
      'Convert between 170+ currencies with indicative exchange rates. Free, instant, no signup.',
    url: 'https://roughtools.com/tools/calculators/currency-converter',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Currency Converter | RoughTools',
    description: 'Convert between 170+ currencies. Free, instant.',
  },
};

// ─── FAQ data ─────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: 'How accurate are the exchange rates shown?',
    a: 'Rates shown are indicative mid-market rates sourced from currency data providers and updated periodically. They may not reflect the exact rate you will receive from a bank, broker, or exchange bureau — which add a spread (margin) on top of the mid-market rate. For large transactions or financial decisions, always confirm the exact rate with your provider.',
  },
  {
    q: 'Is my data private — is anything stored?',
    a: 'Yes, completely private. Your conversion inputs are not transmitted to or stored on any server. Exchange rate data is fetched from a third-party API to power the converter, but no personal or financial information you enter is shared. When you close the tab, your inputs are gone.',
  },
  {
    q: 'Is this currency converter free to use?',
    a: 'Yes, completely free. No account, no subscription, no hidden fees. RoughTools is ad-supported — using it costs you nothing.',
  },
  {
    q: 'Does this work on mobile?',
    a: 'Yes. The converter is fully responsive and works on any device — smartphone, tablet, or desktop — in any modern browser.',
  },
  {
    q: 'What browsers are supported?',
    a: 'All modern browsers: Chrome, Firefox, Safari, Edge, and Opera. Internet Explorer is not supported. We recommend Chrome or Firefox for the best experience.',
  },
  {
    q: 'Can I save or export my results?',
    a: "Yes. Use your browser's print function (Ctrl+P or Cmd+P) to save results as a PDF. Screenshot tools on your device also work well for quick reference.",
  },
  {
    q: 'Should I use this for large financial transactions?',
    a: 'No — not as the sole source. For large transactions (international wire transfers, foreign property purchases, business payments), use rates confirmed directly with your bank, FX broker, or payment provider. They will quote you a live executable rate including their spread and fees. This tool is best for reference, travel planning, and comparison.',
  },
  {
    q: 'What is the formula for currency conversion?',
    a: 'Converted Amount = Amount × Exchange Rate. For example, if 1 USD = 0.92 EUR, then $500 USD = 500 × 0.92 = €460. To reverse, divide: €460 / 0.92 = $500. The exchange rate itself is set by supply and demand in global FX markets.',
  },
  {
    q: 'What is the bid/ask spread in currency exchange?',
    a: 'Banks and exchange bureaus buy currency at the "bid" price and sell at the "ask" price. The difference is the spread — this is how they profit on conversions. The mid-market rate (shown here) is the midpoint between bid and ask. A bank might offer a rate 1–3% worse than mid-market; airport bureaus can be 5–10% worse. Always compare to the mid-market rate to understand the real cost.',
  },
  {
    q: 'What is the best way to exchange currency for travel?',
    a: 'Generally, in order of best to worst rates: (1) Use a fee-free debit card with no foreign transaction fees (e.g., Wise, Charles Schwab, Revolut) at local ATMs. (2) Order currency from your bank before travel. (3) Use ATMs at your destination (avoid "dynamic currency conversion" — always pay in local currency). (4) Avoid airport exchange bureaus — they typically offer the worst rates and highest fees.',
  },
  {
    q: 'What is the difference between ATM rate and bureau rate?',
    a: 'ATMs generally offer rates closer to the mid-market rate but may charge flat withdrawal fees. Currency exchange bureaus (especially at airports and tourist areas) add a large spread and sometimes hidden fees. Fee-free international bank accounts and travel cards typically deliver the best effective exchange rates with zero or minimal fees.',
  },
  {
    q: 'What is a mid-market rate?',
    a: 'The mid-market rate (also called the interbank rate or spot rate) is the midpoint between the buy and sell rates in the global FX market at a given moment. It is the "true" exchange rate you see on Google or XE.com. It is the most transparent benchmark for comparing what any bank or exchange service is actually charging you.',
  },
];

// ─── Pro Tips ─────────────────────────────────────────────────────────────────

const PRO_TIPS = [
  'Always compare any rate you are offered to the mid-market rate (check Google, XE.com, or this converter). The difference between the offered rate and mid-market is your true cost of conversion — a 2% spread on a $10,000 transfer costs you $200.',
  'Avoid airport and hotel exchange bureaus at all costs. They typically charge spreads of 5–15% above mid-market, plus hidden fees. A fee-free travel debit card used at a local ATM will almost always give you a significantly better effective rate.',
  'Check the total cost — not just the exchange rate. A provider advertising "zero commission" often bakes a wide spread into the rate. A provider charging a $5 fee but offering a tighter rate may be cheaper overall. Always calculate the total amount received to compare fairly.',
  "For large international transfers (property purchase, business payment, sending money abroad), consider a specialist FX broker (Wise, OFX, Currencies Direct). They offer rates significantly better than high-street banks and may offer forward contracts to lock in today's rate for a future transaction.",
];

// ─── When to Use ─────────────────────────────────────────────────────────────

const WHEN_TO_USE = [
  {
    icon: '✈️',
    title: 'Travel planning and budgeting',
    description:
      'Convert your home currency to destination currency to budget accommodation, food, and activities before you travel.',
  },
  {
    icon: '🛒',
    title: 'International online purchases',
    description:
      'Quickly check what a foreign-currency price equals in your currency before completing a purchase to avoid surprises on your credit card statement.',
  },
  {
    icon: '💸',
    title: 'Remittance and money transfer comparison',
    description:
      'See the mid-market rate as a benchmark when comparing remittance services to determine which offers the best effective rate for sending money abroad.',
  },
  {
    icon: '📊',
    title: 'Business FX cost estimation',
    description:
      'Estimate the cost of paying international suppliers, contractors, or vendors in foreign currencies when budgeting projects or pricing international services.',
  },
  {
    icon: '💹',
    title: 'Investment in foreign assets',
    description:
      'Convert international stock prices, property values, or fund NAVs into your home currency to evaluate foreign investment opportunities on a like-for-like basis.',
  },
];

// ─── Quick Reference ──────────────────────────────────────────────────────────

const QUICK_REF = [
  { input: 'Amount', description: 'The value you want to convert', example: '1,000' },
  { input: 'From Currency', description: 'The source currency (e.g., USD)', example: 'USD' },
  { input: 'To Currency', description: 'The target currency (e.g., EUR)', example: 'EUR' },
  {
    input: 'Exchange Rate',
    description: 'Units of target per 1 unit of source',
    example: '0.9210',
  },
  { input: 'Converted Result', description: 'Amount × Exchange Rate', example: '921.00 EUR' },
];

// ─── Related Calculators ──────────────────────────────────────────────────────

const RELATED = [
  {
    icon: '💼',
    name: 'Salary Calculator',
    slug: 'salary-calculator',
    description: 'Convert salary to hourly or annual',
  },
  {
    icon: '📋',
    name: 'Budget Calculator',
    slug: 'budget-calculator',
    description: 'Monthly income and expense planner',
  },
  {
    icon: '📉',
    name: 'Inflation Calculator',
    slug: 'inflation-calculator',
    description: 'How inflation erodes purchasing power',
  },
];

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Currency Converter',
    description:
      'Free currency converter with indicative exchange rates for 170+ world currencies.',
    url: 'https://roughtools.com/tools/calculators/currency-converter',
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
        name: 'Currency Converter',
        item: 'https://roughtools.com/tools/calculators/currency-converter',
      },
    ],
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CurrencyConverterPage() {
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
          <span style={{ color: 'var(--brand)' }}>Currency Converter</span>
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
          💱
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
          Free Currency Converter
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
          Convert between 170+ world currencies using indicative mid-market exchange rates. Ideal
          for travel planning, international purchases, remittance comparison, and business FX
          estimation. Free, private — no signup required.
        </p>

        {/* Trust badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
          {[
            '⚡ Instant results',
            '🔒 100% private',
            '🆓 Always free',
            '🚫 No signup',
            '🌍 170+ currencies',
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
        <CurrencyConverterClient />

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
            About This Currency Converter
          </h2>

          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The Currency Converter lets you convert any amount between 170+ world currencies using
            indicative mid-market exchange rates. Whether you are budgeting a trip to Japan,
            checking the price of an item on a foreign website, estimating the cost of an
            international wire transfer, or comparing remittance services — this tool gives you an
            instant, clear reference point based on the current mid-market rate.
          </p>

          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--brand-2)',
              margin: '20px 0 10px',
            }}
          >
            How Exchange Rates Work
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            An exchange rate is the price of one currency expressed in terms of another. Exchange
            rates fluctuate continuously, 24 hours a day, 5 days a week (and in crypto markets,
            around the clock) based on supply and demand in the global foreign exchange (FX) market
            — the largest financial market in the world, with over $7 trillion traded daily. Rates
            are influenced by interest rate differentials between countries, inflation, trade
            balances, economic growth data, political stability, and market sentiment.
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
            Converted Amount = Amount × Exchange Rate
            <br />
            Reverse: Amount = Converted Amount ÷ Exchange Rate
          </div>

          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--brand-2)',
              margin: '20px 0 10px',
            }}
          >
            Spot Rate vs Bank Rate vs Airport Rate
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The <strong style={{ color: 'var(--fg)' }}>spot rate</strong> (or mid-market rate) is
            the interbank exchange rate — the rate at which large banks trade currencies with each
            other. This is the rate shown on Google, XE.com, and this converter. It is the most
            transparent benchmark.
          </p>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            When you exchange currency through a bank, broker, or ATM, they apply a{' '}
            <strong style={{ color: 'var(--fg)' }}>spread</strong>: a margin added to their buy/sell
            prices to generate profit. High-street banks typically add 1–3%. Airport exchange
            bureaus add 5–10% or more, making them the most expensive option. Specialist FX services
            and fee-free travel cards often offer rates very close to the mid-market rate, making
            them the cheapest option for most international money needs.
          </p>

          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--brand-2)',
              margin: '20px 0 10px',
            }}
          >
            Why Rates Differ Between Institutions
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            Every institution that offers currency exchange needs to profit from the transaction.
            They do this by: (1) applying a spread to the exchange rate, (2) charging flat fees or
            commissions, or (3) a combination of both. When comparing providers, always calculate
            the total amount received in the target currency — not just the advertised rate. A
            provider offering a &quot;0% commission&quot; may embed a 3% spread into the rate,
            effectively charging more than a provider with a transparent $10 fee and a tighter rate.
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
            The amounts you enter into this converter are not stored or transmitted anywhere.
            Exchange rate data is fetched from a third-party rate provider to power the conversion,
            but your personal inputs remain on your device. See our{' '}
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
          toolName="Currency Converter"
          text="Currency Converter — Exchange rates shown are indicative mid-market rates and may not reflect the exact rate available from any specific bank, broker, or exchange service. Rates fluctuate continuously. This tool is for reference and estimation purposes only and does not constitute financial or investment advice. For large transactions, always confirm the live executable rate and total fees with your provider."
        />

        {/* Related Calculators */}
        <RelatedCalculators calculators={RELATED} />

        <ToolPageExtras
          toolName="Currency Converter"
          toolSlug="currency-converter"
          toolUrl="https://roughtools.com/tools/calculators/currency-converter"
          type="financial"
        />

        <ToolAdUnit position="bottom" />
      </div>
    </>
  );
}
