<?php
// Mic Test: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Mic Test',
  'category' => 'device',
  'order' => 1,
  'popular' => true,
  'icon' => 'mic',
  'keywords' => 'mic test microphone test online check my mic is my microphone working mic check record and play back',
  'aka' => ['microphone test', 'mic checker', 'test my mic'], // other names people search for
  'short' => 'Check your microphone with a live sound meter and a test recording.',
  'title' => 'Mic Test: Check Your Microphone Online, Free',
  'description' => <<<'EOT_TF'
Test your microphone in seconds: see a live sound level and waveform, record a short clip and play it back. Fixes for Windows, Mac and phones. Private.
EOT_TF,
  'related' => ['webcam-test', 'voice-recorder', 'keyboard-test', 'tone-generator'],
  'answer' => <<<'EOT_TF'
Click <strong>Start mic test</strong> and allow microphone access, then speak. If the green meter jumps when you talk, your microphone works. Record a 5-second clip to hear exactly how you sound, and pick another microphone from the list if you have more than one. Nothing is uploaded: the sound stays on your device.
EOT_TF,
  'article' => <<<'EOT_TF'
<h2>How to test your microphone</h2>
<ol>
<li>Click <strong>Start mic test</strong>. Your browser asks for permission: choose <strong>Allow</strong>.</li>
<li>Speak normally. The level meter and the waveform should move with your voice.</li>
<li>Click <strong>Record 5 seconds</strong>, say a sentence, and play it back to hear the quality.</li>
<li>If you have a headset and a laptop mic, choose the one you want from the <strong>Microphone</strong> list.</li>
</ol>

<h2>Reading the results</h2>
<ul>
<li><strong>Level:</strong> normal speech at arm’s length should reach roughly the middle of the meter. If it barely moves, move closer or raise the input volume in your system settings. If it hits the end all the time, your voice may sound distorted.</li>
<li><strong>Noise floor:</strong> with you silent, the meter should stay near the bottom. A high reading when you aren’t talking means background noise: a fan, traffic or electrical hum.</li>
<li><strong>Settings:</strong> the tool shows the sample rate and whether echo cancellation, noise suppression and automatic gain are switched on. Video-call apps use these too.</li>
</ul>

<h2>Microphone not working? Try these fixes</h2>
<ul>
<li><strong>Permission blocked:</strong> click the lock or microphone icon next to the web address and set Microphone to Allow, then reload.</li>
<li><strong>Windows:</strong> open Settings → Privacy &amp; security → Microphone and turn on access for apps and for your browser. In Settings → System → Sound, check the right input device is selected and its volume isn’t at zero.</li>
<li><strong>Mac:</strong> open System Settings → Privacy &amp; Security → Microphone and turn on your browser. In Sound → Input, pick the right microphone and raise the input volume.</li>
<li><strong>Phones:</strong> allow the microphone for your browser in the phone’s settings, and make sure no case or finger covers the mic hole.</li>
<li><strong>“Mic is busy”:</strong> close Zoom, Teams, Discord or other tabs that may be holding the microphone.</li>
<li><strong>Headset:</strong> check the mute switch on the cable or ear cup, and try another USB port.</li>
</ul>

<h2>Your privacy</h2>
<p>The sound is analysed in your browser to draw the meter and waveform. The test recording is kept in your browser’s memory so you can play it back and is deleted when you leave the page. Nothing is sent to a server.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I know if my mic is working?',
      <<<'EOT_TF'
Start the test and speak. If the level meter and waveform move with your voice, the microphone works. Record a short clip to check how it sounds.
EOT_TF,
    ],
    [
      'Why is my microphone not detected?',
      <<<'EOT_TF'
Usually access is blocked for the browser, or the mic is turned off in system privacy settings. Allow it next to the web address and in Windows or Mac privacy settings, then reload the page.
EOT_TF,
    ],
    [
      'Is my voice recorded or uploaded?',
      <<<'EOT_TF'
No. The sound is only analysed in your browser. The optional test clip stays in your browser’s memory and is deleted when you close the page.
EOT_TF,
    ],
    [
      'Why does my mic sound quiet?',
      <<<'EOT_TF'
Move closer to the microphone and raise the input volume in your system sound settings. Some headsets also have a volume wheel or mute switch on the cable.
EOT_TF,
    ],
    [
      'Can I test a mic on my phone?',
      <<<'EOT_TF'
Yes. The test works in mobile browsers. Allow the microphone when asked, and check your browser has microphone permission in the phone’s settings.
EOT_TF,
    ],
  ],
];
