'use client'
import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'

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
const TD: CSSProperties = { padding: '6px 12px', fontSize: 12, textAlign: 'right', color: 'var(--fg-2)', whiteSpace: 'nowrap' }

type Mode = 'arithmetic' | 'geometric' | 'fibonacci' | 'custom'

// ─── MetricCard ───────────────────────────────────────────────────────────────

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  if (!isFinite(n)) return '∞'
  if (Math.abs(n) >= 1e9) return n.toExponential(3)
  return parseFloat(n.toPrecision(8)).toLocaleString('en-US')
}

function generateArithmetic(a1: number, d: number, n: number): number[] {
  const terms: number[] = []
  for (let i = 0; i < n; i++) terms.push(a1 + i * d)
  return terms
}

function arithmeticSum(a1: number, d: number, n: number): number {
  return (n / 2) * (2 * a1 + (n - 1) * d)
}

function generateGeometric(a1: number, r: number, n: number): number[] {
  const terms: number[] = []
  for (let i = 0; i < n; i++) terms.push(a1 * Math.pow(r, i))
  return terms
}

function geometricSum(a1: number, r: number, n: number): number {
  if (r === 1) return a1 * n
  return a1 * (Math.pow(r, n) - 1) / (r - 1)
}

function generateFibonacci(f1: number, f2: number, n: number): number[] {
  const terms = [f1, f2]
  for (let i = 2; i < n; i++) terms.push(terms[i - 1] + terms[i - 2])
  return terms.slice(0, n)
}

function detectPattern(nums: number[]): { type: string; params: string; next5: number[] } {
  if (nums.length < 3) return { type: 'Unknown', params: '', next5: [] }

  // Check arithmetic
  const diffs = nums.slice(1).map((v, i) => v - nums[i])
  if (diffs.every(d => Math.abs(d - diffs[0]) < 1e-9)) {
    const d = diffs[0]
    const last = nums[nums.length - 1]
    const next5 = [1, 2, 3, 4, 5].map(i => last + d * i)
    return { type: 'Arithmetic', params: `a₁=${fmt(nums[0])}, d=${fmt(d)}`, next5 }
  }

  // Check geometric
  const ratios = nums.slice(1).map((v, i) => (nums[i] !== 0 ? v / nums[i] : NaN))
  if (ratios.every(r => isFinite(r) && Math.abs(r - ratios[0]) < 1e-6)) {
    const r = ratios[0]
    const last = nums[nums.length - 1]
    const next5 = [1, 2, 3, 4, 5].map(i => last * Math.pow(r, i))
    return { type: 'Geometric', params: `a₁=${fmt(nums[0])}, r=${fmt(r)}`, next5 }
  }

  // Check fibonacci-like
  const fibCheck = nums.slice(2).every((v, i) => Math.abs(v - (nums[i] + nums[i + 1])) < 1e-6)
  if (fibCheck) {
    const a = nums[nums.length - 2], b = nums[nums.length - 1]
    const next5: number[] = []
    let p = a, q = b
    for (let i = 0; i < 5; i++) { const nxt = p + q; next5.push(nxt); p = q; q = nxt }
    return { type: 'Fibonacci-like', params: `f₁=${fmt(nums[0])}, f₂=${fmt(nums[1])}`, next5 }
  }

  // Check quadratic (second differences constant)
  const secondDiffs = diffs.slice(1).map((v, i) => v - diffs[i])
  if (secondDiffs.every(d => Math.abs(d - secondDiffs[0]) < 1e-6)) {
    const last = nums[nums.length - 1]
    const lastDiff = diffs[diffs.length - 1]
    const sd = secondDiffs[0]
    const next5: number[] = []
    let cur = last, curDiff = lastDiff
    for (let i = 0; i < 5; i++) {
      curDiff += sd
      cur += curDiff
      next5.push(cur)
    }
    return { type: 'Quadratic', params: `2nd diff=${fmt(sd)}`, next5 }
  }

  return { type: 'Unknown / Custom', params: 'No standard pattern detected', next5: [] }
}

function exportCSV(terms: number[], filename: string) {
  const rows = terms.map((v, i) => `${i + 1},${v}`)
  const csv = ['Index,Value', ...rows].join('\n')
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })),
    download: filename,
  })
  a.click()
}

// ─── Field component ──────────────────────────────────────────────────────────

function Field({ label, value, onChange, placeholder, min, max, step, hint }: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; min?: number; max?: number; step?: number; hint?: string
}) {
  return (
    <div>
      <label style={LABEL}>{label}</label>
      <input
        type="number" value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} min={min} max={max} step={step}
        style={INPUT_BOX} aria-label={label}
      />
      {hint && <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 3 }}>{hint}</div>}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function NumberSequenceCalculatorClient() {
  const [mode, setMode] = useState<Mode>('arithmetic')

  // Arithmetic
  const [arA1, setArA1] = useState('1')
  const [arD,  setArD]  = useState('3')
  const [arN,  setArN]  = useState('10')

  // Geometric
  const [geA1, setGeA1] = useState('2')
  const [geR,  setGeR]  = useState('2')
  const [geN,  setGeN]  = useState('10')

  // Fibonacci
  const [fibF1, setFibF1] = useState('1')
  const [fibF2, setFibF2] = useState('1')
  const [fibN,  setFibN]  = useState('15')

  // Custom Detect
  const [customInput, setCustomInput] = useState('1, 4, 9, 16, 25, 36')

  // UI
  const [showCompare, setShowCompare] = useState(false)

  // ─── Arithmetic results ──────────────────────────────────────────────────────
  const arResult = useMemo(() => {
    const a1 = parseFloat(arA1) || 0
    const d  = parseFloat(arD)  || 0
    const n  = Math.min(Math.max(parseInt(arN) || 0, 1), 100)
    const terms = generateArithmetic(a1, d, n)
    const sum = arithmeticSum(a1, d, n)
    const nth = a1 + (n - 1) * d
    return { a1, d, n, terms, sum, nth }
  }, [arA1, arD, arN])

  // ─── Geometric results ───────────────────────────────────────────────────────
  const geResult = useMemo(() => {
    const a1 = parseFloat(geA1) || 1
    const r  = parseFloat(geR)  || 1
    const n  = Math.min(Math.max(parseInt(geN) || 0, 1), 50)
    const terms = generateGeometric(a1, r, n)
    const sum = geometricSum(a1, r, n)
    const nth = a1 * Math.pow(r, n - 1)
    const converges = Math.abs(r) < 1
    const infSum = converges ? a1 / (1 - r) : null
    return { a1, r, n, terms, sum, nth, converges, infSum }
  }, [geA1, geR, geN])

  // ─── Fibonacci results ───────────────────────────────────────────────────────
  const fibResult = useMemo(() => {
    const f1 = parseFloat(fibF1) || 1
    const f2 = parseFloat(fibF2) || 1
    const n  = Math.min(Math.max(parseInt(fibN) || 0, 2), 50)
    const terms = generateFibonacci(f1, f2, n)
    const phi = 1.6180339887
    const lastRatio = terms.length >= 2 ? terms[terms.length - 1] / terms[terms.length - 2] : NaN
    return { f1, f2, n, terms, phi, lastRatio }
  }, [fibF1, fibF2, fibN])

  // ─── Custom detect results ────────────────────────────────────────────────────
  const customResult = useMemo(() => {
    const nums = customInput.split(/[\s,]+/).map(Number).filter(n => !isNaN(n) && isFinite(n))
    if (nums.length < 3) return null
    const detected = detectPattern(nums)
    return { nums, detected }
  }, [customInput])

  // ─── Comparison table ─────────────────────────────────────────────────────────
  const compareRows = useMemo(() => {
    const a1 = parseFloat(arA1) || 1
    const d  = parseFloat(arD)  || 3
    const r  = parseFloat(geR)  || 2
    const rows = []
    let arVal = a1
    let geVal = a1
    for (let i = 1; i <= 20; i++) {
      arVal = a1 + (i - 1) * d
      geVal = a1 * Math.pow(r, i - 1)
      rows.push({ n: i, arVal, geVal })
    }
    return rows
  }, [arA1, arD, geR])

  // ─── Active terms for display ─────────────────────────────────────────────────
  const activeTerms: number[] = mode === 'arithmetic' ? arResult.terms
    : mode === 'geometric' ? geResult.terms
    : mode === 'fibonacci' ? fibResult.terms
    : (customResult?.nums ?? [])

  const displayTerms = activeTerms.slice(0, 20)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── MODE TABS ── */}
      <div style={CARD}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {(['arithmetic', 'geometric', 'fibonacci', 'custom'] as Mode[]).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                border: mode === m ? '1px solid #6366f1' : '1px solid var(--line-strong)',
                background: mode === m ? 'rgba(99,102,241,0.2)' : 'rgba(0,0,0,0.2)',
                color: mode === m ? '#c4b5fd' : 'var(--fg-3)',
              }}
            >
              {m === 'arithmetic' ? 'Arithmetic' : m === 'geometric' ? 'Geometric' : m === 'fibonacci' ? 'Fibonacci' : 'Custom Detect'}
            </button>
          ))}
        </div>

        {/* Arithmetic inputs */}
        {mode === 'arithmetic' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
            <Field label="First Term (a₁)" value={arA1} onChange={setArA1} placeholder="1" hint="Starting value" />
            <Field label="Common Difference (d)" value={arD} onChange={setArD} placeholder="3" hint="Added each step" />
            <Field label="Number of Terms (n)" value={arN} onChange={setArN} placeholder="10" min={1} max={100} />
          </div>
        )}

        {/* Geometric inputs */}
        {mode === 'geometric' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
            <Field label="First Term (a₁)" value={geA1} onChange={setGeA1} placeholder="2" hint="Starting value" />
            <Field label="Common Ratio (r)" value={geR} onChange={setGeR} step={0.1} hint="Multiplied each step" />
            <Field label="Number of Terms (n)" value={geN} onChange={setGeN} placeholder="10" min={1} max={50} />
          </div>
        )}

        {/* Fibonacci inputs */}
        {mode === 'fibonacci' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
            <Field label="First Term (f₁)" value={fibF1} onChange={setFibF1} placeholder="1" />
            <Field label="Second Term (f₂)" value={fibF2} onChange={setFibF2} placeholder="1" />
            <Field label="Number of Terms (n)" value={fibN} onChange={setFibN} placeholder="15" min={2} max={50} />
          </div>
        )}

        {/* Custom detect input */}
        {mode === 'custom' && (
          <div>
            <label style={LABEL}>Enter 5–8 Numbers (comma or space separated)</label>
            <input
              type="text"
              value={customInput}
              onChange={e => setCustomInput(e.target.value)}
              placeholder="e.g. 2, 4, 8, 16, 32"
              style={INPUT_BOX}
            />
            <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4 }}>
              Detects: Arithmetic, Geometric, Fibonacci-like, or Quadratic patterns
            </div>
          </div>
        )}
      </div>

      {/* ── RESULTS ── */}
      {mode === 'arithmetic' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
          <MetricCard label="nth Term" value={fmt(arResult.nth)} color="#6366f1" sub={`Term ${arResult.n}`} />
          <MetricCard label="Series Sum" value={fmt(arResult.sum)} color="#10b981" sub={`Sₙ = n/2·(2a₁+(n−1)d)`} />
          <MetricCard label="Common Difference" value={fmt(arResult.d)} color="#f59e0b" />
          <MetricCard label="Total Terms" value={String(arResult.n)} color="#38bdf8" />
        </div>
      )}

      {mode === 'geometric' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
            <MetricCard label="nth Term" value={fmt(geResult.nth)} color="#6366f1" sub={`a₁·rⁿ⁻¹`} />
            <MetricCard label="Series Sum" value={fmt(geResult.sum)} color="#10b981" />
            <MetricCard label="Common Ratio" value={fmt(geResult.r)} color="#f59e0b" />
            <MetricCard
              label={geResult.converges ? 'Convergent' : 'Divergent'}
              value={geResult.converges ? '↘ Converges' : '↗ Diverges'}
              color={geResult.converges ? '#10b981' : '#ef4444'}
              sub={geResult.converges && geResult.infSum !== null ? `Inf. Sum = ${fmt(geResult.infSum)}` : '|r| ≥ 1'}
            />
          </div>
          {!geResult.converges && (
            <div style={{ ...CARD, background: 'rgba(239,68,68,0.06)', borderColor: 'rgba(239,68,68,0.2)', padding: '12px 16px', fontSize: 13, color: '#fca5a5' }}>
              |r| = {Math.abs(geResult.r).toFixed(3)} ≥ 1 — this series diverges (terms grow without bound).
            </div>
          )}
        </div>
      )}

      {mode === 'fibonacci' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
          <MetricCard label={`Term ${fibResult.n}`} value={fmt(fibResult.terms[fibResult.n - 1] ?? 0)} color="#6366f1" />
          <MetricCard label="Golden Ratio (φ)" value="1.61803…" color="#f59e0b" sub="aₙ/aₙ₋₁ → φ" />
          <MetricCard label="Current Ratio" value={isFinite(fibResult.lastRatio) ? fibResult.lastRatio.toFixed(6) : '—'} color="#10b981"
            sub={`Error: ${isFinite(fibResult.lastRatio) ? Math.abs(fibResult.lastRatio - fibResult.phi).toExponential(2) : '—'}`} />
          <MetricCard label="Total Terms" value={String(fibResult.n)} color="#38bdf8" />
        </div>
      )}

      {mode === 'custom' && customResult && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
          <MetricCard label="Pattern Type" value={customResult.detected.type} color="#6366f1" />
          <MetricCard label="Terms Given" value={String(customResult.nums.length)} color="#10b981" />
          <MetricCard label="Next Term" value={customResult.detected.next5[0] !== undefined ? fmt(customResult.detected.next5[0]) : '?'} color="#f59e0b" />
          <MetricCard label="Parameters" value="" sub={customResult.detected.params} color="#38bdf8" />
        </div>
      )}

      {/* ── SEQUENCE TABLE ── */}
      {displayTerms.length > 0 && (
        <div style={CARD}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Sequence Terms (first {displayTerms.length})
            </h3>
            <button onClick={() => exportCSV(activeTerms, 'sequence.csv')} style={BTN_GHOST}>
              ⬇ Export CSV
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {displayTerms.map((v, i) => (
              <div key={i} style={{
                padding: '6px 14px', borderRadius: 8, fontSize: 13,
                background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
                color: '#c4b5fd', fontWeight: 600,
              }}>
                <span style={{ color: 'var(--fg-3)', fontSize: 10, marginRight: 4 }}>a{i + 1}</span>
                {fmt(v)}
              </div>
            ))}
            {activeTerms.length > 20 && (
              <div style={{ padding: '6px 14px', fontSize: 13, color: 'var(--fg-3)', fontStyle: 'italic' }}>
                +{activeTerms.length - 20} more…
              </div>
            )}
          </div>

          {/* Predicted next 5 for custom mode */}
          {mode === 'custom' && customResult && customResult.detected.next5.length > 0 && (
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--line-strong)' }}>
              <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase' }}>Predicted Next 5</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {customResult.detected.next5.map((v, i) => (
                  <div key={i} style={{
                    padding: '6px 14px', borderRadius: 8, fontSize: 13,
                    background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
                    color: '#6ee7b7', fontWeight: 600,
                  }}>
                    <span style={{ color: 'var(--fg-3)', fontSize: 10, marginRight: 4 }}>n+{i + 1}</span>
                    {fmt(v)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── STEP-BY-STEP FORMULA ── */}
      {mode !== 'custom' && (
        <div style={{ ...CARD, background: 'rgba(99,102,241,0.04)' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Formula Breakdown
          </h3>
          {mode === 'arithmetic' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.8 }}>
              <div><span style={{ color: '#c4b5fd' }}>aₙ</span> = a₁ + (n−1)d = {fmt(arResult.a1)} + ({arResult.n}−1)×{fmt(arResult.d)} = <strong style={{ color: '#6366f1' }}>{fmt(arResult.nth)}</strong></div>
              <div><span style={{ color: '#c4b5fd' }}>Sₙ</span> = n/2 × (2a₁+(n−1)d) = {arResult.n}/2 × (2×{fmt(arResult.a1)}+({arResult.n}−1)×{fmt(arResult.d)}) = <strong style={{ color: '#10b981' }}>{fmt(arResult.sum)}</strong></div>
            </div>
          )}
          {mode === 'geometric' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.8 }}>
              <div><span style={{ color: '#c4b5fd' }}>aₙ</span> = a₁ × rⁿ⁻¹ = {fmt(geResult.a1)} × {fmt(geResult.r)}^{geResult.n - 1} = <strong style={{ color: '#6366f1' }}>{fmt(geResult.nth)}</strong></div>
              <div><span style={{ color: '#c4b5fd' }}>Sₙ</span> = a₁(rⁿ−1)/(r−1) = {fmt(geResult.a1)}×({fmt(geResult.r)}^{geResult.n}−1)/({fmt(geResult.r)}−1) = <strong style={{ color: '#10b981' }}>{fmt(geResult.sum)}</strong></div>
              {geResult.converges && geResult.infSum !== null && (
                <div><span style={{ color: '#c4b5fd' }}>S∞</span> = a₁/(1−r) = {fmt(geResult.a1)}/(1−{fmt(geResult.r)}) = <strong style={{ color: '#f59e0b' }}>{fmt(geResult.infSum)}</strong></div>
              )}
            </div>
          )}
          {mode === 'fibonacci' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.8 }}>
              <div><span style={{ color: '#c4b5fd' }}>Rule:</span> fₙ = fₙ₋₁ + fₙ₋₂, with f₁={fmt(fibResult.f1)}, f₂={fmt(fibResult.f2)}</div>
              <div><span style={{ color: '#c4b5fd' }}>φ</span> = (1+√5)/2 ≈ 1.6180339887… The golden ratio</div>
              <div><span style={{ color: '#c4b5fd' }}>Ratio convergence:</span> aₙ/aₙ₋₁ → {isFinite(fibResult.lastRatio) ? fibResult.lastRatio.toFixed(8) : '—'} (error: {isFinite(fibResult.lastRatio) ? Math.abs(fibResult.lastRatio - fibResult.phi).toExponential(3) : '—'})</div>
            </div>
          )}
        </div>
      )}

      {/* ── ARITHMETIC VS GEOMETRIC COMPARE ── */}
      <div>
        <button
          onClick={() => setShowCompare(v => !v)}
          style={{ ...BTN_GHOST, marginBottom: showCompare ? 8 : 0 }}
          aria-expanded={showCompare}
        >
          {showCompare ? '▾' : '▸'} Compare Arithmetic vs Geometric (20 terms)
        </button>

        {showCompare && (
          <div style={{ ...CARD, padding: 0, overflow: 'hidden', marginTop: 4 }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr>
                    <th style={{ ...TH, textAlign: 'left' }}>n</th>
                    <th style={TH}>Arithmetic (a₁={arA1}, d={arD})</th>
                    <th style={TH}>Geometric (a₁={arA1}, r={geR})</th>
                    <th style={TH}>Geo / Arith Ratio</th>
                  </tr>
                </thead>
                <tbody>
                  {compareRows.map(({ n, arVal, geVal }) => (
                    <tr key={n} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ ...TD, textAlign: 'left', color: 'var(--fg-3)' }}>{n}</td>
                      <td style={{ ...TD, color: '#6366f1' }}>{fmt(arVal)}</td>
                      <td style={{ ...TD, color: '#10b981' }}>{fmt(geVal)}</td>
                      <td style={{ ...TD, color: '#f59e0b' }}>{arVal !== 0 ? (geVal / arVal).toFixed(2) : '—'}</td>
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
