<?php
// Image Color Picker: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Image Color Picker',
  'category' => 'image',
  'order' => 10,
  'icon' => 'pipette',
  'keywords' => 'color picker from image get hex code from picture eyedropper palette extractor',
  'short' => 'Pick any colour from a photo and get its HEX, RGB and a colour palette.',
  'title' => 'Image Color Picker: Get HEX & RGB Codes From a Photo',
  'description' => <<<'EOT_TF'
Pick colours from any image to get HEX, RGB and HSL codes, with a pixel magnifier. Also extracts the main colour palette from the picture. Free, no upload.
EOT_TF,
  'related' => ['color-converter', 'photo-editor', 'favicon-generator'],
  'answer' => <<<'EOT_TF'
Open an image and move over it (or tap on a phone) to read the exact colour under the cursor as <strong>HEX, RGB and HSL</strong>, with a zoomed view to hit the right pixel. Click to lock a colour and copy its code. The tool also pulls out the <strong>main colours</strong> of the image as a ready-made palette.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>Why pick colours from an image?</h2>
<ul>
<li><strong>Match a brand:</strong> find the exact colour of a logo when you don't have the brand guidelines.</li>
<li><strong>Design from a photo:</strong> build a website, slide deck or Instagram theme around colours from a picture you love.</li>
<li><strong>Paint and decor:</strong> get the colour of a room photo to compare with paint charts.</li>
<li><strong>Development:</strong> copy colours from a mock-up screenshot into CSS.</li>
</ul>

<h2>How to use it</h2>
<ol>
<li>Open an image (screenshots work too).</li>
<li>Move the pointer across it; the swatch, magnifier and codes update live. On a phone, tap the spot.</li>
<li>Click to lock the colour, then copy the HEX, RGB or HSL value.</li>
<li>Tap any colour in the palette to copy its HEX code.</li>
</ol>

<h2>How the palette is made</h2>
<p>The image is shrunk and every pixel is sorted into one of 4,096 colour groups. The most common groups become candidates, and colours that are too similar to one already chosen are skipped, giving up to eight distinct main colours. It's a quick way to get a balanced palette rather than eight shades of the same sky.</p>

<h2>Getting accurate colours</h2>
<ul>
<li><strong>Use the magnifier.</strong> Photos are full of subtle variation; edges are often blended with neighbouring colours. Aim for the centre of a flat area.</li>
<li><strong>Screenshots beat photos</strong> for digital colours like logos and app interfaces: photos add lighting, shadows and compression artefacts.</li>
<li><strong>Colours vary by screen.</strong> The code is exactly what's in the file, but different displays show it slightly differently, and printed colours differ again.</li>
</ul>

<h2>Next steps</h2>
<p>Paste a code into the Color Converter to get CMYK values for print, check text contrast for accessibility, and generate lighter and darker shades.</p>

<h2>Private by design</h2>
<p>The image is read in your browser and never uploaded.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I get the HEX code of a colour in an image?',
      'Open the image, click the colour you want, and copy the HEX value shown.',
    ],
    [
      'Can I pick colours from a screenshot?',
      'Yes. Screenshots give the most accurate colours for logos, websites and apps.',
    ],
    [
      'How do I find the main colours of a picture?',
      'Open it here. Up to eight distinct main colours appear under “Main colours”; tap one to copy it.',
    ],
    ['Does it work on phones?', 'Yes. Tap on the image to pick a colour.'],
    ['Is my image uploaded?', 'No. Everything happens in your browser.'],
  ],
];
