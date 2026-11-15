<?php
return [
    'name' => 'Signature Resizer',
    'updated' => '2026-11-15',
    'category' => 'image',
    'order' => 8,
    'files' => true,
    'use' => 'resize-image-to-kb',
    'preset' => [
        'w' => 140,
        'h' => 60,
        'min' => 10,
        'max' => 20,
        'clean' => true,
    ],
    'icon' => 'pen-line',
    'keywords' => 'signature resizer, signature 10kb to 20kb 140x60, resize scanned sign for online form, clean white background sign',
    'aka' => ['Exam Portal Signature Resizer', '10–20 KB Signature Converter'],
    'short' => 'Turn a photo of your signature into a clean JPG of the size online forms ask for, like 140×60 px and 10–20 KB.',
    'title' => 'Signature Resizer – 10–20 KB & 140×60 px JPG',
    'description' => 'Crop, boost dark ink against clean white paper and compress handwritten signatures to exact portal rules like 140×60 px and 10–20 KB JPG.',
    'related' => ['resize-image-to-kb', 'photo-for-online-form', 'signature-generator'],
    'answer' => 'Sign on white paper, take a photo and choose it here. The signature is <strong>cleaned up</strong> (white background, dark ink), cropped and resized to <strong>140 × 60 pixels at 10–20 KB</strong>, a size many application forms use. Change the numbers if your form asks for something else, then download the JPG.',
    'article' => <<<'EOT_TF'
<h2>How to resize a signature for an online form</h2>
<ol>
<li>Sign on plain white paper with a black or blue pen, a little bigger than usual.</li>
<li>Take a photo from straight above in good light, then crop it close around the signature with your phone's editor (or here, with Crop to fill).</li>
<li>Choose the photo here. Clean signature is already on, and the size is set to 140 × 60 pixels and 10–20 KB.</li>
<li>Check the preview and download the JPG.</li>
</ol>

<h2>Why the clean-up matters</h2>
<p>Forms often reject signatures that look grey, shadowy or blurred. A phone photo of white paper is rarely white: it's grey or yellowish, with a shadow in one corner. Clean signature finds the paper and makes it pure white, and makes the ink darker, so the signature looks like a proper scan even at 140 × 60 pixels.</p>

<h2>About the 10 KB minimum</h2>
<p>A tiny, mostly white picture compresses so well that it often comes out at only 3 or 4 KB, and forms with a minimum of 10 KB reject it. The tool first saves it at the highest quality, and if it's still below the minimum, adds harmless padding inside the JPG file so it reaches 10 KB. The signature itself doesn't change.</p>

<h2>Other sizes and a typed signature</h2>
<p>Forms differ, so check yours: type its width, height and KB limits into the boxes. If you don't have a signature on paper, draw or type one with the <a href="/signature-generator">Signature Generator</a>, then resize it here. For the photo on the same form, use <a href="/photo-for-online-form">Photo for Online Form</a>.</p>

<h2>Shooting Crisp White-Paper Signatures Without Shadows</h2>
<p>Sign with a bold dark black or blue gel pen on blank unlined white printer paper near daylight, shoot straight down so shadows never darken one corner, then let threshold cleanup turn paper pure white so your signature passes automated portal readability checks cleanly.</p>

<h2>Checking File Size Floors (10 KB Minimum Rule)</h2>
<p>Certain banking and government recruitment forms reject tiny 4 KB PNGs just as strictly as oversized 50 KB files. Selecting clean 85–95% JPEG quality at exact portal pixel dimensions lands neatly inside the safe 12–18 KB sweet spot.</p>
EOT_TF,
    'faqs' => [
        ['How do I make my signature 10–20 KB?', 'Choose a photo of your signature here: it is cleaned up, resized to 140×60 pixels and saved as a JPG between 10 and 20 KB. Change the numbers if your form asks for different ones.'],
        ['Why is my signature rejected for being too small in KB?', 'Small, mostly white images compress to very few KB. This tool saves at high quality and adds harmless padding so the file meets the minimum size.'],
        ['Can I use a blue pen?', 'Yes. Clean signature turns the paper white and the ink dark; untick it if the form wants the original colour.'],
        ['Is my signature uploaded?', 'No. It is processed in your browser and never leaves your device.'],
    ],
];
