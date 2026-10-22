<?php
// Unit Price Calculator: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Unit Price Calculator',
  'category' => 'calc',
  'order' => 2,
  'icon' => 'tag',
  'short' => 'Which pack is really cheaper? Compare price per 100 g, per litre or per item.',
  'title' => 'Unit Price Calculator: Which Pack Size Is Really Cheaper?',
  'description' => <<<'EOT_TF'
Compare grocery prices per 100 g, kg, oz, litre or item, including multipacks. See which pack is cheapest and how much you save. Free, no sign-up.
EOT_TF,
  'related' => ['pizza-size-calculator', 'group-expense-splitter', 'road-trip-cost-splitter'],
  'answer' => <<<'EOT_TF'
To find the cheaper pack, divide each price by its total size to get the <strong>unit price</strong> (for example, price per 100 g). The lowest unit price wins. Bigger packs are often cheaper per unit, but not always: shops regularly price "family size" packs higher per gram than the regular size.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>How to compare unit prices</h2>
<p>Shelf prices tell you what a pack costs, not what the food inside costs. The unit price fixes that by putting every product on the same scale: price per 100 grams, per litre or per item. Once everything is on one scale, the cheapest option is simply the smallest number.</p>
<p>Many countries require shops to print a unit price on the shelf label, but labels often use different units for neighbouring products (per kg on one, per 100 g on the next), leave out multipacks, or don't cover online orders. This calculator converts everything for you, including ounces and pounds.</p>

<h2>The formula</h2>
<div class="formula">Total size  = size of one pack × number of packs
Unit price  = price ÷ total size
Saving (%)  = (1 − cheaper unit price ÷ dearer unit price) × 100</div>

<h2>Worked example</h2>
<p>A supermarket sells the same cereal three ways:</p>
<ul>
<li>Regular box, 400 g for 2.99: 2.99 ÷ 400 × 100 = <strong>0.75 per 100 g</strong></li>
<li>Family box, 1 kg for 7.99: 7.99 ÷ 1000 × 100 = <strong>0.80 per 100 g</strong></li>
<li>Multipack, 3 × 400 g for 8.49: 8.49 ÷ 1200 × 100 = <strong>0.71 per 100 g</strong></li>
</ul>
<p>The family box looks like the bulk deal, yet it is the most expensive per gram. The multipack is cheapest, and the regular box beats the family box too.</p>

<h2>Units the calculator understands</h2>
<ul>
<li><strong>Weight:</strong> grams, kilograms, ounces (1 oz = 28.35 g) and pounds (1 lb = 453.6 g)</li>
<li><strong>Volume:</strong> millilitres, litres, US fluid ounces (29.57 ml) and US gallons (3.785 L)</li>
<li><strong>Count:</strong> items or sheets, for nappies, eggs, toilet paper, tablets and the like</li>
<li><strong>Length:</strong> metres and feet, for rolls of foil, cling film or tape</li>
</ul>
<p>Weight and volume can't be compared directly unless you know the product's density, so the calculator compares like with like and tells you when something is left out.</p>

<h2>Tips for shopping by unit price</h2>
<ul>
<li><strong>Check the "per sheet" price on toilet paper and kitchen rolls.</strong> Roll counts vary wildly ("12 = 24 rolls") but sheet counts are printed on the pack.</li>
<li><strong>Only buy bulk you will use.</strong> A cheaper unit price is no saving if half the pack goes off.</li>
<li><strong>Compare offers, not just sizes.</strong> "3 for 2" deals change the unit price; enter the deal as 3 packs at the price of 2.</li>
<li><strong>Watch for shrinkflation.</strong> When a pack gets smaller at the same price, the unit price shows the real increase.</li>
</ul>
EOT_TF,
  'faqs' => [
    [
      'How do you calculate unit price?',
      <<<'EOT_TF'
Divide the price by the quantity. For a 750 g pack costing 4.50, the unit price is 4.50 ÷ 750 = 0.006 per gram, or 0.60 per 100 g.
EOT_TF,
    ],
    [
      'Is buying in bulk always cheaper?',
      <<<'EOT_TF'
No. Larger packs are often cheaper per unit, but supermarkets sometimes price big packs higher per gram than smaller ones, especially when the small size is on promotion. Always compare unit prices.
EOT_TF,
    ],
    [
      'How do I compare a multipack with a single pack?',
      <<<'EOT_TF'
Enter the number of packs and the size of each one. A 6 × 330 ml multipack is 1,980 ml in total, and the calculator divides the price by that total.
EOT_TF,
    ],
    [
      'Can I compare products in ounces with products in grams?',
      <<<'EOT_TF'
Yes. The calculator converts ounces, pounds, grams and kilograms to the same base before comparing, and shows the result per 100 g and per kg.
EOT_TF,
    ],
    [
      'Why can’t I compare litres with kilograms?',
      <<<'EOT_TF'
A litre of one product doesn’t weigh the same as a litre of another. Without the density, a volume price and a weight price can’t be compared fairly, so the calculator keeps them separate.
EOT_TF,
    ],
  ],
];
