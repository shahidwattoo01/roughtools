/**
 * MicrosoftClarity.tsx
 * Injects the Microsoft Clarity snippet for session recordings and heatmaps.
 * Uses next/script with `afterInteractive` strategy so it does not block rendering.
 */

import Script from "next/script";

const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID ?? "";

export default function MicrosoftClarity() {
  if (!CLARITY_PROJECT_ID || process.env.NODE_ENV === "development")
    return null;

  return (
    <Script
      id="microsoft-clarity"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
        `,
      }}
    />
  );
}
