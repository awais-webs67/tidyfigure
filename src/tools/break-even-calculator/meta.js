module.exports = {
  order: 19,
  category: 'money',
  icon: 'chart-line',
  appCategory: 'BusinessApplication',
  name: 'Break-Even Calculator',
  keywords: 'break even point calculator units sales fixed costs variable costs contribution margin small business',
  short: 'How many units you must sell to cover your costs, and to hit a profit target.',
  title: 'Break-Even Calculator: Units & Sales to Cover Your Costs',
  description: 'Find your break-even point in units and sales from fixed costs, price and variable cost. Shows contribution margin, units for a profit target and safety margin.',
  related: ['profit-margin-calculator', 'freelance-rate-calculator', 'roi-calculator'],
  answer: `Break-even units = <strong>fixed costs ÷ (price − variable cost per unit)</strong>. With 6,000 of fixed costs a month, a price of 25 and a variable cost of 10, each sale contributes 15, so you break even at <strong>400 units</strong> (10,000 in sales). To make 3,000 profit, you need 600 units.`,
  article: `
<h2>The break-even formula</h2>
<div class="formula">Contribution per unit = price − variable cost per unit
Break-even units      = fixed costs ÷ contribution per unit
Break-even sales      = break-even units × price
Units for a profit    = (fixed costs + target profit) ÷ contribution

Example: 6,000 ÷ (25 − 10) = 6,000 ÷ 15 = 400 units = 10,000 in sales
For 3,000 profit: (6,000 + 3,000) ÷ 15 = 600 units</div>
<p>The <strong>break-even point</strong> is where total sales exactly cover total costs: no profit and no loss. Every unit sold after that adds its contribution (15 in the example) to profit.</p>

<h2>Fixed and variable costs</h2>
<div class="scroll"><table class="tbl">
<thead><tr><th>Fixed costs (per month)</th><th>Variable costs (per unit)</th></tr></thead>
<tbody>
<tr><td>Rent and business rates</td><td>Raw materials and ingredients</td></tr>
<tr><td>Salaries (not commission)</td><td>Packaging</td></tr>
<tr><td>Software, website, phone</td><td>Card and marketplace fees</td></tr>
<tr><td>Insurance, accounting</td><td>Shipping to the customer</td></tr>
<tr><td>Loan repayments, equipment lease</td><td>Sales commission</td></tr>
</tbody></table></div>
<p>Make sure all costs are counted once and for the same period. If fixed costs are monthly, the break-even is in units per month.</p>

<h2>Contribution margin</h2>
<p>The <strong>contribution margin ratio</strong> is the share of each sale left over to pay fixed costs and then profit: (price − variable cost) ÷ price. In the example, 15 ÷ 25 = 60%. A high ratio means sales quickly turn into profit once fixed costs are covered. A low ratio (common in retail and food) means you need high volume.</p>

<h2>Margin of safety</h2>
<p>If you expect to sell more than the break-even amount, the margin of safety shows how far sales could fall before you lose money. Expecting 550 units with a break-even of 400 gives a margin of 150 units, or 27.3% of expected sales. A bigger margin means less risk.</p>

<h2>Ways to lower your break-even point</h2>
<ul>
<li><strong>Raise prices.</strong> Even a small increase has a big effect: at 27 instead of 25, contribution rises to 17 and break-even falls to 353 units.</li>
<li><strong>Cut variable costs</strong> by buying in bulk, changing suppliers or lowering payment fees.</li>
<li><strong>Cut fixed costs,</strong> such as unused subscriptions or space.</li>
<li><strong>Sell more profitable products.</strong> If you sell several products, work out each one's contribution and promote the best.</li>
</ul>

<h2>Limits of a simple break-even</h2>
<p>The calculation assumes the price and variable cost per unit stay the same at every volume, and that you sell everything you make. In real life, discounts, bulk buying and extra staff at higher volumes change the numbers. It's still one of the most useful quick checks before launching a product, setting a price or signing a lease. To check pricing on a single product, use the <a href="/profit-margin-calculator">profit margin calculator</a>.</p>`,
  faqs: [
    ['How do I calculate the break-even point?', 'Divide your fixed costs by the contribution per unit (selling price minus variable cost per unit). The result is the number of units you must sell.'],
    ['What is contribution margin?', 'The amount each sale contributes to fixed costs and profit: price minus variable cost. As a ratio, divide that by the price.'],
    ['How do I calculate break-even in sales value?', 'Multiply the break-even units by the price, or divide fixed costs by the contribution margin ratio.'],
    ['What if my price is lower than my variable cost?', 'Then you lose money on every sale and can never break even. Raise the price or lower the cost per unit.'],
    ['How many units do I need to sell to make a profit?', 'Add your target profit to fixed costs and divide by the contribution per unit.'],
  ],
};
