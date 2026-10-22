module.exports = {
  order: 4,
  category: 'time',
  icon: 'calendar-range',
  name: 'Days Between Dates',
  keywords: 'date calculator how many days until count days business days add days to date',
  short: 'Count the days between two dates, or add and subtract days from a date.',
  title: 'Days Between Dates Calculator: Count Days, Weeks & Weekdays',
  description: 'Count the days between two dates, with weeks, months and weekdays. Or add or subtract days and business days from any date. Free date calculator.',
  related: ['age-calculator', 'online-timer', 'loan-calculator'],
  answer: `Subtract the earlier date from the later one to get the number of days between them. By default the start date is counted and the end date isn't (1 to 2 June is <strong>1 day</strong>); tick "include the end date" to count both (<strong>2 days</strong>), as you would for a hotel stay's calendar days or an event. You also get weeks, months and weekdays.`,
  article: `
<h2>Two ways to count days</h2>
<p>"How many days between Monday and Friday?" has two right answers, depending on what you're counting:</p>
<ul>
<li><strong>Elapsed days (default): 4.</strong> The time that passes from the start of Monday to the start of Friday. Use this for deadlines, ages, countdowns and "how long until".</li>
<li><strong>Calendar days, both included: 5.</strong> Every date you'd tick off on a calendar. Use this for holiday leave, event durations, rental days and medication courses.</li>
</ul>

<h2>Weekdays and business days</h2>
<p>The weekday count includes Monday to Friday and leaves out Saturdays and Sundays. It doesn't know about public holidays, because they differ by country, region and year, so subtract any holidays that fall in your range yourself.</p>
<p>In "Add or subtract days" mode, ticking "business days only" skips weekends, so 5 business days after a Friday is the next Friday. This is how many delivery times, notice periods and payment terms are counted.</p>

<h2>How months are counted</h2>
<p>Months have 28 to 31 days, so "months and days" counts calendar months from the start date. From 31 January, one month later is the last day of February. From 15 March to 20 May is 2 months and 5 days.</p>

<h2>Common date calculations</h2>
<div class="scroll"><table class="tbl">
<thead><tr><th>Question</th><th>How to set it up</th></tr></thead>
<tbody>
<tr><td>How many days until my holiday?</td><td>Start: today. End: the first day of the holiday.</td></tr>
<tr><td>What date is 90 days from today?</td><td>Add mode, 90 days. Useful for visas, warranties and notice periods.</td></tr>
<tr><td>When is 30 business days from now?</td><td>Add mode, 30, business days ticked.</td></tr>
<tr><td>How long was a project?</td><td>Start and end dates, include the end date.</td></tr>
<tr><td>How many days ago was a date?</td><td>Add mode with a negative number, or put that date as the start and today as the end.</td></tr>
</tbody></table></div>

<h2>Leap years and time zones</h2>
<p>All calculations use whole calendar dates, so leap days (29 February) are counted correctly and changes to daylight saving time can't make the answer off by one. A year has 365 days, or 366 in a leap year: every year divisible by 4, except century years not divisible by 400 (2000 was a leap year; 2100 won't be).</p>`,
  faqs: [
    ['How do I calculate the number of days between two dates?', 'Enter the start and end dates. The calculator subtracts them and shows the days, weeks, months and weekdays in between.'],
    ['Does the day count include the start and end date?', 'By default it counts the start date but not the end date. Tick “Include the end date” to count both.'],
    ['How many weekdays are between two dates?', 'The calculator shows weekdays (Monday to Friday) separately. Public holidays are not removed because they vary by country.'],
    ['What date is 90 days from today?', 'Choose “Add or subtract days”, keep today as the start date and enter 90.'],
    ['How do I subtract days from a date?', 'In “Add or subtract days” mode, enter a negative number, such as −30.'],
  ],
};
