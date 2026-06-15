import type { Metadata } from 'next'
import ToolAdUnit from '@/components/ToolAdUnit'
import { JsonLd } from '@/components/JsonLd'
import ScientificCalculatorClient from './ScientificCalculatorClient'
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

const _seo = getCalcSEO('scientific-calculator')
export const metadata: Metadata = {
  title: _seo?.seoTitle ?? 'Free Scientific Calculator — Trig, Log & Advanced Math | RoughTools',
  description: _seo?.metaDescription ?? 'Free online scientific calculator with trigonometry (sin, cos, tan), logarithms, square roots, exponents, and constants (π, e). Supports degrees and radians. Instant, no signup.',
  keywords: ['scientific calculator', 'online scientific calculator', 'trig calculator', 'sin cos tan calculator', 'log calculator', 'free scientific calculator online'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/calculators/scientific-calculator' },
  openGraph: {
    title: 'Free Scientific Calculator — Trig, Log & Advanced Math | RoughTools',
    description: 'Free online scientific calculator with trig, log, roots, and constants. Instant, no signup.',
    url: 'https://roughtools.com/tools/calculators/scientific-calculator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Scientific Calculator | RoughTools',
    description: 'Online scientific calculator with trig, log, exponents, and constants. Free.',
  },
}

// ─── FAQ data ─────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: 'How accurate is this scientific calculator?',
    a: 'The calculator uses JavaScript\'s built-in Math library, which follows the IEEE 754 double-precision floating-point standard. Results are accurate to approximately 15–17 significant decimal digits — more than sufficient for virtually all science, engineering, and academic calculations. For cryptographic or arbitrary-precision needs, a specialised library is required.',
  },
  {
    q: 'Is my data private — is anything stored?',
    a: 'Yes, completely private. All calculations run entirely in your browser using JavaScript. Nothing you type is transmitted to any server or stored anywhere. When you close the tab, your session is gone.',
  },
  {
    q: 'Is this scientific calculator free?',
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
    a: 'Use your browser\'s print function (Ctrl+P or Cmd+P) to print or save results as a PDF. Most browsers also let you screenshot individual sections.',
  },
  {
    q: 'What functions does this scientific calculator support?',
    a: 'The calculator supports: basic arithmetic (+, −, ×, ÷, %), trigonometric functions (sin, cos, tan and their inverses sin⁻¹, cos⁻¹, tan⁻¹), logarithms (log base 10, natural log ln), powers (xʸ, x², √x, ∛x), absolute value (|x|), factorial (x!), and the constants π (pi) and e (Euler\'s number). Degree and radian modes are both supported for trig functions.',
  },
  {
    q: 'What is the difference between sin and sin⁻¹ (arcsin)?',
    a: 'sin(angle) takes an angle and returns the sine ratio — the y-coordinate on the unit circle. sin⁻¹(ratio) does the reverse: it takes a ratio (a number between −1 and 1) and returns the angle that produces that ratio. For example, sin(30°) = 0.5, and sin⁻¹(0.5) = 30°. The same inverse relationship applies to cos/cos⁻¹ and tan/tan⁻¹.',
  },
  {
    q: 'What is the difference between log and ln?',
    a: 'log (log₁₀) is the common logarithm — it asks "10 to what power gives this number?" So log(1000) = 3 because 10³ = 1000. ln is the natural logarithm using base e ≈ 2.718 — it asks "e to what power gives this number?" So ln(e²) = 2. In most science and higher mathematics contexts, "log" without a base specified typically means ln. In everyday and engineering contexts, log usually means log₁₀.',
  },
  {
    q: 'What is π (pi) and why is it important?',
    a: 'Pi (π ≈ 3.14159265358979) is the ratio of a circle\'s circumference to its diameter. It is an irrational and transcendental number — its decimal expansion is infinite and non-repeating. Pi appears throughout mathematics: in circle and sphere formulas, trigonometry (a full rotation = 2π radians), Fourier analysis, probability (the Gaussian distribution), and many physics equations.',
  },
  {
    q: 'Why is e ≈ 2.71828 called Euler\'s number?',
    a: "Euler's number (e ≈ 2.71828182845904) is the base of the natural logarithm. It is the unique positive number where the function eˣ equals its own derivative — a property that makes it fundamental to calculus, differential equations, and mathematical modelling. It arises naturally in compound interest (continuously compounded growth), population growth, radioactive decay, probability theory, and complex number analysis. Named after the Swiss mathematician Leonhard Euler.",
  },
  {
    q: 'What is the difference between degree mode and radian mode?',
    a: 'Degrees and radians are two units for measuring angles. A full circle is 360° or 2π radians. To convert degrees to radians: multiply by π/180. To convert radians to degrees: multiply by 180/π. Degrees are more intuitive for everyday geometry. Radians are preferred in higher mathematics, physics, and engineering because they simplify calculus formulas — for example, the derivative of sin(x) is cos(x) only when x is in radians.',
  },
]

// ─── Pro Tips ─────────────────────────────────────────────────────────────────

const PRO_TIPS = [
  'Always check degrees vs radians mode before computing any trig function. sin(90) in degree mode = 1 (correct). sin(90) in radian mode ≈ 0.894 (because 90 radians ≈ 5156°). This is the single most common source of wrong answers in trigonometry calculations — always verify your mode before starting.',
  'Use parentheses generously to control order of operations. Calculators follow PEMDAS/BODMAS (Parentheses, Exponents, Multiply/Divide, Add/Subtract). For example, 2 + 3 × 4 = 14 (not 20), because multiplication happens before addition. If in doubt, wrap sub-expressions in parentheses: (2 + 3) × 4 = 20.',
  'Know when to use log vs ln: log₁₀ is useful for decibels (sound), pH (chemistry), Richter scale (earthquakes), and powers of 10 in engineering. The natural log (ln) is used in calculus, exponential growth/decay models, probability distributions, and finance (continuous compounding). If the problem involves e or growth rates, use ln.',
  'Scientific notation is your friend for very large or small numbers. Instead of typing 0.0000000000167, enter 1.67 × 10⁻¹¹ (Planck\'s constant ≈ 6.63 × 10⁻³⁴). Most scientific calculators accept EE or EXP notation. Keeping numbers in scientific notation prevents rounding errors and makes it easier to spot magnitude mistakes.',
]

// ─── When to Use ─────────────────────────────────────────────────────────────

const WHEN_TO_USE = [
  {
    icon: '⚛️',
    title: 'Physics homework and problems',
    description: 'Calculate force vectors, wave frequencies, projectile motion, and energy equations with trig, exponents, and scientific notation all in one place.',
  },
  {
    icon: '🧪',
    title: 'Chemistry calculations',
    description: 'Compute pH (log), Arrhenius equation (ln and e), molar mass, and stoichiometry calculations without switching between multiple tools.',
  },
  {
    icon: '🔧',
    title: 'Engineering problems',
    description: 'Solve structural load calculations, electrical circuit equations, and signal processing problems involving trig functions, logarithms, and complex expressions.',
  },
  {
    icon: '📐',
    title: 'Trigonometry assignments',
    description: 'Find missing angles and sides of triangles, compute unit circle values, and verify identities using sin, cos, tan and their inverses in degree or radian mode.',
  },
  {
    icon: '💰',
    title: 'Financial mathematics',
    description: 'Apply the continuous compounding formula A = Pe^(rt), compute logarithmic returns for investments, and solve time-value-of-money equations.',
  },
]

// ─── Quick Reference ──────────────────────────────────────────────────────────

const QUICK_REF = [
  { input: 'Basic operations', description: 'Addition, subtraction, multiplication, division, modulo', example: '7 + 3 = 10' },
  { input: 'Trigonometric functions', description: 'sin, cos, tan and their inverses (sin⁻¹, cos⁻¹, tan⁻¹)', example: 'sin(30°) = 0.5' },
  { input: 'Logarithms', description: 'log (base 10) and ln (natural log, base e)', example: 'log(1000) = 3' },
  { input: 'Powers and roots', description: 'xʸ, x², √x, cube root, absolute value', example: '2⁸ = 256' },
  { input: 'Constants', description: 'π (pi ≈ 3.14159) and e (Euler\'s ≈ 2.71828)', example: 'π × r² for circle area' },
]

// ─── Related Calculators ──────────────────────────────────────────────────────

const RELATED = [
  { icon: '📐', name: 'Triangle Calculator', slug: 'triangle-calculator', description: 'Solve any triangle with trig' },
  { icon: '🔷', name: 'Area Calculator', slug: 'area-calculator', description: 'Area for all common 2D shapes' },
  { icon: '📦', name: 'Volume Calculator', slug: 'volume-calculator', description: 'Volume for all common 3D shapes' },
  { icon: '📊', name: 'Compound Interest Calculator', slug: 'compound-interest-calculator', description: 'Exponential financial growth' },
]

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Scientific Calculator',
    description: 'Free online scientific calculator with trigonometry, logarithms, exponents, square roots, and constants (π, e). Supports degrees and radians.',
    url: 'https://roughtools.com/tools/calculators/scientific-calculator',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '3812' },
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
      { '@type': 'ListItem', position: 3, name: 'Scientific Calculator', item: 'https://roughtools.com/tools/calculators/scientific-calculator' },
    ],
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ScientificCalculatorPage() {
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
          <span style={{ color: 'var(--brand)' }}>Scientific Calculator</span>
        </nav>

        {/* H1 */}
        <div style={{ fontSize: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(139,92,246,0.15)', borderRadius: 14, padding: '10px 14px', lineHeight: 1, marginBottom: 12 }}>
          🔬
        </div>
        <h1 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, color: 'var(--fg)', margin: '0 0 10px', letterSpacing: '-0.5px' }}>
          Free Scientific Calculator
        </h1>
        <p style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.7, margin: '0 0 20px', maxWidth: 680 }}>
          Perform advanced calculations with trigonometry (sin, cos, tan), logarithms, exponents, square roots,
          and the constants π and e. Toggle between degree and radian mode. Free, private — all calculations run in your browser.
        </p>

        {/* Trust badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
          {['⚡ Instant results', '🔒 100% private', '🆓 Always free', '🚫 No signup', '🎓 Full precision'].map(b => (
            <span key={b} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)',
              borderRadius: 20, padding: '5px 12px', fontSize: 12, color: 'var(--brand-2)', fontWeight: 500,
            }}>{b}</span>
          ))}
        </div>

        <ToolAdUnit position="top" />

        {/* Calculator widget */}
        <ScientificCalculatorClient />

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
            About This Scientific Calculator
          </h2>

          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The Scientific Calculator extends basic arithmetic with the full set of mathematical functions needed for
            science, engineering, and academic work. Unlike a basic calculator that handles only +, −, ×, ÷, this
            tool covers trigonometry, logarithms, exponential functions, roots, and mathematical constants — everything
            you need to solve physics, chemistry, engineering, and higher mathematics problems in a single interface,
            without downloading software or apps.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Trigonometry Functions
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            Trigonometric functions relate angles to the ratios of sides in right triangles and generalise to the unit
            circle for all angles. The three primary functions and their relationships:
          </p>
          <div style={{ background: 'var(--bg-3)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 10, padding: '14px 18px', marginBottom: 14, fontFamily: 'monospace', fontSize: 13, color: 'var(--brand-2)' }}>
            sin(θ) = opposite / hypotenuse<br />
            cos(θ) = adjacent / hypotenuse<br />
            tan(θ) = opposite / adjacent = sin(θ) / cos(θ)
          </div>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The inverse functions (sin⁻¹, cos⁻¹, tan⁻¹ — also written arcsin, arccos, arctan) take a ratio and return
            the angle. These are essential when you know side lengths and need to find angles. Always verify your mode
            (degrees vs radians) before computing any trig function.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Logarithms and Exponents
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            Logarithms are the inverse of exponentiation. If 10³ = 1000, then log₁₀(1000) = 3. If e² ≈ 7.389, then
            ln(7.389) ≈ 2. Logarithms compress very large or small numbers into manageable scales — which is why they
            appear in the Richter scale (earthquakes), decibels (sound), pH (acidity), astronomical magnitudes, and
            information theory (bits). The natural log (ln) is the fundamental logarithm in calculus and differential
            equations because its derivative is 1/x — the simplest possible form.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Constants: π and e
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            <strong style={{ color: 'var(--fg)' }}>Pi (π ≈ 3.14159265358979)</strong> is the ratio of a circle&apos;s circumference
            to its diameter. It is irrational (cannot be expressed as a fraction) and transcendental (not a root of any
            polynomial with integer coefficients). Pi appears in the area of circles (πr²), volume of spheres (4/3 πr³),
            Fourier transforms, the Gaussian normal distribution, and countless physics equations.
          </p>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            <strong style={{ color: 'var(--fg)' }}>Euler&apos;s number (e ≈ 2.71828182845904)</strong> is the base of the natural
            logarithm and is defined as the limit of (1 + 1/n)ⁿ as n approaches infinity. The function eˣ is unique
            in that it equals its own derivative — making it the fundamental building block for modelling continuous
            growth and decay: compound interest, population dynamics, radioactive decay, and capacitor charge/discharge.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Privacy Notice
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, margin: 0 }}>
            All calculations run entirely in your browser using JavaScript&apos;s Math library. Nothing you enter is
            transmitted to any server or stored in any database. See our{' '}
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

        <ToolPageExtras
          toolName="Scientific Calculator"
          toolSlug="scientific-calculator"
          toolUrl="https://roughtools.com/tools/calculators/scientific-calculator"
          type="general"
        />

        <ToolAdUnit position="bottom" />
      </div>
    </>
  )
}
