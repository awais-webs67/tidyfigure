<?php
return [
    'name' => 'Watermark PDF',
    'updated' => '2026-11-15',
    'category' => 'pdf',
    'order' => 10,
    'icon' => 'stamp',
    'files' => true,
    'libs' => [
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js',
    ],
    'keywords' => 'watermark pdf online free, add confidential draft stamp pdf, diagonal text watermark no upload',
    'short' => 'Stamp “Confidential”, “Draft” or any text across every PDF page.',
    'title' => 'Watermark PDF Free – Diagonal & Footer Stamp',
    'description' => 'Add crisp diagonal, tiled or footer text stamps like CONFIDENTIAL, DRAFT or copy ownership across PDF pages with custom colour and opacity.',
    'related' => ['add-page-numbers', 'sign-pdf', 'pdf-metadata-remover'],
    'answer' => 'A watermark is text printed faintly across a page to show its status ("DRAFT"), who it belongs to, or that it mustn\'t be shared ("CONFIDENTIAL"). Type your text, choose a diagonal, tiled or footer layout, adjust colour and transparency, and download. A preview updates as you change the settings.',
    'article' => <<<'EOT_TF'
<h2>When to watermark a PDF</h2>
<ul>
<li><strong>Drafts:</strong> stop an early version being mistaken for the final one.</li>
<li><strong>Confidential documents:</strong> remind readers not to forward contracts, plans or reports.</li>
<li><strong>Copies of IDs:</strong> stamping "For bank account opening only" on a passport copy makes it much harder to misuse.</li>
<li><strong>Samples and portfolios:</strong> share work without giving away a clean, usable copy.</li>
<li><strong>Paid invoices:</strong> mark them "PAID" for your records.</li>
</ul>

<h2>Layouts</h2>
<ul>
<li><strong>One, diagonal:</strong> large text from corner to corner, automatically sized to fit each page. The classic watermark.</li>
<li><strong>Repeated (tiled):</strong> the text is repeated across the whole page at an angle. Much harder to crop or edit out.</li>
<li><strong>Small, at the bottom:</strong> a discreet line in the footer, for ownership notes like "Prepared for Acme Ltd".</li>
</ul>

<h2>Choosing opacity</h2>
<p>15–25% opacity keeps text underneath easy to read while the watermark stays obvious. Go higher for sample documents where readability matters less than protection. Grey or your brand colour both work; red and orange draw attention to "DRAFT" and "CONFIDENTIAL".</p>

<h2>How secure is a watermark?</h2>
<p>A text watermark is a deterrent, not encryption. Someone with PDF editing software can remove it. For stronger protection, use the tiled layout (which is tedious to remove), include the recipient's name so leaks can be traced, or convert the watermarked PDF to images with PDF to JPG so the watermark becomes part of the picture.</p>

<h2>Private by design</h2>
<p>The watermark is added in your browser. Your document is never uploaded, which matters most for exactly the kind of files people watermark.</p>

<h2>Choosing Opacity So Underlying Body Text Stays Legible</h2>
<p>Setting muted mid-grey watermarks around 15–25% opacity warns readers clearly of draft or internal status while keeping black financial tables and clause numbers completely effortless to scan on screens and laser prints.</p>

<h2>Stamping Version Dates &amp; Confidential Draft Notices</h2>
<p>Stamping shared quotes or unreleased manuscripts with a diagonal red or grey draft label alongside issue dates protects intellectual property cleanly without modifying core text streams.</p>
EOT_TF,
    'faqs' => [
        ['How do I add a watermark to a PDF?', 'Open the PDF, type your watermark text, choose a layout, colour and opacity, and download. Every page gets the watermark.'],
        ['Can I make the watermark transparent?', 'Yes. Use the opacity slider; 15–25% keeps the page readable.'],
        ['Can a watermark be removed?', 'Someone with PDF editing software can remove a text watermark. A tiled watermark is much harder to remove.'],
        ['Can I watermark a copy of my ID?', 'Yes. Add a line like “Copy for XYZ bank only, 2026” so the copy can’t easily be reused elsewhere.'],
        ['Is my PDF uploaded?', 'No. The watermark is added on your device.'],
        ['Can I watermark only interior pages and leave the cover clean?', 'Yes. Choose page-range exclusions or apply uniform stamps across every sheet directly before local download.'],
    ],
    'aka' => ['PDF Text Watermarker', 'Confidential Stamp PDF Tool'],
];
