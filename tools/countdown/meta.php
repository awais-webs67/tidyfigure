<?php
// Countdown to a Date: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Countdown to a Date',
  'category' => 'time',
  'order' => 2,
  'popular' => true,
  'icon' => 'hourglass',
  'keywords' => 'countdown timer to date days until countdown clock event countdown how many days until christmas new year birthday countdown share',
  'short' => 'A live countdown to any date or holiday, with a link to share.',
  'title' => 'Countdown Timer to Any Date: Make and Share Yours',
  'description' => <<<'EOT_TF'
Count down the days, hours, minutes and seconds to any date: Christmas, New Year, Ramadan, a birthday, a trip or an exam. Share a live countdown link. Free.
EOT_TF,
  'related' => ['days-between-dates', 'online-timer', 'age-calculator', 'time-zone-converter'],
  'answer' => <<<'EOT_TF'
Type an event name, pick the date (and time if you like) or tap a holiday, and the countdown starts straight away, showing <strong>days, hours, minutes and seconds</strong>. Click <strong>Copy share link</strong> to send a live countdown to friends: the link opens this page with your event already set.
EOT_TF,
  'article' => <<<'EOT_TF'
<h2>How to make a countdown</h2>
<ol>
<li>Type what you’re counting down to, such as “Trip to Istanbul” or “Final exams”.</li>
<li>Pick the date, and a time if it matters. Without a time, the countdown runs to midnight at the start of that day.</li>
<li>Or tap a holiday: the date is filled in for the next one, including moving holidays like Easter, Thanksgiving and Ramadan.</li>
<li>Click <strong>Copy share link</strong> and send it in WhatsApp, email or a group chat. Anyone who opens it sees the same live countdown in their own time zone.</li>
</ol>

<h2>Holidays with moving dates</h2>
<ul>
<li><strong>Easter</strong> falls on the first Sunday after the first full moon on or after 21 March, so it moves between 22 March and 25 April.</li>
<li><strong>US Thanksgiving</strong> is the fourth Thursday of November, and <strong>Black Friday</strong> the day after.</li>
<li><strong>Mother’s Day</strong> (US, Canada, Pakistan, India) is the second Sunday of May; <strong>Father’s Day</strong> the third Sunday of June. The UK celebrates Mothering Sunday in March.</li>
<li><strong>Ramadan and Eid</strong> follow the Islamic lunar calendar and arrive about 11 days earlier each year. The dates shown use the Umm al-Qura calendar; the actual start can shift by a day depending on the moon sighting where you live.</li>
</ul>

<h2>Ideas for countdowns</h2>
<ul>
<li>Birthdays, anniversaries and weddings</li>
<li>Holidays, trips and the end of the school year</li>
<li>Exams, deadlines, launches and project milestones</li>
<li>Retirement, a baby’s due date or a moving day</li>
<li>Sports events, concerts and game releases</li>
</ul>

<h2>Counting days</h2>
<p>The large number shows complete days left. The table under it shows the same time in weeks, total hours and minutes, plus the number of working days (Monday to Friday). For the number of days between any two dates, use the <a href="/days-between-dates">days between dates calculator</a>.</p>
EOT_TF,
  'faqs' => [
    [
      'How many days until Christmas?',
      <<<'EOT_TF'
Tap Christmas in the holiday list and the countdown shows the exact days, hours, minutes and seconds left until 25 December.
EOT_TF,
    ],
    [
      'Can I share my countdown?',
      <<<'EOT_TF'
Yes. Click Copy share link and send it. The link opens this page with your event name and date already set.
EOT_TF,
    ],
    [
      'Which time zone does the countdown use?',
      <<<'EOT_TF'
Your device’s time zone. A shared link counts down to the same moment for everyone, shown in each person’s local time.
EOT_TF,
    ],
    [
      'How are Ramadan and Eid dates worked out?',
      <<<'EOT_TF'
From the Umm al-Qura Islamic calendar built into your browser. The real start may differ by a day depending on the local moon sighting.
EOT_TF,
    ],
    [
      'Does the countdown keep running if I close the page?',
      <<<'EOT_TF'
The countdown is worked out from the date, so it’s always right when you open the page or your share link again.
EOT_TF,
    ],
  ],
];
