import type { WebApplicationJsonLd, BreadcrumbItem, FaqItem } from "./types.js";
/**
 * Build JSON-LD for WebApplication schema.
 * Use on every tool page.
 */
export declare function buildWebApplicationJsonLd(tool: WebApplicationJsonLd): object;
/**
 * Build JSON-LD for ItemList (tool listing pages).
 */
export declare function buildItemListJsonLd(options: {
    name: string;
    url: string;
    items: {
        name: string;
        url: string;
        position: number;
    }[];
}): object;
/**
 * Build JSON-LD for BreadcrumbList.
 * Use on every page except homepage.
 */
export declare function buildBreadcrumbJsonLd(items: BreadcrumbItem[]): object;
/**
 * Build JSON-LD for FAQPage.
 * Use on tool pages that have FAQ sections.
 */
export declare function buildFaqJsonLd(faqs: FaqItem[]): object;
/**
 * Build JSON-LD for Organization (homepage only).
 */
export declare function buildOrganizationJsonLd(options: {
    name: string;
    url: string;
    logo: string;
    description: string;
    sameAs?: string[];
}): object;
/**
 * Build JSON-LD for BlogPosting.
 */
export declare function buildBlogPostingJsonLd(post: {
    title: string;
    description: string;
    url: string;
    image?: string;
    author: {
        name: string;
        url?: string;
    };
    publishedTime: string;
    modifiedTime: string;
}): object;
/**
 * Render a JSON-LD object as a <script> tag string.
 * Use this in your HTML templates / SSR.
 */
export declare function renderJsonLd(data: object): string;
//# sourceMappingURL=jsonld.d.ts.map