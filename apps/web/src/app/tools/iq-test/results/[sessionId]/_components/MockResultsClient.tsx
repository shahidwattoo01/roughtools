'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { MockResult, MockDomainScore } from '../../../_lib/mock-data'

const DOMAIN_LABELS: Record<string, string> = {
  FLUID_REASONING: 'Fluid Reasoning',
  CRYSTALLIZED_INTELLIGENCE: 'Crystallized Intelligence',
  QUANTITATIVE_REASONING: 'Quantitative Reasoning',
  SPATIAL_REASONING: 'Spatial Reasoning',
  WORKING_MEMORY: 'Working Memory',
  PROCESSING_SPEED: 'Processing Speed',
}

const CLASS_COLORS: Record<string, string> = {
  'Very Superior': '#7c3aed', Superior: '#2563eb', 'High Average': '#0891b2',
  Average: '#059669', 'Low Average': '#d97706', Borderline: '#dc2626', 'Extremely Low': '#9f1239',
}

function ScoreHero({ result }: { result: MockResult }) {
  const color = CLASS_COLORS[result.classification] ?? '#059669'
  return (
    <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-black/8 dark:border-white/8 p-8 text-center">
      <p className="text-[11px] font-medium tracking-[0.08em] uppercase text-[#555] dark:text-[#aaa] mb-4">Your IQ Score</p>
      <div className="text-[72px] font-semibold leading-none mb-2" style={{ color }}>
        {result.iqScore}
      </div>
      <div className="inline-block text-sm font-medium px-3 py-1 rounded-full mb-3"
        style={{ background: `${color}18`, color }}>
        {result.classification}
      </div>
      <p className="text-[13px] text-[#555] dark:text-[#aaa]">
        95% confidence interval:{' '}
        <strong className="text-[#1a1a1a] dark:text-[#f0f0f0]">
          {result.confidenceLower}–{result.confidenceUpper}
        </strong>
      </p>
    </div>
  )
}

function PercentileBar({ percentile }: { percentile: number }) {
  return (
    <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-black/8 dark:border-white/8 p-6">
      <h3 className="text-sm font-semibold mb-4">Population Percentile</h3>
      <div className="relative h-4 bg-black/8 dark:bg-white/8 rounded-full overflow-hidden mb-3">
        <div className="absolute left-0 top-0 h-full rounded-full bg-[#a21caf]"
          style={{ width: `${percentile}%` }} />
      </div>
      <div className="flex justify-between text-[11px] text-[#555] dark:text-[#aaa]">
        <span>0th</span>
        <span className="font-medium text-[#a21caf] dark:text-[#e879f9]">
          {percentile}th percentile — higher than {percentile}% of people
        </span>
        <span>100th</span>
      </div>
    </div>
  )
}

function BellCurve({ iqScore }: { iqScore: number }) {
  const W = 560; const H = 140; const mean = 100; const sd = 15
  const xToSvg = (iq: number) => ((iq - (mean - 4 * sd)) / (8 * sd)) * W
  const gaussian = (x: number) => Math.exp(-0.5 * ((x - mean) / sd) ** 2)
  const pts: string[] = []
  for (let iq = mean - 4 * sd; iq <= mean + 4 * sd; iq += 0.5)
    pts.push(`${xToSvg(iq)},${H - gaussian(iq) * (H - 20) - 10}`)
  const scorePx = xToSvg(iqScore)
  const scorePy = H - gaussian(iqScore) * (H - 20) - 10
  return (
    <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-black/8 dark:border-white/8 p-6">
      <h3 className="text-sm font-semibold mb-4">Score Distribution</h3>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H + 24}`} className="w-full max-w-[560px] mx-auto" aria-hidden="true">
          {[1, 2, 3].map((n) => (
            <rect key={n} x={xToSvg(mean - n * sd)} y={10}
              width={xToSvg(mean + n * sd) - xToSvg(mean - n * sd)}
              height={H - 10} fill="#a21caf" opacity={0.07 + (3 - n) * 0.04} rx={2} />
          ))}
          <path d={`M ${pts.join(' L ')}`} fill="none" stroke="#a21caf" strokeWidth={2} />
          <line x1={scorePx} y1={scorePy} x2={scorePx} y2={H} stroke="#a21caf" strokeWidth={2} strokeDasharray="4 3" />
          <circle cx={scorePx} cy={scorePy} r={5} fill="#a21caf" />
          <text x={scorePx} y={H + 18} textAnchor="middle" fontSize={11} fill="#a21caf" fontWeight="600">{iqScore}</text>
          {[70, 85, 100, 115, 130].map((v) => (
            <text key={v} x={xToSvg(v)} y={H + 18} textAnchor="middle" fontSize={9} fill="#999">{v}</text>
          ))}
        </svg>
      </div>
    </div>
  )
}

function DomainCards({ domains }: { domains: MockDomainScore[] }) {
  return (
    <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-black/8 dark:border-white/8 p-6">
      <div className="flex items-center justify-between gap-3 mb-5">
        <h3 className="text-sm font-semibold">Cognitive Domain Profile</h3>
      </div>
      <div className="flex flex-col gap-4 mb-6">
        {domains.map((d) => (
          <div key={d.domain} className="flex items-center gap-3">
            <span className="text-[12px] text-[#374151] dark:text-[#ccc] w-44 flex-shrink-0">
              {DOMAIN_LABELS[d.domain] ?? d.domain}
            </span>
            <div className="flex-1 h-2 bg-black/8 dark:bg-white/8 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-[#a21caf] transition-all duration-700"
                style={{ width: `${Math.round(d.efficiency * 100)}%` }} />
            </div>
            <span className="text-[11px] font-medium text-[#a21caf] dark:text-[#e879f9] w-12 text-right flex-shrink-0">
              {d.band}
            </span>
          </div>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 gap-3 mt-4">
        {domains.map((d) => (
          <div key={d.domain} className="bg-[#fafafa] dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5 p-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[13px] font-medium">{DOMAIN_LABELS[d.domain] ?? d.domain}</span>
              <span className="text-[10px] bg-[#f3f4f6] dark:bg-white/5 text-[#555] dark:text-[#aaa] px-2 py-0.5 rounded-full font-medium">
                {d.band}
              </span>
            </div>
            <div className="h-1.5 bg-black/8 dark:bg-white/8 rounded-full overflow-hidden mb-2">
              <div className="h-full rounded-full bg-[#a21caf]" style={{ width: `${Math.round(d.efficiency * 100)}%` }} />
            </div>
            <p className="text-[12px] text-[#555] dark:text-[#aaa] leading-[1.55]">{d.interpretation}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function MockResultsClient({ sessionId }: { sessionId: string }) {
  const [result, setResult] = useState<MockResult | null>(null)
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    const raw = sessionStorage.getItem(`mock-result-${sessionId}`)
    if (!raw) { setMissing(true); return }
    try { setResult(JSON.parse(raw) as MockResult) } catch { setMissing(true) }
  }, [sessionId])

  if (missing) {
    return (
      <div className="bg-[#f5f5f3] dark:bg-[#121212] min-h-screen flex items-center justify-center px-4">
        <div className="max-w-[480px] w-full bg-white dark:bg-[#1e1e1e] rounded-2xl border border-black/8 dark:border-white/8 p-8 text-center">
          <div className="text-4xl mb-4">⏱</div>
          <h2 className="text-lg font-semibold mb-2">Session results not found</h2>
          <p className="text-[13px] text-[#555] dark:text-[#aaa] mb-6 leading-[1.65]">
            Your test results are stored temporarily in your browser. They may have expired or you may have navigated here directly.
          </p>
          <Link href="/tools/iq-test"
            className="inline-block bg-[#a21caf] hover:bg-[#86198f] text-white rounded-lg px-6 py-2.5 text-sm font-medium transition-colors">
            Take the IQ Test
          </Link>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="bg-[#f5f5f3] dark:bg-[#121212] min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#a21caf] border-t-transparent rounded-full animate-spin" />
          <p className="text-[13px] text-[#555] dark:text-[#aaa]">Loading your results…</p>
        </div>
      </div>
    )
  }

  const domains = Object.values(result.domainScores ?? {})

  if (!result.isValid) {
    return (
      <div className="bg-[#f5f5f3] dark:bg-[#121212] min-h-screen flex items-center justify-center px-4">
        <div className="max-w-[480px] w-full bg-white dark:bg-[#1e1e1e] rounded-2xl border border-black/8 dark:border-white/8 p-8 text-center">
          <div className="text-3xl mb-4">⚠️</div>
          <h2 className="text-lg font-semibold mb-2">Session could not be scored</h2>
          <p className="text-[13px] text-[#555] dark:text-[#aaa] mb-4 leading-[1.65]">
            Not enough questions were answered to generate a valid IQ estimate.
          </p>
          <ul className="text-[12px] text-[#dc2626] mb-6 space-y-1">
            {result.invalidityFlags.map((f) => <li key={f}>• {f.replace(/_/g, ' ')}</li>)}
          </ul>
          <Link href="/tools/iq-test" className="text-sm text-[#a21caf] hover:underline">← Return to IQ Test</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#f5f5f3] dark:bg-[#121212] min-h-screen">
      <div className="max-w-[720px] mx-auto px-4 py-10 space-y-5">

        <nav className="text-[12px] text-[#555] dark:text-[#aaa] flex gap-2">
          <Link href="/" className="hover:text-[#a21caf]">Home</Link><span>/</span>
          <Link href="/tools/iq-test" className="hover:text-[#a21caf]">IQ Test</Link><span>/</span>
          <span>Results</span>
        </nav>

        <ScoreHero result={result} />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Percentile', value: `${result.percentile}th` },
            { label: 'Age group', value: result.ageGroup },
            { label: 'Questions', value: String(result.questionCount) },
            { label: 'Validity', value: result.isValid ? 'Valid ✓' : 'Invalid ✗' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-black/8 dark:border-white/8 p-4 text-center">
              <div className="text-lg font-semibold text-[#a21caf] dark:text-[#e879f9]">{value}</div>
              <div className="text-[11px] text-[#555] dark:text-[#aaa] mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        <PercentileBar percentile={result.percentile} />
        <BellCurve iqScore={result.iqScore} />

        {domains.length > 0 && <DomainCards domains={domains} />}

        <div className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-black/8 dark:border-white/8 p-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-[13px] font-medium">Want to retake the test?</p>
            <p className="text-[12px] text-[#555] dark:text-[#aaa] mt-0.5">Try again for a different set of questions.</p>
          </div>
          <Link href="/tools/iq-test"
            className="border border-black/10 dark:border-white/15 rounded-lg px-4 py-2 text-sm font-medium hover:border-[#a21caf] hover:text-[#a21caf] transition-colors flex-shrink-0">
            Back to test
          </Link>
        </div>

        <p className="text-[11px] text-[#555] dark:text-[#aaa] text-center leading-[1.6] pb-4">
          Self-assessment only — not a clinical diagnosis. · Norms: {result.normingVersion}
        </p>
      </div>
    </div>
  )
}
