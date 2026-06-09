import type { Metadata } from 'next'
import ImageToolShell from '@/components/image-tools/ImageToolShell'
import ColorPickerClient from './ColorPickerClient'
import { getImageToolSupplement } from '@/data/imageTools'

export const metadata: Metadata = {
  title: 'Image Color Picker — Pick Any Color from an Image Free Online | Roughtools',
  description: 'Pick exact colours from any image online for free. Click anywhere on the image to get the HEX, RGB, HSL, and CMYK values. Copy to clipboard instantly. 100% browser-based.',
  keywords: ['image color picker', 'pick color from image', 'color picker online', 'eyedropper tool', 'hex color from image', 'image color sampler'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/image-tools/image-color-picker' },
  openGraph: {
    title: 'Image Color Picker — Free Online | Roughtools',
    description: 'Click any pixel to get HEX, RGB, HSL colour values. Free, instant, browser-based.',
    url: 'https://roughtools.com/tools/image-tools/image-color-picker',
    type: 'website', siteName: 'Roughtools',
  },
  twitter: { card: 'summary_large_image', title: 'Image Color Picker | Roughtools', description: 'Pick exact colours from images online free. HEX, RGB, HSL values.' },
}


const _s = getImageToolSupplement('image-color-picker')

export default function Page() {
  return (
    <ImageToolShell
      toolName="Image Color Picker"
      toolSlug="image-color-picker"
      icon="??"
      description="Click any pixel in an image to instantly get the exact colour value in HEX, RGB, HSL, and CMYK formats. Hover to preview colours before clicking. Build a palette by clicking multiple points and saving the colour samples. Perfect for designers, developers, and brand managers who need to match colours precisely from photos, logos, or reference images."
      howToSteps={[
        { name: 'Upload your image', text: 'Click the upload area or drag and drop a JPG, PNG, WebP, or GIF image. Any image you want to sample colours from works.' },
        { name: 'Hover to preview', text: 'Move your cursor over the image. A magnified zoom view shows the pixels under your cursor and the current colour values update in real time.' },
        { name: 'Click to sample', text: 'Click any point on the image to lock in that colour sample. The HEX, RGB, HSL, and CMYK values are displayed and can be copied individually.' },
        { name: 'Build a palette', text: 'Click multiple points to add colours to your palette. Each sampled colour is saved in the palette row below the image for comparison.' },
        { name: 'Copy and use', text: 'Click any colour value to copy it to the clipboard. Use the HEX code in CSS, Figma, or any design tool; use RGB for digital art applications; use CMYK for print design.' },
      ]}
      useCases={[
        { title: 'Brand colour matching', description: 'Match exact brand colours from a logo or marketing material image. Get the precise HEX codes to use in CSS, design tools, or print specifications — ensuring colour consistency across all brand materials.' },
        { title: 'Web and app design', description: 'Pick colours from reference images, competitor websites (via screenshot), or design mockups. Copy the HEX value directly into CSS, Tailwind config, or any web design tool.' },
        { title: 'Creating colour palettes from photos', description: 'Sample the key colours from a photograph to build a harmonious colour palette. Use colours from landscape photos, food photography, or product images to inform a design system.' },
        { title: 'Print design and CMYK values', description: 'Get CMYK values from reference images for print design work. CMYK colour values are required by printers and are not available from standard digital colour pickers — this tool provides them alongside HEX and RGB.' },
        { title: 'Reproducing colours in digital art', description: 'Match a specific colour from a reference image in painting, illustration, or photo editing software. The RGB values paste directly into most digital art application colour pickers.' },
      ]}
      specs={[
        { label: 'Input formats', value: 'JPG, PNG, WebP, GIF, SVG' },
        { label: 'Colour formats output', value: 'HEX, RGB, HSL, CMYK' },
        { label: 'Magnified preview', value: 'Yes — zoom view while hovering' },
        { label: 'Palette builder', value: 'Yes — save multiple sampled colours' },
        { label: 'Copy to clipboard', value: 'Yes — one-click copy per format' },
        { label: 'Server upload', value: 'Never — 100% browser-based' },
        { label: 'Cost', value: 'Free, no account needed' },
      ]}
      faqs={[
        { q: 'What colour formats does the tool output?', a: 'The tool outputs four colour formats: HEX (#RRGGBB — used in CSS and most design tools), RGB (Red, Green, Blue — 0–255 values used in digital applications), HSL (Hue, Saturation, Lightness — useful for colour relationships), and CMYK (Cyan, Magenta, Yellow, Key/Black — used for print design and professional printing). Copy any format with one click.' },
        { q: 'How accurate is the colour sampling?', a: 'The tool samples the exact RGB values of the pixel at the point you click. For JPG images, these values reflect the current pixel colour after JPEG compression — compressed JPGs have slightly altered colours compared to the original uncompressed image. For PNG, the values are exact. For the most accurate colour matching, use PNG or WebP source images rather than JPG.' },
        { q: 'Can I sample colours from a URL instead of uploading an image?', a: 'Currently the tool requires you to upload or paste an image file. To sample colours from a webpage or online image, take a screenshot first and upload the screenshot image.' },
        { q: 'What is the difference between HSL and RGB colour formats?', a: 'RGB describes a colour as a combination of red, green, and blue light intensity values (0–255 each). HSL describes the same colour in terms more intuitive for designers: Hue (the colour wheel position, 0–360°), Saturation (how vivid or grey the colour is, 0–100%), and Lightness (how light or dark, 0–100%). HSL makes it easy to create lighter or darker variations of a colour by just changing the L value.' },
        { q: 'How do I match a colour from a company logo?', a: 'Upload a PNG version of the logo (PNG gives more accurate colour values than JPG). Hover over the specific colour area and click to sample. The HEX value you get is the digital colour — compare with the brand guidelines to check accuracy. Brand colours from official guidelines may differ slightly from what is rendered in a JPG logo due to compression.' },
        { q: 'Can I pick colours from an animated GIF?', a: 'Yes, but the tool samples the first frame of the GIF. If you need colours from a specific frame, take a screenshot of that frame and upload the screenshot.' },
      ]}
      relatedTools={[
        { name: 'Dominant Color Extractor', href: '/tools/image-tools/dominant-color-extractor', icon: '??', description: 'Extract the top colours from any image' },
        { name: 'Image Enhancer', href: '/tools/image-tools/image-enhancer', icon: '?', description: 'Adjust colour and tone' },
        { name: 'Grayscale Converter', href: '/tools/image-tools/grayscale-converter', icon: '?', description: 'Convert to black and white' },
        { name: 'Image Metadata Viewer', href: '/tools/image-tools/image-metadata-viewer', icon: '??', description: 'View colour profile and image info' },
        { name: 'Image Compressor', href: '/tools/image-tools/image-compressor', icon: '???', description: 'Compress images before sharing' },
        { name: 'Image Converter', href: '/tools/image-tools/image-converter', icon: '??', description: 'Convert format for better colour accuracy' },
      ]}      {...(_s ? { aboutHTML: _s.aboutHTML, proTips: _s.proTips, ratingValue: _s.ratingValue, reviewCount: _s.reviewCount } : {})}
    >
      <ColorPickerClient />
    </ImageToolShell>
  )
}
