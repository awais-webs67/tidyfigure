<?php
// CPS Test: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'CPS Test',
  'updated' => '2026-10-26', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'device',
  'order' => 5,
  'popular' => true,
  'icon' => 'mouse-pointer-click',
  'keywords' => 'cps test click speed test clicks per second click test 5 second 10 second jitter click butterfly click mouse test',
  'short' => 'How many clicks per second can you do? 1 to 60-second tests.',
  'title' => 'CPS Test: Check Your Clicks Per Second, Free',
  'description' => <<<'EOT_TF'
How fast can you click? Take the CPS test for 1, 5, 10, 30 or 60 seconds, see your clicks per second and beat your best score. Works with mouse and touch.
EOT_TF,
  'related' => ['keyboard-test', 'typing-speed-test', 'online-timer', 'what-is-my-screen-resolution'],
  'answer' => <<<'EOT_TF'
Choose a time, then click (or tap) the big box as fast as you can. The test starts with your first click and shows your <strong>clicks per second (CPS)</strong> live. Most people score 6–7 CPS; gamers using jitter or butterfly clicking reach 10–15. Your best score for each length is saved in your browser.
EOT_TF,
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
EOT_TF,
  'faqs' => [
    [
      'What is the average CPS?',
      <<<'EOT_TF'
Most people click 6 to 7 times per second. Gamers who practise jitter or butterfly clicking often reach 10 to 15.
EOT_TF,
    ],
    [
      'What is the world record CPS?',
      <<<'EOT_TF'
Records vary by technique and test length, but drag clicking has produced scores above 40 CPS over short tests. With normal clicking, 14–16 CPS is exceptional.
EOT_TF,
    ],
    [
      'Does the timer start immediately?',
      <<<'EOT_TF'
No. It starts with your first click, so you get the full time.
EOT_TF,
    ],
    [
      'Can I take the test on my phone?',
      <<<'EOT_TF'
Yes. Tap the box with one or more fingers; each tap counts as a click.
EOT_TF,
    ],
    [
      'Are my scores saved?',
      <<<'EOT_TF'
Your best score for each test length is saved in your browser on this device. Nothing is sent to a server.
EOT_TF,
    ],
  ],
];
