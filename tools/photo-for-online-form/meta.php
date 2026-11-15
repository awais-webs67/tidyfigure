<?php
return [
    'name' => 'Photo for Online Form',
    'updated' => '2026-11-15',
    'category' => 'image',
    'order' => 9,
    'files' => true,
    'use' => 'resize-image-to-kb',
    'preset' => [
        'w' => 200,
        'h' => 230,
        'min' => 20,
        'max' => 50,
        'clean' => false,
    ],
    'icon' => 'user-round',
    'keywords' => 'photo for online form, resize passport photo 200x230 20kb 50kb, exam portal photo converter, job application photo',
    'aka' => ['Exam & Admission Form Photo Tool', '200x230px Portal Photo Resizer'],
    'short' => 'Resize your photo to the size online application forms ask for, like 200×230 px and 20–50 KB.',
    'title' => 'Photo for Online Form – 200×230 px, 20–50 KB',
    'description' => 'Prepare exam, job and admission passport photos at exact portal pixels (like 200×230 or 213×213) and strict 20–50 KB JPG limits cleanly locally.',
    'related' => ['signature-resizer', 'passport-photo-maker', 'resize-image-to-kb'],
    'answer' => 'Choose a clear photo of your face and it\'s <strong>cropped and resized to 200 × 230 pixels</strong> and saved as a JPG <strong>between 20 and 50 KB</strong>, a size many application forms use. If your form gives other numbers, type them in. Then download the photo and upload it.',
    'article' => <<<'EOT_TF'
<h2>How to resize your photo for an application form</h2>
<ol>
<li>Choose a recent photo with your face clearly visible, ideally against a plain light background.</li>
<li>The size is already set to 200 × 230 pixels and 20–50 KB. Change the numbers if your form's instructions say something else.</li>
<li>The photo is cropped to that shape from the middle. Choose Fit inside if you'd rather keep the whole photo with white edges.</li>
<li>Download the JPG and upload it to the form.</li>
</ol>

<h2>Read the instructions carefully</h2>
<p>Each form sets its own rules for the photo: the size in pixels (or in centimetres), the file size in KB with a minimum and a maximum, the file type (usually JPG), and sometimes the background colour or how recent the photo must be. Sizes like 200 × 230 pixels at 20–50 KB are common, but rules differ and change, so always check the latest notice and enter its numbers here.</p>

<h2>Getting the background right</h2>
<p>Many forms want a white or light background. If yours is busy, make it white first with the <a href="/white-background-maker">White Background Maker</a>, then resize the result here. For passport and visa photos with official head-size rules, use the <a href="/passport-photo-maker">Passport Photo Maker</a> instead.</p>

<h2>Your signature too</h2>
<p>Most forms that ask for a photo also ask for a signature, often 140 × 60 pixels at 10–20 KB: use the <a href="/signature-resizer">Signature Resizer</a>. Both run in your browser, so your photo and signature are never uploaded anywhere except the form you choose.</p>

<h2>Common Exam &amp; Recruitment Portal Rules (SSC, UPSC, IBPS, NTS)</h2>
<p>Check three numbers before clicking export: required file format (almost always baseline <code>.jpg</code>/<code>.jpeg</code>), exact minimum-to-maximum KB range (often 20 KB–50 KB or 10 KB–100 KB), and pixel aspect ratio (typically 3.5×4.5 cm portrait or square). Cropping tight around head and shoulders first keeps faces clear even at 20 KB.</p>

<h2>Quick Pre-Upload Checklist Before Portal Submission</h2>
<p>Ensure both ears and eyes stay clearly visible with neutral facial expression against a light uncluttered wall, verify JPG file extension (not HEIC or WebP), and confirm both KB weight and pixel aspect match the exam admit-card brochure.</p>
EOT_TF,
    'faqs' => [
        ['How do I resize my photo to 20–50 KB for a form?', 'Choose your photo here: it is resized to 200×230 pixels and saved as a JPG between 20 and 50 KB. Enter different numbers if your form asks for them.'],
        ['My form gives the size in centimetres. What do I enter?', 'Forms that give centimetres usually also give pixels; use those. If not, multiply the centimetres by about 79 for 200 dpi (3.5 cm ≈ 276 pixels).'],
        ['Can I make the background white?', 'Yes. Use the White Background Maker first, then resize the result here.'],
        ['Is my photo uploaded?', 'No. It is resized in your browser and never leaves your device.'],
        ['Why do exam sites reject photos taken from WhatsApp or screenshots?', 'Screenshots carry weird margins and mismatched pixel dimensions; cropping cleanly and targeting exact portal pixels avoids automated rejection errors.'],
    ],
];
