<?php
// Passport Photo Maker: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Passport Photo Maker',
  'category' => 'image',
  'order' => 1,
  'icon' => 'user-round',
  'popular' => true,
  'files' => true,
  'isolate' => true, // AI tool: may use every CPU core (see tf_tool_isolated)
  'scripts' => ['ai.js'],
  'appCategory' => 'MultimediaApplication',
  'keywords' => 'passport photo maker online free passport size photo 2x2 photo 35x45 mm visa photo white background print sheet 4x6 id photo',
  'short' => 'Passport and visa photos for 12 countries: white background, right size, print sheet.',
  'title' => 'Passport Photo Maker: Free 2×2 in & 35×45 mm Photos Online',
  'description' => 'Make passport and visa photos online: US 2×2, UK, Schengen, Canada, India, Pakistan and more. AI white background, auto head sizing and a 4×6 print sheet.',
  'related' => ['remove-background', 'crop-image', 'image-resizer'],
  'answer' => <<<'EOT_TF'
Choose your country and document, then a front-facing photo. The AI <strong>replaces the background with white</strong> and <strong>sizes and centres your head</strong> to the official measurements; drag or zoom to fine-tune. Download the single photo at 300 dpi for online applications, or a <strong>4×6 in print sheet</strong> with several copies to print for a few cents at any photo kiosk.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>How to make a passport photo at home</h2>
<ol>
<li><strong>Take the photo:</strong> stand about 1–1.5 m from a plain, light wall, facing a window or other even light. Ask someone else to take it at eye level, rather than taking a selfie (selfies distort the face).</li>
<li><strong>Choose your country and document</strong> above, then the photo.</li>
<li><strong>Check the position:</strong> the top of the head should sit in the orange band and the chin in the green band. Drag the photo or use the sliders if needed.</li>
<li><strong>Download:</strong> use the single photo for online applications, or the print sheet for paper forms.</li>
</ol>

<h2>Photo sizes by country</h2>
<div class="scroll"><table class="tbl">
<thead><tr><th>Document</th><th>Size</th><th>Head height</th></tr></thead>
<tbody>
<tr><td>United States passport and visa</td><td>2×2 in (51×51 mm)</td><td>1–1⅜ in (25–35 mm)</td></tr>
<tr><td>United Kingdom passport</td><td>35×45 mm</td><td>29–34 mm</td></tr>
<tr><td>Schengen visa, most EU passports</td><td>35×45 mm</td><td>32–36 mm</td></tr>
<tr><td>Canada passport</td><td>50×70 mm</td><td>31–36 mm</td></tr>
<tr><td>Australia passport</td><td>35×45 mm</td><td>32–36 mm</td></tr>
<tr><td>India visa and OCI</td><td>2×2 in (51×51 mm)</td><td>25–35 mm</td></tr>
<tr><td>Pakistan passport and NADRA</td><td>35×45 mm</td><td>About 70–78% of the height</td></tr>
<tr><td>China visa</td><td>33×48 mm</td><td>28–33 mm</td></tr>
</tbody></table></div>
<p>Requirements are set by each government and change from time to time. Always check the official website for your application before printing.</p>

<h2>Rules most countries share</h2>
<ul>
<li>Taken in the last six months, in colour, sharp and in focus.</li>
<li>Plain white or light background, with no shadows on the face or behind the head.</li>
<li>Facing the camera directly, with a neutral expression and mouth closed.</li>
<li>Eyes open and visible. Most countries no longer allow glasses; remove them.</li>
<li>No hats or head coverings, except for religious or medical reasons.</li>
<li>No filters, beauty apps or retouching that changes your appearance.</li>
</ul>

<h2>Printing the photos</h2>
<p>The print sheet is a standard 4×6 inch (10×15 cm) photo at 300 dpi, the cheapest size at pharmacies, supermarkets and photo kiosks. Print it at <strong>actual size / 100%</strong>, with no "fit to page" or borders, so each photo comes out exactly the right size. Then cut along the dashed lines. You can also choose an A4 or Letter sheet to print at home on photo paper.</p>

<h2>Online applications</h2>
<p>Many countries now accept digital photos for online passport renewals and e-visas. Use the single photo download: it's a high-quality JPG at 300 dpi. If the website asks for a specific pixel size or file size (for example 600×600 pixels for the US), the US 2×2 photo already matches it; for others, use the <a href="/image-resizer">image resizer</a> or <a href="/image-compressor">image compressor</a>.</p>
<p>Your photo is processed on your device and never uploaded.</p>
EOT_TF,
  'faqs' => [
    ['How do I make a passport photo with a white background?', 'Choose your country and a front-facing photo. The AI removes the original background and replaces it with white automatically.'],
    ['What size is a passport photo?', 'It depends on the country: 2×2 in (51×51 mm) for the US and India, 35×45 mm for the UK, EU, Australia and Pakistan, 50×70 mm for Canada.'],
    ['How do I print passport photos cheaply?', 'Download the 4×6 in print sheet and print it at 100% scale at any photo kiosk or pharmacy, then cut out the copies.'],
    ['Can I take a passport photo with my phone?', 'Yes. Ask someone to take it from about 1–1.5 m away at eye level, against a plain light wall in even light.'],
    ['Will my photo be accepted?', 'The tool matches the official size and head position, but acceptance also depends on lighting, expression and other rules. Check your government’s requirements.'],
  ],
];
