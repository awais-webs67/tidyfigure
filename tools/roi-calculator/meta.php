<?php
// ROI Calculator: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'ROI Calculator',
  'category' => 'money',
  'order' => 10,
  'icon' => 'badge-dollar-sign',
  'appCategory' => 'FinanceApplication',
  'keywords' => 'roi calculator return on investment annualized return cagr investment profit',
  'short' => 'Return on investment, profit and the annualised (CAGR) return.',
  'title' => 'ROI Calculator: Return on Investment & Annualised Return',
  'description' => <<<'EOT_TF'
Calculate return on investment (ROI) as a percentage, the profit or loss, and the annualised return (CAGR) to compare investments over different time periods.
EOT_TF,
  'related' => ['compound-interest-calculator', 'profit-margin-calculator', 'percentage-calculator'],
  'answer' => <<<'EOT_TF'
ROI is your <strong>profit divided by what you invested</strong>. Invest 5,000 and get back 6,800, and your ROI is <strong>36%</strong>. Because ROI ignores time, add the number of years to see the <strong>annualised return</strong>: 36% over 3 years is about 10.8% a year, which you can compare fairly with other investments.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>Formulas</h2>
<div class="formula">ROI (%)            = (final value − invested) ÷ invested × 100
Annualised (CAGR)  = (final value ÷ invested)^(1 ÷ years) − 1</div>

<h2>Why annualised return matters</h2>
<p>A 50% ROI sounds better than a 30% ROI, but not if the 50% took ten years and the 30% took two. Annualised return (also called CAGR, compound annual growth rate) converts any return into an equivalent yearly rate, so you can compare a property, a business project, a stock and a savings account on equal terms.</p>
<div class="scroll"><table class="tbl">
<thead><tr><th>Total ROI</th><th class="n">2 years</th><th class="n">5 years</th><th class="n">10 years</th></tr></thead>
<tbody>
<tr><td>+30%</td><td class="n">14.0% / yr</td><td class="n">5.4% / yr</td><td class="n">2.7% / yr</td></tr>
<tr><td>+50%</td><td class="n">22.5% / yr</td><td class="n">8.4% / yr</td><td class="n">4.1% / yr</td></tr>
<tr><td>+100%</td><td class="n">41.4% / yr</td><td class="n">14.9% / yr</td><td class="n">7.2% / yr</td></tr>
</tbody></table></div>

<h2>Getting the inputs right</h2>
<ul>
<li><strong>Invested:</strong> include every cost: purchase price, fees, commissions, taxes paid upfront, repairs or set-up costs.</li>
<li><strong>Returned:</strong> the final value plus any income received along the way (dividends, rent, interest), minus selling costs.</li>
<li>For marketing ROI, compare the profit from campaign sales (not revenue) with the campaign's cost.</li>
</ul>

<h2>Worked example</h2>
<p>You buy equipment for a side business for 5,000 and over three years it brings in 6,800 of profit after running costs. ROI is (6,800 − 5,000) ÷ 5,000 = 36%. Annualised, that's (6,800 ÷ 5,000)^(1/3) − 1 ≈ 10.8% a year, better than a typical savings account, but you also took more risk and did more work.</p>

<h2>Limitations</h2>
<p>ROI doesn't account for risk: a 10% return from a savings account and a 10% return from a volatile start-up aren't equally good. It also assumes a single investment at the start; for regular contributions over time, use the Compound Interest or SIP calculators instead.</p>

<h2>Using ROI well</h2>
<p>ROI is simple, which is its strength and its weakness. It ignores how long the money was tied up, so always compare the annualised figure when investments last different lengths of time. It also ignores risk: a safe 6% can be better than a risky 10%. Include every cost in the calculation, such as fees, taxes, maintenance and your own time, or the ROI will look better than reality.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I calculate ROI?',
      <<<'EOT_TF'
Subtract the amount invested from the final value, divide by the amount invested and multiply by 100.
EOT_TF,
    ],
    [
      'What is a good ROI?',
      <<<'EOT_TF'
It depends on risk and time. Compare the annualised return with alternatives, such as a savings rate or a stock market average.
EOT_TF,
    ],
    [
      'What is annualised return?',
      <<<'EOT_TF'
The yearly rate that, compounded, turns the investment into the final value over the period. Also called CAGR.
EOT_TF,
    ],
    [
      'Can ROI be negative?',
      'Yes. If you get back less than you invested, ROI is negative and shows the percentage lost.',
    ],
    [
      'Should I include fees?',
      'Yes. Add all costs to the amount invested and subtract selling costs from the final value.',
    ],
  ],
];
