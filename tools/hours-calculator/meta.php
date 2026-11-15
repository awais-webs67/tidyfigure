<?php
return [
    'name' => 'Hours Calculator',
    'updated' => '2026-11-15',
    'category' => 'time',
    'order' => 6,
    'popular' => true,
    'icon' => 'clock-3',
    'keywords' => 'hours calculator, work hours timesheet calculator, decimal hours pay, calculate overtime hours',
    'short' => 'Add up hours worked in a day or week, with breaks, overtime and pay.',
    'title' => 'Hours Calculator – Timesheet, Breaks & Pay',
    'description' => 'Add shift start and end times minus unpaid breaks across an entire week, calculate decimal hours and estimate regular plus overtime wages.',
    'related' => ['salary-converter', 'freelance-rate-calculator', 'stopwatch', 'what-week-is-it'],
    'answer' => 'Enter a start and end time for each day you worked and any unpaid break. The calculator adds up the <strong>total hours</strong> (as hours and minutes and as a decimal for payroll), handles shifts past midnight, splits off <strong>overtime</strong> after the weekly limit you set, and works out your <strong>pay</strong> if you add an hourly rate.',
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

<h2>Converting Clock Minutes to Decimal Hours for Payroll</h2>
<p>Multiplying <code>7 hours 45 minutes</code> directly as <code>7.45</code> underpays shifts sharply! Because 45 minutes equals <code>45 ÷ 60 = 0.75</code> hours, payroll software expects <code>7.75 hours</code>—our calculator converts minutes to clean two-decimal payroll figures alongside gross overtime totals.</p>

<h2>Rounding 15-Minute vs Exact Minute Timesheets</h2>
<p>Keep exact raw totals to the nearest minute when logging billable freelance consulting blocks or double-check whether your employer rounds clock-ins to the nearest quarter-hour before invoicing weekly hours.</p>
EOT_TF,
    'faqs' => [
        ['How do I calculate my hours worked?', 'Subtract the start time from the finish time and take off unpaid breaks. For 8:30 am to 5:15 pm with a 30-minute break, that’s 8 hours 45 minutes minus 30 minutes = 8 hours 15 minutes, or 8.25 hours.'],
        ['How do I convert hours and minutes to decimal?', 'Divide the minutes by 60 and add them to the hours. 7 hours 20 minutes is 7 + 20 ÷ 60 = 7.33 hours.'],
        ['Does it work for night shifts?', 'Yes. If the finish time is earlier than the start time, the shift is counted as going past midnight.'],
        ['How is overtime calculated?', 'Hours above the weekly limit you set (40 by default) are paid at the overtime rate (1.5× by default). Change both to match your job.'],
        ['Is my timesheet saved?', 'Yes, in your browser on this device, so you can come back and add days during the week.'],
        ['Does the hours calculator handle overnight night shifts?', 'Yes. When an out-time falls earlier on the clock than the in-time (such as 10:00 PM to 6:30 AM), it wraps cleanly past midnight.'],
        ['Are my entered shifts saved when I refresh the page?', 'Yes. Entries save in your browser\'s local storage automatically so your weekly timesheet remains private on your own device across tabs.'],
    ],
    'aka' => ['Work Hours & Payroll Calculator', 'Weekly Timesheet Adder'],
];
