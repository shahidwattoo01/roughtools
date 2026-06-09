import type { Metadata } from 'next'
import ImageToolShell from '@/components/image-tools/ImageToolShell'
import JpgToPngClient from './JpgToPngClient'
import { getImageToolSupplement } from '@/data/imageTools'

export const metadata: Metadata = {
  title: 'JPG to PNG Converter — Convert JPEG to PNG Free Online | Roughtools',
  description: 'Convert JPG/JPEG images to PNG format online for free. Lossless PNG output, supports transparency. 100% browser-based — your images are never uploaded to any server.',
  keywords: ['jpg to png', 'convert jpeg to png', 'jpg to png converter', 'jpeg to png online', 'convert jpg', 'jpg png free'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/image-tools/jpg-to-png' },
  openGraph: {
    title: 'JPG to PNG Converter — Free Online | Roughtools',
    description: 'Convert JPG to PNG losslessly. Preserve quality, get transparency support. Free.',
    url: 'https://roughtools.com/tools/image-tools/jpg-to-png',
    type: 'website', siteName: 'Roughtools',
  },
  twitter: { card: 'summary_large_image', title: 'JPG to PNG | Roughtools', description: 'Convert JPG images to lossless PNG format online free.' },
}


const _s = getImageToolSupplement('jpg-to-png')

export default function Page() {
  return (
    <ImageToolShell
      toolName="JPG to PNG Converter"
      toolSlug="jpg-to-png"
      icon="??"
      description="Convert JPG or JPEG images to PNG format with full lossless quality. PNG is the format of choice when you need transparency support, lossless editing, or when working with graphics, logos, and screenshots that need to remain pixel-perfect. All conversion happens in your browser — no files leave your device."
      howToSteps={[
        { name: 'Upload your JPG', text: 'Click the upload area or drag and drop your JPG or JPEG image. You can also upload WebP, BMP, or other formats to convert them to PNG.' },
        { name: 'Review the preview', text: 'The original image is displayed immediately. PNG output is lossless so what you see is exactly what you will get — no quality controls needed.' },
        { name: 'Convert', text: 'Click Convert. The browser decodes the JPG and re-encodes it as a lossless PNG. Processing is instant for most images.' },
        { name: 'Download', text: 'Download the PNG file. Note that PNG files are typically larger than JPG because they use lossless compression — this is normal and expected.' },
      ]}
      useCases={[
        { title: 'Preparing images for editing', description: 'Every time you save a JPG, quality is lost. Convert to PNG before editing in any image editor so you can save repeatedly without accumulating quality degradation.' },
        { title: 'Background removal', description: 'PNG supports transparency, JPG does not. Convert to PNG first, then use the Background Remover to get a transparent cutout of your subject.' },
        { title: 'Screenshots and screen captures', description: 'Screenshots often look blurry when saved as JPG due to compression artefacts around text. Convert or save screenshots as PNG for crisp, readable text.' },
        { title: 'Logos and graphics with text', description: 'JPG compression creates visible artefacts around sharp edges and text. Convert logos and text-heavy graphics to PNG to preserve clean, sharp edges.' },
        { title: 'Long-term archiving', description: 'PNG is a lossless format — the file stored is the file you get back, always. For images you want to archive without any quality degradation over time, PNG is the right choice.' },
      ]}
      specs={[
        { label: 'Input format', value: 'JPG / JPEG (also accepts WebP, BMP, GIF)' },
        { label: 'Output format', value: 'PNG (lossless)' },
        { label: 'Quality loss', value: 'None — PNG is lossless' },
        { label: 'Transparency support', value: 'Yes — PNG supports alpha transparency' },
        { label: 'Max file size', value: '20 MB per image' },
        { label: 'Server upload', value: 'Never — 100% browser-based' },
        { label: 'Watermark', value: 'None' },
        { label: 'Cost', value: 'Free, no account needed' },
      ]}
      faqs={[
        { q: 'Does converting JPG to PNG improve quality?', a: 'No. Converting a JPG to PNG preserves the quality exactly as it is in the JPG — it does not add back quality that was lost when the JPG was originally created. What PNG does is prevent any further quality loss during subsequent saves. Think of it as freezing the current quality rather than improving it.' },
        { q: 'Will my JPG image become transparent after converting to PNG?', a: 'No. The image content stays the same — only the format changes. The solid background in your JPG will remain solid in the PNG output. To make an area transparent, use the Background Remover tool after converting.' },
        { q: 'Why is the PNG file larger than the original JPG?', a: 'JPG uses lossy compression that discards some data to achieve very small file sizes. PNG uses lossless compression that stores all pixel data exactly. For photographs, PNG files are typically 3–10x larger than the equivalent JPG. This is expected and is the trade-off for lossless quality.' },
        { q: 'When should I use PNG instead of JPG?', a: 'Use PNG when: (1) you need transparency, (2) you will edit and re-save the image multiple times, (3) the image contains text or sharp lines (logos, screenshots), or (4) you are archiving files for long-term storage. Use JPG for photographs destined for web or email where file size matters most.' },
        { q: 'Can I convert multiple JPG files to PNG at once?', a: 'Yes — drop multiple JPG files into the upload area and each is converted independently. Download them individually or use the Download All button.' },
        { q: 'Can I convert the PNG back to JPG later?', a: 'Yes — use the PNG to JPG converter tool. For best results, keep the original source file and only convert to JPG as the final step for publishing.' },
      ]}
      relatedTools={[
        { name: 'PNG to JPG', href: '/tools/image-tools/png-to-jpg', icon: '???', description: 'Convert PNG back to JPG format' },
        { name: 'Background Remover', href: '/tools/image-tools/background-remover', icon: '??', description: 'Remove background from your new PNG' },
        { name: 'Image Compressor', href: '/tools/image-tools/image-compressor', icon: '???', description: 'Compress PNG to reduce file size' },
        { name: 'Image Converter', href: '/tools/image-tools/image-converter', icon: '??', description: 'Convert between all image formats' },
        { name: 'Image Resizer', href: '/tools/image-tools/image-resizer', icon: '??', description: 'Resize to exact dimensions' },
        { name: 'Image Enhancer', href: '/tools/image-tools/image-enhancer', icon: '?', description: 'Improve brightness and contrast' },
      ]}      {...(_s ? { aboutHTML: _s.aboutHTML, proTips: _s.proTips, ratingValue: _s.ratingValue, reviewCount: _s.reviewCount } : {})}
    >
      <JpgToPngClient />
    </ImageToolShell>
  )
}
