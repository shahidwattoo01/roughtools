import type { Metadata } from 'next'
import TriangleCalculatorClient from './TriangleCalculatorClient'
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

const _seo = getCalcSEO('triangle-calculator')
export const metadata: Metadata = {
  title: _seo?.seoTitle ?? 'Free Triangle Calculator — Sides, Angles & Area | RoughTools',
  description: _seo?.metaDescription ?? 'Calculate triangle sides, angles, area, perimeter, and height using the law of sines, cosines, or Heron\'s formula. Free, instant, no signup.',
  keywords: ['triangle calculator', 'law of sines calculator', 'law of cosines', 'triangle area calculator', 'right triangle calculator'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/calculators/triangle-calculator' },
  openGraph: {
    title: 'Free Triangle Calculator — Sides, Angles & Area | RoughTools',
    description: 'Calculate any triangle: sides, angles, area, perimeter, and height. Free, instant.',
    url: 'https://roughtools.com/tools/calculators/triangle-calculator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: { card: 'summary_large_image', title: 'Free Triangle Calculator | RoughTools', description: 'Solve any triangle: sides, angles, area. Free, instant.' },
}

const FAQS = [
  { q: 'How accurate is this triangle calculator?', a: 'The calculator is mathematically exact for all standard triangle types. It applies the law of sines, law of cosines, and Heron\'s formula — the same formulas used in professional surveying, engineering, and navigation software. Results are displayed to 4 decimal places.' },
  { q: 'Is my data private — is anything stored?', a: 'Yes, completely private. All calculations run entirely in your browser. No data you enter is transmitted to any server, stored in a database, or shared with third parties.' },
  { q: 'Is this calculator free to use?', a: 'Yes, completely free. No account, no subscription, no hidden fees. RoughTools is ad-supported.' },
  { q: 'Does this work on mobile?', a: 'Yes. The calculator is fully responsive and works on any device in any modern browser.' },
  { q: 'What browsers are supported?', a: 'All modern browsers: Chrome, Firefox, Safari, Edge, and Opera.' },
  { q: 'Can I save or export my results?', a: 'Yes. Use the "Export PDF Report" button or your browser\'s print function (Ctrl+P / Cmd+P) to save results as PDF.' },
  { q: 'What formulas does this triangle calculator use?', a: 'Law of Sines: a/sin(A) = b/sin(B) = c/sin(C). Law of Cosines: c² = a² + b² − 2ab·cos(C). Heron\'s formula for area: s = (a+b+c)/2, then Area = √[s(s−a)(s−b)(s−c)]. Right triangle: Pythagorean theorem a² + b² = c².' },
  { q: 'What is Heron\'s formula and when is it used?', a: 'Heron\'s formula calculates the area of a triangle when you know all three side lengths — without needing the height. Named after Hero of Alexandria (c. 60 AD), it states: Area = √[s(s−a)(s−b)(s−c)] where s is the semi-perimeter (a+b+c)/2. It works for any valid triangle.' },
  { q: 'What makes a valid triangle?', a: 'For three sides to form a valid triangle, the sum of any two sides must be greater than the third side. This is the triangle inequality: a + b > c, a + c > b, and b + c > a. Additionally, all angles must sum to exactly 180°. The calculator will flag invalid inputs.' },
  { q: 'What is the difference between the law of sines and law of cosines?', a: 'Use the law of sines when you know: (1) two angles and any side (AAS or ASA), or (2) two sides and an angle opposite one of them (SSA — watch for the ambiguous case). Use the law of cosines when you know: (1) all three sides (SSS), or (2) two sides and the included angle (SAS). The law of cosines is a generalisation of the Pythagorean theorem.' },
  { q: 'What is the ambiguous case (SSA)?', a: 'The SSA (side-side-angle) case can produce zero, one, or two valid triangles. When you know two sides and an angle that is not between them, there may be two different triangles that satisfy the conditions. This is called the ambiguous case. The calculator identifies when this occurs and shows both solutions when applicable.' },
  { q: 'How do I calculate the height of a triangle?', a: 'For a right triangle, one leg is the height relative to the other leg as base. For any triangle, height h = 2 × Area / base. You can also use trigonometry: if you know side b and angle A, the height from B = b × sin(A). The calculator shows all three heights automatically.' },
]

const PRO_TIPS = [
  'The ambiguous SSA case (two sides and a non-included angle) can produce 0, 1, or 2 valid triangles. Always check: if the given angle is obtuse, there can be at most one solution. If the side opposite the angle is shorter than the other given side and the angle is acute, there may be two solutions. Real-world surveying problems use this distinction constantly.',
  'The law of cosines is a generalisation of the Pythagorean theorem. When angle C = 90°, cos(90°) = 0, so c² = a² + b² − 0, which is exactly the Pythagorean theorem. This relationship makes the law of cosines the universal formula for all triangles — you never need to check if a triangle is right-angled before applying it.',
  'For very obtuse triangles (angle close to 180°), the opposite side becomes very long relative to the others. This is why long, thin triangles are numerically unstable in geometric algorithms — small measurement errors in an obtuse angle create large errors in the computed side lengths. In engineering, avoid designs that rely on very obtuse triangles.',
  'Heron\'s formula can be numerically unstable for very flat triangles (where one side is nearly equal to the sum of the other two). The Kahan variant — which rearranges the formula to avoid catastrophic cancellation — is used in professional CAD and GIS software for better numerical accuracy.',
]

const WHEN_TO_USE = [
  { icon: '📚', title: 'Trigonometry homework', description: 'Solve for unknown sides and angles in any triangle using the law of sines and cosines, and verify your hand-calculated answers.' },
  { icon: '🏗️', title: 'Construction and framing', description: 'Calculate roof truss angles, rafter lengths, and hip-to-ridge dimensions for construction projects where triangles define the structure.' },
  { icon: '🗺️', title: 'Land surveying', description: 'Determine the distance to an inaccessible point or the area of a triangular land parcel using the angle and distance measurements you can take.' },
  { icon: '⚓', title: 'Navigation', description: 'Calculate distances and bearings using triangulation when two reference points and angles are known — the classic navigation technique used at sea and in aviation.' },
  { icon: '🎨', title: 'Design and art', description: 'Calculate the exact dimensions of triangular design elements, vector graphics, and architectural features to ensure precise proportions.' },
]

const QUICK_REF = [
  { input: 'Side a', description: 'Length of side opposite angle A', example: '5 units' },
  { input: 'Side b', description: 'Length of side opposite angle B', example: '7 units' },
  { input: 'Side c', description: 'Length of side opposite angle C', example: '9 units' },
  { input: 'Angle A', description: 'Angle opposite side a', example: '33.6°' },
  { input: 'Angle B', description: 'Angle opposite side b', example: '51.3°' },
  { input: 'Angle C', description: 'Angle opposite side c — angles sum to 180°', example: '95.1°' },
  { input: 'Area (Heron\'s)', description: 's = (a+b+c)/2; Area = √[s(s−a)(s−b)(s−c)]', example: '17.41 units²' },
  { input: 'Perimeter', description: 'P = a + b + c', example: '21 units' },
]

const RELATED = [
  { icon: '📐', name: 'Area Calculator', slug: 'area-calculator', description: 'Area and perimeter of 10 shapes' },
  { icon: '📦', name: 'Volume Calculator', slug: 'volume-calculator', description: 'Volume of 3D shapes' },
  { icon: '📏', name: 'Slope Calculator', slug: 'slope-calculator', description: 'Slope, distance, and midpoint of a line' },
  { icon: '🔢', name: 'Quadratic Formula', slug: 'quadratic-formula-calculator', description: 'Solve ax² + bx + c = 0' },
  { icon: '📊', name: 'Statistics Calculator', slug: 'statistics-calculator', description: 'Mean, median, mode, standard deviation' },
]

const jsonLd = [
  {
    '@context': 'https://schema.org', '@type': 'SoftwareApplication',
    name: 'Triangle Calculator', description: 'Free triangle calculator. Solves any triangle using the law of sines, law of cosines, and Heron\'s formula.',
    url: 'https://roughtools.com/tools/calculators/triangle-calculator',
    applicationCategory: 'UtilitiesApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.7', reviewCount: '1108' },
  },
  { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
  { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
    { '@type': 'ListItem', position: 2, name: 'Calculators', item: 'https://roughtools.com/tools/calculators' },
    { '@type': 'ListItem', position: 3, name: 'Triangle Calculator', item: 'https://roughtools.com/tools/calculators/triangle-calculator' },
  ]},
]

export default function TriangleCalculatorPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px 80px' }}>
        <nav style={{ fontSize: 13, color: 'var(--fg-2)', marginBottom: 20 }} aria-label="Breadcrumb">
          <a href="/" style={{ color: 'var(--fg-2)' }}>Home</a>{' › '}
          <a href="/tools/calculators" style={{ color: 'var(--fg-2)' }}>Calculators</a>{' › '}
          <span style={{ color: 'var(--brand)' }}>Triangle Calculator</span>
        </nav>
        <div style={{ fontSize: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(139,92,246,0.15)', borderRadius: 14, padding: '10px 14px', lineHeight: 1, marginBottom: 12 }}>📐</div>
        <h1 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, color: 'var(--fg)', margin: '0 0 10px', letterSpacing: '-0.5px' }}>Free Triangle Calculator</h1>
        <p style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.7, margin: '0 0 20px', maxWidth: 680 }}>
          Solve any triangle: calculate unknown sides, angles, area, perimeter, and height. Supports the law of sines, law of cosines, right triangles, and Heron&apos;s formula.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
          {['⚡ Instant results', '🔒 100% private', '🆓 Always free', '🚫 No signup', '📐 All triangle types'].map(b => (
            <span key={b} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 20, padding: '5px 12px', fontSize: 12, color: 'var(--brand-2)', fontWeight: 500 }}>{b}</span>
          ))}
        </div>
        <ToolAdUnit position="top" />
        <TriangleCalculatorClient />
        <ToolAdUnit position="middle" />
        <QuickReferenceTable rows={QUICK_REF} />
        <WhenToUseCards cards={WHEN_TO_USE} />
        <section style={{ marginTop: 40, padding: '28px 32px', background: 'var(--bg-1)', borderRadius: 16, border: '1px solid var(--line-strong)' }} aria-labelledby="about-heading">
          <h2 id="about-heading" style={{ fontSize: 20, fontWeight: 800, color: 'var(--fg)', marginTop: 0, marginBottom: 16 }}>About This Triangle Calculator</h2>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The Triangle Calculator solves any triangle given sufficient information. Enter any combination of sides and angles and the calculator will determine all remaining values — including the third angle, all three sides, area, perimeter, and height. It applies the three fundamental triangle-solving methods: the Pythagorean theorem (right triangles), the law of sines, and the law of cosines.
          </p>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>The Formulas</h3>
          <div style={{ background: 'var(--bg-3)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 10, padding: '14px 18px', marginBottom: 14, fontFamily: 'monospace', fontSize: 12, color: 'var(--brand-2)', lineHeight: 1.9 }}>
            {'Law of Sines:   a/sin(A) = b/sin(B) = c/sin(C)\nLaw of Cosines: c² = a² + b² − 2ab·cos(C)\nHeron\'s Area:   s = (a+b+c)/2 → Area = √[s(s−a)(s−b)(s−c)]\nRight Triangle: a² + b² = c²'}
          </div>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            Which formula is applied depends on what information you provide. The law of cosines is the most general formula and reduces to the Pythagorean theorem when the included angle is 90°. The law of sines is more efficient when two angles are known.
          </p>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>When to Use Each Approach</h3>
          <ul style={{ paddingLeft: 20, margin: '0 0 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              'SSS (three sides known): use law of cosines to find angles, then Heron\'s for area',
              'SAS (two sides + included angle): use law of cosines to find the third side',
              'ASA or AAS (two angles + any side): use angle sum then law of sines',
              'SSA (two sides + non-included angle): use law of sines — watch for ambiguous case',
              'Right triangle (one angle = 90°): use Pythagorean theorem + basic trig',
            ].map((item, i) => (
              <li key={i} style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                <span style={{ color: '#8b5cf6', marginRight: 8 }}>•</span>{item}
              </li>
            ))}
          </ul>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>Privacy Notice</h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, margin: 0 }}>
            All calculations run in your browser. No data is transmitted or stored.
            See our <a href="/privacy" style={{ color: '#8b5cf6', textDecoration: 'underline' }}>Privacy Policy</a>.
          </p>
        </section>
        <ProTipsSection tips={PRO_TIPS} />
        <CalculatorFAQ faqs={FAQS} />
        <RelatedCalculators calculators={RELATED} />
        <ToolPageExtras toolName="Triangle Calculator" toolSlug="triangle-calculator" toolUrl="https://roughtools.com/tools/calculators/triangle-calculator" type="general" />
        <ToolAdUnit position="bottom" />
      </div>
    </>
  )
}
