"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
// ─── Inline mortgage logic (mirrors calculators-core/src/mortgage/logic.ts) ──
// If exported, replace with: import { ... } from '../mortgage/logic';
function calculateMonthlyMortgage(homePrice, downPaymentPercent, annualRatePercent, termYears) {
    const principal = homePrice * (1 - downPaymentPercent / 100);
    const r = annualRatePercent / 100 / 12;
    const n = termYears * 12;
    if (r === 0)
        return parseFloat((principal / n).toFixed(2));
    const payment = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return parseFloat(payment.toFixed(2));
}
function calculateDownPayment(homePrice, downPaymentPercent) {
    return parseFloat((homePrice * (downPaymentPercent / 100)).toFixed(2));
}
function calculateLoanAmount(homePrice, downPaymentPercent) {
    return parseFloat((homePrice * (1 - downPaymentPercent / 100)).toFixed(2));
}
function calculateTotalMortgageCost(homePrice, downPaymentPercent, annualRatePercent, termYears) {
    const monthly = calculateMonthlyMortgage(homePrice, downPaymentPercent, annualRatePercent, termYears);
    const loanAmount = calculateLoanAmount(homePrice, downPaymentPercent);
    const totalPayment = parseFloat((monthly * termYears * 12).toFixed(2));
    const totalInterest = parseFloat((totalPayment - loanAmount).toFixed(2));
    return { monthly, totalPayment, totalInterest, loanAmount };
}
function requiresPMI(downPaymentPercent) {
    return downPaymentPercent < 20;
}
function estimatePMI(loanAmount, annualPMIRatePercent = 0.5) {
    return parseFloat(((loanAmount * (annualPMIRatePercent / 100)) / 12).toFixed(2));
}
// ─── Tests ────────────────────────────────────────────────────────────────────
(0, vitest_1.describe)('Mortgage Calculator', () => {
    (0, vitest_1.describe)('calculateMonthlyMortgage', () => {
        (0, vitest_1.it)('calculates correct payment for typical 30-year mortgage', () => {
            // $400,000 home, 20% down, 7% rate, 30 years → ~$2129
            const result = calculateMonthlyMortgage(400000, 20, 7, 30);
            (0, vitest_1.expect)(result).toBeGreaterThan(2100);
            (0, vitest_1.expect)(result).toBeLessThan(2200);
        });
        (0, vitest_1.it)('calculates correct payment for 15-year mortgage', () => {
            // $300,000 home, 20% down, 6% rate, 15 years → ~$2025
            const result = calculateMonthlyMortgage(300000, 20, 6, 15);
            (0, vitest_1.expect)(result).toBeGreaterThan(2000);
            (0, vitest_1.expect)(result).toBeLessThan(2100);
        });
        (0, vitest_1.it)('15-year payment is higher than 30-year payment', () => {
            const monthly30 = calculateMonthlyMortgage(300000, 20, 6, 30);
            const monthly15 = calculateMonthlyMortgage(300000, 20, 6, 15);
            (0, vitest_1.expect)(monthly15).toBeGreaterThan(monthly30);
        });
        (0, vitest_1.it)('higher down payment reduces monthly payment', () => {
            const low = calculateMonthlyMortgage(400000, 10, 6.5, 30);
            const high = calculateMonthlyMortgage(400000, 30, 6.5, 30);
            (0, vitest_1.expect)(high).toBeLessThan(low);
        });
        (0, vitest_1.it)('handles 0% interest rate', () => {
            // $240,000 home, 20% down = $192,000 loan, 0%, 30yr = $533.33/mo
            const result = calculateMonthlyMortgage(240000, 20, 0, 30);
            (0, vitest_1.expect)(result).toBeCloseTo(533.33, 1);
        });
    });
    (0, vitest_1.describe)('calculateDownPayment', () => {
        (0, vitest_1.it)('calculates 20% down payment correctly', () => {
            (0, vitest_1.expect)(calculateDownPayment(400000, 20)).toBe(80000);
        });
        (0, vitest_1.it)('calculates 10% down payment correctly', () => {
            (0, vitest_1.expect)(calculateDownPayment(350000, 10)).toBe(35000);
        });
        (0, vitest_1.it)('calculates 3.5% FHA down payment correctly', () => {
            (0, vitest_1.expect)(calculateDownPayment(200000, 3.5)).toBe(7000);
        });
    });
    (0, vitest_1.describe)('calculateLoanAmount', () => {
        (0, vitest_1.it)('calculates correct loan amount after down payment', () => {
            (0, vitest_1.expect)(calculateLoanAmount(400000, 20)).toBe(320000);
        });
        (0, vitest_1.it)('full price loan when 0% down', () => {
            (0, vitest_1.expect)(calculateLoanAmount(300000, 0)).toBe(300000);
        });
    });
    (0, vitest_1.describe)('calculateTotalMortgageCost', () => {
        (0, vitest_1.it)('total interest is positive', () => {
            const result = calculateTotalMortgageCost(400000, 20, 6.5, 30);
            (0, vitest_1.expect)(result.totalInterest).toBeGreaterThan(0);
        });
        (0, vitest_1.it)('total payment equals monthly × months', () => {
            const result = calculateTotalMortgageCost(400000, 20, 6.5, 30);
            (0, vitest_1.expect)(result.totalPayment).toBeCloseTo(result.monthly * 360, 0);
        });
        (0, vitest_1.it)('30-year costs more total interest than 15-year', () => {
            const r30 = calculateTotalMortgageCost(400000, 20, 6, 30);
            const r15 = calculateTotalMortgageCost(400000, 20, 6, 15);
            (0, vitest_1.expect)(r30.totalInterest).toBeGreaterThan(r15.totalInterest);
        });
    });
    (0, vitest_1.describe)('PMI', () => {
        (0, vitest_1.it)('requires PMI when down payment is less than 20%', () => {
            (0, vitest_1.expect)(requiresPMI(19.9)).toBe(true);
            (0, vitest_1.expect)(requiresPMI(10)).toBe(true);
            (0, vitest_1.expect)(requiresPMI(3.5)).toBe(true);
        });
        (0, vitest_1.it)('does not require PMI when down payment is 20% or more', () => {
            (0, vitest_1.expect)(requiresPMI(20)).toBe(false);
            (0, vitest_1.expect)(requiresPMI(25)).toBe(false);
        });
        (0, vitest_1.it)('calculates monthly PMI correctly', () => {
            // $320,000 loan at 0.5% annual = $133.33/mo
            (0, vitest_1.expect)(estimatePMI(320000)).toBeCloseTo(133.33, 1);
        });
    });
});
//# sourceMappingURL=mortgage.test.js.map