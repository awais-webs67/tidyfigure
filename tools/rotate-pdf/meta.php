<?php
// Rotate PDF: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Rotate PDF',
  'category' => 'pdf',
  'order' => 4,
  'icon' => 'rotate-cw',
  'files' => true,
  'libs' => [
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js',
  ],
  'scripts' => ['pdf-pages.js'],
  'keywords' => 'rotate pdf pages turn pdf sideways fix upside down scan',
  'short' => 'Turn sideways or upside-down PDF pages, one page or all at once.',
  'title' => 'Rotate PDF: Turn PDF Pages and Save Permanently, Free',
  'description' => <<<'EOT_TF'
Rotate PDF pages 90°, 180° or 270° and save the result permanently. Rotate a single page or the whole document. Works in your browser, no upload needed.
EOT_TF,
  'related' => ['organize-pdf', 'delete-pdf-pages', 'merge-pdf'],
  'answer' => <<<'EOT_TF'
To rotate a PDF, open it, turn the pages that are sideways or upside down, and save. You can rotate <strong>every page at once</strong> or <strong>just one page</strong> by clicking ⟲ or ⟳ under it. The rotation is saved in the file itself, so it opens the right way up in every PDF reader, on every device.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>Why PDF pages end up sideways</h2>
<p>Scanners and phone apps often save landscape pages, receipts and ID cards at the wrong angle. Rotating the view in your PDF reader only fixes it on your screen, temporarily. The next person who opens the file, or the website you upload it to, still sees it sideways. This tool changes the rotation stored in the PDF, so the fix is permanent.</p>

<h2>How to rotate PDF pages</h2>
<ol>
<li><strong>Open your PDF.</strong> Thumbnails of every page appear.</li>
<li><strong>Rotate.</strong> Use "Rotate all" for the whole document, or the ⟲ (left) and ⟳ (right) buttons under a single page.</li>
<li><strong>Save.</strong> The rotated PDF downloads straight away.</li>
</ol>

<h2>Lossless rotation</h2>
<p>PDF pages have a built-in rotation setting of 0°, 90°, 180° or 270°. This tool changes only that setting; it doesn't redraw or re-compress anything. Text stays sharp and selectable, links keep working, and the file size stays almost exactly the same.</p>

<h2>Rotating mixed documents</h2>
<p>A report might mix portrait text pages with landscape charts and tables. Rotate only the pages that need it: each page keeps its own orientation. If some pages are upside down (common when scanning double-sided paper), click ⟳ twice to turn them 180°.</p>

<h2>Private and free</h2>
<p>Your PDF is processed entirely in your browser using two open-source libraries: one draws the page previews and the other saves the changes. The file never leaves your device, there's no watermark, and there's no limit on pages or files.</p>

<h2>Related tasks</h2>
<ul>
<li>Need to remove or reorder pages as well? Use <strong>Organize PDF</strong>, which can rotate, delete and reorder in one go.</li>
<li>Combining several scans into one document? Rotate them, then use <strong>Merge PDF</strong>.</li>
</ul>
EOT_TF,
  'faqs' => [
    [
      'How do I rotate a PDF and save it?',
      <<<'EOT_TF'
Open the PDF, rotate the pages with the buttons, and press Save. The downloaded file keeps the new rotation permanently.
EOT_TF,
    ],
    [
      'Can I rotate just one page of a PDF?',
      'Yes. Use the ⟲ or ⟳ buttons under that page. Other pages stay as they are.',
    ],
    [
      'Does rotating a PDF reduce quality?',
      <<<'EOT_TF'
No. Only the page’s rotation setting changes. Nothing is re-compressed, so quality and file size stay the same.
EOT_TF,
    ],
    ['How do I fix an upside-down scan?', 'Rotate the page twice (180°) and save.'],
    [
      'Is my PDF uploaded?',
      'No. Rotation happens in your browser and the file never leaves your device.',
    ],
  ],
];
