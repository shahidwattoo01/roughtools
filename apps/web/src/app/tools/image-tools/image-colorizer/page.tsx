import type { Metadata } from 'next'
import ImageToolShell from '@/components/image-tools/ImageToolShell'
import ImageColorizerClient from './ImageColorizerClient'
import { getImageToolSupplement } from '@/data/imageTools'

export const metadata: Metadata = {
  title: 'Image Colorizer — Colorize Black and White Photos Free Online | Roughtools',
  description: 'Colorize black and white photos online for free. Add realistic colours to old monochrome photographs. Browser-based AI colorization — files never uploaded to any server.',
  keywords: ['image colorizer', 'colorize black and white photo', 'colorize old photos', 'photo colorizer free', 'black and white to color', 'photo colorization'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/image-tools/image-colorizer' },
  openGraph: {
    title: 'Image Colorizer — Free Online | Roughtools',
    description: 'Colorize black and white photos with realistic colours. Free, browser-based.',
    url: 'https://roughtools.com/tools/image-tools/image-colorizer',
    type: 'website', siteName: 'Roughtools',
  },
  twitter: { card: 'summary_large_image', title: 'Image Colorizer | Roughtools', description: 'Colorize black and white photos online free.' },
}


const _s = getImageToolSupplement('image-colorizer')

export default function Page() {
  return (
    <ImageToolShell
      toolName="Image Colorizer"
      toolSlug="image-colorizer"
      icon="??"
      description="Add realistic colour to black and white photographs using intelligent colorization. Upload a monochrome photo and the tool analyses the content to apply natural-looking colours — skin tones, sky, vegetation, clothing, and objects are all coloured according to contextual inference. Perfect for restoring old family photos, historical images, and vintage photography."
      howToSteps={[
        { name: 'Upload your black and white photo', text: 'Click the upload area or drag and drop a greyscale or black and white JPG or PNG. The tool also works on desaturated colour photos.' },
        { name: 'Adjust colorization intensity', text: 'Use the intensity slider to control how strong the colourisation is. Lower values give a more subtle, film-like tint. Higher values produce richer, more saturated output.' },
        { name: 'Colorize', text: 'Click the Colorize button. The algorithm analyses the image content and applies colours region by region based on context and learned colour patterns.' },
        { name: 'Compare before and after', text: 'Use the before/after slider to compare the original black and white version with the colourised result. Evaluate whether the colours look natural.' },
        { name: 'Download', text: 'Download the colourised image as JPG or PNG. For further colour correction, use the Image Enhancer tool.' },
      ]}
      useCases={[
        { title: 'Restoring old family photos', description: 'Give new life to faded black and white family photographs from the 20th century. Colourised photos feel more immediate and personal, making them more engaging to younger generations.' },
        { title: 'Historical and documentary photography', description: 'Colourising historical photographs from events, places, and periods makes them more visually accessible and helps audiences connect with history in a more vivid way.' },
        { title: 'Social media content and storytelling', description: 'Colourised vintage photos make compelling social media content. Before/after reveals drive engagement on platforms like Instagram and Facebook.' },
        { title: 'Publishing and editorial projects', description: 'Books, magazines, and documentary projects use colourised historical images to create visual variety and reader interest alongside contemporary photography.' },
        { title: 'Artistic and creative projects', description: 'Apply colourisation as a creative technique to achieve a stylised, vintage aesthetic for album covers, posters, and art prints using old or deliberately black and white source photos.' },
      ]}
      specs={[
        { label: 'Input formats', value: 'JPG, PNG (greyscale or colour)' },
        { label: 'Colorization method', value: 'Context-aware colour inference' },
        { label: 'Intensity control', value: 'Yes — adjustable colour strength' },
        { label: 'Before/after comparison', value: 'Yes — drag slider' },
        { label: 'Max file size', value: '10 MB per image' },
        { label: 'Server upload', value: 'Never — 100% browser-based' },
        { label: 'Watermark', value: 'None' },
        { label: 'Cost', value: 'Free, no account needed' },
      ]}
      faqs={[
        { q: 'How accurate is automatic colorization?', a: 'The accuracy depends on the image content and quality. Automatic colorization uses learned patterns to infer likely colours — faces, sky, grass, and common objects are usually coloured well. Less common subjects, unusual lighting, and complex scenes may produce less accurate results. The output is always an artistic interpretation, not a reconstruction of the original colours.' },
        { q: 'Can I manually adjust specific colours?', a: 'The automatic colorization gives you a starting point. For manual colour adjustments after colorization, use the Image Enhancer tool to adjust hue and saturation of the overall image, or use dedicated photo editing software like GIMP or Photoshop for selective colour correction.' },
        { q: 'Does the image need to be completely black and white?', a: 'No. The tool works on any low-saturation image. If you have a faded colour photo that has lost most of its colour over time, the tool can boost and restore the colours. Fully saturated colour photos are not appropriate for this tool.' },
        { q: 'Will skin tones look natural?', a: 'Skin tones are one of the most reliably colourised elements because they follow predictable patterns that the algorithm learns well. Results for portrait shots with clear face detail are usually convincing. Very old, damaged, or heavily spotted photos may produce less natural results.' },
        { q: 'Can I use the colourised image commercially?', a: 'The colourised output is yours to use. If the original black and white photo is in the public domain (typically pre-1928 for US works, or works with expired copyright), the colourised version is free to use commercially. For copyrighted original photographs, colourisation is a derivative work — check the licence of the original image.' },
        { q: 'What is the difference between colorizing and the Grayscale Converter?', a: 'Grayscale Converter turns a colour image into black and white by removing all colour data. Image Colorizer does the opposite — it adds colour to a black and white image. They are complementary tools that work in opposite directions.' },
      ]}
      relatedTools={[
        { name: 'Grayscale Converter', href: '/tools/image-tools/grayscale-converter', icon: '?', description: 'Convert colour photos to black and white' },
        { name: 'Image Enhancer', href: '/tools/image-tools/image-enhancer', icon: '?', description: 'Adjust brightness, contrast, saturation' },
        { name: 'Image Compressor', href: '/tools/image-tools/image-compressor', icon: '???', description: 'Compress colorized image' },
        { name: 'Image Resizer', href: '/tools/image-tools/image-resizer', icon: '??', description: 'Resize after colorizing' },
        { name: 'Image Cropper', href: '/tools/image-tools/image-cropper', icon: '??', description: 'Crop to the best composition' },
        { name: 'Add Border', href: '/tools/image-tools/add-border', icon: '???', description: 'Add a vintage border for an old photo look' },
      ]}      {...(_s ? { aboutHTML: _s.aboutHTML, proTips: _s.proTips, ratingValue: _s.ratingValue, reviewCount: _s.reviewCount } : {})}
    >
      <ImageColorizerClient />
    </ImageToolShell>
  )
}
