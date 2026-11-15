<?php
return [
    'name' => 'PowerPoint to PDF',
    'updated' => '2026-11-15',
    'category' => 'pdf',
    'order' => 30,
    'files' => true,
    'libs' => [
        'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
        'https://cdn.jsdelivr.net/npm/pptx-preview@1.0.5/dist/pptx-preview.umd.js',
        'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js',
        'vendor/fontkit-1.1.1.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
    ],
    'scripts' => ['dom-pdf.js'],
    'icon' => 'presentation',
    'keywords' => 'powerpoint to pdf converter, pptx to pdf free online, convert slides to pdf handout no upload',
    'aka' => ['PPTX to PDF Converter', 'Slide Deck to PDF Tool'],
    'short' => 'Convert PowerPoint presentations (.pptx) to PDF, one slide per page, with selectable text.',
    'title' => 'PowerPoint to PDF Converter – PPTX to PDF',
    'description' => 'Convert PPTX slide decks into locked, shareable PDF handouts keeping vector text, charts, slide aspect ratios and embedded graphics intact locally.',
    'related' => ['pdf-to-powerpoint', 'word-to-pdf', 'compress-pdf'],
    'answer' => 'Drop a PowerPoint file (<strong>.pptx</strong>) and press <strong>Convert to PDF</strong>. Each slide becomes a PDF page the same shape as the slide, with its backgrounds, pictures, shapes and text, and the text stays <strong>selectable and searchable</strong>. You don\'t need PowerPoint installed.',
    'article' => <<<'EOT_TF'
<h2>How to convert PowerPoint to PDF</h2>
<ol>
<li>Drop your .pptx file in the box, or try the sample presentation.</li>
<li>Press <strong>Convert to PDF</strong> and wait a moment while the slides are drawn.</li>
<li>Check the page previews and download the PDF.</li>
</ol>

<h2>Why send slides as a PDF?</h2>
<p>A PDF opens the same way on every computer and phone, without PowerPoint, and nobody can accidentally move things around. It's the best format for sharing slides after a talk, attaching a deck to an email, printing handouts or uploading a presentation to a course site.</p>

<h2>What's kept</h2>
<p>Every slide becomes one page with the slide's own shape (16:9 or 4:3). Backgrounds, pictures, shapes, tables and text are drawn where they are on the slide, and the text in the PDF is real text that can be selected and searched. Office fonts such as Calibri are replaced by free fonts with the same letter widths, so text fits its boxes as it does in PowerPoint.</p>
<p>Animations and transitions don't exist in a PDF, so each slide is shown in its final state. Videos, sound and speaker notes aren't included, and some effects (3D, shadows, unusual charts) may look simpler.</p>

<h2>Private and free</h2>
<p>The presentation is converted in your browser and never uploaded. To turn a PDF back into editable slides, use <a href="/pdf-to-powerpoint">PDF to PowerPoint</a>.</p>

<h2>Why Sending PDF Handouts Beats Sending Raw PPTX Files</h2>
<p>Raw slide decks frequently suffer missing desktop font substitutions, shifted tables across macOS/Windows PowerPoint builds and bloated embedded media—locking slides into standard PDF guarantees every investor, professor and client sees identical typography on any phone.</p>

<h2>Preserving Wide 16:9 Slide Geometry &amp; Embedded Graphics</h2>
<p>Converting directly inside your browser retains crisp slide layouts and crisp vector shapes across 16:9 widescreen decks, client proposals and classroom lecture packs—ready to email safely anywhere without font drift.</p>
EOT_TF,
    'faqs' => [
        ['How do I convert PowerPoint to PDF for free?', 'Drop the .pptx file here and press Convert to PDF, then download the PDF. It is free with no sign-up, and you don’t need PowerPoint.'],
        ['Will each slide be one page?', 'Yes. Each slide becomes one PDF page with the same shape as the slide.'],
        ['Can I convert an old .ppt file?', 'Not directly. Open it in PowerPoint, Keynote, Google Slides or LibreOffice and save it as .pptx first.'],
        ['Is my presentation uploaded?', 'No. It is converted in your browser and never leaves your device.'],
        ['Does converting a PPTX presentation to PDF work without Microsoft Office installed?', 'Yes. Everything parses and renders directly inside your web browser without needing PowerPoint, Google Slides or an account.'],
        ['Will speaker animations appear in the converted PDF?', 'Each slide exports cleanly in its finished visual state as one crisp PDF page—ideal for handouts and printing.'],
    ],
];
