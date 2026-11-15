<?php
return [
    'name' => 'Compress Image to 20 KB',
    'updated' => '2026-11-15',
    'category' => 'image',
    'order' => 5,
    'files' => true,
    'use' => 'resize-image-to-kb',
    'preset' => [
        'max' => 20,
        'min' => '',
        'w' => '',
        'h' => '',
    ],
    'icon' => 'image-down',
    'keywords' => 'compress image to 20kb, reduce jpg under 20kb, upsc ssc photo 20kb compressor, resize photo 20kb no upload',
    'aka' => ['20 KB Photo Compressor', 'Exam Form 20KB JPG Tool'],
    'short' => 'Make any photo smaller than 20 KB in one step, as sharp as that size allows.',
    'title' => 'Compress Image to 20 KB – Passport & Exam Photo',
    'description' => 'Shrink passport photos and signatures strictly under 20 KB in JPG format with optional 200×230 or 140×60 pixels for UPSC, SSC and job forms.',
    'related' => ['resize-image-to-kb', 'image-compressor', 'photo-for-online-form'],
    'answer' => 'Choose your photo and it\'s saved as a JPG <strong>under 20 KB</strong> straight away. The tool tries different compression levels and picks the sharpest one that fits; a huge phone photo is also reduced in pixels so it stays clear. If your form gives exact pixels or a minimum size, type them in too.',
    'article' => <<<'EOT_TF'
<h2>How to compress an image to 20 KB</h2>
<ol>
<li>Choose or drop your photo. The maximum is already set to 20 KB.</li>
<li>If the form asks for exact pixels (for example 200 × 230) or a minimum size, enter those as well.</li>
<li>Check the size shown under the preview and download the JPG.</li>
</ol>

<h2>Where a 20 KB limit comes up</h2>
<p>A 20 KB limit is common on exam, admission and recruitment portals for the candidate's photo, and for small profile pictures. It is one of the tightest limits, so the photo has to be quite small in pixels as well.</p>
<p>Most of these sites only accept JPG files. A photo straight from a phone is usually 2 to 5 MB, so it has to shrink a lot, and that's easiest when the pixels shrink too: a photo of about 378 by 473 pixels can be stored in 20 KB at good quality, while squeezing all 12 megapixels into 20 KB would make it blotchy.</p>

<h2>Sharpest result that fits</h2>
<p>Instead of one fixed setting, the tool tries the compression quality step by step and keeps the highest one that stays under 20 KB. The size you see is the size of the file you download, measured exactly, so the upload won't be rejected for being a few bytes over.</p>

<h2>Other sizes</h2>
<p>Need a different limit, a minimum size, or a signature? Use <a href="/resize-image-to-kb">Resize Image to KB</a> to enter any numbers, or the <a href="/signature-resizer">Signature Resizer</a> for 10–20 KB signatures.</p>

<h2>How to Fit Sharp Portraits Under Strict 20 KB Caps</h2>
<p>A 4000×3000 smartphone photo holds 12 million pixels—impossible to compress cleanly under 20 KB without blocking facial details into JPEG squares. Setting exact required portal dimensions (like 200×230 px) before targeting 18–19 KB preserves sharp eyes and legible text easily.</p>

<h2>Avoid Double-Compressing WhatsApp Forwards</h2>
<p>Images saved off WhatsApp have already suffered heavy server compression; starting from your original camera roll shot before compressing down to 20 KB avoids murky halo artifacts around eyes, glasses and scanned stamp letters.</p>
EOT_TF,
    'faqs' => [
        ['How do I reduce a photo to 20 KB?', 'Choose the photo here. It is saved as a JPG under 20 KB automatically, at the best quality that fits. Download it and upload it to your form.'],
        ['Will my photo look bad at 20 KB?', 'The pixels are reduced to a sensible size first, so the photo stays clear. At 20 KB a face or document photo looks good on screen.'],
        ['Can I set exact pixels too?', 'Yes. Type the width and height the form asks for and the photo is cropped and resized to exactly that, then compressed under the limit.'],
        ['Is my photo uploaded?', 'No. The photo is compressed in your browser and never leaves your device.'],
        ['What minimum pixel size works best when shrinking under 20 KB?', 'Standard online exam forms expect roughly 200×230 px for photos and 140×60 px for signatures—both look surprisingly sharp inside 16–19 KB.'],
    ],
];
