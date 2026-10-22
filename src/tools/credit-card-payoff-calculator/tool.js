onAny('#bal, #apr, #pay', calc);
function simulate(bal, i, pay) {
  let m = 0, interest = 0;
  while (bal > 0.005 && m < 1200) { const int = bal * i; interest += int; bal = bal + int - pay; m++; }
  return { months: m, interest, done: m < 1200 };
}
function calc() {
  const bal = val($('#bal')) || 0, i = (val($('#apr')) || 0) / 100 / 12, pay = val($('#pay')) || 0, out = $('#out');
  if (!(bal > 0 && pay > 0)) { out.innerHTML = '<p class="empty">Enter your balance and monthly payment.</p>'; return; }
  if (pay <= bal * i) { out.innerHTML = `<span class="verdict no">Never paid off</span><p class="sub">The interest each month (${fmt(bal * i)}) is at least as big as your payment, so the balance never falls. Pay at least <strong>${fmt(bal * i * 1.2 + 1)}</strong> a month to make progress.</p>`; return; }
  const s = simulate(bal, i, pay);
  const opts = [pay * 1.25, pay * 1.5, pay * 2].map(p => ({ p, ...simulate(bal, i, p) }));
  const y = Math.floor(s.months / 12), mo = s.months % 12;
  out.innerHTML = `<p class="kicker">Debt-free in</p><p class="huge" style="text-align:left"><mark>${y ? `${y}y ` : ''}${mo}m</mark></p>
    <div class="statgrid"><div class="stat"><b>${fmt(s.interest, 0)}</b><span>Total interest</span></div><div class="stat"><b>${fmt(bal + s.interest, 0)}</b><span>Total paid</span></div></div>
    <p class="kicker" style="margin-top:6px">If you paid more each month</p>
    <div class="scroll"><table class="tbl"><thead><tr><th class="n">Payment</th><th class="n">Time</th><th class="n">Interest</th><th class="n">You save</th></tr></thead><tbody>
      <tr class="win"><td class="n">${fmt(pay, 0)}</td><td class="n">${s.months} mo</td><td class="n">${fmt(s.interest, 0)}</td><td class="n">–</td></tr>
      ${opts.map(o => `<tr><td class="n">${fmt(o.p, 0)}</td><td class="n">${o.months} mo</td><td class="n">${fmt(o.interest, 0)}</td><td class="n">${fmt(s.interest - o.interest, 0)}</td></tr>`).join('')}
    </tbody></table></div>`;
}
calc();
