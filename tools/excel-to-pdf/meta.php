<?php
return [
    'name' => 'Excel to PDF',
    'updated' => '2026-11-15',
    'category' => 'pdf',
    'order' => 26,
    'files' => true,
    'libs' => [
        'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js',
        'vendor/fontkit-1.1.1.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
    ],
    'scripts' => ['dom-pdf.js'],
    'icon' => 'file-spreadsheet',
    'keywords' => 'excel to pdf converter, xlsx to pdf free, fit wide excel sheet pdf page, csv spreadsheet to pdf',
    'aka' => ['XLSX to PDF Converter', 'Spreadsheet to PDF Tool'],
    'short' => 'Turn Excel spreadsheets (.xlsx, .xls, .ods, .csv) into tidy PDF pages that fit the page width.',
    'title' => 'Excel to PDF Converter – Fit XLSX Columns',
    'description' => 'Convert multi-sheet XLSX, XLS and CSV workbooks into crisp paginated PDFs with auto landscape fit, headers and visible gridlines locally.',
    'related' => ['pdf-to-excel', 'word-to-pdf', 'merge-pdf'],
    'answer' => 'Drop a spreadsheet (<strong>.xlsx, .xls, .ods or .csv</strong>) and press <strong>Convert to PDF</strong>. Each sheet becomes PDF pages with gridlines and its numbers formatted as in the spreadsheet. Wide sheets are turned to <strong>landscape</strong> and shrunk to fit the page width, and long sheets continue on more pages without cutting rows in half.',
    'article' => <<<'EOT_TF'
<h2>How to convert Excel to PDF</h2>
<ol>
<li>Drop your spreadsheet in the box, or try the sample.</li>
<li>Choose the paper size and orientation (or leave it on <strong>Automatic</strong>), and which sheets to include.</li>
<li>Press <strong>Convert to PDF</strong>, check the page previews and download.</li>
</ol>

<h2>Neat pages from any spreadsheet</h2>
<p>Printing a spreadsheet often goes wrong: a few columns spill onto a second page, or the text comes out tiny. Here every sheet is laid out to fit the width of the page. With <strong>Automatic</strong> orientation, a sheet that's wider than it is tall goes on landscape pages, and if it's still too wide the text is made a little smaller so every column fits. Long sheets continue onto as many pages as they need, and rows are never cut in half.</p>
<p>Numbers, dates and currencies appear as they're formatted in the spreadsheet, merged cells stay merged, and column widths follow the spreadsheet. The text in the PDF is real text that you can select and search.</p>

<h2>Supported files</h2>
<p>Excel workbooks (.xlsx, .xlsm and the older .xls), OpenDocument spreadsheets (.ods) and CSV files. Formulas show their last saved results. Charts, pictures and cell colours aren't included: the PDF shows the data in a clean grid.</p>

<h2>Private and free</h2>
<p>Spreadsheets often hold budgets, salaries or customer lists. This converter runs in your browser, so the file never leaves your device. To get tables out of a PDF and back into Excel, use <a href="/pdf-to-excel">PDF to Excel</a>.</p>

<h2>Preventing Cut-Off Far-Right Columns on Printouts</h2>
<p>Financial trackers and attendance sheets routinely split trailing columns onto dangling extra PDF pages. Auto-switching wide tabs to landscape orientation and scaling columns to page width produces board-ready tables cleanly in one pass.</p>

<h2>Clean Repeating Margins &amp; Number Alignment</h2>
<p>Auto-fitting wide budget columns onto single landscape sheets eliminates tiny split tables, letting finance teams review invoices, payroll trackers and inventory logs cleanly across tablets and laser printouts.</p>
EOT_TF,
    'faqs' => [
        ['How do I convert Excel to PDF for free?', 'Drop the spreadsheet here, press Convert to PDF and download the PDF. It is free with no sign-up and no upload.'],
        ['How do I fit an Excel sheet on one page width?', 'Leave Fit to page width on. Columns are scaled so they all fit across the page, and Automatic orientation uses landscape pages for wide sheets.'],
        ['Can I convert only one sheet?', 'Yes. Untick the sheets you don’t want in the list before converting.'],
        ['Does it work with CSV files?', 'Yes. CSV, .xls, .xlsx and .ods files all work.'],
        ['Is my spreadsheet uploaded?', 'No. It is converted in your browser and never leaves your device.'],
        ['Are formulas protected or exposed when saving Excel sheets as PDF?', 'Converted PDFs bake calculated values cleanly into locked layout pages—hiding confidential pricing spreadsheets formulas from external clients.'],
    ],
];
