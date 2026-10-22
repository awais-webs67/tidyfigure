<?php
// Cron Expression Generator: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Cron Expression Generator',
  'category' => 'dev',
  'order' => 7,
  'icon' => 'calendar-clock',
  'keywords' => <<<'EOT_TF'
cron expression generator crontab guru cron schedule explain cron next run time every 5 minutes cron syntax
EOT_TF,
  'short' => 'Build or explain cron schedules in plain English, with the next run times.',
  'title' => 'Cron Expression Generator & Explainer, with Next Run Times',
  'description' => <<<'EOT_TF'
Write or paste a cron expression to see what it means in plain English and the next 8 run times. Presets and builder for crontab, Kubernetes and GitHub Actions.
EOT_TF,
  'related' => ['regex-tester', 'days-between-dates', 'online-timer'],
  'answer' => <<<'EOT_TF'
A cron expression has five fields: <strong>minute hour day-of-month month day-of-week</strong>. <code>30 9 * * 1-5</code> means "at 9:30 am, Monday to Friday", and <code>*/5 * * * *</code> means every 5 minutes. Type or build an expression below to see it in plain English and the next times it will run.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>Cron syntax</h2>
<div class="formula">┌───────────── minute (0–59)
│ ┌─────────── hour (0–23)
│ │ ┌───────── day of month (1–31)
│ │ │ ┌─────── month (1–12 or JAN–DEC)
│ │ │ │ ┌───── day of week (0–6, Sunday = 0 or 7, or SUN–SAT)
│ │ │ │ │
30 9 * * 1-5   → 09:30 every weekday</div>

<h2>Special characters</h2>
<div class="scroll"><table class="tbl">
<thead><tr><th>Symbol</th><th>Meaning</th><th>Example</th></tr></thead>
<tbody>
<tr><td class="mono">*</td><td>Every value</td><td class="mono">* in hour = every hour</td></tr>
<tr><td class="mono">,</td><td>A list</td><td class="mono">0,30 = at :00 and :30</td></tr>
<tr><td class="mono">-</td><td>A range</td><td class="mono">1-5 = Monday to Friday</td></tr>
<tr><td class="mono">/</td><td>Every n-th value</td><td class="mono">*/15 = every 15 minutes</td></tr>
<tr><td class="mono">@daily etc.</td><td>Shortcuts</td><td class="mono">@hourly, @daily, @weekly, @monthly, @yearly</td></tr>
</tbody></table></div>

<h2>Common schedules</h2>
<div class="scroll"><table class="tbl">
<thead><tr><th>Expression</th><th>Runs</th></tr></thead>
<tbody>
<tr><td class="mono">*/5 * * * *</td><td>Every 5 minutes</td></tr>
<tr><td class="mono">0 * * * *</td><td>At the start of every hour</td></tr>
<tr><td class="mono">0 0 * * *</td><td>Every day at midnight</td></tr>
<tr><td class="mono">0 9 * * 1</td><td>Every Monday at 9:00</td></tr>
<tr><td class="mono">0 0 1 * *</td><td>At midnight on the 1st of every month</td></tr>
<tr><td class="mono">0 */6 * * *</td><td>Every 6 hours (00:00, 06:00, 12:00, 18:00)</td></tr>
<tr><td class="mono">15 14 1 * *</td><td>At 14:15 on the 1st of each month</td></tr>
<tr><td class="mono">0 22 * * 1-5</td><td>At 10 pm on weekdays</td></tr>
</tbody></table></div>

<h2>The day-of-month and day-of-week rule</h2>
<p>When <em>both</em> day fields are restricted, standard cron runs when <strong>either</strong> one matches, not both. <code>0 0 13 * 5</code> runs on every 13th <em>and</em> every Friday, not only on Friday the 13th. The next-run list above follows this rule, so you can check what will really happen.</p>

<h2>Where cron expressions are used</h2>
<ul>
<li><strong>Linux crontab:</strong> edit with <code>crontab -e</code>, then a line like <code>30 9 * * 1-5 /home/me/backup.sh</code>.</li>
<li><strong>GitHub Actions:</strong> <code>on: schedule: - cron: '30 9 * * 1-5'</code>. Always UTC, and runs can be delayed at busy times.</li>
<li><strong>Kubernetes CronJobs</strong>, <strong>cPanel cron jobs</strong>, cloud schedulers and CI tools.</li>
</ul>
<p>Some systems add extras: Quartz and Spring use a 6th field for seconds and support <code>L</code> (last), <code>W</code> (weekday) and <code>#</code> (nth weekday). The checker here follows standard 5-field cron and tells you if it sees those extensions.</p>

<h2>Time zones</h2>
<p>Cron runs in the server's time zone, which is very often UTC. A job set for <code>0 9 * * *</code> on a UTC server runs at 9:00 UTC: that's 10:00 in London in winter, 4 or 5 am in New York, and 2:30 pm in India. The next runs above are shown in your own time zone, so if your server uses UTC, adjust the hour.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I run a cron job every 5 minutes?',
      'Use */5 * * * *. The */5 in the minute field means every fifth minute.',
    ],
    ['What does * * * * * mean in cron?', 'Run every minute of every hour of every day.'],
    [
      'What time zone does cron use?',
      'The server’s time zone, often UTC. GitHub Actions schedules always use UTC.',
    ],
    ['Is Sunday 0 or 7 in cron?', 'Both. 0 and 7 both mean Sunday in standard cron.'],
    [
      'Why does my cron run on more days than expected?',
      <<<'EOT_TF'
If both day-of-month and day-of-week are set, cron runs when either matches. Set one of them to * to limit it.
EOT_TF,
    ],
  ],
];
