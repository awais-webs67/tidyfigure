<?php
return [
    'name' => 'Giveaway Picker',
    'updated' => '2026-11-15',
    'category' => 'social',
    'order' => 3,
    'icon' => 'gift',
    'popular' => true,
    'keywords' => 'giveaway picker, random comment picker, instagram giveaway winner, contest name drawer, raffle picker online',
    'short' => 'Pick fair random giveaway winners from comments, with tag and duplicate rules.',
    'title' => 'Giveaway Picker – Random Winner From Comments',
    'description' => 'Draw fair random contest winners from pasted comments or entrant lists with duplicate filtering, keyword requirements and backup winner slots.',
    'related' => ['spin-the-wheel', 'random-number-generator', 'remove-duplicate-lines'],
    'answer' => 'Copy the comments or entries from your post, paste them in, set your rules (one entry per person, tag at least one friend, include a hashtag) and press <strong>Pick winner</strong>. Winners are drawn with a secure random generator from the entries that qualify, and you can copy a timestamped result to share for transparency.',
    'article' => <<<'EOT_TF'
<h2>How to run a fair giveaway</h2>
<ol>
<li><strong>Collect the entries.</strong> Copy comments from Instagram, Facebook, YouTube or TikTok (on desktop, select the comments and copy), or paste any list of names, emails or ticket numbers.</li>
<li><strong>Set the rules you announced.</strong> One entry per person, a minimum number of tagged friends, or a required word or hashtag.</li>
<li><strong>Pick the winner(s)</strong>, plus back-ups in case a winner doesn't reply.</li>
<li><strong>Share the result.</strong> Copy the result text, or screen-record the draw, and post it with the winner announcement.</li>
</ol>

<h2>How entries are read</h2>
<p>Each line is one entry. If a line looks like <em>name: comment</em>, the part before the colon is treated as the person. Otherwise the first @handle or word is used. @mentions in the comment are counted for the "tag friends" rule, and the same person is only counted once when duplicates are removed.</p>

<h2>Why it's fair</h2>
<p>The list of qualifying entries is shuffled with your browser's cryptographically secure random generator (a Fisher–Yates shuffle), so every eligible entry has exactly the same chance. The rolling names you see are just for fun; the result is decided by the shuffle.</p>

<h2>Giveaway rules to remember</h2>
<ul>
<li>Publish clear terms: who can enter, how, the closing date, the prize, and how winners are chosen and contacted.</li>
<li>Follow each platform's promotion rules; for example, Instagram requires you to state that the promotion isn't sponsored or endorsed by Instagram.</li>
<li>Some countries have laws on prize draws and require entry to be free. Check local rules for bigger prizes.</li>
<li>Pick back-up winners in case the first winner doesn't respond within your stated time.</li>
</ul>

<h2>Private by design</h2>
<p>The entries you paste stay in your browser and aren't uploaded or stored.</p>

<h2>Auditable Duplicate &amp; Rule Filtering</h2>
<p>Pasting raw comment exports straight from a spreadsheet or post often mixes duplicate entries and stray mentions. Applying keyword filtering and single-entry deduplication before drawing ensures every eligible participant holds equal probability, while backup draws cover unresponsive winners without restarting.</p>

<h2>Exporting &amp; Publishing Proof of a Fair Draw</h2>
<p>Recording a short screen capture while filtering duplicates, verifying keyword matches and clicking pick gives entrants transparent confidence that winners were selected cleanly without manual cherry-picking.</p>
EOT_TF,
    'faqs' => [
        ['How do I pick a random winner from Instagram comments?', 'Copy the comments, paste them here, set your rules and press Pick winner.'],
        ['Can I make sure each person only enters once?', 'Yes. Keep “One entry per person” ticked to remove duplicates.'],
        ['Can I require entrants to tag friends?', 'Yes. Choose the minimum number of @mentions an entry must include.'],
        ['Is the giveaway picker random?', 'Yes. Eligible entries are shuffled with a cryptographically secure random generator.'],
        ['Can I pick more than one winner?', 'Yes. Set the number of winners and back-up winners before drawing.'],
    ],
    'aka' => ['Comment Winner Picker', 'Random Contest Drawer'],
];
