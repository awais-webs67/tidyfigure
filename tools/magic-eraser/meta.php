<?php
return [
    'name' => 'Magic Eraser',
    'updated' => '2026-11-15',
    'category' => 'image',
    'order' => 2,
    'popular' => true,
    'files' => true,
    'isolate' => true,
    'libs' => ['https://cdn.jsdelivr.net/npm/onnxruntime-web@1.20.1/dist/ort.min.js'],
    'icon' => 'eraser',
    'keywords' => 'magic eraser online, remove object person from photo free, erase watermark text ai, photo blemish cleaner',
    'aka' => ['AI Photo Object Remover', 'Clean Up Image Brush'],
    'short' => 'Paint over anything you don’t want in a photo (people, text, objects, blemishes) and AI fills the space in naturally.',
    'title' => 'Magic Eraser – Remove Objects From Photos',
    'description' => 'Brush over bystanders, power lines, date stamps, text or blemishes in any picture and watch local AI fill the background cleanly in HD.',
    'related' => ['remove-background', 'image-upscaler', 'photo-editor'],
    'answer' => 'Choose a photo, <strong>paint over what you want to remove</strong> with the brush, and press <strong>Erase</strong>. An AI model (MI-GAN) fills the painted area with what would naturally be behind it, such as sky, grass, wall or floor. Erase more parts the same way, undo any step, then download the photo at full size.',
    'article' => <<<'EOT_TF'
<h2>How to remove an object from a photo</h2>
<ol>
<li>Choose or drop a photo, or try the sample.</li>
<li>Paint over the thing you want gone. Cover it completely, with a little margin, including its shadow.</li>
<li>Press <strong>Erase</strong>. The painted area is filled in after a moment.</li>
<li>Repeat for other objects. Hold <strong>Compare</strong> to see the original, and use <strong>Undo</strong> to step back.</li>
<li>Download the cleaned photo at its original size.</li>
</ol>

<h2>What you can remove</h2>
<ul>
<li>Tourists and passers-by in holiday photos.</li>
<li>Wires, signs, bins and cars in landscapes and property photos.</li>
<li>Text, dates, stamps and logos on pictures.</li>
<li>Spots, blemishes and stray hairs in portraits.</li>
<li>Dust and scratches on scanned old photos.</li>
</ul>

<h2>Tips for a clean result</h2>
<p>The AI looks at the area around your brush strokes to decide what belongs there, so it works best when the background is fairly simple: sky, grass, sand, water, walls, floors and roads. Paint generously over the whole object and its shadow; leftover edges confuse the fill. For a big object, erase it in two or three smaller passes. Busy backgrounds with straight lines (fences, tiles, text) are hardest; small touches work better there.</p>
<p>The fill is worked out at a size of about 512 pixels around the painted area and blended back in, so the rest of the photo keeps its full original quality.</p>

<h2>Private and free</h2>
<p>Most object removers upload your photo to a server, and many charge for full-resolution downloads. This one runs the AI (about 28 MB, downloaded once) in your browser: your photo never leaves your device, and the download is full size with no watermark. Please only remove watermarks from photos you own or have permission to edit.</p>

<h2>Using Multiple Short Brush Strokes Over Complex Scenes</h2>
<p>Tracing tightly around one object at a time—including its cast shadow on pavement or grass—produces dramatically cleaner texture continuity than swiping one huge box across the whole frame.</p>
EOT_TF,
    'faqs' => [
        ['How do I remove an object from a photo for free?', 'Choose the photo, paint over the object, press Erase and download. The AI fills the space naturally. It is free, full size and has no watermark.'],
        ['Can I remove a person from a photo?', 'Yes. Paint over the whole person and their shadow and press Erase. Simple backgrounds give the most natural result.'],
        ['Can it remove text or a date from a picture?', 'Yes. Paint over the text and press Erase. Only remove watermarks from pictures you own or may edit.'],
        ['Does it work on phones?', 'Yes. Paint with your finger; use a smaller brush for small details.'],
        ['Is my photo uploaded?', 'No. The AI runs in your browser and the photo never leaves your device.'],
        ['Can I undo strokes if AI fills an area imperfectly?', 'Yes. Step backwards or brush cleanly over smaller regions in multiple passes until surrounding texture matches smoothly.'],
    ],
];
