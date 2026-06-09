# RoughTools — Complete Codebase Audit
**Date:** 2026-05-30 | **Root:** `C:\Users\shahid\ai-tools-platform`

---

## TABLE OF CONTENTS
1. [Project Overview](#1-project-overview)
2. [Root Config Files](#2-root-config-files)
3. [App Directory — Every Route](#3-app-directory)
4. [Components — Every File](#4-components)
5. [Hooks](#5-hooks)
6. [Lib](#6-lib)
7. [Types](#7-types)
8. [globals.css — Section by Section](#8-globalscss)
9. [Tool Page Patterns](#9-tool-page-patterns)
10. [Packages](#10-packages)
11. [Infrastructure](#11-infrastructure)
12. [Working vs Broken — Full List](#12-working-vs-broken)
13. [Priority Fix Plan](#13-priority-fix-plan)

---

## 1. PROJECT OVERVIEW

### Monorepo Structure
```
ai-tools-platform/
├── apps/
│   ├── web/          → Next.js 14 App Router (main product)
│   └── api/          → Express.js backend (secondary, largely unused by web)
├── packages/
│   ├── calculators-core/  → Shared calc logic (pure TS)
│   ├── cache/             → Caching utilities
│   ├── config/            → Shared ESLint/TS configs
│   ├── core-logic/        → Minimal, placeholder
│   ├── db/                → Prisma client wrapper
│   ├── errors/            → Error types/classes
│   ├── legal/             → Legal content helpers
│   ├── queue/             → Bull/queue utilities
│   ├── redis/             → Redis client wrapper
│   ├── seo/               → SEO helpers (JSON-LD, meta, sitemap, robots, slug)
│   ├── storage/           → File storage utilities
│   ├── types/             → Shared TypeScript types
│   ├── ui/                → Shared React component library
│   ├── utils/             → Utility functions
│   ├── validation/        → Input validation
│   └── validators/        → Extended validators
├── nginx/nginx.conf        → Reverse proxy (production)
├── docker-compose.yml      → Dev: web + PostgreSQL + Redis + Adminer
├── docker-compose.staging.yml
├── docker-compose.production.yml
├── railway.toml            → Railway deploy config (Gotenberg service)
├── Dockerfile.gotenberg    → PDF processing service
├── turbo.json              → Turborepo pipeline
├── pnpm-workspace.yaml     → Workspace config
├── tsconfig.base.json      → Root TS config
└── Makefile                → 50+ dev/deploy/ops commands
```

### Tech Stack
| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14.1 (App Router, RSC) |
| Runtime | Node.js ≥18.17 |
| Language | TypeScript 5.3 (strict mode) |
| Styling | Tailwind CSS 3.4 + global CSS design tokens |
| State | React 18.2 local state only (no Redux/Zustand) |
| Dark Mode | next-themes (class on `<html>`) |
| DB | PostgreSQL via Prisma 5 |
| Cache/Queue | Redis (ioredis) |
| Auth | NextAuth 4.24 |
| PDF | pdf-lib, pdfjs-dist, mammoth, docx, xlsx, pptxgenjs, jszip |
| Image | canvas, fabric, html2canvas, jspdf |
| AI | Anthropic Claude Haiku (via /api/ai proxy) |
| Analytics | GA4 + Vercel Analytics + Vercel Speed Insights |
| Ads | Google AdSense (consent-gated, GDPR-compliant) |
| Icons | @tabler/icons-react + inline SVG (icons.tsx) |
| Build | Turborepo 2.0 + pnpm 8.15 |
| Testing | Jest + React Testing Library + Playwright |
| Deploy | Docker + Nginx (production) / Railway (primary) |

### ⚠️ BRAND IDENTITY SPLIT — CRITICAL ISSUE
The codebase has a **dual-brand problem**. The project was originally "Toolverse" and is now "RoughTools" but the rename is incomplete:

| File | Still says "Toolverse" |
|------|----------------------|
| `lib/seo-config.ts` | `siteName: 'Toolverse'`, `siteUrl: 'https://toolverse.app'` |
| `lib/structured-data.ts` | `support@toolverse.app` email |
| `app/tools/pdf/[pdfTool]/page.tsx` | `const SITE = 'https://toolverse.app'` |
| `nginx/nginx.conf` | `server_name example.com www.example.com` |
| `about/page.tsx` | References "AI Tools Platform" |

**Impact:** Every page's JSON-LD schema, og:site_name, canonical URLs, and sitemap all say "Toolverse/toolverse.app" — severe SEO inconsistency.

---

## 2. ROOT CONFIG FILES

### `apps/web/next.config.ts`
- **Purpose:** Next.js production configuration
- `output: 'standalone'` → enables Docker deployment
- `eslint.ignoreDuringBuilds: true` → skips ESLint in CI (intentional shortcut)
- `reactStrictMode: true`, `poweredByHeader: false`
- **CSP headers** → allows Google Analytics, AdSense, DoubleClick scripts
- **Cache headers:** `/_next/static/` → 1 year immutable; `/tools/*` → 24h CDN + 7-day stale-while-revalidate
- **serverExternalPackages:** pdf-parse, pdfjs-dist, pdf-lib, docx, xlsx, jszip, mammoth, canvas, pptxgenjs (prevents webpack bundling native modules)
- Webpack custom chunk splitting (framework/lib/commons)
- `removeConsole: { exclude: ['error', 'warn'] }` in production
- `experimental.typedRoutes: true`
- ⚠️ `images.remotePatterns` still has `**.example.com` placeholder

### `apps/web/tailwind.config.ts`
- `darkMode: "class"` → works with next-themes
- Custom fonts defined: `font-display: Syne`, `font-body: DM Sans`, `font-mono: DM Mono`
- ⚠️ **Mismatch:** layout.tsx loads Inter + Instrument Serif + JetBrains Mono. Tailwind `font-display`/`font-body` classes won't apply the correct fonts at runtime.
- Brand color scale (`brand.*`, 10 stops), accent colors
- Custom animations: fade-in, slide-up, scale-in, skeleton-shimmer

### `apps/web/package.json`
- **Name:** `@workspace/web`
- Build: `node --max-old-space-size=8192 next build` (8GB RAM — large build)
- Key prod deps: next, react, react-dom, pdf-lib, pdfjs-dist, mammoth, docx, xlsx, jszip, pptxgenjs, canvas, fabric, html2canvas, jspdf, qrcode, qrcode.react, recharts, lucide-react, @tabler/icons-react, next-auth, next-themes, ioredis, @prisma/client, @vercel/analytics, @vercel/speed-insights, tailwind-merge, clsx

---

## 3. APP DIRECTORY

### Root Files (`apps/web/src/app/`)

| File | Purpose | Key notes |
|------|---------|-----------|
| `layout.tsx` | Root layout wrapping all pages | Loads Inter font, mounts ThemeProvider, CommandPaletteProvider, SiteHeader, Footer, ChatbotLoader, ScrollReveal, Analytics, CookieConsent, Toaster. Implements Google Consent Mode v2 (default denied). |
| `page.tsx` | Homepage | Hero with pill badge, H1, HomeSearchBar, CTA buttons, stats row, CategoryGrid (15 cats), popular tools links. |
| `globals.css` | Global design system | Full token system, dark mode, hero CSS, component styles, animations |
| `error.tsx` | Page-level error boundary | "Try again" + "Go home" buttons |
| `global-error.tsx` | Root error boundary | Catches errors inside layout itself |
| `not-found.tsx` | 404 page | Shows SearchBar + featured tools grid |
| `loading.tsx` | Root loading state | Skeleton placeholder |
| `manifest.ts` | PWA manifest | Icons (10 sizes), 4 shortcuts (PDF, Calculators, Developer, JSON Formatter) |
| `robots.ts` | robots.txt | Allows GPTBot, Claude-Web, PerplexityBot; blocks /api/, /admin/, /dashboard/, /auth/ |
| `sitemap.ts` | Primary sitemap | Static pages + categories + tools + blog posts |
| `sitemap-calculators.ts` | Calculators sitemap | |
| `sitemap-converters.ts` | Converters sitemap | |
| `sitemap-developer.ts` | Developer tools sitemap | |
| `sitemap-legal-tools.ts` | Legal tools sitemap | |
| `sitemap-network.ts` | Network tools sitemap | |
| `sitemap-pdf.ts` | PDF tools sitemap | ⚠️ Uses `toolverse.app` URLs |
| `sitemap-real-estate.ts` | Real estate sitemap | |
| `sitemap-text.ts` | Text tools sitemap | |
| `opengraph-image.tsx` | Root OG image | Dynamic via `next/og` |
| `llms.txt/route.ts` | AI-readable description | Plain text for LLM crawlers |

### Route Folders

| Route | Purpose | Issues |
|-------|---------|--------|
| `(auth)/signin/` | Sign-in page via NextAuth | |
| `(auth)/signup/` | Registration form | |
| `about/` | About page | ⚠️ Uses old brand "AI Tools Platform", imports deprecated `<Navbar>` |
| `admin/` | Admin area | Protected by cookie middleware (`admin_key`) |
| `api/` | Next.js API routes (see below) | |
| `api-docs/` | API documentation page | |
| `billing/` | Subscription management | |
| `blog/` | Blog list + individual posts | Content is static/hardcoded in `blog-posts.ts` (10 posts) |
| `contact/` | Contact form | ⚠️ `handleSubmit` calls `alert()` — no backend integration |
| `dashboard/` | User dashboard | ⚠️ API calls unimplemented — data never loads |
| `embed-generator/` | Tool embed code generator | |
| `link-to-us/` | Link exchange / backlinks | |
| `pricing/` | Pricing (Free/Pro/Team) | ⚠️ Pro/Team CTA `href` missing |
| `privacy-policy/` | Privacy policy | Static |
| `profile/` | User profile management | |
| `search/` | Global search results | |
| `security/` | Security disclosure | |
| `settings/` | User settings | |
| `terms-of-service/` | Terms of service | Static |
| `tools/` | All tools hub | |
| `tools/[category]/` | Catch-all for unknown categories | |
| `tools/business/` | Business AI tools (6) | |
| `tools/calculators/` | Calculator category | |
| `tools/calculators/[slug]/` | Dynamic catch-all for calculators | |
| `tools/converters/` | Unit converters (8) | |
| `tools/developer/` | Developer tools (19) | |
| `tools/document-tools/` | Document tools (9) | |
| `tools/engineering/` | Engineering calculators (126) | |
| `tools/environment/` | Eco tools (6) | |
| `tools/image-tools/` | Image processing tools (38) | |
| `tools/legal-tools/` | Legal document generators (8) | |
| `tools/medical/` | Medical/clinical calculators (113) | |
| `tools/network/` | Network utilities (7) | |
| `tools/pdf/` | PDF tools (26) | ⚠️ Uses `toolverse.app` in canonical |
| `tools/real-estate/` | Real estate calculators (8) | |
| `tools/security/` | Security tools (8) | |
| `tools/text/` | Text processing tools (10) | |

### API Routes (`apps/web/src/app/api/`)

| Route | Purpose | Issues |
|-------|---------|--------|
| `api/ai/route.ts` | Proxy to Claude Haiku API | Accepts `prompt` or `messages` |
| `api/auth/register/route.ts` | User registration (Prisma) | 🔴 CRITICAL: stores plaintext password |
| `api/auth/me/` | Current user session | |
| `api/auth/profile/` | Update user profile | |
| `api/billing/` | Subscription management | |
| `api/health/route.ts` | DB + Redis health check | Returns latency stats |
| `api/pdf/compress/` | PDF compression (pdf-lib) | |
| `api/pdf/merge/` | PDF merge | |
| `api/pdf/split/` | PDF split | |
| `api/pdf/convert-from-pdf/` | PDF→Word/Excel/PPT | |
| `api/pdf/convert-to-pdf/` | Word/Excel/PPT→PDF | |
| `api/pdf/watermark/` | Add watermark | |
| `api/pdf/protect/` | Password protect | |
| `api/pdf/unlock/` | Remove password | |
| `api/pdf/rotate/` | Rotate pages | |
| `api/pdf/ocr/` | OCR text extraction | |
| `api/pdf/crop/` | Crop pages | |
| `api/pdf/organize/` | Reorder pages | |
| `api/pdf/extract-pages/` | Extract specific pages | |
| `api/pdf/remove-pages/` | Delete pages | |
| `api/pdf/page-numbers/` | Add page numbers | |
| `api/pdf/sign/` | Add signature | |
| `api/pdf/compare/` | Compare two PDFs | |
| `api/pdf/redact/` | Redact content | |
| `api/pdf/repair/` | Repair damaged PDF | |
| `api/pdf/pdfa/` | Convert to PDF/A | |
| `api/users/` | User management | |
| `api/api-keys/` | API key management | |

---

## 4. COMPONENTS

### Top-Level Components (`apps/web/src/components/`)

| File | Purpose | Export |
|------|---------|--------|
| `SiteHeader.tsx` | Dark `#1a1a1a` sticky header (56px). Logo, CommandPalette trigger, All Tools btn, X/GitHub/theme icons, Menu btn. Green ticker bar below. Slide-in right drawer with category list. | `export default SiteHeader()` |
| `Navbar.tsx` | **LEGACY** — Old navbar with "Toolverse" brand. Still used by `about/` and `contact/`. Should be replaced with SiteHeader. | `export default Navbar()` |
| `Footer.tsx` | Full-width `#1a1a1a` footer. Green CTA banner, 4-column grid (categories/popular/company), mini stats boxes, social icons (Tabler). | `export default Footer()` |
| `CategoryGrid.tsx` | 15-category auto-fill grid. White cards, 48px colored Tabler icons, green hover border. dark:bg-[#1e1e1e]. | `export function CategoryGrid()` |
| `HomeSearchBar.tsx` | Hero search bar. Weighted fuzzy search. Live dropdown with keyboard nav. Green border on focus. | `export function HomeSearchBar()` |
| `SearchBar.tsx` | Reusable search bar. Used on 404 and other pages. Props: size (sm/md/lg), theme (light/dark). | `export function SearchBar()` |
| `CommandPalette.tsx` | Global Cmd+K / Ctrl+K / "/" command palette. Fuzzy search across all 415 tools. Recent searches (localStorage). Keyboard nav. Category badges. Character highlights. | `CommandPaletteProvider`, `CommandPaletteTrigger`, `usePalette` |
| `ThemeProvider.tsx` | Wraps next-themes `NextThemesProvider`. Attribute: `class`, storageKey: `rt-theme`, defaultTheme: `system`. | `export function ThemeProvider()` |
| `HomeDarkMode.tsx` | Scoped dark mode for homepage only (currently unused — reverted to global). | `export function HomeDarkMode()`, `useHomeDark()` |
| `CalcShell.tsx` | Shell layout for calculator pages. Hero, trust badges, How-To steps, formula, results guide, FAQ, related tools, PDF export. | `export default CalcShell`, `CalcShellProps` |
| `ImageToolShell.tsx` | Shell layout for image tools. How-to, use cases, specs table, FAQ, related tools, AdSense slots. | `export default ImageToolShell`, `ImageToolShellProps` |
| `ToolAdUnit.tsx` | AdSense ad slot with hard-reserved dimensions (prevents CLS). Lazy-loaded via IntersectionObserver. Positions: top/middle/bottom/sidebar. | `export default ToolAdUnit({ position, className })` |
| `JsonLd.tsx` | Renders JSON-LD `<script>` tags. Accepts single schema or array. | `export function JsonLd({ data })` |
| `Chatbot.tsx` | Floating chat widget. Pattern-matches messages to hardcoded KB. No AI backend used here. | `export default Chatbot()` |
| `ChatbotLoader.tsx` | Defers chatbot until page idle or first user interaction. | `export default ChatbotLoader()` |
| `CookieConsent.tsx` | GDPR consent banner. States: accepted/analytics-only/declined. Updates Google Consent Mode v2. | `export default CookieConsent()` |
| `CopyButton.tsx` | Copy-to-clipboard with icon morph (copy→checkmark), 2s reset, success toast. | `export function CopyButton({ value, label, showToast, size })` |
| `Breadcrumbs.tsx` | SEO breadcrumb nav. Accepts item array. | `export function Breadcrumbs({ items })` |
| `RelatedTools.tsx` | Grid of related tool cards for internal linking. | `export function RelatedTools({ tools })` |
| `RelatedToolCard.tsx` | Individual related tool card. | `export default RelatedToolCard` |
| `ToolCard.tsx` | Tool card with SVG icons (no emoji), dark mode, hover lift, active press, category badge. | `export function ToolCard()`, `export function ToolGrid()` |
| `ToolContent.tsx` | Content wrapper for tool pages. | `export default ToolContent` |
| `ToolPageSchema.tsx` | Renders tool page structured data. | `export default ToolPageSchema` |
| `CategoryCard.tsx` | Individual category card. | `export default CategoryCard` |
| `CategoryHubLayout.tsx` | Layout wrapper for category hub pages. | `export default CategoryHubLayout` |
| `CategoryNav.tsx` | Category navigation component. | `export default CategoryNav` |
| `Skeleton.tsx` | Shimmer skeleton placeholders. | `Skeleton`, `ToolCardSkeleton`, `ToolGridSkeleton`, `TextSkeleton`, `HeroSkeleton` |
| `StatsCounter.tsx` | Animated count-up stat cards. IntersectionObserver trigger. Respects prefers-reduced-motion. | `export function StatsCounter()` |
| `BentoGrid.tsx` | Bento-grid editorial layout (featured card + 2 cards + 4 cat cards + stats wide card). | `export function BentoGrid()` |
| `ScrollReveal.tsx` | Activates `.reveal` CSS animations when elements enter viewport. | `export function ScrollReveal()` |
| `LazySection.tsx` | Lazy-loads children via IntersectionObserver. | `export function LazySection()` |
| `OptimizedImage.tsx` | Next.js `<Image>` wrapper with defaults. | `export default OptimizedImage` |
| `MedicalDisclaimer.tsx` | HIPAA-style disclaimer for medical tools. | `export default MedicalDisclaimer` |
| `Toaster.tsx` | Toast notification container. Bottom-right, auto-dismiss 3s. Types: success/error/info. | `export function Toaster()` |
| `icons.tsx` | Inline SVG icon exports (Search, X, ArrowRight, ChevronRight, Home, FileText, Calculator, Code, Type, RefreshCw, Wifi, Image, Shield, Folder). Used to avoid Lucide import overhead. | Named exports |

### `analytics/` Subdirectory

| File | Purpose |
|------|---------|
| `GoogleAnalytics.tsx` | Injects GA4 script (`NEXT_PUBLIC_GA_MEASUREMENT_ID`). Client-only. |
| `AdSense.tsx` | AdSense script injection (consent-gated). Exports `AdSenseScript` and `AdUnit`. |
| `MicrosoftClarity.tsx` | Microsoft Clarity session recording. |
| `SearchConsoleVerification.tsx` | Google Search Console meta tag. |
| `WebVitals.tsx` | Reports Core Web Vitals to GA4 via `web-vitals` library. |

### `sections/` Subdirectory (Legacy)

| File | Purpose |
|------|---------|
| `Hero.tsx` + `Hero.module.css` | Legacy hero component (superseded by page.tsx inline hero) |
| `CalculatorsSection.tsx` | Legacy calculator section |
| `DocumentsSection.tsx` | Legacy document section |
| `FilterBar.tsx` | Tool filter/search bar |
| `StatsBar.tsx` | Statistics bar |
| `Ticker.tsx` | Scrolling ticker/marquee |
| `RoadmapSection.tsx` | Product roadmap section |

### `layout/` Subdirectory (Legacy — superseded)
`Header.tsx`, `Footer.tsx`, `Navbar.tsx`, `Sidebar.tsx` — old layout components, still imported by `about/` and `contact/`.

### `tools/` Subdirectory (Legacy standalone calculators)
`AgeCalculator.tsx`, `BMICalculator.tsx`, `CompoundInterestCalculator.tsx`, `DaysBetweenDates.tsx`, `MortgageCalculator.tsx`, `PercentageCalculator.tsx`, `RoiCalculator.tsx`, `TaxCalculator.tsx`, `TipCalculator.tsx`
These are pre-built widgets — unclear if they're used by the dynamic calculator routes or just legacy.

### `image-tools/` Subdirectory
- `BeforeAfterSlider.tsx` — Before/after image comparison slider
- `PlatformPresets.tsx` — Social media platform size presets
- `SmartRecommendation.tsx` — Smart tool recommendation widget

### `ui/` Subdirectory
- `CategoryPage.tsx` — Category page layout primitive
- `CustomCursor.tsx` — Custom cursor effect
- `ToolCard.tsx` — Duplicate tool card (separate from top-level ToolCard.tsx)
- `index.tsx` — Barrel exports

---

## 5. HOOKS

| File | Purpose | Exports |
|------|---------|---------|
| `useAuth.ts` | NextAuth session wrapper. Provides `isLoading`, `isAuthenticated`, `user`, `login(provider, callbackUrl)`, `logout()`, `hasRole(role)`. | `export function useAuth()` |
| `useCountUp.ts` | Count-up animation start→target. IntersectionObserver trigger. Respects `prefers-reduced-motion`. | `useCountUp({ target, duration, start, easing })` → `{ count, ref }` |
| `usePageTracking.tsx` | GA4 page view tracking on route change. | `export function usePageTracking()` |
| `useScrolled.ts` | Returns `{ scrolled, scrolledFar }` based on scroll position. Threshold: 80px / 300px. | `export function useScrolled(threshold?)` |
| `useTheme.ts` | **Custom hook** — localStorage-based dark/light. Sets `data-theme` + `class` on `<html>`. ⚠️ May conflict with `next-themes` ThemeProvider. | `export function useTheme()` → `{ theme, setTheme, toggleTheme }` |
| `useToast.ts` | Singleton toast store. | `export function useToasts()`, `export const toast` (`.success()`, `.error()`, `.info()`, `.dismiss()`) |

---

## 6. LIB

### `tools-registry.ts` — Single Source of Truth
- **Lines:** 1,575
- **Actual tool count:** ~415 slugs (registry comment says 194 — outdated)
- **`TOTAL_TOOLS`:** `ALL_TOOLS.length` → displayed in header badge and footer

**`ToolCategory` type:**
```typescript
type ToolCategory =
  | 'pdf' | 'calculators' | 'developer' | 'text' | 'converters'
  | 'network' | 'legal-tools' | 'real-estate' | 'image-tools' | 'security'
  | 'document-tools' | 'business' | 'environment' | 'engineering' | 'medical'
```

**`Tool` interface:**
```typescript
interface Tool {
  slug: string
  name: string
  category: ToolCategory
  description: string
  keywords: string[]
  featured?: boolean
  popular?: boolean
  isNew?: boolean
  priority?: number   // 0.0–1.0 for sitemap
}
```

**Exported helpers:**
- `getToolsByCategory(category)` — filter by category
- `getPopularTools(limit)` — popular:true tools
- `getFeaturedTools(limit)` — featured:true tools
- `getToolBySlug(slug)` — find by slug
- `getAllCategories()` — unique category list
- `TOTAL_TOOLS` — constant

**Tools by Category:**
| Category | Count |
|----------|-------|
| engineering | 126 |
| medical | 113 |
| image-tools | 38 |
| calculators | ~57 |
| developer | 19 |
| document-tools | 19 |
| pdf | 26 |
| text | 10 |
| security | 10 |
| converters | 8 |
| network | 7 |
| legal-tools | 8 |
| real-estate | 8 |
| business | 6 |
| environment | 6 |

### Other Lib Files

| File | Purpose | Key exports |
|------|---------|-------------|
| `analytics.ts` | GA4 helpers, Web Vitals, AdSense tracking, GDPR consent update | `trackEvent`, `trackPageView`, `trackToolEvent`, `reportWebVital`, `updateConsent` |
| `blog-posts.ts` | Static blog array (10 posts, HTML content inline, no CMS) | `BLOG_POSTS: BlogPost[]` |
| `calcPdf.ts` | PDF export for calculators (jsPDF) | `CalcPDFConfig`, generation functions |
| `canonical.ts` | Generates canonical URLs for tool pages | `getCanonicalUrl(tool)` |
| `og-utils.ts` | OG image utilities | OG helpers |
| `prisma.ts` | Singleton Prisma client (global var for hot-reload safety) | `export const prisma` |
| `relatedTools.ts` | Internal linking. Hand-curated `RELATED_MAP` (70+ entries) + same-category fallback | `getRelatedTools(slug, limit)`, `getCategoryTools(category)`, `getFeaturedTools(limit)`, `getHomepageSections()`, `FEATURED_TOOL_SLUGS`, `POPULAR_TOOL_SLUGS_BY_CATEGORY` |
| `seo-config.ts` | Central SEO constants | `SEO_CONFIG` ⚠️ siteName:"Toolverse", `CATEGORY_SEO` |
| `seo.ts` | Metadata generators using SEO_CONFIG | `generateHomeMetadata()`, `generateCategoryMetadata()`, `generateToolMetadata()`, `getCategoryLabel()` |
| `social-config.ts` | Social links (Twitter, GitHub, Instagram, LinkedIn) | `SOCIAL_LINKS`, `SITE_CONFIG` |
| `structured-data.ts` | JSON-LD schema generators | `getWebsiteSchema()`, `getOrganizationSchema()`, `getToolPageSchema()`, `getPricingSchema()` ⚠️ uses toolverse.app |
| `tool-metadata.ts` | Per-tool metadata, how-to steps, FAQs | `generateToolPageMetadata`, `getToolPageSchemas`, `DEFAULT_HOW_TO_STEPS`, `DEFAULT_FAQS` |
| `utils.ts` | General utilities | `cn()`, `formatNumber`, `slugify`, `capitalise`, `truncate`, `formatDate`, `formatCurrency`, `debounce`, `throttle`, `deepClone`, `isEmpty`, `classNames`, `sleep`, `generateId` |

---

## 7. TYPES

| File | Purpose |
|------|---------|
| `apps/web/src/types/css.d.ts` | TypeScript declaration for `*.module.css` files. Enables typed CSS module imports. |

Most types are co-located in their files or in `packages/types/`.

---

## 8. GLOBALS.CSS

### Section 1: Tailwind Directives
```css
@tailwind base; @tailwind components; @tailwind utilities;
```

### Section 2: Design Tokens (`:root` — light mode defaults)
| Token Group | Variables | Values |
|-------------|-----------|--------|
| Backgrounds | `--bg-0` → `--bg-3` | #ffffff → light greys |
| Borders | `--line`, `--line-strong`, `--line-bright` | rgba(0,0,0,0.07–0.18) |
| Text | `--fg` → `--fg-mute` | #0d111c → #c2c8db |
| Brand | `--brand`, `--brand-2`, `--brand-3` | #5b6cff, #7c5bf6, #4a7cff |
| Category accents | `--accent-pdf-a/b` through `--accent-env-a/b` | 15 category pairs |
| Radii | `--radius-sm` → `--radius-xl` | 8px → 28px |
| Shadows | `--shadow-soft`, `--shadow-card` | Layered box-shadows |
| Fonts | `--font-sans`, `--font-display`, `--font-serif`, `--font-mono` | Inter, Inter, Instrument Serif, JetBrains Mono |
| Aliases | `--bg-surface`, `--primary`, `--border-subtle`, `--text-primary` etc. | Maps to above |

### Section 3: Dark Mode Tokens (`html.dark`)
Overrides all background/foreground tokens. Dark bg range: `#0d111c` (deepest) to `#222840`. Same brand/accent colors (work in both modes). `color-scheme: dark` for browser scrollbars/inputs.

### Section 4: Base Reset
- `box-sizing: border-box` universal
- `scroll-behavior: smooth`, `-webkit-font-smoothing: antialiased`
- Styled scrollbar (10px, rounded, dark-aware)
- `a { color: inherit; text-decoration: none }`
- `button { font-family: inherit; cursor: pointer }`

### Section 5: Typography Scale
- Headings: `line-height: 1.2`, `letter-spacing: -0.02em`, `font-weight: 600`
- H2: 22px, H3: 18px, H4: 16px/500
- Body: `line-height: 1.7` (spec: this single change makes amateur sites look professional)
- `.text-body` (16px), `.text-secondary` (14px), `.text-hint` (12px)
- `.prose` (max-width 68ch)
- Monospace: `font-size: 0.875em`
- `p strong, p b { font-weight: 500 }` (prevents heavy 700 weight on body)

### Section 6: Layout Helpers
- `.wrap` → `max-width: 1280px; margin: 0 auto; padding: 0 28px`
- `.wrap-narrow` → `max-width: 880px`
- `.section` → `padding: 96px 0` (8px grid × 12)
- `.section-sm` → `padding: 64px 0`
- `.eyebrow` → uppercase label with left-dash pseudo-element
- `.h-display` → display font, tight tracking
- `.h-serif-italic` → Instrument Serif italic

### Section 7: Backgrounds
- `.bg-dotgrid` → dot pattern (radial-gradient 1px circles, 28px grid, opacity 0.05 light)
- `.noise-overlay` → SVG noise texture pseudo-element
- `.orb` + `.orb-a/b/c` → large blur gradient orbs with float animations

### Section 8: Buttons
- `.btn` → base (inline-flex, gap-2, rounded-xl, px-6 py-3, font-medium)
- `.btn-primary` → gradient brand fill
- `.btn-ghost` → transparent with border
- `.btn-link` → text-only
- `.pill` → pill-shaped tag

### Section 9: Site Header CSS (Legacy)
`.site-header`, `.site-header.scrolled`, `.header-row`, `.logo`, `.header-search` — CSS for the **old** SiteHeader design (before Tabler/dark redesign). Current SiteHeader uses inline styles + Tailwind, so these are effectively orphaned CSS.

### Section 10+: Additional CSS
- Tool page styles, stat cards, hero section, marquee
- Homepage CSS: `.hero-radial-glow`, `.hero-trust`, `.hero-chips`, `.hero-chip`, `.hero-headline-brand`
- Microinteraction CSS: `.skeleton-shimmer`, `@keyframes skeleton-shimmer`, `@keyframes icon-pop`, `@keyframes toast-in`
- Command palette: `@keyframes palette-backdrop`, `@keyframes palette-panel`
- Stat entrance: `@keyframes stat-entrance`
- Homepage green design: `.cat-card-hover`, `.pop-tool-hover`

---

## 9. TOOL PAGE PATTERNS

### Pattern A: PDF Tools (`/tools/pdf/[pdfTool]`)
```
URL: /tools/pdf/compress-pdf
Dynamic: [pdfTool] slug → PDF_TOOL_CONFIGS lookup
Pre-render: generateStaticParams() at build time
Structure:
  → sub-nav bar (26 PDF tool links)
  → ToolAdUnit (top, 728×90)
  → PDFToolClient (upload → /api/pdf/[action] → download)
  → ToolAdUnit (middle, 728×280)
  → FAQ accordion
  → Related PDF tools
  → SEO text block
  → ToolAdUnit (bottom, 728×90)
```
⚠️ `const SITE = 'https://toolverse.app'` — wrong canonical domain

### Pattern B: Calculators (`/tools/calculators/[slug]`)
```
URL: /tools/calculators/bmi-calculator
Dynamic: [slug] → CALC_TOOL_CONFIGS lookup
Dedicated pages: bmi, loan, mortgage, compound-interest, age, percentage, salary, etc.
Generic catch-all: GenericCalculatorClient driven by formulaType
Structure:
  → JSON-LD scripts
  → Breadcrumb nav
  → Gradient hero strip
  → GenericCalculatorClient (formula-specific widget)
  → "How to use" steps
  → Related calculators grid
  → Back link
```

### Pattern C: Medical & Engineering
```
URLs: /tools/medical/[slug], /tools/engineering/[slug]
Each category has 100+ tools via dynamic [slug] route
Configs: MEDICAL_CONFIGS[], ENGINEERING_CONFIGS[]
Discipline grouping for breadcrumbs (medical: cardiology/nephrology/etc.)
Structure:
  → JSON-LD
  → Breadcrumb (Home → Category → Discipline → Tool)
  → Gradient hero
  → Tool widget (MedicalCalculatorClient / EngineeringCalculatorClient)
  → Lazy-loaded FAQ
  → Related tools by discipline
  → Medical disclaimer (medical only)
```

### Pattern D: Image Tools
```
Each image tool has its own directory (not a catch-all)
Uses ImageToolShell wrapper
Shell provides: breadcrumb, hero, trust badges, AdSense, how-to, use cases, specs table, FAQ, related tools
```

### Pattern E: Developer/Text/Network/Security/Converters
```
Each tool has its own dedicated directory
Mix of:
  - Standalone client implementations (no shell wrapper)
  - Pages using CalcShell or ImageToolShell patterns
Most run 100% client-side (no API calls)
```

### Pattern F: Legal/Document Tools (AI-powered)
```
Calls /api/ai → Anthropic Claude Haiku
Each tool: form input → prompt construction → Claude response → rendered output
```

### Pattern G: Generic `[category]` catch-all
```
Falls through for unrecognised category slugs
Uses ALL_TOOLS filtered by category
Renders ToolGrid + related tools + JSON-LD
```

---

## 10. PACKAGES

| Package | Purpose | Status |
|---------|---------|--------|
| `calculators-core` | Pure TS calculator functions (mortgage, loan, BMI, etc.) | Has dist/ — compiled. ⚠️ Unclear if web app actually imports from here |
| `ui` | Shared React component library (`@workspace/ui`) | Has dist/, in web app deps + tailwind content scan |
| `seo` | SEO utilities (JSON-LD, meta, sitemap, robots, slug, OG) | Has dist/. ⚠️ Web app has duplicated most of this in lib/ |
| `db` | Prisma client wrapper | ⚠️ Web app also has own `lib/prisma.ts` — dual instantiation risk |
| `types` | Shared TypeScript types | |
| `config` | Shared ESLint + TS base configs | |
| `validation` / `validators` | Input validation schemas | Both have dist/ |
| `utils` | Utility functions | ⚠️ Likely duplicates `apps/web/src/lib/utils.ts` |
| `cache` | Caching utilities | |
| `redis` | Redis client wrapper | |
| `queue` | Bull/queue utilities | |
| `storage` | File storage utilities | |
| `errors` | Error types/classes | |
| `legal` | Legal content helpers | |
| `core-logic` | Minimal/placeholder | |

---

## 11. INFRASTRUCTURE

### `apps/web/Dockerfile`
4-stage build: base (node:20-alpine + pnpm 8.15) → deps → builder → runner
- Standalone output mode (copies `apps/web/.next/standalone`)
- Non-root `nextjs` user in runner
- Port 3000, CMD: `node apps/web/server.js`
- ⚠️ Only copies packages: ui, utils, config, types — other packages missing (db, seo, etc.) — Docker build may fail if those are imported

### `docker-compose.yml` (Development)
Services: `web` (Next.js:3000), `db` (postgres:16-alpine:5432), `redis` (redis:7-alpine:6379), `adminer` (db GUI:8080). Health checks on db + redis.

### `docker-compose.production.yml`
Adds: Nginx service, Gotenberg (PDF service), Sentry DSN, Stripe env vars.

### `nginx/nginx.conf`
- HTTP → HTTPS redirect
- TLS 1.2/1.3 (ECDHE ciphers)
- Security headers (X-Frame-Options SAMEORIGIN — ⚠️ conflicts with Next.js DENY)
- Gzip compression
- Static caching: `/_next/static/` → 365 days; `/_next/image` → 7 days
- Proxy to `nextjs_upstream` (least_conn load balancing)
- ⚠️ `server_name example.com www.example.com` — placeholder not updated

### `railway.toml`
- Gotenberg sidecar service for Railway
- `/health` healthcheck, restart on failure (max 3)

### `Makefile`
50+ targets: dev/build/start, docker (dev/staging/prod), database (migrate/seed/reset), testing, deployment, monitoring, utilities.

### `apps/api/` (Express backend — largely unused by web)
- Express + helmet + compression + cors + Sentry + rate limiting + CSRF
- Routes: calculators, converters, text, developer, network, pdf, billing, auth, newsletter, contact, gdpr, public-api, affiliate, tool-requests, referral, tool-analytics, vitals, temp-email, url-shortener, blog, openapi-spec, api-keys
- ⚠️ Web app uses its own Next.js API routes — Express API is a parallel implementation that would require separate deployment

---

## 12. WORKING VS BROKEN

### ✅ WORKING

| Feature | Notes |
|---------|-------|
| Homepage | Clean, functional. Tool count, categories, search, popular tools. |
| PDF Tools (26) | Full pipeline: upload → pdf-lib API → download. All 26 tools have route handlers. |
| Engineering Calculators (126) | Dynamic [slug] route with discipline grouping. Working client widgets. |
| Medical Calculators (113) | Same pattern. Specialty grouping. Medical disclaimer included. |
| Calculator catch-all | GenericCalculatorClient handles any CALC_TOOL_CONFIGS entry. |
| SEO infrastructure | Per-page metadata, JSON-LD schemas (WebApp/FAQ/Breadcrumb/Organization), multiple sitemaps, robots.txt, canonical URLs, OG images, llms.txt. |
| Google Consent Mode v2 | Default-denied in layout.tsx, updated by CookieConsent.tsx. |
| AdSense | Consent-gated, lazy-loaded, CLS-prevented. |
| Command Palette | Cmd+K / Ctrl+K / "/" — fuzzy search, recent history, keyboard nav. |
| Dark/light mode | next-themes, persisted to localStorage, system detection. Applies globally. |
| PWA manifest | Icons, shortcuts, correct metadata. |
| Auth | NextAuth signin/signup. Session management working. |
| Health check | `/api/health` tests DB + Redis with latency. |
| Chatbot | Knowledge-base chatbot. Idle-deferred loading. |
| Toast system | success/error/info toasts, 3s auto-dismiss, bottom-right. |
| Skeleton loaders | ToolCardSkeleton, ToolGridSkeleton, TextSkeleton, HeroSkeleton. |
| Copy button | Icon morph copy→checkmark, 2s reset. |
| Category grid | All 15 categories with correct Tabler icons. |
| Footer | Full-width dark footer with green CTA, 4 columns, social icons. |

### 🔴 CRITICAL BUGS

| # | Issue | File | Fix |
|---|-------|------|-----|
| 1 | **Plaintext password storage** | `api/auth/register/route.ts:13` `passwordHash: password` | Use bcrypt/argon2 to hash before storing |
| 2 | **Wrong canonical domain** | `app/tools/pdf/[pdfTool]/page.tsx` `const SITE = 'https://toolverse.app'` | Change to `https://roughtools.com` |
| 3 | **SEO brand mismatch** | `lib/seo-config.ts` `siteName: 'Toolverse'`, `siteUrl` | Update to RoughTools/roughtools.com throughout |

### ⚠️ IMPORTANT ISSUES

| # | Issue | File | Fix |
|---|-------|------|-----|
| 4 | Brand "Toolverse" in structured data | `lib/structured-data.ts` | Update org name, email, URL |
| 5 | Nginx placeholder domain | `nginx/nginx.conf` `server_name example.com` | Update to `roughtools.com` |
| 6 | Nginx/Next.js X-Frame-Options conflict | nginx sets SAMEORIGIN, Next.js sets DENY | Align to one value |
| 7 | About page uses old brand + old Navbar | `app/about/page.tsx` | Replace with current brand + SiteHeader |
| 8 | Contact form is a stub | `app/contact/page.tsx` | Implement actual form submission |
| 9 | Pricing CTAs missing | `app/pricing/page.tsx` | Add `href` to Pro/Team plan buttons |
| 10 | Dashboard data never loads | `app/dashboard/page.tsx` | Add useEffect data fetching |
| 11 | Tailwind font mismatch | `tailwind.config.ts` | Align font vars to Inter/Instrument Serif/JetBrains Mono |
| 12 | useTheme.ts conflicts with next-themes | `hooks/useTheme.ts` | Remove custom hook, use `useTheme` from next-themes |
| 13 | Tool count discrepancy | Registry comment says 194, actual ~415, sitemap says 250+ | Update registry comment to actual count |
| 14 | Docker missing packages | `apps/web/Dockerfile` COPY steps | Add missing packages (db, seo, etc.) |
| 15 | Sitemap wrong PDF URL mapping | `sitemap.ts` CATEGORY_URL_MAP | Fix pdf → /tools/pdf/ not /tools/document-tools/ |
| 16 | Blog is static/hardcoded | `lib/blog-posts.ts` | Integrate a CMS or markdown pipeline |
| 17 | `next.config.js` inside `src/app/` | Stray file in wrong location | Delete it |
| 18 | images.remotePatterns placeholder | `next.config.ts` | Add actual image domains |
| 19 | Duplicate Prisma client | `lib/prisma.ts` + `packages/db` | Use one source |
| 20 | Express API unused | `apps/api/` | Consolidate into Next.js API routes or deploy separately |
| 21 | Legacy components still imported | `layout/` subdirectory | Remove and update pages using them |
| 22 | social-config.ts may have placeholder URLs | `lib/social-config.ts` | Verify actual social account URLs |
| 23 | api/ai using old claude model name | `api/ai/route.ts` | Check model string matches current API |

---

## 13. PRIORITY FIX PLAN

### Phase 1 — Security & Brand (Do First)
1. 🔴 Hash passwords in register route (`bcryptjs` or `argon2`)
2. 🔴 Fix `seo-config.ts`: `siteName → "RoughTools"`, `siteUrl → "https://roughtools.com"`
3. 🔴 Fix `structured-data.ts`: org name, support email, URLs
4. 🔴 Fix PDF tool page: `SITE → "https://roughtools.com"`
5. Update `nginx/nginx.conf`: `server_name roughtools.com www.roughtools.com`

### Phase 2 — UI Completeness
6. Fix `about/page.tsx`: update brand, replace `<Navbar>` with SiteHeader
7. Fix `contact/page.tsx`: implement real form submission
8. Fix `pricing/page.tsx`: add CTAs for Pro/Team plans
9. Fix `dashboard/page.tsx`: add data fetching
10. Fix `tailwind.config.ts`: align font vars to actual loaded fonts

### Phase 3 — SEO & Sitemaps
11. Fix sitemap PDF URL mapping (`pdf → /tools/pdf/`)
12. Audit all sitemap files for toolverse.app URLs
13. Fix `images.remotePatterns` with actual domains

### Phase 4 — Code Quality
14. Remove `hooks/useTheme.ts` (conflicts with next-themes)
15. Delete `next.config.js` from `src/app/`
16. Remove legacy components in `layout/`, `sections/`
17. Update tools-registry.ts comment to reflect actual count

### Phase 5 — Infrastructure
18. Fix Dockerfile COPY to include all packages
19. Resolve Nginx vs Next.js X-Frame-Options conflict
20. Evaluate Express API (`apps/api/`) — deploy or remove

---

*Generated: 2026-05-30 | Audited by Claude*
