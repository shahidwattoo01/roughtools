# syntax=docker/dockerfile:1

# ---- Base ----
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@8.15.0 --activate
RUN apk add --no-cache libc6-compat
WORKDIR /app

# ---- Dependencies ----
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY packages/ui/package.json             ./packages/ui/package.json
COPY packages/utils/package.json          ./packages/utils/package.json
COPY packages/config/package.json         ./packages/config/package.json
COPY packages/types/package.json          ./packages/types/package.json
COPY packages/db/package.json             ./packages/db/package.json
COPY packages/seo/package.json            ./packages/seo/package.json
COPY packages/errors/package.json         ./packages/errors/package.json
COPY packages/validation/package.json     ./packages/validation/package.json
COPY packages/validators/package.json     ./packages/validators/package.json
COPY packages/cache/package.json          ./packages/cache/package.json
COPY packages/redis/package.json          ./packages/redis/package.json
COPY packages/calculators-core/package.json ./packages/calculators-core/package.json
COPY packages/legal/package.json          ./packages/legal/package.json
COPY packages/queue/package.json          ./packages/queue/package.json
COPY packages/storage/package.json        ./packages/storage/package.json
COPY apps/web/package.json                ./apps/web/package.json

RUN pnpm install --frozen-lockfile

# ---- Builder ----
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=deps /app/packages ./packages
COPY . .

ARG NODE_ENV=production
ARG DATABASE_URL
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_APP_URL

ENV NODE_ENV=${NODE_ENV}
ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm build --filter=@workspace/web

# ---- Runner ----
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/web/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/web/server.js"]