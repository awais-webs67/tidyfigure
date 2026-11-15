<?php
return [
    'name' => 'Resize Image to KB',
    'updated' => '2026-11-15',
    'category' => 'image',
    'order' => 4,
    'popular' => true,
    'files' => true,
    'icon' => 'image-down',
    'keywords' => 'resize image to kb, compress photo to exact kb size, jpg under 20kb 50kb 100kb, form upload resizer',
    'aka' => ['Exact KB Image Compressor', 'Target File Size Photo Tool'],
    'short' => 'Make a photo or signature exactly the size an online form asks for: pixels and KB (for example 20–50 KB).',
    'title' => 'Resize Image to Exact KB – 20, 50, 100 KB',
    'description' => 'Hit exact file size ceilings like 20 KB, 50 KB or 100 KB with custom pixel width/height caps as crisp baseline JPG right on your device.',
    'related' => ['passport-photo-maker', 'image-compressor', 'crop-image'],
    'answer' => 'Choose your photo or signature, enter the <strong>size the form asks for</strong> (for example 200 × 230 pixels and 20–50 KB) or pick a preset, and download. The picture is cropped to the right shape, resized to the exact pixels and saved as a JPG <strong>between the minimum and maximum KB</strong>, as sharp as that size allows.',
    'article' => <<<'EOT_TF'
<h2>How to resize a photo or signature to a KB size</h2>
<ol>
<li>Choose the photo or scanned signature (a phone photo is fine).</li>
<li>Pick a preset, or type the width and height in pixels and the minimum and maximum size in KB from the form's instructions.</li>
<li>Check the preview: the size in KB and pixels is shown under it. Download the JPG and upload it to the form.</li>
</ol>

<h2>Why forms reject photos</h2>
<p>Exam, job, visa and university portals usually check three things: the file type (almost always JPG), the size in pixels, and the file size in KB, often with a minimum as well as a maximum, such as "20 KB to 50 KB". A phone photo is usually 2 to 5 MB, a hundred times too big. Shrinking it in an ordinary editor rarely lands inside the range, so people end up guessing.</p>
<p>This tool does the guessing for you: it tries different compression levels and keeps the sharpest result that still fits under the maximum. If the result is smaller than the minimum (common for small signatures), it saves at a higher quality, and if that's still too small, it adds harmless padding inside the file so it meets the minimum without changing the picture.</p>

<h2>Signatures</h2>
<p>Sign on plain white paper with a dark pen, take a photo straight from above, and tick <strong>Clean signature</strong>: the paper becomes pure white and the ink dark and crisp, the way forms expect. Crop tightly around the signature for the best result.</p>

<h2>Common sizes</h2>
<p>The presets cover sizes many online forms use: a photo of 200 × 230 pixels at 20–50 KB, a signature of 140 × 60 pixels at 10–20 KB, a 35 × 45 mm passport-style photo, and simple limits like under 20, 50 or 100 KB. Rules differ between forms and change over time, so always check the size in your form's latest instructions and type it in if it's different.</p>

<h2>Private</h2>
<p>Your photo and signature are resized in your browser and never uploaded. For an official passport or visa photo with the right head size and background, use the <a href="/passport-photo-maker">Passport Photo Maker</a>.</p>
EOT_TF,
    'faqs' => [
        ['How do I reduce a photo to 20 KB or 50 KB?', 'Choose the photo, set the maximum to 20 or 50 KB (or tap a preset) and download. The tool finds the sharpest JPG that fits under that size.'],
        ['What if the form needs a minimum size too?', 'Enter the minimum KB as well. If the picture comes out smaller, it is saved at higher quality, and if needed, harmless padding is added so the file meets the minimum.'],
        ['How do I resize my signature to 10–20 KB?', 'Photograph your signature on white paper, choose it here, tap the signature preset (or enter the form’s size) and tick Clean signature for a white background.'],
        ['Why is my photo cropped?', 'When the form asks for exact width and height, the photo is cropped to that shape so it isn’t stretched. Choose Fit inside to add white edges instead.'],
        ['Are my photos uploaded?', 'No. Everything happens in your browser and the photo never leaves your device.'],
    ],
];
