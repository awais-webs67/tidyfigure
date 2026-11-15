<?php
return [
    'name' => 'What Week Is It',
    'updated' => '2026-11-15',
    'category' => 'time',
    'order' => 5,
    'icon' => 'calendar-days',
    'keywords' => 'what week is it, current week number iso 8601, week of the year calendar, find week number for date',
    'short' => 'Today’s week number, and every week of the year with its dates.',
    'title' => 'What Week Is It? – Today’s ISO & US Week #',
    'description' => 'See the current ISO-8601 and US week number, exact Monday–Sunday date span, full year week calendar and week lookup for any past or future date.',
    'related' => ['days-between-dates', 'countdown', 'age-calculator', 'hours-calculator'],
    'answer' => 'The big number is <strong>this week’s ISO week number</strong>, used in Europe and most of the world, where weeks start on Monday and week 1 is the week with the year’s first Thursday. The US-style number (weeks starting on Sunday, week 1 contains 1 January) is shown too, with this week’s dates and a list of every week in the year.',
    'article' => <<<'EOT_TF'
<h2>Two ways to number weeks</h2>
<ul>
<li><strong>ISO 8601 (Europe, Asia, international business):</strong> weeks start on Monday. Week 1 is the week that contains the year’s first Thursday, which is the same as the week containing 4 January. A year has 52 or 53 weeks, and the first days of January can belong to the last week of the previous year.</li>
<li><strong>US system:</strong> weeks start on Sunday, and week 1 is the week that contains 1 January. The last days of December can fall in week 1 of the next year.</li>
</ul>
<p>Most of the time the two numbers are the same or differ by one. When someone says “week 12”, check which system their calendar uses.</p>

<h2>Which years have 53 weeks?</h2>
<p>An ISO year has 53 weeks when it starts on a Thursday, or on a Wednesday in a leap year. Recent and upcoming 53-week years are 2015, 2020, 2026, 2032 and 2037. Payroll and retail calendars sometimes need an extra pay period or a “53rd week” in these years.</p>

<h2>Where week numbers are used</h2>
<ul>
<li>Project planning and sprints (“deliver in week 42”)</li>
<li>Payroll, shift rotas and school timetables</li>
<li>Shipping, manufacturing and retail reporting</li>
<li>Diaries and planners in Europe, which print the week number on each page</li>
</ul>

<h2>Find the week of any date</h2>
<p>Pick a date to see its week number, or change the year to list every week with its start and end dates. In Excel or Google Sheets, <code>=ISOWEEKNUM(A1)</code> gives the ISO week and <code>=WEEKNUM(A1)</code> the US week.</p>

<h2>Why January 1 Sometimes Falls in Week 52 or 53</h2>
<p>Under international ISO-8601 rules, Week 1 is always the week containing the year’s first Thursday (equivalently January 4). Whenever January 1 lands on a Friday, Saturday or Sunday, those opening calendar days still belong to Week 52 or 53 of the previous ISO year.</p>
EOT_TF,
    'faqs' => [
        ['What week number is it today?', 'Today’s ISO week number is shown in large type at the top of this page, along with the US-style week number and this week’s dates.'],
        ['When does week 1 start?', 'In the ISO system, week 1 is the week (Monday to Sunday) that contains the year’s first Thursday. In the US system, it’s the week (Sunday to Saturday) that contains 1 January.'],
        ['How many weeks are in a year?', '52 weeks and 1 day (2 in a leap year). ISO years therefore have 52 or 53 numbered weeks.'],
        ['Why do the ISO and US week numbers differ?', 'They start weeks on different days and define week 1 differently, so the numbers can be one apart, especially at the start and end of the year.'],
        ['How do I get the week number in Excel?', 'Use =ISOWEEKNUM(date) for the ISO week or =WEEKNUM(date) for the US-style week.'],
        ['Why do North American and European calendars sometimes disagree on week numbers?', 'US scheduling typically starts Week 1 on Sunday January 1, whereas Europe and ISO-8601 start weeks on Monday using the first-Thursday rule.'],
    ],
    'aka' => ['Current Week Number Lookup', 'ISO-8601 Week Calendar'],
];
