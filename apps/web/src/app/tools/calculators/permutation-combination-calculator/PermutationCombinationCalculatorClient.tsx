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

// ─── Math helpers ─────────────────────────────────────────────────────────────

function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n) || n > 170) return NaN
  if (n <= 1) return 1
  let r = 1
  for (let i = 2; i <= n; i++) r *= i
  return r
}

function permNoRep(n: number, r: number): number {
  if (n < r || n < 0 || r < 0) return 0
  return factorial(n) / factorial(n - r)
}

function permWithRep(n: number, r: number): number {
  return Math.pow(n, r)
}

function combNoRep(n: number, r: number): number {
  if (n < r || n < 0 || r < 0) return 0
  return factorial(n) / (factorial(r) * factorial(n - r))
}

function combWithRep(n: number, r: number): number {
  // C(n+r-1, r)
  return combNoRep(n + r - 1, r)
}

function fmtBig(n: number): string {
  if (isNaN(n)) return 'N/A'
  if (!isFinite(n)) return '∞'
  if (n >= 1e15) return n.toExponential(4)
  return n.toLocaleString('en-US')
}

// ─── MetricCard ───────────────────────────────────────────────────────────────

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

// ─── Field component ──────────────────────────────────────────────────────────

function Field({ label, value, onChange, min, max, hint }: {
  label: string; value: string; onChange: (v: string) => void
  min?: number; max?: number; hint?: string
}) {
  return (
    <div>
      <label style={LABEL}>{label}</label>
      <input type="number" value={value} onChange={e => onChange(e.target.value)}
        min={min} max={max} step={1} style={INPUT_BOX} aria-label={label} />
      {hint && <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 3 }}>{hint}</div>}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PermutationCombinationCalculatorClient() {
  const [nStr, setNStr] = useState('10')
  const [rStr, setRStr] = useState('3')
  const [showPascal,   setShowPascal]   = useState(false)
  const [showScenario, setShowScenario] = useState(false)

  const n = Math.min(Math.max(parseInt(nStr) || 0, 0), 20)
  const r = Math.min(Math.max(parseInt(rStr) || 0, 0), n)
  const valid = !isNaN(n) && !isNaN(r) && n >= 0 && r >= 0 && n <= 20

  // ─── Core results ─────────────────────────────────────────────────────────────
  const results = useMemo(() => {
    if (!valid) return null
    return {
      pNoRep:   permNoRep(n, r),
      pWithRep: permWithRep(n, r),
      cNoRep:   combNoRep(n, r),
      cWithRep: combWithRep(n, r),
      nFact:    factorial(n),
      rFact:    factorial(r),
      nrFact:   factorial(n - r),
    }
  }, [n, r, valid])

  // ─── Scenario table: r = 0 to min(n,10) ─────────────────────────────────────
  const scenarioRows = useMemo(() => {
    if (!valid) return []
    const maxR = Math.min(n, 10)
    return Array.from({ length: maxR + 1 }, (_, i) => ({
      ri: i,
      pn: permNoRep(n, i),
      cn: combNoRep(n, i),
      isActive: i === r,
    }))
  }, [n, r, valid])

  // ─── Pascal's triangle rows 0..10 ────────────────────────────────────────────
  const pascalRows = useMemo(() => {
    return Array.from({ length: 11 }, (_, row) =>
      Array.from({ length: row + 1 }, (_, col) => combNoRep(row, col))
    )
  }, [])

  function handleExport() {
    if (!results) return
    exportCalcPDF({
      toolName: 'Permutation & Combination Calculator',
      inputs: [
        { label: 'n (total items)',  value: String(n) },
        { label: 'r (items chosen)', value: String(r) },
      ],
      results: [
        { label: `P(${n},${r}) without repetition`, value: fmtBig(results.pNoRep),   highlight: true },
        { label: `nʳ with repetition`,              value: fmtBig(results.pWithRep), highlight: true },
        { label: `C(${n},${r}) without repetition`, value: fmtBig(results.cNoRep),   highlight: true },
        { label: `C(n+r-1,r) with repetition`,      value: fmtBig(results.cWithRep), highlight: true },
        { label: 'n!',                               value: fmtBig(results.nFact) },
        { label: 'r!',                               value: fmtBig(results.rFact) },
        { label: '(n−r)!',                           value: fmtBig(results.nrFact) },
      ],
      formula: 'P(n,r) = n!/(n−r)!  |  C(n,r) = n!/[r!(n−r)!]  |  nʳ  |  C(n+r−1,r)',
    })
  }

  const inputError = parseInt(rStr) > n
    ? `r cannot exceed n (${n})`
    : parseInt(nStr) > 20
    ? 'Maximum n is 20 (factorial precision limit)'
    : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── INPUTS ── */}
      <div style={CARD}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
          <Field label="n — Total Items" value={nStr} onChange={setNStr} min={0} max={20}
            hint="Max 20 (factorial precision)" />
          <Field label="r — Items Chosen" value={rStr} onChange={setRStr} min={0} max={n}
            hint="Must be ≤ n" />
        </div>
        {inputError && (
          <div style={{ marginTop: 10, fontSize: 12, color: '#f87171', fontWeight: 600 }}>
            {inputError}
          </div>
        )}
      </div>

      {/* ── RESULTS ── */}
      {results && (
        <>
          {/* Primary results */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
            <MetricCard label={`P(${n},${r}) No Repeat`}   value={fmtBig(results.pNoRep)}   color="#6366f1"
              sub="Order matters" />
            <MetricCard label={`${n}ʳ With Repeat`}        value={fmtBig(results.pWithRep)} color="#8b5cf6"
              sub="Order matters, reuse allowed" />
            <MetricCard label={`C(${n},${r}) No Repeat`}   value={fmtBig(results.cNoRep)}   color="#10b981"
              sub="Order doesn't matter" />
            <MetricCard label="C(n+r−1,r) With Repeat"     value={fmtBig(results.cWithRep)} color="#6ee7b7"
              sub="Order doesn't matter, reuse" />
          </div>

          {/* Factorial breakdown */}
          <div style={{ ...CARD, padding: '16px 20px' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Factorial Breakdown
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.9 }}>
              <div>
                <span style={{ color: '#c4b5fd' }}>n!</span> = {n}! = <strong style={{ color: '#6366f1' }}>{fmtBig(results.nFact)}</strong>
              </div>
              <div>
                <span style={{ color: '#c4b5fd' }}>r!</span> = {r}! = <strong style={{ color: '#8b5cf6' }}>{fmtBig(results.rFact)}</strong>
              </div>
              <div>
                <span style={{ color: '#c4b5fd' }}>(n−r)!</span> = {n - r}! = <strong style={{ color: '#38bdf8' }}>{fmtBig(results.nrFact)}</strong>
              </div>
              <div style={{ paddingTop: 8, borderTop: '1px solid var(--line-strong)' }}>
                <span style={{ color: '#c4b5fd' }}>P({n},{r})</span> = {n}! / {n - r}! = {fmtBig(results.nFact)} / {fmtBig(results.nrFact)} = <strong style={{ color: '#6366f1' }}>{fmtBig(results.pNoRep)}</strong>
              </div>
              <div>
                <span style={{ color: '#c4b5fd' }}>C({n},{r})</span> = {n}! / ({r}! × {n - r}!) = {fmtBig(results.nFact)} / ({fmtBig(results.rFact)} × {fmtBig(results.nrFact)}) = <strong style={{ color: '#10b981' }}>{fmtBig(results.cNoRep)}</strong>
              </div>
            </div>
            <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
              <button onClick={handleExport} style={BTN_GHOST}>Export PDF</button>
            </div>
          </div>

          {/* Real-world examples */}
          <div style={CARD}>
            <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Real-World Examples for n={n}, r={r}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
              <div style={{ padding: '10px 14px', background: 'rgba(99,102,241,0.08)', borderRadius: 8, borderLeft: '3px solid #6366f1' }}>
                <strong style={{ color: '#c4b5fd' }}>P({n},{r}) = {fmtBig(results.pNoRep)}</strong> — Choosing {r} medal positions (Gold/Silver/Bronze…) from {n} athletes. Order matters — different arrangement is a different outcome.
              </div>
              <div style={{ padding: '10px 14px', background: 'rgba(16,185,129,0.08)', borderRadius: 8, borderLeft: '3px solid #10b981' }}>
                <strong style={{ color: '#6ee7b7' }}>C({n},{r}) = {fmtBig(results.cNoRep)}</strong> — Choosing {r} flavors from {n} options at an ice cream shop. Order doesn't matter — same flavors = same outcome.
              </div>
              <div style={{ padding: '10px 14px', background: 'rgba(139,92,246,0.08)', borderRadius: 8, borderLeft: '3px solid #8b5cf6' }}>
                <strong style={{ color: '#a78bfa' }}>{n}^{r} = {fmtBig(results.pWithRep)}</strong> — Number of {r}-digit PIN codes using digits 0–{n - 1}. Repetition allowed, order matters.
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── SCENARIO TABLE ── */}
      {valid && (
        <div>
          <button onClick={() => setShowScenario(v => !v)} style={BTN_GHOST} aria-expanded={showScenario}>
            {showScenario ? '▾' : '▸'} P(n,r) and C(n,r) for r = 0 to {Math.min(n, 10)}
          </button>

          {showScenario && (
            <div style={{ ...CARD, padding: 0, overflow: 'hidden', marginTop: 8 }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr>
                      <th style={{ ...TH, textAlign: 'left' }}>r</th>
                      <th style={TH}>P({n}, r)</th>
                      <th style={TH}>C({n}, r)</th>
                      <th style={TH}>P / C = r!</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scenarioRows.map(({ ri, pn, cn, isActive }) => (
                      <tr key={ri} style={{
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        background: isActive ? 'rgba(99,102,241,0.1)' : 'transparent',
                      }}>
                        <td style={{ ...TD, textAlign: 'left', color: isActive ? '#c4b5fd' : 'var(--fg-3)', fontWeight: isActive ? 700 : 400 }}>
                          {isActive ? '► ' : ''}{ri}
                        </td>
                        <td style={{ ...TD, color: isActive ? '#6366f1' : 'var(--fg-2)', fontWeight: isActive ? 700 : 400 }}>{fmtBig(pn)}</td>
                        <td style={{ ...TD, color: isActive ? '#10b981' : 'var(--fg-2)', fontWeight: isActive ? 700 : 400 }}>{fmtBig(cn)}</td>
                        <td style={TD}>{cn > 0 ? fmtBig(pn / cn) : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── PASCAL'S TRIANGLE ── */}
      <div>
        <button onClick={() => setShowPascal(v => !v)} style={BTN_GHOST} aria-expanded={showPascal}>
          {showPascal ? '▾' : '▸'} Pascal's Triangle (rows 0–10, C values)
        </button>

        {showPascal && (
          <div style={{ ...CARD, marginTop: 8, overflowX: 'auto' }}>
            <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 14, lineHeight: 1.6 }}>
              Each entry is C(row, col). The highlighted cell shows C({n},{r}) = {results ? fmtBig(results.cNoRep) : '—'}.
              Each value equals the sum of the two values directly above it.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center', minWidth: 'max-content' }}>
              {pascalRows.map((row, ri) => (
                <div key={ri} style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                  {row.map((val, ci) => {
                    const isHighlight = ri === n && ci === r
                    return (
                      <div key={ci} style={{
                        width: 44, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: 6, fontSize: 11, fontWeight: isHighlight ? 900 : 500,
                        background: isHighlight ? 'rgba(99,102,241,0.35)' : 'rgba(255,255,255,0.04)',
                        border: isHighlight ? '1px solid #6366f1' : '1px solid transparent',
                        color: isHighlight ? '#c4b5fd' : 'var(--fg-2)',
                      }}>
                        {fmtBig(val)}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
            {n <= 10 && results && (
              <div style={{ marginTop: 12, fontSize: 12, color: '#c4b5fd', textAlign: 'center' }}>
                C({n},{r}) = {fmtBig(results.cNoRep)} highlighted in row {n}, position {r}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── INTERPRETATION ── */}
      {results && (
        <div style={{ ...CARD, background: 'rgba(99,102,241,0.05)', borderColor: 'rgba(99,102,241,0.2)' }}>
          <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: '#c4b5fd', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            What Your Numbers Mean
          </h3>
          <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
              <strong style={{ color: '#6366f1' }}>P({n},{r}) = {fmtBig(results.pNoRep)}</strong> — There are {fmtBig(results.pNoRep)} ordered ways to arrange {r} items from {n}. P(n,r) = n!/(n−r)!
            </li>
            <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
              <strong style={{ color: '#10b981' }}>C({n},{r}) = {fmtBig(results.cNoRep)}</strong> — There are {fmtBig(results.cNoRep)} unordered ways to choose {r} items from {n}. C = P / r! = P / {fmtBig(results.rFact)}
            </li>
            <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
              The ratio P/C = r! = {r}! = {fmtBig(results.rFact)} — each unique combination corresponds to {fmtBig(results.rFact)} permutation{results.rFact !== 1 ? 's' : ''} (all orderings of the same set).
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}
