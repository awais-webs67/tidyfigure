<?php
return [
    'name' => 'JPG to PDF',
    'updated' => '2026-11-15',
    'category' => 'pdf',
    'order' => 2,
    'icon' => 'file-plus-2',
    'popular' => true,
    'files' => true,
    'libs' => ['https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js'],
    'keywords' => 'jpg to pdf converter, combine photos into one pdf, png to pdf free no upload, scan photos to pdf',
    'aka' => ['Images to PDF Merger', 'Photo Album to PDF Maker'],
    'short' => 'Turn photos and scans into one PDF, with A4 or Letter pages and margins.',
    'title' => 'JPG to PDF Converter – Photos to One PDF',
    'description' => 'Combine multiple JPG, PNG and WebP photos into a clean single A4 or Letter PDF, reorder slides by drag-and-drop and set page margins locally.',
    'related' => ['merge-pdf', 'image-compressor', 'split-pdf'],
    'answer' => 'To turn photos into a PDF, add the images in the order you want, choose a page size, and create the file. Each image becomes one page, scaled to fit without cropping or stretching. Use <strong>A4</strong> or <strong>US Letter</strong> for documents you\'ll print or submit, and "Same as image" for photo albums.',
    'article' => <<<'EOT_TF'
<h2>How to convert JPG to PDF</h2>
<ol>
<li><strong>Add your images.</strong> Photos from your phone, scans, screenshots: JPG, PNG and WebP all work.</li>
<li><strong>Put them in order.</strong> Use the arrows. Page 1 is at the top.</li>
<li><strong>Pick the page settings.</strong> Page size, orientation and margin.</li>
<li><strong>Create the PDF.</strong> It downloads straight away.</li>
</ol>

<h2>Choosing the page settings</h2>
<ul>
<li><strong>A4</strong> (210 × 297 mm) is the standard paper size almost everywhere outside North America. Use it for documents you'll print or upload to official forms.</li>
<li><strong>US Letter</strong> (8.5 × 11 inches) is standard in the United States and Canada.</li>
<li><strong>Same as image</strong> makes each page exactly the size of its photo, with no white borders. It's best for photo collections and presentations.</li>
<li><strong>Automatic orientation</strong> turns the page sideways for landscape photos, so wide images aren't shrunk to fit a tall page.</li>
<li><strong>Margins</strong> add white space around each image. "Small" looks tidy when printed; "None" fills the page.</li>
</ul>

<h2>Making a small PDF</h2>
<p>Phone photos are often 3–5 MB each, so a 10-page PDF can easily reach 40 MB, which is too big for many email services and upload forms. Run the photos through the Image Compressor first (70% quality and 1600 px wide is plenty for documents), then convert. The PDF will usually be a tenth of the size and still perfectly readable.</p>

<h2>Scanning documents with your phone</h2>
<ul>
<li>Place the page on a dark, flat surface in good daylight, and avoid using the flash.</li>
<li>Hold the phone directly above the page so the edges are straight.</li>
<li>Crop away the background in your photo app before adding the image here.</li>
<li>For multi-page documents, take the photos in order so they're already sorted.</li>
</ul>

<h2>Private and free</h2>
<p>The PDF is built in your browser. Your photos are never uploaded, there's no watermark, and there's no limit on the number of pages.</p>

<h2>Choosing Fit-to-Page vs Original Photo Dimensions</h2>
<p>Pick standard A4 or US Letter margins when turning receipt snaps and ID copies into printable paperwork, or choose "match image size" when bundling digital design mockups so tall screenshots never gain awkward blank sidebars.</p>
EOT_TF,
    'faqs' => [
        ['How do I convert multiple JPGs into one PDF?', 'Add all the images, arrange them with the arrows, and press Create PDF. Every image becomes a page in a single PDF file.'],
        ['Will the images be cropped?', 'No. Each image is scaled to fit inside the page margins while keeping its proportions, so nothing is cut off or stretched.'],
        ['How do I make the PDF smaller?', 'Compress the photos first with the Image Compressor at about 70% quality and 1600 px wide, then create the PDF.'],
        ['Can I convert PNG or screenshots to PDF?', 'Yes. PNG, JPG, WebP and most other image formats your browser can open are supported.'],
        ['Are my photos uploaded?', 'No. The PDF is created on your device. Your photos never leave it.'],
    ],
];
