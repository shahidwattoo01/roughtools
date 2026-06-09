"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateBMI = calculateBMI;
function getCategory(bmi) {
    if (bmi < 18.5)
        return 'Underweight';
    if (bmi < 25)
        return 'Normal weight';
    if (bmi < 30)
        return 'Overweight';
    return 'Obese';
}
function calculateBMI(input) {
    let weightKg = input.weight;
    let heightM = input.height;
    if (input.unit === 'imperial') {
        weightKg = input.weight * 0.453592; // lbs → kg
        heightM = input.height * 0.0254; // inches → m
    }
    const bmi = weightKg / (heightM * heightM);
    // Healthy range back-converted to user's unit
    const minKg = 18.5 * heightM * heightM;
    const maxKg = 24.9 * heightM * heightM;
    const [min, max] = input.unit === 'imperial'
        ? [minKg / 0.453592, maxKg / 0.453592]
        : [minKg, maxKg];
    return {
        bmi: Math.round(bmi * 10) / 10,
        category: getCategory(bmi),
        healthyWeightRange: {
            min: Math.round(min * 10) / 10,
            max: Math.round(max * 10) / 10,
        },
    };
}
//# sourceMappingURL=logic.js.map