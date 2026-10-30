<?php
// How Well Do You Know Me? Quiz Maker: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'How Well Do You Know Me? Quiz Maker',
  'updated' => '2026-10-30', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'share',
  'order' => 1,
  'popular' => true,
  'scripts' => ['share.js'],
  'css' => ['share.css'], // extra stylesheets in assets/
  'icon' => 'heart-handshake',
  'keywords' => 'how well do you know me quiz maker friendship quiz best friend quiz create quiz about yourself buddy quiz friends test quiz link whatsapp',
  'aka' => ['Friendship quiz', 'Best friend quiz', 'BFF test', 'Friend dare quiz'], // other names people search for
  'short' => 'Make a quiz about yourself, share the link, and see which friend knows you best.',
  'title' => 'How Well Do You Know Me? Make a Friendship Quiz Free',
  'description' => <<<'EOT_TF'
Make a “How well do you know me?” quiz in a minute: answer fun questions about yourself, share the link and see your friends’ scores on a scoreboard.
EOT_TF,
  'related' => ['giveaway-maker', 'wedding-card-maker', 'birthday-card-maker'],
  'answer' => <<<'EOT_TF'
Write your name, then answer questions about yourself (favourite food, dream car, pet or no pet…), or write your own. Press <strong>Create my quiz</strong> and send the link to your friends on WhatsApp, Instagram or anywhere. They answer, get a <strong>score and a friendship rating</strong>, and land on a <strong>scoreboard</strong>, so you see who knows you best.
EOT_TF,
  'article' => <<<'EOT_TF'
<h2>How to make your friendship quiz</h2>
<ol>
<li>Write your name and pick a colour.</li>
<li>Answer at least 5 questions about yourself. Tap your answer and the next question appears. Press <strong>Skip</strong> for a different question, or <strong>Write my own question</strong> to ask anything you like.</li>
<li>Press <strong>Create my quiz</strong>. You get a link to share and a <strong>secret code</strong>.</li>
<li>Send the link in your WhatsApp status, Instagram story or group chats.</li>
</ol>

<h2>What your friends see</h2>
<p>Friends write their name and answer one question at a time. After each answer they see straight away whether they were right. At the end they get their score, a rating from “Total stranger” to “Soulmate level”, and their place on the scoreboard. They can then make their own quiz, so the fun keeps going.</p>

<h2>See everyone’s answers</h2>
<p>Your secret code opens your private page, where you see each friend’s score and exactly what they answered for every question. You can remove an entry, edit your questions or delete the quiz. There’s no account, so keep the code safe: a screenshot is fine. On the phone you made the quiz on, it’s also remembered for you.</p>

<h2>Ideas for great questions</h2>
<ul>
<li>Mix easy questions (favourite colour) with tricky ones (what you do when you’re angry), so scores spread out.</li>
<li>Write a question only your closest friends would know, like the name of your first school or your secret talent.</li>
<li>Ten questions is the sweet spot: long enough to separate best friends from everyone else, short enough to finish.</li>
</ul>
EOT_TF,
  'faqs' => [
    [
      'Is the friendship quiz free?',
      <<<'EOT_TF'
Yes. Making and playing quizzes is free, with no sign-up for you or your friends.
EOT_TF,
    ],
    [
      'Can my friends see my answers?',
      <<<'EOT_TF'
Not before they play. Answers stay on the server, so friends can’t peek. After playing, each friend sees which questions they got right.
EOT_TF,
    ],
    [
      'How do I see who played?',
      <<<'EOT_TF'
Open your private page with the secret code you got when you made the quiz. It shows everyone’s score and their answer to every question.
EOT_TF,
    ],
    [
      'Can I change my quiz after sharing it?',
      <<<'EOT_TF'
Yes. Open your private page and press Edit to change questions or answers. The link stays the same.
EOT_TF,
    ],
    [
      'How long does my quiz stay online?',
      <<<'EOT_TF'
Six months. After that it’s deleted automatically, together with the scores.
EOT_TF,
    ],
  ],
];
