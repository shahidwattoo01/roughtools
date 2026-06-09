"""
RoughTools Complete Project Audit — PDF Generator
Converts GRAPH_REPORT.md into a professional A4 PDF.
"""

import re
from pathlib import Path
from datetime import date

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, PageBreak, KeepTogether
)
from reportlab.platypus.flowables import HRFlowable

# ── Palette ───────────────────────────────────────────────────────────────────
BRAND       = colors.HexColor("#5b6cff")
BRAND_DARK  = colors.HexColor("#3a4fd4")
ACCENT      = colors.HexColor("#f97316")
BG_LIGHT    = colors.HexColor("#f0f2f8")
BG_CODE     = colors.HexColor("#1e1e2e")
TEXT_MAIN   = colors.HexColor("#0d111c")
TEXT_MUTED  = colors.HexColor("#5a6282")
GREEN       = colors.HexColor("#10b981")
RED         = colors.HexColor("#ef4444")
YELLOW      = colors.HexColor("#f59e0b")
WHITE       = colors.white

W, H = A4

# ── Styles ────────────────────────────────────────────────────────────────────
base = getSampleStyleSheet()

def s(name, **kw):
    """Create a named ParagraphStyle."""
    return ParagraphStyle(name, **kw)

STYLES = {
    "cover_title": s("cover_title",
        fontName="Helvetica-Bold", fontSize=34, leading=40,
        textColor=WHITE, alignment=TA_CENTER, spaceAfter=8),
    "cover_sub": s("cover_sub",
        fontName="Helvetica", fontSize=14, leading=20,
        textColor=colors.HexColor("#c8cde6"), alignment=TA_CENTER, spaceAfter=6),
    "cover_meta": s("cover_meta",
        fontName="Helvetica", fontSize=10, leading=14,
        textColor=colors.HexColor("#8b93ae"), alignment=TA_CENTER),

    "h1": s("h1",
        fontName="Helvetica-Bold", fontSize=20, leading=26,
        textColor=BRAND, spaceBefore=18, spaceAfter=8,
        borderPad=0),
    "h2": s("h2",
        fontName="Helvetica-Bold", fontSize=14, leading=18,
        textColor=TEXT_MAIN, spaceBefore=14, spaceAfter=5),
    "h3": s("h3",
        fontName="Helvetica-Bold", fontSize=11, leading=15,
        textColor=BRAND_DARK, spaceBefore=10, spaceAfter=3),
    "body": s("body",
        fontName="Helvetica", fontSize=9.5, leading=14,
        textColor=TEXT_MAIN, spaceAfter=4, alignment=TA_JUSTIFY),
    "body_small": s("body_small",
        fontName="Helvetica", fontSize=8.5, leading=12,
        textColor=TEXT_MUTED, spaceAfter=2),
    "code_inline": s("code_inline",
        fontName="Courier", fontSize=9, leading=13,
        textColor=colors.HexColor("#7c8bff"), spaceAfter=2),
    "bullet": s("bullet",
        fontName="Helvetica", fontSize=9.5, leading=14,
        textColor=TEXT_MAIN, leftIndent=14, spaceAfter=3,
        bulletIndent=4),
    "tag_label": s("tag_label",
        fontName="Helvetica-Bold", fontSize=8, leading=11,
        textColor=WHITE),
    "table_header": s("table_header",
        fontName="Helvetica-Bold", fontSize=9, leading=12,
        textColor=WHITE, alignment=TA_CENTER),
    "table_cell": s("table_cell",
        fontName="Helvetica", fontSize=8.5, leading=12,
        textColor=TEXT_MAIN),
    "table_cell_code": s("table_cell_code",
        fontName="Courier", fontSize=8, leading=11,
        textColor=colors.HexColor("#5b6cff")),
    "section_intro": s("section_intro",
        fontName="Helvetica-Oblique", fontSize=9.5, leading=14,
        textColor=TEXT_MUTED, spaceAfter=6),
    "gap_label": s("gap_label",
        fontName="Helvetica-Bold", fontSize=9.5, leading=13,
        textColor=RED),
}

# ── Helpers ───────────────────────────────────────────────────────────────────

def escape(text):
    """Escape XML special chars for Paragraph."""
    return (text.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;"))

def rule(color=BG_LIGHT, thickness=0.5):
    return HRFlowable(width="100%", thickness=thickness,
                      color=color, spaceAfter=6, spaceBefore=2)

def section_rule():
    return HRFlowable(width="100%", thickness=1.5, color=BRAND,
                      spaceAfter=8, spaceBefore=4)

def gap(h=6):
    return Spacer(1, h)

def h1(text):
    return [section_rule(), Paragraph(escape(text), STYLES["h1"])]

def h2(text):
    return [Paragraph(escape(text), STYLES["h2"]), rule()]

def h3(text):
    return [Paragraph(escape(text), STYLES["h3"])]

def body(text):
    return Paragraph(escape(text), STYLES["body"])

def bullet(text):
    return Paragraph(f"&#8226; &nbsp;{escape(text)}", STYLES["bullet"])

def code(text):
    return Paragraph(escape(text), STYLES["code_inline"])

def stat_table(rows, col_widths=None):
    """Two-column stat table with zebra rows."""
    data = [[Paragraph(escape(str(k)), STYLES["table_cell"]),
             Paragraph(escape(str(v)), STYLES["table_cell"])]
            for k, v in rows]
    cw = col_widths or [5.5*cm, 11*cm]
    t = Table(data, colWidths=cw, hAlign="LEFT")
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), BG_LIGHT),
        ("ROWBACKGROUNDS", (0, 0), (-1, -1), [WHITE, BG_LIGHT]),
        ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#e5e8f0")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
    ]))
    return t

def god_node_table(nodes):
    """Ranked god-node table."""
    header = [Paragraph(t, STYLES["table_header"]) for t in ["#", "Node", "Edges", "Role"]]
    roles = {
        "JsonLd()":         "SEO JSON-LD injected into every tool page",
        "getCalcSEO()":     "SEO config factory for all calculator pages",
        "exportCalcPDF()":  "PDF export shared across math/science calculators",
        "Card()":           "Core UI card primitive — calculators, tools, landing",
        "ResultRow()":      "Shared result row across calculator family",
        "scripts":          "Build/test/lint script definitions",
        "InputField()":     "Core form input used by all tool forms",
        "ApiError":         "Central error type across Express + clients",
        "validateFile()":   "File validation gate for all PDF uploads",
        "cn()":             "Tailwind class merger — everywhere in UI",
    }
    data = [header] + [
        [Paragraph(str(n["rank"]), STYLES["table_cell"]),
         Paragraph(f'<font name="Courier" color="#5b6cff">{escape(n["name"])}</font>', STYLES["table_cell"]),
         Paragraph(str(n["edges"]), STYLES["table_cell"]),
         Paragraph(escape(roles.get(n["name"], "—")), STYLES["table_cell"])]
        for n in nodes
    ]
    t = Table(data, colWidths=[1*cm, 4*cm, 2*cm, 9.5*cm], hAlign="LEFT")
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), BRAND),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, BG_LIGHT]),
        ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#e5e8f0")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("FONTNAME", (0, 1), (0, -1), "Helvetica-Bold"),
        ("FONTSIZE", (2, 1), (2, -1), 9),
        ("ALIGN", (2, 0), (2, -1), "CENTER"),
    ]))
    return t

def community_table(communities):
    """Table of top communities."""
    header = [Paragraph(t, STYLES["table_header"])
              for t in ["ID", "Name", "Nodes", "Cohesion", "Top Members"]]
    data = [header]
    for c in communities:
        coh = c["cohesion"]
        coh_color = "#10b981" if coh >= 0.15 else ("#f59e0b" if coh >= 0.08 else "#ef4444")
        data.append([
            Paragraph(str(c["id"]), STYLES["table_cell"]),
            Paragraph(escape(c["name"]), STYLES["table_cell"]),
            Paragraph(str(c["nodes"]), STYLES["table_cell"]),
            Paragraph(f'<font color="{coh_color}"><b>{coh:.2f}</b></font>', STYLES["table_cell"]),
            Paragraph(escape(c["sample"]), STYLES["body_small"]),
        ])
    t = Table(data, colWidths=[1*cm, 4.5*cm, 1.5*cm, 2*cm, 7.5*cm], hAlign="LEFT")
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), BRAND),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, BG_LIGHT]),
        ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#e5e8f0")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
    ]))
    return t

# ── Cover page ────────────────────────────────────────────────────────────────

def cover_page(story):
    # Dark background rectangle drawn via a Table trick
    cover_data = [[""]]
    cover_tbl = Table(cover_data, colWidths=[W - 4*cm], rowHeights=[6*cm])
    cover_tbl.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#0d111c")),
        ("ROUNDEDCORNERS", [12]),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))

    # Title block
    story.append(Spacer(1, 2.5*cm))
    story.append(Paragraph("RoughTools.com", STYLES["cover_title"]))
    story.append(Paragraph("Complete Project Audit", STYLES["cover_sub"]))
    story.append(Spacer(1, 0.4*cm))
    story.append(Paragraph(
        "Knowledge Graph Analysis &bull; Architecture Report &bull; Code Quality Review",
        STYLES["cover_meta"]))
    story.append(Spacer(1, 0.6*cm))
    story.append(Paragraph(f"Generated: {date.today().strftime('%B %d, %Y')}", STYLES["cover_meta"]))
    story.append(Spacer(1, 1.5*cm))

    # Stats bar
    stats = [
        ["1,098", "Files Audited"],
        ["5,912", "Graph Nodes"],
        ["7,266", "Edges"],
        ["611",   "Communities"],
        ["222x",  "Token Reduction"],
    ]
    stat_data = [[
        Paragraph(f'<b><font size="18" color="#5b6cff">{v}</font></b><br/>'
                  f'<font size="8" color="#8b93ae">{l}</font>', STYLES["body"])
        for v, l in stats
    ]]
    st = Table(stat_data, colWidths=[(W - 4*cm) / 5] * 5, hAlign="CENTER")
    st.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#131827")),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 14),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 14),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#222840")),
    ]))
    story.append(st)
    story.append(PageBreak())

# ── Parse GRAPH_REPORT sections ───────────────────────────────────────────────

def parse_god_nodes(text):
    nodes = []
    for m in re.finditer(r'^\d+\.\s+`([^`]+)`\s+-\s+(\d+)\s+edges', text, re.MULTILINE):
        nodes.append({"rank": len(nodes)+1, "name": m.group(1), "edges": int(m.group(2))})
    return nodes

def parse_surprises(text):
    items = []
    for m in re.finditer(r'-\s+`([^`]+)`\s+--([^-]+)-->\s+`([^`]+)`\s+\[([^\]]+)\]\s*\n\s+(.+)', text):
        items.append({
            "from": m.group(1), "rel": m.group(2).strip(),
            "to": m.group(3), "confidence": m.group(4),
            "path": m.group(5).strip()
        })
    return items

def parse_hyperedges(text):
    items = []
    for m in re.finditer(r'-\s+\*\*([^*]+)\*\*\s+—\s+([^\[]+)\[([^\]]+)\]', text):
        items.append({
            "name": m.group(1).strip(),
            "members": m.group(2).strip().rstrip(",").strip(),
            "confidence": m.group(3).strip()
        })
    return items

def parse_communities(text):
    communities = []
    pattern = re.compile(
        r'### Community (\d+) - "([^"]+)"\nCohesion: ([\d.]+)\nNodes \((\d+)\): (.+?)(?=\n###|\Z)',
        re.DOTALL
    )
    for m in pattern.finditer(text):
        sample = m.group(5).strip().replace("\n", " ")
        # Clean up (+N more)
        sample = re.sub(r'\(\+\d+ more\)', '', sample).strip().rstrip(",")
        communities.append({
            "id":      int(m.group(1)),
            "name":    m.group(2),
            "cohesion": float(m.group(3)),
            "nodes":   int(m.group(4)),
            "sample":  sample[:120] + ("…" if len(sample) > 120 else ""),
        })
    return communities

def parse_knowledge_gaps(text):
    gaps = []
    in_gaps = False
    for line in text.splitlines():
        if line.startswith("## Knowledge Gaps"):
            in_gaps = True
            continue
        if in_gaps:
            if line.startswith("## "):
                break
            if line.strip().startswith("-"):
                gaps.append(line.strip().lstrip("- "))
    return gaps

def parse_suggested_questions(text):
    qs = []
    in_qs = False
    for line in text.splitlines():
        if line.startswith("## Suggested Questions"):
            in_qs = True
            continue
        if in_qs:
            if line.startswith("## "):
                break
            m = re.match(r'^- \*\*(.+?)\*\*', line)
            if m:
                qs.append(m.group(1)[:200])
    return qs

# ── Build story ───────────────────────────────────────────────────────────────

def build(report_path: Path, out_path: Path):
    text = report_path.read_text(encoding="utf-8")

    god_nodes   = parse_god_nodes(text)
    surprises   = parse_surprises(text)
    hyperedges  = parse_hyperedges(text)
    communities = parse_communities(text)
    gaps        = parse_knowledge_gaps(text)
    questions   = parse_suggested_questions(text)

    doc = SimpleDocTemplate(
        str(out_path),
        pagesize=A4,
        leftMargin=2*cm, rightMargin=2*cm,
        topMargin=2*cm, bottomMargin=2*cm,
        title="RoughTools — Complete Project Audit",
        author="graphify + Claude",
        subject="Architecture & Code Quality Report",
    )

    story = []

    # ── Cover ─────────────────────────────────────────────────────────────────
    cover_page(story)

    # ── Executive Summary ─────────────────────────────────────────────────────
    story += h1("1. Executive Summary")
    story.append(body(
        "This report presents a complete static analysis of the RoughTools.com monorepo, "
        "processed as a knowledge graph with 5,912 nodes and 7,266 edges across 611 detected "
        "communities. The analysis covers 1,098 source files — 1,063 code files parsed via AST "
        "and 35 documentation/PDF/image files via semantic extraction. "
        "The graph provides a 222x token reduction for future codebase queries."
    ))
    story.append(gap(6))

    summary_rows = [
        ("Total files",         "1,098 (1,063 code · 29 docs · 4 PDFs · 2 images)"),
        ("Graph nodes",         "5,912"),
        ("Graph edges",         "7,266  (100% EXTRACTED via AST)"),
        ("INFERRED edges",      "31  (avg confidence 0.83 — cross-file call relationships)"),
        ("Communities",         "611 total · 124 thin (<3 nodes) omitted from detail"),
        ("God nodes",           f"{len(god_nodes)} high-betweenness cross-community bridges"),
        ("Surprising connections", f"{len(surprises)} hidden cross-module dependencies"),
        ("Knowledge gaps",      "2,925 isolated nodes (mostly package.json fields)"),
        ("Token reduction",     "222x — graph query vs. reading full corpus"),
        ("Date",                date.today().strftime("%B %d, %Y")),
    ]
    story.append(stat_table(summary_rows))
    story.append(gap(10))

    # ── God Nodes ─────────────────────────────────────────────────────────────
    story += h1("2. God Nodes — Core Abstractions")
    story.append(body(
        "God nodes are the highest-betweenness nodes in the graph — components that bridge "
        "multiple communities. A bug or breaking change in any of these nodes propagates "
        "across the widest surface area. Treat these as your highest-risk change points."
    ))
    story.append(gap(6))
    if god_nodes:
        story.append(god_node_table(god_nodes))

    story.append(gap(12))
    story.append(KeepTogether([
        body(
            "<b>Critical observation:</b> <font name='Courier' color='#5b6cff'>JsonLd()</font> "
            "has 73 edges — the highest betweenness centrality in the entire graph (0.038). "
            "It bridges 60+ tool page communities to the SEO layer. "
            "A regression in this single component would break structured data on every tool page "
            "simultaneously, directly impacting Google indexing."
        )
    ]))

    # ── Surprising Connections ────────────────────────────────────────────────
    story.append(PageBreak())
    story += h1("3. Surprising Connections")
    story.append(body(
        "These cross-module dependencies were detected by the graph but are not obvious from "
        "reading any single file. They represent hidden coupling that could cause unexpected "
        "breakage during refactoring."
    ))
    story.append(gap(6))

    if surprises:
        surp_data = [[
            Paragraph("From", STYLES["table_header"]),
            Paragraph("Relation", STYLES["table_header"]),
            Paragraph("To", STYLES["table_header"]),
            Paragraph("File Path", STYLES["table_header"]),
        ]]
        for s_ in surprises:
            surp_data.append([
                Paragraph(f'<font name="Courier" color="#5b6cff">{escape(s_["from"])}</font>',
                          STYLES["table_cell"]),
                Paragraph(f'<font color="#f97316">{escape(s_["rel"])}</font>',
                          STYLES["table_cell"]),
                Paragraph(f'<font name="Courier" color="#5b6cff">{escape(s_["to"])}</font>',
                          STYLES["table_cell"]),
                Paragraph(f'<font size="7.5" color="#8b93ae">{escape(s_["path"])}</font>',
                          STYLES["table_cell"]),
            ])
        surp_tbl = Table(surp_data, colWidths=[3.5*cm, 2.5*cm, 3.5*cm, 7*cm], hAlign="LEFT")
        surp_tbl.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), BRAND_DARK),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, BG_LIGHT]),
            ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#e5e8f0")),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("TOPPADDING", (0, 0), (-1, -1), 4),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ]))
        story.append(surp_tbl)
    else:
        # Fallback hardcoded from parsed report
        for item in [
            ("Page() → useClipboard()", "api-docs, embed-generator, link-to-us all import useClipboard from packages/ui — hidden cross-package dependency."),
            ("SiteHeader() → useTheme()", "SiteHeader in apps/web pulls useTheme from packages/ui/src/providers/theme.tsx. The UI package theme provider is load-bearing for the header."),
            ("CI E2E → PostgreSQL 16", "GitHub Actions E2E job and docker-compose.yml share the same Postgres service definition — CI and local dev share the same DB schema contract."),
        ]:
            story.append(bullet(f"<b>{item[0]}</b> — {item[1]}"))
            story.append(gap(3))

    # ── Group Relationships (Hyperedges) ──────────────────────────────────────
    story.append(PageBreak())
    story += h1("4. Group Relationships (Hyperedges)")
    story.append(body(
        "Hyperedges capture relationships among 3+ nodes that cannot be expressed as pairwise "
        "edges. These represent architectural clusters — stacks, pipelines, and feature groups "
        "that operate as a unit."
    ))
    story.append(gap(6))

    if hyperedges:
        he_data = [[
            Paragraph("Group", STYLES["table_header"]),
            Paragraph("Members", STYLES["table_header"]),
            Paragraph("Conf.", STYLES["table_header"]),
        ]]
        for he in hyperedges:
            members_short = he["members"][:180] + ("…" if len(he["members"]) > 180 else "")
            he_data.append([
                Paragraph(f"<b>{escape(he['name'])}</b>", STYLES["table_cell"]),
                Paragraph(f'<font size="7.5" color="#5a6282">{escape(members_short)}</font>',
                          STYLES["table_cell"]),
                Paragraph(
                    f'<font color="#10b981"><b>{escape(he["confidence"].split()[1] if " " in he["confidence"] else he["confidence"])}</b></font>',
                    STYLES["table_cell"]),
            ])
        he_tbl = Table(he_data, colWidths=[5*cm, 10.5*cm, 1*cm], hAlign="LEFT")
        he_tbl.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1a2138")),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, BG_LIGHT]),
            ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#e5e8f0")),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("TOPPADDING", (0, 0), (-1, -1), 5),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ]))
        story.append(he_tbl)

    # ── Community Overview ────────────────────────────────────────────────────
    story.append(PageBreak())
    story += h1("5. Community Overview (Top 25)")
    story.append(body(
        "The graph's 611 communities are ranked by size. Cohesion scores indicate internal "
        "connectivity: <font color='#10b981'><b>green ≥ 0.15</b></font> (well-structured), "
        "<font color='#f59e0b'><b>amber 0.08–0.15</b></font> (moderate), "
        "<font color='#ef4444'><b>red &lt; 0.08</b></font> (fragmented — consider refactoring)."
    ))
    story.append(gap(6))

    top25 = sorted(communities, key=lambda c: -c["nodes"])[:25]
    story.append(community_table(top25))

    # ── Architecture Findings ─────────────────────────────────────────────────
    story.append(PageBreak())
    story += h1("6. Architecture Findings")

    findings = [
        ("PDF Tool Pages — low cohesion (0.028)",
         "The PDF tool community has 72 nodes but almost no internal edges (cohesion 0.028 — "
         "lowest in the graph). Each PDF tool page is an island with no shared layout abstraction "
         "beyond JsonLd(). Recommend extracting a PDFToolLayout wrapper component."),

        ("Tool Client Components — fragmented (0.040)",
         "56 nodes, very few internal connections. This is effectively a 'junk drawer' community "
         "— components that share no common parent and drift independently. "
         "Consider grouping by feature subdirectory."),

        ("Duplicate AppError hierarchies",
         "Communities 29, 30, and 173 all contain similar AppError/AuthenticationError/"
         "BadGatewayError trees from different source files. Three separate error class definitions "
         "means catch blocks may not match instances across package boundaries. "
         "Consolidate into packages/errors as the single source of truth."),

        ("packages/calculators-core — well-structured",
         "137 files with cohesion scores of 0.39–0.45 for input/output schema clusters. "
         "The Zod schema/input/output pattern is consistent throughout. "
         "This is the best-structured package in the monorepo."),

        ("useTheme() in packages/ui is load-bearing",
         "The graph detected useTheme() as a cross-community bridge with betweenness 0.022. "
         "SiteHeader pulls it from packages/ui/src/providers/theme.tsx directly. "
         "The custom hooks/useTheme.ts (now deleted) conflicted with this — "
         "the UI package's provider is correctly the sole theme authority."),

        ("JsonLd() is a single point of SEO failure",
         "73 edges, betweenness 0.038. A regression here breaks structured data on every "
         "tool page simultaneously. This component has zero tests in the audit. "
         "Add at least a snapshot test for the JSON-LD output shape."),

        ("packages/db and lib/prisma.ts — no runtime conflict",
         "Zero web-app files import @workspace/db. The web app exclusively uses "
         "lib/prisma.ts with the correct globalThis singleton guard. "
         "No duplicate connection pool risk in production."),

        ("2,925 isolated nodes — mostly noise",
         "The majority are name/version/private fields parsed from package.json files. "
         "Not a code quality issue — AST noise from JSON parsing. "
         "Real isolated nodes worth investigating: generate_audit_pdf.py, "
         "design_system.py (skills directory — out of scope for production)."),
    ]

    for title, detail in findings:
        story += h3(title)
        story.append(body(detail))
        story.append(gap(4))

    # ── Knowledge Gaps ────────────────────────────────────────────────────────
    story.append(PageBreak())
    story += h1("7. Knowledge Gaps")
    story.append(body(
        "Nodes with 1 or fewer connections — possible missing edges, dead code, "
        "or under-documented components."
    ))
    story.append(gap(6))

    if gaps:
        for g_ in gaps[:8]:
            story.append(bullet(g_[:200]))
            story.append(gap(2))
    else:
        story.append(bullet(
            "2,925 isolated nodes — mostly package.json fields (name, version, private, "
            "workspaces, dev). Not actionable code issues."))
        story.append(bullet(
            "124 thin communities (<3 nodes) omitted from report. "
            "Run `graphify query` to explore."))

    # ── Suggested Questions ───────────────────────────────────────────────────
    story.append(PageBreak())
    story += h1("8. Suggested Questions for Deep Exploration")
    story.append(body(
        "These questions are uniquely answerable via the knowledge graph — "
        "run `graphify query \"<question>\"` in the project root for a traced answer."
    ))
    story.append(gap(6))

    clean_questions = [
        "Why does JsonLd() bridge 60+ tool page communities to the SEO layer, and what breaks if it fails?",
        "Should PDF Tool Pages be split into smaller, more focused modules? (cohesion 0.028)",
        "Should Tool Client Components be split into smaller, more focused modules? (cohesion 0.040)",
        "What connects the isolated documentation nodes to the rest of the system?",
        "Why does SiteHeader() bridge the theme provider to the navigation cluster?",
        "How does authentication flow from the register/login endpoints to the Prisma client?",
        "What is the shortest path from the AdSense integration to the tool page rendering pipeline?",
    ]

    for i, q in enumerate(clean_questions, 1):
        story.append(bullet(f"<b>Q{i}:</b> {q}"))
        story.append(gap(3))

    # ── Phase Summary (all 9 phases) ──────────────────────────────────────────
    story.append(PageBreak())
    story += h1("9. Remediation Summary — All 9 Phases")
    story.append(body(
        "The following issues were identified and fixed prior to this audit report being generated."
    ))
    story.append(gap(6))

    phases = [
        ("Phase 1 — Security",
         "Hashed passwords in register route using bcrypt (cost 12). "
         "Plaintext storage eliminated."),
        ("Phase 2 — Brand & SEO",
         "Replaced all 'Toolverse' references with 'RoughTools' across seo-config.ts, "
         "structured-data.ts, 9 sitemap files, nginx.conf, and PDF tool canonicals. "
         "Fixed sitemap PDF category mapping (document-tools → pdf). "
         "Updated tools-registry comment from 194 → ~415 tools."),
        ("Phase 3 — Broken Pages",
         "About page: replaced legacy Navbar with SiteHeader. "
         "Contact form: replaced alert() with Resend API route + proper success/error states. "
         "Pricing page: added href to Pro and Team CTAs. "
         "Dashboard: added 8s AbortController timeout, skeleton loading, error/retry state."),
        ("Phase 4 — Typography",
         "Fixed Tailwind fontFamily config to reference CSS variables (var(--font-display) etc.) "
         "matching actual loaded fonts. ToolCard description: leading-snug → leading-normal."),
        ("Phase 5 — Theme Conflicts",
         "Deleted hooks/useTheme.ts (conflicted with next-themes ThemeProvider). "
         "Deleted unused HomeDarkMode.tsx."),
        ("Phase 6 — Component Cleanup",
         "Deleted components/ui/ToolCard.tsx (dead, only imported by deleted DocumentsSection). "
         "Deleted components/layout/ directory (zero importers post-Phase 3). "
         "Deleted components/sections/ directory (zero external importers). "
         "Deleted components/tools/MortgageCalculator.tsx (orphan — mortgage page uses local client)."),
        ("Phase 7 — AdSense & Analytics",
         "CopyButton: removed success toast (icon morph only, keeping failure toast). "
         "ToolAdUnit sidebar: added position:sticky top:72px. "
         "WebVitals: added GA_MEASUREMENT_ID guard + dev warning. "
         "Documented NEXT_PUBLIC_GA_MEASUREMENT_ID and NEXT_PUBLIC_CLARITY_PROJECT_ID in .env.example."),
        ("Phase 8 — API & Config",
         "Deleted stray src/app/next.config.js. "
         "Fixed images.remotePatterns (replaced **.example.com with real domains). "
         "AI model claude-haiku-4-5-20251001 confirmed current. "
         "Prisma duplicate confirmed non-issue (web app uses lib/prisma.ts only)."),
        ("Phase 9 — Infrastructure",
         "Nginx: removed X-Frame-Options SAMEORIGIN (conflicts with Next.js DENY). "
         "Dockerfile: added 11 missing package COPY statements for pnpm workspace. "
         "robots.ts: allowing GPTBot/Claude-Web/PerplexityBot confirmed intentional."),
    ]

    phase_data = [[
        Paragraph("Phase", STYLES["table_header"]),
        Paragraph("Changes", STYLES["table_header"]),
    ]]
    for phase, detail in phases:
        phase_data.append([
            Paragraph(f"<b>{escape(phase)}</b>", STYLES["table_cell"]),
            Paragraph(escape(detail), STYLES["table_cell"]),
        ])
    phase_tbl = Table(phase_data, colWidths=[5.5*cm, 11*cm], hAlign="LEFT")
    phase_tbl.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0d111c")),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, BG_LIGHT]),
        ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#e5e8f0")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(phase_tbl)

    # ── Footer note ───────────────────────────────────────────────────────────
    story.append(gap(20))
    story.append(rule(colors.HexColor("#e5e8f0"), 0.5))
    story.append(Paragraph(
        f"Generated by graphify + Claude &bull; {date.today().isoformat()} &bull; "
        "roughtools.com &bull; Full graph data: graphify-out/graph.json",
        STYLES["cover_meta"]
    ))

    # ── Build ─────────────────────────────────────────────────────────────────
    doc.build(story)
    return out_path


if __name__ == "__main__":
    report = Path("graphify-out/GRAPH_REPORT.md")
    out    = Path("graphify-out/RoughTools_Complete_Audit.pdf")
    result = build(report, out)
    print(f"PDF written: {result}  ({result.stat().st_size:,} bytes)")
