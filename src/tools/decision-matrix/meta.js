module.exports = {
  order: 9,
  category: 'life',
  icon: 'scale',
  name: 'Decision Matrix Calculator',
  short: 'Weigh up jobs, flats, cars or anything else, and see how close the call really is.',
  title: 'Decision Matrix Calculator: Weighted Scoring for Big Choices',
  description: 'Compare options with a weighted decision matrix. Score jobs, homes, cars or schools on what matters to you, then see if the result holds up. Free.',
  related: ['furniture-fit-calculator', 'rent-split-calculator', 'unit-price-calculator'],
  answer: `A decision matrix scores each option on the factors that matter, multiplies each score by how important that factor is, and adds them up. The highest total is the best fit <em>for your priorities</em>. This calculator also checks whether the winner would change if you'd weighted one factor differently, so you know if it's a clear result or a close call.`,
  article: `
<h2>What a weighted decision matrix is</h2>
<p>Big decisions get stuck because we compare options on several things at once. One flat is cheaper, the other is brighter, the third is closer to work. A decision matrix (also called a weighted scoring model or Pugh matrix) breaks the decision into factors, makes you say how much each factor matters, and then scores every option on every factor.</p>
<p>It doesn't make the decision for you. It shows you what your own priorities imply, which is often surprisingly different from your gut feeling, and that difference is useful in itself.</p>

<h2>How the score is calculated</h2>
<div class="formula">Weighted score of an option = Σ (factor weight × option's score on that factor)
Maximum possible             = Σ (factor weight × 10)</div>
<p>Weights run from 1 (nice to have) to 5 (critical). Scores run from 1 (poor) to 10 (excellent). Showing the result as a percentage of the maximum makes options easy to compare at a glance.</p>

<h2>Is it a clear result or a close call?</h2>
<p>Weights are the most subjective part of any matrix. To show how much your answer depends on them, the calculator re-runs the matrix with each factor's weight set to 1 and to 5, one at a time. If the winner never changes, the result is robust. If it flips, you'll see exactly which factor decides the outcome, and that's usually the real question you need to think about.</p>

<h2>Worked example: choosing a place to live</h2>
<p>Three options are scored on cost (weight 5), commute (4), space (3), natural light (2) and neighbourhood (3):</p>
<ul>
<li>Flat on Elm St: 6, 8, 5, 4, 6 → 30 + 32 + 15 + 8 + 18 = <strong>103</strong></li>
<li>Flat by the park: 4, 5, 8, 9, 9 → 20 + 20 + 24 + 18 + 27 = <strong>109</strong></li>
<li>House share: 9, 6, 4, 6, 5 → 45 + 24 + 12 + 12 + 15 = <strong>108</strong></li>
</ul>
<p>The flat by the park wins, but only by one point over the house share. If cost mattered a little less, or the neighbourhood less, the answer changes. That tells you the real decision is how much you value saving money against living somewhere you enjoy.</p>

<h2>Tips for a useful matrix</h2>
<ul>
<li><strong>Keep factors independent.</strong> "Rent" and "total monthly cost" overlap and count the same thing twice.</li>
<li><strong>Set weights before scoring.</strong> Otherwise it's tempting to tweak weights until your favourite wins.</li>
<li><strong>Use 5–7 factors.</strong> Fewer misses things; more drowns the important ones.</li>
<li><strong>Turn deal-breakers into rules.</strong> If an option fails something non-negotiable, remove it instead of scoring it low.</li>
<li><strong>Notice your reaction.</strong> If you feel disappointed by the winner, a factor is missing or a weight is wrong.</li>
</ul>`,
  faqs: [
    ['How do you make a weighted decision matrix?', 'List your options and the factors that matter. Give each factor a weight for importance, score each option on each factor, multiply scores by weights and add them up. The highest total best fits your priorities.'],
    ['What is the difference between a decision matrix and a pros and cons list?', 'A pros and cons list treats every point as equally important. A weighted matrix makes you say how much each factor matters and scores every option on the same factors, so options can be compared fairly.'],
    ['How many criteria should a decision matrix have?', 'Five to seven factors works well for most personal decisions. Too few misses important differences; too many makes small factors add up and drown out the ones that matter most.'],
    ['What if two options have almost the same score?', 'Look at the sensitivity note. It shows which factor’s weight decides the result. Think carefully about that one factor, or gather more information about it.'],
    ['Can I use this for job offers or choosing a car?', 'Yes. Rename the options and factors to anything: salary, growth and commute for a job; price, running costs and reliability for a car.'],
  ],
};
