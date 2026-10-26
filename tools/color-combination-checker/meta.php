<?php
// Color Combination Checker: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Color Combination Checker',
  'category' => 'convert',
  'order' => 24,
  'popular' => true,
  'scripts' => ['color.js'],
  'icon' => 'swatch-book',
  'keywords' => 'color combination checker colour combination do these colors go together color harmony checker color palette checker contrast checker color blind test palette generator',
  'short' => 'Check if colours go together: harmony, contrast and colour blindness.',
  'title' => 'Color Combination Checker: Do These Colors Match?',
  'description' => <<<'EOT_TF'
Check if your colours go together: see their harmony, WCAG text contrast for every pair, how they look to colour-blind people, and matching palette ideas.
EOT_TF,
  'related' => ['outfit-color-matcher', 'color-converter', 'image-color-picker', 'css-gradient-generator'],
  'answer' => <<<'EOT_TF'
Pick two to five colours. The checker names their <strong>harmony</strong> (complementary, analogous, triadic and more), rates how well they work together, shows the <strong>WCAG contrast</strong> of every pair for readable text, and previews them as people with colour blindness see them. Click a suggested palette to try it.
EOT_TF,
  'article' => <<<'EOT_TF'
<h2>What makes colours go together?</h2>
<p>Colour harmony comes from the relationship between hues on the colour wheel and from balancing how bright and saturated each colour is. Designers rely on a few proven patterns:</p>
<ul>
<li><strong>Complementary:</strong> opposite hues (blue and orange). High energy; use one as the main colour and the other as an accent.</li>
<li><strong>Analogous:</strong> neighbours on the wheel (green, teal, blue). Calm and natural.</li>
<li><strong>Triadic:</strong> three hues evenly spaced (red, yellow, blue). Lively but balanced if one dominates.</li>
<li><strong>Split-complementary:</strong> one hue plus the two either side of its opposite. Strong contrast, less tension than complementary.</li>
<li><strong>Monochromatic:</strong> one hue in different lightness. Always cohesive.</li>
<li><strong>Neutrals</strong> (white, black, grey, beige, navy) go with almost anything.</li>
</ul>
<p>A common rule of thumb is <strong>60-30-10</strong>: 60% main colour, 30% secondary, 10% accent.</p>

<h2>Contrast for readable text (WCAG)</h2>
<div class="scroll"><table class="tbl"><thead><tr><th>Level</th><th>Normal text</th><th>Large text (24 px, or 18.7 px bold)</th></tr></thead><tbody>
<tr><td>AA (minimum)</td><td>4.5 : 1</td><td>3 : 1</td></tr>
<tr><td>AAA (enhanced)</td><td>7 : 1</td><td>4.5 : 1</td></tr>
</tbody></table></div>
<p>Colours can look great together and still be unreadable as text on each other. The matrix shows every pair so you can choose which colour to use for text and which for backgrounds.</p>

<h2>Colour blindness</h2>
<p>About 1 in 12 men and 1 in 200 women have some form of colour vision deficiency, most often red-green (protanopia, deuteranopia). The simulation shows whether your colours stay distinguishable. If two colours merge, add a difference in lightness, or use labels and patterns rather than colour alone.</p>

<h2>Clashing colours</h2>
<p>Two very saturated colours of similar brightness that are neither close nor opposite (for example bright red and bright purple) can seem to vibrate against each other. Soften one, darken it, or separate them with a neutral.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I know if two colours go together?',
      <<<'EOT_TF'
Check their relationship on the colour wheel (complementary, analogous, triadic) and their contrast. This checker does both and gives a rating with tips.
EOT_TF,
    ],
    [
      'What is a good contrast ratio for text?',
      <<<'EOT_TF'
At least 4.5:1 for normal text and 3:1 for large text to meet WCAG AA. Aim for 7:1 for the best readability.
EOT_TF,
    ],
    [
      'What colours go with everything?',
      <<<'EOT_TF'
Neutrals: white, black, grey, navy and beige. They pair with almost any colour and calm down bright ones.
EOT_TF,
    ],
    [
      'Why do some colour combinations look bad?',
      <<<'EOT_TF'
Highly saturated colours of similar lightness that aren’t related on the colour wheel compete for attention and can appear to vibrate.
EOT_TF,
    ],
    [
      'Can I check colours for colour-blind users?',
      <<<'EOT_TF'
Yes. The simulation shows your palette as seen with protanopia, deuteranopia and tritanopia, so you can spot colours that become hard to tell apart.
EOT_TF,
    ],
  ],
];
