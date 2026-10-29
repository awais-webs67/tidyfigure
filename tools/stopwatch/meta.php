<?php
// Stopwatch: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Stopwatch',
  'updated' => '2026-10-22', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'time',
  'order' => 2,
  'icon' => 'timer-reset',
  'keywords' => 'online stopwatch lap timer split times',
  'short' => 'An accurate online stopwatch with lap times and keyboard shortcuts.',
  'title' => 'Online Stopwatch With Lap Times, Free & Accurate',
  'description' => <<<'EOT_TF'
Free online stopwatch accurate to 1/100 of a second. Record lap and split times, see your fastest lap, and use keyboard shortcuts. Works on any device.
EOT_TF,
  'related' => ['online-timer', 'days-between-dates', 'age-calculator'],
  'answer' => <<<'EOT_TF'
Press <strong>Start</strong> (or the space bar) to begin timing and again to stop. Press <strong>Lap</strong> (or L) to record a split without stopping the clock: each lap shows its own time and the running total, with your fastest and slowest laps marked. The stopwatch shows hundredths of a second.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>How to use the stopwatch</h2>
<ul>
<li><strong>Start / Stop:</strong> click the button or press the space bar. Stopping pauses the time; press again to resume.</li>
<li><strong>Lap:</strong> click Lap or press L while running to record a split.</li>
<li><strong>Reset:</strong> click Reset or press R to clear the time and laps.</li>
</ul>

<h2>Lap time versus split time</h2>
<p>Two terms often get mixed up. A <strong>lap time</strong> is how long one lap took on its own. A <strong>split time</strong> (shown here as "Total") is the total elapsed time when that lap ended. If you run three laps in 1:10, 1:05 and 1:12, your lap times are those three numbers, and your splits are 1:10, 2:15 and 3:27. The table shows both, with the newest lap at the top.</p>

<h2>How accurate is it?</h2>
<p>The stopwatch uses the browser's high-resolution clock (<code>performance.now</code>), which measures time to a fraction of a millisecond and isn't affected by changes to your computer's clock. The display shows hundredths of a second. In practice, the biggest source of error is human reaction time: pressing a button takes most people 0.15–0.25 seconds. Hand timing is fine for training and everyday use; official races use electronic timing.</p>

<h2>Uses for an online stopwatch</h2>
<ul>
<li><strong>Running and swimming:</strong> time laps around a track or lengths of a pool.</li>
<li><strong>Workouts:</strong> time intervals, rest periods and circuits.</li>
<li><strong>Presentations:</strong> rehearse a talk and see how long each section takes using laps.</li>
<li><strong>Cooking:</strong> time how long things actually take, to improve your recipes.</li>
<li><strong>Classrooms and experiments:</strong> time reactions, pendulums or falling objects.</li>
<li><strong>Work:</strong> measure how long tasks take for estimates and invoices.</li>
</ul>

<h2>Keeps time in the background</h2>
<p>The stopwatch stores the moment it started rather than counting ticks, so it keeps perfect time even if you switch tabs or your screen goes to sleep briefly. Come back to the tab and the time is exactly right.</p>
EOT_TF,
  'faqs' => [
    [
      'How accurate is this online stopwatch?',
      <<<'EOT_TF'
It uses the browser’s high-resolution clock and shows hundredths of a second. Human reaction time when pressing the button (about 0.2 seconds) is a bigger source of error.
EOT_TF,
    ],
    [
      'What is the difference between lap and split times?',
      <<<'EOT_TF'
A lap time is the time for one lap on its own. A split time is the total elapsed time at the end of that lap.
EOT_TF,
    ],
    [
      'Does the stopwatch keep running in another tab?',
      'Yes. It measures from the start time, so it stays accurate even when the tab is in the background.',
    ],
    ['Are there keyboard shortcuts?', 'Yes: Space starts and stops, L records a lap, and R resets.'],
    [
      'How many laps can I record?',
      'As many as you like. The fastest and slowest laps are marked once you have three or more.',
    ],
  ],
];
