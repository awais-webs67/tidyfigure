<?php
// White Background Maker: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'White Background Maker',
  'updated' => '2026-10-29', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'image',
  'order' => 1,
  'files' => true,
  'isolate' => true, // AI tool: may use every CPU core (see tf_tool_isolated)
  'scripts' => ['ai.js'],
  'use' => 'remove-background',
  'preset' => json_decode('{"bg": "#FFFFFF"}', true),
  'icon' => 'image',
  'keywords' => 'white background maker add white background to photo make background white product photo white background passport white background online free',
  'short' => 'Put any photo on a clean white background in seconds. Free, HD.',
  'title' => 'Add White Background to Photo: Free, HD, Online',
  'description' => <<<'EOT_TF'
Make the background of any photo pure white with AI: product photos for Amazon and eBay, passport and profile pictures. Full resolution, free, no upload.
EOT_TF,
  'appCategory' => 'MultimediaApplication',
  'related' => ['remove-background', 'passport-photo-maker', 'transparent-background-maker', 'change-background-color'],
  'answer' => <<<'EOT_TF'
Choose a photo and the AI removes the old background and places the person or product on a <strong>pure white background</strong> (#FFFFFF), ready for online shops, ID photos and CVs. Download a full-resolution JPG. Prefer off-white, grey or light blue? Pick it from the colours. Your photo never leaves your device.
EOT_TF,
  'article' => <<<'EOT_TF'
<h2>Why a white background?</h2>
<ul>
<li><strong>Online marketplaces:</strong> Amazon requires the main product image on pure white (RGB 255, 255, 255); eBay, Etsy, Shopify stores and Google Shopping recommend it.</li>
<li><strong>ID, visa and job applications:</strong> many passport, visa and ID photos need a white or off-white background.</li>
<li><strong>Professional profiles:</strong> a clean white background makes LinkedIn and CV photos look sharp.</li>
<li><strong>Catalogues and presentations:</strong> white keeps attention on the product and matches any page.</li>
</ul>

<h2>How to make a photo background white</h2>
<ol>
<li>Drop your photo in the box, or tap to choose one from your phone or computer.</li>
<li>The AI finds the subject and replaces everything else with white, usually in a few seconds.</li>
<li>Compare before and after with the slider, then download the JPG.</li>
</ol>

<h2>Tips for great product photos</h2>
<ul>
<li>Shoot in soft daylight or with two lamps either side, so the product has no harsh shadows.</li>
<li>Fill most of the frame with the product: marketplaces like the item to cover 85% of the image.</li>
<li>Use a plain, contrasting surface when shooting; the AI separates the subject most cleanly when it stands out.</li>
<li>For passport photos, use the <a href="/passport-photo-maker">passport photo maker</a>, which also sizes and centres your head to official rules.</li>
</ul>

<h2>Pure white, off-white or grey?</h2>
<p>Pure white suits shops and most documents. Off-white or light grey looks softer for portraits and keeps pale clothing from blending into the background. You can switch colours after the cut-out without processing the photo again.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I make the background of a photo white?',
      <<<'EOT_TF'
Upload the photo here. The AI removes the background and fills it with pure white. Download the result as a JPG.
EOT_TF,
    ],
    [
      'Is it pure white for Amazon?',
      <<<'EOT_TF'
Yes. The background is exactly RGB 255, 255, 255 (#FFFFFF), which is what Amazon asks for in main product images.
EOT_TF,
    ],
    [
      'Is the image full resolution?',
      <<<'EOT_TF'
Yes. You download the full size of your photo (up to 4096 pixels on the longest side), free and without a watermark.
EOT_TF,
    ],
    [
      'Can I use it for passport photos?',
      <<<'EOT_TF'
Yes for the background. For the official size and head position, use the passport photo maker, which does both.
EOT_TF,
    ],
    [
      'Is my photo uploaded?',
      <<<'EOT_TF'
No. The AI runs in your browser, so the photo stays on your device.
EOT_TF,
    ],
  ],
];
