import { MacroResult } from '../types';
interface MacroInput {
    calories: number;
    goal: 'lose' | 'maintain' | 'gain';
    unit?: 'metric' | 'imperial';
}
export declare function calculateMacros({ calories, goal }: MacroInput): MacroResult;
export {};
//# sourceMappingURL=macro.d.ts.map