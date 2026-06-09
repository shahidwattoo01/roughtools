"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TipCalculatorOutputSchema = exports.TipCalculatorInputSchema = void 0;
const zod_1 = require("zod");
exports.TipCalculatorInputSchema = zod_1.z.object({
    billAmount: zod_1.z.number().positive(),
    tipPercent: zod_1.z.number().min(0),
    splitBetween: zod_1.z.number().positive().int().default(1),
});
exports.TipCalculatorOutputSchema = zod_1.z.object({
    tipAmount: zod_1.z.number(),
    totalAmount: zod_1.z.number(),
    perPerson: zod_1.z.number(),
    tipPerPerson: zod_1.z.number(),
});
//# sourceMappingURL=schema.js.map