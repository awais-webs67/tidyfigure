<?php
// Giveaway Maker: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Giveaway Maker',
  'updated' => '2026-10-30', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'share',
  'order' => 2,
  'popular' => true,
  'scripts' => ['share.js'],
  'css' => ['share.css'], // extra stylesheets in assets/
  'icon' => 'gift',
  'keywords' => 'giveaway maker create online giveaway free giveaway generator giveaway page with countdown random winner instagram giveaway entry form contest maker sweepstakes',
  'aka' => ['Online giveaway creator', 'Contest maker', 'Giveaway page', 'Lucky draw online'], // other names people search for
  'short' => 'Host a giveaway with a countdown, an entry form and a fair random winner, shared with one link.',
  'title' => 'Giveaway Maker: Online Giveaway With Countdown & Winner',
  'description' => <<<'EOT_TF'
Create an online giveaway page in minutes: prize, countdown, your own entry form and a fair random winner drawn automatically. Free, no sign-up, shared by link.
EOT_TF,
  'related' => ['giveaway-picker', 'how-well-do-you-know-me', 'spin-the-wheel'],
  'answer' => <<<'EOT_TF'
Write the prize, add a picture, set when the giveaway ends and choose what to ask people (name, phone, email, Instagram…). Press <strong>Create giveaway</strong> and share the link. Visitors see a <strong>live countdown</strong> and enter with a form. When time runs out, <strong>winners are drawn at random automatically</strong>, or you draw them yourself with your secret code.
EOT_TF,
  'article' => <<<'EOT_TF'
<h2>How to run a giveaway</h2>
<ol>
<li>Write a title and the prize, and add a picture of it.</li>
<li>Choose when the giveaway ends and how many winners there will be.</li>
<li>Pick what to ask people who enter: phone or WhatsApp, email, Instagram or TikTok username, city, or your own questions.</li>
<li>Optionally list the steps to enter, like “Follow us on Instagram”, with a link for each.</li>
<li>Press <strong>Create giveaway</strong>, then share the link in your posts, stories, bio and groups.</li>
</ol>

<h2>Fair, random winners</h2>
<p>When the countdown reaches zero, the winners are drawn on our server with a secure random number generator, so every entry has exactly the same chance. The winners’ names appear on the giveaway page with their username or contact partly hidden, and you see their full details on your private page. If a winner doesn’t reply, press <strong>Draw again</strong>: earlier winners are left out. You can also choose to draw the winners yourself, or end a giveaway early.</p>

<h2>Only people with the link</h2>
<p>Your giveaway isn’t listed on our site or in search engines, so only people you share the link with can see it. One entry per person: the same email, phone number or username can’t enter twice.</p>

<h2>Your entries, privately</h2>
<p>Your secret code opens your private page with every entry, the winners and a CSV download for Excel or Google Sheets. There’s no account, so keep the code safe. Entries are deleted 30 days after the giveaway ends.</p>

<h2>Running a fair giveaway</h2>
<ul>
<li>Say clearly what the prize is, who can enter (for example, your country only) and how you’ll contact the winner.</li>
<li>Follow the rules of the platform you promote it on. Instagram, for example, asks that giveaways say they aren’t sponsored by Instagram.</li>
<li>Announce the winner publicly by sharing the giveaway page after it ends.</li>
</ul>
EOT_TF,
  'faqs' => [
    [
      'Is the giveaway maker free?',
      <<<'EOT_TF'
Yes. Making a giveaway, entering and drawing winners are all free, with no sign-up.
EOT_TF,
    ],
    [
      'How is the winner picked?',
      <<<'EOT_TF'
At random on the server when the countdown ends (or when you press Draw), using a secure random number generator. Every entry has the same chance.
EOT_TF,
    ],
    [
      'Can people enter more than once?',
      <<<'EOT_TF'
No. The same email, phone number or username can only enter once.
EOT_TF,
    ],
    [
      'Who sees the entrants’ phone numbers and emails?',
      <<<'EOT_TF'
Only you, on your private page. The public page shows winners’ names with their contact details partly hidden.
EOT_TF,
    ],
    [
      'Can I pick a new winner if someone doesn’t reply?',
      <<<'EOT_TF'
Yes. Press Draw again on your private page. People who already won are left out of the new draw.
EOT_TF,
    ],
  ],
];
