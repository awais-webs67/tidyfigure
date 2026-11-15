<?php
return [
    'name' => 'HTML to PDF',
    'updated' => '2026-11-15',
    'category' => 'pdf',
    'order' => 29,
    'files' => true,
    'libs' => [
        'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js',
        'vendor/fontkit-1.1.1.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
    ],
    'scripts' => ['dom-pdf.js'],
    'icon' => 'file-code',
    'keywords' => 'html to pdf converter, convert html code to pdf free, html file to selectable pdf, invoice template html pdf',
    'aka' => ['HTML Markup to PDF', 'Selectable Text HTML Converter'],
    'short' => 'Turn HTML code or an .html file into a PDF with selectable text, on A4 or Letter pages.',
    'title' => 'HTML to PDF Converter – Code & File to A4',
    'description' => 'Render raw HTML/CSS markup or local .html templates into clean A4 or Letter PDF documents with real selectable text right inside your tab.',
    'related' => ['word-to-pdf', 'pdf-to-markdown', 'merge-pdf'],
    'answer' => 'Paste your <strong>HTML code</strong> or drop an <strong>.html file</strong>, choose the paper size and margins, and press <strong>Convert to PDF</strong>. The page is laid out with its own styles, cut into pages between lines, and saved as a PDF with real, selectable text. Scripts are removed first, so the code can\'t run.',
    'article' => <<<'EOT_TF'
<h2>How to convert HTML to PDF</h2>
<ol>
<li>Paste HTML code into the box, or drop an .html file (a saved web page, an email template, an exported report).</li>
<li>Choose the paper size, orientation and margins.</li>
<li>Press <strong>Convert to PDF</strong>, check the page previews and download.</li>
</ol>

<h2>What's kept</h2>
<p>Styles in the HTML (in <code>&lt;style&gt;</code> tags and <code>style</code> attributes) are used, so headings, colours, tables, borders, backgrounds and lists look as they do in a browser. Long content continues onto as many pages as needed and lines are never cut in half. The PDF contains real text that you can select and search.</p>
<p>Fonts are replaced by close free fonts (sans-serif, serif and monospace), so the layout matches what the PDF can show. Pictures embedded in the HTML (data URLs) are included; pictures linked from other websites are included when those sites allow it.</p>

<h2>Safe by design</h2>
<p>Scripts, frames and event handlers are removed before the HTML is shown, so pasted code can't run or load trackers. Everything happens in your browser and nothing is uploaded.</p>

<h2>Converting a live web page</h2>
<p>To turn a website into a PDF, open it in your browser, press Ctrl+S (or Cmd+S on a Mac) and save it as "Web page, complete" or "HTML only", then drop the saved file here. You can also use the browser's own Print → Save as PDF.</p>

<h2>Testing Print Margins &amp; Selectable Vector Copy</h2>
<p>Unlike screenshot tools that output blurry raster pictures, native layout conversion keeps headings, tables and links crisp and search-indexable across page breaks. Keep CSS backgrounds enabled and test clean <code>@page</code> spacing when exporting multi-section reports.</p>

<h2>Prepping Clean Print Stylesheets &amp; Report Exports</h2>
<p>Wrap repeating table headers cleanly in semantic markup and stick to clean standard sans or serif stacks so generated receipts, documentation exports and audit certificates render predictably across PDF viewers.</p>
EOT_TF,
    'faqs' => [
        ['How do I convert an HTML file to PDF for free?', 'Drop the .html file here or paste its code, choose the paper size and press Convert to PDF. It is free with no sign-up.'],
        ['Is the text in the PDF selectable?', 'Yes. The PDF contains real text, not a picture of the page, so you can select, copy and search it.'],
        ['Can I convert a website URL?', 'Save the page from your browser (Ctrl+S) and drop the saved .html file here, or use your browser’s Print → Save as PDF.'],
        ['Does my HTML run any scripts?', 'No. Scripts, frames and event handlers are removed before the HTML is laid out, and nothing is uploaded.'],
        ['Why are external images sometimes blocked when converting local HTML files?', 'Browsers guard cross-origin images unless loaded with CORS permissions or embedded directly as inline base64 data URIs.'],
    ],
];
