/**
 * Open Graph image generation strategy.
 *
 * Two approaches:
 *  1. Dynamic endpoint (recommended): /api/og/tool/[slug]
 *     Renders HTML → screenshot with @vercel/og or Satori
 *  2. Static: pre-generate at build time for known tools
 *
 * This file provides the data layer. The actual rendering
 * happens in your frontend/API route handler.
 */
export interface OgImageTemplate {
    title: string;
    subtitle?: string;
    category?: string;
    branding?: string;
    gradient?: [string, string];
    icon?: string;
}
/**
 * Build the template data for a tool's OG image.
 */
export declare function buildToolOgTemplate(tool: {
    name: string;
    category: string;
    description?: string;
}): OgImageTemplate;
/**
 * Build the template for a blog post OG image.
 */
export declare function buildBlogOgTemplate(post: {
    title: string;
    author: string;
}): OgImageTemplate;
/**
 * OG image spec constants.
 * Use these in your rendering code to ensure consistency.
 */
export declare const OG_IMAGE_SPEC: {
    readonly width: 1200;
    readonly height: 630;
    readonly fontSize: {
        readonly title: 64;
        readonly subtitle: 28;
        readonly category: 24;
        readonly branding: 20;
    };
    readonly padding: 80;
    readonly borderRadius: 16;
};
/**
 * Example HTML template for Satori / @vercel/og.
 * Copy this into your API route and customize styling.
 */
export declare function getSatoriHtml(template: OgImageTemplate): string;
//# sourceMappingURL=og-image.d.ts.map