<?php
// Percentage Calculator: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Percentage Calculator',
  'updated' => '2026-10-29', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'calc',
  'order' => 1,
  'icon' => 'percent',
  'popular' => true,
  'keywords' => 'percent of a number percentage change increase decrease what percent',
  'aka' => ['percent calculator', 'calculate percentage', 'percentage finder'], // other names people search for
  'short' => 'X% of Y, what percent, percentage change, increase/decrease and reverse %.',
  'title' => 'Percentage Calculator: % of a Number, % Change & More',
  'description' => <<<'EOT_TF'
Free percentage calculator: find X% of Y, what percent one number is of another, percentage increase or decrease, and the original number. With formulas.
EOT_TF,
  'related' => ['discount-calculator', 'loan-calculator', 'unit-converter'],
  'answer' => <<<'EOT_TF'
To find a percentage of a number, <strong>divide the percentage by 100 and multiply</strong>: 15% of 240 is 0.15 × 240 = <strong>36</strong>. To find what percent one number is of another, divide and multiply by 100: 36 ÷ 240 × 100 = 15%. The five calculators below handle every common percentage question and show the working.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>The five percentage formulas</h2>
<div class="formula">1. X% of Y               = X ÷ 100 × Y
2. A is what % of B      = A ÷ B × 100
3. % change from A to B  = (B − A) ÷ A × 100
4. Y increased by X%     = Y × (1 + X ÷ 100)
   Y decreased by X%     = Y × (1 − X ÷ 100)
5. A is X% of what?      = A ÷ (X ÷ 100)</div>

<h2>Worked examples</h2>
<ul>
<li><strong>Tip:</strong> 15% of a 240 bill is 0.15 × 240 = 36.</li>
<li><strong>Test score:</strong> 42 out of 50 is 42 ÷ 50 × 100 = 84%.</li>
<li><strong>Price rise:</strong> from 80 to 100 is (100 − 80) ÷ 80 × 100 = +25%.</li>
<li><strong>Salary raise:</strong> 2,500 increased by 4% is 2,500 × 1.04 = 2,600.</li>
<li><strong>Sale price:</strong> 250 decreased by 20% is 250 × 0.8 = 200.</li>
<li><strong>Before tax:</strong> if 45 is the 30% deposit, the full price is 45 ÷ 0.3 = 150.</li>
</ul>

<h2>Common mistakes</h2>
<h3>Percentage change isn't symmetrical</h3>
<p>A price that rises from 80 to 100 goes up 25%, but falling back from 100 to 80 is a 20% drop. The change is always divided by the <em>starting</em> value, and the starting value is different each way. Likewise, a 50% loss followed by a 50% gain leaves you at 75% of where you began, not back at 100%.</p>
<h3>Percent versus percentage points</h3>
<p>If an interest rate goes from 2% to 3%, it rose by 1 <strong>percentage point</strong>, but by 50 <strong>percent</strong> (because 1 is half of 2). News reports often mix these up. Use percentage points for the difference between two percentages.</p>
<h3>Adding percentages</h3>
<p>Two discounts of 20% and 10% don't make 30% off. The second applies to the already-reduced price: 0.8 × 0.9 = 0.72, which is 28% off. The Discount Calculator handles stacked discounts.</p>

<h2>Mental maths shortcuts</h2>
<ul>
<li><strong>10%:</strong> move the decimal point one place left. 10% of 240 is 24.</li>
<li><strong>5%:</strong> half of 10%. 5% of 240 is 12.</li>
<li><strong>1%:</strong> move the decimal point two places. 1% of 240 is 2.4.</li>
<li><strong>Swap trick:</strong> X% of Y equals Y% of X. 8% of 50 is the same as 50% of 8, which is 4.</li>
</ul>
EOT_TF,
  'faqs' => [
    [
      'How do I calculate a percentage of a number?',
      'Divide the percentage by 100 and multiply by the number. For example, 20% of 150 is 0.2 × 150 = 30.',
    ],
    [
      'How do I calculate percentage increase?',
      <<<'EOT_TF'
Subtract the old value from the new value, divide by the old value, and multiply by 100. From 80 to 100 is (100 − 80) ÷ 80 × 100 = 25%.
EOT_TF,
    ],
    [
      'How do I work out what percentage one number is of another?',
      'Divide the part by the whole and multiply by 100. 36 out of 240 is 36 ÷ 240 × 100 = 15%.',
    ],
    [
      'How do I find the original number before a percentage was added?',
      <<<'EOT_TF'
Divide by (1 + the percentage ÷ 100). If a price with 20% tax is 120, the price before tax is 120 ÷ 1.2 = 100.
EOT_TF,
    ],
    [
      'What is the difference between percent and percentage points?',
      <<<'EOT_TF'
Percentage points are the simple difference between two percentages (2% to 3% is 1 point). Percent change is relative (2% to 3% is a 50% increase).
EOT_TF,
    ],
  ],
];
