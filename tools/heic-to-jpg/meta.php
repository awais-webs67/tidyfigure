<?php
// HEIC to JPG Converter: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'HEIC to JPG Converter',
  'updated' => '2026-10-29', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'image',
  'order' => 3,
  'icon' => 'image',
  'popular' => true,
  'files' => true,
  'libs' => ['vendor/heic2any-0.0.4.min.js'],
  'appCategory' => 'MultimediaApplication',
  'keywords' => 'heic to jpg converter iphone photo heic to png heif to jpg convert heic online free batch windows open heic',
  'aka' => ['HEIC converter', 'iPhone photo to JPG', 'HEIC to JPEG'], // other names people search for
  'short' => 'Convert iPhone HEIC photos to JPG or PNG in bulk, with a preview of each.',
  'title' => 'HEIC to JPG Converter: Convert iPhone Photos Free, in Bulk',
  'description' => 'Convert iPhone HEIC and HEIF photos to JPG or PNG in your browser. Batch convert, preview every photo, choose the quality. No upload, no sign-up.',
  'related' => ['image-converter', 'image-compressor', 'image-metadata-remover'],
  'answer' => <<<'EOT_TF'
To convert HEIC to JPG, drop your iPhone photos below, check the previews, and download them as JPG (or PNG). You can convert many at once. HEIC is the format iPhones save photos in by default; JPG opens on every computer, phone and website. The conversion happens <strong>on your device</strong>, so private photos aren’t uploaded.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>What is a HEIC file?</h2>
<p>Since iOS 11, iPhones and iPads save photos as <strong>HEIC</strong> (High Efficiency Image Container), based on the HEIF standard. HEIC files are about half the size of a JPG of the same quality, which saves storage. The catch is compatibility: many Windows programs, older Android phones, websites, printing services and online forms can't open them. Converting to JPG solves that.</p>

<h2>How to convert HEIC to JPG</h2>
<ol>
<li>Drop the .heic files into the box, or tap to choose them. You can select many at once.</li>
<li>Choose JPG (smaller, works everywhere) or PNG (lossless, larger files).</li>
<li>Check the previews, then download each photo, or press <strong>Download all</strong>.</li>
</ol>

<h2>JPG or PNG?</h2>
<div class="scroll"><table class="tbl">
<thead><tr><th></th><th>JPG</th><th>PNG</th></tr></thead>
<tbody>
<tr><td>File size (12 MP photo)</td><td>About 2–4 MB at 90%</td><td>About 15–25 MB</td></tr>
<tr><td>Quality</td><td>Visually identical at 85–95%</td><td>Exact, no compression loss</td></tr>
<tr><td>Best for</td><td>Sharing, email, websites, printing</td><td>Editing in design software</td></tr>
</tbody></table></div>
<p>For almost everyone, JPG at 90% is the right choice.</p>

<h2>Stop your iPhone saving HEIC</h2>
<p>If you'd rather your iPhone took JPG photos from now on, open <strong>Settings → Camera → Formats</strong> and choose <strong>Most Compatible</strong>. Photos will take more space. Alternatively, keep HEIC for storage and let the iPhone convert automatically when sharing: <strong>Settings → Photos → Transfer to Mac or PC → Automatic</strong> converts photos when you copy them to a computer by cable.</p>

<h2>Privacy: location data</h2>
<p>iPhone photos usually contain hidden details such as the GPS location where they were taken. The converted JPGs here don't carry that information over, which makes them safer to share publicly. To check or remove metadata from other photos, use the <a href="/image-metadata-remover">image metadata remover</a>.</p>

<h2>Live Photos and bursts</h2>
<p>A HEIC file can hold more than one image, for example from a burst or a Live Photo. The converter saves the main (first) image.</p>
EOT_TF,
  'faqs' => [
    ['How do I convert HEIC to JPG on Windows?', 'Open this page in any browser, drop the HEIC files in, and download the JPGs. Nothing needs installing.'],
    ['Can I convert many HEIC photos at once?', 'Yes. Select as many as you like; each is converted and previewed, and Download all saves them together.'],
    ['Does converting reduce quality?', 'At 90% JPG quality the difference is invisible. Choose PNG if you need a lossless copy.'],
    ['Are my photos uploaded?', 'No. The conversion runs in your browser on your own device.'],
    ['Why won’t some HEIC files convert?', 'A few unusual HEIC variants (some from non-Apple cameras) aren’t supported. The tool tells you which files failed.'],
  ],
];
