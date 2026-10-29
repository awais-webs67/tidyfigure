<?php
// Profit Margin Calculator: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Profit Margin Calculator',
  'updated' => '2026-10-22', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'money',
  'order' => 8,
  'icon' => 'chart-no-axes-combined',
  'appCategory' => 'FinanceApplication',
  'keywords' => 'profit margin calculator markup calculator gross margin selling price from cost',
  'short' => 'Margin, markup and profit from cost and price, or the price for a target margin.',
  'title' => 'Profit Margin Calculator: Margin, Markup & Selling Price',
  'description' => <<<'EOT_TF'
Calculate gross profit margin and markup from cost and selling price, or find the price that gives a target margin or markup. Explains margin vs markup. Free.
EOT_TF,
  'related' => ['vat-calculator', 'discount-calculator', 'roi-calculator'],
  'answer' => <<<'EOT_TF'
<strong>Margin</strong> is profit divided by the selling price; <strong>markup</strong> is profit divided by the cost. Something that costs 40 and sells for 65 makes 25 profit: a <strong>38.5% margin</strong> but a <strong>62.5% markup</strong>. To hit a target margin, price = cost ÷ (1 − margin), so a 35% margin on a 40 cost needs a price of 61.54.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>Formulas</h2>
<div class="formula">Profit          = price − cost
Margin (%)      = profit ÷ price × 100
Markup (%)      = profit ÷ cost × 100
Price for margin = cost ÷ (1 − margin)
Price for markup = cost × (1 + markup)</div>

<h2>Margin versus markup</h2>
<p>They describe the same profit from different starting points, and mixing them up is one of the most common pricing mistakes. If you want a 50% margin and add 50% to the cost, you only get a 33% margin.</p>
<div class="scroll"><table class="tbl">
<thead><tr><th class="n">Markup</th><th class="n">Margin</th></tr></thead>
<tbody>
<tr><td class="n">25%</td><td class="n">20%</td></tr>
<tr><td class="n">50%</td><td class="n">33.3%</td></tr>
<tr><td class="n">100%</td><td class="n">50%</td></tr>
<tr><td class="n">200%</td><td class="n">66.7%</td></tr>
</tbody></table></div>
<p>Margin can never reach 100%, but markup can be any size.</p>

<h2>What counts as cost?</h2>
<p>For <strong>gross margin</strong>, use the direct cost of the product: what you paid the supplier, or materials and production. Shipping to you and payment fees are often included too. Rent, salaries, marketing and other overheads come out of gross profit later, giving <strong>net margin</strong>.</p>

<h2>What's a good margin?</h2>
<p>It varies hugely by industry. Supermarkets often run gross margins around 25–30% and net margins of a few percent. Software and digital products can exceed 80% gross. Restaurants commonly target food costs around 28–35% of menu price (a 65–72% gross margin on food). Compare yourself with businesses like yours, and make sure your gross margin covers overheads with room to spare.</p>

<h2>Pricing with VAT or sales tax</h2>
<p>Calculate margins on prices <em>excluding</em> tax, because the tax isn't your money. Use the VAT Calculator to remove tax from a gross price first.</p>

<h2>Common pricing mistakes</h2>
<ul>
<li><strong>Confusing markup with margin:</strong> adding 30% to cost gives a 23% margin, not 30%. Use the calculator to set the price from the margin you need.</li>
<li><strong>Forgetting hidden costs:</strong> payment fees, packaging, shipping, returns and marketplace commissions all come out of your margin.</li>
<li><strong>Discounting without checking:</strong> a 20% discount on a product with a 30% margin removes two-thirds of the profit on each sale.</li>
<li><strong>Ignoring overheads:</strong> gross margin must also pay for rent, software and your time before there is any real profit.</li>
</ul>
EOT_TF,
  'faqs' => [
    [
      'How do I calculate profit margin?',
      'Subtract the cost from the selling price, divide by the selling price and multiply by 100.',
    ],
    [
      'What is the difference between margin and markup?',
      'Margin is profit as a percentage of the selling price; markup is profit as a percentage of the cost.',
    ],
    ['How do I price a product for a 40% margin?', 'Divide the cost by 0.6. A cost of 30 needs a price of 50.'],
    [
      'Is a 50% markup a 50% margin?',
      'No. A 50% markup gives a 33.3% margin. A 100% markup gives a 50% margin.',
    ],
    ['Should I include tax in margin calculations?', 'No. Use prices excluding VAT or sales tax.'],
  ],
];
