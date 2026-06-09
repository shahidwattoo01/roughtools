import type { Metadata } from 'next'
import ImageToolShell from '@/components/image-tools/ImageToolShell'
import MetadataViewerClient from './MetadataViewerClient'
import { getImageToolSupplement } from '@/data/imageTools'

export const metadata: Metadata = {
  title: 'Image Metadata Viewer — View EXIF Data and Image Info Free Online | Roughtools',
  description: 'View EXIF metadata, GPS location, camera settings, and image information online for free. Supports JPG, PNG, TIFF, HEIC. 100% browser-based — files never uploaded.',
  keywords: ['image metadata viewer', 'exif viewer', 'view image exif data', 'photo metadata', 'camera exif', 'gps exif location', 'image info viewer'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/image-tools/image-metadata-viewer' },
  openGraph: {
    title: 'Image Metadata Viewer — Free Online | Roughtools',
    description: 'View EXIF data, GPS, camera settings from images. Instant, private, free.',
    url: 'https://roughtools.com/tools/image-tools/image-metadata-viewer',
    type: 'website', siteName: 'Roughtools',
  },
  twitter: { card: 'summary_large_image', title: 'Image Metadata Viewer | Roughtools', description: 'View EXIF metadata and image info online free. Camera, GPS, settings.' },
}


const _s = getImageToolSupplement('image-metadata-viewer')

export default function Page() {
  return (
    <ImageToolShell
      toolName="Image Metadata Viewer"
      toolSlug="image-metadata-viewer"
      icon="??"
      description="View all metadata embedded in image files — EXIF data, GPS coordinates, camera make and model, lens information, shutter speed, aperture, ISO, date taken, copyright information, and more. Upload any JPG, PNG, TIFF, or HEIC file and all available metadata is extracted and displayed in a clean, readable table. Nothing leaves your browser — metadata is read entirely client-side."
      howToSteps={[
        { name: 'Upload your image', text: 'Click the upload area or drag and drop a JPG, PNG, TIFF, or HEIC image. The file is read locally — no upload to any server occurs.' },
        { name: 'View metadata', text: 'All available EXIF data is extracted and displayed immediately: image dimensions, file size, camera make and model, lens, aperture, shutter speed, ISO, focal length, date and time taken, GPS coordinates, and copyright fields.' },
        { name: 'Check GPS location', text: 'If the image includes GPS data, a map link is provided showing the exact coordinates where the photo was taken. This is useful for geotagging workflows and privacy review.' },
        { name: 'Export metadata', text: 'Copy the metadata as JSON for use in other tools, or download a text report of all metadata fields for reference.' },
      ]}
      useCases={[
        { title: 'Photography and camera settings review', description: 'Review the exact settings used to capture a photo — aperture, shutter speed, ISO, focal length. Understand what worked for a great shot so you can replicate it.' },
        { title: 'Privacy and GPS data check before sharing', description: 'Photos taken on smartphones often embed GPS coordinates showing exactly where the photo was taken. Check and strip GPS data before sharing photos publicly to protect your privacy and home location.' },
        { title: 'Verifying copyright and licensing information', description: 'Professional photographers embed copyright notices and contact information in EXIF data. Check the copyright field to identify the owner of an image before using it.' },
        { title: 'Authenticating photo date and origin', description: 'The date taken field is embedded at capture time and difficult to fake. Journalists, legal professionals, and researchers use EXIF data to verify the date and camera of origin for photographs.' },
        { title: 'Geotagging and location workflows', description: 'Travel photographers and real estate professionals use GPS EXIF data to organise photos by location. Review and export GPS coordinates for use in mapping and location-tagging workflows.' },
      ]}
      specs={[
        { label: 'Supported formats', value: 'JPG, JPEG, TIFF, HEIC, PNG (limited EXIF), WebP' },
        { label: 'Metadata types', value: 'EXIF, IPTC, XMP, GPS, ICC colour profile' },
        { label: 'Camera data', value: 'Make, model, lens, aperture, shutter, ISO, focal length' },
        { label: 'GPS data', value: 'Latitude, longitude, altitude, map link' },
        { label: 'Export options', value: 'Copy as JSON, download text report' },
        { label: 'Server upload', value: 'Never — 100% browser-based' },
        { label: 'Cost', value: 'Free, no account needed' },
      ]}
      faqs={[
        { q: 'What is EXIF data?', a: 'EXIF (Exchangeable Image File Format) is a standard for storing metadata inside image files. It was developed for digital cameras to record camera settings, date and time, and technical parameters alongside the image data. Modern smartphones extend EXIF with GPS location, device model, and software information. JPG files store the most complete EXIF data; PNG stores limited metadata.' },
        { q: 'Why does my image have no metadata?', a: 'Several things remove metadata: (1) social media platforms strip all EXIF on upload — images downloaded from Instagram, Facebook, or Twitter will have no camera EXIF; (2) some image editors save without preserving EXIF; (3) screenshot images have no camera EXIF; (4) PNG format stores less metadata than JPG. Images taken directly with a camera or smartphone and not processed by a social platform will have the most complete metadata.' },
        { q: 'Does my smartphone location show up in photos?', a: 'Yes, if location access is enabled for the camera app. iPhones and Android phones embed GPS coordinates in JPG photos by default when Location Services are on for the Camera. Before sharing photos publicly — especially on personal blogs, forums, or social media — check for and strip GPS data to avoid revealing your home or other private locations.' },
        { q: 'Can I remove metadata from an image?', a: 'This viewer tool reads metadata only and does not strip it. To remove EXIF data (including GPS) before sharing, use a dedicated metadata stripping tool, or export the image through the Image Compressor or Image Converter — these re-encode the file and typically strip most metadata in the process.' },
        { q: 'Does PNG have EXIF data?', a: 'PNG files can store some metadata in text chunks, but the EXIF standard was designed for JPG and TIFF. PNG typically stores image creation software and author information but not camera EXIF (aperture, shutter speed, GPS, etc.). For full EXIF data, JPG and TIFF are the right formats.' },
        { q: 'Can I trust the date taken in EXIF?', a: 'EXIF date data is set by the camera or device clock at capture time. It can be edited after the fact using EXIF editing tools, so it is not a cryptographically secure timestamp. However, for most practical verification purposes, EXIF date data is reliable — cameras do not typically alter it, and tampering is detectable if the other EXIF fields are inconsistent.' },
      ]}
      relatedTools={[
        { name: 'Image Size Checker', href: '/tools/image-tools/image-size-checker', icon: '??', description: 'Check image dimensions and file size' },
        { name: 'Image Compressor', href: '/tools/image-tools/image-compressor', icon: '???', description: 'Compress and strip metadata' },
        { name: 'DPI Converter', href: '/tools/image-tools/dpi-converter', icon: '???', description: 'Change image DPI for print' },
        { name: 'Image to Base64', href: '/tools/image-tools/image-to-base64', icon: '??', description: 'Encode image for embedding' },
        { name: 'Pixel Density Calculator', href: '/tools/image-tools/pixel-density-calculator', icon: '??', description: 'Calculate PPI from dimensions' },
        { name: 'Image Converter', href: '/tools/image-tools/image-converter', icon: '??', description: 'Convert format and strip EXIF' },
      ]}      {...(_s ? { aboutHTML: _s.aboutHTML, proTips: _s.proTips, ratingValue: _s.ratingValue, reviewCount: _s.reviewCount } : {})}
    >
      <MetadataViewerClient />
    </ImageToolShell>
  )
}
