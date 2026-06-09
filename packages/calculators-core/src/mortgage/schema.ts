import { z } from 'zod'

export const MortgageInputSchema = z.object({
  homePrice:    z.number().positive(),
  downPayment:  z.number().min(0),
  interestRate: z.number().positive(),
  loanTerm:     z.number().positive().default(30),
})

export const MortgageOutputSchema = z.object({
  monthlyPayment:     z.number(),
  principal:          z.number(),
  totalPayment:       z.number(),
  totalInterest:      z.number(),
  downPaymentPercent: z.number(),
  loanTerm:           z.number(),
})

export type MortgageInput  = z.infer<typeof MortgageInputSchema>
export type MortgageOutput = z.infer<typeof MortgageOutputSchema>