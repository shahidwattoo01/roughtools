"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaxOutputSchema = exports.TaxInputSchema = void 0;
const zod_1 = require("zod");
exports.TaxInputSchema = zod_1.z.object({
    income: zod_1.z.number().positive(),
    filingStatus: zod_1.z.enum(['single', 'married_joint', 'married_separate', 'head_of_household']).default('single'),
});
exports.TaxOutputSchema = zod_1.z.object({
    totalTax: zod_1.z.number(),
    effectiveRate: zod_1.z.number(),
    marginalRate: zod_1.z.number(),
    afterTax: zod_1.z.number(),
    monthlyTax: zod_1.z.number(),
    breakdown: zod_1.z.array(zod_1.z.object({
        bracket: zod_1.z.string(),
        tax: zod_1.z.number(),
        rate: zod_1.z.number(),
    })),
});
//# sourceMappingURL=schema.js.map