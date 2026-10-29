<?php
// Excel to PDF: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Excel to PDF',
  'updated' => '2026-10-29', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'pdf',
  'order' => 26,
  'files' => true,
  'libs' => ['https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js', 'vendor/fontkit-1.1.1.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'],
  'scripts' => ['dom-pdf.js'],
  'icon' => 'file-spreadsheet',
  'keywords' => 'excel to pdf converter online free convert xlsx to pdf xls to pdf spreadsheet to pdf csv to pdf fit to page',
  'aka' => ['XLSX to PDF', 'spreadsheet to PDF', 'CSV to PDF'], // other names people search for
  'short' => 'Turn Excel spreadsheets (.xlsx, .xls, .ods, .csv) into tidy PDF pages that fit the page width.',
  'title' => 'Excel to PDF Converter Online Free (XLSX to PDF)',
  'description' => <<<'EOT_TF'
Convert Excel to PDF online: every sheet becomes neat PDF pages with gridlines, fitted to the page width, landscape when wide. Free and private, no upload.
EOT_TF,
  'related' => ['pdf-to-excel', 'word-to-pdf', 'merge-pdf'],
  'answer' => <<<'EOT_TF'
Drop a spreadsheet (<strong>.xlsx, .xls, .ods or .csv</strong>) and press <strong>Convert to PDF</strong>. Each sheet becomes PDF pages with gridlines and its numbers formatted as in the spreadsheet. Wide sheets are turned to <strong>landscape</strong> and shrunk to fit the page width, and long sheets continue on more pages without cutting rows in half.
EOT_TF,
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
EOT_TF,
  'faqs' => [
    [
      'How do I convert Excel to PDF for free?',
      <<<'EOT_TF'
Drop the spreadsheet here, press Convert to PDF and download the PDF. It is free with no sign-up and no upload.
EOT_TF,
    ],
    [
      'How do I fit an Excel sheet on one page width?',
      <<<'EOT_TF'
Leave Fit to page width on. Columns are scaled so they all fit across the page, and Automatic orientation uses landscape pages for wide sheets.
EOT_TF,
    ],
    [
      'Can I convert only one sheet?',
      <<<'EOT_TF'
Yes. Untick the sheets you don’t want in the list before converting.
EOT_TF,
    ],
    [
      'Does it work with CSV files?',
      <<<'EOT_TF'
Yes. CSV, .xls, .xlsx and .ods files all work.
EOT_TF,
    ],
    [
      'Is my spreadsheet uploaded?',
      <<<'EOT_TF'
No. It is converted in your browser and never leaves your device.
EOT_TF,
    ],
  ],
];
