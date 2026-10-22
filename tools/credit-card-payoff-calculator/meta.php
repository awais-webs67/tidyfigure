<?php
// Credit Card Payoff Calculator: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Credit Card Payoff Calculator',
  'category' => 'money',
  'order' => 6,
  'icon' => 'credit-card',
  'appCategory' => 'FinanceApplication',
  'keywords' => 'credit card payoff calculator how long to pay off credit card debt interest apr',
  'short' => 'How long to clear a credit card, the interest you’ll pay, and how to pay less.',
  'title' => 'Credit Card Payoff Calculator: When Will I Be Debt-Free?',
  'description' => <<<'EOT_TF'
Find out how long it will take to pay off a credit card, how much interest you’ll pay, and how much you save by paying more each month. Free and private.
EOT_TF,
  'related' => ['loan-calculator', 'savings-goal-calculator', 'compound-interest-calculator'],
  'answer' => <<<'EOT_TF'
Enter your balance, the card's APR and what you'll pay each month. A <strong>3,500 balance at 24% APR</strong> paid off at 150 a month takes about <strong>2 years 8 months</strong> and costs around 1,260 in interest. The table shows how much faster and cheaper it is to pay a little more.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>How credit card interest works</h2>
<p>Card interest is quoted as an APR, but charged monthly on the balance you carry: roughly APR ÷ 12 each month. At 24% APR, that's 2% a month, so a 3,500 balance costs about 70 in interest in the first month. Only the part of your payment above the interest reduces the debt.</p>
<div class="formula">Monthly interest ≈ balance × APR ÷ 12
Balance next month = balance + interest − payment</div>

<h2>The minimum payment trap</h2>
<p>Minimum payments are designed to keep you in debt for a long time: often just 1–3% of the balance plus interest. As the balance falls, the minimum falls too, so it can take 10–20 years to clear a card and the interest can exceed the original spending. Paying a fixed amount above the minimum, and keeping it the same as the balance falls, is the single most effective change.</p>

<h2>Strategies for paying off cards faster</h2>
<ul>
<li><strong>Avalanche:</strong> pay the minimum on every card and put any extra money on the card with the highest interest rate. This saves the most interest.</li>
<li><strong>Snowball:</strong> put extra money on the smallest balance first. Quick wins keep many people motivated.</li>
<li><strong>Balance transfer:</strong> moving debt to a 0% card can save a lot, but check the transfer fee (often 2–4%) and have a plan to clear it before the offer ends.</li>
<li><strong>Stop adding to it:</strong> use a debit card while you pay down the balance.</li>
<li><strong>Talk to your lender</strong> if you're struggling. Free debt advice services can help negotiate lower payments.</li>
</ul>

<h2>Why paying more saves so much</h2>
<p>Because interest is charged on the remaining balance, every extra payment reduces all future interest. In the example above, raising the payment from 150 to 225 a month cuts the time to about 1 year 7 months and saves roughly 530 in interest.</p>

<p><em>Estimates assume a fixed APR and no new spending or fees. Your card statement shows your exact figures.</em></p>
EOT_TF,
  'faqs' => [
    [
      'How long will it take to pay off my credit card?',
      <<<'EOT_TF'
Enter your balance, APR and monthly payment. The calculator shows the months to pay off and the interest you’ll pay.
EOT_TF,
    ],
    [
      'How is credit card interest calculated?',
      'Roughly APR ÷ 12 is charged each month on the balance you carry.',
    ],
    [
      'Why isn’t my balance going down?',
      <<<'EOT_TF'
If your payment barely covers the monthly interest, the balance hardly falls. Increase your payment above the interest amount.
EOT_TF,
    ],
    [
      'Is it better to pay more than the minimum?',
      'Yes. Paying a fixed amount above the minimum can save years and thousands in interest.',
    ],
    [
      'Which card should I pay off first?',
      <<<'EOT_TF'
The highest-interest card saves the most money (avalanche); the smallest balance first can be more motivating (snowball).
EOT_TF,
    ],
  ],
];
