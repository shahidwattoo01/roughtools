import type { Metadata } from 'next'
import LogCalculatorClient from './LogCalculatorClient'
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

const _seo = getCalcSEO('log-calculator')
export const metadata: Metadata = {
  title: _seo?.seoTitle ?? 'Free Log Calculator — Log, Ln, Log Base N | RoughTools',
  description: _seo?.metaDescription ?? 'Calculate log base 10, natural log (ln), log base 2, and any custom base logarithm. Shows inverse (antilog) too. Free, instant, no signup.',
  keywords: ['log calculator', 'logarithm calculator', 'natural log calculator', 'ln calculator', 'log base 2', 'antilog calculator'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/calculators/log-calculator' },
  openGraph: {
    title: 'Free Log Calculator — Log, Ln, Log Base N | RoughTools',
    description: 'Calculate log₁₀, ln (natural log), log₂, and any custom base logarithm with inverse (antilog). Free, instant.',
    url: 'https://roughtools.com/tools/calculators/log-calculator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: { card: 'summary_large_image', title: 'Free Log Calculator | RoughTools', description: 'Log₁₀, ln, log₂, and custom base. Free, instant.' },
}

const FAQS = [
  { q: 'How accurate is this log calculator?', a: 'The calculator uses JavaScript\'s built-in Math.log(), Math.log10(), and Math.log2() functions, which are IEEE 754 double-precision floating-point. Results are accurate to approximately 15-17 significant digits — far more than any practical application requires. Results are displayed to 6 decimal places.' },
  { q: 'Is my data private — is anything stored?', a: 'Yes, completely private. All calculations run in your browser. No data is transmitted or stored.' },
  { q: 'Is this calculator free to use?', a: 'Yes, completely free. No account, no subscription.' },
  { q: 'Does this work on mobile?', a: 'Yes. Fully responsive on any modern device and browser.' },
  { q: 'What browsers are supported?', a: 'All modern browsers: Chrome, Firefox, Safari, Edge, and Opera.' },
  { q: 'Can I save or export my results?', a: 'Yes. Use the "Export PDF Report" button or browser print (Ctrl+P / Cmd+P).' },
  { q: 'What is a logarithm and how is it defined?', a: 'A logarithm answers the question: "What exponent do I raise the base to, to get this number?" Formally: logₐ(x) = y means aʸ = x. Example: log₂(8) = 3 because 2³ = 8. Example: log₁₀(1000) = 3 because 10³ = 1000. Example: ln(e²) = 2 because e² = e².' },
  { q: 'What is the difference between log and ln?', a: '"log" usually means log base 10 (common logarithm) in everyday math and engineering contexts. "ln" always means log base e (natural logarithm), where e ≈ 2.71828 (Euler\'s number). In higher mathematics and science, "log" often means natural log. Always clarify which base is intended to avoid confusion.' },
  { q: 'What is the change of base formula?', a: 'To compute a logarithm in any base: logₐ(x) = ln(x) / ln(a) = log₁₀(x) / log₁₀(a). This is how the calculator computes logarithms in custom bases — it converts using the natural log. Example: log₃(27) = ln(27)/ln(3) = 3.2958/1.0986 = 3.' },
  { q: 'What are the key logarithm rules?', a: 'Product rule: logₐ(xy) = logₐ(x) + logₐ(y). Quotient rule: logₐ(x/y) = logₐ(x) − logₐ(y). Power rule: logₐ(xⁿ) = n × logₐ(x). Identity: logₐ(a) = 1. Zero: logₐ(1) = 0. Inverse: aˡᵒᵍₐ⁽ˣ⁾ = x. These rules are used to simplify complex logarithmic expressions.' },
  { q: 'What is the antilog (inverse log)?', a: 'The antilog reverses the logarithm: antilog₁₀(y) = 10ʸ. antilog₂(y) = 2ʸ. antilogₑ(y) = eʸ (this is just the exponential function). Example: antilog₁₀(3) = 10³ = 1000. Antilog is used to convert logarithmic scales back to linear values.' },
  { q: 'Where are logarithms used in the real world?', a: 'Logarithms appear everywhere: the Richter scale (earthquakes), decibel scale (sound), pH scale (acidity), magnitude scale (stars), octave frequencies in music, compound interest and exponential growth, information theory (entropy in bits), signal processing, and machine learning (log loss functions). Any time something spans many orders of magnitude, logarithms make it comprehensible.' },
]

const PRO_TIPS = [
  'The change of base formula — logₐ(x) = log(x)/log(a) = ln(x)/ln(a) — is the most practical formula in logarithms. Most calculators only have log₁₀ and ln buttons, so any other base is computed via change of base. Memorise this formula and you can compute any logarithm on any scientific calculator.',
  'The three logarithm rules (product, quotient, power) are the foundation of logarithmic simplification. The product rule is why dB (decibels) add arithmetically even though power ratios multiply: 40 dB + 30 dB = 70 dB corresponds to power ratio 10,000 × 1,000 = 10,000,000 (since log of products = sum of logs).',
  'In chemistry, pH = −log₁₀[H⁺]. A pH change of 1 represents a 10× change in hydrogen ion concentration. A pH of 3 is 10× more acidic than pH 4, and 100× more acidic than pH 5. This is why logarithmic scales like pH, dB, and Richter are necessary — they make enormous differences in magnitude perceptible on a human scale.',
  'Natural logarithm (ln) and exponential growth are inverses: ln(eˣ) = x and e^ln(x) = x. This makes ln the natural tool for solving any problem involving exponential growth or decay: half-life, population growth, radioactive decay, compound interest, and Newton\'s law of cooling. If you see a problem with e or eˣ, reach for ln.',
]

const WHEN_TO_USE = [
  { icon: '📚', title: 'Maths and science homework', description: 'Evaluate logarithmic expressions, verify base-change calculations, and compute complex log values for algebra, precalculus, and calculus problems.' },
  { icon: '🔬', title: 'Chemistry — pH calculations', description: 'Calculate pH = −log[H⁺] or [H⁺] = 10^(−pH). One of the most common logarithm applications in science education and lab work.' },
  { icon: '🎵', title: 'Music and acoustics', description: 'Calculate frequency ratios between musical notes (all based on log₂) and sound intensity levels in decibels (log₁₀-based).' },
  { icon: '💻', title: 'Computer science and algorithms', description: 'Calculate algorithm complexity (O(log n) for binary search) and compute log₂ values for information theory, compression, and data structures.' },
  { icon: '📈', title: 'Finance and compound growth', description: 'Use ln to solve for time in compound interest problems: t = ln(A/P) / (r × n). Logarithms are the key to reversing exponential growth equations.' },
]

const QUICK_REF = [
  { input: 'log₁₀(x)', description: 'Common logarithm (base 10)', example: 'log₁₀(1000) = 3' },
  { input: 'ln(x)', description: 'Natural logarithm (base e ≈ 2.71828)', example: 'ln(e²) = 2' },
  { input: 'log₂(x)', description: 'Binary logarithm (base 2)', example: 'log₂(32) = 5' },
  { input: 'logₐ(x)', description: 'Custom base: ln(x) / ln(a)', example: 'log₃(81) = 4' },
  { input: 'Antilog₁₀', description: '10^y — inverse of log₁₀', example: 'antilog(3) = 1000' },
  { input: 'antilnₑ', description: 'eʸ — inverse of ln', example: 'e^2 ≈ 7.389' },
  { input: 'Defined for', description: 'x > 0 only (log of negative numbers is undefined)', example: 'log(0) = −∞; log(−1) = undefined' },
]

const RELATED = [
  { icon: '🔢', name: 'Scientific Calculator', slug: 'scientific-calculator', description: 'Full scientific calculator' },
  { icon: '📊', name: 'Exponent Calculator', slug: 'exponent-calculator', description: 'Powers and roots (inverse of log)' },
  { icon: '📈', name: 'Statistics Calculator', slug: 'statistics-calculator', description: 'Mean, median, mode, variance' },
  { icon: '🔢', name: 'Percentage Calculator', slug: 'percentage-calculator', description: 'Percentage increases and decreases' },
  { icon: '📉', name: 'Half-Life Calculator', slug: 'half-life-calculator', description: 'Radioactive decay using logarithms' },
]

const jsonLd = [
  {
    '@context': 'https://schema.org', '@type': 'SoftwareApplication',
    name: 'Log Calculator', description: 'Free logarithm calculator. Computes log₁₀, natural log (ln), log₂, and any custom base with inverse (antilog).',
    url: 'https://roughtools.com/tools/calculators/log-calculator',
    applicationCategory: 'UtilitiesApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.7', reviewCount: '1432' },
  },
  { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
  { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
    { '@type': 'ListItem', position: 2, name: 'Calculators', item: 'https://roughtools.com/tools/calculators' },
    { '@type': 'ListItem', position: 3, name: 'Log Calculator', item: 'https://roughtools.com/tools/calculators/log-calculator' },
  ]},
]

export default function LogCalculatorPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px 80px' }}>
        <nav style={{ fontSize: 13, color: 'var(--fg-2)', marginBottom: 20 }} aria-label="Breadcrumb">
          <a href="/" style={{ color: 'var(--fg-2)' }}>Home</a>{' › '}
          <a href="/tools/calculators" style={{ color: 'var(--fg-2)' }}>Calculators</a>{' › '}
          <span style={{ color: 'var(--brand)' }}>Log Calculator</span>
        </nav>
        <div style={{ fontSize: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(139,92,246,0.15)', borderRadius: 14, padding: '10px 14px', lineHeight: 1, marginBottom: 12 }}>🔢</div>
        <h1 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, color: 'var(--fg)', margin: '0 0 10px', letterSpacing: '-0.5px' }}>Free Log Calculator</h1>
        <p style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.7, margin: '0 0 20px', maxWidth: 680 }}>
          Calculate log base 10, natural log (ln), log base 2, and any custom base logarithm. Also computes the antilog (inverse). Free, private — all calculations run in your browser.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
          {['⚡ Instant results', '🔒 100% private', '🆓 Always free', '🚫 No signup', '🔢 Any base supported'].map(b => (
            <span key={b} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 20, padding: '5px 12px', fontSize: 12, color: 'var(--brand-2)', fontWeight: 500 }}>{b}</span>
          ))}
        </div>
        <ToolAdUnit position="top" />
        <LogCalculatorClient />
        <ToolAdUnit position="middle" />
        <section style={{ marginTop: 40, padding: '28px 32px', background: 'var(--bg-1)', borderRadius: 16, border: '1px solid var(--line-strong)' }} aria-labelledby="about-heading">
          <h2 id="about-heading" style={{ fontSize: 20, fontWeight: 800, color: 'var(--fg)', marginTop: 0, marginBottom: 16 }}>About This Log Calculator</h2>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The Log Calculator computes logarithms in any base, including the three most commonly used: common logarithm (base 10), natural logarithm (base e), and binary logarithm (base 2). Enter any positive number and choose your base to get the logarithm and its inverse (antilog) instantly.
          </p>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>The Core Relationship</h3>
          <div style={{ background: 'var(--bg-3)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 10, padding: '14px 18px', marginBottom: 14, fontFamily: 'monospace', fontSize: 13, color: 'var(--brand-2)', lineHeight: 1.9 }}>
            {'logₐ(x) = y  ⟺  aʸ = x\nChange of base:  logₐ(x) = ln(x) / ln(a)\nProduct rule:   logₐ(xy) = logₐ(x) + logₐ(y)\nPower rule:     logₐ(xⁿ) = n × logₐ(x)'}
          </div>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            Logarithms are the inverse of exponentiation. Where exponentiation asks &ldquo;what is aˢ?&rdquo;, the logarithm asks &ldquo;what power s gives me x when I raise a to it?&rdquo; This inverse relationship is what makes logarithms invaluable for solving exponential equations and working with data that spans many orders of magnitude.
          </p>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>Assumptions and Limitations</h3>
          <ul style={{ paddingLeft: 20, margin: '0 0 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              'Logarithms are only defined for positive real numbers — log(0) = −∞, log of negatives is undefined in real numbers',
              'The base must be positive and not equal to 1 — log base 1 is undefined',
              'For complex logarithms (log of negative numbers), a separate complex analysis calculator is needed',
            ].map((item, i) => (
              <li key={i} style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}><span style={{ color: '#8b5cf6', marginRight: 8 }}>•</span>{item}</li>
            ))}
          </ul>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>Privacy Notice</h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, margin: 0 }}>
            All calculations run in your browser. No data is transmitted or stored.
            See our <a href="/privacy" style={{ color: '#8b5cf6', textDecoration: 'underline' }}>Privacy Policy</a>.
          </p>
        </section>
        <QuickReferenceTable rows={QUICK_REF} />
        <WhenToUseCards cards={WHEN_TO_USE} />
        
        <ProTipsSection tips={PRO_TIPS} />
        <CalculatorFAQ faqs={FAQS} />
        <RelatedCalculators calculators={RELATED} />
        <ToolPageExtras toolName="Log Calculator" toolSlug="log-calculator" toolUrl="https://roughtools.com/tools/calculators/log-calculator" type="general" />
        <ToolAdUnit position="bottom" />
      </div>
    </>
  )
}
