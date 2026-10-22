const u = bodyUnits(calc);
onAny('#sex, #age, #cm, #kg, #ft, #in, #lb, #bf', calc);
function calc() {
  const kg = u.kg(), cm = u.cm(), age = val($('#age')), m = $('#sex').value === 'm', bf = val($('#bf'));
  const out = $('#out');
  if (!(kg > 0 && cm > 0 && age > 0)) { out.innerHTML = '<p class="empty">Enter your age, height and weight.</p>'; return; }
  const ms = 10 * kg + 6.25 * cm - 5 * age + (m ? 5 : -161);
  const hb = m ? 88.362 + 13.397 * kg + 4.799 * cm - 5.677 * age : 447.593 + 9.247 * kg + 3.098 * cm - 4.330 * age;
  const km = bf > 0 && bf < 70 ? 370 + 21.6 * kg * (1 - bf / 100) : NaN;
  out.innerHTML = `<p class="kicker">Basal metabolic rate</p><p class="huge" style="text-align:left"><mark>${Math.round(ms).toLocaleString()}</mark></p>
    <p class="sub">kcal per day at complete rest (Mifflin-St Jeor)</p>
    <div class="scroll"><table class="tbl"><thead><tr><th>Equation</th><th class="n">kcal / day</th></tr></thead><tbody>
      <tr class="win"><td>Mifflin-St Jeor (recommended)</td><td class="n">${Math.round(ms).toLocaleString()}</td></tr>
      <tr><td>Harris-Benedict (revised 1984)</td><td class="n">${Math.round(hb).toLocaleString()}</td></tr>
      <tr><td>Katch-McArdle (uses body fat)</td><td class="n">${ok(km) ? Math.round(km).toLocaleString() : '<span class="note">add body fat %</span>'}</td></tr>
    </tbody></table></div>
    <p class="kicker" style="margin-top:6px">Calories burned per day by activity</p>
    <div class="scroll"><table class="tbl"><tbody>${[[1.2, 'Sedentary'], [1.375, 'Lightly active'], [1.55, 'Moderately active'], [1.725, 'Very active'], [1.9, 'Extremely active']].map(([f, l]) => `<tr><td>${l} (× ${f})</td><td class="n">${Math.round(ms * f).toLocaleString()} kcal</td></tr>`).join('')}</tbody></table></div>
    <p class="note">An estimate for healthy adults, not medical advice. Talk to a doctor or dietitian before major changes to your diet or exercise, especially if you are pregnant or have a health condition.</p>`;
}
u.sync();
