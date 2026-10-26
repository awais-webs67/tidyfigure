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
    'vendor/fontkit-1.1.1.min.js',
  ],
  'scripts' => ['pdf-engine.js'],
  'appCategory' => 'BusinessApplication',
  'keywords' => 'edit pdf online free pdf editor add text to pdf edit text in pdf write on pdf whiteout pdf annotate pdf highlight pdf draw on pdf add image to pdf sign pdf fill pdf',
  'short' => 'Edit PDFs online: change existing text, add text, images, signatures, shapes, highlights and drawings.',
  'title' => 'Edit PDF Online Free: Change Text, Sign & Annotate',
  'description' => 'Free online PDF editor: change existing text, add text, images and signatures, highlight, draw and white out. No sign-up or watermark; your PDF stays private.',
  'related' => ['sign-pdf', 'merge-pdf', 'compress-pdf'],
  'answer' => <<<'EOT_TF'
To edit a PDF, open it and choose <strong>Edit text</strong>, then click any line and type. The text is rewritten in the PDF's <strong>own font, size and colour</strong>, not pasted on top. <strong>Delete</strong> truly removes text, images and shapes, and you can add text, signatures, images and drawings. Press <strong>Preview &amp; download</strong> to check the finished PDF. It's free, with no watermark, and the file never leaves your device.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>How to edit a PDF online</h2>
<ol>
<li>Drop your PDF in the box, or try the sample. The pages open in the editor, with thumbnails on the left to jump between pages.</li>
<li>Choose a tool from the toolbar and click or drag on the page.</li>
<li>Use <strong>Select</strong> to move anything you added, drag a corner to resize it, and change its colour, size or font in the style bar.</li>
<li>Press <strong>Preview &amp; download</strong>. You see every page of the finished PDF before you download it.</li>
</ol>

<h2>Change text that's already in the PDF, in the same style</h2>
<p>Choose <strong>Edit text</strong>. Every line of text gets a faint outline; click one and type. When you press Enter or click away, the editor removes the old words from the PDF and writes yours in their place using the <strong>font embedded in the PDF</strong>, at the same size, colour and position. Bold and italic words stay bold and italic, so changing a name inside a sentence keeps the rest of the sentence exactly as it was.</p>
<p>PDFs usually contain only the letters they use. If you type a letter the original font doesn't include, that letter is written in the closest standard font (for example Helvetica for Arial, Times for Times New Roman), and the editor tells you which letters were affected. Press Escape to cancel an edit and get the original line back exactly.</p>

<h2>Delete text, images and whole sections</h2>
<p>Choose <strong>Delete</strong> and click a line of text, a picture, a logo or a shape to remove it. To remove a whole section, drag a box over it: everything inside is deleted, letter by letter, so text around the box stays in place. This really removes the content from the file; it doesn't just hide it under a white box, so deleted text can't be copied or searched afterwards. Ctrl+Z brings anything back.</p>

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
<p>Ctrl+Z undoes and Ctrl+Y redoes, including text edits and deletions. Delete removes the selected item, Ctrl+D duplicates it and the arrow keys nudge it (hold Shift to move faster). Letters choose tools: V select, T text, E edit text, X delete, D draw, H highlight, W whiteout, R box, O circle, L line and A arrow. Hold Ctrl and scroll to zoom.</p>

<h2>Private, free and with no watermark</h2>
<p>Many online PDF editors upload your file to their servers, add a watermark or limit you to a few edits a day unless you pay. This editor runs entirely in your browser: your PDF is never uploaded, there's no account, no watermark and no limit. That makes it safe for contracts, bank forms, certificates and ID documents.</p>
<p>A note on whiteout: it only covers content, and the original text stays inside the file. To remove information for good, use <strong>Delete</strong> instead, which takes it out of the PDF itself.</p>

<h2>More PDF tools</h2>
<p>To put pages in order use <a href="/organize-pdf">Organize PDF</a>, to combine files use <a href="/merge-pdf">Merge PDF</a>, and to make the edited PDF smaller use <a href="/compress-pdf">Compress PDF</a>. A password-protected PDF must be unlocked with <a href="/unlock-pdf">Unlock PDF</a> before you can edit it.</p>
EOT_TF,
  'faqs' => [
    ['How can I edit a PDF for free?', 'Open it in this editor, use the toolbar to change or add text, images, signatures and shapes, then press Preview & download. It is free with no sign-up or watermark.'],
    ['Can I change existing text in a PDF in the same font?', 'Yes. Choose Edit text, click a line and type. The old text is removed and your text is written in the PDF’s own embedded font, size and colour. Letters the font doesn’t include use the closest standard font.'],
    ['Can I delete text or a section from a PDF?', 'Yes. Choose Delete and click a line, image or shape, or drag a box over a section. The content is removed from the file, not just covered.'],
    ['Is my PDF uploaded?', 'No. The editor runs in your browser and the PDF never leaves your device.'],
    ['Can I sign a PDF with this editor?', 'Yes. Press Sign, then draw, type or upload your signature and drag it into place.'],
    ['Does it work on a phone?', 'Yes. The editor works on phones and tablets: tap a tool, then tap or drag on the page.'],
    ['Why can’t I open my PDF?', 'Password-protected PDFs need to be unlocked first with Unlock PDF. Damaged files may not open at all.'],
  ],
];
