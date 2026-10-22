onAny('#inc, #debts, #down, #rate, #term, #tax, #hoa, input[name="rule"]', calc);
const pmt = (P, rate, n) => { const i = rate / 1200; return i ? P * i / (1 - Math.pow(1 + i, -n)) : P / n; };
function calc() {
  const inc = val($('#inc')), debts = val($('#debts')) || 0, down = val($('#down')) || 0, rate = val($('#rate')), n = +$('#term').value * 12;
  const t = (val($('#tax')) || 0) / 100 / 12, hoa = val($('#hoa')) || 0, [fr, br] = $('input[name="rule"]:checked').value.split('-').map(Number);
  const out = $('#out');
  if (!(inc > 0) || !(rate >= 0)) { out.innerHTML = '<p class="empty">Enter your income and the interest rate.</p>'; return; }
  const front = inc / 12 * fr / 100, back = inc / 12 * br / 100 - debts, max = Math.min(front, back) - hoa;
  if (max <= 0) { out.innerHTML = `<p class="kicker">Affordable home price</p><span class="verdict no">Debts too high</span><p class="sub">Your other debt payments already use up the ${br}% of income lenders usually allow. Paying down debts first raises what you can borrow.</p>`; return; }
  const k = pmt(1, rate, n), price = (max + down * k) / (k + t);
  const loan = Math.max(0, price - down), pi = pmt(loan, rate, n), ti = price * t;
  const limit = front - hoa <= back - hoa ? `the ${fr}% housing limit` : `the ${br}% total-debt limit`;
  out.innerHTML = `<p class="kicker">You could afford a home of about</p><p class="huge" style="text-align:left"><mark>${fmt(price, 0)}</mark></p>
    <p class="sub">with a loan of ${fmt(loan, 0)} and ${fmt(down, 0)} down (${fmtMax(down / price * 100, 1)}% deposit).</p>
    <div class="statgrid"><div class="stat"><b>${fmt(max + hoa, 0)}</b><span>Max monthly housing cost</span></div><div class="stat"><b>${fmt(pi, 0)}</b><span>Mortgage payment (P&amp;I)</span></div></div>
    <div class="scroll"><table class="tbl"><tbody>
      <tr><td>Principal &amp; interest</td><td class="n">${fmt(pi)}</td></tr>
      <tr><td>Property tax &amp; insurance</td><td class="n">${fmt(ti)}</td></tr>
      ${hoa ? `<tr><td>HOA / service charge</td><td class="n">${fmt(hoa)}</td></tr>` : ''}
    </tbody><tfoot><tr><td>Total per month</td><td class="n">${fmt(pi + ti + hoa)}</td></tr></tfoot></table></div>
    <p class="note">Limited by ${limit}: housing ${fmt(front, 0)} a month (${fr}% of income), all debts ${fmt(back + debts, 0)} (${br}%). Total interest over ${n / 12} years: ${fmt(pi * n - loan, 0)}.</p>
    ${down / price < 0.2 ? '<p class="note">With less than 20% down, many lenders add mortgage insurance, which lowers what you can afford slightly.</p>' : ''}`;
}
calc();
