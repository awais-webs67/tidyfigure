<?php
return [
    'name' => 'Repair PDF',
    'updated' => '2026-11-15',
    'category' => 'pdf',
    'order' => 21,
    'files' => true,
    'libs' => [
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js',
    ],
    'icon' => 'wrench',
    'keywords' => 'repair corrupted pdf online, fix damaged unreadable pdf file, recover broken pdf free no upload',
    'aka' => ['Damaged PDF Fixer', 'Corrupt PDF Page Recovery'],
    'short' => 'Fix a damaged or corrupted PDF that won’t open, and recover as many pages as possible.',
    'title' => 'Repair Corrupted PDF Online – Recover Pages',
    'description' => 'Fix broken PDF cross-reference tables, truncated downloads and unreadable file headers in your browser to recover accessible document pages cleanly.',
    'related' => ['compress-pdf', 'pdf-to-text', 'unlock-pdf'],
    'answer' => 'Drop the damaged PDF. The tool first <strong>rebuilds the file\'s structure</strong>, which fixes most PDFs that won\'t open or show errors while keeping text and quality exactly as they were. If the file is too badly damaged for that, it <strong>recovers every page that can still be read</strong> and builds a new PDF from them, with the text kept searchable.',
    'article' => <<<'EOT_TF'
<h2>How to repair a PDF</h2>
<ol>
<li>Drop the damaged PDF in the box.</li>
<li>The tool tries to repair it straight away and tells you what it did and how many pages it recovered.</li>
<li>Check the preview of the repaired pages, then download the new PDF.</li>
</ol>

<h2>Why PDFs get damaged</h2>
<p>A PDF ends with an index (the cross-reference table) that tells readers where every page, font and image is stored. When a download is cut off, an email attachment is mangled, a disk or USB stick fails, or the program writing the PDF crashes, that index can be missing or wrong. Readers then say the file is damaged, show blank pages or refuse to open it, even though most of the content is still there.</p>

<h2>Two ways of repairing</h2>
<p><strong>Rebuild:</strong> the tool reads every object it can find in the file and writes a new, correct index. This fixes most damaged PDFs and keeps everything as it was: text stays sharp and selectable, and nothing is converted.</p>
<p><strong>Recover pages:</strong> when the structure is too broken to rebuild, a very forgiving PDF reader draws each page it can still read, and a new PDF is made from those pages. Each page becomes a high-resolution image with an invisible copy of its text on top, so you can still search, select and copy the text.</p>

<h2>When a PDF can't be repaired</h2>
<p>If a file was cut off halfway, the missing part simply isn't there, and pages stored in it can't come back. Files that are all zeros, or aren't really PDFs (for example a web page saved with a .pdf name), can't be repaired either. Try downloading the file again, or ask the sender for a new copy.</p>
<p>Password-protected PDFs aren't damaged: open them with <a href="/unlock-pdf">Unlock PDF</a>.</p>

<h2>Safely Archiving Recovered Copies Outside Damaged USB Drives</h2>
<p>Always download rebuilt files onto healthy local storage and spot-check critical signature pages after cross-reference table reconstruction before deleting damaged source originals.</p>
EOT_TF,
    'faqs' => [
        ['How do I fix a corrupted PDF for free?', 'Drop it here. The tool rebuilds the file or recovers every page it can still read, and you download the repaired PDF. It is free with no sign-up.'],
        ['Will the repaired PDF lose quality?', 'Not when the file can be rebuilt: everything is kept as it was. When pages have to be recovered, they become high-resolution images with their text kept searchable.'],
        ['Why can’t some pages be recovered?', 'If the file was cut off, for example by an interrupted download, the missing part is not in the file at all. Download it again or ask the sender for a new copy.'],
        ['Is my PDF uploaded?', 'No. The PDF is repaired in your browser and never leaves your device.'],
    ],
];
