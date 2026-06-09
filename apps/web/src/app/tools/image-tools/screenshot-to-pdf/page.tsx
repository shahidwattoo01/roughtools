import type { Metadata } from 'next'
import ImageToolShell from '@/components/image-tools/ImageToolShell'
import ScreenshotToPdfClient from './ScreenshotToPdfClient'
import { getImageToolSupplement } from '@/data/imageTools'

export const metadata: Metadata = {
  title: 'Screenshot to PDF — Convert Screenshots and Images to PDF Free Online | Roughtools',
  description: 'Convert screenshots and images to PDF online for free. Combine multiple images into one PDF, set page size and orientation, and download instantly. 100% browser-based.',
  keywords: ['screenshot to pdf', 'image to pdf', 'convert image to pdf', 'images to pdf online', 'jpg to pdf', 'png to pdf', 'screenshot pdf converter'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/image-tools/screenshot-to-pdf' },
  openGraph: {
    title: 'Screenshot to PDF — Free Online | Roughtools',
    description: 'Convert screenshots and images to PDF. Combine multiple images. Free, instant.',
    url: 'https://roughtools.com/tools/image-tools/screenshot-to-pdf',
    type: 'website', siteName: 'Roughtools',
  },
  twitter: { card: 'summary_large_image', title: 'Screenshot to PDF | Roughtools', description: 'Convert screenshots to PDF online free. Combine multiple images.' },
}


const _s = getImageToolSupplement('screenshot-to-pdf')

export default function Page() {
  return (
    <ImageToolShell
      toolName="Screenshot to PDF"
      toolSlug="screenshot-to-pdf"
      icon="??"
      description="Convert screenshots, photos, and images into a PDF document. Upload one or multiple images and combine them into a single PDF — each image becomes one page. Set the page size (A4, Letter, or custom), orientation (portrait or landscape), and image fit (fill page or fit with margins). Download the PDF instantly. All processing runs in your browser using client-side PDF generation."
      howToSteps={[
        { name: 'Upload your images', text: 'Click the upload area or drag and drop one or more JPG, PNG, or WebP images. Each image will become one page in the PDF. Rearrange by dragging.' },
        { name: 'Set page size', text: 'Choose A4 (international standard), US Letter, or custom page dimensions. The image will be scaled to fit within the page.' },
        { name: 'Choose orientation', text: 'Select Portrait (tall) or Landscape (wide) for the pages. Choose whichever orientation better matches your images — a widescreen screenshot works best in landscape.' },
        { name: 'Set image fit', text: 'Choose whether images fill the entire page (image may be cropped), fit the page with white margins (full image always visible), or fill exactly with stretching allowed.' },
        { name: 'Convert and download', text: 'Click Convert to PDF. The PDF is generated client-side and downloaded immediately. No files are uploaded to any server.' },
      ]}
      useCases={[
        { title: 'Sharing multiple screenshots as a single document', description: 'Instead of sending 10 individual screenshot files, combine them into one PDF that is easier to share by email, upload to a portal, or attach to a ticket. Recipients get all images in one organised document.' },
        { title: 'Creating visual bug reports', description: 'Developers and QA testers can compile a sequence of screenshots showing a bug — before, during, and after — into a single PDF to attach to Jira, GitHub, or Linear issues.' },
        { title: 'Portfolio and design presentation PDFs', description: 'Designers can compile design screenshots, mockups, and interface images into a presentation-ready PDF for clients, without needing InDesign or Acrobat.' },
        { title: 'Document digitisation', description: 'Photograph multi-page documents and combine all the page photos into a single PDF for easy archiving, sharing, and printing as a cohesive document.' },
        { title: 'Converting photo collections for email', description: 'Many email clients and portals limit the number of file attachments. Convert a set of images to a single PDF attachment to work within attachment limits while preserving all content.' },
      ]}
      specs={[
        { label: 'Input formats', value: 'JPG, PNG, WebP (per image/page)' },
        { label: 'Max images per PDF', value: '50 images' },
        { label: 'Page sizes', value: 'A4, A3, US Letter, Legal, custom' },
        { label: 'Orientation', value: 'Portrait or landscape per page or globally' },
        { label: 'Image fit options', value: 'Fill, fit with margins, or stretch to fill' },
        { label: 'Output format', value: 'PDF' },
        { label: 'Server upload', value: 'Never — 100% browser-based' },
        { label: 'Cost', value: 'Free, no account needed' },
      ]}
      faqs={[
        { q: 'Can I combine images from different sources into one PDF?', a: 'Yes. Upload any mix of JPG, PNG, and WebP images and they are combined in the order you arrange them. Drag the image thumbnails to reorder pages before generating the PDF.' },
        { q: 'Will the images be compressed in the PDF?', a: 'Images are embedded in the PDF at their original quality. The PDF file size will be approximately the sum of all image file sizes plus PDF overhead. For smaller PDFs, compress your images with the Image Compressor tool before converting to PDF.' },
        { q: 'Can I set a different page size for each page?', a: 'Currently all pages use the same size and orientation setting. For documents that mix portrait and landscape pages, set to the most common orientation and note that some pages may have white space at the sides or top/bottom.' },
        { q: 'Will the PDF be searchable?', a: 'No. The PDF contains images only — text visible in screenshots is not recognised as searchable text. For searchable PDFs from scanned documents or screenshots containing text, use the Image to Text (OCR) tool first to extract the text content.' },
        { q: 'What is the maximum file size of the output PDF?', a: 'There is no hard limit — the output PDF size depends on the total size of all input images. For very large collections (50 full-resolution photos), the PDF could be hundreds of megabytes. Compress images before combining, and consider whether a zip archive of individual files might be more appropriate for very large collections.' },
        { q: 'Can I add a title page or headers to the PDF?', a: 'The current tool focuses on image-to-PDF conversion without additional design elements. For PDFs with title pages, headers, and footers, create a title page image in the Thumbnail Maker and add it as the first page, or use a dedicated PDF creation tool.' },
      ]}
      relatedTools={[
        { name: 'Image Compressor', href: '/tools/image-tools/image-compressor', icon: '???', description: 'Compress images before PDF conversion' },
        { name: 'Image to Text (OCR)', href: '/tools/image-tools/image-to-text', icon: '??', description: 'Extract text from screenshots' },
        { name: 'Image Resizer', href: '/tools/image-tools/image-resizer', icon: '??', description: 'Resize images to consistent dimensions' },
        { name: 'PNG to JPG', href: '/tools/image-tools/png-to-jpg', icon: '???', description: 'Convert PNG screenshots to JPG' },
        { name: 'Image Cropper', href: '/tools/image-tools/image-cropper', icon: '??', description: 'Crop screenshots before combining' },
        { name: 'Photo Collage Maker', href: '/tools/image-tools/photo-collage-maker', icon: '???', description: 'Combine images in a grid layout' },
      ]}      {...(_s ? { aboutHTML: _s.aboutHTML, proTips: _s.proTips, ratingValue: _s.ratingValue, reviewCount: _s.reviewCount } : {})}
    >
      <ScreenshotToPdfClient />
    </ImageToolShell>
  )
}
