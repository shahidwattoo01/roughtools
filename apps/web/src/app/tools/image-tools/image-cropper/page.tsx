import type { Metadata } from 'next'
import ImageToolShell from '@/components/image-tools/ImageToolShell'
import ImageCropperClient from './ImageCropperClient'
import { getImageToolSupplement } from '@/data/imageTools'

export const metadata: Metadata = {
  title: 'Image Cropper — Crop Images Online Free with Aspect Ratio Lock | Roughtools',
  description: 'Crop images online for free. Set custom crop areas, use preset aspect ratios (1:1, 16:9, 4:3), or crop freehand. Download instantly. 100% browser-based — no upload.',
  keywords: ['image cropper', 'crop image online', 'crop photo', 'image crop tool', 'free image cropper', 'aspect ratio crop'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/image-tools/image-cropper' },
  openGraph: {
    title: 'Image Cropper — Free Online | Roughtools',
    description: 'Crop images to any size or aspect ratio. Free, instant, browser-based.',
    url: 'https://roughtools.com/tools/image-tools/image-cropper',
    type: 'website', siteName: 'Roughtools',
  },
  twitter: { card: 'summary_large_image', title: 'Image Cropper | Roughtools', description: 'Crop images online free. Custom sizes and aspect ratios.' },
}


const _s = getImageToolSupplement('image-cropper')

export default function Page() {
  return (
    <ImageToolShell
      toolName="Image Cropper"
      toolSlug="image-cropper"
      icon="??"
      description="Crop any image to a custom area or a standard aspect ratio — 1:1 for Instagram, 16:9 for YouTube, 4:3 for presentations, or freehand for any proportion. Drag the crop handles to select exactly the area you want, then download the cropped result. Fully browser-based — your images are never uploaded to any server."
      howToSteps={[
        { name: 'Upload your image', text: 'Click the upload area or drag and drop a JPG, PNG, or WebP image. The image is loaded into the crop editor immediately.' },
        { name: 'Choose an aspect ratio or crop freehand', text: 'Select a preset aspect ratio (1:1, 16:9, 4:3, 3:2, 9:16) to constrain the crop, or choose freehand to drag any arbitrary rectangle.' },
        { name: 'Drag to position the crop area', text: 'Drag the crop handles to resize the selection. Drag inside the selection box to reposition it over the area of the image you want to keep.' },
        { name: 'Apply the crop', text: 'Click the Crop button. The image is trimmed to exactly the selected area using the Canvas API — no server required.' },
        { name: 'Download', text: 'Download the cropped image in the same format as the original, or choose a different output format.' },
      ]}
      useCases={[
        { title: 'Instagram and social media posts', description: 'Instagram requires a 1:1 square for feed posts. Crop any landscape or portrait photo to a perfect square — the crop tool constrains to exactly 1:1 when you select that ratio.' },
        { title: 'YouTube thumbnails', description: 'YouTube thumbnails should be 16:9 ratio. Crop a screenshot or photo to the 16:9 preset to create a correctly proportioned thumbnail ready for upload.' },
        { title: 'Profile pictures', description: 'Social networks, forums, and apps display profile photos as squares or circles. Crop a photo to a centred square to ensure your face is correctly framed in the profile picture.' },
        { title: 'Removing unwanted edges', description: 'Remove distracting backgrounds, watermarks, borders, or timestamps from photos without any complex editing — just drag the crop handles to exclude the unwanted areas.' },
        { title: 'Print preparation', description: 'Standard print sizes (4×6, 5×7, 8×10) have specific aspect ratios. Crop to the correct ratio before printing to avoid the photo lab auto-cropping out the wrong part of your image.' },
      ]}
      specs={[
        { label: 'Supported formats', value: 'JPG, PNG, WebP' },
        { label: 'Aspect ratio presets', value: '1:1, 16:9, 4:3, 3:2, 9:16, freehand' },
        { label: 'Custom dimensions', value: 'Yes — enter exact pixel crop coordinates' },
        { label: 'Max file size', value: '20 MB per image' },
        { label: 'Output format', value: 'Same as input or user-selected' },
        { label: 'Server upload', value: 'Never — 100% browser-based' },
        { label: 'Watermark', value: 'None' },
        { label: 'Cost', value: 'Free, no account needed' },
      ]}
      faqs={[
        { q: 'Will cropping reduce image quality?', a: 'No. Cropping removes pixels at the edges — it does not change the quality of the remaining pixels. The cropped area retains exactly the same quality as the original. File size will decrease because there are fewer pixels, but the quality per pixel is unchanged.' },
        { q: 'What aspect ratio should I use for Instagram?', a: 'Instagram supports three ratios: 1:1 (square) for feed posts, 4:5 (portrait) for vertical feed posts, and 9:16 (portrait) for Stories and Reels. The 1:1 square is the most versatile as it displays consistently in the grid and feed.' },
        { q: 'Can I enter exact pixel coordinates for the crop?', a: 'Yes. You can either drag the crop handles visually or enter precise pixel values for the crop start position (top-left corner) and dimensions. This is useful when you need to crop to exact specifications, such as extracting a product from a catalogue scan.' },
        { q: 'What is the difference between crop and resize?', a: 'Cropping removes parts of the image to select a smaller area — it changes the composition and dimensions without scaling the remaining content. Resizing changes the output dimensions by scaling all content up or down — nothing is removed, everything is stretched or compressed. Use crop to reframe a shot; use resize to change the display size.' },
        { q: 'Can I undo the crop and start again?', a: 'Yes — click Reset to restore the original image and start a new crop selection. The original file on your device is never modified, so you can also re-upload and try a different crop.' },
        { q: 'Can I crop to a circle for a profile picture?', a: 'The image cropper crops to a rectangle. For a circular profile picture, use the circular crop option if available, or crop to a square first and then use the Round Corner Image tool at maximum radius to create a circular appearance. Note that most platforms apply a circular mask on top of a square image automatically.' },
      ]}
      relatedTools={[
        { name: 'Image Resizer', href: '/tools/image-tools/image-resizer', icon: '??', description: 'Resize to exact pixel dimensions' },
        { name: 'Image Compressor', href: '/tools/image-tools/image-compressor', icon: '???', description: 'Compress after cropping' },
        { name: 'Round Corner Image', href: '/tools/image-tools/round-corner-image', icon: '??', description: 'Add rounded corners to cropped image' },
        { name: 'Image Enhancer', href: '/tools/image-tools/image-enhancer', icon: '?', description: 'Improve brightness and contrast' },
        { name: 'Thumbnail Maker', href: '/tools/image-tools/thumbnail-maker', icon: '??', description: 'Create YouTube thumbnails' },
        { name: 'Passport Photo Maker', href: '/tools/image-tools/passport-photo-maker', icon: '??', description: 'Create compliant passport photos' },
      ]}      {...(_s ? { aboutHTML: _s.aboutHTML, proTips: _s.proTips, ratingValue: _s.ratingValue, reviewCount: _s.reviewCount } : {})}
    >
      <ImageCropperClient />
    </ImageToolShell>
  )
}
