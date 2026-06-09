/**
 * GDPR/CCPA-compliant cookie consent manager.
 * Stores consent in localStorage, exposes helpers for
 * conditional ad/script loading based on user choice.
 */

const STORAGE_KEY = "toolverse-consent";

export type ConsentCategory =
  | "necessary"
  | "analytics"
  | "advertising"
  | "functional";

export interface ConsentState {
  necessary: boolean; // Always true — cannot be disabled
  analytics: boolean; // Google Analytics, etc.
  advertising: boolean; // AdSense, third-party ads
  functional: boolean; // Preferences, theme, etc.
  timestamp: string; // ISO 8601
  version: number; // Policy version — bump to re-prompt
}

export const CONSENT_VERSION = 1;

const DEFAULT_CONSENT: ConsentState = {
  necessary: true,
  analytics: false,
  advertising: false,
  functional: false,
  timestamp: new Date().toISOString(),
  version: CONSENT_VERSION,
};

/**
 * Read current consent from localStorage.
 * Returns null if no consent stored (show banner).
 */
export function getConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentState;
    // Re-prompt if policy version changed
    if (parsed.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Save consent choice and fire consent update events.
 */
export function saveConsent(categories: {
  analytics?: boolean;
  advertising?: boolean;
  functional?: boolean;
}): ConsentState {
  const consent: ConsentState = {
    ...DEFAULT_CONSENT,
    ...categories,
    timestamp: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));

  // Fire a custom event so other parts of the app can react
  window.dispatchEvent(new CustomEvent("consent:update", { detail: consent }));

  // Google Consent Mode v2 update
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: consent.analytics ? "granted" : "denied",
      ad_storage: consent.advertising ? "granted" : "denied",
      ad_user_data: consent.advertising ? "granted" : "denied",
      ad_personalization: consent.advertising ? "granted" : "denied",
      functionality_storage: consent.functional ? "granted" : "denied",
    });
  }

  return consent;
}

/**
 * Check if a specific category is consented.
 */
export function hasConsent(category: ConsentCategory): boolean {
  const consent = getConsent();
  if (category === "necessary") return true;
  return consent?.[category] ?? false;
}

/**
 * Revoke all optional consent (user opts out).
 */
export function revokeConsent(): ConsentState {
  return saveConsent({
    analytics: false,
    advertising: false,
    functional: false,
  });
}

/**
 * Grant all consent (user accepts all).
 */
export function grantAllConsent(): ConsentState {
  return saveConsent({
    analytics: true,
    advertising: true,
    functional: true,
  });
}

// Extend Window for gtag
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}
