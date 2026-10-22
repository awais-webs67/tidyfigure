onAny('input, select', calc);
function calc() {
  const amt = val($('#amt')) || 0, hpw = val($('#hpw')) || 40, dpw = val($('#dpw')) || 5, wpy = val($('#wpy')) || 52, out = $('#out');
  if (!(amt > 0)) { out.innerHTML = '<p class="empty">Enter your pay.</p>'; return; }
  const perYear = { hour: hpw * wpy, day: dpw * wpy, week: wpy, month: 12, year: 1 }[$('#per').value];
  const year = amt * perYear;
  const rows = [['Hourly', year / (hpw * wpy)], ['Daily', year / (dpw * wpy)], ['Weekly', year / wpy], ['Every two weeks', year / wpy * 2], ['Monthly', year / 12], ['Yearly', year]];
  out.innerHTML = `<p class="kicker">Yearly salary</p><p class="huge" style="text-align:left"><mark>${fmt(year, 0)}</mark></p>
    <div class="scroll"><table class="tbl"><tbody>${rows.map(([l, v]) => `<tr><td>${l}</td><td class="n">${fmt(v)}</td></tr>`).join('')}</tbody></table></div>
    <p class="note">Based on ${hpw} hours a week, ${dpw} days a week and ${wpy} paid weeks a year (${fmt(hpw * wpy, 0)} paid hours).</p>`;
}
calc();
