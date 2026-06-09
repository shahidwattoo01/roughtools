import { describe, it, expect } from 'vitest';

// ─── Inline BMI logic (mirrors packages/calculators-core/src/bmi/logic.ts) ───
// If your logic is exported, replace with: import { calculateBMI, getBMICategory } from '../bmi/logic';

function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return parseFloat((weightKg / (heightM * heightM)).toFixed(2));
}

function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25)   return 'Normal weight';
  if (bmi < 30)   return 'Overweight';
  return 'Obese';
}

function calculateBMIImperial(weightLbs: number, heightInches: number): number {
  return parseFloat(((weightLbs / (heightInches * heightInches)) * 703).toFixed(2));
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('BMI Calculator', () => {

  describe('calculateBMI (metric)', () => {
    it('calculates correct BMI for normal weight person', () => {
      // 70kg, 175cm → BMI ~22.86
      expect(calculateBMI(70, 175)).toBe(22.86);
    });

    it('calculates correct BMI for underweight person', () => {
      // 45kg, 170cm → BMI ~15.57
      expect(calculateBMI(45, 170)).toBe(15.57);
    });

    it('calculates correct BMI for overweight person', () => {
      // 90kg, 175cm → BMI ~29.39
      expect(calculateBMI(90, 175)).toBe(29.39);
    });

    it('calculates correct BMI for obese person', () => {
      // 120kg, 170cm → BMI ~41.52
      expect(calculateBMI(120, 170)).toBe(41.52);
    });

    it('returns a number with max 2 decimal places', () => {
      const result = calculateBMI(73, 178);
      expect(result.toString().split('.')[1]?.length ?? 0).toBeLessThanOrEqual(2);
    });
  });

  describe('calculateBMI (imperial)', () => {
    it('calculates BMI from pounds and inches', () => {
      // 154 lbs, 68 inches → BMI ~23.4
      const result = calculateBMIImperial(154, 68);
      expect(result).toBeGreaterThan(23);
      expect(result).toBeLessThan(24);
    });
  });

  describe('getBMICategory', () => {
    it('returns Underweight for BMI below 18.5', () => {
      expect(getBMICategory(17.0)).toBe('Underweight');
      expect(getBMICategory(18.4)).toBe('Underweight');
    });

    it('returns Normal weight for BMI 18.5–24.9', () => {
      expect(getBMICategory(18.5)).toBe('Normal weight');
      expect(getBMICategory(22.0)).toBe('Normal weight');
      expect(getBMICategory(24.9)).toBe('Normal weight');
    });

    it('returns Overweight for BMI 25–29.9', () => {
      expect(getBMICategory(25.0)).toBe('Overweight');
      expect(getBMICategory(27.5)).toBe('Overweight');
      expect(getBMICategory(29.9)).toBe('Overweight');
    });

    it('returns Obese for BMI 30 and above', () => {
      expect(getBMICategory(30.0)).toBe('Obese');
      expect(getBMICategory(40.0)).toBe('Obese');
    });

    it('handles exact boundary values correctly', () => {
      expect(getBMICategory(18.5)).toBe('Normal weight');
      expect(getBMICategory(25.0)).toBe('Overweight');
      expect(getBMICategory(30.0)).toBe('Obese');
    });
  });

  describe('Edge cases', () => {
    it('handles very tall person', () => {
      const bmi = calculateBMI(80, 210);
      expect(bmi).toBeGreaterThan(0);
      expect(bmi).toBeLessThan(30);
    });

    it('handles very short person', () => {
      const bmi = calculateBMI(50, 140);
      expect(bmi).toBeGreaterThan(0);
    });
  });
});