import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { JsonLd } from '@/components/JsonLd';
import { getWebsiteSchema, getOrganizationSchema } from '@/lib/structured-data';
import { generateHomeMetadata } from '@/lib/seo';
import { SEO_CONFIG } from '@/lib/seo-config';
import dynamic from 'next/dynamic';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import { PageTracker } from '@/hooks/usePageTracking';
import Footer from '@/components/Footer';
import { FontLoader } from '@/components/FontLoader';
import SiteHeader from '@/components/SiteHeader';
import { ScrollReveal } from '@/components/ScrollReveal';
import { CommandPaletteProvider } from '@/components/CommandPalette';
import { Toaster } from '@/components/Toaster';
import { ThemeProvider } from '@/components/ThemeProvider';
import Providers from '@/components/Providers';
import './globals.css';

// ─── FONTS ────────────────────────────────────────────────────
// ⚡ PERF: 3 weights instead of 5 (removes 2 font-file round-trips).
// 600 is covered by 700 at browser fallback; 800 only used in a few
// headings and barely differs from 700 visually.
const inter = localFont({
  src: [
    { path: '../../public/fonts/inter-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/inter-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: '../../public/fonts/inter-latin-700-normal.woff2', weight: '700', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
});

// ─── LAZY-LOADED non-critical UI ──────────────────────────────
// ChatbotLoader defers the chatbot until page is idle (desktop) or
// first user interaction (mobile) so it doesn't compete with AdSense.
const ChatbotLoader = dynamic(() => import('@/components/ChatbotLoader'), { ssr: false });
const CookieConsent = dynamic(() => import('@/components/CookieConsent'), { ssr: false });

// ─── ROOT METADATA ────────────────────────────────────────────
export const metadata: Metadata = generateHomeMetadata();

// ─── VIEWPORT CONFIG ─────────────────────────────────────────
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: SEO_CONFIG.themeColor },
    { media: '(prefers-color-scheme: dark)', color: '#312e81' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  colorScheme: 'light dark',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* DNS prefetch for external services */}
        <link rel="dns-prefetch" href="//plausible.io" />
        <link rel="dns-prefetch" href="//cdn.jsdelivr.net" />

        {/*
          ⚡ PERF: The render-blocking <link rel="stylesheet"> for
          Instrument Serif / JetBrains Mono / DM Serif Display was removed.
          Those decorative fonts are used on a handful of pages only.
          They are now loaded with rel="preload" as="style" + onLoad swap
          so they NEVER block the First Contentful Paint.
          Pages that need them should use next/font locally instead.
        */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Non-blocking font load: fetch async, apply on load */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&family=DM+Serif+Display&display=optional"
        />
        <FontLoader />

        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />

        {/* Structured Data — Site-wide schemas */}
        <JsonLd data={[getWebsiteSchema(), getOrganizationSchema()]} />

        {/*
          ── Consent Mode v2 — MUST run synchronously before any ad/analytics script ──
          Sets all storage to 'denied' by default so no cookies fire without consent.
          CookieConsent.tsx calls gtag('consent','update',...) after the user accepts.
          This inline script has no external dependencies and executes immediately.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                analytics_storage:  'denied',
                ad_storage:         'denied',
                ad_user_data:       'denied',
                ad_personalization: 'denied',
                wait_for_update:    500
              });
            `,
          }}
        />

        {/* Google Analytics 4 — loads after the consent default above */}
        <GoogleAnalytics />

        {/* Monetag site verification */}
        <meta name="monetag" content="65537eeda9695bec35087798f99dd051" />

        {/* Google AdSense — in <head> so Google's crawler can verify it */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4969790536067353"
          crossOrigin="anonymous"
        />
      </head>

      <body
        className={`
          ${inter.className}
          min-h-screen antialiased
        `}
      >
        {/* Fires GA4 page_view on every App Router navigation */}
        <PageTracker />

        {/* Skip to main content (accessibility) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4
                     focus:z-50 focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white
                     focus:rounded-lg focus:shadow-lg focus:outline-none"
        >
          Skip to main content
        </a>

        <Providers>
          <ThemeProvider>
            {/* Command Palette — wraps everything so Cmd+K works globally */}
            <CommandPaletteProvider>
              {/* Global sticky header */}
              <SiteHeader />

              <main id="main-content">{children}</main>

              <Footer />

              {/* Floating chatbot — idle-deferred so ads load first */}
              <ChatbotLoader />

              {/* Scroll reveal — activates .reveal elements */}
              <ScrollReveal />

              {/* Vercel Analytics (Phase 9) */}
              <Analytics />

              {/* Vercel Speed Insights — Core Web Vitals (Phase 2.4) */}
              <SpeedInsights />

              {/* GDPR Cookie Consent Banner (required for AdSense) */}
              <CookieConsent />

              {/* Toast notifications — bottom-right, auto-dismiss 3s */}
              <Toaster />
            </CommandPaletteProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
