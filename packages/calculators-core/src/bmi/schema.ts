import { z } from 'zod'

export const BMIInputSchema = z.object({
  weight: z.number().positive('Weight must be positive'),
  height: z.number().positive('Height must be positive'),
  unit: z.enum(['metric', 'imperial']),
})

export const BMIOutputSchema = z.object({
  bmi: z.number(),
  category: z.enum(['Underweight', 'Normal weight', 'Overweight', 'Obese']),
  healthyWeightRange: z.object({
    min: z.number(),
    max: z.number(),
  }),
})

export type BMIInput = z.infer<typeof BMIInputSchema>
export type BMIOutput = z.infer<typeof BMIOutputSchema>