"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTax = calculateTax;
const BRACKETS = {
    single: [
        { min: 0, max: 11600, rate: 0.10 },
        { min: 11600, max: 47150, rate: 0.12 },
        { min: 47150, max: 100525, rate: 0.22 },
        { min: 100525, max: 191950, rate: 0.24 },
        { min: 191950, max: 243725, rate: 0.32 },
        { min: 243725, max: 609350, rate: 0.35 },
        { min: 609350, max: Infinity, rate: 0.37 },
    ],
    married_joint: [
        { min: 0, max: 23200, rate: 0.10 },
        { min: 23200, max: 94300, rate: 0.12 },
        { min: 94300, max: 201050, rate: 0.22 },
        { min: 201050, max: 383900, rate: 0.24 },
        { min: 383900, max: 487450, rate: 0.32 },
        { min: 487450, max: 731200, rate: 0.35 },
        { min: 731200, max: Infinity, rate: 0.37 },
    ],
    married_separate: [
        { min: 0, max: 11600, rate: 0.10 },
        { min: 11600, max: 47150, rate: 0.12 },
        { min: 47150, max: 100525, rate: 0.22 },
        { min: 100525, max: 191950, rate: 0.24 },
        { min: 191950, max: 243725, rate: 0.32 },
        { min: 243725, max: 365600, rate: 0.35 },
        { min: 365600, max: Infinity, rate: 0.37 },
    ],
    head_of_household: [
        { min: 0, max: 16550, rate: 0.10 },
        { min: 16550, max: 63100, rate: 0.12 },
        { min: 63100, max: 100500, rate: 0.22 },
        { min: 100500, max: 191950, rate: 0.24 },
        { min: 191950, max: 243700, rate: 0.32 },
        { min: 243700, max: 609350, rate: 0.35 },
        { min: 609350, max: Infinity, rate: 0.37 },
    ],
};
function calculateTax(input) {
    const brackets = BRACKETS[input.filingStatus];
    let totalTax = 0;
    const breakdown = [];
    for (const bracket of brackets) {
        if (input.income > bracket.min) {
            const taxable = Math.min(input.income, bracket.max) - bracket.min;
            const tax = taxable * bracket.rate;
            totalTax += tax;
            if (tax > 0) {
                breakdown.push({
                    bracket: `$${bracket.min.toLocaleString()} – ${bracket.max === Infinity ? '∞' : '$' + bracket.max.toLocaleString()}`,
                    tax: Math.round(tax * 100) / 100,
                    rate: bracket.rate * 100,
                });
            }
        }
    }
    const marginal = brackets.find(b => input.income <= b.max) ?? brackets[brackets.length - 1];
    return {
        totalTax: Math.round(totalTax * 100) / 100,
        effectiveRate: Math.round((totalTax / input.income) * 1000) / 10,
        marginalRate: marginal.rate * 100,
        afterTax: Math.round((input.income - totalTax) * 100) / 100,
        monthlyTax: Math.round((totalTax / 12) * 100) / 100,
        breakdown,
    };
}
//# sourceMappingURL=logic.js.map