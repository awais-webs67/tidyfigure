<?php
// Budget Planner (50/30/20): page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Budget Planner (50/30/20)',
  'updated' => '2026-10-22', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'money',
  'order' => 17,
  'icon' => 'chart-pie',
  'popular' => true,
  'appCategory' => 'FinanceApplication',
  'keywords' => 'budget calculator 50 30 20 rule monthly budget planner needs wants savings spending plan',
  'short' => 'Split your income into needs, wants and savings and see where you’re over budget.',
  'title' => '50/30/20 Budget Calculator: Free Monthly Budget Planner',
  'description' => <<<'EOT_TF'
Plan your monthly budget with the 50/30/20 rule. List your spending as needs, wants or savings and see your targets, what’s left over and where you overspend.
EOT_TF,
  'related' => ['savings-goal-calculator', 'debt-payoff-planner', 'net-worth-calculator'],
  'answer' => <<<'EOT_TF'
The <strong>50/30/20 rule</strong> splits your take-home pay three ways: <strong>50% for needs</strong> (rent, food, bills, transport), <strong>30% for wants</strong> (eating out, hobbies, subscriptions) and <strong>20% for savings and extra debt payments</strong>. On 3,500 a month, that's 1,750 for needs, 1,050 for wants and 700 for savings.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>How the 50/30/20 rule works</h2>
<p>The rule was popularised by US Senator Elizabeth Warren and her daughter Amelia Warren Tyagi in their book <em>All Your Worth</em>. Instead of tracking dozens of categories, you sort every expense into one of three buckets and check each bucket against a simple percentage of your <strong>take-home pay</strong> (after tax).</p>
<div class="formula">Needs   = take-home pay × 50%
Wants   = take-home pay × 30%
Savings = take-home pay × 20%

3,500 a month → 1,750 needs · 1,050 wants · 700 savings</div>

<h2>Needs, wants or savings?</h2>
<div class="scroll"><table class="tbl">
<thead><tr><th>Needs (50%)</th><th>Wants (30%)</th><th>Savings &amp; debt (20%)</th></tr></thead>
<tbody>
<tr><td>Rent or mortgage</td><td>Eating out, takeaways</td><td>Emergency fund</td></tr>
<tr><td>Groceries</td><td>Streaming and subscriptions</td><td>Retirement and investments</td></tr>
<tr><td>Utilities, phone, internet</td><td>Holidays and travel</td><td>Extra debt payments above the minimum</td></tr>
<tr><td>Transport to work</td><td>Clothes beyond the basics</td><td>Saving for a house deposit</td></tr>
<tr><td>Insurance, childcare</td><td>Hobbies, gym, gadgets</td><td>Sinking funds (car repairs, gifts)</td></tr>
<tr><td>Minimum debt payments</td><td>Upgrades (a nicer phone plan)</td><td></td></tr>
</tbody></table></div>
<p>The test for a need: would you face serious problems if you stopped paying it? Groceries are a need; the premium brand is partly a want. Be honest, because labelling wants as needs is the most common way budgets go wrong.</p>

<h2>Reading your result</h2>
<ul>
<li><strong>Needs over 50%</strong> is common in expensive cities. Choose the 60/20/20 rule, and look at the biggest fixed costs (housing, car, phone contracts) when they come up for renewal.</li>
<li><strong>Wants over 30%</strong> is the easiest area to trim: cancel unused subscriptions and set a weekly amount for eating out.</li>
<li><strong>Savings under 20%</strong>: start with whatever you can, even 5%, and raise it each time your income rises.</li>
<li><strong>Money left over</strong> that you haven't planned tends to disappear. Give it a job, ideally in savings.</li>
</ul>

<h2>Other splits</h2>
<p>If you're paying off high-interest debt or saving for something big, flip the rule to <strong>40/30/30</strong> or cut wants further. If your income is low compared with living costs, <strong>70/20/10</strong> is more realistic. The point isn't the exact numbers but a plan that covers needs, keeps some fun, and always saves something.</p>

<h2>Next steps</h2>
<ul>
<li>Build an emergency fund of 3–6 months of needs. The <a href="/savings-goal-calculator">savings goal calculator</a> shows how long it will take.</li>
<li>Clear expensive debts with the <a href="/debt-payoff-planner">debt payoff planner</a>.</li>
<li>Automate: move your savings on payday, before you can spend it.</li>
<li>Review your budget every few months and after any change in income.</li>
</ul>
<p>Your figures stay in your browser. Nothing is sent or stored.</p>
EOT_TF,
  'faqs' => [
    [
      'What is the 50/30/20 budget rule?',
      'Spend 50% of take-home pay on needs, 30% on wants, and put 20% into savings and extra debt payments.',
    ],
    [
      'Is 50/30/20 based on gross or net income?',
      <<<'EOT_TF'
Net (take-home) income, after tax. If pension contributions come out of your salary, you can count them as savings.
EOT_TF,
    ],
    [
      'What if my needs are more than 50%?',
      <<<'EOT_TF'
That is common where housing is expensive. Use 60/20/20, keep saving something, and look for savings on your biggest fixed costs.
EOT_TF,
    ],
    [
      'Are debt payments needs or savings?',
      <<<'EOT_TF'
Minimum payments are needs. Anything you pay above the minimum counts towards the 20% savings and debt bucket.
EOT_TF,
    ],
    [
      'How much should I save each month?',
      <<<'EOT_TF'
The rule suggests 20% of take-home pay. If that isn’t possible yet, start smaller and increase it over time.
EOT_TF,
    ],
  ],
];
