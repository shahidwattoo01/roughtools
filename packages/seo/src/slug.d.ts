/**
 * SEO-friendly URL slug generator.
 * Handles Unicode, special characters, diacritics, and collisions.
 */
/**
 * Generate a URL-safe slug from any string.
 */
export declare function generateSlug(input: string, options?: {
    maxLength?: number;
    separator?: string;
}): string;
/**
 * Generate a slug and append a numeric suffix if needed for uniqueness.
 * Provide an `exists` function that checks the database.
 */
export declare function generateUniqueSlug(input: string, exists: (slug: string) => Promise<boolean>, options?: {
    maxLength?: number;
    separator?: string;
}): Promise<string>;
/**
 * Validate a slug against SEO rules.
 */
export declare function validateSlug(slug: string): {
    valid: boolean;
    errors: string[];
};
//# sourceMappingURL=slug.d.ts.map