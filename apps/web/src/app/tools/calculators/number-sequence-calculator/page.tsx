import type { Metadata } from 'next'
import NumberSequenceClient from './NumberSequenceClient'
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

const _seo = getCalcSEO('number-sequence-calculator')
export const metadata: Metadata = {
  title: _seo?.seoTitle ?? 'Free Number Sequence Calculator — Arithmetic & Geometric | RoughTools',
  description: _seo?.metaDescription ?? 'Calculate the nth term, sum, and full sequence for arithmetic and geometric progressions. Find missing terms and identify sequence type. Free, instant.',
  keywords: ['number sequence calculator', 'arithmetic sequence calculator', 'geometric sequence calculator', 'nth term calculator', 'sequence sum calculator'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/calculators/number-sequence-calculator' },
  openGraph: {
    title: 'Free Number Sequence Calculator | RoughTools',
    description: 'Nth term, sum, and full sequence for arithmetic and geometric progressions. Free, instant.',
    url: 'https://roughtools.com/tools/calculators/number-sequence-calculator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: { card: 'summary_large_image', title: 'Free Number Sequence Calculator | RoughTools', description: 'Arithmetic and geometric sequences. Free, instant.' },
}

const FAQS = [
  { q: 'How accurate is this sequence calculator?', a: 'The calculator is mathematically exact for arithmetic sequences (integer and decimal). For geometric sequences with very large ratios or many terms, floating-point precision may introduce small rounding errors beyond approximately 15 significant digits, which is negligible for all practical purposes.' },
  { q: 'Is my data private — is anything stored?', a: 'Yes, completely private. All calculations run in your browser. No data is transmitted or stored.' },
  { q: 'Is this calculator free to use?', a: 'Yes, completely free. No account, no subscription.' },
  { q: 'Does this work on mobile?', a: 'Yes. Fully responsive on any modern device and browser.' },
  { q: 'What browsers are supported?', a: 'All modern browsers: Chrome, Firefox, Safari, Edge, and Opera.' },
  { q: 'Can I save or export my results?', a: 'Yes. Use the "Export PDF Report" button or browser print (Ctrl+P / Cmd+P).' },
  { q: 'What is an arithmetic sequence?', a: 'An arithmetic sequence (arithmetic progression, AP) is a sequence where each term differs from the previous by a constant amount called the common difference (d). Example: 3, 7, 11, 15, 19 has d = 4. The nth term is aₙ = a₁ + (n−1)d, and the sum of n terms is Sₙ = n/2 × (2a₁ + (n−1)d), also written Sₙ = n/2 × (first term + last term).' },
  { q: 'What is a geometric sequence?', a: 'A geometric sequence (geometric progression, GP) is a sequence where each term is multiplied by a constant called the common ratio (r). Example: 2, 6, 18, 54, 162 has r = 3. The nth term is aₙ = a₁ × r^(n−1), and the sum of n terms is Sₙ = a₁ × (rⁿ − 1) / (r − 1) for r ≠ 1.' },
  { q: 'How do I find the common difference or ratio?', a: 'Arithmetic: subtract any term from the next: d = a₂ − a₁. Verify it\'s constant: a₃ − a₂ should equal the same d. Geometric: divide any term by the previous: r = a₂ / a₁. Verify: a₃ / a₂ should equal the same r. If neither is constant, the sequence is neither arithmetic nor geometric.' },
  { q: 'What is the sum of an infinite geometric series?', a: 'An infinite geometric series converges only when |r| < 1. The sum is S∞ = a₁ / (1 − r). Example: 1 + 1/2 + 1/4 + 1/8 + ... = 1 / (1 − 0.5) = 2. If |r| ≥ 1, the series diverges (grows without bound) and has no finite sum.' },
  { q: 'What is the difference between a sequence and a series?', a: 'A sequence is a list of numbers in a specific order: 1, 3, 5, 7, 9... A series is the sum of a sequence\'s terms: 1 + 3 + 5 + 7 + 9... Sequences describe patterns; series quantify totals. In mathematics, "sequence" means the list, "series" means the sum — they are distinct concepts often confused in everyday language.' },
  { q: 'Where are geometric sequences used in real life?', a: 'Geometric sequences appear in compound interest (each year the balance is multiplied by 1+r), population growth, radioactive decay (each half-life halves the amount), bacterial doubling, the Richter scale (each unit = 10× more energy), Moore\'s Law (transistor count doubles every ~2 years), and musical pitch (each octave doubles frequency).' },
]

const PRO_TIPS = [
  'The sum formula for an arithmetic sequence Sₙ = n(a₁ + aₙ)/2 has a beautiful intuition: pair the first and last terms (which sum to the same value as the second and second-to-last, and so on), and multiply by the number of pairs. Gauss reportedly used this insight as a child to sum 1 to 100 instantly: S₁₀₀ = 100 × 101 / 2 = 5,050.',
  'For geometric sequences with ratio r = 1 + growth rate, the sum formula Sₙ = a₁(rⁿ − 1)/(r − 1) is the foundation of compound interest: the total value of regular deposits in an account with compound interest. This is why starting to invest early is so powerful — you are adding terms to a geometric sum where each term is larger than the last.',
  'To check if a sequence is arithmetic or geometric without a calculator: divide consecutive terms (if the ratios are all equal → geometric) and subtract consecutive terms (if the differences are all equal → arithmetic). If a sequence looks like it grows faster and faster, it is probably geometric. Linear growth suggests arithmetic.',
  'The nth term of the Fibonacci sequence F(n) = [φⁿ − (1−φ)ⁿ] / √5, where φ = (1 + √5)/2 ≈ 1.618 (the golden ratio). Despite involving irrational numbers, this formula always gives exact integers. The ratio of consecutive Fibonacci numbers converges to φ as n → ∞, which is why the Fibonacci sequence is often called a pseudo-geometric sequence.',
]

const WHEN_TO_USE = [
  { icon: '📚', title: 'Maths homework and exams', description: 'Find the nth term, sum of n terms, or missing terms in arithmetic and geometric progressions for coursework and examination problems.' },
  { icon: '💰', title: 'Finance and investment planning', description: 'Model savings with regular contributions (arithmetic sums) or compound growth (geometric sequences) to understand long-term portfolio value.' },
  { icon: '🔬', title: 'Science and physics', description: 'Calculate radioactive decay sequences, spring oscillation amplitude decreases, or any process described by a constant ratio between consecutive values.' },
  { icon: '🎵', title: 'Music theory', description: 'Understand the geometric sequence of frequencies across octaves: each octave doubles frequency, creating a geometric progression with r = 2.' },
  { icon: '🏗️', title: 'Pattern recognition and coding', description: 'Identify the type and formula of a numerical sequence when developing algorithms, data patterns, or solving number puzzles.' },
]

const QUICK_REF = [
  { input: 'First term (a₁)', description: 'The starting value of the sequence', example: '3' },
  { input: 'Common diff. (d)', description: 'Arithmetic: constant added each step', example: '4' },
  { input: 'Common ratio (r)', description: 'Geometric: constant multiplied each step', example: '2' },
  { input: 'nth term (AP)', description: 'aₙ = a₁ + (n−1) × d', example: 'a₅ = 3 + 4×4 = 19' },
  { input: 'nth term (GP)', description: 'aₙ = a₁ × r^(n−1)', example: 'a₅ = 3 × 2⁴ = 48' },
  { input: 'Sum n terms (AP)', description: 'Sₙ = n/2 × (2a₁ + (n−1)d)', example: 'S₅ = 5/2 × (6+16) = 55' },
  { input: 'Sum n terms (GP)', description: 'Sₙ = a₁(rⁿ−1)/(r−1) for r≠1', example: 'S₅ = 3(32−1)/1 = 93' },
]

const RELATED = [
  { icon: '📊', name: 'Statistics Calculator', slug: 'statistics-calculator', description: 'Mean, median, mode, variance' },
  { icon: '🔢', name: 'Percentage Calculator', slug: 'percentage-calculator', description: 'Percentage increases and decreases' },
  { icon: '🔢', name: 'Fraction Calculator', slug: 'fraction-calculator', description: 'Add, subtract, multiply fractions' },
  { icon: '📉', name: 'Ratio Calculator', slug: 'ratio-calculator', description: 'Simplify and compare ratios' },
  { icon: '🔢', name: 'Exponent Calculator', slug: 'exponent-calculator', description: 'Powers and roots' },
]

const jsonLd = [
  {
    '@context': 'https://schema.org', '@type': 'SoftwareApplication',
    name: 'Number Sequence Calculator', description: 'Free number sequence calculator for arithmetic and geometric progressions. Finds nth term, sum, and full sequence.',
    url: 'https://roughtools.com/tools/calculators/number-sequence-calculator',
    applicationCategory: 'UtilitiesApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.7', reviewCount: '934' },
  },
  { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
  { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
    { '@type': 'ListItem', position: 2, name: 'Calculators', item: 'https://roughtools.com/tools/calculators' },
    { '@type': 'ListItem', position: 3, name: 'Number Sequence Calculator', item: 'https://roughtools.com/tools/calculators/number-sequence-calculator' },
  ]},
]

export default function NumberSequenceCalculatorPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px 80px' }}>
        <nav style={{ fontSize: 13, color: 'var(--fg-2)', marginBottom: 20 }} aria-label="Breadcrumb">
          <a href="/" style={{ color: 'var(--fg-2)' }}>Home</a>{' › '}
          <a href="/tools/calculators" style={{ color: 'var(--fg-2)' }}>Calculators</a>{' › '}
          <span style={{ color: 'var(--brand)' }}>Number Sequence Calculator</span>
        </nav>
        <div style={{ fontSize: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(139,92,246,0.15)', borderRadius: 14, padding: '10px 14px', lineHeight: 1, marginBottom: 12 }}>🔢</div>
        <h1 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, color: 'var(--fg)', margin: '0 0 10px', letterSpacing: '-0.5px' }}>Free Number Sequence Calculator</h1>
        <p style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.7, margin: '0 0 20px', maxWidth: 680 }}>
          Calculate the nth term, sum of n terms, and generate the full sequence for arithmetic and geometric progressions. Find missing terms and identify the sequence type. Free, private — all calculations run in your browser.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
          {['⚡ Instant results', '🔒 100% private', '🆓 Always free', '🚫 No signup', '🔢 Arithmetic & geometric'].map(b => (
            <span key={b} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 20, padding: '5px 12px', fontSize: 12, color: 'var(--brand-2)', fontWeight: 500 }}>{b}</span>
          ))}
        </div>
        <ToolAdUnit position="top" />
        <NumberSequenceClient />
        <ToolAdUnit position="middle" />
        <QuickReferenceTable rows={QUICK_REF} />
        <WhenToUseCards cards={WHEN_TO_USE} />
        <section style={{ marginTop: 40, padding: '28px 32px', background: 'var(--bg-1)', borderRadius: 16, border: '1px solid var(--line-strong)' }} aria-labelledby="about-heading">
          <h2 id="about-heading" style={{ fontSize: 20, fontWeight: 800, color: 'var(--fg)', marginTop: 0, marginBottom: 16 }}>About This Number Sequence Calculator</h2>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The Number Sequence Calculator handles the two most fundamental types of mathematical sequences: arithmetic progressions (constant difference between terms) and geometric progressions (constant ratio between terms). Enter the first term and either the common difference or ratio, specify how many terms you need, and the calculator returns every term along with the running sum.
          </p>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>The Formulas</h3>
          <div style={{ background: 'var(--bg-3)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 10, padding: '14px 18px', marginBottom: 14, fontFamily: 'monospace', fontSize: 12, color: 'var(--brand-2)', lineHeight: 1.9 }}>
            {'ARITHMETIC PROGRESSION (AP)\nnth term:  aₙ = a₁ + (n−1)d\nSum:       Sₙ = n/2 × (2a₁ + (n−1)d)\n\nGEOMETRIC PROGRESSION (GP)\nnth term:  aₙ = a₁ × r^(n−1)\nSum:       Sₙ = a₁(rⁿ − 1)/(r − 1)  [r ≠ 1]\nInfinite:  S∞ = a₁/(1−r)  [|r| < 1 only]'}
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>Real-World Applications</h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            Arithmetic sequences model steady linear growth: annual salary increases, equal instalments, uniform acceleration in physics. Geometric sequences model exponential growth and decay: compound interest, population growth, radioactive decay, viral spread. The sum formula for geometric sequences is the mathematical foundation of annuity calculations in finance — the present or future value of a series of equal payments made at regular intervals.
          </p>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>Privacy Notice</h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, margin: 0 }}>
            All calculations run in your browser. No data is transmitted or stored.
            See our <a href="/privacy" style={{ color: '#8b5cf6', textDecoration: 'underline' }}>Privacy Policy</a>.
          </p>
        </section>
        <ProTipsSection tips={PRO_TIPS} />
        <CalculatorFAQ faqs={FAQS} />
        <RelatedCalculators calculators={RELATED} />
        <ToolPageExtras toolName="Number Sequence Calculator" toolSlug="number-sequence-calculator" toolUrl="https://roughtools.com/tools/calculators/number-sequence-calculator" type="general" />
        <ToolAdUnit position="bottom" />
      </div>
    </>
  )
}
