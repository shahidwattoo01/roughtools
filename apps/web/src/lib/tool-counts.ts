/**
 * tool-counts.ts — lightweight constants file.
 *
 * WHY THIS EXISTS:
 * `tools-registry.ts` is 1 663 lines (the full ALL_TOOLS array).
 * Any client component that imports TOTAL_REAL_TOOLS or
 * TOTAL_CALC_COUNT was previously forced to bundle the entire registry.
 *
 * Import from HERE in client components (SiteHeader, page.tsx, Footer,
 * CategoryGrid). Import from the full registries only in server
 * components / API routes that actually need the data.
 *
 * Update these numbers whenever tools are added.
 */

/** Total real tool count across all category hubs (authoritative). */
export const TOTAL_REAL_TOOLS = 611 as const;

/**
 * Calculators count — kept in sync with calculator-tool-configs.ts.
 * (FINANCIAL + FITNESS + MATH + OTHER)
 */
export const TOTAL_CALC_COUNT = 203 as const;
