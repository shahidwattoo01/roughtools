import { z } from 'zod';
export declare const TipCalculatorInputSchema: z.ZodObject<{
    billAmount: z.ZodNumber;
    tipPercent: z.ZodNumber;
    splitBetween: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    billAmount: number;
    tipPercent: number;
    splitBetween: number;
}, {
    billAmount: number;
    tipPercent: number;
    splitBetween?: number | undefined;
}>;
export declare const TipCalculatorOutputSchema: z.ZodObject<{
    tipAmount: z.ZodNumber;
    totalAmount: z.ZodNumber;
    perPerson: z.ZodNumber;
    tipPerPerson: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    tipAmount: number;
    totalAmount: number;
    perPerson: number;
    tipPerPerson: number;
}, {
    tipAmount: number;
    totalAmount: number;
    perPerson: number;
    tipPerPerson: number;
}>;
export type TipCalculatorInput = z.infer<typeof TipCalculatorInputSchema>;
export type TipCalculatorOutput = z.infer<typeof TipCalculatorOutputSchema>;
//# sourceMappingURL=schema.d.ts.map