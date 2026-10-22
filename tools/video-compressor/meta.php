<?php
// Video Compressor: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Video Compressor',
  'category' => 'media',
  'order' => 2,
  'icon' => 'file-video',
  'popular' => true,
  'files' => true,
  'scripts' => ['media.js'],
  'appCategory' => 'MultimediaApplication',
  'keywords' => 'compress mp4 reduce video size mb whatsapp email discord shrink video file smaller 720p 480p',
  'short' => 'Make a video file smaller for WhatsApp, email or Discord, with your choice of quality.',
  'title' => 'Video Compressor: Reduce MP4 & MOV File Size Online, Free',
  'description' => <<<'EOT_TF'
Compress MP4, MOV and WebM videos in your browser. Pick 1080p, 720p or 480p, a quality level or a target size in MB. No upload, no watermark.
EOT_TF,
  'related' => ['video-cutter', 'video-to-mp3', 'image-compressor'],
  'answer' => <<<'EOT_TF'
To compress a video, choose it below, pick a lower resolution (720p suits most phones and chats) and a quality level, then press <strong>Compress video</strong>. You can also type a target size, such as 25 MB, and the bitrate is set to hit it. The video is processed on your device and never uploaded.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>What makes a video file big?</h2>
<p>A video's size depends on three things: how long it is, its <strong>resolution</strong> (how many pixels each frame has), and its <strong>bitrate</strong> (how much data is used for each second). Modern phones film in 1080p or 4K at very high bitrates, often 15 to 50 megabits per second, so a one-minute clip can be 100 MB or more. That's far more detail than you need to watch it on a phone screen or send it in a chat.</p>
<div class="formula">File size (MB) ≈ (video bitrate + audio bitrate) in Mbps × seconds ÷ 8

Example: 2.5 Mbps video + 0.128 Mbps audio, 60 seconds
(2.5 + 0.128) × 60 ÷ 8 = 19.7 MB</div>

<h2>How to choose the settings</h2>
<div class="scroll"><table class="tbl">
<thead><tr><th>Resolution</th><th>Best for</th><th class="n">Typical bitrate</th><th class="n">Per minute</th></tr></thead>
<tbody>
<tr><td>1080p</td><td>Watching on a laptop or TV</td><td class="n">4–6 Mbps</td><td class="n">30–45 MB</td></tr>
<tr><td>720p</td><td>Phones, WhatsApp, email, websites</td><td class="n">2–3 Mbps</td><td class="n">15–22 MB</td></tr>
<tr><td>480p</td><td>Small attachments, slow connections</td><td class="n">1 Mbps</td><td class="n">7–8 MB</td></tr>
<tr><td>360p</td><td>Smallest possible file</td><td class="n">0.5 Mbps</td><td class="n">4–5 MB</td></tr>
</tbody></table></div>
<p><strong>Medium quality at 720p</strong> is the best starting point: on a phone it looks almost the same as the original and is usually 70–90% smaller. If you need to fit a size limit, type it in the target size box and the tool works out the bitrate for you. Keep in mind that a very low target for a long video will look blocky.</p>

<h2>Common size limits</h2>
<ul>
<li><strong>Email attachments:</strong> usually 20–25 MB (Gmail and Outlook).</li>
<li><strong>Discord:</strong> 10 MB on free accounts.</li>
<li><strong>WhatsApp:</strong> compresses videos itself, but sending a smaller file is faster and keeps more control over quality.</li>
</ul>
<p>Limits change from time to time, so check the app if a file is rejected.</p>

<h2>Why does it take as long as the video?</h2>
<p>Desktop video software can compress faster than real time because it runs a dedicated encoder. A web page can't do that without uploading your file, so this tool uses your browser's built-in video recorder: it plays the video once in the background and records it again at the new size and bitrate. A 3-minute video takes about 3 minutes. The benefit is privacy and no upload wait. Keep the tab open and visible until it finishes, because some browsers slow down background tabs.</p>

<h2>MP4 or WebM?</h2>
<p>Safari and recent versions of Chrome save an <strong>MP4</strong> file, which plays everywhere. Other browsers save <strong>WebM</strong>, an open format that plays in Chrome, Firefox, Edge, Android, VLC and on most websites, including YouTube. If you need MP4 specifically for an older device, use Safari or an up-to-date Chrome.</p>

<h2>Tips for the smallest file that still looks good</h2>
<ul>
<li>Cut the parts you don't need first with the <a href="/video-cutter">video cutter</a>. A shorter video is the easiest saving.</li>
<li>Remove the sound if it isn't needed, such as for a screen recording or a product clip on a website.</li>
<li>Videos with lots of movement (sports, shaky phone footage) need more bitrate than calm ones (talking heads, slides).</li>
</ul>
EOT_TF,
  'faqs' => [
    [
      'How can I reduce the size of a video?',
      <<<'EOT_TF'
Lower its resolution (for example 1080p to 720p) and its bitrate. Choose those settings above and press Compress video. A 720p medium-quality video is usually 70–90% smaller than a phone original.
EOT_TF,
    ],
    [
      'How do I compress a video to 25 MB for email?',
      <<<'EOT_TF'
Type 25 in the target size box. The tool sets the bitrate so the finished file comes out just under 25 MB.
EOT_TF,
    ],
    [
      'Is my video uploaded?',
      'No. The video is re-recorded inside your browser, on your device. It is never sent to a server.',
    ],
    [
      'Why is compression slow?',
      <<<'EOT_TF'
The browser plays the video once to re-record it, so it takes about as long as the video. Keep the tab open until it finishes.
EOT_TF,
    ],
    [
      'Will the compressed video have a watermark?',
      'No. There is no watermark, no sign-up and no limit on how many videos you compress.',
    ],
  ],
];
