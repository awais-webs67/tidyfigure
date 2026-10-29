<?php
// Remove Duplicate Lines: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Remove Duplicate Lines',
  'updated' => '2026-10-22', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'text',
  'order' => 5,
  'icon' => 'list-x',
  'keywords' => 'dedupe list remove duplicates unique lines email list sort lines',
  'short' => 'Delete repeated lines from a list, ignore case or spaces, and sort the result.',
  'title' => 'Remove Duplicate Lines: Dedupe Any List Online, Free',
  'description' => <<<'EOT_TF'
Remove duplicate lines from any list: emails, names, keywords or URLs. Ignore case and spaces, drop empty lines, and sort A–Z. Instant and private.
EOT_TF,
  'related' => ['word-counter', 'case-converter', 'random-number-generator'],
  'answer' => <<<'EOT_TF'
Paste a list with one item per line and every repeated line is removed, keeping the <strong>first time each item appears</strong>. Turn on "ignore case" so that "Apple" and "apple" count as the same, and "ignore spaces" to catch lines that only differ by stray spaces. You can sort the result A to Z, by number or by length.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>How duplicates are found</h2>
<p>The tool reads your text line by line and remembers every line it has seen. When a line comes up again, it's dropped. The first copy stays where it was, so your list keeps its original order unless you choose to sort it.</p>
<p>Two settings decide what counts as "the same":</p>
<ul>
<li><strong>Ignore upper/lower case:</strong> "Apple@Example.com" and "apple@example.com" are treated as one. Keep this on for email addresses, which aren't case-sensitive in practice.</li>
<li><strong>Ignore spaces at the start and end:</strong> lines copied from spreadsheets and PDFs often carry invisible spaces. This trims them before comparing.</li>
</ul>

<h2>Common uses</h2>
<ul>
<li><strong>Email and contact lists:</strong> merge sign-ups from several sources without emailing anyone twice.</li>
<li><strong>Keyword research:</strong> combine keyword exports and keep each phrase once.</li>
<li><strong>URLs and links:</strong> clean up lists of pages before checking or submitting them.</li>
<li><strong>Names and attendance:</strong> combine registration lists and count unique people.</li>
<li><strong>Code and data:</strong> dedupe IDs, tags, imports or log lines.</li>
</ul>

<h2>Sorting options</h2>
<p><strong>A → Z</strong> sorts alphabetically the way people expect, ignoring case and treating numbers inside text naturally, so "item 2" comes before "item 10". <strong>Numbers</strong> sorts by the number at the start of each line, which is handy for lists of prices or scores. <strong>Shortest first</strong> groups short entries together, useful for spotting typos and fragments.</p>

<h2>Working with spreadsheets</h2>
<p>To dedupe a column from Excel or Google Sheets, copy the column, paste it here, copy the result and paste it back. Each cell becomes one line. If you need to dedupe whole rows with several columns, copy the rows: each row becomes a single line with tabs between the cells, and the row is only removed if every cell matches.</p>

<h2>Private by design</h2>
<p>Your list never leaves your browser. That matters for customer emails and other personal data, which you shouldn't paste into tools that send it to a server.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I remove duplicate lines from a list?',
      <<<'EOT_TF'
Paste the list with one item per line. Duplicates are removed instantly, and you can copy the cleaned list with one click.
EOT_TF,
    ],
    [
      'Does it keep the original order?',
      <<<'EOT_TF'
Yes. The first occurrence of each line stays in its original position. Choose a sort option only if you want the result sorted.
EOT_TF,
    ],
    [
      'Can it ignore differences in capital letters?',
      'Yes. With “Ignore upper/lower case” on, “Apple” and “apple” count as the same line.',
    ],
    [
      'How many lines can it handle?',
      <<<'EOT_TF'
Hundreds of thousands of lines work fine in a modern browser, as long as your device has enough memory.
EOT_TF,
    ],
    [
      'Is my list uploaded?',
      'No. Everything happens in your browser, so email lists and other personal data stay private.',
    ],
  ],
];
