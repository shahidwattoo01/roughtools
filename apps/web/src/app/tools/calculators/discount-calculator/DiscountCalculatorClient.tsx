'use client'
import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { exportCalcPDF } from '@/lib/calcPdf'

// ─── Types ────────────────────────────────────────────────────────────────────

type Mode = 'percent-off' | 'find-percent' | 'find-original' | 'successive'

interface DiscountResult {
  salePrice: number
  discountAmount: number
  savingsPct: number
  finalAfterTax: number
  taxAmount: number
  effectivePct?: number   // for successive mode
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
const TD: CSSProperties = {
  padding: '6px 12px', fontSize: 12, textAlign: 'right',
  color: 'var(--fg-2)', whiteSpace: 'nowrap',
}

// ─── Formatting helpers ───────────────────────────────────────────────────────

const $ = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })
const pct = (n: number, d = 2) => n.toFixed(d) + '%'

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

// ─── CSV export ───────────────────────────────────────────────────────────────

function exportCSV(rows: Array<Record<string, string | number>>, filename: string) {
  if (!rows.length) return
  const headers = Object.keys(rows[0])
  const csv = [headers, ...rows.map(r => headers.map(h => r[h]))].map(r => r.join(',')).join('\n')
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })),
    download: filename,
  })
  a.click()
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DiscountCalculatorClient() {

  // ── Core inputs ──
  const [mode,       setMode]       = useState<Mode>('percent-off')
  const [original,   setOriginal]   = useState('100')
  const [discPct,    setDiscPct]    = useState('20')
  const [salePrice,  setSalePrice]  = useState('80')
  const [disc1,      setDisc1]      = useState('20')
  const [disc2,      setDisc2]      = useState('10')

  // ── Advanced inputs ──
  const [showAdv,    setShowAdv]    = useState(false)
  const [taxRate,    setTaxRate]    = useState('0')
  const [cashback,   setCashback]   = useState('0')
  const [coupon,     setCoupon]     = useState('0')

  // ── UI state ──
  const [showScenario, setShowScenario] = useState(false)
  const [showStacked,  setShowStacked]  = useState(false)

  // ─── Parse inputs ─────────────────────────────────────────────────────────────
  const O     = parseFloat(original)   || 0
  const D     = parseFloat(discPct)    || 0
  const S     = parseFloat(salePrice)  || 0
  const D1    = parseFloat(disc1)      || 0
  const D2    = parseFloat(disc2)      || 0
  const TAX   = parseFloat(taxRate)    || 0
  const CB    = parseFloat(cashback)   || 0
  const CPN   = parseFloat(coupon)     || 0

  // ─── Live calculation ─────────────────────────────────────────────────────────
  const result = useMemo<DiscountResult | null>(() => {
    let saleP = 0, discAmt = 0, savePct = 0, origP = O

    if (mode === 'percent-off') {
      if (O <= 0 || D < 0 || D > 100) return null
      saleP   = O * (1 - D / 100)
      discAmt = O - saleP
      savePct = D
      origP   = O
    } else if (mode === 'find-percent') {
      if (O <= 0 || S <= 0 || S >= O) return null
      saleP   = S
      discAmt = O - S
      savePct = ((O - S) / O) * 100
      origP   = O
    } else if (mode === 'find-original') {
      if (S <= 0 || D < 0 || D >= 100) return null
      origP   = S / (1 - D / 100)
      saleP   = S
      discAmt = origP - S
      savePct = D
    } else {
      // successive discounts
      if (O <= 0) return null
      const after1 = O * (1 - D1 / 100)
      saleP        = after1 * (1 - D2 / 100)
      discAmt      = O - saleP
      savePct      = (discAmt / O) * 100
    }

    // Apply cashback & coupon stacking
    const afterCoupons = Math.max(0, saleP - CPN - (saleP * CB / 100))
    const taxAmt       = afterCoupons * TAX / 100
    const finalAfterTax = afterCoupons + taxAmt

    return {
      salePrice: saleP,
      discountAmount: discAmt,
      savingsPct: savePct,
      finalAfterTax,
      taxAmount: taxAmt,
      effectivePct: mode === 'successive' ? savePct : undefined,
    }
  }, [mode, O, D, S, D1, D2, TAX, CB, CPN])

  // ─── Scenario table rows ──────────────────────────────────────────────────────
  const scenarioRows = useMemo(() => {
    if (O <= 0) return []
    return [5, 10, 15, 20, 25, 30, 40, 50].map(pctOff => {
      const sp  = O * (1 - pctOff / 100)
      const amt = O - sp
      const tax = sp * TAX / 100
      return { pctOff, saleP: sp, discAmt: amt, finalTax: sp + tax }
    })
  }, [O, TAX])

  // ─── Stacked discount table ───────────────────────────────────────────────────
  const stackedRows = useMemo(() => {
    if (O <= 0) return []
    const combos: [number, number][] = [
      [10, 10], [20, 10], [25, 10], [30, 20], [50, 10],
    ]
    return combos.map(([a, b]) => {
      const after = O * (1 - a / 100) * (1 - b / 100)
      const eff   = ((O - after) / O) * 100
      return { a, b, effective: eff, after }
    })
  }, [O])

  // ─── Interpretation text ──────────────────────────────────────────────────────
  function getInterpretation(): string {
    if (!result) return ''
    const origLabel = mode === 'find-original' ? result.salePrice + result.discountAmount : O
    if (mode === 'find-percent') {
      return `You save ${$(result.discountAmount)} out of ${$(origLabel)} — that's ${pct(result.savingsPct)} back in your pocket.`
    }
    if (mode === 'successive') {
      return `Two sequential discounts of ${pct(D1)} then ${pct(D2)} give an effective saving of ${pct(result.savingsPct)}, not ${pct(D1 + D2)} (discounts compound, not add).`
    }
    return `You save ${$(result.discountAmount)} out of ${$(origLabel)} — that's ${pct(result.savingsPct)} back in your pocket.`
  }

  // ─── Input helper ─────────────────────────────────────────────────────────────
  function Field({ label, value, onChange, placeholder, min, max, step, hint }: {
    label: string; value: string; onChange: (v: string) => void
    placeholder?: string; min?: number; max?: number; step?: number; hint?: string
  }) {
    return (
      <div>
        <label style={LABEL}>{label}</label>
        <input
          type="number" value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          min={min} max={max} step={step}
          style={INPUT_BOX}
          aria-label={label}
        />
        {hint && <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 3 }}>{hint}</div>}
      </div>
    )
  }

  // ─── Mode labels ─────────────────────────────────────────────────────────────
  const MODES: { key: Mode; label: string }[] = [
    { key: 'percent-off',  label: '% Off → Sale Price' },
    { key: 'find-percent', label: 'Find Discount %' },
    { key: 'find-original',label: 'Find Original Price' },
    { key: 'successive',   label: 'Successive Discounts' },
  ]

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── INPUTS ── */}
      <div style={CARD}>

        {/* Mode selector */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
          {MODES.map(m => (
            <button key={m.key}
              onClick={() => setMode(m.key)}
              style={{
                padding: '8px 14px', borderRadius: 10, cursor: 'pointer',
                fontWeight: 700, fontSize: 12,
                background: mode === m.key ? '#6366f1' : 'rgba(0,0,0,0.3)',
                color: mode === m.key ? '#fff' : 'var(--fg-3)',
                border: mode === m.key ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.1)',
              }}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Fields */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 16 }}>

          {(mode === 'percent-off' || mode === 'find-percent' || mode === 'successive') && (
            <Field label="Original Price ($)" value={original} onChange={setOriginal} placeholder="100" min={0} step={0.01} />
          )}

          {mode === 'percent-off' && (
            <Field label="Discount (%)" value={discPct} onChange={setDiscPct} placeholder="20" min={0} max={100} step={0.1} />
          )}

          {mode === 'find-percent' && (
            <Field label="Sale Price ($)" value={salePrice} onChange={setSalePrice} placeholder="80" min={0} step={0.01} hint="Must be less than original" />
          )}

          {mode === 'find-original' && (
            <>
              <Field label="Sale Price ($)" value={salePrice} onChange={setSalePrice} placeholder="80" min={0} step={0.01} />
              <Field label="Discount (%)" value={discPct} onChange={setDiscPct} placeholder="20" min={0} max={99.9} step={0.1} />
            </>
          )}

          {mode === 'successive' && (
            <>
              <Field label="First Discount (%)" value={disc1} onChange={setDisc1} placeholder="20" min={0} max={100} step={0.1} hint="e.g. 20% off" />
              <Field label="Second Discount (%)" value={disc2} onChange={setDisc2} placeholder="10" min={0} max={100} step={0.1} hint="e.g. then 10% off" />
            </>
          )}
        </div>

        {/* Advanced toggle */}
        <button
          onClick={() => setShowAdv(v => !v)}
          style={{ ...BTN_GHOST, marginBottom: showAdv ? 16 : 0 }}
          aria-expanded={showAdv}
        >
          {showAdv ? '▾' : '▸'} Advanced Options (Tax, Cashback, Coupons)
        </button>

        {showAdv && (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 16, padding: '16px 0 4px',
            borderTop: '1px solid var(--line-strong)',
          }}>
            <Field label="Sales Tax (%)" value={taxRate} onChange={setTaxRate}
              placeholder="0" min={0} max={30} step={0.1}
              hint="Applied to sale price after discounts" />
            <Field label="Cashback (%)" value={cashback} onChange={setCashback}
              placeholder="0" min={0} max={100} step={0.1}
              hint="% returned to you (credit card etc.)" />
            <Field label="Coupon / Voucher ($)" value={coupon} onChange={setCoupon}
              placeholder="0" min={0} step={0.01}
              hint="Flat amount deducted from sale price" />
          </div>
        )}
      </div>

      {/* ── TIER 1: RESULTS ── */}
      {result ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
            <MetricCard label="Sale Price"      value={$(result.salePrice)}       color="#10b981" />
            <MetricCard label="You Save"        value={$(result.discountAmount)}  color="#6366f1"
              sub={pct(result.savingsPct) + ' off'} />
            {mode === 'find-original' && (
              <MetricCard label="Original Price" value={$(result.salePrice + result.discountAmount)} color="#38bdf8" />
            )}
            {mode === 'successive' && result.effectivePct !== undefined && (
              <MetricCard label="Effective Discount" value={pct(result.effectivePct)} color="#f59e0b"
                sub={`vs ${pct(D1 + D2)} if added`} />
            )}
            {(TAX > 0 || parseFloat(cashback) > 0 || parseFloat(coupon) > 0) && (
              <MetricCard label="Final After Tax" value={$(result.finalAfterTax)} color="#e879f9"
                sub={TAX > 0 ? `incl. ${pct(TAX)} tax` : undefined} />
            )}
          </div>

          {/* Interpretation */}
          <div style={{ ...CARD, background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.2)' }}>
            <p style={{ margin: 0, fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.7 }}>
              {getInterpretation()}
            </p>
          </div>

          {/* Export PDF */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={async () => exportCalcPDF({
                toolName: 'Discount Calculator',
                inputs: [
                  ...(mode !== 'find-original' ? [{ label: 'Original Price', value: $(O) }] : []),
                  ...(mode === 'percent-off'   ? [{ label: 'Discount %', value: pct(D) }] : []),
                  ...(mode === 'find-percent'  ? [{ label: 'Sale Price', value: $(S) }] : []),
                  ...(mode === 'find-original' ? [{ label: 'Sale Price', value: $(S) }, { label: 'Discount %', value: pct(D) }] : []),
                  ...(mode === 'successive'    ? [{ label: 'Discount 1', value: pct(D1) }, { label: 'Discount 2', value: pct(D2) }] : []),
                  ...(TAX > 0 ? [{ label: 'Sales Tax', value: pct(TAX) }] : []),
                ],
                results: [
                  { label: 'Sale Price',       value: $(result.salePrice),      highlight: true },
                  { label: 'Amount Saved',     value: $(result.discountAmount) },
                  { label: 'Savings %',        value: pct(result.savingsPct) },
                  ...(TAX > 0 ? [{ label: 'Final After Tax', value: $(result.finalAfterTax) }] : []),
                ],
              })}
              style={BTN_GHOST}
            >
              📄 Export PDF
            </button>
          </div>

          {/* ── TIER 2: SCENARIO TABLE ── */}
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
              {showScenario ? '▾' : '▸'} Discount Scenarios (same item at common discount rates)
            </button>

            {showScenario && scenarioRows.length > 0 && (
              <div style={{ ...CARD, padding: 0, overflow: 'hidden', marginTop: 4 }}>
                <div style={{ display: 'flex', gap: 10, padding: '14px 20px', borderBottom: '1px solid var(--line-strong)', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => exportCSV(
                      scenarioRows.map(r => ({
                        'Discount %': r.pctOff,
                        'Sale Price': r.saleP.toFixed(2),
                        'Amount Saved': r.discAmt.toFixed(2),
                        'Final After Tax': r.finalTax.toFixed(2),
                      })),
                      'discount-scenarios.csv'
                    )}
                    style={BTN_GHOST}
                  >
                    ⬇ Export CSV
                  </button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }} aria-label="Discount scenario table">
                    <thead>
                      <tr>
                        {['Discount %', 'Sale Price', 'Amount Saved', TAX > 0 ? 'Final After Tax' : null].filter(Boolean).map(h => (
                          <th key={h!} style={{ ...TH, textAlign: h === 'Discount %' ? 'left' : 'right', padding: '10px 14px' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {scenarioRows.map(row => {
                        const isActive = Math.abs(row.pctOff - D) < 0.1 && mode === 'percent-off'
                        return (
                          <tr key={row.pctOff} style={{
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                            background: isActive ? 'rgba(139,92,246,0.08)' : 'transparent',
                          }}>
                            <td style={{ ...TD, textAlign: 'left', color: isActive ? '#c4b5fd' : 'var(--fg-2)', fontWeight: isActive ? 700 : 400 }}>
                              {isActive ? '★ ' : ''}{row.pctOff}% off
                            </td>
                            <td style={{ ...TD, color: '#10b981' }}>{$(row.saleP)}</td>
                            <td style={{ ...TD, color: '#6366f1' }}>{$(row.discAmt)}</td>
                            {TAX > 0 && <td style={TD}>{$(row.finalTax)}</td>}
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* ── TIER 3: STACKED DISCOUNT TABLE ── */}
          <div>
            <button
              onClick={() => setShowStacked(v => !v)}
              style={{
                width: '100%', textAlign: 'left', padding: '14px 20px',
                background: 'var(--bg-1)', border: '1px solid var(--line-strong)',
                borderRadius: 12, color: '#c4b5fd', fontWeight: 700, fontSize: 14,
                cursor: 'pointer',
              }}
              aria-expanded={showStacked}
            >
              {showStacked ? '▾' : '▸'} Stacked Discount Combinations (effective % savings)
            </button>

            {showStacked && (
              <div style={{ ...CARD, padding: 0, overflow: 'hidden', marginTop: 4 }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }} aria-label="Stacked discounts table">
                    <thead>
                      <tr>
                        {['Discount 1', 'Discount 2', 'Naive Sum', 'Effective %', 'Final Price'].map(h => (
                          <th key={h} style={{ ...TH, textAlign: h === 'Discount 1' ? 'left' : 'right', padding: '10px 14px' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {stackedRows.map(row => (
                        <tr key={`${row.a}-${row.b}`} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ ...TD, textAlign: 'left' }}>{row.a}% off</td>
                          <td style={TD}>{row.b}% off</td>
                          <td style={{ ...TD, color: 'var(--fg-3)' }}>{pct(row.a + row.b)}</td>
                          <td style={{ ...TD, color: '#10b981', fontWeight: 700 }}>{pct(row.effective)}</td>
                          <td style={TD}>{O > 0 ? $(row.after) : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ padding: '12px 20px', borderTop: '1px solid var(--line-strong)', fontSize: 12, color: 'var(--fg-3)' }}>
                  Successive discounts compound: 20% then 10% = 28% effective saving, not 30%. Each discount applies to the already-reduced price.
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div style={{ ...CARD, textAlign: 'center', padding: '40px 20px', color: 'var(--fg-3)', fontSize: 14 }}>
          {mode === 'find-percent' && S >= O && O > 0
            ? '⚠ Sale price must be less than original price.'
            : mode === 'find-original' && D >= 100
            ? '⚠ Discount % must be less than 100%.'
            : 'Enter values above — results update instantly.'}
        </div>
      )}
    </div>
  )
}
