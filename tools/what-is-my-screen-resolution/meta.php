<?php
return [
    'name' => 'What Is My Screen Resolution',
    'updated' => '2026-11-15',
    'category' => 'device',
    'order' => 4,
    'popular' => true,
    'icon' => 'monitor',
    'keywords' => 'what is my screen resolution, viewport size checker, device pixel ratio, screen refresh rate test, display pixels',
    'short' => 'See your screen resolution, window size, pixel ratio and refresh rate.',
    'title' => 'What Is My Screen Resolution? – Viewport & DPR',
    'description' => 'See physical screen pixel resolution, active browser viewport dimensions, device pixel ratio (DPR), aspect ratio and refresh rate live.',
    'related' => ['keyboard-test', 'webcam-test', 'image-resizer', 'cps-test'],
    'answer' => 'Your screen resolution is shown in large numbers at the top. Computers and phones report a <strong>CSS resolution</strong> (the size web pages see) and a <strong>pixel ratio</strong>; multiply them for the screen’s real pixels. The browser window size updates live as you resize, and the refresh rate is measured in about a second.',
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

<h2>Why CSS Viewport Pixels Differ From Physical Panel Pixels</h2>
<p>On a Retina MacBook or modern smartphone with a <code>2x</code> or <code>3x</code> device pixel ratio, a browser reports a crisp CSS viewport (for example 390×844 on mobile or 1440×900 on laptop) while the physical OLED or IPS matrix drives four to nine hardware sub-pixels per CSS pixel—essential context when reporting UI bugs or choosing responsive image widths.</p>
EOT_TF,
    'faqs' => [
        ['What is my screen resolution?', 'It’s shown at the top of this page as soon as it opens. The real pixel count is the CSS resolution multiplied by the device pixel ratio, which is also shown.'],
        ['Why is my resolution lower than my monitor’s?', 'Display scaling. At 125% or 150% scaling, Windows reports a smaller size to websites so text isn’t tiny. The real pixel number accounts for this.'],
        ['What is device pixel ratio?', 'The number of physical pixels in one CSS pixel. A ratio of 2 means each point on a web page is drawn with 2×2 real pixels, which makes text sharper.'],
        ['How is the refresh rate measured?', 'By counting how many frames the browser draws in one second. It matches your screen’s refresh rate unless the browser is busy or in power-saving mode.'],
        ['Does this work on phones?', 'Yes. Phones show their CSS size, pixel ratio and real pixels. Turn the phone to see the size change with orientation.'],
        ['Why does my screen show lower resolution numbers than the manufacturer spec?', 'HiDPI scaling divides hardware pixels by your device pixel ratio (often 1.5x or 2x) to produce crisp CSS viewport dimensions for readable text.'],
    ],
    'aka' => ['Screen Resolution Checker', 'Viewport Size Detector'],
];
