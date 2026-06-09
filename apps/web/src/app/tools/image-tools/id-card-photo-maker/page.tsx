import type { Metadata } from 'next'
import ImageToolShell from '@/components/image-tools/ImageToolShell'
import IdCardPhotoClient from './IdCardPhotoClient'
import { getImageToolSupplement } from '@/data/imageTools'

export const metadata: Metadata = {
  title: 'ID Card Photo Maker — Create ID Card Photos Free Online | Roughtools',
  description: 'Create ID card and badge photos online for free. Set custom dimensions, add name and title text, choose background colour. Download print-ready ID card layouts. Browser-based.',
  keywords: ['id card photo maker', 'id card maker online', 'id badge maker', 'employee id card', 'student id photo', 'id card creator free'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/image-tools/id-card-photo-maker' },
  openGraph: {
    title: 'ID Card Photo Maker — Free Online | Roughtools',
    description: 'Create ID card and badge photos. Custom size, name, title. Print-ready. Free.',
    url: 'https://roughtools.com/tools/image-tools/id-card-photo-maker',
    type: 'website', siteName: 'Roughtools',
  },
  twitter: { card: 'summary_large_image', title: 'ID Card Photo Maker | Roughtools', description: 'Create ID card and badge photos online free.' },
}


const _s = getImageToolSupplement('id-card-photo-maker')

export default function Page() {
  return (
    <ImageToolShell
      toolName="ID Card Photo Maker"
      toolSlug="id-card-photo-maker"
      icon="??"
      description="Create professional ID card and employee badge photos with custom dimensions, background colour, name text, and title. Upload a portrait photo, set the card dimensions and layout, add the person's name and job title, and download a print-ready ID card image. Useful for organisations, schools, events, and businesses that need quickly produced identity cards. All processing is browser-based."
      howToSteps={[
        { name: 'Upload a portrait photo', text: 'Upload a clear, front-facing portrait photo with a plain background. For best results, use a white or light grey background behind the subject.' },
        { name: 'Choose card dimensions', text: 'Select a standard ID card size (CR80, ISO 7810, or custom). The CR80 standard (85.6 × 54 mm) is the most common size — the same as a credit card.' },
        { name: 'Add name and title', text: 'Enter the person\'s name and job title or role. Choose font, size, and colour. The text is overlaid on the card layout below the photo.' },
        { name: 'Customise the design', text: 'Choose card background colour or gradient. Add a logo in the top corner. Select from layout presets (photo left, photo top, photo right) to match your organisation\'s style.' },
        { name: 'Download', text: 'Download the ID card as a high-resolution JPG at 300 DPI, ready to print on a standard card printer or photo printing service.' },
      ]}
      useCases={[
        { title: 'Employee and staff ID badges', description: 'Create employee ID badges for small businesses and organisations without needing dedicated ID card software. Upload each staff member\'s photo and download a consistent, professional badge design.' },
        { title: 'Event staff and volunteer badges', description: 'For conferences, events, and volunteer programs, quickly produce photo ID badges for all staff. Set a consistent template and process each person\'s photo through the same design.' },
        { title: 'Student ID cards', description: 'Schools, colleges, and training providers need consistent student ID cards. Use this tool to produce ID card images that can be printed on card stock or laminated sheets.' },
        { title: 'Temporary visitor passes', description: 'Produce quick visitor pass cards for site visits, meetings, and events where temporary identification is needed but full ID card printing infrastructure is not available.' },
        { title: 'Healthcare and security staff identification', description: 'Create identification card images for healthcare workers, security personnel, and contractors. Download at print-ready resolution for laminated card production.' },
      ]}
      specs={[
        { label: 'Standard sizes', value: 'CR80 (85.6×54 mm), ISO 7810, custom' },
        { label: 'Output DPI', value: '300 DPI (print-ready)' },
        { label: 'Layout options', value: 'Photo top, photo left, photo right presets' },
        { label: 'Text fields', value: 'Name, title, organisation, ID number' },
        { label: 'Logo upload', value: 'Yes — add organisation logo' },
        { label: 'Output format', value: 'JPG at 300 DPI' },
        { label: 'Server upload', value: 'Never — 100% browser-based' },
        { label: 'Cost', value: 'Free, no account needed' },
      ]}
      faqs={[
        { q: 'What is the standard ID card size?', a: 'The most common standard is CR80, measuring 85.6 × 54 mm (3.375 × 2.125 inches), which is the same physical size as a credit card. This fits standard card holders, lanyards, and most card printers. The tool includes CR80 as the default preset along with other common international ID card standards.' },
        { q: 'Can I add a barcode or QR code to the ID card?', a: 'Yes. The tool supports adding a QR code or barcode to the card. Enter the value you want to encode (employee ID, URL, or other data) and the tool generates and places the code on the card layout. This is useful for access control systems that read card barcodes.' },
        { q: 'What photo should I use for the ID card?', a: 'Use a clear, well-lit portrait photo with the person facing directly forward and a plain light background. The same principles as passport photo requirements apply: neutral expression, no glasses, eyes visible. The background removal tool can help if the original photo has a busy background.' },
        { q: 'Can I create multiple ID cards at once?', a: 'Currently the tool creates one card at a time. For bulk ID card production (multiple employees), process each photo individually with the same template settings, then collect the downloads. For large-scale ID card production, dedicated HR software or ID card systems are more appropriate.' },
        { q: 'What is the best way to print the ID card?', a: 'Download the card at 300 DPI and print on a photo printer using CR80-sized card stock (available from office supply stores), or send to a professional ID card printing service. Laminate after printing for durability. Most ID card printers accept standard CR80 blank PVC cards.' },
        { q: 'Can I add security features like holograms?', a: 'Digital security features cannot be added in a browser-based tool — physical holograms, microprinting, and UV-reactive inks require specialised printing equipment. For IDs that require security features, use a dedicated ID card printing service that provides physical security elements.' },
      ]}
      relatedTools={[
        { name: 'Passport Photo Maker', href: '/tools/image-tools/passport-photo-maker', icon: '??', description: 'Create passport and government ID photos' },
        { name: 'Background Remover', href: '/tools/image-tools/background-remover', icon: '??', description: 'Remove background for clean portrait' },
        { name: 'White Background Maker', href: '/tools/image-tools/white-background-maker', icon: '?', description: 'Add white background to portrait' },
        { name: 'Image Cropper', href: '/tools/image-tools/image-cropper', icon: '??', description: 'Crop portrait to correct framing' },
        { name: 'DPI Converter', href: '/tools/image-tools/dpi-converter', icon: '???', description: 'Set DPI for print-ready output' },
        { name: 'Image Resizer', href: '/tools/image-tools/image-resizer', icon: '??', description: 'Resize photo for ID dimensions' },
      ]}      {...(_s ? { aboutHTML: _s.aboutHTML, proTips: _s.proTips, ratingValue: _s.ratingValue, reviewCount: _s.reviewCount } : {})}
    >
      <IdCardPhotoClient />
    </ImageToolShell>
  )
}
