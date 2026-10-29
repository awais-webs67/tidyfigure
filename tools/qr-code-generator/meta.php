<?php
// QR Code Generator: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'QR Code Generator',
  'updated' => '2026-10-29', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'qr',
  'order' => 1,
  'icon' => 'qr-code',
  'popular' => true,
  'libs' => [
    'https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js',
  ],
  'keywords' => 'qr code maker link wifi qr code free no expiry download png svg',
  'aka' => ['QR code maker', 'QR generator', 'create QR code', 'free QR code'], // other names people search for
  'short' => 'Free QR codes for links, Wi-Fi, WhatsApp, contacts and more, with your logo.',
  'title' => 'QR Code Generator: Free QR Codes That Never Expire',
  'description' => <<<'EOT_TF'
Create QR codes for links, Wi-Fi, WhatsApp, contact cards, SMS and email. Add your logo, pick colours, download PNG or SVG. Free, no sign-up, never expires.
EOT_TF,
  'related' => ['qr-code-scanner', 'wifi-qr-code-generator', 'bulk-qr-code-generator'],
  'answer' => <<<'EOT_TF'
Choose what the QR code should do (open a link, join Wi-Fi, show text, write an email or call a number), type the details, and download it as <strong>PNG</strong> or <strong>SVG</strong>. These are <strong>static QR codes</strong>: the information is stored inside the code itself, so they work forever, offline, with no tracking and no subscription.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>Static QR codes never expire</h2>
<p>Many "free" QR code sites create <em>dynamic</em> codes. The code points to their server, which then redirects to your link. When the free trial ends, the code stops working, often after you've printed it on menus, flyers or packaging. This generator makes <strong>static</strong> codes: your link or text is encoded directly in the black and white squares. No server is involved, so the code can't be switched off and nobody tracks who scans it.</p>
<p>The trade-off is that a static code can't be edited after printing. If you might change the destination later, point the code at a page on your own website that you control.</p>

<h2>Types of QR code</h2>
<ul>
<li><strong>Link:</strong> opens a website. The most common use.</li>
<li><strong>Wi-Fi:</strong> guests scan to join your network without typing the password. Works with the built-in camera on iPhone and Android.</li>
<li><strong>Text:</strong> shows a message, serial number or instructions. Works offline.</li>
<li><strong>Email:</strong> opens a new email to your address, with an optional subject.</li>
<li><strong>Phone:</strong> offers to call the number. Include the country code, like +44 or +1.</li>
<li><strong>WhatsApp:</strong> opens a chat with your number and a ready-typed message.</li>
<li><strong>SMS:</strong> opens a text message to your number, useful for "text JOIN to…" campaigns.</li>
<li><strong>Contact card (vCard):</strong> saves your name, phone, email and company to the scanner's contacts.</li>
</ul>

<h2>Error correction</h2>
<p>QR codes contain extra data so they still scan when part of the code is dirty, damaged or covered. Higher levels survive more damage but make the code denser.</p>
<div class="scroll"><table class="tbl">
<thead><tr><th>Level</th><th class="n">Can lose</th><th>Best for</th></tr></thead>
<tbody>
<tr><td>Low</td><td class="n">7%</td><td>Screens and clean, indoor print</td></tr>
<tr><td>Medium</td><td class="n">15%</td><td>Most uses (default)</td></tr>
<tr><td>High</td><td class="n">25%</td><td>Outdoor signs, packaging</td></tr>
<tr><td>Highest</td><td class="n">30%</td><td>Rough surfaces, or a logo placed on top</td></tr>
</tbody></table></div>

<h2>Printing tips</h2>
<ul>
<li><strong>Size:</strong> at least 2 × 2 cm (0.8 inch) for scanning from 20 cm away. As a rule, make the code one tenth of the scanning distance: a poster read from 3 metres needs a 30 cm code.</li>
<li><strong>Contrast:</strong> dark code on a light background. Inverted (light on dark) codes fail on many phones.</li>
<li><strong>Quiet zone:</strong> keep the white border around the code. The downloads include it.</li>
<li><strong>SVG for print:</strong> SVG is a vector format that stays perfectly sharp at any size, so printers prefer it.</li>
<li><strong>Adding a logo:</strong> the logo covers the middle of the code, so the generator switches to the highest error correction automatically. Keep logos small and always test-scan.</li>
<li><strong>Test before printing:</strong> scan it with two different phones.</li>
</ul>
EOT_TF,
  'faqs' => [
    [
      'Do these QR codes expire?',
      <<<'EOT_TF'
No. They are static codes with your information stored inside the code, so they keep working forever and don’t depend on any website.
EOT_TF,
    ],
    [
      'How do I make a QR code for Wi-Fi?',
      <<<'EOT_TF'
Choose Wi-Fi, enter the network name and password, and pick the security type (usually WPA). Guests can scan it with their phone camera to join.
EOT_TF,
    ],
    [
      'Can I use these QR codes commercially?',
      'Yes. They are free for any use, including menus, packaging, business cards and advertising.',
    ],
    [
      'What is the best format for printing a QR code?',
      <<<'EOT_TF'
SVG, because it stays sharp at any size. Use PNG at 2048 px if your printer or software doesn’t accept SVG.
EOT_TF,
    ],
    [
      'Can I track how many people scan my QR code?',
      <<<'EOT_TF'
Not with a static code. To count scans, link the code to a page on your own website and use your website analytics.
EOT_TF,
    ],
  ],
];
