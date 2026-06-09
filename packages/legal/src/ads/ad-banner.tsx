import { useEffect, useRef } from "react";
import { useAdContext } from "./ad-provider.js";

interface AdBannerProps {
  /** Google AdSense ad-slot attribute */
  adSlot: string;
  /** Width in pixels */
  width?: number;
  /** Height in pixels */
  height?: number;
  /** Tailwind class for the wrapper */
  className?: string;
}

/**
 * Horizontal banner ad — typically 728x90 (leaderboard) or responsive.
 * Renders inside a <ins> element per Google's requirements.
 */
export function AdBanner({
  adSlot,
  width = 728,
  height = 90,
  className = "",
}: AdBannerProps) {
  const { loadAd, adConsent } = useAdContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (!adConsent || loaded.current) return;
    loaded.current = true;
    loadAd(adSlot);
  }, [adSlot, adConsent, loadAd]);

  if (!adConsent) return null;

  return (
    <div
      ref={containerRef}
      className={`flex justify-center ${className}`}
      aria-hidden="true"
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: `${width}px`, height: `${height}px` }}
        data-ad-client="ca-pub-XXXXX"
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
