'use client'
import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { exportCalcPDF } from '@/lib/calcPdf'

// ─── Types ────────────────────────────────────────────────────────────────────

interface YearRow {
  year: number
  startBalance: number
  contributions: number
  interestEarned: number
  endBalance: number
  totalContributions: number
  totalInterest: number
}

interface CompoundResult {
  futureValue: number
  totalContributions: number
  totalInterest: number
  effectiveAPY: number          // APY from compounding frequency
  doublingTime: number          // Rule of 72 years
  schedule: YearRow[]
  realFutureValue?: number      // inflation-adjusted (optional)
}

// ─── Calculation Engine ───────────────────────────────────────────────────────

/** Compounding frequencies: n = periods/year */
const FREQ: Record<string, { label: string; n: number }> = {
  '1':   { label: 'Annually',      n: 1   },
  '2':   { label: 'Semi-annually', n: 2   },
  '4':   { label: 'Quarterly',     n: 4   },
  '12':  { label: 'Monthly',       n: 12  },
  '52':  { label: 'Weekly',        n: 52  },
  '365': { label: 'Daily',         n: 365 },
}

/** Contribution timing: beginning vs end of period */
function calcCompound(
  principal: number,
  annualRate: number,          // %
  years: number,
  n: number,                   // compounding frequency
  contribution: number,        // per period (0 for lump sum)
  contribFreq: number,         // how often contributions happen (per year)
  inflationRate: number,       // % per year
): CompoundResult | null {
  if (years <= 0) return null
  if (principal < 0 || annualRate < 0) return null

  const r = annualRate / 100
  const APY = Math.pow(1 + r / n, n) - 1

  const schedule: YearRow[] = []
  let balance = principal
  let totalContrib = principal
  let totalInterest = 0

  for (let y = 1; y <= years; y++) {
    const start = balance
    const yearContrib = contribution * contribFreq

    // Compound the starting balance for one year
    balance = balance * Math.pow(1 + r / n, n)

    // Future value of contributions made this year (end-of-period annuity per compounding sub-period)
    if (contribution > 0 && contribFreq > 0) {
      const contribPerCompound = contribution * (contribFreq / n)
      // FV of regular contributions within the year at sub-period rate r/n
      const rSub = r / n
      const fvContrib = rSub === 0
        ? contribPerCompound * n
        : contribPerCompound * ((Math.pow(1 + rSub, n) - 1) / rSub)
      balance += fvContrib
    }

    const interest = balance - start - yearContrib
    totalContrib += yearContrib
    totalInterest += interest

    schedule.push({
      year: y,
      startBalance: start,
      contributions: yearContrib,
      interestEarned: interest,
      endBalance: balance,
      totalContributions: totalContrib,
      totalInterest,
    })
  }

  // Inflation-adjusted future value
  const realFV = inflationRate > 0
    ? balance / Math.pow(1 + inflationRate / 100, years)
    : undefined

  // Doubling time via Rule of 72 (exact: ln(2)/ln(1+r))
  const doublingTime = r > 0 ? Math.log(2) / Math.log(1 + APY) : Infinity

  return {
    futureValue: balance,
    totalContributions: totalContrib,
    totalInterest: totalInterest,
    effectiveAPY: APY * 100,
    doublingTime,
    schedule,
    realFutureValue: realFV,
  }
}

// ─── Formatting ───────────────────────────────────────────────────────────────

const $ = (n: number, dec = 0) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: dec, maximumFractionDigits: dec })
const $2 = (n: number) => $(n, 2)
const pct = (n: number, d = 3) => n.toFixed(d) + '%'

// ─── CSV ──────────────────────────────────────────────────────────────────────

function exportCSV(schedule: YearRow[], filename: string) {
  const hdr = ['Year','Start Balance','Contributions','Interest Earned','End Balance','Total Contributions','Total Interest']
  const rows = schedule.map(r => [
    r.year, r.startBalance.toFixed(2), r.contributions.toFixed(2),
    r.interestEarned.toFixed(2), r.endBalance.toFixed(2),
    r.totalContributions.toFixed(2), r.totalInterest.toFixed(2),
  ])
  const csv = [hdr, ...rows].map(r => r.join(',')).join('\n')
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })),
    download: filename,
  })
  a.click()
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const CARD: CSSProperties = {
  background: 'var(--bg-1)',
  border: '1px solid var(--line-strong)',
  borderRadius: 16,
  padding: '24px 28px',
}
const LABEL: CSSProperties = {
  display: 'block', marginBottom: 5, fontSize: 12,
  color: 'var(--fg-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em',
}
const INPUT_BOX: CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 8,
  background: 'rgba(0,0,0,0.35)', border: '1px solid var(--line-strong)',
  color: '#fff', fontSize: 15, boxSizing: 'border-box',
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

// ─── Metric Card ─────────────────────────────────────────────────────────────

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

// ─── Mini bar chart for growth visualization ──────────────────────────────────

function GrowthBar({ schedule }: { schedule: YearRow[] }) {
  if (schedule.length === 0) return null
  const max = schedule[schedule.length - 1].endBalance
  const step = Math.max(1, Math.floor(schedule.length / 20)) // show max 20 bars

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ fontSize: 11, color: 'var(--fg-3)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        Balance Growth
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 80 }}>
        {schedule.filter((_, i) => i % step === 0 || i === schedule.length - 1).map(row => {
          const h = Math.max(4, (row.endBalance / max) * 80)
          const contribH = Math.max(0, (row.totalContributions / max) * 80)
          return (
            <div key={row.year} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', position: 'relative', cursor: 'default' }}
              title={`Year ${row.year}: ${$(row.endBalance)}`}
            >
              <div style={{ height: h, borderRadius: '2px 2px 0 0', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <div style={{ height: Math.min(contribH, h), background: '#6366f1', opacity: 0.8 }} />
                <div style={{ flex: 1, background: '#10b981', opacity: 0.9 }} />
              </div>
            </div>
          )
        })}
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 6, flexWrap: 'wrap' }}>
        {[{ c: '#6366f1', l: 'Contributions' }, { c: '#10b981', l: 'Interest' }].map(({ c, l }) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--fg-3)' }}>
            <span style={{ width: 8, height: 8, background: c, borderRadius: 1, display: 'inline-block' }} />{l}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CompoundInterestCalculator() {

  // Core inputs
  const [principal,    setPrincipal]    = useState('10000')
  const [rate,         setRate]         = useState('7')
  const [years,        setYears]        = useState('20')
  const [freqKey,      setFreqKey]      = useState('12')

  // Contributions
  const [contribution, setContribution] = useState('200')
  const [contribFreq,  setContribFreq]  = useState('12')   // per year

  // Advanced
  const [inflation,    setInflation]    = useState('3')
  const [showAdv,      setShowAdv]      = useState(false)

  // UI
  const [showSchedule, setShowSchedule] = useState(false)

  // ── Compute ─────────────────────────────────────────────────────────────────
  const P       = parseFloat(principal)    || 0
  const r       = parseFloat(rate)         || 0
  const Y       = parseInt(years)          || 0
  const n       = parseInt(freqKey)        || 12
  const contrib = parseFloat(contribution) || 0
  const cFreq   = parseInt(contribFreq)    || 12
  const inf     = parseFloat(inflation)    || 0

  const result = useMemo<CompoundResult | null>(() => {
    if (P < 0 || Y <= 0) return null
    return calcCompound(P, r, Y, n, contrib, cFreq, inf)
  }, [P, r, Y, n, contrib, cFreq, inf])

  // ── Scenarios ────────────────────────────────────────────────────────────────
  const scenarios = useMemo(() => {
    if (!result || Y <= 0) return null
    return {
      base:      result,
      rateUp:    calcCompound(P, r + 2, Y, n, contrib, cFreq, 0),
      rateDown:  calcCompound(P, Math.max(0, r - 2), Y, n, contrib, cFreq, 0),
      noContrib: calcCompound(P, r, Y, n, 0, 0, 0),
      doubleC:   contrib > 0 ? calcCompound(P, r, Y, n, contrib * 2, cFreq, 0) : null,
    }
  }, [result, P, r, Y, n, contrib, cFreq])

  // ── Guidance ─────────────────────────────────────────────────────────────────
  const guidance = useMemo(() => {
    if (!result) return []
    const tips: string[] = []
    const interestPct = result.totalContributions > 0
      ? ((result.totalInterest / result.futureValue) * 100).toFixed(0) : '0'

    tips.push(
      `At ${pct(r, 1)} compounded ${FREQ[freqKey].label.toLowerCase()}, $${P.toLocaleString()} grows to ${$(result.futureValue)} in ${Y} years. ` +
      `${interestPct}% of your final balance (${$(result.totalInterest)}) comes from compound interest — money earning money.`
    )

    if (result.doublingTime < Infinity) {
      tips.push(`At ${pct(r, 1)}, money doubles every ${result.doublingTime.toFixed(1)} years (exact Rule of 72: 72 ÷ ${r} = ${(72 / r).toFixed(1)}). Starting earlier has exponential impact.`)
    }

    if (result.realFutureValue) {
      const loss = result.futureValue - result.realFutureValue
      tips.push(`Inflation at ${pct(inf, 1)}/year reduces your future ${$(result.futureValue)} to ${$(result.realFutureValue)} in today's purchasing power — a ${$(loss)} reduction. Consider inflation-adjusted targets.`)
    }

    if (contrib > 0 && scenarios?.noContrib) {
      const extra = result.futureValue - scenarios.noContrib.futureValue
      const totalAdded = contrib * cFreq * Y
      tips.push(`Your ${$(contrib)}/month contributions add ${$(totalAdded)} in deposits but generate ${$(extra - totalAdded)} of additional compounded growth — ${((extra / totalAdded - 1) * 100).toFixed(0)}% return on every dollar contributed.`)
    }

    return tips
  }, [result, r, freqKey, P, Y, contrib, cFreq, inf, scenarios])

  // ── Field helper ─────────────────────────────────────────────────────────────
  function Field({
    label, value, onChange, placeholder, min, max, step, hint,
  }: {
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
          style={INPUT_BOX} aria-label={label}
        />
        {hint && <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 3 }}>{hint}</div>}
      </div>
    )
  }

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── INPUTS ── */}
      <div style={CARD}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 16, marginBottom: 16 }}>
          <Field label="Principal / Starting Amount ($)" value={principal} onChange={setPrincipal} placeholder="10,000" min={0} step={500}
            hint="Initial lump sum" />
          <Field label="Annual Interest Rate (%)" value={rate} onChange={setRate} placeholder="7" min={0} max={100} step={0.1} />
          <Field label="Time Period (Years)"       value={years} onChange={setYears} placeholder="20" min={1} max={100} />
          <div>
            <label style={LABEL}>Compounding Frequency</label>
            <select value={freqKey} onChange={e => setFreqKey(e.target.value)} style={INPUT_BOX} aria-label="Compounding Frequency">
              {Object.entries(FREQ).map(([k, v]) => (
                <option key={k} value={k}>{v.label} ({k}×/yr)</option>
              ))}
            </select>
          </div>
          <Field label="Monthly Contribution ($)"    value={contribution} onChange={setContribution} placeholder="200" min={0} step={50}
            hint="Added each month (0 = lump sum only)" />
          <div>
            <label style={LABEL}>Contribution Frequency</label>
            <select value={contribFreq} onChange={e => setContribFreq(e.target.value)} style={INPUT_BOX} aria-label="Contribution Frequency">
              <option value="12">Monthly</option>
              <option value="26">Bi-weekly</option>
              <option value="52">Weekly</option>
              <option value="4">Quarterly</option>
              <option value="1">Annually</option>
            </select>
          </div>
        </div>

        {/* Advanced toggle */}
        <button onClick={() => setShowAdv(v => !v)} style={{ ...BTN_GHOST, marginBottom: showAdv ? 16 : 0 }} aria-expanded={showAdv}>
          {showAdv ? '▾' : '▸'} Advanced Options
        </button>

        {showAdv && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 16, padding: '16px 0 4px', borderTop: '1px solid var(--line-strong)' }}>
            <Field label="Inflation Rate (% / yr)"  value={inflation}  onChange={setInflation}  placeholder="3" min={0} max={20} step={0.1}
              hint="For inflation-adjusted (real) result" />
          </div>
        )}
      </div>

      {/* ── TIER 1: SUMMARY ── */}
      {result ? (
        <>
          {/* APY note */}
          <div style={{ fontSize: 12, color: 'var(--fg-3)', textAlign: 'center' }}>
            Effective APY: <strong style={{ color: '#c4b5fd' }}>{pct(result.effectiveAPY, 3)}</strong>
            {' '}(compounded {FREQ[freqKey].label.toLowerCase()})
            {' · '}
            Doubles every <strong style={{ color: '#c4b5fd' }}>{result.doublingTime.toFixed(1)} years</strong>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
            <MetricCard label="Future Value"         value={$(result.futureValue)}       color="#10b981" />
            <MetricCard label="Total Interest Earned" value={$(result.totalInterest)}     color="#f59e0b"
              sub={`${((result.totalInterest / result.futureValue) * 100).toFixed(0)}% of total`} />
            <MetricCard label="Total Deposited"      value={$(result.totalContributions)} color="#6366f1" />
            {result.realFutureValue && (
              <MetricCard label="Real Value (Inflation-adj.)" value={$(result.realFutureValue)} color="#e879f9"
                sub={`At ${pct(inf, 1)} inflation`} />
            )}
          </div>

          {/* Growth bar */}
          <div style={CARD}>
            <GrowthBar schedule={result.schedule} />
          </div>

          {/* ── TIER 2: YEAR-BY-YEAR SCHEDULE ── */}
          <div>
            <button
              onClick={() => setShowSchedule(v => !v)}
              style={{ width: '100%', textAlign: 'left', padding: '14px 20px', background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 12, color: '#c4b5fd', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
              aria-expanded={showSchedule}
            >
              {showSchedule ? '▾' : '▸'} Year-by-Year Growth Schedule
              <span style={{ fontWeight: 400, fontSize: 12, color: 'var(--fg-3)', marginLeft: 8 }}>({Y} years)</span>
            </button>

            {showSchedule && (
              <div style={{ ...CARD, padding: 0, overflow: 'hidden', marginTop: 4 }}>
                <div style={{ display: 'flex', gap: 10, padding: '14px 20px', borderBottom: '1px solid var(--line-strong)', flexWrap: 'wrap' }}>
                  <button onClick={() => exportCSV(result.schedule, 'compound-interest-schedule')} style={BTN_GHOST}>
                    ⬇ Export CSV
                  </button>
                  <button
                    onClick={async () => exportCalcPDF({
                      toolName: 'Compound Interest Calculator',
                      inputs: [
                        { label: 'Principal',     value: $(P) },
                        { label: 'Annual Rate',   value: pct(r, 1) },
                        { label: 'Compounding',   value: FREQ[freqKey].label },
                        { label: 'Years',         value: String(Y) },
                        { label: 'Monthly Contribution', value: $(contrib) },
                      ],
                      results: [
                        { label: 'Future Value',        value: $(result.futureValue),       highlight: true },
                        { label: 'Total Interest',      value: $(result.totalInterest) },
                        { label: 'Total Contributions', value: $(result.totalContributions) },
                        { label: 'Effective APY',       value: pct(result.effectiveAPY, 3) },
                      ],
                      tableHeaders: ['Year','Start','Contributions','Interest','End Balance','Total Interest'],
                      tableRows: result.schedule.map(r => ({
                        Year: r.year, Start: $(r.startBalance), Contributions: $(r.contributions),
                        Interest: $(r.interestEarned), 'End Balance': $(r.endBalance),
                        'Total Interest': $(r.totalInterest),
                      })),
                    })}
                    style={BTN_GHOST}
                  >
                    📄 Export PDF
                  </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }} aria-label="Compound interest year-by-year schedule">
                    <thead>
                      <tr>
                        {['Year','Start Balance','Contributions','Interest Earned','End Balance','Total Contrib.','Total Interest'].map(h => (
                          <th key={h} style={TH}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.schedule.map(row => (
                        <tr key={row.year} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ ...TD, color: 'var(--fg-3)' }}>{row.year}</td>
                          <td style={TD}>{$(row.startBalance)}</td>
                          <td style={{ ...TD, color: '#6366f1' }}>{contrib > 0 ? $(row.contributions) : '—'}</td>
                          <td style={{ ...TD, color: '#10b981' }}>{$(row.interestEarned)}</td>
                          <td style={{ ...TD, color: '#f59e0b', fontWeight: 600 }}>{$(row.endBalance)}</td>
                          <td style={TD}>{$(row.totalContributions)}</td>
                          <td style={TD}>{$(row.totalInterest)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr style={{ borderTop: '2px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.05)' }}>
                        <td style={{ ...TD, textAlign: 'left', fontWeight: 700, color: 'var(--fg-2)' }}>TOTAL</td>
                        <td style={TD} />
                        <td style={{ ...TD, fontWeight: 700, color: '#6366f1' }}>{$(result.totalContributions - P)}</td>
                        <td style={{ ...TD, fontWeight: 700, color: '#10b981' }}>{$(result.totalInterest)}</td>
                        <td style={{ ...TD, fontWeight: 900, color: '#f59e0b' }}>{$(result.futureValue)}</td>
                        <td style={{ ...TD, fontWeight: 700 }}>{$(result.totalContributions)}</td>
                        <td style={{ ...TD, fontWeight: 700 }}>{$(result.totalInterest)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* ── TIER 3: SCENARIO ANALYSIS ── */}
          {scenarios && (
            <div style={CARD}>
              <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                📊 Scenario Comparison
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr>
                      {['Scenario','Future Value','Total Interest','Total Deposited','Interest %'].map(h => (
                        <th key={h} style={{ ...TH, textAlign: h === 'Scenario' ? 'left' : 'right', padding: '10px 14px' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: `Base (${pct(r, 1)}, ${Y}yr)`,   res: scenarios.base,     hi: true  },
                      { label: `Rate +2% (${pct(r + 2, 1)})`,   res: scenarios.rateUp,   hi: false },
                      { label: `Rate −2% (${pct(Math.max(0, r - 2), 1)})`, res: scenarios.rateDown, hi: false },
                      { label: 'No Monthly Contributions',        res: scenarios.noContrib, hi: false },
                      ...(scenarios.doubleC ? [{ label: `2× Contributions ($${(contrib * 2).toFixed(0)}/mo)`, res: scenarios.doubleC, hi: false }] : []),
                    ].map(({ label, res, hi }) => res ? (
                      <tr key={label} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: hi ? 'rgba(139,92,246,0.08)' : 'transparent' }}>
                        <td style={{ ...TD, textAlign: 'left', color: hi ? '#c4b5fd' : 'var(--fg-2)', fontWeight: hi ? 700 : 400 }}>{hi ? '★ ' : ''}{label}</td>
                        <td style={{ ...TD, color: hi ? '#10b981' : 'var(--fg-2)', fontWeight: hi ? 700 : 400 }}>{$(res.futureValue)}</td>
                        <td style={TD}>{$(res.totalInterest)}</td>
                        <td style={TD}>{$(res.totalContributions)}</td>
                        <td style={TD}>{((res.totalInterest / res.futureValue) * 100).toFixed(0)}%</td>
                      </tr>
                    ) : null)}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── TIER 4: INTERPRETATION ── */}
          {guidance.length > 0 && (
            <div style={{ ...CARD, background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.2)' }}>
              <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: '#c4b5fd', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                💡 What Your Numbers Mean
              </h3>
              <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {guidance.map((tip, i) => (
                  <li key={i} style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <div style={{ ...CARD, textAlign: 'center', padding: '40px 20px', color: 'var(--fg-3)', fontSize: 14 }}>
          {Y <= 0 ? '⚠ Enter a time period (years) to calculate.' :
           P < 0  ? '⚠ Principal cannot be negative.' :
           'Enter your starting amount, rate, and time period above — results update instantly.'}
        </div>
      )}
    </div>
  )
}
