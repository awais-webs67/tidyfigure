<?php
// Flip a Coin: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Flip a Coin',
  'category' => 'random',
  'order' => 5,
  'icon' => 'coins',
  'popular' => true,
  'keywords' => 'coin flip heads or tails coin toss',
  'short' => 'Heads or tails? A fair virtual coin toss with a running count and streaks.',
  'title' => 'Flip a Coin: Heads or Tails Coin Toss Online',
  'description' => <<<'EOT_TF'
Flip a virtual coin for heads or tails. Fair 50/50 coin toss with animation, flip 10 or 100 times at once, and track heads, tails and streaks. Free.
EOT_TF,
  'related' => ['roll-a-dice', 'spin-the-wheel', 'random-number-generator'],
  'answer' => <<<'EOT_TF'
Tap the coin or the button to flip. Each toss has an <strong>exactly 50% chance</strong> of heads and 50% of tails, decided by a secure random number. Flip 10 or 100 times at once to see how the results even out, and watch the count of heads, tails and the longest streak.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>Is a virtual coin flip fair?</h2>
<p>Yes, and in one way it's fairer than a real coin. Studies of real coin tosses have found a small bias: a flipped coin lands on the same side it started on slightly more often than half the time, about 51%. This virtual coin uses your browser's cryptographically secure random generator, so heads and tails are exactly equally likely on every flip.</p>

<h2>Each flip is independent</h2>
<p>A coin has no memory. After five heads in a row, the next flip is still 50/50. Believing tails is "due" is called the <strong>gambler's fallacy</strong>. Over many flips the share of heads moves towards 50%, but the gap in raw numbers can still grow: 520 heads and 480 tails in 1,000 flips is perfectly normal.</p>
<div class="formula">Chance of heads = 1 ÷ 2 = 50%
Chance of n heads in a row = (1 ÷ 2)ⁿ
3 in a row = 12.5%    5 in a row = 3.1%    10 in a row ≈ 0.1%</div>

<h2>Streaks happen more than you'd think</h2>
<p>In 100 flips, the longest run of the same side is usually 6 or 7. People asked to write down "random" coin flips by hand rarely include runs longer than 4, which is one way teachers can tell a real experiment from a made-up one. Try "Flip 100 times" and look at the longest streak.</p>

<h2>Ways to use a coin flip</h2>
<ul>
<li><strong>Settle a decision</strong> between two options. Bonus: if you feel disappointed by the result, you've learned which option you really wanted.</li>
<li><strong>Sports:</strong> decide who kicks off, serves first or picks ends.</li>
<li><strong>Games:</strong> who goes first, or as a replacement for a lost coin.</li>
<li><strong>Classrooms:</strong> run probability experiments with 10 or 100 flips at a time.</li>
</ul>

<h2>Heads or tails?</h2>
<p>On most real coins "heads" is the side with a portrait or national emblem, and "tails" is the other side. The name dates back centuries; British coins traditionally showed the monarch's head on the front.</p>
EOT_TF,
  'faqs' => [
    [
      'Is this coin flip really 50/50?',
      'Yes. Each flip uses a secure random number, giving heads and tails exactly equal chances.',
    ],
    [
      'What are the odds of getting heads 3 times in a row?',
      '1 in 8, or 12.5%. Each flip is 1/2, so three in a row is 1/2 × 1/2 × 1/2.',
    ],
    [
      'If I get heads 5 times, is tails more likely next?',
      'No. Every flip is independent, so the next one is still exactly 50/50.',
    ],
    [
      'Can I flip a coin many times at once?',
      'Yes. Use “Flip 10 times” or “Flip 100 times” to see the totals and the longest streak instantly.',
    ],
    [
      'Which side is heads?',
      'Heads is the side with the portrait or main emblem. Tails is the other side.',
    ],
  ],
];
