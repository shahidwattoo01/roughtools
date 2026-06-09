import type { SitemapEntry } from "./types.js";
/**
 * Generate a complete XML sitemap string.
 */
export declare function buildSitemap(entries: SitemapEntry[], options?: {
    siteUrl?: string;
    additionalNamespaces?: Record<string, string>;
}): string;
/**
 * Generate a sitemap index file for when you have multiple sitemaps.
 */
export declare function buildSitemapIndex(sitemaps: {
    path: string;
    lastmod?: string;
}[], siteUrl?: string): string;
/**
 * Build tool entries from database rows.
 */
export declare function buildToolSitemapEntries(tools: {
    slug: string;
    updatedAt: string;
    status: string;
}[]): SitemapEntry[];
/**
 * Build blog entries from database rows.
 */
export declare function buildBlogSitemapEntries(posts: {
    slug: string;
    publishedAt?: string;
    updatedAt: string;
    status: string;
}[]): SitemapEntry[];
/**
 * Static pages that should always be in the sitemap.
 */
export declare function buildStaticEntries(): SitemapEntry[];
//# sourceMappingURL=sitemap.d.ts.map