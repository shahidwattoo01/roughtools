'use client'
import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { exportCalcPDF } from '@/lib/calcPdf'

// ─── Types ────────────────────────────────────────────────────────────────────

interface AccumRow {
  year: number
  age: number
  startBalance: number
  contribution: number
  employerMatch: number
  growth: number
  endBalance: number
  totalContrib: number
}

interface WithdrawRow {
  year: number
  age: number
  startBalance: number
  withdrawal: number
  growth: number
  endBalance: number
}


// ─── Engines ─────────────────────────────────────────────────────────────────

function buildAccumulation(
  currentAge: number,
  retirementAge: number,
  currentSavings: number,
  monthlyContrib: number,
  employerMatchPct: number,    // % of contribution employer matches
  returnRate: number,          // % gross annual
  inflationRate: number,       // % for real return
): AccumRow[] {
  const realReturn = ((1 + returnRate / 100) / (1 + inflationRate / 100)) - 1
  const r = realReturn
  const schedule: AccumRow[] = []
  let balance = currentSavings
  let totalContrib = currentSavings

  for (let y = 1; y <= retirementAge - currentAge; y++) {
    const start = balance
    const annualContrib = monthlyContrib * 12
    const annualMatch   = annualContrib * (employerMatchPct / 100)
    const totalDeposit  = annualContrib + annualMatch
    // Growth on starting balance + mid-year deposit (simplified)
    const growth = start * r + totalDeposit * (r / 2)
    balance = start + totalDeposit + growth
    totalContrib += totalDeposit

    schedule.push({
      year: y,
      age: currentAge + y,
      startBalance: start,
      contribution: annualContrib,
      employerMatch: annualMatch,
      growth,
      endBalance: balance,
      totalContrib,
    })
  }
  return schedule
}

function buildWithdrawalSchedule(
  startBalance: number,
  withdrawalRate: number,  // % per year (e.g. 4)
  retirementReturn: number, // % gross in retirement (typically lower)
  retirementAge: number,
  maxAge: number,
  inflationRate: number,
): { schedule: WithdrawRow[]; depletionAge: number } {
  const schedule: WithdrawRow[] = []
  let balance = startBalance
  const annualWithdrawal = startBalance * (withdrawalRate / 100)
  const r = retirementReturn / 100
  const inf = inflationRate / 100
  let depletionAge = Infinity
  let withdrawal = annualWithdrawal

  for (let y = 1; y <= maxAge - retirementAge; y++) {
    const age = retirementAge + y
    const start = balance
    if (start <= 0) break

    const growth = start * r
    const ending = start + growth - withdrawal

    if (ending <= 0) {
      depletionAge = age
      schedule.push({ year: y, age, startBalance: start, withdrawal: Math.min(withdrawal, start + growth), growth, endBalance: 0 })
      break
    }

    balance = ending
    schedule.push({ year: y, age, startBalance: start, withdrawal, growth, endBalance: balance })

    // Inflation-adjust withdrawal each year
    withdrawal = withdrawal * (1 + inf)
  }

  return { schedule, depletionAge }
}

// ─── Formatting ───────────────────────────────────────────────────────────────

const $ = (n: number, dec = 0) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: dec, maximumFractionDigits: dec })
const pct = (n: number, d = 1) => n.toFixed(d) + '%'

// ─── CSV ──────────────────────────────────────────────────────────────────────

function exportCSV(rows: AccumRow[], filename: string) {
  const hdr = ['Year','Age','Start Balance','Your Contribution','Employer Match','Growth','End Balance','Total Contributed']
  const data = rows.map(r => [r.year, r.age, r.startBalance.toFixed(0), r.contribution.toFixed(0), r.employerMatch.toFixed(0), r.growth.toFixed(0), r.endBalance.toFixed(0), r.totalContrib.toFixed(0)])
  const csv = [hdr, ...data].map(r => r.join(',')).join('\n')
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
  background: 'var(--bg-2)', border: '1px solid var(--line-strong)',
  color: 'var(--fg)', fontSize: 15, boxSizing: 'border-box',
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
  padding: '6px 12px', fontSize: 12, textAlign: 'right', color: 'var(--fg-2)', whiteSpace: 'nowrap',
}

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

// ─── Main Component ───────────────────────────────────────────────────────────

export default function RetirementCalculatorClient() {

  // Core inputs
  const [currentAge,      setCurrentAge]      = useState('30')
  const [retirementAge,   setRetirementAge]   = useState('65')
  const [currentSavings,  setCurrentSavings]  = useState('25000')
  const [monthlyContrib,  setMonthlyContrib]  = useState('500')
  const [returnRate,      setReturnRate]       = useState('7')

  // Advanced
  const [employerMatch,   setEmployerMatch]   = useState('50')     // % of contribution
  const [inflationRate,   setInflationRate]   = useState('3')
  const [retirReturn,     setRetirReturn]     = useState('5')      // lower in retirement
  const [withdrawalRate,  setWithdrawalRate]  = useState('4')      // % per year
  const [lifeExpectancy,  setLifeExpectancy]  = useState('90')
  const [showAdv,         setShowAdv]         = useState(false)

  // UI
  const [showAccum,       setShowAccum]       = useState(false)
  const [showWithdraw,    setShowWithdraw]    = useState(false)

  // ── Derived ──────────────────────────────────────────────────────────────────
  const CA   = parseInt(currentAge)     || 30
  const RA   = parseInt(retirementAge)  || 65
  const CS   = parseFloat(currentSavings)  || 0
  const MC   = parseFloat(monthlyContrib)  || 0
  const RR   = parseFloat(returnRate)      || 0
  const EM   = parseFloat(employerMatch)   || 0
  const INF  = parseFloat(inflationRate)   || 0
  const RRET = parseFloat(retirReturn)     || 0
  const WR   = parseFloat(withdrawalRate)  || 4
  const LE   = parseInt(lifeExpectancy)    || 90

  const valid = CA > 0 && RA > CA && CS >= 0 && MC >= 0

  // ── Accumulation schedule ─────────────────────────────────────────────────────
  const accumSchedule = useMemo<AccumRow[]>(() => {
    if (!valid) return []
    return buildAccumulation(CA, RA, CS, MC, EM, RR, INF)
  }, [CA, RA, CS, MC, EM, RR, INF, valid])

  const totalAtRetirement = accumSchedule[accumSchedule.length - 1]?.endBalance ?? 0
  const totalContrib      = accumSchedule[accumSchedule.length - 1]?.totalContrib ?? CS
  const totalGrowth       = totalAtRetirement - totalContrib
  const totalMatch        = accumSchedule.reduce((s, r) => s + r.employerMatch, 0)

  // ── Withdrawal schedule ───────────────────────────────────────────────────────
  const { schedule: withdrawSchedule, depletionAge } = useMemo(() => {
    if (totalAtRetirement <= 0) return { schedule: [], depletionAge: Infinity }
    return buildWithdrawalSchedule(totalAtRetirement, WR, RRET, RA, LE, INF)
  }, [totalAtRetirement, WR, RRET, RA, LE, INF])

  const monthlyIncome = (totalAtRetirement * WR / 100) / 12

  // ── Scenarios ─────────────────────────────────────────────────────────────────
  const scenarios = useMemo(() => {
    if (!valid) return null
    const base      = buildAccumulation(CA, RA, CS, MC, EM, RR, INF)
    const rateUp    = buildAccumulation(CA, RA, CS, MC, EM, RR + 1, INF)
    const rateDown  = buildAccumulation(CA, RA, CS, MC, EM, Math.max(1, RR - 1), INF)
    const earlyRet  = RA > CA + 5 ? buildAccumulation(CA, RA - 5, CS, MC, EM, RR, INF) : null
    const moreContrib = buildAccumulation(CA, RA, CS, MC + 200, EM, RR, INF)

    const bal = (s: AccumRow[]) => s[s.length - 1]?.endBalance ?? 0
    return {
      base: bal(base), rateUp: bal(rateUp), rateDown: bal(rateDown),
      earlyRet: earlyRet ? { balance: bal(earlyRet), age: RA - 5 } : null,
      moreContrib: bal(moreContrib),
    }
  }, [CA, RA, CS, MC, EM, RR, INF, valid])

  // ── Guidance ─────────────────────────────────────────────────────────────────
  const guidance = useMemo(() => {
    if (!valid || totalAtRetirement <= 0) return []
    const tips: string[] = []

    tips.push(
      `You are on track to retire with ${$(totalAtRetirement)} at age ${RA}. ` +
      `At a ${pct(WR)} withdrawal rate, that generates ${$(monthlyIncome)}/month (inflation-adjusted) in retirement income.`
    )

    if (depletionAge < Infinity) {
      tips.push(`At ${pct(WR)} withdrawal + ${pct(INF)} inflation, your portfolio is projected to last until age ${depletionAge}. ` +
        (depletionAge < LE ? `⚠ This is before your life expectancy of ${LE} — consider a lower withdrawal rate or larger portfolio.` :
        `This covers your full life expectancy (${LE}).`))
    } else {
      tips.push(`At ${pct(WR)} withdrawal, your portfolio is projected to last indefinitely through age ${LE} — a sustainable withdrawal rate.`)
    }

    if (EM > 0) {
      tips.push(`Your employer match contributes ${$(totalMatch)} — free money that accounts for ${((totalMatch / (totalContrib - CS)) * 100).toFixed(0)}% of all your working contributions. Always contribute at least enough to capture the full match.`)
    }

    const _savingsRate = (MC * 12 / Math.max(1, MC * 12 / 0.15)) * 100
    tips.push(`Saving ${$(MC)}/month means ${((MC / Math.max(1, MC / 0.15)) * 100 < 15 ? 'you may be below' : 'you are at or above')} the recommended 15% of gross income savings rate for retirement. ` +
      `Even an additional $100/month now can add ${$((scenarios?.moreContrib ?? 0) - (scenarios?.base ?? 0))} to your retirement balance.`)

    return tips
  }, [valid, totalAtRetirement, RA, WR, monthlyIncome, depletionAge, LE, INF, EM, totalMatch, totalContrib, CS, MC, scenarios])

  // ── Field helper ─────────────────────────────────────────────────────────────
  function Field({ label, value, onChange, placeholder, min, max, step, hint }: {
    label: string; value: string; onChange: (v: string) => void
    placeholder?: string; min?: number; max?: number; step?: number; hint?: string
  }) {
    return (
      <div>
        <label style={LABEL}>{label}</label>
        <input type="number" value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder} min={min} max={max} step={step}
          style={INPUT_BOX} aria-label={label} />
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
          <Field label="Current Age"               value={currentAge}     onChange={setCurrentAge}     placeholder="30"    min={16} max={80} />
          <Field label="Target Retirement Age"      value={retirementAge}  onChange={setRetirementAge}  placeholder="65"    min={17} max={90} />
          <Field label="Current Retirement Savings ($)" value={currentSavings} onChange={setCurrentSavings} placeholder="25,000" min={0} step={1000} />
          <Field label="Monthly Contribution ($)"   value={monthlyContrib} onChange={setMonthlyContrib} placeholder="500"   min={0}  step={50}
            hint="Your 401k / IRA contributions" />
          <Field label="Expected Annual Return (%)" value={returnRate}     onChange={setReturnRate}     placeholder="7"     min={0}  max={20} step={0.5}
            hint="Long-term (7% = historical S&P 500)" />
        </div>

        <button onClick={() => setShowAdv(v => !v)} style={{ ...BTN_GHOST, marginBottom: showAdv ? 16 : 0 }} aria-expanded={showAdv}>
          {showAdv ? '▾' : '▸'} Advanced Options
        </button>

        {showAdv && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 16, padding: '16px 0 4px', borderTop: '1px solid var(--line-strong)' }}>
            <Field label="Employer Match (% of your contribution)" value={employerMatch} onChange={setEmployerMatch}
              placeholder="50" min={0} max={200} step={5}
              hint="50% = employer matches 50¢ per $1 you contribute" />
            <Field label="Inflation Rate (% / yr)"   value={inflationRate}  onChange={setInflationRate}  placeholder="3"  min={0} max={15} step={0.1} />
            <Field label="Post-Retirement Return (%)" value={retirReturn}   onChange={setRetirReturn}    placeholder="5"  min={0} max={15} step={0.5}
              hint="Conservative return after retirement" />
            <Field label="Withdrawal Rate (% / yr)"  value={withdrawalRate} onChange={setWithdrawalRate} placeholder="4"  min={0.5} max={15} step={0.1}
              hint="4% is the standard 'safe withdrawal' rate" />
            <Field label="Life Expectancy (age)"     value={lifeExpectancy} onChange={setLifeExpectancy} placeholder="90" min={RA + 1} max={120} />
          </div>
        )}

        {!valid && (
          <div style={{ marginTop: 12, fontSize: 12, color: '#f87171' }}>
            ⚠ Retirement age must be greater than current age.
          </div>
        )}
      </div>

      {/* ── TIER 1: SUMMARY ── */}
      {valid && totalAtRetirement > 0 && (
        <>
          {/* Hero balance */}
          <div style={{ ...CARD, textAlign: 'center', background: 'rgba(16,185,129,0.06)', borderColor: 'rgba(16,185,129,0.25)' }}>
            <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>
              Projected Retirement Balance at Age {RA}
            </div>
            <div style={{ fontSize: 48, fontWeight: 900, color: '#10b981', lineHeight: 1 }}>
              {$(totalAtRetirement)}
            </div>
            <div style={{ fontSize: 15, color: '#a5b4fc', marginTop: 10 }}>
              {$(monthlyIncome)} / month income ({pct(WR)} withdrawal rate)
            </div>
            <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 4 }}>
              Portfolio {depletionAge < Infinity ? `depletes at age ${depletionAge}` : `sustains through age ${LE}`}
            </div>
          </div>

          {/* Metric grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
            <MetricCard label="Your Contributions" value={$(totalContrib - totalMatch - CS)} color="#6366f1"
              sub={`${RA - CA} years of saving`} />
            <MetricCard label="Employer Match"      value={$(totalMatch)}                    color="#38bdf8"
              sub="Free money" />
            <MetricCard label="Investment Growth"   value={$(totalGrowth)}                   color="#10b981"
              sub={`${((totalGrowth / totalAtRetirement) * 100).toFixed(0)}% of total`} />
            <MetricCard label="Monthly Income"      value={$(monthlyIncome)}                  color="#f59e0b"
              sub={`${pct(WR)} rule`} />
            {depletionAge < Infinity && (
              <MetricCard label="Portfolio Lasts Until" value={`Age ${depletionAge}`}         color={depletionAge < LE ? '#f87171' : '#10b981'}
                sub={depletionAge < LE ? '⚠ Below life expectancy' : '✓ Covers life expectancy'} />
            )}
          </div>

          {/* Contribution breakdown bar */}
          <div style={{ ...CARD, padding: '16px 20px' }}>
            <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Retirement Balance Breakdown
            </div>
            <div style={{ height: 20, borderRadius: 10, overflow: 'hidden', display: 'flex' }}>
              <div style={{ flex: CS, background: '#4b5563' }} title={`Starting savings: ${$(CS)}`} />
              <div style={{ flex: totalContrib - totalMatch - CS, background: '#6366f1' }} title={`Your contributions: ${$(totalContrib - totalMatch - CS)}`} />
              <div style={{ flex: totalMatch, background: '#38bdf8' }} title={`Employer match: ${$(totalMatch)}`} />
              <div style={{ flex: totalGrowth, background: '#10b981' }} title={`Growth: ${$(totalGrowth)}`} />
            </div>
            <div style={{ display: 'flex', gap: 14, marginTop: 8, flexWrap: 'wrap' }}>
              {[
                { l: 'Starting', v: CS,                              c: '#4b5563' },
                { l: 'Your Contrib.', v: totalContrib - totalMatch - CS, c: '#6366f1' },
                { l: 'Employer Match', v: totalMatch,                c: '#38bdf8' },
                { l: 'Growth', v: totalGrowth,                       c: '#10b981' },
              ].map(({ l, v, c }) => v > 0 ? (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11 }}>
                  <span style={{ width: 8, height: 8, background: c, borderRadius: 1, display: 'inline-block' }} />
                  <span style={{ color: 'var(--fg-3)' }}>{l}:</span>
                  <span style={{ color: 'var(--fg-2)', fontWeight: 600 }}>{$(v)}</span>
                </div>
              ) : null)}
            </div>
          </div>

          {/* ── TIER 2: ACCUMULATION SCHEDULE ── */}
          <div>
            <button
              onClick={() => setShowAccum(v => !v)}
              style={{ width: '100%', textAlign: 'left', padding: '14px 20px', background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 12, color: 'var(--brand-2)', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
              aria-expanded={showAccum}
            >
              {showAccum ? '▾' : '▸'} Year-by-Year Accumulation Schedule
              <span style={{ fontWeight: 400, fontSize: 12, color: 'var(--fg-3)', marginLeft: 8 }}>({RA - CA} years)</span>
            </button>

            {showAccum && (
              <div style={{ ...CARD, padding: 0, overflow: 'hidden', marginTop: 4 }}>
                <div style={{ display: 'flex', gap: 10, padding: '14px 20px', borderBottom: '1px solid var(--line-strong)', flexWrap: 'wrap' }}>
                  <button onClick={() => exportCSV(accumSchedule, 'retirement-schedule')} style={BTN_GHOST}>⬇ Export CSV</button>
                  <button
                    onClick={async () => exportCalcPDF({
                      toolName: 'Retirement Calculator',
                      inputs: [
                        { label: 'Current Age',        value: String(CA) },
                        { label: 'Retirement Age',     value: String(RA) },
                        { label: 'Current Savings',    value: $(CS) },
                        { label: 'Monthly Contribution', value: $(MC) },
                        { label: 'Annual Return',      value: pct(RR) },
                        { label: 'Employer Match',     value: pct(EM) },
                        { label: 'Withdrawal Rate',    value: pct(WR) },
                      ],
                      results: [
                        { label: 'Retirement Balance',   value: $(totalAtRetirement), highlight: true },
                        { label: 'Monthly Income',       value: $(monthlyIncome),     highlight: true },
                        { label: 'Total Contributions',  value: $(totalContrib) },
                        { label: 'Investment Growth',    value: $(totalGrowth) },
                        { label: 'Employer Match Total', value: $(totalMatch) },
                      ],
                      tableHeaders: ['Year','Age','Start','Your Contribution','Employer Match','Growth','End Balance'],
                      tableRows: accumSchedule.map(r => ({
                        Year: r.year, Age: r.age, Start: $(r.startBalance),
                        'Your Contribution': $(r.contribution),
                        'Employer Match': $(r.employerMatch),
                        Growth: $(r.growth), 'End Balance': $(r.endBalance),
                      })),
                    })}
                    style={BTN_GHOST}
                  >
                    📄 Export PDF
                  </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }} aria-label="Retirement accumulation schedule">
                    <thead>
                      <tr>
                        {['Year','Age','Start Balance','Your Contribution','Employer Match','Growth','End Balance','Total Contributed'].map(h => (
                          <th key={h} style={TH}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {accumSchedule.map(row => (
                        <tr key={row.year} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ ...TD, color: 'var(--fg-3)' }}>{row.year}</td>
                          <td style={{ ...TD, color: 'var(--fg-3)' }}>{row.age}</td>
                          <td style={TD}>{$(row.startBalance)}</td>
                          <td style={{ ...TD, color: '#6366f1' }}>{$(row.contribution)}</td>
                          <td style={{ ...TD, color: '#38bdf8' }}>{row.employerMatch > 0 ? $(row.employerMatch) : '—'}</td>
                          <td style={{ ...TD, color: '#10b981' }}>{$(row.growth)}</td>
                          <td style={{ ...TD, color: '#f59e0b', fontWeight: 600 }}>{$(row.endBalance)}</td>
                          <td style={TD}>{$(row.totalContrib)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr style={{ borderTop: '2px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.05)' }}>
                        <td colSpan={3} style={{ ...TD, textAlign: 'left', fontWeight: 700, color: 'var(--fg-2)' }}>TOTALS</td>
                        <td style={{ ...TD, fontWeight: 700, color: '#6366f1' }}>{$(accumSchedule.reduce((s, r) => s + r.contribution, 0))}</td>
                        <td style={{ ...TD, fontWeight: 700, color: '#38bdf8' }}>{$(totalMatch)}</td>
                        <td style={{ ...TD, fontWeight: 700, color: '#10b981' }}>{$(totalGrowth)}</td>
                        <td style={{ ...TD, fontWeight: 900, color: '#f59e0b' }}>{$(totalAtRetirement)}</td>
                        <td style={{ ...TD, fontWeight: 700 }}>{$(totalContrib)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* ── WITHDRAWAL SCHEDULE ── */}
          {withdrawSchedule.length > 0 && (
            <div>
              <button
                onClick={() => setShowWithdraw(v => !v)}
                style={{ width: '100%', textAlign: 'left', padding: '14px 20px', background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 12, color: 'var(--brand-2)', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
                aria-expanded={showWithdraw}
              >
                {showWithdraw ? '▾' : '▸'} Retirement Withdrawal Schedule
                <span style={{ fontWeight: 400, fontSize: 12, color: 'var(--fg-3)', marginLeft: 8 }}>
                  ({pct(WR)} rule · {depletionAge < Infinity ? `depletes age ${depletionAge}` : `sustains to age ${LE}`})
                </span>
              </button>

              {showWithdraw && (
                <div style={{ ...CARD, padding: 0, overflow: 'hidden', marginTop: 4 }}>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }} aria-label="Retirement withdrawal schedule">
                      <thead>
                        <tr>
                          {['Year','Age','Start Balance','Withdrawal','Growth','End Balance'].map(h => (
                            <th key={h} style={TH}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {withdrawSchedule.map(row => (
                          <tr key={row.year} style={{
                            borderBottom: '1px solid rgba(255,255,255,0.04)',
                            background: row.endBalance <= 0 ? 'rgba(248,113,113,0.06)' : 'transparent',
                          }}>
                            <td style={{ ...TD, color: 'var(--fg-3)' }}>{row.year}</td>
                            <td style={{ ...TD, color: 'var(--fg-3)' }}>{row.age}</td>
                            <td style={TD}>{$(row.startBalance)}</td>
                            <td style={{ ...TD, color: '#f87171' }}>{$(row.withdrawal)}</td>
                            <td style={{ ...TD, color: '#10b981' }}>{$(row.growth)}</td>
                            <td style={{ ...TD, color: row.endBalance <= 0 ? '#f87171' : '#f59e0b', fontWeight: 600 }}>
                              {row.endBalance <= 0 ? '— Depleted —' : $(row.endBalance)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── TIER 3: SCENARIOS ── */}
          {scenarios && (
            <div style={CARD}>
              <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                📊 Scenario Comparison
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr>
                      {['Scenario','Balance at Retirement','Monthly Income','vs. Base'].map(h => (
                        <th key={h} style={{ ...TH, textAlign: h === 'Scenario' ? 'left' : 'right', padding: '10px 14px' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: `Base (${pct(RR)}, retire ${RA})`,      bal: scenarios.base,       hi: true  },
                      { label: `Return +1% (${pct(RR + 1)})`,          bal: scenarios.rateUp,     hi: false },
                      { label: `Return −1% (${pct(Math.max(1, RR - 1))})`, bal: scenarios.rateDown, hi: false },
                      ...(scenarios.earlyRet ? [{ label: `Retire 5yr Earlier (age ${scenarios.earlyRet.age})`, bal: scenarios.earlyRet.balance, hi: false }] : []),
                      { label: `+$200/mo Contribution ($${(MC + 200).toFixed(0)}/mo)`, bal: scenarios.moreContrib, hi: false },
                    ].map(({ label, bal, hi }) => (
                      <tr key={label} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: hi ? 'rgba(139,92,246,0.08)' : 'transparent' }}>
                        <td style={{ ...TD, textAlign: 'left', color: hi ? 'var(--brand-2)' : 'var(--fg-2)', fontWeight: hi ? 700 : 400 }}>{hi ? '★ ' : ''}{label}</td>
                        <td style={{ ...TD, color: hi ? '#10b981' : 'var(--fg-2)', fontWeight: hi ? 700 : 400 }}>{$(bal)}</td>
                        <td style={TD}>{$((bal * WR / 100) / 12)}</td>
                        <td style={{ ...TD, color: bal > scenarios.base ? '#10b981' : bal < scenarios.base ? '#f87171' : 'var(--fg-3)' }}>
                          {hi ? '—' : (bal >= scenarios.base ? '+' : '') + $(bal - scenarios.base)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── TIER 4: GUIDANCE ── */}
          {guidance.length > 0 && (
            <div style={{ ...CARD, background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.2)' }}>
              <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--brand-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
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
      )}

      {!valid && (
        <div style={{ ...CARD, textAlign: 'center', padding: '40px 20px', color: 'var(--fg-3)', fontSize: 14 }}>
          Enter your age, retirement age, and savings details above — results update instantly.
        </div>
      )}
    </div>
  )
}
