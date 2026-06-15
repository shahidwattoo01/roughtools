'use client'
import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { exportCalcPDF } from '@/lib/calcPdf'

// ─── Types ────────────────────────────────────────────────────────────────────

interface SortedRow {
  rank: number
  value: number
  zScore: number
  percentile: number
}

interface FreqRow {
  value: number
  count: number
  relFreq: number
  cumFreq: number
}

interface StatsResult {
  n: number
  sum: number
  mean: number
  median: number
  mode: string
  modeCount: number
  range: number
  variance: number
  sd: number
  se: number
  min: number
  max: number
  q1: number
  q3: number
  iqr: number
  outliers: number[]
  skewness: number
  kurtosis: number
  cv: number
  sorted: number[]
  sortedRows: SortedRow[]
  freqRows: FreqRow[]
  skewnessInterp: string
  skewnessColor: string
}

// ─── Calculation Engine ───────────────────────────────────────────────────────

function calcPct(sorted: number[], p: number): number {
  const idx = (p / 100) * (sorted.length - 1)
  const lo = Math.floor(idx)
  const hi = Math.ceil(idx)
  return lo === hi ? sorted[lo] : sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo)
}

function computeStats(nums: number[]): StatsResult | null {
  const n = nums.length
  if (n < 2) return null

  const sum = nums.reduce((a, b) => a + b, 0)
  const mean = sum / n
  const sorted = [...nums].sort((a, b) => a - b)
  const median = n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)]

  const sumSqDev = nums.reduce((acc, x) => acc + (x - mean) ** 2, 0)
  const variance = sumSqDev / (n - 1)
  const sd = Math.sqrt(variance)
  const se = sd / Math.sqrt(n)

  const q1 = calcPct(sorted, 25)
  const q3 = calcPct(sorted, 75)
  const iqr = q3 - q1

  const outliers = sorted.filter(x => x < q1 - 1.5 * iqr || x > q3 + 1.5 * iqr)

  const skewness = sd > 0 ? nums.reduce((acc, x) => acc + ((x - mean) / sd) ** 3, 0) / n : 0
  const kurtosis = sd > 0 ? nums.reduce((acc, x) => acc + ((x - mean) / sd) ** 4, 0) / n - 3 : 0
  const cv = mean !== 0 ? (sd / Math.abs(mean)) * 100 : NaN

  // Mode
  const freq: Record<number, number> = {}
  nums.forEach(x => { freq[x] = (freq[x] || 0) + 1 })
  const maxF = Math.max(...Object.values(freq))
  const modeVals = Object.entries(freq).filter(([, f]) => f === maxF).map(([v]) => +v)
  const mode = modeVals.length === n ? 'No mode' : modeVals.join(', ')

  // Sorted rows
  const sortedRows: SortedRow[] = sorted.map((v, i) => ({
    rank: i + 1,
    value: v,
    zScore: sd > 0 ? (v - mean) / sd : 0,
    percentile: ((i + 0.5) / n) * 100,
  }))

  // Frequency table
  const freqMap: Map<number, number> = new Map()
  nums.forEach(x => freqMap.set(x, (freqMap.get(x) || 0) + 1))
  let cum = 0
  const freqRows: FreqRow[] = Array.from(freqMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([value, count]) => {
      cum += count
      return { value, count, relFreq: count / n, cumFreq: cum / n }
    })

  // Skewness interpretation
  let skewnessInterp: string
  let skewnessColor: string
  const abs = Math.abs(skewness)
  if (abs < 0.5) {
    skewnessInterp = 'Approximately symmetric distribution.'
    skewnessColor = '#10b981'
  } else if (abs < 1) {
    skewnessInterp = skewness > 0 ? 'Moderately right-skewed (long right tail).' : 'Moderately left-skewed (long left tail).'
    skewnessColor = '#f59e0b'
  } else {
    skewnessInterp = skewness > 0 ? 'Highly right-skewed — outliers likely on the high end.' : 'Highly left-skewed — outliers likely on the low end.'
    skewnessColor = '#f87171'
  }

  return {
    n, sum, mean, median, mode, modeCount: maxF,
    range: sorted[n - 1] - sorted[0], variance, sd, se,
    min: sorted[0], max: sorted[n - 1],
    q1, q3, iqr, outliers, skewness, kurtosis, cv,
    sorted, sortedRows, freqRows,
    skewnessInterp, skewnessColor,
  }
}

// ─── Formatting helpers ───────────────────────────────────────────────────────

const fmt = (n: number, d = 4) => isFinite(n) ? n.toFixed(d) : '—'
const fmt2 = (n: number) => fmt(n, 2)
const fmt4 = (n: number) => fmt(n, 4)
const fmt6 = (n: number) => fmt(n, 6)

// ─── CSV Export ───────────────────────────────────────────────────────────────

function exportCSV(rows: SortedRow[]) {
  const header = ['Rank', 'Value', 'Z-Score', 'Percentile']
  const data = rows.map(r => [r.rank, r.value, r.zScore.toFixed(4), r.percentile.toFixed(2) + '%'])
  const csv = [header, ...data].map(r => r.join(',')).join('\n')
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })),
    download: 'statistics-analysis.csv',
  })
  a.click()
}

// ─── Shared style tokens ──────────────────────────────────────────────────────

const CARD: CSSProperties = {
  background: 'var(--bg-1)',
  border: '1px solid var(--line-strong)',
  borderRadius: 16,
  padding: '24px 28px',
}
const INPUT_BOX: CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 8,
  background: 'var(--bg-2)', border: '1px solid var(--line-strong)',
  color: 'var(--fg)', fontSize: 14, boxSizing: 'border-box',
}
const LABEL: CSSProperties = {
  display: 'block', marginBottom: 5, fontSize: 12,
  color: 'var(--fg-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em',
}
const BTN_GHOST: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)',
  borderRadius: 8, padding: '9px 18px', color: 'var(--brand-2)', fontSize: 13,
  fontWeight: 600, cursor: 'pointer',
}
const TH: CSSProperties = {
  padding: '9px 12px', fontWeight: 700, fontSize: 11,
  textTransform: 'uppercase', letterSpacing: '0.07em',
  color: 'var(--fg-3)', textAlign: 'right', background: 'rgba(99,102,241,0.1)',
  whiteSpace: 'nowrap',
}
const TD: CSSProperties = { padding: '6px 12px', fontSize: 12, textAlign: 'right', color: 'var(--fg-2)', whiteSpace: 'nowrap' }

// ─── Sub-components ───────────────────────────────────────────────────────────

function MetricCard({ label, value, sub, color = '#6366f1' }: {
  label: string; value: string; sub?: string; color?: string
}) {
  return (
    <div style={{ padding: '18px 14px', background: 'var(--bg-2)', borderRadius: 12, textAlign: 'center' }}>
      <div style={{ fontSize: 20, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function StatisticsCalculatorClient() {
  const [input, setInput]           = useState('2, 4, 4, 4, 5, 5, 7, 9, 12, 15, 3, 18')
  const [showAdv, setShowAdv]       = useState(false)
  const [showSorted, setShowSorted] = useState(false)
  const [showFreq, setShowFreq]     = useState(false)
  const [showAllSorted, setShowAllSorted] = useState(false)

  const nums = useMemo(() =>
    input.split(/[\s,;\n]+/).map(s => s.trim()).filter(s => s !== '').map(Number).filter(n => !isNaN(n) && isFinite(n)),
    [input]
  )

  const result = useMemo(() => computeStats(nums), [nums])

  const displaySortedRows = result
    ? (showAllSorted ? result.sortedRows : result.sortedRows.slice(0, 20))
    : []

  function handlePDF() {
    if (!result) return
    exportCalcPDF({
      toolName: 'Statistics Calculator',
      inputs: [{ label: 'Dataset', value: nums.join(', ') }, { label: 'Count', value: result.n }],
      results: [
        { label: 'Mean', value: fmt6(result.mean), highlight: true },
        { label: 'Median', value: fmt6(result.median), highlight: true },
        { label: 'Std Dev (s)', value: fmt6(result.sd), highlight: true },
        { label: 'Variance (s²)', value: fmt6(result.variance) },
        { label: 'Std Error', value: fmt6(result.se) },
        { label: 'Min / Max', value: `${result.min} / ${result.max}` },
        { label: 'Q1 / Q3', value: `${fmt4(result.q1)} / ${fmt4(result.q3)}` },
        { label: 'IQR', value: fmt4(result.iqr) },
        { label: 'Outliers', value: result.outliers.length ? result.outliers.join(', ') : 'None' },
        { label: 'Skewness', value: fmt6(result.skewness) },
        { label: 'Kurtosis', value: fmt6(result.kurtosis) },
        { label: 'CV', value: isFinite(result.cv) ? fmt2(result.cv) + '%' : '—' },
      ],
      formula: 'x̄ = Σx/n  |  s² = Σ(x−x̄)²/(n−1)  |  Outliers: x < Q1−1.5×IQR  or  x > Q3+1.5×IQR',
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── INPUT ── */}
      <div style={CARD}>
        <label style={LABEL}>Data Set (comma, space, or newline separated)</label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={4}
          placeholder="e.g. 2, 4, 4, 4, 5, 5, 7, 9"
          style={{ ...INPUT_BOX, resize: 'vertical', fontFamily: 'monospace', lineHeight: 1.6 }}
          aria-label="Dataset input"
        />
        {nums.length > 0 && (
          <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4 }}>
            {nums.length} value{nums.length !== 1 ? 's' : ''} parsed
          </div>
        )}
        <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
          <button onClick={() => setInput('2, 4, 4, 4, 5, 5, 7, 9, 12, 15, 3, 18')} style={{ ...BTN_GHOST, fontSize: 12 }}>
            ↺ Reset
          </button>
          <button onClick={() => setShowAdv(v => !v)} style={{ ...BTN_GHOST, fontSize: 12 }} aria-expanded={showAdv}>
            {showAdv ? '▾' : '▸'} Advanced Stats
          </button>
        </div>
      </div>

      {/* ── RESULTS ── */}
      {result ? (
        <>
          {/* Primary metrics grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12 }}>
            <MetricCard label="Count" value={String(result.n)} color="#38bdf8" />
            <MetricCard label="Sum" value={fmt2(result.sum)} color="#38bdf8" />
            <MetricCard label="Mean" value={fmt6(result.mean)} color="#6366f1" />
            <MetricCard label="Median" value={fmt6(result.median)} color="#8b5cf6" />
            <MetricCard label="Mode" value={result.mode} sub={result.mode !== 'No mode' ? `×${result.modeCount}` : undefined} color="#a78bfa" />
            <MetricCard label="Range" value={fmt2(result.range)} color="#f59e0b" />
            <MetricCard label="Std Dev" value={fmt6(result.sd)} color="#e879f9" sub="sample" />
            <MetricCard label="Variance" value={fmt6(result.variance)} color="#e879f9" sub="s²" />
            <MetricCard label="Std Error" value={fmt6(result.se)} color="#10b981" />
          </div>

          {/* Skewness / outlier interpretation */}
          <div style={{ ...CARD, background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.2)', padding: '16px 20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--fg-3)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 6 }}>Distribution Shape</div>
                <div style={{ fontSize: 13, color: result.skewnessColor, fontWeight: 600 }}>{result.skewnessInterp}</div>
                <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 4 }}>
                  Skewness = {fmt4(result.skewness)} | Kurtosis = {fmt4(result.kurtosis)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--fg-3)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 6 }}>
                  Outliers (1.5 × IQR rule)
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: result.outliers.length ? '#f87171' : '#10b981' }}>
                  {result.outliers.length ? result.outliers.join(', ') : 'No outliers detected'}
                </div>
                <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 4 }}>
                  Bounds: [{fmt2(result.q1 - 1.5 * result.iqr)}, {fmt2(result.q3 + 1.5 * result.iqr)}]
                </div>
              </div>
            </div>
          </div>

          {/* Advanced metrics */}
          {showAdv && (
            <div style={CARD}>
              <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Advanced Statistics
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12 }}>
                <MetricCard label="Q1 (25th)" value={fmt4(result.q1)} color="#6366f1" />
                <MetricCard label="Q3 (75th)" value={fmt4(result.q3)} color="#6366f1" />
                <MetricCard label="IQR" value={fmt4(result.iqr)} color="#8b5cf6" sub="Q3 − Q1" />
                <MetricCard label="Skewness" value={fmt4(result.skewness)} color="#e879f9"
                  sub={result.skewness > 0 ? 'Right skew' : result.skewness < 0 ? 'Left skew' : 'Symmetric'} />
                <MetricCard label="Kurtosis" value={fmt4(result.kurtosis)} color="#38bdf8"
                  sub={result.kurtosis > 0 ? 'Heavy tails' : 'Light tails'} />
                <MetricCard label="CV" value={isFinite(result.cv) ? fmt2(result.cv) + '%' : '—'}
                  sub="Coeff. of Variation" color="#f59e0b" />
              </div>

              {/* Box plot five-number summary */}
              <div style={{ marginTop: 20 }}>
                <div style={{ fontSize: 12, color: 'var(--fg-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
                  Five-Number Summary (Box Plot)
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', padding: '0 20px' }}>
                  {[
                    { label: 'Min', value: result.min },
                    { label: 'Q1', value: result.q1 },
                    { label: 'Median', value: result.median },
                    { label: 'Q3', value: result.q3 },
                    { label: 'Max', value: result.max },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--brand-2)' }}>{fmt2(value)}</div>
                      <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4 }}>{label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ height: 20, margin: '10px 20px 0', borderRadius: 4, position: 'relative', background: 'rgba(255,255,255,0.05)' }}>
                  {(() => {
                    const span = result.max - result.min || 1
                    const q1Pct = ((result.q1 - result.min) / span) * 100
                    const medPct = ((result.median - result.min) / span) * 100
                    const q3Pct = ((result.q3 - result.min) / span) * 100
                    return (
                      <>
                        <div style={{ position: 'absolute', left: `${q1Pct}%`, width: `${q3Pct - q1Pct}%`, top: 0, height: '100%', background: 'rgba(139,92,246,0.4)', borderRadius: 4 }} />
                        <div style={{ position: 'absolute', left: `${medPct}%`, width: 3, top: 0, height: '100%', background: 'var(--brand-2)' }} />
                      </>
                    )
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* Sorted data table */}
          <div>
            <button
              onClick={() => setShowSorted(v => !v)}
              style={{
                width: '100%', textAlign: 'left', padding: '14px 20px',
                background: 'var(--bg-1)', border: '1px solid var(--line-strong)',
                borderRadius: 12, color: 'var(--brand-2)', fontWeight: 700, fontSize: 14, cursor: 'pointer',
              }}
              aria-expanded={showSorted}
            >
              {showSorted ? '▾' : '▸'} Sorted Data Table with Z-Scores
              <span style={{ marginLeft: 10, fontWeight: 400, fontSize: 12, color: 'var(--fg-3)' }}>({result.n} values)</span>
            </button>

            {showSorted && (
              <div style={{ ...CARD, padding: 0, overflow: 'hidden', marginTop: 4 }}>
                <div style={{ display: 'flex', gap: 10, padding: '14px 20px', borderBottom: '1px solid var(--line-strong)' }}>
                  <button onClick={() => exportCSV(result.sortedRows)} style={BTN_GHOST}>⬇ Export CSV</button>
                  <button onClick={handlePDF} style={BTN_GHOST}>Export PDF</button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                    <thead>
                      <tr>
                        {['Rank', 'Value', 'Z-Score', 'Percentile'].map(h => (
                          <th key={h} style={TH}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {displaySortedRows.map(row => (
                        <tr key={row.rank} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ ...TD, color: 'var(--fg-3)' }}>{row.rank}</td>
                          <td style={{ ...TD, color: 'var(--brand-2)', fontWeight: 600 }}>{row.value}</td>
                          <td style={{ ...TD, color: Math.abs(row.zScore) > 2 ? '#f87171' : Math.abs(row.zScore) > 1 ? '#f59e0b' : '#10b981' }}>
                            {fmt2(row.zScore)}
                          </td>
                          <td style={TD}>{fmt2(row.percentile)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {result.sortedRows.length > 20 && (
                  <div style={{ textAlign: 'center', padding: '12px', borderTop: '1px solid var(--line-strong)' }}>
                    <button onClick={() => setShowAllSorted(v => !v)} style={{ ...BTN_GHOST, fontSize: 12 }}>
                      {showAllSorted ? '▲ Show first 20' : `▼ Show all ${result.sortedRows.length}`}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Frequency distribution */}
          <div>
            <button
              onClick={() => setShowFreq(v => !v)}
              style={{
                width: '100%', textAlign: 'left', padding: '14px 20px',
                background: 'var(--bg-1)', border: '1px solid var(--line-strong)',
                borderRadius: 12, color: 'var(--brand-2)', fontWeight: 700, fontSize: 14, cursor: 'pointer',
              }}
              aria-expanded={showFreq}
            >
              {showFreq ? '▾' : '▸'} Frequency Distribution Table
              <span style={{ marginLeft: 10, fontWeight: 400, fontSize: 12, color: 'var(--fg-3)' }}>
                ({result.freqRows.length} unique values)
              </span>
            </button>

            {showFreq && (
              <div style={{ ...CARD, padding: 0, overflow: 'hidden', marginTop: 4 }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                    <thead>
                      <tr>
                        {['Value', 'Count', 'Rel. Freq.', 'Cum. Freq.', 'Bar'].map((h, i) => (
                          <th key={h} style={{ ...TH, textAlign: i === 4 ? 'left' : 'right' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.freqRows.map(row => (
                        <tr key={row.value} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ ...TD, color: 'var(--brand-2)', fontWeight: 600 }}>{row.value}</td>
                          <td style={TD}>{row.count}</td>
                          <td style={TD}>{(row.relFreq * 100).toFixed(1)}%</td>
                          <td style={TD}>{(row.cumFreq * 100).toFixed(1)}%</td>
                          <td style={{ ...TD, textAlign: 'left', minWidth: 100 }}>
                            <div style={{ height: 8, borderRadius: 4, background: 'rgba(139,92,246,0.6)', width: `${row.relFreq * 100}%`, minWidth: 4 }} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Guidance */}
          <div style={{ ...CARD, background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.2)' }}>
            <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--brand-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Interpretation Guide
            </h3>
            <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                result.mean > result.median
                  ? `Mean (${fmt4(result.mean)}) > Median (${fmt4(result.median)}) — right-skewed distribution. High values pull the mean up.`
                  : result.mean < result.median
                  ? `Mean (${fmt4(result.mean)}) < Median (${fmt4(result.median)}) — left-skewed distribution. Low values pull the mean down.`
                  : `Mean ≈ Median — approximately symmetric distribution.`,
                result.outliers.length > 0
                  ? `${result.outliers.length} outlier${result.outliers.length > 1 ? 's' : ''} detected: [${result.outliers.join(', ')}]. These fall beyond ±1.5×IQR from the quartiles.`
                  : 'No outliers detected using the 1.5×IQR rule (Tukey fences).',
                isFinite(result.cv)
                  ? `Coefficient of variation = ${fmt2(result.cv)}%. ${result.cv < 15 ? 'Low relative spread — data is consistent.' : result.cv < 35 ? 'Moderate spread.' : 'High relative spread — data is highly variable.'}`
                  : 'Mean is zero — CV is undefined.',
              ].map((tip, i) => (
                <li key={i} style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>{tip}</li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <div style={{ ...CARD, textAlign: 'center', padding: '40px 20px', color: 'var(--fg-3)', fontSize: 14 }}>
          {nums.length === 1
            ? 'Enter at least 2 values to calculate statistics.'
            : 'Enter comma-separated numbers above — results update instantly.'}
        </div>
      )}
    </div>
  )
}
