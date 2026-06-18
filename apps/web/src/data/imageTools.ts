// imageTools.ts — supplement data for all 38 image tool pages
// Provides: metaTitle, metaDescription, canonicalUrl,
//           aboutHTML, extraFaqs (6 additional), proTips (4)
// Each page.tsx imports getImageToolSupplement(slug) to merge with its inline data.

export interface ImageToolSupplement {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  aboutHTML: string;
  extraFaqs: { q: string; a: string }[];
  proTips: string[];
}

export const imageToolSupplements: Record<string, ImageToolSupplement> = {
  // ─── 1. add-border ──────────────────────────────────────────────────────────
  'add-border': {
    slug: 'add-border',
    metaTitle: 'Add Border to Image Free Online | RoughTools',
    metaDescription:
      'Add custom color borders to any image online. Choose width, color, and style. Free, no signup, instant download.',
    canonicalUrl: 'https://roughtools.com/tools/image-tools/add-border',
    aboutHTML: `
<p>The <strong>Add Border to Image</strong> tool lets you frame any photo or graphic with a clean, solid border in seconds. Whether you want a thin white border to make a photo pop on social media, a thick dark frame for a presentation graphic, or a colored border that matches your brand palette, this tool gives you precise control over width and color without any design software.</p>

<p>Common uses for adding a border include:</p>
<ul>
  <li>Adding a white or colored border to Instagram photos for a consistent feed aesthetic</li>
  <li>Framing product images with a thin outline before uploading to e-commerce platforms</li>
  <li>Creating a professional border for presentation slides exported as images</li>
  <li>Adding a polaroid-style white border to personal photos before printing</li>
  <li>Framing blog post featured images with a subtle outline that matches the site's color scheme</li>
</ul>

<p>The tool works entirely in your browser using the HTML5 Canvas API. When you upload an image, the canvas renders your original image and draws a filled rectangle as the border layer around the outside. The border expands the canvas dimensions rather than overlapping your image content, so no part of your original photo is cropped or covered. Color is applied instantly as you adjust the hex picker or RGB sliders.</p>

<p><strong>Input formats:</strong> JPG, JPEG, PNG, WebP, GIF, BMP, TIFF. <strong>Output format:</strong> PNG (preserves any transparency in your original if using a transparent border style) or JPG. <strong>Border width:</strong> 1px to 200px in 1px increments. <strong>Border color:</strong> any hex color or use the visual color picker.</p>

<p>Since the entire operation runs in your browser, your image data never leaves your device. No file is uploaded to a server and nothing is stored or logged. You can add borders to confidential documents, personal photos, or private artwork with complete privacy. The output file is generated locally and downloaded directly from your browser to your computer or phone.</p>

<p>For best results on social media, try a 20–40px white border for Instagram posts, or a 4–8px colored border matching your brand for Twitter cards. If you need to <a href="/tools/image-tools/image-resizer">resize the image</a> to specific dimensions after adding the border, use the Image Resizer tool next.</p>
    `,
    extraFaqs: [
      {
        q: 'Will adding a border reduce my image quality?',
        a: 'No. The border is added by expanding the canvas around your image — the original pixel data is untouched. The output PNG is lossless, so quality is fully preserved.',
      },
      {
        q: 'What is the maximum image size supported?',
        a: 'The tool handles images up to 20 MB and up to 8000×8000 pixels. For very large files, processing may take a few seconds depending on your device.',
      },
      {
        q: 'Can I add borders to multiple images at once?',
        a: 'Currently one image is processed at a time. For batch border operations, process each image individually and download each result.',
      },
      {
        q: 'Does this work on iPhone and Android?',
        a: 'Yes. The tool runs in any modern mobile browser including Safari on iOS and Chrome on Android. No app download is required.',
      },
      {
        q: 'Are my images stored after processing?',
        a: 'No. Everything runs in your browser. Your image is never uploaded to any server and is automatically cleared when you close or refresh the page.',
      },
      {
        q: 'Can I add a transparent or gradient border?',
        a: 'The current tool supports solid color borders. For transparent borders, use a transparent PNG input — the border area will respect any existing alpha channel. Gradient borders are not currently supported.',
      },
    ],
    proTips: [
      "For a clean Instagram carousel look, use exactly 40px white border on all images — this creates a consistent white frame that stands out against the app's white background.",
      'When adding a border to a JPG, save the output as PNG first if you plan to edit it further — re-saving JPGs adds compression artifacts each time.',
      'Match your border color to a hex code from your brand guidelines for perfectly on-brand graphics. Use the hex input field and type the code directly.',
      'A 2–4px black or dark gray border works well for product images on white backgrounds — it creates a subtle definition between the product and the page without being distracting.',
    ],
  },

  // ─── 2. add-watermark ───────────────────────────────────────────────────────
  'add-watermark': {
    slug: 'add-watermark',
    metaTitle: 'Add Watermark to Image Free Online | RoughTools',
    metaDescription:
      'Add text or image watermarks to photos online. Custom opacity, position, size. Free, instant, no signup.',
    canonicalUrl: 'https://roughtools.com/tools/image-tools/add-watermark',
    aboutHTML: `
<p>The <strong>Add Watermark to Image</strong> tool lets you protect your photographs, illustrations, and graphics by overlaying a custom text or logo watermark. Watermarking is the standard way photographers, designers, and content creators mark their work before sharing proofs or posting publicly — it signals ownership and deters unauthorized use without permanently altering the underlying image.</p>

<p>This tool is commonly used for:</p>
<ul>
  <li>Watermarking portfolio photos before sharing with clients for review</li>
  <li>Adding a copyright notice to product images before listing on marketplaces</li>
  <li>Branding screenshots and diagrams with a company logo before publishing in documentation</li>
  <li>Protecting photography proofs sent to customers before purchase</li>
  <li>Marking images with "DRAFT" or "SAMPLE" text for review processes</li>
</ul>

<p>Text watermarks are rendered directly on the canvas using the browser's native font rendering engine. You can customize the font, size, color, opacity, rotation angle, and position (corner or tiled across the image). Image watermarks (logos, signatures) are composited onto your photo using the Canvas 2D API's globalAlpha and drawImage methods, which ensures the watermark blends naturally at any opacity level.</p>

<p><strong>Input formats:</strong> JPG, PNG, WebP, GIF, BMP. <strong>Text options:</strong> custom text, font size (12–120px), opacity (10–100%), rotation (0–360°), color (any hex). <strong>Position:</strong> top-left, top-right, center, bottom-left, bottom-right, or tiled repeat. <strong>Logo watermark:</strong> upload a PNG with transparency for best results. <strong>Output:</strong> JPG or PNG.</p>

<p>Your original image and watermark files are processed entirely within your browser's memory. Nothing is uploaded to external servers. Once you close the page, all data is cleared. This makes the tool safe to use with unpublished work, confidential client previews, and proprietary product designs.</p>

<p>After watermarking, consider using the <a href="/tools/image-tools/image-compressor">Image Compressor</a> to reduce file size for web sharing, or the <a href="/tools/image-tools/image-resizer">Image Resizer</a> to adjust dimensions before uploading to your platform of choice.</p>
    `,
    extraFaqs: [
      {
        q: 'Will the watermark reduce my image quality?',
        a: 'When saving as PNG, there is no quality loss. When saving as JPG, a small amount of compression is applied but at 90%+ quality settings the difference is imperceptible.',
      },
      {
        q: 'What is the maximum image size I can watermark?',
        a: 'Images up to 20 MB and 8000×8000 pixels are supported. Very large canvases may take 2–5 seconds to render on mobile devices.',
      },
      {
        q: 'Can I watermark multiple images at once?',
        a: 'Batch watermarking is not currently supported. Process images one at a time and download each result individually.',
      },
      {
        q: 'Does this work on iPhone and Android?',
        a: 'Yes. The tool is fully functional in Safari on iOS and Chrome on Android. Touch gestures work for positioning the watermark preview.',
      },
      {
        q: 'Are my images stored or shared after watermarking?',
        a: 'No. All processing happens in your browser. Your original image and watermark are never sent to any server.',
      },
      {
        q: 'Can I remove a watermark I added by mistake?',
        a: 'Once downloaded, the watermark is permanently merged into the image — it cannot be removed without the original. Always keep your original file before watermarking.',
      },
    ],
    proTips: [
      'Set text watermark opacity to 30–40% for a visible but non-distracting mark — fully opaque watermarks can ruin the viewer experience and make proofs feel unprofessional.',
      'Use a diagonal rotation of 45° with tiled repeat for maximum copyright protection — it covers the entire image and is much harder to crop out than a corner watermark.',
      'For logo watermarks, always use a PNG with a transparent background — JPG logos have a white rectangle background that looks bad on colored images.',
      'Place watermarks in a non-uniform position (slightly off-center) to make automated removal more difficult — corner watermarks are the easiest for AI tools to detect and remove.',
    ],
  },

  // ─── 3. background-changer ──────────────────────────────────────────────────
  'background-changer': {
    slug: 'background-changer',
    metaTitle: 'Change Image Background Free Online | RoughTools',
    metaDescription:
      'Replace the background of any photo with a new color, gradient, or image. Free AI-powered tool, no signup.',
    canonicalUrl: 'https://roughtools.com/tools/image-tools/background-changer',
    aboutHTML: `
<p>The <strong>Background Changer</strong> automatically detects and removes the original background from your photo, then replaces it with your choice of solid color, gradient, or a new background image. Unlike simple chromakey tools that only work with solid colored backdrops, this tool uses AI-based subject detection to handle complex backgrounds including natural scenes, office environments, and busy street photography.</p>

<p>Common uses for the background changer include:</p>
<ul>
  <li>Swapping casual photo backgrounds with professional white or gray for LinkedIn headshots</li>
  <li>Placing product photos onto white, transparent, or studio-style backgrounds for e-commerce</li>
  <li>Creating composite images by placing a subject in front of a different location or scenery</li>
  <li>Replacing distracting backgrounds in real estate interior photos</li>
  <li>Generating consistent background styles across a series of team headshots</li>
</ul>

<p>The tool sends your image to a secure processing server where a convolutional neural network (CNN) trained on millions of human and object segmentation masks identifies the foreground subject. The model generates an alpha matte — a pixel-level probability map of foreground vs. background — and then composites your chosen replacement background behind the extracted subject. The result is returned to your browser and downloaded directly.</p>

<p><strong>Input formats:</strong> JPG, PNG, WebP. <strong>Background options:</strong> solid color (any hex), gradient (two-color), or upload a custom background image (JPG or PNG). <strong>Output format:</strong> PNG (preserves subject edges and any semi-transparent areas). File size limit: 10 MB per image.</p>

<p>Images are sent to our processing server over HTTPS and are immediately deleted after the background replacement is complete — typically within 5–10 seconds. We do not store, analyze, or share your images. No account is required. For privacy-sensitive images, consider using the <a href="/tools/image-tools/background-remover">Background Remover</a> instead if you only need the transparent cutout without a replacement background.</p>
    `,
    extraFaqs: [
      {
        q: 'Will changing the background reduce image quality?',
        a: 'The subject extraction may soften fine edges like hair slightly, but the overall image quality is maintained. The PNG output preserves all detail in the subject area.',
      },
      {
        q: 'What is the maximum image resolution supported?',
        a: 'Images up to 10 MB and 4096×4096 pixels give the best results. Larger images are downsampled for processing and then upsampled, which can reduce edge quality.',
      },
      {
        q: 'Can I change backgrounds on multiple images at once?',
        a: 'Batch processing is not available. Process one image at a time for the best results.',
      },
      {
        q: 'Does this work on iPhone and Android?',
        a: 'Yes. The tool works in any modern mobile browser. Upload photos directly from your camera roll on both iOS and Android.',
      },
      {
        q: 'Are my images stored after processing?',
        a: 'Images are sent to our server for AI processing and immediately deleted after the result is returned. We retain no copies and share nothing with third parties.',
      },
      {
        q: 'How accurate is the AI background detection on complex photos?',
        a: 'The AI performs well on photos with clear subject-background contrast. Hair, fur, and fine details may have minor edge artifacts. For best results, use a photo with reasonable lighting contrast between subject and background.',
      },
    ],
    proTips: [
      'Shoot subjects against a light-colored background when possible — the AI performs significantly better when there is clear contrast between subject and background.',
      'For e-commerce, use a pure white (#FFFFFF) replacement background and then compress the result as JPG at 85% quality — this matches Amazon and Shopify image standards.',
      'If edge quality around hair looks rough, try the manual touch-up after downloading: open in any editor and use a soft eraser to clean stray pixels along the hairline.',
      'When replacing with a custom background image, match the lighting direction of the original photo — mismatched light angles make composites look artificial.',
    ],
  },

  // ─── 4. background-remover ──────────────────────────────────────────────────
  'background-remover': {
    slug: 'background-remover',
    metaTitle: 'Remove Background from Image Free | RoughTools',
    metaDescription:
      'Remove image backgrounds automatically and get a transparent PNG. AI-powered, free, no signup required.',
    canonicalUrl: 'https://roughtools.com/tools/image-tools/background-remover',
    aboutHTML: `
<p>The <strong>Background Remover</strong> automatically cuts out the background from any photo and delivers a transparent PNG — ready to place on any color, pattern, or new scene without manual selection or masking. This is one of the most time-saving image tools for designers, photographers, and e-commerce sellers who regularly need clean, isolated subjects.</p>

<p>Background removal is needed for:</p>
<ul>
  <li>Creating transparent product images for e-commerce listings on Amazon, Etsy, and Shopify</li>
  <li>Isolating logos and icons for use on different colored backgrounds in designs</li>
  <li>Removing casual backgrounds from headshots for professional use</li>
  <li>Creating stickers and cut-out graphics for social media and messaging apps</li>
  <li>Preparing subjects for compositing in Photoshop, Figma, or Canva</li>
</ul>

<p>The tool uses a deep learning segmentation model trained on a large dataset of images across diverse categories — people, animals, products, vehicles, and more. The model analyzes each pixel and assigns a foreground probability score. Pixels classified as background are set to fully transparent (alpha = 0) while foreground pixels are preserved at full opacity. Edge pixels receive fractional alpha values to produce smooth, anti-aliased transitions that avoid the harsh cutout look of threshold-based tools.</p>

<p><strong>Input formats:</strong> JPG, PNG, WebP (up to 10 MB). <strong>Output format:</strong> PNG with alpha transparency. The transparent background is represented as a checkerboard pattern in the preview — this is standard for indicating transparency and will not appear in the downloaded file.</p>

<p>Your image is processed on our secure server over an encrypted HTTPS connection and immediately discarded after the transparent PNG is generated and returned to your browser. Processing takes 5–15 seconds depending on image complexity. No account, payment, or personal information is required at any step. To place your transparent cutout on a new background color or scene, use the <a href="/tools/image-tools/background-changer">Background Changer</a> tool.</p>
    `,
    extraFaqs: [
      {
        q: 'How accurate is the background removal on complex edges?',
        a: 'The AI handles most subjects well including hair, fur, and irregular edges. Very fine details like flyaway hair in front of a cluttered background may have minor imperfections. Simple subjects on contrasting backgrounds achieve near-perfect results.',
      },
      {
        q: 'What is the maximum image size supported?',
        a: 'Images up to 10 MB and 4096×4096 pixels. Very high resolution images are processed at reduced resolution internally to control processing time.',
      },
      {
        q: 'Can I remove backgrounds from multiple images at once?',
        a: 'Batch background removal is not currently available. Each image must be processed individually.',
      },
      {
        q: 'Does this work on iPhone and Android?',
        a: 'Yes. Upload from your camera roll and download the transparent PNG directly from any mobile browser on iOS or Android.',
      },
      {
        q: 'Are my images stored after processing?',
        a: 'No. Images are deleted from our server immediately after the transparent PNG is delivered to your browser. We store no image data.',
      },
      {
        q: 'Can I remove backgrounds from logos or graphic designs?',
        a: 'Yes. The tool works on graphic designs, logos, and illustrated artwork, not just photographs. For logos with simple shapes, results are typically very clean.',
      },
    ],
    proTips: [
      'For the cleanest results, use a photo with good lighting and reasonable separation between the subject and background — flat, even lighting with no harsh shadows on the background gives the AI the clearest signal.',
      'If you need the PNG for printing on merchandise, choose 300 DPI source images — the transparency quality degrades proportionally with input resolution.',
      'After downloading the transparent PNG, open it in any image editor and zoom to 200% to check edge quality — use a soft eraser brush to clean any stray background pixels before using in designs.',
      'For product photography, photograph items on a light gray background rather than white — gray provides better contrast for the AI while still producing clean, easily-converted results.',
    ],
  },

  // ─── 5. base64-to-image ─────────────────────────────────────────────────────
  'base64-to-image': {
    slug: 'base64-to-image',
    metaTitle: 'Base64 to Image Converter Free Online | RoughTools',
    metaDescription:
      'Convert Base64 encoded strings back to image files instantly. Supports JPG, PNG, GIF, WebP. Free, browser-based.',
    canonicalUrl: 'https://roughtools.com/tools/image-tools/base64-to-image',
    aboutHTML: `
<p>The <strong>Base64 to Image</strong> converter decodes a Base64-encoded string back into a viewable and downloadable image file. If you receive image data embedded in a JSON API response, HTML data URI, CSS stylesheet, or database record, this tool extracts and renders the actual image so you can preview and download it — no command-line decoding required.</p>

<p>This tool is most useful for:</p>
<ul>
  <li>Debugging API responses that embed images as Base64 data URIs</li>
  <li>Extracting images embedded in HTML or CSS source code</li>
  <li>Converting database-stored Base64 image blobs back to viewable files</li>
  <li>Recovering images from email attachments encoded as Base64 MIME parts</li>
  <li>Testing and validating Base64 image encoding in web development workflows</li>
</ul>

<p>Base64 encoding converts binary image data into a string of ASCII characters using a 64-character alphabet. Each group of 3 bytes in the original binary becomes 4 characters in Base64, resulting in encoded strings that are approximately 33% larger than the source image. This tool reverses the process: it reads the Base64 string, decodes each 4-character group back to 3 bytes, and reconstructs the original binary image data. The browser then renders this binary data as a visible image using a data URI scheme.</p>

<p><strong>Input:</strong> Paste any valid Base64 string — with or without the <code>data:image/png;base64,</code> prefix. <strong>Supported encoded formats:</strong> JPG, PNG, GIF, WebP, SVG, BMP, ICO. <strong>Output:</strong> the decoded image rendered in the preview, downloadable as its original format. Maximum input string length: 50 MB of Base64 text (decodes to approximately 37 MB image).</p>

<p>All decoding happens entirely in your browser using JavaScript's built-in <code>atob()</code> function and the FileReader API. No data is sent anywhere. This is important for developers working with sensitive API responses or proprietary image data — your Base64 strings are never transmitted over a network connection. For the reverse operation, use the <a href="/tools/image-tools/image-to-base64">Image to Base64 Encoder</a>.</p>
    `,
    extraFaqs: [
      {
        q: 'Will decoding reduce the image quality?',
        a: 'No. Base64 is a lossless encoding — decoding returns the exact original binary data, so the image quality is identical to the source file.',
      },
      {
        q: 'What is the maximum Base64 string length supported?',
        a: 'The tool handles Base64 strings up to 50 MB in length, which decodes to approximately 37 MB of image data.',
      },
      {
        q: 'Can I decode multiple Base64 strings at once?',
        a: 'One string at a time. For batch decoding, use a script — the browser tool is designed for single-image inspection and debugging.',
      },
      {
        q: 'Does this work on iPhone and Android?',
        a: 'Yes. Paste your Base64 string in any mobile browser and the image will render and become downloadable.',
      },
      {
        q: 'Are the Base64 strings I paste stored anywhere?',
        a: 'No. Decoding runs entirely in your browser. Nothing is sent to any server. Your Base64 data stays on your device.',
      },
      {
        q: 'What if the Base64 string is invalid or corrupted?',
        a: 'The tool will display an error message. Common issues include truncated strings, incorrect padding characters, or non-Base64 characters mixed into the string.',
      },
    ],
    proTips: [
      'If the tool shows an error, check for whitespace or line breaks in your Base64 string — copy-pasting from some editors adds invisible newline characters that break the encoding.',
      'Base64 strings from data URIs start with "data:image/...;base64," — you can paste the full URI including this prefix, the tool strips it automatically.',
      'To quickly test if a string is valid Base64, check that its length is divisible by 4 and it ends in "=" or "==" padding characters.',
      'For large Base64 strings from API responses, use browser DevTools Network tab to copy the full response body rather than the displayed preview which may be truncated.',
    ],
  },

  // ─── 6. blur-background ─────────────────────────────────────────────────────
  'blur-background': {
    slug: 'blur-background',
    metaTitle: 'Blur Background of Photo Free Online | RoughTools',
    metaDescription:
      'Blur the background of any photo automatically. Create a bokeh depth-of-field effect. Free, AI-powered, no signup.',
    canonicalUrl: 'https://roughtools.com/tools/image-tools/blur-background',
    aboutHTML: `
<p>The <strong>Blur Background</strong> tool uses AI subject detection to identify the main subject in your photo and applies a Gaussian blur to the background, creating the shallow depth-of-field "bokeh" effect that professional DSLR cameras achieve with wide aperture lenses. This effect focuses viewer attention on your subject, reduces background distractions, and gives phone photos a more professional look.</p>

<p>Background blur is valuable for:</p>
<ul>
  <li>Making portrait photos look like they were taken with a professional camera lens</li>
  <li>Reducing distracting backgrounds in product photography without removing them entirely</li>
  <li>Creating a professional look for video call screenshots and headshot photos</li>
  <li>Adding visual depth to flat, busy background photos of people or objects</li>
  <li>Preparing images for social media where a clean, focused subject performs better</li>
</ul>

<p>The processing pipeline has two stages. First, a semantic segmentation neural network analyzes the image and generates a depth-aware subject mask — a grayscale map where brighter pixels indicate foreground subjects. Second, a Gaussian blur kernel is applied to the background layer with blur radius proportional to the estimated depth at each pixel. This creates a natural falloff where the transition between sharp subject and blurred background mimics the physics of optical bokeh rather than creating a harsh edge. The foreground subject layer is then composited back over the blurred background.</p>

<p><strong>Input formats:</strong> JPG, PNG, WebP (up to 10 MB). <strong>Blur strength:</strong> adjustable from subtle (radius 5px) to strong (radius 40px). <strong>Output format:</strong> JPG or PNG. Processing time: 5–15 seconds on the server. Edge detection works best on subjects with clear separation from the background — portraits, isolated products, and animals on natural backgrounds.</p>

<p>Your image is transmitted over HTTPS to our processing server and immediately deleted once the blurred result is returned. The server retains no image data between sessions. No account is needed. For complete background replacement instead of blurring, try the <a href="/tools/image-tools/background-changer">Background Changer</a>.</p>
    `,
    extraFaqs: [
      {
        q: 'Will blur processing reduce my image quality?',
        a: 'The subject area is fully preserved with no quality loss. The background blur is an intentional effect. When saving as JPG, compression at 90%+ quality is imperceptible.',
      },
      {
        q: 'What is the maximum image resolution supported?',
        a: 'Images up to 10 MB and 4096×4096 pixels. Higher resolution inputs give better edge separation quality in the subject mask.',
      },
      {
        q: 'Can I blur the background on multiple photos at once?',
        a: 'Batch processing is not currently available. Process one photo at a time.',
      },
      {
        q: 'Does this work on iPhone and Android?',
        a: 'Yes. Upload from your phone camera roll and download the blurred result directly in any mobile browser.',
      },
      {
        q: 'Are my photos stored after processing?',
        a: 'No. Photos are deleted from the server immediately after the blurred result is returned to your browser.',
      },
      {
        q: 'How do I control how blurry the background is?',
        a: 'Use the blur strength slider — lower values create subtle softening, higher values create strong bokeh. Most portrait photos look best at medium settings (15–25px radius).',
      },
    ],
    proTips: [
      'For portraits, medium blur (15–20px) looks most natural — very strong blur can make the subject look like a cutout rather than a photo taken with a real lens.',
      'Shoot subjects at least 1–2 meters away from the background for the best AI segmentation — subjects pressed against walls create ambiguous depth cues that confuse the model.',
      'After downloading, check the edges around hair and shoulders at 100% zoom — if you see artifacts, try the Background Changer to remove background entirely for a cleaner result.',
      'For product photography, use a lower blur strength (5–10px) — strong blur on product backgrounds can look artificial, while subtle softening looks intentional and professional.',
    ],
  },

  // ─── 7. bulk-image-resizer ──────────────────────────────────────────────────
  'bulk-image-resizer': {
    slug: 'bulk-image-resizer',
    metaTitle: 'Bulk Image Resizer — Resize Multiple Images Free',
    metaDescription:
      'Resize multiple images at once to exact dimensions or percentage. Free online bulk resizer, no signup.',
    canonicalUrl: 'https://roughtools.com/tools/image-tools/bulk-image-resizer',
    aboutHTML: `
<p>The <strong>Bulk Image Resizer</strong> lets you resize dozens of images simultaneously to a consistent size — saving hours of manual resizing in image editors. Upload multiple photos at once, set your target dimensions or scale percentage, and download all resized images in a single ZIP file. This is the fastest way to prepare image batches for websites, social media posting, product listings, or presentations.</p>

<p>Bulk resizing is essential for:</p>
<ul>
  <li>Resizing a batch of product photos to the exact dimensions required by an e-commerce platform</li>
  <li>Standardizing photo sizes before uploading to a CMS or website gallery</li>
  <li>Preparing a set of social media images to consistent dimensions (e.g., all to 1080×1080px for Instagram)</li>
  <li>Scaling down a folder of high-resolution photos for email or web sharing</li>
  <li>Resizing a batch of screenshots for a documentation or user guide</li>
</ul>

<p>Resizing is performed in the browser using the HTML5 Canvas API. Each uploaded image is drawn onto a canvas at the target dimensions, and the browser's built-in bilinear interpolation algorithm handles the scaling math. This algorithm averages surrounding pixel values during downscaling to reduce aliasing, producing sharper results than nearest-neighbor scaling. For upscaling, bicubic interpolation approximation is used. All images are processed in parallel using Web Workers where supported, which keeps the UI responsive even when processing 50+ images.</p>

<p><strong>Input formats:</strong> JPG, PNG, WebP, BMP, GIF. <strong>Resize modes:</strong> exact width×height (with option to maintain aspect ratio), width only (height auto-calculated), height only (width auto-calculated), or percentage scale. <strong>Output formats:</strong> JPG or PNG. <strong>Batch size:</strong> up to 100 images per session. <strong>Download:</strong> individual files or a ZIP archive.</p>

<p>All processing happens locally in your browser — nothing is uploaded to any server. Your images stay on your device throughout the entire operation. After bulk resizing, you may want to use the <a href="/tools/image-tools/image-compressor">Image Compressor</a> to further reduce file sizes for web delivery.</p>
    `,
    extraFaqs: [
      {
        q: 'Will bulk resizing reduce image quality?',
        a: 'Downscaling always involves some data reduction — this is unavoidable. The Canvas bilinear interpolation produces high-quality results. PNG output is lossless; JPG output at 90%+ quality is near-indistinguishable from the original at the new size.',
      },
      {
        q: 'What is the maximum number of images I can resize at once?',
        a: 'Up to 100 images per session. For larger batches, split into multiple sessions.',
      },
      {
        q: 'What is the maximum image size supported?',
        a: 'Each individual image can be up to 20 MB. The total batch should not exceed 500 MB to ensure browser memory stability.',
      },
      {
        q: 'Does this work on iPhone and Android?',
        a: 'Yes, though mobile browsers have more limited memory. For large batches on mobile, process 20–30 images at a time for best stability.',
      },
      {
        q: 'Are my images stored after processing?',
        a: 'No. All processing is browser-based. No images are uploaded or stored anywhere.',
      },
      {
        q: 'Can I resize to different dimensions for different images in one batch?',
        a: 'All images in a batch share the same resize settings. For different target sizes, process images in separate batches.',
      },
    ],
    proTips: [
      'Use "width only" mode with aspect ratio lock when resizing photos with mixed orientations — this prevents portrait photos from being stretched to match landscape dimensions.',
      'For web images, resize to 1.5× the display size for retina/HiDPI screens — a 600px wide column needs 900px images to look sharp on modern displays.',
      'Process RAW formats by converting to JPG first — the bulk resizer handles JPG much faster than lossless formats, and for web delivery JPG is almost always the right output format.',
      "When preparing e-commerce images, check the platform's exact dimension requirements first — Amazon requires 1000px minimum on the longest side, while Etsy recommends 2000px.",
    ],
  },

  // ─── 8. dominant-color-extractor ────────────────────────────────────────────
  'dominant-color-extractor': {
    slug: 'dominant-color-extractor',
    metaTitle: 'Dominant Color Extractor Free Online | RoughTools',
    metaDescription:
      'Extract the dominant colors and color palette from any image. Get hex codes instantly. Free, browser-based.',
    canonicalUrl: 'https://roughtools.com/tools/image-tools/dominant-color-extractor',
    aboutHTML: `
<p>The <strong>Dominant Color Extractor</strong> analyzes any image and identifies the most prominent colors, returning a sorted color palette with hex codes, RGB values, and percentage distribution. This is invaluable for designers who need to match brand colors from a logo image, developers building color-adaptive UIs, and content creators who want a consistent color scheme across their visuals.</p>

<p>Common use cases include:</p>
<ul>
  <li>Extracting a brand color palette from a company logo to use in design work</li>
  <li>Finding the dominant colors in a product photo to use as background or accent colors in listings</li>
  <li>Building adaptive UI color schemes that match uploaded user photos</li>
  <li>Identifying color trends across a collection of images for marketing analysis</li>
  <li>Matching paint, fabric, or print colors by extracting hex codes from reference photos</li>
</ul>

<p>Color extraction uses a k-means clustering algorithm applied to the pixel data of the image. The image is first downsampled to a manageable resolution (typically 200×200px) to make the clustering computationally efficient. Each pixel's RGB values are treated as a point in 3D color space. The k-means algorithm partitions these points into k clusters (typically 5–8) by iteratively minimizing the distance between each pixel and its nearest cluster centroid. The final centroid positions represent the dominant colors, and the cluster sizes determine the percentage distribution.</p>

<p><strong>Input formats:</strong> JPG, PNG, WebP, BMP, GIF. <strong>Output:</strong> color swatches with hex codes, RGB values, HSL values, and percentage of image covered. <strong>Palette size:</strong> 5 to 12 dominant colors. <strong>Clipboard copy:</strong> click any swatch to copy the hex code instantly.</p>

<p>The entire color extraction algorithm runs in your browser using JavaScript and the HTML5 Canvas API. No image data leaves your device. This makes the tool safe for analyzing proprietary product images, confidential design files, or sensitive photography. For related color work, try the <a href="/tools/image-tools/image-color-picker">Image Color Picker</a> to sample specific pixels.</p>
    `,
    extraFaqs: [
      {
        q: 'Will extracting colors change or damage my image?',
        a: 'No. The tool only reads your image data — it does not modify the file in any way. Your original image is never altered.',
      },
      {
        q: 'What is the maximum image size supported?',
        a: 'Images up to 20 MB. For color extraction, even large images are downsampled internally, so processing is fast regardless of resolution.',
      },
      {
        q: 'Can I extract colors from multiple images at once?',
        a: 'One image at a time. For batch analysis, process each image individually.',
      },
      {
        q: 'Does this work on iPhone and Android?',
        a: 'Yes. Upload any image from your camera roll and the color palette appears instantly in any mobile browser.',
      },
      {
        q: 'Are my images stored after analysis?',
        a: 'No. Everything runs in the browser. Your image is never sent to any server.',
      },
      {
        q: 'Why does the extracted palette look different from what I expected?',
        a: 'K-means clustering finds mathematically dominant colors, which may differ from visually prominent ones. Small but visually striking areas (like a bright logo on a white background) may not appear in the dominant palette if they cover a small pixel area.',
      },
    ],
    proTips: [
      'For brand color extraction from logos, use a version of the logo on a white or transparent background — background pixels skew the clustering toward white/neutral tones.',
      'The percentage shown next to each color tells you how much of the image it covers — use the top 1–2 colors for backgrounds and the others as accent colors in your design.',
      'When building a UI color scheme from a photo, the dominant color makes the best primary, and the second-most dominant makes the best complementary accent.',
      'For product photography, extract the dominant colors and use them to choose background colors for complementary contrast — a blue product pops best on a warm orange or neutral gray background.',
    ],
  },

  // ─── 9. dpi-converter ───────────────────────────────────────────────────────
  'dpi-converter': {
    slug: 'dpi-converter',
    metaTitle: 'DPI Converter — Change Image DPI Free Online | RoughTools',
    metaDescription:
      'Change the DPI/PPI of any image for print or web. Set 72, 96, 150, 300 DPI. Free, instant, no signup.',
    canonicalUrl: 'https://roughtools.com/tools/image-tools/dpi-converter',
    aboutHTML: `
<p>The <strong>DPI Converter</strong> changes the dots-per-inch (DPI) metadata embedded in an image file without altering the actual pixel data. This is critical for print workflows, where programs like Adobe InDesign, Microsoft Word, and professional print services use the DPI value to determine the physical print size of an image. Changing DPI does not resize the image — it only tells print software how large each pixel should be when printed on paper.</p>

<p>DPI conversion is needed when:</p>
<ul>
  <li>A printer rejects your image because it reports "72 DPI" even though the pixel count is high enough for quality printing</li>
  <li>Preparing images for professional offset printing which requires exactly 300 DPI</li>
  <li>Correcting metadata on images exported from web applications which default to 96 DPI</li>
  <li>Setting images to 72 DPI for pure web use to match standard screen resolution specifications</li>
  <li>Fixing DPI mismatches that cause layout software to place images at incorrect sizes</li>
</ul>

<p>DPI (or PPI — pixels per inch) is stored as metadata in the image file header, not as part of the pixel data. For JPEG files, this is in the JFIF or Exif segment. For PNG files, it is in the pHYs chunk. The tool reads the existing header, modifies the resolution value to your specified DPI, and rewrites the header. The pixel grid itself — every single pixel — remains completely unchanged. This operation is lossless: no pixel is created, removed, or altered.</p>

<p><strong>Input formats:</strong> JPG, PNG, TIFF. <strong>DPI presets:</strong> 72 (web/screen), 96 (Windows screen), 150 (low-quality print), 300 (standard print), 600 (high-quality print). <strong>Custom DPI:</strong> enter any value from 1 to 1200. <strong>Output:</strong> same format as input with updated DPI metadata.</p>

<p>DPI conversion runs entirely in your browser by manipulating the binary file headers using JavaScript. No file data is transmitted over the network. Your images remain private and the operation completes in under a second for most files. After converting DPI, you may also want to use the <a href="/tools/image-tools/image-resizer">Image Resizer</a> if the actual pixel dimensions need adjustment.</p>
    `,
    extraFaqs: [
      {
        q: 'Will changing DPI affect my image quality or file size?',
        a: 'No. DPI is metadata only — it does not change any pixel data. The image looks identical and the file size changes by only a few bytes (the metadata difference).',
      },
      {
        q: 'What DPI should I use for printing?',
        a: '300 DPI is the standard for professional printing. 150 DPI is acceptable for large-format prints viewed from a distance. 72 or 96 DPI is for screen display only — print quality at these values will be visibly poor.',
      },
      {
        q: 'Can I change DPI on multiple images at once?',
        a: 'Batch DPI conversion is not currently available. Process one image at a time.',
      },
      {
        q: 'Does this work on iPhone and Android?',
        a: 'Yes. The tool runs in any mobile browser. Upload, set DPI, and download the converted file.',
      },
      {
        q: 'Are my images stored after DPI conversion?',
        a: 'No. The metadata edit happens entirely in your browser. No data is uploaded or stored anywhere.',
      },
      {
        q: 'Why does changing DPI not fix my blurry print?',
        a: 'DPI metadata does not add pixels — it only tells printers how large to print existing pixels. If your image lacks sufficient pixels for the print size, it will still look blurry. To fix this, you need more pixels — either from a higher-resolution source or by using an AI upscaler.',
      },
    ],
    proTips: [
      'To check if an image has enough pixels for a print at 300 DPI, divide the pixel dimensions by 300 — a 3000×2000px image prints at 10×6.67 inches at 300 DPI.',
      "If a design program places your image at an unexpected size, it's using the embedded DPI to calculate the default size — change the DPI to 300 so the program places it at the correct print dimensions.",
      'TIFF files support multiple DPI values per file — if your TIFF looks correct in preview but prints wrong, convert DPI and save as a fresh TIFF.',
      'Web images exported from professional tools often have 72 DPI baked in — use this converter to set them to 96 DPI for correct display in Windows environments.',
    ],
  },

  // ─── 10. gif-maker ──────────────────────────────────────────────────────────
  'gif-maker': {
    slug: 'gif-maker',
    metaTitle: 'GIF Maker — Create Animated GIFs Free Online | RoughTools',
    metaDescription:
      'Create animated GIFs from images or video clips. Set frame rate, loop, and size. Free, no signup, instant download.',
    canonicalUrl: 'https://roughtools.com/tools/image-tools/gif-maker',
    aboutHTML: `
<p>The <strong>GIF Maker</strong> creates animated GIFs from a sequence of images or from a short video clip. GIFs are the universal animation format — they play on every device, in every browser, and in every messaging app without any video player or codec. Whether you're creating a product animation, a meme, a quick tutorial loop, or a social media reaction, this tool gives you a ready-to-share GIF in seconds.</p>

<p>GIF creation is useful for:</p>
<ul>
  <li>Creating product animation GIFs for e-commerce listings to show 360° views or features</li>
  <li>Making short tutorial animations showing before/after results or step-by-step clicks</li>
  <li>Converting a short video clip from a presentation into a looping GIF for emails and documents</li>
  <li>Creating reaction GIFs and memes from video screenshots</li>
  <li>Making social media content like animated logo reveals or text animations</li>
</ul>

<p>GIF encoding in the browser uses the GIF89a specification. Each frame of your animation is quantized to a 256-color palette (GIF's maximum) using an optimized dithering algorithm that minimizes visible color banding. For sequences of frames with minimal change between frames (like screenshots with static backgrounds), the encoder applies LZW compression per frame and stores only changed pixel regions, keeping file sizes small. Frame delay is configurable per frame or globally, letting you control the playback speed of your animation precisely.</p>

<p><strong>Image input:</strong> upload 2–100 JPG or PNG frames in sequence. <strong>Video input:</strong> upload an MP4 or WebM clip (up to 30 seconds) and the tool extracts frames automatically. <strong>Frame rate:</strong> 1–24 FPS. <strong>Dimensions:</strong> up to 800×800px (GIF standard). <strong>Loop:</strong> infinite or specified number of loops. <strong>Output:</strong> downloadable .gif file.</p>

<p>GIF creation runs in the browser using a WebAssembly-compiled GIF encoding library. No frames or video clips are uploaded to any server. The entire encoding process happens locally, which means your video content stays private. For better compression with no quality loss, consider the <a href="/tools/image-tools/image-compressor">Image Compressor</a> for static images, or use the Image Converter to convert to WebP for modern browsers.</p>
    `,
    extraFaqs: [
      {
        q: 'Will the GIF look lower quality than my original images?',
        a: 'Yes — GIF is limited to 256 colors per frame, which causes visible color banding in photographs with gradients. The tool applies dithering to minimize this, but GIF is best for simple graphics and illustrations with flat colors rather than detailed photography.',
      },
      {
        q: 'What is the maximum number of frames supported?',
        a: 'Up to 100 frames per GIF. More frames create larger files — for smooth animation at 24 FPS, 100 frames equals about 4 seconds of animation.',
      },
      {
        q: 'Can I create GIFs from video clips?',
        a: 'Yes — upload an MP4 or WebM video and the tool extracts frames. Video clips up to 30 seconds are supported for GIF extraction.',
      },
      {
        q: 'Does this work on iPhone and Android?',
        a: 'Yes. The GIF maker works in mobile browsers. On iOS, you can save the GIF to Photos for easy sharing.',
      },
      {
        q: 'Are my images or videos stored after GIF creation?',
        a: 'No. All processing runs locally in your browser. No frames or video clips are uploaded or stored.',
      },
      {
        q: 'Why is my GIF file so large?',
        a: 'GIF files grow quickly with resolution, frame count, and color variety. Keep GIFs under 800×800px, reduce the frame rate to 10–15 FPS, and limit animation length to 3–5 seconds for social media sharing.',
      },
    ],
    proTips: [
      'For the smallest file sizes, reduce GIF dimensions to the minimum necessary — a 400px wide GIF is half the file size of an 800px wide GIF with the same content.',
      'Use 10–15 FPS rather than 24 FPS for most animated GIFs — the difference in smoothness is minimal, but the file size reduction is significant.',
      'For color-accurate GIFs from photographs, enable dithering — it adds a subtle noise pattern that simulates colors outside the 256-color palette and dramatically reduces visible banding.',
      'GIFs with large areas of identical color (flat backgrounds, solid fills) compress much better than GIFs with photographic content — optimize your source images accordingly.',
    ],
  },

  // ─── 11. grayscale-converter ─────────────────────────────────────────────────
  'grayscale-converter': {
    slug: 'grayscale-converter',
    metaTitle: 'Grayscale Converter — Black & White Photo Free | RoughTools',
    metaDescription:
      'Convert any photo to black and white or grayscale online. Multiple conversion modes. Free, instant, no signup.',
    canonicalUrl: 'https://roughtools.com/tools/image-tools/grayscale-converter',
    aboutHTML: `
<p>The <strong>Grayscale Converter</strong> transforms color photos into black-and-white images using professional-grade luminosity algorithms. Unlike simply desaturating an image (which treats all colors equally), this tool lets you choose between different grayscale conversion modes that weight color channels differently — producing results that match the look of classic film photography, documentary imagery, and fine art black-and-white prints.</p>

<p>Grayscale conversion is commonly needed for:</p>
<ul>
  <li>Creating dramatic black-and-white portrait photography for editorial or artistic use</li>
  <li>Converting color photos to grayscale for use in documents, reports, or publications being printed in black-and-white</li>
  <li>Preparing images for machine learning datasets that require grayscale input</li>
  <li>Achieving a timeless, classic aesthetic for social media photography</li>
  <li>Reducing file size slightly while maintaining visual content for text-heavy documents</li>
</ul>

<p>The tool offers three conversion modes. <strong>Luminosity mode</strong> uses the ITU-R BT.601 formula (R×0.299 + G×0.587 + B×0.114), which weights green most heavily because the human eye is most sensitive to green light — this produces the most natural-looking grayscale. <strong>Average mode</strong> calculates simple arithmetic mean of the three channels, producing flatter results. <strong>Desaturate mode</strong> averages the maximum and minimum channel values, which mimics the look of photographic desaturation filters. All modes run in the browser via Canvas pixel manipulation.</p>

<p><strong>Input formats:</strong> JPG, PNG, WebP, BMP, GIF. <strong>Output format:</strong> JPG (for photographs) or PNG (for graphics with transparency). Converted images retain the full original resolution and pixel count — only color information is removed. <strong>Brightness and contrast</strong> adjustments are available after conversion to fine-tune the tonal range.</p>

<p>Conversion runs entirely in your browser using direct pixel manipulation on the HTML5 Canvas. No image data is sent to any server. The converted file is generated locally and downloaded directly to your device. For more advanced black-and-white editing including zone control and highlight/shadow adjustments, use the <a href="/tools/image-tools/image-enhancer">Image Enhancer</a> after converting.</p>
    `,
    extraFaqs: [
      {
        q: 'Will grayscale conversion reduce my image quality?',
        a: 'No quality is lost in the conversion — only color channel data is combined into a single luminosity value. The output resolution is identical to the input.',
      },
      {
        q: 'What is the maximum image size supported?',
        a: 'Images up to 20 MB and 8000×8000 pixels. Large images convert in 1–3 seconds depending on your device.',
      },
      {
        q: 'Can I convert multiple images to grayscale at once?',
        a: 'Currently one image at a time. For batch conversion, process images individually.',
      },
      {
        q: 'Does this work on iPhone and Android?',
        a: 'Yes. Conversion happens instantly in any mobile browser — no app required.',
      },
      {
        q: 'Are my images stored after conversion?',
        a: 'No. Grayscale conversion happens locally in your browser. No data leaves your device.',
      },
      {
        q: 'Which conversion mode produces the most professional-looking black-and-white?',
        a: "Luminosity mode (BT.601 weighting) produces the most professional results for photography because it matches the human eye's color sensitivity. Average mode tends to look flat, while desaturate can oversaturate certain tones.",
      },
    ],
    proTips: [
      'Luminosity mode produces the most cinematographic black-and-white look — the weighted green channel naturally brightens foliage and skin tones while maintaining shadow depth.',
      'After converting to grayscale, increase contrast by 10–20% — color photos rely on hue differentiation that disappears in grayscale, so boosting contrast restores perceived depth.',
      'For portraits, the luminosity formula naturally brightens skin tones (which have high red and green content) while darkening skies (high blue content) — this is the "correct" aesthetic for portrait black-and-white.',
      'If you want a high-contrast dramatic look reminiscent of Ansel Adams, convert to grayscale first, then apply a strong S-curve in contrast — brighten the highlights and deepen the shadows.',
    ],
  },

  // ─── 12. heic-to-jpg ────────────────────────────────────────────────────────
  'heic-to-jpg': {
    slug: 'heic-to-jpg',
    metaTitle: 'HEIC to JPG Converter Free Online | RoughTools',
    metaDescription:
      'Convert iPhone HEIC photos to JPG instantly. Free, browser-based, no signup. Share Apple photos anywhere.',
    canonicalUrl: 'https://roughtools.com/tools/image-tools/heic-to-jpg',
    aboutHTML: `
<p>The <strong>HEIC to JPG Converter</strong> converts Apple's HEIC (High Efficiency Image Container) photos from iPhones and iPads into universally compatible JPG files. HEIC is a modern format that stores photos at half the file size of JPG with equal quality — but it is not natively supported by Windows, Android, most web browsers, or third-party applications. Converting HEIC to JPG makes your iPhone photos accessible everywhere.</p>

<p>HEIC to JPG conversion is needed when:</p>
<ul>
  <li>Sharing iPhone photos with Windows users who cannot open HEIC files</li>
  <li>Uploading photos to websites, social media platforms, or apps that reject HEIC format</li>
  <li>Using iPhone photos in design software like Adobe Illustrator or Microsoft Office that don't support HEIC</li>
  <li>Sending photos to Android users or other devices that lack HEIC codec support</li>
  <li>Archiving photos in a universally compatible format for long-term storage</li>
</ul>

<p>HEIC uses the HEVC (H.265) video codec for still images, storing them in an ISOBMFF container. Converting to JPG involves decoding the HEVC-compressed image data and re-encoding it using the standard JPEG DCT compression algorithm. The tool uses a WebAssembly-compiled HEIC decoder library to handle the H.265 decoding in the browser — no native OS codec or plugin is required. The decoded raw pixel data is then written to a JPEG encoder at your chosen quality setting.</p>

<p><strong>Input formats:</strong> .heic, .heif files (as exported by iPhone iOS 11+). <strong>Output format:</strong> JPG. <strong>Quality setting:</strong> 75%, 85%, 90%, or 95% JPEG quality. <strong>Metadata:</strong> EXIF data (date, camera settings, GPS location if present) is preserved in the converted JPG. <strong>Batch support:</strong> upload multiple HEIC files and convert all at once.</p>

<p>HEIC decoding runs in your browser using a WebAssembly HEIC decoder — your photos are never sent to any server. This is particularly important given that HEIC files often include GPS location metadata. All processing happens on your device, and no data is transmitted or stored. After converting, you can optionally strip location metadata using the <a href="/tools/image-tools/image-metadata-viewer">Image Metadata Viewer</a> before sharing.</p>
    `,
    extraFaqs: [
      {
        q: 'Will converting HEIC to JPG reduce photo quality?',
        a: 'At 90%+ JPG quality, the difference is imperceptible to the human eye. HEIC and JPG at high quality look visually identical in print and on screen. The main trade-off is file size — JPG files will be larger than the original HEIC.',
      },
      {
        q: 'What is the maximum file size supported?',
        a: 'Individual HEIC files up to 20 MB. When converting multiple files at once, the total batch should be under 200 MB for reliable browser processing.',
      },
      {
        q: 'Can I convert multiple HEIC files at once?',
        a: 'Yes — select or drag multiple .heic files and they are converted and packaged in a ZIP archive for download.',
      },
      {
        q: 'Does this work on iPhone and Android?',
        a: 'Yes. The HEIC decoder runs in any modern mobile browser. However, on iPhone, HEIC files in the Photos app may be stored as JPG already if "Most Compatible" is selected in Camera settings.',
      },
      {
        q: 'Are my photos stored after conversion?',
        a: 'No. The WebAssembly decoder processes everything locally. Your HEIC files are never sent to any server.',
      },
      {
        q: 'How do I stop my iPhone from taking HEIC photos?',
        a: 'Go to Settings → Camera → Formats and select "Most Compatible" — this makes your iPhone save photos as JPG instead of HEIC from that point forward.',
      },
    ],
    proTips: [
      "Use 90% JPG quality for general sharing — it's visually identical to HEIC quality but universally compatible. Only go to 95% if you're printing at large sizes.",
      'HEIC files contain full EXIF metadata including GPS coordinates — strip location data before sharing publicly using an EXIF remover if privacy is a concern.',
      'If you frequently need HEIC conversion, change your iPhone to "Most Compatible" format in Camera Settings — this saves photos as JPG directly and eliminates the conversion step.',
      'Batch convert your entire iPhone photo library by selecting all HEIC files in Windows File Explorer after connecting via USB — this is faster than converting individually.',
    ],
  },

  // ─── 13. id-card-photo-maker ────────────────────────────────────────────────
  'id-card-photo-maker': {
    slug: 'id-card-photo-maker',
    metaTitle: 'ID Card Photo Maker Free Online | RoughTools',
    metaDescription:
      'Create ID card photos in standard sizes for passports, visas, and government IDs. Free, instant, no signup.',
    canonicalUrl: 'https://roughtools.com/tools/image-tools/id-card-photo-maker',
    aboutHTML: `
<p>The <strong>ID Card Photo Maker</strong> crops and formats your photo to meet the exact size specifications required for passports, driver's licenses, visa applications, and other government identity documents. Different countries and document types have strict requirements for photo size, background color, head position, and print dimensions — this tool handles all the cropping and sizing automatically so you can print compliant ID photos at home.</p>

<p>This tool is needed for:</p>
<ul>
  <li>Preparing passport photos for US (2×2 inch), UK (35×45mm), EU (35×45mm), and other country specifications</li>
  <li>Creating visa application photos at the correct size and background color</li>
  <li>Generating driver's license and national ID card photos for official submissions</li>
  <li>Making employment ID and access card photos at corporate-standard dimensions</li>
  <li>Creating student ID and library card photos at school or institution specifications</li>
</ul>

<p>The tool uses face detection to automatically center your head within the ID photo frame according to the standard specification that requires the face to occupy 70–80% of the frame height. After auto-centering, you can manually adjust the crop position using drag handles. The background is optionally replaced with the required white or off-white color using a chroma-key detection algorithm that identifies the background area. The output image is sized at 300 DPI to meet print standards — a 2×2 inch output at 300 DPI produces a 600×600 pixel file.</p>

<p><strong>Size presets:</strong> US Passport (2×2 in), UK/EU Passport (35×45mm), Canadian Passport (50×70mm), Indian Passport (2×2 in), Chinese Visa (33×48mm), and custom dimensions. <strong>Background options:</strong> white, off-white, light gray, light blue. <strong>Output format:</strong> JPG at 300 DPI, ready to print. <strong>Print layout:</strong> generates a print sheet with 4–6 photos for standard 4×6 inch photo paper.</p>

<p>Photo processing happens on our secure server (for the AI face detection step) and your photo is immediately deleted after the formatted ID photo is returned. No images are stored or used for any purpose beyond the immediate formatting operation. For privacy when working with official documents, use the secure HTTPS connection and clear your browser history after downloading.</p>
    `,
    extraFaqs: [
      {
        q: 'Will the photo meet official government requirements?',
        a: 'The tool follows published dimension and background specifications for each country. However, requirements can change — always verify current requirements on the official government website before submitting.',
      },
      {
        q: 'What is the photo quality required for ID photos?',
        a: 'The output is at 300 DPI which meets print requirements for all government ID documents. Use a high-resolution source photo (at least 1000×1000px) for the sharpest result.',
      },
      {
        q: 'Can I create multiple ID photos from one session?',
        a: 'Yes — the print layout feature generates a sheet with 4–6 copies of your ID photo on a single 4×6 inch print, which is the standard format most photo print services accept.',
      },
      {
        q: 'Does this work on iPhone and Android?',
        a: 'Yes. Take a selfie or upload from your camera roll in any mobile browser, and the tool crops and formats the ID photo automatically.',
      },
      {
        q: 'Is my photo stored after creating the ID card photo?',
        a: 'Photos are processed on our server for face detection and immediately deleted after the formatted photo is returned. We retain no images.',
      },
      {
        q: "What if the face detection doesn't work correctly on my photo?",
        a: 'Use the manual crop handles to adjust the framing after the auto-center step. The tool always allows full manual override of the automated positioning.',
      },
    ],
    proTips: [
      'Photograph against a plain white or light gray wall with even lighting — this gives the AI the cleanest background detection and avoids the need for background replacement.',
      'Face the camera directly with a neutral expression and no glasses (most government IDs prohibit glasses now) — take the photo in good natural light from a window for the sharpest result.',
      "For US passport photos, the standard requires the face to be between 1 inch and 1 3/8 inches from chin to top of head — the tool's auto-crop handles this, but verify after cropping.",
      'Print on matte photo paper rather than glossy — most government offices prefer matte finish, and it scans more consistently when they digitize your application.',
    ],
  },

  // ─── 14. image-color-picker ──────────────────────────────────────────────────
  'image-color-picker': {
    slug: 'image-color-picker',
    metaTitle: 'Image Color Picker — Pick Colors Free Online | RoughTools',
    metaDescription:
      'Pick any color from an image and get the hex, RGB, and HSL values instantly. Free, browser-based color eyedropper.',
    canonicalUrl: 'https://roughtools.com/tools/image-tools/image-color-picker',
    aboutHTML: `
<p>The <strong>Image Color Picker</strong> is an online eyedropper tool that lets you click any pixel in an uploaded image to instantly retrieve its exact color values in hex, RGB, HSL, and CMYK formats. This eliminates the need to open Photoshop or any other design software just to sample a color — simply upload the image, click the pixel, and copy the color code.</p>

<p>The color picker is most useful for:</p>
<ul>
  <li>Sampling brand colors from a logo to use in CSS, HTML, or design files</li>
  <li>Matching a paint color by uploading a reference photo and extracting the closest hex value</li>
  <li>Identifying the exact color of a UI element in a screenshot for development work</li>
  <li>Creating a consistent color palette by sampling from inspiration photos or mood boards</li>
  <li>Finding the hex codes in a client's style guide image when only the visual is available</li>
</ul>

<p>Color picking works by reading the exact RGBA pixel values at the click coordinates from the HTML5 Canvas using the <code>getImageData()</code> method. This returns the raw red, green, blue, and alpha values (0–255 each) for that specific pixel. The tool then converts these values to hex (by converting each 0–255 value to two hexadecimal digits), HSL (by applying the standard RGB-to-HSL conversion formulas), and CMYK (by normalizing RGB values and calculating cyan, magenta, yellow, and key). All conversions happen instantly in the browser with no server communication.</p>

<p><strong>Input formats:</strong> JPG, PNG, WebP, BMP, GIF. <strong>Output formats:</strong> Hex (#RRGGBB), RGB (0–255 each channel), HSL (degrees, %, %), CMYK (0–100 each channel). <strong>Zoom:</strong> magnifier lens shows a zoomed preview around the cursor for precise pixel selection. <strong>History:</strong> last 10 sampled colors are displayed for easy comparison. <strong>Copy:</strong> click any color format to copy it to clipboard.</p>

<p>All image data stays in your browser — nothing is uploaded to any server. The Canvas pixel manipulation is entirely client-side. For extracting multiple dominant colors from an image at once rather than clicking individual pixels, use the <a href="/tools/image-tools/dominant-color-extractor">Dominant Color Extractor</a> tool.</p>
    `,
    extraFaqs: [
      {
        q: 'Does reading pixel colors change my image in any way?',
        a: 'No. The color picker only reads pixel data — it does not modify the image. Your original file is never altered.',
      },
      {
        q: 'What is the maximum image size supported?',
        a: 'Images up to 20 MB and 8000×8000 pixels. Very large images render the full resolution for precise single-pixel sampling.',
      },
      {
        q: 'Can I pick colors from multiple images at once?',
        a: 'Load one image at a time. Use the color history panel (shows last 10 samples) to compare colors across sessions.',
      },
      {
        q: 'Does this work on iPhone and Android?',
        a: 'Yes. Tap any pixel on the image in any mobile browser to sample its color. The magnifier works on touch screens.',
      },
      {
        q: 'Are my images stored after color picking?',
        a: "No. The image stays in your browser's memory only. Nothing is uploaded or stored.",
      },
      {
        q: 'Why does the color I pick look slightly different from what I see?',
        a: 'Monitors display colors with gamma correction and color profiles that can shift perceived color. The hex value returned is the raw pixel value before display rendering. Color-managed workflows may show slight discrepancies.',
      },
    ],
    proTips: [
      'Use the magnifier lens to zoom in to 800% before clicking — JPEG compression creates color noise around edges, and adjacent pixels can differ by 5–10 values from what appears as a solid color.',
      'For sampling background colors from web screenshots, take screenshots at 1:1 display scale (100% zoom in browser) — scaled screenshots average pixels and shift color values.',
      'Save your sampled colors by copying hex codes to a simple text file — the in-tool history only shows the last 10 samples and clears when you reload the page.',
      'CMYK values from this tool are mathematical conversions and may not match professional print profiles — for precise print color matching, use a calibrated proofing system.',
    ],
  },

  // ─── 15. image-colorizer ──────────────────────────────────────────────────────
  'image-colorizer': {
    slug: 'image-colorizer',
    metaTitle: 'Image Colorizer — Colorize B&W Photos Free | RoughTools',
    metaDescription:
      'Automatically colorize black and white photos using AI. Free online tool, realistic color, no signup required.',
    canonicalUrl: 'https://roughtools.com/tools/image-tools/image-colorizer',
    aboutHTML: `
<p>The <strong>Image Colorizer</strong> uses artificial intelligence to automatically add realistic color to black-and-white photographs. Historical photos, old family portraits, classic film stills, and vintage images can be transformed with natural, plausible colors in seconds — bringing old memories to life without any manual painting or color adjustment.</p>

<p>AI photo colorization is useful for:</p>
<ul>
  <li>Colorizing old family photographs from the early 20th century for family history projects</li>
  <li>Restoring the look of historical archive images for documentary and educational use</li>
  <li>Creating artistic colorized versions of classic black-and-white cinema stills</li>
  <li>Colorizing vintage medical, scientific, or engineering photography for presentations</li>
  <li>Adding color to architectural drawings and technical photography for visualization</li>
</ul>

<p>The colorization model is a conditional generative adversarial network (cGAN) trained on millions of color photographs from which the color channels were artificially removed. The network learns to predict plausible color values for grayscale input by learning statistical relationships between image content and color — grass tends to be green, sky tends to be blue, faces tend to have warm skin tones. During inference, the grayscale input image is processed through the generator network which predicts the a and b color channels in the Lab color space, and these are combined with the original lightness channel (L) to produce the colorized output.</p>

<p><strong>Input formats:</strong> JPG, PNG, WebP (grayscale or desaturated images; color images are automatically desaturated). <strong>Output format:</strong> JPG. <strong>Maximum input size:</strong> 10 MB. Processing is performed on a GPU-accelerated server and typically completes in 5–20 seconds. The AI produces plausible colors but does not know the original colors — results are an educated guess based on image content.</p>

<p>Images are transmitted over HTTPS to our AI processing server and deleted immediately after the colorized result is returned to your browser. No training data is collected from your images. Results may vary — for the best output, use high-contrast grayscale images with clear subject matter. After colorizing, you can fine-tune colors using the <a href="/tools/image-tools/image-color-adjuster">Image Color Adjuster</a>.</p>
    `,
    extraFaqs: [
      {
        q: 'How accurate are the AI-predicted colors?',
        a: 'The AI predicts plausible colors based on image content — it has no way to know the original colors. Results are often surprisingly accurate for natural scenes (skin, sky, grass) but may be incorrect for clothing, painted surfaces, or objects with no inherent "expected" color.',
      },
      {
        q: 'What is the maximum image resolution supported?',
        a: 'Images up to 10 MB and 2048×2048px for best results. Higher resolution images are downsampled for AI processing and upsampled in the result.',
      },
      {
        q: 'Can I colorize multiple photos at once?',
        a: 'Batch colorization is not currently available. Process one image at a time for the best results and to manage processing time.',
      },
      {
        q: 'Does this work on iPhone and Android?',
        a: 'Yes. Upload from your camera roll and the colorized result downloads to your device in any mobile browser.',
      },
      {
        q: 'Are my photos stored after colorization?',
        a: 'Photos are deleted from the processing server immediately after the colorized result is returned. No images are retained.',
      },
      {
        q: 'Can I colorize a photo that is already in color?',
        a: 'The tool automatically converts color images to grayscale before colorizing. This is generally not useful — starting with an original black-and-white photo produces the best results.',
      },
    ],
    proTips: [
      'Enhance contrast and sharpness in your grayscale photo before colorizing — the AI uses tonal information to infer color, so clearer tonal separation produces more accurate colorization.',
      'After downloading the colorized image, selectively adjust specific colors using the Image Color Adjuster — AI colorization often gets the overall tone right but may need fine-tuning on clothing or specific objects.',
      'For portrait photos, the AI typically handles skin tones very well — focus your manual corrections on clothing and background elements where color prediction is most uncertain.',
      'The AI works best on photos from the 1920s–1960s era where image quality is still reasonably high — extremely old or damaged photographs with low contrast may produce muted or muddy colorization.',
    ],
  },

  // ─── 16. image-compressor ────────────────────────────────────────────────────
  'image-compressor': {
    slug: 'image-compressor',
    metaTitle: 'Image Compressor — Reduce Image Size Free | RoughTools',
    metaDescription:
      'Compress JPG, PNG, and WebP images online. Reduce file size up to 90% without visible quality loss. Free.',
    canonicalUrl: 'https://roughtools.com/tools/image-tools/image-compressor',
    aboutHTML: `
<p>The <strong>Image Compressor</strong> reduces the file size of JPG, PNG, and WebP images while preserving visual quality. Smaller images load faster, consume less storage, and meet file size limits on email, social media, and web forms — making image compression one of the most practical tools for anyone who works with digital photos or graphics regularly.</p>

<p>Image compression is essential for:</p>
<ul>
  <li>Reducing website image file sizes to improve page load speed and Core Web Vitals scores</li>
  <li>Fitting images within email attachment size limits without quality loss</li>
  <li>Compressing product photos to meet marketplace file size requirements</li>
  <li>Reducing storage usage on cloud services and phones without deleting photos</li>
  <li>Optimizing social media images for faster sharing and upload</li>
</ul>

<p>The compressor uses different algorithms per format. For JPGs, it adjusts the quantization tables used in the Discrete Cosine Transform (DCT) compression step — lower quality settings use coarser quantization tables that discard more high-frequency detail, achieving smaller files at the cost of visible compression artifacts at very low settings. For PNGs, it applies pngquant-style palette quantization to reduce bit depth from 32-bit to 8-bit where possible, combined with zlib compression level tuning. For WebP, it uses the Google libwebp encoder's quality parameter. All three methods are lossy for photographs but can achieve 60–90% size reduction at perceptually lossless quality levels.</p>

<p><strong>Input formats:</strong> JPG, PNG, WebP, BMP, GIF. <strong>Quality slider:</strong> 0–100 (80–90 recommended for photographic content). <strong>Output format:</strong> same as input (JPG→JPG, PNG→PNG) or convert to WebP for maximum compression. <strong>Batch support:</strong> compress multiple images at once. All processing is browser-based.</p>

<p>The entire compression operation runs locally in your browser using JavaScript image processing libraries compiled to WebAssembly. No images are uploaded to any server. For web optimization specifically, after compressing you should also consider <a href="/tools/image-tools/image-resizer">resizing images</a> to the exact display dimensions to eliminate unnecessary pixels.</p>
    `,
    extraFaqs: [
      {
        q: 'What compression ratio can I expect?',
        a: 'At quality 80, most JPG photos compress 50–70%. PNG files with many colors compress 40–60%. WebP output at quality 80 typically achieves 25–35% smaller than equivalent JPG at the same visual quality.',
      },
      {
        q: 'What is the maximum image size supported?',
        a: 'Individual images up to 20 MB. Batch compression supports up to 50 images per session.',
      },
      {
        q: 'Can I compress multiple images at once?',
        a: 'Yes — select multiple files and they are all compressed with the same quality setting. Download all as a ZIP archive.',
      },
      {
        q: 'Does this work on iPhone and Android?',
        a: 'Yes. Browser-based compression runs on all modern mobile browsers. Processing speed depends on device CPU.',
      },
      {
        q: 'Are my images stored after compression?',
        a: 'No. Compression runs locally in your browser. Nothing is uploaded or stored.',
      },
      {
        q: 'Can I choose between lossy and lossless compression?',
        a: 'For JPG, all compression is lossy by nature. For PNG, setting quality to 100 applies only lossless zlib compression without palette reduction. For WebP, both lossy and lossless modes are available.',
      },
    ],
    proTips: [
      'For web images, target 100–150KB for content images and under 50KB for thumbnails — this keeps page load under 2 seconds on mobile connections.',
      'WebP format achieves 25–35% smaller files than JPG at the same visual quality — convert to WebP for all web images where browser support allows.',
      'Never compress an already-compressed JPG — each compression cycle degrades quality cumulatively. Always compress from the highest-quality source file.',
      'For e-commerce product images, 85% JPG quality is the industry standard — it produces imperceptible quality loss with significant size reduction that speeds up product page loading.',
    ],
  },

  // ─── 17. image-converter ──────────────────────────────────────────────────────
  'image-converter': {
    slug: 'image-converter',
    metaTitle: 'Image Format Converter Free Online | RoughTools',
    metaDescription:
      'Convert images between JPG, PNG, WebP, BMP, TIFF, GIF formats online. Free, instant, no signup.',
    canonicalUrl: 'https://roughtools.com/tools/image-tools/image-converter',
    aboutHTML: `
<p>The <strong>Image Format Converter</strong> converts images between all major formats — JPG, PNG, WebP, BMP, TIFF, GIF, and ICO — in seconds. Different contexts require different image formats: web images need JPG or WebP, logos need PNG transparency, printing workflows need TIFF, and Windows applications need BMP. This converter handles all cross-format conversions in one place without installing any software.</p>

<p>Format conversion is needed when:</p>
<ul>
  <li>Converting PNG logos to JPG for platforms that don't support PNG</li>
  <li>Converting BMP files (from Windows Paint) to JPG or PNG for web use</li>
  <li>Converting WebP images downloaded from Chrome to JPG for compatibility with older software</li>
  <li>Converting JPG photos to TIFF for professional print workflows requiring lossless source files</li>
  <li>Converting any format to WebP to achieve modern web compression standards</li>
</ul>

<p>Format conversion is performed using the HTML5 Canvas API's <code>toDataURL()</code> method, which renders the decoded source image and re-encodes it in the target format using the browser's native codec implementations. For formats not natively supported by the browser (TIFF, BMP, ICO), dedicated JavaScript decoder/encoder libraries compiled to WebAssembly handle the binary format parsing and generation. PNG output preserves alpha transparency from source images that have it. JPG output fills transparent areas with white by default (since JPG has no alpha channel).</p>

<p><strong>Input formats:</strong> JPG, JPEG, PNG, WebP, GIF, BMP, TIFF, HEIC (via WebAssembly decoder), ICO. <strong>Output formats:</strong> JPG, PNG, WebP, BMP, TIFF, ICO, GIF. <strong>Quality control:</strong> adjustable for JPG and WebP output. <strong>Batch conversion:</strong> convert multiple files at once to the same target format. <strong>Transparency handling:</strong> preserved for PNG, WebP output; white-filled for JPG output.</p>

<p>All conversion runs in your browser — no files are transmitted to any server. This is the safest and fastest option for format conversion without cloud storage risk. After conversion, you may want to use the <a href="/tools/image-tools/image-compressor">Image Compressor</a> to optimize the file size of your converted images before uploading or sharing.</p>
    `,
    extraFaqs: [
      {
        q: 'Will converting between formats reduce image quality?',
        a: 'Converting to JPG always involves some lossy compression. Converting to PNG or TIFF is lossless. Converting from a lossy format (JPG) to a lossless one (PNG) does not recover quality lost in the original — it just freezes the current quality.',
      },
      {
        q: 'What is the maximum image size supported?',
        a: 'Individual files up to 20 MB. The TIFF encoder has a 50 MB output limit. Batch conversion supports up to 50 images.',
      },
      {
        q: 'Can I convert multiple images at once?',
        a: 'Yes — select multiple files to convert them all to the same target format. Download as a ZIP archive.',
      },
      {
        q: 'Does this work on iPhone and Android?',
        a: 'Yes. All conversions run in any modern mobile browser.',
      },
      {
        q: 'Are my images stored after conversion?',
        a: 'No. All conversion is browser-based. No files leave your device.',
      },
      {
        q: 'Can I convert SVG to raster formats like PNG or JPG?',
        a: 'Yes — upload an SVG file and the canvas renderer will draw it at the specified output resolution. For high-quality SVG rasterization, specify a large output resolution (e.g., 2000px wide).',
      },
    ],
    proTips: [
      'When converting JPG to PNG for editing, remember that PNG only preserves the current JPG quality — it does not restore lost quality. For best results, always edit from the highest-quality source.',
      'BMP files are completely uncompressed and very large — always convert BMP to JPG or PNG before sharing or uploading to reduce file size by 90%+ instantly.',
      'WebP is the best modern format for web images: 25–35% smaller than JPG at equivalent quality, with full alpha transparency support. Convert all web images to WebP for maximum performance.',
      'When converting to ICO (Windows icon) format, the tool generates all standard icon sizes (16×16, 32×32, 48×48) in a single multi-resolution ICO file — upload your largest source image for best results.',
    ],
  },

  // ─── 18. image-cropper ───────────────────────────────────────────────────────
  'image-cropper': {
    slug: 'image-cropper',
    metaTitle: 'Image Cropper — Crop Photos Free Online | RoughTools',
    metaDescription:
      'Crop images to exact dimensions or aspect ratios. Free online photo cropper with drag, zoom, and rotate.',
    canonicalUrl: 'https://roughtools.com/tools/image-tools/image-cropper',
    aboutHTML: `
<p>The <strong>Image Cropper</strong> lets you precisely select and extract a portion of any image using drag-and-drop crop handles, aspect ratio presets, and manual dimension entry. Cropping is one of the most fundamental image editing operations — whether you need to remove distracting edges, reframe a subject, or cut an image to exact social media dimensions, this tool gives you full control without complex software.</p>

<p>Image cropping is needed for:</p>
<ul>
  <li>Cropping photos to the exact aspect ratio required by a social media platform (1:1 for Instagram, 16:9 for YouTube thumbnails, 4:5 for Facebook posts)</li>
  <li>Removing unwanted borders, timestamps, or UI elements from screenshots</li>
  <li>Reframing a portrait to follow the rule of thirds for better composition</li>
  <li>Extracting a specific region of interest from a larger document or map scan</li>
  <li>Cutting a group photo down to a single person for a profile picture</li>
</ul>

<p>The cropper renders the full image on an HTML5 Canvas and overlays a moveable, resizable selection rectangle. When you confirm the crop, the tool uses <code>canvas.drawImage()</code> with source coordinates (sx, sy, sw, sh) mapped to your selection to extract only the selected region and render it on a new canvas at the selected dimensions. The extracted region is then encoded and downloaded. This is a lossless operation for PNG output (all selected pixels are preserved exactly). For JPG output, the cropped region is encoded with your chosen quality setting.</p>

<p><strong>Input formats:</strong> JPG, PNG, WebP, BMP, GIF. <strong>Aspect ratio presets:</strong> 1:1, 4:3, 3:2, 16:9, 9:16, 2:1, and freeform. <strong>Manual entry:</strong> type exact pixel dimensions for the crop area. <strong>Zoom and pan:</strong> zoom into the image to select precise crop boundaries. <strong>Rotation:</strong> rotate the crop selection 90° or enter a custom angle. <strong>Output:</strong> JPG or PNG.</p>

<p>All cropping runs in your browser. The image never leaves your device. No server processing, no uploads, no storage. The operation completes in under a second for most images. For related operations, consider <a href="/tools/image-tools/image-resizer">resizing the cropped image</a> to a specific output dimension, or using the <a href="/tools/image-tools/image-compressor">Image Compressor</a> to optimize the output for web sharing.</p>
    `,
    extraFaqs: [
      {
        q: 'Will cropping reduce my image quality?',
        a: 'No — cropping only removes pixels outside the selection. The selected pixels are preserved exactly. PNG output is lossless. JPG output applies the quality setting you choose.',
      },
      {
        q: 'What is the maximum image size supported?',
        a: 'Images up to 20 MB and 8000×8000 pixels. The full resolution is maintained for precise cropping even on large images.',
      },
      {
        q: 'Can I crop multiple images at once?',
        a: 'Currently one image per session. For batch cropping to the same dimensions, use the Bulk Image Resizer which includes cropping to exact dimensions.',
      },
      {
        q: 'Does this work on iPhone and Android?',
        a: 'Yes. Touch drag to move the crop selection and pinch to zoom on mobile browsers.',
      },
      {
        q: 'Are my images stored after cropping?',
        a: 'No. Cropping is entirely browser-based. Nothing is uploaded or stored.',
      },
      {
        q: 'Can I undo a crop after downloading?',
        a: 'You cannot undo a crop on a downloaded file — always keep your original. The tool keeps the original in memory during your session if you want to re-crop.',
      },
    ],
    proTips: [
      'Use the 1:1 aspect ratio preset when cropping profile photos for any social platform — most profile pictures are displayed as squares or circles, and cropping to exactly 1:1 prevents awkward auto-cropping by the platform.',
      'Enable the rule-of-thirds overlay in the crop tool to align your subject at the intersection points — this dramatically improves portrait and landscape composition.',
      'When cropping to a specific pixel size (e.g., exactly 1200×628 for an OpenGraph image), type the dimensions manually rather than dragging — manual entry is pixel-perfect.',
      'For screenshots with visible browser chrome or OS UI, crop generously — a few extra pixels of unwanted content look unprofessional in documentation and presentations.',
    ],
  },

  // ─── 19. image-enhancer ──────────────────────────────────────────────────────
  'image-enhancer': {
    slug: 'image-enhancer',
    metaTitle: 'Image Enhancer — Improve Photo Quality Free | RoughTools',
    metaDescription:
      'Enhance photo quality automatically with AI. Improve sharpness, brightness, and detail. Free online tool.',
    canonicalUrl: 'https://roughtools.com/tools/image-tools/image-enhancer',
    aboutHTML: `
<p>The <strong>Image Enhancer</strong> automatically improves the visual quality of photos by applying a combination of sharpening, contrast enhancement, noise reduction, and color correction — all calibrated to produce natural-looking improvements rather than over-processed results. Whether your photo is slightly underexposed, soft-focused, or just lacks visual punch, the enhancer applies smart adjustments to make it look its best.</p>

<p>Auto-enhancement works well for:</p>
<ul>
  <li>Improving the quality of photos taken in low light or with poor phone camera settings</li>
  <li>Giving slightly flat or dull images more visual impact for social media sharing</li>
  <li>Quick-fixing a batch of product photos that were captured inconsistently</li>
  <li>Improving the legibility of documents or whiteboard photos taken in suboptimal conditions</li>
  <li>Enhancing old, scanned photographs before sharing or printing</li>
</ul>

<p>The enhancement pipeline applies operations in a specific order to avoid compounding artifacts. First, a noise reduction pass (using a bilateral filter that smooths uniform areas while preserving edges) removes sensor noise and JPEG compression artifacts. Next, adaptive histogram equalization (CLAHE — Contrast Limited Adaptive Histogram Equalization) improves local contrast by stretching the tonal range in each local area of the image independently, preventing overexposure in bright areas while brightening shadows. Finally, an unsharp mask operation sharpens edges by subtracting a blurred version of the image from itself, restoring the apparent sharpness lost during noise reduction.</p>

<p><strong>Input formats:</strong> JPG, PNG, WebP. <strong>Enhancement modes:</strong> Auto (recommended), Portrait (skin tone optimized), Landscape (sky and foliage optimized), Document (contrast and sharpness for text). <strong>Intensity slider:</strong> 25%, 50%, 75%, 100%. <strong>Before/after preview:</strong> drag the split slider to compare enhanced vs. original. <strong>Output format:</strong> JPG or PNG.</p>

<p>Enhancement processing runs on our server using optimized image processing libraries. Your image is transmitted over HTTPS and immediately deleted after the enhanced result is returned. No images are stored, analyzed, or used for training. For more targeted adjustments, use the <a href="/tools/image-tools/image-color-adjuster">Image Color Adjuster</a> to manually tune specific parameters after auto-enhancement.</p>
    `,
    extraFaqs: [
      {
        q: 'Will auto-enhancement reduce image quality?',
        a: 'Enhancement is designed to improve quality. At moderate intensity settings, the result looks better than the input. At 100% intensity on already high-quality photos, occasional minor over-processing can occur — use 50–75% for those.',
      },
      {
        q: 'What is the maximum image size supported?',
        a: 'Images up to 10 MB. Higher resolution inputs produce better enhancement results because there is more detail for the algorithm to work with.',
      },
      {
        q: 'Can I enhance multiple images at once?',
        a: 'Batch enhancement is not currently available. Process images one at a time.',
      },
      {
        q: 'Does this work on iPhone and Android?',
        a: 'Yes. Upload from your camera roll in any mobile browser and download the enhanced result.',
      },
      {
        q: 'Are my photos stored after enhancement?',
        a: 'No. Photos are processed on our server and deleted immediately after the enhanced result is delivered to your browser.',
      },
      {
        q: 'What type of photos benefit most from auto-enhancement?',
        a: 'Underexposed indoor photos, overcast day shots, and slightly soft-focus photos show the most dramatic improvement. Already well-exposed, sharp photos show minimal change — which is the correct behavior.',
      },
    ],
    proTips: [
      'Use Portrait mode for people photos — it applies gentler skin smoothing and avoids the over-sharpening that makes pores and blemishes more visible.',
      'Start at 50% intensity and compare with the before/after slider — you can always re-process at higher intensity, but you cannot undo over-processing on a downloaded file.',
      'For photos taken in mixed artificial and natural lighting, run the enhancer before adjusting white balance — it often corrects color cast automatically.',
      'Document mode works exceptionally well for whiteboard photos and scanned text — it maximizes contrast between text and background, making even poor-quality document photos highly legible.',
    ],
  },

  // ─── 20. image-flipper-rotator ───────────────────────────────────────────────
  'image-flipper-rotator': {
    slug: 'image-flipper-rotator',
    metaTitle: 'Image Flipper & Rotator Free Online | RoughTools',
    metaDescription:
      'Flip images horizontally or vertically and rotate to any angle. Free, instant, browser-based.',
    canonicalUrl: 'https://roughtools.com/tools/image-tools/image-flipper-rotator',
    aboutHTML: `
<p>The <strong>Image Flipper & Rotator</strong> lets you mirror and rotate any image in one step — flip horizontally to create a mirror image, flip vertically to turn it upside down, or rotate to any angle from 1° to 359°. These are some of the most frequently needed non-destructive image adjustments, and this tool handles them entirely in your browser with no software required.</p>
<p>Flipping and rotating images is needed for:</p>
<ul>
  <li>Correcting portrait photos that uploaded with the wrong orientation (sideways or upside down)</li>
  <li>Mirroring selfie photos that look reversed compared to what you see in a mirror</li>
  <li>Creating symmetrical designs by flipping one half to produce the other</li>
  <li>Fixing scanned documents that were placed upside down on the scanner</li>
  <li>Rotating product photos to show different angles or correct camera tilt</li>
</ul>
<p>Rotation is performed using canvas affine transformation — the image is drawn onto a rotated canvas context using <code>ctx.rotate(angle)</code> and <code>ctx.translate()</code> to keep the center of the image fixed. For 90° and 270° rotations, the canvas dimensions are swapped (width becomes height). For arbitrary angles, the canvas is expanded to prevent corners from being clipped. Horizontal flip uses <code>ctx.scale(-1, 1)</code> before drawing, and vertical flip uses <code>ctx.scale(1, -1)</code> — both are single-pass operations that complete instantly.</p>
<p><strong>Input formats:</strong> JPG, PNG, WebP, BMP, GIF. <strong>Flip options:</strong> horizontal (mirror), vertical (upside down). <strong>Rotation:</strong> 90° left, 90° right, 180°, or enter any custom angle. <strong>Background fill:</strong> for non-90° rotations, uncovered corners fill with white (JPG) or transparent (PNG). <strong>Output:</strong> JPG or PNG at the original resolution.</p>
<p>All operations run in your browser — no uploads, no server processing, no storage. The transformed image is generated locally and downloaded instantly. After rotating or flipping, you may want to use the <a href="/tools/image-tools/image-cropper">Image Cropper</a> to trim any white corner areas created by non-90° rotations.</p>
    `,
    extraFaqs: [
      {
        q: 'Will rotating or flipping reduce image quality?',
        a: 'For 90°, 180°, and 270° rotations, quality is fully preserved — these are lossless rotations. For arbitrary angles, PNG output is lossless. JPG output at 90%+ quality is imperceptible.',
      },
      {
        q: 'What is the maximum image size supported?',
        a: 'Images up to 20 MB and 8000×8000 pixels.',
      },
      {
        q: 'Can I flip and rotate multiple images at once?',
        a: 'One image at a time. Apply the same transformation to multiple images by processing each individually.',
      },
      {
        q: 'Does this work on iPhone and Android?',
        a: 'Yes. The tool runs in any mobile browser — useful for quickly fixing orientation on phone photos.',
      },
      {
        q: 'Are my images stored after transformation?',
        a: 'No. All operations happen in your browser. Nothing is uploaded or stored.',
      },
      {
        q: 'What happens to the corners when I rotate by an arbitrary angle?',
        a: 'The canvas expands to accommodate the rotated image, and the exposed corner areas are filled with white (for JPG) or transparent (for PNG). Use the Image Cropper to trim these areas if needed.',
      },
    ],
    proTips: [
      'JPEG photos taken with a phone are often stored with an EXIF orientation tag rather than physically rotating — if a photo looks correct on your phone but sideways online, use 90° rotation to match the EXIF orientation in the pixel data.',
      'For exact 90° and 270° rotations, always choose PNG output — these are mathematically lossless for PNG and avoid JPEG re-compression quality loss.',
      'When creating mirror-image compositions, flip the original, then combine the original and flipped versions side-by-side using the Photo Collage Maker.',
      'For rotating scanned documents, use the straighten option if available — even a 1–2° rotation can make text significantly easier to read on a crooked scan.',
    ],
  },

  // ─── 21. image-metadata-viewer ───────────────────────────────────────────────
  'image-metadata-viewer': {
    slug: 'image-metadata-viewer',
    metaTitle: 'Image Metadata Viewer — View EXIF Data Free | RoughTools',
    metaDescription:
      'View and extract EXIF metadata from any photo. See camera settings, GPS location, date. Free, browser-based.',
    canonicalUrl: 'https://roughtools.com/tools/image-tools/image-metadata-viewer',
    aboutHTML: `
<p>The <strong>Image Metadata Viewer</strong> reads and displays all EXIF, IPTC, and XMP metadata embedded in your image files — revealing the camera make and model, lens focal length, aperture, shutter speed, ISO, GPS coordinates, date and time of capture, copyright notice, and dozens of other technical and descriptive fields. This information is invisible in the image itself but stored in the file header and is essential for photographers, investigators, and privacy-conscious users.</p>
<p>Viewing image metadata is useful for:</p>
<ul>
  <li>Checking the GPS coordinates embedded in a photo to verify where it was taken</li>
  <li>Retrieving camera settings (aperture, shutter, ISO) from a photo to learn from it or reproduce the shot</li>
  <li>Verifying the original capture date of a photo for legal or insurance purposes</li>
  <li>Checking which camera or lens produced a photo when reviewing equipment</li>
  <li>Identifying metadata that should be removed before sharing publicly (location data, author name)</li>
</ul>
<p>Metadata extraction uses the ExifReader JavaScript library, which implements the TIFF-based EXIF specification along with IPTC and XMP parsing. The library reads the binary file header in the browser memory, locates the APP1 marker in JPEG files (or the relevant chunks in PNG and TIFF), and parses the tag structure according to the EXIF 2.3 standard. GPS coordinates are decoded from their rational number representation and converted to decimal degrees. All parsing runs in the browser with no server involvement.</p>
<p><strong>Input formats:</strong> JPG, JPEG, TIFF, PNG (limited metadata), HEIC, WebP. <strong>Displayed fields:</strong> camera make/model, lens, focal length, aperture (f-stop), shutter speed, ISO, flash, date/time, GPS coordinates (with map link), image dimensions, color space, copyright. <strong>Export:</strong> copy all metadata as JSON or plain text. <strong>Strip option:</strong> download the image with all metadata removed.</p>
<p>Your image is read entirely in the browser — no file data leaves your device at any point. This makes the tool safe for examining images with potentially sensitive embedded data before deciding whether to share them. To remove metadata before sharing, use the strip option built into this tool or the dedicated <a href="/tools/image-tools/image-compressor">Image Compressor</a> which optionally strips metadata during compression.</p>
    `,
    extraFaqs: [
      {
        q: 'Will viewing metadata change my image in any way?',
        a: 'No. Metadata viewing is read-only — your image file is never modified.',
      },
      {
        q: 'What is the maximum file size supported for metadata reading?',
        a: 'Metadata reading works on any file size since only the header bytes are parsed, not the full image data.',
      },
      {
        q: 'Can I view metadata on multiple images at once?',
        a: 'One image at a time. The metadata from each image is displayed as you load it.',
      },
      {
        q: 'Does this work on iPhone and Android?',
        a: 'Yes. Load any image from your camera roll in any mobile browser to view its embedded metadata.',
      },
      {
        q: 'Is my image sent anywhere during metadata reading?',
        a: 'No. All parsing happens in your browser. Your image never leaves your device.',
      },
      {
        q: 'Why does my image show no GPS data?',
        a: 'GPS data is only present if location services were enabled on the camera when the photo was taken. Many cameras and phones allow disabling GPS tagging in settings.',
      },
    ],
    proTips: [
      'Before posting photos online or in documents, always check for GPS coordinates — many smartphone photos contain precise home or workplace location data that can reveal your address.',
      'The camera date/time field is only as accurate as the camera clock setting — cameras never connected to the internet may have incorrect dates, especially after battery replacement.',
      'For copyright verification, look for the Copyright and Artist EXIF fields — professional photographers often embed their name and copyright year here for licensing documentation.',
      'RAW files from DSLRs contain far more metadata than JPEGs — if you need complete metadata for a RAW file, convert it to TIFF to preserve the full metadata set.',
    ],
  },

  // ─── 22. image-resizer ────────────────────────────────────────────────────────
  'image-resizer': {
    slug: 'image-resizer',
    metaTitle: 'Image Resizer — Resize Images Free Online | RoughTools',
    metaDescription:
      'Resize images to exact pixel dimensions or percentage. Free online tool, preserves quality. No signup.',
    canonicalUrl: 'https://roughtools.com/tools/image-tools/image-resizer',
    aboutHTML: `
<p>The <strong>Image Resizer</strong> lets you change the dimensions of any image to exact pixel sizes, specific aspect ratios, or a percentage of the original size. Whether you need a specific size for a social media profile photo, a product listing, a banner, or a web page, the image resizer gives you pixel-perfect control with real-time preview and instant browser-based processing.</p>
<p>Image resizing is needed for:</p>
<ul>
  <li>Resizing profile photos to platform-specific requirements (400×400 for Twitter, 320×320 for Instagram)</li>
  <li>Scaling down high-resolution DSLR photos for web upload without degrading quality visually</li>
  <li>Resizing product images to consistent dimensions before e-commerce listing</li>
  <li>Reducing image file size before emailing by scaling to smaller dimensions</li>
  <li>Upscaling small images for presentations where a larger size is needed</li>
</ul>
<p>Resizing is performed via the HTML5 Canvas API with optional high-quality interpolation. When downscaling, the tool uses a Lanczos resampling algorithm (via a WebAssembly implementation) for the sharpest possible results — Lanczos produces visibly sharper edges than the default browser bilinear interpolation, especially on images with text and fine detail. When upscaling, bilinear interpolation is used since true upscaling cannot recover detail that doesn't exist in the source. Aspect ratio locking is enforced mathematically to prevent any distortion.</p>
<p><strong>Input formats:</strong> JPG, PNG, WebP, BMP, GIF. <strong>Resize modes:</strong> exact width×height, width only (auto height), height only (auto width), or percentage scale. <strong>Aspect ratio:</strong> locked by default, unlockable for stretch resizing. <strong>Output format:</strong> JPG or PNG. <strong>Max input:</strong> 20 MB. All processing is browser-based.</p>
<p>Resizing happens entirely in your browser — no file is uploaded to any server. The resized image is generated locally and downloaded directly to your device. For a batch of images all needing the same dimensions, use the <a href="/tools/image-tools/bulk-image-resizer">Bulk Image Resizer</a>. After resizing, compress the output with the <a href="/tools/image-tools/image-compressor">Image Compressor</a> to minimize file size further.</p>
    `,
    extraFaqs: [
      {
        q: 'Will resizing reduce image quality?',
        a: 'Downscaling always reduces pixel count — this is unavoidable. Using Lanczos resampling minimizes visible quality loss. Upscaling adds pixels using interpolation but cannot recover detail that was not in the source.',
      },
      {
        q: 'What is the maximum image size supported?',
        a: 'Input images up to 20 MB and 8000×8000 pixels. Output is limited to 8000×8000px.',
      },
      {
        q: 'Can I resize multiple images at once?',
        a: 'Use the Bulk Image Resizer for batch operations — it handles up to 100 images simultaneously.',
      },
      {
        q: 'Does this work on iPhone and Android?',
        a: 'Yes. The resizer runs in any modern mobile browser with full touch support.',
      },
      {
        q: 'Are my images stored after resizing?',
        a: 'No. Everything runs in your browser. Nothing is uploaded or stored.',
      },
      {
        q: 'Can I resize to a percentage rather than exact pixels?',
        a: 'Yes — enter a percentage (e.g., 50%) to scale the image to half its current dimensions, preserving aspect ratio automatically.',
      },
    ],
    proTips: [
      'For retina/HiDPI displays, always resize images to 2× the display size — a 600px wide image needs to be 1200px to appear sharp on modern MacBooks and iPhones.',
      'When resizing for specific social platforms, check the recommended sizes rather than the minimum — Instagram recommends 1080×1080 minimum for posts, not 600×600.',
      'Downscaling a large photo to a smaller size is always better quality than upscaling a small photo — always start with the highest resolution source available.',
      'PNG files with large dimensions but simple content (logos, icons) often compress dramatically on resize — a 500×500 PNG logo may be 5× smaller than a 2000×2000 version.',
    ],
  },

  // ─── 23. image-size-checker ──────────────────────────────────────────────────
  'image-size-checker': {
    slug: 'image-size-checker',
    metaTitle: 'Image Size Checker — Check Photo Dimensions Free',
    metaDescription:
      'Check image file size, dimensions, resolution, and format instantly. Free, browser-based, no signup.',
    canonicalUrl: 'https://roughtools.com/tools/image-tools/image-size-checker',
    aboutHTML: `
<p>The <strong>Image Size Checker</strong> instantly displays the file size, pixel dimensions, DPI/PPI resolution, color mode, and format of any image you upload. This is the quickest way to verify an image meets specific requirements before submission — whether you're checking that a photo meets a job application's file size limit, verifying that a print image has sufficient DPI, or confirming dimensions before uploading to a specific platform.</p>
<p>Checking image size and properties is useful for:</p>
<ul>
  <li>Verifying that a photo meets the file size limit for an online form or application portal</li>
  <li>Confirming that a print image has at least 300 DPI before sending to a printer</li>
  <li>Checking that an image meets the minimum pixel dimensions for a platform (e.g., 1000×1000 for Amazon product images)</li>
  <li>Identifying image format to determine compatibility with a target system</li>
  <li>Auditing a batch of website images to find oversized files that slow page loading</li>
</ul>
<p>Image analysis reads the binary file header to extract format-specific metadata without fully decoding the image. File size is the actual disk size in bytes, kilobytes, and megabytes. Pixel dimensions are read from the image header (JPEG SOF segment, PNG IHDR chunk, or equivalent). DPI is read from the EXIF pHYs/density metadata. Color mode (RGB, CMYK, grayscale, indexed) is read from the format header. All of this information is extracted in milliseconds from just the first few hundred bytes of the file.</p>
<p><strong>Input formats:</strong> JPG, PNG, WebP, GIF, BMP, TIFF, SVG, HEIC. <strong>Reported properties:</strong> file name, file size (bytes/KB/MB), width×height (pixels), DPI/PPI (horizontal and vertical), color mode, bit depth, format/compression type. <strong>Print size calculator:</strong> shows the physical print size at 72, 96, 150, and 300 DPI based on the pixel dimensions. No download is required — the information is displayed immediately after upload.</p>
<p>Analysis is entirely browser-based — your image is read from local storage and not transmitted to any server. Multiple images can be checked in sequence in the same session. For fixing size issues, use the <a href="/tools/image-tools/image-resizer">Image Resizer</a> for dimension changes or the <a href="/tools/image-tools/image-compressor">Image Compressor</a> for file size reduction.</p>
    `,
    extraFaqs: [
      {
        q: 'Does the size checker change or damage my image?',
        a: "No. It only reads your image's properties — the file is never modified.",
      },
      {
        q: 'What is the maximum file size I can check?',
        a: 'Any file size — the checker reads only the header bytes, so even 100 MB files are analyzed in under a second.',
      },
      {
        q: 'Can I check the size of multiple images at once?',
        a: 'Load images one at a time. The results are shown immediately after each upload.',
      },
      {
        q: 'Does this work on iPhone and Android?',
        a: 'Yes. Check image properties from your camera roll in any mobile browser.',
      },
      {
        q: 'Is my image sent anywhere during checking?',
        a: 'No. Only the file header is read in your browser. No data is transmitted.',
      },
      {
        q: 'Why does the reported DPI differ from what I expect?',
        a: 'DPI is metadata stored in the file header and may not match the actual pixel density needed for a specific print size. Always calculate: pixels ÷ inches needed = required DPI.',
      },
    ],
    proTips: [
      'Use the print size calculator to quickly check if an image is high enough resolution for a specific print size — a 3000×2000px image prints at 10×6.67 inches at 300 DPI.',
      "If you're auditing website images, check file size and look for anything over 500KB — these are candidates for compression or resizing that will improve page load speed.",
      'Color mode matters for print: CMYK is required for offset printing, RGB for digital displays. If your image is RGB and needs to go to a print shop, they will convert it — but the colors may shift.',
      'For social media uploads, check that your image meets the minimum but not the maximum — platforms compress oversized images, so uploading at the exact recommended size gives you the best quality control.',
    ],
  },

  // ─── 24. image-to-base64 ─────────────────────────────────────────────────────
  'image-to-base64': {
    slug: 'image-to-base64',
    metaTitle: 'Image to Base64 Encoder Free Online | RoughTools',
    metaDescription:
      'Convert any image to Base64 string for embedding in HTML, CSS, or JSON. Free, browser-based, no signup.',
    canonicalUrl: 'https://roughtools.com/tools/image-tools/image-to-base64',
    aboutHTML: `
<p>The <strong>Image to Base64 Encoder</strong> converts any image file into a Base64-encoded ASCII string that can be embedded directly in HTML, CSS, JSON, or any text-based format. This eliminates the need to host an image as a separate file — a Base64-encoded image is self-contained in the code itself, making it ideal for small icons, single-page applications, email templates, and development environments.</p>
<p>Base64 image encoding is useful for:</p>
<ul>
  <li>Embedding small icons and logos directly in CSS as background images without HTTP requests</li>
  <li>Including images in HTML email templates that must work without external URLs</li>
  <li>Storing images in JSON API payloads or database fields as text strings</li>
  <li>Creating fully self-contained single HTML files that include images</li>
  <li>Testing image rendering in code without setting up a file server</li>
</ul>
<p>Base64 encoding reads the raw binary bytes of the image file and converts every group of 3 bytes into 4 ASCII characters using a 64-character alphabet (A–Z, a–z, 0–9, +, /). This is why Base64-encoded strings are always approximately 33% larger than the original binary file — every 3 bytes of binary become 4 characters of text. The tool generates the complete data URI including the MIME type prefix (<code>data:image/png;base64,</code>) so it can be pasted directly into an HTML src attribute or CSS url() function.</p>
<p><strong>Input formats:</strong> JPG, PNG, WebP, GIF, SVG, BMP, ICO. <strong>Output:</strong> Base64 string, complete data URI, or HTML img tag with embedded Base64. <strong>Copy options:</strong> copy string only, copy data URI, or copy complete img tag. <strong>Max file size:</strong> 5 MB (Base64 of larger files is too unwieldy for practical use). All encoding runs in your browser.</p>
<p>Encoding runs locally using JavaScript's <code>FileReader.readAsDataURL()</code> API. No image data leaves your browser. For the reverse operation, use the <a href="/tools/image-tools/base64-to-image">Base64 to Image Decoder</a>. Keep in mind that Base64 encoding is appropriate only for small images (under 50KB original) — larger images embedded as Base64 significantly bloat HTML/CSS file sizes and hurt performance.</p>
    `,
    extraFaqs: [
      {
        q: 'Does Base64 encoding reduce image quality?',
        a: 'No. Base64 is a lossless encoding — every byte of the original image is preserved exactly. Quality is identical to the source.',
      },
      {
        q: 'What is the maximum image size for Base64 encoding?',
        a: 'Technically any size, but Base64 strings for large images are impractical. Limit Base64 embedding to images under 50KB (approximately 67KB Base64 string).',
      },
      {
        q: 'Can I encode multiple images at once?',
        a: 'One image at a time — each encoded string must be used individually.',
      },
      {
        q: 'Does this work on iPhone and Android?',
        a: 'Yes. The encoder works in any mobile browser and the output string can be copied from the mobile keyboard.',
      },
      {
        q: 'Is my image sent anywhere during encoding?',
        a: 'No. Base64 encoding runs entirely in your browser using the FileReader API. No data leaves your device.',
      },
      {
        q: 'Why is the Base64 string larger than my original image?',
        a: 'Base64 converts every 3 bytes to 4 characters, adding approximately 33% overhead. A 10KB image becomes approximately 13.3KB as Base64 text.',
      },
    ],
    proTips: [
      'Use Base64 embedding only for images under 5–10KB — larger images embedded as Base64 break HTTP caching since the data travels with the HTML on every page load.',
      'SVG files Base64-encoded as data URIs are ideal for simple icons — a 200-byte SVG becomes a ~270-byte Base64 string that loads with zero HTTP requests.',
      'For CSS background images, use the format: background-image: url("data:image/png;base64,YOURBASE64HERE") — this works in all modern browsers.',
      'In email templates, test Base64-embedded images in Outlook and Gmail — Outlook sometimes strips external images but always renders Base64-embedded data URIs.',
    ],
  },

  // ─── 25. image-to-text ────────────────────────────────────────────────────────
  'image-to-text': {
    slug: 'image-to-text',
    metaTitle: 'Image to Text (OCR) Free Online | RoughTools',
    metaDescription:
      'Extract text from images using OCR. Convert photos, screenshots, and scans to editable text. Free, no signup.',
    canonicalUrl: 'https://roughtools.com/tools/image-tools/image-to-text',
    aboutHTML: `
<p>The <strong>Image to Text</strong> tool uses Optical Character Recognition (OCR) to extract readable text from photos, screenshots, scanned documents, and any image that contains text. Instead of manually retyping text from a photo, paste the output directly into documents, spreadsheets, or search fields — saving significant time on data entry and digitization tasks.</p>
<p>OCR text extraction is needed for:</p>
<ul>
  <li>Extracting text from a screenshot of a PDF or document you cannot copy from</li>
  <li>Digitizing printed forms, business cards, or receipts from phone camera photos</li>
  <li>Converting a scanned book page or article into editable and searchable text</li>
  <li>Extracting data tables from report images for use in spreadsheets</li>
  <li>Reading text from screenshots of software, error messages, or chat logs</li>
</ul>
<p>The OCR engine uses Tesseract.js — a JavaScript port of Google's Tesseract OCR engine, compiled to WebAssembly. Tesseract uses a trained neural network (LSTM-based) to recognize character patterns in image regions. The process has three stages: first, the image is preprocessed (binarized and deskewed) to improve contrast between text and background. Second, the engine identifies text regions and baseline orientation. Third, the LSTM model classifies character sequences in each region and outputs text with confidence scores. The entire pipeline runs client-side in your browser.</p>
<p><strong>Input formats:</strong> JPG, PNG, WebP, BMP, TIFF, GIF. <strong>Supported languages:</strong> English (primary), with optional support for Spanish, French, German, Italian, Portuguese, and others via language model download. <strong>Output:</strong> plain text with line breaks preserved, or structured text with paragraph detection. <strong>Processing time:</strong> 5–30 seconds depending on image size and complexity. <strong>Max file size:</strong> 10 MB.</p>
<p>OCR processing runs entirely in your browser via WebAssembly. No image data is sent to any server. This is important for sensitive documents like medical records, financial statements, or legal documents that should not leave your device. For best accuracy, use a clear, well-lit photo with high contrast between text and background. After extracting text, use your browser's copy function to paste into any application.</p>
    `,
    extraFaqs: [
      {
        q: 'How accurate is the OCR text extraction?',
        a: 'Accuracy depends heavily on image quality. Clear, high-contrast text on plain backgrounds achieves 95%+ accuracy. Handwritten text, decorative fonts, or low-contrast images may achieve 70–85% accuracy. Always proofread OCR output.',
      },
      {
        q: 'What is the maximum image size for OCR?',
        a: 'Images up to 10 MB. Higher resolution images (300+ DPI) produce better OCR accuracy — the more pixels per character, the more detail the LSTM model has to work with.',
      },
      {
        q: 'Can I extract text from multiple images at once?',
        a: 'One image at a time. For batch OCR, process each image individually.',
      },
      {
        q: 'Does this work on iPhone and Android?',
        a: 'Yes. The WebAssembly OCR engine runs in mobile browsers, though processing may take 15–45 seconds on mobile due to CPU limitations.',
      },
      {
        q: 'Are my images stored after OCR processing?',
        a: 'No. All processing runs in your browser. No image data leaves your device.',
      },
      {
        q: 'Can OCR read handwritten text?',
        a: 'Tesseract has limited handwriting recognition. Clear, printed handwriting may partially work, but cursive and informal handwriting typically produces poor results. Use a specialized handwriting OCR tool for those cases.',
      },
    ],
    proTips: [
      'For best OCR accuracy on photos of documents, straighten and crop the image first — even a 5° tilt significantly reduces accuracy because the text baseline deviates from horizontal.',
      'Increase contrast before OCR if the text is faint — use the Image Enhancer in Document mode to maximize text-background contrast before extracting.',
      'For forms with fields and labels, the tool attempts to preserve the spatial layout — copy the output into a monospace font editor to maintain column alignment.',
      'OCR works best on printed fonts at 12pt or larger at 150+ DPI — very small text (footnotes, captions) at low resolution may be unrecognized entirely.',
    ],
  },

  // ─── 26. image-upscaler ──────────────────────────────────────────────────────
  'image-upscaler': {
    slug: 'image-upscaler',
    metaTitle: 'AI Image Upscaler — Enlarge Photos Free Online | RoughTools',
    metaDescription:
      'Upscale and enlarge images up to 4× using AI without losing quality. Free online tool, no signup.',
    canonicalUrl: 'https://roughtools.com/tools/image-tools/image-upscaler',
    aboutHTML: `
<p>The <strong>AI Image Upscaler</strong> enlarges images by 2× or 4× while preserving and enhancing detail using a super-resolution neural network. Standard resizing blurs images when upscaling — this tool uses AI to reconstruct realistic high-frequency detail (edges, textures, sharpness) that standard interpolation cannot generate, producing enlarged images that look genuinely higher resolution rather than simply stretched.</p>
<p>AI upscaling is useful for:</p>
<ul>
  <li>Enlarging small product images for print use when no high-resolution source is available</li>
  <li>Enhancing old, low-resolution digital photos taken on early digital cameras</li>
  <li>Upscaling game screenshots or digital art for large-format display</li>
  <li>Improving thumbnail images that need to be displayed at larger sizes</li>
  <li>Restoring clarity to images that were aggressively compressed at low resolution</li>
</ul>
<p>The upscaling model is a Real-ESRGAN (Enhanced Super-Resolution Generative Adversarial Network) variant trained specifically for photographic and illustrated content. It processes images in overlapping tiles to handle large inputs, with each tile processed through a deep residual network that learns the mapping from low-resolution to high-resolution patches based on millions of training image pairs. The GAN discriminator during training ensures output textures look realistic rather than smooth and artificial — which is the key difference from simple upscaling.</p>
<p><strong>Input formats:</strong> JPG, PNG, WebP. <strong>Upscale factors:</strong> 2× (doubles dimensions) or 4× (quadruples dimensions). <strong>Models:</strong> Photo (for photographic images), Illustration (for anime, art, graphics). <strong>Maximum input:</strong> 5 MB / 2000×2000px. <strong>Output format:</strong> PNG. Processing time: 10–60 seconds depending on image size.</p>
<p>Upscaling runs on our GPU-accelerated server. Images are transmitted over HTTPS and immediately deleted after the upscaled result is returned — typically within 30 seconds. No images are stored or used for model training. For the best upscaling results, start with the highest-quality version of the image you have — removing JPEG artifacts with the <a href="/tools/image-tools/image-enhancer">Image Enhancer</a> before upscaling produces cleaner results.</p>
    `,
    extraFaqs: [
      {
        q: 'Is AI upscaling better than standard bicubic upscaling?',
        a: 'Yes, significantly. Standard bicubic interpolation blurs edges and creates a "soft" look. AI upscaling reconstructs realistic edge detail and texture, producing sharper, more natural-looking enlargements.',
      },
      {
        q: 'What is the maximum input image size?',
        a: '5 MB and 2000×2000 pixels for reliable processing. Very large inputs are processed in tiles, which can occasionally produce subtle tile boundaries at extreme sizes.',
      },
      {
        q: 'Can I upscale multiple images at once?',
        a: 'One image at a time due to GPU resource management. Processing each image takes 10–60 seconds.',
      },
      {
        q: 'Does this work on iPhone and Android?',
        a: 'Yes. Upload from your camera roll in any mobile browser. The upscaling happens on our server, so mobile CPU speed is not a limitation.',
      },
      {
        q: 'Are my images stored after upscaling?',
        a: 'No. Images are deleted from the GPU server immediately after the result is returned to your browser.',
      },
      {
        q: 'Can the AI upscaler restore quality lost by JPEG compression?',
        a: 'Yes — the model is trained to reconstruct detail from compressed inputs, and JPEG artifact removal is part of the upscaling process for photographic content.',
      },
    ],
    proTips: [
      'Compress the input to remove JPEG artifacts before upscaling — clean pixels upscale better than noisy, artifact-laden ones, and the AI will reconstruct sharper detail from a cleaner source.',
      'For text or logos, use the 2× scale rather than 4× — text sharpness is near-perfect at 2× and the file size increase at 4× is rarely justified for vector-style content.',
      'After upscaling, apply a slight sharpening pass using the Image Enhancer — AI upscaling can occasionally produce slightly soft edges that benefit from a final sharpening step.',
      'The Illustration model works dramatically better on anime, cartoon, and flat-design graphics than the Photo model — always choose the correct model for your content type.',
    ],
  },

  // ─── 27. jpg-to-png ──────────────────────────────────────────────────────────
  'jpg-to-png': {
    slug: 'jpg-to-png',
    metaTitle: 'JPG to PNG Converter Free Online | RoughTools',
    metaDescription:
      'Convert JPG images to lossless PNG format online. Preserve quality, get transparency support. Free, instant.',
    canonicalUrl: 'https://roughtools.com/tools/image-tools/jpg-to-png',
    aboutHTML: `
<p>The <strong>JPG to PNG Converter</strong> converts JPEG images to PNG format, giving you a lossless copy of your photo that supports transparency and can be re-saved without quality degradation. While the conversion cannot restore quality lost in the original JPG compression, it "freezes" the current quality and prevents further loss during subsequent edits and saves.</p>
<p>JPG to PNG conversion is needed for:</p>
<ul>
  <li>Converting a JPG before removing the background — PNG supports transparency, JPG does not</li>
  <li>Converting logos or graphics that were mistakenly saved as JPG to the correct lossless format</li>
  <li>Preparing images for editing workflows where you'll be saving multiple times</li>
  <li>Screenshots that look blurry as JPG due to compression artifacts around text</li>
  <li>Archiving images in a format that will not degrade over time with repeated opens and saves</li>
</ul>
<p>The conversion decodes the JPEG image data using the browser's native JPEG decoder (which handles the full JFIF/EXIF specification) and renders it to an HTML5 Canvas element. The Canvas then encodes the pixel data as a PNG using lossless DEFLATE compression. Because PNG is lossless, every pixel value is preserved exactly as decoded from the JPG — the resulting PNG faithfully represents the JPG content at the point of conversion. The PNG file size will typically be 2–5× larger than the JPG because PNG stores uncompressed color data rather than discarding it.</p>
<p><strong>Input formats:</strong> JPG, JPEG (also accepts WebP, BMP for conversion to PNG). <strong>Output:</strong> PNG with lossless compression. <strong>Transparency:</strong> the PNG will have no alpha channel since JPEG has no transparency — the background remains solid. <strong>Max file size:</strong> 20 MB. <strong>Batch support:</strong> convert multiple JPG files at once.</p>
<p>All conversion runs in your browser — images are never uploaded to any server. For adding a transparent background after converting, use the <a href="/tools/image-tools/background-remover">Background Remover</a>. If file size is a concern, the <a href="/tools/image-tools/image-compressor">Image Compressor</a> can reduce PNG file size significantly using palette optimization.</p>
    `,
    extraFaqs: [
      {
        q: 'Does converting JPG to PNG improve image quality?',
        a: 'No — conversion preserves the current quality exactly but does not restore lost detail. Quality lost during the original JPG compression cannot be recovered.',
      },
      {
        q: 'Why is the PNG file larger than the JPG?',
        a: 'JPG uses lossy compression that discards data to achieve small files. PNG stores all pixel data losslessly, resulting in files 2–5× larger than equivalent JPGs for photographs.',
      },
      {
        q: 'Can I convert multiple JPGs to PNG at once?',
        a: 'Yes — select or drag multiple files and each is converted individually with a ZIP download option.',
      },
      {
        q: 'Does this work on iPhone and Android?',
        a: 'Yes. The conversion runs in any modern mobile browser.',
      },
      {
        q: 'Are my images stored after conversion?',
        a: 'No. Conversion is entirely browser-based. No files are uploaded or stored.',
      },
      {
        q: 'Will my JPG become transparent after converting to PNG?',
        a: 'No — JPEG has no transparency information to preserve, so the PNG output will have a solid opaque background. Use the Background Remover after conversion to create transparency.',
      },
    ],
    proTips: [
      "Convert to PNG before using the Background Remover — the AI works on PNG output with full alpha channel support, whereas JPG doesn't support transparency at all.",
      'For screenshots with text, always save as PNG rather than JPG — JPEG compression creates visible artifacts around sharp text edges that PNG avoids completely.',
      "If you're working with a JPG that needs multiple rounds of editing, convert to PNG first — each JPG save loses quality, while PNG saves are lossless.",
      'After converting a JPG logo to PNG, check the edges at 200% zoom — JPEG artifacts around edges may need cleaning with the eraser tool in an image editor before using the PNG.',
    ],
  },

  // ─── 28. meme-generator ──────────────────────────────────────────────────────
  'meme-generator': {
    slug: 'meme-generator',
    metaTitle: 'Meme Generator Free Online — Create Memes | RoughTools',
    metaDescription:
      'Create memes with custom text on any image. Classic meme fonts, adjustable size. Free, instant, no signup.',
    canonicalUrl: 'https://roughtools.com/tools/image-tools/meme-generator',
    aboutHTML: `
<p>The <strong>Meme Generator</strong> lets you add impact-font text captions to any image to create classic-style memes, reaction images, and humorous graphics for social media. Upload your own image or choose from popular meme templates, add top and bottom text in the traditional bold white-outlined style, and download your meme ready to share — all in seconds without any design software.</p>
<p>The meme generator is used for:</p>
<ul>
  <li>Creating reaction memes and humorous commentary images for social media posts</li>
  <li>Adding context captions to screenshot images for online discussions</li>
  <li>Making custom workplace or hobby memes with inside jokes for group chats</li>
  <li>Creating educational or training materials with humorous examples to improve engagement</li>
  <li>Participating in trending meme formats by adapting templates with custom text</li>
</ul>
<p>Text rendering uses the HTML5 Canvas 2D API. The classic meme style is achieved by rendering text in Impact or Arial Black font with white fill and a thick black stroke, which creates the high-contrast legibility that works on any background image. Text is horizontally centered and automatically line-wrapped to fit the image width. Font size auto-scales to fit the text within the image if the caption is very long. Multiple text boxes are supported for images requiring more than just top/bottom captions.</p>
<p><strong>Input:</strong> upload any JPG, PNG, WebP, or GIF image. <strong>Text options:</strong> top text, bottom text, and additional text overlays. <strong>Style:</strong> Impact font (classic meme), Arial Black, Comic Sans, or custom font upload. <strong>Text color:</strong> white, black, or custom hex. <strong>Outline:</strong> adjustable stroke width. <strong>Text size:</strong> auto-fit or manual size control. <strong>Output:</strong> JPG or PNG download.</p>
<p>All image processing and text rendering runs in your browser on the HTML5 Canvas. No image is uploaded to any server. Your custom images and captions remain private on your device. This is the safest meme creator for workplace, proprietary, or personal images that you don't want stored on third-party servers. Download the finished meme as JPG for smaller file size or PNG for crisp text edges.</p>
    `,
    extraFaqs: [
      {
        q: 'Will adding text reduce my image quality?',
        a: 'No — text is rendered on top of the image at full resolution. JPG output applies compression; PNG output is lossless.',
      },
      {
        q: 'What is the maximum image size for the meme generator?',
        a: 'Images up to 20 MB and 4000×4000 pixels. Very wide images may require smaller text to maintain readability.',
      },
      {
        q: 'Can I create multiple memes at once?',
        a: 'One meme at a time. Download each meme before creating the next.',
      },
      {
        q: 'Does this work on iPhone and Android?',
        a: 'Yes. Type your text, position it, and download your meme directly from any mobile browser.',
      },
      {
        q: 'Are my images or memes stored after creation?',
        a: 'No. Everything runs in your browser. No image data is uploaded or stored.',
      },
      {
        q: 'Can I use GIF images to create animated memes?',
        a: 'Static text is added to the first frame for GIF inputs — full animated GIF meme creation is not currently supported.',
      },
    ],
    proTips: [
      'Impact font at 100% opacity with a 4–6px black stroke is the classic meme style — for a more modern look, try a lighter font weight with a semi-transparent background bar behind the text.',
      'ALL CAPS text reads better in the classic Impact meme style — lowercase Impact looks unusual compared to what audiences expect from the format.',
      "Adjust text size so each line fills 70–80% of the image width — text that's too small loses impact, and text too wide is hard to read quickly.",
      'For image memes shared on dark-background social apps, add a thin white outer stroke (2px) and a thicker black inner stroke (4px) — this ensures legibility on any background.',
    ],
  },

  // ─── 29. passport-photo-maker ────────────────────────────────────────────────
  'passport-photo-maker': {
    slug: 'passport-photo-maker',
    metaTitle: 'Passport Photo Maker Free Online | RoughTools',
    metaDescription:
      'Create passport-ready photos at home in standard sizes. US, UK, EU formats. Free, instant download. No signup.',
    canonicalUrl: 'https://roughtools.com/tools/image-tools/passport-photo-maker',
    aboutHTML: `
<p>The <strong>Passport Photo Maker</strong> formats your photo to meet the strict size and background requirements for passport applications, visa applications, and other official government documents. Instead of paying for a photo booth or photo studio, you can create compliant passport photos at home and print them on any color printer — saving money while getting instant results.</p>
<p>Passport photo creation is needed for:</p>
<ul>
  <li>Creating US passport photos (2×2 inches, white background, 300 DPI) for renewal or new applications</li>
  <li>Making UK/EU passport photos (35×45mm) for British, European, and many other country documents</li>
  <li>Producing visa application photos at the specific size required by different embassies</li>
  <li>Creating employment and ID badge photos at corporate standard sizes</li>
  <li>Making student ID photos for university and school applications</li>
</ul>
<p>The tool automatically detects your face using a client-side face detection model (TensorFlow.js) to center and size the head within the frame according to the requirement that the face occupy 70–80% of the photo height. The background replacement algorithm detects the background area using edge detection and replaces it with the official required color (white for most passports). The output is rendered at 300 DPI for print quality — a 2×2 inch photo becomes a 600×600 pixel file, printed at exactly the correct physical size. A print sheet with 4–6 photos on standard 4×6 inch paper is generated for convenient printing.</p>
<p><strong>Size presets:</strong> US Passport (2×2 in / 51×51mm), UK Passport (35×45mm), EU Passport (35×45mm), Australian Passport (35×45mm), Indian Passport (2×2 in), Chinese Visa (33×48mm). <strong>Background colors:</strong> white, off-white, light gray. <strong>Output DPI:</strong> 300. <strong>Print layout:</strong> 4×6 inch sheet with 4 or 6 passport photos.</p>
<p>Face detection runs locally in your browser. Background replacement is processed on our secure server and images are immediately deleted after the formatted photo is returned. No passport photos are stored or retained. Always verify your photo meets current requirements on the official government website before submitting, as specifications can be updated. Use the <a href="/tools/image-tools/id-card-photo-maker">ID Card Photo Maker</a> for non-passport ID formats.</p>
    `,
    extraFaqs: [
      {
        q: 'Will the photo meet official passport requirements?',
        a: "The tool follows published requirements. Requirements can change — always verify current specs on your country's official government website before submitting.",
      },
      {
        q: 'What photo quality is needed for the best result?',
        a: 'Use a photo taken in good natural light against a plain light background, looking directly at the camera. Minimum 1000×1000px source photo gives the best output quality.',
      },
      {
        q: 'Can I create multiple passport photos from one session?',
        a: 'Yes — the tool generates a print sheet with 4–6 copies of your passport photo formatted for 4×6 inch photo paper.',
      },
      {
        q: 'Does this work on iPhone and Android?',
        a: 'Yes. Photograph yourself and upload directly from your camera roll in any mobile browser.',
      },
      {
        q: 'Is my photo stored after processing?',
        a: 'Background replacement is done on our server and images are deleted immediately after. Face detection runs locally in your browser.',
      },
      {
        q: "What if the auto-crop doesn't position my face correctly?",
        a: 'Use the manual adjustment handles to reposition and scale the crop frame after the auto-detect step. Full manual override is always available.',
      },
    ],
    proTips: [
      'Photograph against a clean white or light gray wall with diffused natural light from a window — even lighting with no harsh shadows on the background gives the most compliant result.',
      'Face the camera squarely with a neutral or slight smile — most passport authorities now prohibit wide smiles, open mouths, and visible teeth.',
      'Print on matte photo paper, not glossy — government scanning systems work better with matte and many official photo guidelines specify matte finish.',
      'Check the final photo at 1:1 print size (print on regular paper first) before printing the final version — eye position, shoulder width, and head size look different at actual print scale vs. screen view.',
    ],
  },

  // ─── 30. photo-collage-maker ─────────────────────────────────────────────────
  'photo-collage-maker': {
    slug: 'photo-collage-maker',
    metaTitle: 'Photo Collage Maker Free Online | RoughTools',
    metaDescription:
      'Create beautiful photo collages with multiple layout options. Free online collage tool, instant download, no signup.',
    canonicalUrl: 'https://roughtools.com/tools/image-tools/photo-collage-maker',
    aboutHTML: `
<p>The <strong>Photo Collage Maker</strong> combines multiple photos into a single composition using grid layouts, freeform arrangements, or classic collage styles. Perfect for creating social media posts, family keepsakes, event recaps, mood boards, and product showcases — the collage maker gives you professional-looking multi-photo compositions without any design experience.</p>
<p>Photo collages are created for:</p>
<ul>
  <li>Combining event photos (weddings, birthdays, vacations) into a single shareable image</li>
  <li>Creating before-and-after comparison images for fitness, home renovation, or product reviews</li>
  <li>Making mood boards and visual inspiration collections for design projects</li>
  <li>Showcasing multiple product photos in a single marketplace listing image</li>
  <li>Creating Instagram carousel-style composite images that show progression or variety</li>
</ul>
<p>The collage engine uses a CSS grid-inspired layout algorithm running on HTML5 Canvas. Grid layouts are calculated by dividing the total canvas area into cells of equal or weighted proportions, with configurable gap spacing between cells. Each uploaded photo is loaded into a canvas ImageBitmap and drawn into its assigned cell using <code>drawImage()</code> with contain or cover scaling modes. Cover mode (default) fills each cell completely, cropping the image to fit. Contain mode shows the full image with letterboxing. Text overlay uses Canvas text rendering with the same quality controls as the meme generator. The final composite canvas is encoded to PNG or JPG and offered for download.</p>
<p><strong>Layouts:</strong> 2, 3, 4, 6, 8, and 12 photo grids; horizontal and vertical splits; featured-large with thumbnail strip. <strong>Canvas sizes:</strong> 1080×1080 (Instagram), 1920×1080 (landscape), 1080×1920 (portrait story), custom. <strong>Gap:</strong> 0px (seamless) to 20px. <strong>Background:</strong> white, black, or custom color. <strong>Text:</strong> add captions to individual cells or global title/date. <strong>Output:</strong> PNG or JPG.</p>
<p>All photo processing runs in your browser — your photos are never uploaded to any server. The collage is assembled entirely on the local Canvas API. This means no internet connection is required after the page loads, and your private photos remain on your device throughout the entire process. For large-format printing, use PNG output at the highest resolution setting.</p>
    `,
    extraFaqs: [
      {
        q: "Will the collage reduce my photos' quality?",
        a: 'Each photo is rendered at the full resolution of its canvas cell. PNG output is lossless. JPG output at 90% quality is near-imperceptible. Very small cells do reduce effective resolution.',
      },
      {
        q: 'What is the maximum output resolution?',
        a: 'Up to 4000×4000 pixels for print-quality collages, or 2048×2048 for social media output. Canvas memory limits may restrict this on older mobile devices.',
      },
      {
        q: 'Can I use photos from my phone camera roll?',
        a: 'Yes. Upload directly from your camera roll on any mobile browser. The tool works identically on iOS and Android.',
      },
      {
        q: 'Does this work on iPhone and Android?',
        a: 'Yes. All collage creation runs in mobile browsers. Touch drag to reposition photos within cells.',
      },
      {
        q: 'Are my photos stored after creating the collage?',
        a: 'No. Everything runs locally in your browser. No photos are uploaded or stored.',
      },
      {
        q: 'Can I add text or captions to my collage?',
        a: 'Yes — add a global title at the top or bottom, and individual captions to each photo cell. Font, size, and color are customizable.',
      },
    ],
    proTips: [
      "Use the 2048px output for social media — it's the sweet spot between file size and retina display sharpness on Instagram and Facebook.",
      'Set gap to 0px for a seamless mosaic look, or 2–4px for a clean bordered grid. Avoid gaps over 8px — they look amateurish on most layouts.',
      'Crop all photos to the same aspect ratio before adding them to the collage — portrait and landscape photos mixed in equal cells look awkward and unbalanced.',
      'For printing, use PNG output at 3000px+ and send to a photo print service — JPG compression artifacts become visible on large prints at close viewing distance.',
    ],
  },

  // ─── 31. photo-to-cartoon ────────────────────────────────────────────────────
  'photo-to-cartoon': {
    slug: 'photo-to-cartoon',
    metaTitle: 'Photo to Cartoon — Cartoonize Photos Free Online',
    metaDescription:
      'Convert your photo into a cartoon or illustration style using AI. Free online tool, instant results, no signup.',
    canonicalUrl: 'https://roughtools.com/tools/image-tools/photo-to-cartoon',
    aboutHTML: `
<p>The <strong>Photo to Cartoon</strong> tool uses AI style transfer to transform regular photographs into cartoon-style or illustrated artwork. The result replaces photographic realism with flat colors, bold outlines, and simplified shapes characteristic of animated illustrations — creating a distinctive visual style popular for social media avatars, digital art projects, and creative content.</p>
<p>Photo-to-cartoon conversion is used for:</p>
<ul>
  <li>Creating cartoon-style avatar images for social media profiles and gaming</li>
  <li>Making illustrated versions of portraits for gifts, prints, or personalized merchandise</li>
  <li>Generating stylized versions of product photos for creative marketing visuals</li>
  <li>Creating children's book-style illustrations from reference photographs</li>
  <li>Producing artistic profile photos that stand out from standard headshots</li>
</ul>
<p>The cartoonization uses a neural style transfer model based on CartoonGAN — a GAN architecture trained on pairs of photographic and cartoon images from animated films. The generator learns to transform the texture, shading, and edge characteristics of real photos to match the visual language of hand-drawn illustration. The key visual transformations are: edge enhancement and posterization (flattening gradients into discrete color zones), outline extraction and darkening, and color palette simplification using k-means clustering. The result retains recognizable structure from the original photo while applying illustration aesthetics.</p>
<p><strong>Input formats:</strong> JPG, PNG, WebP (portraits and subjects work best). <strong>Cartoon styles:</strong> Classic Cartoon, Anime, Watercolor, Comics, Sketch. <strong>Intensity:</strong> subtle to full cartoon. <strong>Output format:</strong> JPG. <strong>Maximum input:</strong> 10 MB. Processing time: 10–30 seconds on our GPU server.</p>
<p>Your photo is sent to our GPU processing server over HTTPS and deleted immediately after the cartoon result is returned. No images are stored or used for any machine learning training. Results vary significantly by input image — portraits with clear facial features and simple backgrounds produce the best cartoon conversions. Complex backgrounds or very dark photos may produce less defined results. After converting, use the <a href="/tools/image-tools/image-enhancer">Image Enhancer</a> to boost colors and contrast in the cartoon output.</p>
    `,
    extraFaqs: [
      {
        q: 'How realistic is the cartoon conversion on portraits?',
        a: 'Portraits with clear, well-lit subjects on simple backgrounds produce the most recognizable cartoon results. The AI preserves facial structure and key features while applying illustration aesthetics.',
      },
      {
        q: 'What image size is best for cartoon conversion?',
        a: 'Images between 500×500 and 2000×2000 pixels work best. Very small images lose detail during cartoonization; very large images take longer to process.',
      },
      {
        q: 'Can I cartoonize multiple photos at once?',
        a: 'One photo at a time due to GPU resource requirements. Each conversion takes 10–30 seconds.',
      },
      {
        q: 'Does this work on iPhone and Android?',
        a: 'Yes. Upload from your camera roll and download the cartoon result in any mobile browser.',
      },
      {
        q: 'Are my photos stored after cartoonization?',
        a: 'No. Photos are processed on our GPU server and immediately deleted after the result is returned.',
      },
      {
        q: 'Which cartoon style works best for portrait photos?',
        a: 'Classic Cartoon or Anime styles work best for portraits — they preserve facial structure while applying recognizable illustration aesthetics. Watercolor style works beautifully on landscape and nature photos.',
      },
    ],
    proTips: [
      'Use a portrait photo with a simple, uncluttered background — the AI focuses on the subject, and complex backgrounds can produce muddy, undefined cartoon edges.',
      'Increase brightness and contrast slightly before converting — well-exposed photos with clear tonal separation produce significantly better cartoon outlines than flat, dull images.',
      'After downloading the cartoon, boost saturation by 20–30% using the Color Adjuster — cartoons typically have more saturated, vivid colors than the AI output level.',
      'For printed merchandise (mugs, t-shirts), use the Classic Cartoon or Comics style at maximum intensity — these produce the clearest outlines that look intentional at print scale.',
    ],
  },

  // ─── 32. pixel-density-calculator ───────────────────────────────────────────
  'pixel-density-calculator': {
    slug: 'pixel-density-calculator',
    metaTitle: 'Pixel Density Calculator Free Online | RoughTools',
    metaDescription:
      'Calculate PPI, DPI, and pixel density for screens and images. Enter resolution and size. Free, instant.',
    canonicalUrl: 'https://roughtools.com/tools/image-tools/pixel-density-calculator',
    aboutHTML: `
<p>The <strong>Pixel Density Calculator</strong> computes the pixels-per-inch (PPI) or dots-per-inch (DPI) of a screen or image given its resolution and physical size. PPI determines how sharp and detailed images appear on a display — the higher the PPI, the more detail visible at a given viewing distance. This calculator is essential for comparing displays, determining print requirements, and understanding whether an image has sufficient resolution for a specific use case.</p>
<p>Pixel density calculation is needed for:</p>
<ul>
  <li>Comparing the sharpness of two monitors or phone screens before purchasing</li>
  <li>Determining if a photo has sufficient resolution for a specific print size at 300 DPI</li>
  <li>Understanding why an image looks sharp on one screen but blurry on another</li>
  <li>Calculating the physical display dimensions from resolution and PPI specifications</li>
  <li>Verifying that a web image is optimized for retina displays (requires 2× the display PPI)</li>
</ul>
<p>PPI is calculated using the formula: PPI = √(width² + height²) ÷ diagonal_inches, where width and height are the horizontal and vertical pixel counts and diagonal_inches is the screen diagonal in inches. This formula derives from the Pythagorean theorem — the diagonal pixel count divided by the physical diagonal gives pixels per inch. For images, DPI is simply the stored metadata value (modifiable but independent of pixel count). The calculator shows both the mathematical PPI and compares it to common display categories: SD (under 100 PPI), HD (100–200 PPI), Retina/HiDPI (200–400 PPI), and Super Retina (400+ PPI).</p>
<p><strong>Input modes:</strong> Screen mode (enter resolution + diagonal size in inches/cm), Image mode (upload image to auto-read dimensions), Print mode (enter pixel dimensions + target print size to calculate required DPI). <strong>Output:</strong> PPI/DPI value, display quality rating, angular resolution (arc minutes per pixel at typical viewing distance), and print size recommendations.</p>
<p>All calculations are performed mathematically in your browser — no server needed. For related work, use the <a href="/tools/image-tools/dpi-converter">DPI Converter</a> to change the DPI metadata stored in an image file, or the <a href="/tools/image-tools/image-size-checker">Image Size Checker</a> to read the current dimensions and DPI of an image file.</p>
    `,
    extraFaqs: [
      {
        q: 'What is the difference between PPI and DPI?',
        a: 'PPI (pixels per inch) refers to screen pixel density. DPI (dots per inch) refers to print dot density. For digital images, they describe the same concept — how many pixels/dots fit in one inch at the given physical size.',
      },
      {
        q: 'What PPI is needed for a "Retina" display?',
        a: "Apple's Retina threshold is approximately 200–300 PPI at typical viewing distances — the point where individual pixels become imperceptible to the average human eye at normal use.",
      },
      {
        q: 'Can I calculate DPI for any image file?',
        a: 'Yes — upload any image and the calculator reads its pixel dimensions and stored DPI metadata, then calculates the print size at that DPI.',
      },
      {
        q: 'Does this work on iPhone and Android?',
        a: 'Yes. Enter values or upload images in any mobile browser for instant calculation.',
      },
      {
        q: 'Are my images stored during calculation?',
        a: 'No. Image dimensions are read locally in the browser. No file data is transmitted.',
      },
      {
        q: 'What PPI should I design for mobile apps?',
        a: 'Design at 1× pixel density and export at 1×, 2×, and 3× (@1x, @2x, @3x) for different device densities. iOS devices range from 163 PPI (iPad) to 460 PPI (iPhone Pro Max), Android from 160 PPI to 570 PPI.',
      },
    ],
    proTips: [
      'For print work, use the Print mode to quickly verify resolution sufficiency — enter your image dimensions and target print size to see if you have 300 DPI or need to upscale.',
      'When buying a monitor, PPI matters more than raw resolution — a 4K 32-inch monitor (138 PPI) looks less sharp than a 4K 24-inch monitor (184 PPI) despite having the same pixel count.',
      'For web design targeting retina displays, multiply your CSS image size by 2 for the actual pixel dimensions needed — a 300×200 CSS image needs a 600×400px actual image file.',
      'The angular resolution column (arc-minutes per pixel) tells you the viewing distance at which the display becomes "retina" — below 1 arc-minute, the eye cannot resolve individual pixels.',
    ],
  },

  // ─── 33. png-to-jpg ──────────────────────────────────────────────────────────
  'png-to-jpg': {
    slug: 'png-to-jpg',
    metaTitle: 'PNG to JPG Converter Free Online | RoughTools',
    metaDescription:
      'Convert PNG images to JPG format online. Reduce file size while maintaining visual quality. Free, instant.',
    canonicalUrl: 'https://roughtools.com/tools/image-tools/png-to-jpg',
    aboutHTML: `
<p>The <strong>PNG to JPG Converter</strong> converts PNG images to JPG format, significantly reducing file size for photos and images that don't require transparency. PNG's lossless compression is excellent for graphics, logos, and screenshots, but produces unnecessarily large files for photographs — converting to JPG at high quality settings can reduce file size by 60–80% with no visible quality difference in photographic content.</p>
<p>PNG to JPG conversion is needed for:</p>
<ul>
  <li>Reducing the file size of PNG photographs for email, web upload, or social media sharing</li>
  <li>Converting PNG exports from design software to web-ready JPG format</li>
  <li>Meeting platform file size limits that reject large PNG files</li>
  <li>Optimizing website images when PNG has been used unnecessarily for photographic content</li>
  <li>Converting screenshots saved as PNG to smaller JPG for attachment to emails</li>
</ul>
<p>The conversion renders the PNG image (decoding the DEFLATE-compressed pixel data) onto an HTML5 Canvas and re-encodes it as JPEG using the browser's native JPEG encoder with your chosen quality factor. Transparent areas in the PNG (if any) are composited over a configurable background color (white by default) since JPEG does not support an alpha channel. The resulting file size depends on the image content and quality setting — photographic images with gradual tonal transitions compress much better than PNG graphics with flat color regions and sharp edges.</p>
<p><strong>Input:</strong> PNG (including PNG with transparency). <strong>Output:</strong> JPG at adjustable quality (1–100). <strong>Transparency handling:</strong> transparent areas filled with configurable background color (default white). <strong>Background color:</strong> white, black, or custom hex. <strong>Batch support:</strong> convert multiple PNG files at once. <strong>Max file size:</strong> 20 MB per image. All processing is browser-based.</p>
<p>No files are uploaded to any server — conversion runs entirely in your browser. For images requiring transparency, always keep the original PNG. To also optimize the resulting JPG further, use the <a href="/tools/image-tools/image-compressor">Image Compressor</a> after converting. For converting back to PNG, use the <a href="/tools/image-tools/jpg-to-png">JPG to PNG Converter</a>.</p>
    `,
    extraFaqs: [
      {
        q: 'Will converting PNG to JPG reduce image quality?',
        a: 'At quality 90+, the difference is imperceptible for photographs. Images with flat colors, sharp edges, or text may show visible JPEG compression artifacts. Use quality 90–95 for those types of content.',
      },
      {
        q: 'What happens to transparent areas in my PNG?',
        a: 'Transparent pixels are filled with the background color you choose (default: white) since JPG does not support transparency. If transparency is important, keep the PNG.',
      },
      {
        q: 'Can I convert multiple PNGs to JPG at once?',
        a: 'Yes — select or drag multiple PNG files. They are all converted with the same quality setting and packaged in a ZIP archive.',
      },
      {
        q: 'Does this work on iPhone and Android?',
        a: 'Yes. The conversion runs in any modern mobile browser.',
      },
      {
        q: 'Are my images stored after conversion?',
        a: 'No. Conversion is browser-based. No files are uploaded or stored.',
      },
      {
        q: 'What quality setting should I use?',
        a: '90% quality is recommended for general use — imperceptible quality loss with significant file size reduction. Use 95% for images with fine text or sharp graphics.',
      },
    ],
    proTips: [
      'Never convert PNG logos or graphics with text to JPG — JPEG compression creates visible artifacts around sharp edges and text that PNG avoids. Only convert photographic PNG content.',
      "For web images, save at 85% JPG quality — it's the Google PageSpeed recommended quality that achieves the best size/quality balance for photographic content.",
      "After converting to JPG, check the file size — if it's still over 500KB, apply additional compression using the Image Compressor for web-ready files.",
      'When converting screenshots to JPG, be aware that UI text (menus, buttons) will show JPEG artifacts at quality below 90 — keep screenshots as PNG if text clarity matters.',
    ],
  },

  // ─── 34. remove-watermark ────────────────────────────────────────────────────
  'remove-watermark': {
    slug: 'remove-watermark',
    metaTitle: 'Remove Watermark from Image Free Online | RoughTools',
    metaDescription:
      'Remove watermarks from your own images using AI inpainting. For images you own. Free online tool.',
    canonicalUrl: 'https://roughtools.com/tools/image-tools/remove-watermark',
    aboutHTML: `
<p>The <strong>Remove Watermark</strong> tool uses AI-powered inpainting to remove watermarks, timestamps, logos, or unwanted text overlays from images. This tool is intended for removing watermarks from images you own or have rights to — for example, removing a watermark you applied yourself, removing a stock photo platform watermark from an image you have purchased and downloaded, or cleaning up your own photos that contain date stamps from old cameras.</p>
<p>Legitimate watermark removal use cases include:</p>
<ul>
  <li>Removing a watermark you applied yourself using the Add Watermark tool after finalizing client approval</li>
  <li>Cleaning camera date/time stamps from old photos before printing or archiving</li>
  <li>Removing branding overlays from photos you took at a photo booth event</li>
  <li>Removing a service watermark from a photo you have legally licensed and paid for</li>
  <li>Removing promotional text overlays added by photo-sharing apps from your own captures</li>
</ul>
<p>The watermark removal process uses an inpainting neural network that analyzes the surrounding image context to reconstruct the pixel content hidden under the watermark region. You select the watermark area using a brush mask tool — painted pixels are marked as the region to remove. The AI inpainting model then fills the masked region by synthesizing plausible pixel values based on the surrounding visual context, using a diffusion-based approach that samples from learned image statistics. The quality of removal depends on the complexity of the background under the watermark — solid colors, gradients, and simple textures fill nearly perfectly, while complex detailed backgrounds may show slight artifacts.</p>
<p><strong>Input formats:</strong> JPG, PNG, WebP. <strong>Mask tool:</strong> brush with adjustable size for painting the watermark selection. <strong>Processing:</strong> server-side AI inpainting. <strong>Output format:</strong> PNG. <strong>Important:</strong> only use this tool on images you own or have licensed. Do not use this tool to remove watermarks from copyrighted images without permission.</p>
<p>Your image is transmitted over HTTPS to our inpainting server and deleted immediately after the result is returned. Use the <a href="/tools/image-tools/add-watermark">Add Watermark</a> tool if you want to add watermarks to your own images for protection.</p>
    `,
    extraFaqs: [
      {
        q: 'Will removal reduce the quality of the area under the watermark?',
        a: 'The inpainting AI synthesizes plausible content, but cannot recover original pixel data under the watermark. Simple backgrounds remove cleanly; complex detailed areas may show subtle artifacts.',
      },
      {
        q: 'What is the maximum image size for watermark removal?',
        a: 'Images up to 10 MB. Larger images take longer to process — typically 10–30 seconds.',
      },
      {
        q: 'Can I remove watermarks from multiple images at once?',
        a: 'Batch removal is not currently available. Process one image at a time.',
      },
      {
        q: 'Does this work on iPhone and Android?',
        a: 'Yes. Use the brush mask tool on a touchscreen and tap the remove button. Processing happens on the server.',
      },
      {
        q: 'Are my images stored after processing?',
        a: 'No. Images are deleted from the inpainting server immediately after the result is returned.',
      },
      {
        q: 'Is it legal to use this tool?',
        a: 'Only use this tool on images you own or have licensed. Removing watermarks from copyrighted images without authorization may violate copyright law — this tool is intended for legitimate use cases only.',
      },
    ],
    proTips: [
      'Paint the mask slightly larger than the visible watermark — watermarks often have a semi-transparent fade area around the edges that must be included in the mask for clean removal.',
      'For text watermarks on solid-color backgrounds, removal is nearly perfect — paint the mask carefully around each character for the cleanest result.',
      'If the inpainting leaves visible artifacts on a complex background, try running the process twice with a slightly different mask area — multiple passes sometimes produce cleaner composite results.',
      'For date stamps in the corner, crop the corner out if possible — cropping is always cleaner than inpainting and preserves full image quality.',
    ],
  },

  // ─── 35. round-corner-image ──────────────────────────────────────────────────
  'round-corner-image': {
    slug: 'round-corner-image',
    metaTitle: 'Round Corner Image — Add Rounded Corners Free',
    metaDescription:
      'Add rounded corners to any image online. Adjustable border radius, transparent or colored background. Free.',
    canonicalUrl: 'https://roughtools.com/tools/image-tools/round-corner-image',
    aboutHTML: `
<p>The <strong>Round Corner Image</strong> tool applies rounded corners to any image, creating the clean, modern aesthetic used in app icons, profile pictures, card UI elements, and polished social media graphics. Adjust the corner radius from subtle rounding to fully circular, with the option to export as PNG with transparent corners or with a solid background color.</p>
<p>Rounded corners are needed for:</p>
<ul>
  <li>Creating app icons with the iOS-style rounded square (superellipse) shape</li>
  <li>Rounding profile photos before uploading to platforms that display them with squared frames</li>
  <li>Adding rounded corners to product images for a modern card-style UI appearance</li>
  <li>Creating rounded thumbnail images for blog posts, video thumbnails, and article headers</li>
  <li>Making sticker-style graphics with rounded corners and transparent backgrounds for messaging apps</li>
</ul>
<p>Corner rounding uses the HTML5 Canvas <code>ctx.roundRect()</code> path drawing API (or a polyfill for older browsers). The canvas draws a rounded rectangle clipping path at the specified border radius, then draws the image inside it. Pixels outside the rounded corners are clipped — for PNG output, these pixels become fully transparent (alpha = 0). For JPG output, they fill with a background color since JPEG does not support transparency. The border radius can be set independently for each corner (top-left, top-right, bottom-right, bottom-left) or uniformly for all four corners.</p>
<p><strong>Input formats:</strong> JPG, PNG, WebP, BMP. <strong>Radius:</strong> 0px (square) to 50% (circular) or exact pixel values. <strong>Per-corner control:</strong> set each corner independently. <strong>Output format:</strong> PNG (transparent corners) or JPG (solid background fill). <strong>Background color:</strong> transparent, white, black, or custom hex for JPG output. <strong>Max file size:</strong> 20 MB.</p>
<p>All processing runs in your browser — no uploads, no server, no storage. The rounded result is generated locally and downloaded instantly. For creating a fully circular image (perfect circle crop), set the radius to exactly 50% of the shorter dimension. After rounding, use the <a href="/tools/image-tools/add-border">Add Border</a> tool to add a colored ring around the rounded edges.</p>
    `,
    extraFaqs: [
      {
        q: 'Will rounding corners reduce image quality?',
        a: 'No — the pixel data inside the rounded area is preserved exactly. PNG output is lossless. Only the corners are removed (made transparent or filled).',
      },
      {
        q: 'What is the maximum image size supported?',
        a: 'Images up to 20 MB and 8000×8000 pixels.',
      },
      {
        q: 'Can I add rounded corners to multiple images at once?',
        a: 'One image at a time. For batch processing, apply the same radius to each image individually.',
      },
      {
        q: 'Does this work on iPhone and Android?',
        a: 'Yes. Adjust the radius slider and download the rounded image in any mobile browser.',
      },
      {
        q: 'Are my images stored after processing?',
        a: 'No. All operations run in your browser. Nothing is uploaded or stored.',
      },
      {
        q: 'How do I create a perfectly circular image?',
        a: 'Set the radius to exactly 50% on a square image. For non-square images, set the radius to half the shorter dimension in pixels — this creates an ellipse that fits the shorter axis.',
      },
    ],
    proTips: [
      "For iOS-style app icons, use a radius of approximately 22% of the icon width — Apple's icon mask uses a superellipse at roughly this radius.",
      'Export as PNG with transparent background, then place the rounded image over any background in your design — this gives you flexibility to change the background color at any time.',
      'Use asymmetric corner radii for creative graphic design — large radius on two diagonal corners with sharp corners on the other two creates a distinctive modern shape.',
      'For profile photos displayed in circular frames by platforms (Instagram, Twitter), rounding your image to a circle beforehand ensures the subject is centered — platforms auto-crop otherwise.',
    ],
  },

  // ─── 36. screenshot-to-pdf ───────────────────────────────────────────────────
  'screenshot-to-pdf': {
    slug: 'screenshot-to-pdf',
    metaTitle: 'Screenshot to PDF Converter Free Online | RoughTools',
    metaDescription:
      'Convert screenshots and images to PDF documents online. Combine multiple screenshots into one PDF. Free.',
    canonicalUrl: 'https://roughtools.com/tools/image-tools/screenshot-to-pdf',
    aboutHTML: `
<p>The <strong>Screenshot to PDF</strong> converter turns one or more screenshots, photos, or images into a PDF document. This is the fastest way to package multiple screenshots into a single shareable file — for bug reports, design reviews, expense receipt collections, test evidence documentation, or any workflow where multiple images need to be delivered as a single document rather than a folder of files.</p>
<p>Converting screenshots to PDF is needed for:</p>
<ul>
  <li>Compiling multiple application screenshots into a single PDF for a bug report or QA review</li>
  <li>Converting expense receipt photos into a single PDF document for reimbursement submission</li>
  <li>Packaging design mockup screenshots into a presentation-ready PDF for client review</li>
  <li>Archiving a sequence of screenshots documenting a process or workflow</li>
  <li>Converting mobile app screenshots into a PDF portfolio or app store preview document</li>
</ul>
<p>PDF generation uses the pdf-lib JavaScript library running in the browser. Each image is loaded and embedded as a JPEG or PNG object in the PDF's content stream. Page dimensions default to the image dimensions (each screenshot becomes its own page at its natural size), or optionally you can fit all images to a standard paper size (A4, Letter). Multiple images are added as sequential pages in the PDF document. The PDF structure is generated according to the PDF 1.7 specification — the output is compatible with all standard PDF readers including Adobe Acrobat, Preview, and browser PDF viewers.</p>
<p><strong>Input formats:</strong> JPG, PNG, WebP, BMP, GIF (single frames). <strong>Page size options:</strong> match image dimensions, A4 portrait, A4 landscape, US Letter. <strong>Image scaling:</strong> fit to page, fill page, or original size. <strong>Page order:</strong> drag and drop to reorder before converting. <strong>Output:</strong> downloadable PDF file. <strong>Max batch:</strong> 50 images per PDF.</p>
<p>PDF generation runs entirely in your browser using pdf-lib — no screenshots are uploaded to any server. This is critical for confidential screenshots containing passwords, financial information, or internal system data. The converted PDF is generated locally and downloaded directly to your device. For converting PDF back to images, use the <a href="/tools/image-tools/image-converter">Image Format Converter</a>.</p>
    `,
    extraFaqs: [
      {
        q: 'Will the PDF quality match my original screenshots?',
        a: 'Yes — screenshots are embedded at full resolution in the PDF. JPG embedding uses 95% quality for minimal compression. PNG embedding is lossless.',
      },
      {
        q: 'What is the maximum number of screenshots I can convert?',
        a: 'Up to 50 images per PDF document. For larger sets, create multiple PDFs and merge them with the PDF Merge tool.',
      },
      {
        q: 'Can I control the order of pages in the PDF?',
        a: 'Yes — drag and drop the screenshot thumbnails to reorder them before clicking convert.',
      },
      {
        q: 'Does this work on iPhone and Android?',
        a: 'Yes. Upload screenshots from your camera roll or screenshot album in any mobile browser.',
      },
      {
        q: 'Are my screenshots stored after PDF creation?',
        a: 'No. PDF generation is entirely browser-based. No screenshots or the resulting PDF are sent to any server.',
      },
      {
        q: 'Can I add titles or page numbers to the PDF?',
        a: 'Basic title and page number overlay options are available. For advanced PDF formatting, use a desktop PDF editor.',
      },
    ],
    proTips: [
      'For technical documentation, keep screenshots at their native resolution and use "match image size" — this preserves every pixel detail rather than scaling to a paper size.',
      'Number your screenshots before converting if the sequence matters — the tool preserves upload order, but having numbered filenames makes it easy to verify the correct sequence.',
      'For client deliverables, add a title page (create a simple title image) as the first screenshot in the batch — this looks more professional than starting directly with a UI screenshot.',
      'Use the A4 fit mode if the PDF will be printed — screen resolutions rarely match print quality, but fitting to A4 size gives consistent page dimensions across different screenshot sizes.',
    ],
  },

  // ─── 37. thumbnail-maker ──────────────────────────────────────────────────────
  'thumbnail-maker': {
    slug: 'thumbnail-maker',
    metaTitle: 'Thumbnail Maker — Create Thumbnails Free Online | RoughTools',
    metaDescription:
      'Create custom thumbnails for YouTube, blogs, and social media. Free online thumbnail maker, no signup.',
    canonicalUrl: 'https://roughtools.com/tools/image-tools/thumbnail-maker',
    aboutHTML: `
<p>The <strong>Thumbnail Maker</strong> creates visually compelling thumbnail images for YouTube videos, blog posts, podcasts, online courses, and social media content. A great thumbnail is the single most important factor in click-through rate for video and article content — this tool gives you the controls to create thumbnails that stand out in crowded feeds without professional design software.</p>
<p>Thumbnail creation is needed for:</p>
<ul>
  <li>Creating YouTube video thumbnails at the recommended 1280×720px (16:9) size</li>
  <li>Making Udemy and online course cover images at 750×422px</li>
  <li>Designing blog post featured images for WordPress, Ghost, and other CMS platforms</li>
  <li>Creating podcast episode artwork at 1400×1400px (Apple Podcasts minimum)</li>
  <li>Producing consistent thumbnail templates for a YouTube channel with a recognizable brand style</li>
</ul>
<p>Thumbnail rendering uses the HTML5 Canvas API for all compositing. Background images are drawn as the base layer, then overlay text is rendered using web fonts at configurable size, weight, color, and position. Text shadow and stroke are applied to ensure readability on any background. A color overlay option adds a semi-transparent tinted layer between the background image and text — a common technique for ensuring high contrast and readability. Multiple text layers can be added and positioned independently. All canvas operations are GPU-accelerated by the browser's rendering engine.</p>
<p><strong>Preset sizes:</strong> YouTube (1280×720), YouTube Short (1080×1920), Instagram Post (1080×1080), Twitter/X (1200×675), Facebook Cover (851×315), Blog Featured (1200×630), Podcast (1400×1400). <strong>Elements:</strong> background image, text overlays (multiple), color overlay, logo/watermark. <strong>Fonts:</strong> Impact, Arial Black, Montserrat, Roboto Bold, and custom font upload. <strong>Output:</strong> JPG or PNG.</p>
<p>All thumbnail creation runs in your browser — no images or designs are sent to any server. The finished thumbnail is downloaded directly from the Canvas API. For resizing an existing image to thumbnail dimensions without adding text or overlays, use the <a href="/tools/image-tools/image-resizer">Image Resizer</a> instead.</p>
    `,
    extraFaqs: [
      {
        q: 'Will the thumbnail quality be good enough for YouTube?',
        a: 'Yes — YouTube recommends 1280×720px at under 2 MB (JPG). The tool generates thumbnails at exactly these specifications with high image quality.',
      },
      {
        q: 'What is the best thumbnail size for YouTube?',
        a: '1280×720px (HD, 16:9 aspect ratio) is the YouTube standard. Under 2 MB file size, JPG format. YouTube displays thumbnails at 320×180 in lists, so text must be large enough to read at that size.',
      },
      {
        q: 'Can I create thumbnails for multiple videos at once?',
        a: 'One thumbnail at a time. Design a template and reuse it by changing the text and background image for each new thumbnail.',
      },
      {
        q: 'Does this work on iPhone and Android?',
        a: 'Yes. Design thumbnails directly in any mobile browser — touch to position text and elements.',
      },
      {
        q: 'Are my designs stored after creating the thumbnail?',
        a: 'No. All design work runs in your browser. Nothing is uploaded or stored.',
      },
      {
        q: 'Can I save my thumbnail template to reuse it?',
        a: 'Save the canvas state by exporting the design as a PNG with full resolution — you can reload it as a background for future thumbnails. Full template saving is not currently supported.',
      },
    ],
    proTips: [
      'Use maximum 3 words of text on a YouTube thumbnail — thumbnails display at 320px wide in search results where more words become unreadable.',
      'High contrast between text and background is the #1 factor in thumbnail readability — use a semi-transparent dark overlay behind white text for guaranteed legibility on any background.',
      'Add a colored border or subtle vignette around the thumbnail edges — YouTube video frames can look similar to adjacent thumbnails, and edge contrast makes yours stand out.',
      'Test your thumbnail at actual thumbnail size before uploading — zoom out in your browser until the thumbnail appears at the 320px size YouTube shows in search results and verify text is still readable.',
    ],
  },

  // ─── 38. white-background-maker ──────────────────────────────────────────────
  'white-background-maker': {
    slug: 'white-background-maker',
    metaTitle: 'White Background Maker Free Online | RoughTools',
    metaDescription:
      'Add a white background to any image or transparent PNG. Perfect for product photos. Free, instant, no signup.',
    canonicalUrl: 'https://roughtools.com/tools/image-tools/white-background-maker',
    aboutHTML: `
<p>The <strong>White Background Maker</strong> adds a solid white background to images with transparent areas (PNG files) or replaces existing backgrounds with clean white — the standard background used by Amazon, eBay, Etsy, and most e-commerce platforms for product listings. Professional product photography requires a pure white background, and this tool delivers it instantly without a photo studio or expensive software.</p>
<p>A white background is essential for:</p>
<ul>
  <li>Meeting Amazon's requirement that main product images have a pure white background (#FFFFFF)</li>
  <li>Creating consistent product photos for an online store where all items need matching white backgrounds</li>
  <li>Converting transparent PNG logos or graphics to JPG format (which requires a background color)</li>
  <li>Preparing images for print-on-demand services that require white backgrounds</li>
  <li>Making product photos appear professional and match marketplace visual standards</li>
</ul>
<p>The white background addition works differently for transparent vs. opaque images. For transparent PNGs, the tool creates a white canvas at the image dimensions and draws the PNG on top — the alpha channel composites naturally, so transparent areas show white and fully opaque areas show the original content. For images with existing backgrounds (non-transparent), the tool first applies AI background detection (subject segmentation) to separate the product from its background, removes the detected background, then composites the product on white. This two-step approach handles real product photos shot on non-white surfaces.</p>
<p><strong>Input formats:</strong> PNG (transparent or opaque), JPG, WebP. <strong>For transparent PNG:</strong> white fill is added instantly in the browser. <strong>For non-transparent images:</strong> AI background removal is applied server-side, then white fill added. <strong>Output format:</strong> JPG (white background, no transparency) or PNG (preserves alpha for further editing). <strong>Background color:</strong> pure white (#FFFFFF) by default, or custom hex color.</p>
<p>For transparent PNG inputs, processing runs entirely in your browser — no uploads needed. For non-transparent images requiring AI background removal, images are processed on our secure server and immediately deleted. No product images are stored or shared. After adding a white background, use the <a href="/tools/image-tools/image-compressor">Image Compressor</a> to reduce file size to meet e-commerce platform upload limits.</p>
    `,
    extraFaqs: [
      {
        q: 'Will the white background change my product image quality?',
        a: 'For transparent PNGs, quality is fully preserved — only background pixels change. For AI background removal, product edges may have minor smoothing at high magnification.',
      },
      {
        q: 'What is the maximum image size supported?',
        a: 'Up to 20 MB for transparent PNG (browser-based). Up to 10 MB for AI background replacement (server-based).',
      },
      {
        q: 'Can I add white backgrounds to multiple product images at once?',
        a: 'Batch processing is not currently available. Process each product image individually.',
      },
      {
        q: 'Does this work on iPhone and Android?',
        a: 'Yes. Upload product photos from your camera roll and download the white background result in any mobile browser.',
      },
      {
        q: 'Are my product images stored after processing?',
        a: 'Transparent PNG processing is browser-based and nothing is uploaded. AI background removal is server-side with immediate deletion after processing.',
      },
      {
        q: 'What white color should I use for Amazon product images?',
        a: 'Use pure white: #FFFFFF (RGB 255, 255, 255). Amazon requires the background to be pure white at 255 on all channels — off-white or near-white backgrounds may fail their review.',
      },
    ],
    proTips: [
      "For Amazon main product images, verify the background is pure #FFFFFF by checking the pixel values in the corners with the Image Color Picker — any value below 255 on any channel may fail Amazon's automated image review.",
      'Photograph products on a white foam board with soft diffused lighting from two sides — this reduces the background replacement work needed and produces cleaner edges on the product.',
      'After adding a white background, compress the JPG to under 1 MB before uploading to Amazon — their system auto-compresses oversized images in ways you cannot control, which may reduce quality.',
      'For products with fine details at the edges (jewelry, fabric textures, hair accessories), review the edges at 200% zoom after AI background removal — manually clean any missed background pixels before downloading.',
    ],
  },
};

export function getImageToolSupplement(slug: string): ImageToolSupplement | undefined {
  return imageToolSupplements[slug];
}
