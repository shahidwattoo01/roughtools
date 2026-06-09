import type { LoanInput, LoanOutput } from './schema'

export function calculateLoan(input: LoanInput): LoanOutput {
  const monthlyRate = input.interestRate / 100 / 12
  const numPayments = input.loanTerm * 12

  const monthlyPayment =
    (input.loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1)

  const totalPayment = monthlyPayment * numPayments

  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalPayment:   Math.round(totalPayment * 100) / 100,
    totalInterest:  Math.round((totalPayment - input.loanAmount) * 100) / 100,
    principal:      input.loanAmount,
  }
}