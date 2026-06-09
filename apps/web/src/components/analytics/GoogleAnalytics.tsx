/**
 * GoogleAnalytics.tsx
 * Injects GA4 script tags into <head>.
 *
 * NOTE: gtag() function declaration and consent mode defaults are set
 * by a synchronous inline <script> in layout.tsx that runs BEFORE this.
 * This component only loads the gtag.js library and calls gtag('config').
 */

import Script from "next/script";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";

interface GoogleAnalyticsProps {
  measurementId?: string;
}

export default function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  const id = measurementId ?? GA_MEASUREMENT_ID;

  if (!id || process.env.NODE_ENV === "development") return null;

  const initScript = `gtag('js', new Date()); gtag('config', '${id}', { send_page_view: false, cookie_flags: 'SameSite=None;Secure', transport_url: 'https://www.google-analytics.com', first_party_collection: true });`;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script
        id="ga4-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: initScript }}
      />
    </>
  );
}
