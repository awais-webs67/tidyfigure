<?php
// Signature Resizer: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Signature Resizer',
  'updated' => '2026-10-29', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'image',
  'order' => 8,
  'files' => true,
  'use' => 'resize-image-to-kb',
  'preset' => json_decode('{"w": 140, "h": 60, "min": 10, "max": 20, "clean": true}', true),
  'icon' => 'pen-line',
  'keywords' => 'signature resize online 10kb 20kb signature size reducer resize signature for online form 140x60 signature jpg exam form signature',
  'aka' => ['resize signature to 20KB', 'signature size reducer', 'signature for online form'], // other names people search for
  'short' => 'Turn a photo of your signature into a clean JPG of the size online forms ask for, like 140×60 px and 10–20 KB.',
  'title' => 'Signature Resizer: 10–20 KB, 140×60 px for Online Forms',
  'description' => <<<'EOT_TF'
Resize your signature for online forms: clean white background, dark ink, exact pixels such as 140×60 and 10–20 KB, saved as JPG. Free and private, no upload.
EOT_TF,
  'related' => ['resize-image-to-kb', 'photo-for-online-form', 'signature-generator'],
  'answer' => <<<'EOT_TF'
Sign on white paper, take a photo and choose it here. The signature is <strong>cleaned up</strong> (white background, dark ink), cropped and resized to <strong>140 × 60 pixels at 10–20 KB</strong>, a size many application forms use. Change the numbers if your form asks for something else, then download the JPG.
EOT_TF,
  'article' => <<<'EOT_TF'
<h2>How to resize a signature for an online form</h2>
<ol>
<li>Sign on plain white paper with a black or blue pen, a little bigger than usual.</li>
<li>Take a photo from straight above in good light, then crop it close around the signature with your phone's editor (or here, with Crop to fill).</li>
<li>Choose the photo here. Clean signature is already on, and the size is set to 140 × 60 pixels and 10–20 KB.</li>
<li>Check the preview and download the JPG.</li>
</ol>

<h2>Why the clean-up matters</h2>
<p>Forms often reject signatures that look grey, shadowy or blurred. A phone photo of white paper is rarely white: it's grey or yellowish, with a shadow in one corner. Clean signature finds the paper and makes it pure white, and makes the ink darker, so the signature looks like a proper scan even at 140 × 60 pixels.</p>

<h2>About the 10 KB minimum</h2>
<p>A tiny, mostly white picture compresses so well that it often comes out at only 3 or 4 KB, and forms with a minimum of 10 KB reject it. The tool first saves it at the highest quality, and if it's still below the minimum, adds harmless padding inside the JPG file so it reaches 10 KB. The signature itself doesn't change.</p>

<h2>Other sizes and a typed signature</h2>
<p>Forms differ, so check yours: type its width, height and KB limits into the boxes. If you don't have a signature on paper, draw or type one with the <a href="/signature-generator">Signature Generator</a>, then resize it here. For the photo on the same form, use <a href="/photo-for-online-form">Photo for Online Form</a>.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I make my signature 10–20 KB?',
      <<<'EOT_TF'
Choose a photo of your signature here: it is cleaned up, resized to 140×60 pixels and saved as a JPG between 10 and 20 KB. Change the numbers if your form asks for different ones.
EOT_TF,
    ],
    [
      'Why is my signature rejected for being too small in KB?',
      <<<'EOT_TF'
Small, mostly white images compress to very few KB. This tool saves at high quality and adds harmless padding so the file meets the minimum size.
EOT_TF,
    ],
    [
      'Can I use a blue pen?',
      <<<'EOT_TF'
Yes. Clean signature turns the paper white and the ink dark; untick it if the form wants the original colour.
EOT_TF,
    ],
    [
      'Is my signature uploaded?',
      <<<'EOT_TF'
No. It is processed in your browser and never leaves your device.
EOT_TF,
    ],
  ],
];
