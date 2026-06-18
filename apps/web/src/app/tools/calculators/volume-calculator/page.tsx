import type { Metadata } from 'next';
import VolumeCalculatorClient from './VolumeCalculatorClient';
import { getCalcSEO } from '../_components/calc-seo-configs';
import ToolAdUnit from '@/components/ToolAdUnit';
import { JsonLd } from '@/components/JsonLd';
import { ToolPageExtras } from '@/components/ToolPageExtras';
import {
  ProTipsSection,
  WhenToUseCards,
  QuickReferenceTable,
  CalculatorFAQ,
  RelatedCalculators,
} from '@/components/tools/CalculatorSections';

const _seo = getCalcSEO('volume-calculator');
export const metadata: Metadata = {
  title: _seo?.seoTitle ?? 'Free Volume Calculator — 12 3D Shapes | RoughTools',
  description:
    _seo?.metaDescription ??
    'Calculate volume and surface area for 12 3D shapes: cube, sphere, cylinder, cone, pyramid, and more. Free, instant, no signup.',
  keywords: [
    'volume calculator',
    'surface area calculator',
    'volume of sphere',
    'volume of cylinder',
    'volume of cone',
    '3d shape calculator',
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/calculators/volume-calculator' },
  openGraph: {
    title: 'Free Volume Calculator — 12 3D Shapes | RoughTools',
    description:
      'Volume and surface area for cube, sphere, cylinder, cone, and 8 more shapes. Free, instant.',
    url: 'https://roughtools.com/tools/calculators/volume-calculator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Volume Calculator | RoughTools',
    description: 'Volume and surface area for 12 3D shapes. Free, instant.',
  },
};

const FAQS = [
  {
    q: 'How accurate is this volume calculator?',
    a: 'The calculator is mathematically exact. It uses the standard geometric formulas for each shape with full floating-point precision. Results are rounded to 4 decimal places. The only source of imprecision is the precision of your input measurements.',
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
    a: 'Yes. The calculator is fully responsive and works on any device in any modern browser.',
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
    q: 'What formulas does this volume calculator use?',
    a: 'Cube: V = s³. Rectangular prism: V = l×w×h. Sphere: V = (4/3)πr³. Cylinder: V = πr²h. Cone: V = (1/3)πr²h. Pyramid: V = (1/3)×base area×h. Triangular prism: V = (1/2)×b×h×l. Ellipsoid: V = (4/3)π×a×b×c. Torus: V = 2π²Rr². Capsule: V = πr²(4r/3 + h).',
  },
  {
    q: 'What is the difference between volume and surface area?',
    a: 'Volume measures the 3D space enclosed inside a shape, expressed in cubic units (cm³, m³, ft³). Surface area measures the total area of all the outer faces of a shape, expressed in square units (cm², m², ft²). Volume tells you how much material fits inside; surface area tells you how much material coats the outside.',
  },
  {
    q: 'What is the volume of a sphere?',
    a: 'Volume of a sphere = (4/3) × π × r³, where r is the radius. Surface area = 4πr². Example: a sphere with radius 5 cm has volume = (4/3) × π × 125 ≈ 523.6 cm³. The sphere has the largest volume-to-surface-area ratio of any shape — this is why soap bubbles and planets are spherical (nature minimises surface area for a given volume).',
  },
  {
    q: 'What is the volume of a cylinder?',
    a: 'Volume of a cylinder = π × r² × h, where r is the radius of the circular base and h is the height. Surface area (closed cylinder) = 2πr² + 2πrh. Example: a cylinder with radius 4 cm and height 10 cm has volume ≈ 502.7 cm³.',
  },
  {
    q: 'How do I calculate the volume of a cone?',
    a: 'Volume of a cone = (1/3) × π × r² × h, where r is the radius of the base and h is the perpendicular height. A cone has exactly one-third the volume of a cylinder with the same base radius and height. This relationship (cone = 1/3 cylinder) was proved by Archimedes and is a cornerstone of solid geometry.',
  },
  {
    q: 'How do unit conversions work for volume?',
    a: '1 cubic metre (m³) = 1,000 litres. 1 cubic centimetre (cm³) = 1 millilitre (mL). 1 cubic foot = 28.317 litres ≈ 7.48 gallons. 1 US gallon = 231 cubic inches = 3.785 litres. Enter your dimensions in consistent units and the output will be in that unit cubed. The calculator does not mix units.',
  },
];

const PRO_TIPS = [
  'Volume scales with the cube of linear dimensions. If you double the radius of a sphere, the volume increases by 2³ = 8 times — not twice. This is the key insight behind why large tankers and storage vessels are more volume-efficient than many smaller ones, and why animals in cold climates tend to be larger (more volume relative to surface area means less heat loss).',
  'For real-world containers (tanks, rooms, pools), always measure the interior dimensions, not the exterior. Wall thickness can significantly reduce the actual usable volume, especially for thick-walled tanks and reinforced concrete structures.',
  'When calculating how much material a shape holds (concrete, water, soil, sand), always add 10-15% overage to account for settling, waste, and measurement imprecision. Builders routinely order 10% extra concrete — running short mid-pour is far costlier than having a small surplus.',
  'The cone-cylinder volume relationship (cone = 1/3 cylinder) and the pyramid-prism relationship (pyramid = 1/3 prism) are powerful mental shortcuts. If you fill a cone with water and pour it into the matching cylinder, you fill exactly one-third. You can verify this physically with any conical cup and graduated cylinder.',
];

const WHEN_TO_USE = [
  {
    icon: '🏗️',
    title: 'Construction and concrete',
    description:
      'Calculate how many cubic metres of concrete, soil, gravel, or fill material to order for foundations, walls, driveways, and landscaping projects.',
  },
  {
    icon: '🌊',
    title: 'Pool and tank design',
    description:
      'Determine the volume of a swimming pool, fish tank, water storage tank, or industrial vessel to calculate fill time, chemical dosing, and pump capacity.',
  },
  {
    icon: '📦',
    title: 'Packaging and shipping',
    description:
      'Calculate the volume of boxes, cylinders, and irregular packages to optimise packing density, compare shipping options, and calculate dimensional weight.',
  },
  {
    icon: '🍳',
    title: 'Cooking and baking',
    description:
      'Calculate the volume of a baking pan or pot to scale recipes up or down, or determine if a recipe will fit in a given container.',
  },
  {
    icon: '📚',
    title: 'School and university',
    description:
      'Solve 3D geometry problems, verify homework answers, and explore how changing dimensions affects volume and surface area.',
  },
];

const QUICK_REF = [
  { input: 'Cube', description: 'V = s³   |   SA = 6s²', example: 's=5 → V=125, SA=150' },
  {
    input: 'Rectangular Prism',
    description: 'V = l×w×h   |   SA = 2(lw+lh+wh)',
    example: '4×3×2 → V=24, SA=52',
  },
  {
    input: 'Sphere',
    description: 'V = (4/3)πr³   |   SA = 4πr²',
    example: 'r=5 → V≈523.6, SA≈314.2',
  },
  {
    input: 'Cylinder',
    description: 'V = πr²h   |   SA = 2πr² + 2πrh',
    example: 'r=3, h=7 → V≈197.9',
  },
  { input: 'Cone', description: 'V = (1/3)πr²h   |   SA = πr(r+l)', example: 'r=4, h=9 → V≈150.8' },
  { input: 'Pyramid', description: 'V = (1/3)×base area×h', example: 'b=6×6, h=10 → V=120' },
  { input: 'Triangular Prism', description: 'V = (1/2)×b×h×l', example: 'b=4, h=3, l=8 → V=48' },
];

const RELATED = [
  {
    icon: '📐',
    name: 'Area Calculator',
    slug: 'area-calculator',
    description: 'Area and perimeter of 2D shapes',
  },
  {
    icon: '📐',
    name: 'Triangle Calculator',
    slug: 'triangle-calculator',
    description: 'Sides, angles, and area of any triangle',
  },
  {
    icon: '📏',
    name: 'Slope Calculator',
    slug: 'slope-calculator',
    description: 'Slope, distance, and midpoint of a line',
  },
  {
    icon: '🔢',
    name: 'Statistics Calculator',
    slug: 'statistics-calculator',
    description: 'Mean, median, mode, standard deviation',
  },
  {
    icon: '🔬',
    name: 'Percent Error',
    slug: 'percent-error-calculator',
    description: 'Calculate measurement error percentage',
  },
];

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Volume Calculator',
    description: 'Free volume and surface area calculator for 12 common 3D shapes.',
    url: 'https://roughtools.com/tools/calculators/volume-calculator',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
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
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Calculators',
        item: 'https://roughtools.com/tools/calculators',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Volume Calculator',
        item: 'https://roughtools.com/tools/calculators/volume-calculator',
      },
    ],
  },
];

export default function VolumeCalculatorPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px 80px' }}>
        <nav
          style={{ fontSize: 13, color: 'var(--fg-2)', marginBottom: 20 }}
          aria-label="Breadcrumb"
        >
          <a href="/" style={{ color: 'var(--fg-2)' }}>
            Home
          </a>
          {' › '}
          <a href="/tools/calculators" style={{ color: 'var(--fg-2)' }}>
            Calculators
          </a>
          {' › '}
          <span style={{ color: 'var(--brand)' }}>Volume Calculator</span>
        </nav>
        <div
          style={{
            fontSize: 36,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(139,92,246,0.15)',
            borderRadius: 14,
            padding: '10px 14px',
            lineHeight: 1,
            marginBottom: 12,
          }}
        >
          📦
        </div>
        <h1
          style={{
            fontSize: 'clamp(22px,4vw,32px)',
            fontWeight: 800,
            color: 'var(--fg)',
            margin: '0 0 10px',
            letterSpacing: '-0.5px',
          }}
        >
          Free Volume Calculator
        </h1>
        <p
          style={{
            color: 'var(--fg-2)',
            fontSize: 15,
            lineHeight: 1.7,
            margin: '0 0 20px',
            maxWidth: 680,
          }}
        >
          Calculate volume and surface area for common 3D shapes including cube, sphere, cylinder,
          cone, pyramid, triangular prism, and more. Free, private — all calculations run in your
          browser.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
          {[
            '⚡ Instant results',
            '🔒 100% private',
            '🆓 Always free',
            '🚫 No signup',
            '📦 12 shapes',
          ].map((b) => (
            <span
              key={b}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                background: 'rgba(139,92,246,0.12)',
                border: '1px solid rgba(139,92,246,0.25)',
                borderRadius: 20,
                padding: '5px 12px',
                fontSize: 12,
                color: 'var(--brand-2)',
                fontWeight: 500,
              }}
            >
              {b}
            </span>
          ))}
        </div>
        <ToolAdUnit position="top" />
        <VolumeCalculatorClient />
        <ToolAdUnit position="middle" />
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
          <h2
            id="about-heading"
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: 'var(--fg)',
              marginTop: 0,
              marginBottom: 16,
            }}
          >
            About This Volume Calculator
          </h2>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The Volume Calculator computes both the volume and surface area of common
            three-dimensional geometric shapes using their standard formulas. Whether you need to
            calculate how much concrete a foundation requires, how many litres a cylindrical tank
            holds, or the surface area of a sphere for a school assignment, this tool delivers
            precise results instantly.
          </p>
          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--brand-2)',
              margin: '20px 0 10px',
            }}
          >
            The Formulas
          </h3>
          <div
            style={{
              background: 'var(--bg-3)',
              border: '1px solid rgba(139,92,246,0.25)',
              borderRadius: 10,
              padding: '14px 18px',
              marginBottom: 14,
              fontFamily: 'monospace',
              fontSize: 12,
              color: 'var(--brand-2)',
              lineHeight: 1.9,
            }}
          >
            {
              'Sphere:     V = (4/3)πr³    SA = 4πr²\nCylinder:   V = πr²h       SA = 2πr²+2πrh\nCone:       V = (1/3)πr²h  SA = πr(r+√(r²+h²))\nCube:       V = s³          SA = 6s²\nRectangular: V = l×w×h    SA = 2(lw+lh+wh)'
            }
          </div>
          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--brand-2)',
              margin: '20px 0 10px',
            }}
          >
            Assumptions and Limitations
          </h3>
          <ul
            style={{
              paddingLeft: 20,
              margin: '0 0 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            {[
              'Assumes perfect geometric shapes — real objects may have tolerances, deformations, or irregular surfaces',
              'All inputs must be in consistent units — mixing metres and centimetres will produce incorrect results',
              'For hollow objects (pipes, tanks with walls), subtract the inner volume from the outer volume',
              'Surface area calculations assume fully closed shapes — open-top containers require subtracting one face',
            ].map((item, i) => (
              <li key={i} style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                <span style={{ color: '#8b5cf6', marginRight: 8 }}>•</span>
                {item}
              </li>
            ))}
          </ul>
          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--brand-2)',
              margin: '20px 0 10px',
            }}
          >
            Privacy Notice
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, margin: 0 }}>
            All calculations run in your browser. No data is transmitted or stored. See our{' '}
            <a href="/privacy" style={{ color: '#8b5cf6', textDecoration: 'underline' }}>
              Privacy Policy
            </a>
            .
          </p>
        </section>
        <QuickReferenceTable rows={QUICK_REF} />
        <WhenToUseCards cards={WHEN_TO_USE} />

        <ProTipsSection tips={PRO_TIPS} />
        <CalculatorFAQ faqs={FAQS} />
        <RelatedCalculators calculators={RELATED} />
        <ToolPageExtras
          toolName="Volume Calculator"
          toolSlug="volume-calculator"
          toolUrl="https://roughtools.com/tools/calculators/volume-calculator"
          type="general"
        />
        <ToolAdUnit position="bottom" />
      </div>
    </>
  );
}
