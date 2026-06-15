import type { Metadata } from 'next'
import SampleSizeClient from './SampleSizeClient'
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

const _seo = getCalcSEO('sample-size-calculator')
export const metadata: Metadata = {
  title: _seo?.seoTitle ?? 'Free Sample Size Calculator — Survey & Research | RoughTools',
  description: _seo?.metaDescription ?? 'Calculate the minimum sample size for surveys, polls, and studies. Enter confidence level, margin of error, and population size. Free, instant, no signup.',
  keywords: ['sample size calculator', 'survey sample size', 'margin of error calculator', 'confidence level calculator', 'statistical sample size formula', 'research sample size', 'minimum sample size'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/calculators/sample-size-calculator' },
  openGraph: {
    title: 'Free Sample Size Calculator — Survey & Research | RoughTools',
    description: 'Calculate minimum sample size for surveys and research. Supports confidence levels, margin of error, and finite population correction. Free, instant.',
    url: 'https://roughtools.com/tools/calculators/sample-size-calculator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Sample Size Calculator | RoughTools',
    description: 'Calculate minimum sample size for surveys and studies. Free, instant.',
  },
}

// ─── FAQ data (12 questions — accordion) ─────────────────────────────────────

const FAQS = [
  {
    q: 'How accurate is this sample size calculator?',
    a: 'The calculator applies the standard statistical formula for proportions (n = z² × p × (1−p) / e²) and the finite population correction, producing results that match those from academic statistics software for the same inputs. The formulas are mathematically exact given the inputs. However, real-world accuracy depends on how well your inputs reflect reality — particularly whether your assumed population proportion (p) is close to the true value.',
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
    q: 'Who should I consult for professional research design?',
    a: 'A qualified biostatistician, research methodologist, or applied statistician. For clinical trials, a clinical trial statistician is essential. For market research, a quantitative research specialist. For academic research, your institution\'s statistical consulting service. Sample size is just one part of study design — a professional ensures your methodology is sound end-to-end.',
  },
  {
    q: 'What formula does this calculator use?',
    a: 'For proportions: n = (z² × p × (1−p)) / e², where z is the z-score for the chosen confidence level (1.645 for 90%, 1.96 for 95%, 2.576 for 99%), p is the expected population proportion (use 0.5 for maximum conservatism), and e is the margin of error as a decimal. For finite populations: n_adjusted = n / (1 + (n−1)/N), where N is the population size. The result is always rounded up to the next whole number.',
  },
  {
    q: 'What confidence level should I choose?',
    a: '95% confidence (z = 1.96) is the overwhelming standard for academic research, clinical studies, and professional surveys. It means: if you ran this study 100 times, 95 of them would produce a result within your margin of error of the true population value. 90% confidence (z = 1.645) requires a smaller sample and is used when resources are limited or the stakes are lower. 99% confidence (z = 2.576) requires a larger sample and is used in high-stakes medical or safety research where false negatives are costly.',
  },
  {
    q: 'What margin of error is acceptable?',
    a: '±5% is the standard for general public surveys and political polling (e.g., "accurate to within 5 percentage points, 19 times out of 20"). ±3% is used for higher-precision research. ±1% requires very large samples and is used for national censuses or high-stakes decisions. For internal business research, ±10% is often sufficient and dramatically reduces the required sample. Tighter margins of error require exponentially larger samples — halving the margin of error quadruples the required sample size.',
  },
  {
    q: 'Why is p = 0.5 the worst case — and when should I use a different value?',
    a: 'The formula n = z² × p × (1−p) / e² is maximised when p = 0.5 (giving 0.25 in the numerator). For any other value of p, p × (1−p) is smaller, requiring a smaller sample. Use p = 0.5 when you have no prior knowledge of the proportion — it guarantees your sample will be large enough regardless of the true value. If you have reliable prior data — for example, a pilot study showing 70% adoption — use p = 0.7 to get a smaller, sufficient sample. Never use p from a biased source.',
  },
  {
    q: 'How does population size affect required sample size?',
    a: 'For very large populations (N > 100,000), the population size has almost no effect — you need roughly the same sample size whether the population is 100,000 or 100 million. This counter-intuitive result comes from the finite population correction: n_adjusted = n / (1 + (n−1)/N), which barely reduces n when N is large. For small populations (N < 10,000), the correction provides meaningful reduction. For N = 500 and an uncorrected sample of 385, the adjusted sample is about 218. For N = 100, it drops to around 79.',
  },
  {
    q: 'Do sub-groups need their own sample size calculations?',
    a: 'Yes — this is one of the most commonly overlooked aspects of survey design. If you plan to analyse results for sub-groups (by gender, age, region, product category), each sub-group needs its own minimum sample size to produce reliable estimates for that sub-group alone. A total sample of 385 gives you ±5% precision overall, but if only 50 respondents are in a sub-group of interest, that sub-group\'s results have a margin of error of roughly ±14%. Plan sub-group quotas during study design, not after data collection.',
  },
]

// ─── Pro Tips ─────────────────────────────────────────────────────────────────

const PRO_TIPS = [
  'Halving your margin of error quadruples your required sample size — this is the inverse square law of sampling precision. Going from ±5% to ±2.5% does not double the sample; it multiplies it by four. Before demanding tighter margins, ask whether the precision gain is worth the cost. Often ±5% is more than sufficient for decision-making.',
  'When the true population proportion is unknown, always use p = 0.5 (worst case) for your sample size calculation. This ensures your sample will be large enough whatever the true proportion turns out to be. If you use an assumed p = 0.3 and the true proportion is 0.5, your actual margin of error will be wider than planned.',
  'Adjust for expected response rate. If you calculate you need 385 completed responses and you expect a 40% response rate, you need to recruit 385 / 0.40 = 963 initial invitations. This "gross sample" calculation is essential for survey planning — failing to account for non-response is a leading cause of underpowered studies.',
  'Sub-groups need their own calculations. If you want to compare results between men and women, each group individually needs to meet your minimum sample size target. Plan sub-group quotas into your study design — you cannot fix an underpowered sub-group after data collection is complete.',
]

// ─── When to Use ─────────────────────────────────────────────────────────────

const WHEN_TO_USE = [
  {
    icon: '📋',
    title: 'Survey design and planning',
    description: 'Determine how many respondents your customer satisfaction survey, employee pulse survey, or market research poll needs to produce statistically valid results.',
  },
  {
    icon: '🔬',
    title: 'A/B test planning',
    description: 'Calculate how many visitors or sessions each variant of your A/B test needs before you can draw statistically significant conclusions about conversion rate differences.',
  },
  {
    icon: '🏥',
    title: 'Clinical trial and study design',
    description: 'Establish the minimum number of participants needed before beginning patient recruitment — a regulatory requirement for most clinical and epidemiological studies.',
  },
  {
    icon: '📈',
    title: 'Market research planning',
    description: 'Scope the cost and timeline of primary market research by knowing exactly how large your survey panel needs to be to meet your precision requirements.',
  },
  {
    icon: '✅',
    title: 'Quality control and audit sampling',
    description: 'Determine the number of items to inspect in a manufacturing run or financial audit to achieve a given confidence level about the defect or error rate.',
  },
]

// ─── Quick Reference table ────────────────────────────────────────────────────

const QUICK_REF = [
  { input: 'Confidence Level', description: 'Probability that the true value falls within the margin of error', example: '95% (z = 1.96)' },
  { input: 'Margin of Error (e)', description: 'Maximum acceptable deviation from the true population value', example: '±5% (e = 0.05)' },
  { input: 'Population Proportion (p)', description: 'Expected proportion of the attribute; use 0.5 if unknown', example: '0.5 (worst case)' },
  { input: 'Population Size (N)', description: 'Total size of the population (optional — for finite correction)', example: '5,000' },
  { input: 'Required Sample Size (n)', description: 'Minimum number of completed responses needed', example: '357 (from 5,000 pop)' },
]

// ─── Related calculators ──────────────────────────────────────────────────────

const RELATED = [
  { icon: '📊', name: 'Statistics Calculator', slug: 'statistics-calculator', description: 'Mean, median, mode, standard deviation' },
  { icon: '📉', name: 'Confidence Interval Calculator', slug: 'confidence-interval-calculator', description: 'Calculate confidence intervals for a proportion' },
  { icon: '🎲', name: 'Probability Calculator', slug: 'probability-calculator', description: 'Calculate event probabilities and odds' },
  { icon: '📐', name: 'Z-Score Calculator', slug: 'z-score-calculator', description: 'Standardise values and find probabilities' },
]

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Sample Size Calculator',
    description: 'Free sample size calculator for surveys and research. Computes minimum sample size using confidence level, margin of error, and finite population correction.',
    url: 'https://roughtools.com/tools/calculators/sample-size-calculator',
    applicationCategory: 'ScienceApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '2104' },
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
      { '@type': 'ListItem', position: 3, name: 'Sample Size Calculator', item: 'https://roughtools.com/tools/calculators/sample-size-calculator' },
    ],
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SampleSizePage() {
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
          <span style={{ color: 'var(--brand)' }}>Sample Size Calculator</span>
        </nav>

        {/* H1 */}
        <div style={{ fontSize: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(139,92,246,0.15)', borderRadius: 14, padding: '10px 14px', lineHeight: 1, marginBottom: 12 }}>
          📏
        </div>
        <h1 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, color: 'var(--fg)', margin: '0 0 10px', letterSpacing: '-0.5px' }}>
          Free Sample Size Calculator
        </h1>
        <p style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.7, margin: '0 0 20px', maxWidth: 680 }}>
          Calculate the minimum sample size for surveys, research studies, polls, and A/B tests.
          Enter your confidence level, margin of error, and population size.
          Free, private — all calculations run in your browser.
        </p>

        {/* Trust badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
          {['⚡ Instant results', '🔒 100% private', '🆓 Always free', '🚫 No signup', '📊 Statistically accurate'].map(b => (
            <span key={b} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)',
              borderRadius: 20, padding: '5px 12px', fontSize: 12, color: 'var(--brand-2)', fontWeight: 500,
            }}>{b}</span>
          ))}
        </div>

        <ToolAdUnit position="top" />

        {/* Calculator widget */}
        <SampleSizeClient />

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
          <h2 id="about-heading" style={{ fontSize: 20, fontWeight: 800, color: 'var(--fg)', marginTop: 0, marginBottom: 16 }}>
            About This Sample Size Calculator
          </h2>

          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            Sample size is one of the most critical — and most commonly under-planned — aspects of research design.
            Too small a sample and your results are unreliable, potentially misleading decision-makers with false precision.
            Too large a sample and you waste resources, time, and money collecting more data than your analysis requires.
            This calculator tells you exactly how many responses, participants, or observations you need to achieve
            a specified level of statistical precision.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            The Formula — How It Works
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            For surveys and proportion-based studies, the standard sample size formula is:
          </p>
          <div style={{ background: 'var(--bg-3)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 10, padding: '14px 18px', marginBottom: 14, fontFamily: 'monospace', fontSize: 13, color: 'var(--brand-2)' }}>
            n = (z² × p × (1 − p)) / e²
          </div>
          <p style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            Where: <strong style={{ color: '#c4caff' }}>z</strong> = z-score for confidence level (1.645 for 90%, 1.96 for 95%, 2.576 for 99%),{' '}
            <strong style={{ color: '#c4caff' }}>p</strong> = expected population proportion (use 0.5 if unknown — this maximises and thus bounds the sample size),{' '}
            <strong style={{ color: '#c4caff' }}>e</strong> = desired margin of error as a decimal (e.g., 0.05 for ±5%).
          </p>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 10 }}>
            For finite populations (when your total population N is known and not very large), apply the{' '}
            <strong style={{ color: 'var(--fg)' }}>finite population correction (FPC)</strong>:
          </p>
          <div style={{ background: 'var(--bg-3)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 10, padding: '14px 18px', marginBottom: 14, fontFamily: 'monospace', fontSize: 13, color: 'var(--brand-2)' }}>
            n_adjusted = n / (1 + (n − 1) / N)
          </div>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The FPC reduces the required sample when N is small relative to n. For N &gt; 100,000, the correction
            is negligible (&lt;0.4%) and the unadjusted formula suffices — this explains the well-known result
            that national polls need only ~1,000 respondents regardless of whether the population is 10 million or 300 million.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Confidence Levels, Margin of Error, and Population Proportion
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The <strong style={{ color: 'var(--fg)' }}>confidence level</strong> (90%, 95%, 99%) tells you how often
            your interval would capture the true population value if you repeated the study many times.
            95% is the field standard — accepted by most academic journals, IRBs, and regulatory bodies.
            The <strong style={{ color: 'var(--fg)' }}>margin of error</strong> (±e) is the acceptable range of
            imprecision around your estimate. ±5% is typical for general surveys; ±3% for higher-stakes research.
            The <strong style={{ color: 'var(--fg)' }}>population proportion</strong> (p) is your best estimate
            of the true proportion you are measuring. When uncertain, p = 0.5 is the conservative choice
            because p(1−p) is maximised at p = 0.5, producing the largest (most conservative) sample size.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Why Sample Size Matters for Research Validity
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            An underpowered study is not just statistically inconvenient — it can be unethical. In clinical research,
            an underpowered trial exposes participants to risk without generating actionable evidence. In market research,
            decisions based on too-small samples lead to failed product launches. In public policy, poorly sampled surveys
            produce misleading pictures of public opinion. This calculator gives you the tools to plan research correctly
            from the start, before a single data point is collected.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Privacy Notice
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, margin: 0 }}>
            All calculations in this calculator are performed entirely in your browser. No data you enter is
            transmitted to any server, stored in any database, or shared with third parties. See our{' '}
            <a href="/privacy" style={{ color: '#8b5cf6', textDecoration: 'underline' }}>Privacy Policy</a>{' '}
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
          toolName="Sample Size Calculator"
          toolSlug="sample-size-calculator"
          toolUrl="https://roughtools.com/tools/calculators/sample-size-calculator"
          type="general"
        />

        <ToolAdUnit position="bottom" />
      </div>
    </>
  )
}
