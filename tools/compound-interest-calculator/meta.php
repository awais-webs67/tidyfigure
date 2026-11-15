<?php
return [
    'name' => 'Compound Interest Calculator',
    'updated' => '2026-11-15',
    'category' => 'money',
    'order' => 1,
    'icon' => 'trending-up',
    'popular' => true,
    'appCategory' => 'FinanceApplication',
    'keywords' => 'compound interest calculator, monthly deposit interest calculator, savings growth chart, apy compounding calculator',
    'short' => 'See how savings and investments grow with interest and monthly deposits.',
    'title' => 'Compound Interest Calculator – Growth & Chart',
    'description' => 'Project savings or investment growth with starting balance, monthly deposits and daily, monthly or annual compounding—year-by-year table inside.',
    'related' => ['sip-calculator', 'savings-goal-calculator', 'retirement-calculator'],
    'answer' => 'Compound interest means you earn interest on your interest. 10,000 invested at 7% a year with 200 added every month grows to about <strong>144,600 after 20 years</strong> (compounded monthly), of which only 58,000 is money you put in. Enter your own numbers to see the year-by-year growth.',
    'sources' => [
        ['SEC Investor.gov – Compound Interest Formula & Calculator', 'https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator'],
        ['Federal Reserve – Interest Rate & Savings Basics', 'https://www.federalreserve.gov/consumerscommunities.htm'],
    ],
    'article' => <<<'EOT_TF'
<h2>The compound interest formula</h2>
<div class="formula">Lump sum:   A = P × (1 + r/n)^(n × t)

P = starting amount, r = yearly rate (7% → 0.07)
n = times compounded per year, t = years</div>
<p>With regular monthly contributions, each deposit grows for the time remaining. The calculator simulates every month, so it handles any combination of starting amount, deposits and compounding frequency exactly.</p>

<h2>Why starting early matters so much</h2>
<p>Because growth builds on itself, time matters more than the amount. Someone who invests 200 a month from age 25 to 35 and then stops can end up with more at 65 than someone who invests 200 a month from 35 to 65, assuming the same 7% return, despite paying in a third as much. The first ten years have three extra decades to compound.</p>

<h2>The rule of 72</h2>
<p>A quick mental shortcut: divide 72 by the yearly rate to find roughly how many years it takes money to double. At 6% it doubles in about 12 years; at 9%, about 8 years. It works for debt too: at 24% credit-card interest, a balance doubles in about 3 years.</p>

<h2>Choosing a realistic rate</h2>
<ul>
<li><strong>Savings accounts:</strong> roughly the central bank rate or below; check your bank.</li>
<li><strong>Bonds:</strong> typically a few percent above inflation.</li>
<li><strong>Diversified stock funds:</strong> long-term averages of 6–10% a year before inflation in major markets, but with large ups and downs, and no guarantee.</li>
</ul>
<p>For a picture of future buying power, use a "real" rate: the expected return minus inflation (for example 7% − 3% = 4%).</p>

<h2>How often is interest compounded?</h2>
<p>More frequent compounding earns slightly more: 7% compounded monthly is equivalent to 7.23% a year. The difference between monthly and daily is tiny. Banks show this as the AER or APY.</p>

<p><em>This calculator is for illustration. Investments can fall as well as rise; consider taxes and fees, and get advice for important decisions.</em></p>

<h2>Nominal APR vs Effective Annual Yield (APY)</h2>
<p>Banks advertise a nominal annual rate alongside compounding frequency: a 6.00% nominal rate compounded monthly yields <code>(1 + 0.06/12)^12 − 1 = 6.17%</code> APY, earning more interest each year than annual compounding alone because interest earns interest eleven months sooner.</p>
EOT_TF,
    'faqs' => [
        ['How do I calculate compound interest?', 'A = P × (1 + r/n)^(n × t), where P is the starting amount, r the yearly rate, n the compounding periods per year and t the years.'],
        ['How much will 10,000 grow in 20 years?', 'At 7% a year compounded monthly, 10,000 grows to about 40,400 with no extra deposits (38,700 compounded yearly). With 200 a month added, it reaches about 144,600.'],
        ['What is the rule of 72?', 'Divide 72 by the interest rate to estimate how many years it takes money to double. At 8%, about 9 years.'],
        ['Is monthly or yearly compounding better?', 'Monthly is slightly better: 7% compounded monthly equals 7.23% compounded yearly.'],
        ['Does this include inflation?', 'No. Subtract expected inflation from the rate to see growth in today’s money.'],
        ['How does daily compounding compare against monthly compounding?', 'Over 10 years at 6%, daily compounding earns only fractionally more than monthly compounding because both compound continuously enough to dwarf annual payouts.'],
    ],
    'aka' => ['Savings Compound Growth Calculator', 'Monthly Contribution Interest Tool'],
];
