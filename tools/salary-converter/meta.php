<?php
// Salary Converter: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Salary Converter',
  'category' => 'money',
  'order' => 7,
  'icon' => 'banknote',
  'appCategory' => 'FinanceApplication',
  'keywords' => 'hourly to salary calculator annual salary to hourly wage monthly salary weekly pay',
  'short' => 'Convert pay between hourly, daily, weekly, monthly and yearly.',
  'title' => 'Salary Converter: Hourly to Annual Salary and Back',
  'description' => <<<'EOT_TF'
Convert pay between hourly, daily, weekly, biweekly, monthly and yearly, with your own hours and paid weeks. Hourly to salary and salary to hourly. Free.
EOT_TF,
  'related' => ['percentage-calculator', 'inflation-calculator', 'vat-calculator'],
  'answer' => <<<'EOT_TF'
For a full-time job of 40 hours a week and 52 paid weeks, <strong>yearly salary = hourly rate × 2,080</strong>. So 25 an hour is 52,000 a year, about 4,333 a month. Enter your own hours, working days and paid weeks for an exact conversion in any direction.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>The conversion formulas</h2>
<div class="formula">Yearly  = hourly × hours per week × paid weeks per year
Monthly = yearly ÷ 12
Weekly  = yearly ÷ paid weeks
Hourly  = yearly ÷ (hours per week × paid weeks)</div>
<p>With 40 hours and 52 weeks, a year has 2,080 paid hours. A quick estimate: double the hourly rate and add three zeros (25/hour ≈ 50,000/year).</p>

<h2>Common conversions (40-hour week, 52 weeks)</h2>
<div class="scroll"><table class="tbl">
<thead><tr><th class="n">Hourly</th><th class="n">Monthly</th><th class="n">Yearly</th></tr></thead>
<tbody>
<tr><td class="n">15</td><td class="n">2,600</td><td class="n">31,200</td></tr>
<tr><td class="n">20</td><td class="n">3,467</td><td class="n">41,600</td></tr>
<tr><td class="n">25</td><td class="n">4,333</td><td class="n">52,000</td></tr>
<tr><td class="n">30</td><td class="n">5,200</td><td class="n">62,400</td></tr>
<tr><td class="n">50</td><td class="n">8,667</td><td class="n">104,000</td></tr>
</tbody></table></div>

<h2>Why "monthly" isn't four weeks</h2>
<p>A year has 52 weeks but 12 months, so a month averages 4.33 weeks, not 4. That's why monthly pay is always calculated from the yearly figure. People paid every two weeks get 26 paychecks a year, which means two months a year have three paydays.</p>

<h2>Comparing a job offer with contracting</h2>
<p>Employees usually get paid holidays, sick pay and pension contributions on top of salary. Contractors and freelancers don't, and often face gaps between contracts. A common rule is that a contractor's hourly rate needs to be about 1.5–2 times an employee's equivalent rate to come out even. Use "paid weeks per year" to reflect the weeks you'll actually bill.</p>

<h2>Part-time and overtime</h2>
<p>For part-time work, enter your actual weekly hours: 20 hours a week at 25 an hour is 26,000 a year. To compare a salaried job with paid overtime, work out the salary's hourly rate first, then compare it with the overtime rate on offer. A salary that looks higher can work out lower per hour if the role routinely expects long weeks.</p>

<h2>Before tax</h2>
<p>All figures are gross (before income tax and deductions). Take-home pay depends on your country's tax rules, so check an official tax calculator for net pay.</p>

<h2>Comparing job offers</h2>
<p>When you compare two jobs, convert both to the same period and the same hours. A higher hourly rate can still earn less per year if it comes with fewer guaranteed hours or unpaid holidays. Also look beyond pay: pension contributions, health insurance, bonuses, overtime rates, commuting costs and remote-work days can be worth thousands a year.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I convert hourly pay to a yearly salary?',
      <<<'EOT_TF'
Multiply the hourly rate by your hours per week and paid weeks per year. At 40 hours and 52 weeks, multiply by 2,080.
EOT_TF,
    ],
    ['What is 50,000 a year per hour?', 'About 24.04 an hour for a 40-hour week with 52 paid weeks.'],
    [
      'How many working hours are in a year?',
      'About 2,080 for a 40-hour week, or 1,950 for a 37.5-hour week, with 52 paid weeks.',
    ],
    ['How do I convert yearly salary to monthly?', 'Divide the yearly salary by 12.'],
    [
      'Is this before or after tax?',
      'Before tax. Take-home pay depends on your country’s tax and deductions.',
    ],
  ],
];
