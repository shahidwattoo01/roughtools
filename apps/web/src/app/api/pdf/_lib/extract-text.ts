/**
 * PDF text extraction using pdfjs-dist v3 (legacy CJS build — works in Next.js API routes).
 * pdfjs-dist v3 legacy/build/pdf.js is CommonJS and does not require a worker in Node.js.
 */

export interface PdfTextResult {
  text: string      // full concatenated text
  pages: string[]   // one string per page
  numPages: number
}

export async function extractPdfText(buffer: Buffer): Promise<PdfTextResult> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js')

  // Disable the web worker — not needed in Node.js
  pdfjsLib.GlobalWorkerOptions.workerSrc = ''

  const data = new Uint8Array(buffer)
  const loadingTask = pdfjsLib.getDocument({
    data,
    useWorkerFetch: false,
    isEvalSupported: false,
    useSystemFonts: true,
    disableFontFace: true,
  })

  const pdf = await loadingTask.promise
  const numPages: number = pdf.numPages
  const pages: string[] = []

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    let lastY = -1
    let pageText = ''
    for (const item of content.items as Array<{ str: string; transform: number[] }>) {
      const y = item.transform[5]
      if (lastY !== -1 && Math.abs(y - lastY) > 2) {
        pageText += '\n'
      }
      pageText += item.str
      lastY = y
    }
    pages.push(pageText.trim())
  }

  return { text: pages.join('\n\n'), pages, numPages }
}
