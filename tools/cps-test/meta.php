<?php
return [
    'name' => 'CPS Test',
    'updated' => '2026-11-15',
    'category' => 'device',
    'order' => 5,
    'popular' => true,
    'icon' => 'mouse-pointer-click',
    'keywords' => 'cps test, clicks per second test, click speed test, kohi click test, jitter click test, spacebar counter',
    'short' => 'How many clicks per second can you do? 1 to 60-second tests.',
    'title' => 'CPS Test – Check Your Clicks Per Second Online',
    'description' => 'Measure mouse or touchscreen clicks per second over 1, 5, 10, 30 or 60 seconds, view jitter/butterfly peaks and beat your personal CPS score.',
    'related' => ['keyboard-test', 'typing-speed-test', 'online-timer', 'what-is-my-screen-resolution'],
    'answer' => 'Choose a time, then click (or tap) the big box as fast as you can. The test starts with your first click and shows your <strong>clicks per second (CPS)</strong> live. Most people score 6–7 CPS; gamers using jitter or butterfly clicking reach 10–15. Your best score for each length is saved in your browser.',
    'article' => <<<'EOT_TF'
<h2>How the CPS test works</h2>
<p>Pick a duration and click the box as quickly as you can. The timer starts on your first click, so you don’t lose any time. When it ends, your score is the number of clicks divided by the seconds: 55 clicks in 5 seconds is 11 CPS.</p>

<h2>What is a good CPS?</h2>
<div class="scroll"><table class="tbl"><thead><tr><th>CPS</th><th>Rating</th></tr></thead><tbody>
<tr><td>Under 5</td><td>Relaxed: typical for casual clicking</td></tr>
<tr><td>5–7</td><td>Average: most people land here</td></tr>
<tr><td>8–10</td><td>Fast: good for PvP games</td></tr>
<tr><td>11–14</td><td>Very fast: jitter or butterfly clicking</td></tr>
<tr><td>15+</td><td>Exceptional: drag clicking territory</td></tr>
</tbody></table></div>

<h2>Clicking techniques</h2>
<ul>
<li><strong>Regular clicking:</strong> one finger, normal grip. 6–8 CPS for most people.</li>
<li><strong>Jitter clicking:</strong> tensing the forearm so the finger vibrates on the button. 10–14 CPS, but tiring; take breaks to avoid strain.</li>
<li><strong>Butterfly clicking:</strong> alternating two fingers on one button. 12–20 CPS on mice that register it.</li>
<li><strong>Drag clicking:</strong> dragging a finger across the button so friction makes it bounce. 20+ CPS on certain mice.</li>
</ul>
<p>Many games and servers limit or flag very high CPS, so check the rules before using these techniques in competition.</p>

<h2>Tips for a higher score</h2>
<ul>
<li>Rest your wrist and click with your fingertip, not your whole hand.</li>
<li>Use a light mouse with a crisp button; worn switches can miss or double clicks.</li>
<li>Warm up with a few 5-second rounds before trying the 60-second test.</li>
</ul>

<h2>Why 1-Second Burst vs 10-Second Stamina Differ</h2>
<p>Short 1-second or 5-second trials measure peak finger twitch speed—where butterfly or drag clicking easily tops 12–18 CPS—while 30-second and 60-second runs reveal forearm fatigue and steady accuracy. Compare mouse switch actuation against laptop trackpad taps to pick the crispest input device for fast-paced PvP or rhythm games.</p>

<h2>Comparing Jitter, Butterfly &amp; Normal Click Mechanics</h2>
<p>Standard single-finger clicking tops out near 6–8 CPS cleanly with minimal mouse wobble, whereas jitter clicking tenses wrist muscles to vibrate 10–14 CPS briefly and butterfly clicking alternates index and middle fingers across wide mouse buttons—always check server rules before using high-CPS methods online.</p>
EOT_TF,
    'faqs' => [
        ['What is the average CPS?', 'Most people click 6 to 7 times per second. Gamers who practise jitter or butterfly clicking often reach 10 to 15.'],
        ['What is the world record CPS?', 'Records vary by technique and test length, but drag clicking has produced scores above 40 CPS over short tests. With normal clicking, 14–16 CPS is exceptional.'],
        ['Does the timer start immediately?', 'No. It starts with your first click, so you get the full time.'],
        ['Can I take the test on my phone?', 'Yes. Tap the box with one or more fingers; each tap counts as a click.'],
        ['Are my scores saved?', 'Your best score for each test length is saved in your browser on this device. Nothing is sent to a server.'],
        ['Does a touchscreen or laptop trackpad work for the CPS test?', 'Yes. Desktop mice, laptop trackpads and phone touchscreens all register clicks cleanly, though lightweight external gaming mice typically score 2–4 CPS higher than stiff trackpads.'],
    ],
    'aka' => ['Clicks Per Second Test', 'Click Speed Tester'],
];
