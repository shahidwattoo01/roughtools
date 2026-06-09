'use client'
import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { exportCalcPDF } from '@/lib/calcPdf'

// ─── Types ────────────────────────────────────────────────────────────────────

interface QuadResult {
  discriminant: number
  discriminantType: 'two-real' | 'one-real' | 'complex'
  x1Real: number; x1Imag: number
  x2Real: number; x2Imag: number
  vertexH: number; vertexK: number
  axisOfSymmetry: number
  opensDirection: 'up' | 'down'
  yIntercept: number
  sumOfRoots: number
  productOfRoots: number
  factored: string
  steps: string[]
}

// ─── Calculation Engine ───────────────────────────────────────────────────────

function solveQuadratic(a: number, b: number, c: number): QuadResult | null {
  if (a === 0) return null
  const D = b * b - 4 * a * c
  const twoA = 2 * a
  const h = -b / twoA
  const k = c - (b * b) / (4 * a)
  const steps: string[] = []

  steps.push(`Standard form: ${fmtCoeff(a)}x² ${fmtSign(b)}x ${fmtSign(c)}`)
  steps.push(`Discriminant: Δ = b² − 4ac = (${b})² − 4(${a})(${c}) = ${b * b} − ${4 * a * c} = ${D}`)

  let discriminantType: QuadResult['discriminantType']
  let x1Real: number, x1Imag: number, x2Real: number, x2Imag: number

  if (D > 0) {
    discriminantType = 'two-real'
    const sqrtD = Math.sqrt(D)
    x1Real = (-b + sqrtD) / twoA
    x2Real = (-b - sqrtD) / twoA
    x1Imag = 0; x2Imag = 0
    steps.push(`Δ > 0 → two distinct real roots`)
    steps.push(`√Δ = √${D} ≈ ${sqrtD.toFixed(6)}`)
    steps.push(`x₁ = (−b + √Δ) / 2a = (${-b} + ${sqrtD.toFixed(4)}) / ${twoA} = ${x1Real.toFixed(6)}`)
    steps.push(`x₂ = (−b − √Δ) / 2a = (${-b} − ${sqrtD.toFixed(4)}) / ${twoA} = ${x2Real.toFixed(6)}`)
  } else if (D === 0) {
    discriminantType = 'one-real'
    x1Real = x2Real = -b / twoA
    x1Imag = x2Imag = 0
    steps.push(`Δ = 0 → one repeated real root`)
    steps.push(`x = −b / 2a = ${-b} / ${twoA} = ${x1Real.toFixed(6)}`)
  } else {
    discriminantType = 'complex'
    const sqrtAbsD = Math.sqrt(-D)
    x1Real = x2Real = -b / twoA
    x1Imag = sqrtAbsD / twoA
    x2Imag = -sqrtAbsD / twoA
    steps.push(`Δ < 0 → two complex conjugate roots`)
    steps.push(`√|Δ| = √${-D} ≈ ${sqrtAbsD.toFixed(6)}`)
    steps.push(`x₁ = ${fmtComplex(x1Real, x1Imag)}`)
    steps.push(`x₂ = ${fmtComplex(x2Real, x2Imag)}`)
  }

  steps.push(`Vertex: (h, k) = (−b/2a, c−b²/4a) = (${h.toFixed(4)}, ${k.toFixed(4)})`)
  steps.push(`Axis of symmetry: x = ${h.toFixed(4)}`)
  steps.push(`Opens ${a > 0 ? 'upward' : 'downward'} (a ${a > 0 ? '> 0' : '< 0'})`)
  steps.push(`Y-intercept: (0, ${c}) — set x = 0, f(0) = ${c}`)

  const sumOfRoots = -b / a
  const productOfRoots = c / a
  steps.push(`Vieta's: x₁+x₂ = −b/a = ${sumOfRoots.toFixed(4)};  x₁×x₂ = c/a = ${productOfRoots.toFixed(4)}`)

  let factored = ''
  if (discriminantType !== 'complex') {
    if (discriminantType === 'one-real') {
      factored = `${fmtA(a)}(x − ${x1Real.toFixed(4)})²`
    } else {
      factored = `${fmtA(a)}(x − ${x1Real.toFixed(4)})(x − ${x2Real.toFixed(4)})`
    }
    steps.push(`Factored form: ${factored}`)
  }

  return {
    discriminant: D, discriminantType,
    x1Real, x1Imag, x2Real, x2Imag,
    vertexH: h, vertexK: k,
    axisOfSymmetry: h,
    opensDirection: a > 0 ? 'up' : 'down',
    yIntercept: c,
    sumOfRoots, productOfRoots,
    factored, steps,
  }
}

function fmtCoeff(n: number): string {
  if (n === 1) return ''
  if (n === -1) return '−'
  return n < 0 ? `(${n})` : `${n}`
}
function fmtSign(n: number): string {
  if (n === 0) return '+ 0'
  return n > 0 ? `+ ${n}` : `− ${Math.abs(n)}`
}
function fmtA(n: number): string {
  if (n === 1) return ''
  if (n === -1) return '−'
  return `${n}`
}
function fmtComplex(r: number, i: number): string {
  const rStr = r === 0 ? '' : r.toFixed(4)
  const sep = i >= 0 ? ' + ' : ' − '
  return `${rStr}${sep}${Math.abs(i).toFixed(4)}i`
}
function fmt4(n: number): string { return n.toFixed(4).replace(/\.?0+$/, '') }

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
  color: 'var(--fg-3)', textAlign: 'left', background: 'rgba(99,102,241,0.1)',
  whiteSpace: 'nowrap',
}
const TD: CSSProperties = {
  padding: '7px 12px', fontSize: 13, textAlign: 'left',
  color: 'var(--fg-2)', whiteSpace: 'nowrap',
  borderBottom: '1px solid rgba(255,255,255,0.04)',
}

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

// ─── Main Component ───────────────────────────────────────────────────────────

export default function QuadraticFormulaCalculatorClient() {
  const [aVal, setAVal] = useState('1')
  const [bVal, setBVal] = useState('-3')
  const [cVal, setCVal] = useState('2')
  const [showSteps, setShowSteps] = useState(true)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const a = parseFloat(aVal) || 0
  const b = parseFloat(bVal) || 0
  const c = parseFloat(cVal) || 0

  const result = useMemo<QuadResult | null>(() => {
    if (a === 0) return null
    return solveQuadratic(a, b, c)
  }, [a, b, c])

  // Scenario table: same a, c but b at -10, 0, +10 (and -5, +5 in advanced)
  const bScenarios = useMemo(() => {
    const bVals = [-10, -5, 0, 5, 10]
    return bVals.map(bv => ({
      b: bv,
      result: a !== 0 ? solveQuadratic(a, bv, c) : null,
    }))
  }, [a, c])

  function Field({ label, value, onChange, hint }: {
    label: string; value: string; onChange: (v: string) => void; hint?: string
  }) {
    return (
      <div>
        <label style={LABEL}>{label}</label>
        <input
          type="number" value={value}
          onChange={e => onChange(e.target.value)}
          style={INPUT_BOX}
          aria-label={label}
        />
        {hint && <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 3 }}>{hint}</div>}
      </div>
    )
  }

  const discColor = !result ? '#888'
    : result.discriminantType === 'two-real' ? '#10b981'
    : result.discriminantType === 'one-real' ? '#f59e0b'
    : '#e879f9'

  const discLabel = !result ? '—'
    : result.discriminantType === 'two-real' ? 'Two Real Roots'
    : result.discriminantType === 'one-real' ? 'One Real Root (Repeated)'
    : 'Two Complex Roots'

  const equationDisplay = useMemo(() => {
    if (!aVal && !bVal && !cVal) return 'ax² + bx + c = 0'
    const parts: string[] = []
    if (a !== 0) parts.push(`${a === 1 ? '' : a === -1 ? '−' : a}x²`)
    if (b !== 0) parts.push(`${b > 0 && parts.length ? '+ ' : b < 0 ? '− ' : ''}${Math.abs(b) !== 1 ? Math.abs(b) : ''}x`)
    if (c !== 0) parts.push(`${c > 0 && parts.length ? '+ ' : c < 0 ? '− ' : ''}${Math.abs(c)}`)
    if (parts.length === 0) return '0 = 0'
    return parts.join(' ') + ' = 0'
  }, [a, b, c, aVal, bVal, cVal])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── INPUTS ── */}
      <div style={CARD}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: 'var(--fg-3)', marginBottom: 6 }}>Solving:</div>
          <div style={{
            fontFamily: 'monospace', fontSize: 20, fontWeight: 700,
            color: 'var(--fg)', padding: '10px 16px', background: 'rgba(0,0,0,0.3)',
            borderRadius: 8, letterSpacing: '0.04em',
          }}>
            {equationDisplay}
          </div>
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16, marginBottom: 16,
        }}>
          <Field label="a (x² coefficient)" value={aVal} onChange={setAVal} hint="Cannot be 0" />
          <Field label="b (x coefficient)"  value={bVal} onChange={setBVal} />
          <Field label="c (constant term)"  value={cVal} onChange={setCVal} />
        </div>
        <button
          onClick={() => setShowAdvanced(v => !v)}
          style={BTN_GHOST}
          aria-expanded={showAdvanced}
        >
          {showAdvanced ? '▾' : '▸'} Advanced Options
        </button>
      </div>

      {/* ── VALIDATION ── */}
      {a === 0 && (
        <div style={{ ...CARD, background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.25)', textAlign: 'center', padding: '18px 20px', color: '#fca5a5', fontSize: 14 }}>
          Coefficient <strong>a</strong> cannot be 0 — that would make it a linear equation, not quadratic.
        </div>
      )}

      {/* ── RESULTS ── */}
      {result && (
        <>
          {/* Discriminant badge + metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
            <MetricCard label="Discriminant Δ"    value={fmt4(result.discriminant)} color={discColor} sub={discLabel} />
            <MetricCard label="Vertex h"          value={fmt4(result.vertexH)}      color="#6366f1" />
            <MetricCard label="Vertex k"          value={fmt4(result.vertexK)}      color="#6366f1" sub="Min/max value" />
            <MetricCard label="Y-Intercept"       value={String(result.yIntercept)} color="#38bdf8" sub="f(0) = c" />
            <MetricCard label="Opens"             value={result.opensDirection === 'up' ? '∪ Upward' : '∩ Downward'}
              color={result.opensDirection === 'up' ? '#10b981' : '#f59e0b'} sub={`a ${a > 0 ? '> 0' : '< 0'}`} />
          </div>

          {/* Roots display */}
          <div style={CARD}>
            <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Roots / Solutions
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: 10, borderLeft: `3px solid ${discColor}` }}>
                <div style={{ fontSize: 11, color: 'var(--fg-3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>x₁</div>
                <div style={{ fontFamily: 'monospace', fontSize: 18, fontWeight: 700, color: discColor }}>
                  {result.discriminantType === 'complex'
                    ? fmtComplex(result.x1Real, result.x1Imag)
                    : fmt4(result.x1Real)}
                </div>
              </div>
              <div style={{ padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: 10, borderLeft: `3px solid ${discColor}` }}>
                <div style={{ fontSize: 11, color: 'var(--fg-3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>x₂</div>
                <div style={{ fontFamily: 'monospace', fontSize: 18, fontWeight: 700, color: discColor }}>
                  {result.discriminantType === 'complex'
                    ? fmtComplex(result.x2Real, result.x2Imag)
                    : result.discriminantType === 'one-real'
                    ? `${fmt4(result.x2Real)} (repeated)`
                    : fmt4(result.x2Real)}
                </div>
              </div>
            </div>

            {result.factored && (
              <div style={{ marginTop: 14, padding: '12px 16px', background: 'rgba(99,102,241,0.08)', borderRadius: 8, fontFamily: 'monospace', fontSize: 14, color: '#c4b5fd' }}>
                Factored: {result.factored}
              </div>
            )}
          </div>

          {/* Vieta's formulas + vertex */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div style={CARD}>
              <h3 style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Vieta's Formulas</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--fg-3)' }}>x₁ + x₂ = −b/a</span>
                  <span style={{ fontFamily: 'monospace', color: '#6366f1', fontWeight: 700 }}>{fmt4(result.sumOfRoots)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--fg-3)' }}>x₁ × x₂ = c/a</span>
                  <span style={{ fontFamily: 'monospace', color: '#10b981', fontWeight: 700 }}>{fmt4(result.productOfRoots)}</span>
                </div>
              </div>
            </div>
            <div style={CARD}>
              <h3 style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Parabola Properties</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--fg-3)' }}>Vertex</span>
                  <span style={{ fontFamily: 'monospace', color: '#f59e0b', fontWeight: 700 }}>({fmt4(result.vertexH)}, {fmt4(result.vertexK)})</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--fg-3)' }}>Axis of symmetry</span>
                  <span style={{ fontFamily: 'monospace', color: '#38bdf8', fontWeight: 700 }}>x = {fmt4(result.axisOfSymmetry)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step-by-step solution */}
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
              <div style={{ ...CARD, marginTop: 4 }}>
                <ol style={{ margin: 0, paddingLeft: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {result.steps.map((step, i) => (
                    <li key={i} style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7, fontFamily: 'monospace' }}>{step}</li>
                  ))}
                </ol>
                <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
                  <button
                    onClick={() => exportCalcPDF({
                      toolName: 'Quadratic Formula Calculator',
                      inputs: [
                        { label: 'a', value: String(a) },
                        { label: 'b', value: String(b) },
                        { label: 'c', value: String(c) },
                      ],
                      results: [
                        { label: 'Discriminant', value: fmt4(result.discriminant), highlight: true },
                        { label: 'Type', value: discLabel },
                        { label: 'x₁', value: result.discriminantType === 'complex' ? fmtComplex(result.x1Real, result.x1Imag) : fmt4(result.x1Real) },
                        { label: 'x₂', value: result.discriminantType === 'complex' ? fmtComplex(result.x2Real, result.x2Imag) : fmt4(result.x2Real) },
                        { label: 'Vertex', value: `(${fmt4(result.vertexH)}, ${fmt4(result.vertexK)})` },
                      ],
                      tableHeaders: ['Step', 'Calculation'],
                      tableRows: result.steps.map((s, i) => ({ 'Step': i + 1, 'Calculation': s })),
                    })}
                    style={BTN_GHOST}
                    aria-label="Export solution as PDF"
                  >
                    Export PDF
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Scenario: same a,c but varying b */}
          <div style={CARD}>
            <h3 style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Discriminant vs. b  <span style={{ fontWeight: 400, fontSize: 12, color: 'var(--fg-3)' }}>(a={a}, c={c}; b varies)</span>
            </h3>
            <p style={{ margin: '0 0 14px', fontSize: 12, color: 'var(--fg-3)' }}>Shows how changing b shifts the parabola and changes root type.</p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr>
                    {['b value', 'Δ = b²−4ac', 'Root Type', 'x₁', 'x₂', 'Vertex k'].map(h => (
                      <th key={h} style={TH}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bScenarios.map(({ b: bv, result: r }) => {
                    const isCurrent = bv === b
                    const typeColor = !r ? '#888'
                      : r.discriminantType === 'two-real' ? '#10b981'
                      : r.discriminantType === 'one-real' ? '#f59e0b'
                      : '#e879f9'
                    return (
                      <tr key={bv} style={{ background: isCurrent ? 'rgba(139,92,246,0.08)' : 'transparent' }}>
                        <td style={{ ...TD, color: isCurrent ? '#c4b5fd' : 'var(--fg-2)', fontWeight: isCurrent ? 700 : 400 }}>
                          {isCurrent ? '★ ' : ''}{bv}
                        </td>
                        <td style={{ ...TD, fontFamily: 'monospace', color: typeColor }}>{r ? fmt4(r.discriminant) : '—'}</td>
                        <td style={{ ...TD, color: typeColor }}>
                          {r ? (r.discriminantType === 'two-real' ? 'Two Real' : r.discriminantType === 'one-real' ? 'One Real' : 'Complex') : '—'}
                        </td>
                        <td style={{ ...TD, fontFamily: 'monospace' }}>{r && r.discriminantType !== 'complex' ? fmt4(r.x1Real) : r ? fmtComplex(r.x1Real, r.x1Imag) : '—'}</td>
                        <td style={{ ...TD, fontFamily: 'monospace' }}>{r && r.discriminantType !== 'complex' ? fmt4(r.x2Real) : r ? fmtComplex(r.x2Real, r.x2Imag) : '—'}</td>
                        <td style={{ ...TD, fontFamily: 'monospace' }}>{r ? fmt4(r.vertexK) : '—'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Advanced: X-intercepts and properties */}
          {showAdvanced && (
            <div style={{ ...CARD, background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.2)' }}>
              <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: '#c4b5fd', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Key Intercepts & Properties
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 13, color: 'var(--fg-2)' }}>
                  <span style={{ color: 'var(--fg-3)' }}>Y-intercept:</span>&nbsp; (0, {c})
                </div>
                {result.discriminantType !== 'complex' && (
                  <div style={{ fontSize: 13, color: 'var(--fg-2)' }}>
                    <span style={{ color: 'var(--fg-3)' }}>X-intercepts:</span>&nbsp;
                    ({fmt4(result.x1Real)}, 0){result.discriminantType === 'two-real' ? ` and (${fmt4(result.x2Real)}, 0)` : ' (touches, doesn\'t cross)'}
                  </div>
                )}
                {result.discriminantType === 'complex' && (
                  <div style={{ fontSize: 13, color: 'var(--fg-2)' }}>
                    <span style={{ color: 'var(--fg-3)' }}>X-intercepts:</span>&nbsp; None (parabola does not cross x-axis)
                  </div>
                )}
                <div style={{ fontSize: 13, color: 'var(--fg-2)' }}>
                  <span style={{ color: 'var(--fg-3)' }}>{result.opensDirection === 'up' ? 'Minimum' : 'Maximum'} value:</span>&nbsp; {fmt4(result.vertexK)} at x = {fmt4(result.vertexH)}
                </div>
                <div style={{ fontSize: 13, color: 'var(--fg-2)' }}>
                  <span style={{ color: 'var(--fg-3)' }}>Range:</span>&nbsp;
                  {result.opensDirection === 'up' ? `[${fmt4(result.vertexK)}, +∞)` : `(−∞, ${fmt4(result.vertexK)}]`}
                </div>
                <div style={{ fontSize: 13, color: 'var(--fg-2)' }}>
                  <span style={{ color: 'var(--fg-3)' }}>Domain:</span>&nbsp; (−∞, +∞)
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {a !== 0 && !result && (
        <div style={{ ...CARD, textAlign: 'center', padding: '40px 20px', color: 'var(--fg-3)', fontSize: 14 }}>
          Enter values for a, b, and c above — results update instantly.
        </div>
      )}
    </div>
  )
}
