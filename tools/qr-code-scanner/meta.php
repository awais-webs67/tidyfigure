<?php
// QR Code Scanner: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'QR Code Scanner',
  'category' => 'qr',
  'order' => 5,
  'icon' => 'scan-line',
  'popular' => true,
  'libs' => [
    'https://cdn.jsdelivr.net/npm/@zxing/library@0.21.3/umd/index.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js',
  ],
  'scripts' => ['scan.js'],
  'keywords' => 'scan qr code online qr reader from image camera decode qr',
  'short' => 'Scan a QR code with your camera or from a screenshot or photo.',
  'title' => 'QR Code Scanner Online: Scan From Camera or Image, Free',
  'description' => <<<'EOT_TF'
Scan QR codes online with your phone or laptop camera, or upload a screenshot or photo. See links, Wi-Fi passwords and contacts safely before opening. Free.
EOT_TF,
  'related' => ['qr-code-generator', 'barcode-reader', 'wifi-qr-code-generator'],
  'answer' => <<<'EOT_TF'
Press <strong>Scan with camera</strong> and point it at the code, or <strong>upload an image</strong>, such as a screenshot of a QR code someone sent you. The result is shown before anything opens: links show their real address, Wi-Fi codes show the network and password, and contact cards show the details.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>Scanning a QR code from a screenshot</h2>
<p>Phone cameras can't scan a QR code that's on the same phone's screen. That's where this scanner helps: take a screenshot (or save the image from a message or email), choose "Upload an image", and the code is read straight from the picture. It also works for QR codes inside photos and PDFs you've saved as images.</p>

<h2>Scanning with a laptop or desktop</h2>
<p>Allow camera access when your browser asks, then hold the code in front of the webcam. Keep it flat, well lit and fully inside the frame. Rear cameras are used automatically on phones and tablets.</p>

<h2>Stay safe with QR codes</h2>
<p>"Quishing" (QR phishing) is growing: scammers stick fake QR codes on parking meters, posters and restaurant tables, or send them by email, leading to fake payment or login pages. This scanner never opens anything automatically. It shows the destination first, with the website's domain highlighted, so you can check it's genuine before tapping "Open link".</p>
<ul>
<li>Be suspicious of codes stuck over other codes, or on stickers in public places.</li>
<li>Check the domain carefully: <em>paypa1.com</em> is not <em>paypal.com</em>.</li>
<li>Never enter passwords or card details on a page you reached by an unexpected QR code.</li>
</ul>

<h2>What it can read</h2>
<ul>
<li><strong>Links</strong>, shown with the domain so you can check it.</li>
<li><strong>Wi-Fi codes</strong>, showing the network name and password, handy for typing it into a laptop.</li>
<li><strong>Contact cards (vCard)</strong>, showing name, phone, email and company.</li>
<li><strong>Text, email addresses, phone numbers and SMS codes.</strong></li>
</ul>
<p>For product barcodes (EAN, UPC, Code 128) use the Barcode Reader.</p>

<h2>Private by design</h2>
<p>The camera feed and images are processed in your browser by the open-source ZXing library. Nothing is uploaded or recorded.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I scan a QR code from a screenshot?',
      'Choose “Upload an image” and select the screenshot. The code is read from the picture.',
    ],
    [
      'Can I scan a QR code on my laptop?',
      'Yes. Press “Scan with camera”, allow camera access, and hold the code in front of the webcam.',
    ],
    [
      'How do I see the Wi-Fi password in a QR code?',
      'Scan the Wi-Fi QR code here. The network name and password are shown as text.',
    ],
    [
      'Is it safe to scan QR codes?',
      <<<'EOT_TF'
The code itself is harmless, but it can lead to scam sites. This scanner shows the link before opening it so you can check it.
EOT_TF,
    ],
    ['Is the camera image uploaded?', 'No. Scanning happens entirely in your browser.'],
  ],
];
