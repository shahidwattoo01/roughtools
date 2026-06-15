'use client'
import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type Mode = 'power' | 'root' | 'scientific' | 'equation'

interface ExponentResult {
  exact: number
  scientific: string
  engineering: string
  steps: string[]
}

// ─── Math helpers ─────────────────────────────────────────────────────────────

function toEngineering(n: number): string {
  if (!isFinite(n) || n === 0) return n.toString()
  const sign = n < 0 ? '-' : ''
  const abs = Math.abs(n)
  const exp = Math.floor(Math.log10(abs))
  const engExp = Math.floor(exp / 3) * 3
  const coeff = abs / Math.pow(10, engExp)
  const suffix: Record<number, string> = {
    24: 'Y', 21: 'Z', 18: 'E', 15: 'P', 12: 'T', 9: 'G', 6: 'M', 3: 'k',
    0: '', '-3': 'm', '-6': 'μ', '-9': 'n', '-12': 'p', '-15': 'f',
  }
  const s = suffix[engExp]
  if (s !== undefined) {
    return `${sign}${parseFloat(coeff.toPrecision(6))} × 10^${engExp}${s !== '' ? ` (${s})` : ''}`
  }
  return `${sign}${parseFloat(coeff.toPrecision(6))} × 10^${engExp}`
}

function fmtNum(n: number): string {
  if (!isFinite(n)) return n > 0 ? '+Infinity' : '-Infinity'
  if (Math.abs(n) >= 1e15 || (Math.abs(n) < 1e-6 && n !== 0)) return n.toPrecision(10)
  return parseFloat(n.toPrecision(12)).toLocaleString('en-US', { maximumFractionDigits: 10 })
}

function calcPower(base: number, exp: number): ExponentResult | null {
  if (isNaN(base) || isNaN(exp)) return null
  // Handle negative base with fractional exponent (complex result)
  if (base < 0 && !Number.isInteger(exp)) return null
  const exact = Math.pow(base, exp)
  const steps: string[] = [
    `Base: ${base}`,
    `Exponent: ${exp}`,
    exp < 0 ? `Negative exponent: ${base}^${exp} = 1 / ${base}^${Math.abs(exp)} = 1 / ${Math.pow(base, Math.abs(exp)).toPrecision(8)}` : '',
    exp % 1 !== 0 ? `Fractional exponent: ${base}^(${exp}) = ${exp}-th power of ${base}` : '',
    `Result: ${fmtNum(exact)}`,
  ].filter(Boolean)
  return { exact, scientific: exact.toExponential(8), engineering: toEngineering(exact), steps }
}

function calcRoot(x: number, n: number): ExponentResult | null {
  if (isNaN(x) || isNaN(n) || n === 0) return null
  if (x < 0 && n % 2 === 0) return null // even root of negative is complex
  const exact = x < 0 ? -Math.pow(-x, 1 / n) : Math.pow(x, 1 / n)
  const steps = [
    `Compute: ⁿ√x = x^(1/n)`,
    `x = ${x}, n = ${n}`,
    `= ${x}^(1/${n}) = ${fmtNum(exact)}`,
    `Verify: ${fmtNum(exact)}^${n} = ${fmtNum(Math.pow(exact, n))}`,
  ]
  return { exact, scientific: exact.toExponential(8), engineering: toEngineering(exact), steps }
}

function calcSciNotation(coeff: number, power: number): ExponentResult | null {
  if (isNaN(coeff) || isNaN(power)) return null
  const exact = coeff * Math.pow(10, power)
  const steps = [
    `${coeff} × 10^${power}`,
    `= ${coeff} × ${Math.pow(10, power).toLocaleString()}`,
    `= ${fmtNum(exact)}`,
  ]
  return { exact, scientific: exact.toExponential(8), engineering: toEngineering(exact), steps }
}

function calcEquation(a: number, b: number): ExponentResult | null {
  // Solve: a^x = b  →  x = log(b)/log(a)
  if (isNaN(a) || isNaN(b) || a <= 0 || a === 1 || b <= 0) return null
  const exact = Math.log(b) / Math.log(a)
  const steps = [
    `Solve: ${a}^x = ${b}`,
    `Take log of both sides: x · log(${a}) = log(${b})`,
    `x = log(${b}) / log(${a})`,
    `x = ${Math.log(b).toPrecision(8)} / ${Math.log(a).toPrecision(8)}`,
    `x = ${fmtNum(exact)}`,
    `Verify: ${a}^${fmtNum(exact)} = ${fmtNum(Math.pow(a, exact))} ≈ ${b}`,
  ]
  return { exact, scientific: exact.toExponential(8), engineering: toEngineering(exact), steps }
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
const TD: CSSProperties = { padding: '6px 12px', fontSize: 12, textAlign: 'right', color: 'var(--fg-2)', whiteSpace: 'nowrap' }

// ─── Sub-components ───────────────────────────────────────────────────────────

function MetricCard({ label, value, sub, color = '#6366f1' }: {
  label: string; value: string; sub?: string; color?: string
}) {
  return (
    <div style={{ padding: '18px 14px', background: 'var(--bg-2)', borderRadius: 12, textAlign: 'center' }}>
      <div style={{ fontSize: 22, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

function Field({ label, value, onChange, placeholder, min, step, hint }: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; min?: number; step?: number; hint?: string
}) {
  return (
    <div>
      <label style={LABEL}>{label}</label>
      <input
        type="number" value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        min={min} step={step}
        style={INPUT_BOX}
        aria-label={label}
      />
      {hint && <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 3 }}>{hint}</div>}
    </div>
  )
}

// ─── Laws of Exponents Reference ─────────────────────────────────────────────

const LAWS = [
  { law: 'xᵃ · xᵇ = xᵃ⁺ᵇ',    example: '2³ · 2⁴ = 2⁷ = 128',          name: 'Product of Powers' },
  { law: 'xᵃ / xᵇ = xᵃ⁻ᵇ',    example: '3⁵ / 3² = 3³ = 27',           name: 'Quotient of Powers' },
  { law: '(xᵃ)ᵇ = xᵃᵇ',        example: '(2³)⁴ = 2¹² = 4096',         name: 'Power of a Power' },
  { law: '(xy)ⁿ = xⁿ · yⁿ',    example: '(2·3)² = 4·9 = 36',           name: 'Power of a Product' },
  { law: 'x⁻ⁿ = 1/xⁿ',         example: '2⁻³ = 1/8 = 0.125',           name: 'Negative Exponent' },
  { law: 'x^(1/n) = ⁿ√x',      example: '8^(1/3) = ∛8 = 2',            name: 'Fractional Exponent' },
  { law: 'x⁰ = 1 (x ≠ 0)',     example: '7⁰ = 1, (−5)⁰ = 1',          name: 'Zero Exponent' },
  { law: 'x^(p/q) = ⁽ᑫ√x)ᵖ',   example: '4^(3/2) = (√4)³ = 8',        name: 'Rational Exponent' },
]

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ExponentCalculatorClient() {
  const [mode, setMode]         = useState<Mode>('power')
  // Power mode
  const [base, setBase]         = useState('2')
  const [exponent, setExponent] = useState('10')
  // Root mode
  const [rootX, setRootX]       = useState('64')
  const [rootN, setRootN]       = useState('3')
  // Scientific notation mode
  const [sciCoeff, setSciCoeff] = useState('1.5')
  const [sciPow, setSciPow]     = useState('6')
  // Equation mode
  const [eqA, setEqA]           = useState('2')
  const [eqB, setEqB]           = useState('1024')
  // UI
  const [showLaws, setShowLaws]         = useState(false)
  const [showPowTable, setShowPowTable] = useState(false)
  const [showSeqTable, setShowSeqTable] = useState(false)

  const result = useMemo<ExponentResult | null>(() => {
    if (mode === 'power')      return calcPower(parseFloat(base), parseFloat(exponent))
    if (mode === 'root')       return calcRoot(parseFloat(rootX), parseFloat(rootN))
    if (mode === 'scientific') return calcSciNotation(parseFloat(sciCoeff), parseFloat(sciPow))
    if (mode === 'equation')   return calcEquation(parseFloat(eqA), parseFloat(eqB))
    return null
  }, [mode, base, exponent, rootX, rootN, sciCoeff, sciPow, eqA, eqB])

  // Powers table: x^2 through x^10 for x=1..20
  const powersTable = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => {
      const x = i + 1
      return { x, powers: Array.from({ length: 9 }, (_, j) => Math.pow(x, j + 2)) }
    })
  }, [])

  // Sequence table: current base raised to powers 1-10
  const seqBase = parseFloat(base) || 2
  const seqTable = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => ({
      power: i + 1,
      value: Math.pow(seqBase, i + 1),
    }))
  }, [seqBase])

  const modeLabels: Record<Mode, string> = {
    power: 'xⁿ Power',
    root: 'ⁿ√x Root',
    scientific: '×10ⁿ Scientific',
    equation: 'aˣ=b Equation',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── MODE SELECTOR ── */}
      <div style={CARD}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {(Object.keys(modeLabels) as Mode[]).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                ...BTN_GHOST,
                background: mode === m ? 'rgba(139,92,246,0.3)' : 'rgba(139,92,246,0.06)',
                borderColor: mode === m ? 'rgba(139,92,246,0.8)' : 'rgba(139,92,246,0.2)',
                color: mode === m ? '#e9d5ff' : 'var(--brand-2)',
              }}
              aria-pressed={mode === m}
            >
              {modeLabels[m]}
            </button>
          ))}
        </div>

        {/* Mode-specific inputs */}
        {mode === 'power' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
            <Field label="Base (x)" value={base} onChange={setBase} step={0.001} placeholder="2" hint="Any real number" />
            <Field label="Exponent (n)" value={exponent} onChange={setExponent} step={0.001} placeholder="10" hint="Negative or fractional OK" />
          </div>
        )}
        {mode === 'root' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
            <Field label="Value (x)" value={rootX} onChange={setRootX} step={0.001} placeholder="64" hint="Number to find root of" />
            <Field label="Root degree (n)" value={rootN} onChange={setRootN} step={1} placeholder="3" hint="2=square, 3=cube, etc." />
          </div>
        )}
        {mode === 'scientific' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
            <Field label="Coefficient" value={sciCoeff} onChange={setSciCoeff} step={0.001} placeholder="1.5" hint="Typically 1 ≤ |a| < 10" />
            <Field label="Power of 10" value={sciPow} onChange={setSciPow} step={1} placeholder="6" hint="Integer exponent" />
          </div>
        )}
        {mode === 'equation' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
            <Field label="Base (a)" value={eqA} onChange={setEqA} step={0.001} placeholder="2" hint="Positive, not 1" />
            <Field label="Result (b)" value={eqB} onChange={setEqB} step={0.001} placeholder="1024" hint="Solve: aˣ = b" />
          </div>
        )}
      </div>

      {/* ── RESULTS ── */}
      {result !== null ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
            <MetricCard
              label={mode === 'power' ? `${base}^${exponent}` : mode === 'root' ? `${rootN}th root of ${rootX}` : mode === 'scientific' ? `${sciCoeff}×10^${sciPow}` : `x in ${eqA}^x=${eqB}`}
              value={fmtNum(result.exact)}
              color="#6366f1"
            />
            <MetricCard label="Scientific Notation" value={result.scientific} color="#f59e0b" />
            <MetricCard label="Engineering Notation" value={result.engineering} color="#10b981" />
          </div>

          {/* Step-by-step */}
          <div style={{ ...CARD, background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.2)' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 700, color: 'var(--brand-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Step-by-Step
            </h3>
            <ol style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {result.steps.map((s, i) => (
                <li key={i} style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.6 }}>{s}</li>
              ))}
            </ol>
          </div>

          {/* Power sequence table for current base */}
          <div>
            <button
              onClick={() => setShowSeqTable(v => !v)}
              style={{
                width: '100%', textAlign: 'left', padding: '14px 20px',
                background: 'var(--bg-1)', border: '1px solid var(--line-strong)',
                borderRadius: 12, color: 'var(--brand-2)', fontWeight: 700, fontSize: 14, cursor: 'pointer',
              }}
              aria-expanded={showSeqTable}
            >
              {showSeqTable ? '▾' : '▸'} Power Sequence: {seqBase} raised to powers 1–10
            </button>
            {showSeqTable && (
              <div style={{ ...CARD, padding: 0, overflow: 'hidden', marginTop: 4 }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }} aria-label="Power sequence table">
                    <thead>
                      <tr>
                        <th style={{ ...TH, textAlign: 'left' }}>Power n</th>
                        <th style={TH}>{seqBase}^n</th>
                        <th style={TH}>Scientific</th>
                        <th style={TH}>Engineering</th>
                      </tr>
                    </thead>
                    <tbody>
                      {seqTable.map(row => (
                        <tr key={row.power} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ ...TD, textAlign: 'left', color: 'var(--fg-3)', fontFamily: 'monospace' }}>{seqBase}^{row.power}</td>
                          <td style={{ ...TD, color: 'var(--brand-2)', fontFamily: 'monospace', fontWeight: 600 }}>{fmtNum(row.value)}</td>
                          <td style={{ ...TD, fontFamily: 'monospace' }}>{row.value.toExponential(4)}</td>
                          <td style={{ ...TD, fontFamily: 'monospace', fontSize: 11 }}>{toEngineering(row.value)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div style={{ ...CARD, textAlign: 'center', padding: '40px 20px', color: 'var(--fg-3)', fontSize: 14 }}>
          {mode === 'root' && parseFloat(rootX) < 0 && parseFloat(rootN) % 2 === 0
            ? '⚠ Cannot compute even root of a negative number (result is complex).'
            : mode === 'power' && parseFloat(base) < 0 && !Number.isInteger(parseFloat(exponent))
            ? '⚠ Negative base with fractional exponent produces complex results not shown here.'
            : 'Enter values above — results update instantly.'}
        </div>
      )}

      {/* ── LAWS OF EXPONENTS ── */}
      <div>
        <button
          onClick={() => setShowLaws(v => !v)}
          style={{
            width: '100%', textAlign: 'left', padding: '14px 20px',
            background: 'var(--bg-1)', border: '1px solid var(--line-strong)',
            borderRadius: 12, color: 'var(--brand-2)', fontWeight: 700, fontSize: 14, cursor: 'pointer',
          }}
          aria-expanded={showLaws}
        >
          {showLaws ? '▾' : '▸'} Laws of Exponents Reference
        </button>
        {showLaws && (
          <div style={{ ...CARD, padding: 0, overflow: 'hidden', marginTop: 4 }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }} aria-label="Laws of exponents">
                <thead>
                  <tr>
                    <th style={{ ...TH, textAlign: 'left' }}>Rule Name</th>
                    <th style={{ ...TH, textAlign: 'left' }}>Law</th>
                    <th style={{ ...TH, textAlign: 'left' }}>Example</th>
                  </tr>
                </thead>
                <tbody>
                  {LAWS.map(row => (
                    <tr key={row.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ ...TD, textAlign: 'left', color: 'var(--fg-3)', fontWeight: 600 }}>{row.name}</td>
                      <td style={{ ...TD, textAlign: 'left', fontFamily: 'monospace', color: 'var(--brand-2)', fontSize: 14 }}>{row.law}</td>
                      <td style={{ ...TD, textAlign: 'left', color: '#10b981', fontFamily: 'monospace', fontSize: 12 }}>{row.example}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── POWERS TABLE x^2 to x^10 for x=1..20 ── */}
      <div>
        <button
          onClick={() => setShowPowTable(v => !v)}
          style={{
            width: '100%', textAlign: 'left', padding: '14px 20px',
            background: 'var(--bg-1)', border: '1px solid var(--line-strong)',
            borderRadius: 12, color: 'var(--brand-2)', fontWeight: 700, fontSize: 14, cursor: 'pointer',
          }}
          aria-expanded={showPowTable}
        >
          {showPowTable ? '▾' : '▸'} Powers Table: x² through x¹⁰ for x = 1–20
        </button>
        {showPowTable && (
          <div style={{ ...CARD, padding: 0, overflow: 'hidden', marginTop: 4 }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }} aria-label="Powers reference table">
                <thead>
                  <tr>
                    <th style={{ ...TH, textAlign: 'left' }}>x</th>
                    {Array.from({ length: 9 }, (_, i) => (
                      <th key={i + 2} style={TH}>x^{i + 2}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {powersTable.map(row => (
                    <tr key={row.x} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ ...TD, textAlign: 'left', color: 'var(--brand-2)', fontWeight: 700 }}>{row.x}</td>
                      {row.powers.map((p, i) => (
                        <td key={i} style={{ ...TD, color: i === 0 ? '#f59e0b' : 'var(--fg-2)' }}>
                          {p >= 1e9 ? p.toExponential(2) : p.toLocaleString()}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
