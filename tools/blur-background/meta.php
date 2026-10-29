<?php
// Blur Background: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Blur Background',
  'category' => 'image',
  'order' => 4,
  'files' => true,
  'isolate' => true, // AI tool: may use every CPU core (see tf_tool_isolated)
  'scripts' => ['ai.js'],
  'use' => 'remove-background',
  'preset' => json_decode('{"bg": "blur"}', true),
  'icon' => 'aperture',
  'keywords' => 'blur background of photo blur photo background online portrait mode bokeh effect blur image background free',
  'short' => 'Blur the background of a photo like portrait mode, keeping the subject sharp.',
  'title' => 'Blur Background of Photo Online: Free Portrait Mode',
  'description' => <<<'EOT_TF'
Blur the background of any photo like a phone’s portrait mode: the AI keeps the person or object sharp and softens the rest. Adjust the blur, download in HD.
EOT_TF,
  'appCategory' => 'MultimediaApplication',
  'related' => ['remove-background', 'change-background-color', 'photo-editor', 'image-compressor'],
  'answer' => <<<'EOT_TF'
Upload a photo: the AI finds the person or object, keeps it <strong>sharp</strong>, and <strong>blurs the background</strong> like a camera with a wide aperture (bokeh). Drag the <strong>Blur strength</strong> slider from a gentle softening to a strong blur, compare before and after, and download the full-size photo.
EOT_TF,
  'article' => <<<'EOT_TF'
<h2>Portrait mode for any photo</h2>
<p>Phones blur the background in portrait mode by measuring depth. This tool does the same afterwards, on any photo: the AI separates the subject from the background, then softens only the background. It works on pictures taken with any camera, screenshots and old photos.</p>

<h2>How to blur a photo background</h2>
<ol>
<li>Choose your photo.</li>
<li>Wait a few seconds while the AI finds the subject.</li>
<li>Set the <strong>Blur strength</strong>: low for a natural look, high to hide a messy room or busy street.</li>
<li>Use the slider on the preview to compare, then download.</li>
</ol>

<h2>When to blur the background</h2>
<ul>
<li><strong>Profile pictures:</strong> a soft background makes your face stand out.</li>
<li><strong>Privacy:</strong> hide house numbers, car plates, documents or people behind you.</li>
<li><strong>Product photos:</strong> keep the item sharp in a real setting.</li>
<li><strong>Social media:</strong> give everyday photos a professional, camera-like look.</li>
</ul>

<h2>Tips for a natural result</h2>
<ul>
<li>Moderate blur usually looks most realistic; very strong blur can look cut-out.</li>
<li>Photos where the subject is clearly separated from the background give the cleanest edges.</li>
<li>For a plain colour instead of blur, use <a href="/change-background-color">change background colour</a>.</li>
</ul>
EOT_TF,
  'faqs' => [
    [
      'How do I blur the background of a photo?',
      <<<'EOT_TF'
Upload the photo. The AI keeps the subject sharp and blurs the rest; adjust the strength with the slider and download.
EOT_TF,
    ],
    [
      'Does it work on photos not taken in portrait mode?',
      <<<'EOT_TF'
Yes. It works on any photo, because the AI finds the subject itself.
EOT_TF,
    ],
    [
      'Can I control how blurry it is?',
      <<<'EOT_TF'
Yes. Drag the Blur strength slider from a light blur to a strong one.
EOT_TF,
    ],
    [
      'Will the person stay sharp?',
      <<<'EOT_TF'
Yes. Only the background is blurred. Fine hair edges are handled by the AI model.
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
