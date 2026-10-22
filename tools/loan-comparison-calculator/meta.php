<?php
// Loan Comparison Calculator: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Loan Comparison Calculator',
  'category' => 'money',
  'order' => 13,
  'icon' => 'scale',
  'appCategory' => 'FinanceApplication',
  'keywords' => 'compare loans emi comparison two loans which loan is cheaper apr fees personal loan car loan offers',
  'short' => 'Compare 2–4 loan offers side by side: monthly payment, interest, fees and total cost.',
  'title' => 'Loan Comparison Calculator: Compare EMI, Interest & Fees',
  'description' => <<<'EOT_TF'
Compare up to four loan offers side by side. See the monthly payment (EMI), total interest, fees, APR and total cost of each, and which loan is cheapest.
EOT_TF,
  'related' => ['loan-calculator', 'credit-card-payoff-calculator', 'debt-payoff-planner'],
  'answer' => <<<'EOT_TF'
To compare loans, look at the <strong>total cost of borrowing</strong> (all interest plus fees), not just the rate or the monthly payment. Enter each offer's amount, rate, term and fees: for 20,000 over 5 years, a 5.9% loan with a 500 fee costs 3,643.60 in total, slightly less than a 6.9% loan with no fee at 3,704.86.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>Three numbers to compare</h2>
<ul>
<li><strong>Monthly payment (EMI):</strong> what you pay each month. It needs to fit your budget comfortably.</li>
<li><strong>Total interest:</strong> what the lender charges for the money, over the whole term.</li>
<li><strong>Total cost of borrowing:</strong> interest plus fees. This is the fairest way to compare offers, and the calculator picks the cheapest loan by this number.</li>
</ul>

<h2>Worked example</h2>
<p>Three offers for 20,000:</p>
<div class="scroll"><table class="tbl">
<thead><tr><th>Offer</th><th class="n">Monthly</th><th class="n">Interest</th><th class="n">Fee</th><th class="n">Total cost</th></tr></thead>
<tbody>
<tr><td>A: 6.9%, 5 years</td><td class="n">395.08</td><td class="n">3,704.86</td><td class="n">0</td><td class="n">3,704.86</td></tr>
<tr><td>B: 5.9%, 5 years</td><td class="n">385.73</td><td class="n">3,143.60</td><td class="n">500</td><td class="n">3,643.60</td></tr>
<tr><td>C: 6.9%, 3 years</td><td class="n">616.63</td><td class="n">2,198.61</td><td class="n">0</td><td class="n">2,198.61</td></tr>
</tbody></table></div>
<p>Offer B has a lower rate than A, but its 500 fee eats most of the saving: it's only 61.26 cheaper. Offer C has the same rate as A but costs about 1,506 less, simply because you borrow for two fewer years. The catch is a monthly payment 221.55 higher. If you can afford it, the shorter term is the biggest saving here.</p>

<h2>The formula</h2>
<div class="formula">Monthly payment = P × i ÷ (1 − (1 + i)^−n)
Total interest  = monthly payment × n − P
Total cost      = total interest + fees

P = amount, i = yearly rate ÷ 1,200, n = months</div>

<h2>APR and fees</h2>
<p>The <strong>APR</strong> (annual percentage rate) includes fees as well as interest, so it's meant to make offers comparable. When you add a fee, the calculator estimates the APR: the rate you'd effectively pay if you received the amount minus the fee and repaid the same monthly payments. Lenders' official APRs can differ a little because of rules about which fees count and how days are counted.</p>
<p>Watch for fees that are <strong>added to the loan</strong> rather than paid up front. Then you pay interest on the fee too: add it to the amount instead of the fees box.</p>

<h2>Other things to check before choosing</h2>
<ul>
<li><strong>Early repayment charges:</strong> if you might pay off early, a loan without them is worth more.</li>
<li><strong>Fixed or variable rate:</strong> a variable rate can rise. This calculator assumes the rate stays the same.</li>
<li><strong>Representative rates:</strong> advertised rates may only be offered to some applicants. Compare the rate you're actually offered.</li>
<li><strong>Insurance and extras:</strong> payment protection or other add-ons increase the cost and are usually optional.</li>
</ul>
<p>For a full repayment schedule of one loan, or to see how overpaying shortens it, use the <a href="/loan-calculator">loan calculator</a>.</p>
<p><em>Results are estimates for comparison. Your lender's documents show the exact figures.</em></p>
EOT_TF,
  'faqs' => [
    [
      'How do I compare two loans?',
      <<<'EOT_TF'
Compare the total cost of borrowing: all the interest plus any fees. Enter each offer above and the calculator highlights the cheapest.
EOT_TF,
    ],
    [
      'Is a lower interest rate always cheaper?',
      <<<'EOT_TF'
No. A fee can make a lower-rate loan cost more, and a longer term increases total interest even at the same rate.
EOT_TF,
    ],
    [
      'Is it better to take a shorter loan term?',
      <<<'EOT_TF'
A shorter term costs less interest in total but has higher monthly payments. Choose the shortest term whose payment you can comfortably afford.
EOT_TF,
    ],
    [
      'What is APR?',
      <<<'EOT_TF'
The annual percentage rate includes interest and compulsory fees, expressed as a yearly rate. It is designed to make loan offers easier to compare.
EOT_TF,
    ],
    [
      'Can I compare car loans and personal loans?',
      <<<'EOT_TF'
Yes. Any fixed-rate loan with equal monthly payments can be compared, including car, personal, student and home loans.
EOT_TF,
    ],
  ],
];
