<?php
return [
    'name' => 'Online Mirror',
    'updated' => '2026-11-15',
    'category' => 'device',
    'order' => 6,
    'icon' => 'flip-horizontal-2',
    'keywords' => 'online mirror, webcam mirror, check hair webcam, camera mirror screen light, virtual mirror browser',
    'short' => 'Use your camera as a mirror, with zoom, brightness and a ring light.',
    'title' => 'Online Mirror – Webcam Full-Screen Check',
    'description' => 'Turn your laptop webcam or phone front camera into a bright mirror with zoom, mirror flip and screen ring light—private on your device.',
    'related' => ['webcam-test', 'camera-color-picker', 'passport-photo-maker', 'photo-editor'],
    'answer' => 'Click <strong>Open mirror</strong> and allow the camera: your picture appears flipped, just like a real mirror. Use <strong>Zoom</strong> to look closer, <strong>Brightness</strong> in dim rooms, and <strong>Ring light</strong> to turn the edges of your screen white and light up your face. Everything stays on your device.',
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

<h2>Quick Framing &amp; Lighting Tips Before a Video Call</h2>
<p>Opening a browser mirror 30 seconds before joining Google Meet, Teams or Zoom lets you verify camera angle at eye level, check overhead glare on glasses and switch on the warm screen fill light if a window sits behind you—zero recording or server streaming involved.</p>
EOT_TF,
    'faqs' => [
        ['Is the online mirror private?', 'Yes. Your camera picture is shown only on your screen. Nothing is recorded or sent to a server, and the camera turns off when you close the mirror.'],
        ['Why does my face look different in the true view?', 'You’re used to seeing yourself mirrored. Faces aren’t perfectly symmetrical, so the true view (how others see you) can look slightly unfamiliar.'],
        ['How does the ring light work?', 'It turns the area around the picture bright white, so your screen shines light on your face. Turn your screen brightness up and sit close for the best effect.'],
        ['Can I use it on my phone?', 'Yes. It uses the front camera on phones and tablets. Allow camera access when your browser asks.'],
        ['Can I save a picture?', 'Yes. Click Save photo to download what you see, including zoom and brightness, as a JPG.'],
        ['Does the online mirror store any camera frames or snapshots?', 'No. Live video renders locally inside your browser tab via WebRTC and disappears immediately unless you click download snapshot.'],
    ],
    'aka' => ['Webcam Mirror', 'Screen Ring-Light Mirror'],
];
