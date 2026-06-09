# ROUGHTOOLS.COM — COMPLETE PROJECT OVERVIEW
# Total: 405 Tools · 15 Categories · Next.js 14 App Router
# Last updated: 2026-05-24

================================================================================
## 1. TECH STACK
================================================================================

Framework:       Next.js 14 (App Router)
Language:        TypeScript
Styling:         Tailwind CSS (JIT)
Monorepo:        pnpm workspaces
Package path:    apps/web
Node version:    18+
Build output:    Static (SSG) — 707 pages

================================================================================
## 2. PROJECT FOLDER STRUCTURE
================================================================================

apps/web/src/
│
├── app/
│   ├── layout.tsx                          Root layout — Inter font, SiteHeader, Footer, Chatbot, CookieConsent
│   ├── page.tsx                            HOME PAGE
│   ├── globals.css                         Design system, animations, utilities
│   ├── loading.tsx                         Homepage skeleton loader
│   ├── not-found.tsx                       404 page
│   ├── error.tsx                           Error boundary
│   ├── global-error.tsx                    Global error boundary
│   ├── manifest.ts                         Web app manifest
│   ├── robots.ts                           robots.txt generator
│   ├── sitemap.ts                          Main sitemap
│   ├── sitemap-calculators.ts
│   ├── sitemap-converters.ts
│   ├── sitemap-developer.ts
│   ├── sitemap-legal-tools.ts
│   ├── sitemap-network.ts
│   ├── sitemap-pdf.ts
│   ├── sitemap-real-estate.ts
│   ├── sitemap-text.ts
│   ├── opengraph-image.tsx                 OG image generator
│   │
│   ├── (auth)/
│   │   ├── signin/page.tsx
│   │   └── signup/page.tsx
│   │
│   ├── about/page.tsx
│   ├── blog/
│   │   ├── page.tsx
│   │   ├── BlogPostCards.tsx
│   │   └── [slug]/page.tsx
│   ├── contact/page.tsx
│   ├── pricing/page.tsx
│   ├── privacy-policy/page.tsx
│   ├── terms-of-service/page.tsx
│   ├── search/page.tsx
│   ├── settings/page.tsx
│   ├── profile/page.tsx
│   ├── api-docs/page.tsx
│   ├── link-to-us/page.tsx
│   ├── embed-generator/page.tsx
│   │
│   ├── dashboard/
│   │   ├── page.tsx
│   │   ├── api-keys/page.tsx
│   │   └── referral/page.tsx
│   │
│   ├── admin/
│   │   └── analytics/page.tsx
│   │
│   ├── billing/
│   │   └── success/page.tsx
│   │
│   ├── api/
│   │   ├── ai/route.ts
│   │   ├── api-keys/route.ts + [id]/route.ts
│   │   ├── auth/me/route.ts + profile/route.ts + register/route.ts
│   │   ├── billing/checkout/route.ts
│   │   ├── health/route.ts
│   │   └── users/route.ts + [id]/route.ts
│   │
│   └── tools/
│       ├── page.tsx                        /tools — Browse all tools page
│       ├── opengraph-image.tsx
│       ├── [category]/
│       │   ├── page.tsx                    Generic category hub fallback
│       │   ├── loading.tsx                 Category loading skeleton
│       │   └── [tool]/
│       │       ├── page.tsx                Generic tool page fallback
│       │       ├── loading.tsx             Tool loading skeleton
│       │       └── opengraph-image.tsx
│       │
│       ├── pdf/                            26 tools
│       ├── calculators/                    21 tools
│       ├── medical/                        113 tools
│       ├── engineering/                    126 tools
│       ├── image-tools/                    38 tools
│       ├── developer/                      19 tools
│       ├── document-tools/                 9 tools
│       ├── text/                           10 tools
│       ├── converters/                     8 tools
│       ├── security/                       8 tools
│       ├── legal-tools/                    8 tools
│       ├── real-estate/                    8 tools
│       ├── network/                        7 tools
│       ├── business/                       6 tools
│       └── environment/                    6 tools
│
├── components/
│   ├── SiteHeader.tsx                      Sticky header + hamburger slide-in drawer (15 categories)
│   ├── Footer.tsx                          Site footer (categories, popular tools, company, trust)
│   ├── CategoryGrid.tsx                    Home page bento grid (4 featured + 11 compact cards)
│   ├── CategoryHubLayout.tsx               Shared server layout for all category hub pages
│   ├── CategoryCard.tsx                    Individual category card component
│   ├── CategoryNav.tsx                     Category navigation component
│   ├── SearchBar.tsx                       Global search bar
│   ├── ToolCard.tsx                        Tool listing card
│   ├── RelatedTools.tsx                    Related tools sidebar widget
│   ├── Breadcrumbs.tsx                     Breadcrumb navigation
│   ├── Chatbot.tsx                         AI chatbot (lazy loaded, client-only)
│   ├── CookieConsent.tsx                   Cookie banner (lazy loaded, client-only)
│   ├── JsonLd.tsx                          JSON-LD structured data injector
│   ├── LazySection.tsx                     Intersection-observer lazy loader
│   ├── Navbar.tsx
│   ├── OptimizedImage.tsx
│   ├── ToolAdUnit.tsx                      AdSense ad slot
│   ├── ThemeProvider.tsx
│   ├── icons.tsx
│   │
│   ├── analytics/
│   │   ├── AdSense.tsx
│   │   ├── GoogleAnalytics.tsx
│   │   ├── MicrosoftClarity.tsx
│   │   ├── SearchConsoleVerification.tsx
│   │   └── WebVitals.tsx
│   │
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx + Footer.module.css
│   │   ├── Sidebar.tsx + Sidebar.module.css
│   │   └── Navbar.module.css
│   │
│   ├── sections/
│   │   ├── Hero.tsx + Hero.module.css
│   │   ├── StatsBar.tsx + StatsBar.module.css
│   │   ├── Ticker.tsx + Ticker.module.css
│   │   ├── CalculatorsSection.tsx + CalculatorsSection.module.css
│   │   ├── DocumentsSection.tsx
│   │   ├── FilterBar.tsx + FilterBar.module.css
│   │   └── RoadmapSection.tsx
│   │
│   ├── tools/
│   │   ├── AgeCalculator.tsx
│   │   ├── BMICalculator.tsx
│   │   ├── CompoundInterestCalculator.tsx
│   │   ├── DaysBetweenDates.tsx
│   │   ├── MortgageCalculator.tsx
│   │   ├── PercentageCalculator.tsx
│   │   ├── RoiCalculator.tsx
│   │   ├── TaxCalculator.tsx
│   │   └── TipCalculator.tsx
│   │
│   └── ui/
│       ├── CategoryPage.tsx
│       ├── CustomCursor.tsx
│       └── ToolCard.tsx
│
├── lib/
│   ├── tools-registry.ts                   SOURCE OF TRUTH — all 405 tool definitions
│   ├── seo.ts                              generateMetadata helpers
│   ├── seo-config.ts                       Per-category SEO config (title, desc, keywords)
│   ├── structured-data.ts                  JSON-LD schema generators
│   ├── og-utils.ts                         OG image gradients and labels
│   ├── relatedTools.ts                     Related tools logic per category
│   ├── social-config.ts                    Social media URLs
│   ├── canonical.ts                        Canonical URL helpers
│   ├── tool-metadata.ts                    Per-tool metadata helpers
│   ├── blog-posts.ts                       Blog post data
│   ├── analytics.ts                        Analytics helpers
│   ├── prisma.ts                           Prisma DB client
│   └── utils.ts                            General utilities
│
├── hooks/
│   ├── useAuth.ts
│   ├── usePageTracking.tsx
│   └── useTheme.ts
│
├── types/
│   └── css.d.ts
│
├── middleware.ts                           Next.js middleware
└── instrumentation.ts

================================================================================
## 3. KEY DESIGN FILES
================================================================================

globals.css contains:
  - CSS Variables (brand colors, spacing, radius, shadows)
  - Dark mode tokens
  - Base styles (typography, scrollbar, selection, focus)
  - Component classes (btn, card, form-input, badge, skeleton, alert)
  - Utility classes (glass, glass-sm, glass-strong, noise-overlay)
  - Animations:
      orb-float-a/b/c     — floating glow orbs in hero
      marquee-left         — scrolling ticker
      shimmer-sweep        — card light sweep
      gradient-shift       — animated gradient text
      hero-fade-up         — staggered hero entry
      live-ping            — pulsing live dot
      beam-slide           — hover beam on cards
      pulse-glow           — box shadow pulse
      float-y              — vertical float
      spin-slow            — slow rotation
      skeleton-shimmer     — loading skeleton
  - CSS classes:
      .shimmer-card        — shimmer sweep on hover
      .beam-card           — beam light on hover
      .card-premium        — spring-physics hover lift + per-card glow
      .glass / .glass-sm / .glass-strong
      .noise-overlay       — SVG grain texture
      .hero-item-1..5      — staggered fade-up entry
      .anim-orb-a/b/c
      .anim-marquee
      .anim-gradient-text
      .live-dot            — pulsing indicator
      .cat-glow-*          — per-category --card-glow CSS var

SiteHeader.tsx (client component):
  - Sticky, transparent → glass on scroll
  - Top accent glow line appears on scroll
  - Logo with layered gradient glow
  - Search input (inline form)
  - "All Tools" browse pill (desktop)
  - Social icons (desktop XL)
  - Hamburger "Menu/Close" labeled button
  - Slide-in drawer (right side, 80/96 wide):
      - Search inside drawer
      - 15 categories with colored left accent bar
      - Accordion expand/collapse per category
      - Sub-links with border-l connector
      - Social icons row at bottom

CategoryGrid.tsx (server component):
  - 4 FEATURED cards (PDF, Calculators, Medical, Engineering):
      - Tall card, gradient icon, sample tool list (5 items)
      - Gradient wash on hover, colored border glow
      - Beam card light sweep
      - Spring-physics lift on hover
  - 11 COMPACT cards (remaining categories):
      - Icon + name + count badge
      - Hover reveal "Browse →"
  - "All 405 tools →" dashed CTA slot

Footer.tsx (server component):
  - Double-layer top glow line
  - CTA strip with mini RT logo chip
  - Brand column: logo, description, social icons, mini stats (boxed)
  - All Categories column: emoji + name + colored count
  - Popular Tools column: icon + name
  - Company column: links + trust badges (title + subtitle)
  - Bottom bar: copyright + privacy/terms/sitemap links

================================================================================
## 4. HOME PAGE SECTIONS (/app/page.tsx)
================================================================================

Section 1 — HERO
  Background:   bg-[#04070e] + dot grid (radial-gradient) + noise-overlay
  Orbs:         3 animated floating blobs (indigo/violet/blue)
  Content:
    - Live badge (green pulse dot + "405+ free tools · No account · No watermark")
    - H1: "The Ultimate / Free Toolbox" (gradient animated text)
    - Subtext paragraph
    - SearchBar (with indigo glow ring behind it)
    - 4 stat cards: 405+ Tools | 0 Signup | 100% Browser | ∞ Uses
  Animation:    hero-item-1..5 staggered fade-up

Section 2 — MARQUEE TICKER
  Background:   bg-[#070a14] with border-y
  Content:      15 category icons + labels scrolling infinitely
  Separator:    ◆ diamond between items

Section 3 — CATEGORIES
  Background:   bg-[#04070e]
  Heading:      "Browse All 15 Categories"
  Content:      <CategoryGrid /> bento layout

Section 4 — WHY ROUGHTOOLS (Features)
  Background:   bg-[#070a14]
  Cards:
    ⚡ Instant Results     (amber accent bar, "No waiting" pill)
    🔒 Privacy First       (emerald accent bar, "Zero tracking" pill)
    ♾️  Always Free         (indigo accent bar, "No limits ever" pill)

Section 5 — POPULAR TOOLS
  Background:   bg-[#04070e]
  Content:      12 pill links with icons
  CTA:          "View all 405+ tools" indigo button

Section 6 — TRUST STRIP
  Background:   bg-[#070a14]
  Items:        🔒 SSL · 🗑️ Auto-deleted · 🚫 No watermarks · 🆓 100% Free · 🌍 Any browser

================================================================================
## 5. ALL 405 TOOLS BY CATEGORY
================================================================================

────────────────────────────────────────────────────────────────────────────────
📄 PDF TOOLS — 26 tools — /tools/pdf/
────────────────────────────────────────────────────────────────────────────────
  1.  compress-pdf
  2.  merge-pdf
  3.  split-pdf
  4.  pdf-to-word
  5.  pdf-to-excel
  6.  pdf-to-powerpoint
  7.  pdf-to-jpg
  8.  pdf-to-html
  9.  word-to-pdf
  10. excel-to-pdf
  11. jpg-to-pdf
  12. protect-pdf
  13. unlock-pdf
  14. rotate-pdf
  15. crop-pdf
  16. add-watermark
  17. ocr-pdf
  18. repair-pdf
  19. redact-pdf
  20. add-page-numbers
  21. organize-pdf
  22. extract-pdf-pages
  23. remove-pdf-pages
  24. compare-pdf
  25. pdf-to-pdfa
  26. sign-pdf

────────────────────────────────────────────────────────────────────────────────
🧮 CALCULATORS — 21 tools — /tools/calculators/
────────────────────────────────────────────────────────────────────────────────
  1.  bmi-calculator
  2.  loan-calculator
  3.  mortgage-calculator
  4.  compound-interest-calculator
  5.  age-calculator
  6.  percentage-calculator
  7.  date-difference-calculator
  8.  tip-calculator
  9.  tax-calculator
  10. currency-converter
  11. gpa-calculator
  12. calorie-calculator
  13. scientific-calculator
  14. discount-calculator
  15. roi-calculator
  16. inflation-calculator
  17. retirement-calculator
  18. salary-calculator
  19. body-fat-calculator
  20. ovulation-calculator
  21. due-date-calculator

────────────────────────────────────────────────────────────────────────────────
🩺 MEDICAL & HEALTH — 113 tools — /tools/medical/
────────────────────────────────────────────────────────────────────────────────

  [CARDIOLOGY — 12 tools]
  1.  cha2ds2-vasc-score
  2.  heart-score-calculator
  3.  framingham-risk-score
  4.  mean-arterial-pressure-calculator
  5.  cardiac-output-fick-calculator
  6.  timi-risk-score
  7.  qtc-interval-calculator
  8.  ldl-cholesterol-calculator
  9.  warfarin-dose-estimator
  10. has-bled-bleeding-score
  11. blood-pressure-classification
  12. grace-acs-score

  [NEPHROLOGY — 10 tools]
  13. creatinine-clearance-cockcroft-gault
  14. egfr-ckd-epi-calculator
  15. mdrd-egfr-calculator
  16. urine-anion-gap-calculator
  17. fena-feurea-calculator
  18. dialysis-adequacy-ktv
  19. calcium-correction-calculator
  20. renal-drug-dose-adjuster
  21. water-deficit-hypernatremia
  22. kidney-failure-risk-equation

  [CRITICAL CARE / EMERGENCY — 11 tools]
  23. curb-65-pneumonia-score
  24. glasgow-coma-scale
  25. sofa-sepsis-score
  26. abg-interpreter
  27. apache-ii-score
  28. anion-gap-calculator
  29. wells-score-dvt-pe
  30. iv-fluid-rate-calculator
  31. qsofa-sepsis-score
  32. burn-surface-area-rule-of-9s
  33. pecarn-head-injury-tool

  [PSYCHIATRY / NEUROLOGY — 9 tools]
  34. phq9-depression-screen
  35. gad7-anxiety-score
  36. nihss-stroke-scale
  37. epworth-sleepiness-scale
  38. mmse-cognitive-screen
  39. lithium-dose-calculator
  40. audit-c-alcohol-screening
  41. ciwa-ar-withdrawal-scale
  42. ptsd-pcl5-checklist

  [ENDOCRINOLOGY / METABOLISM — 8 tools]
  43. visual-acuity-converter
  44. hba1c-glucose-converter
  45. bmi-calculator
  46. insulin-dose-calculator
  47. bmr-tdee-calculator
  48. findrisc-diabetes-risk
  49. steroid-dose-converter
  50. thyroid-function-interpreter

  [PHARMACOLOGY / DRUG DOSING — 12 tools]
  51. ideal-body-weight-calculator
  52. body-fat-percentage-calculator
  53. carb-glycemic-calculator
  54. drug-interaction-checker
  55. weight-based-drug-dose-calculator
  56. drug-half-life-calculator
  57. opioid-equianalgesic-converter
  58. vancomycin-dosing-calculator
  59. aminoglycoside-dose-calculator
  60. iv-drip-rate-mcg-kg-min
  61. pediatric-emergency-drug-calculator
  62. pill-identifier-tool
  63. medication-cost-estimator

  [OBSTETRICS / GYNECOLOGY — 10 tools]
  64. due-date-edd-calculator
  65. gestational-age-calculator
  66. fetal-weight-estimator
  67. pregnancy-weight-gain-calculator
  68. ivf-success-rate-calculator
  69. ovulation-fertile-window-calculator
  70. bishop-score-calculator
  71. preeclampsia-risk-calculator
  72. postpartum-hemorrhage-calculator
  73. apgar-score-calculator

  [PULMONOLOGY — 6 tools]
  74. spirometry-fev1-fvc-interpreter
  75. psi-port-pneumonia-score
  76. alveolar-arterial-gradient
  77. pao2-fio2-ratio-ards
  78. peak-flow-calculator
  79. pack-year-calculator

  [GASTROENTEROLOGY / HEPATOLOGY — 6 tools]
  80. meld-score-calculator
  81. child-pugh-score-calculator
  82. saag-calculator
  83. ransons-criteria-pancreatitis
  84. h-pylori-eradication-tracker
  85. bowel-prep-dosing-calculator

  [ONCOLOGY — 8 tools]
  86. chemotherapy-dose-bsa-calculator
  87. anc-absolute-neutrophil-count
  88. psa-velocity-doubling-time
  89. tnm-staging-interpreter
  90. inr-pt-ratio-converter
  91. ipss-mds-score
  92. blood-transfusion-volume-calculator
  93. cancer-survival-probability

  [PEDIATRICS — 8 tools]
  94. child-growth-percentile
  95. pediatric-bmi-for-age
  96. fever-dose-calculator
  97. holliday-segar-maintenance-fluid
  98. vaccine-schedule-checker
  99. corrected-gestational-age-calculator
  100. pediatric-ett-size-depth
  101. neonatal-jaundice-bhutani

  [GENERAL HEALTH & WELLNESS — 12 tools]
  102. bmi-health-calculator
  103. calorie-deficit-calculator
  104. heart-rate-zone-calculator
  105. daily-water-intake-calculator
  106. sleep-cycle-calculator
  107. health-insurance-premium-estimator
  108. blood-pressure-tracker-chart
  109. cholesterol-ratio-calculator
  110. surgery-cost-estimator
  111. drug-rehab-cost-calculator
  112. therapy-session-cost-estimator
  113. medication-cost-comparator

────────────────────────────────────────────────────────────────────────────────
⚙️ ENGINEERING — 126 tools — /tools/engineering/
────────────────────────────────────────────────────────────────────────────────

  [CIVIL & STRUCTURAL — 18 tools]
  1.  beam-deflection-calculator
  2.  concrete-mix-design
  3.  column-load-capacity
  4.  retaining-wall-stability
  5.  foundation-bearing-capacity
  6.  steel-section-properties
  7.  slope-stability-fos
  8.  rebar-quantity-estimator
  9.  concrete-volume-calculator
  10. wind-load-calculator
  11. soil-bearing-pressure
  12. truss-member-force
  13. moment-of-inertia-calculator
  14. asphalt-pavement-thickness
  15. earthwork-cut-fill
  16. pile-load-capacity
  17. slab-reinforcement-designer
  18. construction-cost-estimator

  [ELECTRICAL — 18 tools]
  19. ohms-law-calculator
  20. wire-cable-size
  21. voltage-drop-calculator
  22. three-phase-power-calculator
  23. transformer-sizing
  24. motor-starting-current
  25. solar-panel-battery-sizing
  26. led-energy-savings
  27. circuit-breaker-sizing
  28. capacitor-bank-sizing
  29. ups-battery-backup
  30. power-factor-correction
  31. short-circuit-current
  32. conduit-fill-calculator
  33. load-schedule-panel
  34. pv-system-roi
  35. battery-state-of-charge
  36. earthing-grounding-resistance

  [MECHANICAL — 18 tools]
  37. bolt-torque-calculator
  38. gear-ratio-calculator
  39. hp-kw-converter
  40. pressure-vessel-thickness
  41. fluid-flow-rate
  42. heat-transfer-calculator
  43. pump-head-flow
  44. spring-constant-calculator
  45. belt-pulley-speed
  46. cnc-feeds-speeds
  47. tolerance-stack-up
  48. fatigue-life-estimator
  49. thermal-expansion-calculator
  50. bearing-life-calculator
  51. stress-strain-calculator
  52. reynolds-number-calculator
  53. vibration-frequency
  54. hydraulic-cylinder-force

  [HVAC — 10 tools]
  55. cooling-load-calculator
  56. heating-load-estimator
  57. duct-sizing-calculator
  58. psychrometric-calculator
  59. cop-eer-calculator
  60. u-value-r-value
  61. ventilation-rate-calculator
  62. chilled-water-pipe-sizing
  63. boiler-efficiency-calculator
  64. building-energy-audit

  [CHEMICAL / PROCESS — 10 tools]
  65. pipe-pressure-drop
  66. orifice-plate-flow
  67. heat-exchanger-sizing
  68. gas-compressor-power
  69. pump-npsh-calculator
  70. flare-stack-sizing
  71. distillation-column-estimator
  72. gas-molecular-weight
  73. steam-table-lookup
  74. relief-valve-sizing

  [GEOTECHNICAL — 8 tools]
  75. soil-bearing-capacity
  76. settlement-calculator
  77. slope-stability-bishop
  78. lateral-earth-pressure
  79. liquefaction-potential
  80. pile-driving-formula
  81. permeability-seepage
  82. spt-n-value-parameters

  [WATER RESOURCES / ENVIRONMENTAL — 8 tools]
  83. stormwater-runoff
  84. water-demand-estimator
  85. water-tank-sizing
  86. wastewater-flow-estimator
  87. solar-irradiance-pv-yield
  88. engineering-carbon-footprint
  89. flood-frequency-analysis
  90. water-quality-index

  [ELECTRONICS / PCB — 10 tools]
  91. resistor-color-code
  92. rc-filter-designer
  93. antenna-length-calculator
  94. pcb-trace-width
  95. timer-555-calculator
  96. db-signal-loss
  97. op-amp-gain-calculator
  98. led-resistor-calculator
  99. capacitor-charge-time
  100. zener-voltage-regulator

  [AEROSPACE / AUTOMOTIVE — 8 tools]
  101. thrust-to-weight-ratio
  102. drag-coefficient-estimator
  103. wing-loading-calculator
  104. vehicle-fuel-economy
  105. ev-range-calculator
  106. engine-horsepower-estimator
  107. mach-number-converter
  108. braking-distance-calculator

  [IT INFRASTRUCTURE — 10 tools]
  109. cloud-cost-estimator
  110. server-rack-power-cooling
  111. network-bandwidth-calculator
  112. api-load-calculator
  113. database-storage-estimator
  114. cyber-security-risk
  115. saas-pricing-ltv
  116. cicd-pipeline-cost
  117. docker-k8s-sizing
  118. password-entropy-calculator

  [PROJECT MANAGEMENT — 8 tools]
  119. critical-path-method
  120. boq-material-take-off
  121. project-roi-calculator
  122. earned-value-management
  123. labour-productivity-estimator
  124. crane-lift-capacity
  125. contractor-markup-calculator
  126. depreciation-calculator

────────────────────────────────────────────────────────────────────────────────
🖼️ IMAGE TOOLS — 38 tools — /tools/image-tools/
────────────────────────────────────────────────────────────────────────────────
  1.  image-compressor
  2.  background-remover
  3.  image-resizer
  4.  image-converter
  5.  passport-photo-maker
  6.  image-cropper
  7.  bulk-image-resizer
  8.  image-upscaler
  9.  dpi-converter
  10. pixel-density-calculator
  11. background-changer
  12. white-background-maker
  13. heic-to-jpg
  14. png-to-jpg
  15. jpg-to-png
  16. image-to-base64
  17. base64-to-image
  18. image-enhancer
  19. image-colorizer
  20. blur-background
  21. add-watermark
  22. remove-watermark
  23. image-flipper-rotator
  24. grayscale-converter
  25. add-border
  26. round-corner-image
  27. image-metadata-viewer
  28. image-color-picker
  29. dominant-color-extractor
  30. image-size-checker
  31. meme-generator
  32. photo-to-cartoon
  33. id-card-photo-maker
  34. thumbnail-maker
  35. photo-collage-maker
  36. gif-maker
  37. screenshot-to-pdf
  38. image-to-text

────────────────────────────────────────────────────────────────────────────────
💻 DEVELOPER TOOLS — 19 tools — /tools/developer/
────────────────────────────────────────────────────────────────────────────────
  1.  json-formatter
  2.  base64-encoder
  3.  regex-tester
  4.  css-minifier
  5.  js-beautifier
  6.  uuid-generator
  7.  hash-generator
  8.  color-picker
  9.  url-encoder
  10. html-encoder
  11. jwt-decoder
  12. cron-parser
  13. sql-formatter
  14. xml-formatter
  15. yaml-validator
  16. markdown-editor
  17. diff-checker
  18. chmod-calculator
  19. timestamp-converter

────────────────────────────────────────────────────────────────────────────────
📋 DOCUMENT TOOLS — 9 tools — /tools/document-tools/
────────────────────────────────────────────────────────────────────────────────
  1.  invoice-generator
  2.  resume-builder
  3.  cover-letter-builder
  4.  business-letter
  5.  meeting-minutes
  6.  expense-report
  7.  proposal-generator
  8.  reference-letter
  9.  contract-creator

────────────────────────────────────────────────────────────────────────────────
✏️ TEXT TOOLS — 10 tools — /tools/text/
────────────────────────────────────────────────────────────────────────────────
  1.  word-counter
  2.  case-converter
  3.  lorem-ipsum-generator
  4.  text-summarizer
  5.  grammar-checker
  6.  readability-score
  7.  text-to-speech
  8.  remove-duplicate-lines
  9.  text-reverser
  10. find-replace

────────────────────────────────────────────────────────────────────────────────
🌐 NETWORK TOOLS — 7 tools — /tools/network/
────────────────────────────────────────────────────────────────────────────────
  1.  ip-checker
  2.  dns-lookup
  3.  whois-lookup
  4.  port-checker
  5.  ping-tool
  6.  http-headers-checker
  7.  website-speed-test

────────────────────────────────────────────────────────────────────────────────
🔒 SECURITY — 8 tools — /tools/security/
────────────────────────────────────────────────────────────────────────────────
  1.  qr-code-generator
  2.  password-generator
  3.  url-shortener
  4.  temporary-email
  5.  file-encryptor
  6.  vpn-checker
  7.  ssl-checker
  8.  metadata-remover

────────────────────────────────────────────────────────────────────────────────
🔄 UNIT CONVERTERS — 8 tools — /tools/converters/
────────────────────────────────────────────────────────────────────────────────
  1.  temperature-converter
  2.  length-converter
  3.  weight-converter
  4.  area-converter
  5.  volume-converter
  6.  speed-converter
  7.  time-converter
  8.  digital-storage-converter

────────────────────────────────────────────────────────────────────────────────
⚖️ LEGAL TOOLS — 8 tools — /tools/legal-tools/
────────────────────────────────────────────────────────────────────────────────
  1.  privacy-policy-generator
  2.  terms-of-service-generator
  3.  nda-generator
  4.  lease-agreement-generator
  5.  employment-contract-generator
  6.  will-generator
  7.  power-of-attorney-generator
  8.  cease-and-desist-generator

────────────────────────────────────────────────────────────────────────────────
🏠 REAL ESTATE — 8 tools — /tools/real-estate/
────────────────────────────────────────────────────────────────────────────────
  1.  rent-vs-buy-calculator
  2.  home-affordability-calculator
  3.  property-tax-calculator
  4.  closing-costs-calculator
  5.  cap-rate-calculator
  6.  rental-yield-calculator
  7.  home-value-estimator
  8.  down-payment-calculator

────────────────────────────────────────────────────────────────────────────────
💼 BUSINESS TOOLS — 6 tools — /tools/business/
────────────────────────────────────────────────────────────────────────────────
  1.  sales-copy-ai
  2.  ad-creative-generator
  3.  social-media-scheduler
  4.  email-marketing-ai
  5.  landing-page-builder
  6.  seo-optimizer

────────────────────────────────────────────────────────────────────────────────
🌿 ENVIRONMENT — 6 tools — /tools/environment/
────────────────────────────────────────────────────────────────────────────────
  1.  solar-savings-calculator
  2.  home-energy-audit
  3.  ev-carbon-offset
  4.  flight-carbon-calculator
  5.  carbon-footprint-calculator
  6.  waste-reduction-planner

================================================================================
## 6. CATEGORY SUMMARY TABLE
================================================================================

  #   Category          Tools   Route
  ──────────────────────────────────────────────────────
  1   Engineering        126    /tools/engineering
  2   Medical & Health   113    /tools/medical
  3   Image Tools         38    /tools/image-tools
  4   PDF Tools           26    /tools/pdf
  5   Calculators         21    /tools/calculators
  6   Developer Tools     19    /tools/developer
  7   Text Tools          10    /tools/text
  8   Document Tools       9    /tools/document-tools
  9   Security             8    /tools/security
  10  Unit Converters      8    /tools/converters
  11  Legal Tools          8    /tools/legal-tools
  12  Real Estate          8    /tools/real-estate
  13  Network Tools        7    /tools/network
  14  Business Tools       6    /tools/business
  15  Environment          6    /tools/environment
  ──────────────────────────────────────────────────────
      TOTAL             405

================================================================================
## 7. CATEGORY ORDER ON HOMEPAGE (CategoryGrid.tsx)
================================================================================

  FEATURED CARDS (large, show sample tools):
    1. PDF Tools        (rose/red gradient)
    2. Calculators      (indigo/blue gradient)
    3. Medical & Health (emerald/teal gradient)    ← position 3 as requested
    4. Engineering      (sky/blue gradient)        ← position 4 as requested

  COMPACT CARDS (smaller):
    5.  Image Tools     (pink/fuchsia)
    6.  Developer       (slate/gray)
    7.  Document Tools  (violet/purple)
    8.  Security        (green/emerald)
    9.  Text Tools      (amber/orange)
    10. Network Tools   (cyan/sky)
    11. Unit Converters (teal/cyan)
    12. Legal Tools     (yellow/amber)
    13. Real Estate     (orange/amber)
    14. Business Tools  (purple/violet)
    15. Environment     (lime/green)
    +   "All 405 tools →" dashed CTA slot

================================================================================
## 8. ENGINEERING SUBCATEGORIES (in hub page)
================================================================================

  1.  Civil & Structural Engineering       (18 tools)
  2.  Electrical Engineering               (18 tools)
  3.  Mechanical Engineering               (18 tools)
  4.  HVAC & Building Services             (10 tools)
  5.  Chemical & Process Engineering       (10 tools)
  6.  Electronics & PCB Design             (10 tools)
  7.  IT Infrastructure & Cloud            (10 tools)
  8.  Geotechnical Engineering             (8 tools)
  9.  Water Resources & Environmental      (8 tools)
  10. Aerospace & Automotive               (8 tools)
  11. Project Management & Cost            (8 tools)

================================================================================
## 9. MEDICAL SUBCATEGORIES (in hub page)
================================================================================

  1.  Cardiology & Cardiovascular          (12 tools)
  2.  Nephrology & Renal                   (10 tools)
  3.  Critical Care & Emergency Medicine   (11 tools)
  4.  Psychiatry & Neurology               (9 tools)
  5.  Endocrinology & Metabolism           (8 tools)
  6.  Pharmacology & Drug Dosing           (13 tools)
  7.  Obstetrics & Gynecology              (10 tools)
  8.  Pulmonology & Respiratory            (6 tools)
  9.  Gastroenterology & Hepatology        (6 tools)
  10. Oncology & Hematology                (8 tools)
  11. Pediatrics & Neonatology             (8 tools)
  12. General Health & Wellness            (12 tools)

================================================================================
## 10. POPULAR TOOLS (shown on homepage)
================================================================================

  1.  Compress PDF           /tools/pdf/compress-pdf
  2.  PDF to Word            /tools/pdf/pdf-to-word
  3.  Remove Background      /tools/image-tools/background-remover
  4.  BMI Calculator         /tools/calculators/bmi-calculator
  5.  eGFR Calculator        /tools/medical/egfr-ckd-epi-calculator
  6.  JSON Formatter         /tools/developer/json-formatter
  7.  Ohm's Law              /tools/engineering/ohms-law-calculator
  8.  Word Counter           /tools/text/word-counter
  9.  Password Generator     /tools/security/password-generator
  10. Mortgage Calculator    /tools/calculators/mortgage-calculator
  11. PHQ-9 Screen           /tools/medical/phq9-depression-screen
  12. Beam Deflection        /tools/engineering/beam-deflection-calculator

================================================================================
## 11. SOCIAL LINKS (social-config.ts)
================================================================================

  Twitter/X:   https://x.com/roughtools
  GitHub:      https://github.com/roughtools
  Instagram:   https://instagram.com/roughtools
  LinkedIn:    https://linkedin.com/company/roughtools

================================================================================
## 12. STATIC BUILD OUTPUT
================================================================================

  Total pages generated:   707
  Build type:              Static (SSG) — all pages pre-rendered
  Homepage:                ~92kB first load JS
  Tool pages:              ~93-103kB first load JS
  Shared JS chunk:         87.7kB

================================================================================
## 13. PERFORMANCE OPTIMIZATIONS APPLIED
================================================================================

  - Removed unused fonts (Syne, DM_Sans, DM_Mono) — only Inter remains
  - Chatbot lazy loaded (dynamic import, ssr: false)
  - CookieConsent lazy loaded (dynamic import, ssr: false)
  - CategoryHubLayout converted to server component (no 'use client')
  - Console logs stripped in production (next.config.ts)
  - CDN cache headers on /tools/* routes (s-maxage=86400, SWR=604800)
  - Loading skeletons added for all major routes:
      /app/loading.tsx
      /tools/[category]/loading.tsx
      /tools/[category]/[tool]/loading.tsx
      /tools/engineering/loading.tsx
      /tools/engineering/[slug]/loading.tsx
      /tools/medical/loading.tsx
      /tools/medical/[slug]/loading.tsx

================================================================================
## 14. NOTES FOR CLAUDE (AI CONTEXT)
================================================================================

  - tools-registry.ts is the SINGLE SOURCE OF TRUTH for all tools
  - TOTAL_TOOLS = ALL_TOOLS.length (dynamic, currently 405)
  - Dynamic Tailwind class names (e.g. `bg-${color}`) get purged — always use explicit full class strings
  - CategoryHubLayout is a SERVER component — no useState/useEffect allowed
  - Medical tools use: /tools/medical/[slug]/page.tsx → MedicalCalculatorClient.tsx
  - Engineering tools use: /tools/engineering/[slug]/page.tsx → EngineeringCalculatorClient.tsx
  - CSS custom property --card-glow is set per category via style prop for hover box-shadow
  - All category counts in SiteHeader, Footer, CategoryGrid must match tools-registry.ts exactly
  - Server/client boundary: plain .ts files safe to import server-side, 'use client' files are not
  - pnpm monorepo — always run commands with: pnpm --filter web <command>
