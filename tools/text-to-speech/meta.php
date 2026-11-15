<?php
return [
    'name' => 'Text to Speech',
    'updated' => '2026-11-15',
    'category' => 'media',
    'order' => 4,
    'popular' => true,
    'isolate' => true,
    'icon' => 'audio-lines',
    'keywords' => 'text to speech free, tts mp3 download, natural voice reader, convert text to audio online, free voiceover generator',
    'aka' => ['Free TTS Reader', 'Text to MP3 Voice Generator'],
    'short' => 'Turn text into natural-sounding speech with AI voices, and download it as MP3 or WAV.',
    'title' => 'Text to Speech Free – AI Voices & MP3 Export',
    'description' => 'Convert typed scripts and articles into natural spoken audio with adjustable speed and downloadable WAV or MP3 files directly inside your browser.',
    'related' => ['audio-to-text', 'video-subtitle-generator', 'word-counter'],
    'answer' => 'Type or paste your text, choose a <strong>voice</strong> and speed, and press <strong>Speak</strong>. An AI voice model (Kokoro) reads it aloud with natural rhythm and intonation, and you can <strong>download the audio as MP3 or WAV</strong> for videos, presentations or listening later. Other languages can be read by your device’s own voices.',
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

<h2>Formatting Punctuation for Natural Spoken Pauses</h2>
<p>Insert commas between clauses, spell out abbreviations that you want spoken in full, and separate paragraphs with blank lines so the voice engine inserts crisp half-second breaths instead of rushing straight from one sentence into the next.</p>
EOT_TF,
    'faqs' => [
        ['Is this text to speech free?', 'Yes. There is no sign-up, no word limit and no watermark, and you can download the audio as MP3 or WAV.'],
        ['Can I use the audio in my YouTube videos?', 'Yes. The Kokoro voice model is released under the Apache 2.0 licence, which allows commercial use, so you can use the speech you make in videos and projects.'],
        ['Does it work in Urdu or Hindi?', 'The AI voices speak English. Choose Other languages to have Urdu, Hindi and many other languages read by your device’s built-in voices (listen only).'],
        ['Why is the first time slow?', 'The AI voice model (about 90 MB) downloads once and is then stored by your browser, so later uses start quickly.'],
        ['Is my text uploaded?', 'No. The speech is made in your browser and your text never leaves your device.'],
    ],
];
