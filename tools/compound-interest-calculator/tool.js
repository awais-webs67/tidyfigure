onAny('#p, #pm, #r, #y, #n', calc);
function calc() {
  const P = val($('#p')) || 0, PM = val($('#pm')) || 0, r = (val($('#r')) || 0) / 100, Y = Math.min(80, Math.round(val($('#y')) || 0)), n = +$('#n').value;
  const out = $('#out');
  if (!(Y > 0)) { out.innerHTML = '<p class="empty">Enter a number of years.</p>'; return; }
  // Simulate month by month; interest is credited n times a year at the equivalent rate.
  let bal = P, paid = P;
  const rows = [];
  const perMonth = Math.pow(1 + r / n, n / 12) - 1;
  for (let m = 1; m <= Y * 12; m++) {
    bal = bal * (1 + perMonth) + PM; paid += PM;
    if (m % 12 === 0) rows.push({ y: m / 12, bal, paid });
  }
  const interest = bal - paid;
  const max = Math.max(...rows.map(x => x.bal));
  out.innerHTML = `<p class="kicker">Balance after ${Y} years</p><p class="huge" style="text-align:left"><mark>${fmt(bal, 0)}</mark></p>
    <div class="statgrid"><div class="stat"><b>${fmt(paid, 0)}</b><span>You put in</span></div><div class="stat"><b>${fmt(interest, 0)}</b><span>Interest earned</span></div></div>
    <p class="note">Interest makes up <strong>${fmt(interest / bal * 100, 0)}%</strong> of the final balance.</p>`;
  $('#chart-wrap').innerHTML = `<p class="group-title">Growth year by year</p>
    <div style="display:flex;align-items:flex-end;gap:3px;height:180px;margin:8px 0 4px" role="img" aria-label="Balance grows from ${fmt(P, 0)} to ${fmt(bal, 0)}">${rows.map(x => `<div title="Year ${x.y}: ${fmt(x.bal, 0)}" style="flex:1;display:flex;flex-direction:column;justify-content:flex-end;height:100%"><div style="height:${(x.bal - x.paid) / max * 100}%;background:var(--accent);border-radius:2px 2px 0 0"></div><div style="height:${x.paid / max * 100}%;background:var(--slate)"></div></div>`).join('')}</div>
    <p class="note"><span style="color:var(--slate)">■</span> Your contributions · <span style="color:var(--accent)">■</span> Interest</p>
    <div class="scroll"><table class="tbl"><thead><tr><th>Year</th><th class="n">Contributed</th><th class="n">Interest</th><th class="n">Balance</th></tr></thead><tbody>${rows.map(x => `<tr><td>${x.y}</td><td class="n">${fmt(x.paid, 0)}</td><td class="n">${fmt(x.bal - x.paid, 0)}</td><td class="n">${fmt(x.bal, 0)}</td></tr>`).join('')}</tbody></table></div>`;
}
calc();
