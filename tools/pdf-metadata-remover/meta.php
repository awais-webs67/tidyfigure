<?php
// PDF Metadata Remover: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'PDF Metadata Remover',
  'updated' => '2026-10-29', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'pdf',
  'order' => 12,
  'icon' => 'eraser',
  'files' => true,
  'libs' => [
    'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js',
  ],
  'keywords' => 'remove pdf metadata author name edit pdf properties title privacy',
  'short' => 'See and remove hidden PDF properties like author name, software and dates.',
  'title' => 'PDF Metadata Remover: View, Edit & Remove PDF Properties',
  'description' => <<<'EOT_TF'
See the hidden metadata in a PDF (author, title, software, creation dates) and remove it all in one click, or edit it. Private: runs in your browser, free.
EOT_TF,
  'related' => ['image-metadata-remover', 'watermark-pdf', 'compress-pdf'],
  'answer' => <<<'EOT_TF'
Every PDF can carry hidden <strong>metadata</strong>: the author's name, the document title, the software used and when it was created and changed. Open a PDF to see everything it contains, then <strong>remove it all</strong> in one click or edit the fields, for example to set a proper title before publishing.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>What PDF metadata reveals</h2>
<p>Word, Google Docs, scanners and design tools quietly write information into every PDF they create. Anyone can see it in their PDF reader's "Document properties" window:</p>
<ul>
<li><strong>Author:</strong> often your full name or your computer's user account name.</li>
<li><strong>Title and subject:</strong> sometimes an old working title, like "Draft v7 – do not send".</li>
<li><strong>Creator and producer:</strong> the software and version used, such as "Microsoft Word for Microsoft 365".</li>
<li><strong>Created and modified dates:</strong> which can show a document was backdated or edited at the last minute.</li>
<li><strong>XMP metadata:</strong> a second, more detailed block that some apps add, which can include editing history and company names.</li>
</ul>

<h2>When to remove it</h2>
<ul>
<li><strong>Anonymous submissions:</strong> peer review, competitions and anonymous applications require documents with no author information.</li>
<li><strong>Sending files outside your company:</strong> avoid exposing internal names, file paths and software details.</li>
<li><strong>Selling documents or templates</strong> without revealing who made them.</li>
<li><strong>Legal and HR documents,</strong> where creation and edit dates can matter.</li>
</ul>

<h2>When to edit it instead</h2>
<p>For PDFs you publish online, good metadata helps. Search engines can show the PDF's title in results, and browsers show it in the tab instead of the file name. Set a clear title and author, remove the rest, and save.</p>

<h2>What this tool removes</h2>
<p>"Remove all metadata" clears the title, author, subject, keywords, creator, producer, creation date and modification date, and deletes the XMP metadata block. The pages themselves aren't touched, so text, images and links stay exactly the same.</p>
<p>Metadata isn't the only place personal information hides. Check the visible content too: names in headers and footers, comments, tracked changes and hidden layers in the original document.</p>

<h2>Private by design</h2>
<p>Photos have their own hidden data too, including GPS location. Use the Image Metadata Remover for those before sharing.</p>
<p>The whole point is privacy, so the tool runs entirely in your browser. Your PDF is never uploaded.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I remove metadata from a PDF?',
      <<<'EOT_TF'
Open the PDF here and press “Remove all metadata”. A clean copy downloads with author, title, software and dates removed.
EOT_TF,
    ],
    [
      'How can I see who created a PDF?',
      <<<'EOT_TF'
Open it here. The Author, Creator and Producer fields show the person and software, if they were recorded.
EOT_TF,
    ],
    [
      'Does removing metadata change the document?',
      'No. Only the hidden properties are removed. Pages, text and images stay the same.',
    ],
    ['Can I change the PDF title?', 'Yes. Edit the Title field and press “Save my edits”.'],
    ['Is my PDF uploaded?', 'No. Everything happens in your browser.'],
  ],
];
