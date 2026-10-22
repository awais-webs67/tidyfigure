module.exports = {
  order: 3,
  category: 'time',
  icon: 'cake',
  popular: true,
  name: 'Age Calculator',
  keywords: 'how old am i date of birth age in days months next birthday',
  short: 'Exact age in years, months and days, plus your next birthday.',
  title: 'Age Calculator: How Old Am I in Years, Months & Days?',
  description: 'Calculate exact age from date of birth in years, months and days, plus total months, weeks, days and hours. See the day you were born and your next birthday.',
  related: ['days-between-dates', 'online-timer', 'percentage-calculator'],
  answer: `Your age is the number of <strong>full years</strong> since your date of birth, then the full months since your last birthday, then the remaining days. Enter a date of birth to see your exact age, your age in total months, weeks, days and hours, the weekday you were born, and how many days until your next birthday.`,
  article: `
<h2>How age is calculated</h2>
<p>Age is counted in completed units, the same way you'd count it on your fingers:</p>
<ol>
<li><strong>Years:</strong> the number of birthdays you've had. If this year's birthday hasn't happened yet, it's one fewer than the difference between the two years.</li>
<li><strong>Months:</strong> the number of whole months since your last birthday, counting from the same day of each month.</li>
<li><strong>Days:</strong> the days left over since the last of those monthly dates.</li>
</ol>
<div class="formula">Born 15 June 1995, measured on 22 October 2026
Years:  last birthday 15 June 2026 → 31 years
Months: 15 Jul, 15 Aug, 15 Sep, 15 Oct → 4 months
Days:   15 Oct → 22 Oct → 7 days
Age:    31 years, 4 months and 7 days</div>
<p>Totals in days, weeks and hours count every calendar day, including leap days.</p>

<h2>Born on 29 February?</h2>
<p>If you were born on a leap day, your birthday only appears on the calendar every four years. In most countries the law treats you as turning a year older on 28 February in common years (some use 1 March). This calculator uses 28 February, which is the most common convention.</p>

<h2>Age in different cultures</h2>
<p>This calculator uses the international system, where you're 0 at birth and gain a year on each birthday. Traditional East Asian age reckoning counts a baby as 1 at birth and adds a year at the New Year; South Korea officially switched to the international system for legal purposes in 2023.</p>

<h2>Uses for an age calculator</h2>
<ul>
<li><strong>Forms and applications</strong> that ask for age on a specific date, such as a school entry cut-off, an exam or a job application deadline. Change "Age on this date" to that date.</li>
<li><strong>Babies and toddlers:</strong> paediatricians track age in months (and weeks) until age 2.</li>
<li><strong>Milestones:</strong> find out when you'll be 10,000 days old (about 27 years 4 months) or 1,000,000 hours (114 years, so maybe not).</li>
<li><strong>Retirement and pensions:</strong> check your exact age on a future date.</li>
<li><strong>Pets:</strong> enter your pet's adoption or birth date.</li>
</ul>`,
  faqs: [
    ['How do I calculate my exact age?', 'Count the full years since your birth date, then the full months since your last birthday, then the days left over. Enter your date of birth above to get it instantly.'],
    ['How old will I be on a certain date?', 'Change “Age on this date” to the future date. The calculator shows your exact age on that day.'],
    ['How many days old am I?', 'The calculator shows your age in total days, counting every day including leap days, along with weeks, months and hours.'],
    ['How is age calculated for someone born on 29 February?', 'In common years the birthday is treated as 28 February, which is the convention used in most countries.'],
    ['What day of the week was I born?', 'The calculator shows the weekday of your date of birth under the results.'],
  ],
};
