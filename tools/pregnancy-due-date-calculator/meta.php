<?php
// Pregnancy Due Date Calculator: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Pregnancy Due Date Calculator',
  'category' => 'health',
  'order' => 7,
  'icon' => 'baby',
  'popular' => true,
  'appCategory' => 'HealthApplication',
  'keywords' => 'due date calculator pregnancy weeks how far along am i conception date ivf due date',
  'short' => 'Due date, how many weeks pregnant you are, and key milestones.',
  'title' => 'Due Date Calculator: When Is My Baby Due?',
  'description' => <<<'EOT_TF'
Calculate your due date from your last period, conception date or IVF transfer. See how many weeks pregnant you are, your trimester and key milestones.
EOT_TF,
  'related' => ['ovulation-calculator', 'days-between-dates', 'water-intake-calculator'],
  'answer' => <<<'EOT_TF'
Your estimated due date is <strong>280 days (40 weeks) after the first day of your last period</strong>, adjusted if your cycle is longer or shorter than 28 days. You can also calculate from a known conception date (266 days later) or an IVF transfer. The result shows how far along you are today and the key dates ahead.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>How due dates are calculated</h2>
<p>Pregnancy is counted from the first day of your last menstrual period (LMP), about two weeks before conception actually happens. This is called Naegele's rule:</p>
<div class="formula">Due date = first day of last period + 280 days (40 weeks)
Longer or shorter cycle: add or subtract the difference from 28 days
From conception: conception date + 266 days
IVF day-5 transfer: transfer date + 261 days
IVF day-3 transfer: transfer date + 263 days</div>
<p>So if your last period started on 1 March, your estimated due date is around 6 December. With a 32-day cycle you probably ovulated four days later than average, so the date moves four days later too.</p>

<h2>How accurate is it?</h2>
<p>A due date is an estimate. Only about 4% of babies are born on the exact day; most arrive in the two weeks either side. An ultrasound "dating scan" between 10 and 14 weeks measures the baby and is the most accurate way to date a pregnancy, so your doctor or midwife may change your due date after it.</p>

<h2>Trimesters</h2>
<ul>
<li><strong>First trimester (weeks 1–13):</strong> the baby's organs form; nausea and tiredness are common.</li>
<li><strong>Second trimester (weeks 14–27):</strong> often the most comfortable stage; you'll usually feel the first movements between 16 and 24 weeks.</li>
<li><strong>Third trimester (weeks 28–40+):</strong> the baby gains most of its weight. "Full term" begins at 37 weeks.</li>
</ul>

<h2>Week counting explained</h2>
<p>"12 weeks 3 days" means 12 full weeks and 3 days since your last period started. Because counting starts before conception, you're considered about 4 weeks pregnant when your period is first late.</p>

<h2>Next steps</h2>
<p>If you think you're pregnant, contact your doctor or midwife to arrange antenatal care, and start taking folic acid if you haven't already. This calculator gives general information and isn't a substitute for professional care.</p>
EOT_TF,
  'faqs' => [
    [
      'How is my due date calculated?',
      'By adding 280 days (40 weeks) to the first day of your last period, adjusted for your cycle length.',
    ],
    [
      'How many weeks pregnant am I?',
      <<<'EOT_TF'
Enter the first day of your last period. The calculator shows how many weeks and days pregnant you are today.
EOT_TF,
    ],
    [
      'Can I calculate my due date from conception?',
      'Yes. Choose “Conception date”. The due date is 266 days after conception.',
    ],
    [
      'How do I calculate an IVF due date?',
      <<<'EOT_TF'
Choose the IVF option and enter the transfer date: add 261 days for a day-5 transfer or 263 days for a day-3 transfer.
EOT_TF,
    ],
    [
      'Is my due date accurate?',
      <<<'EOT_TF'
It’s an estimate. Most babies are born between 38 and 42 weeks, and an early ultrasound gives the most accurate date.
EOT_TF,
    ],
  ],
];
