<?php
// Image Compressor: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Image Compressor',
  'category' => 'image',
  'order' => 1,
  'icon' => 'image-down',
  'popular' => true,
  'files' => true,
  'keywords' => 'compress jpg png webp reduce photo size kb',
  'aka' => ['compress image', 'reduce image size', 'photo compressor', 'image size reducer', 'compress JPEG'], // other names people search for
  'short' => 'Shrink JPG, PNG and WebP photos by up to 80% without visible quality loss.',
  'title' => 'Image Compressor: Reduce JPG, PNG & WebP File Size Free',
  'description' => <<<'EOT_TF'
Compress JPG, PNG and WebP images by up to 80% in your browser. Batch compress, set quality and max width, no upload, no sign-up, no watermark.
EOT_TF,
  'related' => ['image-resizer', 'image-converter', 'jpg-to-pdf'],
  'answer' => <<<'EOT_TF'
To reduce an image's file size, re-save it at a lower quality and, if it's larger than you need, a smaller width. A quality of <strong>70–80%</strong> usually looks the same as the original but makes JPG photos <strong>60–80% smaller</strong>. Drop your images into the tool below: they are compressed on your device and never uploaded.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>How image compression works</h2>
<p>Photos from phones and cameras are saved at very high quality, often 3–8 MB each. Most of that detail is invisible on a screen. Compression throws away information your eyes are unlikely to notice, such as tiny colour variations in a blue sky, and stores the rest more efficiently.</p>
<p>This compressor redraws each image in your browser and saves it again at the quality you choose. Nothing is uploaded to a server, so it works with private photos and documents, and it's fast even on large batches.</p>

<h2>Which settings to use</h2>
<div class="scroll"><table class="tbl">
<thead><tr><th>Use</th><th>Quality</th><th>Max width</th><th>Typical result</th></tr></thead>
<tbody>
<tr><td>Email attachments</td><td class="n">70%</td><td class="n">1600 px</td><td>200–400 KB per photo</td></tr>
<tr><td>Website or blog</td><td class="n">75%</td><td class="n">1920 px</td><td>150–350 KB</td></tr>
<tr><td>Online forms (under 100 KB)</td><td class="n">60%</td><td class="n">1000 px</td><td>60–120 KB</td></tr>
<tr><td>Printing</td><td class="n">90%</td><td>Keep original</td><td>Close to original</td></tr>
</tbody></table></div>

<h2>JPG, PNG or WebP?</h2>
<ul>
<li><strong>JPG</strong> is best for photos. It compresses well and every device can open it. It doesn't support transparency, so transparent areas become white.</li>
<li><strong>PNG</strong> is lossless, which is ideal for screenshots, logos and graphics with sharp edges, but it makes photos large. Re-saving a PNG as PNG barely shrinks it, so the default <em>Auto</em> setting saves PNGs as WebP, which keeps transparency and is usually far smaller.</li>
<li><strong>WebP</strong> is a modern format made by Google. At the same visual quality it's usually 25–35% smaller than JPG and supports transparency. All current browsers support it, but some older software and upload forms don't.</li>
</ul>

<h2>Why resizing matters as much as quality</h2>
<p>File size grows with the number of pixels. A 4000 × 3000 photo has 12 million pixels; resized to 2000 × 1500 it has 3 million, a quarter as many, before any compression. If an image will only be shown at 1200 pixels wide on a website, setting a max width is the single biggest saving you can make.</p>

<h2>Tips</h2>
<ul>
<li>Compress a copy and keep your originals. Every time you re-save a JPG, it loses a little more detail.</li>
<li>If a site demands a file "under 200 KB", start at 70% quality and 1600 px wide, then lower the quality step by step.</li>
<li>If a result isn't smaller, the image is already well compressed, and the tool keeps your original instead.</li>
</ul>
EOT_TF,
  'faqs' => [
    [
      'How can I reduce the size of a photo to under 100 KB?',
      <<<'EOT_TF'
Set the max width to about 1000 pixels and the quality to 60%. Most phone photos then come out between 60 and 120 KB. If it is still too large, lower the quality or the width a little more.
EOT_TF,
    ],
    [
      'Does compressing an image reduce its quality?',
      <<<'EOT_TF'
JPG and WebP compression removes some detail, but at 70–80% quality the difference is very hard to see on a screen. Below about 50%, you may notice blur and blocky areas.
EOT_TF,
    ],
    [
      'Are my images uploaded to a server?',
      <<<'EOT_TF'
No. The compressor runs entirely in your browser. Your images are processed on your device and never leave it.
EOT_TF,
    ],
    [
      'Why is my compressed PNG not smaller?',
      <<<'EOT_TF'
PNG is a lossless format, so re-saving it as PNG barely changes the size. Keep the output on Auto (or choose WebP or JPG) to make it much smaller.
EOT_TF,
    ],
    [
      'Can I compress many images at once?',
      <<<'EOT_TF'
Yes. Drop as many images as you like. Each one is compressed with the same settings, and you can download them one by one or all together.
EOT_TF,
    ],
  ],
];
