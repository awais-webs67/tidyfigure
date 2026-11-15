<?php
return [
    'name' => 'Ovulation Calculator',
    'updated' => '2026-11-15',
    'category' => 'health',
    'order' => 8,
    'icon' => 'calendar-heart',
    'appCategory' => 'HealthApplication',
    'keywords' => 'ovulation calculator, fertile window calculator, when do i ovulate, fertility calendar, cycle tracker calculator',
    'short' => 'Your fertile window and likely ovulation date for the next few cycles.',
    'title' => 'Ovulation Calculator – Fertile Days & Calendar',
    'description' => 'Estimate ovulation day, your 6-day fertile window and next four menstrual cycle dates from last period start and average cycle length privately.',
    'related' => ['pregnancy-due-date-calculator', 'days-between-dates', 'water-intake-calculator'],
    'answer' => 'Ovulation usually happens about <strong>14 days before your next period</strong>, so on day 14 of a 28-day cycle or day 18 of a 32-day cycle. Your <strong>fertile window</strong> is the five days before ovulation plus the day of ovulation, because sperm can survive up to five days. Enter your dates to see your next four fertile windows.',
    'sources' => [
        ['ACOG – Evaluating Infertility & Predicting Ovulation', 'https://www.acog.org/womens-health/faqs/evaluating-infertility'],
        ['NHS – Trying to Get Pregnant & Fertile Window', 'https://www.nhs.uk/pregnancy/trying-for-a-baby/trying-to-get-pregnant/'],
    ],
    'article' => <<<'EOT_TF'
<h2>How the calculator works</h2>
<div class="formula">Ovulation day   = first day of period + cycle length − 14
Fertile window  = 5 days before ovulation → 1 day after
Next period     = first day of period + cycle length</div>
<p>The second half of the cycle (the luteal phase, from ovulation to the next period) is fairly constant at around 12–16 days, while the first half varies more. That's why ovulation is counted back from the next expected period rather than forward from the last one.</p>

<h2>Why the fertile window is six days</h2>
<p>An egg survives for about 12–24 hours after it's released, but sperm can live for up to five days in the body. So sex in the five days before ovulation can still lead to pregnancy, and the two to three days just before ovulation are the most fertile of all.</p>

<h2>Signs of ovulation</h2>
<ul>
<li><strong>Cervical mucus</strong> becomes clear, slippery and stretchy, like raw egg white.</li>
<li><strong>Basal body temperature</strong> rises by about 0.2–0.5 °C after ovulation and stays up until your period.</li>
<li><strong>Ovulation predictor kits</strong> detect the LH surge 24–36 hours before ovulation.</li>
<li>Some people notice mild one-sided pain (mittelschmerz) or breast tenderness.</li>
</ul>

<h2>Irregular cycles</h2>
<p>If your cycle length varies by more than a week, calendar estimates become unreliable. Use the average of your last few cycles, and combine it with ovulation tests or temperature tracking. Very irregular cycles can have medical causes, such as PCOS or thyroid problems, so it's worth mentioning to a doctor.</p>

<h2>Important</h2>
<p>Calendar methods alone aren't reliable contraception. If you've been trying to conceive for a year (or six months if you're over 35) without success, talk to your doctor. Your dates are calculated in your browser and never stored or sent anywhere.</p>

<h2>Understanding the Luteal Phase &amp; Cycle Variability</h2>
<p>While follicular phase length (before ovulation) changes frequently due to stress, travel or sleep, the luteal phase (after ovulation until the next period) stays remarkably consistent for most people at roughly 12–16 days (averaging 14 days). Because sperm survive up to 5 days inside cervical mucus while an egg remains viable for 12–24 hours, fertility peaks in the two days immediately before ovulation.</p>

<h2>Combining Calendar Estimates With Physical Tracking</h2>
<p>Pair predicted cycle dates with cervical mucus checks (clear, stretchy consistency near ovulation) or urinary LH surge test strips to catch natural cycle shifts in real time.</p>
EOT_TF,
    'faqs' => [
        ['When do I ovulate?', 'Usually about 14 days before your next period. In a 28-day cycle that’s around day 14.'],
        ['How many days am I fertile each month?', 'About six: the five days before ovulation and the day of ovulation.'],
        ['Can I get pregnant right after my period?', 'It’s possible with short cycles, because sperm can survive up to five days and you may ovulate early.'],
        ['Is an ovulation calculator accurate?', 'It gives a good estimate for regular cycles, but ovulation can vary. Ovulation tests are more precise.'],
        ['Can I use this as birth control?', 'No. Calendar estimates alone are not reliable enough to prevent pregnancy.'],
    ],
    'aka' => ['Fertile Window Calculator', 'Cycle & Ovulation Calendar'],
];
