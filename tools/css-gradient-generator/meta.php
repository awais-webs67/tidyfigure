<?php
// CSS Gradient Generator: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'CSS Gradient Generator',
  'category' => 'dev',
  'order' => 5,
  'icon' => 'blend',
  'keywords' => <<<'EOT_TF'
css gradient generator linear gradient radial gradient conic gradient background css code color gradient maker
EOT_TF,
  'short' => 'Design linear, radial and conic gradients and copy the CSS, or save a PNG.',
  'title' => 'CSS Gradient Generator: Linear, Radial & Conic, Free',
  'description' => <<<'EOT_TF'
Create beautiful CSS gradients with any colours, angle and transparency. Live preview, presets and random ideas. Copy the CSS code or download a 1920×1080 PNG.
EOT_TF,
  'related' => ['color-converter', 'image-color-picker', 'favicon-generator'],
  'answer' => <<<'EOT_TF'
Pick a type (linear, radial or conic), set the angle and add colour stops, then copy the CSS. A two-colour linear gradient looks like <code>background: linear-gradient(135deg, #ff5b35 0%, #ffb347 100%);</code>. The generated code also includes a solid fallback colour, and you can download the gradient as a 1920×1080 PNG for slides or wallpapers.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>The three kinds of CSS gradient</h2>
<div class="formula">linear-gradient(135deg, #ff5b35 0%, #ffb347 100%)
   → colours change along a straight line at an angle

radial-gradient(circle, #4facfe 0%, #00f2fe 100%)
   → colours spread outwards from the centre

conic-gradient(from 0deg, red, yellow, lime, aqua, blue, magenta, red)
   → colours sweep around the centre, like a colour wheel or pie chart</div>

<h2>Angles in linear gradients</h2>
<p>In CSS, <strong>0deg points up</strong> and angles go clockwise: 90deg goes left to right, 180deg top to bottom, and 135deg from the top-left corner to the bottom-right. You can also write directions in words, like <code>to right</code> or <code>to bottom left</code>.</p>

<h2>Colour stops</h2>
<p>Each stop is a colour and a position (0% is the start, 100% the end). Between stops the colours blend smoothly. Some tricks:</p>
<ul>
<li><strong>Hard edges:</strong> put two stops at the same position, like <code>#ff5b35 50%, #191f24 50%</code>, for a sharp split with no blend.</li>
<li><strong>Transparency:</strong> lower a stop's opacity to fade into the background. This is great for darkening the bottom of a photo so text on it stays readable.</li>
<li><strong>Three or more colours</strong> make richer backgrounds. Keep them in the same hue family to avoid muddy middles.</li>
</ul>

<h2>Text over a gradient</h2>
<div class="formula">.hero {
  background: linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,.7) 100%),
              url(photo.jpg) center / cover;
}</div>
<p>Several backgrounds can be layered by separating them with commas: the first one is drawn on top. Check that text has enough contrast at both ends of the gradient.</p>

<h2>Gradient text</h2>
<div class="formula">.title {
  background: linear-gradient(90deg, #ff5b35, #ffb347);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}</div>

<h2>Browser support</h2>
<p>Linear and radial gradients work in every browser in use today without prefixes. Conic gradients have worked in all major browsers since 2020. The first <code>background:</code> line in the generated CSS is a solid colour that very old browsers use instead.</p>

<h2>Tips for good gradients</h2>
<ul>
<li>Neighbouring hues (orange to yellow, blue to cyan) blend more cleanly than opposites (red to green), which can turn grey in the middle.</li>
<li>Subtle gradients, two shades of the same colour, look more professional for buttons and cards than bold rainbows.</li>
<li>Use the <a href="/color-converter">colour converter</a> to get HEX, RGB or HSL codes from your brand colours.</li>
</ul>
EOT_TF,
  'faqs' => [
    [
      'How do I make a gradient in CSS?',
      <<<'EOT_TF'
Use background: linear-gradient(angle, colour1, colour2). For example: background: linear-gradient(90deg, #ff5b35, #ffb347);
EOT_TF,
    ],
    [
      'What is the difference between linear, radial and conic gradients?',
      <<<'EOT_TF'
Linear changes along a line, radial spreads out from a centre point, and conic sweeps around a centre like a pie chart.
EOT_TF,
    ],
    [
      'How do I make a transparent gradient?',
      'Lower the opacity of a colour stop. The CSS uses rgba() colours that fade into whatever is behind.',
    ],
    [
      'Can I download the gradient as an image?',
      'Yes. Download PNG saves it at 1920×1080, ready for slides, wallpapers or social posts.',
    ],
    [
      'Do CSS gradients work in all browsers?',
      'Yes. Linear, radial and conic gradients work in all current browsers without prefixes.',
    ],
  ],
];
