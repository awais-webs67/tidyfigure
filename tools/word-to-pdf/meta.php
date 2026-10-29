<?php
// Word to PDF: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Word to PDF',
  'category' => 'pdf',
  'order' => 25,
  'popular' => true,
  'files' => true,
  'libs' => ['https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js', 'https://cdn.jsdelivr.net/npm/docx-preview@0.3.2/dist/docx-preview.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js', 'vendor/fontkit-1.1.1.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'],
  'scripts' => ['dom-pdf.js'],
  'icon' => 'file-type',
  'keywords' => 'word to pdf converter online free convert docx to pdf doc to pdf save word document as pdf without word microsoft word to pdf',
  'aka' => ['DOCX to PDF', 'convert Word to PDF', 'DOC to PDF'], // other names people search for
  'short' => 'Convert Word documents (.docx) to PDF with fonts, colours, tables, lists and pictures, and selectable text.',
  'title' => 'Word to PDF Converter Online Free (DOCX to PDF)',
  'description' => <<<'EOT_TF'
Convert Word to PDF online: .docx files become PDFs with their fonts, colours, tables, lists, pictures and selectable text. Free, no sign-up, nothing uploaded.
EOT_TF,
  'related' => ['pdf-to-word', 'compress-pdf', 'merge-pdf'],
  'answer' => <<<'EOT_TF'
Drop a Word document (<strong>.docx</strong>) and press <strong>Convert to PDF</strong>. Its text, fonts, colours, tables, lists, pictures, headers and footers are laid out on PDF pages of the same size, and the text stays <strong>selectable and searchable</strong>. You don't need Microsoft Word, and the file never leaves your device.
EOT_TF,
  'article' => <<<'EOT_TF'
<h2>How to convert Word to PDF</h2>
<ol>
<li>Drop your .docx file in the box, or try the sample document.</li>
<li>Press <strong>Convert to PDF</strong> and wait a few seconds while the pages are laid out.</li>
<li>Check the page previews, then download the PDF.</li>
</ol>

<h2>What's kept</h2>
<ul>
<li><strong>Page size and margins</strong> from the document's own settings (A4, Letter or anything else).</li>
<li><strong>Text formatting:</strong> fonts, sizes, bold, italic, underline, colours and highlighting.</li>
<li><strong>Paragraphs:</strong> alignment, indents, spacing, bullets and numbered lists.</li>
<li><strong>Tables</strong> with their borders and shading, <strong>pictures</strong>, and <strong>headers and footers</strong> on every page.</li>
<li><strong>Page breaks</strong> you added in Word.</li>
</ul>
<p>The text in the PDF is real text: you can select, copy and search it, and it stays sharp at any zoom.</p>

<h2>About fonts</h2>
<p>Word documents usually use fonts that are installed with Microsoft Office, such as Calibri, Cambria, Arial and Times New Roman, and those fonts can't be shared on a website. The converter uses free fonts designed with exactly the same letter widths (Carlito for Calibri, Caladea for Cambria, Arimo for Arial, Tinos for Times New Roman, Cousine for Courier New), so lines break in the same places and the pages look almost the same. Other fonts are replaced by the closest of these.</p>

<h2>Limits</h2>
<p>Only the modern .docx format is supported. To convert an old .doc file, open it in Word, Google Docs or LibreOffice and save it as .docx first. Text boxes placed freely on the page, WordArt, charts and equations may look different or be left out, and page numbers in footers aren't filled in.</p>

<h2>Private and free</h2>
<p>Most Word to PDF converters upload your document to a server. This one lays the pages out in your browser, so the document never leaves your device, with no sign-up, limit or watermark. To go the other way, use <a href="/pdf-to-word">PDF to Word</a>.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I convert Word to PDF for free?',
      <<<'EOT_TF'
Drop the .docx file here and press Convert to PDF, then download the PDF. It is free with no sign-up, and you don’t need Microsoft Word.
EOT_TF,
    ],
    [
      'Will my document look the same?',
      <<<'EOT_TF'
Very close. Page size, margins, formatting, tables, lists, pictures, headers and footers are kept, and Office fonts are replaced by free fonts with the same letter widths, so lines break in the same places.
EOT_TF,
    ],
    [
      'Can I convert an old .doc file?',
      <<<'EOT_TF'
Not directly. Open it in Word, Google Docs or LibreOffice and save it as .docx, then convert that.
EOT_TF,
    ],
    [
      'Is the text in the PDF selectable?',
      <<<'EOT_TF'
Yes. The PDF contains real text that you can select, copy and search.
EOT_TF,
    ],
    [
      'Is my document uploaded?',
      <<<'EOT_TF'
No. The document is converted in your browser and never leaves your device.
EOT_TF,
    ],
  ],
];
