import type { Metadata } from 'next';
import ImageToolShell from '@/components/image-tools/ImageToolShell';
import DominantColorClient from './DominantColorClient';
import { getImageToolSupplement } from '@/data/imageTools';

export const metadata: Metadata = {
  title: 'Dominant Color Extractor — Extract Top Colors from Image Free Online | Roughtools',
  description:
    'Extract the dominant and most common colours from any image online for free. Get a colour palette with HEX codes. Perfect for brand design and palette creation. Browser-based.',
  keywords: [
    'dominant color extractor',
    'extract colors from image',
    'image color palette',
    'dominant colors',
    'color palette generator',
    'image palette extractor',
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/image-tools/dominant-color-extractor' },
  openGraph: {
    title: 'Dominant Color Extractor — Free Online | Roughtools',
    description:
      'Extract dominant colours from any image. Get a full colour palette with HEX codes.',
    url: 'https://roughtools.com/tools/image-tools/dominant-color-extractor',
    type: 'website',
    siteName: 'Roughtools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dominant Color Extractor | Roughtools',
    description: 'Extract top colours from images. Full palette with HEX codes. Free.',
  },
};

const _s = getImageToolSupplement('dominant-color-extractor');

export default function Page() {
  return (
    <ImageToolShell
      toolName="Dominant Color Extractor"
      toolSlug="dominant-color-extractor"
      icon="??"
      description="Automatically extract the most dominant and representative colours from any image. Upload a photo, illustration, or screenshot and get a complete colour palette — the top 5, 8, or 12 colours sorted by frequency. Each colour is shown with its HEX, RGB, and HSL values ready to copy. Perfect for building design systems from brand photos, creating harmonious colour palettes, and analysing image colour composition."
      howToSteps={[
        {
          name: 'Upload your image',
          text: 'Click the upload area or drag and drop a JPG, PNG, or WebP image. The extraction works on photographs, illustrations, logos, and screenshots.',
        },
        {
          name: 'Choose palette size',
          text: 'Select how many colours to extract: 5 (main palette), 8 (extended), or 12 (full detail). More colours capture subtle variations; fewer colours give a cleaner, more usable palette.',
        },
        {
          name: 'Extract colours',
          text: 'Click Extract. The tool analyses every pixel using a colour quantisation algorithm (median cut or k-means clustering) to find the most representative colour groups.',
        },
        {
          name: 'Copy colour values',
          text: 'Click any colour swatch to copy its HEX value. Click the colour name to cycle through HEX, RGB, and HSL formats. Export the full palette as CSS variables, JSON, or a colour swatch image.',
        },
      ]}
      useCases={[
        {
          title: 'Brand palette creation from photography',
          description:
            'Upload key brand photography to automatically extract the dominant colours. Use these as the foundation for a brand colour system that is rooted in the visual identity of your photography.',
        },
        {
          title: 'Web and UI design colour systems',
          description:
            'Extract colours from competitor websites (via screenshot), inspiration images, or art direction photography to build a coherent design system colour palette.',
        },
        {
          title: 'Interior design and fashion colour matching',
          description:
            'Upload a room photo, fabric swatch, or fashion image to extract the exact colours and find matching paint codes, fabric dyes, or complementary colour suggestions.',
        },
        {
          title: 'Data visualisation colour selection',
          description:
            'Charts and data visualisations need colour palettes that are visually distinct but harmonious. Extract colours from a reference image to create a thematically consistent palette for your data graphics.',
        },
        {
          title: 'Print and packaging design',
          description:
            'Extract colours from product packaging photography for consistent colour specification across print, digital, and packaging materials.',
        },
      ]}
      specs={[
        { label: 'Input formats', value: 'JPG, PNG, WebP, GIF' },
        { label: 'Palette sizes', value: '5, 8, or 12 dominant colours' },
        { label: 'Colour formats', value: 'HEX, RGB, HSL per swatch' },
        { label: 'Export options', value: 'CSS variables, JSON, PNG swatch image' },
        { label: 'Extraction algorithm', value: 'Median cut colour quantisation' },
        { label: 'Server upload', value: 'Never — 100% browser-based' },
        { label: 'Cost', value: 'Free, no account needed' },
      ]}
      faqs={[
        {
          q: 'How does dominant colour extraction work?',
          a: 'The tool uses a colour quantisation algorithm (median cut) that divides the full colour space of the image into clusters of similar colours. The most populous cluster centres are returned as the dominant colours. This produces colours that are representative of the image rather than the single most common exact pixel colour, which might be a very specific shade that does not represent the image well.',
        },
        {
          q: 'Why does the extracted palette sometimes not match what I see?',
          a: 'Colour quantisation works with pixel-level data. A large grey background might dominate the extraction even if the focal subject is colourful. Crop the image to focus on the area you want colours from, or try a larger palette size to capture more nuanced colours from less dominant areas.',
        },
        {
          q: 'What is the difference between this and the Image Color Picker?',
          a: 'The Color Picker lets you click specific pixels and get exact values — useful when you know which colour you want. The Dominant Color Extractor analyses the entire image automatically and returns the most representative colour groups — useful when you want to understand or replicate the overall colour story of an image without manually clicking around.',
        },
        {
          q: 'Can I use the extracted palette in Figma or Sketch?',
          a: 'Yes. Copy the HEX values and paste them into Figma or Sketch colour pickers. For Figma specifically, you can also copy the CSS variables export and use them in a design token workflow. The JSON export is compatible with style dictionary and most design token tools.',
        },
        {
          q: 'Will very similar colours be extracted as separate swatches?',
          a: 'The quantisation algorithm groups similar colours together, so closely related shades typically appear as one cluster. Increasing the palette size (to 12 colours) reveals more nuanced distinctions. If you need pixel-precise colour values from specific areas, use the Image Color Picker instead.',
        },
        {
          q: 'What is the best image size for accurate extraction?',
          a: 'Larger images produce more accurate results because the algorithm has more pixel data to work with. For best results, use images at least 400×400 pixels. Very small images (under 100×100px) may produce less representative palettes. Very large images (above 2000×2000px) are automatically downsampled for performance.',
        },
      ]}
      relatedTools={[
        {
          name: 'Image Color Picker',
          href: '/tools/image-tools/image-color-picker',
          icon: '??',
          description: 'Pick individual pixel colours precisely',
        },
        {
          name: 'Image Enhancer',
          href: '/tools/image-tools/image-enhancer',
          icon: '?',
          description: 'Adjust image colour and tone',
        },
        {
          name: 'Grayscale Converter',
          href: '/tools/image-tools/grayscale-converter',
          icon: '?',
          description: 'Convert to black and white',
        },
        {
          name: 'Image Compressor',
          href: '/tools/image-tools/image-compressor',
          icon: '???',
          description: 'Compress images for web',
        },
        {
          name: 'Image Cropper',
          href: '/tools/image-tools/image-cropper',
          icon: '??',
          description: 'Crop to focus area before extracting',
        },
        {
          name: 'Image Converter',
          href: '/tools/image-tools/image-converter',
          icon: '??',
          description: 'Convert image format',
        },
      ]}
      {...(_s ? { aboutHTML: _s.aboutHTML, proTips: _s.proTips } : {})}
    >
      <DominantColorClient />
    </ImageToolShell>
  );
}
