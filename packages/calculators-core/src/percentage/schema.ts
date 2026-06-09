import { z } from 'zod'

export const PercentageInputSchema = z.object({
  mode: z.enum([
    'what-percent-of',
    'percent-change',
    'what-is-percent',
  ]),
  valueA: z.number(),
  valueB: z.number(),
})

export const PercentageOutputSchema = z.object({
  result:      z.number(),
  explanation: z.string(),
})

export type PercentageInput  = z.infer<typeof PercentageInputSchema>
export type PercentageOutput = z.infer<typeof PercentageOutputSchema>