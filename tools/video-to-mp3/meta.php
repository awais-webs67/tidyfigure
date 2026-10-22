<?php
// Video to MP3 Converter: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Video to MP3 Converter',
  'category' => 'media',
  'order' => 1,
  'icon' => 'file-music',
  'popular' => true,
  'files' => true,
  'scripts' => ['media.js'],
  'appCategory' => 'MultimediaApplication',
  'keywords' => 'mp4 to mp3 extract audio from video convert video to audio sound wav mov webm music',
  'short' => 'Pull the sound out of any video as an MP3 or WAV, at the quality you choose.',
  'title' => 'Video to MP3 Converter: Extract Audio from MP4, MOV & WebM',
  'description' => <<<'EOT_TF'
Convert MP4, MOV, WebM or MKV video to MP3 or WAV in your browser. Choose 96 to 320 kbps, stereo or mono, and cut a part. No upload, no sign-up.
EOT_TF,
  'related' => ['audio-cutter', 'video-compressor', 'video-cutter'],
  'answer' => <<<'EOT_TF'
To turn a video into an MP3, choose the video file below, pick a quality (192 kbps is a good default) and download the MP3. The converter reads the video's sound track <strong>on your device</strong>, so nothing is uploaded, and you can keep the whole track or set a start and end time to save just one part.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>How to convert a video to MP3</h2>
<ol>
<li>Drop a video into the box, or tap it to choose one from your phone or computer. MP4, MOV (iPhone), WebM and MKV all work, and so do audio files such as M4A, WAV or OGG.</li>
<li>Choose <strong>MP3</strong> for a small file that plays everywhere, or <strong>WAV</strong> if you plan to edit the sound and want no quality loss.</li>
<li>Pick a quality and stereo or mono. The file updates straight away.</li>
<li>Optional: type a start and end time, like <code>1:05</code> and <code>2:30</code>, to keep only that part.</li>
<li>Press play to check it, then download.</li>
</ol>

<h2>Which MP3 quality should I choose?</h2>
<p>MP3 quality is measured in <strong>kilobits per second (kbps)</strong>: how much data is used for each second of sound. More data keeps more detail, but makes a bigger file.</p>
<div class="scroll"><table class="tbl">
<thead><tr><th>Bitrate</th><th>Good for</th><th class="n">Size per minute</th></tr></thead>
<tbody>
<tr><td>96 kbps</td><td>Speech, lectures, podcasts, voice notes</td><td class="n">0.7 MB</td></tr>
<tr><td>128 kbps</td><td>Everyday listening on a phone</td><td class="n">0.96 MB</td></tr>
<tr><td>192 kbps</td><td>Music; most people can't hear the difference from the original</td><td class="n">1.44 MB</td></tr>
<tr><td>256 kbps</td><td>Music on good headphones</td><td class="n">1.92 MB</td></tr>
<tr><td>320 kbps</td><td>The highest MP3 quality</td><td class="n">2.4 MB</td></tr>
</tbody></table></div>
<p>The size is simple to work out: <code>kbps × seconds ÷ 8 = kilobytes</code>. A 4-minute song at 192 kbps is 192 × 240 ÷ 8 = 5,760 KB, about 5.8 MB.</p>
<p>One thing to know: converting can't add quality that isn't there. If a phone recorded the video's sound at about 128 kbps, saving it at 320 kbps makes a bigger file that sounds the same. For most phone videos, 192 kbps is plenty.</p>

<h2>Stereo or mono?</h2>
<p>Stereo keeps separate left and right channels, which matters for music. Speech recorded on one microphone sounds the same in mono, and a mono MP3 at the same bitrate spends all its data on one channel, so you can also choose a lower bitrate. For a lecture or interview, mono at 96 kbps gives a small file that still sounds clear.</p>

<h2>MP3 or WAV?</h2>
<p><strong>MP3</strong> is compressed: it throws away sounds people can't easily hear, which makes the file about ten times smaller. It plays on every phone, car and computer. <strong>WAV</strong> is uncompressed: it keeps every sample exactly, so it's the better choice if you'll edit the audio in a program like Audacity, GarageBand or a video editor. A minute of stereo WAV is about 10 MB.</p>

<h2>Private by design</h2>
<p>Most online converters upload your video to their server, convert it there, and give you a download link. This one doesn't. Your browser decodes the video's sound track itself and the MP3 encoder runs on your device, so the file never leaves it. That also makes it quicker for big videos, because there is no upload to wait for.</p>
<p>Very long videos (over an hour) need a lot of memory, because the whole sound track is decoded at once. If your phone struggles, try it on a computer, or set a start and end time to convert one part at a time.</p>

<h2>Using the audio you extract</h2>
<p>Use this for videos you recorded yourself, such as a voice memo filmed on your phone, a lecture you're allowed to record, a family video, or your own music performance. Music and films made by other people are usually protected by copyright, so check you have permission before you copy or share their sound.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I convert MP4 to MP3?',
      <<<'EOT_TF'
Choose the MP4 file above, pick a quality such as 192 kbps, and press Download MP3. The conversion happens in your browser in a few seconds.
EOT_TF,
    ],
    [
      'Does this upload my video?',
      'No. The sound track is read and converted on your own device. The video is never sent to a server.',
    ],
    [
      'What is the best MP3 quality?',
      <<<'EOT_TF'
320 kbps is the highest MP3 quality. For most music 192 kbps sounds the same to most people and makes a smaller file. For speech, 96 kbps is enough.
EOT_TF,
    ],
    [
      'Can I convert only part of a video?',
      'Yes. Type a start and end time, such as 0:30 and 1:45, and only that part is saved.',
    ],
    [
      'Does it work on iPhone and Android?',
      <<<'EOT_TF'
Yes. It works in Safari, Chrome and other modern browsers on phones, tablets and computers. iPhone MOV videos are supported.
EOT_TF,
    ],
  ],
];
