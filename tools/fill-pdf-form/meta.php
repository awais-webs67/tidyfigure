<?php
return [
    'name' => 'Fill PDF Form',
    'updated' => '2026-11-15',
    'category' => 'pdf',
    'order' => 18,
    'files' => true,
    'libs' => [
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js',
        'vendor/fontkit-1.1.1.min.js',
    ],
    'icon' => 'list-checks',
    'keywords' => 'fill pdf form online free, type into fillable pdf, flatten pdf form fields browser, fill sign pdf no upload',
    'aka' => ['Fillable PDF Form Filler', 'AcroForm PDF Flatten Tool'],
    'short' => 'Type into the fields of a fillable PDF form, tick the boxes, then save it or lock the answers in.',
    'title' => 'Fill PDF Form Online – Type, Tick & Flatten',
    'description' => 'Complete AcroForm text inputs, checkboxes, radio buttons and dropdowns inside your browser, with optional flattening so entries stay tamper-safe.',
    'related' => ['edit-pdf', 'sign-pdf', 'protect-pdf'],
    'answer' => 'To fill a PDF form, open it and <strong>type your answers in the boxes</strong> on the left: every text field, tick box, choice and list in the form is listed in order, and the preview shows the filled pages. Tick <strong>Lock the answers</strong> to flatten the form so nobody can change it, then download.',
    'article' => <<<'EOT_TF'
<h2>How to fill in a PDF form</h2>
<ol>
<li>Drop your fillable PDF in the box, or try the sample form.</li>
<li>Every field in the form appears in a list, in page order, with its label. Type in the text boxes, tick boxes, choose options and pick from lists.</li>
<li>The preview shows the filled pages as they'll look. Tick <strong>Lock the answers</strong> if you want the form flattened, then download.</li>
</ol>

<h2>Lock the answers (flatten the form)</h2>
<p>A filled form still has editable fields, so anyone who receives it can change your answers, and some phones and email apps don't show field contents at all. <strong>Flattening</strong> turns the answers into normal text on the page: they look the same everywhere, print correctly and can't be edited. Keep a copy without flattening if you might need to change something later.</p>

<h2>What kinds of forms work</h2>
<p>Most fillable PDFs made with Adobe Acrobat, Word, LibreOffice or online form builders use standard form fields (AcroForms), and all of them work here: text boxes, multi-line boxes, tick boxes, radio buttons, drop-down lists and option lists. Fields keep their formatting, and you can type accents and other Latin letters.</p>
<p>Two kinds of PDF can't be filled this way:</p>
<ul>
<li><strong>Flat forms</strong> with lines and boxes but no real fields, like a scanned paper form. Use <a href="/edit-pdf">Edit PDF</a> to type anywhere on the page instead.</li>
<li><strong>Dynamic XFA forms</strong>, an old Adobe format used by some government sites, that only open in Adobe Reader.</li>
</ul>

<h2>Private, free and with no watermark</h2>
<p>Forms often ask for your address, date of birth, tax or bank details. Here the form is filled in your browser and never uploaded, so your answers stay on your device. To add a signature, open the result in <a href="/sign-pdf">Sign PDF</a>.</p>

<h2>Flattening Answers Before Emailing Contracts or Visas</h2>
<p>Sending an unflattened fillable form lets recipients accidentally erase fields or trigger missing-font boxes in older macOS Preview readers. Flattening renders typed answers directly onto page geometry so every court clerk and HR portal sees identical numbers.</p>
EOT_TF,
    'faqs' => [
        ['How do I fill in a PDF form for free?', 'Open the PDF here, type your answers in the list of fields, check the preview and download. It is free with no sign-up or watermark.'],
        ['Why does my PDF have no fields?', 'The form is flat, for example a scan or a PDF printed from Word. Use Edit PDF to type anywhere on the page.'],
        ['What does flattening a PDF form mean?', 'It turns the answers into normal page content, so they look the same in every app and can no longer be changed.'],
        ['Can I sign the form too?', 'Yes. Download the filled form and open it in Sign PDF to draw, type or upload your signature.'],
        ['Is my form uploaded?', 'No. The form is filled in your browser and never leaves your device.'],
    ],
];
