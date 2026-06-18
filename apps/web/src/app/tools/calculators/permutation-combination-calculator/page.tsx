import type { Metadata } from 'next';
import PermCombClient from './PermCombClient';
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

const _seo = getCalcSEO('permutation-combination-calculator');
export const metadata: Metadata = {
  title: _seo?.seoTitle ?? 'Free Permutation & Combination Calculator | RoughTools',
  description:
    _seo?.metaDescription ??
    'Calculate permutations P(n,r) and combinations C(n,r) instantly. Includes factorial table, step-by-step formulas, and real-world examples. Free, private, no signup.',
  keywords: [
    'permutation calculator',
    'combination calculator',
    'nPr calculator',
    'nCr calculator',
    'factorial calculator',
    'permutation combination formula',
    'how to calculate nCr',
    'combinatorics calculator',
  ],
  robots: { index: true, follow: true },
  alternates: {
    canonical: 'https://roughtools.com/tools/calculators/permutation-combination-calculator',
  },
  openGraph: {
    title: 'Free Permutation & Combination Calculator | RoughTools',
    description:
      'Calculate permutations P(n,r) and combinations C(n,r) with factorial table. Free, instant, no signup.',
    url: 'https://roughtools.com/tools/calculators/permutation-combination-calculator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Permutation & Combination Calculator | RoughTools',
    description: 'Calculate nPr and nCr instantly with formulas. Free.',
  },
};

// ─── FAQ data (12 questions — accordion) ─────────────────────────────────────

const FAQS = [
  {
    q: 'How accurate is this permutation and combination calculator?',
    a: 'The calculator is mathematically exact for all values of n and r within the supported range. It computes factorials precisely using integer arithmetic. For very large values of n (above 170), JavaScript reaches floating-point limits and the results become approximate — the tool will indicate this. For all practical educational and professional uses up to n = 170, results are exact.',
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
    q: 'Should I consult a professional for combinatorics problems?',
    a: 'For academic coursework, a mathematics tutor or professor is the right resource. For professional applications — such as probability modelling in finance, cryptography key-space calculations, or statistical design — consult a qualified statistician or mathematician.',
  },
  {
    q: 'What are the formulas used?',
    a: 'Permutations (order matters): P(n,r) = n! / (n−r)!. Combinations (order does not matter): C(n,r) = n! / (r! × (n−r)!). Factorial: n! = n × (n−1) × (n−2) × … × 2 × 1. By convention, 0! = 1. The key relationship: P(n,r) = C(n,r) × r! — each combination can be arranged r! ways to create all its permutations.',
  },
  {
    q: 'What is the difference between permutation and combination — and when does order matter?',
    a: 'This is the single most important question in combinatorics. Order matters in permutations: choosing A then B is different from choosing B then A. Order does NOT matter in combinations: {A, B} is the same selection regardless of sequence. Rule of thumb: if you can swap two selected items and get the same valid result, use combinations. If the swap creates a different valid result (different password, different race ranking), use permutations.',
  },
  {
    q: 'What is 0! and why does it equal 1?',
    a: '0! = 1 by mathematical convention, not arbitrary rule. It follows logically from the recursive definition: n! = n × (n−1)!. Setting n=1: 1! = 1 × 0!, so 0! must equal 1 for the formula to be consistent. Conceptually, there is exactly one way to arrange zero objects — do nothing. This convention is essential for the combination formula C(n,0) = 1 (there is one way to choose nothing).',
  },
  {
    q: 'What happens when n is very large — will the calculator overflow?',
    a: "JavaScript's Number type (64-bit floating-point) can represent integers exactly up to 2⁵³ ≈ 9 × 10¹⁵. Beyond that, precision is lost. 20! ≈ 2.43 × 10¹⁸ already exceeds exact integer precision. For large n, the calculator uses floating-point approximations. For cryptographic or scientific applications requiring exact large-number arithmetic, use a dedicated big-integer library or computer algebra system like Python's math.comb() or Wolfram Alpha.",
  },
  {
    q: 'How do I calculate lottery odds using this calculator?',
    a: "For a standard 6/49 lottery (pick 6 numbers from 1 to 49), set n=49 and r=6, and use combinations (order doesn't matter — the numbers just need to match). C(49,6) = 13,983,816 — meaning the odds of matching all 6 numbers are 1 in 13,983,816. For a lottery where order matters (rare), use permutations instead. Powerball and Mega Millions use a two-step calculation involving a bonus ball.",
  },
];

// ─── Pro Tips ─────────────────────────────────────────────────────────────────

const PRO_TIPS = [
  'The single most important question in any combinatorics problem: does ORDER matter? If rearranging the selected items gives you a different, valid result — use permutations. If rearranging gives you the same result — use combinations. This one question determines which formula to apply in every problem.',
  'C(n,r) = C(n, n−r) — the symmetry property. Choosing 3 items from 10 gives the same count as rejecting 7 items from 10: C(10,3) = C(10,7) = 120. Use the smaller of r and (n−r) to simplify manual calculations and reduce arithmetic.',
  "Pascal's Triangle is a shortcut for generating combination values without calculating factorials. Each entry is the sum of the two above it, and the r-th entry in row n is exactly C(n,r). This is why binomial expansion coefficients come from Pascal's Triangle.",
  "For very large n, use Stirling's approximation: ln(n!) ≈ n×ln(n) − n + 0.5×ln(2πn). This lets you work with log-scale values to avoid overflow — useful in information theory, genetics, and statistical physics where n can reach millions.",
];

// ─── When to Use ─────────────────────────────────────────────────────────────

const WHEN_TO_USE = [
  {
    icon: '🎰',
    title: 'Lottery probability calculation',
    description:
      'Calculate the exact odds of winning a lottery by computing C(pool, picks). Essential for understanding the true probability before playing.',
  },
  {
    icon: '🔐',
    title: 'Password and PIN combination count',
    description:
      'Determine how many unique passwords or PINs are possible given a character set and length — key for security analysis and strength evaluation.',
  },
  {
    icon: '👥',
    title: 'Team and committee selection',
    description:
      "Find how many ways to select a team of k members from n candidates when position doesn't matter — classic combination problem.",
  },
  {
    icon: '💺',
    title: 'Seating arrangement problems',
    description:
      'Calculate the number of ways to arrange people in seats when position matters — a permutation problem common in event planning and exam prep.',
  },
  {
    icon: '🏆',
    title: 'Sports bracket and ranking calculations',
    description:
      'Determine the number of possible finishing orders in a race or tournament — permutations where every position is distinct and order is critical.',
  },
];

// ─── Quick Reference table ────────────────────────────────────────────────────

const QUICK_REF = [
  { input: 'n', description: 'Total number of items in the pool', example: '10 (total students)' },
  {
    input: 'r',
    description: 'Number of items being chosen or arranged',
    example: '3 (chosen for team)',
  },
  {
    input: 'P(n,r)',
    description: 'Permutations — ordered arrangements of r items from n',
    example: 'P(10,3) = 720',
  },
  {
    input: 'C(n,r)',
    description: 'Combinations — unordered selections of r items from n',
    example: 'C(10,3) = 120',
  },
  {
    input: 'n!',
    description: 'Factorial — product of all integers from 1 to n',
    example: '5! = 120',
  },
  { input: '0!', description: 'Zero factorial — equals 1 by convention', example: '0! = 1' },
];

// ─── Related calculators ──────────────────────────────────────────────────────

const RELATED = [
  {
    icon: '🎲',
    name: 'Probability Calculator',
    slug: 'probability-calculator',
    description: 'Calculate event probabilities and odds',
  },
  {
    icon: '📊',
    name: 'Statistics Calculator',
    slug: 'statistics-calculator',
    description: 'Mean, median, mode, standard deviation',
  },
  {
    icon: '📏',
    name: 'Sample Size Calculator',
    slug: 'sample-size-calculator',
    description: 'Required sample size for surveys and studies',
  },
];

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Permutation and Combination Calculator',
    description:
      'Free permutation and combination calculator. Computes P(n,r) and C(n,r) with factorial table and step-by-step formulas.',
    url: 'https://roughtools.com/tools/calculators/permutation-combination-calculator',
    applicationCategory: 'EducationalApplication',
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
        name: 'Permutation & Combination Calculator',
        item: 'https://roughtools.com/tools/calculators/permutation-combination-calculator',
      },
    ],
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PermCombPage() {
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
          <span style={{ color: 'var(--brand)' }}>Permutation & Combination Calculator</span>
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
          🔢
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
          Free Permutation & Combination Calculator
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
          Calculate permutations P(n,r) and combinations C(n,r) for any values of n and r. Includes
          factorial reference table and step-by-step formulas. Free, private — all calculations run
          in your browser.
        </p>

        {/* Trust badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
          {[
            '⚡ Instant results',
            '🔒 100% private',
            '🆓 Always free',
            '🚫 No signup',
            '📐 Mathematically exact',
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
        <PermCombClient />

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
            About This Permutation & Combination Calculator
          </h2>

          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The Permutation & Combination Calculator is an essential tool for students, teachers,
            and professionals working in mathematics, statistics, probability theory, cryptography,
            and computer science. It computes both permutations and combinations instantly, displays
            the factorial table for reference values, and shows step-by-step working so you can
            understand not just the answer but the method behind it.
          </p>

          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--brand-2)',
              margin: '20px 0 10px',
            }}
          >
            The Formulas — How They Work
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            <strong style={{ color: 'var(--fg)' }}>Permutations</strong> count the number of ordered
            arrangements of r items chosen from n total items. The word &quot;ordered&quot; is key —
            swapping two selected items produces a different, distinct arrangement.
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
            }}
          >
            P(n, r) = n! / (n − r)!
          </div>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            <strong style={{ color: 'var(--fg)' }}>Combinations</strong> count the number of
            unordered selections of r items from n total items. Here, swapping two selected items
            produces the same selection — only the unique set of items matters, not their sequence.
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
            }}
          >
            C(n, r) = n! / (r! × (n − r)!)
          </div>
          <p style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            Where: <strong style={{ color: '#c4caff' }}>n</strong> = total items in the set,{' '}
            <strong style={{ color: '#c4caff' }}>r</strong> = items being chosen or arranged,{' '}
            <strong style={{ color: '#c4caff' }}>n!</strong> = n factorial = n × (n−1) × (n−2) × … ×
            1. The relationship between the two:{' '}
            <strong style={{ color: '#c4caff' }}>P(n,r) = C(n,r) × r!</strong>, since each
            combination can be ordered r! ways to produce all its permutations.
          </p>

          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--brand-2)',
              margin: '20px 0 10px',
            }}
          >
            Permutations vs Combinations — Real-World Examples
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 10 }}>
            Understanding the distinction through concrete examples is the fastest path to mastery:
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
              "Lottery numbers (pick 6 from 49): Order doesn't matter — {3, 12, 25, 36, 41, 49} is the same ticket regardless of draw order → Combination C(49,6)",
              'Race finishing positions (top 3 of 8 runners): Order matters — first, second, third are different outcomes → Permutation P(8,3)',
              'PIN code (4 digits from 10 digits, repetition allowed): Order matters — 1234 ≠ 4321 → Permutation with repetition: 10⁴ = 10,000',
              "Choosing a 5-person committee from 20 employees: Position doesn't matter → Combination C(20,5) = 15,504",
              'Arranging 6 books on a shelf: Every position is distinct → Permutation P(6,6) = 6! = 720',
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
            Factorial Notation — Why It Grows So Fast
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The factorial function n! grows faster than exponential functions. 10! = 3,628,800; 15!
            = 1,307,674,368,000; 20! ≈ 2.43 × 10¹⁸. This rapid growth is why combinatorial problems
            quickly produce astronomically large numbers — and why security relies on large key
            spaces being computationally infeasible to brute-force. By convention, 0! = 1, which
            ensures the formulas work correctly when r = 0 (one way to choose nothing) and r = n
            (one way to choose everything).
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
            All calculations in this calculator are performed entirely in your browser. No data you
            enter is transmitted to any server, stored in any database, or shared with third
            parties. See our{' '}
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
          toolName="Permutation & Combination Calculator"
          toolSlug="permutation-combination-calculator"
          toolUrl="https://roughtools.com/tools/calculators/permutation-combination-calculator"
          type="general"
        />

        <ToolAdUnit position="bottom" />
      </div>
    </>
  );
}
