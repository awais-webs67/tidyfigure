<?php
// GPA Calculator: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'GPA Calculator',
  'updated' => '2026-10-22', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'study',
  'order' => 1,
  'icon' => 'graduation-cap',
  'popular' => true,
  'appCategory' => 'EducationalApplication',
  'keywords' => <<<'EOT_TF'
gpa calculator cgpa cumulative gpa semester gpa college grade point average 4.0 scale letter grades credits
EOT_TF,
  'short' => 'Semester and cumulative GPA from letter grades and credits, on a 4.0 or 4.3 scale.',
  'title' => 'GPA Calculator: Semester & Cumulative GPA (4.0 Scale)',
  'description' => <<<'EOT_TF'
Calculate your semester GPA from letter grades and credit hours, and your new cumulative GPA. Supports the 4.0 and 4.3 scales. Free, instant, no sign-up.
EOT_TF,
  'related' => ['grade-calculator', 'percentage-calculator', 'flashcard-maker'],
  'answer' => <<<'EOT_TF'
GPA = <strong>total grade points ÷ total credits</strong>, where each course's grade points are its credits × the grade value (A = 4.0, B = 3.0 and so on). For example, A- in a 4-credit course, B+ in 3 credits, B in 4 credits and A in 3 credits gives 48.7 ÷ 14 = a <strong>3.48</strong> GPA.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>How GPA is calculated</h2>
<div class="formula">Grade points for a course = credits × grade value
GPA = sum of grade points ÷ sum of credits

Calculus      4 credits × 3.7 (A-) = 14.8
English Lit   3 credits × 3.3 (B+) =  9.9
Chemistry     4 credits × 3.0 (B)  = 12.0
World History 3 credits × 4.0 (A)  = 12.0
Total: 48.7 ÷ 14 credits = 3.48</div>
<p>Courses with more credits count for more, so a B in a 4-credit lab science moves your GPA more than an A in a 1-credit seminar.</p>

<h2>Letter grades on the 4.0 scale</h2>
<div class="scroll"><table class="tbl">
<thead><tr><th>Grade</th><th class="n">Points</th><th>Typical %</th></tr></thead>
<tbody>
<tr><td>A+ / A</td><td class="n">4.0</td><td>93–100</td></tr>
<tr><td>A-</td><td class="n">3.7</td><td>90–92</td></tr>
<tr><td>B+</td><td class="n">3.3</td><td>87–89</td></tr>
<tr><td>B</td><td class="n">3.0</td><td>83–86</td></tr>
<tr><td>B-</td><td class="n">2.7</td><td>80–82</td></tr>
<tr><td>C+</td><td class="n">2.3</td><td>77–79</td></tr>
<tr><td>C</td><td class="n">2.0</td><td>73–76</td></tr>
<tr><td>C-</td><td class="n">1.7</td><td>70–72</td></tr>
<tr><td>D+ / D / D-</td><td class="n">1.3 / 1.0 / 0.7</td><td>60–69</td></tr>
<tr><td>F</td><td class="n">0.0</td><td>below 60</td></tr>
</tbody></table></div>
<p>This is the most common US scale. Some schools give A+ a value of <strong>4.3</strong>; choose that scale above if yours does. Percentage cut-offs vary between schools and teachers, so check your syllabus.</p>

<h2>Cumulative GPA</h2>
<p>Your cumulative GPA (sometimes called CGPA) covers every course you've taken, not just this term. To update it, the calculator combines your old grade points with the new ones:</p>
<div class="formula">New cumulative GPA = (old GPA × old credits + this term's grade points) ÷ (old credits + this term's credits)

(3.20 × 30 + 48.7) ÷ (30 + 14) = 144.7 ÷ 44 = 3.29</div>
<p>The more credits you've already completed, the less one term can change your cumulative GPA. That's why improving early in your degree has the biggest effect.</p>

<h2>What's a good GPA?</h2>
<ul>
<li><strong>3.5 and above</strong> is excellent and often needed for honours lists and competitive graduate programmes.</li>
<li><strong>3.0</strong> (a B average) is a common minimum for scholarships and many graduate schools.</li>
<li><strong>2.0</strong> (a C average) is often the minimum to stay in good academic standing.</li>
</ul>

<h2>Other grading systems</h2>
<p>Many countries use different systems: percentages, 10-point CGPA scales (India and Pakistan), 1–5 or 1–7 scales, or degree classes in the UK. Converting between them isn't exact, and universities usually publish their own conversion tables, so use those for applications. To find what you need on a final exam, use the <a href="/grade-calculator">grade calculator</a>.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I calculate my GPA?',
      'Multiply each course’s credits by its grade value, add them up, and divide by the total credits.',
    ],
    [
      'What is the difference between GPA and cumulative GPA?',
      'Term GPA covers one semester. Cumulative GPA covers every course you have completed.',
    ],
    [
      'Is an A+ worth more than an A?',
      'On the standard 4.0 scale both are 4.0. Some schools use a 4.3 scale where A+ is worth 4.3.',
    ],
    [
      'How can I raise my GPA quickly?',
      <<<'EOT_TF'
Do well in courses with the most credits, and retake failed courses if your school replaces the old grade.
EOT_TF,
    ],
    [
      'Do pass/fail courses count in GPA?',
      'Usually not. Pass/fail courses earn credits but no grade points, so leave them out.',
    ],
  ],
];
