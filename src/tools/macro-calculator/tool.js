// Protein in g per kg of body weight; fat as a share of calories; carbs fill the rest. Keto caps carbs instead.
const STYLES = { bal: { p: 1.6, f: 0.3 }, hp: { p: 2.2, f: 0.27 }, lc: { p: 2.0, f: 0.45, cMax: 0.2 }, keto: { p: 1.6, f: 0.72, cMax: 0.05 } };
const u = bodyUnits(calc);
onAny('#sex, #age, #cm, #kg, #ft, #in, #lb, #act, #goal, #style, #meals, #own', calc);
function calc() {
  const kg = u.kg(), cm = u.cm(), age = val($('#age')), m = $('#sex').value === 'm';
  const out = $('#out');
  if (!(kg > 0 && cm > 0 && age > 0)) { out.innerHTML = '<p class="empty">Enter your age, height and weight.</p>'; return; }
  const tdee = (10 * kg + 6.25 * cm - 5 * age + (m ? 5 : -161)) * +$('#act').value;
  const own = val($('#own'));
  const kcal = own > 0 ? own : Math.max(m ? 1500 : 1200, tdee + +$('#goal').value);
  const s = STYLES[$('#style').value];
  let p = Math.min(s.p * kg, kcal * 0.4 / 4); // never more than 40% of calories from protein
  let f = kcal * s.f / 9;
  let c = (kcal - p * 4 - f * 9) / 4;
  if (s.cMax !== undefined && c * 4 > kcal * s.cMax) { c = kcal * s.cMax / 4; f = (kcal - p * 4 - c * 4) / 9; }
  const meals = +$('#meals').value;
  const pct = g => Math.round(g / kcal * 100);
  const bar = (n, col) => `<div style="flex:${n};background:${col}"></div>`;
  out.innerHTML = `<p class="kicker">Daily macros for ${Math.round(kcal).toLocaleString()} kcal</p>
    <div class="statgrid">
      <div class="stat"><b>${Math.round(p)} g</b><span>Protein · ${pct(p * 4)}%</span></div>
      <div class="stat"><b>${Math.round(c)} g</b><span>Carbs · ${pct(c * 4)}%</span></div>
      <div class="stat"><b>${Math.round(f)} g</b><span>Fat · ${pct(f * 9)}%</span></div>
    </div>
    <div style="display:flex;height:12px;border-radius:6px;overflow:hidden" aria-hidden="true">${bar(p * 4, 'var(--c-health)')}${bar(c * 4, 'var(--c-random)')}${bar(f * 9, 'var(--accent)')}</div>
    <p class="sub">Per meal (${meals} a day): about <strong>${Math.round(p / meals)} g protein</strong>, ${Math.round(c / meals)} g carbs and ${Math.round(f / meals)} g fat.</p>
    <p class="note">${own > 0 ? 'Using your own calorie target.' : `Based on maintenance of ${Math.round(tdee).toLocaleString()} kcal${+$('#goal').value ? `, ${+$('#goal').value > 0 ? 'plus' : 'minus'} ${Math.abs(+$('#goal').value)} kcal for your goal` : ''}.`}</p>
    <p class="note">An estimate for healthy adults, not medical advice. Talk to a doctor or dietitian before major changes to your diet or exercise, especially if you are pregnant or have a health condition.</p>`;
}
u.sync();
