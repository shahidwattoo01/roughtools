export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument } from 'pdf-lib'

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const files = form.getAll('files') as File[]
    if (!files || files.length < 2)
      return NextResponse.json({ error: 'Please upload at least 2 PDF files' }, { status: 400 })

    const merged = await PDFDocument.create()

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer())
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true })
      const pages = await merged.copyPages(pdf, pdf.getPageIndices())
      pages.forEach(p => merged.addPage(p))
    }

    const out = await merged.save({ useObjectStreams: true })

    return new NextResponse(new Uint8Array(out), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="merged.pdf"',
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Merge failed' }, { status: 500 })
  }
}
