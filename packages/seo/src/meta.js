"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildMetaTags = buildMetaTags;
exports.buildToolMeta = buildToolMeta;
exports.buildBlogMeta = buildBlogMeta;
const SITE_NAME = "RoughTools";
const DEFAULT_OG_IMAGE = "/og-default.png";
const DEFAULT_TWITTER_HANDLE = "@RoughTools";
/**
 * Build complete <head> meta tags for a page.
 * Returns an array of { property/content, value } pairs.
 * Framework-agnostic â€” adapt to your template system.
 */
function buildMetaTags(meta, siteUrl) {
    const tags = [];
    const canonical = meta.canonical || siteUrl;
    // â”€â”€â”€ Core SEO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    tags.push({ attribute: "name", key: "title", value: meta.title });
    tags.push({ attribute: "name", key: "description", value: meta.description });
    if (meta.keywords?.length) {
        tags.push({
            attribute: "name",
            key: "keywords",
            value: meta.keywords.join(", "),
        });
    }
    tags.push({ attribute: "rel", key: "canonical", value: canonical });
    // â”€â”€â”€ Robots â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const robots = [];
    if (meta.noindex)
        robots.push("noindex");
    if (meta.nofollow)
        robots.push("nofollow");
    if (robots.length === 0)
        robots.push("index", "follow");
    tags.push({ attribute: "name", key: "robots", value: robots.join(", ") });
    // â”€â”€â”€ Open Graph â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const ogTitle = meta.title.includes(SITE_NAME)
        ? meta.title
        : `${meta.title} | ${SITE_NAME}`;
    const ogImage = meta.ogImage
        ? meta.ogImage.startsWith("http")
            ? meta.ogImage
            : `${siteUrl}${meta.ogImage}`
        : `${siteUrl}${DEFAULT_OG_IMAGE}`;
    tags.push({ attribute: "property", key: "og:title", value: ogTitle });
    tags.push({
        attribute: "property",
        key: "og:description",
        value: meta.description,
    });
    tags.push({ attribute: "property", key: "og:image", value: ogImage });
    tags.push({ attribute: "property", key: "og:url", value: canonical });
    tags.push({
        attribute: "property",
        key: "og:type",
        value: meta.ogType ?? "website",
    });
    tags.push({ attribute: "property", key: "og:site_name", value: SITE_NAME });
    tags.push({ attribute: "property", key: "og:image:width", value: "1200" });
    tags.push({ attribute: "property", key: "og:image:height", value: "630" });
    if (meta.publishedTime) {
        tags.push({
            attribute: "property",
            key: "article:published_time",
            value: meta.publishedTime,
        });
    }
    if (meta.modifiedTime) {
        tags.push({
            attribute: "property",
            key: "article:modified_time",
            value: meta.modifiedTime,
        });
    }
    if (meta.author) {
        tags.push({
            attribute: "property",
            key: "article:author",
            value: meta.author,
        });
    }
    // â”€â”€â”€ Twitter Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    tags.push({
        attribute: "name",
        key: "twitter:card",
        value: "summary_large_image",
    });
    tags.push({
        attribute: "name",
        key: "twitter:site",
        value: DEFAULT_TWITTER_HANDLE,
    });
    tags.push({ attribute: "name", key: "twitter:title", value: ogTitle });
    tags.push({
        attribute: "name",
        key: "twitter:description",
        value: meta.description,
    });
    tags.push({ attribute: "name", key: "twitter:image", value: ogImage });
    return tags;
}
/**
 * Generate meta tags specifically for a tool page.
 */
function buildToolMeta(tool, siteUrl) {
    const title = `${tool.name} - ${tool.category} AI Tool | RoughTools`;
    const description = tool.description.length > 160
        ? tool.description.slice(0, 157) + "..."
        : tool.description;
    return {
        title,
        description,
        canonical: `${siteUrl}/tools/${tool.slug}`,
        ogImage: `/api/og/tool/${tool.slug}`, // dynamic OG image endpoint
        ogType: "website",
        author: tool.author,
        publishedTime: tool.createdAt,
        modifiedTime: tool.updatedAt,
        keywords: [
            tool.name,
            tool.category,
            "AI tool",
            ...(tool.features?.slice(0, 5) ?? []),
        ],
    };
}
/**
 * Generate meta tags for a blog post.
 */
function buildBlogMeta(post, siteUrl) {
    const description = post.excerpt?.length
        ? post.excerpt.length > 160
            ? post.excerpt.slice(0, 157) + "..."
            : post.excerpt
        : `Read "${post.title}" on RoughTools â€” your directory of AI tools and resources.`;
    return {
        title: `${post.title} | RoughTools Blog`,
        description,
        canonical: `${siteUrl}/blog/${post.slug}`,
        ogImage: post.coverImage || undefined,
        ogType: "article",
        author: post.author,
        publishedTime: post.publishedAt,
        modifiedTime: post.updatedAt,
        keywords: [post.title, "RoughTools blog"],
    };
}
//# sourceMappingURL=meta.js.map