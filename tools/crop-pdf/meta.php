<?php
// Crop PDF: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Crop PDF',
  'category' => 'pdf',
  'order' => 16,
  'files' => true,
  'libs' => ['https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js'],
  'icon' => 'crop',
  'keywords' => 'crop pdf online free trim pdf margins cut pdf page remove white margins crop pdf pages resize pdf page',
  'aka' => ['trim PDF', 'cut PDF pages', 'remove PDF margins'], // other names people search for
  'short' => 'Trim the margins of PDF pages: drag a box, type margins or remove white borders automatically.',
  'title' => 'Crop PDF Online Free: Trim Margins & Cut PDF Pages',
  'description' => <<<'EOT_TF'
Crop PDF pages online: drag a box or remove white margins automatically, for every page or just one. Free, no sign-up, and your PDF never leaves your device.
EOT_TF,
  'related' => ['edit-pdf', 'rotate-pdf', 'organize-pdf'],
  'answer' => <<<'EOT_TF'
To crop a PDF, open it and <strong>drag the edges of the box</strong> over the page to the area you want to keep, or press <strong>Remove white margins</strong> to trim empty borders automatically. Choose whether to crop every page, only this page, or each page to its own content, then download. It's free and the file never leaves your device.
EOT_TF,
  'article' => <<<'EOT_TF'
<h2>How to crop a PDF</h2>
<ol>
<li>Drop your PDF in the box, or try the sample. The first page appears with a crop box around it.</li>
<li>Drag the box's edges or corners to the area you want to keep, drag inside it to move it, or type the margins in millimetres.</li>
<li>Choose <strong>All pages</strong>, <strong>This page only</strong> or <strong>Each page to its content</strong>, then press <strong>Crop PDF</strong> and check the preview before you download.</li>
</ol>

<h2>Remove white margins automatically</h2>
<p>Scans, slides exported to PDF and e-books often have wide empty borders that waste screen space on a phone or tablet. <strong>Remove white margins</strong> finds where the content starts and ends on the page and sets the box for you, with a small gap so nothing touches the edge. With <strong>Each page to its content</strong>, every page is trimmed to its own content, which suits documents whose pages have different layouts.</p>

<h2>What cropping changes</h2>
<p>Cropping sets the visible area of each page (the crop box, and the page size used for printing). Every PDF reader, printer and editor shows only the area you kept. The content outside the box is hidden, not deleted, so you can't use cropping to remove private information: use <a href="/redact-pdf">Redact PDF</a> for that.</p>
<p>Text stays selectable and searchable and images keep their quality, because nothing is turned into a picture. Links, bookmarks and form fields stay where they were.</p>

<h2>Good uses for cropping</h2>
<ul>
<li>Make an e-book or paper easier to read on a phone by trimming wide margins.</li>
<li>Cut a scanned receipt, ID card or certificate out of a full A4 scan.</li>
<li>Keep one figure or table from a page to send on its own.</li>
<li>Remove printer marks and bleed from a print-ready PDF.</li>
</ul>
EOT_TF,
  'faqs' => [
    [
      'How do I crop a PDF for free?',
      <<<'EOT_TF'
Open the PDF here, drag the crop box to the area you want, choose which pages to crop and press Crop PDF. It is free, without sign-up or watermark.
EOT_TF,
    ],
    [
      'Can I crop just one page of a PDF?',
      <<<'EOT_TF'
Yes. Choose This page only. The other pages stay exactly as they were.
EOT_TF,
    ],
    [
      'How do I remove white margins from a PDF?',
      <<<'EOT_TF'
Press Remove white margins. The tool finds the content on the page and trims the empty border around it. Choose Each page to its content to trim every page separately.
EOT_TF,
    ],
    [
      'Does cropping delete the hidden part?',
      <<<'EOT_TF'
No. Cropping hides the area outside the box in every reader and when printing, but the content is still inside the file. To remove information for good, use Redact PDF.
EOT_TF,
    ],
    [
      'Is my PDF uploaded?',
      <<<'EOT_TF'
No. The PDF is cropped in your browser and never leaves your device.
EOT_TF,
    ],
  ],
];
