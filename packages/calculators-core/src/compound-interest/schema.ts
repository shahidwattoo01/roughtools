import { z } from 'zod'

export const CompoundInterestInputSchema = z.object({
  principal:        z.number().positive(),
  annualRate:       z.number().positive(),
  years:            z.number().positive(),
  compoundFrequency: z.enum(['annually', 'semi-annually', 'quarterly', 'monthly', 'daily']).default('monthly'),
  monthlyContribution: z.number().min(0).default(0),
})

export const CompoundInterestOutputSchema = z.object({
  finalAmount:        z.number(),
  totalContributions: z.number(),
  totalInterest:      z.number(),
  effectiveRate:      z.number(),
})

export type CompoundInterestInput  = z.infer<typeof CompoundInterestInputSchema>
export type CompoundInterestOutput = z.infer<typeof CompoundInterestOutputSchema>