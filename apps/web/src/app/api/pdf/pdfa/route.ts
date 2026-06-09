export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument } from 'pdf-lib'

// PDF/A conversion requires full color profile embedding (ICC) and XMP metadata.
// We apply XMP metadata + clean save as a best-effort lightweight PDF/A-like output.
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file = form.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())
    const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true })

    // Set PDF/A-like metadata
    pdf.setTitle(file.name.replace(/\.pdf$/i, ''))
    pdf.setCreator('RapidTools PDF Converter')
    pdf.setProducer('pdf-lib')
    pdf.setCreationDate(new Date())
    pdf.setModificationDate(new Date())

    const out = await pdf.save({ useObjectStreams: false }) // PDF/A prefers no object streams

    return new NextResponse(new Uint8Array(out), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="archive.pdf"',
        'X-Warning': 'Best-effort PDF/A output. Full ISO 19005 compliance requires professional software.',
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'PDF/A conversion failed' }, { status: 500 })
  }
}
