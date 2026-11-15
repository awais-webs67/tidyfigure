<?php
return [
    'name' => 'Student ID Card Maker',
    'updated' => '2026-11-15',
    'category' => 'study',
    'order' => 10,
    'popular' => true,
    'files' => true,
    'libs' => ['https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js'],
    'icon' => 'id-card',
    'keywords' => 'student id card maker, printable school id template, college id card generator, id badge with qr code',
    'aka' => ['School ID Card Generator', 'Printable Student Badge Maker'],
    'short' => 'Design a student ID card with photo and QR code, ready to print.',
    'title' => 'Student ID Card Maker – Printable PDF & QR',
    'description' => 'Design custom student ID cards with photo, school logo, valid dates and scannable QR code—download print-ready PDF or PNG files locally.',
    'related' => ['employee-id-card-maker', 'passport-photo-maker', 'qr-code-generator', 'flashcard-maker'],
    'answer' => 'Add the student’s <strong>photo</strong> and the <strong>school logo</strong>, fill in the name, class, ID number and other details, then choose a design, layout and colour. The front and back update as you type at the standard card size (85.6 × 54 mm, 300 dpi). Download a <strong>print-ready PDF</strong> with crop marks, or PNG images.',
    'article' => <<<'EOT_TF'
<h2>How to make a student ID card</h2>
<ol>
<li>Add the student’s photo (a clear, front-facing picture on a plain background) and the school logo.</li>
<li>Fill in the school name, student name, class, ID number, date of birth, blood group and validity.</li>
<li>Pick a design, landscape or portrait layout, and your school colour.</li>
<li>Download the print-ready PDF or the front and back as PNG images.</li>
</ol>

<h2>What to put on a student ID card</h2>
<ul>
<li><strong>Front:</strong> school name and logo, photo, student name, class and section, admission or ID number, roll number, date of birth, blood group and expiry date.</li>
<li><strong>Back:</strong> return address, parent or guardian name, emergency phone number, a QR code with the student’s details, and the principal’s signature.</li>
</ul>

<h2>Printing</h2>
<p>The card uses the standard ID size of 85.6 × 54 mm (CR80, the same as a bank card) at 300 dpi. Print the PDF at <strong>100% / actual size</strong> on thick card or photo paper, cut along the crop marks, glue front to back and laminate. For durable PVC cards, send the PNG files to a card printing shop or use a PVC ID card printer.</p>

<h2>Making cards for a whole class</h2>
<p>Your details are saved in your browser as you type, so you only change the name, photo and numbers for the next student. Keep the school name, logo, colour and design the same for a consistent set.</p>

<h2>Privacy</h2>
<p>Photos and details stay on your device. The card is drawn in your browser and nothing is uploaded, which matters when you handle children’s personal information.</p>

<h2>Standard CR80 Card Proportions for Lamination</h2>
<p>Standard plastic and laminated ID badges measure <code>85.6 × 54 mm</code> (CR80, identical to a bank card). Exporting a sharp PDF preserves crisp text and high-contrast QR verification edges when printing onto 300 gsm card sheets or batching event passes for student clubs.</p>
EOT_TF,
    'faqs' => [
        ['How do I make a student ID card online?', 'Add the photo and logo, fill in the details, choose a design and colour, then download the print-ready PDF or PNG images. It’s free and nothing is uploaded.'],
        ['What size is an ID card?', 'The standard ID card size is 85.6 × 54 mm (3.375 × 2.125 in), called CR80, the same as a bank card. This tool makes cards at that size at 300 dpi.'],
        ['Can I print the card at home?', 'Yes. Print the PDF at 100% (actual size) on thick card or photo paper, cut along the crop marks and laminate it.'],
        ['Can I add a QR code?', 'Yes. The back of the card includes a QR code with the name, ID number and organisation. Untick it if you don’t want one.'],
        ['Are my photos and details uploaded?', 'No. Everything is drawn in your browser and saved only on your device.'],
        ['Can I print multiple student ID badges cleanly on A4 or Letter paper?', 'Yes. Download each card at exact CR80 scale and tile multiple images onto an A4 sheet before laminating.'],
    ],
];
