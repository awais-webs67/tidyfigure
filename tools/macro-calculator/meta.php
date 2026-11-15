<?php
return [
    'name' => 'Macro Calculator',
    'updated' => '2026-11-15',
    'category' => 'health',
    'order' => 3,
    'icon' => 'chart-pie',
    'popular' => true,
    'appCategory' => 'HealthApplication',
    'keywords' => 'macro calculator, macros calculator, protein carbs fat calculator, iifym calculator, keto macro calculator',
    'short' => 'Daily grams of protein, carbs and fat for fat loss, maintenance or muscle.',
    'title' => 'Macro Calculator – Daily Protein, Carbs & Fat',
    'description' => 'Calculate exact daily grams of protein, carbohydrates and dietary fat for cutting, maintenance or lean bulk across balanced, low-carb or keto splits.',
    'related' => ['calorie-calculator', 'bmr-calculator', 'water-intake-calculator'],
    'answer' => 'Macros are the three nutrients that provide calories: <strong>protein</strong> (4 kcal per gram), <strong>carbohydrate</strong> (4 kcal/g) and <strong>fat</strong> (9 kcal/g). The calculator works out your calorie target, sets protein by body weight (1.6–2.2 g per kg), fat as a share of calories, and fills the rest with carbs, per day and per meal.',
    'sources' => [
        ['Mifflin MD, St Jeor ST et al. (1990). A new predictive equation for resting energy expenditure in healthy individuals. Am J Clin Nutr.', 'https://pubmed.ncbi.nlm.nih.gov/2305711/'],
    ],
    'article' => <<<'EOT_TF'
<h2>How your macros are calculated</h2>
<ol>
<li><strong>Calories:</strong> your maintenance needs (Mifflin-St Jeor × activity), adjusted for your goal: −500 kcal to lose fat, +300 kcal to build muscle. Or enter your own target.</li>
<li><strong>Protein:</strong> set by body weight, because that's what research ties protein needs to.</li>
<li><strong>Fat:</strong> a percentage of calories, keeping it at healthy levels for hormones and vitamin absorption.</li>
<li><strong>Carbs:</strong> whatever calories remain. Low-carb and keto styles cap carbs and raise fat instead.</li>
</ol>
<div class="scroll"><table class="tbl">
<thead><tr><th>Style</th><th>Protein</th><th>Fat</th><th>Carbs</th></tr></thead>
<tbody>
<tr><td>Balanced</td><td>1.6 g/kg</td><td>30% of kcal</td><td>The rest</td></tr>
<tr><td>High protein</td><td>2.2 g/kg</td><td>27%</td><td>The rest</td></tr>
<tr><td>Low carb</td><td>2.0 g/kg</td><td>45%</td><td>≤ 20%</td></tr>
<tr><td>Keto</td><td>1.6 g/kg</td><td>~70%</td><td>≤ 5% (about 20–30 g)</td></tr>
</tbody></table></div>

<h2>Why protein matters most</h2>
<p>Protein keeps you full, protects muscle while you lose fat and helps you build muscle when you train. Research reviews suggest about 1.6 g per kg of body weight a day is enough for most people building muscle, with up to 2.2 g/kg useful during weight loss. Spreading it across meals, around 25–40 g each, works better than one big serving.</p>

<h2>Carbs or fat?</h2>
<p>For fat loss, total calories and protein matter far more than the carb-to-fat split. Choose the style you can stick to: people who love bread and fruit do better with balanced macros; people who prefer meat, eggs and cheese may find low-carb easier. Keto is very restrictive and best tried with professional advice.</p>

<h2>Making it practical</h2>
<ul>
<li>Use a food-tracking app for two weeks to learn what your targets look like on a plate.</li>
<li>Build each meal around a protein source, then add vegetables, a carb portion and some fat.</li>
<li>Hitting protein and calories within about 10% is plenty; exact grams don't matter.</li>
<li>Recalculate after losing or gaining 4–5 kg.</li>
</ul>

<h2>Calorie Density of Each Macronutrient</h2>
<p>Nutrition labels derive calories from standard Atwater factors: <strong>protein</strong> supplies <code>4 kcal/g</code>, <strong>carbohydrates</strong> supply <code>4 kcal/g</code>, and <strong>fat</strong> supplies <code>9 kcal/g</code> (while alcohol adds <code>7 kcal/g</code>). Locking protein first preserves lean tissue during weight loss and drives higher satiety per calorie than refined carbs or added fats.</p>

<h2>Hitting Daily Targets Without Micromanaging Every Gram</h2>
<p>Aim within ±5 g on protein and within ±50–100 kcal on daily total intake over a rolling week; letting carbs and fats trade places slightly day to day keeps sustainable adherence high.</p>
EOT_TF,
    'faqs' => [
        ['What are macros?', 'Macronutrients: protein, carbohydrate and fat, the three nutrients that provide calories.'],
        ['How much protein do I need a day?', 'About 1.6 g per kg of body weight for most active adults, up to 2.2 g/kg when losing weight. The general minimum for health is 0.8 g/kg.'],
        ['What is a good macro split for weight loss?', 'Any split with a calorie deficit and high protein works. A common one is about 30% protein, 40% carbs and 30% fat.'],
        ['How many carbs are allowed on keto?', 'Usually 20–50 g of carbohydrate a day, about 5–10% of calories.'],
        ['Do I have to hit my macros exactly?', 'No. Getting within about 10% of your calorie and protein targets is enough for good results.'],
    ],
    'aka' => ['Macronutrient Calculator', 'Protein Carbs Fat Planner'],
];
