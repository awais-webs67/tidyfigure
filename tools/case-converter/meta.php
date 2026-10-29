<?php
// Case Converter: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Case Converter',
  'updated' => '2026-10-22', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'text',
  'order' => 3,
  'icon' => 'case-sensitive',
  'keywords' => 'uppercase lowercase title case sentence case camelcase snake case capitalize',
  'short' => 'Change text to UPPER, lower, Title or Sentence case, camelCase and more.',
  'title' => 'Case Converter: Uppercase, Lowercase, Title & Sentence Case',
  'description' => <<<'EOT_TF'
Convert text to uppercase, lowercase, Title Case, Sentence case, camelCase, snake_case, kebab-case and more. Fix caps-lock mistakes instantly. Free.
EOT_TF,
  'related' => ['word-counter', 'fancy-text-generator', 'remove-duplicate-lines'],
  'answer' => <<<'EOT_TF'
Paste your text and pick a style. <strong>Sentence case</strong> capitalises the first letter of each sentence (fixes text typed with caps lock on). <strong>Title Case</strong> capitalises the main words of a headline but keeps short words like "of", "and" and "the" lower case. Programmers can switch between camelCase, snake_case and kebab-case.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>Every case explained</h2>
<div class="scroll"><table class="tbl">
<thead><tr><th>Case</th><th>Example</th><th>Used for</th></tr></thead>
<tbody>
<tr><td>Sentence case</td><td>The city of London is busy.</td><td>Normal writing, UI labels</td></tr>
<tr><td>lower case</td><td>the city of london is busy.</td><td>Hashtags, casual text</td></tr>
<tr><td>UPPER CASE</td><td>THE CITY OF LONDON IS BUSY.</td><td>Warnings, acronyms, signs</td></tr>
<tr><td>Title Case</td><td>The City of London Is Busy</td><td>Headlines, book and film titles</td></tr>
<tr><td>Capitalize Each Word</td><td>The City Of London Is Busy</td><td>Names, some product listings</td></tr>
<tr><td>camelCase</td><td>theCityOfLondon</td><td>JavaScript and Java variables</td></tr>
<tr><td>PascalCase</td><td>TheCityOfLondon</td><td>Class and component names</td></tr>
<tr><td>snake_case</td><td>the_city_of_london</td><td>Python, databases, file names</td></tr>
<tr><td>kebab-case</td><td>the-city-of-london</td><td>URLs, CSS classes</td></tr>
<tr><td>CONSTANT_CASE</td><td>THE_CITY_OF_LONDON</td><td>Constants, environment variables</td></tr>
</tbody></table></div>

<h2>How Title Case works</h2>
<p>Title case follows the rules shared by most English style guides (AP, Chicago, APA, MLA): capitalise the first and last word and every "major" word, but keep short articles, conjunctions and prepositions in lower case. The words kept small here are: a, an, and, as, at, but, by, for, if, in, nor, of, on, or, per, the, to, vs, via and with. A word straight after a colon or dash is always capitalised.</p>
<p>Style guides differ on a few details. APA, for example, capitalises any word of four letters or more, including prepositions like "with". If your publication has a house style, check the result against it.</p>

<h2>Sentence case and the caps-lock fix</h2>
<p>Typed a whole paragraph with caps lock on? Choose Sentence case. It lowers everything, then capitalises the first letter after each full stop, question mark, exclamation mark and new line, and the word "I". Names and places will need a quick manual touch afterwards, since a tool can't know that "london" is a city.</p>

<h2>For developers</h2>
<p>The programming cases split text into words at spaces, punctuation and existing case changes, so "userAccountID", "user account id" and "user-account-id" all convert cleanly into each other. Each line is converted separately, which makes it easy to rename a whole list of variables at once.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I change text from uppercase to lowercase?',
      <<<'EOT_TF'
Paste the text and click “lower case”. To keep capital letters at the start of sentences, choose “Sentence case” instead.
EOT_TF,
    ],
    [
      'What words are not capitalised in title case?',
      <<<'EOT_TF'
Short articles, conjunctions and prepositions such as a, an, the, and, but, or, of, in, on, at, to and for, unless they are the first or last word of the title.
EOT_TF,
    ],
    [
      'What is the difference between Title Case and Capitalize Each Word?',
      <<<'EOT_TF'
Title Case keeps small words like “of” and “the” in lower case. Capitalize Each Word capitalises every word.
EOT_TF,
    ],
    [
      'How do I fix text typed in caps lock?',
      'Paste it and choose Sentence case. Then capitalise any names by hand.',
    ],
    [
      'Is my text stored?',
      'No. Conversion happens in your browser and nothing is sent anywhere.',
    ],
  ],
];
