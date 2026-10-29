<?php
// Barcode Generator: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Barcode Generator',
  'updated' => '2026-10-22', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'qr',
  'order' => 7,
  'icon' => 'barcode',
  'libs' => [
    'https://cdnjs.cloudflare.com/ajax/libs/jsbarcode/3.11.6/JsBarcode.all.min.js',
  ],
  'keywords' => 'make barcode online ean13 generator code 128 upc barcode label free',
  'short' => 'Create Code 128, EAN-13, UPC, Code 39 and ITF-14 barcodes as PNG or SVG.',
  'title' => 'Barcode Generator: Free Code 128, EAN-13 & UPC Barcodes',
  'description' => <<<'EOT_TF'
Create barcodes online: Code 128, EAN-13, EAN-8, UPC-A, Code 39, ITF-14, Codabar and more. Check digits added automatically. Download PNG or SVG for printing.
EOT_TF,
  'related' => ['barcode-reader', 'qr-code-generator', 'bulk-qr-code-generator'],
  'answer' => <<<'EOT_TF'
Choose a barcode type, type the value, and download a sharp <strong>PNG</strong> or print-ready <strong>SVG</strong>. For inventory, asset tags and shipping labels, use <strong>Code 128</strong>, which accepts any text. For products sold in shops, use <strong>EAN-13</strong> (or UPC-A in North America) with a number registered with GS1.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>Which barcode should I use?</h2>
<div class="scroll"><table class="tbl">
<thead><tr><th>Type</th><th>Characters</th><th>Use it for</th></tr></thead>
<tbody>
<tr><td>Code 128</td><td>Any letters, numbers, symbols</td><td>Inventory, asset tags, shipping, tickets</td></tr>
<tr><td>EAN-13</td><td>12 digits + check digit</td><td>Retail products worldwide, books</td></tr>
<tr><td>UPC-A</td><td>11 digits + check digit</td><td>Retail products in the US and Canada</td></tr>
<tr><td>EAN-8</td><td>7 digits + check digit</td><td>Very small retail packages</td></tr>
<tr><td>Code 39</td><td>Capitals, digits, a few symbols</td><td>Industry, ID badges, older systems</td></tr>
<tr><td>ITF-14</td><td>13 digits + check digit</td><td>Cartons and outer cases</td></tr>
</tbody></table></div>

<h2>Check digits</h2>
<p>EAN, UPC and ITF barcodes end with a check digit calculated from the other digits, so scanners can catch misreads. Type the number without it and the generator adds the correct digit. If you type the full number and the check digit is wrong, you'll see an error rather than an unscannable barcode.</p>

<h2>Selling products in shops</h2>
<p>You can generate an EAN-13 image for any number, but shops and marketplaces (supermarkets, Amazon and others) require the number itself to be registered to your company through <strong>GS1</strong>, the organisation that issues product numbers. Buy numbers from your national GS1 office, then use this tool to create the barcode images. For your own stock control, labels and events, use Code 128 freely; no registration is needed.</p>

<h2>Printing barcodes that scan</h2>
<ul>
<li><strong>Use SVG for print.</strong> Vector bars stay perfectly crisp at any size.</li>
<li><strong>Keep the white margins</strong> (quiet zones) at both ends.</li>
<li><strong>Dark bars on a light background.</strong> Black on white is safest; red bars can't be read by many laser scanners.</li>
<li><strong>Don't squash it.</strong> Scale width and height together.</li>
<li><strong>Test it</strong> with the Barcode Reader before printing a batch.</li>
</ul>

<h2>Private by design</h2>
<p>Barcodes are drawn in your browser with the open-source JsBarcode library. Nothing is uploaded.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I create a barcode for free?',
      'Choose a barcode type, enter the value and download it as PNG or SVG.',
    ],
    [
      'Which barcode type should I use for inventory?',
      'Code 128. It accepts letters and numbers and is read by almost every scanner.',
    ],
    [
      'Can I make an EAN-13 barcode for my product?',
      'You can create the image here, but to sell in shops the number must be registered with GS1.',
    ],
    [
      'Do I need to calculate the check digit?',
      'No. For EAN, UPC and ITF-14 the check digit is added automatically.',
    ],
    ['What format is best for printing?', 'SVG, because it stays sharp at any size.'],
  ],
];
