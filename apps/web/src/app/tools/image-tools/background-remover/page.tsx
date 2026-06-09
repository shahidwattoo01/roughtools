import type { Metadata } from 'next'
import ImageToolShell from '@/components/image-tools/ImageToolShell'
import BackgroundRemoverClient from './BackgroundRemoverClient'
import { getImageToolSupplement } from '@/data/imageTools'

export const metadata: Metadata = {
  title: 'Background Remover — Remove Image Background Free Online | Roughtools',
  description: 'Remove the background from any image online for free. Get a transparent PNG instantly. Perfect for product photos, profile pictures, and logos. No signup required.',
  keywords: ['background remover', 'remove background online', 'transparent background', 'remove image background', 'background eraser', 'photo background remover'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/image-tools/background-remover' },
  openGraph: {
    title: 'Background Remover — Free Online | Roughtools',
    description: 'Remove image backgrounds and get a transparent PNG. Free, instant, no signup.',
    url: 'https://roughtools.com/tools/image-tools/background-remover',
    type: 'website', siteName: 'Roughtools',
  },
  twitter: { card: 'summary_large_image', title: 'Background Remover | Roughtools', description: 'Remove image backgrounds free online. Transparent PNG output.' },
}


const _s = getImageToolSupplement('background-remover')

export default function Page() {
  return (
    <ImageToolShell
      toolName="Background Remover"
      toolSlug="background-remover"
      icon="??"
      description="Remove the background from any photo or image and get a clean transparent PNG. Perfect for product photography, profile pictures, logos, and creative projects. The tool uses intelligent edge detection to separate your subject from the background accurately — all processing happens in your browser, so your images stay private."
      howToSteps={[
        { name: 'Upload your image', text: 'Click the upload area or drag and drop your JPG or PNG image. For best results, use images where the subject has clear contrast against the background.' },
        { name: 'Automatic detection', text: 'The tool analyses the image and identifies the foreground subject using edge-detection algorithms. This happens automatically as soon as you upload.' },
        { name: 'Refine the selection', text: 'Use the brush tools to add or erase areas the automatic detection missed. Zoom in for fine detail work around hair, fur, or complex edges.' },
        { name: 'Preview the result', text: 'The processed image is shown against a checkerboard pattern indicating transparency. Toggle to a white or coloured background to check the edges.' },
        { name: 'Download', text: 'Download the result as a PNG with a transparent background, ready to use in design tools, websites, presentations, or e-commerce platforms.' },
      ]}
      useCases={[
        { title: 'Product photography for e-commerce', description: 'Amazon, Shopify, and most marketplaces require product images on a white or transparent background. Remove backgrounds in seconds instead of hours in Photoshop.' },
        { title: 'Profile pictures and headshots', description: 'Remove busy or unprofessional backgrounds from LinkedIn, CV, or professional profile photos. Replace with a neutral colour for a clean, polished result.' },
        { title: 'Logo and brand asset creation', description: 'If you only have a logo on a white background, remove it to create a transparent PNG that works on any coloured background or dark theme.' },
        { title: 'Graphic design and compositing', description: 'Cut subjects out of photos to place them in new scenes, over custom backgrounds, or onto posters and social media graphics.' },
        { title: 'Sticker and icon creation', description: 'Remove backgrounds to create stickers, custom emojis, or app icons. Export as PNG and use in messaging apps, apps, or print-on-demand products.' },
      ]}
      specs={[
        { label: 'Input formats', value: 'JPG, PNG' },
        { label: 'Output format', value: 'PNG (transparent background)' },
        { label: 'Max file size', value: '10 MB per image' },
        { label: 'Manual refinement', value: 'Yes — add/erase brush' },
        { label: 'Preview options', value: 'Transparent, white, or custom colour background' },
        { label: 'Server upload', value: 'Never — 100% browser-based' },
        { label: 'Watermark', value: 'None' },
        { label: 'Cost', value: 'Free, no account needed' },
      ]}
      faqs={[
        { q: 'How does automatic background removal work?', a: 'The tool uses edge detection and colour segmentation algorithms to identify the boundary between the foreground subject and the background. It analyses contrast, colour gradients, and edges to create a mask that separates the two. For clean backgrounds (solid colour or high contrast), this works very accurately. For complex or cluttered backgrounds, you may need to refine the edges with the brush tool.' },
        { q: 'What types of images work best?', a: 'Images with a clear subject against a uniform or high-contrast background give the best automatic results. Product photos on white, portrait shots with blurred backgrounds, and logos with solid fills all remove cleanly. Complex backgrounds like forests, busy streets, or patterned wallpaper may require more manual refinement.' },
        { q: 'Can I remove backgrounds from images with hair or fur?', a: 'Hair and fur are the hardest edges for any background remover because the strands are semi-transparent and highly detailed. The automatic tool handles most straight hair reasonably well. For very fine or curly hair, use the eraser at a small brush size with reduced opacity to refine around the edge. Professional results for complex hair typically require manual work with dedicated tools.' },
        { q: 'What format is the output?', a: 'The output is always a PNG file with a transparent background. PNG is the only widely supported format that preserves full alpha transparency. If you need to add a specific background colour, use the White Background Maker or Background Changer tool after removing the background.' },
        { q: 'Can I replace the background instead of just removing it?', a: 'After removing the background with this tool, use the Background Changer tool to add a solid colour, gradient, or new image as the background. The two tools work together as a complete workflow for background replacement.' },
        { q: 'Is there a file size or image dimension limit?', a: 'The tool handles images up to 10 MB in size. Very large images (above 4000×4000 pixels) may take longer to process and require more browser memory. For the best performance, resize very large images before removing the background if you do not need the full resolution.' },
      ]}
      relatedTools={[
        { name: 'White Background Maker', href: '/tools/image-tools/white-background-maker', icon: '?', description: 'Add a white background to transparent PNGs' },
        { name: 'Background Changer', href: '/tools/image-tools/background-changer', icon: '??', description: 'Replace background with colour or image' },
        { name: 'Image Compressor', href: '/tools/image-tools/image-compressor', icon: '???', description: 'Compress the result before uploading' },
        { name: 'Image Converter', href: '/tools/image-tools/image-converter', icon: '??', description: 'Convert to WebP or other formats' },
        { name: 'Image Resizer', href: '/tools/image-tools/image-resizer', icon: '??', description: 'Resize to platform requirements' },
        { name: 'Passport Photo Maker', href: '/tools/image-tools/passport-photo-maker', icon: '??', description: 'Create compliant passport photos' },
      ]}      {...(_s ? { aboutHTML: _s.aboutHTML, proTips: _s.proTips, ratingValue: _s.ratingValue, reviewCount: _s.reviewCount } : {})}
    >
      <BackgroundRemoverClient />
    </ImageToolShell>
  )
}
