import { z } from 'zod'

export const TaxInputSchema = z.object({
  income:       z.number().positive(),
  filingStatus: z.enum(['single', 'married_joint', 'married_separate', 'head_of_household']).default('single'),
})

export const TaxOutputSchema = z.object({
  totalTax:      z.number(),
  effectiveRate: z.number(),
  marginalRate:  z.number(),
  afterTax:      z.number(),
  monthlyTax:    z.number(),
  breakdown: z.array(z.object({
    bracket: z.string(),
    tax:     z.number(),
    rate:    z.number(),
  })),
})

export type TaxInput  = z.infer<typeof TaxInputSchema>
export type TaxOutput = z.infer<typeof TaxOutputSchema>