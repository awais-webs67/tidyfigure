<?php
return [
    'name' => 'Compress Image to 100 KB',
    'updated' => '2026-11-15',
    'category' => 'image',
    'order' => 7,
    'files' => true,
    'use' => 'resize-image-to-kb',
    'preset' => [
        'max' => 100,
        'min' => '',
        'w' => '',
        'h' => '',
    ],
    'icon' => 'image-down',
    'keywords' => 'compress image to 100kb, reduce photo size under 100kb, jpg compressor 100kb, optimize web photo 100kb',
    'aka' => ['100 KB Image Compressor', 'Shrink JPG Under 100KB'],
    'short' => 'Make any photo smaller than 100 KB in one step, as sharp as that size allows.',
    'title' => 'Compress Image to 100 KB – JPG Under 100KB',
    'description' => 'Shrink JPG and PNG images strictly under 100 KB while preserving maximum crispness and optional exact pixels for applications—runs locally.',
    'related' => ['resize-image-to-kb', 'image-compressor', 'photo-for-online-form'],
    'answer' => 'Choose your photo and it\'s saved as a JPG <strong>under 100 KB</strong> straight away. The tool tries different compression levels and picks the sharpest one that fits; a huge phone photo is also reduced in pixels so it stays clear. If your form gives exact pixels or a minimum size, type them in too.',
    'article' => <<<'EOT_TF'
<h2>How to compress an image to 100 KB</h2>
<ol>
<li>Choose or drop your photo. The maximum is already set to 100 KB.</li>
<li>If the form asks for exact pixels (for example 200 × 230) or a minimum size, enter those as well.</li>
<li>Check the size shown under the preview and download the JPG.</li>
</ol>

<h2>Where a 100 KB limit comes up</h2>
<p>100 KB is a usual limit for uploading ID cards, certificates and photos to online forms, school portals and some visa applications, and a good size for images sent by email or chat.</p>
<p>Most of these sites only accept JPG files. A photo straight from a phone is usually 2 to 5 MB, so it has to shrink a lot, and that's easiest when the pixels shrink too: a photo of about 846 by 1058 pixels can be stored in 100 KB at good quality, while squeezing all 12 megapixels into 100 KB would make it blotchy.</p>

<h2>Sharpest result that fits</h2>
<p>Instead of one fixed setting, the tool tries the compression quality step by step and keeps the highest one that stays under 100 KB. The size you see is the size of the file you download, measured exactly, so the upload won't be rejected for being a few bytes over.</p>

<h2>Other sizes</h2>
<p>Need a different limit, a minimum size, or a signature? Use <a href="/resize-image-to-kb">Resize Image to KB</a> to enter any numbers, or the <a href="/signature-resizer">Signature Resizer</a> for 10–20 KB signatures.</p>

<h2>Why 100 KB Is the Sweet Spot for Web &amp; Portal Uploads</h2>
<p>Visa portals, scholarship scans, real-estate thumbnails and e-commerce product sheets regularly cap uploads at 100 KB. Binary-search JPEG compression finds the highest quality setting just below 98–99 KB—keeping text scans and portrait skin tones dramatically sharper than crude one-pass 50% squeezes.</p>

<h2>JPG vs PNG When Fitting Strict 100 KB Portals</h2>
<p>Transparent logos or graphics with crisp black text shrink tightly as indexed PNG or resized WebP, whereas continuous-tone portrait photos or scanned paper receipts require baseline JPEG compression to hit under 100 KB without visible banding.</p>
EOT_TF,
    'faqs' => [
        ['How do I reduce a photo to 100 KB?', 'Choose the photo here. It is saved as a JPG under 100 KB automatically, at the best quality that fits. Download it and upload it to your form.'],
        ['Will my photo look bad at 100 KB?', 'The pixels are reduced to a sensible size first, so the photo stays clear. At 100 KB a face or document photo looks good on screen.'],
        ['Can I set exact pixels too?', 'Yes. Type the width and height the form asks for and the photo is cropped and resized to exactly that, then compressed under the limit.'],
        ['Is my photo uploaded?', 'No. The photo is compressed in your browser and never leaves your device.'],
        ['Why does an 800-pixel photo drop under 100 KB sharper than a 4000-pixel photo?', 'Packing 12 million pixels inside 100 KB forces heavy JPEG block blur; scaling dimensions down to portal width gives each remaining pixel higher clarity.'],
    ],
];
