'use client'
import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { exportCalcPDF } from '@/lib/calcPdf'

// ─── US Federal Holidays (approximate; fixed-day rules) ───────────────────────

function getFederalHolidays(year: number): Date[] {
  // Simplified fixed-day approximations (some shift for weekends)
  return [
    new Date(year, 0,  1),   // New Year's Day
    new Date(year, 0,  20),  // MLK Day (3rd Mon Jan)
    new Date(year, 1,  17),  // Presidents Day (3rd Mon Feb)
    new Date(year, 4,  26),  // Memorial Day (last Mon May approx)
    new Date(year, 5,  19),  // Juneteenth
    new Date(year, 6,  4),   // Independence Day
    new Date(year, 8,  1),   // Labor Day (1st Mon Sep approx)
    new Date(year, 9,  13),  // Columbus Day (2nd Mon Oct approx)
    new Date(year, 10, 11),  // Veterans Day
    new Date(year, 10, 27),  // Thanksgiving (4th Thu Nov approx)
    new Date(year, 11, 25),  // Christmas
  ]
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const CARD: CSSProperties = { background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 16, padding: '24px 28px' }
const LABEL: CSSProperties = { display: 'block', marginBottom: 5, fontSize: 12, color: 'var(--fg-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }
const INPUT_BOX: CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: 8, background: 'rgba(0,0,0,0.35)', border: '1px solid var(--line-strong)', color: '#fff', fontSize: 15, boxSizing: 'border-box' }
const BTN_GHOST: CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 8, padding: '9px 18px', color: '#c4b5fd', fontSize: 13, fontWeight: 600, cursor: 'pointer' }

const DAYS_OF_WEEK = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DaysBetweenDates() {
  const today = new Date().toISOString().split('T')[0]
  const [startDate, setStartDate] = useState('')
  const [endDate,   setEndDate]   = useState(today)
  const [excludeHols, setExcludeHols] = useState(false)

  const result = useMemo(() => {
    if (!startDate || !endDate) return null
    const from = new Date(startDate + 'T00:00:00')
    const to   = new Date(endDate   + 'T00:00:00')
    if (isNaN(from.getTime()) || isNaN(to.getTime())) return null

    const start  = from <= to ? from : to
    const end    = from <= to ? to   : from
    const diffMs = end.getTime() - start.getTime()
    const days   = Math.round(diffMs / 86400000)

    // Exact y/m/d breakdown
    let years  = end.getFullYear() - start.getFullYear()
    let months = end.getMonth()    - start.getMonth()
    let remDays = end.getDate()    - start.getDate()
    if (remDays   < 0) { months--; remDays += new Date(end.getFullYear(), end.getMonth(), 0).getDate() }
    if (months    < 0) { years--;  months  += 12 }

    // Count weekdays, weekends, holidays
    let weekdays = 0, weekends = 0, holidays = 0
    const holidaySet = new Set<string>()
    const yearsSpanned = Array.from({ length: end.getFullYear() - start.getFullYear() + 1 }, (_, i) => start.getFullYear() + i)
    yearsSpanned.forEach(y => {
      getFederalHolidays(y).forEach(h => {
        holidaySet.add(h.toISOString().split('T')[0])
      })
    })

    const cur = new Date(start)
    while (cur < end) {
      const dow = cur.getDay()
      const ds  = cur.toISOString().split('T')[0]
      if (dow === 0 || dow === 6) {
        weekends++
      } else {
        weekdays++
        if (excludeHols && holidaySet.has(ds)) holidays++
      }
      cur.setDate(cur.getDate() + 1)
    }
    const businessDays = excludeHols ? weekdays - holidays : weekdays

    // Start/end day of week
    const startDow = DAYS_OF_WEEK[start.getDay()]
    const endDow   = DAYS_OF_WEEK[end.getDay()]

    // Add/subtract presets: days from start
    const addDates = [7, 14, 30, 90, 180, 365].map(d => {
      const dt = new Date(start); dt.setDate(dt.getDate() + d)
      return { days: d, date: dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), dow: DAYS_OF_WEEK[dt.getDay()] }
    })

    return {
      days, weeks: Math.floor(days / 7), months: years * 12 + months, years,
      exactYears: years, exactMonths: months, exactDays: remDays,
      weekdays, weekends, businessDays, holidays,
      startDow, endDow, addDates,
      startFmt: start.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
      endFmt:   end.toLocaleDateString('en-US',   { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
      isForward: from <= to,
    }
  }, [startDate, endDate, excludeHols])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* INPUTS */}
      <div style={CARD}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={LABEL}>Start Date</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
              style={INPUT_BOX} aria-label="Start date" />
          </div>
          <div>
            <label style={LABEL}>End Date</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
              style={INPUT_BOX} aria-label="End date" />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <input type="checkbox" id="excHols" checked={excludeHols} onChange={e => setExcludeHols(e.target.checked)}
            style={{ width: 15, height: 15, cursor: 'pointer' }} />
          <label htmlFor="excHols" style={{ ...LABEL, margin: 0, cursor: 'pointer' }}>
            Exclude US Federal Holidays from business days
          </label>
        </div>

        {/* Quick date buttons */}
        <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, color: 'var(--fg-3)', alignSelf: 'center' }}>Quick start:</span>
          {[
            { l: 'Today',    v: today },
            { l: '1 Jan',    v: `${new Date().getFullYear()}-01-01` },
            { l: '1 Jul',    v: `${new Date().getFullYear()}-07-01` },
            { l: 'Year ago', v: new Date(Date.now() - 365 * 86400000).toISOString().slice(0, 10) },
          ].map(({ l, v }) => (
            <button key={l} onClick={() => setStartDate(v)} style={{
              ...BTN_GHOST, padding: '5px 12px', fontSize: 11,
            }}>{l}</button>
          ))}
        </div>
      </div>

      {/* TIER 1: SUMMARY */}
      {result && (
        <>
          {/* Hero */}
          <div style={{ ...CARD, textAlign: 'center', background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.3)' }}>
            <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>
              {result.isForward ? 'Days Between Dates' : 'Days Between Dates (reversed)'}
            </div>
            <div style={{ fontSize: 52, fontWeight: 900, color: '#6366f1', lineHeight: 1 }}>
              {result.days.toLocaleString()}
            </div>
            <div style={{ fontSize: 14, color: 'var(--fg-3)', marginTop: 8 }}>
              {result.startFmt} → {result.endFmt}
            </div>
            <div style={{ fontSize: 13, color: '#c4b5fd', marginTop: 6 }}>
              = {result.exactYears > 0 ? `${result.exactYears} year${result.exactYears !== 1 ? 's' : ''}, ` : ''}
              {result.exactMonths > 0 ? `${result.exactMonths} month${result.exactMonths !== 1 ? 's' : ''}, ` : ''}
              {result.exactDays} day{result.exactDays !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 }}>
            {[
              { l: 'Total Weeks',     v: result.weeks.toLocaleString(),        c: '#6366f1' },
              { l: 'Total Months',    v: result.months.toLocaleString(),       c: '#8b5cf6' },
              { l: 'Weekdays',        v: result.weekdays.toLocaleString(),     c: '#38bdf8' },
              { l: 'Weekend Days',    v: result.weekends.toLocaleString(),     c: '#f59e0b' },
              { l: excludeHols ? 'Business Days (no holidays)' : 'Business Days', v: result.businessDays.toLocaleString(), c: '#10b981' },
              ...(result.holidays > 0 ? [{ l: 'US Holidays Excluded', v: String(result.holidays), c: '#e879f9' }] : []),
            ].map(({ l, v, c }) => (
              <div key={l} style={{ padding: '14px 10px', background: 'rgba(0,0,0,0.3)', borderRadius: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: c }}>{v}</div>
                <div style={{ fontSize: 10, color: 'var(--fg-3)', marginTop: 3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1.3 }}>{l}</div>
              </div>
            ))}
          </div>

          {/* TIER 2: ADD/SUBTRACT FROM START DATE */}
          <div style={CARD}>
            <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              📅 Key Dates From {result.startFmt.split(',')[0]}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {result.addDates.map(({ days: d, date, dow }) => (
                <div key={d} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 14px', background: 'rgba(0,0,0,0.15)', borderRadius: 8, flexWrap: 'wrap', gap: 8 }}>
                  <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>+{d.toLocaleString()} days:</span>
                  <span style={{ fontSize: 13, color: '#c4b5fd', fontWeight: 600 }}>{dow}, {date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Export */}
          <div>
            <button onClick={async () => exportCalcPDF({
              toolName: 'Date Difference Calculator',
              inputs: [
                { label: 'Start Date', value: startDate },
                { label: 'End Date',   value: endDate },
              ],
              results: [
                { label: 'Total Days',     value: result.days.toLocaleString(),         highlight: true },
                { label: 'Total Weeks',    value: result.weeks.toLocaleString() },
                { label: 'Total Months',   value: result.months.toLocaleString() },
                { label: 'Exact Duration', value: `${result.exactYears}y ${result.exactMonths}m ${result.exactDays}d` },
                { label: 'Weekdays',       value: result.weekdays.toLocaleString() },
                { label: 'Business Days',  value: result.businessDays.toLocaleString() },
                { label: 'Weekends',       value: result.weekends.toLocaleString() },
              ],
            })} style={BTN_GHOST}>📄 Export PDF</button>
          </div>
        </>
      )}

      {!result && (
        <div style={{ ...CARD, textAlign: 'center', padding: '40px 20px', color: 'var(--fg-3)', fontSize: 14 }}>
          Select a start date above — results appear instantly.
        </div>
      )}
    </div>
  )
}
