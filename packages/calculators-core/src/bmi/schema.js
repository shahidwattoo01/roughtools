"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BMIOutputSchema = exports.BMIInputSchema = void 0;
const zod_1 = require("zod");
exports.BMIInputSchema = zod_1.z.object({
    weight: zod_1.z.number().positive('Weight must be positive'),
    height: zod_1.z.number().positive('Height must be positive'),
    unit: zod_1.z.enum(['metric', 'imperial']),
});
exports.BMIOutputSchema = zod_1.z.object({
    bmi: zod_1.z.number(),
    category: zod_1.z.enum(['Underweight', 'Normal weight', 'Overweight', 'Obese']),
    healthyWeightRange: zod_1.z.object({
        min: zod_1.z.number(),
        max: zod_1.z.number(),
    }),
});
//# sourceMappingURL=schema.js.map