"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePercentage = calculatePercentage;
function calculatePercentage(input) {
    const { mode, valueA, valueB } = input;
    let result;
    let explanation;
    if (mode === 'what-percent-of') {
        // What is A% of B?
        result = (valueA / 100) * valueB;
        explanation = `${valueA}% of ${valueB} = ${round(result)}`;
    }
    else if (mode === 'percent-change') {
        // Percentage change from A to B
        result = ((valueB - valueA) / valueA) * 100;
        explanation = `Change from ${valueA} to ${valueB} = ${round(result)}%`;
    }
    else {
        // A is what percent of B?
        result = (valueA / valueB) * 100;
        explanation = `${valueA} is ${round(result)}% of ${valueB}`;
    }
    return {
        result: round(result),
        explanation,
    };
}
function round(n) {
    return Math.round(n * 100) / 100;
}
//# sourceMappingURL=logic.js.map