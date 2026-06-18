import type { Metadata } from 'next';
import StandardDeviationCalculatorClient from './StandardDeviationCalculatorClient';
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

const _seo = getCalcSEO('standard-deviation-calculator');
export const metadata: Metadata = {
  title: _seo?.seoTitle ?? 'Free Standard Deviation Calculator | RoughTools',
  description:
    _seo?.metaDescription ??
    'Calculate population and sample standard deviation, variance, mean, and range from any set of numbers. Free, instant, no signup.',
  keywords: [
    'standard deviation calculator',
    'variance calculator',
    'population standard deviation',
    'sample standard deviation',
    'standard deviation formula',
  ],
  robots: { index: true, follow: true },
  alternates: {
    canonical: 'https://roughtools.com/tools/calculators/standard-deviation-calculator',
  },
  openGraph: {
    title: 'Free Standard Deviation Calculator | RoughTools',
    description:
      'Calculate standard deviation, variance, mean, and range. Supports population and sample formulas. Free, instant.',
    url: 'https://roughtools.com/tools/calculators/standard-deviation-calculator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Standard Deviation Calculator | RoughTools',
    description: 'Standard deviation, variance, mean, range. Free, instant.',
  },
};

const FAQS = [
  {
    q: 'How accurate is this standard deviation calculator?',
    a: 'The calculator is mathematically exact for any set of numbers. It applies the standard population and sample formulas with full floating-point precision. Results are displayed to 4 decimal places. For very large datasets (hundreds of thousands of values), tiny floating-point rounding may occur but is negligible for practical purposes.',
  },
  {
    q: 'Is my data private — is anything stored?',
    a: 'Yes, completely private. All calculations run entirely in your browser. No data you enter is transmitted to any server, stored in a database, or shared with third parties. When you close the tab, your inputs are gone.',
  },
  {
    q: 'Is this calculator free to use?',
    a: 'Yes, completely free. No account, no subscription, no hidden fees.',
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
    a: 'Yes. Use the "Export PDF Report" button or your browser\'s print function (Ctrl+P / Cmd+P) to save as PDF.',
  },
  {
    q: 'What formula does the calculator use?',
    a: "Population SD: σ = √[Σ(xᵢ−μ)²/N]. Sample SD: s = √[Σ(xᵢ−x̄)²/(N−1)]. Variance = σ² (or s²). Mean μ = (Σxᵢ)/N. The population formula is used when the data is the entire population; the sample formula uses N−1 (Bessel's correction) when the data is a sample from a larger population.",
  },
  {
    q: 'What is the difference between population and sample standard deviation?',
    a: "Population SD (σ) divides by N and is used when your dataset is the entire population you are measuring. Sample SD (s) divides by N−1 (Bessel's correction) and is used when your dataset is a sample from a larger population — which is the case in most real-world statistics. Dividing by N−1 corrects for the fact that a sample tends to underestimate the true population spread.",
  },
  {
    q: 'What does standard deviation tell you?',
    a: 'Standard deviation measures the average distance of data points from the mean. A low SD means data points are clustered close to the mean (consistent data). A high SD means they are spread out widely (variable data). In a normal distribution, approximately 68% of values fall within 1 SD of the mean, 95% within 2 SD, and 99.7% within 3 SD — known as the empirical rule or 68-95-99.7 rule.',
  },
  {
    q: 'What is the relationship between variance and standard deviation?',
    a: 'Variance = (Standard Deviation)². Standard deviation is the square root of variance. Variance is often used in mathematical proofs and formulas because it does not involve a square root, making it easier to manipulate algebraically. Standard deviation is usually reported in practice because it is in the same units as the original data (variance is in squared units, which is harder to interpret).',
  },
  {
    q: 'Can standard deviation be zero or negative?',
    a: 'Standard deviation can be zero but never negative. SD = 0 means all values in the dataset are identical (no variation). Because SD is defined as a square root of a sum of squared values, it can only be ≥ 0. A negative standard deviation is a mathematical impossibility — if a calculator returns a negative SD, there is a bug.',
  },
  {
    q: 'How many data points do I need for a meaningful standard deviation?',
    a: 'Technically, you can calculate SD with as few as 2 values (for sample SD). However, for meaningful results in practice, statisticians generally recommend at least 30 data points. With fewer than 10 values, the standard error of the sample SD itself is very large — meaning your estimate of the population SD is highly uncertain. The more data you have, the more reliable the SD becomes.',
  },
];

const PRO_TIPS = [
  'Always clarify whether you need population SD (σ) or sample SD (s) before reporting results. In almost all real-world research, surveys, and quality control applications, you are working with a sample — so sample SD (divide by N−1) is correct. Population SD is only appropriate when your dataset contains every member of the population, which is rare outside of census data.',
  'The coefficient of variation (CV = SD/mean × 100%) is a more useful comparison metric than raw SD when comparing variability across datasets with different units or scales. A manufacturing process with SD = 5 mm and mean = 100 mm (CV = 5%) is far more consistent than one with SD = 5 mm and mean = 10 mm (CV = 50%), even though the SD is identical.',
  'Outliers have a disproportionately large effect on standard deviation because each deviation is squared before summing. A single extreme value can dramatically inflate the SD. Always examine your dataset for outliers before reporting SD, and consider reporting the interquartile range (IQR) alongside SD when outliers are present.',
  'Standard deviation is the foundation of many statistical tests: t-tests, ANOVA, confidence intervals, and control charts all rely on SD. Understanding that the standard error of the mean = SD/√n is critical for interpreting confidence intervals — a larger sample size reduces the standard error but not the underlying SD of the data.',
];

const WHEN_TO_USE = [
  {
    icon: '📊',
    title: 'Statistics homework and research',
    description:
      'Calculate SD and variance for a dataset as part of homework, research papers, or data analysis projects.',
  },
  {
    icon: '🏭',
    title: 'Manufacturing quality control',
    description:
      'Monitor process consistency using control charts. A rising SD signals the process is becoming less consistent before defects occur.',
  },
  {
    icon: '💹',
    title: 'Finance and investment risk',
    description:
      'Measure volatility of investment returns. Higher SD = higher risk. Portfolio managers use SD to quantify and compare investment risk.',
  },
  {
    icon: '⚕️',
    title: 'Medical and clinical research',
    description:
      'Report variability in patient measurements, clinical trial results, and medical test accuracy alongside mean values.',
  },
  {
    icon: '🎓',
    title: 'Academic testing and grading',
    description:
      'Analyse score distributions to understand whether a test was appropriately difficult, identify outlier performance, and normalise grades.',
  },
];

const QUICK_REF = [
  {
    input: 'Data set',
    description: 'All numeric values, separated by commas or spaces',
    example: '4, 7, 2, 9, 5, 11, 3',
  },
  {
    input: 'Mean (μ or x̄)',
    description: 'Average: sum of all values ÷ count',
    example: '(4+7+2+9+5+11+3)/7 = 5.857',
  },
  { input: 'Population SD (σ)', description: 'σ = √[Σ(xᵢ−μ)²/N]', example: '2.969' },
  { input: 'Sample SD (s)', description: 's = √[Σ(xᵢ−x̄)²/(N−1)]', example: '3.237' },
  {
    input: 'Variance (σ²)',
    description: 'Square of the standard deviation',
    example: '8.816 (population)',
  },
  { input: 'Range', description: 'Maximum value minus minimum value', example: '11 − 2 = 9' },
  { input: 'Count (N)', description: 'Number of values in the dataset', example: '7' },
];

const RELATED = [
  {
    icon: '📊',
    name: 'Statistics Calculator',
    slug: 'statistics-calculator',
    description: 'Mean, median, mode, variance, range',
  },
  {
    icon: '📈',
    name: 'Z-Score Calculator',
    slug: 'z-score-calculator',
    description: 'Convert values to z-scores using SD',
  },
  {
    icon: '📉',
    name: 'Mean Median Mode',
    slug: 'mean-median-mode-calculator',
    description: 'Central tendency measures',
  },
  {
    icon: '🔬',
    name: 'Sample Size Calculator',
    slug: 'sample-size-calculator',
    description: 'Minimum sample size for significance',
  },
  {
    icon: '🔬',
    name: 'Percent Error',
    slug: 'percent-error-calculator',
    description: 'Measurement error percentage',
  },
];

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Standard Deviation Calculator',
    description:
      'Free standard deviation and variance calculator supporting population and sample formulas.',
    url: 'https://roughtools.com/tools/calculators/standard-deviation-calculator',
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
        name: 'Standard Deviation Calculator',
        item: 'https://roughtools.com/tools/calculators/standard-deviation-calculator',
      },
    ],
  },
];

export default function StandardDeviationCalculatorPage() {
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
          <span style={{ color: 'var(--brand)' }}>Standard Deviation Calculator</span>
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
          📊
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
          Free Standard Deviation Calculator
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
          Calculate population and sample standard deviation, variance, mean, and range from any set
          of numbers. Supports both σ (population) and s (sample) formulas. Free, private — all
          calculations run in your browser.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
          {[
            '⚡ Instant results',
            '🔒 100% private',
            '🆓 Always free',
            '🚫 No signup',
            '📊 Population & sample',
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
        <StandardDeviationCalculatorClient />
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
            About This Standard Deviation Calculator
          </h2>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The Standard Deviation Calculator computes the complete statistical summary of a
            dataset: population standard deviation (σ), sample standard deviation (s), variance (σ²
            or s²), mean, range, and count. Enter your numbers separated by commas, spaces, or new
            lines and get instant results with both population and sample formulas shown.
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
              fontSize: 13,
              color: 'var(--brand-2)',
              lineHeight: 1.9,
            }}
          >
            {
              'Mean:          μ = (Σxᵢ) / N\nPopulation SD: σ = √[Σ(xᵢ−μ)² / N]\nSample SD:     s = √[Σ(xᵢ−x̄)² / (N−1)]\nVariance:      σ² = [Σ(xᵢ−μ)²] / N'
            }
          </div>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The key difference between the two formulas is the denominator. Population SD divides by
            N (all members present). Sample SD divides by N−1 — Bessel&apos;s correction — which
            compensates for the fact that a sample tends to underestimate the spread of the full
            population. For almost all real-world work, use sample SD.
          </p>
          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--brand-2)',
              margin: '20px 0 10px',
            }}
          >
            The Empirical Rule (68-95-99.7)
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            For data that follows a normal (bell-curve) distribution, standard deviation defines
            three key probability zones: approximately 68% of values fall within ±1 SD of the mean;
            95% fall within ±2 SD; and 99.7% fall within ±3 SD. A data point more than 3 SDs from
            the mean is considered a statistical outlier and occurs in fewer than 0.3% of cases by
            chance.
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
          toolName="Standard Deviation Calculator"
          toolSlug="standard-deviation-calculator"
          toolUrl="https://roughtools.com/tools/calculators/standard-deviation-calculator"
          type="general"
        />
        <ToolAdUnit position="bottom" />
      </div>
    </>
  );
}
