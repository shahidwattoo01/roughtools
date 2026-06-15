import type { Metadata } from 'next'
import ToolAdUnit from '@/components/ToolAdUnit'
import { JsonLd } from '@/components/JsonLd'
import DiscountCalculatorClient from './DiscountCalculatorClient'
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

const _seo = getCalcSEO('discount-calculator')
export const metadata: Metadata = {
  title: _seo?.seoTitle ?? 'Free Discount Calculator — Calculate Sale Price & Savings | RoughTools',
  description: _seo?.metaDescription ?? 'Calculate sale price after any discount, find the discount percentage, or compare stacked discounts. Free online discount calculator — see exactly how much you save.',
  keywords: ['discount calculator', 'sale price calculator', 'percent off calculator', 'savings calculator', 'how much is 20 percent off', 'free discount calculator'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/calculators/discount-calculator' },
  openGraph: {
    title: 'Free Discount Calculator — Calculate Sale Price & Savings | RoughTools',
    description: 'Calculate sale price after discount and see exactly how much you save. Free, instant, no signup.',
    url: 'https://roughtools.com/tools/calculators/discount-calculator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Discount Calculator | RoughTools',
    description: 'Calculate sale price after discount and your savings instantly. Free, no signup.',
  },
}

// ─── FAQ data (12 questions — accordion) ─────────────────────────────────────

const FAQS = [
  {
    q: 'How accurate is this discount calculator?',
    a: 'The calculator is mathematically exact for the inputs you provide. It applies the standard discount formula: Sale Price = Original Price × (1 − Discount% ÷ 100). Results are rounded to two decimal places. The calculator does not account for sales tax (unless you add that separately) or dynamic pricing that may differ at checkout.',
  },
  {
    q: 'Is my data private — is anything stored?',
    a: 'Yes, completely private. All calculations run entirely in your browser using JavaScript. No price data or inputs you enter are transmitted to any server, stored in a database, or shared with third parties. When you close the tab, your inputs are gone.',
  },
  {
    q: 'Is this calculator free to use?',
    a: 'Yes, completely free. No account, no subscription, no hidden fees. RoughTools is ad-supported — using it costs you nothing.',
  },
  {
    q: 'Does this work on mobile?',
    a: 'Yes. The calculator is fully responsive and works on any device — smartphone, tablet, or desktop — in any modern browser. Perfect for quick calculations while shopping in-store.',
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
    q: 'Do I need professional advice for discount calculations?',
    a: 'No — discount calculations are straightforward math. This calculator handles all the arithmetic precisely. For business pricing strategy, bulk purchasing negotiations, or wholesale contract pricing, you may want to consult a financial analyst or business advisor.',
  },
  {
    q: 'What formula does this calculator use?',
    a: 'Three standard retail discount formulas: (1) Discount Amount = Original Price × (Discount% ÷ 100); (2) Sale Price = Original Price − Discount Amount; (3) Savings % = (Discount Amount ÷ Original Price) × 100. To find the discount percentage from two prices: Discount% = ((Original − Sale) ÷ Original) × 100.',
  },
  {
    q: 'How do stacked discounts work?',
    a: 'Stacked (sequential) discounts are NOT additive — they compound. A 20% discount followed by a 10% discount is not 30% off. Calculation: apply the first discount to get a new price, then apply the second discount to that new price. Example: $100 − 20% = $80, then $80 − 10% = $72. That is 28% off the original, not 30%. Use this calculator twice (or enter the intermediate price) to handle stacked discounts accurately.',
  },
  {
    q: 'Is a percentage discount or a dollar-amount discount better?',
    a: 'It depends on the price. A 20% discount on a $500 item ($100 off) is better than "$50 off." But a "$50 off" deal on a $100 item (50%) is better than a 20% discount ($20 off). Always convert to the same unit — either dollar amounts or percentages — to compare deals accurately. This calculator shows both.',
  },
  {
    q: 'What are good Black Friday shopping strategies?',
    a: 'Before Black Friday: track the original price for a few weeks — some retailers inflate pre-sale prices to make discounts look larger. Compare the sale price to the year-round price (not the "original" shown on the tag). Calculate cost-per-unit for bulk items. Check Amazon price history tools like CamelCamelCamel.com. Look for price-match guarantees that extend into January so you can claim a refund if the price drops further.',
  },
  {
    q: 'Can I stack store coupons with sale prices?',
    a: 'It depends entirely on the retailer\'s coupon policy. Many retailers allow one coupon per item but prohibit stacking multiple coupons. Manufacturer coupons can sometimes be combined with store coupons (a practice called "stacking"). Digital coupons loaded to a loyalty app often stack with in-store promotions. Always read the fine print. When stacking is allowed, apply the higher-value discount first for maximum savings.',
  },
]

// ─── Pro Tips ─────────────────────────────────────────────────────────────────

const PRO_TIPS = [
  'For grocery and household goods, calculate price-per-unit or price-per-ounce — not just total price. A larger package with a smaller discount often beats a smaller package with a bigger discount. Divide the sale price by the quantity or weight to get the real comparison number. Most grocery stores print unit price on the shelf tag, but calculating it yourself is more reliable.',
  'A percentage discount and a dollar discount feel different but mean the same thing in context. "20% off" on a $50 item = $10 off. "$15 off" on the same $50 item = 30% off. Always convert to the same format when comparing two offers. The higher percentage off the original price is always the better deal for a single item.',
  'BOGO (Buy One Get One Free) is exactly 50% off per item when buying two of equal price. But BOGO 50% off (second item at half price) is only 25% off the total purchase. When comparing BOGO to a flat percentage discount, calculate total cost for two units: 50% off two units vs. BOGO 50% (pay 1.5× for 2 units). The flat 50% discount wins every time for pairs.',
  'Always verify that the "original price" is genuine. Some retailers mark up prices before sales events to create an artificially large discount. Use price-tracking browser extensions (like Honey or CamelCamelCamel for Amazon) to check historical prices before assuming a sale is a real deal. A 50%-off label means nothing if the item was inflated 60% beforehand.',
]

// ─── When to Use ─────────────────────────────────────────────────────────────

const WHEN_TO_USE = [
  {
    icon: '🛍️',
    title: 'Shopping sales and clearance events',
    description: 'Instantly calculate the final price and total savings during sales, clearance, or seasonal events without doing mental math in the store aisle.',
  },
  {
    icon: '🔍',
    title: 'Price comparison between stores',
    description: 'Compare the real cost of an item at different retailers after their respective discounts, even when each store expresses the deal differently (% off vs. $ off).',
  },
  {
    icon: '📦',
    title: 'Bulk buying decision',
    description: 'Decide whether a bulk quantity discount (e.g., 15% off for buying 10 units) is worth the higher upfront cost compared to buying fewer units at full price.',
  },
  {
    icon: '🏷️',
    title: 'Business pricing strategy',
    description: 'Calculate the exact margin impact of promotional discounts on your products — see the sale price, revenue per unit, and total discount given at different discount levels.',
  },
  {
    icon: '🎁',
    title: 'Gift and holiday shopping',
    description: 'Track savings across multiple discounted items during holiday shopping to stay within budget and calculate how much you are actually saving versus the original total.',
  },
]

// ─── Quick Reference table ────────────────────────────────────────────────────

const QUICK_REF = [
  { input: 'Original Price', description: 'The full price before any discount is applied', example: '$80.00' },
  { input: 'Discount Percentage', description: 'The percentage off the original price', example: '25%' },
  { input: 'Discount Amount', description: 'Dollar value of the discount (Original × Discount%)', example: '$20.00' },
  { input: 'Sale Price', description: 'What you actually pay (Original − Discount Amount)', example: '$60.00' },
  { input: 'Money Saved', description: 'Total savings in dollars and as a percentage', example: '$20.00 (25%)' },
]

// ─── Related calculators ──────────────────────────────────────────────────────

const RELATED = [
  { icon: '🍽️', name: 'Tip Calculator', slug: 'tip-calculator', description: 'Calculate tip and split the bill' },
  { icon: '📋', name: 'Budget Calculator', slug: 'budget-calculator', description: 'Monthly income and expense planner' },
  { icon: '🔢', name: 'Percentage Calculator', slug: 'percentage-calculator', description: 'All percentage calculation modes' },
  { icon: '💰', name: 'Salary Calculator', slug: 'salary-calculator', description: 'Hourly, weekly, monthly, annual conversions' },
]

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Discount Calculator',
    description: 'Free discount calculator. Calculate sale price, discount amount, and total savings from any original price and discount percentage.',
    url: 'https://roughtools.com/tools/calculators/discount-calculator',
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
      { '@type': 'ListItem', position: 3, name: 'Discount Calculator', item: 'https://roughtools.com/tools/calculators/discount-calculator' },
    ],
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DiscountCalculatorPage() {
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
          <span style={{ color: 'var(--brand)' }}>Discount Calculator</span>
        </nav>

        {/* H1 */}
        <div style={{ fontSize: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(139,92,246,0.15)', borderRadius: 14, padding: '10px 14px', lineHeight: 1, marginBottom: 12 }}>
          🏷️
        </div>
        <h1 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, color: 'var(--fg)', margin: '0 0 10px', letterSpacing: '-0.5px' }}>
          Free Discount Calculator
        </h1>
        <p style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.7, margin: '0 0 20px', maxWidth: 680 }}>
          Calculate the sale price and total savings from any original price and discount percentage.
          Find the discount percentage from two prices, or compare stacked discounts.
          Free, private — all calculations run in your browser.
        </p>

        {/* Trust badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
          {['⚡ Instant results', '🔒 100% private', '🆓 Always free', '🚫 No signup', '📱 Works on mobile'].map(b => (
            <span key={b} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)',
              borderRadius: 20, padding: '5px 12px', fontSize: 12, color: 'var(--brand-2)', fontWeight: 500,
            }}>{b}</span>
          ))}
        </div>

        <ToolAdUnit position="top" />

        {/* Calculator widget */}
        <DiscountCalculatorClient />

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
            About This Discount Calculator
          </h2>

          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            This Discount Calculator solves the three core retail pricing questions instantly: What is the sale price
            after a percentage discount? What percentage discount does a price reduction represent? And how much do I
            actually save in dollars and as a percentage? Whether you are shopping in-store, comparing online deals,
            or setting promotional prices for your business, this tool gives you precise answers in seconds.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            The Formula — How It Works
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The calculator uses three standard retail discount formulas:
          </p>
          <div style={{ background: 'var(--bg-3)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 10, padding: '14px 18px', marginBottom: 14, fontFamily: 'monospace', fontSize: 13, color: 'var(--brand-2)' }}>
            Discount Amount = Original Price × (Discount% ÷ 100)<br />
            Sale Price = Original Price − Discount Amount<br />
            Savings % = (Discount Amount ÷ Original Price) × 100
          </div>
          <p style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            To find the discount percentage when you know both prices:{' '}
            <strong style={{ color: '#c4caff' }}>Discount% = ((Original − Sale) ÷ Original) × 100</strong>.
            To find the original price from a sale price and discount%:{' '}
            <strong style={{ color: '#c4caff' }}>Original = Sale Price ÷ (1 − Discount% ÷ 100)</strong>.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Understanding Double and Stacked Discounts
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            A common misconception is that two sequential discounts add together. They do not — they compound multiplicatively.
            A 20% discount followed by an additional 10% discount is not 30% off the original price. The second discount
            applies to the already-reduced price. The true combined discount is:{' '}
            <strong style={{ color: 'var(--fg)' }}>1 − (1 − 0.20) × (1 − 0.10) = 1 − 0.72 = 28% off</strong>.
            This distinction matters enormously in retail promotions and coupon stacking scenarios.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Who Should Use This Calculator
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            This tool is for everyday shoppers who want to verify the real savings on a sale, deal hunters comparing
            promotional offers across multiple stores, small business owners setting promotional pricing and needing to
            know the exact impact on revenue, and anyone who encounters percentage-based pricing and wants a precise
            answer without mental arithmetic. It is particularly valuable during high-pressure shopping events like
            Black Friday, where multiple overlapping discounts can be confusing.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Privacy Notice
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, margin: 0 }}>
            All calculations in this discount calculator are performed entirely in your browser. No price data or inputs
            you enter are transmitted to any server, stored in any database, or shared with third parties. See our{' '}
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
          toolName="Discount Calculator"
          toolSlug="discount-calculator"
          toolUrl="https://roughtools.com/tools/calculators/discount-calculator"
          type="financial"
        />

        <ToolAdUnit position="bottom" />
      </div>
    </>
  )
}
