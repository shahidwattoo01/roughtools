export interface SeoMeta {
    title: string;
    description: string;
    canonical?: string;
    ogImage?: string;
    ogType?: "website" | "article" | "profile";
    noindex?: boolean;
    nofollow?: boolean;
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    keywords?: string[];
}
export interface WebApplicationJsonLd {
    name: string;
    description: string;
    url: string;
    image?: string;
    applicationCategory: string;
    operatingSystem: string;
    offers?: {
        price: string;
        priceCurrency: string;
        category?: string;
    };
    aggregateRating?: {
        ratingValue: number;
        ratingCount: number;
        bestRating?: number;
    };
    screenshot?: string;
    featureList?: string[];
}
export interface BreadcrumbItem {
    name: string;
    url: string;
}
export interface FaqItem {
    question: string;
    answer: string;
}
export interface SitemapEntry {
    loc: string;
    lastmod?: string;
    changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
    priority?: number;
}
export interface RedirectRule {
    id: string;
    from: string;
    to: string;
    type: 301 | 302;
    enabled: boolean;
    createdAt: string;
    note?: string;
}
export interface ContentAnalysis {
    wordCount: number;
    passesMinimum: boolean;
    minimumRequired: number;
    headings: {
        level: number;
        text: string;
    }[];
    hasH1: boolean;
    hasH2: boolean;
    imageCount: number;
    internalLinkCount: number;
    externalLinkCount: number;
    issues: string[];
    score: number;
}
//# sourceMappingURL=types.d.ts.map