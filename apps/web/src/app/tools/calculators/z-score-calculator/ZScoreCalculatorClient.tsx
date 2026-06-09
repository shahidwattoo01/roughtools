'use client'
import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { exportCalcPDF } from '@/lib/calcPdf'

// ─── Style tokens ─────────────────────────────────────────────────────────────
const CARD: CSSProperties = {
  background: 'var(--bg-1)', border: '1px solid var(--line-strong)',
  borderRadius: 16, padding: '24px 28px',
}
const INPUT_BOX: CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 8,
  background: 'rgba(0,0,0,0.35)', border: '1px solid var(--line-strong)',
  color: '#fff', fontSize: 15, boxSizing: 'border-box',
}
const LABEL: CSSProperties = {
  display: 'block', marginBottom: 5, fontSize: 12,
  color: 'var(--fg-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em',
}
const BTN_GHOST: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)',
  borderRadius: 8, padding: '9px 18px', color: '#c4b5fd', fontSize: 13,
  fontWeight: 600, cursor: 'pointer',
}
const TH: CSSProperties = {
  padding: '8px 10px', fontWeight: 700, fontSize: 11,
  textTransform: 'uppercase', letterSpacing: '0.06em',
  color: 'var(--fg-3)', background: 'rgba(99,102,241,0.1)',
}
const TD: CSSProperties = { padding: '6px 10px', fontSize: 12, color: 'var(--fg-2)', fontFamily: 'monospace' }

function MetricCard({ label, value, sub, color = '#6366f1' }: {
  label: string; value: string; sub?: string; color?: string
}) {
  return (
    <div style={{ padding: '18px 14px', background: 'rgba(0,0,0,0.3)', borderRadius: 12, textAlign: 'center' }}>
      <div style={{ fontSize: 22, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

// ─── Normal CDF (Abramowitz & Stegun approx, error < 1.5e-7) ─────────────────
function normCDF(z: number): number {
  const a1=0.254829592,a2=-0.284496736,a3=1.421413741,a4=-1.453152027,a5=1.061405429,p=0.3275911
  const sign = z < 0 ? -1 : 1
  const t = 1 / (1 + p * Math.abs(z))
  const y = 1 - (((((a5*t+a4)*t)+a3)*t+a2)*t+a1)*t*Math.exp(-z*z/2)
  return 0.5 * (1 + sign * y)
}

function outlierLabel(z: number): { text: string; color: string } {
  const a = Math.abs(z)
  if (a > 3)  return { text: 'Extreme outlier (|z| > 3)', color: '#f87171' }
  if (a > 2)  return { text: 'Unusual value (|z| > 2)', color: '#fb923c' }
  if (a > 1)  return { text: 'Moderately above average (|z| > 1)', color: '#fcd34d' }
  return { text: 'Within 1 SD of mean — typical', color: '#4ade80' }
}

const n = (s: string) => parseFloat(s)
const f4 = (v: number) => v.toFixed(4)
const f6 = (v: number) => v.toFixed(6)
const pct = (p: number) => `${(p * 100).toFixed(4)}%`

type Mode = 'single' | 'dataset'

// ─── Standard normal table rows (−3.4 to +3.4, step 0.1) ────────────────────
const Z_TABLE_ROWS: number[] = []
for (let z = -3.4; z <= 3.41; z += 0.1) Z_TABLE_ROWS.push(Math.round(z * 10) / 10)

// ─── Main component ───────────────────────────────────────────────────────────
export default function ZScoreCalculatorClient() {
  const [mode, setMode] = useState<Mode>('single')

  // Single mode
  const [x,  setX]  = useState('75')
  const [mu, setMu] = useState('70')
  const [sd, setSd] = useState('10')

  // Dataset mode
  const [dataText, setDataText] = useState('65, 70, 75, 80, 85, 90, 95')

  const [showTable, setShowTable] = useState(false)

  // ─── Single Z-score ───────────────────────────────────────────────────────
  const singleResult = useMemo(() => {
    if (mode !== 'single') return null
    const xv = n(x), mv = n(mu), sdv = n(sd)
    if (!isFinite(xv) || !isFinite(mv) || !isFinite(sdv) || sdv <= 0) return null
    const z = (xv - mv) / sdv
    const pBelow = normCDF(z)
    const pAbove = 1 - pBelow
    const pBetween = normCDF(Math.abs(z)) - normCDF(-Math.abs(z))
    const percentile = pBelow * 100
    return { z, pBelow, pAbove, pBetween, percentile }
  }, [mode, x, mu, sd])

  // ─── Dataset Z-scores ─────────────────────────────────────────────────────
  const datasetResult = useMemo(() => {
    if (mode !== 'dataset') return null
    const nums = dataText.split(/[\s,;]+/).map(Number).filter(v => isFinite(v) && !isNaN(v))
    if (nums.length < 2) return null
    const mean = nums.reduce((a, b) => a + b, 0) / nums.length
    const variance = nums.reduce((a, b) => a + (b - mean) ** 2, 0) / nums.length
    const std = Math.sqrt(variance)
    if (std === 0) return null
    const rows = nums.map((v, i) => {
      const z = (v - mean) / std
      const pBelow = normCDF(z)
      return { i: i + 1, value: v, z, pBelow, percentile: pBelow * 100, outlier: outlierLabel(z) }
    })
    return { mean, std, variance, rows }
  }, [mode, dataText])

  const tabStyle = (active: boolean): CSSProperties => ({
    padding: '8px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
    border: active ? '1px solid rgba(99,102,241,0.5)' : '1px solid transparent',
    background: active ? 'rgba(99,102,241,0.15)' : 'transparent',
    color: active ? '#c4b5fd' : 'var(--fg-3)',
  })

  async function handleExportPDF() {
    if (mode === 'single' && singleResult) {
      const { z, pBelow, pAbove, percentile } = singleResult
      await exportCalcPDF({
        toolName: 'Z-Score Calculator',
        inputs: [{ label: 'Value (x)', value: x }, { label: 'Mean (μ)', value: mu }, { label: 'Std Dev (σ)', value: sd }],
        results: [
          { label: 'Z-Score', value: f6(z), highlight: true },
          { label: 'Percentile Rank', value: `${f4(percentile)}%`, highlight: true },
          { label: 'P(Z < z)', value: pct(pBelow) },
          { label: 'P(Z > z)', value: pct(pAbove) },
          { label: 'Interpretation', value: outlierLabel(z).text },
        ],
        formula: 'z = (x − μ) / σ  |  P(Z<z) = Φ(z) (standard normal CDF)',
      })
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── INPUTS ── */}
      <div style={CARD}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <button onClick={() => setMode('single')} style={tabStyle(mode === 'single')}>Single Z-Score</button>
          <button onClick={() => setMode('dataset')} style={tabStyle(mode === 'dataset')}>Dataset Z-Scores</button>
        </div>

        {mode === 'single' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14 }}>
            <div><label style={LABEL}>Value (x)</label><input type="number" value={x} onChange={e => setX(e.target.value)} placeholder="75" step="any" style={INPUT_BOX} /></div>
            <div><label style={LABEL}>Mean (μ)</label><input type="number" value={mu} onChange={e => setMu(e.target.value)} placeholder="70" step="any" style={INPUT_BOX} /></div>
            <div><label style={LABEL}>Std Dev (σ)</label><input type="number" value={sd} onChange={e => setSd(e.target.value)} placeholder="10" step="any" min="0.0001" style={INPUT_BOX} /></div>
          </div>
        )}

        {mode === 'dataset' && (
          <div>
            <label style={LABEL}>Data values (comma or space separated)</label>
            <textarea value={dataText} onChange={e => setDataText(e.target.value)}
              placeholder="65, 70, 75, 80, 85, 90, 95"
              rows={3}
              style={{ ...INPUT_BOX, resize: 'vertical', fontFamily: 'monospace' }} />
            <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4 }}>
              Paste numbers separated by commas, spaces, or newlines. Min 2 values required.
            </div>
          </div>
        )}

        <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
          {mode === 'single' && <button onClick={() => { setX('75'); setMu('70'); setSd('10') }} style={{ ...BTN_GHOST, background: 'rgba(0,0,0,0.2)', color: 'var(--fg-3)' }}>Reset</button>}
          {mode === 'single' && singleResult && <button onClick={handleExportPDF} style={BTN_GHOST}>Export PDF</button>}
        </div>
      </div>

      {/* ── SINGLE RESULTS ── */}
      {mode === 'single' && n(sd) <= 0 && (
        <div style={{ color: '#f87171', fontSize: 13, padding: '10px 16px', background: 'rgba(248,113,113,0.08)', borderRadius: 8 }}>
          Standard deviation must be greater than zero.
        </div>
      )}

      {mode === 'single' && singleResult && (() => {
        const { z, pBelow, pAbove, pBetween, percentile } = singleResult
        const ol = outlierLabel(z)
        const dir = z >= 0 ? 'ABOVE' : 'BELOW'
        return (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
              <MetricCard label="Z-Score" value={f4(z)} color="#6366f1" />
              <MetricCard label="Percentile" value={`${f4(percentile)}%`} color="#10b981" sub={`Higher than ${f4(percentile)}% of values`} />
              <MetricCard label="P(Z < z)" value={pct(pBelow)} color="#8b5cf6" sub="Probability below" />
              <MetricCard label="P(Z > z)" value={pct(pAbove)} color="#f59e0b" sub="Probability above" />
              <MetricCard label="P(−|z|,|z|)" value={pct(pBetween)} color="#38bdf8" sub="Within ±|z| of mean" />
            </div>

            {/* Outlier badge */}
            <div style={{ ...CARD, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(0,0,0,0.25)' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: ol.color, flexShrink: 0 }} />
              <span style={{ fontSize: 14, color: ol.color, fontWeight: 700 }}>{ol.text}</span>
            </div>

            {/* Interpretation */}
            <div style={{ ...CARD, background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.2)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#c4b5fd', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Interpretation</div>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                The value <strong style={{ color: '#fff' }}>{x}</strong> is <strong style={{ color: '#fff' }}>{f4(Math.abs(z))} standard deviations {dir}</strong> the mean ({mu}).
                It is higher than <strong style={{ color: '#10b981' }}>{f4(percentile)}%</strong> of all values in this distribution.
                {Math.abs(z) > 2 ? ' This value is statistically unusual — consider whether it may be an outlier.' : ''}
              </p>
            </div>

            {/* Standard normal table */}
            <div>
              <button onClick={() => setShowTable(v => !v)} style={{ ...BTN_GHOST, width: '100%', justifyContent: 'space-between' }} aria-expanded={showTable}>
                <span>Standard Normal Table (z = −3.4 to +3.4)</span>
                <span>{showTable ? '▲' : '▼'}</span>
              </button>
              {showTable && (
                <div style={{ ...CARD, padding: 0, overflow: 'hidden', marginTop: 4 }}>
                  <div style={{ overflowX: 'auto', maxHeight: 400, overflowY: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                        <tr>
                          <th style={{ ...TH, minWidth: 50 }}>z</th>
                          {['.00','.01','.02','.03','.04','.05','.06','.07','.08','.09'].map(c => (
                            <th key={c} style={{ ...TH, minWidth: 54 }}>{c}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {Z_TABLE_ROWS.map(row => (
                          <tr key={row} style={{
                            borderBottom: '1px solid rgba(255,255,255,0.03)',
                            background: Math.abs(row - Math.round(z * 10) / 10) < 0.05 ? 'rgba(139,92,246,0.12)' : 'transparent',
                          }}>
                            <td style={{ ...TD, fontWeight: 700, color: 'var(--fg)', padding: '5px 10px' }}>{row.toFixed(1)}</td>
                            {[0,1,2,3,4,5,6,7,8,9].map(dec => {
                              const zv = row + dec * 0.01
                              const isHighlight = Math.abs(zv - z) < 0.005
                              return (
                                <td key={dec} style={{ ...TD, padding: '5px 10px', color: isHighlight ? '#c4b5fd' : 'var(--fg-2)', fontWeight: isHighlight ? 700 : 400 }}>
                                  {normCDF(zv).toFixed(4)}
                                </td>
                              )
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </>
        )
      })()}

      {/* ── DATASET RESULTS ── */}
      {mode === 'dataset' && datasetResult && (() => {
        const { mean, std, variance, rows } = datasetResult
        const outliers2 = rows.filter(r => Math.abs(r.z) > 2).length
        const outliers3 = rows.filter(r => Math.abs(r.z) > 3).length
        return (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
              <MetricCard label="Mean μ" value={f4(mean)} color="#6366f1" />
              <MetricCard label="Std Dev σ" value={f4(std)} color="#8b5cf6" />
              <MetricCard label="Variance σ²" value={f4(variance)} color="#f59e0b" />
              <MetricCard label="Values" value={String(rows.length)} color="#38bdf8" />
              {outliers2 > 0 && <MetricCard label="|z|>2 Unusual" value={String(outliers2)} color="#fb923c" />}
              {outliers3 > 0 && <MetricCard label="|z|>3 Extreme" value={String(outliers3)} color="#f87171" />}
            </div>

            <div style={CARD}>
              <div style={{ fontSize: 12, color: 'var(--fg-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14 }}>
                Z-Scores for Each Value
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['#', 'Value', 'Z-Score', 'Percentile', 'P(Z<z)', 'Flag'].map(h => (
                        <th key={h} style={{ ...TH, textAlign: h === '#' || h === 'Flag' ? 'center' : 'right' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(r => (
                      <tr key={r.i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: Math.abs(r.z) > 2 ? 'rgba(251,146,60,0.05)' : 'transparent' }}>
                        <td style={{ ...TD, textAlign: 'center', color: 'var(--fg-3)' }}>{r.i}</td>
                        <td style={{ ...TD, textAlign: 'right' }}>{r.value}</td>
                        <td style={{ ...TD, textAlign: 'right', color: r.z > 0 ? '#4ade80' : r.z < 0 ? '#f87171' : 'var(--fg-2)', fontWeight: 600 }}>{f4(r.z)}</td>
                        <td style={{ ...TD, textAlign: 'right' }}>{f4(r.percentile)}%</td>
                        <td style={{ ...TD, textAlign: 'right' }}>{pct(r.pBelow)}</td>
                        <td style={{ ...TD, textAlign: 'center', fontSize: 11, color: r.outlier.color }}>{Math.abs(r.z) > 2 ? r.outlier.text : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )
      })()}

      {mode === 'dataset' && !datasetResult && (
        <div style={{ ...CARD, textAlign: 'center', padding: '40px 20px', color: 'var(--fg-3)', fontSize: 14 }}>
          Enter at least 2 numeric values above to compute dataset z-scores.
        </div>
      )}
    </div>
  )
}
