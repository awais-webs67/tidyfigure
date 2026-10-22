<?php
// Road Trip Cost Splitter: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Road Trip Cost Splitter',
  'category' => 'life',
  'order' => 10,
  'icon' => 'car',
  'short' => 'Split fuel fairly when people ride different distances, plus tolls and parking.',
  'title' => 'Road Trip Cost Splitter: Split Fuel by Distance Each Person Rode',
  'description' => <<<'EOT_TF'
Split car trip fuel costs fairly when passengers ride different distances. Works in km or miles, US or UK mpg, with tolls and parking. Free, instant.
EOT_TF,
  'related' => ['group-expense-splitter', 'rent-split-calculator', 'unit-price-calculator'],
  'answer' => <<<'EOT_TF'
The fairest way to split fuel on a shared car trip is <strong>by stretch of road</strong>: each part of the journey is split equally between the people in the car for that part. Someone who gets out halfway pays nothing for the second half. Tolls and parking are usually split evenly between everyone.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>Why splitting fuel evenly isn't always fair</h2>
<p>When everyone rides the whole way, dividing the fuel bill equally is fair and simple. But road trips, carpools and lifts home rarely work like that. One friend gets dropped off after an hour, another joins at a service station, and the driver goes the whole way. Splitting evenly makes the person who rode 50 km pay the same as the person who rode 400.</p>
<p>Charging each person "their distance × cost per km" doesn't work either, because the car burns the same fuel whether it carries one person or four. The cost of each stretch has to be <em>shared</em> by the people in the car for it.</p>

<h2>How the calculation works</h2>
<ol>
<li>Work out the fuel cost of the whole trip from distance, fuel economy and fuel price.</li>
<li>Divide by the distance to get the fuel cost per km or mile.</li>
<li>Cut the trip into stretches at every drop-off point.</li>
<li>Split each stretch's cost equally between everyone still in the car.</li>
<li>Split tolls and parking evenly between everyone.</li>
</ol>
<div class="formula">Fuel (metric)   = distance × L/100 km ÷ 100
Fuel (US)       = miles ÷ US mpg        (in US gallons)
Fuel (UK)       = miles ÷ UK mpg × 4.546 (in litres)
Stretch cost    = stretch length × fuel cost per km
Each rider pays = stretch cost ÷ people in the car</div>

<h2>Worked example</h2>
<p>A 420 km trip in a car using 7.5 L/100 km, with fuel at 1.80 per litre, uses 31.5 litres and costs 56.70 in fuel, or 0.135 per km. Tolls are 24. Sam drives and Priya rides the whole way, Leo gets out at 250 km and Mia at 120 km.</p>
<ul>
<li>0–120 km (4 people): 16.20 ÷ 4 = 4.05 each</li>
<li>120–250 km (3 people): 17.55 ÷ 3 = 5.85 each</li>
<li>250–420 km (2 people): 22.95 ÷ 2 = 11.475 each</li>
</ul>
<p>Fuel shares: Mia 4.05, Leo 9.90, Sam and Priya 21.38 each. Add 6.00 each for tolls, and Mia pays 10.05, Leo 15.90, and Sam and Priya 27.38.</p>

<h2>Should the driver pay?</h2>
<p>Groups handle this differently. Some split the cost equally including the driver, since everyone benefits from the trip. Others let the driver ride free to thank them for driving and for wear on their car. Tick the "driver doesn't pay" box and the driver's fuel share is shared out between passengers in proportion to how far they rode.</p>

<h2>Converting fuel economy</h2>
<ul>
<li>US mpg to L/100 km: 235.21 ÷ mpg. 30 US mpg ≈ 7.8 L/100 km.</li>
<li>UK mpg to L/100 km: 282.48 ÷ mpg. 40 UK mpg ≈ 7.1 L/100 km.</li>
<li>A UK gallon (4.546 L) is about 20% bigger than a US gallon (3.785 L), so the same car shows a higher mpg in the UK.</li>
</ul>
EOT_TF,
  'faqs' => [
    [
      'How do you split gas money fairly on a road trip?',
      <<<'EOT_TF'
Split each stretch of road between the people in the car for that stretch. If everyone rides the whole way, that is simply the total fuel cost divided by the number of people.
EOT_TF,
    ],
    [
      'How do I calculate the fuel cost of a trip?',
      <<<'EOT_TF'
In metric, multiply the distance by L/100 km, divide by 100 and multiply by the price per litre. In the US, divide miles by mpg and multiply by the price per gallon.
EOT_TF,
    ],
    [
      'Should the driver pay for gas?',
      <<<'EOT_TF'
It’s up to the group. Many split it equally including the driver; others let the driver ride free as thanks. The calculator can do either.
EOT_TF,
    ],
    [
      'What about wear and tear on the car?',
      <<<'EOT_TF'
Fuel is only part of the cost of driving. If you want to include wear, tyres and insurance, add a per-km or per-mile amount to the fuel price, or add a fixed amount to tolls & parking.
EOT_TF,
    ],
    [
      'What if someone joins partway through the trip?',
      <<<'EOT_TF'
The calculator assumes everyone starts together and people get out along the way. For a trip where people join and leave at different points, split it into legs, run each leg separately and add up each person’s shares.
EOT_TF,
    ],
  ],
];
