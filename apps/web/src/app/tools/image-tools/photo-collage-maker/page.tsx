import type { Metadata } from 'next'
import ImageToolShell from '@/components/image-tools/ImageToolShell'
import CollageClient from './CollageClient'
import { getImageToolSupplement } from '@/data/imageTools'

export const metadata: Metadata = {
  title: 'Photo Collage Maker — Create Photo Collages Free Online | Roughtools',
  description: 'Create beautiful photo collages online for free. Choose from grid, mosaic, and freeform layouts. Add multiple photos, adjust spacing and borders, and download instantly. Browser-based.',
  keywords: ['photo collage maker', 'collage maker online', 'free collage maker', 'photo grid maker', 'image collage', 'picture collage maker'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/image-tools/photo-collage-maker' },
  openGraph: {
    title: 'Photo Collage Maker — Free Online | Roughtools',
    description: 'Create photo collages with grid, mosaic, and freeform layouts. Free, no signup.',
    url: 'https://roughtools.com/tools/image-tools/photo-collage-maker',
    type: 'website', siteName: 'Roughtools',
  },
  twitter: { card: 'summary_large_image', title: 'Photo Collage Maker | Roughtools', description: 'Create photo collages online free. Multiple layouts, instant download.' },
}


const _s = getImageToolSupplement('photo-collage-maker')

export default function Page() {
  return (
    <ImageToolShell
      toolName="Photo Collage Maker"
      toolSlug="photo-collage-maker"
      icon="???"
      description="Combine multiple photos into a beautiful collage with grid, mosaic, and freeform layout options. Upload 2–20 photos, select a layout template, adjust the spacing between photos and the border width, and download the finished collage as a single high-quality image. Perfect for social media albums, photo books, event highlights, and creative projects. All processing is browser-based."
      howToSteps={[
        { name: 'Upload your photos', text: 'Click the upload area or drag and drop 2–20 JPG, PNG, or WebP images. Photos are added to the layout panel where you can rearrange them by dragging.' },
        { name: 'Choose a layout', text: 'Select a layout template: 2-photo side-by-side, 3-photo L-shape, 4-photo grid, magazine mosaic, Instagram-style grid, or freeform (drag photos to any position and size).' },
        { name: 'Adjust spacing and style', text: 'Set the gap between photos (0 for borderless, or 4–20px for defined grid lines). Choose a background colour for the gaps. Add an outer border if desired.' },
        { name: 'Resize individual photos', text: 'Click any photo in the layout to drag its edges and resize it within the grid. Rearrange the order by dragging photos to swap their positions.' },
        { name: 'Download', text: 'Set the output width (recommended: 2048px for social media, 3000px for print) and click Download. The collage is saved as a single high-resolution JPG or PNG.' },
      ]}
      useCases={[
        { title: 'Instagram and social media albums', description: 'Share multiple photos in a single post using a 2×2 or 3×1 grid collage. One collage post shows more content than multiple individual posts and often gets better engagement.' },
        { title: 'Event highlights and recap posts', description: 'Combine the best photos from a wedding, birthday, conference, or trip into a single highlight collage. Before/after layouts work especially well for transformations and results.' },
        { title: 'Product comparison and showcase', description: 'Show multiple product variants, colours, or angles in a single organised image. Grid layouts with consistent spacing give a professional, catalogue-style presentation.' },
        { title: 'Photo book and album pages', description: 'Create collage pages for digital photo books. Combine related photos — all from one day, one person, or one location — into a single cohesive page layout.' },
        { title: 'Before and after presentations', description: 'Side-by-side two-photo layouts are ideal for before/after renovation, makeover, fitness progress, or design comparison content that shows transformation clearly.' },
      ]}
      specs={[
        { label: 'Supported formats', value: 'JPG, PNG, WebP' },
        { label: 'Max photos per collage', value: '20 images' },
        { label: 'Layout templates', value: '2, 3, 4, 6, 9-photo grids plus freeform' },
        { label: 'Gap and border control', value: 'Yes — adjustable spacing and border colour' },
        { label: 'Output resolution', value: 'Up to 4000px wide' },
        { label: 'Output formats', value: 'JPG, PNG' },
        { label: 'Server upload', value: 'Never — 100% browser-based' },
        { label: 'Cost', value: 'Free, no account needed' },
      ]}
      faqs={[
        { q: 'How many photos can I add to one collage?', a: 'The tool supports up to 20 photos in a single collage. For practical reasons, most collage layouts work best with 2–9 photos — more than 9 produces very small individual cells that may not show the photos clearly. For large collections, create multiple collages and consider whether a slideshow format might serve better.' },
        { q: 'Can I change the order of photos after adding them?', a: 'Yes. Drag photos within the layout panel to swap positions. Click and hold a photo then drag it to another cell to swap those two positions. This works in grid layouts — in freeform layout you can drag photos anywhere on the canvas.' },
        { q: 'What output resolution should I choose for social media?', a: 'For Instagram, Facebook, and Twitter, 2048px wide is more than sufficient and keeps file size manageable. For printing at 8×10 inches at 300 DPI, use 3000px wide. For digital use only, 1500–2048px gives crisp results on any screen without creating unnecessarily large files.' },
        { q: 'Can I add text to the collage?', a: 'The collage maker is focused on photo layout. For adding titles, captions, or overlaid text to the finished collage, download the collage image then use the Thumbnail Maker or Meme Generator tool to add text overlays.' },
        { q: 'How do I create a borderless collage?', a: 'Set the gap value to 0 and the background colour to any colour (it will not be visible with 0 gap). The photos tile directly against each other with no space between them. Borderless grids give a seamless, magazine-style look.' },
        { q: 'Can I use photos in different orientations (portrait and landscape mixed)?', a: 'Yes. The layout engine crops each photo to fill its cell in the grid. All cells in a grid layout are the same size, so portrait photos are centre-cropped to fill the cell. Use the freeform layout if you need to preserve different aspect ratios for different photos.' },
      ]}
      relatedTools={[
        { name: 'Image Resizer', href: '/tools/image-tools/image-resizer', icon: '??', description: 'Resize individual photos before collaging' },
        { name: 'Image Compressor', href: '/tools/image-tools/image-compressor', icon: '???', description: 'Compress the finished collage' },
        { name: 'Image Cropper', href: '/tools/image-tools/image-cropper', icon: '??', description: 'Crop photos to matching ratios' },
        { name: 'Thumbnail Maker', href: '/tools/image-tools/thumbnail-maker', icon: '??', description: 'Add text to your collage' },
        { name: 'Image Enhancer', href: '/tools/image-tools/image-enhancer', icon: '?', description: 'Enhance photos before collaging' },
        { name: 'Add Border', href: '/tools/image-tools/add-border', icon: '???', description: 'Add a frame to the finished collage' },
      ]}      {...(_s ? { aboutHTML: _s.aboutHTML, proTips: _s.proTips, ratingValue: _s.ratingValue, reviewCount: _s.reviewCount } : {})}
    >
      <CollageClient />
    </ImageToolShell>
  )
}
