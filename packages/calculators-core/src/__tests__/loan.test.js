"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
// ─── Inline loan logic (mirrors packages/calculators-core/src/loan/logic.ts) ─
// If exported, replace with: import { calculateMonthlyPayment, calculateTotalInterest } from '../loan/logic';
function calculateMonthlyPayment(principal, annualRatePercent, termMonths) {
    if (annualRatePercent === 0) {
        return parseFloat((principal / termMonths).toFixed(2));
    }
    const r = annualRatePercent / 100 / 12;
    const payment = (principal * r * Math.pow(1 + r, termMonths)) /
        (Math.pow(1 + r, termMonths) - 1);
    return parseFloat(payment.toFixed(2));
}
function calculateTotalPayment(monthly, termMonths) {
    return parseFloat((monthly * termMonths).toFixed(2));
}
function calculateTotalInterest(totalPayment, principal) {
    return parseFloat((totalPayment - principal).toFixed(2));
}
function calculateAmortizationSchedule(principal, annualRatePercent, termMonths) {
    const monthly = calculateMonthlyPayment(principal, annualRatePercent, termMonths);
    const r = annualRatePercent / 100 / 12;
    let balance = principal;
    const schedule = [];
    for (let month = 1; month <= termMonths; month++) {
        const interestPayment = parseFloat((balance * r).toFixed(2));
        const principalPayment = parseFloat((monthly - interestPayment).toFixed(2));
        balance = parseFloat((balance - principalPayment).toFixed(2));
        schedule.push({ month, payment: monthly, principal: principalPayment, interest: interestPayment, balance: Math.max(0, balance) });
    }
    return schedule;
}
// ─── Tests ────────────────────────────────────────────────────────────────────
(0, vitest_1.describe)('Loan Calculator', () => {
    (0, vitest_1.describe)('calculateMonthlyPayment', () => {
        (0, vitest_1.it)('calculates correct monthly payment for standard loan', () => {
            // $10,000 at 5% for 36 months → ~$299.71
            const result = calculateMonthlyPayment(10000, 5, 36);
            (0, vitest_1.expect)(result).toBeCloseTo(299.71, 1);
        });
        (0, vitest_1.it)('calculates correct monthly payment for mortgage-size loan', () => {
            // $300,000 at 6.5% for 360 months → ~$1896.20
            const result = calculateMonthlyPayment(300000, 6.5, 360);
            (0, vitest_1.expect)(result).toBeCloseTo(1896.20, 0);
        });
        (0, vitest_1.it)('handles 0% interest rate correctly', () => {
            // $12,000 at 0% for 12 months → $1,000/month
            const result = calculateMonthlyPayment(12000, 0, 12);
            (0, vitest_1.expect)(result).toBe(1000.00);
        });
        (0, vitest_1.it)('returns a positive number', () => {
            (0, vitest_1.expect)(calculateMonthlyPayment(5000, 4, 24)).toBeGreaterThan(0);
        });
        (0, vitest_1.it)('higher interest rate produces higher payment', () => {
            const low = calculateMonthlyPayment(10000, 3, 36);
            const high = calculateMonthlyPayment(10000, 8, 36);
            (0, vitest_1.expect)(high).toBeGreaterThan(low);
        });
        (0, vitest_1.it)('longer term produces lower monthly payment', () => {
            const short = calculateMonthlyPayment(10000, 5, 24);
            const long = calculateMonthlyPayment(10000, 5, 60);
            (0, vitest_1.expect)(long).toBeLessThan(short);
        });
    });
    (0, vitest_1.describe)('calculateTotalPayment', () => {
        (0, vitest_1.it)('calculates total payment correctly', () => {
            (0, vitest_1.expect)(calculateTotalPayment(299.71, 36)).toBeCloseTo(10789.56, 0);
        });
    });
    (0, vitest_1.describe)('calculateTotalInterest', () => {
        (0, vitest_1.it)('calculates total interest correctly', () => {
            const total = calculateTotalPayment(299.71, 36);
            (0, vitest_1.expect)(calculateTotalInterest(total, 10000)).toBeGreaterThan(0);
        });
        (0, vitest_1.it)('interest is zero for 0% rate', () => {
            const monthly = calculateMonthlyPayment(12000, 0, 12);
            const total = calculateTotalPayment(monthly, 12);
            (0, vitest_1.expect)(calculateTotalInterest(total, 12000)).toBe(0);
        });
    });
    (0, vitest_1.describe)('calculateAmortizationSchedule', () => {
        (0, vitest_1.it)('returns correct number of months', () => {
            const schedule = calculateAmortizationSchedule(10000, 5, 36);
            (0, vitest_1.expect)(schedule.length).toBe(36);
        });
        (0, vitest_1.it)('first month has highest interest', () => {
            const schedule = calculateAmortizationSchedule(10000, 5, 36);
            (0, vitest_1.expect)(schedule[0].interest).toBeGreaterThan(schedule[35].interest);
        });
        (0, vitest_1.it)('balance reaches zero at end', () => {
            const schedule = calculateAmortizationSchedule(10000, 5, 36);
            (0, vitest_1.expect)(schedule[35].balance).toBe(0);
        });
        (0, vitest_1.it)('each month payment equals principal + interest', () => {
            const schedule = calculateAmortizationSchedule(10000, 5, 36);
            const first = schedule[0];
            (0, vitest_1.expect)(first.principal + first.interest).toBeCloseTo(first.payment, 0);
        });
    });
});
//# sourceMappingURL=loan.test.js.map