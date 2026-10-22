<?php
// Add Page Numbers to PDF: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Add Page Numbers to PDF',
  'category' => 'pdf',
  'order' => 9,
  'icon' => 'list-ordered',
  'files' => true,
  'libs' => [
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js',
  ],
  'keywords' => 'number pdf pages pagination insert page numbers pdf',
  'short' => 'Number PDF pages: position, format like "Page 1 of 10", skip the cover.',
  'title' => 'Add Page Numbers to PDF: Number Pages Online, Free',
  'description' => <<<'EOT_TF'
Add page numbers to any PDF. Choose the position, format (1, Page 1, Page 1 of 10), starting number and font size, and skip the cover page. Private and free.
EOT_TF,
  'related' => ['watermark-pdf', 'organize-pdf', 'merge-pdf'],
  'answer' => <<<'EOT_TF'
Open your PDF, pick where the numbers go (bottom centre is the most common), choose a format like <strong>"Page 1 of 10"</strong>, and download. You can start from any number and leave the cover page unnumbered. A live preview shows exactly how the numbers will look before you save.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>Why number your pages?</h2>
<p>Page numbers make long documents easy to navigate, refer to and print. Many universities, courts, tenders and publishers require them, and they're essential when a PDF will be printed and could get shuffled. They also help when you merge several files into one pack and need a single, continuous numbering.</p>

<h2>Options explained</h2>
<ul>
<li><strong>Position:</strong> bottom centre is the convention for reports and books; bottom right suits business documents; top positions are common in legal documents and manuscripts.</li>
<li><strong>Format:</strong> plain numbers, "Page 1", "Page 1 of 10", "1 / 10" or "- 1 -". The "of" formats count the pages being numbered.</li>
<li><strong>Start at:</strong> begin at any number, for example 5 if this PDF is a chapter that follows four other pages.</li>
<li><strong>Skip the cover:</strong> leaves the first page clean and starts numbering on page two.</li>
<li><strong>Font size:</strong> 10–12 points is standard and readable without being distracting.</li>
</ul>

<h2>How it works</h2>
<p>The numbers are added as real text in a standard font (Helvetica) on top of each page. Nothing else on the page changes: existing text stays selectable, images keep their quality, and the file grows by only a few kilobytes. Numbers sit about 1 cm from the edge, inside the area most printers can print.</p>

<h2>Tips</h2>
<ul>
<li><strong>Merge first, number last.</strong> Combine documents with Merge PDF, put pages in order with Organize PDF, then add numbers so they run continuously.</li>
<li><strong>Check existing footers.</strong> If your document already has a footer, choose a top position to avoid overlap.</li>
<li><strong>Landscape pages</strong> are handled automatically: numbers are placed relative to each page's own size.</li>
</ul>

<h2>Private by design</h2>
<p>Your PDF is edited in your browser and never uploaded. There's no watermark and no page limit.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I add page numbers to a PDF?',
      'Open the PDF, choose the position and format, check the preview, and download the numbered PDF.',
    ],
    [
      'Can I start numbering from page 2?',
      'Yes. Tick “Don’t number the first page”. The second page gets the starting number.',
    ],
    [
      'Can I use the format “Page 1 of 10”?',
      'Yes. Choose it in the Format menu; the total is calculated automatically.',
    ],
    [
      'Will page numbers cover my content?',
      'They sit about 1 cm from the edge. If your document has a footer there, choose a top position.',
    ],
    ['Is my document uploaded?', 'No. Numbers are added in your browser.'],
  ],
];
