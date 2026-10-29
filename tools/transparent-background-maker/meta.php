<?php
// Transparent Background Maker: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Transparent Background Maker',
  'category' => 'image',
  'order' => 2,
  'files' => true,
  'isolate' => true, // AI tool: may use every CPU core (see tf_tool_isolated)
  'scripts' => ['ai.js'],
  'use' => 'remove-background',
  'preset' => json_decode('{"bg": "none"}', true),
  'icon' => 'layers',
  'keywords' => 'make background transparent transparent background maker png transparent background remove white background logo transparent png maker',
  'short' => 'Make the background of any picture transparent and save a PNG.',
  'title' => 'Make Background Transparent: Free PNG Maker, HD',
  'description' => <<<'EOT_TF'
Make the background of a photo, logo or product picture transparent with AI and download a full-resolution PNG. Free, no sign-up, and nothing is uploaded.
EOT_TF,
  'appCategory' => 'MultimediaApplication',
  'related' => ['remove-background', 'white-background-maker', 'image-converter', 'signature-generator'],
  'answer' => <<<'EOT_TF'
Upload a picture and the AI removes the background, leaving the subject on a <strong>transparent background</strong> (shown as a checkerboard). Download it as a <strong>PNG</strong>, the format that keeps transparency, in full resolution. Use it for logos, stickers, product shots, thumbnails and designs. Nothing is uploaded.
EOT_TF,
  'article' => <<<'EOT_TF'
<h2>What is a transparent background?</h2>
<p>A transparent background has no colour at all, so whatever is behind the image shows through. That lets you place a person, product or logo on any design, slide, website or video without a white box around it. The checkerboard pattern you see is only how editors show “nothing”; it doesn’t appear in the file.</p>

<h2>Use the right file format</h2>
<ul>
<li><strong>PNG</strong> keeps transparency and is supported everywhere. This tool saves PNG.</li>
<li><strong>WebP</strong> also supports transparency with smaller files; convert with the <a href="/image-converter">image converter</a> if you need it.</li>
<li><strong>JPG</strong> can’t be transparent: transparent areas turn white or black when saved as JPG.</li>
</ul>

<h2>How to make a background transparent</h2>
<ol>
<li>Drop the image into the box (JPG, PNG or WebP).</li>
<li>The AI cuts out the subject in a few seconds.</li>
<li>Check the edges with the compare slider, then download the PNG.</li>
</ol>

<h2>Logos and signatures</h2>
<p>For a logo on a white background, the AI keeps the shapes and drops the white. For handwritten signatures, the <a href="/signature-generator">signature generator</a> cleans up a photo of your signature and gives a transparent PNG with crisp ink.</p>

<h2>Ideas</h2>
<ul>
<li>Stickers for WhatsApp and Telegram</li>
<li>YouTube thumbnails and social media posts</li>
<li>Product images for websites and catalogues</li>
<li>Presentation slides and posters</li>
</ul>
EOT_TF,
  'faqs' => [
    [
      'How do I make an image background transparent?',
      <<<'EOT_TF'
Upload it here. The AI removes the background and you download a PNG with a transparent background.
EOT_TF,
    ],
    [
      'Why is my transparent image white when I open it?',
      <<<'EOT_TF'
Some viewers show transparency as white. Place the PNG in a design app, document or website to see the transparency.
EOT_TF,
    ],
    [
      'Can JPG files be transparent?',
      <<<'EOT_TF'
No. JPG doesn’t support transparency. Save as PNG (or WebP) to keep the transparent background.
EOT_TF,
    ],
    [
      'Does it work for logos?',
      <<<'EOT_TF'
Yes. It removes a plain background behind a logo. For very fine text, check the edges with the compare slider before downloading.
EOT_TF,
    ],
    [
      'Is it free and private?',
      <<<'EOT_TF'
Yes. It’s free in full resolution, and the image is processed in your browser, never uploaded.
EOT_TF,
    ],
  ],
];
