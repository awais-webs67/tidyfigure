<?php
// Voice Recorder: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Voice Recorder',
  'category' => 'media',
  'order' => 6,
  'icon' => 'mic',
  'scripts' => ['media.js'],
  'appCategory' => 'MultimediaApplication',
  'keywords' => 'online voice recorder record audio microphone mp3 mic test voice memo dictation',
  'short' => 'Record your voice from the microphone and download it as MP3. Free, no sign-up.',
  'title' => 'Online Voice Recorder: Record Audio & Save as MP3, Free',
  'description' => <<<'EOT_TF'
Record your voice with your microphone right in the browser. Pause and resume, see the sound level, and download as MP3. No sign-up and no upload.
EOT_TF,
  'related' => ['audio-cutter', 'screen-recorder', 'video-to-mp3'],
  'answer' => <<<'EOT_TF'
To record your voice online, press <strong>Start recording</strong>, allow the browser to use your microphone and speak. Press <strong>Stop & save</strong> when you're done, listen back, and download the recording as an MP3. Recordings stay on your device and are never uploaded.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>How to record audio online</h2>
<ol>
<li>Press <strong>Start recording</strong>. The first time, your browser asks for permission to use the microphone: choose <strong>Allow</strong>.</li>
<li>Speak, sing or play. The moving line shows the sound level, so you can check the microphone is picking you up.</li>
<li>Use <strong>Pause</strong> to take a break without starting a new file.</li>
<li>Press <strong>Stop & save</strong>. Listen to the recording, then download it as MP3, or in the browser's own format.</li>
</ol>
<p>Record as many takes as you like. Each one is listed with its own player and download buttons. They're kept only while the page is open, so download the ones you want before closing it.</p>

<h2>Getting a clear recording</h2>
<ul>
<li><strong>Distance:</strong> keep the microphone about a hand's width (10–20 cm) from your mouth. Too close and your breath pops; too far and the room echoes.</li>
<li><strong>Room:</strong> soft furnishings absorb echo. A bedroom with curtains, a bed and a wardrobe sounds better than a kitchen or bathroom.</li>
<li><strong>Headset or earphones:</strong> the microphone on wired earphones is close to your mouth and often sounds better than a laptop's built-in mic.</li>
<li><strong>Level:</strong> the wave should move clearly but not hit the top and bottom of the box. If it does, move back a little.</li>
<li><strong>Noise reduction:</strong> leave it on for speech. Turn it off for music, because it can treat sustained notes as noise and cut them.</li>
</ul>

<h2>MP3 or the original format?</h2>
<p>Browsers record in their own compressed formats: <strong>WebM/Opus</strong> in Chrome, Edge and Firefox, and <strong>M4A</strong> in Safari. These are small and good quality, but some older players and apps don't open WebM. The <strong>Download MP3</strong> button converts the recording to a 128 kbps MP3 on your device, which plays everywhere and is about 1 MB per minute.</p>

<h2>Uses for a voice recorder</h2>
<ul>
<li>Testing your microphone before a call or meeting.</li>
<li>Recording a voice-over for a video or presentation.</li>
<li>Practising a speech, interview answer or language pronunciation, then listening back.</li>
<li>Saving an idea, a to-do list or a quick message to send.</li>
<li>Recording a song idea or an instrument to check your tuning and timing.</li>
</ul>
<p>To trim silence from the start or end, open the file in the <a href="/audio-cutter">audio cutter</a>.</p>

<h2>Privacy</h2>
<p>The microphone is only active while you're recording, and your browser shows an indicator while it's in use. The sound is recorded and converted on your device. Nothing is sent to a server.</p>
<p>Before recording other people, such as in a meeting or a phone call, ask their permission. In many places it's required by law.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I record my voice on my computer?',
      <<<'EOT_TF'
Press Start recording, allow microphone access, speak, then press Stop & save. Download the recording as an MP3.
EOT_TF,
    ],
    [
      'Does the voice recorder work on phones?',
      'Yes. It works in Safari on iPhone and Chrome on Android. Allow microphone access when asked.',
    ],
    [
      'Is there a time limit?',
      <<<'EOT_TF'
No fixed limit. Long recordings use more memory, so for recordings over an hour, stop and save in parts.
EOT_TF,
    ],
    [
      'Why can’t it access my microphone?',
      <<<'EOT_TF'
Permission may be blocked. Click the microphone or lock icon in the address bar, allow the microphone, and reload the page. Check that no other app is using it.
EOT_TF,
    ],
    [
      'Are my recordings uploaded?',
      'No. Recordings are made and stored on your device only, until you close the page.',
    ],
  ],
];
