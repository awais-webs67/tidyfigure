<?php
// Heart Rate Zone Calculator: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Heart Rate Zone Calculator',
  'category' => 'health',
  'order' => 11,
  'icon' => 'heart-pulse',
  'appCategory' => 'HealthApplication',
  'keywords' => 'heart rate zones calculator max heart rate target heart rate zone 2 training',
  'short' => 'Max heart rate and your five training zones, including Zone 2.',
  'title' => 'Heart Rate Zone Calculator: Max HR & Training Zones',
  'description' => <<<'EOT_TF'
Calculate your maximum heart rate and five training zones (including Zone 2) from your age, with the Karvonen method if you know your resting heart rate.
EOT_TF,
  'related' => ['calories-burned-calculator', 'calorie-calculator', 'stopwatch'],
  'answer' => <<<'EOT_TF'
Your maximum heart rate is roughly <strong>208 − 0.7 × your age</strong> (the Tanaka formula, more accurate than the classic 220 − age). Training zones are percentages of that maximum: <strong>Zone 2</strong> (60–70%) builds endurance at an easy, conversational pace, while Zones 4–5 are for hard intervals. Add your resting heart rate for more personal zones.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>Maximum heart rate formulas</h2>
<div class="formula">Classic:  Max HR = 220 − age
Tanaka:   Max HR = 208 − 0.7 × age   (used here)
Karvonen: zone HR = resting + (max − resting) × intensity</div>
<p>The Tanaka formula comes from an analysis of 351 studies and fits real measurements better than 220 − age, especially for people over 40. Both are averages, though: an individual's true maximum can be 10–15 beats higher or lower. If you've measured your maximum in a supervised test or a hard race, enter it for the most accurate zones.</p>

<h2>The five training zones</h2>
<ul>
<li><strong>Zone 1 (50–60%):</strong> very light. Warm-ups, cool-downs and active recovery.</li>
<li><strong>Zone 2 (60–70%):</strong> easy and sustainable for hours. You can hold a conversation. It builds the aerobic engine, and many coaches recommend that most training (around 80%) happens here.</li>
<li><strong>Zone 3 (70–80%):</strong> "comfortably hard" tempo work.</li>
<li><strong>Zone 4 (80–90%):</strong> hard threshold efforts, raising the speed you can sustain.</li>
<li><strong>Zone 5 (90–100%):</strong> maximum effort for short intervals only.</li>
</ul>

<h2>Why use your resting heart rate?</h2>
<p>The Karvonen method uses your heart rate reserve (the gap between resting and maximum). Two people of the same age can have resting rates of 50 and 80 bpm; Karvonen gives the fitter person appropriately higher zones. Measure your resting rate on a few mornings and use the average.</p>

<h2>Using the zones</h2>
<ul>
<li>A chest strap is the most accurate way to track heart rate during exercise; wrist sensors can lag during intervals.</li>
<li>Heart rate rises in heat, when you're dehydrated, stressed or short of sleep, so go by feel on those days.</li>
<li>The "talk test" is a good check: full sentences in Zone 2, a few words in Zone 4.</li>
</ul>
<p>If you're new to exercise, have a heart condition, or take medicines such as beta blockers, check with a doctor before training at high intensities.</p>
EOT_TF,
  'faqs' => [
    [
      'What is my maximum heart rate?',
      'Roughly 208 − 0.7 × your age. At 35 that’s about 184 beats per minute.',
    ],
    [
      'What heart rate is Zone 2?',
      <<<'EOT_TF'
60–70% of your maximum heart rate. For a 35-year-old that’s about 110–128 bpm without resting-rate adjustment.
EOT_TF,
    ],
    [
      'Is 220 minus age accurate?',
      <<<'EOT_TF'
It’s a rough average. The Tanaka formula (208 − 0.7 × age) is more accurate, but individuals still vary by 10–15 beats.
EOT_TF,
    ],
    [
      'What is the Karvonen formula?',
      'It calculates zones from your heart rate reserve: resting HR + (max HR − resting HR) × intensity.',
    ],
    [
      'What is a good resting heart rate?',
      'Between 60 and 100 bpm is normal for adults; fit people often have 40–60 bpm.',
    ],
  ],
];
