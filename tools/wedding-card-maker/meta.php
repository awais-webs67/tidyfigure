<?php
// Wedding Card Maker: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Wedding Card Maker',
  'updated' => '2026-10-30', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'share',
  'order' => 3,
  'popular' => true,
  'scripts' => ['share.js', 'wedding-card.js'],
  'css' => ['share.css'], // extra stylesheets in assets/
  'icon' => 'gem',
  'keywords' => 'wedding card maker online free wedding invitation card maker shadi card online e invite digital wedding invitation whatsapp urdu wedding card mehndi baraat walima card rsvp',
  'aka' => ['Wedding invitation maker', 'Shadi card maker', 'Online wedding invitation', 'E-invite'], // other names people search for
  'short' => 'Design a beautiful wedding card in English or Urdu, download it, and send an online invitation with RSVP.',
  'title' => 'Wedding Card Maker: Online Invitation, Urdu & English',
  'description' => <<<'EOT_TF'
Make a beautiful wedding card in English or Urdu for Mehndi, Baraat, Nikah and Walima. Download it, or send an online invitation with countdown, map and RSVP.
EOT_TF,
  'related' => ['birthday-card-maker', 'how-well-do-you-know-me', 'giveaway-maker'],
  'answer' => <<<'EOT_TF'
Pick a design, write the couple’s names and add each event (Mehndi, Baraat, Nikah, Walima…) with its date, time and venue. Your card appears live: <strong>download it as a picture or PDF</strong> for WhatsApp and printing, or press <strong>Create online invitation</strong> to get a link with an opening envelope, a countdown, directions to each venue and an <strong>RSVP form</strong>.
EOT_TF,
  'article' => <<<'EOT_TF'
<h2>How to make your wedding card</h2>
<ol>
<li>Choose one of six designs: Royal maroon, Emerald, Midnight navy, Mehndi, Blush or Ivory.</li>
<li>Choose English or Urdu, and whether to start with Bismillah.</li>
<li>Write the groom’s and bride’s names, their parents’ names if you like, and a short message.</li>
<li>Add each function with its date, time, venue and address. Paste a Google Maps link so guests can find it.</li>
<li>Download the card as a picture (for WhatsApp) or a PDF (for printing).</li>
</ol>

<h2>An online invitation guests will love</h2>
<p>Press <strong>Create online invitation</strong> and you get one link to send to everyone. Guests open an envelope that unfolds to show your card, then see a countdown to the big day, every event with <strong>directions</strong> and an <strong>add to calendar</strong> button, and a form to tell you whether they’re coming and with how many guests.</p>

<h2>See who’s coming</h2>
<p>Your secret code opens your private page with every RSVP: who’s coming, how many guests, which events and their messages, with a total head count for the caterer and a CSV download. If plans change, edit the invitation and everyone with the link sees the update. There’s no account, so keep the code safe.</p>

<h2>Wording ideas</h2>
<ul>
<li><strong>Classic:</strong> “Together with their families, request the pleasure of your company at the wedding of…”</li>
<li><strong>Family invites:</strong> write the parents’ names in “Invited by”, for example “Mr & Mrs Ahmed Khan”.</li>
<li><strong>Short message:</strong> “Your presence and prayers will make our day complete.”</li>
</ul>
EOT_TF,
  'faqs' => [
    [
      'Is the wedding card maker free?',
      <<<'EOT_TF'
Yes. Designing, downloading and sending the online invitation are all free, with no sign-up and no watermark on the card.
EOT_TF,
    ],
    [
      'Can I make the card in Urdu?',
      <<<'EOT_TF'
Yes. Choose Urdu and the card is written in beautiful Nastaliq script, right to left. You can type the names in Urdu or English.
EOT_TF,
    ],
    [
      'How do guests RSVP?',
      <<<'EOT_TF'
Send the online invitation link. Guests choose whether they’re coming, how many people and which events, and you see every reply on your private page.
EOT_TF,
    ],
    [
      'Can I print the card?',
      <<<'EOT_TF'
Yes. Download the PDF or the high-resolution picture (1080 × 1620 pixels) and print it at any print shop.
EOT_TF,
    ],
    [
      'How long does the online invitation stay up?',
      <<<'EOT_TF'
Until 30 days after the last event. Then it’s deleted automatically with the RSVPs.
EOT_TF,
    ],
  ],
];
