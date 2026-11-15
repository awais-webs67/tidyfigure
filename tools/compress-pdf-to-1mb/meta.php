<?php
return [
    'name' => 'Compress PDF to 1 MB',
    'updated' => '2026-11-15',
    'category' => 'pdf',
    'order' => 34,
    'files' => true,
    'libs' => [
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js',
    ],
    'use' => 'compress-pdf',
    'preset' => [
        'kb' => 1000,
    ],
    'icon' => 'minimize-2',
    'keywords' => 'compress pdf to 1mb, shrink pdf under 1mb online, portfolio assignment pdf 1mb, reduce scanned pdf 1mb',
    'aka' => ['1 MB PDF Compressor', 'Under 1MB PDF Reducer'],
    'short' => 'Shrink a PDF to under 1 MB for upload forms and email, keeping it as sharp as that size allows.',
    'title' => 'Compress PDF to 1 MB Online Free – Under 1MB',
    'description' => 'Reduce oversized portfolios, multi-page assignments and scanned contracts strictly under 1 MB with clean visual balance locally without uploading.',
    'related' => ['compress-pdf', 'delete-pdf-pages', 'resize-image-to-kb'],
    'answer' => 'Drop your PDF and press <strong>Compress PDF</strong>: the size limit is already set to <strong>1 MB</strong>. The tool tries stronger and stronger compression and keeps the <strong>sharpest version under 1 MB</strong>, so the document stays as readable as possible. Then check the preview and download.',
    'article' => <<<'EOT_TF'
<h2>How to compress a PDF to 1 MB</h2>
<ol>
<li>Drop your PDF in the box. Exact size is already chosen, with a limit of 1 MB.</li>
<li>Press <strong>Compress PDF</strong>. Each page is read once, then several compression levels are tried.</li>
<li>Check the page previews and the size, then download.</li>
</ol>

<h2>Where a 1 MB limit comes up</h2>
<p>Visa applications, university portals and many company systems cap uploads at 1 MB, and smaller attachments also send faster by email and WhatsApp.</p>

<h2>How it gets under the limit</h2>
<p>Big PDFs are big because of their images: scanned pages and photos. The compressor redraws every page as an optimised image and steps down the resolution and JPG quality until the file fits under 1 MB, using a binary search so it finds the best level in a few tries. If even the strongest level is too big, it switches to black and white (much smaller for text scans) and tells you if it still doesn't fit; then removing pages you don't need with <a href="/delete-pdf-pages">Delete PDF Pages</a> or splitting the file is the way forward.</p>
<p>Because pages become images, text in the result can't be selected or searched. Keep your original, and if you need searchable text afterwards, run the small file through <a href="/ocr-pdf">OCR PDF</a>.</p>

<h2>Ideal Sweet Spot for Multi-Page CVs &amp; Slide Decks</h2>
<p>At 1 MB (~1,000 KB), even a 15-page portfolio or illustrated property brochure keeps vivid colour charts and crisp embedded images cleanly legible while slipping effortlessly through university LMS portals and cautious corporate spam filters.</p>

<h2>Fitting High-Resolution Architecture &amp; Medical Submissions Under 1 MB</h2>
<p>Online permit boards, healthcare insurance claims and PhD application portals often fail silently near 1 MB boundaries. Binary calibration avoids rough 50%-quality trial and error, targeting ~960–990 KB reliably with clear line drawings.</p>
EOT_TF,
    'faqs' => [
        ['How do I reduce a PDF to 1 MB?', 'Drop it here and press Compress PDF. The limit is already 1 MB; the tool finds the sharpest version that fits and you download it.'],
        ['Will the text still be readable?', 'Usually yes. The tool always keeps the highest quality that fits the limit. Check the preview; if text is too blurry, remove pages you don’t need or split the PDF.'],
        ['What if my PDF is already small enough?', 'If it is already under 1 MB, the tool tells you and you can upload it as it is.'],
        ['Is my PDF uploaded?', 'No. It is compressed in your browser and never leaves your device.'],
        ['Will hyperlinked URLs inside my PDF resume keep clicking cleanly at 1 MB?', 'Whenever pages don\'t require full bitmap rasterisation, clean text and structure preserve crisp legibility—check visual preview zoom before submitting.'],
        ['Can I compress an oversized 18 MB scanned brochure down under 1 MB locally?', 'Yes. Choose balanced or strong compression and let adaptive downsampling test byte size iteratively inside your browser.'],
    ],
];
