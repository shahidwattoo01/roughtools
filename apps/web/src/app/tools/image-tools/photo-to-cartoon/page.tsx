import type { Metadata } from 'next'
import ImageToolShell from '@/components/image-tools/ImageToolShell'
import CartoonClient from './CartoonClient'
import { getImageToolSupplement } from '@/data/imageTools'

export const metadata: Metadata = {
  title: 'Photo to Cartoon — Convert Photo to Cartoon Effect Free Online | Roughtools',
  description: 'Convert photos to cartoon and sketch effects online for free. Multiple styles: comic, anime, pencil sketch, watercolour. Real-time preview. 100% browser-based, no upload.',
  keywords: ['photo to cartoon', 'cartoonize photo', 'cartoon effect online', 'photo cartoon converter', 'sketch effect', 'anime photo filter', 'cartoon photo maker'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/image-tools/photo-to-cartoon' },
  openGraph: {
    title: 'Photo to Cartoon — Free Online | Roughtools',
    description: 'Convert photos to cartoon, sketch, or anime style. Multiple effects. Free.',
    url: 'https://roughtools.com/tools/image-tools/photo-to-cartoon',
    type: 'website', siteName: 'Roughtools',
  },
  twitter: { card: 'summary_large_image', title: 'Photo to Cartoon | Roughtools', description: 'Convert photos to cartoon effects online free. Comic, anime, sketch.' },
}


const _s = getImageToolSupplement('photo-to-cartoon')

export default function Page() {
  return (
    <ImageToolShell
      toolName="Photo to Cartoon"
      toolSlug="photo-to-cartoon"
      icon="??"
      description="Transform any photo into a cartoon, comic book illustration, anime character, pencil sketch, or watercolour painting using artistic filter effects. Each style uses different image processing algorithms to create a unique visual output — from bold comic outlines to soft watercolour washes. Preview each style in real time before downloading. All processing runs in your browser."
      howToSteps={[
        { name: 'Upload your photo', text: 'Click the upload area or drag and drop a JPG or PNG photo. Portrait photos and clear subjects produce the most striking cartoon effects.' },
        { name: 'Choose a cartoon style', text: 'Select from: Comic Book (bold outlines, flat colours), Anime (smooth shading, anime-style rendering), Pencil Sketch (black and white line art), Watercolour (soft brushed colour washes), or Oil Painting (thick brushstroke texture).' },
        { name: 'Adjust intensity', text: 'Use the intensity slider to control how strong the effect is. Lower values blend the cartoon effect with the original photo; higher values produce a fully stylised result.' },
        { name: 'Preview in real time', text: 'The effect is applied and updated live as you change settings. Use the before/after slider to compare the cartoonised result against the original photo.' },
        { name: 'Download', text: 'Download the cartoonised image as JPG or PNG. Share on social media, use as an avatar, or print as wall art.' },
      ]}
      useCases={[
        { title: 'Fun profile pictures and avatars', description: 'A cartoon version of your photo makes a distinctive and personal profile picture for social media, gaming platforms, Discord, and messaging apps — more expressive than a standard photo.' },
        { title: 'Children\'s content and family projects', description: 'Cartoon effects make family photos more playful for children\'s birthday invitations, personalized gifts, photo books, and family event decorations.' },
        { title: 'Social media content and engagement', description: 'Cartoon-style images stand out in feeds dominated by standard photography. Use cartoon effects on product photos, team headshots, or event photos for eye-catching social content.' },
        { title: 'Custom gifts and merchandise', description: 'Cartoon portraits are popular for custom mugs, phone cases, canvas prints, and T-shirts. Convert a photo to a clean cartoon style and use it for print-on-demand products.' },
        { title: 'Digital art and creative projects', description: 'Use cartoon effects as a starting point for digital illustration, comics, and creative art projects. The sketch and outline effects provide a base for further digital painting.' },
      ]}
      specs={[
        { label: 'Input formats', value: 'JPG, PNG, WebP' },
        { label: 'Cartoon styles', value: 'Comic book, anime, pencil sketch, watercolour, oil painting' },
        { label: 'Intensity control', value: 'Yes — blend original and effect' },
        { label: 'Before/after comparison', value: 'Yes — drag slider' },
        { label: 'Max file size', value: '10 MB per image' },
        { label: 'Server upload', value: 'Never — 100% browser-based' },
        { label: 'Watermark', value: 'None' },
        { label: 'Cost', value: 'Free, no account needed' },
      ]}
      faqs={[
        { q: 'Which photo type works best for cartoon effects?', a: 'Portraits with a clear subject against a contrasting background produce the best cartoon results, especially for comic book and anime styles. High-contrast images with good lighting cartoonise most effectively. Blurry, low-light, or very cluttered photos produce less defined cartoon outlines.' },
        { q: 'What is the difference between the cartoon styles?', a: 'Comic Book applies bold black outlines and reduces the image to flat colour regions — similar to printed comic illustrations. Anime uses smooth shading with a cel-shaded look inspired by Japanese animation. Pencil Sketch removes colour and draws edge lines as if hand-sketched with a pencil. Watercolour softens edges and adds a wet, brushed texture. Oil Painting adds thick visible brushstrokes.' },
        { q: 'Will the cartoon effect look good on any image?', a: 'The effects work best on photographs with clear subjects and reasonable lighting. Very dark, very bright, or heavily compressed images produce less clean results. Portrait photographs with a person as the clear subject consistently produce the most recognisable and satisfying cartoon output.' },
        { q: 'Can I use the cartoon image for commercial purposes?', a: 'The cartoonised output is derived from your input image. If you own the rights to the input photo (e.g. you took the photo yourself), you own the output. If the input photo belongs to someone else, the output is a derivative work and may be subject to the original image\'s licence.' },
        { q: 'How is this different from an AI art generator?', a: 'This tool applies image processing filters (edge detection, colour quantisation, blur passes) to create cartoon-style output from your existing photo. It does not use generative AI or a neural network — it transforms your actual photo rather than generating a new image. The result retains the composition, face, and structure of your original photo.' },
        { q: 'Can I make a cartoon from a group photo?', a: 'Yes. Group photos work well with comic book and sketch styles. The outline effect applies to all faces and subjects in the photo. For very large group photos with many small faces, the detail in individual faces may be reduced — portrait-style shots with 1–4 people produce the clearest individual results.' },
      ]}
      relatedTools={[
        { name: 'Image Enhancer', href: '/tools/image-tools/image-enhancer', icon: '?', description: 'Improve photo quality before cartooning' },
        { name: 'Background Remover', href: '/tools/image-tools/background-remover', icon: '??', description: 'Remove background from cartoon' },
        { name: 'Grayscale Converter', href: '/tools/image-tools/grayscale-converter', icon: '?', description: 'Convert to black and white sketch style' },
        { name: 'Image Compressor', href: '/tools/image-tools/image-compressor', icon: '???', description: 'Compress before sharing' },
        { name: 'Image Resizer', href: '/tools/image-tools/image-resizer', icon: '??', description: 'Resize for avatar dimensions' },
        { name: 'Add Border', href: '/tools/image-tools/add-border', icon: '???', description: 'Add a comic book panel border' },
      ]}      {...(_s ? { aboutHTML: _s.aboutHTML, proTips: _s.proTips, ratingValue: _s.ratingValue, reviewCount: _s.reviewCount } : {})}
    >
      <CartoonClient />
    </ImageToolShell>
  )
}
