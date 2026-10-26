<?php
// Remove Line Breaks: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Remove Line Breaks',
  'category' => 'text',
  'order' => 6,
  'icon' => 'wrap-text',
  'keywords' => 'remove line breaks remove extra spaces text cleaner join lines remove paragraph breaks fix pdf text copy paste',
  'short' => 'Clean up text copied from PDFs and emails: join lines, fix spaces.',
  'title' => 'Remove Line Breaks: Clean Up Pasted Text, Free',
  'description' => <<<'EOT_TF'
Remove line breaks and extra spaces from text copied from PDFs, emails and websites. Keep paragraphs if you like and rejoin split words. Paste, then copy.
EOT_TF,
  'related' => ['word-counter', 'case-converter', 'remove-duplicate-lines', 'pdf-to-text'],
  'answer' => <<<'EOT_TF'
Paste your text and the cleaned version appears straight away: single line breaks are joined into flowing sentences while <strong>paragraph breaks are kept</strong> (or removed too, if you choose). Options also remove extra spaces, empty lines and words split with a hyphen at the end of a line. Click <strong>Copy</strong> to use the result.
EOT_TF,
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
EOT_TF,
  'faqs' => [
    [
      'How do I remove line breaks from text?',
      <<<'EOT_TF'
Paste the text into the box. Line breaks are removed instantly; click Copy to use the cleaned text.
EOT_TF,
    ],
    [
      'Can I keep the paragraphs?',
      <<<'EOT_TF'
Yes. With Keep paragraphs selected, blank lines between paragraphs stay and only the breaks inside paragraphs are joined.
EOT_TF,
    ],
    [
      'Why does text copied from a PDF have line breaks?',
      <<<'EOT_TF'
PDFs store each line of text separately, so copying adds a line break at the end of every line. This tool joins them back together.
EOT_TF,
    ],
    [
      'Can I turn a list into one line separated by commas?',
      <<<'EOT_TF'
Yes. Choose Remove all and set Replace breaks with to a comma.
EOT_TF,
    ],
    [
      'Is my text saved or uploaded?',
      <<<'EOT_TF'
No. Everything happens in your browser and nothing is stored or sent anywhere.
EOT_TF,
    ],
  ],
];
