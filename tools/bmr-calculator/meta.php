<?php
return [
    'name' => 'BMR Calculator',
    'updated' => '2026-11-15',
    'category' => 'health',
    'order' => 2,
    'icon' => 'gauge',
    'appCategory' => 'HealthApplication',
    'keywords' => 'bmr calculator, basal metabolic rate calculator, resting metabolic rate, mifflin st jeor, katch mcardle calculator',
    'short' => 'Your basal metabolic rate with three equations, plus daily burn by activity.',
    'title' => 'BMR Calculator – Basal Metabolic Rate & TDEE',
    'description' => 'Estimate resting daily calorie burn (BMR) using Mifflin-St Jeor, Harris-Benedict and Katch-McArdle formulas, plus activity-adjusted TDEE.',
    'related' => ['calorie-calculator', 'macro-calculator', 'body-fat-calculator'],
    'answer' => 'Your <strong>BMR</strong> is the energy your body uses at complete rest just to stay alive: breathing, circulation, keeping warm and repairing cells. For most adults it\'s <strong>1,200–2,000 kcal a day</strong>, about 60–70% of everything you burn. Enter your details to compare three standard equations.',
    'sources' => [
        ['Mifflin MD, St Jeor ST et al. (1990). A new predictive equation for resting energy expenditure in healthy individuals. Am J Clin Nutr.', 'https://pubmed.ncbi.nlm.nih.gov/2305711/'],
        ['Roza AM, Shizgal HM (1984). The Harris Benedict equation reevaluated. Am J Clin Nutr.', 'https://pubmed.ncbi.nlm.nih.gov/6741850/'],
    ],
    'article' => <<<'EOT_TF'
<h2>The three BMR equations</h2>
<div class="formula">Mifflin-St Jeor (1990)
  Men:   10 × kg + 6.25 × cm − 5 × age + 5
  Women: 10 × kg + 6.25 × cm − 5 × age − 161

Harris-Benedict (revised 1984)
  Men:   88.362 + 13.397 × kg + 4.799 × cm − 5.677 × age
  Women: 447.593 + 9.247 × kg + 3.098 × cm − 4.330 × age

Katch-McArdle
  370 + 21.6 × lean body mass (kg)</div>
<ul>
<li><strong>Mifflin-St Jeor</strong> is recommended by the American Academy of Nutrition and Dietetics as the most accurate for most adults, typically within 10% of measured values.</li>
<li><strong>Harris-Benedict</strong> is the classic formula from 1919, updated in 1984. It tends to give slightly higher results.</li>
<li><strong>Katch-McArdle</strong> uses lean body mass instead of weight, so it can be more accurate for very lean or very muscular people, if you know your body fat percentage.</li>
</ul>

<h2>BMR, RMR and TDEE</h2>
<p><strong>BMR</strong> (basal metabolic rate) is measured under strict conditions: fully rested, fasted, in a comfortable temperature. <strong>RMR</strong> (resting metabolic rate) is measured more loosely and is usually slightly higher; the terms are often used interchangeably. <strong>TDEE</strong> (total daily energy expenditure) adds activity and digestion on top, and is the number to use for planning how much to eat.</p>

<h2>What affects your BMR</h2>
<ul>
<li><strong>Body size and muscle:</strong> bigger bodies and more muscle burn more.</li>
<li><strong>Age:</strong> BMR falls gradually with age, mostly because of lost muscle.</li>
<li><strong>Sex:</strong> men usually have more muscle and a higher BMR at the same weight.</li>
<li><strong>Hormones and health:</strong> thyroid conditions, illness and some medicines change BMR.</li>
<li><strong>Severe dieting</strong> can lower it, one reason crash diets backfire.</li>
</ul>

<h2>Can you raise your BMR?</h2>
<p>Building muscle through strength training is the most effective way. Eating enough protein and sleeping well help preserve muscle during weight loss. "Metabolism-boosting" foods and supplements have tiny effects at best.</p>

<h2>Which BMR Equation Should You Pick?</h2>
<p><strong>Mifflin-St Jeor</strong> (1990) is the clinical default used by the Academy of Nutrition and Dietetics for most adults because it matches modern measured resting energy expenditure closer than the older 1919 Harris-Benedict formula. However, if you already measured a reliable body-fat percentage (giving lean body mass), <strong>Katch-McArdle</strong> often predicts resting burn more accurately for very lean athletes or heavily muscled lifters.</p>

<h2>Practical Tip Before Cutting Calories Too Hard</h2>
<p>Never treat bare BMR as a daily dieting target—because eating only your resting metabolic rate ignores all walking, digestion (thermic effect of food) and daily movement, creating an unnecessarily steep deficit.</p>
EOT_TF,
    'faqs' => [
        ['What is a normal BMR?', 'Most adult women have a BMR of about 1,200–1,500 kcal a day and men 1,500–1,900 kcal, depending on size, age and muscle.'],
        ['Which BMR formula is most accurate?', 'Mifflin-St Jeor is the most accurate general formula. Katch-McArdle can be better if you know your body fat percentage accurately.'],
        ['Should I eat my BMR in calories?', 'No. BMR is only the energy used at rest. To maintain weight you need your TDEE, which is BMR multiplied by your activity level.'],
        ['Does BMR decrease with age?', 'Yes, slowly, mostly because muscle mass declines. Strength training helps slow this.'],
        ['How can I measure my BMR exactly?', 'Clinics and some gyms measure it with indirect calorimetry, which analyses the oxygen you breathe in and the carbon dioxide you breathe out.'],
    ],
    'aka' => ['Basal Metabolic Rate Calculator', 'Resting Calorie Burn Calculator'],
];
