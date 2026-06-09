import type { ContentAnalysis } from "./types.js";

/**
 * Analyze HTML content for SEO quality.
 * Call this before saving a tool page to enforce minimum content standards.
 */
export function analyzeContent(html: string): ContentAnalysis {
  const issues: string[] = [];
  let score = 100;

  // ─── Word count ─────────────────────────────────────
  const textContent = stripHtml(html);
  const words = textContent.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const MINIMUM_WORDS = 500;

  if (wordCount < MINIMUM_WORDS) {
    issues.push(
      `Content has ${wordCount} words, minimum ${MINIMUM_WORDS} required for SEO`,
    );
    score -= 40;
  } else if (wordCount < 800) {
    issues.push("Content is acceptable but consider expanding to 800+ words");
    score -= 10;
  }

  // ─── Headings ───────────────────────────────────────
  const headingRegex = /<(h[1-6])[^>]*>(.*?)<\/\1>/gi;
  const headings: { level: number; text: string }[] = [];
  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(html)) !== null) {
    headings.push({
      level: parseInt(match[1][1]),
      text: stripHtml(match[2]).trim(),
    });
  }

  const hasH1 = headings.some((h) => h.level === 1);
  const hasH2 = headings.some((h) => h.level === 2);

  if (!hasH1) {
    issues.push("Missing H1 heading — every page needs exactly one H1");
    score -= 15;
  } else if (headings.filter((h) => h.level === 1).length > 1) {
    issues.push("Multiple H1 headings found — use only one H1 per page");
    score -= 10;
  }

  if (!hasH2) {
    issues.push("No H2 headings found — add H2s to structure content");
    score -= 10;
  }

  // ─── Images ─────────────────────────────────────────
  const imgRegex = /<img[^>]*>/gi;
  const images = html.match(imgRegex) ?? [];
  const imageCount = images.length;

  const imagesWithoutAlt = images.filter(
    (img) => !/alt\s*=\s*["'][^"']+["']/i.test(img),
  );

  if (imageCount === 0) {
    issues.push("No images found — add at least one relevant image");
    score -= 5;
  }

  if (imagesWithoutAlt.length > 0) {
    issues.push(`${imagesWithoutAlt.length} image(s) missing alt text`);
    score -= imagesWithoutAlt.length * 3;
  }

  // ─── Links ──────────────────────────────────────────
  const internalLinkRegex = /<a[^>]*href=["']\/[^"']*["'][^>]*>/gi;
  const externalLinkRegex = /<a[^>]*href=["']https?:\/\/[^"']*["'][^>]*>/gi;

  const internalLinkCount = (html.match(internalLinkRegex) ?? []).length;
  const externalLinkCount = (html.match(externalLinkRegex) ?? []).length;

  if (internalLinkCount === 0) {
    issues.push(
      "No internal links found — link to related tools and categories",
    );
    score -= 10;
  } else if (internalLinkCount < 3) {
    issues.push("Few internal links — aim for at least 3 internal links");
    score -= 5;
  }

  // ─── Title length in H1 ─────────────────────────────
  const h1Text = headings.find((h) => h.level === 1)?.text;
  if (h1Text && h1Text.length > 70) {
    issues.push(
      "H1 is too long — keep under 70 characters for optimal display",
    );
    score -= 5;
  }

  // ─── Paragraph length ───────────────────────────────
  const paragraphs = html.match(/<p[^>]*>(.*?)<\/p>/gi) ?? [];
  const longParagraphs = paragraphs.filter((p) => {
    const words = stripHtml(p).split(/\s+/).length;
    return words > 150;
  });
  if (longParagraphs.length > 0) {
    issues.push(
      `${longParagraphs.length} paragraph(s) exceed 150 words — break into shorter paragraphs`,
    );
    score -= longParagraphs.length * 2;
  }

  // Clamp score
  score = Math.max(0, Math.min(100, score));

  return {
    wordCount,
    passesMinimum: wordCount >= MINIMUM_WORDS,
    minimumRequired: MINIMUM_WORDS,
    headings,
    hasH1,
    hasH2,
    imageCount,
    internalLinkCount,
    externalLinkCount,
    issues,
    score,
  };
}

/**
 * Extract a meaningful description from HTML content.
 * Used for auto-generating meta descriptions when none provided.
 */
export function extractDescription(
  html: string,
  maxLength: number = 160,
): string {
  const text = stripHtml(html).replace(/\s+/g, " ").trim();

  if (text.length <= maxLength) return text;

  // Try to break at sentence boundary
  const truncated = text.slice(0, maxLength);
  const lastPeriod = truncated.lastIndexOf(".");
  const lastSpace = truncated.lastIndexOf(" ");

  if (lastPeriod > maxLength * 0.5) {
    return truncated.slice(0, lastPeriod + 1);
  }
  if (lastSpace > 0) {
    return truncated.slice(0, lastSpace) + "...";
  }

  return truncated + "...";
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}
