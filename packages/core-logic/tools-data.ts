// packages/core-logic/tools-data.ts
export interface Tool {
  slug: string;
  name: string;
  category: string;
  description: string;
  cpc?: string;
  priority?: string;
}

export const allTools: Tool[] = [
  {
    slug: "mortgage-calculator",
    name: "Mortgage Calculator",
    category: "Calculators",
    description: "Calculate your monthly mortgage payment, total interest, and view a breakdown of your loan.",
    cpc: "$6-12",
    priority: "HIGH"
  },
  {
    slug: "tax-calculator",
    name: "Tax Calculator",
    category: "Calculators",
    description: "Estimate your federal and state income taxes.",
    cpc: "$8-15",
    priority: "CRITICAL"
  },
  // ... add the rest of your tools here. This fixes the "not showing" issue.
];

export const getToolsByCategory = (category: string) => {
  return allTools.filter(tool => tool.category === category);
};