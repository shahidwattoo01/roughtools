"""
ROUGHTOOLS.COM — Complete Project Documentation PDF Generator
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm, mm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, PageBreak, KeepTogether
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.platypus import ListFlowable, ListItem
from datetime import datetime

OUTPUT = r"C:\Users\shahid\ai-tools-platform\ROUGHTOOLS-PROJECT-COMPLETE.pdf"

# ─── Color Palette ────────────────────────────────────────────────────────────
DARK_BG    = colors.HexColor("#04070e")
BRAND      = colors.HexColor("#6366f1")   # indigo
BRAND_DARK = colors.HexColor("#4338ca")
SKY        = colors.HexColor("#0ea5e9")
EMERALD    = colors.HexColor("#10b981")
ROSE       = colors.HexColor("#f43f5e")
AMBER      = colors.HexColor("#f59e0b")
VIOLET     = colors.HexColor("#8b5cf6")
GRAY_900   = colors.HexColor("#111827")
GRAY_700   = colors.HexColor("#374151")
GRAY_500   = colors.HexColor("#6b7280")
GRAY_200   = colors.HexColor("#e5e7eb")
GRAY_100   = colors.HexColor("#f3f4f6")
WHITE      = colors.white
GREEN_DOT  = colors.HexColor("#22c55e")
RED_DOT    = colors.HexColor("#ef4444")
YELLOW_DOT = colors.HexColor("#eab308")

# ─── Styles ───────────────────────────────────────────────────────────────────
styles = getSampleStyleSheet()

def S(name, **kwargs):
    return ParagraphStyle(name, **kwargs)

COVER_TITLE = S("CoverTitle",
    fontSize=36, leading=44, textColor=WHITE,
    fontName="Helvetica-Bold", alignment=TA_CENTER, spaceAfter=8)

COVER_SUB = S("CoverSub",
    fontSize=14, leading=20, textColor=colors.HexColor("#a5b4fc"),
    fontName="Helvetica", alignment=TA_CENTER, spaceAfter=4)

COVER_META = S("CoverMeta",
    fontSize=10, leading=14, textColor=colors.HexColor("#94a3b8"),
    fontName="Helvetica", alignment=TA_CENTER)

H1 = S("H1",
    fontSize=20, leading=26, textColor=BRAND,
    fontName="Helvetica-Bold", spaceBefore=20, spaceAfter=8,
    borderPad=4)

H2 = S("H2",
    fontSize=14, leading=19, textColor=GRAY_900,
    fontName="Helvetica-Bold", spaceBefore=14, spaceAfter=5)

H3 = S("H3",
    fontSize=11, leading=15, textColor=BRAND_DARK,
    fontName="Helvetica-Bold", spaceBefore=10, spaceAfter=3)

BODY = S("Body",
    fontSize=9, leading=13, textColor=GRAY_700,
    fontName="Helvetica", spaceAfter=4)

BODY_SM = S("BodySm",
    fontSize=8, leading=12, textColor=GRAY_700,
    fontName="Helvetica", spaceAfter=2)

CODE = S("Code",
    fontSize=7.5, leading=11, textColor=GRAY_900,
    fontName="Courier", backColor=GRAY_100,
    borderPad=4, spaceAfter=3)

LABEL = S("Label",
    fontSize=8, leading=11, textColor=GRAY_500,
    fontName="Helvetica-Bold", spaceAfter=1)

CAPTION = S("Caption",
    fontSize=8, leading=11, textColor=GRAY_500,
    fontName="Helvetica-Oblique", alignment=TA_CENTER)

BULLET = S("Bullet",
    fontSize=8.5, leading=13, textColor=GRAY_700,
    fontName="Helvetica", leftIndent=12, spaceAfter=2,
    bulletIndent=0)

STATUS_DONE = S("StatusDone",
    fontSize=8.5, leading=13, textColor=colors.HexColor("#065f46"),
    fontName="Helvetica", leftIndent=12, spaceAfter=2)

STATUS_TODO = S("StatusTodo",
    fontSize=8.5, leading=13, textColor=colors.HexColor("#7f1d1d"),
    fontName="Helvetica", leftIndent=12, spaceAfter=2)

STATUS_WIP = S("StatusWip",
    fontSize=8.5, leading=13, textColor=colors.HexColor("#78350f"),
    fontName="Helvetica", leftIndent=12, spaceAfter=2)

# ─── Helpers ──────────────────────────────────────────────────────────────────
def hr(color=GRAY_200, thickness=0.5):
    return HRFlowable(width="100%", thickness=thickness, color=color,
                      spaceAfter=6, spaceBefore=6)

def gap(h=8):
    return Spacer(1, h)

def section_header(text, color=BRAND, icon=""):
    full = f"{icon}  {text}" if icon else text
    return [
        gap(6),
        Paragraph(full, H1),
        HRFlowable(width="100%", thickness=2, color=color,
                   spaceAfter=8, spaceBefore=2),
    ]

def sub_header(text, color=GRAY_900):
    return Paragraph(text, H2)

def sub2(text):
    return Paragraph(text, H3)

def body(text):
    return Paragraph(text, BODY)

def bold_label(text):
    return Paragraph(text, LABEL)

def chip_table(items, chip_color=BRAND):
    """Render a row of chip-style badges."""
    cells = []
    for item in items:
        cells.append(
            Table([[Paragraph(item, S("chip", fontSize=7.5, fontName="Helvetica-Bold",
                                       textColor=WHITE, alignment=TA_CENTER))]],
                  colWidths=[None],
                  style=TableStyle([
                      ("BACKGROUND", (0,0), (-1,-1), chip_color),
                      ("ROUNDEDCORNERS", [4]),
                      ("TOPPADDING", (0,0), (-1,-1), 3),
                      ("BOTTOMPADDING", (0,0), (-1,-1), 3),
                      ("LEFTPADDING", (0,0), (-1,-1), 6),
                      ("RIGHTPADDING", (0,0), (-1,-1), 6),
                  ]))
        )
    t = Table([cells], hAlign="LEFT")
    t.setStyle(TableStyle([
        ("ALIGN", (0,0), (-1,-1), "LEFT"),
        ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
        ("LEFTPADDING", (0,0), (-1,-1), 0),
        ("RIGHTPADDING", (0,0), (-1,-1), 4),
    ]))
    return t

def info_box(rows, bg=GRAY_100, border=GRAY_200):
    """Key-value info box."""
    data = [[Paragraph(k, LABEL), Paragraph(v, BODY_SM)] for k, v in rows]
    t = Table(data, colWidths=[4*cm, 12.5*cm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), bg),
        ("BOX", (0,0), (-1,-1), 0.5, border),
        ("INNERGRID", (0,0), (-1,-1), 0.3, border),
        ("TOPPADDING", (0,0), (-1,-1), 4),
        ("BOTTOMPADDING", (0,0), (-1,-1), 4),
        ("LEFTPADDING", (0,0), (-1,-1), 6),
        ("RIGHTPADDING", (0,0), (-1,-1), 6),
        ("VALIGN", (0,0), (-1,-1), "TOP"),
    ]))
    return t

def tool_table(tools, cols=3):
    """Numbered tool list in a compact grid."""
    padded = list(tools)
    while len(padded) % cols != 0:
        padded.append("")
    rows = [padded[i:i+cols] for i in range(0, len(padded), cols)]
    data = []
    num = 1
    for row in rows:
        cells = []
        for cell in row:
            if cell:
                cells.append(Paragraph(f"{num}. {cell}", BODY_SM))
                num += 1
            else:
                cells.append(Paragraph("", BODY_SM))
        data.append(cells)
    col_w = 16.5 * cm / cols
    t = Table(data, colWidths=[col_w]*cols)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), GRAY_100),
        ("BOX", (0,0), (-1,-1), 0.4, GRAY_200),
        ("INNERGRID", (0,0), (-1,-1), 0.3, GRAY_200),
        ("TOPPADDING", (0,0), (-1,-1), 3),
        ("BOTTOMPADDING", (0,0), (-1,-1), 3),
        ("LEFTPADDING", (0,0), (-1,-1), 5),
        ("RIGHTPADDING", (0,0), (-1,-1), 5),
        ("VALIGN", (0,0), (-1,-1), "TOP"),
        ("FONTSIZE", (0,0), (-1,-1), 8),
    ]))
    return t

def status_row(icon, text, color):
    st = S(f"sr_{icon}", fontSize=8.5, leading=13, textColor=color,
           fontName="Helvetica", leftIndent=12, spaceAfter=2)
    return Paragraph(f"{icon}  {text}", st)

def colored_header_table(title, subtitle, bg, text_color=WHITE):
    data = [[Paragraph(title, S("th", fontSize=13, fontName="Helvetica-Bold",
                                 textColor=text_color)),
             Paragraph(subtitle, S("ts", fontSize=8.5, fontName="Helvetica",
                                    textColor=text_color, alignment=TA_RIGHT))]]
    t = Table(data, colWidths=[12*cm, 5*cm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), bg),
        ("TOPPADDING", (0,0), (-1,-1), 8),
        ("BOTTOMPADDING", (0,0), (-1,-1), 8),
        ("LEFTPADDING", (0,0), (-1,-1), 10),
        ("RIGHTPADDING", (0,0), (-1,-1), 10),
        ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
    ]))
    return t

# ─── Page Templates ───────────────────────────────────────────────────────────
PAGE_W, PAGE_H = A4

def cover_page_bg(canvas_obj, doc):
    canvas_obj.saveState()
    canvas_obj.setFillColor(DARK_BG)
    canvas_obj.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    # Top accent bar
    canvas_obj.setFillColor(BRAND)
    canvas_obj.rect(0, PAGE_H - 6, PAGE_W, 6, fill=1, stroke=0)
    # Bottom accent
    canvas_obj.setFillColor(BRAND_DARK)
    canvas_obj.rect(0, 0, PAGE_W, 3, fill=1, stroke=0)
    canvas_obj.restoreState()

def normal_page(canvas_obj, doc):
    canvas_obj.saveState()
    # Header bar
    canvas_obj.setFillColor(DARK_BG)
    canvas_obj.rect(0, PAGE_H - 28, PAGE_W, 28, fill=1, stroke=0)
    canvas_obj.setFillColor(BRAND)
    canvas_obj.rect(0, PAGE_H - 31, PAGE_W, 3, fill=1, stroke=0)
    canvas_obj.setFont("Helvetica-Bold", 8)
    canvas_obj.setFillColor(WHITE)
    canvas_obj.drawString(2*cm, PAGE_H - 19, "ROUGHTOOLS.COM — Project Documentation")
    canvas_obj.setFont("Helvetica", 7.5)
    canvas_obj.setFillColor(colors.HexColor("#a5b4fc"))
    canvas_obj.drawRightString(PAGE_W - 2*cm, PAGE_H - 19, f"Generated: {datetime.now().strftime('%Y-%m-%d')}")
    # Footer
    canvas_obj.setFillColor(GRAY_200)
    canvas_obj.rect(0, 0, PAGE_W, 22, fill=1, stroke=0)
    canvas_obj.setFillColor(BRAND)
    canvas_obj.rect(0, 21, PAGE_W, 1, fill=1, stroke=0)
    canvas_obj.setFont("Helvetica", 7.5)
    canvas_obj.setFillColor(GRAY_700)
    canvas_obj.drawString(2*cm, 7, "roughtools.com  |  405 Tools  |  15 Categories  |  Next.js 14")
    canvas_obj.drawRightString(PAGE_W - 2*cm, 7, f"Page {doc.page}")
    canvas_obj.restoreState()

# ─── Build Document ───────────────────────────────────────────────────────────
doc = SimpleDocTemplate(
    OUTPUT,
    pagesize=A4,
    rightMargin=2*cm, leftMargin=2*cm,
    topMargin=1.5*cm, bottomMargin=1.5*cm,
    title="ROUGHTOOLS.COM — Complete Project Documentation",
    author="Claude Code",
    subject="Project Structure, Audit & Tool Registry",
)

story = []

# ═══════════════════════════════════════════════════════════════════════════════
# PAGE 1 — COVER
# ═══════════════════════════════════════════════════════════════════════════════
story.append(Spacer(1, 3.5*cm))
story.append(Paragraph("ROUGHTOOLS.COM", COVER_TITLE))
story.append(gap(6))
story.append(Paragraph("Complete Project Documentation", COVER_SUB))
story.append(gap(12))

# Stats row
stats = [
    ["405", "Tools"],
    ["15",  "Categories"],
    ["707", "SSG Pages"],
    ["22",  "DB Models"],
]
cells = []
for num, label in stats:
    cells.append(
        Table(
            [[Paragraph(num, S("sn", fontSize=28, fontName="Helvetica-Bold",
                                textColor=colors.HexColor("#6366f1"), alignment=TA_CENTER))],
             [Paragraph(label, S("sl", fontSize=9, fontName="Helvetica",
                                  textColor=colors.HexColor("#94a3b8"), alignment=TA_CENTER))]],
            style=TableStyle([
                ("ALIGN",   (0,0), (-1,-1), "CENTER"),
                ("VALIGN",  (0,0), (-1,-1), "MIDDLE"),
                ("TOPPADDING", (0,0), (-1,-1), 4),
                ("BOTTOMPADDING", (0,0), (-1,-1), 4),
            ])
        )
    )
stat_table = Table([cells], colWidths=[3.8*cm]*4, hAlign="CENTER")
stat_table.setStyle(TableStyle([
    ("ALIGN",      (0,0), (-1,-1), "CENTER"),
    ("BACKGROUND", (0,0), (-1,-1), colors.HexColor("#0f172a")),
    ("BOX",        (0,0), (-1,-1), 0.5, colors.HexColor("#1e293b")),
    ("INNERGRID",  (0,0), (-1,-1), 0.5, colors.HexColor("#1e293b")),
    ("TOPPADDING", (0,0), (-1,-1), 10),
    ("BOTTOMPADDING", (0,0), (-1,-1), 10),
]))
story.append(stat_table)
story.append(gap(20))

# Tech stack chips
tech = ["Next.js 14", "TypeScript", "Tailwind CSS", "Express.js",
        "PostgreSQL", "Prisma", "Redis", "BullMQ",
        "Stripe", "JWT Auth", "Sentry", "Turborepo", "pnpm", "Docker"]
tech_cells = [[Paragraph(t, S("tc", fontSize=8, fontName="Helvetica-Bold",
                                textColor=colors.HexColor("#e2e8f0"),
                                alignment=TA_CENTER)) for t in tech[:7]],
              [Paragraph(t, S("tc2", fontSize=8, fontName="Helvetica-Bold",
                               textColor=colors.HexColor("#e2e8f0"),
                               alignment=TA_CENTER)) for t in tech[7:]]]
tc_table = Table(tech_cells, colWidths=[2.2*cm]*7, hAlign="CENTER")
tc_table.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (-1,-1), colors.HexColor("#1e293b")),
    ("BOX",        (0,0), (-1,-1), 0.4, colors.HexColor("#334155")),
    ("INNERGRID",  (0,0), (-1,-1), 0.4, colors.HexColor("#334155")),
    ("TOPPADDING", (0,0), (-1,-1), 5),
    ("BOTTOMPADDING", (0,0), (-1,-1), 5),
    ("ALIGN",      (0,0), (-1,-1), "CENTER"),
]))
story.append(tc_table)
story.append(gap(20))

# Progress bar
story.append(Paragraph("Overall Completion: ~70%", COVER_META))
story.append(gap(6))

# Progress bar visual
pbar_data = [[
    Paragraph("", BODY_SM),
    Paragraph("", BODY_SM),
]]
pbar = Table([[""]], colWidths=[11.55*cm])
pbar.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (-1,-1), colors.HexColor("#6366f1")),
    ("TOPPADDING", (0,0), (-1,-1), 7),
    ("BOTTOMPADDING", (0,0), (-1,-1), 7),
]))
pbar_bg = Table([[pbar, ""]], colWidths=[11.55*cm, 4.95*cm], hAlign="CENTER")
pbar_bg.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (0,0), colors.HexColor("#6366f1")),
    ("BACKGROUND", (1,0), (1,0), colors.HexColor("#1e293b")),
    ("BOX",        (0,0), (-1,-1), 0.5, colors.HexColor("#334155")),
    ("TOPPADDING", (0,0), (-1,-1), 8),
    ("BOTTOMPADDING", (0,0), (-1,-1), 8),
    ("LEFTPADDING", (0,0), (-1,-1), 0),
    ("RIGHTPADDING", (0,0), (-1,-1), 0),
]))
story.append(pbar_bg)
story.append(gap(4))
story.append(Paragraph("70% done  |  30% remaining (192 tool configs needed)", COVER_META))
story.append(Spacer(1, 2.5*cm))
story.append(Paragraph(f"Generated: {datetime.now().strftime('%B %d, %Y')}  |  shahidwattoo0111@gmail.com", COVER_META))

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 1 — PROJECT OVERVIEW
# ═══════════════════════════════════════════════════════════════════════════════
story += section_header("1. Project Overview", BRAND, "")

story.append(info_box([
    ("Project",    "ROUGHTOOLS.COM"),
    ("Repo",       "ai-tools-platform (monorepo)"),
    ("Framework",  "Next.js 14 — App Router (SSG)"),
    ("Language",   "TypeScript (strict)"),
    ("Styling",    "Tailwind CSS JIT"),
    ("Monorepo",   "pnpm workspaces + Turborepo"),
    ("Backend",    "Express.js API (apps/api)"),
    ("Database",   "PostgreSQL + Prisma ORM"),
    ("Cache",      "Redis"),
    ("Queue",      "BullMQ"),
    ("PDF",        "Gotenberg (self-hosted)"),
    ("Billing",    "Stripe"),
    ("Auth",       "JWT (bcrypt, sessions)"),
    ("Monitoring", "Sentry + Google Analytics + Microsoft Clarity"),
    ("Deploy",     "Vercel (web) + VPS/Docker (api)"),
    ("Build Output","707 static pages (SSG)"),
    ("Total Tools","405 tools across 15 categories"),
    ("Node",       "18+"),
]))
story.append(gap(10))

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 2 — FOLDER STRUCTURE
# ═══════════════════════════════════════════════════════════════════════════════
story += section_header("2. Complete Folder Structure", SKY, "")

story.append(sub_header("Monorepo Root"))
root_struct = [
    "ai-tools-platform/",
    "  apps/",
    "    web/          ← Next.js 14 App Router (frontend)",
    "    api/          ← Express.js backend",
    "  packages/",
    "    cache/        ← Redis cache helpers",
    "    calculators-core/ ← Shared calculation logic",
    "    config/       ← Shared ESLint + TS config",
    "    core-logic/   ← Core business logic",
    "    db/           ← Prisma schema + migrations (22 models)",
    "    engine/       ← Tool engine",
    "    errors/       ← Shared error types",
    "    legal/        ← Legal document helpers",
    "    queue/        ← BullMQ job queue setup",
    "    redis/        ← Redis client",
    "    seo/          ← SEO helpers + JSON-LD generators",
    "    storage/      ← AWS S3 / file storage",
    "    types/        ← Shared TypeScript interfaces",
    "    ui/           ← Shared UI components",
    "    utils/        ← Shared utility functions",
    "    validation/   ← Zod validation schemas",
    "    validators/   ← Input validators",
    "  .env.example    ← All env vars documented",
    "  Makefile        ← 40+ dev/build/db/docker commands",
    "  Dockerfile.gotenberg",
    "  docker-compose.yml",
    "  turbo.json",
    "  pnpm-workspace.yaml",
]
for line in root_struct:
    story.append(Paragraph(line, CODE))

story.append(gap(10))
story.append(sub_header("apps/web/src/ — Frontend Structure"))

web_struct = [
    "app/",
    "  layout.tsx                    Root layout (Inter font, Header, Footer, Chatbot)",
    "  page.tsx                      HOME PAGE",
    "  globals.css                   Design system, animations, CSS variables",
    "  loading.tsx / not-found.tsx / error.tsx / global-error.tsx",
    "  manifest.ts / robots.ts / sitemap.ts",
    "  sitemap-calculators.ts + sitemap-converters.ts + sitemap-developer.ts",
    "  sitemap-legal-tools.ts + sitemap-network.ts + sitemap-pdf.ts",
    "  sitemap-real-estate.ts + sitemap-text.ts",
    "  opengraph-image.tsx",
    "  (auth)/",
    "    signin/page.tsx + signup/page.tsx",
    "  about/page.tsx + blog/page.tsx + blog/[slug]/page.tsx",
    "  contact/page.tsx + pricing/page.tsx + search/page.tsx",
    "  privacy-policy/page.tsx + terms-of-service/page.tsx",
    "  settings/page.tsx + profile/page.tsx + api-docs/page.tsx",
    "  link-to-us/page.tsx + embed-generator/page.tsx",
    "  dashboard/page.tsx + dashboard/api-keys/page.tsx + dashboard/referral/page.tsx",
    "  admin/analytics/page.tsx",
    "  billing/success/page.tsx",
    "  api/",
    "    ai/route.ts",
    "    api-keys/route.ts + [id]/route.ts",
    "    auth/me/ + profile/ + register/  (route.ts each)",
    "    billing/checkout/route.ts",
    "    health/route.ts",
    "    pdf/  (20 PDF processing routes)",
    "    users/route.ts + [id]/route.ts",
    "  tools/",
    "    page.tsx                    Browse all tools",
    "    [category]/page.tsx + [category]/[tool]/page.tsx  (generic fallbacks)",
    "    pdf/[pdfTool]/page.tsx + _components/  (PDFToolClient, pdf-tool-configs.ts)",
    "    calculators/  (21 individual tool folders, each with page.tsx + Client.tsx)",
    "    developer/    (19 tool folders)",
    "    image-tools/  (38 tool folders)",
    "    text/         (10 tool folders)",
    "    converters/   (8 tool folders)",
    "    security/     (8 tool folders)",
    "    legal-tools/  (8 tool folders)",
    "    real-estate/  (8 tool folders)",
    "    network/      (7 tool folders)",
    "    business/     (6 tool folders)",
    "    environment/  (6 tool folders)",
    "    document-tools/ (42 sub-pages incl. PDF tools)",
    "    engineering/page.tsx + [slug]/page.tsx + _components/",
    "      EngineeringCalculatorClient.tsx + engineering-configs.ts",
    "    medical/page.tsx + [slug]/page.tsx + _components/",
    "      MedicalCalculatorClient.tsx + medical-configs.ts",
]
for line in web_struct:
    story.append(Paragraph(line, CODE))

story.append(gap(8))
story.append(sub_header("apps/web/src/ — Components & Lib"))
comp_struct = [
    "components/",
    "  SiteHeader.tsx          Sticky header + 15-category slide-in drawer",
    "  Footer.tsx              Brand + categories + popular tools + company",
    "  CategoryGrid.tsx        Home bento grid (4 featured + 11 compact)",
    "  CategoryHubLayout.tsx   Shared server layout for category hubs",
    "  SearchBar.tsx / ToolCard.tsx / RelatedTools.tsx / Breadcrumbs.tsx",
    "  Chatbot.tsx (lazy) + CookieConsent.tsx (lazy)",
    "  JsonLd.tsx + LazySection.tsx + OptimizedImage.tsx",
    "  ToolAdUnit.tsx (AdSense) + ThemeProvider.tsx + icons.tsx",
    "  analytics/  AdSense.tsx + GoogleAnalytics.tsx + MicrosoftClarity.tsx",
    "              SearchConsoleVerification.tsx + WebVitals.tsx",
    "  layout/     Header.tsx + Footer.tsx + Sidebar.tsx (+ .module.css each)",
    "  sections/   Hero.tsx + StatsBar.tsx + Ticker.tsx + CalculatorsSection.tsx",
    "              DocumentsSection.tsx + FilterBar.tsx + RoadmapSection.tsx",
    "  tools/      AgeCalculator + BMICalculator + CompoundInterest + DaysBetweenDates",
    "              MortgageCalculator + PercentageCalculator + RoiCalculator",
    "              TaxCalculator + TipCalculator",
    "  ui/         CategoryPage.tsx + CustomCursor.tsx + ToolCard.tsx",
    "",
    "lib/",
    "  tools-registry.ts       SOURCE OF TRUTH — all 415 tool definitions",
    "  seo.ts + seo-config.ts + structured-data.ts + og-utils.ts",
    "  relatedTools.ts + social-config.ts + canonical.ts",
    "  tool-metadata.ts + blog-posts.ts + analytics.ts + prisma.ts + utils.ts",
    "",
    "hooks/  useAuth.ts + usePageTracking.tsx + useTheme.ts",
    "middleware.ts + instrumentation.ts",
]
for line in comp_struct:
    story.append(Paragraph(line, CODE))

story.append(gap(8))
story.append(sub_header("apps/api/src/ — Backend Structure"))
api_struct = [
    "index.ts                    Main Express server entry point",
    "",
    "lib/",
    "  gotenberg.ts              Gotenberg PDF service client",
    "  logger.ts + prisma.ts + sentry.ts",
    "",
    "middleware/",
    "  csrfProtection.ts + errorHandler.ts + fileValidator.ts",
    "  notFoundHandler.ts + pdfErrorHandler.ts + pdfRateLimit.ts",
    "  rateLimiter.ts + requestLogger.ts + requireAuth.ts",
    "  sanitizer.ts + security-headers.ts + validate.ts + validateBody.ts",
    "",
    "routes/",
    "  auth.ts + billing.ts + blog.ts + contact.ts + converters.ts",
    "  css-minifier.ts + developer.ts + gdpr.ts + health.ts",
    "  ip-checker.ts + js-beautifier.ts + metadata-remover.ts",
    "  network.ts + newsletter.ts + openapi-spec.ts + public-api.ts",
    "  referral.ts + ssl-checker.ts + temp-email.ts + text.ts",
    "  tool-analytics.ts + tool-requests.ts + url-shortener.ts + vitals.ts",
    "  affiliate.ts + api-keys.ts",
    "",
    "  calculators/  bmi.ts + calorie.ts + currency.ts + loan.ts",
    "                mortgage.ts + roi.ts + tax.ts + unit-converter.ts",
    "",
    "  pdf/  index.ts + merge.ts + split.ts + compress.ts + rotate.ts",
    "        crop.ts + protect.ts + unlock.ts + sign.ts + watermark.ts",
    "        ocr.ts + repair.ts + redact.ts + extract-pages.ts",
    "        remove-pages.ts + page-numbers.ts + organize.ts",
    "        compare.ts + pdfa.ts + convert-to-pdf.ts + convert-from-pdf.ts",
    "",
    "  developer/  js-beautifier.route.ts",
    "",
    "utils/  pagination.ts + response.ts",
    "jobs/   cleanupFiles.ts",
]
for line in api_struct:
    story.append(Paragraph(line, CODE))

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 3 — DATABASE SCHEMA
# ═══════════════════════════════════════════════════════════════════════════════
story += section_header("3. Database Schema (22 Models)", VIOLET, "")
story.append(body("PostgreSQL database managed with Prisma ORM. Schema located at packages/db/prisma/schema.prisma."))
story.append(gap(6))

models = [
    ("User",                 "Core user account: email, username, passwordHash, role, emailVerified, isActive, avatar, timestamps"),
    ("Session",              "JWT session tokens with userId, token (unique), userAgent, ipAddress, expiresAt"),
    ("Category",             "Tool categories: slug (unique), name, sortOrder"),
    ("Tag",                  "Tags for tools and blog posts: slug, name, color"),
    ("Tool",                 "Tool entries: slug, name, description, categoryId, status (DRAFT/PUBLISHED/ARCHIVED)"),
    ("ToolTag",              "Many-to-many join table between Tool and Tag"),
    ("Comment",              "User comments on tools: content, userId, toolId, timestamps"),
    ("Favorite",             "User favorites: userId + toolId (unique together)"),
    ("BlogPost",             "Blog articles: title, slug, content, status, authorId, publishedAt"),
    ("ApiUsageLog",          "API usage tracking: endpoint, method, statusCode, userId, ipHash, responseTime"),
    ("ToolUsage",            "Tool usage analytics: toolSlug, userId, ipHash, sessionId, timestamps"),
    ("WebVital",             "Core Web Vitals: name (LCP/FID/CLS/TTFB), value, page, deviceType"),
    ("ToolRequest",          "User-submitted tool requests: title, description, votes, status"),
    ("NewsletterSubscriber", "Email newsletter: email (unique), confirmedAt, source"),
    ("ContactMessage",       "Contact form submissions: name, email, subject, message, status"),
    ("Subscription",         "Stripe subscriptions: userId, stripeCustomerId, stripePriceId, status, plan"),
    ("AffiliateClick",       "Affiliate tracking clicks: affiliateId, toolSlug, ipHash, referrer"),
    ("AffiliateConversion",  "Affiliate conversions: affiliateId, userId, revenue, commissionRate"),
    ("Referral",             "Referral program: referrerId, referredId, status, rewardAmount"),
    ("ApiKey",               "Developer API keys: userId, keyHash, name, permissions, lastUsedAt"),
    ("ReferralCode",         "Referral codes: code (unique), userId, usageCount, maxUsage"),
    ("ShortLink",            "URL shortener: code (unique), originalUrl, userId, clickCount, expiresAt"),
]
data = [[
    Paragraph("Model", S("mh", fontSize=8.5, fontName="Helvetica-Bold", textColor=WHITE)),
    Paragraph("Description", S("mh2", fontSize=8.5, fontName="Helvetica-Bold", textColor=WHITE)),
]]
for model, desc in models:
    data.append([
        Paragraph(model, S("mn", fontSize=8, fontName="Helvetica-Bold", textColor=BRAND_DARK)),
        Paragraph(desc, BODY_SM),
    ])
t = Table(data, colWidths=[4.2*cm, 12.3*cm])
t.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (-1,0), DARK_BG),
    ("BACKGROUND", (0,1), (-1,-1), WHITE),
    ("ROWBACKGROUNDS", (0,1), (-1,-1), [WHITE, GRAY_100]),
    ("BOX",        (0,0), (-1,-1), 0.5, GRAY_200),
    ("INNERGRID",  (0,0), (-1,-1), 0.3, GRAY_200),
    ("TOPPADDING", (0,0), (-1,-1), 4),
    ("BOTTOMPADDING", (0,0), (-1,-1), 4),
    ("LEFTPADDING", (0,0), (-1,-1), 6),
    ("RIGHTPADDING", (0,0), (-1,-1), 6),
    ("VALIGN",     (0,0), (-1,-1), "TOP"),
]))
story.append(t)

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 4 — ALL 405 TOOLS
# ═══════════════════════════════════════════════════════════════════════════════
story += section_header("4. All 405 Tools by Category", ROSE, "")

# Category summary table
cat_data = [[
    Paragraph("#", S("ch", fontSize=8.5, fontName="Helvetica-Bold", textColor=WHITE)),
    Paragraph("Category", S("ch", fontSize=8.5, fontName="Helvetica-Bold", textColor=WHITE)),
    Paragraph("Tools", S("ch", fontSize=8.5, fontName="Helvetica-Bold", textColor=WHITE, alignment=TA_CENTER)),
    Paragraph("Route", S("ch", fontSize=8.5, fontName="Helvetica-Bold", textColor=WHITE)),
]]
cats = [
    (1,  "Engineering",      126, "/tools/engineering",    BRAND),
    (2,  "Medical & Health", 113, "/tools/medical",        EMERALD),
    (3,  "Image Tools",       38, "/tools/image-tools",    colors.HexColor("#ec4899")),
    (4,  "PDF Tools",         26, "/tools/pdf",            ROSE),
    (5,  "Calculators",       21, "/tools/calculators",    SKY),
    (6,  "Developer Tools",   19, "/tools/developer",      GRAY_700),
    (7,  "Text Tools",        10, "/tools/text",           AMBER),
    (8,  "Document Tools",     9, "/tools/document-tools", VIOLET),
    (9,  "Security",           8, "/tools/security",       EMERALD),
    (10, "Unit Converters",    8, "/tools/converters",     colors.HexColor("#14b8a6")),
    (11, "Legal Tools",        8, "/tools/legal-tools",    colors.HexColor("#eab308")),
    (12, "Real Estate",        8, "/tools/real-estate",    colors.HexColor("#f97316")),
    (13, "Network Tools",      7, "/tools/network",        SKY),
    (14, "Business Tools",     6, "/tools/business",       VIOLET),
    (15, "Environment",        6, "/tools/environment",    EMERALD),
]
total = 0
for num, name, count, route, color in cats:
    total += count
    cat_data.append([
        Paragraph(str(num), BODY_SM),
        Paragraph(name, S("cn", fontSize=8.5, fontName="Helvetica-Bold", textColor=color)),
        Paragraph(str(count), S("cc", fontSize=8.5, fontName="Helvetica-Bold",
                                 textColor=color, alignment=TA_CENTER)),
        Paragraph(route, CODE),
    ])
cat_data.append([
    Paragraph("", BODY_SM),
    Paragraph("TOTAL", S("tot", fontSize=9, fontName="Helvetica-Bold", textColor=GRAY_900)),
    Paragraph("405", S("tot2", fontSize=9, fontName="Helvetica-Bold",
                        textColor=BRAND, alignment=TA_CENTER)),
    Paragraph("", BODY_SM),
])
ct = Table(cat_data, colWidths=[1*cm, 5.5*cm, 1.8*cm, 8.2*cm])
ct.setStyle(TableStyle([
    ("BACKGROUND",    (0,0), (-1,0), DARK_BG),
    ("ROWBACKGROUNDS",(0,1), (-1,-2), [WHITE, GRAY_100]),
    ("BACKGROUND",    (0,-1), (-1,-1), colors.HexColor("#eef2ff")),
    ("BOX",           (0,0), (-1,-1), 0.5, GRAY_200),
    ("INNERGRID",     (0,0), (-1,-1), 0.3, GRAY_200),
    ("TOPPADDING",    (0,0), (-1,-1), 4),
    ("BOTTOMPADDING", (0,0), (-1,-1), 4),
    ("LEFTPADDING",   (0,0), (-1,-1), 6),
    ("RIGHTPADDING",  (0,0), (-1,-1), 6),
    ("VALIGN",        (0,0), (-1,-1), "MIDDLE"),
]))
story.append(ct)
story.append(gap(12))

# ── PDF Tools ──
story.append(colored_header_table("PDF Tools  (26 tools)", "/tools/pdf/", ROSE))
story.append(tool_table([
    "compress-pdf","merge-pdf","split-pdf","pdf-to-word","pdf-to-excel",
    "pdf-to-powerpoint","pdf-to-jpg","pdf-to-html","word-to-pdf","excel-to-pdf",
    "jpg-to-pdf","protect-pdf","unlock-pdf","rotate-pdf","crop-pdf",
    "add-watermark","ocr-pdf","repair-pdf","redact-pdf","add-page-numbers",
    "organize-pdf","extract-pdf-pages","remove-pdf-pages","compare-pdf",
    "pdf-to-pdfa","sign-pdf",
]))
story.append(gap(8))

# ── Calculators ──
story.append(colored_header_table("Calculators  (21 tools)", "/tools/calculators/", SKY))
story.append(tool_table([
    "bmi-calculator","loan-calculator","mortgage-calculator",
    "compound-interest-calculator","age-calculator","percentage-calculator",
    "date-difference-calculator","tip-calculator","tax-calculator",
    "currency-converter","gpa-calculator","calorie-calculator",
    "scientific-calculator","discount-calculator","roi-calculator",
    "inflation-calculator","retirement-calculator","salary-calculator",
    "body-fat-calculator","ovulation-calculator","due-date-calculator",
]))
story.append(gap(8))

# ── Medical ──
story.append(colored_header_table("Medical & Health  (113 tools)", "/tools/medical/", EMERALD))
story.append(gap(3))

medical_groups = [
    ("Cardiology & Cardiovascular (12)", [
        "cha2ds2-vasc-score","heart-score-calculator","framingham-risk-score",
        "mean-arterial-pressure-calculator","cardiac-output-fick-calculator",
        "timi-risk-score","qtc-interval-calculator","ldl-cholesterol-calculator",
        "warfarin-dose-estimator","has-bled-bleeding-score",
        "blood-pressure-classification","grace-acs-score",
    ]),
    ("Nephrology & Renal (10)", [
        "creatinine-clearance-cockcroft-gault","egfr-ckd-epi-calculator",
        "mdrd-egfr-calculator","urine-anion-gap-calculator","fena-feurea-calculator",
        "dialysis-adequacy-ktv","calcium-correction-calculator",
        "renal-drug-dose-adjuster","water-deficit-hypernatremia",
        "kidney-failure-risk-equation",
    ]),
    ("Critical Care & Emergency (11)", [
        "curb-65-pneumonia-score","glasgow-coma-scale","sofa-sepsis-score",
        "abg-interpreter","apache-ii-score","anion-gap-calculator",
        "wells-score-dvt-pe","iv-fluid-rate-calculator","qsofa-sepsis-score",
        "burn-surface-area-rule-of-9s","pecarn-head-injury-tool",
    ]),
    ("Psychiatry & Neurology (9)", [
        "phq9-depression-screen","gad7-anxiety-score","nihss-stroke-scale",
        "epworth-sleepiness-scale","mmse-cognitive-screen","lithium-dose-calculator",
        "audit-c-alcohol-screening","ciwa-ar-withdrawal-scale","ptsd-pcl5-checklist",
    ]),
    ("Endocrinology & Metabolism (8)", [
        "visual-acuity-converter","hba1c-glucose-converter","bmi-calculator",
        "insulin-dose-calculator","bmr-tdee-calculator","findrisc-diabetes-risk",
        "steroid-dose-converter","thyroid-function-interpreter",
    ]),
    ("Pharmacology & Drug Dosing (13)", [
        "ideal-body-weight-calculator","body-fat-percentage-calculator",
        "carb-glycemic-calculator","drug-interaction-checker",
        "weight-based-drug-dose-calculator","drug-half-life-calculator",
        "opioid-equianalgesic-converter","vancomycin-dosing-calculator",
        "aminoglycoside-dose-calculator","iv-drip-rate-mcg-kg-min",
        "pediatric-emergency-drug-calculator","pill-identifier-tool",
        "medication-cost-estimator",
    ]),
    ("Obstetrics & Gynecology (10)", [
        "due-date-edd-calculator","gestational-age-calculator",
        "fetal-weight-estimator","pregnancy-weight-gain-calculator",
        "ivf-success-rate-calculator","ovulation-fertile-window-calculator",
        "bishop-score-calculator","preeclampsia-risk-calculator",
        "postpartum-hemorrhage-calculator","apgar-score-calculator",
    ]),
    ("Pulmonology & Respiratory (6)", [
        "spirometry-fev1-fvc-interpreter","psi-port-pneumonia-score",
        "alveolar-arterial-gradient","pao2-fio2-ratio-ards",
        "peak-flow-calculator","pack-year-calculator",
    ]),
    ("Gastroenterology & Hepatology (6)", [
        "meld-score-calculator","child-pugh-score-calculator","saag-calculator",
        "ransons-criteria-pancreatitis","h-pylori-eradication-tracker",
        "bowel-prep-dosing-calculator",
    ]),
    ("Oncology & Hematology (8)", [
        "chemotherapy-dose-bsa-calculator","anc-absolute-neutrophil-count",
        "psa-velocity-doubling-time","tnm-staging-interpreter",
        "inr-pt-ratio-converter","ipss-mds-score",
        "blood-transfusion-volume-calculator","cancer-survival-probability",
    ]),
    ("Pediatrics & Neonatology (8)", [
        "child-growth-percentile","pediatric-bmi-for-age","fever-dose-calculator",
        "holliday-segar-maintenance-fluid","vaccine-schedule-checker",
        "corrected-gestational-age-calculator","pediatric-ett-size-depth",
        "neonatal-jaundice-bhutani",
    ]),
    ("General Health & Wellness (12)", [
        "bmi-health-calculator","calorie-deficit-calculator",
        "heart-rate-zone-calculator","daily-water-intake-calculator",
        "sleep-cycle-calculator","health-insurance-premium-estimator",
        "blood-pressure-tracker-chart","cholesterol-ratio-calculator",
        "surgery-cost-estimator","drug-rehab-cost-calculator",
        "therapy-session-cost-estimator","medication-cost-comparator",
    ]),
]
for grp_title, grp_tools in medical_groups:
    story.append(Paragraph(grp_title, H3))
    story.append(tool_table(grp_tools, cols=3))
    story.append(gap(4))

story.append(PageBreak())

# ── Engineering ──
story.append(colored_header_table("Engineering  (126 tools)", "/tools/engineering/", BRAND))
story.append(gap(3))

eng_groups = [
    ("Civil & Structural Engineering (18)", [
        "beam-deflection-calculator","concrete-mix-design","column-load-capacity",
        "retaining-wall-stability","foundation-bearing-capacity",
        "steel-section-properties","slope-stability-fos","rebar-quantity-estimator",
        "concrete-volume-calculator","wind-load-calculator","soil-bearing-pressure",
        "truss-member-force","moment-of-inertia-calculator","asphalt-pavement-thickness",
        "earthwork-cut-fill","pile-load-capacity","slab-reinforcement-designer",
        "construction-cost-estimator",
    ]),
    ("Electrical Engineering (18)", [
        "ohms-law-calculator","wire-cable-size","voltage-drop-calculator",
        "three-phase-power-calculator","transformer-sizing","motor-starting-current",
        "solar-panel-battery-sizing","led-energy-savings","circuit-breaker-sizing",
        "capacitor-bank-sizing","ups-battery-backup","power-factor-correction",
        "short-circuit-current","conduit-fill-calculator","load-schedule-panel",
        "pv-system-roi","battery-state-of-charge","earthing-grounding-resistance",
    ]),
    ("Mechanical Engineering (18)", [
        "bolt-torque-calculator","gear-ratio-calculator","hp-kw-converter",
        "pressure-vessel-thickness","fluid-flow-rate","heat-transfer-calculator",
        "pump-head-flow","spring-constant-calculator","belt-pulley-speed",
        "cnc-feeds-speeds","tolerance-stack-up","fatigue-life-estimator",
        "thermal-expansion-calculator","bearing-life-calculator",
        "stress-strain-calculator","reynolds-number-calculator",
        "vibration-frequency","hydraulic-cylinder-force",
    ]),
    ("HVAC & Building Services (10)", [
        "cooling-load-calculator","heating-load-estimator","duct-sizing-calculator",
        "psychrometric-calculator","cop-eer-calculator","u-value-r-value",
        "ventilation-rate-calculator","chilled-water-pipe-sizing",
        "boiler-efficiency-calculator","building-energy-audit",
    ]),
    ("Chemical & Process Engineering (10)", [
        "pipe-pressure-drop","orifice-plate-flow","heat-exchanger-sizing",
        "gas-compressor-power","pump-npsh-calculator","flare-stack-sizing",
        "distillation-column-estimator","gas-molecular-weight",
        "steam-table-lookup","relief-valve-sizing",
    ]),
    ("Geotechnical Engineering (8)", [
        "soil-bearing-capacity","settlement-calculator","slope-stability-bishop",
        "lateral-earth-pressure","liquefaction-potential","pile-driving-formula",
        "permeability-seepage","spt-n-value-parameters",
    ]),
    ("Water Resources & Environmental (8)", [
        "stormwater-runoff","water-demand-estimator","water-tank-sizing",
        "wastewater-flow-estimator","solar-irradiance-pv-yield",
        "engineering-carbon-footprint","flood-frequency-analysis","water-quality-index",
    ]),
    ("Electronics & PCB Design (10)", [
        "resistor-color-code","rc-filter-designer","antenna-length-calculator",
        "pcb-trace-width","timer-555-calculator","db-signal-loss",
        "op-amp-gain-calculator","led-resistor-calculator",
        "capacitor-charge-time","zener-voltage-regulator",
    ]),
    ("Aerospace & Automotive (8)", [
        "thrust-to-weight-ratio","drag-coefficient-estimator","wing-loading-calculator",
        "vehicle-fuel-economy","ev-range-calculator","engine-horsepower-estimator",
        "mach-number-converter","braking-distance-calculator",
    ]),
    ("IT Infrastructure & Cloud (10)", [
        "cloud-cost-estimator","server-rack-power-cooling","network-bandwidth-calculator",
        "api-load-calculator","database-storage-estimator","cyber-security-risk",
        "saas-pricing-ltv","cicd-pipeline-cost","docker-k8s-sizing",
        "password-entropy-calculator",
    ]),
    ("Project Management & Cost (8)", [
        "critical-path-method","boq-material-take-off","project-roi-calculator",
        "earned-value-management","labour-productivity-estimator","crane-lift-capacity",
        "contractor-markup-calculator","depreciation-calculator",
    ]),
]
for grp_title, grp_tools in eng_groups:
    story.append(Paragraph(grp_title, H3))
    story.append(tool_table(grp_tools, cols=3))
    story.append(gap(4))

story.append(gap(8))

# ── Remaining categories ──
remaining_cats = [
    ("Image Tools  (38)", colors.HexColor("#ec4899"), "/tools/image-tools/", [
        "image-compressor","background-remover","image-resizer","image-converter",
        "passport-photo-maker","image-cropper","bulk-image-resizer","image-upscaler",
        "dpi-converter","pixel-density-calculator","background-changer",
        "white-background-maker","heic-to-jpg","png-to-jpg","jpg-to-png",
        "image-to-base64","base64-to-image","image-enhancer","image-colorizer",
        "blur-background","add-watermark","remove-watermark","image-flipper-rotator",
        "grayscale-converter","add-border","round-corner-image","image-metadata-viewer",
        "image-color-picker","dominant-color-extractor","image-size-checker",
        "meme-generator","photo-to-cartoon","id-card-photo-maker","thumbnail-maker",
        "photo-collage-maker","gif-maker","screenshot-to-pdf","image-to-text",
    ]),
    ("Developer Tools  (19)", GRAY_700, "/tools/developer/", [
        "json-formatter","base64-encoder","regex-tester","css-minifier","js-beautifier",
        "uuid-generator","hash-generator","color-picker","url-encoder","html-encoder",
        "jwt-decoder","cron-parser","sql-formatter","xml-formatter","yaml-validator",
        "markdown-editor","diff-checker","chmod-calculator","timestamp-converter",
    ]),
    ("Document Tools  (9)", VIOLET, "/tools/document-tools/", [
        "invoice-generator","resume-builder","cover-letter-builder","business-letter",
        "meeting-minutes","expense-report","proposal-generator","reference-letter",
        "contract-creator",
    ]),
    ("Text Tools  (10)", AMBER, "/tools/text/", [
        "word-counter","case-converter","lorem-ipsum-generator","text-summarizer",
        "grammar-checker","readability-score","text-to-speech",
        "remove-duplicate-lines","text-reverser","find-replace",
    ]),
    ("Network Tools  (7)", SKY, "/tools/network/", [
        "ip-checker","dns-lookup","whois-lookup","port-checker",
        "ping-tool","http-headers-checker","website-speed-test",
    ]),
    ("Security Tools  (8)", EMERALD, "/tools/security/", [
        "qr-code-generator","password-generator","url-shortener","temporary-email",
        "file-encryptor","vpn-checker","ssl-checker","metadata-remover",
    ]),
    ("Unit Converters  (8)", colors.HexColor("#14b8a6"), "/tools/converters/", [
        "temperature-converter","length-converter","weight-converter","area-converter",
        "volume-converter","speed-converter","time-converter","digital-storage-converter",
    ]),
    ("Legal Tools  (8)", colors.HexColor("#ca8a04"), "/tools/legal-tools/", [
        "privacy-policy-generator","terms-of-service-generator","nda-generator",
        "lease-agreement-generator","employment-contract-generator","will-generator",
        "power-of-attorney-generator","cease-and-desist-generator",
    ]),
    ("Real Estate  (8)", colors.HexColor("#ea580c"), "/tools/real-estate/", [
        "rent-vs-buy-calculator","home-affordability-calculator",
        "property-tax-calculator","closing-costs-calculator",
        "cap-rate-calculator","rental-yield-calculator",
        "home-value-estimator","down-payment-calculator",
    ]),
    ("Business Tools  (6)", VIOLET, "/tools/business/", [
        "sales-copy-ai","ad-creative-generator","social-media-scheduler",
        "email-marketing-ai","landing-page-builder","seo-optimizer",
    ]),
    ("Environment Tools  (6)", EMERALD, "/tools/environment/", [
        "solar-savings-calculator","home-energy-audit","ev-carbon-offset",
        "flight-carbon-calculator","carbon-footprint-calculator","waste-reduction-planner",
    ]),
]
for title, color, route, tools in remaining_cats:
    story.append(colored_header_table(title, route, color))
    story.append(tool_table(tools, cols=3))
    story.append(gap(8))

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 5 — COMPLETION AUDIT
# ═══════════════════════════════════════════════════════════════════════════════
story += section_header("5. Project Completion Audit", AMBER, "")

# Overall progress table
prog_data = [[
    Paragraph("Layer", S("ph", fontSize=8.5, fontName="Helvetica-Bold", textColor=WHITE)),
    Paragraph("Status", S("ph", fontSize=8.5, fontName="Helvetica-Bold", textColor=WHITE)),
    Paragraph("Done", S("ph", fontSize=8.5, fontName="Helvetica-Bold", textColor=WHITE, alignment=TA_CENTER)),
    Paragraph("Notes", S("ph", fontSize=8.5, fontName="Helvetica-Bold", textColor=WHITE)),
]]
progress = [
    ("Infrastructure & DevOps",     "100%",  GREEN_DOT, "Turborepo, pnpm, Docker, ESLint, Prettier, Husky"),
    ("Database Schema",             "100%",  GREEN_DOT, "22 Prisma models, migrations ready"),
    ("Backend API Routes",          "85%",   colors.HexColor("#22c55e"), "Auth, Billing, PDF, Calculators, Network done"),
    ("Home Page",                   "100%",  GREEN_DOT, "Hero, Ticker, Categories, Features, Trust strip"),
    ("Category Hub Pages (15)",     "100%",  GREEN_DOT, "All 15 category pages complete"),
    ("PDF Tools (26)",              "100%",  GREEN_DOT, "Dynamic routing + 29 configs"),
    ("Calculators (21)",            "100%",  GREEN_DOT, "Individual pages + client components"),
    ("Developer Tools (19)",        "100%",  GREEN_DOT, "Individual pages + client components"),
    ("Image Tools (38)",            "100%",  GREEN_DOT, "Individual pages + client components"),
    ("Text Tools (10)",             "100%",  GREEN_DOT, "Individual pages + client components"),
    ("Unit Converters (8)",         "100%",  GREEN_DOT, "Individual pages + client components"),
    ("Security Tools (8)",          "100%",  GREEN_DOT, "Individual pages + client components"),
    ("Legal Tools (8)",             "100%",  GREEN_DOT, "Individual pages + client components"),
    ("Real Estate (8)",             "100%",  GREEN_DOT, "Individual pages + client components"),
    ("Network Tools (7)",           "100%",  GREEN_DOT, "Individual pages + client components"),
    ("Business Tools (6)",          "100%",  GREEN_DOT, "Individual pages + client components"),
    ("Environment Tools (6)",       "100%",  GREEN_DOT, "Individual pages + client components"),
    ("Document Tools (9)",          "100%",  GREEN_DOT, "Individual pages + templates"),
    ("SEO (sitemaps, OG, JSON-LD)", "100%",  GREEN_DOT, "8 sitemaps, robots.txt, OG images"),
    ("Auth / Dashboard / Profile",  "100%",  GREEN_DOT, "Sign in, sign up, dashboard, settings"),
    ("Analytics / Monitoring",      "100%",  GREEN_DOT, "GA4, Clarity, AdSense, Sentry, WebVitals"),
    ("Makefile",                    "100%",  GREEN_DOT, "40+ commands: dev, build, db, docker, deploy"),
    ("Engineering Configs (126)",   "17%",   RED_DOT,   "22/126 done — 104 calculation functions needed"),
    ("Medical Configs (113)",       "22%",   RED_DOT,   "25/113 done — 88 calculation functions needed"),
    ("Stripe Billing",              "60%",   YELLOW_DOT,"Code done, needs real PRICE_ID env vars"),
    ("Email Templates (Resend)",    "20%",   YELLOW_DOT,"Route exists, email templates not built"),
    ("Admin Panel",                 "10%",   RED_DOT,   "Only analytics page — no user/content mgmt"),
    ("Blog CMS",                    "30%",   YELLOW_DOT,"Structure ready, no content pipeline"),
    ("AI Tool Backends",            "30%",   YELLOW_DOT,"UI done, API connections incomplete"),
    ("Image Processing (AI)",       "25%",   YELLOW_DOT,"UI done, AI service not connected"),
]
for layer, pct, dot_color, notes in progress:
    prog_data.append([
        Paragraph(layer, BODY_SM),
        Table([[""]], colWidths=[0.6*cm],
              style=TableStyle([("BACKGROUND",(0,0),(-1,-1), dot_color),
                                ("TOPPADDING",(0,0),(-1,-1),5),
                                ("BOTTOMPADDING",(0,0),(-1,-1),5)])),
        Paragraph(pct, S("pct", fontSize=8.5, fontName="Helvetica-Bold",
                          textColor=dot_color, alignment=TA_CENTER)),
        Paragraph(notes, BODY_SM),
    ])

pt = Table(prog_data, colWidths=[5.5*cm, 0.8*cm, 1.4*cm, 8.8*cm])
pt.setStyle(TableStyle([
    ("BACKGROUND",    (0,0), (-1,0), DARK_BG),
    ("ROWBACKGROUNDS",(0,1), (-1,-1), [WHITE, GRAY_100]),
    ("BOX",           (0,0), (-1,-1), 0.5, GRAY_200),
    ("INNERGRID",     (0,0), (-1,-1), 0.3, GRAY_200),
    ("TOPPADDING",    (0,0), (-1,-1), 3),
    ("BOTTOMPADDING", (0,0), (-1,-1), 3),
    ("LEFTPADDING",   (0,0), (-1,-1), 5),
    ("RIGHTPADDING",  (0,0), (-1,-1), 5),
    ("VALIGN",        (0,0), (-1,-1), "MIDDLE"),
    ("ALIGN",         (1,0), (2,-1), "CENTER"),
]))
story.append(pt)
story.append(gap(12))

# Completed section
story.append(sub_header("Completed Items (DONE)"))
done_items = [
    "Full monorepo infrastructure: Turborepo, pnpm workspaces, ESLint, Prettier, Husky pre-commit hooks",
    "22-model Prisma database schema (User, Session, Tool, Blog, Analytics, Billing, Referral, ApiKey, ShortLink...)",
    "Redis cache layer + BullMQ queue setup",
    "Sentry error monitoring + Google Analytics + Microsoft Clarity + AdSense",
    "Complete Next.js home page: hero with animated orbs, marquee ticker, category bento grid, features, popular tools, trust strip",
    "All 15 category hub pages with CategoryHubLayout server component",
    "SiteHeader: sticky/transparent→glass-on-scroll, hamburger drawer with 15 categories + accordion",
    "Footer: brand column, categories, popular tools, company links, trust badges",
    "SearchBar, Breadcrumbs, RelatedTools, ToolCard, CategoryGrid components",
    "AI Chatbot (lazy loaded, client-only), Cookie Consent banner",
    "Sign in / Sign up pages, Dashboard (API keys + referral), Profile, Settings",
    "Pricing page, About, Contact, Blog (list + [slug]), API Docs",
    "Admin analytics page, Billing success page, Embed Generator",
    "SEO: 8 sitemap files, robots.ts, OpenGraph image generators, JSON-LD structured data",
    "Loading skeletons for all major routes",
    "PDF Tools: 26 tools — 100% complete with dynamic [pdfTool] routing + 29 configs",
    "Calculators: 21 tools — 100% complete (individual pages + client components)",
    "Developer Tools: 19 tools — 100% complete",
    "Image Tools: 38 tools — 100% complete",
    "Text Tools: 10 tools — 100% complete",
    "Unit Converters: 8 tools — 100% complete",
    "Security Tools: 8 tools — 100% complete",
    "Legal Tools: 8 tools — 100% complete",
    "Real Estate: 8 tools — 100% complete",
    "Network Tools: 7 tools — 100% complete",
    "Business Tools: 6 tools — 100% complete",
    "Environment Tools: 6 tools — 100% complete",
    "Document Tools: 9 tools — 100% complete",
    "Express API: auth routes (register/login/JWT/sessions), billing routes (Stripe), PDF processing (20 routes via Gotenberg)",
    "API: calculator routes, developer routes, URL shortener, temp email, SSL checker, IP checker",
    "API: rate limiting, CSRF protection, sanitizer, security headers, error handler middleware",
    "Stripe billing integration (checkout + webhook routes)",
    "JWT authentication system with bcrypt password hashing",
    "Makefile: 40+ commands covering dev, build, lint, test, database, docker, deploy",
]
for item in done_items:
    story.append(Paragraph(f"[DONE]  {item}", STATUS_DONE))

story.append(gap(10))
story.append(sub_header("Remaining Items (TODO)"))

todo_items = [
    "[ENG-CONFIGS]  Engineering calc functions: 104/126 missing — Civil/Structural (17), Mechanical (17), HVAC (9), Chemical (9), Geotechnical (8), Water Resources (7), Electronics (7), Aerospace (6), IT Infra (9), Project Management (8)",
    "[MED-CONFIGS]  Medical calc functions: 88/113 missing — Cardiology (11), Nephrology (9), Critical Care (10), Psychiatry (8), Endocrinology (7), Pharmacology (12), OB/GYN (9), Pulmonology (6), Gastroenterology (5), Oncology (7), Pediatrics (7), Wellness (11)",
    "[ADMIN]  Admin panel: user management, content management, tool moderation, blog CMS",
    "[EMAIL]  Email templates via Resend: welcome email, password reset, email verification, newsletter",
    "[AI-TOOLS]  Wire AI-powered tools to backend: grammar checker, text summarizer, business AI tools",
    "[IMAGE-AI]  Connect image processing tools to AI service: background remover, upscaler, colorizer",
    "[BILLING]  Configure real Stripe PRICE_IDs, test full checkout + webhook flow in production",
    "[BLOG-CMS]  Build blog content pipeline / CMS for managing posts",
    "[DOC-GEN]  Complete PDF export logic for document generators (resume, invoice, contracts)",
]
for item in todo_items:
    story.append(Paragraph(item, STATUS_TODO))

story.append(gap(10))
story.append(sub_header("Partially Done"))
wip_items = [
    "[STRIPE]  Code complete, needs real PRICE_ID env vars and production test",
    "[EMAIL]   Resend route exists, email HTML templates not yet built",
    "[ADMIN]   Only 1 analytics page exists, no full admin dashboard",
    "[BLOG]    Structure + [slug] routing ready, no CMS or content pipeline",
    "[AI-UI]   All AI tool UIs built, backend connections incomplete",
]
for item in wip_items:
    story.append(Paragraph(item, STATUS_WIP))

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 6 — PRIORITY NEXT STEPS
# ═══════════════════════════════════════════════════════════════════════════════
story += section_header("6. Priority Next Steps", SKY, "")

steps = [
    ("1", "Engineering Configs (HIGH PRIORITY)",
     "Write 104 missing calculation functions in apps/web/src/app/tools/engineering/_components/engineering-configs.ts. Each config needs: name, description, icon, formula, reference, inputs[], outputs[], and calculate() function. Subcategories: Civil/Structural, Mechanical, HVAC, Chemical, Geotechnical, Water Resources, Electronics, Aerospace, IT Infrastructure, Project Management."),
    ("2", "Medical Configs (HIGH PRIORITY)",
     "Write 88 missing calculation functions in apps/web/src/app/tools/medical/_components/medical-configs.ts. Each config needs the same structure. Subcategories: Cardiology, Nephrology, Critical Care, Psychiatry, Endocrinology, Pharmacology, OB/GYN, Pulmonology, Gastroenterology, Oncology, Pediatrics, General Wellness."),
    ("3", "Admin Panel",
     "Build admin pages: user management (list/search/ban), tool management (DRAFT/PUBLISHED/ARCHIVED status), blog CMS (create/edit/publish posts), tool request moderation, analytics dashboard with charts."),
    ("4", "Email Templates",
     "Build Resend email HTML templates: welcome email, email verification, password reset, newsletter subscription confirmation, billing receipts. Add to API email routes."),
    ("5", "AI Tool Backends",
     "Connect grammar checker, text summarizer, text-to-speech, and business AI tools (sales copy, ad creative, SEO optimizer) to Claude API or OpenAI API in apps/api."),
    ("6", "Image Processing AI",
     "Integrate AI service for: background remover, image upscaler, image colorizer, photo-to-cartoon. Options: remove.bg API, Replicate.com, or Cloudinary AI transformations."),
    ("7", "Stripe Go-Live",
     "Set STRIPE_PRICE_PRO, STRIPE_PRICE_TEAM, STRIPE_PRICE_API with real Stripe price IDs. Test checkout flow end-to-end. Configure webhook endpoint in Stripe dashboard. Test subscription lifecycle."),
    ("8", "Blog CMS",
     "Build blog content management: markdown editor in admin, image upload to S3, publish/draft workflow, tags management, RSS feed generation."),
]
for num, title, desc in steps:
    data = [[
        Paragraph(num, S("snum", fontSize=18, fontName="Helvetica-Bold",
                          textColor=BRAND, alignment=TA_CENTER)),
        [Paragraph(title, H3), gap(2), Paragraph(desc, BODY_SM)],
    ]]
    t = Table(data, colWidths=[1.2*cm, 15.3*cm])
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,-1), GRAY_100),
        ("BOX",           (0,0), (-1,-1), 0.5, GRAY_200),
        ("TOPPADDING",    (0,0), (-1,-1), 6),
        ("BOTTOMPADDING", (0,0), (-1,-1), 6),
        ("LEFTPADDING",   (0,0), (-1,-1), 8),
        ("RIGHTPADDING",  (0,0), (-1,-1), 8),
        ("VALIGN",        (0,0), (-1,-1), "TOP"),
        ("BACKGROUND",    (0,0), (0,-1), colors.HexColor("#eef2ff")),
    ]))
    story.append(t)
    story.append(gap(6))

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 7 — ENVIRONMENT VARIABLES
# ═══════════════════════════════════════════════════════════════════════════════
story += section_header("7. Environment Variables", VIOLET, "")
story.append(body("Copy .env.example to .env and fill in real values. Run 'make env-check' to validate."))
story.append(gap(6))

env_groups = [
    ("Database", [
        ("DATABASE_URL",          "postgresql://user:pass@localhost:5432/toolverse"),
        ("DATABASE_URL_DIRECT",   "postgresql://user:pass@localhost:5432/toolverse"),
        ("POSTGRES_USER",         "toolverse"),
        ("POSTGRES_PASSWORD",     "changeme"),
        ("POSTGRES_DB",           "toolverse"),
    ]),
    ("Redis", [
        ("REDIS_URL",             "redis://localhost:6379"),
        ("REDIS_PASSWORD",        "(empty for local)"),
    ]),
    ("App", [
        ("NODE_ENV",              "development | production"),
        ("PORT",                  "4000"),
        ("CORS_ORIGIN",           "http://localhost:3000"),
        ("SITE_URL",              "https://roughtools.com"),
        ("NEXT_PUBLIC_API_URL",   "http://localhost:4000"),
        ("NEXT_PUBLIC_APP_URL",   "http://localhost:3000"),
    ]),
    ("Auth", [
        ("JWT_SECRET",            "Random 256-bit secret"),
        ("JWT_EXPIRES_IN",        "7d"),
        ("BCRYPT_ROUNDS",         "12"),
        ("CSRF_SECRET",           "Random secret"),
        ("NEXTAUTH_SECRET",       "Random secret"),
        ("NEXTAUTH_URL",          "http://localhost:3000"),
    ]),
    ("Email (Resend)", [
        ("RESEND_API_KEY",        "re_xxxxxxxxxxxxxxxxxxxx"),
        ("EMAIL_FROM",            "hello@roughtools.com"),
        ("SUPPORT_EMAIL",         "support@roughtools.com"),
    ]),
    ("Stripe Billing", [
        ("STRIPE_SECRET_KEY",     "sk_test_xxx or sk_live_xxx"),
        ("STRIPE_PUBLISHABLE_KEY","pk_test_xxx or pk_live_xxx"),
        ("STRIPE_WEBHOOK_SECRET", "whsec_xxx"),
        ("STRIPE_PRICE_PRO",      "price_xxx (Pro plan)"),
        ("STRIPE_PRICE_TEAM",     "price_xxx (Team plan)"),
        ("STRIPE_PRICE_API",      "price_xxx (API plan)"),
    ]),
    ("Monitoring & Analytics", [
        ("SENTRY_DSN",                        "https://xxx@xxx.ingest.sentry.io/xxx"),
        ("NEXT_PUBLIC_GA_MEASUREMENT_ID",     "G-XXXXXXXXXX"),
        ("NEXT_PUBLIC_GSC_VERIFICATION_TOKEN","(Google Search Console token)"),
        ("NEXT_PUBLIC_ADSENSE_CLIENT",        "ca-pub-XXXXXXXXXXXXXXXX"),
        ("NEXT_PUBLIC_CLARITY_PROJECT_ID",    "XXXXXXXXXX"),
    ]),
    ("Storage (AWS S3)", [
        ("S3_BUCKET",             "roughtools-uploads"),
        ("AWS_ACCESS_KEY_ID",     "AKIAXXXXXXXXXXXXXXXX"),
        ("AWS_SECRET_ACCESS_KEY", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"),
        ("AWS_REGION",            "us-east-1"),
    ]),
    ("PDF Processing", [
        ("GOTENBERG_URL",         "http://localhost:3030"),
        ("ILOVEPDF_API_KEY",      "(optional fallback)"),
    ]),
    ("Internal / Security", [
        ("IP_HASH_SECRET",        "32+ char random string"),
        ("ADMIN_API_KEY",         "Long random string for admin API"),
    ]),
]

for group_name, vars_list in env_groups:
    story.append(sub2(group_name))
    data = []
    for var, example in vars_list:
        data.append([
            Paragraph(var, S("ev", fontSize=7.5, fontName="Courier-Bold", textColor=BRAND_DARK)),
            Paragraph(example, S("evv", fontSize=7.5, fontName="Courier", textColor=GRAY_700)),
        ])
    t = Table(data, colWidths=[6.5*cm, 10*cm])
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,-1), GRAY_100),
        ("BOX",           (0,0), (-1,-1), 0.4, GRAY_200),
        ("INNERGRID",     (0,0), (-1,-1), 0.3, GRAY_200),
        ("TOPPADDING",    (0,0), (-1,-1), 3),
        ("BOTTOMPADDING", (0,0), (-1,-1), 3),
        ("LEFTPADDING",   (0,0), (-1,-1), 6),
        ("RIGHTPADDING",  (0,0), (-1,-1), 6),
        ("VALIGN",        (0,0), (-1,-1), "TOP"),
    ]))
    story.append(t)
    story.append(gap(6))

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 8 — MAKEFILE COMMANDS
# ═══════════════════════════════════════════════════════════════════════════════
story += section_header("8. Makefile Commands (40+)", EMERALD, "")

make_groups = [
    ("Setup & Install", [
        ("make setup",          "Full first-time setup (env + install + docker + db + seed)"),
        ("make install",        "Install all pnpm dependencies"),
        ("make install-frozen", "Install with frozen lockfile (for CI)"),
        ("make env-setup",      "Copy .env.example to .env"),
        ("make env-check",      "Validate all required env vars are set"),
    ]),
    ("Development", [
        ("make dev",       "Start web + api in parallel"),
        ("make dev-web",   "Start Next.js web app only (port 3000)"),
        ("make dev-api",   "Start Express API only (port 4000)"),
        ("make dev-full",  "Start Docker services + all apps"),
    ]),
    ("Build", [
        ("make build",          "Build all apps via Turborepo"),
        ("make build-web",      "Build Next.js app"),
        ("make build-api",      "Build Express API"),
        ("make build-packages", "Build all shared packages"),
    ]),
    ("Lint, Format & Types", [
        ("make lint",         "Lint all apps and packages"),
        ("make lint-fix",     "Auto-fix lint issues"),
        ("make format",       "Format with Prettier"),
        ("make format-check", "Check formatting without writing"),
        ("make type-check",   "TypeScript type checks across monorepo"),
    ]),
    ("Testing", [
        ("make test",          "Run all tests"),
        ("make test-watch",    "Run tests in watch mode"),
        ("make test-coverage", "Run tests with coverage report"),
    ]),
    ("Database", [
        ("make db-generate",      "Generate Prisma client from schema"),
        ("make db-push",          "Push schema to DB without migration (dev only)"),
        ("make db-migrate",       "Create + apply new migration (prompts for name)"),
        ("make db-migrate-prod",  "Apply pending migrations (production)"),
        ("make db-seed",          "Seed the database"),
        ("make db-reset",         "Reset + re-seed (DESTRUCTIVE — dev only)"),
        ("make db-studio",        "Open Prisma Studio GUI at localhost:5555"),
        ("make db-status",        "Show pending migrations"),
    ]),
    ("Docker", [
        ("make docker-up",      "Start PostgreSQL + Redis + Gotenberg"),
        ("make docker-down",    "Stop all Docker services"),
        ("make docker-logs",    "Tail Docker service logs"),
        ("make docker-rebuild", "Rebuild Docker images from scratch"),
        ("make docker-ps",      "Show running containers"),
        ("make docker-db",      "Connect to PostgreSQL via psql"),
        ("make docker-redis",   "Connect to Redis CLI"),
    ]),
    ("Clean", [
        ("make clean",       "Remove .next + dist build artifacts"),
        ("make clean-all",   "Remove node_modules + .turbo + all build output"),
        ("make clean-cache", "Clear Turborepo cache only"),
    ]),
    ("Deploy & Health", [
        ("make deploy-web",         "Deploy web app to Vercel (production)"),
        ("make deploy-web-preview", "Deploy preview to Vercel"),
        ("make health",             "Check web + API health endpoints"),
        ("make health-web",         "Check http://localhost:3000/api/health"),
        ("make health-api",         "Check http://localhost:4000/health"),
    ]),
    ("Audit & CI", [
        ("make audit",        "Run pnpm security audit"),
        ("make audit-fix",    "Auto-fix security vulnerabilities"),
        ("make deps-outdated","Show outdated dependencies"),
        ("make ci",           "Full CI pipeline: lint + types + test + build"),
        ("make reset",        "Full project reset: clean + reinstall + setup"),
    ]),
]

for group_name, cmds in make_groups:
    story.append(sub2(group_name))
    data = []
    for cmd, desc in cmds:
        data.append([
            Paragraph(cmd, S("mk", fontSize=8, fontName="Courier-Bold", textColor=BRAND_DARK)),
            Paragraph(desc, BODY_SM),
        ])
    t = Table(data, colWidths=[5.5*cm, 11*cm])
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,-1), GRAY_100),
        ("BACKGROUND",    (0,0), (0,-1), colors.HexColor("#eef2ff")),
        ("BOX",           (0,0), (-1,-1), 0.4, GRAY_200),
        ("INNERGRID",     (0,0), (-1,-1), 0.3, GRAY_200),
        ("TOPPADDING",    (0,0), (-1,-1), 3),
        ("BOTTOMPADDING", (0,0), (-1,-1), 3),
        ("LEFTPADDING",   (0,0), (-1,-1), 5),
        ("RIGHTPADDING",  (0,0), (-1,-1), 5),
        ("VALIGN",        (0,0), (-1,-1), "TOP"),
    ]))
    story.append(t)
    story.append(gap(6))

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 9 — BUILD OUTPUT & PERFORMANCE
# ═══════════════════════════════════════════════════════════════════════════════
story += section_header("9. Build Output & Performance", ROSE, "")

story.append(info_box([
    ("Total Pages",     "707 static pages (SSG — all pre-rendered at build time)"),
    ("Homepage JS",     "~92kB first load JavaScript"),
    ("Tool Pages JS",   "~93–103kB first load JavaScript"),
    ("Shared Chunk",    "87.7kB shared JS chunk"),
    ("Build Type",      "Static Site Generation (SSG) — no server-side rendering"),
    ("CDN Headers",     "s-maxage=86400 + stale-while-revalidate=604800 on /tools/* routes"),
    ("Font",            "Inter only (Syne, DM_Sans, DM_Mono removed)"),
    ("Lazy Loading",    "Chatbot + CookieConsent dynamically imported (ssr: false)"),
    ("Image Opt",       "next/image with OptimizedImage.tsx wrapper"),
    ("Code Splitting",  "Turborepo + Next.js automatic code splitting"),
]))

story.append(gap(10))
story.append(sub_header("Performance Optimizations Applied"))
perf = [
    "Removed unused fonts (Syne, DM_Sans, DM_Mono) — only Inter remains",
    "Chatbot lazy loaded (dynamic import, ssr: false) — not in initial bundle",
    "CookieConsent lazy loaded (dynamic import, ssr: false)",
    "CategoryHubLayout converted to server component (no 'use client') — reduces client JS",
    "Console.log stripped in production (next.config.ts compiler.removeConsole)",
    "CDN cache headers on /tools/* routes (s-maxage=86400, stale-while-revalidate=604800)",
    "Loading skeletons on all major routes (prevents layout shift)",
    "LazySection component uses IntersectionObserver for below-fold content",
    "OptimizedImage.tsx wraps next/image for consistent loading behavior",
    "JSON-LD structured data injected server-side (not blocking client render)",
]
for item in perf:
    story.append(Paragraph(f"  {item}", BULLET))

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 10 — SOCIAL & CONTACT
# ═══════════════════════════════════════════════════════════════════════════════
story += section_header("10. Social Links & Contact", GRAY_700, "")

story.append(info_box([
    ("Twitter/X",   "https://x.com/roughtools"),
    ("GitHub",      "https://github.com/roughtools"),
    ("Instagram",   "https://instagram.com/roughtools"),
    ("LinkedIn",    "https://linkedin.com/company/roughtools"),
    ("Email",       "shahidwattoo0111@gmail.com"),
    ("Site",        "https://roughtools.com"),
]))

# ─── Final page ───────────────────────────────────────────────────────────────
story.append(Spacer(1, 1.5*cm))
story.append(hr(BRAND, 1.5))
story.append(gap(8))
story.append(Paragraph("ROUGHTOOLS.COM — Project Documentation", S("ft", fontSize=10,
    fontName="Helvetica-Bold", textColor=GRAY_900, alignment=TA_CENTER)))
story.append(Paragraph(f"Generated {datetime.now().strftime('%B %d, %Y')}  |  405 Tools  |  15 Categories  |  ~70% Complete",
    S("ft2", fontSize=8, fontName="Helvetica", textColor=GRAY_500, alignment=TA_CENTER)))

# ─── Build ────────────────────────────────────────────────────────────────────
print("Building PDF...")
doc.build(story, onFirstPage=cover_page_bg, onLaterPages=normal_page)
print(f"PDF saved to: {OUTPUT}")
