module.exports = {
  order: 3,
  category: 'money',
  icon: 'landmark',
  appCategory: 'FinanceApplication',
  name: 'Loan Calculator',
  keywords: 'emi calculator monthly payment car loan personal loan mortgage amortization',
  short: 'Monthly payment, total interest and a yearly schedule for any loan.',
  title: 'Loan Calculator: Monthly Payment (EMI) & Total Interest',
  description: 'Work out the monthly payment (EMI) for a car, personal or home loan, the total interest you’ll pay, and how much overpaying saves. With yearly schedule.',
  related: ['percentage-calculator', 'discount-calculator', 'days-between-dates'],
  answer: `For a standard repayment loan, the monthly payment is <strong>P × i ÷ (1 − (1 + i)<sup>−n</sup>)</strong>, where P is the amount borrowed, i the monthly interest rate and n the number of months. Borrowing 25,000 at 7.5% a year over 5 years costs <strong>500.95 a month</strong> and about 5,057 in total interest.`,
  article: `
<h2>The loan payment formula</h2>
<p>Most car loans, personal loans and mortgages are <strong>amortising</strong> loans: you pay the same amount every month, and each payment covers that month's interest plus a slice of the amount you borrowed (the principal). The fixed payment that clears the loan exactly on time is:</p>
<div class="formula">Monthly payment = P × i ÷ (1 − (1 + i)^−n)

P = amount borrowed
i = yearly rate ÷ 100 ÷ 12   (7.5% → 0.00625)
n = number of monthly payments (5 years → 60)

25,000 × 0.00625 ÷ (1 − 1.00625^−60) = 500.95</div>
<p>In India and some other countries this is called the <strong>EMI</strong> (equated monthly instalment). The formula is the same.</p>

<h2>Why early payments are mostly interest</h2>
<p>Each month, interest is charged on the balance still owed. At the start the balance is highest, so most of your payment goes on interest and little reduces the debt. As the balance falls, the interest part shrinks and the principal part grows. The yearly schedule below the calculator shows this shift.</p>

<h2>How the term changes what you pay</h2>
<div class="scroll"><table class="tbl">
<thead><tr><th>25,000 at 7.5%</th><th class="n">Monthly</th><th class="n">Total interest</th></tr></thead>
<tbody>
<tr><td>3 years</td><td class="n">777.66</td><td class="n">2,996</td></tr>
<tr><td>5 years</td><td class="n">500.95</td><td class="n">5,057</td></tr>
<tr><td>7 years</td><td class="n">383.46</td><td class="n">7,210</td></tr>
</tbody></table></div>
<p>A longer term lowers the monthly payment but increases the total interest, because you owe money for longer.</p>

<h2>Paying extra each month</h2>
<p>Any extra payment goes straight to reducing the principal, so every later month charges interest on a smaller balance. Even a small overpayment can take months off a loan and save a large share of the interest. Enter an amount in "extra payment" to see the effect. Check first whether your lender charges early repayment fees.</p>

<h2>APR versus interest rate</h2>
<p>Lenders often quote an APR (annual percentage rate), which includes arrangement fees as well as interest. To compare offers fairly, compare APRs. To calculate the payment on a loan you've already agreed, use the interest rate in your contract.</p>

<p><em>This calculator is for estimates. Your lender's figures may differ slightly because of fees, rounding or how they count days.</em></p>`,
  faqs: [
    ['How is the monthly loan payment calculated?', 'Monthly payment = P × i ÷ (1 − (1 + i)^−n), where P is the loan amount, i is the yearly rate divided by 1,200, and n is the number of months.'],
    ['What is EMI?', 'EMI stands for equated monthly instalment: the fixed monthly payment on a loan. It uses the same formula as this calculator.'],
    ['How much interest will I pay on my loan?', 'Total interest is the monthly payment multiplied by the number of months, minus the amount borrowed. The calculator shows it directly.'],
    ['Does paying extra reduce my loan?', 'Yes. Extra payments reduce the principal, so you pay less interest and finish sooner. Enter an extra amount to see the saving.'],
    ['Can I use this for a mortgage?', 'Yes, for a standard repayment mortgage. Enter the amount borrowed, the interest rate and the term in years. Taxes and insurance are not included.'],
  ],
};
