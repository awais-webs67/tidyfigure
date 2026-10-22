<?php
// Roll a Dice: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Roll a Dice',
  'category' => 'random',
  'order' => 6,
  'icon' => 'dice-5',
  'keywords' => 'dice roller virtual dice d20 d6 roll dice online',
  'short' => 'Roll 1–10 virtual dice: d4, d6, d8, d10, d12, d20 or d100.',
  'title' => 'Roll a Dice: Online Dice Roller for d6, d20 and More',
  'description' => <<<'EOT_TF'
Roll virtual dice online: 1 to 10 dice with 4, 6, 8, 10, 12, 20 or 100 sides. Fair, instant rolls with totals and history. Great for board games and D&D.
EOT_TF,
  'related' => ['flip-a-coin', 'spin-the-wheel', 'random-number-generator'],
  'answer' => <<<'EOT_TF'
Choose how many dice and how many sides, then press Roll (or the space bar). Each die lands on every face with <strong>exactly equal chance</strong>, and the total is added up for you. Standard six-sided dice show real pips; role-playing dice (d4 to d100) show the number.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>A dice roller for every game</h2>
<ul>
<li><strong>Board games</strong> like Monopoly, Ludo, Backgammon and Snakes and Ladders use one or two six-sided dice (2d6).</li>
<li><strong>Yahtzee</strong> uses five d6.</li>
<li><strong>Dungeons &amp; Dragons</strong> and other tabletop role-playing games use the full set: d4, d6, d8, d10, d12, d20, and d100 for percentages.</li>
<li><strong>Classrooms</strong> use dice for probability lessons, maths games and picking random groups.</li>
</ul>

<h2>What "2d6" means</h2>
<p>Dice notation is written as <em>number of dice</em> "d" <em>number of sides</em>. So 2d6 means roll two six-sided dice and add them; 1d20 means one twenty-sided die. Set the two menus to match any notation and the roller adds the total.</p>

<h2>Dice probabilities</h2>
<p>With one fair die, every face is equally likely: 1 in 6 for a d6, 1 in 20 for a d20. With two or more dice, totals are <em>not</em> equally likely, because some totals can be made in more ways.</p>
<div class="scroll"><table class="tbl">
<thead><tr><th>Total of 2d6</th><th class="n">Ways to roll it</th><th class="n">Chance</th></tr></thead>
<tbody>
<tr><td>2 or 12</td><td class="n">1</td><td class="n">2.8%</td></tr>
<tr><td>3 or 11</td><td class="n">2</td><td class="n">5.6%</td></tr>
<tr><td>4 or 10</td><td class="n">3</td><td class="n">8.3%</td></tr>
<tr><td>5 or 9</td><td class="n">4</td><td class="n">11.1%</td></tr>
<tr><td>6 or 8</td><td class="n">5</td><td class="n">13.9%</td></tr>
<tr><td>7</td><td class="n">6</td><td class="n">16.7%</td></tr>
</tbody></table></div>
<p>That's why 7 is the most common roll in games with two dice, and why the squares around 6–8 spaces from "Jail" in Monopoly get landed on so often.</p>

<h2>Are virtual dice fair?</h2>
<p>Real dice are slightly imperfect: drilled pips make some faces lighter, and cheap dice have rounded or uneven edges. These virtual dice use your browser's secure random generator, so every face has exactly the same chance. Each roll is independent, so a run of sixes doesn't make another six more or less likely.</p>

<h2>Rolling with advantage in D&amp;D</h2>
<p>In Dungeons &amp; Dragons 5th edition, "advantage" means rolling two d20s and keeping the higher; "disadvantage" means keeping the lower. Set the roller to 2 dice and d20 and read the higher or lower result. Advantage raises your average roll from 10.5 to about 13.8, and your chance of a natural 20 from 5% to 9.75%.</p>

<h2>Handy features</h2>
<ul>
<li>Press the <strong>space bar</strong> or tap the dice to roll again.</li>
<li>The <strong>history</strong> shows your last 20 rolls, so nobody can argue about what was rolled.</li>
<li>Changing the number of dice or sides rolls straight away.</li>
</ul>
EOT_TF,
  'faqs' => [
    [
      'Is this online dice roller fair?',
      <<<'EOT_TF'
Yes. Every roll uses a secure random number, so each face has exactly the same chance, and every roll is independent.
EOT_TF,
    ],
    [
      'What is the most common roll with two dice?',
      '7. It can be made 6 different ways out of 36, a 16.7% chance.',
    ],
    ['How do I roll a d20?', 'Set Sides to d20 and Number of dice to 1, then press Roll.'],
    ['Can I roll several dice at once?', 'Yes, up to 10 dice. The total is added up for you.'],
    ['Is there a keyboard shortcut?', 'Yes. Press the space bar to roll again.'],
  ],
];
