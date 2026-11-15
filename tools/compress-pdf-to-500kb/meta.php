<?php
return [
    'name' => 'Compress PDF to 500 KB',
    'updated' => '2026-11-15',
    'category' => 'pdf',
    'order' => 33,
    'files' => true,
    'libs' => [
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js',
    ],
    'use' => 'compress-pdf',
    'preset' => [
        'kb' => 500,
    ],
    'icon' => 'minimize-2',
    'keywords' => 'compress pdf to 500kb, shrink pdf under 500kb, job portal resume pdf 500kb, reduce contract size 500kb',
    'aka' => ['500 KB PDF Compressor', 'Resume & Portal 500KB Tool'],
    'short' => 'Shrink a PDF to under 500 KB for upload forms and email, keeping it as sharp as that size allows.',
    'title' => 'Compress PDF to 500 KB Free – Under 500KB',
    'description' => 'Compress long contracts, tax returns and colour slide PDFs cleanly below 500 KB for HR portals and government submissions on your own device.',
    'related' => ['compress-pdf', 'delete-pdf-pages', 'resize-image-to-kb'],
    'answer' => 'Drop your PDF and press <strong>Compress PDF</strong>: the size limit is already set to <strong>500 KB</strong>. The tool tries stronger and stronger compression and keeps the <strong>sharpest version under 500 KB</strong>, so the document stays as readable as possible. Then check the preview and download.',
    'article' => <<<'EOT_TF'
<h2>How to compress a PDF to 500 KB</h2>
<ol>
<li>Drop your PDF in the box. Exact size is already chosen, with a limit of 500 KB.</li>
<li>Press <strong>Compress PDF</strong>. Each page is read once, then several compression levels are tried.</li>
<li>Check the page previews and the size, then download.</li>
</ol>

<h2>Where a 500 KB limit comes up</h2>
<p>Many online forms, HR portals and insurance claims accept documents up to 500 KB. It's enough for a few scanned pages at good quality.</p>

<h2>How it gets under the limit</h2>
<p>Big PDFs are big because of their images: scanned pages and photos. The compressor redraws every page as an optimised image and steps down the resolution and JPG quality until the file fits under 500 KB, using a binary search so it finds the best level in a few tries. If even the strongest level is too big, it switches to black and white (much smaller for text scans) and tells you if it still doesn't fit; then removing pages you don't need with <a href="/delete-pdf-pages">Delete PDF Pages</a> or splitting the file is the way forward.</p>
<p>Because pages become images, text in the result can't be selected or searched. Keep your original, and if you need searchable text afterwards, run the small file through <a href="/ocr-pdf">OCR PDF</a>.</p>

<h2>Handling Scanned Signatures &amp; Official Seals at 500 KB</h2>
<p>Unlike harsh 100 KB targets, 500 KB gives 5–10 page passport packages, insurance policies and signed deeds plenty of headroom to keep coloured ink stamps and cursive signatures sharp while staying half an average email limit.</p>

<h2>Why Binary-Search PDF Sizing Preserves Readable Fine Print</h2>
<p>Standard one-click compressors either overshoot 500 KB—forcing rejection—or drop resolution recklessly down to unreadable 72 DPI thumbnails. Iterative byte targeting lands just under 495 KB so clauses remain effortless to inspect.</p>
EOT_TF,
    'faqs' => [
        ['How do I reduce a PDF to 500 KB?', 'Drop it here and press Compress PDF. The limit is already 500 KB; the tool finds the sharpest version that fits and you download it.'],
        ['Will the text still be readable?', 'Usually yes. The tool always keeps the highest quality that fits the limit. Check the preview; if text is too blurry, remove pages you don’t need or split the PDF.'],
        ['What if my PDF is already small enough?', 'If it is already under 500 KB, the tool tells you and you can upload it as it is.'],
        ['Is my PDF uploaded?', 'No. It is compressed in your browser and never leaves your device.'],
        ['Why do HR applicant tracking portals cap uploads at 500 KB?', 'Applicant systems handle thousands of daily attachments; fitting resumes cleanly under 500 KB speeds recruiter previews and prevents upload timeouts.'],
        ['Does compressing a PDF below 500 KB work safely on mobile Chrome and Safari?', 'Yes. Works on phones and desktop without app installs, though huge 40+ page scans compress fastest on laptops.'],
    ],
];
