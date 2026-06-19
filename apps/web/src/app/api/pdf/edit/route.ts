export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { pdfGuard, pdfSizeGuard } from '../_lib/pdf-guards';

interface BaseAnn {
  id: string;
  page: number;
}
interface TextAnn extends BaseAnn {
  type: 'text';
  x: number;
  y: number;
  text: string;
  fontSize: number;
  color: string;
  bold: boolean;
  italic: boolean;
}
interface HighlightAnn extends BaseAnn {
  type: 'highlight';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}
interface DrawAnn extends BaseAnn {
  type: 'draw';
  points: number[];
  color: string;
  strokeWidth: number;
}
interface RectAnn extends BaseAnn {
  type: 'rect';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  filled: boolean;
}
type Annotation = TextAnn | HighlightAnn | DrawAnn | RectAnn;

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  if (h.length === 3) {
    const r = parseInt(h[0] + h[0], 16) / 255;
    const g = parseInt(h[1] + h[1], 16) / 255;
    const b = parseInt(h[2] + h[2], 16) / 255;
    return [r, g, b];
  }
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  return [r, g, b];
}

export async function POST(req: NextRequest) {
  const guard = pdfGuard(req);
  if (guard) return guard;
  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    const sizeGuard = pdfSizeGuard(file);
    if (sizeGuard) return sizeGuard;

    const buffer = Buffer.from(await file!.arrayBuffer());
    const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
    const pages = pdf.getPages();

    // Legacy single-text mode (backwards compat)
    const legacyText = form.get('text') as string | null;
    if (legacyText && !form.get('annotations')) {
      const pageNum = Math.max(1, parseInt((form.get('page') as string) || '1', 10));
      const xPos = parseFloat((form.get('x') as string) || '50');
      const yPos = parseFloat((form.get('y') as string) || '50');
      const fontSize = Math.min(
        72,
        Math.max(6, parseInt((form.get('fontSize') as string) || '12', 10))
      );
      if (legacyText.trim() && pages.length >= pageNum) {
        const page = pages[pageNum - 1];
        const { height } = page.getSize();
        const font = await pdf.embedFont(StandardFonts.Helvetica);
        page.drawText(legacyText, {
          x: xPos,
          y: height - yPos,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });
      }
      const out = await pdf.save({ useObjectStreams: true });
      return new NextResponse(new Uint8Array(out), {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="edited.pdf"',
        },
      });
    }

    // Rich annotation mode
    const annsRaw = form.get('annotations') as string | null;
    const scaleVal = parseFloat((form.get('scale') as string) || '1.4');
    const pageDimsRaw = form.get('pageDims') as string | null;
    const pageDims: { width: number; height: number }[] = pageDimsRaw
      ? JSON.parse(pageDimsRaw)
      : [];
    const annotations: Annotation[] = annsRaw ? JSON.parse(annsRaw) : [];

    const fontNormal = await pdf.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);
    const fontItalic = await pdf.embedFont(StandardFonts.HelveticaOblique);
    const fontBoldItalic = await pdf.embedFont(StandardFonts.HelveticaBoldOblique);

    for (const ann of annotations) {
      if (ann.id === 'preview') continue;
      const pageIdx = ann.page - 1;
      if (pageIdx < 0 || pageIdx >= pages.length) continue;
      const page = pages[pageIdx];
      const { width: pW, height: pH } = page.getSize();

      // Get original PDF page dimensions to compute scale ratio
      const origDim = pageDims[pageIdx];
      const ratioX = origDim ? pW / origDim.width : 1 / scaleVal;
      const ratioY = origDim ? pH / origDim.height : 1 / scaleVal;

      if (ann.type === 'text') {
        const a = ann as TextAnn;
        if (!a.text.trim()) continue;
        const [r, g, b] = hexToRgb(a.color || '#000000');
        const font =
          a.bold && a.italic
            ? fontBoldItalic
            : a.bold
              ? fontBold
              : a.italic
                ? fontItalic
                : fontNormal;
        // canvas coords: x from left, y from top
        // pdf-lib coords: x from left, y from bottom
        const pdfX = a.x * ratioX;
        const pdfY = pH - a.y * ratioY - a.fontSize * ratioY;
        page.drawText(a.text, {
          x: Math.max(0, pdfX),
          y: Math.max(0, pdfY),
          size: Math.max(4, a.fontSize * ratioY),
          font,
          color: rgb(r, g, b),
        });
      }

      if (ann.type === 'highlight') {
        const a = ann as HighlightAnn;
        const [r, g, b] = hexToRgb(a.color || '#f59e0b');
        const pdfX = a.x * ratioX;
        const pdfY = pH - (a.y + a.height) * ratioY;
        page.drawRectangle({
          x: pdfX,
          y: pdfY,
          width: a.width * ratioX,
          height: a.height * ratioY,
          color: rgb(r, g, b),
          opacity: 0.35,
        });
      }

      if (ann.type === 'rect') {
        const a = ann as RectAnn;
        const [r, g, b] = hexToRgb(a.color || '#ef4444');
        const pdfX = a.x * ratioX;
        const pdfY = pH - (a.y + a.height) * ratioY;
        page.drawRectangle({
          x: pdfX,
          y: pdfY,
          width: a.width * ratioX,
          height: a.height * ratioY,
          borderColor: rgb(r, g, b),
          borderWidth: 2,
          color: a.filled ? rgb(r, g, b) : undefined,
          opacity: a.filled ? 0.4 : undefined,
        });
      }

      if (ann.type === 'draw') {
        const a = ann as DrawAnn;
        const pts = a.points;
        if (pts.length < 4) continue;
        const [r, g, b] = hexToRgb(a.color || '#000000');
        // Draw as a series of line segments
        for (let i = 0; i < pts.length - 2; i += 2) {
          const x1 = pts[i] * ratioX;
          const y1 = pH - pts[i + 1] * ratioY;
          const x2 = pts[i + 2] * ratioX;
          const y2 = pH - pts[i + 3] * ratioY;
          page.drawLine({
            start: { x: x1, y: y1 },
            end: { x: x2, y: y2 },
            thickness: Math.max(0.5, a.strokeWidth * ratioY),
            color: rgb(r, g, b),
            opacity: 0.9,
          });
        }
      }
    }

    const out = await pdf.save({ useObjectStreams: true });
    const baseName = file!.name.replace(/\.pdf$/i, '');
    return new NextResponse(new Uint8Array(out), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${baseName}-edited.pdf"`,
      },
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || 'Edit failed' }, { status: 500 });
  }
}
