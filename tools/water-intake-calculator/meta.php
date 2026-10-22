<?php
// Water Intake Calculator: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Water Intake Calculator',
  'category' => 'health',
  'order' => 6,
  'icon' => 'glass-water',
  'appCategory' => 'HealthApplication',
  'keywords' => 'how much water should i drink a day daily water intake hydration calculator',
  'short' => 'How much water to drink a day for your weight, exercise and climate.',
  'title' => 'Water Intake Calculator: How Much Water Should I Drink?',
  'description' => <<<'EOT_TF'
Estimate how much water to drink a day from your weight, exercise and climate, with adjustments for pregnancy and breastfeeding. Litres, ounces and glasses.
EOT_TF,
  'related' => ['calorie-calculator', 'macro-calculator', 'sleep-calculator'],
  'answer' => <<<'EOT_TF'
A practical rule is about <strong>35 ml of fluid per kg of body weight</strong> a day (roughly half an ounce per pound), plus extra for exercise and hot weather. For most adults that's <strong>1.5–2.5 litres</strong> from drinks, with food supplying the rest. Pale yellow urine is the easiest sign you're getting enough.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>How the estimate is calculated</h2>
<div class="formula">Drinks per day ≈ weight (kg) × 35 ml
              + exercise minutes × 12 ml
              + 500 ml in hot or humid weather
              + 300 ml if pregnant, 700 ml if breastfeeding</div>
<p>Exercise adds roughly 350–400 ml for every 30 minutes, depending on intensity and sweat rate. Pregnancy and breastfeeding allowances follow European Food Safety Authority guidance.</p>

<h2>Official recommendations</h2>
<div class="scroll"><table class="tbl">
<thead><tr><th>Source</th><th class="n">Women</th><th class="n">Men</th></tr></thead>
<tbody>
<tr><td>EFSA (Europe), total water</td><td class="n">2.0 L</td><td class="n">2.5 L</td></tr>
<tr><td>US National Academies, total water</td><td class="n">2.7 L</td><td class="n">3.7 L</td></tr>
<tr><td>UK NHS, drinks</td><td class="n" colspan="2">6–8 glasses (1.5–2 L)</td></tr>
</tbody></table></div>
<p>"Total water" includes water from food, which is usually about 20% of intake (more if you eat lots of fruit, vegetables and soups). That's why the drink targets are lower than the totals.</p>

<h2>What counts?</h2>
<p>All drinks count towards your fluid intake: water, milk, tea and coffee included. Caffeine has a mild diuretic effect, but regular tea and coffee drinkers still gain most of the fluid. Water is the best everyday choice because it has no sugar or calories; sugary drinks add calories without filling you up.</p>

<h2>Signs you need more</h2>
<ul>
<li>Dark yellow or strong-smelling urine</li>
<li>Thirst, dry mouth, headache or tiredness</li>
<li>Dizziness or light-headedness, especially in heat</li>
</ul>

<h2>Can you drink too much?</h2>
<p>Yes, though it's rare. Drinking several litres in a short time, for example during endurance events, can dilute the blood's sodium (hyponatraemia), which is dangerous. Spread intake through the day and, during long exercise, use drinks with electrolytes. People with heart, kidney or liver conditions may have fluid limits set by their doctor.</p>
EOT_TF,
  'faqs' => [
    [
      'How much water should I drink a day?',
      <<<'EOT_TF'
Roughly 35 ml per kg of body weight from drinks, which is 1.5–2.5 litres for most adults, plus more for exercise and hot weather.
EOT_TF,
    ],
    [
      'Do tea and coffee count towards water intake?',
      'Yes. They count towards your fluid intake, although water is the best everyday choice.',
    ],
    [
      'How much water should I drink when exercising?',
      'About 350–400 ml extra for every 30 minutes of exercise, more in heat or if you sweat heavily.',
    ],
    [
      'Is 8 glasses of water a day right?',
      <<<'EOT_TF'
It’s a reasonable rule of thumb (about 2 litres), but needs vary with body size, activity and climate.
EOT_TF,
    ],
    [
      'How can I tell if I’m drinking enough?',
      'Pale straw-coloured urine and rarely feeling thirsty are good signs.',
    ],
  ],
];
