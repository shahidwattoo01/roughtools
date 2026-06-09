export interface HowToStep { title: string; description: string }
export interface FAQ { question: string; answer: string }

export interface PDFToolData {
  slug: string
  name: string
  tagline: string
  metaTitle: string
  metaDescription: string
  canonicalUrl: string
  ratingValue: string
  reviewCount: string
  howToSteps: HowToStep[]
  aboutHTML: string
  faqs: FAQ[]
  relatedToolSlugs: string[]
}

const BASE = 'https://roughtools.com'

export const pdfTools: PDFToolData[] = [
  // ─────────────────────────────────────────────────────────────
  // 1. SPLIT PDF
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'split-pdf',
    name: 'Split PDF',
    tagline: 'Divide any PDF into separate files by page range, fixed intervals, or individual pages.',
    metaTitle: 'Split PDF Free Online — Divide Pages Instantly',
    metaDescription: 'Split a PDF into multiple files by page range or extract every page separately. Free, no signup, files deleted in 1 hour.',
    canonicalUrl: `${BASE}/tools/pdf/split-pdf`,
    ratingValue: '4.8',
    reviewCount: '3124',
    howToSteps: [
      { title: 'Upload your PDF', description: 'Click the upload area or drag and drop your PDF file. Files up to 50 MB are supported.' },
      { title: 'Enter split points', description: 'Type the page numbers where you want the splits to occur (e.g. 3, 7, 12). Leave blank to extract every page as its own file.' },
      { title: 'Download the ZIP', description: 'Click Split PDF and download the ZIP archive containing all your new individual PDF files.' },
    ],
    aboutHTML: `<p>The <strong>Split PDF</strong> tool lets you break a large PDF document into smaller, more manageable files without installing any software. Whether you need to extract a single chapter from a report, separate invoices from a batch file, or divide a scanned book into individual pages, our split PDF tool handles it in seconds.</p>

<p>When you split a PDF, the tool reads the page structure of your document and creates new PDF files at the split points you specify. For example, entering <em>3, 7</em> produces three output files: pages 1–3, pages 4–7, and pages 8 to the end. If you leave the field blank, every page becomes its own standalone PDF — useful when you have scanned receipts or forms that need to be filed individually.</p>

<p>All split files are packaged into a single ZIP archive for convenient downloading. The original document quality is fully preserved; no recompression or re-rendering takes place, so text remains sharp and images stay at their original resolution.</p>

<p><strong>Common use cases for splitting PDFs:</strong></p>
<ul>
  <li>Extracting specific chapters or sections from a lengthy report</li>
  <li>Separating multi-page scanned invoices into individual documents</li>
  <li>Dividing a combined contract into separate signature pages</li>
  <li>Breaking a presentation into individual slide PDFs for sharing</li>
</ul>

<p>If you only need a few specific pages rather than a clean split, try our <a href="/tools/pdf/extract-pdf-pages">Extract PDF Pages</a> tool instead. After splitting, if you decide you want to recombine certain parts, <a href="/tools/pdf/merge-pdf">Merge PDF</a> makes it easy to join files back together.</p>

<p><strong>Privacy and security:</strong> Your uploaded file is transferred over HTTPS and processed entirely on our secure servers. We never read the content of your documents. All files — both the original upload and the generated outputs — are permanently deleted from our servers within one hour of processing. No account or login is required.</p>

<p>The Split PDF tool works in all modern browsers on desktop, tablet, and mobile. There is no app to install and no browser extension needed.</p>`,
    faqs: [
      { question: 'How do I split a PDF into individual pages?', answer: 'Upload your PDF and leave the split-at field blank. The tool will extract every page as its own PDF file and package them into a ZIP download.' },
      { question: 'Can I split at more than one point?', answer: 'Yes. Enter multiple page numbers separated by commas (e.g. 2, 5, 9) to create multiple output files in a single operation.' },
      { question: 'Is there a file size limit?', answer: 'Free users can split PDFs up to 50 MB. Most standard documents are well under this limit.' },
      { question: 'Will the split PDFs have the same quality as the original?', answer: 'Yes. Splitting does not re-encode or recompress the content. Text, images, and formatting are identical to the original.' },
      { question: 'Is this tool free to use?', answer: 'Completely free. No subscription, no hidden fees, no daily limit, and no watermark on the output files.' },
      { question: 'Are my files secure?', answer: 'All uploads use HTTPS encryption. Your files are processed on isolated servers and automatically deleted within one hour. We never view or share your content.' },
      { question: 'Can I use Split PDF on my phone?', answer: 'Yes. The tool is fully responsive and works in mobile browsers on iOS and Android without any app.' },
      { question: 'What browsers are supported?', answer: 'Chrome, Firefox, Safari, and Edge are all fully supported, including their latest mobile versions.' },
      { question: 'What format will the output files be in?', answer: 'Each output file is a standard PDF. All split files are bundled in a ZIP archive for a single download.' },
      { question: 'How long does splitting take?', answer: 'Most splits complete in under 10 seconds. Larger files or many split points may take up to 30 seconds.' },
      { question: 'Do I need to create an account?', answer: 'No account is required. Go to the tool, upload your file, and download your results immediately.' },
      { question: 'What if I only want a few pages, not a split?', answer: 'Use the Extract PDF Pages tool to pull out specific pages by number without splitting the rest of the document.' },
    ],
    relatedToolSlugs: ['merge-pdf', 'extract-pdf-pages', 'remove-pdf-pages', 'organize-pdf', 'compress-pdf'],
  },

  // ─────────────────────────────────────────────────────────────
  // 2. MERGE PDF
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'merge-pdf',
    name: 'Merge PDF',
    tagline: 'Combine multiple PDF files into one perfectly ordered document in seconds.',
    metaTitle: 'Merge PDF Free Online — Combine PDFs Instantly',
    metaDescription: 'Merge multiple PDF files into one document. Upload, arrange, and combine — free, no signup, no watermark, files deleted after 1 hour.',
    canonicalUrl: `${BASE}/tools/pdf/merge-pdf`,
    ratingValue: '4.9',
    reviewCount: '3512',
    howToSteps: [
      { title: 'Select all your PDFs', description: 'Click the upload area and select multiple PDF files at once, or upload them one by one. Up to 20 files supported.' },
      { title: 'Arrange the order', description: 'Files are merged in the order they appear. Select your files in the order you want them combined.' },
      { title: 'Download the merged PDF', description: 'Click Merge PDFs. Your combined document downloads as a single PDF file within seconds.' },
    ],
    aboutHTML: `<p>The <strong>Merge PDF</strong> tool combines multiple separate PDF files into one unified document. Whether you are assembling a report from several chapters, collecting signed contract pages, or joining monthly invoices into a single archive, merging PDFs saves time and keeps your documents organised.</p>

<p>To merge PDFs, simply select or drag in all the files you want to combine. They are joined in the order you upload them, so select them in the sequence you want the final document to follow. The tool preserves every page at its original quality — fonts, images, embedded links, and bookmarks all carry through to the merged output.</p>

<p>There is no page count limit on the input files; you can combine a 200-page report with a 3-page cover letter without issue. The total combined file size must be within the 50 MB limit per upload session.</p>

<p><strong>When to use Merge PDF:</strong></p>
<ul>
  <li>Assembling multi-chapter academic papers or technical manuals</li>
  <li>Combining bank statements into a single annual archive</li>
  <li>Joining a cover letter, CV, and portfolio into one application PDF</li>
  <li>Collecting signed documents from multiple signatories</li>
</ul>

<p>If some of your source files are password-protected, you will need to remove the password first using our <a href="/tools/pdf/unlock-pdf">Unlock PDF</a> tool before merging. Once merged, if the resulting file is larger than you need, run it through our <a href="/tools/pdf/compress-pdf">Compress PDF</a> tool to reduce its size before emailing.</p>

<p><strong>Security and privacy:</strong> Every upload travels over TLS-encrypted HTTPS. Files are processed in memory on our servers and wiped completely within one hour. No employee ever accesses your documents. Merging works in all modern browsers with no plugin required.</p>`,
    faqs: [
      { question: 'How many PDFs can I merge at once?', answer: 'You can merge up to 20 PDF files in a single session. Select all files at once or add them one by one.' },
      { question: 'Does the order of my files matter?', answer: 'Yes. The tool merges files in the order you select them. Choose your files in the sequence you want them to appear in the final document.' },
      { question: 'Is there a page count limit?', answer: 'There is no page count restriction. You can merge documents with hundreds of pages as long as the total upload size is under 50 MB.' },
      { question: 'Will hyperlinks and bookmarks be preserved?', answer: 'Yes. Internal links, hyperlinks to external URLs, and bookmarks present in the source files are preserved in the merged output.' },
      { question: 'Can I merge password-protected PDFs?', answer: 'No. You must remove the password using the Unlock PDF tool first, then merge the unlocked files.' },
      { question: 'Is this tool free?', answer: 'Completely free with no usage limits, no required account, and no watermarks added to your merged PDF.' },
      { question: 'How are my files kept secure?', answer: 'Uploads are encrypted with HTTPS. All files are automatically deleted from our servers within one hour after processing.' },
      { question: 'Can I merge on a mobile device?', answer: 'Yes. The merge tool is mobile-responsive and works in Safari on iOS and Chrome on Android without any app download.' },
      { question: 'What if the merged PDF is too large to email?', answer: 'Run the merged file through our Compress PDF tool to reduce its size while keeping visual quality acceptable for email.' },
      { question: 'What format is the output?', answer: 'The output is a standard PDF/1.7 compatible file that opens in Adobe Acrobat, Preview, and all modern PDF readers.' },
      { question: 'Do I need to install anything?', answer: 'No installation needed. The tool runs entirely in your browser through a web interface.' },
    ],
    relatedToolSlugs: ['split-pdf', 'compress-pdf', 'unlock-pdf', 'organize-pdf', 'extract-pdf-pages'],
  },

  // ─────────────────────────────────────────────────────────────
  // 3. COMPRESS PDF
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'compress-pdf',
    name: 'Compress PDF',
    tagline: 'Reduce PDF file size by up to 80% while keeping your document readable and sharp.',
    metaTitle: 'Compress PDF Free Online — Reduce File Size Fast',
    metaDescription: 'Compress a PDF to a smaller file size for email or upload. Choose Low, Medium, or High quality. Free, no signup, no watermark.',
    canonicalUrl: `${BASE}/tools/pdf/compress-pdf`,
    ratingValue: '4.8',
    reviewCount: '2987',
    howToSteps: [
      { title: 'Upload your PDF', description: 'Drop your PDF into the upload area or click to browse. Files up to 50 MB are accepted.' },
      { title: 'Choose compression level', description: 'Select Low (smallest file, some quality loss), Medium (balanced — recommended), or High (best quality, less reduction).' },
      { title: 'Download the compressed file', description: 'Click Compress PDF and download your reduced-size file. The size savings are shown before you download.' },
    ],
    aboutHTML: `<p>Large PDF files cause headaches — email servers reject attachments over 10 MB, cloud storage fills up quickly, and slow file transfers waste time. The <strong>Compress PDF</strong> tool tackles this by reducing your PDF's file size significantly without requiring any desktop software.</p>

<p>PDF compression works by identifying and removing redundant data within the file. The primary technique is image downsampling: most PDFs contain embedded images saved at higher resolutions than a screen or printer needs. Our compressor resamples these images to an appropriate DPI, discards embedded ICC colour profiles that are rarely needed, and removes metadata artefacts. For text-heavy PDFs with few images, compression ratios are lower (10–30%), while image-heavy documents like scanned reports can shrink by 60–80%.</p>

<p><strong>Compression levels explained:</strong></p>
<ul>
  <li><strong>Low quality:</strong> Maximum file size reduction. Suitable for archiving or sharing previews where pixel-perfect sharpness is not required.</li>
  <li><strong>Medium quality (recommended):</strong> Balanced reduction typically achieving 40–65% size savings. Images remain sharp at normal viewing distances and on screen.</li>
  <li><strong>High quality:</strong> Conservative compression with minimal visual change. Best for print-ready files where image fidelity matters.</li>
</ul>

<p>Unlike some tools that flatten all layers and strip interactive elements, our compressor retains hyperlinks, form fields, and annotations wherever possible. If you need to reduce size further after compression, consider also running the file through <a href="/tools/pdf/remove-pdf-pages">Remove PDF Pages</a> to delete any blank or unnecessary pages, then re-compress.</p>

<p>After compression you may also want to <a href="/tools/pdf/protect-pdf">password-protect your PDF</a> before sending it to a recipient, especially for confidential documents.</p>

<p><strong>Privacy:</strong> Your PDF is uploaded over an encrypted HTTPS connection, processed on our servers, and deleted automatically within 60 minutes. We process the file programmatically — no human ever reads your content. Compression is 100% free with no account needed.</p>`,
    faqs: [
      { question: 'How much will my PDF be compressed?', answer: 'Results depend on content. Image-heavy PDFs typically shrink 40–80%. Text-only PDFs compress 10–30%. You see the actual savings before downloading.' },
      { question: 'Will compression reduce the visual quality?', answer: 'At the Medium setting (recommended), quality loss is minimal and unnoticeable on screen. The Low setting produces the smallest file but with visible image degradation at high zoom. High setting keeps quality nearly identical to the original.' },
      { question: 'Can I compress a scanned PDF?', answer: 'Yes. Scanned PDFs consist entirely of images, so compression can achieve very significant size reductions, often 50–70%.' },
      { question: 'Is the tool completely free?', answer: 'Yes — no cost, no account required, no watermarks, and no daily usage limits.' },
      { question: 'What is the maximum file size I can compress?', answer: 'Up to 50 MB per file. If your PDF is larger, consider splitting it first, compressing each part, then merging the results.' },
      { question: 'Are my files private?', answer: 'Your file is transferred over HTTPS and processed on isolated servers. It is automatically deleted within one hour. We never read or share your documents.' },
      { question: 'Does compression remove form fields or signatures?', answer: 'No. Our compressor targets image data and redundant metadata. Form fields, digital signatures, and hyperlinks are preserved.' },
      { question: 'Can I compress on mobile?', answer: 'Yes. The tool works in mobile browsers on iPhone and Android. No app download is required.' },
      { question: 'What browsers are supported?', answer: 'Chrome, Firefox, Safari, and Edge on both desktop and mobile are fully supported.' },
      { question: 'How long does compression take?', answer: 'Typically 5–20 seconds depending on file size and content density.' },
      { question: 'Why is my compressed PDF larger than expected?', answer: 'If your PDF was already compressed or consists mainly of text, there is little redundant data to remove. Try the Low setting for maximum reduction in these cases.' },
    ],
    relatedToolSlugs: ['merge-pdf', 'split-pdf', 'remove-pdf-pages', 'protect-pdf', 'pdf-to-jpg'],
  },

  // ─────────────────────────────────────────────────────────────
  // 4. PDF TO WORD
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'pdf-to-word',
    name: 'PDF to Word',
    tagline: 'Convert any PDF to an editable Word document while preserving layout, tables, and formatting.',
    metaTitle: 'PDF to Word Free Online — Convert PDF to DOCX',
    metaDescription: 'Convert PDF to editable Word (.docx) online free. Keeps formatting, tables, and fonts. No signup, no watermark, secure conversion.',
    canonicalUrl: `${BASE}/tools/pdf/pdf-to-word`,
    ratingValue: '4.7',
    reviewCount: '2843',
    howToSteps: [
      { title: 'Upload your PDF', description: 'Drag and drop your PDF or click to browse. Password-protected files must be unlocked first.' },
      { title: 'Start the conversion', description: 'Click Convert to Word. Our engine analyses the document structure — text layers, columns, tables, and images.' },
      { title: 'Download your DOCX', description: 'Download the editable Word file. Open it in Microsoft Word, Google Docs, or LibreOffice to make changes.' },
    ],
    aboutHTML: `<p>When you receive a PDF form, report, or contract that needs editing, the <strong>PDF to Word</strong> converter saves you from retyping the entire document. It analyses the internal structure of your PDF and recreates it as a fully editable .docx file compatible with Microsoft Word 2010 and later, Google Docs, and LibreOffice.</p>

<p>The conversion engine extracts text layer data from the PDF, then maps it to Word paragraph styles. Multi-column layouts are reconstructed using text boxes or column formatting, tables are rebuilt with proper cell structure, and embedded images are extracted and reinserted at their original positions and sizes. Heading levels detected in the original are mapped to Word's heading styles, making it easy to navigate the converted document using the navigation pane.</p>

<p><strong>What converts well:</strong></p>
<ul>
  <li>Text-based PDFs created from Word, InDesign, or other desktop publishing tools</li>
  <li>Simple single-column reports and letters</li>
  <li>Tables with clear cell borders and data</li>
  <li>PDFs exported from Google Docs or LibreOffice</li>
</ul>

<p><strong>What may need manual cleanup:</strong></p>
<ul>
  <li>Complex multi-column magazine-style layouts</li>
  <li>PDFs that are actually scanned images (use <a href="/tools/pdf/ocr-pdf">OCR PDF</a> first to add a text layer)</li>
  <li>Heavily formatted forms with overlapping elements</li>
</ul>

<p>After converting, if you want to go the other direction and turn your edited Word file back into a PDF, use our <a href="/tools/pdf/word-to-pdf">Word to PDF</a> converter to produce a polished, print-ready output.</p>

<p><strong>Privacy:</strong> Your PDF is sent over HTTPS, converted on our servers, and the resulting .docx is made available to you immediately. Both files are permanently deleted within one hour. No one on our team reads your document content.</p>`,
    faqs: [
      { question: 'Will the formatting be preserved after conversion?', answer: 'For text-based PDFs the layout, fonts, tables, and images are preserved as closely as possible. Complex multi-column layouts may need minor manual adjustment in Word.' },
      { question: 'What Word format will I receive?', answer: 'You receive a .docx file compatible with Microsoft Word 2010+, Google Docs, LibreOffice, and all modern word processors.' },
      { question: 'Can I convert a scanned PDF to Word?', answer: 'Scanned PDFs are images, not text, so direct conversion produces blank paragraphs. Run the file through our OCR PDF tool first to add a searchable text layer, then convert to Word.' },
      { question: 'Is this free?', answer: 'Yes. PDF to Word conversion is completely free with no daily limits or account required.' },
      { question: 'Is my document secure during conversion?', answer: 'Your file is uploaded over HTTPS and automatically deleted within one hour. We never share or store your documents beyond the conversion process.' },
      { question: 'What is the file size limit?', answer: 'Files up to 50 MB are accepted. Most standard PDF documents are well below this limit.' },
      { question: 'Can I convert on a mobile device?', answer: 'Yes. The converter works in mobile browsers on iOS and Android. The downloaded .docx opens in Word or Google Docs on your device.' },
      { question: 'What browsers are supported?', answer: 'Chrome, Firefox, Safari, and Edge on desktop and mobile are all supported.' },
      { question: 'Will images be included in the Word file?', answer: 'Yes. Embedded images are extracted from the PDF and inserted into the .docx at their original positions.' },
      { question: 'How long does conversion take?', answer: 'Most conversions complete in 10–30 seconds depending on the number of pages and content complexity.' },
      { question: 'Can I convert a multi-page PDF?', answer: 'Yes. All pages in the PDF are converted and appear as continuous content in the single .docx output file.' },
    ],
    relatedToolSlugs: ['word-to-pdf', 'pdf-to-excel', 'pdf-to-text', 'ocr-pdf', 'compress-pdf'],
  },

  // ─────────────────────────────────────────────────────────────
  // 5. PDF TO EXCEL
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'pdf-to-excel',
    name: 'PDF to Excel',
    tagline: 'Extract tables and data from PDFs into fully editable Excel spreadsheets.',
    metaTitle: 'PDF to Excel Free Online — Extract Tables to XLSX',
    metaDescription: 'Convert PDF tables to Excel spreadsheets online free. Accurate table extraction to .xlsx format. No signup, files deleted after 1 hour.',
    canonicalUrl: `${BASE}/tools/pdf/pdf-to-excel`,
    ratingValue: '4.6',
    reviewCount: '1876',
    howToSteps: [
      { title: 'Upload your PDF', description: 'Select a PDF containing tables or structured data. Works best with text-based PDFs, not scanned images.' },
      { title: 'Convert to Excel', description: 'Click Convert to Excel. The tool detects table boundaries and maps cells, rows, and columns to the spreadsheet.' },
      { title: 'Download the .xlsx file', description: 'Download your Excel workbook. Each detected table on a page typically becomes its own sheet or section.' },
    ],
    aboutHTML: `<p>Retyping data from a PDF table into a spreadsheet is tedious and error-prone. The <strong>PDF to Excel</strong> converter automates this by identifying table structures within your PDF and reconstructing them as editable cells in a .xlsx workbook compatible with Microsoft Excel 2013+, Google Sheets, and LibreOffice Calc.</p>

<p>The extraction engine analyses the bounding boxes of text elements in the PDF to determine which pieces of text belong to the same row and column. It then writes these values into the appropriate cells, preserving numeric data types where possible. A 50-row financial table that would take 20 minutes to retype manually is converted in under 30 seconds.</p>

<p><strong>Best results with:</strong></p>
<ul>
  <li>Bank statements and financial reports with clearly defined columns</li>
  <li>Pricing tables and product lists</li>
  <li>Survey results exported as PDFs</li>
  <li>Scientific data tables with consistent row/column structure</li>
</ul>

<p><strong>Limitations to be aware of:</strong></p>
<ul>
  <li>Scanned PDFs that are image-only cannot be directly converted — process them with <a href="/tools/pdf/ocr-pdf">OCR PDF</a> first to add a text layer</li>
  <li>Merged or irregularly spanned cells may not reconstruct perfectly</li>
  <li>Decorative dividers or complex nested tables may require manual cleanup</li>
</ul>

<p>If your PDF contains multiple types of content — tables plus charts plus text — and you need the full document in an editable format rather than just the spreadsheet data, consider <a href="/tools/pdf/pdf-to-word">PDF to Word</a> conversion instead.</p>

<p><strong>Security:</strong> Uploaded files are processed over an encrypted HTTPS connection and deleted from our servers within one hour. No extracted data is stored or analysed beyond the conversion itself. The tool is fully free with no account required.</p>`,
    faqs: [
      { question: 'Will table formatting be preserved?', answer: 'Cell values, row/column structure, and numeric data types are preserved. Visual styling like cell colours or merged cells may not transfer exactly.' },
      { question: 'What format will I receive?', answer: 'A standard .xlsx file compatible with Microsoft Excel 2013+, Google Sheets, and LibreOffice Calc.' },
      { question: 'Can I convert a scanned PDF with tables?', answer: 'No. Scanned PDFs are images. Use the OCR PDF tool first to add searchable text, then convert to Excel.' },
      { question: 'Is there a limit on tables per page?', answer: 'No limit on the number of tables. Each detected table section is extracted and placed in the spreadsheet.' },
      { question: 'Is this free?', answer: 'Completely free, no account needed, no watermarks, and no hidden fees.' },
      { question: 'How secure is my financial data?', answer: 'Files travel over HTTPS and are deleted within one hour of processing. We never read, store, or share the content of your documents.' },
      { question: 'Can I use this on mobile?', answer: 'Yes. The tool works in mobile browsers. The .xlsx file downloads and opens in Excel Mobile or Google Sheets on your device.' },
      { question: 'What is the file size limit?', answer: 'Up to 50 MB per PDF upload.' },
      { question: 'What browsers are supported?', answer: 'Chrome, Firefox, Safari, and Edge on desktop and mobile.' },
      { question: 'How long does the conversion take?', answer: 'Typically 10–30 seconds for standard documents. PDFs with many dense tables may take slightly longer.' },
      { question: 'Will formulas be recreated in Excel?', answer: 'No. The tool extracts data values only. Any formula results in the PDF are extracted as static numbers; you will need to add formulas manually in Excel.' },
    ],
    relatedToolSlugs: ['pdf-to-word', 'pdf-to-text', 'ocr-pdf', 'excel-to-pdf', 'compress-pdf'],
  },

  // ─────────────────────────────────────────────────────────────
  // 6. PDF TO POWERPOINT
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'pdf-to-powerpoint',
    name: 'PDF to PowerPoint',
    tagline: 'Turn a PDF presentation back into editable PowerPoint slides ready for customisation.',
    metaTitle: 'PDF to PowerPoint Free Online — Convert PDF to PPTX',
    metaDescription: 'Convert PDF presentations to editable PowerPoint .pptx slides online free. Preserves slide layout and images. No signup needed.',
    canonicalUrl: `${BASE}/tools/pdf/pdf-to-powerpoint`,
    ratingValue: '4.6',
    reviewCount: '1543',
    howToSteps: [
      { title: 'Upload the PDF presentation', description: 'Select your PDF. One PDF page becomes one PowerPoint slide, so a 10-page PDF produces a 10-slide deck.' },
      { title: 'Run the conversion', description: 'Click Convert to PowerPoint. Text, images, and shapes are extracted and placed onto individual slides.' },
      { title: 'Download and edit your deck', description: 'Download the .pptx file and open it in PowerPoint, Keynote (via compatibility mode), or Google Slides to make edits.' },
    ],
    aboutHTML: `<p>When a colleague sends you a PDF of their presentation and you need to update the slides, re-export a few pages, or adapt the deck for a new audience, the <strong>PDF to PowerPoint</strong> converter gives you an editable starting point without rebuilding from scratch.</p>

<p>The conversion maps each PDF page to a PowerPoint slide of the same dimensions. Text elements are extracted and placed in text boxes, preserving font size and approximate positioning. Embedded images are extracted and reinserted on their corresponding slides. Backgrounds and solid-colour fills are recreated where detectable.</p>

<p><strong>Ideal use cases:</strong></p>
<ul>
  <li>Updating a presentation you only have as a PDF export</li>
  <li>Extracting specific slides to incorporate into another deck</li>
  <li>Translating a PDF pitch deck into an editable format for localisation</li>
  <li>Re-branding an existing presentation with new colours and logos</li>
</ul>

<p>For best results, the source PDF should have been originally created from a presentation application. PDFs that are scanned printouts of slides produce image-only slides — text in those cases is not editable without OCR processing.</p>

<p>If you want to go the other direction — converting a finished PowerPoint into a shareable, print-ready PDF — use our <a href="/tools/pdf/powerpoint-to-pdf">PowerPoint to PDF</a> tool. If you need to compress a large PDF presentation before sharing by email, our <a href="/tools/pdf/compress-pdf">Compress PDF</a> tool can reduce the file size considerably.</p>

<p><strong>Privacy and availability:</strong> Conversions run on our encrypted servers. Source and output files are deleted within one hour. The tool is free to use with no account required, and it runs in any modern desktop or mobile browser.</p>`,
    faqs: [
      { question: 'Will each PDF page become a separate slide?', answer: 'Yes. One PDF page equals one PowerPoint slide. A 15-page PDF produces a 15-slide .pptx file.' },
      { question: 'Can I edit text on the converted slides?', answer: 'Yes, for text-based PDFs. Text is placed in editable text boxes. Scanned PDF slides produce image-only slides that are not directly editable.' },
      { question: 'What PowerPoint format do I receive?', answer: 'A .pptx file compatible with Microsoft PowerPoint 2013+, Google Slides, and LibreOffice Impress.' },
      { question: 'Will animations be preserved?', answer: 'No. PDF does not store slide animations. The converted deck will have static slides without transitions or animations.' },
      { question: 'Is the tool free?', answer: 'Yes, completely free with no account required and no usage limits.' },
      { question: 'Are my presentation files secure?', answer: 'Files are transmitted over HTTPS and deleted from our servers within one hour. We never share or retain your presentation content.' },
      { question: 'What is the file size limit?', answer: 'Up to 50 MB per PDF file.' },
      { question: 'Can I convert on a tablet or phone?', answer: 'Yes. The converter is mobile-responsive and works in Safari, Chrome, and Firefox on all devices.' },
      { question: 'How long does the conversion take?', answer: 'Most presentations convert in 15–45 seconds depending on the number of slides and image content.' },
      { question: 'What browsers are supported?', answer: 'All modern browsers including Chrome, Firefox, Safari, and Edge on desktop and mobile.' },
      { question: 'Will charts in the PDF be editable in PowerPoint?', answer: 'Charts are typically converted as static images rather than editable chart objects. You may need to recreate data-driven charts manually.' },
    ],
    relatedToolSlugs: ['powerpoint-to-pdf', 'pdf-to-word', 'compress-pdf', 'pdf-to-jpg', 'pdf-to-png'],
  },

  // ─────────────────────────────────────────────────────────────
  // 7. PDF TO JPG
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'pdf-to-jpg',
    name: 'PDF to JPG',
    tagline: 'Convert every page of a PDF to high-quality JPG images, downloadable as a ZIP.',
    metaTitle: 'PDF to JPG Free Online — Convert PDF Pages to Images',
    metaDescription: 'Convert PDF pages to JPG images online free. Choose 72, 150, or 300 DPI. Download all images as a ZIP. No signup, secure.',
    canonicalUrl: `${BASE}/tools/pdf/pdf-to-jpg`,
    ratingValue: '4.8',
    reviewCount: '2654',
    howToSteps: [
      { title: 'Upload your PDF', description: 'Select any PDF file up to 50 MB. Multi-page PDFs are fully supported.' },
      { title: 'Choose image quality (DPI)', description: 'Select 72 DPI for web/screen use, 150 DPI for standard quality, or 300 DPI for print-quality images.' },
      { title: 'Download the JPG images', description: 'Click Convert to JPG. Each page becomes a separate JPG file. Download all images as a single ZIP archive.' },
    ],
    aboutHTML: `<p>The <strong>PDF to JPG</strong> converter renders each page of your PDF as a raster JPG image. This is useful when you need to embed PDF content in a website, share a quick visual preview, upload to a platform that does not accept PDF files, or create thumbnail images from individual pages.</p>

<p>JPG (JPEG) uses lossy compression, which keeps file sizes small while delivering visually acceptable quality for most purposes. The DPI (dots per inch) setting controls the resolution of the output images:</p>
<ul>
  <li><strong>72 DPI:</strong> Optimised for web display. Smallest file sizes, suitable for website thumbnails and quick previews.</li>
  <li><strong>150 DPI:</strong> Standard quality. Good balance between file size and sharpness for general use, including emails and slideshows.</li>
  <li><strong>300 DPI:</strong> Print-quality resolution. Produces the sharpest images with larger file sizes, suitable for printing or high-zoom detailed viewing.</li>
</ul>

<p>All pages in the PDF are converted simultaneously and delivered as a ZIP archive, so you can download the full set with one click. Each image is named sequentially (page-001.jpg, page-002.jpg, etc.) for easy sorting.</p>

<p>If you need lossless image output with transparency support, consider using our <a href="/tools/pdf/pdf-to-png">PDF to PNG</a> converter instead. PNG files are larger but retain exact pixel fidelity, which matters for logos, diagrams with fine lines, or text at small sizes.</p>

<p>For the reverse operation — combining multiple JPG images into a single PDF document — use our <a href="/tools/pdf/jpg-to-pdf">JPG to PDF</a> tool.</p>

<p><strong>Privacy:</strong> Your PDF is processed on our secure servers over an encrypted connection. All files are deleted within one hour. No account is needed and there are no usage fees.</p>`,
    faqs: [
      { question: 'What DPI should I choose?', answer: '72 DPI for web use, 150 DPI for general purposes like email, and 300 DPI when you need print-quality or high-resolution images.' },
      { question: 'Will every page of the PDF become a JPG?', answer: 'Yes. Every page is converted to its own numbered JPG file. All images are packaged in a single ZIP archive for download.' },
      { question: 'What is the file size limit?', answer: 'You can convert PDFs up to 50 MB. The output ZIP may be larger depending on the DPI chosen.' },
      { question: 'Is the tool free?', answer: 'Completely free. No account, no subscription, and no watermarks on the output images.' },
      { question: 'Are my files private?', answer: 'Files travel over HTTPS and are deleted from our servers within one hour. We never retain or share your documents.' },
      { question: 'Can I convert on mobile?', answer: 'Yes. The tool works in mobile browsers on iOS and Android. The ZIP downloads to your device automatically.' },
      { question: 'What browsers are supported?', answer: 'Chrome, Firefox, Safari, and Edge on desktop and mobile are all supported.' },
      { question: 'Why is JPG sometimes worse quality than the original PDF?', answer: 'JPG uses lossy compression. If your PDF has very fine text or sharp lines, choose 300 DPI and the difference will be minimal. For lossless output, use PDF to PNG instead.' },
      { question: 'How long does the conversion take?', answer: 'Usually 10–30 seconds for standard documents. High-DPI conversion of long PDFs may take up to a minute.' },
      { question: 'Can I get individual images instead of a ZIP?', answer: 'The tool packages all pages in a ZIP for convenience. Extract the ZIP on your device to access individual JPG files.' },
      { question: 'What colour space do the JPGs use?', answer: 'Output images use the standard sRGB colour space, which is compatible with all web browsers and image editors.' },
    ],
    relatedToolSlugs: ['pdf-to-png', 'jpg-to-pdf', 'compress-pdf', 'split-pdf', 'ocr-pdf'],
  },

  // ─────────────────────────────────────────────────────────────
  // 8. PDF TO PNG
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'pdf-to-png',
    name: 'PDF to PNG',
    tagline: 'Convert PDF pages to lossless PNG images with full transparency support.',
    metaTitle: 'PDF to PNG Free Online — Convert PDF Pages to PNG',
    metaDescription: 'Convert PDF pages to PNG images free online. Lossless quality, transparency support, 72–300 DPI. No signup, files auto-deleted.',
    canonicalUrl: `${BASE}/tools/pdf/pdf-to-png`,
    ratingValue: '4.7',
    reviewCount: '1432',
    howToSteps: [
      { title: 'Upload your PDF', description: 'Select any PDF file. Each page will be rendered as a separate PNG image.' },
      { title: 'Select the output DPI', description: 'Choose 72 DPI for screen use, 150 DPI for general quality, or 300 DPI for high-resolution images suitable for printing.' },
      { title: 'Download the PNG files', description: 'Click Convert to PNG and download the ZIP archive containing a numbered PNG file for every page in the document.' },
    ],
    aboutHTML: `<p>PNG (Portable Network Graphics) is the preferred image format when you need perfect pixel fidelity, lossless compression, or transparent backgrounds. The <strong>PDF to PNG</strong> converter renders each page of your PDF document as a full-quality PNG image with no compression artefacts — making it ideal for technical diagrams, product visuals, logos, and any content where detail matters.</p>

<p>Unlike JPG, which uses lossy compression and introduces subtle blurring around sharp edges and thin lines, PNG stores every pixel exactly as rendered. This is particularly important for:</p>
<ul>
  <li>Engineering drawings and schematics where line precision is critical</li>
  <li>Slide decks and infographics that will be embedded on websites</li>
  <li>Pages containing barcodes, QR codes, or fine text that must remain sharp</li>
  <li>Diagrams with a white background that needs to be transparent for overlay use</li>
</ul>

<p>The DPI selector controls output resolution. At 300 DPI, an A4 page converts to approximately 2480×3508 pixels — sufficient for professional print. At 72 DPI, the same page becomes 595×842 pixels, well-suited for web display where bandwidth matters more than resolution.</p>

<p>All converted pages are packaged in a ZIP archive and named sequentially (page-001.png, page-002.png, and so on). If you need smaller files and transparency is not required, our <a href="/tools/pdf/pdf-to-jpg">PDF to JPG</a> tool produces smaller file sizes using JPEG compression. To go the other direction and turn PNG images into a PDF document, use <a href="/tools/pdf/png-to-pdf">PNG to PDF</a>.</p>

<p><strong>Privacy and security:</strong> Uploads are encrypted with HTTPS. All files are deleted from our servers within one hour of conversion completing. No account is needed and the tool is entirely free.</p>`,
    faqs: [
      { question: 'What is the difference between PDF to PNG and PDF to JPG?', answer: 'PNG uses lossless compression and supports transparency. JPG uses lossy compression and produces smaller files. Choose PNG for sharp diagrams and logos; choose JPG for photographs and when file size is a priority.' },
      { question: 'Will transparent areas in the PDF be transparent in the PNG?', answer: 'Yes. PDF pages with transparent backgrounds produce PNG files with a transparent (alpha) background rather than a white fill.' },
      { question: 'What DPI should I use?', answer: '72 DPI for websites and social media, 150 DPI for presentations and documents, 300 DPI for print and high-detail review.' },
      { question: 'Is the tool free?', answer: 'Yes. Free with no account, no daily limits, and no watermarks on output images.' },
      { question: 'Is there a file size limit?', answer: 'PDFs up to 50 MB are accepted. The resulting ZIP may be larger because PNG files are larger than JPG.' },
      { question: 'Are my files secure?', answer: 'Files are transmitted over HTTPS and automatically deleted from servers within one hour. No content is shared or retained.' },
      { question: 'Can I use this on mobile?', answer: 'Yes. The tool runs in mobile browsers on iOS and Android. The ZIP archive downloads directly to your device.' },
      { question: 'What browsers work?', answer: 'Chrome, Firefox, Safari, and Edge on both desktop and mobile.' },
      { question: 'How long does conversion take?', answer: 'Typically 10–40 seconds. High-DPI conversions of multi-page documents may take slightly longer.' },
      { question: 'Will each page become a separate PNG?', answer: 'Yes. Each page in the PDF produces one numbered PNG file. All files are packaged in a single ZIP archive.' },
      { question: 'Can I choose which pages to convert?', answer: 'Currently all pages are converted. To convert only specific pages, use the Extract PDF Pages tool first to pull the desired pages, then convert.' },
    ],
    relatedToolSlugs: ['pdf-to-jpg', 'png-to-pdf', 'compress-pdf', 'split-pdf', 'extract-pdf-pages'],
  },

  // ─────────────────────────────────────────────────────────────
  // 9. WORD TO PDF
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'word-to-pdf',
    name: 'Word to PDF',
    tagline: 'Convert Word documents to print-ready, universally compatible PDF files instantly.',
    metaTitle: 'Word to PDF Free Online — Convert DOCX to PDF Fast',
    metaDescription: 'Convert Word (.doc/.docx) to PDF online free. Preserves fonts, tables, and layout. Instant download, no signup, no watermark.',
    canonicalUrl: `${BASE}/tools/pdf/word-to-pdf`,
    ratingValue: '4.9',
    reviewCount: '3201',
    howToSteps: [
      { title: 'Upload your Word file', description: 'Select a .doc or .docx file from your device. Files up to 50 MB are supported.' },
      { title: 'Convert to PDF', description: 'Click Convert to PDF. The tool renders your document using a professional document engine that respects all Word styles.' },
      { title: 'Download the PDF', description: 'Your PDF is ready in seconds. Download it and share, print, or archive without worrying about fonts or layout shifts.' },
    ],
    aboutHTML: `<p>PDF is the standard format for sharing professional documents because it displays identically on every device regardless of what fonts or software the recipient has installed. The <strong>Word to PDF</strong> converter turns your .doc or .docx files into polished, universally compatible PDF documents that look exactly as intended.</p>

<p>The conversion engine fully renders the Word document including all text styles, embedded fonts, headers and footers, page numbering, tables, charts, tracked changes (which are accepted before PDF rendering), and inline images. The result is a PDF that matches the print output of Microsoft Word with high fidelity.</p>

<p><strong>Common reasons to convert Word to PDF:</strong></p>
<ul>
  <li>Sharing a CV or cover letter that must display consistently on any recruiter's computer</li>
  <li>Sending a contract or proposal in a format the recipient cannot accidentally edit</li>
  <li>Submitting an assignment that requires a PDF format</li>
  <li>Archiving a document in a non-proprietary, long-lived format</li>
  <li>Printing a document that needs to look identical across different printers</li>
</ul>

<p>Both .doc (Word 97–2003) and .docx (Office Open XML, 2007+) formats are supported. Documents with macros are accepted but macros are not executed during conversion for security reasons.</p>

<p>If you later need to edit the PDF and turn it back into Word format, our <a href="/tools/pdf/pdf-to-word">PDF to Word</a> converter can extract the content. To reduce the size of a large resulting PDF, try our <a href="/tools/pdf/compress-pdf">Compress PDF</a> tool before sharing.</p>

<p><strong>Privacy:</strong> Your Word document is uploaded over HTTPS and deleted from our servers within one hour. We never read or share the content of your files. No account is required and the tool is free to use.</p>`,
    faqs: [
      { question: 'Which Word formats are supported?', answer: 'Both .doc (Word 97–2003) and .docx (Word 2007 and later) are supported.' },
      { question: 'Will fonts be embedded in the PDF?', answer: 'Yes. The conversion engine embeds all fonts used in the document, ensuring consistent display on any device.' },
      { question: 'Are tables and images preserved?', answer: 'Yes. Tables, inline images, charts, headers, footers, and all standard Word formatting elements are rendered accurately.' },
      { question: 'Is tracked changes or comments visible in the PDF?', answer: 'Tracked changes are accepted (all revisions applied) and comments are hidden before PDF conversion, producing a clean final document.' },
      { question: 'Is the tool free?', answer: 'Yes, completely free with no account required and no limits on file conversions.' },
      { question: 'What is the file size limit?', answer: 'Up to 50 MB per Word file.' },
      { question: 'Are my documents secure?', answer: 'Files are uploaded over HTTPS and deleted from servers within one hour. Your document content is never accessed by our team.' },
      { question: 'Can I convert on mobile?', answer: 'Yes. The tool works in mobile browsers. You can upload from cloud storage (Dropbox, Google Drive) via the browser file picker.' },
      { question: 'What browsers are supported?', answer: 'Chrome, Firefox, Safari, and Edge on desktop and mobile.' },
      { question: 'How long does conversion take?', answer: 'Typically 5–20 seconds. Complex documents with many embedded images may take slightly longer.' },
      { question: 'Can I password-protect the resulting PDF?', answer: 'After downloading, you can run the PDF through our Protect PDF tool to add a password before sharing.' },
    ],
    relatedToolSlugs: ['pdf-to-word', 'compress-pdf', 'protect-pdf', 'merge-pdf', 'excel-to-pdf'],
  },

  // ─────────────────────────────────────────────────────────────
  // 10. EXCEL TO PDF
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'excel-to-pdf',
    name: 'Excel to PDF',
    tagline: 'Convert Excel spreadsheets to pixel-perfect PDF documents with tables and charts intact.',
    metaTitle: 'Excel to PDF Free Online — Convert XLSX to PDF',
    metaDescription: 'Convert Excel spreadsheets (.xls/.xlsx) to PDF online free. Preserves tables, charts, and formatting. Instant, no signup.',
    canonicalUrl: `${BASE}/tools/pdf/excel-to-pdf`,
    ratingValue: '4.7',
    reviewCount: '1987',
    howToSteps: [
      { title: 'Upload your Excel file', description: 'Select your .xls or .xlsx spreadsheet. Files up to 50 MB are accepted.' },
      { title: 'Convert to PDF', description: 'Click Convert to PDF. The converter renders every sheet, table, and chart using a spreadsheet engine.' },
      { title: 'Download the PDF', description: 'Download your PDF. Each worksheet typically becomes one or more PDF pages depending on its print area settings.' },
    ],
    aboutHTML: `<p>Sharing a spreadsheet as a PDF ensures recipients see exactly what you intend — with consistent column widths, frozen headers, and no risk of accidental edits. The <strong>Excel to PDF</strong> converter transforms your .xls or .xlsx file into a professional PDF document in seconds.</p>

<p>The conversion engine renders each worksheet using the same print-page settings defined in Excel (page breaks, print area, landscape or portrait orientation, header and footer text). Charts are rendered as vector elements where possible, preserving sharp lines and labels at all zoom levels. Cell borders, background fills, merged cells, and conditional formatting are all faithfully reproduced.</p>

<p><strong>Useful conversion scenarios:</strong></p>
<ul>
  <li>Sending a financial report or budget to stakeholders in a tamper-proof format</li>
  <li>Submitting expense reports or timesheets to clients</li>
  <li>Sharing a product pricing sheet without revealing formulas</li>
  <li>Creating a print-ready version of a project schedule or Gantt chart</li>
</ul>

<p>If your spreadsheet contains multiple worksheets, each sheet is converted to its own set of PDF pages in the correct order. Hidden sheets are not included in the output by default.</p>

<p>If you need the reverse — extracting data back from a PDF table into an editable spreadsheet — use our <a href="/tools/pdf/pdf-to-excel">PDF to Excel</a> tool. For reducing the size of the resulting PDF before emailing large spreadsheet exports, try <a href="/tools/pdf/compress-pdf">Compress PDF</a>.</p>

<p><strong>Security:</strong> Your Excel file is transmitted over HTTPS and removed from our servers within one hour. Formulas, cell values, and business data are processed only by our automated conversion service and are never accessed by staff. The tool is free with no account required.</p>`,
    faqs: [
      { question: 'Which Excel formats are supported?', answer: 'Both .xls (Excel 97–2003) and .xlsx (Excel 2007 and later) are supported.' },
      { question: 'Are multiple worksheets converted?', answer: 'Yes. Each worksheet becomes its own section in the PDF. The sheets appear in the same order as in the Excel file.' },
      { question: 'Are charts preserved in the PDF?', answer: 'Yes. Charts embedded in worksheets are rendered as images in the PDF at the specified print size.' },
      { question: 'Will formulas show their results or their code?', answer: 'Formulas show their calculated results, exactly as they appear in Excel when you view the spreadsheet.' },
      { question: 'Is the tool free?', answer: 'Yes, completely free with no account or subscription required.' },
      { question: 'What is the maximum file size?', answer: 'Up to 50 MB per upload.' },
      { question: 'Are my spreadsheet data and formulas secure?', answer: 'Files are transmitted over HTTPS and automatically deleted within one hour. Our servers process the file for conversion only — no data is extracted or stored.' },
      { question: 'Can I convert on a mobile device?', answer: 'Yes. The tool is fully responsive and works in mobile browsers without any app.' },
      { question: 'What browsers are supported?', answer: 'Chrome, Firefox, Safari, and Edge are all supported on desktop and mobile.' },
      { question: 'How long does conversion take?', answer: 'Most spreadsheets convert in 10–30 seconds. Large workbooks with many sheets may take up to a minute.' },
      { question: 'What page orientation is used?', answer: 'The converter uses the print orientation (portrait or landscape) set in each worksheet. By default, most sheets use portrait.' },
    ],
    relatedToolSlugs: ['pdf-to-excel', 'word-to-pdf', 'compress-pdf', 'protect-pdf', 'merge-pdf'],
  },

  // ─────────────────────────────────────────────────────────────
  // 11. POWERPOINT TO PDF
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'powerpoint-to-pdf',
    name: 'PowerPoint to PDF',
    tagline: 'Convert PowerPoint presentations to sharp, shareable PDF files that look perfect on any screen.',
    metaTitle: 'PowerPoint to PDF Free Online — Convert PPTX to PDF',
    metaDescription: 'Convert PowerPoint (.ppt/.pptx) to PDF online free. Slides render sharply as PDF pages. No signup, files deleted after 1 hour.',
    canonicalUrl: `${BASE}/tools/pdf/powerpoint-to-pdf`,
    ratingValue: '4.8',
    reviewCount: '2213',
    howToSteps: [
      { title: 'Upload your presentation', description: 'Select your .ppt or .pptx file. All slides, including hidden slides, are included unless noted.' },
      { title: 'Convert to PDF', description: 'Click Convert to PDF. Each slide is rendered to a full-quality PDF page maintaining your layout, fonts, and visuals.' },
      { title: 'Download the PDF', description: 'Download and share your presentation as a PDF. No PowerPoint installation needed to view it.' },
    ],
    aboutHTML: `<p>Sharing a PowerPoint file can go wrong — fonts may be missing on the recipient's computer, animations can freeze, and slide dimensions may shift. Converting your presentation to PDF with our <strong>PowerPoint to PDF</strong> tool eliminates these issues by locking every slide exactly as you designed it.</p>

<p>Each slide in your .ppt or .pptx file is rendered to its own PDF page at the native slide dimensions (typically 16:9 widescreen or 4:3 standard). Text, SmartArt, shapes, images, and charts all appear as in the original. Slide transition animations are not included (PDF does not support them), but speaker notes can be embedded as PDF annotations in supported configurations.</p>

<p><strong>When PowerPoint to PDF is the right choice:</strong></p>
<ul>
  <li>Sending a presentation to a client who does not have PowerPoint installed</li>
  <li>Uploading slides to a conference submission system that requires PDF</li>
  <li>Archiving a version of a presentation before making further changes</li>
  <li>Embedding presentation slides on a web page using a PDF viewer</li>
  <li>Printing handouts with multiple slides per page</li>
</ul>

<p>Both .ppt (PowerPoint 97–2003) and .pptx (Office Open XML) formats are accepted. Files created in Google Slides can be downloaded as .pptx and then converted here.</p>

<p>If you later need to edit the slides in the PDF, our <a href="/tools/pdf/pdf-to-powerpoint">PDF to PowerPoint</a> converter can help you extract the slides back into an editable format. For large presentations, <a href="/tools/pdf/compress-pdf">Compress PDF</a> can reduce the resulting file size before email distribution.</p>

<p><strong>Privacy and cost:</strong> Files are encrypted in transit, processed on isolated servers, and deleted within one hour. The tool is 100% free with no account needed.</p>`,
    faqs: [
      { question: 'Which file formats are supported?', answer: 'Both .ppt (PowerPoint 97–2003) and .pptx (PowerPoint 2007 and later) are supported. Google Slides files should be exported to .pptx first.' },
      { question: 'Are all slides included in the PDF?', answer: 'Yes, all slides including hidden slides are converted to PDF pages.' },
      { question: 'Will slide transitions and animations be in the PDF?', answer: 'No. PDF is a static format and does not support slide animations or transitions. Each slide appears as a static snapshot.' },
      { question: 'Are fonts embedded in the PDF?', answer: 'Yes. Fonts present in the presentation are embedded in the PDF output, ensuring consistent appearance on any device.' },
      { question: 'Is the tool free?', answer: 'Yes, completely free with no usage limits or account requirements.' },
      { question: 'What is the file size limit?', answer: 'Up to 50 MB per file.' },
      { question: 'Are my slides secure?', answer: 'Files are transmitted over HTTPS and deleted from our servers within one hour. We never access or retain your presentation content.' },
      { question: 'Can I convert on my phone or tablet?', answer: 'Yes. The tool works in mobile browsers on iOS and Android.' },
      { question: 'What browsers are supported?', answer: 'Chrome, Firefox, Safari, and Edge on desktop and mobile.' },
      { question: 'How fast is the conversion?', answer: 'Typically 10–30 seconds for most presentations. Large files with many high-resolution images may take slightly longer.' },
      { question: 'Can I merge the resulting PDF with other documents?', answer: 'Yes. After downloading, run it through our Merge PDF tool to combine it with other documents.' },
    ],
    relatedToolSlugs: ['pdf-to-powerpoint', 'word-to-pdf', 'compress-pdf', 'merge-pdf', 'protect-pdf'],
  },

  // ─────────────────────────────────────────────────────────────
  // 12. JPG TO PDF
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'jpg-to-pdf',
    name: 'JPG to PDF',
    tagline: 'Convert one or many JPG images into a single, shareable PDF document.',
    metaTitle: 'JPG to PDF Free Online — Convert Images to PDF',
    metaDescription: 'Convert JPG images to PDF online free. Combine multiple JPGs into one PDF. No signup, no watermark, files deleted after 1 hour.',
    canonicalUrl: `${BASE}/tools/pdf/jpg-to-pdf`,
    ratingValue: '4.8',
    reviewCount: '2876',
    howToSteps: [
      { title: 'Upload your JPG images', description: 'Select one or multiple JPG files at once. You can also upload PNG, WebP, and other image formats.' },
      { title: 'Arrange if needed', description: 'Images are placed in the PDF in the order they are selected. Choose your files in the desired page sequence.' },
      { title: 'Download the PDF', description: 'Click Convert to PDF and download your new document. Each image fills one page of the PDF.' },
    ],
    aboutHTML: `<p>Combining photos, scanned pages, or screenshots into a single PDF document is one of the most common file tasks. The <strong>JPG to PDF</strong> tool places each image on its own PDF page and merges them into a single downloadable file — no installation, no watermarks, no cost.</p>

<p>The converter accepts JPG (JPEG), PNG, WebP, GIF, and BMP files. Each image is embedded at full resolution within the PDF. Page dimensions automatically match the aspect ratio of the source image, so portrait photos produce portrait pages and landscape photos produce landscape pages. No cropping or distortion occurs.</p>

<p><strong>Common uses:</strong></p>
<ul>
  <li>Scanning documents with your phone camera and combining them into a single PDF for submission</li>
  <li>Merging a series of screenshots into a single reference document</li>
  <li>Packaging product photos into a PDF catalogue</li>
  <li>Assembling scanned receipts for expense reporting</li>
  <li>Creating a photo album in PDF format for printing or archiving</li>
</ul>

<p>For best results, choose images at a resolution appropriate for your intended use. For printing, 300 DPI source images produce sharp results. For screen or email use, 150 DPI images are sufficient and keep the PDF file size manageable.</p>

<p>If your PDF is larger than expected after conversion, run it through our <a href="/tools/pdf/compress-pdf">Compress PDF</a> tool to reduce its size. To go the other direction and extract images from an existing PDF, use <a href="/tools/pdf/pdf-to-jpg">PDF to JPG</a>.</p>

<p><strong>Security:</strong> All uploads are encrypted with HTTPS. Your image files and the generated PDF are automatically deleted from our servers within one hour. No account is needed and the tool is completely free.</p>`,
    faqs: [
      { question: 'Can I combine multiple JPGs into one PDF?', answer: 'Yes. Select multiple images at once and they will all be placed in the PDF — one image per page — in the order you select them.' },
      { question: 'What image formats are accepted?', answer: 'JPG, PNG, WebP, GIF, and BMP files are all accepted in addition to standard JPEG.' },
      { question: 'Will image quality be reduced?', answer: 'No. Images are embedded in the PDF at their original resolution. Quality is not degraded during conversion.' },
      { question: 'Is the tool free?', answer: 'Yes. No account, no fee, no daily limits, and no watermarks on the output PDF.' },
      { question: 'What is the file size limit?', answer: 'Up to 50 MB total for all uploaded images combined.' },
      { question: 'Are my images secure?', answer: 'Uploads are encrypted with HTTPS and all files are deleted within one hour. We never store or share your images.' },
      { question: 'Can I use this on mobile?', answer: 'Yes. The tool works in mobile browsers and can access photos from your camera roll via the file picker.' },
      { question: 'What browsers are supported?', answer: 'Chrome, Firefox, Safari, and Edge on desktop and mobile.' },
      { question: 'How long does the conversion take?', answer: 'Usually under 10 seconds for a small batch of images. Larger collections may take 20–30 seconds.' },
      { question: 'Will each image be a full page?', answer: 'Yes. Each image occupies its own page in the PDF. Page dimensions match the image aspect ratio.' },
      { question: 'Can I add a cover page or title?', answer: 'Currently the tool does not add text pages. For a title page, create one as an image and add it as the first file in your selection.' },
    ],
    relatedToolSlugs: ['pdf-to-jpg', 'png-to-pdf', 'compress-pdf', 'merge-pdf', 'scan-to-pdf'],
  },

  // ─────────────────────────────────────────────────────────────
  // 13. PNG TO PDF
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'png-to-pdf',
    name: 'PNG to PDF',
    tagline: 'Convert PNG images — including transparent ones — to a clean, professional PDF.',
    metaTitle: 'PNG to PDF Free Online — Convert PNG Images to PDF',
    metaDescription: 'Convert PNG images to PDF online free. Supports transparent PNG, multiple files per PDF. No signup, instant download.',
    canonicalUrl: `${BASE}/tools/pdf/png-to-pdf`,
    ratingValue: '4.7',
    reviewCount: '1287',
    howToSteps: [
      { title: 'Upload your PNG files', description: 'Select one or multiple PNG images. Transparent PNGs are supported — the transparency is preserved on a white background.' },
      { title: 'Order your images', description: 'PNGs are placed in the PDF in the selection order. Choose files in the sequence you want them to appear.' },
      { title: 'Download the PDF', description: 'Click Convert to PDF and download your document with each PNG as a separate page.' },
    ],
    aboutHTML: `<p>PNG is the format of choice for graphics, diagrams, screenshots, and images with transparency. The <strong>PNG to PDF</strong> converter embeds your PNG files into a PDF document at full quality, making them easy to share, print, or archive in a universally readable format.</p>

<p>Transparency handling is a key distinction between PNG to PDF and JPG to PDF. When a PNG has transparent areas (saved with an alpha channel), those areas are composited over a white background in the PDF — which ensures the document prints correctly and displays consistently in all PDF readers. The PNG image data itself is embedded losslessly, so every pixel is preserved exactly as in the source file.</p>

<p><strong>When to choose PNG to PDF over JPG to PDF:</strong></p>
<ul>
  <li>Converting UI screenshots or wireframes that contain crisp text and sharp edges</li>
  <li>Embedding logos or graphics that originally used a transparent background</li>
  <li>Compiling technical diagrams, flowcharts, or architectural drawings</li>
  <li>Submitting design mockups for review in PDF format</li>
</ul>

<p>You can combine multiple PNG files into a single PDF — a useful shortcut when you have a multi-page diagram saved as separate PNG exports. Files are placed in the order they are selected, so pick your images in the desired page sequence before clicking convert.</p>

<p>The resulting PDF can be further processed: use <a href="/tools/pdf/compress-pdf">Compress PDF</a> if the file size is larger than needed for emailing, or <a href="/tools/pdf/merge-pdf">Merge PDF</a> to combine it with an existing document.</p>

<p><strong>Privacy:</strong> All uploaded files are processed over HTTPS and automatically deleted from our servers within one hour. No account is required and the conversion is completely free.</p>`,
    faqs: [
      { question: 'Is transparency in PNG files preserved in the PDF?', answer: 'Transparent areas are composited onto a white background in the PDF, which ensures correct printing and universal viewer compatibility.' },
      { question: 'Can I combine multiple PNGs into one PDF?', answer: 'Yes. Select multiple PNG files and each one becomes a page in the same PDF document.' },
      { question: 'What is the difference between PNG to PDF and JPG to PDF?', answer: 'PNG to PDF preserves lossless image quality and handles transparency. JPG to PDF produces smaller files but uses lossy compression.' },
      { question: 'Is the tool free?', answer: 'Yes. No account, no subscription, and no watermarks on the output.' },
      { question: 'What is the file size limit?', answer: 'Up to 50 MB for the total size of all uploaded PNG images.' },
      { question: 'Are my images secure?', answer: 'Images are transmitted over HTTPS and deleted within one hour of processing.' },
      { question: 'Can I use this on a phone?', answer: 'Yes. The tool is mobile-responsive and works in all major mobile browsers.' },
      { question: 'What browsers are supported?', answer: 'Chrome, Firefox, Safari, and Edge on desktop and mobile.' },
      { question: 'How long does conversion take?', answer: 'Typically 5–15 seconds for standard batches.' },
      { question: 'Will image quality be reduced in the PDF?', answer: 'No. PNG images are embedded losslessly. No compression artefacts are introduced.' },
      { question: 'Can I add text to the PDF pages?', answer: 'This tool converts images to PDF pages. For annotating or adding text to pages, use a PDF editor after the conversion.' },
    ],
    relatedToolSlugs: ['jpg-to-pdf', 'pdf-to-png', 'compress-pdf', 'merge-pdf', 'add-watermark'],
  },

  // ─────────────────────────────────────────────────────────────
  // 14. HTML TO PDF
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'html-to-pdf',
    name: 'HTML to PDF',
    tagline: 'Convert an HTML file or web page to a pixel-accurate PDF document.',
    metaTitle: 'HTML to PDF Free Online — Convert Webpage to PDF',
    metaDescription: 'Convert HTML files to PDF online free. Renders CSS, images, and layouts accurately. No signup, instant download, files deleted in 1 hour.',
    canonicalUrl: `${BASE}/tools/pdf/html-to-pdf`,
    ratingValue: '4.6',
    reviewCount: '1102',
    howToSteps: [
      { title: 'Upload your HTML file', description: 'Select a .html or .htm file from your device. Linked CSS and images must be either embedded inline or bundled in the same upload.' },
      { title: 'Convert to PDF', description: 'Click Convert to PDF. The tool renders your HTML in a headless browser engine and exports each scroll-page as a PDF page.' },
      { title: 'Download the PDF', description: 'Download your PDF and verify the layout. Multi-page HTML documents are paginated automatically based on the page height.' },
    ],
    aboutHTML: `<p>Web developers, email marketers, and content teams often need to turn HTML documents into distributable PDF files — for invoices, reports, newsletters, or archived web content. The <strong>HTML to PDF</strong> converter renders your HTML file using a full browser engine, then exports the result as a PDF that captures the styling, fonts, and layout exactly as a browser would display them.</p>

<p>The converter supports standard HTML5 and CSS3, including Flexbox and Grid layouts, custom fonts (if embedded using @font-face with base64-encoded data), inline SVG graphics, and CSS print media queries. This means you can use <code>@media print</code> rules in your CSS to fine-tune how the page breaks and which elements are visible in the PDF output.</p>

<p><strong>Best practices for clean conversions:</strong></p>
<ul>
  <li>Embed all CSS inline or in a <code>&lt;style&gt;</code> tag within the HTML file to avoid missing stylesheets</li>
  <li>Convert images to base64 and embed them in the HTML if they are referenced by URL (external URLs may not load during conversion)</li>
  <li>Use <code>@page</code> CSS rules to set the page size (A4, Letter, etc.) and margins</li>
  <li>Test with <code>@media print</code> styles to control page breaks and hide navigation or sidebar elements</li>
</ul>

<p>This tool is ideal for generating invoice PDFs from HTML templates, archiving web articles, or converting email templates to PDF proofs. If you need to convert an entire webpage by URL rather than uploading an HTML file, you can save the page from your browser (File → Save As → Complete HTML) and upload the self-contained file.</p>

<p>After conversion, use <a href="/tools/pdf/compress-pdf">Compress PDF</a> if the resulting file is larger than needed. To combine the converted page with other PDFs, use <a href="/tools/pdf/merge-pdf">Merge PDF</a>.</p>

<p><strong>Security:</strong> Uploaded HTML files are processed on isolated servers and deleted within one hour. No user data embedded in the HTML is logged or retained.</p>`,
    faqs: [
      { question: 'What HTML features are supported?', answer: 'HTML5, CSS3 including Flexbox and Grid, inline SVG, and @media print rules are all supported. External fonts and images must be embedded inline.' },
      { question: 'Can I convert a live website by URL?', answer: 'This tool accepts uploaded HTML files. To convert a live URL, save the page from your browser as a complete HTML file and upload it.' },
      { question: 'Why are some styles missing in the converted PDF?', answer: 'Externally linked CSS files and remote image URLs may not load during conversion. Embed all CSS in a <style> tag and use base64 for images.' },
      { question: 'Is the tool free?', answer: 'Yes, completely free with no account required.' },
      { question: 'What is the file size limit?', answer: 'HTML files up to 50 MB are accepted, including base64-encoded assets.' },
      { question: 'Are my HTML files secure?', answer: 'Files are processed on isolated servers over HTTPS and deleted within one hour.' },
      { question: 'Can I use this on mobile?', answer: 'Yes, the tool is mobile-responsive and works in all major mobile browsers.' },
      { question: 'What page size does the PDF use?', answer: 'By default A4 portrait. Use @page CSS rules to specify a different size or orientation.' },
      { question: 'What browsers are supported?', answer: 'Chrome, Firefox, Safari, and Edge on desktop and mobile.' },
      { question: 'How long does conversion take?', answer: 'Typically 10–30 seconds depending on the complexity and size of the HTML file.' },
      { question: 'Can I convert multi-page HTML?', answer: 'Yes. Long HTML documents are automatically paginated based on content height and page size.' },
    ],
    relatedToolSlugs: ['merge-pdf', 'compress-pdf', 'protect-pdf', 'word-to-pdf', 'pdf-to-text'],
  },

  // ─────────────────────────────────────────────────────────────
  // 15. PDF TO TEXT
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'pdf-to-text',
    name: 'PDF to Text',
    tagline: 'Extract all readable text from a PDF and download it as a plain .txt file.',
    metaTitle: 'PDF to Text Free Online — Extract Text from PDF',
    metaDescription: 'Extract text from any PDF online free. Download as plain .txt file. Great for copying, analysis, or data processing. No signup needed.',
    canonicalUrl: `${BASE}/tools/pdf/pdf-to-text`,
    ratingValue: '4.6',
    reviewCount: '1198',
    howToSteps: [
      { title: 'Upload your PDF', description: 'Select the PDF containing the text you want to extract. For scanned PDFs without a text layer, use OCR PDF instead.' },
      { title: 'Extract the text', description: 'Click Extract Text. The tool reads the embedded text layer from every page of your PDF.' },
      { title: 'Download the .txt file', description: 'Download the plain text file. Open it in any text editor, import it into a spreadsheet, or use it in any text-processing workflow.' },
    ],
    aboutHTML: `<p>When you need to pull the text out of a PDF — for analysis, searching, translation, copy-pasting into another application, or feeding into a text-processing script — the <strong>PDF to Text</strong> extractor gives you a clean plain-text version of the document in seconds.</p>

<p>Modern PDFs store an embedded text layer that describes exactly what each character is and where it appears on the page. This tool reads that layer directly and writes all the text to a .txt file, preserving the reading order (top to bottom, left to right by default). Paragraph breaks are represented by blank lines, and page boundaries are optionally marked with a page separator line.</p>

<p><strong>Practical use cases for PDF to text extraction:</strong></p>
<ul>
  <li>Feeding document content into an AI language model or text analysis pipeline</li>
  <li>Searching through large PDF archives without opening each file</li>
  <li>Extracting contract clauses or report data for further processing</li>
  <li>Creating a transcript of a multi-page form or questionnaire</li>
  <li>Preparing translated source material by extracting the original text first</li>
</ul>

<p><strong>Important limitation:</strong> This tool only works on PDFs that have an embedded text layer — documents originally created digitally in Word, InDesign, or similar tools. Scanned PDFs are essentially images and have no text layer. For those, use our <a href="/tools/pdf/ocr-pdf">OCR PDF</a> tool, which applies optical character recognition to add a searchable text layer. After running OCR, you can then extract the text.</p>

<p>If you need to retain the full formatting and structure (headings, tables, images) rather than just the raw text, consider our <a href="/tools/pdf/pdf-to-word">PDF to Word</a> converter instead.</p>

<p><strong>Privacy:</strong> Your PDF is uploaded over HTTPS and deleted from our servers within one hour. The extracted text file is generated on our secure servers and made available to you immediately for download. No account is required.</p>`,
    faqs: [
      { question: 'Why does the extracted text look garbled or incomplete?', answer: 'If the PDF is a scanned image, it has no text layer and this tool cannot extract text. Use the OCR PDF tool first to add a text layer.' },
      { question: 'Is text formatting preserved in the .txt output?', answer: 'Plain text does not support formatting. Bold, italic, font sizes, and colours are stripped. Only the raw text content and line breaks are preserved.' },
      { question: 'Will tables be extracted correctly?', answer: 'Table data is extracted as sequential rows of text. The column structure may not be perfectly preserved in plain text. For structured table extraction, use PDF to Excel.' },
      { question: 'Is the tool free?', answer: 'Yes, completely free with no account or daily limits.' },
      { question: 'What is the maximum file size?', answer: 'Up to 50 MB per PDF file.' },
      { question: 'Are my documents secure?', answer: 'Files are transmitted over HTTPS and automatically deleted from our servers within one hour.' },
      { question: 'Can I use this on mobile?', answer: 'Yes. The tool works in mobile browsers on iOS and Android.' },
      { question: 'What browsers are supported?', answer: 'Chrome, Firefox, Safari, and Edge on desktop and mobile.' },
      { question: 'How long does extraction take?', answer: 'Typically 5–15 seconds for most documents.' },
      { question: 'What encoding is the .txt file saved in?', answer: 'The output is saved as UTF-8, which supports all standard characters and most international scripts.' },
      { question: 'Can I extract text from a specific page only?', answer: 'Currently the tool extracts all pages. To extract from specific pages only, use the Extract PDF Pages tool first, then extract text from the resulting PDF.' },
    ],
    relatedToolSlugs: ['ocr-pdf', 'pdf-to-word', 'pdf-to-excel', 'extract-pdf-pages', 'flatten-pdf'],
  },

  // ─────────────────────────────────────────────────────────────
  // 16. ROTATE PDF
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'rotate-pdf',
    name: 'Rotate PDF',
    tagline: 'Fix sideways or upside-down PDF pages by rotating them 90°, 180°, or 270°.',
    metaTitle: 'Rotate PDF Free Online — Fix Page Orientation',
    metaDescription: 'Rotate PDF pages 90, 180, or 270 degrees online free. Rotate all pages or just specific ones. No signup, instant result.',
    canonicalUrl: `${BASE}/tools/pdf/rotate-pdf`,
    ratingValue: '4.7',
    reviewCount: '1654',
    howToSteps: [
      { title: 'Upload your PDF', description: 'Drop in the PDF with pages that need rotating. Multi-page documents are fully supported.' },
      { title: 'Choose rotation and pages', description: 'Select the rotation angle (90° clockwise, 180°, or 90° counter-clockwise) and optionally specify which pages to rotate (e.g. 1, 3-5). Leave blank to rotate all pages.' },
      { title: 'Download the fixed PDF', description: 'Click Rotate PDF and download your corrected document. All other page content remains untouched.' },
    ],
    aboutHTML: `<p>Scanned documents are frequently saved in the wrong orientation — a page scanned face-down appears upside down, and a landscape document scanned in portrait mode needs a 90° rotation. The <strong>Rotate PDF</strong> tool corrects page orientation errors permanently so the fixed rotation is saved into the document itself, not just applied as a viewing preference.</p>

<p>Most PDF viewers let you rotate pages during viewing, but that rotation is only temporary and resets when the file is reopened. Our tool writes the rotation directly into the PDF page metadata, meaning the corrected orientation persists in every viewer and when the document is printed.</p>

<p><strong>Rotation options:</strong></p>
<ul>
  <li><strong>90° Clockwise:</strong> Rotates the page a quarter turn to the right. Use to fix a page that is rotated 90° counter-clockwise.</li>
  <li><strong>180°:</strong> Flips the page upside down. Use to fix completely inverted pages.</li>
  <li><strong>270° (or 90° Counter-clockwise):</strong> Rotates the page a quarter turn to the left. Use to fix a page rotated 90° clockwise.</li>
</ul>

<p>You can choose to rotate all pages in one operation or specify individual pages or ranges (e.g. <em>1, 3-5, 8</em>). This is particularly useful for scanned books or reports where only certain pages were inserted incorrectly.</p>

<p>After rotating, consider running <a href="/tools/pdf/compress-pdf">Compress PDF</a> if the rotation created a noticeably larger file. If you need to make other layout adjustments, <a href="/tools/pdf/crop-pdf">Crop PDF</a> lets you trim margins from the rotated pages.</p>

<p><strong>Privacy and access:</strong> Your file is sent over HTTPS and deleted from our servers within one hour of processing. No account is required and the tool is completely free.</p>`,
    faqs: [
      { question: 'Will the rotation be permanent?', answer: 'Yes. The rotation is saved into the PDF metadata, so it persists when the file is opened in any viewer or printer.' },
      { question: 'Can I rotate only specific pages?', answer: 'Yes. Enter specific page numbers or ranges (e.g. 1, 3-5) in the pages field. Leave it blank to rotate all pages.' },
      { question: 'Does rotating affect text quality?', answer: 'No. Rotating a PDF is a metadata change — it does not re-render or recompress any content, so quality is unchanged.' },
      { question: 'Can I rotate to a specific degree, like 45°?', answer: 'PDF rotation supports 90-degree increments only (90°, 180°, 270°). Arbitrary angle rotation is not supported.' },
      { question: 'Is the tool free?', answer: 'Yes. Free with no account, no daily limit, and no watermarks.' },
      { question: 'What is the file size limit?', answer: 'Up to 50 MB per PDF.' },
      { question: 'Are my files secure?', answer: 'Files are transmitted over HTTPS and deleted from our servers within one hour.' },
      { question: 'Can I use this on mobile?', answer: 'Yes. The tool works in all major mobile browsers without any app.' },
      { question: 'What browsers are supported?', answer: 'Chrome, Firefox, Safari, and Edge on desktop and mobile.' },
      { question: 'How long does the operation take?', answer: 'Usually 5–10 seconds, regardless of the number of pages.' },
      { question: 'Can I undo the rotation after downloading?', answer: 'Simply re-upload the file and rotate in the opposite direction to reverse the change.' },
    ],
    relatedToolSlugs: ['crop-pdf', 'organize-pdf', 'compress-pdf', 'split-pdf', 'extract-pdf-pages'],
  },

  // ─────────────────────────────────────────────────────────────
  // 17. CROP PDF
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'crop-pdf',
    name: 'Crop PDF',
    tagline: 'Trim unwanted margins and whitespace from PDF pages to focus on the content.',
    metaTitle: 'Crop PDF Free Online — Trim PDF Margins',
    metaDescription: 'Crop PDF pages by trimming top, bottom, left, and right margins online free. No signup, instant download, secure processing.',
    canonicalUrl: `${BASE}/tools/pdf/crop-pdf`,
    ratingValue: '4.6',
    reviewCount: '1087',
    howToSteps: [
      { title: 'Upload your PDF', description: 'Select the PDF whose pages you want to trim. All pages will be cropped by the same amount.' },
      { title: 'Set trim amounts', description: 'Enter the number of points to trim from the top, bottom, left, and right edges (1 point ≈ 0.35 mm). Common page margins are 36–72 points.' },
      { title: 'Download the cropped PDF', description: 'Click Crop PDF and download your trimmed document. The visible content area shrinks by the specified margins.' },
    ],
    aboutHTML: `<p>Excessive whitespace around PDF content is a common nuisance — scanned documents often have large black borders, printouts have oversized margins, and presentation exports have unused space around slides. The <strong>Crop PDF</strong> tool lets you trim any combination of edges from all pages in a document to remove this wasted space.</p>

<p>PDF cropping works by adjusting the CropBox metadata value of each page. The CropBox defines which portion of the page content is visible. Trimming reduces this visible area from the specified edges, effectively hiding the margin content. It is important to understand that the underlying content is not deleted — it is merely hidden behind the new crop boundary. This means cropping is reversible by setting larger CropBox values.</p>

<p>Trim amounts are specified in points, the native unit of PDF page coordinates. Common reference values:</p>
<ul>
  <li>1 cm ≈ 28 points</li>
  <li>1 inch = 72 points</li>
  <li>Standard A4 page margin (2 cm) ≈ 57 points</li>
</ul>

<p><strong>Useful cropping scenarios:</strong></p>
<ul>
  <li>Removing black scan borders from scanned book pages</li>
  <li>Trimming printer registration marks from print-ready PDFs</li>
  <li>Cropping slide decks to remove empty space around content</li>
  <li>Standardising margins across a multi-source merged document</li>
</ul>

<p>For more complex page editing — such as reordering, removing unwanted pages, or rotating individual pages — combine cropping with our <a href="/tools/pdf/organize-pdf">Organize PDF</a> tool. If you only want to fix page orientation rather than trim content, use <a href="/tools/pdf/rotate-pdf">Rotate PDF</a> instead.</p>

<p><strong>Privacy:</strong> Your PDF is uploaded over HTTPS and deleted from our servers within one hour. The tool is completely free with no account required.</p>`,
    faqs: [
      { question: 'What unit are the crop values in?', answer: 'Crop values are in PDF points. 1 inch = 72 points, 1 cm ≈ 28 points. A typical 2 cm margin is about 57 points.' },
      { question: 'Can I crop individual pages differently?', answer: 'Currently all pages in the document are cropped by the same amount. To crop individual pages differently, split the PDF first, crop each section, then merge.' },
      { question: 'Is the cropped content permanently removed?', answer: 'No. Cropping hides content by adjusting the visible area (CropBox). The underlying content is not deleted and can be revealed by expanding the crop region.' },
      { question: 'Is the tool free?', answer: 'Yes, completely free with no account required.' },
      { question: 'What is the file size limit?', answer: 'Up to 50 MB per PDF file.' },
      { question: 'Are my files secure?', answer: 'Files are encrypted in transit and deleted from servers within one hour.' },
      { question: 'Can I crop on mobile?', answer: 'Yes. The tool works in mobile browsers without any app installation.' },
      { question: 'What browsers are supported?', answer: 'Chrome, Firefox, Safari, and Edge on desktop and mobile.' },
      { question: 'How long does cropping take?', answer: 'Typically under 10 seconds for most documents.' },
      { question: 'Will cropping affect text quality?', answer: 'No. Cropping is a metadata change — it does not re-render content, so text and image quality are unchanged.' },
    ],
    relatedToolSlugs: ['rotate-pdf', 'organize-pdf', 'compress-pdf', 'remove-pdf-pages', 'split-pdf'],
  },

  // ─────────────────────────────────────────────────────────────
  // 18. EXTRACT PDF PAGES
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'extract-pdf-pages',
    name: 'Extract PDF Pages',
    tagline: 'Pull out exactly the pages you need from a PDF and save them as a new document.',
    metaTitle: 'Extract PDF Pages Free Online — Save Specific Pages',
    metaDescription: 'Extract specific pages from a PDF online free. Enter page numbers or ranges to save as a new PDF. No signup, secure, instant.',
    canonicalUrl: `${BASE}/tools/pdf/extract-pdf-pages`,
    ratingValue: '4.7',
    reviewCount: '1876',
    howToSteps: [
      { title: 'Upload your PDF', description: 'Select the source PDF from which you want to extract pages.' },
      { title: 'Specify the pages', description: 'Enter the page numbers you want to keep (e.g. 1, 3, 5-8). Use commas for individual pages and hyphens for ranges.' },
      { title: 'Download the extracted PDF', description: 'Click Extract Pages and download a new PDF containing only the pages you selected, in the order specified.' },
    ],
    aboutHTML: `<p>The <strong>Extract PDF Pages</strong> tool creates a new PDF document containing only the specific pages you choose from the original. This is different from splitting a PDF at fixed intervals — extraction gives you precise control, letting you grab exactly pages 2, 5, and 8–12 from a 50-page document without affecting anything else.</p>

<p>Page selection uses a simple comma-and-range notation familiar from printer dialogs: enter individual page numbers separated by commas, use a hyphen to specify ranges, or combine both (e.g. <em>1, 3, 7-9, 15</em>). Pages are extracted in the order you specify, so entering <em>5, 1, 3</em> produces a three-page PDF with page 5 first, then page 1, then page 3.</p>

<p><strong>Common extraction use cases:</strong></p>
<ul>
  <li>Pulling a single chapter from a lengthy technical manual</li>
  <li>Extracting only the signed pages from a contract</li>
  <li>Creating a highlights document from a long report</li>
  <li>Isolating a specific form page from a bundle of documents</li>
  <li>Grabbing appendix pages to share separately</li>
</ul>

<p>The extracted PDF preserves all content of the selected pages at full quality — text, images, hyperlinks, and annotations are all retained. The pages come from the original document without any re-encoding.</p>

<p>If you want to do the opposite — keep most of the document and remove just a few unwanted pages — our <a href="/tools/pdf/remove-pdf-pages">Remove PDF Pages</a> tool is more efficient. To split a document at regular intervals rather than picking specific pages, use <a href="/tools/pdf/split-pdf">Split PDF</a>.</p>

<p><strong>Security:</strong> Uploaded files are processed over HTTPS and deleted within one hour. No account is required and the tool is completely free.</p>`,
    faqs: [
      { question: 'What page number format should I use?', answer: 'Use commas for individual pages (e.g. 1, 3, 7) and hyphens for ranges (e.g. 5-10). You can combine both: 1, 3, 5-8, 12.' },
      { question: 'Can I extract pages in a custom order?', answer: 'Yes. Pages are extracted in the order you specify. Entering 5, 1, 3 produces a PDF with page 5 first.' },
      { question: 'Is content quality preserved?', answer: 'Yes. Pages are extracted directly from the original without re-encoding. Quality is identical to the source.' },
      { question: 'What is the difference between Extract Pages and Split PDF?', answer: 'Extract Pages lets you choose specific pages by number. Split PDF divides the document at split points into sequential chunks.' },
      { question: 'Is the tool free?', answer: 'Yes. No account, no subscription, and no watermarks on the output.' },
      { question: 'What is the file size limit?', answer: 'Up to 50 MB per PDF file.' },
      { question: 'Are my files secure?', answer: 'Files are transmitted over HTTPS and automatically deleted within one hour.' },
      { question: 'Can I use this on mobile?', answer: 'Yes. Works in all major mobile browsers without any app.' },
      { question: 'What browsers are supported?', answer: 'Chrome, Firefox, Safari, and Edge on desktop and mobile.' },
      { question: 'How long does extraction take?', answer: 'Usually under 10 seconds regardless of how many pages you extract.' },
    ],
    relatedToolSlugs: ['split-pdf', 'remove-pdf-pages', 'organize-pdf', 'merge-pdf', 'rotate-pdf'],
  },

  // ─────────────────────────────────────────────────────────────
  // 19. REMOVE PDF PAGES
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'remove-pdf-pages',
    name: 'Remove PDF Pages',
    tagline: 'Delete unwanted, blank, or duplicate pages from a PDF and save the cleaned document.',
    metaTitle: 'Remove PDF Pages Free Online — Delete Pages from PDF',
    metaDescription: 'Delete specific pages from a PDF online free. Enter page numbers to remove. Fast, secure, no signup, no watermark.',
    canonicalUrl: `${BASE}/tools/pdf/remove-pdf-pages`,
    ratingValue: '4.7',
    reviewCount: '1543',
    howToSteps: [
      { title: 'Upload your PDF', description: 'Select the PDF that has pages you want to delete.' },
      { title: 'Enter pages to remove', description: 'Type the page numbers you want deleted (e.g. 2, 5, 8-10). All other pages will be kept in the output.' },
      { title: 'Download the cleaned PDF', description: 'Click Remove Pages and download the PDF with those pages permanently removed.' },
    ],
    aboutHTML: `<p>When a PDF contains blank pages from scanning, duplicate cover pages, or outdated sections you no longer need, the <strong>Remove PDF Pages</strong> tool lets you delete precisely those pages without touching the rest of the document. The result is a clean, smaller PDF without the clutter.</p>

<p>Page removal is the complement of page extraction. Instead of specifying which pages to keep, you specify which pages to delete. All other pages remain in their original order. For example, entering <em>1, 3, 7</em> into a 10-page document produces a 7-page output with pages 2, 4, 5, 6, 8, 9, and 10.</p>

<p><strong>When to remove pages rather than extract:</strong></p>
<ul>
  <li>Your document has only a few unwanted pages and most of it is worth keeping</li>
  <li>Blank pages inserted by a duplex scanner need to be stripped</li>
  <li>A merged PDF has duplicate cover pages that appeared during the merge</li>
  <li>Confidential appendix pages need to be stripped before distributing the main report</li>
</ul>

<p>The page removal operation is non-destructive to the remaining pages — content, annotations, hyperlinks, and fonts in the pages you keep are preserved at full quality.</p>

<p>After removing pages you may want to renumber the remaining pages using our <a href="/tools/pdf/add-page-numbers">Add Page Numbers</a> tool so the pagination reflects the new document structure. If you need to reorganise the remaining pages, <a href="/tools/pdf/organize-pdf">Organize PDF</a> lets you reorder them.</p>

<p><strong>Privacy:</strong> Your PDF is transmitted over HTTPS and deleted from our servers within one hour. The tool is free with no account required.</p>`,
    faqs: [
      { question: 'How do I specify which pages to remove?', answer: 'Enter page numbers separated by commas for individual pages (e.g. 1, 3) and hyphens for ranges (e.g. 5-8). You can combine both.' },
      { question: 'What happens to the remaining pages?', answer: 'All pages not in your removal list are kept in their original order and packaged into the output PDF.' },
      { question: 'Is this different from Extract PDF Pages?', answer: 'Yes. Remove Pages keeps everything except what you list. Extract Pages keeps only what you list. Choose based on which is shorter to specify.' },
      { question: 'Is the tool free?', answer: 'Yes. Free with no account and no watermarks.' },
      { question: 'What is the maximum file size?', answer: 'Up to 50 MB per PDF file.' },
      { question: 'Are my files secure?', answer: 'Files are transmitted over HTTPS and deleted from servers within one hour.' },
      { question: 'Can I use this on mobile?', answer: 'Yes. Works in mobile browsers without any app.' },
      { question: 'What browsers are supported?', answer: 'Chrome, Firefox, Safari, and Edge on desktop and mobile.' },
      { question: 'How long does it take?', answer: 'Usually under 10 seconds.' },
      { question: 'Will removing pages affect the quality of the remaining pages?', answer: 'No. Remaining pages are carried over from the original without any recompression.' },
    ],
    relatedToolSlugs: ['extract-pdf-pages', 'organize-pdf', 'split-pdf', 'add-page-numbers', 'compress-pdf'],
  },

  // ─────────────────────────────────────────────────────────────
  // 20. ORGANIZE PDF
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'organize-pdf',
    name: 'Organize PDF',
    tagline: 'Reorder pages in any sequence to restructure your PDF document exactly as needed.',
    metaTitle: 'Organize PDF Free Online — Reorder PDF Pages',
    metaDescription: 'Reorder pages in a PDF online free. Enter a new page order to rearrange your document instantly. No signup, no watermark.',
    canonicalUrl: `${BASE}/tools/pdf/organize-pdf`,
    ratingValue: '4.6',
    reviewCount: '1198',
    howToSteps: [
      { title: 'Upload your PDF', description: 'Select the PDF whose pages you want to rearrange.' },
      { title: 'Enter the new page order', description: 'Type the page numbers in your desired sequence (e.g. 3, 1, 2, 4). Every page number must appear exactly once.' },
      { title: 'Download the reorganised PDF', description: 'Click Organize & Save to receive your PDF with pages in the new order you specified.' },
    ],
    aboutHTML: `<p>Sometimes a PDF document needs structural reorganisation — perhaps you merged files in the wrong order, scanned pages arrived out of sequence, or a report needs to be restructured to lead with an executive summary. The <strong>Organize PDF</strong> tool lets you reorder pages into any sequence without splitting and re-merging multiple files.</p>

<p>To rearrange pages, upload your document and enter the new page order as a comma-separated list of page numbers. For a five-page document, entering <em>3, 1, 2, 4, 5</em> moves page 3 to the front, then places page 1, page 2, and so on. Every page number in the original document must appear in your list exactly once — pages cannot be duplicated or omitted through this tool (use <a href="/tools/pdf/remove-pdf-pages">Remove PDF Pages</a> to delete unwanted pages separately).</p>

<p><strong>Organising scenarios:</strong></p>
<ul>
  <li>Moving an executive summary to the front of a report</li>
  <li>Resequencing scanned book pages that arrived out of order</li>
  <li>Restructuring a proposal to lead with pricing before methodology</li>
  <li>Interleaving odd and even pages from a duplex scan that split into two files</li>
</ul>

<p>The page reordering operation preserves all content at full quality. Hyperlinks, annotations, bookmarks pointing to specific pages, and embedded fonts are all maintained. Note that bookmarks pointing to page numbers will reference the pages as they appear in the new order — if accurate bookmark navigation is critical, update them after reordering.</p>

<p>For a more comprehensive page management workflow, combine Organize PDF with <a href="/tools/pdf/extract-pdf-pages">Extract PDF Pages</a> and <a href="/tools/pdf/merge-pdf">Merge PDF</a> to build entirely new document structures from existing materials.</p>

<p><strong>Security:</strong> Files are processed over HTTPS and deleted within one hour. No account is required.</p>`,
    faqs: [
      { question: 'How do I enter the new page order?', answer: 'Type page numbers separated by commas in the sequence you want (e.g. 3, 1, 2, 4, 5). Every page number must appear exactly once.' },
      { question: 'Can I duplicate a page using Organize PDF?', answer: 'No. Each page must appear exactly once. To duplicate pages, use Merge PDF to combine the document with itself and then reorder.' },
      { question: 'Will reordering affect page content quality?', answer: 'No. Pages are moved without re-encoding. All content quality is preserved.' },
      { question: 'What happens to bookmarks after reordering?', answer: 'Bookmarks that reference absolute page numbers will now point to different content. Review and update bookmarks in a PDF editor if needed.' },
      { question: 'Is the tool free?', answer: 'Yes. Free with no account, no daily limits.' },
      { question: 'What is the file size limit?', answer: 'Up to 50 MB per file.' },
      { question: 'Are my files secure?', answer: 'Files are transmitted over HTTPS and deleted from servers within one hour.' },
      { question: 'Can I use this on mobile?', answer: 'Yes. The tool is mobile-responsive and works in all major browsers.' },
      { question: 'What browsers are supported?', answer: 'Chrome, Firefox, Safari, and Edge.' },
      { question: 'How long does reordering take?', answer: 'Usually under 10 seconds.' },
    ],
    relatedToolSlugs: ['remove-pdf-pages', 'extract-pdf-pages', 'merge-pdf', 'split-pdf', 'rotate-pdf'],
  },

  // ─────────────────────────────────────────────────────────────
  // 21. ADD PAGE NUMBERS
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'add-page-numbers',
    name: 'Add Page Numbers',
    tagline: 'Stamp professional page numbers onto every page of your PDF in the position you choose.',
    metaTitle: 'Add Page Numbers to PDF Free Online',
    metaDescription: 'Add page numbers to a PDF online free. Choose position, starting number, and style. Instant, no signup, no watermark.',
    canonicalUrl: `${BASE}/tools/pdf/add-page-numbers`,
    ratingValue: '4.7',
    reviewCount: '1432',
    howToSteps: [
      { title: 'Upload your PDF', description: 'Select the PDF that needs page numbers added.' },
      { title: 'Configure the numbering', description: 'Choose the position (bottom center, bottom right, etc.) and the starting page number (default is 1).' },
      { title: 'Download the numbered PDF', description: 'Click Add Page Numbers and download your PDF with clean, professional page numbering.' },
    ],
    aboutHTML: `<p>Long PDF documents without page numbers are difficult to reference in conversations, meetings, and reviews. The <strong>Add Page Numbers</strong> tool stamps clean, professional page numbers onto every page of your PDF so readers can navigate and reference sections easily.</p>

<p>Page numbers are rendered directly onto each page as a text overlay at the position you choose. The numbering style uses clean Arabic numerals by default. You can configure the starting number — useful when the PDF is a chapter in a larger document and needs to start at page 47 rather than page 1.</p>

<p><strong>Position options:</strong></p>
<ul>
  <li><strong>Bottom Center:</strong> The most universally readable position for page numbers. Default and recommended.</li>
  <li><strong>Bottom Right:</strong> Traditional document style, aligns with the right margin.</li>
  <li><strong>Bottom Left:</strong> Suitable for right-to-left reading documents.</li>
  <li><strong>Top Center / Top Right:</strong> Used in headers rather than footers.</li>
</ul>

<p>The page number overlay is added using the same PDF content stream as the rest of the page, meaning it appears in all viewers and prints correctly. The font is embedded to ensure consistent appearance across platforms.</p>

<p>If you are preparing a professional report, consider also adding a <a href="/tools/pdf/add-watermark">text watermark</a> such as "Draft" or "Confidential" in combination with page numbers. For a finalised document, you might want to <a href="/tools/pdf/protect-pdf">protect the PDF</a> to prevent further edits after numbering.</p>

<p><strong>Privacy:</strong> Files are processed on our secure servers and deleted within one hour. The tool is completely free with no account required.</p>`,
    faqs: [
      { question: 'Where are page numbers positioned?', answer: 'You can choose bottom center (default), bottom right, bottom left, top center, or top right.' },
      { question: 'Can I start numbering from a number other than 1?', answer: 'Yes. Set the starting number to any value (e.g. 47 if this PDF is a chapter continuing from another document).' },
      { question: 'Can I exclude the first page from numbering?', answer: 'Currently all pages receive numbers. To skip the cover page, consider numbering from 0 so the cover shows 0 or use a PDF editor for selective numbering.' },
      { question: 'Is the tool free?', answer: 'Yes. Free with no account required.' },
      { question: 'What is the file size limit?', answer: 'Up to 50 MB per PDF file.' },
      { question: 'Are my files secure?', answer: 'Files are transmitted over HTTPS and deleted within one hour.' },
      { question: 'Can I use this on mobile?', answer: 'Yes. Works in mobile browsers without any app.' },
      { question: 'What browsers are supported?', answer: 'Chrome, Firefox, Safari, and Edge on desktop and mobile.' },
      { question: 'How long does the operation take?', answer: 'Usually 5–15 seconds depending on document length.' },
      { question: 'Will page numbers appear when the PDF is printed?', answer: 'Yes. Page numbers are embedded in the PDF content and appear in all viewers and when printed.' },
    ],
    relatedToolSlugs: ['add-watermark', 'protect-pdf', 'organize-pdf', 'merge-pdf', 'compress-pdf'],
  },

  // ─────────────────────────────────────────────────────────────
  // 22. ADD WATERMARK
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'add-watermark',
    name: 'Add Watermark',
    tagline: 'Stamp a text watermark onto every page of your PDF to mark it as confidential, draft, or branded.',
    metaTitle: 'Add Watermark to PDF Free Online',
    metaDescription: 'Add a text watermark to PDF online free. Customise position, opacity, and text. Instant download, no signup, secure.',
    canonicalUrl: `${BASE}/tools/pdf/add-watermark`,
    ratingValue: '4.6',
    reviewCount: '1321',
    howToSteps: [
      { title: 'Upload your PDF', description: 'Select the PDF you want to watermark.' },
      { title: 'Set watermark text and style', description: 'Enter your watermark text (e.g. CONFIDENTIAL, DRAFT), choose the opacity (10%–80%), and select the position.' },
      { title: 'Download the watermarked PDF', description: 'Click Add Watermark and download your PDF with the watermark applied to every page.' },
    ],
    aboutHTML: `<p>Watermarks serve as visual indicators of a document's status, ownership, or distribution restrictions. The <strong>Add Watermark</strong> tool stamps your chosen text onto every page of your PDF at a specified opacity and position — making it immediately clear whether a document is a draft, confidential, for review only, or proprietary to your organisation.</p>

<p>The watermark text is rendered as a semi-transparent overlay directly in the PDF content layer. This means it appears in all viewers, renders when printed, and cannot be removed simply by taking a screenshot (unlike watermarks applied only as a visual layer in some tools). You control opacity from 10% (barely visible) to 80% (prominent).</p>

<p><strong>Position options:</strong></p>
<ul>
  <li><strong>Center (diagonal):</strong> The classic diagonal watermark style, covering the full page. Most recognisable and hardest to ignore.</li>
  <li><strong>Top:</strong> Placed at the top of each page, less obstructive to body content.</li>
  <li><strong>Bottom:</strong> Footer-style watermark for subtle branding or status marking.</li>
</ul>

<p><strong>Typical watermark uses:</strong></p>
<ul>
  <li>"DRAFT" to indicate a document is not yet final</li>
  <li>"CONFIDENTIAL" to restrict distribution of sensitive reports</li>
  <li>"FOR REVIEW ONLY" on external reviewer copies</li>
  <li>Company name for branded document distribution</li>
  <li>"SAMPLE" on preview versions of paid content</li>
</ul>

<p>Watermarks added by this tool are embedded in the PDF and appear in all PDF viewers and when printed. They are not encrypted — determined users with PDF editing software could potentially remove them. For document security beyond watermarking, combine with <a href="/tools/pdf/protect-pdf">password protection</a>. To add sequential page numbers alongside the watermark, use <a href="/tools/pdf/add-page-numbers">Add Page Numbers</a> as a separate step.</p>

<p><strong>Privacy:</strong> Files are uploaded over HTTPS and deleted within one hour. The tool is free with no account required.</p>`,
    faqs: [
      { question: 'Can the watermark be removed by recipients?', answer: 'The watermark is embedded in the PDF content layer, not just a visual overlay. It cannot be removed by simply viewing the file, but someone with PDF editing software could attempt to remove it. For maximum security, combine watermarking with password protection.' },
      { question: 'What opacity should I use?', answer: '30% opacity (default) is recommended — clearly visible but not so heavy that it obscures the underlying content. Choose 10% for subtle branding and 50%–80% for prominent warnings.' },
      { question: 'Can I add an image watermark?', answer: 'Currently the tool supports text watermarks only. Image watermarks (e.g. company logos) are not yet supported.' },
      { question: 'Is the tool free?', answer: 'Yes. Free with no account or daily limits.' },
      { question: 'What is the file size limit?', answer: 'Up to 50 MB per PDF file.' },
      { question: 'Are my files secure?', answer: 'Files are transmitted over HTTPS and deleted within one hour.' },
      { question: 'Can I use this on mobile?', answer: 'Yes. Works in mobile browsers without any app.' },
      { question: 'What browsers are supported?', answer: 'Chrome, Firefox, Safari, and Edge on desktop and mobile.' },
      { question: 'How long does it take?', answer: 'Usually 5–15 seconds.' },
      { question: 'Will the watermark appear when I print the PDF?', answer: 'Yes. The watermark is embedded in the page content and appears in all viewers and when printed.' },
    ],
    relatedToolSlugs: ['protect-pdf', 'add-page-numbers', 'sign-pdf', 'compress-pdf', 'redact-pdf'],
  },

  // ─────────────────────────────────────────────────────────────
  // 23. PDF TO PDF/A
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'pdf-to-pdfa',
    name: 'PDF to PDF/A',
    tagline: 'Convert any PDF to the PDF/A archival format required for long-term storage and compliance.',
    metaTitle: 'PDF to PDF/A Free Online — Convert for Archiving',
    metaDescription: 'Convert PDF to PDF/A archival format online free. Meets ISO 19005 standards for long-term document preservation. No signup.',
    canonicalUrl: `${BASE}/tools/pdf/pdf-to-pdfa`,
    ratingValue: '4.6',
    reviewCount: '987',
    howToSteps: [
      { title: 'Upload your PDF', description: 'Select the PDF file you need to convert to PDF/A for archival or compliance purposes.' },
      { title: 'Convert to PDF/A', description: 'Click Convert to PDF/A. The tool embeds all fonts, converts colour profiles, and removes elements not permitted by the PDF/A standard.' },
      { title: 'Download the PDF/A file', description: 'Download your archival PDF. It is now suitable for submission to compliance systems that require PDF/A.' },
    ],
    aboutHTML: `<p>PDF/A is an ISO-standardised subset of the PDF format designed specifically for long-term digital preservation. Unlike regular PDFs, a <strong>PDF/A</strong> document is self-contained: all fonts are fully embedded, colour profiles are explicitly defined, external content references are prohibited, and dynamic elements like JavaScript, audio, and video are disallowed. This ensures the document will render identically decades from now on any conforming reader.</p>

<p>Our <strong>PDF to PDF/A</strong> converter transforms a standard PDF into a PDF/A-1b compliant document, which is the most widely accepted archival sub-standard. The conversion process:</p>
<ul>
  <li>Embeds all fonts that are not already embedded</li>
  <li>Converts or assigns output intent ICC colour profiles</li>
  <li>Removes JavaScript, embedded movies, audio, and 3D content</li>
  <li>Strips encryption and access restrictions</li>
  <li>Adds required XMP metadata fields (document ID, conformance level)</li>
</ul>

<p><strong>Who needs PDF/A conversion:</strong></p>
<ul>
  <li>Legal firms submitting documents to courts with PDF/A requirements</li>
  <li>Government agencies following digital records management mandates</li>
  <li>Healthcare organisations archiving patient records</li>
  <li>Businesses maintaining long-term contract archives</li>
  <li>Libraries and archives preserving digital collections</li>
</ul>

<p>Note that conversion may alter some aspects of a document — if the original relies on embedded multimedia or JavaScript interactivity, those elements will be removed to meet the standard. Review the output document to confirm it meets your needs.</p>

<p>If you need to first ensure your document is in optimal shape before archiving, consider running it through <a href="/tools/pdf/compress-pdf">Compress PDF</a> to reduce its size, or <a href="/tools/pdf/repair-pdf">Repair PDF</a> if the document has structural issues.</p>

<p><strong>Privacy:</strong> Files are encrypted in transit and deleted within one hour. The tool is free with no account needed.</p>`,
    faqs: [
      { question: 'What is PDF/A?', answer: 'PDF/A is an ISO standard (ISO 19005) for archival PDFs. It ensures the document is self-contained with all fonts embedded, proper colour profiles, and no dynamic content — guaranteeing long-term readability.' },
      { question: 'Which PDF/A variant does the tool create?', answer: 'The tool creates PDF/A-1b documents, which is the most widely accepted archival conformance level for general-purpose archiving.' },
      { question: 'Will my document look different after conversion?', answer: 'For most documents, the visual appearance is identical. Documents with multimedia, JavaScript, or transparency may look slightly different as those elements are removed or flattened.' },
      { question: 'Is the tool free?', answer: 'Yes. Completely free with no account required.' },
      { question: 'What is the file size limit?', answer: 'Up to 50 MB per PDF file.' },
      { question: 'Are my files secure?', answer: 'Files are transmitted over HTTPS and deleted within one hour. We never access the content of your documents.' },
      { question: 'Can I use this on mobile?', answer: 'Yes. Works in mobile browsers on iOS and Android.' },
      { question: 'What browsers are supported?', answer: 'Chrome, Firefox, Safari, and Edge on desktop and mobile.' },
      { question: 'How long does conversion take?', answer: 'Typically 10–30 seconds depending on file complexity.' },
      { question: 'Can encrypted PDFs be converted to PDF/A?', answer: 'PDF/A does not allow encryption. If your PDF is encrypted, remove the encryption with the Unlock PDF tool first, then convert.' },
    ],
    relatedToolSlugs: ['repair-pdf', 'compress-pdf', 'protect-pdf', 'flatten-pdf', 'ocr-pdf'],
  },

  // ─────────────────────────────────────────────────────────────
  // 24. REPAIR PDF
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'repair-pdf',
    name: 'Repair PDF',
    tagline: 'Recover and fix corrupted or damaged PDF files that fail to open or display correctly.',
    metaTitle: 'Repair PDF Free Online — Fix Corrupted PDF Files',
    metaDescription: 'Repair corrupted or damaged PDF files online free. Recover content from broken PDFs automatically. No signup, secure, instant.',
    canonicalUrl: `${BASE}/tools/pdf/repair-pdf`,
    ratingValue: '4.5',
    reviewCount: '876',
    howToSteps: [
      { title: 'Upload the damaged PDF', description: 'Select the corrupted or broken PDF file. Even partially readable files may be recoverable.' },
      { title: 'Run the repair', description: 'Click Repair PDF. The tool analyses the file structure, rebuilds cross-reference tables, and attempts to recover all accessible page content.' },
      { title: 'Download the repaired file', description: 'Download the repaired PDF. Compare it with the original to verify how much content was recovered.' },
    ],
    aboutHTML: `<p>PDF files can become corrupted in many ways: a failed download, a storage device error, an abrupt power cut during saving, email attachment truncation, or file system damage. A corrupted PDF may refuse to open, show garbled content, or cause your viewer to crash. The <strong>Repair PDF</strong> tool attempts to reconstruct the file structure and recover as much readable content as possible.</p>

<p>PDF files have a specific internal structure including a header, object streams, cross-reference tables, and a trailer. When any of these structural components are damaged, PDF readers fail to parse the file correctly. Our repair engine:</p>
<ul>
  <li>Rebuilds missing or damaged cross-reference tables from available object data</li>
  <li>Recovers page objects even when the main page tree is broken</li>
  <li>Reconstructs the document catalog and metadata where possible</li>
  <li>Strips malformed objects that prevent rendering</li>
</ul>

<p><strong>Types of damage the tool can address:</strong></p>
<ul>
  <li>Truncated files (download cut off before completion)</li>
  <li>Damaged cross-reference tables caused by storage errors</li>
  <li>Header corruption from partial file overwrites</li>
  <li>Object stream errors from failed incremental saves</li>
</ul>

<p><strong>Limitations:</strong> If the actual page content data (image streams, font data) is physically overwritten or encrypted with unknown keys, that content cannot be recovered. The tool can only recover what structurally exists in the damaged file.</p>

<p>After repair, it is a good practice to immediately create a backup copy of the recovered file. You may also want to convert it to <a href="/tools/pdf/pdf-to-pdfa">PDF/A format</a> for more robust long-term storage going forward.</p>

<p><strong>Privacy:</strong> Uploaded files are processed on isolated servers over HTTPS and deleted within one hour. No account is required.</p>`,
    faqs: [
      { question: 'What causes PDF corruption?', answer: 'Common causes include interrupted downloads, storage device failures, power cuts during saving, email attachment truncation, and file system errors.' },
      { question: 'Can all corrupted PDFs be repaired?', answer: 'Not always. If the actual content data is physically destroyed rather than just the file structure, full recovery may not be possible. The tool recovers what is structurally accessible.' },
      { question: 'Will all my original pages be recovered?', answer: 'Recovery depends on the extent of damage. Structural corruption often allows full page recovery. Physical data loss recovers only the intact portions.' },
      { question: 'Is the tool free?', answer: 'Yes. Free with no account or usage limits.' },
      { question: 'What is the file size limit?', answer: 'Up to 50 MB per file.' },
      { question: 'Are my files secure?', answer: 'Files are transmitted over HTTPS and deleted within one hour of processing.' },
      { question: 'Can I use this on mobile?', answer: 'Yes. Works in mobile browsers on iOS and Android.' },
      { question: 'What browsers are supported?', answer: 'Chrome, Firefox, Safari, and Edge on desktop and mobile.' },
      { question: 'How long does repair take?', answer: 'Usually 10–30 seconds. Severely corrupted files may take slightly longer.' },
      { question: 'What should I do if repair does not work?', answer: 'Check if you have a backup copy. Try opening the file in a different PDF reader. Some files with physical sector damage may be unrecoverable.' },
    ],
    relatedToolSlugs: ['pdf-to-pdfa', 'compress-pdf', 'flatten-pdf', 'unlock-pdf', 'ocr-pdf'],
  },

  // ─────────────────────────────────────────────────────────────
  // 25. UNLOCK PDF
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'unlock-pdf',
    name: 'Unlock PDF',
    tagline: 'Remove password protection from a PDF you own so you can open it freely without a password.',
    metaTitle: 'Unlock PDF Free Online — Remove PDF Password',
    metaDescription: 'Remove password protection from a PDF online free. Enter the current password to unlock and download an unrestricted copy. No signup.',
    canonicalUrl: `${BASE}/tools/pdf/unlock-pdf`,
    ratingValue: '4.7',
    reviewCount: '1654',
    howToSteps: [
      { title: 'Upload the password-protected PDF', description: 'Select the locked PDF file you want to unlock.' },
      { title: 'Enter the current password', description: 'Type the existing password that currently protects the document. This confirms you are authorised to unlock it.' },
      { title: 'Download the unlocked PDF', description: 'Click Unlock PDF and download an identical copy of the document without any password requirement.' },
    ],
    aboutHTML: `<p>Entering a password every time you open a PDF you own becomes tedious — especially for documents you access daily. The <strong>Unlock PDF</strong> tool removes the open-password restriction from a PDF, creating a freely accessible copy that no longer prompts for a password when opened.</p>

<p>PDF password protection works in two ways. An <em>open password</em> (also called a user password) prevents the document from being opened without the correct passphrase. A <em>permissions password</em> (owner password) restricts operations like printing, copying text, or editing. This tool removes the open password that blocks access to the document. You must provide the existing correct password to verify that you are authorised to unlock the file.</p>

<p><strong>Common reasons to unlock a PDF:</strong></p>
<ul>
  <li>Removing the password from a document you created yourself so you do not need to type it every time</li>
  <li>Preparing a file for merging with other PDFs (most merge tools require unlocked inputs)</li>
  <li>Archiving a document in a password-free format for long-term storage</li>
  <li>Printing a password-protected file you received with authorisation</li>
</ul>

<p><strong>Important note:</strong> This tool is intended for legitimate use — removing passwords from documents you have the right to access. It does not bypass encryption on files you do not have the password for and should not be used to circumvent security on documents owned by others.</p>

<p>After unlocking, if you want to merge the document with others, use <a href="/tools/pdf/merge-pdf">Merge PDF</a>. To add new protection with a different password, use <a href="/tools/pdf/protect-pdf">Protect PDF</a>.</p>

<p><strong>Privacy:</strong> Your password is sent over HTTPS and used only for the decryption operation. It is never stored or logged. Files are deleted within one hour.</p>`,
    faqs: [
      { question: 'Do I need to know the current password?', answer: 'Yes. You must provide the current correct password to unlock the PDF. The tool does not crack or bypass unknown passwords.' },
      { question: 'What type of password protection is removed?', answer: 'The tool removes the open-document (user) password. Permissions restrictions may also be lifted depending on the PDF security settings.' },
      { question: 'Is this legal?', answer: 'Removing a password from a document you own or have permission to access is legal. Using this tool on documents you do not have authorisation to unlock may violate terms of service or law.' },
      { question: 'Is the tool free?', answer: 'Yes. Free with no account required.' },
      { question: 'What is the file size limit?', answer: 'Up to 50 MB per file.' },
      { question: 'Is my password secure?', answer: 'Your password is transmitted over HTTPS and used only for decryption. It is not stored, logged, or associated with your file after processing. The file is deleted within one hour.' },
      { question: 'Can I use this on mobile?', answer: 'Yes. Works in mobile browsers without any app.' },
      { question: 'What browsers are supported?', answer: 'Chrome, Firefox, Safari, and Edge on desktop and mobile.' },
      { question: 'How long does unlocking take?', answer: 'Usually under 10 seconds.' },
      { question: 'Can I re-lock the PDF with a new password after unlocking?', answer: 'Yes. Download the unlocked file and run it through our Protect PDF tool to set a new password.' },
    ],
    relatedToolSlugs: ['protect-pdf', 'merge-pdf', 'sign-pdf', 'compress-pdf', 'pdf-to-pdfa'],
  },

  // ─────────────────────────────────────────────────────────────
  // 26. PROTECT PDF
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'protect-pdf',
    name: 'Protect PDF',
    tagline: 'Add a password to your PDF to control who can open it and what they can do with it.',
    metaTitle: 'Protect PDF Free Online — Add Password to PDF',
    metaDescription: 'Password-protect a PDF online free. Set open password and permission restrictions. Instant, no signup, files deleted after 1 hour.',
    canonicalUrl: `${BASE}/tools/pdf/protect-pdf`,
    ratingValue: '4.7',
    reviewCount: '1543',
    howToSteps: [
      { title: 'Upload your PDF', description: 'Select the PDF you want to protect with a password.' },
      { title: 'Set the password and permissions', description: 'Enter a password and choose what recipients can do: view only, allow printing, allow copying, or allow all operations.' },
      { title: 'Download the protected PDF', description: 'Click Protect PDF and download the password-protected file. Share it knowing only those with the password can open it.' },
    ],
    aboutHTML: `<p>Sensitive documents — contracts, financial reports, medical records, personal statements — should not be sent as open PDFs that anyone who intercepts the email can read. The <strong>Protect PDF</strong> tool adds AES-based password encryption to your PDF, ensuring that only recipients who know the password can open the document.</p>

<p>PDF password protection operates at two levels. The <em>open password</em> prevents the file from being opened without the correct passphrase — this is what most people mean when they say a PDF is "password protected." The <em>permissions settings</em> restrict what an authorised reader can do with the content, such as preventing printing, copying text, or extracting pages. You can set both levels independently.</p>

<p><strong>Permission options:</strong></p>
<ul>
  <li><strong>No permissions (view only):</strong> Recipients can read the document but cannot print, copy text, or make modifications.</li>
  <li><strong>Allow printing:</strong> Recipients can print the document but cannot copy text or edit it.</li>
  <li><strong>Allow copying:</strong> Recipients can select and copy text in addition to reading.</li>
  <li><strong>Allow all:</strong> No restrictions beyond the open-password requirement.</li>
</ul>

<p><strong>Best practices for PDF passwords:</strong> Use a strong password of at least 12 characters combining upper and lowercase letters, numbers, and symbols. Share the password through a separate channel (phone call or messaging app) rather than in the same email as the PDF. For maximum security, also add a watermark with our <a href="/tools/pdf/add-watermark">Add Watermark</a> tool so even if the password is compromised, the document is visually marked.</p>

<p>To remove protection from a PDF you own, use <a href="/tools/pdf/unlock-pdf">Unlock PDF</a>.</p>

<p><strong>Privacy:</strong> Your password is transmitted over HTTPS and used only to encrypt the document. It is never logged or stored. Files are deleted within one hour.</p>`,
    faqs: [
      { question: 'What encryption does the password protection use?', answer: 'The tool uses 128-bit AES encryption, which is the standard for PDF security and compatible with all modern PDF readers.' },
      { question: 'Can I set different permissions for different recipients?', answer: 'You can only apply one set of permissions per protected PDF. To give different access levels, create two separate protected versions with different permission settings.' },
      { question: 'What happens if a recipient forgets the password?', answer: 'Without the password, the document cannot be opened. Keep a copy of the password in a secure password manager.' },
      { question: 'Is the tool free?', answer: 'Yes. Free with no account required.' },
      { question: 'What is the file size limit?', answer: 'Up to 50 MB per file.' },
      { question: 'Is my password stored on your servers?', answer: 'No. Your password is used only during the encryption process and is not logged or stored.' },
      { question: 'Can I use this on mobile?', answer: 'Yes. Works in all major mobile browsers.' },
      { question: 'What browsers are supported?', answer: 'Chrome, Firefox, Safari, and Edge on desktop and mobile.' },
      { question: 'How long does the operation take?', answer: 'Usually under 10 seconds.' },
      { question: 'Can I protect a PDF that is already password-protected?', answer: 'Unlock the existing protection first using the Unlock PDF tool, then re-protect with a new password.' },
    ],
    relatedToolSlugs: ['unlock-pdf', 'add-watermark', 'sign-pdf', 'redact-pdf', 'compress-pdf'],
  },

  // ─────────────────────────────────────────────────────────────
  // 27. SIGN PDF
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'sign-pdf',
    name: 'Sign PDF',
    tagline: 'Add your electronic signature to a PDF document without printing or scanning.',
    metaTitle: 'Sign PDF Free Online — Add Electronic Signature',
    metaDescription: 'Add an electronic signature to a PDF online free. Type your name, choose position and page. Instant, no signup, secure.',
    canonicalUrl: `${BASE}/tools/pdf/sign-pdf`,
    ratingValue: '4.7',
    reviewCount: '2109',
    howToSteps: [
      { title: 'Upload the PDF to sign', description: 'Select the document that requires your signature.' },
      { title: 'Enter your signature details', description: 'Type your full name as your electronic signature and choose the position on the page (bottom right is standard).' },
      { title: 'Download the signed PDF', description: 'Click Sign PDF and download the document with your signature embedded at the specified location.' },
    ],
    aboutHTML: `<p>The days of printing a PDF, signing by hand, scanning, and emailing back are over. The <strong>Sign PDF</strong> tool lets you add a typed electronic signature to any PDF document directly in your browser — no printer, no scanner, and no dedicated e-signature software required.</p>

<p>Electronic signatures are legally recognised in most jurisdictions under laws such as the eSign Act (USA), eIDAS Regulation (EU), and their equivalents worldwide. A typed name signature with a digital timestamp satisfies the "intent to sign" requirement for most business agreements, contracts, and approvals.</p>

<p><strong>Signature placement options:</strong></p>
<ul>
  <li><strong>Bottom Right:</strong> The standard position for document signatures, aligning with printed signature lines. Recommended for contracts.</li>
  <li><strong>Bottom Left:</strong> Left-margin signature placement.</li>
  <li><strong>Bottom Center:</strong> Centred footer position.</li>
  <li><strong>Top Right:</strong> Header-level placement for initial or approval stamps.</li>
</ul>

<p>The signature is rendered in a handwriting-style font and embedded directly in the PDF page content, making it visible in all PDF viewers and when the document is printed. A timestamp is automatically added beneath the signature text showing the date of signing.</p>

<p>For documents that require full legal non-repudiation with cryptographic certificates (such as qualified electronic signatures under eIDAS), a dedicated certificate-based signing service is recommended. Our tool provides a practical typed electronic signature for everyday business use.</p>

<p>After signing, consider <a href="/tools/pdf/protect-pdf">adding password protection</a> so the signed document cannot be modified after you send it. For documents containing sensitive personal details, you may also want to <a href="/tools/pdf/redact-pdf">redact</a> any unnecessary information before signing and distributing.</p>

<p><strong>Privacy:</strong> Your name and the document are processed over HTTPS and deleted within one hour. No account is required.</p>`,
    faqs: [
      { question: 'Is a typed electronic signature legally valid?', answer: 'In most countries and jurisdictions, yes. Typed electronic signatures are recognised under the eSign Act (US), eIDAS (EU), and equivalent laws in many other countries for most business documents.' },
      { question: 'Can I sign on a specific page?', answer: 'The signature is placed on the last page by default. Support for choosing a specific page can be done by using Extract PDF Pages first, signing that page, then merging back.' },
      { question: 'Will the signature appear when the document is printed?', answer: 'Yes. The signature is embedded in the page content and renders correctly in all PDF viewers and when printed.' },
      { question: 'Is the tool free?', answer: 'Yes. Free with no account or usage limits.' },
      { question: 'What is the file size limit?', answer: 'Up to 50 MB per PDF file.' },
      { question: 'Is my signature data secure?', answer: 'Your signature text is processed over HTTPS and the file is deleted within one hour. We do not store or retain signature information.' },
      { question: 'Can I use this on mobile?', answer: 'Yes. Works in mobile browsers on iOS and Android.' },
      { question: 'What browsers are supported?', answer: 'Chrome, Firefox, Safari, and Edge on desktop and mobile.' },
      { question: 'How long does signing take?', answer: 'Usually under 10 seconds.' },
      { question: 'Can I add multiple signatures to one document?', answer: 'Currently one signature is added per operation. To add signatures at multiple positions, run the signing process multiple times on the output file.' },
    ],
    relatedToolSlugs: ['protect-pdf', 'redact-pdf', 'add-watermark', 'flatten-pdf', 'compress-pdf'],
  },

  // ─────────────────────────────────────────────────────────────
  // 28. REDACT PDF
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'redact-pdf',
    name: 'Redact PDF',
    tagline: 'Permanently black out sensitive text and information in a PDF so it cannot be recovered.',
    metaTitle: 'Redact PDF Free Online — Permanently Remove Sensitive Info',
    metaDescription: 'Permanently redact sensitive information from PDF online free. Irreversible blackout of text and data. No signup, secure, instant.',
    canonicalUrl: `${BASE}/tools/pdf/redact-pdf`,
    ratingValue: '4.6',
    reviewCount: '1087',
    howToSteps: [
      { title: 'Upload the PDF', description: 'Select the PDF containing information you need to permanently redact before sharing or publishing.' },
      { title: 'Mark areas for redaction', description: 'The tool processes the document for redaction. Specify the regions or text content to be permanently blacked out.' },
      { title: 'Download the redacted PDF', description: 'Download the redacted PDF. The blacked-out areas are permanent and the underlying content cannot be recovered.' },
    ],
    aboutHTML: `<p>True redaction is not the same as drawing a black rectangle over text in a PDF editor. If the underlying text layer is still present beneath a drawn box, the original content can be recovered by selecting and copying the text or by removing the covering element. The <strong>Redact PDF</strong> tool performs permanent redaction — the selected content is irreversibly removed from the PDF data, replaced by solid black marks that contain no recoverable information.</p>

<p>This distinction is critical in legal, medical, financial, and government contexts. Courts have rejected documents where "redaction" was accomplished with opaque shapes that could be removed digitally. Our tool eliminates the underlying data so the redacted information is truly gone from the file.</p>

<p><strong>When proper redaction is essential:</strong></p>
<ul>
  <li>Removing personally identifiable information (PII) such as names, addresses, and ID numbers before publishing public records</li>
  <li>Blacking out confidential pricing, proprietary terms, or trade secrets before sharing a contract with a third party</li>
  <li>Removing social security numbers, patient IDs, or financial account numbers from documents before submission</li>
  <li>Complying with GDPR, HIPAA, CCPA, or similar data protection regulations when sharing documents externally</li>
</ul>

<p>After redaction, the tool also flattens the document to prevent form fields from being used to access concealed content. For additional protection on the redacted document, combine with our <a href="/tools/pdf/protect-pdf">Protect PDF</a> tool to add a password. If you need to sign the redacted document before distribution, use <a href="/tools/pdf/sign-pdf">Sign PDF</a> as the next step.</p>

<p><strong>Privacy:</strong> Uploaded files are processed on isolated servers, transmitted over HTTPS, and deleted within one hour. No content is retained or shared.</p>`,
    faqs: [
      { question: 'Is the redacted content truly unrecoverable?', answer: 'Yes. Our redaction removes the actual data from the PDF — it does not just cover it with a shape. The underlying text or image data is permanently deleted from the file.' },
      { question: 'What is the difference between redaction and covering with a black box?', answer: 'A black box drawn on a PDF in a basic editor only hides content visually. The text data remains and can be extracted. True redaction permanently removes the data from the PDF structure.' },
      { question: 'Can I redact images as well as text?', answer: 'Yes. The tool can redact both text content and image regions within a PDF.' },
      { question: 'Is the tool free?', answer: 'Yes. Free with no account required.' },
      { question: 'What is the file size limit?', answer: 'Up to 50 MB per PDF file.' },
      { question: 'Are my files secure?', answer: 'Files are processed on isolated servers over HTTPS and deleted within one hour. No file content is retained or shared.' },
      { question: 'Can I use this on mobile?', answer: 'Yes. Works in mobile browsers without any app.' },
      { question: 'What browsers are supported?', answer: 'Chrome, Firefox, Safari, and Edge on desktop and mobile.' },
      { question: 'How long does redaction take?', answer: 'Usually 10–30 seconds depending on file complexity.' },
      { question: 'Is the redaction reversible?', answer: 'No. Permanent redaction is irreversible by design. Always keep a backup of the original document before redacting.' },
    ],
    relatedToolSlugs: ['protect-pdf', 'sign-pdf', 'flatten-pdf', 'add-watermark', 'compress-pdf'],
  },

  // ─────────────────────────────────────────────────────────────
  // 29. FLATTEN PDF
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'flatten-pdf',
    name: 'Flatten PDF',
    tagline: 'Convert interactive form fields and annotations into static, non-editable content.',
    metaTitle: 'Flatten PDF Free Online — Remove Form Fields',
    metaDescription: 'Flatten PDF form fields and annotations into static content online free. Creates a non-editable final PDF. No signup needed.',
    canonicalUrl: `${BASE}/tools/pdf/flatten-pdf`,
    ratingValue: '4.6',
    reviewCount: '876',
    howToSteps: [
      { title: 'Upload your PDF', description: 'Select the PDF with form fields, annotations, or interactive elements you want to flatten.' },
      { title: 'Flatten the document', description: 'Click Flatten PDF. The tool merges all form field values, text annotations, digital signatures, and markups into the static page content.' },
      { title: 'Download the flattened PDF', description: 'Download the flattened document. Form fields no longer exist as interactive elements — their values are now part of the page itself.' },
    ],
    aboutHTML: `<p>A PDF with interactive form fields or annotations can be problematic in certain situations: form values may not print correctly in all viewers, annotations may be hidden when the document is converted or archived, and editable fields can be changed by recipients after submission. <strong>Flatten PDF</strong> resolves all of these issues by merging every interactive element into the static page content.</p>

<p>Flattening works by iterating over each annotation, form field, and interactive element in the PDF and rendering its current value or appearance directly into the page content stream. After flattening, the form field widget no longer exists as a separate, interactive element — its value becomes part of the visible page, just like any other text or image.</p>

<p><strong>Situations requiring PDF flattening:</strong></p>
<ul>
  <li>Preventing recipients from altering completed form values after submission</li>
  <li>Ensuring annotations and sticky notes are visible in all PDF viewers</li>
  <li>Preparing a PDF for archiving in PDF/A format (which requires no interactive elements)</li>
  <li>Fixing printing issues where form fields appear blank or misaligned</li>
  <li>Creating a final, non-editable version of a signed agreement</li>
</ul>

<p>Flattening is a one-way operation — you cannot convert a flattened PDF back into an editable form. Always keep a backup of the original form PDF before flattening.</p>

<p>After flattening, if the document has sensitive information that should be hidden from certain recipients, use our <a href="/tools/pdf/redact-pdf">Redact PDF</a> tool to permanently black out that content. For the final distribution copy, you may also want to <a href="/tools/pdf/compress-pdf">compress it</a> to reduce the file size.</p>

<p><strong>Privacy:</strong> Files are uploaded over HTTPS and deleted within one hour. No account is required and the tool is free.</p>`,
    faqs: [
      { question: 'What does flattening a PDF do?', answer: 'Flattening merges interactive form fields, annotations, stamps, and digital signature appearances into the static page content, making the document non-editable and ensuring consistent display.' },
      { question: 'Is flattening reversible?', answer: 'No. Once flattened, form fields and annotations cannot be made interactive again. Keep a copy of the original before flattening.' },
      { question: 'Will filled-in form values be preserved?', answer: 'Yes. Current field values are rendered as static text in the exact position of each field.' },
      { question: 'Does flattening affect page quality?', answer: 'No. Flattening is a structural operation that merges existing content without recompressing images or re-rendering text.' },
      { question: 'Is the tool free?', answer: 'Yes. Free with no account required.' },
      { question: 'What is the file size limit?', answer: 'Up to 50 MB per PDF file.' },
      { question: 'Are my files secure?', answer: 'Files are transmitted over HTTPS and deleted within one hour.' },
      { question: 'Can I use this on mobile?', answer: 'Yes. Works in all major mobile browsers.' },
      { question: 'What browsers are supported?', answer: 'Chrome, Firefox, Safari, and Edge.' },
      { question: 'How long does flattening take?', answer: 'Usually 5–15 seconds for most documents.' },
    ],
    relatedToolSlugs: ['redact-pdf', 'pdf-to-pdfa', 'sign-pdf', 'protect-pdf', 'compress-pdf'],
  },

  // ─────────────────────────────────────────────────────────────
  // 30. OCR PDF
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'ocr-pdf',
    name: 'OCR PDF',
    tagline: 'Make scanned PDFs searchable and selectable by adding a text layer with optical character recognition.',
    metaTitle: 'OCR PDF Free Online — Make Scanned PDF Searchable',
    metaDescription: 'Run OCR on a scanned PDF to add a searchable text layer. Supports 9 languages. Free, no signup, files deleted after 1 hour.',
    canonicalUrl: `${BASE}/tools/pdf/ocr-pdf`,
    ratingValue: '4.7',
    reviewCount: '2341',
    howToSteps: [
      { title: 'Upload the scanned PDF', description: 'Select the image-only PDF that needs OCR. This is typically a scanned document where you cannot select or search the text.' },
      { title: 'Choose the document language', description: 'Select the language of the text in your document for best accuracy. English is the default; 8 other languages are supported.' },
      { title: 'Download the searchable PDF', description: 'Click Run OCR. Download the output PDF — it looks identical to the input but now has a hidden text layer you can search and copy.' },
    ],
    aboutHTML: `<p>Scanned documents, photographed receipts, and image-only PDFs are essentially pictures of text — you cannot search through them, select words, or use Ctrl+F to find specific content. <strong>OCR PDF</strong> (Optical Character Recognition) analyses each page image, identifies characters and words, and adds an invisible searchable text layer that matches the visual layout — turning a static scan into a fully searchable document.</p>

<p>The OCR engine processes each page image using pattern recognition models trained on diverse fonts and handwriting styles. The resulting text layer is embedded beneath the original image, so the PDF looks exactly the same visually but now supports text selection, search, copy-paste, and accessibility screen reader tools.</p>

<p><strong>Supported languages:</strong></p>
<ul>
  <li>English, French, German, Spanish, Italian, Portuguese, Arabic, Chinese (Simplified), Japanese</li>
</ul>

<p>Selecting the correct language significantly improves accuracy, particularly for documents with diacritical marks (accents, umlauts) or non-Latin scripts.</p>

<p><strong>OCR accuracy factors:</strong></p>
<ul>
  <li>Scan quality: higher DPI (300+ recommended) scans produce significantly better results</li>
  <li>Font clarity: clear printed text converts near-perfectly; complex decorative fonts or handwriting are less accurate</li>
  <li>Page orientation: the OCR engine auto-detects and corrects minor rotations, but severely skewed pages reduce accuracy</li>
</ul>

<p>After OCR processing, you can use our <a href="/tools/pdf/pdf-to-text">PDF to Text</a> tool to extract the recognised text as a plain .txt file. For converting a scanned PDF to an editable Word document, run OCR first and then use <a href="/tools/pdf/pdf-to-word">PDF to Word</a>.</p>

<p><strong>Privacy:</strong> Scanned documents are processed on isolated servers and deleted within one hour. No text or image content is retained. The tool is free with no account required.</p>`,
    faqs: [
      { question: 'What is OCR and why do I need it?', answer: 'OCR (Optical Character Recognition) analyses a scanned image and identifies the text within it. Without OCR, scanned PDFs are just images — you cannot search them or copy text. After OCR, the text becomes selectable and searchable.' },
      { question: 'Will the document look different after OCR?', answer: 'No. The visual appearance is unchanged. OCR adds a hidden text layer beneath the existing image. You only notice the difference when searching or selecting text.' },
      { question: 'How accurate is the OCR?', answer: 'Accuracy depends on scan quality and font type. Clean 300 DPI scans of printed text typically achieve 95–99% accuracy. Handwriting and low-quality scans will be less accurate.' },
      { question: 'What languages are supported?', answer: 'English, French, German, Spanish, Italian, Portuguese, Arabic, Chinese (Simplified), and Japanese.' },
      { question: 'Is the tool free?', answer: 'Yes. Free with no account or usage limits.' },
      { question: 'What is the file size limit?', answer: 'Up to 50 MB per PDF file.' },
      { question: 'Are my documents secure?', answer: 'Files are processed on isolated servers over HTTPS and deleted within one hour. Document content is not retained.' },
      { question: 'Can I use this on mobile?', answer: 'Yes. Works in mobile browsers without any app.' },
      { question: 'What browsers are supported?', answer: 'Chrome, Firefox, Safari, and Edge on desktop and mobile.' },
      { question: 'How long does OCR take?', answer: 'Typically 15–60 seconds depending on the number of pages, scan resolution, and selected language.' },
      { question: 'Can I convert to Word after running OCR?', answer: 'Yes. After OCR adds a text layer, use the PDF to Word tool to convert the document to an editable .docx file.' },
    ],
    relatedToolSlugs: ['pdf-to-text', 'pdf-to-word', 'compress-pdf', 'flatten-pdf', 'pdf-to-pdfa'],
  },

  // ─────────────────────────────────────────────────────────────
  // 31. PDF TO EPUB
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'pdf-to-epub',
    name: 'PDF to EPUB',
    tagline: 'Convert a PDF document to EPUB format for a better reading experience on eReaders and mobile.',
    metaTitle: 'PDF to EPUB Free Online — Convert PDF to eBook',
    metaDescription: 'Convert PDF to EPUB eBook format online free. Better reading on Kindle, Kobo, Apple Books, and mobile. No signup needed.',
    canonicalUrl: `${BASE}/tools/pdf/pdf-to-epub`,
    ratingValue: '4.5',
    reviewCount: '876',
    howToSteps: [
      { title: 'Upload your PDF', description: 'Select the text-based PDF you want to convert to EPUB format for eReader use.' },
      { title: 'Convert to EPUB', description: 'Click Convert to EPUB. The tool extracts the text content and structures it as a reflowable EPUB document.' },
      { title: 'Download and transfer', description: 'Download the .epub file and transfer it to your eReader app — Kindle, Apple Books, Kobo, Google Play Books, or any EPUB-compatible reader.' },
    ],
    aboutHTML: `<p>PDF was designed for fixed-layout print documents, which makes it poor for mobile reading — you constantly zoom and scroll because the text does not reflow to fit your screen. <strong>PDF to EPUB</strong> solves this by converting the content of a PDF into the EPUB format, which is a reflowable eBook standard that adjusts text size, line spacing, and layout to match whatever screen you are reading on.</p>

<p>EPUB (Electronic Publication) is the open standard for eBooks, supported natively by Apple Books, Google Play Books, Kobo, Adobe Digital Editions, and most generic eReader apps. Amazon Kindle uses its own format (MOBI/AZW) but accepts EPUB files through its Send to Kindle service, which auto-converts on upload.</p>

<p><strong>When PDF to EPUB makes sense:</strong></p>
<ul>
  <li>Converting a long-form report, thesis, or ebook draft for comfortable mobile reading</li>
  <li>Transferring technical documentation to your eReader for offline reference</li>
  <li>Converting a PDF novel or non-fiction book to read on your Kobo or Kindle app</li>
  <li>Distributing educational content in a format students can read on any device</li>
</ul>

<p><strong>What converts well:</strong></p>
<ul>
  <li>Text-heavy PDFs with flowing paragraphs — novels, reports, essays, documentation</li>
  <li>PDFs with a single-column layout</li>
</ul>

<p><strong>What may not convert ideally:</strong></p>
<ul>
  <li>PDFs with complex multi-column magazine layouts may lose column structure</li>
  <li>Heavy image-based PDFs or design-heavy documents</li>
  <li>Scanned PDFs without a text layer (use <a href="/tools/pdf/ocr-pdf">OCR PDF</a> first)</li>
</ul>

<p>After converting, if the EPUB needs further editing or chapter structuring, it can be opened in calibre or Sigil for fine-tuning.</p>

<p><strong>Privacy:</strong> Your PDF is uploaded over HTTPS and deleted along with the EPUB output within one hour. No account is required and the conversion is free.</p>`,
    faqs: [
      { question: 'What devices can read EPUB files?', answer: 'EPUB is supported by Apple Books (iPhone, iPad, Mac), Google Play Books, Kobo eReaders, Adobe Digital Editions, and most generic eReader apps. Amazon Kindle accepts EPUB via the Send to Kindle service.' },
      { question: 'Will the PDF formatting be preserved in the EPUB?', answer: 'EPUB is a reflowable format, so fixed positioning from the PDF is converted to flowing text. Fonts, font sizes, and basic structure are approximated but the layout will adapt to the reader\'s screen.' },
      { question: 'Can I convert a scanned PDF to EPUB?', answer: 'Scanned PDFs need a text layer first. Run OCR PDF on the scanned document, then convert to EPUB.' },
      { question: 'Is the tool free?', answer: 'Yes. Free with no account required.' },
      { question: 'What is the file size limit?', answer: 'Up to 50 MB per PDF file.' },
      { question: 'Are my files secure?', answer: 'Files are transmitted over HTTPS and deleted within one hour.' },
      { question: 'Can I use this on mobile?', answer: 'Yes. Works in mobile browsers. The .epub file downloads and can be opened directly in your eReader app.' },
      { question: 'What browsers are supported?', answer: 'Chrome, Firefox, Safari, and Edge on desktop and mobile.' },
      { question: 'How long does the conversion take?', answer: 'Typically 10–30 seconds for standard documents.' },
      { question: 'What EPUB version is produced?', answer: 'The output is EPUB 3, the current standard, compatible with all modern EPUB readers and apps.' },
      { question: 'Can I convert multiple PDFs at once?', answer: 'Currently one PDF at a time. For multiple PDFs, use Merge PDF first to combine them, then convert to EPUB.' },
    ],
    relatedToolSlugs: ['ocr-pdf', 'pdf-to-text', 'pdf-to-word', 'compress-pdf', 'split-pdf'],
  },
]

