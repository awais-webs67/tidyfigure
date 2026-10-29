<?php
// AI Image Upscaler: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'AI Image Upscaler',
  'category' => 'image',
  'order' => 3,
  'popular' => true,
  'files' => true,
  'isolate' => true, // AI tool: may use every CPU core (see tf_tool_isolated)
  'libs' => ['https://cdn.jsdelivr.net/npm/onnxruntime-web@1.20.1/dist/ort.min.js'],
  'icon' => 'scaling',
  'keywords' => 'ai image upscaler online free upscale image enhance photo quality increase image resolution make blurry photo clear 4x upscale 2x enlarge image without losing quality',
  'aka' => ['photo enhancer', 'increase image resolution', 'make picture clearer', 'upscale image 4x'], // other names people search for
  'short' => 'Enlarge photos 2× or 4× with AI that adds real detail, so small or blurry pictures become sharp and clear.',
  'title' => 'AI Image Upscaler: Enhance & Enlarge Photos 2x/4x Free',
  'description' => <<<'EOT_TF'
Upscale images 2× or 4× with AI: blurry, small or old photos become sharper and larger without pixelation. Free, no sign-up, and the photo stays on your device.
EOT_TF,
  'related' => ['image-resizer', 'remove-background', 'photo-editor'],
  'answer' => <<<'EOT_TF'
Choose a photo and pick <strong>2×</strong> or <strong>4×</strong>. An AI model (Real-ESRGAN) redraws the picture at the larger size, <strong>sharpening edges and removing blur and JPG blockiness</strong> instead of just stretching the pixels. Drag the slider to compare with ordinary enlarging, then download the result.
EOT_TF,
  'article' => <<<'EOT_TF'
<h2>How to upscale an image</h2>
<ol>
<li>Choose or drop a photo (JPG, PNG or WebP), or try the sample.</li>
<li>Pick <strong>2×</strong> (twice as wide and tall) or <strong>4×</strong>.</li>
<li>Wait while the AI works through the picture piece by piece; the bar shows how far it's got.</li>
<li>Drag the slider to compare with a normal enlargement, then download.</li>
</ol>

<h2>What the AI does differently</h2>
<p>Ordinary resizing can only spread the existing pixels over a bigger area, so an enlarged photo looks soft and blocky. An AI upscaler has learnt from millions of pictures what real edges, textures and lettering look like, and draws them back in: hair, leaves and fabric get texture, text and logos get crisp edges, and the noise and blocks from heavy JPG compression are cleaned up.</p>
<p>This tool uses <strong>Real-ESRGAN</strong>, a well-known open model built for real photos that are small, compressed or slightly blurred.</p>

<h2>Good uses</h2>
<ul>
<li>Small product photos, logos and icons that need to look good on a website or in print.</li>
<li>Old or low-resolution photos from early phones, WhatsApp or social media.</li>
<li>Screenshots and stills from videos.</li>
<li>Images for printing larger than they were made for.</li>
</ul>

<h2>Speed and limits</h2>
<p>The AI runs on your own device, so it takes from a few seconds on a computer to a minute or two on an older phone, and the model (about 5 MB) downloads only the first time. To keep it quick, very large pictures are reduced first: there's little to gain from upscaling a photo that's already big. The AI can't recover detail that isn't there at all, such as a face that's only a few pixels wide, and it may smooth very fine textures.</p>
<p>Your photo is never uploaded: everything happens in your browser.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I make a blurry photo clear for free?',
      <<<'EOT_TF'
Choose the photo here and pick 2× or 4×. The AI sharpens edges and removes blur and compression blocks while enlarging it. Download the result; it is free with no sign-up.
EOT_TF,
    ],
    [
      'What is the difference between 2× and 4×?',
      <<<'EOT_TF'
2× doubles the width and height (four times the pixels); 4× makes it four times as wide and tall. Use 4× for very small pictures and 2× for photos that are just a bit small.
EOT_TF,
    ],
    [
      'Does it work on phones?',
      <<<'EOT_TF'
Yes. It runs in your browser on phones, tablets and computers. Phones take longer, so start with 2×.
EOT_TF,
    ],
    [
      'Is my photo uploaded?',
      <<<'EOT_TF'
No. The AI runs on your device and the photo never leaves it.
EOT_TF,
    ],
  ],
];
