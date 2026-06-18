import type { Metadata } from 'next';
import StatisticsCalculatorClient from './StatisticsCalculatorClient';
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

const _seo = getCalcSEO('statistics-calculator');
export const metadata: Metadata = {
  title:
    _seo?.seoTitle ?? 'Free Statistics Calculator — Mean, Median, SD, Variance & More | RoughTools',
  description:
    _seo?.metaDescription ??
    'Calculate mean, median, mode, variance, standard deviation, range, and more. Full descriptive statistics instantly. Free, private, no signup.',
  keywords: [
    'statistics calculator',
    'descriptive statistics',
    'mean calculator',
    'standard deviation calculator',
    'variance calculator',
    'free statistics calculator',
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/calculators/statistics-calculator' },
  openGraph: {
    title: 'Free Statistics Calculator — Mean, Median, SD, Variance & More | RoughTools',
    description:
      'Full descriptive statistics: mean, median, mode, variance, standard deviation, range. Free, instant, no signup.',
    url: 'https://roughtools.com/tools/calculators/statistics-calculator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Statistics Calculator | RoughTools',
    description: 'Calculate mean, median, mode, variance, and standard deviation instantly. Free.',
  },
};

// ─── FAQ data (12 questions — accordion) ─────────────────────────────────────

const FAQS = [
  {
    q: 'How accurate is this statistics calculator?',
    a: 'The calculator is mathematically accurate for the formulas implemented. Mean, variance, and standard deviation use IEEE 754 double-precision floating-point arithmetic, which provides about 15–17 significant decimal digits — far more than needed for practical statistical work. For very large datasets with values that differ by many orders of magnitude, minor floating-point precision issues can theoretically arise, but these are negligible in normal use.',
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
    a: "Use your browser's print function (Ctrl+P or Cmd+P) to save the results as a PDF. You can also copy individual values directly from the results panel.",
  },
  {
    q: 'Should I consult a professional for statistical analysis?',
    a: 'For basic descriptive statistics this calculator is self-contained. However, for statistical inference, hypothesis testing, or analysis that will inform important business or scientific decisions, consider working with a qualified statistician or data analyst who can select the appropriate tests, check assumptions, and interpret results in context.',
  },
  {
    q: 'What formulas does this calculator use?',
    a: 'Mean = Σx / n (sum of all values divided by count); Median = middle value of sorted data (average of two middle values for even n); Mode = most frequently occurring value(s); Variance = Σ(x − μ)² / n (population); Standard Deviation = √Variance; Range = maximum − minimum.',
  },
  {
    q: 'What is the difference between population and sample standard deviation?',
    a: "Population SD divides by n (all members of the group are included in the dataset). Sample SD divides by n − 1 (Bessel's correction) because the sample mean is used as an estimate of the population mean, introducing a slight bias that the n − 1 correction removes. Use sample SD when your data is a subset of a larger population you want to make inferences about.",
  },
  {
    q: 'How do outliers affect mean vs. median?',
    a: 'Outliers have a large effect on the mean but almost no effect on the median. For example, in the dataset [10, 12, 11, 13, 100], the mean is 29.2 — heavily distorted by the outlier 100 — while the median is 12, far more representative of the typical value. This is why income and home price data reports usually quote the median rather than the mean.',
  },
  {
    q: 'When is the median a better measure than the mean?',
    a: 'The median is better when: (1) the data is skewed (e.g., income distributions that have a long right tail), (2) there are significant outliers, (3) the data is ordinal (ranked categories rather than true numbers), or (4) you want to describe the "typical" value rather than the mathematical average. The mean is better for symmetric, bell-shaped distributions without extreme outliers.',
  },
  {
    q: 'What is the difference between a skewed and a symmetric distribution?',
    a: 'A symmetric distribution (like a normal bell curve) has mean = median = mode and equal tails on both sides. A right-skewed (positively skewed) distribution has a long tail to the right — mean > median > mode — common with income or wealth data. A left-skewed (negatively skewed) distribution has a long tail to the left — mean < median < mode — less common but seen in age-at-failure data for high-quality components.',
  },
];

// ─── Pro Tips ─────────────────────────────────────────────────────────────────

const PRO_TIPS = [
  'Always report the mean and standard deviation together — the mean alone tells you where the data is centred, but the SD tells you how spread out it is. A mean of 50 with SD = 2 represents a tight cluster around 50; a mean of 50 with SD = 25 represents enormous variability. Reporting one without the other gives an incomplete picture.',
  'Check for outliers before reporting the mean. A single extreme value can shift the mean dramatically while leaving the median nearly unchanged. A quick visual check: if mean and median differ by more than one standard deviation, suspect significant skew or outliers. Use the median for skewed data.',
  'Bimodal distributions (two modes) signal that your dataset may contain two distinct subgroups. Before reporting a single mean or SD, investigate whether the data should be split into two groups and analysed separately. For example, heights of men and women combined create a bimodal distribution — summarising with one mean obscures the real structure.',
  'Box plots (whisker plots) are the most efficient way to visualise the five-number summary: minimum, Q1 (25th percentile), median (Q2), Q3 (75th percentile), and maximum. Any point beyond 1.5 × IQR from Q1 or Q3 is conventionally flagged as an outlier. Pair your statistics report with a box plot for instant clarity.',
];

// ─── When to Use ─────────────────────────────────────────────────────────────

const WHEN_TO_USE = [
  {
    icon: '🎓',
    title: 'Academic research data analysis',
    description:
      'Summarise experimental results — means, standard deviations, and ranges — for inclusion in a lab report, thesis, or research paper.',
  },
  {
    icon: '📊',
    title: 'Business metrics reporting',
    description:
      'Calculate average transaction values, standard deviation of sales, or range of customer wait times to support KPI dashboards and management reports.',
  },
  {
    icon: '🏭',
    title: 'Quality control',
    description:
      'Monitor manufacturing measurements. Compare the mean and SD of part dimensions against specification tolerances to catch processes drifting out of control.',
  },
  {
    icon: '📋',
    title: 'Survey result analysis',
    description:
      'Analyse Likert-scale survey responses: compute the mean rating, SD (spread of opinion), and mode (most common response) across respondents.',
  },
  {
    icon: '🔬',
    title: 'Science experiment data',
    description:
      'Report trial results with the mean ± standard deviation format. Identify the range and any potential measurement errors or anomalies in experimental data.',
  },
];

// ─── Quick Reference table ────────────────────────────────────────────────────

const QUICK_REF = [
  {
    input: 'Input Data',
    description: 'Comma or newline separated numbers',
    example: '4, 8, 6, 5, 3, 2, 8, 9',
  },
  { input: 'Count (n)', description: 'Total number of values in the dataset', example: '8' },
  { input: 'Mean', description: 'Arithmetic average: Σx / n', example: '5.625' },
  { input: 'Median', description: 'Middle value of sorted data', example: '5.5' },
  { input: 'Mode', description: 'Most frequently occurring value(s)', example: '8' },
  {
    input: 'Standard Deviation',
    description: 'Spread around the mean: √(Σ(x−μ)²/n)',
    example: '2.32',
  },
  { input: 'Variance', description: 'Mean squared deviation: Σ(x−μ)²/n', example: '5.37' },
  { input: 'Range', description: 'Maximum minus minimum value', example: '7' },
  { input: 'Min', description: 'Smallest value in the dataset', example: '2' },
  { input: 'Max', description: 'Largest value in the dataset', example: '9' },
];

// ─── Related calculators ──────────────────────────────────────────────────────

const RELATED = [
  {
    icon: '📐',
    name: 'Mean Median Mode Calculator',
    slug: 'mean-median-mode-calculator',
    description: 'Focus on the three central tendency measures',
  },
  {
    icon: '🎲',
    name: 'Probability Calculator',
    slug: 'probability-calculator',
    description: 'Calculate event probabilities',
  },
  {
    icon: '🔢',
    name: 'Sample Size Calculator',
    slug: 'sample-size-calculator',
    description: 'How many samples do you need?',
  },
  {
    icon: '📊',
    name: 'Z-Score Calculator',
    slug: 'z-score-calculator',
    description: 'Standardise values with z-scores',
  },
  {
    icon: '📉',
    name: 'Confidence Interval Calculator',
    slug: 'confidence-interval-calculator',
    description: 'Estimate population parameters',
  },
];

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Statistics Calculator',
    description:
      'Free statistics calculator. Computes mean, median, mode, variance, standard deviation, and range for any dataset.',
    url: 'https://roughtools.com/tools/calculators/statistics-calculator',
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
        name: 'Statistics Calculator',
        item: 'https://roughtools.com/tools/calculators/statistics-calculator',
      },
    ],
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StatisticsCalculatorPage() {
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
          <span style={{ color: 'var(--brand)' }}>Statistics Calculator</span>
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
          Free Statistics Calculator
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
          Compute mean, median, mode, variance, standard deviation, range, min, and max for any
          dataset. Enter numbers separated by commas or new lines. Instant results with full
          descriptive statistics. Free, private — all calculations run in your browser.
        </p>

        {/* Trust badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
          {[
            '⚡ Instant results',
            '🔒 100% private',
            '🆓 Always free',
            '🚫 No signup',
            '📐 Statistically accurate',
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
        <StatisticsCalculatorClient />

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
            About This Statistics Calculator
          </h2>

          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The Statistics Calculator computes the full suite of descriptive statistics for any
            dataset you enter. Descriptive statistics summarise the key properties of a collection
            of data — where it is centred, how spread out it is, and its extreme values — without
            making inferences about any larger population. They are the foundation of data analysis
            in every field: science, business, social research, healthcare, and engineering.
          </p>

          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--brand-2)',
              margin: '20px 0 10px',
            }}
          >
            The Formulas — How Each Statistic Is Computed
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
              lineHeight: 2,
            }}
          >
            Mean = Σx / n<br />
            Median = middle value of sorted data (avg of two middle values if n is even)
            <br />
            Mode = most frequently occurring value(s)
            <br />
            Variance = Σ(x − μ)² / n<br />
            Std Dev = √Variance
            <br />
            Range = max − min
          </div>
          <p style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            Where <strong style={{ color: '#c4caff' }}>Σ</strong> denotes summation over all n
            values,
            <strong style={{ color: '#c4caff' }}> μ</strong> is the population mean, and
            <strong style={{ color: '#c4caff' }}> n</strong> is the count of values. The variance
            and standard deviation shown are population statistics (dividing by n). To get sample
            statistics, divide the sum of squared deviations by n − 1 instead.
          </p>

          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--brand-2)',
              margin: '20px 0 10px',
            }}
          >
            Descriptive vs. Inferential Statistics
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            <strong style={{ color: 'var(--fg)' }}>Descriptive statistics</strong> describe the data
            you have — they make no claims about any broader population. The mean exam score of your
            class of 30 students is a descriptive statistic.{' '}
            <strong style={{ color: 'var(--fg)' }}>Inferential statistics</strong> use a sample to
            draw conclusions about a larger population, and require techniques such as hypothesis
            testing, confidence intervals, and regression analysis. This calculator covers
            descriptive statistics. For inferential analysis, see our Z-Score Calculator and
            Confidence Interval Calculator.
          </p>

          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--brand-2)',
              margin: '20px 0 10px',
            }}
          >
            When to Use Mean vs. Median
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The mean is the most familiar measure of centre, but it is sensitive to extreme values
            (outliers). A single very large or very small value pulls the mean away from the typical
            value. The median — the middle value in sorted order — is resistant to outliers and is
            therefore preferred for skewed data. For example, US household income is always reported
            as median income, because a small number of very high earners would make the mean
            misleadingly high. As a rule: if the mean and median differ substantially, the
            distribution is skewed and the median is the more informative centre measure.
          </p>

          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--brand-2)',
              margin: '20px 0 10px',
            }}
          >
            Standard Deviation and What It Tells You
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            Standard deviation (SD) is the most widely used measure of spread. It expresses, on
            average, how far values lie from the mean. For a normal (bell-shaped) distribution:
            approximately 68% of values fall within ±1 SD of the mean, 95% within ±2 SD, and 99.7%
            within ±3 SD (the empirical rule). A low SD means values cluster tightly around the
            mean; a high SD means values are spread widely. Always report SD alongside the mean —
            mean without SD gives an incomplete picture of any dataset.
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
            server, stored in any database, or shared with third parties. Your dataset stays
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
          toolName="Statistics Calculator"
          toolSlug="statistics-calculator"
          toolUrl="https://roughtools.com/tools/calculators/statistics-calculator"
          type="general"
        />

        <ToolAdUnit position="bottom" />
      </div>
    </>
  );
}
