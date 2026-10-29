<?php
// Repair PDF: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Repair PDF',
  'updated' => '2026-10-29', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'pdf',
  'order' => 21,
  'files' => true,
  'libs' => ['https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js'],
  'icon' => 'wrench',
  'keywords' => 'repair pdf online free fix corrupted pdf recover damaged pdf pdf won\'t open fix broken pdf file restore pdf',
  'aka' => ['fix corrupted PDF', 'recover damaged PDF'], // other names people search for
  'short' => 'Fix a damaged or corrupted PDF that won’t open, and recover as many pages as possible.',
  'title' => 'Repair PDF Online Free: Fix Corrupted & Damaged PDFs',
  'description' => <<<'EOT_TF'
Repair corrupted PDF files online: rebuild a damaged file so it opens again, or recover every page that can still be read. Free and private, nothing uploaded.
EOT_TF,
  'related' => ['compress-pdf', 'pdf-to-text', 'unlock-pdf'],
  'answer' => <<<'EOT_TF'
Drop the damaged PDF. The tool first <strong>rebuilds the file's structure</strong>, which fixes most PDFs that won't open or show errors while keeping text and quality exactly as they were. If the file is too badly damaged for that, it <strong>recovers every page that can still be read</strong> and builds a new PDF from them, with the text kept searchable.
EOT_TF,
  'article' => <<<'EOT_TF'
<h2>How to repair a PDF</h2>
<ol>
<li>Drop the damaged PDF in the box.</li>
<li>The tool tries to repair it straight away and tells you what it did and how many pages it recovered.</li>
<li>Check the preview of the repaired pages, then download the new PDF.</li>
</ol>

<h2>Why PDFs get damaged</h2>
<p>A PDF ends with an index (the cross-reference table) that tells readers where every page, font and image is stored. When a download is cut off, an email attachment is mangled, a disk or USB stick fails, or the program writing the PDF crashes, that index can be missing or wrong. Readers then say the file is damaged, show blank pages or refuse to open it, even though most of the content is still there.</p>

<h2>Two ways of repairing</h2>
<p><strong>Rebuild:</strong> the tool reads every object it can find in the file and writes a new, correct index. This fixes most damaged PDFs and keeps everything as it was: text stays sharp and selectable, and nothing is converted.</p>
<p><strong>Recover pages:</strong> when the structure is too broken to rebuild, a very forgiving PDF reader draws each page it can still read, and a new PDF is made from those pages. Each page becomes a high-resolution image with an invisible copy of its text on top, so you can still search, select and copy the text.</p>

<h2>When a PDF can't be repaired</h2>
<p>If a file was cut off halfway, the missing part simply isn't there, and pages stored in it can't come back. Files that are all zeros, or aren't really PDFs (for example a web page saved with a .pdf name), can't be repaired either. Try downloading the file again, or ask the sender for a new copy.</p>
<p>Password-protected PDFs aren't damaged: open them with <a href="/unlock-pdf">Unlock PDF</a>.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I fix a corrupted PDF for free?',
      <<<'EOT_TF'
Drop it here. The tool rebuilds the file or recovers every page it can still read, and you download the repaired PDF. It is free with no sign-up.
EOT_TF,
    ],
    [
      'Will the repaired PDF lose quality?',
      <<<'EOT_TF'
Not when the file can be rebuilt: everything is kept as it was. When pages have to be recovered, they become high-resolution images with their text kept searchable.
EOT_TF,
    ],
    [
      'Why can’t some pages be recovered?',
      <<<'EOT_TF'
If the file was cut off, for example by an interrupted download, the missing part is not in the file at all. Download it again or ask the sender for a new copy.
EOT_TF,
    ],
    [
      'Is my PDF uploaded?',
      <<<'EOT_TF'
No. The PDF is repaired in your browser and never leaves your device.
EOT_TF,
    ],
  ],
];
