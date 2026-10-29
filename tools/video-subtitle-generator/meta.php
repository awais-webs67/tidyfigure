<?php
// Auto Subtitle Generator: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Auto Subtitle Generator',
  'updated' => '2026-10-29', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'media',
  'order' => 3,
  'popular' => true,
  'files' => true,
  'isolate' => true, // AI tool: may use every CPU core (see tf_tool_isolated)
  'scripts' => ['ai.js'],
  'icon' => 'captions',
  'keywords' => 'auto subtitle generator add subtitles to video free automatic captions for video srt generator burn subtitles into video tiktok captions reels captions transcribe video',
  'aka' => ['add subtitles to video', 'automatic captions', 'SRT generator', 'burn subtitles into video'], // other names people search for
  'short' => 'Add automatic subtitles to any video: AI writes the captions, you edit and style them, then download SRT or the video with subtitles.',
  'title' => 'Auto Subtitle Generator: Add Subtitles to Video Free',
  'description' => <<<'EOT_TF'
Add subtitles to videos automatically: AI captions in 20+ languages, edit and style them, then download SRT or VTT, or the video with captions burned in. Free.
EOT_TF,
  'related' => ['audio-to-text', 'video-cutter', 'video-compressor'],
  'answer' => <<<'EOT_TF'
Drop a video and press <strong>Make subtitles</strong>. An AI (Whisper) listens to it and writes <strong>timed captions</strong>, split into short, easy-to-read lines. Fix any word, pick a caption style, and download an <strong>SRT or VTT</strong> file for YouTube, or the <strong>video with the subtitles burned in</strong> for TikTok, Reels and WhatsApp.
EOT_TF,
  'article' => <<<'EOT_TF'
<h2>How to add subtitles to a video</h2>
<ol>
<li>Drop your video (MP4, MOV or WebM) in the box, or try the sample.</li>
<li>Choose the language spoken in the video, or let it be detected. To get English subtitles for a video in another language, choose <strong>Translate to English</strong>.</li>
<li>Press <strong>Make subtitles</strong>. The AI downloads once (about 40 to 75 MB) and then works on your device.</li>
<li>Play the video to check the captions. Click any line to fix a word or change its timing.</li>
<li>Download the <strong>.srt</strong> or <strong>.vtt</strong> file, or press <strong>Make video with subtitles</strong>.</li>
</ol>

<h2>Subtitles that are easy to read</h2>
<p>The AI gives a time for every word, so the captions are cut where people pause and at the ends of sentences, with short lines that are easy to read on a phone and appear exactly when the words are spoken. Choose <strong>Short lines</strong> for the punchy, few-words-at-a-time captions popular on TikTok and Reels.</p>

<h2>SRT file or burned-in captions?</h2>
<ul>
<li><strong>SRT or VTT file:</strong> upload it with your video to YouTube, Facebook, LinkedIn or Vimeo, or load it in VLC. Viewers can turn the subtitles on and off, and search engines can read them.</li>
<li><strong>Video with subtitles:</strong> the captions become part of the picture, in the style you chose, so they show everywhere, including Instagram, TikTok, WhatsApp and on muted autoplay, where most people watch without sound.</li>
</ul>
<p>Making the video plays it through once in the background, so a 2-minute video takes about 2 minutes.</p>

<h2>Languages</h2>
<p>Whisper understands English, Urdu, Hindi, Arabic, Spanish, French, German, Portuguese, Italian, Turkish, Indonesian, Russian and many more. Accuracy is best for clear speech without loud music; choose <strong>Accurate</strong> for difficult audio.</p>

<h2>Private</h2>
<p>Most subtitle apps upload your video to their servers. Here the AI runs in your browser, so your video never leaves your device.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I add subtitles to a video for free?',
      <<<'EOT_TF'
Drop the video here and press Make subtitles. Check and edit the captions, then download an SRT file or the video with the subtitles burned in. It is free with no watermark.
EOT_TF,
    ],
    [
      'Can I get English subtitles for a video in another language?',
      <<<'EOT_TF'
Yes. Choose Translate to English: the AI listens to the original language and writes English captions.
EOT_TF,
    ],
    [
      'How do I add the SRT file to YouTube?',
      <<<'EOT_TF'
In YouTube Studio, open the video, choose Subtitles, Add language, then Upload file, and pick the .srt file.
EOT_TF,
    ],
    [
      'Is there a watermark on the video?',
      <<<'EOT_TF'
No. The video with subtitles has no watermark and no length limit, though longer videos take longer to make.
EOT_TF,
    ],
    [
      'Is my video uploaded?',
      <<<'EOT_TF'
No. The AI runs in your browser and the video never leaves your device.
EOT_TF,
    ],
  ],
];
