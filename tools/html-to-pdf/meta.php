<?php
// HTML to PDF: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'HTML to PDF',
  'updated' => '2026-10-29', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'pdf',
  'order' => 29,
  'files' => true,
  'libs' => ['https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js', 'vendor/fontkit-1.1.1.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'],
  'scripts' => ['dom-pdf.js'],
  'icon' => 'file-code',
  'keywords' => 'html to pdf converter online free convert html file to pdf html code to pdf save web page as pdf email template to pdf',
  'aka' => ['HTML file to PDF', 'HTML code to PDF', 'web page to PDF'], // other names people search for
  'short' => 'Turn HTML code or an .html file into a PDF with selectable text, on A4 or Letter pages.',
  'title' => 'HTML to PDF Converter Online Free (HTML File or Code)',
  'description' => <<<'EOT_TF'
Convert HTML to PDF online: paste HTML code or open an .html file and get a PDF with real, selectable text on A4 or Letter pages. Free, private, no upload.
EOT_TF,
  'related' => ['word-to-pdf', 'pdf-to-markdown', 'merge-pdf'],
  'answer' => <<<'EOT_TF'
Paste your <strong>HTML code</strong> or drop an <strong>.html file</strong>, choose the paper size and margins, and press <strong>Convert to PDF</strong>. The page is laid out with its own styles, cut into pages between lines, and saved as a PDF with real, selectable text. Scripts are removed first, so the code can't run.
EOT_TF,
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
EOT_TF,
  'faqs' => [
    [
      'How do I convert an HTML file to PDF for free?',
      <<<'EOT_TF'
Drop the .html file here or paste its code, choose the paper size and press Convert to PDF. It is free with no sign-up.
EOT_TF,
    ],
    [
      'Is the text in the PDF selectable?',
      <<<'EOT_TF'
Yes. The PDF contains real text, not a picture of the page, so you can select, copy and search it.
EOT_TF,
    ],
    [
      'Can I convert a website URL?',
      <<<'EOT_TF'
Save the page from your browser (Ctrl+S) and drop the saved .html file here, or use your browser’s Print → Save as PDF.
EOT_TF,
    ],
    [
      'Does my HTML run any scripts?',
      <<<'EOT_TF'
No. Scripts, frames and event handlers are removed before the HTML is laid out, and nothing is uploaded.
EOT_TF,
    ],
  ],
];
