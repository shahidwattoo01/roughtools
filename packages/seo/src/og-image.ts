/**
 * Open Graph image generation strategy.
 *
 * Two approaches:
 *  1. Dynamic endpoint (recommended): /api/og/tool/[slug]
 *     Renders HTML â†’ screenshot with @vercel/og or Satori
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
 * Select a gradient pair based on category.
 */
const CATEGORY_GRADIENTS: Record<string, [string, string]> = {
  development: ["#0f172a", "#1e40af"],
  design: ["#1a0a2e", "#7c3aed"],
  "ai & machine learning": ["#0c1821", "#059669"],
  devops: ["#1a1a2e", "#e11d48"],
  security: ["#0f0f0f", "#dc2626"],
  analytics: ["#0f172a", "#d97706"],
  productivity: ["#0f172a", "#2563eb"],
  communication: ["#0c1222", "#0891b2"],
  marketing: ["#170d1f", "#c026d3"],
  finance: ["#0a1628", "#16a34a"],
  education: ["#0f172a", "#7c3aed"],
  health: ["#0a1a0a", "#22c55e"],
};

const DEFAULT_GRADIENT: [string, string] = ["#0f172a", "#f0b429"];

/**
 * Build the template data for a tool's OG image.
 */
export function buildToolOgTemplate(tool: {
  name: string;
  category: string;
  description?: string;
}): OgImageTemplate {
  const normalizedCategory = tool.category.toLowerCase();
  const gradient = CATEGORY_GRADIENTS[normalizedCategory] ?? DEFAULT_GRADIENT;

  return {
    title: tool.name,
    subtitle: tool.description?.slice(0, 80),
    category: tool.category,
    branding: "RoughTools",
    gradient,
  };
}

/**
 * Build the template for a blog post OG image.
 */
export function buildBlogOgTemplate(post: {
  title: string;
  author: string;
}): OgImageTemplate {
  return {
    title: post.title,
    subtitle: `By ${post.author}`,
    branding: "RoughTools Blog",
    gradient: ["#0f172a", "#1e40af"],
  };
}

/**
 * OG image spec constants.
 * Use these in your rendering code to ensure consistency.
 */
export const OG_IMAGE_SPEC = {
  width: 1200,
  height: 630,
  fontSize: {
    title: 64,
    subtitle: 28,
    category: 24,
    branding: 20,
  },
  padding: 80,
  borderRadius: 16,
} as const;

/**
 * Example HTML template for Satori / @vercel/og.
 * Copy this into your API route and customize styling.
 */
export function getSatoriHtml(template: OgImageTemplate): string {
  const [from, to] = template.gradient ?? DEFAULT_GRADIENT;

  return `
    <div style="
      width: 1200px;
      height: 630px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 80px;
      background: linear-gradient(135deg, ${from}, ${to});
      font-family: system-ui, -apple-system, sans-serif;
      color: white;
      position: relative;
    ">
      ${
        template.category
          ? `
        <div style="
          font-size: 24px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 2px;
          opacity: 0.7;
          margin-bottom: 24px;
        ">${template.category}</div>
      `
          : ""
      }
      <div style="
        font-size: 64px;
        font-weight: 800;
        line-height: 1.1;
        max-width: 960px;
        margin-bottom: 24px;
      ">${template.title}</div>
      ${
        template.subtitle
          ? `
        <div style="
          font-size: 28px;
          font-weight: 400;
          opacity: 0.8;
          max-width: 800px;
          line-height: 1.4;
        ">${template.subtitle}</div>
      `
          : ""
      }
      <div style="
        position: absolute;
        bottom: 80px;
        right: 80px;
        font-size: 20px;
        font-weight: 600;
        opacity: 0.5;
      ">${template.branding}</div>
    </div>
  `;
}
