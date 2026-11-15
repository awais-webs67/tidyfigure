<?php
return [
    'name' => 'Number to Words',
    'updated' => '2026-11-15',
    'category' => 'convert',
    'order' => 22,
    'popular' => true,
    'icon' => 'spell-check',
    'keywords' => 'number to words, numbers in words converter, amount in words cheque, lakh crore converter, spell out numbers, ordinal number words',
    'short' => 'Spell out any number in words, for cheques, invoices and homework.',
    'title' => 'Number to Words Converter – Cheque, US & Lakh',
    'description' => 'Spell any integer or decimal in English words with US/UK styles, cheque currency formatting, ordinal suffixes and Indian/Pakistani lakh-crore grouping.',
    'related' => ['roman-numeral-converter', 'invoice-generator', 'receipt-maker', 'percentage-calculator'],
    'answer' => 'Type a number to see it written out in words straight away. Choose <strong>Words</strong> for plain English (US or UK style, with “and”), <strong>Cheque / currency</strong> for amounts such as “One thousand two hundred dollars and fifty cents only”, <strong>Ordinal</strong> for “twenty-first”, or switch to the <strong>Indian system</strong> for lakh and crore.',
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

<h2>Short Scale vs South Asian Numbering</h2>
<p>In North America, the UK and global finance (short scale), groupings step by thousands: thousand (10³), million (10⁶), billion (10⁹) and trillion (10¹²). In India, Pakistan, Bangladesh and Nepal, amounts above ten thousand follow 2-2-3 comma grouping into <strong>lakhs</strong> (1,00,000 = one hundred thousand) and <strong>crores</strong> (1,00,00,000 = ten million).</p>
<p>When writing legal contracts or bank cheques, spelling amounts out in full with "only" or cents expressed as <code>XX/100</code> removes ambiguity and prevents digit tampering.</p>

<h2>Formatting Hyphens &amp; Decimals Clearly</h2>
<p>Standard English style hyphenates compound tens from <code>twenty-one</code> through <code>ninety-nine</code>, inserts "and" after hundreds in British usage ("two hundred and forty"), and reads decimal fractional digits individually unless formatted as currency cents.</p>
EOT_TF,
    'faqs' => [
        ['How do I write 1,500 in words?', 'One thousand five hundred. Some people also say fifteen hundred, especially for years and prices.'],
        ['How do I write a cheque amount in words?', 'Choose Cheque / currency and your currency. For 1,234.56 dollars it gives: One thousand two hundred thirty-four dollars and 56/100 only.'],
        ['Is it one hundred and five or one hundred five?', 'Both are correct. British English uses and (one hundred and five); American English usually leaves it out.'],
        ['How do you write 1 lakh and 1 crore in numbers?', 'One lakh is 1,00,000 (one hundred thousand). One crore is 1,00,00,000 (ten million).'],
        ['Can it convert decimals?', 'Yes. In Words mode, decimals are read digit by digit (3.14 is three point one four). In currency mode, they become cents, pence or paise.'],
        ['How should you write zero cents on a business or personal cheque?', 'Write \'zero cents\', \'no/100\', or \'00/100\' right after \'Dollars\' or \'Only\' and draw a crisp horizontal line across unused box space.'],
    ],
    'aka' => ['Amount in Words Converter', 'Cheque Words Formatter', 'Lakh Crore Word Converter'],
];
