<?php
// Tile Calculator: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Tile Calculator',
  'category' => 'home',
  'order' => 2,
  'icon' => 'grid-3x3',
  'appCategory' => 'LifestyleApplication',
  'keywords' => <<<'EOT_TF'
tile calculator how many tiles do i need floor tiles wall tiles boxes square metres square feet bathroom kitchen
EOT_TF,
  'short' => 'How many floor or wall tiles and boxes to buy, with extra for cuts.',
  'title' => 'Tile Calculator: How Many Tiles & Boxes Do I Need?',
  'description' => <<<'EOT_TF'
Work out how many floor or wall tiles you need from the area and tile size, with extra for cuts and breakage, plus the number of boxes and cost. Metric or feet.
EOT_TF,
  'related' => ['paint-calculator', 'concrete-calculator', 'unit-converter'],
  'answer' => <<<'EOT_TF'
Tiles needed = <strong>area ÷ area of one tile</strong>, plus 10% for cuts and breakage. A 3.6 × 2.4 m floor is 8.64 m²; 30 × 30 cm tiles cover 0.09 m² each, so you need 96 tiles, or <strong>106 with 10% extra</strong>. At 11 tiles a box, that's 10 boxes.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>The tile formula</h2>
<div class="formula">Area        = length × width (minus anything you won't tile)
Tile area   = tile length × tile width
Tiles       = area ÷ tile area × (1 + extra %)
Boxes       = tiles ÷ tiles per box, rounded up

Example: 3.6 × 2.4 = 8.64 m²
30 × 30 cm = 0.09 m² per tile
8.64 ÷ 0.09 = 96 tiles → + 10% = 105.6 → 106 tiles → 10 boxes of 11</div>
<p>Measure in the same units throughout. In imperial, tile sizes are in inches and the area in square feet: a 12 × 12 inch tile covers exactly 1 sq ft.</p>

<h2>How much extra to buy</h2>
<div class="scroll"><table class="tbl">
<thead><tr><th>Layout</th><th class="n">Extra</th></tr></thead>
<tbody>
<tr><td>Square room, straight layout, small tiles</td><td class="n">5–10%</td></tr>
<tr><td>Most rooms (some cuts around doors, pipes, toilet)</td><td class="n">10%</td></tr>
<tr><td>Diagonal, herringbone or chevron patterns</td><td class="n">15%</td></tr>
<tr><td>Large tiles, natural stone, many corners</td><td class="n">15–20%</td></tr>
</tbody></table></div>
<p>The extra covers tiles you cut (offcuts often can't be reused), breakages, and a few spares for future repairs. Tile colours vary slightly between production batches, so finding a matching tile years later is hard. Keep a handful.</p>

<h2>Measuring awkward rooms</h2>
<ul>
<li><strong>L-shaped rooms:</strong> split them into two rectangles, work out each area and add them, or enter the full rectangle and put the missing corner in "area to leave out".</li>
<li><strong>Bathrooms:</strong> for walls, measure each wall separately (width × tiling height) and add them, then subtract the bath, shower tray, window and door.</li>
<li><strong>Fixed units:</strong> you don't need to tile under kitchen cabinets or a fitted bath, so leave those areas out.</li>
</ul>

<h2>Grout gaps</h2>
<p>Grout joints (usually 2–5 mm) mean slightly fewer tiles cover the same area, so ignoring them, as this calculator does, gives you a small safety margin. For very small tiles like mosaics, where gaps make up a bigger share, the difference is larger.</p>

<h2>Tiling tips</h2>
<ul>
<li>Start from the centre of the room or the most visible wall, so cut tiles end up at the edges.</li>
<li>Do a dry layout first to see where the cuts fall, and avoid thin slivers under 5 cm.</li>
<li>Open boxes and mix tiles from several boxes as you go, so slight shade differences blend in.</li>
<li>Check the box for coverage (m² or sq ft per box), which is a useful cross-check for this calculator.</li>
</ul>
<p>Painting the walls too? Use the <a href="/paint-calculator">paint calculator</a>.</p>
EOT_TF,
  'faqs' => [
    [
      'How many tiles do I need?',
      <<<'EOT_TF'
Divide the area by the area of one tile, then add 10% for cuts and breakage. For 8.64 m² with 30 × 30 cm tiles, that is 96 tiles, or 106 with extra.
EOT_TF,
    ],
    [
      'How many 12 × 12 tiles do I need for 100 square feet?',
      'Each covers 1 sq ft, so 100 tiles, plus 10% extra: 110 tiles.',
    ],
    [
      'How much extra tile should I buy?',
      <<<'EOT_TF'
About 10% for most rooms, 15% for diagonal or herringbone layouts, and up to 20% for complex rooms or large tiles.
EOT_TF,
    ],
    [
      'How many tiles are in a box?',
      <<<'EOT_TF'
It depends on the tile size and brand. Check the box, which also shows the area it covers, and enter the number above.
EOT_TF,
    ],
    [
      'Do I need to allow for grout lines?',
      'Not usually. Ignoring grout gaps gives a small extra margin.',
    ],
  ],
];
