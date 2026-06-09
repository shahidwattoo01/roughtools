import type { Metadata } from 'next'
import ImageToolShell from '@/components/image-tools/ImageToolShell'
import MemeGeneratorClient from './MemeGeneratorClient'
import { getImageToolSupplement } from '@/data/imageTools'

export const metadata: Metadata = {
  title: 'Meme Generator — Create Memes with Custom Text Free Online | Roughtools',
  description: 'Create memes online for free. Upload any image or choose a template, add custom top and bottom text in Impact font, and download instantly. 100% browser-based, no signup.',
  keywords: ['meme generator', 'create meme online', 'meme maker', 'free meme generator', 'custom meme maker', 'add text to image meme'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/image-tools/meme-generator' },
  openGraph: {
    title: 'Meme Generator — Free Online | Roughtools',
    description: 'Create memes with custom text. Templates or upload your own. Free, instant.',
    url: 'https://roughtools.com/tools/image-tools/meme-generator',
    type: 'website', siteName: 'Roughtools',
  },
  twitter: { card: 'summary_large_image', title: 'Meme Generator | Roughtools', description: 'Create memes online free. Custom text, templates, instant download.' },
}


const _s = getImageToolSupplement('meme-generator')

export default function Page() {
  return (
    <ImageToolShell
      toolName="Meme Generator"
      toolSlug="meme-generator"
      icon="??"
      description="Create memes in seconds — use a popular template or upload your own image, add custom top and bottom text in the classic bold Impact font with white outline, adjust text size and position, and download or share instantly. No account needed, no watermarks, and everything stays in your browser. The fastest way to create and share a meme."
      howToSteps={[
        { name: 'Choose a template or upload an image', text: 'Browse popular meme templates (Drake, Distracted Boyfriend, This Is Fine, and many more), or click Upload to use any JPG or PNG image as your meme base.' },
        { name: 'Add top text', text: 'Type your top text in the first field. Classic meme style uses all capitals with the Impact font — the tool applies this automatically.' },
        { name: 'Add bottom text', text: 'Type your bottom text (the punchline) in the second field. Adjust font size if the text is too long to fit on one line.' },
        { name: 'Customise (optional)', text: 'Drag the text to reposition it. Change font size, text colour, or outline colour if you want a non-standard look.' },
        { name: 'Download and share', text: 'Click Download to save the meme as a JPG. Share it directly on social media, Discord, WhatsApp, or any messaging platform.' },
      ]}
      useCases={[
        { title: 'Social media and viral content', description: 'Memes drive massive organic engagement on Twitter, Instagram, LinkedIn, and Reddit. Create topical, brand-relevant, or purely funny memes for your social media strategy.' },
        { title: 'Internal team communication', description: 'Memes make Slack, Teams, and internal communication more fun. React to meeting outcomes, project milestones, or office situations with a quick custom meme.' },
        { title: 'Marketing and brand engagement', description: 'Brands that use memes in their marketing see higher engagement than standard promotional content. Create timely, relevant memes that connect your brand with cultural moments.' },
        { title: 'Educational content and presentations', description: 'A well-placed meme in a presentation or educational material reduces cognitive load and increases retention. Use the template library to find a format that fits your message.' },
        { title: 'Content creation and community building', description: 'Discord communities, subreddits, and niche online communities thrive on in-joke memes. Create content specific to your community with custom images and tailored text.' },
      ]}
      specs={[
        { label: 'Templates', value: '50+ popular meme templates included' },
        { label: 'Custom images', value: 'Yes — upload any JPG or PNG' },
        { label: 'Font', value: 'Impact (classic meme style), plus alternatives' },
        { label: 'Text positions', value: 'Top, bottom, or draggable anywhere' },
        { label: 'Output format', value: 'JPG' },
        { label: 'Watermark', value: 'None' },
        { label: 'Server upload', value: 'Never — 100% browser-based' },
        { label: 'Cost', value: 'Free, no account needed' },
      ]}
      faqs={[
        { q: 'Can I use my own image instead of a template?', a: 'Yes. Click Upload Image to use any JPG or PNG as your meme base. You can use a screenshot, a photo, or any image file from your device. The text editor works the same way on custom images as on templates.' },
        { q: 'Why is Impact font used for memes?', a: 'Impact font became the standard meme font because it is bold, condensed, and readable at a glance. Its tall letterforms and narrow spacing allow more text to fit on a single line. The white text with black outline (called a text stroke) ensures readability against any background colour. This combination was popularised by early internet image macros and became culturally embedded as the meme aesthetic.' },
        { q: 'Can I add more than two lines of text?', a: 'Yes. While the standard format has top and bottom text, you can add additional text boxes at any position on the image. Click "Add Text" to insert additional fields and drag them anywhere on the canvas.' },
        { q: 'How do I make the text fit if it is too long?', a: 'Reduce the font size using the size slider, or break the text into multiple lines by pressing Enter. The meme will display most naturally when each line is short and punchy — brevity is key to meme communication.' },
        { q: 'Can I share the meme directly from the tool?', a: 'Click Download to save the meme as a JPG, then share it on any platform. On mobile, you can use the Share button to send directly to social apps. Direct social media posting is not available — download first, then post.' },
        { q: 'Are the meme templates copyrighted?', a: 'Meme templates are derivative works based on source images. Most popular meme formats have been used so widely that their template use is considered fair use or cultural commentary in most jurisdictions. However, using copyrighted images commercially in advertising may require permission from the original rights holder. For non-commercial sharing and commentary, meme use is generally accepted.' },
      ]}
      relatedTools={[
        { name: 'Add Watermark', href: '/tools/image-tools/add-watermark', icon: '??', description: 'Add text or logo to any image' },
        { name: 'Image Compressor', href: '/tools/image-tools/image-compressor', icon: '???', description: 'Compress meme for faster sharing' },
        { name: 'Image Resizer', href: '/tools/image-tools/image-resizer', icon: '??', description: 'Resize for specific platform requirements' },
        { name: 'Thumbnail Maker', href: '/tools/image-tools/thumbnail-maker', icon: '??', description: 'Create YouTube thumbnails with text' },
        { name: 'Photo Collage Maker', href: '/tools/image-tools/photo-collage-maker', icon: '???', description: 'Combine multiple images' },
        { name: 'Image Enhancer', href: '/tools/image-tools/image-enhancer', icon: '?', description: 'Improve image before adding text' },
      ]}      {...(_s ? { aboutHTML: _s.aboutHTML, proTips: _s.proTips, ratingValue: _s.ratingValue, reviewCount: _s.reviewCount } : {})}
    >
      <MemeGeneratorClient />
    </ImageToolShell>
  )
}
