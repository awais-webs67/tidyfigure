<?php
// Text to Speech: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Text to Speech',
  'updated' => '2026-10-29', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'media',
  'order' => 4,
  'popular' => true,
  'isolate' => true, // AI tool: may use every CPU core (see tf_tool_isolated)
  'icon' => 'audio-lines',
  'keywords' => 'text to speech free online natural voice ai voice generator tts mp3 download read text aloud voice over realistic voices',
  'aka' => ['TTS', 'AI voice generator', 'read text aloud', 'text to MP3'], // other names people search for
  'short' => 'Turn text into natural-sounding speech with AI voices, and download it as MP3 or WAV.',
  'title' => 'Text to Speech Free: Natural AI Voices, MP3 Download',
  'description' => <<<'EOT_TF'
Turn text into natural AI speech: 20 realistic English voices, speed control and MP3 or WAV download, free with no sign-up or word limit. Runs on your device.
EOT_TF,
  'related' => ['audio-to-text', 'video-subtitle-generator', 'word-counter'],
  'answer' => <<<'EOT_TF'
Type or paste your text, choose a <strong>voice</strong> and speed, and press <strong>Speak</strong>. An AI voice model (Kokoro) reads it aloud with natural rhythm and intonation, and you can <strong>download the audio as MP3 or WAV</strong> for videos, presentations or listening later. Other languages can be read by your device’s own voices.
EOT_TF,
  'article' => <<<'EOT_TF'
<h2>How to turn text into speech</h2>
<ol>
<li>Type or paste your text (up to about 5,000 characters at a time).</li>
<li>Choose one of 20 voices: American or British, female or male.</li>
<li>Set the speed, then press <strong>Speak</strong>. The first time, the AI voice model (about 90 MB) downloads; after that it starts quickly.</li>
<li>Listen, then download the audio as <strong>MP3</strong> (smaller) or <strong>WAV</strong> (best quality).</li>
</ol>

<h2>Natural AI voices</h2>
<p>Old text-to-speech sounds robotic because it joins recorded sounds together. The voices here come from <strong>Kokoro</strong>, a modern open AI model that learnt from hours of real speech, so it pauses at commas, stresses the right words and rises at questions. It's well suited to voice-overs for YouTube and TikTok videos, presentations, e-learning, audio versions of articles and proofreading by ear.</p>

<h2>Other languages</h2>
<p>The AI voices speak English. For Urdu, Hindi, Arabic, Spanish, French and other languages, choose <strong>Other languages</strong>: your text is read by the voices built into your phone or computer. Those voices can be played but not downloaded, because browsers don't allow recording them; how they sound depends on your device.</p>

<h2>Tips</h2>
<ul>
<li>Punctuation shapes the reading: commas make short pauses, full stops longer ones, and new paragraphs a breath.</li>
<li>Write numbers, dates and abbreviations the way they should be said if they come out oddly ("2nd of May" rather than "2/5").</li>
<li>For a long script, convert it in parts and join them in an audio editor, or use the <a href="/audio-cutter">Audio Cutter</a> to trim.</li>
</ul>

<h2>Free and private</h2>
<p>The AI runs in your browser, so your text isn't sent anywhere, there's no account, word limit or watermark, and you can use the audio you make, including in videos.</p>
EOT_TF,
  'faqs' => [
    [
      'Is this text to speech free?',
      <<<'EOT_TF'
Yes. There is no sign-up, no word limit and no watermark, and you can download the audio as MP3 or WAV.
EOT_TF,
    ],
    [
      'Can I use the audio in my YouTube videos?',
      <<<'EOT_TF'
Yes. The Kokoro voice model is released under the Apache 2.0 licence, which allows commercial use, so you can use the speech you make in videos and projects.
EOT_TF,
    ],
    [
      'Does it work in Urdu or Hindi?',
      <<<'EOT_TF'
The AI voices speak English. Choose Other languages to have Urdu, Hindi and many other languages read by your device’s built-in voices (listen only).
EOT_TF,
    ],
    [
      'Why is the first time slow?',
      <<<'EOT_TF'
The AI voice model (about 90 MB) downloads once and is then stored by your browser, so later uses start quickly.
EOT_TF,
    ],
    [
      'Is my text uploaded?',
      <<<'EOT_TF'
No. The speech is made in your browser and your text never leaves your device.
EOT_TF,
    ],
  ],
];
