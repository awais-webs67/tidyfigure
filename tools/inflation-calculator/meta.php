<?php
return [
    'name' => 'Inflation Calculator',
    'updated' => '2026-11-15',
    'category' => 'money',
    'order' => 5,
    'icon' => 'trending-down',
    'appCategory' => 'FinanceApplication',
    'keywords' => 'inflation calculator, purchasing power erosion, future value inflation, real return after inflation',
    'short' => 'Future prices and how much buying power your money loses to inflation.',
    'title' => 'Inflation Calculator – Future Cost & Buying',
    'description' => 'Model how annual inflation erodes purchasing power and doubles living expenses over 5 to 40 years with CPI context and real-return math.',
    'related' => ['compound-interest-calculator', 'retirement-calculator', 'salary-converter'],
    'answer' => 'Inflation compounds just like interest, in reverse. At <strong>3% a year</strong>, something costing 1,000 today will cost about <strong>1,344 in 10 years</strong>, and 1,000 kept as cash will only buy what 744 buys today. Prices double in roughly 72 ÷ inflation rate years: about 23 years at 3%, about 14 years at 5%.',
    'sources' => [
        ['Bank of England: Inflation and the 2% target', 'https://www.bankofengland.co.uk/monetary-policy/inflation'],
        ['Federal Reserve: Why does the Federal Reserve aim for inflation of 2 percent?', 'https://www.federalreserve.gov/faqs/economy_14400.htm'],
    ],
    'article' => <<<'EOT_TF'
<h2>The inflation formulas</h2>
<div class="formula">Future price   = today's price × (1 + rate)^years
Buying power   = amount ÷ (1 + rate)^years
Doubling time  ≈ 72 ÷ rate (%)</div>

<h2>What inflation means for you</h2>
<ul>
<li><strong>Cash loses value.</strong> Money in an account paying less than inflation buys less every year, even though the balance doesn't fall.</li>
<li><strong>Salaries need to keep up.</strong> A 3% pay rise in a year of 5% inflation is a 2% real pay cut.</li>
<li><strong>Debts get lighter.</strong> Fixed-rate loans become cheaper in real terms, because you repay with less valuable money.</li>
<li><strong>Long-term goals grow.</strong> Retirement, education and house deposits all cost more in the future, so plan in today's money and increase savings over time.</li>
</ul>

<h2>Typical inflation rates</h2>
<p>Most central banks, including the US Federal Reserve, the European Central Bank and the Bank of England, target about <strong>2% a year</strong>. Inflation rose well above that in many countries in 2021–2023, and some economies regularly see 10% or more. Because rates change, this calculator lets you enter any rate: use your national statistics office's latest annual figure, or a long-term average for planning.</p>

<h2>Real returns</h2>
<p>To see what an investment really earns, subtract inflation: a savings account paying 4% when inflation is 3% has a real return of about 1%. Use real returns in the Retirement and Compound Interest calculators to see results in today's money.</p>

<h2>Protecting your money</h2>
<ul>
<li>Keep only short-term money and emergency funds in cash.</li>
<li>Long-term savings in diversified investments have historically beaten inflation, with ups and downs along the way.</li>
<li>Inflation-linked bonds and savings products track the official price index.</li>
<li>Negotiate pay rises at least in line with inflation.</li>
</ul>

<h2>Protecting savings from inflation</h2>
<p>Cash in an account that pays less than inflation loses buying power every year. To keep up, compare the interest rate on your savings with the current inflation rate, and consider longer-term options such as index funds or inflation-linked government bonds for money you won't need for several years. For short-term goals and emergency funds, safety matters more than beating inflation.</p>

<h2>Nominal Return vs Inflation-Adjusted Real Return (Fisher)</h2>
<p>Using the exact Fisher equation (<code>(1 + r_nominal) / (1 + i) − 1</code>), a portfolio earning 7% during 3% annual inflation delivers a real compounding gain of roughly <code>3.88%</code>—not simply subtracting percentages on volatile multi-decade projections.</p>
EOT_TF,
    'faqs' => [
        ['How do I calculate inflation over several years?', 'Multiply the price by (1 + inflation rate) for each year: price × (1 + rate)^years.'],
        ['How much will 1,000 be worth in 10 years?', 'At 3% inflation, it will buy what about 744 buys today.'],
        ['How long does it take for prices to double?', 'About 72 divided by the inflation rate: roughly 23–24 years at 3%, 35–36 years at 2%.'],
        ['What is a normal inflation rate?', 'Most central banks aim for about 2% a year, but actual rates vary by country and year.'],
        ['Where can I find my country’s inflation rate?', 'Your national statistics office publishes the consumer price index (CPI) and the annual inflation rate.'],
    ],
    'aka' => ['Purchasing Power Calculator', 'Future Cost Estimator'],
];
