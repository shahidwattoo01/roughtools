import type { Metadata } from 'next'
import ImageToolShell from '@/components/image-tools/ImageToolShell'
import FlipperRotatorClient from './FlipperRotatorClient'
import { getImageToolSupplement } from '@/data/imageTools'

export const metadata: Metadata = {
  title: 'Image Flip and Rotate — Flip or Rotate Images Free Online | Roughtools',
  description: 'Flip images horizontally or vertically, or rotate by any angle online for free. Fix sideways photos, create mirror effects. 100% browser-based — files never uploaded.',
  keywords: ['flip image', 'rotate image online', 'image rotator', 'flip photo', 'rotate photo free', 'mirror image', 'horizontal flip', 'vertical flip'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/image-tools/image-flipper-rotator' },
  openGraph: {
    title: 'Image Flip and Rotate — Free Online | Roughtools',
    description: 'Flip horizontally, vertically, or rotate by any angle. Free, instant, browser-based.',
    url: 'https://roughtools.com/tools/image-tools/image-flipper-rotator',
    type: 'website', siteName: 'Roughtools',
  },
  twitter: { card: 'summary_large_image', title: 'Image Flip & Rotate | Roughtools', description: 'Flip and rotate images online free. Fix orientation instantly.' },
}


const _s = getImageToolSupplement('image-flipper-rotator')

export default function Page() {
  return (
    <ImageToolShell
      toolName="Image Flip and Rotate"
      toolSlug="image-flipper-rotator"
      icon="??"
      description="Flip images horizontally or vertically to create mirror effects, or rotate by 90°, 180°, 270°, or any custom angle. Fix photos that were taken sideways or upside down, create symmetrical compositions, or mirror text for printing on transfer paper. All transformations are applied instantly in your browser — no files are uploaded to any server."
      howToSteps={[
        { name: 'Upload your image', text: 'Click the upload area or drag and drop a JPG, PNG, or WebP image. The image is shown immediately in the preview.' },
        { name: 'Flip or rotate', text: 'Click the flip buttons to mirror horizontally or vertically. Click 90° left or right to rotate in quarter turns. Use the custom angle slider for any specific rotation angle.' },
        { name: 'Preview the result', text: 'The transformed image is shown immediately in real time. Apply multiple transformations in sequence — flip then rotate, or rotate multiple times.' },
        { name: 'Download', text: 'Download the final image. The output dimensions may change after rotation if the image is not square — width and height swap for 90° and 270° rotations.' },
      ]}
      useCases={[
        { title: 'Fixing sideways photos', description: 'Photos taken on a phone held vertically sometimes save as landscape. Rotate 90° to correct the orientation — much faster than using a full photo editor for a simple orientation fix.' },
        { title: 'Mirror text for heat transfer printing', description: 'Iron-on and heat transfer designs need to be printed as a mirror image so they read correctly after pressing. Flip horizontally to create the mirror version before printing.' },
        { title: 'Creating symmetric compositions', description: 'Flip a landscape or portrait photo horizontally and compare it against the original to decide which direction gives a better visual balance for a design layout.' },
        { title: 'Correcting scan orientation', description: 'Scanned documents often come out rotated. Quickly rotate or flip to correct orientation before saving or sharing the document image.' },
        { title: 'Social media and creative effects', description: 'Horizontal flips create interesting mirror effects. Use a mirrored landscape or architectural photo for creative social media posts, backgrounds, or art prints.' },
      ]}
      specs={[
        { label: 'Supported formats', value: 'JPG, PNG, WebP' },
        { label: 'Flip options', value: 'Horizontal, vertical' },
        { label: 'Rotation options', value: '90° left, 90° right, 180°, custom angle' },
        { label: 'Custom angle range', value: '0° to 360°' },
        { label: 'Max file size', value: '20 MB per image' },
        { label: 'Server upload', value: 'Never — 100% browser-based' },
        { label: 'Watermark', value: 'None' },
        { label: 'Cost', value: 'Free, no account needed' },
      ]}
      faqs={[
        { q: 'What is the difference between flip and rotate?', a: 'Flipping mirrors the image along an axis — horizontal flip creates a left-right mirror image, vertical flip creates a top-bottom mirror. Rotating turns the entire image by an angle — 90° clockwise makes a portrait landscape, 180° turns the image upside down. Flipping and rotating are distinct transformations, though they can be combined.' },
        { q: 'Why does my image appear correctly in the editor but sideways when I share it?', a: 'This is caused by EXIF orientation metadata. When you take a photo on a phone, the image data may be stored landscape but the EXIF data says "rotate 90°" — most apps read this and display it correctly. Some apps ignore EXIF rotation and display the raw data. Use this tool to actually rotate the pixel data and strip the EXIF orientation tag so it displays correctly everywhere.' },
        { q: 'Does rotating to a custom angle crop the image?', a: 'When rotating to a non-90° angle (e.g. 15°), the corners of the original image would extend beyond the canvas. The output is padded with a background colour (white or transparent for PNG) to keep the full rotated image. Alternatively, enable the auto-crop option to trim the canvas to the largest rectangle that fits inside the rotated image.' },
        { q: 'Will the file dimensions change after rotation?', a: 'For 90° and 270° rotations, the width and height swap. A 1920×1080 landscape image becomes 1080×1920 portrait after a 90° rotation. For 180° rotation and all flips, the dimensions remain the same. For custom angle rotation, the dimensions of the bounding box increase.' },
        { q: 'Can I rotate multiple images at once?', a: 'The flip and rotate tool processes one image at a time. For batch rotation, use the Bulk Image Resizer which includes rotation options, or process images individually and download each.' },
        { q: 'Can I chain multiple operations (e.g. flip then rotate)?', a: 'Yes. Apply operations in sequence — click Flip Horizontal, then click Rotate 90°, and the preview updates after each step. The final download includes all applied transformations combined.' },
      ]}
      relatedTools={[
        { name: 'Image Cropper', href: '/tools/image-tools/image-cropper', icon: '??', description: 'Crop after rotating' },
        { name: 'Image Resizer', href: '/tools/image-tools/image-resizer', icon: '??', description: 'Resize to exact dimensions' },
        { name: 'Image Enhancer', href: '/tools/image-tools/image-enhancer', icon: '?', description: 'Improve brightness and contrast' },
        { name: 'Image Compressor', href: '/tools/image-tools/image-compressor', icon: '???', description: 'Compress after transformation' },
        { name: 'Bulk Image Resizer', href: '/tools/image-tools/bulk-image-resizer', icon: '??', description: 'Resize multiple images' },
        { name: 'Add Border', href: '/tools/image-tools/add-border', icon: '???', description: 'Add decorative border' },
      ]}      {...(_s ? { aboutHTML: _s.aboutHTML, proTips: _s.proTips, ratingValue: _s.ratingValue, reviewCount: _s.reviewCount } : {})}
    >
      <FlipperRotatorClient />
    </ImageToolShell>
  )
}
