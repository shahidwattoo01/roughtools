/**
 * AdSense.tsx
 * Google AdSense script loader + responsive ad unit component.
 *
 * GDPR / consent-mode compliance:
 *  - AdSenseScript renders the <script> tag only after the user grants
 *    ad_storage consent (via CookieConsent). It listens for the
 *    "cookie-consent-updated" event dispatched by CookieConsent.tsx.
 *  - AdUnit pushes to adsbygoogle only when consent is granted AND
 *    the script has had time to initialise.
 *  - GA4 already sets gtag consent defaults to 'denied' in
 *    GoogleAnalytics.tsx; those signals are updated by CookieConsent.tsx.
 */

'use client'

import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'
import { trackAdSenseEvent } from '@/lib/analytics'

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? ''

// ─── Consent helper ────────────────────────────────────────────────────────

/** Returns true if the stored consent value permits ad cookies. */
function hasAdConsent(): boolean {
  if (typeof localStorage === 'undefined') return false
  return localStorage.getItem('cookie_consent') === 'accepted'
}

// ─── Script Loader ─────────────────────────────────────────────────────────

/**
 * Injects the AdSense script tag.
 * Renders nothing until ad consent is granted so the script is never
 * loaded without permission (GDPR requirement).
 * Place <AdSenseScript /> in root layout.
 */
export function AdSenseScript() {
  const [consented, setConsented] = useState(false)

  useEffect(() => {
    // Check if consent was previously given (returning visitor)
    if (hasAdConsent()) {
      setConsented(true)
      return
    }

    // Listen for live consent grant during this session
    function onConsent(e: Event) {
      const detail = (e as CustomEvent<{ status: string }>).detail
      if (detail?.status === 'accepted') setConsented(true)
    }
    window.addEventListener('cookie-consent-updated', onConsent)
    return () => window.removeEventListener('cookie-consent-updated', onConsent)
  }, [])

  if (!consented || !ADSENSE_CLIENT || process.env.NODE_ENV === 'development') return null

  return (
    <Script
      id="adsense-script"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
  )
}

// ─── Ad Unit ──────────────────────────────────────────────────────────────

interface AdUnitProps {
  /** AdSense ad-slot ID (the numeric part from your AdSense dashboard) */
  slot: string
  /** Ad format — defaults to 'auto' (responsive) */
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal'
  /** Inline style override for the <ins> element */
  style?: React.CSSProperties
  /** GA4 label for this ad position, e.g. "tool-page-top" */
  label?: string
  className?: string
}

/**
 * Renders a single responsive AdSense ad unit.
 *
 * - Waits for consent before calling adsbygoogle.push({})
 * - Tracks viewable impressions and clicks via GA4
 */
export function AdUnit({ slot, format = 'auto', style, label: _label, className }: AdUnitProps) {
  const adRef     = useRef<HTMLModElement>(null)
  const tracked   = useRef(false)
  const pushed    = useRef(false)

  const pushAd = () => {
    if (pushed.current || !ADSENSE_CLIENT) return
    pushed.current = true
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // adsbygoogle not ready — will be picked up once script loads
    }
  }

  useEffect(() => {
    if (typeof window === 'undefined' || !ADSENSE_CLIENT) return

    // If consent already granted, push immediately
    if (hasAdConsent()) {
      // Small delay to let the AdSense script initialise first
      const t = setTimeout(pushAd, 100)
      return () => clearTimeout(t)
    }

    // Otherwise wait for the consent event
    function onConsent(e: Event) {
      const detail = (e as CustomEvent<{ status: string }>).detail
      if (detail?.status === 'accepted') pushAd()
    }
    window.addEventListener('cookie-consent-updated', onConsent)
    return () => window.removeEventListener('cookie-consent-updated', onConsent)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Viewable-impression tracking (fires at 50 % visibility)
  useEffect(() => {
    if (!adRef.current || tracked.current) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !tracked.current) {
            tracked.current = true
            trackAdSenseEvent({ adUnit: slot, adFormat: format, action: 'viewable' })
          }
        })
      },
      { threshold: 0.5 },
    )

    observer.observe(adRef.current)
    return () => observer.disconnect()
  }, [slot, format])

  if (!ADSENSE_CLIENT || !slot) return null

  return (
    <div className={className}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
        onClick={() => trackAdSenseEvent({ adUnit: slot, adFormat: format, action: 'click' })}
      />
    </div>
  )
}
