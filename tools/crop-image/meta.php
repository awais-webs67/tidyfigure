<?php
// Crop Image: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Crop Image',
  'category' => 'image',
  'order' => 4,
  'icon' => 'crop',
  'popular' => true,
  'files' => true,
  'keywords' => 'crop photo online cut picture square crop instagram crop',
  'short' => 'Crop photos freely or to 1:1, 4:5, 16:9 and other social media sizes.',
  'title' => 'Crop Image Online: Free Photo Cropper With Aspect Ratios',
  'description' => <<<'EOT_TF'
Crop images online for free. Drag to select, or lock to 1:1, 4:5, 16:9, 9:16 and more for Instagram, YouTube and stories. Private: no upload, no watermark.
EOT_TF,
  'related' => ['image-resizer', 'rotate-image', 'image-compressor'],
  'answer' => <<<'EOT_TF'
Open a photo, choose a shape (or "Free"), and drag the box over the part you want to keep. Drag a corner to resize it; the rule-of-thirds grid helps you frame the subject. Press <strong>Crop &amp; download</strong> to save at full resolution, with no quality loss beyond the normal save.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>How to crop a picture</h2>
<ol>
<li><strong>Open the image.</strong> JPG, PNG and WebP all work.</li>
<li><strong>Choose an aspect ratio.</strong> "Free" lets you crop any shape; the presets lock the box to standard proportions.</li>
<li><strong>Position the box.</strong> Drag inside it to move it; drag a corner to resize it. Click and drag outside the box to draw a new one.</li>
<li><strong>Download.</strong> The cropped area is saved at the original resolution.</li>
</ol>

<h2>Which aspect ratio to use</h2>
<div class="scroll"><table class="tbl">
<thead><tr><th>Ratio</th><th>Where it's used</th></tr></thead>
<tbody>
<tr><td>1:1</td><td>Instagram square posts, profile pictures, product photos</td></tr>
<tr><td>4:5</td><td>Instagram portrait posts (takes up the most space in the feed)</td></tr>
<tr><td>9:16</td><td>Stories, Reels, TikTok, YouTube Shorts, phone wallpapers</td></tr>
<tr><td>16:9</td><td>YouTube thumbnails, presentations, desktop wallpapers</td></tr>
<tr><td>1.91:1</td><td>Facebook and LinkedIn link previews</td></tr>
<tr><td>4:3 and 3:2</td><td>Standard camera photos and prints (6 × 4 inch is 3:2)</td></tr>
</tbody></table></div>

<h2>Framing tips</h2>
<ul>
<li><strong>Rule of thirds:</strong> place the subject or the horizon on one of the grid lines rather than dead centre. It usually makes a more interesting picture.</li>
<li><strong>Leave space in the direction of movement</strong> or where a person is looking.</li>
<li><strong>Crop out distractions</strong> at the edges: bright objects, half-visible people, clutter.</li>
<li><strong>Don't crop at joints</strong> (wrists, knees, ankles) in portraits; crop between them instead.</li>
<li><strong>Straighten first:</strong> if the horizon is tilted, rotate the image before cropping.</li>
</ul>

<h2>Crop versus resize</h2>
<p>Cropping removes the edges of a picture and keeps the remaining pixels unchanged. Resizing keeps the whole picture but changes how many pixels it has. To get an exact size like 1080 × 1080, crop to 1:1 here, then use the Image Resizer.</p>

<h2>Private by design</h2>
<p>The image is cropped in your browser and never uploaded, which matters for personal photos and screenshots with private information.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I crop a photo to a square?',
      'Choose 1:1 Square, move the box over the part you want, and press Crop & download.',
    ],
    [
      'Does cropping reduce image quality?',
      'No. Cropping keeps the original pixels in the area you choose. The image is simply smaller in size.',
    ],
    [
      'How do I crop for Instagram?',
      'Use 1:1 for square posts, 4:5 for portrait posts, or 9:16 for stories and Reels.',
    ],
    ['Can I crop on my phone?', 'Yes. Drag the box and its corners with your finger.'],
    ['Is my photo uploaded?', 'No. Cropping happens in your browser.'],
  ],
];
