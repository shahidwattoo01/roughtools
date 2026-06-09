"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateMortgage = calculateMortgage;
function calculateMortgage(input) {
    const principal = input.homePrice - input.downPayment;
    const monthlyRate = input.interestRate / 100 / 12;
    const numPayments = input.loanTerm * 12;
    const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
        (Math.pow(1 + monthlyRate, numPayments) - 1);
    const totalPayment = monthlyPayment * numPayments;
    return {
        monthlyPayment: Math.round(monthlyPayment * 100) / 100,
        principal: Math.round(principal * 100) / 100,
        totalPayment: Math.round(totalPayment * 100) / 100,
        totalInterest: Math.round((totalPayment - principal) * 100) / 100,
        downPaymentPercent: Math.round((input.downPayment / input.homePrice) * 1000) / 10,
        loanTerm: input.loanTerm,
    };
}
//# sourceMappingURL=logic.js.map