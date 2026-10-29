<?php
// Recipe Scaler: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Recipe Scaler',
  'updated' => '2026-10-22', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'life',
  'order' => 8,
  'icon' => 'cooking-pot',
  'short' => 'Paste a recipe, change the servings, and get tidy cup and spoon amounts back.',
  'title' => 'Recipe Scaler: Resize Any Recipe With Easy Kitchen Measures',
  'description' => <<<'EOT_TF'
Paste any recipe and scale it up or down by servings. Handles fractions like 1 1/2 and ¾, converts awkward amounts to easier spoons and cups. Free.
EOT_TF,
  'related' => ['baking-pan-converter', 'dinner-timing-planner', 'unit-price-calculator'],
  'answer' => <<<'EOT_TF'
To scale a recipe, divide the servings you want by the servings the recipe makes, and multiply every ingredient by that number. Going from 4 to 6 servings means multiplying by <strong>1.5</strong>. Paste your ingredient list and this scaler does it line by line, rounds to amounts you can actually measure, and swaps awkward amounts like "0.375 cups" for spoons.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>How recipe scaling works</h2>
<p>Every recipe has a scaling factor: the number of servings you want divided by the number it was written for. Multiply every quantity by that factor and the proportions stay the same, so the dish tastes the same.</p>
<div class="formula">Scaling factor = servings you want ÷ servings in the recipe
New amount     = original amount × scaling factor</div>
<p>The hard part isn't the multiplication. It's that 1½ cups × 1.5 = 2.25 cups, and ⅓ cup × 0.75 = 0.25 cups, and 3 tablespoons × 1.5 = 4.5 tablespoons. This scaler reads fractions the way recipes write them (1 1/2, 1½, ¾, 2–3), scales them, and writes the answer back in measures you have in your drawer.</p>

<h2>Easier measures</h2>
<p>With "switch to easier spoon and cup sizes" turned on, the scaler converts between teaspoons, tablespoons and cups using standard kitchen equivalents:</p>
<div class="formula">3 teaspoons  = 1 tablespoon
16 tablespoons = 1 cup
48 teaspoons  = 1 cup</div>
<ul>
<li>Less than ¼ cup becomes tablespoons: ⅛ cup becomes 2 tbsp.</li>
<li>Less than 1 tablespoon becomes teaspoons: ⅓ tbsp becomes 1 tsp.</li>
<li>3 teaspoons or more becomes tablespoons: 5¼ tsp becomes 1¾ tbsp.</li>
<li>Large spoon amounts only move up to cups when they match a real cup measure, so 4½ tbsp stays as it is instead of becoming "roughly ¼ cup".</li>
</ul>
<p>Grams and millilitres are rounded to sensible precision: half a gram for small amounts, whole numbers up to 100, and the nearest 5 above that.</p>

<h2>Worked example: pancakes for 6 instead of 4</h2>
<p>The factor is 6 ÷ 4 = 1.5.</p>
<ul>
<li>1½ cups flour → <strong>2¼ cups</strong></li>
<li>3½ tsp baking powder → 5¼ tsp → <strong>1¾ tbsp</strong></li>
<li>1¼ cups milk → <strong>1⅞ cups</strong></li>
<li>1 egg → <strong>1½ eggs</strong>: beat 2 eggs and use ¾ of the mix</li>
<li>200 g blueberries → <strong>300 g</strong></li>
</ul>

<h2>What doesn't scale perfectly</h2>
<ul>
<li><strong>Salt, spices and chilli:</strong> when doubling or more, start with about ¾ of the scaled amount and taste.</li>
<li><strong>Baking powder and yeast:</strong> fine to scale up to about double. For very large batches, bakers often use a little less.</li>
<li><strong>Cooking time:</strong> a bigger pot of stew takes longer to come to temperature; a bigger cake needs a bigger pan, not just a longer bake. Use the baking pan converter for cakes.</li>
<li><strong>Pan size:</strong> doubling a recipe in the same pan changes depth and baking time.</li>
</ul>
EOT_TF,
  'faqs' => [
    [
      'How do I scale a recipe from 4 to 6 servings?',
      <<<'EOT_TF'
Divide 6 by 4 to get 1.5, then multiply every ingredient by 1.5. For example, 2 cups of flour becomes 3 cups and 1 teaspoon of salt becomes 1½ teaspoons.
EOT_TF,
    ],
    [
      'How do I halve a recipe with 1 egg?',
      <<<'EOT_TF'
Beat the egg and use half of it, about 25 g or 1½ tablespoons. The scaler suggests this automatically when an egg amount isn’t a whole number.
EOT_TF,
    ],
    [
      'How many tablespoons are in a cup?',
      'There are 16 tablespoons in a US cup and 3 teaspoons in a tablespoon, so 48 teaspoons make a cup.',
    ],
    [
      'Can I paste a recipe from a website?',
      <<<'EOT_TF'
Yes. Paste the ingredient list with one ingredient per line. Lines that start with a number are scaled; other lines, like "salt to taste", are left as they are.
EOT_TF,
    ],
    [
      'Does the scaler work with metric recipes?',
      <<<'EOT_TF'
Yes. Grams, kilograms, millilitres and litres are scaled and rounded to sensible precision, and imperial units like ounces and pounds work too.
EOT_TF,
    ],
  ],
];
