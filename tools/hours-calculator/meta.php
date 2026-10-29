<?php
// Hours Calculator: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Hours Calculator',
  'updated' => '2026-10-26', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'time',
  'order' => 6,
  'popular' => true,
  'icon' => 'clock-3',
  'keywords' => 'hours calculator time card calculator work hours calculator timesheet calculator hours worked overtime calculator decimal hours',
  'short' => 'Add up hours worked in a day or week, with breaks, overtime and pay.',
  'title' => 'Hours Calculator: Add Up Work Hours and Pay',
  'description' => <<<'EOT_TF'
Work out hours worked between two times or for a whole week, with breaks and overtime. Get the total in hours and decimals, plus your pay. A free time card.
EOT_TF,
  'related' => ['salary-converter', 'freelance-rate-calculator', 'stopwatch', 'what-week-is-it'],
  'answer' => <<<'EOT_TF'
Enter a start and end time for each day you worked and any unpaid break. The calculator adds up the <strong>total hours</strong> (as hours and minutes and as a decimal for payroll), handles shifts past midnight, splits off <strong>overtime</strong> after the weekly limit you set, and works out your <strong>pay</strong> if you add an hourly rate.
EOT_TF,
  'article' => <<<'EOT_TF'
<h2>How to calculate hours worked</h2>
<ol>
<li>Enter the start and finish time for each day. Leave a day empty if you didn’t work.</li>
<li>Enter unpaid breaks in minutes (for example 30 for a lunch break).</li>
<li>Optionally add your hourly rate, the weekly hours after which overtime starts, and the overtime rate.</li>
</ol>
<p>Each day’s hours are <code>finish − start − break</code>. If the finish time is earlier than the start, the shift is treated as running past midnight (for example 10 pm to 6 am is 8 hours).</p>

<h2>Converting minutes to decimal hours</h2>
<p>Payroll systems use decimal hours, so 7 hours 45 minutes is 7.75 hours, not 7.45. Divide the minutes by 60:</p>
<div class="scroll"><table class="tbl"><thead><tr><th>Minutes</th><th>Decimal</th><th>Minutes</th><th>Decimal</th></tr></thead><tbody>
<tr><td>5</td><td>0.08</td><td>35</td><td>0.58</td></tr>
<tr><td>10</td><td>0.17</td><td>40</td><td>0.67</td></tr>
<tr><td>15</td><td>0.25</td><td>45</td><td>0.75</td></tr>
<tr><td>20</td><td>0.33</td><td>50</td><td>0.83</td></tr>
<tr><td>25</td><td>0.42</td><td>55</td><td>0.92</td></tr>
<tr><td>30</td><td>0.50</td><td>60</td><td>1.00</td></tr>
</tbody></table></div>

<h2>Overtime</h2>
<p>In the US, the Fair Labor Standards Act requires overtime of at least 1.5× the regular rate for non-exempt employees after 40 hours in a work week. Some US states (such as California) also count overtime per day, and other countries have their own rules or none at all. Set the weekly limit and rate to match your contract; the calculator puts hours above the limit into overtime.</p>

<h2>Your timesheet is saved</h2>
<p>Your entries are kept in your browser, so you can fill in the week day by day. Click <strong>Clear week</strong> to start a new one. Nothing is sent to a server.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I calculate my hours worked?',
      <<<'EOT_TF'
Subtract the start time from the finish time and take off unpaid breaks. For 8:30 am to 5:15 pm with a 30-minute break, that’s 8 hours 45 minutes minus 30 minutes = 8 hours 15 minutes, or 8.25 hours.
EOT_TF,
    ],
    [
      'How do I convert hours and minutes to decimal?',
      <<<'EOT_TF'
Divide the minutes by 60 and add them to the hours. 7 hours 20 minutes is 7 + 20 ÷ 60 = 7.33 hours.
EOT_TF,
    ],
    [
      'Does it work for night shifts?',
      <<<'EOT_TF'
Yes. If the finish time is earlier than the start time, the shift is counted as going past midnight.
EOT_TF,
    ],
    [
      'How is overtime calculated?',
      <<<'EOT_TF'
Hours above the weekly limit you set (40 by default) are paid at the overtime rate (1.5× by default). Change both to match your job.
EOT_TF,
    ],
    [
      'Is my timesheet saved?',
      <<<'EOT_TF'
Yes, in your browser on this device, so you can come back and add days during the week.
EOT_TF,
    ],
  ],
];
