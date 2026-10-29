<?php
// Compress PDF to 200 KB: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Compress PDF to 200 KB',
  'category' => 'pdf',
  'order' => 32,
  'files' => true,
  'libs' => ['https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js'],
  'use' => 'compress-pdf',
  'preset' => json_decode('{"kb": 200}', true),
  'icon' => 'minimize-2',
  'keywords' => 'compress pdf to 200kb reduce pdf size to 200 kb pdf under 200 kb online free make pdf smaller than 200 kb',
  'aka' => ['PDF under 200 KB', 'reduce PDF to 200 KB'], // other names people search for
  'short' => 'Shrink a PDF to under 200 KB for upload forms and email, keeping it as sharp as that size allows.',
  'title' => 'Compress PDF to 200 KB Online Free (Under 200 KB)',
  'description' => <<<'EOT_TF'
Reduce a PDF to under 200 KB: the sharpest version that fits is found automatically, ready for upload forms and email. Free, private, nothing uploaded.
EOT_TF,
  'related' => ['compress-pdf', 'delete-pdf-pages', 'resize-image-to-kb'],
  'answer' => <<<'EOT_TF'
Drop your PDF and press <strong>Compress PDF</strong>: the size limit is already set to <strong>200 KB</strong>. The tool tries stronger and stronger compression and keeps the <strong>sharpest version under 200 KB</strong>, so the document stays as readable as possible. Then check the preview and download.
EOT_TF,
  'article' => <<<'EOT_TF'
<h2>How to compress a PDF to 200 KB</h2>
<ol>
<li>Drop your PDF in the box. Exact size is already chosen, with a limit of 200 KB.</li>
<li>Press <strong>Compress PDF</strong>. Each page is read once, then several compression levels are tried.</li>
<li>Check the page previews and the size, then download.</li>
</ol>

<h2>Where a 200 KB limit comes up</h2>
<p>A 200 KB limit is common for supporting documents on job, scholarship and government application sites, such as degree certificates, experience letters and proof of address.</p>

<h2>How it gets under the limit</h2>
<p>Big PDFs are big because of their images: scanned pages and photos. The compressor redraws every page as an optimised image and steps down the resolution and JPG quality until the file fits under 200 KB, using a binary search so it finds the best level in a few tries. If even the strongest level is too big, it switches to black and white (much smaller for text scans) and tells you if it still doesn't fit; then removing pages you don't need with <a href="/delete-pdf-pages">Delete PDF Pages</a> or splitting the file is the way forward.</p>
<p>Because pages become images, text in the result can't be selected or searched. Keep your original, and if you need searchable text afterwards, run the small file through <a href="/ocr-pdf">OCR PDF</a>.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I reduce a PDF to 200 KB?',
      <<<'EOT_TF'
Drop it here and press Compress PDF. The limit is already 200 KB; the tool finds the sharpest version that fits and you download it.
EOT_TF,
    ],
    [
      'Will the text still be readable?',
      <<<'EOT_TF'
Usually yes. The tool always keeps the highest quality that fits the limit. Check the preview; if text is too blurry, remove pages you don’t need or split the PDF.
EOT_TF,
    ],
    [
      'What if my PDF is already small enough?',
      <<<'EOT_TF'
If it is already under 200 KB, the tool tells you and you can upload it as it is.
EOT_TF,
    ],
    [
      'Is my PDF uploaded?',
      <<<'EOT_TF'
No. It is compressed in your browser and never leaves your device.
EOT_TF,
    ],
  ],
];
