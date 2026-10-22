<?php
// Dynamic QR Code Generator: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Dynamic QR Code Generator',
  'category' => 'qr',
  'order' => 2,
  'icon' => 'qr-code',
  'popular' => true,
  'libs' => ['https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js'],
  'scripts' => ['hosted-qr.js'],
  'appCategory' => 'BusinessApplication',
  'keywords' => 'dynamic qr code generator free editable qr code trackable qr code scan tracking change qr link after printing',
  'short' => 'An editable QR code with scan tracking: change the link any time, free.',
  'title' => 'Free Dynamic QR Code Generator: Editable Link & Scan Tracking',
  'description' => 'Make a free dynamic QR code: change where it points after printing and see how many people scan it, by day and device. No sign-up. Download PNG or SVG.',
  'related' => ['qr-code-generator', 'pdf-to-qr-code', 'verification-qr-code-generator'],
  'answer' => <<<'EOT_TF'
A <strong>dynamic QR code</strong> points to a short link on this site that forwards people to your page, so you can <strong>change the destination after printing</strong> and <strong>count scans</strong>. Paste your link below, press Create, and download the code. Save the private manage link to edit it or see statistics. Most sites charge a monthly fee for this; here it’s free.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>Static vs dynamic QR codes</h2>
<div class="scroll"><table class="tbl">
<thead><tr><th></th><th>Static QR code</th><th>Dynamic QR code</th></tr></thead>
<tbody>
<tr><td>What's inside the code</td><td>Your link itself</td><td>A short link that forwards to your link</td></tr>
<tr><td>Change the destination later</td><td>No, you'd need a new code</td><td>Yes, any time</td></tr>
<tr><td>Scan statistics</td><td>No</td><td>Yes: total, per day, phone or computer</td></tr>
<tr><td>Works forever</td><td>Yes</td><td>While hosted (30 days here by default)</td></tr>
<tr><td>Code size</td><td>Bigger for long links</td><td>Always small and easy to scan</td></tr>
</tbody></table></div>
<p>For things you print once and never change, like your Wi-Fi password or a permanent website, a <a href="/qr-code-generator">static QR code</a> is simpler and never expires. Choose a dynamic code for campaigns and anything that might change: menus, event pages, flyers, product launches or posters.</p>

<h2>How to make a dynamic QR code</h2>
<ol>
<li>Paste the link people should open, such as your menu, booking page or Google review page.</li>
<li>Give it a name so you can recognise it later (only you see this).</li>
<li>Press <strong>Create dynamic QR code</strong>. Choose a colour if you like, and download it as PNG for documents or SVG for print.</li>
<li><strong>Save the private manage link.</strong> It's the only way to edit the code, see its scans or delete it, and it's shown only once. Copy it or email it to yourself.</li>
</ol>

<h2>Changing the link after printing</h2>
<p>Open your manage link, type the new destination and save. The printed code doesn't change, but everyone who scans it from then on goes to the new page. This is useful when a menu changes, an event moves, a promotion ends, or you spot a typo in the original link.</p>

<h2>Scan tracking</h2>
<p>The manage page shows the total number of scans, a chart of the last 30 days, and how many came from phones versus computers. Link previews from apps such as WhatsApp and search engine bots are not counted. No personal information about the people who scan is stored.</p>

<h2>Tips for codes that get scanned</h2>
<ul>
<li><strong>Add a call to action</strong> next to the code: "Scan for today's menu" works far better than a code on its own.</li>
<li><strong>Print it big enough:</strong> at least 2 × 2 cm (0.8 in) for close-up use, and about a tenth of the scanning distance for posters (a code read from 2 m away should be about 20 cm wide).</li>
<li><strong>Keep strong contrast:</strong> a dark code on a light background. Very light colours or inverted codes fail on some phones.</li>
<li><strong>Test before printing</strong> with two or three different phones.</li>
</ul>

<h2>How long does a dynamic QR code last?</h2>
<p>Codes made here are hosted for 30 days by default and then deleted automatically, which keeps the service free. That's ideal for events, campaigns and promotions. For a code that must work for years, use a static QR code that contains your link directly.</p>
EOT_TF,
  'faqs' => [
    ['What is a dynamic QR code?', 'A QR code that contains a short link to this site, which forwards people to your page. Because the forwarding happens on the server, you can change the destination and count scans without changing the printed code.'],
    ['Can I change the link after printing?', 'Yes. Open your private manage link, enter the new destination and save. Everyone who scans from then on goes to the new page.'],
    ['Is it really free?', 'Yes. No sign-up and no subscription. Codes are hosted for 30 days, then deleted automatically.'],
    ['How do I see how many people scanned it?', 'Open your manage link. It shows total scans, a 30-day chart, and phone versus computer scans.'],
    ['I lost my manage link. Can I get it back?', 'No. For privacy it is shown only once and is not stored in a readable form. Make a new code if you need to change the destination.'],
  ],
];
