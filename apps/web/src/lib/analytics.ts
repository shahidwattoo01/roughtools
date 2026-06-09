/**
 * analytics.ts
 * Centralised analytics utility — GA4, Core Web Vitals, AdSense click tracking,
 * and tool-usage event helpers.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type GAEvent = {
  action: string;
  category: string;
  label?: string;
  value?: number;
  nonInteraction?: boolean;
};

export type ToolEvent = {
  toolName: string;
  toolCategory: string;
  action: "view" | "use" | "copy" | "download" | "share" | "embed";
  label?: string;
  value?: number;
};

export type WebVitalMetric = {
  id: string;
  name: "CLS" | "FID" | "FCP" | "LCP" | "TTFB" | "INP";
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta: number;
  entries: PerformanceEntry[];
};

export type AdSenseEvent = {
  adUnit: string;
  adFormat: string;
  action: "impression" | "click" | "viewable";
  revenue?: number;
};

// ─── GA4 Helpers ──────────────────────────────────────────────────────────────

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
    clarity: (method: string, ...args: unknown[]) => void;
    adsbygoogle: unknown[];
  }
}

export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";

/** Fire a generic GA4 event. */
export function trackEvent({
  action,
  category,
  label,
  value,
  nonInteraction,
}: GAEvent) {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value,
    non_interaction: nonInteraction ?? false,
  });
}

/** Track a page view manually (useful for SPA navigations). */
export function trackPageView(url: string, title?: string) {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
    page_title: title,
  });
}

// ─── Tool-specific Events ─────────────────────────────────────────────────────

/** Track a specific tool interaction. */
export function trackToolEvent({
  toolName,
  toolCategory,
  action,
  label,
  value,
}: ToolEvent) {
  trackEvent({
    action: `tool_${action}`,
    category: toolCategory,
    label: label ?? toolName,
    value,
  });

  // Also push to internal analytics endpoint (fire-and-forget)
  sendInternalToolEvent({ toolName, toolCategory, action, label, value });
}

async function sendInternalToolEvent(event: ToolEvent) {
  try {
    await fetch("/api/analytics/tool-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...event,
        timestamp: new Date().toISOString(),
        referrer: document.referrer,
        userAgent: navigator.userAgent,
      }),
      keepalive: true, // ensures request survives navigation
    });
  } catch {
    // Silently swallow — analytics should never break the app
  }
}

// ─── Core Web Vitals ──────────────────────────────────────────────────────────

/**
 * Report a Web Vital to GA4.
 * Pass this function directly to `onCLS`, `onLCP`, etc. from `web-vitals`.
 */
export function reportWebVital(metric: WebVitalMetric) {
  // Determine GA4 event value: use integer milliseconds for time-based metrics,
  // keep CLS as a scaled integer (x1000) so GA4 stores it meaningfully.
  const value =
    metric.name === "CLS"
      ? Math.round(metric.value * 1000)
      : Math.round(metric.value);

  trackEvent({
    action: metric.name,
    category: "Web Vitals",
    label: metric.id,
    value,
    nonInteraction: true,
  });

  // Also push to GA4 as a custom dimension for BigQuery export
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "web_vitals", {
      metric_name: metric.name,
      metric_value: metric.value,
      metric_rating: metric.rating,
      metric_delta: metric.delta,
      metric_id: metric.id,
    });
  }
}

// ─── AdSense Tracking ─────────────────────────────────────────────────────────

/** Track an AdSense ad event (impression, click, viewable). */
export function trackAdSenseEvent({
  adUnit,
  adFormat,
  action,
  revenue,
}: AdSenseEvent) {
  trackEvent({
    action: `adsense_${action}`,
    category: "AdSense",
    label: `${adUnit} — ${adFormat}`,
    value: revenue !== undefined ? Math.round(revenue * 1000000) : undefined,
    nonInteraction: action === "impression",
  });
}

// ─── Microsoft Clarity ────────────────────────────────────────────────────────

/** Tag a Clarity session with a custom key-value pair. */
export function setClarityTag(key: string, value: string) {
  if (typeof window !== "undefined" && typeof window.clarity === "function") {
    window.clarity("set", key, value);
  }
}

/** Identify an authenticated user in Clarity. */
export function identifyInClarity(
  userId: string,
  sessionId?: string,
  pageId?: string,
  friendlyName?: string,
) {
  if (typeof window !== "undefined" && typeof window.clarity === "function") {
    window.clarity("identify", userId, sessionId, pageId, friendlyName);
  }
}

// ─── Consent helpers ─────────────────────────────────────────────────────────

/** Update GA4 consent state (GDPR). */
export function updateConsent(
  analytics: "granted" | "denied",
  ads: "granted" | "denied",
) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("consent", "update", {
      analytics_storage: analytics,
      ad_storage: ads,
      ad_user_data: ads,
      ad_personalization: ads,
    });
  }
}
