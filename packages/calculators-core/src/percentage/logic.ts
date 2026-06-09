import type { PercentageInput, PercentageOutput } from './schema'

export function calculatePercentage(input: PercentageInput): PercentageOutput {
  const { mode, valueA, valueB } = input
  let result: number
  let explanation: string

  if (mode === 'what-percent-of') {
    // What is A% of B?
    result      = (valueA / 100) * valueB
    explanation = `${valueA}% of ${valueB} = ${round(result)}`
  } else if (mode === 'percent-change') {
    // Percentage change from A to B
    result      = ((valueB - valueA) / valueA) * 100
    explanation = `Change from ${valueA} to ${valueB} = ${round(result)}%`
  } else {
    // A is what percent of B?
    result      = (valueA / valueB) * 100
    explanation = `${valueA} is ${round(result)}% of ${valueB}`
  }

  return {
    result:      round(result),
    explanation,
  }
}

function round(n: number) {
  return Math.round(n * 100) / 100
}