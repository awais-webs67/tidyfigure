module.exports = {
  order: 20,
  category: 'money',
  icon: 'briefcase',
  appCategory: 'BusinessApplication',
  name: 'Freelance Rate Calculator',
  keywords: 'freelance hourly rate calculator how much should i charge day rate contractor consultant pricing self employed',
  short: 'Work out the hourly and day rate you need to charge as a freelancer.',
  title: 'Freelance Rate Calculator: What Hourly & Day Rate to Charge',
  description: 'Find the hourly and day rate you need as a freelancer or contractor, from your target income, business costs, tax, time off and how many hours you can bill.',
  related: ['salary-converter', 'invoice-generator', 'break-even-calculator'],
  answer: `Hourly rate = <strong>(income you want ÷ (1 − tax rate) + business costs) ÷ billable hours a year</strong>. To keep 60,000 after 25% tax, with 6,000 of costs, 7 weeks off and 65% of an 8-hour day billable, you need to invoice 86,000 over 1,170 hours: about <strong>73.50 an hour</strong>, or a <strong>588 day rate</strong>.`,
  article: `
<h2>The formula</h2>
<div class="formula">Fees needed     = income you want ÷ (1 − tax rate) + business costs
Hours worked    = (52 − weeks off) × days per week × hours per day
Billable hours  = hours worked × billable %
Hourly rate     = fees needed ÷ billable hours

60,000 ÷ 0.75 + 6,000 = 86,000
45 weeks × 5 days × 8 hours = 1,800 hours × 65% = 1,170 billable
86,000 ÷ 1,170 = 73.50 an hour · × 8 = 588 a day</div>

<h2>Why freelancers charge more than employees earn per hour</h2>
<p>A salary of 60,000 works out at about 29 an hour over a full year. A freelancer charging 29 an hour would earn far less, because they have to cover what an employer normally pays for:</p>
<ul>
<li><strong>Unpaid time off:</strong> holidays, bank holidays and sick days earn nothing. Seven weeks off is realistic once you count them all.</li>
<li><strong>Non-billable work:</strong> marketing, proposals, admin, bookkeeping, chasing invoices and learning new skills.</li>
<li><strong>Business costs:</strong> equipment, software, insurance, accountant, co-working, travel, phone.</li>
<li><strong>Benefits:</strong> pension contributions, health insurance and paid leave that an employer would otherwise provide.</li>
<li><strong>Taxes and contributions</strong> that are sometimes higher for the self-employed.</li>
</ul>

<h2>How billable time changes the rate</h2>
<div class="scroll"><table class="tbl">
<thead><tr><th>Billable time</th><th class="n">Billable hours / yr</th><th class="n">Hourly rate</th></tr></thead>
<tbody>
<tr><td>50%</td><td class="n">900</td><td class="n">95.56</td></tr>
<tr><td>65%</td><td class="n">1,170</td><td class="n">73.50</td></tr>
<tr><td>80%</td><td class="n">1,440</td><td class="n">59.72</td></tr>
</tbody></table></div>
<p>New freelancers often spend half their time finding work, so plan for a lower billable share at first.</p>

<h2>Hourly, daily or project pricing?</h2>
<p>Your hourly rate is the minimum you need. How you present it can differ:</p>
<ul>
<li><strong>Day rates</strong> are common for contractors and consultants, and they stop clients counting every hour.</li>
<li><strong>Project prices</strong> work well once you can estimate the work accurately. Estimate the hours, multiply by your rate, then add 15–25% for changes and surprises.</li>
<li><strong>Value-based pricing</strong> charges according to what the work is worth to the client, which can be far above your hourly minimum.</li>
</ul>

<h2>Check the market</h2>
<p>The calculator tells you what you <em>need</em> to charge. Compare it with what clients in your field and location pay. If the market rate is lower, look at your costs, specialise, or target clients with bigger budgets. If it's higher, charge the market rate. Underpricing is one of the most common reasons freelancers give up.</p>
<p>Tax rates are entered as one combined percentage for simplicity. Real tax depends on your country, allowances and business structure, so check with an accountant. To turn your rate into a salary comparison, try the <a href="/salary-converter">salary converter</a>.</p>`,
  faqs: [
    ['How do I calculate my freelance hourly rate?', 'Divide the fees you need in a year (target income grossed up for tax, plus business costs) by the number of hours you can actually bill.'],
    ['What is a good billable percentage?', 'Most freelancers bill 50–75% of their working hours. The rest goes on admin, sales and learning.'],
    ['How do I convert an hourly rate to a day rate?', 'Multiply by the hours in your working day. At 73.50 an hour and 8 hours, the day rate is 588.'],
    ['Why is my freelance rate so much higher than a salary?', 'You pay for your own time off, equipment, insurance, pension and the hours spent finding work, which an employer would otherwise cover.'],
    ['Should I charge by the hour or by the project?', 'Use your hourly rate as the minimum, then quote project prices with a buffer once you can estimate the work well.'],
  ],
};
