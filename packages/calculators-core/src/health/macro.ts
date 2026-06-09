import { MacroResult } from '../types'

interface MacroInput {
  calories: number
  goal: 'lose' | 'maintain' | 'gain'
  unit?: 'metric' | 'imperial'
}

const MACRO_RATIOS = {
  lose:     { protein: 0.40, carbs: 0.30, fat: 0.30 },
  maintain: { protein: 0.30, carbs: 0.40, fat: 0.30 },
  gain:     { protein: 0.25, carbs: 0.50, fat: 0.25 },
}

export function calculateMacros({ calories, goal }: MacroInput): MacroResult {
  try {
    const ratios = MACRO_RATIOS[goal]
    const protein = Math.round((calories * ratios.protein) / 4)
    const carbs   = Math.round((calories * ratios.carbs)   / 4)
    const fat     = Math.round((calories * ratios.fat)     / 9)

    return { success: true, protein, carbs, fat, calories }
  } catch {
    return { success: false, error: 'Calculation failed', protein: 0, carbs: 0, fat: 0, calories: 0 }
  }
}