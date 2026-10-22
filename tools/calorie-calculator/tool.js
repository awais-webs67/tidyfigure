const u = bodyUnits(calc);
onAny('#sex, #age, #cm, #kg, #ft, #in, #lb, #act, #goal', calc);
// Mifflin-St Jeor: the most accurate everyday equation for resting energy use.
const bmr = (sex, kg, cm, age) => 10 * kg + 6.25 * cm - 5 * age + (sex === 'm' ? 5 : -161);
function calc() {
  const kg = u.kg(), cm = u.cm(), age = val($('#age')), sex = $('#sex').value, act = +$('#act').value, goal = +$('#goal').value;
  const out = $('#out');
  if (!(kg > 0 && cm > 0 && age > 0)) { out.innerHTML = '<p class="empty">Enter your age, height and weight.</p>'; return; }
  const b = bmr(sex, kg, cm, age), tdee = b * act;
  const target = tdee + goal * 7700 / 7; // about 7,700 kcal per kg of body weight
  const floor = sex === 'm' ? 1500 : 1200;
  const rows = [[-1, 'Lose 1 kg / week'], [-0.5, 'Lose 0.5 kg / week'], [-0.25, 'Lose 0.25 kg / week'], [0, 'Maintain'], [0.25, 'Gain 0.25 kg / week'], [0.5, 'Gain 0.5 kg / week']];
  out.innerHTML = `<p class="kicker">Daily calories for your goal</p><p class="huge" style="text-align:left"><mark>${Math.round(Math.max(target, floor)).toLocaleString()}</mark></p>
    <p class="sub">kcal per day · maintenance is ${Math.round(tdee).toLocaleString()} kcal</p>
    ${target < floor ? `<p class="note"><strong>Raised to ${floor} kcal:</strong> eating less than this without medical supervision makes it hard to get enough nutrients. Choose a slower rate of loss.</p>` : ''}
    <div class="statgrid"><div class="stat"><b>${Math.round(b).toLocaleString()}</b><span>BMR (at rest)</span></div><div class="stat"><b>${Math.round(tdee).toLocaleString()}</b><span>Maintenance (TDEE)</span></div></div>
    <div class="scroll"><table class="tbl"><tbody>${rows.map(([g, l]) => `<tr${g === goal ? ' class="win"' : ''}><td>${l}</td><td class="n">${Math.round(Math.max(tdee + g * 1100, floor)).toLocaleString()} kcal</td></tr>`).join('')}</tbody></table></div>
    <p class="note">An estimate for healthy adults, not medical advice. Talk to a doctor or dietitian before major changes to your diet or exercise, especially if you are pregnant or have a health condition.</p>`;
}
u.sync();
