onAny('#want, #costs, #tax, #off, #days, #hours, #bill', calc);
function calc() {
  const want = val($('#want')), costs = val($('#costs')) || 0, tax = Math.min(90, val($('#tax')) || 0) / 100;
  const weeks = 52 - (val($('#off')) || 0), days = val($('#days')), hours = val($('#hours')), bill = (val($('#bill')) || 0) / 100, out = $('#out');
  if (!(want > 0) || !(weeks > 0) || !(days > 0) || !(hours > 0) || !(bill > 0)) { out.innerHTML = '<p class="empty">Fill in your target income and working time.</p>'; return; }
  const revenue = want / (1 - tax) + costs, worked = weeks * days * hours, billable = worked * bill, rate = revenue / billable;
  out.innerHTML = `<p class="kicker">Charge at least</p><p class="huge" style="text-align:left"><mark>${fmt(rate)}</mark> <small style="font-size:18px">/ hour</small></p>
    <p class="sub">${fmt(revenue, 0)} a year in fees ÷ ${fmtMax(billable, 0)} billable hours.</p>
    <div class="statgrid">
      <div class="stat"><b>${fmt(rate * hours, 0)}</b><span>Day rate (${fmtMax(hours, 1)} h)</span></div>
      <div class="stat"><b>${fmt(revenue / weeks, 0)}</b><span>Per working week</span></div>
      <div class="stat"><b>${fmt(revenue / 12, 0)}</b><span>Per month (average)</span></div>
      <div class="stat"><b>${fmtMax(billable / weeks, 1)} h</b><span>Billable hours per week</span></div>
    </div>
    <div class="scroll"><table class="tbl"><tbody>
      <tr><td>Income you keep</td><td class="n">${fmt(want, 0)}</td></tr>
      <tr><td>Tax and contributions (${fmtMax(tax * 100, 1)}% of profit)</td><td class="n">${fmt(want / (1 - tax) - want, 0)}</td></tr>
      <tr><td>Business costs</td><td class="n">${fmt(costs, 0)}</td></tr>
    </tbody><tfoot><tr><td>Fees you must invoice</td><td class="n">${fmt(revenue, 0)}</td></tr></tfoot></table></div>
    <p class="note">At 100% billable you’d need ${fmt(revenue / worked)} an hour, but almost no freelancer bills every working hour. Add a margin on top for slow months and late payers.</p>`;
}
calc();
