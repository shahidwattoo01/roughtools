import { useEffect, useRef, useState } from "react";
import { useAdContext } from "./ad-provider.js";

interface AdAnchorProps {
  adSlot: string;
  className?: string;
}

/**
 * Anchor/overlay ad — fixed to bottom of viewport.
 * Includes a dismiss button per Google policy.
 */
export function AdAnchor({ adSlot, className = "" }: AdAnchorProps) {
  const { loadAd, adConsent } = useAdContext();
  const [dismissed, setDismissed] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    if (!adConsent || dismissed || loaded.current) return;
    loaded.current = true;

    // Small delay so the anchor doesn't block initial page view
    const timer = setTimeout(() => loadAd(adSlot), 3000);
    return () => clearTimeout(timer);
  }, [adSlot, adConsent, dismissed, loadAd]);

  if (!adConsent || dismissed) return null;

  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-2xl ${className}`}
      role="complementary"
      aria-label="Advertisement"
    >
      {/* Dismiss button — required by Google */}
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-2 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Dismiss advertisement"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div className="flex justify-center py-2">
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "100%", maxHeight: "100px" }}
          data-ad-client="ca-pub-XXXXX"
          data-ad-slot={adSlot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}
