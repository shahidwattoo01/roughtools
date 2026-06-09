import { z } from 'zod';
export declare const MortgageInputSchema: z.ZodObject<{
    homePrice: z.ZodNumber;
    downPayment: z.ZodNumber;
    interestRate: z.ZodNumber;
    loanTerm: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    homePrice: number;
    downPayment: number;
    interestRate: number;
    loanTerm: number;
}, {
    homePrice: number;
    downPayment: number;
    interestRate: number;
    loanTerm?: number | undefined;
}>;
export declare const MortgageOutputSchema: z.ZodObject<{
    monthlyPayment: z.ZodNumber;
    principal: z.ZodNumber;
    totalPayment: z.ZodNumber;
    totalInterest: z.ZodNumber;
    downPaymentPercent: z.ZodNumber;
    loanTerm: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    principal: number;
    loanTerm: number;
    monthlyPayment: number;
    totalPayment: number;
    totalInterest: number;
    downPaymentPercent: number;
}, {
    principal: number;
    loanTerm: number;
    monthlyPayment: number;
    totalPayment: number;
    totalInterest: number;
    downPaymentPercent: number;
}>;
export type MortgageInput = z.infer<typeof MortgageInputSchema>;
export type MortgageOutput = z.infer<typeof MortgageOutputSchema>;
//# sourceMappingURL=schema.d.ts.map