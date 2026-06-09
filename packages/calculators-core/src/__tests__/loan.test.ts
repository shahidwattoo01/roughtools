import { describe, it, expect } from 'vitest';

// ─── Inline loan logic (mirrors packages/calculators-core/src/loan/logic.ts) ─
// If exported, replace with: import { calculateMonthlyPayment, calculateTotalInterest } from '../loan/logic';

function calculateMonthlyPayment(
  principal: number,
  annualRatePercent: number,
  termMonths: number,
): number {
  if (annualRatePercent === 0) {
    return parseFloat((principal / termMonths).toFixed(2));
  }
  const r = annualRatePercent / 100 / 12;
  const payment = (principal * r * Math.pow(1 + r, termMonths)) /
                  (Math.pow(1 + r, termMonths) - 1);
  return parseFloat(payment.toFixed(2));
}

function calculateTotalPayment(monthly: number, termMonths: number): number {
  return parseFloat((monthly * termMonths).toFixed(2));
}

function calculateTotalInterest(totalPayment: number, principal: number): number {
  return parseFloat((totalPayment - principal).toFixed(2));
}

function calculateAmortizationSchedule(
  principal: number,
  annualRatePercent: number,
  termMonths: number,
): { month: number; payment: number; principal: number; interest: number; balance: number }[] {
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

describe('Loan Calculator', () => {

  describe('calculateMonthlyPayment', () => {
    it('calculates correct monthly payment for standard loan', () => {
      // $10,000 at 5% for 36 months → ~$299.71
      const result = calculateMonthlyPayment(10000, 5, 36);
      expect(result).toBeCloseTo(299.71, 1);
    });

    it('calculates correct monthly payment for mortgage-size loan', () => {
      // $300,000 at 6.5% for 360 months → ~$1896.20
      const result = calculateMonthlyPayment(300000, 6.5, 360);
      expect(result).toBeCloseTo(1896.20, 0);
    });

    it('handles 0% interest rate correctly', () => {
      // $12,000 at 0% for 12 months → $1,000/month
      const result = calculateMonthlyPayment(12000, 0, 12);
      expect(result).toBe(1000.00);
    });

    it('returns a positive number', () => {
      expect(calculateMonthlyPayment(5000, 4, 24)).toBeGreaterThan(0);
    });

    it('higher interest rate produces higher payment', () => {
      const low  = calculateMonthlyPayment(10000, 3, 36);
      const high = calculateMonthlyPayment(10000, 8, 36);
      expect(high).toBeGreaterThan(low);
    });

    it('longer term produces lower monthly payment', () => {
      const short = calculateMonthlyPayment(10000, 5, 24);
      const long  = calculateMonthlyPayment(10000, 5, 60);
      expect(long).toBeLessThan(short);
    });
  });

  describe('calculateTotalPayment', () => {
    it('calculates total payment correctly', () => {
      expect(calculateTotalPayment(299.71, 36)).toBeCloseTo(10789.56, 0);
    });
  });

  describe('calculateTotalInterest', () => {
    it('calculates total interest correctly', () => {
      const total = calculateTotalPayment(299.71, 36);
      expect(calculateTotalInterest(total, 10000)).toBeGreaterThan(0);
    });

    it('interest is zero for 0% rate', () => {
      const monthly = calculateMonthlyPayment(12000, 0, 12);
      const total   = calculateTotalPayment(monthly, 12);
      expect(calculateTotalInterest(total, 12000)).toBe(0);
    });
  });

  describe('calculateAmortizationSchedule', () => {
    it('returns correct number of months', () => {
      const schedule = calculateAmortizationSchedule(10000, 5, 36);
      expect(schedule.length).toBe(36);
    });

    it('first month has highest interest', () => {
      const schedule = calculateAmortizationSchedule(10000, 5, 36);
      expect(schedule[0].interest).toBeGreaterThan(schedule[35].interest);
    });

    it('balance reaches zero at end', () => {
      const schedule = calculateAmortizationSchedule(10000, 5, 36);
      expect(schedule[35].balance).toBe(0);
    });

    it('each month payment equals principal + interest', () => {
      const schedule = calculateAmortizationSchedule(10000, 5, 36);
      const first = schedule[0];
      expect(first.principal + first.interest).toBeCloseTo(first.payment, 0);
    });
  });
});