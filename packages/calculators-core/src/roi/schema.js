"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoiOutputSchema = exports.RoiInputSchema = void 0;
const zod_1 = require("zod");
exports.RoiInputSchema = zod_1.z.object({
    initialInvestment: zod_1.z.number().positive(),
    finalValue: zod_1.z.number(),
    years: zod_1.z.number().positive().optional(),
});
exports.RoiOutputSchema = zod_1.z.object({
    roi: zod_1.z.number(),
    profit: zod_1.z.number(),
    totalReturn: zod_1.z.number(),
    annualizedRoi: zod_1.z.number(),
});
//# sourceMappingURL=schema.js.map