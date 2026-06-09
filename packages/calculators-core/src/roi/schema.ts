import { z } from 'zod'

export const RoiInputSchema = z.object({
  initialInvestment: z.number().positive(),
  finalValue:        z.number(),
  years:             z.number().positive().optional(),
})

export const RoiOutputSchema = z.object({
  roi:           z.number(),
  profit:        z.number(),
  totalReturn:   z.number(),
  annualizedRoi: z.number(),
})

export type RoiInput  = z.infer<typeof RoiInputSchema>
export type RoiOutput = z.infer<typeof RoiOutputSchema>