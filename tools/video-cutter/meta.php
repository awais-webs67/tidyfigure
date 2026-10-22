<?php
// Video Cutter: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Video Cutter',
  'category' => 'media',
  'order' => 3,
  'icon' => 'scissors',
  'files' => true,
  'scripts' => ['media.js'],
  'appCategory' => 'MultimediaApplication',
  'keywords' => 'trim video cut mp4 clip shorten video online crop length split video part',
  'short' => 'Trim the start and end off a video and save just the part you want.',
  'title' => 'Video Cutter: Trim & Cut MP4 Videos Online, No Upload',
  'description' => <<<'EOT_TF'
Cut a part out of any MP4, MOV or WebM video in your browser. Drag to choose the start and end, preview it and download the clip. Free, no watermark.
EOT_TF,
  'related' => ['video-compressor', 'video-to-gif', 'video-to-mp3'],
  'answer' => <<<'EOT_TF'
To cut a video, choose it below, drag the two sliders (or type times like <strong>0:12</strong> and <strong>0:45</strong>) to mark the part you want to keep, press <strong>Play selection</strong> to check it, then <strong>Cut video</strong>. The clip is made on your device, with no upload and no watermark.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>How to trim a video</h2>
<ol>
<li>Drop the video in the box or tap to choose it. Phone videos (MP4 and iPhone MOV) and WebM files work.</li>
<li>Drag the left slider to where the clip should start and the right slider to where it should end. For precise cuts, pause the video on the exact frame and press <strong>Set start here</strong> or <strong>Set end here</strong>, or type the times.</li>
<li>Press <strong>Play selection</strong> to watch just that part.</li>
<li>Press <strong>Cut video</strong>. When it's done, play the clip and download it.</li>
</ol>

<h2>Typing exact times</h2>
<p>Times use minutes and seconds, with an optional decimal for tenths of a second:</p>
<div class="formula">0:05      → 5 seconds
1:30      → 1 minute 30 seconds
1:30.5    → 1 minute 30.5 seconds
1:02:03   → 1 hour, 2 minutes, 3 seconds
95        → 95 seconds (1:35)</div>

<h2>Why the cut takes as long as the clip</h2>
<p>The cutter works without uploading your video, which means it can only use what your browser offers. It plays the part you chose once and records it into a new file at the original resolution. A 30-second clip takes about 30 seconds. Keep the tab open and on screen while it runs, as some browsers slow down tabs in the background.</p>
<p>Because the clip is recorded again, the cut can land on any frame you choose. Simple "lossless" cutters can only cut at keyframes, which are often a few seconds apart, so their clips start early or late.</p>

<h2>Quality and file size</h2>
<p><strong>Same as original</strong> keeps the resolution and uses a high bitrate, so the clip looks like the source. <strong>Smaller file</strong> uses about 40% less data, which is plenty for sharing in a chat. To shrink a video further, run the clip through the <a href="/video-compressor">video compressor</a> afterwards and choose 720p or 480p.</p>

<h2>Ideas for using the video cutter</h2>
<ul>
<li>Cut a long phone recording down to the moment that matters before sending it.</li>
<li>Make a short clip for a status, story or reel (most allow 15 to 90 seconds).</li>
<li>Remove the fumbling at the start and end of a screen recording.</li>
<li>Pull a highlight from a sports or school event video.</li>
<li>Turn the clip into a looping animation with the <a href="/video-to-gif">video to GIF maker</a>, or keep only its sound with <a href="/video-to-mp3">video to MP3</a>.</li>
</ul>

<h2>File formats</h2>
<p>The clip is saved as <strong>MP4</strong> in Safari and recent Chrome, and as <strong>WebM</strong> in other browsers. WebM plays in Chrome, Firefox, Edge, Android, VLC and on almost every website, including YouTube and WhatsApp Web.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I cut part of a video?',
      <<<'EOT_TF'
Choose the video, drag the sliders to the start and end of the part you want, press Play selection to check, then press Cut video and download the clip.
EOT_TF,
    ],
    [
      'Can I cut a video on my phone?',
      <<<'EOT_TF'
Yes. The cutter works in Safari and Chrome on iPhone and Android. Use the Set start and Set end buttons for precise cuts on a small screen.
EOT_TF,
    ],
    [
      'Does cutting reduce quality?',
      <<<'EOT_TF'
With Same as original selected, the clip keeps the original resolution and a high bitrate, so it looks the same. Choose Smaller file for a lighter clip.
EOT_TF,
    ],
    [
      'Is my video uploaded?',
      'No. The video is cut inside your browser and never leaves your device.',
    ],
    [
      'Is there a watermark or length limit?',
      <<<'EOT_TF'
No watermark and no sign-up. Very long videos take as long as the selected part to process, so cut long clips with the tab open.
EOT_TF,
    ],
  ],
];
