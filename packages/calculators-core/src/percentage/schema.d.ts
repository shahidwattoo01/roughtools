import { z } from 'zod';
export declare const PercentageInputSchema: z.ZodObject<{
    mode: z.ZodEnum<["what-percent-of", "percent-change", "what-is-percent"]>;
    valueA: z.ZodNumber;
    valueB: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    mode: "what-percent-of" | "percent-change" | "what-is-percent";
    valueA: number;
    valueB: number;
}, {
    mode: "what-percent-of" | "percent-change" | "what-is-percent";
    valueA: number;
    valueB: number;
}>;
export declare const PercentageOutputSchema: z.ZodObject<{
    result: z.ZodNumber;
    explanation: z.ZodString;
}, "strip", z.ZodTypeAny, {
    result: number;
    explanation: string;
}, {
    result: number;
    explanation: string;
}>;
export type PercentageInput = z.infer<typeof PercentageInputSchema>;
export type PercentageOutput = z.infer<typeof PercentageOutputSchema>;
//# sourceMappingURL=schema.d.ts.map