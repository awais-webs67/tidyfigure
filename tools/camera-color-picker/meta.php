<?php
// Camera Color Picker: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Camera Color Picker',
  'category' => 'device',
  'order' => 7,
  'scripts' => ['color.js'],
  'icon' => 'aperture',
  'keywords' => 'camera color picker color identifier identify color from camera what color is this color finder app hex from camera paint match',
  'short' => 'Point your camera at anything to get its colour name and HEX code.',
  'title' => 'Camera Color Picker: Identify Any Color Live',
  'description' => <<<'EOT_TF'
Point your phone or webcam at anything to see its colour name, HEX, RGB and HSL codes live. Tap to pick a spot, save colours to a palette. Private.
EOT_TF,
  'related' => ['image-color-picker', 'color-converter', 'color-combination-checker', 'outfit-color-matcher'],
  'answer' => <<<'EOT_TF'
Click <strong>Start camera</strong> and point it at an object: the colour under the crosshair is shown live with its <strong>name</strong>, <strong>HEX</strong>, <strong>RGB</strong> and <strong>HSL</strong> codes. Tap the picture to pick another spot, <strong>Freeze</strong> to hold a reading, and <strong>Save</strong> colours to a palette you can copy.
EOT_TF,
  'article' => <<<'EOT_TF'
<h2>How to identify a colour with your camera</h2>
<ol>
<li>Click <strong>Start camera</strong> and allow access. On a phone, the back camera is used.</li>
<li>Point the crosshair at the colour. Hold steady for a second: the reading averages a small area to ignore noise.</li>
<li>Tap anywhere on the picture to measure that spot instead of the centre.</li>
<li>Click <strong>Save colour</strong> to add it to your palette, then click any saved colour to copy its HEX code.</li>
</ol>

<h2>Getting accurate colours</h2>
<p>A camera sees colour through the light around it. The same white wall looks yellow under a warm bulb, blue in shade, and grey in a dim room. For the closest match:</p>
<ul>
<li>Use daylight from a window, without direct sun on the object.</li>
<li>Avoid shadows and shiny reflections on the spot you measure.</li>
<li>Hold the camera close so the colour fills the centre.</li>
<li>For paint or fabric, compare a reading with a known white (like printer paper) in the same light.</li>
</ul>
<p>Use the reading as a starting point when matching paint, thread or a lipstick shade, and check the final choice in person.</p>

<h2>What the codes mean</h2>
<ul>
<li><strong>HEX</strong> (#1E7A4C) is used in web design, Canva, Figma and most apps.</li>
<li><strong>RGB</strong> (30, 122, 76) gives the red, green and blue amounts from 0 to 255.</li>
<li><strong>HSL</strong> describes hue (the colour angle), saturation (how vivid) and lightness.</li>
<li>The <strong>name</strong> is the closest common colour name, so you can describe it in words.</li>
</ul>

<h2>No camera? Use a photo</h2>
<p>To pick colours from a picture you already have, use the <a href="/image-color-picker">image color picker</a>. To convert a code to other formats, use the <a href="/color-converter">color converter</a>.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I find the colour of an object with my phone?',
      <<<'EOT_TF'
Open this page on your phone, start the camera and point the crosshair at the object. The colour name and HEX code appear live.
EOT_TF,
    ],
    [
      'Why does the colour change as I move?',
      <<<'EOT_TF'
Cameras adjust to the light. Shadows, reflections and warm or cool lighting all change the reading. Use daylight and avoid shiny spots for the most stable result.
EOT_TF,
    ],
    [
      'Can it match paint colours?',
      <<<'EOT_TF'
It gives the HEX and RGB values you can type into a paint company’s colour finder. Lighting affects the reading, so always check a sample in person.
EOT_TF,
    ],
    [
      'Is the camera picture uploaded?',
      <<<'EOT_TF'
No. The colour is measured in your browser. Nothing is recorded or sent anywhere.
EOT_TF,
    ],
    [
      'Can I pick colours from a photo instead?',
      <<<'EOT_TF'
Yes. Use the image color picker to upload a photo and click any pixel to get its colour.
EOT_TF,
    ],
  ],
];
