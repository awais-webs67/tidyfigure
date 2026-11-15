<?php
return [
    'name' => 'PDF to Excel',
    'updated' => '2026-11-15',
    'category' => 'pdf',
    'order' => 23,
    'files' => true,
    'libs' => [
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
    ],
    'scripts' => ['pdf-read.js'],
    'icon' => 'file-spreadsheet',
    'keywords' => 'pdf to excel converter, extract pdf table to xlsx free, bank statement pdf to csv, no upload pdf xlsx',
    'aka' => ['PDF Table to XLSX Tool', 'PDF Statement to Excel'],
    'short' => 'Pull the tables out of a PDF into an Excel spreadsheet (.xlsx or .csv), with numbers you can calculate with.',
    'title' => 'PDF to Excel Converter – Extract Tables XLSX',
    'description' => 'Convert financial statements, bank tables and PDF price lists into clean editable XLSX spreadsheets or CSV rows locally on your own computer.',
    'related' => ['pdf-to-word', 'excel-to-pdf', 'pdf-to-text'],
    'answer' => 'Drop a PDF and its tables are turned into an <strong>Excel spreadsheet</strong>: each table keeps its rows and columns, and numbers, amounts and percentages become real numbers you can add up and chart. Choose one sheet per page or everything on one sheet, then download an <strong>.xlsx</strong> or <strong>.csv</strong> file.',
    'article' => <<<'EOT_TF'
<h2>How to convert a PDF to Excel</h2>
<ol>
<li>Drop your PDF in the box, or try the sample.</li>
<li>Choose <strong>Tables only</strong> to keep just the tables, or <strong>All text</strong> to bring every line across too, and whether to put each page on its own sheet.</li>
<li>Check the preview and download the <strong>.xlsx</strong> file for Excel, Google Sheets or Numbers, or a <strong>.csv</strong> file.</li>
</ol>

<h2>How tables are found</h2>
<p>A PDF doesn't store tables, only text at positions on the page. The converter looks for lines whose pieces of text line up in columns over several rows, works out where each column starts and puts every piece of text into the right cell. Empty cells stay empty, so columns don't shift.</p>
<p>Numbers are stored as numbers: <code>1,250.50</code>, <code>-3.2</code>, <code>£1,250</code> and <code>12%</code> all become values Excel can add up, sort and chart, instead of text that only looks like a number.</p>

<h2>Good for</h2>
<ul>
<li>Bank and credit card statements, to sort and categorise your spending.</li>
<li>Invoices, price lists and quotes.</li>
<li>Reports and research papers with data tables.</li>
<li>Timetables, results tables and schedules.</li>
</ul>

<h2>Limits</h2>
<p>Tables made of real text convert well. Scanned PDFs are pictures, so there's no text to put in cells: read them first with <a href="/image-to-text">Image to Text</a>. Very complex tables, with merged cells or text that wraps inside cells, may need some tidying in Excel.</p>
<p>The PDF is read in your browser and never uploaded, which matters for statements and other financial documents.</p>

<h2>Cleaning Currency Signs &amp; Negative Parentheses After Export</h2>
<p>Real bank and accounting exports frequently encode negative values inside parentheses such as <code>($142.50)</code> or split multi-line invoice memos across sub-rows. Parsing pure coordinate columns into numeric cells avoids hours of retyping ledger columns by hand.</p>

<h2>Multi-Page Ledgers Separated Cleanly Per Worksheet</h2>
<p>Grouping each PDF table page cleanly or downloading structured CSV rows lets analysts paste quarterly reports directly into Excel pivot tables without fixing broken cell borders manually.</p>
EOT_TF,
    'faqs' => [
        ['How do I convert a PDF to Excel for free?', 'Drop the PDF here, check the preview and download the .xlsx file. It is free with no sign-up or email.'],
        ['Will the numbers work in Excel formulas?', 'Yes. Numbers, amounts with currency symbols and percentages are stored as real numbers, so SUM, sorting and charts work straight away.'],
        ['Can I convert a bank statement to Excel?', 'Yes, if it is a PDF with real text, like those downloaded from online banking. Each transaction becomes a row. The file never leaves your device.'],
        ['Can I get a CSV file instead?', 'Yes. Press Download CSV to get the data as comma-separated values for any spreadsheet or database.'],
        ['Is my PDF uploaded?', 'No. The PDF is converted in your browser and never leaves your device.'],
        ['Can I export a multi-page financial PDF as one combined CSV or workbook?', 'Yes. Download structured Excel workbooks separating each table sheet cleanly or save flat CSV columns ready for Excel and Google Sheets.'],
    ],
];
