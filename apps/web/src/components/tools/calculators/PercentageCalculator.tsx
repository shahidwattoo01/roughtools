'use client'
import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { exportCalcPDF } from '@/lib/calcPdf'

// ─── Styles ───────────────────────────────────────────────────────────────────

const CARD: CSSProperties = { background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 16, padding: '24px 28px' }
const LABEL: CSSProperties = { display: 'block', marginBottom: 5, fontSize: 12, color: 'var(--fg-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }
const INPUT_BOX: CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: 8, background: 'rgba(0,0,0,0.35)', border: '1px solid var(--line-strong)', color: '#fff', fontSize: 15, boxSizing: 'border-box' }
const BTN_GHOST: CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 8, padding: '9px 18px', color: '#c4b5fd', fontSize: 13, fontWeight: 600, cursor: 'pointer' }

const fmt = (n: number) => {
  if (!isFinite(n)) return 'undefined'
  if (Math.abs(n) >= 1e9) return n.toExponential(4)
  return n.toLocaleString('en-US', { maximumFractionDigits: 6 })
}
const fmtPct = (n: number) => fmt(n) + '%'

type Mode = 'pct-of' | 'what-pct' | 'pct-change' | 'add-pct' | 'subtract-pct' | 'reverse-pct' | 'pct-diff'

const MODES: { key: Mode; label: string; description: string; aLabel: string; bLabel: string; formula: string }[] = [
  { key: 'pct-of',       label: '% of Number',       description: 'What is X% of Y?',               aLabel: 'Percentage (%)', bLabel: 'Number',     formula: 'A% × B' },
  { key: 'what-pct',     label: 'What % is A of B?',  description: 'A is what % of B?',              aLabel: 'Value A',        bLabel: 'Value B (total)', formula: '(A / B) × 100' },
  { key: 'pct-change',   label: '% Change',            description: '% increase or decrease',         aLabel: 'Original Value', bLabel: 'New Value',  formula: '((B − A) / |A|) × 100' },
  { key: 'add-pct',      label: 'Add %',               description: 'Increase value by X%',           aLabel: 'Value',          bLabel: 'Add (%)',    formula: 'A × (1 + B/100)' },
  { key: 'subtract-pct', label: 'Subtract %',          description: 'Decrease value by X%',           aLabel: 'Value',          bLabel: 'Subtract (%)', formula: 'A × (1 − B/100)' },
  { key: 'reverse-pct',  label: 'Reverse %',           description: 'Find original before % was added', aLabel: 'Final Value',  bLabel: '% that was added', formula: 'A / (1 + B/100)' },
  { key: 'pct-diff',     label: '% Difference',        description: '% difference between two values', aLabel: 'Value A',       bLabel: 'Value B',    formula: '|A − B| / ((A + B)/2) × 100' },
]

export default function PercentageCalculator() {

  const [mode, setMode] = useState<Mode>('pct-of')
  const [a,    setA]    = useState('25')
  const [b,    setB]    = useState('200')

  const numA = parseFloat(a) || 0
  const numB = parseFloat(b) || 0
  const current = MODES.find(m => m.key === mode)!

  const result = useMemo(() => {
    if (!a || !b) return null
    switch (mode) {
      case 'pct-of':       return { value: (numA / 100) * numB, label: `${fmtPct(numA)} of ${fmt(numB)}`, explain: `${fmt(numA / 100)} × ${fmt(numB)}` }
      case 'what-pct':     return numB === 0 ? null : { value: (numA / numB) * 100, label: `${fmt(numA)} is _% of ${fmt(numB)}`, explain: `(${fmt(numA)} ÷ ${fmt(numB)}) × 100`, isPercent: true }
      case 'pct-change': {
        if (numA === 0) return null
        const ch = ((numB - numA) / Math.abs(numA)) * 100
        return { value: ch, label: `${fmt(numA)} → ${fmt(numB)}`, explain: `((${fmt(numB)} − ${fmt(numA)}) ÷ ${fmt(Math.abs(numA))}) × 100`, isPercent: true }
      }
      case 'add-pct':      return { value: numA * (1 + numB / 100), label: `${fmt(numA)} + ${fmtPct(numB)}`, explain: `${fmt(numA)} × ${fmt(1 + numB / 100)}` }
      case 'subtract-pct': return { value: numA * (1 - numB / 100), label: `${fmt(numA)} − ${fmtPct(numB)}`, explain: `${fmt(numA)} × ${fmt(1 - numB / 100)}` }
      case 'reverse-pct': {
        if (numB === -100) return null
        const orig = numA / (1 + numB / 100)
        return { value: orig, label: `Original before +${fmtPct(numB)}`, explain: `${fmt(numA)} ÷ ${fmt(1 + numB / 100)}` }
      }
      case 'pct-diff': {
        const avg = (numA + numB) / 2
        if (avg === 0) return null
        return { value: (Math.abs(numA - numB) / avg) * 100, label: `% difference between ${fmt(numA)} and ${fmt(numB)}`, explain: `|${fmt(numA)} − ${fmt(numB)}| ÷ ${fmt(avg)} × 100`, isPercent: true }
      }
      default: return null
    }
  }, [mode, numA, numB, a, b])

  // Show all modes at once (mini results)
  const allResults = useMemo(() => {
    if (!a || !b) return []
    return MODES.map(m => {
      try {
        switch (m.key) {
          case 'pct-of':       return { key: m.key, label: m.description, value: `${fmt((numA/100)*numB)}`, example: `${fmtPct(numA)} of ${fmt(numB)} = ${fmt((numA/100)*numB)}` }
          case 'what-pct':     return numB ? { key: m.key, label: m.description, value: fmtPct((numA/numB)*100), example: `${fmt(numA)} is ${fmtPct((numA/numB)*100)} of ${fmt(numB)}` } : null
          case 'pct-change':   return numA ? { key: m.key, label: m.description, value: fmtPct(((numB-numA)/Math.abs(numA))*100), example: `${fmt(numA)}→${fmt(numB)}: ${fmtPct(((numB-numA)/Math.abs(numA))*100)} change` } : null
          case 'add-pct':      return { key: m.key, label: m.description, value: fmt(numA*(1+numB/100)), example: `${fmt(numA)} + ${fmtPct(numB)} = ${fmt(numA*(1+numB/100))}` }
          case 'subtract-pct': return { key: m.key, label: m.description, value: fmt(numA*(1-numB/100)), example: `${fmt(numA)} − ${fmtPct(numB)} = ${fmt(numA*(1-numB/100))}` }
          case 'reverse-pct':  return numB !== -100 ? { key: m.key, label: m.description, value: fmt(numA/(1+numB/100)), example: `Before +${fmtPct(numB)} was applied: ${fmt(numA/(1+numB/100))}` } : null
          case 'pct-diff': {
            const avg=(numA+numB)/2
            return avg ? { key: m.key, label: m.description, value: fmtPct(Math.abs(numA-numB)/avg*100), example: `${fmt(numA)} vs ${fmt(numB)}: ${fmtPct(Math.abs(numA-numB)/avg*100)} different` } : null
          }
          default: return null
        }
      } catch { return null }
    }).filter(Boolean)
  }, [numA, numB, a, b])

  const positive = result ? result.value >= 0 : true
  const isPercent = (result as { isPercent?: boolean } | null)?.isPercent

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Mode selector */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {MODES.map(m => (
          <button key={m.key} onClick={() => setMode(m.key)} style={{
            padding: '7px 14px', borderRadius: 20, cursor: 'pointer', fontWeight: 600, fontSize: 12,
            background: mode === m.key ? 'rgba(139,92,246,0.3)' : 'rgba(0,0,0,0.2)',
            border: '1px solid rgba(139,92,246,0.3)', color: mode === m.key ? '#e9d5ff' : '#c4b5fd',
          }}>
            {m.label}
          </button>
        ))}
      </div>

      {/* INPUTS */}
      <div style={CARD}>
        <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 14 }}>
          <strong style={{ color: '#c4b5fd' }}>{current.description}</strong>
          {' · '}Formula: <code style={{ color: '#f59e0b', background: 'rgba(0,0,0,0.3)', padding: '1px 6px', borderRadius: 4 }}>{current.formula}</code>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
          <div>
            <label style={LABEL}>{current.aLabel}</label>
            <input type="number" value={a} onChange={e => setA(e.target.value)}
              placeholder="0" style={INPUT_BOX} aria-label={current.aLabel} />
          </div>
          <div>
            <label style={LABEL}>{current.bLabel}</label>
            <input type="number" value={b} onChange={e => setB(e.target.value)}
              placeholder="0" style={INPUT_BOX} aria-label={current.bLabel} />
          </div>
        </div>
      </div>

      {/* TIER 1: MAIN RESULT */}
      {result && (
        <>
          <div style={{ ...CARD, textAlign: 'center', background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.3)' }}>
            <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>
              {current.label}
            </div>
            <div style={{ fontSize: 48, fontWeight: 900, color: mode === 'pct-change' && !positive ? '#f87171' : '#6366f1', lineHeight: 1 }}>
              {isPercent ? fmtPct(result.value) : fmt(result.value)}
            </div>
            <div style={{ fontSize: 13, color: 'var(--fg-3)', marginTop: 8 }}>
              {result.explain && <span><em>{result.explain}</em></span>}
            </div>
          </div>

          {/* TIER 2: ALL CALCULATIONS AT ONCE */}
          <div style={CARD}>
            <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              📊 All Calculations for A={fmt(numA)}, B={fmt(numB)}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {allResults.map(r => r && (
                <div key={r.key} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 14px', background: r.key === mode ? 'rgba(139,92,246,0.1)' : 'rgba(0,0,0,0.15)',
                  borderRadius: 10, flexWrap: 'wrap', gap: 8, cursor: 'pointer',
                  border: r.key === mode ? '1px solid rgba(139,92,246,0.3)' : '1px solid transparent',
                }}
                  onClick={() => setMode(r.key as Mode)}>
                  <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>{r.label}</span>
                  <span style={{ fontSize: 13, color: r.key === mode ? '#c4b5fd' : 'var(--fg-2)', fontWeight: 700, fontFamily: 'monospace' }}>{r.example}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Export */}
          <div>
            <button onClick={async () => exportCalcPDF({
              toolName: 'Percentage Calculator',
              inputs: [
                { label: 'Mode',           value: current.label },
                { label: current.aLabel,   value: fmt(numA) },
                { label: current.bLabel,   value: fmt(numB) },
              ],
              results: [
                { label: 'Result', value: isPercent ? fmtPct(result.value) : fmt(result.value), highlight: true },
              ],
            })} style={BTN_GHOST}>
              📄 Export PDF
            </button>
          </div>
        </>
      )}

      {!result && (
        <div style={{ ...CARD, textAlign: 'center', padding: '40px 20px', color: 'var(--fg-3)', fontSize: 14 }}>
          Enter values above — result updates instantly.
        </div>
      )}
    </div>
  )
}
