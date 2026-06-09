export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument } from 'pdf-lib'

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file = form.get('file') as File | null
    const order = (form.get('order') as string) || ''
    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    if (!order) return NextResponse.json({ error: 'Provide new page order, e.g. "3,1,2,4"' }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())
    const src = await PDFDocument.load(buffer, { ignoreEncryption: true })
    const total = src.getPageCount()

    const indices = order
      .split(',')
      .map(s => parseInt(s.trim(), 10) - 1)
      .filter(i => i >= 0 && i < total)

    if (indices.length === 0)
      return NextResponse.json({ error: 'No valid page order provided' }, { status: 400 })

    const out = await PDFDocument.create()
    const copied = await out.copyPages(src, indices)
    copied.forEach(p => out.addPage(p))

    const bytes = await out.save({ useObjectStreams: true })
    return new NextResponse(new Uint8Array(bytes), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="organized.pdf"',
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Organize failed' }, { status: 500 })
  }
}
