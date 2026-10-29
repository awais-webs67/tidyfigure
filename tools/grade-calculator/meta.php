<?php
// Grade Calculator: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Grade Calculator',
  'updated' => '2026-10-22', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'study',
  'order' => 2,
  'icon' => 'calculator',
  'popular' => true,
  'appCategory' => 'EducationalApplication',
  'keywords' => <<<'EOT_TF'
final grade calculator what do i need on my final weighted grade calculator exam score needed class grade
EOT_TF,
  'short' => 'Your current weighted grade, and the score you need on the final to get the grade you want.',
  'title' => 'Final Grade Calculator: What Do I Need on My Final Exam?',
  'description' => <<<'EOT_TF'
Work out your current weighted grade and exactly what you need on the final exam, or remaining assignments, to finish with an A, B or any grade you choose.
EOT_TF,
  'related' => ['gpa-calculator', 'percentage-calculator', 'flashcard-maker'],
  'answer' => <<<'EOT_TF'
Score needed = <strong>(target grade − points already earned) ÷ weight still to come</strong>. With homework (20%) at 90, a midterm (30%) at 78 and a project (20%) at 85, you've earned 58.4 of 70 possible points, a current grade of 83.4%. To finish with 85%, you need <strong>88.7%</strong> on the 30% final.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>How weighted grades work</h2>
<p>Most courses don't average every score equally. Each assessment has a <strong>weight</strong>, the share of the final grade it's worth. Each score is multiplied by its weight, and the results are added up.</p>
<div class="formula">Points earned = score × weight ÷ 100, for each assessment
Current grade = points earned ÷ weight completed × 100

Homework  90% × 20 = 18.0
Midterm   78% × 30 = 23.4
Project   85% × 20 = 17.0
Earned: 58.4 points out of 70 → current grade 83.4%</div>

<h2>What you need on the final</h2>
<div class="formula">Needed = (target × total weight ÷ 100 − points earned) ÷ weight left × 100

For 85%: (85 − 58.4) ÷ 30 × 100 = 88.7%
For 80%: (80 − 58.4) ÷ 30 × 100 = 72.0%
For 90%: (90 − 58.4) ÷ 30 × 100 = 105.3% → not possible</div>
<p>If the answer is over 100%, the target can't be reached unless there's extra credit. If it's 0% or less, you've already secured that grade.</p>

<h2>Using the calculator</h2>
<ol>
<li>Copy the weights from your syllabus or course outline. They should add up to 100%.</li>
<li>Enter your scores as percentages for everything you've already done. For a score like 42 out of 50, enter 84.</li>
<li>Leave the score empty for anything still to come: the final exam, the last project, or several remaining tests.</li>
<li>Type the overall grade you want. The table also shows what you need for an A, B, C or D.</li>
</ol>
<p>If several assessments are still to come, the result is the <strong>average</strong> you need across them, weighted by how much each is worth.</p>

<h2>Common grading setups</h2>
<ul>
<li><strong>Points-based courses:</strong> if your teacher adds up points (say 1,000 in total), each assessment's weight is its points divided by the total.</li>
<li><strong>Dropped scores:</strong> if the lowest quiz is dropped, leave it out.</li>
<li><strong>Category weights:</strong> enter each category (homework, quizzes, exams) as one row using your average score in it.</li>
</ul>

<h2>Study smarter for the final</h2>
<p>Knowing the exact score you need helps you plan. If you need 72%, focus on securing the core topics; if you need 95%, every detail matters. Spaced practice with the <a href="/flashcard-maker">flashcard maker</a> is one of the most effective ways to remember material. To see how this course affects your overall average, use the <a href="/gpa-calculator">GPA calculator</a>.</p>
<p>Letter grade boundaries shown (A = 90, B = 80, C = 70, D = 60) are common in the US, but your school's may differ.</p>
EOT_TF,
  'faqs' => [
    [
      'What do I need on my final to get an A?',
      <<<'EOT_TF'
Enter your scores so far, leave the final empty, and the table shows the score needed for an A (90%), B, C and D.
EOT_TF,
    ],
    [
      'How do I calculate my weighted grade?',
      'Multiply each score by its weight, add the results, and divide by the total weight completed.',
    ],
    [
      'What if my weights don’t add up to 100%?',
      <<<'EOT_TF'
The calculator scales results to the weights you entered, and shows a note. Check your syllabus for the correct weights.
EOT_TF,
    ],
    ['How do I enter a score like 42 out of 50?', 'Convert it to a percentage first: 42 ÷ 50 × 100 = 84%.'],
    [
      'What if I need more than 100%?',
      'Then the target can’t be reached without extra credit. Look at the next grade down in the table.',
    ],
  ],
];
