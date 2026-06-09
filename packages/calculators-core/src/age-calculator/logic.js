"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateAgeCalculator = calculateAgeCalculator;
function calculateAgeCalculator(input) {
    const birth = new Date(input.birthDate);
    const target = input.toDate ? new Date(input.toDate) : new Date();
    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();
    if (days < 0) {
        months--;
        const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
        days += prevMonth.getDate();
    }
    if (months < 0) {
        years--;
        months += 12;
    }
    const totalDays = Math.floor((target.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    const totalMonths = years * 12 + months;
    // Days until next birthday
    const nextBday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday <= target)
        nextBday.setFullYear(target.getFullYear() + 1);
    const nextBirthday = Math.ceil((nextBday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));
    return { years, months, days, totalDays, totalMonths, nextBirthday };
}
//# sourceMappingURL=logic.js.map