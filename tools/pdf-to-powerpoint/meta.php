<?php
// PDF to PowerPoint: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'PDF to PowerPoint',
  'category' => 'pdf',
  'order' => 24,
  'files' => true,
  'libs' => ['https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js', 'https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js'],
  'scripts' => ['pdf-read.js'],
  'icon' => 'presentation',
  'keywords' => 'pdf to powerpoint converter online free convert pdf to pptx pdf to ppt editable slides pdf presentation to powerpoint google slides',
  'aka' => ['PDF to PPTX', 'PDF to PPT', 'PDF to slides'], // other names people search for
  'short' => 'Turn a PDF into a PowerPoint presentation (.pptx) with editable text boxes on every slide.',
  'title' => 'PDF to PowerPoint Converter Online Free (PDF to PPTX)',
  'description' => <<<'EOT_TF'
Convert PDF to PowerPoint online: every page becomes a slide with editable text boxes in the same fonts, sizes and colours. Free, no sign-up, nothing uploaded.
EOT_TF,
  'related' => ['pdf-to-word', 'pdf-to-jpg', 'pdf-to-excel'],
  'answer' => <<<'EOT_TF'
Drop a PDF and press <strong>Convert to PowerPoint</strong>. Each page becomes a slide: the background, pictures and shapes stay exactly as they were, and every line of text becomes an <strong>editable text box</strong> in the same font, size and colour. Open the .pptx in PowerPoint, Keynote or Google Slides.
EOT_TF,
  'article' => <<<'EOT_TF'
<h2>How to convert a PDF to PowerPoint</h2>
<ol>
<li>Drop your PDF in the box, or try the sample.</li>
<li>Keep <strong>Editable text</strong> selected, or choose <strong>Exact look</strong> for slides that are pictures of the pages.</li>
<li>Press <strong>Convert to PowerPoint</strong>, check the slide previews and download the .pptx file.</li>
</ol>

<h2>How the slides are built</h2>
<p>With <strong>Editable text</strong>, each slide has two layers. Underneath is the page drawn without its text: backgrounds, photos, charts, logos and shapes look exactly as they did in the PDF. On top, every line of text is a separate PowerPoint text box, placed where it was, in the same font, size, bold or italic style and colour. You can change the wording, fix a typo or translate a slide without rebuilding it.</p>
<p><strong>Exact look</strong> turns each page into a full-slide picture. Nothing is editable, but it's perfect for presenting a PDF, such as a report or a handout, from PowerPoint or Google Slides.</p>

<h2>Tips</h2>
<ul>
<li>PDFs exported from PowerPoint, Keynote or Canva convert best, because each page is already a slide.</li>
<li>Slides are the same shape as the PDF's pages, so A4 documents become portrait slides.</li>
<li>If a font isn't installed on your computer, PowerPoint shows a similar one. Select the text and pick another font to change it.</li>
<li>Scanned PDFs have no text to edit, so their pages come across as pictures.</li>
</ul>

<h2>Private and free</h2>
<p>The PDF is converted in your browser and never uploaded, so confidential decks stay on your device. There's no sign-up, limit or watermark.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I convert a PDF to PowerPoint for free?',
      <<<'EOT_TF'
Drop the PDF here and press Convert to PowerPoint, then download the .pptx file. It is free with no sign-up or watermark.
EOT_TF,
    ],
    [
      'Is the text editable in PowerPoint?',
      <<<'EOT_TF'
Yes. With Editable text, every line is a PowerPoint text box in the same font, size and colour, on top of the page’s pictures and shapes.
EOT_TF,
    ],
    [
      'Does it work with Google Slides and Keynote?',
      <<<'EOT_TF'
Yes. Upload or open the .pptx file in Google Slides, Keynote or LibreOffice Impress.
EOT_TF,
    ],
    [
      'Is my PDF uploaded?',
      <<<'EOT_TF'
No. The PDF is converted in your browser and never leaves your device.
EOT_TF,
    ],
  ],
];
