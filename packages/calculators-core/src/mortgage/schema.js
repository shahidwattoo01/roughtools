"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MortgageOutputSchema = exports.MortgageInputSchema = void 0;
const zod_1 = require("zod");
exports.MortgageInputSchema = zod_1.z.object({
    homePrice: zod_1.z.number().positive(),
    downPayment: zod_1.z.number().min(0),
    interestRate: zod_1.z.number().positive(),
    loanTerm: zod_1.z.number().positive().default(30),
});
exports.MortgageOutputSchema = zod_1.z.object({
    monthlyPayment: zod_1.z.number(),
    principal: zod_1.z.number(),
    totalPayment: zod_1.z.number(),
    totalInterest: zod_1.z.number(),
    downPaymentPercent: zod_1.z.number(),
    loanTerm: zod_1.z.number(),
});
//# sourceMappingURL=schema.js.map