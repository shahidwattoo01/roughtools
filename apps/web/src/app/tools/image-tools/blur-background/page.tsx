import type { Metadata } from 'next'
import ImageToolShell from '@/components/image-tools/ImageToolShell'
import BlurBackgroundClient from './BlurBackgroundClient'
import { getImageToolSupplement } from '@/data/imageTools'

export const metadata: Metadata = {
  title: 'Blur Background — Add Portrait Bokeh Effect to Photos Free Online | Roughtools',
  description: 'Blur the background of any photo online for free. Create a professional portrait bokeh effect. Adjust blur strength and subject mask. 100% browser-based, no upload.',
  keywords: ['blur background', 'blur image background', 'bokeh effect online', 'portrait blur', 'background blur tool', 'photo blur background free'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/image-tools/blur-background' },
  openGraph: {
    title: 'Blur Background — Free Online | Roughtools',
    description: 'Blur photo backgrounds for a professional portrait bokeh effect. Free, instant.',
    url: 'https://roughtools.com/tools/image-tools/blur-background',
    type: 'website', siteName: 'Roughtools',
  },
  twitter: { card: 'summary_large_image', title: 'Blur Background | Roughtools', description: 'Add portrait bokeh blur to photo backgrounds online free.' },
}


const _s = getImageToolSupplement('blur-background')

export default function Page() {
  return (
    <ImageToolShell
      toolName="Blur Background"
      toolSlug="blur-background"
      icon="???"
      description="Add a professional portrait-style background blur (bokeh effect) to any photo. The tool detects the foreground subject and applies Gaussian blur to the background, creating the shallow depth-of-field look typically achieved with a wide-aperture lens. Adjust blur strength for subtle to dramatic results. Runs entirely in your browser — your photos are never uploaded."
      howToSteps={[
        { name: 'Upload your photo', text: 'Click the upload area or drag and drop a JPG or PNG photo. Portrait shots and product photos on distinct backgrounds give the best results.' },
        { name: 'Subject is detected automatically', text: 'The tool identifies the foreground subject (person, object) and creates a mask separating it from the background. Review the mask overlay to check accuracy.' },
        { name: 'Adjust blur strength', text: 'Use the blur radius slider to set the intensity of the background blur. A radius of 10–15 creates a natural portrait look. Increase to 30+ for a dramatic out-of-focus effect.' },
        { name: 'Refine the mask (optional)', text: 'If the automatic subject detection misses areas, use the brush tool to add or erase from the mask. This is especially important around hair edges and complex outlines.' },
        { name: 'Download', text: 'Click Apply and download the result. The subject remains sharp while the background is blurred.' },
      ]}
      useCases={[
        { title: 'Portrait photography enhancement', description: 'Professional portrait photographers use wide apertures (f/1.4–f/2.8) to create background blur. Simulate this effect on photos taken with smartphones or kit lenses that do not have this optical capability.' },
        { title: 'LinkedIn and professional headshots', description: 'A blurred background draws attention to the face and creates a polished, professional look for profile photos. Apply background blur to any photo for a headshot-quality result.' },
        { title: 'Product photography focus effects', description: 'Blur the background behind a product to draw the eye to it and reduce distracting elements. Useful for e-commerce, social media product posts, and catalogue photography.' },
        { title: 'Video call and meeting backgrounds', description: 'Take a screenshot of your video call with a busy background and blur the background to see how it would look before enabling virtual background software.' },
        { title: 'Social media content creation', description: 'A blurred background makes subjects stand out in the feed. Apply the effect to lifestyle, food, and fashion photos before posting to Instagram or Pinterest.' },
      ]}
      specs={[
        { label: 'Input formats', value: 'JPG, PNG' },
        { label: 'Blur type', value: 'Gaussian blur (variable radius)' },
        { label: 'Subject detection', value: 'Automatic with manual mask refinement' },
        { label: 'Blur range', value: '1 to 50 radius' },
        { label: 'Max file size', value: '10 MB per image' },
        { label: 'Server upload', value: 'Never — 100% browser-based' },
        { label: 'Watermark', value: 'None' },
        { label: 'Cost', value: 'Free, no account needed' },
      ]}
      faqs={[
        { q: 'What is bokeh and how does background blur create it?', a: 'Bokeh (from Japanese, meaning blur or haze) is the aesthetic quality of the out-of-focus areas in a photo. It is naturally created by wide-aperture lenses (low f-number) that have a shallow depth of field — objects near the focus plane are sharp, while objects behind are blurred into smooth circles. Digital blur tools simulate this effect by blurring the background pixels while keeping the detected foreground subject sharp.' },
        { q: 'Will the blur look realistic?', a: 'The blur effect looks convincing for well-separated subjects against distinct backgrounds. The realism depends on the quality of the subject mask — clean edge detection around the subject produces natural-looking results. Very fine detail like flyaway hair or transparent fabric edges are the hardest to mask cleanly and may show artefacts. Real optical bokeh also has specific characteristics (circular highlights, lens aberrations) that digital blur approximates but does not perfectly replicate.' },
        { q: 'What blur radius gives the most natural portrait look?', a: 'A radius of 8–15 produces a natural, subtle portrait blur similar to what you would see from a moderate telephoto lens at f/2.8. Values above 25 produce a more dramatic effect similar to a very wide aperture. Values below 5 are barely noticeable. Start at 12 and adjust to taste.' },
        { q: 'Can I blur the background on a portrait where the hair has lots of fine strands?', a: 'Fine hair is the most challenging case for any background blur tool. The automatic detection handles most straight and wavy hair well. For very fine, curly, or flyaway hair, use the manual brush at a small size and reduced opacity to refine the hair edge in the mask. Accept that some degree of imperfection at the very edge of fine hair is inevitable without professional studio software.' },
        { q: 'Can I use this on a portrait already in front of a blurred background?', a: 'You can apply additional blur, but the automatic detection will have difficulty identifying the subject boundary if the background is already blurred. The edge between subject and background needs sufficient contrast for detection to work well.' },
        { q: 'How is this different from the Background Changer?', a: 'Blur Background keeps the same background but makes it blurry. Background Changer replaces the background with a completely different colour, gradient, or photo. For a portrait-style professional look while keeping the original setting, use Blur Background. For product photos on white or a different scene entirely, use Background Changer.' },
      ]}
      relatedTools={[
        { name: 'Background Remover', href: '/tools/image-tools/background-remover', icon: '??', description: 'Remove background completely' },
        { name: 'Background Changer', href: '/tools/image-tools/background-changer', icon: '??', description: 'Replace background with different scene' },
        { name: 'Image Enhancer', href: '/tools/image-tools/image-enhancer', icon: '?', description: 'Improve brightness and contrast' },
        { name: 'Image Compressor', href: '/tools/image-tools/image-compressor', icon: '???', description: 'Compress before sharing' },
        { name: 'Image Cropper', href: '/tools/image-tools/image-cropper', icon: '??', description: 'Crop to portrait composition' },
        { name: 'Image Resizer', href: '/tools/image-tools/image-resizer', icon: '??', description: 'Resize for LinkedIn or social media' },
      ]}      {...(_s ? { aboutHTML: _s.aboutHTML, proTips: _s.proTips, ratingValue: _s.ratingValue, reviewCount: _s.reviewCount } : {})}
    >
      <BlurBackgroundClient />
    </ImageToolShell>
  )
}
