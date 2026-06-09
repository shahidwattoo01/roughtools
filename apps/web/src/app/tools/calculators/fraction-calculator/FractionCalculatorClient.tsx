'use client'
import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { exportCalcPDF } from '@/lib/calcPdf'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Frac { n: number; d: number }

interface FractionResult {
  answer: Frac
  decimal: number
  percentage: number
  mixedWhole: number
  mixedNum: number
  mixedDen: number
  isMixed: boolean
  steps: string[]
  lcmDenominators: number
  gcdAnswer: number
}

// ─── Math Utilities ───────────────────────────────────────────────────────────

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a))
  b = Math.abs(Math.round(b))
  return b === 0 ? a : gcd(b, a % b)
}

function lcm(a: number, b: number): number {
  a = Math.abs(Math.round(a))
  b = Math.abs(Math.round(b))
  if (a === 0 || b === 0) return 0
  return (a / gcd(a, b)) * b
}

function simplifyFrac(n: number, d: number): Frac {
  if (d === 0) return { n, d }
  const g = gcd(Math.abs(n), Math.abs(d))
  const sn = n / g
  const sd = d / g
  return sd < 0 ? { n: -sn, d: -sd } : { n: sn, d: sd }
}

function parseMixed(whole: number, num: number, den: number): Frac {
  // Convert whole+num/den to improper fraction
  const sign = whole < 0 || (whole === 0 && num < 0) ? -1 : 1
  const absWhole = Math.abs(whole)
  const absNum = Math.abs(num)
  const absDen = Math.abs(den) || 1
  return simplifyFrac(sign * (absWhole * absDen + absNum), absDen)
}

function fracStr(f: Frac): string {
  if (f.d === 1) return `${f.n}`
  return `${f.n}/${f.d}`
}

function toMixed(f: Frac): { whole: number; num: number; den: number; isMixed: boolean } {
  const whole = Math.trunc(f.n / f.d)
  const num = Math.abs(f.n % f.d)
  const den = Math.abs(f.d)
  return { whole, num, den, isMixed: num !== 0 && Math.abs(f.n) >= Math.abs(f.d) }
}

function buildStepsAdd(a: Frac, b: Frac, op: 'add' | 'sub'): string[] {
  const steps: string[] = []
  const L = lcm(Math.abs(a.d), Math.abs(b.d))
  const multA = L / Math.abs(a.d)
  const multB = L / Math.abs(b.d)
  const newNA = a.n * multA
  const newNB = b.n * multB

  steps.push(`Step 1: Find LCD of denominators ${a.d} and ${b.d}`)
  steps.push(`  LCD(${a.d}, ${b.d}) = ${L}`)
  steps.push(`Step 2: Convert both fractions to equivalent fractions with LCD`)
  steps.push(`  ${fracStr(a)} = ${newNA}/${L}  (multiply top & bottom by ${multA})`)
  steps.push(`  ${fracStr(b)} = ${newNB}/${L}  (multiply top & bottom by ${multB})`)
  steps.push(`Step 3: ${op === 'add' ? 'Add' : 'Subtract'} numerators`)
  const resultN = op === 'add' ? newNA + newNB : newNA - newNB
  steps.push(`  (${newNA}) ${op === 'add' ? '+' : '−'} (${newNB}) = ${resultN}`)
  steps.push(`  Result: ${resultN}/${L}`)
  const simplified = simplifyFrac(resultN, L)
  if (Math.abs(resultN) !== Math.abs(simplified.n) || L !== simplified.d) {
    const g = gcd(Math.abs(resultN), L)
    steps.push(`Step 4: Simplify using GCD(${Math.abs(resultN)}, ${L}) = ${g}`)
    steps.push(`  ${resultN}/${L} ÷ ${g}/${g} = ${fracStr(simplified)}`)
  } else {
    steps.push(`Step 4: Already in simplest form — GCD(${Math.abs(resultN)}, ${L}) = 1`)
  }
  return steps
}

function buildStepsMul(a: Frac, b: Frac): string[] {
  const steps: string[] = []
  steps.push(`Step 1: Multiply numerators`)
  steps.push(`  ${a.n} × ${b.n} = ${a.n * b.n}`)
  steps.push(`Step 2: Multiply denominators`)
  steps.push(`  ${a.d} × ${b.d} = ${a.d * b.d}`)
  steps.push(`  Result: ${a.n * b.n}/${a.d * b.d}`)
  const simplified = simplifyFrac(a.n * b.n, a.d * b.d)
  const g = gcd(Math.abs(a.n * b.n), Math.abs(a.d * b.d))
  if (g > 1) {
    steps.push(`Step 3: Simplify — GCD(${Math.abs(a.n * b.n)}, ${Math.abs(a.d * b.d)}) = ${g}`)
    steps.push(`  ${a.n * b.n}/${a.d * b.d} ÷ ${g}/${g} = ${fracStr(simplified)}`)
  } else {
    steps.push(`Step 3: Already in simplest form`)
  }
  return steps
}

function buildStepsDiv(a: Frac, b: Frac): string[] {
  const steps: string[] = []
  steps.push(`Step 1: Take the reciprocal of the second fraction`)
  steps.push(`  Reciprocal of ${fracStr(b)} = ${b.d}/${b.n}`)
  steps.push(`Step 2: Multiply the first fraction by the reciprocal`)
  steps.push(`  ${fracStr(a)} × ${b.d}/${b.n}`)
  const num = a.n * b.d
  const den = a.d * b.n
  steps.push(`  = ${num}/${den}`)
  const simplified = simplifyFrac(num, den)
  const g = gcd(Math.abs(num), Math.abs(den))
  if (g > 1) {
    steps.push(`Step 3: Simplify — GCD(${Math.abs(num)}, ${Math.abs(den)}) = ${g}`)
    steps.push(`  ${num}/${den} ÷ ${g}/${g} = ${fracStr(simplified)}`)
  } else {
    steps.push(`Step 3: Already in simplest form`)
  }
  return steps
}

// ─── CSV Export ───────────────────────────────────────────────────────────────

function exportCSV(rows: Array<Record<string, string>>, filename: string) {
  if (rows.length === 0) return
  const headers = Object.keys(rows[0])
  const csv = [headers, ...rows.map(r => headers.map(h => r[h]))].map(r => r.join(',')).join('\n')
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })),
    download: filename,
  })
  a.click()
}

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
  color: 'var(--fg-3)', textAlign: 'left', background: 'rgba(99,102,241,0.1)',
  whiteSpace: 'nowrap',
}
const TD: CSSProperties = {
  padding: '7px 12px', fontSize: 13, textAlign: 'left',
  color: 'var(--fg-2)', whiteSpace: 'nowrap',
  borderBottom: '1px solid rgba(255,255,255,0.04)',
}

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

function FractionDisplay({ whole, num, den, color = '#c4b5fd' }: {
  whole?: number; num: number; den: number; color?: string
}) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      {whole !== undefined && whole !== 0 && (
        <span style={{ fontSize: 26, fontWeight: 900, color }}>{whole}</span>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
        <span style={{ fontSize: 18, fontWeight: 800, color, borderBottom: `2px solid ${color}`, paddingBottom: 1, minWidth: 20, textAlign: 'center' }}>{num}</span>
        <span style={{ fontSize: 18, fontWeight: 800, color, paddingTop: 1, minWidth: 20, textAlign: 'center' }}>{den}</span>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function FractionCalculatorClient() {

  // ── Fraction 1 inputs ──
  const [w1, setW1] = useState('0')
  const [n1, setN1] = useState('3')
  const [d1, setD1] = useState('4')

  // ── Fraction 2 inputs ──
  const [w2, setW2] = useState('0')
  const [n2, setN2] = useState('1')
  const [d2, setD2] = useState('3')

  // ── Operation ──
  const [op, setOp] = useState<'add' | 'sub' | 'mul' | 'div'>('add')

  // ── UI state ──
  const [showSteps, setShowSteps]     = useState(false)
  const [showTable, setShowTable]     = useState(false)
  const [showAllOps, setShowAllOps]   = useState(false)

  // ─── Parse inputs ─────────────────────────────────────────────────────────
  const fracA = useMemo<Frac>(() => parseMixed(
    parseFloat(w1) || 0,
    parseInt(n1) || 0,
    parseInt(d1) || 1,
  ), [w1, n1, d1])

  const fracB = useMemo<Frac>(() => parseMixed(
    parseFloat(w2) || 0,
    parseInt(n2) || 0,
    parseInt(d2) || 1,
  ), [w2, n2, d2])

  // ─── Main calculation ─────────────────────────────────────────────────────
  const result = useMemo<FractionResult | null>(() => {
    const a = fracA
    const b = fracB
    if (a.d === 0 || b.d === 0) return null
    if (op === 'div' && b.n === 0) return null

    let answer: Frac
    let steps: string[] = []

    switch (op) {
      case 'add':
        answer = simplifyFrac(a.n * b.d + b.n * a.d, a.d * b.d)
        steps = buildStepsAdd(a, b, 'add')
        break
      case 'sub':
        answer = simplifyFrac(a.n * b.d - b.n * a.d, a.d * b.d)
        steps = buildStepsAdd(a, b, 'sub')
        break
      case 'mul':
        answer = simplifyFrac(a.n * b.n, a.d * b.d)
        steps = buildStepsMul(a, b)
        break
      case 'div':
        answer = simplifyFrac(a.n * b.d, a.d * b.n)
        steps = buildStepsDiv(a, b)
        break
      default:
        return null
    }

    const decimal = answer.d !== 0 ? answer.n / answer.d : NaN
    const m = toMixed(answer)

    return {
      answer,
      decimal,
      percentage: decimal * 100,
      mixedWhole: m.whole,
      mixedNum: m.num,
      mixedDen: m.den,
      isMixed: m.isMixed,
      steps,
      lcmDenominators: lcm(Math.abs(a.d), Math.abs(b.d)),
      gcdAnswer: gcd(Math.abs(answer.n), Math.abs(answer.d)),
    }
  }, [fracA, fracB, op])

  // ─── All 4 operations on same fractions ───────────────────────────────────
  const allOps = useMemo(() => {
    const a = fracA
    const b = fracB
    if (a.d === 0 || b.d === 0) return null
    const addR = simplifyFrac(a.n * b.d + b.n * a.d, a.d * b.d)
    const subR = simplifyFrac(a.n * b.d - b.n * a.d, a.d * b.d)
    const mulR = simplifyFrac(a.n * b.n, a.d * b.d)
    const divR = b.n !== 0 ? simplifyFrac(a.n * b.d, a.d * b.n) : null
    return [
      { op: 'Add (+)', symbol: '+', result: addR, decimal: addR.n / addR.d },
      { op: 'Subtract (−)', symbol: '−', result: subR, decimal: subR.n / subR.d },
      { op: 'Multiply (×)', symbol: '×', result: mulR, decimal: mulR.n / mulR.d },
      { op: 'Divide (÷)', symbol: '÷', result: divR, decimal: divR ? divR.n / divR.d : null },
    ]
  }, [fracA, fracB])

  // ─── Common fractions reference table ─────────────────────────────────────
  const commonFractions = [
    { frac: '1/2', dec: 0.5, pct: 50 },
    { frac: '1/3', dec: 1/3, pct: 33.333 },
    { frac: '2/3', dec: 2/3, pct: 66.667 },
    { frac: '1/4', dec: 0.25, pct: 25 },
    { frac: '3/4', dec: 0.75, pct: 75 },
    { frac: '1/5', dec: 0.2, pct: 20 },
    { frac: '2/5', dec: 0.4, pct: 40 },
    { frac: '3/5', dec: 0.6, pct: 60 },
    { frac: '4/5', dec: 0.8, pct: 80 },
    { frac: '1/6', dec: 1/6, pct: 16.667 },
    { frac: '5/6', dec: 5/6, pct: 83.333 },
    { frac: '1/8', dec: 0.125, pct: 12.5 },
    { frac: '3/8', dec: 0.375, pct: 37.5 },
    { frac: '5/8', dec: 0.625, pct: 62.5 },
    { frac: '7/8', dec: 0.875, pct: 87.5 },
    { frac: '1/10', dec: 0.1, pct: 10 },
    { frac: '1/12', dec: 1/12, pct: 8.333 },
    { frac: '1/16', dec: 0.0625, pct: 6.25 },
  ]

  const OP_LABELS: Record<string, string> = { add: '+', sub: '−', mul: '×', div: '÷' }
  const opSymbol = OP_LABELS[op]

  // ─── Input helper ──────────────────────────────────────────────────────────
  function NumField({ label, value, onChange, placeholder }: {
    label: string; value: string; onChange: (v: string) => void; placeholder?: string
  }) {
    return (
      <div>
        <label style={LABEL}>{label}</label>
        <input
          type="number" value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={INPUT_BOX}
          aria-label={label}
        />
      </div>
    )
  }

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── INPUTS ── */}
      <div style={CARD}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>

          {/* Fraction A */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-2)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Fraction A
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: 10 }}>
              <NumField label="Whole" value={w1} onChange={setW1} placeholder="0" />
              <div>
                <NumField label="Numerator" value={n1} onChange={setN1} placeholder="3" />
                <div style={{ borderTop: '2px solid rgba(139,92,246,0.6)', margin: '6px 0' }} />
                <NumField label="Denominator" value={d1} onChange={setD1} placeholder="4" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 8 }}>
                {fracA.d !== 0 && (
                  <FractionDisplay
                    whole={fracA.n !== (parseInt(n1) || 0) ? Math.trunc(fracA.n / fracA.d) : undefined}
                    num={Math.abs(fracA.n % fracA.d) || Math.abs(fracA.n)}
                    den={fracA.d}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Operation */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 12, minWidth: 120 }}>
            <label style={LABEL}>Operation</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, width: '100%' }}>
              {(['add', 'sub', 'mul', 'div'] as const).map(o => (
                <button
                  key={o}
                  onClick={() => setOp(o)}
                  style={{
                    padding: '12px 8px', borderRadius: 8, fontSize: 20, fontWeight: 800,
                    cursor: 'pointer', textAlign: 'center',
                    background: op === o ? 'rgba(139,92,246,0.25)' : 'rgba(0,0,0,0.25)',
                    border: op === o ? '2px solid rgba(139,92,246,0.6)' : '1px solid var(--line-strong)',
                    color: op === o ? '#c4b5fd' : 'var(--fg-3)',
                  }}
                  aria-label={o}
                  aria-pressed={op === o}
                >
                  {OP_LABELS[o]}
                </button>
              ))}
            </div>
          </div>

          {/* Fraction B */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-2)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Fraction B
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: 10 }}>
              <NumField label="Whole" value={w2} onChange={setW2} placeholder="0" />
              <div>
                <NumField label="Numerator" value={n2} onChange={setN2} placeholder="1" />
                <div style={{ borderTop: '2px solid rgba(139,92,246,0.6)', margin: '6px 0' }} />
                <NumField label="Denominator" value={d2} onChange={setD2} placeholder="3" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 8 }}>
                {fracB.d !== 0 && (
                  <FractionDisplay
                    whole={fracB.n !== (parseInt(n2) || 0) ? Math.trunc(fracB.n / fracB.d) : undefined}
                    num={Math.abs(fracB.n % fracB.d) || Math.abs(fracB.n)}
                    den={fracB.d}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Equation preview */}
        {result && (
          <div style={{ marginTop: 20, padding: '14px 18px', background: 'rgba(99,102,241,0.08)', borderRadius: 10, border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 18, color: 'var(--fg-2)' }}>
              <span style={{ color: '#a78bfa' }}>{fracStr(fracA)}</span>
              {' '}<span style={{ color: 'var(--fg-3)' }}>{opSymbol}</span>{' '}
              <span style={{ color: '#a78bfa' }}>{fracStr(fracB)}</span>
              <span style={{ color: 'var(--fg-3)' }}> = </span>
              <span style={{ color: '#c4b5fd', fontWeight: 900 }}>{fracStr(result.answer)}</span>
            </span>
            {result.isMixed && (
              <span style={{ fontSize: 13, color: 'var(--fg-3)' }}>
                = {result.mixedWhole} {result.mixedNum}/{result.mixedDen}
              </span>
            )}
            <span style={{ fontSize: 13, color: 'var(--fg-3)' }}>
              ≈ {result.decimal.toFixed(6)}
            </span>
          </div>
        )}
      </div>

      {/* Error messages */}
      {op === 'div' && fracB.n === 0 && (
        <div style={{ ...CARD, background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.25)', color: '#fca5a5', fontSize: 14 }}>
          Cannot divide by zero — Fraction B numerator must not be 0.
        </div>
      )}
      {(fracA.d === 0 || fracB.d === 0) && (
        <div style={{ ...CARD, background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.25)', color: '#fca5a5', fontSize: 14 }}>
          Denominators cannot be zero.
        </div>
      )}

      {result && (
        <>
          {/* ── TIER 1: KEY METRICS ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
            <MetricCard label="Simplified Fraction" value={fracStr(result.answer)} color="#c4b5fd" />
            <MetricCard
              label="Mixed Number"
              value={result.isMixed ? `${result.mixedWhole} ${result.mixedNum}/${result.mixedDen}` : fracStr(result.answer)}
              color="#a78bfa"
            />
            <MetricCard label="Decimal" value={result.decimal.toFixed(6).replace(/\.?0+$/, '')} color="#6366f1" />
            <MetricCard label="Percentage" value={`${result.percentage.toFixed(4)}%`} color="#38bdf8" />
            <MetricCard label="LCD of Denominators" value={String(result.lcmDenominators)} color="#10b981"
              sub={`GCD answer: ${result.gcdAnswer}`} />
          </div>

          {/* ── TIER 2: STEP-BY-STEP SOLUTION ── */}
          <div>
            <button
              onClick={() => setShowSteps(v => !v)}
              style={{
                width: '100%', textAlign: 'left', padding: '14px 20px',
                background: 'var(--bg-1)', border: '1px solid var(--line-strong)',
                borderRadius: 12, color: '#c4b5fd', fontWeight: 700, fontSize: 14,
                cursor: 'pointer',
              }}
              aria-expanded={showSteps}
            >
              {showSteps ? '▾' : '▸'} Step-by-Step Solution
            </button>

            {showSteps && (
              <div style={{ ...CARD, marginTop: 4, padding: '20px 24px' }}>
                <div style={{ fontSize: 13, marginBottom: 8, fontWeight: 700, color: '#c4b5fd' }}>
                  Solving: {fracStr(fracA)} {opSymbol} {fracStr(fracB)} = ?
                </div>
                <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {result.steps.map((step, i) => (
                    <li key={i} style={{
                      fontSize: 13,
                      color: step.startsWith('Step') ? '#a78bfa' : 'var(--fg-2)',
                      fontWeight: step.startsWith('Step') ? 700 : 400,
                      fontFamily: step.startsWith('  ') ? 'monospace' : 'inherit',
                      paddingLeft: step.startsWith('  ') ? 16 : 0,
                      lineHeight: 1.7,
                    }}>
                      {step}
                    </li>
                  ))}
                </ol>
                <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(99,102,241,0.1)', borderRadius: 8, border: '1px solid rgba(99,102,241,0.2)' }}>
                  <span style={{ fontSize: 13, color: '#c4b5fd', fontWeight: 700 }}>Answer: </span>
                  <span style={{ fontSize: 16, color: '#fff', fontWeight: 900, fontFamily: 'monospace' }}>
                    {fracStr(fracA)} {opSymbol} {fracStr(fracB)} = {fracStr(result.answer)}
                    {result.isMixed ? ` = ${result.mixedWhole} ${result.mixedNum}/${result.mixedDen}` : ''}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* ── TIER 3: ALL 4 OPERATIONS SCENARIO ── */}
          {allOps && (
            <div>
              <button
                onClick={() => setShowAllOps(v => !v)}
                style={{
                  width: '100%', textAlign: 'left', padding: '14px 20px',
                  background: 'var(--bg-1)', border: '1px solid var(--line-strong)',
                  borderRadius: 12, color: '#c4b5fd', fontWeight: 700, fontSize: 14,
                  cursor: 'pointer',
                }}
                aria-expanded={showAllOps}
              >
                {showAllOps ? '▾' : '▸'} All 4 Operations — {fracStr(fracA)} and {fracStr(fracB)}
              </button>

              {showAllOps && (
                <div style={{ ...CARD, padding: 0, overflow: 'hidden', marginTop: 4 }}>
                  <div style={{ display: 'flex', gap: 10, padding: '14px 20px', borderBottom: '1px solid var(--line-strong)', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => exportCSV(
                        allOps.map(r => ({
                          Operation: r.op,
                          'Fraction A': fracStr(fracA),
                          Symbol: r.symbol,
                          'Fraction B': fracStr(fracB),
                          Result: r.result ? fracStr(r.result) : 'undefined',
                          Decimal: r.decimal !== null ? r.decimal.toFixed(8) : 'undefined',
                          Percentage: r.decimal !== null ? (r.decimal * 100).toFixed(4) + '%' : 'undefined',
                        })),
                        'fraction-operations.csv'
                      )}
                      style={BTN_GHOST}
                    >
                      ⬇ Export CSV
                    </button>
                    <button
                      onClick={() => exportCalcPDF({
                        toolName: 'Fraction Calculator',
                        inputs: [
                          { label: 'Fraction A', value: fracStr(fracA) },
                          { label: 'Fraction B', value: fracStr(fracB) },
                          { label: 'Operation', value: op.toUpperCase() },
                        ],
                        results: [
                          { label: `${fracStr(fracA)} + ${fracStr(fracB)}`, value: allOps[0].result ? fracStr(allOps[0].result) : '—', highlight: op === 'add' },
                          { label: `${fracStr(fracA)} − ${fracStr(fracB)}`, value: allOps[1].result ? fracStr(allOps[1].result) : '—', highlight: op === 'sub' },
                          { label: `${fracStr(fracA)} × ${fracStr(fracB)}`, value: allOps[2].result ? fracStr(allOps[2].result) : '—', highlight: op === 'mul' },
                          { label: `${fracStr(fracA)} ÷ ${fracStr(fracB)}`, value: allOps[3].result ? fracStr(allOps[3].result) : 'undefined', highlight: op === 'div' },
                          { label: 'LCD of denominators', value: String(result.lcmDenominators) },
                          { label: 'GCD of denominators', value: String(gcd(Math.abs(fracA.d), Math.abs(fracB.d))) },
                        ],
                        formula: 'Add: (ad+bc)/bd | Sub: (ad−bc)/bd | Mul: ac/bd | Div: ad/bc — all simplified by GCD',
                      })}
                      style={BTN_GHOST}
                    >
                      📄 Export PDF
                    </button>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }} aria-label="All operations comparison">
                      <thead>
                        <tr>
                          {['Operation', 'Expression', 'Simplified Fraction', 'Mixed Number', 'Decimal', 'Percentage'].map(h => (
                            <th key={h} style={TH}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {allOps.map(({ op: opName, symbol, result: r, decimal }) => {
                          const isCurrent = (opName.startsWith('Add') && op === 'add') ||
                            (opName.startsWith('Sub') && op === 'sub') ||
                            (opName.startsWith('Mul') && op === 'mul') ||
                            (opName.startsWith('Div') && op === 'div')
                          const m = r ? toMixed(r) : null
                          return (
                            <tr key={opName} style={{
                              background: isCurrent ? 'rgba(139,92,246,0.08)' : 'transparent',
                            }}>
                              <td style={{ ...TD, color: isCurrent ? '#c4b5fd' : 'var(--fg-2)', fontWeight: isCurrent ? 700 : 400 }}>
                                {isCurrent ? '★ ' : ''}{opName}
                              </td>
                              <td style={{ ...TD, fontFamily: 'monospace', color: '#a78bfa' }}>
                                {fracStr(fracA)} {symbol} {fracStr(fracB)}
                              </td>
                              <td style={{ ...TD, fontWeight: 700, color: isCurrent ? '#c4b5fd' : 'var(--fg-2)' }}>
                                {r ? fracStr(r) : <span style={{ color: 'var(--fg-3)' }}>undefined</span>}
                              </td>
                              <td style={TD}>
                                {m?.isMixed ? `${m.whole} ${m.num}/${m.den}` : (r ? fracStr(r) : '—')}
                              </td>
                              <td style={TD}>
                                {decimal !== null ? decimal.toFixed(6) : '—'}
                              </td>
                              <td style={TD}>
                                {decimal !== null ? `${(decimal * 100).toFixed(4)}%` : '—'}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── TIER 4: COMMON FRACTIONS TABLE ── */}
          <div>
            <button
              onClick={() => setShowTable(v => !v)}
              style={{
                width: '100%', textAlign: 'left', padding: '14px 20px',
                background: 'var(--bg-1)', border: '1px solid var(--line-strong)',
                borderRadius: 12, color: '#c4b5fd', fontWeight: 700, fontSize: 14,
                cursor: 'pointer',
              }}
              aria-expanded={showTable}
            >
              {showTable ? '▾' : '▸'} Common Fractions Reference Table
              <span style={{ marginLeft: 12, fontSize: 11, color: 'var(--fg-3)', fontWeight: 400 }}>(18 fractions — decimal & percentage equivalents)</span>
            </button>

            {showTable && (
              <div style={{ ...CARD, padding: 0, overflow: 'hidden', marginTop: 4 }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }} aria-label="Common fractions reference">
                    <thead>
                      <tr>
                        {['Fraction', 'Decimal', 'Percentage', 'Bar'].map(h => (
                          <th key={h} style={TH}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {commonFractions.map(({ frac, dec, pct }) => (
                        <tr key={frac}>
                          <td style={{ ...TD, fontWeight: 700, color: '#c4b5fd', fontFamily: 'monospace' }}>{frac}</td>
                          <td style={{ ...TD, fontFamily: 'monospace' }}>{dec.toFixed(8).replace(/\.?0+$/, '')}</td>
                          <td style={{ ...TD }}>{pct.toFixed(3)}%</td>
                          <td style={{ ...TD, minWidth: 120 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <div style={{ flex: 1, height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                                <div style={{ width: `${pct}%`, height: '100%', background: 'rgba(139,92,246,0.7)', borderRadius: 4 }} />
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* ── TIER 5: GUIDANCE ── */}
          <div style={{ ...CARD, background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.2)' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: '#c4b5fd', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Understanding Your Result
            </h3>
            <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                <strong style={{ color: '#a78bfa' }}>Simplified form</strong> — {fracStr(result.answer)} is already in lowest terms (GCD of numerator and denominator = {result.gcdAnswer}).
              </li>
              {result.isMixed && (
                <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                  <strong style={{ color: '#a78bfa' }}>Mixed number</strong> — {fracStr(result.answer)} as a mixed number is {result.mixedWhole} {result.mixedNum}/{result.mixedDen} (whole part + proper fraction).
                </li>
              )}
              <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                <strong style={{ color: '#a78bfa' }}>LCD</strong> — The Least Common Denominator of {fracA.d} and {fracB.d} is {result.lcmDenominators}. This is used to find equivalent fractions for addition and subtraction.
              </li>
              <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                <strong style={{ color: '#a78bfa' }}>Decimal</strong> — {result.decimal.toFixed(8).replace(/0+$/, '')} — the fraction as a decimal. {
                  result.decimal === Math.round(result.decimal * 1e10) / 1e10 ? 'This is a terminating decimal.' : 'This may be a repeating decimal (rounded to 8 decimal places).'
                }
              </li>
            </ul>
          </div>
        </>
      )}

      {!result && (
        <div style={{ ...CARD, textAlign: 'center', padding: '40px 20px', color: 'var(--fg-3)', fontSize: 14 }}>
          Enter fractions above — results update instantly as you type.
        </div>
      )}
    </div>
  )
}
