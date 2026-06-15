'use client'
import { useState } from 'react'

const cardStyle: React.CSSProperties = {
  background: '#13132a',
  borderRadius: 12,
  padding: 24,
  border: '1px solid rgba(255,255,255,0.07)',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 8,
  background: '#252540',
  border: '1px solid var(--line-strong)',
  color: '#e0e0ff',
  fontSize: 15,
  fontFamily: 'monospace',
  boxSizing: 'border-box',
  outline: 'none',
}

const btnStyle = (accent?: boolean): React.CSSProperties => ({
  padding: '10px 22px',
  borderRadius: 8,
  fontWeight: 700,
  fontSize: 14,
  cursor: 'pointer',
  border: 'none',
  background: accent ? '#7c3aed' : 'rgba(255,255,255,0.08)',
  color: '#e0e0ff',
})

const PRESETS = [
  { label: 'Every minute', expr: '* * * * *' },
  { label: 'Every hour', expr: '0 * * * *' },
  { label: 'Daily at midnight', expr: '0 0 * * *' },
  { label: 'Weekly Mon 9am', expr: '0 9 * * 1' },
  { label: 'Monthly 1st', expr: '0 0 1 * *' },
]

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

// ── Field parsing ─────────────────────────────────────────────────────────────

function parseField(field: string, min: number, max: number): number[] {
  const results = new Set<number>()

  for (const part of field.split(',')) {
    if (part === '*') {
      for (let i = min; i <= max; i++) results.add(i)
    } else if (part.startsWith('*/')) {
      const step = parseInt(part.slice(2), 10)
      if (isNaN(step) || step <= 0) throw new Error(`Invalid step: ${part}`)
      for (let i = min; i <= max; i += step) results.add(i)
    } else if (part.includes('/')) {
      const [rangePart, stepStr] = part.split('/')
      const step = parseInt(stepStr, 10)
      if (isNaN(step) || step <= 0) throw new Error(`Invalid step: ${part}`)
      const [startStr, endStr] = rangePart.includes('-') ? rangePart.split('-') : [rangePart, String(max)]
      const start = parseInt(startStr, 10)
      const end = parseInt(endStr, 10)
      for (let i = start; i <= end; i += step) results.add(i)
    } else if (part.includes('-')) {
      const [startStr, endStr] = part.split('-')
      const start = parseInt(startStr, 10)
      const end = parseInt(endStr, 10)
      if (isNaN(start) || isNaN(end)) throw new Error(`Invalid range: ${part}`)
      for (let i = start; i <= end; i++) results.add(i)
    } else {
      const val = parseInt(part, 10)
      if (isNaN(val)) throw new Error(`Invalid value: ${part}`)
      results.add(val)
    }
  }

  // Clamp
  const arr = Array.from(results).filter(v => v >= min && v <= max)
  if (arr.length === 0) throw new Error(`No valid values in range ${min}-${max} for field "${field}"`)
  return arr.sort((a, b) => a - b)
}

interface CronFields {
  minutes: number[]
  hours: number[]
  daysOfMonth: number[]
  months: number[]
  daysOfWeek: number[]
}

function parseCron(expr: string): CronFields {
  const parts = expr.trim().split(/\s+/)
  if (parts.length !== 5) throw new Error('Cron expression must have exactly 5 fields: minute hour day month weekday')
  const [minF, hrF, domF, monF, dowF] = parts
  return {
    minutes: parseField(minF, 0, 59),
    hours: parseField(hrF, 0, 23),
    daysOfMonth: parseField(domF, 1, 31),
    months: parseField(monF, 1, 12),
    daysOfWeek: parseField(dowF, 0, 6),
  }
}

// ── Human-readable description ────────────────────────────────────────────────

function describeField(values: number[], all: number[], singular: string, plural: string, formatter?: (n: number) => string): string {
  if (values.length === all.length) return `every ${singular}`
  const fmt = formatter ?? ((n: number) => String(n))
  if (values.length === 1) return fmt(values[0])
  // Detect consecutive range
  const isRange = values.every((v, i) => i === 0 || v === values[i - 1] + 1)
  if (isRange) return `${fmt(values[0])} through ${fmt(values[values.length - 1])}`
  return values.map(fmt).join(', ')
}

function padTime(h: number, m: number): string {
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 === 0 ? 12 : h % 12
  return `${hour}:${String(m).padStart(2, '0')} ${period}`
}

function buildDescription(fields: CronFields, original: string[]): string {
  const allHours = Array.from({ length: 24 }, (_, i) => i)
  const allDom = Array.from({ length: 31 }, (_, i) => i + 1)
  const allMonths = Array.from({ length: 12 }, (_, i) => i + 1)
  const allDow = Array.from({ length: 7 }, (_, i) => i)

  const { minutes, hours, daysOfMonth, months, daysOfWeek } = fields

  const parts: string[] = []

  // Time part
  const minuteAll = minutes.length === 60 && original[0] === '*'
  const hourAll = hours.length === 24 && original[1] === '*'

  if (minuteAll && hourAll) {
    parts.push('Every minute')
  } else if (minuteAll) {
    parts.push(`Every minute of ${describeField(hours, allHours, 'hour', 'hours', h => String(h) + ':00')}`)
  } else if (original[0].startsWith('*/') && hourAll) {
    const step = original[0].slice(2)
    parts.push(`Every ${step} minutes`)
  } else {
    const timeStr = hours.flatMap(h => minutes.map(m => padTime(h, m))).slice(0, 5).join(', ')
    parts.push(`At ${timeStr}`)
  }

  // Day of week
  const dowAll = daysOfWeek.length === 7 || original[4] === '*'
  if (!dowAll) {
    const dowStr = describeField(daysOfWeek, allDow, 'day', 'days', d => DAYS[d])
    parts.push(dowStr)
  }

  // Day of month
  const domAll = daysOfMonth.length === 31 || original[2] === '*'
  if (!domAll) {
    const ordinal = (n: number) => {
      const s = ['th', 'st', 'nd', 'rd']
      const v = n % 100
      return n + (s[(v - 20) % 10] || s[v] || s[0])
    }
    parts.push(`on the ${describeField(daysOfMonth, allDom, 'day', 'days', ordinal)} of the month`)
  }

  // Month
  const monAll = months.length === 12 || original[3] === '*'
  if (!monAll) {
    parts.push(`in ${describeField(months, allMonths, 'month', 'months', m => MONTHS[m - 1])}`)
  }

  return parts.join(', ')
}

// ── Next run times ─────────────────────────────────────────────────────────────

function getNextRuns(fields: CronFields, count: number): Date[] {
  const runs: Date[] = []
  const now = new Date()
  // Start searching from the next minute
  const start = new Date(now)
  start.setSeconds(0, 0)
  start.setMinutes(start.getMinutes() + 1)

  let candidate = new Date(start)
  let iterations = 0
  const MAX_ITER = 527040 // ~1 year of minutes

  while (runs.length < count && iterations < MAX_ITER) {
    iterations++
    const m = candidate.getMinutes()
    const h = candidate.getHours()
    const dom = candidate.getDate()
    const mon = candidate.getMonth() + 1 // 1-based
    const dow = candidate.getDay() // 0=Sun

    const monthMatch = fields.months.includes(mon)
    const dowMatch = fields.daysOfWeek.includes(dow)
    const domMatch = fields.daysOfMonth.includes(dom)
    const hourMatch = fields.hours.includes(h)
    const minMatch = fields.minutes.includes(m)

    if (monthMatch && (dowMatch || domMatch) && hourMatch && minMatch) {
      runs.push(new Date(candidate))
    }

    candidate = new Date(candidate.getTime() + 60 * 1000)
  }

  return runs
}

function formatDate(d: Date): string {
  return d.toLocaleString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

// ── Component ─────────────────────────────────────────────────────────────────

interface ParseResult {
  description: string
  nextRuns: Date[]
}

export default function CronParserClient() {
  const [input, setInput] = useState('0 9 * * 1-5')
  const [result, setResult] = useState<ParseResult | null>(null)
  const [error, setError] = useState('')

  function parse(expr?: string) {
    const expression = (expr ?? input).trim()
    setError('')
    setResult(null)
    if (!expression) {
      setError('Please enter a cron expression.')
      return
    }
    try {
      const originalParts = expression.split(/\s+/)
      const fields = parseCron(expression)
      const description = buildDescription(fields, originalParts)
      const nextRuns = getNextRuns(fields, 5)
      setResult({ description, nextRuns })
    } catch (e: unknown) {
      setError((e as Error).message)
    }
  }

  function selectPreset(expr: string) {
    setInput(expr)
    parse(expr)
  }

  return (
    <div style={cardStyle}>
      {/* Presets */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 8, fontSize: 13, color: '#a78bfa', fontWeight: 600 }}>
          Common Presets
        </label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {PRESETS.map(({ label, expr }) => (
            <button
              key={expr}
              onClick={() => selectPreset(expr)}
              style={{
                padding: '6px 12px',
                borderRadius: 20,
                border: '1px solid rgba(124,58,237,0.4)',
                background: input === expr ? 'rgba(124,58,237,0.25)' : 'rgba(124,58,237,0.08)',
                color: input === expr ? 'var(--brand-2)' : '#a78bfa',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {label}
              <span style={{ color: '#666', marginLeft: 5, fontFamily: 'monospace', fontWeight: 400 }}>({expr})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div style={{ marginBottom: 14 }}>
        <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: '#a78bfa', fontWeight: 600 }}>
          Cron Expression
          <span style={{ color: '#888', marginLeft: 8, fontWeight: 400, fontSize: 12 }}>minute  hour  day  month  weekday</span>
        </label>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            type="text"
            style={inputStyle}
            value={input}
            onChange={e => { setInput(e.target.value); setError(''); setResult(null) }}
            onKeyDown={e => e.key === 'Enter' && parse()}
            placeholder="e.g. 0 9 * * 1-5"
            spellCheck={false}
          />
          <button style={{ ...btnStyle(true), flexShrink: 0 }} onClick={() => parse()}>Parse</button>
        </div>
      </div>

      {/* Field labels */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: 4,
        marginBottom: 16,
        padding: '8px 12px',
        background: 'rgba(255,255,255,0.02)',
        borderRadius: 8,
        border: '1px solid rgba(255,255,255,0.05)',
      }}>
        {[
          { label: 'Minute', range: '0-59' },
          { label: 'Hour', range: '0-23' },
          { label: 'Day', range: '1-31' },
          { label: 'Month', range: '1-12' },
          { label: 'Weekday', range: '0-6' },
        ].map(({ label, range }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#a78bfa' }}>{label}</div>
            <div style={{ fontSize: 10, color: '#666' }}>{range}</div>
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div style={{
          marginBottom: 16,
          padding: '10px 14px',
          borderRadius: 8,
          background: 'rgba(248,113,113,0.1)',
          border: '1px solid rgba(248,113,113,0.3)',
          color: '#f87171',
          fontSize: 13,
          fontFamily: 'monospace',
        }}>
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 4 }}>
          {/* Human-readable */}
          <div style={{
            padding: '14px 16px',
            borderRadius: 8,
            background: 'rgba(124,58,237,0.12)',
            border: '1px solid rgba(124,58,237,0.3)',
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#a78bfa', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>
              Description
            </div>
            <div style={{ fontSize: 15, color: '#e0e0ff', fontWeight: 600 }}>{result.description}</div>
          </div>

          {/* Next run times */}
          <div style={{
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.07)',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '8px 14px',
              background: 'rgba(255,255,255,0.03)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              fontSize: 11,
              fontWeight: 700,
              color: '#888',
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}>
              Next 5 Run Times
            </div>
            {result.nextRuns.length === 0 ? (
              <div style={{ padding: '12px 16px', color: '#f87171', fontSize: 13 }}>
                No upcoming runs found in the next year. Check your expression.
              </div>
            ) : (
              result.nextRuns.map((d, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 16px',
                    borderBottom: i < result.nextRuns.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                  }}
                >
                  <span style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: 'rgba(124,58,237,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#a78bfa',
                    flexShrink: 0,
                  }}>
                    {i + 1}
                  </span>
                  <span style={{ fontFamily: 'monospace', fontSize: 13, color: '#e0e0ff' }}>
                    {formatDate(d)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
