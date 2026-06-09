import { z } from 'zod'

export const DaysBetweenDatesInputSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate:   z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})

export const DaysBetweenDatesOutputSchema = z.object({
  days:         z.number(),
  weeks:        z.number(),
  months:       z.number(),
  years:        z.number(),
  weekdays:     z.number(),
  weekends:     z.number(),
})

export type DaysBetweenDatesInput  = z.infer<typeof DaysBetweenDatesInputSchema>
export type DaysBetweenDatesOutput = z.infer<typeof DaysBetweenDatesOutputSchema>