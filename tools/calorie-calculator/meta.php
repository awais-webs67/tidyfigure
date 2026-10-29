<?php
// Calorie Calculator: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Calorie Calculator',
  'updated' => '2026-10-22', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'health',
  'order' => 1,
  'icon' => 'flame',
  'popular' => true,
  'appCategory' => 'HealthApplication',
  'keywords' => 'calories per day tdee calculator maintenance calories weight loss calories deficit',
  'short' => 'How many calories you need a day to lose, maintain or gain weight.',
  'title' => 'Calorie Calculator: How Many Calories Do I Need a Day?',
  'description' => <<<'EOT_TF'
Work out your daily calorie needs (TDEE) to lose, maintain or gain weight, using the Mifflin-St Jeor equation and your activity level. Metric or US units. Free.
EOT_TF,
  'related' => ['macro-calculator', 'bmr-calculator', 'bmi-calculator'],
  'answer' => <<<'EOT_TF'
Your daily calorie need is your <strong>resting metabolism (BMR)</strong> multiplied by an <strong>activity factor</strong>; this is your maintenance level, or TDEE. To lose about 0.5 kg (1 lb) a week, eat roughly <strong>550 kcal a day below</strong> maintenance. Enter your details to get a personal number for every goal.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>How the calculation works</h2>
<p>The calculator uses the <strong>Mifflin-St Jeor equation</strong>, which studies have found to be the most accurate simple formula for estimating resting energy use in adults:</p>
<div class="formula">Men:    BMR = 10 × weight(kg) + 6.25 × height(cm) − 5 × age + 5
Women:  BMR = 10 × weight(kg) + 6.25 × height(cm) − 5 × age − 161
TDEE (maintenance) = BMR × activity factor</div>
<div class="scroll"><table class="tbl">
<thead><tr><th>Activity level</th><th class="n">Factor</th></tr></thead>
<tbody>
<tr><td>Sedentary: desk job, little exercise</td><td class="n">1.2</td></tr>
<tr><td>Lightly active: exercise 1–3 days a week</td><td class="n">1.375</td></tr>
<tr><td>Moderately active: 3–5 days a week</td><td class="n">1.55</td></tr>
<tr><td>Very active: 6–7 days a week</td><td class="n">1.725</td></tr>
<tr><td>Extremely active: physical job plus training</td><td class="n">1.9</td></tr>
</tbody></table></div>

<h2>Calories for weight loss</h2>
<p>A kilogram of body fat stores roughly 7,700 kcal (about 3,500 kcal per pound). Eating 550 kcal a day below maintenance adds up to about 0.5 kg a week. Faster loss needs bigger deficits, which are harder to sustain and risk losing muscle. Most guidelines recommend aiming for 0.5–1 kg (1–2 lb) a week at most.</p>
<p>The calculator won't suggest less than 1,200 kcal a day for women or 1,500 for men, the levels below which it becomes hard to meet nutritional needs without medical supervision.</p>

<h2>Why your real number may differ</h2>
<ul>
<li>Equations predict the average; individuals vary by around 10% either way.</li>
<li>People often overestimate their activity level. If unsure, choose the lower option.</li>
<li>Muscle burns more energy than fat, so very muscular people need more.</li>
<li>Metabolism adapts as you lose weight, so recalculate every 4–5 kg.</li>
</ul>
<p>The best test is real life: track your intake and weight for two to three weeks and adjust by 100–200 kcal if your weight isn't moving as expected.</p>

<h2>Calories aren't everything</h2>
<p>For health, what you eat matters as well as how much. Plenty of protein helps you keep muscle while losing weight; fibre from vegetables, fruit and whole grains keeps you full. Use the Macro Calculator to split your calories into protein, carbs and fat.</p>
EOT_TF,
  'faqs' => [
    [
      'How many calories should I eat a day?',
      <<<'EOT_TF'
It depends on your sex, age, height, weight and activity. Most adult women need roughly 1,800–2,400 kcal and men 2,200–3,000 kcal to maintain weight. Enter your details for a personal estimate.
EOT_TF,
    ],
    [
      'How many calories should I eat to lose weight?',
      'About 500–550 kcal a day below your maintenance level to lose roughly 0.5 kg (1 lb) a week.',
    ],
    [
      'What is TDEE?',
      <<<'EOT_TF'
Total daily energy expenditure: the calories you burn in a day, including resting metabolism, daily activity, exercise and digestion.
EOT_TF,
    ],
    [
      'Which formula does this calculator use?',
      'The Mifflin-St Jeor equation, multiplied by a standard activity factor.',
    ],
    [
      'Is a 1,200 calorie diet safe?',
      <<<'EOT_TF'
1,200 kcal is generally the lowest level recommended for women without medical supervision. Many people need more to stay healthy.
EOT_TF,
    ],
  ],
];
