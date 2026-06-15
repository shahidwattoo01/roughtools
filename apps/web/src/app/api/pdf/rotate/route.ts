export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { pdfGuard, pdfSizeGuard } from '../_lib/pdf-guards'
import { PDFDocument, degrees } from 'pdf-lib'

export async function POST(req: NextRequest) {
  const guard = pdfGuard(req)
  if (guard) return guard
  try {
    const form = await req.formData()
    const file = form.get('file') as File | null
    const angle = parseInt((form.get('angle') as string) || '90', 10)
    const sizeGuard = pdfSizeGuard(file)
    if (sizeGuard) return sizeGuard
    if (![90, 180, 270].includes(angle))
      return NextResponse.json({ error: 'Angle must be 90, 180 or 270' }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())
    const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true })
    pdf.getPages().forEach(page => {
      page.setRotation(degrees((page.getRotation().angle + angle) % 360))
    })

    const out = await pdf.save({ useObjectStreams: true })
    return new NextResponse(new Uint8Array(out), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="rotated.pdf"',
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Rotate failed' }, { status: 500 })
  }
}
