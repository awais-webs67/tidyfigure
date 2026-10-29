<?php
// Unit Converter: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Unit Converter',
  'category' => 'convert',
  'order' => 1,
  'icon' => 'ruler',
  'popular' => true,
  'keywords' => 'convert km to miles kg to lbs celsius to fahrenheit cm to inches liters gallons',
  'aka' => ['measurement converter', 'metric converter', 'conversion calculator'], // other names people search for
  'short' => 'Length, weight, temperature, volume, area, speed, time and data in one place.',
  'title' => 'Unit Converter: km to Miles, kg to lb, °C to °F & More',
  'description' => <<<'EOT_TF'
Convert length, weight, temperature, volume, area, speed, time and data units instantly. km to miles, kg to lbs, Celsius to Fahrenheit, cm to inches and more.
EOT_TF,
  'related' => ['color-converter', 'percentage-calculator', 'bmi-calculator'],
  'answer' => <<<'EOT_TF'
Pick a category, type a value and choose the units. Every conversion uses the <strong>exact international definitions</strong>, such as 1 inch = 2.54 cm, 1 pound = 0.45359237 kg and 1 mile = 1.609344 km, and you also see your value in every other unit at once.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>Most-used conversions</h2>
<div class="scroll"><table class="tbl">
<thead><tr><th>From</th><th>To</th><th>Multiply by</th></tr></thead>
<tbody>
<tr><td>Kilometres</td><td>Miles</td><td class="n">0.621371</td></tr>
<tr><td>Miles</td><td>Kilometres</td><td class="n">1.609344</td></tr>
<tr><td>Kilograms</td><td>Pounds</td><td class="n">2.204623</td></tr>
<tr><td>Pounds</td><td>Kilograms</td><td class="n">0.453592</td></tr>
<tr><td>Centimetres</td><td>Inches</td><td class="n">0.393701</td></tr>
<tr><td>Inches</td><td>Centimetres</td><td class="n">2.54</td></tr>
<tr><td>Metres</td><td>Feet</td><td class="n">3.280840</td></tr>
<tr><td>Litres</td><td>US gallons</td><td class="n">0.264172</td></tr>
<tr><td>Square metres</td><td>Square feet</td><td class="n">10.763910</td></tr>
<tr><td>km/h</td><td>mph</td><td class="n">0.621371</td></tr>
</tbody></table></div>

<h2>Temperature</h2>
<p>Temperature scales have different starting points as well as different step sizes, so you can't just multiply:</p>
<div class="formula">°F = °C × 9/5 + 32        °C = (°F − 32) × 5/9
K  = °C + 273.15

0 °C = 32 °F (water freezes)     100 °C = 212 °F (water boils)
37 °C = 98.6 °F (body temperature)   −40 °C = −40 °F</div>
<p>Quick estimate: double the Celsius and add 30. 20 °C → about 70 °F (exactly 68).</p>

<h2>US and UK measures differ</h2>
<p>A US gallon is 3.785 litres, but a UK (imperial) gallon is 4.546 litres, about 20% bigger. Pints differ the same way: a US pint is 473 ml, a UK pint 568 ml. US recipe cups are 236.6 ml. The converter lists both where they differ.</p>

<h2>Data: 1000 or 1024?</h2>
<p>Storage makers use decimal units: 1 GB = 1,000,000,000 bytes. Many operating systems count in binary units of 1024, which is why a "1 TB" drive shows as about 931 GB on Windows. The binary units have their own names (KiB, MiB, GiB) and the converter includes both.</p>

<h2>Metric and imperial at a glance</h2>
<p>The metric system builds every unit from powers of ten: 10 millimetres make a centimetre, 100 centimetres a metre, 1,000 metres a kilometre. Imperial and US customary units grew out of everyday measures, so the steps are irregular: 12 inches in a foot, 3 feet in a yard, 1,760 yards in a mile, 16 ounces in a pound and 14 pounds in a stone. Since 1959 all of them have been defined exactly in metric terms, which is why these conversions are precise rather than approximate.</p>
<p>Most of the world uses metric for everything. The United States uses customary units day to day, and the UK mixes both: miles and pints alongside kilograms and litres.</p>

<h2>Other handy facts</h2>
<ul>
<li>1 stone = 14 pounds = 6.35 kg, used for body weight in the UK and Ireland.</li>
<li>1 hectare = 10,000 m² ≈ 2.47 acres. A football pitch is about 0.7 ha.</li>
<li>1 knot = 1 nautical mile per hour = 1.852 km/h, used at sea and in aviation.</li>
<li>A year in the converter is 365.25 days, the average including leap years.</li>
</ul>
EOT_TF,
  'faqs' => [
    [
      'How do I convert km to miles?',
      'Multiply kilometres by 0.621371. For example, 10 km is about 6.21 miles.',
    ],
    [
      'How do I convert kg to pounds?',
      'Multiply kilograms by 2.20462. For example, 70 kg is about 154.3 lb.',
    ],
    [
      'How do I convert Celsius to Fahrenheit?',
      'Multiply by 9/5 and add 32. For example, 25 °C × 1.8 + 32 = 77 °F.',
    ],
    [
      'How many centimetres are in an inch?',
      'Exactly 2.54 centimetres. That is the international definition of the inch.',
    ],
    [
      'Why does my 1 TB drive show less space?',
      <<<'EOT_TF'
Drive makers use 1 TB = 1,000,000,000,000 bytes, but Windows counts in units of 1024, so it shows about 931 GB (GiB).
EOT_TF,
    ],
  ],
];
