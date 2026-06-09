import type { ContentAnalysis } from "./types.js";
/**
 * Analyze HTML content for SEO quality.
 * Call this before saving a tool page to enforce minimum content standards.
 */
export declare function analyzeContent(html: string): ContentAnalysis;
/**
 * Extract a meaningful description from HTML content.
 * Used for auto-generating meta descriptions when none provided.
 */
export declare function extractDescription(html: string, maxLength?: number): string;
//# sourceMappingURL=content.d.ts.map