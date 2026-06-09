/**
 * SEO-friendly URL slug generator.
 * Handles Unicode, special characters, diacritics, and collisions.
 */

const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "but",
  "in",
  "on",
  "at",
  "to",
  "for",
  "of",
  "with",
  "by",
  "is",
  "it",
  "as",
  "be",
  "was",
  "are",
  "been",
  "from",
  "has",
  "had",
  "not",
  "this",
  "that",
  "which",
  "who",
  "whom",
  "its",
  "their",
  "our",
  "your",
  "my",
]);

// Common replacements for tool/software names
const REPLACEMENTS: Record<string, string> = {
  "&": "and",
  "@": "at",
  "+": "plus",
  "#": "number",
  ".net": "-net",
  ".js": "-js",
  ".ts": "-ts",
  ".py": "-py",
  ".ai": "-ai",
  ".io": "-io",
  "c++": "cpp",
  "c#": "csharp",
  "f#": "fsharp",
  "node.js": "nodejs",
  "node.jsx": "nodejsx",
};

/**
 * Strip diacritics: café → cafe, naïve → naive
 */
function stripDiacritics(str: string): string {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/**
 * Generate a URL-safe slug from any string.
 */
export function generateSlug(
  input: string,
  options?: { maxLength?: number; separator?: string },
): string {
  const maxLength = options?.maxLength ?? 80;
  const separator = options?.separator ?? "-";

  let slug = input.trim().toLowerCase();

  // Apply known replacements first
  for (const [from, to] of Object.entries(REPLACEMENTS)) {
    slug = slug.replace(new RegExp(from, "gi"), to);
  }

  // Strip diacritics
  slug = stripDiacritics(slug);

  // Replace non-alphanumeric with separator
  slug = slug.replace(/[^a-z0-9]+/g, separator);

  // Remove leading/trailing separators
  slug = slug.replace(new RegExp(`^\\${separator}+|\\${separator}+$`, "g"), "");

  // Collapse multiple separators
  slug = slug.replace(new RegExp(`\\${separator}{2,}`, "g"), separator);

  // Remove stop words from middle (not first/last word)
  const words = slug.split(separator);
  const filtered = words
    .map((word, i) => {
      if (i === 0 || i === words.length - 1) return word;
      return STOP_WORDS.has(word) ? undefined : word;
    })
    .filter(Boolean);

  slug = filtered.join(separator);

  // Truncate at word boundary
  if (slug.length > maxLength) {
    slug = slug.slice(0, maxLength);
    const lastSep = slug.lastIndexOf(separator);
    if (lastSep > 0) slug = slug.slice(0, lastSep);
  }

  // Remove trailing separator after truncation
  slug = slug.replace(new RegExp(`\\${separator}+$`, "g"), "");

  return slug || "untitled";
}

/**
 * Generate a slug and append a numeric suffix if needed for uniqueness.
 * Provide an `exists` function that checks the database.
 */
export async function generateUniqueSlug(
  input: string,
  exists: (slug: string) => Promise<boolean>,
  options?: { maxLength?: number; separator?: string },
): Promise<string> {
  let slug = generateSlug(input, options);

  if (!(await exists(slug))) return slug;

  let suffix = 2;
  let candidate: string;

  do {
    candidate = `${slug}${options?.separator ?? "-"}${suffix}`;
    suffix++;
  } while (await exists(candidate));

  return candidate;
}

/**
 * Validate a slug against SEO rules.
 */
export function validateSlug(slug: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (slug.length < 3) errors.push("Slug must be at least 3 characters");
  if (slug.length > 80) errors.push("Slug must be at most 80 characters");
  if (/^-|-$/.test(slug)) errors.push("Slug cannot start or end with a hyphen");
  if (/--/.test(slug)) errors.push("Slug cannot contain consecutive hyphens");
  if (!/^[a-z0-9-]+$/.test(slug))
    errors.push(
      "Slug can only contain lowercase letters, numbers, and hyphens",
    );
  if (STOP_WORDS.has(slug)) errors.push("Slug should not be a stop word");

  return { valid: errors.length === 0, errors };
}
