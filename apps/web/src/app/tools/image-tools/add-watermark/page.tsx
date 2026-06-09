import type { Metadata } from 'next'
import ImageToolShell from '@/components/image-tools/ImageToolShell'
import AddWatermarkClient from './AddWatermarkClient'
import { getImageToolSupplement } from '@/data/imageTools'

export const metadata: Metadata = {
  title: 'Add Watermark — Add Text or Image Watermark to Photos Free Online | Roughtools',
  description: 'Add text or image watermarks to photos online for free. Control position, opacity, size, and font. Batch watermark multiple images. 100% browser-based — files never uploaded.',
  keywords: ['add watermark', 'watermark image online', 'text watermark', 'image watermark', 'photo watermark free', 'watermark photos online'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/image-tools/add-watermark' },
  openGraph: {
    title: 'Add Watermark — Free Online | Roughtools',
    description: 'Add text or logo watermarks to images. Control position, opacity, size. Free.',
    url: 'https://roughtools.com/tools/image-tools/add-watermark',
    type: 'website', siteName: 'Roughtools',
  },
  twitter: { card: 'summary_large_image', title: 'Add Watermark | Roughtools', description: 'Add watermarks to images online free. Text or image, full control.' },
}


const _s = getImageToolSupplement('add-watermark')

export default function Page() {
  return (
    <ImageToolShell
      toolName="Add Watermark"
      toolSlug="add-watermark"
      icon="??"
      description="Protect your photos and images by adding text or logo watermarks. Control the watermark position (corner, centre, tiled), opacity, size, font, and colour. Apply a consistent watermark to multiple images at once for batch protection. All processing happens in your browser — your original images are never uploaded to any server."
      howToSteps={[
        { name: 'Upload your image', text: 'Click the upload area or drag and drop a JPG, PNG, or WebP image. You can also add multiple images for batch watermarking.' },
        { name: 'Choose watermark type', text: 'Select Text to add a text watermark (your name, website URL, or copyright notice), or Image to use a logo PNG file as the watermark.' },
        { name: 'Customise the watermark', text: 'For text: choose font, size, colour, and opacity. For image: upload your logo PNG (transparent background recommended) and set its size. Position the watermark using the position grid (corner, centre, or tiled).' },
        { name: 'Preview', text: 'The watermark is shown on the image preview in real time. Adjust opacity if the watermark is too prominent or too subtle.' },
        { name: 'Apply and download', text: 'Click Apply. Download the watermarked image, or Download All if you are processing a batch.' },
      ]}
      useCases={[
        { title: 'Photographer copyright protection', description: 'Protect your photography portfolio images from unauthorised use. A semi-transparent watermark in the corner makes your work identifiable and deters theft while still displaying the image at full quality for clients.' },
        { title: 'Portfolio and preview images', description: 'Share preview images with clients without allowing them to use the high-resolution version. A clear watermark makes the preview version watermarked while the paid delivery is clean.' },
        { title: 'Social media content protection', description: 'Add your website URL or username as a watermark to social media graphics and photography. If your image is reshared, the watermark keeps your brand visible.' },
        { title: 'E-commerce product photo branding', description: 'Add a subtle brand logo to product photos before publishing on social media. The watermark maintains brand recognition even if photos are downloaded and reused.' },
        { title: 'Educational and presentation materials', description: 'Add a copyright notice or organisation logo to images used in presentations, course materials, and educational resources to maintain attribution.' },
      ]}
      specs={[
        { label: 'Watermark types', value: 'Text or image (logo PNG)' },
        { label: 'Position options', value: 'All 9 grid positions, centre, tiled pattern' },
        { label: 'Opacity control', value: 'Yes — 0% to 100%' },
        { label: 'Font options', value: 'Multiple font families and styles' },
        { label: 'Batch processing', value: 'Yes — apply same watermark to multiple images' },
        { label: 'Server upload', value: 'Never — 100% browser-based' },
        { label: 'Watermark on output', value: 'None added by this tool' },
        { label: 'Cost', value: 'Free, no account needed' },
      ]}
      faqs={[
        { q: 'What opacity should I use for a watermark?', a: '20–40% opacity is the sweet spot for most watermarks — visible enough to identify ownership but transparent enough to still see the image clearly. For stock photo previews or images you do not want used without payment, use 50–70%. For subtle branding on social media posts, 15–25% is less distracting.' },
        { q: 'Should I use a text watermark or a logo watermark?', a: 'Text watermarks (your name, website, copyright symbol) are quick to set up and work well for most purposes. Logo watermarks give a more professional, branded look but require a PNG logo with a transparent background for clean results. For photographers and creators building a brand, a logo watermark is more recognisable at small sizes.' },
        { q: 'What is a tiled watermark and when should I use it?', a: 'A tiled watermark repeats the watermark pattern across the entire image in a grid. This provides comprehensive protection against cropping — cutting out a corner watermark removes only the corner, but a tiled pattern makes removal much harder. Use tiled watermarks for proof prints and previews shared with clients before payment.' },
        { q: 'Can watermarks be removed by the recipient?', a: 'A simple corner watermark can be cropped out. A tiled watermark at moderate opacity is much harder to remove but can still be removed using advanced photo editing tools. No watermark provides absolute protection — they primarily deter casual copying and maintain attribution when images are shared.' },
        { q: 'Can I watermark multiple images at once?', a: 'Yes. Drop multiple images into the upload area. The watermark settings you configure are applied to all images in the batch. Download each image individually or use Download All.' },
        { q: 'What font should I use for a text watermark?', a: 'Clean, readable sans-serif fonts like Arial, Helvetica, or Montserrat work well for most uses. Italic or script fonts add elegance for photography portfolios. Avoid very decorative fonts that become illegible at small sizes. Test the watermark at the actual size it will appear on the shared image before applying to your full batch.' },
      ]}
      relatedTools={[
        { name: 'Remove Watermark', href: '/tools/image-tools/remove-watermark', icon: '???', description: 'Remove watermarks from your own images' },
        { name: 'Image Compressor', href: '/tools/image-tools/image-compressor', icon: '???', description: 'Compress watermarked images for sharing' },
        { name: 'Bulk Image Resizer', href: '/tools/image-tools/bulk-image-resizer', icon: '??', description: 'Resize multiple images before watermarking' },
        { name: 'Image Resizer', href: '/tools/image-tools/image-resizer', icon: '??', description: 'Resize individual images' },
        { name: 'Add Border', href: '/tools/image-tools/add-border', icon: '???', description: 'Add a decorative border' },
        { name: 'Image Enhancer', href: '/tools/image-tools/image-enhancer', icon: '?', description: 'Enhance before watermarking' },
      ]}      {...(_s ? { aboutHTML: _s.aboutHTML, proTips: _s.proTips, ratingValue: _s.ratingValue, reviewCount: _s.reviewCount } : {})}
    >
      <AddWatermarkClient />
    </ImageToolShell>
  )
}
