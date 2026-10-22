// American Council on Exercise body fat categories.
const CATS = { m: [[2, 'Essential fat'], [6, 'Athletes'], [14, 'Fitness'], [18, 'Average'], [25, 'Obese']], f: [[10, 'Essential fat'], [14, 'Athletes'], [21, 'Fitness'], [25, 'Average'], [32, 'Obese']] };
onAny('#sex, #h, #neck, #waist, #hip, #wt, input[name="lu"]', calc);
function calc() {
  const inch = $('input[name="lu"]:checked').value === 'in', k = inch ? 2.54 : 1, m = $('#sex').value === 'm';
  $('#hip-wrap').hidden = m;
  $('#how').textContent = m ? 'Measure the neck just below the Adam’s apple, and the waist at the navel, relaxed. Use the same unit for every measurement.' : 'Measure the neck just below the larynx, the waist at its narrowest point, and the hips at their widest. Use the same unit for every measurement.';
  const h = val($('#h')) * k, neck = val($('#neck')) * k, waist = val($('#waist')) * k, hip = val($('#hip')) * k;
  const out = $('#out');
  const bf = m ? 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(h)) - 450
               : 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(h)) - 450;
  if (!ok(bf) || bf <= 0 || bf > 75) { out.innerHTML = '<p class="empty">Check the measurements: the waist must be larger than the neck, and all values in the same unit.</p>'; return; }
  const cats = CATS[m ? 'm' : 'f'];
  const cat = [...cats].reverse().find(c => bf >= c[0]) || cats[0];
  const wt = val($('#wt'));
  out.innerHTML = `<p class="kicker">Estimated body fat</p><p class="huge" style="text-align:left"><mark>${fmt(bf, 1)}%</mark></p>
    <span class="verdict ${cat[1] === 'Obese' ? 'no' : cat[1] === 'Average' ? 'tight' : 'ok'}">${cat[1]}</span>
    ${wt > 0 ? `<div class="statgrid"><div class="stat"><b>${fmt(wt * bf / 100, 1)}</b><span>Fat mass (same unit as weight)</span></div><div class="stat"><b>${fmt(wt * (1 - bf / 100), 1)}</b><span>Lean mass</span></div></div>` : ''}
    <div class="scroll"><table class="tbl"><thead><tr><th>Category (ACE)</th><th class="n">${m ? 'Men' : 'Women'}</th></tr></thead><tbody>${cats.map((c, i) => `<tr${c === cat ? ' class="win"' : ''}><td>${c[1]}</td><td class="n">${c[0]}${cats[i + 1] ? `–${cats[i + 1][0] - 1}` : '+'}%</td></tr>`).join('')}</tbody></table></div>
    <p class="note">The US Navy method is usually within about 3–4 percentage points of lab measurements.</p>`;
}
calc();
