'use client'
import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { exportCalcPDF } from '@/lib/calcPdf'

// ─── Types ────────────────────────────────────────────────────────────────────

type Mode = 'simplify' | 'equivalent' | 'proportion' | 'divide' | 'convert'

// ─── Math helpers ─────────────────────────────────────────────────────────────

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a)); b = Math.abs(Math.round(b))
  return b === 0 ? a : gcd(b, a % b)
}
function simplifyRatio(a: number, b: number): [number, number] {
  const g = gcd(Math.abs(a), Math.abs(b))
  return g > 0 ? [a / g, b / g] : [a, b]
}
function parseMultiRatio(s: string): number[] {
  return s.split(':').map(x => parseFloat(x.trim())).filter(n => !isNaN(n) && n > 0)
}

// ─── Style tokens ─────────────────────────────────────────────────────────────

const CARD: CSSProperties = {
  background: 'var(--bg-1)', border: '1px solid var(--line-strong)',
  borderRadius: 16, padding: '24px 28px',
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
const TD: CSSProperties = {
  padding: '7px 12px', fontSize: 13, textAlign: 'right',
  color: 'var(--fg-2)', whiteSpace: 'nowrap',
  borderBottom: '1px solid rgba(255,255,255,0.04)',
}

function MetricCard({ label, value, sub, color = '#6366f1' }: {
  label: string; value: string; sub?: string; color?: string
}) {
  return (
    <div style={{ padding: '18px 14px', background: 'var(--bg-2)', borderRadius: 12, textAlign: 'center' }}>
      <div style={{ fontSize: 20, fontWeight: 900, color, fontFamily: 'monospace' }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

function ModeTabs({ mode, setMode }: { mode: Mode; setMode: (m: Mode) => void }) {
  const tabs: { id: Mode; label: string }[] = [
    { id: 'simplify', label: 'Simplify' }, { id: 'equivalent', label: 'Equivalent' },
    { id: 'proportion', label: 'Proportion' }, { id: 'divide', label: 'Divide' },
    { id: 'convert', label: 'Convert' },
  ]
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => setMode(t.id)} style={{
          padding: '7px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: 'pointer',
          background: mode === t.id ? 'rgba(99,102,241,0.85)' : 'rgba(0,0,0,0.25)',
          border: mode === t.id ? '1px solid rgba(99,102,241,0.6)' : '1px solid var(--line-strong)',
          color: mode === t.id ? '#fff' : 'var(--fg-3)',
        }}>{t.label}</button>
      ))}
    </div>
  )
}

const fmt6 = (n: number) => parseFloat(n.toFixed(6)).toString()
const fmtPct = (n: number) => n.toFixed(4) + '%'

// ─── Main Component ───────────────────────────────────────────────────────────

export default function RatioCalculatorClient() {
  const [mode, setMode] = useState<Mode>('simplify')

  // Shared A : B
  const [aVal, setAVal] = useState('12')
  const [bVal, setBVal] = useState('16')

  // Equivalent / Proportion
  const [cVal, setCVal] = useState('3')
  const [dVal, setDVal] = useState('') // solve for this

  // Divide
  const [totalVal, setTotalVal]     = useState('100')
  const [ratioStr, setRatioStr]     = useState('3:2:1')

  // Proportion solve for X
  const [propSolve, setPropSolve] = useState<'d' | 'c' | 'b' | 'a'>('d')
  const [propA, setPropA] = useState('3')
  const [propB, setPropB] = useState('4')
  const [propC, setPropC] = useState('6')

  const [showAdv, setShowAdv] = useState(false)
  const [copied, setCopied] = useState(false)

  // ── Simplify ──────────────────────────────────────────────────────────────

  const a = parseFloat(aVal) || 0
  const b = parseFloat(bVal) || 0
  const g = gcd(Math.abs(Math.round(a)), Math.abs(Math.round(b)))
  const [simpA, simpB] = simplifyRatio(a, b)
  const decimal   = b !== 0 ? a / b : null
  const pctA      = a + b !== 0 ? (a / (a + b)) * 100 : null
  const pctB      = a + b !== 0 ? (b / (a + b)) * 100 : null

  // ── Equivalent: given A:B, find X when A:B = X:Y or A:B = Y:X ────────────

  const cN = parseFloat(cVal) || 0
  const equivD = a !== 0 ? (b * cN) / a : null // a:b = c:equivD  → equivD = b*c/a

  // ── Proportion: A:B = C:D, solve for missing ──────────────────────────────

  const pA = parseFloat(propA) || 0
  const pB = parseFloat(propB) || 0
  const pC = parseFloat(propC) || 0
  const propSolved = useMemo(() => {
    if (propSolve === 'd') return pB !== 0 && pA !== 0 ? (pB * pC) / pA : null
    if (propSolve === 'c') return pA !== 0 && pB !== 0 ? (pA * parseFloat(dVal || '0')) / pB : null
    if (propSolve === 'b') return pC !== 0 && parseFloat(dVal || '0') !== 0 ? (pA * parseFloat(dVal || '0')) / pC : null
    if (propSolve === 'a') return pB !== 0 && pC !== 0 ? (pB * pC) / parseFloat(dVal || '1') : null
    return null
  }, [propSolve, pA, pB, pC, dVal])

  const propSteps = useMemo(() => {
    if (propSolve === 'd' && pA !== 0) {
      const d = (pB * pC) / pA
      return [
        `Proportion: ${pA}:${pB} = ${pC}:d`,
        `Cross-multiply: ${pA} × d = ${pB} × ${pC}`,
        `${pA}d = ${pB * pC}`,
        `d = ${pB * pC} / ${pA} = ${fmt6(d)}`,
      ]
    }
    return []
  }, [propSolve, pA, pB, pC])

  // ── Divide total into ratio ───────────────────────────────────────────────

  const total = parseFloat(totalVal) || 0
  const ratioParts = parseMultiRatio(ratioStr)
  const ratioSum = ratioParts.reduce((s, v) => s + v, 0)
  const divParts = ratioSum > 0
    ? ratioParts.map(p => ({ part: p, value: (total * p) / ratioSum }))
    : []

  // ── Convert ───────────────────────────────────────────────────────────────

  const convertResult = useMemo(() => {
    if (a === 0 && b === 0) return null
    const sumAB = a + b
    return {
      fractionA: `${simpA}/${simpA + simpB}`,
      fractionB: `${simpB}/${simpA + simpB}`,
      decimalA: sumAB !== 0 ? a / sumAB : null,
      decimalB: sumAB !== 0 ? b / sumAB : null,
      pctA: sumAB !== 0 ? (a / sumAB) * 100 : null,
      pctB: sumAB !== 0 ? (b / sumAB) * 100 : null,
    }
  }, [a, b, simpA, simpB])

  // ── Scenario table: divide 5 totals by same ratio ────────────────────────

  const scenarioTotals = [50, 100, 250, 500, 1000]
  const scenarioRows = ratioSum > 0
    ? scenarioTotals.map(t => ({ total: t, parts: ratioParts.map(p => (t * p) / ratioSum) }))
    : []

  function handleCopy() {
    let text = ''
    if (mode === 'simplify') text = `${a}:${b} → ${simpA}:${simpB} (GCD=${g}, decimal=${fmt6(decimal ?? 0)})`
    else if (mode === 'proportion') text = `${pA}:${pB} = ${pC}:${fmt6(propSolved ?? 0)}`
    else if (mode === 'divide') text = divParts.map((dp, i) => `Part ${i + 1}: ${dp.value.toFixed(4)}`).join(', ')
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500) })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── MODE TABS ── */}
      <div style={CARD}>
        <ModeTabs mode={mode} setMode={setMode} />

        {/* Simplify */}
        {mode === 'simplify' && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 120 }}>
              <label style={LABEL}>A</label>
              <input type="number" value={aVal} onChange={e => setAVal(e.target.value)} style={INPUT_BOX} />
            </div>
            <div style={{ paddingBottom: 10, fontSize: 22, color: '#8b5cf6', fontWeight: 700 }}>:</div>
            <div style={{ flex: 1, minWidth: 120 }}>
              <label style={LABEL}>B</label>
              <input type="number" value={bVal} onChange={e => setBVal(e.target.value)} style={INPUT_BOX} />
            </div>
          </div>
        )}

        {/* Equivalent */}
        {mode === 'equivalent' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 13, color: 'var(--fg-3)' }}>Given A:B, find X when A:B = C:X (cross-multiply)</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 100 }}><label style={LABEL}>A</label><input type="number" value={aVal} onChange={e => setAVal(e.target.value)} style={INPUT_BOX} /></div>
              <div style={{ paddingBottom: 10, fontSize: 22, color: '#8b5cf6', fontWeight: 700 }}>:</div>
              <div style={{ flex: 1, minWidth: 100 }}><label style={LABEL}>B</label><input type="number" value={bVal} onChange={e => setBVal(e.target.value)} style={INPUT_BOX} /></div>
              <div style={{ paddingBottom: 10, fontSize: 22, color: 'var(--fg-3)' }}>=</div>
              <div style={{ flex: 1, minWidth: 100 }}><label style={LABEL}>C</label><input type="number" value={cVal} onChange={e => setCVal(e.target.value)} style={INPUT_BOX} /></div>
              <div style={{ paddingBottom: 10, fontSize: 22, color: 'var(--fg-3)' }}>: ?</div>
            </div>
          </div>
        )}

        {/* Proportion */}
        {mode === 'proportion' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontSize: 13, color: 'var(--fg-3)' }}>A:B = C:D — solve for any missing value</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {(['d', 'c', 'b', 'a'] as const).map(v => (
                <button key={v} onClick={() => setPropSolve(v)} style={{
                  padding: '6px 14px', borderRadius: 16, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  background: propSolve === v ? 'rgba(99,102,241,0.4)' : 'rgba(0,0,0,0.25)',
                  border: propSolve === v ? '1px solid rgba(99,102,241,0.6)' : '1px solid var(--line-strong)',
                  color: propSolve === v ? '#fff' : 'var(--fg-3)',
                }}>Solve for {v.toUpperCase()}</button>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, alignItems: 'end' }}>
              {(['a', 'b', 'c', 'd'] as const).map(v => {
                const isSolving = v === propSolve
                const val = v === 'a' ? propA : v === 'b' ? propB : v === 'c' ? propC : dVal
                const setter = v === 'a' ? setPropA : v === 'b' ? setPropB : v === 'c' ? setPropC : setDVal
                return (
                  <div key={v}>
                    <label style={{ ...LABEL, color: isSolving ? 'var(--brand-2)' : 'var(--fg-3)' }}>
                      {v.toUpperCase()} {isSolving ? '(solving)' : ''}
                    </label>
                    {isSolving && propSolve === 'd' ? (
                      <div style={{
                        ...INPUT_BOX, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.4)',
                        color: 'var(--brand-2)', fontWeight: 700, fontSize: 16,
                      }}>
                        {propSolved !== null ? fmt6(propSolved) : '—'}
                      </div>
                    ) : (
                      <input type="number" value={val} onChange={e => setter(e.target.value)} style={INPUT_BOX} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Divide */}
        {mode === 'divide' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={LABEL}>Total Amount</label>
                <input type="number" value={totalVal} onChange={e => setTotalVal(e.target.value)} style={INPUT_BOX} />
              </div>
              <div>
                <label style={LABEL}>Ratio (e.g., 3:2:1)</label>
                <input type="text" value={ratioStr} onChange={e => setRatioStr(e.target.value)} style={INPUT_BOX} placeholder="3:2:1" />
              </div>
            </div>
          </div>
        )}

        {/* Convert */}
        {mode === 'convert' && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 120 }}><label style={LABEL}>A</label><input type="number" value={aVal} onChange={e => setAVal(e.target.value)} style={INPUT_BOX} /></div>
            <div style={{ paddingBottom: 10, fontSize: 22, color: '#8b5cf6', fontWeight: 700 }}>:</div>
            <div style={{ flex: 1, minWidth: 120 }}><label style={LABEL}>B</label><input type="number" value={bVal} onChange={e => setBVal(e.target.value)} style={INPUT_BOX} /></div>
          </div>
        )}

        <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
          <button onClick={handleCopy} style={BTN_GHOST}>{copied ? 'Copied!' : 'Copy Result'}</button>
          <button onClick={() => exportCalcPDF({
            toolName: 'Ratio Calculator',
            inputs: [{ label: 'Mode', value: mode }, { label: 'A', value: aVal }, { label: 'B', value: bVal }],
            results: mode === 'simplify' ? [
              { label: 'Simplified', value: `${simpA}:${simpB}`, highlight: true },
              { label: 'GCD', value: String(g) },
              { label: 'Decimal', value: decimal !== null ? fmt6(decimal) : '—' },
            ] : [{ label: 'Result', value: '—' }],
          })} style={BTN_GHOST}>Export PDF</button>
        </div>
      </div>

      {/* ── SIMPLIFY RESULTS ── */}
      {mode === 'simplify' && (a !== 0 || b !== 0) && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 }}>
            <MetricCard label="Simplified" value={`${simpA}:${simpB}`}   color="#6366f1" sub={`GCD = ${g}`} />
            <MetricCard label="Decimal A/B" value={decimal !== null ? parseFloat(decimal.toFixed(6)).toString() : '—'} color="#10b981" />
            <MetricCard label="% Share A"  value={pctA !== null ? fmtPct(pctA) : '—'}  color="#f59e0b" />
            <MetricCard label="% Share B"  value={pctB !== null ? fmtPct(pctB) : '—'}  color="#38bdf8" />
          </div>
          {/* Visual proportion bar */}
          {pctA !== null && pctB !== null && (
            <div style={{ ...CARD, padding: '16px 20px' }}>
              <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Proportion Bar</div>
              <div style={{ height: 20, borderRadius: 10, overflow: 'hidden', display: 'flex' }}>
                <div style={{ flex: a, background: '#6366f1' }} title={`A: ${pctA.toFixed(2)}%`} />
                <div style={{ flex: b, background: '#f59e0b' }} title={`B: ${pctB.toFixed(2)}%`} />
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: '#6366f1', display: 'inline-block' }} />
                  <span style={{ color: 'var(--fg-3)' }}>A ({simpA}):</span>
                  <span style={{ color: 'var(--fg-2)', fontWeight: 600 }}>{fmtPct(pctA)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: '#f59e0b', display: 'inline-block' }} />
                  <span style={{ color: 'var(--fg-3)' }}>B ({simpB}):</span>
                  <span style={{ color: 'var(--fg-2)', fontWeight: 600 }}>{fmtPct(pctB)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Advanced toggle */}
          <button onClick={() => setShowAdv(v => !v)} style={{ ...BTN_GHOST, alignSelf: 'flex-start' }} aria-expanded={showAdv}>
            {showAdv ? '▾' : '▸'} Advanced: Simplification Steps
          </button>
          {showAdv && (
            <div style={{ ...CARD, background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.2)' }}>
              <ol style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <li style={{ fontSize: 13, color: 'var(--fg-2)' }}>Start with ratio {a}:{b}</li>
                <li style={{ fontSize: 13, color: 'var(--fg-2)' }}>Find GCD({Math.abs(Math.round(a))}, {Math.abs(Math.round(b))}) using Euclid&apos;s algorithm = {g}</li>
                <li style={{ fontSize: 13, color: 'var(--fg-2)' }}>Divide both by GCD: {a}/{g} : {b}/{g} = {simpA} : {simpB}</li>
                <li style={{ fontSize: 13, color: 'var(--fg-2)' }}>Decimal: {a} ÷ {b} = {decimal !== null ? fmt6(decimal) : '—'}</li>
                <li style={{ fontSize: 13, color: 'var(--fg-2)' }}>As percentages: {fmtPct(pctA ?? 0)} and {fmtPct(pctB ?? 0)}</li>
              </ol>
            </div>
          )}
        </>
      )}

      {/* ── EQUIVALENT RESULTS ── */}
      {mode === 'equivalent' && (
        <div style={CARD}>
          <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Result</h3>
          <div style={{ fontSize: 13, color: 'var(--fg-3)', marginBottom: 10 }}>
            {aVal}:{bVal} = {cVal}:X
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: 24, fontWeight: 900, color: '#6366f1' }}>
            X = {equivD !== null ? fmt6(equivD) : '—'}
          </div>
          {equivD !== null && (
            <div style={{ marginTop: 14, fontSize: 13, color: 'var(--fg-3)' }}>
              Cross-multiply: {aVal} × X = {bVal} × {cVal}&nbsp;&nbsp;→&nbsp;&nbsp;X = {bVal} × {cVal} / {aVal} = {fmt6(equivD)}
            </div>
          )}
        </div>
      )}

      {/* ── PROPORTION RESULTS ── */}
      {mode === 'proportion' && propSolved !== null && propSolve === 'd' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 }}>
            <MetricCard label="D (solved)" value={fmt6(propSolved)} color="#6366f1" />
            <MetricCard label="A:B" value={`${propA}:${propB}`} color="#10b981" />
            <MetricCard label="C:D" value={`${propC}:${fmt6(propSolved)}`} color="#f59e0b" />
          </div>
          {propSteps.length > 0 && (
            <div style={CARD}>
              <h3 style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Cross-Multiplication Steps</h3>
              <ol style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {propSteps.map((s, i) => (
                  <li key={i} style={{ fontSize: 13, color: 'var(--fg-2)', fontFamily: 'monospace' }}>{s}</li>
                ))}
              </ol>
            </div>
          )}
        </>
      )}

      {/* ── DIVIDE RESULTS ── */}
      {mode === 'divide' && divParts.length > 0 && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 }}>
            {divParts.map((dp, i) => (
              <MetricCard
                key={i}
                label={`Part ${i + 1} (ratio: ${dp.part})`}
                value={dp.value.toFixed(4)}
                color={['#6366f1', '#10b981', '#f59e0b', '#38bdf8', '#e879f9'][i % 5]}
              />
            ))}
          </div>
          {/* Visual bar */}
          <div style={{ ...CARD, padding: '16px 20px' }}>
            <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Distribution Bar</div>
            <div style={{ height: 22, borderRadius: 10, overflow: 'hidden', display: 'flex' }}>
              {divParts.map((dp, i) => (
                <div key={i} style={{
                  flex: dp.part,
                  background: ['#6366f1', '#10b981', '#f59e0b', '#38bdf8', '#e879f9'][i % 5],
                }} title={`Part ${i + 1}: ${dp.value.toFixed(2)}`} />
              ))}
            </div>
          </div>
          {/* Scenario: 5 different totals */}
          <div style={CARD}>
            <h3 style={{ margin: '0 0 14px', fontSize: 13, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Ratio {ratioStr} Applied to Different Totals
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr>
                    <th style={{ ...TH, textAlign: 'left' }}>Total</th>
                    {ratioParts.map((p, i) => <th key={i} style={TH}>Part {i + 1} ({p})</th>)}
                  </tr>
                </thead>
                <tbody>
                  {scenarioRows.map(row => (
                    <tr key={row.total} style={{ background: row.total === total ? 'rgba(139,92,246,0.08)' : 'transparent' }}>
                      <td style={{ ...TD, textAlign: 'left', color: row.total === total ? 'var(--brand-2)' : 'var(--fg-2)', fontWeight: row.total === total ? 700 : 400 }}>
                        {row.total === total ? '★ ' : ''}{row.total}
                      </td>
                      {row.parts.map((v, i) => <td key={i} style={TD}>{v.toFixed(4)}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ── CONVERT RESULTS ── */}
      {mode === 'convert' && convertResult && (
        <div style={CARD}>
          <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            {simpA}:{simpB} Expressed As
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  {['Part', 'Fraction', 'Decimal', 'Percentage'].map(h => (
                    <th key={h} style={{ ...TH, textAlign: h === 'Part' ? 'left' : 'right' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...TD, textAlign: 'left', color: '#6366f1', fontWeight: 700 }}>A ({simpA})</td>
                  <td style={TD}>{convertResult.fractionA}</td>
                  <td style={TD}>{convertResult.decimalA !== null ? convertResult.decimalA.toFixed(6) : '—'}</td>
                  <td style={{ ...TD, color: '#6366f1' }}>{convertResult.pctA !== null ? fmtPct(convertResult.pctA) : '—'}</td>
                </tr>
                <tr>
                  <td style={{ ...TD, textAlign: 'left', color: '#f59e0b', fontWeight: 700 }}>B ({simpB})</td>
                  <td style={TD}>{convertResult.fractionB}</td>
                  <td style={TD}>{convertResult.decimalB !== null ? convertResult.decimalB.toFixed(6) : '—'}</td>
                  <td style={{ ...TD, color: '#f59e0b' }}>{convertResult.pctB !== null ? fmtPct(convertResult.pctB) : '—'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
