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
    const sigText = (form.get('signature') as string) || 'Signed'
    const position = (form.get('position') as string) || 'bottom-right'
    const page = parseInt((form.get('page') as string) || '0', 10)

    const sizeGuard = pdfSizeGuard(file)
    if (sizeGuard) return sizeGuard

    const buffer = Buffer.from(await file.arrayBuffer())
    const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true })
    const font = await pdf.embedFont(StandardFonts.HelveticaBold)

    const pages = pdf.getPages()
    const targetPage = pages[Math.min(page, pages.length - 1)]
    const { width, height } = targetPage.getSize()

    const fontSize = 14
    const textWidth = font.widthOfTextAtSize(sigText, fontSize)
    const margin = 30

    let x = width - textWidth - margin
    let y = margin

    if (position.includes('top')) y = height - margin - fontSize
    if (position.includes('left')) x = margin
    if (position.includes('center')) x = (width - textWidth) / 2

    // Draw a signature box
    targetPage.drawRectangle({
      x: x - 8,
      y: y - 6,
      width: textWidth + 16,
      height: fontSize + 14,
      borderColor: rgb(0.1, 0.3, 0.7),
      borderWidth: 1,
      color: rgb(0.93, 0.96, 1),
      opacity: 0.85,
    })

    // Draw signature text
    targetPage.drawText(sigText, {
      x,
      y: y + 2,
      size: fontSize,
      font,
      color: rgb(0.05, 0.2, 0.6),
    })

    // Draw a small "Signed" label above
    targetPage.drawText('** Digitally Signed', {
      x: x - 8,
      y: y + fontSize + 8,
      size: 7,
      font,
      color: rgb(0.3, 0.3, 0.3),
    })

    const out = await pdf.save({ useObjectStreams: true })
    return new NextResponse(new Uint8Array(out), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="signed.pdf"',
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Signing failed' }, { status: 500 })
  }
}
