<?php
// Add Watermark to Image: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Add Watermark to Image',
  'updated' => '2026-10-22', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'image',
  'order' => 7,
  'icon' => 'copyright',
  'files' => true,
  'keywords' => 'watermark photos batch watermark logo copyright text on image protect photos',
  'short' => 'Add your name, © notice or logo to one photo or a whole batch.',
  'title' => 'Add Watermark to Photos: Text or Logo, Batch, Free',
  'description' => <<<'EOT_TF'
Watermark photos with text or your logo. Choose position, size and opacity, or tile it across the image. Batch-watermark many photos at once. No upload.
EOT_TF,
  'related' => ['photo-editor', 'image-compressor', 'watermark-pdf'],
  'answer' => <<<'EOT_TF'
Type your name or "© 2026 Your Brand" (or upload a logo), pick a corner, and set the size and opacity. Drop several photos to watermark them <strong>all at once</strong> with identical settings. The shadow option keeps the mark readable on both bright and dark photos.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>Why watermark your photos?</h2>
<p>Photos posted online get copied, reposted and used in ads without permission. A visible watermark doesn't make copying impossible, but it credits you wherever the image travels, discourages casual reuse, and makes it obvious when someone has removed it. Photographers, artists, online sellers and real-estate agents use watermarks routinely.</p>

<h2>Text or logo?</h2>
<ul>
<li><strong>Text</strong> is quick and flexible: your name, website, Instagram handle or a copyright notice like "© 2026 Jane Example".</li>
<li><strong>Logo</strong> looks more professional for businesses. Use a PNG with a transparent background so only the logo appears, not a white box.</li>
</ul>

<h2>Choosing position, size and opacity</h2>
<ul>
<li><strong>Corner placement</strong> (bottom right is most common) credits you without spoiling the picture.</li>
<li><strong>Centre placement</strong> is harder to crop out; good for proofs you send to clients before payment.</li>
<li><strong>Tiled</strong> repeats the mark across the whole image, the strongest protection for previews and stock-style samples.</li>
<li><strong>Size:</strong> 4–6% of the image's shorter side is readable on phones without dominating.</li>
<li><strong>Opacity:</strong> 50–70% for corner marks; 20–35% for centre and tiled marks.</li>
</ul>

<h2>Batch watermarking</h2>
<p>Drop a whole set of photos, such as a product range or an event gallery, and the same watermark is added to each one. Sizes are calculated relative to each photo, so portrait and landscape images get a consistent look. Each photo downloads in its original format and full resolution.</p>

<h2>Is it legal to watermark photos?</h2>
<p>You can watermark any photo you own or have the rights to. You own the copyright to photos you take, whether or not they carry a watermark; the watermark simply reminds people. Never remove someone else's watermark: in many countries that's illegal on its own.</p>

<h2>Private by design</h2>
<p>Watermarking runs in your browser. Your photos and logo are never uploaded.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I watermark many photos at once?',
      <<<'EOT_TF'
Drop all the photos at once, set your watermark, and press Download all. Every photo gets the same watermark.
EOT_TF,
    ],
    [
      'How do I add a logo watermark?',
      'Choose Logo image and upload your logo, ideally a PNG with a transparent background.',
    ],
    [
      'Where should a watermark go?',
      'A corner is least distracting. The centre or a tiled pattern is harder to crop out.',
    ],
    [
      'Does watermarking reduce photo quality?',
      'No. Photos are saved at full resolution; JPG photos at 92% quality.',
    ],
    ['Are my photos uploaded?', 'No. Watermarking happens on your device.'],
  ],
];
