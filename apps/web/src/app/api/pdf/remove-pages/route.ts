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
    if (!pages) return NextResponse.json({ error: 'Specify pages to remove, e.g. "1,3,5-8"' }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())
    const src = await PDFDocument.load(buffer, { ignoreEncryption: true })
    const total = src.getPageCount()

    // Parse pages to remove (0-indexed)
    const remove = new Set<number>()
    for (const part of pages.split(',')) {
      const range = part.trim().split('-').map(s => parseInt(s.trim(), 10))
      if (range.length === 1) {
        const i = range[0] - 1
        if (i >= 0 && i < total) remove.add(i)
      } else {
        for (let i = range[0] - 1; i <= range[1] - 1; i++) {
          if (i >= 0 && i < total) remove.add(i)
        }
      }
    }

    const keep = Array.from({ length: total }, (_, i) => i).filter(i => !remove.has(i))
    if (keep.length === 0)
      return NextResponse.json({ error: 'Cannot remove all pages' }, { status: 400 })

    const out = await PDFDocument.create()
    const copied = await out.copyPages(src, keep)
    copied.forEach(p => out.addPage(p))

    const bytes = await out.save({ useObjectStreams: true })
    return new NextResponse(new Uint8Array(bytes), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="removed-pages.pdf"',
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Remove pages failed' }, { status: 500 })
  }
}
