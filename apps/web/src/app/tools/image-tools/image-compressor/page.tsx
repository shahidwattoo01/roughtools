import type { Metadata } from 'next'
import ImageToolShell from '@/components/image-tools/ImageToolShell'
import ImageCompressorClient from './ImageCompressorClient'
import { getImageToolSupplement } from '@/data/imageTools'

export const metadata: Metadata = {
  title: 'Image Compressor — Reduce Image File Size Free Online | Roughtools',
  description: 'Compress JPG, PNG, and WEBP images online without losing quality. Reduce file size by up to 90%. Free bulk image compression — runs in your browser, files never uploaded.',
  keywords: ['image compressor', 'compress image online', 'reduce image file size', 'optimize images for web', 'bulk image compress', 'jpg compressor', 'png compressor'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/image-tools/image-compressor' },
  openGraph: {
    title: 'Image Compressor — Free Online | Roughtools',
    description: 'Compress JPG, PNG, WEBP images up to 90% smaller. Free, instant, no upload.',
    url: 'https://roughtools.com/tools/image-tools/image-compressor',
    type: 'website', siteName: 'Roughtools',
  },
  twitter: { card: 'summary_large_image', title: 'Image Compressor | Roughtools', description: 'Reduce image file size by up to 90%. Free, no signup.' },
}


const _s = getImageToolSupplement('image-compressor')

export default function Page() {
  return (
    <ImageToolShell
      toolName="Image Compressor"
      toolSlug="image-compressor"
      icon="???"
      description="Compress JPG, PNG, and WEBP images online without losing visible quality. Reduce file sizes by up to 90% — perfect for websites, email attachments, and social media uploads. All processing runs in your browser so your images are never uploaded to any server."
      howToSteps={[
        { name: 'Upload your images', text: 'Click the upload area or drag and drop one or more JPG, PNG, or WEBP files. You can add multiple images at once for batch compression.' },
        { name: 'Set quality level', text: 'Adjust the quality slider. 80% is the sweet spot for most images — near-invisible quality loss with significant file size reduction. Lower for smaller files, higher to preserve fine detail.' },
        { name: 'Compress', text: 'Click the Compress button. Processing happens instantly in your browser using the HTML5 Canvas API — no server upload required.' },
        { name: 'Review savings', text: 'See the original vs compressed file size for each image along with the percentage saved. A green summary shows your total savings across all files.' },
        { name: 'Download', text: 'Download each compressed image individually, or use the Download All button to get every file in one go.' },
      ]}
      useCases={[
        { title: 'Website & blog images', description: 'Large images slow down page load times and hurt SEO. Compress before uploading to WordPress, Shopify, or any CMS to keep your site fast.' },
        { title: 'Email attachments', description: 'Email providers limit attachment sizes. Compress photos before attaching to avoid bounced emails and slow sending.' },
        { title: 'Social media uploads', description: 'Instagram, Twitter, and Facebook all re-compress your images. Pre-compressing gives you control over quality and saves bandwidth.' },
        { title: 'App & web development', description: 'Optimised assets reduce bundle sizes and improve Lighthouse scores. Compress all UI images before committing to your project.' },
        { title: 'Cloud storage savings', description: 'Compress photo libraries before backing up to Google Drive, Dropbox, or iCloud to save storage space and money.' },
      ]}
      specs={[
        { label: 'Supported formats', value: 'JPG, PNG, WEBP, GIF' },
        { label: 'Max file size', value: '20 MB per image' },
        { label: 'Batch processing', value: 'Yes — unlimited files' },
        { label: 'Quality range', value: '10% – 100%' },
        { label: 'Output format', value: 'Same as input (JPG stays JPG, PNG stays PNG)' },
        { label: 'Server upload', value: 'Never — 100% browser-based' },
        { label: 'Watermark', value: 'None' },
        { label: 'Cost', value: 'Free, no account needed' },
      ]}
      faqs={[
        { q: 'What is image compression and how does it work?', a: 'Image compression reduces a file\'s storage size by removing redundant colour data or slightly reducing quality using algorithms. This tool uses the browser\'s built-in Canvas API to re-encode your image at the quality level you choose — no data leaves your device.' },
        { q: 'Will compressing an image reduce its visible quality?', a: 'At 75–85% quality the difference is virtually invisible to the human eye. Below 60% you may notice some blurring or artefacts. Use the quality slider to find the right balance for your use case — the preview lets you judge before downloading.' },
        { q: 'What is the best quality setting to use?', a: '80% is the recommended starting point for web images. It typically reduces JPG file sizes by 50–70% while keeping images looking sharp. For photos intended for print or professional display, use 90%+.' },
        { q: 'Can I compress multiple images at once?', a: 'Yes. Drop as many images as you like into the upload area. The tool processes them all and lets you download each one, or click Download All to get every compressed file in a single action.' },
        { q: 'Does this tool support PNG transparency?', a: 'Yes. PNG files are processed without losing their transparency (alpha channel). Note that PNG compression is lossless by design, so file size reductions are smaller than with JPG — typically 20–40%.' },
        { q: 'Is there a limit to how many images I can compress?', a: 'There is no hard limit — you can compress as many images as your browser memory allows. For very large batches, process in groups of 20–30 files for best performance.' },
      ]}
      relatedTools={[
        { name: 'Image Resizer', href: '/tools/image-tools/image-resizer', icon: '??', description: 'Resize to exact pixel dimensions' },
        { name: 'Image Converter', href: '/tools/image-tools/image-converter', icon: '??', description: 'Convert between JPG, PNG, WebP' },
        { name: 'Bulk Image Resizer', href: '/tools/image-tools/bulk-image-resizer', icon: '??', description: 'Resize multiple images at once' },
        { name: 'PNG to JPG', href: '/tools/image-tools/png-to-jpg', icon: '???', description: 'Convert PNG files to JPG format' },
        { name: 'Image Enhancer', href: '/tools/image-tools/image-enhancer', icon: '?', description: 'Improve brightness, contrast & sharpness' },
        { name: 'DPI Converter', href: '/tools/image-tools/dpi-converter', icon: '???', description: 'Change image DPI for print' },
      ]}      {...(_s ? { aboutHTML: _s.aboutHTML, proTips: _s.proTips, ratingValue: _s.ratingValue, reviewCount: _s.reviewCount } : {})}
    >
      <ImageCompressorClient />
    </ImageToolShell>
  )
}
