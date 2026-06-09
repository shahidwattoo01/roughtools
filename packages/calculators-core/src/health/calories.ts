import { CalorieResult } from '../types'

interface CalorieInput {
  weight: number
  height: number
  age: number
  gender: 'male' | 'female'
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
  unit?: 'metric' | 'imperial'
}

const ACTIVITY_MULTIPLIERS = {
  sedentary:   1.2,
  light:       1.375,
  moderate:    1.55,
  active:      1.725,
  very_active: 1.9,
}

export function calculateCalories({
  weight, height, age, gender, activityLevel, unit = 'metric'
}: CalorieInput): CalorieResult {
  try {
    let weightKg = weight
    let heightCm = height

    if (unit === 'imperial') {
      weightKg = weight * 0.453592
      heightCm = height * 2.54
    }

    // Mifflin-St Jeor equation
    let bmr: number
    if (gender === 'male') {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161
    }

    const multiplier = ACTIVITY_MULTIPLIERS[activityLevel]
    const tdee = bmr * multiplier

    return {
      success: true,
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      weightLoss: Math.round(tdee - 500),
      weightGain: Math.round(tdee + 500),
      maintain: Math.round(tdee),
    }
  } catch {
    return { success: false, error: 'Calculation failed', bmr: 0, tdee: 0, weightLoss: 0, weightGain: 0, maintain: 0 }
  }
}