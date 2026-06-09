import type { RedirectRule } from "./types.js";

/**
 * Find a matching redirect for a given path.
 * Checks exact matches first, then pattern-based.
 */
export function findRedirect(
  path: string,
  rules: RedirectRule[],
): RedirectRule | null {
  // Exact match (fast path)
  const exact = rules.find((r) => r.enabled && r.from === path);
  if (exact) return exact;

  // Pattern match: support trailing slash normalization
  // e.g. "/tools/old/" matches rule for "/tools/old"
  const noTrailingSlash = path.replace(/\/+$/, "");
  const slashVariant = rules.find(
    (r) => r.enabled && r.from.replace(/\/+$/, "") === noTrailingSlash,
  );
  if (slashVariant) return slashVariant;

  // Prefix match: "/old-category/*" → "/new-category/*"
  const prefixRule = rules.find((r) => {
    if (!r.enabled || !r.from.endsWith("/*")) return false;
    const prefix = r.from.slice(0, -2); // remove "/*"
    return path.startsWith(prefix + "/");
  });
  if (prefixRule) return prefixRule;

  return null;
}

/**
 * Resolve the final destination URL for a path + redirect rule.
 * Handles prefix wildcards by replacing /* with the remaining path.
 */
export function resolveRedirect(path: string, rule: RedirectRule): string {
  if (rule.from.endsWith("/*")) {
    const prefix = rule.from.slice(0, -2);
    const remaining = path.slice(prefix.length);
    return rule.to.replace("/*", remaining);
  }
  return rule.to;
}

/**
 * Sort rules: exact matches first, then prefix patterns, longer prefixes first.
 */
export function sortRedirectRules(rules: RedirectRule[]): RedirectRule[] {
  return [...rules].sort((a, b) => {
    const aIsPrefix = a.from.endsWith("/*");
    const bIsPrefix = b.from.endsWith("/*");

    // Exact matches before prefix patterns
    if (!aIsPrefix && bIsPrefix) return -1;
    if (aIsPrefix && !bIsPrefix) return 1;

    // Both same type — sort by length descending (more specific first)
    return b.from.length - a.from.length;
  });
}

/**
 * Default redirects every project should have.
 */
export const defaultRedirects: Omit<RedirectRule, "id" | "createdAt">[] = [
  { from: "/home", to: "/", type: 301, enabled: true, note: "Homepage alias" },
  {
    from: "/tool",
    to: "/tools",
    type: 301,
    enabled: true,
    note: "Singular to plural",
  },
  {
    from: "/tool/*",
    to: "/tools/*",
    type: 301,
    enabled: true,
    note: "Singular to plural prefix",
  },
  {
    from: "/category",
    to: "/categories",
    type: 301,
    enabled: true,
    note: "Singular to plural",
  },
  {
    from: "/category/*",
    to: "/categories/*",
    type: 301,
    enabled: true,
    note: "Singular to plural prefix",
  },
  {
    from: "/post/*",
    to: "/blog/*",
    type: 301,
    enabled: true,
    note: "Old blog URL structure",
  },
  {
    from: "/articles/*",
    to: "/blog/*",
    type: 301,
    enabled: true,
    note: "Old blog URL structure",
  },
];
