"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DaysBetweenDatesOutputSchema = exports.DaysBetweenDatesInputSchema = void 0;
const zod_1 = require("zod");
exports.DaysBetweenDatesInputSchema = zod_1.z.object({
    startDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    endDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
exports.DaysBetweenDatesOutputSchema = zod_1.z.object({
    days: zod_1.z.number(),
    weeks: zod_1.z.number(),
    months: zod_1.z.number(),
    years: zod_1.z.number(),
    weekdays: zod_1.z.number(),
    weekends: zod_1.z.number(),
});
//# sourceMappingURL=schema.js.map