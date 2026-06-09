import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/JsonLd'

const SITE      = 'https://roughtools.com'
const CANONICAL = `${SITE}/tools/iq-test`

export const metadata: Metadata = {
  title: 'Free IQ Test Online — Adaptive Cognitive Assessment | Roughtools',
  description:
    'Take a free adaptive IQ test online. Get your IQ score, percentile, and a full cognitive profile across 6 domains in 40–50 questions. Science-backed methodology.',
  keywords: [
    'free iq test online', 'adaptive iq test', 'iq score online', 'cognitive assessment',
    'intelligence test', 'iq test free', 'professional iq test', 'iq percentile',
    'fluid reasoning test', 'working memory test', 'cognitive ability test',
  ],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'Free IQ Test — Adaptive Cognitive Assessment | Roughtools',
    description: 'Get your IQ score and full cognitive profile. Adaptive 40–50 question test, science-backed methodology.',
    url: CANONICAL, type: 'website', siteName: 'Roughtools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free IQ Test Online | Roughtools',
    description: 'Adaptive IQ test across 6 cognitive domains. Get your score, percentile & cognitive profile.',
  },
}

const schemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Free IQ Test Online — Adaptive Cognitive Assessment',
    url: CANONICAL,
    description: 'Free adaptive IQ test measuring fluid reasoning, crystallized intelligence, working memory, spatial reasoning, processing speed, and quantitative reasoning.',
    provider: { '@type': 'Organization', name: 'Roughtools', url: SITE },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',    item: SITE },
      { '@type': 'ListItem', position: 2, name: 'IQ Test', item: CANONICAL },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How accurate is this IQ test?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'This test uses computerized adaptive testing (CAT) with Item Response Theory scoring, the same methodology used in professional cognitive assessments. Reliability exceeds 0.90 on a 50-question adaptive test. Results should be interpreted as a self-assessment tool, not a clinical diagnosis.',
        },
      },
      {
        '@type': 'Question',
        name: 'How long does the IQ test take?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The test adapts to your ability level and typically contains 40–50 questions. Most people complete it in 25–40 minutes. You get two pauses and can take as long as you need per question within the per-question time limit.',
        },
      },
      {
        '@type': 'Question',
        name: 'What does the test measure?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The test measures six cognitive domains: Fluid Reasoning, Crystallized Intelligence, Quantitative Reasoning, Spatial Reasoning, Working Memory, and Processing Speed. These are the primary factors identified in psychometric research on human intelligence.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is the test really free?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Your IQ score, percentile, and basic results are completely free. A premium option unlocks the full domain radar chart, all six domain insight cards, and a downloadable PDF report.',
        },
      },
    ],
  },
]

const DOMAINS = [
  { name: 'Fluid Reasoning',          icon: '🧩', desc: 'Solve novel problems without prior knowledge. Pattern detection and logical deduction.',        weight: '25%' },
  { name: 'Quantitative Reasoning',   icon: '📐', desc: 'Number series, arithmetic patterns, and mathematical logic under timed conditions.',            weight: '20%' },
  { name: 'Crystallized Intelligence',icon: '📚', desc: 'Verbal analogies, word relationships, and knowledge accumulated through experience.',            weight: '18%' },
  { name: 'Spatial Reasoning',        icon: '🔷', desc: 'Mentally rotate and manipulate 3-D objects. Visualise shapes and transformations.',              weight: '15%' },
  { name: 'Working Memory',           icon: '🧠', desc: 'Hold and manipulate sequences of digits and symbols in short-term memory.',                      weight: '12%' },
  { name: 'Processing Speed',         icon: '⚡', desc: 'Quickly and accurately complete simple cognitive tasks. Reaction time and mental agility.',       weight: '10%' },
]

const IQ_BANDS = [
  { range: '130+',     label: 'Very Superior',    pct: '2.2%',  color: '#7c3aed' },
  { range: '120–129',  label: 'Superior',         pct: '6.7%',  color: '#2563eb' },
  { range: '110–119',  label: 'High Average',     pct: '16.1%', color: '#0891b2' },
  { range: '90–109',   label: 'Average',          pct: '50.0%', color: '#059669' },
  { range: '80–89',    label: 'Low Average',      pct: '16.1%', color: '#d97706' },
  { range: '70–79',    label: 'Borderline',       pct: '6.7%',  color: '#dc2626' },
  { range: '55–69',    label: 'Extremely Low',    pct: '2.2%',  color: '#9f1239' },
]

const STEPS = [
  { n: 1, title: 'Select your age group',    body: 'Age-adjusted norms ensure your score is compared fairly to peers in your demographic.' },
  { n: 2, title: 'Answer adaptive questions', body: 'The test adapts in real time. Each question is chosen to maximise scoring accuracy at your current estimated ability.' },
  { n: 3, title: 'Get your cognitive profile', body: 'Receive your IQ score, percentile, confidence interval, and a breakdown across all six cognitive domains.' },
]

const FAQ = [
  {
    q: 'How is this different from other free IQ tests?',
    a: 'Most free IQ tests use fixed question sets and simple percentage scoring. This test uses Computerized Adaptive Testing (CAT) with Item Response Theory — the same technique used by major standardised assessments like the GRE and GMAT — so every question is chosen to be maximally informative for your specific ability level.',
  },
  {
    q: 'Can I retake the test?',
    a: 'Yes, but a 24-hour cooldown applies between attempts. This prevents score inflation from repeated practice and preserves the validity of your result.',
  },
  {
    q: 'Should I prepare for the test?',
    a: "No. The test is designed to measure natural cognitive ability, not acquired knowledge. Cramming IQ-style questions can temporarily inflate scores without reflecting genuine ability. Take it rested and without distractions for the most accurate result.",
  },
  {
    q: 'Is my data private?',
    a: 'Anonymous sessions are fully supported — no account required. If you take the test without signing in, no personally identifiable data is stored beyond a hashed session token. IP addresses are hashed before storage.',
  },
  {
    q: 'What is a good IQ score?',
    a: 'The average IQ is 100 by definition. Scores between 90–110 are within the "Average" range and describe about 50% of the population. A score of 120+ is "Superior" (top ~9%), and 130+ is "Very Superior" (top ~2%).',
  },
]

export default function IqTestLandingPage() {
  return (
    <>
      <JsonLd data={schemas} />

      <div className="bg-[#f5f5f3] dark:bg-[#121212] min-h-screen text-[#1a1a1a] dark:text-[#f0f0f0]">

        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="max-w-[860px] mx-auto px-6 pt-14 pb-10">
          <div className="inline-flex items-center gap-1.5 bg-[#fdf4ff] dark:bg-[#a21caf]/15 text-[#a21caf] dark:text-[#e879f9] rounded-full px-3.5 py-1.5 text-[13px] mb-5">
            <span aria-hidden="true">🧠</span>
            Adaptive · Science-backed · Free
          </div>

          <h1 className="text-[40px] font-medium leading-[1.15] mb-4 max-w-[620px]">
            Free IQ Test —<br />
            <em className="not-italic text-[#a21caf] dark:text-[#e879f9]">Adaptive Cognitive Assessment</em>
          </h1>

          <p className="text-base text-[#555] dark:text-[#aaa] max-w-[560px] mb-8 leading-[1.65]">
            40–50 adaptive questions across 6 cognitive domains. Powered by Item Response Theory
            for clinically meaningful accuracy. Get your IQ score, percentile, and full cognitive
            profile — completely free.
          </p>

          <div className="flex gap-3 flex-wrap mb-10">
            <Link
              href="/tools/iq-test/session"
              className="inline-flex items-center gap-2 bg-[#a21caf] hover:bg-[#86198f] text-white rounded-lg px-6 py-3 text-sm font-medium transition-colors"
            >
              <span aria-hidden="true">▶</span>
              Start IQ Test — Free
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 border border-black/10 dark:border-white/15 text-[#1a1a1a] dark:text-[#f0f0f0] rounded-lg px-5 py-3 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              How it works
            </a>
          </div>

          {/* Stats bar */}
          <div className="flex gap-8 flex-wrap">
            {[
              { num: '40–50',  label: 'Adaptive questions' },
              { num: '6',      label: 'Cognitive domains' },
              { num: '25–40m', label: 'Average duration' },
              { num: '0.90+',  label: 'Test reliability (α)' },
            ].map(({ num, label }) => (
              <div key={label}>
                <div className="text-[24px] font-medium text-[#a21caf] dark:text-[#e879f9]">{num}</div>
                <div className="text-[12px] text-[#555] dark:text-[#aaa] mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────────────────────── */}
        <section id="how-it-works" className="max-w-[860px] mx-auto px-6 pb-12">
          <p className="text-[11px] font-medium tracking-[0.08em] uppercase text-[#555] dark:text-[#aaa] mb-5">
            How it works
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {STEPS.map(({ n, title, body }) => (
              <div
                key={n}
                className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-black/8 dark:border-white/8 p-5"
              >
                <div className="w-8 h-8 rounded-full bg-[#fdf4ff] dark:bg-[#a21caf]/15 text-[#a21caf] dark:text-[#e879f9] flex items-center justify-center text-sm font-semibold mb-4">
                  {n}
                </div>
                <h3 className="text-sm font-semibold mb-1.5">{title}</h3>
                <p className="text-[13px] text-[#555] dark:text-[#aaa] leading-[1.6]">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── COGNITIVE DOMAINS ────────────────────────────────── */}
        <section className="max-w-[860px] mx-auto px-6 pb-12">
          <p className="text-[11px] font-medium tracking-[0.08em] uppercase text-[#555] dark:text-[#aaa] mb-5">
            Six cognitive domains measured
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {DOMAINS.map(({ name, icon, desc, weight }) => (
              <div
                key={name}
                className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-black/8 dark:border-white/8 p-4"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xl" aria-hidden="true">{icon}</span>
                  <span className="text-[11px] font-medium text-[#a21caf] dark:text-[#e879f9] bg-[#fdf4ff] dark:bg-[#a21caf]/10 rounded-full px-2 py-0.5">
                    {weight} weight
                  </span>
                </div>
                <h3 className="text-[13px] font-semibold mb-1">{name}</h3>
                <p className="text-[12px] text-[#555] dark:text-[#aaa] leading-[1.55]">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── IQ CLASSIFICATION BANDS ──────────────────────────── */}
        <section className="max-w-[860px] mx-auto px-6 pb-12">
          <p className="text-[11px] font-medium tracking-[0.08em] uppercase text-[#555] dark:text-[#aaa] mb-5">
            IQ classification bands
          </p>
          <div className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-black/8 dark:border-white/8 overflow-hidden">
            {IQ_BANDS.map(({ range, label, pct, color }, i) => (
              <div
                key={range}
                className={`flex items-center gap-4 px-5 py-3.5 ${i < IQ_BANDS.length - 1 ? 'border-b border-black/5 dark:border-white/5' : ''}`}
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: color }}
                  aria-hidden="true"
                />
                <span className="text-sm font-medium w-20 flex-shrink-0">{range}</span>
                <span className="text-sm flex-1">{label}</span>
                <span className="text-xs text-[#555] dark:text-[#aaa]">{pct} of population</span>
              </div>
            ))}
          </div>
          <p className="text-[12px] text-[#555] dark:text-[#aaa] mt-3">
            IQ is normally distributed with mean 100 and standard deviation 15 (Wechsler scale).
          </p>
        </section>

        {/* ── WHAT YOU GET ─────────────────────────────────────── */}
        <section className="max-w-[860px] mx-auto px-6 pb-12">
          <p className="text-[11px] font-medium tracking-[0.08em] uppercase text-[#555] dark:text-[#aaa] mb-5">
            What you receive after completing the test
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { label: 'IQ Score',             desc: 'Your composite IQ on the Wechsler scale (mean 100, SD 15)',     free: true  },
              { label: 'Percentile Rank',      desc: 'Where you stand relative to the general population',           free: true  },
              { label: 'Confidence Interval',  desc: '95% confidence band (±5 points) around your score',            free: true  },
              { label: 'Classification Band',  desc: 'Your IQ band label (Average, High Average, Superior, etc.)',   free: true  },
              { label: 'Domain Radar Chart',   desc: 'Visual breakdown of all 6 cognitive domains',                  free: false },
              { label: 'Domain Insight Cards', desc: 'Personalised interpretation of each domain score',             free: false },
              { label: 'PDF Report',           desc: 'Printable 4-page professional assessment report',              free: false },
              { label: 'Score History',        desc: 'Track your cognitive profile over multiple attempts',          free: false },
            ].map(({ label, desc, free }) => (
              <div
                key={label}
                className="flex items-start gap-3 bg-white dark:bg-[#1e1e1e] rounded-xl border border-black/8 dark:border-white/8 p-4"
              >
                <span
                  className={`text-sm mt-0.5 flex-shrink-0 ${free ? 'text-[#059669]' : 'text-[#a21caf] dark:text-[#e879f9]'}`}
                  aria-label={free ? 'Free' : 'Premium'}
                >
                  {free ? '✓' : '★'}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-medium">{label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        free
                          ? 'bg-[#d1fae5] dark:bg-[#059669]/20 text-[#059669] dark:text-[#34d399]'
                          : 'bg-[#fdf4ff] dark:bg-[#a21caf]/15 text-[#a21caf] dark:text-[#e879f9]'
                      }`}
                    >
                      {free ? 'FREE' : 'PREMIUM'}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#555] dark:text-[#aaa] mt-0.5 leading-[1.5]">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── METHODOLOGY ──────────────────────────────────────── */}
        <section className="max-w-[860px] mx-auto px-6 pb-12">
          <div className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-black/8 dark:border-white/8 p-6">
            <h2 className="text-base font-semibold mb-3">Methodology</h2>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-[13px] text-[#555] dark:text-[#aaa] leading-[1.65]">
              <p>
                <strong className="text-[#1a1a1a] dark:text-[#f0f0f0]">Adaptive testing (CAT).</strong>{' '}
                Questions are selected in real time using Fisher Information maximisation over a 3-Parameter
                Logistic IRT model. Each question is the most discriminating one possible at your current
                estimated ability level.
              </p>
              <p>
                <strong className="text-[#1a1a1a] dark:text-[#f0f0f0]">Age-adjusted norms.</strong>{' '}
                Scores are normalised against population data for your age group (18–24, 25–34, 35–44,
                45–54, 55–64, 65+). This accounts for known lifespan differences in fluid vs crystallised
                intelligence.
              </p>
              <p>
                <strong className="text-[#1a1a1a] dark:text-[#f0f0f0]">Validity checks.</strong>{' '}
                Every session is screened for speed-clicking, chance responding, focus loss, and internal
                inconsistency. Invalid sessions are flagged rather than scored to preserve result integrity.
              </p>
              <p>
                <strong className="text-[#1a1a1a] dark:text-[#f0f0f0]">Self-assessment scope.</strong>{' '}
                This is a self-administered psychometric tool for personal insight. It is not a clinical
                diagnosis. If you have concerns about cognitive health, consult a qualified psychologist.
              </p>
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────── */}
        <section className="max-w-[860px] mx-auto px-6 pb-12">
          <p className="text-[11px] font-medium tracking-[0.08em] uppercase text-[#555] dark:text-[#aaa] mb-5">
            Frequently asked questions
          </p>
          <div className="space-y-3">
            {FAQ.map(({ q, a }) => (
              <details
                key={q}
                className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-black/8 dark:border-white/8 group"
              >
                <summary className="cursor-pointer px-5 py-4 text-sm font-medium list-none flex items-center justify-between gap-3">
                  {q}
                  <span className="text-[#a21caf] dark:text-[#e879f9] text-base flex-shrink-0 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="px-5 pb-4 text-[13px] text-[#555] dark:text-[#aaa] leading-[1.65]">{a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────── */}
        <section className="max-w-[860px] mx-auto px-6 pb-16">
          <div className="bg-[#a21caf] rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-semibold mb-2">Ready to find out your IQ?</h2>
            <p className="text-white/80 text-sm mb-6 max-w-[420px] mx-auto">
              Takes 25–40 minutes. No sign-up required. Your score is shown immediately.
            </p>
            <Link
              href="/tools/iq-test/session"
              className="inline-flex items-center gap-2 bg-white text-[#a21caf] rounded-lg px-7 py-3 text-sm font-semibold hover:bg-white/90 transition-colors"
            >
              Start Free IQ Test
            </Link>
          </div>
        </section>

      </div>
    </>
  )
}
