<?php
// Number to Words: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Number to Words',
  'updated' => '2026-10-26', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'convert',
  'order' => 22,
  'popular' => true,
  'icon' => 'spell-check',
  'keywords' => 'number to words numbers in words write check amount in words cheque words amount in words converter spell number lakh crore ordinal',
  'short' => 'Spell out any number in words, for cheques, invoices and homework.',
  'title' => 'Number to Words Converter: Spell Out Any Number',
  'description' => <<<'EOT_TF'
Turn any number into words, with cheque and currency formats, US or UK style, ordinals and the lakh and crore system. Copy the result in one click.
EOT_TF,
  'related' => ['roman-numeral-converter', 'invoice-generator', 'receipt-maker', 'percentage-calculator'],
  'answer' => <<<'EOT_TF'
Type a number to see it written out in words straight away. Choose <strong>Words</strong> for plain English (US or UK style, with “and”), <strong>Cheque / currency</strong> for amounts such as “One thousand two hundred dollars and fifty cents only”, <strong>Ordinal</strong> for “twenty-first”, or switch to the <strong>Indian system</strong> for lakh and crore.
EOT_TF,
  'article' => <<<'EOT_TF'
<h2>Writing a cheque amount in words</h2>
<p>Cheques ask for the amount in words to prevent fraud and mistakes. A common format is:</p>
<pre class="copybox">One thousand two hundred thirty-four dollars and 56/100 only</pre>
<ul>
<li>Write the whole amount in words, then the cents or pence as a fraction over 100, or in words (“and fifty-six cents”).</li>
<li>End with “only” so nothing can be added after it.</li>
<li>Hyphenate numbers from twenty-one to ninety-nine (forty-two).</li>
</ul>

<h2>US and UK style</h2>
<p>British English puts “and” after hundreds: 105 is “one hundred <strong>and</strong> five”, and 2,005 is “two thousand <strong>and</strong> five”. American English usually leaves it out: “one hundred five”. Both are correct; use the one your readers expect. On US cheques, “and” is used only before the cents.</p>

<h2>Lakh and crore</h2>
<p>India, Pakistan, Bangladesh and Nepal group large numbers differently:</p>
<div class="scroll"><table class="tbl"><thead><tr><th>Number</th><th>International</th><th>South Asian</th></tr></thead><tbody>
<tr><td>1,00,000</td><td>one hundred thousand</td><td>one lakh</td></tr>
<tr><td>10,00,000</td><td>one million</td><td>ten lakh</td></tr>
<tr><td>1,00,00,000</td><td>ten million</td><td>one crore</td></tr>
<tr><td>1,00,00,00,000</td><td>one billion</td><td>one hundred crore (one arab)</td></tr>
</tbody></table></div>

<h2>Big numbers</h2>
<p>The converter handles whole numbers up to 36 digits (up to the decillions) and decimals, which are read digit by digit (“three point one four”). In English, a billion is 1,000,000,000 (a thousand million) in both the US and UK today.</p>

<h2>Ordinal numbers</h2>
<p>Ordinals give position: first, second, third, twenty-first, one hundredth. Choose <strong>Ordinal</strong> to see both the words and the short form (21st).</p>
EOT_TF,
  'faqs' => [
    [
      'How do I write 1,500 in words?',
      <<<'EOT_TF'
One thousand five hundred. Some people also say fifteen hundred, especially for years and prices.
EOT_TF,
    ],
    [
      'How do I write a cheque amount in words?',
      <<<'EOT_TF'
Choose Cheque / currency and your currency. For 1,234.56 dollars it gives: One thousand two hundred thirty-four dollars and 56/100 only.
EOT_TF,
    ],
    [
      'Is it one hundred and five or one hundred five?',
      <<<'EOT_TF'
Both are correct. British English uses and (one hundred and five); American English usually leaves it out.
EOT_TF,
    ],
    [
      'How do you write 1 lakh and 1 crore in numbers?',
      <<<'EOT_TF'
One lakh is 1,00,000 (one hundred thousand). One crore is 1,00,00,000 (ten million).
EOT_TF,
    ],
    [
      'Can it convert decimals?',
      <<<'EOT_TF'
Yes. In Words mode, decimals are read digit by digit (3.14 is three point one four). In currency mode, they become cents, pence or paise.
EOT_TF,
    ],
  ],
];
