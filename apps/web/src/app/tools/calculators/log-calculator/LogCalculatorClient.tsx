'use client'
import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { exportCalcPDF } from '@/lib/calcPdf'

// ─── Shared style tokens ──────────────────────────────────────────────────────

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
const TD: CSSProperties = {
  padding: '6px 12px', fontSize: 12, textAlign: 'right',
  color: 'var(--fg-2)', whiteSpace: 'nowrap',
}

type LogMode = 'logarithm' | 'antilog' | 'change-of-base'

function TabBar({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (t: string) => void }) {
  return (
    <div style={{ display: 'flex', gap: 4, background: 'rgba(0,0,0,0.3)', padding: 4, borderRadius: 10, width: 'fit-content' }}>
      {tabs.map(t => (
        <button key={t} onClick={() => onChange(t)} style={{
          padding: '7px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
          background: active === t ? 'rgba(99,102,241,0.25)' : 'transparent',
          color: active === t ? '#c4b5fd' : 'var(--fg-3)',
        }}>{t}</button>
      ))}
    </div>
  )
}

function MetricCard({ label, value, sub, color = '#6366f1' }: {
  label: string; value: string; sub?: string; color?: string
}) {
  return (
    <div style={{ padding: '18px 14px', background: 'rgba(0,0,0,0.3)', borderRadius: 12, textAlign: 'center' }}>
      <div style={{ fontSize: 20, fontWeight: 900, color, wordBreak: 'break-all' }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

function fmt(n: number, digits = 8): string {
  if (!isFinite(n) || isNaN(n)) return '—'
  if (Math.abs(n) >= 1e-4 && Math.abs(n) < 1e10) return parseFloat(n.toPrecision(digits)).toString()
  return n.toExponential(digits - 1)
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LogCalculatorClient() {
  const [mode, setMode] = useState<LogMode>('logarithm')

  // Logarithm mode
  const [xVal, setXVal] = useState('100')
  const [customBase, setCustomBase] = useState('2')

  // Anti-log mode
  const [alogY, setAlogY] = useState('2')
  const [alogBase, setAlogBase] = useState('10')

  // Change of base mode
  const [cobX, setCobX] = useState('100')
  const [cobFrom, setCobFrom] = useState('10')
  const [cobTo, setCobTo] = useState('2')

  const [showTable, setShowTable] = useState(false)

  // ─── Logarithm results ────────────────────────────────────────────────────

  const logResult = useMemo(() => {
    const x = parseFloat(xVal)
    const b = parseFloat(customBase)
    if (!x || x <= 0) return null
    const log10 = Math.log10(x)
    const ln = Math.log(x)
    const log2 = Math.log2(x)
    const logB = (b > 0 && b !== 1) ? Math.log(x) / Math.log(b) : NaN
    return { log10, ln, log2, logB, x, b }
  }, [xVal, customBase])

  // ─── Anti-log results ─────────────────────────────────────────────────────

  const alogResult = useMemo(() => {
    const y = parseFloat(alogY)
    const b = parseFloat(alogBase)
    if (isNaN(y) || !b || b <= 0 || b === 1) return null
    const x = Math.pow(b, y)
    return { x, y, b, step1: `x = b^y = ${b}^${y}`, step2: `x = ${fmt(x)}` }
  }, [alogY, alogBase])

  // ─── Change of base ───────────────────────────────────────────────────────

  const cobResult = useMemo(() => {
    const x = parseFloat(cobX)
    const from = parseFloat(cobFrom)
    const to = parseFloat(cobTo)
    if (!x || x <= 0 || !from || from <= 0 || from === 1 || !to || to <= 0 || to === 1) return null
    const result = Math.log(x) / Math.log(to)
    const numeratorLn = Math.log(x)
    const denominatorLn = Math.log(to)
    const numeratorLog10 = Math.log10(x)
    const denominatorLog10 = Math.log10(to)
    const original = Math.log(x) / Math.log(from)
    return {
      result, original, x, from, to,
      numeratorLn, denominatorLn,
      numeratorLog10, denominatorLog10,
      usingLn: `log_${to}(${x}) = ln(${x}) / ln(${to}) = ${fmt(numeratorLn)} / ${fmt(denominatorLn)}`,
      usingLog10: `log_${to}(${x}) = log(${x}) / log(${to}) = ${fmt(numeratorLog10)} / ${fmt(denominatorLog10)}`,
    }
  }, [cobX, cobFrom, cobTo])

  // ─── Scenario: same x with 4 bases ────────────────────────────────────────

  const scenarioResult = useMemo(() => {
    const x = parseFloat(xVal)
    const b = parseFloat(customBase)
    if (!x || x <= 0) return null
    const bases = [2, 10, Math.E, b].filter(v => isFinite(v) && v > 0 && v !== 1)
    const unique = [...new Set(bases)]
    return unique.map(base => ({
      base: base === Math.E ? 'e' : String(base),
      label: base === Math.E ? 'ln(x)' : base === 2 ? 'log₂(x)' : base === 10 ? 'log₁₀(x)' : `log_${base}(x)`,
      value: Math.log(x) / Math.log(base),
    }))
  }, [xVal, customBase])

  // ─── Log table 1-100 ──────────────────────────────────────────────────────

  const logTable = useMemo(() =>
    Array.from({ length: 100 }, (_, i) => ({
      n: i + 1,
      log10: Math.log10(i + 1),
      ln: Math.log(i + 1),
      log2: Math.log2(i + 1),
    }))
  , [])

  const RULES = [
    { rule: 'logₐ(x·y) = logₐ(x) + logₐ(y)', name: 'Product Rule' },
    { rule: 'logₐ(x/y) = logₐ(x) − logₐ(y)', name: 'Quotient Rule' },
    { rule: 'logₐ(xⁿ) = n · logₐ(x)', name: 'Power Rule' },
    { rule: 'logₐ(1) = 0', name: 'Log of 1' },
    { rule: 'logₐ(a) = 1', name: 'Log of base' },
    { rule: 'logₐ(x) = log(x)/log(a) = ln(x)/ln(a)', name: 'Change of Base' },
    { rule: 'a^(logₐ(x)) = x', name: 'Inverse' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── MODE TABS ── */}
      <TabBar
        tabs={['Logarithm', 'Anti-log', 'Change of Base']}
        active={mode === 'logarithm' ? 'Logarithm' : mode === 'antilog' ? 'Anti-log' : 'Change of Base'}
        onChange={t => setMode(t === 'Logarithm' ? 'logarithm' : t === 'Anti-log' ? 'antilog' : 'change-of-base')}
      />

      {/* ── LOGARITHM MODE ── */}
      {mode === 'logarithm' && (
        <>
          <div style={CARD}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
              <div>
                <label style={LABEL}>Value x (x &gt; 0)</label>
                <input type="number" value={xVal} onChange={e => setXVal(e.target.value)} min={0.0001} step={1} style={INPUT_BOX} />
              </div>
              <div>
                <label style={LABEL}>Custom Base b</label>
                <input type="number" value={customBase} onChange={e => setCustomBase(e.target.value)} min={0.0001} step={1} style={INPUT_BOX} />
              </div>
            </div>
          </div>

          {logResult && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
                <MetricCard label="log₁₀(x)" value={fmt(logResult.log10)} color="#6366f1" sub="Common log" />
                <MetricCard label="ln(x)" value={fmt(logResult.ln)} color="#10b981" sub="Natural log" />
                <MetricCard label="log₂(x)" value={fmt(logResult.log2)} color="#f59e0b" sub="Binary log" />
                <MetricCard label={`log_${logResult.b}(x)`} value={fmt(logResult.logB)} color="#38bdf8" sub={`Base ${logResult.b}`} />
              </div>

              {/* Step-by-step */}
              <div style={{ ...CARD, padding: '16px 20px', background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.2)' }}>
                <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Step-by-step</div>
                <div style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--fg-2)', lineHeight: 2.2 }}>
                  <div>log₁₀({logResult.x}) = log₁₀({logResult.x}) = <strong style={{ color: '#6366f1' }}>{fmt(logResult.log10)}</strong></div>
                  <div>ln({logResult.x}) = loge({logResult.x}) = <strong style={{ color: '#10b981' }}>{fmt(logResult.ln)}</strong></div>
                  <div>log₂({logResult.x}) = ln({logResult.x})/ln(2) = {fmt(logResult.ln)}/{fmt(Math.LN2)} = <strong style={{ color: '#f59e0b' }}>{fmt(logResult.log2)}</strong></div>
                  {isFinite(logResult.logB) && (
                    <div>log_{logResult.b}({logResult.x}) = ln({logResult.x})/ln({logResult.b}) = {fmt(logResult.ln)}/{fmt(Math.log(logResult.b))} = <strong style={{ color: '#38bdf8' }}>{fmt(logResult.logB)}</strong></div>
                  )}
                </div>
              </div>

              {/* Scenario */}
              {scenarioResult && (
                <div style={CARD}>
                  <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                    Same x = {logResult.x}, Different Bases
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
                    {scenarioResult.map(s => (
                      <MetricCard key={s.base} label={s.label} value={fmt(s.value)} color="#6366f1" sub={`base ${s.base}`} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* ── ANTI-LOG MODE ── */}
      {mode === 'antilog' && (
        <>
          <div style={CARD}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
              <div>
                <label style={LABEL}>Log Value y</label>
                <input type="number" value={alogY} onChange={e => setAlogY(e.target.value)} step={0.1} style={INPUT_BOX} />
              </div>
              <div>
                <label style={LABEL}>Base b</label>
                <input type="number" value={alogBase} onChange={e => setAlogBase(e.target.value)} min={0.0001} step={1} style={INPUT_BOX} />
              </div>
            </div>
          </div>

          {alogResult && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
                <MetricCard label="x = b^y" value={fmt(alogResult.x)} color="#6366f1" sub={`antilog_${alogResult.b}(${alogResult.y})`} />
                <MetricCard label="Base b" value={String(alogResult.b)} color="#38bdf8" />
                <MetricCard label="Log value y" value={String(alogResult.y)} color="#10b981" />
              </div>
              <div style={{ ...CARD, padding: '16px 20px', background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.2)' }}>
                <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Working</div>
                <div style={{ fontFamily: 'monospace', fontSize: 14, color: 'var(--fg-2)', lineHeight: 2 }}>
                  <div>log_{alogResult.b}(x) = {alogResult.y}</div>
                  <div>x = {alogResult.b}^{alogResult.y}</div>
                  <div>x = <strong style={{ color: '#6366f1', fontSize: 18 }}>{fmt(alogResult.x)}</strong></div>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* ── CHANGE OF BASE MODE ── */}
      {mode === 'change-of-base' && (
        <>
          <div style={CARD}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16 }}>
              <div>
                <label style={LABEL}>Value x</label>
                <input type="number" value={cobX} onChange={e => setCobX(e.target.value)} min={0.0001} step={1} style={INPUT_BOX} />
              </div>
              <div>
                <label style={LABEL}>From base</label>
                <input type="number" value={cobFrom} onChange={e => setCobFrom(e.target.value)} min={0.0001} step={1} style={INPUT_BOX} />
              </div>
              <div>
                <label style={LABEL}>To base</label>
                <input type="number" value={cobTo} onChange={e => setCobTo(e.target.value)} min={0.0001} step={1} style={INPUT_BOX} />
              </div>
            </div>
          </div>

          {cobResult && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
                <MetricCard label={`log_${cobResult.from}(${cobResult.x})`} value={fmt(cobResult.original)} color="#f59e0b" sub="original" />
                <MetricCard label={`log_${cobResult.to}(${cobResult.x})`} value={fmt(cobResult.result)} color="#6366f1" sub="converted" />
              </div>
              <div style={{ ...CARD, padding: '16px 20px', background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.2)' }}>
                <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Step-by-step</div>
                <div style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--fg-2)', lineHeight: 2.2 }}>
                  <div style={{ color: '#f59e0b' }}>Using natural log (ln):</div>
                  <div>{cobResult.usingLn} = <strong style={{ color: '#6366f1' }}>{fmt(cobResult.result)}</strong></div>
                  <div style={{ color: '#f59e0b', marginTop: 8 }}>Using common log (log₁₀):</div>
                  <div>{cobResult.usingLog10} = <strong style={{ color: '#6366f1' }}>{fmt(cobResult.result)}</strong></div>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* ── LOG RULES REFERENCE ── */}
      <div style={CARD}>
        <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          Logarithm Rules Reference
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
          {RULES.map(({ rule, name }) => (
            <div key={name} style={{ padding: '10px 14px', background: 'rgba(0,0,0,0.3)', borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: 'var(--fg-3)', fontWeight: 600, marginBottom: 4 }}>{name}</div>
              <div style={{ fontSize: 13, color: '#c4b5fd', fontFamily: 'monospace' }}>{rule}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── APPLICATIONS ── */}
      <div style={{ ...CARD, background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.2)', padding: '16px 20px' }}>
        <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Real-World Applications
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10, fontSize: 13 }}>
          {[
            { label: 'Sound (Decibels)', formula: 'dB = 10 · log₁₀(P₂/P₁)', color: '#f59e0b' },
            { label: 'Earthquake (Richter)', formula: 'M = log₁₀(I/I₀)', color: '#10b981' },
            { label: 'Chemistry (pH)', formula: 'pH = −log₁₀[H⁺]', color: '#6366f1' },
            { label: 'Information Theory', formula: 'bits = −log₂(p)', color: '#38bdf8' },
          ].map(({ label, formula, color }) => (
            <div key={label} style={{ padding: '10px 14px', background: 'rgba(0,0,0,0.3)', borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: 'var(--fg-3)', fontWeight: 600, marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 13, color, fontFamily: 'monospace' }}>{formula}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── LOG TABLE ── */}
      <div>
        <button onClick={() => setShowTable(v => !v)} style={{ ...BTN_GHOST, marginBottom: 4 }} aria-expanded={showTable}>
          {showTable ? '▾' : '▸'} Log Table: log₁₀, ln, log₂ for 1–100
        </button>
        {showTable && (
          <div style={{ ...CARD, padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto', maxHeight: 400, overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                  <tr>
                    {['n', 'log₁₀(n)', 'ln(n)', 'log₂(n)'].map((h, i) => (
                      <th key={h} style={{ ...TH, textAlign: i === 0 ? 'left' : 'right' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {logTable.map(row => (
                    <tr key={row.n} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ ...TD, textAlign: 'left', color: 'var(--fg-3)', fontWeight: 600 }}>{row.n}</td>
                      <td style={{ ...TD, color: '#6366f1' }}>{row.log10.toFixed(6)}</td>
                      <td style={{ ...TD, color: '#10b981' }}>{row.ln.toFixed(6)}</td>
                      <td style={{ ...TD, color: '#f59e0b' }}>{row.log2.toFixed(6)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── EXPORT ── */}
      {mode === 'logarithm' && logResult && (
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => exportCalcPDF({
              toolName: 'Log Calculator',
              inputs: [
                { label: 'Value x', value: String(logResult.x) },
                { label: 'Custom Base b', value: String(logResult.b) },
              ],
              results: [
                { label: 'log₁₀(x)', value: fmt(logResult.log10), highlight: true },
                { label: 'ln(x)', value: fmt(logResult.ln) },
                { label: 'log₂(x)', value: fmt(logResult.log2) },
                { label: `log_${logResult.b}(x)`, value: fmt(logResult.logB) },
              ],
            })}
            style={BTN_GHOST}
          >
            📄 Export PDF
          </button>
        </div>
      )}

      {mode === 'logarithm' && !logResult && (
        <div style={{ ...CARD, textAlign: 'center', padding: '40px 20px', color: 'var(--fg-3)', fontSize: 14 }}>
          Enter a positive value for x — all logarithm values update instantly.
        </div>
      )}
    </div>
  )
}
