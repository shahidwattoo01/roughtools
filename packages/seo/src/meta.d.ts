import type { SeoMeta } from "./types.js";
/**
 * Build complete <head> meta tags for a page.
 * Returns an array of { property/content, value } pairs.
 * Framework-agnostic — adapt to your template system.
 */
export declare function buildMetaTags(meta: SeoMeta, siteUrl: string): {
    attribute: string;
    key: string;
    value: string;
}[];
/**
 * Generate meta tags specifically for a tool page.
 */
export declare function buildToolMeta(tool: {
    name: string;
    slug: string;
    description: string;
    category: string;
    author?: string;
    features?: string[];
    githubUrl?: string;
    createdAt: string;
    updatedAt: string;
}, siteUrl: string): SeoMeta;
/**
 * Generate meta tags for a blog post.
 */
export declare function buildBlogMeta(post: {
    title: string;
    slug: string;
    excerpt?: string;
    author: string;
    coverImage?: string;
    publishedAt?: string;
    updatedAt: string;
}, siteUrl: string): SeoMeta;
//# sourceMappingURL=meta.d.ts.map