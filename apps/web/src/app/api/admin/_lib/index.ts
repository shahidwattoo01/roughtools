export { requireAdmin } from '../../iq/admin/_lib/require-admin'
export { prisma }       from '../../iq/_lib/db'

/** Generate N days of mock time-series data ending today */
export function mockTimeSeries(days: number, base: number, variance = 0.3) {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(Date.now() - (days - 1 - i) * 86_400_000)
    return {
      date:  d.toISOString().slice(0, 10),
      value: Math.max(0, Math.round(base * (1 + (Math.random() - 0.5) * variance))),
    }
  })
}
