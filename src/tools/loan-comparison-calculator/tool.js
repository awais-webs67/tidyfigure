const list = $('#loans');
makeList(list, $('#add-loan'), v => `
  <label class="f f-name"><span>Name</span><input data-f="name" type="text" value="${esc(v.name ?? '')}" placeholder="e.g. Bank A"></label>
  <label class="f"><span>Amount</span><input data-f="amt" type="number" inputmode="decimal" min="0" step="any" value="${esc(v.amt ?? '')}"></label>
  <label class="f"><span>Rate % / yr</span><input data-f="rate" type="number" inputmode="decimal" min="0" step="any" value="${esc(v.rate ?? '')}"></label>
  <label class="f"><span>Years</span><input data-f="yrs" type="number" inputmode="decimal" min="0.5" step="any" value="${esc(v.yrs ?? '')}"></label>
  <label class="f"><span>Fees</span><input data-f="fee" type="number" inputmode="decimal" min="0" step="any" value="${esc(v.fee ?? 0)}"></label>
  <button type="button" class="rm" aria-label="Remove this offer">×</button>`,
  [{ name: 'Bank A', amt: 20000, rate: 6.9, yrs: 5, fee: 0 }, { name: 'Bank B', amt: 20000, rate: 5.9, yrs: 5, fee: 500 }, { name: 'Bank C', amt: 20000, rate: 6.9, yrs: 3, fee: 0 }], calc);

const pmt = (P, rate, n) => { const i = rate / 1200; return i ? P * i / (1 - Math.pow(1 + i, -n)) : P / n; };
// APR including fees: the rate at which the payments repay (amount − fees). Found by bisection.
function apr(P, fee, m, n) {
  if (!fee) return null;
  let lo = 0, hi = 200;
  for (let k = 0; k < 80; k++) { const mid = (lo + hi) / 2; (pmt(P - fee, mid, n) > m ? hi = mid : lo = mid); }
  return (lo + hi) / 2;
}
function calc() {
  const loans = $$('.row', list).map((r, i) => ({ name: field(r, 'name').value.trim() || `Offer ${i + 1}`, amt: val(field(r, 'amt')), rate: val(field(r, 'rate')), yrs: val(field(r, 'yrs')), fee: val(field(r, 'fee')) || 0 }))
    .filter(l => l.amt > 0 && l.rate >= 0 && l.yrs > 0);
  const out = $('#out');
  if (!loans.length) { out.innerHTML = '<p class="empty">Enter at least one loan: amount, rate and years.</p>'; return; }
  loans.forEach(l => { l.n = Math.round(l.yrs * 12); l.m = pmt(l.amt, l.rate, l.n); l.interest = l.m * l.n - l.amt; l.cost = l.interest + l.fee; l.apr = apr(l.amt, l.fee, l.m, l.n); });
  const cheapest = loans.reduce((a, b) => (a.cost <= b.cost ? a : b)), lowestPay = loans.reduce((a, b) => (a.m <= b.m ? a : b));
  out.innerHTML = `<p class="kicker">Cheapest overall</p><p class="huge" style="text-align:left"><mark>${esc(cheapest.name)}</mark></p>
    <p class="sub">Total cost of borrowing ${fmt(cheapest.cost)} (interest + fees)${loans.length > 1 ? `, saving ${fmt(Math.max(...loans.map(l => l.cost)) - cheapest.cost)} against the most expensive offer` : ''}.</p>
    <div class="scroll"><table class="tbl"><thead><tr><th>Offer</th><th class="n">Monthly</th><th class="n">Interest</th><th class="n">Fees</th><th class="n">Total cost</th><th class="n">Total repaid</th></tr></thead><tbody>
    ${loans.map(l => `<tr${l === cheapest ? ' style="font-weight:700"' : ''}><td>${esc(l.name)}<br><small class="sub">${fmtMax(l.rate, 3)}% · ${fmtMax(l.yrs, 1)} yr${l.apr ? ` · APR ≈ ${fmt(l.apr, 2)}%` : ''}</small></td><td class="n">${fmt(l.m)}</td><td class="n">${fmt(l.interest)}</td><td class="n">${fmt(l.fee)}</td><td class="n">${fmt(l.cost)}</td><td class="n">${fmt(l.m * l.n + l.fee)}</td></tr>`).join('')}
    </tbody></table></div>
    ${lowestPay !== cheapest ? `<p class="note"><strong>${esc(lowestPay.name)}</strong> has the lowest monthly payment (${fmt(lowestPay.m)}), but costs ${fmt(lowestPay.cost - cheapest.cost)} more in total. A lower payment usually means paying for longer.</p>` : ''}`;
}
calc();
