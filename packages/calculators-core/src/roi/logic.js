"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateRoi = calculateRoi;
function calculateRoi(input) {
    const profit = input.finalValue - input.initialInvestment;
    const roi = (profit / input.initialInvestment) * 100;
    const totalReturn = input.finalValue / input.initialInvestment;
    let annualizedRoi = 0;
    if (input.years) {
        annualizedRoi = (Math.pow(totalReturn, 1 / input.years) - 1) * 100;
    }
    return {
        roi: Math.round(roi * 100) / 100,
        profit: Math.round(profit * 100) / 100,
        totalReturn: Math.round(totalReturn * 100) / 100,
        annualizedRoi: Math.round(annualizedRoi * 100) / 100,
    };
}
//# sourceMappingURL=logic.js.map