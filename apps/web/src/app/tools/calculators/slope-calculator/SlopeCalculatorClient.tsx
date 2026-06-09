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
  padding: '9px 12px', fontWeight: 700, fontSize: 11,
  textTransform: 'uppercase', letterSpacing: '0.07em',
  color: 'var(--fg-3)', textAlign: 'left', background: 'rgba(99,102,241,0.1)',
}
const TD: CSSProperties = { padding: '7px 12px', fontSize: 13, color: 'var(--fg-2)' }

function MetricCard({ label, value, sub, color = '#6366f1' }: {
  label: string; value: string; sub?: string; color?: string
}) {
  return (
    <div style={{ padding: '18px 14px', background: 'rgba(0,0,0,0.3)', borderRadius: 12, textAlign: 'center' }}>
      <div style={{ fontSize: 20, fontWeight: 900, color, fontFamily: 'monospace' }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

const n = (s: string) => parseFloat(s) || 0
const fmt = (v: number, d = 4) => isFinite(v) ? v.toFixed(d) : '—'

type Mode = 'twopoints' | 'slopepoint' | 'parallperp'

// ─── Direction label ──────────────────────────────────────────────────────────
function directionLabel(m: number | null): { text: string; color: string } {
  if (m === null) return { text: 'Vertical line (undefined slope)', color: '#f87171' }
  if (m === 0) return { text: 'Horizontal (zero slope)', color: '#38bdf8' }
  if (m > 0) return { text: 'Rising (positive slope)', color: '#4ade80' }
  return { text: 'Falling (negative slope)', color: '#fb923c' }
}

// ─── Format equation ──────────────────────────────────────────────────────────
function slopeIntercept(m: number, b: number): string {
  const bStr = Math.abs(b) < 1e-10 ? '' : b >= 0 ? ` + ${fmt(b, 4)}` : ` − ${fmt(Math.abs(b), 4)}`
  return `y = ${fmt(m, 4)}x${bStr}`
}

function standardForm(m: number, b: number): string {
  // Ax + By = C  →  mx - y + b = 0  →  A= m, B=-1, C=-b
  const A = m, B = -1, C = -b
  const Astr = Math.abs(A - Math.round(A)) < 1e-9 ? String(Math.round(A)) : fmt(A, 3)
  const Bstr = Math.abs(Math.abs(B) - 1) < 1e-9 ? (B < 0 ? '−' : '+') + 'y' : (B < 0 ? '−' : '+') + `${fmt(Math.abs(B), 3)}y`
  const Cstr = fmt(C, 3)
  return `${Astr}x ${Bstr} = ${Cstr}`
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function SlopeCalculatorClient() {
  const [mode, setMode] = useState<Mode>('twopoints')

  // Two-points mode
  const [x1, setX1] = useState('0')
  const [y1, setY1] = useState('2')
  const [x2, setX2] = useState('4')
  const [y2, setY2] = useState('10')

  // Slope + point mode
  const [spM,  setSpM]  = useState('2')
  const [spX,  setSpX]  = useState('3')
  const [spY,  setSpY]  = useState('8')
  const [spX2, setSpX2] = useState('5')   // second point finder x

  // Parallel / perpendicular mode
  const [ppM,  setPpM]  = useState('3')
  const [ppX,  setPpX]  = useState('1')
  const [ppY,  setPpY]  = useState('5')

  const [showAdv, setShowAdv] = useState(false)

  // ─── Derived ────────────────────────────────────────────────────────────────
  const result = useMemo(() => {
    if (mode === 'twopoints') {
      const dx = n(x2) - n(x1), dy = n(y2) - n(y1)
      const vertical = Math.abs(dx) < 1e-12
      const m = vertical ? null : dy / dx
      const b = m !== null ? n(y1) - m * n(x1) : null
      const dist = Math.sqrt(dx * dx + dy * dy)
      const midX = (n(x1) + n(x2)) / 2
      const midY = (n(y1) + n(y2)) / 2
      const angle = m !== null ? Math.atan(m) * 180 / Math.PI : 90
      const perpM = m !== null ? (m !== 0 ? -1 / m : null) : 0
      return { m, b, dist, midX, midY, angle, perpM, dx, dy, vertical }
    }
    if (mode === 'slopepoint') {
      const m = n(spM), x = n(spX), y = n(spY)
      const b = y - m * x
      const angle = Math.atan(m) * 180 / Math.PI
      const perpM = m !== 0 ? -1 / m : null
      // second point
      const x2v = n(spX2)
      const y2v = m * x2v + b
      return { m, b, angle, perpM, x2v, y2v, dist: null, midX: null, midY: null, dx: null, dy: null, vertical: false }
    }
    // parallperp
    const m = n(ppM), x = n(ppX), y = n(ppY)
    const bPar = y - m * x
    const perpMv = m !== 0 ? -1 / m : null
    const bPerp = perpMv !== null ? y - perpMv * x : null
    return {
      m, b: bPar, perpM: perpMv, bPerp,
      angle: Math.atan(m) * 180 / Math.PI,
      dist: null, midX: null, midY: null, dx: null, dy: null,
      x2v: null, y2v: null, vertical: false,
    }
  }, [mode, x1, y1, x2, y2, spM, spX, spY, spX2, ppM, ppX, ppY])

  // ─── Scenario table (m, m/2, 2m) ─────────────────────────────────────────
  const scenarios = useMemo(() => {
    const baseM = result.m ?? n(mode === 'slopepoint' ? spM : ppM)
    if (!isFinite(baseM)) return []
    const baseB = result.b ?? 0
    return [baseM / 2, baseM, baseM * 2].map(mv => {
      const bv = mode === 'twopoints' ? (n(y1) - mv * n(x1)) : baseB
      return {
        label: mv === baseM ? `m = ${fmt(mv, 3)} (current)` : mv === baseM / 2 ? `m = ${fmt(mv, 3)} (half)` : `m = ${fmt(mv, 3)} (double)`,
        m: mv,
        b: bv,
        angle: Math.atan(mv) * 180 / Math.PI,
        eq: slopeIntercept(mv, bv),
        highlight: mv === baseM,
      }
    })
  }, [result, mode, y1, x1, spM, ppM])

  // ─── Field helper ─────────────────────────────────────────────────────────
  function Field({ label, value, onChange, placeholder, hint }: {
    label: string; value: string; onChange: (v: string) => void; placeholder?: string; hint?: string
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

  const dir = directionLabel(result.m)
  const hasM = result.m !== null && isFinite(result.m)
  const hasB = result.b !== null && isFinite(result.b ?? NaN)

  async function handleExportPDF() {
    const inputs = mode === 'twopoints'
      ? [{ label: 'Point 1', value: `(${x1}, ${y1})` }, { label: 'Point 2', value: `(${x2}, ${y2})` }]
      : mode === 'slopepoint'
      ? [{ label: 'Slope m', value: spM }, { label: 'Point', value: `(${spX}, ${spY})` }]
      : [{ label: 'Slope m', value: ppM }, { label: 'Through Point', value: `(${ppX}, ${ppY})` }]
    await exportCalcPDF({
      toolName: 'Slope Calculator',
      inputs,
      results: [
        { label: 'Slope (m)', value: result.m !== null ? fmt(result.m, 6) : 'Undefined', highlight: true },
        ...(hasB ? [{ label: 'Equation', value: slopeIntercept(result.m!, result.b!), highlight: true }] : []),
        { label: 'Angle', value: `${fmt(result.angle, 4)}°` },
        ...(result.dist !== null ? [{ label: 'Distance', value: fmt(result.dist, 6) }] : []),
        ...(result.midX !== null ? [{ label: 'Midpoint', value: `(${fmt(result.midX, 4)}, ${fmt(result.midY!, 4)})` }] : []),
        { label: 'Direction', value: dir.text },
      ],
      formula: 'm = (y₂−y₁)/(x₂−x₁)  |  b = y−mx  |  distance = √(Δx²+Δy²)',
    })
  }

  // ─── Tab styles ─────────────────────────────────────────────────────────────
  const tabStyle = (active: boolean): CSSProperties => ({
    padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
    border: active ? '1px solid rgba(99,102,241,0.5)' : '1px solid transparent',
    background: active ? 'rgba(99,102,241,0.15)' : 'transparent',
    color: active ? '#c4b5fd' : 'var(--fg-3)',
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── INPUTS ── */}
      <div style={CARD}>
        {/* Mode tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {([['twopoints', 'Two Points'], ['slopepoint', 'Slope + Point'], ['parallperp', 'Parallel / Perpendicular']] as [Mode, string][]).map(([v, lbl]) => (
            <button key={v} onClick={() => setMode(v)} style={tabStyle(mode === v)} aria-pressed={mode === v}>{lbl}</button>
          ))}
        </div>

        {/* Two Points */}
        {mode === 'twopoints' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14 }}>
            <Field label="x₁" value={x1} onChange={setX1} placeholder="0" />
            <Field label="y₁" value={y1} onChange={setY1} placeholder="2" />
            <Field label="x₂" value={x2} onChange={setX2} placeholder="4" />
            <Field label="y₂" value={y2} onChange={setY2} placeholder="10" />
          </div>
        )}

        {/* Slope + Point */}
        {mode === 'slopepoint' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14 }}>
            <Field label="Slope (m)" value={spM} onChange={setSpM} placeholder="2" hint="Rise over run" />
            <Field label="x₁ (known point)" value={spX} onChange={setSpX} placeholder="3" />
            <Field label="y₁ (known point)" value={spY} onChange={setSpY} placeholder="8" />
          </div>
        )}

        {/* Parallel / Perpendicular */}
        {mode === 'parallperp' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14 }}>
            <Field label="Original slope (m)" value={ppM} onChange={setPpM} placeholder="3" />
            <Field label="Through point x" value={ppX} onChange={setPpX} placeholder="1" />
            <Field label="Through point y" value={ppY} onChange={setPpY} placeholder="5" />
          </div>
        )}

        {/* Advanced: second point finder */}
        {mode === 'slopepoint' && (
          <div style={{ marginTop: 14 }}>
            <button onClick={() => setShowAdv(v => !v)} style={{ ...BTN_GHOST }} aria-expanded={showAdv}>
              {showAdv ? '▾' : '▸'} Second Point Finder
            </button>
            {showAdv && (
              <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px,1fr))', gap: 14 }}>
                <Field label="Find y at x =" value={spX2} onChange={setSpX2} placeholder="5" hint="Uses line equation" />
                {result.y2v !== null && (
                  <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 2 }}>
                    <div>
                      <label style={LABEL}>Corresponding y</label>
                      <div style={{ ...INPUT_BOX, opacity: 0.7 }}>{fmt(result.y2v, 6)}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div style={{ marginTop: 14 }}>
          <button onClick={handleExportPDF} style={BTN_GHOST} aria-label="Export PDF">Export PDF</button>
        </div>
      </div>

      {/* ── RESULTS METRICS ── */}
      {result.vertical ? (
        <div style={{ ...CARD, background: 'rgba(248,113,113,0.06)', borderColor: 'rgba(248,113,113,0.3)', color: '#fca5a5', textAlign: 'center', padding: '20px' }}>
          Vertical line — slope is undefined (x₁ = x₂). The equation is x = {x1}.
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 }}>
            <MetricCard label="Slope m" value={result.m !== null ? fmt(result.m, 4) : '—'} color="#6366f1" />
            <MetricCard label="Y-intercept b" value={hasB ? fmt(result.b!, 4) : '—'} color="#8b5cf6" />
            <MetricCard label="Angle θ" value={isFinite(result.angle) ? `${fmt(result.angle, 2)}°` : '—'} color="#f59e0b"
              sub="from horizontal" />
            {result.dist !== null && <MetricCard label="Distance" value={fmt(result.dist, 4)} color="#10b981" />}
            {result.midX !== null && <MetricCard label="Midpoint" value={`(${fmt(result.midX, 2)},${fmt(result.midY!, 2)})`} color="#38bdf8" />}
          </div>

          {/* Direction badge */}
          <div style={{ ...CARD, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: dir.color, flexShrink: 0 }} />
            <span style={{ fontSize: 14, color: dir.color, fontWeight: 700 }}>{dir.text}</span>
          </div>

          {/* Line equations panel */}
          {hasM && hasB && (
            <div style={CARD}>
              <div style={{ fontSize: 12, color: 'var(--fg-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14 }}>
                Line Equations — Three Standard Forms
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { form: 'Slope-Intercept', eq: slopeIntercept(result.m!, result.b!), note: 'y = mx + b' },
                  { form: 'Point-Slope', eq: `y − ${fmt(n(mode === 'twopoints' ? y1 : spY), 4)} = ${fmt(result.m!, 4)}(x − ${fmt(n(mode === 'twopoints' ? x1 : spX), 4)})`, note: 'y − y₁ = m(x − x₁)' },
                  { form: 'Standard', eq: standardForm(result.m!, result.b!), note: 'Ax + By = C' },
                ].map(({ form, eq, note }) => (
                  <div key={form} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(0,0,0,0.25)', borderRadius: 8, flexWrap: 'wrap', gap: 8 }}>
                    <span style={{ fontSize: 11, color: 'var(--fg-3)', fontWeight: 600, minWidth: 110, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{form}</span>
                    <span style={{ fontFamily: 'monospace', fontSize: 14, color: '#c4b5fd', fontWeight: 700 }}>{eq}</span>
                    <span style={{ fontSize: 11, color: 'var(--fg-3)' }}>{note}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Parallel / Perpendicular results */}
          {mode === 'parallperp' && (
            <div style={CARD}>
              <div style={{ fontSize: 12, color: 'var(--fg-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14 }}>
                Parallel and Perpendicular Lines Through ({ppX}, {ppY})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ padding: '12px 16px', background: 'rgba(99,102,241,0.1)', borderRadius: 8, borderLeft: '3px solid #6366f1' }}>
                  <div style={{ fontSize: 11, color: 'var(--fg-3)', fontWeight: 600, marginBottom: 4 }}>PARALLEL LINE (same slope m = {fmt(result.m!, 4)})</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 14, color: '#a5b4fc' }}>{slopeIntercept(result.m!, result.b!)}</div>
                  <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 4 }}>Different y-intercept b = {fmt(result.b!, 4)}</div>
                </div>
                <div style={{ padding: '12px 16px', background: 'rgba(236,72,153,0.08)', borderRadius: 8, borderLeft: '3px solid #ec4899' }}>
                  <div style={{ fontSize: 11, color: 'var(--fg-3)', fontWeight: 600, marginBottom: 4 }}>
                    PERPENDICULAR LINE (slope = {result.perpM !== null ? fmt(result.perpM, 4) : 'Undefined (vertical)'})
                  </div>
                  {result.perpM !== null && (result as any).bPerp !== null ? (
                    <div style={{ fontFamily: 'monospace', fontSize: 14, color: '#f9a8d4' }}>
                      {slopeIntercept(result.perpM, (result as any).bPerp)}
                    </div>
                  ) : (
                    <div style={{ fontFamily: 'monospace', fontSize: 14, color: '#f9a8d4' }}>x = {ppX} (vertical)</div>
                  )}
                  <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 4 }}>Slope × perpendicular slope = −1</div>
                </div>
              </div>
            </div>
          )}

          {/* ── SCENARIO TABLE ── */}
          {scenarios.length > 0 && (
            <div style={CARD}>
              <div style={{ fontSize: 12, color: 'var(--fg-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14 }}>
                Slope Comparison: m/2, m, 2m
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Scenario', 'Slope m', 'Equation', 'Angle θ', 'Direction'].map(h => (
                        <th key={h} style={{ ...TH, textAlign: 'left', padding: '9px 14px' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {scenarios.map(s => {
                      const d = directionLabel(s.m)
                      return (
                        <tr key={s.label} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: s.highlight ? 'rgba(99,102,241,0.08)' : 'transparent' }}>
                          <td style={{ ...TD, color: s.highlight ? '#c4b5fd' : 'var(--fg-2)', fontWeight: s.highlight ? 700 : 400 }}>
                            {s.highlight ? '★ ' : ''}{s.label}
                          </td>
                          <td style={{ ...TD, fontFamily: 'monospace', color: '#a5b4fc' }}>{fmt(s.m, 4)}</td>
                          <td style={{ ...TD, fontFamily: 'monospace', fontSize: 12 }}>{s.eq}</td>
                          <td style={TD}>{fmt(s.angle, 2)}°</td>
                          <td style={{ ...TD, color: d.color }}>{d.text}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
