<?php
// PDF to Text: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'PDF to Text',
  'updated' => '2026-10-22', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'pdf',
  'order' => 11,
  'icon' => 'file-text',
  'files' => true,
  'libs' => [
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
  ],
  'keywords' => 'extract text from pdf copy text pdf to txt convert pdf text',
  'short' => 'Extract all the text from a PDF to copy or save as a .txt file.',
  'title' => 'PDF to Text: Extract Text From a PDF Online, Free',
  'description' => <<<'EOT_TF'
Extract text from any PDF in seconds. Copy it or download a .txt file, with page markers. Works in your browser: private, free, no sign-up, no limits.
EOT_TF,
  'related' => ['word-counter', 'pdf-to-jpg', 'split-pdf'],
  'answer' => <<<'EOT_TF'
Open a PDF and all its text appears, page by page, ready to copy or download as a plain .txt file. This works for PDFs created from Word, Google Docs, websites and most software. <strong>Scanned PDFs</strong> are pictures of pages, so they contain no text to extract; those need OCR (optical character recognition) instead.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>Why extract text from a PDF?</h2>
<ul>
<li><strong>Copy a long passage</strong> without selecting it page by page.</li>
<li><strong>Edit the content</strong> in Word or Google Docs: paste the text in and reformat it.</li>
<li><strong>Count words</strong> in a PDF essay or report (paste the result into the Word Counter).</li>
<li><strong>Search and analyse</strong> the text, or feed it into translation or AI tools.</li>
<li><strong>Accessibility:</strong> plain text works well with screen readers and text-to-speech.</li>
</ul>

<h2>How it works</h2>
<p>PDFs store text as positioned pieces rather than flowing paragraphs. The extractor (built on PDF.js, the PDF engine in Firefox) reads those pieces in order and starts a new line whenever the text moves down the page. The result keeps the line structure of the original, which makes it easy to tidy up.</p>

<h2>Limitations</h2>
<ul>
<li><strong>Scanned documents:</strong> if the PDF came from a scanner or a phone photo, each page is an image. The tool tells you which pages had no text.</li>
<li><strong>Columns and tables:</strong> multi-column layouts may come out with columns interleaved, and tables become lines of text separated by spaces.</li>
<li><strong>Odd characters:</strong> some PDFs use custom font encodings that make extracted text look garbled. Copying from a PDF reader usually gives the same result, because the problem is in the file.</li>
<li><strong>Protected PDFs:</strong> files that require a password to open can't be read.</li>
</ul>

<h2>Page markers</h2>
<p>With "Mark where each page starts" ticked, each page begins with a line like <em>--- Page 3 ---</em>. That makes it easy to find where a quote came from. Untick it for one continuous text.</p>

<h2>Private by design</h2>
<p>Because extraction is instant, you can also use it to check whether a PDF is searchable before sending it: if no text comes out, the recipient won't be able to search it either.</p>
<p>Text is extracted in your browser. The PDF isn't uploaded anywhere, so it's safe for contracts, statements and other private documents.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I extract text from a PDF?',
      <<<'EOT_TF'
Open the PDF here. The text from every page appears straight away; copy it or download it as a .txt file.
EOT_TF,
    ],
    [
      'Why is no text extracted from my PDF?',
      <<<'EOT_TF'
The PDF is probably a scan, meaning each page is an image. Images need OCR software to turn them into text.
EOT_TF,
    ],
    [
      'Can I convert a PDF to Word?',
      <<<'EOT_TF'
This tool extracts the text, which you can paste into Word and reformat. Layout, images and tables are not kept.
EOT_TF,
    ],
    [
      'Does it work with multi-page PDFs?',
      'Yes. Every page is processed, and page markers show where each page starts.',
    ],
    ['Is my PDF uploaded?', 'No. Extraction happens in your browser.'],
  ],
];
