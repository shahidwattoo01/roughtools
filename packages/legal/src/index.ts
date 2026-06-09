// Consent
export { CookieBanner } from "./consent/index.js";
export {
  getConsent,
  saveConsent,
  hasConsent,
  grantAllConsent,
  revokeConsent,
  CONSENT_VERSION,
} from "./consent/index.js";
export type { ConsentState, ConsentCategory } from "./consent/index.js";

// Ads
export {
  AdProvider,
  useAdContext,
  AdBanner,
  AdSidebar,
  AdInFeed,
  AdAnchor,
} from "./ads/index.js";

// Policy pages
export { PrivacyPolicy } from "./policies/index.js";
export { TermsOfService } from "./policies/index.js";
export { AboutUs } from "./policies/index.js";
