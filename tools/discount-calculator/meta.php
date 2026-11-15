<?php
return [
    'name' => 'Discount Calculator',
    'updated' => '2026-11-15',
    'category' => 'calc',
    'order' => 4,
    'icon' => 'badge-percent',
    'keywords' => 'discount calculator, percent off calculator, sale price calculator, double discount, calculate savings, price after discount',
    'short' => 'Sale price after % off, stacked discounts and tax, and how much you save.',
    'title' => 'Discount Calculator – Sale Price & % Off Savings',
    'description' => 'Find exact sale price after percentage off, stacked extra discounts and sales tax or VAT. Instant savings breakdown in your browser with no sign-up.',
    'related' => ['percentage-calculator', 'unit-price-calculator', 'loan-calculator'],
    'answer' => 'To find a sale price, multiply the original price by <strong>(1 − discount ÷ 100)</strong>. 25% off 120 is 120 × 0.75 = <strong>90</strong>. Stacked discounts multiply rather than add: 25% off and then an extra 10% off is 120 × 0.75 × 0.9 = 81, a total of <strong>32.5% off</strong>, not 35%.',
    'article' => <<<'EOT_TF'
<h2>How to calculate a discount</h2>
<div class="formula">Amount saved = price × discount ÷ 100
Sale price   = price × (1 − discount ÷ 100)

120 at 25% off: saved = 30, sale price = 90</div>

<h2>Stacked discounts don't add up</h2>
<p>Shops often advertise an extra discount on top of a sale: "25% off, plus an extra 10% at checkout". The extra 10% is taken from the already-reduced price, so the total is less than 35%.</p>
<div class="formula">Total discount = 1 − (1 − d₁) × (1 − d₂)
25% then 10%   = 1 − 0.75 × 0.90 = 1 − 0.675 = 32.5%
50% then 20%   = 1 − 0.50 × 0.80 = 60%  (not 70%)</div>
<p>The order doesn't matter: 10% then 25% gives the same 32.5%.</p>

<h2>Discounts and sales tax</h2>
<p>In the United States, sales tax is added at the till, after discounts. In the UK, the EU and many other countries, shelf prices already include VAT, so leave the tax field at 0 unless your receipt adds it separately. When tax is added, it's calculated on the discounted price, so you pay less tax too.</p>

<h2>Quick discount table for 100</h2>
<div class="scroll"><table class="tbl">
<thead><tr><th>Discount</th><th class="n">You save</th><th class="n">You pay</th></tr></thead>
<tbody>
<tr><td>10% off</td><td class="n">10</td><td class="n">90</td></tr>
<tr><td>20% off</td><td class="n">20</td><td class="n">80</td></tr>
<tr><td>25% off</td><td class="n">25</td><td class="n">75</td></tr>
<tr><td>33% off</td><td class="n">33</td><td class="n">67</td></tr>
<tr><td>50% off</td><td class="n">50</td><td class="n">50</td></tr>
<tr><td>70% off</td><td class="n">70</td><td class="n">30</td></tr>
</tbody></table></div>

<h2>Shopping smarter in sales</h2>
<ul>
<li><strong>"Buy 2, get 1 free"</strong> is 33% off each item, but only if you'd buy three anyway.</li>
<li><strong>"Up to 70% off"</strong> usually means only a few items reach 70%.</li>
<li><strong>Check the original price.</strong> A discount from an inflated "was" price isn't a real saving. Price-history tools and receipts help.</li>
<li><strong>Compare unit prices</strong> for groceries: a discounted large pack can still cost more per gram than a regular small one.</li>
</ul>

<h2>Working backwards</h2>
<p>If you know the sale price and the discount, the original price is the sale price ÷ (1 − discount ÷ 100). A jacket that costs 63 after 30% off was 63 ÷ 0.7 = 90.</p>

<h2>Is it really a bargain?</h2>
<ul>
<li><strong>Check the original price:</strong> some sales compare against a price the item was rarely sold at. Price-history tools and comparison sites help.</li>
<li><strong>Compare unit prices:</strong> a bigger pack at 20% off can still cost more per item than a smaller one.</li>
<li><strong>Stacked discounts don't add up:</strong> 20% off and then another 10% off is 28% in total, not 30%.</li>
<li><strong>Count delivery and returns</strong> before deciding that an online discount beats a local shop.</li>
</ul>

<h2>Real-World Shopping Examples</h2>
<p>Suppose a jacket priced at $120 is marked 30% off, and you have an extra 15% loyalty voucher applied at checkout. First subtract 30% ($36) to reach $84, then apply 15% to $84 ($12.60) for a pre-tax total of <strong>$71.40</strong> — an effective discount of 40.5%, not 45%. Add local sales tax (for example 8%) last on the $71.40 subtotal ($77.11 final price).</p>
<p>To check a "was/now" markdown, take the saving divided by the original ticket price and multiply by 100. That way you can tell in seconds whether a bundle, seasonal clearance or coupon code actually lowers your unit price compared with buying individual items.</p>
EOT_TF,
    'faqs' => [
        ['How do I calculate 20% off a price?', 'Multiply the price by 0.8. For example, 20% off 75 is 75 × 0.8 = 60, a saving of 15.'],
        ['Is 20% off plus an extra 10% the same as 30% off?', 'No. The extra 10% applies to the reduced price, so the total is 1 − 0.8 × 0.9 = 28% off.'],
        ['How do I find the original price before a discount?', 'Divide the sale price by (1 − discount ÷ 100). If the sale price is 63 after 30% off, the original was 63 ÷ 0.7 = 90.'],
        ['Is sales tax calculated before or after the discount?', 'Usually after. Tax is charged on the price you actually pay, which is the discounted price.'],
        ['What does 50% off then 50% off equal?', '75% off in total, not 100%: 1 − 0.5 × 0.5 = 0.75.'],
    ],
    'aka' => ['Sale Price Calculator', 'Percent Off Calculator', 'Double Discount Calculator'],
];
