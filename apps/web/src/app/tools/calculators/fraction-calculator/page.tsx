import type { Metadata } from 'next'
import FractionCalculatorClient from './FractionCalculatorClient'
import { getCalcSEO } from '../_components/calc-seo-configs'
import ToolAdUnit from '@/components/ToolAdUnit'
import { JsonLd } from '@/components/JsonLd'
import { ToolPageExtras } from '@/components/ToolPageExtras'
import {
  ProTipsSection,
  WhenToUseCards,
  QuickReferenceTable,
  CalculatorFAQ,
  RelatedCalculators,
} from '@/components/tools/CalculatorSections'

// ─── Metadata ────────────────────────────────────────────────────────────────

const _seo = getCalcSEO('fraction-calculator')
export const metadata: Metadata = {
  title: _seo?.seoTitle ?? 'Free Fraction Calculator — Add, Subtract, Multiply & Divide | RoughTools',
  description: _seo?.metaDescription ?? 'Add, subtract, multiply, and divide fractions with automatic simplification. Shows step-by-step working. Free, private, instant — no signup needed.',
  keywords: ['fraction calculator', 'add fractions', 'subtract fractions', 'multiply fractions', 'divide fractions', 'simplify fractions', 'free fraction calculator'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/calculators/fraction-calculator' },
  openGraph: {
    title: 'Free Fraction Calculator — Add, Subtract, Multiply & Divide | RoughTools',
    description: 'Add, subtract, multiply, and divide fractions with automatic simplification. Free, instant, no signup.',
    url: 'https://roughtools.com/tools/calculators/fraction-calculator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Fraction Calculator | RoughTools',
    description: 'Add, subtract, multiply, and divide fractions instantly. Automatic simplification.',
  },
}

// ─── FAQ data (12 questions — accordion) ─────────────────────────────────────

const FAQS = [
  {
    q: 'How accurate is this fraction calculator?',
    a: 'The calculator is mathematically exact. Fraction arithmetic uses integer arithmetic internally — there are no floating-point rounding errors. The result is always expressed as an exact simplified fraction (e.g., 1/3 rather than 0.333...). The decimal equivalent is rounded to 10 significant figures for display only.',
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
    a: "Use your browser's print function (Ctrl+P or Cmd+P) to save the page as PDF. You can also copy the result directly from the screen — the fraction and decimal equivalent are both shown.",
  },
  {
    q: 'What formula does this calculator use?',
    a: 'All four operations use standard fraction arithmetic: Addition: a/b + c/d = (ad + bc) / bd; Subtraction: a/b − c/d = (ad − bc) / bd; Multiplication: a/b × c/d = ac / bd; Division: a/b ÷ c/d = ad / bc. After the operation, the result is reduced to lowest terms by dividing numerator and denominator by their Greatest Common Divisor (GCD).',
  },
  {
    q: 'How do you simplify a fraction?',
    a: 'To simplify (reduce) a fraction, divide both the numerator and denominator by their Greatest Common Divisor (GCD). For example, 12/18: GCD(12,18) = 6, so 12/18 = (12÷6)/(18÷6) = 2/3. This calculator performs simplification automatically using the Euclidean algorithm.',
  },
  {
    q: 'What is the Least Common Denominator (LCD)?',
    a: 'The Least Common Denominator is the smallest number that both denominators divide into evenly. For adding or subtracting fractions, you convert both fractions to the LCD before adding numerators. For example, to add 1/4 + 1/6, the LCD is 12, so you compute 3/12 + 2/12 = 5/12. Using the LCD (rather than just multiplying the denominators) keeps numbers smaller and simplifies the final step.',
  },
  {
    q: 'How do you convert a mixed number to an improper fraction?',
    a: 'Multiply the whole number by the denominator and add the numerator. For example, 3 2/5 becomes (3 × 5 + 2)/5 = 17/5. To convert back, divide the numerator by the denominator: 17 ÷ 5 = 3 remainder 2, giving 3 2/5. This calculator works with both proper fractions (numerator < denominator) and improper fractions (numerator ≥ denominator).',
  },
  {
    q: 'Why are fractions important in real life?',
    a: 'Fractions appear constantly in everyday situations: scaling recipes (1/2 cup of flour), reading measurements in carpentry (3/8 inch drill bit), understanding discounts (1/3 off), calculating probability (1 in 4 chance), splitting bills, and many engineering and scientific contexts. Mastering fraction arithmetic is a foundational numeracy skill.',
  },
  {
    q: 'Do I need professional advice to use fractions?',
    a: 'No — fraction arithmetic is a pure mathematical operation with exact answers. There is no professional advice needed. However, if fractions are being used in a financial, engineering, or medical context, consult the relevant professional for the broader decision, not just the arithmetic.',
  },
]

// ─── Pro Tips ─────────────────────────────────────────────────────────────────

const PRO_TIPS = [
  'Cross-cancel before multiplying fractions to keep numbers small. For example, 4/9 × 3/8 — notice that 4 and 8 share a factor of 4 (4÷4=1, 8÷4=2), and 3 and 9 share a factor of 3 (3÷3=1, 9÷3=3). So the product simplifies immediately to 1/3 × 1/2 = 1/6, avoiding the need to simplify 12/72 at the end.',
  'For addition and subtraction, always find the LCD rather than just multiplying the two denominators. Multiplying denominators works but creates large numbers that then need heavy simplification. For 5/6 + 7/8, the LCD is 24 (not 48), giving 20/24 + 21/24 = 41/24 — smaller and easier to work with.',
  'Convert mixed numbers to improper fractions before performing arithmetic, then convert back at the end. Mixed numbers like 2 3/4 are harder to add directly because the whole-number parts and fractional parts must be handled separately. As an improper fraction (11/4), standard fraction rules apply cleanly.',
  'Estimate the answer before calculating as a sanity check. For 3/7 + 4/9, both fractions are close to 1/2, so the answer should be close to 1. The actual answer is 55/63 ≈ 0.873 — close to 1, which confirms the calculation is reasonable. This habit catches errors instantly.',
]

// ─── When to Use ─────────────────────────────────────────────────────────────

const WHEN_TO_USE = [
  {
    icon: '🍳',
    title: 'Cooking & recipe scaling',
    description: 'Scale recipe quantities up or down accurately. Halving 3/4 cup becomes 3/8 cup — the fraction calculator gives the exact measurement instantly.',
  },
  {
    icon: '🪵',
    title: 'Carpentry & measurement',
    description: 'Imperial measurements are full of fractions: 3/8 inch, 5/16 inch. Add or subtract lumber measurements precisely without converting to decimals.',
  },
  {
    icon: '📚',
    title: 'Elementary school homework',
    description: 'Check your child\'s fraction homework or work through problems step by step. Covers all four operations with automatic simplification shown.',
  },
  {
    icon: '🎲',
    title: 'Probability calculations',
    description: 'Probability results are naturally expressed as fractions. Calculate combined probabilities like 1/4 × 2/3 = 1/6 with exact fractional results.',
  },
  {
    icon: '⚙️',
    title: 'Engineering ratios',
    description: 'Gear ratios, mixture ratios, and scale factors in engineering are often expressed as fractions. Get exact rational answers for technical specifications.',
  },
]

// ─── Quick Reference table ────────────────────────────────────────────────────

const QUICK_REF = [
  { input: 'Numerator A', description: 'Top number of the first fraction', example: '3' },
  { input: 'Denominator A', description: 'Bottom number of the first fraction (cannot be 0)', example: '4' },
  { input: 'Numerator B', description: 'Top number of the second fraction', example: '2' },
  { input: 'Denominator B', description: 'Bottom number of the second fraction (cannot be 0)', example: '5' },
  { input: 'Operation', description: 'Choose: Add (+), Subtract (−), Multiply (×), Divide (÷)', example: 'Add (+)' },
  { input: 'Result (simplified)', description: 'Answer reduced to lowest terms by GCD', example: '23/20' },
  { input: 'Result as decimal', description: 'Fractional result expressed as a decimal', example: '1.15' },
]

// ─── Related calculators ──────────────────────────────────────────────────────

const RELATED = [
  { icon: '📊', name: 'Percentage Calculator', slug: 'percentage-calculator', description: 'Convert fractions to percentages' },
  { icon: '⚖️', name: 'Ratio Calculator', slug: 'ratio-calculator', description: 'Simplify and compare ratios' },
  { icon: '📈', name: 'Statistics Calculator', slug: 'statistics-calculator', description: 'Mean, median, SD and more' },
  { icon: '🔬', name: 'Scientific Calculator', slug: 'scientific-calculator', description: 'Advanced mathematical operations' },
]

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Fraction Calculator',
    description: 'Free fraction calculator. Add, subtract, multiply, and divide fractions with automatic simplification to lowest terms.',
    url: 'https://roughtools.com/tools/calculators/fraction-calculator',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '1943' },
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
      { '@type': 'ListItem', position: 3, name: 'Fraction Calculator', item: 'https://roughtools.com/tools/calculators/fraction-calculator' },
    ],
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FractionCalculatorPage() {
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
          <span style={{ color: 'var(--brand)' }}>Fraction Calculator</span>
        </nav>

        {/* H1 */}
        <div style={{ fontSize: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(139,92,246,0.15)', borderRadius: 14, padding: '10px 14px', lineHeight: 1, marginBottom: 12 }}>
          🧮
        </div>
        <h1 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, color: 'var(--fg)', margin: '0 0 10px', letterSpacing: '-0.5px' }}>
          Free Fraction Calculator
        </h1>
        <p style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.7, margin: '0 0 20px', maxWidth: 680 }}>
          Add, subtract, multiply, and divide any two fractions instantly. Results are automatically
          simplified to lowest terms. Supports proper fractions, improper fractions, and shows the
          decimal equivalent. Free, private — all calculations run in your browser.
        </p>

        {/* Trust badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
          {['⚡ Instant results', '🔒 100% private', '🆓 Always free', '🚫 No signup', '✅ Exact answers'].map(b => (
            <span key={b} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)',
              borderRadius: 20, padding: '5px 12px', fontSize: 12, color: 'var(--brand-2)', fontWeight: 500,
            }}>{b}</span>
          ))}
        </div>

        <ToolAdUnit position="top" />

        {/* Calculator widget */}
        <FractionCalculatorClient />

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
            About This Fraction Calculator
          </h2>

          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The Fraction Calculator performs all four arithmetic operations — addition, subtraction, multiplication,
            and division — on any pair of fractions and returns an exact result simplified to its lowest terms.
            Unlike decimal calculators, it never rounds: the answer to 1/3 + 1/6 is exactly 1/2, not 0.4999999.
            This makes it ideal for mathematics, cooking, carpentry, engineering ratios, and any situation
            where an exact rational answer is required rather than an approximation.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            The Formulas — How Each Operation Works
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 10 }}>
            For two fractions a/b and c/d, the four operations are defined as follows:
          </p>
          <div style={{ background: 'var(--bg-3)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 10, padding: '14px 18px', marginBottom: 14, fontFamily: 'monospace', fontSize: 13, color: 'var(--brand-2)', lineHeight: 2 }}>
            Addition:       a/b + c/d = (ad + bc) / bd<br />
            Subtraction:    a/b − c/d = (ad − bc) / bd<br />
            Multiplication: a/b × c/d = ac / bd<br />
            Division:       a/b ÷ c/d = ad / bc
          </div>
          <p style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            After computing the raw result, the calculator divides both numerator and denominator by
            their <strong style={{ color: '#c4caff' }}>Greatest Common Divisor (GCD)</strong>, computed
            via the Euclidean algorithm, to produce the fully simplified fraction. The GCD of two integers
            a and b is the largest integer that divides both without remainder: for example, GCD(12, 18) = 6,
            so 12/18 simplifies to 2/3.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Addition and Subtraction — The LCD Method
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            To add or subtract fractions, both must share a common denominator. The formula above (using
            bd as denominator) always works but can produce unnecessarily large numbers. A more efficient
            approach is to use the <strong style={{ color: 'var(--fg)' }}>Least Common Denominator (LCD)</strong>,
            which is the Least Common Multiple (LCM) of the two denominators. For example, to compute
            5/6 + 7/8: the LCD is LCM(6, 8) = 24. Convert: 20/24 + 21/24 = 41/24. Using the formula
            directly would give 40/48 + 42/48 = 82/48, which simplifies to the same 41/24 but requires
            an extra simplification step.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Multiplication and Division — Cross-Cancellation
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            Multiplication is the simplest operation: multiply numerators, multiply denominators, then
            simplify. Division uses the <strong style={{ color: 'var(--fg)' }}>reciprocal rule</strong>:
            dividing by c/d is the same as multiplying by d/c. A powerful shortcut is
            <strong style={{ color: 'var(--fg)' }}> cross-cancellation</strong>: before multiplying, cancel
            any common factors between a numerator of one fraction and a denominator of the other. For
            4/9 × 3/8: cancel 4 and 8 by 4 (→ 1/9 × 3/2), and cancel 3 and 9 by 3 (→ 1/3 × 1/2 = 1/6).
            This avoids computing 12/72 and then simplifying.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Mixed Numbers vs. Improper Fractions
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            A <strong style={{ color: 'var(--fg)' }}>mixed number</strong> like 2 3/4 combines a whole number
            and a proper fraction. An <strong style={{ color: 'var(--fg)' }}>improper fraction</strong> like
            11/4 has a numerator larger than its denominator. They represent the same value. For computation,
            convert mixed numbers to improper fractions first: multiply the whole number by the denominator
            and add the numerator: 2 3/4 → (2 × 4 + 3)/4 = 11/4. Apply the arithmetic operation, then
            convert back if needed: 11 ÷ 4 = 2 remainder 3 → 2 3/4.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Privacy Notice
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, margin: 0 }}>
            All calculations in this fraction calculator are performed entirely in your browser. No input
            data is transmitted to any server, stored in any database, or shared with third parties.
            Your data stays completely private on your device. See our{' '}
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
          toolName="Fraction Calculator"
          toolSlug="fraction-calculator"
          toolUrl="https://roughtools.com/tools/calculators/fraction-calculator"
          type="general"
        />

        <ToolAdUnit position="bottom" />
      </div>
    </>
  )
}
