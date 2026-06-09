import { z } from 'zod'

export const AgeCalculatorInputSchema = z.object({
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format must be YYYY-MM-DD'),
  toDate:    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format must be YYYY-MM-DD').optional(),
})

export const AgeCalculatorOutputSchema = z.object({
  years:         z.number(),
  months:        z.number(),
  days:          z.number(),
  totalDays:     z.number(),
  totalMonths:   z.number(),
  nextBirthday:  z.number(),
})

export type AgeCalculatorInput  = z.infer<typeof AgeCalculatorInputSchema>
export type AgeCalculatorOutput = z.infer<typeof AgeCalculatorOutputSchema>