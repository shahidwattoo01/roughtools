export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument } from 'pdf-lib'

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file = form.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())
    const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true })

    // Remove metadata to reduce size
    pdfDoc.setTitle('')
    pdfDoc.setAuthor('')
    pdfDoc.setSubject('')
    pdfDoc.setKeywords([])
    pdfDoc.setProducer('')
    pdfDoc.setCreator('')

    const compressed = await pdfDoc.save({ useObjectStreams: true, addDefaultPage: false })
    const savedBytes = buffer.length - compressed.length

    return new NextResponse(new Uint8Array(compressed), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="compressed.pdf"`,
        'X-Original-Size': String(buffer.length),
        'X-Compressed-Size': String(compressed.length),
        'X-Saved-Bytes': String(Math.max(0, savedBytes)),
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Compression failed' }, { status: 500 })
  }
}
