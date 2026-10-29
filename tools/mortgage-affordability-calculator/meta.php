<?php
// Mortgage Affordability Calculator: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Mortgage Affordability Calculator',
  'updated' => '2026-10-26', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'money',
  'order' => 14,
  'icon' => 'house',
  'appCategory' => 'FinanceApplication',
  'keywords' => 'how much house can i afford mortgage affordability home price income 28/36 rule dti borrow',
  'short' => 'How much house can you afford? Uses your income, debts, deposit and rate.',
  'title' => 'Mortgage Affordability Calculator: How Much Can I Afford?',
  'description' => <<<'EOT_TF'
Find the home price you can afford from your income, monthly debts, down payment and interest rate, using the 28/36 rule lenders use, with tax and insurance.
EOT_TF,
  'related' => ['loan-calculator', 'budget-planner', 'net-worth-calculator'],
  'answer' => <<<'EOT_TF'
Lenders commonly use the <strong>28/36 rule</strong>: housing costs up to 28% of gross monthly income, and all debt payments up to 36%. On a 90,000 income with 400 a month of other debts and 60,000 down, at 6.5% over 30 years, that allows about <strong>2,100 a month</strong> for housing, or a home of about <strong>327,500</strong>.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>How lenders decide what you can afford</h2>
<p>Lenders look at your <strong>debt-to-income ratio (DTI)</strong>: the share of your gross (before-tax) monthly income that goes on debt payments. There are two limits:</p>
<ul>
<li><strong>Front-end (housing) ratio:</strong> mortgage payment, property tax, insurance and any HOA fee, divided by gross monthly income. The classic limit is <strong>28%</strong>.</li>
<li><strong>Back-end (total) ratio:</strong> housing costs plus all other debt payments (car loan, student loans, credit card minimums), divided by gross income. The classic limit is <strong>36%</strong>.</li>
</ul>
<p>Your maximum housing cost is whichever limit is lower. Some loan programmes accept more, such as 31/43, which is the "flexible" option above.</p>

<h2>Worked example</h2>
<div class="formula">Income 90,000 a year = 7,500 a month
Housing limit: 7,500 × 28% = 2,100
Total limit:   7,500 × 36% = 2,700 − 400 other debts = 2,300
Max housing cost = lower of the two = 2,100 a month

At 6.5% over 30 years, with tax + insurance at 1.5% of the price a year:
Home price ≈ 327,479  (60,000 down + 267,479 loan)
Mortgage payment 1,690.65 + tax & insurance 409.35 = 2,100.00</div>

<h2>What changes the answer most</h2>
<div class="scroll"><table class="tbl">
<thead><tr><th>Change (from the example)</th><th class="n">Affordable price</th></tr></thead>
<tbody>
<tr><td>As above (6.5%)</td><td class="n">≈ 327,500</td></tr>
<tr><td>Rate 5.5% instead of 6.5%</td><td class="n">≈ 352,300</td></tr>
<tr><td>Rate 7.5%</td><td class="n">≈ 305,700</td></tr>
<tr><td>Pay off the 400 debt</td><td class="n">unchanged (housing limit applies)</td></tr>
</tbody></table></div>
<p>Interest rates have a large effect: here, each percentage point changes the price you can afford by about 7–8%. Paying off debts helps when the total-debt limit is the one holding you back. The note under the result tells you which limit applies.</p>

<h2>Affordable for the bank, or for you?</h2>
<p>These ratios are what lenders allow, not necessarily what's comfortable. Before you buy, check the payment against your real budget (the <a href="/budget-planner">budget planner</a> helps), and remember the costs that aren't in the ratio:</p>
<ul>
<li>Closing costs, legal fees and stamp duty or transfer taxes, often 2–5% of the price.</li>
<li>Maintenance: a common guide is 1% of the home's value per year.</li>
<li>Utilities, furniture and moving costs.</li>
<li>An emergency fund of 3–6 months' expenses that you don't spend on the deposit.</li>
</ul>

<h2>Down payment and mortgage insurance</h2>
<p>A bigger deposit lowers the loan and the monthly payment. In many countries, a deposit under 20% means the lender adds mortgage insurance (PMI in the US) or charges a higher rate. Rules differ by country and lender, so treat this calculator's figure as a starting point for a conversation with a lender or broker.</p>
<p><em>This is an estimate. Lenders also look at your credit history, job stability and the property itself.</em></p>
EOT_TF,
  'faqs' => [
    [
      'How much house can I afford on my salary?',
      <<<'EOT_TF'
Under the 28/36 rule, your housing costs can be up to 28% of your gross monthly income. Enter your income, debts, deposit and rate above to turn that into a home price.
EOT_TF,
    ],
    [
      'What is the 28/36 rule?',
      <<<'EOT_TF'
Housing costs should be at most 28% of gross monthly income, and all debt payments together at most 36%.
EOT_TF,
    ],
    [
      'Does the calculator include property tax and insurance?',
      <<<'EOT_TF'
Yes. Enter them as a yearly percentage of the price (1–2% is common). Add any HOA or service charge separately.
EOT_TF,
    ],
    [
      'How does the interest rate affect affordability?',
      <<<'EOT_TF'
A higher rate means more of each payment is interest, so the same payment supports a smaller loan. One percentage point often changes the affordable price by about 7–8%.
EOT_TF,
    ],
    [
      'Should I borrow the maximum I can afford?',
      <<<'EOT_TF'
Not necessarily. Leave room for maintenance, savings and rate rises. Check the payment against your real monthly budget.
EOT_TF,
    ],
  ],
];
