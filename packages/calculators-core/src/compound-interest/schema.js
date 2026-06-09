"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompoundInterestOutputSchema = exports.CompoundInterestInputSchema = void 0;
const zod_1 = require("zod");
exports.CompoundInterestInputSchema = zod_1.z.object({
    principal: zod_1.z.number().positive(),
    annualRate: zod_1.z.number().positive(),
    years: zod_1.z.number().positive(),
    compoundFrequency: zod_1.z.enum(['annually', 'semi-annually', 'quarterly', 'monthly', 'daily']).default('monthly'),
    monthlyContribution: zod_1.z.number().min(0).default(0),
});
exports.CompoundInterestOutputSchema = zod_1.z.object({
    finalAmount: zod_1.z.number(),
    totalContributions: zod_1.z.number(),
    totalInterest: zod_1.z.number(),
    effectiveRate: zod_1.z.number(),
});
//# sourceMappingURL=schema.js.map