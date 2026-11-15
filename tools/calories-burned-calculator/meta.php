<?php
return [
    'name' => 'Calories Burned Calculator',
    'updated' => '2026-11-15',
    'category' => 'health',
    'order' => 10,
    'icon' => 'dumbbell',
    'appCategory' => 'HealthApplication',
    'keywords' => 'calories burned calculator, exercise calorie calculator, walking calories burned, running calories calculator, met calculator',
    'short' => 'Calories burned walking, running, cycling, swimming and 25+ activities.',
    'title' => 'Calories Burned Calculator – Exercise & Steps',
    'description' => 'Estimate calories burned across 30+ activities—walking, running, cycling, swimming, weights and yoga—from your body weight, duration and MET score.',
    'related' => ['calorie-calculator', 'heart-rate-zone-calculator', 'macro-calculator'],
    'answer' => 'Calories burned depend mainly on <strong>your weight</strong>, <strong>how long</strong> you exercise and <strong>how intense</strong> the activity is. A 70 kg person burns roughly 130 kcal in 30 minutes of easy walking and about 360 kcal in 30 minutes of running at 10 km/h. Choose an activity to see your own estimate.',
    'sources' => [
        ['Compendium of Physical Activities (MET values)', 'https://pacompendium.com/'],
    ],
    'article' => <<<'EOT_TF'
<h2>How it's calculated: METs</h2>
<p>Every activity has a MET value (metabolic equivalent of task): how much energy it uses compared with sitting still. Sitting is about 1 MET; running at 10 km/h is about 9.8 METs, nearly ten times as much. The values here come from the Compendium of Physical Activities, the standard reference used in exercise research.</p>
<div class="formula">Calories burned = MET × 3.5 × weight (kg) ÷ 200 × minutes

Example: running at 10 km/h (MET 9.8), 70 kg, 30 minutes
9.8 × 3.5 × 70 ÷ 200 × 30 = 360 kcal</div>

<h2>Why heavier people burn more</h2>
<p>Moving a heavier body takes more energy, so the same walk burns more calories for someone who weighs 90 kg than for someone who weighs 60 kg. That's also why calorie burn per session falls a little as you lose weight.</p>

<h2>Calories burned per 30 minutes</h2>
<div class="scroll"><table class="tbl">
<thead><tr><th>Activity</th><th class="n">60 kg</th><th class="n">80 kg</th></tr></thead>
<tbody>
<tr><td>Walking, 5 km/h</td><td class="n">110</td><td class="n">147</td></tr>
<tr><td>Cycling, moderate</td><td class="n">252</td><td class="n">336</td></tr>
<tr><td>Running, 10 km/h</td><td class="n">309</td><td class="n">412</td></tr>
<tr><td>Swimming laps, vigorous</td><td class="n">309</td><td class="n">412</td></tr>
<tr><td>Yoga</td><td class="n">79</td><td class="n">105</td></tr>
</tbody></table></div>

<h2>Keep it in perspective</h2>
<p>Exercise burns fewer calories than most people expect: a 30-minute run is roughly a large slice of cake. For weight loss, diet usually matters more, but exercise brings huge benefits for heart health, mood, sleep and keeping muscle. Most health bodies recommend at least 150 minutes of moderate activity a week plus muscle-strengthening twice a week.</p>

<h2>Accuracy</h2>
<p>MET values are averages. Fitter people are more efficient and may burn a little less for the same activity; hills, wind and effort level change the burn too. Smartwatches estimate using heart rate, which helps, but studies show they often overestimate calories.</p>

<h2>Getting a more accurate number</h2>
<p>The MET values are averages from research on adults. Your real burn depends on fitness, terrain, wind and how hard you actually work. A heart rate monitor gives a better personal estimate. When you use these numbers to plan eating, remember that fitness trackers and gym machines often overestimate, so many people eat back only half of the calories they burn while trying to lose weight.</p>

<h2>Gross vs Net Exercise Calories</h2>
<p>Standard MET tables report <strong>gross calories burned</strong>, which include the resting 1.0 MET you would burn just sitting on the sofa during that hour. When logging exercise alongside a daily calorie tracker that already counts your resting day, subtracting 1.0 MET (<code>MET − 1</code>) gives your extra <em>net</em> burn and prevents double-counting resting expenditure.</p>
EOT_TF,
    'faqs' => [
        ['How many calories does walking burn?', 'About 3.5 METs at 5 km/h: roughly 130 kcal per 30 minutes for a 70 kg person.'],
        ['How many calories does running burn?', 'Running at 10 km/h burns about 360 kcal per 30 minutes for a 70 kg person.'],
        ['What is a MET?', 'A metabolic equivalent: the energy cost of an activity compared with sitting still (1 MET).'],
        ['Are fitness tracker calorie numbers accurate?', 'They’re rough estimates and often overestimate calories burned, especially for activities other than walking and running.'],
        ['Which exercise burns the most calories?', 'Vigorous activities such as running, jump rope, fast cycling and swimming laps burn the most per minute.'],
    ],
    'aka' => ['Exercise Calorie Burn Calculator', 'Activity MET Calculator'],
];
