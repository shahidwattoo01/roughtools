import { useEffect, useRef } from "react";
import { useAdContext } from "./ad-provider.js";

interface AdSidebarProps {
  adSlot: string;
  width?: number;
  height?: number;
  className?: string;
}

/**
 * Sidebar ad — typically 300x250 (medium rectangle) or 300x600 (half page).
 * Sticky positioning is left to the parent for flexibility.
 */
export function AdSidebar({
  adSlot,
  width = 300,
  height = 250,
  className = "",
}: AdSidebarProps) {
  const { loadAd, adConsent } = useAdContext();
  const loaded = useRef(false);

  useEffect(() => {
    if (!adConsent || loaded.current) return;
    loaded.current = true;
    loadAd(adSlot);
  }, [adSlot, adConsent, loadAd]);

  if (!adConsent) return null;

  return (
    <div className={className} aria-hidden="true">
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: `${width}px`, height: `${height}px` }}
        data-ad-client="ca-pub-XXXXX"
        data-ad-slot={adSlot}
        data-ad-format="auto"
      />
    </div>
  );
}
