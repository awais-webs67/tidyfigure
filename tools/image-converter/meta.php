<?php
// Image Converter: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Image Converter',
  'updated' => '2026-10-22', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'image',
  'order' => 3,
  'icon' => 'image-play',
  'files' => true,
  'keywords' => 'png to jpg jpg to png webp to jpg webp to png convert format',
  'short' => 'Convert between JPG, PNG and WebP: PNG to JPG, WebP to PNG and more.',
  'title' => 'Image Converter: PNG to JPG, WebP to JPG, JPG to PNG Free',
  'description' => <<<'EOT_TF'
Convert images between JPG, PNG and WebP in your browser. PNG to JPG, WebP to PNG, JPG to WebP and more. Batch convert, no upload, no watermark.
EOT_TF,
  'related' => ['image-compressor', 'image-resizer', 'jpg-to-pdf'],
  'answer' => <<<'EOT_TF'
To convert an image, open it and save it again in the new format. Use <strong>JPG</strong> for photos you want to share anywhere, <strong>PNG</strong> for screenshots, logos and anything with transparency, and <strong>WebP</strong> for the smallest files on websites. Drop images into the tool below to convert them on your device in seconds.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>Which format should you choose?</h2>
<div class="scroll"><table class="tbl">
<thead><tr><th>Format</th><th>Best for</th><th>Transparency</th><th>File size</th></tr></thead>
<tbody>
<tr><td>JPG</td><td>Photos, sharing, email, upload forms</td><td>No</td><td>Small</td></tr>
<tr><td>PNG</td><td>Screenshots, logos, text, graphics</td><td>Yes</td><td>Large for photos</td></tr>
<tr><td>WebP</td><td>Websites, apps, modern browsers</td><td>Yes</td><td>Smallest</td></tr>
</tbody></table></div>

<h2>Common conversions</h2>
<h3>PNG to JPG</h3>
<p>The most common conversion. A photo saved as PNG can be five to ten times larger than the same photo as a JPG. Converting to JPG makes it small enough to email or upload. JPG has no transparency, so transparent areas are filled with the background colour you choose (white by default).</p>
<h3>WebP to JPG or PNG</h3>
<p>Many websites now serve images as WebP. When you save one, older apps, some photo editors and many upload forms won't accept it. Converting WebP to JPG (for photos) or PNG (for graphics with transparency) fixes that.</p>
<h3>JPG to PNG</h3>
<p>Useful when a program only accepts PNG or when you want to edit an image without losing more quality each time you save. Note that it won't restore detail the JPG already lost, and the file will be bigger.</p>
<h3>JPG or PNG to WebP</h3>
<p>For a website, WebP usually cuts image weight by 25–35% compared with JPG at the same visual quality, which makes pages load faster and can help search rankings.</p>

<h2>About quality</h2>
<p>JPG and WebP are "lossy": they save space by discarding detail. At 90% quality (the default here) the result is practically identical to the original. PNG is lossless, so it has no quality setting.</p>

<h2>Private by design</h2>
<p>Your images are converted by your own browser. They're never uploaded, which makes this safe for personal photos, IDs and work documents, and it keeps working even on a slow connection once the page has loaded.</p>

<h2>HEIC photos from iPhone</h2>
<p>iPhones save photos as HEIC by default. Only Safari can open HEIC files directly, so on other browsers you may see an error. On the iPhone, go to Settings → Camera → Formats and choose "Most Compatible" to save new photos as JPG.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I convert PNG to JPG?',
      <<<'EOT_TF'
Drop your PNG files into the tool, choose JPG, and download. Transparent parts are filled with white unless you pick another background colour.
EOT_TF,
    ],
    [
      'How do I convert WebP to JPG?',
      <<<'EOT_TF'
Drop the WebP image, choose JPG and download the result. It opens in every app and upload form that accepts JPG.
EOT_TF,
    ],
    [
      'Does converting an image reduce quality?',
      <<<'EOT_TF'
Converting to PNG doesn’t lose any more quality. Converting to JPG or WebP at 90% quality loses a tiny amount of detail that is very hard to see.
EOT_TF,
    ],
    [
      'Can I convert several images at once?',
      'Yes. Drop as many images as you like and they will all be converted to the format you choose.',
    ],
    [
      'Is it safe to convert private photos here?',
      'Yes. Conversion happens in your browser and the files are never uploaded to a server.',
    ],
  ],
];
