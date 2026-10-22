<?php
// Ideal Weight Calculator: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Ideal Weight Calculator',
  'category' => 'health',
  'order' => 5,
  'icon' => 'target',
  'appCategory' => 'HealthApplication',
  'keywords' => 'ideal body weight calculator healthy weight for my height devine robinson',
  'short' => 'Ideal weight for your height from four formulas, plus the healthy BMI range.',
  'title' => 'Ideal Weight Calculator: Healthy Weight for Your Height',
  'description' => <<<'EOT_TF'
Find your ideal body weight for your height and sex using the Robinson, Miller, Devine and Hamwi formulas, alongside the healthy BMI weight range. kg or lb.
EOT_TF,
  'related' => ['bmi-calculator', 'body-fat-calculator', 'calorie-calculator'],
  'answer' => <<<'EOT_TF'
There's no single perfect weight, but formulas give a useful reference. For your height and sex this calculator averages the four best-known <strong>ideal body weight</strong> formulas and shows the <strong>healthy BMI range</strong> (BMI 18.5–24.9), which is the range most health services use as a target.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>The ideal weight formulas</h2>
<p>Each formula starts from a base weight at 5 feet (152.4 cm) and adds a fixed amount for every inch above that:</p>
<div class="formula">               Men                    Women
Robinson   52 kg + 1.9 kg/inch      49 kg + 1.7 kg/inch
Miller     56.2 kg + 1.41 kg/inch   53.1 kg + 1.36 kg/inch
Devine     50 kg + 2.3 kg/inch      45.5 kg + 2.3 kg/inch
Hamwi      48 kg + 2.7 kg/inch      45.5 kg + 2.2 kg/inch</div>
<p>The Devine formula was created in 1974 to calculate medicine doses and is still widely used in hospitals. Robinson and Miller later refined it using life-insurance data on the weights associated with the longest life expectancy.</p>

<h2>Formulas versus the healthy BMI range</h2>
<p>The formulas give one number, which is easy to remember but ignores body frame and muscle. The healthy BMI range is wider and more realistic: anywhere in it is associated with good health for most adults. If you're within that range, your weight is very likely fine for your height.</p>

<h2>Why "ideal" varies</h2>
<ul>
<li><strong>Frame size:</strong> people with large bones and broad shoulders naturally weigh more.</li>
<li><strong>Muscle:</strong> muscle is denser than fat, so active people can weigh more and be leaner.</li>
<li><strong>Age:</strong> some research suggests slightly higher weights are protective in older adults.</li>
<li><strong>Ethnicity:</strong> health risks rise at lower BMIs in some populations, including South Asian and East Asian adults.</li>
</ul>

<h2>Better questions than "what should I weigh?"</h2>
<p>Waist size (ideally less than half your height), fitness, strength, blood pressure and blood sugar tell you more about health than the scale. Use the Body Fat Calculator to see how much of your weight is fat, and talk to a doctor if you want a personalised target.</p>
EOT_TF,
  'faqs' => [
    [
      'What is my ideal weight for my height?',
      <<<'EOT_TF'
Enter your height and sex to see the average of four ideal body weight formulas and the healthy BMI range for your height.
EOT_TF,
    ],
    [
      'Which ideal weight formula is best?',
      <<<'EOT_TF'
None is clearly best. Devine is most used medically; Robinson and Miller tend to give more realistic results for many people.
EOT_TF,
    ],
    [
      'Is the ideal weight the same for men and women?',
      'No. At the same height, the formulas give women a lower ideal weight than men.',
    ],
    [
      'Do ideal weight formulas work for short people?',
      'They were designed for heights above 5 feet (152 cm). Below that, use the healthy BMI range instead.',
    ],
    [
      'Should I aim for my exact ideal weight?',
      <<<'EOT_TF'
No. Anywhere in the healthy BMI range is generally fine. Fitness and waist size matter as much as weight.
EOT_TF,
    ],
  ],
];
