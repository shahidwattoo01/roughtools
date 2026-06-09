export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument } from 'pdf-lib'

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file = form.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())

    // Load with all fault-tolerance flags enabled, then re-save cleanly
    const pdf = await PDFDocument.load(buffer, {
      ignoreEncryption: true,
      // pdf-lib tolerates many malformed PDFs during load
    })

    const out = await pdf.save({ useObjectStreams: true })

    return new NextResponse(new Uint8Array(out), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="repaired.pdf"',
      },
    })
  } catch (err: any) {
    return NextResponse.json(
      {
        error:
          err.message ||
          'Repair failed - the PDF may be severely corrupted. Try opening it in Adobe Acrobat and re-saving.',
      },
      { status: 500 }
    )
  }
}
