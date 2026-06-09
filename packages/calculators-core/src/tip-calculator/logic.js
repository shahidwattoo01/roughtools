"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTipCalculator = calculateTipCalculator;
function calculateTipCalculator(input) {
    const tipAmount = (input.billAmount * input.tipPercent) / 100;
    const totalAmount = input.billAmount + tipAmount;
    const perPerson = totalAmount / input.splitBetween;
    const tipPerPerson = tipAmount / input.splitBetween;
    return {
        tipAmount: round(tipAmount),
        totalAmount: round(totalAmount),
        perPerson: round(perPerson),
        tipPerPerson: round(tipPerPerson),
    };
}
function round(n) {
    return Math.round(n * 100) / 100;
}
//# sourceMappingURL=logic.js.map