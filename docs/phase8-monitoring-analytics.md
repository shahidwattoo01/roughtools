# Phase 8: Monitoring & Analytics

## Files Created

| Feature         | File                                                              |
| --------------- | ----------------------------------------------------------------- |
| GA4             | `apps/web/src/components/analytics/GoogleAnalytics.tsx`           |
| Search Console  | `apps/web/src/components/analytics/SearchConsoleVerification.tsx` |
| Web Vitals      | `apps/web/src/components/analytics/WebVitals.tsx`                 |
| Sentry          | `apps/api/src/middleware/sentry.ts`                               |
| UptimeRobot     | `infrastructure/monitoring/uptimerobot-config.json`               |
| Logger          | `apps/api/src/lib/logger.ts`                                      |
| MS Clarity      | `apps/web/src/components/analytics/MicrosoftClarity.tsx`          |
| AdSense         | `apps/web/src/components/analytics/AdSense.tsx`                   |
| Analytics API   | `apps/api/src/routes/tool-analytics.ts`                           |
| Admin Dashboard | `apps/web/src/app/admin/analytics/page.tsx`                       |

## Install Dependencies

```bash
cd apps/web && pnpm add web-vitals
cd apps/api && pnpm add @sentry/node @sentry/profiling-node winston winston-daily-rotate-file
```

## Run Migration

```bash
cd packages/db
pnpm prisma migrate dev --name phase8_analytics
```

## Service Setup

- **GA4** → analytics.google.com → copy `G-XXXXXXXXXX` → set `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- **Search Console** → HTML tag verification → set `NEXT_PUBLIC_GSC_VERIFICATION_TOKEN`
- **Sentry** → sentry.io → new project → copy DSN → set `SENTRY_DSN`
- **Clarity** → clarity.microsoft.com → copy project ID → set `NEXT_PUBLIC_CLARITY_PROJECT_ID`
- **AdSense** → adsense.google.com → copy publisher ID → set `NEXT_PUBLIC_ADSENSE_CLIENT`
- **UptimeRobot** → uptimerobot.com → create monitors from uptimerobot-config.json
