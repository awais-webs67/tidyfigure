<?php
// Debt Payoff Planner: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Debt Payoff Planner',
  'updated' => '2026-10-22', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'money',
  'order' => 16,
  'icon' => 'trending-down',
  'appCategory' => 'FinanceApplication',
  'keywords' => <<<'EOT_TF'
debt snowball calculator debt avalanche calculator pay off debt faster credit cards multiple debts debt free date
EOT_TF,
  'short' => 'Snowball or avalanche: your debt-free date, pay-off order and interest saved.',
  'title' => 'Debt Payoff Planner: Snowball vs Avalanche Calculator',
  'description' => <<<'EOT_TF'
List your debts and see your debt-free date, the order to pay them off, and how much interest the snowball or avalanche method saves over minimum payments.
EOT_TF,
  'related' => ['credit-card-payoff-calculator', 'budget-planner', 'loan-calculator'],
  'answer' => <<<'EOT_TF'
Pay the minimum on every debt, then put every spare penny on one target debt. The <strong>avalanche</strong> method targets the highest interest rate first and saves the most money; the <strong>snowball</strong> method targets the smallest balance first for quick wins. In the example, avalanche clears 14,500 of debt in 25 months with 1,485 of interest, against 82 months and 5,339 paying minimums only.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>How the plan works</h2>
<ol>
<li>Every month, pay the minimum on <strong>every</strong> debt, so nothing goes into arrears.</li>
<li>Put your extra money on one target debt until it's gone.</li>
<li>When a debt is paid off, add its minimum payment to the money going to the next target. The amount you throw at each debt grows, like a snowball rolling downhill.</li>
</ol>
<p>Your total monthly payment stays the same throughout, so you never have to find more money. You just stop paying the debts that are finished.</p>

<h2>Avalanche or snowball?</h2>
<div class="scroll"><table class="tbl">
<thead><tr><th></th><th>Avalanche</th><th>Snowball</th></tr></thead>
<tbody>
<tr><td>Targets</td><td>Highest interest rate</td><td>Smallest balance</td></tr>
<tr><td>Total interest</td><td>Lowest (mathematically best)</td><td>Same or a little more</td></tr>
<tr><td>First debt cleared</td><td>Can take longer</td><td>As soon as possible</td></tr>
<tr><td>Suits you if</td><td>You're motivated by saving money</td><td>You need quick wins to keep going</td></tr>
</tbody></table></div>
<p>Research on how people actually repay debt suggests that clearing whole accounts keeps people going, which is why many advisers recommend the snowball even though it can cost a little more. The best method is the one you'll stick with. The planner shows both, so you can see exactly what the difference costs.</p>

<h2>Worked example</h2>
<p>Three debts, 400 a month in minimums plus 250 extra (650 a month in total):</p>
<div class="scroll"><table class="tbl">
<thead><tr><th>Debt</th><th class="n">Balance</th><th class="n">Rate</th><th class="n">Minimum</th></tr></thead>
<tbody>
<tr><td>Credit card</td><td class="n">4,000</td><td class="n">24%</td><td class="n">100</td></tr>
<tr><td>Personal loan</td><td class="n">2,500</td><td class="n">9%</td><td class="n">80</td></tr>
<tr><td>Car loan</td><td class="n">8,000</td><td class="n">6%</td><td class="n">220</td></tr>
</tbody></table></div>
<ul>
<li><strong>Avalanche:</strong> credit card gone in month 14, personal loan in 18, car loan in 25. Interest: <strong>1,485.16</strong>.</li>
<li><strong>Snowball:</strong> personal loan gone in month 8, credit card in 18, car loan in 26. Interest: <strong>1,799.81</strong>.</li>
<li><strong>Minimum payments only:</strong> 82 months (almost 7 years) and <strong>5,338.65</strong> of interest.</li>
</ul>
<p>Either plan saves thousands and years compared with paying minimums. Avalanche saves another 314.65 here because the expensive credit card is cleared first.</p>

<h2>Finding the extra money</h2>
<ul>
<li>Use the <a href="/budget-planner">budget planner</a> to see where your money goes each month.</li>
<li>Put windfalls (tax refunds, bonuses, gifts) straight onto the target debt.</li>
<li>Ask your card provider for a lower rate, or look at a 0% balance transfer, but check the transfer fee and what the rate becomes afterwards.</li>
<li>Stop adding new debt: the plan only works if balances aren't growing.</li>
</ul>

<h2>Assumptions</h2>
<p>Interest is charged monthly at the yearly rate ÷ 12, rates don't change, and minimum payments stay fixed. Real credit card minimums often fall as the balance falls, which is why paying only the minimum takes even longer than shown. If a minimum payment doesn't cover the monthly interest, the planner warns you.</p>
<p>If you're struggling to make minimum payments, free debt advice services can help you negotiate with lenders.</p>
EOT_TF,
  'faqs' => [
    [
      'What is the debt snowball method?',
      <<<'EOT_TF'
Pay minimums on everything, then put all extra money on the smallest balance. When it is paid off, roll its payment into the next smallest.
EOT_TF,
    ],
    [
      'What is the debt avalanche method?',
      <<<'EOT_TF'
The same, but you target the debt with the highest interest rate first. It costs the least interest overall.
EOT_TF,
    ],
    [
      'Which is better, snowball or avalanche?',
      <<<'EOT_TF'
Avalanche saves the most money. Snowball gives faster wins, which helps many people stay motivated. The planner shows the difference for your debts.
EOT_TF,
    ],
    [
      'How can I pay off debt faster?',
      <<<'EOT_TF'
Add an extra monthly payment, even a small one, and keep your total payment the same as debts are cleared, rolling freed-up minimums into the next debt.
EOT_TF,
    ],
    [
      'Does this include mortgages?',
      <<<'EOT_TF'
You can add any fixed-rate debt, but most plans leave the mortgage out and focus on higher-interest debts first.
EOT_TF,
    ],
  ],
];
