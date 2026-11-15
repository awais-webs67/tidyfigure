<?php
return [
    'name' => 'vCard QR Code Generator',
    'updated' => '2026-11-15',
    'category' => 'qr',
    'order' => 4,
    'icon' => 'contact',
    'use' => 'qr-code-generator',
    'preset' => 'vcard',
    'keywords' => 'vcard qr code generator, contact qr code, business card qr maker, add to contacts qr code',
    'short' => 'Put your contact details in a QR code. One scan saves you to their phone.',
    'title' => 'vCard QR Code Generator – Business Card QR',
    'description' => 'Build a scannable vCard contact QR code holding your full name, phone, email, job title and website—works natively on iPhone and Android.',
    'related' => ['qr-code-generator', 'whatsapp-qr-code-generator', 'barcode-generator'],
    'answer' => 'Fill in your name, phone, email, company and website, and download the QR code. When someone scans it, their phone offers to <strong>save you as a new contact</strong> with every field filled in, with no typing and no spelling mistakes. Print it on business cards, name badges, email signatures or your office door.',
    'article' => <<<'EOT_TF'
<h2>What is a vCard?</h2>
<p>A vCard is the standard file format phones and email programs use to exchange contact details. The QR code contains a vCard (version 3.0, the most widely supported) like this:</p>
<div class="formula">BEGIN:VCARD
VERSION:3.0
N:Example;Jane;;;
FN:Jane Example
ORG:Example Ltd
TEL;TYPE=CELL:+44 20 7946 0000
EMAIL:jane@example.com
END:VCARD</div>
<p>iPhone and Android cameras recognise it and show "Add to contacts".</p>

<h2>Tips for a great contact QR code</h2>
<ul>
<li><strong>Use international phone numbers</strong> (+ and country code) so the number works for anyone, anywhere.</li>
<li><strong>Fill in only what you want to share.</strong> Empty fields are left out, which also keeps the code simpler and easier to scan.</li>
<li><strong>Keep it short.</strong> More text means more, smaller squares. For business cards, name, phone, email and website are usually enough.</li>
<li><strong>Print it at least 2 cm wide</strong> on a business card, with good contrast.</li>
</ul>

<h2>Static vCard versus "dynamic" contact pages</h2>
<p>Some services create a code that points to a web page with your details, so you can edit them later, but the code stops working if you stop paying. A static vCard code stores your details directly, so it works forever and offline. If your details change, simply make a new one.</p>

<h2>Where to use it</h2>
<ul>
<li>Business cards and name badges at conferences</li>
<li>Email signatures and presentation end slides</li>
<li>Shop counters, reception desks and vehicle signs</li>
<li>CVs and portfolios, so recruiters can save you instantly</li>
</ul>

<h2>Privacy</h2>
<p>Your details are only processed in your browser while you create the code. Nothing is uploaded or stored.</p>

<h2>Inside the Standard vCard 3.0 Payload</h2>
<p>Both Apple iOS and Android Cameras recognise standard <code>BEGIN:VCARD / VERSION:3.0</code> text blocks natively without any third-party app. Keeping fields concise—avoiding long biographies or embedded photos inside static codes—keeps the QR module grid coarse so even compact 2 cm × 2 cm business cards scan instantaneously.</p>

<h2>Static vCard vs Hosted Digital Profiles</h2>
<p>A printed static vCard code works forever even without mobile data because every detail sits inside the QR pixels; choose a dynamic QR only when you swap numbers regularly.</p>
EOT_TF,
    'faqs' => [
        ['How do I make a QR code for my contact details?', 'Fill in the contact fields, check the preview, and download the code as PNG or SVG.'],
        ['Will a vCard QR code work on iPhone?', 'Yes. The iPhone Camera app recognises contact QR codes and offers to add the contact.'],
        ['How much information can I put in a contact QR code?', 'Several hundred characters, but shorter is better. Name, phone, email and website keep the code easy to scan.'],
        ['Can I add my photo to the contact?', 'Photos make the code far too large. Add a logo in the middle of the QR code instead.'],
        ['Does it expire?', 'No. The details are stored in the code, so it works forever.'],
    ],
    'aka' => ['Contact vCard QR Maker', 'Digital Business Card QR'],
];
