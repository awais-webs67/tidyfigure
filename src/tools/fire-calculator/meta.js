module.exports = {
  order: 15,
  category: 'money',
  icon: 'flame',
  appCategory: 'FinanceApplication',
  name: 'FIRE Calculator',
  keywords: 'fire calculator financial independence retire early 4% rule fire number coast fire lean fire when can i retire',
  short: 'Your FIRE number and how many years until you’re financially independent.',
  title: 'FIRE Calculator: Financial Independence & Early Retirement',
  description: 'Work out your FIRE number with the 4% rule, how many years until financial independence, the age you reach it, plus your Lean FIRE and Coast FIRE numbers.',
  related: ['retirement-calculator', 'compound-interest-calculator', 'savings-goal-calculator'],
  answer: `Your <strong>FIRE number</strong> is the amount invested that lets you live off your portfolio: yearly spending × 25, using the 4% rule. Spending 40,000 a year means a target of <strong>1,000,000</strong>. Starting from 100,000 and investing 30,000 a year at a 5% real return, you'd reach it in about <strong>17 years</strong>.`,
  article: `
<h2>What FIRE means</h2>
<p><strong>FIRE</strong> stands for <em>Financial Independence, Retire Early</em>. You're financially independent when your investments can pay for your living costs indefinitely, so work becomes optional. People pursuing FIRE save a large share of their income, often 30–70%, and invest it, usually in low-cost index funds.</p>

<h2>The 4% rule</h2>
<div class="formula">FIRE number = yearly spending ÷ withdrawal rate
            = yearly spending × 25   (at 4%)

40,000 ÷ 0.04 = 1,000,000</div>
<p>The 4% rule comes from US research in the 1990s (often called the Trinity study). It found that withdrawing 4% of a stock-and-bond portfolio in the first year, then raising the amount with inflation, lasted at least 30 years in almost all historical periods. Early retirees may need their money to last 40–60 years, so many choose <strong>3–3.5%</strong> for extra safety, which means a target of 29–33 times spending.</p>

<h2>How the years to FIRE are worked out</h2>
<p>Each year, your investments grow by the return you entered, and then your yearly savings are added:</p>
<div class="formula">Next year = this year × (1 + return) + yearly savings

Example: 100,000 now, 30,000 a year, 5% real return
Year 1: 100,000 × 1.05 + 30,000 = 135,000
Year 2: 135,000 × 1.05 + 30,000 = 171,750
… Year 17: 1,004,413 → past the 1,000,000 target</div>
<div class="scroll"><table class="tbl">
<thead><tr><th>Same example, but…</th><th class="n">Years to FIRE</th></tr></thead>
<tbody>
<tr><td>As above (30,000 a year, 5%)</td><td class="n">17</td></tr>
<tr><td>Save 20,000 a year instead</td><td class="n">22</td></tr>
<tr><td>Earn 7% instead of 5%</td><td class="n">15</td></tr>
</tbody></table></div>
<p>The biggest lever is usually your <strong>savings rate</strong>: spending less both increases what you invest and lowers the target you need.</p>

<h2>Types of FIRE</h2>
<ul>
<li><strong>Lean FIRE:</strong> a minimalist lifestyle on a smaller budget. Shown above as 70% of your spending.</li>
<li><strong>Fat FIRE:</strong> retiring with a generous budget, so a much bigger target.</li>
<li><strong>Coast FIRE:</strong> you've saved enough that growth alone will reach your FIRE number by traditional retirement age (65 here). You still work to cover today's costs, but no longer need to save.</li>
<li><strong>Barista FIRE:</strong> part-time work covers some costs, so investments only cover the rest.</li>
</ul>

<h2>Why use a "real" return?</h2>
<p>If investments earn 8% while prices rise 3%, your buying power grows by about 5%. Using the return after inflation keeps every number in today's money, so a FIRE number of 1,000,000 means 1,000,000 of today's spending power. Long-term stock returns have historically been around 5–7% above inflation, but returns vary a lot from year to year and aren't guaranteed.</p>

<h2>Things the simple model leaves out</h2>
<ul>
<li><strong>Taxes</strong> on withdrawals, which depend on your country and account types.</li>
<li><strong>Healthcare</strong> before state cover begins, which can be a major cost in some countries.</li>
<li><strong>Pensions and state benefits</strong> that start later, which reduce what you need from investments.</li>
<li><strong>Sequence risk:</strong> a market crash just after you retire hurts more than one later on.</li>
</ul>
<p>For a traditional retirement plan, use the <a href="/retirement-calculator">retirement calculator</a>. <em>This calculator is for education, not financial advice.</em></p>`,
  faqs: [
    ['What is my FIRE number?', 'Your yearly spending divided by your safe withdrawal rate. With the 4% rule, that is 25 times your yearly spending.'],
    ['Is the 4% rule safe for early retirement?', 'It was tested for 30-year retirements. For 40 years or more, many people use 3–3.5% for extra safety.'],
    ['What is Coast FIRE?', 'The amount you need invested now so that growth alone reaches your FIRE number by retirement age, with no more saving.'],
    ['What return should I use?', 'Use a return after inflation. 4–6% is a common long-term assumption for a stock-heavy portfolio, but real returns vary and are not guaranteed.'],
    ['How can I reach FIRE faster?', 'Raise your savings rate. Spending less helps twice: you invest more, and you need a smaller FIRE number.'],
  ],
};
