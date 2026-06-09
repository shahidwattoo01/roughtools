'use client'
import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { exportCalcPDF } from '@/lib/calcPdf'

// ─── Types ────────────────────────────────────────────────────────────────────

type ShapeKey =
  | 'square' | 'rectangle' | 'circle' | 'triangle_bh' | 'triangle_heron'
  | 'trapezoid' | 'ellipse' | 'parallelogram' | 'rhombus'
  | 'pentagon' | 'hexagon' | 'octagon' | 'sector'

type UnitKey = 'mm2' | 'cm2' | 'm2' | 'km2' | 'in2' | 'ft2' | 'yd2' | 'acres' | 'hectares'

interface ShapeResult {
  area: number           // always in input unit squared
  perimeter: number | null
  derived: Record<string, number>
  valid: boolean
  errorMsg?: string
}

// ─── Unit conversion table (relative to m²) ──────────────────────────────────

const UNIT_TO_M2: Record<UnitKey, number> = {
  mm2: 1e-6,
  cm2: 1e-4,
  m2: 1,
  km2: 1e6,
  in2: 6.4516e-4,
  ft2: 0.09290304,
  yd2: 0.83612736,
  acres: 4046.8564224,
  hectares: 10000,
}

const UNIT_LABELS: Record<UnitKey, string> = {
  mm2: 'mm²', cm2: 'cm²', m2: 'm²', km2: 'km²',
  in2: 'in²', ft2: 'ft²', yd2: 'yd²', acres: 'acres', hectares: 'ha',
}

const LINEAR_UNIT: Record<UnitKey, string> = {
  mm2: 'mm', cm2: 'cm', m2: 'm', km2: 'km',
  in2: 'in', ft2: 'ft', yd2: 'yd', acres: 'ac-side', hectares: 'm',
}

function convertArea(areaInInputUnit: number, fromUnit: UnitKey, toUnit: UnitKey): number {
  const inM2 = areaInInputUnit * UNIT_TO_M2[fromUnit]
  return inM2 / UNIT_TO_M2[toUnit]
}

// ─── Shape definitions ────────────────────────────────────────────────────────

interface ShapeDef {
  label: string
  fields: { id: string; label: string; placeholder: string }[]
  diagram: string[]
}

const SHAPES: Record<ShapeKey, ShapeDef> = {
  square: {
    label: 'Square',
    fields: [{ id: 's', label: 'Side Length', placeholder: '5' }],
    diagram: ['  ┌───────┐', '  │       │', '  │   s   │', '  │       │', '  └───────┘'],
  },
  rectangle: {
    label: 'Rectangle',
    fields: [
      { id: 'l', label: 'Length', placeholder: '8' },
      { id: 'w', label: 'Width', placeholder: '5' },
    ],
    diagram: ['  ┌───────────┐', '  │     l     │', '  │           │ w', '  │           │', '  └───────────┘'],
  },
  circle: {
    label: 'Circle',
    fields: [{ id: 'r', label: 'Radius', placeholder: '5' }],
    diagram: ['      ╭───╮', '    ╭     ╮', '   │   r → │', '    ╰     ╯', '      ╰───╯'],
  },
  triangle_bh: {
    label: 'Triangle (Base × Height)',
    fields: [
      { id: 'b', label: 'Base', placeholder: '6' },
      { id: 'h', label: 'Height', placeholder: '4' },
    ],
    diagram: ['      /\\', '     /  \\', '    /  h \\', '   /──────\\', '      b'],
  },
  triangle_heron: {
    label: "Triangle (Heron's — 3 sides)",
    fields: [
      { id: 'a', label: 'Side a', placeholder: '3' },
      { id: 'b', label: 'Side b', placeholder: '4' },
      { id: 'c', label: 'Side c', placeholder: '5' },
    ],
    diagram: ['      A', '     /\\', '    /  \\', '  b/    \\c', '  /      \\', ' B────────C', '     a'],
  },
  trapezoid: {
    label: 'Trapezoid',
    fields: [
      { id: 'a', label: 'Parallel Side a', placeholder: '6' },
      { id: 'b', label: 'Parallel Side b', placeholder: '10' },
      { id: 'h', label: 'Height', placeholder: '4' },
    ],
    diagram: ['   ┌────┐', '   │  a │', '   │  h │', '   └──────┘', '      b'],
  },
  ellipse: {
    label: 'Ellipse',
    fields: [
      { id: 'a', label: 'Semi-major Axis (a)', placeholder: '6' },
      { id: 'b', label: 'Semi-minor Axis (b)', placeholder: '4' },
    ],
    diagram: ['     ╭───────╮', '   ╭    a →   ╮', '   │  ↑b       │', '   ╰           ╯', '     ╰───────╯'],
  },
  parallelogram: {
    label: 'Parallelogram',
    fields: [
      { id: 'b', label: 'Base', placeholder: '8' },
      { id: 'h', label: 'Height', placeholder: '5' },
      { id: 's', label: 'Slant Side', placeholder: '6' },
    ],
    diagram: ['   ╱────────╱', '  ╱   h  ↑ ╱', ' ╱──────────╱', '       b'],
  },
  rhombus: {
    label: 'Rhombus',
    fields: [
      { id: 'd1', label: 'Diagonal 1 (d₁)', placeholder: '8' },
      { id: 'd2', label: 'Diagonal 2 (d₂)', placeholder: '6' },
    ],
    diagram: ['      /\\', '    d2/  \\', '    /    \\', '    \\    /', '     \\  /', '      \\/', '    ←d1→'],
  },
  pentagon: {
    label: 'Regular Pentagon',
    fields: [{ id: 's', label: 'Side Length', placeholder: '5' }],
    diagram: ['    ╱─────╲', '   ╱       ╲', '  │         │', '   ╲       ╱', '    ╲─────╱', '       s'],
  },
  hexagon: {
    label: 'Regular Hexagon',
    fields: [{ id: 's', label: 'Side Length', placeholder: '5' }],
    diagram: ['    ╱────╲', '   │      │', '   │  s   │', '   │      │', '    ╲────╱'],
  },
  octagon: {
    label: 'Regular Octagon',
    fields: [{ id: 's', label: 'Side Length', placeholder: '4' }],
    diagram: ['   ╱──────╲', '  │        │', '  │   s    │', '  │        │', '   ╲──────╱'],
  },
  sector: {
    label: 'Circular Sector',
    fields: [
      { id: 'r', label: 'Radius', placeholder: '5' },
      { id: 'theta', label: 'Angle (degrees)', placeholder: '90' },
    ],
    diagram: ['   ╱──────', '  ╱  θ   ╮', ' ●    r   │', '  ╲       │', '   ╲──────'],
  },
}

// ─── Calculation Engine ───────────────────────────────────────────────────────

function calcShape(shape: ShapeKey, v: Record<string, number>): ShapeResult {
  const nan: ShapeResult = { area: 0, perimeter: null, derived: {}, valid: false }

  switch (shape) {
    case 'square': {
      const { s } = v
      if (s <= 0) return nan
      return {
        area: s * s,
        perimeter: 4 * s,
        derived: { diagonal: s * Math.SQRT2, side: s },
        valid: true,
      }
    }
    case 'rectangle': {
      const { l, w } = v
      if (l <= 0 || w <= 0) return nan
      return {
        area: l * w,
        perimeter: 2 * (l + w),
        derived: { diagonal: Math.sqrt(l * l + w * w), aspectRatio: l / w },
        valid: true,
      }
    }
    case 'circle': {
      const { r } = v
      if (r <= 0) return nan
      return {
        area: Math.PI * r * r,
        perimeter: 2 * Math.PI * r,
        derived: { diameter: 2 * r, radius: r },
        valid: true,
      }
    }
    case 'triangle_bh': {
      const { b, h } = v
      if (b <= 0 || h <= 0) return nan
      return {
        area: 0.5 * b * h,
        perimeter: null,
        derived: { base: b, height: h },
        valid: true,
      }
    }
    case 'triangle_heron': {
      const { a, b, c } = v
      if (a <= 0 || b <= 0 || c <= 0) return nan
      if (a + b <= c || a + c <= b || b + c <= a)
        return { ...nan, valid: false, errorMsg: 'Triangle inequality violated — these sides cannot form a triangle.' }
      const s = (a + b + c) / 2
      const area = Math.sqrt(s * (s - a) * (s - b) * (s - c))
      return {
        area,
        perimeter: a + b + c,
        derived: {
          semiPerimeter: s,
          inradius: area / s,
          circumradius: (a * b * c) / (4 * area),
        },
        valid: true,
      }
    }
    case 'trapezoid': {
      const { a, b, h } = v
      if (a <= 0 || b <= 0 || h <= 0) return nan
      return {
        area: 0.5 * (a + b) * h,
        perimeter: null,
        derived: { medianLength: (a + b) / 2, height: h },
        valid: true,
      }
    }
    case 'ellipse': {
      const { a, b } = v
      if (a <= 0 || b <= 0) return nan
      // Ramanujan's approximation for perimeter
      const h = Math.pow(a - b, 2) / Math.pow(a + b, 2)
      const perim = Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)))
      return {
        area: Math.PI * a * b,
        perimeter: perim,
        derived: {
          eccentricity: Math.sqrt(1 - Math.pow(Math.min(a, b) / Math.max(a, b), 2)),
          focalDistance: Math.sqrt(Math.abs(a * a - b * b)),
        },
        valid: true,
      }
    }
    case 'parallelogram': {
      const { b, h, s } = v
      if (b <= 0 || h <= 0) return nan
      const sideUsed = s > 0 ? s : h  // fallback if slant not provided
      return {
        area: b * h,
        perimeter: s > 0 ? 2 * (b + s) : null,
        derived: { base: b, height: h, slantSide: s > 0 ? s : NaN },
        valid: true,
      }
    }
    case 'rhombus': {
      const { d1, d2 } = v
      if (d1 <= 0 || d2 <= 0) return nan
      const side = Math.sqrt((d1 / 2) ** 2 + (d2 / 2) ** 2)
      return {
        area: 0.5 * d1 * d2,
        perimeter: 4 * side,
        derived: { side, angle1: 2 * Math.atan(d2 / d1) * 180 / Math.PI, angle2: 2 * Math.atan(d1 / d2) * 180 / Math.PI },
        valid: true,
      }
    }
    case 'pentagon': {
      const { s } = v
      if (s <= 0) return nan
      const area = (Math.sqrt(25 + 10 * Math.sqrt(5)) / 4) * s * s
      const apothem = s / (2 * Math.tan(Math.PI / 5))
      return {
        area,
        perimeter: 5 * s,
        derived: { apothem, circumradius: s / (2 * Math.sin(Math.PI / 5)) },
        valid: true,
      }
    }
    case 'hexagon': {
      const { s } = v
      if (s <= 0) return nan
      const area = (3 * Math.sqrt(3) / 2) * s * s
      return {
        area,
        perimeter: 6 * s,
        derived: { apothem: s * Math.sqrt(3) / 2, circumradius: s },
        valid: true,
      }
    }
    case 'octagon': {
      const { s } = v
      if (s <= 0) return nan
      const area = 2 * (1 + Math.SQRT2) * s * s
      const apothem = s * (1 + Math.SQRT2) / 2
      return {
        area,
        perimeter: 8 * s,
        derived: { apothem, circumradius: s * Math.sqrt(4 + 2 * Math.SQRT2) / 2 },
        valid: true,
      }
    }
    case 'sector': {
      const { r, theta } = v
      if (r <= 0 || theta <= 0 || theta >= 360) return nan
      const rad = theta * Math.PI / 180
      const area = 0.5 * r * r * rad
      const arcLen = r * rad
      return {
        area,
        perimeter: 2 * r + arcLen,
        derived: { arcLength: arcLen, chordLength: 2 * r * Math.sin(rad / 2), centralAngleDeg: theta },
        valid: true,
      }
    }
    default:
      return nan
  }
}

// ─── Real-world context ────────────────────────────────────────────────────────

function getRealWorldContext(areaM2: number): string {
  if (areaM2 <= 0) return ''
  if (areaM2 < 0.01)    return `About the size of a postage stamp (~${(areaM2 * 1e4).toFixed(1)} cm²)`
  if (areaM2 < 0.1)     return `Similar to a sheet of A4 paper (0.0623 m²)`
  if (areaM2 < 1)       return `About the size of a large desk (~1.5 m² typical)`
  if (areaM2 < 5)       return `Comparable to a parking space (~2.5 m²) or small bathroom`
  if (areaM2 < 20)      return `About the size of a small bedroom (~12 m²) or large office`
  if (areaM2 < 50)      return `Similar to a studio apartment (~35 m²)`
  if (areaM2 < 100)     return `About the size of a typical US apartment (~90 m²)`
  if (areaM2 < 200)     return `Similar to a medium house (~150 m²) or two-car garage`
  if (areaM2 < 500)     return `About half an acre — could fit a large house with yard`
  if (areaM2 < 4047)    return `${(areaM2 / 4047).toFixed(2)} acres — good for a small farm`
  if (areaM2 < 10000)   return `${(areaM2 / 4047).toFixed(1)} acres — typical suburban land plot`
  if (areaM2 < 1e6)     return `${(areaM2 / 10000).toFixed(2)} hectares — compare to a city block (~6 ha)`
  return `${(areaM2 / 1e6).toFixed(2)} km² — compare to New York City (783 km²)`
}

// ─── CSV Export ───────────────────────────────────────────────────────────────

function exportCSV(rows: string[][], filename: string) {
  const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n')
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })),
    download: filename,
  })
  a.click()
}

// ─── Formatting ───────────────────────────────────────────────────────────────

function fmt(n: number, d = 6): string {
  if (!isFinite(n)) return 'N/A'
  return n.toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 })
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
const TD: CSSProperties = { padding: '6px 12px', fontSize: 12, textAlign: 'right', color: 'var(--fg-2)', whiteSpace: 'nowrap' }

// ─── Sub-components ───────────────────────────────────────────────────────────

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

function Field({
  label, value, onChange, placeholder, min, max, step,
}: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; min?: number; max?: number; step?: number
}) {
  return (
    <div>
      <label style={LABEL}>{label}</label>
      <input
        type="number" value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} min={min} max={max} step={step ?? 0.01}
        style={INPUT_BOX} aria-label={label}
      />
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AreaCalculatorClient() {
  const [shape, setShape]   = useState<ShapeKey>('circle')
  const [unit, setUnit]     = useState<UnitKey>('m2')
  const [vals, setVals]     = useState<Record<string, string>>({})
  const [showFormulas, setShowFormulas] = useState(false)
  const [showScenario, setShowScenario] = useState(false)
  const [showUnits, setShowUnits]       = useState(false)

  const shapeDef = SHAPES[shape]

  const numVals = useMemo(() =>
    Object.fromEntries(shapeDef.fields.map(f => [f.id, parseFloat(vals[f.id] ?? '') || 0])),
    [shapeDef, vals]
  )

  const result = useMemo(() => calcShape(shape, numVals), [shape, numVals])

  const areaInUnit = result.valid ? result.area : 0
  const areaM2     = result.valid ? convertArea(areaInUnit, unit, 'm2') : 0
  const unitLabel  = UNIT_LABELS[unit]
  const linLabel   = LINEAR_UNIT[unit]

  // Area in all other units
  const areaAllUnits = useMemo<Record<UnitKey, number>>(() => {
    const out: Partial<Record<UnitKey, number>> = {}
    for (const u of Object.keys(UNIT_LABELS) as UnitKey[]) {
      out[u] = convertArea(areaInUnit, unit, u)
    }
    return out as Record<UnitKey, number>
  }, [areaInUnit, unit])

  // Scenario: same shape at 1x, 1.5x, 2x scale
  const scenarios = useMemo(() => {
    if (!result.valid) return null
    return [1, 1.5, 2].map(scale => {
      const scaled = Object.fromEntries(
        Object.entries(numVals).map(([k, v]) => [k, v * scale])
      )
      const r = calcShape(shape, scaled)
      return { scale, area: r.area, perimeter: r.perimeter }
    })
  }, [result.valid, shape, numVals])

  const realWorld = getRealWorldContext(areaM2)

  function setVal(id: string, v: string) {
    setVals(p => ({ ...p, [id]: v }))
  }

  function resetShape(s: ShapeKey) {
    setShape(s)
    setVals({})
  }

  function getFormulaText(): string {
    switch (shape) {
      case 'square':          return 'Area = s²  |  Perimeter = 4s  |  Diagonal = s√2'
      case 'rectangle':       return 'Area = l × w  |  Perimeter = 2(l + w)  |  Diagonal = √(l² + w²)'
      case 'circle':          return 'Area = πr²  |  Circumference = 2πr  |  Diameter = 2r'
      case 'triangle_bh':     return 'Area = ½ × base × height'
      case 'triangle_heron':  return "Area = √(s(s−a)(s−b)(s−c))  where s = (a+b+c)/2  (Heron's Formula)"
      case 'trapezoid':       return 'Area = ½(a + b) × h  where a,b are parallel sides'
      case 'ellipse':         return 'Area = π × a × b  |  Perimeter ≈ π(a+b)(1 + 3h/(10+√(4−3h))) where h=(a−b)²/(a+b)²'
      case 'parallelogram':   return 'Area = base × height  |  Perimeter = 2(b + s)'
      case 'rhombus':         return 'Area = ½ × d₁ × d₂  |  Side = √((d₁/2)² + (d₂/2)²)  |  Perimeter = 4 × side'
      case 'pentagon':        return 'Area = (√(25+10√5)/4) × s²  |  Perimeter = 5s'
      case 'hexagon':         return 'Area = (3√3/2) × s²  |  Perimeter = 6s'
      case 'octagon':         return 'Area = 2(1+√2) × s²  |  Perimeter = 8s'
      case 'sector':          return 'Area = ½r²θ (θ in radians)  |  Arc Length = rθ  |  Perimeter = 2r + arc'
      default:                return ''
    }
  }

  function getWorkedExample(): string {
    const v = numVals
    switch (shape) {
      case 'square':
        return `Side = ${v.s}${linLabel}  →  Area = ${v.s}² = ${fmt(v.s**2)} ${unitLabel}`
      case 'rectangle':
        return `l=${v.l}, w=${v.w} → Area = ${v.l} × ${v.w} = ${fmt(v.l*v.w)} ${unitLabel}`
      case 'circle':
        return `r=${v.r} → Area = π × ${v.r}² = ${fmt(Math.PI * v.r**2)} ${unitLabel},  C = 2π × ${v.r} = ${fmt(2*Math.PI*v.r)} ${linLabel}`
      case 'triangle_bh':
        return `b=${v.b}, h=${v.h} → Area = ½ × ${v.b} × ${v.h} = ${fmt(0.5*v.b*v.h)} ${unitLabel}`
      case 'triangle_heron': {
        const s = (v.a+v.b+v.c)/2
        return `s = (${v.a}+${v.b}+${v.c})/2 = ${fmt(s)}  →  Area = √(${fmt(s)}×${fmt(s-v.a)}×${fmt(s-v.b)}×${fmt(s-v.c)}) = ${fmt(result.area)} ${unitLabel}`
      }
      case 'trapezoid':
        return `Area = ½(${v.a} + ${v.b}) × ${v.h} = ${fmt(0.5*(v.a+v.b)*v.h)} ${unitLabel}`
      case 'ellipse':
        return `Area = π × ${v.a} × ${v.b} = ${fmt(Math.PI*v.a*v.b)} ${unitLabel}`
      case 'parallelogram':
        return `Area = ${v.b} × ${v.h} = ${fmt(v.b*v.h)} ${unitLabel}`
      case 'rhombus':
        return `Area = ½ × ${v.d1} × ${v.d2} = ${fmt(0.5*v.d1*v.d2)} ${unitLabel}`
      case 'pentagon':
        return `Area = (√(25+10√5)/4) × ${v.s}² = ${fmt(result.area)} ${unitLabel}`
      case 'hexagon':
        return `Area = (3√3/2) × ${v.s}² = ${fmt(result.area)} ${unitLabel}`
      case 'octagon':
        return `Area = 2(1+√2) × ${v.s}² = ${fmt(result.area)} ${unitLabel}`
      case 'sector': {
        const rad = v.theta * Math.PI / 180
        return `θ = ${v.theta}° = ${fmt(rad, 4)} rad  →  Area = ½ × ${v.r}² × ${fmt(rad, 4)} = ${fmt(result.area)} ${unitLabel}`
      }
      default:
        return ''
    }
  }

  const canExport = result.valid && result.area > 0

  function handleExportCSV() {
    const rows: string[][] = [
      ['Property', 'Value', 'Unit'],
      ['Shape', shapeDef.label, ''],
      ['Area', fmt(result.area), unitLabel],
      ...(result.perimeter !== null ? [['Perimeter', fmt(result.perimeter), linLabel]] : []),
      ...Object.entries(result.derived).map(([k, v]) => [k, fmt(v), '']),
      ['', '', ''],
      ['Unit Conversions', '', ''],
      ...Object.entries(UNIT_LABELS).map(([u, label]) => [label, fmt(areaAllUnits[u as UnitKey]), label]),
    ]
    exportCSV(rows, `area-${shape}-calculation.csv`)
  }

  async function handleExportPDF() {
    await exportCalcPDF({
      toolName: 'Area Calculator',
      inputs: [
        { label: 'Shape', value: shapeDef.label },
        { label: 'Unit', value: unitLabel },
        ...shapeDef.fields.map(f => ({ label: f.label, value: fmt(numVals[f.id]) + ' ' + linLabel })),
      ],
      results: [
        { label: 'Area', value: `${fmt(result.area)} ${unitLabel}`, highlight: true },
        ...(result.perimeter !== null ? [{ label: 'Perimeter', value: `${fmt(result.perimeter)} ${linLabel}` }] : []),
        ...Object.entries(result.derived)
          .filter(([, v]) => isFinite(v))
          .map(([k, v]) => ({ label: k, value: fmt(v) })),
        { label: 'Formula', value: getFormulaText() },
      ],
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── INPUTS ── */}
      <div style={CARD}>
        {/* Shape selector */}
        <div style={{ marginBottom: 16 }}>
          <label style={LABEL}>Shape</label>
          <select
            value={shape}
            onChange={e => resetShape(e.target.value as ShapeKey)}
            style={{ ...INPUT_BOX, appearance: 'none' }}
            aria-label="Select shape"
          >
            {(Object.entries(SHAPES) as [ShapeKey, ShapeDef][]).map(([key, def]) => (
              <option key={key} value={key}>{def.label}</option>
            ))}
          </select>
        </div>

        {/* Unit selector */}
        <div style={{ marginBottom: 16 }}>
          <label style={LABEL}>Output Unit</label>
          <select
            value={unit}
            onChange={e => setUnit(e.target.value as UnitKey)}
            style={{ ...INPUT_BOX, appearance: 'none' }}
            aria-label="Select unit"
          >
            {(Object.entries(UNIT_LABELS) as [UnitKey, string][]).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        {/* Dimension inputs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 16, marginBottom: 16,
        }}>
          {shapeDef.fields.map(f => (
            <Field
              key={f.id}
              label={`${f.label} (${linLabel})`}
              value={vals[f.id] ?? ''}
              onChange={v => setVal(f.id, v)}
              placeholder={f.placeholder}
              min={0}
            />
          ))}
        </div>

        {/* ASCII Diagram */}
        <div style={{
          background: 'var(--bg-3)', borderRadius: 8, padding: '12px 16px',
          fontFamily: 'monospace', fontSize: 12, color: 'var(--fg-3)',
          lineHeight: 1.6, marginBottom: 16,
        }}>
          {shapeDef.diagram.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>

        {/* Export buttons */}
        {canExport && (
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button onClick={handleExportCSV} style={BTN_GHOST} aria-label="Export CSV">
              ⬇ Export CSV
            </button>
            <button onClick={handleExportPDF} style={BTN_GHOST} aria-label="Export PDF">
              📄 Export PDF
            </button>
          </div>
        )}
      </div>

      {/* ── RESULTS ── */}
      {result.errorMsg ? (
        <div style={{ ...CARD, background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.3)' }}>
          <div style={{ color: '#f87171', fontSize: 14 }}>⚠ {result.errorMsg}</div>
        </div>
      ) : result.valid ? (
        <>
          {/* ── TIER 1: Key Metrics ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
            <MetricCard
              label={`Area (${unitLabel})`}
              value={fmt(result.area, 4)}
              color="#6366f1"
              sub={shapeDef.label}
            />
            {result.perimeter !== null && (
              <MetricCard
                label={`Perimeter (${linLabel})`}
                value={fmt(result.perimeter, 4)}
                color="#10b981"
              />
            )}
            {shape === 'circle' && (
              <MetricCard
                label={`Circumference (${linLabel})`}
                value={fmt(result.perimeter ?? 0, 4)}
                color="#10b981"
              />
            )}
            {isFinite(areaM2) && areaM2 > 0 && unit !== 'm2' && (
              <MetricCard
                label="Area (m²)"
                value={fmt(areaM2, 4)}
                color="#f59e0b"
                sub="converted"
              />
            )}
            {Object.entries(result.derived).slice(0, 2).map(([k, v]) =>
              isFinite(v) ? (
                <MetricCard key={k} label={k} value={fmt(v, 4)} color="#38bdf8" />
              ) : null
            )}
          </div>

          {/* ── TIER 2: Formula & Worked Example ── */}
          <div>
            <button
              onClick={() => setShowFormulas(v => !v)}
              style={{
                width: '100%', textAlign: 'left', padding: '14px 20px',
                background: 'var(--bg-1)', border: '1px solid var(--line-strong)',
                borderRadius: 12, color: '#c4b5fd', fontWeight: 700, fontSize: 14,
                cursor: 'pointer',
              }}
              aria-expanded={showFormulas}
            >
              {showFormulas ? '▾' : '▸'} Formula & Worked Example
            </button>
            {showFormulas && (
              <div style={{ ...CARD, marginTop: 4 }}>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ ...LABEL, marginBottom: 8 }}>Formula</div>
                  <div style={{
                    background: 'var(--bg-3)', borderRadius: 8, padding: '12px 16px',
                    fontFamily: 'monospace', fontSize: 13, color: '#c4b5fd', lineHeight: 1.8,
                  }}>
                    {getFormulaText()}
                  </div>
                </div>
                <div>
                  <div style={{ ...LABEL, marginBottom: 8 }}>Worked Example</div>
                  <div style={{
                    background: 'rgba(139,92,246,0.08)', borderRadius: 8, padding: '12px 16px',
                    fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.8,
                    fontFamily: 'monospace',
                  }}>
                    {getWorkedExample()}
                  </div>
                </div>
                {Object.keys(result.derived).length > 0 && (
                  <div style={{ marginTop: 14 }}>
                    <div style={{ ...LABEL, marginBottom: 8 }}>Derived Values</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8 }}>
                      {Object.entries(result.derived).filter(([, v]) => isFinite(v)).map(([k, v]) => (
                        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: 'rgba(0,0,0,0.2)', borderRadius: 6 }}>
                          <span style={{ color: 'var(--fg-3)', fontSize: 12 }}>{k}</span>
                          <span style={{ color: 'var(--fg)', fontSize: 12, fontWeight: 600 }}>{fmt(v, 4)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── TIER 3: Scenario Comparison ── */}
          {scenarios && (
            <div>
              <button
                onClick={() => setShowScenario(v => !v)}
                style={{
                  width: '100%', textAlign: 'left', padding: '14px 20px',
                  background: 'var(--bg-1)', border: '1px solid var(--line-strong)',
                  borderRadius: 12, color: '#c4b5fd', fontWeight: 700, fontSize: 14,
                  cursor: 'pointer',
                }}
                aria-expanded={showScenario}
              >
                {showScenario ? '▾' : '▸'} Scale Scenarios (1×, 1.5×, 2×)
              </button>
              {showScenario && (
                <div style={{ ...CARD, padding: 0, overflow: 'hidden', marginTop: 4 }}>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                      <thead>
                        <tr>
                          {['Scale', `Area (${unitLabel})`, result.perimeter !== null ? `Perimeter (${linLabel})` : null, 'Area Ratio'].filter(Boolean).map(h => (
                            <th key={h!} style={{ ...TH, textAlign: h === 'Scale' ? 'left' : 'right' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {scenarios.map(({ scale, area, perimeter }) => (
                          <tr key={scale} style={{
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                            background: scale === 1 ? 'rgba(139,92,246,0.08)' : 'transparent',
                          }}>
                            <td style={{ ...TD, textAlign: 'left', color: scale === 1 ? '#c4b5fd' : 'var(--fg-2)', fontWeight: scale === 1 ? 700 : 400 }}>
                              {scale === 1 ? '★ ' : ''}{scale}× scale
                            </td>
                            <td style={{ ...TD, color: scale === 1 ? '#6366f1' : 'var(--fg-2)', fontWeight: scale === 1 ? 700 : 400 }}>
                              {fmt(area, 4)}
                            </td>
                            {result.perimeter !== null && (
                              <td style={TD}>{perimeter !== null ? fmt(perimeter, 4) : '—'}</td>
                            )}
                            <td style={TD}>{fmt(area / (result.area || 1), 2)}×</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── TIER 3b: Unit Conversion Table ── */}
          <div>
            <button
              onClick={() => setShowUnits(v => !v)}
              style={{
                width: '100%', textAlign: 'left', padding: '14px 20px',
                background: 'var(--bg-1)', border: '1px solid var(--line-strong)',
                borderRadius: 12, color: '#c4b5fd', fontWeight: 700, fontSize: 14,
                cursor: 'pointer',
              }}
              aria-expanded={showUnits}
            >
              {showUnits ? '▾' : '▸'} Area in All Units
            </button>
            {showUnits && (
              <div style={{ ...CARD, padding: 0, overflow: 'hidden', marginTop: 4 }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr>
                        <th style={{ ...TH, textAlign: 'left' }}>Unit</th>
                        <th style={TH}>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(Object.entries(UNIT_LABELS) as [UnitKey, string][]).map(([u, label]) => (
                        <tr key={u} style={{
                          borderBottom: '1px solid rgba(255,255,255,0.05)',
                          background: u === unit ? 'rgba(139,92,246,0.08)' : 'transparent',
                        }}>
                          <td style={{ ...TD, textAlign: 'left', color: u === unit ? '#c4b5fd' : 'var(--fg-2)', fontWeight: u === unit ? 700 : 400 }}>
                            {u === unit ? '★ ' : ''}{label}
                          </td>
                          <td style={{ ...TD, color: u === unit ? '#6366f1' : 'var(--fg-2)', fontWeight: u === unit ? 700 : 400 }}>
                            {fmt(areaAllUnits[u], 6)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* ── TIER 4: Real-world context ── */}
          {realWorld && (
            <div style={{ ...CARD, background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.2)' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 700, color: '#c4b5fd', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Real-World Context
              </h3>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                {realWorld}
              </p>
              {result.area > 0 && (
                <p style={{ margin: '8px 0 0', fontSize: 13, color: 'var(--fg-3)', lineHeight: 1.7 }}>
                  {`${fmt(result.area, 4)} ${unitLabel} = ${fmt(areaAllUnits['cm2'], 2)} cm² = ${fmt(areaAllUnits['ft2'], 4)} ft² = ${fmt(areaAllUnits['acres'], 6)} acres`}
                </p>
              )}
            </div>
          )}
        </>
      ) : (
        <div style={{ ...CARD, textAlign: 'center', padding: '40px 20px', color: 'var(--fg-3)', fontSize: 14 }}>
          Enter all dimensions above — results update instantly.
        </div>
      )}
    </div>
  )
}
