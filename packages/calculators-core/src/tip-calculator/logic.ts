import type { TipCalculatorInput, TipCalculatorOutput } from './schema'

export function calculateTipCalculator(input: TipCalculatorInput): TipCalculatorOutput {
  const tipAmount    = (input.billAmount * input.tipPercent) / 100
  const totalAmount  = input.billAmount + tipAmount
  const perPerson    = totalAmount / input.splitBetween
  const tipPerPerson = tipAmount   / input.splitBetween

  return {
    tipAmount:    round(tipAmount),
    totalAmount:  round(totalAmount),
    perPerson:    round(perPerson),
    tipPerPerson: round(tipPerPerson),
  }
}

function round(n: number) {
  return Math.round(n * 100) / 100
}