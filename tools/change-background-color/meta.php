<?php
// Change Background Color: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Change Background Color',
  'updated' => '2026-10-29', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'image',
  'order' => 3,
  'files' => true,
  'isolate' => true, // AI tool: may use every CPU core (see tf_tool_isolated)
  'scripts' => ['ai.js'],
  'use' => 'remove-background',
  'preset' => json_decode('{"bg": "#4A86E8"}', true),
  'icon' => 'palette',
  'keywords' => 'change background color of photo change photo background colour background changer photo background colour blue red background photo editor online free',
  'short' => 'Change the background colour of a photo to any colour or gradient.',
  'title' => 'Change Background Color of Photo: Free, Any Color',
  'description' => <<<'EOT_TF'
Change the background colour of any photo with AI: blue, red, white, grey, any custom colour or a gradient. Full resolution, free, and your photo stays private.
EOT_TF,
  'appCategory' => 'MultimediaApplication',
  'related' => ['remove-background', 'white-background-maker', 'passport-photo-maker', 'photo-editor'],
  'answer' => <<<'EOT_TF'
Upload a photo and the AI separates the subject from the background. Then tap any of the <strong>23 colours</strong>, a <strong>gradient</strong>, a blurred version of the original or your own picture, or pick <strong>any colour</strong> with the colour picker. The preview changes instantly, and you download the full-size result as a JPG.
EOT_TF,
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
EOT_TF,
  'faqs' => [
    [
      'How do I change the background colour of a picture?',
      <<<'EOT_TF'
Upload the picture, wait a few seconds for the AI to cut out the subject, then tap a colour or gradient and download.
EOT_TF,
    ],
    [
      'Can I use my own colour?',
      <<<'EOT_TF'
Yes. Tap Any colour to choose any shade, such as a brand colour.
EOT_TF,
    ],
    [
      'Can I put a photo on a blue background for an ID card?',
      <<<'EOT_TF'
Yes. Choose Light blue or Passport blue, then download. For the official size, use the passport photo maker.
EOT_TF,
    ],
    [
      'Does changing the colour reduce quality?',
      <<<'EOT_TF'
No. The result keeps the full resolution of your photo, up to 4096 pixels on the longest side.
EOT_TF,
    ],
    [
      'Is my photo uploaded?',
      <<<'EOT_TF'
No. Everything happens in your browser.
EOT_TF,
    ],
  ],
];
