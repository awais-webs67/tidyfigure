<?php
// Fraction Calculator: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Fraction Calculator',
  'category' => 'calc',
  'order' => 5,
  'popular' => true,
  'icon' => 'divide',
  'keywords' => 'fraction calculator adding fractions subtracting fractions multiplying fractions dividing fractions mixed numbers simplify fractions fraction to decimal decimal to fraction',
  'short' => 'Add, subtract, multiply and divide fractions, with steps.',
  'title' => 'Fraction Calculator: Add, Subtract, Multiply, Divide',
  'description' => <<<'EOT_TF'
Add, subtract, multiply and divide fractions and mixed numbers. Get the simplified answer with every step, and turn decimals into fractions.
EOT_TF,
  'related' => ['percentage-calculator', 'grade-calculator', 'unit-converter', 'gpa-calculator'],
  'answer' => <<<'EOT_TF'
Type two fractions, such as <strong>1 1/2</strong> and <strong>3/4</strong> (mixed numbers, whole numbers and decimals also work), pick +, −, × or ÷, and the answer appears straight away: <strong>simplified</strong>, as a <strong>mixed number</strong> and as a <strong>decimal</strong>, with each step explained. Below, simplify a single fraction or turn a decimal into a fraction.
EOT_TF,
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
EOT_TF,
  'faqs' => [
    [
      'How do I add fractions with different denominators?',
      <<<'EOT_TF'
Rewrite both with a common denominator (the least common multiple of the bottoms), add the tops, then simplify. 1/4 + 1/6 = 3/12 + 2/12 = 5/12.
EOT_TF,
    ],
    [
      'How do I enter a mixed number?',
      <<<'EOT_TF'
Type the whole number, a space, then the fraction: 2 3/4. You can also type whole numbers (5) and decimals (0.75).
EOT_TF,
    ],
    [
      'How do I simplify a fraction?',
      <<<'EOT_TF'
Divide the top and bottom by their greatest common factor. 18/24: the GCF is 6, so it simplifies to 3/4.
EOT_TF,
    ],
    [
      'How do I turn a decimal into a fraction?',
      <<<'EOT_TF'
Write it over a power of ten and simplify: 0.375 = 375/1000 = 3/8. Use the decimal box below for repeating decimals too.
EOT_TF,
    ],
    [
      'How do you divide fractions?',
      <<<'EOT_TF'
Flip the second fraction and multiply. 2/3 ÷ 4/5 = 2/3 × 5/4 = 10/12 = 5/6.
EOT_TF,
    ],
  ],
];
