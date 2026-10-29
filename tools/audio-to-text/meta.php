<?php
// Audio & Video to Text (transcription): page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Audio to Text (Transcription)',
  'updated' => '2026-10-29', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'media',
  'order' => 0,
  'icon' => 'audio-lines',
  'popular' => true,
  'files' => true,
  'isolate' => true, // AI tool: may use every CPU core (see tf_tool_isolated)
  'scripts' => ['ai.js'],
  'appCategory' => 'MultimediaApplication',
  'keywords' => 'audio to text converter free transcription speech to text video to text mp3 to text subtitle generator srt voice note transcribe urdu hindi whisper',
  'aka' => ['speech to text', 'transcribe audio', 'voice to text', 'audio transcription'], // other names people search for
  'short' => 'Turn speech in audio or video into text and subtitles (SRT), in 20+ languages.',
  'title' => 'Audio to Text: Free AI Transcription & SRT Subtitles',
  'description' => 'Transcribe audio and video to text with AI, free: MP3, voice notes, MP4. 20+ languages incl. Urdu, Hindi and Arabic, timestamps, SRT subtitles. No upload.',
  'related' => ['video-to-mp3', 'voice-recorder', 'audio-cutter'],
  'answer' => <<<'EOT_TF'
Choose an audio or video file (an MP3, a WhatsApp voice note, an interview or a lecture), pick the language, and press <strong>Transcribe</strong>. The AI writes out everything that was said, with <strong>timestamps</strong>, and you can download the text or <strong>SRT and VTT subtitles</strong> for your videos. It can also translate speech straight into English. Recordings never leave your device.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>How to convert audio to text</h2>
<ol>
<li>Drop your file in the box. MP3, M4A, WAV, OGG and Opus voice notes, and MP4, MOV or WebM videos all work.</li>
<li>Choose the language spoken, or leave it on automatic detection. Choosing it is faster and more accurate.</li>
<li>Pick <strong>Fast</strong> for a quick draft or <strong>Accurate</strong> for the best result.</li>
<li>Press <strong>Transcribe</strong>. The first time, the AI model downloads (41 or 77 MB) and is then stored in your browser.</li>
<li>Edit the text if needed, then copy it or download a .txt file or subtitles.</li>
</ol>

<h2>How long does it take?</h2>
<p>Transcription runs on your own computer or phone, so speed depends on the device. On a typical laptop, the Fast model processes audio several times faster than real time, and the Accurate model takes about half the length of the recording: a 10-minute interview takes roughly 5 minutes. Phones are slower. Keep the tab open while it works.</p>

<h2>Subtitles for your videos</h2>
<p>The <strong>.srt</strong> file is the standard subtitle format for YouTube, Facebook, LinkedIn, Premiere Pro, CapCut, DaVinci Resolve and VLC. <strong>.vtt</strong> is the web format used by HTML5 video players. Each subtitle line follows the timing of the speech. Upload it with your video (on YouTube: Subtitles → Add → Upload file) and check a few lines for misheard words.</p>

<h2>Translate to English</h2>
<p>Choose <strong>Translate to English</strong> to get an English transcript of speech in Urdu, Hindi, Arabic, Spanish or any other supported language, in one step. It's ideal for understanding a voice note or making English subtitles for a video in another language.</p>

<h2>Tips for accurate transcripts</h2>
<ul>
<li><strong>Clear audio matters most.</strong> Background music, wind and several people talking at once cause errors.</li>
<li><strong>Choose the language</strong> rather than relying on detection, especially for short clips.</li>
<li><strong>Check names and technical terms:</strong> the AI writes what it hears, so unusual words may be misspelt.</li>
<li><strong>Long recordings</strong> (over an hour) are best split into parts with the <a href="/audio-cutter">audio cutter</a>.</li>
</ul>

<h2>About the AI</h2>
<p>The tool uses <strong>Whisper</strong>, an open-source speech-recognition model released by OpenAI under the MIT licence, trained on hundreds of thousands of hours of speech in nearly 100 languages. Here it runs entirely in your browser, so private recordings, such as meetings, interviews or medical notes, are never uploaded to a server. Need the sound from a video first? <a href="/video-to-mp3">Video to MP3</a> extracts it.</p>
EOT_TF,
  'faqs' => [
    ['How do I convert an audio file to text?', 'Drop the file in, choose the language and press Transcribe. Copy the text or download it as a .txt file.'],
    ['Can it transcribe WhatsApp voice notes?', 'Yes. Save the voice note (.opus or .ogg) to your device and choose it. Urdu, Hindi, Arabic and English are all supported.'],
    ['How do I make subtitles for a video?', 'Choose the video, press Transcribe, then download the .srt file and upload it to YouTube or your video editor.'],
    ['Is my recording uploaded?', 'No. The Whisper AI runs in your browser. Only the model is downloaded, once.'],
    ['Is it free?', 'Yes, with no minutes limit, no sign-up and no watermark on the subtitles.'],
  ],
];
