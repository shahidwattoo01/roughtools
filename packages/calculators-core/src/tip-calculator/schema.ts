import { z } from 'zod'

export const TipCalculatorInputSchema = z.object({
  billAmount:  z.number().positive(),
  tipPercent:  z.number().min(0),
  splitBetween: z.number().positive().int().default(1),
})

export const TipCalculatorOutputSchema = z.object({
  tipAmount:     z.number(),
  totalAmount:   z.number(),
  perPerson:     z.number(),
  tipPerPerson:  z.number(),
})

export type TipCalculatorInput  = z.infer<typeof TipCalculatorInputSchema>
export type TipCalculatorOutput = z.infer<typeof TipCalculatorOutputSchema>