<?php
// JSON Formatter & Validator: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'JSON Formatter & Validator',
  'category' => 'dev',
  'order' => 2,
  'icon' => 'braces',
  'keywords' => 'json beautifier json validator pretty print json minify json lint',
  'short' => 'Pretty-print, validate and minify JSON, with clear error locations.',
  'title' => 'JSON Formatter & Validator: Beautify and Minify JSON',
  'description' => <<<'EOT_TF'
Format, validate and minify JSON online. Pretty-print with 2 or 4 spaces, sort keys, and see exactly where errors are with fix tips. Private, runs in browser.
EOT_TF,
  'related' => ['base64-encoder-decoder', 'remove-duplicate-lines', 'case-converter'],
  'answer' => <<<'EOT_TF'
Paste JSON to check it and format it with readable indentation. If it's invalid, you'll see the <strong>line and column</strong> of the error and a hint for the usual culprits: single quotes, unquoted keys and trailing commas. "Minify" removes all whitespace for the smallest possible size. Your data never leaves your browser.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>What is JSON?</h2>
<p>JSON (JavaScript Object Notation) is the most common format for sending data between apps, websites and APIs. It's plain text made of two structures: <strong>objects</strong> (key–value pairs in curly braces) and <strong>arrays</strong> (ordered lists in square brackets). Values can be strings, numbers, true, false, null, or more objects and arrays.</p>
<div class="formula">{
  "name": "TidyFigure",
  "tools": 40,
  "free": true,
  "categories": ["image", "pdf", "text"],
  "owner": null
}</div>

<h2>The most common JSON errors</h2>
<ul>
<li><strong>Single quotes:</strong> JSON strings and keys must use double quotes. <code>{'a': 1}</code> is invalid; <code>{"a": 1}</code> is valid.</li>
<li><strong>Unquoted keys:</strong> <code>{name: "x"}</code> works in JavaScript but not in JSON.</li>
<li><strong>Trailing commas:</strong> <code>[1, 2, 3,]</code> has an extra comma before the bracket.</li>
<li><strong>Comments:</strong> JSON doesn't allow <code>//</code> or <code>/* */</code> comments.</li>
<li><strong>Special values:</strong> <code>undefined</code>, <code>NaN</code> and <code>Infinity</code> aren't valid JSON. Use <code>null</code>.</li>
<li><strong>Unescaped characters:</strong> quotes and backslashes inside strings must be escaped as <code>\"</code> and <code>\\</code>, and line breaks as <code>\n</code>.</li>
</ul>

<h2>Format versus minify</h2>
<p><strong>Formatting</strong> (also called beautifying or pretty-printing) adds line breaks and indentation so people can read the structure. Two spaces is the most common style; four spaces and tabs are popular in some teams. <strong>Minifying</strong> removes every unnecessary space and line break. It doesn't change the data, but it makes files smaller for storage and network transfer.</p>

<h2>Sorting keys</h2>
<p>JSON objects have no meaningful key order, so sorting keys alphabetically doesn't change the data. It's helpful for comparing two JSON files, reviewing config changes, or finding a key quickly in a large object. Arrays are never reordered, because their order does matter.</p>

<h2>Private by design</h2>
<p>API responses and config files often contain tokens, emails and other sensitive data. This formatter uses your browser's built-in JSON parser and never sends your data to a server, so it's safe to paste production data.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I format JSON?',
      <<<'EOT_TF'
Paste it into the box. It is checked and pretty-printed with indentation automatically. Copy or download the result.
EOT_TF,
    ],
    [
      'How do I find the error in my JSON?',
      <<<'EOT_TF'
If the JSON is invalid, the tool shows the error message, the line and column, the text around the problem, and a tip for common mistakes.
EOT_TF,
    ],
    [
      'Why is my JSON invalid with single quotes?',
      <<<'EOT_TF'
The JSON standard only allows double quotes for strings and keys. Replace single quotes with double quotes.
EOT_TF,
    ],
    [
      'Does minifying JSON change the data?',
      'No. It only removes whitespace. The values and structure are identical.',
    ],
    [
      'Is it safe to paste sensitive JSON here?',
      'Yes. Parsing and formatting happen in your browser and nothing is uploaded.',
    ],
  ],
];
