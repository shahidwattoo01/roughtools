import type { Metadata } from 'next';
import ImageToolShell from '@/components/image-tools/ImageToolShell';
import PassportPhotoClient from './PassportPhotoClient';
import { getImageToolSupplement } from '@/data/imageTools';

export const metadata: Metadata = {
  title: 'Passport Photo Maker — Create Compliant Passport Photos Free Online | Roughtools',
  description:
    'Create passport and ID photos that meet official requirements for US, UK, EU, and 50+ countries. Crop, resize, and set the right DPI. Free, browser-based, no upload.',
  keywords: [
    'passport photo maker',
    'passport photo online',
    'id photo maker',
    'passport size photo',
    'visa photo',
    'passport photo free',
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/image-tools/passport-photo-maker' },
  openGraph: {
    title: 'Passport Photo Maker — Free Online | Roughtools',
    description: 'Create passport photos meeting official requirements. Free, no upload, instant.',
    url: 'https://roughtools.com/tools/image-tools/passport-photo-maker',
    type: 'website',
    siteName: 'Roughtools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Passport Photo Maker | Roughtools',
    description: 'Create compliant passport photos online. Free, no signup.',
  },
};

const _s = getImageToolSupplement('passport-photo-maker');

export default function Page() {
  return (
    <ImageToolShell
      toolName="Passport Photo Maker"
      toolSlug="passport-photo-maker"
      icon="??"
      description="Create passport-sized photos that meet official government requirements for passports, visas, driving licences, and ID cards. Choose from 50+ country-specific presets including US (2×2 inch), UK (35×45 mm), EU Schengen, and many others. Crop, position your face correctly, set the white background, and download a print-ready file. All processing is private and browser-based."
      howToSteps={[
        {
          name: 'Upload your photo',
          text: 'Upload a clear, recent photo of yourself against a plain background. Face forward, eyes open, neutral expression — the same requirements as at a professional photo studio.',
        },
        {
          name: 'Select your country or document type',
          text: 'Choose from 50+ country presets (US passport, UK passport, Schengen visa, Indian passport, etc.) and the tool automatically sets the correct dimensions, DPI, and background requirements.',
        },
        {
          name: 'Position and crop your face',
          text: 'Use the crop tool to position your face in the frame. The guide overlay shows the required face-to-frame ratio — your face should occupy 70–80% of the frame height in most country standards.',
        },
        {
          name: 'Set background',
          text: 'If your photo has a non-white background, use the background removal tool to replace it with the required plain white or off-white background.',
        },
        {
          name: 'Download',
          text: 'Download the finished photo at the correct pixel dimensions and DPI for printing. Print at a photo lab or at home on 4×6 inch photo paper to cut the correct number of photos.',
        },
      ]}
      useCases={[
        {
          title: 'Passport and visa applications',
          description:
            'Government passport applications require photos at precise dimensions (e.g. 2×2 inches in the US, 35×45 mm in the UK) with strict rules on head size, background colour, and expression. Get compliant photos without a trip to a photo studio.',
        },
        {
          title: 'Driving licence and national ID',
          description:
            'Most countries require standardised photos for government-issued identification documents. The presets cover the most common ID photo formats for licences, national IDs, and residence permits.',
        },
        {
          title: 'Online visa applications',
          description:
            'Many visa application portals require you to upload a digital photo at a specific file size and pixel dimension. This tool creates files that meet those digital submission requirements.',
        },
        {
          title: 'Employment and work permits',
          description:
            'Job applications, work permits, and professional licences often require recent photographs at specific formats. Create compliant photos for any of these documents.',
        },
        {
          title: 'Student ID and membership cards',
          description:
            'University ID cards, club memberships, and transport passes often require a specific photo size. Create a correctly sized photo quickly without visiting a photo shop.',
        },
      ]}
      specs={[
        {
          label: 'Country presets',
          value: '50+ countries including US, UK, EU, India, Canada, Australia',
        },
        { label: 'Output formats', value: 'JPG, PNG' },
        { label: 'DPI setting', value: 'Yes — 300 DPI print-ready output' },
        { label: 'Background options', value: 'White, off-white, light grey' },
        { label: 'Print layout', value: 'Multiple photos on 4×6 inch sheet' },
        { label: 'Server upload', value: 'Never — 100% browser-based' },
        { label: 'Watermark', value: 'None' },
        { label: 'Cost', value: 'Free, no account needed' },
      ]}
      faqs={[
        {
          q: 'Are the photos from this tool officially accepted for passport applications?',
          a: "The tool creates photos at the correct dimensions, DPI, and background colour specified by each country's official requirements. However, final acceptance depends on the quality of your source photo — correct face positioning, neutral expression, no glasses, and proper lighting. Blurry, overexposed, or poorly lit source photos may be rejected regardless of the technical specs. Use a well-lit photo against a plain wall for best results.",
        },
        {
          q: 'What size photo do I need for a US passport?',
          a: 'US passport photos must be 2×2 inches (51×51 mm) at 300 DPI, with the head between 1 and 1 3/8 inches (25–35 mm) from the bottom of the chin to the top of the head. The background must be plain white or off-white. Select the "US Passport" preset and the tool configures all these settings automatically.',
        },
        {
          q: 'What size photo do I need for a UK passport?',
          a: 'UK passport photos must be 35×45 mm, with the face taking up 29–34 mm of the height. The background must be light grey or cream. Select the "UK Passport" preset for the correct configuration.',
        },
        {
          q: 'Can I use this tool for a digital (online) visa application?',
          a: 'Yes. Many online visa applications require a digital JPEG at specific pixel dimensions and a maximum file size (often 500 KB). After creating the photo, use the Image Compressor tool to reduce the file size if needed while keeping the pixel dimensions intact.',
        },
        {
          q: 'My photo has a coloured background — how do I change it to white?',
          a: 'Upload your photo, then use the background removal step within the tool to automatically detect and replace the background with white. For complex backgrounds, use the manual brush tool to clean up any edges around the hair or collar.',
        },
        {
          q: 'How do I print the passport photos at home?',
          a: 'Download the print layout option which places multiple photos on a standard 4×6 inch sheet. Print on glossy photo paper at 300 DPI from any home printer or send the file to an online print service. Cut the individual photos out after printing.',
        },
      ]}
      relatedTools={[
        {
          name: 'Background Remover',
          href: '/tools/image-tools/background-remover',
          icon: '??',
          description: 'Remove and replace background',
        },
        {
          name: 'Image Resizer',
          href: '/tools/image-tools/image-resizer',
          icon: '??',
          description: 'Resize to exact pixel dimensions',
        },
        {
          name: 'Image Cropper',
          href: '/tools/image-tools/image-cropper',
          icon: '??',
          description: 'Crop to a specific area',
        },
        {
          name: 'DPI Converter',
          href: '/tools/image-tools/dpi-converter',
          icon: '???',
          description: 'Change DPI for print requirements',
        },
        {
          name: 'Image Compressor',
          href: '/tools/image-tools/image-compressor',
          icon: '???',
          description: 'Reduce file size for online submission',
        },
        {
          name: 'White Background Maker',
          href: '/tools/image-tools/white-background-maker',
          icon: '?',
          description: 'Add white background to photos',
        },
      ]}
      {...(_s ? { aboutHTML: _s.aboutHTML, proTips: _s.proTips } : {})}
    >
      <PassportPhotoClient />
    </ImageToolShell>
  );
}
