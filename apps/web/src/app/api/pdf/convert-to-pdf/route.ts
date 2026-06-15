export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { pdfGuard } from '../_lib/pdf-guards'

/* ── DOCX → PDF via mammoth ──────────────────────────────────────── */
async function docxToPdf(file: File): Promise<NextResponse> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mammoth = require('mammoth')
  const buffer = Buffer.from(await file.arrayBuffer())
  const result = await mammoth.extractRawText({ buffer })
  const rawText: string = result.value || ''

  if (!rawText.trim())
    return NextResponse.json({ error: 'Could not extract text from this Word document.' }, { status: 422 })

  const doc = await PDFDocument.create()
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const bold = await doc.embedFont(StandardFonts.HelveticaBold)
  const pageW = 595, pageH = 842, margin = 50, lineH = 16, fontSize = 11

  let page = doc.addPage([pageW, pageH])
  let y = pageH - margin

  const lines = rawText.split('\n').map((l: string) => l.trim())
  for (const line of lines) {
    if (y < margin + lineH) { page = doc.addPage([pageW, pageH]); y = pageH - margin }
    if (!line) { y -= lineH * 0.5; continue }

    const words = line.split(' ')
    let current = ''
    const isTitle = line.length < 80 && line === line.toUpperCase()
    const f = isTitle ? bold : font
    const sz = isTitle ? 13 : fontSize

    for (const word of words) {
      const test = current ? current + ' ' + word : word
      if (f.widthOfTextAtSize(test, sz) > pageW - margin * 2) {
        if (y < margin + lineH) { page = doc.addPage([pageW, pageH]); y = pageH - margin }
        page.drawText(current, { x: margin, y, size: sz, font: f, color: rgb(0, 0, 0) })
        y -= lineH
        current = word
      } else {
        current = test
      }
    }
    if (current) {
      if (y < margin + lineH) { page = doc.addPage([pageW, pageH]); y = pageH - margin }
      page.drawText(current, { x: margin, y, size: sz, font: f, color: rgb(0, 0, 0) })
    }
    y -= isTitle ? lineH * 1.5 : lineH
  }

  const bytes = await doc.save({ useObjectStreams: true })
  const baseName = file.name.replace(/\.(docx?|txt)$/i, '')
  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${baseName}.pdf"`,
    },
  })
}

/* ── XLSX → PDF via xlsx ─────────────────────────────────────────── */
async function xlsxToPdf(file: File): Promise<NextResponse> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const XLSX = require('xlsx')
  const buffer = Buffer.from(await file.arrayBuffer())
  const wb = XLSX.read(buffer, { type: 'buffer' })

  const doc = await PDFDocument.create()
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const bold = await doc.embedFont(StandardFonts.HelveticaBold)
  const pageW = 842, pageH = 595  // landscape A4
  const margin = 40, rowH = 16, fontSize = 9, headSize = 10

  for (const sheetName of wb.SheetNames) {
    const ws = wb.Sheets[sheetName]
    const rows: string[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' })
    if (!rows.length) continue

    let page = doc.addPage([pageW, pageH])
    let y = pageH - margin

    page.drawText(sheetName, { x: margin, y, size: 12, font: bold, color: rgb(0.1, 0.3, 0.7) })
    y -= rowH * 1.5

    const numCols = Math.max(...rows.map((r: string[]) => r.length))
    const colW = Math.min(140, (pageW - margin * 2) / numCols)

    rows.forEach((row: string[], ri: number) => {
      if (y < margin + rowH) { page = doc.addPage([pageW, pageH]); y = pageH - margin }
      const isHeader = ri === 0
      const bg = isHeader ? rgb(0.15, 0.35, 0.75) : ri % 2 === 0 ? rgb(0.95, 0.97, 1) : rgb(1, 1, 1)

      page.drawRectangle({ x: margin, y: y - 2, width: pageW - margin * 2, height: rowH, color: bg })

      row.forEach((cell: string, ci: number) => {
        const text = String(cell ?? '').substring(0, 22)
        const x = margin + ci * colW + 3
        if (x + colW > pageW - margin) return
        page.drawText(text, { x, y: y + 2, size: isHeader ? headSize : fontSize, font: isHeader ? bold : font, color: isHeader ? rgb(1, 1, 1) : rgb(0.1, 0.1, 0.1) })
      })
      y -= rowH
    })
  }

  const bytes = await doc.save({ useObjectStreams: true })
  const baseName = file.name.replace(/\.(xlsx?|csv)$/i, '')
  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${baseName}.pdf"`,
    },
  })
}

/* ── Images → PDF via pdf-lib ────────────────────────────────────── */
async function imagesToPdf(files: File[]): Promise<NextResponse> {
  const doc = await PDFDocument.create()
  for (const file of files) {
    const buf = Buffer.from(await file.arrayBuffer())
    const ext = file.name.split('.').pop()?.toLowerCase() || ''
    try {
      const img = ext === 'png' ? await doc.embedPng(buf) : await doc.embedJpg(buf)
      const page = doc.addPage([img.width, img.height])
      page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height })
    } catch { /* skip unembeddable files */ }
  }
  if (doc.getPageCount() === 0)
    return NextResponse.json({ error: 'Could not embed any images. Please upload JPG or PNG files.' }, { status: 400 })

  const bytes = await doc.save({ useObjectStreams: true })
  const baseName = files[0].name.replace(/\.[^.]+$/, '')
  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${baseName}.pdf"`,
    },
  })
}

/* ── HTML → PDF via text extraction + pdf-lib ───────────────────── */
async function htmlToPdf(file: File): Promise<NextResponse> {
  const html = await file.text()

  // Strip tags, decode common entities
  const text = html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]{2,}/g, ' ')
    .trim()

  if (!text)
    return NextResponse.json({ error: 'No text content found in this HTML file.' }, { status: 422 })

  const doc = await PDFDocument.create()
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const pageW = 595, pageH = 842, margin = 50, lineH = 16, fontSize = 11

  let page = doc.addPage([pageW, pageH])
  let y = pageH - margin

  const paragraphs = text.split(/\n+/)
  for (const para of paragraphs) {
    const trimmed = para.trim()
    if (!trimmed) { y -= lineH * 0.5; continue }

    const words = trimmed.split(' ')
    let current = ''

    for (const word of words) {
      if (!word) continue
      const test = current ? current + ' ' + word : word
      if (font.widthOfTextAtSize(test, fontSize) > pageW - margin * 2) {
        if (y < margin + lineH) { page = doc.addPage([pageW, pageH]); y = pageH - margin }
        page.drawText(current, { x: margin, y, size: fontSize, font, color: rgb(0, 0, 0) })
        y -= lineH
        current = word
      } else {
        current = test
      }
    }
    if (current) {
      if (y < margin + lineH) { page = doc.addPage([pageW, pageH]); y = pageH - margin }
      page.drawText(current, { x: margin, y, size: fontSize, font, color: rgb(0, 0, 0) })
      y -= lineH
    }
    y -= lineH * 0.4
  }

  const bytes = await doc.save({ useObjectStreams: true })
  const baseName = file.name.replace(/\.(html?)$/i, '')
  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${baseName}.pdf"`,
    },
  })
}

/* ── PPTX → PDF via jszip XML extraction + pdf-lib ─────────────── */
async function pptxToPdf(file: File): Promise<NextResponse> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const JSZip = require('jszip')

  const buffer = Buffer.from(await file.arrayBuffer())
  const zip = await JSZip.loadAsync(buffer)

  // Find and sort slide XML files
  const slideFiles = Object.keys(zip.files)
    .filter((name: string) => /^ppt\/slides\/slide\d+\.xml$/.test(name))
    .sort((a: string, b: string) => {
      const na = parseInt(a.match(/(\d+)\.xml$/)?.[1] || '0', 10)
      const nb = parseInt(b.match(/(\d+)\.xml$/)?.[1] || '0', 10)
      return na - nb
    })

  if (!slideFiles.length)
    return NextResponse.json({ error: 'No slides found in this PowerPoint file.' }, { status: 422 })

  const doc = await PDFDocument.create()
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const bold = await doc.embedFont(StandardFonts.HelveticaBold)
  const pageW = 960, pageH = 540 // 16:9 widescreen
  const margin = 40

  for (const slideFile of slideFiles) {
    const xml: string = await zip.files[slideFile].async('string')

    // Extract text from <a:t> elements in order
    const texts: string[] = []
    const re = /<a:t[^>]*>([^<]*)<\/a:t>/g
    let m
    while ((m = re.exec(xml)) !== null) {
      const t = m[1].trim()
      if (t) texts.push(t)
    }

    const page = doc.addPage([pageW, pageH])

    // Slide background + top bar
    page.drawRectangle({ x: 0, y: 0, width: pageW, height: pageH, color: rgb(0.98, 0.98, 1) })
    page.drawRectangle({ x: 0, y: pageH - 10, width: pageW, height: 10, color: rgb(0.15, 0.35, 0.75) })

    let y = pageH - margin - 16
    let first = true

    for (const txt of texts) {
      const sz = first ? 18 : 11
      const f = first ? bold : font
      const maxW = pageW - margin * 2
      const words = txt.split(' ')
      let line = ''

      for (const word of words) {
        if (!word) continue
        const test = line ? line + ' ' + word : word
        if (f.widthOfTextAtSize(test, sz) > maxW) {
          if (y < margin) break
          page.drawText(line, { x: margin, y, size: sz, font: f, color: first ? rgb(0.1, 0.2, 0.6) : rgb(0.15, 0.15, 0.15) })
          y -= sz * 1.4
          line = word
        } else {
          line = test
        }
      }
      if (line && y >= margin) {
        page.drawText(line, { x: margin, y, size: sz, font: f, color: first ? rgb(0.1, 0.2, 0.6) : rgb(0.15, 0.15, 0.15) })
        y -= first ? sz * 2 : sz * 1.4
      }
      first = false
    }
  }

  const bytes = await doc.save({ useObjectStreams: true })
  const baseName = file.name.replace(/\.(pptx?)$/i, '')
  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${baseName}.pdf"`,
    },
  })
}

/* ── Main handler ────────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  const guard = pdfGuard(req)
  if (guard) return guard
  try {
    const form = await req.formData()
    const format = ((form.get('format') as string) || '').toLowerCase()

    const fileList = form.getAll('files') as File[]
    const single = form.get('file') as File | null
    const allFiles = fileList.length > 0 ? fileList : single ? [single] : []
    if (allFiles.length === 0)
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 })

    const firstName = allFiles[0].name.toLowerCase()

    if (firstName.endsWith('.docx') || firstName.endsWith('.doc') || format === 'docx')
      return docxToPdf(allFiles[0])

    if (firstName.endsWith('.xlsx') || firstName.endsWith('.xls') || firstName.endsWith('.csv') || format === 'xlsx')
      return xlsxToPdf(allFiles[0])

    if (firstName.endsWith('.pptx') || firstName.endsWith('.ppt') || format === 'pptx')
      return pptxToPdf(allFiles[0])

    if (firstName.endsWith('.html') || firstName.endsWith('.htm') || format === 'html')
      return htmlToPdf(allFiles[0])

    // Images (jpg, png, webp, bmp, gif)
    const imageExts = ['jpg', 'jpeg', 'png', 'webp', 'bmp', 'gif', 'tiff', 'tif']
    const isImage = allFiles.some(f => imageExts.includes(f.name.split('.').pop()?.toLowerCase() || ''))
    if (isImage || imageExts.includes(format))
      return imagesToPdf(allFiles)

    return NextResponse.json({ error: 'Unsupported file type. Supported: DOCX, XLSX, PPTX, HTML, JPG, PNG.' }, { status: 400 })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Conversion failed' }, { status: 500 })
  }
}
