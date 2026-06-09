import html as html_mod
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, KeepTogether
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from datetime import date

OUTPUT = "RoughTools_Website_Audit_2026-05-30.pdf"

# ── Colour palette ────────────────────────────────────────────────────────────
RED    = colors.HexColor("#C0392B")
ORANGE = colors.HexColor("#E67E22")
YELLOW = colors.HexColor("#F1C40F")
GREEN  = colors.HexColor("#27AE60")
BLUE   = colors.HexColor("#2980B9")
DARK   = colors.HexColor("#1A1A2E")
GRAY   = colors.HexColor("#7F8C8D")
LIGHT  = colors.HexColor("#ECF0F1")
WHITE  = colors.white

SEV_COLORS = {
    "CRITICAL": RED,
    "HIGH":     ORANGE,
    "MEDIUM":   YELLOW,
    "LOW":      GREEN,
}
SEV_TEXT = {
    "CRITICAL": WHITE,
    "HIGH":     WHITE,
    "MEDIUM":   DARK,
    "LOW":      WHITE,
}

# ── Styles ────────────────────────────────────────────────────────────────────
styles = getSampleStyleSheet()

def S(name, **kw):
    return ParagraphStyle(name, **kw)

title_style = S("Title2",
    fontName="Helvetica-Bold", fontSize=22, textColor=WHITE,
    alignment=TA_CENTER, spaceAfter=6)

subtitle_style = S("Sub",
    fontName="Helvetica", fontSize=11, textColor=LIGHT,
    alignment=TA_CENTER, spaceAfter=4)

h1 = S("H1",
    fontName="Helvetica-Bold", fontSize=14, textColor=DARK,
    spaceBefore=18, spaceAfter=6, leading=18)

h2 = S("H2",
    fontName="Helvetica-Bold", fontSize=11, textColor=DARK,
    spaceBefore=10, spaceAfter=4)

body = S("Body2",
    fontName="Helvetica", fontSize=9, textColor=DARK,
    spaceAfter=4, leading=13)

mono = S("Mono",
    fontName="Courier", fontSize=8, textColor=DARK,
    spaceAfter=3, leading=11)

caption = S("Caption",
    fontName="Helvetica-Oblique", fontSize=8, textColor=GRAY,
    spaceAfter=2)

label_style = S("Label",
    fontName="Helvetica-Bold", fontSize=8, textColor=WHITE,
    alignment=TA_CENTER)

# ── Helpers ───────────────────────────────────────────────────────────────────
def sev_badge(sev):
    bg = SEV_COLORS.get(sev, GRAY)
    fg = SEV_TEXT.get(sev, WHITE)
    return Table(
        [[Paragraph(sev, S("b", fontName="Helvetica-Bold", fontSize=7,
                           textColor=fg, alignment=TA_CENTER))]],
        colWidths=[1.8*cm], rowHeights=[0.45*cm],
        style=TableStyle([
            ("BACKGROUND", (0,0), (-1,-1), bg),
            ("ALIGN",      (0,0), (-1,-1), "CENTER"),
            ("VALIGN",     (0,0), (-1,-1), "MIDDLE"),
            ("ROUNDEDCORNERS", [3]),
        ])
    )

def rule(color=LIGHT, thickness=1):
    return HRFlowable(width="100%", thickness=thickness,
                      color=color, spaceAfter=6, spaceBefore=2)

def esc(text):
    return html_mod.escape(text)

def finding_row(num, sev, area, file_ref, issue):
    bg = SEV_COLORS.get(sev, GRAY)
    fg = SEV_TEXT.get(sev, WHITE)
    num_p   = Paragraph(f"<b>{esc(num)}</b>",
                        S("n", fontName="Helvetica-Bold", fontSize=8,
                          textColor=DARK, alignment=TA_CENTER))
    sev_p   = Paragraph(esc(sev),
                        S("s", fontName="Helvetica-Bold", fontSize=7,
                          textColor=fg, alignment=TA_CENTER))
    area_p  = Paragraph(esc(area),
                        S("a", fontName="Helvetica-Bold", fontSize=8,
                          textColor=DARK))
    file_p  = Paragraph(f"<font name='Courier' size='7'>{esc(file_ref)}</font>",
                        S("f", fontName="Courier", fontSize=7, textColor=BLUE))
    issue_p = Paragraph(esc(issue),
                        S("i", fontName="Helvetica", fontSize=8,
                          textColor=DARK, leading=11))
    return [num_p, sev_p, area_p, file_p, issue_p]

def section_table(rows):
    col_w = [0.8*cm, 1.9*cm, 2.0*cm, 4.8*cm, 8.5*cm]
    header = [
        Paragraph("<b>#</b>",     S("th", fontName="Helvetica-Bold", fontSize=8, textColor=WHITE, alignment=TA_CENTER)),
        Paragraph("<b>Severity</b>", S("th", fontName="Helvetica-Bold", fontSize=8, textColor=WHITE)),
        Paragraph("<b>Area</b>",  S("th", fontName="Helvetica-Bold", fontSize=8, textColor=WHITE)),
        Paragraph("<b>File</b>",  S("th", fontName="Helvetica-Bold", fontSize=8, textColor=WHITE)),
        Paragraph("<b>Issue</b>", S("th", fontName="Helvetica-Bold", fontSize=8, textColor=WHITE)),
    ]
    data = [header] + rows
    style = TableStyle([
        ("BACKGROUND",  (0,0), (-1,0),  DARK),
        ("ROWBACKGROUNDS", (0,1), (-1,-1), [WHITE, LIGHT]),
        ("ALIGN",       (0,0), (1,-1),  "CENTER"),
        ("VALIGN",      (0,0), (-1,-1), "TOP"),
        ("GRID",        (0,0), (-1,-1), 0.3, colors.HexColor("#BDC3C7")),
        ("TOPPADDING",  (0,0), (-1,-1), 4),
        ("BOTTOMPADDING",(0,0),(-1,-1), 4),
        ("LEFTPADDING", (0,0), (-1,-1), 4),
        ("RIGHTPADDING",(0,0), (-1,-1), 4),
    ])
    # colour sev column per row
    for i, row in enumerate(rows, start=1):
        sev_text = row[1].text if hasattr(row[1], "text") else ""
        # extract sev from paragraph
        raw = rows[i-1][1]
        # get plain text from paragraph
        from reportlab.platypus import Paragraph as P
        import re
        plain = re.sub(r'<[^>]+>', '', raw.text if hasattr(raw,'text') else '')
        sev_key = plain.strip()
        bg = SEV_COLORS.get(sev_key, GRAY)
        fg = SEV_TEXT.get(sev_key, WHITE)
        style.add("BACKGROUND", (1,i), (1,i), bg)
        style.add("TEXTCOLOR",  (1,i), (1,i), fg)
    return Table(data, colWidths=col_w, style=style, repeatRows=1)

# ── Content data ──────────────────────────────────────────────────────────────
critical_rows = [
    finding_row("C1","CRITICAL","Frontend","api/auth/register/route.ts:18",
        "Plaintext passwords stored in DB. Field named passwordHash stores raw string — no bcrypt/argon2 call."),
    finding_row("C2","CRITICAL","API","middleware/requireAuth.ts:19",
        "Hardcoded JWT fallback 'change-this-secret-in-production'. Any env where JWT_SECRET is unset allows forged JWTs for any user/admin."),
    finding_row("C3","CRITICAL","Frontend","middleware.ts:5-11",
        "Admin auth via plain cookie string compare (timing-unsafe). No server-side guard inside admin/analytics page."),
    finding_row("C4","CRITICAL","API","middleware/csrfProtection.ts:36",
        "CSRF bypass via any X-Api-Key header value — presence (not validity) skips CSRF on all state-mutating routes including /api/billing and /api/gdpr/delete."),
    finding_row("C5","CRITICAL","API","routes/billing.ts:64",
        "Attacker-supplied Stripe customerId accepted without ownership check. Any authenticated user can open billing portal for another user's payment methods."),
    finding_row("C6","CRITICAL","API","routes/referral.ts:44",
        "Unauthenticated referral apply endpoint. Caller supplies arbitrary newUserId — anyone claims rewards for any account."),
    finding_row("C7","CRITICAL","API","routes/api-keys.ts:52-53",
        "Race condition on API key cap. count() + create() not atomic — 10 concurrent requests bypass the 10-key limit."),
    finding_row("C8","CRITICAL","Frontend","api/auth/register/route.ts",
        "No rate limiting on registration — unlimited account creation; 409 response confirms email existence."),
]

high_rows = [
    finding_row("H1","HIGH","Frontend","MarkdownEditorClient.tsx:18",
        "XSS via unsanitized Markdown. [click](javascript:alert(1)) renders as executable <a href> via dangerouslySetInnerHTML."),
    finding_row("H2","HIGH","Frontend","link-to-us/page.tsx:131",
        "XSS via user-controlled badge label — raw HTML template injected straight into dangerouslySetInnerHTML."),
    finding_row("H3","HIGH","API","routes/network.ts:55",
        "SSRF via /api/network/http-headers — no RFC-1918 blocklist; attacker can hit AWS metadata endpoint, Redis, internal Docker services."),
    finding_row("H4","HIGH","API","routes/network.ts:87",
        "SSRF/internal port scan via /api/network/port-checker — socket.connect(port, host) with only z.string().min(1) validation."),
    finding_row("H5","HIGH","PDF","All web PDF routes",
        "No file-type validation on web PDF endpoints — any binary accepted; renaming .exe to .docx feeds it into mammoth/xlsx parsers."),
    finding_row("H6","HIGH","PDF","api/pdf/merge/route.ts",
        "No file size limit + unlimited file count — memory exhaustion DoS; getAll('files') with no cap."),
    finding_row("H7","HIGH","PDF","api/pdf/unlock/route.ts:12",
        "Unauthenticated PDF decryption. ignoreEncryption:true strips any password with zero auth, zero rate limit, zero size limit."),
    finding_row("H8","HIGH","PDF","apps/api/src/index.ts:106",
        "Zero authentication on all 22 backend PDF operations — merge, compress, protect, sign, OCR all fully public."),
    finding_row("H9","HIGH","PDF","lib/gotenberg.ts:81-89",
        "SSRF via urlToPdf() — exported function passes user-controlled URL to Gotenberg Chromium with no blocklist."),
    finding_row("H10","HIGH","PDF","Multiple routes",
        "Content-Disposition header injection via unsanitized file.originalname — newlines in filename inject arbitrary HTTP headers."),
    finding_row("H11","HIGH","PDF","api/pdf/protect/route.ts:49",
        "False 'password protection' — password silently discarded; document saved unencrypted; response still says passwordProtected: true."),
    finding_row("H12","HIGH","PDF","api/pdf/redact/route.ts",
        "Redaction is cosmetic only — adds a footer stamp; original text fully readable. Redacted terms returned in response body."),
    finding_row("H13","HIGH","API","routes/url-shortener.ts:18",
        "Unauthenticated URL shortening + open redirect — no scheme validation; javascript: URLs accepted; SSRF via internal URLs."),
    finding_row("H14","HIGH","API","routes/url-shortener.ts:29-46",
        "Slug uniqueness bug — retry loop updates 'attempt' but DB insert always uses original 'slug'; collisions cause unhandled 500s."),
    finding_row("H15","HIGH","API","routes/affiliate.ts:78",
        "Any authenticated user can view any affiliate code's revenue stats — no ownership check on ?code= param."),
    finding_row("H16","HIGH","Frontend","api/api-keys/[id]/route.ts:10",
        "IDOR on API key deletion — no ownership check in Next.js layer before proxying to backend."),
    finding_row("H17","HIGH","Frontend","api/billing/checkout/route.ts",
        "No auth guard on checkout creation — no getServerSession() call; unauthenticated requests forwarded to billing backend."),
    finding_row("H18","HIGH","Frontend","api/auth/me/route.ts:6",
        "getServerSession() without authOptions always returns null. No [...nextauth]/route.ts exists — NextAuth not wired up; signIn() 404s in production."),
    finding_row("H19","HIGH","SEO","apps/web/src/app/security/",
        "Duplicate URL tree — /security/{tool} and /tools/security/{tool} both live; no canonicals; PageRank split."),
    finding_row("H20","HIGH","SEO","Sitemap files",
        "Broken sitemap URL mapping — sitemap-pdf.ts outputs /tools/pdf/ slugs while actual pages are at /tools/document-tools/."),
]

medium_rows = [
    finding_row("M1","MEDIUM","API","middleware/sanitizer.ts",
        "Sanitizer middleware never registered in index.ts — app.use(sanitizer) missing; all sanitization is dead code."),
    finding_row("M2","MEDIUM","API","routes/billing.ts:99",
        "Non-atomic webhook handler — subscription upsert + referral reward not in a transaction; Stripe retries can double-grant credits."),
    finding_row("M3","MEDIUM","API","routes/billing.ts:84",
        "Webhook bypass when STRIPE_WEBHOOK_SECRET unset — all webhook calls accepted without signature verification."),
    finding_row("M4","MEDIUM","API","routes/referral.ts:22",
        "Race condition on referral code creation — findUnique + create not atomic; concurrent requests crash with unique-constraint error."),
    finding_row("M5","MEDIUM","API","routes/newsletter.ts:17",
        "!email.includes('@') is not email validation — <script>@x.com passes; no length limit. Unauthenticated unsubscribe by email."),
    finding_row("M6","MEDIUM","API","routes/calculators/mortgage.ts:27",
        "Negative loan amount not validated — downPayment > homePrice produces negative monthly payment returned as valid."),
    finding_row("M7","MEDIUM","API","routes/calculators/roi.ts:32",
        "breakEvenYears returns NaN/Infinity on total-loss scenario (cagr = -100%)."),
    finding_row("M8","MEDIUM","API","utils/pagination.ts:36",
        "sortBy from caller passed directly to Prisma orderBy — if wired to req.query, any column (inc. passwordHash) becomes sortable."),
    finding_row("M9","MEDIUM","API","routes/url-shortener.ts:71",
        "Wrong field name — req.user.id used but AuthPayload stores userId; list endpoint always returns empty array."),
    finding_row("M10","MEDIUM","API","routes/tool-analytics.ts:24",
        "Unauthenticated write; userId is caller-supplied — anyone can pollute analytics with fake data for any user ID."),
    finding_row("M11","MEDIUM","API","routes/contact.ts:27",
        "XSS in outbound email — message interpolated as HTML without escaping; <script> tags execute in support team's email client."),
    finding_row("M12","MEDIUM","API","middleware/fileValidator.ts:267",
        "Unrecognized binary types pass validation silently — if(!detected) skips MIME check in multi-file path."),
    finding_row("M13","MEDIUM","API","middleware/fileValidator.ts:138",
        "Per-tier size limit skipped for multi-file uploads — enforceFileSizeLimit checks req.file (undefined for arrays); free users can upload 4 GB via merge."),
    finding_row("M14","MEDIUM","API","routes/pdf/sign.ts:76",
        "Unbounded base64 signatureData body field — bypasses multer file size limits; multi-MB payloads accepted as JSON."),
    finding_row("M15","MEDIUM","PDF","routes/pdf/*.ts",
        "Raw err.message returned directly — bypasses errorHandler; leaks Gotenberg internal URLs, file paths, service names."),
    finding_row("M16","MEDIUM","PDF","lib/gotenberg.ts:184",
        "Gotenberg unreachable error includes internal Docker hostname verbatim in the HTTP response."),
    finding_row("M17","MEDIUM","PDF","api/pdf/convert-from-pdf/route.ts:86",
        "Zip bomb / decompression bomb — JSZip and pdfjs iterate crafted archives/pages with no decompressed-size limit."),
    finding_row("M18","MEDIUM","Frontend","dashboard/page.tsx",
        "Client-side-only auth redirect — HTML served to unauthenticated bots/crawlers before JS fires."),
    finding_row("M19","MEDIUM","Frontend","lib/prisma.ts:10",
        "log:['query'] in all environments — all SQL queries with user values logged to stdout in production."),
    finding_row("M20","MEDIUM","Frontend","blog/[slug]/page.tsx:95",
        "Blog content rendered via dangerouslySetInnerHTML without sanitization — XSS-ready if blog data ever comes from an API."),
    finding_row("M21","MEDIUM","SEO","lib/seo.ts:36",
        "OG images 404 for homepage, all category pages, and all 194 tool pages — every social share shows no preview image."),
    finding_row("M22","MEDIUM","SEO","app/robots.ts:34",
        "sitemap-real-estate.xml listed in robots.txt but file does not exist — Google Search Console will report a failed sitemap."),
    finding_row("M23","MEDIUM","Perf","app/layout.tsx:66",
        "Second font loaded via raw <link> instead of next/font — blocks render, no font-display:swap, no preload hint."),
    finding_row("M24","MEDIUM","Perf","tailwind.config.ts:6",
        "3 Tailwind font families declared but never loaded — font-display/body/mono classes fall back to system fonts; design system broken."),
    finding_row("M25","MEDIUM","Perf","app/layout.tsx",
        "Zero <Suspense> boundaries across entire app (one usage in search only) — all tool pages block full RSC stream on slow data."),
    finding_row("M26","MEDIUM","Perf","components/SiteHeader.tsx",
        "Entire 430-line nav is a monolithic 'use client' component — static category data forces full JS bundle; not pre-renderable."),
    finding_row("M27","MEDIUM","Perf","app/layout.tsx:103",
        "<GoogleAnalytics> and <AdSenseScript> in <head> with no error boundary — either throwing crashes the entire site layout."),
]

low_rows = [
    finding_row("L1","LOW","API","routes/auth.ts:33","Email enumeration via bcrypt timing difference; fix with dummy hash compare on missing users."),
    finding_row("L2","LOW","API","routes/api-keys.ts:114","Admin key comparison uses === (not crypto.timingSafeEqual)."),
    finding_row("L3","LOW","API","routes/url-shortener.ts:89","Stats endpoint leaks userId and internal fields to anonymous callers."),
    finding_row("L4","LOW","API","routes/url-shortener.ts:11","Math.random() used for slug generation; use crypto.randomBytes."),
    finding_row("L5","LOW","API","routes/pdf/protect.ts:41","Owner password generated with Math.random(); use crypto.randomBytes."),
    finding_row("L6","LOW","API","middleware/fileValidator.ts:167","VirusTotal fails open on all errors (timeout, quota, network failure)."),
    finding_row("L7","LOW","API","middleware/requireAuth.ts:47","7-day JWTs with no server-side revocation; stolen tokens valid for a week."),
    finding_row("L8","LOW","API","index.ts:82","10 MB JSON body limit applied to all routes including auth and analytics."),
    finding_row("L9","LOW","API","middleware/csrfProtection.ts:32","/api/v1/ CSRF exempt by prefix; future state-mutating routes silently unprotected."),
    finding_row("L10","LOW","PDF","Universal","Universal ignoreEncryption:true silently strips owner permissions from every processed PDF."),
    finding_row("L11","LOW","Frontend","next.config.ts:40","CSP contains 'unsafe-eval' + 'unsafe-inline'; provides no XSS mitigation."),
    finding_row("L12","LOW","Frontend","next.config.js + next.config.ts","Two conflicting config files — .js takes priority; security headers, output:standalone, removeConsole silently disabled."),
    finding_row("L13","LOW","Frontend","(auth)/signup/page.tsx:98","Terms checkbox not enforced server-side; direct API calls bypass ToS acceptance."),
    finding_row("L14","LOW","SEO","Multiple files","Brand name inconsistency — 'Toolverse' in manifest/OG vs 'RoughTools' in header and site title."),
    finding_row("L15","LOW","SEO","tools/[category]/[tool]/page.tsx:52","Default FAQ states 'up to 20 uses/day' contradicting homepage 'no limits ever'."),
    finding_row("L16","LOW","SEO","All tool pages","All 194 tool pages render a placeholder UI ('Tool interface coming in Phase 5') — thin content risk."),
    finding_row("L17","LOW","SEO","app/manifest.ts:79","PWA shortcut links to /tools/pdf which resolves to a 404."),
]

# ── Priority action plan ──────────────────────────────────────────────────────
priority_data = [
    ["Week 1 — Stop the Bleeding", ""],
    ["C1", "Hash passwords: add bcrypt.hash(password, 12) in register/route.ts"],
    ["C2", "Remove JWT fallback secret; throw at startup if JWT_SECRET is unset"],
    ["H11/H12", "Remove false protect/redact endpoints or add hard warnings — they are security theater"],
    ["H3/H4", "Add RFC-1918 blocklist to all outbound fetch/socket calls in network.ts"],
    ["C5", "Remove customerId fallback from request body in billing portal endpoint"],
    ["Sprint 1", ""],
    ["C4", "Fix CSRF bypass: check req.user (set by auth), not raw header presence"],
    ["C6", "Add requireAuth to referral apply; derive newUserId from JWT token"],
    ["H1/H2", "Sanitize all dangerouslySetInnerHTML sites (DOMPurify or sanitize-html)"],
    ["H5–H8", "Add file type validation + size limits to all Next.js PDF routes"],
    ["M21", "Fix OG images: use Next.js opengraph-image.tsx or add actual static images"],
    ["L12", "Delete next.config.js; keep only next.config.ts"],
    ["Sprint 2", ""],
    ["M1", "Wire up app.use(sanitizer) in index.ts"],
    ["M15", "Wrap all PDF route errors with next(err) instead of raw res.json"],
    ["M25", "Add <Suspense> boundaries to tool pages"],
    ["H19", "Resolve duplicate /security/ URL tree with 301 redirects and canonical tags"],
    ["H20", "Fix broken sitemap paths — align all PDF tool URLs"],
]

# ── Build document ────────────────────────────────────────────────────────────
def build_pdf():
    doc = SimpleDocTemplate(
        OUTPUT,
        pagesize=A4,
        leftMargin=1.8*cm, rightMargin=1.8*cm,
        topMargin=2*cm, bottomMargin=2*cm,
    )

    story = []

    # ── Cover banner ──────────────────────────────────────────────────────────
    banner_data = [[
        Paragraph("WEBSITE SECURITY &amp; QUALITY AUDIT", title_style),
        Paragraph("RoughTools / Toolverse Platform", subtitle_style),
        Paragraph(f"Generated: {date.today().strftime('%B %d, %Y')}  |  Scope: apps/web + apps/api  |  Total Findings: 72", subtitle_style),
    ]]
    banner = Table(banner_data, colWidths=[17*cm],
                   style=TableStyle([
                       ("BACKGROUND", (0,0), (-1,-1), DARK),
                       ("ALIGN",      (0,0), (-1,-1), "CENTER"),
                       ("TOPPADDING", (0,0), (-1,-1), 16),
                       ("BOTTOMPADDING",(0,0),(-1,-1),16),
                       ("LEFTPADDING",(0,0),(-1,-1), 12),
                       ("RIGHTPADDING",(0,0),(-1,-1),12),
                   ]))
    story.append(banner)
    story.append(Spacer(1, 0.5*cm))

    # ── Summary scorecard ─────────────────────────────────────────────────────
    story.append(Paragraph("EXECUTIVE SUMMARY", h1))
    story.append(rule(BLUE, 2))

    summary_data = [
        [Paragraph("<b>Severity</b>", S("h", fontName="Helvetica-Bold", fontSize=9, textColor=WHITE, alignment=TA_CENTER)),
         Paragraph("<b>Count</b>",    S("h", fontName="Helvetica-Bold", fontSize=9, textColor=WHITE, alignment=TA_CENTER)),
         Paragraph("<b>Key Risk</b>", S("h", fontName="Helvetica-Bold", fontSize=9, textColor=WHITE))],
        [Paragraph("CRITICAL", S("c", fontName="Helvetica-Bold", fontSize=9, textColor=WHITE, alignment=TA_CENTER)),
         Paragraph("8",  S("c", fontName="Helvetica-Bold", fontSize=9, textColor=WHITE, alignment=TA_CENTER)),
         Paragraph("Plaintext passwords · Forged JWTs · Billing portal hijack · Unauthenticated referral rewards", body)],
        [Paragraph("HIGH", S("c", fontName="Helvetica-Bold", fontSize=9, textColor=WHITE, alignment=TA_CENTER)),
         Paragraph("20", S("c", fontName="Helvetica-Bold", fontSize=9, textColor=WHITE, alignment=TA_CENTER)),
         Paragraph("XSS in 2 tools · SSRF in 3 endpoints · All PDF routes unauth · False redaction/protection", body)],
        [Paragraph("MEDIUM", S("c", fontName="Helvetica-Bold", fontSize=9, textColor=WHITE, alignment=TA_CENTER)),
         Paragraph("27", S("c", fontName="Helvetica-Bold", fontSize=9, textColor=WHITE, alignment=TA_CENTER)),
         Paragraph("Race conditions · Broken OG images · Dead sanitizer · Query logging in prod · No Suspense", body)],
        [Paragraph("LOW", S("c", fontName="Helvetica-Bold", fontSize=9, textColor=DARK, alignment=TA_CENTER)),
         Paragraph("17", S("c", fontName="Helvetica-Bold", fontSize=9, textColor=DARK, alignment=TA_CENTER)),
         Paragraph("Timing attacks · Math.random() for secrets · Conflicting next.config · Brand inconsistency", body)],
    ]
    summary_table = Table(summary_data, colWidths=[2.5*cm, 1.5*cm, 13*cm],
        style=TableStyle([
            ("BACKGROUND",  (0,0), (-1,0),  DARK),
            ("BACKGROUND",  (0,1), (-1,1),  RED),
            ("BACKGROUND",  (0,2), (-1,2),  ORANGE),
            ("BACKGROUND",  (0,3), (-1,3),  YELLOW),
            ("BACKGROUND",  (0,4), (-1,4),  GREEN),
            ("TEXTCOLOR",   (0,3), (-1,3),  DARK),
            ("ALIGN",       (0,0), (1,-1),  "CENTER"),
            ("VALIGN",      (0,0), (-1,-1), "MIDDLE"),
            ("GRID",        (0,0), (-1,-1), 0.5, WHITE),
            ("TOPPADDING",  (0,0), (-1,-1), 6),
            ("BOTTOMPADDING",(0,0),(-1,-1), 6),
            ("LEFTPADDING", (0,0), (-1,-1), 6),
        ])
    )
    story.append(summary_table)
    story.append(Spacer(1, 0.4*cm))

    story.append(Paragraph(
        "<b>Critical combination:</b> Findings C1 + C2 together mean plaintext passwords are stored "
        "while any attacker can forge JWTs using the known fallback secret — full database credential "
        "exposure with zero effort. These two must be fixed before anything else.",
        S("warn", fontName="Helvetica", fontSize=9, textColor=RED,
          borderColor=RED, borderWidth=1, borderPadding=6,
          spaceAfter=8, leading=13)
    ))

    # ── Sections ──────────────────────────────────────────────────────────────
    sections = [
        ("CRITICAL FINDINGS", critical_rows, RED),
        ("HIGH FINDINGS", high_rows, ORANGE),
        ("MEDIUM FINDINGS", medium_rows, YELLOW),
        ("LOW FINDINGS", low_rows, GREEN),
    ]

    for title, rows, color in sections:
        story.append(Spacer(1, 0.3*cm))
        title_p = Paragraph(title, S("st", fontName="Helvetica-Bold", fontSize=13,
                                      textColor=color, spaceBefore=14, spaceAfter=4))
        story.append(title_p)
        story.append(rule(color, 2))
        story.append(section_table(rows))

    # ── Priority action plan ──────────────────────────────────────────────────
    story.append(Spacer(1, 0.5*cm))
    story.append(Paragraph("PRIORITY ACTION PLAN", h1))
    story.append(rule(BLUE, 2))

    plan_style = TableStyle([
        ("BACKGROUND",  (0,0), (-1,-1), LIGHT),
        ("ROWBACKGROUNDS", (0,0), (-1,-1), [LIGHT, WHITE]),
        ("ALIGN",       (0,0), (0,-1),  "CENTER"),
        ("VALIGN",      (0,0), (-1,-1), "TOP"),
        ("GRID",        (0,0), (-1,-1), 0.3, colors.HexColor("#BDC3C7")),
        ("TOPPADDING",  (0,0), (-1,-1), 5),
        ("BOTTOMPADDING",(0,0),(-1,-1), 5),
        ("LEFTPADDING", (0,0), (-1,-1), 6),
        ("RIGHTPADDING",(0,0),(-1,-1), 6),
    ])

    plan_rows = []
    section_indices = []
    for i, (ref, desc) in enumerate(priority_data):
        if desc == "":
            section_indices.append(i)
        plan_rows.append([
            Paragraph(f"<b>{esc(ref)}</b>",
                      S("pr", fontName="Helvetica-Bold", fontSize=8,
                        textColor=DARK if desc else WHITE, alignment=TA_CENTER)),
            Paragraph(esc(desc) if desc else "",
                      S("pd", fontName="Helvetica", fontSize=8,
                        textColor=DARK if desc else WHITE, leading=11)),
        ])

    plan_table = Table(plan_rows, colWidths=[2.5*cm, 14.5*cm], style=plan_style)
    for idx in section_indices:
        plan_table._argW = plan_table._argW  # force recalc
        plan_style.add("BACKGROUND", (0,idx), (-1,idx), DARK)
        plan_style.add("SPAN",       (0,idx), (-1,idx))
    # Rebuild with updated style
    plan_table = Table(plan_rows, colWidths=[2.5*cm, 14.5*cm], style=plan_style)
    story.append(plan_table)

    # ── Footer note ───────────────────────────────────────────────────────────
    story.append(Spacer(1, 0.5*cm))
    story.append(rule(GRAY))
    story.append(Paragraph(
        f"Audit completed: {date.today().strftime('%B %d, %Y')} | "
        "Scope: apps/web (Next.js 14) + apps/api (Express) | "
        "Audited by: Claude Code — 5 independent parallel analysis agents",
        caption))
    story.append(Paragraph(
        "This report is confidential and intended for internal development use only.",
        caption))

    doc.build(story)
    print(f"PDF created: {OUTPUT}")

build_pdf()
