<?php
// Photo Editor: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Photo Editor',
  'category' => 'image',
  'order' => 6,
  'icon' => 'sliders-horizontal',
  'popular' => true,
  'files' => true,
  'keywords' => 'photo filters brightness contrast black and white vintage edit picture online',
  'short' => 'Adjust brightness, contrast, colour and warmth, or apply one-tap filters.',
  'title' => 'Free Online Photo Editor: Filters, Brightness & Contrast',
  'description' => <<<'EOT_TF'
Edit photos online: brightness, contrast, saturation, warmth, black & white, vintage, blur and vignette. One-tap filters, before/after compare, no upload.
EOT_TF,
  'related' => ['crop-image', 'add-watermark-to-image', 'image-compressor'],
  'answer' => <<<'EOT_TF'
Open a photo and use the sliders to fix <strong>brightness, contrast, saturation and warmth</strong>, or tap a filter like Vivid, Black &amp; white or Vintage as a starting point. Hold "compare" to see the original. The edited photo downloads at full resolution, and everything runs on your device.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>What each adjustment does</h2>
<ul>
<li><strong>Brightness</strong> lightens or darkens the whole picture. Use it for photos that are under- or over-exposed.</li>
<li><strong>Contrast</strong> pushes darks darker and lights lighter. A little more contrast adds punch; less gives a soft, faded look.</li>
<li><strong>Saturation</strong> controls how intense the colours are. 0% is black and white; above 100% makes colours more vivid.</li>
<li><strong>Warmth</strong> shifts colours towards orange (warm, golden-hour feel) or blue (cool, crisp feel). It's a quick fix for photos taken under yellow indoor lights.</li>
<li><strong>Hue</strong> rotates every colour around the colour wheel. Small changes correct colour casts; big ones are a creative effect.</li>
<li><strong>Sepia</strong> adds the brown tone of old photographs.</li>
<li><strong>Black &amp; white</strong> removes colour, gradually or completely.</li>
<li><strong>Blur</strong> softens the image, useful for backgrounds and placeholders.</li>
<li><strong>Vignette</strong> darkens the edges to draw attention to the centre.</li>
</ul>

<h2>A simple editing order</h2>
<ol>
<li>Fix brightness first, so the subject is clearly visible.</li>
<li>Add a little contrast (105–120%).</li>
<li>Correct the colour with warmth if the photo looks too orange or too blue.</li>
<li>Adjust saturation last, and go easy: over-saturated skin looks unnatural.</li>
<li>Hold "compare" to check you've improved the photo rather than just changed it.</li>
</ol>

<h2>Filters</h2>
<p>The one-tap filters set the sliders to a combination you can then fine-tune. <strong>Vivid</strong> suits landscapes and food, <strong>Black &amp; white</strong> suits portraits and architecture, <strong>Vintage</strong> and <strong>Faded</strong> give a film look, and <strong>Dramatic</strong> adds contrast and a vignette for moody shots.</p>

<h2>Quality and privacy</h2>
<p>Edits are applied to the full-resolution image when you download, not just the preview. JPG photos are saved at 92% quality; PNG and WebP keep their format. All processing happens in your browser, so your photos are never uploaded.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I brighten a dark photo?',
      <<<'EOT_TF'
Raise Brightness until the subject is clear, then add a little Contrast so it doesn’t look washed out.
EOT_TF,
    ],
    [
      'How do I make a photo black and white?',
      'Tap the Black & white filter, or move the Black & white slider to 100%.',
    ],
    [
      'How do I fix a yellow indoor photo?',
      'Move the Warmth slider to the left (cooler) until whites look neutral.',
    ],
    [
      'Will editing reduce the resolution?',
      'No. The download is the full original size with your edits applied.',
    ],
    ['Are my photos uploaded?', 'No. Editing happens on your device.'],
  ],
];
