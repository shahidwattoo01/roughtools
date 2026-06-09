'use client'
import { useState } from 'react'

// ── Mini-Calculator Definitions ──────────────────────────────────────────────

const MINI_CALCS = [
  {
    id: 'percentage',
    title: '% of Number',
    icon: '%',
    description: 'Find percentage of a number',
    fields: [
      { id: 'pct', label: 'Percentage', placeholder: '25' },
      { id: 'num', label: 'of Number', placeholder: '200' },
    ],
    calc: (v: Record<string, string>) => {
      const r = (parseFloat(v.pct) / 100) * parseFloat(v.num)
      return isNaN(r) ? '' : `${v.pct}% of ${v.num} = ${r.toFixed(4)}`
    },
  },
  {
    id: 'pct-change',
    title: '% Change',
    icon: '📈',
    description: 'Percentage increase or decrease',
    fields: [
      { id: 'from', label: 'From', placeholder: '100' },
      { id: 'to', label: 'To', placeholder: '150' },
    ],
    calc: (v: Record<string, string>) => {
      const r = ((parseFloat(v.to) - parseFloat(v.from)) / Math.abs(parseFloat(v.from))) * 100
      return isNaN(r) ? '' : `Change: ${r >= 0 ? '+' : ''}${r.toFixed(2)}%`
    },
  },
  {
    id: 'fraction-decimal',
    title: 'Fraction ↔ Decimal',
    icon: '½',
    description: 'Convert fraction to decimal',
    fields: [
      { id: 'num', label: 'Numerator', placeholder: '3' },
      { id: 'den', label: 'Denominator', placeholder: '4' },
    ],
    calc: (v: Record<string, string>) => {
      const d = parseInt(v.den)
      if (!d) return ''
      const r = parseInt(v.num) / d
      return `${v.num}/${v.den} = ${r.toFixed(8).replace(/\.?0+$/, '')}`
    },
  },
  {
    id: 'area-rect',
    title: 'Rectangle Area',
    icon: '▭',
    description: 'Area of a rectangle',
    fields: [
      { id: 'l', label: 'Length', placeholder: '10' },
      { id: 'w', label: 'Width', placeholder: '5' },
    ],
    calc: (v: Record<string, string>) => {
      const r = parseFloat(v.l) * parseFloat(v.w)
      return isNaN(r) ? '' : `Area = ${r} sq units`
    },
  },
  {
    id: 'area-circle',
    title: 'Circle Area',
    icon: '○',
    description: 'Area of a circle',
    fields: [
      { id: 'r', label: 'Radius', placeholder: '5' },
    ],
    calc: (v: Record<string, string>) => {
      const r = Math.PI * Math.pow(parseFloat(v.r), 2)
      return isNaN(r) ? '' : `Area = ${r.toFixed(4)} sq units`
    },
  },
  {
    id: 'area-triangle',
    title: 'Triangle Area',
    icon: '△',
    description: 'Area of a triangle',
    fields: [
      { id: 'b', label: 'Base', placeholder: '6' },
      { id: 'h', label: 'Height', placeholder: '4' },
    ],
    calc: (v: Record<string, string>) => {
      const r = 0.5 * parseFloat(v.b) * parseFloat(v.h)
      return isNaN(r) ? '' : `Area = ${r} sq units`
    },
  },
  {
    id: 'volume-cube',
    title: 'Cube Volume',
    icon: '⬛',
    description: 'Volume of a cube',
    fields: [
      { id: 's', label: 'Side Length', placeholder: '3' },
    ],
    calc: (v: Record<string, string>) => {
      const r = Math.pow(parseFloat(v.s), 3)
      return isNaN(r) ? '' : `Volume = ${r} cubic units`
    },
  },
  {
    id: 'volume-sphere',
    title: 'Sphere Volume',
    icon: '🔮',
    description: 'Volume of a sphere',
    fields: [
      { id: 'r', label: 'Radius', placeholder: '5' },
    ],
    calc: (v: Record<string, string>) => {
      const r = (4 / 3) * Math.PI * Math.pow(parseFloat(v.r), 3)
      return isNaN(r) ? '' : `Volume = ${r.toFixed(4)} cubic units`
    },
  },
  {
    id: 'speed',
    title: 'Speed / Distance / Time',
    icon: '🚀',
    description: 'Solve for speed, distance or time',
    fields: [
      { id: 'd', label: 'Distance (leave 0 to solve)', placeholder: '0' },
      { id: 's', label: 'Speed (leave 0 to solve)', placeholder: '60' },
      { id: 't', label: 'Time (leave 0 to solve)', placeholder: '2' },
    ],
    calc: (v: Record<string, string>) => {
      const d = parseFloat(v.d), s = parseFloat(v.s), t = parseFloat(v.t)
      if (d === 0 && s && t) return `Distance = ${s * t}`
      if (s === 0 && d && t) return `Speed = ${(d / t).toFixed(4)}`
      if (t === 0 && d && s) return `Time = ${(d / s).toFixed(4)}`
      return ''
    },
  },
  {
    id: 'temperature',
    title: 'Temperature Convert',
    icon: '🌡️',
    description: 'Celsius, Fahrenheit, Kelvin',
    fields: [
      { id: 'val', label: 'Value', placeholder: '100' },
      { id: 'from', label: 'From (C/F/K)', placeholder: 'C' },
    ],
    calc: (v: Record<string, string>) => {
      const x = parseFloat(v.val)
      const from = v.from?.trim().toUpperCase()
      if (isNaN(x)) return ''
      let C = x
      if (from === 'F') C = (x - 32) * 5 / 9
      if (from === 'K') C = x - 273.15
      const F = C * 9 / 5 + 32
      const K = C + 273.15
      return `C: ${C.toFixed(2)} | F: ${F.toFixed(2)} | K: ${K.toFixed(2)}`
    },
  },
  {
    id: 'unit-length',
    title: 'Length Convert',
    icon: '📏',
    description: 'Convert length units',
    fields: [
      { id: 'val', label: 'Value (meters)', placeholder: '1' },
    ],
    calc: (v: Record<string, string>) => {
      const m = parseFloat(v.val)
      return isNaN(m) ? '' : `${m} m = ${(m * 3.28084).toFixed(4)} ft = ${(m * 39.3701).toFixed(4)} in = ${(m / 1000).toFixed(6)} km = ${(m * 1.09361).toFixed(4)} yd`
    },
  },
  {
    id: 'weight',
    title: 'Weight Convert',
    icon: '⚖️',
    description: 'Convert weight units',
    fields: [
      { id: 'val', label: 'Value (kg)', placeholder: '70' },
    ],
    calc: (v: Record<string, string>) => {
      const kg = parseFloat(v.val)
      return isNaN(kg) ? '' : `${kg} kg = ${(kg * 2.20462).toFixed(4)} lbs = ${(kg * 1000).toFixed(0)} g = ${(kg / 1000).toFixed(6)} t`
    },
  },
  {
    id: 'power',
    title: 'Power (Exponent)',
    icon: 'xⁿ',
    description: 'Base raised to exponent',
    fields: [
      { id: 'base', label: 'Base', placeholder: '2' },
      { id: 'exp', label: 'Exponent', placeholder: '10' },
    ],
    calc: (v: Record<string, string>) => {
      const r = Math.pow(parseFloat(v.base), parseFloat(v.exp))
      return isNaN(r) ? '' : `${v.base}^${v.exp} = ${r}`
    },
  },
  {
    id: 'log-calc',
    title: 'Logarithm',
    icon: 'log',
    description: 'log base b of x',
    fields: [
      { id: 'x', label: 'Number (x)', placeholder: '100' },
      { id: 'b', label: 'Base (b)', placeholder: '10' },
    ],
    calc: (v: Record<string, string>) => {
      const r = Math.log(parseFloat(v.x)) / Math.log(parseFloat(v.b))
      return isNaN(r) ? '' : `log_${v.b}(${v.x}) = ${r.toFixed(6)}`
    },
  },
  {
    id: 'quadratic',
    title: 'Quadratic Formula',
    icon: 'ax²',
    description: 'Solve ax² + bx + c = 0',
    fields: [
      { id: 'a', label: 'a', placeholder: '1' },
      { id: 'b', label: 'b', placeholder: '-5' },
      { id: 'c', label: 'c', placeholder: '6' },
    ],
    calc: (v: Record<string, string>) => {
      const a = parseFloat(v.a), b = parseFloat(v.b), c = parseFloat(v.c)
      const disc = b * b - 4 * a * c
      if (disc < 0) return 'No real roots'
      const x1 = (-b + Math.sqrt(disc)) / (2 * a)
      const x2 = (-b - Math.sqrt(disc)) / (2 * a)
      return `x₁ = ${x1.toFixed(4)}, x₂ = ${x2.toFixed(4)}`
    },
  },
  {
    id: 'slope',
    title: 'Slope',
    icon: '/',
    description: 'Slope between two points',
    fields: [
      { id: 'x1', label: 'x₁', placeholder: '0' },
      { id: 'y1', label: 'y₁', placeholder: '0' },
      { id: 'x2', label: 'x₂', placeholder: '4' },
      { id: 'y2', label: 'y₂', placeholder: '8' },
    ],
    calc: (v: Record<string, string>) => {
      const dx = parseFloat(v.x2) - parseFloat(v.x1)
      if (!dx) return 'Undefined (vertical line)'
      const m = (parseFloat(v.y2) - parseFloat(v.y1)) / dx
      const b = parseFloat(v.y1) - m * parseFloat(v.x1)
      return `m = ${m.toFixed(4)}, y = ${m.toFixed(4)}x + ${b.toFixed(4)}`
    },
  },
  {
    id: 'ratio',
    title: 'Ratio Simplifier',
    icon: ':',
    description: 'Simplify a ratio a:b',
    fields: [
      { id: 'a', label: 'A', placeholder: '12' },
      { id: 'b', label: 'B', placeholder: '16' },
    ],
    calc: (v: Record<string, string>) => {
      const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b)
      const a = parseInt(v.a), b = parseInt(v.b)
      if (!a || !b || isNaN(a) || isNaN(b)) return ''
      const g = gcd(Math.abs(a), Math.abs(b))
      return `${a}:${b} = ${a / g}:${b / g}`
    },
  },
  {
    id: 'average',
    title: 'Average (Mean)',
    icon: 'x̄',
    description: 'Average of comma-separated numbers',
    fields: [
      { id: 'nums', label: 'Numbers (comma-separated)', placeholder: '10, 20, 30, 40' },
    ],
    calc: (v: Record<string, string>) => {
      const nums = v.nums.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n))
      if (!nums.length) return ''
      const sum = nums.reduce((a, b) => a + b, 0)
      return `Count: ${nums.length} | Sum: ${sum} | Mean: ${(sum / nums.length).toFixed(4)}`
    },
  },
  {
    id: 'random',
    title: 'Random Number',
    icon: '🎲',
    description: 'Generate a random integer in range',
    fields: [
      { id: 'min', label: 'Min', placeholder: '1' },
      { id: 'max', label: 'Max', placeholder: '100' },
    ],
    calc: (v: Record<string, string>) => {
      const min = parseInt(v.min), max = parseInt(v.max)
      if (isNaN(min) || isNaN(max) || min > max) return ''
      const r = Math.floor(Math.random() * (max - min + 1)) + min
      return `Random: ${r}`
    },
  },
]

// ── Mini Calc Card ───────────────────────────────────────────────────────────

function MiniCalc({ calc }: { calc: typeof MINI_CALCS[0] }) {
  const [values, setValues] = useState<Record<string, string>>({})
  const [result, setResult] = useState('')

  const set = (id: string, val: string) => setValues(prev => ({ ...prev, [id]: val }))

  const run = () => {
    try { setResult(calc.calc(values) || 'Check inputs') }
    catch { setResult('Error') }
  }

  return (
    <div style={{
      background: 'var(--bg-1)',
      border: '1px solid var(--line-strong)',
      borderRadius: 12,
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{
          fontSize: 20,
          background: 'rgba(139,92,246,0.15)',
          borderRadius: 8,
          padding: '4px 8px',
          lineHeight: 1,
          fontFamily: 'monospace',
          minWidth: 36,
          textAlign: 'center',
        }}>
          {calc.icon}
        </span>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--fg)' }}>{calc.title}</div>
          <div style={{ fontSize: 12, color: 'var(--fg-3)' }}>{calc.description}</div>
        </div>
      </div>

      {calc.fields.map(f => (
        <input
          key={f.id}
          type={f.id === 'from' ? 'text' : 'text'}
          placeholder={`${f.label} (${f.placeholder})`}
          value={values[f.id] ?? ''}
          onChange={e => set(f.id, e.target.value)}
          onKeyDown={e => e.key === 'Enter' && run()}
          style={{
            background: 'var(--bg-1)',
            border: '1px solid var(--line-strong)',
            borderRadius: 6,
            padding: '8px 10px',
            color: 'var(--fg)',
            fontSize: 13,
            outline: 'none',
            width: '100%',
            boxSizing: 'border-box',
          }}
        />
      ))}

      <button
        onClick={run}
        style={{
          background: 'rgba(139,92,246,0.6)',
          border: 'none',
          borderRadius: 6,
          padding: '8px 0',
          color: '#fff',
          fontWeight: 700,
          fontSize: 13,
          cursor: 'pointer',
        }}
      >
        Calculate
      </button>

      {result && (
        <div style={{
          background: 'rgba(139,92,246,0.1)',
          border: '1px solid rgba(139,92,246,0.25)',
          borderRadius: 6,
          padding: '8px 12px',
          fontSize: 13,
          color: '#c4b5fd',
          fontFamily: 'monospace',
          wordBreak: 'break-word',
        }}>
          {result}
        </div>
      )}
    </div>
  )
}

// ── Hub ─────────────────────────────────────────────────────────────────────

export default function CalculatorsHubClient() {
  const [search, setSearch] = useState('')
  const filtered = MINI_CALCS.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ padding: '0 0 48px' }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--fg)', marginBottom: 8 }}>
        Quick Calculators
      </h2>
      <p style={{ color: 'var(--fg-3)', fontSize: 14, marginBottom: 20 }}>
        {MINI_CALCS.length} mini-calculators — results appear instantly below each tool
      </p>

      <input
        type="text"
        placeholder="Search calculators…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          width: '100%',
          maxWidth: 400,
          background: 'var(--bg-1)',
          border: '1px solid var(--line-strong)',
          borderRadius: 8,
          padding: '10px 14px',
          color: 'var(--fg)',
          fontSize: 14,
          outline: 'none',
          marginBottom: 24,
          boxSizing: 'border-box',
        }}
      />

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 16,
      }}>
        {filtered.map(c => <MiniCalc key={c.id} calc={c} />)}
      </div>

      {filtered.length === 0 && (
        <p style={{ color: 'var(--fg-3)', textAlign: 'center', marginTop: 40 }}>
          No calculators match "{search}"
        </p>
      )}
    </div>
  )
}
