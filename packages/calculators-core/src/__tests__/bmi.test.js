"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
// ─── Inline BMI logic (mirrors packages/calculators-core/src/bmi/logic.ts) ───
// If your logic is exported, replace with: import { calculateBMI, getBMICategory } from '../bmi/logic';
function calculateBMI(weightKg, heightCm) {
    const heightM = heightCm / 100;
    return parseFloat((weightKg / (heightM * heightM)).toFixed(2));
}
function getBMICategory(bmi) {
    if (bmi < 18.5)
        return 'Underweight';
    if (bmi < 25)
        return 'Normal weight';
    if (bmi < 30)
        return 'Overweight';
    return 'Obese';
}
function calculateBMIImperial(weightLbs, heightInches) {
    return parseFloat(((weightLbs / (heightInches * heightInches)) * 703).toFixed(2));
}
// ─── Tests ────────────────────────────────────────────────────────────────────
(0, vitest_1.describe)('BMI Calculator', () => {
    (0, vitest_1.describe)('calculateBMI (metric)', () => {
        (0, vitest_1.it)('calculates correct BMI for normal weight person', () => {
            // 70kg, 175cm → BMI ~22.86
            (0, vitest_1.expect)(calculateBMI(70, 175)).toBe(22.86);
        });
        (0, vitest_1.it)('calculates correct BMI for underweight person', () => {
            // 45kg, 170cm → BMI ~15.57
            (0, vitest_1.expect)(calculateBMI(45, 170)).toBe(15.57);
        });
        (0, vitest_1.it)('calculates correct BMI for overweight person', () => {
            // 90kg, 175cm → BMI ~29.39
            (0, vitest_1.expect)(calculateBMI(90, 175)).toBe(29.39);
        });
        (0, vitest_1.it)('calculates correct BMI for obese person', () => {
            // 120kg, 170cm → BMI ~41.52
            (0, vitest_1.expect)(calculateBMI(120, 170)).toBe(41.52);
        });
        (0, vitest_1.it)('returns a number with max 2 decimal places', () => {
            const result = calculateBMI(73, 178);
            (0, vitest_1.expect)(result.toString().split('.')[1]?.length ?? 0).toBeLessThanOrEqual(2);
        });
    });
    (0, vitest_1.describe)('calculateBMI (imperial)', () => {
        (0, vitest_1.it)('calculates BMI from pounds and inches', () => {
            // 154 lbs, 68 inches → BMI ~23.4
            const result = calculateBMIImperial(154, 68);
            (0, vitest_1.expect)(result).toBeGreaterThan(23);
            (0, vitest_1.expect)(result).toBeLessThan(24);
        });
    });
    (0, vitest_1.describe)('getBMICategory', () => {
        (0, vitest_1.it)('returns Underweight for BMI below 18.5', () => {
            (0, vitest_1.expect)(getBMICategory(17.0)).toBe('Underweight');
            (0, vitest_1.expect)(getBMICategory(18.4)).toBe('Underweight');
        });
        (0, vitest_1.it)('returns Normal weight for BMI 18.5–24.9', () => {
            (0, vitest_1.expect)(getBMICategory(18.5)).toBe('Normal weight');
            (0, vitest_1.expect)(getBMICategory(22.0)).toBe('Normal weight');
            (0, vitest_1.expect)(getBMICategory(24.9)).toBe('Normal weight');
        });
        (0, vitest_1.it)('returns Overweight for BMI 25–29.9', () => {
            (0, vitest_1.expect)(getBMICategory(25.0)).toBe('Overweight');
            (0, vitest_1.expect)(getBMICategory(27.5)).toBe('Overweight');
            (0, vitest_1.expect)(getBMICategory(29.9)).toBe('Overweight');
        });
        (0, vitest_1.it)('returns Obese for BMI 30 and above', () => {
            (0, vitest_1.expect)(getBMICategory(30.0)).toBe('Obese');
            (0, vitest_1.expect)(getBMICategory(40.0)).toBe('Obese');
        });
        (0, vitest_1.it)('handles exact boundary values correctly', () => {
            (0, vitest_1.expect)(getBMICategory(18.5)).toBe('Normal weight');
            (0, vitest_1.expect)(getBMICategory(25.0)).toBe('Overweight');
            (0, vitest_1.expect)(getBMICategory(30.0)).toBe('Obese');
        });
    });
    (0, vitest_1.describe)('Edge cases', () => {
        (0, vitest_1.it)('handles very tall person', () => {
            const bmi = calculateBMI(80, 210);
            (0, vitest_1.expect)(bmi).toBeGreaterThan(0);
            (0, vitest_1.expect)(bmi).toBeLessThan(30);
        });
        (0, vitest_1.it)('handles very short person', () => {
            const bmi = calculateBMI(50, 140);
            (0, vitest_1.expect)(bmi).toBeGreaterThan(0);
        });
    });
});
//# sourceMappingURL=bmi.test.js.map