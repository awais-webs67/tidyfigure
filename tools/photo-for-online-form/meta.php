<?php
// Photo for Online Form: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Photo for Online Form',
  'updated' => '2026-10-29', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'image',
  'order' => 9,
  'files' => true,
  'use' => 'resize-image-to-kb',
  'preset' => json_decode('{"w": 200, "h": 230, "min": 20, "max": 50, "clean": false}', true),
  'icon' => 'user-round',
  'keywords' => 'resize photo for online form 200x230 20kb 50kb photo for exam form job application photo size reducer candidate photo upload',
  'aka' => ['candidate photo resizer', 'exam form photo', 'photo 200x230 20-50KB'], // other names people search for
  'short' => 'Resize your photo to the size online application forms ask for, like 200×230 px and 20–50 KB.',
  'title' => 'Photo for Online Form: Resize to 200×230 px, 20–50 KB',
  'description' => <<<'EOT_TF'
Resize your photo for exam, job and admission forms: exact pixels like 200×230 and a size of 20–50 KB, saved as JPG. Free, instant, and nothing is uploaded.
EOT_TF,
  'related' => ['signature-resizer', 'passport-photo-maker', 'resize-image-to-kb'],
  'answer' => <<<'EOT_TF'
Choose a clear photo of your face and it's <strong>cropped and resized to 200 × 230 pixels</strong> and saved as a JPG <strong>between 20 and 50 KB</strong>, a size many application forms use. If your form gives other numbers, type them in. Then download the photo and upload it.
EOT_TF,
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
EOT_TF,
  'faqs' => [
    [
      'How do I resize my photo to 20–50 KB for a form?',
      <<<'EOT_TF'
Choose your photo here: it is resized to 200×230 pixels and saved as a JPG between 20 and 50 KB. Enter different numbers if your form asks for them.
EOT_TF,
    ],
    [
      'My form gives the size in centimetres. What do I enter?',
      <<<'EOT_TF'
Forms that give centimetres usually also give pixels; use those. If not, multiply the centimetres by about 79 for 200 dpi (3.5 cm ≈ 276 pixels).
EOT_TF,
    ],
    [
      'Can I make the background white?',
      <<<'EOT_TF'
Yes. Use the White Background Maker first, then resize the result here.
EOT_TF,
    ],
    [
      'Is my photo uploaded?',
      <<<'EOT_TF'
No. It is resized in your browser and never leaves your device.
EOT_TF,
    ],
  ],
];
