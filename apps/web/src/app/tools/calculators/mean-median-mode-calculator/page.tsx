import type { Metadata } from 'next';
import MeanMedianModeClient from './MeanMedianModeClient';
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

const _seo = getCalcSEO('mean-median-mode-calculator');
export const metadata: Metadata = {
  title: _seo?.seoTitle ?? 'Free Mean Median Mode Calculator — Central Tendency | RoughTools',
  description:
    _seo?.metaDescription ??
    'Calculate mean, median, and mode for any dataset instantly. Includes variance, standard deviation, range, IQR, and frequency distribution. Free, private, no signup.',
  keywords: [
    'mean median mode calculator',
    'central tendency calculator',
    'average calculator',
    'mean calculator',
    'median calculator',
    'mode calculator',
    'free mean median mode calculator',
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/calculators/mean-median-mode-calculator' },
  openGraph: {
    title: 'Free Mean Median Mode Calculator — Central Tendency | RoughTools',
    description:
      'Calculate mean, median, and mode instantly. Includes SD, variance, IQR, and frequency table. Free, private.',
    url: 'https://roughtools.com/tools/calculators/mean-median-mode-calculator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Mean Median Mode Calculator | RoughTools',
    description: 'Calculate mean, median, and mode for any dataset. Free, instant, no signup.',
  },
};

// ─── FAQ data (12 questions — accordion) ─────────────────────────────────────

const FAQS = [
  {
    q: 'How accurate is this mean median mode calculator?',
    a: 'The calculator is mathematically accurate. Mean and variance use IEEE 754 double-precision arithmetic (about 15–17 significant digits), which is more than sufficient for practical statistical work. The median algorithm sorts the dataset and selects the middle value(s) exactly. Mode is determined by counting occurrences — an exact integer operation with no rounding.',
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
    a: "Use your browser's print function (Ctrl+P or Cmd+P) to save the page as a PDF. You can also copy values directly from the results panel on screen.",
  },
  {
    q: 'Do I need professional advice to use these statistics?',
    a: 'For everyday calculations — class grades, survey data, hobby analysis — no professional advice is needed. If you are using these statistics to inform medical, financial, or legal decisions, consult the relevant specialist. A statistician can help you choose the right analysis and interpret results correctly in context.',
  },
  {
    q: 'What formulas does this calculator use?',
    a: 'Mean = Σx / n (sum all values, divide by count); Median = middle value of sorted data, or average of two middle values when n is even; Mode = value(s) appearing most frequently — if all values appear equally often, there is no mode.',
  },
  {
    q: 'Why is the median used for income data instead of the mean?',
    a: 'Income distributions are strongly right-skewed — a small number of very high earners pull the mean upward. For example, if 9 people earn $30,000 and 1 person earns $1,000,000, the mean is $127,000 — far higher than what a typical person earns. The median ($30,000) accurately represents the experience of the majority. The median is resistant to extreme outliers; the mean is not.',
  },
  {
    q: 'Can there be multiple modes in a dataset?',
    a: 'Yes. A dataset with two modes is bimodal; with three or more modes it is multimodal. For example, [1, 2, 2, 3, 4, 4, 5] has two modes: 2 and 4. If every value appears exactly once, the dataset has no mode. The mode is the only measure of central tendency that can be meaningfully applied to categorical (non-numeric) data.',
  },
  {
    q: 'What does bimodal mean and why does it matter?',
    a: 'A bimodal distribution has two distinct peaks — two values (or ranges) where data clusters most densely. This often indicates that the dataset contains two distinct subgroups that should be analysed separately. For example, heights of a mixed group of adult men and women form a bimodal distribution. Reporting a single mean conceals the two-group structure. Always investigate bimodality before summarising data with a single average.',
  },
  {
    q: 'What is the trimmed mean and when should I use it?',
    a: "A trimmed mean (or truncated mean) removes a fixed percentage of the highest and lowest values before computing the mean — for example, a 10% trimmed mean removes the bottom 10% and top 10% of values, then averages the remaining 80%. This makes it robust to outliers like the median, while still using more of the data than the median alone. Trimmed means are used in Olympic scoring (drop the highest and lowest judges' scores) and economic indices.",
  },
];

// ─── Pro Tips ─────────────────────────────────────────────────────────────────

const PRO_TIPS = [
  'Use the median for right-skewed data — especially income, home prices, wealth, and any measure where a small number of very large values exist. The mean will be pulled high by these extremes, making the median a more honest description of the typical value. A quick check: if mean > median, the data is right-skewed.',
  'Mode is the only appropriate average for nominal (categorical) data — data that has no natural numeric order. For example, the most common eye colour, favourite music genre, or preferred payment method can only have a mode, never a meaningful mean or median. Applying mean or median to categorical data produces a meaningless result.',
  'A dataset with no mode and one with multiple modes are very different situations. No mode means all values are equally frequent (uniform distribution). Multiple modes suggest distinct subgroups or clusters in the data. Before reporting "no mode" or "bimodal", verify whether the data should be split into separate categories.',
  'Always check for outliers before reporting the mean. Sort the data and visually inspect the minimum and maximum. If the largest value is more than 3 standard deviations from the mean (a z-score > 3), investigate whether it is a real data point or a data entry error. Outliers can be legitimate (record-breaking events) or errors (a typo adding an extra zero).',
];

// ─── When to Use ─────────────────────────────────────────────────────────────

const WHEN_TO_USE = [
  {
    icon: '📚',
    title: 'Grade and test score analysis',
    description:
      'Find the class average (mean), the middle score (median), and the most common score (mode). Compare mean and median to spot whether a few very high or low scores are skewing the average.',
  },
  {
    icon: '💼',
    title: 'Salary survey analysis',
    description:
      'Analyse compensation data with median (resistant to outliers from executive salaries), mode (most common salary band), and mean for comparison. Understand the full distribution.',
  },
  {
    icon: '🏆',
    title: 'Sports statistics',
    description:
      "Calculate a player's average score, most frequent performance level (mode), and median game score across a season. Identify outlier performances that inflate the mean.",
  },
  {
    icon: '🏠',
    title: 'Real estate price research',
    description:
      'Compare median vs. mean home prices in a neighbourhood. The median gives the price a typical buyer encounters; the mean is pulled up by luxury properties. Both are useful together.',
  },
  {
    icon: '🔧',
    title: 'Quality control sampling',
    description:
      'Analyse product measurements from a production run. Mean and standard deviation tell you if the process is centred and consistent; mode reveals the most common defect size.',
  },
];

// ─── Quick Reference table ────────────────────────────────────────────────────

const QUICK_REF = [
  {
    input: 'Dataset',
    description: 'Comma or newline separated numbers',
    example: '5, 8, 3, 8, 2, 10, 5, 8',
  },
  {
    input: 'Mean formula',
    description: 'Σx / n — sum divided by count',
    example: 'Mean = 49/8 = 6.125',
  },
  {
    input: 'Median (odd n)',
    description: 'Exact middle value when sorted',
    example: 'Sorted: [2,3,5,5,8,8,8,10] → median = (5+8)/2 = 6.5',
  },
  {
    input: 'Median (even n)',
    description: 'Average of two middle values when sorted',
    example: 'n=8 → average of 4th and 5th values',
  },
  { input: 'Mode', description: 'Most frequent value(s)', example: '8 (appears 3 times)' },
  {
    input: 'Example dataset',
    description: '8 values showing all three measures',
    example: '[2, 3, 5, 5, 8, 8, 8, 10]',
  },
];

// ─── Related calculators ──────────────────────────────────────────────────────

const RELATED = [
  {
    icon: '📈',
    name: 'Statistics Calculator',
    slug: 'statistics-calculator',
    description: 'Full descriptive statistics suite',
  },
  {
    icon: '📏',
    name: 'Standard Deviation Calculator',
    slug: 'standard-deviation-calculator',
    description: 'Detailed SD and variance analysis',
  },
  {
    icon: '🎲',
    name: 'Probability Calculator',
    slug: 'probability-calculator',
    description: 'Calculate event probabilities',
  },
  {
    icon: '📊',
    name: 'Z-Score Calculator',
    slug: 'z-score-calculator',
    description: 'Standardise values with z-scores',
  },
];

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Mean Median Mode Calculator',
    description:
      'Free mean median mode calculator. Computes all three measures of central tendency plus variance, standard deviation, range, and frequency distribution.',
    url: 'https://roughtools.com/tools/calculators/mean-median-mode-calculator',
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
        name: 'Mean Median Mode Calculator',
        item: 'https://roughtools.com/tools/calculators/mean-median-mode-calculator',
      },
    ],
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MeanMedianModePage() {
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
          <span style={{ color: 'var(--brand)' }}>Mean Median Mode Calculator</span>
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
          Free Mean Median Mode Calculator
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
          Calculate mean, median, and mode — the three measures of central tendency — for any
          dataset. Also computes variance, standard deviation, range, IQR, and frequency
          distribution. Free, private — all calculations run in your browser.
        </p>

        {/* Trust badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
          {[
            '⚡ Instant results',
            '🔒 100% private',
            '🆓 Always free',
            '🚫 No signup',
            '📊 All three averages',
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
        <MeanMedianModeClient />

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
            About This Mean Median Mode Calculator
          </h2>

          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The Mean Median Mode Calculator computes all three classical measures of central
            tendency for any list of numbers you provide. Central tendency measures answer the
            question: &quot;what is a typical value in this dataset?&quot; Each of the three answers
            that question differently, and together they provide a complete picture of where data is
            centred and how that centre should be interpreted.
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
              lineHeight: 2,
            }}
          >
            Mean = Σx / n<br />
            Median = middle value of sorted data
            <br />
            Mode = most frequently occurring value(s)
          </div>
          <p style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            Where <strong style={{ color: '#c4caff' }}>Σx</strong> is the sum of all values and
            <strong style={{ color: '#c4caff' }}> n</strong> is the count. For the median with an
            even number of values: average the two middle values after sorting. For example, in [3,
            5, 7, 9], the median = (5 + 7) / 2 = 6.
          </p>

          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--brand-2)',
              margin: '20px 0 10px',
            }}
          >
            When Each Average Is Appropriate
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The <strong style={{ color: 'var(--fg)' }}>mean</strong> is best for symmetric
            distributions without extreme outliers — exam scores, heights, temperatures. It uses
            every data point and is the foundation for many further statistical calculations
            (variance, standard deviation, correlation). The{' '}
            <strong style={{ color: 'var(--fg)' }}>median</strong> is best when the data is skewed
            or contains outliers — income, home prices, reaction times. It is resistant to extremes
            because it only considers the position of values, not their magnitude. The
            <strong style={{ color: 'var(--fg)' }}> mode</strong> is best for categorical or
            discrete data — the most common shoe size, the most popular choice in a survey, the most
            frequent defect type in a quality report. It is the only one of the three that works for
            non-numeric data.
          </p>

          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--brand-2)',
              margin: '20px 0 10px',
            }}
          >
            Resistance to Outliers — A Real Example
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            Consider seven workers&apos; annual salaries: $30k, $31k, $29k, $32k, $30k, $31k, $500k
            (the owner). Mean = $97.6k — higher than six out of seven people earn. Median = $31k —
            the value that splits the group in half and accurately reflects what a typical worker
            earns. Mode = $30k — the most common salary. This example illustrates why government
            income statistics always quote median household income: the mean would be misleading.
          </p>

          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--brand-2)',
              margin: '20px 0 10px',
            }}
          >
            What the Calculator Also Computes
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 10 }}>
            Beyond the three averages, the calculator provides additional statistics to give a
            complete summary of your data:
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
              'Standard deviation — how spread out values are around the mean',
              'Variance — the squared average deviation (SD²)',
              'Range — the difference between the maximum and minimum values',
              'IQR (Interquartile Range) — the spread of the middle 50% of data (Q3 − Q1)',
              'Frequency distribution — a count of how often each value appears',
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
          toolName="Mean Median Mode Calculator"
          toolSlug="mean-median-mode-calculator"
          toolUrl="https://roughtools.com/tools/calculators/mean-median-mode-calculator"
          type="general"
        />

        <ToolAdUnit position="bottom" />
      </div>
    </>
  );
}
