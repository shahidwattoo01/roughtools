export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument } from 'pdf-lib'
import JSZip from 'jszip'

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file = form.get('file') as File | null
    const splitAt = (form.get('splitAt') as string) || ''
    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())
    const src = await PDFDocument.load(buffer, { ignoreEncryption: true })
    const total = src.getPageCount()

    // Parse split points (e.g. "2,5,8")
    const points: number[] = splitAt
      .split(',')
      .map(s => parseInt(s.trim(), 10))
      .filter(n => !isNaN(n) && n > 0 && n < total)
      .sort((a, b) => a - b)

    // Build ranges: [0..p1-1], [p1..p2-1], ...
    const ranges: [number, number][] = []
    let start = 0
    for (const p of points) {
      ranges.push([start, p - 1])
      start = p
    }
    ranges.push([start, total - 1])

    const zip = new JSZip()

    for (let i = 0; i < ranges.length; i++) {
      const [from, to] = ranges[i]
      const part = await PDFDocument.create()
      const pages = await part.copyPages(src, Array.from({ length: to - from + 1 }, (_, k) => from + k))
      pages.forEach(p => part.addPage(p))
      const bytes = await part.save({ useObjectStreams: true })
      zip.file(`part-${i + 1}.pdf`, bytes)
    }

    const zipBuf = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' })

    return new NextResponse(new Uint8Array(zipBuf), {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="split.zip"',
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Split failed' }, { status: 500 })
  }
}
