module.exports = {
  order: 7,
  category: 'pdf',
  icon: 'file-image',
  popular: true,
  files: true,
  libs: ['https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'],
  name: 'PDF to JPG',
  keywords: 'pdf to image pdf to png convert pdf pages to pictures',
  short: 'Turn every PDF page into a JPG, PNG or WebP image at up to 300 DPI.',
  title: 'PDF to JPG Converter: Turn PDF Pages Into Images, Free',
  description: 'Convert PDF pages to high-quality JPG, PNG or WebP images at 72, 150 or 300 DPI. Pick pages, download one by one or as a zip. No upload, no watermark.',
  related: ['jpg-to-pdf', 'image-compressor', 'split-pdf'],
  answer: `To turn a PDF into images, open it, choose JPG or PNG and a resolution, and convert: each page becomes one image. <strong>150 DPI</strong> is sharp on screens and in documents; use <strong>300 DPI</strong> for printing. PNG keeps small text crisper, while JPG makes much smaller files for photos and scans.`,
  article: `
<h2>Why convert a PDF to images?</h2>
<ul>
<li><strong>Social media and messaging:</strong> Instagram, WhatsApp statuses and many chat apps accept images but not PDFs.</li>
<li><strong>Presentations and documents:</strong> drop a page from a report into a slide or a Word document.</li>
<li><strong>Websites:</strong> show a preview of a brochure or menu without making visitors download it.</li>
<li><strong>Upload forms</strong> that only accept JPG or PNG, such as some ID and application portals.</li>
</ul>

<h2>Choosing a resolution</h2>
<p>PDF pages don't have pixels; they're drawn at whatever size you ask for. DPI (dots per inch) sets how many pixels each inch of the page becomes.</p>
<div class="scroll"><table class="tbl">
<thead><tr><th>DPI</th><th class="n">A4 page size</th><th>Best for</th></tr></thead>
<tbody>
<tr><td>72</td><td class="n">595 × 842 px</td><td>Thumbnails, quick previews</td></tr>
<tr><td>150</td><td class="n">1240 × 1754 px</td><td>Screens, social media, documents</td></tr>
<tr><td>300</td><td class="n">2480 × 3508 px</td><td>Printing, zooming into detail</td></tr>
</tbody></table></div>

<h2>JPG, PNG or WebP?</h2>
<ul>
<li><strong>JPG</strong> works everywhere and keeps photos and scanned pages small.</li>
<li><strong>PNG</strong> is lossless, so text, lines and diagrams stay perfectly sharp, at the cost of larger files.</li>
<li><strong>WebP</strong> is smaller than both and good for websites, but some older software can't open it.</li>
</ul>

<h2>Converting only some pages</h2>
<p>Type a range like <em>1-3, 5</em> in the Pages box to convert just those pages. Leave it empty for all pages. When there's more than one image, "Download all" puts them in a single .zip file.</p>

<h2>How it works</h2>
<p>The converter uses PDF.js, the open-source PDF engine built into Firefox, to draw each page in your browser and save it as an image. Your PDF is never uploaded. Pages with transparent backgrounds are placed on white so they look the same as in a PDF reader.</p>`,
  faqs: [
    ['How do I convert a PDF to JPG?', 'Open the PDF, choose JPG and a resolution, and press Convert. Download each page as an image, or all pages together as a zip file.'],
    ['What resolution should I use?', '150 DPI for screens and documents, 300 DPI for printing. 72 DPI gives small preview images.'],
    ['Can I convert just one page?', 'Yes. Type the page number in the Pages box, for example 3, or a range like 2-4.'],
    ['Will text in the image be searchable?', 'No. Images contain pixels, not text. Keep the original PDF if you need to search or copy text.'],
    ['Is my PDF uploaded?', 'No. Pages are converted in your browser.'],
  ],
};
