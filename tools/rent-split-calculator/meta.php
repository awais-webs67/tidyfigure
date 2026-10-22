<?php
// Fair Rent Split Calculator: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Fair Rent Split Calculator',
  'category' => 'life',
  'order' => 3,
  'icon' => 'house',
  'short' => 'Split rent by bedroom size, private bathrooms and couples sharing a room.',
  'title' => 'Fair Rent Split Calculator: Split Rent by Room Size',
  'description' => <<<'EOT_TF'
Split rent fairly between roommates by bedroom size, private bathrooms and couples sharing a room. Shared space split equally. Free, instant, no sign-up.
EOT_TF,
  'related' => ['group-expense-splitter', 'road-trip-cost-splitter', 'decision-matrix'],
  'answer' => <<<'EOT_TF'
The fairest common way to split rent is in two parts: split the <strong>shared space</strong> (kitchen, living room, hallway) equally per person, and split the <strong>rest by bedroom size</strong>, giving extra weight to rooms with a private bathroom. Couples sharing a room pay for one room but two shares of the common space.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>Why an even split often feels unfair</h2>
<p>Splitting rent evenly works when bedrooms are the same. Most homes aren't like that. One person gets the big room with an en-suite, another gets the box room next to the front door. If everyone pays the same, the person in the small room is subsidising the person in the big one, and that resentment tends to grow over a year-long lease.</p>
<p>Splitting purely by square footage goes too far the other way. Everyone uses the kitchen, the living room and the hallway equally, so the person in the small room ends up paying almost nothing for space they use as much as anyone.</p>

<h2>How this calculator splits rent</h2>
<p>It uses a hybrid method that many roommates settle on:</p>
<ol>
<li><strong>Shared-space share.</strong> A percentage of the rent (40% by default) pays for common areas. It is divided equally between every person living in the home, so a couple pays two shares.</li>
<li><strong>Private-space share.</strong> The rest is divided between bedrooms in proportion to their size.</li>
<li><strong>Bathroom bonus.</strong> A room with its own bathroom counts as bigger (15% by default) when splitting the private share.</li>
</ol>
<div class="formula">Shared part of a room  = rent × shared % × people in room ÷ all people
Room weight            = room size × (1 + bathroom bonus, if it has one)
Private part of a room = rent × (1 − shared %) × room weight ÷ all weights
Room pays              = shared part + private part</div>

<h2>Choosing the shared-space percentage</h2>
<p>A good rule of thumb is to compare the floor area of the shared spaces with the total floor area of the home. If the bedrooms add up to about 60% of the home, use 40% for shared space. Use a higher number if the living areas are large or everyone works from the kitchen table, and a lower number if people mostly stay in their rooms.</p>

<h2>Worked example</h2>
<p>Rent is 2,400. Ana has a 16 m² room with her own bathroom, Ben and Kai share a 13 m² room, and Chloe has a 9 m² room. Shared space is 40% and the bathroom bonus is 15%.</p>
<ul>
<li>Shared part: 960 ÷ 4 people = 240 each. Ana 240, Ben &amp; Kai 480, Chloe 240.</li>
<li>Weights: Ana 16 × 1.15 = 18.4, Ben &amp; Kai 13, Chloe 9, total 40.4.</li>
<li>Private part (1,440): Ana 655.84, Ben &amp; Kai 463.37, Chloe 320.79.</li>
<li>Totals: Ana <strong>895.84</strong>, Ben &amp; Kai <strong>943.37</strong> (471.68 each), Chloe <strong>560.79</strong>.</li>
</ul>
<p>An even split would be 600 per person. Ana pays more for the big room and bathroom; the couple each pay less because they share a room.</p>

<h2>Other things roommates adjust for</h2>
<ul>
<li><strong>Balconies, walk-in wardrobes or better light:</strong> add a few square metres to that room's size.</li>
<li><strong>Parking spaces:</strong> take the parking cost out of the rent first and charge it to whoever uses it.</li>
<li><strong>Bills:</strong> utilities are usually split evenly per person, not by room size. Use the group expense splitter for those.</li>
</ul>
EOT_TF,
  'faqs' => [
    [
      'What is the fairest way to split rent with roommates?',
      <<<'EOT_TF'
Split the shared areas equally per person, and split the rest by bedroom size. This avoids people in small rooms subsidising large rooms, while still charging everyone for the kitchen and living room they all use.
EOT_TF,
    ],
    [
      'How much more should someone with a private bathroom pay?',
      <<<'EOT_TF'
Many households count an en-suite bathroom as 10–20% extra room size. This calculator uses 15% by default, and you can change it.
EOT_TF,
    ],
    [
      'How should a couple sharing a room split rent?',
      <<<'EOT_TF'
A couple uses one bedroom, so they pay one room’s private share. They use the shared spaces twice as much as a single person, so they pay two shares of the common space. The calculator does this when you set people to 2.
EOT_TF,
    ],
    [
      'Do I use square metres or square feet?',
      'Either. Only the ratio between rooms matters, so use the same unit for every room.',
    ],
    [
      'What percentage of rent is for shared space?',
      <<<'EOT_TF'
Usually 30–50%. Work it out by comparing the area of common rooms with the total floor area, or agree on a number together. The default is 40%.
EOT_TF,
    ],
  ],
];
