export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { pdfGuard, pdfSizeGuard } from '../_lib/pdf-guards'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

export async function POST(req: NextRequest) {
  const guard = pdfGuard(req)
  if (guard) return guard
  try {
    const form = await req.formData()
    const file = form.get('file') as File | null
    const position = (form.get('position') as string) || 'bottom-center'
    const startAt = parseInt((form.get('startFrom') as string) || (form.get('startAt') as string) || '1', 10)
    const sizeGuard = pdfSizeGuard(file)
    if (sizeGuard) return sizeGuard

    const buffer = Buffer.from(await file.arrayBuffer())
    const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true })
    const font = await pdf.embedFont(StandardFonts.Helvetica)
    const fontSize = 11

    pdf.getPages().forEach((page, i) => {
      const { width, height } = page.getSize()
      const label = String(startAt + i)
      const textWidth = font.widthOfTextAtSize(label, fontSize)
      const margin = 24

      let x = (width - textWidth) / 2  // center
      let y = margin                     // bottom

      if (position.includes('top')) y = height - margin - fontSize
      if (position.includes('left')) x = margin
      if (position.includes('right')) x = width - textWidth - margin

      page.drawText(label, { x, y, size: fontSize, font, color: rgb(0.3, 0.3, 0.3) })
    })

    const out = await pdf.save({ useObjectStreams: true })
    return new NextResponse(new Uint8Array(out), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="numbered.pdf"',
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Page numbering failed' }, { status: 500 })
  }
}
