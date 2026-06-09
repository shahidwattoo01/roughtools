import { z } from 'zod';
export declare const TaxInputSchema: z.ZodObject<{
    income: z.ZodNumber;
    filingStatus: z.ZodDefault<z.ZodEnum<["single", "married_joint", "married_separate", "head_of_household"]>>;
}, "strip", z.ZodTypeAny, {
    income: number;
    filingStatus: "single" | "married_joint" | "married_separate" | "head_of_household";
}, {
    income: number;
    filingStatus?: "single" | "married_joint" | "married_separate" | "head_of_household" | undefined;
}>;
export declare const TaxOutputSchema: z.ZodObject<{
    totalTax: z.ZodNumber;
    effectiveRate: z.ZodNumber;
    marginalRate: z.ZodNumber;
    afterTax: z.ZodNumber;
    monthlyTax: z.ZodNumber;
    breakdown: z.ZodArray<z.ZodObject<{
        bracket: z.ZodString;
        tax: z.ZodNumber;
        rate: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        rate: number;
        bracket: string;
        tax: number;
    }, {
        rate: number;
        bracket: string;
        tax: number;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    totalTax: number;
    effectiveRate: number;
    marginalRate: number;
    afterTax: number;
    monthlyTax: number;
    breakdown: {
        rate: number;
        bracket: string;
        tax: number;
    }[];
}, {
    totalTax: number;
    effectiveRate: number;
    marginalRate: number;
    afterTax: number;
    monthlyTax: number;
    breakdown: {
        rate: number;
        bracket: string;
        tax: number;
    }[];
}>;
export type TaxInput = z.infer<typeof TaxInputSchema>;
export type TaxOutput = z.infer<typeof TaxOutputSchema>;
//# sourceMappingURL=schema.d.ts.map