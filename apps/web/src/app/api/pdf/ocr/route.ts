export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { pdfGuard, pdfSizeGuard } from '../_lib/pdf-guards'
import { extractPdfText } from '../_lib/extract-text'

export async function POST(req: NextRequest) {
  const guard = pdfGuard(req)
  if (guard) return guard
  try {
    const form = await req.formData()
    const file = form.get('file') as File | null
    const sizeGuard = pdfSizeGuard(file)
    if (sizeGuard) return sizeGuard

    const buffer = Buffer.from(await file.arrayBuffer())
    const { text, numPages } = await extractPdfText(buffer)
    const baseName = file.name.replace(/\.pdf$/i, '')

    if (!text.trim())
      return NextResponse.json({
        error: 'This PDF contains no selectable text — it is fully image-based. True OCR (Tesseract) is not available in the browser version. Please use a desktop OCR tool such as Adobe Acrobat, ABBYY FineReader, or the free online Smallpdf OCR.',
      }, { status: 422 })

    return new NextResponse(text, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="${baseName}-text.txt"`,
        'X-Page-Count': String(numPages),
        'X-Char-Count': String(text.length),
      },
    })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'OCR failed' }, { status: 500 })
  }
}
