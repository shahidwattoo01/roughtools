/**
 * Universal PDF export for all calculator tools.
 * Uses jsPDF + jspdf-autotable v5 (standalone function API).
 * Supports both simple and rich (master-prompt compliant) engineering calc sheets.
 */

export interface PDFInput  { label: string; value: string | number; unit?: string }
export interface PDFResult { label: string; value: string | number; unit?: string; highlight?: boolean }
export interface PDFRow    { [col: string]: string | number }

export interface CalcPDFConfig {
  toolName: string
  fileName?: string
  projectName?: string
  engineerName?: string
  // Inputs / simple results
  inputs:  PDFInput[]
  results: PDFResult[]
  formula?: string
  tableHeaders?: string[]
  tableRows?: PDFRow[]
  disclaimer?: string
  chartElementId?: string
  // Rich engineering result sections
  adequacyStatus?: 'PASS' | 'MARGINAL' | 'FAIL' | 'INFO'
  dcRatio?: number
  codeRef?: string
  codeClause?: string
  codeEdition?: string
  interpretation?: string
  steps?: Array<{ description: string; formula?: string; substituted?: string; result?: string }>
  recommendations?: string[]
  assumptions?: string[]
  validityNote?: string
  standardTableTitle?: string
  standardTable?: Array<{ label: string; value: string; highlight?: boolean }>
  criticalParam?: string
  sensitivityNote?: string
}

const SITE = 'Roughtools'
const SITE_URL = 'roughtools.com'
const DISCLAIMER_DEFAULT =
  'Results are intended for informational and educational purposes only. ' +
  'All outputs should be verified by a qualified professional before use in any financial, ' +
  'engineering, medical, or legal decision. Roughtools makes no warranties regarding accuracy. ' +
  'Local codes, regulations, and individual circumstances may vary significantly.'

// ─── helper to add a section heading ──────────────────────────
function sectionHead(doc: any, text: string, y: number, M: number): number {
  doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(30, 30, 30)
  doc.text(text, M, y)
  doc.setDrawColor(200, 200, 200)
  doc.line(M, y + 1.5, 210 - M, y + 1.5)
  return y + 6
}

// ─── helper to add a body paragraph ───────────────────────────
function bodyText(doc: any, text: string, y: number, M: number, CW: number): number {
  doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(60, 60, 60)
  const lines = doc.splitTextToSize(text, CW)
  doc.text(lines, M, y)
  return y + lines.length * 4.5 + 3
}

export async function exportCalcPDF(cfg: CalcPDFConfig): Promise<void> {
  const { jsPDF } = await import('jspdf/dist/jspdf.umd.min.js')
  const { default: autoTable } = await import('jspdf-autotable')

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const W = 210, M = 15, CW = W - M * 2
  let y = M

  // ── Header ───────────────────────────────────────────────────
  doc.setFillColor(14, 116, 144)           // sky-700
  doc.rect(0, 0, W, 32, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(16); doc.setFont('helvetica', 'bold')
  doc.text(SITE, M, 11)
  doc.setFontSize(9); doc.setFont('helvetica', 'normal')
  doc.text(SITE_URL, M, 17)
  doc.setFontSize(12); doc.setFont('helvetica', 'bold')
  doc.text(cfg.toolName, W - M, 11, { align: 'right' })
  doc.setFontSize(8); doc.setFont('helvetica', 'normal')
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  doc.text(`Generated: ${dateStr}`, W - M, 17, { align: 'right' })

  // Project info sub-header
  if (cfg.projectName || cfg.engineerName) {
    doc.setFillColor(7, 89, 110)
    doc.rect(0, 24, W, 8, 'F')
    doc.setFontSize(8); doc.setTextColor(200, 240, 255)
    if (cfg.projectName) doc.text(`Project: ${cfg.projectName}`, M, 29)
    if (cfg.engineerName) doc.text(`Engineer: ${cfg.engineerName}`, W - M, 29, { align: 'right' })
  }
  y = (cfg.projectName || cfg.engineerName) ? 38 : 38

  // ── Chart image (if provided) ─────────────────────────────────
  if (cfg.chartElementId && typeof window !== 'undefined') {
    try {
      const { default: html2canvas } = await import('html2canvas')
      const el = document.getElementById(cfg.chartElementId)
      if (el) {
        const canvas = await html2canvas(el, { backgroundColor: '#ffffff', scale: 2 })
        const imgData = canvas.toDataURL('image/png')
        const imgH = (canvas.height / canvas.width) * CW
        doc.addImage(imgData, 'PNG', M, y, CW, Math.min(imgH, 80))
        y += Math.min(imgH, 80) + 6
      }
    } catch { /* chart capture failed — skip */ }
  }

  // ── Inputs table ─────────────────────────────────────────────
  doc.setTextColor(30, 30, 30)
  doc.setFontSize(12); doc.setFont('helvetica', 'bold')
  doc.text('Inputs', M, y); y += 6

  autoTable(doc, {
    startY: y,
    margin: { left: M, right: M },
    head: [['Field', 'Value']],
    body: cfg.inputs.map(i => [i.label, `${i.value}${i.unit ? ' ' + i.unit : ''}`]),
    headStyles: { fillColor: [99, 91, 255], textColor: 255, fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { fontSize: 9 },
    alternateRowStyles: { fillColor: [248, 248, 255] },
    columnStyles: { 0: { cellWidth: 90 }, 1: { cellWidth: CW - 90 } },
    theme: 'striped',
  })
  y = (doc as any).lastAutoTable.finalY + 8

  // ── Results table ─────────────────────────────────────────────
  doc.setFontSize(12); doc.setFont('helvetica', 'bold')
  doc.text('Results', M, y); y += 6

  autoTable(doc, {
    startY: y,
    margin: { left: M, right: M },
    head: [['Result', 'Value']],
    body: cfg.results.map(r => [r.label, `${r.value}${r.unit ? ' ' + r.unit : ''}`]),
    headStyles: { fillColor: [16, 185, 129], textColor: 255, fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { fontSize: 9 },
    didParseCell: (data: any) => {
      const r = cfg.results[data.row.index]
      if (data.section === 'body' && r?.highlight) {
        data.cell.styles.fontStyle = 'bold'
        data.cell.styles.textColor = [67, 56, 202]
      }
    },
    alternateRowStyles: { fillColor: [240, 255, 248] },
    columnStyles: { 0: { cellWidth: 90 }, 1: { cellWidth: CW - 90 } },
    theme: 'striped',
  })
  y = (doc as any).lastAutoTable.finalY + 8

  // ── Adequacy status ───────────────────────────────────────────
  if (cfg.adequacyStatus && cfg.adequacyStatus !== 'INFO') {
    if (y > 240) { doc.addPage(); y = M }
    const statusColors: Record<string, [number,number,number]> = {
      PASS: [16, 185, 129], MARGINAL: [245, 158, 11], FAIL: [239, 68, 68]
    }
    const col = statusColors[cfg.adequacyStatus] ?? [100,100,100]
    doc.setFillColor(...col)
    doc.roundedRect(M, y, CW, 8, 2, 2, 'F')
    doc.setTextColor(255, 255, 255); doc.setFontSize(9); doc.setFont('helvetica', 'bold')
    const statusLabel = cfg.adequacyStatus === 'PASS' ? 'ADEQUATE — PASS' : cfg.adequacyStatus === 'MARGINAL' ? 'MARGINAL — REVIEW REQUIRED' : 'INADEQUATE — FAIL'
    doc.text(statusLabel, M + 4, y + 5.5)
    if (cfg.dcRatio !== undefined) {
      doc.text(`D/C Ratio = ${cfg.dcRatio.toFixed(3)}`, W - M - 4, y + 5.5, { align: 'right' })
    }
    y += 12
  }

  // ── Code compliance ───────────────────────────────────────────
  if (cfg.codeRef) {
    if (y > 240) { doc.addPage(); y = M }
    y = sectionHead(doc, 'Code Compliance', y, M)
    const refLine = [cfg.codeRef, cfg.codeClause, cfg.codeEdition].filter(Boolean).join(' — ')
    y = bodyText(doc, refLine, y, M, CW)
  }

  // ── Interpretation ────────────────────────────────────────────
  if (cfg.interpretation) {
    if (y > 240) { doc.addPage(); y = M }
    y = sectionHead(doc, 'Engineering Interpretation', y, M)
    y = bodyText(doc, cfg.interpretation, y, M, CW)
  }

  // ── Formula ──────────────────────────────────────────────────
  if (cfg.formula) {
    if (y > 240) { doc.addPage(); y = M }
    y = sectionHead(doc, 'Formula Used', y, M)
    doc.setFontSize(9); doc.setFont('courier', 'normal'); doc.setTextColor(80, 80, 80)
    const lines = doc.splitTextToSize(cfg.formula, CW)
    doc.text(lines, M, y)
    y += lines.length * 5 + 6
    doc.setTextColor(30, 30, 30)
  }

  // ── Step-by-step calculation ──────────────────────────────────
  if (cfg.steps && cfg.steps.length > 0) {
    if (y > 220) { doc.addPage(); y = M }
    y = sectionHead(doc, 'Detailed Calculation Breakdown', y, M)
    for (let i = 0; i < cfg.steps.length; i++) {
      const step = cfg.steps[i]
      if (y > 260) { doc.addPage(); y = M }
      doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(14, 116, 144)
      doc.text(`${i + 1}. ${step.description}`, M, y); y += 5
      if (step.formula) {
        doc.setFont('courier', 'normal'); doc.setTextColor(80, 80, 80)
        const fl = doc.splitTextToSize(step.formula, CW - 6)
        doc.text(fl, M + 4, y); y += fl.length * 4.5 + 1
      }
      if (step.substituted) {
        doc.setFont('courier', 'italic'); doc.setTextColor(7, 89, 110)
        const sl = doc.splitTextToSize(step.substituted, CW - 6)
        doc.text(sl, M + 4, y); y += sl.length * 4.5 + 1
      }
      if (step.result) {
        doc.setFont('helvetica', 'bold'); doc.setTextColor(30, 30, 30)
        doc.text(step.result, M + 4, y); y += 5
      }
    }
    y += 2
  }

  // ── Recommendations ──────────────────────────────────────────
  if (cfg.recommendations && cfg.recommendations.length > 0) {
    if (y > 240) { doc.addPage(); y = M }
    y = sectionHead(doc, 'Design Recommendations', y, M)
    for (const rec of cfg.recommendations) {
      if (y > 270) { doc.addPage(); y = M }
      y = bodyText(doc, `→ ${rec}`, y, M, CW)
    }
  }

  // ── Assumptions ──────────────────────────────────────────────
  if (cfg.assumptions && cfg.assumptions.length > 0) {
    if (y > 240) { doc.addPage(); y = M }
    y = sectionHead(doc, 'Assumptions & Limitations', y, M)
    if (cfg.validityNote) y = bodyText(doc, cfg.validityNote, y, M, CW)
    for (const a of cfg.assumptions) {
      if (y > 270) { doc.addPage(); y = M }
      y = bodyText(doc, `• ${a}`, y, M, CW)
    }
  }

  // ── Sensitivity ───────────────────────────────────────────────
  if (cfg.criticalParam) {
    if (y > 240) { doc.addPage(); y = M }
    y = sectionHead(doc, 'Sensitivity Note', y, M)
    y = bodyText(doc, `Most critical parameter: ${cfg.criticalParam}. ${cfg.sensitivityNote ?? ''}`, y, M, CW)
  }

  // ── Standard reference table ──────────────────────────────────
  if (cfg.standardTable && cfg.standardTable.length > 0) {
    if (y > 220) { doc.addPage(); y = M }
    y = sectionHead(doc, cfg.standardTableTitle ?? 'Standard Reference Table', y, M)
    autoTable(doc, {
      startY: y,
      margin: { left: M, right: M },
      head: [['Classification / Parameter', 'Value']],
      body: cfg.standardTable.map(r => [r.label, r.value]),
      headStyles: { fillColor: [67, 56, 202], textColor: 255, fontStyle: 'bold', fontSize: 8 },
      bodyStyles: { fontSize: 8 },
      didParseCell: (data: any) => {
        const row = cfg.standardTable![data.row.index]
        if (data.section === 'body' && row?.highlight) {
          data.cell.styles.fontStyle = 'bold'
          data.cell.styles.fillColor = [219, 234, 254]
          data.cell.styles.textColor = [30, 64, 175]
        }
      },
      theme: 'striped',
    })
    y = (doc as any).lastAutoTable.finalY + 8
  }

  // ── Amortization / breakdown table ───────────────────────────
  if (cfg.tableHeaders && cfg.tableRows && cfg.tableRows.length > 0) {
    if (y > 200) { doc.addPage(); y = M }
    doc.setFontSize(12); doc.setFont('helvetica', 'bold')
    doc.text('Detailed Breakdown', M, y); y += 6

    autoTable(doc, {
      startY: y,
      margin: { left: M, right: M },
      head: [cfg.tableHeaders],
      body: cfg.tableRows.map(row => cfg.tableHeaders!.map(h => row[h] ?? '')),
      headStyles: { fillColor: [67, 56, 202], textColor: 255, fontStyle: 'bold', fontSize: 8 },
      bodyStyles: { fontSize: 7.5 },
      alternateRowStyles: { fillColor: [248, 248, 255] },
      theme: 'striped',
    })
    y = (doc as any).lastAutoTable.finalY + 8
  }

  // ── Disclaimer ───────────────────────────────────────────────
  if (y > 240) { doc.addPage(); y = M }
  doc.setFillColor(255, 243, 205)
  const disclaimerText = cfg.disclaimer ?? DISCLAIMER_DEFAULT
  const dlines = doc.setFontSize(8).splitTextToSize('⚠ DISCLAIMER: ' + disclaimerText, CW - 8)
  const dh = dlines.length * 4.5 + 6
  doc.rect(M, y, CW, dh, 'F')
  doc.setDrawColor(245, 158, 11)
  doc.rect(M, y, CW, dh, 'S')
  doc.setTextColor(92, 60, 0)
  doc.setFont('helvetica', 'normal')
  doc.text(dlines, M + 4, y + 5)
  y += dh + 6

  // ── Footer on every page ─────────────────────────────────────
  const pages = doc.getNumberOfPages()
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i)
    doc.setFontSize(8); doc.setTextColor(150)
    doc.setFont('helvetica', 'normal')
    doc.text(`Generated by ${SITE} (${SITE_URL}) — for informational purposes only`, M, 290)
    doc.text(`Page ${i} of ${pages}`, W - M, 290, { align: 'right' })
  }

  const slug = cfg.fileName ?? cfg.toolName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  const date = new Date().toISOString().slice(0, 10)
  doc.save(`${slug}-results-${date}.pdf`)
}
