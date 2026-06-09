"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertUnit = convertUnit;
const CONVERSIONS = {
    length: {
        meter: 1, kilometer: 1000, mile: 1609.34,
        foot: 0.3048, inch: 0.0254, yard: 0.9144, centimeter: 0.01,
    },
    weight: {
        kilogram: 1, gram: 0.001, pound: 0.453592,
        ounce: 0.0283495, ton: 1000, stone: 6.35029,
    },
    volume: {
        liter: 1, milliliter: 0.001, gallon: 3.78541,
        quart: 0.946353, pint: 0.473176, cup: 0.236588, fluid_ounce: 0.0295735,
    },
    speed: {
        meter_per_second: 1, kilometer_per_hour: 0.277778,
        mile_per_hour: 0.44704, knot: 0.514444, foot_per_second: 0.3048,
    },
};
function convertUnit(value, fromUnit, toUnit, category) {
    try {
        if (category === 'temperature') {
            return convertTemperature(value, fromUnit, toUnit);
        }
        const cat = CONVERSIONS[category];
        if (!cat)
            return { success: false, error: 'Unknown category', value: 0, fromUnit, toUnit, category: category };
        const fromFactor = cat[fromUnit];
        const toFactor = cat[toUnit];
        if (!fromFactor || !toFactor)
            return { success: false, error: 'Unknown unit', value: 0, fromUnit, toUnit, category: category };
        const result = (value * fromFactor) / toFactor;
        return {
            success: true,
            value: Math.round(result * 10000) / 10000,
            fromUnit,
            toUnit,
            category: category,
        };
    }
    catch {
        return { success: false, error: 'Conversion failed', value: 0, fromUnit, toUnit, category: category };
    }
}
function convertTemperature(value, from, to) {
    let celsius;
    if (from === 'celsius')
        celsius = value;
    else if (from === 'fahrenheit')
        celsius = (value - 32) * 5 / 9;
    else if (from === 'kelvin')
        celsius = value - 273.15;
    else
        return { success: false, error: 'Unknown temperature unit', value: 0, fromUnit: from, toUnit: to, category: 'temperature' };
    let result;
    if (to === 'celsius')
        result = celsius;
    else if (to === 'fahrenheit')
        result = celsius * 9 / 5 + 32;
    else if (to === 'kelvin')
        result = celsius + 273.15;
    else
        return { success: false, error: 'Unknown temperature unit', value: 0, fromUnit: from, toUnit: to, category: 'temperature' };
    return {
        success: true,
        value: Math.round(result * 100) / 100,
        fromUnit: from,
        toUnit: to,
        category: 'temperature',
    };
}
//# sourceMappingURL=unit-converter.js.map