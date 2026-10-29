<?php
// Pizza Size Calculator: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Pizza Size Calculator',
  'updated' => '2026-10-22', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'calc',
  'order' => 1,
  'icon' => 'pizza',
  'short' => 'Is one large pizza better than two mediums? Compare total pizza and price per inch.',
  'title' => 'Pizza Size Calculator: Is One Large Better Than Two Mediums?',
  'description' => <<<'EOT_TF'
Compare pizza deals by real area and price per square inch. Find out if one large pizza beats two mediums, in inches or centimetres. Free, instant.
EOT_TF,
  'related' => ['unit-price-calculator', 'group-expense-splitter', 'recipe-scaler'],
  'answer' => <<<'EOT_TF'
One 18-inch pizza has more food than two 12-inch pizzas: about <strong>254 square inches against 226</strong>. Pizza area grows with the square of the diameter, so a slightly bigger pizza holds a lot more. Enter the deals you're choosing between to see which gives the most pizza for your money.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>Why a bigger pizza is usually the better deal</h2>
<p>A pizza is a circle, and the area of a circle depends on the <em>square</em> of its radius. Going from a 12-inch to a 16-inch pizza sounds like a 33% upgrade, but the area grows by 78%. Pizzerias usually raise the price far less than that, which is why the largest size tends to be the cheapest per bite.</p>
<p>The trap is that menus list diameters, and our brains compare diameters in a straight line. Two 12-inch pizzas feel like "24 inches of pizza" and easily beat one 18-inch in our heads. In reality the single large pizza wins.</p>

<h2>The formula</h2>
<div class="formula">Area of one pizza   = π × (diameter ÷ 2)²
Total area          = area × number of pizzas
Price per 100 sq in = price ÷ total area × 100</div>
<p>In centimetres the calculator shows the price per 100 cm² instead. The winner is the same in either unit.</p>

<h2>Worked example</h2>
<p>A shop offers one 18-inch pizza for 21 or two 12-inch pizzas for 24.</p>
<ul>
<li>18-inch: π × 9² = <strong>254.5 sq in</strong>, so 21 ÷ 254.5 × 100 = <strong>8.25 per 100 sq in</strong></li>
<li>Two 12-inch: 2 × π × 6² = <strong>226.2 sq in</strong>, so 24 ÷ 226.2 × 100 = <strong>10.61 per 100 sq in</strong></li>
</ul>
<p>The large pizza gives 12.5% more food and costs 29% less per square inch.</p>

<h2>Quick reference: pizza areas</h2>
<div class="scroll"><table class="tbl">
<thead><tr><th>Diameter</th><th class="n">Area</th><th class="n">Same as this many 10″ pizzas</th></tr></thead>
<tbody>
<tr><td>8 inch (20 cm)</td><td class="n">50 sq in</td><td class="n">0.64</td></tr>
<tr><td>10 inch (25 cm)</td><td class="n">79 sq in</td><td class="n">1.00</td></tr>
<tr><td>12 inch (30 cm)</td><td class="n">113 sq in</td><td class="n">1.44</td></tr>
<tr><td>14 inch (35 cm)</td><td class="n">154 sq in</td><td class="n">1.96</td></tr>
<tr><td>16 inch (40 cm)</td><td class="n">201 sq in</td><td class="n">2.56</td></tr>
<tr><td>18 inch (45 cm)</td><td class="n">254 sq in</td><td class="n">3.24</td></tr>
</tbody></table></div>

<h2>When two smaller pizzas still make sense</h2>
<ul>
<li><strong>Different toppings.</strong> If half the group wants vegetarian, two pizzas can be worth paying a little more.</li>
<li><strong>Crust lovers.</strong> Smaller pizzas have more crust per bite, because the edge is a bigger share of the total.</li>
<li><strong>Leftovers and delivery.</strong> Two boxes are easier to share between households.</li>
</ul>
<p>Use the calculator to see exactly how much extra you pay for those choices, then decide if it's worth it.</p>
EOT_TF,
  'faqs' => [
    [
      'Is one 18-inch pizza bigger than two 12-inch pizzas?',
      <<<'EOT_TF'
Yes. One 18-inch pizza is about 254 square inches. Two 12-inch pizzas add up to about 226 square inches, so the single large pizza has roughly 12.5% more food.
EOT_TF,
    ],
    [
      'How many 8-inch pizzas equal one 16-inch pizza?',
      <<<'EOT_TF'
Four. Doubling the diameter multiplies the area by four, so a 16-inch pizza has the same area as four 8-inch pizzas.
EOT_TF,
    ],
    [
      'How do I work out the price per square inch of a pizza?',
      <<<'EOT_TF'
Divide the diameter by 2, square it and multiply by 3.1416 to get the area. Then divide the price by that area. The calculator multiplies by 100 so the result is easier to read.
EOT_TF,
    ],
    [
      'Does the crust count in the area?',
      <<<'EOT_TF'
Yes, the calculator uses the full diameter including the crust, which is how pizzerias measure their sizes. If you only care about the topped part, enter the diameter minus about one inch.
EOT_TF,
    ],
    [
      'Can I compare rectangular pizzas?',
      <<<'EOT_TF'
For a rectangular pizza, multiply length by width to get its area, then enter the diameter of a round pizza with the same area: diameter = 2 × √(area ÷ 3.1416).
EOT_TF,
    ],
  ],
];
