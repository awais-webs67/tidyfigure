onAny('#age, #exp, #now, #save, #ret, #swr', calc);
function calc() {
  const age = val($('#age')), exp = val($('#exp')), now = val($('#now')) || 0, save = val($('#save')) || 0, r = (val($('#ret')) || 0) / 100, swr = +$('#swr').value / 100;
  const out = $('#out');
  if (!(exp > 0)) { out.innerHTML = '<p class="empty">Enter how much you expect to spend each year.</p>'; return; }
  const target = exp / swr;
  let bal = now, y = 0;
  const rows = [];
  while (bal < target && y < 80) { bal = bal * (1 + r) + save; y++; if (y <= 60) rows.push([y, bal]); }
  const reached = bal >= target;
  const coast = ok(age) && age < 65 ? target / Math.pow(1 + r, 65 - age) : null;
  const step = rows.length > 20 ? 5 : rows.length > 10 ? 2 : 1;
  out.innerHTML = `<p class="kicker">Your FIRE number</p><p class="huge" style="text-align:left"><mark>${fmt(target, 0)}</mark></p>
    <p class="sub">${fmt(exp, 0)} a year ÷ ${fmtMax(swr * 100, 1)}% withdrawal rate = ${fmtMax(1 / swr, 1)}× your yearly spending.</p>
    <div class="statgrid">
      <div class="stat"><b>${now >= target ? 'Now' : reached ? `${y} yr` : '80+ yr'}</b><span>Time to financial independence</span></div>
      <div class="stat"><b>${now >= target ? (ok(age) ? age : '–') : reached && ok(age) ? age + y : '–'}</b><span>Age you reach it</span></div>
      <div class="stat"><b>${fmt(target * 0.7, 0)}</b><span>Lean FIRE (70% spending)</span></div>
      ${coast !== null ? `<div class="stat"><b>${fmt(coast, 0)}</b><span>Coast FIRE number at age ${age}</span></div>` : ''}
    </div>
    ${coast !== null ? `<p class="note">${now >= coast ? `<strong>You’ve reached Coast FIRE.</strong> Even if you stopped investing today, ${fmt(now, 0)} growing at ${fmtMax(r * 100, 2)}% a year would reach ${fmt(target, 0)} by 65.` : `Coast FIRE: with ${fmt(coast, 0)} invested now, growth alone would reach your number by 65, so you could stop saving and just cover your costs.`}</p>` : ''}
    ${rows.length && now < target ? `<div class="scroll"><table class="tbl"><thead><tr><th>Year</th>${ok(age) ? '<th class="n">Age</th>' : ''}<th class="n">Invested</th><th class="n">Progress</th></tr></thead><tbody>
      ${rows.filter((row, i) => (i + 1) % step === 0 || i === rows.length - 1).map(([yr, b]) => `<tr><td>${yr}</td>${ok(age) ? `<td class="n">${age + yr}</td>` : ''}<td class="n">${fmt(b, 0)}</td><td class="n">${Math.min(100, b / target * 100).toFixed(0)}%</td></tr>`).join('')}
    </tbody></table></div>` : ''}
    ${!reached && now < target ? '<p class="note">At this saving rate and return you don’t reach the target within 80 years. Try saving more or spending less.</p>' : ''}`;
}
calc();
