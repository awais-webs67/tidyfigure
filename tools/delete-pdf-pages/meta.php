<?php
// Delete PDF Pages: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Delete PDF Pages',
  'updated' => '2026-10-22', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'pdf',
  'order' => 5,
  'icon' => 'file-minus',
  'files' => true,
  'libs' => [
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js',
  ],
  'scripts' => ['pdf-pages.js'],
  'keywords' => 'remove pages from pdf delete page pdf blank page',
  'short' => 'Remove unwanted or blank pages from a PDF by tapping them.',
  'title' => 'Delete PDF Pages: Remove Pages From a PDF Online, Free',
  'description' => <<<'EOT_TF'
Remove pages from a PDF in seconds. See every page as a thumbnail, tap the ones to delete, and save a new PDF. Private: works in your browser, no upload.
EOT_TF,
  'related' => ['organize-pdf', 'split-pdf', 'rotate-pdf'],
  'answer' => <<<'EOT_TF'
To delete pages from a PDF, open it, <strong>tap each page you want to remove</strong>, and save. Removed pages are greyed out so you can see the result before saving, and tapping a page again brings it back. The remaining pages keep their original quality, text and links.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>How to remove pages from a PDF</h2>
<ol>
<li><strong>Open the PDF</strong> by dropping it on the box or choosing it.</li>
<li><strong>Tap the pages to delete.</strong> They fade out and show "Removed". Tap again to keep a page.</li>
<li><strong>Save.</strong> A new PDF without those pages downloads immediately. Your original file isn't changed.</li>
</ol>

<h2>Seeing the pages makes it safer</h2>
<p>Deleting pages by number is easy to get wrong, especially when a document has a cover, contents pages or roman-numeral numbering that doesn't match the PDF's page count. Thumbnails show exactly what you're removing, so you won't accidentally delete the signature page.</p>

<h2>Common reasons to delete pages</h2>
<ul>
<li><strong>Blank pages</strong> from double-sided scanning.</li>
<li><strong>Terms and conditions</strong> or adverts in the middle of a statement you need to send.</li>
<li><strong>Personal pages</strong> you don't want to share, such as a page with your full account details.</li>
<li><strong>Making a file smaller</strong> to fit an email or upload limit.</li>
<li><strong>Duplicates</strong> after merging documents.</li>
</ul>

<h2>What stays the same</h2>
<p>The pages you keep are copied exactly: text stays selectable, images keep their resolution and page sizes don't change. Nothing is re-compressed. The file gets smaller roughly in proportion to the pages removed, especially if those pages contained images.</p>

<h2>Other ways to do it</h2>
<p>If you know the page numbers you want to <em>keep</em>, Split PDF lets you type a range like "1-3, 5". To delete, reorder and rotate at the same time, use Organize PDF.</p>

<h2>Private by design</h2>
<p>The PDF is edited inside your browser and never uploaded, which matters for bank statements, medical letters, contracts and anything else with personal details.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I delete a page from a PDF for free?',
      <<<'EOT_TF'
Open the PDF here, tap the page you want to remove, and press Save. The new PDF downloads without that page.
EOT_TF,
    ],
    ['Can I delete several pages at once?', 'Yes. Tap every page you want to remove, then save once.'],
    [
      'Will deleting pages change the rest of the PDF?',
      'No. The remaining pages are copied exactly, with the same quality, text and links.',
    ],
    [
      'Can I undo a deleted page?',
      'Yes, before saving. Tap the page again to keep it, or press “Keep all pages”.',
    ],
    ['Is my file uploaded to a server?', 'No. Everything happens in your browser.'],
  ],
];
