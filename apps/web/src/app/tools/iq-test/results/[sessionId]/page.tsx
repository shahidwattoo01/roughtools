import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ReportDownloadButton } from './_components/ReportDownloadButton'
import MockResultsClient from './_components/MockResultsClient'

function _iqClassification(iq: number): string {
  if (iq >= 130) return 'Very Superior'
  if (iq >= 120) return 'Superior'
  if (iq >= 110) return 'High Average'
  if (iq >= 90)  return 'Average'
  if (iq >= 80)  return 'Low Average'
  if (iq >= 70)  return 'Borderline'
  return 'Extremely Low'
}

export const revalidate = 60
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Your IQ Test Results | Roughtools',
  description: 'View your IQ score, percentile, and cognitive profile from the Roughtools adaptive IQ test.',
  robots: { index: false, follow: false },
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface DomainScore {
  domain: string
  label: string
  efficiency: number
  band: string
  interpretation: string
  percentileWithinDomain: number
}

interface IqResult {
  sessionId: string
  iqScore: number
  confidenceLower: number
  confidenceUpper: number
  percentile: number
  classification: string
  isValid: boolean
  invalidityFlags: string[]
  domainScores: Record<string, DomainScore>
  ageGroup: string
  questionCount: number
  completedAt: string | null
  normingVersion: string | null
  reportReady: boolean
  reportUrl: string | null
}

const DOMAIN_LABELS: Record<string, string> = {
  FLUID_REASONING:           'Fluid Reasoning',
  CRYSTALLIZED_INTELLIGENCE: 'Crystallized Intelligence',
  QUANTITATIVE_REASONING:    'Quantitative Reasoning',
  SPATIAL_REASONING:         'Spatial Reasoning',
  WORKING_MEMORY:            'Working Memory',
  PROCESSING_SPEED:          'Processing Speed',
}

// ─── Server-side data fetch ───────────────────────────────────────────────────

async function fetchResult(sessionId: string, token: string | null): Promise<IqResult | null> {
  if (!token) return null
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  try {
    const res = await fetch(`${base}/api/iq/results/${sessionId}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    return res.json() as Promise<IqResult>
  } catch {
    return null
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ScoreHero({ result }: { result: IqResult }) {
  const colorMap: Record<string, string> = {
    'Very Superior': '#7c3aed', Superior: '#2563eb', 'High Average': '#0891b2',
    Average: '#059669', 'Low Average': '#d97706', Borderline: '#dc2626', 'Extremely Low': '#9f1239',
  }
  const color = colorMap[result.classification] ?? '#059669'
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
          {[1,2,3].map((n) => (
            <rect key={n} x={xToSvg(mean - n * sd)} y={10}
              width={xToSvg(mean + n * sd) - xToSvg(mean - n * sd)}
              height={H - 10} fill="#a21caf" opacity={0.07 + (3 - n) * 0.04} rx={2} />
          ))}
          <path d={`M ${pts.join(' L ')}`} fill="none" stroke="#a21caf" strokeWidth={2} />
          <line x1={scorePx} y1={scorePy} x2={scorePx} y2={H} stroke="#a21caf" strokeWidth={2} strokeDasharray="4 3" />
          <circle cx={scorePx} cy={scorePy} r={5} fill="#a21caf" />
          <text x={scorePx} y={H + 18} textAnchor="middle" fontSize={11} fill="#a21caf" fontWeight="600">{iqScore}</text>
          {[70,85,100,115,130].map((v) => (
            <text key={v} x={xToSvg(v)} y={H + 18} textAnchor="middle" fontSize={9} fill="#999">{v}</text>
          ))}
        </svg>
      </div>
    </div>
  )
}

function DomainRadar({ domains }: { domains: DomainScore[] }) {
  const N = domains.length; const cx = 150; const cy = 150; const r = 110
  const angleStep = (2 * Math.PI) / N
  const getPoint = (i: number, pct: number) => {
    const angle = i * angleStep - Math.PI / 2
    const dist = (pct / 100) * r
    return { x: cx + dist * Math.cos(angle), y: cy + dist * Math.sin(angle) }
  }
  const dataPoints = domains.map((d, i) => getPoint(i, d.efficiency * 100))
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'
  return (
    <div className="flex flex-col sm:flex-row gap-6 items-center">
      <svg viewBox="0 0 300 300" className="w-[220px] flex-shrink-0" aria-hidden="true">
        {[25,50,75,100].map((lvl) =>
          domains.map((_, i) => {
            const p1 = getPoint(i, lvl); const p2 = getPoint((i + 1) % N, lvl)
            return <line key={`${lvl}-${i}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#e5e7eb" strokeWidth={1} />
          })
        )}
        {domains.map((_, i) => {
          const p = getPoint(i, 100)
          return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#e5e7eb" strokeWidth={1} />
        })}
        <path d={dataPath} fill="#a21caf" fillOpacity={0.15} stroke="#a21caf" strokeWidth={2} />
        {dataPoints.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={4} fill="#a21caf" />)}
        {domains.map((d, i) => {
          const p = getPoint(i, 125)
          return (
            <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" fontSize={8.5} fill="#666" fontWeight="500">
              {DOMAIN_LABELS[d.domain]?.split(' ').map((w, j) => (
                <tspan key={j} x={p.x} dy={j === 0 ? 0 : 11}>{w}</tspan>
              ))}
            </text>
          )
        })}
      </svg>
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        {domains.map((d) => (
          <div key={d.domain} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#a21caf] flex-shrink-0" />
            <span className="text-[12px] text-[#374151] dark:text-[#ccc] truncate">{DOMAIN_LABELS[d.domain] ?? d.domain}</span>
            <div className="ml-auto flex items-center gap-1.5 flex-shrink-0">
              <div className="w-16 h-1.5 bg-black/8 dark:bg-white/8 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-[#a21caf]" style={{ width: `${d.efficiency * 100}%` }} />
              </div>
              <span className="text-[11px] font-medium text-[#a21caf] dark:text-[#e879f9] w-8 text-right">
                {Math.round(d.efficiency * 100)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function IqResultsPage({
  params,
  searchParams,
}: {
  params: { sessionId: string }
  searchParams: { token?: string; _t?: string }
}) {
  const token = searchParams.token ?? null

  // Mock sessions are handled entirely client-side via sessionStorage
  if (token === 'mock' && params.sessionId.startsWith('mock-')) {
    return <MockResultsClient sessionId={params.sessionId} />
  }

  const result = await fetchResult(params.sessionId, token)

  if (!result) notFound()

  const domains = Object.values(result.domainScores ?? {})

  if (!result.isValid) {
    return (
      <div className="bg-[#f5f5f3] dark:bg-[#121212] min-h-screen flex items-center justify-center px-4">
        <div className="max-w-[480px] w-full bg-white dark:bg-[#1e1e1e] rounded-2xl border border-black/8 dark:border-white/8 p-8 text-center">
          <div className="text-3xl mb-4">⚠️</div>
          <h2 className="text-lg font-semibold mb-2">Session could not be scored</h2>
          <p className="text-[13px] text-[#555] dark:text-[#aaa] mb-4 leading-[1.65]">
            One or more validity checks failed for this session.
          </p>
          <ul className="text-[12px] text-[#dc2626] mb-6 space-y-1">
            {result.invalidityFlags.map((f) => <li key={f}>• {f.replace(/_/g, ' ')}</li>)}
          </ul>
          <Link href="/tools/iq-test" className="text-sm text-[#a21caf] hover:underline">
            ← Return to IQ Test
          </Link>
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
            { label: 'Percentile',  value: `${result.percentile}th` },
            { label: 'Age group',   value: result.ageGroup },
            { label: 'Questions',   value: String(result.questionCount) },
            { label: 'Validity',    value: result.isValid ? 'Valid ✓' : 'Invalid ✗' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-black/8 dark:border-white/8 p-4 text-center">
              <div className="text-lg font-semibold text-[#a21caf] dark:text-[#e879f9]">{value}</div>
              <div className="text-[11px] text-[#555] dark:text-[#aaa] mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        <PercentileBar percentile={result.percentile} />
        <BellCurve iqScore={result.iqScore} />

        {/* Domain Analysis — premium gate */}
        {domains.length > 0 ? (
          <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-black/8 dark:border-white/8 p-6">
            <div className="flex items-center justify-between gap-3 mb-5">
              <h3 className="text-sm font-semibold">Cognitive Domain Profile</h3>
              <span className="text-[11px] bg-[#fdf4ff] dark:bg-[#a21caf]/15 text-[#a21caf] dark:text-[#e879f9] px-2 py-0.5 rounded-full font-medium">Premium</span>
            </div>
            <div className="relative">
              <div className="blur-sm pointer-events-none select-none" aria-hidden="true">
                <DomainRadar domains={domains} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-black/8 dark:border-white/8 px-6 py-4 text-center shadow-lg">
                  <p className="text-sm font-medium mb-1">Unlock your full cognitive profile</p>
                  <p className="text-[12px] text-[#555] dark:text-[#aaa] mb-3">Radar chart · domain insights · PDF report</p>
                  <button className="bg-[#a21caf] hover:bg-[#86198f] text-white rounded-lg px-5 py-2 text-sm font-medium transition-colors">
                    Unlock for $4.99
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Domain insight cards — blurred preview */}
        {domains.length > 0 && (
          <div className="relative">
            <div className="blur-sm pointer-events-none select-none" aria-hidden="true">
              <div className="grid sm:grid-cols-2 gap-3">
                {domains.map((d) => (
                  <div key={d.domain} className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-black/8 dark:border-white/8 p-4">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[13px] font-medium">{DOMAIN_LABELS[d.domain] ?? d.domain}</span>
                      <span className="text-[10px] bg-[#f3f4f6] dark:bg-white/5 text-[#555] dark:text-[#aaa] px-2 py-0.5 rounded-full font-medium">{d.band}</span>
                    </div>
                    <div className="h-1.5 bg-black/8 dark:bg-white/8 rounded-full overflow-hidden mb-2">
                      <div className="h-full rounded-full bg-[#a21caf]" style={{ width: `${d.efficiency * 100}%` }} />
                    </div>
                    <p className="text-[12px] text-[#555] dark:text-[#aaa] leading-[1.55]">{d.interpretation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Report download */}
        <div className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-black/8 dark:border-white/8 p-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-[13px] font-medium">Download PDF Report</p>
            <p className="text-[12px] text-[#555] dark:text-[#aaa] mt-0.5">4-page professional assessment report</p>
          </div>
          <ReportDownloadButton
            sessionId={params.sessionId}
            sessionToken={token}
            initialReady={result.reportReady}
            initialUrl={result.reportUrl}
          />
        </div>

        <div className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-black/8 dark:border-white/8 p-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-[13px] font-medium">Want to retake the test?</p>
            <p className="text-[12px] text-[#555] dark:text-[#aaa] mt-0.5">A 24-hour cooldown applies between attempts.</p>
          </div>
          <Link href="/tools/iq-test"
            className="border border-black/10 dark:border-white/15 rounded-lg px-4 py-2 text-sm font-medium hover:border-[#a21caf] hover:text-[#a21caf] transition-colors flex-shrink-0">
            Back to test
          </Link>
        </div>

        <p className="text-[11px] text-[#555] dark:text-[#aaa] text-center leading-[1.6] pb-4">
          Self-assessment only — not a clinical diagnosis.
          Session: <code className="font-mono">{params.sessionId}</code>
          {result.normingVersion ? ` · Norms: ${result.normingVersion}` : ''}
        </p>
      </div>
    </div>
  )
}
