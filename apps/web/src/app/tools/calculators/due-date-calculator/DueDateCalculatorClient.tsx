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
const TD: CSSProperties = { padding: '7px 12px', fontSize: 12, textAlign: 'left', color: 'var(--fg-2)', whiteSpace: 'nowrap' }

// ─── Helpers ─────────────────────────────────────────────────────────────────

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

function formatShort(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatMonth(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

function daysBetween(a: Date, b: Date): number {
  return Math.floor((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24))
}

// ─── Pregnancy milestones ─────────────────────────────────────────────────────

const MILESTONES = [
  { week: 4,  label: 'Missed period / positive test',          category: '1st' },
  { week: 6,  label: 'Heartbeat detectable by ultrasound',     category: '1st' },
  { week: 8,  label: 'Embryo becomes a fetus',                 category: '1st' },
  { week: 10, label: 'All major organs formed',                category: '1st' },
  { week: 12, label: 'End of 1st trimester; nuchal scan',      category: '1st' },
  { week: 14, label: 'Fetal movements begin (not felt yet)',   category: '2nd' },
  { week: 16, label: 'Anatomy scan / sex determination',       category: '2nd' },
  { week: 18, label: 'Baby can hear sounds',                   category: '2nd' },
  { week: 20, label: '20-week anatomy scan; halfway point',    category: '2nd' },
  { week: 22, label: 'Viability threshold (survival possible)',category: '2nd' },
  { week: 24, label: 'Glucose screening test',                 category: '2nd' },
  { week: 27, label: 'End of 2nd trimester',                   category: '2nd' },
  { week: 28, label: '3rd trimester begins; kick counts start',category: '3rd' },
  { week: 32, label: 'Group B Strep test preparation',         category: '3rd' },
  { week: 34, label: 'Baby fully formed; gaining weight fast', category: '3rd' },
  { week: 36, label: 'Baby considered "early term"',           category: '3rd' },
  { week: 37, label: 'Full-term begins (37–42 weeks)',         category: '3rd' },
  { week: 39, label: 'Optimal delivery window begins',         category: '3rd' },
  { week: 40, label: 'Estimated due date (Naegele\'s rule)',   category: '3rd' },
  { week: 42, label: 'Post-term: induction typically offered', category: '3rd' },
]

const TRIMESTER_COLORS: Record<string, string> = {
  '1st': '#6366f1',
  '2nd': '#10b981',
  '3rd': '#f59e0b',
}

// ─── MetricCard ───────────────────────────────────────────────────────────────

function MetricCard({ label, value, sub, color = '#6366f1' }: {
  label: string; value: string; sub?: string; color?: string
}) {
  return (
    <div style={{ padding: '18px 14px', background: 'rgba(0,0,0,0.3)', borderRadius: 12, textAlign: 'center' }}>
      <div style={{ fontSize: 20, fontWeight: 900, color, lineHeight: 1.2 }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

function TabBar({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (t: string) => void }) {
  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 20 }}>
      {tabs.map(t => (
        <button key={t} onClick={() => onChange(t)} style={{
          padding: '8px 16px', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer',
          background: active === t ? 'rgba(99,102,241,0.25)' : 'transparent',
          border: active === t ? '1px solid rgba(99,102,241,0.6)' : '1px solid var(--line-strong)',
          color: active === t ? '#c4b5fd' : 'var(--fg-3)',
        }}>{t}</button>
      ))}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DueDateCalculatorClient() {
  const [method,       setMethod]       = useState<'lmp' | 'conception' | 'ivf' | 'gestational'>('lmp')
  const [dateInput,    setDateInput]    = useState('')
  const [cycleLength,  setCycleLength]  = useState('28')
  const [ivfDay,       setIvfDay]       = useState<'3' | '5'>('5')
  const [gestWeeks,    setGestWeeks]    = useState('8')
  const [gestDays,     setGestDays]     = useState('0')
  const [showMilestones, setShowMilestones] = useState(false)
  const [showMonths,   setShowMonths]   = useState(false)

  const result = useMemo(() => {
    if (!dateInput) return null
    const inputDate = new Date(dateInput + 'T00:00:00')
    if (isNaN(inputDate.getTime())) return null

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let lmpDate: Date
    let dueDate: Date

    if (method === 'lmp') {
      lmpDate = inputDate
      // Naegele's rule with custom cycle length adjustment
      const cycleDiff = (parseInt(cycleLength) || 28) - 28
      dueDate = addDays(lmpDate, 280 + cycleDiff)
    } else if (method === 'conception') {
      // Conception = LMP + 14 days estimated
      lmpDate = addDays(inputDate, -14)
      dueDate = addDays(inputDate, 266)
    } else if (method === 'ivf') {
      // 3-day transfer: +263 days; 5-day transfer: +261 days
      const offset = ivfDay === '3' ? 263 : 261
      dueDate = addDays(inputDate, offset)
      lmpDate = addDays(dueDate, -280)
    } else {
      // Known gestational age: go back that many days from today
      const gw = parseInt(gestWeeks) || 0
      const gd = parseInt(gestDays)  || 0
      const totalDays = gw * 7 + gd
      lmpDate = addDays(today, -totalDays)
      dueDate = addDays(lmpDate, 280)
    }

    const daysSinceLmp = daysBetween(lmpDate, today)
    const currentWeek  = daysSinceLmp >= 0 ? Math.floor(daysSinceLmp / 7) : null
    const currentDay   = daysSinceLmp >= 0 ? daysSinceLmp % 7 : null
    const daysUntilDue = daysBetween(today, dueDate)
    const weeksLeft    = daysUntilDue >= 0 ? Math.ceil(daysUntilDue / 7) : null

    let trimester = 'Not yet started'
    if (currentWeek !== null) {
      if (currentWeek < 14)       trimester = '1st Trimester (Weeks 1–13)'
      else if (currentWeek < 28)  trimester = '2nd Trimester (Weeks 14–27)'
      else                        trimester = '3rd Trimester (Weeks 28–40)'
    }

    const trimester1End = addDays(lmpDate, 13 * 7)
    const trimester2End = addDays(lmpDate, 27 * 7)
    const trimester3End = dueDate

    // Milestone dates
    const milestoneDates = MILESTONES.map(m => ({
      ...m,
      date: addDays(lmpDate, m.week * 7),
      isPast: daysBetween(addDays(lmpDate, m.week * 7), today) > 0,
      isNear: Math.abs(daysBetween(addDays(lmpDate, m.week * 7), today)) < 14,
    }))

    // Month-by-month (9 months)
    const months = Array.from({ length: 10 }, (_, i) => {
      const wkStart = i * 4
      const wkEnd   = Math.min((i + 1) * 4 - 1, 40)
      return {
        month: i + 1,
        label: `Month ${i + 1}`,
        weeks: `Weeks ${wkStart + 1}–${wkEnd + 1}`,
        startDate: addDays(lmpDate, wkStart * 7),
        endDate:   addDays(lmpDate, (wkEnd + 1) * 7),
      }
    }).slice(0, 9)

    return {
      dueDate, lmpDate, currentWeek, currentDay, trimester,
      trimester1End, trimester2End, trimester3End,
      daysUntilDue, weeksLeft, milestoneDates, months,
    }
  }, [method, dateInput, cycleLength, ivfDay, gestWeeks, gestDays])

  const TABS = ['LMP', 'Conception Date', 'IVF Transfer', 'Known Gestational Age']
  const methodMap: Record<string, 'lmp' | 'conception' | 'ivf' | 'gestational'> = {
    'LMP': 'lmp', 'Conception Date': 'conception', 'IVF Transfer': 'ivf', 'Known Gestational Age': 'gestational',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── DISCLAIMER ── */}
      <div style={{ ...CARD, background: 'rgba(245,158,11,0.06)', borderColor: 'rgba(245,158,11,0.2)', padding: '14px 18px' }}>
        <div style={{ fontSize: 11, color: '#fbbf24', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
          Medical Disclaimer
        </div>
        <p style={{ fontSize: 12, color: 'var(--fg-3)', margin: 0, lineHeight: 1.6 }}>
          This calculator provides an estimated due date for informational purposes only. Consult your OB/GYN or midwife for a confirmed due date based on clinical examination and ultrasound.
        </p>
      </div>

      {/* ── METHOD TABS ── */}
      <TabBar tabs={TABS} active={TABS.find(t => methodMap[t] === method) ?? 'LMP'} onChange={t => { setMethod(methodMap[t]); }} />

      {/* ── INPUTS ── */}
      <div style={CARD}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>

          {method === 'lmp' && (
            <>
              <div>
                <label style={LABEL}>First Day of Last Period</label>
                <input type="date" style={INPUT_BOX} value={dateInput}
                  onChange={e => setDateInput(e.target.value)} />
              </div>
              <div>
                <label style={LABEL}>Cycle Length (days)</label>
                <input type="number" style={INPUT_BOX} value={cycleLength} min={20} max={45}
                  onChange={e => setCycleLength(e.target.value)} placeholder="28" />
                <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4 }}>
                  Adjusts Naegele's Rule (default: 28-day cycle = 280 days)
                </div>
              </div>
            </>
          )}

          {method === 'conception' && (
            <div>
              <label style={LABEL}>Conception Date</label>
              <input type="date" style={INPUT_BOX} value={dateInput}
                onChange={e => setDateInput(e.target.value)} />
              <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4 }}>
                Due date = conception + 266 days
              </div>
            </div>
          )}

          {method === 'ivf' && (
            <>
              <div>
                <label style={LABEL}>Embryo Transfer Date</label>
                <input type="date" style={INPUT_BOX} value={dateInput}
                  onChange={e => setDateInput(e.target.value)} />
              </div>
              <div>
                <label style={LABEL}>Transfer Day</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {(['3', '5'] as const).map(d => (
                    <button key={d} onClick={() => setIvfDay(d)} style={{
                      flex: 1, padding: '9px 0', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13,
                      background: ivfDay === d ? 'rgba(99,102,241,0.25)' : 'transparent',
                      border: ivfDay === d ? '1px solid rgba(99,102,241,0.6)' : '1px solid var(--line-strong)',
                      color: ivfDay === d ? '#c4b5fd' : 'var(--fg-3)',
                    }}>Day {d} Blastocyst</button>
                  ))}
                </div>
                <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4 }}>
                  Day 3 = +263 days &nbsp;|&nbsp; Day 5 = +261 days
                </div>
              </div>
            </>
          )}

          {method === 'gestational' && (
            <>
              <div>
                <label style={LABEL}>Current Gestational Weeks</label>
                <input type="number" style={INPUT_BOX} value={gestWeeks} min={1} max={42}
                  onChange={e => setGestWeeks(e.target.value)} placeholder="8" />
              </div>
              <div>
                <label style={LABEL}>Additional Days (0–6)</label>
                <input type="number" style={INPUT_BOX} value={gestDays} min={0} max={6}
                  onChange={e => setGestDays(e.target.value)} placeholder="0" />
                <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4 }}>
                  E.g. "8 weeks and 3 days" → weeks=8, days=3
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── RESULTS ── */}
      {result ? (
        <>
          {/* Due date hero */}
          <div style={{ ...CARD, textAlign: 'center', padding: '28px 24px', background: 'rgba(16,185,129,0.06)', borderColor: 'rgba(16,185,129,0.25)' }}>
            <div style={{ fontSize: 11, color: 'var(--fg-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
              Estimated Due Date
            </div>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#10b981', lineHeight: 1.3 }}>
              {formatDate(result.dueDate)}
            </div>
            {result.currentWeek !== null && (
              <div style={{ fontSize: 15, color: '#a5b4fc', marginTop: 10, fontWeight: 600 }}>
                Week {result.currentWeek}+{result.currentDay} &nbsp;·&nbsp; {result.trimester}
                {result.weeksLeft !== null && <span style={{ color: 'var(--fg-3)', fontWeight: 400 }}> &nbsp;·&nbsp; {result.weeksLeft} weeks to go</span>}
              </div>
            )}
            {result.daysUntilDue < 0 && (
              <div style={{ marginTop: 8, fontSize: 13, color: '#f87171' }}>
                Past estimated due date by {Math.abs(result.daysUntilDue)} days.
              </div>
            )}
          </div>

          {/* Metric cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
            {result.currentWeek !== null && (
              <MetricCard label="Current Gestation" value={`Wk ${result.currentWeek}+${result.currentDay}`} color="#6366f1" />
            )}
            {result.weeksLeft !== null && (
              <MetricCard label="Weeks Remaining" value={`${result.weeksLeft} wks`} color="#10b981"
                sub={result.daysUntilDue + ' days'} />
            )}
            <MetricCard label="Due Date" value={formatShort(result.dueDate)} color="#10b981" />
          </div>

          {/* Trimester breakdown */}
          <div style={CARD}>
            <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Trimester Date Ranges
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: '1st Trimester', range: 'Weeks 1–13',  start: result.lmpDate,       end: result.trimester1End, color: '#6366f1' },
                { label: '2nd Trimester', range: 'Weeks 14–27', start: addDays(result.trimester1End, 1), end: result.trimester2End, color: '#10b981' },
                { label: '3rd Trimester', range: 'Weeks 28–40', start: addDays(result.trimester2End, 1), end: result.dueDate,       color: '#f59e0b' },
              ].map(t => {
                const today = new Date(); today.setHours(0,0,0,0)
                const isActive = today >= t.start && today <= t.end
                return (
                  <div key={t.label} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '12px 16px', borderRadius: 10,
                    background: isActive ? `${t.color}15` : 'rgba(0,0,0,0.2)',
                    border: `1px solid ${isActive ? t.color + '40' : 'var(--line-strong)'}`,
                    flexWrap: 'wrap', gap: 8,
                  }}>
                    <div>
                      <span style={{ fontWeight: 700, color: t.color, fontSize: 14 }}>{t.label}</span>
                      {isActive && <span style={{ marginLeft: 8, fontSize: 11, color: t.color, background: `${t.color}20`, padding: '2px 6px', borderRadius: 4 }}>Current</span>}
                      <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>{t.range}</div>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: 12, color: 'var(--fg-3)' }}>
                      <div>{formatShort(t.start)} –</div>
                      <div style={{ color: 'var(--fg-2)' }}>{formatShort(t.end)}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Milestones table */}
          <button onClick={() => setShowMilestones(v => !v)} style={{
            width: '100%', textAlign: 'left', padding: '14px 20px',
            background: 'var(--bg-1)', border: '1px solid var(--line-strong)',
            borderRadius: 12, color: '#c4b5fd', fontWeight: 700, fontSize: 14, cursor: 'pointer',
          }} aria-expanded={showMilestones}>
            {showMilestones ? '▾' : '▸'} Pregnancy Milestone Timeline ({MILESTONES.length} milestones)
          </button>

          {showMilestones && (
            <div style={{ ...CARD, padding: 0, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr>
                      {['Week', 'Date', 'Trimester', 'Milestone'].map((h, i) => (
                        <th key={h} style={{ ...TH, textAlign: i <= 1 ? 'center' : 'left' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.milestoneDates.map(m => {
                      const today2 = new Date(); today2.setHours(0,0,0,0)
                      const isCurrentWeek = result.currentWeek !== null && result.currentWeek === m.week
                      return (
                        <tr key={m.week} style={{
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                          background: isCurrentWeek ? 'rgba(99,102,241,0.1)' : m.isPast ? 'rgba(0,0,0,0.1)' : 'transparent',
                          opacity: m.isPast && !isCurrentWeek ? 0.6 : 1,
                        }}>
                          <td style={{ ...TD, textAlign: 'center', fontWeight: 700, color: TRIMESTER_COLORS[m.category] }}>
                            {isCurrentWeek ? '★ ' : ''}{m.week}
                          </td>
                          <td style={{ ...TD, textAlign: 'center', color: 'var(--fg-3)' }}>{formatShort(m.date)}</td>
                          <td style={{ ...TD }}>
                            <span style={{
                              padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700,
                              background: TRIMESTER_COLORS[m.category] + '20',
                              color: TRIMESTER_COLORS[m.category],
                            }}>{m.category}</span>
                          </td>
                          <td style={{ ...TD, color: isCurrentWeek ? '#c4b5fd' : m.isPast ? 'var(--fg-3)' : 'var(--fg-2)' }}>
                            {m.isPast && !isCurrentWeek ? '✓ ' : ''}{m.label}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Month-by-month summary */}
          <button onClick={() => setShowMonths(v => !v)} style={{
            width: '100%', textAlign: 'left', padding: '14px 20px',
            background: 'var(--bg-1)', border: '1px solid var(--line-strong)',
            borderRadius: 12, color: '#c4b5fd', fontWeight: 700, fontSize: 14, cursor: 'pointer',
          }} aria-expanded={showMonths}>
            {showMonths ? '▾' : '▸'} Month-by-Month Development Summary
          </button>

          {showMonths && (
            <div style={{ ...CARD, padding: 0, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr>
                      {['Month', 'Weeks', 'Start Date', 'End Date', 'Calendar Month'].map((h, i) => (
                        <th key={h} style={{ ...TH, textAlign: i === 0 ? 'center' : 'left' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.months.map(m => (
                      <tr key={m.month} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ ...TD, textAlign: 'center', fontWeight: 700, color: '#a78bfa' }}>{m.month}</td>
                        <td style={TD}>{m.weeks}</td>
                        <td style={{ ...TD, color: 'var(--fg-3)' }}>{formatShort(m.startDate)}</td>
                        <td style={{ ...TD, color: 'var(--fg-3)' }}>{formatShort(m.endDate)}</td>
                        <td style={{ ...TD, color: '#10b981' }}>{formatMonth(m.startDate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Export */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button style={BTN_GHOST} onClick={async () => exportCalcPDF({
              toolName: 'Due Date Calculator',
              inputs: [
                { label: 'Method', value: method === 'lmp' ? 'Last Menstrual Period (Naegele\'s Rule)' : method === 'conception' ? 'Conception Date' : method === 'ivf' ? `IVF Transfer (Day ${ivfDay})` : 'Known Gestational Age' },
                { label: method === 'lmp' ? 'LMP Date' : method === 'conception' ? 'Conception Date' : method === 'ivf' ? 'Transfer Date' : 'Gestational Age', value: method === 'gestational' ? `${gestWeeks}w ${gestDays}d` : dateInput },
              ],
              results: [
                { label: 'Estimated Due Date',    value: formatDate(result.dueDate),           highlight: true },
                { label: '1st Trimester Ends',    value: formatShort(result.trimester1End) },
                { label: '2nd Trimester Ends',    value: formatShort(result.trimester2End) },
                ...(result.currentWeek !== null ? [{ label: 'Current Week', value: `Week ${result.currentWeek}+${result.currentDay}` }] : []),
                ...(result.weeksLeft !== null    ? [{ label: 'Weeks Remaining', value: `${result.weeksLeft} weeks (${result.daysUntilDue} days)` }] : []),
              ],
              formula: 'Naegele\'s Rule: LMP + 280 days (adjusted for non-28-day cycles). IVF Day-3: +263 days. IVF Day-5: +261 days.',
            })}>
              Export PDF Report
            </button>
          </div>

          {/* Reminder disclaimer */}
          <div style={{ ...CARD, background: 'rgba(245,158,11,0.06)', borderColor: 'rgba(245,158,11,0.2)', padding: '14px 18px' }}>
            <p style={{ fontSize: 12, color: 'var(--fg-3)', margin: 0, lineHeight: 1.7 }}>
              <strong style={{ color: '#fbbf24' }}>Remember:</strong> Only about 5% of babies are born on their exact due date. Most arrive within 2 weeks before or after. Your care provider will establish the official gestational age using first-trimester ultrasound measurements, which are more accurate than date calculations.
            </p>
          </div>
        </>
      ) : (
        <div style={{ ...CARD, textAlign: 'center', padding: '40px 20px', color: 'var(--fg-3)', fontSize: 14 }}>
          {method === 'gestational'
            ? 'Enter your current gestational age above — results update instantly.'
            : 'Enter a date above — results update instantly.'}
        </div>
      )}
    </div>
  )
}
