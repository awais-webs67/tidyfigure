module.exports = {
  order: 8,
  category: 'pdf',
  icon: 'minimize-2',
  popular: true,
  files: true,
  libs: ['https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js'],
  name: 'Compress PDF',
  keywords: 'reduce pdf size shrink pdf make pdf smaller pdf under 1mb email',
  short: 'Shrink scanned and image-heavy PDFs to fit email and upload limits.',
  title: 'Compress PDF: Reduce PDF File Size Online, Free',
  description: 'Make scanned and image-heavy PDFs smaller for email and upload forms. Three compression levels, black & white option, no upload, no watermark, no sign-up.',
  related: ['delete-pdf-pages', 'image-compressor', 'pdf-to-jpg'],
  answer: `Large PDFs are almost always large because of <strong>images</strong>: scanned pages and photos. This compressor redraws every page as an optimised image, which typically shrinks scanned documents by <strong>50–90%</strong>. Choose "Recommended" for a good balance, "Strong" to hit tight upload limits, and tick black &amp; white for text scans.`,
  article: `
<h2>What makes a PDF big?</h2>
<p>Text and vector graphics take very little space: a 50-page text report can be under 500 KB. Scans and photos are different. A single page scanned at 600 DPI in colour can be 5 MB or more, so a 10-page scanned contract easily reaches 40 MB, far above most email and upload limits.</p>

<h2>How this compressor works</h2>
<p>Each page is drawn at a sensible resolution and saved as a compressed JPG image inside a new PDF of the same page size:</p>
<div class="scroll"><table class="tbl">
<thead><tr><th>Level</th><th class="n">Resolution</th><th class="n">Quality</th><th>Best for</th></tr></thead>
<tbody>
<tr><td>Strong</td><td class="n">96 DPI</td><td class="n">55%</td><td>Upload limits of 1–2 MB, viewing on screen</td></tr>
<tr><td>Recommended</td><td class="n">130 DPI</td><td class="n">70%</td><td>Email, most forms, easy reading</td></tr>
<tr><td>Light</td><td class="n">170 DPI</td><td class="n">82%</td><td>Printing, small text, detailed diagrams</td></tr>
</tbody></table></div>
<p><strong>Black &amp; white</strong> removes colour information, which makes scans of letters and forms noticeably smaller.</p>

<h2>The trade-off</h2>
<p>Because pages become images, text in the compressed PDF can't be selected, searched or copied, and links stop working. That's usually fine for scans (which were images already) and for documents you only need to send or print. For a text-based PDF that's already small, compression may not help at all; the tool tells you if the result would be bigger and keeps your original.</p>

<h2>Other ways to shrink a PDF</h2>
<ul>
<li><strong>Remove pages you don't need</strong> with Delete PDF Pages. Fewer pages always means a smaller file.</li>
<li><strong>Compress the photos before making the PDF.</strong> Run them through the Image Compressor, then use JPG to PDF.</li>
<li><strong>Scan at 150–200 DPI</strong> instead of 600 next time; it's plenty for documents.</li>
</ul>

<h2>Private by design</h2>
<p>Compression runs in your browser. Your document is never uploaded, which matters for IDs, payslips and contracts, the documents people most often need to shrink for official forms.</p>`,
  faqs: [
    ['How do I reduce the size of a PDF?', 'Open it here, choose a compression level and press Compress. Scanned and image-heavy PDFs typically shrink by 50–90%.'],
    ['How do I compress a PDF to under 1 MB?', 'Choose Strong and tick black & white for text scans. If it’s still too big, remove pages you don’t need first.'],
    ['Why can’t I select text after compressing?', 'Pages are redrawn as images to save space. Keep the original PDF if you need selectable text.'],
    ['Why didn’t my PDF get smaller?', 'Text-only PDFs are already efficient. Compression helps PDFs that contain scans and photos.'],
    ['Is my PDF uploaded?', 'No. Compression happens on your device.'],
  ],
};
