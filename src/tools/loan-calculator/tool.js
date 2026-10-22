onAny('#p, #r, #t, #tu, #x', calc);

function calc() {
  const P = val($('#p')), rate = val($('#r')) || 0, extra = Math.max(0, val($('#x')) || 0);
  const n = Math.round(($('#tu').value === 'y' ? 12 : 1) * val($('#t')));
  const out = $('#out');
  if (!(P > 0) || !(n > 0) || rate < 0) { out.innerHTML = '<p class="empty">Enter the loan amount, interest rate and term.</p>'; $('#sched').innerHTML = ''; return; }
  const i = rate / 100 / 12;
  const pay = i ? P * i / (1 - Math.pow(1 + i, -n)) : P / n;

  // Month-by-month schedule, grouped into years for the table.
  let bal = P, month = 0, interest = 0;
  const years = [];
  while (bal > 0.005 && month < 1200) {
    const int = bal * i;
    const princ = Math.min(bal, pay + extra - int);
    bal -= princ; interest += int; month++;
    const y = Math.ceil(month / 12);
    if (!years[y - 1]) years[y - 1] = { y, int: 0, princ: 0, bal: 0 };
    years[y - 1].int += int; years[y - 1].princ += princ; years[y - 1].bal = Math.max(0, bal);
  }
  const baseInterest = pay * n - P;
  const saved = baseInterest - interest;
  const share = interest / (P + interest) * 100;

  out.innerHTML = `<p class="kicker">Monthly payment</p><p class="huge" style="text-align:left"><mark>${fmt(pay)}</mark></p>
    ${extra ? `<p class="sub">+ ${fmt(extra)} extra = ${fmt(pay + extra)} a month</p>` : ''}
    <div class="statgrid">
      <div class="stat"><b>${fmt(interest, 0)}</b><span>Total interest</span></div>
      <div class="stat"><b>${fmt(P + interest, 0)}</b><span>Total paid</span></div>
      <div class="stat"><b>${Math.floor(month / 12)}y ${month % 12}m</b><span>Paid off in</span></div>
    </div>
    <div style="display:flex;height:12px;border-radius:6px;overflow:hidden;margin-top:6px" aria-hidden="true"><div style="flex:${P};background:var(--accent)"></div><div style="flex:${interest};background:var(--warn)"></div></div>
    <p class="note"><span style="color:var(--accent)">■</span> Principal ${fmt(100 - share, 0)}% · <span style="color:var(--warn)">■</span> Interest ${fmt(share, 0)}%</p>
    ${extra && saved > 0.5 ? `<p class="note">Paying ${fmt(extra)} extra each month saves <strong>${fmt(saved, 0)}</strong> in interest and finishes <strong>${n - month} months</strong> early.</p>` : ''}`;
  $('#sched').innerHTML = `<thead><tr><th>Year</th><th class="n">Principal paid</th><th class="n">Interest paid</th><th class="n">Balance left</th></tr></thead><tbody>${years.map(r => `<tr><td>${r.y}</td><td class="n">${fmt(r.princ)}</td><td class="n">${fmt(r.int)}</td><td class="n">${fmt(r.bal)}</td></tr>`).join('')}</tbody>`;
}
calc();
