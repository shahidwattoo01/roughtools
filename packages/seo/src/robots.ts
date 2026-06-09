export interface RobotsTxtConfig {
  siteUrl: string;
  disallow?: string[];
  allow?: string[];
  sitemaps?: string[];
  additionalDirectives?: string[];
}

/**
 * Generate a robots.txt file content.
 */
export function buildRobotsTxt(config: RobotsTxtConfig): string {
  const lines: string[] = [];

  // User-agent blocks
  lines.push("User-agent: *");
  lines.push("");

  // Disallow paths
  if (config.disallow?.length) {
    for (const path of config.disallow) {
      lines.push(`Disallow: ${path}`);
    }
    lines.push("");
  }

  // Allow paths (override disallow for specific paths)
  if (config.allow?.length) {
    for (const path of config.allow) {
      lines.push(`Allow: ${path}`);
    }
    lines.push("");
  }

  // Sitemaps
  if (config.sitemaps?.length) {
    for (const sitemap of config.sitemaps) {
      lines.push(`Sitemap: ${sitemap}`);
    }
    lines.push("");
  }

  // Additional directives (Crawl-delay, etc.)
  if (config.additionalDirectives?.length) {
    lines.push(...config.additionalDirectives);
    lines.push("");
  }

  return lines.join("\n").trim() + "\n";
}

/**
 * Default production robots.txt config.
 */
export const defaultRobotsConfig: RobotsTxtConfig = {
  siteUrl: "https://roughtools.com",
  disallow: [
    "/api/",
    "/admin/",
    "/_next/",
    "/auth/",
    "/dashboard/",
    "/account/",
  ],
  allow: ["/api/health"],
  sitemaps: ["https://roughtools.com/sitemap.xml"],
  additionalDirectives: ["Crawl-delay: 1"],
};

/**
 * Development robots.txt â€” block all crawlers.
 */
export const devRobotsConfig: RobotsTxtConfig = {
  siteUrl: "http://localhost:3000",
  disallow: ["/"],
  sitemaps: [],
};
