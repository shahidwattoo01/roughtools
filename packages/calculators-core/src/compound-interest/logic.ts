import type { CompoundInterestInput, CompoundInterestOutput } from './schema'

const FREQUENCY_MAP = {
  'annually':      1,
  'semi-annually': 2,
  'quarterly':     4,
  'monthly':       12,
  'daily':         365,
}

export function calculateCompoundInterest(input: CompoundInterestInput): CompoundInterestOutput {
  const n = FREQUENCY_MAP[input.compoundFrequency]
  const r = input.annualRate / 100
  const t = input.years

  // Principal growth: P(1 + r/n)^(nt)
  const principalGrowth = input.principal * Math.pow(1 + r / n, n * t)

  // Monthly contribution growth (future value of series)
  const monthlyRate = r / 12
  const months      = t * 12
  const contributionGrowth = input.monthlyContribution > 0
    ? input.monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)
    : 0

  const finalAmount        = principalGrowth + contributionGrowth
  const totalContributions = input.principal + (input.monthlyContribution * months)
  const totalInterest      = finalAmount - totalContributions
  const effectiveRate      = (Math.pow(1 + r / n, n) - 1) * 100

  return {
    finalAmount:        Math.round(finalAmount * 100) / 100,
    totalContributions: Math.round(totalContributions * 100) / 100,
    totalInterest:      Math.round(totalInterest * 100) / 100,
    effectiveRate:      Math.round(effectiveRate * 1000) / 10,
  }
}