export interface CalculatorResult {
    success: boolean;
    error?: string;
}
export interface BMIResult extends CalculatorResult {
    bmi: number;
    category: string;
    color: 'blue' | 'green' | 'yellow' | 'red';
    healthyRange: {
        min: number;
        max: number;
    };
}
export interface TaxResult extends CalculatorResult {
    totalTax: number;
    effectiveRate: number;
    marginalRate: number;
    afterTax: number;
    monthlyTax: number;
    breakdown: TaxBracket[];
}
export interface TaxBracket {
    bracket: string;
    tax: number;
    rate: number;
}
export interface MortgageResult extends CalculatorResult {
    monthlyPayment: number;
    principal: number;
    totalPayment: number;
    totalInterest: number;
    downPaymentPercent: number;
    loanTerm: number;
}
export interface LoanResult extends CalculatorResult {
    monthlyPayment: number;
    totalPayment: number;
    totalInterest: number;
    principal: number;
}
export interface ROIResult extends CalculatorResult {
    roi: number;
    profit: number;
    totalReturn: number;
    annualizedROI: number;
}
export interface SavingsResult extends CalculatorResult {
    finalAmount: number;
    totalContributions: number;
    totalInterest: number;
    monthlyBreakdown: SavingsMonth[];
}
export interface SavingsMonth {
    month: number;
    balance: number;
    interest: number;
    contribution: number;
}
export interface CalorieResult extends CalculatorResult {
    bmr: number;
    tdee: number;
    weightLoss: number;
    weightGain: number;
    maintain: number;
}
export interface MacroResult extends CalculatorResult {
    protein: number;
    carbs: number;
    fat: number;
    calories: number;
}
export type UnitCategory = 'length' | 'weight' | 'temperature' | 'area' | 'volume' | 'speed' | 'data';
export interface UnitResult extends CalculatorResult {
    value: number;
    fromUnit: string;
    toUnit: string;
    category: UnitCategory;
}
//# sourceMappingURL=types.d.ts.map