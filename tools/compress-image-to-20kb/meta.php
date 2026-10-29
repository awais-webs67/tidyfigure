<?php
// Compress Image to 20 KB: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Compress Image to 20 KB',
  'updated' => '2026-10-29', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'image',
  'order' => 5,
  'files' => true,
  'use' => 'resize-image-to-kb',
  'preset' => json_decode('{"max": 20, "min": "", "w": "", "h": ""}', true),
  'icon' => 'image-down',
  'keywords' => 'compress image to 20kb reduce photo size to 20 kb jpg under 20kb resize image 20kb online passport photo 20kb exam form photo 20kb',
  'aka' => ['reduce image to 20KB', 'photo under 20 KB', 'JPG 20KB converter'], // other names people search for
  'short' => 'Make any photo smaller than 20 KB in one step, as sharp as that size allows.',
  'title' => 'Compress Image to 20 KB Online: JPG Under 20KB, Free',
  'description' => <<<'EOT_TF'
Reduce a photo to under 20 KB in one click: the sharpest JPG that fits, with exact pixels if your form needs them. Free, instant, nothing uploaded.
EOT_TF,
  'related' => ['resize-image-to-kb', 'image-compressor', 'photo-for-online-form'],
  'answer' => <<<'EOT_TF'
Choose your photo and it's saved as a JPG <strong>under 20 KB</strong> straight away. The tool tries different compression levels and picks the sharpest one that fits; a huge phone photo is also reduced in pixels so it stays clear. If your form gives exact pixels or a minimum size, type them in too.
EOT_TF,
  'article' => <<<'EOT_TF'
<h2>How to compress an image to 20 KB</h2>
<ol>
<li>Choose or drop your photo. The maximum is already set to 20 KB.</li>
<li>If the form asks for exact pixels (for example 200 × 230) or a minimum size, enter those as well.</li>
<li>Check the size shown under the preview and download the JPG.</li>
</ol>

<h2>Where a 20 KB limit comes up</h2>
<p>A 20 KB limit is common on exam, admission and recruitment portals for the candidate's photo, and for small profile pictures. It is one of the tightest limits, so the photo has to be quite small in pixels as well.</p>
<p>Most of these sites only accept JPG files. A photo straight from a phone is usually 2 to 5 MB, so it has to shrink a lot, and that's easiest when the pixels shrink too: a photo of about 378 by 473 pixels can be stored in 20 KB at good quality, while squeezing all 12 megapixels into 20 KB would make it blotchy.</p>

<h2>Sharpest result that fits</h2>
<p>Instead of one fixed setting, the tool tries the compression quality step by step and keeps the highest one that stays under 20 KB. The size you see is the size of the file you download, measured exactly, so the upload won't be rejected for being a few bytes over.</p>

<h2>Other sizes</h2>
<p>Need a different limit, a minimum size, or a signature? Use <a href="/resize-image-to-kb">Resize Image to KB</a> to enter any numbers, or the <a href="/signature-resizer">Signature Resizer</a> for 10–20 KB signatures.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I reduce a photo to 20 KB?',
      <<<'EOT_TF'
Choose the photo here. It is saved as a JPG under 20 KB automatically, at the best quality that fits. Download it and upload it to your form.
EOT_TF,
    ],
    [
      'Will my photo look bad at 20 KB?',
      <<<'EOT_TF'
The pixels are reduced to a sensible size first, so the photo stays clear. At 20 KB a face or document photo looks good on screen.
EOT_TF,
    ],
    [
      'Can I set exact pixels too?',
      <<<'EOT_TF'
Yes. Type the width and height the form asks for and the photo is cropped and resized to exactly that, then compressed under the limit.
EOT_TF,
    ],
    [
      'Is my photo uploaded?',
      <<<'EOT_TF'
No. The photo is compressed in your browser and never leaves your device.
EOT_TF,
    ],
  ],
];
