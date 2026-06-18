import type { Metadata } from 'next';
import QuadraticCalculatorClient from './QuadraticCalculatorClient';
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

// ─── Metadata ────────────────────────────────────────────────────────────────

const _seo = getCalcSEO('quadratic-formula-calculator');
export const metadata: Metadata = {
  title: _seo?.seoTitle ?? 'Free Quadratic Formula Calculator — Solve ax²+bx+c=0 | RoughTools',
  description:
    _seo?.metaDescription ??
    'Solve any quadratic equation ax²+bx+c=0 instantly. Get real or complex roots, discriminant, vertex, and axis of symmetry. Free, private, no signup.',
  keywords: [
    'quadratic formula calculator',
    'quadratic equation solver',
    'solve ax2+bx+c=0',
    'discriminant calculator',
    'quadratic roots calculator',
    'free quadratic calculator',
  ],
  robots: { index: true, follow: true },
  alternates: {
    canonical: 'https://roughtools.com/tools/calculators/quadratic-formula-calculator',
  },
  openGraph: {
    title: 'Free Quadratic Formula Calculator — Solve ax²+bx+c=0 | RoughTools',
    description:
      'Solve any quadratic equation — real or complex roots, discriminant, vertex. Free, instant, no signup.',
    url: 'https://roughtools.com/tools/calculators/quadratic-formula-calculator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Quadratic Formula Calculator | RoughTools',
    description: 'Solve ax²+bx+c=0 instantly. Real or complex roots, discriminant, vertex. Free.',
  },
};

// ─── FAQ data (12 questions — accordion) ─────────────────────────────────────

const FAQS = [
  {
    q: 'How accurate is this quadratic formula calculator?',
    a: 'The calculator is mathematically accurate for the quadratic formula. Roots are computed using IEEE 754 double-precision arithmetic, which provides about 15–17 significant digits. For very large or very small coefficients, rounding in floating-point arithmetic can occasionally cause tiny precision errors in the last digits, but for all practical purposes the results are exact.',
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
    a: "Use your browser's print function (Ctrl+P or Cmd+P) to save the results as a PDF. You can also copy the roots and discriminant values directly from the results panel on screen.",
  },
  {
    q: 'Do I need professional advice to use this calculator?',
    a: 'No — solving a quadratic equation is a pure mathematical operation. No professional advice is required for the arithmetic itself. However, if the equation models a physical, engineering, financial, or structural problem, consult the appropriate domain professional to ensure the model and inputs are correct.',
  },
  {
    q: 'What formula does this calculator use?',
    a: 'The standard quadratic formula: for ax² + bx + c = 0, the roots are x = (−b ± √(b² − 4ac)) / (2a). The discriminant is D = b² − 4ac. If D > 0: two distinct real roots; if D = 0: one repeated real root; if D < 0: two complex conjugate roots of the form (−b ± i√|D|) / (2a), where i = √(−1).',
  },
  {
    q: 'What is the discriminant and why does it matter?',
    a: 'The discriminant D = b² − 4ac determines how many solutions a quadratic equation has and what type they are. If D > 0: two distinct real roots (the parabola crosses the x-axis at two points). If D = 0: one real repeated root (the parabola is tangent to the x-axis at exactly one point — the vertex). If D < 0: no real roots — the two solutions are complex (imaginary) conjugates (the parabola does not cross the x-axis). Always check the discriminant first.',
  },
  {
    q: 'What if the coefficient a equals zero?',
    a: 'If a = 0, the equation is no longer quadratic — it becomes the linear equation bx + c = 0, which has the single solution x = −c/b (provided b ≠ 0). The quadratic formula is undefined when a = 0 because division by 2a = 0 is undefined. This calculator will alert you if a = 0 and prompt you to use a linear solver instead.',
  },
  {
    q: 'Is completing the square an alternative to the quadratic formula?',
    a: 'Yes. Completing the square is an algebraic technique that rewrites ax² + bx + c = 0 in the form a(x + p)² + q = 0, from which x = −p ± √(−q/a). The quadratic formula itself is derived by completing the square on the general form. Completing the square is useful for understanding the vertex form of a parabola and for deriving the formula algebraically. For quick numerical answers, the quadratic formula is more direct.',
  },
  {
    q: 'What are complex or imaginary roots and what do they mean geometrically?',
    a: 'When the discriminant D = b² − 4ac is negative, the square root of a negative number is required. The imaginary unit i is defined as √(−1), so the roots take the form (−b ± i√|D|) / (2a). These are complex conjugate pairs. Geometrically, complex roots mean the parabola y = ax² + bx + c never crosses the x-axis — it lies entirely above or below the x-axis (depending on the sign of a). Real-world interpretations depend on context: for example, a negative discriminant in a projectile problem means the object never reaches that height.',
  },
];

// ─── Pro Tips ─────────────────────────────────────────────────────────────────

const PRO_TIPS = [
  'Always compute the discriminant D = b² − 4ac before applying the full formula. It tells you instantly how many solutions to expect: D > 0 → two real solutions, D = 0 → one solution, D < 0 → no real solutions. This check saves time and prevents confusion about why the calculator shows complex results.',
  'If a = 0, do not use this calculator — the equation is linear, not quadratic. The solution is simply x = −c/b. Substituting a = 0 into the quadratic formula produces a division by zero. Always verify a ≠ 0 before entering coefficients.',
  'Verify your solutions by substituting them back into the original equation. If x = r is a root of ax² + bx + c = 0, then a(r)² + b(r) + c should equal exactly 0 (or very close to 0, accounting for floating-point precision). This sanity check catches sign errors and transcription mistakes in the coefficients.',
  'The vertex of the parabola y = ax² + bx + c is at x = −b/(2a) on the x-axis and y = c − b²/(4a) on the y-axis. The vertex is the maximum point if a < 0 (parabola opens downward) and the minimum point if a > 0 (parabola opens upward). Many optimisation problems in physics and economics reduce to finding the vertex of a quadratic.',
];

// ─── When to Use ─────────────────────────────────────────────────────────────

const WHEN_TO_USE = [
  {
    icon: '🚀',
    title: 'Physics — projectile motion problems',
    description:
      'The height of a projectile over time follows a quadratic equation. Solve for when the object hits the ground (h = 0), reaches maximum height (vertex), or passes a specific height.',
  },
  {
    icon: '📉',
    title: 'Optimisation — maximum and minimum problems',
    description:
      'Revenue, profit, area, and cost functions are often quadratic. The vertex gives the maximum revenue or minimum cost. Solve ax² + bx + c = 0 to find break-even points.',
  },
  {
    icon: '📐',
    title: 'Geometry — area and dimension problems',
    description:
      'When the area of a rectangle, triangle, or other shape is given as a quadratic expression in one unknown dimension, the quadratic formula gives the required dimensions directly.',
  },
  {
    icon: '🏗️',
    title: 'Engineering — beam and structural design',
    description:
      'Bending moment equations, cable catenary problems, and signal processing filters all produce quadratic equations. Get roots and vertex coordinates for structural analysis.',
  },
  {
    icon: '💹',
    title: 'Finance — break-even analysis',
    description:
      'When total cost and total revenue are both expressed as functions of quantity produced, setting them equal produces a quadratic equation. Solve for the break-even quantity.',
  },
];

// ─── Quick Reference table ────────────────────────────────────────────────────

const QUICK_REF = [
  { input: 'Coefficient a', description: 'Coefficient of x² — must not be zero', example: '2' },
  { input: 'Coefficient b', description: 'Coefficient of x', example: '−5' },
  { input: 'Coefficient c', description: 'Constant term', example: '3' },
  {
    input: 'Discriminant (b²−4ac)',
    description: 'D > 0: two real roots; D = 0: one root; D < 0: complex roots',
    example: '25 − 24 = 1',
  },
  {
    input: 'Root x₁',
    description: '(−b + √D) / 2a — larger root',
    example: 'x₁ = (5 + 1) / 4 = 1.5',
  },
  {
    input: 'Root x₂',
    description: '(−b − √D) / 2a — smaller root',
    example: 'x₂ = (5 − 1) / 4 = 1.0',
  },
  {
    input: 'Vertex x-coordinate',
    description: '−b / (2a) — axis of symmetry',
    example: '5/4 = 1.25',
  },
];

// ─── Related calculators ──────────────────────────────────────────────────────

const RELATED = [
  {
    icon: '🔬',
    name: 'Scientific Calculator',
    slug: 'scientific-calculator',
    description: 'Advanced math operations',
  },
  {
    icon: '📈',
    name: 'Statistics Calculator',
    slug: 'statistics-calculator',
    description: 'Mean, median, SD and more',
  },
  {
    icon: '📐',
    name: 'Slope Calculator',
    slug: 'slope-calculator',
    description: 'Find slope between two points',
  },
  {
    icon: '📊',
    name: 'Percentage Calculator',
    slug: 'percentage-calculator',
    description: 'Percentage and ratio calculations',
  },
];

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Quadratic Formula Calculator',
    description:
      'Free quadratic formula calculator. Solves ax² + bx + c = 0 for real or complex roots. Computes discriminant, vertex, and axis of symmetry.',
    url: 'https://roughtools.com/tools/calculators/quadratic-formula-calculator',
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
        name: 'Quadratic Formula Calculator',
        item: 'https://roughtools.com/tools/calculators/quadratic-formula-calculator',
      },
    ],
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function QuadraticFormulaPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px 80px' }}>
        {/* Breadcrumb */}
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
          <span style={{ color: 'var(--brand)' }}>Quadratic Formula Calculator</span>
        </nav>

        {/* H1 */}
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
          📐
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
          Free Quadratic Formula Calculator
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
          Solve any quadratic equation ax² + bx + c = 0 instantly. Enter the three coefficients to
          get real or complex roots, the discriminant, vertex coordinates, and axis of symmetry.
          Free, private — all calculations run in your browser.
        </p>

        {/* Trust badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
          {[
            '⚡ Instant results',
            '🔒 100% private',
            '🆓 Always free',
            '🚫 No signup',
            '✅ Real & complex roots',
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

        {/* Calculator widget */}
        <QuadraticCalculatorClient />

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
            About This Quadratic Formula Calculator
          </h2>

          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            A quadratic equation is any equation that can be written in the standard form ax² + bx +
            c = 0, where a, b, and c are constants and a ≠ 0. Quadratic equations are among the most
            important in mathematics — they model projectile trajectories, areas, profit
            maximisation, structural loads, electrical circuits, and countless other real-world
            phenomena. This calculator solves any quadratic equation instantly using the quadratic
            formula and provides all related values: discriminant, both roots (real or complex),
            vertex, and axis of symmetry.
          </p>

          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--brand-2)',
              margin: '20px 0 10px',
            }}
          >
            The Quadratic Formula
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 10 }}>
            For the equation ax² + bx + c = 0, the two solutions (roots) are:
          </p>
          <div
            style={{
              background: 'var(--bg-3)',
              border: '1px solid rgba(139,92,246,0.25)',
              borderRadius: 10,
              padding: '14px 18px',
              marginBottom: 14,
              fontFamily: 'monospace',
              fontSize: 13,
              color: 'var(--brand-2)',
              lineHeight: 2,
            }}
          >
            x = (−b ± √(b² − 4ac)) / (2a)
            <br />
            Discriminant D = b² − 4ac
          </div>
          <p style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The <strong style={{ color: '#c4caff' }}>± symbol</strong> produces two solutions: x₁
            uses +√D and x₂ uses −√D. The{' '}
            <strong style={{ color: '#c4caff' }}>discriminant D</strong> controls the nature of the
            solutions: D &gt; 0 → two distinct real roots, D = 0 → one repeated real root (x =
            −b/2a), D &lt; 0 → two complex conjugate roots.
          </p>

          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--brand-2)',
              margin: '20px 0 10px',
            }}
          >
            The Discriminant Explained
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The discriminant D = b² − 4ac is the expression under the square root in the quadratic
            formula. It &quot;discriminates&quot; between the three cases:
          </p>
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
              'D > 0: two distinct real roots — the parabola crosses the x-axis at two points',
              'D = 0: one repeated real root at x = −b/(2a) — the parabola is tangent to the x-axis',
              'D < 0: no real roots — two complex conjugate roots — the parabola does not intersect the x-axis',
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
            Vertex Form and the Parabola
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            Every quadratic y = ax² + bx + c describes a parabola. The vertex is its highest or
            lowest point. The x-coordinate of the vertex is x = −b/(2a) — also the axis of symmetry
            about which the parabola is mirror-symmetric. The y-coordinate is found by substituting
            this x back: y = a(−b/2a)² + b(−b/2a) + c = c − b²/(4a). If a &gt; 0, the parabola opens
            upward and the vertex is a minimum (optimisation: minimise cost, distance). If a &lt; 0,
            the parabola opens downward and the vertex is a maximum (optimisation: maximise profit,
            height, area).
          </p>

          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--brand-2)',
              margin: '20px 0 10px',
            }}
          >
            Complex and Imaginary Roots
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            When D &lt; 0, the square root of a negative number is required. The imaginary unit i is
            defined as i = √(−1), so √(−D) = i√|D|. The two complex roots are: x = (−b + i√|D|) /
            (2a) and x = (−b − i√|D|) / (2a). These are complex conjugates — they always appear in
            conjugate pairs. In engineering, complex roots arise in oscillation and signal problems.
            In a real-world projectile or geometric problem, complex roots simply mean there is no
            real solution (the projectile never reaches that height, or the dimensions have no real
            solution).
          </p>

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
            All calculations run entirely in your browser. No data you enter is transmitted to any
            server, stored in any database, or shared with third parties. Your inputs stay
            completely private on your device. See our{' '}
            <a href="/privacy" style={{ color: '#8b5cf6', textDecoration: 'underline' }}>
              Privacy Policy
            </a>{' '}
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
          toolName="Quadratic Formula Calculator"
          toolSlug="quadratic-formula-calculator"
          toolUrl="https://roughtools.com/tools/calculators/quadratic-formula-calculator"
          type="general"
        />

        <ToolAdUnit position="bottom" />
      </div>
    </>
  );
}
