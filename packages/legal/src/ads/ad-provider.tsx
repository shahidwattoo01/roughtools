import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { hasConsent } from "../consent/consent-manager.js";

/**
 * Ad context — provides lazy loading helpers and consent gating.
 * Wrap your app in <AdProvider> once.
 */

interface AdContextValue {
  /** Load an ad unit by slot ID. No-op if ads not consented. */
  loadAd: (slotId: string) => void;
  /** Whether advertising consent has been granted */
  adConsent: boolean;
}

const AdContext = createContext<AdContextValue | null>(null);

export function useAdContext(): AdContextValue {
  const ctx = useContext(AdContext);
  if (!ctx) throw new Error("useAdContext must be used within <AdProvider>");
  return ctx;
}

interface AdProviderProps {
  children: ReactNode;
  /** Google AdSense publisher ID (ca-pub-XXXXX) */
  publisherId: string;
}

export function AdProvider({ children, publisherId }: AdProviderProps) {
  const [adConsent, setAdConsent] = useState(() => hasConsent("advertising"));
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const pendingSlots = useRef<Set<string>>(new Set());

  // Listen for consent changes
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.advertising !== undefined) {
        setAdConsent(detail.advertising);
      }
    };
    window.addEventListener("consent:update", handler);
    return () => window.removeEventListener("consent:update", handler);
  }, []);

  // Load AdSense script lazily — only when first ad is requested AND consent given
  const loadScript = useCallback(() => {
    if (scriptLoaded || !adConsent) return;

    // Set publisher ID for auto-ads
    (window as unknown as Record<string, string>).adsbygoogle = publisherId;

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`;
    script.crossOrigin = "anonymous";
    script.onload = () => setScriptLoaded(true);
    document.head.appendChild(script);
  }, [publisherId, adConsent, scriptLoaded]);

  const loadAd = useCallback(
    (slotId: string) => {
      if (!adConsent) return;

      if (!scriptLoaded) {
        pendingSlots.current.add(slotId);
        loadScript();
        return;
      }

      // Push ad unit to Google's queue
      try {
        ((window as unknown as Record<string, unknown[]>).adsbygoogle ??=
          []).push({});
      } catch {
        // Ad blocked or script failed — silent fail
      }
    },
    [adConsent, scriptLoaded, loadScript],
  );

  // When script finishes loading, push any pending slots
  useEffect(() => {
    if (scriptLoaded && pendingSlots.current.size > 0) {
      for (const slotId of pendingSlots.current) {
        loadAd(slotId);
      }
      pendingSlots.current.clear();
    }
  }, [scriptLoaded, loadAd]);

  return (
    <AdContext.Provider value={{ loadAd, adConsent }}>
      {children}
    </AdContext.Provider>
  );
}
