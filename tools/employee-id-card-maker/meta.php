<?php
// Employee ID Card Maker: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Employee ID Card Maker',
  'category' => 'money',
  'order' => 40,
  'files' => true,
  'use' => 'student-id-card-maker',
  'preset' => json_decode('{"type": "employee"}', true),
  'icon' => 'contact-round',
  'keywords' => 'employee id card maker company id card generator staff id badge maker employee badge template office id card online free',
  'short' => 'Make a staff ID badge with photo, logo and QR code, ready to print.',
  'title' => 'Employee ID Card Maker: Free Staff Badge With Photo',
  'description' => <<<'EOT_TF'
Make employee ID cards online: add a photo and company logo, pick a design and colour, add a QR code, and download a print-ready PDF or PNG. Free, no sign-up.
EOT_TF,
  'related' => ['student-id-card-maker', 'experience-letter-maker', 'email-signature-generator', 'invoice-generator'],
  'answer' => <<<'EOT_TF'
Upload the employee’s <strong>photo</strong> and your <strong>company logo</strong>, enter the name, job title, employee ID and department, then pick a landscape or portrait (lanyard) layout and your brand colour. The badge’s front and back update as you type. Download a <strong>print-ready PDF</strong> with crop marks, or PNG files for a card printer.
EOT_TF,
  'article' => <<<'EOT_TF'
<h2>How to make an employee ID card</h2>
<ol>
<li>Upload the employee’s photo and your company logo.</li>
<li>Enter the company name, employee name, job title, employee ID, department, joining date and validity.</li>
<li>Choose a design and colour. Portrait suits lanyard badges; landscape suits wallets and card holders.</li>
<li>Download a print-ready PDF or PNG images of the front and back.</li>
</ol>

<h2>What to put on an employee badge</h2>
<ul>
<li><strong>Front:</strong> company name and logo, photo, full name, job title, employee ID, department and an expiry date.</li>
<li><strong>Back:</strong> “property of” notice and return address, emergency contact, a QR code with the employee’s name and ID, and an authorised signature.</li>
</ul>
<p>Large, clear names and photos help reception and security staff check people quickly. Avoid putting home addresses or sensitive data on a badge.</p>

<h2>Printing</h2>
<p>Cards are made at the standard CR80 size (85.6 × 54 mm) at 300 dpi. Print the PDF at actual size on card stock, cut on the crop marks and laminate, or send the PNGs to a PVC card printer. Add a slot punch for a lanyard or badge reel.</p>

<h2>Visitor and contractor badges</h2>
<p>Use the same tool for visitor, contractor or event passes: change the job title to “Visitor”, set a short validity date, and pick a different colour so they stand out.</p>

<h2>Private</h2>
<p>Photos and employee details never leave your device: the card is drawn in your browser.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I make an employee ID card online?',
      <<<'EOT_TF'
Add the photo and logo, fill in the details, choose a design and colour, then download the print-ready PDF or PNG images. It’s free and nothing is uploaded.
EOT_TF,
    ],
    [
      'What size is an ID card?',
      <<<'EOT_TF'
The standard ID card size is 85.6 × 54 mm (3.375 × 2.125 in), called CR80, the same as a bank card. This tool makes cards at that size at 300 dpi.
EOT_TF,
    ],
    [
      'Can I print the card at home?',
      <<<'EOT_TF'
Yes. Print the PDF at 100% (actual size) on thick card or photo paper, cut along the crop marks and laminate it.
EOT_TF,
    ],
    [
      'Can I add a QR code?',
      <<<'EOT_TF'
Yes. The back of the card includes a QR code with the name, ID number and organisation. Untick it if you don’t want one.
EOT_TF,
    ],
    [
      'Are my photos and details uploaded?',
      <<<'EOT_TF'
No. Everything is drawn in your browser and saved only on your device.
EOT_TF,
    ],
  ],
];
