export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { pdfGuard } from '../_lib/pdf-guards'

export async function POST(req: NextRequest) {
  const guard = pdfGuard(req)
  if (guard) return guard
  try {
    const form = await req.formData()
    const files = form.getAll('files') as File[]

    if (files.length < 2)
      return NextResponse.json({ error: 'Please upload 2 PDF files to compare' }, { status: 400 })

    const [bufA, bufB] = await Promise.all([
      Buffer.from(await files[0].arrayBuffer()),
      Buffer.from(await files[1].arrayBuffer()),
    ])

    const [pdfA, pdfB] = await Promise.all([
      PDFDocument.load(bufA, { ignoreEncryption: true }),
      PDFDocument.load(bufB, { ignoreEncryption: true }),
    ])

    // Create a comparison report PDF
    const report = await PDFDocument.create()
    const font = await report.embedFont(StandardFonts.Helvetica)
    const bold = await report.embedFont(StandardFonts.HelveticaBold)

    const page = report.addPage([595, 842]) // A4
    const { width, height } = page.getSize()

    // Header
    page.drawRectangle({ x: 0, y: height - 60, width, height: 60, color: rgb(0.1, 0.3, 0.7) })
    page.drawText('PDF Comparison Report', { x: 30, y: height - 38, size: 20, font: bold, color: rgb(1, 1, 1) })

    let y = height - 90
    const line = (label: string, val: string, highlight = false) => {
      page.drawText(label, { x: 40, y, size: 11, font: bold, color: rgb(0.2, 0.2, 0.2) })
      page.drawText(val, { x: 200, y, size: 11, font, color: highlight ? rgb(0.8, 0.1, 0.1) : rgb(0.1, 0.5, 0.1) })
      y -= 22
    }

    line('File A:', files[0].name)
    line('File B:', files[1].name)
    y -= 10
    page.drawLine({ start: { x: 40, y }, end: { x: width - 40, y }, thickness: 1, color: rgb(0.8, 0.8, 0.8) })
    y -= 20

    const pagesA = pdfA.getPageCount()
    const pagesB = pdfB.getPageCount()
    const sizeA = (bufA.length / 1024).toFixed(1) + ' KB'
    const sizeB = (bufB.length / 1024).toFixed(1) + ' KB'

    line('Pages (A):', String(pagesA))
    line('Pages (B):', String(pagesB))
    line('Page count difference:', pagesA !== pagesB ? `${Math.abs(pagesA - pagesB)} pages differ` : 'Same', pagesA !== pagesB)
    y -= 10
    line('File size (A):', sizeA)
    line('File size (B):', sizeB)
    y -= 10

    page.drawText('Note: Deep content comparison (text/image diffing) requires advanced processing.', {
      x: 40, y, size: 9, font, color: rgb(0.5, 0.5, 0.5)
    })
    y -= 16
    page.drawText('This report shows structural metadata differences only.', {
      x: 40, y, size: 9, font, color: rgb(0.5, 0.5, 0.5)
    })

    const out = await report.save({ useObjectStreams: true })
    return new NextResponse(new Uint8Array(out), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="comparison-report.pdf"',
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Comparison failed' }, { status: 500 })
  }
}
