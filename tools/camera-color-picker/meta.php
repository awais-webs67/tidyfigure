<?php
return [
    'name' => 'Camera Color Picker',
    'updated' => '2026-11-15',
    'category' => 'device',
    'order' => 7,
    'scripts' => ['color.js'],
    'icon' => 'aperture',
    'keywords' => 'camera color picker, live color identifier, webcam hex finder, detect color from camera, paint color matcher',
    'short' => 'Point your camera at anything to get its colour name and HEX code.',
    'title' => 'Camera Color Picker – Live HEX & RGB Finder',
    'description' => 'Aim your phone camera or webcam at walls, fabric or prints to detect HEX, RGB and HSL colour codes live and build saved palettes without uploads.',
    'related' => ['image-color-picker', 'color-converter', 'color-combination-checker', 'outfit-color-matcher'],
    'answer' => 'Click <strong>Start camera</strong> and point it at an object: the colour under the crosshair is shown live with its <strong>name</strong>, <strong>HEX</strong>, <strong>RGB</strong> and <strong>HSL</strong> codes. Tap the picture to pick another spot, <strong>Freeze</strong> to hold a reading, and <strong>Save</strong> colours to a palette you can copy.',
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

<h2>Matching Paint &amp; Digital Colours Under Real Lighting</h2>
<p>Warm indoor LED bulbs shift neutrals toward orange-yellow, whereas cloudy north-facing daylight reveals truer pigments. Take three sample readings across the surface, average or compare their HSL saturation, and test contrast pairings before ordering paint tins or textile swatches.</p>
EOT_TF,
    'faqs' => [
        ['How do I find the colour of an object with my phone?', 'Open this page on your phone, start the camera and point the crosshair at the object. The colour name and HEX code appear live.'],
        ['Why does the colour change as I move?', 'Cameras adjust to the light. Shadows, reflections and warm or cool lighting all change the reading. Use daylight and avoid shiny spots for the most stable result.'],
        ['Can it match paint colours?', 'It gives the HEX and RGB values you can type into a paint company’s colour finder. Lighting affects the reading, so always check a sample in person.'],
        ['Is the camera picture uploaded?', 'No. The colour is measured in your browser. Nothing is recorded or sent anywhere.'],
        ['Can I pick colours from a photo instead?', 'Yes. Use the image color picker to upload a photo and click any pixel to get its colour.'],
    ],
    'aka' => ['Live Camera Color Finder', 'Webcam HEX Color Picker'],
];
