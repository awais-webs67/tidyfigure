<?php
return [
    'name' => 'Employee ID Card Maker',
    'updated' => '2026-11-15',
    'category' => 'money',
    'order' => 40,
    'files' => true,
    'use' => 'student-id-card-maker',
    'preset' => [
        'type' => 'employee',
    ],
    'icon' => 'contact-round',
    'keywords' => 'employee id card maker, staff badge template pdf, company id card generator qr, printable work badge',
    'short' => 'Make a staff ID badge with photo, logo and QR code, ready to print.',
    'title' => 'Employee ID Card Maker – Staff Badge PDF/PNG',
    'description' => 'Design company employee, contractor or visitor photo badges with corporate logo, department role, expiry date and QR code as print-ready PDF/PNG.',
    'related' => ['student-id-card-maker', 'experience-letter-maker', 'email-signature-generator', 'invoice-generator'],
    'answer' => 'Upload the employee’s <strong>photo</strong> and your <strong>company logo</strong>, enter the name, job title, employee ID and department, then pick a landscape or portrait (lanyard) layout and your brand colour. The badge’s front and back update as you type. Download a <strong>print-ready PDF</strong> with crop marks, or PNG files for a card printer.',
    'sources' => [
        ['ISO/IEC 7810 – Identification Cards Physical Characteristics (ID-1 / CR80)', 'https://www.iso.org/standard/70483.html'],
    ],
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

<h2>Adding Department Codes &amp; Lanyard Slot Margins</h2>
<p>When prepping corporate badges for vertical pouch holders or hole-punched PVC cards, keep logo graphics and holder portraits at least <code>8 mm</code> clear of the top edge so punch holes never clip company marks or magnetic orientation strips.</p>

<h2>Verify Employee Role &amp; Access Scopes Clearly</h2>
<p>Include bold high-contrast role labels (Staff, Visitor or Contractor) alongside valid-until expiry dates so reception desks spot access levels at a single glance.</p>
EOT_TF,
    'faqs' => [
        ['How do I make an employee ID card online?', 'Add the photo and logo, fill in the details, choose a design and colour, then download the print-ready PDF or PNG images. It’s free and nothing is uploaded.'],
        ['What size is an ID card?', 'The standard ID card size is 85.6 × 54 mm (3.375 × 2.125 in), called CR80, the same as a bank card. This tool makes cards at that size at 300 dpi.'],
        ['Can I print the card at home?', 'Yes. Print the PDF at 100% (actual size) on thick card or photo paper, cut along the crop marks and laminate it.'],
        ['Can I add a QR code?', 'Yes. The back of the card includes a QR code with the name, ID number and organisation. Untick it if you don’t want one.'],
        ['Are my photos and details uploaded?', 'No. Everything is drawn in your browser and saved only on your device.'],
        ['Can small teams print employee ID badges without special card printers?', 'Yes. Export crisp high-DPI PDFs, print on glossy 300 gsm card paper and cut cleanly around guides before hot-laminating.'],
    ],
    'aka' => ['Company Staff Badge Maker', 'Office ID Card Generator'],
];
