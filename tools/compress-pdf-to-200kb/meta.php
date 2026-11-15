<?php
return [
    'name' => 'Compress PDF to 200 KB',
    'updated' => '2026-11-15',
    'category' => 'pdf',
    'order' => 32,
    'files' => true,
    'libs' => [
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js',
    ],
    'use' => 'compress-pdf',
    'preset' => [
        'kb' => 200,
    ],
    'icon' => 'minimize-2',
    'keywords' => 'compress pdf to 200kb, reduce pdf under 200kb, visa portal pdf 200kb compressor, shrink resume pdf 200kb',
    'aka' => ['200 KB PDF Compressor', 'Visa & Portal 200KB PDF Tool'],
    'short' => 'Shrink a PDF to under 200 KB for upload forms and email, keeping it as sharp as that size allows.',
    'title' => 'Compress PDF to 200 KB Free – Under 200KB',
    'description' => 'Calibrate PDFs automatically just under 200 KB for university applications, visas and bank KYC portals without uploading private paperwork.',
    'related' => ['compress-pdf', 'delete-pdf-pages', 'resize-image-to-kb'],
    'answer' => 'Drop your PDF and press <strong>Compress PDF</strong>: the size limit is already set to <strong>200 KB</strong>. The tool tries stronger and stronger compression and keeps the <strong>sharpest version under 200 KB</strong>, so the document stays as readable as possible. Then check the preview and download.',
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

<h2>Balancing Transcript Tables &amp; Stamp Clarity at 200 KB</h2>
<p>A 200 KB cap fits one-to-four-page bank statements, degree transcripts and signed rental contracts comfortably at ~120–150 DPI without muddying embossed stamps or micro-print footnotes. Keep high contrast by preferring greyscale on black-ink paperwork.</p>

<h2>Splitting Large Multi-Document Bundles Before 200 KB Compression</h2>
<p>If an embassy requires passport biographic pages plus bank letters inside separate 200 KB PDFs, run Split PDF first rather than cramming ten scans into one tiny document—every page stays razor sharp.</p>
EOT_TF,
    'faqs' => [
        ['How do I reduce a PDF to 200 KB?', 'Drop it here and press Compress PDF. The limit is already 200 KB; the tool finds the sharpest version that fits and you download it.'],
        ['Will the text still be readable?', 'Usually yes. The tool always keeps the highest quality that fits the limit. Check the preview; if text is too blurry, remove pages you don’t need or split the PDF.'],
        ['What if my PDF is already small enough?', 'If it is already under 200 KB, the tool tells you and you can upload it as it is.'],
        ['Is my PDF uploaded?', 'No. It is compressed in your browser and never leaves your device.'],
        ['Can a 2-page PDF transcript look clear below 200 KB?', 'Yes. Two standard scanned pages sit around 90 KB each under smart adaptive JPEG compression—completely legible at 100% print zoom.'],
        ['Are compressed visa and KYC PDFs kept completely offline on my computer?', 'Yes. Zero bytes leave your browser tab, keeping passport numbers and bank statements strictly private.'],
    ],
];
