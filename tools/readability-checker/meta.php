<?php
// Readability Checker: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Readability Checker',
  'category' => 'text',
  'order' => 20,
  'icon' => 'book-open',
  'keywords' => <<<'EOT_TF'
readability checker flesch reading ease flesch kincaid grade level gunning fog smog readability score text
EOT_TF,
  'short' => 'Flesch reading ease, grade level and long sentences to fix, for any text.',
  'title' => 'Readability Checker: Flesch Score & Grade Level, Free',
  'description' => <<<'EOT_TF'
Check how easy your writing is to read: Flesch reading ease, Flesch-Kincaid grade, Gunning fog, SMOG and more, plus long sentences highlighted to fix.
EOT_TF,
  'related' => ['word-counter', 'text-compare', 'case-converter'],
  'answer' => <<<'EOT_TF'
Paste your text to get its <strong>Flesch reading ease</strong> score (0–100, higher is easier) and grade levels. For websites and general audiences, aim for a score of <strong>60 or more</strong>, about the level of an 8th–9th grader. The checker also lists sentences over 25 words, the quickest thing to fix.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>How the Flesch reading ease score works</h2>
<div class="formula">Reading ease = 206.835 − 1.015 × (words ÷ sentences) − 84.6 × (syllables ÷ words)
Grade level  = 0.39 × (words ÷ sentences) + 11.8 × (syllables ÷ words) − 15.59</div>
<p>Rudolf Flesch published the reading ease formula in 1948, and J. Peter Kincaid adapted it into a US school grade level for the US Navy in 1975. Both rely on two things: <strong>sentence length</strong> and <strong>word length</strong> (in syllables). Long sentences and long words make text harder to read.</p>

<h2>What the score means</h2>
<div class="scroll"><table class="tbl">
<thead><tr><th class="n">Score</th><th>Difficulty</th><th>Typical reader</th></tr></thead>
<tbody>
<tr><td class="n">90–100</td><td>Very easy</td><td>Age 10–11</td></tr>
<tr><td class="n">80–89</td><td>Easy</td><td>Conversational English</td></tr>
<tr><td class="n">70–79</td><td>Fairly easy</td><td>Age 12–13</td></tr>
<tr><td class="n">60–69</td><td>Plain English</td><td>Age 13–15; good target for the web</td></tr>
<tr><td class="n">50–59</td><td>Fairly difficult</td><td>Age 15–18</td></tr>
<tr><td class="n">30–49</td><td>Difficult</td><td>College</td></tr>
<tr><td class="n">0–29</td><td>Very difficult</td><td>Graduate; academic and legal text</td></tr>
</tbody></table></div>

<h2>The other indexes</h2>
<ul>
<li><strong>Gunning fog:</strong> years of education needed to understand the text on first reading, based on sentence length and the share of words with three or more syllables.</li>
<li><strong>SMOG:</strong> widely used for health information; it estimates the grade needed for full understanding. It's most reliable on 30 sentences or more.</li>
<li><strong>Coleman-Liau and Automated Readability Index:</strong> count letters instead of syllables, so they're quick for computers but less precise for short texts.</li>
</ul>
<p>The scores often disagree by a grade or two, because each uses a different formula. Look at the overall picture, not a single number. Syllables are counted by a rule-based estimate, so scores can differ slightly from other tools.</p>

<h2>How to make writing easier to read</h2>
<ol>
<li><strong>Shorten sentences.</strong> Aim for an average of 15–20 words. Split anything over 25, usually at "and", "but", "which" or a semicolon.</li>
<li><strong>Use everyday words:</strong> "use" not "utilise", "help" not "facilitate", "start" not "commence", "about" not "approximately".</li>
<li><strong>Write in the active voice:</strong> "We fixed the bug" is shorter and clearer than "The bug was fixed by us".</li>
<li><strong>One idea per sentence</strong> and one topic per paragraph.</li>
<li><strong>Use lists and headings</strong> so readers can scan.</li>
<li><strong>Cut filler:</strong> "in order to" → "to", "due to the fact that" → "because".</li>
</ol>
<p>The sample text shows the difference: on its own, the first paragraph scores about 68 (plain English) and the second scores below zero (very difficult), though they say the same thing.</p>

<h2>When a low score is fine</h2>
<p>Readability formulas measure surface features, not meaning. Technical, legal or academic writing for expert readers can score low and still be clear to them. And short words don't guarantee clarity: a text can score well and still be confusing. Use the score as a guide, and read your text aloud as a final check. Count words with the <a href="/word-counter">word counter</a>, or compare two drafts with <a href="/text-compare">text compare</a>.</p>
EOT_TF,
  'faqs' => [
    [
      'What is a good Flesch reading ease score?',
      <<<'EOT_TF'
60 or above is plain English that most adults read easily. Aim for 60–70 for websites and general audiences.
EOT_TF,
    ],
    [
      'What is the Flesch-Kincaid grade level?',
      <<<'EOT_TF'
An estimate of the US school grade needed to understand the text. Grade 8 means an average 13–14-year-old could read it.
EOT_TF,
    ],
    [
      'How do I improve my readability score?',
      <<<'EOT_TF'
Use shorter sentences and shorter, everyday words. Splitting sentences over 25 words has the biggest effect.
EOT_TF,
    ],
    [
      'Why do readability tools give different scores?',
      <<<'EOT_TF'
They use different formulas and count syllables in slightly different ways, so expect differences of a few points.
EOT_TF,
    ],
    [
      'Does readability affect SEO?',
      <<<'EOT_TF'
Not directly as a ranking factor, but clear writing keeps readers on the page and helps them find answers, which search engines value.
EOT_TF,
    ],
  ],
];
