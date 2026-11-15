<?php
return [
    'name' => 'Roman Numeral Converter',
    'updated' => '2026-11-15',
    'category' => 'convert',
    'order' => 23,
    'icon' => 'landmark',
    'keywords' => 'roman numeral converter, roman numerals translator, number to roman numerals, date to roman numerals, year in roman numerals',
    'short' => 'Convert numbers and dates to Roman numerals and back.',
    'title' => 'Roman Numeral Converter – Numbers, Dates & Years',
    'description' => 'Convert Arabic numbers and dates into Roman numerals (or decode back to decimals) with step-by-step subtraction rules for tattoos and clocks.',
    'related' => ['number-to-words', 'binary-translator', 'age-calculator', 'unit-converter'],
    'answer' => 'Type a number (1 to 3,999,999) to get Roman numerals, or type Roman numerals such as <strong>MMXXVI</strong> to get the number. The breakdown shows how it’s built, invalid numerals are flagged, and the date section turns any date into Roman numerals, for example 25.XII.MMXXVI.',
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

<h2>Standard Subtractive Pairs &amp; Common Mistakes</h2>
<p>Modern Roman notation limits consecutive repeats of I, X, C and M to three symbols and uses six subtractive pairs to keep values concise: <code>IV (4)</code>, <code>IX (9)</code>, <code>XL (40)</code>, <code>XC (90)</code>, <code>CD (400)</code> and <code>CM (900)</code>. Never write <code>IC</code> for 99 (write <code>XCIX</code>) or <code>MIM</code> for 1999 (write <code>MCMXCIX</code>).</p>
<p>Watchmakers occasionally break the four-in-a-row rule on clock faces by printing <code>IIII</code> instead of <code>IV</code> purely for visual symmetry opposite <code>VIII</code>.</p>

<h2>Reading Cornerstones, Copyright Dates &amp; Outlines</h2>
<p>Historic buildings, film end credits and legal statutes stamp years in Roman numerals such as <code>MCMXCVIII</code> (1998) or <code>MMXXVI</code> (2026). Breaking blocks from left to right—grouping any smaller symbol ahead of a larger one as a subtracted pair—makes decoding instant even without paper.</p>
EOT_TF,
    'faqs' => [
        ['How do you write 2026 in Roman numerals?', '2026 is MMXXVI: MM (2000) + XX (20) + VI (6).'],
        ['What is 4 in Roman numerals: IV or IIII?', 'The standard form is IV. IIII appears on many clock faces for tradition and balance, but IV is correct elsewhere.'],
        ['What is the largest Roman numeral?', 'With standard symbols, 3,999 (MMMCMXCIX). Larger numbers use a line over a numeral to multiply it by 1,000.'],
        ['Is there a zero in Roman numerals?', 'No. The Romans had no symbol for zero. Medieval writers sometimes used N (for nulla, “nothing”).'],
        ['How do I write a date in Roman numerals?', 'Convert the day, month and year separately, then join them: 25 December 2026 is XXV.XII.MMXXVI.'],
        ['What is the largest standard Roman numeral without overbars?', 'Without vinculum overbars (which multiply by 1,000), standard additive/subtractive Roman numerals run cleanly up to 3,999 (MMMCMXCIX).'],
        ['How do people format full birthdays as Roman numerals?', 'Simply convert the day, month and four-digit year separately and join them with dots, hyphens or slashes—for example 14·XI·MMXXVI.'],
        ['Why is 4 written IV instead of IIII on modern clocks and outlines?', 'Roman stonecutters later standardized subtractive notation (IV = 5 minus 1) to shorten inscriptions, though watchmakers keep IIII for visual face balance.'],
    ],
    'aka' => ['Roman Numeral Translator', 'Date in Roman Numerals'],
];
