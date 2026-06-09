"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanOutputSchema = exports.LoanInputSchema = void 0;
const zod_1 = require("zod");
exports.LoanInputSchema = zod_1.z.object({
    loanAmount: zod_1.z.number().positive(),
    interestRate: zod_1.z.number().positive(),
    loanTerm: zod_1.z.number().positive(),
});
exports.LoanOutputSchema = zod_1.z.object({
    monthlyPayment: zod_1.z.number(),
    totalPayment: zod_1.z.number(),
    totalInterest: zod_1.z.number(),
    principal: zod_1.z.number(),
});
//# sourceMappingURL=schema.js.map