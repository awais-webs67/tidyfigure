<?php
// Webcam Test: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Webcam Test',
  'category' => 'device',
  'order' => 2,
  'popular' => true,
  'icon' => 'webcam',
  'keywords' => 'webcam test camera test online check my camera is my webcam working camera resolution fps test',
  'aka' => ['camera test', 'webcam checker', 'test my camera'], // other names people search for
  'short' => 'See your camera live and check its resolution and frame rate.',
  'title' => 'Webcam Test: Check Your Camera Online, Free',
  'description' => <<<'EOT_TF'
Check your webcam before a call: live preview, real resolution and frame rate, the best quality it supports, and a snapshot to save. Nothing is uploaded.
EOT_TF,
  'related' => ['mic-test', 'online-mirror', 'camera-color-picker', 'screen-recorder'],
  'answer' => <<<'EOT_TF'
Click <strong>Start webcam test</strong> and allow camera access. If you see yourself, the camera works. The tool shows the real resolution and frames per second your camera delivers, tests the highest quality it supports (HD, Full HD, 4K) and lets you save a snapshot. The video never leaves your device.
EOT_TF,
  'article' => <<<'EOT_TF'
<h2>How to test your webcam</h2>
<ol>
<li>Click <strong>Start webcam test</strong> and choose <strong>Allow</strong> when the browser asks to use the camera.</li>
<li>Check the picture: it should be sharp, well lit and smooth.</li>
<li>Read the resolution and frame rate on the right. Click <strong>Find the best quality</strong> to see the highest resolution your camera supports.</li>
<li>Have more than one camera? Pick it in the <strong>Camera</strong> list. On a phone this switches between the front and back camera.</li>
</ol>

<h2>What the numbers mean</h2>
<div class="scroll"><table class="tbl"><thead><tr><th>Name</th><th>Resolution</th><th>Typical use</th></tr></thead><tbody>
<tr><td>VGA</td><td>640×480</td><td>Old or basic webcams</td></tr>
<tr><td>HD (720p)</td><td>1280×720</td><td>Most laptop cameras, fine for calls</td></tr>
<tr><td>Full HD (1080p)</td><td>1920×1080</td><td>Good external webcams, streaming</td></tr>
<tr><td>4K</td><td>3840×2160</td><td>High-end webcams and phone cameras</td></tr>
</tbody></table></div>
<p><strong>Frame rate</strong> is how many pictures per second the camera sends. 30 fps looks smooth; 15 fps or less looks choppy. Webcams often drop to a lower frame rate in dim light to collect more light per frame, so a slow frame rate is often fixed by turning on a lamp.</p>

<h2>Camera not working? Try these fixes</h2>
<ul>
<li><strong>Access blocked:</strong> click the camera or lock icon next to the web address and set Camera to Allow, then try again.</li>
<li><strong>Windows:</strong> Settings → Privacy &amp; security → Camera: turn on camera access for apps and for your browser. Some laptops also have a camera key (often F8 or F10) or a privacy shutter over the lens.</li>
<li><strong>Mac:</strong> System Settings → Privacy &amp; Security → Camera: turn on your browser.</li>
<li><strong>“Camera is busy”:</strong> only one app can use most webcams at a time. Close Zoom, Teams, Skype, OBS or other tabs and try again.</li>
<li><strong>Black picture:</strong> check the lens cover, then unplug and replug a USB webcam or try another port.</li>
</ul>

<h2>Private by design</h2>
<p>The video is shown only on your screen. It isn’t recorded or sent anywhere, and the camera turns off as soon as you click Stop or leave the page. Snapshots are saved straight to your device.</p>
EOT_TF,
  'faqs' => [
    [
      'How can I check if my webcam is working?',
      <<<'EOT_TF'
Click Start webcam test and allow the camera. If you see a live picture of yourself, the webcam works. The tool also shows its resolution and frame rate.
EOT_TF,
    ],
    [
      'What resolution is my webcam?',
      <<<'EOT_TF'
The tool shows the resolution your camera is sending right now. Click Find the best quality to test HD, Full HD and 4K and see the highest one it supports.
EOT_TF,
    ],
    [
      'Why does my webcam look dark or choppy?',
      <<<'EOT_TF'
Most webcams lower the frame rate in dim light. Turn on a lamp in front of you (not behind you) and the picture usually becomes brighter and smoother.
EOT_TF,
    ],
    [
      'Is the video recorded or uploaded?',
      <<<'EOT_TF'
No. The picture is only shown in your browser. Nothing is recorded or sent to a server, and the camera turns off when you stop the test or close the page.
EOT_TF,
    ],
    [
      'Why does it say my camera is busy?',
      <<<'EOT_TF'
Another app or tab is using the camera. Close video-call apps such as Zoom, Teams or Skype and any other tabs that use the camera, then try again.
EOT_TF,
    ],
  ],
];
