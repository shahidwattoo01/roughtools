import type { Metadata } from 'next';
import ZScoreCalculatorClient from './ZScoreCalculatorClient';
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

const _seo = getCalcSEO('z-score-calculator');
export const metadata: Metadata = {
  title: _seo?.seoTitle ?? 'Free Z-Score Calculator — Standard Score | RoughTools',
  description:
    _seo?.metaDescription ??
    'Calculate z-score (standard score), percentile, and probability from a value, mean, and standard deviation. Free, instant, no signup.',
  keywords: [
    'z-score calculator',
    'standard score calculator',
    'z score formula',
    'percentile calculator',
    'normal distribution calculator',
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/calculators/z-score-calculator' },
  openGraph: {
    title: 'Free Z-Score Calculator — Standard Score | RoughTools',
    description:
      'Calculate z-score, percentile, and probability for any value in a normal distribution. Free, instant.',
    url: 'https://roughtools.com/tools/calculators/z-score-calculator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Z-Score Calculator | RoughTools',
    description: 'Z-score, percentile, and probability. Free, instant.',
  },
};

const FAQS = [
  {
    q: 'How accurate is this z-score calculator?',
    a: 'The z-score formula z = (x − μ) / σ is mathematically exact. Percentile and probability conversions are computed using the standard normal CDF (cumulative distribution function) approximation, which is accurate to at least 4 decimal places for all practical purposes — the same accuracy used in statistics tables.',
  },
  {
    q: 'Is my data private — is anything stored?',
    a: 'Yes, completely private. All calculations run in your browser. No data is transmitted or stored.',
  },
  { q: 'Is this calculator free to use?', a: 'Yes, completely free. No account, no subscription.' },
  {
    q: 'Does this work on mobile?',
    a: 'Yes. The calculator is fully responsive on any modern device and browser.',
  },
  {
    q: 'What browsers are supported?',
    a: 'All modern browsers: Chrome, Firefox, Safari, Edge, and Opera.',
  },
  {
    q: 'Can I save or export my results?',
    a: 'Yes. Use the "Export PDF Report" button or browser print (Ctrl+P / Cmd+P) to save as PDF.',
  },
  {
    q: 'What formula does this calculator use?',
    a: 'z = (x − μ) / σ, where x is the raw value, μ (mu) is the population mean, and σ (sigma) is the population standard deviation. The result z tells you how many standard deviations x is above (positive z) or below (negative z) the mean. Percentile is then derived from the standard normal CDF.',
  },
  {
    q: 'What does a z-score of 2.0 mean?',
    a: 'A z-score of 2.0 means the value is 2 standard deviations above the mean. In a normal distribution, approximately 97.7% of values fall below a z-score of 2.0 (i.e., the 97.7th percentile). Only about 2.3% of values are this far above the mean or higher.',
  },
  {
    q: 'What is a good z-score?',
    a: '"Good" depends entirely on context. In standardised testing, a z-score of 0 is exactly average; positive z-scores indicate above-average performance. In quality control, z-scores outside ±3 are considered outliers (the 3-sigma rule). In medical screening, z-scores flag values that need attention. The z-score is simply a standardisation — whether it is "good" depends on what you are measuring.',
  },
  {
    q: 'What is the difference between z-score and t-score?',
    a: 'Z-scores use the population standard deviation and assume a normal distribution — appropriate when the population SD is known or the sample is large (n > 30). T-scores (t-statistics) use the sample standard deviation and follow a t-distribution, which has heavier tails. T-scores are appropriate for small samples (n < 30). As sample size grows, the t-distribution approaches the normal distribution and z ≈ t.',
  },
  {
    q: 'Can z-scores be negative?',
    a: 'Yes. A negative z-score means the value is below the mean. A z-score of −1.5 means the value is 1.5 standard deviations below the mean. Both positive and negative z-scores are valid and common. Only the absolute value of the z-score tells you the distance from the mean; the sign tells you the direction.',
  },
  {
    q: 'How is z-score used in standardised tests like SAT and IQ?',
    a: 'SAT and IQ tests convert raw scores to standard scales using z-score transformations. For IQ: IQ = 15z + 100 (mean = 100, SD = 15). For SAT (per section): Scaled = 100z + 500. This transformation allows scores from different test versions to be compared fairly, since all versions are standardised to the same mean and SD.',
  },
];

const PRO_TIPS = [
  'Z-scores enable you to compare values from completely different distributions. A student who scores 85 on Test A (mean=70, SD=10) has z=1.5. A student scoring 72 on Test B (mean=60, SD=6) has z=2.0. Despite the lower raw score, the Test B student performed better relative to their peers — a fact invisible without z-scores.',
  'The empirical rule provides powerful quick estimates: z > 1.96 → top 2.5%; z > 2.58 → top 0.5%; z > 3.29 → top 0.05%. These thresholds correspond to α = 0.05, 0.01, and 0.001 in statistical hypothesis testing — the most commonly used significance levels in academic research.',
  'In finance, z-scores measure investment volatility. The Altman Z-score (a different formula) predicts corporate bankruptcy. In quality control, the process capability index Cpk is related to how many sigma (standard deviations) a process operates from its specification limits — a 6-sigma process has an incredibly low defect rate of 3.4 per million.',
  'When converting between z-score and percentile, remember that the normal distribution is symmetric. A z-score of +1.0 is the 84.1st percentile; z = −1.0 is the 15.9th percentile (100 − 84.1). You only need to know the upper-tail probabilities to get lower-tail values by symmetry.',
];

const WHEN_TO_USE = [
  {
    icon: '📚',
    title: 'Statistics and probability courses',
    description:
      'Standardise values, find percentiles, and compute probabilities for normal distribution problems in homework and exams.',
  },
  {
    icon: '🏥',
    title: 'Medical testing and clinical research',
    description:
      'Determine whether a patient measurement (blood pressure, BMI, lab result) is unusual relative to population norms.',
  },
  {
    icon: '📋',
    title: 'Standardised test interpretation',
    description:
      'Convert raw test scores to z-scores to compare performance across tests with different scales and difficulties.',
  },
  {
    icon: '🏭',
    title: 'Quality control (Six Sigma)',
    description:
      'Determine how many standard deviations a process measurement is from the specification limit to assess process capability.',
  },
  {
    icon: '💹',
    title: 'Financial risk analysis',
    description:
      'Measure how unusual a price movement or return is relative to historical mean and volatility (standard deviation).',
  },
];

const QUICK_REF = [
  { input: 'Value (x)', description: 'The raw data point you are standardising', example: '85' },
  { input: 'Mean (μ)', description: 'The population or sample mean', example: '70' },
  {
    input: 'Standard Deviation (σ)',
    description: 'The population or sample standard deviation',
    example: '10',
  },
  { input: 'Z-score', description: 'z = (x − μ) / σ', example: '(85−70)/10 = 1.5' },
  {
    input: 'Percentile',
    description: '% of values at or below this z-score',
    example: 'z=1.5 → 93.3rd percentile',
  },
  {
    input: 'Area (left tail)',
    description: 'P(X ≤ x) — probability below the value',
    example: '0.9332 (93.32%)',
  },
  {
    input: 'Area (right tail)',
    description: 'P(X > x) — probability above the value',
    example: '0.0668 (6.68%)',
  },
];

const RELATED = [
  {
    icon: '📊',
    name: 'Standard Deviation',
    slug: 'standard-deviation-calculator',
    description: 'Calculate population and sample SD',
  },
  {
    icon: '📊',
    name: 'Statistics Calculator',
    slug: 'statistics-calculator',
    description: 'Mean, median, mode, variance, range',
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
    description: 'Minimum sample for significance',
  },
  {
    icon: '🔬',
    name: 'Confidence Interval',
    slug: 'confidence-interval-calculator',
    description: 'Confidence intervals for means',
  },
];

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Z-Score Calculator',
    description:
      'Free z-score calculator. Converts raw values to standard scores, percentiles, and probabilities using the normal distribution.',
    url: 'https://roughtools.com/tools/calculators/z-score-calculator',
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
        name: 'Z-Score Calculator',
        item: 'https://roughtools.com/tools/calculators/z-score-calculator',
      },
    ],
  },
];

export default function ZScoreCalculatorPage() {
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
          <span style={{ color: 'var(--brand)' }}>Z-Score Calculator</span>
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
          📈
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
          Free Z-Score Calculator
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
          Calculate the z-score (standard score), percentile rank, and tail probabilities for any
          value given a mean and standard deviation. Free, private — all calculations run in your
          browser.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
          {[
            '⚡ Instant results',
            '🔒 100% private',
            '🆓 Always free',
            '🚫 No signup',
            '📈 Percentile + probability',
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
        <ZScoreCalculatorClient />
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
            About This Z-Score Calculator
          </h2>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The Z-Score Calculator standardises a raw value by converting it to the number of
            standard deviations it lies from the mean of its distribution. This transformation —
            called standardisation — makes it possible to compare values from completely different
            datasets, find the probability of a result occurring by chance, and determine the
            percentile rank of any observation.
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
            }}
          >
            z = (x − μ) / σ
          </div>
          <p style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            Where: <strong style={{ color: '#c4caff' }}>x</strong> = the raw value,{' '}
            <strong style={{ color: '#c4caff' }}>μ</strong> = mean,{' '}
            <strong style={{ color: '#c4caff' }}>σ</strong> = standard deviation. A positive z-score
            is above the mean; negative is below.
          </p>
          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--brand-2)',
              margin: '20px 0 10px',
            }}
          >
            The Empirical Rule
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
              '|z| < 1.0 → within 1 SD of mean → ~68% of normal distribution',
              '|z| < 2.0 → within 2 SD of mean → ~95% of normal distribution',
              '|z| < 3.0 → within 3 SD of mean → ~99.7% of normal distribution',
              '|z| > 3.0 → considered a statistical outlier (<0.3% probability)',
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
          toolName="Z-Score Calculator"
          toolSlug="z-score-calculator"
          toolUrl="https://roughtools.com/tools/calculators/z-score-calculator"
          type="general"
        />
        <ToolAdUnit position="bottom" />
      </div>
    </>
  );
}
