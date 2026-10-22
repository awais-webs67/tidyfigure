<?php
// VAT & Sales Tax Calculator: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'VAT & Sales Tax Calculator',
  'category' => 'money',
  'order' => 9,
  'icon' => 'receipt',
  'popular' => true,
  'appCategory' => 'FinanceApplication',
  'keywords' => 'vat calculator gst calculator sales tax calculator add vat remove vat reverse',
  'short' => 'Add or remove VAT, GST or sales tax at any rate, with the tax amount.',
  'title' => 'VAT Calculator: Add or Remove VAT, GST & Sales Tax',
  'description' => <<<'EOT_TF'
Add VAT, GST or sales tax to a price, or remove it from a total, at any rate. Shows net, tax and gross amounts with the correct reverse-tax formula. Free.
EOT_TF,
  'related' => ['profit-margin-calculator', 'discount-calculator', 'percentage-calculator'],
  'answer' => <<<'EOT_TF'
To <strong>add tax</strong>, multiply the net price by (1 + rate): 100 + 20% VAT = 120. To <strong>remove tax</strong> from a total, divide by (1 + rate): 120 ÷ 1.2 = 100. A common mistake is taking 20% off the total, which gives 96 instead of 100. Works for VAT, GST and sales tax at any rate.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>Formulas</h2>
<div class="formula">Add tax:     gross = net × (1 + rate)
             tax   = net × rate
Remove tax:  net   = gross ÷ (1 + rate)
             tax   = gross × rate ÷ (1 + rate)

Example at 20%:  100 → 120     120 → 100 (tax 20)</div>

<h2>The reverse-VAT mistake</h2>
<p>If a price of 120 includes 20% VAT, the VAT isn't 20% of 120 (24). It's 20% of the net price, which is 100, so the VAT is 20. To find it from a gross price, divide by 1.2 (or by 1 + your rate). For a 20% rate, the VAT is always 1/6 of the gross; for 15% it's 3/23; for 5% it's 1/21.</p>

<h2>VAT, GST and sales tax</h2>
<ul>
<li><strong>VAT</strong> (value-added tax) is used in the UK, the EU, the UAE, Saudi Arabia, South Africa and many other countries. Prices for consumers usually include it.</li>
<li><strong>GST</strong> (goods and services tax) works similarly in countries such as India, Australia, New Zealand, Canada and Singapore.</li>
<li><strong>Sales tax</strong> in the US is set by states and cities and is usually added at the till rather than included in shelf prices.</li>
</ul>
<p>The maths is identical for all three. Rates differ by country, by product (food, children's clothing and books often have reduced or zero rates) and they change over time, so check your tax authority for the rate that applies.</p>

<h2>For businesses</h2>
<ul>
<li>Show both net and gross prices on quotes for business customers, and the tax amount and rate on invoices.</li>
<li>Calculate margins on net prices; the tax belongs to the government.</li>
<li>Round tax per invoice (or per line, if your country requires it) to the nearest cent.</li>
</ul>
<p>The Invoice Generator adds tax to each line automatically.</p>

<h2>Common VAT mistakes</h2>
<p>The most frequent mistake is taking the tax rate as a percentage of the gross price to find the tax inside it. At 20%, the tax in a 120 price is 20, not 24. Another is mixing up prices that include tax (common for consumers) with prices that exclude it (common between businesses), so always label quotes and invoices clearly as "inc. VAT" or "ex. VAT". If you are registered for VAT or GST, keep a record of the tax on every sale and purchase for your returns.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I add VAT to a price?',
      'Multiply the price by 1 + the VAT rate. At 20%, multiply by 1.2: 100 becomes 120.',
    ],
    [
      'How do I remove VAT from a total?',
      'Divide by 1 + the rate. At 20%, divide by 1.2: 120 becomes 100, so the VAT was 20.',
    ],
    [
      'Why is the VAT not 20% of the total?',
      'Because 20% applies to the net price. Within a gross total, 20% VAT is one sixth of the total.',
    ],
    ['Does this work for GST and sales tax?', 'Yes. Enter your rate; the calculation is the same.'],
    [
      'What VAT rate should I use?',
      'It depends on your country and product. Check your tax authority’s website for the current rate.',
    ],
  ],
];
