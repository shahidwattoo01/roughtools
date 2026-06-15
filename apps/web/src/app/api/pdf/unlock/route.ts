export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { pdfGuard, pdfSizeGuard } from '../_lib/pdf-guards'
import { PDFDocument } from 'pdf-lib'

export async function POST(req: NextRequest) {
  const guard = pdfGuard(req)
  if (guard) return guard
  try {
    const form = await req.formData()
    const file = form.get('file') as File | null
    const sizeGuard = pdfSizeGuard(file)
    if (sizeGuard) return sizeGuard

    const buffer = Buffer.from(await file.arrayBuffer())

    // Load ignoring encryption, then re-save without restrictions
    const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true })
    const out = await pdf.save({ useObjectStreams: true })

    return new NextResponse(new Uint8Array(out), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="unlocked.pdf"',
      },
    })
  } catch (err: any) {
    return NextResponse.json({
      error: err.message || 'Unlock failed - PDF may use strong AES-256 encryption',
    }, { status: 500 })
  }
}
