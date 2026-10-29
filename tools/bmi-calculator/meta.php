<?php
// BMI Calculator: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'BMI Calculator',
  'updated' => '2026-10-30', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'health',
  // Published sources for the method on this page (shown as a Sources list).
  'sources' => [
    ['World Health Organization: Obesity and overweight (BMI categories)', 'https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight'],
    ['NHS: Calculate your body mass index (BMI) for adults', 'https://www.nhs.uk/health-assessment-tools/calculate-your-body-mass-index/calculate-bmi-for-adults'],
  ],
  'order' => 2,
  'icon' => 'activity',
  'appCategory' => 'HealthApplication',
  'keywords' => 'body mass index healthy weight bmi chart kg lb',
  'short' => 'Body mass index in kg/cm or lb/ft, with your healthy weight range.',
  'title' => 'BMI Calculator: Body Mass Index & Healthy Weight Range',
  'description' => <<<'EOT_TF'
Calculate your BMI (body mass index) in metric or imperial units, see your WHO weight category, and find the healthy weight range for your height.
EOT_TF,
  'related' => ['percentage-calculator', 'age-calculator', 'unit-converter'],
  'answer' => <<<'EOT_TF'
BMI is your <strong>weight in kilograms divided by your height in metres squared</strong>. For adults, a BMI of <strong>18.5 to 24.9</strong> is considered a healthy weight, 25 to 29.9 overweight, and 30 or more obese. Enter your height and weight to see your BMI and the healthy weight range for your height.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>How BMI is calculated</h2>
<div class="formula">Metric:   BMI = weight (kg) ÷ height (m)²
Imperial: BMI = 703 × weight (lb) ÷ height (in)²

Example: 72 kg, 1.75 m → 72 ÷ (1.75 × 1.75) = 72 ÷ 3.0625 = 23.5</div>
<p>Body mass index was devised in the 1830s by the Belgian mathematician Adolphe Quetelet and adopted by the World Health Organization as a quick way to screen populations for weight-related health risks.</p>

<h2>BMI categories for adults</h2>
<div class="scroll"><table class="tbl">
<thead><tr><th>BMI</th><th>Category (WHO)</th></tr></thead>
<tbody>
<tr><td class="n">below 18.5</td><td>Underweight</td></tr>
<tr><td class="n">18.5 – 24.9</td><td>Healthy weight</td></tr>
<tr><td class="n">25.0 – 29.9</td><td>Overweight</td></tr>
<tr><td class="n">30.0 – 34.9</td><td>Obesity class I</td></tr>
<tr><td class="n">35.0 – 39.9</td><td>Obesity class II</td></tr>
<tr><td class="n">40 and above</td><td>Obesity class III</td></tr>
</tbody></table></div>
<p>Some health services use lower thresholds for people of South Asian, Chinese, other Asian, Middle Eastern, Black African or African-Caribbean background, because health risks rise at a lower BMI. For example, the UK's NHS uses 23 and 27.5 as the overweight and obesity cut-offs for these groups.</p>

<h2>What BMI doesn't tell you</h2>
<p>BMI is a useful starting point, but it only uses height and weight. It can't tell muscle from fat, so athletes and very muscular people can show as "overweight" while being very lean. It also doesn't show <em>where</em> fat is stored: fat around the waist carries more health risk than fat elsewhere. A simple extra check is waist-to-height ratio: your waist measurement should be less than half your height.</p>
<p>BMI isn't used the same way for children and teenagers, whose healthy range changes with age and sex; doctors use growth charts instead. It also doesn't apply during pregnancy.</p>

<h2>Healthy weight range</h2>
<p>The healthy range shown is the weight that gives a BMI from 18.5 to 24.9 at your height:</p>
<div class="formula">Lowest healthy weight  = 18.5 × height (m)²
Highest healthy weight = 24.9 × height (m)²</div>
<p>At 1.75 m, that's about 56.7 kg to 76.3 kg (125 to 168 lb). If you're outside your range, a doctor or dietitian can help you set a realistic goal. Even a 5–10% change in weight can make a meaningful difference to health.</p>
EOT_TF,
  'faqs' => [
    [
      'What is a healthy BMI?',
      'For most adults, a BMI from 18.5 to 24.9 is considered a healthy weight.',
    ],
    [
      'How do I calculate BMI by hand?',
      <<<'EOT_TF'
Divide your weight in kilograms by your height in metres squared. In pounds and inches, multiply weight by 703 and divide by height in inches squared.
EOT_TF,
    ],
    [
      'Is BMI accurate for muscular people?',
      <<<'EOT_TF'
Not always. BMI can’t tell muscle from fat, so very muscular people may get a high BMI without excess fat.
EOT_TF,
    ],
    [
      'Can I use this BMI calculator for children?',
      <<<'EOT_TF'
No. Children and teenagers need BMI-for-age percentiles, which a doctor or child growth chart provides.
EOT_TF,
    ],
    [
      'What is the healthy weight for my height?',
      <<<'EOT_TF'
Enter your height and weight. The calculator shows the weight range that gives a BMI of 18.5 to 24.9 for your height.
EOT_TF,
    ],
  ],
];
