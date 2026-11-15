<?php
return [
    'name' => 'Compress PDF to 100 KB',
    'updated' => '2026-11-15',
    'category' => 'pdf',
    'order' => 31,
    'files' => true,
    'libs' => [
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js',
    ],
    'use' => 'compress-pdf',
    'preset' => [
        'kb' => 100,
    ],
    'icon' => 'minimize-2',
    'keywords' => 'compress pdf to 100kb, reduce pdf under 100kb, certificate pdf 100kb compressor, no upload pdf 100kb',
    'aka' => ['100 KB PDF Compressor', 'Shrink PDF Below 100KB'],
    'short' => 'Shrink a PDF to under 100 KB for upload forms and email, keeping it as sharp as that size allows.',
    'title' => 'Compress PDF to 100 KB Free – Under 100KB',
    'description' => 'Automatically shrink scanned certificates, CVs and single-page PDFs strictly under 100 KB at highest readable sharpness locally in your tab.',
    'related' => ['compress-pdf', 'delete-pdf-pages', 'resize-image-to-kb'],
    'answer' => 'Drop your PDF and press <strong>Compress PDF</strong>: the size limit is already set to <strong>100 KB</strong>. The tool tries stronger and stronger compression and keeps the <strong>sharpest version under 100 KB</strong>, so the document stays as readable as possible. Then check the preview and download.',
    'article' => <<<'EOT_TF'
<h2>How to compress a PDF to 100 KB</h2>
<ol>
<li>Drop your PDF in the box. Exact size is already chosen, with a limit of 100 KB.</li>
<li>Press <strong>Compress PDF</strong>. Each page is read once, then several compression levels are tried.</li>
<li>Check the page previews and the size, then download.</li>
</ol>

<h2>Where a 100 KB limit comes up</h2>
<p>Exam and admission portals often ask for certificates, mark sheets and ID documents as PDFs of no more than 100 KB each. That's tight for a scan, so a one-page document works best; for several pages, black and white helps a lot.</p>

<h2>How it gets under the limit</h2>
<p>Big PDFs are big because of their images: scanned pages and photos. The compressor redraws every page as an optimised image and steps down the resolution and JPG quality until the file fits under 100 KB, using a binary search so it finds the best level in a few tries. If even the strongest level is too big, it switches to black and white (much smaller for text scans) and tells you if it still doesn't fit; then removing pages you don't need with <a href="/delete-pdf-pages">Delete PDF Pages</a> or splitting the file is the way forward.</p>
<p>Because pages become images, text in the result can't be selected or searched. Keep your original, and if you need searchable text afterwards, run the small file through <a href="/ocr-pdf">OCR PDF</a>.</p>

<h2>Making Multi-Page Scans Fit Under 100 KB Readably</h2>
<p>Strict 100 KB upload limits commonly appear on government scholarships, pension KYC forms and hospital claims. Automated binary-search downsampling calibrates DPI and grayscale text contrast cleanly—though squeezing ten noisy colour pages under 100 KB hurts legibility, so splitting extra pages first helps enormously.</p>

<h2>Converting Colour Scans to Crisp Black &amp; White Below 100 KB</h2>
<p>Most ink signatures and black laser-printed certificates keep sharpest clarity under 100 KB when saved as clean monochrome scans rather than noisy RGB colour pictures—cutting compressed file size roughly in half instantly.</p>
EOT_TF,
    'faqs' => [
        ['How do I reduce a PDF to 100 KB?', 'Drop it here and press Compress PDF. The limit is already 100 KB; the tool finds the sharpest version that fits and you download it.'],
        ['Will the text still be readable?', 'Usually yes. The tool always keeps the highest quality that fits the limit. Check the preview; if text is too blurry, remove pages you don’t need or split the PDF.'],
        ['What if my PDF is already small enough?', 'If it is already under 100 KB, the tool tells you and you can upload it as it is.'],
        ['Is my PDF uploaded?', 'No. It is compressed in your browser and never leaves your device.'],
        ['Is the file guaranteed under 100,000 bytes after compression?', 'Yes. Binary quality tuning checks the encoded PDF byte length on your device before download and steps down automatically until it fits below 100 KB.'],
    ],
];
