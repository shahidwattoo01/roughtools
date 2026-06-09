import type { DaysBetweenDatesInput, DaysBetweenDatesOutput } from './schema'

export function calculateDaysBetweenDates(input: DaysBetweenDatesInput): DaysBetweenDatesOutput {
  const start = new Date(input.startDate)
  const end   = new Date(input.endDate)

  const msPerDay = 1000 * 60 * 60 * 24
  const days     = Math.round(Math.abs(end.getTime() - start.getTime()) / msPerDay)
  const weeks    = Math.floor(days / 7)
  const months   = Math.round(days / 30.44)
  const years    = Math.round(days / 365.25)

  // Count weekdays and weekends
  let weekdays = 0
  let weekends = 0
  const from   = start < end ? start : end
  const to     = start < end ? end   : start

  const current = new Date(from)
  while (current <= to) {
    const day = current.getDay()
    if (day === 0 || day === 6) weekends++
    else weekdays++
    current.setDate(current.getDate() + 1)
  }

  return { days, weeks, months, years, weekdays, weekends }
}