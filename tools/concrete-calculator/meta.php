<?php
// Concrete Calculator: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Concrete Calculator',
  'category' => 'home',
  'order' => 3,
  'icon' => 'brick-wall',
  'appCategory' => 'LifestyleApplication',
  'keywords' => <<<'EOT_TF'
concrete calculator how much concrete slab cubic yards cubic metres bags of concrete post hole footing volume
EOT_TF,
  'short' => 'Concrete volume for a slab, footing or post holes, in m³ or yd³, and bags needed.',
  'title' => 'Concrete Calculator: Slabs, Footings & Post Holes, in Bags',
  'description' => <<<'EOT_TF'
Work out how much concrete you need for a slab, footing, column or post holes, in cubic metres or yards, and how many 20–40 kg or 40–80 lb bags to buy.
EOT_TF,
  'related' => ['tile-calculator', 'paint-calculator', 'unit-converter'],
  'answer' => <<<'EOT_TF'
Concrete volume = <strong>length × width × thickness</strong>, all in the same unit. A 3 × 3 m slab 10 cm thick needs 3 × 3 × 0.1 = <strong>0.9 m³</strong>, or about 1 m³ with 10% extra. A 10 × 10 ft slab 4 inches thick needs 33.3 cu ft, which is 1.23 cubic yards or about 56 bags of 80 lb concrete (62 with 10% extra).
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>Concrete volume formulas</h2>
<div class="formula">Slab or footing:   volume = length × width × thickness
Round column/hole: volume = π × (diameter ÷ 2)² × depth

Metric:   3 m × 3 m × 0.10 m = 0.9 m³
Imperial: 10 ft × 10 ft × (4 ÷ 12) ft = 33.3 cu ft ÷ 27 = 1.23 yd³
Post hole: π × 0.15² × 0.9 m = 0.064 m³ each</div>
<p>Always convert to one unit before multiplying: centimetres to metres (÷ 100) or inches to feet (÷ 12). There are 27 cubic feet in a cubic yard and 35.3 cubic feet in a cubic metre.</p>

<h2>Typical thicknesses</h2>
<div class="scroll"><table class="tbl">
<thead><tr><th>Job</th><th>Typical thickness</th></tr></thead>
<tbody>
<tr><td>Garden path, shed base</td><td>7.5–10 cm (3–4 in)</td></tr>
<tr><td>Patio</td><td>10 cm (4 in)</td></tr>
<tr><td>Driveway for cars</td><td>10–15 cm (4–6 in)</td></tr>
<tr><td>Garage floor, heavier vehicles</td><td>15 cm (6 in) or more</td></tr>
<tr><td>Fence post holes</td><td>About a third of the post's height deep, 3× the post width across</td></tr>
</tbody></table></div>
<p>Building codes and ground conditions vary. For foundations, structural slabs or anything load-bearing, follow your local regulations or an engineer's specification.</p>

<h2>Bags or ready-mix?</h2>
<p>Pre-mixed bags (cement, sand and gravel combined) only need water. A typical 80 lb (36 kg) bag makes about 0.6 cubic feet (0.017 m³), so you need about 45 bags per cubic yard and 59 per cubic metre. That's a lot of mixing: for anything over about 1 m³ (1.3 yd³), a ready-mix truck is usually cheaper and gives a stronger, more even pour. Many suppliers deliver part loads for smaller jobs.</p>

<h2>Why add extra?</h2>
<p>Ground is never perfectly flat, formwork bows a little, and some concrete is always lost in the mixer and barrow. Ordering 5–10% extra is standard; running short mid-pour leaves a weak joint where the old and new concrete meet.</p>

<h2>Mixing your own</h2>
<p>A common general-purpose mix is <strong>1 part cement, 2 parts sand, 3 parts gravel</strong> (by volume), with just enough water to make it workable, not runny. Too much water makes weak concrete that cracks. For footings, 1:3:6 is sometimes used; for strong slabs, 1:1.5:3.</p>

<h2>Curing</h2>
<p>Concrete gets stronger as it cures, not as it dries. Keep it damp for the first week (cover with plastic or mist with water), protect it from frost and hot sun, and wait before driving on it, usually about a week for cars and longer for heavy vehicles. It reaches most of its design strength after about 28 days.</p>
EOT_TF,
  'faqs' => [
    [
      'How much concrete do I need for a slab?',
      <<<'EOT_TF'
Multiply length × width × thickness in the same unit. A 3 × 3 m slab 10 cm thick needs 0.9 m³, plus 5–10% extra.
EOT_TF,
    ],
    [
      'How many bags of concrete are in a cubic yard?',
      'About 45 bags of 80 lb, 60 bags of 60 lb or 90 bags of 40 lb, depending on the brand’s yield.',
    ],
    [
      'How many bags for a post hole?',
      <<<'EOT_TF'
A 30 cm (12 in) wide, 90 cm (3 ft) deep hole holds about 0.064 m³ (2.3 cu ft): around four 80 lb bags.
EOT_TF,
    ],
    [
      'How do I convert cubic feet to cubic yards?',
      'Divide by 27. For example, 33.3 cubic feet ÷ 27 = 1.23 cubic yards.',
    ],
    [
      'Should I order extra concrete?',
      'Yes. Order 5–10% more to cover uneven ground, spillage and formwork movement.',
    ],
  ],
];
