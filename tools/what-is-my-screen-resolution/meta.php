<?php
// What Is My Screen Resolution: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'What Is My Screen Resolution',
  'category' => 'device',
  'order' => 4,
  'popular' => true,
  'icon' => 'monitor',
  'keywords' => 'what is my screen resolution screen size my resolution display resolution viewport size device pixel ratio refresh rate',
  'short' => 'See your screen resolution, window size, pixel ratio and refresh rate.',
  'title' => 'What Is My Screen Resolution? Check It Instantly',
  'description' => <<<'EOT_TF'
See your screen resolution, real pixel size, browser window size, pixel ratio, aspect ratio and refresh rate at a glance. Updates live as you resize.
EOT_TF,
  'related' => ['keyboard-test', 'webcam-test', 'image-resizer', 'cps-test'],
  'answer' => <<<'EOT_TF'
Your screen resolution is shown in large numbers at the top. Computers and phones report a <strong>CSS resolution</strong> (the size web pages see) and a <strong>pixel ratio</strong>; multiply them for the screen’s real pixels. The browser window size updates live as you resize, and the refresh rate is measured in about a second.
EOT_TF,
  'article' => <<<'EOT_TF'
<h2>Screen resolution, real pixels and window size</h2>
<ul>
<li><strong>Screen resolution (CSS pixels):</strong> the size your operating system tells websites, after display scaling. A laptop with a 1920×1080 panel at 125% scaling reports 1536×864.</li>
<li><strong>Device pixel ratio:</strong> how many real pixels make up one CSS pixel. Phones and Retina screens use 2 or 3.</li>
<li><strong>Real (physical) pixels:</strong> CSS resolution × pixel ratio. This is the number on the box, such as 2560×1440 or 3840×2160.</li>
<li><strong>Browser window (viewport):</strong> the space a web page actually has. It changes when you resize the window or show the bookmarks bar.</li>
</ul>

<h2>Common screen resolutions</h2>
<div class="scroll"><table class="tbl"><thead><tr><th>Name</th><th>Resolution</th><th>Aspect ratio</th></tr></thead><tbody>
<tr><td>HD</td><td>1366×768</td><td>16:9</td></tr>
<tr><td>Full HD (1080p)</td><td>1920×1080</td><td>16:9</td></tr>
<tr><td>WUXGA</td><td>1920×1200</td><td>16:10</td></tr>
<tr><td>QHD / 2K (1440p)</td><td>2560×1440</td><td>16:9</td></tr>
<tr><td>UltraWide QHD</td><td>3440×1440</td><td>21:9</td></tr>
<tr><td>4K UHD</td><td>3840×2160</td><td>16:9</td></tr>
<tr><td>MacBook Air 13″</td><td>2560×1664 (shown as 1280×832)</td><td>16:10</td></tr>
</tbody></table></div>

<h2>Refresh rate</h2>
<p>The refresh rate is how many times per second your screen redraws: 60 Hz on most screens, 90–144 Hz or more on gaming monitors and recent phones. The tool measures it by counting the frames your browser draws in one second. If it shows 60 on a 144 Hz monitor, check the monitor setting in Windows (Settings → System → Display → Advanced display) or macOS (Displays → Refresh rate), and that the cable supports the higher rate.</p>

<h2>Why designers and support teams ask for it</h2>
<p>Web designers test layouts at common window sizes, and support teams ask for your resolution to reproduce a display problem. Copy the summary with one click and paste it into your message.</p>
EOT_TF,
  'faqs' => [
    [
      'What is my screen resolution?',
      <<<'EOT_TF'
It’s shown at the top of this page as soon as it opens. The real pixel count is the CSS resolution multiplied by the device pixel ratio, which is also shown.
EOT_TF,
    ],
    [
      'Why is my resolution lower than my monitor’s?',
      <<<'EOT_TF'
Display scaling. At 125% or 150% scaling, Windows reports a smaller size to websites so text isn’t tiny. The real pixel number accounts for this.
EOT_TF,
    ],
    [
      'What is device pixel ratio?',
      <<<'EOT_TF'
The number of physical pixels in one CSS pixel. A ratio of 2 means each point on a web page is drawn with 2×2 real pixels, which makes text sharper.
EOT_TF,
    ],
    [
      'How is the refresh rate measured?',
      <<<'EOT_TF'
By counting how many frames the browser draws in one second. It matches your screen’s refresh rate unless the browser is busy or in power-saving mode.
EOT_TF,
    ],
    [
      'Does this work on phones?',
      <<<'EOT_TF'
Yes. Phones show their CSS size, pixel ratio and real pixels. Turn the phone to see the size change with orientation.
EOT_TF,
    ],
  ],
];
