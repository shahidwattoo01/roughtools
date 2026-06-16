/**
 * PDF text extraction using unpdf.
 * Previously used pdfjs-dist directly, which fails in Vercel's serverless
 * environment ("Setting up fake worker failed") and depends on an optional
 * `canvas` native binary that can't compile there. unpdf bundles a PDF.js
 * build specifically packaged for serverless/edge runtimes with no worker
 * or canvas requirement.
 */

import { getDocumentProxy, extractText } from 'unpdf'

export interface PdfTextResult {
  text: string      // full concatenated text
  pages: string[]   // one string per page
  numPages: number
}

export async function extractPdfText(buffer: Buffer): Promise<PdfTextResult> {
  const data = new Uint8Array(buffer)
  const pdf = await getDocumentProxy(data)
  const { totalPages, text: pages } = await extractText(pdf, { mergePages: false })

  return { text: pages.join('\n\n'), pages, numPages: totalPages }
}
