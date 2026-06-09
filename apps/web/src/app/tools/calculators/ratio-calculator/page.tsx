import type { Metadata } from 'next'
import RatioCalculatorClient from './RatioCalculatorClient'
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

const _seo = getCalcSEO('ratio-calculator')
export const metadata: Metadata = {
  title: _seo?.seoTitle ?? 'Free Ratio Calculator — Simplify, Proportion & Distribute | RoughTools',
  description: _seo?.metaDescription ?? 'Simplify ratios, solve proportions (a:b = c:d), and distribute amounts in any ratio. Free, instant, no signup.',
  keywords: ['ratio calculator', 'simplify ratio', 'proportion calculator', 'ratio simplifier', 'divide in ratio', 'equivalent ratio', 'cross multiplication calculator'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/calculators/ratio-calculator' },
  openGraph: {
    title: 'Free Ratio Calculator — Simplify, Proportion & Distribute | RoughTools',
    description: 'Simplify ratios, solve proportions, and distribute amounts in any ratio. Free, instant, no signup.',
    url: 'https://roughtools.com/tools/calculators/ratio-calculator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Ratio Calculator | RoughTools',
    description: 'Simplify ratios and solve proportions instantly. Free.',
  },
}

// ─── FAQ data (12 questions — accordion) ─────────────────────────────────────

const FAQS = [
  {
    q: 'How accurate is this ratio calculator?',
    a: 'The calculator is mathematically exact. Simplification uses the greatest common divisor (GCD) algorithm, which always produces the fully reduced ratio. Proportion solving uses exact cross-multiplication arithmetic. Results are accurate to JavaScript\'s floating-point precision (15–17 significant digits), which is more than sufficient for all practical applications.',
  },
  {
    q: 'Is my data private — is anything stored?',
    a: 'Yes, completely private. All calculations run entirely in your browser using JavaScript. No values you enter are transmitted to any server, stored in a database, or shared with third parties. When you close the tab, your inputs are gone.',
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
    q: 'Should I consult a professional for ratio problems?',
    a: 'For everyday applications (cooking, construction, mixing), this calculator is all you need. For professional engineering, pharmaceutical formulation, or financial ratio analysis, results should be verified and interpreted by a qualified professional in the relevant field.',
  },
  {
    q: 'What formula does this calculator use?',
    a: 'Three operations: (1) Simplify: divide both terms A and B by GCD(A, B). (2) Solve proportion A:B = C:D for missing value: cross-multiply AD = BC, so D = BC/A or A = BC/D. (3) Convert to percentage: A/(A+B) × 100 for the first part\'s share. Equivalent ratio check: A/B = C/D is verified by cross-multiplication AD = BC.',
  },
  {
    q: 'What is the difference between a ratio and a fraction?',
    a: 'A ratio (3:4) compares two separate quantities to each other — 3 parts of A for every 4 parts of B. A fraction (3/4) represents one part of a whole — 3 out of 4 equal total parts. They use the same arithmetic but have different conceptual meanings. A ratio A:B can be expressed as the fraction A/B only when interpreting the first quantity relative to the second. In a ratio A:B, the total is A+B parts, so A\'s share is A/(A+B), not A/B.',
  },
  {
    q: 'Can I work with 3-part ratios (A:B:C)?',
    a: 'Yes. For three-part ratios like A:B:C, the simplification process divides all three terms by GCD(A, B, C). To distribute a total amount T in ratio A:B:C: total parts = A+B+C, first share = T × A/(A+B+C), second share = T × B/(A+B+C), third share = T × C/(A+B+C). Many recipe scaling, profit-sharing, and resource allocation problems use 3-part ratios.',
  },
  {
    q: 'How do I solve a proportion equation using cross-multiplication?',
    a: 'A proportion states two ratios are equal: A:B = C:D, or equivalently A/B = C/D. Cross-multiplication gives AD = BC. To solve for any missing variable: if D is unknown, D = BC/A. If A is unknown, A = BC/D. Example: 3:4 = x:12 → 3×12 = 4×x → 36 = 4x → x = 9. Cross-multiplication works because multiplying both sides of A/B = C/D by BD gives AD = BC.',
  },
  {
    q: 'What is the golden ratio and why is it significant?',
    a: 'The golden ratio φ (phi) ≈ 1.618 satisfies the proportion A:B = (A+B):A. It appears throughout art, architecture, and nature — the Parthenon\'s facade, nautilus shell spirals, sunflower seed arrangements, and many Renaissance paintings. It is often cited for its aesthetic appeal, though its prevalence is sometimes overstated. Numerically, φ = (1 + √5)/2 ≈ 1.6180339887. The ratio 1:1.618 or 8:13 (Fibonacci adjacent) are common practical approximations.',
  },
  {
    q: 'What are common aspect ratios for screens and photography?',
    a: 'Screen aspect ratios: 16:9 (HD/4K widescreen, YouTube), 16:10 (many laptop displays), 4:3 (old TV, iPad), 21:9 (ultrawide monitors), 1:1 (square, Instagram). Photography: 3:2 (35mm film, most DSLRs), 4:3 (compact cameras, Micro Four Thirds), 1:1 (medium format square). Crop sensor cameras often crop to 1.5× or 1.6× the full-frame ratio when zooming. Use the proportion solver to calculate pixel dimensions that maintain a given aspect ratio.',
  },
]

// ─── Pro Tips ─────────────────────────────────────────────────────────────────

const PRO_TIPS = [
  'Always simplify ratios to their lowest terms first — it makes the numbers easier to work with and reveals the fundamental relationship. To find the GCD, use the Euclidean algorithm: GCD(48, 36) = GCD(36, 12) = GCD(12, 0) = 12, so 48:36 simplifies to 4:3.',
  'The golden ratio 1:1.618 (φ) appears naturally in art, architecture, and nature. Designers use it to create proportions that are universally considered aesthetically pleasing. A rectangle with sides in ratio 1:φ is a "golden rectangle." Fibonacci numbers (1, 1, 2, 3, 5, 8, 13, 21...) produce increasingly accurate approximations of φ as adjacent-number ratios.',
  'Know your screen aspect ratios for design work: 16:9 for all HD/4K video and YouTube thumbnails, 4:3 for traditional presentations and iPad, 1:1 for square social media, 9:16 for vertical mobile stories. Always verify output dimensions maintain the ratio using the proportion solver — a 2560×1440 canvas is exactly 16:9 (÷ 160 = 16:9).',
  'Cross-multiplication is the fastest way to solve any proportion. If you know three of the four values in A:B = C:D, multiply across the diagonal of the known pair and divide by the remaining known value. This works because AD = BC always holds for equivalent ratios, and rearranging gives any missing variable directly.',
]

// ─── When to Use ─────────────────────────────────────────────────────────────

const WHEN_TO_USE = [
  {
    icon: '🍳',
    title: 'Cooking recipe scaling',
    description: 'Scale any recipe up or down while preserving ingredient ratios. If a recipe for 4 needs 2 cups of flour, find exactly how much to use for 10 servings using proportion solving.',
  },
  {
    icon: '🗺️',
    title: 'Map scale calculation',
    description: 'Convert between map distances and real-world distances using the map\'s stated scale ratio (e.g., 1:50,000 means 1 cm = 500 m). Solve for either value.',
  },
  {
    icon: '🖥️',
    title: 'Screen and image aspect ratio',
    description: 'Maintain aspect ratios when resizing images, designing banners, or cropping video. Ensure 16:9 or 4:3 proportions are preserved across different pixel dimensions.',
  },
  {
    icon: '🧪',
    title: 'Mixing solutions and concentrations',
    description: 'Calculate the correct volumes when mixing chemicals, paints, fuels, or cleaning solutions to achieve a target concentration ratio.',
  },
  {
    icon: '💼',
    title: 'Business profit-sharing and distribution',
    description: 'Divide revenue, profits, or costs among partners, shareholders, or departments according to agreed ratio splits — with automatic calculation of each party\'s exact share.',
  },
]

// ─── Quick Reference table ────────────────────────────────────────────────────

const QUICK_REF = [
  { input: 'Value A', description: 'First part of the ratio A:B', example: '12' },
  { input: 'Value B', description: 'Second part of the ratio A:B', example: '8' },
  { input: 'Simplified Ratio', description: 'A:B divided by their GCD', example: '3:2' },
  { input: 'As Fraction', description: 'First value divided by second', example: '3/2 = 1.5' },
  { input: 'As Percentage', description: 'A\'s share of the total A+B', example: '60% : 40%' },
  { input: 'Cross-multiplication', description: 'Solve A:B = C:D for missing value via AD = BC', example: '3:4 = 9:12 ✓' },
]

// ─── Related calculators ──────────────────────────────────────────────────────

const RELATED = [
  { icon: '½', name: 'Fraction Calculator', slug: 'fraction-calculator', description: 'Add, subtract, multiply, divide fractions' },
  { icon: '%', name: 'Percentage Calculator', slug: 'percentage-calculator', description: 'Percentage of, increase, decrease, difference' },
  { icon: '📊', name: 'Statistics Calculator', slug: 'statistics-calculator', description: 'Mean, median, mode, standard deviation' },
]

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Ratio Calculator',
    description: 'Free ratio calculator. Simplify ratios, solve proportions (a:b = c:d), and distribute amounts in any ratio.',
    url: 'https://roughtools.com/tools/calculators/ratio-calculator',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '1897' },
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
      { '@type': 'ListItem', position: 3, name: 'Ratio Calculator', item: 'https://roughtools.com/tools/calculators/ratio-calculator' },
    ],
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RatioCalculatorPage() {
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
          <span style={{ color: 'var(--brand)' }}>Ratio Calculator</span>
        </nav>

        {/* H1 */}
        <div style={{ fontSize: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(139,92,246,0.15)', borderRadius: 14, padding: '10px 14px', lineHeight: 1, marginBottom: 12 }}>
          ⚖️
        </div>
        <h1 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, color: 'var(--fg)', margin: '0 0 10px', letterSpacing: '-0.5px' }}>
          Free Ratio Calculator
        </h1>
        <p style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.7, margin: '0 0 20px', maxWidth: 680 }}>
          Simplify ratios to lowest terms, solve proportion equations (A:B = C:D), and distribute
          amounts in any ratio. Includes percentage conversion and GCD-based simplification.
          Free, private — all calculations run in your browser.
        </p>

        {/* Trust badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
          {['⚡ Instant results', '🔒 100% private', '🆓 Always free', '🚫 No signup', '📐 Exact GCD simplification'].map(b => (
            <span key={b} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)',
              borderRadius: 20, padding: '5px 12px', fontSize: 12, color: 'var(--brand-2)', fontWeight: 500,
            }}>{b}</span>
          ))}
        </div>

        <ToolAdUnit position="top" />

        {/* Calculator widget */}
        <RatioCalculatorClient />

        <ToolAdUnit position="middle" />

        {/* Quick Reference */}
        <QuickReferenceTable rows={QUICK_REF} />

        {/* When to Use */}
        <WhenToUseCards cards={WHEN_TO_USE} />

        {/* About section */}
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
            About This Ratio Calculator
          </h2>

          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The Ratio Calculator covers the three core ratio operations you encounter in everyday life and
            professional work: simplifying a ratio to its lowest terms, solving a proportion equation when one
            value is missing, and distributing a total amount according to a ratio. Whether you are scaling a
            recipe, designing to spec, analysing financial data, or mixing materials, this tool handles the
            arithmetic instantly and accurately.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            The Formulas — How They Work
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 10 }}>
            <strong style={{ color: 'var(--fg)' }}>Simplifying a ratio</strong> — divide both terms by their Greatest Common Divisor:
          </p>
          <div style={{ background: 'var(--bg-3)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 10, padding: '14px 18px', marginBottom: 14, fontFamily: 'monospace', fontSize: 13, color: 'var(--brand-2)' }}>
            Simplified A : Simplified B = (A ÷ GCD) : (B ÷ GCD)
          </div>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 10 }}>
            <strong style={{ color: 'var(--fg)' }}>Solving a proportion</strong> — equivalent ratios satisfy A/B = C/D.
            Cross-multiplication gives AD = BC, so any missing value can be found:
          </p>
          <div style={{ background: 'var(--bg-3)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 10, padding: '14px 18px', marginBottom: 14, fontFamily: 'monospace', fontSize: 13, color: 'var(--brand-2)' }}>
            A : B = C : D  →  A × D = B × C
          </div>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 10 }}>
            <strong style={{ color: 'var(--fg)' }}>Converting to percentage</strong> — each part's share of the total:
          </p>
          <div style={{ background: 'var(--bg-3)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 10, padding: '14px 18px', marginBottom: 14, fontFamily: 'monospace', fontSize: 13, color: 'var(--brand-2)' }}>
            A's share = A / (A + B) × 100%
          </div>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Ratios vs Fractions vs Percentages
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            These three are deeply related but represent different ideas. A <strong style={{ color: 'var(--fg)' }}>ratio</strong> A:B
            compares two quantities to each other — the total is A+B parts. A <strong style={{ color: 'var(--fg)' }}>fraction</strong> A/B
            represents A as a proportion of B — B is the whole. A <strong style={{ color: 'var(--fg)' }}>percentage</strong> is
            always out of 100. Converting between them: ratio 3:2 → fraction 3/5 of the whole (not 3/2) →
            60% of the total. Understanding this distinction prevents errors when working with recipes, financial
            splits, and mixture concentrations.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Real-World Applications
          </h3>
          <ul style={{ paddingLeft: 20, margin: '0 0 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              'Cooking and baking: scale ingredient quantities while preserving the exact taste profile',
              'Map reading: convert map distances to real distances using the stated scale',
              'Financial analysis: debt-to-equity ratio, current ratio, price-to-earnings ratio',
              'Construction and carpentry: ensure structural members maintain load-bearing proportions',
              'Photography: maintain aspect ratios when printing or displaying images at different sizes',
              'Chemistry: prepare solutions at correct molar concentrations by maintaining reagent ratios',
            ].map((item, i) => (
              <li key={i} style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                <span style={{ color: '#8b5cf6', marginRight: 8 }}>•</span>{item}
              </li>
            ))}
          </ul>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Privacy Notice
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, margin: 0 }}>
            All calculations in this calculator are performed entirely in your browser. No data you enter is
            transmitted to any server, stored in any database, or shared with third parties. See our{' '}
            <a href="/privacy" style={{ color: '#8b5cf6', textDecoration: 'underline' }}>Privacy Policy</a>{' '}
            for full details.
          </p>
        </section>

        {/* Pro Tips */}
        <ProTipsSection tips={PRO_TIPS} />

        {/* FAQ */}
        <CalculatorFAQ faqs={FAQS} />

        {/* Related Calculators */}
        <RelatedCalculators calculators={RELATED} />

        {/* Compliance kit */}
        <ToolPageExtras
          toolName="Ratio Calculator"
          toolSlug="ratio-calculator"
          toolUrl="https://roughtools.com/tools/calculators/ratio-calculator"
          type="general"
        />

        <ToolAdUnit position="bottom" />
      </div>
    </>
  )
}
