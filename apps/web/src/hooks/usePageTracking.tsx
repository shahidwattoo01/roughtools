/**
 * usePageTracking.ts
 * Client-side hook that fires a GA4 page_view on every App Router navigation.
 * Import and call inside a client component that wraps your root layout.
 */

'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackPageView, setClarityTag } from '@/lib/analytics';

export function usePageTracking() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;

    const url = searchParams.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

    // GA4 page view
    trackPageView(url, document.title);

    // Tag Clarity session with current path for easier heatmap filtering
    setClarityTag('page', pathname);
  }, [pathname, searchParams]);
}

// â”€â”€â”€ Provider wrapper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

import { Suspense } from 'react';

function PageTrackingInner() {
  usePageTracking();
  return null;
}

/**
 * Drop-in component â€” add once inside your root layout client wrapper.
 * Wrapped in Suspense because useSearchParams() requires it in App Router.
 */
export function PageTracker() {
  return (
    <Suspense fallback={null}>
      <PageTrackingInner />
    </Suspense>
  );
}