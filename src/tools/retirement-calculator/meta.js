module.exports = {
  order: 4,
  category: 'money',
  icon: 'sunset',
  appCategory: 'FinanceApplication',
  name: 'Retirement Calculator',
  keywords: 'retirement calculator how much do i need to retire pension savings 4 percent rule',
  short: 'Will your savings last? Projected pot, target and the gap, in today’s money.',
  title: 'Retirement Calculator: How Much Do I Need to Retire?',
  description: 'Project your retirement savings, compare them with the pot you need using the 4% rule, and see how much extra to save each month. All in today’s money. Free.',
  related: ['compound-interest-calculator', 'sip-calculator', 'inflation-calculator'],
  answer: `A common rule of thumb is that you need about <strong>25 times the yearly income</strong> you'll want from your savings (the "4% rule"). If you want 20,000 a year on top of any pension, aim for around 500,000 in today's money. Enter your numbers to see your projected pot, your target and how much extra to save if there's a gap.`,
  article: `
<h2>How the calculator works</h2>
<ol>
<li><strong>Growth:</strong> your current savings and monthly contributions grow at your expected return minus inflation (the "real" return), so all results are in today's money.</li>
<li><strong>Target:</strong> the income you want, minus other income like a state pension or social security, multiplied by 25.</li>
<li><strong>Gap:</strong> if the projected pot falls short, it calculates the extra monthly saving needed to close it.</li>
</ol>
<div class="formula">Real return  = (1 + return) ÷ (1 + inflation) − 1
Target pot   = (wanted income − other income) ÷ 0.04</div>

<h2>The 4% rule</h2>
<p>Based on US research from the 1990s (the "Trinity study"), withdrawing 4% of your starting pot in year one, then the same amount adjusted for inflation each year, historically lasted at least 30 years in almost all market conditions with a balanced portfolio. Retiring early or wanting more certainty? Many planners suggest 3–3.5%. It's a planning guide, not a promise.</p>

<h2>Why today's money matters</h2>
<p>At 2.5% inflation, prices roughly double in 28 years. A pot of 1 million in 35 years' time buys what about 420,000 buys today. Working in today's money avoids flattering, misleading big numbers.</p>

<h2>Ways to close a gap</h2>
<ul>
<li><strong>Start or increase contributions early:</strong> time is the most powerful lever.</li>
<li><strong>Use employer matching and tax relief</strong> in workplace pensions: it's free money.</li>
<li><strong>Keep fees low:</strong> a 1% yearly fee can cut a final pot by a fifth or more over decades.</li>
<li><strong>Work a little longer or part-time:</strong> each extra year adds contributions and shortens the drawdown period.</li>
<li><strong>Check your state pension</strong> entitlement; it's often a large part of retirement income.</li>
</ul>

<p><em>A simplified projection for planning. It doesn't include taxes, fees or market volatility. For important decisions, speak to a regulated financial adviser.</em></p>`,
  faqs: [
    ['How much do I need to retire?', 'Roughly 25 times the yearly income you want from savings, under the 4% rule. For 20,000 a year, about 500,000.'],
    ['What is the 4% rule?', 'A guideline that you can withdraw 4% of your retirement pot in the first year and adjust for inflation afterwards, with a high chance it lasts 30 years.'],
    ['What return should I assume?', 'Many planners use 4–7% a year before inflation for a diversified portfolio. Use a lower figure to be cautious.'],
    ['Why show results in today’s money?', 'Because inflation reduces what money will buy. Today’s money lets you compare the result with your current costs.'],
    ['Does this include my state pension?', 'Enter it as other yearly income. It reduces the pot you need.'],
  ],
};
