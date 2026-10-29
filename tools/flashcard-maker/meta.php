<?php
// Flashcard Maker: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Flashcard Maker',
  'updated' => '2026-10-22', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'study',
  'order' => 4,
  'icon' => 'layers',
  'appCategory' => 'EducationalApplication',
  'keywords' => <<<'EOT_TF'
flashcard maker online flashcards study cards quizlet alternative revision vocabulary memorize printable flash cards
EOT_TF,
  'short' => 'Paste terms and answers, then study them as flip cards that repeat the ones you miss.',
  'title' => 'Flashcard Maker: Make & Study Online Flashcards, Free',
  'description' => <<<'EOT_TF'
Make flashcards in seconds by pasting term – answer pairs. Study with flip cards that repeat the ones you miss, share decks with a link or print them. Free.
EOT_TF,
  'related' => ['grade-calculator', 'gpa-calculator', 'typing-speed-test'],
  'answer' => <<<'EOT_TF'
Type or paste one card per line with the term and answer separated by a dash, colon or tab, such as <strong>Mitochondria - Produces the cell's energy</strong>, then press <strong>Study</strong>. Tap a card to flip it and mark it <strong>Got it</strong> or <strong>Again</strong>; missed cards come back a few cards later until you know the whole deck.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>How to make flashcards</h2>
<ol>
<li>Write one card per line: the question or term, a separator, then the answer. These separators all work:
<div class="formula">Photosynthesis - Plants turning light into food
Paris: capital of France
le chien	the dog          (tab, e.g. pasted from a spreadsheet)</div></li>
<li>Press <strong>Study these cards</strong>. Tick <strong>Show the answer side first</strong> to practise the other way round, which is useful for vocabulary.</li>
<li>Try to answer before you flip. Be honest: press <strong>Again</strong> if you hesitated.</li>
</ol>
<p>Your deck is saved in this browser automatically. To use it on another device or send it to a classmate, press <strong>Copy share link</strong>: the whole deck is stored inside the link itself, so nothing is uploaded.</p>

<h2>Why flashcards work</h2>
<p>Flashcards use two of the best-researched study techniques:</p>
<ul>
<li><strong>Active recall:</strong> trying to remember an answer strengthens memory far more than re-reading notes. The effort of retrieving is what makes it stick.</li>
<li><strong>Spaced repetition:</strong> reviewing material over several days, with growing gaps, beats cramming it all in one session. Cards you find hard need more reviews than easy ones.</li>
</ul>
<p>This tool brings missed cards back a few cards later in the same session, so you practise the hard ones most. For long-term memory, study the deck again the next day, then after three days, then a week.</p>

<h2>Writing good cards</h2>
<ul>
<li><strong>One fact per card.</strong> "Causes of World War I" is too big; split it into several cards.</li>
<li><strong>Ask a question.</strong> "What does the ribosome do?" makes you think harder than "Ribosome".</li>
<li><strong>Use your own words</strong> for answers, so you understand them rather than memorise a phrase.</li>
<li><strong>Add an example</strong> for vocabulary and formulas: "Mitosis – cell division making two identical cells (e.g. skin repair)".</li>
<li><strong>Keep answers short</strong> enough to check in a second or two.</li>
</ul>

<h2>Paper flashcards</h2>
<p>Press <strong>Print cards</strong> for a sheet with questions on the left and answers on the right. Cut along the dashed lines and fold each strip in half. Paper cards are handy for revising on the bus or for testing a friend.</p>

<h2>Ideas for decks</h2>
<ul>
<li>Language vocabulary and verb forms.</li>
<li>Science terms, formulas and units.</li>
<li>Historical dates and events.</li>
<li>Capital cities, flags and elements of the periodic table.</li>
<li>Exam definitions, quotations and key arguments.</li>
<li>Driving theory, medical terms or professional exam questions.</li>
</ul>
<p>Planning revision for exams? Work out what you need with the <a href="/grade-calculator">grade calculator</a>.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I make flashcards online?',
      <<<'EOT_TF'
Type one card per line with the term and answer separated by a dash, colon or tab, then press Study these cards.
EOT_TF,
    ],
    [
      'Can I share my flashcards?',
      <<<'EOT_TF'
Yes. Copy share link puts the whole deck in a link. Anyone who opens it gets the same cards, with nothing uploaded.
EOT_TF,
    ],
    [
      'Are my flashcards saved?',
      'Your deck is saved in this browser on this device. Use the share link to move it to another device.',
    ],
    [
      'Can I import cards from a spreadsheet?',
      <<<'EOT_TF'
Yes. Copy two columns (term and answer) from Excel or Google Sheets and paste them in; the tab between columns works as the separator.
EOT_TF,
    ],
    [
      'Can I print the flashcards?',
      'Yes. Print cards makes a sheet with questions and answers side by side to cut out and fold.',
    ],
  ],
];
