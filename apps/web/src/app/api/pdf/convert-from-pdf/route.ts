export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { pdfGuard, pdfSizeGuard } from '../_lib/pdf-guards';
import { extractPdfText } from '../_lib/extract-text';

/* ── PDF → Word (.docx) ─────────────────────────────────────────── */
async function toDocx(buffer: Buffer, baseName: string): Promise<NextResponse> {
  const { Document, Paragraph, TextRun, HeadingLevel, Packer } =
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('docx');

  const { text } = await extractPdfText(buffer);
  if (!text.trim())
    return NextResponse.json(
      { error: 'No selectable text found. This PDF may be image-based — use the OCR tool first.' },
      { status: 422 }
    );

  const children: unknown[] = [];
  for (const block of text.split(/\n{2,}/)) {
    for (const line of block
      .split('\n')
      .map((l: string) => l.trim())
      .filter(Boolean)) {
      const isHeading =
        /^TERM\s+\d+/i.test(line) ||
        (line.length < 90 && line === line.toUpperCase() && line.length > 4);
      children.push(
        isHeading
          ? new Paragraph({
              text: line,
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 240, after: 80 },
            })
          : new Paragraph({
              children: [new TextRun({ text: line, size: 22 })],
              spacing: { after: 80 },
            })
      );
    }
    children.push(new Paragraph({ text: '' }));
  }

  const doc = new Document({
    creator: 'RapidTools',
    title: baseName,
    sections: [{ properties: {}, children }],
  });
  const buf: Buffer = await Packer.toBuffer(doc);
  return new NextResponse(new Uint8Array(buf), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${baseName}.docx"`,
    },
  });
}

/* ── PDF → Excel (.xlsx) ─────────────────────────────────────────── */
async function toXlsx(buffer: Buffer, baseName: string): Promise<NextResponse> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const XLSX = require('xlsx');
  const { pages } = await extractPdfText(buffer);
  if (!pages.length || !pages.join('').trim())
    return NextResponse.json(
      { error: 'No selectable text found. This PDF may be image-based — use the OCR tool first.' },
      { status: 422 }
    );

  const wb = XLSX.utils.book_new();
  pages.forEach((pageText: string, i: number) => {
    const rows = pageText
      .split('\n')
      .map((l: string) => l.trim())
      .filter(Boolean)
      .map((l: string) => l.split(/\t|  {2,}/).map((c: string) => c.trim()));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rows), `Page ${i + 1}`);
  });

  const buf: Buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  return new NextResponse(new Uint8Array(buf), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${baseName}.xlsx"`,
    },
  });
}

/* ── PDF → HTML ──────────────────────────────────────────────────── */
async function toHtml(buffer: Buffer, baseName: string): Promise<NextResponse> {
  const { text } = await extractPdfText(buffer);
  const paras = (text || 'No text content found.')
    .split(/\n{2,}/)
    .map((p: string) => p.trim())
    .filter(Boolean)
    .map((p: string) => `  <p>${p.replace(/\n/g, '<br/>')}</p>`)
    .join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>${baseName}</title>
<style>body{font-family:Georgia,serif;max-width:820px;margin:40px auto;line-height:1.8;color:#222;padding:0 20px}p{margin:0 0 1.2em}</style>
</head><body>\n${paras}\n</body></html>`;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Disposition': `attachment; filename="${baseName}.html"`,
    },
  });
}

/* ── PDF → JPG / PNG ─────────────────────────────────────────────── */
async function toJpg(
  buffer: Buffer,
  baseName: string,
  dpi: number,
  fmt: 'jpg' | 'png'
): Promise<NextResponse> {
  // @napi-rs/canvas ships pre-built Linux x64 binaries — works on Vercel Lambda
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createCanvas } = require('@napi-rs/canvas') as {
    createCanvas: (
      w: number,
      h: number
    ) => {
      getContext: (t: string) => unknown;
      toBuffer: (mime: string, quality?: number) => Buffer;
      width: number;
      height: number;
    };
  };
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js') as {
    GlobalWorkerOptions: { workerSrc: string };
    getDocument: (o: unknown) => {
      promise: Promise<{
        numPages: number;
        getPage: (n: number) => Promise<{
          getViewport: (o: { scale: number }) => { width: number; height: number };
          render: (o: unknown) => { promise: Promise<void> };
        }>;
      }>;
    };
  };
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const JSZip = require('jszip');

  pdfjsLib.GlobalWorkerOptions.workerSrc = '';

  // pdfjs needs a CanvasFactory in Node.js — provide one using @napi-rs/canvas
  const NodeCanvasFactory = {
    create(width: number, height: number) {
      const canvas = createCanvas(width, height);
      return { canvas, context: canvas.getContext('2d') };
    },
    reset(cc: { canvas: { width: number; height: number } }, width: number, height: number) {
      cc.canvas.width = width;
      cc.canvas.height = height;
    },
    destroy(cc: { canvas: { width: number; height: number } }) {
      cc.canvas.width = 0;
      cc.canvas.height = 0;
    },
  };

  const pdf = await pdfjsLib.getDocument({
    data: new Uint8Array(buffer),
    useWorkerFetch: false,
    isEvalSupported: false,
    canvasFactory: NodeCanvasFactory,
  }).promise;

  const scale = dpi / 72;
  const zip = new JSZip();
  const ext = fmt;

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });
    const cc = NodeCanvasFactory.create(Math.round(viewport.width), Math.round(viewport.height));

    await page.render({ canvasContext: cc.context, viewport, canvasFactory: NodeCanvasFactory })
      .promise;

    // @napi-rs/canvas toBuffer: quality is 0-100 integer for JPEG
    const imgBuf =
      fmt === 'png'
        ? (cc.canvas as unknown as { toBuffer: (m: string) => Buffer }).toBuffer('image/png')
        : (cc.canvas as unknown as { toBuffer: (m: string, q: number) => Buffer }).toBuffer(
            'image/jpeg',
            92
          );

    zip.file(`${baseName}-page-${i}.${ext}`, imgBuf);
  }

  const zipBuf: Buffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  return new NextResponse(new Uint8Array(zipBuf), {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${baseName}-images.zip"`,
    },
  });
}

/* ── PDF → PPTX (one slide per page) ────────────────────────────── */
async function toPptx(buffer: Buffer, baseName: string): Promise<NextResponse> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const PptxGenJS = require('pptxgenjs');
  const { pages } = await extractPdfText(buffer);

  if (!pages.length || !pages.join('').trim())
    return NextResponse.json(
      { error: 'No selectable text found. This PDF may be image-based — use the OCR tool first.' },
      { status: 422 }
    );

  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE'; // 13.33 x 7.5 inches

  for (let i = 0; i < pages.length; i++) {
    const slide = pptx.addSlide();
    slide.background = { color: 'FFFFFF' };

    // Header bar
    slide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: '100%',
      h: 0.12,
      fill: { color: '2563EB' },
    });

    const pageText = pages[i] || '';
    const lines = pageText.split('\n').filter((l: string) => l.trim());
    let title = lines[0] || `Page ${i + 1}`;
    const body = lines.slice(1).join('\n');

    if (title.length > 80) {
      title = title.slice(0, 80) + '…';
    }

    slide.addText(title, {
      x: 0.4,
      y: 0.25,
      w: 12.5,
      h: 0.7,
      fontSize: 20,
      bold: true,
      color: '1E3A8A',
      fontFace: 'Calibri',
      wrap: true,
    });

    if (body.trim()) {
      slide.addText(body.slice(0, 2000), {
        x: 0.4,
        y: 1.1,
        w: 12.5,
        h: 5.8,
        fontSize: 11,
        color: '374151',
        fontFace: 'Calibri',
        wrap: true,
        valign: 'top',
      });
    }

    // Page number
    slide.addText(`${i + 1} / ${pages.length}`, {
      x: 12,
      y: 7.2,
      w: 1.3,
      h: 0.3,
      fontSize: 8,
      color: '9CA3AF',
      align: 'right',
    });
  }

  const buf: Buffer = await pptx.write({ outputType: 'nodebuffer' });
  return new NextResponse(new Uint8Array(buf), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'Content-Disposition': `attachment; filename="${baseName}.pptx"`,
    },
  });
}

/* ── Main handler ────────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  const guard = pdfGuard(req);
  if (guard) return guard;
  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    const format = ((form.get('format') as string) || 'txt').toLowerCase();
    const dpi = parseInt((form.get('dpi') as string) || '150', 10);
    const sizeGuard = pdfSizeGuard(file);
    if (sizeGuard) return sizeGuard;

    const buffer = Buffer.from(await file.arrayBuffer());
    const baseName = file.name.replace(/\.pdf$/i, '');

    if (format === 'docx') return toDocx(buffer, baseName);
    if (format === 'xlsx') return toXlsx(buffer, baseName);
    if (format === 'html') return toHtml(buffer, baseName);
    if (format === 'jpg' || format === 'png') return toJpg(buffer, baseName, dpi, format);
    if (format === 'pptx') return toPptx(buffer, baseName);

    // Plain text fallback
    const { text } = await extractPdfText(buffer);
    return new NextResponse(text || 'No text content found.', {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="${baseName}.txt"`,
      },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Conversion failed' },
      { status: 500 }
    );
  }
}
