import type { SitemapEntry } from "./types.js";

/**
 * Generate a complete XML sitemap string.
 */
export function buildSitemap(
  entries: SitemapEntry[],
  options?: {
    siteUrl?: string;
    additionalNamespaces?: Record<string, string>;
  },
): string {
  const siteUrl = options?.siteUrl ?? "https://roughtools.com";

  const namespaces = [
    'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    ...(options?.additionalNamespaces
      ? Object.entries(options.additionalNamespaces).map(
          ([prefix, uri]) => `xmlns:${prefix}="${uri}"`,
        )
      : []),
  ].join(" ");

  const urls = entries.map((entry) => {
    const loc = entry.loc.startsWith("http")
      ? entry.loc
      : `${siteUrl}${entry.loc}`;

    const parts = [`    <loc>${escapeXml(loc)}</loc>`];

    if (entry.lastmod) {
      parts.push(`    <lastmod>${entry.lastmod}</lastmod>`);
    }
    if (entry.changefreq) {
      parts.push(`    <changefreq>${entry.changefreq}</changefreq>`);
    }
    if (entry.priority !== undefined) {
      parts.push(`    <priority>${entry.priority.toFixed(1)}</priority>`);
    }

    return `  <url>\n${parts.join("\n")}\n  </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset ${namespaces}>
 ${urls.join("\n")}
</urlset>`;
}

/**
 * Generate a sitemap index file for when you have multiple sitemaps.
 */
export function buildSitemapIndex(
  sitemaps: {
    path: string;
    lastmod?: string;
  }[],
  siteUrl?: string,
): string {
  const base = siteUrl ?? "https://roughtools.com";

  const entries = sitemaps.map((s) => {
    const loc = s.path.startsWith("http") ? s.path : `${base}${s.path}`;
    const parts = [`    <loc>${escapeXml(loc)}</loc>`];
    if (s.lastmod) parts.push(`    <lastmod>${s.lastmod}</lastmod>`);
    return `  <sitemap>\n${parts.join("\n")}\n  </sitemap>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
 ${entries.join("\n")}
</sitemapindex>`;
}

/**
 * Build tool entries from database rows.
 */
export function buildToolSitemapEntries(
  tools: {
    slug: string;
    updatedAt: string;
    status: string;
  }[],
): SitemapEntry[] {
  return tools
    .filter((t) => t.status === "PUBLISHED")
    .map((t) => ({
      loc: `/tools/${t.slug}`,
      lastmod: t.updatedAt.split("T")[0],
      changefreq: "weekly" as const,
      priority: 0.8,
    }));
}

/**
 * Build blog entries from database rows.
 */
export function buildBlogSitemapEntries(
  posts: {
    slug: string;
    publishedAt?: string;
    updatedAt: string;
    status: string;
  }[],
): SitemapEntry[] {
  return posts
    .filter((p) => p.status === "PUBLISHED")
    .map((p) => ({
      loc: `/blog/${p.slug}`,
      lastmod: (p.publishedAt ?? p.updatedAt).split("T")[0],
      changefreq: "monthly" as const,
      priority: 0.6,
    }));
}

/**
 * Static pages that should always be in the sitemap.
 */
export function buildStaticEntries(): SitemapEntry[] {
  return [
    { loc: "/", changefreq: "daily", priority: 1.0 },
    { loc: "/tools", changefreq: "daily", priority: 0.9 },
    { loc: "/categories", changefreq: "weekly", priority: 0.7 },
    { loc: "/blog", changefreq: "daily", priority: 0.7 },
    { loc: "/about", changefreq: "monthly", priority: 0.3 },
    { loc: "/contact", changefreq: "yearly", priority: 0.2 },
    { loc: "/privacy", changefreq: "yearly", priority: 0.1 },
    { loc: "/terms", changefreq: "yearly", priority: 0.1 },
  ];
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
