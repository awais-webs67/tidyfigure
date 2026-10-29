<?php
// Wish Maker: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Wish Maker',
  'updated' => '2026-10-22', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'social',
  'order' => 5,
  'icon' => 'party-popper',
  'popular' => true,
  'keywords' => 'birthday wish link personalised greeting eid mubarak wishes link diwali wishes whatsapp greeting',
  'short' => 'Make a personalised greeting page with confetti and share the link.',
  'title' => 'Wish Maker: Personalised Greeting Link With Confetti',
  'description' => <<<'EOT_TF'
Create a personalised wish for birthdays, Eid, Diwali, Christmas, New Year and more: their name, your message and confetti, shared as a link on WhatsApp. Free.
EOT_TF,
  'related' => ['birthday-card-maker', 'fancy-text-generator', 'meme-generator'],
  'answer' => <<<'EOT_TF'
Choose the occasion, type their name, yours and a message, and you get a <strong>personal link</strong>. When they open it, a full-screen greeting appears with their name and falling confetti. Share it on WhatsApp or anywhere you can paste a link. Works for <strong>birthdays, anniversaries, Eid, Ramadan, Diwali, Christmas, New Year</strong> and more.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>How it works</h2>
<ol>
<li>Pick an occasion. A suggested message appears; tap "Suggest another message" for more, or write your own.</li>
<li>Add their name and yours.</li>
<li>Press <strong>Preview</strong> to see exactly what they'll see.</li>
<li>Copy the link or share it straight to WhatsApp.</li>
</ol>
<p>When they open the link, the greeting fills the screen with their name, your message and an animation, plus a button so they can make one back.</p>

<h2>Occasions</h2>
<p>Birthday, Anniversary, Eid Mubarak, Ramadan Mubarak, Happy Diwali, Merry Christmas, Happy New Year, Congratulations, Get Well Soon, Thank You, Mother's Day and Father's Day, each with its own colours and message ideas.</p>

<h2>Tips for a message they'll remember</h2>
<ul>
<li><strong>Be specific:</strong> mention a shared memory or something you admire about them.</li>
<li><strong>Keep it short:</strong> two or three sentences read best on a phone.</li>
<li><strong>Write in your own language:</strong> any language and emoji work.</li>
<li><strong>Time it right:</strong> send it just after midnight on a birthday, or on the morning of a festival.</li>
</ul>

<h2>Where is my message stored?</h2>
<p>Nowhere on a server. The occasion, names and message are encoded inside the link itself, and the greeting is built in the recipient's browser when they open it. That means it can't be edited after sending (just make a new link), and anyone who has the link can read it, so keep very personal messages for private chats.</p>

<h2>Prefer an image?</h2>
<p>For a card you can post on Instagram or print, use the Birthday Card Maker, which creates a downloadable image with their name, age and photo.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I make a personalised birthday wish link?',
      'Choose Birthday, type their name, your name and message, then copy the link or share it on WhatsApp.',
    ],
    [
      'Can I make an Eid Mubarak wish?',
      'Yes. Choose Eid Mubarak or Ramadan Mubarak from the occasion list.',
    ],
    [
      'Is my message saved on your server?',
      'No. It’s stored inside the link itself and shown in the recipient’s browser.',
    ],
    ['Can I write the message in Urdu, Hindi or Arabic?', 'Yes. Any language and emoji work.'],
    ['Can I edit the wish after sending?', 'No. Make a new link with the changes and send that instead.'],
  ],
];
