<?php
return [
    'name' => 'Scan to PDF',
    'updated' => '2026-11-15',
    'category' => 'pdf',
    'order' => 28,
    'files' => true,
    'libs' => [
        'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
    ],
    'icon' => 'file-scan',
    'keywords' => 'scan to pdf online free, phone camera document scanner browser, crisp black white scan pdf no app',
    'aka' => ['Browser Document Scanner', 'Receipt & Paperwork to PDF'],
    'short' => 'Scan documents with your phone camera: corners found automatically, pages straightened and cleaned up, saved as one PDF.',
    'title' => 'Scan to PDF Free – Phone Camera to Clean PDF',
    'description' => 'Capture receipts, ID cards and homework straight from phone camera or photos with auto corner cropping, contrast whitening and multi-page PDF.',
    'related' => ['jpg-to-pdf', 'ocr-pdf', 'compress-pdf'],
    'answer' => 'Press <strong>Take photo</strong> (or choose photos you already have) for each page. The edges of the paper are found automatically and the page is <strong>straightened and cleaned up</strong> as if it came from a scanner: drag the corners to adjust and pick a look (enhanced, original, grey or black and white). Then press <strong>Make PDF</strong>. No app needed, and nothing is uploaded.',
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

<h2>Getting Flat Shadows-Free Scans Under Ceiling Lights</h2>
<p>Stand slightly back and use 2× phone zoom under indirect daylight instead of holding your lens centimetres above glossy paper—eliminating central camera shadows and wide-angle barrel warp before auto perspective flattening runs.</p>

<h2>Bundling Multi-Page Expenses, Contracts &amp; IDs Cleanly</h2>
<p>Snap multi-page paperwork directly in sequence, sharpen ink contrast on whiteboard notes or faded receipts, and download a compact crisp A4 PDF without app subscriptions or cloud storage fees.</p>
EOT_TF,
    'faqs' => [
        ['How do I scan a document to PDF with my phone?', 'Open this page on your phone, press Take photo for each page, check the straightened pages and press Make PDF. No app is needed.'],
        ['Does it straighten photos of documents?', 'Yes. The corners of the paper are found automatically and the page is flattened into a rectangle. You can drag the corners if the guess isn’t perfect.'],
        ['Can I scan several pages into one PDF?', 'Yes. Add as many pages as you like, reorder them, and they are saved together in one PDF.'],
        ['Are my scans uploaded?', 'No. The photos are processed in your browser and never leave your device.'],
        ['Can I turn existing crooked desk photos in my gallery into clean flat PDF scans?', 'Yes. Pick photos already on your camera roll, adjust corner points if needed and apply document contrast whitening locally.'],
    ],
];
