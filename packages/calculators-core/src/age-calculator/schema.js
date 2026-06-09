"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgeCalculatorOutputSchema = exports.AgeCalculatorInputSchema = void 0;
const zod_1 = require("zod");
exports.AgeCalculatorInputSchema = zod_1.z.object({
    birthDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format must be YYYY-MM-DD'),
    toDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format must be YYYY-MM-DD').optional(),
});
exports.AgeCalculatorOutputSchema = zod_1.z.object({
    years: zod_1.z.number(),
    months: zod_1.z.number(),
    days: zod_1.z.number(),
    totalDays: zod_1.z.number(),
    totalMonths: zod_1.z.number(),
    nextBirthday: zod_1.z.number(),
});
//# sourceMappingURL=schema.js.map