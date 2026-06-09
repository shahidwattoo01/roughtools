import type { Metadata } from 'next'
import ImageToolShell from '@/components/image-tools/ImageToolShell'
import WhiteBackgroundClient from './WhiteBackgroundClient'
import { getImageToolSupplement } from '@/data/imageTools'

export const metadata: Metadata = {
  title: 'White Background Maker — Add White Background to Image Free Online | Roughtools',
  description: 'Add a white background to any PNG with transparency online for free. Perfect for e-commerce, Amazon product photos, and professional images. 100% browser-based.',
  keywords: ['white background maker', 'add white background', 'white background image', 'remove transparency', 'png white background', 'amazon product photo'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/image-tools/white-background-maker' },
  openGraph: {
    title: 'White Background Maker — Free Online | Roughtools',
    description: 'Add white background to transparent PNG images. Perfect for e-commerce. Free.',
    url: 'https://roughtools.com/tools/image-tools/white-background-maker',
    type: 'website', siteName: 'Roughtools',
  },
  twitter: { card: 'summary_large_image', title: 'White Background Maker | Roughtools', description: 'Add white background to PNG images online free.' },
}


const _s = getImageToolSupplement('white-background-maker')

export default function Page() {
  return (
    <ImageToolShell
      toolName="White Background Maker"
      toolSlug="white-background-maker"
      icon="?"
      description="Add a clean white background to any transparent PNG image instantly. Perfect for e-commerce product photos (Amazon, Etsy, Shopify all require white backgrounds), professional logos, and any context where a transparent PNG needs to be presented on a white canvas. You can also choose any custom background colour. Runs entirely in your browser — your files stay private."
      howToSteps={[
        { name: 'Upload your PNG image', text: 'Upload a PNG file with a transparent background (checkerboard pattern). This is typically the output from the Background Remover tool.' },
        { name: 'Choose the background colour', text: 'White is selected by default. Click the colour picker to choose a different colour — light grey, cream, or any custom hex colour.' },
        { name: 'Adjust padding (optional)', text: 'Add whitespace around the subject to give it breathing room within the frame. This is especially useful for product photos that need a margin around the object.' },
        { name: 'Preview', text: 'The result is shown in real time. Toggle the background colour to check how the edges of your subject look against the new background.' },
        { name: 'Download', text: 'Download as JPG (smaller file size) or PNG (lossless). For e-commerce platforms, JPG at 90% quality is typically preferred.' },
      ]}
      useCases={[
        { title: 'Amazon and Etsy product photos', description: 'Amazon requires the main product image to have a pure white background (#FFFFFF). Etsy and most other marketplaces have similar requirements. Create compliant product photos in seconds.' },
        { title: 'Logo export for documents and presentations', description: 'Logos on transparent backgrounds do not paste cleanly into Word, PowerPoint, or PDF documents that have white backgrounds. Add a white background to make logos paste correctly in any document.' },
        { title: 'Professional portfolio and CV images', description: 'Headshots and profile photos on a clean white background look professional in CVs, portfolios, and email signatures. Use this tool to standardise headshot backgrounds to white.' },
        { title: 'Print preparation', description: 'Transparent PNG files do not print correctly — the transparency is rendered as black or another colour depending on the application. Add a white background before printing to ensure the correct output.' },
        { title: 'Social media profile images', description: 'Some platforms render transparent background profile images differently. Adding a white background ensures consistent display across all platforms and dark/light mode variations.' },
      ]}
      specs={[
        { label: 'Input format', value: 'PNG (with transparency)' },
        { label: 'Output formats', value: 'JPG, PNG' },
        { label: 'Background colour', value: 'White (default) or any custom colour' },
        { label: 'Padding option', value: 'Yes — add whitespace margin around subject' },
        { label: 'Max file size', value: '20 MB per image' },
        { label: 'Server upload', value: 'Never — 100% browser-based' },
        { label: 'Watermark', value: 'None' },
        { label: 'Cost', value: 'Free, no account needed' },
      ]}
      faqs={[
        { q: 'What is the correct white colour code for Amazon product photos?', a: 'Amazon requires a pure white background with an RGB value of 255, 255, 255 — hex code #FFFFFF. This tool uses pure white by default. Any value slightly off-white (like cream or light grey) may be flagged by Amazon\'s automated image checker. Use the default white setting and do not use a custom colour for Amazon listings.' },
        { q: 'Can I use this to add a background colour other than white?', a: 'Yes. Click the colour picker and choose any colour. Common alternatives to white include light grey (#F5F5F5 or #E8E8E8) for a softer look, or any brand colour for consistent marketing imagery. For e-commerce marketplaces, check the platform\'s specific background colour requirements before choosing a non-white colour.' },
        { q: 'Does this tool work on JPG images?', a: 'The tool is designed for transparent PNG images. JPG files do not have transparency, so there is no transparent background to fill — the result would just be the original JPG with no change. Use the Background Remover first to create a transparent PNG, then use this tool to add the white background.' },
        { q: 'Should I download as JPG or PNG?', a: 'For most use cases including e-commerce, download as JPG. With a white background, JPG compression is very efficient — a 90% quality JPG will look identical to PNG but be 5–10x smaller. Download as PNG only if you specifically need a lossless file or if the platform requires PNG format.' },
        { q: 'Can I add padding around the product?', a: 'Yes. The padding option adds whitespace around the subject. Amazon recommends the product occupies 85% of the image frame, with 15% whitespace. Setting 7–8% padding on each side achieves this. The padding is added symmetrically unless you specify different values for each side.' },
        { q: 'My image has semi-transparent edges (anti-aliasing) — will those look right on a white background?', a: 'Semi-transparent edge pixels are blended with the background colour. On a white background, these blend to produce a natural-looking anti-aliased edge. If you add a coloured background, those edge pixels blend with that colour instead, which may produce a fringe or halo effect. For the cleanest edges on a coloured background, use the Background Changer tool which has a feather control.' },
      ]}
      relatedTools={[
        { name: 'Background Remover', href: '/tools/image-tools/background-remover', icon: '??', description: 'Remove background first to get transparent PNG' },
        { name: 'Background Changer', href: '/tools/image-tools/background-changer', icon: '??', description: 'Add any colour or photo background' },
        { name: 'Image Compressor', href: '/tools/image-tools/image-compressor', icon: '???', description: 'Compress product photo before uploading' },
        { name: 'Image Resizer', href: '/tools/image-tools/image-resizer', icon: '??', description: 'Resize to marketplace requirements' },
        { name: 'Passport Photo Maker', href: '/tools/image-tools/passport-photo-maker', icon: '??', description: 'Create passport photos on white background' },
        { name: 'Image Converter', href: '/tools/image-tools/image-converter', icon: '??', description: 'Convert to JPG after adding background' },
      ]}      {...(_s ? { aboutHTML: _s.aboutHTML, proTips: _s.proTips, ratingValue: _s.ratingValue, reviewCount: _s.reviewCount } : {})}
    >
      <WhiteBackgroundClient />
    </ImageToolShell>
  )
}
