const u = bodyUnits(calc);
onAny('#sex, #cm, #ft, #in', calc);
function calc() {
  const cm = u.cm(), m = $('#sex').value === 'm';
  const out = $('#out');
  if (!(cm > 100)) { out.innerHTML = '<p class="empty">Enter your height.</p>'; return; }
  const over = Math.max(0, cm / 2.54 - 60); // inches over 5 feet
  const F = {
    'Robinson (1983)': (m ? 52 : 49) + (m ? 1.9 : 1.7) * over,
    'Miller (1983)': (m ? 56.2 : 53.1) + (m ? 1.41 : 1.36) * over,
    'Devine (1974)': (m ? 50 : 45.5) + 2.3 * over,
    'Hamwi (1964)': (m ? 48 : 45.5) + (m ? 2.7 : 2.2) * over,
  };
  const vals = Object.values(F), avg = vals.reduce((a, b) => a + b, 0) / vals.length;
  const h2 = (cm / 100) ** 2;
  out.innerHTML = `<p class="kicker">Ideal weight (average of 4 formulas)</p><p class="huge" style="text-align:left"><mark>${u.w(avg)}</mark></p>
    <p class="sub">Healthy BMI range for your height: <strong>${u.w(18.5 * h2)} – ${u.w(24.9 * h2)}</strong></p>
    <div class="scroll"><table class="tbl"><tbody>${Object.entries(F).map(([k, v]) => `<tr><td>${k}</td><td class="n">${u.w(v)}</td></tr>`).join('')}</tbody></table></div>
    <p class="note">These formulas give a single reference weight. The healthy BMI range is a better everyday guide, and body composition matters more than any single number.</p>`;
}
u.sync();
