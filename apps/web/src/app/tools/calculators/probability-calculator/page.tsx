import type { Metadata } from 'next';
import ProbabilityCalculatorClient from './ProbabilityCalculatorClient';
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

const _seo = getCalcSEO('probability-calculator');
export const metadata: Metadata = {
  title: _seo?.seoTitle ?? 'Free Probability Calculator — Single & Combined Events | RoughTools',
  description:
    _seo?.metaDescription ??
    'Calculate the probability of single and combined events. Covers P(A), P(not A), P(A and B), P(A or B), and complement rule. Free, private, instant.',
  keywords: [
    'probability calculator',
    'probability of events',
    'combined probability',
    'complement rule calculator',
    'independent events probability',
    'free probability calculator',
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/calculators/probability-calculator' },
  openGraph: {
    title: 'Free Probability Calculator — Single & Combined Events | RoughTools',
    description:
      'Calculate P(A), P(not A), P(A and B), P(A or B) for independent events. Free, instant, no signup.',
    url: 'https://roughtools.com/tools/calculators/probability-calculator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Probability Calculator | RoughTools',
    description:
      'Calculate event probabilities including complement, union, and intersection. Free, instant.',
  },
};

// ─── FAQ data (12 questions — accordion) ─────────────────────────────────────

const FAQS = [
  {
    q: 'How accurate is this probability calculator?',
    a: 'The calculator is mathematically accurate for the probability models it implements. Classical probability (favorable/total outcomes) produces exact rational answers. All arithmetic uses IEEE 754 double-precision floating point, providing about 15 significant digits — far more than needed for practical probability work.',
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
    a: "Use your browser's print function (Ctrl+P or Cmd+P) to save the page as a PDF. You can also copy individual probability values directly from the results panel.",
  },
  {
    q: 'Should I consult a professional for probability-based decisions?',
    a: 'For high-stakes decisions involving probability — actuarial calculations, clinical trial design, financial risk modelling — consult a qualified statistician, actuary, or risk analyst. A professional can validate assumptions, choose the correct probability model, and interpret results in the full decision context.',
  },
  {
    q: 'What formulas does this calculator use?',
    a: 'Classical probability: P(A) = favorable outcomes / total outcomes. Complement rule: P(not A) = 1 − P(A). Multiplication rule (independent events): P(A and B) = P(A) × P(B). Addition rule: P(A or B) = P(A) + P(B) − P(A and B). For mutually exclusive events: P(A or B) = P(A) + P(B).',
  },
  {
    q: 'What does a probability of 0 vs. 1 mean?',
    a: 'A probability of 0 means the event is impossible — it cannot occur under any circumstances in the defined sample space. A probability of 1 means the event is certain — it will always occur. All valid probabilities fall between 0 and 1 (inclusive), often expressed as a percentage between 0% and 100%.',
  },
  {
    q: 'What is the difference between independent and dependent events?',
    a: "Independent events do not affect each other. The probability of the second event is the same regardless of the first event's outcome. For example, flipping a coin twice — the second flip's probability is always 50% regardless of the first. Dependent events influence each other. Drawing two cards without replacement: after drawing the first card, there are fewer cards remaining, so the probability for the second draw changes.",
  },
  {
    q: 'What is conditional probability?',
    a: 'Conditional probability is the probability of event A occurring given that event B has already occurred: P(A|B) = P(A and B) / P(B). For example: given a randomly selected person is female, what is the probability she is left-handed? If 10% of people are left-handed females and 50% of people are female, P(left-handed|female) = 0.10 / 0.50 = 0.20 = 20%.',
  },
  {
    q: 'What is the birthday paradox and why is probability counter-intuitive?',
    a: "The birthday paradox asks: in a group of 23 people, what is the probability that two share a birthday? Intuitively this seems low — there are 365 days and only 23 people. But the answer is about 50%, and with 57 people it exceeds 99%. This happens because we compare all pairs of people, not just one person's birthday. Human intuition underestimates the growth of combinations. Probability is often counter-intuitive, which is why careful mathematical calculation matters.",
  },
];

// ─── Pro Tips ─────────────────────────────────────────────────────────────────

const PRO_TIPS = [
  'Use the complement rule when "at least one" problems seem hard. Instead of calculating P(at least one success in n trials) directly — which requires summing many terms — calculate P(zero successes) and subtract from 1: P(at least one) = 1 − P(none). For example, probability of rolling at least one 6 in four dice rolls = 1 − (5/6)⁴ ≈ 0.518.',
  'Apply the multiplication rule only for truly independent events. P(A and B) = P(A) × P(B) assumes knowing A occurred tells you nothing about whether B occurs. In practice, events are often dependent — drawing cards without replacement, conditional medical test results, correlated market returns. Always verify independence before multiplying.',
  'Sample size dramatically affects empirical probability accuracy. If you observe 6 heads in 10 flips, the empirical probability is 0.6 — but the true probability may still be 0.5. With 1,000 flips, empirical probability converges much closer to the true value. Empirical probability estimates improve as sample size grows, following the Law of Large Numbers.',
  'Probability quantifies uncertainty — it does not guarantee outcomes. A 90% probability event fails 1 in 10 times. A 1% probability event still occurs regularly over many trials. Misunderstanding probability as certainty is called the "gamblers\' fallacy." Past outcomes of independent random events do not affect future probabilities.',
];

// ─── When to Use ─────────────────────────────────────────────────────────────

const WHEN_TO_USE = [
  {
    icon: '🎲',
    title: 'Gambling and card game probability',
    description:
      'Calculate the probability of drawing specific cards, rolling certain dice combinations, or winning a hand. Make decisions based on actual odds rather than gut feeling.',
  },
  {
    icon: '🛡️',
    title: 'Insurance and risk assessment',
    description:
      'Understand the probability of risk events — flood, accident, illness — over a given time period. Compare risk probabilities to make informed coverage decisions.',
  },
  {
    icon: '📚',
    title: 'Statistics homework and coursework',
    description:
      'Verify probability calculations for class assignments. Check complement rule, addition rule, and multiplication rule answers step by step.',
  },
  {
    icon: '💼',
    title: 'Business risk analysis',
    description:
      'Model the probability that multiple independent risk factors occur simultaneously. Estimate the chance a project encounters at least one major obstacle during development.',
  },
  {
    icon: '🧬',
    title: 'Genetics probability',
    description:
      'Calculate the probability of offspring inheriting specific genetic traits using Mendelian genetics. Model dominant and recessive allele combinations with the multiplication rule.',
  },
];

// ─── Quick Reference table ────────────────────────────────────────────────────

const QUICK_REF = [
  {
    input: 'Favorable Outcomes',
    description: 'Number of outcomes that satisfy the event',
    example: '3 (e.g., rolling 1, 2, or 3)',
  },
  {
    input: 'Total Outcomes',
    description: 'Total possible outcomes in the sample space',
    example: '6 (one die)',
  },
  {
    input: 'P(A)',
    description: 'Probability of event A = favorable / total',
    example: '3/6 = 0.5 = 50%',
  },
  {
    input: 'P(not A)',
    description: 'Complement: probability A does NOT occur',
    example: '1 − 0.5 = 0.5 = 50%',
  },
  {
    input: 'P(A and B)',
    description: 'Both events occur (independent): P(A) × P(B)',
    example: '0.5 × 0.5 = 0.25',
  },
  {
    input: 'P(A or B)',
    description: 'At least one occurs: P(A) + P(B) − P(A and B)',
    example: '0.5 + 0.5 − 0.25 = 0.75',
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
    icon: '🔢',
    name: 'Sample Size Calculator',
    slug: 'sample-size-calculator',
    description: 'How large a sample do you need?',
  },
  {
    icon: '🔀',
    name: 'Permutation & Combination Calculator',
    slug: 'permutation-combination-calculator',
    description: 'Count arrangements and selections',
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
    name: 'Probability Calculator',
    description:
      'Free probability calculator. Computes P(A), P(not A), P(A and B), and P(A or B) for single and combined independent events.',
    url: 'https://roughtools.com/tools/calculators/probability-calculator',
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
        name: 'Probability Calculator',
        item: 'https://roughtools.com/tools/calculators/probability-calculator',
      },
    ],
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProbabilityCalculatorPage() {
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
          <span style={{ color: 'var(--brand)' }}>Probability Calculator</span>
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
          🎲
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
          Free Probability Calculator
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
          Calculate the probability of single and combined events. Computes P(A), P(not A), P(A and
          B), and P(A or B) using classical probability rules. Covers complement, multiplication,
          and addition rules. Free, private — all calculations run in your browser.
        </p>

        {/* Trust badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
          {[
            '⚡ Instant results',
            '🔒 100% private',
            '🆓 Always free',
            '🚫 No signup',
            '🎯 All core rules',
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
        <ProbabilityCalculatorClient />

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
            About This Probability Calculator
          </h2>

          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The Probability Calculator computes the likelihood of events using the rules of
            classical probability. Probability is the mathematical language of uncertainty — it
            quantifies how likely an event is to occur on a scale from 0 (impossible) to 1
            (certain). This calculator covers the foundational rules that apply whenever outcomes
            are equally likely and events are independent. It is ideal for statistics coursework,
            everyday decision-making under uncertainty, and understanding the odds in games and risk
            scenarios.
          </p>

          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--brand-2)',
              margin: '20px 0 10px',
            }}
          >
            The Core Probability Formulas
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
            P(A) = favorable outcomes / total outcomes
            <br />
            P(not A) = 1 − P(A) [complement rule]
            <br />
            P(A and B) = P(A) × P(B) [independent events]
            <br />
            P(A or B) = P(A) + P(B) − P(A and B) [addition rule]
          </div>

          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--brand-2)',
              margin: '20px 0 10px',
            }}
          >
            Types of Probability
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            <strong style={{ color: 'var(--fg)' }}>Classical probability</strong> applies when all
            outcomes are equally likely — rolling a fair die, drawing a card from a shuffled deck.
            P(A) is the count of favorable outcomes divided by the total number of possible
            outcomes.
            <strong style={{ color: 'var(--fg)' }}> Empirical probability</strong> is based on
            observed data from experiments: if a machine produces 7 defective parts out of 200, the
            empirical probability of a defect is 7/200 = 3.5%.
            <strong style={{ color: 'var(--fg)' }}> Subjective probability</strong> is an expert
            estimate when no frequency data exists — a doctor&apos;s assessment that a treatment has
            a 70% chance of success based on clinical experience.
          </p>

          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--brand-2)',
              margin: '20px 0 10px',
            }}
          >
            Independent vs. Dependent Events
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            Two events are <strong style={{ color: 'var(--fg)' }}>independent</strong> if knowing
            the outcome of one gives no information about the other. Coin flips are independent —
            the coin has no memory. In this case, P(A and B) = P(A) × P(B). Events are
            <strong style={{ color: 'var(--fg)' }}> dependent</strong> if the outcome of one changes
            the probability of the other. Drawing cards without replacement is dependent — the
            remaining deck composition changes after each draw. For dependent events, use
            conditional probability: P(A and B) = P(A) × P(B|A), where P(B|A) is the probability of
            B given A.
          </p>

          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--brand-2)',
              margin: '20px 0 10px',
            }}
          >
            Complementary Events
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The complement of event A (written &quot;not A&quot; or A&apos;) includes every outcome
            where A does NOT occur. Since every outcome is either A or not A: P(A) + P(not A) = 1,
            therefore P(not A) = 1 − P(A). The complement rule is especially useful for &quot;at
            least one&quot; problems. For example: &quot;What is the probability of rolling at least
            one six in four rolls of a die?&quot; Rather than summing many terms, compute P(no
            sixes) = (5/6)⁴ ≈ 0.482, so P(at least one six) = 1 − 0.482 ≈ 0.518.
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
          toolName="Probability Calculator"
          toolSlug="probability-calculator"
          toolUrl="https://roughtools.com/tools/calculators/probability-calculator"
          type="general"
        />

        <ToolAdUnit position="bottom" />
      </div>
    </>
  );
}
