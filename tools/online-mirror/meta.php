<?php
// Online Mirror: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Online Mirror',
  'category' => 'device',
  'order' => 6,
  'icon' => 'flip-horizontal-2',
  'keywords' => 'online mirror mirror camera webcam mirror mirror app check my face makeup mirror ring light selfie',
  'short' => 'Use your camera as a mirror, with zoom, brightness and a ring light.',
  'title' => 'Online Mirror: Use Your Camera as a Mirror, Free',
  'description' => <<<'EOT_TF'
Turn your webcam or phone camera into a mirror. Zoom in, brighten the picture, switch on a screen ring light and save a photo. Private: nothing is uploaded.
EOT_TF,
  'related' => ['webcam-test', 'camera-color-picker', 'passport-photo-maker', 'photo-editor'],
  'answer' => <<<'EOT_TF'
Click <strong>Open mirror</strong> and allow the camera: your picture appears flipped, just like a real mirror. Use <strong>Zoom</strong> to look closer, <strong>Brightness</strong> in dim rooms, and <strong>Ring light</strong> to turn the edges of your screen white and light up your face. Everything stays on your device.
EOT_TF,
  'article' => <<<'EOT_TF'
<h2>A mirror in your browser</h2>
<p>Check your hair, makeup or teeth before a meeting, see how you look on camera, or use your phone as a pocket mirror. The online mirror shows your camera live and flipped left to right, so moving your right hand moves the hand on the right, exactly like a glass mirror.</p>

<h2>Features</h2>
<ul>
<li><strong>Zoom:</strong> up to 3× for a closer look at makeup, eyebrows or a splinter.</li>
<li><strong>Brightness:</strong> brighten the picture when the room is dark.</li>
<li><strong>Ring light:</strong> fills the space around the picture with white so your screen lights your face, like a ring light for video calls. Turn your screen brightness up for the best effect.</li>
<li><strong>True view:</strong> switch off mirroring to see yourself as other people (and video-call participants) see you.</li>
<li><strong>Full screen</strong> and <strong>Save photo</strong>.</li>
</ul>

<h2>Mirror or “true” view: which is real?</h2>
<p>You’re used to your mirror image, so a non-mirrored photo of yourself can look slightly odd: faces aren’t perfectly symmetrical, and the parting in your hair swaps sides. Other people always see the true view. Video-call apps show you mirrored on your own screen but send the true view to everyone else, which is why text on your T-shirt looks backwards to you but reads correctly for them.</p>

<h2>Private</h2>
<p>The camera picture is only shown on your screen. Nothing is recorded or uploaded, and the camera switches off when you close the mirror or leave the page. Saved photos go straight to your device.</p>
EOT_TF,
  'faqs' => [
    [
      'Is the online mirror private?',
      <<<'EOT_TF'
Yes. Your camera picture is shown only on your screen. Nothing is recorded or sent to a server, and the camera turns off when you close the mirror.
EOT_TF,
    ],
    [
      'Why does my face look different in the true view?',
      <<<'EOT_TF'
You’re used to seeing yourself mirrored. Faces aren’t perfectly symmetrical, so the true view (how others see you) can look slightly unfamiliar.
EOT_TF,
    ],
    [
      'How does the ring light work?',
      <<<'EOT_TF'
It turns the area around the picture bright white, so your screen shines light on your face. Turn your screen brightness up and sit close for the best effect.
EOT_TF,
    ],
    [
      'Can I use it on my phone?',
      <<<'EOT_TF'
Yes. It uses the front camera on phones and tablets. Allow camera access when your browser asks.
EOT_TF,
    ],
    [
      'Can I save a picture?',
      <<<'EOT_TF'
Yes. Click Save photo to download what you see, including zoom and brightness, as a JPG.
EOT_TF,
    ],
  ],
];
