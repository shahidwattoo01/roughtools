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
  color: 'var(--fg-3)', background: 'rgba(99,102,241,0.1)',
}
const TD: CSSProperties = { padding: '7px 12px', fontSize: 13, color: 'var(--fg-2)' }

function MetricCard({ label, value, sub, color = '#6366f1' }: {
  label: string; value: string; sub?: string; color?: string
}) {
  return (
    <div style={{ padding: '18px 14px', background: 'rgba(0,0,0,0.3)', borderRadius: 12, textAlign: 'center' }}>
      <div style={{ fontSize: 20, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

// ─── Shapes definition ────────────────────────────────────────────────────────
const SHAPES = [
  { value: 'cube',      label: 'Cube',              fields: [{ id: 'a', label: 'Side a' }],
    formulaV: 'V = a³', formulaSA: 'SA = 6a²' },
  { value: 'rect',      label: 'Rectangular Prism', fields: [{ id: 'l', label: 'Length' }, { id: 'w', label: 'Width' }, { id: 'h', label: 'Height' }],
    formulaV: 'V = l×w×h', formulaSA: 'SA = 2(lw + lh + wh)' },
  { value: 'cylinder',  label: 'Cylinder',          fields: [{ id: 'r', label: 'Radius' }, { id: 'h', label: 'Height' }],
    formulaV: 'V = πr²h', formulaSA: 'SA = 2πr(r + h)' },
  { value: 'sphere',    label: 'Sphere',             fields: [{ id: 'r', label: 'Radius' }],
    formulaV: 'V = (4/3)πr³', formulaSA: 'SA = 4πr²' },
  { value: 'cone',      label: 'Cone',               fields: [{ id: 'r', label: 'Base Radius' }, { id: 'h', label: 'Height' }],
    formulaV: 'V = (1/3)πr²h', formulaSA: 'SA = πr(r + √(r²+h²))' },
  { value: 'pyramid',   label: 'Square Pyramid',     fields: [{ id: 'b', label: 'Base Side' }, { id: 'h', label: 'Height' }],
    formulaV: 'V = (1/3)b²h', formulaSA: 'SA = b² + 2b√((b/2)²+h²)' },
  { value: 'triprism',  label: 'Triangular Prism',   fields: [{ id: 'a', label: 'Tri Base' }, { id: 'b', label: 'Tri Side 1' }, { id: 'c', label: 'Tri Side 2' }, { id: 'h', label: 'Prism Length' }],
    formulaV: 'V = ½a·h_t·L  (Heron)', formulaSA: 'SA = aL + bL + cL + 2·A_tri' },
  { value: 'ellipsoid', label: 'Ellipsoid',          fields: [{ id: 'a', label: 'Semi-axis a' }, { id: 'b', label: 'Semi-axis b' }, { id: 'c', label: 'Semi-axis c' }],
    formulaV: 'V = (4/3)πabc', formulaSA: '≈ Knud Thomsen approx.' },
  { value: 'capsule',   label: 'Capsule',            fields: [{ id: 'r', label: 'Radius' }, { id: 'h', label: 'Cylinder Height' }],
    formulaV: 'V = πr²(4r/3 + h)', formulaSA: 'SA = 2πr(2r + h)' },
  { value: 'torus',     label: 'Torus',              fields: [{ id: 'R', label: 'Major Radius R' }, { id: 'r', label: 'Minor Radius r' }],
    formulaV: 'V = 2π²Rr²', formulaSA: 'SA = 4π²Rr' },
  { value: 'frustum',   label: 'Frustum (Cone)',     fields: [{ id: 'R', label: 'Bottom Radius' }, { id: 'r', label: 'Top Radius' }, { id: 'h', label: 'Height' }],
    formulaV: 'V = (πh/3)(R²+Rr+r²)', formulaSA: 'SA = π(R+r)s + πR² + πr²' },
  { value: 'hemi',      label: 'Hemisphere',         fields: [{ id: 'r', label: 'Radius' }],
    formulaV: 'V = (2/3)πr³', formulaSA: 'SA = 3πr²' },
]

// ─── Volume / surface area engine ────────────────────────────────────────────
function calc(shape: string, v: Record<string, number>): { volume: number; surface: number } {
  const p = Math.PI
  switch (shape) {
    case 'cube':     return { volume: v.a ** 3,                            surface: 6 * v.a ** 2 }
    case 'rect':     return { volume: v.l * v.w * v.h,                    surface: 2 * (v.l*v.w + v.l*v.h + v.w*v.h) }
    case 'cylinder': return { volume: p * v.r ** 2 * v.h,                 surface: 2 * p * v.r * (v.r + v.h) }
    case 'sphere':   return { volume: (4/3) * p * v.r ** 3,               surface: 4 * p * v.r ** 2 }
    case 'cone': {   const sl = Math.sqrt(v.r ** 2 + v.h ** 2); return { volume: (1/3)*p*v.r**2*v.h, surface: p*v.r*(v.r+sl) } }
    case 'pyramid': { const sl2 = Math.sqrt((v.b/2)**2+v.h**2); return { volume: (1/3)*v.b**2*v.h, surface: v.b**2+2*v.b*sl2 } }
    case 'triprism': {
      const s = (v.a + v.b + v.c) / 2
      const tri = Math.sqrt(Math.max(0, s*(s-v.a)*(s-v.b)*(s-v.c)))
      return { volume: tri * v.h, surface: (v.a + v.b + v.c) * v.h + 2 * tri }
    }
    case 'ellipsoid': {
      const p2 = 1.6075
      const sa = 4 * p * Math.pow((Math.pow(v.a*v.b,p2)+Math.pow(v.a*v.c,p2)+Math.pow(v.b*v.c,p2))/3, 1/p2)
      return { volume: (4/3)*p*v.a*v.b*v.c, surface: sa }
    }
    case 'capsule':  return { volume: p*v.r**2*(4*v.r/3+v.h),            surface: 2*p*v.r*(2*v.r+v.h) }
    case 'torus':    return { volume: 2*p**2*v.R*v.r**2,                  surface: 4*p**2*v.R*v.r }
    case 'frustum': {
      const sl = Math.sqrt(v.h**2+(v.R-v.r)**2)
      return { volume: (p*v.h/3)*(v.R**2+v.R*v.r+v.r**2), surface: p*(v.R+v.r)*sl+p*v.R**2+p*v.r**2 }
    }
    case 'hemi':     return { volume: (2/3)*p*v.r**3,                     surface: 3*p*v.r**2 }
    default:         return { volume: 0, surface: 0 }
  }
}

// ─── Unit conversion factors (to cm³) ────────────────────────────────────────
const UNITS = [
  { label: 'mm³',     factor: 0.001 },
  { label: 'cm³',     factor: 1 },
  { label: 'm³',      factor: 1e6 },
  { label: 'km³',     factor: 1e15 },
  { label: 'in³',     factor: 16.3871 },
  { label: 'ft³',     factor: 28316.8 },
  { label: 'gallons', factor: 3785.41 },
  { label: 'liters',  factor: 1000 },
]

const REALWORLD = [
  { threshold: 1000, label: '≈ 1 liter (1000 cm³)', condition: (v: number) => Math.abs(v - 1000) < 500 },
  { threshold: 330,  label: '≈ standard soda can (330 cm³)', condition: (v: number) => v > 250 && v < 400 },
]

const fmtV = (v: number) => v >= 1e6 ? `${(v/1e6).toFixed(4)} M` : v >= 1000 ? `${(v/1000).toFixed(4)} k` : v.toFixed(4)

// ─── Main component ───────────────────────────────────────────────────────────
export default function VolumeCalculatorClient() {
  const [shape, setShape] = useState('sphere')
  const [vals, setVals] = useState<Record<string, string>>({})
  const [unit, setUnit] = useState('cm³')

  const current = SHAPES.find(s => s.value === shape)!
  const numVals = Object.fromEntries(current.fields.map(f => [f.id, parseFloat(vals[f.id] ?? '') || 0]))
  const allFilled = current.fields.every(f => parseFloat(vals[f.id] ?? '') > 0)
  const result = allFilled ? calc(shape, numVals) : null

  const selectedUnit = UNITS.find(u => u.label === unit)!
  // convert: user enters in selected unit linear => volume in that unit; treat as raw number
  const volumeInUnit = result?.volume ?? 0
  const surfaceInUnit = result?.surface ?? 0

  // Convert to other units (assuming input is in selected unit = cm³ for display)
  const conversions = useMemo(() => {
    if (!result) return []
    const toCm3 = result.volume  // treat raw as cm³
    return UNITS.filter(u => u.label !== unit).slice(0, 4).map(u => ({
      label: u.label,
      volume: toCm3 / u.factor,
      surface: result.surface / Math.pow(u.factor, 2/3),
    }))
  }, [result, unit])

  // Scaling scenario
  const scaleScenarios = useMemo(() => {
    if (!result) return []
    return [1, 2, 3].map(s => ({
      scale: s,
      volume: result.volume * s ** 3,
      surface: result.surface * s ** 2,
    }))
  }, [result])

  function Field({ label, value, onChange, placeholder }: {
    label: string; value: string; onChange: (v: string) => void; placeholder?: string
  }) {
    return (
      <div>
        <label style={LABEL}>{label}</label>
        <input type="number" value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder} step="any" min="0" style={INPUT_BOX} aria-label={label} />
      </div>
    )
  }

  async function handleExportPDF() {
    if (!result) return
    await exportCalcPDF({
      toolName: 'Volume Calculator',
      inputs: [{ label: 'Shape', value: current.label }, { label: 'Unit', value: unit },
        ...current.fields.map(f => ({ label: f.label, value: numVals[f.id].toString() }))],
      results: [
        { label: 'Volume', value: `${fmtV(volumeInUnit)} ${unit}`, highlight: true },
        { label: 'Surface Area', value: `${fmtV(surfaceInUnit)} ${unit.replace('³','²')}`, highlight: true },
        { label: 'Formula (V)', value: current.formulaV },
        { label: 'Formula (SA)', value: current.formulaSA },
      ],
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── INPUTS ── */}
      <div style={CARD}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 16 }}>
          <div>
            <label style={LABEL}>Shape</label>
            <select value={shape} onChange={e => { setShape(e.target.value); setVals({}) }}
              style={{ ...INPUT_BOX, cursor: 'pointer' }} aria-label="Shape">
              {SHAPES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <label style={LABEL}>Input Unit</label>
            <select value={unit} onChange={e => setUnit(e.target.value)}
              style={{ ...INPUT_BOX, cursor: 'pointer' }} aria-label="Unit">
              {UNITS.map(u => <option key={u.label} value={u.label}>{u.label}</option>)}
            </select>
          </div>
          {current.fields.map(f => (
            <Field key={f.id} label={`${f.label} (${unit.replace('³','').replace('gallons','').trim() || 'unit'})`}
              value={vals[f.id] ?? ''} onChange={v => setVals(p => ({ ...p, [f.id]: v }))}
              placeholder="Enter value..." />
          ))}
        </div>

        {/* Formula display */}
        <div style={{ padding: '10px 14px', background: 'rgba(0,0,0,0.25)', borderRadius: 8, fontSize: 13, color: 'var(--fg-3)' }}>
          <span style={{ color: '#8b5cf6', fontWeight: 700 }}>V: </span>{current.formulaV}
          <span style={{ marginLeft: 20, color: '#10b981', fontWeight: 700 }}>SA: </span>{current.formulaSA}
        </div>

        <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
          <button onClick={() => setVals({})} style={{ ...BTN_GHOST, background: 'rgba(0,0,0,0.2)', color: 'var(--fg-3)' }}>Reset</button>
          {result && <button onClick={handleExportPDF} style={BTN_GHOST}>Export PDF</button>}
        </div>
      </div>

      {/* ── RESULTS ── */}
      {result ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
            <MetricCard label="Volume" value={fmtV(volumeInUnit)} sub={unit} color="#6366f1" />
            <MetricCard label="Surface Area" value={fmtV(surfaceInUnit)} sub={unit.replace('³', '²')} color="#10b981" />
          </div>

          {/* Unit conversions */}
          <div style={CARD}>
            <div style={{ fontSize: 12, color: 'var(--fg-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14 }}>
              Volume in Other Units
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
              {UNITS.filter(u => u.label !== unit).map(u => {
                const converted = volumeInUnit * (UNITS.find(x => x.label === unit)!.factor) / u.factor
                return (
                  <div key={u.label} style={{ padding: '12px', background: 'rgba(0,0,0,0.25)', borderRadius: 10, textAlign: 'center' }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#a5b4fc' }}>{fmtV(converted)}</div>
                    <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 3 }}>{u.label}</div>
                  </div>
                )
              })}
            </div>
            {/* Real-world context */}
            <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(16,185,129,0.07)', borderRadius: 8, fontSize: 12, color: '#6ee7b7' }}>
              1000 cm³ = 1 liter (water bottle) | 1 m³ ≈ 264 gallons | 1 ft³ ≈ 7.48 gallons | 1 in³ ≈ 16.39 cm³
            </div>
          </div>

          {/* Scaling scenario */}
          <div style={CARD}>
            <div style={{ fontSize: 12, color: 'var(--fg-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14 }}>
              Scale Comparison — Volume Grows as Cube of Linear Dimension
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Scale Factor', `Volume (${unit})`, `Surface Area (${unit.replace('³','²')})`, 'Volume Ratio', 'SA Ratio'].map(h => (
                      <th key={h} style={{ ...TH, textAlign: 'center' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {scaleScenarios.map(s => (
                    <tr key={s.scale} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: s.scale === 1 ? 'rgba(99,102,241,0.08)' : 'transparent' }}>
                      <td style={{ ...TD, textAlign: 'center', fontWeight: s.scale === 1 ? 700 : 400, color: s.scale === 1 ? '#c4b5fd' : 'var(--fg-2)' }}>{s.scale}× {s.scale === 1 ? '(base)' : ''}</td>
                      <td style={{ ...TD, textAlign: 'center', fontFamily: 'monospace' }}>{fmtV(s.volume)}</td>
                      <td style={{ ...TD, textAlign: 'center', fontFamily: 'monospace' }}>{fmtV(s.surface)}</td>
                      <td style={{ ...TD, textAlign: 'center', color: '#f59e0b' }}>{s.scale ** 3}×</td>
                      <td style={{ ...TD, textAlign: 'center', color: '#38bdf8' }}>{s.scale ** 2}×</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 10 }}>
              Doubling all dimensions multiplies volume by 8 (2³) and surface area by 4 (2²). This is why elephants need thick skin to dissipate heat — their volume grows faster than surface area.
            </div>
          </div>
        </>
      ) : (
        <div style={{ ...CARD, textAlign: 'center', padding: '40px 20px', color: 'var(--fg-3)', fontSize: 14 }}>
          Select a shape and enter all dimensions to calculate volume and surface area.
        </div>
      )}
    </div>
  )
}
