import { useEffect, useRef } from "react";
import { useAdContext } from "./ad-provider.js";

interface AdInFeedProps {
  adSlot: string;
  className?: string;
}

/**
 * In-feed ad — blends into a list/grid of tools.
 * Use between tool cards for native feel.
 */
export function AdInFeed({ adSlot, className = "" }: AdInFeedProps) {
  const { loadAd, adConsent } = useAdContext();
  const loaded = useRef(false);

  useEffect(() => {
    if (!adConsent || loaded.current) return;
    loaded.current = true;
    loadAd(adSlot);
  }, [adSlot, adConsent, loadAd]);

  if (!adConsent) return null;

  return (
    <div
      className={`rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%" }}
        data-ad-client="ca-pub-XXXXX"
        data-ad-slot={adSlot}
        data-ad-layout="in-article"
        data-ad-format="fluid"
      />
    </div>
  );
}
