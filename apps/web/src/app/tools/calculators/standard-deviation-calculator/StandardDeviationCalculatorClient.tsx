'use client'
import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { exportCalcPDF } from '@/lib/calcPdf'

// ─── Types ────────────────────────────────────────────────────────────────────

interface DataRow {
  index: number
  value: number
  deviation: number
  devSquared: number
  zScore: number
}

interface SDResult {
  n: number
  sum: number
  mean: number
  median: number
  mode: string
  min: number
  max: number
  range: number
  variance: number
  sd: number
  cv: number
  skewness: number
  kurtosis: number
  p25: number
  p50: number
  p75: number
  rows: DataRow[]
  sumDevSq: number
  interpretation: string
  interpretColor: string
}

// ─── Calculation Engine ───────────────────────────────────────────────────────

function calcPercentile(sorted: number[], p: number): number {
  const idx = (p / 100) * (sorted.length - 1)
  const lo = Math.floor(idx)
  const hi = Math.ceil(idx)
  return lo === hi ? sorted[lo] : sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo)
}

function computeSD(nums: number[], type: 'sample' | 'population'): SDResult | null {
  const n = nums.length
  if (n < 2) return null

  const sum = nums.reduce((a, b) => a + b, 0)
  const mean = sum / n
  const sorted = [...nums].sort((a, b) => a - b)
  const median = n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)]

  const sumDevSq = nums.reduce((acc, x) => acc + (x - mean) ** 2, 0)
  const variance = sumDevSq / (type === 'population' ? n : n - 1)
  const sd = Math.sqrt(variance)

  const freq: Record<number, number> = {}
  nums.forEach(x => { freq[x] = (freq[x] || 0) + 1 })
  const maxF = Math.max(...Object.values(freq))
  const modeVals = Object.entries(freq).filter(([, f]) => f === maxF).map(([v]) => +v)
  const mode = modeVals.length === n ? 'No mode' : modeVals.join(', ')

  const cv = mean !== 0 ? (sd / Math.abs(mean)) * 100 : NaN
  const skewness = sd > 0
    ? nums.reduce((acc, x) => acc + ((x - mean) / sd) ** 3, 0) / n
    : 0
  const kurtosis = sd > 0
    ? nums.reduce((acc, x) => acc + ((x - mean) / sd) ** 4, 0) / n - 3
    : 0

  const p25 = calcPercentile(sorted, 25)
  const p50 = calcPercentile(sorted, 50)
  const p75 = calcPercentile(sorted, 75)

  const rows: DataRow[] = nums.map((v, i) => ({
    index: i + 1,
    value: v,
    deviation: v - mean,
    devSquared: (v - mean) ** 2,
    zScore: sd > 0 ? (v - mean) / sd : 0,
  }))

  // Interpretation based on CV
  let interpretation: string
  let interpretColor: string
  if (isNaN(cv)) {
    interpretation = 'Mean is zero — coefficient of variation undefined.'
    interpretColor = 'var(--fg-3)'
  } else if (cv < 10) {
    interpretation = `CV = ${cv.toFixed(1)}% — Low variability. Values are tightly clustered around the mean.`
    interpretColor = '#10b981'
  } else if (cv < 30) {
    interpretation = `CV = ${cv.toFixed(1)}% — Moderate variability. Typical spread for most real-world datasets.`
    interpretColor = '#f59e0b'
  } else {
    interpretation = `CV = ${cv.toFixed(1)}% — High variability. Values are widely dispersed around the mean.`
    interpretColor = '#f87171'
  }

  return {
    n, sum, mean, median, mode,
    min: sorted[0], max: sorted[n - 1], range: sorted[n - 1] - sorted[0],
    variance, sd, cv, skewness, kurtosis,
    p25, p50, p75, rows, sumDevSq,
    interpretation, interpretColor,
  }
}

// ─── Formatting helpers ───────────────────────────────────────────────────────

const fmt = (n: number, d = 4) => isFinite(n) ? n.toFixed(d) : '—'
const fmt2 = (n: number) => fmt(n, 2)
const fmt6 = (n: number) => fmt(n, 6)

// ─── CSV Export ───────────────────────────────────────────────────────────────

function exportCSV(rows: DataRow[], mean: number) {
  const header = ['#', 'Value', 'Deviation (xᵢ − x̄)', 'Deviation² (xᵢ − x̄)²', 'Z-Score']
  const data = rows.map(r => [r.index, r.value, r.deviation.toFixed(6), r.devSquared.toFixed(6), r.zScore.toFixed(6)])
  const footer = ['', `Mean = ${mean.toFixed(6)}`, '', `Sum = ${rows.reduce((a, r) => a + r.devSquared, 0).toFixed(6)}`, '']
  const csv = [header, ...data, footer].map(r => r.join(',')).join('\n')
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })),
    download: 'std-deviation-analysis.csv',
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
      <div style={{ fontSize: 22, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function StandardDeviationCalculatorClient() {
  const [input, setInput]       = useState('4, 7, 13, 16, 21, 8, 11, 5, 18, 3')
  const [type, setType]         = useState<'sample' | 'population'>('sample')
  const [showAdv, setShowAdv]   = useState(false)
  const [showTable, setShowTable] = useState(false)
  const [showAll, setShowAll]   = useState(false)

  const nums = useMemo(() =>
    input.split(/[\s,;\n]+/).map(s => s.trim()).filter(s => s !== '').map(Number).filter(n => !isNaN(n) && isFinite(n)),
    [input]
  )

  const result = useMemo(() => computeSD(nums, type), [nums, type])

  const displayRows = result
    ? (showAll ? result.rows : result.rows.slice(0, 20))
    : []

  // Sample vs Population side-by-side comparison
  const sampleResult = useMemo(() => computeSD(nums, 'sample'), [nums])
  const popResult    = useMemo(() => computeSD(nums, 'population'), [nums])

  function handlePDF() {
    if (!result) return
    exportCalcPDF({
      toolName: 'Standard Deviation Calculator',
      inputs: [
        { label: 'Dataset', value: nums.join(', ') },
        { label: 'Type', value: type === 'population' ? 'Population (÷N)' : 'Sample (÷n−1)' },
        { label: 'Count', value: result.n },
      ],
      results: [
        { label: 'Mean (x̄)', value: fmt6(result.mean), highlight: true },
        { label: 'Standard Deviation', value: fmt6(result.sd), highlight: true },
        { label: 'Variance', value: fmt6(result.variance) },
        { label: 'Median', value: fmt6(result.median) },
        { label: 'Min / Max', value: `${result.min} / ${result.max}` },
        { label: 'Range', value: fmt2(result.range) },
        { label: 'CV', value: isFinite(result.cv) ? fmt2(result.cv) + '%' : '—' },
        { label: 'Skewness', value: fmt6(result.skewness) },
        { label: 'Kurtosis', value: fmt6(result.kurtosis) },
        { label: 'P25 / P50 / P75', value: `${fmt2(result.p25)} / ${fmt2(result.p50)} / ${fmt2(result.p75)}` },
      ],
      formula: type === 'population'
        ? 'σ = √[ Σ(xᵢ − μ)² / N ]'
        : 's = √[ Σ(xᵢ − x̄)² / (n−1) ]',
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── INPUTS ── */}
      <div style={CARD}>
        <div style={{ marginBottom: 16 }}>
          <label style={LABEL}>Data Set (comma, space, or newline separated)</label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={4}
            placeholder="e.g. 4, 7, 13, 16, 21, 8, 11, 5"
            style={{ ...INPUT_BOX, resize: 'vertical', fontFamily: 'monospace', lineHeight: 1.6 }}
            aria-label="Data set input"
          />
          {nums.length > 0 && (
            <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4 }}>
              {nums.length} value{nums.length !== 1 ? 's' : ''} parsed
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <label style={LABEL}>Formula Type</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['sample', 'population'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  style={{
                    padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    border: type === t ? '1px solid rgba(139,92,246,0.6)' : '1px solid var(--line-strong)',
                    background: type === t ? 'rgba(139,92,246,0.18)' : 'rgba(0,0,0,0.2)',
                    color: type === t ? 'var(--brand-2)' : 'var(--fg-3)',
                  }}
                >
                  {t === 'sample' ? 'Sample (÷n−1)' : 'Population (÷N)'}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
            <button onClick={() => setInput('4, 7, 13, 16, 21, 8, 11, 5, 18, 3')} style={{ ...BTN_GHOST, fontSize: 12 }}>
              ↺ Reset
            </button>
          </div>
        </div>

        {/* Advanced toggle */}
        <button
          onClick={() => setShowAdv(v => !v)}
          style={{ ...BTN_GHOST, marginTop: 16 }}
          aria-expanded={showAdv}
        >
          {showAdv ? '▾' : '▸'} Advanced Metrics
        </button>
      </div>

      {/* ── RESULTS ── */}
      {result ? (
        <>
          {/* Primary metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 }}>
            <MetricCard label="Mean (x̄)" value={fmt6(result.mean)} color="#6366f1" />
            <MetricCard label="Std Deviation" value={fmt6(result.sd)} color="#8b5cf6"
              sub={type === 'sample' ? 's (sample)' : 'σ (population)'} />
            <MetricCard label="Variance" value={fmt6(result.variance)} color="#a78bfa"
              sub={type === 'sample' ? 's²' : 'σ²'} />
            <MetricCard label="Count" value={String(result.n)} color="#38bdf8" />
            <MetricCard label="Min" value={String(result.min)} color="#10b981" />
            <MetricCard label="Max" value={String(result.max)} color="#10b981" />
            <MetricCard label="Range" value={fmt2(result.range)} color="#f59e0b" />
            <MetricCard label="Median" value={fmt6(result.median)} color="#e879f9" />
          </div>

          {/* Interpretation */}
          <div style={{ ...CARD, background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.2)', padding: '16px 20px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              Variability Interpretation
            </div>
            <div style={{ fontSize: 14, color: result.interpretColor, fontWeight: 600 }}>{result.interpretation}</div>
            <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 8, lineHeight: 1.6 }}>
              {type === 'sample'
                ? `Formula: s = √[ Σ(xᵢ − x̄)² / (n−1) ] = √[ ${fmt2(result.sumDevSq)} / ${result.n - 1} ] = ${fmt6(result.sd)}`
                : `Formula: σ = √[ Σ(xᵢ − μ)² / N ] = √[ ${fmt2(result.sumDevSq)} / ${result.n} ] = ${fmt6(result.sd)}`
              }
            </div>
          </div>

          {/* Advanced metrics */}
          {showAdv && (
            <div style={CARD}>
              <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Advanced Metrics
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 }}>
                <MetricCard label="CV" value={isFinite(result.cv) ? fmt2(result.cv) + '%' : '—'}
                  sub="Coeff. of Variation" color="#f59e0b" />
                <MetricCard label="Skewness" value={fmt6(result.skewness)}
                  sub={result.skewness > 0.5 ? 'Right skew' : result.skewness < -0.5 ? 'Left skew' : 'Near symmetric'}
                  color="#e879f9" />
                <MetricCard label="Kurtosis" value={fmt6(result.kurtosis)}
                  sub={result.kurtosis > 0 ? 'Heavy tails' : 'Light tails'} color="#38bdf8" />
                <MetricCard label="P25" value={fmt2(result.p25)} color="#6366f1" />
                <MetricCard label="P50 (median)" value={fmt2(result.p50)} color="#6366f1" />
                <MetricCard label="P75" value={fmt2(result.p75)} color="#6366f1" />
              </div>
              <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--bg-2)', borderRadius: 10 }}>
                <div style={{ fontSize: 12, color: 'var(--fg-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Mode</div>
                <div style={{ fontSize: 14, color: 'var(--brand-2)', fontFamily: 'monospace' }}>{result.mode}</div>
              </div>
            </div>
          )}

          {/* Sample vs Population Scenario Panel */}
          {sampleResult && popResult && (
            <div style={CARD}>
              <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Sample vs Population Comparison
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr>
                      {['Metric', 'Sample (÷n−1)', 'Population (÷N)', 'Difference'].map((h, i) => (
                        <th key={h} style={{ ...TH, textAlign: i === 0 ? 'left' : 'right' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: 'Std Deviation', s: sampleResult.sd, p: popResult.sd },
                      { label: 'Variance', s: sampleResult.variance, p: popResult.variance },
                    ].map(({ label, s, p }) => (
                      <tr key={label} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ ...TD, textAlign: 'left', color: 'var(--fg-2)', fontWeight: 600 }}>{label}</td>
                        <td style={{ ...TD, color: type === 'sample' ? 'var(--brand-2)' : 'var(--fg-2)', fontWeight: type === 'sample' ? 700 : 400 }}>{fmt6(s)}</td>
                        <td style={{ ...TD, color: type === 'population' ? 'var(--brand-2)' : 'var(--fg-2)', fontWeight: type === 'population' ? 700 : 400 }}>{fmt6(p)}</td>
                        <td style={{ ...TD, color: '#f59e0b' }}>{fmt6(Math.abs(s - p))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: 12, fontSize: 12, color: 'var(--fg-3)', lineHeight: 1.6 }}>
                Sample SD uses n−1 (Bessel&apos;s correction) to produce an unbiased estimate of the true population SD.
                Population SD uses N — use only when your data is the entire population.
              </div>
            </div>
          )}

          {/* Data analysis table */}
          <div>
            <button
              onClick={() => setShowTable(v => !v)}
              style={{
                width: '100%', textAlign: 'left', padding: '14px 20px',
                background: 'var(--bg-1)', border: '1px solid var(--line-strong)',
                borderRadius: 12, color: 'var(--brand-2)', fontWeight: 700, fontSize: 14,
                cursor: 'pointer',
              }}
              aria-expanded={showTable}
            >
              {showTable ? '▾' : '▸'} Value-by-Value Analysis Table
              <span style={{ marginLeft: 10, fontWeight: 400, fontSize: 12, color: 'var(--fg-3)' }}>
                ({result.n} rows)
              </span>
            </button>

            {showTable && (
              <div style={{ ...CARD, padding: 0, overflow: 'hidden', marginTop: 4 }}>
                <div style={{ display: 'flex', gap: 10, padding: '14px 20px', borderBottom: '1px solid var(--line-strong)', flexWrap: 'wrap' }}>
                  <button onClick={() => result && exportCSV(result.rows, result.mean)} style={BTN_GHOST}>
                    ⬇ Export CSV
                  </button>
                  <button onClick={handlePDF} style={BTN_GHOST}>
                    Export PDF
                  </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}
                    aria-label="Standard deviation analysis table">
                    <thead>
                      <tr>
                        {['#', 'Value (xᵢ)', 'Deviation (xᵢ − x̄)', 'Dev² (xᵢ − x̄)²', 'Z-Score'].map(h => (
                          <th key={h} style={TH}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {displayRows.map(row => (
                        <tr key={row.index} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ ...TD, color: 'var(--fg-3)' }}>{row.index}</td>
                          <td style={{ ...TD, color: 'var(--brand-2)', fontWeight: 600 }}>{row.value}</td>
                          <td style={{ ...TD, color: row.deviation >= 0 ? '#10b981' : '#f87171' }}>
                            {row.deviation >= 0 ? '+' : ''}{fmt6(row.deviation)}
                          </td>
                          <td style={{ ...TD, color: '#f59e0b' }}>{fmt6(row.devSquared)}</td>
                          <td style={{ ...TD, color: Math.abs(row.zScore) > 2 ? '#f87171' : 'var(--fg-2)' }}>
                            {fmt2(row.zScore)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr style={{ borderTop: '2px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.05)' }}>
                        <td colSpan={2} style={{ ...TD, textAlign: 'left', fontWeight: 700, color: 'var(--fg-2)' }}>
                          Mean = {fmt6(result.mean)}
                        </td>
                        <td style={{ ...TD, fontWeight: 700, color: 'var(--fg)' }}>Σ = 0</td>
                        <td style={{ ...TD, fontWeight: 700, color: '#f59e0b' }}>
                          Σ = {fmt2(result.sumDevSq)}
                        </td>
                        <td />
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {result.rows.length > 20 && (
                  <div style={{ textAlign: 'center', padding: '12px 20px', borderTop: '1px solid var(--line-strong)' }}>
                    <button onClick={() => setShowAll(v => !v)} style={{ ...BTN_GHOST, fontSize: 12 }}>
                      {showAll ? '▲ Show first 20 rows' : `▼ Show all ${result.rows.length} rows`}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Formula reference */}
          <div style={{ ...CARD, background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.2)' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: 'var(--brand-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Formula Reference
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'Sample SD', formula: 's = √[ Σ(xᵢ − x̄)² / (n−1) ]', active: type === 'sample' },
                { label: 'Population SD', formula: 'σ = √[ Σ(xᵢ − μ)² / N ]', active: type === 'population' },
              ].map(({ label, formula, active }) => (
                <div key={label} style={{
                  padding: '12px 16px', borderRadius: 10,
                  background: active ? 'rgba(139,92,246,0.15)' : 'rgba(0,0,0,0.2)',
                  border: active ? '1px solid rgba(139,92,246,0.4)' : '1px solid transparent',
                }}>
                  <div style={{ fontSize: 11, color: active ? 'var(--brand-2)' : 'var(--fg-3)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
                    {label} {active ? '(current)' : ''}
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: 13, color: active ? '#e9d5ff' : 'var(--fg-3)' }}>{formula}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div style={{ ...CARD, textAlign: 'center', padding: '40px 20px', color: 'var(--fg-3)', fontSize: 14 }}>
          {nums.length === 1
            ? 'Enter at least 2 values to calculate standard deviation.'
            : 'Enter comma-separated numbers above — results update instantly.'}
        </div>
      )}
    </div>
  )
}
