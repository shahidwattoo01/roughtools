'use client'
import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { exportCalcPDF } from '@/lib/calcPdf'

// ─── Style tokens ─────────────────────────────────────────────────────────────

const CARD: CSSProperties = {
  background: 'var(--bg-1)',
  border: '1px solid var(--line-strong)',
  borderRadius: 16,
  padding: '24px 28px',
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
  padding: '9px 12px', fontWeight: 700, fontSize: 11,
  textTransform: 'uppercase', letterSpacing: '0.07em',
  color: 'var(--fg-3)', textAlign: 'right', background: 'rgba(99,102,241,0.1)',
  whiteSpace: 'nowrap',
}
const TD: CSSProperties = { padding: '7px 12px', fontSize: 12, textAlign: 'right', color: 'var(--fg-2)', whiteSpace: 'nowrap' }

type Mode = 'error' | 'difference' | 'change'

// ─── MetricCard ───────────────────────────────────────────────────────────────

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

// ─── Accuracy rating ─────────────────────────────────────────────────────────

function accuracyRating(pct: number): { label: string; color: string; desc: string } {
  if (pct < 1)  return { label: 'Excellent', color: '#10b981', desc: '< 1%  — Research / instrument grade' }
  if (pct < 5)  return { label: 'Good',      color: '#6ee7b7', desc: '1–5%  — Acceptable for most lab work' }
  if (pct < 10) return { label: 'Acceptable',color: '#f59e0b', desc: '5–10% — Borderline; review technique' }
  return              { label: 'Poor',       color: '#ef4444', desc: '> 10% — Review measurement method' }
}

// ─── Field component ──────────────────────────────────────────────────────────

function Field({ label, value, onChange, placeholder, hint }: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; hint?: string
}) {
  return (
    <div>
      <label style={LABEL}>{label}</label>
      <input type="number" value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} step="any" style={INPUT_BOX} aria-label={label} />
      {hint && <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 3 }}>{hint}</div>}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PercentErrorCalculatorClient() {
  const [mode, setMode] = useState<Mode>('error')

  // Percent Error inputs
  const [experimental, setExperimental] = useState('9.6')
  const [theoretical,  setTheoretical]  = useState('10')

  // Percent Difference inputs
  const [v1, setV1] = useState('45')
  const [v2, setV2] = useState('55')

  // Percent Change inputs
  const [oldVal, setOldVal] = useState('80')
  const [newVal, setNewVal] = useState('100')

  const [showScenario, setShowScenario] = useState(false)

  // ─── Percent Error ────────────────────────────────────────────────────────────
  const errorResult = useMemo(() => {
    const exp = parseFloat(experimental)
    const thr = parseFloat(theoretical)
    if (isNaN(exp) || isNaN(thr) || thr === 0) return null
    const absError      = Math.abs(exp - thr)
    const signedError   = exp - thr
    const pctError      = (absError / Math.abs(thr)) * 100
    const relativeError = signedError / thr
    const direction     = signedError > 0 ? 'Over-estimate' : signedError < 0 ? 'Under-estimate' : 'Exact match'
    return { exp, thr, absError, signedError, pctError, relativeError, direction }
  }, [experimental, theoretical])

  // ─── Percent Difference ───────────────────────────────────────────────────────
  const diffResult = useMemo(() => {
    const a = parseFloat(v1), b = parseFloat(v2)
    if (isNaN(a) || isNaN(b) || (a + b) === 0) return null
    const avg     = (a + b) / 2
    const pctDiff = (Math.abs(a - b) / Math.abs(avg)) * 100
    return { a, b, avg, pctDiff }
  }, [v1, v2])

  // ─── Percent Change ───────────────────────────────────────────────────────────
  const changeResult = useMemo(() => {
    const o = parseFloat(oldVal), n = parseFloat(newVal)
    if (isNaN(o) || isNaN(n) || o === 0) return null
    const change    = n - o
    const pctChange = (change / Math.abs(o)) * 100
    const direction = change > 0 ? 'Increase' : change < 0 ? 'Decrease' : 'No change'
    return { o, n, change, pctChange, direction }
  }, [oldVal, newVal])

  // ─── Scenario table (±5, 10, 15, 20%) ───────────────────────────────────────
  const scenarioRows = useMemo(() => {
    const thr = parseFloat(theoretical) || 10
    return [-20, -15, -10, -5, 5, 10, 15, 20].map(offsetPct => {
      const exp     = thr * (1 + offsetPct / 100)
      const pct     = (Math.abs(exp - thr) / Math.abs(thr)) * 100
      const rating  = accuracyRating(pct)
      return { offsetPct, exp, pct, rating }
    })
  }, [theoretical])

  // ─── Active result for export ─────────────────────────────────────────────────
  function handleExport() {
    if (mode === 'error' && errorResult) {
      const rating = accuracyRating(errorResult.pctError)
      exportCalcPDF({
        toolName: 'Percent Error Calculator',
        inputs: [
          { label: 'Experimental Value', value: String(errorResult.exp) },
          { label: 'Theoretical Value',  value: String(errorResult.thr) },
        ],
        results: [
          { label: 'Percent Error',    value: `${errorResult.pctError.toFixed(4)}%`, highlight: true },
          { label: 'Absolute Error',   value: errorResult.absError.toFixed(6) },
          { label: 'Signed Error',     value: errorResult.signedError.toFixed(6) },
          { label: 'Relative Error',   value: errorResult.relativeError.toFixed(6) },
          { label: 'Direction',        value: errorResult.direction },
          { label: 'Accuracy Rating',  value: rating.label },
        ],
        formula: '% Error = |Experimental − Theoretical| / |Theoretical| × 100',
      })
    } else if (mode === 'difference' && diffResult) {
      exportCalcPDF({
        toolName: 'Percent Difference Calculator',
        inputs: [{ label: 'Value 1', value: String(diffResult.a) }, { label: 'Value 2', value: String(diffResult.b) }],
        results: [
          { label: 'Percent Difference', value: `${diffResult.pctDiff.toFixed(4)}%`, highlight: true },
          { label: 'Average',            value: diffResult.avg.toFixed(6) },
          { label: 'Absolute Diff',      value: Math.abs(diffResult.a - diffResult.b).toFixed(6) },
        ],
        formula: '% Diff = |V₁−V₂| / ((V₁+V₂)/2) × 100',
      })
    } else if (mode === 'change' && changeResult) {
      exportCalcPDF({
        toolName: 'Percent Change Calculator',
        inputs: [{ label: 'Old Value', value: String(changeResult.o) }, { label: 'New Value', value: String(changeResult.n) }],
        results: [
          { label: 'Percent Change', value: `${changeResult.pctChange.toFixed(4)}%`, highlight: true },
          { label: 'Absolute Change',value: changeResult.change.toFixed(6) },
          { label: 'Direction',      value: changeResult.direction },
        ],
        formula: '% Change = (New − Old) / |Old| × 100',
      })
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── MODE TABS ── */}
      <div style={CARD}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {([
            { id: 'error',      label: 'Percent Error' },
            { id: 'difference', label: 'Percent Difference' },
            { id: 'change',     label: 'Percent Change' },
          ] as { id: Mode; label: string }[]).map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setMode(id)}
              style={{
                padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                border: mode === id ? '1px solid #6366f1' : '1px solid var(--line-strong)',
                background: mode === id ? 'rgba(99,102,241,0.2)' : 'rgba(0,0,0,0.2)',
                color: mode === id ? '#c4b5fd' : 'var(--fg-3)',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {mode === 'error' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            <Field label="Experimental Value" value={experimental} onChange={setExperimental}
              placeholder="9.6" hint="Measured / observed value" />
            <Field label="Theoretical Value"  value={theoretical}  onChange={setTheoretical}
              placeholder="10"  hint="Accepted / true value (≠ 0)" />
          </div>
        )}

        {mode === 'difference' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            <Field label="Value 1 (V₁)" value={v1} onChange={setV1} placeholder="45" hint="Neither value is the 'true' value" />
            <Field label="Value 2 (V₂)" value={v2} onChange={setV2} placeholder="55" />
          </div>
        )}

        {mode === 'change' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            <Field label="Old Value" value={oldVal} onChange={setOldVal} placeholder="80" hint="Starting / baseline value (≠ 0)" />
            <Field label="New Value" value={newVal} onChange={setNewVal} placeholder="100" hint="Ending / final value" />
          </div>
        )}
      </div>

      {/* ── RESULTS: PERCENT ERROR ── */}
      {mode === 'error' && errorResult && (() => {
        const rating = accuracyRating(errorResult.pctError)
        return (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
              <MetricCard label="Percent Error"   value={`${errorResult.pctError.toFixed(4)}%`}           color="#6366f1" />
              <MetricCard label="Absolute Error"  value={errorResult.absError.toFixed(4)}                 color="#f59e0b"
                sub={`|${errorResult.exp} − ${errorResult.thr}|`} />
              <MetricCard label="Relative Error"  value={errorResult.relativeError.toFixed(4)}            color="#38bdf8" />
              <MetricCard label="Direction"       value={errorResult.direction}
                color={errorResult.signedError > 0 ? '#f59e0b' : errorResult.signedError < 0 ? '#6366f1' : '#10b981'} />
              <MetricCard label="Accuracy"        value={rating.label}                                    color={rating.color}
                sub={rating.desc} />
            </div>

            <div style={{ ...CARD, padding: '16px 20px' }}>
              <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Formula Breakdown</div>
              <div style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.9 }}>
                <div>% Error = |Exp − Thr| / |Thr| × 100</div>
                <div>= |{errorResult.exp} − {errorResult.thr}| / |{errorResult.thr}| × 100</div>
                <div>= {errorResult.absError.toFixed(4)} / {Math.abs(errorResult.thr)} × 100 = <strong style={{ color: '#6366f1' }}>{errorResult.pctError.toFixed(4)}%</strong></div>
              </div>
              <div style={{ marginTop: 12, display: 'flex', gap: 10 }}>
                <button onClick={handleExport} style={BTN_GHOST}>Export PDF</button>
              </div>
            </div>
          </>
        )
      })()}

      {/* ── RESULTS: PERCENT DIFFERENCE ── */}
      {mode === 'difference' && diffResult && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
          <MetricCard label="Percent Difference" value={`${diffResult.pctDiff.toFixed(4)}%`}              color="#6366f1" />
          <MetricCard label="Absolute Diff"      value={Math.abs(diffResult.a - diffResult.b).toFixed(4)} color="#f59e0b" />
          <MetricCard label="Average of V₁, V₂"  value={diffResult.avg.toFixed(4)}                        color="#38bdf8"
            sub="Used as denominator" />
          <MetricCard label="Formula"            value="% Diff"                                            color="#10b981"
            sub="|V₁−V₂| / avg × 100" />
        </div>
      )}

      {/* ── RESULTS: PERCENT CHANGE ── */}
      {mode === 'change' && changeResult && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
          <MetricCard label="Percent Change"    value={`${changeResult.pctChange > 0 ? '+' : ''}${changeResult.pctChange.toFixed(4)}%`}
            color={changeResult.pctChange > 0 ? '#10b981' : changeResult.pctChange < 0 ? '#ef4444' : '#6366f1'} />
          <MetricCard label="Absolute Change"   value={`${changeResult.change > 0 ? '+' : ''}${changeResult.change.toFixed(4)}`}
            color="#f59e0b" />
          <MetricCard label="Direction"         value={changeResult.direction}
            color={changeResult.pctChange > 0 ? '#10b981' : '#ef4444'} />
          <MetricCard label="Old → New"         value={`${changeResult.o} → ${changeResult.n}`}            color="#38bdf8" />
        </div>
      )}

      {/* ── ACCURACY RATING TABLE ── */}
      <div style={CARD}>
        <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          Accuracy Rating Reference
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                {['Range', 'Rating', 'Typical Application'].map(h => (
                  <th key={h} style={{ ...TH, textAlign: 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { range: '< 1%',    rating: 'Excellent', color: '#10b981', app: 'Research instruments, precision manufacturing, analytical chemistry' },
                { range: '1% – 5%', rating: 'Good',      color: '#6ee7b7', app: 'Most undergraduate labs, engineering measurements, quality control' },
                { range: '5% – 10%',rating: 'Acceptable',color: '#f59e0b', app: 'Field measurements, rough estimates, introductory coursework' },
                { range: '> 10%',   rating: 'Poor',       color: '#ef4444', app: 'Indicates instrument error, procedural mistake, or outlier data' },
              ].map(row => (
                <tr key={row.range} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ ...TD, textAlign: 'left', fontWeight: 700, color: row.color }}>{row.range}</td>
                  <td style={{ ...TD, textAlign: 'left', color: row.color }}>{row.rating}</td>
                  <td style={{ ...TD, textAlign: 'left', color: 'var(--fg-3)' }}>{row.app}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── SCENARIO TABLE ── */}
      {mode === 'error' && (
        <div>
          <button onClick={() => setShowScenario(v => !v)} style={BTN_GHOST} aria-expanded={showScenario}>
            {showScenario ? '▾' : '▸'} Scenario: Experimental Values at ±5%, ±10%, ±15%, ±20%
          </button>

          {showScenario && (
            <div style={{ ...CARD, padding: 0, overflow: 'hidden', marginTop: 8 }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr>
                      <th style={TH}>Offset</th>
                      <th style={TH}>Experimental Value</th>
                      <th style={TH}>Percent Error</th>
                      <th style={TH}>Accuracy Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scenarioRows.map(row => (
                      <tr key={row.offsetPct} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ ...TD, color: row.offsetPct > 0 ? '#10b981' : '#ef4444', fontWeight: 700 }}>
                          {row.offsetPct > 0 ? '+' : ''}{row.offsetPct}%
                        </td>
                        <td style={TD}>{row.exp.toFixed(4)}</td>
                        <td style={{ ...TD, color: row.rating.color, fontWeight: 600 }}>{row.pct.toFixed(4)}%</td>
                        <td style={{ ...TD, color: row.rating.color }}>{row.rating.label}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── APPLICATIONS ── */}
      <div style={{ ...CARD, background: 'rgba(99,102,241,0.05)', borderColor: 'rgba(99,102,241,0.2)' }}>
        <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: '#c4b5fd', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          Real-World Applications
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          {[
            { field: 'Chemistry Labs',       icon: '⚗', uses: 'Titration accuracy, molar mass verification, stoichiometry yield analysis' },
            { field: 'Physics Experiments',  icon: '⚡', uses: "Gravity measurements, Ohm's law verification, velocity vs. theoretical predictions" },
            { field: 'Engineering',          icon: '⚙', uses: 'Tolerance analysis, dimensional inspection, stress/strain measurements' },
            { field: 'Forecast Accuracy',    icon: '📊', uses: 'Weather predictions, economic models, machine learning evaluation (MAPE)' },
          ].map(item => (
            <div key={item.field} style={{ padding: '12px 14px', background: 'rgba(0,0,0,0.2)', borderRadius: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-2)', marginBottom: 4 }}>
                {item.icon} {item.field}
              </div>
              <div style={{ fontSize: 12, color: 'var(--fg-3)', lineHeight: 1.6 }}>{item.uses}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
