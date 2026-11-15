<?php
return [
    'name' => 'Percentage Calculator',
    'updated' => '2026-11-15',
    'category' => 'calc',
    'order' => 1,
    'icon' => 'percent',
    'popular' => true,
    'keywords' => 'percentage calculator, percent change calculator, percentage increase calculator, percentage decrease, what percent of, find percentage',
    'aka' => ['Percent Calculator', 'Percent Change Calculator', 'Percentage Difference Finder'],
    'short' => 'X% of Y, what percent, percentage change, increase/decrease and reverse %.',
    'title' => 'Percentage Calculator – % of Number & % Change',
    'description' => 'Calculate X% of a number, percentage increase or decrease, what percent X is of Y, and original price before markup or tax with formulas shown.',
    'related' => ['discount-calculator', 'loan-calculator', 'unit-converter'],
    'answer' => 'To find a percentage of a number, <strong>divide the percentage by 100 and multiply</strong>: 15% of 240 is 0.15 × 240 = <strong>36</strong>. To find what percent one number is of another, divide and multiply by 100: 36 ÷ 240 × 100 = 15%. The five calculators below handle every common percentage question and show the working.',
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

<h2>Why Percentage Increases &amp; Decreases Aren’t Symmetrical</h2>
<p>A common trap in investing, pricing and grading is assuming a 20% drop cancels out a 20% gain. If a $100 stock drops 20%, it falls to $80. A 20% rebound on $80 adds only $16 (ending at $96, still 4% down). Recovering a 20% drop actually requires a <strong>25%</strong> gain (20 / 80), and recovering a 50% drop requires a full <strong>100%</strong> gain.</p>
<p>Likewise, "percentage change" measures directional growth from an old value to a new one using the starting value as denominator, whereas "percentage points" express the arithmetic difference between two percentages (such as an interest rate rising from 4% to 6%, which is a 2 percentage-point rise but a 50% relative increase).</p>
EOT_TF,
    'faqs' => [
        ['How do I calculate a percentage of a number?', 'Divide the percentage by 100 and multiply by the number. For example, 20% of 150 is 0.2 × 150 = 30.'],
        ['How do I calculate percentage increase?', 'Subtract the old value from the new value, divide by the old value, and multiply by 100. From 80 to 100 is (100 − 80) ÷ 80 × 100 = 25%.'],
        ['How do I work out what percentage one number is of another?', 'Divide the part by the whole and multiply by 100. 36 out of 240 is 36 ÷ 240 × 100 = 15%.'],
        ['How do I find the original number before a percentage was added?', 'Divide by (1 + the percentage ÷ 100). If a price with 20% tax is 120, the price before tax is 120 ÷ 1.2 = 100.'],
        ['What is the difference between percent and percentage points?', 'Percentage points are the simple difference between two percentages (2% to 3% is 1 point). Percent change is relative (2% to 3% is a 50% increase).'],
    ],
];
