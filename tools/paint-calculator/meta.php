<?php
// Paint Calculator: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Paint Calculator',
  'category' => 'home',
  'order' => 1,
  'icon' => 'paint-roller',
  'popular' => true,
  'appCategory' => 'LifestyleApplication',
  'keywords' => 'paint calculator how much paint do i need room walls litres gallons coverage ceiling coats',
  'short' => 'How much paint you need for a room, in litres or gallons, and which tins to buy.',
  'title' => 'Paint Calculator: How Much Paint Do I Need for a Room?',
  'description' => <<<'EOT_TF'
Work out how much paint you need for your walls and ceiling from the room size, doors, windows and number of coats. In litres or gallons, with tins to buy.
EOT_TF,
  'related' => ['tile-calculator', 'concrete-calculator', 'furniture-fit-calculator'],
  'answer' => <<<'EOT_TF'
Paint needed = <strong>wall area × coats ÷ coverage</strong>. A 4 × 3.5 m room with 2.5 m walls has 37.5 m² of wall; minus one door and two windows that's 32.6 m². Two coats at 10 m² per litre need 6.5 litres, or about <strong>7.2 litres</strong> with 10% extra: a 5 L and a 2.5 L tin.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>The paint formula</h2>
<div class="formula">Wall area   = 2 × (length + width) × height
Paint area  = wall area − doors − windows
Paint       = paint area × coats ÷ coverage per litre (or gallon)

Example: 2 × (4 + 3.5) × 2.5 = 37.5 m²
37.5 − 1.9 (door) − 3.0 (2 windows) = 32.6 m²
32.6 × 2 coats ÷ 10 m²/L = 6.52 L → 7.2 L with 10% extra</div>
<p>The calculator uses a standard door of about 1.9 m² (21 sq ft) and a window of 1.5 m² (15 sq ft). For a big patio door or bay window, count it as two.</p>

<h2>How many coats?</h2>
<ul>
<li><strong>Two coats</strong> is the standard for walls: it gives an even colour and hides roller marks.</li>
<li><strong>One coat</strong> can be enough when repainting the same or a very similar colour with a good-quality paint.</li>
<li><strong>Three coats</strong>, or a primer first, for big colour changes such as dark to light, bright reds and yellows (which cover poorly), or bare plaster.</li>
</ul>
<p>New plaster soaks up paint. Seal it first with a "mist coat" of watered-down emulsion (often 10–20% water, check the tin) or a plaster primer.</p>

<h2>Coverage per litre and gallon</h2>
<div class="scroll"><table class="tbl">
<thead><tr><th>Surface / paint</th><th class="n">Per litre</th><th class="n">Per US gallon</th></tr></thead>
<tbody>
<tr><td>Emulsion on smooth, painted walls</td><td class="n">12–14 m²</td><td class="n">400 sq ft</td></tr>
<tr><td>Average walls (the default)</td><td class="n">10 m²</td><td class="n">350–375 sq ft</td></tr>
<tr><td>Rough or textured walls, new plaster</td><td class="n">6–8 m²</td><td class="n">250–300 sq ft</td></tr>
<tr><td>Masonry paint on brick or render</td><td class="n">4–8 m²</td><td class="n">150–300 sq ft</td></tr>
</tbody></table></div>
<p>Always check the tin: coverage varies by brand and finish.</p>

<h2>Tins to buy</h2>
<p>In metric countries, paint usually comes in 1 L, 2.5 L and 5 L tins; the calculator suggests a combination that covers what you need with the least waste. In the US, paint is sold in gallons (3.79 L) and quarts (a quarter gallon). Buying all your paint at once (from the same batch) avoids slight colour differences between tins. Keep a little left over for touch-ups.</p>

<h2>Tips for a good finish</h2>
<ul>
<li>Fill cracks and holes, sand lightly and wipe the walls before you start.</li>
<li>Cut in (paint the edges with a brush) first, then roll the main area while the edges are still wet.</li>
<li>Roll in a W pattern and finish with light, straight strokes in one direction.</li>
<li>Let the first coat dry fully (usually 2–4 hours for water-based emulsion) before the second.</li>
<li>Ceilings first, then walls, then woodwork (skirting boards, door frames).</li>
</ul>
<p>Doing the floor as well? The <a href="/tile-calculator">tile calculator</a> works out how many tiles to buy.</p>
EOT_TF,
  'faqs' => [
    [
      'How much paint do I need for a room?',
      <<<'EOT_TF'
Multiply the wall area (minus doors and windows) by the number of coats and divide by the coverage on the tin. A typical 4 × 3.5 m bedroom needs about 6.5–7.5 litres for two coats.
EOT_TF,
    ],
    [
      'How many square metres does a litre of paint cover?',
      'About 10–14 m² per coat on smooth walls. Rough or new surfaces need more paint.',
    ],
    [
      'How much paint for a 12 × 12 ft room?',
      <<<'EOT_TF'
With 8 ft walls, the wall area is 384 sq ft, about 330 sq ft after a door and two windows. Two coats at 375 sq ft per gallon need about 1.8 gallons, so buy 2 gallons.
EOT_TF,
    ],
    [
      'Do I need two coats of paint?',
      'Usually yes, for even colour. One coat can work when repainting the same colour with good paint.',
    ],
    [
      'Should I buy extra paint?',
      'Adding about 10% covers spills, absorbent patches and touch-ups later.',
    ],
  ],
];
