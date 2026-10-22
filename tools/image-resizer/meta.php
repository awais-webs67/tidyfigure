<?php
// Image Resizer: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Image Resizer',
  'category' => 'image',
  'order' => 2,
  'icon' => 'scaling',
  'popular' => true,
  'files' => true,
  'keywords' => 'resize photo pixels dimensions instagram crop scale picture',
  'short' => 'Resize photos to exact pixels or a percentage, with Instagram and YouTube presets.',
  'title' => 'Image Resizer: Resize Photos to Any Size in Pixels, Free',
  'description' => <<<'EOT_TF'
Resize JPG, PNG and WebP images to exact pixel sizes or by percentage. Presets for Instagram, Facebook and YouTube, batch resize, no upload needed.
EOT_TF,
  'related' => ['image-compressor', 'image-converter', 'jpg-to-pdf'],
  'answer' => <<<'EOT_TF'
To resize an image without stretching it, set the width and let the height follow automatically, so the proportions stay the same. For an exact size like <strong>1080 × 1080</strong> for Instagram, the resizer fills the frame and trims the edges evenly (a centre crop) instead of squashing the photo. Everything happens on your device.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>Resize by pixels or by percentage</h2>
<p><strong>By pixels</strong> is for when a website, form or social network asks for a specific size. Type a width, leave the height empty, and the height is calculated to keep the original shape. <strong>By percentage</strong> is quicker when you just want the photo smaller: 50% halves both the width and the height, which leaves a quarter of the pixels.</p>

<h2>Keeping proportions versus cropping</h2>
<p>Every image has an aspect ratio, the relationship between its width and height. A phone photo is usually 4:3, a widescreen video frame 16:9, and an Instagram post 1:1. If you force a 4:3 photo into a 1:1 square, something has to give:</p>
<ul>
<li><strong>Keep proportions on:</strong> the image keeps its shape, and only the width (or height) you typed is guaranteed.</li>
<li><strong>Keep proportions off with both sides set:</strong> the image is scaled until it fills the frame, and the overflow is trimmed equally from both sides. Nothing is stretched or squashed.</li>
</ul>

<h2>Common image sizes</h2>
<div class="scroll"><table class="tbl">
<thead><tr><th>Where it's used</th><th class="n">Size (px)</th><th class="n">Ratio</th></tr></thead>
<tbody>
<tr><td>Instagram square post</td><td class="n">1080 × 1080</td><td class="n">1:1</td></tr>
<tr><td>Instagram portrait post</td><td class="n">1080 × 1350</td><td class="n">4:5</td></tr>
<tr><td>Instagram / TikTok story</td><td class="n">1080 × 1920</td><td class="n">9:16</td></tr>
<tr><td>YouTube thumbnail</td><td class="n">1280 × 720</td><td class="n">16:9</td></tr>
<tr><td>Facebook / LinkedIn link image</td><td class="n">1200 × 630</td><td class="n">1.91:1</td></tr>
<tr><td>Full HD wallpaper</td><td class="n">1920 × 1080</td><td class="n">16:9</td></tr>
</tbody></table></div>
<p>Platforms update their recommendations from time to time, but these sizes have been standard for years and display well everywhere.</p>

<h2>Will resizing reduce quality?</h2>
<p>Making an image smaller keeps it sharp, because you're throwing away pixels you didn't need. Making an image bigger can't add real detail: the browser fills the gaps by blending neighbouring pixels, so an enlarged photo looks softer. As a rule, avoid going above 150–200% of the original size.</p>

<h2>Resizing versus compressing</h2>
<p>Resizing changes the dimensions; compressing changes how efficiently those pixels are stored. Both reduce file size, and they work best together: resize first to the size you'll actually display, then use the image compressor to bring the file size down further.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I resize an image without losing quality?',
      <<<'EOT_TF'
Make it smaller rather than bigger, keep the proportions locked, and save it at high quality. This resizer saves at 92% quality, which keeps photos sharp.
EOT_TF,
    ],
    [
      'How do I resize a photo for Instagram?',
      <<<'EOT_TF'
Click the Instagram square preset for 1080 × 1080, or the portrait preset for 1080 × 1350. The photo fills the frame and is centre-cropped so nothing is stretched.
EOT_TF,
    ],
    [
      'How do I make an image a specific size in KB?',
      <<<'EOT_TF'
Resizing reduces the number of pixels, which shrinks the file. For an exact file-size limit, resize first and then use the Image Compressor to lower the quality until it fits.
EOT_TF,
    ],
    [
      'Can I resize multiple images at once?',
      <<<'EOT_TF'
Yes. Drop several images and they are all resized with the same settings. Download them one by one or all together.
EOT_TF,
    ],
    [
      'Are my photos uploaded?',
      'No. Resizing happens in your browser, and your photos never leave your device.',
    ],
  ],
];
