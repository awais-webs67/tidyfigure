<?php
// Text Compare: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Text Compare',
  'updated' => '2026-10-22', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'text',
  'order' => 21,
  'icon' => 'file-diff',
  'popular' => true,
  'keywords' => <<<'EOT_TF'
text compare diff checker compare two texts find differences online diff word compare document changes
EOT_TF,
  'short' => 'Compare two texts and see every added and removed word, highlighted.',
  'title' => 'Text Compare: Find the Differences Between Two Texts',
  'description' => <<<'EOT_TF'
Paste two versions of a text to highlight exactly what changed: added and removed words, lines or characters. Ignore case or spaces. Free diff checker.
EOT_TF,
  'related' => ['word-counter', 'remove-duplicate-lines', 'readability-checker'],
  'answer' => <<<'EOT_TF'
Paste the original text on the left and the new version on the right. Every change is highlighted: <ins>added words in green</ins> and <del>removed words struck through in red</del>, with a count of words added and removed and a similarity score. Compare by words, whole lines or single characters.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>How to compare two texts</h2>
<ol>
<li>Paste the <strong>original</strong> in the first box and the <strong>changed</strong> version in the second.</li>
<li>Choose how to compare:
<ul>
<li><strong>Words</strong> (best for documents, essays and emails) shows exactly which words changed inside a sentence.</li>
<li><strong>Whole lines</strong> (best for code, lists and data) marks each changed line, like a programmer's diff.</li>
<li><strong>Characters</strong> (best for IDs, codes and short strings) spots a single changed letter or digit.</li>
</ul></li>
<li>Tick <strong>Ignore extra spaces</strong> or <strong>Ignore upper/lower case</strong> if those differences don't matter to you.</li>
</ol>
<p>The result updates as you type, so you can also use it to check edits as you make them.</p>

<h2>How the comparison works</h2>
<p>The tool finds the <strong>longest common subsequence</strong>: the largest set of words that appear in both texts in the same order. Everything else is either a removal (in the original only) or an addition (in the new version only). This is the same idea used by tools like <code>diff</code> and Git. To stay fast with long documents, it compares lines first and then looks at the words inside the lines that changed.</p>
<p>The similarity score is the share of words that stayed the same: unchanged words ÷ (unchanged words + the larger of added or removed).</p>

<h2>Uses</h2>
<ul>
<li><strong>Editing:</strong> see what an editor, colleague or AI tool changed in your writing.</li>
<li><strong>Contracts and policies:</strong> spot changes between two versions of an agreement before you sign.</li>
<li><strong>Students:</strong> compare a draft with your final version, or check how closely your paraphrase follows a source.</li>
<li><strong>Developers:</strong> compare config files, API responses or code snippets line by line.</li>
<li><strong>Data:</strong> find the difference between two lists, such as email lists or product codes.</li>
</ul>

<h2>Tips</h2>
<ul>
<li>If every line shows as changed, the texts probably use different line endings or extra spaces. Tick <strong>Ignore extra spaces</strong>.</li>
<li>For copied PDFs where lines break in different places, use <strong>Words</strong> mode.</li>
<li>To compare two lists regardless of order, sort them first, or remove repeats with <a href="/remove-duplicate-lines">remove duplicate lines</a>.</li>
<li>The comparison runs in your browser and nothing is uploaded, so it's safe for confidential documents.</li>
</ul>
EOT_TF,
  'faqs' => [
    [
      'How do I compare two texts for differences?',
      <<<'EOT_TF'
Paste the original in the first box and the new version in the second. Added words are highlighted green and removed words red.
EOT_TF,
    ],
    [
      'Can I compare two documents?',
      'Yes. Copy the text from each document (Word, PDF or Google Docs) and paste it into the two boxes.',
    ],
    [
      'What is the difference between word and line mode?',
      <<<'EOT_TF'
Word mode shows changed words within sentences. Line mode marks whole changed lines, which suits code and lists.
EOT_TF,
    ],
    [
      'Can it ignore case and spacing?',
      'Yes. Tick Ignore upper/lower case or Ignore extra spaces to hide those differences.',
    ],
    [
      'Is my text uploaded?',
      'No. The comparison runs in your browser, so your text never leaves your device.',
    ],
  ],
];
