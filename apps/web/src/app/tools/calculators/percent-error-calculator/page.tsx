import type { Metadata } from 'next';
import PercentErrorClient from './PercentErrorClient';
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

const _seo = getCalcSEO('percent-error-calculator');
export const metadata: Metadata = {
  title: _seo?.seoTitle ?? 'Free Percent Error Calculator | RoughTools',
  description:
    _seo?.metaDescription ??
    'Calculate percent error between an experimental value and a theoretical (accepted) value. Shows absolute error and relative error. Free, instant.',
  keywords: [
    'percent error calculator',
    'percentage error formula',
    'experimental error calculator',
    'absolute error',
    'relative error',
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/calculators/percent-error-calculator' },
  openGraph: {
    title: 'Free Percent Error Calculator | RoughTools',
    description:
      'Calculate percent error, absolute error, and relative error between experimental and theoretical values. Free, instant.',
    url: 'https://roughtools.com/tools/calculators/percent-error-calculator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Percent Error Calculator | RoughTools',
    description: 'Percent error, absolute error, relative error. Free, instant.',
  },
};

const FAQS = [
  {
    q: 'How accurate is this percent error calculator?',
    a: 'The calculator is mathematically exact, applying the standard percent error formula: |experimental − theoretical| / |theoretical| × 100%. Results are computed with full floating-point precision and rounded to 4 decimal places.',
  },
  {
    q: 'Is my data private — is anything stored?',
    a: 'Yes, completely private. All calculations run in your browser. No data is transmitted or stored.',
  },
  { q: 'Is this calculator free to use?', a: 'Yes, completely free. No account, no subscription.' },
  { q: 'Does this work on mobile?', a: 'Yes. Fully responsive on any modern device and browser.' },
  {
    q: 'What browsers are supported?',
    a: 'All modern browsers: Chrome, Firefox, Safari, Edge, and Opera.',
  },
  {
    q: 'Can I save or export my results?',
    a: 'Yes. Use the "Export PDF Report" button or browser print (Ctrl+P / Cmd+P).',
  },
  {
    q: 'What formula does this calculator use?',
    a: 'Percent Error = |Experimental − Theoretical| / |Theoretical| × 100%. Absolute Error = |Experimental − Theoretical|. Relative Error = Absolute Error / |Theoretical|. The absolute value ensures percent error is always non-negative regardless of whether the experimental value is higher or lower than theoretical.',
  },
  {
    q: 'What is the difference between absolute error and percent error?',
    a: 'Absolute error is the raw difference between the measured/experimental value and the true/theoretical value: |experimental − theoretical|. It is in the same units as the measurement. Percent error expresses this difference as a percentage of the theoretical value, making it unit-independent and comparable across different measurements.',
  },
  {
    q: 'What is an acceptable percent error in science?',
    a: 'Acceptable percent error varies by field and context. In student chemistry experiments, ±5% is generally acceptable. In physics experiments, ±1–2% is typical. In analytical chemistry, ±0.1% may be required. In engineering manufacturing, tolerances may be ±0.01% or tighter. There is no universal threshold — always check the requirements for your specific context.',
  },
  {
    q: 'Why does percent error use the theoretical value in the denominator, not the experimental?',
    a: 'The theoretical (accepted) value represents the "true" or "correct" value we are measuring against. Using it in the denominator normalises the error to the correct scale. Using the experimental value would give a different result depending on which direction the error went, making comparisons inconsistent. The theoretical value is the reference standard.',
  },
  {
    q: 'Can percent error be more than 100%?',
    a: 'Yes. If the experimental value is more than twice the theoretical value (or close to zero when the theoretical is large), percent error exceeds 100%. For example: experimental = 5, theoretical = 2 gives percent error = |5−2|/2 × 100% = 150%. This indicates a very significant measurement error and usually indicates a fundamental problem with the experimental setup.',
  },
  {
    q: 'What is the difference between percent error and percent difference?',
    a: 'Percent error compares a measured value to a known theoretical/accepted value: |experimental − theoretical| / |theoretical| × 100%. Percent difference compares two measured values where neither is the "true" value: |value1 − value2| / ((value1 + value2) / 2) × 100%. Use percent error when a theoretical value exists; use percent difference when comparing two experimental results.',
  },
];

const PRO_TIPS = [
  'Always identify your theoretical value correctly before calculating. The theoretical value is the accepted, standard, or known-correct value — not simply the larger number. If you are measuring the density of water, the theoretical value is 1.00 g/mL (at 4°C), regardless of what you measured experimentally.',
  'Percent error does not tell you the direction of error — only the magnitude. If knowing whether your measurement was systematically too high or too low is important (it usually is), calculate signed percent error: (experimental − theoretical) / theoretical × 100% (without absolute value). Positive = overestimate; negative = underestimate.',
  'When multiple measurements lead to high percent error, investigate systematic error (bias) vs. random error (noise). Systematic errors affect all measurements in the same direction (e.g., an uncalibrated balance). Random errors scatter around the true value. Systematic errors cannot be averaged away — they require identifying and fixing the source.',
  'In analytical chemistry and metrology, "uncertainty" is preferred over "error" because it is more precisely defined. Measurement uncertainty includes both Type A (statistical) and Type B (systematic) components. Percent error is a simplified approximation used in educational settings; professional labs report expanded uncertainty at a specified confidence level.',
];

const WHEN_TO_USE = [
  {
    icon: '🔬',
    title: 'Science lab experiments',
    description:
      'Compare your experimental measurement to the accepted theoretical value to quantify how accurate your experimental technique was.',
  },
  {
    icon: '📚',
    title: 'Chemistry and physics homework',
    description:
      'Calculate percent error for lab reports and homework problems that require evaluating the accuracy of experimental results.',
  },
  {
    icon: '🏭',
    title: 'Manufacturing quality control',
    description:
      'Compare measured product dimensions to the design specification to determine whether parts are within acceptable tolerance.',
  },
  {
    icon: '📐',
    title: 'Engineering verification',
    description:
      'Verify that a calculated or simulated result matches an expected theoretical or benchmark value to within acceptable error bounds.',
  },
  {
    icon: '📊',
    title: 'Data validation',
    description:
      'Assess the accuracy of sensor readings, instrument calibrations, or model predictions by comparing against a known reference value.',
  },
];

const QUICK_REF = [
  {
    input: 'Experimental value',
    description: 'The value you measured or obtained',
    example: '9.8 m/s²',
  },
  { input: 'Theoretical value', description: 'The accepted or true value', example: '9.81 m/s²' },
  {
    input: 'Absolute Error',
    description: '|experimental − theoretical|',
    example: '|9.8 − 9.81| = 0.01',
  },
  {
    input: 'Percent Error',
    description: '|experimental − theoretical| / |theoretical| × 100%',
    example: '0.01/9.81 × 100 = 0.102%',
  },
  {
    input: 'Relative Error',
    description: 'Absolute error ÷ theoretical value',
    example: '0.01/9.81 = 0.00102',
  },
];

const RELATED = [
  {
    icon: '📊',
    name: 'Standard Deviation',
    slug: 'standard-deviation-calculator',
    description: 'Measure data variability',
  },
  {
    icon: '📈',
    name: 'Z-Score Calculator',
    slug: 'z-score-calculator',
    description: 'Standard score and percentile',
  },
  {
    icon: '📊',
    name: 'Statistics Calculator',
    slug: 'statistics-calculator',
    description: 'Mean, median, mode, variance',
  },
  {
    icon: '🔬',
    name: 'Sample Size Calculator',
    slug: 'sample-size-calculator',
    description: 'Minimum sample for significance',
  },
  {
    icon: '🔢',
    name: 'Percentage Calculator',
    slug: 'percentage-calculator',
    description: 'Percentage increases and decreases',
  },
];

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Percent Error Calculator',
    description:
      'Free percent error calculator. Computes percent error, absolute error, and relative error from experimental and theoretical values.',
    url: 'https://roughtools.com/tools/calculators/percent-error-calculator',
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
        name: 'Percent Error Calculator',
        item: 'https://roughtools.com/tools/calculators/percent-error-calculator',
      },
    ],
  },
];

export default function PercentErrorCalculatorPage() {
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
          <span style={{ color: 'var(--brand)' }}>Percent Error Calculator</span>
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
          🔬
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
          Free Percent Error Calculator
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
          Calculate the percent error between an experimental value and a theoretical (accepted)
          value. Also shows absolute error and relative error. Free, private — all calculations run
          in your browser.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
          {[
            '⚡ Instant results',
            '🔒 100% private',
            '🆓 Always free',
            '🚫 No signup',
            '🔬 Science-grade accuracy',
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
        <PercentErrorClient />
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
            About This Percent Error Calculator
          </h2>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The Percent Error Calculator quantifies the accuracy of an experimental measurement by
            comparing it to a known theoretical or accepted value. It is one of the most commonly
            used error metrics in science, engineering, and quality control — expressing the
            difference as a percentage so results from experiments with very different scales can be
            meaningfully compared.
          </p>
          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--brand-2)',
              margin: '20px 0 10px',
            }}
          >
            The Formula
          </h3>
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
              lineHeight: 1.9,
            }}
          >
            {
              'Percent Error = |Experimental − Theoretical| / |Theoretical| × 100%\nAbsolute Error = |Experimental − Theoretical|\nRelative Error = Absolute Error / |Theoretical|'
            }
          </div>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The absolute value in the formula ensures percent error is always a non-negative number,
            regardless of whether the experimental value overestimates or underestimates the
            theoretical. This is the standard convention in chemistry and physics education. For
            directional analysis (was the measurement too high or too low?), use the signed version
            without absolute value.
          </p>
          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--brand-2)',
              margin: '20px 0 10px',
            }}
          >
            When Percent Error Applies
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            Percent error is the right metric when there is a single known correct value to compare
            against — such as the accepted value of gravitational acceleration (9.81 m/s²), the
            density of a pure substance, or the boiling point of a compound at standard pressure.
            When comparing two experimental values without a known correct value, use percent
            difference instead.
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
          toolName="Percent Error Calculator"
          toolSlug="percent-error-calculator"
          toolUrl="https://roughtools.com/tools/calculators/percent-error-calculator"
          type="general"
        />
        <ToolAdUnit position="bottom" />
      </div>
    </>
  );
}
