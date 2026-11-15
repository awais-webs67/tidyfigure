<?php
return [
    'name' => 'YouTube Thumbnail Downloader',
    'updated' => '2026-11-15',
    'category' => 'social',
    'order' => 2,
    'icon' => 'image-play',
    'keywords' => 'youtube thumbnail downloader, save youtube thumbnail hd, get thumbnail from youtube url, yt thumbnail grabber',
    'aka' => ['YouTube Thumbnail Grabber', 'HD Thumbnail Saver'],
    'short' => 'Get any YouTube video’s thumbnail in HD (1280×720) and smaller sizes.',
    'title' => 'YouTube Thumbnail Downloader – Save HD & MaxRes',
    'description' => 'Download any YouTube video or Shorts thumbnail in HD (1280×720), SD (640×480) and standard sizes by pasting a video link. Instant browser tool.',
    'related' => ['youtube-subscriber-counter', 'image-resizer', 'image-compressor'],
    'answer' => 'Paste a YouTube video link (normal videos, Shorts and live streams all work) and you\'ll see its thumbnail in every size YouTube provides, up to <strong>1280 × 720 (Full HD)</strong>. Click Download to save the one you need. Older or low-resolution videos may not have the Full HD version, in which case it\'s simply not shown.',
    'article' => <<<'EOT_TF'
<h2>Thumbnail sizes YouTube provides</h2>
<div class="scroll"><table class="tbl">
<thead><tr><th>Name</th><th class="n">Size</th><th>Notes</th></tr></thead>
<tbody>
<tr><td>maxresdefault</td><td class="n">1280 × 720</td><td>Full HD; available when the creator uploaded an HD thumbnail or video</td></tr>
<tr><td>sddefault</td><td class="n">640 × 480</td><td>4:3, with black bars on widescreen videos</td></tr>
<tr><td>hqdefault</td><td class="n">480 × 360</td><td>Always available</td></tr>
<tr><td>mqdefault</td><td class="n">320 × 180</td><td>16:9, no bars</td></tr>
<tr><td>default</td><td class="n">120 × 90</td><td>Tiny preview</td></tr>
</tbody></table></div>

<h2>Good reasons to download thumbnails</h2>
<ul>
<li><strong>Creators:</strong> keep a copy of your own thumbnails, or study what top videos in your niche do with faces, text and colour.</li>
<li><strong>Designers:</strong> build mood boards and A/B test ideas.</li>
<li><strong>Bloggers and teachers:</strong> link to a video with a preview image, crediting the creator.</li>
<li><strong>Presentations:</strong> show a video you're referencing.</li>
</ul>

<h2>Supported links</h2>
<p>Normal watch links (youtube.com/watch?v=…), short links (youtu.be/…), Shorts, live streams, embedded players and plain 11-character video IDs all work. Playlist links work as long as they include a video ID.</p>

<h2>Copyright</h2>
<p>A thumbnail is the creator's work. Viewing and saving it for reference is generally fine, but republishing it, especially commercially, may need the creator's permission. When you use one, credit and link to the original video.</p>

<h2>Make a thumbnail that gets clicks</h2>
<ul>
<li>Use 1280 × 720 pixels (16:9) and keep the file under 2 MB.</li>
<li>Show a clear face or subject; close-ups read well on small screens.</li>
<li>Three to five bold words at most; avoid repeating the title.</li>
<li>High contrast and a simple background.</li>
<li>Check how it looks at small size on a phone.</li>
</ul>
<p>The Image Resizer has a 1280 × 720 preset, and the Image Compressor brings big files under the 2 MB limit.</p>

<h2>Using thumbnails fairly</h2>
<p>Thumbnails are created by the channel owner and are usually protected by copyright. It's fine to save one to look at, to reference in a review or commentary with credit, or to download your own channel's thumbnails as a backup. Don't reuse someone else's thumbnail as your own video's cover. If you want ideas for your own thumbnails, study what successful ones in your niche have in common: a clear face, a few large words and strong contrast.</p>

<h2>Checking Available Resolution Tiers</h2>
<p>YouTube automatically generates four or five static JPEG endpoints per upload: <code>maxresdefault.jpg</code> (1280×720), <code>sddefault.jpg</code> (640×480), <code>hqdefault.jpg</code> (480×360) and <code>mqdefault.jpg</code> (320×180). Very old videos or 480p uploads may lack a 1280×720 file, in which case 640×480 offers the sharpest clean preview.</p>
EOT_TF,
    'faqs' => [
        ['How do I download a YouTube thumbnail?', 'Paste the video link, press Get thumbnails, and click Download under the size you want.'],
        ['Can I get the thumbnail of a YouTube Short?', 'Yes. Paste the Shorts link; it works the same way.'],
        ['Why is there no HD thumbnail?', 'Some older or low-resolution videos don’t have a 1280 × 720 thumbnail. Use the next largest size.'],
        ['Is it legal to download YouTube thumbnails?', 'Saving for reference is generally fine. Republishing them may need the creator’s permission; always credit the creator.'],
        ['What size should a YouTube thumbnail be?', '1280 × 720 pixels (16:9), under 2 MB, in JPG or PNG.'],
    ],
];
