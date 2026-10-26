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
<li>Choose <strong>Best quality</strong> for products, pets, cars and anything else, or <strong>Fast</strong> for photos of people.</li>
<li>Wait a few seconds. Drag the slider on the result to compare the original with the cut-out.</li>
<li>Pick a new background if you want one, then download a PNG (transparent) or JPG.</li>
</ol>
<p>The first time you use each quality, your browser downloads the AI model: 44 MB for Best quality (115 MB on computers with a modern graphics card, for even sharper edges) and 7 MB for Fast. It's saved in your browser, so after that the tool starts instantly.</p>

<h2>Free in full resolution</h2>
<p>Many background removers give a small preview for free and charge for the full-size image. This one runs the AI on your own device, which costs nothing to run, so every download is the full resolution of your photo (up to 4096 pixels on the longest side), with no watermark and no limit.</p>

<h2>Which quality to choose</h2>
<div class="scroll"><table class="tbl">
<thead><tr><th></th><th>Best quality</th><th>Fast</th></tr></thead>
<tbody>
<tr><td>Works on</td><td>Any subject: people, products, animals, cars, food</td><td>People (portraits, selfies, full body)</td></tr>
<tr><td>Edges</td><td>Very fine detail, including hair and fur</td><td>Good on hair; may miss objects people hold</td></tr>
<tr><td>Model download (once)</td><td>44 MB, or 115 MB with WebGPU</td><td>About 7 MB</td></tr>
<tr><td>Speed</td><td>A few seconds on a computer; up to half a minute on older phones</td><td>About a second</td></tr>
<tr><td>AI model</td><td>BiRefNet lite with WebGPU, otherwise ISNet (both MIT licence)</td><td>MODNet (Apache 2.0 licence)</td></tr>
</tbody></table></div>
<p>On computers with a recent Chrome or Edge, the tool uses your graphics card (WebGPU) and the larger BiRefNet model for the finest edges and extra speed.</p>

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
    ['Why is the first use slow?', 'The AI model downloads the first time (44–115 MB for Best quality, 7 MB for Fast). After that it is stored in your browser and starts instantly.'],
  ],
];
