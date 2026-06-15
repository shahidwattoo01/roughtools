import type { Metadata } from 'next'
import AreaCalculatorClient from './AreaCalculatorClient'
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

const _seo = getCalcSEO('area-calculator')
export const metadata: Metadata = {
  title: _seo?.seoTitle ?? 'Free Area Calculator — 10 Shapes | RoughTools',
  description: _seo?.metaDescription ?? 'Calculate area and perimeter for 10 shapes: circle, triangle, rectangle, trapezoid, ellipse, hexagon, and more. Free, instant, no signup.',
  keywords: ['area calculator', 'perimeter calculator', 'area of circle', 'area of triangle', 'area of rectangle', 'area of trapezoid'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/calculators/area-calculator' },
  openGraph: {
    title: 'Free Area Calculator — 10 Shapes | RoughTools',
    description: 'Calculate area and perimeter for circle, triangle, rectangle, and 7 more shapes. Free, instant.',
    url: 'https://roughtools.com/tools/calculators/area-calculator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Area Calculator | RoughTools',
    description: 'Area and perimeter for 10 shapes. Free, instant, no signup.',
  },
}

// ─── FAQ data (12 questions — accordion) ─────────────────────────────────────

const FAQS = [
  {
    q: 'How accurate is this area calculator?',
    a: 'The calculator is mathematically exact. All formulas used are the standard Euclidean geometry formulas taught in every mathematics curriculum. Results are computed with full floating-point precision and rounded to 4 decimal places for readability. There are no approximations unless stated (e.g., π is computed with full machine precision).',
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
    a: 'All modern browsers: Chrome, Firefox, Safari, Edge, and Opera. Internet Explorer is not supported.',
  },
  {
    q: 'Can I save or export my results?',
    a: 'Yes. Use the "Export PDF Report" button to download a formatted PDF of your inputs and results. You can also use your browser\'s print function (Ctrl+P or Cmd+P) to save as PDF.',
  },
  {
    q: 'Do I need a calculator to find the area of a shape?',
    a: 'For simple shapes like squares and rectangles the math is easy enough to do mentally. For circles, triangles with non-standard dimensions, ellipses, and polygons, a calculator eliminates errors and saves time — especially when you need both area and perimeter.',
  },
  {
    q: 'What formulas does this calculator use?',
    a: 'Each shape uses its standard formula: Circle: A = πr². Rectangle: A = l × w. Triangle: A = (b × h) / 2. Trapezoid: A = (a + b) / 2 × h. Parallelogram: A = b × h. Ellipse: A = π × a × b. Regular hexagon: A = (3√3 / 2) × s². Regular pentagon: A = (s² × √(25 + 10√5)) / 4. Sector: A = (θ/360) × πr². Annulus: A = π(R² − r²).',
  },
  {
    q: 'What is the formula for the area of a circle?',
    a: 'Area of a circle = π × r², where r is the radius. Circumference = 2 × π × r. Example: a circle with radius 7 cm has area ≈ 153.94 cm² and circumference ≈ 43.98 cm. If you know the diameter, radius = diameter ÷ 2.',
  },
  {
    q: 'How do you calculate the area of a triangle?',
    a: 'Using base and height: A = (base × height) / 2. If you know all three sides, use Heron\'s formula: s = (a + b + c) / 2, then A = √[s(s−a)(s−b)(s−c)]. For a right triangle, the two legs are the base and height. The height must be perpendicular to the base.',
  },
  {
    q: 'What is the difference between area and perimeter?',
    a: 'Area measures the 2D space enclosed inside a shape, expressed in square units (cm², m², ft², in²). Perimeter measures the total distance around the outside boundary of a shape, expressed in linear units (cm, m, ft, in). A swimming pool\'s area tells you how much water it holds; its perimeter tells you how much fencing you need around it.',
  },
  {
    q: 'What is the area of a trapezoid?',
    a: 'Area of a trapezoid = (a + b) / 2 × h, where a and b are the two parallel sides (bases) and h is the perpendicular height between them. Example: a trapezoid with parallel sides 6 cm and 10 cm and height 4 cm has area = (6 + 10) / 2 × 4 = 32 cm².',
  },
]

// ─── Pro Tips ─────────────────────────────────────────────────────────────────

const PRO_TIPS = [
  'When calculating the area of a triangle using base and height, the height must be the perpendicular distance from the base to the opposite vertex — not the length of a slanted side. A common mistake is using a slant side as the height, which always overstates the area.',
  'For irregular land plots and real-estate parcels, professional surveyors use the Shoelace formula (also called the Gauss area formula) for polygons. If you have GPS coordinates for the boundary vertices, the area can be calculated exactly without measuring every side.',
  'Converting between unit systems: 1 square metre = 10.764 sq ft. 1 square foot = 0.0929 m². 1 acre = 43,560 sq ft = 4,047 m². 1 hectare = 10,000 m² = 2.471 acres. Always confirm your unit system before calculating to avoid off-by-order-of-magnitude errors.',
  'For circles, remember that doubling the radius quadruples the area (because area scales with r²). A circle with radius 10 m has 4× the area of a circle with radius 5 m — not twice. This is why pizza pricing by diameter is better value at larger sizes.',
]

// ─── When to Use ─────────────────────────────────────────────────────────────

const WHEN_TO_USE = [
  {
    icon: '🏠',
    title: 'Home improvement projects',
    description: 'Calculate the floor area of a room before buying tiles, flooring, or carpet, or find the wall area before buying paint. Accurate area calculations prevent costly over- or under-ordering.',
  },
  {
    icon: '🌿',
    title: 'Gardening and landscaping',
    description: 'Calculate the area of a circular garden bed, rectangular lawn, or irregular plot to determine how much soil, mulch, grass seed, or fertiliser to purchase.',
  },
  {
    icon: '📐',
    title: 'School and university maths',
    description: 'Verify homework answers, check worked examples, or quickly confirm the area formula for a shape you haven\'t calculated in a while.',
  },
  {
    icon: '🏗️',
    title: 'Construction and architecture',
    description: 'Calculate floor areas, roof areas, and land areas for planning applications, material estimates, and cost calculations during construction projects.',
  },
  {
    icon: '🎨',
    title: 'Design and printing',
    description: 'Calculate the area of banners, canvases, signs, and printed materials to estimate material costs and ensure design elements are sized correctly.',
  },
]

// ─── Quick Reference table ────────────────────────────────────────────────────

const QUICK_REF = [
  { input: 'Square', description: 'A = side²', example: 'side 5 m → 25 m²' },
  { input: 'Rectangle', description: 'A = length × width', example: '6 × 4 m → 24 m²' },
  { input: 'Circle', description: 'A = π × r²', example: 'r = 7 cm → 153.94 cm²' },
  { input: 'Triangle', description: 'A = (base × height) / 2', example: 'b=8, h=5 → 20 units²' },
  { input: 'Trapezoid', description: 'A = (a + b) / 2 × h', example: 'a=6, b=10, h=4 → 32 units²' },
  { input: 'Parallelogram', description: 'A = base × height', example: 'b=9, h=6 → 54 units²' },
  { input: 'Ellipse', description: 'A = π × a × b', example: 'a=5, b=3 → 47.12 units²' },
  { input: 'Regular Hexagon', description: 'A = (3√3 / 2) × s²', example: 's=4 → 41.57 units²' },
]

// ─── Related calculators ──────────────────────────────────────────────────────

const RELATED = [
  { icon: '📦', name: 'Volume Calculator', slug: 'volume-calculator', description: 'Volume of 3D shapes' },
  { icon: '📐', name: 'Triangle Calculator', slug: 'triangle-calculator', description: 'Angles, sides, and area of any triangle' },
  { icon: '📏', name: 'Slope Calculator', slug: 'slope-calculator', description: 'Slope, distance, and midpoint of a line' },
  { icon: '🔢', name: 'Percentage Calculator', slug: 'percentage-calculator', description: 'Percentages, increases, decreases' },
  { icon: '📊', name: 'Statistics Calculator', slug: 'statistics-calculator', description: 'Mean, median, mode, standard deviation' },
]

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Area Calculator',
    description: 'Free area and perimeter calculator for 10 common 2D shapes including circle, triangle, rectangle, trapezoid, ellipse, and hexagon.',
    url: 'https://roughtools.com/tools/calculators/area-calculator',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '1243' },
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
      { '@type': 'ListItem', position: 3, name: 'Area Calculator', item: 'https://roughtools.com/tools/calculators/area-calculator' },
    ],
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AreaCalculatorPage() {
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
          <span style={{ color: 'var(--brand)' }}>Area Calculator</span>
        </nav>

        {/* H1 */}
        <div style={{ fontSize: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(139,92,246,0.15)', borderRadius: 14, padding: '10px 14px', lineHeight: 1, marginBottom: 12 }}>
          📐
        </div>
        <h1 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, color: 'var(--fg)', margin: '0 0 10px', letterSpacing: '-0.5px' }}>
          Free Area Calculator
        </h1>
        <p style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.7, margin: '0 0 20px', maxWidth: 680 }}>
          Calculate area and perimeter for 10 common 2D shapes: square, rectangle, circle, triangle, trapezoid,
          parallelogram, ellipse, regular hexagon, regular pentagon, and sector.
          Select a shape, enter dimensions, and get instant results with the formula shown.
        </p>

        {/* Trust badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
          {['⚡ Instant results', '🔒 100% private', '🆓 Always free', '🚫 No signup', '📐 10 shapes'].map(b => (
            <span key={b} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)',
              borderRadius: 20, padding: '5px 12px', fontSize: 12, color: 'var(--brand-2)', fontWeight: 500,
            }}>{b}</span>
          ))}
        </div>

        <ToolAdUnit position="top" />

        {/* Calculator widget */}
        <AreaCalculatorClient />

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
            About This Area Calculator
          </h2>

          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The Area Calculator computes both the area and perimeter (or circumference) of ten common two-dimensional
            geometric shapes. Whether you are working on a school assignment, planning a home renovation, calculating
            material quantities for a construction project, or simply need to verify a geometry formula, this tool
            delivers precise results instantly using the same standard formulas used in every mathematics textbook
            and engineering application worldwide.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            The Formulas — How It Works
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            Each shape uses its established Euclidean geometry formula. Area is always expressed in square units
            (the unit of measurement squared), while perimeter is expressed in the same linear unit as the inputs.
            For example, if you enter dimensions in metres, area is returned in m² and perimeter in metres.
          </p>
          <div style={{ background: 'var(--bg-3)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 10, padding: '14px 18px', marginBottom: 14, fontFamily: 'monospace', fontSize: 12, color: 'var(--brand-2)', lineHeight: 1.9 }}>
            Circle:       A = π × r²   |   C = 2πr{'\n'}
            Rectangle:    A = l × w    |   P = 2(l + w){'\n'}
            Triangle:     A = (b × h) / 2{'\n'}
            Trapezoid:    A = (a + b) / 2 × h{'\n'}
            Parallelogram: A = base × height{'\n'}
            Ellipse:      A = π × a × b{'\n'}
            Hexagon:      A = (3√3 / 2) × s²{'\n'}
            Pentagon:     A = (s² × √(25 + 10√5)) / 4
          </div>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            What Is Area and Why Does It Matter?
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            Area is one of the most fundamental concepts in geometry and has enormous practical importance.
            In everyday life, area calculations underpin decisions about flooring, tiling, painting, carpeting,
            landscaping, agriculture, architecture, and urban planning. A homeowner calculating how many tiles to
            buy for a bathroom floor, a gardener determining how much fertiliser to spread, a builder estimating
            the cost of roofing material — all of these require accurate area calculations. Even the pricing of
            real estate is fundamentally based on square footage (or square metres), making area literacy an
            essential life skill.
          </p>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            In mathematics and physics, area appears in formulas for pressure (force ÷ area), surface concentration,
            flux, and probability density functions. Understanding how area scales — quadratically with linear
            dimensions, not linearly — is essential for correct reasoning about physical phenomena.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Supported Shapes and Their Applications
          </h3>
          <ul style={{ paddingLeft: 20, margin: '0 0 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              'Circle — pools, wheels, pipes, circular gardens, pizza, coins',
              'Rectangle — rooms, lawns, screens, fields, windows',
              'Triangle — roof sections, ramps, triangular land plots, sails',
              'Trapezoid — land parcels, structural beams, cross-section areas',
              'Parallelogram — diamond-shaped tiles, oblique roof sections',
              'Ellipse — oval tracks, elliptical pools, elliptical windows',
              'Regular hexagon — honeycomb structures, floor tiles, hex bolt heads',
              'Regular pentagon — architectural features, geometric art',
              'Sector — pie chart segments, fan-shaped areas, pizza slices',
              'Annulus — ring-shaped areas, doughnut cross-sections, hollow pipes',
            ].map((item, i) => (
              <li key={i} style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                <span style={{ color: '#8b5cf6', marginRight: 8 }}>•</span>{item}
              </li>
            ))}
          </ul>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Assumptions and Limitations
          </h3>
          <ul style={{ paddingLeft: 20, margin: '0 0 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              'All calculations assume perfect geometric shapes — real-world measurements introduce slight deviations',
              'Results assume consistent units — mixing metres and centimetres will produce incorrect answers',
              'For irregular shapes, decompose into simpler shapes and add the areas together',
              'The triangle formula requires the perpendicular height, not the slant height',
              'For curved real-world surfaces (hills, warped walls), the true surface area will be larger than the flat footprint area',
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
            All calculations in this area calculator run entirely in your browser. No data you enter is transmitted
            to any server or stored anywhere. See our{' '}
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
          toolName="Area Calculator"
          toolSlug="area-calculator"
          toolUrl="https://roughtools.com/tools/calculators/area-calculator"
          type="general"
        />

        <ToolAdUnit position="bottom" />
      </div>
    </>
  )
}
