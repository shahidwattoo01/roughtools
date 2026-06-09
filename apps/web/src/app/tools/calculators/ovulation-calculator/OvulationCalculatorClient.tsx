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
  color: 'var(--fg-3)', textAlign: 'left', background: 'rgba(99,102,241,0.1)',
  whiteSpace: 'nowrap',
}
const TD: CSSProperties = { padding: '8px 12px', fontSize: 12, textAlign: 'left', color: 'var(--fg-2)', whiteSpace: 'nowrap' }

// ─── MetricCard ───────────────────────────────────────────────────────────────

function MetricCard({ label, value, sub, color = '#6366f1' }: {
  label: string; value: string; sub?: string; color?: string
}) {
  return (
    <div style={{ padding: '18px 14px', background: 'rgba(0,0,0,0.3)', borderRadius: 12, textAlign: 'center' }}>
      <div style={{ fontSize: 20, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

// ─── Date helpers ─────────────────────────────────────────────────────────────

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function fmtDate(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function fmtShort(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function diffDays(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / 86400000)
}

// ─── Calculation ──────────────────────────────────────────────────────────────

interface CycleResult {
  ovulationDate: Date
  fertileStart: Date
  fertileEnd: Date
  nextPeriod: Date
  daysUntilOvulation: number
  daysUntilFertileWindow: number
  daysUntilNextPeriod: number
}

function calcCycle(lmp: Date, cycleLen: number, lutealPhase: number): CycleResult {
  const ovulationDate = addDays(lmp, cycleLen - lutealPhase)
  const fertileStart  = addDays(ovulationDate, -5)
  const fertileEnd    = addDays(ovulationDate, 1)
  const nextPeriod    = addDays(lmp, cycleLen)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return {
    ovulationDate, fertileStart, fertileEnd, nextPeriod,
    daysUntilOvulation:     diffDays(today, ovulationDate),
    daysUntilFertileWindow: diffDays(today, fertileStart),
    daysUntilNextPeriod:    diffDays(today, nextPeriod),
  }
}

interface MonthCycle {
  cycleNum: number
  periodStart: Date
  fertileStart: Date
  fertileEnd: Date
  ovulationDate: Date
  nextPeriod: Date
}

function calcMonths(lmp: Date, cycleLen: number, lutealPhase: number, count: number): MonthCycle[] {
  return Array.from({ length: count }, (_, i) => {
    const periodStart = addDays(lmp, i * cycleLen)
    const r = calcCycle(periodStart, cycleLen, lutealPhase)
    return { cycleNum: i + 1, periodStart, fertileStart: r.fertileStart, fertileEnd: r.fertileEnd, ovulationDate: r.ovulationDate, nextPeriod: r.nextPeriod }
  })
}

function daysLabel(days: number): string {
  if (days === 0) return 'Today'
  if (days < 0)  return `${Math.abs(days)} days ago`
  return `in ${days} days`
}

// ─── Field component ──────────────────────────────────────────────────────────

function Field({ label, value, onChange, type = 'number', min, max, hint }: {
  label: string; value: string; onChange: (v: string) => void
  type?: string; min?: number; max?: number; hint?: string
}) {
  return (
    <div>
      <label style={LABEL}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        min={min} max={max} style={INPUT_BOX} aria-label={label} />
      {hint && <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 3 }}>{hint}</div>}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function OvulationCalculatorClient() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = today.toISOString().slice(0, 10)

  const [lmpStr,      setLmpStr]      = useState(todayStr)
  const [cycleLen,    setCycleLen]    = useState('28')
  const [lutealPhase, setLutealPhase] = useState('14')
  const [history1,    setHistory1]    = useState('')
  const [history2,    setHistory2]    = useState('')
  const [history3,    setHistory3]    = useState('')
  const [showGuide,   setShowGuide]   = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  const lmp = useMemo(() => {
    const d = new Date(lmpStr + 'T00:00:00')
    return isNaN(d.getTime()) ? today : d
  }, [lmpStr])

  const cl = Math.min(Math.max(parseInt(cycleLen)    || 28, 20), 40)
  const lp = Math.min(Math.max(parseInt(lutealPhase) || 14, 10), 16)

  const avgCycle = useMemo(() => {
    const vals = [history1, history2, history3].map(Number).filter(n => n >= 20 && n <= 40)
    if (!vals.length) return null
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
  }, [history1, history2, history3])

  const effectiveCl = avgCycle ?? cl
  const result      = useMemo(() => calcCycle(lmp, effectiveCl, lp), [lmp, effectiveCl, lp])
  const calendar    = useMemo(() => calcMonths(lmp, effectiveCl, lp, 3), [lmp, effectiveCl, lp])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── DISCLAIMER ── */}
      <div style={{ ...CARD, background: 'rgba(251,191,36,0.06)', borderColor: 'rgba(251,191,36,0.25)', padding: '14px 18px' }}>
        <div style={{ fontSize: 12, color: '#fde68a', fontWeight: 600, lineHeight: 1.7 }}>
          For educational purposes only. This calculator provides estimates based on average cycle patterns.
          Individual cycles vary significantly. Consult a qualified healthcare provider for fertility treatment, contraception advice, or any medical decisions.
        </div>
      </div>

      {/* ── INPUTS ── */}
      <div style={CARD}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
          <Field label="First Day of Last Period" value={lmpStr} onChange={setLmpStr} type="date"
            hint="LMP — last menstrual period start date" />
          <Field label="Cycle Length (days)" value={cycleLen} onChange={setCycleLen} min={20} max={40}
            hint="Typical range: 21–35 days (default 28)" />
          <Field label="Luteal Phase (days)" value={lutealPhase} onChange={setLutealPhase} min={10} max={16}
            hint="Post-ovulation phase (default 14)" />
        </div>

        <button onClick={() => setShowHistory(v => !v)} style={{ ...BTN_GHOST, marginTop: 16 }} aria-expanded={showHistory}>
          {showHistory ? '▾' : '▸'} Cycle History (Improve Accuracy)
        </button>

        {showHistory && (
          <div style={{ paddingTop: 16, borderTop: '1px solid var(--line-strong)', marginTop: 12 }}>
            <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 12 }}>
              Enter your last 3 cycle lengths to compute a personalized average for better predictions.
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              <Field label="Cycle 1 (days)" value={history1} onChange={setHistory1} min={20} max={40} />
              <Field label="Cycle 2 (days)" value={history2} onChange={setHistory2} min={20} max={40} />
              <Field label="Cycle 3 (days)" value={history3} onChange={setHistory3} min={20} max={40} />
            </div>
            {avgCycle && (
              <div style={{ marginTop: 10, fontSize: 13, color: '#6ee7b7', fontWeight: 600 }}>
                Average cycle: {avgCycle} days — used for all predictions below.
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── KEY METRICS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
        <MetricCard label="Ovulation Date"       value={fmtShort(result.ovulationDate)}  color="#e879f9"
          sub={daysLabel(result.daysUntilOvulation)} />
        <MetricCard label="Fertile Window Start" value={fmtShort(result.fertileStart)}   color="#6366f1"
          sub={daysLabel(result.daysUntilFertileWindow)} />
        <MetricCard label="Fertile Window End"   value={fmtShort(result.fertileEnd)}     color="#6366f1"
          sub="7-day window total" />
        <MetricCard label="Next Period"          value={fmtShort(result.nextPeriod)}     color="#38bdf8"
          sub={daysLabel(result.daysUntilNextPeriod)} />
        <MetricCard label="Cycle Length Used"    value={`${effectiveCl} days`}          color="#10b981"
          sub={avgCycle ? 'History average' : 'Manual input'} />
      </div>

      {/* ── FERTILE WINDOW BREAKDOWN ── */}
      <div style={{ ...CARD, padding: '16px 20px' }}>
        <h3 style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          Fertile Window Breakdown
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.8 }}>
          <div>Ovulation day = LMP + (cycle_length − luteal_phase) = LMP + ({effectiveCl} − {lp}) = day <strong style={{ color: '#e879f9' }}>{effectiveCl - lp}</strong> of cycle</div>
          <div>Fertile start = Ovulation − 5 days <span style={{ color: 'var(--fg-3)' }}>(sperm survive up to 5 days)</span></div>
          <div>Fertile end = Ovulation + 1 day <span style={{ color: 'var(--fg-3)' }}>(egg viable ~12–24 hours after ovulation)</span></div>
          <div style={{ color: '#c4b5fd', marginTop: 4 }}>
            Peak fertility: {fmtDate(addDays(result.ovulationDate, -2))} – {fmtDate(addDays(result.ovulationDate, -1))}
            <span style={{ color: 'var(--fg-3)', marginLeft: 8, fontSize: 12 }}>(2 days before ovulation)</span>
          </div>
        </div>
      </div>

      {/* ── 3-MONTH CALENDAR ── */}
      <div style={CARD}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            3-Month Cycle Calendar
          </h3>
          <button
            onClick={async () => exportCalcPDF({
              toolName: 'Ovulation Calculator',
              inputs: [
                { label: 'Last Menstrual Period', value: fmtDate(lmp) },
                { label: 'Cycle Length', value: `${effectiveCl} days` },
                { label: 'Luteal Phase', value: `${lp} days` },
              ],
              results: [
                { label: 'Ovulation Date',       value: fmtDate(result.ovulationDate), highlight: true },
                { label: 'Fertile Window',        value: `${fmtDate(result.fertileStart)} – ${fmtDate(result.fertileEnd)}` },
                { label: 'Next Period',           value: fmtDate(result.nextPeriod) },
                { label: 'Days Until Ovulation',  value: daysLabel(result.daysUntilOvulation) },
              ],
            })}
            style={BTN_GHOST}
          >
            Export PDF
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr>
                {['Cycle', 'Period Start', 'Fertile Window', 'Ovulation', 'Next Period'].map(h => (
                  <th key={h} style={TH}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {calendar.map(cycle => (
                <tr key={cycle.cycleNum} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ ...TD, color: '#c4b5fd', fontWeight: 700 }}>Cycle {cycle.cycleNum}</td>
                  <td style={{ ...TD, color: '#38bdf8' }}>{fmtDate(cycle.periodStart)}</td>
                  <td style={{ ...TD, color: '#6366f1' }}>{fmtShort(cycle.fertileStart)} – {fmtShort(cycle.fertileEnd)}</td>
                  <td style={{ ...TD, color: '#e879f9', fontWeight: 600 }}>{fmtDate(cycle.ovulationDate)}</td>
                  <td style={TD}>{fmtDate(cycle.nextPeriod)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── BBT & CM GUIDE ── */}
      <div>
        <button onClick={() => setShowGuide(v => !v)} style={BTN_GHOST} aria-expanded={showGuide}>
          {showGuide ? '▾' : '▸'} BBT & Cervical Mucus Reference Guide
        </button>

        {showGuide && (
          <div style={{ ...CARD, marginTop: 8 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
              <div>
                <h4 style={{ margin: '0 0 10px', fontSize: 13, color: '#f59e0b', fontWeight: 700 }}>
                  Basal Body Temperature (BBT)
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[
                    { phase: 'Menstruation',   bbt: '36.1–36.4°C / 97.0–97.5°F', note: 'Lowest temperatures of cycle' },
                    { phase: 'Follicular',     bbt: '36.2–36.5°C / 97.2–97.7°F', note: 'Gradual rise toward ovulation' },
                    { phase: 'Ovulation',      bbt: 'Dip then sustained rise',    note: 'Rise of 0.2–0.5°C confirms ovulation' },
                    { phase: 'Luteal',         bbt: '36.6–37.1°C / 97.9–98.8°F', note: 'Stays elevated until period' },
                  ].map(row => (
                    <div key={row.phase} style={{ padding: '8px 12px', background: 'rgba(0,0,0,0.2)', borderRadius: 8 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-2)' }}>{row.phase}</div>
                      <div style={{ fontSize: 11, color: '#f59e0b' }}>{row.bbt}</div>
                      <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>{row.note}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 style={{ margin: '0 0 10px', fontSize: 13, color: '#6366f1', fontWeight: 700 }}>
                  Cervical Mucus (CM)
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[
                    { phase: 'Post-period',         cm: 'Dry / absent',              fertility: 'Very low' },
                    { phase: 'Pre-ovulation',        cm: 'Sticky, cloudy, white',     fertility: 'Low' },
                    { phase: 'Approaching ovulation',cm: 'Creamy, lotion-like',       fertility: 'Moderate' },
                    { phase: 'Peak fertility',       cm: 'Clear, stretchy, egg-white', fertility: 'Highest' },
                    { phase: 'Post-ovulation',       cm: 'Thickens, then disappears', fertility: 'Low' },
                  ].map(row => (
                    <div key={row.phase} style={{ padding: '8px 12px', background: 'rgba(0,0,0,0.2)', borderRadius: 8 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-2)' }}>{row.phase}</div>
                      <div style={{ fontSize: 11, color: '#6366f1' }}>{row.cm}</div>
                      <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>Fertility: <strong>{row.fertility}</strong></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ marginTop: 16, padding: '12px 14px', background: 'rgba(251,191,36,0.06)', borderRadius: 8, fontSize: 12, color: '#fde68a', lineHeight: 1.7 }}>
              Tip: Combining BBT charting + cervical mucus observation + calendar tracking is called the Symptothermal Method and gives the most accurate picture of your fertile window.
            </div>
          </div>
        )}
      </div>

      {/* ── INTERPRETATION ── */}
      <div style={{ ...CARD, background: 'rgba(99,102,241,0.05)', borderColor: 'rgba(99,102,241,0.2)' }}>
        <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: '#c4b5fd', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          Understanding Your Cycle
        </h3>
        <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
            Estimated ovulation: <strong style={{ color: '#e879f9' }}>{fmtDate(result.ovulationDate)}</strong> — day {effectiveCl - lp} of your {effectiveCl}-day cycle.
          </li>
          <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
            7-day fertile window: <strong style={{ color: '#6366f1' }}>{fmtDate(result.fertileStart)}</strong> through <strong style={{ color: '#6366f1' }}>{fmtDate(result.fertileEnd)}</strong>.
          </li>
          <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
            Cycles typically vary by 2–7 days. Stress, illness, travel, and weight changes can shift ovulation.
          </li>
          <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
            The luteal phase (post-ovulation) is usually stable at {lp} days. If your period is irregular, your follicular phase (pre-ovulation) is likely what varies.
          </li>
          {avgCycle && avgCycle !== cl && (
            <li style={{ fontSize: 13, color: '#6ee7b7', lineHeight: 1.7 }}>
              Your history average ({avgCycle} days) differs from your entered cycle length ({cl} days). The history average is used for greater accuracy.
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}
