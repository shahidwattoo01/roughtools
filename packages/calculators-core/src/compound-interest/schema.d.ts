import { z } from 'zod';
export declare const CompoundInterestInputSchema: z.ZodObject<{
    principal: z.ZodNumber;
    annualRate: z.ZodNumber;
    years: z.ZodNumber;
    compoundFrequency: z.ZodDefault<z.ZodEnum<["annually", "semi-annually", "quarterly", "monthly", "daily"]>>;
    monthlyContribution: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    principal: number;
    annualRate: number;
    years: number;
    compoundFrequency: "annually" | "semi-annually" | "quarterly" | "monthly" | "daily";
    monthlyContribution: number;
}, {
    principal: number;
    annualRate: number;
    years: number;
    compoundFrequency?: "annually" | "semi-annually" | "quarterly" | "monthly" | "daily" | undefined;
    monthlyContribution?: number | undefined;
}>;
export declare const CompoundInterestOutputSchema: z.ZodObject<{
    finalAmount: z.ZodNumber;
    totalContributions: z.ZodNumber;
    totalInterest: z.ZodNumber;
    effectiveRate: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    totalInterest: number;
    effectiveRate: number;
    finalAmount: number;
    totalContributions: number;
}, {
    totalInterest: number;
    effectiveRate: number;
    finalAmount: number;
    totalContributions: number;
}>;
export type CompoundInterestInput = z.infer<typeof CompoundInterestInputSchema>;
export type CompoundInterestOutput = z.infer<typeof CompoundInterestOutputSchema>;
//# sourceMappingURL=schema.d.ts.map