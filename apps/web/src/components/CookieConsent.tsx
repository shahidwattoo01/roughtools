'use client'

import { useState, useEffect, useCallback } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────
type ConsentStatus = 'accepted' | 'analytics-only' | 'declined'

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Dispatch a global browser event so AdUnit and other components can
 * react to consent changes without prop-drilling.
 */
function dispatchConsentEvent(status: ConsentStatus) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(
    new CustomEvent('cookie-consent-updated', { detail: { status } }),
  )
}

/**
 * Update Google Consent Mode v2 signals.
 * GA4 defaults are already set to 'denied' in GoogleAnalytics.tsx.
 */
function updateGoogleConsent(ads: boolean, analytics: boolean) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('consent', 'update', {
    analytics_storage:   analytics ? 'granted' : 'denied',
    ad_storage:          ads       ? 'granted' : 'denied',
    ad_user_data:        ads       ? 'granted' : 'denied',
    ad_personalization:  ads       ? 'granted' : 'denied',
  })
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CookieConsent() {
  const [visible, setVisible]         = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [adsEnabled, setAdsEnabled]   = useState(true)
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('cookie_consent')
    if (!stored) {
      // Brief delay so the page paints first; then show banner
      const t = setTimeout(() => setVisible(true), 800)
      return () => clearTimeout(t)
    }
  }, [])

  const acceptAll = useCallback(() => {
    localStorage.setItem('cookie_consent', 'accepted')
    setVisible(false)
    updateGoogleConsent(true, true)
    dispatchConsentEvent('accepted')
  }, [])

  const declineAll = useCallback(() => {
    localStorage.setItem('cookie_consent', 'declined')
    setVisible(false)
    updateGoogleConsent(false, false)
    dispatchConsentEvent('declined')
  }, [])

  const savePreferences = useCallback(() => {
    const status: ConsentStatus =
      adsEnabled && analyticsEnabled ? 'accepted'
      : analyticsEnabled ? 'analytics-only'
      : 'declined'

    localStorage.setItem('cookie_consent', status)
    localStorage.setItem('cookie_pref_ads', String(adsEnabled))
    localStorage.setItem('cookie_pref_analytics', String(analyticsEnabled))
    setVisible(false)
    updateGoogleConsent(adsEnabled, analyticsEnabled)
    dispatchConsentEvent(adsEnabled ? 'accepted' : status)
  }, [adsEnabled, analyticsEnabled])

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Cookie consent"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10000,
        background: 'linear-gradient(180deg, #0b0f1d 0%, #070a14 100%)',
        borderTop: '1px solid rgba(124,139,255,0.25)',
        boxShadow: '0 -8px 40px rgba(0,0,0,0.6)',
        padding: '20px 24px',
        fontFamily: 'inherit',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* ── Main row ── */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          gap: 16,
          justifyContent: 'space-between',
        }}>

          {/* Text */}
          <div style={{ flex: '1 1 420px', minWidth: 0 }}>
            <p style={{
              margin: '0 0 6px',
              fontSize: 14,
              fontWeight: 700,
              color: '#e8eaff',
            }}>
              🍪 We use cookies &amp; ads
            </p>
            <p style={{
              margin: 0,
              fontSize: 13,
              color: '#9498bc',
              lineHeight: 1.6,
            }}>
              This site uses Google Analytics (traffic analysis) and{' '}
              <strong style={{ color: '#b0b4d8' }}>Google AdSense</strong> (personalised ads), which
              set third-party cookies. EU/UK visitors: ads will not load until you accept.{' '}
              <a href="/privacy-policy" style={{ color: '#7c8bff', textDecoration: 'underline' }}>
                Privacy Policy
              </a>
              {' '}·{' '}
              <button
                onClick={() => setShowDetails(v => !v)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#7c8bff',
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: 13,
                  textDecoration: 'underline',
                }}
              >
                {showDetails ? 'Hide details' : 'Manage preferences'}
              </button>
            </p>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 10, flexShrink: 0, alignItems: 'center' }}>
            <button
              onClick={declineAll}
              style={{
                padding: '9px 18px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#888bad',
                cursor: 'pointer',
              }}
            >
              Decline
            </button>
            <button
              onClick={acceptAll}
              style={{
                padding: '9px 22px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 700,
                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                boxShadow: '0 2px 12px rgba(99,102,241,0.4)',
              }}
            >
              Accept All
            </button>
          </div>
        </div>

        {/* ── Expanded preferences ── */}
        {showDetails && (
          <div style={{
            marginTop: 20,
            padding: '20px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 16,
          }}>

            {/* Analytics toggle */}
            <label style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 14,
              flex: '1 1 260px',
              cursor: 'pointer',
            }}>
              <input
                type="checkbox"
                checked={analyticsEnabled}
                onChange={e => setAnalyticsEnabled(e.target.checked)}
                style={{ marginTop: 3, accentColor: '#6366f1', width: 16, height: 16 }}
              />
              <div>
                <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 600, color: '#d4d8ff' }}>
                  Analytics cookies
                </p>
                <p style={{ margin: 0, fontSize: 12, color: '#7880a4', lineHeight: 1.5 }}>
                  Google Analytics 4 — helps us understand which tools are most useful.
                  No personally identifiable information is stored.
                </p>
              </div>
            </label>

            {/* Ads toggle */}
            <label style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 14,
              flex: '1 1 260px',
              cursor: 'pointer',
            }}>
              <input
                type="checkbox"
                checked={adsEnabled}
                onChange={e => setAdsEnabled(e.target.checked)}
                style={{ marginTop: 3, accentColor: '#6366f1', width: 16, height: 16 }}
              />
              <div>
                <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 600, color: '#d4d8ff' }}>
                  Advertising cookies
                </p>
                <p style={{ margin: 0, fontSize: 12, color: '#7880a4', lineHeight: 1.5 }}>
                  Google AdSense — serves ads that keep this site free. Google may use cookies
                  to personalise ads based on your interests.{' '}
                  <a
                    href="https://adssettings.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#7c8bff' }}
                  >
                    Manage Google ad settings ↗
                  </a>
                </p>
              </div>
            </label>

            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={savePreferences}
                style={{
                  padding: '9px 22px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                Save preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
