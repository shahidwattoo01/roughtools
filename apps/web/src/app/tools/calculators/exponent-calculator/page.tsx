import type { Metadata } from 'next'
import ExponentCalculatorClient from './ExponentCalculatorClient'
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

const _seo = getCalcSEO('exponent-calculator')
export const metadata: Metadata = {
  title: _seo?.seoTitle ?? 'Free Exponent Calculator | RoughTools',
  description: _seo?.metaDescription ?? 'Calculate any base raised to any exponent. Includes square roots, cube roots, nth roots, negative and fractional exponents. Free, instant, no signup.',
  keywords: ['exponent calculator', 'power calculator', 'square root calculator', 'cube root calculator', 'nth root calculator'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/calculators/exponent-calculator' },
  openGraph: {
    title: 'Free Exponent Calculator | RoughTools',
    description: 'Calculate powers, roots, and fractional exponents instantly. Free, no signup.',
    url: 'https://roughtools.com/tools/calculators/exponent-calculator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Exponent Calculator | RoughTools',
    description: 'Calculate powers, square roots, cube roots, and factorials.',
  },
}

// ─── FAQ data ─────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: 'How accurate is this exponent calculator?',
    a: 'Results are computed using JavaScript\'s native floating-point arithmetic (IEEE 754 double precision), which provides approximately 15–17 significant decimal digits of accuracy. For everyday scientific, engineering, and academic work this is more than sufficient. For very large exponents (e.g., 10^308), results may show Infinity, and very small results may round to 0.',
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
    a: 'Yes. Use the "Export PDF" button to download a formatted PDF of your inputs and results. You can also use your browser\'s print function (Ctrl+P or Cmd+P) to save as PDF.',
  },
  {
    q: 'Do I need professional advice to use this calculator?',
    a: 'No professional advice is needed for standard exponent calculations. If you are using exponent results in engineering safety calculations, financial projections, or scientific research, verify your inputs and methodology with a qualified professional in the relevant field.',
  },
  {
    q: 'What formula does this calculator use?',
    a: 'The core formula is xⁿ — the base x multiplied by itself n times. For negative exponents: x⁻ⁿ = 1/xⁿ. For fractional exponents: x^(m/n) = the nth root of xᵐ, so x^(1/2) = √x and x^(1/3) = ∛x. Any number raised to the power 0 equals 1 (x⁰ = 1, except the debated case of 0⁰).',
  },
  {
    q: 'What is e (Euler\'s number) and why is it important?',
    a: 'Euler\'s number e ≈ 2.71828 is the base of the natural logarithm and arguably the most important constant in mathematics. It appears naturally in continuous growth and decay processes: compound interest with continuous compounding uses eʳᵗ, radioactive decay uses e⁻ᵏᵗ, and the normal distribution formula contains e. It is the unique base where the derivative of eˣ equals eˣ itself.',
  },
  {
    q: 'What does a negative exponent mean?',
    a: 'A negative exponent means take the reciprocal of the positive power. x⁻ⁿ = 1/xⁿ. For example, 2⁻³ = 1/2³ = 1/8 = 0.125. This is not the same as a negative result — 2⁻³ is positive. Negative exponents are used extensively in scientific notation (e.g., 3.5 × 10⁻⁶ = 0.0000035) and in physics formulas.',
  },
  {
    q: 'What do fractional exponents mean?',
    a: 'A fractional exponent represents a root. x^(1/n) = the nth root of x. So x^(1/2) = √x, x^(1/3) = ∛x, and x^(m/n) = the nth root of xᵐ. For example, 8^(2/3) = (∛8)² = 2² = 4. Fractional exponents are useful because they obey all the standard exponent laws, making algebra with roots much cleaner.',
  },
  {
    q: 'What happens when you raise any number to the power of 0?',
    a: 'Any non-zero number raised to the power 0 equals 1. This follows from the quotient rule: xⁿ / xⁿ = x^(n-n) = x⁰ = 1. The case of 0⁰ is mathematically debated — in combinatorics and discrete math it is typically defined as 1 for convenience, but in analysis it is often left undefined because the limit depends on how you approach zero.',
  },
  {
    q: 'What happens with very large exponents — can results overflow?',
    a: 'Yes. JavaScript (and most programming languages) represent numbers as 64-bit floating point, with a maximum value of approximately 1.8 × 10³⁰⁸. Any result larger than this overflows to Infinity. For extremely large integer exponents, consider using arbitrary-precision math libraries. For context, a googol (10¹⁰⁰) and a googolplex (10^(10¹⁰⁰)) both overflow standard floating-point arithmetic.',
  },
]

// ─── Pro Tips ─────────────────────────────────────────────────────────────────

const PRO_TIPS = [
  'A fractional exponent is equivalent to a root: x^(1/2) = √x, x^(1/3) = ∛x, x^(1/n) = nth root of x. This means you can compute any root using this calculator by entering a fractional exponent. For example, the 5th root of 32 = 32^(1/5) = 32^0.2 = 2.',
  'A negative exponent means the reciprocal of the positive power: x⁻ⁿ = 1/xⁿ. This is especially useful in scientific notation — 10⁻³ = 0.001 (milli-), 10⁻⁶ = 0.000001 (micro-), 10⁻⁹ = 0.000000001 (nano-). Memorising common negative powers of 10 saves enormous time in physics and chemistry.',
  'The logarithm is the inverse of the exponent. If bⁿ = x, then log_b(x) = n. This means exponents and logarithms solve opposite problems: exponents tell you the result, logarithms tell you the power. Use the Log Calculator when you know the result and need to find the exponent.',
  'Scientific notation uses powers of 10 to express very large or small numbers compactly. Avogadro\'s number (6.022 × 10²³), the speed of light (3 × 10⁸ m/s), and a proton\'s mass (1.67 × 10⁻²⁷ kg) are all exponent-based. Learning to multiply and divide numbers in scientific notation by adding and subtracting exponents is one of the most practical STEM skills.',
]

// ─── When to Use ─────────────────────────────────────────────────────────────

const WHEN_TO_USE = [
  {
    icon: '💰',
    title: 'Compound interest calculation',
    description: 'Compound interest uses the formula A = P(1+r)ⁿ — a direct application of exponentiation. Calculate how an investment grows over years using this calculator to verify spreadsheet results.',
  },
  {
    icon: '⚡',
    title: 'Physics energy equations',
    description: 'Kinetic energy (KE = ½mv²), Einstein\'s E=mc², and wave power all involve exponents. Verify physics homework or engineering calculations quickly.',
  },
  {
    icon: '💾',
    title: 'Computer storage and memory sizes',
    description: 'Memory and storage sizes are always powers of 2: 2¹⁰ = 1 KB, 2²⁰ = 1 MB, 2³⁰ = 1 GB. Use this calculator to convert between powers of 2 and their decimal equivalents.',
  },
  {
    icon: '📈',
    title: 'Population and exponential growth models',
    description: 'Population growth, bacterial colony size, and viral spread follow exponential models. Plug in growth rate and time to project future values.',
  },
  {
    icon: '☢️',
    title: 'Exponential decay',
    description: 'Radioactive decay, drug concentration, and capacitor discharge all use exponential decay formulas with negative exponents. Cross-check your half-life calculations.',
  },
]

// ─── Quick Reference table ────────────────────────────────────────────────────

const QUICK_REF = [
  { input: 'Base (x)', description: 'The number being raised to a power', example: '2, 10, e ≈ 2.718' },
  { input: 'Exponent (n)', description: 'The power to raise the base to', example: '3, -2, 0.5, 1/3' },
  { input: 'Result (xⁿ)', description: 'The computed value of x raised to n', example: '2³ = 8' },
  { input: 'Negative exponent', description: 'x⁻ⁿ = 1/xⁿ — the reciprocal', example: '2⁻³ = 0.125' },
  { input: 'Fractional exponent', description: 'x^(1/n) = nth root of x', example: '8^(1/3) = 2' },
  { input: 'Zero exponent', description: 'Any non-zero base to the power 0 = 1', example: '7⁰ = 1' },
  { input: 'Special: x⁰', description: 'Always 1 (for x ≠ 0)', example: '100⁰ = 1' },
  { input: 'Special: 0ⁿ', description: '0 for any positive n; undefined for n ≤ 0', example: '0⁵ = 0' },
]

// ─── Related calculators ──────────────────────────────────────────────────────

const RELATED = [
  { icon: '📉', name: 'Log Calculator', slug: 'log-calculator', description: 'Inverse of exponents — find the power' },
  { icon: '🧮', name: 'Scientific Calculator', slug: 'scientific-calculator', description: 'Advanced math functions and operations' },
  { icon: '💰', name: 'Compound Interest Calculator', slug: 'compound-interest-calculator', description: 'Exponential growth of investments' },
  { icon: '☢️', name: 'Half-Life Calculator', slug: 'half-life-calculator', description: 'Exponential decay and radioactive substances' },
]

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Exponent Calculator',
    description: 'Free exponent calculator. Calculate any base raised to any power, including negative, fractional, and zero exponents.',
    url: 'https://roughtools.com/tools/calculators/exponent-calculator',
    applicationCategory: 'UtilitiesApplication',
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
      { '@type': 'ListItem', position: 3, name: 'Exponent Calculator', item: 'https://roughtools.com/tools/calculators/exponent-calculator' },
    ],
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ExponentCalculatorPage() {
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
          <span style={{ color: 'var(--brand)' }}>Exponent Calculator</span>
        </nav>

        {/* H1 */}
        <div style={{ fontSize: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(139,92,246,0.15)', borderRadius: 14, padding: '10px 14px', lineHeight: 1, marginBottom: 12 }}>
          ⚡
        </div>
        <h1 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, color: 'var(--fg)', margin: '0 0 10px', letterSpacing: '-0.5px' }}>
          Free Exponent Calculator
        </h1>
        <p style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.7, margin: '0 0 20px', maxWidth: 680 }}>
          Calculate any base raised to any exponent — positive, negative, fractional, or zero.
          Includes square roots, cube roots, and nth roots. Free, private — all calculations run in your browser.
        </p>

        {/* Trust badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
          {['⚡ Instant results', '🔒 100% private', '🆓 Always free', '🚫 No signup', '🔢 Fractional exponents'].map(b => (
            <span key={b} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)',
              borderRadius: 20, padding: '5px 12px', fontSize: 12, color: 'var(--brand-2)', fontWeight: 500,
            }}>{b}</span>
          ))}
        </div>

        <ToolAdUnit position="top" />

        {/* Calculator widget */}
        <ExponentCalculatorClient />

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
            About This Exponent Calculator
          </h2>

          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The Exponent Calculator computes any base raised to any power, including positive integers, negative integers,
            decimals, and fractions. It handles the full range of exponent types used in mathematics, science, engineering,
            and finance — making it an essential tool for students studying algebra, physics teachers verifying examples,
            and developers computing memory sizes or growth rates.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            The Formula
          </h3>
          <div style={{ background: 'var(--bg-3)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 10, padding: '14px 18px', marginBottom: 14, fontFamily: 'monospace', fontSize: 13, color: 'var(--brand-2)' }}>
            xⁿ = x × x × x × … (n times)<br />
            x⁻ⁿ = 1 / xⁿ<br />
            x^(1/n) = nth root of x<br />
            x⁰ = 1 (for x ≠ 0)
          </div>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Positive, Negative, and Fractional Exponents
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            A positive integer exponent is repeated multiplication: 2⁴ = 2×2×2×2 = 16. A negative exponent produces the
            reciprocal: 2⁻⁴ = 1/16 = 0.0625. Fractional exponents represent roots: x^(1/2) = √x, x^(1/3) = ∛x. A combined
            fractional exponent like x^(m/n) means take the nth root of x, then raise it to the mth power — or equivalently,
            raise x to the mth power first, then take the nth root. Both orderings give the same result.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Scientific Notation and Real-World Use
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            Scientific notation expresses numbers as a coefficient times a power of 10: the speed of light is 3 × 10⁸ m/s,
            Avogadro&apos;s number is 6.022 × 10²³, and a nanometre is 10⁻⁹ metres. Exponentiation also drives compound interest
            (A = P(1+r)ⁿ), population growth models (P = P₀eʳᵗ), radioactive decay (N = N₀e⁻ᵏᵗ), and digital storage
            (1 GB = 2³⁰ bytes). Wherever growth or decay happens at a constant percentage rate, exponents are the tool.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Relationship to Logarithms
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The logarithm is the inverse operation of exponentiation. If bⁿ = x, then log_b(x) = n. This means: exponents
            answer &quot;what is the result of raising b to the n?&quot;, while logarithms answer &quot;what power of b gives x?&quot;. They are
            mirror images, used together constantly in physics, information theory, and finance.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Privacy Notice
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, margin: 0 }}>
            All calculations in this exponent calculator are performed entirely in your browser. No data you enter is transmitted to any server,
            stored in any database, or shared with third parties. See our{' '}
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
          toolName="Exponent Calculator"
          toolSlug="exponent-calculator"
          toolUrl="https://roughtools.com/tools/calculators/exponent-calculator"
          type="general"
        />

        <ToolAdUnit position="bottom" />
      </div>
    </>
  )
}
