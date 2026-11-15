<?php
return [
    'name' => 'PDF to Word',
    'updated' => '2026-11-15',
    'category' => 'pdf',
    'order' => 22,
    'popular' => true,
    'files' => true,
    'libs' => [
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
    ],
    'scripts' => ['pdf-read.js'],
    'icon' => 'file-type',
    'keywords' => 'pdf to word converter, pdf to docx free no email, editable word document from pdf, no upload pdf docx',
    'aka' => ['Free PDF to DOCX Converter', 'Editable Word Document Extractor'],
    'short' => 'Convert a PDF into an editable Word document (.docx) with headings, paragraphs, lists, bold text and pictures.',
    'title' => 'PDF to Word Converter – Editable DOCX Free',
    'description' => 'Transform PDF contracts, CVs and reports into editable Microsoft Word .docx documents keeping headings, bullets, styles and embedded photos locally.',
    'related' => ['word-to-pdf', 'pdf-to-text', 'edit-pdf'],
    'answer' => 'Drop a PDF and press <strong>Convert to Word</strong>. You get a <strong>.docx</strong> file you can edit in Microsoft Word, Google Docs, Pages or LibreOffice, with the text in real paragraphs, headings, lists, bold and italic text and the pictures in place. Choose <strong>Exact look</strong> instead if you only need the pages to look identical.',
    'article' => <<<'EOT_TF'
<h2>How to convert a PDF to Word</h2>
<ol>
<li>Drop your PDF in the box, or try the sample.</li>
<li>Keep <strong>Editable text</strong> selected, and choose whether to start each PDF page on a new page in Word.</li>
<li>Press <strong>Convert to Word</strong>, check the preview of the text, then download the .docx file.</li>
</ol>

<h2>Editable text or exact look</h2>
<p><strong>Editable text</strong> rebuilds the document as Word paragraphs: lines of a paragraph are joined, so text flows and wraps when you edit it, and words split with a hyphen at a line end are put back together. Larger text becomes Word headings (Heading 1, 2, 3, so the navigation pane and table of contents work), bullets become a real bulleted list, and bold, italic, fonts and text sizes are kept. Pictures are placed where they appear, and the page size and margins match the PDF.</p>
<p><strong>Exact look</strong> puts each PDF page into Word as a picture. Nothing can be edited, but every page looks exactly like the PDF, which suits forms, certificates and designs that only need to be inserted into another Word file.</p>

<h2>What converts well</h2>
<p>Reports, letters, contracts, CVs, essays, manuals and e-books made in Word, Google Docs or another app convert well, because their PDF contains real text. Two-column pages are read one column after the other. Tables become lines of text, with the cells separated by spaces; if you need a table as a spreadsheet, use <a href="/pdf-to-excel">PDF to Excel</a>.</p>
<p>Scanned PDFs contain photos of pages, not text, so they come out as pictures. Read the text first with <a href="/image-to-text">Image to Text</a>.</p>

<h2>Private and free</h2>
<p>Most PDF to Word converters upload your file to a server and some ask for an email address. This one runs in your browser: the PDF never leaves your device and there's no sign-up, limit or watermark. To turn the edited document back into a PDF, use <a href="/word-to-pdf">Word to PDF</a>.</p>
EOT_TF,
    'faqs' => [
        ['How do I convert a PDF to Word for free?', 'Drop the PDF here and press Convert to Word. Download the .docx file and open it in Word, Google Docs, Pages or LibreOffice. It is free with no sign-up or email.'],
        ['Can I edit the converted Word document?', 'Yes. With Editable text, the text is in real Word paragraphs and headings with its fonts, sizes, bold and italic kept, so you can edit it like any document.'],
        ['Does it keep pictures and layout?', 'Pictures are placed where they appear, and the page size and margins match the PDF. Complex layouts are simplified into one flow of text. Choose Exact look to keep each page identical as a picture.'],
        ['Can I convert a scanned PDF to Word?', 'A scan has no text, so it converts as pictures. Use Image to Text first to read the words.'],
        ['Is my PDF uploaded?', 'No. The PDF is converted in your browser and never leaves your device.'],
    ],
];
