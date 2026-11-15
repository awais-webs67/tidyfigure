<?php
return [
    'name' => 'Fraction Calculator',
    'updated' => '2026-11-15',
    'category' => 'calc',
    'order' => 5,
    'popular' => true,
    'icon' => 'divide',
    'keywords' => 'fraction calculator, add fractions, multiply fractions, divide fractions, mixed number calculator, simplify fractions, fraction to decimal',
    'short' => 'Add, subtract, multiply and divide fractions, with steps.',
    'title' => 'Fraction Calculator – Add, Subtract & Simplify',
    'description' => 'Add, subtract, multiply and divide proper fractions, improper fractions and mixed numbers with step-by-step simplification and decimal conversion.',
    'related' => ['percentage-calculator', 'grade-calculator', 'unit-converter', 'gpa-calculator'],
    'answer' => 'Type two fractions, such as <strong>1 1/2</strong> and <strong>3/4</strong> (mixed numbers, whole numbers and decimals also work), pick +, −, × or ÷, and the answer appears straight away: <strong>simplified</strong>, as a <strong>mixed number</strong> and as a <strong>decimal</strong>, with each step explained. Below, simplify a single fraction or turn a decimal into a fraction.',
    'article' => <<<'EOT_TF'
<h2>How to add and subtract fractions</h2>
<ol>
<li>Find a common denominator: the least common multiple of the two bottom numbers.</li>
<li>Rewrite each fraction with that denominator.</li>
<li>Add or subtract the top numbers; keep the denominator.</li>
<li>Simplify by dividing top and bottom by their greatest common factor.</li>
</ol>
<p>Example: 1/2 + 1/3. The common denominator is 6, so 3/6 + 2/6 = 5/6.</p>

<h2>How to multiply and divide fractions</h2>
<ul>
<li><strong>Multiply:</strong> top × top and bottom × bottom. 2/3 × 3/4 = 6/12 = 1/2.</li>
<li><strong>Divide:</strong> flip the second fraction and multiply (“keep, change, flip”). 1/2 ÷ 1/4 = 1/2 × 4/1 = 4/2 = 2.</li>
</ul>

<h2>Mixed numbers</h2>
<p>A mixed number like 2 3/4 is a whole number plus a fraction. To calculate with it, turn it into an improper fraction: multiply the whole number by the denominator and add the numerator (2 × 4 + 3 = 11), giving 11/4. The calculator does this for you and shows the answer both ways.</p>

<h2>Common fractions as decimals</h2>
<div class="scroll"><table class="tbl"><thead><tr><th>Fraction</th><th>Decimal</th><th>Fraction</th><th>Decimal</th></tr></thead><tbody>
<tr><td>1/2</td><td>0.5</td><td>1/8</td><td>0.125</td></tr>
<tr><td>1/3</td><td>0.333…</td><td>3/8</td><td>0.375</td></tr>
<tr><td>2/3</td><td>0.666…</td><td>1/5</td><td>0.2</td></tr>
<tr><td>1/4</td><td>0.25</td><td>1/10</td><td>0.1</td></tr>
<tr><td>3/4</td><td>0.75</td><td>1/16</td><td>0.0625</td></tr>
</tbody></table></div>

<h2>Step-by-Step Worked Examples</h2>
<p><strong>Adding unlike denominators:</strong> To compute <code>2/3 + 3/4</code>, find the least common denominator (12). Convert each term: <code>8/12 + 9/12 = 17/12</code>, which simplifies to the mixed number <code>1 5/12</code> (<code>1.4167</code> as a decimal).</p>
<p><strong>Dividing mixed numbers:</strong> For <code>2 1/2 ÷ 1 1/4</code>, first convert both terms to improper fractions (<code>5/2 ÷ 5/4</code>), multiply by the reciprocal (<code>5/2 × 4/5 = 20/10</code>), then divide top and bottom by the greatest common divisor (10) to get <code>2</code>.</p>
<h2>Practical Uses in Cooking, DIY and Carpentry</h2>
<p>Halving or scaling a recipe (such as taking three-quarters of <code>1 2/3</code> cups of flour) or adding imperial tape-measure readings in sixteenths of an inch (<code>5 3/8" + 2 7/16" = 7 13/16"</code>) often leads to mental slips. Keeping numerator, denominator and decimal equivalents visible side by side prevents costly cutting or baking mistakes.</p>

<h2>Converting Decimals &amp; Percentages to Exact Fractions</h2>
<p>To write a repeating or terminating decimal as a reduced fraction, multiply by the power of ten matching its decimal digits (for instance, <code>0.625 = 625/1000</code>), divide top and bottom by their greatest common divisor (<code>125</code>), and read off <code>5/8</code>. For percentages such as <code>12.5%</code>, express the percent over 100 first (<code>12.5/100 = 125/1000</code>) and simplify cleanly to <code>1/8</code>.</p>
EOT_TF,
    'faqs' => [
        ['How do I add fractions with different denominators?', 'Rewrite both with a common denominator (the least common multiple of the bottoms), add the tops, then simplify. 1/4 + 1/6 = 3/12 + 2/12 = 5/12.'],
        ['How do I enter a mixed number?', 'Type the whole number, a space, then the fraction: 2 3/4. You can also type whole numbers (5) and decimals (0.75).'],
        ['How do I simplify a fraction?', 'Divide the top and bottom by their greatest common factor. 18/24: the GCF is 6, so it simplifies to 3/4.'],
        ['How do I turn a decimal into a fraction?', 'Write it over a power of ten and simplify: 0.375 = 375/1000 = 3/8. Use the decimal box below for repeating decimals too.'],
        ['How do you divide fractions?', 'Flip the second fraction and multiply. 2/3 ÷ 4/5 = 2/3 × 5/4 = 10/12 = 5/6.'],
        ['How do you convert a decimal to a simplified fraction?', 'Write the decimal over the matching power of ten (for example 0.375 = 375/1000) and divide both numbers by their greatest common divisor (125) to get 3/8.'],
        ['How do you turn an improper fraction back into a mixed number?', 'Divide the numerator by the denominator: the whole quotient is the integer part and the remainder stays over the original denominator.'],
    ],
    'aka' => ['Mixed Number Calculator', 'Fraction Simplifier', 'Fraction to Decimal Calculator'],
];
