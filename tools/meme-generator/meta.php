<?php
// Meme Generator: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Meme Generator',
  'updated' => '2026-10-22', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'image',
  'order' => 11,
  'icon' => 'laugh',
  'keywords' => 'meme maker make a meme top bottom text impact font caption image',
  'short' => 'Add classic top and bottom meme text, or modern caption bars, to any image.',
  'title' => 'Meme Generator: Make a Meme From Your Own Picture, Free',
  'description' => <<<'EOT_TF'
Make memes from your own image: classic white text with a black outline, or modern caption bars. Adjust size and colours, then download. No watermark.
EOT_TF,
  'related' => ['add-watermark-to-image', 'crop-image', 'fancy-text-generator'],
  'answer' => <<<'EOT_TF'
Upload a picture (or start from a plain background), type the <strong>top and bottom text</strong>, and download your meme. The classic style uses bold white letters with a black outline, which stays readable on any photo; the caption-bar style puts black text on white bars above and below, like modern social media memes. There's <strong>no watermark</strong>.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>How to make a meme</h2>
<ol>
<li><strong>Choose an image.</strong> Your own photo, a screenshot, or a plain coloured square for text-only memes.</li>
<li><strong>Write the text.</strong> The setup goes on top, the punchline on the bottom. Long lines wrap automatically.</li>
<li><strong>Adjust the style.</strong> Change text size and colours, switch caps on or off, or use caption bars.</li>
<li><strong>Download</strong> and share it anywhere.</li>
</ol>

<h2>Two classic styles</h2>
<ul>
<li><strong>Image macro (classic):</strong> big, bold, all-caps white text with a black outline, placed directly on the picture. The outline keeps the words readable over both light and dark parts of the image. This tool uses Anton, a free bold font with the same feel as the traditional Impact typeface.</li>
<li><strong>Caption bars (modern):</strong> black text on white space above and below the image, so the picture isn't covered. Common on X, Instagram and Reddit.</li>
</ul>

<h2>Tips for funnier memes</h2>
<ul>
<li><strong>Keep it short.</strong> The best memes are readable in under two seconds.</li>
<li><strong>Setup on top, punchline on the bottom.</strong> The eye reads in that order.</li>
<li><strong>Pick an expressive picture.</strong> Faces with strong reactions work best.</li>
<li><strong>Make it relatable.</strong> Specific everyday situations ("when the meeting could have been an email") land better than general jokes.</li>
</ul>

<h2>Using images responsibly</h2>
<p>Use your own photos, or images you're allowed to use. Many famous meme templates are copyrighted photos or film stills; sharing them as memes is widely tolerated, but using them in advertising or for commercial purposes can get you into trouble. Don't make memes of private people without their permission.</p>

<h2>Private by design</h2>
<p>Your image is processed in your browser and never uploaded.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I make a meme with my own picture?',
      'Upload your image, type the top and bottom text, adjust the size, and press Download.',
    ],
    [
      'What font do memes use?',
      <<<'EOT_TF'
Classic memes use Impact: bold white capitals with a black outline. This tool uses Anton, a free font with the same look.
EOT_TF,
    ],
    ['Does the meme have a watermark?', 'No. Your meme downloads without any watermark.'],
    [
      'Can I make a meme without a picture?',
      'Yes. Choose a plain white, black or orange background and add text.',
    ],
    ['Is my image uploaded?', 'No. Memes are made in your browser.'],
  ],
];
