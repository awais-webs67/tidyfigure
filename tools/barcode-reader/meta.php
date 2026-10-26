<?php
// Barcode Reader: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Barcode Reader',
  'category' => 'qr',
  'order' => 6,
  'icon' => 'scan-barcode',
  'use' => 'qr-code-scanner',
  'preset' => 'all',
  'libs' => [
    'vendor/zxing-0.21.3.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jsbarcode/3.11.6/JsBarcode.all.min.js',
  ],
  'scripts' => ['scan.js'],
  'keywords' => 'barcode scanner online read barcode from image ean upc code 128 scan',
  'short' => 'Read EAN, UPC, Code 128, Data Matrix and other barcodes with a camera or image.',
  'title' => 'Barcode Reader Online: Scan Barcodes With Camera or Image',
  'description' => <<<'EOT_TF'
Scan barcodes online with your camera or from a photo: EAN-13, UPC-A, Code 128, Code 39, ITF, Data Matrix, PDF417 and QR. Free, private, works on phones.
EOT_TF,
  'related' => ['barcode-generator', 'qr-code-scanner', 'unit-price-calculator'],
  'answer' => <<<'EOT_TF'
Point your camera at a barcode or upload a photo of one, and the number or text it contains appears instantly, with the barcode type. It reads <strong>product barcodes</strong> (EAN-13, EAN-8, UPC-A, UPC-E), <strong>shipping and inventory codes</strong> (Code 128, Code 39, ITF) and 2D codes like Data Matrix, PDF417 and QR.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>Barcode types it reads</h2>
<div class="scroll"><table class="tbl">
<thead><tr><th>Type</th><th>Where you'll see it</th></tr></thead>
<tbody>
<tr><td>EAN-13 / EAN-8</td><td>Products in shops worldwide (outside North America), books (ISBN)</td></tr>
<tr><td>UPC-A / UPC-E</td><td>Products in the US and Canada</td></tr>
<tr><td>Code 128</td><td>Shipping labels, parcels, logistics, many ID cards</td></tr>
<tr><td>Code 39</td><td>Industry, healthcare, older inventory systems</td></tr>
<tr><td>ITF (ITF-14)</td><td>Cartons and outer packaging</td></tr>
<tr><td>Codabar</td><td>Libraries, blood banks, some courier labels</td></tr>
<tr><td>Data Matrix</td><td>Small parts, electronics, pharmaceuticals, postage</td></tr>
<tr><td>PDF417</td><td>Boarding passes, driving licences, ID documents</td></tr>
</tbody></table></div>

<h2>Tips for a good scan</h2>
<ul>
<li><strong>Light:</strong> bright, even light without glare on shiny packaging.</li>
<li><strong>Distance:</strong> fill most of the frame with the barcode, but keep it all in view, including the white margins at each end.</li>
<li><strong>Angle:</strong> hold the barcode flat and straight; curved bottles scan best when the bars run vertically.</li>
<li><strong>Photos:</strong> a sharp, close-up photo works as well as the live camera. Crop out other barcodes first.</li>
</ul>

<h2>What the number means</h2>
<p>A product barcode identifies the product, not the price: shops look the number up in their own system. The first digits of an EAN-13 identify the organisation that registered the barcode (not necessarily where it was made). Tap "Search this number" to look the product up online.</p>

<h2>Uses</h2>
<ul>
<li>Checking product details and comparing prices online</li>
<li>Small-business stock-taking without a dedicated scanner</li>
<li>Reading a parcel tracking number into your phone</li>
<li>Checking that barcodes you've created work before printing</li>
</ul>

<h2>Private by design</h2>
<p>Scanning runs in your browser with the open-source ZXing library. The camera feed and images never leave your device.</p>

<h2>Tips for a quick, accurate scan</h2>
<ul>
<li><strong>Light it evenly.</strong> Glare on shiny packaging is the most common reason a scan fails. Tilt the product slightly so the reflection moves off the bars.</li>
<li><strong>Fill about half the frame.</strong> Too far away and the thin bars blur together; too close and the camera can't focus. Move back until the whole barcode is sharp.</li>
<li><strong>Hold it flat.</strong> Barcodes on curved bottles scan better if you line the bars up vertically, so the curve runs along them rather than across.</li>
<li><strong>Damaged or tiny codes:</strong> take a sharp photo instead and use the image option, then zoom in on the photo before choosing it.</li>
</ul>
EOT_TF,
  'faqs' => [
    [
      'How do I scan a barcode online?',
      <<<'EOT_TF'
Press “Scan with camera” and hold the barcode in view, or upload a photo of it. The number appears instantly.
EOT_TF,
    ],
    [
      'Can I read a barcode from a picture?',
      'Yes. Choose “Upload an image” and select a clear photo or screenshot of the barcode.',
    ],
    [
      'Which barcode types are supported?',
      <<<'EOT_TF'
EAN-13, EAN-8, UPC-A, UPC-E, Code 128, Code 39, Code 93, ITF, Codabar, Data Matrix, PDF417, Aztec and QR.
EOT_TF,
    ],
    [
      'Why won’t my barcode scan?',
      <<<'EOT_TF'
Make sure it is sharp, well lit and flat, with the white margins visible. Glare on shiny packaging is the most common problem.
EOT_TF,
    ],
    ['Is my camera feed uploaded?', 'No. Everything is processed on your device.'],
  ],
];
