<?php
// Roman Numeral Converter: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Roman Numeral Converter',
  'updated' => '2026-10-26', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'convert',
  'order' => 23,
  'icon' => 'landmark',
  'keywords' => 'roman numerals converter roman numeral translator number to roman numerals roman numerals to numbers roman numeral date tattoo year in roman numerals',
  'short' => 'Convert numbers and dates to Roman numerals and back.',
  'title' => 'Roman Numeral Converter: Numbers, Years and Dates',
  'description' => <<<'EOT_TF'
Convert numbers to Roman numerals and back, with a step-by-step breakdown. Turn dates and years into Roman numerals for tattoos and invitations.
EOT_TF,
  'related' => ['number-to-words', 'binary-translator', 'age-calculator', 'unit-converter'],
  'answer' => <<<'EOT_TF'
Type a number (1 to 3,999,999) to get Roman numerals, or type Roman numerals such as <strong>MMXXVI</strong> to get the number. The breakdown shows how it’s built, invalid numerals are flagged, and the date section turns any date into Roman numerals, for example 25.XII.MMXXVI.
EOT_TF,
  'article' => <<<'EOT_TF'
<h2>The seven Roman numerals</h2>
<div class="scroll"><table class="tbl"><thead><tr><th>Symbol</th><th>I</th><th>V</th><th>X</th><th>L</th><th>C</th><th>D</th><th>M</th></tr></thead><tbody>
<tr><td>Value</td><td>1</td><td>5</td><td>10</td><td>50</td><td>100</td><td>500</td><td>1,000</td></tr>
</tbody></table></div>

<h2>The rules</h2>
<ul>
<li>Symbols are written from largest to smallest and added: VIII = 5 + 1 + 1 + 1 = 8.</li>
<li>A smaller symbol before a larger one is subtracted, only in six pairs: IV (4), IX (9), XL (40), XC (90), CD (400) and CM (900).</li>
<li>I, X, C and M can repeat up to three times in a row; V, L and D never repeat. So 4 is IV, not IIII (although many clock faces use IIII).</li>
<li>The largest number with standard numerals is 3,999 (MMMCMXCIX). A line over a numeral (vinculum) multiplies it by 1,000: V̅ = 5,000.</li>
</ul>

<h2>Years in Roman numerals</h2>
<div class="scroll"><table class="tbl"><thead><tr><th>Year</th><th>Roman</th><th>Year</th><th>Roman</th></tr></thead><tbody>
<tr><td>1990</td><td>MCMXC</td><td>2020</td><td>MMXX</td></tr>
<tr><td>1999</td><td>MCMXCIX</td><td>2024</td><td>MMXXIV</td></tr>
<tr><td>2000</td><td>MM</td><td>2025</td><td>MMXXV</td></tr>
<tr><td>2010</td><td>MMX</td><td>2026</td><td>MMXXVI</td></tr>
</tbody></table></div>

<h2>Dates for tattoos and invitations</h2>
<p>Roman numeral dates are popular for tattoos, wedding invitations and engravings. Choose the order (day-month-year as in Europe, or month-day-year as in the US) and the separator: dots (XXV.XII.MMXXVI), dashes, slashes or spaces. Double-check the order before getting a tattoo: 03.04 means 3 April in most countries but March 4 in the US.</p>
EOT_TF,
  'faqs' => [
    [
      'How do you write 2026 in Roman numerals?',
      <<<'EOT_TF'
2026 is MMXXVI: MM (2000) + XX (20) + VI (6).
EOT_TF,
    ],
    [
      'What is 4 in Roman numerals: IV or IIII?',
      <<<'EOT_TF'
The standard form is IV. IIII appears on many clock faces for tradition and balance, but IV is correct elsewhere.
EOT_TF,
    ],
    [
      'What is the largest Roman numeral?',
      <<<'EOT_TF'
With standard symbols, 3,999 (MMMCMXCIX). Larger numbers use a line over a numeral to multiply it by 1,000.
EOT_TF,
    ],
    [
      'Is there a zero in Roman numerals?',
      <<<'EOT_TF'
No. The Romans had no symbol for zero. Medieval writers sometimes used N (for nulla, “nothing”).
EOT_TF,
    ],
    [
      'How do I write a date in Roman numerals?',
      <<<'EOT_TF'
Convert the day, month and year separately, then join them: 25 December 2026 is XXV.XII.MMXXVI.
EOT_TF,
    ],
  ],
];
