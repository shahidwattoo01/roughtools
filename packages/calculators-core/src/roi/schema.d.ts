import { z } from 'zod';
export declare const RoiInputSchema: z.ZodObject<{
    initialInvestment: z.ZodNumber;
    finalValue: z.ZodNumber;
    years: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    initialInvestment: number;
    finalValue: number;
    years?: number | undefined;
}, {
    initialInvestment: number;
    finalValue: number;
    years?: number | undefined;
}>;
export declare const RoiOutputSchema: z.ZodObject<{
    roi: z.ZodNumber;
    profit: z.ZodNumber;
    totalReturn: z.ZodNumber;
    annualizedRoi: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    roi: number;
    profit: number;
    totalReturn: number;
    annualizedRoi: number;
}, {
    roi: number;
    profit: number;
    totalReturn: number;
    annualizedRoi: number;
}>;
export type RoiInput = z.infer<typeof RoiInputSchema>;
export type RoiOutput = z.infer<typeof RoiOutputSchema>;
//# sourceMappingURL=schema.d.ts.map