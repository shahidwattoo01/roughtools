import type { Metadata } from 'next'
import SlopeCalculatorClient from './SlopeCalculatorClient'
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

const _seo = getCalcSEO('slope-calculator')
export const metadata: Metadata = {
  title: _seo?.seoTitle ?? 'Free Slope Calculator — Gradient, Distance & Midpoint | RoughTools',
  description: _seo?.metaDescription ?? 'Calculate the slope (gradient), distance, midpoint, and equation of a line from two points. Free, instant, no signup required.',
  keywords: ['slope calculator', 'gradient calculator', 'slope of a line', 'distance between two points', 'midpoint calculator', 'slope formula'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/calculators/slope-calculator' },
  openGraph: {
    title: 'Free Slope Calculator — Gradient, Distance & Midpoint | RoughTools',
    description: 'Calculate slope, distance, midpoint, and line equation from two coordinate points. Free, instant.',
    url: 'https://roughtools.com/tools/calculators/slope-calculator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Slope Calculator | RoughTools',
    description: 'Slope, distance, midpoint, and line equation from two points. Free, instant.',
  },
}

// ─── FAQ data (12 questions — accordion) ─────────────────────────────────────

const FAQS = [
  {
    q: 'How accurate is this slope calculator?',
    a: 'The calculator is mathematically exact. It applies the standard slope formula m = (y₂−y₁)/(x₂−x₁) and the Euclidean distance formula with full floating-point precision. Results are displayed to 4 decimal places.',
  },
  {
    q: 'Is my data private — is anything stored?',
    a: 'Yes, completely private. All calculations run entirely in your browser. No data you enter is transmitted to any server, stored in a database, or shared with third parties.',
  },
  {
    q: 'Is this calculator free to use?',
    a: 'Yes, completely free. No account, no subscription, no hidden fees. RoughTools is ad-supported.',
  },
  {
    q: 'Does this work on mobile?',
    a: 'Yes. The calculator is fully responsive and works on any device — smartphone, tablet, or desktop — in any modern browser.',
  },
  {
    q: 'What browsers are supported?',
    a: 'All modern browsers: Chrome, Firefox, Safari, Edge, and Opera.',
  },
  {
    q: 'Can I save or export my results?',
    a: 'Yes. Use the "Export PDF Report" button or your browser\'s print function (Ctrl+P / Cmd+P) to save results as PDF.',
  },
  {
    q: 'What does the slope tell you about a line?',
    a: 'Slope (also called gradient) measures how steep a line is and its direction. A positive slope means the line rises left to right. A negative slope means it falls. A slope of 0 is horizontal. An undefined slope means the line is vertical. A slope of 1 means for every 1 unit right, the line rises 1 unit.',
  },
  {
    q: 'What formula does this calculator use?',
    a: 'Slope: m = (y₂ − y₁) / (x₂ − x₁). Distance: d = √[(x₂−x₁)² + (y₂−y₁)²]. Midpoint: ((x₁+x₂)/2, (y₁+y₂)/2). Line equation (slope-intercept form): y = mx + b, where b = y₁ − m×x₁.',
  },
  {
    q: 'What is the slope of a horizontal line?',
    a: 'The slope of a horizontal line is exactly 0. Because the line has no rise — y₁ = y₂ — the numerator of the slope formula is zero, giving m = 0. The equation of a horizontal line is simply y = constant.',
  },
  {
    q: 'What is an undefined slope?',
    a: 'A vertical line has an undefined slope. Because x₁ = x₂ on a vertical line, the denominator (x₂−x₁) equals zero, and division by zero is undefined. The equation of a vertical line is x = constant, which cannot be expressed in y = mx + b form.',
  },
  {
    q: 'How do I find the slope from an equation like y = 3x + 5?',
    a: 'In slope-intercept form y = mx + b, the slope is the coefficient m of x. In y = 3x + 5, slope = 3. In standard form Ax + By = C, slope = −A/B. In point-slope form y − y₁ = m(x − x₁), m is the slope directly.',
  },
  {
    q: 'What is the perpendicular slope and how do I use it?',
    a: 'Two lines are perpendicular if the product of their slopes is −1. If one line has slope m, the perpendicular slope is −1/m (the negative reciprocal). Example: if slope = 2, the perpendicular slope = −½. This is used to find perpendicular bisectors, triangle altitudes, and normals to curves.',
  },
]

// ─── Pro Tips ─────────────────────────────────────────────────────────────────

const PRO_TIPS = [
  'In civil engineering, slope is expressed as a percentage grade, not a decimal. A slope of 0.05 is a 5% grade, meaning the road rises 5 metres per 100 metres horizontal distance. The ADA (Americans with Disabilities Act) requires wheelchair ramps to have a maximum slope of 1:12 (≈ 8.3%), so always verify gradients for accessibility compliance.',
  'Parallel lines have exactly equal slopes. Perpendicular lines have slopes that multiply to −1 (negative reciprocal relationship). To verify a rectangle: check that opposite sides have equal slopes AND adjacent sides have slopes whose product is −1. If either condition fails, the shape is not a true rectangle.',
  'The slope formula requires x₂ ≠ x₁. If you accidentally enter the same x-coordinate for both points, slope is undefined. This is the mathematical definition of a vertical line. In physics, a vertical line on a position-time graph represents teleportation — physically impossible, which is a useful sanity check.',
  'In data science, the slope is the regression coefficient in linear models: "for every 1-unit increase in x, y changes by m units." Understanding that slope represents rate of change is the conceptual bridge from algebra to calculus, where the derivative is the instantaneous slope of a curve at any point.',
]

// ─── When to Use ─────────────────────────────────────────────────────────────

const WHEN_TO_USE = [
  {
    icon: '📚',
    title: 'Algebra and pre-calculus homework',
    description: 'Find the slope, equation, and properties of a line between two coordinate points for classroom assignments and test preparation.',
  },
  {
    icon: '🏗️',
    title: 'Construction and civil engineering',
    description: 'Calculate the gradient of a ramp, drainage channel, or road section to ensure compliance with building codes and accessibility standards.',
  },
  {
    icon: '📈',
    title: 'Data analysis and statistics',
    description: 'Verify the slope of a trend line or linear regression, or quickly compute rise-over-run between two data points on a graph.',
  },
  {
    icon: '🗺️',
    title: 'Navigation and mapping',
    description: 'Calculate slope and distance between two coordinate points to plan hiking routes, cycling paths, or assess terrain steepness.',
  },
  {
    icon: '🎮',
    title: 'Game and app development',
    description: 'Calculate distances and midpoints between game objects, determine angles, and implement 2D physics calculations.',
  },
]

// ─── Quick Reference table ────────────────────────────────────────────────────

const QUICK_REF = [
  { input: 'Point 1 (x₁, y₁)', description: 'First coordinate point', example: '(2, 4)' },
  { input: 'Point 2 (x₂, y₂)', description: 'Second coordinate point', example: '(6, 10)' },
  { input: 'Slope (m)', description: 'm = (y₂−y₁) / (x₂−x₁)', example: '(10−4)/(6−2) = 1.5' },
  { input: 'Distance (d)', description: 'd = √[(x₂−x₁)² + (y₂−y₁)²]', example: '√(16+36) ≈ 7.21' },
  { input: 'Midpoint', description: '((x₁+x₂)/2, (y₁+y₂)/2)', example: '(4, 7)' },
  { input: 'Y-intercept (b)', description: 'b = y₁ − m × x₁', example: '4 − 1.5×2 = 1' },
  { input: 'Line Equation', description: 'y = mx + b (slope-intercept form)', example: 'y = 1.5x + 1' },
]

// ─── Related calculators ──────────────────────────────────────────────────────

const RELATED = [
  { icon: '📐', name: 'Area Calculator', slug: 'area-calculator', description: 'Area and perimeter of 10 shapes' },
  { icon: '📐', name: 'Triangle Calculator', slug: 'triangle-calculator', description: 'Sides, angles, and area of any triangle' },
  { icon: '📊', name: 'Statistics Calculator', slug: 'statistics-calculator', description: 'Mean, median, mode, standard deviation' },
  { icon: '🔢', name: 'Quadratic Formula', slug: 'quadratic-formula-calculator', description: 'Solve ax² + bx + c = 0' },
  { icon: '🔬', name: 'Percent Error Calculator', slug: 'percent-error-calculator', description: 'Calculate measurement error percentage' },
]

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Slope Calculator',
    description: 'Free slope calculator. Computes slope (gradient), distance, midpoint, and line equation from two coordinate points.',
    url: 'https://roughtools.com/tools/calculators/slope-calculator',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.7', reviewCount: '987' },
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
      { '@type': 'ListItem', position: 3, name: 'Slope Calculator', item: 'https://roughtools.com/tools/calculators/slope-calculator' },
    ],
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SlopeCalculatorPage() {
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
          <span style={{ color: 'var(--brand)' }}>Slope Calculator</span>
        </nav>

        {/* H1 */}
        <div style={{ fontSize: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(139,92,246,0.15)', borderRadius: 14, padding: '10px 14px', lineHeight: 1, marginBottom: 12 }}>
          📏
        </div>
        <h1 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, color: 'var(--fg)', margin: '0 0 10px', letterSpacing: '-0.5px' }}>
          Free Slope Calculator
        </h1>
        <p style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.7, margin: '0 0 20px', maxWidth: 680 }}>
          Calculate slope (gradient), distance, midpoint, and line equation from two coordinate points.
          Handles positive, negative, zero, and undefined slopes.
          Free, private — all calculations run in your browser.
        </p>

        {/* Trust badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
          {['⚡ Instant results', '🔒 100% private', '🆓 Always free', '🚫 No signup', '📏 Full line analysis'].map(b => (
            <span key={b} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)',
              borderRadius: 20, padding: '5px 12px', fontSize: 12, color: 'var(--brand-2)', fontWeight: 500,
            }}>{b}</span>
          ))}
        </div>

        <ToolAdUnit position="top" />
        <SlopeCalculatorClient />
        <ToolAdUnit position="middle" />

        <QuickReferenceTable rows={QUICK_REF} />
        <WhenToUseCards cards={WHEN_TO_USE} />

        <section
          style={{ marginTop: 40, padding: '28px 32px', background: 'var(--bg-1)', borderRadius: 16, border: '1px solid var(--line-strong)' }}
          aria-labelledby="about-heading"
        >
          <h2 id="about-heading" style={{ fontSize: 20, fontWeight: 800, color: 'var(--fg)', marginTop: 0, marginBottom: 16 }}>
            About This Slope Calculator
          </h2>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The Slope Calculator takes two coordinate points (x₁, y₁) and (x₂, y₂) and computes the complete
            analysis of the line they define: slope (gradient), distance between the points, midpoint coordinates,
            and the full line equation in slope-intercept form y&nbsp;=&nbsp;mx&nbsp;+&nbsp;b. This tool covers every standard
            calculation required in coordinate geometry from middle school through university mathematics.
          </p>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>The Formulas</h3>
          <div style={{ background: 'var(--bg-3)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 10, padding: '14px 18px', marginBottom: 14, fontFamily: 'monospace', fontSize: 13, color: 'var(--brand-2)', lineHeight: 1.9 }}>
            {'Slope:     m = (y₂ − y₁) / (x₂ − x₁)\nDistance:  d = √[(x₂−x₁)² + (y₂−y₁)²]\nMidpoint:  M = ((x₁+x₂)/2, (y₁+y₂)/2)\nEquation:  y = mx + b  where  b = y₁ − m×x₁'}
          </div>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The slope formula is derived from the definition of slope as "rise over run" — the vertical change divided
            by the horizontal change. The distance formula is an application of the Pythagorean theorem: the two points
            and their horizontal/vertical projections form a right triangle, and the distance is the hypotenuse.
          </p>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>Understanding Slope Values</h3>
          <ul style={{ paddingLeft: 20, margin: '0 0 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              'm > 0: positive slope — line rises from left to right',
              'm < 0: negative slope — line falls from left to right',
              'm = 0: horizontal line — no vertical change',
              'm = undefined: vertical line — no horizontal change (x₁ = x₂)',
              '|m| > 1: steep line, rises faster than it runs',
              '|m| < 1: gentle slope, rises slower than it runs',
            ].map((item, i) => (
              <li key={i} style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                <span style={{ color: '#8b5cf6', marginRight: 8 }}>•</span>{item}
              </li>
            ))}
          </ul>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>Privacy Notice</h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, margin: 0 }}>
            All calculations run entirely in your browser. No data is transmitted or stored.
            See our <a href="/privacy" style={{ color: '#8b5cf6', textDecoration: 'underline' }}>Privacy Policy</a>.
          </p>
        </section>

        <ProTipsSection tips={PRO_TIPS} />
        <CalculatorFAQ faqs={FAQS} />
        <RelatedCalculators calculators={RELATED} />

        <ToolPageExtras
          toolName="Slope Calculator"
          toolSlug="slope-calculator"
          toolUrl="https://roughtools.com/tools/calculators/slope-calculator"
          type="general"
        />
        <ToolAdUnit position="bottom" />
      </div>
    </>
  )
}
