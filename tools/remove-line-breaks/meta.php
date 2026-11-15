<?php
return [
    'name' => 'Remove Line Breaks',
    'updated' => '2026-11-15',
    'category' => 'text',
    'order' => 6,
    'icon' => 'wrap-text',
    'keywords' => 'remove line breaks, join broken pdf lines, strip carriage returns online, clean copied pdf text',
    'short' => 'Clean up text copied from PDFs and emails: join lines, fix spaces.',
    'title' => 'Remove Line Breaks – Fix Copied PDF Text',
    'description' => 'Join broken hard wraps pasted from PDFs, emails or OCR scans into clean continuous paragraphs while preserving intentional stanza or section breaks.',
    'related' => ['word-counter', 'case-converter', 'remove-duplicate-lines', 'pdf-to-text'],
    'answer' => 'Paste your text and the cleaned version appears straight away: single line breaks are joined into flowing sentences while <strong>paragraph breaks are kept</strong> (or removed too, if you choose). Options also remove extra spaces, empty lines and words split with a hyphen at the end of a line. Click <strong>Copy</strong> to use the result.',
    'article' => <<<'EOT_TF'
<h2>Why pasted text has broken lines</h2>
 <p>PDFs, emails and some websites store text as separate lines with a break at the end of each one. When you copy it into a document, form or chat, every line ends early, sentences are cut in half and the text looks jagged. This tool joins those lines back together.</p>

 <h2>Options</h2>
 <ul>
 <li><strong>Keep paragraphs:</strong> a blank line (two line breaks) is treated as a new paragraph and kept, while single breaks inside a paragraph are joined. Choose <strong>Remove all</strong> for one continuous block of text.</li>
 <li><strong>Replace breaks with:</strong> a space (normal), nothing, a comma or a custom separator, which is handy for turning a list into one line.</li>
 <li><strong>Rejoin hyphenated words:</strong> “docu-” at the end of one line and “ment” on the next become “document”.</li>
 <li><strong>Remove extra spaces:</strong> turns runs of spaces and tabs into a single space and trims each line.</li>
 </ul>

 <h2>Example</h2>
 <p>Text copied from a PDF:</p>
 <pre class="copybox">The quick brown fox jumps over
the lazy dog. It was a sunny
after-
noon in the park.</pre>
 <p>After cleaning:</p>
 <pre class="copybox">The quick brown fox jumps over the lazy dog. It was a sunny afternoon in the park.</pre>

 <h2>Private</h2>
 <p>The text is cleaned in your browser as you type. Nothing is uploaded, so it’s safe for emails, contracts and other private documents.</p>

<h2>Rejoining Hyphenated Words Split Across Columns</h2>
<p>Multi-column academic PDFs and newspaper layouts routinely split single words across line endings with trailing hyphens (<code>docu-\nment</code>). Toggle hyphen rejoining alongside double-break preservation so genuine paragraph breaks stay intact while mid-sentence breaks vanish cleanly.</p>

<h2>Preserving Double Blank Lines Between Paragraphs</h2>
<p>Turning on paragraph-break detection collapses single line wraps caused by narrow PDF columns into smooth flowing sentences while leaving intentional blank-line transitions cleanly separated.</p>
EOT_TF,
    'faqs' => [
        ['How do I remove line breaks from text?', 'Paste the text into the box. Line breaks are removed instantly; click Copy to use the cleaned text.'],
        ['Can I keep the paragraphs?', 'Yes. With Keep paragraphs selected, blank lines between paragraphs stay and only the breaks inside paragraphs are joined.'],
        ['Why does text copied from a PDF have line breaks?', 'PDFs store each line of text separately, so copying adds a line break at the end of every line. This tool joins them back together.'],
        ['Can I turn a list into one line separated by commas?', 'Yes. Choose Remove all and set Replace breaks with to a comma.'],
        ['Is my text saved or uploaded?', 'No. Everything happens in your browser and nothing is stored or sent anywhere.'],
        ['Can I replace line breaks with commas instead of spaces?', 'Yes. Pick custom join separator (space, comma or nothing) to turn vertical column lists into CSV strings in one paste.'],
        ['Does removing line breaks upload or save my copied PDF text?', 'Never. All text cleanup runs instantaneously in JavaScript inside your browser tab, leaving confidential contracts and notes strictly on your screen.'],
    ],
    'aka' => ['Line Break Remover', 'PDF Copy-Paste Cleaner'],
];
