<?php
return [
    'name' => 'PDF to PowerPoint',
    'updated' => '2026-11-15',
    'category' => 'pdf',
    'order' => 24,
    'files' => true,
    'libs' => [
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
        'https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js',
    ],
    'scripts' => ['pdf-read.js'],
    'icon' => 'presentation',
    'keywords' => 'pdf to powerpoint converter, pdf to pptx free online, turn pdf slides into editable pptx, no upload pptx',
    'aka' => ['PDF to PPTX Slide Maker', 'Editable PowerPoint Converter'],
    'short' => 'Turn a PDF into a PowerPoint presentation (.pptx) with editable text boxes on every slide.',
    'title' => 'PDF to PowerPoint Converter – Editable PPTX',
    'description' => 'Convert presentation PDFs back into editable .pptx slides retaining original fonts, box positions, colours and crisp visuals cleanly in browser.',
    'related' => ['pdf-to-word', 'pdf-to-jpg', 'pdf-to-excel'],
    'answer' => 'Drop a PDF and press <strong>Convert to PowerPoint</strong>. Each page becomes a slide: the background, pictures and shapes stay exactly as they were, and every line of text becomes an <strong>editable text box</strong> in the same font, size and colour. Open the .pptx in PowerPoint, Keynote or Google Slides.',
    'article' => <<<'EOT_TF'
<h2>How to convert a PDF to PowerPoint</h2>
<ol>
<li>Drop your PDF in the box, or try the sample.</li>
<li>Keep <strong>Editable text</strong> selected, or choose <strong>Exact look</strong> for slides that are pictures of the pages.</li>
<li>Press <strong>Convert to PowerPoint</strong>, check the slide previews and download the .pptx file.</li>
</ol>

<h2>How the slides are built</h2>
<p>With <strong>Editable text</strong>, each slide has two layers. Underneath is the page drawn without its text: backgrounds, photos, charts, logos and shapes look exactly as they did in the PDF. On top, every line of text is a separate PowerPoint text box, placed where it was, in the same font, size, bold or italic style and colour. You can change the wording, fix a typo or translate a slide without rebuilding it.</p>
<p><strong>Exact look</strong> turns each page into a full-slide picture. Nothing is editable, but it's perfect for presenting a PDF, such as a report or a handout, from PowerPoint or Google Slides.</p>

<h2>Tips</h2>
<ul>
<li>PDFs exported from PowerPoint, Keynote or Canva convert best, because each page is already a slide.</li>
<li>Slides are the same shape as the PDF's pages, so A4 documents become portrait slides.</li>
<li>If a font isn't installed on your computer, PowerPoint shows a similar one. Select the text and pick another font to change it.</li>
<li>Scanned PDFs have no text to edit, so their pages come across as pictures.</li>
</ul>

<h2>Private and free</h2>
<p>The PDF is converted in your browser and never uploaded, so confidential decks stay on your device. There's no sign-up, limit or watermark.</p>

<h2>Reclaiming Locked Slide Decks When Source Files Disappear</h2>
<p>Teams regularly lose editable Keynote or PowerPoint masters after exporting client PDF handouts. Rebuilding text runs into repositionable slide boxes lets speakers fix outdated dates, update quarterly figures and restyle charts without redrawing every deck from scratch.</p>

<h2>Updating Charts &amp; Dates Inside Recovered Decks Smoothly</h2>
<p>Check font fallback spacing briefly inside PowerPoint or Google Slides after export; re-aligning text box widths cleans up minor typography shifts dramatically faster than transcribing twenty slides manually.</p>
EOT_TF,
    'faqs' => [
        ['How do I convert a PDF to PowerPoint for free?', 'Drop the PDF here and press Convert to PowerPoint, then download the .pptx file. It is free with no sign-up or watermark.'],
        ['Is the text editable in PowerPoint?', 'Yes. With Editable text, every line is a PowerPoint text box in the same font, size and colour, on top of the page’s pictures and shapes.'],
        ['Does it work with Google Slides and Keynote?', 'Yes. Upload or open the .pptx file in Google Slides, Keynote or LibreOffice Impress.'],
        ['Is my PDF uploaded?', 'No. The PDF is converted in your browser and never leaves your device.'],
        ['Can generated PPTX decks be edited in Google Slides and Apple Keynote?', 'Yes. Standard OpenXML .pptx output opens directly in Microsoft PowerPoint, Google Slides, LibreOffice Impress and Keynote.'],
    ],
];
