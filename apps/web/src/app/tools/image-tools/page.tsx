import type { Metadata } from 'next'
import ImageToolsClient from './ImageToolsClient'
import { JsonLd } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: '38 Free Image Tools — Compress, Resize, Convert, Edit Online | Roughtools',
  description: 'Complete suite of 38 free online image tools: compress JPG and PNG, resize images, convert formats, remove backgrounds, crop, flip, rotate, add watermarks, create passport photos, generate GIFs and much more. 100% browser-based — your files never leave your device. No signup required.',
  keywords: ['image tools', 'online image editor', 'image compressor', 'background remover', 'image resizer', 'image converter', 'free image tools', 'photo editing online'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/image-tools' },
  openGraph: {
    title: '38 Free Image Tools — Compress, Resize, Convert | Roughtools',
    description: 'Complete suite of free online image tools. Compress, resize, convert, remove background, and more. No signup, 100% private.',
    url: 'https://roughtools.com/tools/image-tools',
    type: 'website', siteName: 'Roughtools',
  },
  twitter: { card: 'summary_large_image', title: '38 Free Image Tools | Roughtools', description: '38 free online image tools. Compress, resize, convert, edit. No signup.' },
}

const IMAGE_TOOL_SLUGS = [
  'add-border','add-watermark','background-changer','background-remover','base64-to-image',
  'blur-background','bulk-image-resizer','dominant-color-extractor','dpi-converter','gif-maker',
  'grayscale-converter','heic-to-jpg','id-card-photo-maker','image-color-picker','image-colorizer',
  'image-compressor','image-converter','image-cropper','image-enhancer','image-flipper-rotator',
  'image-metadata-viewer','image-resizer','image-size-checker','image-to-base64','image-to-text',
  'image-upscaler','jpg-to-png','meme-generator','passport-photo-maker','photo-collage-maker',
  'photo-to-cartoon','pixel-density-calculator','png-to-jpg','remove-watermark','round-corner-image',
  'screenshot-to-pdf','thumbnail-maker','white-background-maker',
]

const collectionSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Free Online Image Tools',
  description: '38 free browser-based image tools for conversion, editing, compression, enhancement, and filtering. No signup, no watermarks.',
  url: 'https://roughtools.com/tools/image-tools',
  hasPart: IMAGE_TOOL_SLUGS.map(slug => ({
    '@type': 'SoftwareApplication',
    url: `https://roughtools.com/tools/image-tools/${slug}`,
  })),
}

export default function ImageToolsPage() {
  return (
    <>
      <JsonLd data={[collectionSchema]} />
      <ImageToolsClient />
    </>
  )
}
