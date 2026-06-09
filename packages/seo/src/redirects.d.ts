import type { RedirectRule } from "./types.js";
/**
 * Find a matching redirect for a given path.
 * Checks exact matches first, then pattern-based.
 */
export declare function findRedirect(path: string, rules: RedirectRule[]): RedirectRule | null;
/**
 * Resolve the final destination URL for a path + redirect rule.
 * Handles prefix wildcards by replacing /* with the remaining path.
 */
export declare function resolveRedirect(path: string, rule: RedirectRule): string;
/**
 * Sort rules: exact matches first, then prefix patterns, longer prefixes first.
 */
export declare function sortRedirectRules(rules: RedirectRule[]): RedirectRule[];
/**
 * Default redirects every project should have.
 */
export declare const defaultRedirects: Omit<RedirectRule, "id" | "createdAt">[];
//# sourceMappingURL=redirects.d.ts.map