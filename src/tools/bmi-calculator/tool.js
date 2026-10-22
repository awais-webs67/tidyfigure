// WHO adult categories.
const CATS = [[0, 18.5, 'Underweight', 'tight'], [18.5, 25, 'Healthy weight', 'ok'], [25, 30, 'Overweight', 'tight'], [30, 35, 'Obesity class I', 'no'], [35, 40, 'Obesity class II', 'no'], [40, 999, 'Obesity class III', 'no']];
onAny('#cm, #kg, #ft, #in, #lb, input[name="u"]', calc);

function calc() {
  const metric = $('input[name="u"]:checked').value === 'metric';
  $('#metric').hidden = !metric; $('#imperial').hidden = metric;
  const m = metric ? val($('#cm')) / 100 : ((val($('#ft')) || 0) * 12 + (val($('#in')) || 0)) * 0.0254;
  const kg = metric ? val($('#kg')) : val($('#lb')) * 0.45359237;
  const out = $('#out');
  if (!(m > 0.5 && kg > 5)) { out.innerHTML = '<p class="empty">Enter your height and weight.</p>'; return; }
  const bmi = kg / (m * m);
  const [, , name, cls] = CATS.find(c => bmi >= c[0] && bmi < c[1]);
  const lo = 18.5 * m * m, hi = 24.9 * m * m;
  const w = x => metric ? `${fmt(x, 1)} kg` : `${fmt(x / 0.45359237, 0)} lb`;
  // Position on a 15–40 scale for the marker.
  const pos = Math.min(100, Math.max(0, (bmi - 15) / 25 * 100));
  const seg = (a, b, c) => `<div style="flex:${b - a};background:${c}"></div>`;
  let gap = '';
  if (kg < lo) gap = `To reach a healthy BMI you’d gain about <strong>${w(lo - kg)}</strong>.`;
  else if (kg > hi) gap = `To reach a healthy BMI you’d lose about <strong>${w(kg - hi)}</strong>.`;
  out.innerHTML = `<p class="kicker">Your BMI</p><p class="huge" style="text-align:left"><mark>${fmt(bmi, 1)}</mark></p>
    <span class="verdict ${cls}">${name}</span>
    <div style="position:relative;margin:14px 0 4px">
      <div style="display:flex;height:12px;border-radius:6px;overflow:hidden">${seg(15, 18.5, 'var(--c-image)')}${seg(18.5, 25, 'var(--good)')}${seg(25, 30, 'var(--warn)')}${seg(30, 40, 'var(--bad)')}</div>
      <div style="position:absolute;top:-5px;left:calc(${pos}% - 2px);width:4px;height:22px;border-radius:2px;background:var(--ink)"></div>
      <div style="display:flex;justify-content:space-between;font:500 12px var(--f-num);color:var(--muted);margin-top:6px"><span>15</span><span>18.5</span><span>25</span><span>30</span><span>40</span></div>
    </div>
    <p class="sub">Healthy weight for your height: <strong>${w(lo)} – ${w(hi)}</strong>.</p>
    ${gap ? `<p class="note">${gap}</p>` : ''}
    <p class="note">BMI is a screening measure, not a diagnosis. Talk to a doctor about your health.</p>`;
}
calc();
