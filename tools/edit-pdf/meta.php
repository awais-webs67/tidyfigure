<?php
// PDF editor: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Edit PDF',
  'category' => 'pdf',
  'order' => 1,
  'icon' => 'file-pen-line',
  'popular' => true,
  'files' => true,
  'libs' => [
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js',
    'https://cdn.jsdelivr.net/npm/@pdf-lib/fontkit@1.1.1/dist/fontkit.umd.min.js',
  ],
  'appCategory' => 'BusinessApplication',
  'keywords' => 'edit pdf online free pdf editor add text to pdf edit text in pdf write on pdf whiteout pdf annotate pdf highlight pdf draw on pdf add image to pdf sign pdf fill pdf',
  'short' => 'Edit PDFs online: change existing text, add text, images, signatures, shapes, highlights and drawings.',
  'title' => 'Edit PDF Online Free: PDF Editor to Change Text, Sign & Annotate',
  'description' => 'Free online PDF editor. Change existing text, add text, images and signatures, highlight, draw, white out and add shapes. No sign-up, no watermark, and your PDF is never uploaded.',
  'related' => ['sign-pdf', 'merge-pdf', 'compress-pdf'],
  'answer' => <<<'EOT_TF'
To edit a PDF, open it in the editor and pick a tool: <strong>Edit text</strong> to change words already in the PDF, <strong>Text</strong> to type anywhere, plus Sign, Image, Draw, Highlight, Whiteout, shapes, ticks and dates. Move and resize anything, then press <strong>Preview &amp; download</strong> to check the finished PDF. It's free with no watermark, and the file never leaves your device.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>How to edit a PDF online</h2>
<ol>
<li>Drop your PDF in the box, or try the sample. The pages open in the editor, with thumbnails on the left to jump between pages.</li>
<li>Choose a tool from the toolbar and click or drag on the page.</li>
<li>Use <strong>Select</strong> to move anything you added, drag a corner to resize it, and change its colour, size or font in the style bar.</li>
<li>Press <strong>Preview &amp; download</strong>. You see every page of the finished PDF before you download it.</li>
</ol>

<h2>Change text that's already in the PDF</h2>
<p>Choose <strong>Edit text</strong> and click a line of text. The editor covers the old line with the page's own background colour and puts the same words in an editable box, in a matching font, size and colour. Change what you need and click away. This is the quickest way to fix a typo, update a date or price, or correct a name in a PDF when you don't have the original Word file.</p>
<p>PDFs don't store text like a word processor: each line is placed at a fixed position, and fonts often contain only the letters already used. That's why the editor replaces the line rather than editing it in place, the same method used by paid PDF editors. If the new text is longer, it continues to the right, so shorten it or reduce the size to keep the layout tidy.</p>

<h2>Everything you can add</h2>
<ul>
<li><strong>Text:</strong> four fonts (sans, serif, mono and handwriting), any size and colour, bold, and several lines.</li>
<li><strong>Signature:</strong> draw it, type your name in handwriting style, or upload a photo of your signature; the white paper is removed automatically.</li>
<li><strong>Images:</strong> logos, stamps, photos or a scanned stamp. You can also paste an image with Ctrl+V.</li>
<li><strong>Highlight</strong> text in yellow or any colour, and <strong>draw</strong> freehand notes.</li>
<li><strong>Whiteout</strong> to cover up anything, such as old details or a phone number.</li>
<li><strong>Boxes, circles, lines and arrows</strong> to point things out.</li>
<li><strong>Ticks, crosses and today's date</strong> for forms and checklists.</li>
</ul>

<h2>Keyboard shortcuts</h2>
<p>Ctrl+Z undoes and Ctrl+Y redoes. Delete removes the selected item, Ctrl+D duplicates it and the arrow keys nudge it (hold Shift to move faster). Letters choose tools: V select, T text, E edit text, D draw, H highlight, W whiteout, R box, O circle, L line and A arrow. Hold Ctrl and scroll to zoom.</p>

<h2>Private, free and with no watermark</h2>
<p>Many online PDF editors upload your file to their servers, add a watermark or limit you to a few edits a day unless you pay. This editor runs entirely in your browser: your PDF is never uploaded, there's no account, no watermark and no limit. That makes it safe for contracts, bank forms, certificates and ID documents.</p>
<p>A note on whiteout: it covers content visually, but the original text can still be inside the file and found by copying or searching. For truly confidential information, remove those pages with <a href="/delete-pdf-pages">Delete PDF Pages</a> or recreate the document.</p>

<h2>More PDF tools</h2>
<p>To put pages in order use <a href="/organize-pdf">Organize PDF</a>, to combine files use <a href="/merge-pdf">Merge PDF</a>, and to make the edited PDF smaller use <a href="/compress-pdf">Compress PDF</a>. A password-protected PDF must be unlocked with <a href="/unlock-pdf">Unlock PDF</a> before you can edit it.</p>
EOT_TF,
  'faqs' => [
    ['How can I edit a PDF for free?', 'Open it in this editor, use the toolbar to change or add text, images, signatures and shapes, then press Preview & download. It is free with no sign-up or watermark.'],
    ['Can I change existing text in a PDF?', 'Yes. Choose Edit text and click a line. The old words are covered and replaced with an editable copy in a matching font, size and colour.'],
    ['Is my PDF uploaded?', 'No. The editor runs in your browser and the PDF never leaves your device.'],
    ['Can I sign a PDF with this editor?', 'Yes. Press Sign, then draw, type or upload your signature and drag it into place.'],
    ['Does it work on a phone?', 'Yes. The editor works on phones and tablets: tap a tool, then tap or drag on the page.'],
    ['Why can’t I open my PDF?', 'Password-protected PDFs need to be unlocked first with Unlock PDF. Damaged files may not open at all.'],
  ],
];
