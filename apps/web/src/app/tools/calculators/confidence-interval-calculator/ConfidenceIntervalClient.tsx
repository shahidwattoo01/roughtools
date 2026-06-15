'use client'
import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { exportCalcPDF } from '@/lib/calcPdf'

const N_TABLE_SIZES = [10, 25, 50, 100, 250, 500, 1000]
const SCENARIO_CLS = ['80', '90', '95', '99']

// ─── Style tokens ─────────────────────────────────────────────────────────────

const CARD: CSSProperties = {
  background: 'var(--bg-1)',
  border: '1px solid var(--line-strong)',
  borderRadius: 16,
  padding: '24px 28px',
}
const INPUT_BOX: CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 8,
  background: 'var(--bg-2)', border: '1px solid var(--line-strong)',
  color: 'var(--fg)', fontSize: 15, boxSizing: 'border-box',
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
const TD: CSSProperties = { padding: '7px 12px', fontSize: 12, textAlign: 'right', color: 'var(--fg-2)', whiteSpace: 'nowrap' }

// ─── Z and t critical values ──────────────────────────────────────────────────

const Z_CRITS: Record<string, number> = {
  '80': 1.282, '85': 1.440, '90': 1.645, '95': 1.960, '99': 2.576,
}

// Approximate t critical values by degrees of freedom and confidence level
// Using t-table lookup for common df values
const T_TABLE: Record<number, Record<string, number>> = {
  1:   { '80': 3.078, '85': 4.165, '90': 6.314, '95': 12.706, '99': 63.657 },
  2:   { '80': 1.886, '85': 2.282, '90': 2.920, '95': 4.303,  '99': 9.925  },
  3:   { '80': 1.638, '85': 1.924, '90': 2.353, '95': 3.182,  '99': 5.841  },
  4:   { '80': 1.533, '85': 1.778, '90': 2.132, '95': 2.776,  '99': 4.604  },
  5:   { '80': 1.476, '85': 1.699, '90': 2.015, '95': 2.571,  '99': 4.032  },
  6:   { '80': 1.440, '85': 1.650, '90': 1.943, '95': 2.447,  '99': 3.707  },
  7:   { '80': 1.415, '85': 1.617, '90': 1.895, '95': 2.365,  '99': 3.499  },
  8:   { '80': 1.397, '85': 1.592, '90': 1.860, '95': 2.306,  '99': 3.355  },
  9:   { '80': 1.383, '85': 1.574, '90': 1.833, '95': 2.262,  '99': 3.250  },
  10:  { '80': 1.372, '85': 1.559, '90': 1.812, '95': 2.228,  '99': 3.169  },
  12:  { '80': 1.356, '85': 1.538, '90': 1.782, '95': 2.179,  '99': 3.055  },
  15:  { '80': 1.341, '85': 1.517, '90': 1.753, '95': 2.131,  '99': 2.947  },
  20:  { '80': 1.325, '85': 1.497, '90': 1.725, '95': 2.086,  '99': 2.845  },
  25:  { '80': 1.316, '85': 1.485, '90': 1.708, '95': 2.060,  '99': 2.787  },
  29:  { '80': 1.311, '85': 1.479, '90': 1.699, '95': 2.045,  '99': 2.756  },
}

function getTCrit(df: number, cl: string): number {
  // Find nearest df in table
  const keys = Object.keys(T_TABLE).map(Number).sort((a, b) => a - b)
  let best = keys[0]
  for (const k of keys) {
    if (k <= df) best = k
    else break
  }
  return T_TABLE[best]?.[cl] ?? Z_CRITS[cl] ?? 1.96
}

// ─── MetricCard ───────────────────────────────────────────────────────────────

function MetricCard({ label, value, sub, color = '#6366f1' }: {
  label: string; value: string; sub?: string; color?: string
}) {
  return (
    <div style={{ padding: '18px 14px', background: 'var(--bg-2)', borderRadius: 12, textAlign: 'center' }}>
      <div style={{ fontSize: 20, fontWeight: 900, color, fontFamily: 'monospace' }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ConfidenceIntervalClient() {
  const [mean,     setMean]     = useState('50')
  const [sd,       setSd]       = useState('10')
  const [n,        setN]        = useState('30')
  const [cl,       setCl]       = useState('95')
  const [useT,     setUseT]     = useState(false)   // manual override
  const [showAdv,  setShowAdv]  = useState(false)
  const [showNtbl, setShowNtbl] = useState(false)

  const mn   = parseFloat(mean) || 0
  const sdn  = parseFloat(sd)   || 0
  const nn   = parseInt(n)      || 0
  const valid = sdn > 0 && nn >= 1 && mean.trim() !== ''

  // Auto-select t if n < 30 or user overrides
  const autoT  = nn < 30
  const useDistT = useT || autoT
  const df     = nn - 1

  const critVal = useMemo(() => {
    if (!valid) return 0
    return useDistT ? getTCrit(df, cl) : (Z_CRITS[cl] ?? 1.96)
  }, [useDistT, df, cl, valid])

  const se    = valid ? sdn / Math.sqrt(nn) : 0
  const me    = valid ? critVal * se : 0
  const lower = mn - me
  const upper = mn + me
  const width = upper - lower

  // Effect-of-n table
  const nTableRows = useMemo(() => {
    if (!valid) return []
    return N_TABLE_SIZES.map(sz => {
      const seSz = sdn / Math.sqrt(sz)
      const distT = sz < 30
      const cv = distT ? getTCrit(sz - 1, cl) : (Z_CRITS[cl] ?? 1.96)
      const meSz = cv * seSz
      return { n: sz, se: seSz, me: meSz, width: meSz * 2, lower: mn - meSz, upper: mn + meSz }
    })
  }, [valid, sdn, cl, mn])

  // Scenario: same data at 4 confidence levels
  const scenarioRows = useMemo(() => {
    if (!valid) return []
    return SCENARIO_CLS.map(level => {
      const cv = useDistT ? getTCrit(df, level) : (Z_CRITS[level] ?? 1.96)
      const meSc = cv * se
      return { level, cv, me: meSc, lower: mn - meSc, upper: mn + meSc, width: meSc * 2 }
    })
  }, [valid, useDistT, df, se, mn])

  const fmt = (v: number, d = 4) => v.toFixed(d)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── INPUTS ── */}
      <div style={CARD}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={LABEL}>Sample Mean (x̄)</label>
            <input type="number" style={INPUT_BOX} value={mean}
              onChange={e => setMean(e.target.value)} placeholder="50" step={0.001} />
          </div>
          <div>
            <label style={LABEL}>Std Deviation (σ or s)</label>
            <input type="number" style={INPUT_BOX} value={sd}
              onChange={e => setSd(e.target.value)} placeholder="10" min={0.001} step={0.001} />
          </div>
          <div>
            <label style={LABEL}>Sample Size (n)</label>
            <input type="number" style={INPUT_BOX} value={n}
              onChange={e => setN(e.target.value)} placeholder="30" min={1} step={1} />
          </div>
          <div>
            <label style={LABEL}>Confidence Level</label>
            <select style={{ ...INPUT_BOX, cursor: 'pointer' }} value={cl} onChange={e => setCl(e.target.value)}>
              {Object.keys(Z_CRITS).map(v => (
                <option key={v} value={v}>{v}% (Z = {Z_CRITS[v]})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Distribution note */}
        <div style={{ padding: '10px 14px', borderRadius: 8, background: autoT ? 'rgba(245,158,11,0.08)' : 'rgba(0,0,0,0.2)', border: `1px solid ${autoT ? 'rgba(245,158,11,0.3)' : 'var(--line-strong)'}`, fontSize: 12, color: 'var(--fg-3)' }}>
          {autoT
            ? `n = ${nn} < 30: automatically using t-distribution (df = ${df}). Critical value: t = ${critVal.toFixed(3)}.`
            : `n = ${nn} ≥ 30: using Z-distribution. Critical value: Z = ${critVal.toFixed(3)}.`}
          <button onClick={() => setUseT(v => !v)} style={{ ...BTN_GHOST, marginLeft: 10, padding: '4px 10px', fontSize: 11 }}>
            {useT ? 'Using t (override)' : useDistT ? 'Using t (auto)' : 'Switch to t'}
          </button>
        </div>

        {/* Validation errors */}
        {sdn <= 0 && <div style={{ marginTop: 8, color: '#f87171', fontSize: 13 }}>Standard deviation must be greater than zero.</div>}
        {nn < 1 && <div style={{ marginTop: 8, color: '#f87171', fontSize: 13 }}>Sample size must be at least 1.</div>}

        {/* Advanced toggle */}
        <button onClick={() => setShowAdv(v => !v)} style={{ ...BTN_GHOST, marginTop: 14 }} aria-expanded={showAdv}>
          {showAdv ? '▾' : '▸'} Formula Reference
        </button>

        {showAdv && (
          <div style={{ marginTop: 14, padding: '14px', borderRadius: 10, background: 'var(--bg-2)', fontSize: 12, color: 'var(--fg-3)', lineHeight: 2, fontFamily: 'monospace' }}>
            <div>SE = σ/√n = {fmt(sdn)}/√{nn} = <strong style={{ color: 'var(--brand-2)' }}>{fmt(se, 6)}</strong></div>
            <div>Critical value ({useDistT ? `t, df=${df}` : 'Z'}, {cl}%) = <strong style={{ color: 'var(--brand-2)' }}>{fmt(critVal, 4)}</strong></div>
            <div>ME = {useDistT ? 't' : 'Z'} × SE = {fmt(critVal, 4)} × {fmt(se, 6)} = <strong style={{ color: '#f59e0b' }}>{fmt(me, 6)}</strong></div>
            <div>CI = x̄ ± ME = {fmt(mn, 4)} ± {fmt(me, 4)} = <strong style={{ color: '#10b981' }}>[{fmt(lower, 4)}, {fmt(upper, 4)}]</strong></div>
          </div>
        )}
      </div>

      {/* ── MAIN RESULTS ── */}
      {valid ? (
        <>
          {/* Summary cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
            <MetricCard label="Lower Bound" value={fmt(lower, 4)} color="#6366f1" />
            <MetricCard label="Upper Bound" value={fmt(upper, 4)} color="#6366f1" />
            <MetricCard label="Margin of Error" value={'± ' + fmt(me, 4)} color="#f59e0b" />
            <MetricCard label="Standard Error"  value={fmt(se, 4)}   color="#10b981" />
            <MetricCard label={`Critical ${useDistT ? 't' : 'Z'}`} value={fmt(critVal, 3)} color="#38bdf8"
              sub={`${cl}% CI`} />
          </div>

          {/* CI range visualizer */}
          <div style={{ ...CARD, padding: '18px 24px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
              Confidence Interval Visualization
            </div>
            <div style={{ position: 'relative', height: 36, borderRadius: 8, background: 'var(--bg-2)', overflow: 'hidden', marginBottom: 8 }}>
              <div style={{
                position: 'absolute', top: 0, bottom: 0,
                left: '10%', right: '10%',
                background: 'rgba(99,102,241,0.2)', borderLeft: '2px solid #6366f1', borderRight: '2px solid #6366f1',
              }} />
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 3, height: '80%', background: '#f59e0b', borderRadius: 2,
              }} title={`Mean: ${fmt(mn, 4)}`} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--fg-3)' }}>
              <span style={{ color: '#6366f1', fontFamily: 'monospace' }}>{fmt(lower, 4)}</span>
              <span style={{ color: '#f59e0b' }}>x̄ = {fmt(mn, 4)}</span>
              <span style={{ color: '#6366f1', fontFamily: 'monospace' }}>{fmt(upper, 4)}</span>
            </div>

            {/* Interpretation */}
            <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(99,102,241,0.08)', borderRadius: 8, borderLeft: '3px solid #6366f1' }}>
              <p style={{ fontSize: 13, color: 'var(--fg-2)', margin: 0, lineHeight: 1.7 }}>
                We are <strong style={{ color: 'var(--brand-2)' }}>{cl}% confident</strong> that the true population mean lies between{' '}
                <strong style={{ color: '#6366f1', fontFamily: 'monospace' }}>{fmt(lower, 3)}</strong> and{' '}
                <strong style={{ color: '#6366f1', fontFamily: 'monospace' }}>{fmt(upper, 3)}</strong> (width: {fmt(width, 3)}).
              </p>
            </div>
          </div>

          {/* Scenario: 4 confidence levels */}
          <div style={CARD}>
            <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Same Data at 4 Confidence Levels
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr>
                    {['Conf. Level', 'Crit. Value', 'Margin of Error', 'Lower', 'Upper', 'Width'].map((h, i) => (
                      <th key={h} style={{ ...TH, textAlign: i === 0 ? 'left' : 'right' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {scenarioRows.map(r => (
                    <tr key={r.level} style={{
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      background: r.level === cl ? 'rgba(99,102,241,0.08)' : 'transparent',
                    }}>
                      <td style={{ ...TD, textAlign: 'left', color: r.level === cl ? 'var(--brand-2)' : 'var(--fg-2)', fontWeight: r.level === cl ? 700 : 400 }}>
                        {r.level === cl ? '★ ' : ''}{r.level}%
                      </td>
                      <td style={{ ...TD, fontFamily: 'monospace' }}>{fmt(r.cv, 3)}</td>
                      <td style={{ ...TD, color: '#f59e0b' }}>± {fmt(r.me, 4)}</td>
                      <td style={{ ...TD, color: '#6366f1', fontFamily: 'monospace' }}>{fmt(r.lower, 4)}</td>
                      <td style={{ ...TD, color: '#6366f1', fontFamily: 'monospace' }}>{fmt(r.upper, 4)}</td>
                      <td style={{ ...TD }}>{fmt(r.width, 4)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Effect of sample size table */}
          <button onClick={() => setShowNtbl(v => !v)} style={{
            width: '100%', textAlign: 'left', padding: '14px 20px',
            background: 'var(--bg-1)', border: '1px solid var(--line-strong)',
            borderRadius: 12, color: 'var(--brand-2)', fontWeight: 700, fontSize: 14, cursor: 'pointer',
          }} aria-expanded={showNtbl}>
            {showNtbl ? '▾' : '▸'} Effect of Sample Size on CI Width
          </button>

          {showNtbl && (
            <div style={{ ...CARD, padding: 0, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr>
                      {['Sample Size (n)', 'Std Error (SE)', 'Margin of Error', 'CI Width', 'Lower', 'Upper'].map((h, i) => (
                        <th key={h} style={{ ...TH, textAlign: i === 0 ? 'left' : 'right' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {nTableRows.map(r => (
                      <tr key={r.n} style={{
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        background: r.n === nn ? 'rgba(99,102,241,0.08)' : 'transparent',
                      }}>
                        <td style={{ ...TD, textAlign: 'left', color: r.n === nn ? 'var(--brand-2)' : 'var(--fg-2)', fontWeight: r.n === nn ? 700 : 400 }}>
                          {r.n === nn ? '★ ' : ''}{r.n}
                        </td>
                        <td style={{ ...TD, fontFamily: 'monospace' }}>{fmt(r.se, 4)}</td>
                        <td style={{ ...TD, color: '#f59e0b' }}>± {fmt(r.me, 4)}</td>
                        <td style={{ ...TD }}>{fmt(r.width, 4)}</td>
                        <td style={{ ...TD, color: '#6366f1', fontFamily: 'monospace' }}>{fmt(r.lower, 4)}</td>
                        <td style={{ ...TD, color: '#6366f1', fontFamily: 'monospace' }}>{fmt(r.upper, 4)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Export */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button style={BTN_GHOST} onClick={async () => exportCalcPDF({
              toolName: 'Confidence Interval Calculator',
              inputs: [
                { label: 'Sample Mean (x̄)',   value: mean },
                { label: 'Std Deviation (σ/s)', value: sd },
                { label: 'Sample Size (n)',     value: n },
                { label: 'Confidence Level',   value: `${cl}%` },
                { label: 'Distribution',       value: useDistT ? `t (df = ${df})` : 'Z (normal)' },
              ],
              results: [
                { label: `${cl}% CI`,          value: `[${fmt(lower, 4)}, ${fmt(upper, 4)}]`, highlight: true },
                { label: 'Lower Bound',         value: fmt(lower, 6), highlight: true },
                { label: 'Upper Bound',         value: fmt(upper, 6), highlight: true },
                { label: 'Margin of Error',     value: '± ' + fmt(me, 6) },
                { label: 'Standard Error (SE)', value: fmt(se, 6) },
                { label: `Critical ${useDistT ? 't' : 'Z'}`, value: fmt(critVal, 4) },
              ],
              formula: useDistT
                ? `CI = x̄ ± t*(s/√n) | t(df=${df}, ${cl}%) = ${fmt(critVal, 4)} | SE = ${fmt(se, 6)} | ME = ${fmt(me, 6)}`
                : `CI = x̄ ± Z*(σ/√n) | Z(${cl}%) = ${fmt(critVal, 3)} | SE = ${fmt(se, 6)} | ME = ${fmt(me, 6)}`,
            })}>
              Export PDF Report
            </button>
            <button style={BTN_GHOST} onClick={() => {
              navigator.clipboard.writeText(
                `${cl}% CI: [${fmt(lower, 6)}, ${fmt(upper, 6)}]\nMargin of Error: ±${fmt(me, 6)}\nStandard Error: ${fmt(se, 6)}\nCritical value: ${fmt(critVal, 4)}`
              )
            }}>
              Copy Results
            </button>
          </div>

          {/* Interpretation guide */}
          <div style={{ ...CARD, background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.2)' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: 'var(--brand-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              How to Interpret This Result
            </h3>
            <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                <strong style={{ color: 'var(--brand-2)' }}>Correct interpretation:</strong> If you repeated this study many times, {cl}% of the resulting confidence intervals would contain the true population mean. This specific interval [{fmt(lower, 3)}, {fmt(upper, 3)}] either does or does not — we just don&apos;t know which.
              </li>
              <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                <strong style={{ color: '#f87171' }}>Common mistake:</strong> A {cl}% CI does NOT mean &quot;there is a {cl}% probability the true mean is in this range.&quot; Probability applies to the procedure, not to a specific computed interval.
              </li>
              <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                <strong style={{ color: '#10b981' }}>Wider CI = more uncertainty.</strong> Increase n to narrow the interval. Quadrupling sample size halves the margin of error (√n relationship).
              </li>
              <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                {useDistT
                  ? `t-distribution was used (n = ${nn} < 30 or manual override). The t-distribution has heavier tails than Z, producing wider (more conservative) intervals for small samples.`
                  : `Z-distribution was used (n = ${nn} ≥ 30). For large samples, the t and Z distributions converge and produce nearly identical results.`}
              </li>
            </ul>
          </div>
        </>
      ) : (
        <div style={{ ...CARD, textAlign: 'center', padding: '40px 20px', color: 'var(--fg-3)', fontSize: 14 }}>
          Enter a sample mean, standard deviation, and sample size to calculate the confidence interval.
        </div>
      )}
    </div>
  )
}
