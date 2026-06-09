/**
 * SearchConsoleVerification.tsx
 * Renders the Google Search Console HTML-tag verification meta element.
 * Add this to your root layout's <head> via Next.js metadata API or directly.
 *
 * Preferred: use Next.js metadata export in layout.tsx (shown in comments below).
 * Fallback:  render <SearchConsoleMeta /> inside a custom <Head> component.
 */

// ─── Option A: Next.js Metadata API (recommended) ────────────────────────────
// In apps/web/src/app/layout.tsx, add to your metadata export:
//
// export const metadata: Metadata = {
//   ...
//   verification: {
//     google: process.env.NEXT_PUBLIC_GSC_VERIFICATION_TOKEN,
//   },
// };
//
// That single line makes Next.js emit:
//   <meta name="google-site-verification" content="<token>" />
// ─────────────────────────────────────────────────────────────────────────────

// ─── Option B: Manual component (legacy Pages Router or custom _document) ────

interface SearchConsoleMetaProps {
  token?: string;
}

/**
 * Drop-in <meta> tag for Google Search Console HTML-tag verification.
 * Place inside a Next.js <Head> or equivalent.
 */
export function SearchConsoleMeta({ token }: SearchConsoleMetaProps) {
  const verificationToken =
    token ?? process.env.NEXT_PUBLIC_GSC_VERIFICATION_TOKEN;
  if (!verificationToken) return null;

  return <meta name="google-site-verification" content={verificationToken} />;
}

// ─── generateMetadata helper ──────────────────────────────────────────────────

/**
 * Helper to merge GSC verification into any Next.js metadata object.
 *
 * Usage:
 *   export const metadata = withGSCVerification({ title: 'Home', ... });
 */
export function withGSCVerification<T extends Record<string, unknown>>(
  meta: T,
): T {
  const token = process.env.NEXT_PUBLIC_GSC_VERIFICATION_TOKEN;
  if (!token) return meta;

  return {
    ...meta,
    verification: {
      // @ts-expect-error — merging into caller's metadata shape
      ...(meta.verification ?? {}),
      google: token,
    },
  };
}
