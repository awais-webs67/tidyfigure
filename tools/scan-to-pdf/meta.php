<?php
// Scan to PDF: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Scan to PDF',
  'category' => 'pdf',
  'order' => 28,
  'files' => true,
  'libs' => ['https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'],
  'icon' => 'file-scan',
  'keywords' => 'scan to pdf online free phone scanner document scanner app camera to pdf scan documents with phone photo of document to pdf',
  'aka' => ['document scanner', 'phone scanner', 'camera to PDF'], // other names people search for
  'short' => 'Scan documents with your phone camera: corners found automatically, pages straightened and cleaned up, saved as one PDF.',
  'title' => 'Scan to PDF Online Free: Phone Document Scanner',
  'description' => <<<'EOT_TF'
Scan documents to PDF with your phone or webcam: edges found automatically, pages straightened and whitened, many pages in one PDF. Free, no app, no upload.
EOT_TF,
  'related' => ['jpg-to-pdf', 'ocr-pdf', 'compress-pdf'],
  'answer' => <<<'EOT_TF'
Press <strong>Take photo</strong> (or choose photos you already have) for each page. The edges of the paper are found automatically and the page is <strong>straightened and cleaned up</strong> as if it came from a scanner: drag the corners to adjust and pick a look (enhanced, original, grey or black and white). Then press <strong>Make PDF</strong>. No app needed, and nothing is uploaded.
EOT_TF,
  'article' => <<<'EOT_TF'
<h2>How to scan a document to PDF with your phone</h2>
<ol>
<li>Open this page on your phone and press <strong>Take photo</strong>. Hold the phone above the page so the whole sheet is in view.</li>
<li>The edges of the paper are found and the page is straightened. Tap a page to drag its corners if needed, turn it, or choose a different look.</li>
<li>Add more pages the same way; move them earlier or later with the arrows.</li>
<li>Choose the paper size and press <strong>Make PDF</strong>, then download or share it.</li>
</ol>

<h2>Looks for every kind of document</h2>
<ul>
<li><strong>Enhanced:</strong> the paper becomes white and the colours brighter, like a good office scan. Best for most documents.</li>
<li><strong>Original:</strong> the colours exactly as photographed, for photos and colourful pages.</li>
<li><strong>Grey:</strong> clean greyscale, a smaller file for text documents.</li>
<li><strong>Black &amp; white:</strong> crisp black text on pure white, ideal for receipts, forms and handwritten notes, and the smallest files.</li>
</ul>

<h2>Tips for great scans</h2>
<ul>
<li>Put the paper on a darker surface, so its edges stand out.</li>
<li>Use daylight or a bright room, and avoid your shadow falling on the page.</li>
<li>Hold the phone flat above the page rather than at an angle.</li>
<li>To make the text searchable afterwards, put the PDF through <a href="/ocr-pdf">OCR PDF</a>.</li>
</ul>

<h2>No app and no upload</h2>
<p>Scanner apps often want an account, add a watermark or upload your pages. This scanner runs in your browser: your photos and the PDF stay on your device. On a computer, you can use a webcam or photos from your phone.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I scan a document to PDF with my phone?',
      <<<'EOT_TF'
Open this page on your phone, press Take photo for each page, check the straightened pages and press Make PDF. No app is needed.
EOT_TF,
    ],
    [
      'Does it straighten photos of documents?',
      <<<'EOT_TF'
Yes. The corners of the paper are found automatically and the page is flattened into a rectangle. You can drag the corners if the guess isn’t perfect.
EOT_TF,
    ],
    [
      'Can I scan several pages into one PDF?',
      <<<'EOT_TF'
Yes. Add as many pages as you like, reorder them, and they are saved together in one PDF.
EOT_TF,
    ],
    [
      'Are my scans uploaded?',
      <<<'EOT_TF'
No. The photos are processed in your browser and never leave your device.
EOT_TF,
    ],
  ],
];
