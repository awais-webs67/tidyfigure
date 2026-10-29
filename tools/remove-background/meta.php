<?php
// Background Remover (AI): page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Background Remover',
  'category' => 'image',
  'order' => 0,
  'icon' => 'eraser',
  'popular' => true,
  'files' => true,
  'isolate' => true, // AI tool: may use every CPU core (see tf_tool_isolated)
  'scripts' => ['ai.js'],
  'appCategory' => 'MultimediaApplication',
  'keywords' => 'remove background from image free remove bg ai background remover transparent png product photo white background hd',
  'aka' => ['background remover', 'remove bg', 'background eraser', 'photo background remover', 'cut out image'], // other names people search for
  'short' => 'AI removes the background from any photo in seconds. Full HD, free, no upload.',
  'title' => 'Remove Background from Image Free: AI Background Remover, HD',
  'description' => 'Remove the background from photos with AI, in full resolution and free. Get a transparent PNG or a white, colour, blurred or custom background. No upload.',
  'related' => ['passport-photo-maker', 'image-compressor', 'image-resizer'],
  'answer' => <<<'EOT_TF'
Choose a photo and the AI cuts out the person or object and removes the background automatically, usually in a few seconds. Download a <strong>transparent PNG</strong> in full resolution, or put the subject on a white, coloured, blurred or custom background. Unlike most background removers, it’s <strong>free in HD</strong> and the photo never leaves your device.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>How to remove a background</h2>
<ol>
<li>Drop a photo into the box, or tap to choose one from your phone.</li>
<li>Leave <strong>Best quality</strong> on for the sharpest edges, or choose <strong>Quick</strong> for a result in about a second.</li>
<li>Wait a few seconds. Drag the slider on the result to compare the original with the cut-out.</li>
<li>Pick a new background if you want one, then download a PNG (transparent) or JPG.</li>
</ol>
<p>There's nothing to install and no waiting before you start. On your first visit the tool uses the small Quick AI (about 9 MB in total), so your first photo is done within seconds, while the Best quality AI loads in the background and then sharpens the edges by itself. On mobile data it asks before loading the larger AI (44 MB). Both are saved in your browser, so on later visits Best quality starts straight away.</p>

<h2>Free in full resolution</h2>
<p>Many background removers give a small preview for free and charge for the full-size image. This one runs the AI on your own device, which costs nothing to run, so every download is the full resolution of your photo (up to 4096 pixels on the longest side), with no watermark and no limit.</p>

<h2>Which quality to choose</h2>
<div class="scroll"><table class="tbl">
<thead><tr><th></th><th>Best quality</th><th>Quick</th></tr></thead>
<tbody>
<tr><td>Works on</td><td>Any subject: people, products, animals, cars, food</td><td>Any subject, with softer edges</td></tr>
<tr><td>Edges</td><td>Very fine detail, including hair and fur</td><td>Clean outline; fine hair and fur less detailed</td></tr>
<tr><td>Model download (once)</td><td>About 44 MB</td><td>About 5 MB</td></tr>
<tr><td>Speed</td><td>A few seconds on a computer; up to half a minute on older phones</td><td>About a second</td></tr>
<tr><td>AI model</td><td>ISNet (MIT licence)</td><td>U-2-Netp (Apache 2.0 licence)</td></tr>
</tbody></table></div>
<p>The AI works in the background of your browser, so the page stays smooth while it runs and you can keep scrolling or choosing options.</p>

<h2>Getting the cleanest cut-out</h2>
<ul>
<li><strong>Contrast helps:</strong> a subject that stands out from the background (a dark product on a light table) gives the sharpest edges.</li>
<li><strong>Avoid motion blur:</strong> blurry edges are blurry in the cut-out too.</li>
<li><strong>Use the biggest photo you have:</strong> more pixels mean finer hair and edges.</li>
<li><strong>Glass and see-through objects</strong> are the hardest case for any background remover; check the result carefully.</li>
</ul>

<h2>Popular uses</h2>
<ul>
<li><strong>Online shop product photos</strong> on pure white, as Amazon, eBay and Etsy recommend.</li>
<li><strong>Profile pictures</strong> with a clean colour or blurred background.</li>
<li><strong>Passport and ID photos:</strong> the <a href="/passport-photo-maker">passport photo maker</a> uses the same AI to make the background white and crops to the right size.</li>
<li><strong>Thumbnails, posters and presentations,</strong> placing a person or product on your own design.</li>
</ul>
EOT_TF,
  'faqs' => [
    ['Is this background remover really free in HD?', 'Yes. The AI runs on your device, so there is nothing to pay for: downloads are full resolution with no watermark and no limit.'],
    ['Is my photo uploaded?', 'No. The photo is processed in your browser. Only the AI model is downloaded, once, from Hugging Face.'],
    ['How do I make a transparent PNG?', 'Leave the background set to Transparent and press Download PNG. The checkerboard shows the transparent areas.'],
    ['Can I put a white background behind the subject?', 'Yes. Choose White (or any colour, a blurred version of the original, or your own image) and download a JPG.'],
    ['Is the first use slow?', 'Only a little. The AI downloads the first time (about 9 MB). The first photo uses the small Quick AI so it is done in seconds, and the Best quality AI loads in the background to sharpen it. After that both are stored in your browser and start instantly.'],
  ],
];
