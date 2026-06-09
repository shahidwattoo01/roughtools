// instrumentation.ts — Next.js server startup hook
// Sentry is disabled until NEXT_PUBLIC_SENTRY_DSN is configured.
// To re-enable: add @sentry/nextjs to package.json dependencies and
// restore the Sentry.init() call below.

export async function register() {
  // intentionally empty — monitoring not yet configured
}
