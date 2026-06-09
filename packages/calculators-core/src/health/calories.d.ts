import { CalorieResult } from '../types';
interface CalorieInput {
    weight: number;
    height: number;
    age: number;
    gender: 'male' | 'female';
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
    unit?: 'metric' | 'imperial';
}
export declare function calculateCalories({ weight, height, age, gender, activityLevel, unit }: CalorieInput): CalorieResult;
export {};
//# sourceMappingURL=calories.d.ts.map