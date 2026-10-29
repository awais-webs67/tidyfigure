<?php
// OCR PDF: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'OCR PDF',
  'updated' => '2026-10-29', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'pdf',
  'order' => 27,
  'files' => true,
  'libs' => ['https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js'],
  'icon' => 'scan-text',
  'keywords' => 'ocr pdf online free make scanned pdf searchable searchable pdf convert scanned pdf to text selectable pdf ocr scan',
  'aka' => ['searchable PDF', 'make scanned PDF searchable', 'PDF OCR'], // other names people search for
  'short' => 'Make a scanned PDF searchable: its text can be selected, copied and found, while the pages look exactly the same.',
  'title' => 'OCR PDF Online Free: Make Scanned PDFs Searchable',
  'description' => <<<'EOT_TF'
Make scanned PDFs searchable online: text recognition in 20 languages adds selectable, copyable text while every page looks the same. Free, private, no upload.
EOT_TF,
  'related' => ['image-to-text', 'pdf-to-text', 'compress-pdf'],
  'answer' => <<<'EOT_TF'
Drop a scanned PDF, choose the language of the text and press <strong>Make searchable</strong>. Each scanned page is read by OCR (optical character recognition) and an <strong>invisible layer of text</strong> is added exactly over the words, so you can search, select and copy them, while the page looks just as before.
EOT_TF,
  'article' => <<<'EOT_TF'
<h2>How to make a scanned PDF searchable</h2>
<ol>
<li>Drop the scanned PDF in the box, or try the sample scan.</li>
<li>Choose the language of the text (and a second one if the document mixes two).</li>
<li>Press <strong>Make searchable</strong>. Pages that already contain text are skipped, so only the scans are read.</li>
<li>Download the searchable PDF. Press Ctrl+F in any PDF reader to search it, or select text to copy it.</li>
</ol>

<h2>What OCR does</h2>
<p>A scanner or phone camera makes a PDF that holds photos of pages: you can read them, but your computer can't, so you can't search, copy or highlight the words, and screen readers can't read them aloud. OCR (optical character recognition) finds the words in each photo. This tool adds those words to the PDF as invisible text placed exactly over the printed words. Nothing on the page changes visually and the scan keeps its quality; the PDF simply becomes searchable.</p>

<h2>Tips for the best results</h2>
<ul>
<li>Choose the right language: it makes a big difference to accuracy, especially for accents.</li>
<li>Scans at 200 to 300 dpi, straight and in focus, give the best results.</li>
<li>Printed text is read very accurately; handwriting usually isn't.</li>
<li>Reading takes a few seconds per page on a computer and longer on a phone, because everything happens on your device.</li>
</ul>

<h2>Private by design</h2>
<p>Scanned documents are often contracts, IDs, medical letters or bank papers. The text recognition runs in your browser, so the PDF is never uploaded. To get the text out instead, use <a href="/image-to-text">Image to Text</a> or <a href="/pdf-to-text">PDF to Text</a> on the searchable file.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I make a scanned PDF searchable for free?',
      <<<'EOT_TF'
Drop it here, choose the language and press Make searchable. The result has invisible, searchable text over every scanned page. It is free with no sign-up.
EOT_TF,
    ],
    [
      'Will my PDF look different?',
      <<<'EOT_TF'
No. The scanned pages stay exactly as they were; only invisible text is added on top, so you can search, select and copy it.
EOT_TF,
    ],
    [
      'Which languages are supported?',
      <<<'EOT_TF'
English, Urdu, Arabic, Hindi, Bengali, Spanish, French, German, Portuguese, Italian, Dutch, Polish, Turkish, Russian, Ukrainian, Indonesian, Vietnamese, Persian, Chinese, Japanese and Korean, and you can combine two.
EOT_TF,
    ],
    [
      'Is my PDF uploaded?',
      <<<'EOT_TF'
No. The text is recognised in your browser and the file never leaves your device.
EOT_TF,
    ],
  ],
];
