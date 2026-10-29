<?php
// PDF to Excel: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'PDF to Excel',
  'category' => 'pdf',
  'order' => 23,
  'files' => true,
  'libs' => ['https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'],
  'scripts' => ['pdf-read.js'],
  'icon' => 'file-spreadsheet',
  'keywords' => 'pdf to excel converter online free convert pdf table to excel pdf to xlsx extract tables from pdf bank statement to excel pdf to csv',
  'aka' => ['PDF to XLSX', 'PDF table to Excel', 'PDF to CSV'], // other names people search for
  'short' => 'Pull the tables out of a PDF into an Excel spreadsheet (.xlsx or .csv), with numbers you can calculate with.',
  'title' => 'PDF to Excel Converter Online Free (PDF to XLSX)',
  'description' => <<<'EOT_TF'
Convert PDF tables to Excel online: rows and columns kept, numbers stored as real numbers, one sheet per page. Download .xlsx or .csv. Free, private, no upload.
EOT_TF,
  'related' => ['pdf-to-word', 'excel-to-pdf', 'pdf-to-text'],
  'answer' => <<<'EOT_TF'
Drop a PDF and its tables are turned into an <strong>Excel spreadsheet</strong>: each table keeps its rows and columns, and numbers, amounts and percentages become real numbers you can add up and chart. Choose one sheet per page or everything on one sheet, then download an <strong>.xlsx</strong> or <strong>.csv</strong> file.
EOT_TF,
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
EOT_TF,
  'faqs' => [
    [
      'How do I convert a PDF to Excel for free?',
      <<<'EOT_TF'
Drop the PDF here, check the preview and download the .xlsx file. It is free with no sign-up or email.
EOT_TF,
    ],
    [
      'Will the numbers work in Excel formulas?',
      <<<'EOT_TF'
Yes. Numbers, amounts with currency symbols and percentages are stored as real numbers, so SUM, sorting and charts work straight away.
EOT_TF,
    ],
    [
      'Can I convert a bank statement to Excel?',
      <<<'EOT_TF'
Yes, if it is a PDF with real text, like those downloaded from online banking. Each transaction becomes a row. The file never leaves your device.
EOT_TF,
    ],
    [
      'Can I get a CSV file instead?',
      <<<'EOT_TF'
Yes. Press Download CSV to get the data as comma-separated values for any spreadsheet or database.
EOT_TF,
    ],
    [
      'Is my PDF uploaded?',
      <<<'EOT_TF'
No. The PDF is converted in your browser and never leaves your device.
EOT_TF,
    ],
  ],
];
