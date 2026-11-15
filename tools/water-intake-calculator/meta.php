<?php
return [
    'name' => 'Water Intake Calculator',
    'updated' => '2026-11-15',
    'category' => 'health',
    'order' => 6,
    'icon' => 'glass-water',
    'appCategory' => 'HealthApplication',
    'keywords' => 'water intake calculator, how much water should i drink, daily hydration calculator, water per day weight',
    'short' => 'How much water to drink a day for your weight, exercise and climate.',
    'title' => 'Water Intake Calculator – Daily Hydration Goal',
    'description' => 'Estimate daily hydration needs in litres, ounces and glasses based on body weight, exercise minutes and climate with National Academies context.',
    'related' => ['calorie-calculator', 'macro-calculator', 'sleep-calculator'],
    'answer' => 'A practical rule is about <strong>35 ml of fluid per kg of body weight</strong> a day (roughly half an ounce per pound), plus extra for exercise and hot weather. For most adults that\'s <strong>1.5–2.5 litres</strong> from drinks, with food supplying the rest. Pale yellow urine is the easiest sign you\'re getting enough.',
    'sources' => [
        ['National Academies: Dietary Reference Intakes for Water, Potassium, Sodium, Chloride, and Sulfate', 'https://nap.nationalacademies.org/catalog/10925/dietary-reference-intakes-for-water-potassium-sodium-chloride-and-sulfate'],
        ['NHS: Water, drinks and hydration', 'https://www.nhs.uk/live-well/eat-well/food-guidelines-and-food-labels/water-drinks-nutrition/'],
    ],
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

<h2>Fluid From Food vs Beverages</h2>
<p>Roughly 20% of total daily water intake typically comes from water-rich foods such as fruits, vegetables, soups and cooked grains, while plain water, milk, tea and coffee supply the remainder. Pale straw-coloured urine throughout the afternoon is a quick practical sign of adequate hydration alongside your numeric daily target.</p>

<h2>Electrolytes During Heat or Long Endurance Workouts</h2>
<p>During heavy sweating lasting over an hour, plain water alone dilutes sodium balance—pairing fluid with electrolytes or lightly salted meals improves actual cellular hydration.</p>
EOT_TF,
    'faqs' => [
        ['How much water should I drink a day?', 'Roughly 35 ml per kg of body weight from drinks, which is 1.5–2.5 litres for most adults, plus more for exercise and hot weather.'],
        ['Do tea and coffee count towards water intake?', 'Yes. They count towards your fluid intake, although water is the best everyday choice.'],
        ['How much water should I drink when exercising?', 'About 350–400 ml extra for every 30 minutes of exercise, more in heat or if you sweat heavily.'],
        ['Is 8 glasses of water a day right?', 'It’s a reasonable rule of thumb (about 2 litres), but needs vary with body size, activity and climate.'],
        ['How can I tell if I’m drinking enough?', 'Pale straw-coloured urine and rarely feeling thirsty are good signs.'],
        ['Do tea and coffee count toward daily water?', 'Yes. Moderate caffeinated drinks contribute net hydration toward daily fluid totals, though plain water keeps extra calories and caffeine out.'],
    ],
    'aka' => ['Daily Water Calculator', 'Hydration Needs Estimator'],
];
