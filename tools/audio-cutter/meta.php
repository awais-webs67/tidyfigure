<?php
// Audio Cutter: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Audio Cutter',
  'updated' => '2026-10-22', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'media',
  'order' => 5,
  'icon' => 'audio-lines',
  'files' => true,
  'scripts' => ['media.js'],
  'appCategory' => 'MultimediaApplication',
  'keywords' => 'mp3 cutter trim audio cut song ringtone maker wav m4a fade in fade out online',
  'short' => 'Trim a song or recording, add a fade and save it as MP3 or WAV. Makes ringtones too.',
  'title' => 'Audio Cutter: Trim MP3 Songs & Make Ringtones Online, Free',
  'description' => <<<'EOT_TF'
Cut MP3, M4A, WAV and other audio files in your browser. Drag on the waveform, add fade in and out, and save as MP3 or WAV. Makes ringtones. No upload.
EOT_TF,
  'related' => ['video-to-mp3', 'voice-recorder', 'video-cutter'],
  'answer' => <<<'EOT_TF'
To cut an audio file, choose it below and drag across the waveform to select the part you want, or type the start and end times. Add a short fade so it doesn't start or stop abruptly, then press <strong>Cut audio</strong> and download the MP3 or WAV. The file stays on your device.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>How to cut an MP3</h2>
<ol>
<li>Drop a song, voice note or recording into the box. MP3, M4A (iPhone voice memos), WAV, OGG, FLAC and the sound of video files all work.</li>
<li>Drag across the waveform to select the part to keep. The orange area is your selection. For exact timing, type the start and end, such as <code>0:42.5</code>.</li>
<li>Press <strong>Play selection</strong> to listen. Press it again to stop.</li>
<li>Set a fade in and fade out if you want a smooth start and finish.</li>
<li>Choose MP3 or WAV and press <strong>Cut audio</strong>.</li>
</ol>

<h2>Reading the waveform</h2>
<p>The waveform is a picture of the sound: tall parts are loud and flat parts are quiet or silent. It helps you find the gaps between sentences in a speech or the moment a chorus starts in a song. Silence at the start of a recording shows as a flat line you can simply cut off.</p>

<h2>Why add a fade?</h2>
<p>When you cut in the middle of a sound, the clip starts or stops suddenly, which can sound like a click. A <strong>fade in</strong> turns the volume up smoothly from silence, and a <strong>fade out</strong> turns it down at the end. Half a second removes clicks; 2–3 seconds gives the gentle ending you hear on the radio.</p>

<h2>Making a ringtone</h2>
<p>Press <strong>Ringtone (first 30 s)</strong> to select 30 seconds from your start point with a 2-second fade out. Then:</p>
<ul>
<li><strong>Android:</strong> save as MP3, move it to your phone's Ringtones folder (or open it in Files), then pick it in Settings → Sound → Phone ringtone.</li>
<li><strong>iPhone:</strong> ringtones must be M4R files under 40 seconds, added with GarageBand or Finder/iTunes. Save as WAV here, then import the WAV into GarageBand on your iPhone and use Share → Ringtone.</li>
</ul>
<p>Ringtone steps vary between phone models and software versions.</p>

<h2>MP3 quality</h2>
<div class="scroll"><table class="tbl">
<thead><tr><th>Setting</th><th>Use it for</th><th class="n">1 minute</th></tr></thead>
<tbody>
<tr><td>MP3 128 kbps</td><td>Voice, ringtones, sharing</td><td class="n">0.96 MB</td></tr>
<tr><td>MP3 192 kbps</td><td>Music (most people can't tell it from the original)</td><td class="n">1.44 MB</td></tr>
<tr><td>MP3 320 kbps</td><td>Highest MP3 quality</td><td class="n">2.4 MB</td></tr>
<tr><td>WAV</td><td>Editing further without any loss</td><td class="n">10.1 MB</td></tr>
</tbody></table></div>
<p>If your original file is already a low-quality MP3, saving at 320 kbps won't make it sound better. Pick the same or one step higher than the original.</p>

<h2>Private and unlimited</h2>
<p>The audio is decoded and cut by your browser, on your device. Nothing is uploaded, there's no account, and there's no limit on how many files you cut.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I cut part of an MP3?',
      <<<'EOT_TF'
Choose the MP3, drag across the waveform to select the part you want, press Cut audio and download the new MP3.
EOT_TF,
    ],
    [
      'Can I make a ringtone with this?',
      <<<'EOT_TF'
Yes. Set the start point and press Ringtone (first 30 s). It selects 30 seconds with a fade out, ready to save as MP3.
EOT_TF,
    ],
    [
      'Does it lower the quality?',
      <<<'EOT_TF'
Choose WAV for no loss at all. MP3 at 192 or 320 kbps sounds the same as the original for most listeners.
EOT_TF,
    ],
    [
      'Which audio formats can I open?',
      <<<'EOT_TF'
MP3, M4A, AAC, WAV, OGG, Opus and FLAC, plus the sound track of MP4, MOV and WebM videos. Support depends a little on your browser.
EOT_TF,
    ],
    [
      'Is my file uploaded?',
      'No. Everything happens in your browser and the audio never leaves your device.',
    ],
  ],
];
