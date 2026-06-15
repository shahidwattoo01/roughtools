export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { pdfGuard, pdfSizeGuard } from '../_lib/pdf-guards'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file = form.get('file') as File | null
    const sizeGuard = pdfSizeGuard(file)
    if (sizeGuard) return sizeGuard

    const text = (form.get('text') as string) || ''
    const pageNum = Math.max(1, parseInt((form.get('page') as string) || '1', 10))
    const xPos = parseFloat((form.get('x') as string) || '50')
    const yPos = parseFloat((form.get('y') as string) || '50')
    const fontSize = Math.min(72, Math.max(6, parseInt((form.get('fontSize') as string) || '12', 10)))

    const buffer = Buffer.from(await file.arrayBuffer())
    const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true })
    const pages = pdf.getPages()

    if (text && pages.length >= pageNum) {
      const page = pages[pageNum - 1]
      const { height } = page.getSize()
      const font = await pdf.embedFont(StandardFonts.Helvetica)
      page.drawText(text, {
        x: xPos,
        y: height - yPos,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      })
    }

    const out = await pdf.save({ useObjectStreams: true })
    return new NextResponse(new Uint8Array(out), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="edited.pdf"',
      },
    })
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || 'Edit failed' }, { status: 500 })
  }
}
