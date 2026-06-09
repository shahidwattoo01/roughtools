import { useCallback, useEffect, useState } from "react";
import {
  getConsent,
  saveConsent,
  grantAllConsent,
  revokeConsent,
  type ConsentState,
} from "./consent-manager.js";

type BannerView = "default" | "details";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [view, setView] = useState<BannerView>("default");
  const [prefs, setPrefs] = useState<
    Omit<ConsentState, "timestamp" | "version" | "necessary">
  >({
    analytics: false,
    advertising: false,
    functional: false,
  });

  // Show banner only if no valid consent
  useEffect(() => {
    const existing = getConsent();
    if (!existing) setVisible(true);
  }, []);

  // Set default consent mode (deny all) on mount — required by Google
  useEffect(() => {
    if (visible && typeof window.gtag === "function") {
      window.gtag("consent", "default", {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        functionality_storage: "denied",
      });
    }
  }, [visible]);

  const handleAcceptAll = useCallback(() => {
    grantAllConsent();
    setVisible(false);
  }, []);

  const handleRejectAll = useCallback(() => {
    revokeConsent();
    setVisible(false);
  }, []);

  const handleSave = useCallback(() => {
    saveConsent(prefs);
    setVisible(false);
  }, [prefs]);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-modal="false"
      className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6"
    >
      <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl overflow-hidden">
        {view === "default" ? (
          <div className="p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0 mt-0.5"
                aria-hidden="true"
              >
                <svg
                  className="w-5 h-5 text-blue-600 dark:text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  We use cookies
                </h2>
                <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  We use cookies and similar technologies to serve ads, analyze
                  traffic, and improve your experience. You can choose which
                  categories to allow.{" "}
                  <a
                    href="/privacy"
                    className="text-blue-600 dark:text-blue-400 underline hover:no-underline"
                  >
                    Learn more
                  </a>
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-5">
              <button
                onClick={handleRejectAll}
                className="order-2 sm:order-1 rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              >
                Reject all
              </button>
              <button
                onClick={() => setView("details")}
                className="order-3 sm:order-2 rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              >
                Customize
              </button>
              <button
                onClick={handleAcceptAll}
                className="order-1 sm:order-3 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              >
                Accept all
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5 sm:p-6">
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Cookie preferences
            </h2>

            <div className="space-y-4">
              {/* Necessary — always on */}
              <ToggleRow
                label="Necessary"
                description="Required for the site to function. Cannot be disabled."
                checked={true}
                disabled={true}
              />
              {/* Analytics */}
              <ToggleRow
                label="Analytics"
                description="Help us understand how visitors interact with the site (e.g., Google Analytics)."
                checked={prefs.analytics}
                onChange={(v) => setPrefs((p) => ({ ...p, analytics: v }))}
              />
              {/* Advertising */}
              <ToggleRow
                label="Advertising"
                description="Used to deliver personalized ads through Google AdSense and partners."
                checked={prefs.advertising}
                onChange={(v) => setPrefs((p) => ({ ...p, advertising: v }))}
              />
              {/* Functional */}
              <ToggleRow
                label="Functional"
                description="Remember your preferences like theme and recently used tools."
                checked={prefs.functional}
                onChange={(v) => setPrefs((p) => ({ ...p, functional: v }))}
              />
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-6">
              <button
                onClick={() => setView("default")}
                className="order-2 sm:order-1 rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              >
                Back
              </button>
              <div className="order-1 sm:order-2 flex-1 sm:flex-none">
                <button
                  onClick={handleSave}
                  className="w-full sm:w-auto rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                >
                  Save preferences
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Toggle row sub-component ────────────────────────────

interface ToggleRowProps {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}

function ToggleRow({
  label,
  description,
  checked,
  disabled,
  onChange,
}: ToggleRowProps) {
  return (
    <div className="flex items-start gap-3">
      <button
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={[
          "relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900",
          checked ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
        ].join(" ")}
      >
        <span
          className={[
            "inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
            checked ? "translate-x-6" : "translate-x-1",
          ].join(" ")}
          aria-hidden="true"
        />
      </button>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {label}
          {disabled && (
            <span className="ml-2 text-xs text-gray-400 dark:text-gray-500 font-normal">
              (Always active)
            </span>
          )}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {description}
        </p>
      </div>
    </div>
  );
}
