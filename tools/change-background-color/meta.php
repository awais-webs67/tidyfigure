<?php
return [
    'name' => 'Change Background Color',
    'updated' => '2026-11-15',
    'category' => 'image',
    'order' => 3,
    'files' => true,
    'isolate' => true,
    'scripts' => ['ai.js'],
    'use' => 'remove-background',
    'preset' => [
        'bg' => '#4A86E8',
    ],
    'icon' => 'palette',
    'keywords' => 'change photo background color, blue white background photo maker, passport id background changer ai',
    'short' => 'Change the background colour of a photo to any colour or gradient.',
    'title' => 'Change Photo Background Color – AI Cutout HD',
    'description' => 'Replace busy photo backgrounds with crisp blue, red, grey, white, custom HEX colours or soft gradients using AI cutout locally in full HD.',
    'appCategory' => 'MultimediaApplication',
    'related' => ['remove-background', 'white-background-maker', 'passport-photo-maker', 'photo-editor'],
    'answer' => 'Upload a photo and the AI separates the subject from the background. Then tap any of the <strong>23 colours</strong>, a <strong>gradient</strong>, a blurred version of the original or your own picture, or pick <strong>any colour</strong> with the colour picker. The preview changes instantly, and you download the full-size result as a JPG.',
    'article' => <<<'EOT_TF'
<h2>How to change the background colour of a photo</h2>
<ol>
<li>Choose a photo. The AI removes the background in a few seconds.</li>
<li>Tap a colour: white, grey, blue, red, pink, green, purple and more, or a gradient.</li>
<li>Need an exact colour? Use <strong>Any colour</strong> to choose one, for example your brand colour.</li>
<li>Download the result. Switch colours as often as you like without processing the photo again.</li>
</ol>

<h2>Popular background colours and where they’re used</h2>
<div class="scroll"><table class="tbl"><thead><tr><th>Colour</th><th>Common use</th></tr></thead><tbody>
<tr><td>White / off-white</td><td>Product photos, passports, CVs</td></tr>
<tr><td>Light blue</td><td>Some ID cards and visas, school photos</td></tr>
<tr><td>Passport blue</td><td>Government ID photos in several countries</td></tr>
<tr><td>Red</td><td>Visa photos for some countries, bold marketing images</td></tr>
<tr><td>Grey</td><td>Professional headshots, studio look</td></tr>
<tr><td>Gradients</td><td>Profile pictures, thumbnails, social posts</td></tr>
</tbody></table></div>
<p>Always check the official rules for ID and visa photos, as required colours and sizes differ by country.</p>

<h2>Tips</h2>
<ul>
<li>Choose a background that contrasts with the hair and clothes, so the outline looks natural.</li>
<li>Soft, even light on the subject makes the new background look more realistic.</li>
<li>For a natural portrait look, try <strong>Blurred original</strong>, which keeps the original scene but softly out of focus.</li>
</ul>

<h2>Matching Visa, Office Badge &amp; E-Commerce Backdrop Standards</h2>
<p>Different embassies and HR departments specify contrasting flat backdrops: light blue or white for national ID cards, soft studio grey for LinkedIn headshots, or cohesive pastel HEX brand tones for Shopify skincare listings.</p>
<h2>Avoiding Colour Cast Along Clothing &amp; Hair Edges</h2>
<p>Shoot subjects three feet in front of a plain wall under even front lighting; harsh neon wall reflections onto shoulders make crisp studio recolouring noticeably harder for hair edge refinement.</p>

<h2>Gradient vs Flat Solid Studio Backdrops</h2>
<p>Flat pure colours pass passport and official portal colour-uniformity rules effortlessly, while subtle two-tone vertical studio gradients elevate LinkedIn portraits, Slack team avatars and YouTube channel profile icons cleanly.</p>
EOT_TF,
    'faqs' => [
        ['How do I change the background colour of a picture?', 'Upload the picture, wait a few seconds for the AI to cut out the subject, then tap a colour or gradient and download.'],
        ['Can I use my own colour?', 'Yes. Tap Any colour to choose any shade, such as a brand colour.'],
        ['Can I put a photo on a blue background for an ID card?', 'Yes. Choose Light blue or Passport blue, then download. For the official size, use the passport photo maker.'],
        ['Does changing the colour reduce quality?', 'No. The result keeps the full resolution of your photo, up to 4096 pixels on the longest side.'],
        ['Is my photo uploaded?', 'No. Everything happens in your browser.'],
        ['Which blue hex code works best for visa and ID photos?', 'Clean medium sky blue around #3B82C4 or pure crisp #FFFFFF white matches most embassy colour guides—check your consulate instructions first.'],
        ['Can I pick an exact brand hex colour instead of preset studio backgrounds?', 'Yes. Enter any hex code or click the interactive swatch wheel to match website banners or ID specification colours identically.'],
    ],
    'aka' => ['Photo Background Color Changer', 'ID Photo Color Replacer'],
];
