import { z } from 'zod'

export const LoanInputSchema = z.object({
  loanAmount:   z.number().positive(),
  interestRate: z.number().positive(),
  loanTerm:     z.number().positive(),
})

export const LoanOutputSchema = z.object({
  monthlyPayment: z.number(),
  totalPayment:   z.number(),
  totalInterest:  z.number(),
  principal:      z.number(),
})

export type LoanInput  = z.infer<typeof LoanInputSchema>
export type LoanOutput = z.infer<typeof LoanOutputSchema>