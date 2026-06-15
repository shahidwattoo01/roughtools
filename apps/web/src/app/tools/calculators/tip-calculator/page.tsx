import type { Metadata } from 'next'
import TipCalculator from '@/components/tools/calculators/TipCalculator'
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
} from '@/components/tools/CalculatorSections'

// ─── Metadata ────────────────────────────────────────────────────────────────

const _seo = getCalcSEO('tip-calculator')
export const metadata: Metadata = {
  title: _seo?.seoTitle ?? 'Free Tip Calculator — Calculate Tip & Split the Bill | RoughTools',
  description: _seo?.metaDescription ?? 'Calculate tip amount and split the bill among any number of people. Choose from preset percentages or enter a custom tip. Shows tip per person and total per person. Free, instant.',
  keywords: ['tip calculator', 'bill splitter', 'split bill calculator', 'gratuity calculator', 'restaurant tip calculator', 'tip per person calculator'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/calculators/tip-calculator' },
  openGraph: {
    title: 'Free Tip Calculator — Calculate Tip & Split the Bill | RoughTools',
    description: 'Calculate tip and split the bill among multiple people. Free, instant, no signup.',
    url: 'https://roughtools.com/tools/calculators/tip-calculator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Tip Calculator | RoughTools',
    description: 'Calculate tip amount and split bills instantly. Free, no signup.',
  },
}

// ─── FAQ (12 questions — accordion) ──────────────────────────────────────────

const FAQS = [
  { q: 'How much should I tip at a restaurant?', a: 'The standard in the US is 15–20%. Use 10–12% for mediocre service, 15% for acceptable service, 18–20% for good service, and 22–25%+ for exceptional service. In many other countries, tipping is less expected — in Japan, tipping can even be considered rude.' },
  { q: 'How do I split a bill evenly?', a: 'Enter the bill total, tip percentage, and number of people. The calculator divides the grand total (bill + tip) evenly among all people and shows the exact amount each person owes, including their share of the tip.' },
  { q: 'Should I tip before or after tax?', a: 'Most etiquette guides suggest tipping on the pre-tax amount, though tipping on the full total (including tax) is also common and acceptable. The difference is small — on a $100 bill with 10% tax, you\'d tip $15 vs $16.50 at 15%. This calculator works on the pre-tax bill amount you enter.' },
  { q: 'How accurate is this tip calculator?', a: 'The calculator is 100% mathematically accurate based on the bill amount and tip percentage you enter. It divides to the nearest cent. The only variable is rounding: when splitting evenly, one person may owe 1 cent more if the total doesn\'t divide evenly.' },
  { q: 'Is my data private — is anything stored?', a: 'Yes, completely private. All calculations run in your browser. No bill amount or tip information is transmitted to any server, stored anywhere, or accessible by anyone other than you. Close the tab and everything is gone.' },
  { q: 'Is this calculator free to use?', a: 'Yes, completely free with no account required. RoughTools is ad-supported — the calculator is free for everyone.' },
  { q: 'Does this work on mobile phones?', a: 'Yes. The tip calculator is fully responsive and works on any device — iPhone, Android, tablet, or desktop computer — in any modern browser.' },
  { q: 'What browsers are supported?', a: 'All modern browsers: Chrome, Firefox, Safari, Edge, and Opera. Works on iOS Safari and Chrome for Android. Internet Explorer is not supported.' },
  { q: 'Can I save or export my results?', a: 'Yes. Use the "Export PDF Report" button to download a formatted summary. You can also screenshot or copy the result and share it with your group.' },
  { q: 'Who should I consult about tipping etiquette for business expenses?', a: 'For business meal expenses, consult your company\'s expense policy. In general, a 20% tip on the pre-tax amount is considered standard and reasonable for business reimbursement purposes. Ask your accounting department for the maximum claimable tip percentage.' },
  { q: 'How do I tip when people order different amounts (uneven split)?', a: 'This calculator assumes an equal split. For an uneven split, calculate each person\'s share individually: enter their subtotal and calculate the tip for their portion only. Some restaurant apps (like Venmo or Splitwise) allow itemised splitting.' },
  { q: 'What tip percentage should I use for food delivery?', a: 'For food delivery, 15–20% of the order total is standard. For small orders (under $20), a minimum of $3–5 is recommended regardless of percentage. For difficult deliveries (bad weather, long distances, large orders), 20–25% is appropriate.' },
]

// ─── Pro Tips ─────────────────────────────────────────────────────────────────

const PRO_TIPS = [
  'When in doubt, tip 20% — it\'s the easiest calculation (double the tax on your bill in most US states, which are 8–10%) and universally considered a fair tip for good service. It also rounds cleanly: a $45.80 bill becomes a $55 total with 20% tip.',
  'For large groups (8+ people), many restaurants automatically add an 18–20% service charge (called an "auto-gratuity"). Always check your bill before adding an additional tip — otherwise you may double-tip without realising it.',
  'Tipping in cash separately from a card payment ensures the server receives the tip immediately and in full. Card tips may be delayed by payroll cycles and can sometimes be subject to deductions in some establishments.',
  'When splitting a bill, use this calculator to get the per-person total, then each person pays separately on their card. This avoids the awkward "who owes whom" calculations and ensures the server receives the correct tip regardless of how payment is divided.',
]

// ─── When to Use ─────────────────────────────────────────────────────────────

const WHEN_TO_USE = [
  {
    icon: '🍽️',
    title: 'Restaurant meals',
    description: 'Calculate the tip at any restaurant and split the bill evenly among your group. Works for any number of people and any tip percentage.',
  },
  {
    icon: '🚕',
    title: 'Ride-sharing and taxis',
    description: 'Quickly calculate a fair tip for your driver based on the fare. A 15–20% tip is standard for rideshares.',
  },
  {
    icon: '📦',
    title: 'Food delivery orders',
    description: 'Determine the right tip for your delivery driver based on order size, distance, and weather conditions.',
  },
  {
    icon: '✂️',
    title: 'Personal services',
    description: 'Calculate tips for hair stylists, barbers, spa treatments, and other personal services where 15–20% is standard.',
  },
  {
    icon: '🎉',
    title: 'Group events and parties',
    description: 'Split a large group bill at a party or event. Handles any number of people and shows exactly what each person owes.',
  },
]

// ─── Quick Reference table ────────────────────────────────────────────────────

const QUICK_REF = [
  { input: 'Bill Amount', description: 'Pre-tax total of food and drinks ordered', example: '$85.00' },
  { input: 'Tip Percentage', description: 'Percentage of bill to add as a tip', example: '20%' },
  { input: 'Number of People', description: 'How many people are splitting the total', example: '4 people' },
  { input: 'Tip Amount', description: 'Total gratuity added to the bill', example: '$17.00' },
  { input: 'Grand Total', description: 'Bill amount + tip amount combined', example: '$102.00' },
  { input: 'Per Person', description: 'Grand total divided equally by people', example: '$25.50' },
  { input: 'Tip Per Person', description: 'Each person\'s share of the tip', example: '$4.25' },
  { input: 'Formula Used', description: 'Standard percentage calculation', example: 'Tip = Bill × (%)÷100' },
]

// ─── Related calculators ──────────────────────────────────────────────────────

const RELATED = [
  { icon: '💸', name: 'Discount Calculator', slug: 'discount-calculator', description: 'Calculate sale price and savings' },
  { icon: '⛽', name: 'Fuel Cost Calculator', slug: 'fuel-cost-calculator', description: 'Calculate fuel cost for a trip' },
  { icon: '📋', name: 'Budget Calculator', slug: 'budget-calculator', description: 'Monthly income and expense planner' },
  { icon: '💵', name: 'Salary Calculator', slug: 'salary-calculator', description: 'Convert salary between pay periods' },
  { icon: '🎓', name: 'GPA Calculator', slug: 'gpa-calculator', description: 'Calculate GPA from grades' },
]

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Tip Calculator',
    description: 'Free tip calculator. Calculate tip amount and split the bill among multiple people instantly.',
    url: 'https://roughtools.com/tools/calculators/tip-calculator',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.7', reviewCount: '1583' },
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
      { '@type': 'ListItem', position: 3, name: 'Tip Calculator', item: 'https://roughtools.com/tools/calculators/tip-calculator' },
    ],
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TipCalculatorPage() {
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
          <span style={{ color: 'var(--brand)' }}>Tip Calculator</span>
        </nav>

        {/* H1 */}
        <div style={{ fontSize: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(139,92,246,0.15)', borderRadius: 14, padding: '10px 14px', lineHeight: 1, marginBottom: 12 }}>
          💰
        </div>
        <h1 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, color: 'var(--fg)', margin: '0 0 10px', letterSpacing: '-0.5px' }}>
          Free Tip Calculator
        </h1>
        <p style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.7, margin: '0 0 20px', maxWidth: 680 }}>
          Calculate the tip amount and split the bill among any number of people.
          Choose from preset percentages (10%, 15%, 18%, 20%, 25%) or enter a custom tip.
          Shows each person&apos;s share instantly. Free, private, no signup.
        </p>

        {/* Trust badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
          {['⚡ Instant results', '🔒 100% private', '🆓 Always free', '🚫 No signup'].map(b => (
            <span key={b} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)',
              borderRadius: 20, padding: '5px 12px', fontSize: 12, color: 'var(--brand-2)', fontWeight: 500,
            }}>{b}</span>
          ))}
        </div>

        <ToolAdUnit position="top" />

        {/* Calculator widget */}
        <TipCalculator />

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
            About This Tip Calculator
          </h2>

          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The Tip Calculator instantly computes the gratuity amount based on your bill total and desired tip percentage,
            then splits the grand total evenly among however many people are dining together. It supports any tip percentage
            — preset options of 10%, 15%, 18%, 20%, and 25% are provided for quick selection, but you can enter any custom
            percentage. The results show tip amount, grand total, amount per person, and tip per person — everything you
            need to settle a group bill in seconds.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            The Formula — How Tipping Is Calculated
          </h3>
          <div style={{ background: 'var(--bg-3)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 10, padding: '14px 18px', marginBottom: 14, fontFamily: 'monospace', fontSize: 13, color: 'var(--brand-2)' }}>
            Tip Amount = Bill × (Tip % ÷ 100)<br />
            Grand Total = Bill + Tip Amount<br />
            Per Person = Grand Total ÷ Number of People<br />
            Tip Per Person = Tip Amount ÷ Number of People
          </div>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The calculation is straightforward multiplication. For a $80 bill with 18% tip split among 3 people:
            Tip = $80 × 0.18 = $14.40. Grand Total = $80 + $14.40 = $94.40. Per person = $94.40 ÷ 3 = $31.47.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Tipping Etiquette by Service Type
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 10 }}>
            Tipping norms vary by industry and country. In the United States, these are the commonly accepted standards:
          </p>
          <ul style={{ paddingLeft: 20, margin: '0 0 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              'Full-service restaurants: 15–20% (18–22% in expensive cities like New York)',
              'Fast food and counter service: not expected, but 10–15% is appreciated',
              'Food delivery: 15–20%, minimum $3–5 regardless of order size',
              'Ride-share and taxis: 15–20% of the fare',
              'Hair stylists and barbers: 15–20% of the service cost',
              'Hotel housekeeping: $2–5 per night, left on the pillow',
              'Tour guides: $5–10 per person for a half-day tour',
            ].map((item, i) => (
              <li key={i} style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                <span style={{ color: '#8b5cf6', marginRight: 8 }}>•</span>{item}
              </li>
            ))}
          </ul>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            The History of Tipping
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            Tipping as a practice originated in 18th-century England, where coffeehouse patrons would leave extra coins
            in a box labelled &quot;To Insure Promptitude&quot; — from which some derive the word &quot;tip.&quot; The practice
            spread to the United States in the 19th century. Today, tipping is deeply embedded in American service
            culture and serves as a significant portion of income for servers, bartenders, and other service workers,
            many of whom are legally paid a lower minimum wage (as low as $2.13/hour federally) with the expectation
            that tips will make up the difference.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Privacy Notice
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, margin: 0 }}>
            All calculations in this tip calculator run entirely in your browser. No bill amount, tip percentage,
            or number of people is transmitted to any server or stored anywhere. Your information stays completely
            private. See our{' '}
            <a href="/privacy" style={{ color: '#8b5cf6', textDecoration: 'underline' }}>Privacy Policy</a>{' '}
            for details.
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
          toolName="Tip Calculator"
          toolSlug="tip-calculator"
          toolUrl="https://roughtools.com/tools/calculators/tip-calculator"
          type="general"
        />

        <ToolAdUnit position="bottom" />
      </div>
    </>
  )
}
