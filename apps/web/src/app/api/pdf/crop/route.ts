export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument } from 'pdf-lib'

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file = form.get('file') as File | null
    const marginTop = parseFloat((form.get('marginTop') as string) || '0')
    const marginBottom = parseFloat((form.get('marginBottom') as string) || '0')
    const marginLeft = parseFloat((form.get('marginLeft') as string) || '0')
    const marginRight = parseFloat((form.get('marginRight') as string) || '0')

    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())
    const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true })

    pdf.getPages().forEach(page => {
      const { width, height } = page.getSize()
      // Adjust the crop box (visible area) by shrinking from each edge
      page.setCropBox(
        marginLeft,
        marginBottom,
        width - marginLeft - marginRight,
        height - marginTop - marginBottom
      )
    })

    const out = await pdf.save({ useObjectStreams: true })
    return new NextResponse(new Uint8Array(out), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="cropped.pdf"',
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Crop failed' }, { status: 500 })
  }
}
