import { describe, it, expect } from 'vitest';

// ─── Inline mortgage logic (mirrors calculators-core/src/mortgage/logic.ts) ──
// If exported, replace with: import { ... } from '../mortgage/logic';

function calculateMonthlyMortgage(
  homePrice: number,
  downPaymentPercent: number,
  annualRatePercent: number,
  termYears: number,
): number {
  const principal = homePrice * (1 - downPaymentPercent / 100);
  const r = annualRatePercent / 100 / 12;
  const n = termYears * 12;
  if (r === 0) return parseFloat((principal / n).toFixed(2));
  const payment = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return parseFloat(payment.toFixed(2));
}

function calculateDownPayment(homePrice: number, downPaymentPercent: number): number {
  return parseFloat((homePrice * (downPaymentPercent / 100)).toFixed(2));
}

function calculateLoanAmount(homePrice: number, downPaymentPercent: number): number {
  return parseFloat((homePrice * (1 - downPaymentPercent / 100)).toFixed(2));
}

function calculateTotalMortgageCost(
  homePrice: number,
  downPaymentPercent: number,
  annualRatePercent: number,
  termYears: number,
): { monthly: number; totalPayment: number; totalInterest: number; loanAmount: number } {
  const monthly    = calculateMonthlyMortgage(homePrice, downPaymentPercent, annualRatePercent, termYears);
  const loanAmount = calculateLoanAmount(homePrice, downPaymentPercent);
  const totalPayment  = parseFloat((monthly * termYears * 12).toFixed(2));
  const totalInterest = parseFloat((totalPayment - loanAmount).toFixed(2));
  return { monthly, totalPayment, totalInterest, loanAmount };
}

function requiresPMI(downPaymentPercent: number): boolean {
  return downPaymentPercent < 20;
}

function estimatePMI(loanAmount: number, annualPMIRatePercent = 0.5): number {
  return parseFloat(((loanAmount * (annualPMIRatePercent / 100)) / 12).toFixed(2));
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Mortgage Calculator', () => {

  describe('calculateMonthlyMortgage', () => {
    it('calculates correct payment for typical 30-year mortgage', () => {
      // $400,000 home, 20% down, 7% rate, 30 years → ~$2129
      const result = calculateMonthlyMortgage(400000, 20, 7, 30);
      expect(result).toBeGreaterThan(2100);
      expect(result).toBeLessThan(2200);
    });

    it('calculates correct payment for 15-year mortgage', () => {
      // $300,000 home, 20% down, 6% rate, 15 years → ~$2025
      const result = calculateMonthlyMortgage(300000, 20, 6, 15);
      expect(result).toBeGreaterThan(2000);
      expect(result).toBeLessThan(2100);
    });

    it('15-year payment is higher than 30-year payment', () => {
      const monthly30 = calculateMonthlyMortgage(300000, 20, 6, 30);
      const monthly15 = calculateMonthlyMortgage(300000, 20, 6, 15);
      expect(monthly15).toBeGreaterThan(monthly30);
    });

    it('higher down payment reduces monthly payment', () => {
      const low  = calculateMonthlyMortgage(400000, 10, 6.5, 30);
      const high = calculateMonthlyMortgage(400000, 30, 6.5, 30);
      expect(high).toBeLessThan(low);
    });

    it('handles 0% interest rate', () => {
      // $240,000 home, 20% down = $192,000 loan, 0%, 30yr = $533.33/mo
      const result = calculateMonthlyMortgage(240000, 20, 0, 30);
      expect(result).toBeCloseTo(533.33, 1);
    });
  });

  describe('calculateDownPayment', () => {
    it('calculates 20% down payment correctly', () => {
      expect(calculateDownPayment(400000, 20)).toBe(80000);
    });

    it('calculates 10% down payment correctly', () => {
      expect(calculateDownPayment(350000, 10)).toBe(35000);
    });

    it('calculates 3.5% FHA down payment correctly', () => {
      expect(calculateDownPayment(200000, 3.5)).toBe(7000);
    });
  });

  describe('calculateLoanAmount', () => {
    it('calculates correct loan amount after down payment', () => {
      expect(calculateLoanAmount(400000, 20)).toBe(320000);
    });

    it('full price loan when 0% down', () => {
      expect(calculateLoanAmount(300000, 0)).toBe(300000);
    });
  });

  describe('calculateTotalMortgageCost', () => {
    it('total interest is positive', () => {
      const result = calculateTotalMortgageCost(400000, 20, 6.5, 30);
      expect(result.totalInterest).toBeGreaterThan(0);
    });

    it('total payment equals monthly × months', () => {
      const result = calculateTotalMortgageCost(400000, 20, 6.5, 30);
      expect(result.totalPayment).toBeCloseTo(result.monthly * 360, 0);
    });

    it('30-year costs more total interest than 15-year', () => {
      const r30 = calculateTotalMortgageCost(400000, 20, 6, 30);
      const r15 = calculateTotalMortgageCost(400000, 20, 6, 15);
      expect(r30.totalInterest).toBeGreaterThan(r15.totalInterest);
    });
  });

  describe('PMI', () => {
    it('requires PMI when down payment is less than 20%', () => {
      expect(requiresPMI(19.9)).toBe(true);
      expect(requiresPMI(10)).toBe(true);
      expect(requiresPMI(3.5)).toBe(true);
    });

    it('does not require PMI when down payment is 20% or more', () => {
      expect(requiresPMI(20)).toBe(false);
      expect(requiresPMI(25)).toBe(false);
    });

    it('calculates monthly PMI correctly', () => {
      // $320,000 loan at 0.5% annual = $133.33/mo
      expect(estimatePMI(320000)).toBeCloseTo(133.33, 1);
    });
  });
});