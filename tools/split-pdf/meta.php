<?php
// Split PDF: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Split PDF',
  'category' => 'pdf',
  'order' => 3,
  'icon' => 'scissors',
  'files' => true,
  'libs' => [
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
  ],
  'keywords' => 'extract pages separate pdf remove pages cut pdf',
  'aka' => ['PDF splitter', 'extract pages from PDF', 'separate PDF pages'], // other names people search for
  'short' => 'Extract pages from a PDF, or split it into single pages or equal parts.',
  'title' => 'Split PDF: Extract Pages or Split a PDF Into Files, Free',
  'description' => <<<'EOT_TF'
Split a PDF into separate files or extract just the pages you need, like 1-3, 5, 8-10. Split every page or every N pages. Private, no upload needed.
EOT_TF,
  'related' => ['merge-pdf', 'jpg-to-pdf', 'image-compressor'],
  'answer' => <<<'EOT_TF'
To take pages out of a PDF, list the pages you want, such as <strong>1-3, 5, 8-10</strong>, and save them as a new file. The original stays untouched. You can also split a document into single pages or into equal parts of any size, which download together as a .zip file.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>Three ways to split a PDF</h2>
<h3>Extract pages</h3>
<p>Type the pages you want to keep, separated by commas. Use a dash for ranges. Pages are saved in the order you type them, so "5, 1-3" puts page 5 first. This is the quickest way to pull a single form out of a long pack, or to remove pages you don't need by listing only the ones you do.</p>
<div class="formula">1-3, 5, 8-10   → pages 1, 2, 3, 5, 8, 9, 10
7-             → page 7 to the end
-4             → pages 1 to 4
5, 1-3         → pages 5, 1, 2, 3 (in that order)</div>
<h3>Every page</h3>
<p>Turns a 20-page PDF into 20 one-page PDFs. Useful when each page is a separate invoice, certificate or payslip.</p>
<h3>Every N pages</h3>
<p>Splits the document into equal parts. A 30-page scan of 10 three-page forms becomes 10 files with "3 pages per file". The last file holds whatever pages are left over.</p>

<h2>What stays the same</h2>
<p>Pages are copied exactly. Text stays sharp and searchable, images keep their resolution, and page sizes and rotation are preserved. Splitting doesn't re-compress anything, so the quality is identical to the original.</p>

<h2>Why the files come in a .zip</h2>
<p>When a split creates several PDFs, they're bundled into one .zip archive so your browser downloads them in one go. Windows, macOS, iOS and Android can all open .zip files: double-click or tap it to see the PDFs inside.</p>

<h2>Private by design</h2>
<p>The PDF is split in your browser using an open-source PDF library. Nothing is uploaded, so it's safe for bank statements, contracts and medical records.</p>

<h2>Related tasks</h2>
<ul>
<li><strong>Reorder pages:</strong> extract them in the new order, for example "3, 1, 2, 4-10".</li>
<li><strong>Combine pages from different PDFs:</strong> extract what you need from each, then use Merge PDF.</li>
<li><strong>Make a PDF smaller:</strong> extract only the pages you need to send. Fewer pages means a smaller file.</li>
</ul>
EOT_TF,
  'faqs' => [
    [
      'How do I extract certain pages from a PDF?',
      <<<'EOT_TF'
Open the PDF, choose “Extract pages”, and type the pages you want, such as 1-3, 5. Press Split PDF to download a new file with just those pages.
EOT_TF,
    ],
    [
      'How do I delete a page from a PDF?',
      'List every page except the one you want to remove. For a 10-page PDF without page 4, type 1-3, 5-10.',
    ],
    [
      'How do I split a PDF into individual pages?',
      'Choose “Every page” and press Split PDF. You get a .zip file containing one PDF per page.',
    ],
    [
      'Does splitting reduce the quality?',
      'No. Pages are copied exactly as they are, with no re-compression.',
    ],
    [
      'Is my PDF uploaded anywhere?',
      'No. Splitting happens in your browser and the file never leaves your device.',
    ],
  ],
];
