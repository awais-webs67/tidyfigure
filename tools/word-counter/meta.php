<?php
// Word Counter: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Word Counter',
  'category' => 'text',
  'order' => 1,
  'icon' => 'text-cursor-input',
  'popular' => true,
  'keywords' => 'count words characters essay sentences reading time',
  'aka' => ['word count tool', 'count words online', 'essay word counter'], // other names people search for
  'short' => 'Count words, characters, sentences and reading time as you type.',
  'title' => 'Word Counter: Count Words, Characters & Reading Time',
  'description' => <<<'EOT_TF'
Free word counter. Count words, characters with and without spaces, sentences and paragraphs, plus reading time, speaking time and keyword density.
EOT_TF,
  'related' => ['character-counter', 'case-converter', 'remove-duplicate-lines'],
  'answer' => <<<'EOT_TF'
Paste or type your text and the word count updates instantly, along with <strong>characters, sentences, paragraphs, reading time and speaking time</strong>. A word is any run of letters or numbers, so "isn't" and "well-known" each count as one word, the same way Microsoft Word and Google Docs count them.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>How words are counted</h2>
<p>The counter treats any group of letters or digits as a word. Apostrophes and hyphens inside a word keep it together, so "don't", "e-mail" and "mother-in-law" are each one word. Punctuation, emoji and extra spaces aren't counted as words. This matches how most word processors count, so your total should agree with Word or Google Docs to within a word or two.</p>
<p>It works for any language that uses spaces between words, including those with accented letters, Cyrillic, Greek and Arabic script.</p>

<h2>Reading and speaking time</h2>
<div class="formula">Reading time  = words ÷ 238 words per minute
Speaking time = words ÷ 140 words per minute</div>
<p>238 words per minute is the average silent reading speed for adults reading non-fiction, from a large review of reading studies. Speaking is slower: around 130–150 words per minute for a presentation or speech. A 1,000-word article takes about 4 minutes to read and 7 minutes to say out loud.</p>

<h2>Common word counts</h2>
<div class="scroll"><table class="tbl">
<thead><tr><th>Type of writing</th><th class="n">Typical length</th></tr></thead>
<tbody>
<tr><td>Tweet or short social post</td><td class="n">20–50 words</td></tr>
<tr><td>Cover letter</td><td class="n">250–400 words</td></tr>
<tr><td>College application essay</td><td class="n">500–650 words</td></tr>
<tr><td>Blog post</td><td class="n">1,000–2,000 words</td></tr>
<tr><td>Undergraduate dissertation</td><td class="n">8,000–12,000 words</td></tr>
<tr><td>Novel</td><td class="n">70,000–100,000 words</td></tr>
</tbody></table></div>

<h2>Sentence length and readability</h2>
<p>The average sentence length tells you how easy your writing is to follow. Most style guides recommend an average of 15–20 words. Over 25, readers start to lose the thread. Mixing short and long sentences keeps writing lively.</p>

<h2>Keyword density</h2>
<p>The "most used words" list ignores common words like "the" and "and", so you can see what your text is really about. It's useful for spotting words you've repeated too often, and for checking that a web page mentions its main topic naturally. There's no magic percentage for SEO; write for readers and use the topic's words where they fit.</p>
EOT_TF,
  'faqs' => [
    [
      'How many pages is 1,000 words?',
      'About 2 pages single-spaced or 4 pages double-spaced, using a 12-point font and standard margins.',
    ],
    [
      'Does the word counter count hyphenated words as one?',
      <<<'EOT_TF'
Yes. Words joined by hyphens or apostrophes, like “well-known” or “isn’t”, count as one word, the same as in Microsoft Word.
EOT_TF,
    ],
    [
      'How long does it take to read 1,000 words?',
      <<<'EOT_TF'
About 4 minutes at an average reading speed of 238 words per minute, and about 7 minutes to read aloud.
EOT_TF,
    ],
    [
      'Is my text saved or sent anywhere?',
      'No. Everything is counted in your browser. Your text is not uploaded or stored.',
    ],
    [
      'Does it count characters with spaces?',
      <<<'EOT_TF'
Yes. You see characters with spaces and without spaces. For limits on social media and SEO titles, try the Character Counter.
EOT_TF,
    ],
  ],
];
