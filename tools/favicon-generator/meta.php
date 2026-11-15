<?php
return [
    'name' => 'Favicon Generator',
    'updated' => '2026-11-15',
    'category' => 'image',
    'order' => 8,
    'icon' => 'app-window',
    'libs' => ['https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'],
    'keywords' => 'favicon generator, create favicon ico png pack, apple touch icon maker, site webmanifest icons',
    'short' => 'Make favicon.ico and all icon sizes from a letter, emoji or your logo.',
    'title' => 'Favicon Generator – ICO, PNG Pack & Manifest',
    'description' => 'Generate favicon.ico, 16–512 px PNG icons, Apple touch icon, web manifest and HTML tags from a logo, letter or emoji right inside your tab.',
    'related' => ['image-resizer', 'image-converter', 'color-converter'],
    'answer' => 'A favicon is the small icon shown in browser tabs, bookmarks and phone home screens. Type a letter or emoji (or upload your logo), choose colours and shape, and download a <strong>complete pack</strong>: favicon.ico, PNG icons from 16 to 512 px, the Apple touch icon and a web manifest, plus the HTML to paste into your site.',
    'article' => <<<'EOT_TF'
<h2>What's in the pack</h2>
<div class="scroll"><table class="tbl">
<thead><tr><th>File</th><th class="n">Size</th><th>Used by</th></tr></thead>
<tbody>
<tr><td>favicon.ico</td><td class="n">16, 32, 48</td><td>All browsers, Windows, Google search results</td></tr>
<tr><td>favicon-16x16.png / 32x32.png</td><td class="n">16, 32</td><td>Browser tabs and bookmarks</td></tr>
<tr><td>apple-touch-icon.png</td><td class="n">180</td><td>iPhone and iPad home screen</td></tr>
<tr><td>android-chrome-192 / 512</td><td class="n">192, 512</td><td>Android home screen, installable web apps</td></tr>
<tr><td>site.webmanifest</td><td>–</td><td>Tells phones the app name, icons and colours</td></tr>
</tbody></table></div>

<h2>How to install it</h2>
<ol>
<li>Unzip the pack and upload all the files to the root folder of your website (where your homepage is).</li>
<li>Paste the HTML snippet into the <code>&lt;head&gt;</code> of every page (in WordPress, use your theme's Site Icon setting or a header plugin instead).</li>
<li>Reload your site. Browsers cache favicons aggressively, so you may need a hard refresh or a private window to see the new one.</li>
</ol>

<h2>Designing a favicon that works at 16 pixels</h2>
<ul>
<li><strong>Keep it simple.</strong> One or two letters, or a single bold symbol. Detailed logos turn into a blur at 16 × 16.</li>
<li><strong>Use strong contrast.</strong> It must be visible on light and dark browser tabs.</li>
<li><strong>Fill the space.</strong> Small icons with lots of empty space look tiny next to other tabs.</li>
<li><strong>Check the small previews.</strong> The 16 px and 32 px previews are shown enlarged so you can see every pixel.</li>
</ul>

<h2>Why favicons matter for SEO</h2>
<p>Google shows your favicon next to your site name in mobile and desktop search results. A clear, recognisable icon makes your result stand out and can improve click-through. Google requires the favicon to be a multiple of 48 px square, which this pack's favicon.ico includes.</p>

<h2>Private by design</h2>
<p>Icons are drawn in your browser and zipped on your device. Your logo is never uploaded.</p>

<h2>Minimal Modern Favicon Set vs Legacy Bloated Tags</h2>
<p>Modern Google Search and Chrome look for clean <code>48×48</code> (or multiples of 48 px) PNG/ICO favicons, a <code>180×180</code> Apple touch icon for iOS home screens, and <code>192×192</code> / <code>512×512</code> PWA manifest entries—no need for thirty obsolete IE tile tags anymore.</p>
EOT_TF,
    'faqs' => [
        ['How do I make a favicon.ico?', 'Type a letter or upload your logo, choose colours and shape, and download the pack. favicon.ico is included with 16, 32 and 48 px sizes inside.'],
        ['What size should a favicon be?', 'Provide several: 16 and 32 px for tabs, 48 px for Google, 180 px for Apple devices, and 192 and 512 px for Android.'],
        ['Where do I put favicon files?', 'Upload them to the root folder of your website and add the HTML snippet to the <head> of your pages.'],
        ['Why isn’t my new favicon showing?', 'Browsers cache favicons. Try a hard refresh, a private window, or wait a day.'],
        ['Can I use an emoji as a favicon?', 'Yes. Type the emoji in the text box. Emoji look slightly different on each operating system.'],
        ['Does favicon.ico still need multiple embedded sizes?', 'Modern ICO bundles commonly include 16×16, 32×32 and 48×48 frames alongside clean PNG and 180×180 Apple Touch files for universal support.'],
    ],
    'aka' => ['Favicon ICO & PNG Pack Maker', 'App Icon Generator'],
];
