<?php
// Net Worth Calculator: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Net Worth Calculator',
  'updated' => '2026-10-22', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'money',
  'order' => 18,
  'icon' => 'piggy-bank',
  'appCategory' => 'FinanceApplication',
  'keywords' => 'net worth calculator assets liabilities how much am i worth personal balance sheet wealth',
  'short' => 'Add up what you own and what you owe to find your net worth.',
  'title' => 'Net Worth Calculator: Assets Minus Liabilities, Free',
  'description' => <<<'EOT_TF'
Calculate your personal net worth: list your savings, investments, pension, home and car, minus your mortgage, loans and cards. See your debt-to-asset ratio.
EOT_TF,
  'related' => ['budget-planner', 'fire-calculator', 'retirement-calculator'],
  'answer' => <<<'EOT_TF'
Your <strong>net worth</strong> is everything you own minus everything you owe: <strong>assets − liabilities</strong>. In the example, 355,000 of assets (savings, pension, home, car) minus 227,800 of debts (mortgage, car loan, cards, student loan) gives a net worth of <strong>127,200</strong>.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>The net worth formula</h2>
<div class="formula">Net worth = total assets − total liabilities

Assets: 4,500 + 12,000 + 38,000 + 9,500 + 280,000 + 11,000 = 355,000
Debts:  205,000 + 6,500 + 2,300 + 14,000                  = 227,800
Net worth = 355,000 − 227,800 = 127,200</div>
<p>Net worth is a snapshot of your finances on one day, like a company's balance sheet. Income tells you how much flows in; net worth tells you how much you've actually kept.</p>

<h2>What to count as assets</h2>
<ul>
<li><strong>Cash:</strong> current and savings accounts, cash at home.</li>
<li><strong>Investments:</strong> shares, funds, bonds, crypto (at today's value).</li>
<li><strong>Retirement savings:</strong> pensions, 401(k)s, IRAs and similar.</li>
<li><strong>Property:</strong> your home and any other property, at a realistic selling price, not what you paid.</li>
<li><strong>Vehicles:</strong> what the car would sell for today, which is usually much less than its purchase price.</li>
<li><strong>Money owed to you</strong> that you expect to get back.</li>
</ul>
<p>Leave out everyday belongings such as furniture and clothes. They're hard to value and rarely sell for much. Include valuable items such as jewellery or art only if you'd realistically sell them.</p>

<h2>What to count as liabilities</h2>
<ul>
<li>Mortgage balance (the amount still owed, not the original loan).</li>
<li>Car loans and finance agreements.</li>
<li>Credit cards and store cards (the full balance).</li>
<li>Student loans, personal loans, overdrafts, buy-now-pay-later and money owed to family.</li>
</ul>

<h2>Debt-to-asset ratio</h2>
<p>This shows what share of your assets is funded by debt: total debts ÷ total assets. In the example, 227,800 ÷ 355,000 = 64.2%. It's typically high for new homeowners and falls as the mortgage is paid down. Below 50% is often seen as healthy, but age and stage of life matter more than one number.</p>

<h2>Is my net worth good?</h2>
<p>There's no single right number. Net worth usually starts near zero (or below, with student loans) and grows through your 30s to 60s as you pay off debt and investments grow. A useful benchmark is your own trend: track it every 3–6 months with the same method. To grow it:</p>
<ul>
<li>Spend less than you earn and invest the difference (the <a href="/budget-planner">budget planner</a> helps).</li>
<li>Pay off high-interest debt first, with the <a href="/debt-payoff-planner">debt payoff planner</a>.</li>
<li>Avoid debt for things that lose value quickly, like cars and gadgets.</li>
<li>Let investments compound over the long term.</li>
</ul>
<p>Your figures stay in your browser and are never sent anywhere.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I calculate my net worth?',
      <<<'EOT_TF'
Add up the value of everything you own, then subtract everything you owe. The result is your net worth.
EOT_TF,
    ],
    [
      'Should I include my house in net worth?',
      <<<'EOT_TF'
Yes, at its current market value, and include the remaining mortgage as a debt. Some people also track a figure without their home, since they need somewhere to live.
EOT_TF,
    ],
    [
      'Should I include my pension?',
      'Yes. Pensions and retirement accounts are assets, even though you can’t spend them yet.',
    ],
    [
      'Is negative net worth bad?',
      'It’s common when you’re young, especially with student loans. Focus on making it rise each year.',
    ],
    [
      'How often should I check my net worth?',
      'Every 3 to 6 months is enough to see the trend without worrying about short-term market moves.',
    ],
  ],
];
