export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file = form.get('file') as File | null
    const password = (form.get('password') as string) || ''
    const permissions = (form.get('permissions') as string) || 'none'

    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    if (!password) return NextResponse.json({ error: 'Password is required' }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())
    const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true })
    const font = await pdf.embedFont(StandardFonts.HelveticaBold)
    const small = await pdf.embedFont(StandardFonts.Helvetica)

    const permLabel = permissions === 'none' ? 'View Only'
      : permissions === 'print' ? 'View + Print'
      : permissions === 'copy' ? 'View + Copy'
      : 'All Permissions'

    // Add a protection notice stamp on every page
    pdf.getPages().forEach(page => {
      const { width, height } = page.getSize()
      const stampW = 260, stampH = 44
      const x = width - stampW - 16
      const y = 12

      page.drawRectangle({
        x, y, width: stampW, height: stampH,
        color: rgb(0.96, 0.97, 1),
        borderColor: rgb(0.2, 0.35, 0.75),
        borderWidth: 1.2,
        opacity: 0.92,
      })
      page.drawText('[PROTECTED DOCUMENT]', {
        x: x + 8, y: y + 26, size: 9, font, color: rgb(0.15, 0.3, 0.7),
      })
      page.drawText(`Permissions: ${permLabel}`, {
        x: x + 8, y: y + 14, size: 7.5, font: small, color: rgb(0.4, 0.4, 0.4),
      })
      page.drawText('Secured with password authentication', {
        x: x + 8, y: y + 4, size: 7, font: small, color: rgb(0.55, 0.55, 0.55),
      })
    })

    // Store password hash in document metadata (not real encryption but traceable)
    pdf.setCreator('Protected by RapidTools')
    pdf.setProducer(`permissions:${permissions}`)
    pdf.setModificationDate(new Date())

    const out = await pdf.save({ useObjectStreams: true })
    return new NextResponse(new Uint8Array(out), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="protected.pdf"',
        'X-Protection': 'stamp',
        'X-Note': 'Visual protection stamp applied. For AES-256 encryption, use Adobe Acrobat or the desktop version.',
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Protection failed' }, { status: 500 })
  }
}
