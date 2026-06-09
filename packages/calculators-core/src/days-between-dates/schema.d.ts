import { z } from 'zod';
export declare const DaysBetweenDatesInputSchema: z.ZodObject<{
    startDate: z.ZodString;
    endDate: z.ZodString;
}, "strip", z.ZodTypeAny, {
    startDate: string;
    endDate: string;
}, {
    startDate: string;
    endDate: string;
}>;
export declare const DaysBetweenDatesOutputSchema: z.ZodObject<{
    days: z.ZodNumber;
    weeks: z.ZodNumber;
    months: z.ZodNumber;
    years: z.ZodNumber;
    weekdays: z.ZodNumber;
    weekends: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    years: number;
    months: number;
    days: number;
    weeks: number;
    weekdays: number;
    weekends: number;
}, {
    years: number;
    months: number;
    days: number;
    weeks: number;
    weekdays: number;
    weekends: number;
}>;
export type DaysBetweenDatesInput = z.infer<typeof DaysBetweenDatesInputSchema>;
export type DaysBetweenDatesOutput = z.infer<typeof DaysBetweenDatesOutputSchema>;
//# sourceMappingURL=schema.d.ts.map