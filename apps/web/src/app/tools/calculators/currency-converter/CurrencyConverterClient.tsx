'use client'
import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { exportCalcPDF } from '@/lib/calcPdf'

// ─── Types ────────────────────────────────────────────────────────────────────

interface CurrencyInfo {
  code: string
  name: string
  symbol: string
}

// ─── Currency data ────────────────────────────────────────────────────────────

const CURRENCIES: CurrencyInfo[] = [
  { code: 'USD', name: 'US Dollar',           symbol: '$'  },
  { code: 'EUR', name: 'Euro',                symbol: '€'  },
  { code: 'GBP', name: 'British Pound',       symbol: '£'  },
  { code: 'JPY', name: 'Japanese Yen',        symbol: '¥'  },
  { code: 'CAD', name: 'Canadian Dollar',     symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar',   symbol: 'A$' },
  { code: 'CHF', name: 'Swiss Franc',         symbol: 'Fr' },
  { code: 'CNY', name: 'Chinese Yuan',        symbol: '¥'  },
  { code: 'INR', name: 'Indian Rupee',        symbol: '₹'  },
  { code: 'MXN', name: 'Mexican Peso',        symbol: 'Mex$'},
  { code: 'BRL', name: 'Brazilian Real',      symbol: 'R$' },
  { code: 'KRW', name: 'South Korean Won',    symbol: '₩'  },
  { code: 'SGD', name: 'Singapore Dollar',    symbol: 'S$' },
  { code: 'HKD', name: 'Hong Kong Dollar',    symbol: 'HK$'},
  { code: 'NOK', name: 'Norwegian Krone',     symbol: 'kr' },
  { code: 'SEK', name: 'Swedish Krona',       symbol: 'kr' },
  { code: 'DKK', name: 'Danish Krone',        symbol: 'kr' },
  { code: 'NZD', name: 'New Zealand Dollar',  symbol: 'NZ$'},
  { code: 'ZAR', name: 'South African Rand',  symbol: 'R'  },
  { code: 'AED', name: 'UAE Dirham',          symbol: 'د.إ'},
]

// Approximate mid-market rates vs USD (2024–2025 approximate)
const RATES_VS_USD: Record<string, number> = {
  USD: 1,
  EUR: 0.922,
  GBP: 0.787,
  JPY: 149.8,
  CAD: 1.362,
  AUD: 1.533,
  CHF: 0.891,
  CNY: 7.241,
  INR: 83.48,
  MXN: 17.22,
  BRL: 4.975,
  KRW: 1334.0,
  SGD: 1.342,
  HKD: 7.821,
  NOK: 10.59,
  SEK: 10.42,
  DKK: 6.884,
  NZD: 1.629,
  ZAR: 18.71,
  AED: 3.672,
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

function fmtAmt(n: number, code: string): string {
  const info = CURRENCIES.find(c => c.code === code)
  const sym = info?.symbol ?? code
  if (Math.abs(n) >= 1000) return sym + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return sym + n.toFixed(code === 'JPY' || code === 'KRW' ? 0 : 4)
}
function fmtRate(n: number): string {
  if (n >= 100) return n.toFixed(2)
  if (n >= 1)   return n.toFixed(4)
  return n.toFixed(6)
}

// ─── Conversion engine ────────────────────────────────────────────────────────

function convert(amount: number, from: string, to: string): number {
  const rFrom = RATES_VS_USD[from] ?? 1
  const rTo   = RATES_VS_USD[to]   ?? 1
  return (amount / rFrom) * rTo
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

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CurrencyConverterClient() {

  // ── Core inputs ──
  const [amount, setAmount] = useState('100')
  const [from,   setFrom]   = useState('USD')
  const [to,     setTo]     = useState('EUR')

  // ── UI state ──
  const [showAllCurrencies, setShowAllCurrencies] = useState(false)
  const [showScenario,      setShowScenario]      = useState(false)

  // ─── Parse ───────────────────────────────────────────────────────────────────
  const amt = parseFloat(amount) || 0

  // ─── Live results ─────────────────────────────────────────────────────────────
  const result = useMemo(() => {
    if (amt <= 0) return null
    const converted   = convert(amt, from, to)
    const inverse     = convert(1, to, from)
    const midRate     = convert(1, from, to)
    const feeEstimate = converted * 0.015   // 1.5% typical exchange fee
    const youReceive  = converted - feeEstimate
    return { converted, inverse, midRate, feeEstimate, youReceive }
  }, [amt, from, to])

  // ─── Multi-currency table ──────────────────────────────────────────────────────
  const allRows = useMemo(() => {
    if (amt <= 0) return []
    return CURRENCIES.map(c => ({
      code: c.code,
      name: c.name,
      symbol: c.symbol,
      converted: convert(amt, from, c.code),
      rate: convert(1, from, c.code),
    }))
  }, [amt, from])

  // ─── Rate variation scenario ──────────────────────────────────────────────────
  const scenarioRows = useMemo(() => {
    if (!result) return []
    const base = result.midRate
    return [-10, -5, 0, 5, 10].map(pctChg => {
      const adjRate     = base * (1 + pctChg / 100)
      const adjConverted = amt * adjRate
      return { pctChg, adjRate, adjConverted }
    })
  }, [result, amt])

  // ─── Swap currencies ──────────────────────────────────────────────────────────
  function swapCurrencies() {
    const temp = from
    setFrom(to)
    setTo(temp)
  }

  // ─── Quick amounts ────────────────────────────────────────────────────────────
  const quickAmounts = [10, 50, 100, 500, 1000, 5000]

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── INPUTS ── */}
      <div style={CARD}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 16 }}>

          {/* Amount */}
          <div>
            <label style={LABEL}>Amount</label>
            <input
              type="number" value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="100" min={0} step={1}
              style={INPUT_BOX} aria-label="Amount"
            />
          </div>

          {/* From currency */}
          <div>
            <label style={LABEL}>From Currency</label>
            <select
              value={from}
              onChange={e => setFrom(e.target.value)}
              style={{ ...INPUT_BOX, cursor: 'pointer' }}
              aria-label="From currency"
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
              ))}
            </select>
          </div>

          {/* Swap button + To currency */}
          <div>
            <label style={LABEL}>To Currency</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button
                onClick={swapCurrencies}
                style={{
                  ...BTN_GHOST, padding: '10px 12px', flexShrink: 0,
                  borderRadius: 8, fontSize: 16,
                }}
                title="Swap currencies"
                aria-label="Swap currencies"
              >
                ⇄
              </button>
              <select
                value={to}
                onChange={e => setTo(e.target.value)}
                style={{ ...INPUT_BOX, cursor: 'pointer' }}
                aria-label="To currency"
              >
                {CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Quick amounts */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {quickAmounts.map(v => (
            <button
              key={v}
              onClick={() => setAmount(String(v))}
              style={{
                padding: '6px 14px', borderRadius: 8, cursor: 'pointer',
                background: parseFloat(amount) === v ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.05)',
                border: '1px solid var(--line-strong)', color: 'var(--fg-2)', fontSize: 13,
              }}
            >
              {v.toLocaleString()}
            </button>
          ))}
        </div>

        {/* Disclaimer */}
        <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8 }}>
          <p style={{ margin: 0, fontSize: 11, color: '#fbbf24', lineHeight: 1.6 }}>
            Approximate mid-market rates (2024–2025). Rates update daily — verify with your bank or broker before transacting.
            Exchange fees of 1–3% typically apply at banks; online services may be lower.
          </p>
        </div>
      </div>

      {/* ── TIER 1: MAIN RESULTS ── */}
      {result ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
            <MetricCard
              label={`Converted (${to})`}
              value={fmtAmt(result.converted, to)}
              color="#6366f1"
              sub={`from ${fmtAmt(amt, from)}`}
            />
            <MetricCard
              label="Mid-Market Rate"
              value={`1 ${from} = ${fmtRate(result.midRate)} ${to}`}
              color="#10b981"
            />
            <MetricCard
              label="Inverse Rate"
              value={`1 ${to} = ${fmtRate(result.inverse)} ${from}`}
              color="#38bdf8"
            />
            <MetricCard
              label="Est. Fee (1.5%)"
              value={fmtAmt(result.feeEstimate, to)}
              color="#f59e0b"
              sub={`You receive ≈ ${fmtAmt(result.youReceive, to)}`}
            />
          </div>

          {/* Export PDF */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={async () => exportCalcPDF({
                toolName: 'Currency Converter',
                inputs: [
                  { label: 'Amount',        value: `${fmtAmt(amt, from)}` },
                  { label: 'From',          value: from },
                  { label: 'To',            value: to },
                ],
                results: [
                  { label: `Converted (${to})`,  value: fmtAmt(result.converted, to), highlight: true },
                  { label: 'Mid-Market Rate',    value: `1 ${from} = ${fmtRate(result.midRate)} ${to}` },
                  { label: 'Inverse Rate',       value: `1 ${to} = ${fmtRate(result.inverse)} ${from}` },
                  { label: 'Est. Fee (1.5%)',    value: fmtAmt(result.feeEstimate, to) },
                  { label: 'You Receive',        value: fmtAmt(result.youReceive, to) },
                ],
              })}
              style={BTN_GHOST}
            >
              📄 Export PDF
            </button>
          </div>

          {/* ── TIER 2: MULTI-CURRENCY TABLE ── */}
          <div>
            <button
              onClick={() => setShowAllCurrencies(v => !v)}
              style={{
                width: '100%', textAlign: 'left', padding: '14px 20px',
                background: 'var(--bg-1)', border: '1px solid var(--line-strong)',
                borderRadius: 12, color: '#c4b5fd', fontWeight: 700, fontSize: 14,
                cursor: 'pointer',
              }}
              aria-expanded={showAllCurrencies}
            >
              {showAllCurrencies ? '▾' : '▸'} All 20 Currencies at Once
              &nbsp;<span style={{ fontWeight: 400, fontSize: 12, color: 'var(--fg-3)' }}>({fmtAmt(amt, from)} in every currency)</span>
            </button>

            {showAllCurrencies && (
              <div style={{ ...CARD, padding: 0, overflow: 'hidden', marginTop: 4 }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }} aria-label="All currencies conversion table">
                    <thead>
                      <tr>
                        {['Currency', 'Name', 'Rate (per 1 ' + from + ')', 'Converted Amount'].map((h, i) => (
                          <th key={h} style={{ ...TH, textAlign: i === 0 || i === 1 ? 'left' : 'right', padding: '10px 14px' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {allRows.map(row => {
                        const isFrom   = row.code === from
                        const isTo     = row.code === to
                        const highlight = isFrom || isTo
                        return (
                          <tr key={row.code} style={{
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                            background: highlight ? 'rgba(139,92,246,0.08)' : 'transparent',
                          }}>
                            <td style={{ ...TD, textAlign: 'left', color: highlight ? '#c4b5fd' : 'var(--fg-2)', fontWeight: highlight ? 700 : 400 }}>
                              {isFrom ? '⊙ ' : isTo ? '★ ' : ''}{row.code}
                            </td>
                            <td style={{ ...TD, textAlign: 'left', color: 'var(--fg-3)' }}>{row.name}</td>
                            <td style={{ ...TD, fontFamily: 'monospace' }}>{fmtRate(row.rate)}</td>
                            <td style={{ ...TD, color: isTo ? '#6366f1' : 'var(--fg-2)', fontWeight: isTo ? 700 : 400 }}>
                              {fmtAmt(row.converted, row.code)}
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

          {/* ── TIER 3: RATE VOLATILITY SCENARIO ── */}
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
              {showScenario ? '▾' : '▸'} Rate Volatility Impact (±5%, ±10%)
            </button>

            {showScenario && (
              <div style={{ ...CARD, padding: 0, overflow: 'hidden', marginTop: 4 }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }} aria-label="Rate volatility scenarios">
                    <thead>
                      <tr>
                        {['Rate Change', `Rate (1 ${from} → ${to})`, `${fmtAmt(amt, from)} converts to`].map((h, i) => (
                          <th key={h} style={{ ...TH, textAlign: i === 0 ? 'left' : 'right', padding: '10px 14px' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {scenarioRows.map(row => {
                        const isBase = row.pctChg === 0
                        return (
                          <tr key={row.pctChg} style={{
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                            background: isBase ? 'rgba(139,92,246,0.08)' : 'transparent',
                          }}>
                            <td style={{ ...TD, textAlign: 'left', color: isBase ? '#c4b5fd' : row.pctChg > 0 ? '#10b981' : '#f87171', fontWeight: isBase ? 700 : 400 }}>
                              {isBase ? '★ Current rate' : row.pctChg > 0 ? `+${row.pctChg}% (${from} stronger)` : `${row.pctChg}% (${from} weaker)`}
                            </td>
                            <td style={{ ...TD, fontFamily: 'monospace' }}>{fmtRate(row.adjRate)}</td>
                            <td style={{ ...TD, color: isBase ? '#6366f1' : 'var(--fg-2)', fontWeight: isBase ? 700 : 400 }}>
                              {fmtAmt(row.adjConverted, to)}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                <div style={{ padding: '12px 20px', borderTop: '1px solid var(--line-strong)', fontSize: 12, color: 'var(--fg-3)' }}>
                  Currency rates fluctuate continuously. A 5% swing over days or weeks is common for major pairs; emerging market currencies can move 10–20% in a year.
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div style={{ ...CARD, textAlign: 'center', padding: '40px 20px', color: 'var(--fg-3)', fontSize: 14 }}>
          Enter an amount above — results update instantly.
        </div>
      )}
    </div>
  )
}
