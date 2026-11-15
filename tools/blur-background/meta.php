<?php
return [
    'name' => 'Blur Background',
    'updated' => '2026-11-15',
    'category' => 'image',
    'order' => 4,
    'files' => true,
    'isolate' => true,
    'scripts' => ['ai.js'],
    'use' => 'remove-background',
    'preset' => [
        'bg' => 'blur',
    ],
    'icon' => 'aperture',
    'keywords' => 'blur background of photo, portrait mode online free, bokeh background blur ai, blur photo face background',
    'short' => 'Blur the background of a photo like portrait mode, keeping the subject sharp.',
    'title' => 'Blur Photo Background Online – Portrait Mode',
    'description' => 'Isolate portraits and products with AI subject segmentation to apply smooth bokeh DSLR background blur in HD right in your browser—no uploads.',
    'appCategory' => 'MultimediaApplication',
    'related' => ['remove-background', 'change-background-color', 'photo-editor', 'image-compressor'],
    'answer' => 'Upload a photo: the AI finds the person or object, keeps it <strong>sharp</strong>, and <strong>blurs the background</strong> like a camera with a wide aperture (bokeh). Drag the <strong>Blur strength</strong> slider from a gentle softening to a strong blur, compare before and after, and download the full-size photo.',
    'article' => <<<'EOT_TF'
<h2>Portrait mode for any photo</h2>
<p>Phones blur the background in portrait mode by measuring depth. This tool does the same afterwards, on any photo: the AI separates the subject from the background, then softens only the background. It works on pictures taken with any camera, screenshots and old photos.</p>

<h2>How to blur a photo background</h2>
<ol>
<li>Choose your photo.</li>
<li>Wait a few seconds while the AI finds the subject.</li>
<li>Set the <strong>Blur strength</strong>: low for a natural look, high to hide a messy room or busy street.</li>
<li>Use the slider on the preview to compare, then download.</li>
</ol>

<h2>When to blur the background</h2>
<ul>
<li><strong>Profile pictures:</strong> a soft background makes your face stand out.</li>
<li><strong>Privacy:</strong> hide house numbers, car plates, documents or people behind you.</li>
<li><strong>Product photos:</strong> keep the item sharp in a real setting.</li>
<li><strong>Social media:</strong> give everyday photos a professional, camera-like look.</li>
</ul>

<h2>Tips for a natural result</h2>
<ul>
<li>Moderate blur usually looks most realistic; very strong blur can look cut-out.</li>
<li>Photos where the subject is clearly separated from the background give the cleanest edges.</li>
<li>For a plain colour instead of blur, use <a href="/change-background-color">change background colour</a>.</li>
</ul>

<h2>Achieving Realistic Optical Shallow Depth of Field</h2>
<p>Real 50mm f/1.8 camera lenses soften background depth gently rather than slicing crisp razor boundaries around shoulders. Keep blur radius moderate (25–45%) for headshots and LinkedIn avatars so hair edges blend convincingly against busy street or office scenes.</p>
<h2>Great Uses Beyond Human Portraits</h2>
<p>Softening messy tabletop clutter behind homemade bakery items, Etsy jewellery or resold electronics spotlights the hero item cleanly without looking artificially cut out on flat studio white.</p>

<h2>Privacy-Safe Street, Licence &amp; Home Office Blur</h2>
<p>Blurring backgrounds isn’t just aesthetic: obscuring family photos on living-room shelves, car licence plates on driveways or whiteboard sticky notes behind a laptop keeps sensitive details private before sharing photos on social media or property forums.</p>
EOT_TF,
    'faqs' => [
        ['How do I blur the background of a photo?', 'Upload the photo. The AI keeps the subject sharp and blurs the rest; adjust the strength with the slider and download.'],
        ['Does it work on photos not taken in portrait mode?', 'Yes. It works on any photo, because the AI finds the subject itself.'],
        ['Can I control how blurry it is?', 'Yes. Drag the Blur strength slider from a light blur to a strong one.'],
        ['Will the person stay sharp?', 'Yes. Only the background is blurred. Fine hair edges are handled by the AI model.'],
        ['Is my photo uploaded?', 'No. Everything happens in your browser.'],
        ['Are my portraits uploaded to an external AI GPU cloud?', 'No. Background segmentation runs cleanly inside your browser via WebAssembly/WebGL so personal and client images never leave your device.'],
        ['Can I control how strong the blurred background bokeh looks?', 'Yes. Adjust the smooth blur slider live before exporting so foreground skin textures stay tack-sharp while cluttered rooms soften gently.'],
    ],
    'aka' => ['AI Background Blur Tool', 'DSLR Portrait Bokeh Maker'],
];
