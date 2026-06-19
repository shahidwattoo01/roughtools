import type { Metadata } from 'next';
import PDFEditorClient from './PDFEditorClient';

export const metadata: Metadata = {
  title: 'PDF Editor — Add Text, Highlights, Shapes & Drawings | RoughTools',
  description:
    'Edit any PDF online for free. Add text, highlight content, draw freehand, insert rectangles and arrows. Works with any PDF — scanned, forms, presentations. No signup required.',
  alternates: { canonical: 'https://roughtools.com/tools/pdf/pdf-editor' },
};

export default function PDFEditorPage() {
  return <PDFEditorClient />;
}
