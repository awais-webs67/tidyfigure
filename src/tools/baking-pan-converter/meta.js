module.exports = {
  order: 7,
  category: 'life',
  icon: 'cake-slice',
  name: 'Baking Pan Size Converter',
  short: 'Recipe says 9-inch round, you have 9×13? Get the exact amount to scale it by.',
  title: 'Baking Pan Size Converter: Swap Cake Pans and Scale Recipes',
  description: 'Convert a recipe between baking pan sizes: round, square or rectangle, inches or cm. Get the exact scaling factor and baking time advice. Free and instant.',
  related: ['recipe-scaler', 'dinner-timing-planner', 'pizza-size-calculator'],
  answer: `To switch baking pans, compare their <strong>areas</strong>, not their widths. Divide your pan's area by the recipe pan's area and multiply every ingredient by that number. A 9×13-inch pan (117 sq in) holds about <strong>1.84 times</strong> as much as a 9-inch round pan (64 sq in), so you'd make the recipe roughly 1¾ times.`,
  article: `
<h2>Why pan size matters</h2>
<p>A cake recipe is written for a certain depth of batter. Put the same batter in a bigger pan and it spreads thin, bakes too fast and comes out flat and dry. Put it in a smaller pan and it rises over the edge or stays raw in the middle. Scaling the recipe to the new pan keeps the depth, and the baking time, close to what the recipe intended.</p>
<p>Pan sizes are deceptive because they're given as one measurement. A 10-inch round pan sounds only a little bigger than an 8-inch one, but it holds 56% more batter.</p>

<h2>The formula</h2>
<div class="formula">Round pan area     = π × (diameter ÷ 2)²
Square pan area    = side × side
Rectangle area     = width × length
Scaling factor     = your pan's area ÷ recipe pan's area</div>
<p>Measure pans across the inside top edge. Pans with sloped sides hold a little less than the formula suggests, but because both pans usually slope the same way, the ratio stays accurate.</p>

<h2>Common pan conversions</h2>
<div class="scroll"><table class="tbl">
<thead><tr><th>Recipe pan</th><th>Your pan</th><th class="n">Multiply by</th></tr></thead>
<tbody>
<tr><td>8″ round (50 sq in)</td><td>9″ round (64 sq in)</td><td class="n">1.27</td></tr>
<tr><td>9″ round</td><td>8″ square (64 sq in)</td><td class="n">1.01</td></tr>
<tr><td>9″ round</td><td>9×13″ (117 sq in)</td><td class="n">1.84</td></tr>
<tr><td>Two 9″ rounds</td><td>9×13″</td><td class="n">0.92</td></tr>
<tr><td>8″ square</td><td>9×13″</td><td class="n">1.83</td></tr>
<tr><td>9×13″</td><td>10×15″ sheet (150 sq in)</td><td class="n">1.28</td></tr>
<tr><td>20 cm round</td><td>23 cm round</td><td class="n">1.32</td></tr>
</tbody></table></div>

<h2>Scaling awkward ingredients</h2>
<ul>
<li><strong>Eggs:</strong> beat the eggs together and measure. One large egg is about 50 g (3¼ tablespoons) without the shell.</li>
<li><strong>Baking powder and soda:</strong> scale them like everything else for factors up to about 2. For bigger batches, many bakers use slightly less than the full amount.</li>
<li><strong>Weigh where you can.</strong> Grams scale cleanly; "1.84 cups" doesn't. Our recipe scaler converts and rounds amounts for you.</li>
</ul>

<h2>Adjusting baking time</h2>
<p>If you scale the recipe so the batter is the same depth, the baking time stays close to the original, though a much larger pan may need 5–10 extra minutes because the middle is further from the edges. If you don't scale it, deeper batter needs longer at a slightly lower temperature, and shallower batter needs less time. Always test with a skewer: it should come out clean or with a few moist crumbs.</p>`,
  faqs: [
    ['How do I convert a 9-inch round recipe to a 9×13 pan?', 'A 9×13 pan has about 117 square inches and a 9-inch round has about 64, so multiply every ingredient by 1.84. Many bakers simply make 1¾ or 2 times the recipe and fill the pan to the usual depth.'],
    ['Is an 8-inch square pan the same as a 9-inch round?', 'Almost exactly. An 8-inch square is 64 square inches and a 9-inch round is 63.6 square inches, so you can swap them without changing the recipe.'],
    ['How much bigger is a 10-inch cake pan than an 8-inch pan?', 'A 10-inch round pan holds about 56% more than an 8-inch round pan, because area grows with the square of the diameter: (10 ÷ 8)² = 1.56.'],
    ['Do I need to change the baking time for a different pan?', 'If you scale the recipe so the batter is the same depth, the time stays similar. If the batter ends up deeper, bake longer at a slightly lower temperature; if shallower, check earlier.'],
    ['Can I use a loaf pan instead of a round cake pan?', 'Yes, but loaf pans are deep and narrow, so the batter will be much deeper. Use the converter to scale the recipe, and expect a longer bake at a lower temperature.'],
  ],
};
