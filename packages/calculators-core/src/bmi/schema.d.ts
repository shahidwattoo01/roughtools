import { z } from 'zod';
export declare const BMIInputSchema: z.ZodObject<{
    weight: z.ZodNumber;
    height: z.ZodNumber;
    unit: z.ZodEnum<["metric", "imperial"]>;
}, "strip", z.ZodTypeAny, {
    weight: number;
    height: number;
    unit: "metric" | "imperial";
}, {
    weight: number;
    height: number;
    unit: "metric" | "imperial";
}>;
export declare const BMIOutputSchema: z.ZodObject<{
    bmi: z.ZodNumber;
    category: z.ZodEnum<["Underweight", "Normal weight", "Overweight", "Obese"]>;
    healthyWeightRange: z.ZodObject<{
        min: z.ZodNumber;
        max: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        max: number;
        min: number;
    }, {
        max: number;
        min: number;
    }>;
}, "strip", z.ZodTypeAny, {
    category: "Underweight" | "Normal weight" | "Overweight" | "Obese";
    bmi: number;
    healthyWeightRange: {
        max: number;
        min: number;
    };
}, {
    category: "Underweight" | "Normal weight" | "Overweight" | "Obese";
    bmi: number;
    healthyWeightRange: {
        max: number;
        min: number;
    };
}>;
export type BMIInput = z.infer<typeof BMIInputSchema>;
export type BMIOutput = z.infer<typeof BMIOutputSchema>;
//# sourceMappingURL=schema.d.ts.map