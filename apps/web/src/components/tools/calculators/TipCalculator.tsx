'use client'
import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { exportCalcPDF } from '@/lib/calcPdf'

// ─── Styles ───────────────────────────────────────────────────────────────────

const CARD: CSSProperties = { background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 16, padding: '24px 28px' }
const LABEL: CSSProperties = { display: 'block', marginBottom: 5, fontSize: 12, color: 'var(--fg-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }
const INPUT_BOX: CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: 8, background: 'rgba(0,0,0,0.35)', border: '1px solid var(--line-strong)', color: '#fff', fontSize: 15, boxSizing: 'border-box' }
const BTN_GHOST: CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 8, padding: '9px 18px', color: '#c4b5fd', fontSize: 13, fontWeight: 600, cursor: 'pointer' }
const TH: CSSProperties = { padding: '9px 12px', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--fg-3)', textAlign: 'right', background: 'rgba(99,102,241,0.1)', whiteSpace: 'nowrap' }
const TD: CSSProperties = { padding: '7px 12px', fontSize: 12, textAlign: 'right', color: 'var(--fg-2)', whiteSpace: 'nowrap' }

const $2 = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })
const $ = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })

const TIP_PRESETS = [10, 15, 18, 20, 22, 25]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function calcTip(bill: number, taxAmt: number, tipPct: number, people: number) {
  const pretaxBill = bill - taxAmt
  const tipOnPretax = pretaxBill * (tipPct / 100)
  const tipOnTotal  = bill * (tipPct / 100)
  const totalBill   = bill + tipOnPretax  // convention: tip on pre-tax
  const perPerson   = totalBill / Math.max(1, people)
  const tipPerPerson = tipOnPretax / Math.max(1, people)
  const roundedPerPerson = Math.ceil(perPerson)
  return {
    tipOnPretax, tipOnTotal, totalBill, perPerson, tipPerPerson,
    roundedPerPerson, roundedTotal: roundedPerPerson * Math.max(1, people),
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TipCalculator() {

  const [bill,   setBill]   = useState('85.50')
  const [taxAmt, setTaxAmt] = useState('0')       // pre-tax vs post-tax bill
  const [tipPct, setTipPct] = useState('18')
  const [people, setPeople] = useState('2')
  const [showAdv, setShowAdv] = useState(false)

  const BILL   = parseFloat(bill)   || 0
  const TAX    = parseFloat(taxAmt) || 0
  const PCT    = parseFloat(tipPct) || 0
  const PEOPLE = Math.max(1, parseInt(people) || 1)

  const result = useMemo(() => {
    if (BILL <= 0) return null
    return calcTip(BILL, TAX, PCT, PEOPLE)
  }, [BILL, TAX, PCT, PEOPLE])

  // All scenarios at once (15%, 18%, 20%, 22%, 25%)
  const scenarioRows = useMemo(() => {
    if (BILL <= 0) return []
    return TIP_PRESETS.map(p => ({ pct: p, ...calcTip(BILL, TAX, p, PEOPLE) }))
  }, [BILL, TAX, PEOPLE])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* INPUTS */}
      <div style={CARD}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 16 }}>

          <div>
            <label style={LABEL}>Bill Amount ($)</label>
            <input type="number" value={bill} onChange={e => setBill(e.target.value)}
              placeholder="0.00" min={0} step={0.01} style={INPUT_BOX} aria-label="Bill amount" />
          </div>

          <div>
            <label style={LABEL}>Tip Percentage</label>
            <input type="number" value={tipPct} onChange={e => setTipPct(e.target.value)}
              placeholder="18" min={0} max={100} step={1} style={INPUT_BOX} aria-label="Tip percentage" />
            <div style={{ display: 'flex', gap: 5, marginTop: 7, flexWrap: 'wrap' }}>
              {TIP_PRESETS.map(p => (
                <button key={p} onClick={() => setTipPct(String(p))} style={{
                  padding: '3px 10px', fontSize: 11, borderRadius: 20, cursor: 'pointer',
                  background: tipPct === String(p) ? 'rgba(139,92,246,0.4)' : 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(139,92,246,0.3)', color: tipPct === String(p) ? '#e9d5ff' : '#c4b5fd',
                  fontWeight: tipPct === String(p) ? 700 : 400,
                }}>{p}%</button>
              ))}
            </div>
          </div>

          <div>
            <label style={LABEL}>Split Between (people)</label>
            <input type="number" value={people} onChange={e => setPeople(e.target.value)}
              placeholder="1" min={1} max={50} step={1} style={INPUT_BOX} aria-label="Number of people" />
          </div>
        </div>

        <button onClick={() => setShowAdv(v => !v)} style={{ ...BTN_GHOST, marginBottom: showAdv ? 16 : 0 }} aria-expanded={showAdv}>
          {showAdv ? '▾' : '▸'} Advanced Options
        </button>

        {showAdv && (
          <div style={{ padding: '16px 0 4px', borderTop: '1px solid var(--line-strong)' }}>
            <div style={{ maxWidth: 260 }}>
              <label style={LABEL}>Tax Amount in Bill ($)</label>
              <input type="number" value={taxAmt} onChange={e => setTaxAmt(e.target.value)}
                placeholder="0" min={0} step={0.01} style={INPUT_BOX} aria-label="Tax amount" />
              <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 3 }}>
                Tip is calculated on pre-tax amount when tax is entered (industry standard)
              </div>
            </div>
          </div>
        )}
      </div>

      {/* TIER 1: MAIN RESULT */}
      {result && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 }}>
            {[
              { l: 'Tip Amount',          v: $2(result.tipOnPretax),   c: '#10b981' },
              { l: 'Total Bill',           v: $2(result.totalBill),     c: '#6366f1' },
              { l: `Tip / Person`,         v: $2(result.tipPerPerson),  c: '#38bdf8' },
              { l: `Total / Person`,       v: $2(result.perPerson),     c: '#f59e0b' },
              ...(PEOPLE > 1 ? [{ l: `Rounded / Person`, v: $2(result.roundedPerPerson), c: '#e879f9' }] : []),
            ].map(({ l, v, c }) => (
              <div key={l} style={{ padding: '16px 12px', background: 'rgba(0,0,0,0.3)', borderRadius: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: c }}>{v}</div>
                <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{l}</div>
              </div>
            ))}
          </div>

          {/* Quick rounding note */}
          {PEOPLE > 1 && (
            <div style={{ ...CARD, padding: '14px 20px', fontSize: 13, color: 'var(--fg-3)' }}>
              <strong style={{ color: '#c4b5fd' }}>Easy split:</strong>{' '}
              Everyone pays <strong style={{ color: '#e9d5ff' }}>{$2(result.roundedPerPerson)}</strong> (rounded up to nearest dollar) = total collected{' '}
              <strong style={{ color: '#10b981' }}>{$2(result.roundedTotal)}</strong>
              {result.roundedTotal > result.totalBill ? ` (+${$2(result.roundedTotal - result.totalBill)} extra goes to server)` : ''}
            </div>
          )}

          {/* TIER 2: ALL TIP SCENARIOS */}
          <div style={CARD}>
            <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              📊 Tip Comparison — All Standard Rates
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }} aria-label="Tip scenario comparison">
                <thead>
                  <tr>
                    {['Tip %', 'Tip Amount', 'Total Bill', 'Per Person', 'Rounded / Person'].map(h => (
                      <th key={h} style={{ ...TH, textAlign: h === 'Tip %' ? 'left' : 'right', padding: '10px 14px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {scenarioRows.map(row => {
                    const isSelected = String(row.pct) === tipPct
                    return (
                      <tr key={row.pct}
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: isSelected ? 'rgba(139,92,246,0.1)' : 'transparent', cursor: 'pointer' }}
                        onClick={() => setTipPct(String(row.pct))}
                      >
                        <td style={{ ...TD, textAlign: 'left', color: isSelected ? '#c4b5fd' : 'var(--fg-2)', fontWeight: isSelected ? 700 : 400 }}>
                          {isSelected ? '★ ' : ''}{row.pct}%
                          {row.pct === 18 && ' (standard)'}
                          {row.pct === 20 && ' (good service)'}
                          {row.pct === 25 && ' (excellent)'}
                          {row.pct === 15 && ' (minimum)'}
                        </td>
                        <td style={{ ...TD, color: '#10b981', fontWeight: isSelected ? 700 : 400 }}>{$2(row.tipOnPretax)}</td>
                        <td style={{ ...TD, fontWeight: isSelected ? 700 : 400 }}>{$2(row.totalBill)}</td>
                        <td style={{ ...TD, color: '#f59e0b', fontWeight: isSelected ? 700 : 400 }}>{$2(row.perPerson)}</td>
                        <td style={{ ...TD, color: '#e879f9' }}>{PEOPLE > 1 ? $2(row.roundedPerPerson) : '—'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* TIER 4: GUIDANCE */}
          <div style={{ ...CARD, background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.2)' }}>
            <h3 style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 700, color: '#c4b5fd', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              💡 Tipping Guidelines
            </h3>
            <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                '15% — Acceptable for average service at a sit-down restaurant. Common minimum in the US.',
                '18% — The standard tip for good service. Many credit card receipts pre-calculate this rate.',
                '20% — Easy to calculate (move the decimal, double it) and signals excellent service. Increasingly the new "standard" in the US.',
                '22–25% — For exceptional service, especially at fine dining where servers have lower base wages.',
                'Tip on the pre-tax amount — this is the industry standard. The tax amount does not reflect the server\'s service.',
                `For group bills (${PEOPLE > 1 ? PEOPLE : 'multiple'} people), rounding up to the nearest dollar per person is common and ensures no one short-changes the server on the split.`,
              ].map((tip, i) => (
                <li key={i} style={{ fontSize: 12, color: 'var(--fg-2)', lineHeight: 1.6 }}>{tip}</li>
              ))}
            </ul>
          </div>

          {/* Export */}
          <div>
            <button onClick={async () => exportCalcPDF({
              toolName: 'Tip Calculator',
              inputs: [
                { label: 'Bill Amount', value: $2(BILL) },
                { label: 'Tip Percentage', value: PCT + '%' },
                { label: 'Number of People', value: String(PEOPLE) },
                ...(TAX > 0 ? [{ label: 'Tax in Bill', value: $2(TAX) }] : []),
              ],
              results: [
                { label: 'Tip Amount', value: $2(result.tipOnPretax), highlight: true },
                { label: 'Total Bill', value: $2(result.totalBill), highlight: true },
                { label: 'Tip per Person', value: $2(result.tipPerPerson) },
                { label: 'Total per Person', value: $2(result.perPerson) },
                { label: 'Rounded per Person', value: $2(result.roundedPerPerson) },
              ],
            })} style={BTN_GHOST}>
              📄 Export PDF
            </button>
          </div>
        </>
      )}

      {!result && (
        <div style={{ ...CARD, textAlign: 'center', padding: '40px 20px', color: 'var(--fg-3)', fontSize: 14 }}>
          Enter your bill amount above — tip breakdown appears instantly.
        </div>
      )}
    </div>
  )
}
