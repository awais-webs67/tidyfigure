<?php
// Outfit Color Matcher: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Outfit Color Matcher',
  'category' => 'life',
  'order' => 20,
  'popular' => true,
  'scripts' => ['color.js'],
  'icon' => 'shirt',
  'keywords' => 'outfit color matcher shirt and pant color combination dress color combination suit color combination what colors go with navy clothes color matching tie and shirt',
  'short' => 'Try shirt, trouser, jacket and shoe colours and see if they match.',
  'title' => 'Outfit Color Matcher: Shirt, Pant & Suit Colors',
  'description' => <<<'EOT_TF'
Try shirt, trouser, jacket, tie and shoe colours on a model and get an instant match score with styling tips. Plus 16 classic outfit colour combinations.
EOT_TF,
  'related' => ['color-combination-checker', 'camera-color-picker', 'color-converter', 'decision-matrix'],
  'answer' => <<<'EOT_TF'
Pick a colour for each piece (jacket, shirt or top, trousers, shoes and a tie or scarf) and the model updates instantly. The matcher gives a <strong>score out of 10</strong> with tips, based on colour theory and classic menswear and womenswear rules, and suggests colours that go with your top. Tap a <strong>classic combination</strong> to start from a proven look.
EOT_TF,
  'article' => <<<'EOT_TF'
<h2>Simple rules for matching clothes</h2>
<ul>
<li><strong>Build on neutrals.</strong> Navy, grey, white, black, beige, khaki and brown go with almost everything. Most great outfits are mostly neutrals with one colour.</li>
<li><strong>One statement colour.</strong> A bright piece looks best when the rest of the outfit is calm.</li>
<li><strong>Contrast between top and bottom.</strong> A light shirt with dark trousers (or the reverse) is flattering and easy. Colours that are almost the same but not quite, like navy with black, can look like a mistake.</li>
<li><strong>Use the colour wheel.</strong> Neighbouring colours (blue and green) look calm; opposites (blue and orange, burgundy and green) look bold, so keep one of them small.</li>
<li><strong>Match leathers.</strong> Belt and shoes should match (brown with brown, black with black).</li>
</ul>

<h2>Shirt and pant colour combinations that always work</h2>
<div class="scroll"><table class="tbl"><thead><tr><th>Shirt</th><th>Trousers</th></tr></thead><tbody>
<tr><td>White</td><td>Navy, grey, black, khaki, olive, denim</td></tr>
<tr><td>Light blue</td><td>Navy, grey, khaki, beige, white</td></tr>
<tr><td>Navy</td><td>Khaki, grey, beige, white</td></tr>
<tr><td>Black</td><td>Grey, white, beige, black (all black)</td></tr>
<tr><td>Pink</td><td>Navy, grey, khaki, white</td></tr>
<tr><td>Olive</td><td>Beige, khaki, black, white, denim</td></tr>
<tr><td>Maroon / burgundy</td><td>Grey, beige, navy, black</td></tr>
<tr><td>Mustard</td><td>Navy, black, denim, white</td></tr>
</tbody></table></div>

<h2>Suits, shirts and ties</h2>
<ul>
<li><strong>Navy suit:</strong> white or light blue shirt; burgundy, brown, green or orange tie; brown or black shoes.</li>
<li><strong>Charcoal grey suit:</strong> white, light blue or pink shirt; navy, purple or burgundy tie; black shoes.</li>
<li><strong>Black suit:</strong> white shirt; black, silver or deep red tie; black shoes. Best for evening events.</li>
<li><strong>Beige or tan suit:</strong> white or light blue shirt; navy or brown tie; brown shoes. Great for summer.</li>
</ul>
<p>The tie should be darker than the shirt, and its pattern a different size from the shirt’s.</p>

<h2>Skin tone and colour</h2>
<p>Warm undertones often shine in olive, mustard, rust, cream and camel; cool undertones in navy, grey, emerald, burgundy and pure white. These are tendencies, not rules: the colour you feel confident in usually looks best.</p>
EOT_TF,
  'faqs' => [
    [
      'What colour pants go with a navy shirt?',
      <<<'EOT_TF'
Khaki, beige, grey and white trousers all work well with a navy shirt. Avoid black, which looks too close to navy.
EOT_TF,
    ],
    [
      'Can I wear black and navy together?',
      <<<'EOT_TF'
It can be done in a deliberate, high-contrast way, but black and navy are so close that together they often look mismatched. Separate them with white or grey.
EOT_TF,
    ],
    [
      'Which shoes go with grey trousers?',
      <<<'EOT_TF'
Black, brown, burgundy and navy shoes all work with grey. Brown is more casual and black more formal.
EOT_TF,
    ],
    [
      'What tie goes with a white shirt and navy suit?',
      <<<'EOT_TF'
Almost any: burgundy, brown, dark green, orange or a patterned tie. Choose one darker than the shirt.
EOT_TF,
    ],
    [
      'How is the outfit score calculated?',
      <<<'EOT_TF'
From colour theory and common style rules: how many neutrals and bright colours you use, top-to-bottom contrast, colour harmony, and known clashes such as navy with black.
EOT_TF,
    ],
  ],
];
