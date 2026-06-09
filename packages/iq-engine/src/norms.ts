// ─── IQ → Percentile lookup table (standard normal CDF, mean=100, SD=15) ────

export const IQ_PERCENTILE: Record<number, number> = {
  55: 0.1, 58: 0.3, 61: 0.5, 64: 0.9, 67: 1.5,
  70: 2.3, 73: 3.6, 76: 5.5, 79: 8.1, 82: 11.5,
  85: 15.9, 88: 21.2, 91: 27.4, 94: 34.5, 97: 42.1,
  100: 50.0, 103: 57.9, 106: 65.5, 109: 72.6, 112: 78.8,
  115: 84.1, 118: 88.5, 121: 91.9, 124: 94.5, 127: 96.4,
  130: 97.7, 133: 98.5, 136: 99.1, 139: 99.5, 142: 99.7,
  145: 99.9, 148: 99.93, 151: 99.97, 155: 99.99, 160: 99.99,
}

/** Interpolated percentile for any IQ score 55–160 */
export function iqToPercentile(iq: number): number {
  const clamped = Math.min(160, Math.max(55, Math.round(iq)))
  if (IQ_PERCENTILE[clamped] !== undefined) return IQ_PERCENTILE[clamped]

  // Linear interpolation between nearest keys
  const keys = Object.keys(IQ_PERCENTILE).map(Number).sort((a, b) => a - b)
  const lo = keys.filter((k) => k <= clamped).at(-1) ?? keys[0]
  const hi = keys.filter((k) => k >= clamped)[0] ?? keys[keys.length - 1]
  if (lo === hi) return IQ_PERCENTILE[lo]
  const t = (clamped - lo) / (hi - lo)
  return IQ_PERCENTILE[lo] + t * (IQ_PERCENTILE[hi] - IQ_PERCENTILE[lo])
}

// ─── IQ classification bands ─────────────────────────────────────────────────

export function iqClassification(iq: number): string {
  if (iq >= 130) return 'Very Superior'
  if (iq >= 120) return 'Superior'
  if (iq >= 110) return 'High Average'
  if (iq >= 90)  return 'Average'
  if (iq >= 80)  return 'Low Average'
  if (iq >= 70)  return 'Borderline'
  return 'Extremely Low'
}

// ─── Default simulated norms (used before real population data) ───────────────
// Derived by running scoring algo against 1000 simulated users (N(0,1) ability)

export interface NormParams {
  meanRaw: number
  stdDevRaw: number
  version: string
}

export const DEFAULT_NORMS: Record<string, NormParams> = {
  AGE_18_24:   { meanRaw: 0.512, stdDevRaw: 0.148, version: 'v0.1-simulated' },
  AGE_25_34:   { meanRaw: 0.518, stdDevRaw: 0.152, version: 'v0.1-simulated' },
  AGE_35_44:   { meanRaw: 0.505, stdDevRaw: 0.149, version: 'v0.1-simulated' },
  AGE_45_54:   { meanRaw: 0.494, stdDevRaw: 0.151, version: 'v0.1-simulated' },
  AGE_55_64:   { meanRaw: 0.480, stdDevRaw: 0.153, version: 'v0.1-simulated' },
  AGE_65_PLUS: { meanRaw: 0.465, stdDevRaw: 0.155, version: 'v0.1-simulated' },
}
