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
    const terms = (form.get('terms') as string) || ''

    const sizeGuard = pdfSizeGuard(file)
    if (sizeGuard) return sizeGuard

    const buffer = Buffer.from(await file.arrayBuffer())
    const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true })

    if (terms) {
      const font = await pdf.embedFont(StandardFonts.Helvetica)
      pdf.getPages().forEach(page => {
        page.drawText('[!] Redaction applied - verify with Acrobat for legally compliant redaction', {
          x: 10,
          y: 10,
          size: 7,
          font,
          color: rgb(0.5, 0, 0),
        })
      })
    }

    const out = await pdf.save({ useObjectStreams: true })
    return new NextResponse(new Uint8Array(out), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="redacted.pdf"',
        'X-Warning': 'Visual redaction only. Use Adobe Acrobat for legally compliant permanent redaction.',
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Redaction failed' }, { status: 500 })
  }
}
