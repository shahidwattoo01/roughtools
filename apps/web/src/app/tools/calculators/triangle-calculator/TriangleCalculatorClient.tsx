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

function MetricCard({ label, value, sub, color = '#6366f1' }: {
  label: string; value: string; sub?: string; color?: string
}) {
  return (
    <div style={{ padding: '16px 12px', background: 'rgba(0,0,0,0.3)', borderRadius: 12, textAlign: 'center' }}>
      <div style={{ fontSize: 19, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

// ─── Math helpers ─────────────────────────────────────────────────────────────
const toRad = (d: number) => d * Math.PI / 180
const toDeg = (r: number) => r * 180 / Math.PI
const n = (s: string) => parseFloat(s) || 0
const f4 = (v: number) => isFinite(v) ? v.toFixed(4) : '—'
const f6 = (v: number) => isFinite(v) ? v.toFixed(6) : '—'

interface TriResult {
  a: number; b: number; c: number
  A: number; B: number; C: number
  area: number; perimeter: number
  inradius: number; circumradius: number
  altA: number; altB: number; altC: number
  medA: number; medB: number; medC: number
  angleType: string; sideType: string
  solutions?: TriResult[]   // for SSA ambiguous case
}

function solveTriangle(a: number, b: number, c: number, A: number, B: number, C: number): TriResult | null {
  if (a <= 0 || b <= 0 || c <= 0) return null
  if (A <= 0 || B <= 0 || C <= 0) return null
  if (Math.abs(A + B + C - 180) > 0.01) return null
  if (a + b <= c || a + c <= b || b + c <= a) return null

  const area = Math.sqrt((a + b + c) / 2 * ((a + b + c) / 2 - a) * ((a + b + c) / 2 - b) * ((a + b + c) / 2 - c))
  const s = (a + b + c) / 2
  const inradius = area / s
  const circumradius = (a * b * c) / (4 * area)
  const altA = (2 * area) / a
  const altB = (2 * area) / b
  const altC = (2 * area) / c
  const medA = 0.5 * Math.sqrt(2 * b * b + 2 * c * c - a * a)
  const medB = 0.5 * Math.sqrt(2 * a * a + 2 * c * c - b * b)
  const medC = 0.5 * Math.sqrt(2 * a * a + 2 * b * b - c * c)

  const maxAngle = Math.max(A, B, C)
  const angleType = Math.abs(maxAngle - 90) < 0.01 ? 'Right' : maxAngle < 90 ? 'Acute' : 'Obtuse'

  const sorted = [a, b, c].sort((x, y) => x - y)
  let sideType = 'Scalene'
  if (Math.abs(sorted[0] - sorted[1]) < 1e-6 && Math.abs(sorted[1] - sorted[2]) < 1e-6) sideType = 'Equilateral'
  else if (Math.abs(sorted[0] - sorted[1]) < 1e-6 || Math.abs(sorted[1] - sorted[2]) < 1e-6) sideType = 'Isosceles'

  return { a, b, c, A, B, C, area, perimeter: a + b + c, inradius, circumradius, altA, altB, altC, medA, medB, medC, angleType, sideType }
}

type Mode = 'sss' | 'sas' | 'asa' | 'aas' | 'ssa' | 'right'

// ─── Main component ───────────────────────────────────────────────────────────
export default function TriangleCalculatorClient() {
  const [mode, setMode] = useState<Mode>('sss')

  const [sss_a, setSSSa] = useState('5'); const [sss_b, setSSSb] = useState('6'); const [sss_c, setSSSc] = useState('7')
  const [sas_a, setSASa] = useState('7'); const [sas_C, setSASC] = useState('60'); const [sas_b, setSASb] = useState('5')
  const [asa_A, setASAA] = useState('60'); const [asa_c, setASAc] = useState('10'); const [asa_B, setASAB] = useState('80')
  const [aas_A, setAASA] = useState('50'); const [aas_B, setAASB] = useState('60'); const [aas_a, setAASa] = useState('8')
  const [ssa_a, setSSAa] = useState('8'); const [ssa_b, setSSAb] = useState('6'); const [ssa_A, setSSAA] = useState('50')
  const [rt_a,  setRTa]  = useState('3'); const [rt_b,  setRTb]  = useState('4')

  const [showAdv, setShowAdv] = useState(false)

  // ─── Solver ──────────────────────────────────────────────────────────────────
  const result = useMemo<{ primary: TriResult | null; secondary?: TriResult | null; error?: string; ssaCase?: string } | null>(() => {
    if (mode === 'sss') {
      const a = n(sss_a), b = n(sss_b), c = n(sss_c)
      if (a <= 0 || b <= 0 || c <= 0) return null
      if (a + b <= c || a + c <= b || b + c <= a) return { primary: null, error: 'Triangle inequality violated — these sides cannot form a triangle.' }
      const A = toDeg(Math.acos((b * b + c * c - a * a) / (2 * b * c)))
      const B = toDeg(Math.acos((a * a + c * c - b * b) / (2 * a * c)))
      const C = 180 - A - B
      return { primary: solveTriangle(a, b, c, A, B, C) }
    }
    if (mode === 'sas') {
      const a = n(sas_a), b = n(sas_b), Cv = n(sas_C)
      if (a <= 0 || b <= 0 || Cv <= 0 || Cv >= 180) return null
      const c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(toRad(Cv)))
      const A = toDeg(Math.asin(Math.min(1, a * Math.sin(toRad(Cv)) / c)))
      const B = 180 - A - Cv
      return { primary: solveTriangle(a, b, c, A, B, Cv) }
    }
    if (mode === 'asa') {
      const Av = n(asa_A), Bv = n(asa_B), c = n(asa_c)
      if (Av <= 0 || Bv <= 0 || c <= 0 || Av + Bv >= 180) return null
      const Cv = 180 - Av - Bv
      const a = c * Math.sin(toRad(Av)) / Math.sin(toRad(Cv))
      const b = c * Math.sin(toRad(Bv)) / Math.sin(toRad(Cv))
      return { primary: solveTriangle(a, b, c, Av, Bv, Cv) }
    }
    if (mode === 'aas') {
      const Av = n(aas_A), Bv = n(aas_B), a = n(aas_a)
      if (Av <= 0 || Bv <= 0 || a <= 0 || Av + Bv >= 180) return null
      const Cv = 180 - Av - Bv
      const b = a * Math.sin(toRad(Bv)) / Math.sin(toRad(Av))
      const c = a * Math.sin(toRad(Cv)) / Math.sin(toRad(Av))
      return { primary: solveTriangle(a, b, c, Av, Bv, Cv) }
    }
    if (mode === 'ssa') {
      const a = n(ssa_a), b = n(ssa_b), Av = n(ssa_A)
      if (a <= 0 || b <= 0 || Av <= 0 || Av >= 180) return null
      const h = b * Math.sin(toRad(Av))
      if (a < h) return { primary: null, error: `No solution: side a (${a}) < height h = b·sin(A) = ${h.toFixed(4)}. No triangle exists.`, ssaCase: '0 solutions' }
      const sinB = b * Math.sin(toRad(Av)) / a
      if (sinB > 1) return { primary: null, error: 'No solution: sin(B) > 1.', ssaCase: '0 solutions' }
      const B1 = toDeg(Math.asin(sinB))
      const C1 = 180 - Av - B1
      const B2 = 180 - B1
      const C2 = 180 - Av - B2
      const t1 = C1 > 0 ? solveTriangle(a, b, a * Math.sin(toRad(C1)) / Math.sin(toRad(Av)), Av, B1, C1) : null
      const t2 = C2 > 0 && Math.abs(a - h) > 1e-9 ? solveTriangle(a, b, a * Math.sin(toRad(C2)) / Math.sin(toRad(Av)), Av, B2, C2) : null
      const count = [t1, t2].filter(Boolean).length
      return { primary: t1, secondary: t2, ssaCase: `${count} solution${count !== 1 ? 's' : ''}` }
    }
    if (mode === 'right') {
      const a = n(rt_a), b = n(rt_b)
      if (a <= 0 || b <= 0) return null
      const c = Math.sqrt(a * a + b * b)
      const A = toDeg(Math.atan(a / b))
      const B = 90 - A
      return { primary: solveTriangle(a, b, c, A, B, 90) }
    }
    return null
  }, [mode, sss_a, sss_b, sss_c, sas_a, sas_C, sas_b, asa_A, asa_c, asa_B, aas_A, aas_B, aas_a, ssa_a, ssa_b, ssa_A, rt_a, rt_b])

  function Field({ label, value, onChange, placeholder, hint }: {
    label: string; value: string; onChange: (v: string) => void; placeholder?: string; hint?: string
  }) {
    return (
      <div>
        <label style={LABEL}>{label}</label>
        <input type="number" value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder} step="any" min="0" style={INPUT_BOX} aria-label={label} />
        {hint && <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 3 }}>{hint}</div>}
      </div>
    )
  }

  const tabStyle = (active: boolean): CSSProperties => ({
    padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
    border: active ? '1px solid rgba(99,102,241,0.5)' : '1px solid transparent',
    background: active ? 'rgba(99,102,241,0.15)' : 'transparent',
    color: active ? '#c4b5fd' : 'var(--fg-3)',
  })

  function TrianglePanel({ r, label }: { r: TriResult; label?: string }) {
    return (
      <div style={{ ...CARD, ...(label ? { borderColor: 'rgba(139,92,246,0.4)' } : {}) }}>
        {label && <div style={{ fontSize: 12, color: '#c4b5fd', fontWeight: 700, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>}

        {/* Type badges */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {[r.angleType, r.sideType].map(t => (
            <span key={t} style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: 'rgba(99,102,241,0.15)', color: '#c4b5fd', border: '1px solid rgba(99,102,241,0.3)' }}>{t}</span>
          ))}
        </div>

        {/* Key metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10, marginBottom: 16 }}>
          <MetricCard label="Area" value={f4(r.area)} color="#10b981" sub="sq units" />
          <MetricCard label="Perimeter" value={f4(r.perimeter)} color="#6366f1" />
          <MetricCard label="Inradius r" value={f4(r.inradius)} color="#8b5cf6" />
          <MetricCard label="Circumradius R" value={f4(r.circumradius)} color="#f59e0b" />
        </div>

        {/* Sides and angles table */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--fg-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Sides</div>
            {[['a', r.a], ['b', r.b], ['c', r.c]].map(([lbl, val]) => (
              <div key={String(lbl)} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: 13 }}>
                <span style={{ color: 'var(--fg-3)', fontFamily: 'monospace' }}>{lbl}</span>
                <span style={{ color: '#a5b4fc', fontWeight: 600 }}>{f6(val as number)}</span>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--fg-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Angles</div>
            {[['A', r.A], ['B', r.B], ['C', r.C]].map(([lbl, val]) => (
              <div key={String(lbl)} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: 13 }}>
                <span style={{ color: 'var(--fg-3)', fontFamily: 'monospace' }}>{lbl}</span>
                <span style={{ color: '#fcd34d', fontWeight: 600 }}>{f4(val as number)}°</span>
              </div>
            ))}
          </div>
        </div>

        {/* Advanced: altitudes and medians */}
        <div style={{ marginTop: 12 }}>
          <button onClick={() => setShowAdv(v => !v)} style={{ ...BTN_GHOST, fontSize: 12, padding: '7px 14px' }}>
            {showAdv ? '▾' : '▸'} Altitudes, Medians &amp; Trig Ratios
          </button>
          {showAdv && (
            <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--fg-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Altitudes h = 2A/side</div>
                {[['h_a', r.altA], ['h_b', r.altB], ['h_c', r.altC]].map(([lbl, val]) => (
                  <div key={String(lbl)} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 12, color: 'var(--fg-2)' }}>
                    <span style={{ fontFamily: 'monospace', color: 'var(--fg-3)' }}>{lbl}</span>
                    <span>{f4(val as number)}</span>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--fg-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Medians</div>
                {[['m_a', r.medA], ['m_b', r.medB], ['m_c', r.medC]].map(([lbl, val]) => (
                  <div key={String(lbl)} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 12, color: 'var(--fg-2)' }}>
                    <span style={{ fontFamily: 'monospace', color: 'var(--fg-3)' }}>{lbl}</span>
                    <span>{f4(val as number)}</span>
                  </div>
                ))}
              </div>
              {mode === 'right' && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ fontSize: 11, color: 'var(--fg-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Trig Ratios (angle A)</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                    {[
                      ['sin A', Math.sin(toRad(r.A))], ['cos A', Math.cos(toRad(r.A))], ['tan A', Math.tan(toRad(r.A))],
                    ].map(([lbl, val]) => (
                      <div key={String(lbl)} style={{ textAlign: 'center', padding: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: 8 }}>
                        <div style={{ fontSize: 11, color: 'var(--fg-3)' }}>{lbl}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#c4b5fd', fontFamily: 'monospace' }}>{f4(val as number)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  async function handleExportPDF() {
    const r = result?.primary
    if (!r) return
    await exportCalcPDF({
      toolName: 'Triangle Calculator',
      inputs: [{ label: 'Mode', value: mode.toUpperCase() }],
      results: [
        { label: 'Side a', value: f6(r.a), highlight: true }, { label: 'Side b', value: f6(r.b), highlight: true }, { label: 'Side c', value: f6(r.c), highlight: true },
        { label: 'Angle A', value: `${f4(r.A)}°` }, { label: 'Angle B', value: `${f4(r.B)}°` }, { label: 'Angle C', value: `${f4(r.C)}°` },
        { label: 'Area', value: f6(r.area), highlight: true }, { label: 'Perimeter', value: f6(r.perimeter) },
        { label: 'Type', value: `${r.angleType} ${r.sideType}` },
        { label: 'Inradius', value: f4(r.inradius) }, { label: 'Circumradius', value: f4(r.circumradius) },
      ],
      formula: 'Law of Cosines: c²=a²+b²−2ab·cos(C)  |  Law of Sines: a/sin(A)=b/sin(B)  |  Heron: √(s(s-a)(s-b)(s-c))',
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── INPUTS ── */}
      <div style={CARD}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {([['sss','SSS'],['sas','SAS'],['asa','ASA'],['aas','AAS'],['ssa','SSA'],['right','Right']] as [Mode,string][]).map(([v,lbl]) => (
            <button key={v} onClick={() => setMode(v)} style={tabStyle(mode === v)} aria-pressed={mode === v}>{lbl}</button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14 }}>
          {mode === 'sss' && <><Field label="Side a" value={sss_a} onChange={setSSSa} placeholder="5" /><Field label="Side b" value={sss_b} onChange={setSSSb} placeholder="6" /><Field label="Side c" value={sss_c} onChange={setSSSc} placeholder="7" /></>}
          {mode === 'sas' && <><Field label="Side a" value={sas_a} onChange={setSASa} placeholder="7" /><Field label="Angle C (°)" value={sas_C} onChange={setSASC} placeholder="60" hint="Included between a and b" /><Field label="Side b" value={sas_b} onChange={setSASb} placeholder="5" /></>}
          {mode === 'asa' && <><Field label="Angle A (°)" value={asa_A} onChange={setASAA} placeholder="60" /><Field label="Side c" value={asa_c} onChange={setASAc} placeholder="10" hint="Between angles A and B" /><Field label="Angle B (°)" value={asa_B} onChange={setASAB} placeholder="80" /></>}
          {mode === 'aas' && <><Field label="Angle A (°)" value={aas_A} onChange={setAASA} placeholder="50" /><Field label="Angle B (°)" value={aas_B} onChange={setAASB} placeholder="60" /><Field label="Side a (opposite A)" value={aas_a} onChange={setAASa} placeholder="8" /></>}
          {mode === 'ssa' && <><Field label="Side a (opposite A)" value={ssa_a} onChange={setSSAa} placeholder="8" /><Field label="Side b" value={ssa_b} onChange={setSSAb} placeholder="6" /><Field label="Angle A (°)" value={ssa_A} onChange={setSSAA} placeholder="50" /></>}
          {mode === 'right' && <><Field label="Leg a" value={rt_a} onChange={setRTa} placeholder="3" hint="Shorter leg" /><Field label="Leg b" value={rt_b} onChange={setRTb} placeholder="4" hint="Longer leg" /></>}
        </div>

        <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
          <button onClick={handleExportPDF} style={BTN_GHOST} aria-label="Export PDF">Export PDF</button>
        </div>
      </div>

      {/* ── RESULTS ── */}
      {result?.error && (
        <div style={{ ...CARD, background: 'rgba(248,113,113,0.06)', borderColor: 'rgba(248,113,113,0.3)', color: '#fca5a5', padding: '18px 22px', fontSize: 14 }}>
          {result.error}
        </div>
      )}
      {mode === 'ssa' && result?.ssaCase && !result.error && (
        <div style={{ padding: '10px 16px', background: 'rgba(245,158,11,0.1)', borderRadius: 8, border: '1px solid rgba(245,158,11,0.3)', fontSize: 13, color: '#fcd34d' }}>
          SSA Ambiguous Case: <strong>{result.ssaCase}</strong>
        </div>
      )}
      {result?.primary && <TrianglePanel r={result.primary} label={result.secondary ? 'Solution 1' : undefined} />}
      {result?.secondary && <TrianglePanel r={result.secondary} label="Solution 2 (Ambiguous Case)" />}

      {!result && (
        <div style={{ ...CARD, textAlign: 'center', padding: '40px 20px', color: 'var(--fg-3)', fontSize: 14 }}>
          Enter values above — results update instantly. All angles in degrees, sides in any consistent unit.
        </div>
      )}
    </div>
  )
}
