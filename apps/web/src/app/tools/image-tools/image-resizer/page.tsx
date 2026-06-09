import type { Metadata } from 'next'
import ImageToolShell from '@/components/image-tools/ImageToolShell'
import ImageResizerClient from './ImageResizerClient'
import { getImageToolSupplement } from '@/data/imageTools'

export const metadata: Metadata = {
  title: 'Image Resizer — Resize Images Online Free by Pixels or Percentage | Roughtools',
  description: 'Resize images online for free. Set exact pixel dimensions or resize by percentage. Lock aspect ratio, supports JPG, PNG, WebP. 100% browser-based — files never uploaded.',
  keywords: ['image resizer', 'resize image online', 'change image size', 'resize photo online', 'scale image', 'resize jpg', 'resize png', 'aspect ratio'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/image-tools/image-resizer' },
  openGraph: {
    title: 'Image Resizer — Free Online | Roughtools',
    description: 'Resize images to exact pixel dimensions or by percentage. Free, instant, no upload.',
    url: 'https://roughtools.com/tools/image-tools/image-resizer',
    type: 'website', siteName: 'Roughtools',
  },
  twitter: { card: 'summary_large_image', title: 'Image Resizer | Roughtools', description: 'Resize images to any dimension online. Free, no signup.' },
}


const _s = getImageToolSupplement('image-resizer')

export default function Page() {
  return (
    <ImageToolShell
      toolName="Image Resizer"
      toolSlug="image-resizer"
      icon="??"
      description="Resize any image to exact pixel dimensions or by percentage scale. Lock the aspect ratio to prevent distortion, or set custom width and height independently. Supports JPG, PNG, and WebP — all processing runs in your browser so your images are never uploaded to any server."
      howToSteps={[
        { name: 'Upload your image', text: 'Click the upload area or drag and drop a JPG, PNG, or WebP image. The original dimensions are displayed immediately so you know your starting point.' },
        { name: 'Choose resize mode', text: 'Select "By Pixels" to enter exact dimensions, or "By Percentage" to scale proportionally (e.g. 50% halves the size, 200% doubles it).' },
        { name: 'Enter dimensions', text: 'Type the target width or height. With aspect ratio lock enabled, the other dimension adjusts automatically to maintain proportions and prevent stretching.' },
        { name: 'Resize the image', text: 'Click the Resize button. The browser redraws the image at the new dimensions using the Canvas API — no server required.' },
        { name: 'Download', text: 'Preview the resized image and download it as JPG, PNG, or WebP depending on your needs.' },
      ]}
      useCases={[
        { title: 'Social media profile photos', description: 'Every platform has a required profile picture size. Resize to exactly 400×400 for Twitter, 180×180 for Facebook, or 110×110 for Instagram without distortion.' },
        { title: 'Email and web optimisation', description: 'Large images slow down emails and web pages. Resize to the exact display size before embedding to reduce load times and bandwidth.' },
        { title: 'E-commerce product photos', description: 'Online shops require consistent product image dimensions. Resize all product photos to a uniform size for a professional, polished storefront.' },
        { title: 'Printing and documents', description: 'Resize images to specific print dimensions before inserting into Word, PowerPoint, or PDF documents to control the exact output size.' },
        { title: 'App and web development', description: 'Frontend assets must match their CSS display dimensions exactly. Resize images to the rendered size to avoid unnecessary pixel data being downloaded.' },
      ]}
      specs={[
        { label: 'Supported formats', value: 'JPG, PNG, WebP' },
        { label: 'Resize modes', value: 'By pixels (width × height) or by percentage' },
        { label: 'Aspect ratio lock', value: 'Yes — auto-adjusts opposite dimension' },
        { label: 'Max file size', value: '20 MB per image' },
        { label: 'Output formats', value: 'JPG, PNG, WebP' },
        { label: 'Server upload', value: 'Never — 100% browser-based' },
        { label: 'Watermark', value: 'None' },
        { label: 'Cost', value: 'Free, no account needed' },
      ]}
      faqs={[
        { q: 'What is the difference between resizing by pixels and by percentage?', a: 'Resizing by pixels lets you set an exact target dimension (e.g. 800px wide), which is useful when a platform requires specific sizes. Resizing by percentage scales the image relative to its current size — 50% makes it half as large, 200% doubles it. Percentage mode is convenient when you just want to make an image generally smaller or larger without worrying about exact numbers.' },
        { q: 'Will resizing reduce image quality?', a: 'Scaling down (making an image smaller) generally preserves quality very well. Scaling up (enlarging) can introduce blurring or pixelation because the browser must invent new pixel data that was not in the original. For best results, avoid enlarging an image by more than 120–150% of its original size.' },
        { q: 'What is aspect ratio lock and when should I use it?', a: 'Aspect ratio lock keeps the width-to-height ratio constant. When you change one dimension, the other adjusts automatically. Use it whenever you want to make an image smaller or larger without distorting it. Turn it off only when you intentionally want to stretch or squish an image to different proportions.' },
        { q: 'Can I resize multiple images at once?', a: 'The standard resizer handles one image at a time. For bulk resizing, use the Bulk Image Resizer tool, which lets you apply the same dimensions to many images simultaneously and download them all at once.' },
        { q: 'What output format should I choose?', a: 'Use JPG for photographs and images without transparency — it produces the smallest file sizes. Use PNG when you need transparency or a lossless result. Use WebP for web assets when browser compatibility allows — it offers the best balance of quality and compression.' },
        { q: 'Is there a minimum or maximum size I can resize to?', a: 'The tool can resize down to 1×1 pixels and up to very large dimensions, limited only by your browser memory. For very large outputs (e.g. 10,000×10,000 pixels), the browser may slow down or run out of memory. Practically, keep output dimensions under 8,000px on either side for reliable performance.' },
      ]}
      relatedTools={[
        { name: 'Image Compressor', href: '/tools/image-tools/image-compressor', icon: '???', description: 'Reduce file size without visible quality loss' },
        { name: 'Bulk Image Resizer', href: '/tools/image-tools/bulk-image-resizer', icon: '??', description: 'Resize multiple images at once' },
        { name: 'Image Converter', href: '/tools/image-tools/image-converter', icon: '??', description: 'Convert between JPG, PNG, WebP' },
        { name: 'Image Cropper', href: '/tools/image-tools/image-cropper', icon: '??', description: 'Crop to a specific area or ratio' },
        { name: 'DPI Converter', href: '/tools/image-tools/dpi-converter', icon: '???', description: 'Change image DPI for print' },
        { name: 'Image Enhancer', href: '/tools/image-tools/image-enhancer', icon: '?', description: 'Improve brightness, contrast & sharpness' },
      ]}      {...(_s ? { aboutHTML: _s.aboutHTML, proTips: _s.proTips, ratingValue: _s.ratingValue, reviewCount: _s.reviewCount } : {})}
    >
      <ImageResizerClient />
    </ImageToolShell>
  )
}
