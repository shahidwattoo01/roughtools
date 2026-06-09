"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildWebApplicationJsonLd = buildWebApplicationJsonLd;
exports.buildItemListJsonLd = buildItemListJsonLd;
exports.buildBreadcrumbJsonLd = buildBreadcrumbJsonLd;
exports.buildFaqJsonLd = buildFaqJsonLd;
exports.buildOrganizationJsonLd = buildOrganizationJsonLd;
exports.buildBlogPostingJsonLd = buildBlogPostingJsonLd;
exports.renderJsonLd = renderJsonLd;
/**
 * Build JSON-LD for WebApplication schema.
 * Use on every tool page.
 */
function buildWebApplicationJsonLd(tool) {
    return {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: tool.name,
        description: tool.description,
        url: tool.url,
        applicationCategory: tool.applicationCategory,
        operatingSystem: tool.operatingSystem,
        ...(tool.image && { image: tool.image }),
        ...(tool.screenshot && { screenshot: tool.screenshot }),
        ...(tool.featureList && { featureList: tool.featureList }),
        ...(tool.offers && {
            offers: {
                "@type": "Offer",
                price: tool.offers.price,
                priceCurrency: tool.offers.priceCurrency,
                ...(tool.offers.category && { category: tool.offers.category }),
            },
        }),
        ...(tool.aggregateRating && {
            aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: tool.aggregateRating.ratingValue,
                ratingCount: tool.aggregateRating.ratingCount,
                bestRating: tool.aggregateRating.bestRating ?? 5,
            },
        }),
    };
}
/**
 * Build JSON-LD for ItemList (tool listing pages).
 */
function buildItemListJsonLd(options) {
    return {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: options.name,
        url: options.url,
        numberOfItems: options.items.length,
        itemListElement: options.items.map((item) => ({
            "@type": "ListItem",
            position: item.position,
            name: item.name,
            url: item.url,
        })),
    };
}
/**
 * Build JSON-LD for BreadcrumbList.
 * Use on every page except homepage.
 */
function buildBreadcrumbJsonLd(items) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };
}
/**
 * Build JSON-LD for FAQPage.
 * Use on tool pages that have FAQ sections.
 */
function buildFaqJsonLd(faqs) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
            },
        })),
    };
}
/**
 * Build JSON-LD for Organization (homepage only).
 */
function buildOrganizationJsonLd(options) {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: options.name,
        url: options.url,
        logo: options.logo,
        description: options.description,
        ...(options.sameAs && { sameAs: options.sameAs }),
    };
}
/**
 * Build JSON-LD for BlogPosting.
 */
function buildBlogPostingJsonLd(post) {
    return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description,
        url: post.url,
        ...(post.image && { image: post.image }),
        author: {
            "@type": "Person",
            name: post.author.name,
            ...(post.author.url && { url: post.author.url }),
        },
        datePublished: post.publishedTime,
        dateModified: post.modifiedTime,
        publisher: {
            "@type": "Organization",
            name: "RoughTools",
            logo: {
                "@type": "ImageObject",
                url: "https://roughtools.com/logo.png",
            },
        },
    };
}
/**
 * Render a JSON-LD object as a <script> tag string.
 * Use this in your HTML templates / SSR.
 */
function renderJsonLd(data) {
    return `<script type="application/ld+json">${JSON.stringify(data, null, 0)}</script>`;
}
//# sourceMappingURL=jsonld.js.map