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
    const pages = (form.get('pages') as string) || ''
    const sizeGuard = pdfSizeGuard(file)
    if (sizeGuard) return sizeGuard
    if (!pages) return NextResponse.json({ error: 'Specify pages to extract, e.g. "1,3,5-8"' }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())
    const src = await PDFDocument.load(buffer, { ignoreEncryption: true })
    const total = src.getPageCount()

    // Parse "1,3,5-8" â†’ [0,2,4,5,6,7] (0-indexed)
    const indices = new Set<number>()
    for (const part of pages.split(',')) {
      const range = part.trim().split('-').map(s => parseInt(s.trim(), 10))
      if (range.length === 1) {
        const i = range[0] - 1
        if (i >= 0 && i < total) indices.add(i)
      } else {
        for (let i = range[0] - 1; i <= range[1] - 1; i++) {
          if (i >= 0 && i < total) indices.add(i)
        }
      }
    }

    if (indices.size === 0)
      return NextResponse.json({ error: 'No valid pages specified' }, { status: 400 })

    const out = await PDFDocument.create()
    const copied = await out.copyPages(src, [...indices].sort((a, b) => a - b))
    copied.forEach(p => out.addPage(p))

    const bytes = await out.save({ useObjectStreams: true })
    return new NextResponse(new Uint8Array(bytes), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="extracted.pdf"',
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Extract failed' }, { status: 500 })
  }
}
