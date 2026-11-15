<?php
return [
    'name' => 'Pomodoro Timer',
    'updated' => '2026-11-15',
    'category' => 'time',
    'order' => 3,
    'popular' => true,
    'icon' => 'alarm-clock',
    'keywords' => 'pomodoro timer, 25 minute focus timer, study interval clock, free online tomato timer',
    'short' => 'A focus timer: 25 minutes of work, then a short break.',
    'title' => 'Pomodoro Timer – 25/5 Focus Intervals & Tasks',
    'description' => 'Boost deep work with classic 25-minute focus blocks, 5-minute short breaks, 15-minute long breaks, session counter and built-in task list.',
    'related' => ['online-timer', 'stopwatch', 'online-notepad', 'countdown'],
    'answer' => 'Click <strong>Start</strong> to begin a 25-minute focus session. When it ends you hear a chime and a 5-minute break starts; after every fourth session you get a longer 15-minute break. Change the lengths in <strong>Settings</strong>, add tasks to the list, and see how many sessions you’ve done today.',
    'article' => <<<'EOT_TF'
<h2>How the Pomodoro Technique works</h2>
<ol>
<li>Pick one task.</li>
<li>Work on it, and only it, for 25 minutes (one “pomodoro”).</li>
<li>Take a 5-minute break: stand up, stretch, get water.</li>
<li>After four pomodoros, take a longer 15–30 minute break.</li>
</ol>
<p>The method was created by Francesco Cirillo in the late 1980s and named after the tomato-shaped kitchen timer he used as a student. Short, fixed sessions make a big task feel manageable, and regular breaks keep your attention fresh.</p>

<h2>Using this timer</h2>
<ul>
<li><strong>Start / Pause</strong> with the button or the space bar. <strong>Skip</strong> jumps to the next session.</li>
<li><strong>Auto-start</strong> begins the next session on its own when you prefer not to touch the computer.</li>
<li><strong>Notifications:</strong> allow them to get an alert even when the tab is in the background. The time left also shows in the tab title.</li>
<li><strong>Tasks:</strong> add what you plan to do and tick tasks off. They’re saved in your browser.</li>
<li><strong>Today:</strong> the counter shows focus sessions completed today.</li>
</ul>

<h2>Popular variations</h2>
<div class="scroll"><table class="tbl"><thead><tr><th>Style</th><th>Focus</th><th>Break</th><th>Good for</th></tr></thead><tbody>
<tr><td>Classic</td><td>25 min</td><td>5 min</td><td>Most tasks, beginners</td></tr>
<tr><td>Deep work</td><td>50 min</td><td>10 min</td><td>Writing, coding, design</td></tr>
<tr><td>52/17</td><td>52 min</td><td>17 min</td><td>Long sessions with real rest</td></tr>
<tr><td>Short sprints</td><td>15 min</td><td>3 min</td><td>Starting when motivation is low</td></tr>
</tbody></table></div>

<h2>Tips</h2>
<ul>
<li>Put your phone in another room or on do-not-disturb during a session.</li>
<li>If a thought interrupts you, write it in the task list and get back to work.</li>
<li>Use breaks away from screens: a short walk refreshes focus more than scrolling.</li>
</ul>

<h2>Adapting Interval Length for Coding vs Reading</h2>
<p>Try classic <code>25/5</code> cycles when tackling administrative chores or exam revision, and stretch to <code>50/10</code> when writing software or essays so you don’t break flow mid-thought—logging each completed block beside your task list builds realistic daily pacing.</p>
EOT_TF,
    'faqs' => [
        ['How long is a Pomodoro?', 'A classic Pomodoro is 25 minutes of focused work followed by a 5-minute break. After four, take a 15–30 minute break.'],
        ['Can I change the timer lengths?', 'Yes. Open Settings to set the focus, short break and long break lengths and how many sessions come before a long break.'],
        ['Will I hear the alarm in another tab?', 'Yes. The chime plays even when the tab is in the background, and you can allow notifications for a pop-up alert. The time left also shows in the tab title.'],
        ['Are my tasks and settings saved?', 'Yes, in your browser on this device. Nothing is sent to a server.'],
        ['Does the Pomodoro Technique really work?', 'Many people find that short, timed sessions make it easier to start and to stay focused. Try it for a few days and adjust the lengths to suit you.'],
        ['Can I customise focus and break durations?', 'Yes. Adjust focus, short break and long break lengths anytime to match 25/5, 50/10 or custom study sprints.'],
        ['Why take a longer 15-minute break after every four Pomodoros?', 'Four 25-minute blocks equal nearly two hours of sustained focus; a longer break lets mental fatigue reset cleanly before starting a second two-hour study cycle.'],
    ],
    'aka' => ['Focus Interval Timer', '25/5 Study Pomodoro Clock'],
];
