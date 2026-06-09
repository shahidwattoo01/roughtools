/**
 * WebVitals.tsx
 * Client component that registers web-vitals observers (LCP, CLS, FID/INP, FCP, TTFB)
 * and pipes results to GA4 via reportWebVital().
 *
 * Usage: add <WebVitals /> anywhere inside a client boundary (e.g. root layout).
 */

"use client";

import { useEffect } from "react";
import { GA_MEASUREMENT_ID, reportWebVital, type WebVitalMetric } from "@/lib/analytics";

export default function WebVitals() {
  useEffect(() => {
    if (!GA_MEASUREMENT_ID) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[WebVitals] NEXT_PUBLIC_GA_MEASUREMENT_ID is not set — " +
          "Core Web Vitals will not be reported to GA4."
        );
      }
      return;
    }

    // Dynamically import web-vitals to avoid SSR issues and keep it out of the
    // critical bundle path.
    import("web-vitals").then(
      ({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
        const handler = (metric: WebVitalMetric) => reportWebVital(metric);

        onCLS(handler);  // Cumulative Layout Shift
        onINP(handler);  // Interaction to Next Paint (Core Web Vital since 2024)
        onFCP(handler);  // First Contentful Paint
        onLCP(handler);  // Largest Contentful Paint
        onTTFB(handler); // Time to First Byte
      },
    );
  }, []);

  return null; // No rendered output
}
