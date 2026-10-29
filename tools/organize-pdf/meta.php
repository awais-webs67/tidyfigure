<?php
// Organize PDF: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Organize PDF',
  'updated' => '2026-10-22', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'pdf',
  'order' => 6,
  'icon' => 'layout-grid',
  'files' => true,
  'libs' => [
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js',
  ],
  'scripts' => ['pdf-pages.js'],
  'keywords' => 'reorder pdf pages rearrange pdf sort pages move pages',
  'short' => 'Reorder, rotate and remove PDF pages with drag and drop.',
  'title' => 'Organize PDF: Reorder, Rotate & Delete PDF Pages Free',
  'description' => <<<'EOT_TF'
Rearrange PDF pages with drag and drop, rotate sideways pages and remove the ones you don’t need, all in one step. Free, private, works on phone and desktop.
EOT_TF,
  'related' => ['delete-pdf-pages', 'rotate-pdf', 'merge-pdf'],
  'answer' => <<<'EOT_TF'
To rearrange a PDF, open it and <strong>drag the page thumbnails</strong> into the order you want (or use the ← → arrows on a phone). You can also rotate and remove pages in the same view. When it looks right, save: the new PDF downloads with every page exactly as you arranged it.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>Everything in one view</h2>
<p>Organize PDF shows every page as a thumbnail with four controls:</p>
<ul>
<li><strong>← and →</strong> move a page one place earlier or later. On a computer you can also drag a page onto another position.</li>
<li><strong>⟲ and ⟳</strong> rotate the page left or right by 90°.</li>
<li><strong>✕</strong> removes the page (tap ↺ to bring it back).</li>
</ul>
<p>The summary shows how many pages the new PDF will have and what changed, so you can check before saving.</p>

<h2>When to organize a PDF</h2>
<ul>
<li><strong>Scans in the wrong order:</strong> feeding pages into a scanner the wrong way round is common, especially for double-sided documents.</li>
<li><strong>After merging:</strong> combine several files with Merge PDF, then put the pages in a sensible order here.</li>
<li><strong>Putting a cover or signature page first.</strong></li>
<li><strong>Building a submission pack:</strong> application forms often ask for documents in a fixed order.</li>
<li><strong>Tidying presentations</strong> exported as PDF.</li>
</ul>

<h2>Lossless editing</h2>
<p>Pages are moved, rotated and removed without being redrawn. Text remains selectable and searchable, images keep their original resolution, and links inside the pages keep working. Bookmarks from the original may not carry across, because they point to page positions that have changed.</p>

<h2>Tips for long documents</h2>
<ul>
<li>Work from the end: moving later pages first keeps earlier page numbers stable while you work.</li>
<li>Use "Reset order" if you get lost; it restores the original order, rotation and pages.</li>
<li>For very long PDFs, it can be quicker to split out the section you need with Split PDF first.</li>
</ul>

<h2>Private and free</h2>
<p>All editing happens in your browser, so your documents are never uploaded. There's no watermark, account or page limit.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I rearrange pages in a PDF?',
      <<<'EOT_TF'
Open the PDF, then drag thumbnails into the new order or use the ← and → arrows under each page. Press Save to download the reordered PDF.
EOT_TF,
    ],
    [
      'Can I reorder PDF pages on my phone?',
      'Yes. Use the arrow buttons under each page to move it earlier or later.',
    ],
    [
      'Can I rotate and delete pages at the same time?',
      'Yes. Organize PDF lets you reorder, rotate and remove pages, then save everything in one step.',
    ],
    ['Will the quality change?', 'No. Pages are copied without re-compression.'],
    ['Is it safe for confidential documents?', 'Yes. The PDF never leaves your browser.'],
  ],
];
