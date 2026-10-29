<?php
// Electricity Cost Calculator: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Electricity Cost Calculator',
  'updated' => '2026-10-22', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'home',
  'order' => 4,
  'icon' => 'plug',
  'popular' => true,
  'appCategory' => 'LifestyleApplication',
  'keywords' => <<<'EOT_TF'
electricity cost calculator appliance energy cost kwh calculator watts to cost running cost per hour heater ac power bill
EOT_TF,
  'short' => 'What your appliances cost to run per day, month and year, from watts and hours.',
  'title' => 'Electricity Cost Calculator: Appliance Running Costs (kWh)',
  'description' => <<<'EOT_TF'
Work out what each appliance costs to run per hour, day, month and year from its watts, hours of use and your price per kWh. Find what uses the most power.
EOT_TF,
  'related' => ['unit-converter', 'budget-planner', 'percentage-calculator'],
  'answer' => <<<'EOT_TF'
Running cost = <strong>watts × hours ÷ 1,000 × price per kWh</strong>. A 2,000 W heater used 3 hours a day uses 6 kWh; at 0.25 per kWh that's <strong>1.50 a day</strong>, about 45.60 a month. A 100 W TV on for 5 hours uses just 0.5 kWh a day, 0.13 at the same price.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>The formula</h2>
<div class="formula">kWh per day = watts × hours per day ÷ 1,000
Cost per day = kWh × price per kWh

Heater: 2,000 W × 3 h = 6,000 Wh = 6 kWh × 0.25 = 1.50 a day
        × 30.4 days = 45.60 a month · × 365 = 547.50 a year</div>
<p>A <strong>kilowatt-hour (kWh)</strong> is the unit on your electricity bill: using 1,000 watts for one hour. Your price per kWh is on your bill or tariff, and it's in whatever currency you pay in, so the results are too.</p>

<h2>Typical appliance power</h2>
<div class="scroll"><table class="tbl">
<thead><tr><th>Appliance</th><th class="n">Typical watts</th><th class="n">1 hour costs at 0.25/kWh</th></tr></thead>
<tbody>
<tr><td>Electric shower</td><td class="n">8,000–10,000</td><td class="n">2.00–2.50</td></tr>
<tr><td>Tumble dryer</td><td class="n">2,000–3,000</td><td class="n">0.50–0.75</td></tr>
<tr><td>Kettle</td><td class="n">2,000–3,000</td><td class="n">0.50–0.75 (but only runs a few minutes)</td></tr>
<tr><td>Space heater</td><td class="n">1,000–3,000</td><td class="n">0.25–0.75</td></tr>
<tr><td>Air conditioner (room unit)</td><td class="n">500–1,500</td><td class="n">0.13–0.38</td></tr>
<tr><td>Gaming PC under load</td><td class="n">300–600</td><td class="n">0.08–0.15</td></tr>
<tr><td>LED TV</td><td class="n">50–150</td><td class="n">0.01–0.04</td></tr>
<tr><td>Laptop</td><td class="n">30–70</td><td class="n">about 0.01</td></tr>
<tr><td>LED bulb</td><td class="n">5–12</td><td class="n">under 0.01</td></tr>
</tbody></table></div>
<p>Pick an appliance from the suggestions in the name box to fill in typical watts, then adjust it to your appliance's label.</p>

<h2>Appliances that switch on and off</h2>
<p>Fridges, freezers, water heaters and heaters with a thermostat don't run at full power all the time. A fridge rated at 150 W might average only 30–50 W. For these, it's more accurate to use the yearly energy from the energy label: divide the kWh per year by 8,760 (hours in a year) and multiply by 1,000 to get the average watts. For example, 300 kWh a year ÷ 8,760 × 1,000 = 34 W.</p>

<h2>Standby power</h2>
<p>Devices on standby (TVs, consoles, chargers, smart speakers) each use a little power all day. A games console using 10 W on standby 20 hours a day uses 73 kWh a year, about 18 at 0.25 per kWh. Switching off at the wall, or using smart plugs, removes this.</p>

<h2>Ways to cut your bill</h2>
<ul>
<li>Focus on the appliances with the biggest share in the table: heating, cooling, drying and hot water are usually the largest.</li>
<li>Use time-of-use tariffs if available: run washing machines, dishwashers and EV charging at cheaper off-peak times.</li>
<li>Replace old bulbs with LEDs, which use about 80–90% less energy than incandescent bulbs.</li>
<li>Air-dry clothes when you can, and run full loads in washing machines and dishwashers.</li>
<li>For heating, a heat pump or air conditioner in heating mode can deliver 3–4 kWh of heat for every 1 kWh of electricity.</li>
</ul>
<p>Use the <a href="/budget-planner">budget planner</a> to see how your energy bill fits your monthly spending.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I calculate the cost of running an appliance?',
      <<<'EOT_TF'
Multiply the watts by the hours used, divide by 1,000 to get kWh, then multiply by your price per kWh.
EOT_TF,
    ],
    [
      'How much does it cost to run a 2000W heater?',
      '2 kWh per hour. At 0.25 per kWh, that is 0.50 an hour, or 1.50 for three hours a day.',
    ],
    [
      'How many kWh does a fridge use?',
      'A modern fridge-freezer typically uses 200–400 kWh a year, which averages about 25–45 W.',
    ],
    [
      'What is a kWh?',
      <<<'EOT_TF'
A kilowatt-hour: the energy used by a 1,000-watt appliance running for one hour. It is the unit on electricity bills.
EOT_TF,
    ],
    [
      'Where do I find my electricity price?',
      'On your bill or your supplier’s tariff page, shown as a price per kWh (sometimes per unit).',
    ],
  ],
];
