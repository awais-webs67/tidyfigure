<?php
// Screen Recorder: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Screen Recorder',
  'category' => 'media',
  'order' => 7,
  'icon' => 'monitor-dot',
  'scripts' => ['media.js'],
  'appCategory' => 'MultimediaApplication',
  'keywords' => <<<'EOT_TF'
online screen recorder record screen with audio capture tab window webcam tutorial chrome no download
EOT_TF,
  'short' => 'Record your screen, a window or a browser tab with sound. No app, no watermark.',
  'title' => 'Free Online Screen Recorder: Record Screen with Audio',
  'description' => <<<'EOT_TF'
Record your whole screen, one window or a browser tab with system sound and your microphone, right in the browser. No install, no watermark, no time limit.
EOT_TF,
  'related' => ['voice-recorder', 'video-cutter', 'video-compressor'],
  'answer' => <<<'EOT_TF'
To record your screen, press <strong>Start screen recording</strong>, choose the screen, window or tab to share, and do what you want to record. Press <strong>Stop recording</strong> (or the browser's Stop sharing button) and download the video. It works in Chrome, Edge, Firefox and Safari on computers, with no app to install and no watermark.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>How to record your screen</h2>
<ol>
<li>Choose your options: tick <strong>Record my microphone</strong> to talk over the recording, and keep <strong>Record system or tab sound</strong> on to capture the sound from a video or app.</li>
<li>Press <strong>Start screen recording</strong>. Your browser shows a window asking what to share: the <strong>entire screen</strong>, a <strong>window</strong> (one app), or a <strong>Chrome tab</strong>.</li>
<li>After the countdown, do what you want to record.</li>
<li>Press <strong>Stop recording</strong> here or the browser's <strong>Stop sharing</strong> bar. The video appears with a download button.</li>
</ol>

<h2>Screen, window or tab?</h2>
<div class="scroll"><table class="tbl">
<thead><tr><th>Option</th><th>Records</th><th>Best for</th></tr></thead>
<tbody>
<tr><td>Entire screen</td><td>Everything you see, including notifications</td><td>Moving between several apps</td></tr>
<tr><td>Window</td><td>One app, even when other windows cover it</td><td>Software tutorials, keeping other apps private</td></tr>
<tr><td>Browser tab</td><td>One tab and its sound</td><td>Web demos, online meetings, recording a web video's audio</td></tr>
</tbody></table></div>

<h2>Recording sound</h2>
<p>Browsers limit what sound a web page can capture. In <strong>Chrome and Edge</strong>, sharing a tab can include that tab's sound, and on Windows sharing the entire screen can include all system sound. On a <strong>Mac</strong>, browsers can usually capture tab sound only. <strong>Firefox and Safari</strong> currently don't capture screen sound. Your microphone works in all of them. If you need sound from a desktop app on a Mac, play it in a browser tab or use the Mac's own screen recorder (Shift + Command + 5).</p>

<h2>Phones and tablets</h2>
<p>Mobile browsers don't let websites record the screen, so use the recorder built into your phone:</p>
<ul>
<li><strong>iPhone and iPad:</strong> open Control Centre and tap the Screen Recording button (add it in Settings → Control Centre if it's missing).</li>
<li><strong>Android:</strong> swipe down twice and tap <strong>Screen record</strong> in Quick Settings.</li>
</ul>

<h2>File size and format</h2>
<p>At High quality (5 Mbps), a minute of recording is about 37 MB. Screen recordings of documents and slides are usually smaller, because little changes between frames. The video is saved as MP4 in Safari and recent Chrome, and WebM in other browsers. Both upload to YouTube, Google Drive, Slack and most other sites. Use the <a href="/video-compressor">video compressor</a> to make a long recording smaller, or the <a href="/video-cutter">video cutter</a> to trim the start and end.</p>

<h2>Tips for a clean tutorial</h2>
<ul>
<li>Close unrelated tabs and turn on Do Not Disturb, so notifications don't appear in the video.</li>
<li>Make text bigger (Ctrl or Cmd and +) so it's readable on small screens.</li>
<li>Plan the steps first and move the mouse slowly. Viewers follow the pointer.</li>
<li>Use a headset microphone for clearer narration.</li>
</ul>
<p>Your recording is made on your device and never uploaded.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I record my screen with audio?',
      <<<'EOT_TF'
Tick Record system or tab sound (and the microphone if you want to talk), press Start, choose a tab or your entire screen, and make sure the share audio option is ticked in the browser window.
EOT_TF,
    ],
    [
      'Is there a time limit or watermark?',
      <<<'EOT_TF'
No. There is no watermark and no fixed time limit. Long recordings use more memory, so very long sessions are best split into parts.
EOT_TF,
    ],
    [
      'Can I record my screen on a phone?',
      <<<'EOT_TF'
Mobile browsers don’t allow it. Use the screen recorder built into iPhone (Control Centre) or Android (Quick Settings).
EOT_TF,
    ],
    [
      'Do I need to install anything?',
      'No. It works in Chrome, Edge, Firefox and Safari on Windows, Mac, Linux and ChromeOS.',
    ],
    [
      'Is the recording uploaded?',
      'No. The video is recorded on your device and you download it directly.',
    ],
  ],
];
