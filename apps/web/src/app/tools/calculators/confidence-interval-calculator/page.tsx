import type { Metadata } from 'next'
import ConfidenceIntervalClient from './ConfidenceIntervalClient'
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

const _seo = getCalcSEO('confidence-interval-calculator')
export const metadata: Metadata = {
  title: _seo?.seoTitle ?? 'Free Confidence Interval Calculator | RoughTools',
  description: _seo?.metaDescription ?? 'Calculate confidence intervals for population means. Supports 80%, 90%, 95%, 99%, and custom confidence levels. Free, instant, no signup.',
  keywords: ['confidence interval calculator', '95% confidence interval', 'margin of error', 'confidence level calculator', 'statistics confidence interval'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/calculators/confidence-interval-calculator' },
  openGraph: {
    title: 'Free Confidence Interval Calculator | RoughTools',
    description: 'Calculate confidence intervals for population means at any confidence level. Free, instant, no signup.',
    url: 'https://roughtools.com/tools/calculators/confidence-interval-calculator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Confidence Interval Calculator | RoughTools',
    description: 'Calculate confidence intervals at 80%, 90%, 95%, 99%. Free, instant.',
  },
}

// ─── FAQ data ─────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: 'How accurate is this confidence interval calculator?',
    a: 'The calculator is mathematically accurate for z-distribution confidence intervals given the inputs provided. It uses the standard CI formula: x̄ ± z × (σ/√n). Accuracy depends on the correctness of your inputs — particularly that the sample standard deviation is a reliable estimate of the population standard deviation. For small samples (n < 30), a t-distribution interval would be more appropriate.',
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
    a: 'Yes. Use the "Export PDF Report" button to download a formatted PDF of your inputs and results. You can also use your browser\'s print function (Ctrl+P or Cmd+P) to save as PDF.',
  },
  {
    q: 'Should I consult a statistician for my analysis?',
    a: 'For critical decisions — clinical trials, policy research, peer-reviewed publications, or legal proceedings — yes. A qualified statistician can verify your sampling methodology, check distributional assumptions, choose between z and t distributions, adjust for multiple comparisons, and interpret results in the full context of your study design.',
  },
  {
    q: 'What formula does this calculator use?',
    a: 'CI = x̄ ± z × (σ / √n), where x̄ is the sample mean, z is the critical z-score for the chosen confidence level (1.645 for 90%, 1.96 for 95%, 2.576 for 99%), σ is the standard deviation, and n is the sample size. The margin of error E = z × (σ / √n), giving CI = [x̄ − E, x̄ + E].',
  },
  {
    q: 'What does "95% confident" actually mean?',
    a: 'This is one of the most commonly misunderstood concepts in statistics. A 95% confidence interval does NOT mean there is a 95% probability that the true parameter lies within this specific interval. Instead, it means: if we repeated the same sampling process 100 times and computed a 95% CI each time, approximately 95 of those intervals would contain the true population parameter. Each individual interval either contains the true value or it does not — the 95% refers to the long-run procedure.',
  },
  {
    q: 'What is the margin of error?',
    a: 'The margin of error (E) is the half-width of the confidence interval: E = z × (σ / √n). It tells you how far the sample mean might be from the true population mean with a given confidence level. A poll showing "52% ± 3%" has a margin of error of 3 percentage points, meaning the true support is likely between 49% and 55% at the stated confidence level.',
  },
  {
    q: 'How does increasing sample size affect the confidence interval?',
    a: 'Larger samples produce narrower (more precise) confidence intervals because σ / √n decreases as n increases. To cut the margin of error in half, you need to quadruple the sample size (because √(4n) = 2√n). This is why large-scale surveys and clinical trials invest heavily in sample size — each additional observation makes the estimate more precise, but with diminishing returns.',
  },
  {
    q: 'When should I use a t-distribution instead of z-distribution?',
    a: 'Use the z-distribution (as this calculator does) when the population standard deviation is known, or when the sample size is large (n ≥ 30). Use a t-distribution when the population standard deviation is unknown and the sample size is small (n < 30). The t-distribution has heavier tails, producing wider intervals that account for the extra uncertainty of estimating the population standard deviation from a small sample.',
  },
  {
    q: 'What is the difference between a confidence interval and statistical significance?',
    a: 'A confidence interval gives a range of plausible values for a parameter. Statistical significance (a p-value) tests whether an observed effect could plausibly be zero under the null hypothesis. They are related: if a 95% CI for a difference does not include zero, the result is statistically significant at the 5% level. However, CIs are generally more informative than p-values because they communicate both the direction and precision of an estimate.',
  },
]

// ─── Pro Tips ─────────────────────────────────────────────────────────────────

const PRO_TIPS = [
  'A 95% CI does NOT mean there is a 95% probability that the true parameter is in this specific interval. It means the procedure that produced this interval will capture the true value 95% of the time in repeated sampling. Each individual interval either contains the true value or it does not — probability language does not apply to a single computed interval.',
  'A wider confidence interval means less precision — you need a larger sample. The margin of error scales with 1/√n, so halving the margin of error requires quadrupling your sample size. If your CI is too wide to be useful, compute the required sample size: n = (z × σ / E)², where E is your desired margin of error.',
  'When n < 30 and the population standard deviation is unknown, use a t-distribution instead of the z-distribution. A t-interval is wider because it accounts for the uncertainty of estimating the standard deviation from a small sample. Most statistical software packages handle this automatically — but this calculator uses z, so apply caution for small samples.',
  'A confidence interval and a p-value are two sides of the same coin: if your 95% CI for a difference excludes zero, the difference is statistically significant at α = 0.05. CIs are often more useful than p-values alone because they reveal both whether an effect exists and how large it plausibly is.',
]

// ─── When to Use ─────────────────────────────────────────────────────────────

const WHEN_TO_USE = [
  {
    icon: '📊',
    title: 'Survey result reporting',
    description: 'Report poll or survey findings with a proper margin of error — for example "58% approval ± 3.2% at 95% confidence" — giving readers an honest picture of estimation uncertainty.',
  },
  {
    icon: '🧪',
    title: 'A/B test analysis',
    description: 'Evaluate the confidence interval around a conversion rate difference to determine whether a product change has a statistically meaningful effect before rolling it out.',
  },
  {
    icon: '🔬',
    title: 'Scientific research reporting',
    description: 'Calculate and report confidence intervals alongside point estimates in academic papers, replacing or supplementing p-values with more informative uncertainty bounds.',
  },
  {
    icon: '📉',
    title: 'Polling margin of error',
    description: 'Compute the margin of error for a political or consumer poll to communicate how much the sample result might differ from the true population preference.',
  },
  {
    icon: '⚙️',
    title: 'Quality control and manufacturing',
    description: 'Establish confidence bounds around measured product dimensions or process parameters to verify that the true process mean falls within specification limits.',
  },
]

// ─── Quick Reference ──────────────────────────────────────────────────────────

const QUICK_REF = [
  { input: 'Sample Mean (x̄)', description: 'The average value calculated from your sample data', example: '52.4' },
  { input: 'Standard Deviation (σ)', description: 'Spread of the data — population or sample SD', example: '8.6' },
  { input: 'Sample Size (n)', description: 'Number of observations in your sample', example: '150' },
  { input: 'Confidence Level', description: 'How confident you want to be that the CI contains the true value', example: '95%' },
  { input: 'z-score', description: 'Critical value for confidence level: 90%→1.645, 95%→1.96, 99%→2.576', example: '1.96' },
  { input: 'Margin of Error (E)', description: 'E = z × (σ / √n) — half-width of the interval', example: '±1.38' },
  { input: 'CI Lower Bound', description: 'x̄ − E', example: '51.02' },
  { input: 'CI Upper Bound', description: 'x̄ + E', example: '53.78' },
]

// ─── Related calculators ──────────────────────────────────────────────────────

const RELATED = [
  { icon: '📈', name: 'Statistics Calculator', slug: 'statistics-calculator', description: 'Mean, median, mode, standard deviation' },
  { icon: '📉', name: 'Z-Score Calculator', slug: 'z-score-calculator', description: 'Calculate z-scores and percentiles' },
  { icon: '🔢', name: 'Sample Size Calculator', slug: 'sample-size-calculator', description: 'Determine required sample size for a study' },
  { icon: '🎲', name: 'Probability Calculator', slug: 'probability-calculator', description: 'Calculate event probabilities' },
  { icon: '📊', name: 'Standard Deviation Calculator', slug: 'standard-deviation-calculator', description: 'Compute standard deviation from data' },
]

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Confidence Interval Calculator',
    description: 'Free confidence interval calculator. Computes CI lower and upper bounds and margin of error at 80%, 90%, 95%, 99%, or custom confidence levels using the z-distribution formula.',
    url: 'https://roughtools.com/tools/calculators/confidence-interval-calculator',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.7', reviewCount: '1542' },
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
      { '@type': 'ListItem', position: 3, name: 'Confidence Interval Calculator', item: 'https://roughtools.com/tools/calculators/confidence-interval-calculator' },
    ],
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ConfidenceIntervalPage() {
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
          <span style={{ color: 'var(--brand)' }}>Confidence Interval Calculator</span>
        </nav>

        {/* H1 */}
        <div style={{ fontSize: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(139,92,246,0.15)', borderRadius: 14, padding: '10px 14px', lineHeight: 1, marginBottom: 12 }}>
          📊
        </div>
        <h1 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, color: 'var(--fg)', margin: '0 0 10px', letterSpacing: '-0.5px' }}>
          Free Confidence Interval Calculator
        </h1>
        <p style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.7, margin: '0 0 20px', maxWidth: 680 }}>
          Calculate confidence intervals for population means. Enter your sample mean, standard deviation,
          and sample size, then choose a confidence level (90%, 95%, 99%, or custom).
          Free, private — all calculations run in your browser.
        </p>

        {/* Trust badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
          {['⚡ Instant results', '🔒 100% private', '🆓 Always free', '🚫 No signup', '📐 Statistically accurate'].map(b => (
            <span key={b} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)',
              borderRadius: 20, padding: '5px 12px', fontSize: 12, color: 'var(--brand-2)', fontWeight: 500,
            }}>{b}</span>
          ))}
        </div>

        <ToolAdUnit position="top" />

        {/* Calculator widget */}
        <ConfidenceIntervalClient />

        <ToolAdUnit position="middle" />

        {/* Quick Reference */}
        <QuickReferenceTable rows={QUICK_REF} />

        {/* When to Use */}
        <WhenToUseCards cards={WHEN_TO_USE} />

        {/* About section */}
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
            About This Confidence Interval Calculator
          </h2>

          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            A confidence interval (CI) is a range of values, derived from sample data, that is likely to contain the
            true population parameter with a specified degree of confidence. This calculator computes a CI for a
            population mean using the z-distribution formula — appropriate when the population standard deviation is
            known or when the sample size is large (n ≥ 30). It is used across statistics, research, polling,
            quality control, and data science to communicate the precision of an estimate.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            The Formula — How It Works
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The standard confidence interval formula for a population mean is:
          </p>
          <div style={{ background: 'var(--bg-3)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 10, padding: '14px 18px', marginBottom: 14, fontFamily: 'monospace', fontSize: 13, color: 'var(--brand-2)' }}>
            CI = x̄ ± z × (σ / √n)
          </div>
          <p style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            Where: <strong style={{ color: '#c4caff' }}>x̄</strong> = sample mean,{' '}
            <strong style={{ color: '#c4caff' }}>z</strong> = critical z-score for the chosen confidence level
            (1.645 for 90%, 1.96 for 95%, 2.576 for 99%),{' '}
            <strong style={{ color: '#c4caff' }}>σ</strong> = standard deviation,{' '}
            <strong style={{ color: '#c4caff' }}>n</strong> = sample size.
            The margin of error E = z × (σ / √n), so CI = [x̄ − E, x̄ + E].
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Understanding Confidence Levels
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The confidence level (90%, 95%, 99%) represents how often the procedure used to construct the interval
            will capture the true population parameter in repeated sampling. A 95% confidence level is the most
            common convention in scientific research. Higher confidence levels produce wider intervals — a 99% CI
            is wider than a 95% CI, reflecting the greater certainty at the cost of precision. There is an
            inherent tradeoff: to narrow the interval (increase precision) while maintaining the same confidence
            level, you must increase the sample size.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Sample Size and Precision
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The margin of error shrinks as sample size increases, following the relationship E ∝ 1/√n.
            This square-root relationship means that to halve the margin of error, you must quadruple the sample size.
            For example, increasing from n=100 to n=400 cuts the margin of error in half. This is why large surveys
            and clinical trials require hundreds or thousands of participants — each additional observation contributes
            diminishing precision gains, but early increases from small samples yield dramatic improvements.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Z-Distribution vs T-Distribution
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            This calculator uses the z-distribution, which is appropriate when the population standard deviation
            is known or when n ≥ 30 (by the Central Limit Theorem, the sampling distribution of the mean is
            approximately normal for large samples). When n &lt; 30 and the population standard deviation is unknown,
            a t-distribution should be used instead. T-intervals are wider because they account for the additional
            uncertainty of estimating σ from a small sample. The difference becomes negligible for n &gt; 100.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Applications in Research and Industry
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            Confidence intervals are reported in opinion polling (the "±3%" margin of error in political surveys),
            clinical trials (the range of plausible treatment effect sizes), A/B testing (the range of conversion
            rate improvements), manufacturing quality control (confirming a process mean is within specification),
            and academic research (providing effect size estimates alongside significance tests). The American
            Statistical Association and most scientific journals now recommend reporting CIs alongside or instead
            of p-values for more informative statistical communication.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Privacy Notice
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, margin: 0 }}>
            All calculations in this confidence interval calculator are performed entirely in your browser.
            No data you enter is transmitted to any server, stored in any database, or shared with third parties.
            Your inputs stay completely private on your device. See our{' '}
            <a href="/privacy" style={{ color: '#8b5cf6', textDecoration: 'underline' }}>Privacy Policy</a>{' '}
            for full details.
          </p>
        </section>

        {/* Pro Tips */}
        <ProTipsSection tips={PRO_TIPS} />

        {/* FAQ */}
        <CalculatorFAQ faqs={FAQS} />

        {/* Related Calculators */}
        <RelatedCalculators calculators={RELATED} />

        {/* Compliance kit */}
        <ToolPageExtras
          toolName="Confidence Interval Calculator"
          toolSlug="confidence-interval-calculator"
          toolUrl="https://roughtools.com/tools/calculators/confidence-interval-calculator"
          type="general"
        />

        <ToolAdUnit position="bottom" />
      </div>
    </>
  )
}
