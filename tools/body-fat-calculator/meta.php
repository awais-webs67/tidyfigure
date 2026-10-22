<?php
// Body Fat Calculator: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Body Fat Calculator',
  'category' => 'health',
  'order' => 4,
  'icon' => 'ruler',
  'appCategory' => 'HealthApplication',
  'keywords' => 'body fat percentage calculator navy method tape measure body fat',
  'short' => 'Body fat percentage from a tape measure, using the US Navy method.',
  'title' => 'Body Fat Calculator: Body Fat % With a Tape Measure',
  'description' => <<<'EOT_TF'
Estimate your body fat percentage from neck, waist and hip measurements with the US Navy method. See your category, fat mass and lean mass. Free, cm or inches.
EOT_TF,
  'related' => ['bmi-calculator', 'ideal-weight-calculator', 'calorie-calculator'],
  'answer' => <<<'EOT_TF'
You can estimate body fat with just a tape measure. The <strong>US Navy method</strong> uses your height and the circumference of your neck and waist (plus hips for women), and is usually within about <strong>3–4 percentage points</strong> of lab tests. Healthy ranges are roughly 14–24% for men and 21–31% for women.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>The US Navy formula</h2>
<div class="formula">Men:   %BF = 495 ÷ (1.0324 − 0.19077 × log10(waist − neck)
                  + 0.15456 × log10(height)) − 450
Women: %BF = 495 ÷ (1.29579 − 0.35004 × log10(waist + hip − neck)
                  + 0.22100 × log10(height)) − 450
(all measurements in centimetres)</div>
<p>The US military developed it to assess fitness quickly without lab equipment. It's based on the fact that fat collects around the waist and hips, while neck size reflects overall frame and muscle.</p>

<h2>How to measure</h2>
<ul>
<li>Use a flexible tape, snug but not compressing the skin, and measure in the morning before eating.</li>
<li><strong>Neck:</strong> just below the Adam's apple (larynx), tape sloping slightly down at the front.</li>
<li><strong>Waist:</strong> men at the navel; women at the narrowest point. Stand relaxed and breathe out normally.</li>
<li><strong>Hips (women):</strong> at the widest point of the buttocks.</li>
<li>Take each measurement twice and use the average.</li>
</ul>

<h2>Body fat categories</h2>
<div class="scroll"><table class="tbl">
<thead><tr><th>Category</th><th class="n">Women</th><th class="n">Men</th></tr></thead>
<tbody>
<tr><td>Essential fat</td><td class="n">10–13%</td><td class="n">2–5%</td></tr>
<tr><td>Athletes</td><td class="n">14–20%</td><td class="n">6–13%</td></tr>
<tr><td>Fitness</td><td class="n">21–24%</td><td class="n">14–17%</td></tr>
<tr><td>Average</td><td class="n">25–31%</td><td class="n">18–24%</td></tr>
<tr><td>Obese</td><td class="n">32%+</td><td class="n">25%+</td></tr>
</tbody></table></div>
<p>Source: American Council on Exercise. Women naturally carry more essential fat than men.</p>

<h2>Body fat versus BMI</h2>
<p>BMI only uses height and weight, so it can label a muscular person "overweight". Body fat percentage measures what you actually care about. Tracking your waist measurement and body fat every few weeks shows progress even when the scale doesn't move, for example when you gain muscle while losing fat.</p>

<h2>Other measurement methods</h2>
<p>DEXA scans are the most accurate widely available method. Bioimpedance scales are convenient but vary with hydration. Skinfold calipers are accurate in trained hands. For tracking change over time, consistency matters more than the method.</p>

<h2>Measuring correctly</h2>
<p>Small measuring errors change the result a lot, so take each measurement twice and use the average. Measure in the morning before eating, standing relaxed, with the tape snug but not pressing into the skin. Measure the neck just below the larynx (Adam's apple), the waist at the navel for men and at the narrowest point for women, and the hips at the widest point. Track the trend over weeks rather than reacting to a single reading.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I measure my body fat at home?',
      <<<'EOT_TF'
Measure your height, neck and waist (and hips for women) with a tape measure and enter them here. The US Navy method estimates your body fat percentage.
EOT_TF,
    ],
    [
      'What is a healthy body fat percentage?',
      'Roughly 14–24% for men and 21–31% for women, according to the American Council on Exercise.',
    ],
    [
      'How accurate is the US Navy body fat formula?',
      <<<'EOT_TF'
Usually within about 3–4 percentage points of laboratory methods, if measurements are taken carefully.
EOT_TF,
    ],
    [
      'Is body fat percentage better than BMI?',
      'For individuals, usually yes, because it distinguishes fat from muscle.',
    ],
    [
      'Can I use inches?',
      'Yes. Switch to inches and enter every measurement in inches.',
    ],
  ],
];
