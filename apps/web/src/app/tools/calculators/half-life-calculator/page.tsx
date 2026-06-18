import type { Metadata } from 'next';
import HalfLifeCalculatorClient from './HalfLifeCalculatorClient';
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

const _seo = getCalcSEO('half-life-calculator');
export const metadata: Metadata = {
  title: _seo?.seoTitle ?? 'Free Half-Life Calculator — Radioactive Decay | RoughTools',
  description:
    _seo?.metaDescription ??
    'Calculate the remaining quantity after radioactive decay, the number of half-lives elapsed, or the half-life from decay data. Free, instant, no signup.',
  keywords: [
    'half life calculator',
    'radioactive decay calculator',
    'half life formula',
    'nuclear decay calculator',
    'radioactive decay equation',
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/calculators/half-life-calculator' },
  openGraph: {
    title: 'Free Half-Life Calculator — Radioactive Decay | RoughTools',
    description:
      'Calculate remaining quantity, elapsed half-lives, or determine the half-life from decay data. Free, instant.',
    url: 'https://roughtools.com/tools/calculators/half-life-calculator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Half-Life Calculator | RoughTools',
    description: 'Radioactive decay and half-life calculations. Free, instant.',
  },
};

const FAQS = [
  {
    q: 'How accurate is this half-life calculator?',
    a: 'The calculator applies the standard radioactive decay formula N(t) = N₀ × (1/2)^(t/t½) with full floating-point precision. Results are accurate to approximately 15 significant digits. For very large numbers of half-lives (>1000), extremely small remaining quantities may be returned as zero due to floating-point underflow.',
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
    q: 'What is the half-life formula?',
    a: 'N(t) = N₀ × (1/2)^(t/t½) where N(t) is the remaining quantity at time t, N₀ is the initial quantity, t is the elapsed time, and t½ is the half-life. The equivalent formula using the decay constant λ is N(t) = N₀ × e^(−λt), where λ = ln(2)/t½.',
  },
  {
    q: 'What is a half-life?',
    a: 'Half-life (t½) is the time required for exactly half of a radioactive substance to decay. After one half-life, 50% remains. After two half-lives, 25% remains. After three, 12.5%, and so on. Half-life is constant for a given isotope — it does not depend on the amount of material, temperature, or chemical state.',
  },
  {
    q: 'What is the decay constant (λ) and how is it related to half-life?',
    a: 'The decay constant λ (lambda) is the probability per unit time that a single atom will decay. It is related to half-life by: λ = ln(2) / t½ ≈ 0.6931 / t½. The decay formula using λ is N(t) = N₀ × e^(−λt). Half-life is more intuitive; the decay constant is more convenient for calculations.',
  },
  {
    q: 'How many half-lives until a substance is "gone"?',
    a: 'In principle, radioactive decay is asymptotic — the quantity approaches but never reaches zero. Practically, after 10 half-lives only 1/1024 (≈ 0.1%) remains; after 20 half-lives less than 1 in a million remains. In nuclear waste management, "safe" levels typically mean waiting 10 half-lives. For carbon-14 (t½ ≈ 5,730 years), meaningful dating extends to about 50,000 years (≈ 8–9 half-lives).',
  },
  {
    q: 'What is carbon-14 dating and how does it use half-life?',
    a: 'Radiocarbon dating uses the known half-life of carbon-14 (5,730 years) to determine the age of organic materials. Living organisms continuously exchange carbon with the atmosphere, maintaining a known ratio of C-14 to C-12. After death, the C-14 decays with no replenishment. By measuring the remaining C-14 ratio, scientists can calculate how many half-lives have elapsed and thus the age of the sample.',
  },
  {
    q: 'Does half-life apply to things other than radioactive decay?',
    a: 'Yes. Half-life is used for any process that follows exponential decay. In pharmacology, drug half-life describes how long it takes for a drug concentration in the body to halve — typically 5–6 half-lives to reach negligible levels. In finance, "half-life of alpha" describes strategy decay. In electronics, RC circuit time constants use an equivalent concept.',
  },
];

const PRO_TIPS = [
  'After every half-life, exactly half remains — but this compounds. After n half-lives, the fraction remaining is (1/2)ⁿ. This is why radioactive materials take so long to become safe: carbon-14 has a half-life of 5,730 years, meaning after 57,300 years (10 half-lives) only 0.1% remains. Nuclear waste with half-lives of thousands of years requires geological-timescale storage.',
  'The decay constant λ = ln(2)/t½ ≈ 0.693/t½ connects half-life to the continuous exponential decay formula N = N₀e^(−λt). The two formulas are mathematically identical — choose whichever is more convenient for your problem. The (1/2)^(t/t½) form is often more intuitive; the e^(−λt) form is easier to differentiate.',
  "In pharmacology, a drug reaches approximately 97% of its steady-state concentration after 5 half-lives of dosing, and decreases to approximately 3% of peak after 5 half-lives post-dose. This is why drug dosing intervals and washout periods are typically expressed as multiples of the drug's half-life.",
  'The number of half-lives n = log₂(N₀/N) — or equivalently n = ln(N₀/N) / ln(2). This formula is used to work backwards: given an initial and final quantity, how many half-lives elapsed? Divide by the half-life period to get the total elapsed time. This is the basis of radiocarbon age dating.',
];

const WHEN_TO_USE = [
  {
    icon: '⚛️',
    title: 'Physics and chemistry homework',
    description:
      'Calculate remaining quantity after decay, number of half-lives, or determine the half-life from two data points for nuclear physics problems.',
  },
  {
    icon: '🏥',
    title: 'Medical physics and radiology',
    description:
      'Calculate radiotracer activity at time of administration vs. imaging, and determine when radioactive waste from medical procedures reaches safe levels.',
  },
  {
    icon: '🌍',
    title: 'Archaeology and geology',
    description:
      'Understand the mathematics behind radiocarbon dating and radiometric age dating using isotopes like U-238 and K-40.',
  },
  {
    icon: '💊',
    title: 'Pharmacokinetics',
    description:
      'Apply the half-life concept to drug concentration: how long until a dose drops below therapeutic levels or clears the system entirely.',
  },
  {
    icon: '☢️',
    title: 'Nuclear engineering and safety',
    description:
      'Calculate how long radioactive waste remains above safe background levels and model reactor fuel consumption over time.',
  },
];

const QUICK_REF = [
  {
    input: 'N₀ (initial quantity)',
    description: 'Starting amount (grams, atoms, Bq, etc.)',
    example: '100 g',
  },
  { input: 't (elapsed time)', description: 'Time that has passed', example: '5,730 years' },
  { input: 't½ (half-life)', description: 'Time for half to decay', example: '5,730 years (C-14)' },
  { input: 'N(t) (remaining)', description: 'N₀ × (1/2)^(t/t½)', example: '100 × 0.5¹ = 50 g' },
  { input: 'n (number of half-lives)', description: 'n = t / t½', example: '5,730/5,730 = 1' },
  { input: 'Fraction remaining', description: '(1/2)ⁿ', example: '(0.5)¹ = 50%' },
  {
    input: 'Decay constant (λ)',
    description: 'λ = ln(2) / t½ ≈ 0.6931 / t½',
    example: '0.6931/5730 = 0.000121/yr',
  },
];

const RELATED = [
  {
    icon: '🔢',
    name: 'Log Calculator',
    slug: 'log-calculator',
    description: 'Logarithms (used in decay formulas)',
  },
  {
    icon: '🔢',
    name: 'Exponent Calculator',
    slug: 'exponent-calculator',
    description: 'Powers and roots',
  },
  {
    icon: '📊',
    name: 'Percent Error Calculator',
    slug: 'percent-error-calculator',
    description: 'Quantify measurement accuracy',
  },
  {
    icon: '📊',
    name: 'Statistics Calculator',
    slug: 'statistics-calculator',
    description: 'Mean, median, mode, variance',
  },
  {
    icon: '🔬',
    name: 'Scientific Calculator',
    slug: 'scientific-calculator',
    description: 'Full scientific calculator',
  },
];

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Half-Life Calculator',
    description:
      'Free radioactive decay and half-life calculator. Computes remaining quantity, elapsed half-lives, and decay constant.',
    url: 'https://roughtools.com/tools/calculators/half-life-calculator',
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
        name: 'Half-Life Calculator',
        item: 'https://roughtools.com/tools/calculators/half-life-calculator',
      },
    ],
  },
];

export default function HalfLifeCalculatorPage() {
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
          <span style={{ color: 'var(--brand)' }}>Half-Life Calculator</span>
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
          ⚛️
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
          Free Half-Life Calculator
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
          Calculate the remaining quantity of a radioactive substance after any elapsed time,
          determine the number of half-lives that have passed, or find the half-life from decay
          measurements. Free, private — all calculations run in your browser.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
          {[
            '⚡ Instant results',
            '🔒 100% private',
            '🆓 Always free',
            '🚫 No signup',
            '⚛️ Nuclear-grade precision',
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
        <HalfLifeCalculatorClient />
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
            About This Half-Life Calculator
          </h2>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The Half-Life Calculator models exponential radioactive decay — one of nature&apos;s
            most precise and reliable processes. Given the initial quantity, elapsed time, and
            half-life of a substance, it calculates how much remains. It can also solve backwards:
            given initial and final quantities, it determines the number of half-lives elapsed and
            the total time.
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
              'N(t) = N₀ × (1/2)^(t / t½)\nEquivalently: N(t) = N₀ × e^(−λt)  where λ = ln(2)/t½\nHalf-lives elapsed: n = t / t½\nFraction remaining: (1/2)ⁿ = e^(−λt)'
            }
          </div>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            Half-life is a constant property of each radioactive isotope — it does not change with
            temperature, pressure, or chemical state. This constancy makes radioactive decay the
            basis of highly reliable dating methods in archaeology (radiocarbon dating) and geology
            (uranium-lead, potassium-argon dating).
          </p>
          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--brand-2)',
              margin: '20px 0 10px',
            }}
          >
            Notable Half-Lives
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
              'Carbon-14 (C-14): 5,730 years — used for archaeological dating',
              'Uranium-235 (U-235): 703,800,000 years — nuclear reactor fuel',
              'Iodine-131 (I-131): 8.02 days — medical imaging and thyroid treatment',
              'Radium-226 (Ra-226): 1,600 years — historical radiotherapy source',
              'Polonium-210 (Po-210): 138 days — high toxicity; historically in poisoning cases',
              'Tritium (H-3): 12.32 years — used in luminescent watch dials and fusion research',
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
          toolName="Half-Life Calculator"
          toolSlug="half-life-calculator"
          toolUrl="https://roughtools.com/tools/calculators/half-life-calculator"
          type="general"
        />
        <ToolAdUnit position="bottom" />
      </div>
    </>
  );
}
