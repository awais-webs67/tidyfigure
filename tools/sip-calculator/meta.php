<?php
// SIP Calculator: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'SIP Calculator',
  'category' => 'money',
  'order' => 2,
  'icon' => 'piggy-bank',
  'popular' => true,
  'appCategory' => 'FinanceApplication',
  'keywords' => 'sip calculator mutual fund monthly investment step up sip returns',
  'short' => 'Future value of a monthly investment (SIP), with optional yearly step-up.',
  'title' => 'SIP Calculator: Monthly Investment Returns With Step-Up',
  'description' => <<<'EOT_TF'
Calculate the future value of a SIP (systematic investment plan) in mutual funds. Monthly amount, expected return, years and optional yearly step-up. Free.
EOT_TF,
  'related' => ['compound-interest-calculator', 'savings-goal-calculator', 'retirement-calculator'],
  'answer' => <<<'EOT_TF'
A SIP (systematic investment plan) invests a fixed amount every month. At 12% a year, investing <strong>5,000 a month for 15 years</strong> puts in 900,000 and could grow to about <strong>2.4 million</strong>. A yearly step-up, raising the amount as your income grows, makes a big difference over long periods.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>How SIP returns are calculated</h2>
<div class="formula">Future value = P × [((1 + i)^n − 1) ÷ i] × (1 + i)

P = monthly investment
i = monthly rate, (1 + yearly return)^(1/12) − 1
n = number of months</div>
<p>Each instalment is invested at the start of the month and grows for the remaining time. The first instalment compounds for the whole period; the last for just one month. The calculator also handles a yearly step-up by increasing the monthly amount after every 12 months.</p>

<h2>Why SIPs work</h2>
<ul>
<li><strong>Discipline:</strong> investing automatically every month removes the temptation to wait for the "right time".</li>
<li><strong>Rupee/dollar-cost averaging:</strong> a fixed amount buys more units when prices are low and fewer when high, smoothing your average cost.</li>
<li><strong>Compounding:</strong> returns earn further returns, and the effect grows dramatically after 10–15 years.</li>
<li><strong>Start small:</strong> many funds accept SIPs from very small monthly amounts.</li>
</ul>

<h2>The power of step-up</h2>
<p>Increasing your SIP by 10% every year, in line with pay rises, can roughly double the final value over 20 years compared with a flat SIP. Try it: set the step-up to 10% and compare.</p>

<h2>What return should I assume?</h2>
<p>Long-term returns depend on the type of fund. Diversified equity funds in many markets have historically returned around 10–12% a year over long periods, with big swings along the way; debt funds return less but more steadily. Use a conservative figure for planning, and remember that inflation reduces what the final amount will buy.</p>

<h2>Things the calculator doesn't include</h2>
<ul>
<li>Fund expense ratios and exit loads</li>
<li>Taxes on capital gains</li>
<li>Market ups and downs: real returns arrive unevenly, not at a steady rate</li>
</ul>
<p><em>For illustration only. Mutual fund investments are subject to market risks; read the scheme documents and consider professional advice.</em></p>
EOT_TF,
  'faqs' => [
    [
      'How is SIP return calculated?',
      <<<'EOT_TF'
Using the future value of a series of monthly payments: P × [((1 + i)^n − 1) ÷ i] × (1 + i), with i as the monthly rate and n the number of months.
EOT_TF,
    ],
    [
      'How much will a 5,000 monthly SIP be worth in 15 years?',
      'At a 12% yearly return, about 2.4 million, from 900,000 invested.',
    ],
    [
      'What is a step-up SIP?',
      <<<'EOT_TF'
A SIP where the monthly amount increases every year by a set percentage, usually in line with salary increases.
EOT_TF,
    ],
    [
      'Is SIP return guaranteed?',
      <<<'EOT_TF'
No. Returns depend on market performance and can be higher or lower than expected, including negative.
EOT_TF,
    ],
    [
      'What is the difference between SIP and lump sum?',
      <<<'EOT_TF'
A SIP invests a fixed amount every month; a lump sum invests everything at once. Use the Compound Interest Calculator for lump sums.
EOT_TF,
    ],
  ],
];
