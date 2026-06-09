import { z } from 'zod';
export declare const LoanInputSchema: z.ZodObject<{
    loanAmount: z.ZodNumber;
    interestRate: z.ZodNumber;
    loanTerm: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    interestRate: number;
    loanTerm: number;
    loanAmount: number;
}, {
    interestRate: number;
    loanTerm: number;
    loanAmount: number;
}>;
export declare const LoanOutputSchema: z.ZodObject<{
    monthlyPayment: z.ZodNumber;
    totalPayment: z.ZodNumber;
    totalInterest: z.ZodNumber;
    principal: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    principal: number;
    monthlyPayment: number;
    totalPayment: number;
    totalInterest: number;
}, {
    principal: number;
    monthlyPayment: number;
    totalPayment: number;
    totalInterest: number;
}>;
export type LoanInput = z.infer<typeof LoanInputSchema>;
export type LoanOutput = z.infer<typeof LoanOutputSchema>;
//# sourceMappingURL=schema.d.ts.map