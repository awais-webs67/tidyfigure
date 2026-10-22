onAny('#m, #r, #y, #step', calc);
function calc() {
  const M = val($('#m')) || 0, r = (val($('#r')) || 0) / 100, Y = Math.round(val($('#y')) || 0), step = (val($('#step')) || 0) / 100;
  const out = $('#out');
  if (!(M > 0 && Y > 0)) { out.innerHTML = '<p class="empty">Enter a monthly amount and number of years.</p>'; return; }
  const i = Math.pow(1 + r, 1 / 12) - 1; // monthly rate equivalent to the yearly return
  let bal = 0, paid = 0, amt = M;
  const rows = [];
  for (let m = 1; m <= Y * 12; m++) {
    bal = (bal + amt) * (1 + i); paid += amt; // invested at the start of each month
    if (m % 12 === 0) { rows.push({ y: m / 12, bal, paid, amt }); amt *= 1 + step; }
  }
  const gain = bal - paid;
  out.innerHTML = `<p class="kicker">Value after ${Y} years</p><p class="huge" style="text-align:left"><mark>${fmt(bal, 0)}</mark></p>
    <div class="statgrid"><div class="stat"><b>${fmt(paid, 0)}</b><span>Total invested</span></div><div class="stat"><b>${fmt(gain, 0)}</b><span>Estimated returns</span></div><div class="stat"><b>${fmt(bal / paid, 2)}×</b><span>Money multiplied</span></div></div>
    <div style="display:flex;height:12px;border-radius:6px;overflow:hidden" aria-hidden="true"><div style="flex:${paid};background:var(--slate)"></div><div style="flex:${Math.max(0, gain)};background:var(--accent)"></div></div>
    <div class="scroll"><table class="tbl"><thead><tr><th>Year</th><th class="n">Monthly SIP</th><th class="n">Invested</th><th class="n">Value</th></tr></thead><tbody>${rows.map(x => `<tr><td>${x.y}</td><td class="n">${fmt(x.amt, 0)}</td><td class="n">${fmt(x.paid, 0)}</td><td class="n">${fmt(x.bal, 0)}</td></tr>`).join('')}</tbody></table></div>
    <p class="note">Returns are not guaranteed. Mutual fund values go up and down, and past performance doesn’t predict future returns.</p>`;
}
calc();
