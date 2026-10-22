<?php
// Character Counter: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Character Counter',
  'category' => 'text',
  'order' => 2,
  'icon' => 'letter-text',
  'keywords' => 'count characters letters limit twitter sms meta description title length',
  'short' => 'Count characters and check limits for X, SMS, meta descriptions and more.',
  'title' => 'Character Counter: Count Characters With & Without Spaces',
  'description' => <<<'EOT_TF'
Count characters with and without spaces, words and lines. Check your text against limits for X (Twitter), SMS, Instagram, SEO titles and meta descriptions.
EOT_TF,
  'related' => ['word-counter', 'case-converter', 'fancy-text-generator'],
  'answer' => <<<'EOT_TF'
Paste your text to count its characters instantly, <strong>with and without spaces</strong>. The bars show how much room you have left for common limits: <strong>280</strong> for an X post, <strong>160</strong> for an SMS or meta description, and <strong>60</strong> for a search result title. Emoji and accented letters count as one character each.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>What counts as a character?</h2>
<p>Every letter, number, space, punctuation mark and line break is a character. This counter counts characters the way you see them: an emoji like 🚀, a flag, or a letter with an accent such as "é" counts as one, even though computers sometimes store them as two or more pieces. That's how most social networks and text fields count, too.</p>
<p>"Without spaces" removes spaces, tabs and line breaks. Some essay and application forms set limits this way, so check which one your form uses.</p>

<h2>Common character limits</h2>
<div class="scroll"><table class="tbl">
<thead><tr><th>Where</th><th class="n">Limit</th><th>Notes</th></tr></thead>
<tbody>
<tr><td>X (Twitter) post</td><td class="n">280</td><td>Longer for paid accounts</td></tr>
<tr><td>SMS text message</td><td class="n">160</td><td>Only 70 if it contains emoji or non-Latin letters</td></tr>
<tr><td>Google title tag</td><td class="n">≈ 60</td><td>Longer titles are cut off with "…"</td></tr>
<tr><td>Meta description</td><td class="n">≈ 160</td><td>Shown under your page in search results</td></tr>
<tr><td>YouTube video title</td><td class="n">100</td><td>About 70 show in search</td></tr>
<tr><td>Instagram caption</td><td class="n">2,200</td><td>Only the first 125 or so show before "more"</td></tr>
<tr><td>LinkedIn post</td><td class="n">3,000</td><td>About 210 show before "see more"</td></tr>
</tbody></table></div>
<p>Networks occasionally change their limits, but these have been stable for years.</p>

<h2>Why SMS messages split</h2>
<p>A standard SMS holds 160 characters from a basic character set (the GSM alphabet: English letters, digits and common symbols). If your message includes a single emoji or a letter outside that set, the phone switches to a different encoding that holds only 70 characters. Long messages are sent in parts of 153 (or 67) characters, and your carrier may charge for each part. The counter shows how many parts your text needs.</p>

<h2>Writing for limits</h2>
<ul>
<li><strong>Put the important words first.</strong> Titles and previews are cut from the end.</li>
<li><strong>Cut filler:</strong> "in order to" → "to", "at this point in time" → "now".</li>
<li><strong>Use numerals:</strong> "3" instead of "three".</li>
<li><strong>Check after editing:</strong> the counter updates as you type, so you can trim until the bar turns green.</li>
</ul>
EOT_TF,
  'faqs' => [
    [
      'Do spaces count as characters?',
      <<<'EOT_TF'
Yes, in most places. Social networks, SMS and SEO tags all count spaces. Some forms count characters without spaces, which this tool also shows.
EOT_TF,
    ],
    [
      'How many characters is an emoji?',
      <<<'EOT_TF'
Visually one, and this counter counts it as one. Some systems store emoji as two characters, and an emoji also switches an SMS to the 70-character limit.
EOT_TF,
    ],
    [
      'What is the character limit for a meta description?',
      <<<'EOT_TF'
Google shows roughly 155–160 characters on desktop before cutting it off. Aim for 120–155 characters.
EOT_TF,
    ],
    [
      'How long can an SEO title be?',
      <<<'EOT_TF'
Google shows about 60 characters (more precisely, about 600 pixels). Keep titles under 60 characters so they are not cut off.
EOT_TF,
    ],
    [
      'Is my text saved?',
      'No. Counting happens in your browser, and your text is never uploaded.',
    ],
  ],
];
