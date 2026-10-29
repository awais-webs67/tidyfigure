<?php
// Tip Calculator: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Tip Calculator',
  'updated' => '2026-10-22', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'money',
  'order' => 23,
  'icon' => 'hand-coins',
  'appCategory' => 'FinanceApplication',
  'keywords' => 'tip calculator split the bill gratuity how much to tip restaurant percentage per person',
  'short' => 'Work out the tip and split the bill between friends, with rounding.',
  'title' => 'Tip Calculator: Work Out the Tip & Split the Bill',
  'description' => <<<'EOT_TF'
Calculate the tip on a restaurant bill at any percentage, split the total between any number of people, tip before tax and round each share up. Free.
EOT_TF,
  'related' => ['group-expense-splitter', 'percentage-calculator', 'discount-calculator'],
  'answer' => <<<'EOT_TF'
Tip = <strong>bill × tip percentage</strong>. An 18% tip on an 84.50 bill is 15.21, making 99.71 in total, or 33.24 each for three people. A quick way to do 20% in your head: move the decimal point one place left (8.45) and double it (16.90).
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>How to calculate a tip</h2>
<div class="formula">Tip       = bill × tip % ÷ 100
Total     = bill + tip
Per person = total ÷ number of people

84.50 × 18% = 15.21 → total 99.71 → 33.24 each (3 people)</div>

<h2>Quick tips in your head</h2>
<ul>
<li><strong>10%:</strong> move the decimal point one place left. 84.50 → 8.45.</li>
<li><strong>20%:</strong> work out 10% and double it. 8.45 × 2 = 16.90.</li>
<li><strong>15%:</strong> 10% plus half of it. 8.45 + 4.23 = 12.68.</li>
<li><strong>25%:</strong> divide by four. 84.50 ÷ 4 = 21.13.</li>
</ul>

<h2>How much to tip around the world</h2>
<p>Tipping customs vary a lot between countries and can change, so treat these as typical restaurant norms and check locally:</p>
<div class="scroll"><table class="tbl">
<thead><tr><th>Country or region</th><th>Restaurants</th></tr></thead>
<tbody>
<tr><td>United States</td><td>15–20%, expected; 20% or more for great service</td></tr>
<tr><td>Canada</td><td>15–20%</td></tr>
<tr><td>United Kingdom</td><td>10–12.5%; check whether a service charge is already on the bill</td></tr>
<tr><td>Most of Europe</td><td>Round up or 5–10%; service is often included</td></tr>
<tr><td>Middle East</td><td>10–15% if service isn't included</td></tr>
<tr><td>India, Pakistan</td><td>About 10% if there's no service charge</td></tr>
<tr><td>Australia, New Zealand</td><td>Optional, around 10% for good service</td></tr>
<tr><td>Japan, South Korea</td><td>Not expected; it can even cause confusion</td></tr>
</tbody></table></div>
<p>Always look for a <strong>service charge</strong> on the bill first. If one is included, an extra tip is usually not needed.</p>

<h2>Tip before or after tax?</h2>
<p>Strictly, a tip is a reward for service, so many people tip on the amount <strong>before tax</strong>. In practice, plenty of people tip on the total because it's easier, and the difference is small. Enter the tax amount if you'd like to tip on the pre-tax amount.</p>

<h2>Splitting the bill fairly</h2>
<p>Rounding each person's share up to a whole number makes paying with cash or a payment app easier, and the small extra goes to the tip. In the example, three shares of 33.24 round up to 34 each, so the group pays 102, a tip of 17.50 (20.7%). If people ordered very different amounts, use the <a href="/group-expense-splitter">group expense splitter</a> so each person pays for what they had.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I calculate a 20% tip?',
      <<<'EOT_TF'
Multiply the bill by 0.2, or find 10% by moving the decimal point one place left and double it. On 84.50, the tip is 16.90.
EOT_TF,
    ],
    [
      'How much should I tip at a restaurant?',
      <<<'EOT_TF'
It depends on the country. In the US 15–20% is standard; in the UK 10–12.5%; in much of Europe rounding up is enough; in Japan tipping isn’t expected.
EOT_TF,
    ],
    [
      'Should I tip on the total before or after tax?',
      <<<'EOT_TF'
Traditionally before tax, but many people tip on the total. Enter the tax amount to tip on the pre-tax amount.
EOT_TF,
    ],
    [
      'How do I split the bill with a tip?',
      <<<'EOT_TF'
Add the tip to the bill and divide by the number of people. The calculator does this and can round each share up.
EOT_TF,
    ],
    [
      'Do I tip if there is a service charge?',
      'Usually not. A service charge is already a tip added to the bill.',
    ],
  ],
];
