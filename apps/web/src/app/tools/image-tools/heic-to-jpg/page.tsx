import type { Metadata } from 'next'
import ImageToolShell from '@/components/image-tools/ImageToolShell'
import HeicToJpgClient from './HeicToJpgClient'
import { getImageToolSupplement } from '@/data/imageTools'

export const metadata: Metadata = {
  title: 'HEIC to JPG Converter — Convert iPhone Photos to JPEG Free Online | Roughtools',
  description: 'Convert HEIC and HEIF photos from iPhone to JPG format online for free. Share Apple photos on any device or platform. Fast, private, 100% browser-based.',
  keywords: ['heic to jpg', 'heic converter', 'convert heic to jpeg', 'iphone photo converter', 'heif to jpg', 'apple heic converter'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/image-tools/heic-to-jpg' },
  openGraph: {
    title: 'HEIC to JPG Converter — Free Online | Roughtools',
    description: 'Convert iPhone HEIC photos to JPG. Share on any device. Free, no upload.',
    url: 'https://roughtools.com/tools/image-tools/heic-to-jpg',
    type: 'website', siteName: 'Roughtools',
  },
  twitter: { card: 'summary_large_image', title: 'HEIC to JPG | Roughtools', description: 'Convert iPhone HEIC photos to JPG format. Free, no signup.' },
}


const _s = getImageToolSupplement('heic-to-jpg')

export default function Page() {
  return (
    <ImageToolShell
      toolName="HEIC to JPG Converter"
      toolSlug="heic-to-jpg"
      icon="??"
      description="Convert HEIC and HEIF photos taken on iPhone or iPad to universally compatible JPG format. HEIC is Apple's default camera format — it takes up less space on your phone, but most non-Apple devices, Windows PCs, and websites cannot open it. Convert to JPG to share your iPhone photos anywhere, with anyone. All processing is browser-based and private."
      howToSteps={[
        { name: 'Upload your HEIC file', text: 'Click the upload area or drag and drop your HEIC or HEIF file. These are typically photos taken on iPhone, saved with the .heic or .heif extension.' },
        { name: 'Set the quality level', text: 'Choose the JPG output quality. 85% gives a good balance of quality and file size for most uses. Use 95%+ for photos you plan to edit or print.' },
        { name: 'Convert', text: 'Click the Convert button. The browser decodes the HEIC file and re-encodes it as a JPG. Processing time depends on file size — most iPhone photos convert in 2–5 seconds.' },
        { name: 'Download', text: 'Download the JPG file. It can now be viewed, shared, and used on any device or platform — Android, Windows, web, email — without compatibility issues.' },
      ]}
      useCases={[
        { title: 'Sharing iPhone photos on Android', description: 'Android devices cannot natively open HEIC files. Convert before sending photos to Android friends or family to ensure they can view them without any special app.' },
        { title: 'Uploading to websites and social platforms', description: 'Most websites, including many social media platforms, do not accept HEIC format. Convert to JPG before uploading to Facebook, LinkedIn, online stores, or any web form.' },
        { title: 'Using photos on Windows PC', description: 'Windows 10 and 11 require a codec purchase to open HEIC files. Convert to JPG for universal compatibility with Windows Explorer, Photos, Paint, Word, and every other Windows application.' },
        { title: 'Sending email attachments', description: 'HEIC attachments may not display correctly in email clients. Convert to JPG before attaching to ensure the recipient sees the photo regardless of their device.' },
        { title: 'Editing in non-Apple software', description: 'Adobe Photoshop (older versions), GIMP, and many other image editors do not support HEIC. Convert to JPG to open and edit your iPhone photos in any image editor.' },
      ]}
      specs={[
        { label: 'Input format', value: 'HEIC, HEIF' },
        { label: 'Output format', value: 'JPG / JPEG' },
        { label: 'Quality control', value: 'Yes — 10% to 100% slider' },
        { label: 'Max file size', value: '20 MB per file' },
        { label: 'Batch conversion', value: 'Yes — multiple files at once' },
        { label: 'Server upload', value: 'Never — 100% browser-based' },
        { label: 'Watermark', value: 'None' },
        { label: 'Cost', value: 'Free, no account needed' },
      ]}
      faqs={[
        { q: 'What is HEIC format and why does iPhone use it?', a: 'HEIC (High Efficiency Image Container) is a modern image format developed by Apple that uses advanced HEVC compression. It stores images at roughly half the file size of JPG while maintaining equivalent or better quality. Apple introduced it as the default iPhone camera format with iOS 11 to save storage space on devices. The trade-off is limited compatibility outside the Apple ecosystem.' },
        { q: 'Why cannot Windows or Android open HEIC files?', a: 'HEIC uses technology that requires licencing for implementation. Microsoft added basic HEIC support to Windows 10/11 only via a paid codec add-on. Android has limited native support. Most non-Apple platforms have not implemented HEIC support, making JPG the practical universal format for sharing photos.' },
        { q: 'Will converting HEIC to JPG reduce photo quality?', a: 'At 85%+ quality, the visual difference is negligible for photographs viewed on screen. HEIC was already compressed when it was saved by your iPhone, so converting to JPG at high quality preserves the existing quality. Avoid lower quality settings (below 70%) if you care about preserving fine detail.' },
        { q: 'Can I convert Live Photos (HEIC with motion)?', a: 'This converter handles the still image component of HEIC files. Live Photo motion data is not included in the converted JPG — only the still frame is extracted. If you need the motion component, export from the iPhone Photos app directly using Export Unmodified Original.' },
        { q: 'How do I get HEIC files off my iPhone?', a: 'Connect your iPhone to a Windows PC via USB. To get HEIC files, go to iPhone Settings, then Photos, then Transfer to Mac or PC, then Keep Originals. Then copy the files to your computer. On Mac, HEIC files transfer natively without conversion.' },
        { q: 'Can I convert multiple HEIC files at once?', a: 'Yes. Drop multiple HEIC files into the upload area. Each is converted independently and you can download them individually or all at once using the Download All button.' },
      ]}
      relatedTools={[
        { name: 'Image Compressor', href: '/tools/image-tools/image-compressor', icon: '???', description: 'Compress your converted JPG further' },
        { name: 'Image Resizer', href: '/tools/image-tools/image-resizer', icon: '??', description: 'Resize the converted photo' },
        { name: 'Image Converter', href: '/tools/image-tools/image-converter', icon: '??', description: 'Convert to WebP or PNG formats' },
        { name: 'PNG to JPG', href: '/tools/image-tools/png-to-jpg', icon: '???', description: 'Convert PNG to JPG format' },
        { name: 'Image Enhancer', href: '/tools/image-tools/image-enhancer', icon: '?', description: 'Improve brightness and contrast' },
        { name: 'Passport Photo Maker', href: '/tools/image-tools/passport-photo-maker', icon: '??', description: 'Create compliant passport photos' },
      ]}      {...(_s ? { aboutHTML: _s.aboutHTML, proTips: _s.proTips, ratingValue: _s.ratingValue, reviewCount: _s.reviewCount } : {})}
    >
      <HeicToJpgClient />
    </ImageToolShell>
  )
}
