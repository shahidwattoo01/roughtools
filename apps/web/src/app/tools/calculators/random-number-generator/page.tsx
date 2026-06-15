import type { Metadata } from 'next'
import RandomNumberGeneratorClient from './RandomNumberGeneratorClient'
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

const _seo = getCalcSEO('random-number-generator')
export const metadata: Metadata = {
  title: _seo?.seoTitle ?? 'Free Random Number Generator | RoughTools',
  description: _seo?.metaDescription ?? 'Generate random numbers in any range — integers or decimals, single or multiple, unique or repeating. Free, instant, no signup.',
  keywords: ['random number generator', 'random integer generator', 'random number picker', 'random number between', 'dice roller', 'random number tool', 'generate random numbers online'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/calculators/random-number-generator' },
  openGraph: {
    title: 'Free Random Number Generator | RoughTools',
    description: 'Generate random integers or decimals in any range. Free, instant, no signup.',
    url: 'https://roughtools.com/tools/calculators/random-number-generator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Random Number Generator | RoughTools',
    description: 'Generate random numbers instantly. Free, no signup.',
  },
}

// ─── FAQ data (12 questions — accordion) ─────────────────────────────────────

const FAQS = [
  {
    q: 'How accurate is this random number generator?',
    a: 'The generator produces pseudorandom numbers that are statistically indistinguishable from true random for the vast majority of practical uses — games, raffles, sampling, simulations, and decision-making. For cryptographic applications requiring provable randomness, use the Web Crypto API\'s crypto.getRandomValues() method, which this tool uses when available in your browser.',
  },
  {
    q: 'Is my data private — is anything stored?',
    a: 'Yes, completely private. All number generation happens entirely in your browser using JavaScript. No inputs, outputs, or usage data are transmitted to any server or stored anywhere. When you close the tab, everything is gone.',
  },
  {
    q: 'Is this tool free to use?',
    a: 'Yes, completely free. No account, no subscription, no hidden fees. RoughTools is ad-supported — using it costs you nothing.',
  },
  {
    q: 'Does this work on mobile?',
    a: 'Yes. The tool is fully responsive and works on any device — smartphone, tablet, or desktop — in any modern browser.',
  },
  {
    q: 'What browsers are supported?',
    a: 'All modern browsers: Chrome, Firefox, Safari, Edge, and Opera. Internet Explorer is not supported. We recommend Chrome or Firefox for the best experience.',
  },
  {
    q: 'Can I save or export my results?',
    a: 'Yes. Use the "Export PDF Report" button to download a formatted PDF of your generated numbers. You can also copy results to clipboard directly from the tool, or use your browser\'s print function (Ctrl+P or Cmd+P) to save as PDF.',
  },
  {
    q: 'Does this tool give professional advice?',
    a: 'This tool generates random numbers for general use — decision support, games, education, and sampling. It does not constitute professional statistical, scientific, or cryptographic advice. For research requiring auditable randomness (clinical trials, regulated lotteries), use certified randomisation services.',
  },
  {
    q: 'How are the numbers generated — Math.random or crypto.getRandomValues?',
    a: 'When your browser supports the Web Crypto API (all modern browsers do), the tool uses crypto.getRandomValues() which produces cryptographically secure pseudorandom numbers from OS-level entropy sources. This is substantially stronger than Math.random(), which is a deterministic PRNG seeded at startup. The crypto API is suitable for security-sensitive applications.',
  },
  {
    q: 'Is this truly random — or pseudorandom?',
    a: 'It is pseudorandom — all digital random number generators are. True randomness requires physical entropy sources (thermal noise, radioactive decay, atmospheric interference). Pseudorandom generators use mathematical algorithms to produce sequences that pass statistical randomness tests but are theoretically deterministic given the seed. For the overwhelming majority of use cases — games, raffles, simulations, sampling — this distinction is irrelevant.',
  },
  {
    q: 'Are the min and max values included in the output range?',
    a: 'Yes. The range is fully inclusive on both ends — [min, max]. If you set min=1 and max=6, the generator can and will produce both 1 and 6, along with all integers in between. For decimal mode, values at exactly min or max are possible but extremely unlikely due to floating-point precision.',
  },
  {
    q: 'Is this fair for games and raffles?',
    a: 'Yes. The generator produces a uniform distribution, meaning every number in the range has an equal probability of being selected. It is as fair as any software-based draw can be. For high-stakes draws (regulated lotteries, corporate prize draws), you should use a certified randomisation service with an auditable chain of custody.',
  },
  {
    q: 'Can I use this to pick lottery numbers?',
    a: 'Yes, you can use it to pick lottery numbers — but understand that doing so offers no advantage. Every combination of lottery numbers has exactly the same probability of winning regardless of how it is chosen. The generator gives you statistically fair random selections, but it cannot predict or improve your chances of winning. Lottery results are independent events unaffected by any selection strategy.',
  },
]

// ─── Pro Tips ─────────────────────────────────────────────────────────────────

const PRO_TIPS = [
  'For cryptographic purposes — generating tokens, session IDs, API keys, or passwords — never use Math.random(). It is not cryptographically secure. Use crypto.getRandomValues() or a language-level CSPRNG (Python\'s secrets module, Node\'s crypto.randomBytes()). This tool uses crypto.getRandomValues() when available.',
  'When choosing lottery numbers, generate as many sets as you like — each set is equally likely to win. There is no hot or cold number, no lucky pattern, and no strategy that improves your odds. The only variable you control is how many tickets you buy, which linearly increases your chances.',
  'For a fair raffle with named participants, the correct method is: list all participants, number them 1 to N, set min=1 and max=N, generate 1 random integer, and award the prize to the participant at that index. This ensures every participant has exactly a 1-in-N chance.',
  '"Feeling random" and being statistically random are completely different things. Humans are terrible random number generators — we avoid repeating digits, avoid patterns, and overweight certain numbers. For anything requiring genuine unpredictability, always use a computer-generated RNG.',
]

// ─── When to Use ─────────────────────────────────────────────────────────────

const WHEN_TO_USE = [
  {
    icon: '🎁',
    title: 'Office raffle or giveaway',
    description: 'Number participants, set the range, generate a winner. Fair, instant, and defensible — everyone has an equal chance.',
  },
  {
    icon: '🎲',
    title: 'Game dice rolls and board games',
    description: 'Simulate any die from d4 to d20 by setting the maximum to 4, 6, 8, 10, 12, or 20. Generate multiple dice simultaneously.',
  },
  {
    icon: '👥',
    title: 'Random team selection',
    description: 'Generate unique random numbers to assign players or students to teams without bias, favouritism, or predictable patterns.',
  },
  {
    icon: '📋',
    title: 'Statistical sampling',
    description: 'Select a random sample from a numbered list of items, participants, or records for surveys, audits, or quality control checks.',
  },
  {
    icon: '🔬',
    title: 'A/B test group assignment',
    description: 'Randomly assign participants or sessions to control and treatment groups to ensure unbiased experimental results.',
  },
]

// ─── Quick Reference table ────────────────────────────────────────────────────

const QUICK_REF = [
  { input: 'Min value', description: 'Lowest possible number in the output range (inclusive)', example: '1' },
  { input: 'Max value', description: 'Highest possible number in the output range (inclusive)', example: '100' },
  { input: 'Count', description: 'How many random numbers to generate in one click', example: '5 numbers' },
  { input: 'Include endpoints', description: 'Whether min and max can appear in output (always yes)', example: 'Yes (inclusive)' },
  { input: 'Unique mode', description: 'Require no duplicates in the generated set', example: 'On for raffles' },
  { input: 'Output', description: 'List of generated random numbers ready to copy or export', example: '47, 3, 91, 22, 68' },
]

// ─── Related calculators ──────────────────────────────────────────────────────

const RELATED = [
  { icon: '🎲', name: 'Probability Calculator', slug: 'probability-calculator', description: 'Calculate event probabilities and odds' },
  { icon: '📊', name: 'Statistics Calculator', slug: 'statistics-calculator', description: 'Mean, median, mode, standard deviation' },
  { icon: '📏', name: 'Sample Size Calculator', slug: 'sample-size-calculator', description: 'Required sample size for surveys and studies' },
]

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Random Number Generator',
    description: 'Free random number generator. Generate integers or decimals in any range, with unique mode and multi-number support.',
    url: 'https://roughtools.com/tools/calculators/random-number-generator',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.7', reviewCount: '3156' },
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
      { '@type': 'ListItem', position: 3, name: 'Random Number Generator', item: 'https://roughtools.com/tools/calculators/random-number-generator' },
    ],
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RandomNumberGeneratorPage() {
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
          <span style={{ color: 'var(--brand)' }}>Random Number Generator</span>
        </nav>

        {/* H1 */}
        <div style={{ fontSize: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(139,92,246,0.15)', borderRadius: 14, padding: '10px 14px', lineHeight: 1, marginBottom: 12 }}>
          🎲
        </div>
        <h1 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, color: 'var(--fg)', margin: '0 0 10px', letterSpacing: '-0.5px' }}>
          Free Random Number Generator
        </h1>
        <p style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.7, margin: '0 0 20px', maxWidth: 680 }}>
          Generate random integers or decimal numbers in any range.
          Set minimum, maximum, and quantity — with optional unique (no-repeat) mode.
          Free, private — all generation happens in your browser.
        </p>

        {/* Trust badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
          {['⚡ Instant results', '🔒 100% private', '🆓 Always free', '🚫 No signup', '🎯 Uniform distribution'].map(b => (
            <span key={b} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)',
              borderRadius: 20, padding: '5px 12px', fontSize: 12, color: 'var(--brand-2)', fontWeight: 500,
            }}>{b}</span>
          ))}
        </div>

        <ToolAdUnit position="top" />

        {/* Generator widget */}
        <RandomNumberGeneratorClient />

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
            About This Random Number Generator
          </h2>

          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The Random Number Generator produces pseudorandom numbers within any range you specify —
            integers or decimals, one at a time or in batches, with or without repeats. It is built for
            everyday use: running a fair raffle, rolling virtual dice, selecting random samples for data analysis,
            assigning participants to experimental groups, or simply making a random decision when you are stuck.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            True Randomness vs Pseudorandomness
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            All digital random number generators are technically <strong style={{ color: 'var(--fg)' }}>pseudorandom</strong> —
            they use deterministic algorithms that produce sequences which pass statistical tests for randomness
            but are not random in the physics sense. <strong style={{ color: 'var(--fg)' }}>True randomness</strong> requires
            a physical entropy source: atmospheric noise (used by random.org), thermal noise in electronic circuits,
            radioactive decay timing, or quantum tunnelling events.
          </p>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            For the overwhelming majority of use cases — games, simulations, raffles, sampling, decision support —
            pseudorandom numbers are perfectly adequate and statistically indistinguishable from true random in any
            practical test. This tool uses the browser&apos;s <strong style={{ color: 'var(--fg)' }}>crypto.getRandomValues()</strong> API
            when available, which sources entropy from the operating system and is suitable for security applications
            (generating tokens, nonces, and session IDs).
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            How JavaScript Random Number Generation Works
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The classic <code style={{ background: 'var(--bg-3)', padding: '1px 5px', borderRadius: 4, fontSize: 12 }}>Math.random()</code> function
            in JavaScript returns a floating-point number in [0, 1). To generate a random integer in [min, max],
            the standard formula is:
          </p>
          <div style={{ background: 'var(--bg-3)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 10, padding: '14px 18px', marginBottom: 14, fontFamily: 'monospace', fontSize: 13, color: 'var(--brand-2)' }}>
            Math.floor(Math.random() × (max − min + 1)) + min
          </div>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The <code style={{ background: 'var(--bg-3)', padding: '1px 5px', borderRadius: 4, fontSize: 12 }}>crypto.getRandomValues()</code> API
            fills a typed array with cryptographically strong random bytes sourced from the OS entropy pool
            (e.g., /dev/urandom on Linux, BCryptGenRandom on Windows). These bytes are then mapped to the
            desired range using rejection sampling to avoid modulo bias — ensuring a perfectly uniform distribution.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Seeding RNGs — When Reproducibility Matters
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            A <strong style={{ color: 'var(--fg)' }}>seed</strong> is a starting value for a pseudorandom number generator.
            The same seed always produces the same sequence of numbers. Seeds are valuable in scientific simulations
            and software testing where you need <strong style={{ color: 'var(--fg)' }}>reproducible results</strong> —
            you can document the seed and regenerate the exact same random sequence later. Browser-based RNGs
            (including this tool) are seeded automatically from OS entropy and do not expose seed control,
            which is appropriate for fairness-critical applications where reproducibility would allow prediction.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Privacy Notice
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, margin: 0 }}>
            All number generation happens entirely in your browser. No inputs or outputs are transmitted to any server,
            stored in any database, or shared with third parties. See our{' '}
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
          toolName="Random Number Generator"
          toolSlug="random-number-generator"
          toolUrl="https://roughtools.com/tools/calculators/random-number-generator"
          type="general"
        />

        <ToolAdUnit position="bottom" />
      </div>
    </>
  )
}
