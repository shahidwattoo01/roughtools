export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { pdfGuard, pdfSizeGuard } from '../_lib/pdf-guards'
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib'

export async function POST(req: NextRequest) {
  const guard = pdfGuard(req)
  if (guard) return guard
  try {
    const form = await req.formData()
    const file = form.get('file') as File | null
    const text = (form.get('text') as string) || 'CONFIDENTIAL'
    const opacity = Math.min(1, Math.max(0.05, parseFloat((form.get('opacity') as string) || '0.3')))
    const sizeGuard = pdfSizeGuard(file)
    if (sizeGuard) return sizeGuard

    const buffer = Buffer.from(await file.arrayBuffer())
    const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true })
    const font = await pdf.embedFont(StandardFonts.HelveticaBold)

    for (const page of pdf.getPages()) {
      const { width, height } = page.getSize()
      const fontSize = Math.min(width, height) * 0.12
      const textWidth = font.widthOfTextAtSize(text, fontSize)
      page.drawText(text, {
        x: (width - textWidth) / 2,
        y: (height - fontSize) / 2,
        size: fontSize,
        font,
        color: rgb(0.5, 0.5, 0.5),
        opacity,
        rotate: degrees(45),
      })
    }

    const out = await pdf.save({ useObjectStreams: true })
    return new NextResponse(new Uint8Array(out), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="watermarked.pdf"',
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Watermark failed' }, { status: 500 })
  }
}
