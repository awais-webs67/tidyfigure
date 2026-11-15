<?php
return [
    'name' => 'Redact PDF',
    'updated' => '2026-11-15',
    'category' => 'pdf',
    'order' => 17,
    'files' => true,
    'libs' => [
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js',
    ],
    'scripts' => ['pdf-engine.js'],
    'icon' => 'square-dashed',
    'keywords' => 'redact pdf online free, permanently blackout text in pdf, remove confidential data pdf no upload',
    'aka' => ['Permanent PDF Redactor', 'Sanitise Confidential PDF Text'],
    'short' => 'Black out names, numbers and other private details in a PDF so they can’t be read, copied or recovered.',
    'title' => 'Redact PDF Online Free – Black Out Permanently',
    'description' => 'Permanently scrub names, SSNs, emails, phone numbers and confidential clauses out of PDF layers—not merely hidden under black boxes—locally.',
    'related' => ['edit-pdf', 'pdf-metadata-remover', 'protect-pdf'],
    'answer' => 'To redact a PDF, open it and <strong>drag black boxes</strong> over anything private, or type a word and press <strong>Find &amp; mark</strong> to mark every place it appears (there are quick finds for emails, phone numbers and long numbers). Press <strong>Redact PDF</strong>: the text under the boxes is <strong>deleted from the file</strong>, not just covered, and the result is checked before you download it.',
    'article' => <<<'EOT_TF'
<h2>How to redact a PDF</h2>
<ol>
<li>Drop your PDF in the box, or try the sample.</li>
<li>Drag over anything you want to hide to draw a black box. Use the arrows to go through the pages; tap a box's × to remove it.</li>
<li>To hide a name or number everywhere, type it and press <strong>Find &amp; mark</strong>, or use a quick find for email addresses, phone numbers or long numbers such as card, account and ID numbers.</li>
<li>Press <strong>Redact PDF</strong>, look at the preview and the check result, then download.</li>
</ol>

<h2>Real redaction, not just a black box</h2>
<p>Drawing a black rectangle over text in most PDF editors only <em>covers</em> it: the words are still in the file, and anyone can select, copy or search them, or simply delete the box. Many leaked "redacted" court papers and reports were redacted that way.</p>
<p>This tool removes the letters under each box from the PDF itself, then draws the black box. Where a box covers part of a picture or a scanned page, that whole page is turned into an image with the box burned in, so nothing stays underneath. The document's hidden properties (author, title, software) are removed too.</p>
<p>After redacting, the tool opens the new file again and searches it for the text you marked, so you can see that none of it is left before you download.</p>

<h2>What to redact</h2>
<ul>
<li>Names, addresses, dates of birth and signatures.</li>
<li>Bank, card, passport, national insurance and account numbers.</li>
<li>Email addresses and phone numbers.</li>
<li>Salaries, prices and other figures in contracts or bids.</li>
<li>Medical and legal details before sharing a document.</li>
</ul>

<h2>Private by design</h2>
<p>A document you need to redact is, by definition, sensitive. That's why this tool runs entirely in your browser: the PDF is never uploaded, stored or seen by anyone else.</p>
EOT_TF,
    'faqs' => [
        ['How do I redact a PDF for free?', 'Open it here, drag boxes over what you want to hide or use Find & mark, then press Redact PDF and download. It is free with no sign-up.'],
        ['Is the redacted text really removed?', 'Yes. The letters under each box are deleted from the PDF, not covered. Pages where a box covers part of an image are turned into images with the box burned in. The tool then searches the new file to confirm the text is gone.'],
        ['Can I black out every place a name appears?', 'Yes. Type the name and press Find & mark. Every match on every page is marked, and you can remove any box you don’t want before redacting.'],
        ['Does it work on scanned PDFs?', 'Yes. Draw boxes over the parts to hide; scanned pages with boxes are turned into new images with the boxes burned in. Find & mark needs real text, so it doesn’t find words in a scan.'],
        ['Is my PDF uploaded?', 'No. Everything happens in your browser and the file never leaves your device.'],
    ],
];
