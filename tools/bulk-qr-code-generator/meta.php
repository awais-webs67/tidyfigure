<?php
// Bulk QR Code Generator: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Bulk QR Code Generator',
  'updated' => '2026-10-22', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'qr',
  'order' => 8,
  'icon' => 'grid-3x3',
  'libs' => [
    'https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
  ],
  'keywords' => 'bulk qr code generator batch qr codes from list csv multiple qr codes zip',
  'short' => 'Paste a list and get hundreds of QR codes at once, zipped and labelled.',
  'title' => 'Bulk QR Code Generator: Make Hundreds of QR Codes at Once',
  'description' => <<<'EOT_TF'
Generate up to 500 QR codes at once from a list of links or text. Optional labels under each code, numbered or text-based file names, all in one zip. Free.
EOT_TF,
  'related' => ['qr-code-generator', 'barcode-generator', 'qr-code-scanner'],
  'answer' => <<<'EOT_TF'
Paste one link or piece of text per line and you instantly get one QR code for each. Add the text as a label under each code, choose how files are named, and download them all as a single <strong>.zip</strong>, including a CSV that lists which file contains what. Up to 500 codes per batch.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>When you need many QR codes</h2>
<ul>
<li><strong>Products and stock:</strong> a code per product page, SKU or serial number.</li>
<li><strong>Restaurants:</strong> a code per table that links to ordering ("Table 1", "Table 2"…).</li>
<li><strong>Events:</strong> ticket or attendee codes, session feedback links, badge codes.</li>
<li><strong>Asset tracking:</strong> codes on laptops, tools and equipment that link to records.</li>
<li><strong>Education:</strong> a code per worksheet, book or classroom resource.</li>
<li><strong>Real estate:</strong> a code per property board linking to its listing.</li>
</ul>

<h2>How to use it</h2>
<ol>
<li>Paste your list, one item per line. Copy a column straight from Excel or Google Sheets; each cell becomes a line.</li>
<li>Choose the size, colour and whether to print the text under each code.</li>
<li>Pick file names: numbered (qr-001.png, qr-002.png…) or based on the text.</li>
<li>Download the zip. It includes <em>list.csv</em> matching each numbered file to its content, which is handy for mail merges and print layouts.</li>
</ol>

<h2>Tips</h2>
<ul>
<li><strong>Shorter content makes simpler codes.</strong> Long URLs create dense codes that need to be printed bigger. Use short paths like example.com/p/1001.</li>
<li><strong>Labels help humans.</strong> Printing the text under a code lets staff match codes to items without scanning.</li>
<li><strong>Spot-check:</strong> scan a few codes from the batch with the QR Code Scanner before printing hundreds.</li>
<li><strong>Need different types?</strong> Wi-Fi, WhatsApp and contact codes can be made one at a time with the QR Code Generator.</li>
</ul>

<h2>Free, static and private</h2>
<p>Every code is static, so it never expires and needs no subscription. The codes are generated and zipped in your browser; your list is never uploaded.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I create multiple QR codes at once?',
      'Paste your links or text, one per line, and download all the QR codes as a zip file.',
    ],
    [
      'Can I make QR codes from an Excel list?',
      'Yes. Copy the column from Excel or Google Sheets and paste it into the box.',
    ],
    ['How many QR codes can I make at once?', 'Up to 500 per batch. Run several batches for more.'],
    ['Can I add a label under each QR code?', 'Yes. Tick “Print the text under each code”.'],
    [
      'Do bulk QR codes expire?',
      'No. They are static codes with the content stored inside them.',
    ],
  ],
];
