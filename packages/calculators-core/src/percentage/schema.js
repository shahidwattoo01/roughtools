"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PercentageOutputSchema = exports.PercentageInputSchema = void 0;
const zod_1 = require("zod");
exports.PercentageInputSchema = zod_1.z.object({
    mode: zod_1.z.enum([
        'what-percent-of',
        'percent-change',
        'what-is-percent',
    ]),
    valueA: zod_1.z.number(),
    valueB: zod_1.z.number(),
});
exports.PercentageOutputSchema = zod_1.z.object({
    result: zod_1.z.number(),
    explanation: zod_1.z.string(),
});
//# sourceMappingURL=schema.js.map