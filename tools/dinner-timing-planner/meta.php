<?php
// Dinner Timing Planner: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Dinner Timing Planner',
  'updated' => '2026-10-22', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'life',
  'order' => 6,
  'icon' => 'chef-hat',
  'short' => 'Get every dish ready at the same time. Works backwards from when you serve.',
  'title' => 'Dinner Timing Planner: Get Every Dish Ready at Once',
  'description' => <<<'EOT_TF'
Plan a dinner so every dish is ready together. Enter serving time plus prep, cook and rest times, and get a step-by-step cooking timeline. Free.
EOT_TF,
  'related' => ['recipe-scaler', 'baking-pan-converter', 'pizza-size-calculator'],
  'answer' => <<<'EOT_TF'
To have every dish ready together, <strong>work backwards from the time you want to eat</strong>. For each dish, subtract its resting time, then its cooking time, then its prep time. The dish with the longest total starts first. This planner does the subtraction for every dish and gives you a single timeline to follow.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>Why dinners go wrong</h2>
<p>Cooking several dishes at once is a scheduling problem, not a cooking problem. Each dish might be easy on its own, but the roast needs resting, the potatoes take an hour, the vegetables take ten minutes, and the gravy needs the roasting pan juices. Get the order wrong and something is cold, overcooked or still raw when everyone sits down.</p>
<p>Professional kitchens solve this with "backwards timing": they start from the moment the plate goes out and count back. This planner does the same thing for your kitchen.</p>

<h2>How the timeline is calculated</h2>
<div class="formula">Take off the heat = serving time − resting time
Start cooking     = serving time − resting time − cooking time
Start prepping    = start cooking − prep time</div>
<p>Every step from every dish is then sorted into one list, earliest first. The first line tells you when you need to be in the kitchen.</p>

<h2>Worked example: a roast dinner for 7:00 pm</h2>
<ul>
<li><strong>Roast chicken</strong> (20 min prep, 80 min cook, 15 min rest): prep at 5:05 pm, oven at 5:25 pm, out to rest at 6:45 pm.</li>
<li><strong>Roast potatoes</strong> (15 min prep, 50 min cook): prep at 5:55 pm, oven at 6:10 pm.</li>
<li><strong>Green beans</strong> (10 min prep, 8 min cook): prep at 6:42 pm, cook at 6:52 pm.</li>
<li><strong>Gravy</strong> (5 min prep, 10 min cook): prep at 6:45 pm, cook at 6:50 pm, using the juices from the resting chicken.</li>
</ul>
<p>So the cook needs to start at 5:05 pm, 1 hour 55 minutes before dinner.</p>

<h2>What to enter for each dish</h2>
<ul>
<li><strong>Prep:</strong> chopping, marinating, assembling. Include preheating time if your oven is slow and nothing else is using it.</li>
<li><strong>Cook:</strong> time on the heat or in the oven, from the recipe.</li>
<li><strong>Rest:</strong> time between coming off the heat and serving. Roasts and steaks need it; most vegetables don't. Use rest time for dishes that can sit in a warm oven too.</li>
</ul>

<h2>Tips for a smooth dinner</h2>
<ul>
<li><strong>Check your oven space.</strong> If two dishes need the oven at different temperatures, cook one earlier and keep it warm, or use the hob.</li>
<li><strong>Prep the day before</strong> where you can: peeled potatoes keep in cold water, and sauces reheat well. Set their prep time to 0.</li>
<li><strong>Add a 10-minute buffer</strong> to the first step. Things always take a little longer with guests in the house.</li>
<li><strong>Copy the timeline</strong> and stick it on the fridge, or set phone alarms for each step.</li>
</ul>
EOT_TF,
  'faqs' => [
    [
      'How do I time multiple dishes to finish at the same time?',
      <<<'EOT_TF'
Work backwards from serving time. For each dish subtract resting, cooking and prep time to find when it must start. Then follow all the start times in order, earliest first.
EOT_TF,
    ],
    [
      'When should I start cooking a roast for a 7 pm dinner?',
      <<<'EOT_TF'
Add up prep, cooking and resting time and subtract it from 7 pm. A chicken with 20 minutes prep, 80 minutes cooking and 15 minutes resting needs you to start at 5:05 pm.
EOT_TF,
    ],
    [
      'Should resting time be included in cooking time?',
      <<<'EOT_TF'
No. Resting happens after the meat comes off the heat. Enter it separately so the planner can tell you when to take the dish out.
EOT_TF,
    ],
    [
      'What if two dishes need the oven at different temperatures?',
      <<<'EOT_TF'
The planner doesn’t know about oven space. Cook the dish that holds its heat better earlier and give it a longer rest time, or move one dish to the hob or air fryer.
EOT_TF,
    ],
    [
      'Does this work for dinners that go past midnight?',
      <<<'EOT_TF'
Yes. Times are worked out on a 24-hour clock, so a late-night meal or an early-morning bake schedules correctly.
EOT_TF,
    ],
  ],
];
