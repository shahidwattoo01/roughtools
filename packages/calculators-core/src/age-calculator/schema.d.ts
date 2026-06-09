import { z } from 'zod';
export declare const AgeCalculatorInputSchema: z.ZodObject<{
    birthDate: z.ZodString;
    toDate: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    birthDate: string;
    toDate?: string | undefined;
}, {
    birthDate: string;
    toDate?: string | undefined;
}>;
export declare const AgeCalculatorOutputSchema: z.ZodObject<{
    years: z.ZodNumber;
    months: z.ZodNumber;
    days: z.ZodNumber;
    totalDays: z.ZodNumber;
    totalMonths: z.ZodNumber;
    nextBirthday: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    years: number;
    months: number;
    days: number;
    totalDays: number;
    totalMonths: number;
    nextBirthday: number;
}, {
    years: number;
    months: number;
    days: number;
    totalDays: number;
    totalMonths: number;
    nextBirthday: number;
}>;
export type AgeCalculatorInput = z.infer<typeof AgeCalculatorInputSchema>;
export type AgeCalculatorOutput = z.infer<typeof AgeCalculatorOutputSchema>;
//# sourceMappingURL=schema.d.ts.map