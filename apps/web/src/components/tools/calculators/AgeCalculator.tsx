'use client'
import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { exportCalcPDF } from '@/lib/calcPdf'

// ─── Styles ───────────────────────────────────────────────────────────────────

const CARD: CSSProperties = { background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 16, padding: '24px 28px' }
const LABEL: CSSProperties = { display: 'block', marginBottom: 5, fontSize: 12, color: 'var(--fg-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }
const INPUT_BOX: CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: 8, background: 'rgba(0,0,0,0.35)', border: '1px solid var(--line-strong)', color: '#fff', fontSize: 15, boxSizing: 'border-box' }
const BTN_GHOST: CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 8, padding: '9px 18px', color: '#c4b5fd', fontSize: 13, fontWeight: 600, cursor: 'pointer' }

// ─── Zodiac signs ─────────────────────────────────────────────────────────────

function getZodiac(month: number, day: number): string {
  if ((month === 3  && day >= 21) || (month === 4  && day <= 19)) return 'Aries ♈'
  if ((month === 4  && day >= 20) || (month === 5  && day <= 20)) return 'Taurus ♉'
  if ((month === 5  && day >= 21) || (month === 6  && day <= 20)) return 'Gemini ♊'
  if ((month === 6  && day >= 21) || (month === 7  && day <= 22)) return 'Cancer ♋'
  if ((month === 7  && day >= 23) || (month === 8  && day <= 22)) return 'Leo ♌'
  if ((month === 8  && day >= 23) || (month === 9  && day <= 22)) return 'Virgo ♍'
  if ((month === 9  && day >= 23) || (month === 10 && day <= 22)) return 'Libra ♎'
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio ♏'
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius ♐'
  if ((month === 12 && day >= 22) || (month === 1  && day <= 19)) return 'Capricorn ♑'
  if ((month === 1  && day >= 20) || (month === 2  && day <= 18)) return 'Aquarius ♒'
  return 'Pisces ♓'
}

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// ─── Life milestones ──────────────────────────────────────────────────────────

const MILESTONES = [
  { age: 1, label: '1st Birthday' }, { age: 5, label: 'School Age' }, { age: 13, label: 'Teenager' },
  { age: 16, label: 'Driver\'s License (US)' }, { age: 18, label: 'Legal Adult (US)' },
  { age: 21, label: 'Legal Drinking Age (US)' }, { age: 25, label: 'Car Insurance Drop' },
  { age: 30, label: '30th Birthday' }, { age: 40, label: '40th Birthday' },
  { age: 50, label: '50th Birthday' }, { age: 59.5, label: 'IRA Penalty-Free Withdrawals' },
  { age: 62, label: 'Early Social Security' }, { age: 65, label: 'Medicare Eligibility' },
  { age: 67, label: 'Full Retirement Age' }, { age: 100, label: 'Centenarian!' },
]

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AgeCalculator() {
  const today = new Date().toISOString().split('T')[0]
  const [birthDate, setBirthDate] = useState('')
  const [toDate,    setToDate]    = useState(today)

  const result = useMemo(() => {
    if (!birthDate) return null
    const from = new Date(birthDate + 'T00:00:00')
    const to   = new Date((toDate || today) + 'T00:00:00')
    if (isNaN(from.getTime()) || isNaN(to.getTime()) || from > to) return null

    let years  = to.getFullYear()  - from.getFullYear()
    let months = to.getMonth()     - from.getMonth()
    let days   = to.getDate()      - from.getDate()

    if (days   < 0) { months--; days   += new Date(to.getFullYear(), to.getMonth(), 0).getDate() }
    if (months < 0) { years--;  months += 12 }

    const diffMs     = to.getTime() - from.getTime()
    const totalDays  = Math.floor(diffMs / 86400000)
    const totalWeeks = Math.floor(totalDays / 7)
    const totalMonths = years * 12 + months
    const totalHours  = totalDays * 24
    const totalMinutes = totalHours * 60

    // Next birthday
    const nextBday = new Date(to.getFullYear(), from.getMonth(), from.getDate())
    if (nextBday <= to) nextBday.setFullYear(nextBday.getFullYear() + 1)
    const daysToNext = Math.ceil((nextBday.getTime() - to.getTime()) / 86400000)
    const nextBdayDow = DAYS_OF_WEEK[nextBday.getDay()]

    // Birth day of week
    const birthDow = DAYS_OF_WEEK[from.getDay()]

    // Zodiac
    const zodiac = getZodiac(from.getMonth() + 1, from.getDate())

    // Age in decimal (for milestones)
    const ageDecimal = years + months / 12 + days / 365.25

    // Upcoming milestones
    const upcomingMilestones = MILESTONES.filter(m => m.age > ageDecimal).slice(0, 4).map(m => {
      const target = new Date(from)
      const fullYears = Math.floor(m.age)
      const extraMonths = Math.round((m.age - fullYears) * 12)
      target.setFullYear(target.getFullYear() + fullYears)
      target.setMonth(target.getMonth() + extraMonths)
      const daysUntil = Math.ceil((target.getTime() - to.getTime()) / 86400000)
      return { ...m, date: target.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), daysUntil }
    })

    // Past milestones
    const pastMilestones = MILESTONES.filter(m => m.age <= ageDecimal).slice(-3)

    return {
      years, months, days, totalDays, totalWeeks, totalMonths, totalHours, totalMinutes,
      daysToNext, nextBday: nextBday.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      nextBdayDow, birthDow, zodiac, ageDecimal, upcomingMilestones, pastMilestones,
    }
  }, [birthDate, toDate, today])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* INPUTS */}
      <div style={CARD}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <div>
            <label style={LABEL}>Date of Birth</label>
            <input type="date" value={birthDate} max={today} onChange={e => setBirthDate(e.target.value)}
              style={INPUT_BOX} aria-label="Date of birth" />
          </div>
          <div>
            <label style={LABEL}>Calculate Age At</label>
            <input type="date" value={toDate} onChange={e => setToDate(e.target.value)}
              style={INPUT_BOX} aria-label="Age at date" />
            <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 3 }}>Leave as today for current age</div>
          </div>
        </div>
      </div>

      {result && (
        <>
          {/* Hero age */}
          <div style={{ ...CARD, textAlign: 'center', background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.3)' }}>
            <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>Your Age</div>
            <div style={{ fontSize: 52, fontWeight: 900, color: '#6366f1', lineHeight: 1 }}>{result.years}</div>
            <div style={{ fontSize: 18, color: 'var(--fg-2)', marginTop: 6 }}>
              years, <strong style={{ color: '#c4b5fd' }}>{result.months}</strong> months,{' '}
              <strong style={{ color: '#c4b5fd' }}>{result.days}</strong> days
            </div>
            <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 8 }}>
              Born: {DAYS_OF_WEEK[new Date(birthDate + 'T00:00:00').getDay()]} · Zodiac: {result.zodiac}
            </div>
          </div>

          {/* Metrics grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 }}>
            {[
              { l: 'Total Days',    v: result.totalDays.toLocaleString(),    c: '#6366f1' },
              { l: 'Total Weeks',   v: result.totalWeeks.toLocaleString(),   c: '#8b5cf6' },
              { l: 'Total Months',  v: result.totalMonths.toLocaleString(),  c: '#a855f7' },
              { l: 'Total Hours',   v: result.totalHours.toLocaleString(),   c: '#38bdf8' },
              { l: 'Total Minutes', v: result.totalMinutes.toLocaleString(), c: '#06b6d4' },
              { l: 'Next Birthday', v: `${result.daysToNext} days`, c: '#10b981',
                sub: `${result.nextBdayDow}, ${result.nextBday}` },
            ].map(({ l, v, c, sub }) => (
              <div key={l} style={{ padding: '14px 10px', background: 'rgba(0,0,0,0.3)', borderRadius: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: c }}>{v}</div>
                <div style={{ fontSize: 10, color: 'var(--fg-3)', marginTop: 3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{l}</div>
                {sub && <div style={{ fontSize: 9, color: 'var(--fg-3)', marginTop: 1 }}>{sub}</div>}
              </div>
            ))}
          </div>

          {/* Milestones */}
          {result.upcomingMilestones.length > 0 && (
            <div style={CARD}>
              <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                🎯 Upcoming Life Milestones
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {result.upcomingMilestones.map(m => (
                  <div key={m.age} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(0,0,0,0.2)', borderRadius: 10, flexWrap: 'wrap', gap: 8 }}>
                    <div>
                      <span style={{ fontSize: 13, color: 'var(--fg-2)', fontWeight: 600 }}>Age {m.age}: </span>
                      <span style={{ fontSize: 13, color: '#c4b5fd' }}>{m.label}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: 12, color: '#10b981', fontWeight: 700 }}>{m.daysUntil.toLocaleString()} days</span>
                      <span style={{ fontSize: 11, color: 'var(--fg-3)', marginLeft: 8 }}>({m.date})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Export */}
          <div>
            <button onClick={async () => exportCalcPDF({
              toolName: 'Age Calculator',
              inputs: [
                { label: 'Date of Birth', value: birthDate },
                { label: 'Age At Date',   value: toDate || today },
              ],
              results: [
                { label: 'Age',          value: `${result.years} years, ${result.months} months, ${result.days} days`, highlight: true },
                { label: 'Total Days',   value: result.totalDays.toLocaleString() },
                { label: 'Total Weeks',  value: result.totalWeeks.toLocaleString() },
                { label: 'Total Months', value: result.totalMonths.toLocaleString() },
                { label: 'Next Birthday In', value: `${result.daysToNext} days (${result.nextBday})` },
                { label: 'Zodiac',       value: result.zodiac },
                { label: 'Born On',      value: result.birthDow },
              ],
            })} style={BTN_GHOST}>
              📄 Export PDF
            </button>
          </div>
        </>
      )}

      {!result && (
        <div style={{ ...CARD, textAlign: 'center', padding: '40px 20px', color: 'var(--fg-3)', fontSize: 14 }}>
          Enter your date of birth above — your exact age appears instantly.
        </div>
      )}
    </div>
  )
}
